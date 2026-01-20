import React from "react";
import Carousel from "../components/gallery/Carousel";
import { NavLink } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

const Gallery: React.FC = () => {
  return (
    <div className="relative min-h-screen w-full overflow-hidden">

      {/* 1. The 3D Carousel Component */}
      <main className="relative z-10 w-full h-screen">
        <Carousel />
      </main>

      {/* 2. Bottom Instructions */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-50 text-center">
        <p className="font-['Orbitron'] text-[9px] text-white/30 tracking-[0.5em] uppercase animate-pulse">
          Scroll or click side items to navigate the timeline
        </p>
      </div>
    </div>
  );
};

export default Gallery;
