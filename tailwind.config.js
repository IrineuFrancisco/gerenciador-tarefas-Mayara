/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#00262b', // dark teal
        card: '#003641', // deep blue-teal
        primary: '#00ae9d', // sicoob turquoise
        secondary: '#cddc39', // sicoob lime green
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
