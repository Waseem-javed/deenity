/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/app/**/*.{js,jsx,ts,tsx}", "./src/components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#ecfdf8",
          100: "#d1faf0",
          200: "#a4f2e1",
          300: "#6de3cc",
          400: "#3bcab0",
          500: "#1ba894",
          600: "#0f8478",
          700: "#005A5A",
          800: "#0a4545",
          900: "#0b3232",
        },
      },
    },
  },
  plugins: [],
};
