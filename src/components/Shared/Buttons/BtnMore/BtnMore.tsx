import { Button, ButtonProps } from "@mui/material";
import { ReactNode } from "react";
import RightArrow from "../../../../icons/RightArrow.svg";

export default function BtnMore({children = "Learn More", ...props}: ButtonProps): ReactNode {
    return (
        <Button variant="contained" endIcon={<RightArrow />} {...props}>
            {children}
        </Button>
    );
}