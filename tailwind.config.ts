import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        mint: '#d9f6f0',
        peach: '#ffe7d6',
        sky: '#dff2ff',
        lilac: '#efe3ff',
        ink: '#2f3340'
      },
      boxShadow: {
        soft: '0 10px 30px rgba(38, 57, 77, 0.12)'
      }
    }
  },
  plugins: []
};

export default config;