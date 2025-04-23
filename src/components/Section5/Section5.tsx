import { Paper } from "@mui/material";
import { ReactNode } from "react";

export default function Section5(): ReactNode {
    return (
        <section className="bg-[url(/img/Section5/fifth_background.webp)] bg-cover w-screen h-[1203px]">
            <div className="container flex flex-col items-center !pt-[227px] !pb-[134px]">
                <div>
                    <h1 className="!text-[56px] leading-[53.76px] font-semibold text-center">
                        <span>Accelerate&nbsp;</span>
                        <span className="text-[#C2B8FF]">Cardano<br />DApp Creation</span>
                    </h1>
                </div>

                <div className="flex gap-[16px] mt-[40px]">
                    <Paper sx={{
                        width: "636px",
                        height: "654px",
                        backgroundColor: '#24222D',
                        paddingTop: '80px',
                        paddingLeft: '49px',
                        paddingRight: '45.74px'
                    }}>
                        <div className="flex flex-col">
                            <h2 className="!text-[48px] font-bold !leading-[32px] !text-[#C2B8FF] !mb-[48px]">Power</h2>
                            <p className="!text-[24px] !leading-[32px] !mb-[9.10px]">
                                Harness the potential of C# with<br />
                                robust tools such as LINQ, ASP.NET,<br />
                                and Entity Framework.
                            </p>
                            <img src="/img/Section5/power.svg" alt="power" className="self-end" />
                        </div>
                    </Paper>
                    <div className="flex flex-col gap-[16px]">
                        <Paper sx={{
                            width: "636px",
                            height: "319px",
                            paddingTop: '80px',
                            paddingLeft: '48px',
                            paddingRight: '40.5px',
                            paddingBottom: '40px',
                            backgroundColor: '#24222D',
                            display: 'flex',
                            justifyContent: 'space-between',
                        }}>
                            <div>
                                <h2 className="!text-[48px] font-bold !leading-[32px] !text-[#C2B8FF] !mb-[48px]">Efficiency</h2>
                                <p className="!text-[20px] !leading-28px]">
                                    Experience streamlined developer<br />
                                    experience for smooth dApp<br />
                                    development and maintenance.
                                </p>
                            </div>
                            <div className="flex flex-col justify-end">
                                <img src="/img/Section5/efficiency.svg" alt="efficiency" />
                            </div>
                        </Paper>
                        <Paper sx={{
                            backgroundColor: '#24222D',
                            width: "636px",
                            height: "319px",
                            paddingTop: '80px',
                            paddingLeft: '48px',
                            paddingRight: '40px',
                            paddingBottom: '40px',
                            display: 'flex',
                            justifyContent: 'space-between',
                        }}>
                            <div>
                                <h2 className="!text-[48px] font-bold !leading-[32px] !text-[#C2B8FF] !mb-[48px]">Customizability</h2>
                                <p className="!text-[20px] !leading-28px]">
                                    Leverage built-in reducers or create<br />
                                    custom ones tailored to your<br />
                                    requirements.
                                </p>
                            </div>
                            <div className="flex flex-col justify-end">
                                <img src="/img/Section5/customizability.svg" alt="customizability" />
                            </div>
                        </Paper>
                    </div>
                </div>
            </div>
        </section>
    )
};