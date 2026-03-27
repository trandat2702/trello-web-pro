
import { useState } from 'react'
import Box from '@mui/material/Box'
import Chip from '@mui/material/Chip'
import Tooltip from '@mui/material/Tooltip'
import DashboardIcon from '@mui/icons-material/Dashboard'
import VpnLockIcon from '@mui/icons-material/VpnLock'
import AddToDriveIcon from '@mui/icons-material/AddToDrive'
import BoltIcon from '@mui/icons-material/Bolt'
import FilterListIcon from '@mui/icons-material/FilterList'
import DeleteIcon from '@mui/icons-material/Delete'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import { capitalizeFirstLetter } from '~/utils/formatters'
import BoardUserGroup from './BoardUserGroup'
import InviteBoardUser from './InviteBoardUser'
import { deleteBoardAPI } from '~/apis'
import { useNavigate } from 'react-router-dom'

const MENU_STYLES = {
  color: 'white',
  backgroundColor: 'transparent',
  border: 'none',
  paddingX: '5px',
  '& .MuiSvgIcon-root': {
    color: 'white'
  },
  '&:hover': {
    bgcolor: 'primary.50'
  }
}
function BoardBar({ board }) {
  const navigate = useNavigate()
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false)

  const handleDeleteBoard = async () => {
    await deleteBoardAPI(board._id)
    setOpenDeleteDialog(false)
    navigate('/boards')
  }

  return (
    <Box sx={{
      width: '100%',
      height: (theme) => theme.trello.boardBarHeight,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 2,
      paddingX: 2,
      overflowX: 'auto',
      '&::-webkit-scrollbar-track': { m: 2 },
      bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#34495e' : '#1976d2')
    }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <Tooltip title={board?.description}>
          <Chip
            sx={MENU_STYLES}
            icon={<DashboardIcon />}
            label={board?.title}
            clickable
          />
        </Tooltip>

        <Chip
          sx={MENU_STYLES}
          icon={<VpnLockIcon />}
          label={capitalizeFirstLetter(board?.type)}
          clickable
        />

        <Chip sx={MENU_STYLES}
          icon={<AddToDriveIcon />}
          label="Add To Google Drive"
          clickable
        />

        <Chip sx={MENU_STYLES}
          icon={<BoltIcon />}
          label="Automations"
          clickable
        />
        <Chip sx={MENU_STYLES}
          icon={<FilterListIcon />}
          label="Filters"
          clickable
        />
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        {/* Xử lí mời user vào làm thành viên của Board */}
        <InviteBoardUser boardId={board?._id} />

        {/* Xử lí hiện thi danh sách thành viên của Board */}
        <BoardUserGroup boardUsers={board?.FE_allUsers} />

        {/* Nút xóa Board */}
        <Tooltip title="Delete this board">
          <Chip
            sx={{
              ...MENU_STYLES,
              '&:hover': { bgcolor: 'error.main' }
            }}
            icon={<DeleteIcon />}
            label="Delete"
            clickable
            onClick={() => setOpenDeleteDialog(true)}
          />
        </Tooltip>

        {/* Dialog xác nhận xóa Board */}
        <Dialog
          open={openDeleteDialog}
          onClose={() => setOpenDeleteDialog(false)}
        >
          <DialogTitle>{"Delete Board?"}</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Bạn có chắc chắn muốn xóa board <strong>&quot;{board?.title}&quot;</strong>? Tất cả columns và cards bên trong sẽ bị xóa vĩnh viễn và không thể khôi phục!
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenDeleteDialog(false)}>Cancel</Button>
            <Button onClick={handleDeleteBoard} color="error" variant="contained" autoFocus>
              Confirm Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Box>
  )
}

export default BoardBar

