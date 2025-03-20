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
    },
  },
  plugins: [],
}
