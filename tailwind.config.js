/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: { DEFAULT: '#FFD000', dark: '#ffc000' },
        dbg:     '#1a1a1a',
        dcard:   '#2a2a2a',
        dcard2:  '#222222',
        dborder: '#3a3a3a',
        dinput:  '#333333',
        dtext:   '#e0e0e0',
        dmuted:  '#a0a0a0',
        dsuccess:'#22c55e',
        ddanger: '#ef4444',
      },
      fontFamily: {
        cairo: ['Cairo', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        heavyGlow: {
          '0%':   { textShadow: '0 0 4px rgba(255,255,255,.2), 0 0 10px rgba(255,215,0,.3), 0 0 20px rgba(218,165,32,.4)' },
          '100%': { textShadow: '0 0 6px rgba(255,255,255,.3), 0 0 16px rgba(255,215,0,.4), 0 0 35px rgba(218,165,32,.5)' },
        },
        fadeInUp: {
          '0%':   { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        shimmer: {
          '0%':   { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        'heavy-glow':  'heavyGlow 2.5s ease-in-out infinite alternate',
        'fade-in-up':  'fadeInUp .5s ease-out both',
        'shimmer':     'shimmer 2s linear infinite',
      },
    },
  },
  plugins: [],
}
