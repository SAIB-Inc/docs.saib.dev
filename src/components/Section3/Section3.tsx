import { Button } from "@mui/material";
import { ReactNode } from "react";

export default function Section3(): ReactNode {
    return (
        <section className="bg-darkbg bg-lines h-[1088.02px] flex flex-col items-center bg-[url(/img/Section3/background.webp)] w-screen bg-cover">
            <div className="container flex flex-col justify-center items-center">

                <div className="text-center h-[64px] flex flex-row items-center mb-[178px] mt-[36px]">
                    <div>
                        <img alt="Buriza" src="/img/Section3/buriza.webp" />
                    </div>
                    <div className="ml-[80px]">
                        <img src="/img/Section3/arrow.webp" />
                    </div>

                    <div className="ml-[40px] mr-[40px] flex items-center">
                        <p className="text-white text-[24px] leading-[34.8px] font-semibold">Used By</p>
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
                                <span className="text-[#C2B8FF] text-[56px] font-semibold leading-[53.76px]">Argus</span>
                                <span className="text-white text-[56px] font-semibold leading-[53.76px]"> - The .NET Cardano Indexing Framework</span>
                            </h1>
                        </div>

                        <div className="w-[557px] flex flex-col items-end">
                            <div className="w-[304.95px] h-[60px] mt-[2px] mb-[20.06px] flex justify-end" >
                                <p className="text-white text-[16px] font-normal leading-[20.48px] ">
                                    Seamlessly Connecting Cardano And .NET For A Fast, Productive Developer Experience
                                </p>
                            </div>

                            <div>
                                <Button variant="contained" 
                                    sx={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        width: '305px',
                                        px: 0
                                    }}
                                >
                                    <p className="text-[16px] leading-[24px] font-normal !ml-[24px]">Learn More</p>
                                    <img src="/img/Section3/button.webp" className="w-[24px] h-[24px] mr-[16px]"/>
                                </Button>
                            </div>
                        </div>
                    </div>

                    <div>
                        <img src='/img/Section3/code.webp' />
                    </div>
                </div>
            </div>
        </section>
    )
};
