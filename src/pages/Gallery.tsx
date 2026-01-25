import React, { useState, useMemo, useRef, useCallback } from "react";
import { HorizontalTimeline } from "@/components/gallery/HorizontalTimeline"; // Adjust path as needed
import { Box } from "@mui/material";
import Masonry from "@mui/lab/Masonry";
import { motion } from "framer-motion";
import { ImageWithSkeleton } from "../components/gallery/Skeleton"; // Adjust path
import Carousel from "../components/gallery/Carousel";

// Define your timeline items once
const timelineItems = ["2018", "2019", "2020", "2022", "2023", "2024", "2025"];

const Gallery: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  // Generate sections for the gallery based on timelineItems
  const gallerySections = useMemo(
    () =>
      timelineItems.map((year, yearIndex) => ({
        year,
        yearIndex,
        // Create 12 random images per year for the masonry layout
        images: Array.from({ length: 12 }, (_, i) => {
          const height = 320 + ((i * 23 + Number(year)) % 140);
          return {
            id: `${year}-${i}`,
            url: `https://picsum.photos/400/${height}?random=${year}-${i}`,
            height,
          };
        }),
      })),
    []
  );

  // Unified Scroll Handler: Updates both Mascot Progress & Active Year
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const scrollHeight = target.scrollHeight - target.clientHeight;

    if (scrollHeight <= 0) return;

    const currentScroll = target.scrollTop;
    // Calculate raw 0-1 progress
    const progress = currentScroll / scrollHeight;
    setScrollProgress(progress);

    // Calculate which year is active based on scroll sections
    const newIndex = Math.min(
      Math.floor(progress * timelineItems.length),
      timelineItems.length - 1
    );

    if (newIndex !== activeIndex) {
      setActiveIndex(newIndex);
    }
  }, [activeIndex]);

  // Handle clicking a portal: Smooth scroll to the approximate position
  const handleTimelineClick = (index: number) => {
    const container = scrollContainerRef.current;
    if (!container) return;

    setActiveIndex(index);
    
    // Estimate scroll position: (Index / TotalItems) * TotalScrollHeight
    const scrollHeight = container.scrollHeight - container.clientHeight;
    const targetScroll = (index / (timelineItems.length - 1)) * scrollHeight;

    container.scrollTo({
      top: targetScroll,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#0a0a0a]">
      {/* Main Scroll Container 
         - Handles the scroll events
         - Contains Sticky Header + Gallery Content + Carousel
      */}
      <div
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="relative w-full h-full overflow-y-auto overflow-x-hidden scroll-smooth scrollbar-hide"
      >
        {/* Sticky Timeline Header */}
        <div className="sticky top-0 z-50 w-full bg-slate-950/80 backdrop-blur-md border-b border-slate-800 py-4 shadow-lg">
          <HorizontalTimeline
            items={timelineItems}
            activeIndex={activeIndex}
            onItemClick={handleTimelineClick}
            scrollProgress={scrollProgress}
          />
        </div>

        {/* Gallery Content */}
        <div className="w-full flex flex-col items-center pt-8">
          {gallerySections.map((section) => (
            <React.Fragment key={section.year}>
              {/* Year Heading */}
              <div
                className="w-full pt-12 pb-4 px-4 max-w-[1200px]"
              >
                <motion.h1
                  className="font-['Michroma'] text-3xl md:text-5xl font-bold text-left bg-gradient-to-b from-white via-white to-transparent bg-clip-text text-transparent tracking-wider"
                  initial={{ opacity: 0, x: -50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                >
                  {section.year}
                </motion.h1>
              </div>

              {/* Masonry Grid */}
              <Box
                sx={{
                  maxWidth: "1200px",
                  width: "95%",
                  mb: 8, // Spacing between years
                }}
              >
                <Masonry columns={{ xs: 2, sm: 2, md: 3, lg: 4 }} spacing={2}>
                  {section.images.map((item) => (
                    <Box
                      key={item.id}
                      sx={{
                        borderRadius: 3,
                        overflow: "hidden",
                        border: "1px solid rgba(255, 255, 255, 0.08)",
                        transition: "transform 0.3s ease, box-shadow 0.3s ease",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
                        "&:hover": {
                          transform: "scale(1.02)",
                          boxShadow: "0 8px 24px rgba(0, 0, 0, 0.3)",
                          zIndex: 10,
                        },
                      }}
                    >
                      <ImageWithSkeleton
                        src={item.url}
                        alt={`Gallery ${item.id}`}
                        height={item.height}
                      />
                    </Box>
                  ))}
                </Masonry>
              </Box>
            </React.Fragment>
          ))}
          
          <div className="w-full py-12 text-center">
            <p className="font-['Orbitron'] text-[10px] text-white/30 tracking-[0.5em] uppercase animate-pulse">
              Scroll for Highlights
            </p>
          </div>
        </div>

        {/* Carousel Section - MOVED INSIDE THE SCROLL CONTAINER */}
        <section className="relative z-10 w-full min-h-screen flex flex-col justify-center py-12 bg-black/40 backdrop-blur-sm">
          <Carousel />
          <div className="w-full py-6 text-center">
            <p className="font-['Orbitron'] text-[9px] text-white/30 tracking-[0.5em] uppercase animate-pulse">
              End of Gallery
            </p>
          </div>
        </section>

      </div>
    </div>
  );
};

export default Gallery;