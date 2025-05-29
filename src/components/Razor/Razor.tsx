import { useTheme } from "@mui/material";
import { ReactNode } from "react";
import BtnMore from "../Shared/Buttons/BtnMore/BtnMore";

export default function Razor(): ReactNode {
    const theme = useTheme();

    return (
        <section className="container mx-auto h-[1080px] flex items-center justify-center flex-col">
            <div className="w-full flex items-end justify-between">
                <h1 className="!text-[64px] !font-semibold !mb-0 !leading-18">
                    <span className="text-[#649DCA]">Razor</span>
                    <span> - The .NET <br /> Cardano Node</span>
                </h1>
                <BtnMore />
            </div>
            <div className="flex gap-4 mt-6">
                <div className="relative w-2/3">
                    <p className="!text-xl !mb-10 !max-w-175">
                        Razor is a next-generation full Cardano node built in .NET, designed for developers who demand precision, power, and security. With Razor, .NET developers gain native access to Cardano's capabilities—seamlessly integrating with .NET tools like Argus and Chrysalis to build robust blockchain applications.
                    </p>
                    <div className="absolute top-4 right-0 w-38">
                        <img
                            src="/img/Razor/wizard_razor.svg"
                            alt="wizard razor"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="relative bg-[#C9E5FE] rounded-3xl p-8 pt-18">
                            <div className="absolute top-6 right-6">
                                <img
                                    src="/img/Razor/speed.svg"
                                    alt="speed icon"
                                />
                            </div>
                            <h2 style={{color: theme.palette.grey[600]}} className="!text-[32px]">Speed</h2>
                            <p style={{color: theme.palette.grey[600]}} className="!text-lg">Razor is engineered for lightning-fast performance, enabling rapid transaction processing and seamless synchronization.</p>
                        </div>
                        <div className="relative bg-[#C9E5FE] rounded-3xl p-8 pt-18">
                            <div className="absolute top-6 right-6">
                                <img
                                    src="/img/Razor/reliability.svg"
                                    alt="reliability icon"
                                />
                            </div>
                            <h2 style={{color: theme.palette.grey[600]}} className="!text-[32px]">Reliability</h2>
                            <p style={{color: theme.palette.grey[600]}} className="!text-lg">Razor delivers rock-solid stability and consistent uptime—so your blockchain solutions stay dependable in any environment.</p>
                        </div>
                        <div className="relative col-span-2 bg-[#C9E5FE] rounded-3xl p-8 pt-18">
                            <div className="absolute top-6 right-6">
                                <img
                                    src="/img/Razor/friendliness.svg"
                                    alt="speed icon"
                                />
                            </div>
                            <h2 style={{color: theme.palette.grey[600]}} className="!text-[32px]">Developer-Friendliness</h2>
                            <p style={{color: theme.palette.grey[600]}} className="!text-lg">With native .NET support, Razor removes the complexity of bindings or wrappers, offering clean, intuitive APIs that empower developers to build and integrate with Cardano effortlessly.</p>
                        </div>
                    </div>
                </div>
                <div className="w-1/3 !pt-9">
                    <div className="w-full h-full flex items-center justify-center bg-[#23212B] rounded-3xl p-8 relative">
                        <div className="absolute w-94">
                            <img
                                src="/img/Razor/razor_silhouette.svg"
                                alt="razor logo"
                            />
                        </div>
                        <div className="z-10 w-72">
                            <img
                                src="/img/Section2/Logos/razor.webp"
                                alt="razor logo"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
};