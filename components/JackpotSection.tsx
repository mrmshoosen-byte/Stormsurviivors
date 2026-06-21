import React from 'react';
import { motion } from 'framer-motion';
import { useGame } from '../context/GameContext';
import { formatUSD, formatNumber } from '../utils/mockData';
import { containerVariants, itemVariants, floatingVariants } from '../utils/animations';

const JackpotSection: React.FC = () => {
  const { gameState } = useGame();

  const mechanicsSteps = [
    {
      number: '01',
      title: 'BUY THE TOKEN',
      description: 'Purchase SURVIVORS token from Pump.fun to enter the game. Your wallet becomes a survivor.',
      icon: '💰',
      color: 'cyan',
    },
    {
      number: '02',
      title: 'ENTER SURVIVOR POOL',
      description: 'Every buy enters your wallet into the competition. More tokens = more protection.',
      icon: '👤',
      color: 'magenta',
    },
    {
      number: '03',
      title: 'SURVIVE THE STORMS',
      description: 'A storm strikes every 60 seconds. Random wallets are eliminated from the game.',
      icon: '⚡',
      color: 'neon-green',
    },
    {
      number: '04',
      title: 'CLAIM THE JACKPOT',
      description: 'The last wallet standing wins the entire jackpot pool. Be the sole survivor.',
      icon: '🏆',
      color: 'purple',
    },
  ];

  const bonusLives = [
    { amount: '50K Tokens', lives: '1 Extra Life', color: 'cyan' },
    { amount: '500K Tokens', lives: '2 Extra Lives', color: 'magenta' },
    { amount: '1M Tokens', lives: '3 Extra Lives', color: 'neon-green' },
  ];

  const aliveSurvivors = gameState.survivors.length;
  const projectedElimPerStorm = aliveSurvivors > 0 ? Math.max(1, Math.ceil(aliveSurvivors * 0.07)) : 0;
  const projectedStormsToWin = aliveSurvivors > 0 ? Math.ceil(Math.log(aliveSurvivors) / Math.log(0.93)) : 0;

  return (
    <section className="relative py-16 md:py-24 overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-20 right-10 w-40 h-40 bg-magenta/10 rounded-full blur-3xl"
          animate={{
            y: [0, 40, 0],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      </div>

      <div className="relative z-10 container mx-auto px-4">
        {/* Main Title */}
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h2 className="font-orbitron text-3xl md:text-4xl font-bold mb-4">
            <span className="text-magenta">💎 </span>
            <span className="text-cyan">JACKPOT</span>
            <span className="text-magenta"> 💎</span>
          </h2>
          <p className="text-cyan/60 font-space-mono text-sm md:text-base">
            How to survive. How to win. How to take it all.
          </p>
        </motion.div>

        {/* Big Jackpot Display */}
        <motion.div
          className="max-w-2xl mx-auto mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          <motion.div
            className="glow-card p-8 md:p-12 text-center border-magenta/60 relative overflow-hidden"
            variants={itemVariants}
            animate={{
              boxShadow: [
                '0 0 20px rgba(255, 0, 110, 0.3)',
                '0 0 40px rgba(255, 0, 110, 0.5)',
                '0 0 20px rgba(255, 0, 110, 0.3)',
              ],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <p className="text-sm font-space-mono text-magenta/70 mb-2 uppercase tracking-wider">
              Current Prize Pool
            </p>
            <motion.h3
              className="text-5xl md:text-7xl font-orbitron font-black text-magenta mb-4"
              key={gameState.totalJackpot}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              {formatUSD(gameState.totalJackpot)}
            </motion.h3>
            <p className="text-xs md:text-sm text-magenta/60 font-space-mono">
              ↑ Increases with every buy | 5% of all purchases go to the jackpot
            </p>

            {/* Percentage breakdown */}
            <motion.div
              className="mt-6 p-4 bg-magenta/10 rounded-lg border border-magenta/30"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              viewport={{ once: true }}
            >
              <p className="text-xs text-magenta/70 font-space-mono mb-3">JACKPOT COMPOSITION</p>
              <div className="grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-2xl font-orbitron text-magenta">5%</p>
                  <p className="text-xs text-magenta/60">Per Buy</p>
                </div>
                <div>
                  <p className="text-2xl font-orbitron text-magenta">×{gameState.survivors.length + gameState.eliminated.length}</p>
                  <p className="text-xs text-magenta/60">Total Wallets</p>
                </div>
                <div>
                  <p className="text-2xl font-orbitron text-magenta">= Pool</p>
                  <p className="text-xs text-magenta/60">For Winner</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>

        {/* Game Mechanics - 4 Steps */}
        <motion.div
          className="mb-16"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h3 className="font-orbitron text-2xl md:text-3xl font-bold text-cyan mb-8 text-center">
            HOW TO WIN
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {mechanicsSteps.map((step, index) => (
              <motion.div
                key={step.number}
                className={`glow-card p-6 border-${step.color}/40 hover:border-${step.color}/80 text-center`}
                variants={itemVariants}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <p className="text-4xl mb-4">{step.icon}</p>
                <p className={`font-orbitron text-xs font-bold text-${step.color} mb-2 uppercase tracking-wider`}>
                  {step.number}
                </p>
                <h4 className={`font-orbitron text-lg font-bold text-${step.color} mb-3`}>
                  {step.title}
                </h4>
                <p className="text-sm text-cyan/70 leading-relaxed">
                  {step.description}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Bonus Lives System */}
        <motion.div
          className="mb-16 glow-card p-8 md:p-12 border-neon-green/40"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <h3 className="font-orbitron text-2xl md:text-3xl font-bold text-neon-green mb-8 text-center">
            ❤️ EXTRA LIVES SYSTEM
          </h3>
          <p className="text-center text-cyan/70 mb-8 text-sm md:text-base">
            Hold more tokens, get more protection. Each extra life saves you from one storm.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {bonusLives.map((bonus, index) => (
              <motion.div
                key={bonus.amount}
                className={`p-6 rounded-lg border-2 border-${bonus.color}/50 bg-${bonus.color}/5 text-center`}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <p className={`font-orbitron text-lg font-bold text-${bonus.color} mb-2`}>
                  {bonus.amount}
                </p>
                <p className={`text-2xl font-orbitron text-${bonus.color} font-black`}>
                  {bonus.lives}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Game Statistics Projection */}
        <motion.div
          className="glow-card p-8 md:p-12 border-cyan/40"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          viewport={{ once: true }}
        >
          <h3 className="font-orbitron text-2xl md:text-3xl font-bold text-cyan mb-8">
            📊 CURRENT GAME STATS
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              {
                label: 'Survivors Alive',
                value: aliveSurvivors,
                unit: 'wallets',
              },
              {
                label: 'Total Eliminated',
                value: gameState.eliminated.length,
                unit: 'wallets',
              },
              {
                label: 'Est. Elim/Storm',
                value: projectedElimPerStorm,
                unit: 'wallets',
              },
              {
                label: 'Estimated Storms to Win',
                value: projectedStormsToWin,
                unit: 'rounds',
              },
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                className="p-4 bg-void-dark/50 rounded-lg border border-cyan/30"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <p className="text-xs text-cyan/60 font-space-mono mb-2 uppercase">
                  {stat.label}
                </p>
                <motion.p
                  className="text-3xl font-orbitron text-cyan font-bold"
                  key={stat.value}
                  initial={{ scale: 0.5 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {stat.value}
                </motion.p>
                <p className="text-xs text-cyan/50 mt-1">{stat.unit}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default JackpotSection;
