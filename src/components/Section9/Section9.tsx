import { ReactNode, useRef } from "react";
import BtnMore from "../Shared/Buttons/BtnMore/BtnMore";
import RightArrow from "../../../static/img/Section9/right_arrow.svg";
import { alpha, Button, IconButton, Paper, Tooltip, useTheme } from "@mui/material";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import FuturaCodeBlock from "./FuturaCodeBlock";
import Futura from "@site/static/img/Section9/futura";
import Code from "../../../static/img/Section9/code.svg";
import Cardano from "@site/static/img/Section9/cardano";

export default function Section9(): ReactNode {
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
        <section className="w-screen md:py-20">
            <div className="container !mx-auto">
                <div className="md:w-full md:mb-5 lg:mb-0">
                    <Paper
                        className="md:h-[510px] lg:h-[619.7px]"
                        sx={{
                            backgroundImage: "url('/img/Section9/background_big.svg')",
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                            backgroundColor: '#FFF8E0',
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
                            <Futura className="absolute  md:!text-[200px] md:top-[270px] md:right-[56px] lg:!text-[225px] lg:top-[170.16px] lg:right-[10px] xl:text-[300px] xl:top-[100px] xl:right-[30px] 2xl:!text-[321px] 2xl:top-[100px] 2xl:right-[30px]" />
                        </div>
                        <div className="w-full absolute top-8 left-8">
                            <h1 className="md:!mb-[-12px] lg:!mb-10 xl:!mb-5 lg:!text-[40px] lg:leading-[41.6px]">
                                <span style={{ color: theme.palette.primary.main }}>Futura</span>
                                <span style={{ color: theme.palette.grey.A200 }} className="capitalize">- a domain-specific <br />language built on F#</span>
                            </h1>
                            <Code style={{ width: '650px' }} className="hidden md:block lg:hidden" />
                            <Code style={{ width: '740px' }} className="hidden lg:block 2xl:hidden" />
                            <Code style={{ width: '900px' }} className="hidden 2xl:block" />
                        </div>
                        <div>
                            <div style={{ borderColor: theme.palette.background.default }} className="absolute border-r-8 border-b-8 w-14 aspect-square rounded-br-3xl md:hidden lg:block lg:scale-80 lg:right-[333px] lg:bottom-[-14px] lg:gap-5 xl:bottom-[-9px] xl:scale-100 xl:right-[387px] 2xl:right-[483px]"></div>
                            <div style={{ borderColor: theme.palette.background.default, transform: 'rotate(270deg)' }} className="absolute scale-90 top-[-10px] right-[161.58px] border-r-8 border-b-8 w-14 aspect-square rounded-br-3xl lg:"></div>
                            <div style={{ borderColor: theme.palette.background.default, transform: 'rotate(270deg)' }} className="absolute top-[46px] right-[-8px] border-r-8 border-b-8 w-14 aspect-square rounded-br-3xl lg:border-r-7 lg:border-b-7 lg:w-13"></div>
                        </div>
                    </Paper>
                </div>

                <div className="relative flex flex-col-reverse md:flex-col lg:flex-row lg:gap-5">
                    <div style={{ backgroundColor: theme.palette.background.default }} className="md:w-full lg:hidden">
                        <Paper
                            className="p-8"
                            sx={{
                                backgroundImage: "url('/img/Section9/background_medium.svg')",
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                backgroundRepeat: 'no-repeat',
                                backgroundColor: '#5F28A3',
                                borderRadius: '24px',
                            }}
                        >
                            <div className="flex justify-between">
                                <div className="flex flex-col justify-end">
                                    <h1 className="!pb-0 text-2xl sm:text-[32px]">Cardano Smart Contracts</h1>
                                    <Button style={{ color: theme.palette.grey[50], borderColor: theme.palette.grey[50] }} variant="outlined" endIcon={<RightArrow />}
                                        sx={{
                                            borderRadius: '60px',
                                            width: 'max-content',
                                        }}
                                    >
                                        Get Started
                                    </Button>
                                </div>
                                <div>
                                    <Cardano className="!text-[93px] md:!text-[174px]"/>
                                </div>
                            </div>
                        </Paper>
                    </div>

                    <div className="flex flex-col justify-between md:flex-row md:gap-4 pt-5 lg:w-[calc(100%-350px)] lg:gap-5 xl:w-[calc(100%-400px)] 2xl:w-[calc(100%-496px)] ">
                        <Paper
                            className="flex-1 justify-between p-6 md:p-8"
                            sx={{
                                backgroundImage: "url('/img/Section9/background_small.svg')",
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                backgroundRepeat: 'no-repeat',
                                backgroundColor: '#5F28A3',
                                borderRadius: '24px',
                            }}
                        >
                            <h1 className="font-semibold leading-12 text-2xl mb-8 md:mb-10 lg:mb-22 lg:!text-3xl xl:text-13">Interoperability</h1>
                            <p>
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
                                backgroundColor: '#5F28A3',
                                borderRadius: '24px',
                            }}
                        >
                            <h1 className="font-semibold leading-12 text-2xl mb-8 md:mb-10 lg:mb-22 lg:!text-3xl xl:text-13">Compile to UPLC</h1>
                            <p>
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
                                backgroundColor: '#5F28A3',
                                borderRadius: '24px',
                            }}
                        >
                            <div>
                                <div className="mb-[179px]">
                                    <h1 className="!pb-0 font-semibold lg:!text-4xl xl:!text-[40px]">Cardano Smart <br /> Contracts</h1>
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

                                    <Cardano className="absolute mb-4 lg:top-[-170px] lg:right-[4px] lg:!text-[140px] xl:hidden" />
                                    <Cardano className="hidden absolute mb-4 xl:block xl:top-[-170px] xl:right-[-18px] 2xl:right-[4px]" />
                                </div>
                            </div>
                        </Paper>
                    </div>
                </div>

            </div>
        </section>
    )
}; 