import { ReactNode } from "react";
import BtnMore from "../Shared/Buttons/BtnMore/BtnMore";
import { useTheme } from "@mui/material";
import { useColorMode } from "@docusaurus/theme-common";
import { KeyboardArrowDown } from "@mui/icons-material";
import ArrowDown from "@site/static/img/Section3/arrowDown";

export default function Section3(): ReactNode {

    const theme = useTheme();
    const { colorMode } = useColorMode();

    return (
        <section style={{ backgroundColor:theme.palette.background.default }} className={`bg-lines relative flex flex-col items-center bg-center w-screen bg-cover ${colorMode === 'dark' ? 'bg-[url(/img/Section3/background_dark.webp)]' : 'bg-[url(/img/Section3/background_light.webp)]'} sm:pb-20 lg:pb-0 lg:h-[1088.02px]`}>
            <div className="container flex flex-col justify-center items-center z-10">

                <div className="text-center flex items-center flex-col mt-[36px] gap-6 sm:gap-4 sm:flex-row mb-20 lg:gap-0 lg:mb-[178px] lg:h-[64px]">
                    <p className="text-[24px] leading-[34.8px] font-semibold sm:hidden">Used By</p>
                    <ArrowDown sx={{ fontSize:100 }} className="sm:hidden!"/>
                    <div>
                        <img 
                            alt="Buriza" 
                            src={colorMode === 'dark' ? '/img/Section3/buriza_dark.webp' : '/img/Section3/buriza_light.webp'} 
                            className="sm:w-30 lg:w-auto"
                        />
                    </div>
                    <div className="hidden w-27 sm:block md:ml-4 md:w-40 lg:w-auto lg:ml-10 xl:ml-[80px]">
                        <img src="/img/Section3/arrow.webp" />
                    </div>
                    <div className="items-center my-2 mx-2 hidden sm:flex lg:mx-4 xl:mx-10">
                        <p className="font-semibold md:text-xl lg:leading-[34.8px] lg:text-2xl ">Used By</p>   
                    </div>
                    <div className="hidden w-27 sm:block md:w-40 lg:w-auto">
                        <img src="/img/Section3/arrow.webp" className="scale-x-[-1] mr-1 md:mr-10 lg:mr-10 xl:mr-[80px]" />
                    </div>
                    <div>
                        <img 
                            src='/img/Section3/levvy.webp' 
                            alt="levvy"
                            className="sm:w-30 lg:w-auto"
                        />
                    </div>
                </div>
                <div>
                    <div className="mb-[64.94px] flex flex-col lg:flex-row">
                        <div className="w-full h-[108px] flex flex-row items-center justify-center mb-2">
                            <h1 className="text-center lg:text-start">
                                <span
                                    style={{color: theme.palette.text.secondary}}
                                    className="font-semibold text-3xl sm:!text-5xl md:!text-[56px] lg:!text-[40px] lg:leading-[53.76px] xl:!text-[56px]"
                                >
                                    Argus
                                </span>
                                <span className="font-semibold text-3xl sm:!text-5xl md:!text-[56px] lg:!text-[40px] lg:leading-[53.76px] xl:!text-[56px]"> - The .NET Cardano Indexing Framework</span>
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
                    <div className="hidden sm:block">
                        <img src={colorMode === 'dark' ? '/img/Section3/code_snippet_dark.webp' : '/img/Section3/code_snippet_light.webp'} />
                    </div>
                </div>
            </div>
            <div className="absolute -bottom-118 hidden lg:block">
                <img src={colorMode === 'dark' ? '/img/Section3/background_connector_dark.webp' : '/img/Section3/background_connector_light.webp'} alt="background connector"/>
            </div>
        </section>
    )
};
