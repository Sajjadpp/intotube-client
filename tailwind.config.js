export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  plugins: [require('tailwind-scrollbar-hide')],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        // New color palette
        primary: {
          DEFAULT: '#FF0000', // YouTube red
          50: '#FFEBEE',
          100: '#FFCDD2',
          200: '#EF9A9A',
          300: '#E57373',
          400: '#EF5350',
          500: '#FF0000', // Base red
          600: '#E53935',
          700: '#D32F2F',
          800: '#C62828',
          900: '#B71C1C',
        },
        dark: {
          DEFAULT: '#0F0F0F', // Darker than YouTube's default
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0F0F0F', // Base dark
        },
        accent: {
          DEFAULT: '#3DA6FF', // Bright blue for CTAs
          dark: '#1E88E5',
        },
        text: {
          primary: '#FFFFFF',
          secondary: '#AAAAAA',
          inverted: '#0F0F0F',
        },
        ui: {
          card: '#212121',
          divider: '#383838',
          hover: '#303030',
        },
      },
      // Your existing animations (unchanged)
      animation: {
        'ping-slow': 'ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite',
        'pulse-slow': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'button-pop': 'button-pop 0.4s ease-out',
        'float': 'float 3s ease-in-out infinite',
        'bounce-soft': 'bounce-soft 1.5s infinite',
        'heartbeat': 'heartbeat 1.5s ease-in-out infinite',
        'ripple': 'ripple 1.5s ease-out infinite',
        'spin-slow': 'spin 3s linear infinite',
        'like-bounce': 'like-bounce 0.6s ease',
        'dislike-shake': 'dislike-shake 0.4s ease',
        'save-glow': 'save-glow 2s ease-in-out infinite',
        'share-float': 'share-float 2.5s ease-in-out infinite'
      },
      keyframes: {
        // Your existing keyframes (unchanged)
        ping: {
          '75%, 100%': { transform: 'scale(1.5)', opacity: '0' }
        },
        'button-pop': {
          '0%': { transform: 'scale(0.95)' },
          '40%': { transform: 'scale(1.05)' },
          '100%': { transform: 'scale(1)' }
        },
        // ... (keep all your existing keyframes)
      },
      transitionProperty: {
        'height': 'height',
        'spacing': 'margin, padding',
        'transform': 'transform'
      }
    }
  }
}