import Link from "next/link";
import type { Metadata } from "next";
import { ME, PROJECTS, EXPERIENCE, SKILLS, EDUCATION, LANGUAGES, SERVICES } from "@/content";
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
      <style>{`
        @keyframes bhSpin { from { transform: rotate(0); } to { transform: rotate(360deg); } }
        .bhSpin { animation: bhSpin 22s linear infinite; transform-origin: center; }
        @keyframes bhMarq { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .bhMarq { display: inline-flex; gap: 48px; animation: bhMarq 28s linear infinite; will-change: transform; }
        .bhRow { transition: background .2s ease, transform .2s ease; }
        .bhRow:hover { transform: translateX(8px); }
        .bhRow:hover .bhShape { transform: rotate(45deg) scale(1.1); }
        .bhShape { transition: transform .25s ease; transform-origin: center; display: inline-block; }
        .bhBlock { transition: transform .3s ease; }
        .bhBlock:hover { transform: rotate(-3deg) scale(1.04); }
      `}</style>

      <Link href="/" style={{ fontSize: 12, color: INK, textDecoration: "underline" }}>
        ← all variants
      </Link>

      {/* HERO */}
      <header
        style={{
          marginTop: "6vh",
          marginBottom: "8vh",
        }}
      >
        <div style={{ display: "flex", gap: 24, marginBottom: 32, alignItems: "center" }}>
          <div className="bhSpin" style={{ width: 56, height: 56, borderRadius: "50%", background: RED }} />
          <div className="bhBlock" style={{ width: 0, height: 0, borderLeft: "28px solid transparent", borderRight: "28px solid transparent", borderBottom: `56px solid ${BLUE}` }} />
          <div className="bhBlock" style={{ width: 56, height: 56, background: YELLOW }} />
          <div style={{ flex: 1, height: 4, background: INK }} />
          <span style={{ fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", color: RED }}>● {ME.available}</span>
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
        <p style={{ fontSize: "clamp(16px, 1.8vw, 24px)", margin: "32px 0 0", maxWidth: 720 }}>
          {ME.role} <span style={{ background: YELLOW, padding: "0 6px" }}>{ME.location}</span>
        </p>
      </header>

      {/* SERVICES MARQUEE */}
      <section
        style={{
          background: INK,
          color: "#fff",
          marginLeft: "-6vw",
          marginRight: "-6vw",
          padding: "16px 0",
          marginBottom: "8vh",
          overflow: "hidden",
          borderTop: `8px solid ${RED}`,
          borderBottom: `8px solid ${YELLOW}`,
        }}
      >
        <div className={`bhMarq ${fontArchivoBlack.className}`} style={{ fontSize: "clamp(20px, 2.8vw, 36px)", paddingLeft: "6vw", whiteSpace: "nowrap", letterSpacing: "-0.02em", textTransform: "uppercase" }}>
          {[...Array(2)].flatMap((_, i) => SERVICES.map((s, j) => (
            <span key={`${i}-${s}`} style={{ display: "inline-flex", alignItems: "center", gap: 24 }}>
              <span style={{ color: [YELLOW, RED, "#fff"][j % 3] }}>●</span>
              <span>{s}</span>
            </span>
          )))}
        </div>
      </section>

      {/* WORK */}
      <Section heading="● Selected Work">
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {PROJECTS.map((p, i) => (
            <li
              key={p.slug}
              className="bhRow"
              style={{
                display: "grid",
                gridTemplateColumns: "60px 1fr auto",
                gap: 24,
                alignItems: "start",
                padding: "20px 12px",
                borderBottom: `2px solid ${INK}`,
              }}
            >
              <span
                className="bhShape"
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
                <p style={{ fontSize: 14, margin: "8px 0 0", lineHeight: 1.5, maxWidth: 640 }}>{p.blurb}</p>
              </div>
              <span
                className={fontArchivoBlack.className}
                style={{
                  fontSize: 18,
                  background: SHAPE_COLORS[i % SHAPE_COLORS.length],
                  color: SHAPE_COLORS[i % SHAPE_COLORS.length] === YELLOW ? INK : "#fff",
                  padding: "4px 10px",
                  height: "fit-content",
                }}
              >
                {p.year}
              </span>
            </li>
          ))}
        </ul>
      </Section>

      {/* EXPERIENCE */}
      <Section heading="▲ Experience">
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {EXPERIENCE.map((j, i) => (
            <li key={i} style={{ display: "grid", gridTemplateColumns: "200px 1fr", gap: 24, padding: "18px 0", borderTop: `2px solid ${INK}` }}>
              <div>
                <p className={fontArchivoBlack.className} style={{ fontSize: 14, margin: 0, textTransform: "uppercase", letterSpacing: "0.02em", color: [RED, BLUE, INK, YELLOW][i % 4] === YELLOW ? INK : [RED, BLUE, INK, YELLOW][i % 4] }}>{j.period}</p>
                <p style={{ fontSize: 12, margin: "4px 0 0", color: "#666" }}>{j.location}</p>
              </div>
              <div>
                <p className={fontArchivoBlack.className} style={{ fontSize: "clamp(18px, 2vw, 24px)", margin: 0, textTransform: "uppercase", letterSpacing: "-0.02em" }}>
                  {j.title} <span style={{ color: RED }}>—</span> {j.company}
                </p>
                <p style={{ fontSize: 14, margin: "8px 0 0", lineHeight: 1.55, maxWidth: 720 }}>{j.blurb}</p>
              </div>
            </li>
          ))}
          <li style={{ borderTop: `2px solid ${INK}` }} />
        </ul>
      </Section>

      {/* SKILLS */}
      <Section heading="■ Toolkit">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 16 }}>
          {SKILLS.map((g, i) => {
            const c = [RED, BLUE, YELLOW, INK][i % 4];
            return (
              <div
                key={g.label}
                className="bhBlock"
                style={{
                  padding: 16,
                  background: c,
                  color: c === YELLOW ? INK : "#fff",
                }}
              >
                <p className={fontArchivoBlack.className} style={{ fontSize: 14, margin: "0 0 12px", textTransform: "uppercase", letterSpacing: "0.05em" }}>{g.label}</p>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {g.items.map((s) => (
                    <li key={s} style={{ fontSize: 13, padding: "3px 0", borderBottom: c === YELLOW ? "1px solid #1a1a1a30" : "1px solid #ffffff30" }}>{s}</li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      </Section>

      {/* ABOUT + EDU + LANG */}
      <Section heading="◆ About">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "6vw" }}>
          <div>
            <div className="bhBlock" style={{ width: "100%", maxWidth: 200, aspectRatio: "1", background: BLUE }} />
            <p className={fontArchivoBlack.className} style={{ fontSize: 12, margin: "16px 0 8px", textTransform: "uppercase", color: RED }}>Languages</p>
            {LANGUAGES.map((l) => (
              <p key={l.lang} style={{ fontSize: 14, margin: "2px 0" }}>
                <strong>{l.lang}</strong> — {l.level}
              </p>
            ))}
          </div>
          <div>
            <p style={{ fontSize: 18, lineHeight: 1.6, margin: "0 0 24px" }}>{ME.about}</p>
            <p className={fontArchivoBlack.className} style={{ fontSize: 12, margin: "0 0 8px", textTransform: "uppercase", color: RED }}>Education</p>
            {EDUCATION.map((e) => (
              <div key={e.title} style={{ borderTop: `1px solid ${INK}`, padding: "12px 0" }}>
                <p style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>{e.title}</p>
                <p style={{ fontSize: 13, color: "#666", margin: "4px 0" }}>{e.school} · {e.period}</p>
                <p style={{ fontSize: 14, margin: 0 }}>{e.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      {/* CONTACT */}
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
        <div style={{ marginTop: 24, fontSize: 14, display: "flex", gap: 16, flexWrap: "wrap" }}>
          <a href={ME.socials.github} style={{ color: YELLOW }}>github</a>
          <a href={ME.socials.linkedin} style={{ color: YELLOW }}>linkedin</a>
          <span style={{ color: "#888" }}>{ME.phone}</span>
        </div>
      </section>
    </main>
  );
}

function Section({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: "8vh" }}>
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
        {heading}
      </h2>
      {children}
    </section>
  );
}
