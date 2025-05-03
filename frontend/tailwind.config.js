/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ['class'],
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          1: '#FFFF70',
          2: '#EFEF99',
          3: '#FFC567',
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          0: '#FFFFFF',
          1: '#9C9CA5',
          2: '#71717B',
          3: '#56565B',
          4: '#404043',
          5: '#1D1D21',
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        background: '#F4F5F6',
        foreground: 'hsl(var(--foreground))',
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        chart: {
          1: 'hsl(var(--chart-1))',
          2: 'hsl(var(--chart-2))',
          3: 'hsl(var(--chart-3))',
          4: 'hsl(var(--chart-4))',
          5: 'hsl(var(--chart-5))',
        },
        color: {
          'primary-1': '#FFFF70',
          'primary-2': '#EFEF99',
          'primary-3': '#FFC567',
          'secondary-0': '#FFFFFF',
          'secondary-1': '#9C9CA5',
          'secondary-2': '#71717B',
          'secondary-3': '#56565B',
          'secondary-4': '#404043',
          'secondary-5': '#1D1D21',
          background: '#F4F5F6',
        },
      },
      fontFamily: {
        serif: ['Young Serif', 'serif'],
        sans: ['Chivo', 'sans-serif'],
      },
      fontSize: {
        h1: [
          '3.75rem',
          {
            lineHeight: '4.0625rem',
            letterSpacing: '-0.03em',
            fontFamily: 'Young Serif',
          },
        ],
        h3: [
          '1.5625rem',
          {
            lineHeight: '2.5rem',
            letterSpacing: '-0.01em',
            fontFamily: 'Young Serif',
          },
        ],
        h4: [
          '1.25rem',
          {
            lineHeight: '1.875rem',
            letterSpacing: '-0.01em',
            fontFamily: 'Chivo',
          },
        ],
        h5: [
          '0.875rem',
          {
            lineHeight: '1.35em',
            letterSpacing: '-0.01em',
            fontFamily: 'Young Serif',
          },
        ],
        p1: [
          '1.0625rem',
          {
            lineHeight: '1.75rem',
            letterSpacing: '-0.02em',
            fontFamily: 'Chivo',
          },
        ],
        p2: [
          '0.9375rem',
          {
            lineHeight: '1.25rem',
            letterSpacing: '-0.02em',
            fontFamily: 'Chivo',
          },
        ],
        p3: [
          '0.8125rem',
          {
            lineHeight: '1.125rem',
            letterSpacing: '-0.02em',
            fontFamily: 'Chivo',
          },
        ],
        'p3-caps': [
          '0.8125rem',
          {
            lineHeight: '0.9375rem',
            letterSpacing: '0.06em',
            fontFamily: 'Chivo',
            textTransform: 'uppercase',
          },
        ],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [
    require('tailwindcss-animate'),
    function ({ addUtilities, theme }) {
      const colorUtilities = {}
      const colors = theme('colors.color')

      for (const colorName in colors) {
        colorUtilities[`.color-${colorName}`] = {
          color: colors[colorName],
        }
      }

      addUtilities(colorUtilities)
    },
  ],
}
