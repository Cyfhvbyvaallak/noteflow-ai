/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          950: '#030712', // Deepest black-navy
          900: '#0b0f19', // Main surface background
          850: '#111827', // Glass surface background
          800: '#1e293b', // Elevated card border
          750: '#283548',
          700: '#334155',
        },
        brand: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981', // Emerald primary
          600: '#059669',
          700: '#047857',
        },
        neon: {
          cyan: '#06b6d4',
          blue: '#3b82f6',
          purple: '#8b5cf6',
          violet: '#a855f7',
          emerald: '#10b981',
          rose: '#f43f5e',
          amber: '#f59e0b',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'glass-card': '0 8px 32px 0 rgba(0, 0, 0, 0.4), inset 0 1px 0 0 rgba(255, 255, 255, 0.1)',
        'glass-hover': '0 16px 40px 0 rgba(0, 0, 0, 0.6), inset 0 1px 0 0 rgba(255, 255, 255, 0.2)',
        'glow-emerald': '0 0 30px -4px rgba(16, 185, 129, 0.4)',
        'glow-purple': '0 0 35px -4px rgba(139, 92, 246, 0.45)',
        'glow-cyan': '0 0 35px -4px rgba(6, 182, 212, 0.45)',
        'glow-blue': '0 0 35px -4px rgba(59, 130, 246, 0.45)',
        'glow-rose': '0 0 30px -4px rgba(244, 63, 94, 0.45)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'dark-mesh': 'radial-gradient(circle at 15% 15%, rgba(139, 92, 246, 0.12) 0%, transparent 40%), radial-gradient(circle at 85% 20%, rgba(6, 182, 212, 0.12) 0%, transparent 40%), radial-gradient(circle at 50% 85%, rgba(16, 185, 129, 0.1) 0%, transparent 50%)',
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.07) 0%, rgba(255, 255, 255, 0.02) 100%)',
        'card-gradient': 'linear-gradient(145deg, rgba(30, 41, 59, 0.7) 0%, rgba(15, 23, 42, 0.8) 100%)',
      }
    },
  },
  plugins: [],
}
