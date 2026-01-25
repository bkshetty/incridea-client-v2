import React, { useState, useMemo, useRef, useCallback } from "react";
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
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const galleryRef = useRef<HTMLDivElement | null>(null);

  const gallerySections = useMemo(
    () =>
      timelineItems.map((year) => ({
        year,
        images: Array.from({ length: 8 }, (_, i) => ({
          id: `${year}-${i}`,
          url: `https://picsum.photos/400/${300 + (i % 3) * 50}?random=${year}-${i}`,
          height: 300 + (i % 3) * 50,
        })),
      })),
    [],
  );

  const handleScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement>) => {
      const target = e.currentTarget;
      const galleryElement = galleryRef.current;
      if (!target || !galleryElement) return;

      const galleryTop = galleryElement.offsetTop;
      const galleryHeight = galleryElement.offsetHeight - target.clientHeight;

      const relativeScroll = Math.max(0, target.scrollTop - galleryTop);
      const progress = Math.min(1, relativeScroll / galleryHeight);

      setScrollProgress(progress);

      const newIndex = Math.min(
        Math.floor(progress * timelineItems.length),
        timelineItems.length - 1,
      );

      if (newIndex !== activeIndex) setActiveIndex(newIndex);
    },
    [activeIndex],
  );

  const handleTimelineClick = (index: number) => {
    const container = scrollContainerRef.current;
    const galleryElement = galleryRef.current;
    if (!container || !galleryElement) return;

    const galleryHeight = galleryElement.offsetHeight - container.clientHeight;
    const targetScroll =
      galleryElement.offsetTop +
      (index / (timelineItems.length - 1)) * galleryHeight;

    container.scrollTo({
      top: targetScroll,
      behavior: "smooth",
    });
  };

  return (
    /* Changed bg-[#0a0a0a] to bg-transparent to show layout background */
    <div className="relative w-full h-screen overflow-hidden bg-transparent selection:bg-cyan-500/30">
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="relative w-full h-full overflow-y-auto overflow-x-hidden scroll-smooth scrollbar-hide touch-pan-y"
      >
        {/* Changed bg-black/60 to bg-transparent */}
        <header className="sticky top-0 z-50 w-full bg-transparent backdrop-blur-xl border-b border-white/5 py-2 md:py-4 transition-all duration-300">
          <HorizontalTimeline
            items={timelineItems}
            activeIndex={activeIndex}
            onItemClick={handleTimelineClick}
            scrollProgress={scrollProgress}
          />
        </header>

        <main
          ref={galleryRef}
          className="w-full flex flex-col items-center pt-4 md:pt-10"
        >
          {gallerySections.map((section) => (
            <section
              key={section.year}
              className="w-full max-w-7xl px-4 sm:px-6 md:px-10 mb-12 md:mb-24"
            >
              <motion.h1
                className="font-['Michroma'] text-2xl sm:text-4xl md:text-6xl mb-6 md:mb-10 text-white/90 tracking-tight"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6 }}
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
                    className="rounded-lg md:rounded-2xl overflow-hidden border border-white/5 shadow-2xl hover:border-cyan-500/30 transition-all duration-500"
                  >
                    <ImageWithSkeleton
                      src={item.url}
                      alt={item.id}
                      height={item.height}
                    />
                  </Box>
                ))}
              </Masonry>
            </section>
          ))}
        </main>

        {/* Removed black gradient background, set to bg-transparent */}
        <section className="relative z-10 w-full min-h-[80vh] md:min-h-screen flex flex-col justify-center items-center bg-transparent py-12 md:py-24 border-t border-white/5">
          <div className="mb-6 md:mb-12 text-center px-4">
            <h2 className="font-['Orbitron'] text-lg md:text-2xl text-cyan-400 tracking-[0.2em] md:tracking-[0.4em] uppercase">
              Memories in Motion
            </h2>
            <div className="h-[2px] w-12 md:w-24 bg-cyan-500 mx-auto mt-4 rounded-full shadow-[0_0_15px_#06b6d4]" />
          </div>

          <Box sx={{ width: "100%", overflow: "hidden" }}>
            <Carousel />
          </Box>
        </section>

        <footer className="w-full py-10 text-center opacity-20">
          <p className="font-['Orbitron'] text-[8px] md:text-[10px] text-white tracking-[0.5em] uppercase">
            Incridea Timeline Terminal
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Gallery;
