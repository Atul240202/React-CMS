/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        chesna: ['"Chesna Bold"', 'sans-serif'], // Add your custom font
        chesnal: ['"Chesna Light"', 'sans-serif'],
      },
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false, // Disable Tailwind's CSS reset
  },
};
