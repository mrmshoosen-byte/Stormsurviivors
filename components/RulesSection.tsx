import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { containerVariants, itemVariants } from '../utils/animations';

const RulesSection: React.FC = () => {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);

  const rules = [
    {
      icon: '💰',
      title: 'Buy the Token',
      description: 'Purchase SURVIVORS tokens from Pump.fun. No minimum, no maximum. Every dollar invested = entry into the game.',
    },
    {
      icon: '👤',
      title: 'One Wallet = One Survivor',
      description: 'Your wallet address is your survivor identity. You cannot have multiple survivors per wallet.',
    },
    {
      icon: '⚡',
      title: 'Storms Strike Every 60 Seconds',
      description: 'Every minute, a storm randomly eliminates 5-15% of remaining survivors. No exceptions.',
    },
    {
      icon: '❤️',
      title: 'Extra Lives = Protection',
      description: 'Hold 50K+ tokens for 1 life, 500K+ for 2 lives, 1M+ for 3 lives. Extra lives protect you from one storm each.',
    },
    {
      icon: '🔄',
      title: 'Selling = Elimination',
      description: 'If you sell your tokens, your wallet is automatically eliminated from the game. No refunds, no comeback.',
    },
    {
      icon: '🏆',
      title: 'Last Survivor Wins All',
      description: 'When only one wallet remains, they claim the entire jackpot pool. Game over. Victory achieved.',
    },
  ];

  const faqs = [
    {
      question: 'How is the jackpot calculated?',
      answer: '5% of every token purchase goes into the jackpot pool. When a survivor is eliminated, their original investment is lost. Only the last survivor receives the total accumulated jackpot.',
    },
    {
      question: 'Can I buy more tokens to get extra lives?',
      answer: 'Yes! Your extra lives are based on your total token holdings. Buy more tokens to reach the 50K, 500K, or 1M thresholds for additional protection.',
    },
    {
      question: 'What if I sell some tokens?',
      answer: 'Your entire wallet is eliminated from the game if token balance drops below the threshold for your current life count. Be careful with sells!',
    },
    {
      question: 'How long does a typical game last?',
      answer: 'With 150 survivors and 7-10% elimination per storm, expect 8-12 storms (approximately 10-15 minutes) for one winner to emerge.',
    },
    {
      question: 'Is there a maximum number of survivors?',
      answer: 'No maximum! The game scales with the number of buyers. More survivors = bigger jackpot = bigger rewards.',
    },
    {
      question: 'What happens if I disconnect?',
      answer: 'Your wallet status is tracked on-chain. Even if you disconnect, your survival status remains. Reconnect anytime to check status.',
    },
    {
      question: 'Can the developers touch the jackpot?',
      answer: 'No. Jackpot funds are community-owned. Only the last survivor can claim the pool. This is enforced by smart contract.',
    },
    {
      question: 'What is the fee structure?',
      answer: '5% goes to jackpot. The remaining amount supports liquidity and platform maintenance. Exact breakdown available in smart contract.',
    },
  ];

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
          <div className="text-center mb-16">
            <h2 className="font-orbitron text-3xl md:text-4xl font-bold text-cyan mb-4">
              📋 RULES & MECHANICS
            </h2>
            <p className="text-cyan/60 font-space-mono text-sm md:text-base">
              Know the game before you enter. No surprises. No excuses.
            </p>
          </div>

          {/* 6 Main Rules */}
          <motion.div
            className="mb-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
          >
            {rules.map((rule, index) => (
              <motion.div
                key={rule.title}
                className="glow-card p-6 md:p-8 border-cyan/30 hover:border-cyan/70"
                variants={itemVariants}
                whileHover={{ scale: 1.05, y: -5 }}
                custom={index}
              >
                <p className="text-4xl mb-4">{rule.icon}</p>
                <h3 className="font-orbitron text-lg md:text-xl font-bold text-cyan mb-3">
                  {rule.title}
                </h3>
                <p className="text-sm md:text-base text-cyan/70 leading-relaxed">
                  {rule.description}
                </p>
              </motion.div>
            ))}
          </motion.div>

          {/* Key Concepts */}
          <motion.div
            className="mb-16 glow-card p-8 md:p-12 border-magenta/40"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h3 className="font-orbitron text-2xl md:text-3xl font-bold text-magenta mb-8">
              ⚠️ IMPORTANT CONCEPTS
            </h3>
            <div className="space-y-6">
              {[
                {
                  title: 'ELIMINATION IS PERMANENT',
                  content: 'Once eliminated, your wallet cannot return to the game. Your tokens are locked in, your survivor status is gone.',
                },
                {
                  title: 'RANDOM SELECTION (FAIR)',
                  content: 'Storm eliminations are completely random. No bias. No favoritism. Every surviving wallet has equal probability of being eliminated.',
                },
                {
                  title: 'JACKPOT IS REAL',
                  content: 'All funds in the jackpot are guaranteed to go to the last survivor. This is smart contract enforced. Not a game.',
                },
                {
                  title: 'IRREVERSIBLE ACTIONS',
                  content: 'Selling tokens = instant elimination. Transfers are tracked. There is no undo button.',
                },
              ].map((concept, index) => (
                <motion.div
                  key={concept.title}
                  className="p-4 md:p-6 bg-magenta/10 border-l-4 border-magenta rounded-r-lg"
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <p className="font-orbitron font-bold text-magenta mb-2 text-sm md:text-base">
                    {concept.title}
                  </p>
                  <p className="text-sm md:text-base text-magenta/80">
                    {concept.content}
                  </p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* FAQ Section */}
          <motion.div
            className="max-w-3xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            viewport={{ once: true }}
          >
            <h3 className="font-orbitron text-2xl md:text-3xl font-bold text-cyan mb-8 text-center">
              ❓ FREQUENTLY ASKED QUESTIONS
            </h3>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  className="glow-card border-cyan/30 overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.05 }}
                  viewport={{ once: true }}
                >
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                    className="w-full p-6 text-left flex items-center justify-between hover:bg-cyan/5 transition-colors"
                  >
                    <span className="font-orbitron font-bold text-cyan text-sm md:text-base">
                      {faq.question}
                    </span>
                    <motion.span
                      animate={{ rotate: expandedFaq === index ? 180 : 0 }}
                      transition={{ duration: 0.3 }}
                      className="text-cyan text-xl flex-shrink-0 ml-4"
                    >
                      ▼
                    </motion.span>
                  </button>

                  <AnimatePresence>
                    {expandedFaq === index && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3 }}
                        className="border-t border-cyan/20"
                      >
                        <p className="p-6 text-cyan/70 text-sm md:text-base leading-relaxed bg-void-dark/50">
                          {faq.answer}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* CTA */}
          <motion.div
            className="mt-16 text-center p-8 md:p-12 glow-card border-purple/50"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            viewport={{ once: true }}
          >
            <p className="font-orbitron text-lg md:text-xl font-bold text-purple mb-4">
              READY TO BECOME A SURVIVOR?
            </p>
            <p className="text-cyan/70 text-sm md:text-base mb-6 max-w-2xl mx-auto">
              This is an experimental game. The stakes are real. The excitement is real.
              The rewards are real. Are you brave enough to enter?
            </p>
            <motion.button
              className="neon-button"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              → ENTER THE GAME
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default RulesSection;
