import { useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import Modal from '@mui/material/Modal'
import Typography from '@mui/material/Typography'
import CreditCardIcon from '@mui/icons-material/CreditCard'
import CancelIcon from '@mui/icons-material/Cancel'
import Grid from '@mui/material/Unstable_Grid2'
import Stack from '@mui/material/Stack'
import Divider from '@mui/material/Divider'
import PersonOutlineOutlinedIcon from '@mui/icons-material/PersonOutlineOutlined'
import LocalOfferOutlinedIcon from '@mui/icons-material/LocalOfferOutlined'
import TaskAltOutlinedIcon from '@mui/icons-material/TaskAltOutlined'
import WatchLaterOutlinedIcon from '@mui/icons-material/WatchLaterOutlined'
import AttachFileOutlinedIcon from '@mui/icons-material/AttachFileOutlined'
import ImageOutlinedIcon from '@mui/icons-material/ImageOutlined'
import AddOutlinedIcon from '@mui/icons-material/AddOutlined'
import ShareOutlinedIcon from '@mui/icons-material/ShareOutlined'
import SubjectRoundedIcon from '@mui/icons-material/SubjectRounded'
import DvrOutlinedIcon from '@mui/icons-material/DvrOutlined'
import ToggleFocusInput from '~/components/Form/ToggleFocusInput'
import VisuallyHiddenInput from '~/components/Form/VisuallyHiddenInput'
import { singleFileValidator } from '~/utils/validators'
import { toast } from 'react-toastify'
import CardUserGroup from './CardUserGroup'
import CardDescriptionMdEditor from './CardDescriptionMdEditor'
import CardActivitySection from './CardActivitySection'
import { useDispatch, useSelector } from 'react-redux'
import { selectCurrentActiveCard, clearAndHideCurrentActiveCard, updateCurrentActiveCard, selectIsShowModalActiveCard } from '~/redux/activeCard/activeCardSlice'
import { styled } from '@mui/material/styles'
import { updateCardDetailsAPI } from '~/apis'
import { selectCurrentUser } from '~/redux/user/userSlice'
import { updateCardInBoard, selectCurrentActiveBoard } from '~/redux/activeBoard/activeBoardSlice'
import { CARD_MEMBER_ACTIONS } from '~/utils/constants'
import { socketIoInstance } from '~/socketClient'
import Popover from '@mui/material/Popover'
import { StaticDateTimePicker } from '@mui/x-date-pickers/StaticDateTimePicker'
import dayjs from 'dayjs'
const SidebarItem = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: '6px',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: '600',
  color: theme.palette.mode === 'dark' ? '#90caf9' : '#172b4d',
  backgroundColor: theme.palette.mode === 'dark' ? '#2f3542' : '#091e420f',
  padding: '10px',
  borderRadius: '4px',
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark' ? '#33485D' : theme.palette.grey[300],
    '&.active': {
      color: theme.palette.mode === 'dark' ? '#000000de' : '#0c66e4',
      backgroundColor: theme.palette.mode === 'dark' ? '#90caf9' : '#e9f2ff'
    }
  }
}))

/**
 * Note: Modal là một low-component mà bọn MUI sử dụng bên trong những thứ như Dialog, Drawer, Menu, Popover. Ở đây dĩ nhiên chúng ta có thể sử dụng Dialog cũng không thành vấn đề gì, nhưng sẽ sử dụng Modal để dễ linh hoạt tùy biến giao diện từ con số 0 cho phù hợp với mọi nhu cầu nhé.
 */
