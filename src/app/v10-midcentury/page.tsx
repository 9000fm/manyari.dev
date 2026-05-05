import Link from "next/link";
import type { Metadata } from "next";
import { ME, PROJECTS } from "@/content";
import { fontAbril, fontInter } from "@/fonts";

export const metadata: Metadata = { title: `${ME.name} — Mid-Century` };

const CREAM = "#F4E9D8";
const MUSTARD = "#D9A441";
const TEAL = "#2A6F6F";
const RUST = "#B5482E";
const INK = "#2B1B0E";

export default function MidCenturyPage() {
  return (
    <main
      className={fontInter.className}
      style={{
        background: CREAM,
        color: INK,
        minHeight: "100vh",
        padding: "32px 6vw 64px",
      }}
    >
      <Link href="/" style={{ fontSize: 12, color: TEAL, textDecoration: "underline" }}>
        ← all variants
      </Link>

      <header style={{ textAlign: "center", marginTop: "8vh", marginBottom: "10vh" }}>
        <p style={{ fontSize: 14, color: TEAL, letterSpacing: "0.4em", margin: "0 0 8px", textTransform: "uppercase" }}>
          ☆ ──── ★ ──── ☆
        </p>
        <h1
          className={fontAbril.className}
          style={{
            fontSize: "clamp(56px, 14vw, 200px)",
            margin: 0,
            lineHeight: 0.9,
            color: RUST,
            letterSpacing: "-0.01em",
          }}
        >
          Flavio
        </h1>
        <h1
          className={fontAbril.className}
          style={{
            fontSize: "clamp(40px, 9vw, 130px)",
            margin: 0,
            lineHeight: 0.9,
            color: TEAL,
            letterSpacing: "0.02em",
            fontStyle: "italic",
          }}
        >
          Manyari
        </h1>
        <p style={{ fontSize: 14, color: TEAL, letterSpacing: "0.4em", margin: "16px 0 0", textTransform: "uppercase" }}>
          ☆ ──── ★ ──── ☆
        </p>
        <p style={{ fontSize: 18, color: INK, margin: "24px 0 0", letterSpacing: "0.05em" }}>
          {ME.role} <span style={{ color: MUSTARD }}>·</span> {ME.location}
        </p>
      </header>

      <section style={{ maxWidth: 760, margin: "0 auto 12vh" }}>
        <header style={{ textAlign: "center", marginBottom: 32 }}>
          <p style={{ fontSize: 12, color: MUSTARD, letterSpacing: "0.3em", textTransform: "uppercase", margin: 0 }}>presenting</p>
          <h2
            className={fontAbril.className}
            style={{
              fontSize: "clamp(28px, 4.5vw, 56px)",
              margin: "4px 0 8px",
              color: RUST,
              fontStyle: "italic",
            }}
          >
            Selected Works
          </h2>
          <p style={{ fontSize: 12, color: TEAL, letterSpacing: "0.4em", margin: 0 }}>
            ─── ✦ ───
          </p>
        </header>

        <div style={{ display: "grid", gap: 16 }}>
          {PROJECTS.map((p, i) => {
            const accents = [MUSTARD, TEAL, RUST, MUSTARD];
            const accent = accents[i % accents.length];
            const inner = (
              <article
                style={{
                  display: "grid",
                  gridTemplateColumns: "auto 1fr auto",
                  gap: 20,
                  alignItems: "center",
                  padding: "18px 20px",
                  background: "#fff",
                  border: `2px solid ${INK}`,
                  borderTop: `8px solid ${accent}`,
                }}
              >
                <span
                  className={fontAbril.className}
                  style={{
                    fontSize: 28,
                    color: accent,
                    lineHeight: 1,
                  }}
                >
                  ✦
                </span>
                <div>
                  <h3 className={fontAbril.className} style={{ fontSize: "clamp(20px, 2.4vw, 28px)", margin: 0, lineHeight: 1.1, color: INK }}>
                    {p.title}
                  </h3>
                  <p style={{ fontSize: 13, margin: "4px 0 0", color: INK, opacity: 0.7 }}>{p.role}</p>
                </div>
                <span style={{ fontSize: 16, color: accent, fontWeight: 700 }}>{p.year}</span>
              </article>
            );
            return (
              <div key={p.slug}>
                {p.url ? (
                  <a href={p.url} target="_blank" rel="noopener noreferrer" style={{ color: "inherit", textDecoration: "none" }}>
                    {inner}
                  </a>
                ) : (
                  inner
                )}
              </div>
            );
          })}
        </div>
      </section>

      <section style={{ maxWidth: 600, margin: "0 auto 12vh", textAlign: "center" }}>
        <h2 className={fontAbril.className} style={{ fontSize: 36, margin: "0 0 16px", color: TEAL, fontStyle: "italic" }}>
          A Word About Me
        </h2>
        <p style={{ fontSize: 17, lineHeight: 1.7, margin: 0 }}>{ME.about}</p>
      </section>

      <footer
        style={{
          textAlign: "center",
          paddingTop: 32,
          borderTop: `4px double ${RUST}`,
          maxWidth: 720,
          margin: "0 auto",
        }}
      >
        <p style={{ fontSize: 12, color: MUSTARD, letterSpacing: "0.3em", textTransform: "uppercase", margin: "0 0 12px" }}>
          ★ ── inquiries ── ★
        </p>
        <a
          href={`mailto:${ME.email}`}
          className={fontAbril.className}
          style={{
            fontSize: "clamp(28px, 4vw, 48px)",
            color: RUST,
            textDecoration: "none",
            fontStyle: "italic",
          }}
        >
          {ME.email}
        </a>
        <p style={{ marginTop: 16, fontSize: 14 }}>
          <a href={ME.socials.github} style={{ color: TEAL }}>github</a> · <a href={ME.socials.linkedin} style={{ color: TEAL }}>linkedin</a>
        </p>
      </footer>
    </main>
  );
}
