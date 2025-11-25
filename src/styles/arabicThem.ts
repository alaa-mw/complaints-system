import { createTheme } from '@mui/material/styles';
import mainThem from './mainThem';

const theme = createTheme(mainThem,{
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          direction: 'rtl', // Ensure RTL is applied to the body
        },
      },
    },
     MuiTableCell: {
      styleOverrides: {
        root: {
          textAlign: 'right',
          '&.MuiTableCell-head': { // For header cells
            fontWeight: 'bold',
            color:"white",
            backgroundColor: mainThem.palette.primary.main // fix
          },
          '&.MuiTableCell-body': { // For body cells
            direction: 'rtl',
          },
        },
      },
    },
  MuiStepLabel: {
      styleOverrides: {
        root: {
          textAlign: 'right',
        },
      }
    },
  // إعدادات مخصصة لحقول النص
    // MuiTextField: {
    //   defaultProps: {
    //     dir: 'rtl',
    //   },
    // },
    // MuiInputBase: {
    //   styleOverrides: {
    //     input: {
    //       textAlign: 'right',
    //       '&::placeholder': {
    //         textAlign: 'right',
    //       },
    //     },
    //   },
    // },
    MuiInputLabel: {
      styleOverrides: {
        root: {
          right: 30,
          left: 'auto',
          transformOrigin: 'top right',
          '&.Mui-focused': {
            transformOrigin: 'top right',
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        input: {
          textAlign: 'right',
        },
        notchedOutline: {
          textAlign: 'right',
        },
      },
    },
    // MuiFormControl: {
    //   styleOverrides: {
    //     root: {
    //       textAlign: 'right',
    //     },
    //   },
    // },
    //--------
     MuiDrawer: {
      styleOverrides: {
        paper: {
          // Force RTL positioning
          right: 0,
          left: 'auto !important',
          // For permanent drawers
          borderRight: 'none',
          borderLeft: '1px solid rgba(0, 0, 0, 0.12)'
        },
        paperAnchorDockedRight: {
          borderLeft: '1px solid rgba(0, 0, 0, 0.12)',
          borderRight: 'none'
        }
      }
    },
  
   MuiListItemText: {
      styleOverrides: {
        root: {
          textAlign: 'right', // محاذاة افتراضية لليمين
          '& .MuiTypography-root': {
            textAlign: 'inherit', // يرث المحاذاة من العنصر الأب
          }
        },
      }
    },
  },
   MuiDatePicker: {
      styleOverrides: {
        root: {
          color: '#bbdefb',
          borderRadius: '11px',
          borderWidth: '0px',
          borderColor: '#2196f3',
          border: '0px solid',
          backgroundColor: '#0d47a1',
        }
      }
    },
     
});

export default theme;