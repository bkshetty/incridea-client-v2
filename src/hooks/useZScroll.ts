import { useEffect, useRef, type RefObject } from 'react';
import Lenis from 'lenis';
import { lerp, clamp } from '@/utils/pronite';

type ScrollCallback = (cameraZ: number) => void;

export const useZScroll = (containerRef: RefObject<HTMLDivElement | null>, onUpdate?: ScrollCallback) => {
    const lenisRef = useRef<Lenis | null>(null);
    const reqIdRef = useRef<number | null>(null);
    const currentZRef = useRef(0);
    const targetZRef = useRef(0);

    // Configuration for the feel of the scroll
    // Configuration for the feel of the scroll
    const FADE_DISTANCE = 4000; // Increased significantly to ensure images are visible earlier

    useEffect(() => {
        if (!containerRef.current) return;

        // Get all Z-layers
        const layers = containerRef.current.querySelectorAll<HTMLElement>('.z-layer');
        const progressBar = document.querySelector<HTMLElement>('.progress-line');
        const rocket = document.querySelector<HTMLElement>('.progress-rocket');

        // Parse depths
        const layerData = Array.from(layers).map(layer => {
            // Optimization hint for browser compositing
            layer.style.willChange = 'transform, opacity, filter';
            return {
                element: layer,
                depth: parseFloat(layer.dataset.z || '0')
            };
        });

        // Calculate total scroll distance
        const furthestZ = Math.min(...layerData.map(l => l.depth));
        const totalDistance = Math.abs(furthestZ) + 2000; // Extra padding for final exit

        // Create invisible scroll track
        const scrollTrack = document.createElement('div');
        scrollTrack.style.cssText = `
            position: absolute;
            top: 0;
            left: 0;
            width: 1px;
            height: ${totalDistance}px;
            pointer-events: none;
            visibility: hidden;
        `;
        document.body.appendChild(scrollTrack);

        // Initialize Lenis with GSAP-like smooth feel
        const lenis = new Lenis({
            duration: 1.5, // Increased from 1.2 for "heavier/smoother" feel
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            smoothWheel: true,
        });
        lenisRef.current = lenis;

        // Scroll handler
        lenis.on('scroll', ({ progress }: { progress: number }) => {
            targetZRef.current = -progress * totalDistance;

            if (progressBar) progressBar.style.transform = `scaleY(${progress})`;
            if (rocket) rocket.style.top = `${progress * 100}%`;
        });

        // Animation loop
        const animate = (time: number) => {
            lenis.raf(time);

            // Smooth interpolation
            currentZRef.current = lerp(currentZRef.current, targetZRef.current, 0.08);
            const currentZ = currentZRef.current;

            // Invoke callback if provided
            if (onUpdate) {
                onUpdate(currentZ);
            }

            // Update each layer
            layerData.forEach(({ element, depth }) => {
                // If not marked revealed by parent logic (and not the hero), hide it to save resources
                const isRevealed = element.dataset.revealed === 'true' || depth === 0;

                if (!isRevealed) {
                    element.style.opacity = '0';
                    element.style.visibility = 'hidden';
                    element.style.pointerEvents = 'none';
                    return;
                }

                const relativeZ = depth - currentZ;

                const PIN_RANGE = 1500; // How long it stays pinned (in px)
                // Allow custom persist distance via data attribute, default to PIN_RANGE if not set
                // This controls when the opacity starts fading out after passing the camera
                const persistDist = element.dataset.persist ? parseFloat(element.dataset.persist) : PIN_RANGE;
                const isPinnable = element.dataset.pin === "true";

                // --- 1. Opacity Calculation (Fade In Only) ---
                let opacity = 1;

                if (relativeZ < -FADE_DISTANCE) {
                    // Too far away
                    opacity = 0;
                } else if (relativeZ < 0) {
                    // Approaching from distance: Fade In
                    // Map -FADE_DISTANCE...0 to 0...1
                    const progress = 1 - (Math.abs(relativeZ) / FADE_DISTANCE);
                    opacity = progress;
                } else {
                    // relativeZ >= 0 (Passed camera / In front)
                    if (isPinnable && relativeZ < PIN_RANGE) {
                        // PINNED PHASE: Keep fully visible
                        opacity = 1;
                    } else {
                        // EXIT PHASE: Fade out quickly after persist distance
                        // Use persistDist instead of hardcoded PIN_RANGE for the start of fade out
                        // Map persistDist...(persistDist+500) to 1...0
                        const exitProgress = (relativeZ - persistDist) / 500;
                        opacity = clamp(1 - exitProgress, 0, 1);
                    }
                }

                // --- 2. Scale & Position Calculation ---
                let transform;

                if (isPinnable && relativeZ >= 0 && relativeZ < persistDist) {
                    // PINNED: Force to 0,0,0 (Camera center)
                    transform = `translate3d(0, 0, 0px)`;
                } else if (isPinnable && relativeZ >= persistDist) {
                    // EXITED: Resume movement relative to z
                    transform = `translate3d(0, 0, ${relativeZ.toFixed(2)}px)`;
                } else {
                    // Normal behavior for non-pinned or approaching
                    const scale = relativeZ > 0
                        ? 1
                        : clamp(1 + (relativeZ / 2000), 0.5, 1);
                    transform = `translate3d(0, 0, ${relativeZ.toFixed(2)}px) scale(${scale.toFixed(3)})`;
                }

                // Apply styles
                element.style.transform = transform;
                element.style.opacity = opacity.toFixed(3);

                element.style.visibility = opacity < 0.05 ? 'hidden' : 'visible';

                // Active state for interactions
                // Extended active range for pinned elements (using persistDist)
                const effectiveDistance = isPinnable && relativeZ >= 0 && relativeZ < persistDist ? 0 : Math.abs(relativeZ);

                if (effectiveDistance < 300) {
                    element.classList.add('active');
                    element.style.pointerEvents = 'auto';
                } else {
                    element.classList.remove('active');
                    element.style.pointerEvents = 'none';
                }
            });

            reqIdRef.current = requestAnimationFrame(animate);
        };

        reqIdRef.current = requestAnimationFrame(animate);

        return () => {
            if (reqIdRef.current) cancelAnimationFrame(reqIdRef.current);
            lenis.destroy();
            scrollTrack.remove();
        };
    }, [containerRef, onUpdate]); // depend on onUpdate

    // No longer returning cameraZ
};