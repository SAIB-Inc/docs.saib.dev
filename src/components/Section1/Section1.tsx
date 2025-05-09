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
        <section id="section-1" style={{ backgroundColor: theme.palette.background.default }} className={`relative grid place-content-center w-screen h-screen bg-cover ${colorMode === 'dark' ? "bg-[url(/img/background_dark.webp)]" : "bg-[url(/img/background_light.webp)]"}`}>
            <div className="container text-center">
                <div>
                    <h1 className="!text-[104px]">
                        <span className="inline-flex items-center -translate-y-4 ">
                            <span className="text-[52.88px] tracking-[-9.62px] mr-[24px]" style={{ fontFamily: "Space Mono" }}>
                                <span> &gt; _</span>
                                <span
                                    style={{ color: theme.palette.primary.main }}
                                    className="text-[55px] animate-blink inline-block ml-[9.62px]"> |</span>
                            </span>
                        </span>
                        <span
                            style={{ color: theme.palette.text.secondary }}
                        >SAIB </span>
                        <span>Cardano Developer Portal</span>
                    </h1>
                </div>
                <div>
                    <p className="text-[20px] font-light">
                        Whether you're developing decentralized applications (dApps), writing smart <br />
                        contracts, or exploring blockchain integration, the SAIB Cardano Developer <br />
                        Portal provides everything you need to innovate with confidence.
                    </p>
                </div>
                <div className="mt-[34px]">
                    <Button
                        LinkComponent='a'
                        href="http://localhost:3000/docs/chrysalis/overview"
                        sx={{
                            color: theme.palette.grey[50],
                            '&:hover': {
                                backgroundColor: '#C2B8FF',
                                color: 'white'
                            },
                            '&:active': {
                                backgroundColor: '#3A376A',
                                color: '#white'
                            },
                        }}
                        variant="contained">
                        Let's Get Started
                    </Button>
                </div>
                <div className="flex justify-center mt-[72.9px]">
                    <Wizard sx={{ fontSize: 140, color: theme.palette.text.secondary }} />
                </div>
            </div>

            <div
                onClick={scrollToNextSection}
                className="absolute bottom-18 left-1/2 transform -translate-x-1/2 flex justify-center items-center flex-col animate-bounce2 cursor-pointer"
            >
                <img src="/img/scroll_arrow.webp" alt="scroll down" />
            </div>
        </section>
    )
};