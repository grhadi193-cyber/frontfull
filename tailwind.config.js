/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4F46E5',
          light:   '#818CF8',
          dark:    '#3730A3',
        },
        accent: {
          DEFAULT: '#F97316',
          light:   '#FB923C',
          dark:    '#EA580C',
        },
      },
      fontFamily: {
        sans: ['Vazirmatn', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
