import { useColorMode } from "@docusaurus/theme-common";
import { Paper, useTheme } from "@mui/material";
import { ReactNode } from "react";

export default function Section5(): ReactNode {

    const theme = useTheme();
    const { colorMode } = useColorMode();

    return (
        <section className={`bg-cover w-screen h-[1203px] ${colorMode === 'dark' ? "bg-[url(/img/Section5/fifth_background_dark.webp)]" : "bg-[url(/img/Section5/fifth_background_light.webp)]"}`}>
            <div className="container flex flex-col items-center !pt-[227px] !pb-[134px]">
                <div>
                    <h1 className="font-semibold text-center !text-3xl lg:leading-[53.76px] lg:!text-[56px]">
                        <span>Accelerate </span>
                        <span style={{ color: theme.palette.text.secondary }}>Cardano DApp Creation</span>
                    </h1>
                </div>
                <div className="flex flex-col gap-[16px] mt-[40px] lg:flex-row">
                    <Paper 
                        sx={{
                            boxShadow: 0
                        }}
                        className="!p-6 !pb-0 lg:!w-[646px] lg:!h-[654px] lg:!pt-20 lg:!pl-[49px] lg:!pr-[45.74px]"
                    >
                        <div className="flex flex-col">
                            <h2 style={{ color: theme.palette.text.secondary }} className="font-bold !leading-[32px] !text-3xl lg:!mb-[48px] lg:!text-[48px]">Power</h2>
                            <p className="!mb-[9.10px] !text-base lg:!leading-[32px] lg:!text-2xl">
                                Harness the potential of C# with
                                robust tools such as LINQ, ASP.NET,
                                and Entity Framework.
                            </p>
                            <img src="/img/Section5/power.svg" alt="power" className="self-end w-22 lg:w-auto" />
                        </div>
                    </Paper>
                    <div className="flex flex-col gap-[16px]">
                        <Paper 
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                boxShadow: 0
                            }}
                            className="!p-6 lg:pt-20 lg:pl-12 lg:pr-[40.5px] lg:pb-10 lg:!w-[636px] lg:!h-[319px]"
                        >
                            <div>
                                <h2 style={{ color: theme.palette.text.secondary }} className="font-bold !leading-[32px] !text-3xl lg:!mb-[48px] lg:!text-[48px]">Efficiency</h2>
                                <p className="!text-sm lg:!text-xl lg:!leading-[28px]">
                                    Experience streamlined developer
                                    experience for smooth dApp
                                    development and maintenance.
                                </p>
                            </div>
                            <div className="flex flex-col justify-end">
                                <img src="/img/Section5/efficiency.svg" alt="efficiency"  className="w-75 lg:w-auto"/>
                            </div>
                        </Paper>
                        <Paper 
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                boxShadow: 0
                            }}
                            className="!p-6 lg:pt-20 lg:pl-12 lg:pr-10 lg:pb-10 lg:!w-[636px] lg:!h-[319px]"
                        >
                            <div>
                                <h2 style={{ color: theme.palette.text.secondary }} className="font-bold !leading-[32px] !text-3xl lg:!mb-[48px] lg:!text-[48px]">Efficiency</h2>
                                <p className="!text-sm lg:!text-xl lg:!leading-[28px]">
                                    Leverage built-in reducers or create
                                    custom ones tailored to your
                                    requirements.
                                </p>
                            </div>
                            <div className="flex flex-col justify-end">
                                <img src="/img/Section5/customizability.svg" alt="customizability" className="w-60 lg:w-auto"/>
                            </div>
                        </Paper>
                    </div>
                </div>
            </div>
        </section>
    )
};