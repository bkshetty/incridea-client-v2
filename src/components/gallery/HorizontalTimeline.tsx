import React, { useMemo, useState, useEffect } from "react";
import portalImg from "../../assets/portal.png";
import mascotImg from "../../assets/mascot.png";

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
      // Reduced base offsets and portal sizes for a more compact height
      if (w < 640) setOffsets({ base: 30, portalSize: 30 });
      else if (w < 1024) setOffsets({ base: 55, portalSize: 45 });
      else setOffsets({ base: 80, portalSize: 60 });
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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

    const threshold = 0.04;
    let opacity = 1;
    let scale = 1;
    let zDepth = 50;

    if (minDistance < threshold && closestIdx !== 0) {
      const ratio = minDistance / threshold;
      scale = Math.max(0.1, Math.pow(ratio, 0.6));
      opacity = Math.pow(ratio, 2);
      zDepth = minDistance < threshold / 2.5 ? 5 : 50;
    }

    const cssPos = `calc(${offsets.base}px + (${p} * (100% - ${offsets.base * 2}px)))`;

    return {
      cssPos,
      rawP: p,
      style: {
        left: cssPos,
        transform: `translateX(-50%) translateY(-50%) scaleX(-1) scale(${scale})`,
        opacity,
        zIndex: zDepth,
        transition:
          "opacity 0.1s linear, scale 0.1s cubic-bezier(0.4, 0, 0.2, 1)",
      },
    };
  }, [scrollProgress, items.length, offsets]);

  return (
    /* Reduced Height: Changed h-20/24/28 to h-14/16/20 */
    <div className="w-full max-w-5xl mx-auto px-2 md:px-4 flex items-center relative h-14 sm:h-16 md:h-20 [perspective:1200px]">
      <style>{`
        /* Reduced Blur: Changed drop-shadow blur from 8px/20px to 2px/6px */
        @keyframes portalPulse { 
            0%, 100% { filter: drop-shadow(0 0 2px rgba(0, 164, 228, 0.3)); } 
            50% { filter: drop-shadow(0 0 6px rgba(0, 164, 228, 0.6)); } 
        }
        @keyframes mascotFloat { 0%, 100% { transform: translateY(0px) rotate(-1deg); } 50% { transform: translateY(-4px) rotate(1deg); } }
        /* Increased Transparency & Reduced Blur: Changed opacity from 0.3 to 0.15 and blur from 4px to 1px */
        @keyframes smokeTrail { 
            0%, 100% { opacity: 0.15; transform: translateY(-50%) scaleY(0.8); filter: blur(1px); } 
            50% { opacity: 0.3; transform: translateY(-50%) scaleY(1.2); filter: blur(2px); } 
        }
      `}</style>

      {/* --- SMOKY TRAIL --- */}
      <div
        className="absolute top-1/2 z-0 rounded-full transition-colors duration-500"
        style={{
          left: `${offsets.base}px`,
          width: `calc(${mascotStyle.cssPos} - ${offsets.base}px)`,
          height: "2px" /* Thinner trail */,
          background: `linear-gradient(90deg, transparent, ${currentColor}88)` /* Added 88 for hex transparency */,
          boxShadow: `0 0 10px ${currentColor}44` /* Softer, more transparent shadow */,
          animation: "smokeTrail 2.5s ease-in-out infinite",
          transformOrigin: "left center",
        }}
      />

      <div className="relative w-full z-10 [transform-style:preserve-3d]">
        {/* --- MASCOT --- */}
        <div
          /* Smaller Mascot: Changed w-14/20/28 to w-10/14/20 */
          className="absolute top-1/2 pointer-events-none w-10 h-10 sm:w-14 sm:h-14 md:w-20 md:h-20"
          style={mascotStyle.style}
        >
          <img
            src={mascotImg}
            alt="Mascot"
            className="w-full h-full object-contain"
            style={{ animation: "mascotFloat 3s ease-in-out infinite" }}
          />
        </div>

        {/* --- PORTALS --- */}
        <div className="relative w-full flex justify-between items-center [transform-style:preserve-3d]">
          {items.map((item, index) => {
            const isActive = index === activeIndex;
            const portalColor = THEME_COLORS[index % THEME_COLORS.length];
            const step = 1 / (items.length - 1);
            const diff = mascotStyle.rawP - index * step;

            const isEntering = Math.abs(diff) < 0.02 && index !== 0;
            const rotateY = isEntering
              ? 0
              : Math.max(-45, Math.min(45, diff * -500));

            return (
              <button
                key={item}
                onClick={() => onItemClick(index)}
                className="relative flex flex-col items-center outline-none group px-1 sm:px-0 z-20"
              >
                {/* Smaller Portals: Changed w-10/14/20 to w-8/12/16 */}
                <div className="w-8 h-8 sm:w-12 sm:h-12 md:w-16 md:h-16 flex items-center justify-center [transform-style:preserve-3d]">
                  <div
                    /* More Transparent inactive portals: Changed opacity-40 to opacity-20 */
                    className={`relative z-30 transition-all duration-300 ease-out ${isActive ? "scale-110 grayscale-0" : "opacity-20 grayscale"}`}
                    style={{
                      transform: `rotateY(${rotateY}deg)`,
                      animation: isActive
                        ? "portalPulse 4s infinite ease-in-out"
                        : "none",
                    }}
                  >
                    <img
                      src={portalImg}
                      alt="Portal"
                      className="w-full h-full object-contain"
                    />
                  </div>
                </div>

                <span
                  /* More Transparent year text: Changed text-neutral-600 to opacity-40 */
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
