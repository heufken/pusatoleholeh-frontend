/** @type {import('tailwindcss').Config} */
module.exports = {
  darkmode: 'media',
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["'Proxima Nova'", "system-ui", "sans-serif"],
      },

      colors: {
        "custom-red": "#AD3232",
        "lavenderwhip": "#FAF5FF",
      },
    },
  },
  plugins: [],
};
