import { Button } from "@mui/material";
import { ReactNode } from "react";
import RightArrow from "../../../../icons/RightArrow.svg";

export default function BtnMore(): ReactNode {
    return (
        <Button variant="contained" endIcon={<RightArrow />}>Learn More</Button>
    );
}