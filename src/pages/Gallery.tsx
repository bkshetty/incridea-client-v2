import React, { useState, useMemo, useRef, useEffect } from "react";
<<<<<<< HEAD
import { HorizontalTimeline } from "@/components/gallery/HorizontalTimeline";
import { Box } from "@mui/material";
import Carousel from "../components/gallery/Carousel";
import MasonryGrid from "../components/gallery/MasonryGrid";
=======
import { Link } from "react-router-dom"; 
import { HorizontalTimeline } from "../components/gallery/HorizontalTimeline"; 

import { Box } from "@mui/material";
import Masonry from "@mui/lab/Masonry";
import { motion } from "framer-motion";
import { ImageWithSkeleton } from "../components/gallery/Skeleton"; 
import Carousel from "../components/gallery/Carousel"; 
>>>>>>> 42bdeb60630dd3b885b381264659cf9cc946a5ee

const timelineItems = ["2018", "2019", "2020", "2022", "2023", "2024", "2025"];

const Gallery: React.FC = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [isTimelineVisible, setIsTimelineVisible] = useState(true);

  // REFERENCES
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  const carouselSectionRef = useRef<HTMLDivElement | null>(null);
<<<<<<< HEAD
  const perspectiveRef = useRef<HTMLDivElement | null>(null);
=======
  const galleryRef = useRef<HTMLDivElement | null>(null);
