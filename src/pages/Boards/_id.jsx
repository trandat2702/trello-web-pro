/* eslint-disable react/react-in-jsx-scope */
import { Container } from '@mui/material'
import { useEffect, useState } from 'react'
import AppBar from '~/components/AppBar/AppBar'
import BoardContent from './BoardContent/BoardContent'
import BoardBar from './BoardBar/BoardBar'
import { fetchBoardDetailsAPI, createNewCardAPI, createNewColumnAPI } from '~/apis'
import { generatePlaceholderCard } from '~/utils/formatters'
import { isEmpty } from 'lodash'
function Board() {
  const [board, setBoard] = useState(null)
  // disableGutters bỏ đi cái padding mặc định 16px 
  useEffect(() => {
    const boardId = '68fe4cb8ea8e64741d524430'
    fetchBoardDetailsAPI(boardId).then(board => {
      // Cần xử lí vấn đề kéo thả vào một column rỗng
      // board.columns.forEach(column => {
      //   if (isEmpty(column.cards)) {
      //     const placeholderCard = generatePlaceholderCard(column)
      //     column.cards = [placeholderCard]
      //     column.cardOrderIds = [placeholderCard._id]
      //   }
      // })
      // console.log('board details', board)
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
  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
      <AppBar />
      <BoardBar board={board} />
      <BoardContent
        createNewColumn={createNewColumn}
        createNewCard={createNewCard}
        board={board} />
    </Container>
  )
}

export default Board
