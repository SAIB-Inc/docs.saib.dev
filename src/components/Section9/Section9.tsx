import { ReactNode, useRef } from "react";
import BtnMore from "../Shared/Buttons/BtnMore/BtnMore";
import Cardano from "../../../static/img/Section9/cardano.svg";
import RightArrow from "../../../static/img/Section9/right_arrow.svg";
import Code from "../../../static/img/Section9/code.svg";
import { alpha, Button, IconButton, Paper, Tooltip, useTheme } from "@mui/material";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import FuturaCodeBlock from "./FuturaCodeBlock";
import Futura from "@site/static/img/Section9/futura";

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
            <div className="container">
                <div className="md:w-full">
                    <Paper
                        sx={{
                            backgroundImage: "url('/img/Section9/background_big.svg')",
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                            backgroundColor: '#FFF8E0',
                            position: 'relative',
                            height: '619.7px',
                            width: '100%',
                            borderRadius: '24px',
                        }}
                    >
                        <div style={{ backgroundColor: theme.palette.background.default }} className="!absolute !right-0 pl-4 pb-4 !rounded-bl-xl md:!rounded-bl-3xl z-1">
                            <BtnMore />
                        </div>
                        <div>
                            <Futura className="absolute !text-[250px] lg:top-[148.16px] lg:right-[10px] 2xl:!hidden" />
                            <Futura className="!hidden !text-[321px] absolute 2xl:top-[148.16px] 2xl:right-[87px] 2xl:!block" />
                        </div>
                        <div className="w-full absolute top-8 left-8">
                            <h1 className="!mb-10 lg:!text-[40px] lg:leading-[41.6px]">
                                <span style={{ color: theme.palette.primary.main }}>Futura</span>
                                <span style={{ color: theme.palette.grey.A200 }} className="capitalize">- a domain-specific <br />language built on F#</span>
                            </h1>
                            <Code style={{ width: '740px' }} />
                        </div>
                        <div>
                            <div style={{borderColor: theme.palette.background.default}} className="w-[167px] h-[455px] !border-r-solid !border-r-[20px] rounded-3xl"></div>
                        </div>
                    </Paper>
                </div>

                <div className="relative lg:gap-5">
                    <div className="flex justify-between md:gap-4 pt-5 lg:w-[calc(100%-350px)] lg:gap-5 xl:w-[calc(100%-400px)] 2xl:w-[calc(100%-496px)] ">
                        <Paper
                            className="flex-1 md:p-8"
                            sx={{
                                backgroundImage: "url('/img/Section9/background_small.svg')",
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                backgroundRepeat: 'no-repeat',
                                backgroundColor: '#5F28A3',
                                borderRadius: '24px',
                            }}
                        >
                            <h1 className="font-semibold leading-12 !mb-22 lg:!text-3xl xl:text-13">Interoperability</h1>
                            <p>
                                Futura integrates seamlessly with
                                other .NET languages, enabling smooth
                                interoperability with C# projects such as
                                <b> Razor</b>, <b>Argus</b>, and <b>Chrysalis</b>.
                            </p>
                        </Paper>
                        <Paper
                            className="flex-1 md:p-8 md:pr-8"
                            sx={{
                                backgroundImage: "url('/img/Section9/background_small.svg')",
                                backgroundSize: 'cover',
                                backgroundPosition: 'center',
                                backgroundRepeat: 'no-repeat',
                                backgroundColor: '#5F28A3',
                                borderRadius: '24px',
                            }}
                        >
                            <h1 className="font-semibold leading-12 !mb-22 lg:!text-3xl xl:text-13">Compile to UPLC</h1>
                            <p>
                                Futura compiles F# code to UPLC,
                                unlocking the potential for <b>Cardano</b>
                                <b> smart contract</b> development within
                                the .NET ecosystem.
                            </p>
                        </Paper>
                    </div>

                    <div style={{ backgroundColor: theme.palette.background.default }} className="hidden absolute right-0 bottom-0 pl-5 pt-5 rounded-tl-3xl lg:block lg:!w-[350px] xl:!w-[400px] 2xl:!w-[496px]">
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