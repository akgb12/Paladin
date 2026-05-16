import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Bricolage Grotesque"', '"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      colors: {
        ink: {
          50: '#fbf8f1',
          100: '#f4eedf',
          200: '#e8dcbf',
          300: '#d4c595',
          400: '#a89a78',
          500: '#736b54',
          600: '#4b4636',
          700: '#2d2a20',
          800: '#1a1812',
          900: '#0c0b08',
          950: '#050402',
        },
        parchment: {
          50: '#fffaf0',
          100: '#fdf2d8',
          200: '#fae5b4',
          300: '#f5d488',
        },
        gold: {
          50: '#fffaeb',
          100: '#fdf0c6',
          200: '#fce088',
          300: '#fbc94b',
          400: '#f9b224',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        mint: {
          50: '#ecfdf5',
          100: '#d1fae5',
          200: '#a7f3d0',
          300: '#6ee7b7',
          400: '#34d399',
          500: '#10b981',
          600: '#059669',
        },
        berry: {
          400: '#f472b6',
          500: '#ec4899',
          600: '#db2777',
        },
      },
      boxShadow: {
        brutal: '4px 4px 0 0 #0c0b08',
        'brutal-sm': '2px 2px 0 0 #0c0b08',
        'brutal-lg': '6px 6px 0 0 #0c0b08',
        'brutal-gold': '4px 4px 0 0 #b45309',
        'brutal-mint': '4px 4px 0 0 #059669',
        soft: '0 2px 4px rgba(12,11,8,0.04), 0 8px 24px rgba(12,11,8,0.06)',
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 45%, #d97706 100%)',
        'mint-gradient': 'linear-gradient(135deg, #6ee7b7 0%, #34d399 45%, #10b981 100%)',
        'dot-grid':
          'radial-gradient(circle at 1px 1px, rgba(12,11,8,0.10) 1px, transparent 0)',
        'plus-grid':
          "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24'><path d='M11 9h2v6h-2zM9 11h6v2H9z' fill='%230c0b08' fill-opacity='0.08'/></svg>\")",
      },
      keyframes: {
        floaty: {
          '0%, 100%': { transform: 'translateY(0px) rotate(-2deg)' },
          '50%': { transform: 'translateY(-8px) rotate(2deg)' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
      animation: {
        floaty: 'floaty 5s ease-in-out infinite',
        wiggle: 'wiggle 2.5s ease-in-out infinite',
        marquee: 'marquee 28s linear infinite',
      },
    },
  },
  plugins: [],
}

export default config
