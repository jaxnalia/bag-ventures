/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        primary: '#ff3e00',
        secondary: '#676778',
        background: '#13151c',
        'card-bg': '#1c1f2a',
      },
    },
  },
  plugins: [],
}