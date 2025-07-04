import { alpha, Button, IconButton, Paper, Tooltip, useTheme } from "@mui/material";
import { ReactNode, useRef } from "react";
import BtnMore from "../Shared/Buttons/BtnMore/BtnMore";
import ExternalLink from "../Shared/Links/ExternalLink/ExternalLink";
import { useColorMode } from "@docusaurus/theme-common";
import CodeBlock from "../Section6/CodeBlock";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Section4Wizard from "@site/static/img/Section4/wizard";


export default function Section4(): ReactNode {
    const theme = useTheme();
    const { colorMode } = useColorMode();

    const editorRef = useRef(null);

    const copyToClipboard = () => {
        const editor = editorRef.current;
        if (editor) {
            const value = editor.getValue();
            navigator.clipboard.writeText(value)
                .then(() => console.log('Copied!'))
                .catch((err) => console.error('Copy failed', err));
        }
    };

    return (
        <section id="section-4" style={{ backgroundColor: theme.palette.background.default }} className="flex flex-col relative overflow-hidden items-center w-screen pt-2 pb-15 sm:pb-auto sm:pt-0 md:overflow-visible lg:h-[952.98px]">
            <div className="absolute -top-2 hidden xl:block">
                <img src={colorMode === 'dark' ? '/img/Section3/background_connector_dark.webp' : '/img/Section3/background_connector_light.webp'} alt="background connector"/>
            </div>
            <div className="container mx-auto !sm:mt-15 !md:mt-0">
                <div className="relative sm:my-16 pt-20 md:pt-40">
                    <div
                        style={{ backgroundColor: theme.palette.primary.main }}
                        className="rounded-full flex items-center justify-center  absolute left-1/2 -translate-x-1/2 top-0 size-22 sm:size-26 md:top-20"
                    >
                        <img src="/img/Section4/cardano_logo.svg" alt="cardano logo" />
                    </div>

                    <div className="absolute right-7 z-10 w-16 -top-2 sm:hidden sm:-right-7 sm:w-auto sm:-top-14 md:right-0 md:top-6">
                        <Section4Wizard className="!text-[110px]"/>
                    </div>
                    <div className="hidden absolute right-7 z-10 w-16 -top-2 sm:block sm:-right-7 sm:w-auto sm:-top-14 md:right-0 md:top-6">
                        <Section4Wizard className="sm:!text-[163px]"/>
                    </div>
                    <div className="relative overflow-x-hidden bg-cover bg-center p-4 flex justify-between flex-col items-center bg-[url(/img/Section4/purple_bg_mobile.svg)] rounded-[24px] gap-6 md:gap-2 lg:rounded-[48px] md:h-100 md:flex-row md:px-10 sm:bg-[url(/img/Section4/purple_bg.svg)] lg:h-[498px] lg:px-12">
                        <div className="z-10 mt-14 w-full md:mt-0 lg:w-[661px]">
                            <h1 style={{color: theme.palette.grey[50]}} className="text-3xl !mb-0 min-[345px]:!text-5xl text-center md:text-start md:text-4xl lg:!text-[64px] lg:!leading-[60px]">
                                <span>
                                    Streamline <br/>
                                </span>
                                <span style={{ color: theme.palette.primary.light }}>
                                    Cardano <br className="hidden md:block"/>
                                    Blockchain <br />
                                </span>
                                <span>
                                    Data Processing
                                </span>
                            </h1>
                        </div>
                        <div 
                            style={{
                                backgroundColor: theme.palette.grey[300]
                            }}
                            className="w-full h-86 relative md:!h-68 lg:!w-155 lg:!h-88 2xl:!w-134 2xl:!h-89 !p-4 rounded-3xl [&_.monaco-scrollable-element_.vertical]:!w-[6px] [&_.monaco-scrollable-element_.decorationsOverviewRuler]:!w-[6px] [&_.monaco-scrollable-element_.horizontal]:!h-[6px]"
                        >
                            <div 
                                style={{backgroundColor: alpha(theme.palette.grey[300], 0.8)}}
                                className="absolute bottom-2 right-2 z-40 rounded-full"
                            >
                            <Tooltip
                                title="Copy code"
                                componentsProps={{
                                    tooltip: {
                                    sx: {
                                        backgroundColor: theme.palette.background.paper,
                                        color: theme.palette.text.primary,
                                    },
                                    },
                                }}
                                >
                                    <IconButton
                                        className="self-end"
                                        onClick={copyToClipboard}
                                        sx={{
                                            width: '17px',
                                            height: '17px',
                                            margin: '6px 8px',
                                            opacity: 0.6, 
                                            '&:hover': {
                                                opacity: 1,
                                                backgroundColor: "transparent"
                                            },
                                        }}
                                    >
                                        <ContentCopyIcon 
                                            sx={{ 
                                                color: theme.palette.primary.contrastText,
                                                width: '18px',
                                                height: '18px',
                                            }} />
                                    </IconButton>
                                </Tooltip>
                            </div>
                            <CodeBlock
                                editorRef={editorRef}
                            />
                        </div>
                    </div>
                </div>
                <div className="max-w-screen-xl w-full flex justify-between flex-col md:flex-row">
                    <div className="mt-8 lg:mt-0">
                        <div>
                            <p
                                className="leading-[23.04px] !text-base text-center md:text-start lg:!text-lg"
                            >
                                Argus brings Cardano blockchain data seamlessly <br className="hidden md:block"/>
                                into the .NET environment, empowering developers <br className="hidden md:block"/>
                                to efficiently query and access data using familiar <br className="hidden md:block"/>
                                .NET languages like C#. </p>
                        </div>
                        <div className="mt-[32px] flex items-center justify-center md:block">
                            <BtnMore
                                LinkComponent='a' href="/docs/argus/intro"
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
                    <div className="mt-8 flex flex-col gap-4 justify-between items-center md:items-end lg:mt-0 lg:gap-0">
                        <p
                            className="md:hidden"
                        >
                            Argus is a proud product of...
                        </p>
                        <div className="w-65 lg:w-74">
                            <img
                                src={colorMode === 'dark' ? '/img/Section4/catalyst_dark.webp' : '/img/Section4/catalyst_light.webp'}
                                alt="catalyst"
                            />
                        </div>
                        <div className="flex mt-3 lg:mt-[43.19px] lg:justify-end">
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
