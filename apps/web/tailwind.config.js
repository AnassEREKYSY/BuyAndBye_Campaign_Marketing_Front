const token = (name) => `rgb(var(--bb-${name}) / <alpha-value>)`

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Figtree Variable"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        bb: {
          bg: token('bg'),
          surface: token('surface'),
          card: token('card'),
          subtle: token('subtle'),
          text: token('text'),
          muted: token('muted'),
          border: token('border'),
          ring: token('primary'),
          primary: token('primary'),
          'primary-strong': token('primary-strong'),
          'primary-soft': token('primary-soft'),
          accent: token('accent'),
          'accent-strong': token('accent-strong'),
          'accent-soft': token('accent-soft'),
          success: token('success'),
          warning: token('warning'),
        },
      },
    },
  },
  plugins: [],
}
