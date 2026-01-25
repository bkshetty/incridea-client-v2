import React, { useState, useCallback, useRef } from "react";
import { Box } from "@mui/material";
import Masonry from "@mui/lab/Masonry";

// Imports
import Carousel from "@/components/gallery/Carousel";
import { HorizontalTimeline } from "../components/timeline/HorizontalTimeline";
// Removed TimelineYears import since we are using Horizontal only now

const Gallery: React.FC = () => {
  const [carouselIndex, setCarouselIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0); 
  const carouselSectionRef = useRef<HTMLElement>(null);

  const timelineItems = ["2018", "2019", "2020", "2022", "2023", "2024", "2025"];

  const galleryImages = Array.from({ length: 50 }, (_, i) => ({
    id: i,
    url: `https://picsum.photos/400/${Math.floor(Math.random() * 200) + 300}?random=${i}`,
    height: Math.floor(Math.random() * 200) + 300
  }));

  // Handle scroll to update progress and active index
  const handleGalleryScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    const target = e.currentTarget;
    const scrollHeight = target.scrollHeight - target.clientHeight;
    
    if (scrollHeight <= 0) return;
    
    const currentScroll = target.scrollTop;
    const scrollPercentage = currentScroll / scrollHeight; // 0 to 1
    
    // 1. Update Progress for Mascot Animation
    setScrollProgress(scrollPercentage);
    
    // 2. Update Active Year (Portal Glow)
    const newIndex = Math.min(
      Math.floor(scrollPercentage * timelineItems.length),
      timelineItems.length - 1
    );

    if (newIndex !== carouselIndex && newIndex >= 0) {
      setCarouselIndex(newIndex);
    }
  }, [carouselIndex, timelineItems.length]);

  return (
    <div className="relative h-screen w-full overflow-hidden bg-[#0a0a0a]">
      
      <div className="h-full w-full overflow-y-auto overflow-x-hidden snap-y snap-mandatory scroll-smooth">
        
        {/* Section 1: Horizontal Timeline + Masonry Gallery */}
        <section className="relative z-10 w-full h-screen snap-start snap-always flex flex-col">
          
          {/* TOP BAR: Horizontal Timeline with Mascot */}
          <div className="w-full bg-slate-950/80 backdrop-blur-md border-b border-slate-800 py-6 shrink-0 sticky top-0 z-50"> 
            <HorizontalTimeline
              items={timelineItems}
              activeIndex={carouselIndex}
              onItemClick={setCarouselIndex}
              scrollProgress={scrollProgress} // Passing progress to move mascot
            />
          </div>

          {/* Scrollable Image Gallery */}
          <Box
            onScroll={handleGalleryScroll}
            sx={{
              flex: 1,
              maxWidth: '1200px',
              width: '95%',
              margin: '0 auto',
              overflowY: 'auto',
              overflowX: 'hidden',
              padding: 3,
              backgroundColor: 'transparent',
              "&::-webkit-scrollbar": { display: "none" },
              msOverflowStyle: "none",  
              scrollbarWidth: "none",  
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
                    transition: 'transform 0.3s ease',
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
                    style={{ width: '100%', display: 'block' }}
                  />
                </Box>
              ))}
            </Masonry>
          </Box>
        </section>

        {/* Section 2: Carousel */}
        <section 
          ref={carouselSectionRef}
          className="relative z-10 w-full h-screen snap-start snap-always flex flex-col justify-center bg-black/40 backdrop-blur-sm"
        >
          <Carousel 
            currentIndex={carouselIndex}
            onIndexChange={setCarouselIndex}
          />
        </section>
      </div>
    </div>
  );
};

export default Gallery;