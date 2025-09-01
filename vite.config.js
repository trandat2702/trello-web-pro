// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import svgr from 'vite-plugin-svgr'

export default defineConfig({
  plugins: [
    react({
      jsxImportSource: '@emotion/react',
      babel: {
        plugins: ['@emotion/babel-plugin']
      }
    }),
    svgr() // cấu hình svg như là 1 component React có thể css 1 cách dễ dàng
  ],
  resolve: {
    alias: [
      { find: '~', replacement: '/src' } // Không còn cảnh ../../../../ rối rắm khi import file. Giờ chỉ cần ~/path/to/file
    ]
  },
  optimizeDeps: {
    include: [
      '@emotion/react',
      '@emotion/styled',
      '@mui/material/Tooltip'
    ]
  }
  //thêm nó vào optimizeDeps.include giúp giảm hiện tượng reload hoặc lỗi khi dùng hot reload.
})
