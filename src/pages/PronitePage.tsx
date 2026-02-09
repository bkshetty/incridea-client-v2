import React, { useEffect, useRef, useCallback } from 'react';
import gsap from 'gsap';
import '../components/pronite/Pronite.css';
import Starfield from '../components/pronite/Starfield';
import { useZScroll } from '../hooks/useZScroll';

const PronitePage: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const cursorRef = useRef<HTMLDivElement>(null);
    const cursorDotRef = useRef<HTMLDivElement>(null);
    const cursorCircleRef = useRef<HTMLDivElement>(null);
    const tiltRef = useRef<HTMLDivElement>(null);

    const layerRefs = useRef<Record<string, HTMLElement | null>>({});
    const mousePos = useRef({ x: 0, y: 0 });
    const rafId = useRef<number | undefined>(undefined);
    const isHovering = useRef(false);

    // --- 3D TILT EFFECT (Only affects tilt layer, NOT Z-scroll) ---
    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!tiltRef.current) return;

        const { clientX, clientY } = e;
        const { innerWidth, innerHeight } = window;

        // Calculate mouse position from center (-1 to 1)
        const xPos = (clientX / innerWidth - 0.5) * 2;
        const yPos = (clientY / innerHeight - 0.5) * 2;

        mousePos.current = { x: xPos, y: yPos };
        isHovering.current = true;
    }, []);

    const handleMouseLeave = useCallback(() => {
        isHovering.current = false;
    }, []);

    // Animation loop for smooth tilt
    useEffect(() => {
        let currentX = 0;
        let currentY = 0;
        
        const animate = () => {
            if (tiltRef.current) {
                if (isHovering.current) {
                    // Target rotation (max 8 degrees - subtle)
                    const targetX = -mousePos.current.y * 8;
                    const targetY = mousePos.current.x * 8;

                    // Smooth interpolation
                    currentX += (targetX - currentX) * 0.08;
                    currentY += (targetY - currentY) * 0.08;
                } else {
                    // Return to center
                    currentX += (0 - currentX) * 0.05;
                    currentY += (0 - currentY) * 0.05;
                }

                // Apply to tilt layer only
                tiltRef.current.style.transform = `rotateX(${currentX}deg) rotateY(${currentY}deg)`;
            }
            
            rafId.current = requestAnimationFrame(animate);
        };

        rafId.current = requestAnimationFrame(animate);

        return () => {
            if (rafId.current) cancelAnimationFrame(rafId.current);
        };
    }, []);

    // --- Event Handlers (Passed to useZScroll) ---
    const onLayerEnter = (el: HTMLElement) => {
        const texts = el.querySelectorAll('.text-mask > *');
        if (texts.length) {
            gsap.fromTo(texts,
                { y: "110%" },
                {
                    y: "0%",
                    duration: 1.5,
                    ease: "power4.out",
                    stagger: 0.15,
                    overwrite: true
                }
            );
        }
    };

    const onLayerExit = (el: HTMLElement) => {
        const texts = el.querySelectorAll('.text-mask > *');
        if (texts.length) {
            gsap.to(texts, {
                y: "-110%",
                duration: 1.2,
                ease: "power3.in",
                stagger: 0.1,
                overwrite: true
            });
        }
    };

    useZScroll(containerRef, {
        onLayerEnter,
        onLayerExit
    });

    // --- Initial Setup & Cursor ---
    useEffect(() => {
        // Immediately force all text-masks to be hidden on load
        const allMaskedText = document.querySelectorAll('.text-mask > *');
        gsap.set(allMaskedText, { y: "100%" });

        // 3D Tilt Event Listeners
        window.addEventListener('mousemove', handleMouseMove, { passive: true });
        document.body.addEventListener('mouseleave', handleMouseLeave);

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
            window.removeEventListener('mousemove', handleMouseMove);
            document.body.removeEventListener('mouseleave', handleMouseLeave);
            window.removeEventListener('mousemove', moveCursor);
            interactives.forEach(el => {
                el.removeEventListener('mouseenter', handleHover);
                el.removeEventListener('mouseleave', handleLeave);
            });
        };
    }, [handleMouseMove, handleMouseLeave]);

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

            <div className="scroll-progress-container">
                <div className="scroll-track">
                    <div className="progress-fill"></div>
                    <div className="logo-bottom-wrapper">
                        <img src="/ryoku_emoji.png" className="progress-logo-bottom" alt="Ryoku" />
                    </div>
                </div>
            </div>

            <div id="z-space-container" ref={containerRef}>
                <Starfield />

                {/* TILT LAYER: Wraps all content, separate from Z-scroll */}
                <div ref={tiltRef} className="tilt-layer">
                    <div className="z-content">

                        {/* HERO */}
                        <section ref={(el) => { layerRefs.current["hero"] = el; }} className="z-layer hero-layer" data-z="0" data-persist="15000">
                            <div className="hero-subtitle mb-4">
                                <img src="/incridea.png" alt="Incridea" style={{ height: '70px', width: 'auto', margin: '0 auto' }} />
                            </div>
                            <h1 className="hero-title">
                                <img src="/pronite.svg" alt="Pronite" style={{ maxWidth: '100%', height: 'auto', display: 'block', margin: '0 auto' }} />
                            </h1>
                        </section>

                        {/* ABOUT */}
                        <section ref={(el) => { layerRefs.current["about"] = el; }} className="z-layer about-layer" data-z="-900" data-persist="15000" data-fade-exp="25">
                            <div><h2 className="about-text">PRESENTING TO YOU</h2></div>
                        </section>

                        {/* ABOUT 2 */}
                        <section ref={(el) => { layerRefs.current["about2"] = el; }} className="z-layer about-layer" data-z="-1900" data-persist="15000" data-fade-exp="25">
                            <div><h2 className="about-text">PRONITE ARTIST</h2></div>
                        </section>

                        {/* ARTIST 1 SEQUENCE */}
                        <section
                            ref={(el) => { layerRefs.current["artist1"] = el; }}
                            className="z-layer artist-layer"
                            data-z="-3500"
                            data-pin="true"
                            data-persist="4000"
                            data-fade-exp="25"
                        >
                            <div className="artist-content">
                                <div className="text-mask">
                                    <h2 className="artist-name">ARTIST 1</h2>
                                </div>
                                <div className="text-mask">
                                    <p className="artist-date">DAY 1 · 7:00 PM</p>
                                </div>
                            </div>
                        </section>

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

                        {/* OTHER ARTISTS */}
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
        </div>
    );
};

export default PronitePage;