import { ReactNode } from "react";

export default function Section5(): ReactNode {
    return(
        <section className="bg-[url(/img/Section5/fifth_background.webp)] bg-cover w-screen h-[1203px]">
            <div className="container flex flex-col items-center !pt-[227px] !pb-[134px]">
                <div>
                    <h1 className="!text-[56px] leading-[53.76px] font-semibold text-center">
                        <span>Accelerate&nbsp;</span>
                        <span className="text-[#C2B8FF]">Cardano<br />DApp Creation</span>
                    </h1>
                </div>

                <div className="flex gap-[16px] mt-[80px]">
                    <div className="w-[636px] h-[654px] bg-[url(/img/Section5/power.webp)] bg-cover pt-[80px] pl-[49px]" >
                        <h2 className="!text-[48px] font-bold !leading-[32px] !text-[#C2B8FF] !mb-[48px]">Power</h2>
                        <p className="!text-[24px] !leading-[32px]">
                            Harness the potential of C# with<br />
                            robust tools such as LINQ, ASP.NET,<br />
                            and Entity Framework.
                        </p>
                    </div>
                    
                    <div className="flex flex-col gap-[16px]">
                        <div className="w-[636px] h-[319px] bg-[url(/img/Section5/efficiency.webp)] bg-cover pt-[80px] pl-[48px]">
                            <h2 className="!text-[48px] font-bold !leading-[32px] !text-[#C2B8FF] !mb-[48px]">Efficiency</h2>
                            <p className="!text-[20px] !leading-28px]">
                                Experience streamlined developer<br />
                                experience for smooth dApp<br />
                                development and maintenance.
                            </p>
                        </div>
                        <div className="w-[636px] h-[319px] bg-[url(/img/Section5/customizability.webp)] bg-cover pt-[80px] pl-[48px]">
                            <h2 className="!text-[48px] font-bold !leading-[32px] !text-[#C2B8FF] !mb-[48px]">Customizability</h2>
                            <p className="!text-[20px] !leading-28px]">
                                Leverage built-in reducers or create<br />
                                custom ones tailored to your<br />
                                requirements.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
};