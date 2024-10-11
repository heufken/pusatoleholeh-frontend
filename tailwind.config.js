/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        avenir: ["Avenir", "sans-serif"],
      },

      colors: {
        "custom-red": "#AD3232",
      },
    },
  },
  plugins: [],
};
