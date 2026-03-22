import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f5f8ff',
          100: '#e8efff',
          600: '#2f5fd0',
          700: '#264ca6'
        }
      }
    }
  },
  plugins: []
};

export default config;
