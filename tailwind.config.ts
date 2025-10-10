import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  safelist: [
    'album-beige',
    'album-blue-gray',
    'album-light-gray',
    'album-purple',
    'album-teal',
    'album-pink',
  ],
  theme: {
    extend: {
      fontFamily: {
        'noto-serif': ['Noto Serif JP', 'serif'],
      },
      colors: {
        // Brand colors from globals.css
        'brand-beige': 'hsl(35 22% 91%)',
        'brand-blue-gray': 'hsl(210 20% 70%)',
        'brand-purple': 'hsl(260 15% 75%)',
        'brand-teal': 'hsl(180 25% 25%)',
        'brand-light-gray': 'hsl(0 0% 91%)',
      },
      spacing: {
        'header': '80px',
        'container': '24px',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'pulse-soft': 'pulseSoft 3s ease-in-out infinite',
        'bounce': 'bounce 1s infinite',
        'bounce-twice': 'bounce 1s ease-in-out 2',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '0.3', transform: 'scale(1)' },
          '50%': { opacity: '0.5', transform: 'scale(1.1)' },
        },
        bounce: {
          '0%, 100%': {
            transform: 'translateY(-25%)',
            animationTimingFunction: 'cubic-bezier(0.8, 0, 1, 1)',
          },
          '50%': {
            transform: 'translateY(0)',
            animationTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)',
          },
        },
      },
      borderWidth: {
        '3': '3px',
      },
    },
  },
  plugins: [],
}
export default config