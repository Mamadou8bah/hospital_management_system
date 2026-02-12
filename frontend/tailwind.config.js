/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
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
