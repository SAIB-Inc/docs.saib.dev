import { IconButton, Paper, useTheme } from "@mui/material";
import { ReactNode } from "react";
import BtnMore from "../Shared/Buttons/BtnMore/BtnMore";
import GrayRightArrow from "../../../static/img/Section6/gray_right_arrow.svg";
import WhiteRightArrow from "../../../static/img/Section6/white_right_arrow.svg";
import CardanoLogo from "@site/static/img/cardano_logo";

export default function Section6(): ReactNode {
    const theme = useTheme();

    return (
        <section style={{ backgroundColor: theme.palette.background.default }} className="h-[956px]">
            <div className="container place-content-between !pt-[148px]">
                <div className="flex justify-between h-[72px] mb-[80px]">
                    <div>
                        <h1 className="!text-[64px] !leading-[72px] tracking-[0.64px]">
                            <span>Built On...</span>
                            <span style={{ color: theme.palette.text.secondary }}>Chrysalis</span>
                        </h1>
                    </div>
                    <div className="flex items-center">
                        <BtnMore />
                    </div>

                </div>

                <div className="flex justify-between flex-wrap gap-[16px]">
                    <Paper sx={{
                        backgroundColor: theme.palette.secondary.dark,
                        borderRadius: '24px',
                        paddingTop: '51px',
                        paddingLeft: '40px',
                        paddingRight: '60px',
                        paddingBottom: '43.3px',
                        width: '915px',
                        height: '304px',
                        boxShadow: 0
                    }} >
                        <div className="flex justify-between">
                            <div>
                                <h2 style={{color: theme.palette.grey[50]}} className="!text-[40px] !leading-[48px] !tracking-[0.4px] mb-[24px]">The Cardano<br />
                                    (De)Serializer for .NET
                                </h2>
                                <p style={{color: theme.palette.grey[50]}} className="!text-[20px] !leading-[27.14px] !tracking-[0.9px]">
                                    Chrysalis provides a seamless path to interact with<br />
                                    the Cardano network—from CBOR (de)serialization<br />
                                    to building and customizing transactions.
                                </p>
                            </div>
                            <img src="/img/Section6/big_crystal.webp" className="w-[223.82px] h-[179.39px] self-end"></img>
                        </div>
                    </Paper>

                    <Paper sx={{
                        backgroundColor: theme.palette.grey[800],
                        borderRadius: '24px',
                        width: '357px',
                        height: '304px',
                        boxShadow: 0
                    }}
                        className="flex justify-center items-center relative"
                    >
                        <img src="/img/Section6/chrysalis.webp" />
                    </Paper>

                    <Paper sx={{
                        backgroundColor: theme.palette.grey[900],
                        borderRadius: '24px',
                        width: '316px',
                        height: '304px',
                        boxShadow: 0
                    }}
                        className="flex justify-center items-center"
                    >
                        <CardanoLogo 
                            sx={{
                                color: theme.palette.primary.contrastText
                            }}
                            className="text-[192px]!"
                        />
                    </Paper>

                    <Paper sx={{
                        backgroundColor: theme.palette.secondary.light,
                        borderRadius: '24px',
                        paddingTop: '40px',
                        paddingLeft: '40px',
                        paddingRight: '32px',
                        paddingBottom: '32.05px',
                        width: '471px',
                        height: '304px',
                        boxShadow: 0
                    }}
                    >
                        <div className="flex flex-col gap-4 justify-between">
                            <div>
                                <h3 style={{color: theme.palette.grey[50]}} className="!text-[30px] !font-semibold leading-[33px] !mb-[40px]">CHRYSALIS.TX</h3>
                                <p style={{color: theme.palette.grey[50]}} className="!mb-0">
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
                        backgroundColor: theme.palette.primary.light,
                        borderRadius: '24px',
                        paddingTop: '40px',
                        paddingLeft: '40px',
                        paddingRight: '32px',
                        paddingBottom: '32.05px',
                        width: '469px',
                        height: '304px',
                        boxShadow: 0
                    }}
                    >
                        <div className="flex flex-col gap-4 justify-between">
                            <div className="mb-[25px]">
                                <h3 style={{color: theme.palette.grey[600]}} className="!text-[30px] !font-semibold leading-[33px] !mb-[40px]">CHRYSALIS.NETWORK</h3>
                                <p style={{color: theme.palette.grey[600]}}>
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