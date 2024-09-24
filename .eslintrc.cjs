module.exports = {
  parser: '@typescript-eslint/parser',
  extends: ['airbnb-base', 'plugin:@typescript-eslint/recommended', 'prettier'],
  plugins: ['@typescript-eslint'],
  env: {
    node: true,
    es2020: true,
  },
  rules: {
    'import/prefer-default-export': 'off',
    'no-console': 'off',
    '@typescript-eslint/no-unused-vars': ['error'],
    'import/no-unresolved': 'off',
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        ts: 'never',
        js: 'never',
        tsx: 'never',
        jsx: 'never',
      },
    ],
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.ts', '.tsx'],
      },
    },
  },
};
