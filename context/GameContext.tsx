import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { GameState, Survivor, ActivityLogItem, getInitialGameState, simulateStorm, calculateJackpot, shortenWallet } from '../utils/mockData';
import {
  fetchTokenHolders,
  getTokenPrice,
  holdersToSurvivors,
  monitorTokenTransactions,
  createActivityFromTransaction,
  isValidTokenAddress,
  TOKEN_ADDRESS as DEFAULT_TOKEN_ADDRESS,
} from '../utils/solanaRpc';

interface GameContextType {
  gameState: GameState;
  stormCountdown: number;
  isStormActive: boolean;
  isLiveMode: boolean;
  isConnected: boolean;
  tokenAddress: string;
  addSurvivor: (survivor: Survivor) => void;
  triggerStorm: () => void;
  buySurvivor: (amount: number) => void;
  setTokenAddress: (address: string) => void;
  initializeLiveMode: (tokenAddress: string) => Promise<void> | void;
}

const GameContext = createContext<GameContextType | undefined>(undefined);

export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [gameState, setGameState] = useState<GameState>(getInitialGameState());
  const [stormCountdown, setStormCountdown] = useState<number>(60);
  const [isStormActive, setIsStormActive] = useState<boolean>(false);
  const [isLiveMode, setIsLiveMode] = useState<boolean>(false);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [tokenAddress, setTokenAddress] = useState<string>(DEFAULT_TOKEN_ADDRESS);
  const [lastUpdate, setLastUpdate] = useState<number>(Date.now());

  // Storm countdown effect
  useEffect(() => {
    const interval = setInterval(() => {
      setStormCountdown((prev) => {
        if (prev <= 1) {
          setIsStormActive(true);
          return 60;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Handle storm active state
  useEffect(() => {
    if (isStormActive) {
      triggerStorm();
      const timeout = setTimeout(() => {
        setIsStormActive(false);
      }, 2000);
      return () => clearTimeout(timeout);
    }
  }, [isStormActive]);

  // Initialize live mode with real Solana data
  const initializeLiveMode = useCallback(async (tokenAddr: string): Promise<void> => {
    if (!isValidTokenAddress(tokenAddr)) {
      console.error('Invalid token address');
      setIsConnected(false);
      return;
    }

    try {
      setIsConnected(true);
      setIsLiveMode(true);
      setTokenAddress(tokenAddr);

      // Fetch initial holders
      const holders = await fetchTokenHolders(tokenAddr);
      const price = await getTokenPrice(tokenAddr);
      const survivors = holdersToSurvivors(holders, price);

      setGameState((prev) => ({
        ...prev,
        survivors,
        totalJackpot: calculateJackpot(survivors),
        activityLog: [
          {
            id: 'live-start',
            type: 'storm' as const,
            message: `🔴 LIVE MODE ACTIVATED - Connected to ${survivors.length} real holders`,
            timestamp: Date.now(),
          },
          ...prev.activityLog,
        ],
      }));

      setLastUpdate(Date.now());

      // Start monitoring transactions
      const unsubscribe = await monitorTokenTransactions(
        tokenAddr,
        (event) => {
          // Add activity for transaction
          const activity = createActivityFromTransaction(event);
          setGameState((prev) => ({
            ...prev,
            activityLog: [activity, ...prev.activityLog].slice(0, 50),
          }));

          // If it's a buy, add new survivor
          if (event.type === 'buy') {
            addSurvivor({
              id: `survivor-${event.signature}`,
              walletAddress: event.wallet,
              tokenAmount: event.amount,
              usdValue: event.amount * price,
              status: 'alive',
              buyInAmount: event.amount * price,
              timestamp: event.timestamp,
              entryTime: new Date(event.timestamp).toLocaleTimeString(),
              extraLives: event.amount >= 50000 ? 1 : 0,
            });
          }
        }
      );

      // Refresh holder data periodically
      const refreshInterval = setInterval(async () => {
        try {
          const newHolders = await fetchTokenHolders(tokenAddr);
          const newPrice = await getTokenPrice(tokenAddr);
          const newSurvivors = holdersToSurvivors(newHolders, newPrice);

          setGameState((prev) => ({
            ...prev,
            survivors: newSurvivors,
            totalJackpot: calculateJackpot(newSurvivors),
          }));

          setLastUpdate(Date.now());
        } catch (error) {
          console.error('Error refreshing holders:', error);
        }
      }, 15000); // Every 15 seconds

      return () => {
        clearInterval(refreshInterval);
      };
    } catch (error) {
      console.error('Failed to initialize live mode:', error);
      setIsConnected(false);
      setIsLiveMode(false);
    }
  }, []);

  const triggerStorm = useCallback(() => {
    setGameState((prev) => {
      if (prev.survivors.length === 0) return prev;

      const result = simulateStorm(prev.survivors, prev.eliminated, prev.activityLog);

      const newGameState: GameState = {
        ...prev,
        survivors: result.survivors,
        eliminated: result.eliminated,
        stormCount: prev.stormCount + 1,
        activityLog: result.log.slice(0, 50),
        totalJackpot: calculateJackpot(result.survivors),
        lastStormTime: Date.now(),
      };

      return newGameState;
    });
  }, []);

  const addSurvivor = useCallback((survivor: Survivor) => {
    setGameState((prev) => {
      const newSurvivors = [...prev.survivors, survivor];
      const newLog: ActivityLogItem[] = [
        {
          id: `new-${Date.now()}`,
          type: 'new_survivor',
          message: `✨ ${shortenWallet(survivor.walletAddress)} entered with ${survivor.tokenAmount.toLocaleString()} tokens`,
          timestamp: Date.now(),
          walletAddress: survivor.walletAddress,
        },
        ...prev.activityLog,
      ];

      return {
        ...prev,
        survivors: newSurvivors,
        activityLog: newLog.slice(0, 50),
        totalJackpot: calculateJackpot(newSurvivors),
      };
    });
  }, []);

  const buySurvivor = useCallback((amount: number) => {
    const tokenAmount = Math.floor(amount / 0.0001);
    const newSurvivor: Survivor = {
      id: `survivor-${Date.now()}`,
      walletAddress: `Sv${Math.random().toString(36).substring(2, 9).toUpperCase()}`,
      tokenAmount,
      usdValue: amount,
      status: 'alive',
      buyInAmount: amount,
      timestamp: Date.now(),
      entryTime: new Date().toLocaleTimeString(),
      extraLives: tokenAmount >= 50000 ? 1 : 0,
    };

    addSurvivor(newSurvivor);
  }, [addSurvivor]);

  return (
    <GameContext.Provider value={{ gameState, stormCountdown, isStormActive, isLiveMode, isConnected, tokenAddress, addSurvivor, triggerStorm, buySurvivor, setTokenAddress, initializeLiveMode }}>
      {children}
    </GameContext.Provider>
  );
};

export const useGame = (): GameContextType => {
  const context = useContext(GameContext);
  if (!context) {
    throw new Error('useGame must be used within GameProvider');
  }
  return context;
};
