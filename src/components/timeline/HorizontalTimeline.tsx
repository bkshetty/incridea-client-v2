import React from "react";

interface HorizontalTimelineProps {
  items: string[];
  activeIndex: number;
  onItemClick: (index: number) => void;
}

export const HorizontalTimeline: React.FC<HorizontalTimelineProps> = ({
  items,
  activeIndex,
  onItemClick,
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <div className="relative flex items-center justify-between">
        {/* Horizontal connecting line */}
        <div className="absolute top-1/2 left-0 right-0 h-[2px] bg-neutral-700 -translate-y-1/2" />
        
        {/* Active progress line */}
        <div
          className="absolute top-1/2 left-0 h-[2px] bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 -translate-y-1/2 transition-all duration-500 ease-out"
          style={{
            width: `${(activeIndex / (items.length - 1)) * 100}%`,
          }}
        />

        {/* Timeline items */}
        {items.map((item, index) => {
          const isActive = index === activeIndex;
          const isPast = index < activeIndex;

          return (
            <button
              key={index}
              onClick={() => onItemClick(index)}
              className="relative z-10 flex flex-col items-center group transition-all duration-300"
            >
              {/* Circle indicator */}
              <div
                className={`
                  w-8 h-8 rounded-full border-2 transition-all duration-300
                  ${
                    isActive
                      ? "bg-blue-500 border-blue-400 scale-125 shadow-[0_0_20px_rgba(59,130,246,0.5)]"
                      : isPast
                        ? "bg-neutral-600 border-neutral-500"
                        : "bg-neutral-800 border-neutral-600"
                  }
                  hover:scale-110 hover:border-blue-400
                `}
              >
                {isActive && (
                  <div className="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-75" />
                )}
              </div>

              {/* Label */}
              <span
                className={`
                  mt-3 text-sm font-semibold transition-all duration-300
                  ${
                    isActive
                      ? "text-blue-400 scale-110"
                      : "text-neutral-400 group-hover:text-blue-300"
                  }
                `}
              >
                {item}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
