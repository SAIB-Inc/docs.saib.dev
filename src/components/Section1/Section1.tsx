import { Button } from "@mui/material";
import { ReactNode } from "react";

export default function Section1(): ReactNode {
    return (
        <section className="relative grid place-content-center bg-[url(/img/background.png)] w-screen h-screen bg-cover pt-[60px]">
            <div className="container text-center">
                <div>
                    <h1 className="!text-[104px]">
                        <span className="inline-flex items-center -translate-y-4 ">
                            <span className="text-[52.88px] tracking-[-9.62px] mr-[24px]" style={{ fontFamily: "Space Mono" }}>
                                <span> &gt; _</span>
                                <span className="text-[55px] text-[#5438DC] animate-blink inline-block ml-[9.62px]"> |</span>
                            </span>
                        </span>
                        <span className="text-[#C2B8FF]">SAIB </span>
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
                    <Button variant="contained">Let's Get Started</Button>
                </div>
                <div className="flex justify-center mt-[72.9px]">
                    <img src="/img/wizard.webp" alt="wizard developers" />
                </div>
            </div>

            <div className="absolute bottom-[20px] left-1/2 transform -translate-x-1/2 flex justify-center items-center flex-col animate-bounce2 cursor-pointer">
                <img src="/img/scroll_arrow.webp" alt="scroll down"/>
            </div>
        </section>
    )
};