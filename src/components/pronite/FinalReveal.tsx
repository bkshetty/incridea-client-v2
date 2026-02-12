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
    // Removed specific animation class in favor of unified fade-up with delay
}

const FinalReveal: React.FC = () => {
    const artists: Artist[] = [
        {
            name: (
                <>
                    NIKITHA
                    <br />
                    GANDHI
                </>
            ),
            role: "Special Guest",
            time: "09:00 PM",
            image: "/artist1-right.jpg",
            className: "md:col-span-3",
        },
        {
            name: "ARMAAN MALIK",
            role: "HEADLINER",
            time: "11:30 PM",
            image: "/artist1-left.jpg",
            isHeadliner: true,
            className: "md:col-span-6",
        },
        {
            name: (
                <>
                    ALO
                    <br />
                    THE BAND
                </>
            ),
            role: "Encore Act",
            time: "01:30 AM",
            image: "/artist1-right.jpg",
            className: "md:col-span-3",
        },
    ];

    return (
        <div className="bg-black w-full h-screen font-display text-slate-100 relative flex flex-col overflow-y-auto md:overflow-hidden pointer-events-auto">
            <CosmicBackground />
            <main className="relative z-10 max-w-7xl mx-auto px-4 w-full py-6 md:py-2 flex flex-col items-center justify-start md:justify-center min-h-[100dvh] md:h-full">
                <header className="text-center mb-4 md:mb-6 animate-fade-up shrink-0">
                    <img
                        src="/incridea.png.png"
                        alt="Incridea"
                        className="h-8 md:h-10 mx-auto mb-2 animate-pulse pt-1 drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                    />
                    <img
                        src="/pronite_1.png"
                        alt="Pronite"
                        className="h-8 md:h-16 mx-auto mb-3 md:mb-4 animate-pulse-slow drop-shadow-[0_0_20px_rgba(238,43,111,0.5)]"
                    />
                    <p className="text-slate-300 max-w-xl mx-auto text-base font-light tracking-wide">
                        Witness the convergence of three legendary icons for an
                        unforgettable night of cosmic soundscapes.
                    </p>
                </header>
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 items-center w-full mb-4 md:mb-6 flex-1">
                    {artists.map((artist, index) => (
                        <ArtistCard
                            key={index}
                            name={artist.name}
                            role={artist.role}
                            time={artist.time}
                            image={artist.image}
                            isHeadliner={artist.isHeadliner}
                            className={artist.className}
                            animationStyle={{
                                animationDelay: `${(index + 1) * 200}ms`,
                            }}
                        />
                    ))}
                </div>
                <div className="w-full flex flex-col items-center animate-fade-up [animation-delay:800ms] pb-8 md:pb-0">
                    <div className="flex items-center gap-2 mb-1">
                        <div className="relative flex items-center justify-center">
                            <span className="absolute inline-flex h-3 w-3 rounded-full bg-primary opacity-75 animate-ping"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary shadow-[0_0_15px_#ee2b6f]"></span>
                        </div>
                        <h2 className="text-3xl md:text-5xl font-black hashtag-gradient tracking-tighter drop-shadow-xl">
                            #INCRIDEA26
                        </h2>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default FinalReveal;
