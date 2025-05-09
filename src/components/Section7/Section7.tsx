import React, { ReactNode, useState } from "react";
import CardHead from "../../../static/img/Section7/card_head.svg";
import CardHeadMobile from "../../../static/img/Section7/card_head_mobile.svg";
import Popularity from "../../../static/img/Section7/popularity";
import Performance from "../../../static/img/Section7/performance";
import Versatility from "../../../static/img/Section7/versatility";
import SeventhWizard from "@site/static/img/Section7/seventh_wizard";
import { useTheme } from "@mui/material";
import { useColorMode } from "@docusaurus/theme-common";

export default function Section7(): ReactNode {
    const theme = useTheme();
    const { colorMode } = useColorMode();
    const [selectedItem, setSelectedItem] = useState(0);

    const section7Items = [
        {
            title: "Popularity",
            icon: Popularity,
            description: "NET Core was ranked as the top non-web framework in the 2024 Stack Overflow Developer Survey, reflecting its widespread adoption and trust among developers."
        },
        {
            title: "Performance",
            icon: Performance,
            description: "NET Core delivers high-performance applications, with tooling like ASP.NET Core outperforming other popular web frameworks in independent benchmarks."
        },
        {
            title: "Versatility",
            icon: Versatility,
            description: ".NET supports development across Windows, Linux, and macOS, enabling the creation of applications for desktop, mobile, cloud, and IoT environments."
        },
    ]
    
    return (
        <section style={{ backgroundColor: theme.palette.background.default }} className={`bg-cover ${colorMode === 'dark' ? "bg-[url(/img/background_dark.webp)]" : "bg-[url(/img/background_light.webp)]"} xl:h-[1171px]`}>
            <div className="container !py-20 md:!pt-[274.77px] md:!pb-[152.23px]">
                <div className="flex flex-col justify-center !pb-8 md:!pb-15">
                    <div className="relative flex flex-col-reverse gap-4  items-center md:gap-0">
                        <h1 className="relative text-center leading-[53.76px] tracking-[0.56px] font-semibold !m-0 !text-3xl sm:!text-5xl md:!text-[56px]">
                            <span>
                                Why&nbsp;
                            </span>
                            <span style={{
                                color: theme.palette.text.secondary
                            }}>
                                .NET?
                            </span>
                            <SeventhWizard 
                                sx={{
                                    color: theme.palette.text.secondary
                                }}
                                className="!text-[130px] bottom-[-4.74px] md:absolute -right-33 !hidden md:!block"
                            />
                        </h1>
                        <SeventhWizard 
                            sx={{
                                color: theme.palette.text.secondary
                            }}
                            className="!text-[130px] bottom-[-4.74px] md:absolute -right-33 md:!hidden"
                        />
                    </div>

                    <div className="md:mt-[38px]">
                        <p className="text-center !text-base lg:!text-lg">
                            .NET is a powerful, open-source development platform backed by a vast global community.<br className="hidden md:block"/>
                            It offers a comprehensive ecosystem of tools and libraries, enabling developers to build <br className="hidden md:block"/>
                            high-performance, scalable applications across various platforms.
                        </p>
                    </div>

                </div>
                <div className="items-center hidden md:flex flex-wrap xl:flex-nowrap gap-4 md:justify-center xl:justify-between xl:gap-x-[4.94px]">
                    {section7Items.map((datum, index) => {
                        return (
                            <div className="relative basis-89 xl:basis-[353.05px] 2xl:basis-[402.05px]">
                                <div className="absolute w-full">
                                    <p className="text-[32px] leading-8 absolute top-[15px] left-[19px]">0{index + 1}</p>
                                    <CardHead className="absolute top-0 w-full" />
                                    {React.createElement(datum.icon, { className:"absolute top-8 right-[32.05px] md:!text-[56px] xl:!text-[68px]" })}
                                </div>
                                <div   
                                    style={{
                                        backgroundColor: theme.palette.primary.main,
                                        color: theme.palette.grey[50]
                                    }}
                                    className="rounded-b-[24px] pt-[57px] pl-8 pr-[46px] pb-[50px] mt-22 md:!h-[391px] xl:h-auto xl:mt-[93px] 2xl:mt-[99px]"
                                >
                                    <h4 className="!text-[40px] leading-[48px] !mb-[38px]">{datum.title}</h4>
                                    <p className="!text-[20px] leading-[28px]">
                                        {datum.description}
                                    </p>
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div className="w-full gap-4 items-center overflow-hidden flex md:hidden">
                    {section7Items.map((datum, index) => {
                        return (
                        <div
                            key={datum.title}
                            id={datum.title}
                            style={{
                                transform: `translateX(calc(-${selectedItem * 100}% - ${selectedItem * 16}px))`,
                                transition: 'transform 0.5s ease'
                            }}
                            className="min-w-full flex flex-col"
                        >
                            <div className="w-full relative">
                                <p className="text-2xl leading-8 absolute top-[35%] left-[19px] sm:text-4xl sm:top-[30%] sm:left-12">0{index + 1}</p>
                                <CardHeadMobile className="w-full" />
                                {React.createElement(datum.icon, { className:"absolute top-[39%] right-[32.05px] !text-[50px] sm:!text-[60px] sm:!top-[33%]" })}
                            </div>
                            <div 
                                style={{
                                    backgroundColor: theme.palette.primary.main
                                }}
                                className="rounded-b-2xl !p-6 z-10 -mt-18"
                            >
                                <h4 
                                    style={{
                                        color: theme.palette.grey[50]
                                    }}
                                    className="!text-[32px] leading-12 !mb-6"
                                >
                                    {datum.title}
                                </h4>
                                <p style={{ color: theme.palette.grey[50] }}>{datum.description}</p>
                            </div>
                        </div>
                        );
                    })}
                </div>
                <div className="flex gap-2 items-center mt-6 md:hidden">
                    {section7Items.map((_, i) => (
                        <div 
                            key={i}
                            onClick={() => {
                                setSelectedItem(i)
                            }}
                            style={{
                                backgroundColor: selectedItem === i ? theme.palette.primary.main : theme.palette.grey[700]
                            }}
                            className="w-1/3 h-2 rounded-full"
                        />
                    ))}
                </div>
            </div>
        </section>
    )
};
