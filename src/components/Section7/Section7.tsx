import React, { ReactNode, useRef, useState } from "react";
import Popularity from "../../../static/img/Section7/popularity";
import Performance from "../../../static/img/Section7/performance";
import Versatility from "../../../static/img/Section7/versatility";
import SeventhWizard from "@site/static/img/Section7/seventh_wizard";
import { useTheme } from "@mui/material";
import { useColorMode } from "@docusaurus/theme-common";

export default function Section7(): ReactNode {
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
    ];

    const theme = useTheme();
    const { colorMode } = useColorMode();
    const [selectedItem, setSelectedItem] = useState(0);
    const touchStartX = useRef(0);
    const touchEndX = useRef(0);

    const handleTouchStart = (e: React.TouchEvent) => {
        touchStartX.current = e.touches[0].clientX;
    };

    const handleTouchMove = (e: React.TouchEvent) => {
        touchEndX.current = e.touches[0].clientX;
    };

    const handleTouchEnd = () => {
        const deltaX = touchEndX.current - touchStartX.current;
        if (deltaX > 50) {
            setSelectedItem((prev) => Math.max(prev - 1, 0));
        } else if (deltaX < -50) {
            setSelectedItem((prev) => Math.min(prev + 1, section7Items.length - 1))
        }
    };
    
    return (
        <section style={{ backgroundColor: theme.palette.background.default }} className={`place-content-center bg-cover ${colorMode === 'dark' ? "bg-[url(/img/background_dark.webp)]" : "bg-[url(/img/background_light.webp)]"} xl:h-[1080px]`}>
            <div className="container !py-20 md:!pt-[274.77px] md:!pb-[152.23px]">
                <div className="flex flex-col justify-center !pb-8 md:!pb-15">
                    <div className="relative flex flex-col-reverse gap-4  items-center md:gap-0">
                        <h1 className="relative text-center font-semibold !text-3xl sm:!text-5xl md:leading-[53.76px] md:tracking-[0.56px] md:!text-[56px]">
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
                            .NET is a powerful, open-source development platform backed by a vast global community.<br className="hidden lg:block"/>
                            It offers a comprehensive ecosystem of tools and libraries, enabling developers to build <br className="hidden lg:block"/>
                            high-performance, scalable applications across various platforms.
                        </p>
                    </div>

                </div>
                <div className="hidden md:grid md:grid-cols-2 gap-6 lg:gap-4 lg:grid-cols-3 xl:gap-6 2xl:gap-10">
                    {section7Items.map((datum, index) => {
                        return (
                            <div
                                key={`${datum.title}-${index}`}
                                id={datum.title}
                                className={`h-full ${index===2 ? "col-span-2 lg:col-span-1" : "col-span-1"}`}
                            >
                                <div 
                                    className="flex items-center justify-end relative top-1 rounded-tr-3xl"
                                >
                                    <div className={`${index===2 ? "w-[10%] lg:w-[20%]" : "w-[20%]"} relative flex items-center justify-center`}>
                                        <div 
                                            style={{
                                                borderBottomColor: theme.palette.primary.main, 
                                                borderRightColor: theme.palette.primary.main,
                                        }}
                                            className="border-r-8 border-b-8 w-14 aspect-square absolute top-2 -right-2 rounded-br-3xl lg:w-12 lg:top-[6px]"
                                        />
                                        <p className="text-[32px] leading-8  inset-0 top-6 left-6 lg:left-4 lg:top-4">0{index + 1}</p>
                                    </div>
                                    <div
                                        style={{
                                            backgroundColor: theme.palette.primary.main
                                        }}
                                        className={`${index===2 ? "w-[90%] lg:w-[80%]" : "w-[80%]"} flex justify-end rounded-t-3xl relative h-22 px-10 lg:px-6 lg:h-17`}
                                    >
                                        {React.createElement(datum.icon, { className:"self-end md:!text-[56px] xl:!text-[68px] absolute top-6" })}
                                    </div>
                                </div>
                                <div
                                    style={{backgroundColor: theme.palette.primary.main}}
                                    className={`rounded-b-[24px] px-6 pt-6 pb-10 lg:pl-8 lg:pr-[46px] lg:pt-10 xl:pt-[57px] xl:pb-[50px] rounded-tl-3xl ${index===2 ? "lg:!h-[391px]" : "!h-75 lg:!h-[391px]"} xl:h-auto`}
                                >
                                    <h4 
                                        style={{
                                            color: theme.palette.grey[50]
                                        }}
                                        className="!text-[40px] leading-[48px] !mb-4 lg:!text-[34px] lg:!mb-7 xl:!mb-[38px] xl:!text-[40px]"
                                    >{datum.title}</h4>
                                    <p 
                                        style={{
                                            color: theme.palette.grey[50]
                                        }}
                                        className="!text-xl"
                                    >
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
                            key={`${datum.title}-${index}`}
                            id={datum.title}
                            onTouchStart={handleTouchStart}
                            onTouchMove={handleTouchMove}
                            onTouchEnd={handleTouchEnd}
                            style={{
                                transform: `translateX(calc(-${selectedItem * 100}% - ${selectedItem * 16}px))`,
                                transition: 'transform 0.5s ease'
                            }}
                            className="min-w-full"
                        >
                            <div className="flex items-center relative top-1 justify-end">
                                <div className="relative flex items-center justify-center w-[14%] sm:w-[10%]">
                                    <div 
                                        style={{
                                            borderBottomColor: theme.palette.primary.main, 
                                            borderRightColor: theme.palette.primary.main,
                                    }}
                                        className="border-r-8 border-b-8 w-9 aspect-square absolute top-[17px] -right-2 rounded-br-3xl"
                                    />
                                    <p className="text-2xl leading-8 sm:text-3xl">0{index + 1}</p>
                                </div>
                                <div 
                                    style={{
                                        backgroundColor: theme.palette.primary.main
                                    }}
                                    className="h-16 px-6 rounded-t-3xl relative flex items-center justify-end w-[86%] sm:w-[90%]"
                                >
                                    {React.createElement(datum.icon, { className:"self-end absolute top-6 !text-[50px] sm:!text-[60px]" })}
                                </div>
                            </div>
                            <div 
                                style={{
                                    backgroundColor: theme.palette.primary.main
                                }}
                                className="rounded-b-2xl rounded-tl-2xl !p-6"
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
