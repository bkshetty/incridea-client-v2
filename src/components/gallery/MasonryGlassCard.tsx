import React from "react";

interface MasonryGlassCardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
    ratio?: string;
}

const glassCardStyle: React.CSSProperties = {
    borderRadius: "1.75rem",
    border: "1px solid rgba(255, 255, 255, 0.18)",
    background: `
      linear-gradient(to top, rgba(0, 0, 0, 0.20), transparent 60%),
      rgba(21, 21, 21, 0.30)
    `,
    boxShadow: `
      inset 0 0 0 1px rgba(255, 255, 255, 0.08),
      inset 0 1px 0 rgba(255, 255, 255, 0.22)
    `,
    backdropFilter: "brightness(1.1) blur(1px)",
    WebkitBackdropFilter: "brightness(1.1) blur(1px)",
};

const MasonryGlassCard: React.FC<MasonryGlassCardProps> = ({
    children,
    className = "",
    ratio = "aspect-square",
    style,
    ...props
}) => {
    return (
        <div
            className={`group relative w-full overflow-hidden transition-all duration-500 hover:shadow-[0_0_30px_-5px_rgba(6,182,212,0.4)] ${className} ${ratio}`}
            style={{ ...glassCardStyle, ...style }}
            {...props}
        >
            {/* SHINE EFFECT */}
            <div className="absolute inset-0 z-10 translate-x-[-100%] group-hover:animate-shine bg-gradient-to-r from-transparent via-white/10 to-transparent transition-all duration-1000" />

            {/* CONTENT */}
            <div className="relative z-0 h-full w-full">
                {children}
            </div>

            {/* OVERLAY ON HOVER (Optional Tint) - Kept consistent with previous design but lighter */}
            <div className="absolute inset-0 z-20 pointer-events-none bg-cyan-500/0 group-hover:bg-cyan-500/05 transition-colors duration-500" />
        </div>
    );
};

export default MasonryGlassCard;
