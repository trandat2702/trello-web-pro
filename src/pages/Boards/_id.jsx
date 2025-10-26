/* eslint-disable react/react-in-jsx-scope */
import { Container } from '@mui/material'
import { useEffect, useState } from 'react'
import AppBar from '~/components/AppBar/AppBar'
import BoardContent from './BoardContent/BoardContent'
import BoardBar from './BoardBar/BoardBar'
import { fetchBoardDetailsAPI } from '~/apis'
function Board() {
  const [board, setBoard] = useState(null)
  // disableGutters bỏ đi cái padding mặc định 16px 
  useEffect(() => {
    const boardId = '68e52f3b7e53ec9b9fe7b6c5'
    fetchBoardDetailsAPI(boardId).then(board => {
      setBoard(board)
    })
  }, [])
  return (
    <Container disableGutters maxWidth={false} sx={{ height: '100vh' }}>
      <AppBar />
      <BoardBar board={board} />
      <BoardContent board={board} />
    </Container>
  )
}

export default Board
