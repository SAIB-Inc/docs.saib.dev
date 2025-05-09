import { SvgIcon, SvgIconProps, useTheme } from "@mui/material";

const ArrowDownIcon = (props: SvgIconProps) => {
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
            <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clip-path="url(#clip0_1482_1002)">
                <path d="M19.2008 24L24.0008 28.8L28.8008 24" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
                <path d="M24 19.2002L24 28.8002" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"/>
                </g>
                <rect x="43.5" y="4.5" width="39" height="39" rx="19.5" transform="rotate(90 43.5 4.5)" stroke="currentColor"/>
                <defs>
                <clipPath id="clip0_1482_1002">
                <rect x="44" y="4" width="40" height="40" rx="20" transform="rotate(90 44 4)" fill="currentColor"/>
                </clipPath>
                </defs>
            </svg>
        </SvgIcon>
    );
};
    
export default ArrowDownIcon;