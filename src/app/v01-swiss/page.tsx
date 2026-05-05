import Link from "next/link";
import type { Metadata } from "next";
import { ME, PROJECTS, EXPERIENCE, SKILLS, EDUCATION, SERVICES, LANGUAGES } from "@/content";
import { fontInterTight } from "@/fonts";

export const metadata: Metadata = { title: `${ME.name} — Swiss Editorial` };

const ACCENT = "#E63946";
const RULE = "1px solid #0a0a0a";

export default function SwissPage() {
  return (
    <main
      className={fontInterTight.className}
      style={{
        background: "#fff",
        color: "#0a0a0a",
        minHeight: "100vh",
        padding: "32px 6vw 64px",
        position: "relative",
      }}
    >
      <style>{`
        @keyframes swissMarquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .swissMarquee { display: inline-flex; gap: 48px; animation: swissMarquee 40s linear infinite; will-change: transform; }
        .swissMarquee:hover { animation-play-state: paused; }
        .swissProj { transition: padding-left .25s ease, color .25s ease; position: relative; }
        .swissProj::before {
          content: "→"; position: absolute; left: -24px; opacity: 0;
          transition: opacity .25s ease, transform .25s ease;
          color: ${ACCENT}; transform: translateX(-8px);
        }
        .swissProj:hover { padding-left: 12px; }
        .swissProj:hover::before { opacity: 1; transform: translateX(0); }
        .swissReveal {
          opacity: 0; transform: translateY(12px);
          animation: swissReveal .9s cubic-bezier(.2,.8,.2,1) forwards;
        }
        @keyframes swissReveal { to { opacity: 1; transform: none; } }
      `}</style>

      <BackLink />

      {/* HERO */}
      <header
        style={{
          borderTop: RULE,
          paddingTop: 24,
          marginTop: 24,
          marginBottom: "10vh",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "8vh" }}>
          <span>{ME.location}</span>
          <span style={{ color: ACCENT }}>● {ME.available}</span>
        </div>
        <h1
          className="swissReveal"
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
        <p className="swissReveal" style={{ animationDelay: ".15s", fontSize: "clamp(18px, 2vw, 26px)", margin: "32px 0 0", maxWidth: 600, lineHeight: 1.4 }}>
          <span style={{ color: ACCENT }}>—</span> {ME.role}.
        </p>
      </header>

      {/* SERVICES MARQUEE */}
      <section
        style={{
          borderTop: RULE,
          borderBottom: RULE,
          padding: "16px 0",
          marginBottom: "10vh",
          overflow: "hidden",
        }}
      >
        <div style={{ overflow: "hidden", whiteSpace: "nowrap" }}>
          <div className="swissMarquee" style={{ fontSize: "clamp(18px, 2.6vw, 32px)", fontWeight: 500, letterSpacing: "-0.02em" }}>
            {[...Array(2)].flatMap((_, i) =>
              SERVICES.map((s) => (
                <span key={`${i}-${s}`} style={{ display: "inline-flex", alignItems: "center", gap: 48 }}>
                  {s}
                  <span style={{ color: ACCENT }}>✦</span>
                </span>
              ))
            )}
          </div>
        </div>
      </section>

      {/* WORK */}
      <Section label="01 — Selected Work">
        <ol style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {PROJECTS.map((p, i) => (
            <li
              key={p.slug}
              className="swissProj"
              style={{
                borderTop: RULE,
                padding: "24px 0",
                display: "grid",
                gridTemplateColumns: "44px 1fr auto",
                gap: 24,
                alignItems: "baseline",
              }}
            >
              <span style={{ fontSize: 13, color: "#888" }}>0{i + 1}</span>
              <div>
                {p.url ? (
                  <a href={p.url} target="_blank" rel="noopener noreferrer" style={{ color: "inherit", textDecoration: "none" }}>
                    <span style={{ fontSize: "clamp(20px, 2.6vw, 36px)", fontWeight: 500, letterSpacing: "-0.02em" }}>{p.title}</span>
                  </a>
                ) : (
                  <span style={{ fontSize: "clamp(20px, 2.6vw, 36px)", fontWeight: 500, letterSpacing: "-0.02em" }}>{p.title}</span>
                )}
                <p style={{ fontSize: 13, color: "#666", margin: "6px 0 0" }}>{p.role}</p>
                <p style={{ fontSize: 14, color: "#333", margin: "10px 0 0", maxWidth: 640, lineHeight: 1.5 }}>{p.blurb}</p>
              </div>
              <span style={{ fontSize: 14, color: "#888" }}>{p.year}</span>
            </li>
          ))}
          <li style={{ borderTop: RULE }} />
        </ol>
      </Section>

      {/* EXPERIENCE */}
      <Section label="02 — Experience">
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {EXPERIENCE.map((j, i) => (
            <li key={i} style={{ borderTop: RULE, padding: "20px 0", display: "grid", gridTemplateColumns: "180px 1fr", gap: 24 }}>
              <div style={{ fontSize: 13, color: "#666", letterSpacing: "0.02em" }}>{j.period}</div>
              <div>
                <p style={{ fontSize: "clamp(17px, 1.8vw, 22px)", margin: 0, fontWeight: 500, letterSpacing: "-0.01em" }}>
                  {j.title} <span style={{ color: ACCENT }}>—</span> {j.company}
                </p>
                <p style={{ fontSize: 12, color: "#888", margin: "4px 0 8px", letterSpacing: "0.02em" }}>{j.location}</p>
                <p style={{ fontSize: 14, color: "#333", margin: 0, lineHeight: 1.55, maxWidth: 720 }}>{j.blurb}</p>
              </div>
            </li>
          ))}
          <li style={{ borderTop: RULE }} />
        </ul>
      </Section>

      {/* SKILLS */}
      <Section label="03 — Toolkit">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "32px 48px" }}>
          {SKILLS.map((g) => (
            <div key={g.label}>
              <p style={{ fontSize: 12, color: ACCENT, letterSpacing: "0.12em", textTransform: "uppercase", margin: "0 0 12px", fontWeight: 500 }}>{g.label}</p>
              <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                {g.items.map((s) => (
                  <li key={s} style={{ fontSize: 15, padding: "4px 0", borderBottom: "1px dotted #ccc" }}>{s}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      {/* EDUCATION + LANGUAGES */}
      <Section label="04 — Background">
        <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "6vw" }}>
          <div>
            {EDUCATION.map((e) => (
              <div key={e.title} style={{ borderTop: RULE, padding: "16px 0" }}>
                <p style={{ fontSize: 18, fontWeight: 500, margin: 0, letterSpacing: "-0.01em" }}>{e.title}</p>
                <p style={{ fontSize: 13, color: "#666", margin: "4px 0" }}>{e.school} · {e.period}</p>
                <p style={{ fontSize: 14, color: "#333", margin: "6px 0 0", maxWidth: 580 }}>{e.detail}</p>
              </div>
            ))}
            <div style={{ borderTop: RULE }} />
          </div>
          <aside>
            <p style={{ fontSize: 12, color: ACCENT, letterSpacing: "0.12em", textTransform: "uppercase", margin: "0 0 12px", fontWeight: 500 }}>Languages</p>
            {LANGUAGES.map((l) => (
              <p key={l.lang} style={{ fontSize: 16, margin: "4px 0", display: "flex", justifyContent: "space-between", maxWidth: 220, borderBottom: "1px dotted #ccc", padding: "4px 0" }}>
                <span>{l.lang}</span>
                <span style={{ color: "#666" }}>{l.level}</span>
              </p>
            ))}
          </aside>
        </div>
      </Section>

      {/* ABOUT */}
      <Section label="05 — About">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: "8vw" }}>
          <div />
          <p style={{ fontSize: "clamp(17px, 1.6vw, 22px)", lineHeight: 1.5, margin: 0, maxWidth: 640 }}>{ME.about}</p>
        </div>
      </Section>

      {/* CONTACT */}
      <section style={{ borderTop: RULE, paddingTop: 24, paddingBottom: 48 }}>
        <h2 style={{ fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", margin: "0 0 24px", fontWeight: 500 }}>06 — Contact</h2>
        <a href={`mailto:${ME.email}`} style={{ fontSize: "clamp(28px, 4vw, 56px)", color: ACCENT, textDecoration: "none", letterSpacing: "-0.02em", fontWeight: 500 }}>
          {ME.email} →
        </a>
        <div style={{ marginTop: 24, display: "flex", gap: 24, fontSize: 14, flexWrap: "wrap" }}>
          <a href={ME.socials.github} style={{ color: "#0a0a0a" }}>GitHub ↗</a>
          <a href={ME.socials.linkedin} style={{ color: "#0a0a0a" }}>LinkedIn ↗</a>
          <span style={{ color: "#888" }}>{ME.phone}</span>
        </div>
      </section>
    </main>
  );
}

function Section({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <section style={{ marginBottom: "10vh", borderTop: RULE, paddingTop: 24 }}>
      <h2 style={{ fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", margin: "0 0 32px", fontWeight: 500 }}>{label}</h2>
      {children}
    </section>
  );
}

function BackLink() {
  return (
    <Link href="/" style={{ fontSize: 12, color: "#888", textDecoration: "none", letterSpacing: "0.08em", textTransform: "uppercase" }}>
      ← All variants
    </Link>
  );
}
