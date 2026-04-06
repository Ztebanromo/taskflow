/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        brand: ['Syne', 'sans-serif'],
        sans:  ['DM Sans', 'sans-serif'],
      },
      colors: {
        bg:      '#0e0e12',
        card:    '#16161d',
        card2:   '#1c1c26',
        accent:  '#7c6af7',
        accent2: '#f76a8a',
      },
      borderColor: {
        DEFAULT: 'rgba(255,255,255,0.07)',
      },
    },
  },
  plugins: [],
};
