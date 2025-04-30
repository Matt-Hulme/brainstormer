/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Primary colors
        primary: {
          1: '#FFFF70',
          2: '#EFEF99',
          3: '#FFC567',
        },
        // Secondary colors (grayscale)
        secondary: {
          0: '#FFFFFF',
          1: '#9C9CA5',
          2: '#71717B',
          3: '#56565B',
          4: '#404043',
          5: '#1D1D21',
        },
        background: '#F4F5F6',
      },
      fontFamily: {
        serif: ['Young Serif', 'serif'],
        sans: ['Chivo', 'sans-serif'],
      },
      fontSize: {
        // Headings
        h1: [
          '3.75rem',
          {
            // 60px
            lineHeight: '4.0625rem', // 65px
            letterSpacing: '-0.03em',
            fontFamily: 'Young Serif',
          },
        ],
        h3: [
          '1.5625rem',
          {
            // 25px
            lineHeight: '2.5rem', // 40px
            letterSpacing: '-0.01em',
            fontFamily: 'Young Serif',
          },
        ],
        h4: [
          '1.25rem',
          {
            // 20px
            lineHeight: '1.875rem', // 30px
            letterSpacing: '-0.01em',
            fontFamily: 'Chivo',
          },
        ],
        h5: [
          '0.875rem',
          {
            // 14px
            lineHeight: '1.35em', // 135%
            letterSpacing: '-0.01em',
            fontFamily: 'Young Serif',
          },
        ],
        // Paragraphs
        p1: [
          '1.0625rem',
          {
            // 17px
            lineHeight: '1.75rem', // 28px
            letterSpacing: '-0.02em',
            fontFamily: 'Chivo',
          },
        ],
        p2: [
          '0.9375rem',
          {
            // 15px
            lineHeight: '1.25rem', // 20px
            letterSpacing: '-0.02em',
            fontFamily: 'Chivo',
          },
        ],
        p3: [
          '0.8125rem',
          {
            // 13px
            lineHeight: '1.125rem', // 18px
            letterSpacing: '-0.02em',
            fontFamily: 'Chivo',
          },
        ],
        'p3-caps': [
          '0.8125rem',
          {
            // 13px
            lineHeight: '0.9375rem', // 15px
            letterSpacing: '0.06em',
            fontFamily: 'Chivo',
            textTransform: 'uppercase',
          },
        ],
      },
    },
  },
  plugins: [],
}
