import { Button, useTheme } from "@mui/material";
import { ReactNode } from "react";
import BtnMore from "../Shared/Buttons/BtnMore/BtnMore";
import ExternalLink from "../Shared/Links/ExternalLink/ExternalLink";
import { useColorMode } from "@docusaurus/theme-common";


export default function Section4(): ReactNode {
    const theme = useTheme();
    const { colorMode } = useColorMode();

    return (
        <section id="section-4" style={{ backgroundColor: theme.palette.background.default }} className="h-[952.98px] flex flex-col items-center w-screen">
            <div className="container mx-auto">
                <div className="relative my-16 pt-40 flex flex-col">
                    <div
                        style={{ backgroundColor: theme.palette.primary.main }}
                        className="rounded-full flex items-center justify-center size-26 absolute top-20 left-1/2 -translate-x-1/2"
                    >
                        <img src="/img/Section4/cardano_logo.svg" alt="cardano logo" />
                    </div>

                    <div className="absolute right-0 top-6 z-10">
                        <img src="/img/Section4/wizard.svg" alt="saib wizard" />
                    </div>
                    <div className="relative h-[498px] overflow-hidden bg-[url(/img/Section4/purple_bg.svg)] px-12 flex items-center justify-between">
                        <div className="bg-[url(/img/Section4/mesh.webp)] absolute left-0 w-full h-full bg-cover" />
                        <div className="w-[661px]">
                            <h1 style={{ color: theme.palette.grey[50] }} className="text-left !text-[64px] !leading-[60px]">
                                <span>
                                    Streamline <br />
                                </span>
                                <span style={{ color: theme.palette.primary.light }}>
                                    Cardano <br />
                                    Blockchain <br />
                                </span>
                                <span>
                                    Data Processing
                                </span>
                            </h1>
                        </div>
                        <div className="w-88">
                            <img src="/img/Section4/code_snippet.webp" alt="code snippet" />
                        </div>
                    </div>
                </div>
                <div className="max-w-screen-xl w-full flex justify-between">
                    <div>
                        <div >
                            <p
                                style={{ color: theme.palette.text.disabled }}
                                className="capitalize text-[18px] leading-[23.04px]"
                            >
                                Argus brings Cardano blockchain data seamlessly <br />
                                into the .NET environment, empowering developers <br />
                                to efficiently query and access data using familiar <br />
                                .NET languages like C#. </p>
                        </div>

                        <div className="mt-[32px]">
                            <BtnMore
                                LinkComponent='a' href="http://localhost:3000/docs/argus/intro"
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
                    <div>
                        <div className="w-74">
                            <img
                                src={colorMode === 'dark' ? '/img/Section4/catalyst_dark.webp' : '/img/Section4/catalyst_light.webp'}
                                alt="catalyst"
                            />
                        </div>
                        <div className="mt-[43.19px] flex justify-end">
                            <BtnMore
                                LinkComponent={ExternalLink} href="https://milestones.projectcatalyst.io/projects/1200072"
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
                            >
                                View in Catalyst
                            </BtnMore>
                        </div>
                    </div >
                </div >
            </div >

        </section >
    )
};
