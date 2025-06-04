/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class', // Tailwind uses `.dark` class for dark mode
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {},
  },
  plugins: [], // no custom plugin needed here
};
