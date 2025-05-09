import { ReactNode } from "react";
import BtnMore from "../Shared/Buttons/BtnMore/BtnMore";
import { IconButton, useTheme } from "@mui/material";
import { useColorMode } from "@docusaurus/theme-common";
import ArrowDownIcon from "@site/static/img/Section3/arrow_down";

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
        <section style={{ backgroundColor: theme.palette.background.default }} className={`bg-lines relative h-[1088.02px] flex flex-col items-center bg-center w-screen bg-cover ${colorMode === 'dark' ? 'bg-[url(/img/Section3/background_dark.webp)]' : 'bg-[url(/img/Section3/background_light.webp)]'}`}>
            <div className="container flex flex-col justify-center items-center">

                <div className="text-center h-[64px] flex flex-row items-center mb-[178px] mt-[36px]">
                    <div>
                        <img alt="Buriza" src={colorMode === 'dark' ? '/img/Section3/buriza_dark.webp' : '/img/Section3/buriza_light.webp'} />
                    </div>
                    <div className="ml-[80px]">
                        <img src="/img/Section3/arrow.webp" />
                    </div>

                    <div className="ml-[40px] mr-[40px] flex items-center">
                        <p className="text-[24px] leading-[34.8px] font-semibold">Used By</p>
                    </div>

                    <div>
                        <img src="/img/Section3/arrow.webp" className="scale-x-[-1] mr-[80px]" />
                    </div>
                    <div>
                        <img src='/img/Section3/levvy.webp' />
                    </div>
                </div>

                <div>
                    <div className="mb-[64.94px] flex flex-row justify-between">
                        <div className="h-[108px] flex flex-row items-center">
                            <h1>
                                <span
                                    style={{color: theme.palette.text.secondary}}
                                    className="text-[56px] font-semibold leading-[53.76px]"
                                >
                                    Argus
                                </span>
                                <span className="text-[56px] font-semibold leading-[53.76px]"> - The .NET Cardano <br /> Indexing Framework</span>
                            </h1>
                        </div>

                        <div className="flex flex-col items-end">
                            <div className="mt-[2px] mb-[20.06px] flex flex-col justify-end items-end gap-y-6" >
                                <p
                                    style={{color: theme.palette.text.disabled}}
                                    className="text-[16px] font-normal leading-[20.48px] "
                                >
                                    Seamlessly Connecting Cardano And .NET <br /> For A Fast, Productive Developer Experience
                                </p>

                                <IconButton aria-label="go to next argus section" onClick={scrollToNextSection}
                                    sx={{
                                        padding: 0,
                                        opacity: 0.6,
                                        '&:hover': {
                                          opacity: 1,
                                        },
                                      }}
                                >
                                    <ArrowDownIcon sx={{ color: theme.palette.primary.contrastText }} className="!text-[48px]"/>
                                </IconButton>
                            </div>
                        </div>
                    </div>

                    <div>
                        <img src={colorMode === 'dark' ? '/img/Section3/code_snippet_dark.webp' : '/img/Section3/code_snippet_light.webp'} />
                    </div>
                </div>
            </div>
            <div className="absolute -bottom-118 -z-10">
                <img src={colorMode === 'dark' ? '/img/Section3/background_connector_dark.webp' : '/img/Section3/background_connector_light.webp'} alt="background connector"/>
            </div>
        </section>
    )
};
