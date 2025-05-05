import { ReactNode } from "react";
import CardHead from "../../../static/img/Section7/card_head.svg";
import Popularity from "../../../static/img/Section7/popularity.svg";
import Performance from "../../../static/img/Section7/performance.svg";
import Versatility from "../../../static/img/Section7/versatility.svg";

export default function Section7(): ReactNode {
    return (
        <section className="bg-[url(/img/Section7/seventh_background.webp)] bg-cover h-[1171px]">
            <div className="container !pt-[274.77px] !pb-[152.23px]">
                <div className="flex flex-col justify-center !pb-15">
                    <div className="relative">
                        <h1 className="!text-[56px] text-center leading-[53.76px] tracking-[0.56px] font-semibold  !m-0">
                            <span className="text-white">
                                Why&nbsp;
                            </span>
                            <span className="text-[#C2B8FF]">
                                .NET?
                            </span>
                        </h1>
                        <img 
                            src="/img/Section7/seventh_wizard.webp" 
                            alt="wizard" 
                            className="absolute right-[355.44px] bottom-[-4.74px]" 
                        />
                    </div>

                    <div className="mt-[38px]">
                        <p className="text-center">
                            .NET is a powerful, open-source development platform backed by a vast global community.<br />
                            It offers a comprehensive ecosystem of tools and libraries, enabling developers to build <br />
                            high-performance, scalable applications across various platforms.
                        </p>
                    </div>

                </div>
                <div className="flex justify-between items-center gap-x-[4.94px]">
                    
                    <div className="basis-[402.05px] relative">
                        <div className="absolute w-full">
                            <p className="text-[32px] leading-8 absolute top-[15px] left-[19px]">01</p>
                            <CardHead className="absolute top-0 w-full" />
                            <Popularity className="absolute top-8 right-[32.05px]" />
                        </div>
                        <div className="bg-[#5438DC] rounded-b-[24px] mt-[99px] pt-[57px] pl-8 pr-[46px] pb-[50px]">
                            <h4 className="!text-[40px] leading-[48px] !mb-[38px]">Popularity</h4>
                            <p className="!text-[20px] leading-[28px]">NET Core was ranked as the top <br />
                            non-web framework in the 2024<br />
                            Stack Overflow Developer <br />
                            Survey, reflecting its <br />
                            widespread adoption and trust <br />
                            among developers.</p>
                        </div>
                    </div>
                    
                    <div className="basis-[402.05px] relative">
                    <div className="absolute w-full">
                            <p className="text-[32px] leading-8 absolute top-[15px] left-[19px]">02</p>
                            <CardHead className="absolute top-0 w-full" />
                            <Performance className="absolute top-8 right-[32.05px]" />
                        </div>
                        <div className="bg-[#5438DC] rounded-b-[24px] mt-[99px] pt-[57px] pl-8 pr-[48.5px] pb-[50px]">
                            <h4 className="!text-[40px] leading-12 !mb-[38px]">Performance</h4>
                            <p className="!text-[20px] leading-7">NET Core delivers high-<br />
                            performance applications, with <br />
                            tooling like ASP.NET Core <br />
                            outperforming other popular <br />
                            web frameworks in independent benchmarks.</p>
                        </div>
                    </div>
                    
                    <div className="basis-[402.05px] relative">
                        <div className="absolute w-full">
                            <p className="text-[32px] leading-8 absolute top-[15px] left-[19px]">03</p>
                            <CardHead className="absolute top-0 w-full" />
                            <Versatility className="absolute top-8 right-[32.05px]" />
                        </div>
                        <div className="bg-[#5438DC] rounded-b-[24px] mt-[99px] pt-[57px] pl-8 pr-[48.5px] pb-[50px]">
                            <h4 className="!text-[40px] leading-12 !mb-[38px]">Versatility</h4>
                            <p className="!text-[20px] leading-7">.NET supports development <br />
                            across Windows, Linux, and <br />
                            macOS, enabling the creation <br />
                            of applications for desktop, <br />
                            mobile, cloud, and IoT <br />
                            environments.</p>
                        </div>
                    </div>
                    
                </div>
            </div>
        </section>
    )
};
