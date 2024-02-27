/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        blue: "#3D9BE9",
        green: "#BADA55",
        sea: "#2CE1CB",
        yellow: "#FFD75C",
        red: "#F25858",
        orange: "#FDB03E",
        purple: "#D783FF",
        gray: "#D1D1D6",
      },
    },
  },
  plugins: [],
};
