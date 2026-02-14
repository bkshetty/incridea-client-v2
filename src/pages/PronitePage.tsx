import React, { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";
import { AnimatePresence } from "framer-motion";
import "../components/pronite/Pronite.css";
import Starfield from "../components/pronite/Starfield";
import ProniteCard from "../components/pronite/ProniteCard";
import FinalReveal from "../components/pronite/FinalReveal";
import type { FinalRevealRef } from "../components/pronite/FinalReveal";
import { useZScroll } from "../hooks/useZScroll";
import { clamp } from "../utils/pronite";
import { useNavigate } from "react-router-dom";

import armaanSong from "../assets/pronite/audios/pehla_pyar_armaan_malik.mp3";
import nikhitaSong from "../assets/pronite/audios/jugnu_nikitha_gandhi.mp3";
import aloSong from "../assets/pronite/audios/saibo_alo.mp3";
import anthemSong from "../assets/pronite/audios/incredia_24_anthem.mp3";

import armaanVideo from "../assets/pronite/videos/armaan_malik.webm";
import aloVideo from "../assets/pronite/videos/alo.webm";
import nikhitaVideo from "../assets/pronite/videos/nikhita.webm";

// --- Layer Configuration ---
interface ArtistData {
    id: string;
    name: string;
    date: string;
    image: string;
    profileImage: string;
    accent: string;
    song: string;
}

const ARTISTS: Record<string, ArtistData> = {
    artist1: {
        id: "a1",
        name: "Armaan Malik",
        date: "5th Mar @ 9PM",
        image: "pronite/artist1-right.jpg",
        profileImage: "pronite/Armaan_Malik_Profile.jpg",
        accent: "#D84D7D",
        song: armaanSong,
    },
    artist2: {
        id: "a2",
        name: "Nikhita Gandhi",
        date: "5th Mar @ 11:30PM",
        image: "pronite/artist2-right.jpg",
        profileImage: "pronite/Nikhita_Gandhi_profile.jpg",
        accent: "#4DA6D8",
        song: nikhitaSong,
    },
    artist3: {
        id: "a3",
        name: "ALO",
        date: "6th Mar @ 1:30AM",
        image: "pronite/artist3-right.jpg",
        profileImage: "pronite/The_alo_band_profile.jpg",
        accent: "#D84D7D",
        song: aloSong,
    },
};

const SCROLL_STOPS = [
    { id: "hero", z: -100, label: "EXPLORE LINEUP" },
    { id: "artist1", z: -5000, label: "NEXT ARTIST" },
    { id: "artist2", z: -12500, label: "NEXT ARTIST" },
    { id: "artist3", z: -20000, label: "REVEAL FULL LINEUP" },
    { id: "final-reveal", z: -27500, label: "BACK TO TOP" },
];

// Target phase for artist SVG viewing (0.15 = SVG fully revealed, centered, not sliding down yet)
const ARTIST_VIEW_PHASE = 0.15;

// --- Easing helpers ---
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInCubic = (t: number) => t * t * t;
const easeInOutQuad = (t: number) =>
    t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

const PronitePage: React.FC = () => {
    // Mobile detection for performance optimization
    const [isMobile] = useState(() => {
        return typeof window !== 'undefined' && (
            window.innerWidth < 768 ||
            /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
        );
    });


    const navigate = useNavigate();

    const containerRef = useRef<HTMLDivElement>(null);
    const cursorRef = useRef<HTMLDivElement>(null);
    const cursorDotRef = useRef<HTMLDivElement>(null);
    const tiltRef = useRef<HTMLDivElement>(null);
    const [isGlobalMuted, setIsGlobalMuted] = useState(false);
    const [isGlobalPlaying, setIsGlobalPlaying] = useState(false);
    const userInteractedRef = useRef(false);
    const layerRefs = useRef<Record<string, HTMLElement | null>>({});
    const [activeArtist, setActiveArtist] = useState<ArtistData | null>(null);
    const mousePos = useRef({ x: 0, y: 0 });
    const rafId = useRef<number | undefined>(undefined);
    const isHovering = useRef(false);
    const starSpeed = useRef(1);
    const [buttonLabel, setButtonLabel] = useState("EXPLORE LINEUP");
    const lastActiveArtistKey = useRef<string | null>(null);
    const finalRevealRef = useRef<FinalRevealRef>(null);
    const finalRevealAnimationTriggered = useRef(false);
    const anthemRef = useRef<HTMLAudioElement | null>(null);

    // Initialize anthem audio
    useEffect(() => {
        const audio = new Audio(anthemSong);
        audio.loop = true;
        audio.volume = 0; // Start silent
        anthemRef.current = audio;
        return () => {
            audio.pause();
            audio.src = "";
        };
    }, []);
    const handleArtistNavigation = (direction: "next" | "prev") => {
        if (!lenisRef.current || !totalDistanceRef.current) return;
        const artistKeys = Object.keys(ARTISTS);
        const currentIdKey = activeArtist
            ? Object.keys(ARTISTS).find((k) => ARTISTS[k].id === activeArtist.id)
            : "artist1";
        let currentIndex = artistKeys.indexOf(currentIdKey || "artist1");

        let nextIndex = direction === "next" ? currentIndex + 1 : currentIndex - 1;
        if (nextIndex >= artistKeys.length) nextIndex = 0;
        if (nextIndex < 0) nextIndex = artistKeys.length - 1;

        const targetStop = SCROLL_STOPS.find((s) => s.id === artistKeys[nextIndex]);
        if (targetStop) {
            const maxScroll = totalDistanceRef.current - window.innerHeight;
            const targetScroll =
                (-targetStop.z * maxScroll) / totalDistanceRef.current;
            lenisRef.current.scrollTo(targetScroll, { duration: 2.5 });
        }
    };
    // --- Improved Scroll Tracking with Priority System ---
    const onUpdate = (currentZ: number) => {
        let foundArtistKey: string | null = null;
        let foundArtist: ArtistData | null = null;
        let maxPriority = -Infinity;

        const artistKeys = Object.keys(ARTISTS);
        for (const key of artistKeys) {
            const el = layerRefs.current[key];
            if (el) {
                const depth = parseFloat(el.dataset.z || "0");
                const persist = parseFloat(el.dataset.artistRange || "5000");
                const relativeZ = depth - currentZ;

                const entryStart = -600;
                const exitEnd = persist;

                if (relativeZ >= entryStart && relativeZ <= exitEnd) {
                    const priority = -Math.abs(relativeZ);
                    if (priority > maxPriority) {
                        maxPriority = priority;
                        foundArtistKey = key;
                        foundArtist = ARTISTS[key];
                    }
                }
            }
        }

        if (foundArtistKey !== lastActiveArtistKey.current) {
            lastActiveArtistKey.current = foundArtistKey;
            setActiveArtist(foundArtist);
        }

        // --- Final Reveal Animation ---
        const finalRevealLayer = layerRefs.current["final-reveal"];
        if (finalRevealLayer) {
            const finalZ = -27500;
            const dist = currentZ - finalZ;
            // Start fade at z=-26000 (when dist=1500), full opacity at z=-27500 (dist=0)
            const opacity = 1 - clamp((dist - 0) / 1500, 0, 1);
            const scale = 0.8 + 0.2 * opacity;

            gsap.set(finalRevealLayer, {
                opacity: opacity,
                scale: scale,
                visibility: opacity > 0 ? "visible" : "hidden",
                pointerEvents: opacity > 0.9 ? "auto" : "none",
            });

            // Trigger GSAP animation when reaching z=-26000 (when section starts fading in)
            // Use opacity threshold to ensure cards animate as soon as section is visible
            if (opacity > 0.1) {
                if (!finalRevealAnimationTriggered.current) {
                    finalRevealAnimationTriggered.current = true;
                    // Immediate animation, no delay
                    finalRevealRef.current?.playAnimation();
                }

                // Play Anthem if globally playing and not muted
                if (anthemRef.current && anthemRef.current.paused && isGlobalPlaying && !isGlobalMuted) {
                    anthemRef.current.volume = 1;
                    anthemRef.current.play().catch(() => { });
                }
            }

            // Reset animation if scrolling back up past the trigger point
            if (opacity <= 0.05) {
                if (finalRevealAnimationTriggered.current) {
                    finalRevealAnimationTriggered.current = false;
                    finalRevealRef.current?.resetAnimation();
                }

                // Stop Anthem
                if (anthemRef.current && !anthemRef.current.paused) {
                    gsap.to(anthemRef.current, {
                        volume: 0,
                        duration: 1,
                        onComplete: () => {
                            anthemRef.current?.pause();
                        }
                    });
                }
            }
        }

        const currentStopIndex = SCROLL_STOPS.findIndex((s, i) => {
            const nextStop = SCROLL_STOPS[i + 1];
            if (!nextStop) return currentZ <= s.z + 1000;
            return currentZ <= s.z + 1000 && currentZ > nextStop.z + 1000;
        });

        if (currentStopIndex !== -1) {
            setButtonLabel(SCROLL_STOPS[currentStopIndex].label);
        }
    };
    const handleMuteToggle = () => {
        setIsGlobalMuted((prev) => !prev); // This flips the boolean
    };
    // --- 3D TILT EFFECT ---
    const handleMouseMove = useCallback((e: MouseEvent) => {
        // Only enable tilt on desktop
        if (isMobile || !tiltRef.current) return;

        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;

        const xPos = (clientX / innerWidth - 0.5) * 2;
        const yPos = (clientY / innerHeight - 0.5) * 2;

        mousePos.current = { x: xPos, y: yPos };
        isHovering.current = true;
    }, [isMobile]);

    const handleMouseLeave = useCallback(() => {
        // Only relevant on desktop
        if (isMobile) return;
        isHovering.current = false;
    }, [isMobile]);

    useEffect(() => {
        // Only run tilt animation on desktop
        if (isMobile) return;

        let currentX = 0;
        let currentY = 0;

        const animate = () => {
            if (tiltRef.current) {
                if (isHovering.current) {
                    const targetX = -mousePos.current.y * 8;
                    const targetY = mousePos.current.x * 8;

                    currentX += (targetX - currentX) * 0.08;
                    currentY += (targetY - currentY) * 0.08;
                } else {
                    currentX += (0 - currentX) * 0.05;
                    currentY += (0 - currentY) * 0.05;
                }

                tiltRef.current.style.transform = `rotateX(${currentX}deg) rotateY(${currentY}deg)`;
            }

            rafId.current = requestAnimationFrame(animate);
        };

        rafId.current = requestAnimationFrame(animate);

        return () => {
            if (rafId.current) cancelAnimationFrame(rafId.current);
        };
    }, [isMobile]);

    // Sync Global Mute with Anthem
    useEffect(() => {
        if (anthemRef.current) {
            anthemRef.current.muted = isGlobalMuted;
        }
    }, [isGlobalMuted]);

    // Sync Global Play/Pause with Anthem
    useEffect(() => {
        if (anthemRef.current) {
            if (!isGlobalPlaying) {
                anthemRef.current.pause();
            } else {
                // If we are in Final Reveal, we might want to resume?
                // Checking if we are deep enough.
                const finalRevealLayer = layerRefs.current["final-reveal"];
                if (finalRevealLayer && window.getComputedStyle(finalRevealLayer).visibility === "visible") {
                    anthemRef.current.play().catch(() => { });
                }
            }
        }
    }, [isGlobalPlaying]);

    // =====================================================
    // SCROLL-PHASE ANIMATION CALLBACK
    // =====================================================

    /**
     * Applies smooth depth-emergence to an artist image.
     * Uses CSS scale() to simulate perspective depth — identical visual
     * to how hero/about text layers emerge from the Z-axis.
     *
     * t: 0 → 1 (normalised sub-phase for this image)
     *
     * Visual timeline:
     *   t=0.00 : scale(0.05)  opacity(0)    — invisible speck deep in space
     *   t=0.08 : scale(0.10)  opacity(0.15) — faint dot materialising
     *   t=0.30 : scale(0.35)  opacity(0.70) — clearly approaching
     *   t=0.60 : scale(0.75)  opacity(1.00) — almost here
     *   t=0.75 : scale(1.00)  opacity(1.00) — at camera plane
     *   t=0.90 : scale(1.60)  opacity(0.40) — flying past, going large
     *   t=1.00 : scale(2.20)  opacity(0.00) — gone past viewer
     */
    const applyImageDepth = (
        imgEl: HTMLElement | null,
        layerEl: HTMLElement | null,
        t: number,
    ) => {
        if (!imgEl || !layerEl) return;

        if (t <= 0) {
            // Not yet in range — completely hidden
            gsap.set(imgEl, { visibility: "hidden", opacity: 0 });
            gsap.set(layerEl, { autoAlpha: 0, pointerEvents: "none" });
            return;
        }

        // --- Scale curve: simulates perspective depth ---
        // Starts tiny (far away), grows to 1 (camera plane), then continues growing (past camera)
        const scaleApproach = easeOutCubic(clamp(t / 0.75, 0, 1)); // 0→1 over first 75%
        const scalePast = t > 0.75 ? (t - 0.75) / 0.25 : 0; // 0→1 over last 25%
        const imgScale = 0.05 + scaleApproach * 0.95 + scalePast * 1.2;

        // --- Opacity curve: gradual fade in, snap to full, fade out past camera ---
        let imgOpacity: number;
        if (t < 0.1) {
            // Materialise from nothing — very gentle ramp
            imgOpacity = easeOutCubic(t / 0.1) * 0.2;
        } else if (t < 0.35) {
            // Approaching — smooth ramp to full
            imgOpacity = 0.2 + easeOutCubic((t - 0.1) / 0.25) * 0.8;
        } else if (t < 0.8) {
            // Fully visible
            imgOpacity = 1;
        } else {
            // Flying past camera — fade out
            imgOpacity = 1 - easeInCubic((t - 0.8) / 0.2);
        }

        gsap.set(layerEl, { autoAlpha: 1, pointerEvents: "none" });
        gsap.set(imgEl, {
            visibility: "visible",
            opacity: clamp(imgOpacity, 0, 1),
            transform: `translate(-50%, -50%) scale(${imgScale})`,
        });
    };

    const onArtistScrollProgress = useCallback(
        (element: HTMLElement, phase: number) => {
            const artistKey = element.dataset.artistId;
            if (!artistKey) return;

            const nameInner = element.querySelector(
                ".artist-name-svg",
            ) as HTMLElement | null;
            const dateInner = element.querySelector(
                ".artist-date",
            ) as HTMLElement | null;
            const contentBlock = element.querySelector(
                ".artist-content",
            ) as HTMLElement | null;
            const sponsorRow = element.querySelector(
                ".sponsor-row",
            ) as HTMLElement | null;

            // Image refs
            const rightImgLayer = layerRefs.current[`${artistKey}_right`];
            const leftImgLayer = layerRefs.current[`${artistKey}_left`];
            const rightImg = rightImgLayer?.querySelector(
                ".artist-img",
            ) as HTMLElement | null;
            const leftImg = leftImgLayer?.querySelector(
                ".artist-img",
            ) as HTMLElement | null;

            // ==========================================================
            // TEXT ANIMATIONS (same phases as before, unchanged)
            // ==========================================================

            // --- Text Reveal: phase 0.00 – 0.20 ---
            if (phase <= 0.2) {
                const t = easeOutCubic(clamp(phase / 0.2, 0, 1));
                if (nameInner) {
                    gsap.set(nameInner, {
                        clipPath: `inset(0 0 ${(1 - t) * 100}% 0)`,
                        opacity: 1,
                        y: 0,
                    });
                }
                const dateT = easeOutCubic(clamp((phase - 0.05) / 0.15, 0, 1));
                if (dateInner) {
                    gsap.set(dateInner, {
                        clipPath: `inset(0 0 ${(1 - dateT) * 100}% 0)`,
                        opacity: 1,
                        y: 0,
                    });
                }
                if (contentBlock) gsap.set(contentBlock, { y: 0 });
                if (sponsorRow) {
                    gsap.set(sponsorRow, {
                        clipPath: `inset(0 0 ${(1 - t) * 100}% 0)`,
                        y: 0,
                    });
                }

                // --- Text Move Down: phase 0.20 – 0.40 ---
            } else if (phase <= 0.4) {
                const t = easeInOutQuad(clamp((phase - 0.2) / 0.2, 0, 1));
                if (nameInner)
                    gsap.set(nameInner, {
                        clipPath: "inset(0 0 0% 0)",
                        opacity: 1,
                        y: 0,
                    });
                if (dateInner)
                    gsap.set(dateInner, {
                        clipPath: "inset(0 0 0% 0)",
                        opacity: 1,
                        y: 0,
                    });
                if (contentBlock) gsap.set(contentBlock, { y: `${t * 30}vh` });
                if (sponsorRow)
                    gsap.set(sponsorRow, {
                        clipPath: "inset(0 0 0% 0)",
                        y: 0,
                    });

                // --- Text at bottom (images active): phase 0.40 – 0.80 ---
            } else if (phase <= 0.8) {
                if (nameInner)
                    gsap.set(nameInner, { clipPath: "inset(0 0 0% 0)", opacity: 1 });
                if (dateInner)
                    gsap.set(dateInner, { clipPath: "inset(0 0 0% 0)", opacity: 1 });
                if (contentBlock) gsap.set(contentBlock, { y: "30vh" });
                if (sponsorRow)
                    gsap.set(sponsorRow, { clipPath: "inset(0 0 0% 0)" });

                // --- Text Exit: phase 0.80 – 1.0 ---
            } else {
                const t = easeInCubic(clamp((phase - 0.8) / 0.2, 0, 1));
                if (contentBlock) gsap.set(contentBlock, { y: "30vh" });
                if (nameInner)
                    gsap.set(nameInner, {
                        clipPath: `inset(0 0 ${t * 100}% 0)`,
                        opacity: 1,
                        y: 0,
                    });
                const dateT = easeInCubic(clamp((phase - 0.78) / 0.18, 0, 1));
                if (dateInner)
                    gsap.set(dateInner, {
                        clipPath: `inset(0 0 ${dateT * 100}% 0)`,
                        opacity: 1,
                        y: 0,
                    });

                // Sponsor exits last (top-to-bottom ripple: 0.82 -> 1.0)
                const sponsorExitT = easeInCubic(clamp((phase - 0.82) / 0.18, 0, 1));
                if (sponsorRow)
                    gsap.set(sponsorRow, {
                        clipPath: `inset(0 0 ${sponsorExitT * 100}% 0)`,
                        y: 0,
                    });
            }

            // ==========================================================
            // IMAGE ANIMATIONS — Smooth scale-based depth emergence
            // Same visual feel as hero/about layers emerging from Z-depth
            // ==========================================================

            // Right image: active during phase 0.25 → 0.55 (range = 0.30)
            // Generous range for slow, smooth emergence matching hero/about feel
            const rightT = clamp((phase - 0.25) / 0.3, 0, 1);

            // Left image: active during phase 0.55 → 0.85 (range = 0.30)
            // Starts exactly when right exits — same range = identical scroll sensitivity
            const leftT = clamp((phase - 0.55) / 0.3, 0, 1);

            // Apply depth emergence to both images
            applyImageDepth(rightImg, rightImgLayer, rightT);
            applyImageDepth(leftImg, leftImgLayer, leftT);
        },
        [],
    );

    // --- Event Handlers for NON-ARTIST layers only ---
    const onLayerEnter = (el: HTMLElement) => {
        // Skip artist layers — they're handled by onArtistScrollProgress
        if (el.dataset.artistId) return;

        const texts = el.querySelectorAll(".text-mask > *");
        if (texts.length) {
            gsap.fromTo(
                texts,
                { y: "110%", opacity: 0 },
                {
                    y: "0%",
                    opacity: 1,
                    duration: 1.2,
                    ease: "power4.out",
                    stagger: 0.15,
                    overwrite: true,
                },
            );
        }
    };

    const onLayerExit = (el: HTMLElement) => {
        // Skip artist layers
        if (el.dataset.artistId) return;

        const texts = el.querySelectorAll(".text-mask > *");
        if (texts.length) {
            gsap.to(texts, {
                y: "-110%",
                opacity: 0,
                duration: 0.8,
                ease: "power3.in",
                stagger: 0.05,
                overwrite: true,
            });
        }
    };

    const { lenisRef, totalDistanceRef, currentZRef } = useZScroll(containerRef, {
        onLayerEnter,
        onLayerExit,
        onUpdate,
        onLayerScrollProgress: onArtistScrollProgress,
    });

    // --- Initial Setup & Cursor ---
    useEffect(() => {
        if ("scrollRestoration" in history) {
            history.scrollRestoration = "manual";
        }
        window.scrollTo(0, 0);

        // Hide all artist text initially via clip-path
        const allNameSvgs = document.querySelectorAll(".artist-name-svg");
        gsap.set(allNameSvgs, { clipPath: "inset(0 0 100% 0)", opacity: 1 });

        const allDates = document.querySelectorAll(".artist-date");
        gsap.set(allDates, { clipPath: "inset(0 0 100% 0)", opacity: 1 });

        // Hide all artist images initially
        const allArtistImages = document.querySelectorAll(".artist-img");
        gsap.set(allArtistImages, { visibility: "hidden", opacity: 0 });

        // Non-artist text masks (about layers etc)
        const nonArtistMaskedText = document.querySelectorAll(
            ".about-layer .text-mask > *",
        );
        gsap.set(nonArtistMaskedText, { y: "100%", opacity: 0 });

        // Only enable tilt effect on desktop
        if (!isMobile) {
            window.addEventListener("mousemove", handleMouseMove, { passive: true });
            document.body.addEventListener("mouseleave", handleMouseLeave);
        }

        // Enable audio playback on first user interaction
        const enableAudioOnInteraction = () => {
            if (!userInteractedRef.current) {
                userInteractedRef.current = true;
                setIsGlobalPlaying(true);
            }
        };

        const moveCursor = (e: MouseEvent) => {
            enableAudioOnInteraction();
            if (cursorDotRef.current) {
                cursorDotRef.current.style.left = e.clientX + "px";
                cursorDotRef.current.style.top = e.clientY + "px";
            }
        };

        const handleHover = () => cursorRef.current?.classList.add("hover");
        const handleLeave = () => cursorRef.current?.classList.remove("hover");

        // Only enable custom cursor on desktop for performance
        if (!isMobile) {
            window.addEventListener("mousemove", moveCursor, { passive: true });

            const interactives = document.querySelectorAll(
                "a, button, .project-card, .cta-btn",
            );
            interactives.forEach((el) => {
                el.addEventListener("mouseenter", handleHover);
                el.addEventListener("mouseleave", handleLeave);
            });
        }

        window.addEventListener("click", enableAudioOnInteraction);
        window.addEventListener("touchstart", enableAudioOnInteraction, { passive: true });

        return () => {
            // Only cleanup tilt listeners on desktop
            if (!isMobile) {
                window.removeEventListener("mousemove", handleMouseMove);
                document.body.removeEventListener("mouseleave", handleMouseLeave);
            }

            window.removeEventListener("click", enableAudioOnInteraction);
            window.removeEventListener("touchstart", enableAudioOnInteraction);

            // Only cleanup cursor listeners on desktop
            if (!isMobile) {
                window.removeEventListener("mousemove", moveCursor);
                const interactives = document.querySelectorAll(
                    "a, button, .project-card, .cta-btn",
                );
                interactives.forEach((el) => {
                    el.removeEventListener("mouseenter", handleHover);
                    el.removeEventListener("mouseleave", handleLeave);
                });
            }
        };
    }, [handleMouseMove, handleMouseLeave]);

    const handleExploreClick = () => {
        const primer = new Audio();
        primer.src =
            "data:audio/wav;base64,UklGRiQAAABXQVZFRm10IBAAAAABAAEARKwAAIhYAQACABAAZGF0YQAAAAA=";
        primer
            .play()
            .then(() => primer.pause())
            .catch(() => { });
        if (!lenisRef.current || !totalDistanceRef.current) return;

        // Explicitly handle "BACK TO TOP" based on button state to match user expectation
        if (buttonLabel === "BACK TO TOP") {
            gsap.to(starSpeed, {
                current: 20,
                duration: 2,
                ease: "power2.in",
            });
            lenisRef.current.scrollTo(0, {
                force: true,
                immediate: true,
            });
            // Snap the Z position immediately to avoid slow lerp convergence
            currentZRef.current = 0;
            // Reset state immediately
            setButtonLabel("EXPLORE LINEUP");
            setActiveArtist(null);
            lastActiveArtistKey.current = null;
            finalRevealAnimationTriggered.current = false;
            finalRevealRef.current?.resetAnimation();
            gsap.to(starSpeed, {
                current: 1,
                duration: 1,
                ease: "power2.out",
            });
            return;
        }

        const totalDist = totalDistanceRef.current;
        const windowHeight = window.innerHeight;
        const maxScroll = totalDist - windowHeight;
        const currentScroll = lenisRef.current.scroll;

        // Calculate current Z position based on scroll
        const currentZ = -(currentScroll / maxScroll) * totalDist;

        // Find the current active section index
        // Use a slightly larger buffer (1000px) to ensure we catch the current section even if slightly scrolled past
        let currentStopIndex = SCROLL_STOPS.findIndex((s, i) => {
            const nextStop = SCROLL_STOPS[i + 1];
            if (!nextStop) return true; // Last section always matches if we're past the second-to-last
            // Check if we are within the range of this section (from its start to the next section's start)
            // Adding buffer to ensure smooth transition detection
            return currentZ <= s.z + 1000 && currentZ > nextStop.z + 1000;
        });

        if (currentStopIndex === -1) currentStopIndex = 0;

        // Calculate next index
        const nextIndex = (currentStopIndex + 1) % SCROLL_STOPS.length;
        const nextStop = SCROLL_STOPS[nextIndex];

        // Speed up stars for effect
        gsap.to(starSpeed, {
            current: 20,
            duration: 2,
            ease: "power2.in",
        });

        // If wrapping back to hero (index 0), scroll to top with state resets
        if (nextIndex === 0) {
            lenisRef.current.scrollTo(0, {
                force: true,
                immediate: true,
            });
            currentZRef.current = 0;
            setButtonLabel("EXPLORE LINEUP");
            setActiveArtist(null);
            lastActiveArtistKey.current = null;
            finalRevealAnimationTriggered.current = false;
            finalRevealRef.current?.resetAnimation();
            gsap.to(starSpeed, {
                current: 1,
                duration: 1,
                ease: "power2.out",
            });
            return;
        }

        // Dynamically compute scroll target from the actual section's data-z
        // For artist sections: target ARTIST_VIEW_PHASE so SVG is fully revealed & centered
        // For non-artist sections: use the SCROLL_STOPS z-value directly
        let targetZ: number;
        const nextEl = layerRefs.current[nextStop.id];
        if (nextEl && nextEl.dataset.artistId) {
            const dataZ = parseFloat(nextEl.dataset.z || "0");
            const artistRange = parseFloat(nextEl.dataset.artistRange || "7000");
            const offset = ARTIST_VIEW_PHASE * (artistRange + 200) - 200;
            targetZ = dataZ - offset;
        } else {
            targetZ = nextStop.z;
        }

        let targetScroll = (-targetZ * maxScroll) / totalDist;

        // Smooth scroll to target
        lenisRef.current.scrollTo(targetScroll, {
            duration: 3.5,
            easing: (t: number) =>
                t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
            onComplete: () => {
                gsap.to(starSpeed, {
                    current: 1,
                    duration: 2,
                    ease: "power2.out",
                });
            },
        });
    };

    // =====================================================================
    // MOBILE/TABLET Z-AXIS NAVIGATION — Phase-Aware State Machine
    // =====================================================================
    // For non-artist regions: scroll exactly one viewport-height per click.
    // For artist layers: step through animation sub-phases on each click
    //   Forward:  Enter → Text Reveal → Text Shift Down → Images → Text Exit → Leave
    //   Backward: exact reverse order
    // =====================================================================

    const NAV_DURATION = 1.8; // seconds for each smooth scroll animation

    // Sub-phase waypoints within an artist layer (phase 0→1)
    // Each click advances to the next stop. Both images get symmetric treatment.
    //
    // Right image range: phase 0.25 → 0.55  (rightT = (phase − 0.25) / 0.30)
    // Left  image range: phase 0.55 → 0.85  (leftT  = (phase − 0.55) / 0.30)
    //
    const ARTIST_PHASE_STOPS = [
        0.10,   // 1. Text reveal playing            (name + date clip-mask animate in)
        0.30,   // 2. Text shifted down               (content slides to +30vh)
        0.34,   // 3. Right image lightly revealed     (rightT ≈ 0.30 — approaching, semi-transparent)
        0.47,   // 4. Right image fully at camera      (rightT ≈ 0.73 — scale 1, full opacity)
        0.56,   // 5. Right image passes + left begins (rightT → 1.0, leftT ≈ 0.03)
        0.64,   // 6. Left image lightly revealed      (leftT ≈ 0.30 — approaching, semi-transparent)
        0.77,   // 7. Left image fully at camera       (leftT ≈ 0.73 — scale 1, full opacity)
        0.90,   // 8. Text exit playing                (name + date clip-mask animate out)
    ];

    // Helper: convert a target Z-depth to a scroll position
    const zToScroll = (targetZ: number): number => {
        if (!totalDistanceRef.current) return 0;
        const totalDist = totalDistanceRef.current;
        const maxScroll = totalDist - window.innerHeight;
        return (-targetZ * maxScroll) / totalDist;
    };

    // Helper: convert a target artist phase to a cameraZ value
    // phase = (relativeZ - phaseStart) / totalPhaseRange
    // relativeZ = depth - cameraZ
    // so: cameraZ = depth - phaseStart - phase * totalPhaseRange
    const artistPhaseToZ = (artistDepth: number, artistRange: number, targetPhase: number): number => {
        const phaseStart = -200;
        const totalPhaseRange = artistRange + 200; // phaseEnd - phaseStart = artistRange - (-200)
        const relativeZ = phaseStart + targetPhase * totalPhaseRange;
        return artistDepth - relativeZ;
    };

    // Helper: determine current artist phase (returns null if not inside an artist)
    const getCurrentArtistInfo = (currentZ: number) => {
        const artistKeys = ['artist1', 'artist2', 'artist3'];
        for (const key of artistKeys) {
            const el = layerRefs.current[key];
            if (!el) continue;
            const depth = parseFloat(el.dataset.z || '0');
            const artistRange = parseFloat(el.dataset.artistRange || '7000');
            const phaseStart = -200;
            const totalPhaseRange = artistRange + 200;
            const relativeZ = depth - currentZ;
            const rawPhase = (relativeZ - phaseStart) / totalPhaseRange;
            // Consider "inside" if phase is between -0.02 and 1.02 (slight buffer)
            if (rawPhase >= -0.02 && rawPhase <= 1.02) {
                return {
                    key,
                    depth,
                    artistRange,
                    phase: Math.max(0, Math.min(1, rawPhase)),
                    phaseStart,
                    totalPhaseRange,
                };
            }
        }
        return null;
    };

    const handleMobileZNav = (direction: 'forward' | 'backward') => {
        if (!lenisRef.current || !totalDistanceRef.current) return;

        // Prime audio context on first interaction
        if (!userInteractedRef.current) {
            userInteractedRef.current = true;
            setIsGlobalPlaying(true);
        }

        const totalDist = totalDistanceRef.current;
        const windowHeight = window.innerHeight;
        const maxScroll = totalDist - windowHeight;
        const currentScroll = lenisRef.current.scroll;
        const currentZ = -(currentScroll / maxScroll) * totalDist;

        // Check if we're currently inside an artist layer
        const artistInfo = getCurrentArtistInfo(currentZ);

        let targetScroll: number;

        if (artistInfo) {
            // ── INSIDE AN ARTIST LAYER: step through sub-phases ──
            const { depth, artistRange, phase } = artistInfo;

            if (direction === 'forward') {
                // Find the next phase stop that is ahead of our current phase
                const nextPhase = ARTIST_PHASE_STOPS.find(p => p > phase + 0.02);

                if (nextPhase !== undefined) {
                    // Jump to the next sub-phase within this artist
                    const targetZ = artistPhaseToZ(depth, artistRange, nextPhase);
                    targetScroll = zToScroll(targetZ);
                } else {
                    // We're past the last sub-phase — exit this artist layer
                    // Scroll one viewport-height forward to move out
                    targetScroll = Math.min(currentScroll + windowHeight, maxScroll);
                }
            } else {
                // BACKWARD: find the previous phase stop behind current phase
                const prevPhases = ARTIST_PHASE_STOPS.filter(p => p < phase - 0.02);
                const prevPhase = prevPhases.length > 0 ? prevPhases[prevPhases.length - 1] : undefined;

                if (prevPhase !== undefined) {
                    // Jump to the previous sub-phase within this artist
                    const targetZ = artistPhaseToZ(depth, artistRange, prevPhase);
                    targetScroll = zToScroll(targetZ);
                } else {
                    // We're before the first sub-phase — exit this artist backwards
                    // Scroll one viewport-height backward to move out
                    targetScroll = Math.max(currentScroll - windowHeight, 0);
                }
            }
        } else {
            // ── OUTSIDE ARTIST LAYERS: fixed-distance scroll ──
            if (direction === 'forward') {
                // Check if scrolling forward would land us inside an artist layer
                const prospectiveScroll = Math.min(currentScroll + windowHeight, maxScroll);
                const prospectiveZ = -(prospectiveScroll / maxScroll) * totalDist;
                const prospectiveArtist = getCurrentArtistInfo(prospectiveZ);

                if (prospectiveArtist && prospectiveArtist.phase > 0.05) {
                    // Would land mid-artist — instead snap to the first phase stop
                    const targetZ = artistPhaseToZ(
                        prospectiveArtist.depth,
                        prospectiveArtist.artistRange,
                        ARTIST_PHASE_STOPS[0],
                    );
                    targetScroll = zToScroll(targetZ);
                } else {
                    targetScroll = prospectiveScroll;
                }
            } else {
                // Backward: check if we'd land inside an artist layer
                const prospectiveScroll = Math.max(currentScroll - windowHeight, 0);
                const prospectiveZ = -(prospectiveScroll / maxScroll) * totalDist;
                const prospectiveArtist = getCurrentArtistInfo(prospectiveZ);

                if (prospectiveArtist && prospectiveArtist.phase < 0.95) {
                    // Would land mid-artist — snap to last phase stop
                    const lastStop = ARTIST_PHASE_STOPS[ARTIST_PHASE_STOPS.length - 1];
                    const targetZ = artistPhaseToZ(
                        prospectiveArtist.depth,
                        prospectiveArtist.artistRange,
                        lastStop,
                    );
                    targetScroll = zToScroll(targetZ);
                } else {
                    targetScroll = prospectiveScroll;
                }
            }
        }

        // Clamp to valid scroll range
        targetScroll = Math.max(0, Math.min(targetScroll, maxScroll));

        // Already at the boundary or same position — nothing to do
        if (Math.abs(targetScroll - currentScroll) < 1) return;

        // Subtle star speed boost during movement
        gsap.to(starSpeed, { current: 10, duration: NAV_DURATION * 0.4, ease: 'power2.in' });

        // Smooth quintic ease-in-out — video-game camera feel
        lenisRef.current.scrollTo(targetScroll, {
            duration: NAV_DURATION,
            easing: (t: number) =>
                t < 0.5
                    ? 16 * t * t * t * t * t
                    : 1 - Math.pow(-2 * t + 2, 5) / 2,
            onComplete: () => {
                gsap.to(starSpeed, {
                    current: 1,
                    duration: NAV_DURATION * 0.5,
                    ease: 'power2.out',
                });
            },
        });
    };

    return (
        <div className="pronite-page" ref={containerRef}>
            <Starfield />
            <div ref={cursorRef} className="cursor">
                <div ref={cursorDotRef} className="cursor-dot"></div>
                <div className="cursor-circle"></div>
            </div>

            <nav className="nav">
                <div className="nav-left">
                    <button
                        className="exit-btn"
                        onClick={() => navigate("/")}
                        aria-label="Exit to Home"
                    >
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        >
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                        </svg>
                    </button>
                </div>
            </nav>

            <button
                className={`explore-btn${activeArtist ? " card-active" : ""}`}
                onClick={handleExploreClick}
            >
                {buttonLabel}
            </button>

            <div className="scroll-progress-container">
                <div className="scroll-track">
                    <div className="logo-bottom-wrapper">
                        <img
                            src="/ryoku_emoji.png"
                            className="progress-logo-bottom"
                            alt="Ryoku"
                        />
                    </div>
                </div>
            </div>

            {/* Mobile/Tablet Z-Axis Navigation Buttons — CSS controls visibility */}
            <div className="mobile-z-nav">
                <button
                    className="mobile-z-nav-btn mobile-z-nav-forward"
                    onClick={() => handleMobileZNav('forward')}
                    aria-label="Navigate Forward"
                >
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                        <path
                            d="M12 4L12 20M12 4L6 10M12 4L18 10"
                            stroke="white"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </button>
                <button
                    className="mobile-z-nav-btn mobile-z-nav-backward"
                    onClick={() => handleMobileZNav('backward')}
                    aria-label="Navigate Backward"
                >
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                        <path
                            d="M12 20L12 4M12 20L6 14M12 20L18 14"
                            stroke="white"
                            strokeWidth="2.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </button>
            </div>

            <div id="z-space-container" ref={containerRef}>
                <Starfield speedRef={starSpeed} />

                <div ref={tiltRef} className="tilt-layer">
                    <div className="z-content">
                        {/* HERO */}
                        <section
                            ref={(el) => {
                                layerRefs.current["hero"] = el;
                            }}
                            className="z-layer hero-layer"
                            data-z="-100"
                            data-persist="15000"
                        >
                            <div className="hero-partners-row">
                                <div className="hero-partner-item">
                                    <img
                                        src="pronite/nmamit.svg"
                                        alt="NMAMIT"
                                        className="nmamit-logo"
                                    />
                                </div>
                                <div className="hero-partner-divider"></div>
                                <div className="hero-partner-item">
                                    <img
                                        src="/incridea.png"
                                        alt="Incridea"
                                        className="incridea-logo"
                                    />
                                </div>
                            </div>
                            <h1 className="hero-title">
                                <img
                                    src="pronite/inc_chrome.svg"
                                    alt="Pronite"
                                    className="pronite-main-logo"
                                />
                            </h1>
                        </section>

                        {/* ABOUT */}
                        <section
                            ref={(el) => {
                                layerRefs.current["about"] = el;
                            }}
                            className="z-layer about-layer"
                            data-z="-900"
                            data-persist="15000"
                            data-fade-exp="25"
                        >
                            <div>
                                <h2 className="about-text">PRESENTING TO YOU</h2>
                            </div>
                        </section>

                        {/* ABOUT 2 */}
                        <section
                            ref={(el) => {
                                layerRefs.current["about2"] = el;
                            }}
                            className="z-layer about-layer"
                            data-z="-1900"
                            data-persist="15000"
                            data-fade-exp="25"
                        >
                            <div>
                                <h2 className="about-text">PRONITE ARTIST</h2>
                            </div>
                        </section>

                        {/* ARMAAN MALIK (Artist 1) */}
                        <section
                            ref={(el) => {
                                layerRefs.current["artist1"] = el;
                            }}
                            className="z-layer artist-layer"
                            data-z="-3500"
                            data-pin="true"
                            data-persist="7000"
                            data-artist-id="artist1"
                            data-artist-range="7000"
                            data-fade-exp="25"
                        >
                            <div className="artist-content">
                                <div className="sponsor-row sponsor-row-3">
                                    <img src="pronite/TribeVibe.svg" alt="Sponsor 1" className="sponsor-logo" />
                                    <img src="pronite/Incridea.svg" alt="Sponsor 2" className="sponsor-logo" />
                                    <img src="pronite/NMAMIT.svg" alt="Sponsor 3" className="sponsor-logo" />
                                </div>
                                <div className="text-mask text-mask-name">
                                    <img
                                        src="pronite/ArmaanMalik.svg"
                                        alt="Armaan Malik"
                                        className="artist-name-svg"
                                    />
                                </div>
                                <div className="text-mask text-mask-date">
                                    <p className="artist-date">5th Mar · 9:00 PM</p>
                                </div>
                            </div>
                        </section>

                        <section
                            ref={(el) => {
                                layerRefs.current["artist1_right"] = el;
                            }}
                            className="z-layer artist-image-layer"
                            data-z="-5200"
                            data-pin="false"
                            data-artist-image="true"
                        >
                            <div className="artist-img-wrapper">
                                <img
                                    src="pronite/artist1-right.jpg"
                                    alt="Armaan Malik Right"
                                    className="artist-img right"
                                />
                            </div>
                        </section>

                        <section
                            ref={(el) => {
                                layerRefs.current["artist1_left"] = el;
                            }}
                            className="z-layer artist-image-layer"
                            data-z="-5800"
                            data-pin="false"
                            data-artist-image="true"
                        >
                            <div className="artist-img-wrapper">
                                <video
                                    muted
                                    autoPlay
                                    loop
                                    playsInline
                                    preload="auto"
                                    className="artist-img left"
                                    style={{ filter: "none" }}
                                >
                                    <source src={armaanVideo} type="video/webm" />
                                </video>
                            </div>
                        </section>

                        {/* NIKHITA GANDHI (Artist 2) */}
                        <section
                            ref={(el) => {
                                layerRefs.current["artist2"] = el;
                            }}
                            className="z-layer artist-layer"
                            data-z="-11000"
                            data-pin="true"
                            data-persist="7000"
                            data-artist-id="artist2"
                            data-artist-range="7000"
                            data-fade-exp="25"
                        >
                            <div className="artist-content">
                                <div className="sponsor-row sponsor-row-2">
                                    <img src="pronite/sponsor-placeholder.svg" alt="Sponsor 1" className="sponsor-logo" />
                                    <img src="pronite/sponsor-placeholder.svg" alt="Sponsor 2" className="sponsor-logo" />
                                </div>
                                <div className="text-mask text-mask-name">
                                    <img
                                        src="pronite/NikhitaGandhi.svg"
                                        alt="Nikhita Gandhi"
                                        className="artist-name-svg"
                                    />
                                </div>
                                <div className="text-mask text-mask-date">
                                    <p className="artist-date">5th Mar · 11:30 PM</p>
                                </div>
                            </div>
                        </section>

                        <section
                            ref={(el) => {
                                layerRefs.current["artist2_right"] = el;
                            }}
                            className="z-layer artist-image-layer"
                            data-z="-13500"
                            data-pin="false"
                            data-artist-image="true"
                        >
                            <div className="artist-img-wrapper">
                                <img
                                    src="pronite/artist1-right.jpg"
                                    alt="Nikhita Gandhi Right"
                                    className="artist-img right"
                                />
                            </div>
                        </section>

                        <section
                            ref={(el) => {
                                layerRefs.current["artist2_left"] = el;
                            }}
                            className="z-layer artist-image-layer"
                            data-z="-14500"
                            data-pin="false"
                            data-artist-image="true"
                        >
                            <div className="artist-img-wrapper">
                                <video
                                    muted
                                    autoPlay
                                    loop
                                    playsInline
                                    preload="auto"
                                    className="artist-img left"
                                    style={{ filter: "none" }}
                                >
                                    <source src={nikhitaVideo} type="video/webm" />
                                </video>
                            </div>
                        </section>

                        {/* ALO (Artist 3) */}
                        <section
                            ref={(el) => {
                                layerRefs.current["artist3"] = el;
                            }}
                            className="z-layer artist-layer"
                            data-z="-18500"
                            data-pin="true"
                            data-persist="7000"
                            data-artist-id="artist3"
                            data-artist-range="7000"
                            data-fade-exp="25"
                        >
                            <div className="artist-content">
                                <div className="sponsor-row sponsor-row-2">
                                    <img src="pronite/sponsor-placeholder.svg" alt="Sponsor 1" className="sponsor-logo" />
                                    <img src="pronite/sponsor-placeholder.svg" alt="Sponsor 2" className="sponsor-logo" />
                                </div>
                                <div className="text-mask text-mask-name">
                                    <img
                                        src="pronite/ALO.svg"
                                        alt="ALO"
                                        className="artist-name-svg alo-svg"
                                    />
                                </div>
                                <div className="text-mask text-mask-date">
                                    <p className="artist-date">6th Mar · 1:30 AM</p>
                                </div>
                            </div>
                        </section>

                        <section
                            ref={(el) => {
                                layerRefs.current["artist3_right"] = el;
                            }}
                            className="z-layer artist-image-layer"
                            data-z="-21000"
                            data-pin="false"
                            data-artist-image="true"
                        >
                            <div className="artist-img-wrapper">
                                <img
                                    src="pronite/artist3-right.jpg"
                                    alt="ALO Right"
                                    className="artist-img right"
                                />
                            </div>
                        </section>

                        <section
                            ref={(el) => {
                                layerRefs.current["artist3_left"] = el;
                            }}
                            className="z-layer artist-image-layer"
                            data-z="-22000"
                            data-pin="false"
                            data-artist-image="true"
                        >
                            <div className="artist-img-wrapper">
                                <video
                                    muted
                                    autoPlay
                                    loop
                                    playsInline
                                    preload="auto"
                                    className="artist-img left"
                                    style={{ filter: "none" }}
                                >
                                    <source src={aloVideo} type="video/webm" />
                                </video>
                            </div>
                        </section>

                        {/* FINAL REVEAL */}
                        <section
                            ref={(el) => {
                                layerRefs.current["final-reveal"] = el;
                            }}
                            className="z-layer"
                            data-z="-27500"
                            data-pin="true"
                            data-persist="5000"
                            style={{ opacity: 0, pointerEvents: "none" }}
                        >
                            <FinalReveal
                                ref={finalRevealRef}
                                artists={[
                                    {
                                        name: (
                                            <>
                                                NIKITHA
                                                <br />
                                                GANDHI
                                            </>
                                        ),
                                        role: "Special Guest",
                                        time: "09:00 PM",
                                        image: ARTISTS.artist2.profileImage,
                                        className: "md:col-span-4",
                                    },
                                    {
                                        name: "ARMAAN MALIK",
                                        role: "HEADLINER",
                                        time: "11:30 PM",
                                        image: ARTISTS.artist1.profileImage,
                                        isHeadliner: true,
                                        className: "md:col-span-6",
                                    },
                                    {
                                        name: (
                                            <>
                                                ALO
                                                <br />
                                                THE BAND
                                            </>
                                        ),
                                        role: "Encore Act",
                                        time: "01:30 AM",
                                        image: ARTISTS.artist3.profileImage,
                                        className: "md:col-span-3",
                                    },
                                ]}
                            />
                        </section>
                    </div>
                </div>
            </div>

            <AnimatePresence mode="wait">
                {activeArtist && (
                    <ProniteCard
                        key={activeArtist.id}
                        artistName={activeArtist.name}
                        artistDate={activeArtist.date}
                        artistImage={activeArtist.profileImage}
                        accentColor={activeArtist.accent}
                        songUrl={activeArtist.song}
                        onNext={() => handleArtistNavigation("next")}
                        onPrev={() => handleArtistNavigation("prev")}
                        isMuted={isGlobalMuted}
                        onMuteToggle={handleMuteToggle}
                        isPlaying={isGlobalPlaying}
                        onPlayToggle={() => setIsGlobalPlaying(!isGlobalPlaying)}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default PronitePage;
