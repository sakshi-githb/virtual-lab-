/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: '#FDFBF7',
        charcoal: '#1A1A1A',
        brutalBlue: '#3B82F6',
        brutalYellow: '#FACC15',
        brutalRed: '#EF4444',
        brutalGreen: '#10B981',
      },
      boxShadow: {
        'brutal': '4px 4px 0px 0px #1A1A1A',
        'brutal-lg': '8px 8px 0px 0px #1A1A1A',
        'brutal-xl': '12px 12px 0px 0px #1A1A1A',
        'brutal-sm': '2px 2px 0px 0px #1A1A1A',
      },
      borderWidth: {
        '3': '3px',
        '5': '5px',
      },
      fontFamily: {
        sans: ['Space Grotesk', 'Outfit', 'Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
