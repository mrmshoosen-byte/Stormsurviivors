import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../context/GameContext';
import { shortenWallet, formatNumber } from '../utils/mockData';
import { itemVariants, containerVariants, eliminateVariants } from '../utils/animations';

const SurvivorFeed: React.FC = () => {
  const { gameState } = useGame();
  const [sortBy, setSortBy] = useState<'tokens' | 'recent' | 'lives'>('tokens');

  const sortedSurvivors = [...gameState.survivors].sort((a, b) => {
    switch (sortBy) {
      case 'tokens':
        return b.tokenAmount - a.tokenAmount;
      case 'lives':
        return b.extraLives - a.extraLives;
      case 'recent':
        return b.timestamp - a.timestamp;
      default:
        return 0;
    }
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'alive':
        return 'text-cyan';
      case 'protected':
        return 'text-neon-green';
      case 'eliminated':
        return 'text-magenta';
      default:
        return 'text-cyan';
    }
  };

  const getStatusBg = (status: string) => {
    switch (status) {
      case 'alive':
        return 'bg-cyan/10 border-cyan/50';
      case 'protected':
        return 'bg-neon-green/10 border-neon-green/50';
      case 'eliminated':
        return 'bg-magenta/10 border-magenta/50';
      default:
        return 'bg-cyan/10 border-cyan/50';
    }
  };

  const topSurvivors = [...gameState.survivors]
    .sort((a, b) => b.tokenAmount - a.tokenAmount)
    .slice(0, 10);

  return (
    <section className="relative py-16 md:py-24">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          {/* Header */}
          <div className="mb-12">
            <h2 className="font-orbitron text-3xl md:text-4xl font-bold text-cyan mb-4">
              ▸ SURVIVOR LEADERBOARD
            </h2>
            <p className="text-sm md:text-base text-cyan/60 font-space-mono">
              {gameState.survivors.length} survivors remaining | {gameState.eliminated.length} eliminated
            </p>
          </div>

          {/* Sort buttons */}
          <div className="flex flex-wrap gap-2 mb-8">
            {(['tokens', 'lives', 'recent'] as const).map((option) => (
              <motion.button
                key={option}
                className={`px-4 py-2 rounded-lg font-space-mono text-sm transition-all ${
                  sortBy === option
                    ? 'bg-cyan/30 border border-cyan text-cyan shadow-glow-cyan'
                    : 'bg-void-light/50 border border-cyan/20 text-cyan/60 hover:border-cyan/40'
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setSortBy(option)}
              >
                {option === 'tokens' && '💎 Tokens'}
                {option === 'lives' && '❤️ Lives'}
                {option === 'recent' && '⏰ Recent'}
              </motion.button>
            ))}
          </div>

          {/* Top 10 Survivors Highlight */}
          <motion.div
            className="mb-12 glow-card p-6 md:p-8 border-magenta/40"
            variants={itemVariants}
          >
            <h3 className="font-orbitron text-lg md:text-xl font-bold text-magenta mb-6">
              🏆 TOP 10 HOLDERS
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {topSurvivors.map((survivor, index) => (
                <motion.div
                  key={survivor.id}
                  className="flex items-center gap-4 p-4 bg-void-dark/50 rounded-lg border border-magenta/30"
                  whileHover={{ scale: 1.02, borderColor: '#ff006e' }}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  viewport={{ once: true }}
                >
                  <div className="text-2xl font-orbitron text-magenta font-bold w-8">
                    #{index + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-space-mono text-xs text-cyan/80 truncate">
                      {shortenWallet(survivor.walletAddress)}
                    </p>
                    <p className="text-sm font-orbitron text-magenta">
                      {formatNumber(survivor.tokenAmount)} 🪙
                    </p>
                  </div>
                  {survivor.extraLives > 0 && (
                    <div className="flex gap-1">
                      {[...Array(survivor.extraLives)].map((_, i) => (
                        <span key={i} className="text-neon-green text-lg">❤️</span>
                      ))}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* All Survivors List */}
          <motion.div
            className="glow-card p-6 md:p-8 border-cyan/40"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="font-orbitron text-lg md:text-xl font-bold text-cyan mb-6">
              ▸ ALL SURVIVORS ({gameState.survivors.length})
            </h3>

            <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
              <AnimatePresence mode="popLayout">
                {sortedSurvivors.map((survivor, index) => (
                  <motion.div
                    key={survivor.id}
                    className={`survivor-item flex items-center justify-between p-3 rounded-lg transition-all ${getStatusBg(
                      survivor.status
                    )} ${survivor.status === 'eliminated' ? 'eliminated' : ''}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 100 }}
                    transition={{ delay: index * 0.02 }}
                    custom={index}
                  >
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <span className="text-lg">
                        {survivor.status === 'alive' && '✓'}
                        {survivor.status === 'protected' && '🛡️'}
                        {survivor.status === 'eliminated' && '✗'}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="font-space-mono text-xs truncate text-cyan/80">
                          {shortenWallet(survivor.walletAddress)}
                        </p>
                        <p className="text-xs text-cyan/50">
                          {formatNumber(survivor.tokenAmount)} 🪙 • ${survivor.buyInAmount.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      {survivor.extraLives > 0 && (
                        <div className="flex gap-0.5">
                          {[...Array(survivor.extraLives)].map((_, i) => (
                            <span key={i} className="text-neon-green text-sm">❤️</span>
                          ))}
                        </div>
                      )}
                      <motion.span
                        className={`text-xs font-orbitron font-bold px-2 py-1 rounded border ${getStatusColor(
                          survivor.status
                        )} ${getStatusBg(survivor.status)}`}
                      >
                        {survivor.status.toUpperCase()}
                      </motion.span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Stats Summary */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              {
                label: 'Average Holdings',
                value: formatNumber(
                  gameState.survivors.length > 0
                    ? gameState.survivors.reduce((acc, s) => acc + s.tokenAmount, 0) / gameState.survivors.length
                    : 0
                ),
                color: 'cyan',
              },
              {
                label: 'Largest Holder',
                value: formatNumber(gameState.survivors[0]?.tokenAmount || 0),
                color: 'magenta',
              },
              {
                label: 'Total Tokens in Game',
                value: formatNumber(
                  gameState.survivors.reduce((acc, s) => acc + s.tokenAmount, 0)
                ),
                color: 'purple',
              },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                className={`p-4 bg-void-light/50 rounded-lg border border-${stat.color}/30`}
                variants={itemVariants}
              >
                <p className={`text-xs font-space-mono text-${stat.color}/60 mb-2`}>
                  {stat.label.toUpperCase()}
                </p>
                <p className={`text-xl font-orbitron text-${stat.color} font-bold`}>
                  {stat.value}
                </p>
              </motion.div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default SurvivorFeed;
