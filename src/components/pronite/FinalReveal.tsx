import React from "react";
import "./FinalReveal.css";
import CosmicBackground from "./CosmicBackground";
import ArtistCard from "./ArtistCard";

interface Artist {
    name: React.ReactNode;
    role: string;
    time: string;
    image: string;
    isHeadliner?: boolean;
    className?: string;
    animationStyle?: React.CSSProperties;
}

interface FinalRevealProps {
    artists: Artist[];
}

const FinalReveal: React.FC<FinalRevealProps> = ({ artists }) => {
    return (
        <div className="w-full h-[100dvh] font-display text-slate-100 relative flex flex-col justify-center items-center overflow-hidden pointer-events-auto">
            <CosmicBackground />
            <main className="relative z-10 max-w-7xl mx-auto px-3 md:px-4 w-full flex flex-col items-center justify-between h-full py-2">
                <header className="text-center animate-fade-up shrink-0 h-[12%] flex flex-col justify-center">
                    <div className="flex justify-center items-center gap-3 mb-1">
                        <img
                            src="/incridea.png"
                            alt="Incridea"
                            className="h-5 md:h-10 animate-pulse drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                        />
                        <div className="h-5 w-[1px] bg-white/30"></div>
                        <img
                            src="/pronite_1.png"
                            alt="Pronite"
                            className="h-7 md:h-16 animate-pulse-slow drop-shadow-[0_0_20px_rgba(238,43,111,0.5)]"
                        />
                    </div>
                </header>

                <div className="flex flex-col md:grid md:grid-cols-12 gap-1 md:gap-6 w-full flex-1 min-h-0 h-[78%]">
                    {/* Nikitha - Top on mobile */}
                    <ArtistCard
                        name={artists[0].name}
                        role={artists[0].role}
                        time={artists[0].time}
                        image={artists[0].image}
                        isHeadliner={artists[0].isHeadliner}
                        className="md:col-span-3 flex-1 min-h-0"
                        animationStyle={{ animationDelay: '200ms' }}
                    />

                    {/* Armaan - Middle, larger on mobile */}
                    <ArtistCard
                        name={artists[1].name}
                        role={artists[1].role}
                        time={artists[1].time}
                        image={artists[1].image}
                        isHeadliner={artists[1].isHeadliner}
                        className="md:col-span-6 flex-[2] min-h-0"
                        animationStyle={{ animationDelay: '400ms' }}
                    />

                    {/* Alo - Bottom on mobile */}
                    <ArtistCard
                        name={artists[2].name}
                        role={artists[2].role}
                        time={artists[2].time}
                        image={artists[2].image}
                        isHeadliner={artists[2].isHeadliner}
                        className="md:col-span-3 flex-1 min-h-0"
                        animationStyle={{ animationDelay: '600ms' }}
                    />
                </div>

                <div className="w-full flex flex-col items-center animate-fade-up [animation-delay:800ms] h-[10%] justify-center shrink-0">
                    <div className="flex items-center gap-2 md:gap-3">
                        <div className="relative flex items-center justify-center">
                            <span className="absolute inline-flex h-2.5 w-2.5 rounded-full bg-primary opacity-75 animate-ping"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-primary shadow-[0_0_15px_#ee2b6f]"></span>
                        </div>
                        <h2 className="text-lg md:text-5xl font-black hashtag-gradient tracking-tighter drop-shadow-xl">
                            #INCRIDEA26
                        </h2>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default FinalReveal;
