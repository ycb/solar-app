/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Fraunces'", 'serif'],
        sans: ["'Space Grotesk'", 'sans-serif']
      },
      colors: {
        sand: '#f7f3ee',
        ink: '#1f1b16',
        fern: '#0e6b4f',
        sky: '#e7f1ff',
        ocean: '#2f6fe4',
        cloud: '#f5f7fb',
        sun: '#f59f0a',
        dusk: '#334155',
        mint: '#d9f5ee'
      },
      boxShadow: {
        soft: '0 24px 60px -40px rgba(31, 27, 22, 0.6)'
      }
    }
  },
  plugins: []
};
