import { ReactNode, useMemo } from "react";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import {
    useColorMode,
} from '@docusaurus/theme-common/internal';

type SaibThemeProviderProps = {
    children: ReactNode;
}



export default function SaibThemeProvider({ children }: SaibThemeProviderProps): ReactNode {
    const { colorMode } = useColorMode();

    const darkTheme = useMemo(() =>
        createTheme({
            palette: {
                mode: colorMode,
            },
        })
    , [colorMode]);

    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
            {children}
        </ThemeProvider>
    );
}