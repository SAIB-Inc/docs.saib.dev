import { Button, IconButton, Paper } from "@mui/material";
import { ReactNode } from "react";
import BtnMore from "../Shared/Buttons/BtnMore/BtnMore";
import GrayRightArrow from "../../../static/img/Section6/gray_right_arrow.svg";
import WhiteRightArrow from "../../../static/img/Section6/white_right_arrow.svg";

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
                    <Paper sx={{
                        backgroundColor: '#5438DC',
                        borderRadius: '24px',
                        paddingTop: '51px',
                        paddingLeft: '40px',
                        paddingRight: '60px',
                        paddingBottom: '43.3px',
                        width: '915px',
                        height: '304px',
                    }} >
                        <div className="flex justify-between">
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
                    </Paper>

                    <Paper sx={{
                        backgroundColor: '#1F2F4E',
                        borderRadius: '24px',
                        width: '357px',
                        height: '304px',
                    }}
                        className="flex justify-center items-center relative"
                    >
                        <img src="/img/Section6/chrysalis.webp" />
                    </Paper>

                    <Paper sx={{
                        backgroundColor: '#24222D',
                        borderRadius: '24px',
                        width: '316px',
                        height: '304px'
                    }}
                        className="flex justify-center items-center"
                    >
                        <img src="/img/Section6/cardano.svg" />
                    </Paper>

                    <Paper sx={{
                        backgroundColor: '#7454FF',
                        borderRadius: '24px',
                        paddingTop: '40px',
                        paddingLeft: '40px',
                        paddingRight: '32px',
                        paddingBottom: '32.05px',
                        width: '471px',
                        height: '304px'
                    }}
                    >
                        <div className="flex flex-col gap-4 justify-between">
                            <div>
                                <h3 className="!text-[30px] !font-semibold leading-[33px] !mb-[40px]">CHRYSALIS.TX</h3>
                                <p className="!mb-0">
                                    Create, sign, and manage Cardano<br />
                                    transactions effortlessly in C# with the<br />
                                    Chyrsalis Transaction Builder.
                                </p>
                            </div>
                            <div className="flex justify-between items-end">
                                <img src="/img/Section6/small_crystal.webp" className="w-[100px] self-end" />
                                <IconButton aria-label="go to chrysalis network documentation">
                                    <WhiteRightArrow />
                                </IconButton>
                            </div>
                        </div>
                    </Paper>

                    <Paper sx={{
                        backgroundColor: '#C2B8FF',
                        borderRadius: '24px',
                        paddingTop: '40px',
                        paddingLeft: '40px',
                        paddingRight: '32px',
                        paddingBottom: '32.05px',
                        width: '469px',
                        height: '304px'
                    }}
                    >
                        <div className="flex flex-col gap-4 justify-between">
                            <div className="mb-[25px]">
                                <h3 className="!text-[30px] !font-semibold leading-[33px] !text-[#191919] !mb-[40px]">CHRYSALIS.NETWORK</h3>
                                <p className="!text-[#191919]">
                                    Communicate with the Cardano network<br />
                                    in C# through Ouroboros
                                </p>
                            </div>
                            <div className="flex justify-between items-end">
                                <img src="/img/Section6/small_crystal.webp" className="w-[100px]" />
                                <IconButton aria-label="go to chrysalis network documentation">
                                    <GrayRightArrow />
                                </IconButton>
                            </div>
                        </div>
                    </Paper>
                </div>
            </div>
        </section>
    )
};