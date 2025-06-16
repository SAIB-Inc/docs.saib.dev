import { ReactNode, useRef } from "react";
import BtnMore from "../Shared/Buttons/BtnMore/BtnMore";
import RightArrow from "../../../static/img/Futura/right_arrow.svg";
import { alpha, Button, IconButton, Paper, Tooltip, useTheme } from "@mui/material";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import FuturaCodeBlock from "./FuturaCodeBlock";
import FuturaLogo from "@site/static/img/Futura/futura";
import Cardano from "@site/static/img/Futura/cardano";

export default function Futura(): ReactNode {
    const theme = useTheme();
    const editorRef = useRef(null);

    const copyToClipboard = () => {
        const editor = editorRef.current;
        if (editor) {
            const value = editor.getValue();
            navigator.clipboard.writeText(value)
                .then(() => console.log('Copied!'))
                .catch((err) => console.error('Copy failed', err));
        }
    };
    return (
        <section className="w-screen py-20">
            <div className="container !pt-20 !mx-auto md:p-0 ">
                <div className="w-full md:mb-5 lg:mb-0">
                    <Paper
                        className="h-[600px] md:h-[510px] lg:h-[619.7px]"
                        sx={{
                            backgroundImage: "url('/img/Section9/background_big.svg')",
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                            backgroundColor: theme.futura?.colors.primary,
                            position: 'relative',
                            width: '100%',
                            borderRadius: '24px',
                        }}
                    >
                        <div style={{ backgroundColor: theme.palette.background.default }} className="hidden !absolute !right-[-4px] !top-[-4px] pl-4 pb-4 pr-1 pt-1 !rounded-bl-xl md:!rounded-bl-3xl z-1 md:block">
                            <BtnMore
                                LinkComponent='a' href="/docs/futura/overview"
                                sx={{
                                    color: theme.palette.grey[50],
                                    '&:hover': {
                                        backgroundColor: theme.palette.action.hover,
                                        color: theme.palette.grey[50]
                                    },
                                    '&:active': {
                                        backgroundColor: theme.palette.action.active,
                                        color: theme.palette.grey[50]
                                    },
                                }}
                            />
                        </div>
                        <div>
                            <FuturaLogo className="absolute top-60 right-20 sm:!hidden lg:!block lg:!text-[310px] lg:top-[126px] lg:right-5 xl:top-20 xl:right-10 2xl:top-[100px] 2xl:right-[87px]" />
                        </div>
                        <div className="w-full h-full p-6 flex flex-col">
                            <h1 className="text-2xl !pb-0 sm:text-[32px] lg:!mb-5 lg:!text-[40px] lg:leading-[41.6px] ">
                                <span style={{ color: theme.palette.primary.main }}>Futura</span>
                                <span style={{ color: theme.palette.grey.A200 }} className="capitalize">- a domain-specific <br className="hidden md:block"/>language built on F#</span>
                            </h1>
                            {/* Code */}
                            <div 
                            style={{
                                backgroundColor: theme.palette.grey[300]
                            }}
                            className="w-full !h-full p-4 rounded-3xl relative md:!h-94 lg:!w-[63%] lg:!h-117 xl:!w-[68%] xl:!h-118 2xl:!w-[61%] 2xl:!h-125 [&_.monaco-scrollable-element_.vertical]:!w-[6px] [&_.monaco-scrollable-element_.decorationsOverviewRuler]:!w-[6px] [&_.monaco-scrollable-element_.horizontal]:!h-[6px]"
                        >
                            <div 
                                style={{backgroundColor: alpha(theme.palette.grey[300], 0.8)}}
                                className="absolute bottom-2 right-2 z-40 rounded-full"
                            >
                            <Tooltip
                                title="Copy code"
                                componentsProps={{
                                    tooltip: {
                                    sx: {
                                        backgroundColor: theme.palette.background.paper,
                                        color: theme.palette.text.primary,
                                    },
                                    },
                                }}
                                >
                                    <IconButton
                                        className="self-end"
                                        onClick={copyToClipboard}
                                        sx={{
                                            width: '17px',
                                            height: '17px',
                                            margin: '6px 8px',
                                            opacity: 0.6, 
                                            '&:hover': {
                                                opacity: 1,
                                                backgroundColor: "transparent"
                                            },
                                        }}
                                    >
                                        <ContentCopyIcon 
                                            sx={{ 
                                                color: theme.palette.primary.contrastText,
                                                width: '18px',
                                                height: '18px',
                                            }} />
                                    </IconButton>
                                </Tooltip>
                            </div>
                            <FuturaCodeBlock
                                editorRef={editorRef}
                            />
                        </div>
                        </div>
                        <div>
                            <div style={{ borderColor: theme.palette.background.default }} className="absolute border-r-8 border-b-8 w-14 aspect-square rounded-br-3xl hidden lg:block lg:scale-80 lg:right-[333px] lg:bottom-[-14px] lg:gap-5 xl:bottom-[-9px] xl:scale-100 xl:right-[387px] 2xl:right-[483px]"></div>
                            <div style={{ borderColor: theme.palette.background.default, transform: 'rotate(270deg)' }} className="hidden absolute scale-90 top-[-10px] right-[161.58px] border-r-8 border-b-8 w-14 aspect-square rounded-br-3xl md:block"></div>
                            <div style={{ borderColor: theme.palette.background.default, transform: 'rotate(270deg)' }} className="hidden absolute top-[46px] right-[-8px] border-r-8 border-b-8 w-14 aspect-square rounded-br-3xl md:block lg:border-r-7 lg:border-b-7 lg:w-13"></div>
                        </div>
                    </Paper>
                </div>
                <div className="flex justify-center p-6 md:hidden">
                            <BtnMore
                                LinkComponent='a' href="/docs/futura/overview"
                                sx={{
                                    color: theme.palette.grey[50],
                                    '&:hover': {
                                        backgroundColor: theme.palette.action.hover,
                                        color: theme.palette.grey[50]
                                    },
                                    '&:active': {
                                        backgroundColor: theme.palette.action.active,
                                        color: theme.palette.grey[50]
                                    },
                                }}
                            />
                        </div>
                <div className="relative flex flex-col-reverse gap-5 md:flex-col lg:flex-row lg:gap-5">
                    <div style={{ backgroundColor: theme.palette.background.default }} className="md:w-full lg:hidden">
                        <Paper
                            className="p-6"
                            sx={{
                                backgroundImage: "url('/img/Section9/background_medium.svg')",
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                backgroundRepeat: 'no-repeat',
                                backgroundColor: theme.futura?.colors.secondary,
                                borderRadius: '24px',
                            }}
                        >
                            <div className="flex justify-between">
                                <div className="flex flex-col justify-end gap-18">
                                    <h1 className="!pb-0 text-2xl sm:!text-[32px]">Cardano Smart Contracts</h1>
                                    <Button style={{ color: theme.palette.grey[50], borderColor: theme.palette.grey[50] }} variant="outlined" endIcon={<RightArrow />}
                                        sx={{
                                            borderRadius: '60px',
                                            width: 'max-content',
                                        }}
                                    >
                                        Get Started
                                    </Button>
                                </div>
                                <div className="flex items-end">
                                    <Cardano className="!text-[93px] md:!text-[174px]"/>
                                </div>
                            </div>
                        </Paper>
                    </div>

                    <div className="flex flex-col justify-between gap-5 md:flex-row lg:pt-5 lg:w-[calc(100%-350px)] xl:w-[calc(100%-400px)] 2xl:w-[calc(100%-496px)]">
                        <Paper
                            className="flex-1 justify-between p-6 md:p-8"
                            sx={{
                                backgroundImage: "url('/img/Section9/background_small.svg')",
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                backgroundRepeat: 'no-repeat',
                                backgroundColor: theme.futura?.colors.secondary,
                                borderRadius: '24px',
                            }}
                        >
                            <h1 style={{color:theme.futura?.colors.primary}} className="font-semibold leading-12 text-2xl !mb-8 md:mb-10 lg:mb-22 lg:!text-3xl xl:!text-13">Interoperability</h1>
                            <p style={{color:theme.palette.grey[50]}}>
                                Futura integrates seamlessly with
                                other .NET languages, enabling smooth
                                interoperability with C# projects such as
                                <b> Razor</b>, <b>Argus</b>, and <b>Chrysalis</b>.
                            </p>
                        </Paper>
                        <Paper
                            className="flex-1 justify-between p-6 md:p-8 md:pr-8"
                            sx={{
                                backgroundImage: "url('/img/Section9/background_small.svg')",
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                backgroundRepeat: 'no-repeat',
                                backgroundColor: theme.futura?.colors.secondary,
                                borderRadius: '24px',
                            }}
                        >
                            <h1 style={{color:theme.futura?.colors.primary}} className="font-semibold leading-12 text-2xl !mb-8 md:mb-10 lg:mb-22 lg:!text-3xl xl:!text-13">Compile to UPLC</h1>
                            <p style={{color:theme.palette.grey[50]}}>
                                Futura compiles F# code to UPLC,
                                unlocking the potential for <b>Cardano</b>
                                <b> smart contract</b> development within
                                the .NET ecosystem.
                            </p>
                        </Paper>
                    </div>

                    <div style={{ backgroundColor: theme.palette.background.default }} className="hidden absolute right-[-4px] bottom-0 pl-5 pt-5 pr-1 rounded-tl-3xl lg:block lg:!w-[350px] xl:!w-[400px] 2xl:!w-[496px]">
                        <div style={{ borderColor: theme.palette.background.default }} className="absolute top-[-48px] right-[-4px] border-r-8 border-b-8 w-14 aspect-square rounded-br-3xl lg:"></div>
                        <Paper
                            className="md:p-10"
                            sx={{
                                backgroundImage: "url('/img/Section9/background_medium.svg')",
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                backgroundRepeat: 'no-repeat',
                                backgroundColor: theme.futura?.colors.secondary,
                                borderRadius: '24px',
                            }}
                        >
                            <div>
                                <div className="mb-[179px]">
                                    <h1 style={{color:theme.futura?.colors.primary}} className="!pb-0 font-semibold !text-4xl xl:!text-[40px]">Cardano Smart <br /> Contracts</h1>
                                </div>

                                <div className="w-full relative md:gap-12">
                                    <Button style={{ color: theme.palette.grey[50], borderColor: theme.palette.grey[50] }} variant="outlined" endIcon={<RightArrow />}
                                        sx={{
                                            borderRadius: '60px',
                                            width: 'max-content',
                                            alignSelf: 'self-end',
                                            fontSize: '16px',
                                        }}
                                    >
                                        Get Started
                                    </Button>
                                    <Cardano className="absolute mb-4 lg:top-[-170px] lg:right-[4px] lg:!text-[140px] xl:top-[-170px] xl:right-[-18px] 2xl:right-[4px]" />
                                </div>
                            </div>
                        </Paper>
                    </div>
                </div>

            </div>
        </section>
    )
}; 