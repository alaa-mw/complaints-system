import { createTheme } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Palette {
    gradient: {
      primary: string;
      secondary: string;
      tertiary: string;
    };
    tertiary: Palette['primary']; // Add tertiary to main palette
    snackbar: { 
      success: string;
      error: string;
      warning: string;
      info: string;
    };
  }
  interface PaletteOptions {
    gradient?: {
      primary?: string;
      secondary?: string;
      tertiary?: string;
    };
    tertiary: Palette['primary']; // Add tertiary to main palette
    snackbar?: { 
      success: string;
      error: string;
      warning: string;
      info: string;
    };
  }
  interface BreakpointOverrides {
    xs: true;
    s: true;  // Add custom breakpoint
    sm: true;
    md: true;
    lg: true;
    xl: true;
  }
}

const theme = createTheme({
  direction: 'rtl',
   components: {
    MuiCssBaseline: {
      styleOverrides: {
        '#root': {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
        },
      },
    },
  },
  palette: {
    primary: {
      main: '#17284B',    // Dark blue
      light: '#2A4B7C',   // Lighter blue
      dark: '#0F1A33',    // Darker blue
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#A38097',    // Purple/mauve
      light: '#c97cb6ff',   // Light purple
      dark: '#7A5E73',    // Dark purple
      contrastText: '#ffffff',
    },
    tertiary: {           // New color group
      main: '#76C0CF',    // Light blue
      light:'#e0f5fa',   // Lighter blue
      dark: '#4A8B9D',    // Darker light blue
      contrastText: '#1e2524',
    },
    gradient: {
      primary: 'linear-gradient(135deg, #17284B 0%,#213d83 100%)',
      secondary: 'linear-gradient(135deg, #A38097 0%,#604a5b 100%)',
      tertiary: 'linear-gradient(135deg, rgb(213, 229, 231) 0%,#e0f5fa 100%)',
    },
    background: {
       default:'#f0f0f0',
      // default: '#f8f9f9',
      paper: '#ffffff',
    },
    text: {
      primary: '#1e2524',
      secondary: '#5a6369',
    },
    snackbar: {  // Define your snackbar colors
      success:'#76bb7d', // Green
      error:'#ff9695',   // Red
      warning: '#ff9800', // Orange
      info:'#21bff3'     // Blue
    },
    success: {
      main: '#74d17dff', // Default green
       contrastText: '#fff',
    }
  },
  typography: {
    fontFamily: "'Cairo', sans-serif",
  },
  breakpoints: {
    values: {
      xs: 0,
      s: 500, //how add new
      sm: 800,
      md: 900,
      lg: 1200,
      xl: 1536
    }
  },
});

export default theme;

