import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TransactionNotification {
  id: string;
  type: 'buy' | 'sell' | 'warning';
  wallet: string;
  amount: string;
  timestamp: number;
}

interface LiveTransactionNotificationsProps {
  isLive: boolean;
}

const LiveTransactionNotifications: React.FC<LiveTransactionNotificationsProps> = ({ isLive }) => {
  const [notifications, setNotifications] = useState<TransactionNotification[]>([]);

  // Simulate real transaction notifications (in production, these come from monitorTokenTransactions)
  useEffect(() => {
    if (!isLive) return;

    // Remove old notifications
    const timer = setInterval(() => {
      setNotifications((prev) =>
        prev.filter((n) => Date.now() - n.timestamp < 8000)
      );
    }, 1000);

    return () => clearInterval(timer);
  }, [isLive]);

  return (
    <div className="fixed bottom-8 right-8 z-40 space-y-3 pointer-events-none">
      <AnimatePresence>
        {notifications.map((notification) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: 100, y: 0 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: 100, y: -20 }}
            transition={{ duration: 0.3 }}
            className={`p-4 rounded-lg border font-space-mono text-sm max-w-xs pointer-events-auto ${
              notification.type === 'buy'
                ? 'border-cyan/50 bg-cyan/10 text-cyan'
                : notification.type === 'sell'
                ? 'border-magenta/50 bg-magenta/10 text-magenta'
                : 'border-purple/50 bg-purple/10 text-purple'
            }`}
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-lg">
                {notification.type === 'buy' ? '✨' : notification.type === 'sell' ? '💀' : '⚠️'}
              </span>
              <span className="font-orbitron font-bold">
                {notification.type === 'buy' ? 'NEW BUY' : notification.type === 'sell' ? 'SELL DETECTED' : 'WARNING'}
              </span>
            </div>
            <div className="text-xs opacity-80">
              {notification.wallet}
            </div>
            <div className="text-xs opacity-70 mt-1">
              {notification.amount}
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default LiveTransactionNotifications;
