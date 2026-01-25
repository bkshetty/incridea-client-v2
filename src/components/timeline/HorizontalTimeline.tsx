import React, { useMemo, useState, useEffect } from "react";
import portalImg from "../../assets/portal.png";
import mascotImg from "../../assets/mascot.png";

interface HorizontalTimelineProps {
  items: string[];
  activeIndex: number;
  onItemClick: (index: number) => void;
  scrollProgress: number;
}

// DEFINING EVENT THEME COLORS
const THEME_COLORS = [
  "#ffffff", // 2018
  "#ffffff", // 2019
  "#ffffff", // 2020
  "#ffffff", // 2022
  "#00A4E4", // 2023
  "#CC52FF", // 2024
  "#00ffaa"  // 2025
];

export const HorizontalTimeline: React.FC<HorizontalTimelineProps> = ({
  items,
  activeIndex,
  onItemClick,
  scrollProgress,
}) => {
  // 1. DETERMINE CURRENT COLOR
  const currentColor = THEME_COLORS[activeIndex % THEME_COLORS.length];

  // 2. RESPONSIVE OFFSET CALCULATION
  // Calculates the exact pixel center of the first portal based on screen size.
  const [baseOffset, setBaseOffset] = useState(96); // Default Desktop

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      // MATCHING HTML LAYOUT:
      // Mobile (<768px): Padding px-2 (8px) + Width w-14 (56px)/2 = 36px
      // Tablet (>=768px): Padding px-6 (24px) + Width w-24 (96px)/2 = 72px
      // Desktop (>=1024px): Padding px-10 (40px) + Width w-28 (112px)/2 = 96px
      
      if (width < 768) {
        setBaseOffset(36); 
      } else if (width < 1024) {
        setBaseOffset(72); 
      } else {
        setBaseOffset(96); 
      }
    };

    handleResize(); 
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const mascotStyle = useMemo(() => {
    // --- POSITIONING LOGIC ---
    const rawProgress = Math.min(Math.max(scrollProgress, 0), 1);
    
    // Start Offset: Visual 0.0 means "On top of 2018". 
    // We keep this raw so the math aligns perfectly with the portal centers.
    const effectiveProgress = rawProgress;

    const step = 1 / (items.length - 1);
    let minDistance = 1;
    let closestPortalIndex = 0;

    items.forEach((_, index) => {
      const portalPosition = index * step;
      const distance = Math.abs(effectiveProgress - portalPosition);
      if (distance < minDistance) {
        minDistance = distance;
        closestPortalIndex = index;
      }
    });

    // --- ANIMATION LOGIC (VORTEX PHYSICS) ---
    // Threshold: How close (in %) the mascot must be to trigger the "dive".
    const threshold = 0.03;
    let opacity = 1;
    let scale = 1;

    // Only trigger animation if we are physically overlapping the portal
    if (minDistance < threshold) {
      // EXCEPTION: 2018 (Index 0) -> No animation, he stands solid.
      if (closestPortalIndex === 0) {
        opacity = 1;
        scale = 1;
      } else {
        // ANIMATION FOR 2019-2025
        // ratio: 0 = Dead Center (Inside), 1 = Edge (Outside)
        const ratio = minDistance / threshold;

        // OPACITY CURVE (Non-Linear): 
        // He stays visible longer, then fades out sharply near the center.
        // This fixes the "ghosting" or "awkward fade" issue.
        opacity = Math.pow(ratio, 1.5); 

        // SCALE CURVE (Vortex):
        // Shrinks to 60% size to mimic depth perception.
        scale = 0.6 + (0.4 * Math.pow(ratio, 0.5));
      }
    }

    // --- CSS POSITIONING ---
    // Dynamic Calc matches the responsive baseOffset exactly.
    const cssPosition = `calc(${baseOffset}px + (${effectiveProgress} * (100% - ${baseOffset * 2}px)))`;

    return {
      cssPosition,
      style: {
        left: cssPosition,
        // Responsive Scaling handled by scale() multiplier
        transform: `translateX(-50%) translateY(-50%) scaleX(-1) scale(${scale})`, 
        opacity: opacity,
        zIndex: 50,
        // CRITICAL FIX FOR LAG:
        // Removed 'left' and 'transform' from transition. 
        // This ensures movement is instant and locked to your scroll.
        transition: "opacity 0.05s linear, scale 0.05s linear"
      }
    };
  }, [scrollProgress, items.length, baseOffset]);

  return (
    <div className="w-full max-w-7xl mx-auto px-2 md:px-6 lg:px-10 py-8 md:py-16 flex items-center relative overflow-x-hidden">
      <style>
        {`
          @keyframes portalPulse {
            0%, 100% { filter: drop-shadow(0 0 5px rgba(0, 150, 255, 0.6)) brightness(1); }
            50% { filter: drop-shadow(0 0 15px rgba(0, 200, 255, 0.9)) brightness(1.2); }
          }
          @keyframes fluidFloat {
            0%, 100% { transform: translateY(0px) rotate(-1deg); }
            50% { transform: translateY(-10px) rotate(1deg); }
          }
          @keyframes smokeFlow {
            0%, 100% { opacity: 0.6; transform: translateY(-50%) scaleY(1); filter: blur(4px); }
            50% { opacity: 0.9; transform: translateY(-50%) scaleY(1.5); filter: blur(6px); }
          }
          .mascot-hero {
            animation: fluidFloat 3s ease-in-out infinite;
            filter: drop-shadow(0 0 15px rgba(0, 212, 255, 0.8));
          }
          /* Responsive Mascot Container Sizing */
          .mascot-container { width: 4rem; height: 4rem; } /* Mobile */
          @media (min-width: 768px) { .mascot-container { width: 7rem; height: 7rem; } } /* Tablet/Desktop */
        `}
      </style>

      {/* --- SMOKY PLASMA TRAIL --- */}
      <div
        className="absolute top-1/2 z-0 rounded-full transition-colors duration-500 ease-in-out"
        style={{
          left: `${baseOffset}px`,
          width: `calc(${mascotStyle.cssPosition} - ${baseOffset}px)`,
          height: '6px',
          background: `linear-gradient(90deg, transparent 0%, ${currentColor} 50%, ${currentColor} 100%)`,
          boxShadow: `0 0 15px ${currentColor}, 0 0 5px ${currentColor}`,
          animation: "smokeFlow 3s ease-in-out infinite",
          transformOrigin: "center left"
        }}
      />

      <div className="relative w-full z-10">
        {/* --- MASCOT --- */}
        <div
          className="absolute top-1/2 pointer-events-none mascot-container"
          style={mascotStyle.style}
        >
           <img
             src={mascotImg}
             alt="Mascot"
             className="w-full h-full object-contain mascot-hero"
           />
        </div>

        {/* --- PORTALS --- */}
        <div className="relative w-full flex justify-between items-center">
          {items.map((item, index) => {
            const isActive = index === activeIndex;
            const portalColor = THEME_COLORS[index % THEME_COLORS.length];

            return (
              <button
                key={index}
                onClick={() => onItemClick(index)}
                className="relative z-10 flex flex-col items-center focus:outline-none touch-manipulation"
              >
                {/* Responsive Portal Size */}
                <div className="relative flex items-center justify-center
                  w-14 h-14       /* Mobile */
                  md:w-24 md:h-24 /* Tablet */
                  lg:w-28 lg:h-28 /* Desktop */
                ">
                  <div
                    className={`
                      relative z-10 transition-all duration-500
                      w-10 h-10       /* Mobile Inner */
                      md:w-16 md:h-16 /* Tablet Inner */
                      lg:w-20 lg:h-20 /* Desktop Inner */
                      ${isActive ? "scale-110 grayscale-0" : "opacity-30 grayscale"}
                    `}
                    style={{
                      animation: isActive ? "portalPulse 4s infinite ease-in-out" : "none"
                    }}
                  >
                     <img
                       src={portalImg}
                       alt="Portal"
                       className="w-full h-full object-contain"
                     />
                  </div>
                </div>

                {/* YEAR TEXT */}
                <span
                  className={`
                    -mt-1 md:-mt-2 
                    text-[10px] md:text-xs lg:text-sm 
                    font-bold tracking-widest transition-all duration-500 font-['Orbitron']
                    ${isActive ? "opacity-100 scale-110" : "text-neutral-600"}
                  `}
                  style={{
                    color: isActive ? portalColor : undefined,
                    textShadow: isActive ? `0 0 10px ${portalColor}80` : 'none'
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