function ActiveCard() {
  const dispatch = useDispatch()
  const activeCard = useSelector(selectCurrentActiveCard)
  const isShowModalActiveCard = useSelector(selectIsShowModalActiveCard)
  const currentUser = useSelector(selectCurrentUser)
  const board = useSelector(selectCurrentActiveBoard)
  // Quản lý Popover chọn ngày và State ngày tạm thời
  const [anchorElDate, setAnchorElDate] = useState(null)

  // State xài cho lúc người dùng đang chọn chọn trong Lịch (Chưa bấm OK)
  const [selectedDate, setSelectedDate] = useState(dayjs())

  const openDatePopover = (event) => {
    setAnchorElDate(event.currentTarget)
    // Mỗi khi bấm mở Popover, chép ngày hiện tại của thẻ vào Lịch. Nếu thẻ chưa có dueDate thì lấy giờ rảnh của hôm nay.
    setSelectedDate(activeCard?.dueDate ? dayjs(activeCard.dueDate) : dayjs())
  }

  const closeDatePopover = () => setAnchorElDate(null)

  // Quản lý Popover chọn Nhãn (Labels)
  const [anchorElLabels, setAnchorElLabels] = useState(null)
  const openLabelsPopover = (event) => setAnchorElLabels(event.currentTarget)
  const closeLabelsPopover = () => setAnchorElLabels(null)

  // Hàm cập nhật Mảng Labels (Chế độ Single Select - Chỉ chọn 1 màu gốc)
  const onUpdateCardLabels = (labelColor) => {
    const currentLabels = activeCard?.labels || []
    let newLabels

    // Logic Toggle Tối giản: 
    // Nếu Click trùng vào cái màu đang có sẵn -> Vứt màu đó luôn, Mảng biến thành Rỗng (Hủy gán Nhãn)
    if (currentLabels.includes(labelColor)) {
      newLabels = []
    }
    // Nếu Click sang một màu mới -> Thay máu hoàn toàn bằng màu đó (Mảng chỉ tồn tại đúng 1 cái màu độc lập)
    else {
      newLabels = [labelColor]
    }
    // Gọi API cập nhật ngay lập tức
    callApiUpdateCard({ labels: newLabels })
  }

  // Hàm cập nhật ngày hết hạn (Đã kết nối hoàn thiện với Backend)
  const onUpdateCardDueDate = (newDate) => {
    // 1. Chuyển sang dạng Timestamp (Dãy số đại diện milliseconds) để lưu vào MongoDB chuẩn xác nhất
    const timestampValue = newDate.valueOf()

    // 2. Bắn API sang Backend để Ghi Đè Database thực tế!
    callApiUpdateCard({ dueDate: timestampValue })

    // 3. Đóng Menu Lịch
    closeDatePopover()
  }

  useEffect(() => {
    // Khởi tạo tính năng lắng nghe Real-time: Khi dữ liệu Board bị thay đổi bởi Socket.io
    // Modal Chi tiết Card đang mở sẽ tự động lấy dữ liệu mới nhất trong Board cập nhật lại
    if (isShowModalActiveCard && activeCard && board) {
      let currentCard = null
      for (const column of board.columns) {
        currentCard = column.cards?.find(c => c._id === activeCard._id)
        if (currentCard) break
      }
      // Dùng JSON.stringify so sánh nếu khác nhau thì cập nhật modal, để tránh bị văng re-render liên tục
      if (currentCard && JSON.stringify(currentCard) !== JSON.stringify(activeCard)) {
        dispatch(updateCurrentActiveCard(currentCard))
      }
    }
  }, [board, activeCard, isShowModalActiveCard, dispatch])

  //Không dùng biến State để check đóng mở Modal nữa vì chúng ta sẽ check bên Boards/_id.jsx isShowModalActiveCard từ Redux
  const handleCloseModal = () => {
    dispatch(clearAndHideCurrentActiveCard())
    window.history.pushState({}, '', window.location.pathname)
  }

  //Function dùng chung cho các trường hợp cập nhật card title, description, cover,...
  const callApiUpdateCard = async (updateData) => {

    const updatedCard = await updateCardDetailsAPI(activeCard._id, updateData)
    //B1: Cập nhật lại cái card đang active trong modal hiện tại
    dispatch(updateCurrentActiveCard(updatedCard))
    //B2: Cập nhật lại cái bản ghi card trong activeBoard (nested data)
    dispatch(updateCardInBoard(updatedCard))

    socketIoInstance.emit('FE_UPDATE_BOARD', activeCard.boardId)

    return updatedCard
  }

  const onUpdateCardTitle = (newTitle) => {
    callApiUpdateCard({ title: newTitle.trim() })
  }

  const onUpdateCardDescription = (newDescription) => {
    callApiUpdateCard({ description: newDescription })
  }

  const onUploadCardCover = (event) => {
    // console.log(event.target?.files[0])
    const error = singleFileValidator(event.target?.files[0])
    if (error) {
      toast.error(error)
      return
    }
    let reqData = new FormData()
    reqData.append('cardCover', event.target?.files[0])

    // Gọi API...
    toast.promise(
      callApiUpdateCard(reqData).finally(() => {
        event.target.value = '' // Reset lại giá trị của input file sau khi upload xong
      }
      ),
      { pending: 'Updating....' }
    )
  }
  //Dùng async await ở đây để component con CardActivitySection chờ và nếu thành công thì mới clear thẻ input comment
  const onAddCardComment = async (commentToAdd) => {
    await callApiUpdateCard({ commentToAdd })
  }
  const onUpdateCardMembers = (incomingMemberInfo) => {
    callApiUpdateCard({ incomingMemberInfo })
  }
  const handleShareCard = async () => {
    //Tạo URL, Bạn lấy domain hiện tại cộng với đường dẫn tới board và id của card
    const currentUrl = window.location.origin
    const cardLink = `${currentUrl}/boards/${board._id}?cardId=${activeCard._id}`
    try {
      await navigator.clipboard.writeText(cardLink)
      toast.success('Card link copied to clipboard')
    } catch (error) {
      toast.error('Failed to copy card link')
    }
  }
  return (
    <Modal
      disableScrollLock
      open={isShowModalActiveCard}
      onClose={handleCloseModal} // Sử dụng onClose trong trường hợp muốn đóng Modal bằng nút ESC hoặc click ra ngoài Modal
      sx={{ overflowY: 'auto' }}>
      <Box sx={{
        position: 'relative',
        width: 900,
        maxWidth: 900,
        bgcolor: 'white',
        boxShadow: 24,
        borderRadius: '8px',
        border: 'none',
        outline: 0,
        padding: '40px 20px 20px',
        margin: '50px auto',
        backgroundColor: (theme) => theme.palette.mode === 'dark' ? '#1A2027' : '#fff'
      }}>
        <Box sx={{
          position: 'absolute',
          top: '12px',
          right: '10px',
          cursor: 'pointer'
        }}>
          <CancelIcon color="error" sx={{ '&:hover': { color: 'error.light' } }} onClick={handleCloseModal} />
        </Box>
        {activeCard?.cover &&
          <Box sx={{ mb: 4 }}>
            <img
              style={{ width: '100%', height: '320px', borderRadius: '6px', objectFit: 'cover' }}
              src={activeCard?.cover}
              alt="card-cover"
            />
          </Box>
        }

        <Box sx={{ mb: 1, mt: -3, pr: 2.5, display: 'flex', alignItems: 'center', gap: 1 }}>
          <CreditCardIcon />

          {/* Feature 01: Xử lý tiêu đề của Card */}
          <ToggleFocusInput
            inputFontSize='22px'
            value={activeCard?.title}
            onChangedValue={onUpdateCardTitle} />
        </Box>

        <Grid container spacing={2} sx={{ mb: 3 }}>
          {/* Left side */}
          <Grid xs={12} sm={9}>

            <Box sx={{ mb: 3, display: 'flex', gap: 3 }}>
              {/* Phần Members*/}
              <Box>
                <Typography sx={{ fontWeight: '600', color: 'primary.main', mb: 1 }}>Thành viên</Typography>
                <CardUserGroup cardMemberIds={activeCard?.memberIds} onUpdateCardMembers={onUpdateCardMembers} />
              </Box>

              {/* Phần hiển thị Nhãn (Labels) được dán cho Card */}
              {activeCard?.labels && activeCard?.labels?.length > 0 && (
                <Box>
                  <Typography sx={{ fontWeight: '600', color: 'primary.main', mb: 1 }}>Nhãn dán (Labels)</Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                    {activeCard.labels.map((labelColor, index) => (
                      <Box
                        key={index}
                        sx={{
                          width: '45px',
                          height: '32px',
                          borderRadius: '4px',
                          backgroundColor: labelColor,
                          cursor: 'pointer',
                          '&:hover': { opacity: 0.8 },
                          transition: 'all 0.2s',
                        }}
                        onClick={openLabelsPopover}
                      />
                    ))}
                    {/* Nút cộng thêm nhãn màu xám (Chỉ hiện khi Card đang có ít nhất 1 nhãn) */}
                    <Box
                      onClick={openLabelsPopover}
                      sx={{
                        width: '32px',
                        height: '32px',
                        borderRadius: '4px',
                        bgcolor: (theme) => theme.palette.mode === 'dark' ? '#2f3542' : '#091e420f',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer',
                        '&:hover': { bgcolor: (theme) => theme.palette.mode === 'dark' ? '#33485D' : '#091e4224' }
                      }}>
                      <AddOutlinedIcon fontSize="small" sx={{ color: (theme) => theme.palette.mode === 'dark' ? '#90caf9' : '#172b4d' }} />
                    </Box>
                  </Box>
                </Box>
              )}
              {/* Phần hiển thị Ngày hết hạn */}
              {activeCard?.dueDate && (
                <Box>
                  <Typography sx={{ fontWeight: '600', color: 'primary.main', mb: 1 }}>Ngày hết hạn</Typography>
                  <Box sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    borderRadius: '4px',
                    padding: '5px 8px',
                    backgroundColor: dayjs().isAfter(dayjs(activeCard.dueDate)) ? '#ef5350' : '#4caf50',
                    color: 'white',
                    cursor: 'pointer'
                  }}
                    onClick={openDatePopover} // Click vào ngày này cũng mở lại bảng chọn lịch luôn cho tiện
                  >
                    <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                      {dayjs(activeCard.dueDate).format('DD/MM/YYYY HH:mm')}
                      {dayjs().isAfter(dayjs(activeCard.dueDate)) && ' (Quá hạn)'}
                    </Typography>
                  </Box>
                </Box>
              )}
            </Box>

            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <SubjectRoundedIcon />
                <Typography variant="span" sx={{ fontWeight: '600', fontSize: '20px' }}>Description</Typography>
              </Box>

              {/* Feature 03: Xử lý mô tả của Card */}
              <CardDescriptionMdEditor
                carDescriptionProp={activeCard?.description}
                handleUpdateCardDescription={onUpdateCardDescription}
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <DvrOutlinedIcon />
                <Typography variant="span" sx={{ fontWeight: '600', fontSize: '20px' }}>Activity</Typography>
              </Box>

              {/* Feature 04: Xử lý các hành động, ví dụ comment vào Card */}
              <CardActivitySection
                cardComments={activeCard?.comments}
                onAddCardComment={onAddCardComment}
              />
            </Box>
          </Grid>

          {/* Right side */}
          <Grid xs={12} sm={3}>
            <Typography sx={{ fontWeight: '600', color: 'primary.main', mb: 1 }}>Add To Card</Typography>
            <Stack direction="column" spacing={1}>
              {/* Feature 05: Xử lý hành động bản thân user tự join vào card */}
              {/* Nếu user hiện tại đang đăng nhập chưa thuộc mảng memberIds của card thì mới cho hiện thị nút Join */}
              {!activeCard?.memberIds?.includes(currentUser?._id) &&
                < SidebarItem className="active" onClick={() => onUpdateCardMembers({ userId: currentUser._id, action: CARD_MEMBER_ACTIONS.ADD })} >
                  <PersonOutlineOutlinedIcon fontSize="small" />
                  Join
                </SidebarItem>
              }
              {/* Feature 06: Xử lý hành động cập nhật ảnh Cover của Card */}
              <SidebarItem className="active" component="label">
                <ImageOutlinedIcon fontSize="small" />
                Cover
                <VisuallyHiddenInput type="file" onChange={onUploadCardCover} />
              </SidebarItem>

              <SidebarItem><AttachFileOutlinedIcon fontSize="small" />Attachment</SidebarItem>
              <SidebarItem onClick={openLabelsPopover}><LocalOfferOutlinedIcon fontSize="small" />Labels</SidebarItem>
              <SidebarItem onClick={openDatePopover}><WatchLaterOutlinedIcon fontSize="small" />Dates</SidebarItem>
            </Stack>

            <Divider sx={{ my: 2 }} />

            <Typography sx={{ fontWeight: '600', color: 'primary.main', mb: 1 }}>Actions</Typography>
            <Stack direction="column" spacing={1}>
              <SidebarItem onClick={handleShareCard}><ShareOutlinedIcon fontSize="small" />Share</SidebarItem>
            </Stack>
          </Grid>
        </Grid>

        <Popover
          open={Boolean(anchorElDate)}
          anchorEl={anchorElDate}
          onClose={closeDatePopover}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        >
          <StaticDateTimePicker
            displayStaticWrapperAs="desktop"
            value={selectedDate} // Trói buộc UI Lịch vào biến state local
            onChange={(newValue) => setSelectedDate(newValue)} // Cập nhật nháp trên giao diện, không gọi API, Lịch sẽ không bị tắt
            onAccept={(newValue) => onUpdateCardDueDate(newValue)} // CHỈ LƯU API KHI NHẤN NÚT OK
            onCancel={closeDatePopover} // BẤM CANCEL ĐÓNG LUÔN KHÔNG LƯU GIỮ 
            slotProps={{
              // BẬC THANH TOOLBAR ĐỂ BẠN NHÌN THẤY "THỜI GIAN" MÀ CLICK SANG CHẾ ĐỘ ĐỒNG HỒ
              toolbar: { hidden: false }
            }}
          />
        </Popover>

        {/* Popover chứa bảng chọn Labels */}
        <Popover
          open={Boolean(anchorElLabels)}
          anchorEl={anchorElLabels}
          onClose={closeLabelsPopover}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        >
          <Box sx={{ p: 2, width: '280px' }}>
            <Typography sx={{ textAlign: 'center', fontWeight: 'bold', mb: 2, fontSize: '14px' }}>Nhãn dán (Labels)</Typography>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {/* Mảng các màu mặc định của Trello */}
              {[
                '#4bce97', // Emerald (Xanh rêu)
                '#e2b203', // Yellow (Vàng)
                '#faa53d', // Orange (Cam)
                '#f87462', // Red (Đỏ)
                '#9f8fef', // Purple (Tím)
                '#579dff'  // Blue (Xanh lơ)
              ].map((labelColor) => {
                const isSelected = activeCard?.labels?.includes(labelColor)
                return (
                  <Box
                    key={labelColor}
                    onClick={() => onUpdateCardLabels(labelColor)}
                    sx={{
                      height: '32px',
                      backgroundColor: labelColor,
                      borderRadius: '4px',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      px: 1.5,
                      '&:hover': { opacity: 0.8 },
                      transition: 'all 0.2s',
                    }}
                  >
                    {isSelected && <TaskAltOutlinedIcon fontSize="small" sx={{ color: 'white' }} />}
                  </Box>
                )
              })}
            </Box>
          </Box>
        </Popover>
      </Box>
    </Modal >
  )
}

export default ActiveCard
