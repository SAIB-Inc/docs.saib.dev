import { useColorMode } from "@docusaurus/theme-common";
import { useTheme } from "@mui/material";
import { ReactNode } from "react";

export default function Section8(): ReactNode {
    const theme = useTheme();
    const { colorMode } = useColorMode();

    return(
        <section className="bg-[url(/img/Section8/eighth_background.webp)] bg-cover pt-20 md:pt-[137px] md:h-[1113px]">
            <div className="container">
                <div className="flex items-center flex-col justify-center text-center lg:text-start lg:justify-between lg:flex-row">
                    <h1 className="!text-3xl sm:!text-5xl md:!text-[56px] md:leading-[54.88px]">
                        <span>
                            Let's&nbsp;
                        </span>
                        <span style={{ color: theme.palette.text.secondary }}>
                            Build Together
                        </span>
                    </h1>
                    <p className="!mb-0 capitalize !text-base lg:!text-xl lg:leading-[25.6px]">
                        We’re proud to be part of the Cardano community<br  className="hidden lg:block"/>
                        —constantly building, collaborating, and <br className="hidden lg:block"/>
                        connecting with others who share the vision.
                    </p>
                </div>

                <div className="grid grid-cols-12 grid-rows-2 gap-x-[12px] gap-y-[11px] mt-[65px]">
                    <img src="/img/Section8/danang_buidler.webp" alt="Da Nang Group Photo" className="col-span-6 w-full h-[371px] rounded-[24px] object-cover"/>
                    <img src="/img/Section8/panel_tooling.webp" alt="Panel" className="col-span-6 w-full h-[371px] rounded-[24px] object-cover"/>
                    <img src="/img/Section8/danang_discussions.webp" alt="Da Nang Buidler Fest" className="col-span-4 w-full h-[371px] rounded-[24px] object-cover"/>
                    <img src="/img/Section8/open_spaces.webp" alt="Open Spaces" className="col-span-4 w-full h-[371px] rounded-[24px] object-cover"/>
                    <img src="/img/Section8/buidler_guests.webp" alt="Guests" className="col-span-4 w-full h-[371px] rounded-[24px] object-cover"/>
                    
                    
                </div>
            </div>
        </section>
    )
};