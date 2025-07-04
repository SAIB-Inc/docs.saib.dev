import { useColorMode } from "@docusaurus/theme-common";
import { Button, useTheme } from "@mui/material";
import Wizard from "@site/static/img/wizard";
import { ReactNode } from "react";

export default function Section1(): ReactNode {

    const theme = useTheme();
    const { colorMode } = useColorMode();

    const scrollToNextSection = () => {
        const nextSection = document.getElementById("section-2");
        if (nextSection) {
            nextSection.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <section id="section-1" style={{ backgroundColor: theme.palette.background.default }} className={`relative grid place-content-center bg-cover ${colorMode === 'dark' ? "bg-[url(/img/background_dark.webp)]" : "bg-[url(/img/background_light.webp)]"} pt-12 md:pt-0 md:min-h-210 md:h-screen`}>
            <div className="container mx-auto text-center">
                <div>
                    <h1 className="sm:leading-14 sm:mb-6 md:leading-18 md:mb-8  lg:mb-10 lg:leading-24">
                        <span className="inline-flex items-center -translate-y-1 sm:-translate-y-2 md:-translate-y-4 ">
                            <span className="min-w-6 tracking-[-9.62px] leading-[-20px] text-[30px] mr-4 md:mr-6 md:text-[46px] lg:text-[52.88px]" style={{ fontFamily: "Space Mono" }}>
                                <span> &gt; _</span>
                                <span
                                    style={{ color: theme.palette.primary.main }}
                                    className="text-2xl sm:text-[35px] lg:text-[55px] animate-blink inline-block ml-[9.62px]"> |</span>
                            </span>
                        </span>
                        <span
                            style={{ color: theme.palette.text.secondary }}
                            className="text-[40px] sm:!text-[60px] md:!text-[80px] lg:!text-[104px]"
                        >SAIB </span>
                        <span 
                            className="text-[40px] sm:!text-[60px] md:!text-[80px] lg:!text-[104px]"
                        >
                            Cardano Developer Portal</span>
                    </h1>
                </div>
                <div>
                    <p className="text-sm sm:text-base lg:text-xl font-light">
                        Whether you're developing decentralized applications (dApps), writing smart <br className="hidden md:block" />
                        contracts, or exploring blockchain integration, the SAIB Cardano Developer <br className="hidden md:block" />
                        Portal provides everything you need to innovate with confidence.
                    </p>
                </div>
                <div className="mt-[34px]">
                    <Button
                        LinkComponent='a'
                        href="/docs/chrysalis/overview"
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
                        variant="contained">
                        Let's Get Started
                    </Button>
                </div>
                <div className="flex justify-center mt-10 md:mt-[72.9px] lg:!hidden">
                    <Wizard sx={{ color: theme.palette.text.secondary }} className="!text-[120px]"/>
                </div>
                <div className="hidden justify-center mt-10 md:mt-[72.9px] lg:flex">
                    <Wizard sx={{ color: theme.palette.text.secondary }} className="!text-[140px] "/>
                </div>
            </div>
            <div
                onClick={scrollToNextSection}
                className="absolute bottom-0 left-1/2 transform -translate-x-1/2 justify-center items-center flex-col animate-bounce2 cursor-pointer hidden md:flex 2xl:bottom-20"
            >
                <img src="/img/scroll_arrow.webp" alt="scroll down" />

            </div>    
        </section>
    )
};