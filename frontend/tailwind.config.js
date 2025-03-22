/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      fontFamily: {
        londrina: ['"Londrina Solid"', 'sans-serif'],
        chivo: ['Chivo', 'sans-serif'],
      },
      spacing: {
        ...Object.fromEntries(
          Array.from({ length: 200 }, (_, i) => [i / 2, `${i * 2}px`])
        ),
      },
      colors: {
        'primary-1': '#FFFF70',
        'primary-2': '#FFF59A',
        'secondary-1': '#9C9CA5',
        'secondary-2': '#4D4D4D',
        'secondary-3': '#333333',
        'secondary-4': '#404043',
        'secondary-5': '#1D1D21',
        'secondary-6': '#313133',
        'secondary-7': '#9898A3',
        background: '#222223',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      fontSize: {
        'header-1': [
          '40px',
          {
            lineHeight: '50px',
            fontWeight: '400',
            fontFamily: '"Londrina Solid", sans-serif',
          },
        ],
        'header-2': [
          '30px',
          {
            lineHeight: '40px',
            fontWeight: '400',
            fontFamily: '"Londrina Solid", sans-serif',
          },
        ],
        'body-large': [
          '20px',
          {
            lineHeight: '30px',
            fontWeight: '400',
            fontFamily: 'Chivo, sans-serif',
          },
        ],
        'body-medium': [
          '15px',
          {
            lineHeight: '35px',
            fontWeight: '600',
            fontFamily: 'Chivo, sans-serif',
          },
        ],
        'body-small': [
          '15px',
          {
            lineHeight: '25px',
            fontWeight: '500',
            fontFamily: 'Chivo, sans-serif',
          },
        ],
      },
    },
  },
  plugins: [],
}
