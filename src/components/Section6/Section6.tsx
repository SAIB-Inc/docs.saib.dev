import { Button, IconButton, Paper, useTheme } from "@mui/material";
import { ReactNode } from "react";
import BtnMore from "../Shared/Buttons/BtnMore/BtnMore";
import GrayRightArrow from "../../../static/img/Section6/gray_right_arrow.svg";
import WhiteRightArrow from "../../../static/img/Section6/white_right_arrow.svg";
import CardanoLogo from "@site/static/img/cardano_logo";

export default function Section6(): ReactNode {

    const theme = useTheme();

    return (
        <section className="w-screen lg:h-[956px]">
            <div className="container place-content-between !pt-[148px]">
                <div className="flex justify-between h-[72px] mb-[80px] items-center flex-col lg:items-start lg:flex-row">
                    <div>
                        <h1 className="!text-[40px] text-center lg:text-start lg:!leading-[72px] lg:tracking-[0.64px] lg:!text-[64px]">
                            <span>Built On... </span>
                            <span style={{ color: theme.palette.text.secondary }}>Chrysalis</span>
                        </h1>
                    </div>
                    <div className="flex items-center">
                        <BtnMore />
                    </div>

                </div>

                <div className="flex justify-between flex-wrap gap-[16px] mt-30">
                    <Paper 
                        sx={{
                            backgroundColor: '#5438DC',
                            borderRadius: '24px',
                            boxShadow: 0
                        }} 
                        className="!p-6 lg:pt-[51px] lg:pl-10 lg:pr-15 lg:pb-[43.3px] lg:w-[915px] lg:h-[304px]"
                    >
                        <div className="flex justify-between flex-col gap-3! lg:flex-row ">
                            <div>
                                <h2 style={{color: theme.palette.grey[50]}} className="mb-[24px] !text-3xl lg:!leading-[48px] lg:!tracking-[0.4px] lg:!text-[40px]">The Cardano
                                    (De)Serializer for .NET
                                </h2>
                                <p style={{color: theme.palette.grey[50]}} className="!text-sm lg:!leading-[27.14px] lg:!tracking-[0.9px] lg:!text-xl">
                                    Chrysalis provides a seamless path to interact with
                                    the Cardano network—from CBOR (de)serialization
                                    to building and customizing transactions.
                                </p>
                            </div>
                            <img src="/img/Section6/big_crystal.webp" className="self-end w-36 lg:w-[223.82px] lg:h-[179.39px]"></img>
                        </div>
                    </Paper>

                    <Paper sx={{
                        backgroundColor: '#1F2F4E',
                        borderRadius: '24px',
                        boxShadow: 0
                    }}
                        className="flex justify-center items-center relative overflow-hidden lg:w-[357px] lg:h-[304px]"
                    >
                        <img src="/img/Section6/chrysalis.webp"/>
                    </Paper>

                    <Paper sx={{
                        backgroundColor: theme.palette.grey[900],
                        borderRadius: '24px',
                        boxShadow: 0
                    }}
                        className="flex justify-center items-center w-full aspect-square lg:w-[316px] lg:h-[304px]"
                    >
                        <CardanoLogo 
                            sx={{
                                color: theme.palette.primary.contrastText
                            }}
                            className="text-[192px]!"
                        />
                    </Paper>

                    <Paper 
                        sx={{
                            backgroundColor: '#7454FF',
                            borderRadius: '24px',
                            boxShadow: 0
                        }}
                        className="!p-6 lg:pt-10 lg:pl-10 lg:pr-8 lg:pb-[32.05px] lg:w-[471px] lg:h-[304px]"

                    >
                        <div className="flex flex-col gap-4 justify-between">
                            <div>
                                <h3 style={{color: theme.palette.grey[50]}} className="!font-semibold leading-[33px] !text-2xl lg:!text-[30px] lg:!mb-[40px]">CHRYSALIS.TX</h3>
                                <p style={{color: theme.palette.grey[50]}} className="!mb-0 !text-sm lg:!text-base">
                                    Create, sign, and manage Cardano
                                    transactions effortlessly in C# with the
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

                    <Paper 
                        sx={{
                            backgroundColor: '#C2B8FF',
                            borderRadius: '24px',
                            boxShadow: 0
                        }}
                        className="p-6! lg:pt-10 lg:pl-10 lg:pr-8 lg:pb-[32.05px] lg:w-[469px] lg:h-[304px]"
                    >
                        <div className="flex flex-col gap-4 justify-between">
                            <div className="mb-[25px]">
                                <h3 style={{color: theme.palette.grey[600]}} className="!font-semibold leading-[33px] !text-2xl lg:!mb-[40px] lg:!text-3xl">CHRYSALIS<br />.NETWORK</h3>
                                <p style={{color: theme.palette.grey[600]}} className="!mb-0 !text-sm lg:!text-base">
                                    Communicate with the Cardano network
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