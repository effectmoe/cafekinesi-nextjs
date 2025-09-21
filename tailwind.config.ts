import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
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
      }
    },
  },
  plugins: [],
}
export default config