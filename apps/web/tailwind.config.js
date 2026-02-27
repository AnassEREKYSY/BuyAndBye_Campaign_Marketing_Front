export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bb: {
          bg: 'rgb(var(--bb-bg) / <alpha-value>)',
          surface: 'rgb(var(--bb-surface) / <alpha-value>)',
          card: 'rgb(var(--bb-card) / <alpha-value>)',
          text: 'rgb(var(--bb-text) / <alpha-value>)',
          muted: 'rgb(var(--bb-muted) / <alpha-value>)',
          border: 'rgb(var(--bb-border) / <alpha-value>)',
          ring: 'rgb(var(--bb-ring) / <alpha-value>)',
        },
      },
      boxShadow: {
        bb: '0 24px 80px rgba(0,0,0,.45)',
        'bb-light': '0 24px 70px rgba(15,23,42,.10)',
      },
    },
  },
  plugins: [],
}