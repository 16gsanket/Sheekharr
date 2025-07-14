/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
       colors: {
        primary: {
          blue_primary:"#1f3a8b",
          blue_secondary:"",
          blue_tertiary:"",
          green_primary:"#b1f5c8",
          green_secondary:"",
          green_tertiary:""
        }
        },
    },
  },
  plugins: [],
}