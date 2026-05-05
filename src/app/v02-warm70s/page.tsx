import Link from "next/link";
import type { Metadata } from "next";
import { ME, PROJECTS } from "@/content";
import { fontFraunces, fontInter } from "@/fonts";

export const metadata: Metadata = { title: `${ME.name} — Warm 70s` };

const CREAM = "#F2EAD3";
const RUST = "#A04F2D";
const INK = "#3A2618";

export default function Warm70sPage() {
  return (
    <main
      className={fontInter.className}
      style={{
        background: CREAM,
        color: INK,
        minHeight: "100vh",
        padding: "48px 6vw",
        backgroundImage:
          "radial-gradient(circle at 20% 30%, rgba(160,79,45,0.06) 0%, transparent 40%), radial-gradient(circle at 80% 70%, rgba(58,38,24,0.04) 0%, transparent 40%)",
      }}
    >
      <Link href="/" style={{ fontSize: 13, color: RUST, textDecoration: "none", fontStyle: "italic" }}>
        ← all variants
      </Link>

      <header style={{ textAlign: "center", marginTop: "8vh", marginBottom: "10vh" }}>
        <p style={{ fontSize: 14, color: RUST, letterSpacing: "0.3em", margin: "0 0 16px", textTransform: "uppercase" }}>
          ✦ {ME.location} · est. 2020 ✦
        </p>
        <h1
          className={fontFraunces.className}
          style={{
            fontSize: "clamp(64px, 16vw, 220px)",
            fontWeight: 900,
            lineHeight: 0.85,
            letterSpacing: "-0.04em",
            margin: 0,
            color: RUST,
          }}
        >
          Flavio
          <br />
          <em style={{ fontStyle: "italic", fontWeight: 400 }}>manyari</em>
        </h1>
        <p className={fontFraunces.className} style={{ fontSize: 22, fontStyle: "italic", margin: "32px 0 0", color: INK }}>
          {ME.role}.
        </p>
      </header>

      <section style={{ maxWidth: 720, margin: "0 auto 12vh" }}>
        <h2 className={fontFraunces.className} style={{ fontSize: 32, fontStyle: "italic", textAlign: "center", margin: "0 0 8px", color: RUST }}>
          selected work,
        </h2>
        <p style={{ textAlign: "center", fontSize: 14, color: INK, opacity: 0.6, margin: "0 0 48px", letterSpacing: "0.1em" }}>
          ✦ ✦ ✦
        </p>
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          {PROJECTS.map((p) => (
            <li
              key={p.slug}
              style={{
                padding: "24px 0",
                borderBottom: `1px dashed ${RUST}`,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                gap: 24,
              }}
            >
              <div>
                {p.url ? (
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={fontFraunces.className}
                    style={{ fontSize: "clamp(22px, 3vw, 36px)", color: INK, textDecoration: "none", fontWeight: 700 }}
                  >
                    {p.title}
                  </a>
                ) : (
                  <span className={fontFraunces.className} style={{ fontSize: "clamp(22px, 3vw, 36px)", fontWeight: 700 }}>
                    {p.title}
                  </span>
                )}
                <p style={{ fontSize: 13, color: INK, opacity: 0.7, margin: "4px 0 0", fontStyle: "italic" }}>{p.role}</p>
              </div>
              <span className={fontFraunces.className} style={{ fontSize: 24, color: RUST, fontStyle: "italic" }}>{p.year}</span>
            </li>
          ))}
        </ul>
      </section>

      <section style={{ maxWidth: 600, margin: "0 auto 12vh", textAlign: "center" }}>
        <h2 className={fontFraunces.className} style={{ fontSize: 28, fontStyle: "italic", color: RUST, margin: "0 0 24px" }}>
          a few words —
        </h2>
        <p style={{ fontSize: 17, lineHeight: 1.7, margin: 0 }}>{ME.about}</p>
      </section>

      <footer style={{ textAlign: "center", paddingBottom: 48, borderTop: `1px solid ${RUST}`, paddingTop: 32, maxWidth: 720, margin: "0 auto" }}>
        <p style={{ fontSize: 13, letterSpacing: "0.2em", color: RUST, margin: "0 0 16px", textTransform: "uppercase" }}>
          ✦ get in touch ✦
        </p>
        <a
          href={`mailto:${ME.email}`}
          className={fontFraunces.className}
          style={{ fontSize: "clamp(28px, 4vw, 48px)", color: INK, textDecoration: "underline", textDecorationStyle: "wavy", textDecorationColor: RUST, textUnderlineOffset: 8 }}
        >
          {ME.email}
        </a>
        <div style={{ marginTop: 24, fontSize: 14, color: INK, opacity: 0.7 }}>
          <a href={ME.socials.github} style={{ color: INK, marginRight: 16 }}>github</a>·
          <a href={ME.socials.linkedin} style={{ color: INK, marginLeft: 16 }}>linkedin</a>
        </div>
      </footer>
    </main>
  );
}
