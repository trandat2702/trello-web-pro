
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
    'plugin:react-hooks/recommended' // tuân theo các quy tắc tốt nhất của React Hooks
  ],
  plugins: [
    'react',
    'react-hooks'
  ],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module' // cho phép sử dụng import/export
  },
  rules: {
    "no-restricted-imports": [
      "error",
      {
        "patterns": [{ "regex": "^@mui/[^/]+$" }] // Ngăn chặn import kiểu import Component from '@mui/material' (gọi là default import từ package gốc). Mục đích là để buộc bạn dùng named import từ đường dẫn đầy đủ, ví dụ: import Button from '@mui/material/Button', giúp hỗ trợ tree-shaking (tối ưu hóa dung lượng code) tốt hơn.
      }
    ],
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn', // Kiểm tra dependencies của useEffect và các hook khác
    'no-console': 1,
    'no-unused-vars': 1,
    'no-trailing-spaces': 1,
    'no-multi-spaces': 1,
    'no-multiple-empty-lines': 1,
    'space-before-blocks': ['error', 'always'],
    'object-curly-spacing': [1, 'always'],
    indent: ['warn', 2],
    'linebreak-style': 0,
    semi: [1, 'never'],
    quotes: ['error', 'single'],
    'no-unexpected-multiline': 'warn',
    'react/prop-types': 0,
    'react/display-name': 0,
    'keyword-spacing': 1,
    'comma-dangle': 1,
    'comma-spacing': 1,
    'arrow-spacing': 1
  }
}
