import React, { useState } from "react";
import Carousel from "../components/gallery/Carousel";
import { HorizontalTimeline } from "@/components/timeline/HorizontalTimeline";

const Gallery: React.FC = () => {
  const [carouselIndex, setCarouselIndex] = useState(3);

  // Timeline labels matching carousel items
  const timelineItems = [
    "2018",
    "2019", 
    "2020",
    "2021",
    "2022",
    "2023",
    "2024"
  ];

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* 1. The 3D Carousel Component */}
<main className="relative z-10 w-full h-screen flex flex-col justify-end">
  <Carousel 
    currentIndex={carouselIndex}
    onIndexChange={setCarouselIndex}
  />

  {/* Timeline DIRECTLY under carousel buttons */}
  <div className="w-full bg-slate-950/50 backdrop-blur-md border-t border-slate-800 pt-4 pb-2">
    <HorizontalTimeline
      items={timelineItems}
      activeIndex={carouselIndex}
      onItemClick={setCarouselIndex}
    />
  </div>
</main>



      {/* 3. Bottom Instructions */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-50 text-center">
        <p className="font-['Orbitron'] text-[9px] text-white/30 tracking-[0.5em] uppercase animate-pulse">
          Scroll or click side items to navigate the timeline
        </p>
      </div>
    </div>
  );
};

export default Gallery;