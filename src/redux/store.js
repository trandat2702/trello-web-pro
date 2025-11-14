import { configureStore } from '@reduxjs/toolkit'
import { activeBoardReducer } from './activeBoard/activeBoardSlice'
import { userReducer } from './user/userSlice'

/**
 * Cấu hình redux-persist để lưu trữ trạng thái của ứng dụng trong localStorage
 * https://www.npmjs.com/package/redux-persist
 * Bài viết hướng dẫn này dễ hiểu hơn
 * https://edvins.io/how-to-use-redux-persist-with-redux-toolkit
 */
import { combineReducers } from 'redux' // Lưu ý có sẵn redux trong redux-toolkit
import { persistReducer } from 'redux-persist'
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web

//Cấu hình persist
const rootPersistConfig = {
  key: 'root', // key của cái persist do chúng ta chỉ định, cứ để mặc định là root
  storage: storage, //Biến storage dùng để lưu trữ trạng thái, ở đây ta dùng localStorage
  whitelist: ['user'] //định nghĩa các slice không được phép duy trì qua mỗi lần f5 trình duyệt
  //balacklist: ['user'] //định nghĩa các slice không được phép duy trì qua mỗi lần f5 trình duyệt
}

//Combine các reducers trong dự án
const reducers = combineReducers({
  activeBoard: activeBoardReducer,
  user: userReducer
})

//Thực hiện persist Reducer
const persistedReducer = persistReducer(rootPersistConfig, reducers)


export const store = configureStore({
  reducer: persistedReducer,
  //Fix lỗi khi sử dụng redux-persist với redux-toolkit
  //https://stackoverflow.com/questions/61704805/getting-an-error-a-non-serializable-value-was-detected-in-the-state-when-using/63244831#63244831
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false
    })
})
