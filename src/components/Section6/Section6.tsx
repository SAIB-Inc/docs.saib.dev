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
                        <h1 className="!text-3xl text-center sm:!text-5xl lg:text-start lg:!leading-[72px] lg:tracking-[0.64px] lg:!text-[64px]">
                            <span>Built On... </span>
                            <span style={{ color: theme.palette.text.secondary }}>Chrysalis</span>
                        </h1>
                    </div>
                    <div className="flex items-center">
                        <BtnMore 
                            LinkComponent='a' href="/docs/Chrysalis/overview"
                            sx={{
                                color: theme.palette.grey[50],
                                '&:hover': {
                                    backgroundColor: '#C2B8FF',
                                    color: 'white'
                                },
                                '&:active': {
                                    backgroundColor: '#3A376A',
                                    color: '#white'
                                },
                            }}
                        />
                    </div>

                </div>

                <div className="flex justify-between flex-wrap gap-4 !mt-20 md:mt-10 xl:mt-30">
                    <Paper 
                        sx={{
                            backgroundColor: '#5438DC',
                            borderRadius: '24px',
                            boxShadow: 0
                        }} 
                        className="!p-6 w-full lg:pt-[51px] lg:pl-10 lg:pr-15 lg:pb-[43.3px] lg:w-[calc(70%-8px)] 2xl:w-[915px] 2xl:h-[304px]"
                    >
                        <div className="flex h-full justify-between flex-col gap-3! lg:flex-row ">
                            <div className="h-full">
                                <h2 style={{color: theme.palette.grey[50]}} className="mb-[24px] !text-3xl lg:!leading-[48px] lg:!tracking-[0.4px] lg:!text-[40px]">The Cardano
                                    (De)Serializer for .NET
                                </h2>
                                <p style={{color: theme.palette.grey[50]}} className="!text-sm sm:!text-base lg:!text-lg xl:!leading-[27.14px] xl:!tracking-[0.9px] xl:!text-xl">
                                    Chrysalis provides a seamless path to interact with<br className="hidden sm:block lg:hidden 2xl:block"/>
                                    the Cardano network—from CBOR (de)serialization<br className="hidden sm:block lg:hidden 2xl:block"/>
                                    to building and customizing transactions.
                                </p>
                            </div>
                            <img src="/img/Section6/big_crystal.webp" className="self-end w-36 sm:w-45 lg:w-50 xl:w-[223.82px] xl:h-[179.39px]"></img>
                        </div>
                    </Paper>
                    <Paper sx={{
                        backgroundColor: theme.palette.grey[800],
                        borderRadius: '24px',
                        boxShadow: 0
                    }}
                        className="flex justify-center items-center relative overflow-hidden w-[calc(50%-8px)] lg:w-[calc(30%-8px)] 2xl:w-[357px] 2xl:h-[304px]"
                    >
                        <img src="/img/Section6/chrysalis.webp"/>
                    </Paper>
                    <Paper sx={{
                        backgroundColor: theme.palette.grey[900],
                        borderRadius: '24px',
                        boxShadow: 0
                    }}
                        className="flex justify-center items-center w-[calc(50%-8px)] sm:aspect-auto lg:w-[calc(30%-16px)] 2xl:w-[316px] 2xl:h-[304px]"
                    >
                        <CardanoLogo 
                            sx={{
                                color: theme.palette.primary.contrastText
                            }}
                            className="text-[95px]! sm:text-[150px]! xl:text-[192px]!"
                        />
                    </Paper>

                    <Paper 
                        sx={{
                            backgroundColor: '#7454FF',
                            borderRadius: '24px',
                            boxShadow: 0
                        }}
                        className="!p-6 !w-full lg:pt-10 lg:pl-10 lg:pr-8 lg:pb-[32.05px] lg:!w-[calc(35%-8px)] lg:h-full 2xl:h-[304px] 2xl:!w-[471px]"

                    >
                        <div className="flex flex-col gap-4 justify-between">
                            <div>
                                <h3 style={{color: theme.palette.grey[50]}} className="!font-semibold leading-[33px] !text-3xl lg:!text-2xl xl:!text-[30px] lg:!mb-[40px]">CHRYSALIS.TX</h3>
                                <p style={{color: theme.palette.grey[50]}} className="!mb-0 !text-sm sm:!text-base">
                                    Create, sign, and manage Cardano <br className="hidden md:block lg:hidden xl:block"/>
                                    transactions effortlessly in C# with the <br className="hidden md:block lg:hidden xl:block"/>
                                    Chyrsalis Transaction Builder.
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

                    <Paper 
                        sx={{
                            backgroundColor: '#C2B8FF',
                            borderRadius: '24px',
                            boxShadow: 0
                        }}
                        className="p-6! !w-full lg:pt-10 lg:pl-10 lg:pr-8 lg:pb-[32.05px] lg:!w-[calc(35%-8px)] lg:h-full 2xl:h-[304px] 2xl:!w-[469px]"
                    >
                        <div className="flex flex-col gap-4 justify-between">
                            <div className="mb-[25px]">
                                <h3 style={{color: theme.palette.grey[600]}} className="!font-semibold leading-[33px] !text-3xl lg:!text-2xl lg:!mb-[40px] zxl:!text-3xl">CHRYSALIS<br className="sm:hidden"/>.NETWORK</h3>
                                <p style={{color: theme.palette.grey[600]}} className="!mb-0 !text-sm sm:!text-base">
                                    Communicate with the Cardano network<br className="hidden md:block lg:hidden 2xl:block"/>
                                    in C# through Ouroboros
                                </p>
                            </div>
                            <div className="flex justify-between items-end">
                                <img src="/img/Section6/small_crystal.webp" className="w-[100px]" />
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