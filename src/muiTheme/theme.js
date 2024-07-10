import { createTheme } from '@mui/material';
import { alpha, getContrastRatio } from '@mui/material/styles';

const lightBase = '#D0E2E9';
const lightMain = alpha(lightBase, 0.7);
const grayBase = '#7F7F7F';
const grayMain = alpha(grayBase, 0.7);
const lightGrayBase = '#C4C4C4';
const lightGrayMain = alpha(lightGrayBase, 0.7);

export const muiTheme = createTheme({
  palette: {
    primary: {
      main: '#4E9225',
    },
    secondary: {
      main: '#2156BB',
    },
    light: {
      main: lightBase,
      light: alpha(lightBase, 0.5),
      dark: alpha(lightBase, 0.9),
      contrastText: getContrastRatio(lightMain, '#fff') > 4.5 ? '#fff' : '#111',
    },
    gray: {
      main: grayBase,
      light: alpha(grayBase, 0.5),
      dark: alpha(grayBase, 0.9),
      contrastText: getContrastRatio(grayMain, '#fff') > 4.5 ? '#fff' : '#111',
    },
    lightGray: {
      main: lightGrayBase,
      light: alpha(lightGrayBase, 0.5),
      dark: alpha(lightGrayBase, 0.9),
      contrastText: getContrastRatio(lightGrayMain, '#fff') > 4.5 ? '#fff' : '#111',
    },
    black: {
      main: '#212628',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '6px',
          width: 'fit-content',
          padding: '16px 20px',
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: '20px',
          padding: '30px',
        },
      },
    },
  },
  typography: {
    fontFamily: 'Poppins',
    button: {
      textTransform: 'none',
      fontWeight: 500,
      fontSize: '14px',
      lineHeight: '16px',
    },
  },
  breakpoints: {
    values: {
      xs: 320,
      sm: 480,
      md: 768,
      lg: 1024,
      xl: 1200,
    },
  },
});
