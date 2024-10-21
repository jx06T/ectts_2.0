/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}"
  ],
  theme: {
    extend: {
      backgroundColor: {
        'slate-25': '#f8fdfe', // 自定义颜色
        'blue-150': '#bfd4ff', // 自定义颜色
        'blue-350': '#84bdfd', // 自定义颜色
      },
      fontSize: {
        '2xs': '0.625rem', // 添加 text-2xs 类（相当于 10px）
      },
      screens: {
        // 'xs': '680px', // 添加自定义断点
        '2xs': '400px', // 添加自定义断点
        'xs': '660px', // 添加自定义断点
        's940': '940px', // 添加自定义断点
        's1200': '1200px', // 添加自定义断点
        'mdlg': '900px', // 添加自定义断点
      },
      transitionDuration: {
        '1500': '1500ms',
      },
      borderWidth : {
        '3': '3px',
      },
      zIndex: {
        60: '60',
      },
    },
  },
  plugins: [],
}

