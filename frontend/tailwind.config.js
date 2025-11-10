/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx,html}',
  ],
  theme: {
    extend: {
      colors: {
        primary: '#A72703',
        secondary: '#FCB53B',
        accent: '#FFE797',
        darkGreen: '#84994F',
      },
    },
  },
  plugins: [],
}

