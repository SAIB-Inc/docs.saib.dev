import { SvgIcon, SvgIconProps, useTheme } from "@mui/material";

const UpperRightArrowIcon = (props: SvgIconProps) => {
    const { sx = {}, ...otherProps } = props;
    const theme = useTheme();

    return (
        <SvgIcon
            {...otherProps}
            sx={{
                color: theme.palette.secondary.main,
                ...sx
            }}
        >
            <svg width="16" height="17" viewBox="0 0 16 17" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path opacity="0.6" d="M14.6544 1.53516H9.60446M14.6544 1.53516C14.6544 2.8111 14.6544 5.50991 14.6544 6.58511M14.6544 1.53516L5.33142 10.8582M5.33142 1.53516H0.669922V15.5197H14.6544C14.6544 12.789 14.6544 12.989 14.6544 10.8582" stroke="currentColor" strokeWidth="1.27132" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
        </SvgIcon>
    );
};

export default UpperRightArrowIcon;
