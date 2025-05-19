import { ReactNode, useState } from "react";
import BtnMore from "../Shared/Buttons/BtnMore/BtnMore";
import { alpha, ButtonBase, Icon, IconButton, useTheme } from "@mui/material";
import { useColorMode } from "@docusaurus/theme-common";
import DownArrow from "../../icons/DownArrow.svg";
import AvatarButton from "./Avatar";
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
            description: "Chrysalis is the core building-block library for .NET Cardano development.",
            link: "/docs/chrysalis/overview",
            class: "w-78 -top-44 sm:w-100 sm:-top-49 md:w-120 md:-top-59 lg:w-120 lg:top-78 xl:top-60 xl:w-full 2xl:top-80"
        },
        {
            name: "argus",
            logo: "/img/Section2/Logos/argus.webp",
            description: "Argus is the Cardano Blockchain Indexer for .NET",
            link: "/docs/argus/intro",
            class: "-top-48 w-62 sm:w-72 sm:-top-52 md:w-92 md:-top-68 lg:w-110 lg:top-56 xl:w-full xl:top-38 2xl:top-56"
        },
        {
            name: "razor",
            logo: "/img/Section2/Logos/razor.webp",
            description: "Razor is our fully open-source .NET impementation of a Cardano Node",
            link: "/docs/razor/overview",
            class: "-top-52 w-38 sm:w-40 sm:-top-52 md:w-56 md:-top-74 lg:w-64 lg:top-50 xl:w-full xl:top-20 2xl:top-40"
        },
        {
            name: "COMP",
            logo: "/img/Section2/Logos/comp.webp",
            description: "Cardano Open Metadata Project (COMP) sets metadata standards for the Cardano ecosystem.",
            link: "/docs/comp/overview",
            class: "-top-45 w-62 sm:w-72 sm:-top-49 md:w-82 md:-top-53 lg:w-110 lg:top-62 xl:w-full xl:top-50 2xl:top-70"
        },
        {
            name: "futura",
            logo: colorMode === "dark" ? "/img/Section2/Logos/futura_dark.webp" : "/img/Section2/Logos/futura_light.webp",
            description: "Futura is the DSL that compiles UPLC - Cardano smart contract development on .NET.",
            link: "/docs/futura/overview",
            class: "-top-45 w-48 sm:w-52 sm:-top-48 md:w-72 md:-top-70 lg:w-80 lg:top-58 xl:w-full xl:top-44 2xl:top-64"
        }
    ];

    const developerList = [
        {
            src: "/img/Section2/Avatars/cait.webp",
            alt: "caitlin",
            link: "https://github.com/CML90"
        },
        {
            src: "/img/Section2/Avatars/kief.webp",
            alt: "keef",
            link: "https://github.com/KeeeeEf"
        },
        {
            src: "/img/Section2/Avatars/hermi.webp",
            alt: "hermi",
            link: "https://github.com/Herminigildo-Timtim"
        },
        {
            src: "/img/Section2/Avatars/lance.webp",
            alt: "lance",
            link: "https://github.com/lancevincentsalera"
        },
        {
            src: "/img/Section2/Avatars/windz.webp",
            alt: "windz",
            link: "https://github.com/WendellMorTamayo"
        },
        {
            src: "/img/Section2/Avatars/tan.webp",
            alt: "tan",
            link: "https://github.com/christiangantuangco"
        },
        {
            src: "/img/Section2/Avatars/rico.webp",
            alt: "rico",
            link: "https://github.com/ricomiles"
        },
        {
            src: "/img/Section2/Avatars/rj.webp",
            alt: "rj",
            link: "https://github.com/rjlacanlaled"
        },
        {
            src: "/img/Section2/Avatars/clark.webp",
            alt: "clarkitlin",
            link: "https://github.com/Mercurial"
        }
    ]

    return (
        <section id="section-2" style={{ backgroundColor: theme.palette.background.default }} className="w-screen pb-20 lg:pb-0 lg:h-242 xl:h-[1076px]">
            <div className="container flex flex-col h-full">
                <div className="flex justify-between flex-col lg:flex-row lg:h-[calc(100%-230px)] xl:h-[calc(100%-382px)] 2xl:h-[calc(100%-300px)]">
                    <div className="!mt-18 md:!mt-26">
                        <h1 className="font-semibold tracking-[0.56px] !text-3xl text-center sm:!text-5xl md:!text-[56px] lg:text-start lg:!text-[40px] xl:!text-[40px] xl:w-72 2xl:w-96  2xl:!text-[40px]">
                            <span>Check Out </span><br className="hidden lg:block xl:hidden"/>
                            <span>The </span>
                            <span style={{ color: theme.palette.text.secondary }} >Latest Resources</span>
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
                            className="w-83 sm:w-100 md:w-120 lg:w-auto"
                        />
                    </div>
                    <div className="!mt-[40px] lg:!mt-[102.22px] lg:w-116 xl:w-[360px] 2xl:w-110">
                        <div className="flex flex-col justify-end pr-[6px]">
                            <nav>
                                <ul className="!m-0 !p-0 hidden lg:block">
                                    {projects.map((datum, index) => {
                                        return (
                                            <li
                                                key={`${datum.name}-${index}`}
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
                                                        fontFamily: "monospace",
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
                            <DownArrow />
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
                                sx={{
                                    color: theme.palette.text.primary
                                }}
                            >
                                <ChevronLeft />
                            </IconButton>
                            <p className="capitalize w-max text-2xl md:text-3xl" style={{ fontFamily: "Space Mono" }}>{projects[currentProject].name}</p>
                            <IconButton
                                onClick={() => {
                                    setIsFading(true);
                                    setTimeout(() => {
                                        setCurrentProject((currentProject + 1) % projects.length);
                                        setIsFading(false);
                                    }, 150);
                                }}
                                aria-label="next button"
                                sx={{
                                    color: theme.palette.text.primary
                                }}
                            >
                                <ChevronRight />
                            </IconButton>
                        </div>
                    </div>
                </div>
                <div className="flex justify-between gap-6 mt-8 items-center flex-col-reverse md:items-end md:flex-row lg:!mt-[45px]">
                    <div className="w-full relative overflow-hidden">
                        <p
                            className="text-center md:text-start"
                            style={{ color: alpha(theme.palette.text.primary, 0.6) }}
                        >
                            Our Developers:
                        </p>
                        <div className="flex justify-center items-center relative left-16 top-1 sm:left-15 md:static md:justify-start">
                            {developerList.map((datum, index) => (
                                <AvatarButton key={`${datum.alt}-${index}`} datum={datum} index={index} />
                            ))}
                        </div>
                    </div>
                    <div className="w-[305px] flex flex-col items-center text-center gap-6 md:w-[465px] md:text-end md:items-end md:gap-4 lg:gap-6">
                        <p className="min-h-18">{projects[currentProject].description}</p>
                        <div>
                            <BtnMore 
                                LinkComponent='a' href={projects[currentProject].link}
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
                </div>
            </div>
        </section >
    )
}