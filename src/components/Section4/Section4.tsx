import { Button } from "@mui/material";
import { ReactNode } from "react";
import BtnMore from "../Shared/Buttons/BtnMore/BtnMore";
import RightArrow from "../../icons/RightArrow.svg";
import Catalyst from "../../icons/Catalyst.svg";

export default function Section4(): ReactNode {
    return (
        <section className="h-[952.98px] flex flex-col items-center w-screen">
            <div className="container mx-auto">
                <div className="relative my-16 pt-40">
                    <div className="bg-[#5438DC] rounded-full flex items-center justify-center size-26 absolute top-20 left-1/2 -translate-x-1/2">
                        <img src="/img/Section4/cardano_logo.svg" alt="cardano logo"/>
                    </div>
                    <div className="absolute right-0 top-6 z-10">
                        <img src="/img/Section4/wizard.svg" alt="saib wizard"/>
                    </div>
                    <div className="relative h-[498px] overflow-hidden bg-[url(/img/Section4/purple_bg.svg)] px-12 flex items-center justify-between">
                        <div className="bg-[url(/img/Section4/mesh.webp)] absolute left-0 w-full h-full bg-cover"/>
                        <div className="w-[661px]">
                            <h1 className="text-left !text-[64px] !leading-[60px]">
                                <span>
                                    Streamline <br />
                                </span>
                                <span className="text-[#C2B8FF]">
                                    Cardano <br />
                                    Blockchain <br />
                                </span>
                                <span>
                                    Data Processing
                                </span>
                            </h1>
                        </div>
                        <div>
                            <img src="/img/Section4/code_snippet.webp" alt="code snippet"/>
                        </div>
                    </div>
                </div>
                <div className="max-w-screen-xl w-full flex justify-between">
                    <div>
                        <div >
                            <p className="capitalize text-[18px] leading-[23.04px]">Argus brings Cardano blockchain data seamlessly <br />
                                into the .NET environment, empowering developers <br />
                                to efficiently query and access data using familiar <br />
                                .NET languages like C#. </p>
                        </div>

                        <div className="mt-[32px]">
                            <BtnMore />
                        </div>

                    </div>
                    <div>
                        <div>
                            <Catalyst />
                        </div>
                        <div className="mt-[43.19px] flex justify-end">
                            <Button variant="contained" endIcon={<RightArrow />}>View In Catalyst</Button>
                        </div>
                    </div>
                </div>
            </div >
        </section >
    )
};
