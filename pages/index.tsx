import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { motion, AnimatePresence } from 'framer-motion';
import Hero from '../components/Hero';
import LiveStormPanel from '../components/LiveStormPanel';
import SurvivorFeed from '../components/SurvivorFeed';
import JackpotSection from '../components/JackpotSection';
import RulesSection from '../components/RulesSection';
import ActivityFeed from '../components/ActivityFeed';
import Footer from '../components/Footer';
import TokenConfigModal from '../components/TokenConfigModal';
import LiveStatusIndicator from '../components/LiveStatusIndicator';
import LiveTransactionNotifications from '../components/LiveTransactionNotifications';
import { useGame } from '../context/GameContext';

export default function Home() {
  const [showRulesModal, setShowRulesModal] = useState(false);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [showTokenConfig, setShowTokenConfig] = useState(false);
  const [buyAmount, setBuyAmount] = useState(10);
  const { buySurvivor, isLiveMode, isConnected, tokenAddress, gameState } = useGame();

  // Auto-show token config modal on first visit
  useEffect(() => {
    const hasSeenConfig = localStorage.getItem('survivors-config-shown');
    if (!hasSeenConfig && !isLiveMode) {
      setShowTokenConfig(true);
      localStorage.setItem('survivors-config-shown', 'true');
    }
  }, [isLiveMode]);

  const handleBuy = () => {
    if (buyAmount > 0) {
      buySurvivor(buyAmount);
      setShowBuyModal(false);
      setBuyAmount(10);
    }
  };

  return (
    <>
      <Head>
        <title>SURVIVORS - Void Battle Royale | Pump.fun Meme Coin Game</title>
        <meta name="description" content="SURVIVORS: Buy the token, survive the storms, win the jackpot. An experimental battle royale game on Pump.fun." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className="relative w-full min-h-screen">
        {/* Live Mode Indicators */}
        {isLiveMode && (
          <>
            <LiveStatusIndicator
              tokenAddress={tokenAddress}
              isConnected={isConnected}
              holderCount={gameState.survivors.length}
              lastUpdate={gameState.lastStormTime}
            />
            <LiveTransactionNotifications isLive={isLiveMode && isConnected} />
          </>
        )}

        {/* Token Config Modal */}
        <TokenConfigModal isOpen={showTokenConfig} onClose={() => setShowTokenConfig(false)} />

        {/* Hero Section */}
        <Hero onBuyClick={() => setShowBuyModal(true)} onRulesClick={() => setShowRulesModal(true)} />

        {/* Live Mode Toggle Button */}
        {!isLiveMode && (
          <motion.div
            className="fixed left-4 top-20 z-30"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1 }}
          >
            <motion.button
              onClick={() => setShowTokenConfig(true)}
              className="px-4 py-2 font-orbitron text-xs uppercase font-bold border-2 border-magenta/50 bg-magenta/10 text-magenta rounded-lg hover:border-magenta hover:bg-magenta/20 transition-all"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              animate={{
                boxShadow: [
                  '0 0 10px rgba(255, 0, 110, 0.3)',
                  '0 0 20px rgba(255, 0, 110, 0.5)',
                  '0 0 10px rgba(255, 0, 110, 0.3)',
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              🔴 Enable Live Mode
            </motion.button>
          </motion.div>
        )}
        {/* Hero Section */}
        <Hero onBuyClick={() => setShowBuyModal(true)} onRulesClick={() => setShowRulesModal(true)} />

        {/* Live Storm Panel */}
        <LiveStormPanel />

        {/* Survivor Feed / Leaderboard */}
        <SurvivorFeed />

        {/* Jackpot Section */}
        <JackpotSection />

        {/* Activity Feed */}
        <ActivityFeed />

        {/* Rules Section */}
        <RulesSection />

        {/* Footer */}
        <Footer />

        {/* Buy Modal */}
        <AnimatePresence>
          {showBuyModal && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowBuyModal(false)}
            >
              <motion.div
                className="bg-void-light border-2 border-cyan p-8 md:p-12 rounded-lg max-w-md w-full"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <h2 className="font-orbitron text-2xl md:text-3xl font-bold text-cyan mb-4">
                  💰 BUY & ENTER
                </h2>
                <p className="text-cyan/70 text-sm mb-6 font-space-mono">
                  Enter the SURVIVORS game by purchasing tokens on Pump.fun. Specify your buy amount below:
                </p>

                <div className="mb-6">
                  <label className="block font-space-mono text-sm text-cyan/80 mb-2">
                    BUY AMOUNT (USD)
                  </label>
                  <div className="flex gap-2 mb-4">
                    <input
                      type="number"
                      value={buyAmount}
                      onChange={(e) => setBuyAmount(Math.max(1, parseInt(e.target.value) || 0))}
                      className="flex-1 px-4 py-3 bg-void-dark border border-cyan/30 text-cyan font-space-mono rounded-lg focus:outline-none focus:border-cyan"
                      min="1"
                      step="1"
                    />
                    <span className="px-4 py-3 bg-cyan/20 border border-cyan/50 text-cyan rounded-lg font-orbitron font-bold">
                      ${buyAmount}
                    </span>
                  </div>

                  {/* Quick amount buttons */}
                  <div className="grid grid-cols-4 gap-2 mb-4">
                    {[10, 50, 100, 500].map((amount) => (
                      <button
                        key={amount}
                        onClick={() => setBuyAmount(amount)}
                        className={`px-3 py-2 rounded font-space-mono text-xs font-bold transition-all ${
                          buyAmount === amount
                            ? 'bg-cyan/40 border border-cyan text-cyan'
                            : 'bg-void-dark border border-cyan/20 text-cyan/70 hover:border-cyan/50'
                        }`}
                      >
                        ${amount}
                      </button>
                    ))}
                  </div>

                  {/* Estimated tokens */}
                  <div className="p-4 bg-cyan/10 border border-cyan/30 rounded-lg mb-6">
                    <p className="text-xs text-cyan/60 font-space-mono mb-1">ESTIMATED TOKENS</p>
                    <p className="text-xl font-orbitron text-cyan font-bold">
                      {Math.floor(buyAmount / 0.0002).toLocaleString()} 🪙
                    </p>
                    <p className="text-xs text-cyan/50 mt-1 font-space-mono">
                      @ ~$0.0002 per token
                    </p>
                  </div>

                  {/* Warning */}
                  {buyAmount > 100 && (
                    <motion.div
                      className="p-3 bg-magenta/20 border border-magenta/50 rounded mb-6"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                    >
                      <p className="text-xs text-magenta font-space-mono">
                        ⚠️ High buy amount detected. Ensure you can afford to lose this investment.
                      </p>
                    </motion.div>
                  )}
                </div>

                {/* Instructions */}
                <div className="p-4 bg-void-dark/50 border border-cyan/20 rounded-lg mb-6">
                  <p className="text-xs text-cyan/70 font-space-mono leading-relaxed">
                    After purchasing {Math.floor(buyAmount / 0.0002).toLocaleString()} tokens on Pump.fun,
                    your wallet will be automatically entered into the SURVIVORS game. Storms will eliminate random survivors every 60 seconds.
                  </p>
                </div>

                {/* Action buttons */}
                <div className="flex gap-3">
                  <motion.button
                    onClick={handleBuy}
                    className="flex-1 neon-button"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    → ENTER GAME
                  </motion.button>
                  <motion.button
                    onClick={() => setShowBuyModal(false)}
                    className="flex-1 px-4 py-3 border border-cyan/30 text-cyan rounded-lg font-orbitron font-bold hover:border-cyan/60 transition-all"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    CANCEL
                  </motion.button>
                </div>

                <p className="text-center text-xs text-cyan/50 font-space-mono mt-4">
                  🔗 You will be redirected to Pump.fun to complete the purchase
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Rules Modal */}
        <AnimatePresence>
          {showRulesModal && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/50 backdrop-blur-sm overflow-y-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowRulesModal(false)}
            >
              <motion.div
                className="bg-void-light border-2 border-cyan p-8 md:p-12 rounded-lg max-w-2xl w-full my-8"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.5, opacity: 0 }}
                onClick={(e) => e.stopPropagation()}
              >
                <h2 className="font-orbitron text-2xl md:text-3xl font-bold text-cyan mb-6">
                  📋 GAME RULES
                </h2>

                <div className="space-y-4 mb-8 max-h-96 overflow-y-auto pr-2">
                  {[
                    {
                      num: 1,
                      title: 'Buy the Token',
                      desc: 'Purchase SURVIVORS tokens from Pump.fun to enter the game.',
                    },
                    {
                      num: 2,
                      title: 'One Wallet = One Survivor',
                      desc: 'Your wallet address is your identity. Cannot split across wallets.',
                    },
                    {
                      num: 3,
                      title: 'Storms Strike Every 60 Seconds',
                      desc: 'Random survivors are eliminated. 5-15% per storm.',
                    },
                    {
                      num: 4,
                      title: 'Extra Lives from Holdings',
                      desc: '50K+ = 1 life, 500K+ = 2 lives, 1M+ = 3 lives',
                    },
                    {
                      num: 5,
                      title: 'Selling = Elimination',
                      desc: 'If you sell tokens, you are out of the game immediately.',
                    },
                    {
                      num: 6,
                      title: 'Last Survivor Wins',
                      desc: 'The final remaining wallet wins the entire jackpot pool.',
                    },
                  ].map((rule) => (
                    <motion.div
                      key={rule.num}
                      className="p-4 border border-cyan/30 rounded-lg bg-void-dark/50"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: rule.num * 0.05 }}
                    >
                      <p className="font-orbitron text-cyan font-bold mb-1">
                        {rule.num}. {rule.title}
                      </p>
                      <p className="text-sm text-cyan/70 font-space-mono">{rule.desc}</p>
                    </motion.div>
                  ))}
                </div>

                <motion.button
                  onClick={() => setShowRulesModal(false)}
                  className="w-full neon-button"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  UNDERSTOOD
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </>
  );
}
