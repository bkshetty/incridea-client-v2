// src/components/pronite/Starfield.tsx
import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface StarfieldProps {
    speedRef?: React.MutableRefObject<number>;
}

const Starfield: React.FC<StarfieldProps> = ({ speedRef }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!canvasRef.current) return;

        // 1. Scene Setup
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({
            canvas: canvasRef.current,
            alpha: true, // Transparent background
            antialias: true
        });

        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

        // 2. Create Stars
        const starsGeometry = new THREE.BufferGeometry();
        const starsCount = 3000;
        const posArray = new Float32Array(starsCount * 3);

        for (let i = 0; i < starsCount * 3; i++) {
            // Spread stars in a wide area
            posArray[i] = (Math.random() - 0.5) * 15;
        }

        starsGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));

        const material = new THREE.PointsMaterial({
            size: 0.003,
            color: 0xffffff,
            transparent: true,
            opacity: 0.8,
            sizeAttenuation: true
        });

        const starMesh = new THREE.Points(starsGeometry, material);
        scene.add(starMesh);
        camera.position.z = 2;


        // 4. Handle Resize
        const handleResize = () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        };
        window.addEventListener('resize', handleResize);

        // 5. Mouse Shake Logic
        const targetShake = { value: 0 };
        const handleMouseMove = (e: MouseEvent) => {
            const y = e.clientY / window.innerHeight;
            // If bottom 20%, trigger shake
            if (y > 0.8) {
                targetShake.value = 1.0;
            } else {
                targetShake.value = 0.0;
            }
        };
        window.addEventListener('mousemove', handleMouseMove);

        // Animation Loop
        let animationId: number;
        let shakeIntensity = 0;

        const animate = () => {
            animationId = requestAnimationFrame(animate);

            // Rotate the entire star system slowly
            const currentSpeed = speedRef ? speedRef.current : 1;
            starMesh.rotation.y += 0.0003 * currentSpeed;
            starMesh.rotation.x += 0.0001 * currentSpeed;

            // Camera Shake
            // Smoothly interpolate intensity
            shakeIntensity += (targetShake.value - shakeIntensity) * 0.1;

            if (shakeIntensity > 0.01) {
                const shakeAmount = 0.05 * shakeIntensity;
                camera.position.x = (Math.random() - 0.5) * shakeAmount;
                camera.position.y = (Math.random() - 0.5) * shakeAmount;
                // Maybe slight zoom too?
                camera.position.z = 2 - (0.2 * shakeIntensity);
            } else {
                // Reset
                camera.position.x = 0;
                camera.position.y = 0;
                camera.position.z = 2;
            }

            renderer.render(scene, camera);
        };
        animate();

        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener('resize', handleResize);
            window.removeEventListener('mousemove', handleMouseMove);
            // Cleanup Three.js resources
            starsGeometry.dispose();
            material.dispose();
            renderer.dispose();
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            id="bg-canvas"
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                zIndex: 0,
                pointerEvents: 'none'
            }}
        />
    );
};

export default Starfield;