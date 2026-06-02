/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        gold: { 300: '#e6c676', 400: '#d4a843', 500: '#c49a2e', 600: '#a8821f' },
        oldgold: { DEFAULT: '#C9A84D' },
        dark: { 700: '#2a2a3a', 800: '#1a1a2e', 900: '#0f0f1a' },
        cream: '#F5F1E8',
        porcelain: '#FBFAF8',
        warmgray: '#F3F1EE',
        success: '#2F9D66',
        danger: '#D7263D',
        muted: '#6E6B68',
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      spacing: {
        xs: '4px',
        s: '8px',
        m: '16px',
        l: '24px',
        xl: '32px',
        xxl: '48px',
      },
    },
  },
  plugins: [],
};
