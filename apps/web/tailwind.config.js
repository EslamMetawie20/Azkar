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
          dark: '#C5A67E',    // Deep Gold/Sand
          medium: '#D1B996',  // Medium Sand
          accent: '#DDCBB0',  // Accent Sand
          light: '#EAD6CA',   // Light Beige
          paper: '#F8F0E5',   // Lightest Paper/Background
        }
      }
    },
  },
  plugins: [],
}