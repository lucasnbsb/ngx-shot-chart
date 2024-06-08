/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./projects/ngx-shot-chart-demo/src/**/*.{html,ts}'],
  theme: {
    extend: {},
  },
  plugins: ['prettier-plugin-tailwindcss', require('daisyui')],
  daisyui: {
    themes: ['light', 'dark'],
  },
};
