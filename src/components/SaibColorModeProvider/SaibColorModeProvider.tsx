import { ReactNode } from "react";
import {
    ColorModeProvider,
} from '@docusaurus/theme-common/internal';
import SaibThemeProvider from "../SaibThemeProvider/SaibThemeProvider";

type SaibColorModeProviderProps = {
    children: ReactNode;
}

export default function SaibColorNodeProvider({ children }: SaibColorModeProviderProps): ReactNode {
    return (
        <ColorModeProvider>
            <SaibThemeProvider>
                {children}
            </SaibThemeProvider>
        </ColorModeProvider>
    )
}