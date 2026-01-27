import React, { useMemo, useState, useEffect } from "react";
import Portal from "../Portal";
// import portalImg from "../../assets/portal.png";
import mascotImg from "../../assets/char.png";

interface HorizontalTimelineProps {
  items: string[];
  activeIndex: number;
  onItemClick: (index: number) => void;
  scrollProgress: number;
}

const THEME_COLORS = [
  "#ffffff",
  "#ffffff",
  "#ffffff",
  "#ffffff",
  "#00A4E4",
  "#CC52FF",
  "#00ffaa",
];

export const HorizontalTimeline: React.FC<HorizontalTimelineProps> = ({
  items,
  activeIndex,
  onItemClick,
  scrollProgress,
}) => {
  const currentColor = THEME_COLORS[activeIndex % THEME_COLORS.length];
  const [offsets, setOffsets] = useState({ base: 80, portalSize: 60 });

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      if (w < 640) setOffsets({ base: 30, portalSize: 30 });
      else if (w < 1024) setOffsets({ base: 55, portalSize: 45 });
      else setOffsets({ base: 80, portalSize: 60 });
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* New state to track facing direction: 1 for forward (right), -1 for backward (left) */
  const [direction, setDirection] = useState(1);
  const prevProgressRef = React.useRef(scrollProgress);

  useEffect(() => {
    // Determine direction
    if (scrollProgress > prevProgressRef.current) {
      setDirection(1);
    } else if (scrollProgress < prevProgressRef.current) {
      setDirection(-1);
    }
    prevProgressRef.current = scrollProgress;
  }, [scrollProgress]);

  const mascotStyle = useMemo(() => {
    const p = Math.min(Math.max(scrollProgress, 0), 1);
    const step = 1 / (items.length - 1);
    let minDistance = 1;
    let closestIdx = 0;

    items.forEach((_, i) => {
      const dist = Math.abs(p - i * step);
      if (dist < minDistance) {
        minDistance = dist;
        closestIdx = i;
      }
    });

    // Sync threshold: how close to the portal before starting to merge
    // Asymmetric thresholds: Enter early (far), Emerge late (close)
    const portalPos = closestIdx * step;
    const signedDist = p - portalPos;
    const isEntering = (direction === 1 && signedDist < 0) || (direction === -1 && signedDist > 0);

    const threshold = isEntering ? 0.06 : 0.025;

    let opacity = 1;
    let scale = 1;
    let zDepth = 60; // Higher than portal by default
    let blur = 0;

    if (minDistance < threshold) {
      const ratio = minDistance / threshold; // 0 (at portal) to 1 (at threshold)

      // Use root curve to keep character visible/large for longer, then rapid drop near center
      const easeRatio = Math.pow(ratio, 0.5);

      scale = Math.max(0.1, easeRatio); // Go smaller
      opacity = Math.max(0.2, easeRatio); // Fade out slightly but keep visible
      blur = (1 - easeRatio) * 6; // Blur increases as we get closer (max 6px)

      // When very close, drop Z-index to "enter" the portal
      if (minDistance < threshold / 2) zDepth = 10;
    }

    const cssPos = `calc(${offsets.base}px + (${p} * (100% - ${offsets.base * 2}px)))`;

    return {
      cssPos,
      rawP: p,
      style: {
        left: cssPos,
        // Apply direction to scaleX
        transform: `translateX(-50%) translateY(-50%) scaleX(${direction}) scale(${scale})`,
        opacity,
        zIndex: zDepth,
        filter: `blur(${blur}px)`,
        willChange: "transform, filter", // Optimize performance
        transition: "opacity 0.1s linear, scale 0.1s ease-out, transform 0.2s ease-out, filter 0.1s linear",
      },
    };
  }, [scrollProgress, items.length, offsets, direction]);

  return (
    <div className="w-full max-w-5xl mx-auto px-2 md:px-4 flex items-center relative h-14 sm:h-16 md:h-20 [perspective:1200px] 
      bg-gradient-to-b from-slate-900/60 to-slate-900/20 
      backdrop-blur-2xl rounded-full 
      border border-white/10 
      shadow-[0_8px_32px_-10px_rgba(0,0,0,0.6),0_0_30px_-10px_rgba(6,182,212,0.3)]
      before:absolute before:inset-0 before:rounded-full before:bg-gradient-to-b before:from-white/5 before:to-transparent before:pointer-events-none"
    >
      <style>{`
        @keyframes portalPulse { 
            0%, 100% { filter: drop-shadow(0 0 2px rgba(255, 255, 255, 0.3)); } 
            50% { filter: drop-shadow(0 0 8px ${currentColor}aa); } 
        }
        @keyframes mascotFloat { 0%, 100% { transform: translateY(0px) rotate(-1deg); } 50% { transform: translateY(-4px) rotate(1deg); } }
        @keyframes smokeTrail { 
            0%, 100% { opacity: 0.15; transform: translateY(-50%) scaleY(0.8); filter: blur(1px); } 
            50% { opacity: 0.3; transform: translateY(-50%) scaleY(1.2); filter: blur(2px); } 
        }
      `}</style>

      <div
        className="absolute top-1/2 z-0 rounded-full transition-colors duration-500"
        style={{
          left: `${offsets.base}px`,
          width: `calc(${mascotStyle.cssPos} - ${offsets.base}px)`,
          height: "2px",
          background: `linear-gradient(90deg, transparent, ${currentColor}88)`,
          boxShadow: `0 0 10px ${currentColor}44`,
          animation: "smokeTrail 2.5s ease-in-out infinite",
          transformOrigin: "left center",
        }}
      />

      <div className="relative w-full z-10 [transform-style:preserve-3d]">
        {/* Mascot */}
        <div
          className="absolute top-1/2 pointer-events-none w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16"
          style={mascotStyle.style}
        >
          <img
            src={mascotImg}
            alt="Mascot"
            className="w-full h-full object-contain"
            style={{ animation: "mascotFloat 3s ease-in-out infinite" }}
          />
        </div>

        {/* Portals */}
        <div className="relative w-full flex justify-between items-center [transform-style:preserve-3d]">
          {items.map((item, index) => {
            const isActive = index === activeIndex;
            const portalColor = THEME_COLORS[index % THEME_COLORS.length];
            const step = 1 / (items.length - 1);
            const diff = mascotStyle.rawP - index * step;
            const isEntering = Math.abs(diff) < 0.02 && index !== 0;
            const rotateY = isEntering ? 0 : Math.max(-45, Math.min(45, diff * -500));

            const dist = Math.abs(diff);

            // Also animate if reasonably close
            const shouldAnimate = dist < step * 0.5;

            return (
              <button
                key={item}
                onClick={() => onItemClick(index)}
                className="relative flex flex-col items-center outline-none group px-1 sm:px-0 z-30"
              >
                <div className="w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 flex items-center justify-center [transform-style:preserve-3d]">
                  <div
                    className={`relative z-20 transition-all duration-300 ease-out ${isActive ? "scale-110 grayscale-0" : "opacity-40 grayscale"}`}
                    style={{
                      transform: `rotateY(${rotateY}deg)`,
                      willChange: "transform", // Optimize for animation
                    }}
                  >
                    <Portal className="w-full h-full object-contain" isActive={shouldAnimate || isActive} />
                  </div>
                </div>
                <span
                  className={`-mt-1 text-[8px] sm:text-[10px] md:text-xs font-bold tracking-tighter sm:tracking-widest font-['Orbitron'] transition-all duration-300 ${isActive ? "opacity-100 scale-105" : "text-white opacity-20"}`}
                  style={{
                    color: isActive ? portalColor : undefined,
                    textShadow: isActive ? `0 0 5px ${portalColor}44` : "none",
                  }}
                >
                  {item}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
