
import Box from '@mui/material/Box'
import ModeSelect from '~/components/ModeSelect/ModeSelect'
import { ReactComponent as trelloLogo } from '~/assets/trello.svg'
import SvgIcon from '@mui/material/SvgIcon'
import Typography from '@mui/material/Typography'
import Tooltip from '@mui/material/Tooltip'
import HelpOutlineIcon from '@mui/icons-material/HelpOutline'
import Profiles from './Menus/Profiles'
import LibraryAddIcon from '@mui/icons-material/LibraryAdd'
import { Link } from 'react-router-dom'
import Notifications from './Notifications/Notifications'
import AutoCompleteSearchBoard from './SearchBoards/AutoCompleteSearchBoard'
function AppBar() {
  return (
    <Box px={2} sx={{
      width: '100%',
      height: (theme) => theme.trello.appBarHeight,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 2,
      overflowX: 'auto',
      bgcolor: (theme) => (theme.palette.mode === 'dark' ? '#2c3e50' : '#1565c0'),
      '&::-webkit-scrollbar-track': { m: 2 }
    }}>
      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 2
      }}>
        <Link to="/" style={{ color: 'inherit' }}>
          <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 0.5
          }}>
            <SvgIcon component={trelloLogo} fontSize='small' sx={{ color: 'white' }} />
            <Typography variant='span' sx={{ font: '1.2rem', fontWeight: 'bold', color: 'white' }}>
              Trello
            </Typography>
          </Box>
        </Link>
      </Box >

      <Box sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1
      }}>
        {/* Tìm kiếm nhanh 1 hoặc nhiều board ở đây */}
        <AutoCompleteSearchBoard />
        {/* Dark - Light - System modes */}
        <ModeSelect />
        {/* Xử lí hiểu thị các thông báo - notifications ở đây */}
        <Notifications />

        <Tooltip title="Help">
          <HelpOutlineIcon sx={{ cursor: 'pointer', color: 'white' }} />
        </Tooltip>
        <Profiles />
      </Box>

    </Box >
  )
}

export default AppBar
