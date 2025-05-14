import { ReactNode } from "react";
import { IconButton, useTheme } from "@mui/material";
import { useColorMode } from "@docusaurus/theme-common";
import ArrowDown from "@site/static/img/Section3/arrow_down";

export default function Section3(): ReactNode {

    const theme = useTheme();
    const { colorMode } = useColorMode();

    const scrollToNextSection = () => {
        const nextSection = document.getElementById("section-4");
        if (nextSection) {
            nextSection.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <section style={{ backgroundColor:theme.palette.background.default }} className={`bg-lines relative flex flex-col items-center bg-center w-screen bg-cover ${colorMode === 'dark' ? 'bg-[url(/img/Section3/background_dark.webp)]' : 'bg-[url(/img/Section3/background_light.webp)]'} pb-12 sm:pb-20 lg:pb-0 lg:h-[1088.02px]`}>
            <div className="container flex flex-col justify-center items-center z-10">
                <div className="text-center flex items-center w-full justify-between mt-[36px] gap-6 flex-col sm:flex-row sm:gap-4 mb-28 sm:justify-start sm:w-auto lg:gap-0 lg:mb-[178px] lg:h-[64px]">
                    <div className="w-max!">
                        <p className="leading-[34.8px] font-semibold w-max! text-2xl sm:hidden">Used By</p>
                    </div>
                    <div className="flex items-center gap-8 sm:gap-4">
                        <div className="sm:w-30 lg:w-auto">
                            <img 
                                alt="Buriza" 
                                src={colorMode === 'dark' ? '/img/Section3/buriza_dark.webp' : '/img/Section3/buriza_light.webp'} 
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
                        <div className="sm:w-30 lg:w-auto">
                            <img 
                                src='/img/Section3/levvy.webp' 
                                alt="levvy"
                            />
                        </div>
                    </div>
                </div>
                <div>
                    <div className="flex flex-col sm:mb-[64.94px] lg:flex-row">
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
                            <div className="h-[60px] mt-[2px] mb-[20.06px] flex flex-col text-center lg:text-start lg:justify-end lg:w-108 lg:h-auto lg:gap-y-6" >
                                <div>
                                    <p
                                        className="text-[16px] font-normal leading-[20.48px] "
                                    >
                                        Seamlessly connecting Cardano and .NET for a fast, productive developer experience.
                                    </p>
                                </div>
                                <div className="w-full items-center justify-end hidden lg:flex">
                                    <IconButton aria-label="go to next argus section" onClick={scrollToNextSection}
                                        sx={{
                                            padding: 0,
                                            opacity: 0.6,
                                            '&:hover': {
                                                backgroundColor: 'transparent',
                                                opacity: 1,
                                            },
                                        }}
                                        className="!h-max !transition-all !duration-300 !ease-in-out !justify-end"
                                    >
                                        <ArrowDown sx={{ color: theme.palette.primary.contrastText }} className="!text-[48px]"/>
                                    </IconButton>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="hidden lg:block">
                        <img src={colorMode === 'dark' ? '/img/Section3/project_schema_dark.webp' : '/img/Section3/project_schema_light.webp'} alt="project shema"/>
                    </div>
                    <div className="mx-auto max-w-110 sm:max-w-full sm:w-130 md:w-140 lg:hidden">
                        <img src={colorMode === 'dark' ? '/img/Section3/project_schema_mobile_dark.webp' : '/img/Section3/project_schema_mobile_light.webp'} alt="project shema"/>
                    </div>
                </div>
            </div>
        </section>
    )
};
