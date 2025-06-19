/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{svelte,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'terminal-bg': '#000000',
        'terminal-text': '#00ff00',
      },
      fontFamily: {
        monospace: ['"VT323"', 'monospace'],
      },
    },
  },
  plugins: [],
}
