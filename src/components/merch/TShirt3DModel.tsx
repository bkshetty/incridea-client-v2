import { Suspense, useRef, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, useGLTF, PerspectiveCamera } from '@react-three/drei';
import * as THREE from 'three';

interface ModelProps {
  modelPath: string;
}

function TShirtModel({ modelPath }: ModelProps) {
  const gltf = useGLTF(modelPath);
  const meshRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (meshRef.current && gltf.scene) {
      const box = new THREE.Box3().setFromObject(gltf.scene);
      const center = box.getCenter(new THREE.Vector3());
      const size = box.getSize(new THREE.Vector3());

      gltf.scene.position.x = -center.x;
      gltf.scene.position.y = -center.y;
      gltf.scene.position.z = -center.z;

      const maxDim = Math.max(size.x, size.y, size.z);
      const scale = 2 / maxDim;
      meshRef.current.scale.setScalar(scale);
    }
  }, [gltf.scene]);

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.3) * 0.05;
    }
  });

  return (
    <group ref={meshRef}>
      <primitive object={gltf.scene} />
    </group>
  );
}

function Loader() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 10;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-purple-900/30 to-indigo-900/30 backdrop-blur-sm rounded-xl">
      <div className="relative">
        {}
        <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />

        {}
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-white font-bold text-sm">{progress}%</span>
        </div>
      </div>

      <p className="mt-4 text-gray-300 text-sm animate-pulse">Loading 3D Model...</p>
    </div>
  );
}

interface TShirt3DModelProps {
  modelPath?: string;
  className?: string;
}

export default function TShirt3DModel({
  modelPath = '/models/shirt.glb',
  className = ''
}: TShirt3DModelProps) {
  const [cameraZ, setCameraZ] = useState(5.0);

  useEffect(() => {
    const handleResize = () => {
      setCameraZ(window.innerWidth > 640 ? 3.5 : 5.0);
    };
    handleResize(); 
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className={`relative w-full h-full min-h-[400px] ${className}`}>
      <Canvas
        shadows
        dpr={[1, 2]}
        style={{ background: 'transparent' }}
        gl={{
          antialias: true,
          alpha: true,
          preserveDrawingBuffer: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1
        }}
        camera={{ position: [0, 0, cameraZ], fov: 45 }}
      >
        {}
        <PerspectiveCamera
          makeDefault
          position={[0, 0, cameraZ]}
          fov={45}
          near={0.1}
          far={100}
        />

        {}
        {}
        <directionalLight
          position={[5, 5, 5]}
          intensity={1.5}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />

        {}
        <directionalLight
          position={[-5, 3, -5]}
          intensity={0.8}
        />

        {}
        <directionalLight
          position={[0, 5, -5]}
          intensity={0.6}
        />

        {}
        <ambientLight intensity={0.4} />

        {}
        <hemisphereLight
          intensity={0.6}
          color="#ffffff"
          groundColor="#444444"
        />

        {}
        <Suspense fallback={<Loader />}>
          <TShirtModel modelPath={modelPath} />
        </Suspense>

        {}
        <OrbitControls
          enablePan={false}
          enableZoom={true}
          enableRotate={true}
          minDistance={1.5}
          maxDistance={6}
          minPolarAngle={Math.PI / 4}
          maxPolarAngle={Math.PI / 1.5}
          dampingFactor={0.05}
          enableDamping={true}
          rotateSpeed={0.5}
          zoomSpeed={0.8}
          autoRotate={false}
          autoRotateSpeed={1}
        />
      </Canvas>


    </div>
  );
}

useGLTF.preload('/models/shirt.glb');
