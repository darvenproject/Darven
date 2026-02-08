/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Premium dark mode color palette
        dark: {
          bg: '#0a0a0a',           // Pure black background
          surface: '#171717',      // Slightly lighter for cards
          'surface-hover': '#262626', // Hover states
          border: '#404040',       // Borders and dividers
          'border-light': '#525252', // Lighter borders
        },
        // Light mode enhancements
        light: {
          bg: '#ffffff',
          surface: '#fafafa',
          'surface-hover': '#f5f5f5',
          border: '#e5e5e5',
          'border-dark': '#d4d4d4',
        },
        // Accent colors that work in both modes
        accent: {
          primary: '#0a0a0a',
          'primary-dark': '#fafafa',
          secondary: '#525252',
          'secondary-dark': '#a3a3a3',
        },
      },
      backgroundColor: {
        // Dynamic backgrounds
        'card': 'var(--card-bg)',
        'card-hover': 'var(--card-hover-bg)',
      },
      borderColor: {
        DEFAULT: 'var(--border-color)',
      },
      textColor: {
        primary: 'var(--text-primary)',
        secondary: 'var(--text-secondary)',
        tertiary: 'var(--text-tertiary)',
      },
      boxShadow: {
        // Premium shadows
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'DEFAULT': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        'inner': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
        // Dark mode shadows
        'dark-sm': '0 1px 2px 0 rgba(0, 0, 0, 0.8)',
        'dark': '0 1px 3px 0 rgba(0, 0, 0, 0.8), 0 1px 2px 0 rgba(255, 255, 255, 0.03)',
        'dark-md': '0 4px 6px -1px rgba(0, 0, 0, 0.8), 0 2px 4px -1px rgba(255, 255, 255, 0.03)',
        'dark-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.8), 0 4px 6px -2px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(255, 255, 255, 0.05)',
        'dark-xl': '0 20px 25px -5px rgba(0, 0, 0, 0.8), 0 10px 10px -5px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.05)',
        'dark-2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.9), 0 0 0 1px rgba(255, 255, 255, 0.05)',
        // Glow effects
        'glow': '0 0 20px rgba(255, 255, 255, 0.5)',
        'glow-lg': '0 0 40px rgba(255, 255, 255, 0.6)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-down': 'slideDown 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-left': 'slideLeft 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-right': 'slideRight 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'scale-in': 'scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'shimmer': 'shimmer 2s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideLeft: {
          '0%': { opacity: '0', transform: 'translateX(30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        slideRight: {
          '0%': { opacity: '0', transform: 'translateX(-30px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.9)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-1000px 0' },
          '100%': { backgroundPosition: '1000px 0' },
        },
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-mesh-light': `
          radial-gradient(at 0% 0%, rgba(250, 250, 250, 0.3) 0px, transparent 50%),
          radial-gradient(at 100% 0%, rgba(240, 240, 240, 0.3) 0px, transparent 50%),
          radial-gradient(at 100% 100%, rgba(245, 245, 245, 0.3) 0px, transparent 50%),
          radial-gradient(at 0% 100%, rgba(235, 235, 235, 0.3) 0px, transparent 50%)
        `,
        'gradient-mesh-dark': `
          radial-gradient(at 0% 0%, rgba(64, 64, 64, 0.3) 0px, transparent 50%),
          radial-gradient(at 100% 0%, rgba(38, 38, 38, 0.3) 0px, transparent 50%),
          radial-gradient(at 100% 100%, rgba(52, 52, 52, 0.3) 0px, transparent 50%),
          radial-gradient(at 0% 100%, rgba(23, 23, 23, 0.3) 0px, transparent 50%)
        `,
      },
      backdropBlur: {
        xs: '2px',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '100': '25rem',
        '128': '32rem',
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.75rem' }],
      },
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },
      transitionTimingFunction: {
        'bounce-in': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
}