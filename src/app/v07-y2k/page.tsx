import Link from "next/link";
import type { Metadata } from "next";
import { ME, PROJECTS, EXPERIENCE, SKILLS, EDUCATION, LANGUAGES, SERVICES } from "@/content";
import { fontAudiowide, fontInter } from "@/fonts";

export const metadata: Metadata = { title: `${ME.name} — Y2K` };

const BLUE = "#1E40FF";
const PINK = "#FF66E0";

export default function Y2KPage() {
  const visits = 1024 + Math.floor((Date.now() / 1000 / 60 / 30) % 9999);
  return (
    <main
      className={fontInter.className}
      style={{
        background:
          "radial-gradient(circle at 20% 10%, #b6c8ff 0%, transparent 40%), radial-gradient(circle at 80% 90%, #ffd1f2 0%, transparent 40%), linear-gradient(180deg, #c9d6ff 0%, #e2c4ff 100%)",
        minHeight: "100vh",
        padding: "32px 4vw 64px",
        color: "#0a0a3a",
        position: "relative",
        overflow: "hidden",
      }}
    >
      <style>{`
        @keyframes y2kSparkleA { 0%, 100% { opacity: .3; transform: scale(.6); } 50% { opacity: 1; transform: scale(1); } }
        @keyframes y2kSparkleB { 0%, 100% { opacity: 1; transform: scale(1); } 50% { opacity: .3; transform: scale(.6); } }
        .y2kSparkle { position: absolute; pointer-events: none; font-size: 22px; }
        .y2kS1 { animation: y2kSparkleA 2.4s ease-in-out infinite; }
        .y2kS2 { animation: y2kSparkleB 2.8s ease-in-out infinite; }
        @keyframes y2kHueShift { 0% { filter: hue-rotate(0deg); } 100% { filter: hue-rotate(360deg); } }
        .y2kCycle { animation: y2kHueShift 8s linear infinite; }
        @keyframes y2kMarq { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .y2kMarq { display: inline-flex; gap: 32px; animation: y2kMarq 35s linear infinite; will-change: transform; }
        .y2kCard { transition: transform .25s ease, box-shadow .25s ease; }
        .y2kCard:hover { transform: translateY(-4px) rotate(-.5deg); box-shadow: 0 10px 0 rgba(30,64,255,0.35), inset 0 2px 0 rgba(255,255,255,0.6); }
        @keyframes y2kBlink { 0%, 70% { opacity: 1; } 71%, 100% { opacity: 0; } }
        .y2kBlink { animation: y2kBlink 1s step-end infinite; }
      `}</style>

      {/* Sparkles */}
      <span className="y2kSparkle y2kS1" style={{ top: "8%",  left: "8%",  color: PINK }}>✦</span>
      <span className="y2kSparkle y2kS2" style={{ top: "16%", right: "12%", color: BLUE }}>★</span>
      <span className="y2kSparkle y2kS1" style={{ top: "60%", left: "4%", color: BLUE }}>✧</span>
      <span className="y2kSparkle y2kS2" style={{ bottom: "10%", right: "8%", color: PINK }}>✦</span>

      <Link href="/" style={{ fontSize: 12, color: BLUE, textDecoration: "underline" }}>
        ← all variants
      </Link>

      {/* HERO */}
      <div style={{ maxWidth: 880, margin: "16px auto 0", textAlign: "center" }}>
        <p
          style={{
            fontSize: 13,
            margin: "0 0 8px",
            letterSpacing: "0.2em",
            color: PINK,
            textShadow: "1px 1px 0 #fff",
          }}
        >
          ★ ✧ ☆ ✦ welcome 2 the homepage ✦ ☆ ✧ ★
        </p>
        <h1
          className={`${fontAudiowide.className} y2kCycle`}
          style={{
            fontSize: "clamp(48px, 13vw, 160px)",
            margin: 0,
            background: "linear-gradient(180deg, #fff 0%, #cce0ff 40%, #1E40FF 60%, #4080ff 80%, #ffffff 100%)",
            WebkitBackgroundClip: "text",
            backgroundClip: "text",
            color: "transparent",
            textShadow: "0 4px 0 rgba(0,0,0,0.15)",
            lineHeight: 0.95,
            letterSpacing: "0.02em",
          }}
        >
          FLAVIO.MZ
        </h1>
        <p
          className={fontAudiowide.className}
          style={{
            fontSize: "clamp(14px, 2vw, 22px)",
            margin: "8px 0 0",
            color: BLUE,
            textShadow: "0 1px 0 #fff",
          }}
        >
          ✧ {ME.role} ✧
        </p>
        <p style={{ fontSize: 12, color: PINK, margin: "12px 0 0", letterSpacing: "0.2em" }}>
          ─=≡Σ((( ⊃ {ME.location} ⊂  •  best viewed @ 1024×768
        </p>

        {/* visitor counter + nav */}
        <div style={{ marginTop: 24, display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
          <span
            className={fontAudiowide.className}
            style={{
              padding: "6px 12px",
              background: "#000",
              color: "#33FF33",
              fontFamily: "monospace",
              border: "2px solid #1E40FF",
              fontSize: 14,
              letterSpacing: "0.1em",
            }}
          >
            👁 visits: {visits.toString().padStart(7, "0")}
          </span>
          {["work", "experience", "tools", "about", "contact"].map((label) => (
            <a
              key={label}
              href={`#${label}`}
              className={fontAudiowide.className}
              style={{
                padding: "10px 18px",
                borderRadius: 999,
                background: "linear-gradient(180deg, #ffffff 0%, #e0eaff 50%, #1E40FF 100%)",
                color: "#fff",
                textDecoration: "none",
                fontSize: 12,
                border: "2px solid #1E40FF",
                boxShadow: "0 4px 0 rgba(30,64,255,0.3), inset 0 2px 0 rgba(255,255,255,0.5)",
                textShadow: "1px 1px 0 rgba(0,0,0,0.3)",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              ▸ {label}
            </a>
          ))}
        </div>
      </div>

      {/* SERVICES MARQUEE */}
      <section style={{ maxWidth: 1000, margin: "48px auto 0", overflow: "hidden", background: "rgba(255,255,255,0.5)", border: "2px solid #1E40FF", borderRadius: 999, padding: "10px 0" }}>
        <div className={`y2kMarq ${fontAudiowide.className}`} style={{ fontSize: 16, color: BLUE, paddingLeft: 32, whiteSpace: "nowrap" }}>
          {[...Array(2)].flatMap((_, i) => SERVICES.map((s) => (
            <span key={`${i}-${s}`}>★ {s} ★</span>
          )))}
        </div>
      </section>

      {/* WORK */}
      <Section id="work" title="✦ ─── my werk ─── ✦">
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 14 }}>
          {PROJECTS.map((p) => {
            const inner = (
              <div
                className="y2kCard"
                style={{
                  padding: "18px 22px",
                  background: "linear-gradient(180deg, rgba(255,255,255,0.92) 0%, rgba(220,230,255,0.7) 100%)",
                  border: "2px solid #1E40FF",
                  borderRadius: 16,
                  boxShadow: "0 4px 0 rgba(30,64,255,0.2), inset 0 2px 0 rgba(255,255,255,0.6)",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12, flexWrap: "wrap" }}>
                  <div>
                    <span className={fontAudiowide.className} style={{ fontSize: "clamp(18px, 2.4vw, 24px)", color: BLUE }}>
                      ★ {p.title}
                    </span>
                    <p style={{ fontSize: 13, margin: "4px 0 0", color: "#0a0a3a" }}>{p.role}</p>
                  </div>
                  <span className={fontAudiowide.className} style={{ fontSize: 18, color: PINK }}>{p.year}</span>
                </div>
                <p style={{ fontSize: 13, margin: "10px 0 0", lineHeight: 1.5, color: "#1a1a3a" }}>{p.blurb}</p>
              </div>
            );
            return (
              <li key={p.slug}>
                {p.url ? (
                  <a href={p.url} target="_blank" rel="noopener noreferrer" style={{ color: "inherit", textDecoration: "none" }}>
                    {inner}
                  </a>
                ) : (
                  inner
                )}
              </li>
            );
          })}
        </ul>
      </Section>

      {/* EXPERIENCE */}
      <Section id="experience" title="✧ ── work history ── ✧">
        <ol style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 12 }}>
          {EXPERIENCE.map((j, i) => (
            <li key={i} className="y2kCard" style={{ padding: "16px 20px", background: "rgba(255,255,255,0.85)", border: `2px solid ${PINK}`, borderRadius: 14 }}>
              <p className={fontAudiowide.className} style={{ fontSize: 16, color: BLUE, margin: 0 }}>★ {j.title}</p>
              <p style={{ fontSize: 12, margin: "4px 0", color: PINK, letterSpacing: "0.05em" }}>{j.company} · {j.period} · {j.location}</p>
              <p style={{ fontSize: 13, margin: "6px 0 0", lineHeight: 1.5 }}>{j.blurb}</p>
            </li>
          ))}
        </ol>
      </Section>

      {/* SKILLS */}
      <Section id="tools" title="☆ ── my toolkit ── ☆">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 14 }}>
          {SKILLS.map((g) => (
            <div key={g.label} className="y2kCard" style={{ padding: 16, background: "rgba(255,255,255,0.85)", border: `2px solid ${BLUE}`, borderRadius: 14 }}>
              <p className={fontAudiowide.className} style={{ fontSize: 14, color: PINK, margin: "0 0 10px", letterSpacing: "0.1em", textTransform: "uppercase" }}>★ {g.label}</p>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", gap: 6, flexWrap: "wrap" }}>
                {g.items.map((s) => (
                  <li key={s} style={{ fontSize: 12, padding: "3px 8px", background: "linear-gradient(180deg, #fff 0%, #e0eaff 100%)", border: `1px solid ${BLUE}`, borderRadius: 999, color: BLUE }}>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </Section>

      {/* ABOUT + EDU */}
      <section
        id="about"
        style={{
          maxWidth: 720,
          margin: "48px auto 0",
          padding: "24px",
          background: "rgba(255,255,255,0.85)",
          border: "2px dashed #FF66E0",
          borderRadius: 16,
        }}
      >
        <h2 className={fontAudiowide.className} style={{ fontSize: 22, margin: "0 0 12px", color: PINK, letterSpacing: "0.1em" }}>
          ☆ about me ☆
        </h2>
        <p style={{ fontSize: 16, lineHeight: 1.6, margin: "0 0 20px" }}>{ME.about}</p>
        <p className={fontAudiowide.className} style={{ fontSize: 14, color: BLUE, margin: "0 0 8px" }}>★ school</p>
        {EDUCATION.map((e) => (
          <p key={e.title} style={{ fontSize: 13, margin: "0 0 6px" }}>
            <strong>{e.title}</strong> — {e.school}, {e.period}
          </p>
        ))}
        <p className={fontAudiowide.className} style={{ fontSize: 14, color: BLUE, margin: "16px 0 8px" }}>★ languages</p>
        <p style={{ fontSize: 13, margin: 0 }}>{LANGUAGES.map((l) => `${l.lang} (${l.level})`).join(" · ")}</p>
      </section>

      {/* CONTACT */}
      <section id="contact" style={{ maxWidth: 720, margin: "48px auto 0", textAlign: "center" }}>
        <h2 className={fontAudiowide.className} style={{ fontSize: 22, margin: "0 0 16px", color: BLUE, letterSpacing: "0.1em" }}>
          ✧ sign my guestbook ✧
        </h2>
        <a
          href={`mailto:${ME.email}`}
          className={`${fontAudiowide.className} y2kCycle`}
          style={{
            display: "inline-block",
            padding: "16px 32px",
            background: "linear-gradient(180deg, #fff 0%, #ffd1f2 50%, #FF66E0 100%)",
            border: "3px solid #FF66E0",
            borderRadius: 999,
            color: "#fff",
            textDecoration: "none",
            fontSize: "clamp(18px, 3vw, 28px)",
            textShadow: "1px 1px 0 rgba(0,0,0,0.4)",
            boxShadow: "0 6px 0 rgba(255,102,224,0.3), inset 0 3px 0 rgba(255,255,255,0.6)",
            letterSpacing: "0.1em",
          }}
        >
          ♥ {ME.email} ♥<span className="y2kBlink">_</span>
        </a>
        <p style={{ marginTop: 24, fontSize: 13 }}>
          <a href={ME.socials.github} style={{ color: BLUE }}>★ github</a> · <a href={ME.socials.linkedin} style={{ color: BLUE }}>★ linkedin</a> · <span style={{ color: PINK }}>{ME.phone}</span>
        </p>
        <p style={{ marginTop: 32, fontSize: 11, color: PINK, letterSpacing: "0.2em" }}>
          ✦ © {new Date().getFullYear()} ✦ made with ♥ ✦
        </p>
      </section>
    </main>
  );
}

function Section({ id, title, children }: { id: string; title: string; children: React.ReactNode }) {
  return (
    <section id={id} style={{ maxWidth: 760, margin: "64px auto 0" }}>
      <h2
        className={fontAudiowide.className}
        style={{
          fontSize: 24,
          margin: "0 0 20px",
          color: PINK,
          textAlign: "center",
          textShadow: "1px 1px 0 #fff",
          letterSpacing: "0.15em",
        }}
      >
        {title}
      </h2>
      {children}
    </section>
  );
}
