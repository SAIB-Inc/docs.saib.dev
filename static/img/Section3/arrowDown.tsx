import { SvgIcon, SvgIconProps, useTheme } from "@mui/material";

const ArrowDown = (props: SvgIconProps) => {
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
            <svg width="20" height="102" viewBox="0 0 20 102" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.05698 100.943C9.57779 101.464 10.4222 101.464 10.943 100.943L19.4301 92.4559C19.951 91.9351 19.951 91.0907 19.4301 90.5698C18.9093 90.049 18.0649 90.049 17.5441 90.5698L10 98.114L2.45588 90.5698C1.93507 90.049 1.09066 90.049 0.569849 90.5698C0.0490359 91.0907 0.0490359 91.9351 0.569848 92.4559L9.05698 100.943ZM10 0L8.66638 -5.82946e-08L8.66637 100L10 100L11.3336 100L11.3336 5.82946e-08L10 0Z" fill="currentColor"/>
            </svg>
        </SvgIcon>
    );
};
    
export default ArrowDown;