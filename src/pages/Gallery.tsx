import React, { useState, useCallback, useRef } from "react";
import Carousel from "../components/gallery/Carousel";
import TimelineYears from "../components/gallery/TimelineYears";
import { HorizontalTimeline } from "@/components/timeline/HorizontalTimeline";
import { Box } from "@mui/material";
import Masonry from "@mui/lab/Masonry";

const Gallery: React.FC = () => {
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [isScrolling, setIsScrolling] = useState(false);
  const carouselSectionRef = useRef<HTMLElement>(null);

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

  // Sample image data for masonry gallery
  const galleryImages = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    url: `https://picsum.photos/400/${Math.floor(Math.random() * 200) + 300}?random=${i}`,
    height: Math.floor(Math.random() * 200) + 300
  }));

  // Handle scroll to update timeline year and auto-scroll to next section
  const handleGalleryScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const scrollHeight = target.scrollHeight - target.clientHeight;
    if (scrollHeight <= 0) return;
    const scrollPercentage = target.scrollTop / scrollHeight;
    
    // Hide TimelineYears when scrolling starts
    if (target.scrollTop > 10 && !isScrolling) {
      setIsScrolling(true);
    } else if (target.scrollTop <= 10 && isScrolling) {
      setIsScrolling(false);
    }
    
    const newIndex = Math.min(
      Math.floor(scrollPercentage * timelineItems.length),
      timelineItems.length - 1
    );
    if (newIndex !== carouselIndex && newIndex >= 0) {
      setCarouselIndex(newIndex);
    }
    
    // Auto-scroll to carousel section when reaching bottom of gallery
    if (scrollPercentage >= 0.98) {
      carouselSectionRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [carouselIndex, timelineItems.length, isScrolling]);

  return (
    <div className="relative h-screen w-full overflow-y-auto overflow-x-hidden snap-y snap-mandatory scroll-smooth">
      <div className={`transition-opacity duration-300 ${isScrolling ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}>
        <TimelineYears />
      </div>

      {/* Section 1: Timeline + Masonry Gallery (snaps as one unit) */}
      <section className="relative z-10 w-full h-screen snap-start snap-always flex flex-col">
        {/* Timeline at top */}
        <div className="w-full bg-slate-950/50 backdrop-blur-md border-b border-slate-800 py-4 shrink-0">
          <HorizontalTimeline
            items={timelineItems}
            activeIndex={carouselIndex}
            onItemClick={setCarouselIndex}
          />
        </div>

        {/* Scrollable Image Gallery - fills remaining space */}
        <Box
          onScroll={handleGalleryScroll}
          sx={{
            flex: 1,
            maxWidth: '1200px',
            width: '95%',
            margin: '16px auto',
            overflowY: 'auto',
            overflowX: 'hidden',
            padding: 3,
            backgroundColor: 'transparent',
            borderRadius: '16px',
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

      {/* Section 2: Carousel + CTA (snaps here on scroll) */}
      <section 
        ref={carouselSectionRef}
        className="relative z-10 w-full h-screen snap-start snap-always flex flex-col justify-center"
      >
        <Carousel 
          currentIndex={carouselIndex}
          onIndexChange={setCarouselIndex}
        />

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