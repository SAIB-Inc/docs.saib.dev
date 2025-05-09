import React, { ReactNode, useState } from "react";
import CardHead from "../../../static/img/Section7/card_head.svg";
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
            description: "NET Core was ranked as the top non-web framework in the 2024 Stack Overflow Developer Survey, reflecting its widespread adoption and trust among developers."
        },
        {
            title: "Versatility",
            icon: Versatility,
            description: "NET Core was ranked as the top non-web framework in the 2024 Stack Overflow Developer Survey, reflecting its widespread adoption and trust among developers."
        },
    ]
    
    return (
        <section style={{ backgroundColor: theme.palette.background.default }} className={`bg-cover ${colorMode === 'dark' ? "bg-[url(/img/background_dark.webp)]" : "bg-[url(/img/background_light.webp)]"} md:h-[1171px]`}>
            <div className="container !py-20 md:!pt-[274.77px] md:!pb-[152.23px]">
                <div className="flex flex-col justify-center !pb-8 md:!pb-15">
                    <div className="relative flex flex-col-reverse items-center">
                        <h1 className="text-center leading-[53.76px] tracking-[0.56px] font-semibold !m-0 !text-3xl sm:!text-5xl md:!text-[56px]">
                            <span>
                                Why&nbsp;
                            </span>
                            <span style={{
                                color: theme.palette.text.secondary
                            }}>
                                .NET?
                            </span>
                        </h1>
                        <SeventhWizard 
                            sx={{
                                color: theme.palette.text.secondary
                            }}
                            className="!text-[130px] right-[355.44px] bottom-[-4.74px] md:absolute"
                        />
                    </div>

                    <div className="md:mt-[38px]">
                        <p className="text-center">
                            .NET is a powerful, open-source development platform backed by a vast global community.<br className="hidden md:block"/>
                            It offers a comprehensive ecosystem of tools and libraries, enabling developers to build <br className="hidden md:block"/>
                            high-performance, scalable applications across various platforms.
                        </p>
                    </div>

                </div>
                <div className="justify-between items-center gap-x-[4.94px] hidden md:flex">
                    
                    <div className="basis-[402.05px] relative">
                        <div className="absolute w-full">
                            <p className="text-[32px] leading-8 absolute top-[15px] left-[19px]">01</p>
                            <CardHead className="absolute top-0 w-full" />
                            <Popularity className="absolute top-8 right-[32.05px]" />
                        </div>
                        <div   
                            style={{
                                backgroundColor: theme.palette.primary.main,
                                color: theme.palette.grey[50]
                            }}
                            className="rounded-b-[24px] mt-[99px] pt-[57px] pl-8 pr-[46px] pb-[50px]"
                        >
                            <h4 className="!text-[40px] leading-[48px] !mb-[38px]">Popularity</h4>
                            <p className="!text-[20px] leading-[28px]">NET Core was ranked as the top <br />
                            non-web framework in the 2024<br />
                            Stack Overflow Developer <br />
                            Survey, reflecting its <br />
                            widespread adoption and trust <br />
                            among developers.</p>
                        </div>
                    </div>
                    
                    <div className="basis-[402.05px] relative">
                    <div className="absolute w-full">
                            <p className="text-[32px] leading-8 absolute top-[15px] left-[19px]">02</p>
                            <CardHead className="absolute top-0 w-full" />
                            <Performance className="absolute top-8 right-[32.05px]" />
                        </div>
                        <div 
                            style={{
                                backgroundColor: theme.palette.primary.main,
                                color: theme.palette.grey[50]
                            }}
                            className="rounded-b-[24px] mt-[99px] pt-[57px] pl-8 pr-[48.5px] pb-[50px]"
                        >
                            <h4 className="!text-[40px] leading-12 !mb-[38px]">Performance</h4>
                            <p className="!text-[20px] leading-7">NET Core delivers high-<br />
                            performance applications, with <br />
                            tooling like ASP.NET Core <br />
                            outperforming other popular <br />
                            web frameworks in independent benchmarks.</p>
                        </div>
                    </div>
                    
                    <div className="basis-[402.05px] relative">
                        <div className="absolute w-full">
                            <p className="text-[32px] leading-8 absolute top-[15px] left-[19px]">03</p>
                            <CardHead className="absolute top-0 w-full" />
                            <Versatility className="absolute top-8 right-[32.05px]" />
                        </div>
                        <div 
                            style={{
                                backgroundColor: theme.palette.primary.main,
                                color: theme.palette.grey[50]
                            }}
                            className="rounded-b-[24px] mt-[99px] pt-[57px] pl-8 pr-[48.5px] pb-[50px]"
                        >
                            <h4 className="!text-[40px] leading-12 !mb-[38px]">Versatility</h4>
                            <p className="!text-[20px] leading-7">.NET supports development <br />
                            across Windows, Linux, and <br />
                            macOS, enabling the creation <br />
                            of applications for desktop, <br />
                            mobile, cloud, and IoT <br />
                            environments.</p>
                        </div>
                    </div>
                    
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
                                <p className="text-2xl leading-8 absolute top-[15px] left-[19px]">0{index + 1}</p>
                                <CardHead className="w-full" />
                                {React.createElement(datum.icon, { sx: {
                                    fontSize: 50
                                } ,className:"absolute top-8 right-[32.05px]" })}
                            </div>
                            <div 
                                style={{
                                    backgroundColor: theme.palette.primary.main
                                }}
                                className="rounded-b-2xl !p-4"
                            >
                                <h4 className="!text-[32px] leading-12 !mb-[38px]">{datum.title}</h4>
                                <p>{datum.description}</p>
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
