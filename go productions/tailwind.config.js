/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        chesna: ['"Chesna Bold"', 'sans-serif'],
        chesnal: ['"Chesna Light"', 'sans-serif'],
        chesnaextra: ['"Chesna ExtraBold"', 'sans-serif'],
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false, // Disable Tailwind's CSS reset
  },
};
