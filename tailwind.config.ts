import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // VuVenu Brand Colors from BRANDING-VUVENU-BRIEF.md
        'vuvenu': {
          'lime': '#BFFF00',      // Accent principal, CTA, highlights
          'blue': '#60A5FA',      // Éléments graphiques, backgrounds
          'violet': '#C4B5FD',    // Sections secondaires, cards
          'rose': '#FECDD3',      // Backgrounds doux, hover states
          'cream': '#FFFBEB',     // Background principal
          'dark': '#0F172A',      // Texte principal
        },
        // Aliases for better semantic usage
        primary: {
          DEFAULT: '#BFFF00',      // vuvenu-lime
          foreground: '#0F172A',   // vuvenu-dark
        },
        secondary: {
          DEFAULT: '#60A5FA',      // vuvenu-blue
          foreground: '#FFFFFF',
        },
        accent: {
          DEFAULT: '#C4B5FD',      // vuvenu-violet
          foreground: '#0F172A',
        },
        background: '#FFFBEB',     // vuvenu-cream
        foreground: '#0F172A',     // vuvenu-dark
        muted: {
          DEFAULT: '#FECDD3',      // vuvenu-rose
          foreground: '#0F172A',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Satoshi', 'Inter', 'sans-serif'],
        accent: ['Playfair Display', 'serif'],
      },
      borderRadius: {
        lg: '16px',
        md: '8px',
        sm: '4px',
      },
      boxShadow: {
        'vuvenu': '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        'vuvenu-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      },
      animation: {
        'pixel-float': 'pixelFloat 3s ease-in-out infinite',
      },
      keyframes: {
        pixelFloat: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
    },
  },
  plugins: [],
}
export default config