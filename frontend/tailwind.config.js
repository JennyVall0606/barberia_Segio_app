/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#fdf6ee',
          100: '#f9e4c8',
          200: '#f3c88f',
          300: '#eca54c',
          400: '#e68a22',
          500: '#c96e12',
          600: '#a4540e',
          700: '#7e3f10',
          800: '#5c2e12',
          900: '#3a1c0b',
        },
      },
    },
  },
  plugins: [],
}
