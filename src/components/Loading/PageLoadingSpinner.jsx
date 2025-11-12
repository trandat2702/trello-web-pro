import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import CircularProgress from '@mui/material/CircularProgress'
function PageLoadingSpinner({ caption }) {
  return (
    <Box sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      width: '100vw',
      gap: 2
    }}>
      <CircularProgress />
      <Typography >{caption}</Typography>
    </Box>
  )
}

export default PageLoadingSpinner