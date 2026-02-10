import { useEffect, useRef, type RefObject } from 'react';
import Lenis from 'lenis';
import gsap from 'gsap';
import { lerp, clamp } from '@/utils/pronite';

// Event-driven Z-Scroll Hook
type ScrollEventCallback = (element: HTMLElement) => void;


interface UseZScrollOptions {
    onUpdate?: (cameraZ: number) => void;
    onLayerEnter?: ScrollEventCallback;
    onLayerExit?: ScrollEventCallback;

}

export const useZScroll = (containerRef: RefObject<HTMLDivElement | null>, options?: UseZScrollOptions) => {
    const { onUpdate, onLayerEnter, onLayerExit } = options || {};
    const lenisRef = useRef<Lenis | null>(null);
    const currentZRef = useRef(0);
    const targetZRef = useRef(0);
    const enteredLayers = useRef<Set<HTMLElement>>(new Set());

    const FADE_DISTANCE = 4000;

    useEffect(() => {
        if (!containerRef.current) return;

        const layers = containerRef.current.querySelectorAll<HTMLElement>('.z-layer');
        const progressBar = document.querySelector<HTMLElement>('.progress-line');
        const rocket = document.querySelector<HTMLElement>('.progress-rocket');

        // Parse depths & Init
        const layerData = Array.from(layers).map(layer => {
            layer.style.willChange = 'transform, opacity, filter';

            // Force initial centered state to override any CSS transforms (like translateY(40px))
            gsap.set(layer, { x: 0, y: 0, z: 0, overwrite: 'auto' });

            return {
                element: layer,
                depth: parseFloat(layer.dataset.z || '0'),
                persistDist: layer.dataset.persist ? parseFloat(layer.dataset.persist) : 1500,
                fadeExp: layer.dataset.fadeExp ? parseFloat(layer.dataset.fadeExp) : 1.5, // Default to 1.5
                isPinnable: layer.dataset.pin === "true"
            };
        });

        const furthestZ = Math.min(...layerData.map(l => l.depth));
        const totalDistance = Math.abs(furthestZ) + 2000;

        // Scroll track
        const scrollTrack = document.createElement('div');
        Object.assign(scrollTrack.style, {
            position: 'absolute', top: '0', left: '0',
            width: '1px', height: `${totalDistance}px`,
            pointerEvents: 'none', visibility: 'hidden'
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

        // Loop
        const update = (time: number) => {
            lenis.raf(time * 1000);
            currentZRef.current = lerp(currentZRef.current, targetZRef.current, 0.08);
            const currentZ = currentZRef.current;

            if (onUpdate) onUpdate(currentZ);

            layerData.forEach(({ element, depth, persistDist, fadeExp, isPinnable }) => {
                const relativeZ = depth - currentZ;

                // --- VISIBILITY & EVENTS ---
                // Check if totally gone
                const isFarGone = relativeZ < -FADE_DISTANCE || relativeZ > 2000;

                // Opacity Logic
                let opacity = 0;

                if (relativeZ < -FADE_DISTANCE) {
                    opacity = 0;
                } else if (relativeZ < 0) {
                    // Approaching from deep...
                    // Map -4000...0 -> 0...1
                    // Apply easing using configurable exponent
                    const linearProgress = 1 - (Math.abs(relativeZ) / FADE_DISTANCE);
                    opacity = Math.pow(linearProgress, fadeExp);
                } else {
                    // In front / Pinned
                    if (isPinnable && relativeZ < persistDist) {
                        opacity = 1;
                    } else {
                        // Exiting
                        const exitProgress = (relativeZ - persistDist) / 500;
                        opacity = clamp(1 - exitProgress, 0, 1);
                    }
                }

                // --- EVENT TRIGGERING ---
                if (opacity > 0.01) {
                    // ENTER EVENT
                    // Trigger when it "arrives" (relativeZ >= 0) OR if it's the Hero (depth 0) and we just started.
                    // We use a small epsilon for float comparison safety
                    if (relativeZ >= -10 && !enteredLayers.current.has(element)) {
                        enteredLayers.current.add(element);
                        if (onLayerEnter) onLayerEnter(element);
                    }

                    // EXIT EVENT
                    // Trigger when we move past the persistence point
                    // Buffer of 800px before fully fading out to start exit anim
                    const exitPoint = persistDist - 800; // e.g. at 700px relativeZ (if persist is 1500)
                    const isExiting = relativeZ >= exitPoint;

                    if (onLayerExit && isExiting && element.dataset.exited !== "true") {
                        element.dataset.exited = "true";
                        onLayerExit(element);
                    }
                    // RE-ENTER (Reverse Scroll)
                    else if (onLayerExit && !isExiting && element.dataset.exited === "true") {
                        element.dataset.exited = "false";
                        // Ideally we might want an 'onLayerReverseEnter' or just handle it in consumer
                        // For now, let's just trigger Enter again logic? 
                        // Or simply let consumer handle state.
                        // But we should re-trigger enter if we want the "slide up" again?
                        // For simplicity, we just clear exited flag. Consumer can watch dataset.
                        if (onLayerEnter) onLayerEnter(element); // Re-trigger enter animation?
                    }

                } else {
                    // Cleanup when far gone
                    if (isFarGone && enteredLayers.current.has(element)) {
                        enteredLayers.current.delete(element);
                        element.dataset.exited = "false";
                        // Allow re-run if we come back
                    }
                }

                // --- TRANSFORM ---
                let zPos = relativeZ;
                let scale = 1;

                if (isPinnable && relativeZ >= 0 && relativeZ < persistDist) {
                    zPos = 0; // PIN
                } else if (!isPinnable && relativeZ <= 0) {
                    scale = clamp(1 + (relativeZ / 2000), 0.5, 1);
                }

                // Apply
                gsap.set(element, {
                    x: 0, // FORCE CENTER to override CSS offsets
                    y: 0, // FORCE CENTER to override CSS offsets
                    z: zPos,
                    scale: scale,
                    autoAlpha: opacity,
                    overwrite: 'auto'
                });

                // Active State
                const effectiveDistance = (isPinnable && relativeZ >= 0 && relativeZ < persistDist) ? 0 : Math.abs(relativeZ);
                if (effectiveDistance < 300) {
                    element.classList.add('active');
                    element.style.pointerEvents = 'auto';
                } else {
                    element.classList.remove('active');
                    element.style.pointerEvents = 'none';
                }
            });
        };

        gsap.ticker.add(update);

        return () => {
            gsap.ticker.remove(update);
            lenis.destroy();
            scrollTrack.remove();
        };
    }, [containerRef, onUpdate, onLayerEnter, onLayerExit]);
};