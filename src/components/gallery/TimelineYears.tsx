import React from "react";

const defaultYears = ["2022", "2023", "2024"];

interface TimelineYearsProps {
  years?: string[];
}

const TimelineYears: React.FC<TimelineYearsProps> = ({ years = defaultYears }) => {
  return (
    <div className="pointer-events-none absolute left-6 top-16 z-40 hidden h-[70vh] w-32 md:flex">
      <div className="relative h-full w-full">
        <div className="absolute left-4 top-0 h-full w-[2px] bg-gradient-to-b from-transparent via-white/30 to-transparent" />
        {years.map((year, index) => {
          const position = years.length === 1 ? 0 : (index / (years.length - 1)) * 100;
          return (
            <div
              key={year}
              className="absolute flex items-center gap-2"
              style={{ top: `${position}%`, transform: "translateY(-50%)" }}
            >
              <div className="h-3 w-3 rounded-full bg-white/70" />
              <span className="text-sm font-semibold text-white/80">{year}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TimelineYears;
