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
          url: `https://picsum.photos/600/${[450, 600, 800][i % 3]}?random=${year}-${i}`,
          ratio: ["aspect-[4/3]", "aspect-square", "aspect-[3/4]"][i % 3],
        })),
      })),
    [],
  );

  /**
   * CONSTANTS FOR ALIGNMENT
   * Navbar Height: 112px
   * Timeline Height: 80px
   * Total Offset: 192px
   */
  const NAVBAR_HEIGHT = 112;
  const TIMELINE_HEIGHT = 80;
  const TOTAL_HEADER_HEIGHT = NAVBAR_HEIGHT + TIMELINE_HEIGHT;

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const galleryElement = galleryRef.current;
    if (!target || !galleryElement) return;

    const sections = galleryElement.querySelectorAll("section");
    const step = 1 / (timelineItems.length - 1);

    let activeIdx = 0;
    let progress = 0;

    // Find current active based on which section is crossing the TOTAL_HEADER_HEIGHT line
    sections.forEach((section, index) => {
      const rect = section.getBoundingClientRect();

      // relativeTop is the distance from the top of the Year Section
      // to the top of the scrollable area
      const relativeTop = rect.top;

      if (relativeTop <= TOTAL_HEADER_HEIGHT + 10) {
        activeIdx = index;
      }
    });

    // Calculate sub-progress between the current and next section
    const currentSection = sections[activeIdx];
    const nextSection = sections[activeIdx + 1];

    if (currentSection && nextSection) {
      const currentRect = currentSection.getBoundingClientRect();
      const nextRect = nextSection.getBoundingClientRect();

      const totalDist = nextRect.top - currentRect.top;
      const traveled = TOTAL_HEADER_HEIGHT - currentRect.top;

      const localPercent = Math.max(0, Math.min(1, traveled / totalDist));
      progress = (activeIdx + localPercent) * step;
    } else {
      progress = activeIdx * step;
    }

    setActiveIndex(activeIdx);
    setScrollProgress(progress);
  }, []);

  const handleTimelineClick = (index: number) => {
    const container = scrollContainerRef.current;
    const galleryElement = galleryRef.current;
    if (!container || !galleryElement) return;

    const sections = galleryElement.querySelectorAll("section");
    const targetSection = sections[index];

    if (targetSection) {
      // Scroll so the top of the section (the Year Title)
      // sits exactly at the bottom of the Timeline
      const targetScroll = targetSection.offsetTop - TOTAL_HEADER_HEIGHT;

      container.scrollTo({
        top: targetScroll,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-transparent selection:bg-cyan-500/30">
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="relative w-full h-full overflow-y-auto overflow-x-hidden scroll-smooth scrollbar-hide touch-pan-y"
      >
        <header className="fixed top-[112px] left-0 z-50 w-full bg-transparent transition-all duration-300">
          <HorizontalTimeline
            items={timelineItems}
            activeIndex={activeIndex}
            onItemClick={handleTimelineClick}
            scrollProgress={scrollProgress}
          />
        </header>

        <main
          ref={galleryRef}
          className="w-full flex flex-col items-center pt-64 overflow-x-hidden"
        >
          {gallerySections.map((section) => (
            <section
              key={section.year}
              className="w-full max-w-7xl px-4 sm:px-6 md:px-10 mb-12 md:mb-24"
            >
              <motion.h1
                className="font-['Michroma'] text-2xl sm:text-2xl md:text-3xl lg:text-5xl mb-0 font-bold bg-gradient-to-b from-white via-white to-transparent bg-clip-text text-transparent tracking-wider py-4"
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

        <section className="relative z-10 w-full min-h-[80vh] md:min-h-screen flex flex-col justify-center items-center bg-transparent py-12 border-t border-white/5">
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
      </div>
    </div>
  );
};

export default Gallery;
