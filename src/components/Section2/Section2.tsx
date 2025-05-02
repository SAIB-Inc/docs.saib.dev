import { ReactNode, useState } from "react";
import BtnMore from "../Shared/Buttons/BtnMore/BtnMore";
import { alpha, useTheme } from "@mui/material";
import { useColorMode } from "@docusaurus/theme-common";
import DownArrow from "../../icons/DownArrow.svg";

export default function Section2(): ReactNode {

    const theme = useTheme();
    const { colorMode } = useColorMode()

    const [currentProject, setCurrentProject] = useState(0);
    const [isFading, setIsFading] = useState(false);

    const projects = [
        {
            name: "chrysalis",
            logo: "/img/Section2/Logos/chrysalis.webp",
            class: "top-76"
        },
        {
            name: "argus",
            logo: "/img/Section2/Logos/argus.webp",
            class: "top-68"
        },
        {
            name: "aegis",
            logo: "/img/Section2/Logos/aegis.webp",
            class: "top-70"
        },
        {
            name: "futura",
            logo: "/img/Section2/Logos/futura.webp",
            class: "top-76"
        },
        {
            name: "razor",
            logo: "/img/Section2/Logos/razor.webp", 
            class: "top-50"
        }
    ];

    return (
        <section id="section-2" className="h-[1076px] w-screen">
            <div className="container flex flex-col h-full">
                <div className="flex h-[calc(100%-230px)] justify-between">
                    <div className="!mt-[104px]">
                        <h1 className="!text-[56px] font-semibold leading-[53.76px]! tracking-[0.56px]">
                            <span>Check Out <br />The </span>
                            <span style={{color: theme.palette.text.secondary}} >Latest <br />Resources</span>
                        </h1>
                    </div>
                    <div className="flex flex-col justify-end relative">
                        <div className={`absolute inset-x-0 flex justify-center ${projects[currentProject].class}`}>
                            <img
                                src={projects[currentProject].logo}
                                alt="razor logo"
                                className={`transition-opacity duration-150 ${isFading ? "opacity-0" : "opacity-100"} animate-bounce3`}
                            />
                        </div>
                        <img src={colorMode === 'dark' ? "/img/Section2/base_ellipse_dark.webp" : "/img/Section2/base_ellipse_light.webp"} alt="base ellipse" />
                    </div>
                    <div className="w-[305px] !mt-[102.22px]">
                        <div className="flex flex-col justify-end pr-[6px]">
                            <nav>
                                <ul className="!m-0 !p-0">
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
                            className="float-right cursor-pointer hover:animate-bounce"
                        >
                            <DownArrow/>
                        </div>
                    </div>
                </div>
                <div className="!mt-[45px] flex justify-between">
                    <div className="w-[223.18px]">
                        <p style={{ color: alpha(theme.palette.text.primary, 0.6) }}>
                            /900k Developer Join
                        </p>
                        <img src="/img/Section2/developers.webp" alt="developers" />
                    </div>

                    <div className="w-[305px] flex gap-1 flex-col">
                        <div>
                        <p style={{ color: theme.palette.text.disabled }}>The .NET Cardano Node</p>
                        </div>
                        <div>
                            <BtnMore />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}