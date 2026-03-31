/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: { sans: ['Manrope', 'sans-serif'] },
      colors: {
        vitality: {
          blue:    '#0055BB',
          red:     '#B32F2F',
          redbg:   '#FDECEA',
          orange:  '#E65100',
          green:   '#2E7D32',
          slate:   '#F8FAFC',
        },
      },
      keyframes: {
        blink: { '0%,100%': { opacity: 1 }, '50%': { opacity: 0.3 } },
      },
      animation: {
        blink: 'blink 1.2s ease-in-out infinite',
      },
    },
  },
  plugins: [],
};
