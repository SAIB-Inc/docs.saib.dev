import { Button, ButtonProps, useTheme } from "@mui/material";
import { ReactNode } from "react";
import RightArrow from "../../../../icons/RightArrow.svg";
import { useColorMode } from "@docusaurus/theme-common";

export default function BtnMore({ children = "Learn More", ...props }: ButtonProps): ReactNode {

    const theme = useTheme();
    const { colorMode } = useColorMode();

    return (
        <Button sx={{ color: theme.palette.grey[50] }} variant="contained" endIcon={<RightArrow />} {...props}>
            {children}
        </Button>
    );
}