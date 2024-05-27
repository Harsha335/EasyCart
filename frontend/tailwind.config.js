/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
        ubuntu:['Ubuntu', 'sans-serif'],
        OpenSans:['Open Sans', 'sans-serif'],
        PlayfairDisplay: ['Playfair Display', 'serif'],
        rubik:['Rubik','sans-serif']
      }
    },
  },
  plugins: [],
}

