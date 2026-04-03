/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#0B0F1A",
        secondary: "#1A2233",
        accent: "#00FFA3",
      },
    },
  },
  plugins: [],
};