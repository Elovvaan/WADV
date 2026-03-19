import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    '../../packages/ui/src/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: '#060816',
      },
      backgroundImage: {
        'hero-grid': 'radial-gradient(circle at top, rgba(88, 114, 255, 0.18), transparent 30%), linear-gradient(180deg, rgba(7,11,25,0.9), rgba(3,4,11,1))',
      },
      boxShadow: {
        glow: '0 20px 100px -40px rgba(99,102,241,0.7)',
      },
    },
  },
  plugins: [],
};

export default config;
