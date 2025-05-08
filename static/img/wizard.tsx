import { SvgIcon, SvgIconProps, useTheme } from "@mui/material";

const Wizard = (props: SvgIconProps) => {
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
            <svg width="80" height="141" viewBox="0 0 80 141" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_896_8484)">
            <path d="M6.39218 127.599C6.39218 127.599 11.4846 59.5596 27.4552 53.4709C41.8878 47.9705 48.7818 59.241 50.2612 65.0208C54.1916 80.4044 73.8223 123.344 73.8223 123.344L42.3516 127.599C42.3907 128.354 42.4248 129.192 42.4297 130.065C42.4493 134.1 47.9128 132.045 47.7223 134.81C47.1413 143.139 35.5845 136.492 34.7838 133.551C34.2858 131.732 34.0514 129.423 33.9342 127.599H27.3038C27.5431 131.05 27.7921 140.002 23.9496 140.085C19.9606 140.169 18.0271 130.678 17.5047 127.599H6.39218Z" fill="currentColor"/>
            <path d="M35.7276 49.6842C27.5086 49.6842 20.8458 42.9943 20.8458 34.7419C20.8458 26.4895 27.5086 19.7996 35.7276 19.7996C43.9466 19.7996 50.6094 26.4895 50.6094 34.7419C50.6094 42.9943 43.9466 49.6842 35.7276 49.6842Z" fill="currentColor"/>
            <path d="M44.3229 18.2553C39.499 16.0297 34.4506 16.265 34.4506 16.265L53.7852 -0.255859L51.715 25.148C51.715 25.148 48.5511 20.2016 44.3229 18.2553Z" fill="currentColor"/>
            </g>
            <path d="M0.134766 43.0971L3.32414 39.6904L6.39069 43.0971L3.32414 46.9838L0.134766 43.0971Z" fill="currentColor"/>
            <path d="M61.752 21.2614L64.9413 17.8547L68.0079 21.2614L64.9413 25.1481L61.752 21.2614Z" fill="currentColor"/>
            <path d="M64.8789 68.887L66.9427 66.6826L68.927 68.887L66.9427 71.402L64.8789 68.887Z" fill="currentColor"/>
            <defs>
            <clipPath id="clip0_896_8484">
            <rect width="73.4755" height="139.511" fill="white" transform="matrix(-1 0 0 1 79.8672 0.574219)"/>
            </clipPath>
            </defs>
            </svg>
        </SvgIcon>
    );
};

export default Wizard;