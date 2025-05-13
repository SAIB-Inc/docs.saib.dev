import { ReactNode, useState } from "react";
import BtnMore from "../Shared/Buttons/BtnMore/BtnMore";
import { alpha, useTheme } from "@mui/material";
import { useColorMode } from "@docusaurus/theme-common";
import DownArrow from "../../icons/DownArrow.svg";
import AvatarButton from "./Avatar";

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
            class: "top-76"
        },
        {
            name: "argus",
            logo: "/img/Section2/Logos/argus.webp",
            description: "Argus is the Cardano Blockchain Indexer for .NET",
            link: "/docs/argus/intro",
            class: "top-68"
        },
        {
            name: "comp",
            logo: "/img/Section2/Logos/comp.webp",
            description: "Cardano Open Metadata Project (COMP) sets metadata standards for the Cardano ecosystem.",
            link: "/docs/comp/overview",
            class: "top-70"
        },
        {
            name: "futura",
            logo: colorMode === "dark" ? "/img/Section2/Logos/futura_dark.webp" : "/img/Section2/Logos/futura_light.webp",
            description: "Futura is the DSL that compiles UPLC - Cardano smart contract development on .NET.",
            link: "/docs/futura/overview",
            class: "top-70"
        },
        {
            name: "razor",
            logo: "/img/Section2/Logos/razor.webp",
            description: "Razor is our fully open-source .NET implementation of a Cardano Node",
            link: "/docs/razor/overview",
            class: "top-50"
        }
    ];

    return (
        <section id="section-2" style={{ backgroundColor: theme.palette.background.default }} className="h-[1076px] w-screen">
            <div className="container flex flex-col h-full">
                <div className="flex h-[calc(100%-230px)] justify-between">
                    <div className="!mt-[104px]">
                        <h1 className="!text-[56px] font-semibold leading-[53.76px]! tracking-[0.56px]">
                            <span>Check Out <br />The </span>
                            <span style={{ color: theme.palette.text.secondary }} >Latest <br />Resources</span>
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
                                    {projects.map((datum, index) => {
                                        return (
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
                            <DownArrow />
                        </div>
                    </div>
                </div>
                <div className="!mt-[45px] flex justify-between">
                    <div className="w-[223.18px]">
                        <div className="mb-5">
                            <p style={{ color: alpha(theme.palette.text.primary, 0.6) }}>
                                Our Developers:
                            </p>
                        </div>
                        <div className="absolute">
                            <AvatarButton src="/img/Section2/Avatars/cait.webp" top="0" left="0px" link="https://github.com/orgs/SAIB-Inc/people/CML90" scale={0.95}/>
                            <AvatarButton src="/img/Section2/Avatars/kief.webp" top="0" left="27px" link="https://github.com/orgs/SAIB-Inc/people/KeeeeEf" />
                            <AvatarButton src="/img/Section2/Avatars/hermi.webp" top="0" left="55px" link="https://github.com/orgs/SAIB-Inc/people/Herminigildo-Timtim" />
                            <AvatarButton src="/img/Section2/Avatars/lance.webp" top="0" left="88px" link="https://github.com/orgs/SAIB-Inc/people/lancevincentsalera" scale={1.05}/>
                            <AvatarButton src="/img/Section2/Avatars/windz.webp" top="0" left="117px" link="https://github.com/orgs/SAIB-Inc/people/WendellMorTamayo" />
                            <AvatarButton src="/img/Section2/Avatars/tan.webp" top="0" left="153px" link="https://github.com/christiangantuangco" />
                            <AvatarButton src="/img/Section2/Avatars/rico.webp" top="0" left="187px" link="https://github.com/orgs/SAIB-Inc/people/ricomiles" />
                            <AvatarButton src="/img/Section2/Avatars/rj.webp" top="0" left="217px" link="https://github.com/orgs/SAIB-Inc/people/rjlacanlaled"/>
                            <AvatarButton src="/img/Section2/Avatars/clark.webp" top="0" left="248px" link="https://github.com/orgs/SAIB-Inc/people/Mercurial" scale={1.08} />
                        </div>

                    </div>

                    <div className="w-[305px] flex gap-[6px] flex-col">
                        <div>
                            <p style={{ color: theme.palette.text.disabled }}>
                                Razor is our fully open-source .NET <br />
                                implementation of a Cardano Node
                            </p>
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