import { useEffect, useRef, type RefObject } from 'react';
import Lenis from 'lenis';
import { lerp, clamp } from '@/utils/pronite';

export const useZScroll = (containerRef: RefObject<HTMLDivElement | null>) => {
    const lenisRef = useRef<Lenis | null>(null);
    const reqIdRef = useRef<number | null>(null);
    const currentZRef = useRef(0);
    const targetZRef = useRef(0);

    useEffect(() => {
        if (!containerRef.current) return;

        // Get all Z-layers
        const layers = containerRef.current.querySelectorAll<HTMLElement>('.z-layer');
        const progressBar = document.querySelector<HTMLElement>('.progress-line');
        const rocket = document.querySelector<HTMLElement>('.progress-rocket');

        // Parse depths from data-z attributes
        const layerData = Array.from(layers).map(layer => ({
            element: layer,
            depth: parseFloat(layer.dataset.z || '0')
        }));

        // Find furthest layer to calculate total scroll distance
        const furthestZ = Math.min(...layerData.map(l => l.depth));
        const totalDistance = Math.abs(furthestZ) + 1000; // Extra padding

        // Create invisible scroll track - THIS WAS MISSING!
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

        // Initialize Lenis
        const lenis = new Lenis({
            duration: 1.2,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
            orientation: 'vertical',
            smoothWheel: true,
        });
        lenisRef.current = lenis;

        // Scroll handler
        lenis.on('scroll', ({ progress }: { progress: number; scroll: number; limit: number }) => {
            // Map scroll progress to Z depth
            targetZRef.current = -progress * totalDistance;

            // Update progress bar
            if (progressBar) progressBar.style.transform = `scaleY(${progress})`;
            if (rocket) rocket.style.top = `${progress * 100}%`;
        });

        // Animation loop
        const animate = (time: number) => {
            lenis.raf(time);

            // Smooth interpolation
            currentZRef.current = lerp(currentZRef.current, targetZRef.current, 0.08);

            const currentZ = currentZRef.current;

            // Update each layer
            layerData.forEach(({ element, depth }) => {
                const relativeZ = depth - currentZ;
                const distance = Math.abs(relativeZ);
                
                // Opacity: fade out when too close or too far
                const opacity = clamp(1 - (distance / 800), 0, 1);
                
                // Scale: smaller when further away
                const scale = relativeZ > 0 
                    ? 1 
                    : clamp(1 + (relativeZ / 1500), 0.4, 1);

                // Apply 3D transform
                element.style.transform = `translate3d(0, 0, ${relativeZ}px) scale(${scale})`;
                element.style.opacity = opacity.toString();
                element.style.visibility = opacity < 0.01 ? 'hidden' : 'visible';

                // Active state for entrance animations
                if (distance < 400 && relativeZ > -200) {
                    element.classList.add('active');
                } else {
                    element.classList.remove('active');
                }
            });

            reqIdRef.current = requestAnimationFrame(animate);
        };

        reqIdRef.current = requestAnimationFrame(animate);

        // Cleanup
        return () => {
            if (reqIdRef.current) cancelAnimationFrame(reqIdRef.current);
            lenis.destroy();
            scrollTrack.remove();
        };
    }, [containerRef]);

    return lenisRef;
};