import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import '../components/pronite/Pronite.css';
import Starfield from '../components/pronite/Starfield';
import { useZScroll } from '../hooks/useZScroll';

// --- Layer Configuration ---
const layersConfig = [
    { id: "hero", z: 0 },
    { id: "about", z: -900 },
    { id: "about2", z: -1900 },

    // ARTIST 1 CONFIGURATION
    // z: -3500 -> The point where the camera arrives at the text.
    { id: "artist1", z: -3500 },

    // Images placed deep enough so they don't overlap the text animation immediately
    { id: "artist1_right", z: -5000 },
    { id: "artist1_left", z: -6500 },

    // Next Artists
    { id: "artist2", z: -10000 },
    { id: "artist3", z: -12500 },
    { id: "artist4", z: -15000 },
    { id: "artist5", z: -17500 },
];

const PronitePage: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const cursorRef = useRef<HTMLDivElement>(null);
    const cursorDotRef = useRef<HTMLDivElement>(null);
    const cursorCircleRef = useRef<HTMLDivElement>(null);

    const layerRefs = useRef<Record<string, HTMLElement | null>>({});
    const revealedLayers = useRef<Set<string>>(new Set());

    // --- Main Scroll Logic ---
    const handleScrollUpdate = React.useCallback((cameraZ: number) => {
        const RENDER_DISTANCE = 4000;

        layersConfig.forEach(({ id, z }) => {
            const el = layerRefs.current[id];
            if (!el) return;

            // 1. Calculate Visibility
            // "Revel from the fixed place": We trigger exactly when we arrive (cameraZ <= z)
            // We keep it active for the duration of the pin + buffering
            const persist = parseFloat(el.dataset.persist || "1500");
            const isWithinRange = cameraZ <= z && cameraZ >= (z - persist - RENDER_DISTANCE);

            if (isWithinRange) {
                // --- REVEAL PHASE ---
                // Trigger when we actually hit the pin point (z)
                if (!revealedLayers.current.has(id)) {
                    // Only start if we are effectively "at" the layer (accounting for scroll speed)
                    if (cameraZ <= z) {
                        revealedLayers.current.add(id);
                        el.dataset.revealed = "true";
                        el.dataset.exited = "false";

                        // ** ANIMATION: TEXT REVEAL **
                        // Reveal from bottom (100%) to center (0%) upon arrival
                        const texts = el.querySelectorAll('.text-mask > *');
                        if (texts.length) {
                            gsap.fromTo(texts,
                                { y: "110%" }, // Start from bottom
                                {
                                    y: "0%",
                                    duration: 1.5,
                                    ease: "power4.out",
                                    stagger: 0.15,
                                    overwrite: true
                                }
                            );
                        }
                    }
                }
                // --- EXIT PHASE ---
                else {
                    // Trigger exit slightly before the pin releases
                    const exitPoint = z - persist + 800;
                    const isExiting = cameraZ < exitPoint;

                    // If exiting and not yet animated out
                    if (isExiting && el.dataset.exited !== "true" && el.dataset.pin === "true") {
                        el.dataset.exited = "true";
                        const texts = el.querySelectorAll('.text-mask > *');
                        if (texts.length) {
                            // ** ANIMATION: TEXT EXIT **
                            // Move upwards (-100%) as requested
                            gsap.fromTo(texts,
                                { y: "0%" }, // Ensure we start from center
                                {
                                    y: "-110%", // Move up and out
                                    duration: 1.2,
                                    ease: "power3.in",
                                    stagger: 0.1,
                                    overwrite: true
                                }
                            );
                        }
                    }
                    // Reset if user scrolls back UP into the section (Reverse exit)
                    else if (!isExiting && el.dataset.exited === "true") {
                        el.dataset.exited = "false";
                        const texts = el.querySelectorAll('.text-mask > *');
                        if (texts.length) {
                            gsap.to(texts, {
                                y: "0%",
                                duration: 1,
                                ease: "power4.out",
                                overwrite: true
                            });
                        }
                    }
                }
            } else {
                // --- CLEANUP (Out of View) ---
                const isFarGone = cameraZ < (z - persist - RENDER_DISTANCE) || cameraZ > (z + 2000);
                if (isFarGone && revealedLayers.current.has(id)) {
                    revealedLayers.current.delete(id);
                    el.dataset.revealed = "false";
                    el.dataset.exited = "false";

                    // Reset text to hidden position (bottom) for next reveal
                    const texts = el.querySelectorAll('.text-mask > *');
                    if (texts.length) {
                        gsap.set(texts, { y: "110%" });
                    }
                }
            }
        });
    }, []);

    useZScroll(containerRef, handleScrollUpdate);

    // --- Initial Setup & Cursor ---
    useEffect(() => {
        // Immediately force all text-masks to be hidden on load
        const allMaskedText = document.querySelectorAll('.text-mask > *');
        gsap.set(allMaskedText, { y: "100%" });

        // Cursor Logic
        const moveCursor = (e: MouseEvent) => {
            if (cursorDotRef.current) {
                cursorDotRef.current.style.left = e.clientX + 'px';
                cursorDotRef.current.style.top = e.clientY + 'px';
            }
            if (cursorCircleRef.current) {
                setTimeout(() => {
                    if (cursorCircleRef.current) {
                        cursorCircleRef.current.style.left = e.clientX + 'px';
                        cursorCircleRef.current.style.top = e.clientY + 'px';
                    }
                }, 50);
            }
        };
        const handleHover = () => cursorRef.current?.classList.add('hover');
        const handleLeave = () => cursorRef.current?.classList.remove('hover');

        window.addEventListener('mousemove', moveCursor);
        const interactives = document.querySelectorAll('a, button, .project-card, .cta-btn');
        interactives.forEach(el => {
            el.addEventListener('mouseenter', handleHover);
            el.addEventListener('mouseleave', handleLeave);
        });
        return () => {
            window.removeEventListener('mousemove', moveCursor);
            interactives.forEach(el => {
                el.removeEventListener('mouseenter', handleHover);
                el.removeEventListener('mouseleave', handleLeave);
            });
        };
    }, []);

    return (
        <div className="pronite-page">
            <div ref={cursorRef} className="cursor">
                <div ref={cursorDotRef} className="cursor-dot"></div>
                <div ref={cursorCircleRef} className="cursor-circle"></div>
            </div>

            <nav className="nav">
                <div className="nav-left">
                    <button className="menu-btn" aria-label="Menu">
                        <span></span><span></span><span></span>
                    </button>
                </div>
            </nav>

            <div className="scroll-progress">
                <div className="progress-line"></div>
                <div className="progress-rocket">🚀</div>
            </div>

            <div id="z-space-container" ref={containerRef}>
                <Starfield />

                <div className="z-content">

                    {/* HERO */}
                    <section ref={(el) => { layerRefs.current["hero"] = el; }} className="z-layer hero-layer" data-z="0">
                        <div className="hero-subtitle mb-4">
                            <img src="/incridea.png" alt="Incridea" style={{ height: '70px', width: 'auto', margin: '0 auto' }} />
                        </div>
                        <h1 className="hero-title">
                            <img src="/pronite.png" alt="Pronite" style={{ maxWidth: '100%', height: 'auto', display: 'block', margin: '0 auto' }} />
                        </h1>
                    </section>

                    {/* ABOUT */}
                    <section ref={(el) => { layerRefs.current["about"] = el; }} className="z-layer about-layer" data-z="-900">
                        <div><h2 className="about-text">PRESENTING TO YOU</h2></div>
                    </section>

                    {/* ABOUT 2 */}
                    <section ref={(el) => { layerRefs.current["about2"] = el; }} className="z-layer about-layer" data-z="-1900">
                        <div><h2 className="about-text">PRONITE ARTIST</h2></div>
                    </section>

                    {/* --- ARTIST 1 SEQUENCE --- */}

                    {/* 1. TEXT (Fixed) 
                        data-pin="true": This tells useZScroll to HOLD this element in place.
                        data-persist="4000": Keeps it held for 4000px.
                    */}
                    <section
                        ref={(el) => { layerRefs.current["artist1"] = el; }}
                        className="z-layer artist-layer"
                        data-z="-3500"
                        data-pin="true"
                        data-persist="4000"
                    >
                        <div className="artist-content">
                            {/* Masking Wrappers */}
                            <div className="text-mask">
                                <h2 className="artist-name">ARTIST 1</h2>
                            </div>
                            <div className="text-mask">
                                <p className="artist-date">DAY 1 · 7:00 PM</p>
                            </div>
                        </div>
                    </section>

                    {/* 2. RIGHT IMAGE */}
                    <section
                        ref={(el) => { layerRefs.current["artist1_right"] = el; }}
                        className="z-layer"
                        data-z="-5000"
                        data-pin="false"
                    >
                        <div style={{ position: 'absolute', width: '100%', height: '100%', pointerEvents: 'none' }}>
                            <img
                                src="/artist1-right.jpg"
                                alt="Artist 1 Right"
                                className="artist-img right"
                                style={{ width: '220px', height: 'auto' }}
                            />
                        </div>
                    </section>

                    {/* 3. LEFT IMAGE */}
                    <section
                        ref={(el) => { layerRefs.current["artist1_left"] = el; }}
                        className="z-layer"
                        data-z="-6500"
                        data-pin="false"
                    >
                        <div style={{ position: 'absolute', width: '100%', height: '100%', pointerEvents: 'none' }}>
                            <img
                                src="/artist1-left.jpg"
                                alt="Artist 1 Left"
                                className="artist-img left"
                                style={{ width: '220px', height: 'auto' }}
                            />
                        </div>
                    </section>

                    {/* --- OTHER ARTISTS --- */}
                    <section ref={(el) => { layerRefs.current["artist2"] = el; }} className="z-layer artist-layer" data-z="-10000" data-pin="true">
                        <div className="artist-content">
                            <div className="text-mask"><h2 className="artist-name">ARTIST 2</h2></div>
                            <div className="text-mask"><p className="artist-date">DAY 2 · 7:00 PM</p></div>
                        </div>
                    </section>

                    <section ref={(el) => { layerRefs.current["artist3"] = el; }} className="z-layer artist-layer" data-z="-12500" data-pin="true">
                        <div className="artist-content">
                            <div className="text-mask"><h2 className="artist-name">ARTIST 3</h2></div>
                            <div className="text-mask"><p className="artist-date">DAY 3 · 7:00 PM</p></div>
                        </div>
                    </section>

                    <section ref={(el) => { layerRefs.current["artist4"] = el; }} className="z-layer artist-layer" data-z="-15000" data-pin="true">
                        <div className="artist-content">
                            <div className="text-mask"><h2 className="artist-name">ARTIST 4</h2></div>
                            <div className="text-mask"><p className="artist-date">DAY 4 · 7:00 PM</p></div>
                        </div>
                    </section>

                    <section ref={(el) => { layerRefs.current["artist5"] = el; }} className="z-layer artist-layer" data-z="-17500" data-pin="true">
                        <div className="artist-content">
                            <div className="text-mask"><h2 className="artist-name">ARTIST 5</h2></div>
                            <div className="text-mask"><p className="artist-date">DAY 5 · 7:00 PM</p></div>
                        </div>
                    </section>

                </div>
            </div>
        </div>
    );
};

export default PronitePage;