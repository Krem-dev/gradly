import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#0B1437',
          900: '#0B1437',
          800: '#0F172A',
          700: '#1E293B',
          600: '#334155',
          500: '#475569',
          400: '#64748B',
          300: '#94A3B8',
          200: '#CBD5E1',
          100: '#E2E8F0',
          50:  '#F1F5F9',
        },
        indigo: {
          DEFAULT: '#4F46E5',
          light: '#6366F1',
          dark: '#3730A3',
        },
        amber: {
          DEFAULT: '#F59E0B',
          light: '#FBBF24',
          dark: '#D97706',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          alt: '#FAFAFB',
          muted: '#F4F5F7',
        },
        success: '#10B981',
        danger: '#EF4444',

        primary: '#0B1437',
        secondary: '#4F46E5',
        background: '#FFFFFF',
        backgroundLight: '#FAFAFB',
        border: '#E2E8F0',
        textPrimary: '#0F172A',
        textSecondary: '#475569',
        warning: '#F59E0B',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
        display: ['var(--font-fraunces)', 'Fraunces', 'Georgia', 'serif'],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'monospace'],
      },
      fontSize: {
        'display-2xl': ['clamp(3rem, 6.5vw, 5.5rem)', { lineHeight: '0.95', letterSpacing: '-0.035em' }],
        'display-xl':  ['clamp(2.5rem, 5vw, 4.25rem)', { lineHeight: '1.02', letterSpacing: '-0.03em' }],
        'display-lg':  ['clamp(2.25rem, 5vw, 3.75rem)', { lineHeight: '1.05', letterSpacing: '-0.03em' }],
        'display-md':  ['clamp(1.75rem, 3.5vw, 2.5rem)', { lineHeight: '1.1',  letterSpacing: '-0.02em' }],
      },
      letterSpacing: {
        tightest: '-0.05em',
      },
      boxShadow: {
        soft: '0 1px 2px rgba(15, 23, 42, 0.04), 0 4px 16px rgba(15, 23, 42, 0.06)',
        lift: '0 8px 30px rgba(15, 23, 42, 0.08)',
        ring: '0 0 0 1px rgba(15, 23, 42, 0.08), 0 1px 2px rgba(15, 23, 42, 0.04)',
      },
      borderRadius: {
        pill: '9999px',
      },
      animation: {
        marquee: 'marquee 40s linear infinite',
        'marquee-reverse': 'marquee-reverse 40s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%':   { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'marquee-reverse': {
          '0%':   { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
    },
  },
  plugins: [],
}
export default config
