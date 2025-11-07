import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { API_ROOT } from '~/utils/constants'
import { mapOrder } from '~/utils/sorts'


//Khởi tạo giá trị của một cái Slice trong redux
const initialState = {
  currentActiveBoard: null
}

//Các hành động gọi api (bất đồng bộ) và cập nhật dữ liệu vào Redux, dùng
//createAsyncThunk đi kèm với extraReducers
//https://redux-toolkit.js.org/api/createAsyncThunk
export const fetchBoardDetailsAPI = createAsyncThunk(
  'activeBoard/fetchBoardDetailsAPI', // tên action type
  async (boardId) => {
    const response = await axios.get(`${API_ROOT}/v1/boards/${boardId}`) //hàm thực thi gọi api
    return response.data //Dữ liệu trả về sẽ được chuyển vào action.payload bên trong extraReducers
  }
)

//Khởi tạo 1 Slice trong kho lưu trữ - Redux Store
export const activeBoardSlice = createSlice({
  name: 'activeBoard',
  initialState,
  //Reducers: Nơi xử lý dữ liệu đồng bộ
  reducers: {
    updateCurrentActiveBoard: (state, action) => {
      //action.payload là chuẩn đặt tên nhận dữ liệu vào reducer, ở đây chúng ta gán nó ra một biến có nghĩa hơn
      let board = action.payload

      //Xử lí dữ liệu nếu cần thiết ....

      //Update lại dữ liệu của cái currentActiveBoard
      state.currentActiveBoard = board
    }
  },
  //Extra Reducers: Nơi xử lý dữ liệu bất đồng bộ từ các hành động gọi api (createAsyncThunk)
  extraReducers: (builder) => {
    builder.addCase(fetchBoardDetailsAPI.fulfilled, (state, action) => {
      //action.payload ở đây chính là cái response.data trả về từ api ở trong createAsyncThunk bên trên
      const board = action.payload
      //Sắp xếp thứ tự các column luôn ở đây trước khi đưa dữ liệu xuống bên dưới các component con
      board.columns = mapOrder(board.columns, board.columnOrderIds, '_id')
      //Sắp xếp thứ tự các card trong từng column trước khi đưa dữ liệu xuống bên dưới các component con
      board.columns.forEach(column => {
        column.cards = mapOrder(column.cards, column.cardOrderIds, '_id')
      })
      //Update lại dữ liệu của cái currentActiveBoard
      state.currentActiveBoard = board
    })
  }
})

//Actions: Là nơi dành cho các components bên dưới gọi bằng dispatch() tới nó để cập nhât lại dữ liệu thông qua reducer (chạy đồng bộ)
//Để ý ở trên thì không thấy properties actions đâu cả , bởi vì những cái actions này đơn giản là được thằng redux tạo tự động theo tên redux tạo tự động theo tên của reducer nhé

export const { updateCurrentActiveBoard } = activeBoardSlice.actions

//Selectors: Là nơi dành cho các components bên dưới gọi để lấy dữ liệu từ trong redux store về sử dụng , dùng đến hook useSelector của react-redux để lấy dữ liệu từ selectors này
export const selectCurrentActiveBoard = (state) => {
  return state.activeBoard.currentActiveBoard
}

// export default activeBoardSlice.reducer
export const activeBoardReducer = activeBoardSlice.reducer