import { ReactNode, useEffect, useMemo, useState } from "react";
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
import { useLocation } from "@docusaurus/router";

type SaibThemeProviderProps = {
    children: ReactNode;
}

export default function SaibThemeProvider({ children }: SaibThemeProviderProps): ReactNode {
    const { colorMode } = useColorMode();
    const location = useLocation();
    const [mounted, setMounted] = useState(false);

    const isChrysalis = location.pathname.startsWith('/docs/chrysalis');
    const isArgus = location.pathname.startsWith('/docs/argus');
    const isRazor = location.pathname.startsWith('/docs/razor');
    const isComp = location.pathname.startsWith('/docs/comp');
    const isFutura = location.pathname.startsWith('/docs/futura');

    const darkTheme = useMemo(() =>
        createTheme({
            palette: {
                mode: colorMode,
                background: {
                    default: colorMode === 'dark' ? '#191919' : '#ffffff',
                    paper: colorMode === 'dark' ? '#24222D' : '#E9F5FF',
                },
                primary: {
                    main: '#5438DC',
                    light: '#C2B8FF',
                    contrastText: colorMode === 'dark' ? '#ffffff' : '#5438DC'
                },
                secondary: {
                    main: colorMode === 'dark' ? '#5438DC' : '#ffffff',
                    dark: '#5438DC',
                    light: '#7454FF',
                    contrastText: '#59EDE0'
                },
                text: {
                    primary: colorMode === 'dark' ? '#ffffff' : '#2C1A53',
                    secondary: colorMode === 'dark' ? '#C2B8FF' : '#5438DC',
                    disabled: colorMode === 'dark' ? '#FFFFFF99' : '#2C1A53'
                },
                grey: {
                    50: '#ffffff',
                    100: '#717171',
                    200: '#E9F5FF',
                    300: colorMode === 'dark' ? '#1C1C1C' : '#F7F9FB',
                    600: '#191919',
                    700: colorMode === 'dark' ? '#23212B' : '#E9F5FF',
                    800: '#1F2F4E',
                    900: '#1C3250',
                    A100: colorMode === 'dark' ? '#151515' : '#E9F5FF',
                },
                action: {
                    active: '#3A376A',
                    hover: '#988DE2',
                    hoverOpacity: 0.6,
                },
            },
            shape: {
                borderRadius: 12,
            },
        })
    , [colorMode]);

    useEffect(() => {
        const root = document.documentElement;

        if (isArgus) {
            root.setAttribute('data-theme-variant', 'argus');
        } else if (isChrysalis) {
            root.setAttribute('data-theme-variant', 'chrysalis');
        } else if (isRazor) {
            root.setAttribute('data-theme-variant', 'razor');
        } else if (isComp) {
            root.setAttribute('data-theme-variant', 'comp');
        } else if (isFutura) {
            root.setAttribute('data-theme-variant', 'futura');
        } else {
            root.setAttribute('data-theme-variant', 'home');
        }
    }, [isArgus, isChrysalis, isRazor, isComp, isFutura]);

    useEffect(() => {
      setMounted(true);
    }, []);

    if (!mounted) return null;

    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            {children}
        </ThemeProvider>
    );
}