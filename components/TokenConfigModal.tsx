import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../context/GameContext';
import { isValidTokenAddress } from '../utils/solanaRpc';

interface TokenConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TokenConfigModal: React.FC<TokenConfigModalProps> = ({ isOpen, onClose }) => {
  const { tokenAddress, setTokenAddress, initializeLiveMode, isConnected, isLiveMode } = useGame();
  const [inputValue, setInputValue] = useState(tokenAddress);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleValidate = () => {
    if (!inputValue.trim()) {
      setError('Please enter a token address');
      return;
    }

    if (!isValidTokenAddress(inputValue)) {
      setError('Invalid Solana token address format');
      return;
    }

    setError('');
    return true;
  };

  const handleActivateLiveMode = async () => {
    if (!handleValidate()) return;

    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      await initializeLiveMode(inputValue);
      setSuccess('✓ Live mode activated! Fetching real token holders...');
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      setError('Failed to initialize live mode. Check token address and try again.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-void-light border-2 border-cyan p-8 md:p-12 rounded-lg max-w-2xl w-full"
            initial={{ scale: 0.5, opacity: 0, y: -50 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.5, opacity: 0 }}
            transition={{ type: 'spring', damping: 25 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="mb-6">
              <h2 className="font-orbitron text-2xl md:text-3xl font-bold text-cyan mb-2">
                🔴 LIVE MODE CONFIG
              </h2>
              <p className="text-sm text-cyan/60 font-space-mono">
                Connect your Pump.fun token to enable real holder tracking on Solana mainnet
              </p>
            </div>

            {/* Status */}
            {isLiveMode && isConnected && (
              <motion.div
                className="p-4 bg-neon-green/20 border border-neon-green/50 rounded-lg mb-6"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <p className="text-sm text-neon-green font-space-mono">
                  ✓ Live mode is active. Connected to real token holders.
                </p>
              </motion.div>
            )}

            {/* Input Section */}
            <div className="mb-6">
              <label className="block font-space-mono text-sm text-cyan/80 mb-3">
                TOKEN MINT ADDRESS
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => {
                    setInputValue(e.target.value);
                    setError('');
                    setSuccess('');
                  }}
                  placeholder="Enter your SPL token mint address (44 characters)"
                  className="w-full px-4 py-3 bg-void-dark border-2 border-cyan/30 text-cyan font-space-mono text-sm rounded-lg focus:outline-none focus:border-cyan transition-colors"
                  disabled={isLoading}
                />
                {isValidTokenAddress(inputValue) && !isLoading && (
                  <motion.div
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-neon-green text-lg"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                  >
                    ✓
                  </motion.div>
                )}
              </div>

              {/* Format Help */}
              <p className="text-xs text-cyan/50 mt-2 font-space-mono">
                Format: 44-character base58 string (e.g., EPjFWaLb3odccccLFf...)
              </p>
            </div>

            {/* Example Addresses */}
            <div className="mb-6 p-4 bg-void-dark/50 rounded-lg border border-cyan/20">
              <p className="text-xs text-cyan/60 font-space-mono mb-2">HOW TO GET YOUR TOKEN ADDRESS:</p>
              <ol className="text-xs text-cyan/70 font-space-mono space-y-1">
                <li>1. Go to your token on pump.fun</li>
                <li>2. Click "Explorer" to open Solscan</li>
                <li>3. Copy the "Token Mint" address</li>
                <li>4. Paste it here</li>
              </ol>
            </div>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  className="p-4 bg-magenta/20 border border-magenta/50 rounded-lg mb-6"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <p className="text-sm text-magenta font-space-mono">
                    ⚠️ {error}
                  </p>
                </motion.div>
              )}

              {success && (
                <motion.div
                  className="p-4 bg-neon-green/20 border border-neon-green/50 rounded-lg mb-6"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <p className="text-sm text-neon-green font-space-mono">
                    {success}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Info Box */}
            <div className="p-4 bg-purple/10 border border-purple/30 rounded-lg mb-6">
              <p className="text-xs text-purple font-space-mono leading-relaxed">
                ⚡ Live mode uses Solana's free RPC to query real token holders.
                Your survivors will be actual wallet addresses holding your token.
                Buys and sells are tracked in real-time!
              </p>
            </div>

            {/* Buttons */}
            <div className="flex gap-3">
              <motion.button
                onClick={handleActivateLiveMode}
                disabled={isLoading || !isValidTokenAddress(inputValue)}
                className="flex-1 px-6 py-3 font-orbitron font-bold text-sm uppercase tracking-wider border-2 border-cyan/50 bg-cyan/10 text-cyan rounded-lg hover:border-cyan hover:bg-cyan/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                whileHover={{ scale: isLoading || !isValidTokenAddress(inputValue) ? 1 : 1.05 }}
                whileTap={{ scale: isLoading || !isValidTokenAddress(inputValue) ? 1 : 0.95 }}
              >
                {isLoading ? (
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  >
                    ⟳
                  </motion.span>
                ) : (
                  '→ ACTIVATE LIVE MODE'
                )}
              </motion.button>

              <motion.button
                onClick={onClose}
                disabled={isLoading}
                className="flex-1 px-6 py-3 font-orbitron font-bold text-sm uppercase tracking-wider border-2 border-magenta/30 bg-magenta/10 text-magenta rounded-lg hover:border-magenta hover:bg-magenta/20 disabled:opacity-50 transition-all"
                whileHover={{ scale: isLoading ? 1 : 1.05 }}
                whileTap={{ scale: isLoading ? 1 : 0.95 }}
              >
                USE MOCK DATA
              </motion.button>
            </div>

            {/* Status Indicator */}
            <div className="mt-6 pt-6 border-t border-cyan/20 flex items-center justify-between">
              <span className="text-xs text-cyan/60 font-space-mono">CONNECTION STATUS:</span>
              <div className="flex items-center gap-2">
                <motion.div
                  className={`w-2 h-2 rounded-full ${isConnected && isLiveMode ? 'bg-neon-green' : 'bg-magenta'}`}
                  animate={{
                    scale: isConnected && isLiveMode ? [1, 1.2, 1] : 1,
                  }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                <span className={`text-xs font-space-mono ${isConnected && isLiveMode ? 'text-neon-green' : 'text-magenta'}`}>
                  {isConnected && isLiveMode ? 'LIVE CONNECTED' : 'OFFLINE - MOCK DATA'}
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TokenConfigModal;
