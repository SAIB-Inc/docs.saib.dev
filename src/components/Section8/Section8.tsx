import { useColorMode } from "@docusaurus/theme-common";
import { useTheme } from "@mui/material";
import { ReactNode } from "react";

export default function Section8(): ReactNode {
    const theme = useTheme();
    const { colorMode } = useColorMode();

    return(
        <section className="bg-[url(/img/Section8/eighth_background.webp)] w-screen h-[1113px] bg-cover pt-[137px]">
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
                    <p className="!text-[20px] leading-[25.6px] !mb-0 capitalize">
                        We’re proud to be part of the Cardano community<br />
                        —constantly building, collaborating, and <br />
                        connecting with others who share the vision.
                    </p>
                </div>

                <div className="grid grid-cols-12 grid-rows-2 gap-x-[12px] gap-y-[11px] mt-[65px]">
                    <img src="/img/Section8/frederik_gregaard.webp" alt="Frederik Gregaard" className="col-span-6 w-full h-[371px] rounded-[24px] object-cover object-[center_-20px]"/>
                    <img src="/img/Section8/philip_disarro_jonathan_rodriguez.webp" alt="Phil and Jonathan " className="col-span-6 w-full h-[371px] rounded-[24px] object-cover object-[center_-100px]"/>

                    <img src="/img/Section8/hongjing_k.webp" alt="Jingles" className="col-span-4 w-full h-[371px] rounded-[24px] object-cover object-[center_-20px]"/>
                    <img src="/img/Section8/cardano_girls.webp" alt="Lily and Lenna" className="col-span-4 w-full h-[371px] rounded-[24px] object-cover object-[center_-20px]"/>
                    <img src="/img/Section8/diego_mac.webp" alt="Diego" className="col-span-4 w-full h-[371px] rounded-[24px] object-cover object-[center_-20px]"/>
                </div>
            </div>
        </section>
    )
};