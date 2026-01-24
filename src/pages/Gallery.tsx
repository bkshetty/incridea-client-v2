import React, { useState, useCallback } from "react";
import Carousel from "../components/gallery/Carousel";
import { HorizontalTimeline } from "@/components/timeline/HorizontalTimeline";
import { Box } from "@mui/material";
import Masonry from "@mui/lab/Masonry";

const Gallery: React.FC = () => {
  const [timelineIndex, setTimelineIndex] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);

  // Timeline labels for gallery years
  const timelineItems = [
    "2018",
    "2019", 
    "2020",
    "2021",
    "2022",
    "2023",
    "2024"
  ];

  // Sample image data for masonry gallery
  const galleryImages = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    url: `https://picsum.photos/400/${Math.floor(Math.random() * 200) + 300}?random=${i}`,
    height: Math.floor(Math.random() * 200) + 300
  }));

  // Handle main page scroll to update timeline year
  const handlePageScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const scrollTop = target.scrollTop;
    
    // Hide TimelineYears when scrolling starts
    if (scrollTop > 10 && !isScrolling) {
      setIsScrolling(true);
    } else if (scrollTop <= 10 && isScrolling) {
      setIsScrolling(false);
    }
    
    // Calculate which year based on scroll position
    // Gallery section is approximately 0-70% of total scroll
    const totalHeight = target.scrollHeight - target.clientHeight;
    const galleryEndPixels = totalHeight * 0.7; // Gallery takes 70% of scroll
    
    if (scrollTop < galleryEndPixels) {
      // We're in the gallery section
      const galleryScrollPercentage = scrollTop / galleryEndPixels;
      const newIndex = Math.min(
        Math.floor(galleryScrollPercentage * timelineItems.length),
        timelineItems.length - 1
      );
      if (newIndex !== timelineIndex && newIndex >= 0) {
        setTimelineIndex(newIndex);
      }
    }
  }, [timelineIndex, timelineItems.length, isScrolling]);

  return (
    <div 
      className="relative w-full h-screen overflow-y-auto overflow-x-hidden scroll-smooth bg-slate-950 scrollbar-hide"
      onScroll={handlePageScroll}
    >
      

      {/* Section 1: Timeline + Masonry Gallery */}
      <section className="relative z-10 w-full min-h-screen">
        {/* Sticky Timeline at top */}
        <div className="sticky top-0 z-20 w-full bg-slate-950/50 backdrop-blur-md border-b border-slate-800 py-4">
          <HorizontalTimeline
            items={timelineItems}
            activeIndex={timelineIndex}
            onItemClick={setTimelineIndex}
          />
        </div>

        {/* Image Gallery - no internal scroll, flows naturally */}
        <Box
          sx={{
            maxWidth: '1200px',
            width: '95%',
            margin: '16px auto',
            padding: 3,
            backgroundColor: 'transparent',
            borderRadius: '16px',
            paddingBottom: '40px', // Add spacing before carousel
          }}
        >
          <Masonry columns={{ xs: 2, sm: 2, md: 3, lg: 4 }} spacing={2}>
            {galleryImages.map((item) => (
              <Box
                key={item.id}
                sx={{
                  borderRadius: 3,
                  overflow: 'hidden',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.2)',
                  '&:hover': {
                    transform: 'scale(1.03)',
                    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.3)',
                  },
                }}
              >
                <img
                  src={item.url}
                  alt={`Gallery ${item.id}`}
                  loading="lazy"
                  style={{
                    width: '100%',
                    display: 'block',
                  }}
                />
              </Box>
            ))}
          </Masonry>
        </Box>
      </section>

      {/* Section 2: Carousel + CTA */}
      <section className="relative z-10 w-full min-h-screen flex flex-col justify-center py-12">
        <Carousel />

        {/* Bottom CTA */}
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