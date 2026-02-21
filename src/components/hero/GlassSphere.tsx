"use client";

import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useMouseRotation } from "../hooks/useMouseRotation";

export default function GlassSphere() {
  const meshRef = useRef<THREE.Mesh>(null);
  const scaleRef = useRef(0.01);
  const { lerp } = useMouseRotation();

  useFrame((_, delta) => {
    if (!meshRef.current) return;

    // Scale in from small
    if (scaleRef.current < 1) {
      scaleRef.current = Math.min(scaleRef.current + delta * 0.6, 1);
      const s = scaleRef.current;
      meshRef.current.scale.set(s, s, s);
    }

    const mouse = lerp(delta);
    meshRef.current.rotation.x +=
      (mouse.y * 0.3 - meshRef.current.rotation.x) * 0.02;
    meshRef.current.rotation.y +=
      (mouse.x * 0.3 - meshRef.current.rotation.y) * 0.02;
    meshRef.current.rotation.z += delta * 0.04;
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1.8, 32, 32]} />
      <meshPhysicalMaterial
        color="#b0d4f1"
        transmission={0.95}
        thickness={0.5}
        roughness={0.1}
        ior={1.33}
        envMapIntensity={0.8}
      />
    </mesh>
  );
}
