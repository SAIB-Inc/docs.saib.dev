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
                    default: colorMode === 'dark' ? '#191919' : '#191919',
                    paper: colorMode === 'dark' ? '#191919' : '#191919',
                },
                // button background
                primary: {
                    main: colorMode === 'dark' ? '#5438DC' : '#5438DC',
                },
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