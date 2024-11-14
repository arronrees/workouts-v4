/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: "'Martian Mono', sans-serif",
      },
      colors: {
        green: {
          dark: '#051B04',
          light: '#A3DCA1',
          mid: '#7c8d7b',
        },
        grey: '#839082',
        white: '#fff',
        beige: '#F7F4EC',
      },
    },
  },
  plugins: [require('@tailwindcss/forms')],
};
