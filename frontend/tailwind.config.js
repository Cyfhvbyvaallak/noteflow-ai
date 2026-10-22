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
        warm: {
          50: '#FFFEFA',
          100: '#FFFDF5', // Primary card/panel surface
          200: '#FFF9E8', // Main page background (Ivory/cream)
          300: '#FBF1D5', // Secondary warm background
          400: '#F4E4BA', // Soft beige border
          500: '#E8D5A0', // Warm sand border/accent
          600: '#D1B878',
          700: '#A88E4E',
          800: '#7E6631',
          900: '#52411C',
        },
        slate: {
          850: '#1E293B',
          900: '#0F172A',
          950: '#020617',
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
          800: '#065f46',
          900: '#064e3b',
        },
        purple: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'warm-sm': '0 1px 3px 0 rgba(120, 95, 40, 0.05), 0 1px 2px -1px rgba(120, 95, 40, 0.05)',
        'warm-card': '0 4px 20px -2px rgba(90, 70, 25, 0.06), 0 2px 6px -1px rgba(90, 70, 25, 0.03)',
        'warm-hover': '0 12px 30px -4px rgba(90, 70, 25, 0.12), 0 4px 10px -2px rgba(90, 70, 25, 0.05)',
        'glow-emerald': '0 0 25px -3px rgba(16, 185, 129, 0.35)',
        'glow-purple': '0 0 25px -3px rgba(139, 92, 246, 0.35)',
        'glow-cyan': '0 0 25px -3px rgba(14, 165, 233, 0.35)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'warm-mesh': 'radial-gradient(circle at 15% 15%, rgba(244, 228, 186, 0.4) 0%, transparent 45%), radial-gradient(circle at 85% 20%, rgba(209, 250, 229, 0.4) 0%, transparent 45%), radial-gradient(circle at 50% 85%, rgba(237, 233, 254, 0.35) 0%, transparent 50%)',
        'ivory-card': 'linear-gradient(145deg, #FFFFFF 0%, #FFFDF5 100%)',
      }
    },
  },
  plugins: [],
}
