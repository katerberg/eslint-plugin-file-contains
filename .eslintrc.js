module.exports = {
  root: true,
  extends: [
    'eslint:recommended',
    'plugin:eslint-plugin/recommended',
    'plugin:node/recommended',
    'prettier',
    'plugin:jsdoc/recommended',
  ],
  plugins: ['prettier', 'jsdoc'],
  rules: {
    'prettier/prettier': 'error',
  },
  env: {
    node: true,
  },
  overrides: [
    {
      files: ['tests/**/*.js'],
      env: { mocha: true },
    },
  ],
};
