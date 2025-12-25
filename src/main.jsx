import ReactDOM from 'react-dom/client'
import CssBaseline from '@mui/material/CssBaseline'
import GlobalStyles from '@mui/material/GlobalStyles'
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

/** Xử lí sau khi F5 khi đó store sẽ rỗng tức là { currentUser: null }
 * Hàm persistStore bắt đầu quá trình đọc localStorage và nạp lại dữ liệu vào redux store
*/
//Đắng ký lắng nghe sự thay đổi state của store
const persistor = persistStore(store)

//Kỹ thuật Inject Store: là kỹ thuật khi cần sử dụng biến redux store ở các file ngoài phạm vi component
import { injectStore } from '~/utils/authorizeAxios'
//Hàm này được gọi thì biến axiosReduxStore trong authorizeAxios.js sẽ có giá trị chính là store của redux
injectStore(store)
ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    {/* Nó sẽ chờ quá trình nạp lại dữ liệu từ localStorage vào redux store hoàn tất
      trước khi render ra giao diện ứng dụng bên trong nếu chưa hoàn tất thì sẽ
      hiển thị cái loading=null (không hiển thị gì),hoàn thành rồi mới render ra giao diện ứng dụng */}
    <PersistGate loading={null} persistor={persistor}>
      <BrowserRouter basename='/'>
        <GlobalStyles styles={{ a: { textDecoration: 'none' } }} />
        {/* https://v5.mui.com/material-ui/experimental-api/css-theme-variables/migration/ */}
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
      </BrowserRouter>
    </PersistGate>
  </Provider >
)
