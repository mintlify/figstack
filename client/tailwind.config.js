const typography = require('@tailwindcss/typography');

module.exports = {
  purge: process.env.NODE_ENV === 'development' ? [] : ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    fontFamily: {
      sans: ['alliance', 'sans'],
    },
    extend: {
      colors: {
        primary: '#2434C2',
        'primary-active': '#0E1C92',
        secondary: '#F43A93',
        'secondary-active': '#DC1574',
        hero: '#05114B',
        'fig-orange': '#E9372C',
        'fig-pink': '#EC1E75',
        'fig-yellow': '#F5AE23',
        'fig-green': '#12CA93',
        'fig-purple': '#5D30DB',
      },
      fontFamily: {
        dystopian: ['dystopian', 'sans-serif'],
      },
    },
  },
  variants: {
  },
  plugins: [
    typography,
  ],
};
