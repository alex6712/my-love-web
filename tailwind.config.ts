import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        rose: {
          50: '#fff1f2',
          100: '#ffe4e6',
          150: '#fcd2d8',
          200: '#fecdd3',
          250: '#fbc4cc',
          300: '#fda4af',
          400: '#fb7185',
          450: '#f65e7b',
          500: '#f43f5e',
          600: '#e11d48',
          700: '#be123c',
          800: '#9f1239',
          900: '#881337',
          950: '#4c0519',
        },
        lavender: {
          50: '#f5f3ff',
          100: '#ede9fe',
          150: '#ddd6fe',
          200: '#c4b5fd',
          250: '#b89fff',
          300: '#a78bfa',
          350: '#9575f7',
          400: '#8b5cf6',
          450: '#7e4df4',
          500: '#7c3aed',
          550: '#6f34d8',
          600: '#6d28d9',
          650: '#6225c4',
          700: '#5b21b6',
          750: '#4e1da5',
          800: '#4c1d95',
          850: '#40187c',
          900: '#3b0764',
          950: '#2e1065',
        },
        primary: {
          DEFAULT: '#f43f5e',
          light: '#fb7185',
          dark: '#e11d48',
        },
        secondary: {
          DEFAULT: '#a78bfa',
          light: '#c4b5fd',
          dark: '#7c3aed',
        },
        background: {
          DEFAULT: '#fdf2f8',
          dark: '#1e1b2e',
        },
        surface: {
          DEFAULT: '#ffffff',
          dark: '#2d2845',
        },
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
        '3xl': '2rem',
        '4xl': '2.5rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-up': 'slideUp 0.4s ease-out',
        'slide-down': 'slideDown 0.4s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'romantic': 'linear-gradient(135deg, #fce7f3 0%, #ddd6fe 50%, #fce7f3 100%)',
        'romantic-dark': 'linear-gradient(135deg, #2d2845 0%, #1e1b2e 50%, #2d2845 100%)',
      },
    },
  },
  plugins: [],
}

export default config
