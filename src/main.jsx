import React from 'react'
import ReactDOM from 'react-dom/client'
import CssBaseline from '@mui/material/CssBaseline'
import App from '~/App.jsx'
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles'
import theme from './theme.js'
// cấu hình react-toastify
import { ToastContainer, toast } from 'react-toastify'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    {/* CssVarsProvider = "gốc theme" cho tất cả những j ở trong nó */}
    <CssVarsProvider theme={theme}>
      {/* reset CSS mặc định của browser để đồng bộ giao diện */}
      <CssBaseline />
      <App />
      <ToastContainer position="bottom-left" theme="colored" />
    </CssVarsProvider>
  </React.StrictMode>,
)
