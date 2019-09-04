const baseRules = require('eslint-config-airbnb-base/rules/style');
const [, ...restricted] = baseRules.rules['no-restricted-syntax'];

const PATHS = require('./settings/paths');

module.exports = {
  extends: [
    'airbnb',
    "eslint:recommended",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended"
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  env: {
    node: true,
    browser: false,
    'jest/globals': true,
  },
  plugins: [
    'babel',
    'import',
    'typescript',
    '@typescript-eslint',
    'compat',
    'jsx-a11y',
    'jest',
  ],
  rules: {
    // General
    'require-atomic-updates': 0,
    '@typescript-eslint/no-explicit-any': 0,
    'arrow-parens': ['error', 'as-needed'],
    'function-paren-newline': ["error", "consistent"],
    'object-curly-newline': ["error", { consistent: true }],
    'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
    'linebreak-style': 0,
    'global-require': 0,
    'no-restricted-syntax': [2,
      ...restricted.filter(
        r => !['ForOfStatement'].includes(r.selector)
      ),
    ],

    // React
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
    'react/forbid-prop-types': [1, { forbid: ['any']} ],
    'react/prefer-stateless-function': [2, { ignorePureComponents: true }],
    'react/no-multi-comp': 0,
    'consistent-return': 0,
    'no-underscore-dangle': 0,
    'import/prefer-default-export': 0,
    'import/extensions': 0,

    // Import
    'import/no-unresolved': [2, { commonjs: true }],

    // Compat
    'compat/compat': 0,

    // JSX-a11y
    "jsx-a11y/anchor-is-valid": [ "error", {
      "components": [ "a" ],
      "aspects": [ "noHref", "invalidHref", "preferButton" ]
    }],
  },
  settings: {
    'import/resolver': {
      node: {
        paths: [
          PATHS.src,
          PATHS.settings,
          PATHS.root,
          'node_modules',
        ],
        extensions: [
          ".js",
          ".tsx",
          ".ts",
          ".jsx"
        ]
      },
    },
  },
};
