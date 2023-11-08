/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        grayBackground: '#23282E',
        grayCard: '#2E3339',
        grayCircle: '#3A3F45',
        grayInput: '#4FC2FB',
        grayNumber: '#2C2C2C',
        blueCircle: '#4FC2FB',
        unselectedNumber: '#A4A6A5',
      },
    },
  },
  plugins: [],
};
