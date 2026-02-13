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

import armaanSong from "../assets/pronite/audios/pehla_pyar_armaan_malik.mp3";
import nikhitaSong from "../assets/pronite/audios/jugnu_nikitha_gandhi.mp3";
import aloSong from "../assets/pronite/audios/saibo_alo.mp3";

import armaanVideo from "../assets/pronite/videos/armaan_malik.webm";
import aloVideo from "../assets/pronite/videos/alo.webm";

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
        image: "/artist1-right.jpg",
        profileImage: "/Armaan_Malik_Profile.jpg",
        accent: "#D84D7D",
        song: armaanSong,
    },
    artist2: {
        id: "a2",
        name: "Nikhita Gandhi",
        date: "5th Mar @ 11:30PM",
        image: "/artist2-right.jpg",
        profileImage: "/Nikhita_Gandhi_profile.jpg",
        accent: "#4DA6D8",
        song: nikhitaSong,
    },
    artist3: {
        id: "a3",
        name: "ALO",
        date: "6th Mar @ 1:30AM",
        image: "/artist3-right.jpg",
        profileImage: "/The_alo_band_profile.jpg",
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

// --- Easing helpers ---
const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInCubic = (t: number) => t * t * t;
const easeInOutQuad = (t: number) =>
    t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

const PronitePage: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const cursorRef = useRef<HTMLDivElement>(null);
    const cursorDotRef = useRef<HTMLDivElement>(null);
    const cursorCircleRef = useRef<HTMLDivElement>(null);
    const tiltRef = useRef<HTMLDivElement>(null);

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
            const targetScroll = (-targetStop.z * maxScroll) / totalDistanceRef.current;
            lenisRef.current.scrollTo(targetScroll, { duration: 2.5 });
        }
    };
    // --- Improved Scroll Tracking with Priority System ---
    const onUpdate = useCallback((currentZ: number) => {
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
                pointerEvents: opacity > 0.9 ? "auto" : "none"
            });

            // Trigger GSAP animation when reaching z=-26000 (when section starts fading in)
            // Use opacity threshold to ensure cards animate as soon as section is visible
            if (opacity > 0.1 && !finalRevealAnimationTriggered.current) {
                finalRevealAnimationTriggered.current = true;
                // Immediate animation, no delay
                finalRevealRef.current?.playAnimation();
            }

            // Reset animation if scrolling back up past the trigger point
            if (opacity <= 0.05 && finalRevealAnimationTriggered.current) {
                finalRevealAnimationTriggered.current = false;
                finalRevealRef.current?.resetAnimation();
            }
        }

        const currentStopIndex = SCROLL_STOPS.findIndex((s, i) => {
            const nextStop = SCROLL_STOPS[i + 1];
            if (!nextStop) return currentZ <= s.z + 1000;
            return currentZ <= s.z + 1000 && currentZ > nextStop.z + 1000;
        });

        if (currentStopIndex !== -1) {
            const nextIndex = (currentStopIndex + 1) % SCROLL_STOPS.length;
            setButtonLabel(
                nextIndex === 0 ? "EXPLORE LINEUP" : `EXPLORE ${SCROLL_STOPS[nextIndex].id.toUpperCase()}`
            );
        }
    }, [setActiveArtist]);

    // --- 3D TILT EFFECT ---
    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!tiltRef.current) return;

        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;

        const xPos = (clientX / innerWidth - 0.5) * 2;
        const yPos = (clientY / innerHeight - 0.5) * 2;

        mousePos.current = { x: xPos, y: yPos };
        isHovering.current = true;
    }, []);

    const handleMouseLeave = useCallback(() => {
        isHovering.current = false;
    }, []);

    useEffect(() => {
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
    }, []);

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

                // --- Text at bottom (images active): phase 0.40 – 0.80 ---
            } else if (phase <= 0.8) {
                if (nameInner)
                    gsap.set(nameInner, { clipPath: "inset(0 0 0% 0)", opacity: 1 });
                if (dateInner)
                    gsap.set(dateInner, { clipPath: "inset(0 0 0% 0)", opacity: 1 });
                if (contentBlock) gsap.set(contentBlock, { y: "30vh" });

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
    const onLayerEnter = useCallback((el: HTMLElement) => {
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
    }, []);

    const onLayerExit = useCallback((el: HTMLElement) => {
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
    }, []);

    const { lenisRef, totalDistanceRef } = useZScroll(containerRef, {
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

        window.addEventListener("mousemove", handleMouseMove, { passive: true });
        document.body.addEventListener("mouseleave", handleMouseLeave);

        const moveCursor = (e: MouseEvent) => {
            if (cursorDotRef.current) {
                cursorDotRef.current.style.left = e.clientX + "px";
                cursorDotRef.current.style.top = e.clientY + "px";
            }
            if (cursorCircleRef.current) {
                setTimeout(() => {
                    if (cursorCircleRef.current) {
                        cursorCircleRef.current.style.left = e.clientX + "px";
                        cursorCircleRef.current.style.top = e.clientY + "px";
                    }
                }, 50);
            }
        };

        const handleHover = () => cursorRef.current?.classList.add("hover");
        const handleLeave = () => cursorRef.current?.classList.remove("hover");

        window.addEventListener("mousemove", moveCursor);
        const interactives = document.querySelectorAll(
            "a, button, .project-card, .cta-btn",
        );
        interactives.forEach((el) => {
            el.addEventListener("mouseenter", handleHover);
            el.addEventListener("mouseleave", handleLeave);
        });

        return () => {
            window.removeEventListener("mousemove", handleMouseMove);
            document.body.removeEventListener("mouseleave", handleMouseLeave);
            window.removeEventListener("mousemove", moveCursor);
            interactives.forEach((el) => {
                el.removeEventListener("mouseenter", handleHover);
                el.removeEventListener("mouseleave", handleLeave);
            });
        };
    }, [handleMouseMove, handleMouseLeave]);

    const handleExploreClick = () => {
        if (!lenisRef.current || !totalDistanceRef.current) return;

        // Explicitly handle "BACK TO TOP" based on button state to match user expectation
        if (buttonLabel === "BACK TO TOP") {
            gsap.to(starSpeed, {
                current: 20,
                duration: 2,
                ease: "power2.in",
            });
            lenisRef.current.scrollTo(0, {
                duration: 3.5,
                easing: (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
                onComplete: () => {
                    gsap.to(starSpeed, {
                        current: 1,
                        duration: 2,
                        ease: "power2.out",
                    });
                },
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

        const targetZ = nextStop.z;
        let targetScroll = (-targetZ * maxScroll) / totalDist;

        // Smooth scroll to target
        // Reduced duration from 10s to 3.5s for better responsiveness while keeping it smooth
        // Changed easing to easeInOutCubic for a more natural start/stop feel
        lenisRef.current.scrollTo(targetScroll, {
            duration: 3.5,
            easing: (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2,
            onComplete: () => {
                gsap.to(starSpeed, {
                    current: 1,
                    duration: 2,
                    ease: "power2.out",
                });
            },
        });
    };

    return (
        <div className="pronite-page" ref={containerRef}>
            <Starfield />
            <div ref={cursorRef} className="cursor">
                <div ref={cursorDotRef} className="cursor-dot"></div>
                <div ref={cursorCircleRef} className="cursor-circle"></div>
            </div>

            <nav className="nav">
                <div className="nav-left">
                    <button className="menu-btn" aria-label="Menu">
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                </div>
            </nav>

            <button className={`explore-btn${activeArtist ? ' card-active' : ''}`} onClick={handleExploreClick}>
                {buttonLabel}
            </button>

            <div className="scroll-progress-container">
                <div className="scroll-track">
                    <div className="progress-fill"></div>
                    <div className="logo-bottom-wrapper">
                        <img
                            src="/ryoku_emoji.png"
                            className="progress-logo-bottom"
                            alt="Ryoku"
                        />
                    </div>
                </div>
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
                                        src="/TribeVibe.svg"
                                        alt="TribeVibe"
                                        className="tribe-vibe-logo"
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
                                    src="/inc_chrome.svg"
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
                                <div className="text-mask text-mask-name">
                                    <img
                                        src="/ArmaanMalik.svg"
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
                                    src="/artist1-right.jpg"
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
                                    style={{ filter: 'none' }}
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
                                <div className="text-mask text-mask-name">
                                    <img
                                        src="/NikhitaGandhi.svg"
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
                                    src="/artist1-right.jpg"
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
                                <img
                                    src="/artist1-right.jpg"
                                    alt="Nikhita Gandhi Left"
                                    className="artist-img left"
                                />
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
                                <div className="text-mask text-mask-name">
                                    <img
                                        src="/ALO.svg"
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
                                    src="/artist3-right.jpg"
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
                                    style={{ filter: 'none' }}
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
                                        className: "md:col-span-3",
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
                        songUrl={activeArtist.song} // Add this
                        onNext={() => handleArtistNavigation("next")} // Add this
                        onPrev={() => handleArtistNavigation("prev")} // Add this
                    />
                )}
            </AnimatePresence>
        </div>
    );
};

export default PronitePage;
