/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './components/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: { 900: '#050d1f', 800: '#0a1628', 700: '#0f1f3d', 600: '#1a3560', 500: '#1e3a5f' },
        gold: { 400: '#f0d48a', 500: '#d4a853', 600: '#b8923a' },
        cream: '#fef9f0',
      },
      fontFamily: { display: ['Playfair Display', 'serif'], sans: ['Inter', 'sans-serif'] },
      animation: { 'float': 'float 6s ease-in-out infinite', 'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite', 'spin-slow': 'spin 20s linear infinite' },
      keyframes: {
        float: { '0%, 100%': { transform: 'translateY(0px)' }, '50%': { transform: 'translateY(-20px)' } }
      }
    },
  },
  plugins: [],
}
