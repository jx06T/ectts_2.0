/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      backgroundColor: {
        'slate-25': '#f8fdfe', // 自定义颜色
      }
    },
  },
  plugins: [],
}

