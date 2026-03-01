import { useState } from 'react'
import { toast } from 'react-toastify'
import Box from '@mui/material/Box'
import Column from './Column/Column'
import TextField from '@mui/material/TextField'
import Button from '@mui/material/Button'
import NoteAddIcon from '@mui/icons-material/NoteAdd'
import { SortableContext, horizontalListSortingStrategy } from '@dnd-kit/sortable'
import CloseIcon from '@mui/icons-material/Close'
import { createNewColumnAPI } from '~/apis'
import { cloneDeep } from 'lodash'
import { useDispatch, useSelector } from 'react-redux'
import { updateCurrentActiveBoard, selectCurrentActiveBoard } from '~/redux/activeBoard/activeBoardSlice'
function ListColumns({ columns }) {
  const dispatch = useDispatch()
  const board = useSelector(selectCurrentActiveBoard)
  const [openNewColumnForm, setOpenNewColumnForm] = useState(false)
  const toggleNewColumnForm = () => setOpenNewColumnForm(!openNewColumnForm)
  const [newColumnTitle, setNewColumnTitle] = useState('')

  const addNewColumn = async () => {
    if (!newColumnTitle) {
      toast.error('Column title is required')
      return
    }
    //Tạo dữ liệu Column để gọi API
    const newcolumnData = {
      title: newColumnTitle
    }
    //Func này có nhiệm cụ gọi API tạo mới Column và làm lại dữ liệu State Board
    const createdColumn = await createNewColumnAPI({
      ...newcolumnData,
      boardId: board._id
    })
    // cập nhật state board
    //Sau khi lưu DB thành công cập nhật state để hiển thị
    //Đoạn này sẽ dính lỗi object is not extensible bởi dù đã copy/clone
    //ra giá trị newBoard nhưng bản chất của spread operator chỉ là sao chép bề mặt
    //(shallow copy), nên dính phải rules imutability trong redux toolkit không
    //dùng được hàm push (sửa giá trị mảng trực tiếp) cách đơn giản nhanh gọn nhất ở trường hợp
    //này của chúng ta là dùng tới Deep Copy/Clone toàn bộ cái Board cho dễ hiểu và code ngắn gọn.
    // /https://redux-toolkit.js.org/usage/immer-reducers
    // const newBoard = { ...board }
    const newBoard = cloneDeep(board)
    newBoard.columns.push(createdColumn)
    newBoard.columnOrderIds.push(createdColumn._id)

    //Ngoài ra thì dùng concat bởi vì concat tạo ra 1 mảng mới rồi xong đó gán lại vào mảng gốc
    //còn push thì nó thao tác trực tiếp lên mảng gốc nên dính lỗi không cho sửa đổi trực tiếp trong redux toolkit
    // const newBoard = { ...board }
    // newBoard.columns = newBoard.columns.concat([createdColumn])
    // newBoard.columnOrderIds = newBoard.columnOrderIds.concat([createdColumn._id])
    //Cập nhập dữ liệu vào Redux Store
    dispatch(updateCurrentActiveBoard(newBoard))
    //Đóng trạng thái thêm Column mới và Clear input
    toggleNewColumnForm()
    setNewColumnTitle('')
  }

  //  Thằng SortableContext yêu cầu truyền vào 1 prop items là mảng [id1, id2, id3] chứ không phải mảng object [{_id: id1}, {_id: id2}]
  //  Nếu không đúng thì sẽ kéo thả được nhưng không có Animation
  //  https://github.com/clauderic/dnd-kit/issues/183#issuecomment-812569512

  return (
    <SortableContext items={columns?.map(c => c._id)} strategy={horizontalListSortingStrategy}>
      <Box sx={{
        bgcolor: 'inherit',
        width: '100%',
        height: '100%',
        display: 'flex',
        overflowX: 'auto',
        overflowY: 'hidden',
        '&::-webkit-scrollbar-track': { m: 2 }
      }}>
        {columns?.map(column => (
          <Column
            key={column._id}
            column={column}
          />))}
        {/* Box add new column */}
        {!openNewColumnForm
          ?
          <Box onClick={toggleNewColumnForm} sx={{
            minWidth: '250px',
            maxWidth: '250px',
            mx: 2,
            borderRadius: '6px',
            height: 'fit-content',
            bgcolor: '#ffffff3d'
          }}>
            <Button startIcon={<NoteAddIcon />}
              sx={{
                color: 'white',
                width: '100%',
                justifyContent: 'flex-start',
                pl: 2.5,
                py: 1
              }}
            >Add new column</Button>
          </Box>
          : <Box sx={{
            minWidth: '250px',
            maxWidth: '250px',
            mx: 2,
            p: 1,
            borderRadius: '6px',
            height: 'fit-content',
            bgcolor: '#ffffff3d',
            display: 'flex',
            flexDirection: 'column',
            gap: 1
          }}>
            <TextField
              label="Enter column title"
              type="text"
              size="small"
              variant='outlined'
              autoFocus
              value={newColumnTitle}
              onChange={(e) => setNewColumnTitle(e.target.value)}
              sx={{
                '& label': { color: 'white' },
                '& input': { color: 'white' },
                '& label.Mui-focused': { color: 'white' },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'white'
                  },
                  '&:hover fieldset': {
                    borderColor: 'white'
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'white'
                  }
                }
              }} />
            <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
              <Button
                className='interceptor-loading'
                onClick={addNewColumn}
                variant="contained"
                color="success"
                size="small"
                sx={{
                  boxShadow: 'none',
                  border: '0.5px solid',
                  borderColor: (theme) => theme.palette.success.main,
                  '&:hover': {
                    bgcolor: (theme) => theme.palette.success.main
                  }
                }}
              >Add Column</Button>
              <CloseIcon
                fontSize='small'
                sx={{
                  color: 'white', cursor: 'pointer',
                  '&:hover': { color: (theme) => theme.palette.warning.light }
                }}
                onClick={toggleNewColumnForm}
              />
            </Box>
          </Box>
        }
      </Box>
    </SortableContext>
  )
}

export default ListColumns
