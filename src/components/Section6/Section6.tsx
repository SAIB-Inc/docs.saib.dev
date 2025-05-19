import { Button, IconButton, Paper, useTheme } from "@mui/material";
import { ReactNode } from "react";
import BtnMore from "../Shared/Buttons/BtnMore/BtnMore";
import GrayRightArrow from "../../../static/img/Section6/gray_right_arrow.svg";
import WhiteRightArrow from "../../../static/img/Section6/white_right_arrow.svg";
import CardanoLogo from "@site/static/img/cardano_logo";

export default function Section6(): ReactNode {
    const theme = useTheme();
    return (
        <section style={{ backgroundColor:theme.palette.background.default }} className="w-screen lg:h-[956px]">
            <div className="container place-content-between !pt-20 md:!pt-[148px]">
                <div className="flex justify-between h-[72px] items-center flex-col mb-6 lg:mb-20 md:flex-row">
                    <div>
                        <h1 className="text-3xl text-center sm:!text-5xl lg:text-start lg:!leading-[72px] lg:tracking-[0.64px] lg:!text-[64px]">
                            <span>Built On... </span>
                            <span style={{ color: theme.palette.text.secondary }}>Chrysalis</span>
                        </h1>
                    </div>
                    <div className="flex items-center">
                        <BtnMore 
                            LinkComponent='a' href="/docs/chrysalis/overview"
                            sx={{
                                color: theme.palette.grey[50],
                                '&:hover': {
                                    backgroundColor: theme.palette.action.hover,
                                    color: theme.palette.grey[50]
                                },
                                '&:active': {
                                    backgroundColor: theme.palette.action.active,
                                    color: theme.palette.grey[50]
                                },
                            }}
                        />
                    </div>

                </div>

                <div className="flex justify-between flex-wrap gap-4 !mt-14 md:mt-10 xl:mt-30">
                    <Paper 
                        sx={{
                            backgroundImage: "url('/img/Section6/chrysalis_bg.webp')",
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            backgroundRepeat: 'no-repeat',
                            borderRadius: '24px',
                            paddingTop: '40px',
                            paddingLeft: '41px',
                            paddingRight: '74.14px',
                            paddingBottom: '48px',
                            boxShadow: 0
                        }} 
                        className="!p-6 w-full md:w-[calc(75%-8px)]  2xl:h-[304px]"
                    >
                        <div className="flex h-full justify-between gap-3! items-center ">
                            <div className="h-full flex flex-col justify-center">
                                <h2 style={{color: theme.palette.secondary.contrastText}} className="text-2xl !font-semibold mb-[24px] sm:!text-3xl lg:!leading-[48px] lg:!tracking-[0.4px] lg:!text-[40px]">
                                    The Core Building-<br className="max-md:hidden"/>
                                    Block .NET Library
                                </h2>
                                <p style={{color: theme.palette.grey[50]}} className="text-sm sm:!text-lg md:!text-sm lg:!text-[18px] lg:!leading-[24.426px] lg:!tracking-[0.9px]">
                                    Interact seamlessly with the Cardano network, native <br className="max-2xl:hidden"/>
                                    to C#, F#, and VB NET. Featuring its three main <br className="max-2xl:hidden"/>
                                    functionalities—Chrysalis.CBOR, Chrysalis.Tx, and <br className="max-2xl:hidden"/>
                                    Chrysalis.Network.
                                </p>
                            </div>
                            <div className="w-36 shrink-0 hidden sm:w-45 md:block lg:w-50 xl:w-auto">
                                <img src="/img/Section6/chrysalis.svg"/>
                            </div>
                        </div>
                    </Paper>
                    <Paper 
                        sx={{
                            backgroundColor: theme.palette.grey[900],
                            borderRadius: '24px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                        className="w-[calc(50%-8px)] !p-6 md:!hidden"
                    >
                        <div className="w-42">
                            <img src="/img/Section6/chrysalis.svg" alt="chrysalis logo"/>
                        </div>
                    </Paper>
                    <Paper 
                        sx={{
                            backgroundColor: theme.palette.grey[900],
                            borderRadius: '24px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                        className="w-[calc(50%-8px)] !p-6 md:!w-[calc(25%-8px)]"
                    >
                        <CardanoLogo 
                            sx={{
                                color: theme.palette.grey[50]
                            }}
                            className="text-[80px] sm:text-[124px]! md:text-[124px]! xl:text-[192px]!"
                        />
                    </Paper>
                    <Paper sx={{
                        backgroundColor: theme.palette.secondary.dark,
                        borderRadius: '24px',
                        boxShadow: 0
                    }}
                    className="!p-6 w-full md:!w-[calc(33%-12px)] lg:!p-8 lg:!w-[calc(33%-8px)] lg:h-[300.4px] 2xl:h-[304px]"
                    >
                        <div className="flex flex-col justify-between h-full gap-4 lg:gap-6 2xl:gap-0">
                            <div>
                                <h3 style={{color: theme.palette.grey[50]}} className="!font-semibold text-2xl sm:!text-3xl md:!text-xl xl:!text-[26px] 2xl:!text-[30px] lg:leading-[33px] lg:!mb-[24px]">CHRYSALIS.CBOR</h3>
                                <p style={{color: theme.palette.grey[50]}} className="text-sm sm:!text-lg md:!text-sm lg:!text-base">
                                    Streamline data exchange through <br className="max-2xl:hidden"/>
                                    serializing or (de)serializing Cardano <br className="max-2xl:hidden"/>
                                    data structures.
                                </p>
                            </div>
                            <div className="flex justify-between items-end">
                                <img src="/img/Section6/small_crystal.webp" className="w-25 self-end" />
                                <IconButton aria-label="go to chrysalis network documentation">
                                    <WhiteRightArrow />
                                </IconButton>
                            </div>
                        </div>
                    </Paper>

                    <Paper sx={{
                        backgroundColor: theme.palette.secondary.light,
                        borderRadius: '24px',
                        boxShadow: 0
                    }}
                    className="!p-6 w-full md:!w-[calc(33%-8px)] lg:!p-8 lg:h-[300.4px] 2xl:h-[304px]"
                    >
                        <div className="flex flex-col justify-between h-full gap-4 lg:gap-6 2xl:gap-0">
                            <div>
                            <h3 style={{color: theme.palette.grey[50]}} className="!font-semibold text-2xl sm:!text-3xl md:!text-xl lg:leading-[33px] lg:!mb-[24px] xl:!text-[26px] 2xl:!text-[30px]">CHRYSALIS.TX</h3>
                                <p style={{color: theme.palette.grey[50]}} className="text-sm sm:!text-lg md:!text-sm lg:!text-base">
                                    Enables transaction creation, signing, <br className="hidden 2xl:block"/>
                                    and management directly in C# .
                                    Chrysalis Transaction Builder.
                                </p>
                            </div>
                            <div className="flex justify-between items-end">
                                <img src="/img/Section6/small_crystal.webp" className="w-[100px] self-end" />
                                <IconButton 
                                    LinkComponent={'a'}
                                    href="/docs/chrysalis/tx/low-level-builder"
                                    sx={{
                                        padding: 0,
                                        opacity: 0.8,
                                        '&:hover': {
                                          opacity: 1,
                                        },
                                      }}
                                      aria-label="go to chrysalis tx documentation">
                                    <WhiteRightArrow />
                                </IconButton>
                            </div>
                        </div>
                    </Paper>

                    <Paper sx={{
                        backgroundColor: theme.palette.primary.light,
                        borderRadius: '24px',
                        boxShadow: 0
                    }}
                    className="!p-6 w-full md:!w-[calc(33%-8px)] lg:!p-8 lg:h-[300.4px] 2xl:h-[304px]"
                    >
                        <div className="flex flex-col justify-between h-full gap-4 lg:gap-6 2xl:gap-0">
                            <div>
                                <h3 style={{color: theme.palette.grey[600]}} className="!font-semibold leading-5 flex flex-wrap text-2xl sm:!text-3xl md:!text-xl xl:!text-[26px] 2xl:!text-[30px] lg:leading-[33px] lg:!mb-[24px]"><span>CHRYSALIS</span><span>.</span><span>NETWORK</span></h3>
                                <p style={{color: theme.palette.grey[600]}} className="text-sm sm:!text-lg md:!text-sm lg:!text-base">
                                    Streamline data exchange through<br className="max-2xl:hidden"/>
                                    serializing or (de)serializing Cardano<br className="max-2xl:hidden"/>
                                    data structures.
                                </p>
                            </div>
                            <div className="flex justify-between items-end">
                                <img src="/img/Section6/small_crystal.webp" className="w-25 self-end" />
                                <IconButton 
                                    aria-label="go to chrysalis network documentation"
                                    LinkComponent={'a'}
                                    href="/docs/chrysalis/network/overview"
                                    sx={{
                                        padding: 0,
                                        opacity: 0.8,
                                        '&:hover': {
                                          opacity: 1,
                                        },
                                      }}
                                      >
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