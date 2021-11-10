module.exports = {
  root: true,
  settings: {
    'import/resolver': {
      alias: {
        map: [
          ['~', '.'],
        ],
        extensions: ['.js', '.json'],
      },
    },
  },
  ignorePatterns: ['package.json', 'node_modules/*'],
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    node: true,
  },
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 9, // 2018
  },
  plugins: ['node', 'promise', 'import'],
  extends: ['airbnb-base'],
  rules: {
    // base
    'max-len': ['error', { code: 140 }],
    indent: ['error', 2, { SwitchCase: 1 }],
    semi: ['error', 'never'],
    quotes: ['error', 'single'],
    'comma-dangle': ['error', 'always-multiline'],
    'object-curly-spacing': ['error', 'always'],
    'arrow-parens': ['error', 'always'],
    'linebreak-style': ['error', 'unix'],
    'operator-linebreak': ['error', 'before'],
    'no-underscore-dangle': [
      'error',
      {
        allow: ['_id', '_'],
      },
    ],

    // plain
    radix: ['error', 'as-needed'],
    'no-debugger': 'error',
    'no-console': 'off',
    'no-new': 'off',
    'no-continue': 'off',
    'no-await-in-loop': 'off',
    'no-unused-vars': 'warn',

    // safe
    'prefer-destructuring': 'off',
    'no-restricted-syntax': 'warn',
    'class-methods-use-this': 'off',
    'ts-nocheck': 'off',

    // miss safe
    'no-param-reassign': 'off',
    'import/no-extraneous-dependencies': 'off',
    'import/no-dynamic-require': 'off',
    'import/no-cycle': 'off',
    'global-require': 'off',
    'max-classes-per-file': 'off',
    'import/no-unresolved': 'off',
    'import/extensions': 'off',
    'import/no-self-import': 'off',
    'import/no-useless-path-segments': 'off',
    'import/order': 'off',
  },
}
