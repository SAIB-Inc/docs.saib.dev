import { useColorMode } from "@docusaurus/theme-common";
import { Paper, useTheme } from "@mui/material";
import { ReactNode } from "react";

export default function Section5(): ReactNode {
    const theme = useTheme();
    const { colorMode } = useColorMode();

    return (
        <section className={`bg-cover w-screen ${colorMode === 'dark' ? "bg-[url(/img/Section5/fifth_background_dark.webp)]" : "bg-[url(/img/Section5/fifth_background_light.webp)]"} md:h-[1203px]`}>
            <div className="container flex flex-col items-center !pt-30 md:!pt-[227px] md:!pb-[134px]">
                <div>
                    <h1 className="font-semibold text-center !text-3xl sm:!text-5xl md:!text-[56px] md:leading-[53.76px]">
                        <span>Accelerate </span>
                        <span style={{ color: theme.palette.text.secondary }}>Cardano DApp Creation</span>
                    </h1>
                </div>
                <div className="flex flex-col gap-[16px] mt-[40px] md:flex-row">
                    <Paper 
                        sx={{
                            boxShadow: 0
                        }}
                        className="!p-6 !pb-0 !block md:!p-10 md:!pb-0 lg:!pt-20 xl:!pl-[49px] xl:!w-[646px] xl:!h-[654px] xl:!pr-[45.74px]"
                    >
                        <h2 style={{ color: theme.palette.text.secondary }} className="font-bold !leading-[32px] !text-3xl md:!text-5xl lg:!mb-[48px] lg:!text-[48px]">Power</h2>
                        <div className="flex gap-4 lg:gap-0 md:h-[calc(100%-48px)] lg:flex-col lg:justify-between lg:h-[calc(100%-80px)] xl:justify-start xl:h-auto">
                            <p className="!mb-6 !text-sm sm:!text-base md:!text-xl md:!mb-[9.10px] lg:!leading-[32px] lg:!text-2xl">
                                Harness the potential of C# with <br className="hidden xl:block"/>
                                robust tools such as LINQ, ASP.NET, <br className="hidden xl:block"/>
                                and Entity Framework.
                            </p>
                            <div className="flex items-center">
                                <img src="/img/Section5/power.svg" alt="power" className="w-28 sm:w-22 md:w-24 lg:w-62 lg:mt-7 xl:mt-0 xl:w-auto" />
                            </div>
                        </div>
                    </Paper>
                    <div className="flex flex-col gap-[16px]">
                        <Paper 
                            sx={{
                                boxShadow: 0
                            }}
                            className="!p-6 lg:!pt-20 !block h-full md:!p-10 lg:!pl-12 lg:!pr-10 lg:!pb-10 lg:!w-[636px] lg:!h-[319px]"
                        >
                            <h2 style={{ color: theme.palette.text.secondary }} className="font-bold !leading-[32px] !text-3xl md:!text-5xl lg:!mb-[48px] ">Efficiency</h2>
                            <div className="flex  md:h-[calc(100%-25px)] gap-4 lg:h-auto lg:justify-between">
                                <p className="!text-sm sm:!text-base md:!text-xl lg:!leading-[28px]">
                                    Experience streamlined developer <br className="hidden lg:block"/>
                                    experience for smooth dApp <br className="hidden lg:block"/>
                                    development and maintenance.
                                </p>
                                <div className="flex flex-col items-center justify-end">
                                    <img src="/img/Section5/efficiency.svg" alt="efficiency"  className="w-43 sm:w-36 md:w-88 lg:w-auto"/>
                                </div>
                            </div>
                        </Paper>
                        <Paper 
                            sx={{
                                boxShadow: 0
                            }}
                            className="!p-6 lg:!pt-20 !block md:!hidden lg:!block lg:!pl-12 lg:!pr-10 lg:!pb-10 lg:!w-[636px] lg:!h-[319px]"
                        >
                            <h2 style={{ color: theme.palette.text.secondary }} className="font-bold !leading-[32px] !text-3xl md:!text-5xl lg:!mb-[48px] ">Customizability</h2>
                            <div className="flex gap-4 lg:justify-between">
                                <p className="!text-sm sm:!text-base lg:!text-xl lg:!leading-[28px]">
                                    Leverage built-in reducers or create <br className="hidden lg:block"/>
                                    custom ones tailored to your <br className="hidden lg:block"/>
                                    requirements.
                                </p>
                                <div className="flex flex-col justify-end">
                                    <img src="/img/Section5/customizability.svg" alt="efficiency"  className="w-34 sm:w-36 md:w-60 lg:w-auto"/>
                                </div>
                            </div>
                        </Paper>
                    </div>
                </div>
                <Paper 
                    sx={{
                        justifyContent: 'space-between',
                        boxShadow: 0
                    }}
                    className="!p-6 gap-20 mt-4 !hidden w-full md:!flex md:h-60 md:items-center md:!p-10 lg:!hidden"
                >
                    <div>
                        <h2 style={{ color: theme.palette.text.secondary }} className="font-bold !leading-[32px] !text-3xl md:!text-5xl lg:!mb-[48px] ">Customizability</h2>
                        <p className="!text-sm md:!text-xl lg:!leading-[28px]">
                            Leverage built-in reducers or create <br className="hidden md:block"/>
                            custom ones tailored to your <br className="hidden lg:block"/>
                            requirements.
                        </p>
                    </div>
                    <div className="flex justify-end">
                        <img src="/img/Section5/customizability.svg" alt="efficiency"  className="w-75 md:w-30 lg:w-auto"/>
                    </div>
                </Paper>
            </div>
        </section>
    )
};