import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import svgr from 'vite-plugin-svgr'


// https://vitejs.dev/config/
export default defineConfig({
  // Cho phép thằng Vite sử dụng được process.env, mặc định thì không mà sẽ phải dùng import.meta.env
  // https://github.com/vitejs/vite/issues/1973
  define: {
    'process.env': process.env
  },
  optimizeDeps: {
    include: [
      '@emotion/react',
      '@emotion/styled',
      '@mui/material',
      '@mui/system',
      '@mui/material/Tooltip',
      '@mui/material/Unstable_Grid2'
    ],
    esbuildOptions: {
      // Fix for emotion with MUI
      target: 'esnext'
    }
  },
  plugins: [
    react({
      jsxImportSource: '@emotion/react'
    }),
    svgr()
  ],
  base: '/',
  resolve: {
    alias: [
      { find: '~', replacement: '/src' }
    ]
  }
})
