/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./App.tsx",
    "./index.ts",
    "./assets/**/*.{js,ts,jsx,tsx}",
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {},
  },
  plugins: [],
}
