/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    theme: {
      extend: {
        transitionProperty: {
          height: "height",
        },
      },
    },
  },
  plugins: [],
};
