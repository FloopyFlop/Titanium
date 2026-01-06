/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        titanium: {
          50: '#f5f7fb',
          100: '#e2e8f3',
          200: '#c6d0e6',
          300: '#9aa8c7',
          400: '#7484a6',
          500: '#566584',
          600: '#3d4a60',
          700: '#2b3647',
          800: '#1c2432',
          900: '#111825',
          950: '#0a0f16',
        },
        accent: {
          400: '#7ce7ff',
          500: '#4fd2ff',
          600: '#1ab2f5',
        },
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        panel: '0 22px 60px rgba(4, 8, 16, 0.65)',
        glow: '0 0 0 1px rgba(124, 231, 255, 0.25), 0 0 22px rgba(79, 210, 255, 0.35)',
      },
    },
  },
  plugins: [],
}
