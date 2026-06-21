import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGame } from '../context/GameContext';
import { containerVariants, itemVariants, slideInFromLeftVariants } from '../utils/animations';

const ActivityFeed: React.FC = () => {
  const { gameState } = useGame();

  const getActivityIcon = (type: string): string => {
    switch (type) {
      case 'storm':
        return '⚡';
      case 'eliminated':
        return '💀';
      case 'new_survivor':
        return '✨';
      case 'jackpot_increase':
        return '💎';
      case 'survived':
        return '✓';
      case 'protected':
        return '🛡️';
      default:
        return '•';
    }
  };

  const getActivityColor = (type: string): string => {
    switch (type) {
      case 'storm':
        return 'text-magenta';
      case 'eliminated':
        return 'text-magenta';
      case 'new_survivor':
        return 'text-cyan';
      case 'jackpot_increase':
        return 'text-neon-green';
      case 'survived':
        return 'text-neon-green';
      case 'protected':
        return 'text-neon-green';
      default:
        return 'text-cyan';
    }
  };

  const formatTime = (timestamp: number): string => {
    const now = Date.now();
    const diff = now - timestamp;
    
    if (diff < 1000) return 'just now';
    if (diff < 60000) return `${Math.floor(diff / 1000)}s ago`;
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    return `${Math.floor(diff / 3600000)}h ago`;
  };

  const recentActivities = gameState.activityLog.slice(0, 20);

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
          <div className="text-center mb-12">
            <h2 className="font-orbitron text-3xl md:text-4xl font-bold text-cyan mb-4">
              📡 ACTIVITY FEED
            </h2>
            <p className="text-cyan/60 font-space-mono text-sm md:text-base">
              Real-time game events. Drama unfolds. Destiny is written.
            </p>
          </div>

          {/* Activity List */}
          <motion.div
            className="max-w-3xl mx-auto space-y-3"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            <AnimatePresence mode="popLayout">
              {recentActivities.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  className="glow-card p-4 md:p-5 border-l-4 flex items-start gap-4 cursor-pointer hover:bg-void-light/40 transition-colors"
                  style={{
                    borderLeftColor:
                      activity.type === 'storm' || activity.type === 'eliminated'
                        ? '#ff006e'
                        : activity.type === 'jackpot_increase' || activity.type === 'protected' || activity.type === 'survived'
                        ? '#39ff14'
                        : '#00d9ff',
                  }}
                  variants={slideInFromLeftVariants}
                  custom={index}
                  initial={{ opacity: 0, x: -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 40 }}
                  whileHover={{ scale: 1.01, paddingLeft: '1.5rem' }}
                  transition={{
                    type: 'spring',
                    stiffness: 500,
                    damping: 30,
                  }}
                >
                  {/* Icon */}
                  <motion.span
                    className={`text-2xl flex-shrink-0 ${getActivityColor(activity.type)}`}
                    animate={{
                      scale: activity.type === 'storm' ? [1, 1.2, 1] : 1,
                    }}
                    transition={{
                      duration: 0.6,
                      repeat: activity.type === 'storm' ? 2 : 0,
                    }}
                  >
                    {getActivityIcon(activity.type)}
                  </motion.span>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <motion.p
                      className={`text-sm md:text-base font-space-mono leading-relaxed ${getActivityColor(
                        activity.type
                      )}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.1 }}
                    >
                      {activity.message}
                    </motion.p>

                    {/* Meta info */}
                    <motion.p
                      className="text-xs text-cyan/40 mt-1 font-space-mono"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                    >
                      {formatTime(activity.timestamp)}
                    </motion.p>
                  </div>

                  {/* Amount badge if applicable */}
                  {activity.amount && (
                    <motion.div
                      className="flex-shrink-0 text-right"
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: 0.2, type: 'spring' }}
                    >
                      <p className="text-sm md:text-base font-orbitron font-bold text-magenta">
                        ${activity.amount.toFixed(2)}
                      </p>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Empty state */}
            {recentActivities.length === 0 && (
              <motion.div
                className="text-center p-12 text-cyan/50"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <p className="font-space-mono">Waiting for activity...</p>
              </motion.div>
            )}
          </motion.div>

          {/* Activity Stats */}
          <motion.div
            className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {[
              {
                label: 'TOTAL EVENTS',
                value: gameState.activityLog.length,
                color: 'cyan',
                icon: '📊',
              },
              {
                label: 'STORMS STRUCK',
                value: gameState.stormCount,
                color: 'magenta',
                icon: '⚡',
              },
              {
                label: 'LAST EVENT',
                value: gameState.activityLog.length > 0 
                  ? formatTime(gameState.activityLog[0].timestamp)
                  : 'Never',
                color: 'neon-green',
                icon: '⏱️',
              },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                className={`glow-card p-6 text-center border-${stat.color}/40`}
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <p className="text-2xl mb-2">{stat.icon}</p>
                <p className={`text-xs md:text-sm font-space-mono text-${stat.color}/60 mb-2 uppercase`}>
                  {stat.label}
                </p>
                <motion.p
                  className={`text-2xl md:text-3xl font-orbitron font-bold text-${stat.color}`}
                  key={stat.value}
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {stat.value}
                </motion.p>
              </motion.div>
            ))}
          </motion.div>

          {/* Feed explanation */}
          <motion.div
            className="mt-12 p-6 md:p-8 glow-card border-cyan/30 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            viewport={{ once: true }}
          >
            <p className="text-sm md:text-base text-cyan/70 font-space-mono leading-relaxed">
              This feed updates in real-time as survivors join, storms strike, and wallets are eliminated.
              Watch the drama unfold. Your story could be next.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default ActivityFeed;
