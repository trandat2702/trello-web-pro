import Box from '@mui/material/Box'
import ListColumns from './ListColumns/ListColumns'
import { mapOrder } from '~/utils/sorts'
import { DndContext, PointerSensor, useSensor, useSensors, MouseSensor, TouchSensor } from '@dnd-kit/core'
import { useEffect, useState } from 'react'
import { arrayMove } from '@dnd-kit/sortable'
function BoardContent({ board }) {
  //https://docs.dndkit.com/api-documentation/sensors#usesensor
  // const pointerSensor = useSensor(PointerSensor, {
  //   // Require the mouse to move by 10 pixels before activating
  //   activationConstraint: {
  //     distance: 10,
  //   }
  // })

  const mouseSensor = useSensor(MouseSensor, {
    // Require the mouse to move by 10 pixels before activating
    activationConstraint: {
      distance: 10,
    }
  })

  const touchSensor = useSensor(TouchSensor, {
    //  nhấn giữ trong 250ms mới được kích hoạt và dung sai của cảm ứng là 500px thì mới kích hoạt event
    activationConstraint: {
      delay: 250,
      tolerance: 5000
    }
  })
  // const sensors = useSensors(pointerSensor)
  //Ưu tiên dùng mouseSensor trước rồi đến touchSensor
  //Vì nếu dùng pointerSensor thì trên máy tính bảng (tablet) sẽ không kéo thả được
  //Mà chỉ dùng được trên laptop, desktop có chuột thôi
  const sensors = useSensors(mouseSensor, touchSensor)
  const [orderedColumnsState, setOrderedColumnsState] = useState([])

  useEffect(() => {
    const orderedColumns = mapOrder(board?.columns, board?.columnOrderIds, '_id')
    setOrderedColumnsState(orderedColumns)
  }, [board])
  const handleDragEnd = (event) => {
    const { active, over } = event;

    //Kiểm tra nếu không tồn tại over (kéo linh tinh ra ngoài thì return luôn tránh lỗi)
    if (!over) return;
    if (active.id !== over.id) {
      // Lấy vị trí cũ (từ thằng active) và vị trí mới (từ thằng over)
      const oldIndex = orderedColumnsState.findIndex(c => c._id === active.id)
      const newIndex = orderedColumnsState.findIndex(c => c._id === over.id)
      // Dùng arrayMove của thằng dnd-kit để sắp xếp lại mảng Columns ban đầu
      // Code của arrayMove: dnd-kit/packages/sortable/src/utilities/arrayMove.ts
      const dndOrderedColumns = arrayMove(orderedColumnsState, oldIndex, newIndex)
      const dndOrderedColumnsIds = dndOrderedColumns.map(c => c._id)

      // Cập nhật lại cả 2 state: Thứ tự cột và mảng cột
      setOrderedColumnsState(dndOrderedColumns)
    }
  }

  return (
    <DndContext onDragEnd={handleDragEnd} sensors={sensors}>
      <Box sx={{
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'),
        width: '100%',
        height: (theme) => theme.trello.boardContentHeight,
        p: '10px 0',
      }}
      >
        <ListColumns columns={orderedColumnsState} />
      </Box >
    </DndContext>
  )
}

export default BoardContent
