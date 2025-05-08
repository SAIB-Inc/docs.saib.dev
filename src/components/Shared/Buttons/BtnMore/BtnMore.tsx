import { Button, useTheme } from "@mui/material";
import { ReactNode } from "react";
import RightArrow from "../../../../icons/RightArrow.svg";

export default function BtnMore(): ReactNode {

    const theme = useTheme();

    return (
        <Button sx={{ color: theme.palette.grey[50] }} variant="contained" endIcon={<RightArrow />}>Learn More</Button>
    );
}