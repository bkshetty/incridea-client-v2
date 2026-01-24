import React, { useEffect, useMemo, useRef, useState } from "react";
import Carousel from "../components/gallery/Carousel";
import { HorizontalTimeline } from "@/components/gallery/HorizontalTimeline";
import { Box } from "@mui/material";
import Masonry from "@mui/lab/Masonry";
import { motion } from "framer-motion";
const timelineItems = ["2018", "2019", "2020", "2021", "2022", "2023", "2024"];

const Gallery: React.FC = () => {
  const [timelineIndex, setTimelineIndex] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const sectionRefs = useRef<Array<HTMLElement | null>>([]);

  const gallerySections = useMemo(
    () =>
      timelineItems.map((year) => ({
        year,
        images: Array.from({ length: 12 }, (_, i) => {
          const height = 320 + ((i * 23 + Number(year)) % 140);
          return {
            id: `${year}-${i}`,
            url: `https://picsum.photos/400/${height}?year=${year}&img=${i}`,
            height,
          };
        }),
      })),
    []
  );

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        const next = visible[0];
        if (!next) return;

        const indexAttr = next.target.getAttribute("data-index");
        const nextIndex = indexAttr ? Number(indexAttr) : -1;

        if (nextIndex >= 0) {
          setTimelineIndex((prev) => (prev === nextIndex ? prev : nextIndex));
        }
      },
      { root: container, threshold: [0.35, 0.55, 0.75] }
    );

    sectionRefs.current.forEach((section) => section && observer.observe(section));
    return () => observer.disconnect();
  }, []);

  const handleTimelineClick = (index: number) => {
    setTimelineIndex(index);
    const section = sectionRefs.current[index];
    const container = scrollContainerRef.current;
    if (section && container) {
      const stickyHeaderHeight = 140; // spacing for year heading
      const sectionTop = section.offsetTop;
      container.scrollTo({
        top: sectionTop - stickyHeaderHeight,
        behavior: "smooth"
      });
    }
  };

  return (
    <div
      ref={scrollContainerRef}
      className="relative w-full h-screen overflow-y-auto overflow-x-hidden scroll-smooth bg-slate-950 scrollbar-hide"
    >
      <div className="sticky top-0 z-20 w-full bg-slate-950/50 backdrop-blur-md border-b border-slate-800 py-4">
        <HorizontalTimeline
          items={timelineItems}
          activeIndex={timelineIndex}
          onItemClick={handleTimelineClick}
        />
      </div>

      {gallerySections.map((section, index) => (
        <React.Fragment key={section.year}>
          <div className="relative w-full flex items-center justify-start z-0 pt-8" style={{ maxWidth: "1200px", width: "95%", margin: "0 auto" }}>
            <motion.h1
              className="font-['Michroma'] text-xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-left bg-gradient-to-b from-white via-white to-transparent bg-clip-text text-transparent tracking-wider"
              initial={{ opacity: 0, y: 80 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{
                duration: 1,
                ease: "easeOut"
              }}
            >
              {section.year}
            </motion.h1>
          </div>
          
          <section
            data-index={index}
            ref={(el) => {
              sectionRefs.current[index] = el;
            }}
            className="relative z-10 w-full min-h-screen -mt-8"
          >
            <Box
              sx={{
                maxWidth: "1200px",
                width: "95%",
                margin: "0 auto",
                padding: 3,
                backgroundColor: "transparent",
                borderRadius: "16px",
                position: "relative",
                zIndex: 20,
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
                        transform: "scale(1.03)",
                        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.3)",
                      },
                    }}
                  >
                    <img
                      src={item.url}
                      alt={`Gallery ${item.id}`}
                      loading="lazy"
                      style={{ width: "100%", display: "block" }}
                    />
                  </Box>
                ))}
              </Masonry>
            </Box>
          </section>
        </React.Fragment>
      ))}

      <section className="relative z-10 w-full min-h-screen flex flex-col justify-center py-12">
        <Carousel />
        <div className="w-full py-6 text-center">
          <p className="font-['Orbitron'] text-[9px] text-white/30 tracking-[0.5em] uppercase animate-pulse">
            Scroll or click side items to navigate the timeline
          </p>
        </div>
      </section>
    </div>
  );
};

export default Gallery;