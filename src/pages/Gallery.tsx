import React, { useState, useMemo, useRef, useEffect } from "react";
import { HorizontalTimeline } from "@/components/gallery/HorizontalTimeline";
import { Box } from "@mui/material";
import Masonry from "@mui/lab/Masonry";
import { motion } from "framer-motion";
import { ImageWithSkeleton } from "../components/gallery/Skeleton";
import Carousel from "../components/gallery/Carousel";

const timelineItems = ["2018", "2019", "2020", "2022", "2023", "2024", "2025"];

const Gallery: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isTimelineVisible, setIsTimelineVisible] = useState(true);

  const galleryRef = useRef<HTMLDivElement | null>(null);
  const carouselSectionRef = useRef<HTMLDivElement | null>(null);

  const gallerySections = useMemo(
    () =>
      timelineItems.map((year) => ({
        year,
        images: Array.from({ length: 8 }, (_, i) => ({
          id: `${year}-${i}`,
          url: `https://picsum.photos/600/${[450, 600, 800][i % 3]}?random=${year}-${i}`,
          ratio: ["aspect-[4/3]", "aspect-square", "aspect-[3/4]"][i % 3],
        })),
      })),
    [],
  );

  const NAVBAR_HEIGHT = 112;
  const TIMELINE_HEIGHT = 80;
  const SYNC_LINE = NAVBAR_HEIGHT + TIMELINE_HEIGHT;

  useEffect(() => {
    const handleGlobalScroll = () => {
      const galleryElement = galleryRef.current;
      if (!galleryElement) return;

      // 1. Visibility Check for Carousel
      if (carouselSectionRef.current) {
        const carouselRect = carouselSectionRef.current.getBoundingClientRect();
        // Trigger visibility based on viewport top
        setIsTimelineVisible(carouselRect.top > SYNC_LINE + 20);
      }

      // 2. Sync Logic
      const sections = galleryElement.querySelectorAll("section");
      const step = 1 / (timelineItems.length - 1);

      let activeIdx = 0;
      sections.forEach((section, index) => {
        const rect = section.getBoundingClientRect();
        if (rect.top <= SYNC_LINE + 10) {
          activeIdx = index;
        }
      });

      setActiveIndex(activeIdx);

      const currentSection = sections[activeIdx];
      const nextSection = sections[activeIdx + 1];

      if (currentSection && nextSection) {
        const currRect = currentSection.getBoundingClientRect();
        const nextRect = nextSection.getBoundingClientRect();
        const totalDistance = nextRect.top - currRect.top;
        const progressToNext = (SYNC_LINE - currRect.top) / totalDistance;
        const clampedProgress = Math.max(0, Math.min(1, progressToNext));
        setScrollProgress((activeIdx + clampedProgress) * step);
      } else {
        setScrollProgress(activeIdx * step);
      }
    };

    window.addEventListener("scroll", handleGlobalScroll);
    return () => window.removeEventListener("scroll", handleGlobalScroll);
  }, [SYNC_LINE]);

  const handleTimelineClick = (index: number) => {
    const galleryElement = galleryRef.current;
    if (!galleryElement) return;

    const sections = galleryElement.querySelectorAll("section");
    const targetSection = sections[index] as HTMLElement;

    if (targetSection) {
      const targetPos =
        targetSection.getBoundingClientRect().top + window.scrollY - SYNC_LINE;
      window.scrollTo({ top: targetPos, behavior: "smooth" });
    }
  };

  return (
    /* FIX: Changed h-screen to min-h-screen and removed h-full. 
       This allows the document body to handle the scroll naturally.
    */
    <div className="relative w-full min-h-screen bg-transparent selection:bg-cyan-500/30">
      {/* CSS INJECTION: 
          1. Force body to allow vertical scroll but hide horizontal.
          2. Prevent any inner containers from generating their own scrollbars.
      */}
      <style>{`
        html, body {
          overflow-x: hidden !important;
          overflow-y: auto !important;
          height: auto !important;
        }
        /* Hide horizontal scrollbar globally */
        ::-webkit-scrollbar:horizontal {
          display: none;
        }
      `}</style>

      {/* Fixed Timeline Header */}
      <header
        className="fixed top-[112px] left-0 z-50 w-full bg-transparent transition-all duration-500 ease-in-out"
        style={{
          transform: isTimelineVisible ? "translateY(0)" : "translateY(-250px)",
          opacity: isTimelineVisible ? 1 : 0,
          pointerEvents: isTimelineVisible ? "auto" : "none",
        }}
      >
        <HorizontalTimeline
          items={timelineItems}
          activeIndex={activeIndex}
          onItemClick={handleTimelineClick}
          scrollProgress={scrollProgress}
        />
      </header>

      <main
        ref={galleryRef}
        className="w-full flex flex-col items-center pt-64"
      >
        {gallerySections.map((section) => (
          <section
            key={section.year}
            className="w-full max-w-7xl px-4 pl-8 md:pl-20 sm:px-6 md:px-10 mb-12 md:mb-24"
          >
            <motion.h1
              className="font-['Michroma'] text-2xl sm:text-2xl md:text-3xl lg:text-5xl mb-0 font-bold bg-gradient-to-b from-white via-white to-transparent bg-clip-text text-transparent tracking-wider py-4 ml-2 md:ml-4"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.8 }}
            >
              {section.year}
            </motion.h1>

            <Masonry
              columns={{ xs: 2, sm: 3, lg: 4 }}
              spacing={{ xs: 1.5, sm: 2, md: 3 }}
            >
              {section.images.map((item) => (
                <Box
                  key={item.id}
                  className={`relative w-full rounded-lg md:rounded-2xl overflow-hidden border border-white/5 shadow-2xl hover:border-cyan-500/30 transition-all duration-500 ${item.ratio}`}
                >
                  <ImageWithSkeleton src={item.url} alt={item.id} />
                </Box>
              ))}
            </Masonry>
          </section>
        ))}
      </main>

      <section
        ref={carouselSectionRef}
        className="relative z-10 w-full min-h-screen flex flex-col justify-center items-center bg-transparent py-24 border-t border-white/5"
      >
        <div className="-mb-12 md:-mb-10 text-center px-4">
          <h2 className="font-['Orbitron'] text-lg md:text-2xl text-cyan-400 tracking-[0.2em] md:tracking-[0.4em] uppercase">
            Memories in Motion
          </h2>
          <div className="h-[2px] w-12 md:w-24 bg-cyan-500 mx-auto mt-0 md:mt-1 rounded-full shadow-[0_0_15px_#06b6d4]" />
        </div>
        <Box sx={{ width: "100%", overflow: "hidden" }}>
          <Carousel />
        </Box>
      </section>
         <div className="w-full py-0 -mt-20 md:-mt-12 text-center">
      <p className="font-['Orbitron'] text-xs sm:text-sm text-white/40 hover:text-white/60 tracking-[0.5em] uppercase animate-pulse transition-colors duration-300">
        Scroll or click timeline items to navigate
      </p>
      </div>
    </div>
  );
};

export default Gallery;
