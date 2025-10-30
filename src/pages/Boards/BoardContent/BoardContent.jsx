import Box from '@mui/material/Box'
import ListColumns from './ListColumns/ListColumns'
import { mapOrder } from '~/utils/sorts'
import {
  DndContext,
  useSensor,
  useSensors,
  // MouseSensor, 
  // TouchSensor, 
  DragOverlay,
  defaultDropAnimationSideEffects, closestCorners, pointerWithin, getFirstCollision
} from '@dnd-kit/core'
import { MouseSensor, TouchSensor } from '~/customLibraries/DndKitSensors'
import { useEffect, useState, useCallback, useRef } from 'react'
import { cloneDeep, isEmpty } from 'lodash'
import { arrayMove } from '@dnd-kit/sortable'
import Card from './ListColumns/Column/ListCards/Card/Card'
import Column from './ListColumns/Column/Column'
import { generatePlaceholderCard } from '~/utils/formatters'
const ACTIVE_DRAG_ITEM_TYLE = {
  COLUMN: 'ACTIVE_DRAG_ITEM_TYLE_COLUMN',
  CARD: 'ACTIVE_DRAG_ITEM_TYLE_CARD'
}

//tài liệu tham khảo dnd-kit kéo thả nhiều container
//https://github.com/clauderic/dnd-kit/tree/master/stories/2%20-%20Presets/Sortable
function BoardContent({ board, createNewColumn, createNewCard }) {
  // tài liệu sử dụng cảm ứng https://docs.dndkit.com/api-documentation/sensors
  const mouseSensor = useSensor(MouseSensor, {
    // chuột di chuyển ít nhất 10px thì mới được kích hoạt sự kiện kéo thả
    activationConstraint: {
      distance: 10,
    }
  })

  const touchSensor = useSensor(TouchSensor, {
    //  nhấn giữ trong 250ms mới được kích hoạt và dung sai của cảm ứng là 5000px thì mới kích hoạt event
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
  // Cùng một thời điểm chỉ có một phần tử đang được kéo (COLUMN hoặc CARD)
  const [activeDragItemId, setActiveDragItemId] = useState(null)
  const [activeDragItemType, setActiveDragItemType] = useState(null)
  const [activeDragItemData, setActiveDragItemData] = useState(null)
  const [oldColumnWhenDraggingCard, setOldColumnWhenDraggingCard] = useState(null)

  //Điểm va chạm cuối cùng (xử lý thuật toán phát hiện va chạm)
  const lastOverId = useRef(null)
  useEffect(() => {
    const orderedColumns = mapOrder(board?.columns, board?.columnOrderIds, '_id')
    setOrderedColumnsState(orderedColumns)
  }, [board])
  //Tìm một cái Column theo CardId
  const findColumnByCardId = (cardId) => {
    //Đoạn này cần lưu ý nên dùng c.cards thay thì c.cardOrderIds bởi vì ở bước handleDragOver chúng ta sẽ làm dữ liệu cho cards hoàn chỉnh trước mới rồi mới tạo ra cardfOrderIds mới
    return orderedColumnsState.find(column => column?.cards?.map(card => card._id)?.includes(cardId))
  }

  // Tìm Column theo id có thể là cardId hoặc columnId (trường hợp over.id là column khi trỏ vào vùng rỗng của column)  hoặc có thể nói tìm cột đích
  const findColumnByCardOrColumnId = (id) => {
    return orderedColumnsState.find(column => column._id === id) || findColumnByCardId(id)
  }

  // Cập nhật lại state trong trường hợp di chuyển Card giữa các Column khác nhau
  // Tính vị trí chèn mới trong cột đích(trên hay dưới thằng over).
  // Xoá card khỏi cột nguồn(thêm placeholder nếu rỗng).
  // Chèn card vào cột đích theo newCardIndex.
  // Đồng bộ cardOrderIds cho cả hai cột.
  // Tất cả làm theo kiểu immutable(clone state, set lại).
  const moveCardBetweenDifferentColumns = (
    overColum,
    overCardId,
    active,
    over,
    activeColum,
    activeDraggingCardId,
    activeDraggingCardData
  ) => {
    setOrderedColumnsState((prevColumns) => {
      //Tìm vị trí index của cái overCard trong column đích (nơi mà activeCard sắp được kéo thả)
      const overCardIndex = overColum?.cards?.findIndex(card => card._id === overCardId)

      //Logic tính toán "cardIndex mới" (trên hoặc dưới của overCard) lấy chuẩn ra từ code của thư viện 
      let newCardIndex
      const isBelowOverItem = active.rect.current.translated &&
        active.rect.current.translated.top > over.rect.top + over.rect.height
      const modifier = isBelowOverItem ? 1 : 0 // chèn trước thì giá trị bằng 0 ,chèn sau thì giá trị bằng 1

      newCardIndex = overCardIndex >= 0 ? overCardIndex + modifier : overColum?.cards?.length + 1
      //Clone mảng OrderedColumnsState cũ ra một cái mới để xử lý data rồi return -cập nhật lại OderedColumnState mới
      const nextColumns = cloneDeep(prevColumns)
      const nextActiveColumn = nextColumns.find(column => column._id === activeColum._id)
      const nextOverColumn = nextColumns.find(column => column._id === overColum._id)
      //column cũ
      if (nextActiveColumn) {
        //Xóa card ở cái column active (cũng có thể hiểu là column cũ ,cái lúc mà kéo card ra khỏi nó để sang column khác)
        nextActiveColumn.cards = nextActiveColumn?.cards?.filter(card => card._id !== activeDraggingCardId)
        //Thêm Placeholder Card nếu Column rỗng :Bị kéo hết Card đi ,không còn cái nào nữa
        if (isEmpty(nextActiveColumn.cards)) {
          nextActiveColumn.cards = [generatePlaceholderCard(nextActiveColumn)]
        }
        //Cập nhật lại mảng cardOrderIds cho chuẩn dữ liệu
        nextActiveColumn.cardOrderIds = nextActiveColumn?.cards?.map(card => card._id)
      }

      //column mới
      if (nextOverColumn) {
        //Kiểm tra xem card đang kéo nó có tồn tại ở overColumn chưa,nếu có thì cần xóa nó trước
        // nextActiveColumn.cards = nextActiveColumn?.cards?.filter(card => card._id !== activeDraggingCardId)
        //Đối với trường hợp dragEnd thì phải cập nhật lại chuẩn dữ liệu columnId trong card sau khi kéo card giữa 2 column khác nhau    
        const rebuild_activeDraggingCardData = {
          ...activeDraggingCardData,
          columnId: nextOverColumn._id
        }
        // Tiếp theo là thêm cái card đang kéo vào overColumn theo vị trí index mới 
        nextOverColumn.cards = nextOverColumn?.cards.toSpliced(newCardIndex, 0, rebuild_activeDraggingCardData)

        //Xóa Placeholder Card đi nếu đang tồn tại
        nextOverColumn.cards = nextOverColumn?.cards?.filter(card => !card.FE_PlaceholderCard)
        // newCardIndex = overCardIndex >= 0 ? overCardIndex + modifier : overColum?.cards?.length
        nextOverColumn.cardOrderIds = nextOverColumn?.cards?.map(card => card._id)
      }
      return nextColumns
    })
  }
  // Khi bắt đầu kéo (drag) 1 phần tử nào đó 
  const handleDragStart = (event) => {
    // console.log({ event })
    setActiveDragItemId(event?.active?.id)
    setActiveDragItemType(
      event?.active?.data?.current?.columnId
        ? ACTIVE_DRAG_ITEM_TYLE.CARD
        : ACTIVE_DRAG_ITEM_TYLE.COLUMN
    )
    setActiveDragItemData(event?.active?.data?.current)
    //Nếu là kéo card thì mới thực hiện những hành động set giá trị oldColumn
    if (event?.active?.data?.current?.columnId) {
      setOldColumnWhenDraggingCard(findColumnByCardId(event?.active?.id))
    }
  }
  // Trigger trong quá trình kéo thả 1 phần tử
  const handleDragOver = (event) => {
    // console.log({ event })
    // Không làm j thêm nếu đang kéo column
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYLE.COLUMN) return;

    //Còn nếu kéo card thì xử lý thêm để có thể kéo card qua lại giữa các columns
    const { active, over } = event;
    // Cần đảm bảo nếu không tồn tại active hoặc over thì return luôn tránh crash trang 
    if (!active || !over) return;
    //activeDragingCard :là cái card đang được kéo
    const { id: activeDraggingCardId, data: { current: activeDraggingCardData } } = active;
    //overCard : là cái card đang tương tác trên hoặc dưới so với cái card được kéo ở trên
    const { id: overCardId } = over;
    //Tìm 2 column theo id (over có thể là cardId hoặc columnId)
    const activeColum = findColumnByCardId(activeDraggingCardId)
    const overColum = findColumnByCardOrColumnId(overCardId)
    //Nếu không tìm thấy thì return
    if (!activeColum || !overColum) return;
    //Xử lý logic ở đây chỉ khi kéo card qua 2 column khác nhau còn nếu kéo card trong chính column đó thì không cần xử lý gì thêm
    //Vì đây đang là đoạn xử lý lúc kéo (handleDragOver) còn xử lý lúc kéo xong xuôi thì lại là vấn đề của handleDragEnd
    if ((activeColum._id !== overColum._id)) {
      moveCardBetweenDifferentColumns(
        overColum,
        overCardId,
        active,
        over,
        activeColum,
        activeDraggingCardId,
        activeDraggingCardData
      )
    }
  }
  // Khi kết thúc kéo thả một phần tử nào đó hành động thả (drop)
  const handleDragEnd = (event) => {
    const { active, over } = event;
    // Cần đảm bảo nếu không tồn tại active hoặc over thì return luôn tránh crash trang 
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYLE.CARD) {
      // Cần đảm bảo nếu không tồn tại active hoặc over thì return luôn tránh crash trang 
      if (!active || !over) return;
      //activeDragingCard :là cái card đang được kéo
      const { id: activeDraggingCardId, data: { current: activeDraggingCardData } } = active;
      //overCard : là cái card đang tương tác trên hoặc dưới so với cái card được kéo ở trên
      const { id: overCardId } = over;
      //Tìm 2 column (over có thể là cardId hoặc columnId)
      const activeColum = findColumnByCardId(activeDraggingCardId)
      const overColum = findColumnByCardOrColumnId(overCardId)
      //Nếu không tìm thấy thì return
      if (!activeColum || !overColum) return;

      //Hành động kéo thả card giữa 2 column khác nhau
      // Phải dùng tới activeDragItemData.columId hoặc oldColumnWhenDraggingCard._id 
      // (set vào state từ bước handleDragStar) 
      // chứ không phải dùng activeData trong scope handleDragEnd 
      // này vì sau khi đi qua onDragOver tới đây là state của card đã bị cập nhật 1 lần rồi
      if (oldColumnWhenDraggingCard._id !== overColum._id) {
        moveCardBetweenDifferentColumns(
          overColum,
          overCardId,
          active,
          over,
          activeColum,
          activeDraggingCardId,
          activeDraggingCardData
        )

      }
      else {
        // Lấy vị trí cũ (từ thằng oldColumnWhenDraggingCard) 
        const oldCardIndex = oldColumnWhenDraggingCard?.cards?.findIndex(c => c._id === activeDragItemId)
        //lấy vị trí mới; nếu over là columnId (vùng trống), chèn về cuối
        let newCardIndex = overColum?.cards?.findIndex(c => c._id === overCardId)
        if (newCardIndex < 0) newCardIndex = overColum?.cards?.length - 1
        // Dùng arrayMove vì kéo card trong một cái colum thì tương tự logic của cái kéo colum trong một cái board content
        const dndOrderedCards = arrayMove(oldColumnWhenDraggingCard?.cards, oldCardIndex, newCardIndex)
        setOrderedColumnsState((prevColumns) => {
          //Clone mảng OrderedColumnsState cũ ra một cái mới để xử lý data rồi return -cập nhật lại OderedColumnState mới
          const nextColumns = cloneDeep(prevColumns)

          //Tìm tới cái colum mà ta đang thả 
          const targetColumn = nextColumns.find(column => column._id === overColum._id)

          //Cập nhật lại 2 giá trị mới là card và cardOrderIds trong cái targetColumn
          targetColumn.cards = dndOrderedCards
          targetColumn.cardOrderIds = dndOrderedCards.map(card => card._id)

          //Trẩ về giá trị state mới (chuẩn vị trí)
          return nextColumns
        })
      }
    }


    //Xử lí kéo thả colum
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYLE.COLUMN) {
      if (active.id !== over.id) {
        // Lấy vị trí cũ (từ thằng active) và vị trí mới (từ thằng over)
        const oldColumnIndex = orderedColumnsState.findIndex(c => c._id === active.id)
        const newColumnIndex = orderedColumnsState.findIndex(c => c._id === over.id)
        // Dùng arrayMove của thằng dnd-kit để sắp xếp lại mảng Columns ban đầu
        // Code của arrayMove: dnd-kit/packages/sortable/src/utilities/arrayMove.ts
        const dndOrderedColumns = arrayMove(orderedColumnsState, oldColumnIndex, newColumnIndex)


        // Cập nhật lại cả 2 state: Thứ tự cột và mảng cột
        setOrderedColumnsState(dndOrderedColumns)
      }
    }
    //Những dữ liệu sau khi kéo thả luôn phải đưa về giá trị null ban đầu
    setActiveDragItemId(null)
    setActiveDragItemType(null)
    setActiveDragItemData(null)
    setOldColumnWhenDraggingCard(null)
  }

  // Amnimation khi thả (drop) phần tử - Test bằng cách kéo xong thả trực tiếp và nhìn phần tử overlay
  //https://github.com/clauderic/dnd-kit/blob/master/stories/2%20-%20Presets/Sortable/Sortable.tsx
  const dropAnimation = {
    sideEffects: defaultDropAnimationSideEffects({
      styles: {
        active: {
          opacity: '0.5',
        },
      },
    }),
  };
  {/* Thuật toán phát hiện va chạm (nếu không có nó thì card với cover lớn sẽ không kéo qua Column được vì
       lúc này nó đang bị conflict giữa card và column), chúng ta sẽ dùng closestCorners thay vì closestCenter
       https://docs.dndkit.com/api-documentation/context-provider/collision-detection-algorithms 
           
       Nếu chỉ dùng closestCorners sẽ có bug flickering +sai lệch dữ liệu 
       */}

  //Chúng ta sẽ custom lại chiến lược / thuật toán phát hiện va chạm tối ưu cho việc kéo thả card giữa nhiều columns
  //args =arguments =các đối số ,tham số
  //https://github.com/clauderic/dnd-kit/blob/master/stories/2%20-%20Presets/Sortable/MultipleContainers.tsx dòng 195 trở đi
  const collisionDetectionStrategy = useCallback((args) => {
    if (activeDragItemType === ACTIVE_DRAG_ITEM_TYLE.COLUMN) {
      return closestCorners({ ...args })
    }
    //Tìm các điểm giao nhau ,va chạm, trả về một mảng các va chạm - intersection với con trỏ
    const pointerIntersections = pointerWithin(args)
    //Fix triệt để cái bug flickrting của thư viện dnd-kit trong trường hợp sau:
    // -kéo một cái card có image cover lớn và kéo lên phía trên cùng ra khỏi khu vực kéo thả 
    if (!pointerIntersections?.length) return
    // //thuật toán phát hiện va chạm sẽ trả về một mảng các va chạm ở đây
    // const intersections = pointerIntersections?.length > 0 ? pointerIntersections : rectIntersection(args)
    //Tìm overId đầu tiên trong đám pointerIntersections ở trên
    let overId = getFirstCollision(pointerIntersections, 'id')
    if (overId) {
      lastOverId.current = overId
      return [{ id: overId }]
    }
    //Nếu overId là null thì trả về mảng rỗng -tránh bug crash trang
    return lastOverId.current ? [{ id: lastOverId.current }] : []
  }, [activeDragItemType])

  return (
    <DndContext
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      collisionDetection={collisionDetectionStrategy}
      onDragEnd={handleDragEnd}
      sensors={sensors}>
      <Box sx={{
        bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2'),
        // width: '100%',
        height: (theme) => theme.trello.boardContentHeight,
        p: '10px 0',
      }}
      >
        <ListColumns columns={orderedColumnsState} createNewColumn={createNewColumn} createNewCard={createNewCard} />
        <DragOverlay dropAnimation={dropAnimation}>
          {(activeDragItemType === ACTIVE_DRAG_ITEM_TYLE.COLUMN) && <Column column={activeDragItemData} />}
          {(activeDragItemType === ACTIVE_DRAG_ITEM_TYLE.CARD) && <Card card={activeDragItemData} />}
        </DragOverlay>
      </Box >
    </DndContext>
  )
}

export default BoardContent
