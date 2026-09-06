/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        base: '#201f31',
        surface: '#2b2a3f',
        accent: '#a78bfa',
      },
    },
  },
  plugins: [],
};
