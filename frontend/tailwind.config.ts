import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        navy: { 50: '#f0f3ff', 100: '#dde3ff', 200: '#c2cbff', 300: '#96a4ff', 400: '#6470ff', 500: '#3b3fff', 600: '#2418f5', 700: '#1a0fd6', 800: '#1610a8', 900: '#0f1163', 950: '#0a0b3b' },
        gold: { 50: '#fefce8', 100: '#fef9c3', 200: '#fef08a', 300: '#fde047', 400: '#facc15', 500: '#c9a84c', 600: '#a38429', 700: '#856a1e', 800: '#6b5518', 900: '#523f12' },
      },
    },
  },
  plugins: [],
};

export default config;
