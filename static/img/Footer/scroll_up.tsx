import { SvgIcon, SvgIconProps, useTheme } from "@mui/material";

const ScrollUpIcon = (props: SvgIconProps) => {
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
            <svg width="113" height="113" viewBox="0 0 113 113" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="1.13566" y="0.938393" width="110.605" height="110.605" rx="55.3023" stroke="currentColor" strokeWidth="1.27132"/>
            <path d="M56.4375 35.8994L56.4375 76.5816M56.4375 35.8994L41.1816 51.1552M56.4375 35.8994L71.6933 51.1552" stroke="currentColor" strokeWidth="2.54264"/>
            </svg>
        </SvgIcon>
    );
};

export default ScrollUpIcon;

