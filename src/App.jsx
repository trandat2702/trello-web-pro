import { Routes, Route, Navigate } from 'react-router-dom'
import Board from '~/pages/Boards/_id'
import NotFound from '~/pages/404/NotFound'
import Auth from '~/pages/Auth/Auth'
function App() {
  return (
    <Routes>
      <Route path="/"
        //Ở đây cần replace giá trị true để
        //nó thay đổi route /, có thể hiểu là route / sẽ không còn nằm trong histrory của Browser nữa
        //Thực hành để hiểu hơn bằng cách nhấn Go Home
        //từ trang 404 xong thử quay lại bằng nút back
        //của trình duyệt giữa 2 trường hợp có replace và không có replace
        element={<Navigate to="boards/68fe4cb8ea8e64741d524430"
          replace={true} />} />
      {/* Board Details */}
      <Route path='/boards/:boardId' element={<Board />} />
      {/* Authentication */}
      <Route path='/login' element={<Auth />} />
      <Route path='/register' element={<Auth />} />
      {/* 404 Not Found page*/}
      <Route path='*' element={<NotFound />} />
    </Routes>
  )
}

export default App
