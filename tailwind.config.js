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
        accent: '#1fdf64',
        'accent-dark': '#19b853',
        deep: '#121212',
        midnight: '#181818',
        evening: '#1a1a1a',
        'dark-gray': '#282828',
        'slate-gray': '#404040',
        'light-gray': '#959595',
        silver: '#B3B3B3',
        snow: '#ffffff',
        // Keep legacy aliases for any remaining references
        luxury: {
          yellow: '#1fdf64',
          yellowDark: '#19b853',
          gold: '#17a84b',
          zinc: {
            950: '#000000',
            900: '#121212',
            800: '#181818',
          }
        }
      },
      fontFamily: {
        sans: ['Manrope', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif'],
      },
      animation: {
        'marquee-slow': 'marquee 40s linear infinite',
        'marquee-reverse': 'marquee-rev 40s linear infinite',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' }
        },
        'marquee-rev': {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0%)' }
        }
      }
    },
  },
  plugins: [],
}
