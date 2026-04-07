/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        'arabic': ['Cairo', 'sans-serif'],
      },
      colors: {
        spiritual: {
          dark: '#064e3b',    // Deep Emerald
          primary: '#059669', // Emerald
          light: '#ecfdf5',   // Soft mint
          gold: '#d97706',    // Warm Gold
          sand: '#fef3c7',    // Light Sand
        }
      }
    },
  },
  plugins: [],
}