import Link from "next/link";
import type { Metadata } from "next";
import { ME, PROJECTS } from "@/content";
import { fontArchivoBlack, fontInter } from "@/fonts";

export const metadata: Metadata = { title: `${ME.name} — Bauhaus` };

const RED = "#E63946";
const BLUE = "#1D3557";
const YELLOW = "#FFD500";
const INK = "#1a1a1a";

const SHAPES = ["●", "▲", "■", "◆"];
const SHAPE_COLORS = [RED, BLUE, YELLOW, INK];

export default function BauhausPage() {
  return (
    <main
      className={fontInter.className}
      style={{
        background: "#fff",
        color: INK,
        minHeight: "100vh",
        padding: "32px 6vw 64px",
      }}
    >
      <Link href="/" style={{ fontSize: 12, color: INK, textDecoration: "underline" }}>
        ← all variants
      </Link>

      <header
        style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          marginTop: "6vh",
          marginBottom: "10vh",
        }}
      >
        <div style={{ display: "flex", gap: 24, marginBottom: 32, alignItems: "center" }}>
          <div style={{ width: 56, height: 56, borderRadius: "50%", background: RED }} />
          <div style={{ width: 0, height: 0, borderLeft: "28px solid transparent", borderRight: "28px solid transparent", borderBottom: `56px solid ${BLUE}` }} />
          <div style={{ width: 56, height: 56, background: YELLOW }} />
        </div>
        <h1
          className={fontArchivoBlack.className}
          style={{
            fontSize: "clamp(56px, 13vw, 200px)",
            margin: 0,
            lineHeight: 0.85,
            letterSpacing: "-0.04em",
            textTransform: "uppercase",
          }}
        >
          Flavio<br />
          <span style={{ color: RED }}>Manyari.</span>
        </h1>
        <p style={{ fontSize: "clamp(16px, 1.8vw, 24px)", margin: "32px 0 0", maxWidth: 600 }}>
          {ME.role} <span style={{ background: YELLOW, padding: "0 6px" }}>{ME.location}</span>
        </p>
      </header>

      <section style={{ marginBottom: "10vh" }}>
        <h2
          className={fontArchivoBlack.className}
          style={{
            fontSize: "clamp(24px, 3vw, 36px)",
            margin: "0 0 24px",
            textTransform: "uppercase",
            letterSpacing: "-0.02em",
            borderBottom: `4px solid ${INK}`,
            paddingBottom: 12,
          }}
        >
          ● Selected Work
        </h2>
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {PROJECTS.map((p, i) => (
            <li
              key={p.slug}
              style={{
                display: "grid",
                gridTemplateColumns: "60px 1fr auto",
                gap: 24,
                alignItems: "center",
                padding: "20px 0",
                borderBottom: `2px solid ${INK}`,
              }}
            >
              <span
                style={{
                  fontSize: 40,
                  color: SHAPE_COLORS[i % SHAPE_COLORS.length],
                  textAlign: "center",
                  lineHeight: 1,
                }}
              >
                {SHAPES[i % SHAPES.length]}
              </span>
              <div>
                {p.url ? (
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={fontArchivoBlack.className}
                    style={{ fontSize: "clamp(20px, 2.4vw, 32px)", color: INK, textDecoration: "none", textTransform: "uppercase", letterSpacing: "-0.02em" }}
                  >
                    {p.title}
                  </a>
                ) : (
                  <span className={fontArchivoBlack.className} style={{ fontSize: "clamp(20px, 2.4vw, 32px)", textTransform: "uppercase", letterSpacing: "-0.02em" }}>
                    {p.title}
                  </span>
                )}
                <p style={{ fontSize: 13, margin: "4px 0 0", color: "#666" }}>{p.role}</p>
              </div>
              <span
                className={fontArchivoBlack.className}
                style={{
                  fontSize: 18,
                  background: SHAPE_COLORS[i % SHAPE_COLORS.length],
                  color: SHAPE_COLORS[i % SHAPE_COLORS.length] === YELLOW ? INK : "#fff",
                  padding: "4px 10px",
                }}
              >
                {p.year}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <section style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "6vw", marginBottom: "10vh" }}>
        <div>
          <div style={{ width: "100%", maxWidth: 200, aspectRatio: "1", background: BLUE }} />
        </div>
        <div>
          <h2 className={fontArchivoBlack.className} style={{ fontSize: 24, margin: "0 0 16px", textTransform: "uppercase" }}>
            ▲ About
          </h2>
          <p style={{ fontSize: 18, lineHeight: 1.6, margin: 0 }}>{ME.about}</p>
        </div>
      </section>

      <section
        style={{
          background: INK,
          color: "#fff",
          padding: "32px 24px",
          marginLeft: "-6vw",
          marginRight: "-6vw",
          paddingLeft: "6vw",
          paddingRight: "6vw",
        }}
      >
        <h2 className={fontArchivoBlack.className} style={{ fontSize: 24, margin: "0 0 16px", textTransform: "uppercase", color: YELLOW }}>
          ■ Contact
        </h2>
        <a
          href={`mailto:${ME.email}`}
          className={fontArchivoBlack.className}
          style={{ fontSize: "clamp(24px, 4vw, 56px)", color: "#fff", textDecoration: "none", display: "inline-block", letterSpacing: "-0.02em" }}
        >
          {ME.email}
        </a>
        <div style={{ marginTop: 24, fontSize: 14, display: "flex", gap: 16 }}>
          <a href={ME.socials.github} style={{ color: YELLOW }}>github</a>
          <a href={ME.socials.linkedin} style={{ color: YELLOW }}>linkedin</a>
        </div>
      </section>
    </main>
  );
}
