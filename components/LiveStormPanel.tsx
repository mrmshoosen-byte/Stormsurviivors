import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../context/GameContext';
import { countdownVariants, stormVariants, eliminateVariants } from '../utils/animations';

const LiveStormPanel: React.FC = () => {
  const { gameState, stormCountdown, isStormActive } = useGame();
  const [showStormEffect, setShowStormEffect] = useState(false);

  useEffect(() => {
    if (isStormActive) {
      setShowStormEffect(true);
      const timer = setTimeout(() => {
        setShowStormEffect(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [isStormActive]);

  const getCountdownColor = () => {
    if (stormCountdown <= 10) return 'text-magenta';
    if (stormCountdown <= 30) return 'text-cyan';
    return 'text-neon-green';
  };

  const getProgressPercentage = () => {
    return ((60 - stormCountdown) / 60) * 100;
  };

  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan/10 to-transparent" />
      </div>

      <div className="relative z-10 container mx-auto px-4">
        <motion.div
          className="max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          {/* Storm Panel Card */}
          <motion.div
            className="glow-card p-8 md:p-12 border-cyan/50 relative overflow-hidden"
            animate={{
              boxShadow: isStormActive
                ? [
                    '0 0 20px rgba(0, 217, 255, 0.3)',
                    '0 0 60px rgba(255, 0, 110, 0.6)',
                    '0 0 20px rgba(0, 217, 255, 0.3)',
                  ]
                : '0 0 20px rgba(0, 217, 255, 0.3)',
            }}
            transition={{ duration: 0.6 }}
          >
            {/* Header */}
            <div className="text-center mb-8">
              <motion.h2
                className="font-orbitron text-2xl md:text-3xl font-bold text-cyan mb-2"
                animate={{ scale: isStormActive ? [1, 1.1, 1] : 1 }}
                transition={{ duration: 0.6, repeat: isStormActive ? 3 : 0 }}
              >
                ⚡ STORM INCOMING
              </motion.h2>
              <p className="text-sm text-cyan/60 font-space-mono">
                NEXT STRIKE IN
              </p>
            </div>

            {/* Large Countdown */}
            <motion.div
              className="text-center mb-8"
              variants={countdownVariants}
              animate={stormCountdown <= 10 ? "pulse" : ""}
            >
              <motion.div
                className={`text-6xl md:text-8xl font-orbitron font-black ${getCountdownColor()} transition-colors duration-300`}
                key={stormCountdown}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3 }}
              >
                {stormCountdown.toString().padStart(2, '0')}
              </motion.div>
              <p className={`text-lg md:text-xl font-space-mono mt-2 ${getCountdownColor()}`}>
                SECONDS
              </p>
            </motion.div>

            {/* Progress Bar */}
            <div className="mb-8">
              <div className="relative h-3 bg-void-dark rounded-full overflow-hidden border border-cyan/30">
                <motion.div
                  className="absolute top-0 left-0 h-full bg-gradient-to-r from-cyan to-magenta"
                  initial={{ width: 0 }}
                  animate={{ width: `${getProgressPercentage()}%` }}
                  transition={{ duration: 1, ease: 'linear' }}
                  style={{
                    boxShadow: '0 0 10px rgba(0, 217, 255, 0.8)',
                  }}
                />
              </div>
            </div>

            {/* Storm Info */}
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="text-center p-4 border border-cyan/30 rounded-lg bg-cyan/5">
                <p className="text-xs text-cyan/60 font-space-mono mb-1">STORMS THIS ROUND</p>
                <p className="text-2xl font-orbitron text-cyan font-bold">{gameState.stormCount}</p>
              </div>
              <div className="text-center p-4 border border-magenta/30 rounded-lg bg-magenta/5">
                <p className="text-xs text-magenta/60 font-space-mono mb-1">SURVIVORS AT RISK</p>
                <p className="text-2xl font-orbitron text-magenta font-bold">{gameState.survivors.length}</p>
              </div>
            </div>

            {/* Warning text */}
            <motion.p
              className="text-center text-sm font-space-mono text-magenta/80"
              animate={{
                opacity: stormCountdown <= 10 ? [0.5, 1, 0.5] : 1,
              }}
              transition={{
                duration: 0.8,
                repeat: stormCountdown <= 10 ? Infinity : 0,
              }}
            >
              {stormCountdown <= 10
                ? '⚠️ CRITICAL - STORM APPROACHING ⚠️'
                : stormCountdown <= 30
                ? '🌪️ Prepare yourself...'
                : '✓ Time to breathe...'}
            </motion.p>
          </motion.div>

          {/* Storm Strike Effect */}
          <AnimatePresence>
            {showStormEffect && (
              <motion.div
                className="fixed inset-0 pointer-events-none z-50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                {/* Lightning strikes */}
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-full bg-gradient-to-b from-magenta via-cyan to-transparent"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: 0,
                    }}
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity: [0, 0.8, 0],
                      height: ['0%', '100%', '100%'],
                    }}
                    transition={{
                      duration: 0.4,
                      delay: i * 0.1,
                    }}
                  />
                ))}

                {/* Screen flash */}
                <motion.div
                  className="fixed inset-0 bg-magenta"
                  initial={{ opacity: 0 }}
                  animate={{
                    opacity: [0, 0.3, 0],
                  }}
                  transition={{
                    duration: 0.6,
                  }}
                />

                {/* Impact text */}
                <motion.div
                  className="fixed inset-0 flex items-center justify-center pointer-events-none"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <motion.p
                    className="font-orbitron text-4xl md:text-6xl font-black text-magenta"
                    animate={{
                      scale: [1, 1.5, 0.5],
                      opacity: [1, 1, 0],
                      rotate: [0, 10, -10, 0],
                    }}
                    transition={{
                      duration: 0.8,
                    }}
                  >
                    ⚡ STORM ⚡
                  </motion.p>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bottom stats */}
          <motion.div
            className="mt-8 p-6 bg-void-light/30 rounded-lg border border-cyan/20"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            viewport={{ once: true }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-xs text-cyan/60 font-space-mono mb-1">AVG ELIMINATIONS/STORM</p>
                <p className="text-xl font-orbitron text-cyan">
                  {gameState.stormCount > 0 
                    ? Math.ceil(gameState.eliminated.length / gameState.stormCount)
                    : 0}
                </p>
              </div>
              <div>
                <p className="text-xs text-cyan/60 font-space-mono mb-1">SURVIVAL RATE</p>
                <p className="text-xl font-orbitron text-cyan">
                  {gameState.survivors.length + gameState.eliminated.length > 0
                    ? Math.round((gameState.survivors.length / (gameState.survivors.length + gameState.eliminated.length)) * 100)
                    : 0}%
                </p>
              </div>
              <div>
                <p className="text-xs text-cyan/60 font-space-mono mb-1">TOTAL WALLETS</p>
                <p className="text-xl font-orbitron text-cyan">{gameState.survivors.length + gameState.eliminated.length}</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default LiveStormPanel;
