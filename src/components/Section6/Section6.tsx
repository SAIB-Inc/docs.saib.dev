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

                <div className="flex justify-between flex-wrap gap-y-[16px]">
                    <Paper 
                        sx={{
                            backgroundImage: "url('/img/Section6/chyrsalis_bg.webp')",
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                            borderRadius: '24px',
                            paddingTop: '40px',
                            paddingLeft: '41px',
                            paddingRight: '74.14px',
                            paddingBottom: '48px',
                            width: '956px',
                            height: '304px',
                            boxShadow: 0
                        }} 
                    >
                        <div className="flex justify-between">
                            <div>
                                <h2 style={{color: theme.palette.secondary.contrastText}} className="!text-[40px] !font-semibold !leading-[48px] !tracking-[0.4px] mb-[24px]">
                                    The Core Building-<br />
                                    Block .NET Library
                                </h2>
                                <p style={{color: theme.palette.grey[50]}} className="!text-[18px] !leading-[24.426px] !tracking-[0.9px]">
                                    Interact seamlessly with the Cardano network, native<br />
                                    to C#, F#, and VB NET. Featuring its three main<br />
                                    functionalities—Chrysalis.CBOR, Chrysalis.Tx, and<br />
                                    Chrysalis.Network.
                                </p>
                            </div>
                            <img src="/img/Section6/chyrsalis.svg" className="self-end"></img>
                        </div>
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
                        backgroundColor: theme.palette.secondary.dark,
                        borderRadius: '24px',
                        paddingTop: '40px',
                        paddingLeft: '40px',
                        paddingRight: '32.6px',
                        paddingBottom: '32.05px',
                        height: '304px',
                        boxShadow: 0
                    }}
                    >
                        <div className="flex flex-col justify-between h-full">
                            <div>
                                <h3 style={{color: theme.palette.grey[50]}} className="!text-[30px] !font-semibold leading-[33px] !mb-[24px]">CHRYSALIS.CBOR</h3>
                                <p style={{color: theme.palette.grey[50]}} className="!mb-0">
                                    Streamline data exchange through<br />
                                    serializing or (de)serializing Cardano<br />
                                    data structures.
                                </p>
                            </div>
                            <div className="flex justify-between items-end gap-x-45">
                                <img src="/img/Section6/small_crystal.webp" className="w-[100px] self-end" />
                                <IconButton aria-label="go to chrysalis network documentation">
                                    <WhiteRightArrow />
                                </IconButton>
                            </div>
                        </div>
                    </Paper>

                    <Paper sx={{
                        backgroundColor: theme.palette.secondary.light,
                        borderRadius: '24px',
                        paddingTop: '40px',
                        paddingLeft: '40px',
                        paddingRight: '32.6px',
                        paddingBottom: '32.05px',
                        height: '304px',
                        boxShadow: 0
                    }}
                    >
                        <div className="flex flex-col justify-between h-full">
                            <div>
                                <h3 style={{color: theme.palette.grey[50]}} className="!text-[30px] !font-semibold leading-[33px] !mb-[24px]">CHRYSALIS.TX</h3>
                                <p style={{color: theme.palette.grey[50]}} className="!mb-0">
                                    Create, sign, and manage Cardano<br />
                                    transactions effortlessly in C# with the<br />
                                    Chyrsalis Transaction Builder.
                                </p>
                            </div>
                            <div className="flex justify-between items-end gap-x-45">
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
                        paddingRight: '32.6px',
                        paddingBottom: '32.05px',
                        height: '304px',
                        boxShadow: 0
                    }}
                    >
                        <div className="flex flex-col justify-between h-full">
                            <div>
                                <h3 style={{color: theme.palette.grey[600]}} className="!text-[30px] !font-semibold leading-[33px] !mb-[24px]">CHRYSALIS.NETWORK</h3>
                                <p style={{color: theme.palette.grey[600]}}>
                                    Communicate with the Cardano network<br />
                                    in C# through Ouroboros
                                </p>
                            </div>
                            <div className="flex justify-between items-end gap-x-45">
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