import { useColorMode } from "@docusaurus/theme-common";
import { ClassNames } from "@emotion/react";
import { useTheme } from "@mui/material";
import { ReactNode, useState } from "react";

export default function Section8(): ReactNode {
    const theme = useTheme();
    const { colorMode } = useColorMode();
    const [selectedItem, setSelectedItem] = useState(0);

    const imageList = [
        {
            alt: "Da Nang Group Photo",
            src: "/img/Section8/danang_buidler.webp",
            ClassNames: "col-span-6 w-full h-[371px] rounded-[24px] object-cover"
        },
        {
            alt: "Panel",
            src: "/img/Section8/panel_tooling.webp",
            ClassNames: "col-span-6 w-full h-[371px] rounded-[24px] object-cover"
        },
        {
            alt: "Da Nang Buidler Fest",
            src: "/img/Section8/danang_discussions.webp",
            ClassNames: "col-span-4 w-full h-[371px] rounded-[24px] object-cover"
        },
        {
            alt: "Open Spaces",
            src: "/img/Section8/open_spaces.webp",
            ClassNames: "col-span-4 w-full h-[371px] rounded-[24px] object-cover"
        },
        {
            alt: "Guests",
            src: "/img/Section8/buidler_guests.webp",
            ClassNames: "col-span-4 w-full h-[371px] rounded-[24px] object-cover"
        }
    ]

    return(
        <section style={{ backgroundColor:theme.palette.background.default }} className="bg-[url(/img/Section8/eighth_background.webp)] bg-cover md:!pt-[137px] md:h-[1113px]">
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
                    <p className="!mb-0 !text-base lg:!text-xl lg:leading-[25.6px]">
                        We’re proud to be part of the Cardano community<br  className="hidden lg:block"/>
                        —constantly building, collaborating, and <br className="hidden lg:block"/>
                        connecting with others who share the vision.
                    </p>
                </div>

                <div className="flex overflow-hidden grid-cols-12 grid-rows-2 gap-x-[12px] gap-y-[11px] mt-[65px] md:grid">
                    {imageList.map((datum) => {
                        return(
                            <div
                                id={datum.alt}
                                style={{
                                    transform: `translateX(calc(-${selectedItem * 100}% - ${selectedItem * 11}px))`,
                                    transition: 'transform 0.5s ease'
                                }}
                                className={`min-w-full ` + datum.ClassNames}
                            >
                                <img
                                    src={datum.src}
                                    alt={datum.alt}
                                    className={datum.ClassNames}
                                />
                            </div>
                        )
                    })}
                </div>
                <div className="flex gap-2 items-center mt-6 md:hidden">
                    {imageList.map((_, i) => (
                        <div 
                            key={i}
                            onClick={() => {
                                setSelectedItem(i)
                            }}
                            style={{
                                backgroundColor: selectedItem === i ? theme.palette.primary.main : theme.palette.grey[700],
                                width: `calc(${100/imageList.length}%)`
                            }}
                            className="h-2 rounded-full"
                        />
                    ))}
                </div>
            </div>
        </section>
    )
};