import { Button, useTheme } from "@mui/material";
import { ReactNode } from "react";
import BtnMore from "../Shared/Buttons/BtnMore/BtnMore";
import RightArrow from "../../icons/RightArrow.svg";
import { useColorMode } from "@docusaurus/theme-common";

export default function Section4(): ReactNode {

    const theme = useTheme();

    return (
        <section className="flex flex-col items-center w-screen lg:h-[952.98px]">
            <div className="container mx-auto">
                <div className="relative my-16 pt-20 md:pt-40">
                    <div 
                        style={{backgroundColor: theme.palette.primary.main}}
                        className="rounded-full flex items-center justify-center size-26 absolute left-1/2 -translate-x-1/2 top-0 md:top-20"
                    >
                        <img src="/img/Section4/cardano_logo.svg" alt="cardano logo"/>
                    </div>
                    <div className="absolute right-0 top-6 z-10 hidden sm:block">
                        <img src="/img/Section4/wizard.svg" alt="saib wizard"/>
                    </div>
                    <div className="relative overflow-hidden bg-[url(/img/Section4/purple_bg.svg)] bg-cover bg-center p-4 flex justify-between flex-col gap-2  rounded-[24px] lg:rounded-[48px] md:h-100 md:flex-row md:px-10 lg:h-[498px] lg:px-12">
                        <div className="bg-[url(/img/Section4/mesh.webp)] absolute left-0 w-full h-full bg-cover"/>
                        <div className="z-10 mt-14 md:mt-0 lg:w-[661px]">
                            <h1 style={{color: theme.palette.grey[50]}} className="!text-3xl sm:!text-5xl md:text-4xl lg:!text-[64px] lg:!leading-[60px]">
                                <span>
                                    Streamline <br className="hidden md:block"/>
                                </span>
                                <span style={{color: theme.palette.primary.light}}>
                                    Cardano <br className="hidden md:block"/>
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
                    <div className="mt-14 flex flex-col gap-4 justify-between items-center md:mt-0">
                        <p
                            style={{ color: theme.palette.text.disabled }}
                        >
                            Argus is a proud product of...
                        </p>
                        <div className="mt-4!">
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
