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
import { motion, type Variants, AnimatePresence } from "framer-motion";
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

const HEART_RED = "#FF4B4B";

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
  const buttonRef = useRef<HTMLButtonElement>(null);

  const [hearts, setHearts] = useState<
    {
      id: number;
      x: number;
      y: number;
      s: number;
      startX: number;
      startY: number;
    }[]
  >([]);

  const triggerBurst = () => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const startX = rect.left + rect.width / 2;
    const startY = rect.top + rect.height / 2;

    const newHearts = Array.from({ length: 12 }).map((_, i) => ({
      id: Date.now() + i,
      startX,
      startY,
      x: (Math.random() - 0.5) * 600,
      y: -300 - Math.random() * 400,
      s: Math.random() * 1.2 + 0.6,
    }));

    setHearts((prev) => [...prev, ...newHearts]);
    setTimeout(() => {
      setHearts((prev) =>
        prev.filter((h) => !newHearts.find((nh) => nh.id === h.id)),
      );
    }, 2000);
  };

  const handleLikeClick = () => {
    if (!isLiked) triggerBurst();
    setIsLiked(!isLiked);
  };

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

  return (
    <>
      {createPortal(
        <div className="fixed inset-0 pointer-events-none z-[10000]">
          <AnimatePresence>
            {hearts.map((heart) => (
              <motion.div
                key={heart.id}
                initial={{
                  opacity: 1,
                  scale: 0,
                  x: heart.startX,
                  y: heart.startY,
                }}
                animate={{
                  opacity: 0,
                  scale: heart.s,
                  x: heart.startX + heart.x,
                  y: heart.startY + heart.y,
                  rotate: heart.x > 0 ? 45 : -45,
                }}
                exit={{ opacity: 0 }}
                transition={{ duration: 2, ease: [0.23, 1, 0.32, 1] }}
                className="absolute"
                style={{ left: 0, top: 0 }}
              >
                <Heart size={28} fill={HEART_RED} color={HEART_RED} />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>,
        document.body,
      )}

      <div className="fixed bottom-12 right-20 z-[9999] pointer-events-none flex justify-end items-end font-sans">
        <audio ref={audioRef} src={songUrl} loop />

        <motion.div
          variants={glitchVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="pointer-events-auto relative w-[24rem] rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.5)] border border-white/10"
        >
          <div className="absolute inset-0 z-0 rounded-[2.5rem] overflow-hidden">
            <LiquidGlassCard colorScheme="dark" className="w-full h-full" />
          </div>

          <div
            className="absolute left-0 top-10 bottom-10 w-[4px] rounded-r-full z-20"
            style={{ backgroundColor: accentColor }}
          />

          <div className="relative z-10 p-8 pb-10">
            {/* Header */}
            <div className="flex items-center justify-start gap-5 mb-8">
              <img
                src={artistImage}
                alt={artistName}
                className="w-24 h-24 object-cover rounded-2xl shadow-2xl border border-white/5"
              />
              <div className="min-w-0 flex flex-col justify-center">
                <div className="flex items-center gap-3">
                  <h3 className="text-white font-bold text-3xl truncate tracking-tight">
                    {artistName}
                  </h3>
                  <button
                    ref={buttonRef}
                    onClick={handleLikeClick}
                    className="active:scale-150 transition-transform relative z-10 p-1"
                  >
                    <Heart
                      size={26}
                      fill={isLiked ? HEART_RED : "none"}
                      stroke={isLiked ? HEART_RED : "white"}
                      className="opacity-90 hover:opacity-100 transition-opacity"
                    />
                  </button>
                </div>
                <p className="text-white/50 text-xs uppercase tracking-[0.3em] mt-1 font-semibold">
                  {artistDate}
                </p>
              </div>
            </div>

            {/* Progress Area */}
            <div className="mb-2">
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden relative border border-white/5">
                <motion.div
                  className="h-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                  animate={{ width: isPlaying ? "100%" : "35%" }}
                  transition={{
                    duration: isPlaying ? 30 : 0.5,
                    ease: "linear",
                  }}
                />
              </div>
            </div>

            {/* Spacing Nudge */}
            <div className="h-6" />

            {/* Controls Row */}
            <div className="grid grid-cols-3 items-center w-full">
              <div className="flex justify-start opacity-0 pointer-events-none">
                <Volume2 size={32} />
              </div>

              <div className="flex items-center justify-center gap-8">
                <SkipBack
                  size={32}
                  onClick={onPrev}
                  className="text-white/50 hover:text-white cursor-pointer transition-all hover:scale-110 active:scale-90"
                  fill="currentColor"
                />
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="text-white hover:scale-110 active:scale-90 transition-all p-1"
                >
                  {isPlaying ? (
                    <Pause size={32} fill="currentColor" />
                  ) : (
                    <Play size={32} fill="currentColor" />
                  )}
                </button>
                <SkipForward
                  size={32}
                  onClick={onNext}
                  className="text-white/50 hover:text-white cursor-pointer transition-all hover:scale-110 active:scale-90"
                  fill="currentColor"
                />
              </div>

              <div className="flex justify-center pr-12">
                <button
                  onClick={() => setIsMuted(!isMuted)}
                  className="text-white/30 hover:text-white transition-colors p-2 hover:bg-white/5 rounded-xl"
                >
                  {isMuted ? (
                    <VolumeX size={24} className="text-red-400" />
                  ) : (
                    <Volume2 size={24} />
                  )}
                </button>
              </div>
            </div>

            <div
              className="absolute -bottom-20 -right-20 w-64 h-64 blur-[100px] opacity-20 pointer-events-none rounded-full"
              style={{ backgroundColor: accentColor }}
            />
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default ProniteCard;
