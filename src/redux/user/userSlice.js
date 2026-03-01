import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'
import authorizedAxiosInstance from '~/utils/authorizeAxios'
import { API_ROOT } from '~/utils/constants'


//Khởi tạo giá trị của một cái Slice trong redux
const initialState = {
  currentUser: null
}

//Các hành động gọi api (bất đồng bộ) và cập nhật dữ liệu vào Redux, dùng
//createAsyncThunk đi kèm với extraReducers
//https://redux-toolkit.js.org/api/createAsyncThunk
export const loginUserAPI = createAsyncThunk(
  'user/loginUserAPI', // tên action type
  async (data) => {
    const response = await authorizedAxiosInstance.put(`${API_ROOT}/v1/users/login`, data) //hàm thực thi gọi api
    return response.data //Dữ liệu trả về sẽ được chuyển vào action.payload bên trong extraReducers
  }
)

export const logoutUserAPI = createAsyncThunk(
  'user/logoutUserAPI',
  async (showSuccessMessage = true) => {
    const response = await authorizedAxiosInstance.delete(`${API_ROOT}/v1/users/logout`)
    if (showSuccessMessage) {
      //Chỉ hiển thị thông báo khi người dùng chủ động đăng xuất
      toast.success('Logged out successfully!')
      return response.data
    }
  }
)

export const updateUserAPI = createAsyncThunk(
  'user/updateUserAPI',
  async (data) => {
    const response = await authorizedAxiosInstance.put(`${API_ROOT}/v1/users/update`, data)
    return response.data
  })

export const loginWithGoogleAPI = createAsyncThunk(
  'user/loginWithGoogle',
  async (data) => {
    const response = await authorizedAxiosInstance.post(`${API_ROOT}/v1/users/google-login`, data)
    return response.data
  }
)

//Khởi tạo 1 Slice trong kho lưu trữ - Redux Store
export const userSlice = createSlice({
  name: 'user',
  initialState,
  //Reducers: Nơi xử lý dữ liệu đồng bộ
  reducers: {},
  //Extra Reducers: Nơi xử lý dữ liệu bất đồng bộ từ các hành động gọi api (createAsyncThunk)
  extraReducers: (builder) => {
    builder.addCase(loginUserAPI.fulfilled, (state, action) => {
      const user = action.payload
      state.currentUser = user
    })
    builder.addCase(logoutUserAPI.fulfilled, (state) => {
      //API logout sau khi gọi thành công thì sẽ clear thông tin currentUser về null ở đây
      //Kết hợp ProtectedRoute đã làm ở App.js code sẽ điều hướng người dùng về trang login
      state.currentUser = null
    })
    builder.addCase(updateUserAPI.fulfilled, (state, action) => {
      const updatedUser = action.payload
      state.currentUser = updatedUser
    })
    builder.addCase(loginWithGoogleAPI.fulfilled, (state, action) => {
      const user = action.payload
      state.currentUser = user
    })
  }
})

//Actions: Là nơi dành cho các components bên dưới gọi bằng dispatch() tới nó để cập nhât lại dữ liệu thông qua reducer (chạy đồng bộ)
//Để ý ở trên thì không thấy properties actions đâu cả , bởi vì những cái actions này đơn giản là được thằng redux tạo tự động theo tên redux tạo tự động theo tên của reducer nhé

// export const { } = userSlice.actions
//Selectors: Là nơi dành cho các components bên dưới gọi để lấy dữ liệu từ trong redux store về sử dụng , dùng đến hook useSelector của react-redux để lấy dữ liệu từ selectors này
export const selectCurrentUser = (state) => {
  return state.user.currentUser
}
export const userReducer = userSlice.reducer