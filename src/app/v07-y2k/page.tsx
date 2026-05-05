import Link from "next/link";
import type { Metadata } from "next";
import { ME, PROJECTS } from "@/content";
import { fontAudiowide, fontInter } from "@/fonts";

export const metadata: Metadata = { title: `${ME.name} — Y2K` };

const BLUE = "#1E40FF";
const PINK = "#FF66E0";

export default function Y2KPage() {
  return (
    <main
      className={fontInter.className}
      style={{
        background:
          "radial-gradient(circle at 20% 10%, #b6c8ff 0%, transparent 40%), radial-gradient(circle at 80% 90%, #ffd1f2 0%, transparent 40%), linear-gradient(180deg, #c9d6ff 0%, #e2c4ff 100%)",
        minHeight: "100vh",
        padding: "32px 4vw 64px",
        color: "#0a0a3a",
      }}
    >
      <Link href="/" style={{ fontSize: 12, color: BLUE, textDecoration: "underline" }}>
        ← all variants
      </Link>

      <div style={{ maxWidth: 880, margin: "16px auto 0", textAlign: "center" }}>
        <p
          style={{
            fontSize: 14,
            margin: "0 0 8px",
            letterSpacing: "0.2em",
            color: PINK,
            textShadow: "1px 1px 0 #fff",
          }}
        >
          ★ ✧ ☆ ✦ welcome 2 the homepage ✦ ☆ ✧ ★
        </p>
        <h1
          className={fontAudiowide.className}
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
      </div>

      {/* nav bubbles */}
      <nav style={{ maxWidth: 600, margin: "32px auto 0", display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
        {["work", "about", "contact"].map((label) => (
          <a
            key={label}
            href={`#${label}`}
            className={fontAudiowide.className}
            style={{
              padding: "10px 20px",
              borderRadius: 999,
              background: "linear-gradient(180deg, #ffffff 0%, #e0eaff 50%, #1E40FF 100%)",
              color: "#fff",
              textDecoration: "none",
              fontSize: 13,
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
      </nav>

      <section id="work" style={{ maxWidth: 720, margin: "64px auto 0" }}>
        <h2
          className={fontAudiowide.className}
          style={{
            fontSize: 26,
            margin: "0 0 16px",
            color: PINK,
            textAlign: "center",
            textShadow: "1px 1px 0 #fff",
            letterSpacing: "0.15em",
          }}
        >
          ✦ ─── my werk ─── ✦
        </h2>
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "grid", gap: 12 }}>
          {PROJECTS.map((p) => {
            const inner = (
              <div
                style={{
                  padding: "16px 20px",
                  background: "linear-gradient(180deg, rgba(255,255,255,0.85) 0%, rgba(220,230,255,0.6) 100%)",
                  border: "2px solid #1E40FF",
                  borderRadius: 14,
                  boxShadow: "0 4px 0 rgba(30,64,255,0.2), inset 0 2px 0 rgba(255,255,255,0.6)",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "baseline",
                  gap: 12,
                  flexWrap: "wrap" as const,
                }}
              >
                <div>
                  <span className={fontAudiowide.className} style={{ fontSize: "clamp(18px, 2.4vw, 24px)", color: BLUE }}>
                    ★ {p.title}
                  </span>
                  <p style={{ fontSize: 13, margin: "4px 0 0", color: "#0a0a3a" }}>{p.role}</p>
                </div>
                <span className={fontAudiowide.className} style={{ fontSize: 18, color: PINK }}>{p.year}</span>
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
      </section>

      <section
        id="about"
        style={{
          maxWidth: 720,
          margin: "48px auto 0",
          padding: "24px",
          background: "rgba(255,255,255,0.7)",
          border: "2px dashed #FF66E0",
          borderRadius: 16,
        }}
      >
        <h2 className={fontAudiowide.className} style={{ fontSize: 22, margin: "0 0 12px", color: PINK, letterSpacing: "0.1em" }}>
          ☆ about me ☆
        </h2>
        <p style={{ fontSize: 16, lineHeight: 1.6, margin: 0 }}>{ME.about}</p>
      </section>

      <section id="contact" style={{ maxWidth: 720, margin: "48px auto 0", textAlign: "center" }}>
        <h2 className={fontAudiowide.className} style={{ fontSize: 22, margin: "0 0 16px", color: BLUE, letterSpacing: "0.1em" }}>
          ✧ sign my guestbook ✧
        </h2>
        <a
          href={`mailto:${ME.email}`}
          className={fontAudiowide.className}
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
          ♥ {ME.email} ♥
        </a>
        <p style={{ marginTop: 24, fontSize: 13 }}>
          <a href={ME.socials.github} style={{ color: BLUE }}>★ github</a> · <a href={ME.socials.linkedin} style={{ color: BLUE }}>★ linkedin</a>
        </p>
        <p style={{ marginTop: 32, fontSize: 11, color: PINK, letterSpacing: "0.2em" }}>
          ✦ © {new Date().getFullYear()} ✦ made with ♥ ✦
        </p>
      </section>
    </main>
  );
}
