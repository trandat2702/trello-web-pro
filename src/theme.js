
import { experimental_extendTheme as extendTheme } from '@mui/material/styles';
const APP_BAR_HEIGHT = '65px'
const BOARD_BAR_HEIGHT = '60px'
const BOARD_CONTENT_HEIGHT = `calc(100vh - ${APP_BAR_HEIGHT} - ${BOARD_BAR_HEIGHT})`
const COLUMN_HEADER_HEIGHT = '50px'
const COLUMN_FOOTER_HEIGHT = '56px'
const theme = extendTheme({
  trello: {
    appBarHeight: APP_BAR_HEIGHT,
    boardBarHeight: BOARD_BAR_HEIGHT,
    boardContentHeight: BOARD_CONTENT_HEIGHT,
    columnHeaderHeight: COLUMN_HEADER_HEIGHT,
    columnFooterHeight: COLUMN_FOOTER_HEIGHT
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          '*::-webkit-scrollbar': {
            width: 8,
            height: 8
          },
          '*::-webkit-scrollbar-thumb': {
            backgroundColor: '#dcdde1',
            borderRadius: '8px'
          },
          '*::-webkit-scrollbar-thumb:hover': {
            backgroundColor: 'white',
          }
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        select: {
          height: "0px",
          display: "flex",
          alignItems: "center",
          padding: "8px 14px",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderWidth: '0.5px',
          '&:hover': {
            borderWidth: '0.5px'
          }
        },
      },
    },
    MuiInputLabel: {
      styleOverrides: {
        root: ({ theme }) => ({
          color: theme.palette.primary.main,
          fontSize: '0.875rem',
        })
      },
    },
    MuiCard: {
      styleOverrides: {
        root: { overflow: 'unset' }
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          '&.MuiTypography-body1': {
            fontSize: '0.875rem',
          }
        }
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        '& fieldset': { borderWidth: '0.5px !important' },
        '&:hover fieldset': { borderWidth: '1px !important' },
        '&.Mui-focused fieldset': { borderWidth: '1px !important' }
      },
    },
  },
});
export default theme;
