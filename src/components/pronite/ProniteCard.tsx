import React, { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import {
  Heart,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
} from "lucide-react";
import { motion, type Variants } from "framer-motion";
import LiquidGlassCard from "../liquidglass/LiquidGlassCard";

interface ProniteCardProps {
  artistName: string;
  artistDate: string;
  artistImage: string;
  accentColor?: string;
  songUrl: string;
  onNext: () => void;
  onPrev: () => void;
}

const ProniteCard: React.FC<ProniteCardProps> = ({
  artistName,
  artistDate,
  artistImage,
  accentColor = "#D84D7D",
  songUrl,
  onNext,
  onPrev,
}) => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.muted = isMuted;
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying, isMuted, songUrl]);

  const glitchVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8, y: 50 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: "spring", stiffness: 260, damping: 20 },
    },
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } },
  };

  return createPortal(
    <div className="fixed bottom-8 right-20 z-[9999] pointer-events-none flex justify-end items-end font-sans">
      <audio ref={audioRef} src={songUrl} loop />

      <motion.div
        variants={glitchVariants}
        initial="hidden"
        animate="visible"
        exit="exit"
        className="pointer-events-auto relative w-72 rounded-3xl shadow-2xl overflow-hidden"
      >
        <div className="absolute inset-0 z-0">
          <LiquidGlassCard colorScheme="dark" className="w-full h-full" />
        </div>

        <div
          className="relative z-10 p-5"
          style={{ borderLeft: `3px solid ${accentColor}` }}
        >
          <div className="flex items-center gap-3 mb-4">
            <img
              src={artistImage}
              alt={artistName}
              className="w-14 h-14 object-cover rounded-lg shadow-lg"
            />
            <div className="flex-grow min-w-0">
              <h3 className="text-white font-bold text-base truncate leading-tight">
                {artistName}
              </h3>
              <p className="text-white/60 text-[10px] uppercase tracking-widest mt-1">
                {artistDate}
              </p>
            </div>
            <button
              onClick={() => setIsLiked(!isLiked)}
              className="active:scale-125 transition-transform ml-1"
            >
              <Heart
                size={18}
                fill={isLiked ? accentColor : "none"}
                stroke={isLiked ? accentColor : "white"}
                className="opacity-70"
              />
            </button>
          </div>

          <div className="h-1 w-full bg-white/10 rounded-full overflow-hidden mb-4">
            <motion.div
              className="h-full bg-white"
              animate={{ width: isPlaying ? "100%" : "30%" }}
              transition={{ duration: isPlaying ? 30 : 0.5, ease: "linear" }}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <SkipBack
                size={20}
                onClick={onPrev}
                className="text-white/60 hover:text-white cursor-pointer transition-all"
                fill="currentColor"
              />
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="text-white hover:scale-110 active:scale-95 transition-all"
              >
                {isPlaying ? (
                  <Pause size={28} fill="currentColor" />
                ) : (
                  <Play size={28} fill="currentColor" />
                )}
              </button>
              <SkipForward
                size={20}
                onClick={onNext}
                className="text-white/60 hover:text-white cursor-pointer transition-all"
                fill="currentColor"
              />
            </div>
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="text-white/40 hover:text-white transition-colors"
            >
              {isMuted ? (
                <VolumeX size={20} className="text-red-400" />
              ) : (
                <Volume2 size={20} />
              )}
            </button>
          </div>
          <div
            className="absolute -bottom-10 -right-10 w-32 h-32 blur-[60px] opacity-20 pointer-events-none"
            style={{ backgroundColor: accentColor }}
          />
        </div>
      </motion.div>
    </div>,
    document.body,
  );
};

export default ProniteCard;
