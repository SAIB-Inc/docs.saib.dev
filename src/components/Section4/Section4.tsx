import { Button, useTheme } from "@mui/material";
import { ReactNode } from "react";
import BtnMore from "../Shared/Buttons/BtnMore/BtnMore";
import RightArrow from "../../icons/RightArrow.svg";
import { useColorMode } from "@docusaurus/theme-common";

export default function Section4(): ReactNode {
    const { colorMode } = useColorMode();
    const theme = useTheme();

    return (
        <section style={{ backgroundColor:theme.palette.background.default }} className="flex flex-col items-center w-screen lg:h-[952.98px]">
            <div className="container mx-auto">
                <div className="relative my-16 pt-20 md:pt-40">
                    <div 
                        style={{backgroundColor: theme.palette.primary.main}}
                        className="rounded-full flex items-center justify-center  absolute left-1/2 -translate-x-1/2 top-0 size-22 sm:size-26 md:top-20"
                    >
                        <img src="/img/Section4/cardano_logo.svg" alt="cardano logo"/>
                    </div>
                    <div className="absolute right-0 z-10 w-16 top-0 sm:w-auto sm:-top-14 md:top-6">
                        <img src="/img/Section4/wizard.svg" alt="saib wizard"/>
                    </div>
                    <div className="relative overflow-hidden bg-cover bg-center p-4 flex justify-between flex-col bg-[url(/img/Section4/purple_bg_mobile.svg)] gap-2 rounded-[24px] lg:rounded-[48px] md:h-100 md:flex-row md:items-center md:px-10 sm:bg-[url(/img/Section4/purple_bg.svg)] lg:h-[498px] lg:px-12">
                        <div className="z-10 mt-14 md:mt-0 lg:w-[661px]">
                            <h1 style={{color: theme.palette.grey[50]}} className="!text-3xl min-[345px]:!text-5xl md:text-4xl lg:!text-[64px] lg:!leading-[60px]">
                                <span>
                                    Streamline <br/>
                                </span>
                                <span style={{color: theme.palette.primary.light}}>
                                    Cardano <br/>
                                    Blockchain <br/>
                                </span>
                                <span>
                                    Data Processing
                                </span>
                            </h1>
                        </div>
                        <div className="z-10 w-62 sm:w-82 md:w-74 lg:w-88">
                            <img src="/img/Section4/code_snippet.webp" alt="code snippet"/>
                        </div>
                    </div>
                </div>
                <div className="max-w-screen-xl w-full flex justify-between flex-col md:flex-row">
                    <div>
                        <div >
                            <p 
                                style={{ color: theme.palette.text.disabled }}
                                className="capitalize leading-[23.04px] !text-sm text-center md:text-start lg:!text-lg"
                            >
                                Argus brings Cardano blockchain data seamlessly <br className="hidden md:block"/>
                                into the .NET environment, empowering developers <br className="hidden md:block"/>
                                to efficiently query and access data using familiar <br className="hidden md:block"/>
                                .NET languages like C#. </p>
                        </div>

                        <div className="mt-[32px] flex items-center justify-center md:block">
                            <BtnMore />
                        </div>

                    </div>
                    <div className="mt-14 flex flex-col gap-8 justify-between items-center md:items-start md:mt-0 lg:gap-0">
                        <p
                            style={{ color: theme.palette.text.disabled }}
                            className="md:hidden"
                        >
                            Argus is a proud product of...
                        </p>
                        <div className="w-65 lg:w-74">
                            <img
                                src={colorMode === 'dark' ? '/img/Section4/catalyst_dark.webp' : '/img/Section4/catalyst_light.webp'}
                                alt="catalyst"
                            />
                        </div>
                        <div className="flex mt-3 lg:mt-[43.19px] lg:justify-end">
                            <Button sx={{ color: theme.palette.grey[50] }} variant="contained" endIcon={<RightArrow />}>View In Catalyst</Button>
                        </div>
                    </div>
                </div>
            </div >
        </section >
    )
};
