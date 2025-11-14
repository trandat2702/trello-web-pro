import ReactDOM from 'react-dom/client'
import CssBaseline from '@mui/material/CssBaseline'
import App from '~/App.jsx'
import { Experimental_CssVarsProvider as CssVarsProvider } from '@mui/material/styles'
import theme from './theme.js'
// cấu hình react-toastify
import { ToastContainer } from 'react-toastify'
//Cấu hình cho material-ui-confirm
import { ConfirmProvider } from 'material-ui-confirm'
//Cấu hình Redux Store
import { store } from '~/redux/store'
import { Provider } from 'react-redux'
//Cấu hình react-router-dom với BrowserRouter
import { BrowserRouter } from 'react-router-dom'
//Cấu hình Redux-Persist
import { PersistGate } from 'redux-persist/integration/react'
import { persistStore } from 'redux-persist'
const persistor = persistStore(store)
ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter basename='/'>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        {/* CssVarsProvider = "gốc theme" cho tất cả những j ở trong nó  https://v5.mui.com/material-ui/experimental-api/css-theme-variables/migration/*/}
        <CssVarsProvider theme={theme}>
          {/* reset CSS mặc định của browser để đồng bộ giao diện */}
          <ConfirmProvider defaultOptions={{
            dialogProps: { maxWidth: 'sm' },
            allowClose: false,
            confirmationButtonProps: { color: 'error' },
            cancellationButtonProps: { color: 'primary' }
          }}>
            <CssBaseline />
            <App />
            <ToastContainer position="bottom-left" theme="colored" />
          </ConfirmProvider>
        </CssVarsProvider>
      </PersistGate>
    </Provider >
  </BrowserRouter>
)
