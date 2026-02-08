import React, { useEffect, useRef, useState } from 'react';
import '../components/pronite/Pronite.css';
import Starfield from '../components/pronite/Starfield';
import { useZScroll } from '../hooks/useZScroll';
import gsap from 'gsap';

// Glitch Text Component
const GlitchText: React.FC<{ text: string }> = ({ text }) => {
    const [isGlitching, setIsGlitching] = useState(false);
    
    return (
        <span 
            data-glitch={text} 
            className={isGlitching ? 'glitching' : ''}
            onMouseEnter={() => setIsGlitching(true)}
            onMouseLeave={() => setIsGlitching(false)}
        >
            {text}
        </span>
    );
};

// Phone Mockup
const PhoneMockup: React.FC<{ variant: string }> = ({ variant }) => {
    const getContent = () => {
        const variants: Record<string, React.ReactNode> = {
            modus: (
                <div style={{ 
                    height: '100%', 
                    background: 'linear-gradient(135deg, #1a1a2e, #16213e)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    padding: '1rem'
                }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>MODUS</div>
                    <div style={{ height: '60%', background: 'rgba(255,255,255,0.1)', borderRadius: '12px' }} />
                </div>
            ),
            trinity: (
                <div style={{ 
                    height: '100%', 
                    background: 'linear-gradient(135deg, #667eea, #764ba2)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '1rem'
                }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>Trinity</div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                        {[1,2,3].map(i => (
                            <div key={i} style={{ 
                                width: '30px', 
                                height: '30px', 
                                borderRadius: '50%', 
                                background: 'rgba(255,255,255,0.3)',
                                border: '2px solid white'
                            }} />
                        ))}
                    </div>
                </div>
            ),
            zenith: (
                <div style={{ 
                    height: '100%', 
                    background: '#f5f5f5',
                    color: '#000',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    padding: '1rem'
                }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#000' }}>ZENITH</div>
                    <div style={{ color: '#666', fontSize: '0.9rem' }}>BMW Z4</div>
                </div>
            ),
            sage: (
                <div style={{ 
                    height: '100%', 
                    background: 'linear-gradient(135deg, #11998e, #38ef7d)',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>SAGE</div>
                    <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>PAVE THE WAY</div>
                </div>
            ),
            recur: (
                <div style={{ 
                    height: '100%', 
                    background: '#0a0a0a',
                    border: '1px solid #333',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    padding: '1rem'
                }}>
                    <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#00ff88' }}>RECUR</div>
                    <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: '80px' }}>
                        {[40,60,30,80,50,70,90,45,65,55].map((h,i) => (
                            <div key={i} style={{
                                width: '6px',
                                height: `${h}%`,
                                background: i > 5 ? '#ff4444' : '#00ff88',
                                borderRadius: '1px'
                            }} />
                        ))}
                    </div>
                </div>
            )
        };
        return variants[variant] || variants.modus;
    };

    return (
        <div className="phone-mockup">
            <div className="phone-screen">
                {getContent()}
            </div>
        </div>
    );
};

const PronitePage: React.FC = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const cursorDotRef = useRef<HTMLDivElement>(null);
    const cursorCircleRef = useRef<HTMLDivElement>(null);
    const cursorRef = useRef<HTMLDivElement>(null);

    // Layer configuration 
    const layersConfig = [
  { id: "hero", z: 0 },
  { id: "about", z: -800 },
  { id: "modus", z: -1600 },
  { id: "trinity", z: -2400 },
  { id: "zenith", z: -3200 },
  { id: "sage", z: -4000 },
  { id: "recur", z: -4800 },
];
    // Refs to layer elements for revealing 
    const layerRefs = useRef<Record<string, HTMLElement | null>>({});
    const revealedLayers = useRef<Set<string>>(new Set());
    const cameraZ = useZScroll(containerRef);
    const fadeOutDistance = 800;

    const canRevealLayer = (index: number, z: number) => {
        if (index === 0) return cameraZ <= z;
        const previousZ = layersConfig[index - 1]?.z ?? 0;
        return cameraZ <= z && cameraZ <= previousZ - fadeOutDistance;
    };

    // Simple cursor - NO GSAP
    useEffect(() => {
        const moveCursor = (e: MouseEvent) => {
            if (cursorDotRef.current) {
                cursorDotRef.current.style.left = e.clientX + 'px';
                cursorDotRef.current.style.top = e.clientY + 'px';
            }
            if (cursorCircleRef.current) {
                // Simple lag effect without GSAP
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

    // Layer reveal only on scroll
    useEffect(() => {
        layersConfig.forEach(({ id, z }, index) => {
            const el = layerRefs.current[id];
            if (!el) return;

            const shouldBeRevealed = canRevealLayer(index, z);

            if (shouldBeRevealed && !revealedLayers.current.has(id)) {
                // Reveal the layer
                revealedLayers.current.add(id);
                el.dataset.revealed = "true";

                gsap.to(el, {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    ease: "power3.out",
                    onComplete: () => {
                        el.style.pointerEvents = "auto";
                    },
                });
            } else if (!shouldBeRevealed && revealedLayers.current.has(id)) {
                // Hide the layer when scrolling back
                revealedLayers.current.delete(id);
                el.dataset.revealed = "false";
                el.style.pointerEvents = "none";
            }
        });
    }, [cameraZ]);


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
                <div className="nav-right">
                    <a href="#contact">CONTACT ↗</a>
                </div>
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
                    
                    {/* LAYER 0: HERO */}
                    <section ref={(el) => { layerRefs.current["hero"] = el; }} className="z-layer hero-layer" data-z="0">
                        <div>
                            <p className="hero-subtitle">{'{ Branding, Web & Motion Studio ® }'}</p>
                            <h1 className="hero-title">
                                <GlitchText text="Fantik" />
                            </h1>
                            <button className="cta-btn">View Our Work ↗</button>
                        </div>
                    </section>

                    {/* LAYER 1: ABOUT */}
                    <section  ref={(el) => { layerRefs.current["about"] = el; }} className="z-layer about-layer" data-z="-800">
                        <div>
                            <p className="about-label">{'{ About Us }'}</p>
                            <h2 className="about-text">
                                We are an award-winning full-cycle digital studio crafting immersive web & motion that makes brands grow and stand out
                            </h2>
                        </div>
                    </section>

                    {/* LAYER 2: MODUS */}
                    <section ref={(el) => { layerRefs.current["modus"] = el; }} className="z-layer project-layer" data-z="-1600">
                        <div className="project-card">
                            <div className="project-visual">
                                <PhoneMockup variant="modus" />
                            </div>
                            <div className="project-info">
                                <h2 className="project-title"><GlitchText text="MODUS" /></h2>
                                <p className="project-tags">Website Design · WebGL · Development</p>
                                <button className="view-project-btn">View Project</button>
                            </div>
                        </div>
                    </section>

                    {/* LAYER 3: TRINITY */}
                    <section ref={(el) => { layerRefs.current["trinity"] = el; }} className="z-layer project-layer" data-z="-2400">
                        <div className="project-card reverse">
                            <div className="project-visual">
                                <PhoneMockup variant="trinity" />
                            </div>
                            <div className="project-info">
                                <h2 className="project-title"><GlitchText text="TRINITY" /></h2>
                                <p className="project-tags">App Design · UI/UX · Development</p>
                                <button className="view-project-btn">View Project</button>
                            </div>
                        </div>
                    </section>

                    {/* LAYER 4: ZENITH */}
                    <section ref={(el) => { layerRefs.current["zenith"] = el; }} className="z-layer project-layer" data-z="-3200">
                        <div className="project-card">
                            <div className="project-visual">
                                <PhoneMockup variant="zenith" />
                            </div>
                            <div className="project-info">
                                <h2 className="project-title"><GlitchText text="ZENITH" /></h2>
                                <p className="project-tags">Art Direction · Website Design · Branding</p>
                                <button className="view-project-btn">View Project</button>
                            </div>
                        </div>
                    </section>

                    {/* LAYER 5: SAGE */}
                    <section ref={(el) => { layerRefs.current["sage"] = el; }} className="z-layer project-layer" data-z="-4000">
                        <div className="project-card reverse">
                            <div className="project-visual">
                                <PhoneMockup variant="sage" />
                            </div>
                            <div className="project-info">
                                <h2 className="project-title"><GlitchText text="SAGE" /></h2>
                                <p className="project-tags">Website Design · WebGL · Development</p>
                                <button className="view-project-btn">View Project</button>
                            </div>
                        </div>
                    </section>

                    {/* LAYER 6: RECUR */}
                    <section ref={(el) => { layerRefs.current["recur"] = el; }} className="z-layer project-layer" data-z="-4800">
                        <div className="project-card">
                            <div className="project-visual">
                                <PhoneMockup variant="recur" />
                            </div>
                            <div className="project-info">
                                <h2 className="project-title"><GlitchText text="RECUR" /></h2>
                                <p className="project-tags">Script · 3D · Motion Design</p>
                                <button className="view-project-btn">View Project</button>
                            </div>
                        </div>
                    </section>

                    {/* LAYER 7: CONTACT */}
                    <section ref={(el) => { layerRefs.current["contact"] = el; }} className="z-layer contact-layer" id="contact" data-z="-5600">
                        <div>
                            <p className="contact-label">{'{ Say Hi }'}</p>
                            <h2 className="contact-title">
                                <span className="block">WE CAN</span>
                                <span className="block highlight"><GlitchText text="TALK" /></span>
                                <span className="block">NOW</span>
                            </h2>
                            <a href="mailto:hello@fantik.studio" className="cta-btn mt-8">
                                HELLO@FANTIK.STUDIO
                            </a>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default PronitePage;