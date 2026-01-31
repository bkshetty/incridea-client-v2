import React from "react";
import Masonry from "@mui/lab/Masonry";
import { motion } from "framer-motion";
import MasonryGlassCard from "./MasonryGlassCard";
import { ImageWithSkeleton } from "./Skeleton";

interface GalleryItem {
  id: string;
  url: string;
  ratio: string;
}

interface GallerySection {
  year: string;
  images: GalleryItem[];
}

interface MasonryGridProps {
  sections: GallerySection[];
  rotation: number;
}

const MasonryGrid: React.FC<MasonryGridProps> = ({ sections, rotation }) => {
  return (
    <div
      className="w-full flex flex-col items-center pt-52 origin-top"
      style={{
        transform: `rotateY(${rotation}deg)`,
        transformStyle: "preserve-3d",
        transition: "transform 0.1s linear",
      }}
    >
      {sections.map((section) => (
        <section
          key={section.year}
          className="w-full max-w-4xl px-4 sm:px-6 mb-24"
        >
          <motion.h1
            className="font-['Michroma'] text-3xl md:text-5xl mb-10 text-white text-center tracking-wider"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            {section.year}
          </motion.h1>

          <Masonry columns={{ xs: 2, sm: 3, lg: 4 }} spacing={3}>
            {section.images.map((item) => (
              <MasonryGlassCard key={item.id} ratio={item.ratio}>
                <ImageWithSkeleton src={item.url} alt={item.id} />
              </MasonryGlassCard>
            ))}
          </Masonry>
        </section>
      ))}
    </div>
  );
};

export default MasonryGrid;
