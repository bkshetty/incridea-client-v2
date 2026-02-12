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
  const heartBtnRef = useRef<HTMLButtonElement>(null);

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
    if (!heartBtnRef.current) return;
    const rect = heartBtnRef.current.getBoundingClientRect();
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

  const cardVariants: Variants = {
    hidden: { opacity: 0, scale: 0.85, y: 40 },
    visible: {
      opacity: 1,
      scale: 1,
      y: 0,
      transition: { type: "spring", stiffness: 280, damping: 22 },
    },
    exit: { opacity: 0, scale: 0.9, y: 20, transition: { duration: 0.2 } },
  };

  return (
    <>
      {/* Floating heart burst particles */}
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

      {/* ─── Card ─── */}
      <div className="fixed bottom-8 right-8 z-[9999] pointer-events-none flex justify-end items-end">
        <audio ref={audioRef} src={songUrl} loop />

        <motion.div
          variants={cardVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="pointer-events-auto"
          style={
            {
              "--accent": accentColor,
            } as React.CSSProperties
          }
        >
          <div
            style={{
              width: "380px",
              borderRadius: "24px",
              background: "rgba(255, 255, 255, 0.05)",
              backdropFilter: "blur(10px)",
              WebkitBackdropFilter: "blur(10px)",
              border: "1px solid rgba(255, 255, 255, 0.2)",
              boxShadow: "0 16px 48px rgba(0,0,0,0.35)",
              overflow: "hidden",
              position: "relative",
            }}
          >
            {/* Accent glow */}
            <div
              style={{
                position: "absolute",
                bottom: "-60px",
                right: "-40px",
                width: "200px",
                height: "200px",
                background: accentColor,
                borderRadius: "50%",
                filter: "blur(100px)",
                opacity: 0.15,
                pointerEvents: "none",
              }}
            />

            {/* ─── Top: Image + Info ─── */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "16px",
                padding: "16px 20px 12px 16px",
              }}
            >
              {/* Album art */}
              <img
                src={artistImage}
                alt={artistName}
                style={{
                  width: "100px",
                  height: "100px",
                  borderRadius: "16px",
                  objectFit: "cover",
                  flexShrink: 0,
                  boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
                }}
              />

              {/* Name + Date */}
              <div style={{ minWidth: 0, flex: 1 }}>
                <h3
                  style={{
                    color: "#fff",
                    fontSize: "1.35rem",
                    fontWeight: 700,
                    lineHeight: 1.15,
                    margin: 0,
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                    fontFamily: "'mocoSans', sans-serif",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {artistName}
                </h3>
                <p
                  style={{
                    color: "rgba(255,255,255,0.45)",
                    fontSize: "0.7rem",
                    fontWeight: 300,
                    letterSpacing: "0.25em",
                    textTransform: "uppercase",
                    margin: "6px 0 0",
                    fontFamily: "'Outfit', sans-serif",
                  }}
                >
                  {artistDate}
                </p>
              </div>
            </div>

            {/* ─── Progress bar ─── */}
            <div style={{ padding: "0 20px" }}>
              <div
                style={{
                  height: "3px",
                  width: "100%",
                  background: "rgba(255,255,255,0.08)",
                  borderRadius: "2px",
                  overflow: "hidden",
                }}
              >
                <motion.div
                  style={{
                    height: "100%",
                    background: "#fff",
                    borderRadius: "2px",
                    boxShadow: "0 0 8px rgba(255,255,255,0.3)",
                  }}
                  animate={{ width: isPlaying ? "100%" : "35%" }}
                  transition={{
                    duration: isPlaying ? 30 : 0.5,
                    ease: "linear",
                  }}
                />
              </div>
            </div>

            {/* ─── Controls row ─── */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "14px 20px 16px",
              }}
            >
              {/* Volume — far left */}
              <button
                onClick={() => setIsMuted(!isMuted)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "6px",
                  borderRadius: "10px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "all 0.2s",
                  color: isMuted ? "#f87171" : "rgba(255,255,255,0.35)",
                }}
                onMouseEnter={(e) =>
                (e.currentTarget.style.color = isMuted
                  ? "#f87171"
                  : "rgba(255,255,255,0.7)")
                }
                onMouseLeave={(e) =>
                (e.currentTarget.style.color = isMuted
                  ? "#f87171"
                  : "rgba(255,255,255,0.35)")
                }
              >
                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>

              {/* Centre transport: Prev · Play/Pause · Next */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "20px",
                }}
              >
                <button
                  onClick={onPrev}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "rgba(255,255,255,0.5)",
                    display: "flex",
                    alignItems: "center",
                    padding: "4px",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "#fff")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "rgba(255,255,255,0.5)")
                  }
                >
                  <SkipBack size={22} fill="currentColor" />
                </button>

                {/* Play / Pause — large white circle */}
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  style={{
                    width: "44px",
                    height: "44px",
                    borderRadius: "50%",
                    background: "#fff",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: "#0c0c0e",
                    boxShadow: "0 4px 16px rgba(255,255,255,0.15)",
                    transition: "transform 0.15s, box-shadow 0.15s",
                    flexShrink: 0,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.08)";
                    e.currentTarget.style.boxShadow =
                      "0 6px 24px rgba(255,255,255,0.25)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.boxShadow =
                      "0 4px 16px rgba(255,255,255,0.15)";
                  }}
                >
                  {isPlaying ? (
                    <Pause size={20} fill="currentColor" />
                  ) : (
                    <Play size={20} fill="currentColor" style={{ marginLeft: "2px" }} />
                  )}
                </button>

                <button
                  onClick={onNext}
                  style={{
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                    color: "rgba(255,255,255,0.5)",
                    display: "flex",
                    alignItems: "center",
                    padding: "4px",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.color = "#fff")
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.color = "rgba(255,255,255,0.5)")
                  }
                >
                  <SkipForward size={22} fill="currentColor" />
                </button>
              </div>

              {/* Heart — far right */}
              <button
                ref={heartBtnRef}
                onClick={handleLikeClick}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  padding: "6px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  transition: "transform 0.15s",
                }}
                onMouseEnter={(e) =>
                  (e.currentTarget.style.transform = "scale(1.15)")
                }
                onMouseLeave={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              >
                <Heart
                  size={20}
                  fill={isLiked ? HEART_RED : "none"}
                  stroke={isLiked ? HEART_RED : "rgba(255,255,255,0.45)"}
                  strokeWidth={2}
                />
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default ProniteCard;
