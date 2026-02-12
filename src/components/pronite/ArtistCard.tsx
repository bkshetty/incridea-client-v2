import React from "react";
import "./FinalReveal.css";

interface ArtistCardProps {
    name: React.ReactNode;
    role: string;
    time: string;
    image: string;
    isHeadliner?: boolean;
    className?: string; // For grid col span and animations
    animationStyle?: React.CSSProperties; // For inline delays
}

const ArtistCard: React.FC<ArtistCardProps> = ({
    name,
    role,
    time,
    image,
    isHeadliner = false,
    className = "",
    animationStyle = {},
}) => {
    if (isHeadliner) {
        return (
            <div className={`${className} animate-fade-up h-full`} style={animationStyle}>
                <div className="w-full h-full animate-float">
                    <div
                        className="h-full glass-card headliner-card focal-card breathing-glow rounded-3xl overflow-hidden relative group z-20 flex flex-col justify-end"
                    >
                        <div className="absolute inset-0 z-0">
                            <img
                                alt="Main Headliner"
                                className="w-full h-full object-cover scale-105 group-hover:scale-110 transition-all duration-700"
                                src={image}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/20 to-transparent"></div>
                        </div>
                        <div className="absolute top-2 md:top-6 right-2 md:right-6 z-10">
                            <span className="bg-primary text-white text-[8px] md:text-[10px] font-black px-2 md:px-3 py-1 md:py-2 rounded-full tracking-widest shadow-lg flex items-center gap-2 border border-white/20">
                                <span className="w-1.5 h-1.5 md:w-2 md:h-2 bg-white rounded-full animate-ping"></span>
                                HEADLINER
                            </span>
                        </div>
                        <div className="relative z-10 w-full p-4 md:p-8">
                            <h3 className="text-3xl md:text-6xl font-black text-white mb-1 md:mb-3 tracking-tighter text-glow drop-shadow-lg leading-none">
                                {name}
                            </h3>
                            <p className="text-primary font-bold text-xs md:text-lg tracking-[0.25em] flex items-center gap-2 md:gap-3">
                                <span className="w-6 md:w-12 h-[2px] bg-primary animate-pulse shadow-[0_0_10px_#ee2b6f]"></span>
                                {time}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`${className} animate-fade-up h-full`} style={animationStyle}>
            <div className="w-full h-full animate-float">
                <div className="h-full glass-card rounded-2xl overflow-hidden relative group flex flex-col justify-end">
                    <div className="absolute inset-0 z-0">
                        <img
                            alt={role}
                            className="w-full h-full object-cover grayscale opacity-70 group-hover:opacity-100 group-hover:grayscale-0 transition-all duration-700"
                            src={image}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/10 to-transparent"></div>
                    </div>
                    <div className="relative z-10 w-full p-3 md:p-6">
                        <span className="text-primary text-[8px] md:text-[10px] font-bold tracking-widest uppercase mb-0.5 md:mb-1 block drop-shadow-md">
                            {role}
                        </span>
                        <h3 className="text-lg md:text-2xl font-bold text-white leading-tight drop-shadow-lg">
                            {name}
                        </h3>
                        <p className="text-slate-300 text-[10px] md:text-xs mt-1 md:mt-3 font-medium tracking-widest uppercase border-t border-white/10 pt-1 md:pt-3 opacity-80 group-hover:opacity-100 transition-opacity">
                            {time}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ArtistCard;
