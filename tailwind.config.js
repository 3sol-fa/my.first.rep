/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        "pastel-peach": "#FCE8D5",
        "pastel-purple": "#8E7DBE",
        "pastel-brown": "#A67B5B",
      },
    },
  },
  plugins: [],
}
