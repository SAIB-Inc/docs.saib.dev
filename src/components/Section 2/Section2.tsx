import { Button } from "@mui/material";
import { ReactNode } from "react";
import BtnMore from "../Shared/Buttons/BtnMore/BtnMore";

export default function Section2(): ReactNode {
    return (
        <section className="h-[1076px] w-screen">
            <div className="container flex flex-col justify-center">
                <div className="flex flex-row justify-between">
                    <div className="!mt-[104px]">
                        <h1 className="!text-[56px] font-semibold leading-[53.76px] tracking-[0.56px]">
                            <span>Check Out <br />The </span>
                            <span className="text-[#C2B8FF]">Latest <br />Resources</span>
                        </h1>
                    </div>

                    <div className="pt-[196.85px]">
                        <img src="/img/Section2/razor.webp" alt="razor logo" />
                    </div>

                    <div className="w-[230.04px] !mt-[102.22px]">
                        <div className="flex flex-col justify-end">
                            <nav>
                                <ul className="!m-0 !p-0">
                                    <li><p className="text-[26.01px] leading-[28.611px] !tracking-[1.17045px] !mb-[40px] text-white/20 text-right" style={{ fontFamily: "Space Mono" }}>01</p></li>
                                    <li><p className="text-[26.01px] leading-[28.611px] tracking-[1.17045px] !mb-[40px] text-white/20 text-right" style={{ fontFamily: "Space Mono" }}>02</p></li>
                                    <li><p className="text-[26.01px] leading-[28.611px] tracking-[1.17045px] !mb-[40px] text-white/20 text-right" style={{ fontFamily: "Space Mono" }}>03</p></li>
                                    <li><p className="text-[26.01px] leading-[28.611px] tracking-[1.17045px] !mb-[40px] text-white/20 text-right" style={{ fontFamily: "Space Mono" }}>04</p></li>
                                    <li><p className="text-[26.01px] leading-[28.611px] tracking-[1.17045px] !mb-[40px] text-white text-right" style={{ fontFamily: "Space Mono" }}>Razor - 05</p></li>
                                </ul>
                            </nav>
                        </div>
                        <div className="float-right">
                            <img src="/img/Section2/arrow_down.webp" alt="razor logo"/>
                        </div>
                    </div>
                </div>
                <div className="!mt-[45px] flex justify-between">
                    <div className="w-[223.18px]">
                        <p className="text-white/60">/900k Developer Join</p>
                        <img src="/img/Section2/developers.webp" alt="developers" />
                    </div>

                    <div className="w-[305px]">
                        <p className="text-white/60">The .NET Cardano Node</p>
                        <BtnMore />
                    </div>
                </div>
            </div>
        </section>
    )
}