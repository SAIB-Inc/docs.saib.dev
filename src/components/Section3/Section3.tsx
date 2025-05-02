import { ReactNode } from "react";
import BtnMore from "../Shared/Buttons/BtnMore/BtnMore";
import { useTheme } from "@mui/material";
import { useColorMode } from "@docusaurus/theme-common";

export default function Section3(): ReactNode {

    const theme = useTheme();
    const { colorMode } = useColorMode();

    return (
        <section className={`bg-lines relative flex flex-col items-center bg-center w-screen bg-cover ${colorMode === 'dark' ? 'bg-[url(/img/Section3/background_dark.webp)]' : 'bg-[url(/img/Section3/background_light.webp)]'} pb-20 lg:pb-0 lg:h-[1088.02px]`}>
            <div className="container flex flex-col justify-center items-center">

                <div className="text-center flex items-center flex-col mt-[36px] mb-20 lg:mb-[178px] lg:h-[64px] lg:flex-row">
                    <div>
                        <img alt="Buriza" src="/img/Section3/buriza.webp" />
                    </div>
                    <div className="flex flex-col items-center lg:hidden">
                        <div style={{backgroundColor: theme.palette.primary.main}} className="w-[2px] h-30"/>
                        <div style={{borderTopColor: theme.palette.primary.main}} className="w-0 h-0 border-l-4 border-r-4 border-t-8 border-l-transparent border-r-transparent"/>
                    </div>
                    <div className="ml-[80px] hidden lg:block">
                        <img src="/img/Section3/arrow.webp" />
                    </div>

                    <div className="ml-[40px] mr-[40px] flex items-center">
                        <p className="text-[24px] leading-[34.8px] font-semibold">Used By</p>
                    </div>
                    <div className="flex flex-col items-center lg:hidden">
                        <div style={{backgroundColor: theme.palette.primary.main}} className="w-[2px] h-30"/>
                        <div style={{borderTopColor: theme.palette.primary.main}} className="w-0 h-0 border-l-4 border-r-4 border-t-8 border-l-transparent border-r-transparent"/>
                    </div>
                    <div className="hidden lg:block">
                        <img src="/img/Section3/arrow.webp" className="scale-x-[-1] mr-[80px]" />
                    </div>
                    <div>
                        <img src='/img/Section3/levvy.webp' />
                    </div>
                </div>

                <div>
                    <div className="mb-[64.94px] flex flex-col lg:flex-row">
                        <div className="w-full h-[108px] flex flex-row items-center justify-center mb-2">
                            <h1 className="text-center lg:text-start">
                                <span
                                    style={{color: theme.palette.text.secondary}}
                                    className="font-semibold text-3xl lg:text-[56px] lg:leading-[53.76px]"
                                >
                                    Argus
                                </span>
                                <span className="font-semibold text-3xl lg:text-[56px] lg:leading-[53.76px]"> - The .NET Cardano Indexing Framework</span>
                            </h1>
                        </div>
                        <div className="flex flex-col items-center lg:items-end lg:w-[557px]">
                            <div className="h-[60px] mt-[2px] mb-[20.06px] flex text-center lg:text-start lg:justify-end lg:w-[304.95px]" >
                                <p
                                    style={{color: theme.palette.text.disabled}}
                                    className="text-[16px] font-normal leading-[20.48px] "
                                >
                                    Seamlessly Connecting Cardano And .NET For A Fast, Productive Developer Experience
                                </p>
                            </div>
                            <div>
                                <BtnMore />
                            </div>
                        </div>
                    </div>
                    <div className="">
                        <img src={colorMode === 'dark' ? '/img/Section3/code_snippet_dark.webp' : '/img/Section3/code_snippet_light.webp'} />
                    </div>
                </div>
            </div>
            <div className="absolute -bottom-118 -z-10 hidden lg;block">
                <img src={colorMode === 'dark' ? '/img/Section3/background_connector_dark.webp' : '/img/Section3/background_connector_light.webp'} alt="background connector"/>
            </div>
        </section>
    )
};
