"use client";

import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import GlassSphere from "./GlassSphere";

export default function HeroScene() {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        background: "#f5f5f5",
        border: "1px solid #e0e0e0",
        borderRadius: "24px",
        overflow: "hidden",
      }}
    >
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        style={{ width: "100%", height: "100%" }}
        gl={{ antialias: false, alpha: false, powerPreference: "low-power" }}
        dpr={1}
        onCreated={({ gl }) => gl.setClearColor("#f5f5f5")}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <Environment preset="apartment" />
        <GlassSphere />
      </Canvas>
    </div>
  );
}
