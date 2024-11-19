/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['index.html', './src/**/*.js'],
  theme: {
    extend: {
      animation: {
        fadeIn: "fadeIn 1s ease-in-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: 0 },
          "100%": { opacity: 1 },
        },
      },
      transitionProperty: {
        opacity: "opacity",
      },
      fontFamily: {
        geist: [
          'Geist Mono',
          ],
        exo: [
          'Exo',
          ]
      }
    },
  },
  plugins: [],
}

