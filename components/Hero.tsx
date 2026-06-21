import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';
import { containerVariants, itemVariants, floatingVariants } from '../utils/animations';
import { formatNumber, formatUSD } from '../utils/mockData';

interface HeroProps {
  onBuyClick: () => void;
  onRulesClick: () => void;
}

const Hero: React.FC<HeroProps> = ({ onBuyClick, onRulesClick }) => {
  const { gameState, stormCountdown } = useGame();
  const [showBuyModal, setShowBuyModal] = useState(false);

  const stats = [
    {
      label: 'SURVIVORS ALIVE',
      value: gameState.survivors.length,
      unit: '',
      color: 'cyan',
      icon: '👤',
    },
    {
      label: 'JACKPOT POOL',
      value: formatUSD(gameState.totalJackpot),
      unit: '',
      color: 'magenta',
      icon: '💎',
    },
    {
      label: 'NEXT STORM IN',
      value: stormCountdown,
      unit: 's',
      color: 'neon-green',
      icon: '⚡',
    },
    {
      label: 'ELIMINATED',
      value: gameState.eliminated.length,
      unit: '',
      color: 'magenta',
      icon: '💀',
    },
  ];

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-void via-void-light to-void overflow-hidden">
      {/* Animated background grid */}
      <div className="absolute inset-0 opacity-30">
        <div className="absolute inset-0 bg-grid bg-grid-size animate-pulse" />
      </div>

      {/* Radial glow effect */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-gradient-to-b from-cyan/20 to-transparent rounded-full blur-3xl -z-10" />

      <motion.div
        className="relative z-10 container mx-auto px-4 py-20 md:py-32"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Main title section */}
        <motion.div
          className="text-center mb-16"
          variants={itemVariants}
        >
          <motion.h1
            className="font-orbitron font-black text-5xl md:text-7xl lg:text-8xl mb-4"
            style={{
              background: 'linear-gradient(135deg, #00d9ff 0%, #ff006e 50%, #7c3aed 100%)',
              backgroundSize: '200% 200%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
            animate={{
              backgroundPosition: ['0% 0%', '100% 100%', '0% 0%'],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: 'linear',
            }}
          >
            VOID SURVIVOR
          </motion.h1>
          
          <motion.p
            className="font-space-mono text-lg md:text-2xl text-cyan/80 mb-2"
            variants={itemVariants}
            animate="pulse"
          >
            ▸ BUY IN. SURVIVE THE STORMS. LAST WALLET WINS ▸
          </motion.p>
          
          <motion.div
            className="h-1 w-32 mx-auto bg-gradient-to-r from-cyan via-magenta to-purple rounded-full"
            variants={itemVariants}
          />
        </motion.div>

        {/* Stats Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-16"
          variants={containerVariants}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              className={`glow-card p-6 text-center border-${stat.color}/40 hover:border-${stat.color}/80`}
              variants={itemVariants}
              whileHover={{ scale: 1.05, y: -5 }}
              custom={index}
            >
              <div className="text-3xl mb-2">{stat.icon}</div>
              <p className="text-xs md:text-sm font-space-mono text-cyan/60 mb-2 uppercase tracking-wider">
                {stat.label}
              </p>
              <motion.p
                className={`text-2xl md:text-3xl font-orbitron font-bold text-${stat.color === 'cyan' ? 'cyan' : stat.color === 'magenta' ? 'magenta' : 'neon-green'}`}
                key={stat.value}
                animate={{
                  scale: [1, 1.1, 1],
                }}
                transition={{
                  duration: 0.5,
                }}
              >
                {stat.value}
              </motion.p>
              {stat.unit && (
                <span className={`text-sm text-${stat.color === 'cyan' ? 'cyan' : stat.color === 'magenta' ? 'magenta' : 'neon-green'}/70`}>
                  {stat.unit}
                </span>
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          className="flex flex-col md:flex-row gap-4 justify-center mb-16"
          variants={containerVariants}
        >
          <motion.button
            className="neon-button"
            variants={itemVariants}
            whileHover={{ scale: 1.1, boxShadow: '0 0 30px rgba(0, 217, 255, 0.6)' }}
            whileTap={{ scale: 0.95 }}
            onClick={onBuyClick}
          >
            → BUY TO ENTER
          </motion.button>
          
          <motion.button
            className="neon-button-magenta"
            variants={itemVariants}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={onRulesClick}
          >
            ? VIEW RULES
          </motion.button>
        </motion.div>

        {/* Info banner */}
        <motion.div
          className="max-w-4xl mx-auto glow-card p-6 md:p-8 text-center border-purple/50"
          variants={itemVariants}
          animate="pulse"
        >
          <p className="text-sm md:text-base font-space-mono text-purple/80">
            ⚠️ EXPERIMENTAL GAME - One wallet = One survivor. Every {stormCountdown}s a storm strikes. 
            Bigger holders get bonus lives. The last survivor takes the jackpot.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Hero;
