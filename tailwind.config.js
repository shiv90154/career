/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand Colors
        primary: {
          DEFAULT: '#0B1C2D',
          light: '#1E3A5F',
          dark: '#061119',
          50: '#F0F4F8',
          100: '#D9E2EC',
          200: '#BCCCDC',
          300: '#9FB3C8',
          400: '#829AB1',
          500: '#627D98',
          600: '#486581',
          700: '#334E68',
          800: '#243B53',
          900: '#0B1C2D',
        },
        accent: {
          DEFAULT: '#F7E600',
          light: '#F9EC33',
          dark: '#E6D000',
          50: '#FFFEF0',
          100: '#FFFACC',
          200: '#FFF499',
          300: '#FFED66',
          400: '#F7E600',
          500: '#E6D000',
          600: '#CCB800',
          700: '#B3A000',
          800: '#998800',
          900: '#806F00',
        },
        highlight: {
          DEFAULT: '#D90000',
          light: '#E63333',
          dark: '#B30000',
          50: '#FFF0F0',
          100: '#FFCCCC',
          200: '#FF9999',
          300: '#FF6666',
          400: '#FF3333',
          500: '#D90000',
          600: '#B30000',
          700: '#990000',
          800: '#800000',
          900: '#660000',
        },
        // Background Colors
        'bg-light-grey': '#F5F7FA',
        // Text Colors
        'text-heading': '#0F172A',
        'text-body': '#334155',
        'text-muted': '#64748B',
        // Semantic Colors
        success: '#10B981',
        warning: '#F7E600',
        error: '#D90000',
        info: '#0B1C2D',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      spacing: {
        'xs': '0.25rem',
        'sm': '0.5rem',
        'md': '1rem',
        'lg': '1.5rem',
        'xl': '2rem',
        '2xl': '3rem',
      },
      borderRadius: {
        'sm': '0.25rem',
        'md': '0.5rem',
        'lg': '1rem',
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      },
      animation: {
        'fade-in': 'fade-in 0.5s ease',
        'shake': 'shake 0.5s ease',
        'spin': 'spin 1s linear infinite',
      },
      keyframes: {
        'fade-in': {
          'from': {
            opacity: '0',
            transform: 'translateY(-10px)',
          },
          'to': {
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        'shake': {
          '0%, 100%': { transform: 'translateX(0)' },
          '10%, 30%, 50%, 70%, 90%': { transform: 'translateX(-5px)' },
          '20%, 40%, 60%, 80%': { transform: 'translateX(5px)' },
        },
        'spin': {
          'from': { transform: 'rotate(0deg)' },
          'to': { transform: 'rotate(360deg)' },
        },
      },
    },
  },
  plugins: [],
}