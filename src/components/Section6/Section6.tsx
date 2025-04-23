import { Button } from "@mui/material";
import { ReactNode } from "react";
import BtnMore from "../Shared/Buttons/BtnMore/BtnMore";
import RightArrow from "../../icons/RightArrow.svg";

export default function Section6(): ReactNode {
    return (
        <section className="h-[956px] w-screen">
            <div className="container place-content-between !pt-[148px]">
                <div className="flex justify-between h-[72px] mb-[80px]">
                    <div>
                        <h1 className="!text-[64px] !leading-[72px] tracking-[0.64px]">
                            <span className="text-white">Built On...</span>
                            <span className="text-[#C2B8FF]">Chrysalis</span>
                        </h1>
                    </div>
                    <div className="flex items-center">   
                        <BtnMore />
                    </div>
                    
                </div>

                <div className="flex justify-between flex-wrap gap-[16px]">
                    <div className="bg-[#5438DC] !w-[915px] h-[304px] rounded-[24px] flex justify-between pt-[51px] pl-[40px] pr-[60px] pb-[43.3px]">
                        <div>
                            <h2 className="!text-[40px] !leading-[48px] !tracking-[0.4px] mb-[24px]">The Cardano<br />
                                (De)Serializer for .NET
                            </h2>
                            <p className="!text-[20px] !leading-[27.14px] !tracking-[0.9px]">
                                Chrysalis provides a seamless path to interact with<br />
                                the Cardano network—from CBOR (de)serialization<br />
                                to building and customizing transactions.
                            </p>
                        </div>
                        <img src="/img/Section6/big_crystal.webp" className="w-[223.82px] h-[179.39px] self-end"></img>
                    </div>

                    <div className="w-[357px] h-[304px] bg-[url(/img/Section6/chrysalis.webp)] bg-cover rounded-[24px]">
                    </div>

                    <div className="w-[316px] h-[304px] bg-[url(/img/Section6/cardano.webp)] bg-cover rounded-[24px]">
                    </div>

                    <div className="w-[471px] h-[304px] rounded-[24px] bg-[url(/img/Section6/gradient.webp)] flex flex-col justify-between pt-[40px] pl-[40px] !pb-[32.05px] pr-[32px]">
                        <div>
                            <h3 className="!text-[30px] !font-semibold leading-[33px] !mb-[40px]">CHRYSALIS.TX</h3>
                            <p className="!mb-0">
                                Create, sign, and manage Cardano<br />
                                transactions effortlessly in C# with the<br />
                                Chyrsalis Transaction Builder.
                            </p>
                        </div>
                        <div className="flex justify-between items-end">
                            <img src="/img/Section6/small_crystal.webp" className="w-[117.3px] h-[93.95px] self-end"/>
                            <RightArrow className="w-[49px] h-[49px] cursor-pointer"/>
                        </div>
                    </div>

                    <div className="w-[469px] h-[304px] rounded-[24px] bg-[#C2B8FF] flex flex-col justify-between pt-[40px] pl-[40px] !pb-[32.05px] pr-[32px]">
                        <div>
                            <h3 className="!text-[30px] !font-semibold leading-[33px] !text-[#191919] !mb-[40px]">CHRYSALIS.NETWORK</h3>
                            <p className="!text-[#191919]">
                                Communicate with the Cardano network<br />
                                in C# through Ouroboros
                            </p>
                        </div>
                        <div className="flex justify-between items-end">
                            <img src="/img/Section6/small_crystal.webp" className="w-[117.3px] h-[93.95px]"/>
                            <RightArrow className="w-[49px] h-[49px] stroke-[#191919] cursor-pointer"/>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
};