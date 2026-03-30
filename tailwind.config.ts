import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        neutral: {
          0: 'var(--color-neutral-0)',
          50: 'var(--color-neutral-50)',
          100: 'var(--color-neutral-100)',
          200: 'var(--color-neutral-200)',
          300: 'var(--color-neutral-300)',
          500: 'var(--color-neutral-500)',
          700: 'var(--color-neutral-700)',
          900: 'var(--color-neutral-900)'
        },
        state: {
          info: {
            50: 'var(--color-state-info-50)',
            100: 'var(--color-state-info-100)',
            600: 'var(--color-state-info-600)',
            700: 'var(--color-state-info-700)'
          },
          success: {
            50: 'var(--color-state-success-50)',
            100: 'var(--color-state-success-100)',
            600: 'var(--color-state-success-600)',
            700: 'var(--color-state-success-700)'
          },
          warning: {
            50: 'var(--color-state-warning-50)',
            100: 'var(--color-state-warning-100)',
            600: 'var(--color-state-warning-600)',
            700: 'var(--color-state-warning-700)'
          },
          error: {
            50: 'var(--color-state-error-50)',
            100: 'var(--color-state-error-100)',
            600: 'var(--color-state-error-600)',
            700: 'var(--color-state-error-700)'
          }
        },
        brand: {
          50: 'var(--color-brand-blue-50)',
          100: 'var(--color-brand-blue-100)',
          500: 'var(--color-brand-blue-500)',
          600: 'var(--color-brand-blue-600)',
          700: 'var(--color-brand-blue-700)',
          blue: {
            50: 'var(--color-brand-blue-50)',
            100: 'var(--color-brand-blue-100)',
            500: 'var(--color-brand-blue-500)',
            600: 'var(--color-brand-blue-600)',
            700: 'var(--color-brand-blue-700)'
          },
          purple: {
            50: 'var(--color-brand-purple-50)',
            100: 'var(--color-brand-purple-100)',
            500: 'var(--color-brand-purple-500)',
            600: 'var(--color-brand-purple-600)',
            700: 'var(--color-brand-purple-700)'
          }
        }
      },
      spacing: {
        1: 'var(--space-1)',
        2: 'var(--space-2)',
        3: 'var(--space-3)',
        4: 'var(--space-4)',
        5: 'var(--space-5)',
        6: 'var(--space-6)',
        7: 'var(--space-7)',
        8: 'var(--space-8)'
      },
      borderRadius: {
        sm: 'var(--radius-sm)',
        md: 'var(--radius-md)',
        lg: 'var(--radius-lg)',
        xl: 'var(--radius-xl)',
        full: 'var(--radius-full)'
      },
      boxShadow: {
        'token-sm': 'var(--shadow-sm)',
        'token-md': 'var(--shadow-md)',
        'token-lg': 'var(--shadow-lg)'
      },
      transitionDuration: {
        fast: 'var(--motion-duration-fast)',
        base: 'var(--motion-duration-base)',
        slow: 'var(--motion-duration-slow)'
      },
      transitionTimingFunction: {
        standard: 'var(--motion-ease-standard)'
      }
    }
  },
  plugins: []
};

export default config;
