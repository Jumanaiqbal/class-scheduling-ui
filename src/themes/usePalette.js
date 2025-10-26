import { useTheme } from '@mui/material/styles';

export const usePalette = () => {
  const theme = useTheme();
  // Return the custom palette from theme
  return theme.mPalette || theme.palette;
};