>>>>>>> 42bdeb60630dd3b885b381264659cf9cc946a5ee

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
    []
  );

  const NAVBAR_HEIGHT = 112;
  const TIMELINE_HEIGHT = 80;
  const SYNC_LINE = NAVBAR_HEIGHT + TIMELINE_HEIGHT;

  // SCROLL HANDLER
  useEffect(() => {
<<<<<<< HEAD
    const handleGlobalScroll = () => {
      if (perspectiveRef.current) {
        const centerY = window.scrollY + window.innerHeight / 2;
        perspectiveRef.current.style.perspectiveOrigin = `50% ${centerY}px`;
      }

=======
    const scrollContainer = scrollContainerRef.current;
    if (!scrollContainer) return;

    const handleScroll = () => {
>>>>>>> 42bdeb60630dd3b885b381264659cf9cc946a5ee
      const galleryElement = galleryRef.current;
      if (!galleryElement) return;

      if (carouselSectionRef.current) {
<<<<<<< HEAD
        const rect = carouselSectionRef.current.getBoundingClientRect();
        setIsTimelineVisible(rect.top > SYNC_LINE + 20);
=======
        const carouselRect = carouselSectionRef.current.getBoundingClientRect();
        setIsTimelineVisible(carouselRect.top > SYNC_LINE + 50);
>>>>>>> 42bdeb60630dd3b885b381264659cf9cc946a5ee
      }

      const sections = galleryElement.querySelectorAll("section");
      const step = 1 / (timelineItems.length - 1);

      let activeIdx = 0;
      sections.forEach((section, index) => {
        const rect = section.getBoundingClientRect();
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
        const clamped = Math.max(0, Math.min(1, progressToNext));
        setScrollProgress((activeIdx + clamped) * step);
      } else {
        setScrollProgress(activeIdx * step);
      }
    };

<<<<<<< HEAD
    window.addEventListener("scroll", handleGlobalScroll);
    handleGlobalScroll();
    return () => window.removeEventListener("scroll", handleGlobalScroll);
=======
    scrollContainer.addEventListener("scroll", handleScroll);
    return () => scrollContainer.removeEventListener("scroll", handleScroll);
>>>>>>> 42bdeb60630dd3b885b381264659cf9cc946a5ee
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
      const targetScrollTop = currentScroll + (sectionRectTop - SYNC_LINE) + 40; 
      scrollContainer.scrollTo({ top: targetScrollTop, behavior: "smooth" });
    }
  };

  /* 🔥 LINEAR ROTATION LOGIC (25 to -25) */
  const rotation = 25 - (scrollProgress * 50);

  return (
<<<<<<< HEAD
    <div
      ref={galleryRef}
      className="relative w-full min-h-screen bg-transparent selection:bg-cyan-500/30"
    >
      <style>{`
        html, body {
          overflow-x: hidden !important;
          overflow-y: auto !important;
        }
        ::-webkit-scrollbar:horizontal {
          display: none;
        }
      `}</style>

      {/* BACKGROUND */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat pointer-events-none"
        style={{ backgroundImage: "url('/eventpagebg/eventbg2.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* TIMELINE */}
      <header
        className="fixed top-[112px] left-0 z-50 w-full transition-all duration-500"
=======
    // FIX: Transparent background to avoid black block, depends on Layout background
    <div className="fixed inset-0 w-full h-full overflow-hidden bg-transparent selection:bg-cyan-500/30">
      
      {/* 1. TIMELINE HEADER */}
      <header
        className="absolute left-0 z-50 w-full transition-all duration-500 ease-in-out pointer-events-none" 
>>>>>>> 42bdeb60630dd3b885b381264659cf9cc946a5ee
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

<<<<<<< HEAD
      {/* MASONRY */}
      <div
        ref={perspectiveRef}
        className="perspective-[1500px]"
        style={{ perspectiveOrigin: "50% 50vh" }}
      >
        <MasonryGrid sections={gallerySections} rotation={rotation} />
      </div>

      {/* CAROUSEL */}
      <section
        ref={carouselSectionRef}
        className="relative z-10 min-h-screen py-24 border-t border-white/5"
      >
        <div className="text-center">
          <h2 className="font-['Orbitron'] text-xl text-cyan-400 tracking-[0.4em] uppercase">
            Memories in Motion
          </h2>
          <div className="h-[2px] w-24 bg-cyan-500 mx-auto mt-2 rounded-full shadow-[0_0_15px_#06b6d4]" />
        </div>
        <Box sx={{ width: "100%", overflow: "hidden" }}>
          <Carousel />
        </Box>
      </section>
=======
      {/* 2. SCROLLABLE CONTENT LAYER */}
      <div
        ref={scrollContainerRef}
        className="w-full h-full overflow-y-auto overflow-x-hidden no-scrollbar relative z-0"
        style={{
          maskImage: `linear-gradient(to bottom, transparent 0px, transparent ${NAVBAR_HEIGHT + TIMELINE_HEIGHT}px, black ${NAVBAR_HEIGHT + TIMELINE_HEIGHT + 100}px, black 100%)`,
          WebkitMaskImage: `linear-gradient(to bottom, transparent 0px, transparent ${NAVBAR_HEIGHT + TIMELINE_HEIGHT}px, black ${NAVBAR_HEIGHT + TIMELINE_HEIGHT + 100}px, black 100%)`,
        }}
      >
        <main
          ref={galleryRef}
          className="w-full flex flex-col items-center pt-[320px]"
        >
          {gallerySections.map((section) => (
            <section
              key={section.year}
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

          {/* INTERNAL FOOTER: Visible at the bottom of scroll, essentially "Sticky" to the content end */}
          <footer className="w-full mt-24 border-t border-white/10 pt-10 pb-5 backdrop-blur-sm bg-black/20">
            <div className="mx-auto flex max-w-5xl flex-col items-center gap-3 px-4 py-2 text-xs font-semibold text-slate-100 md:flex-row md:flex-wrap md:justify-center md:gap-4">
              <Link className="transition-colors duration-200 hover:text-slate-200 cursor-pointer" to="/privacy">
                Privacy Policy
              </Link>
              <span className="hidden text-white md:inline">|</span>
              <Link className="transition-colors duration-200 hover:text-slate-200 cursor-pointer" to="/rules">
                Terms & Conditions
              </Link>
              <span className="hidden text-white md:inline">|</span>
              <Link className="transition-colors duration-200 hover:text-slate-200 cursor-pointer" to="/guidelines">
                Guidelines
              </Link>
              <span className="hidden text-white md:inline">|</span>
              <Link className="transition-colors duration-200 hover:text-slate-200 cursor-pointer" to="/refund">
                Refund Policy
              </Link>
              <span className="hidden text-white md:inline">|</span>
              <Link className="transition-colors duration-200 hover:text-slate-200 cursor-pointer" to="/contact">
                Contact Us
              </Link>
            </div>
            <div className="mx-auto flex max-w-5xl flex-col items-center gap-1 px-4 pb-5 text-[11px] font-semibold tracking-wide text-slate-200 mt-4">
              <Link className="inline-flex items-center gap-1 transition-all hover:tracking-wider hover:text-slate-100 cursor-pointer" to="/techteam">
                Made with <span className="text-rose-400">❤</span> by Technical Team
              </Link>
              <p className='cursor-default'>© Incridea {new Date().getFullYear()}</p>
            </div>
          </footer>
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
>>>>>>> 42bdeb60630dd3b885b381264659cf9cc946a5ee
    </div>
  );
};

export default Gallery;