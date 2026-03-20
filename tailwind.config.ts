import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: 'var(--color-bg-primary)',
          secondary: 'var(--color-bg-secondary)',
          elevated: 'var(--color-bg-elevated)',
        },
        yolk: {
          DEFAULT: 'var(--color-yolk)',
          light: 'var(--color-yolk-light)',
          deep: 'var(--color-yolk-deep)',
        },
        text: {
          primary: 'var(--color-text-primary)',
          secondary: 'var(--color-text-secondary)',
          muted: 'var(--color-text-muted)',
        },
        cream: 'var(--color-cream)',
        shell: 'var(--color-shell)',
        success: 'var(--color-success)',
        error: 'var(--color-error)',
      },
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        heading: ['Instrument Serif', 'serif'],
        body: ['Satoshi', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      fontSize: {
        'hero': ['clamp(2.5rem, 8vw + 1rem, 7.5rem)', { lineHeight: '0.95', letterSpacing: '-0.03em' }],
        'section': ['clamp(1.75rem, 4vw + 0.5rem, 4rem)', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'body': ['clamp(0.875rem, 1vw + 0.5rem, 1.125rem)', { lineHeight: '1.65' }],
      },
      spacing: {
        'section': '120px',
      },
    },
  },
  plugins: [],
};

export default config;
