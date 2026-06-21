import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { isValidTokenAddress } from '../utils/solanaRpc';

interface LiveStatusIndicatorProps {
  tokenAddress: string;
  isConnected: boolean;
  holderCount: number;
  lastUpdate: number;
}

const LiveStatusIndicator: React.FC<LiveStatusIndicatorProps> = ({
  tokenAddress,
  isConnected,
  holderCount,
  lastUpdate,
}) => {
  const [isValidAddress, setIsValidAddress] = useState(false);
  const [timeSinceUpdate, setTimeSinceUpdate] = useState('now');

  useEffect(() => {
    setIsValidAddress(isValidTokenAddress(tokenAddress));
  }, [tokenAddress]);

  useEffect(() => {
    const timer = setInterval(() => {
      const seconds = Math.floor((Date.now() - lastUpdate) / 1000);
      if (seconds < 60) {
        setTimeSinceUpdate(`${seconds}s ago`);
      } else {
        setTimeSinceUpdate(`${Math.floor(seconds / 60)}m ago`);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [lastUpdate]);

  const statusColor = isConnected ? 'neon-green' : 'magenta';
  const statusText = isConnected ? 'LIVE' : 'OFFLINE';

  return (
    <motion.div
      className="fixed top-4 right-4 z-40"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className={`glow-card p-4 border-${statusColor}/50 rounded-lg max-w-sm`}>
        {/* Status Row */}
        <div className="flex items-center gap-3 mb-3">
          <motion.div
            className={`w-3 h-3 rounded-full bg-${statusColor}`}
            animate={{
              scale: isConnected ? [1, 1.2, 1] : 1,
              opacity: isConnected ? [1, 0.6, 1] : 0.5,
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
            }}
          />
          <span className={`font-orbitron font-bold text-sm text-${statusColor}`}>
            {statusText}
          </span>
        </div>

        {/* Token Address */}
        {isValidAddress && (
          <>
            <div className="text-xs text-cyan/70 font-space-mono mb-2 break-all">
              {tokenAddress.slice(0, 8)}...{tokenAddress.slice(-8)}
            </div>

            {/* Holder Count */}
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="text-cyan/60">HOLDERS:</span>
              <motion.span
                className="font-orbitron font-bold text-cyan"
                key={holderCount}
                initial={{ scale: 1.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {holderCount}
              </motion.span>
            </div>

            {/* Last Update */}
            <div className="flex items-center justify-between text-xs">
              <span className="text-cyan/60">UPDATED:</span>
              <span className="text-cyan">{timeSinceUpdate}</span>
            </div>
          </>
        )}

        {!isValidAddress && (
          <div className="text-xs text-magenta">
            ⚠️ Invalid token address. Update .env.local
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default LiveStatusIndicator;
