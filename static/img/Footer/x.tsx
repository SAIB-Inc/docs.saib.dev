import { SvgIcon, SvgIconProps, useTheme } from "@mui/material";

const XIcon = (props: SvgIconProps) => {
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
            <svg width="52" height="52" viewBox="0 0 52 52" fill="none" xmlns="http://www.w3.org/2000/svg">
            <rect x="1.18253" y="0.961831" width="49.5814" height="49.5814" rx="24.7907" stroke="currentColor" stroke-width="1.27132"/>
            <path d="M22.4301 15.7529L27.1072 22.9841L33.0392 16.0221L34.9019 15.7566L28.1022 24.2931L35.4683 35.7261H29.9415L24.8287 28.2018C24.4953 28.1207 24.325 28.4471 24.1188 28.6241C22.5305 30.0013 19.8074 34.6015 18.3338 35.4514C17.7798 35.7722 17.3747 35.7851 16.7616 35.7243L23.8499 26.902L16.4766 15.7548H22.4283L22.4301 15.7529ZM33.1988 34.5646L21.7327 17.4768C21.0139 16.5476 19.7662 16.9919 18.7425 16.9145L30.508 34.2751L33.197 34.5646H33.1988Z" fill="currentColor"/>
            </svg>
        </SvgIcon>
    );
};

export default XIcon;

