import { createTheme } from '@mui/material/styles';

/**
 * Stockotron MUI Theme
 * Dark professional finance theme with blue/teal accents.
 * Positive values use success.main (green), negative use error.main (red).
 */
const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#3d8ef8',
      light: '#6aabff',
      dark: '#1a6de0',
    },
    secondary: {
      main: '#00c9a7',
    },
    success: {
      main: '#26c97a',
    },
    error: {
      main: '#ff5252',
    },
    warning: {
      main: '#ffc107',
    },
    background: {
      default: '#0d1117',
      paper: '#161b27',
    },
    divider: 'rgba(255,255,255,0.08)',
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: { fontWeight: 700 },
    h5: { fontWeight: 700 },
    h6: { fontWeight: 600 },
    subtitle1: { fontWeight: 500 },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          border: '1px solid rgba(255,255,255,0.06)',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          borderRadius: 8,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: { fontWeight: 600 },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 10,
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          backgroundColor: '#0d1117',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
        },
      },
    },
  },
});

export default theme;
