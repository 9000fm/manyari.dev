import Link from "next/link";
import type { Metadata } from "next";
import { ME, PROJECTS } from "@/content";
import { fontSpaceGrotesk, fontBricolage } from "@/fonts";

export const metadata: Metadata = { title: `${ME.name} — Riso Zine` };

const PINK = "#FF48B0";
const BLUE = "#3D5AFE";
const PAPER = "#F4EFE6";
const INK = "#1a1a1a";

export default function RisoPage() {
  const halftone = {
    backgroundImage: "radial-gradient(rgba(0,0,0,0.12) 1px, transparent 1px)",
    backgroundSize: "5px 5px",
  };
  return (
    <main
      className={fontSpaceGrotesk.className}
      style={{
        background: PAPER,
        color: INK,
        minHeight: "100vh",
        padding: "32px 6vw 64px",
        ...halftone,
      }}
    >
      <Link href="/" style={{ fontSize: 12, color: BLUE, textDecoration: "underline" }}>
        ← all variants
      </Link>

      {/* hero with off-register duplicates */}
      <header style={{ marginTop: "6vh", marginBottom: "10vh", position: "relative" }}>
        <div style={{ position: "relative", display: "inline-block" }}>
          <h1
            className={fontBricolage.className}
            aria-hidden
            style={{
              position: "absolute",
              top: 6,
              left: -6,
              fontSize: "clamp(56px, 14vw, 200px)",
              fontWeight: 700,
              lineHeight: 0.9,
              color: PINK,
              margin: 0,
              letterSpacing: "-0.04em",
              mixBlendMode: "multiply",
              userSelect: "none",
            }}
          >
            FLAVIO<br />MANYARI
          </h1>
          <h1
            className={fontBricolage.className}
            aria-hidden
            style={{
              position: "absolute",
              top: -4,
              left: 4,
              fontSize: "clamp(56px, 14vw, 200px)",
              fontWeight: 700,
              lineHeight: 0.9,
              color: BLUE,
              margin: 0,
              letterSpacing: "-0.04em",
              mixBlendMode: "multiply",
              userSelect: "none",
            }}
          >
            FLAVIO<br />MANYARI
          </h1>
          <h1
            className={fontBricolage.className}
            style={{
              position: "relative",
              fontSize: "clamp(56px, 14vw, 200px)",
              fontWeight: 700,
              lineHeight: 0.9,
              color: INK,
              margin: 0,
              letterSpacing: "-0.04em",
            }}
          >
            FLAVIO<br />MANYARI
          </h1>
        </div>
        <p
          style={{
            marginTop: 32,
            fontSize: "clamp(16px, 1.6vw, 22px)",
            background: PINK,
            color: "#fff",
            display: "inline-block",
            padding: "4px 12px",
            transform: "rotate(-1.5deg)",
          }}
        >
          {ME.role} — {ME.location}
        </p>
      </header>

      <section style={{ marginBottom: "10vh" }}>
        <h2
          className={fontBricolage.className}
          style={{
            fontSize: "clamp(28px, 5vw, 56px)",
            color: BLUE,
            margin: "0 0 24px",
            fontWeight: 700,
            letterSpacing: "-0.02em",
            transform: "rotate(-0.5deg)",
            display: "inline-block",
          }}
        >
          ✺ selected werk
        </h2>
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 16 }}>
          {PROJECTS.map((p, i) => (
            <li
              key={p.slug}
              style={{
                background: i % 2 === 0 ? "#fff" : PAPER,
                border: `2px solid ${INK}`,
                padding: "16px 20px",
                boxShadow: `6px 6px 0 ${i % 2 === 0 ? PINK : BLUE}`,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                gap: 16,
                flexWrap: "wrap",
              }}
            >
              <div>
                {p.url ? (
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={fontBricolage.className}
                    style={{ fontSize: "clamp(20px, 2.6vw, 32px)", color: INK, textDecoration: "none", fontWeight: 700 }}
                  >
                    → {p.title}
                  </a>
                ) : (
                  <span className={fontBricolage.className} style={{ fontSize: "clamp(20px, 2.6vw, 32px)", fontWeight: 700 }}>
                    → {p.title}
                  </span>
                )}
                <p style={{ fontSize: 13, margin: "4px 0 0", color: "#444" }}>{p.role}</p>
              </div>
              <span style={{ fontSize: 18, fontWeight: 700, color: i % 2 === 0 ? PINK : BLUE }}>'{String(p.year).slice(2)}</span>
            </li>
          ))}
        </ul>
      </section>

      <section
        style={{
          marginBottom: "10vh",
          padding: "24px",
          background: BLUE,
          color: "#fff",
          maxWidth: 640,
          transform: "rotate(0.4deg)",
          boxShadow: `8px 8px 0 ${PINK}`,
        }}
      >
        <h2 className={fontBricolage.className} style={{ fontSize: 28, margin: "0 0 12px", fontWeight: 700 }}>
          about ✺
        </h2>
        <p style={{ fontSize: 17, lineHeight: 1.6, margin: 0 }}>{ME.about}</p>
      </section>

      <section>
        <h2
          className={fontBricolage.className}
          style={{
            fontSize: "clamp(28px, 5vw, 48px)",
            color: PINK,
            margin: "0 0 16px",
            fontWeight: 700,
          }}
        >
          ✺ get in touch
        </h2>
        <a
          href={`mailto:${ME.email}`}
          className={fontBricolage.className}
          style={{
            fontSize: "clamp(24px, 4vw, 48px)",
            color: INK,
            background: PINK,
            padding: "4px 12px",
            display: "inline-block",
            textDecoration: "none",
            transform: "rotate(-0.8deg)",
            fontWeight: 700,
          }}
        >
          {ME.email}
        </a>
        <p style={{ marginTop: 16, fontSize: 14 }}>
          <a href={ME.socials.github} style={{ color: BLUE, textDecoration: "underline" }}>github</a> · <a href={ME.socials.linkedin} style={{ color: BLUE, textDecoration: "underline" }}>linkedin</a>
        </p>
      </section>
    </main>
  );
}
