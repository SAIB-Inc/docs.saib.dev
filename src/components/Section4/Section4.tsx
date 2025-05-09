import { Button, IconButton, Paper, Tooltip, useTheme } from "@mui/material";
import { ReactNode, useRef } from "react";
import BtnMore from "../Shared/Buttons/BtnMore/BtnMore";
import RightArrow from "../../icons/RightArrow.svg";
import { useColorMode } from "@docusaurus/theme-common";
import CodeBlock from "../Section6/CodeBlock";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';


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
        <section style={{ backgroundColor: theme.palette.background.default }} className="h-[952.98px] flex flex-col items-center w-screen">
            <div className="container mx-auto">
                <div className="relative my-16 pt-40">
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
                        <Paper
                            elevation={1}
                            sx={{
                                borderRadius: '5.5px',
                                position: 'relative',
                                width: '500px',
                                height: '318px',
                            }}>
                            <div style={{color: theme.palette.grey[200]}}>
                                <div className="flex justify-between items-center">
                                    <p style={{color: theme.palette.text.primary }} className="!text-sm !ml-[10px]">BlockReducer.cs</p>
                                    <Tooltip title="Copy code">
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
                                <div className="rounded-b-[5px] w-[100] h-[300px] overflow-hidden">
                                    <CodeBlock
                                        editorRef={editorRef}
                                    />
                                </div>
                            </div>

                        </Paper>
                    </div>
                </div>
                <div className="max-w-screen-xl w-full flex justify-between">
                    <div>
                        <div >
                            <p
                                style={{ color: theme.palette.text.disabled }}
                                className="text-[18px] leading-[23.04px]"
                            >
                                Argus brings Cardano blockchain data seamlessly<br />
                                into the .NET environment, empowering developers<br />
                                to efficiently query and access data using familiar<br />
                                .NET languages like C#.
                            </p>
                        </div>

                        <div className="mt-[32px]">
                            <BtnMore />
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
                            <Button sx={{ color: theme.palette.grey[50] }} variant="contained" endIcon={<RightArrow />}>View In Catalyst</Button>
                        </div>
                    </div>
                </div>
            </div >
        </section >
    )
};
