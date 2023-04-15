module.exports = {
  extends: [require.resolve('@umijs/lint/dist/config/eslint')],
  globals: {
    page: true,
    REACT_APP_ENV: true,
  },
  rules: {
    '@typescript-eslint/no-unused-vars': ['off'],
    'no-param-reassign': ['off'],
    '@typescript-eslint/no-unused-expressions': ['off'],
    '@typescript-eslint/no-use-before-define': ['off'],
  },
};
