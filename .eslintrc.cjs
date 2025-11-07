
// Sample ESLint config for React project
module.exports = {
  env: {
    es6: true,    // cho phép sử dụng cú pháp ES6 như là const, let, v.v.
    node: true,   // cho phép sử dụng cú pháp Node.js như require, module.exports, v.v.
    browser: true  // cho phép sử dụng cú pháp trình duyệt như document, window, v.v.
  },
  extends: [
    'eslint:recommended', // tìm các lỗi phổ biến trong JavaScript
    'plugin:react/recommended', // tuân theo các quy tắc tốt nhất của React 
    'plugin:react/jsx-runtime', // hỗ trợ JSX tự động mà không cần import React
    'plugin:react-hooks/recommended' // tuân theo các quy tắc tốt nhất của React Hooks
  ],
  plugins: [
    'react',
    'react-hooks',
    'react-refresh'
  ],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: { react: { version: '18.2' } },
  rules: {
    // React
    'react-refresh/only-export-components': 'warn',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'react/prop-types': 0,
    'react/display-name': 0,

    // MUI
    'no-restricted-imports': [
      'error',
      {
        'patterns': ['@mui/*/*/*']
      }
    ],

    // Common
    'no-console': 1,
    'no-extra-boolean-cast': 0,
    'no-lonely-if': 1,
    'no-unused-vars': 1,
    'no-trailing-spaces': 1,
    'no-multi-spaces': 1,
    'no-multiple-empty-lines': 1,
    'space-before-blocks': ['error', 'always'],
    'object-curly-spacing': [1, 'always'],
    'indent': ['warn', 2],
    'semi': [1, 'never'],
    'quotes': ['error', 'single'],
    'array-bracket-spacing': 1,
    'linebreak-style': 0,
    'no-unexpected-multiline': 'warn',
    'keyword-spacing': 1,
    'comma-dangle': 1,
    'comma-spacing': 1,
    'arrow-spacing': 1
  }
}
