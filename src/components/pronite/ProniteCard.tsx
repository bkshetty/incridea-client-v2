import React, { useState } from "react";
import {
  Mic,
  Heart,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
} from "lucide-react";
import { motion, type Variants } from "framer-motion";

interface ProniteCardProps {
  artistName: string;
  artistDate: string;
  artistImage: string;
  accentColor?: string;
}

const ProniteCard: React.FC<ProniteCardProps> = ({
  artistName,
  artistDate,
  artistImage,
  accentColor = "#D84D7D",
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLiked, setIsLiked] = useState(false);

  const glitchVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8, x: 20, y: 20 },
    visible: {
      opacity: 1,
      scale: 1,
      x: 0,
      y: 0,
      filter: [
        "hue-rotate(0deg) blur(0px)",
        "hue-rotate(90deg) blur(2px)",
        "hue-rotate(0deg) blur(0px)",
      ],
      transition: {
        opacity: { type: "spring", stiffness: 400, damping: 25 },
        scale: { type: "spring", stiffness: 400, damping: 25 },
        filter: { duration: 0.4 },
      },
    },
    exit: { opacity: 0, scale: 0.9, x: 20, transition: { duration: 0.2 } },
  };

  return (
    <div className="fixed bottom-8 right-20 z-[9999] pointer-events-auto">
      <motion.div
        variants={glitchVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="relative w-[22rem] bg-[#121212]/90 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl overflow-hidden group"
        style={{ borderLeft: `4px solid ${accentColor}` }}
      >
        {/* Header Section */}
        <div className="flex items-center gap-5 mb-6">
          <div className="relative w-20 h-20 flex-shrink-0">
            <img
              src={artistImage}
              alt={artistName}
              className="w-full h-full object-cover rounded-lg shadow-lg"
            />
            <div className="absolute -top-2 -left-2 bg-white/20 backdrop-blur-md rounded-full p-2 border border-white/10">
              <Mic size={16} className="text-white" />
            </div>
          </div>

          <div className="flex-grow min-w-0">
            <h3 className="text-white font-bold text-xl truncate leading-tight tracking-tight">
              {artistName}
            </h3>
            <p className="text-white/60 text-sm uppercase tracking-widest font-medium mt-1.5">
              {artistDate}
            </p>
          </div>

          <button
            onClick={() => setIsLiked(!isLiked)}
            className="transition-transform active:scale-125 ml-2"
          >
            <Heart
              size={22}
              fill={isLiked ? accentColor : "none"}
              stroke={isLiked ? accentColor : "white"}
              className="opacity-70 hover:opacity-100 transition-opacity"
            />
          </button>
        </div>

        {/* Progress Bar Section */}
        <div className="space-y-3 mb-6">
          <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden relative">
            <motion.div
              className="absolute top-0 left-0 h-full bg-white rounded-full"
              animate={{ width: isPlaying ? "100%" : "45%" }}
              transition={{ duration: isPlaying ? 30 : 0.5, ease: "linear" }}
            />
          </div>
          <div className="flex justify-between text-[11px] text-white/40 font-mono tracking-tighter">
            <span>2:00</span>
            <span>-0:34</span>
          </div>
        </div>

        {/* Playback Controls - Updated to icon-only style */}
        <div className="flex items-center justify-between px-1">
          <div className="flex items-center gap-10">
            <SkipBack
              size={24}
              className="text-white/60 hover:text-white cursor-pointer transition-all hover:scale-110 active:scale-90"
              fill="currentColor"
            />
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="text-white hover:scale-110 active:scale-90 transition-all p-1"
            >
              {isPlaying ? (
                <Pause size={24} fill="currentColor" />
              ) : (
                <Play size={24} fill="currentColor" />
              )}
            </button>
            <SkipForward
              size={24}
              className="text-white/60 hover:text-white cursor-pointer transition-all hover:scale-110 active:scale-90"
              fill="currentColor"
            />
          </div>

          {/* Volume Section */}
          <div className="flex items-center gap-3 group/volume">
            <Volume2
              size={18}
              className="text-white/40 group-hover/volume:text-white/70 transition-colors"
            />
            <div className="w-20 h-1 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full bg-white/60 w-[70%]" />
            </div>
          </div>
        </div>

        {/* Accent Glow */}
        <div
          className="absolute -bottom-10 -right-10 w-40 h-40 blur-[70px] opacity-25 pointer-events-none"
          style={{ backgroundColor: accentColor }}
        />
      </motion.div>
    </div>
  );
};

export default ProniteCard;
