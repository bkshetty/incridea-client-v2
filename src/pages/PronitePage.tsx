import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import '../components/pronite/Pronite.css';
import Starfield from '../components/pronite/Starfield';
import { useZScroll } from '../hooks/useZScroll';

const PronitePage: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const cursorDotRef = useRef<HTMLDivElement>(null);
    const cursorCircleRef = useRef<HTMLDivElement>(null);
    const cursorRef = useRef<HTMLDivElement>(null);

<<<<<<< HEAD
    // Layer configuration
    // Note: We only track the main "Text/Content" layers here for the reveal logic chain.
    // The Image layers are handled as "attachments" to these main IDs in the useEffect.
    const layersConfig = [
        { id: "hero", z: 0 },
        { id: "about", z: -900 },
        { id: "about2", z: -1900 },
        { id: "artist1", z: -3500 },
        { id: "artist2", z: -6000 },
        { id: "artist3", z: -8500 },
        { id: "artist4", z: -11000 },
        { id: "artist5", z: -13500 },
    ];
=======
    // Layer configuration 
    const layersConfig = useRef([
        { id: "hero", z: 0 },
        { id: "about", z: -900 },
        { id: "about2", z: -1900 },
        { id: "artist1", z: -3500 }, // Increased gap for pinning
        { id: "artist2", z: -6000 }, // +2500
        { id: "artist3", z: -8500 }, // +2500
        { id: "artist4", z: -11000 }, // +2500
        { id: "artist5", z: -13500 }, // +2500
    ]).current;
>>>>>>> da4a044b47a33cab049dd99169062d7327a0b38d

    const layerRefs = useRef<Record<string, HTMLElement | null>>({});
    const revealedLayers = useRef<Set<string>>(new Set());

<<<<<<< HEAD
    // Hook handles the visual loop
    const cameraZ = useZScroll(containerRef);

=======
    // Updated to match the useZScroll FADE_DISTANCE (800)
>>>>>>> da4a044b47a33cab049dd99169062d7327a0b38d
    const fadeOutDistance = 800;

    // Cursor Effect
    useEffect(() => {
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

    // Cache for DOM elements to avoid querySelectorAll in the loop
    const layerCache = useRef<Record<string, { el: HTMLElement, texts: NodeListOf<Element> }>>({});

    // Initialize cache on mount
    useEffect(() => {
        layersConfig.forEach(({ id }) => {
            const el = layerRefs.current[id];
<<<<<<< HEAD
            // Look for a corresponding image layer (e.g., "artist1_imgs")
            const imgEl = layerRefs.current[`${id}_imgs`];
            
            if (!el) return;
=======
            if (el) {
                layerCache.current[id] = {
                    el,
                    texts: el.querySelectorAll('.text-mask > *')
                };
            }
        });
    }, [layersConfig]);
>>>>>>> da4a044b47a33cab049dd99169062d7327a0b38d

    const handleScrollUpdate = React.useCallback((cameraZ: number) => {
        layersConfig.forEach(({ id, z }, index) => {
            const cache = layerCache.current[id];
            if (!cache) return;

            const { el, texts } = cache;

            // Updated visibility logic: Keep layers "active" longer to prevent rapid mounting/unmounting
            let shouldBeRevealed = false;

            // Special handling for the first few layers (Hero, About) to keep them visible longer
            const isEarlyLayer = index <= 2;
            const entryBuffer = isEarlyLayer ? 2000 : 0; // Extra buffer for early layers

            if (index === 0) {
                // Hero layer is always revealed if camera is before it (or slightly past)
                shouldBeRevealed = cameraZ <= (z + 500);
            } else {
                const previousZ = layersConfig[index - 1]?.z ?? 0;
                // Reveal if we are within the layer's zone OR the previous layer's zone (with buffer)
                shouldBeRevealed = cameraZ <= (z + 500) && cameraZ <= (previousZ - fadeOutDistance + entryBuffer);
            }

<<<<<<< HEAD
            // Exit Logic Check for Pinned Text
            const isExiting = cameraZ < (z - 1200);

            if (shouldBeRevealed && !revealedLayers.current.has(id)) {
                revealedLayers.current.add(id);
                el.dataset.revealed = "true";
                
                // Sync the image layer reveal state
                if (imgEl) imgEl.dataset.revealed = "true";

                // GSAP Enter Animation (Slide Up for Text)
                const texts = el.querySelectorAll('.text-mask > *');
                if (texts.length) {
                    gsap.fromTo(texts,
                        { y: "100%" },
                        { y: "0%", duration: 1, ease: "power4.out", stagger: 0.1, overwrite: true }
                    );
                }

            } else if (revealedLayers.current.has(id)) {
                // If it's already revealed, check if we need to trigger EXIT animation for TEXT
                if (isExiting && el.dataset.exited !== "true") {
                    el.dataset.exited = "true";
                    const texts = el.querySelectorAll('.text-mask > *');
=======
            // Exit Logic Check
            // Disable exit (slide down) animation for the first 3 layers (Hero, About, About2)
            // ensuring they are always in position (y=0) when we scroll back up to them.
            const isExiting = cameraZ < (z - 1200) && index > 2;

            if (shouldBeRevealed) {
                if (!revealedLayers.current.has(id)) {
                    revealedLayers.current.add(id);
                    el.dataset.revealed = "true";
                    el.dataset.exited = "false";

                    // GSAP Enter Animation (Slide Up)
>>>>>>> da4a044b47a33cab049dd99169062d7327a0b38d
                    if (texts.length) {
                        gsap.fromTo(texts,
                            { y: "100%" },
                            { y: "0%", duration: 1, ease: "power4.out", stagger: 0.1, overwrite: true }
                        );
                    }
                } else if (el.dataset.exited === "true") {
                    // Reset if scrolling back up into an exited layer
                    el.dataset.exited = "false";
                    if (texts.length) {
                        gsap.to(texts, { y: "0%", duration: 0.5, overwrite: true });
                    }
                }
<<<<<<< HEAD

                if (!shouldBeRevealed) {
                    revealedLayers.current.delete(id);
                    el.dataset.revealed = "false";
                    el.dataset.exited = "false"; 

                    // Sync hide images
                    if (imgEl) imgEl.dataset.revealed = "false";
                }
            }
        });
    }, [cameraZ]); 
=======
            } else {
                if (revealedLayers.current.has(id)) {
                    if (isExiting) {
                        // Scrolled strictly PAST it (down) -> Exit Animation
                        if (el.dataset.exited !== "true") {
                            el.dataset.exited = "true";
                            if (texts.length) {
                                gsap.to(texts,
                                    { y: "100%", duration: 2.5, ease: "power3.out", stagger: 0.1, overwrite: true }
                                );
                            }
                        }
                    } else {
                        // Scrolled BACK UP before it -> Hide Immediately
                        revealedLayers.current.delete(id);
                        el.dataset.revealed = "false";
                        el.dataset.exited = "false";
                    }
                }
            }
        });
    }, [layersConfig, fadeOutDistance]);

    // Hook handles the visual loop
    useZScroll(containerRef, handleScrollUpdate);
