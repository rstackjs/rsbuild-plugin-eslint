export default [
  {
    ignores: ['dist'],
  },
  {
    files: ['src/**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        console: 'readonly',
        document: 'readonly',
      },
    },
    rules: {
      'no-undef': 'error',
    },
  },
];
