module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: ['airbnb-base'],
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  rules: {},
  overrides: [
    {
      files: ['**/*.mjs'],
      parserOptions: {
        sourceType: 'module',
      },
      rules: {
        'import/extensions': ['error', 'always'],
        'import/prefer-default-export': 'off',
      },
    },
    {
      files: ['test/**/*.mjs'],
      env: {
        mocha: true,
      },
      rules: {
        'prefer-arrow-callback': 'off',
        'func-names': 'off',
        'no-unused-expressions': 'off',
      },
    },
  ],
};
