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
        overflowX: "hidden",
      }}
    >
      <style>{`
        /* MARQUEES */
        @keyframes swissMarquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .swissMarquee, .swissTicker { display: inline-flex; gap: 48px; animation: swissMarquee 40s linear infinite; will-change: transform; }
        .swissTicker { animation-duration: 90s; gap: 24px; }
        .swissMarquee:hover { animation-play-state: paused; }

        /* REVEALS */
        @keyframes swissReveal { to { opacity: 1; transform: none; } }
        .swissReveal { opacity: 0; transform: translateY(12px); animation: swissReveal .9s cubic-bezier(.2,.8,.2,1) forwards; }
        @keyframes swissPunch { to { opacity: 1; transform: none; } }
        .swissPunch { opacity: 0; transform: translateX(-20px); animation: swissPunch .8s cubic-bezier(.2,.8,.2,1) forwards; animation-delay: .2s; }

        /* PROJECT ROW HOVER-SPREAD */
        .swissList { position: relative; }
        .swissProj {
          position: relative;
          display: grid;
          grid-template-columns: 44px 1fr auto;
          gap: 24px;
          padding: 24px 0;
          border-top: ${RULE};
          align-items: baseline;
          transition: opacity .35s ease, padding .35s ease, transform .35s ease;
        }
        .swissProj-num,
        .swissProj-body,
        .swissProj-year { position: relative; z-index: 2; transition: transform .35s ease, color .35s ease, font-size .35s ease; }
        .swissProj-slab {
          position: absolute;
          inset: 8px -6vw 8px -6vw;
          background: ${ACCENT};
          transform: scaleX(0);
          transform-origin: left center;
          transition: transform .45s cubic-bezier(.7,.05,.2,1);
          z-index: 1;
          pointer-events: none;
        }
        .swissProj-title {
          font-size: clamp(20px, 2.6vw, 36px);
          font-weight: 500;
          letter-spacing: -0.02em;
          display: inline-block;
          transition: transform .35s ease, color .35s ease;
          color: inherit;
          text-decoration: none;
        }
        .swissProj-role { font-size: 13px; color: #666; margin: 6px 0 0; transition: color .35s ease; }
        .swissProj-blurb { font-size: 14px; color: #333; margin: 10px 0 0; max-width: 640px; line-height: 1.5; transition: color .35s ease; }

        .swissList:hover .swissProj { opacity: 0.28; }
        .swissProj:hover { opacity: 1 !important; padding-left: 24px; padding-right: 24px; }
        .swissProj:hover .swissProj-slab { transform: scaleX(1); }
        .swissProj:hover .swissProj-title { color: #fff; transform: translateX(8px); }
        .swissProj:hover .swissProj-role,
        .swissProj:hover .swissProj-blurb { color: rgba(255,255,255,0.92); }
        .swissProj:hover .swissProj-num { color: rgba(255,255,255,0.7); }
        .swissProj:hover .swissProj-year { color: #fff; font-size: 22px; transform: translateY(-2px); }

        /* CURSOR-FOLLOW PROJECT PILL — pure CSS, anchored bottom-right via :has */
        .swissPillWrap { position: fixed; right: 24px; bottom: 24px; z-index: 50; pointer-events: none; }
        .swissPill {
          opacity: 0;
          transform: translateY(8px);
          transition: opacity .25s ease, transform .25s ease;
          background: #0a0a0a; color: #fff;
          font-size: 12px;
          padding: 8px 12px;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          font-family: ui-monospace, "SF Mono", Menlo, monospace;
          white-space: nowrap;
          max-width: 80vw;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .swissPill[data-pill]:not([data-pill=""]) { opacity: 1; transform: translateY(0); }
        body:has(.swissProj[data-slug="${PROJECTS[0].slug}"]:hover) .swissPill { opacity: 1; transform: translateY(0); }

        ${PROJECTS.map((p) => `
          body:has(.swissProj[data-slug="${p.slug}"]:hover) .swissPill::before {
            content: "→ ${p.title} · ${p.year} · ${p.role.replace(/"/g, '\\"')}";
          }
        `).join("\n")}

        /* DIAGONAL ACCENT SLASH */
        .swissSlash {
          height: 6px;
          background: ${ACCENT};
          margin: 4vh -6vw;
          transform: skewY(-2deg);
        }

        /* SCROLL-TRACK BAR */
        @supports (animation-timeline: scroll()) {
          .swissTrack {
            position: fixed;
            top: 0; right: 0; bottom: 0;
            width: 1px;
            background: rgba(0,0,0,0.08);
            z-index: 5;
            pointer-events: none;
          }
          .swissTrackDot {
            position: fixed;
            right: -3px;
            top: 0;
            width: 7px; height: 7px;
            background: ${ACCENT};
            z-index: 5;
            pointer-events: none;
            animation: swissTrackMove linear forwards;
            animation-timeline: scroll(root);
          }
          @keyframes swissTrackMove { to { transform: translateY(calc(100vh - 7px)); } }
        }

        /* EMAIL ECHO */
        .swissEcho { position: relative; display: inline-block; }
        .swissEcho span {
          position: absolute; left: 0; top: 0;
          color: rgba(230,57,70,0.18);
          pointer-events: none;
          letter-spacing: -0.02em;
          white-space: nowrap;
        }
        .swissEcho span:nth-child(1) { transform: translate(4px, 4px); }
        .swissEcho span:nth-child(2) { transform: translate(8px, 8px); }
        .swissEcho span:nth-child(3) { transform: translate(12px, 12px); color: rgba(230,57,70,0.10); }
      `}</style>

      {/* scroll dot rail */}
      <div className="swissTrack" />
      <div className="swissTrackDot" />

      <Link href="/" style={{ fontSize: 12, color: "#888", textDecoration: "none", letterSpacing: "0.08em", textTransform: "uppercase" }}>
        ← All variants
      </Link>

      {/* HERO */}
      <header
        style={{
          borderTop: RULE,
          paddingTop: 24,
          marginTop: 24,
          marginBottom: "10vh",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "4vh" }}>
          <span>{ME.location}</span>
          <span style={{ color: ACCENT }}>● {ME.available}</span>
        </div>

        {/* Year ticker — slow, mono caps */}
        <div style={{ overflow: "hidden", margin: "0 0 4vh", borderTop: "1px solid #eee", borderBottom: "1px solid #eee", padding: "8px 0" }}>
          <div className="swissTicker" style={{ fontSize: 11, fontFamily: 'ui-monospace, "SF Mono", Menlo, monospace', letterSpacing: "0.2em", color: "#888", whiteSpace: "nowrap" }}>
            {[...Array(2)].flatMap((_, i) =>
              [2020, 2021, 2022, 2023, 2024, 2025].map((y) => (
                <span key={`${i}-${y}`}>● {y} ━━━━━━━</span>
              ))
            )}
          </div>
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

      {/* DIAGONAL SLASH */}
      <div className="swissSlash" />

      {/* SERVICES MARQUEE */}
      <section
        style={{
          borderTop: RULE,
          borderBottom: RULE,
          padding: "16px 0",
          margin: "10vh 0 10vh",
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
        <ol className="swissList" style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {PROJECTS.map((p, i) => (
            <li key={p.slug} className="swissProj" data-slug={p.slug}>
              <div className="swissProj-slab" />
              <span className="swissProj-num" style={{ fontSize: 13, color: "#888" }}>0{i + 1}</span>
              <div className="swissProj-body">
                {p.url ? (
                  <a href={p.url} target="_blank" rel="noopener noreferrer" className="swissProj-title">{p.title}</a>
                ) : (
                  <span className="swissProj-title">{p.title}</span>
                )}
                <p className="swissProj-role">{p.role}</p>
                <p className="swissProj-blurb">{p.blurb}</p>
              </div>
              <span className="swissProj-year" style={{ fontSize: 14, color: "#888" }}>{p.year}</span>
            </li>
          ))}
          <li style={{ borderTop: RULE }} />
        </ol>
      </Section>

      {/* CURSOR-FOLLOW PILL */}
      <div className="swissPillWrap"><div className="swissPill" /></div>

      {/* DIAGONAL SLASH */}
      <div className="swissSlash" />

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

      {/* DIAGONAL SLASH */}
      <div className="swissSlash" />

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
        <span className="swissEcho">
          <span aria-hidden style={{ fontSize: "clamp(28px, 4vw, 56px)", letterSpacing: "-0.02em", fontWeight: 500 }}>{ME.email} →</span>
          <span aria-hidden style={{ fontSize: "clamp(28px, 4vw, 56px)", letterSpacing: "-0.02em", fontWeight: 500 }}>{ME.email} →</span>
          <span aria-hidden style={{ fontSize: "clamp(28px, 4vw, 56px)", letterSpacing: "-0.02em", fontWeight: 500 }}>{ME.email} →</span>
          <a href={`mailto:${ME.email}`} style={{ fontSize: "clamp(28px, 4vw, 56px)", color: ACCENT, textDecoration: "none", letterSpacing: "-0.02em", fontWeight: 500 }}>
            {ME.email} →
          </a>
        </span>
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
      <h2 className="swissPunch" style={{ fontSize: 12, letterSpacing: "0.12em", textTransform: "uppercase", margin: "0 0 32px", fontWeight: 500 }}>{label}</h2>
      {children}
    </section>
  );
}
