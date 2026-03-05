import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: ['./app/**/*.{js,ts,jsx,tsx,mdx}', './components/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        mint: '#d9f3e4',
        sky: '#dfefff',
        sand: '#f8e7c8',
        cream: '#fff8eb',
        meadow: '#c9e6be',
        night: '#111a31',
        aurora: '#99f0d6'
      },
      borderRadius: {
        island: '1.5rem'
      },
      boxShadow: {
        float: '0 14px 36px rgba(46, 78, 72, 0.18)',
        glow: '0 0 30px rgba(153, 240, 214, 0.25)'
      },
      backgroundImage: {
        wood: 'linear-gradient(135deg, #d6b58b 0%, #c79b6d 50%, #b98258 100%)',
        island: 'radial-gradient(circle at top right, #ffffff 0%, #f2fff8 35%, #dfefff 100%)',
        nightisland: 'radial-gradient(circle at top right, #24335f 0%, #111a31 52%, #091022 100%)'
      },
      fontFamily: {
        display: ['var(--font-nunito)', 'ui-rounded', 'system-ui', 'sans-serif']
      }
    }
  },
  plugins: []
};

export default config;