import { Button } from "@mui/material";
import { ReactNode } from "react";
import BtnMore from "../Shared/Buttons/BtnMore/BtnMore";
import RightArrow from "../../icons/RightArrow.svg";
import Catalyst from "../../icons/Catalyst.svg";

export default function Section4(): ReactNode {
    return (
        <section className="h-[952.98px] flex flex-col items-center w-screen">
            <div className="container">
                <div className="block mx-auto bg-[url(/img/Section4/purple_bg.webp)] h-[706px] w-full mb-[64px] pt-[329.84px] pl-[59.71px]">
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
                    <div data-comment="argus code here">
                        
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
