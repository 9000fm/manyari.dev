import Link from "next/link";
import type { Metadata } from "next";
import { ME, PROJECTS } from "@/content";
import { fontInterTight } from "@/fonts";

export const metadata: Metadata = { title: `${ME.name} — Swiss Editorial` };

const ACCENT = "#E63946";

export default function SwissPage() {
  return (
    <main
      className={fontInterTight.className}
      style={{
        background: "#fff",
        color: "#0a0a0a",
        minHeight: "100vh",
        padding: "48px 6vw",
      }}
    >
      <BackLink />

      <header
        style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          borderTop: "1px solid #0a0a0a",
          paddingTop: 24,
          marginTop: 24,
          marginBottom: "12vh",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "8vh" }}>
          <span>{ME.location}</span>
          <span>Available 2025</span>
        </div>
        <h1
          style={{
            fontSize: "clamp(56px, 13vw, 200px)",
            fontWeight: 700,
            lineHeight: 0.92,
            letterSpacing: "-0.04em",
            margin: 0,
          }}
        >
          {ME.name}.
        </h1>
        <p style={{ fontSize: "clamp(18px, 2vw, 26px)", margin: "32px 0 0", maxWidth: 600, lineHeight: 1.4 }}>
          <span style={{ color: ACCENT }}>—</span> {ME.role}.
        </p>
      </header>

      <section style={{ marginBottom: "12vh" }}>
        <h2 style={{ fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", margin: "0 0 32px", fontWeight: 500 }}>
          Selected Work
        </h2>
        <ol style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {PROJECTS.map((p, i) => (
            <li
              key={p.slug}
              style={{
                borderTop: "1px solid #0a0a0a",
                padding: "20px 0",
                display: "grid",
                gridTemplateColumns: "40px 1fr auto",
                gap: 24,
                alignItems: "baseline",
              }}
            >
              <span style={{ fontSize: 13, color: "#888" }}>0{i + 1}</span>
              {p.url ? (
                <a href={p.url} target="_blank" rel="noopener noreferrer" style={{ color: "inherit", textDecoration: "none" }}>
                  <span style={{ fontSize: "clamp(20px, 2.4vw, 32px)", fontWeight: 500, letterSpacing: "-0.02em" }}>{p.title}</span>
                  <span style={{ display: "block", fontSize: 13, color: "#666", marginTop: 4 }}>{p.role}</span>
                </a>
              ) : (
                <div>
                  <span style={{ fontSize: "clamp(20px, 2.4vw, 32px)", fontWeight: 500, letterSpacing: "-0.02em" }}>{p.title}</span>
                  <span style={{ display: "block", fontSize: 13, color: "#666", marginTop: 4 }}>{p.role}</span>
                </div>
              )}
              <span style={{ fontSize: 14, color: "#888" }}>{p.year}</span>
            </li>
          ))}
          <li style={{ borderTop: "1px solid #0a0a0a" }} />
        </ol>
      </section>

      <section style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "8vw", marginBottom: "12vh", borderTop: "1px solid #0a0a0a", paddingTop: 24 }}>
        <h2 style={{ fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", margin: 0, fontWeight: 500 }}>About</h2>
        <p style={{ fontSize: "clamp(17px, 1.6vw, 22px)", lineHeight: 1.5, margin: 0, maxWidth: 640 }}>{ME.about}</p>
      </section>

      <section style={{ borderTop: "1px solid #0a0a0a", paddingTop: 24, paddingBottom: 48 }}>
        <h2 style={{ fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", margin: "0 0 24px", fontWeight: 500 }}>Contact</h2>
        <a href={`mailto:${ME.email}`} style={{ fontSize: "clamp(28px, 4vw, 56px)", color: ACCENT, textDecoration: "none", letterSpacing: "-0.02em" }}>
          {ME.email} →
        </a>
        <div style={{ marginTop: 24, display: "flex", gap: 24, fontSize: 14 }}>
          <a href={ME.socials.github} style={{ color: "#0a0a0a" }}>GitHub</a>
          <a href={ME.socials.linkedin} style={{ color: "#0a0a0a" }}>LinkedIn</a>
        </div>
      </section>
    </main>
  );
}

function BackLink() {
  return (
    <Link href="/" style={{ fontSize: 12, color: "#888", textDecoration: "none", letterSpacing: "0.08em", textTransform: "uppercase" }}>
      ← All variants
    </Link>
  );
}
