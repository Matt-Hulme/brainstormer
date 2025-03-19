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
      spacing: {
        ...Object.fromEntries(
          Array.from({ length: 200 }, (_, i) => [i / 2, `${i * 2}px`])
        ),
      },
      colors: {
        'primary-1': '#FFE81A',
        'primary-2': '#FFF066',
        'secondary-1': '#666666',
        'secondary-2': '#4D4D4D',
        'secondary-3': '#333333',
        'secondary-4': '#1A1A1A',
        'secondary-5': '#0D0D0D',
        background: '#121212',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [],
}
