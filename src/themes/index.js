import { createTheme } from '@mui/material/styles';

const themePalette = {
  primary: '#00838A',
  primaryLight: '#E0F2F2',
  secondary: '#EA4335',
  accent: '#00838A',
  backgroundLight: '#F8F9FA',
  backgroundDark: '#1F2023',
  surfaceLight: '#FFFFFF',
  surfaceDark: '#292A2D',
  textPrimaryLight: '#202124',
  textPrimaryDark: '#E8EAED',
  textSecondaryLight: '#5F6368',
  textSecondaryDark: '#969BA1',
  borderLight: '#DADCE0',
  borderDark: '#3C4043',
};
const baseTheme = createTheme({
  palette: {
    primary: {
      main: themePalette.primary,
      light: themePalette.primaryLight,
      dark: themePalette.primary,
    },
    secondary: {
      main: themePalette.secondary,
      light: themePalette.primaryLight,
      dark: themePalette.primary,
    },
    accent: {
      main: themePalette.accent,
    },
    background: {
      default: themePalette.backgroundLight,
      paper: themePalette.surfaceLight,
    },
    text: {
      primary: themePalette.textPrimaryLight,
      secondary: themePalette.textSecondaryLight,
    },
    success: {
      main: '#4caf50',
    },
    error: {
      main: themePalette.secondary,
    },
    border: {
      light: themePalette.borderLight,
      dark: themePalette.borderDark,
    },
    surface: {
      light: themePalette.surfaceLight,
      dark: themePalette.surfaceDark,
    },
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    h4: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 8,
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 500,
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 12px rgba(0,0,0,0.1)',
          border: '1px solid #e0e0e0',
        },
      },
    },
  },
});

baseTheme.mPalette = themePalette;
export const appTheme = baseTheme;
