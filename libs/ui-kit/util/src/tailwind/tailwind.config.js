const { createGlobPatternsForDependencies } = require('@nx/react/tailwind');
const { join } = require('path');
const TailwindAnimate = require('tailwindcss-animate');


/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    join(
      './{src,pages,components,app}/**/*!(*.stories|*.spec).{ts,tsx,html}'
    ),
    join(
      __dirname,
      '../../../ui/**/*.{js,jsx,ts,tsx}'
    ),
    ...createGlobPatternsForDependencies(__dirname),
  ],
  theme: {
    extend: {},
  },
  plugins: [TailwindAnimate],
};
