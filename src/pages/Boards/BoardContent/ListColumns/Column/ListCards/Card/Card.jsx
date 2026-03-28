
import { Card as MuiCard } from '@mui/material'
import Box from '@mui/material/Box'
import CardActions from '@mui/material/CardActions'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import GroupIcon from '@mui/icons-material/Group'
import ModeCommentIcon from '@mui/icons-material/ModeComment'
import AttachmentIcon from '@mui/icons-material/Attachment'
import Typography from '@mui/material/Typography'
import Button from '@mui/material/Button'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useDispatch } from 'react-redux'
import { updateCurrentActiveCard, showModalActiveCard } from '~/redux/activeCard/activeCardSlice'
function Card({ card }) {
  const dispatch = useDispatch()
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: card._id,
    data: { ...card }
  })
  // console.log({ card })
  const dndKitCardStyles = {
    // touchAction: 'none',
    // Nếu sử dụng CSS.Transform như doc thì khi kéo thả sẽ bị lỗi stretch (co dãn)
    //https://github.com/clauderic/dnd-kit/issues/117
    transform: CSS.Translate.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : undefined,
    border: isDragging ? '2px solid #2ecc71' : undefined
  }

  const shouldShowCardAction = () => {
    return !!card?.memberIds?.length || !!card?.comments?.length || !!card?.attachments?.length
  }

  const setActiveCard = () => {
    // Cập nhật dữ liệu card hiện tại vào trong Redux để mở Modal Card chi tiết
    dispatch(updateCurrentActiveCard(card))
    //Hiện modal lên
    dispatch(showModalActiveCard())
    window.history.pushState({}, '', `?cardId=${card._id}`)
  }
  return (
    <>
      <MuiCard
        onClick={setActiveCard}
        ref={setNodeRef}
        style={dndKitCardStyles}
        {...attributes}
        {...listeners}
        sx={{
          cursor: 'pointer',
          boxShadow: '0 1px 1px rgba(0,0,0,0.2)',
          overflow: 'unset',
          display: card?.FE_PlaceholderCard ? 'none' : 'block',
          border: '1px solid transparent',
          '&:hover': { borderColor: (theme) => theme.palette.main },

          // display: card?.FE_PlaceholderCard ? 'none' : 'block'
          //cách khác
          height: card?.FE_PlaceholderCard ? '0px' : 'unset'
        }}>
        {card?.cover && <CardMedia sx={{ height: 140 }} image={card?.cover} />}
        <CardContent sx={{ p: 1.5, '&:last-child': { p: 1.5 } }}>
          {/* Vùng hiển thị Labels trên Card ở ngoài màn hình Board */}
          {card?.labels && card?.labels?.length > 0 && (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
              {card.labels.map((labelColor, index) => (
                <Box
                  key={index}
                  sx={{ width: '40px', height: '8px', borderRadius: '4px', backgroundColor: labelColor }}
                />
              ))}
            </Box>
          )}

          <Typography>{card?.title}</Typography>
        </CardContent>
        {shouldShowCardAction() &&
          <CardActions sx={{ p: '0 4px 8px 4px' }}>
            {!!card?.memberIds?.length && <Button size="small" startIcon={<GroupIcon />}>{card?.memberIds?.length}</Button>}
            {!!card?.comments?.length && <Button size="small" startIcon={<ModeCommentIcon />}>{card?.comments?.length}</Button>}
            {!!card?.attachments?.length && <Button size="small" startIcon={<AttachmentIcon />}>{card?.attachments?.length}</Button>}
          </CardActions>}
      </MuiCard>
    </>
  )
}

export default Card
