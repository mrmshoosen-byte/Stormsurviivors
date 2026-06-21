import {
  Connection,
  PublicKey,
  ParsedAccountData,
} from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { Survivor, ActivityLogItem } from './mockData';

// Configuration
const SOLANA_RPC = 'https://api.mainnet-beta.solana.com';
const connection = new Connection(SOLANA_RPC, 'confirmed');

// IMPORTANT: Replace with your actual token address
export const TOKEN_ADDRESS = process.env.NEXT_PUBLIC_TOKEN_ADDRESS || 'YOUR_TOKEN_ADDRESS_HERE';

interface TokenHolder {
  address: string;
  tokenAmount: number;
  decimals: number;
}

interface TransactionEvent {
  type: 'buy' | 'sell';
  wallet: string;
  amount: number;
  timestamp: number;
  signature: string;
}

let lastCheckedSignature = '';
const processedSignatures = new Set<string>();

/**
 * Fetch all token holders for a given mint address
 * Uses Solana's getProgramAccounts to find all token accounts
 */
export const fetchTokenHolders = async (tokenMint?: string): Promise<TokenHolder[]> => {
  try {
    const mint = new PublicKey(tokenMint || TOKEN_ADDRESS);
    const holders: TokenHolder[] = [];

    // Get all token accounts for this mint
    const accounts = await connection.getProgramAccounts(
      TOKEN_PROGRAM_ID,
      {
        filters: [
          { dataSize: 165 },
          { memcmp: { offset: 0, bytes: mint.toBase58() } },
        ],
      }
    );

    // Parse token account data
    for (const account of accounts) {
      try {
        const parsedData = account.account.data;
        
        // Token account structure (simplified)
        const owner = new PublicKey(parsedData.slice(32, 64));
        const amountBuffer = parsedData.slice(64, 72);
        const amount = Number(
          amountBuffer.readBigUInt64LE()
        );

        if (amount > 0) {
          holders.push({
            address: owner.toBase58(),
            tokenAmount: amount,
            decimals: 6, // Standard for most tokens
          });
        }
      } catch (e) {
        continue;
      }
    }

    // Sort by amount descending
    return holders.sort((a, b) => b.tokenAmount - a.tokenAmount);
  } catch (error) {
    console.error('Error fetching token holders:', error);
    return [];
  }
};

/**
 * Get the current token price estimate from transaction history
 */
export const getTokenPrice = async (tokenMint?: string): Promise<number> => {
  try {
    const mint = new PublicKey(tokenMint || TOKEN_ADDRESS);
    
    // Estimate price by looking at recent swaps on Raydium/Orca
    // For now, return a default estimate
    // In production, you'd query DEX data
    return 0.0001; // 0.01 cents per token
  } catch (error) {
    console.error('Error getting token price:', error);
    return 0.00001;
  }
};

/**
 * Monitor for new transactions (buys/sells)
 * Returns detected buy/sell events
 */
export const monitorTokenTransactions = async (
  tokenMint?: string,
  onTransactionDetected?: (event: TransactionEvent) => void
): Promise<TransactionEvent[]> => {
  try {
    const mint = new PublicKey(tokenMint || TOKEN_ADDRESS);
    const events: TransactionEvent[] = [];

    // Get recent transactions for the token mint
    const signatures = await connection.getSignaturesForAddress(mint, {
      limit: 50,
    });

    for (const sig of signatures) {
      // Skip if already processed
      if (processedSignatures.has(sig.signature)) {
        continue;
      }

      processedSignatures.add(sig.signature);
      lastCheckedSignature = sig.signature;

      try {
        const transaction = await connection.getParsedTransaction(sig.signature, 'confirmed');

        if (!transaction?.meta?.postTokenBalances) {
          continue;
        }

        // Analyze token balance changes
        const preBalances = transaction.meta.preTokenBalances || [];
        const postBalances = transaction.meta.postTokenBalances || [];

        for (const postBalance of postBalances) {
          const preBalance = preBalances.find(
            (b) => b.accountIndex === postBalance.accountIndex
          );

          const preAmount = preBalance
            ? Number(preBalance.uiTokenAmount?.amount || 0)
            : 0;
          const postAmount = Number(postBalance.uiTokenAmount?.amount || 0);
          const difference = postAmount - preAmount;

          if (difference !== 0) {
            const event: TransactionEvent = {
              type: difference > 0 ? 'buy' : 'sell',
              wallet: postBalance.owner || 'unknown',
              amount: Math.abs(difference),
              timestamp: (transaction.blockTime || 0) * 1000,
              signature: sig.signature,
            };

            events.push(event);

            if (onTransactionDetected) {
              onTransactionDetected(event);
            }
          }
        }
      } catch (e) {
        console.warn('Error processing transaction:', sig.signature);
        continue;
      }
    }

    return events;
  } catch (error) {
    console.error('Error monitoring transactions:', error);
    return [];
  }
};

