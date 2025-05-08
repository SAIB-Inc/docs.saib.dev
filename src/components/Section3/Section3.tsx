import { ReactNode } from "react";
import BtnMore from "../Shared/Buttons/BtnMore/BtnMore";
import { useTheme } from "@mui/material";
import { useColorMode } from "@docusaurus/theme-common";

export default function Section3(): ReactNode {

    const theme = useTheme();
    const { colorMode } = useColorMode();

    return (
        <section style={{ backgroundColor: theme.palette.background.default }} className={`bg-lines relative h-[1088.02px] flex flex-col items-center bg-center w-screen bg-cover ${colorMode === 'dark' ? 'bg-[url(/img/Section3/background_dark.webp)]' : 'bg-[url(/img/Section3/background_light.webp)]'}`}>
            <div className="container flex flex-col justify-center items-center">

                <div className="text-center h-[64px] flex flex-row items-center mb-[178px] mt-[36px]">
                    <div>
                        <img alt="Buriza" src={colorMode === 'dark' ? '/img/Section3/buriza_dark.webp' : '/img/Section3/buriza_light.webp'} />
                    </div>
                    <div className="ml-[80px]">
                        <img src="/img/Section3/arrow.webp" />
                    </div>

                    <div className="ml-[40px] mr-[40px] flex items-center">
                        <p className="text-[24px] leading-[34.8px] font-semibold">Used By</p>
                    </div>

                    <div>
                        <img src="/img/Section3/arrow.webp" className="scale-x-[-1] mr-[80px]" />
                    </div>
                    <div>
                        <img src='/img/Section3/levvy.webp' />
                    </div>
                </div>

                <div>
                    <div className="mb-[64.94px] flex flex-row">
                        <div className="w-full h-[108px] flex flex-row items-center justify-center">
                            <h1>
                                <span
                                    style={{color: theme.palette.text.secondary}}
                                    className="text-[56px] font-semibold leading-[53.76px]"
                                >
                                    Argus
                                </span>
                                <span className="text-[56px] font-semibold leading-[53.76px]"> - The .NET Cardano Indexing Framework</span>
                            </h1>
                        </div>

                        <div className="w-[557px] flex flex-col items-end">
                            <div className="w-[304.95px] h-[60px] mt-[2px] mb-[20.06px] flex justify-end" >
                                <p
                                    style={{color: theme.palette.text.disabled}}
                                    className="text-[16px] font-normal leading-[20.48px] "
                                >
                                    Seamlessly Connecting Cardano And .NET For A Fast, Productive Developer Experience
                                </p>
                            </div>

                            <div>
                                <BtnMore />
                            </div>
                        </div>
                    </div>

                    <div>
                        <img src={colorMode === 'dark' ? '/img/Section3/code_snippet_dark.webp' : '/img/Section3/code_snippet_light.webp'} />
                    </div>
                </div>
            </div>
            <div className="absolute -bottom-118 -z-10">
                <img src={colorMode === 'dark' ? '/img/Section3/background_connector_dark.webp' : '/img/Section3/background_connector_light.webp'} alt="background connector"/>
            </div>
        </section>
    )
};
