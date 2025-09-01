
import Box from '@mui/material/Box'
import Menu from '@mui/material/Menu'
import MenuItem from '@mui/material/MenuItem'
import React from 'react'
import Divider from '@mui/material/Divider';
import ListItemIcon from '@mui/material/ListItemIcon';
import Avatar from '@mui/material/Avatar'
import { Logout, PersonAdd, Settings } from '@mui/icons-material'
import { IconButton, Tooltip } from '@mui/material'
function Profiles() {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <Box>
      <Tooltip title="Profile">
        <IconButton
          onClick={handleClick}
          size="small"
          sx={{ Padding: 0 }}
          aria-controls={open ? 'basic-menu-profiles' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
        >
          <Avatar sx={{ width: 34, height: 34 }}
            alt='Con Khỉ'
            src='https://imgs.search.brave.com/UFkmy5e0OMJbuC5PRZe-o069X8VGBF-qhM-cNe_TIJI/rs:fit:500:0:1:0/g:ce/aHR0cHM6Ly9oYXlj/YWZlLnZuL3dwLWNv/bnRlbnQvdXBsb2Fk/cy8yMDIyLzExL2hp/bmgtYW5oLTEyLWNv/bi1naWFwLWN1dGUt/M0QtY29uLWtoaS10/dW9pLVRoYW4uanBn' />
        </IconButton>
      </Tooltip>
      <Menu
        id="basic-menu-profiles"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{
          list: {
            'aria-labelledby': 'basic-button-profiles',
          },
        }}
      >
        <MenuItem >
          <Avatar sx={{ width: 28, height: 28, mr: 2 }} /> Profile
        </MenuItem>
        <MenuItem >
          <Avatar sx={{ width: 28, height: 28, mr: 2 }} /> My account
        </MenuItem>
        <Divider />
        <MenuItem >
          <ListItemIcon>
            <PersonAdd fontSize="small" />
          </ListItemIcon>
          Add another account
        </MenuItem>
        <MenuItem >
          <ListItemIcon>
            <Settings fontSize="small" />
          </ListItemIcon>
          Settings
        </MenuItem>
        <MenuItem >
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </Box>
  )
}

export default Profiles
