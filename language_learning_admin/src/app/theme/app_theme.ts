import { createTheme } from '@mui/material/styles'

export const appTheme = createTheme({
  palette: {
    mode: 'light',
    divider: '#ded9e7',
    primary: {
      light: '#9a8cf2',
      main: '#6c5ce7',
      dark: '#5542cb',
      contrastText: '#ffffff',
    },
    secondary: {
      light: '#7de7b4',
      main: '#19b86a',
      dark: '#0d8f50',
    },
    success: {
      main: '#16a765',
    },
    warning: {
      main: '#d69618',
    },
    error: {
      main: '#dc5360',
    },
    info: {
      main: '#4b83dd',
    },
    text: {
      primary: '#2d2938',
      secondary: '#716a7d',
      disabled: '#aaa4b2',
    },
    background: {
      default: '#f8f7fc',
      paper: '#ffffff',
    },
  },
  shape: {
    borderRadius: 12,
  },
  typography: {
    fontFamily: 'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    h1: {
      fontSize: '2rem',
      fontWeight: 700,
    },
    h2: {
      fontSize: '1.5rem',
      fontWeight: 700,
    },
  },
  components: {
    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          color: '#2d2938',
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 700,
        },
        contained: {
          boxShadow: '0 4px 12px rgba(108, 92, 231, 0.18)',
          '&:hover': {
            boxShadow: '0 6px 16px rgba(108, 92, 231, 0.25)',
          },
        },
        outlined: {
          borderColor: '#d2ccde',
          borderWidth: 1,
          '&:hover': {
            borderColor: '#9b90b2',
            borderWidth: 1,
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          transition: 'box-shadow 160ms ease, background-color 160ms ease',
          '& .MuiOutlinedInput-notchedOutline': {
            borderColor: '#d2ccde',
            borderWidth: 1,
          },
          '&:hover .MuiOutlinedInput-notchedOutline': {
            borderColor: '#9b90b2',
          },
          '&.Mui-focused': {
            boxShadow: '0 0 0 3px rgba(108, 92, 231, 0.13)',
          },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#6c5ce7',
            borderWidth: 2,
          },
          '&.Mui-error': {
            boxShadow: '0 0 0 3px rgba(211, 63, 73, 0.08)',
          },
          '&.Mui-disabled': {
            backgroundColor: '#eeeaf3',
          },
        },
        input: {
          color: '#2d2938',
          '&::placeholder': {
            color: '#8b8496',
            opacity: 1,
          },
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        root: {
          borderBottomColor: '#e3dfeb',
        },
        head: {
          color: '#2d2938',
          borderBottomColor: '#d4cede',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          border: '1px solid #d8d2e1',
          boxShadow: '0 20px 55px rgba(38, 31, 62, 0.22)',
        },
      },
    },
    MuiMenu: {
      styleOverrides: {
        paper: {
          border: '1px solid #ded9e7',
          boxShadow: '0 12px 32px rgba(38, 31, 62, 0.16)',
        },
      },
    },
    MuiDivider: {
      styleOverrides: {
        root: {
          borderColor: '#ded9e7',
        },
      },
    },
  },
})
