"use client";

import dynamic from "next/dynamic";
import HeroTitle from "./HeroTitle";

const HeroScene = dynamic(() => import("./HeroScene"), { ssr: false });

export default function HeroSection() {
  return (
    <section
      style={{
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        padding: "2.5vw",
        paddingTop: "3vh",
        paddingBottom: "3vh",
        gap: "2vh",
        background: "#fff",
      }}
    >
      <HeroTitle />
      <div style={{ flex: 1, minHeight: 0 }}>
        <HeroScene />
      </div>
    </section>
  );
}
