const { transform } = require('typescript');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content:  [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors : {
        secondary: '#263238',
        primary: '#4CAF4F',
      },
      keyframes: {
        marquee: {
          '100%': {
            transform: 'translateY(-50%)'
          }
        },
        "fade-in": {
          from: {
            opacity: 0
          },
          to: {
            opacity: "1"
          }
        }
      },
      animation: {
        marquee: 'marquee var(--marquee-duration) linear infinite',
        "fade-in": "fade-in 0.5s linear forwards"
      }
    },
  },
  plugins: [],
}

