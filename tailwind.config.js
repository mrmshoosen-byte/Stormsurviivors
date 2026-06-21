/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        'void': '#0a0e27',
        'void-dark': '#050810',
        'void-light': '#1a1f3a',
        'cyan': '#00d9ff',
        'cyan-dark': '#0099cc',
        'magenta': '#ff006e',
        'magenta-dark': '#cc0055',
        'purple': '#7c3aed',
        'neon-green': '#39ff14',
      },
      fontFamily: {
        'orbitron': ['Orbitron', 'sans-serif'],
        'space-mono': ['Space Mono', 'monospace'],
        'inter': ['Inter', 'sans-serif'],
      },
      keyframes: {
        'glow': {
          '0%, 100%': { textShadow: '0 0 10px #00d9ff, 0 0 20px #00d9ff' },
          '50%': { textShadow: '0 0 20px #00d9ff, 0 0 40px #00d9ff' },
        },
        'pulse-glow': {
          '0%, 100%': { boxShadow: '0 0 20px #00d9ff, 0 0 40px #00d9ff' },
          '50%': { boxShadow: '0 0 30px #00d9ff, 0 0 60px #00d9ff' },
        },
        'glitch': {
          '0%': { clipPath: 'polygon(0 0, 100% 0, 100% 45%, 0 58%)' },
          '50%': { clipPath: 'polygon(0 17%, 100% 0, 100% 58%, 0 100%)' },
          '100%': { clipPath: 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' },
        },
        'eliminate': {
          '0%': { 
            opacity: '1',
            transform: 'scale(1) rotateY(0deg)',
          },
          '50%': {
            opacity: '0.5',
            transform: 'scale(1.1) rotateY(180deg)',
          },
          '100%': {
            opacity: '0',
            transform: 'scale(0.5) rotateY(360deg)',
          },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        'scan': {
          '0%': { backgroundPosition: '0 0' },
          '100%': { backgroundPosition: '0 100%' },
        },
      },
      animation: {
        'glow': 'glow 2s ease-in-out infinite',
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite',
        'glitch': 'glitch 0.3s infinite',
        'eliminate': 'eliminate 0.8s ease-in forwards',
        'float': 'float 3s ease-in-out infinite',
        'scan': 'scan 3s linear infinite',
      },
      backgroundImage: {
        'grid': 'linear-gradient(to right, rgba(0,217,255,0.1) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,217,255,0.1) 1px, transparent 1px)',
      },
      backgroundSize: {
        'grid': '50px 50px',
      },
      boxShadow: {
        'glow-cyan': '0 0 20px rgba(0,217,255,0.5)',
        'glow-magenta': '0 0 20px rgba(255,0,110,0.5)',
        'glow-purple': '0 0 20px rgba(124,58,237,0.5)',
      },
    },
  },
  plugins: [],
};
