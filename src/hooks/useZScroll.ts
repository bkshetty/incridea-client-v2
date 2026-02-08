import { useEffect, useRef, type RefObject } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { lerp, clamp } from '@/utils/pronite';

type ScrollCallback = (cameraZ: number) => void;

export const useZScroll = (containerRef: RefObject<HTMLDivElement | null>, onUpdate?: ScrollCallback) => {
    const lenisRef = useRef<Lenis | null>(null);
    const currentZRef = useRef(0);
    const targetZRef = useRef(0);

    // Configuration for the feel of the scroll
    // Configuration for the feel of the scroll
    const FADE_DISTANCE = 4000; // Increased significantly to ensure images are visible earlier

    useEffect(() => {
        if (!containerRef.current) return;

        // Import GSAP dynamically if not already available or just use global if in environment
        // Assuming gsap is imported at top level of file or project
        // context: import gsap from 'gsap';

        const layers = containerRef.current.querySelectorAll<HTMLElement>('.z-layer');
        const progressBar = document.querySelector<HTMLElement>('.progress-line');
        const rocket = document.querySelector<HTMLElement>('.progress-rocket');

        // Parse depths
        const layerData = Array.from(layers).map(layer => {
            // GSAP handles will-change optimally usually, but keeping hint doesn't hurt
            layer.style.willChange = 'transform, opacity, filter';
            return {
                element: layer,
                depth: parseFloat(layer.dataset.z || '0'),
                // Cache these to avoid reading DOM in loop
                persistDist: layer.dataset.persist ? parseFloat(layer.dataset.persist) : 1500,
                isPinnable: layer.dataset.pin === "true"
            };
        });

        const furthestZ = Math.min(...layerData.map(l => l.depth));
        const totalDistance = Math.abs(furthestZ) + 2000;

        // Create invisible scroll track
        const scrollTrack = document.createElement('div');
        Object.assign(scrollTrack.style, {
            position: 'absolute',
            top: '0',
            left: '0',
            width: '1px',
            height: `${totalDistance}px`,
            pointerEvents: 'none',
            visibility: 'hidden'
        });
        document.body.appendChild(scrollTrack);

        const lenis = new Lenis({
            duration: 1.5,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            smoothWheel: true,
        });
        lenisRef.current = lenis;

        lenis.on('scroll', ({ progress }: { progress: number }) => {
            targetZRef.current = -progress * totalDistance;

            if (progressBar) gsap.set(progressBar, { scaleY: progress, overwrite: 'auto' });
            if (rocket) gsap.set(rocket, { top: `${progress * 100}%`, overwrite: 'auto' });
        });

        // GSAP Ticker Function
        const update = (time: number) => {
            // Update Lenis
            lenis.raf(time * 1000); // Lenis expects ms

            // Smooth interpolation
            currentZRef.current = lerp(currentZRef.current, targetZRef.current, 0.08);
            const currentZ = currentZRef.current;

            if (onUpdate) onUpdate(currentZ);

            layerData.forEach(({ element, depth, persistDist, isPinnable }) => {
                const isRevealed = element.dataset.revealed === 'true' || depth === 0;

                if (!isRevealed) {
                    // Use GSAP set for consistency and potential optimization
                    gsap.set(element, { autoAlpha: 0, overwrite: 'auto' });
                    element.style.pointerEvents = 'none';
                    return;
                }

                const relativeZ = depth - currentZ;
                let opacity = 1;

                if (relativeZ < -FADE_DISTANCE) {
                    opacity = 0;
                } else if (relativeZ < 0) {
                    const progress = 1 - (Math.abs(relativeZ) / FADE_DISTANCE);
                    opacity = progress;
                } else {
                    if (isPinnable && relativeZ < persistDist) {
                        opacity = 1;
                    } else {
                        const exitProgress = (relativeZ - persistDist) / 500;
                        opacity = clamp(1 - exitProgress, 0, 1);
                    }
                }

                // Transform Logic
                let zPos = relativeZ;
                let scale = 1;

                if (isPinnable && relativeZ >= 0 && relativeZ < persistDist) {
                    zPos = 0;
                } else if (!isPinnable && relativeZ <= 0) {
                    scale = clamp(1 + (relativeZ / 2000), 0.5, 1);
                }

                // Apply via GSAP
                // autoAlpha handles opacity + visibility
                // z and scale are handled by GSAP's CSSPlugin
                gsap.set(element, {
                    z: zPos,
                    scale: scale,
                    autoAlpha: opacity,
                    overwrite: 'auto' // Prevent conflict with other tweens
                });

                // Active state check
                const effectiveDistance = (isPinnable && relativeZ >= 0 && relativeZ < persistDist) ? 0 : Math.abs(relativeZ);

                // Class toggling is still manual as it's efficient enough
                if (effectiveDistance < 300) {
                    element.classList.add('active');
                    element.style.pointerEvents = 'auto';
                } else {
                    element.classList.remove('active');
                    element.style.pointerEvents = 'none';
                }
            });
        };

        // Add to GSAP ticker
        gsap.ticker.add(update);

        return () => {
            gsap.ticker.remove(update);
            lenis.destroy();
            scrollTrack.remove();
        };
    }, [containerRef, onUpdate]);
};