import { useColorMode } from "@docusaurus/theme-common";
import { useTheme } from "@mui/material";
import { ReactNode } from "react";

export default function Section8(): ReactNode {
    const theme = useTheme();
    const { colorMode } = useColorMode();

    return(
        <section style={{ backgroundColor: theme.palette.background.default }} className="bg-[url(/img/Section8/eighth_background.webp)] w-screen h-[1113px] bg-cover pt-[137px]">
            <div className="container">
                <div className="flex justify-between items-center">
                    <h1 className="!text-[56px] leading-[54.88px] !mb-0">
                        <span>
                            Let's&nbsp;
                        </span>
                        <span style={{ color: theme.palette.text.secondary }}>
                            Build Together
                        </span>
                    </h1>
                    <p className="!text-[20px] leading-[25.6px] !mb-0">
                    We’re proud to be part of the Cardano<br />
                    community— constantly building, collaborating, <br />
                    and connecting with others who share the vision.
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