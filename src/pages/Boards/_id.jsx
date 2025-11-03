/* eslint-disable react/react-in-jsx-scope */
import { Container } from '@mui/material'
import { useEffect, useState } from 'react'
import AppBar from '~/components/AppBar/AppBar'
import BoardContent from './BoardContent/BoardContent'
import BoardBar from './BoardBar/BoardBar'
import { mapOrder } from '~/utils/sorts'
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import {
  fetchBoardDetailsAPI, createNewCardAPI,
  createNewColumnAPI, updateBoardDetailsAPI, updateColumnDetailsAPI, moveCardBetweenDifferentColumnsAPI, deleteColumnDetailsAPI
} from '~/apis'
import { toast } from 'react-toastify'
function Board() {
  const [board, setBoard] = useState(null)
  // disableGutters bỏ đi cái padding mặc định 16px 
  useEffect(() => {
    const boardId = '68fe4cb8ea8e64741d524430'
    fetchBoardDetailsAPI(boardId).then(board => {
      //Sắp xếp thứ tự các column luôn ở đây trước khi đưa dữ liệu xuống bên dưới các component con
      board.columns = mapOrder(board.columns, board.columnOrderIds, '_id')
      //Sắp xếp thứ tự các card trong từng column trước khi đưa dữ liệu xuống bên dưới các component con
      board.columns.forEach(column => {
        column.cards = mapOrder(column.cards, column.cardOrderIds, '_id')
      })
      setBoard(board)
    })
  }, [])
  //Func này có nhiệm cụ gọi API tạo mới Column và làm lại dữ liệu State Board
  const createNewColumn = async (newcolumnData) => {
    const createdColumn = await createNewColumnAPI({
      ...newcolumnData,
      boardId: board._id
    })
    // cập nhật state board
    //Sau khi lưu DB thành công cập nhật state để hiển thị
    const newBoard = { ...board }
    newBoard.columns.push(createdColumn)
    newBoard.columnOrderIds.push(createdColumn._id)
    setBoard(newBoard)
  }

  const createNewCard = async (newCardData) => {
    const createdCard = await createNewCardAPI({
      ...newCardData,
      boardId: board._id
    })

    const newBoard = { ...board }
    const columntoUpdate = newBoard.columns.find(column => column._id === createdCard.columnId)
    if (columntoUpdate) {
      columntoUpdate.cards.push(createdCard)
      columntoUpdate.cardOrderIds.push(createdCard._id)
    }
    setBoard(newBoard)
  }

  //Func này có nhiệm cụ gọi API và xử lý khi kéo thả Column xong xuôi
  const moveColumn = (dndOrderedColumns) => {
    // Update cho chuẩn dữ liệu state Board trước khi gửi lên backend
    const dndOrderedColumnsIds = dndOrderedColumns.map(column => column._id)
    const newBoard = { ...board }
    newBoard.columns = dndOrderedColumns
    newBoard.columnOrderIds = dndOrderedColumnsIds
    setBoard(newBoard)

    // Gọi API cập nhật lại dữ liệu trên server
    updateBoardDetailsAPI(board._id, {
      columnOrderIds: dndOrderedColumnsIds
    })
  }

  const moveCardInTheSameColumn = (dndOrderedCards, dndOrderedCardsIds, columnId) => {
    // Update cho chuẩn dữ liệu state Board trước khi gửi lên backend
    const newBoard = { ...board }
    const columnToUpdate = newBoard.columns.find(column => column._id === columnId)
    if (columnToUpdate) {
      columnToUpdate.cards = dndOrderedCards
      columnToUpdate.cardOrderIds = dndOrderedCardsIds
    }
    setBoard(newBoard)

    // Gọi API cập nhật lại dữ liệu trên server
    updateColumnDetailsAPI(columnId, {
      cardOrderIds: dndOrderedCardsIds
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
    console.log({ currentCardId, prevColumnId, prevCardOrderIds, nextColumnId });
    moveCardBetweenDifferentColumnsAPI({
      currentCardId,
      prevColumnId,
      prevCardOrderIds,
      nextColumnId,
      nextCardOrderIds: dndOrderedColumns.find(col => col._id === nextColumnId)?.cardOrderIds,
    })
  }

  //Xử lý xoá một Column và Cards bên trong nó
  //Link tham khảo https://www.mongodb.com/docs/drivers/node/current/crud/delete/
  const deleteColumnDetails = (columnId) => {
    //Cập nhập lại dữ liệu trên giao diện
    const newBoard = { ...board }
    newBoard.columns = newBoard.columns.filter(column => column._id !== columnId)
    newBoard.columnOrderIds = newBoard.columnOrderIds.filter(_id => _id !== columnId)
    setBoard(newBoard)

    //Gọi API xoá trên server
    deleteColumnDetailsAPI(columnId).then(res => {
      toast.success('Delete column successfully', { position: "bottom-right" })
    })

  }
  if (!board) {
    return (
      <Box sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        width: '100vw',
        gap: 2
      }}>
        <CircularProgress />
        <Typography >Loading data...</Typography>
      </Box>
    );
  }
  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
      <AppBar />
      <BoardBar board={board} />
      <BoardContent
        createNewColumn={createNewColumn}
        createNewCard={createNewCard}
        board={board}
        moveColumn={moveColumn}
        moveCardInTheSameColumn={moveCardInTheSameColumn}
        moveCardBetweenDifferentColumns={moveCardBetweenDifferentColumns}
        deleteColumnDetails={deleteColumnDetails}
      />
    </Container>
  )
}

export default Board
