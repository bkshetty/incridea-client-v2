import React, { useRef, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';

type Props = {
    src: string;
    width?: number | string;
    height?: number | string;
    dataZ?: number;
    intensityScale?: number;
    className?: string;
};

const maxDepth = 15000; // Trigger distance for effect

// Tech Wireframe / Disintegration Shader
const vertexShader = `
varying vec2 vUv;
varying float vDisplacement;
uniform float uStrength;
uniform float uTime;

// Simplex Noise
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

void main() {
  vUv = uv;
  
  // Noise based displacement
  float noiseVal = snoise(uv * 10.0 + uTime * 0.5);
  vDisplacement = noiseVal;
  
  vec3 newPosition = position;
  
  // Apply Z displacement based on strength and noise
  float displacement = noiseVal * uStrength * 0.5; // Scale relative to component size (1x1)
  newPosition.z += displacement;
  
  // Scatter
  newPosition.x += snoise(uv * 20.0 + uTime) * uStrength * 0.1;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}
`;

const fragmentShader = `
varying vec2 vUv;
varying float vDisplacement;
uniform sampler2D uTexture;
uniform float uStrength;

void main() {
  vec4 texColor = texture2D(uTexture, vUv);
  
  // Grid Logic
  float gridSize = 40.0;
  vec2 gridUv = fract(vUv * gridSize);
  float lineThickness = 0.15;
  
  float gridX = step(lineThickness, gridUv.x);
  float gridY = step(lineThickness, gridUv.y);
  float isCell = gridX * gridY;
  
  vec3 wireColor = vec3(0.0, 0.8, 1.0); // Cyan
  
  vec3 color = texColor.rgb;
  
  if (isCell < 0.5) {
       // Grid line
       color = mix(color, wireColor, uStrength);
  } else {
       // Cell content
       if (uStrength > 0.5 && vDisplacement > 0.1) {
           discard;
       }
  }
  
  float alpha = texColor.a;
  if (uStrength > 0.8 && isCell > 0.6) alpha *= (1.0 - uStrength);
  
  gl_FragColor = vec4(color, alpha);
}
`;


function DistortMesh({ texture, intensity, aspect }: { texture: any; intensity: number; aspect: number; }) {
    const matRef = useRef<THREE.ShaderMaterial | null>(null);
    useFrame(({ clock }) => {
        if (!matRef.current) return;
        matRef.current.uniforms.uTime.value = clock.getElapsedTime();
        // Smoothly interpolate strength for less jitter
        matRef.current.uniforms.uStrength.value = THREE.MathUtils.lerp(matRef.current.uniforms.uStrength.value, intensity, 0.1);
    });

    return (
        <mesh scale={[aspect, 1, 1]}>
            <planeGeometry args={[1, 1, 64, 64]} />
            <shaderMaterial
                ref={matRef}
                uniforms={{
                    uTexture: { value: Array.isArray(texture) ? texture[0] : texture },
                    uTime: { value: 0 },
                    uStrength: { value: 0 }
                }}
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                transparent={true}
                side={THREE.DoubleSide}
            />
        </mesh>
    );
}


const ImageDistortion: React.FC<Props> = ({ src, width = 220, height = 220, dataZ = 0, intensityScale = 1.0, className }) => {
    const tex = useTexture(src) as any;

    // Fix encoding
    useEffect(() => {
        if (!tex) return;
        const first = Array.isArray(tex) ? tex[0] : tex;
        try {
            (first as any).encoding = (THREE as any).sRGBEncoding ?? (THREE as any).SRGBEncoding;
        } catch (e) { }
    }, [tex]);

    // Intensity Logic: Use dataZ relative to screen depth
    // This logic assumes we want the effect to activate as the element moves "in Z space".
    // However, ImageDistortion is mounted IN THE DOM. So it doesn't move in Z.
    // Wait, the USER'S CODE in PronitePage sets `data-z` on the parent section, but passed `dataZ` prop to this component.
    // AND MeshImage logic used `scrollZ`.
    // IF ImageDistortion is inside the DOM, it scrolls vertically. It doesn't move in 3D Z space.
    // BUT the useZScroll hook moves the PARENT container in Z.
    // So `ImageDistortion` physically moves in 3D CSS transform Z.
    // But the Canvas inside is flat.
    // We need to know "How close is this element to the camera/screen?"
    // The useZScroll logic calculates `relativeZ`.
    // We don't have access to `scrollZ` or `relativeZ` here easily unless passed.
    // BUT the user passed `dataZ`.
    // If we want the effect to trigger based on scroll, we need `scrollZ` or `currentZ` passed down.
    // `PronitePage` passes `dataZ` (static). It doesn't pass the dynamic scroll value.

    // TEMPORARY FIX:
    // This component only knows its static `dataZ`.
    // It can't know when to distort without scroll position.
    // I will add a `scrollZ?` prop or context?
    // Actually, `PronitePage` (Step 638) does utilize `scrollZ` state!
    // I should check if user passed `scrollZ` to `ImageDistortion` usage.
    // In Step 713/714/715 user usage: <ImageDistortion ... dataZ={-6500} />
    // They did NOT pass scrollZ.

    // If they don't pass scrollZ, the effect won't animate on scroll.
    // However, I can't change PronitePage comfortably without huge diffs.
    // I will add `scrollZ` prop to ImageDistortion but make it optional.
    // For now, I'll use a local logic: 
    // Maybe the user intends to use the `dataZ` as a static "intensity"?
    // No, "mesh effect when near screen".

    // I will check if useZScroll can expose currentZ globally or if I should just use `onFrame` to read the parent's generic position?
    // Hard.

    // BETTER PLAN:
    // I will read `window.scrollY` or similar? No, Lenis.
    // I will assume the user will update usage to pass `scrollZ` later, or I'll assume they want it purely static for now?
    // Wait, the prompt said "make the mesh effect work".
    // I will simply implement the shader. 
    // I'll set intensity to `1.0` if `dataZ` is not provided, or logic around it.

    // Let's stick to the component implementation first. 
    // I will retain the `intensity` calculation based on `dataZ` but it will be static for now unless `dataZ` changes.
    // Wait, `PronitePage` passes `dataZ`.
    // I'll keep the `intensity` logic that was there:
    // const depth = Math.abs(dataZ);
    // const proximity = 1 - Math.min(depth / maxDepth, 1);

    const depth = Math.abs(dataZ);
    // If dataZ is 0 (Hero), proximity is 1 -> Full distortion? That's bad.
    // The request: "convert into mesh when it is NEAR to screen".
    // If it's AT the screen (Z=0), it should be mesh?
    // Yes.
    // If it's far (Z=-5000), it should be image.
    // So:
    // Z=-5000 -> dist 5000 -> proximity low -> image.
    // Z=0 -> dist 0 -> proximity high -> mesh.

    // But `dataZ` is static -5000. It never changes to 0.
    // The *parent div* moves via CSS transform.
    // The component itself doesn't know it's moving.
    // This approach (ImageDistortion inside DOM) is fundamentally disconnected from the Z-scroll logic unless we pass `currentZ`.

    // I will invoke `useZScroll` context or simply accept that it's static for now?
    // No, that fails the user request.
    // The user moved away from my `MeshImage` (which had `scrollZ`) to this.
    // I must make it work.

    // I will add a method to read the *computed* Z position of the parent element?
    // `getBoundingClientRect`? No.
    // `window.getComputedStyle(containerRef.current).transform`?
    // Yes! The `useZScroll` hook applies `transform: translate3d(..., z, ...)`.
    // I can read the Matrix3D from the parent or the element itself every frame!

    // I'll add logic in `useFrame` or `requestAnimationFrame` to read the computed transform Z.

    const containerRef = React.useRef<HTMLDivElement | null>(null);
    const [computedIntensity, setComputedIntensity] = React.useState(0);

    // We can use a ref for intensity to avoid re-renders, passed to Canvas via props?
    const intensityRef = useRef(0);

    useEffect(() => {
        let rAF: number;
        const checkDepth = () => {
            if (containerRef.current) {
                // The useZScroll hook applies transform on the PARENT section usually, not the inner div.
                // The ImageDistortion is inside <div style={{position: absolute}}><ImageDistortion /></div> inside <section data-z={-5000}>
                // The SECTION has the transform.
                // We need to find the closest `.z-layer` parent.
                const zLayer = containerRef.current.closest('.z-layer');
                if (zLayer) {
                    const style = window.getComputedStyle(zLayer);
                    const matrix = new DOMMatrix(style.transform);
                    // matrix.m43 is Z translation
                    const currentZ = matrix.m43;

                    // dataZ is the "base" depth. 
                    // When currentZ (transform) + dataZ (base) approx 0?
                    // No, useZScroll logic: transform Z starts at `depth` (negative) and goes to 0 (screen).
                    // Actually useZScroll sets `z` to `relativeZ`.
                    // relativeZ = depth - currentScrollZ.
                    // So `matrix.m43` IS the distance from the camera (0).

                    const dist = Math.abs(currentZ);
                    // Trigger at 1500
                    const trigger = 1500;
                    const strength = dist < trigger ? (1 - dist / trigger) : 0;

                    intensityRef.current = strength * intensityScale;
                }
            }
            rAF = requestAnimationFrame(checkDepth);
        };
        checkDepth();
        return () => cancelAnimationFrame(rAF);
    }, [intensityScale]);

    // compute aspect
    const firstTex = tex ? (Array.isArray(tex) ? tex[0] : tex) : null;
    const aspect = firstTex && firstTex.image ? (firstTex.image.width / firstTex.image.height) : (typeof width === 'number' && typeof height === 'number' ? width / height : 1);

    // Wrapper component to pipe ref to mesh
    const SceneContent = () => {
        // We can access intensityRef via closure if we define DistortMesh here?
        // Or pass it.
        // Let's pass a mutable object/ref to DistortMesh
        return <DistortMesh texture={tex} intensityRef={intensityRef} aspect={aspect} />;
    };

    return (
        <div ref={containerRef} className={className} style={{ width: typeof width === 'number' ? width + 'px' : width, height: typeof height === 'number' ? height + 'px' : height }}>
            <Canvas gl={{ antialias: true, alpha: true }} style={{ width: '100%', height: '100%' }}>
                <ambientLight intensity={1} />
                <SceneContent />
            </Canvas>
        </div>
    );
};

// Updated DistortMesh to use ref
function DistortMesh({ texture, intensityRef, aspect }: { texture: any; intensityRef: React.MutableRefObject<number>; aspect: number; }) {
    const matRef = useRef<THREE.ShaderMaterial | null>(null);
    useFrame(({ clock }) => {
        if (!matRef.current) return;
        matRef.current.uniforms.uTime.value = clock.getElapsedTime();
        // Lerp the value from the ref (read from DOM style)
        matRef.current.uniforms.uStrength.value = THREE.MathUtils.lerp(matRef.current.uniforms.uStrength.value, intensityRef.current, 0.1);
    });

    return (
        <mesh scale={[aspect, 1, 1]}>
            {/* Tech Wireframe needs segments */}
            <planeGeometry args={[1, 1, 64, 64]} />
            <shaderMaterial
                ref={matRef}
                uniforms={{
                    uTexture: { value: Array.isArray(texture) ? texture[0] : texture },
                    uTime: { value: 0 },
                    uStrength: { value: 0 }
                }}
                vertexShader={vertexShader}
                fragmentShader={fragmentShader}
                transparent={true}
                side={THREE.DoubleSide}
            />
        </mesh>
    );
}

export default ImageDistortion;
