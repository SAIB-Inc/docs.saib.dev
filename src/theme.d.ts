import { Theme, ThemeOptions } from '@mui/material/styles';

declare module '@mui/material/styles' {
  interface Theme {
    futura?: {
      colors: {
        primary: string;
        secondary: string;
      };
    };
  }
  
  interface ThemeOptions {
    futura?: {
      colors: {
        primary: string;
        secondary: string;
      };
    };
  }
}