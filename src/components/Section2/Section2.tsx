import { ReactNode, useState } from "react";
import BtnMore from "../Shared/Buttons/BtnMore/BtnMore";
import { alpha, Icon, IconButton, useTheme } from "@mui/material";
import { useColorMode } from "@docusaurus/theme-common";
import DownArrow from "../../icons/DownArrow.svg";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";

export default function Section2(): ReactNode {

    const theme = useTheme();
    const { colorMode } = useColorMode()

    const [currentProject, setCurrentProject] = useState(0);
    const [isFading, setIsFading] = useState(false);

    const projects = [
        {
            name: "chrysalis",
            logo: "/img/Section2/Logos/chrysalis.webp",
            description: "Razor is a next-generation .NET Cardano node",
            class: "w-72 -top-36 sm:w-100 sm:-top-49 md:w-120 md:-top-59 lg:top-84 xl:top-76 xl:w-full"
        },
        {
            name: "argus",
            logo: "/img/Section2/Logos/argus.webp",
            description: "Razor is a next-generation .NET Cardano node",
            class: "-top-48 w-62 sm:w-72 sm:-top-52 md:w-82 md:-top-56 lg:w-94 lg:top-72 xl:w-full xl:top-68"
        },
        {
            name: "aegis",
            logo: "/img/Section2/Logos/aegis.webp",
            description: "Razor is a next-generation .NET Cardano node",
            class: "-top-45 w-62 sm:w-72 sm:-top-49 md:w-82 md:-top-53 lg:w-94 lg:top-72 xl:w-full xl:top-70"
        },
        {
            name: "futura",
            logo: "/img/Section2/Logos/futura.webp",
            description: "Razor is a next-generation .NET Cardano node",
            class: "-top-45 w-56 sm:w-68 sm:-top-51 md:w-76 md:-top-55 lg:w-80 lg:top-84 xl:w-full xl:top-76"
        },
        {
            name: "razor",
            logo: "/img/Section2/Logos/razor.webp", 
            description: "Razor is a next-generation .NET Cardano node",
            class: "-top-52 w-38 sm:w-44 sm:-top-58 md:w-46 lg:w-58 lg:top-60 xl:w-full lg:top-50"
        }
    ];

    return (
        <section id="section-2" style={{ backgroundColor:theme.palette.background.default }} className="w-screen pb-20 lg:pb-0 lg:h-242 xl:h-[1076px]">
            <div className="container flex flex-col h-full">
                <div className="flex justify-between flex-col lg:h-[calc(100%-230px)] lg:flex-row">
                    <div className="!mt-18 md:!mt-26">
                        <h1 className="font-semibold tracking-[0.56px] !text-3xl text-center sm:!text-5xl md:!text-[56px] lg:text-start lg:leading-[53.76px]! lg:!text-[40px] xl:!text-[40px] xl:w-72 2xl:w-96  2xl:!text-[56px]">
                            <span>Check Out </span><br className="hidden lg:block"/> 
                            <span>The </span>
                            <span style={{color: theme.palette.text.secondary}} >Latest <br className="hidden xl:block"/>Resources</span>
                        </h1>
                    </div>
                    <div className="flex flex-col justify-end items-center relative mt-54 md:mt-77 lg:mt-0">
                        <div className={`absolute inset-x-0 left-1/2 transform -translate-x-1/2 flex justify-center ${projects[currentProject].class}`}>
                            <img
                                src={projects[currentProject].logo}
                                alt="razor logo"
                                className={`transition-opacity duration-150 ${isFading ? "opacity-0" : "opacity-100"} animate-bounce3`}
                            />
                        </div>
                        <img 
                            src={colorMode === 'dark' ? "/img/Section2/base_ellipse_dark.webp" : "/img/Section2/base_ellipse_light.webp"} 
                            alt="base ellipse" 
                            className="w-72 sm:w-100 md:w-120 lg:w-auto"
                        />
                    </div>
                    <div className="!mt-[40px] lg:!mt-[102.22px] lg:w-100 2xl:w-116 xl:w-[305px]">
                        <div className="flex flex-col justify-end pr-[6px]">
                            <nav>
                                <ul className="!m-0 !p-0 hidden lg:block">
                                    {projects.map((datum, index)=>{
                                        return(
                                            <li
                                                id={datum.name}
                                                onClick={() => {
                                                    if (index !== currentProject) {
                                                        setIsFading(true);
                                                        setTimeout(() => {
                                                            setCurrentProject(index);
                                                            setIsFading(false);
                                                        }, 150);
                                                    }
                                                }}                                                
                                            >
                                                <p 
                                                    className="text-[26.01px] leading-[28.611px] select-none !tracking-[1.17045px] cursor-pointer !mb-[40px] text-right" 
                                                    style={{ 
                                                        fontFamily: "Space Mono",
                                                        color: currentProject === index
                                                        ? theme.palette.text.primary
                                                        : alpha(theme.palette.text.primary, 0.2)
                                                    }}
                                                >
                                                    <span className={currentProject == index ? "inline-block capitalize" : "hidden"}>{datum.name} -</span> 0{index + 1}
                                                </p>
                                            </li>
                                        );
                                    })}
                                </ul>
                            </nav>
                        </div>
                        <div 
                            onClick={() => {
                                setIsFading(true);
                                setTimeout(() => {
                                    setCurrentProject((currentProject + 1) % projects.length);
                                    setIsFading(false);
                                }, 150);
                            }}
                            className="float-right cursor-pointer hover:animate-bounce hidden lg:block"
                        >
                            <DownArrow/>
                        </div>
                        <div className="flex items-center justify-between text-center max-w-107 mx-auto lg:hidden">
                            <IconButton 
                                onClick={() => {
                                    setIsFading(true);
                                    setTimeout(() => {
                                    setCurrentProject((currentProject - 1 + projects.length) % projects.length);
                                    setIsFading(false);
                                    }, 150);
                                }}
                                aria-label="previous button"
                            >
                                <ChevronLeft/>
                            </IconButton>
                            <p className="capitalize w-max text-2xl md:text-3xl" style={{fontFamily: "Space Mono"}}>{projects[currentProject].name}</p>
                            <IconButton 
                                onClick={() => {
                                    setIsFading(true);
                                    setTimeout(() => {
                                        setCurrentProject((currentProject + 1) % projects.length);
                                        setIsFading(false);
                                    }, 150);
                                }}
                                aria-label="next button"
                            >
                                <ChevronRight/>
                            </IconButton>
                        </div>
                    </div>
                </div>
                <div className="flex justify-between gap-6 mt-8 items-center flex-col-reverse md:flex-row lg:!mt-[45px]">
                    <div className="w-[223.18px] space-y-2!">
                        <p 
                            className="text-center md:text-start"
                            style={{ color: alpha(theme.palette.text.primary, 0.6) }}
                        >
                            Our Developers:
                        </p>
                        <img src="/img/Section2/developers.webp" alt="developers" />
                    </div>
                    <div className="w-[305px] flex flex-col items-center text-center gap-6 md:gap-6 md:text-start md:items-start">
                        <p>{projects[currentProject].description}</p>
                        <div>
                            <BtnMore />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}