/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./ngx-shot-chart-demo/src/**/*.{html,ts}', './projects/ngx-shot-chart-demo/src/**/*.{html,ts}'],
  theme: {
    extend: {},
  },
  plugins: ['prettier-plugin-tailwindcss', require('daisyui')],
  daisyui: {
    themes: ['lemonade', 'dark'],
  },
};
