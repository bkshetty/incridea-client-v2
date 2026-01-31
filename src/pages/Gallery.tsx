import React, { useState, useMemo, useRef, useEffect } from "react";
import { HorizontalTimeline } from "../components/gallery/HorizontalTimeline"; // Verify this path

import { Box } from "@mui/material";
import Masonry from "@mui/lab/Masonry";
import { motion } from "framer-motion";
import { ImageWithSkeleton } from "../components/gallery/Skeleton"; // Verify this path
import Carousel from "../components/gallery/Carousel"; // Verify this path

const timelineItems = ["2018", "2019", "2020", "2022", "2023", "2024", "2025"];

const Gallery: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isTimelineVisible, setIsTimelineVisible] = useState(true);

  // REFERENCES
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const carouselSectionRef = useRef<HTMLDivElement | null>(null);
  const galleryRef = useRef<HTMLDivElement | null>(null);

  const gallerySections = useMemo(
    () =>
      timelineItems.map((year) => ({
        year,
        images: Array.from({ length: 6 }, (_, i) => ({
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

  // SCROLL HANDLER
  useEffect(() => {
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const handleScroll = () => {
      const galleryElement = galleryRef.current;
      if (!galleryElement) return;

      // 1. Visibility Check for Timeline
      if (carouselSectionRef.current) {
        const carouselRect = carouselSectionRef.current.getBoundingClientRect();
        setIsTimelineVisible(carouselRect.top > SYNC_LINE + 50);
      }

      // 2. Timeline Progress Sync
      const sections = galleryElement.querySelectorAll("section");
      const step = 1 / (timelineItems.length - 1);

      let activeIdx = 0;
      sections.forEach((section, index) => {
        const rect = section.getBoundingClientRect();
        // Trigger slightly earlier for smoother feel
        if (rect.top <= SYNC_LINE + 150) {
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

    scrollContainer.addEventListener("scroll", handleScroll);
    return () => scrollContainer.removeEventListener("scroll", handleScroll);
  }, [SYNC_LINE]);

  const handleTimelineClick = (index: number) => {
    const scrollContainer = scrollContainerRef.current;
    const galleryElement = galleryRef.current;
    if (!scrollContainer || !galleryElement) return;

    const sections = galleryElement.querySelectorAll("section");
    const targetSection = sections[index] as HTMLElement;

    if (targetSection) {
      const currentScroll = scrollContainer.scrollTop;
      const sectionRectTop = targetSection.getBoundingClientRect().top;
      // Scroll to exactly where the content starts fading in
      const targetScrollTop = currentScroll + (sectionRectTop - SYNC_LINE) + 40; 

      scrollContainer.scrollTo({ top: targetScrollTop, behavior: "smooth" });
    }
  };

  return (
    // MASTER CONTAINER: Fixed Viewport
    <div className="fixed inset-0 w-full h-full overflow-hidden bg-transparent selection:bg-cyan-500/30">
      
      {/* 1. TIMELINE HEADER (Stationary) */}
      <header
        className="absolute left-0 z-50 w-full transition-all duration-500 ease-in-out pointer-events-none" 
        style={{
          top: `${NAVBAR_HEIGHT}px`,
          transform: isTimelineVisible ? "translateY(0)" : "translateY(-200%)",
          opacity: isTimelineVisible ? 1 : 0,
        }}
      >
        <div className="pointer-events-auto">
          <HorizontalTimeline
            items={timelineItems}
            activeIndex={activeIndex}
            onItemClick={handleTimelineClick}
            scrollProgress={scrollProgress}
          />
        </div>
      </header>

      {/* 2. SCROLLABLE CONTENT LAYER */}
      <div
        ref={scrollContainerRef}
        className="w-full h-full overflow-y-auto overflow-x-hidden no-scrollbar relative z-0"
        style={{
          // MASK FIX: Pure transparency.
          // The gradient makes images "vanish" as they slide up towards the timeline.
          maskImage: `linear-gradient(to bottom, transparent 0px, transparent ${NAVBAR_HEIGHT + TIMELINE_HEIGHT}px, black ${NAVBAR_HEIGHT + TIMELINE_HEIGHT + 100}px, black 100%)`,
          WebkitMaskImage: `linear-gradient(to bottom, transparent 0px, transparent ${NAVBAR_HEIGHT + TIMELINE_HEIGHT}px, black ${NAVBAR_HEIGHT + TIMELINE_HEIGHT + 100}px, black 100%)`,
        }}
      >
        <main
          ref={galleryRef}
          className="w-full flex flex-col items-center pt-[320px] pb-40" // pb-40 solves the footer overlap
        >
          {gallerySections.map((section) => (
            <section
              key={section.year}
              // GRID FIX: Changed max-w-5xl to max-w-4xl to ensure it fits INSIDE the timeline width
              className="w-full max-w-4xl px-4 sm:px-6 mx-auto mb-12 md:mb-24"
            >
              <motion.h1
                className="font-['Michroma'] text-2xl sm:text-3xl md:text-4xl lg:text-5xl mb-0 font-bold bg-gradient-to-b from-white via-white to-transparent bg-clip-text text-transparent tracking-wider py-4 ml-2"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ root: scrollContainerRef, once: true, margin: "-10%" }}
                transition={{ duration: 0.8 }}
              >
                {section.year}
              </motion.h1>

              <Masonry
                columns={{ xs: 2, sm: 3, lg: 3 }}
                // GRID FIX: Reduced spacing to prevent overflow and tighten the look
                spacing={{ xs: 1, sm: 2, md: 2 }}
              >
                {section.images.map((item) => (
                  <Box
                    key={item.id}
                    className={`relative w-full rounded-lg md:rounded-xl overflow-hidden border border-white/5 shadow-2xl hover:border-cyan-500/30 transition-all duration-500 ${item.ratio}`}
                  >
                    <ImageWithSkeleton src={item.url} alt={item.id} />
                  </Box>
                ))}
              </Masonry>
            </section>
          ))}

          <section
            ref={carouselSectionRef}
            className="relative w-full flex flex-col justify-center items-center bg-transparent py-24 border-t border-white/5"
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

          {/* Spacer to allow scrolling past the fixed footer if it exists */}
          <div className="h-32 w-full"></div>
        </main>
      </div>

      <style>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default Gallery;