/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{astro,html,js,jsx,ts,tsx,md,mdx}',
    './public/**/*.html'
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eef5ff',
          100: '#dbeaff',
          200: '#bcd4ff',
          300: '#8cb4ff',
          400: '#5f90ff',
          500: '#3b6af7',
          600: '#2d51d4',
          700: '#273fad',
          800: '#233686',
          900: '#212f6b'
        }
      }
    }
  },
  plugins: []
}

