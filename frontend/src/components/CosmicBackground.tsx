"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Stars } from "@react-three/drei";
import { useRef } from "react";
import * as THREE from "three";

function RotatingZodiacRings() {
  const ringRef1 = useRef<THREE.Mesh>(null);
  const ringRef2 = useRef<THREE.Mesh>(null);

  useFrame(({ clock }) => {
    if (ringRef1.current) {
      ringRef1.current.rotation.z = clock.getElapsedTime() * 0.05;
      ringRef1.current.rotation.x = Math.PI / 2.5; // Tilted
    }
    if (ringRef2.current) {
      ringRef2.current.rotation.z = -clock.getElapsedTime() * 0.03;
      ringRef2.current.rotation.x = Math.PI / 2.2;
    }
  });

  return (
    <>
      <mesh ref={ringRef1} position={[0, 0, 0]}>
        <ringGeometry args={[4, 4.02, 64]} />
        <meshBasicMaterial color="#d4af37" transparent opacity={0.2} side={THREE.DoubleSide} />
      </mesh>
      <mesh ref={ringRef2} position={[0, 0, 0]}>
        <ringGeometry args={[6, 6.01, 64]} />
        <meshBasicMaterial color="#ffffff" transparent opacity={0.1} side={THREE.DoubleSide} />
      </mesh>
    </>
  );
}

export function CosmicBackground() {
  return (
    <div className="absolute inset-0 z-0 bg-background pointer-events-none">
      <Canvas camera={{ position: [0, 2, 10], fov: 45 }} gl={{ preserveDrawingBuffer: true }}>
        <color attach="background" args={['#0a0514']} /> {/* Deep cosmic navy */}
        <ambientLight intensity={0.5} />
        
        {/* Cinematic Stars */}
        <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
        
        {/* Abstract Cosmic Elements */}
        <RotatingZodiacRings />

        {/* Subtle Fog for depth */}
        <fog attach="fog" args={['#0a0514', 5, 20]} />
      </Canvas>
    </div>
  );
}
