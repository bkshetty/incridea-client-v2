import React, { useEffect, useMemo, useRef, useState } from "react";
import Carousel from "../components/gallery/Carousel";
import { HorizontalTimeline } from "@/components/timeline/HorizontalTimeline";
import { Box } from "@mui/material";
import Masonry from "@mui/lab/Masonry";

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
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
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
        <section
          key={section.year}
          data-index={index}
          ref={(el) => {
            sectionRefs.current[index] = el;
          }}
          className="relative z-10 w-full min-h-screen"
        >
          <Box
            sx={{
              maxWidth: "1200px",
              width: "95%",
              margin: "48px auto",
              padding: 3,
              backgroundColor: "transparent",
              borderRadius: "16px",
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