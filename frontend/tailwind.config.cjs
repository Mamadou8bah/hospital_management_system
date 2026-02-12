/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#056B3A',
          foreground: '#FFFFFF',
        },
        secondary: {
          DEFAULT: '#F8F9FA',
          foreground: '#1A1A1A',
        },
        muted: {
          DEFAULT: '#F1F3F5',
          foreground: '#6C757D',
        }
      }
    },
  },
  plugins: [],
}