>>>>>>> da4a044b47a33cab049dd99169062d7327a0b38d

    return (
        <div className="pronite-page">
            {/* Custom Cursor */}
            <div ref={cursorRef} className="cursor">
                <div ref={cursorDotRef} className="cursor-dot"></div>
                <div ref={cursorCircleRef} className="cursor-circle"></div>
            </div>

            {/* Navigation */}
            <nav className="nav">
                <div className="nav-left">
                    <button className="menu-btn" aria-label="Menu">
                        <span></span>
                        <span></span>
                        <span></span>
                    </button>
                </div>
                <div className="nav-right"></div>
            </nav>

            {/* Scroll Progress */}
            <div className="scroll-progress">
                <div className="progress-line"></div>
                <div className="progress-rocket">🚀</div>
            </div>

            {/* Main 3D Container */}
            <div id="z-space-container" ref={containerRef}>
                <Starfield />

                <div className="z-content">
<<<<<<< HEAD
                    
                    {/* LAYER 0: HERO */}
                    <section ref={(el) => { layerRefs.current["hero"] = el; }} className="z-layer hero-layer" data-z="0">
                        <div className="hero-subtitle mb-4">
                            <img src="/incridea.png" alt="Incridea" style={{ height: '70px', width: 'auto', margin: '0 auto' }} />
=======
                    {/* ... (Layer content remains exactly the same as provided) ... */}
                    {/* Just ensuring refs are attached correctly, which they were in your snippet */}

                    {/* LAYER 0: HERO - Persist long enough to stay visible throughout scroll */}
                    <section ref={(el) => { layerRefs.current["hero"] = el; }} className="z-layer hero-layer" data-z="0" data-persist="15000">
                        <div className="text-mask">
                            <div className="hero-subtitle mb-4">
                                <img src="/incridea.png" alt="Incridea" style={{ height: '70px', width: 'auto', margin: '0 auto' }} />
                            </div>
                        </div>
                        <div className="text-mask">
                            <h1 className="hero-title">
                                <img src="/pronite.png" alt="Pronite" style={{ maxWidth: '100%', height: 'auto', display: 'block', margin: '0 auto' }} />
                            </h1>
>>>>>>> da4a044b47a33cab049dd99169062d7327a0b38d
                        </div>
                    </section>

                    {/* LAYER 1: ABOUT - Persist long enough to stay visible throughout scroll */}
                    <section ref={(el) => { layerRefs.current["about"] = el; }} className="z-layer about-layer" data-z="-900" data-persist="15000">
                        <div className="text-mask">
                            <h2 className="about-text">PRESENTING TO YOU</h2>
                        </div>
                    </section>
<<<<<<< HEAD
                    
                    {/* LAYER 1.5: ABOUT 2 */}
                    <section ref={(el) => { layerRefs.current["about2"] = el; }} className="z-layer about-layer" data-z="-1900">
                        <div>
=======
                    {/* LAYER 1.5: ABOUT 2 - Persist long enough to stay visible throughout scroll */}
                    <section ref={(el) => { layerRefs.current["about2"] = el; }} className="z-layer about-layer" data-z="-1900" data-persist="15000">
                        <div className="text-mask">
>>>>>>> da4a044b47a33cab049dd99169062d7327a0b38d
                            <h2 className="about-text">PRONITE ARTIST</h2>
                        </div>
                    </section>

                    {/* --- ARTIST 1 --- */}
                    
                    {/* ID: artist1_imgs (The flying images) */}
                    {/* Placed at same Z as text but NOT pinned, so they fly past the camera */}
                    <section 
                        ref={(el) => { layerRefs.current["artist1_imgs"] = el; }} 
                        className="z-layer" 
                        data-z="-3500"
                    >
                        <div className="artist-images-container" style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}>
                            {/* Inline styles added to reduce size (220px) as requested */}
                            <img 
                                src="/artist1-left.jpg" 
                                alt="Artist 1 Left" 
                                className="artist-img left" 
                                style={{ width: '220px', height: 'auto' }} 
                            />
                            <img 
                                src="/artist1-right.jpg" 
                                alt="Artist 1 Right" 
                                className="artist-img right" 
                                style={{ width: '220px', height: 'auto' }} 
                            />
                        </div>
                    </section>

                    {/* ID: artist1 (The Text - Pinned) */}
                    <section ref={(el) => { layerRefs.current["artist1"] = el; }} className="z-layer artist-layer" data-z="-3500" data-pin="true">
                        <div className="artist-content">
                            <div className="text-mask">
                                <h2 className="artist-name">ARTIST 1</h2>
                            </div>
                            <div className="text-mask">
                                <p className="artist-date">DAY 1 · 7:00 PM</p>
                            </div>
                        </div>
                    </section>


                    {/* --- ARTIST 2 --- */}
                    
                    {/* Placeholder for Artist 2 Images */}
                    <section ref={(el) => { layerRefs.current["artist2_imgs"] = el; }} className="z-layer" data-z="-6000">
                         {/* Add images here later following the structure above */}
                    </section>

                    {/* ID: artist2 Text */}
                    <section ref={(el) => { layerRefs.current["artist2"] = el; }} className="z-layer artist-layer" data-z="-6000" data-pin="true">
                        <div className="artist-content">
                            <div className="text-mask">
                                <h2 className="artist-name">ARTIST 2</h2>
                            </div>
                            <div className="text-mask">
                                <p className="artist-date">DAY 2 · 7:00 PM</p>
                            </div>
                        </div>
                    </section>

                    {/* --- ARTIST 3 --- */}
                    <section ref={(el) => { layerRefs.current["artist3"] = el; }} className="z-layer artist-layer" data-z="-8500" data-pin="true">
                        <div className="artist-content">
                            <div className="text-mask">
                                <h2 className="artist-name">ARTIST 3</h2>
                            </div>
                            <div className="text-mask">
                                <p className="artist-date">DAY 3 · 7:00 PM</p>
                            </div>
                        </div>
                    </section>

                    {/* --- ARTIST 4 --- */}
                    <section ref={(el) => { layerRefs.current["artist4"] = el; }} className="z-layer artist-layer" data-z="-11000" data-pin="true">
                        <div className="artist-content">
                            <div className="text-mask">
                                <h2 className="artist-name">ARTIST 4</h2>
                            </div>
                            <div className="text-mask">
                                <p className="artist-date">DAY 4 · 7:00 PM</p>
                            </div>
                        </div>
                    </section>

                    {/* --- ARTIST 5 --- */}
                    <section ref={(el) => { layerRefs.current["artist5"] = el; }} className="z-layer artist-layer" data-z="-13500" data-pin="true">
                        <div className="artist-content">
                            <div className="text-mask">
                                <h2 className="artist-name">ARTIST 5</h2>
                            </div>
                            <div className="text-mask">
                                <p className="artist-date">DAY 5 · 7:00 PM</p>
                            </div>
                        </div>
                    </section>

                </div>
            </div>
        </div>
    );
};

export default PronitePage;