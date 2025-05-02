import { ReactNode, useMemo } from "react";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import {
    useColorMode,
} from '@docusaurus/theme-common/internal';
import '@fontsource/poppins/300.css';
import '@fontsource/poppins/400.css';
import '@fontsource/poppins/500.css';
import '@fontsource/poppins/700.css';
import '@fontsource/space-mono/400.css';
import '@fontsource/space-mono/700.css';

type SaibThemeProviderProps = {
    children: ReactNode;
}

export default function SaibThemeProvider({ children }: SaibThemeProviderProps): ReactNode {
    const { colorMode } = useColorMode();

    const darkTheme = useMemo(() =>
        createTheme({
            palette: {
                mode: colorMode,
                // Background
                background: {
                    default: colorMode === 'dark' ? '#191919' : '#ffffff',
                    paper: colorMode === 'dark' ? '#24222D' : '#E9F5FF',
                },
                // button background
                primary: {
                    main: '#5438DC',
                    light: '#C2B8FF',
                    contrastText: colorMode === 'dark' ? '#ffffff' : '#5438DC'
                },
                text: {
                    primary: colorMode === 'dark' ? '#ffffff' : '#2C1A53',
                    secondary: colorMode === 'dark' ? '#C2B8FF' : '#5438DC',
                    disabled: colorMode === 'dark' ? '#FFFFFF99' : '#2C1A53'
                },
                grey: {
                    50: '#ffffff',
                    600: '#191919',
                    900: colorMode === 'dark' ? '#191919' : '#E9F5FF'
                }
            },
            shape: {
                borderRadius: 12,
            }
        })
    , [colorMode]);

    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            {children}
        </ThemeProvider>
    );
}