/**
 * Convert token holders to survivor format
 */
export const holdersToSurvivors = (
  holders: TokenHolder[],
  tokenPrice: number
): Survivor[] => {
  return holders.map((holder, index) => {
    const tokenAmount = holder.tokenAmount;
    const usdValue = (tokenAmount / Math.pow(10, holder.decimals)) * tokenPrice;

    // Calculate extra lives based on holdings
    let extraLives = 0;
    if (tokenAmount >= 50000 * Math.pow(10, holder.decimals)) extraLives = 1;
    if (tokenAmount >= 500000 * Math.pow(10, holder.decimals)) extraLives = 2;
    if (tokenAmount >= 1000000 * Math.pow(10, holder.decimals)) extraLives = 3;

    return {
      id: `survivor-${holder.address}`,
      walletAddress: holder.address,
      tokenAmount,
      usdValue,
      status: 'alive' as const,
      buyInAmount: usdValue,
      timestamp: Date.now() - Math.random() * 86400000,
      entryTime: new Date(
        Date.now() - Math.random() * 86400000
      ).toLocaleTimeString(),
      extraLives,
    };
  });
};

/**
 * Track holder balance changes (for detecting sells)
 */
export const trackHolderBalanceChanges = async (
  previousHolders: Survivor[],
  newHolders: Survivor[]
): Promise<{ eliminated: Survivor[]; reduced: Survivor[] }> => {
  const eliminated: Survivor[] = [];
  const reduced: Survivor[] = [];

  previousHolders.forEach((prev) => {
    const current = newHolders.find(
      (n) => n.walletAddress === prev.walletAddress
    );

    if (!current) {
      // Holder no longer in top list or sold everything
      eliminated.push(prev);
    } else if (current.tokenAmount < prev.tokenAmount) {
      // Holder balance decreased
      if (current.extraLives < prev.extraLives) {
        reduced.push(current);
      } else {
        eliminated.push(prev);
      }
    }
  });

  return { eliminated, reduced };
};

/**
 * Create activity log entry for transaction event
 */
export const createActivityFromTransaction = (
  event: TransactionEvent
): ActivityLogItem => {
  const shortAddress = `${event.wallet.slice(0, 6)}...${event.wallet.slice(-4)}`;
  
  if (event.type === 'buy') {
    return {
      id: `tx-${event.signature}`,
      type: 'new_survivor',
      message: `✨ ${shortAddress} bought ${(event.amount / 1000000).toFixed(0)}M tokens - ENTERED THE GAME`,
      timestamp: event.timestamp,
      walletAddress: event.wallet,
      amount: event.amount,
    };
  } else {
    return {
      id: `tx-${event.signature}`,
      type: 'eliminated',
      message: `💀 ${shortAddress} SOLD their tokens - ELIMINATED FROM GAME`,
      timestamp: event.timestamp,
      walletAddress: event.wallet,
      amount: event.amount,
    };
  }
};

/**
 * Validate token address format
 */
export const isValidTokenAddress = (address: string): boolean => {
  try {
    new PublicKey(address);
    return true;
  } catch {
    return false;
  }
};

/**
 * Get token metadata
 */
export const getTokenMetadata = async (tokenMint?: string) => {
  try {
    const mint = new PublicKey(tokenMint || TOKEN_ADDRESS);
    const account = await connection.getAccountInfo(mint);

    return {
      address: mint.toBase58(),
      exists: account !== null,
      owner: account?.owner.toBase58(),
      executable: account?.executable,
    };
  } catch (error) {
    console.error('Error fetching token metadata:', error);
    return null;
  }
};

/**
 * Stream real-time holder updates (polling)
 */
export const startHolderMonitoring = async (
  tokenMint: string,
  onUpdate: (holders: Survivor[]) => void,
  intervalMs: number = 15000 // 15 seconds
) => {
  const fetchAndUpdate = async () => {
    try {
      const holders = await fetchTokenHolders(tokenMint);
      const price = await getTokenPrice(tokenMint);
      const survivors = holdersToSurvivors(holders, price);

      onUpdate(survivors);
    } catch (error) {
      console.error('Error in holder monitoring:', error);
    }
  };

  // Initial fetch
  await fetchAndUpdate();

  // Set up polling
  const interval = setInterval(fetchAndUpdate, intervalMs);

  // Return cleanup function
  return () => clearInterval(interval);
};
