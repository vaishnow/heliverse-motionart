/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        light: "#eee5ff",
        dark: "#0e0f1a",
        gl:"#F87516",
        gr:"#5E11FF"
      },
      fontFamily: {
        outfit: ["Outfit", "sans-serif"],
        sora: ["Sora", "sans-serif"]
      }
    },
  },
  plugins: [],
}

