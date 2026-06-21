import React from 'react';
import { motion } from 'framer-motion';
import { containerVariants, itemVariants } from '../utils/animations';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative border-t border-cyan/20 bg-gradient-to-b from-void-light/30 to-void-dark py-12 md:py-16 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan/10 rounded-full blur-3xl -z-10" />
      </div>

      <div className="relative z-10 container mx-auto px-4">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {/* Main footer content */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 mb-12">
            {/* Branding */}
            <motion.div className="text-center md:text-left" variants={itemVariants}>
              <h3 className="font-orbitron text-xl md:text-2xl font-bold text-cyan mb-2">
                SURVIVORS
              </h3>
              <p className="text-sm text-cyan/60 font-space-mono">
                Pump.fun Meme Coin Battle Royale
              </p>
              <p className="text-xs text-cyan/40 mt-3 leading-relaxed">
                The ultimate test of hodl strength. Buy in. Survive the storms. Win the jackpot.
              </p>
            </motion.div>

            {/* Links */}
            <motion.div className="text-center" variants={itemVariants}>
              <p className="font-orbitron font-bold text-cyan mb-4 text-sm uppercase">
                Resources
              </p>
              <div className="space-y-2">
                {[
                  { label: '🌐 Pump.fun', href: 'https://pump.fun', target: '_blank' },
                  { label: '📊 Smart Contract', href: '#', target: '_self' },
                  { label: '💬 Community', href: 'https://twitter.com', target: '_blank' },
                ].map((link, index) => (
                  <motion.a
                    key={link.label}
                    href={link.href}
                    target={link.target}
                    rel="noopener noreferrer"
                    className="block text-sm text-cyan/70 hover:text-cyan transition-colors font-space-mono"
                    whileHover={{ x: 5 }}
                    variants={itemVariants}
                    custom={index}
                  >
                    {link.label}
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Social */}
            <motion.div className="text-center md:text-right" variants={itemVariants}>
              <p className="font-orbitron font-bold text-cyan mb-4 text-sm uppercase">
                Follow Us
              </p>
              <div className="flex justify-center md:justify-end gap-4">
                {[
                  { icon: '𝕏', label: 'X (Twitter)', href: 'https://twitter.com', color: 'cyan' },
                  { icon: '💬', label: 'Discord', href: '#', color: 'magenta' },
                  { icon: '🔗', label: 'Telegram', href: '#', color: 'neon-green' },
                ].map((social, index) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`w-10 h-10 flex items-center justify-center rounded-lg border border-${social.color}/30 text-${social.color} hover:bg-${social.color}/10 transition-all`}
                    whileHover={{ scale: 1.2, boxShadow: `0 0 20px rgba(0, 217, 255, 0.5)` }}
                    whileTap={{ scale: 0.9 }}
                    title={social.label}
                    custom={index}
                    variants={itemVariants}
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Disclaimer */}
          <motion.div
            className="p-6 md:p-8 bg-magenta/10 border border-magenta/30 rounded-lg mb-8"
            variants={itemVariants}
          >
            <p className="font-orbitron text-sm font-bold text-magenta mb-3 uppercase">
              ⚠️ Disclaimer
            </p>
            <p className="text-xs md:text-sm text-magenta/80 leading-relaxed">
              SURVIVORS is an experimental game built on blockchain technology. This is NOT financial advice.
              Cryptocurrency is highly volatile and risky. Only invest what you can afford to lose completely.
              Smart contracts have been tested but are not guaranteed to be error-free. This project is for
              entertainment and educational purposes. By participating, you acknowledge and accept all risks.
              The developers are not liable for losses. This game is community-driven and decentralized.
            </p>
          </motion.div>

          {/* Bottom bar */}
          <motion.div
            className="pt-8 border-t border-cyan/20 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left"
            variants={itemVariants}
          >
            <p className="text-xs text-cyan/50 font-space-mono">
              © {currentYear} SURVIVORS. All rights reserved. Built with ❤️ for the meme coin community.
            </p>

            <motion.div
              className="flex gap-4 text-xs text-cyan/50 font-space-mono"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              viewport={{ once: true }}
            >
              <a href="#" className="hover:text-cyan transition-colors">
                Privacy
              </a>
              <span>•</span>
              <a href="#" className="hover:text-cyan transition-colors">
                Terms
              </a>
              <span>•</span>
              <a href="#" className="hover:text-cyan transition-colors">
                Contact
              </a>
            </motion.div>
          </motion.div>

          {/* Status indicator */}
          <motion.div
            className="mt-8 text-center"
            animate={{
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          >
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-neon-green/20 border border-neon-green/40 rounded-full text-xs font-space-mono text-neon-green">
              <span className="w-2 h-2 bg-neon-green rounded-full animate-pulse" />
              GAME LIVE ON PUMP.FUN
            </span>
          </motion.div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
