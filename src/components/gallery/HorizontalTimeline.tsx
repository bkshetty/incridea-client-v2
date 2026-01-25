import React, { useMemo, useState, useEffect } from "react";
import portalImg from "../../assets/portal.png";
import mascotImg from "../../assets/mascot.png";

interface HorizontalTimelineProps {
  items: string[];
  activeIndex: number;
  onItemClick: (index: number) => void;
  scrollProgress: number;
}

const THEME_COLORS = ["#ffffff", "#ffffff", "#ffffff", "#ffffff", "#00A4E4", "#CC52FF", "#00ffaa"];

export const HorizontalTimeline: React.FC<HorizontalTimelineProps> = ({
  items,
  activeIndex,
  onItemClick,
  scrollProgress,
}) => {
  const currentColor = THEME_COLORS[activeIndex % THEME_COLORS.length];
  const [offsets, setOffsets] = useState({ base: 80, portalSize: 80 });

  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      if (w < 640) setOffsets({ base: 40, portalSize: 40 });
      else if (w < 1024) setOffsets({ base: 72, portalSize: 64 });
      else setOffsets({ base: 110, portalSize: 80 });
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
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

    // --- CRITICAL FIX: REFINED VORTEX THRESHOLD ---
    // Increased precision for the 2019 portal transition
    const threshold = 0.04; 
    let opacity = 1;
    let scale = 1;
    let zDepth = 50;

    if (minDistance < threshold && closestIdx !== 0) {
      const ratio = minDistance / threshold;
      // Power curve for smoother sucked-in effect
      scale = Math.max(0.1, Math.pow(ratio, 0.6));
      opacity = Math.pow(ratio, 2);
      // Logic to push mascot visually "inside"
      zDepth = minDistance < (threshold / 2.5) ? 5 : 50;
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
        transition: "opacity 0.1s linear, scale 0.1s cubic-bezier(0.4, 0, 0.2, 1)"
      }
    };
  }, [scrollProgress, items.length, offsets]);

  return (
    <div className="w-full max-w-7xl mx-auto px-2 md:px-4 flex items-center relative h-20 sm:h-24 md:h-28 [perspective:1200px]">
      <style>{`
        @keyframes portalPulse { 0%, 100% { filter: drop-shadow(0 0 8px rgba(0, 164, 228, 0.5)); } 50% { filter: drop-shadow(0 0 20px rgba(0, 164, 228, 0.9)); } }
        @keyframes mascotFloat { 0%, 100% { transform: translateY(0px) rotate(-1deg); } 50% { transform: translateY(-8px) rotate(1deg); } }
        @keyframes smokeTrail { 0%, 100% { opacity: 0.3; transform: translateY(-50%) scaleY(0.8); filter: blur(4px); } 50% { opacity: 0.6; transform: translateY(-50%) scaleY(1.4); filter: blur(6px); } }
      `}</style>

      {/* --- SMOKY TRAIL --- */}
      <div 
        className="absolute top-1/2 z-0 rounded-full transition-colors duration-500"
        style={{
          left: `${offsets.base}px`,
          width: `calc(${mascotStyle.cssPos} - ${offsets.base}px)`,
          height: '4px',
          background: `linear-gradient(90deg, transparent, ${currentColor})`,
          boxShadow: `0 0 20px ${currentColor}`,
          animation: "smokeTrail 2.5s ease-in-out infinite",
          transformOrigin: "left center"
        }}
      />

      <div className="relative w-full z-10 [transform-style:preserve-3d]">
        {/* --- MASCOT --- */}
        <div
          className="absolute top-1/2 pointer-events-none w-14 h-14 sm:w-20 sm:h-20 md:w-28 md:h-28 lg:w-32 lg:h-32"
          style={mascotStyle.style}
        >
          <img src={mascotImg} alt="Mascot" className="w-full h-full object-contain" style={{ animation: 'mascotFloat 3s ease-in-out infinite' }} />
        </div>

        {/* --- PORTALS --- */}
        <div className="relative w-full flex justify-between items-center [transform-style:preserve-3d]">
          {items.map((item, index) => {
            const isActive = index === activeIndex;
            const portalColor = THEME_COLORS[index % THEME_COLORS.length];
            const step = 1 / (items.length - 1);
            const diff = mascotStyle.rawP - (index * step);
            
            // --- CRITICAL FIX: ROTATION BUFFER ---
            // If mascot is physically "inside" the portal, reset rotation to 0 
            // This prevents the portal from spinning wildly while the mascot is entering.
            const isEntering = Math.abs(diff) < 0.02 && index !== 0;
            const rotateY = isEntering ? 0 : Math.max(-45, Math.min(45, diff * -500));

            return (
              <button 
                key={item} 
                onClick={() => onItemClick(index)} 
                className="relative flex flex-col items-center outline-none group px-1 sm:px-0 z-20"
              >
                <div className="w-10 h-10 sm:w-14 sm:h-14 md:w-20 md:h-20 lg:w-24 lg:h-24 flex items-center justify-center [transform-style:preserve-3d]">
                  <div
                    className={`relative z-30 transition-all duration-300 ease-out ${isActive ? "scale-110 grayscale-0" : "opacity-40 grayscale"}`}
                    style={{ 
                      transform: `rotateY(${rotateY}deg)`, 
                      animation: isActive ? "portalPulse 4s infinite ease-in-out" : "none" 
                    }}
                  >
                    <img src={portalImg} alt="Portal" className="w-full h-full object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.2)]" />
                  </div>
                </div>

                <span 
                  className={`-mt-1 text-[9px] sm:text-[10px] md:text-xs font-bold tracking-tighter sm:tracking-widest font-['Orbitron'] transition-all duration-300 ${isActive ? "opacity-100 scale-110" : "text-neutral-600"}`} 
                  style={{ 
                    color: isActive ? portalColor : undefined,
                    textShadow: isActive ? `0 0 8px ${portalColor}66` : 'none'
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