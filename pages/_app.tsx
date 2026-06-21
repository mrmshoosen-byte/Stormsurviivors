import React, { useEffect, useState } from 'react';
import type { AppProps } from 'next/app';
import { GameProvider } from '../context/GameContext';
import ParticleBackground from '../components/ParticleBackground';
import '../styles/globals.css';

function App({ Component, pageProps }: AppProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <GameProvider>
      <div className="min-h-screen bg-gradient-to-b from-void via-void-light to-void relative overflow-hidden">
        <ParticleBackground />
        <div className="relative z-10">
          <Component {...pageProps} />
        </div>
      </div>
    </GameProvider>
  );
}

export default App;
