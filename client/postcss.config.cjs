/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    'postcss-flexbugs-fixes': {},
    '@tailwindcss/postcss7-compat': {},
    autoprefixer: {},
    'postcss-preset-env': {
      stage: 3,
      features: {
        'nesting-rules': true
      }
    }
  },
};

export default config;