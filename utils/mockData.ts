// Mock data structure for realistic token holder data
// This can be replaced with real Pump.fun API data later

export interface Survivor {
  id: string;
  walletAddress: string;
  tokenAmount: number;
  usdValue: number;
  status: 'alive' | 'eliminated' | 'protected';
  buyInAmount: number;
  timestamp: number;
  entryTime: string;
  extraLives: number;
}

export interface ActivityLogItem {
  id: string;
  type: 'eliminated' | 'new_survivor' | 'jackpot_increase' | 'survived' | 'storm' | 'protected';
  message: string;
  timestamp: number;
  walletAddress?: string;
  amount?: number;
}

export interface GameState {
  survivors: Survivor[];
  eliminated: Survivor[];
  totalJackpot: number;
  stormCount: number;
  activityLog: ActivityLogItem[];
  nextStormIn: number;
  lastStormTime: number;
}

// Generate random wallet addresses
export const generateWalletAddress = (): string => {
  const chars = '123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz';
  let address = '';
  for (let i = 0; i < 44; i++) {
    address += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return address;
};

// Generate initial mock survivors (realistic for pump.fun)
export const generateInitialSurvivors = (count: number = 150): Survivor[] => {
  const survivors: Survivor[] = [];
  
  const tokenPrices = [0.00015, 0.00018, 0.00021, 0.00025, 0.00032, 0.00048];
  
  for (let i = 0; i < count; i++) {
    const tokenAmount = Math.floor(Math.random() * 500000) + 10000;
    const pricePerToken = tokenPrices[Math.floor(Math.random() * tokenPrices.length)];
    const usdValue = tokenAmount * pricePerToken;
    
    // Determine extra lives based on holdings
    let extraLives = 0;
    if (tokenAmount >= 100000) extraLives = 3;
    else if (tokenAmount >= 500000) extraLives = 2;
    else if (tokenAmount >= 50000) extraLives = 1;
    
    survivors.push({
      id: `survivor-${i}`,
      walletAddress: generateWalletAddress(),
      tokenAmount,
      usdValue,
      status: 'alive',
      buyInAmount: usdValue,
      timestamp: Date.now() - Math.floor(Math.random() * 86400000),
      entryTime: new Date(Date.now() - Math.floor(Math.random() * 86400000)).toLocaleTimeString(),
      extraLives,
    });
  }
  
  return survivors.sort((a, b) => b.tokenAmount - a.tokenAmount);
};

// Calculate jackpot
export const calculateJackpot = (survivors: Survivor[]): number => {
  return survivors.reduce((acc, survivor) => {
    if (survivor.status === 'alive') {
      return acc + survivor.buyInAmount * 0.05; // 5% of buys goes to jackpot
    }
    return acc;
  }, 0);
};

// Simulate a storm - eliminate random survivors
export const simulateStorm = (
  survivors: Survivor[],
  eliminated: Survivor[],
  activityLog: ActivityLogItem[]
): { survivors: Survivor[]; eliminated: Survivor[]; log: ActivityLogItem[] } => {
  const aliveSurvivors = survivors.filter(s => s.status === 'alive');
  const toEliminate = Math.floor(aliveSurvivors.length * (0.05 + Math.random() * 0.1)); // 5-15% per storm
  
  const selectedForElimination = aliveSurvivors.sort(() => Math.random() - 0.5).slice(0, toEliminate);
  
  const newSurvivors = survivors.map(s => {
    const willEliminate = selectedForElimination.find(e => e.id === s.id);
    if (willEliminate && s.extraLives > 0) {
      return { ...s, extraLives: s.extraLives - 1 };
    }
    if (willEliminate) {
      return { ...s, status: 'eliminated' as const };
    }
    return s;
  });

  const actuallyEliminated = newSurvivors.filter(
    s => s.status === 'eliminated' && !eliminated.some(e => e.id === s.id)
  );
  
  const newEliminated = [...eliminated, ...actuallyEliminated];
  
  const newLog: ActivityLogItem[] = [
    {
      id: `storm-${Date.now()}`,
      type: 'storm',
      message: `⚡ STORM STRUCK! ${actuallyEliminated.length} wallets eliminated`,
      timestamp: Date.now(),
    },
    ...activityLog,
  ];

  if (actuallyEliminated.length > 0) {
    actuallyEliminated.forEach(wallet => {
      newLog.unshift({
        id: `elim-${wallet.id}`,
        type: 'eliminated',
        message: `❌ ${wallet.walletAddress.slice(0, 6)}...${wallet.walletAddress.slice(-4)} was eliminated`,
        timestamp: Date.now(),
        walletAddress: wallet.walletAddress,
      });
    });
  }
  
  return {
    survivors: newSurvivors.filter(s => s.status === 'alive'),
    eliminated: newEliminated,
    log: newLog,
  };
};

// Format numbers for display
export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toFixed(0);
};

// Format USD values
export const formatUSD = (num: number): string => {
  return `$${formatNumber(num)}`;
};

// Shorten wallet address
export const shortenWallet = (address: string): string => {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
};

// Get initial game state
export const getInitialGameState = (): GameState => {
  const survivors = generateInitialSurvivors(150);
  return {
    survivors,
    eliminated: [],
    totalJackpot: calculateJackpot(survivors),
    stormCount: 0,
    activityLog: [
      {
        id: '1',
        type: 'new_survivor',
        message: 'Game initialized with 150 survivors',
        timestamp: Date.now(),
      },
    ],
    nextStormIn: 60,
    lastStormTime: Date.now(),
  };
};
