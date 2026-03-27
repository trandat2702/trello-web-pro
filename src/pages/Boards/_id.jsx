import { Container } from '@mui/material'
import { useEffect } from 'react'
import AppBar from '~/components/AppBar/AppBar'
import BoardContent from './BoardContent/BoardContent'
import BoardBar from './BoardBar/BoardBar'
import { cloneDeep } from 'lodash'
import {
  updateBoardDetailsAPI, updateColumnDetailsAPI, moveCardBetweenDifferentColumnsAPI
} from '~/apis'
import { fetchBoardDetailsAPI, updateCurrentActiveBoard, selectCurrentActiveBoard } from '~/redux/activeBoard/activeBoardSlice'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import PageLoadingSpinner from '~/components/Loading/PageLoadingSpinner'
import ActiveCard from '~/components/Modal/ActiveCard/ActiveCard'
import { socketIoInstance } from '~/socketClient'
function Board() {
  // const [board, setBoard] = useState(null)
  const dispatch = useDispatch()
  const board = useSelector(selectCurrentActiveBoard)
  const { boardId } = useParams()
  useEffect(() => {
    // Call API
    dispatch(fetchBoardDetailsAPI(boardId))

    // Real-time cập nhật board
    const onUpdateBoard = (updatedBoardId) => {
      if (updatedBoardId === boardId) {
        dispatch(fetchBoardDetailsAPI(boardId))
      }
    }
    socketIoInstance.on('BE_UPDATE_BOARD', onUpdateBoard)
    return () => {
      socketIoInstance.off('BE_UPDATE_BOARD', onUpdateBoard)
    }
  }, [dispatch, boardId])

  //Func này có nhiệm cụ gọi API và xử lý khi kéo thả Column xong xuôi
  const moveColumn = (dndOrderedColumns) => {
    // Update cho chuẩn dữ liệu state Board trước khi gửi lên backend
    const dndOrderedColumnsIds = dndOrderedColumns.map(column => column._id)

    //Trường hợp này dùng spread operator cũng được vì chúng ta không thao
    //tác trực tiếp lên mảng columns bên trong object board, mà ta chỉ gán lại
    //toàn bộ giá trị columns và columnOrderIds
    const newBoard = { ...board }
    newBoard.columns = dndOrderedColumns
    newBoard.columnOrderIds = dndOrderedColumnsIds
    // setBoard(newBoard)
    dispatch(updateCurrentActiveBoard(newBoard))

    // Gọi API cập nhật lại dữ liệu trên server
    updateBoardDetailsAPI(board._id, {
      columnOrderIds: dndOrderedColumnsIds
    }).then(() => {
      // Thông báo cho các người dùng khác (Real-time) sau khi API chạy xong
      socketIoInstance.emit('FE_UPDATE_BOARD', board._id)
    })
  }

  const moveCardInTheSameColumn = (dndOrderedCards, dndOrderedCardsIds, columnId) => {
    // Update cho chuẩn dữ liệu state Board trước khi gửi lên backend
    //Cannot assign to read only property 'cards' of object '#<Object>'
    //Trường hợp này cũng tương tự như createNewColumn ở trên
    // const newBoard = { ...board }
    const newBoard = cloneDeep(board)
    const columnToUpdate = newBoard.columns.find(column => column._id === columnId)
    if (columnToUpdate) {
      columnToUpdate.cards = dndOrderedCards
      columnToUpdate.cardOrderIds = dndOrderedCardsIds
    }
    // setBoard(newBoard)
    dispatch(updateCurrentActiveBoard(newBoard))

    // Gọi API cập nhật lại dữ liệu trên server
    updateColumnDetailsAPI(columnId, {
      cardOrderIds: dndOrderedCardsIds
    }).then(() => {
      // Thông báo cho các người dùng khác (Real-time) sau khi API chạy xong
      socketIoInstance.emit('FE_UPDATE_BOARD', board._id)
    })
  }

  //Khi di chuyển card giữa 2 column khác nhau
  //B1:Cập nhập mảng cardOrderIds của column ban đầu chứa nó (Hiểu bản chất là xóa cái _id của card ra khỏi mảng)
  //B2:Cập nhập mảng của cardOrderIds của column đích (Hiểu bản chất là thêm cái _id của card vào mảng)
  //B3:Cập nhập lại mảng cards của cả 2 column (mảng này dùng để hiển thị danh sách card trong column)
  const moveCardBetweenDifferentColumns = (currentCardId, prevColumnId, nextColumnId, dndOrderedColumns) => {
    // // Update cho chuẩn dữ liệu state Board trước khi gửi lên backend
    // const dndOrderedColumnsIds = dndOrderedColumns.map(column => column._id)
    // const newBoard = { ...board }
    // newBoard.columns = dndOrderedColumns
    // newBoard.columnOrderIds = dndOrderedColumnsIds
    // setBoard(newBoard)

    //Gọi API cập nhật lại dữ liệu trên server
    let prevCardOrderIds = dndOrderedColumns.find(col => col._id === prevColumnId)?.cardOrderIds
    //Xử lí vấn đề khi kéo card cuối cùng ra khỏi column thì mảng cardOrderIds sẽ là ['placeholder-card',...] cần xóa nó đi trước khi gửi dữ liệu lên phía backend
    if (prevCardOrderIds[0].includes('placeholder-card')) prevCardOrderIds = []
    // console.log({ currentCardId, prevColumnId, prevCardOrderIds, nextColumnId });
    moveCardBetweenDifferentColumnsAPI({
      currentCardId,
      prevColumnId,
      prevCardOrderIds,
      nextColumnId,
      nextCardOrderIds: dndOrderedColumns.find(col => col._id === nextColumnId)?.cardOrderIds
    }).then(() => {
      // Thông báo cho các người dùng khác (Real-time) sau khi API chạy xong
      socketIoInstance.emit('FE_UPDATE_BOARD', board._id)
    })
  }
  if (!board) {
    return <PageLoadingSpinner caption="Loading Board..." />
  }
  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
      {/* Modal Active Card, check đóng/mở dựa theo State isShowModalActiveCard lưu trong Redux */}

      <ActiveCard />

      {/* Các thành phần còn lại của Board Details */}
      <AppBar />
      <BoardBar board={board} />
      <BoardContent
        board={board}
        moveColumn={moveColumn}
        moveCardInTheSameColumn={moveCardInTheSameColumn}
        moveCardBetweenDifferentColumns={moveCardBetweenDifferentColumns}
      />
    </Container>
  )
}

export default Board
