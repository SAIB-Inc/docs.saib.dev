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

                <div className="grid grid-cols-1 grid-rows-2 gap-x-[12px] gap-y-[11px] mt-[65px] sm:grid-cols-12">
                    <img src="/img/Section8/frederik_gregaard.webp" alt="Frederik Gregaard" className="w-full rounded-[24px] sm:h-[371px] sm:object-cover sm:object-[center_-20px] sm:col-span-6"/>
                    <img src="/img/Section8/philip_disarro_jonathan_rodriguez.webp" alt="Phil and Jonathan " className="w-full rounded-[24px] sm:h-[371px] sm:object-cover sm:object-[center_-100px] sm:col-span-6"/>
                    <img src="/img/Section8/hongjing_k.webp" alt="Jingles" className="w-full h-full rounded-[24px] sm:col-span-4 sm:object-cover lg:h-[371px] lg:object-[center_-20px]"/>
                    <img src="/img/Section8/cardano_girls.webp" alt="Lily and Lenna" className="w-full h-full rounded-[24px] sm:col-span-4 sm:object-cover lg:h-[371px] lg:object-[center_-20px]"/>
                    <img src="/img/Section8/diego_mac.webp" alt="Diego" className="w-full h-full rounded-[24px] sm:col-span-4 sm:object-cover lg:h-[371px] lg:object-[center_-20px]"/>
                </div>
            </div>
        </section>
    )
};