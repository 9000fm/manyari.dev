import Link from "next/link";
import type { Metadata } from "next";
import { ME, PROJECTS } from "@/content";
import { fontPlayfair, fontPTSerif } from "@/fonts";

export const metadata: Metadata = { title: `${ME.name} — The Manyari Times` };

const NEWSPRINT = "#F5F1E8";
const INK = "#1a1a1a";

export default function NewspaperPage() {
  const today = new Date().toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  return (
    <main
      className={fontPTSerif.className}
      style={{
        background: NEWSPRINT,
        color: INK,
        minHeight: "100vh",
        padding: "32px 6vw 64px",
      }}
    >
      <Link href="/" style={{ fontSize: 12, color: INK, textDecoration: "none", fontStyle: "italic" }}>
        ← all variants
      </Link>

      <header
        style={{
          borderTop: `4px double ${INK}`,
          borderBottom: `4px double ${INK}`,
          padding: "16px 0",
          margin: "24px 0 32px",
          textAlign: "center",
        }}
      >
        <p style={{ fontSize: 11, letterSpacing: "0.4em", margin: "0 0 8px", textTransform: "uppercase" }}>
          Vol. I · No. 1 · {today} · Lima Edition
        </p>
        <h1
          className={fontPlayfair.className}
          style={{
            fontSize: "clamp(48px, 11vw, 140px)",
            fontWeight: 900,
            margin: 0,
            letterSpacing: "-0.02em",
            lineHeight: 1,
          }}
        >
          The Manyari Times
        </h1>
        <p style={{ fontSize: 12, fontStyle: "italic", margin: "12px 0 0", letterSpacing: "0.05em" }}>
          “All the work that's fit to ship.”
        </p>
      </header>

      <section
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: "4vw",
          borderBottom: `1px solid ${INK}`,
          paddingBottom: 32,
          marginBottom: 32,
        }}
      >
        <div>
          <p style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", margin: "0 0 8px" }}>Front Page · Lead Story</p>
          <h2 className={fontPlayfair.className} style={{ fontSize: "clamp(28px, 4.5vw, 56px)", fontWeight: 900, margin: "0 0 12px", lineHeight: 1.05, letterSpacing: "-0.01em" }}>
            Lima-Based Designer Available For Commercial Work
          </h2>
          <p style={{ fontSize: 13, fontStyle: "italic", margin: "0 0 16px", color: "#555" }}>
            By Staff · {ME.location}
          </p>
          <p style={{ fontSize: 17, lineHeight: 1.6, margin: 0, columnCount: 2, columnGap: 32 }}>
            <span style={{ fontFamily: "inherit", fontSize: 48, lineHeight: 0.8, float: "left", paddingRight: 6, paddingTop: 4 }} className={fontPlayfair.className}>F</span>
            {ME.about}
          </p>
        </div>
        <aside style={{ borderLeft: `1px solid ${INK}`, paddingLeft: "2vw" }}>
          <p style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", margin: "0 0 8px" }}>The Editor</p>
          <p className={fontPlayfair.className} style={{ fontSize: 32, fontWeight: 900, margin: 0, lineHeight: 1, letterSpacing: "-0.01em" }}>
            {ME.name}
          </p>
          <p style={{ fontSize: 13, fontStyle: "italic", margin: "8px 0 16px" }}>{ME.role}</p>
          <hr style={{ border: 0, borderTop: `1px solid ${INK}`, margin: "12px 0" }} />
          <p style={{ fontSize: 12, lineHeight: 1.5, margin: 0 }}>
            Subscriptions: <a href={`mailto:${ME.email}`} style={{ color: INK }}>{ME.email}</a>
          </p>
          <p style={{ fontSize: 12, lineHeight: 1.5, margin: "8px 0 0" }}>
            <a href={ME.socials.github} style={{ color: INK }}>github</a> · <a href={ME.socials.linkedin} style={{ color: INK }}>linkedin</a>
          </p>
        </aside>
      </section>

      <section style={{ borderBottom: `4px double ${INK}`, paddingBottom: 32, marginBottom: 32 }}>
        <p style={{ fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", margin: "0 0 16px", textAlign: "center" }}>
          ─── Selected Works · The Index ───
        </p>
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 16 }}>
          <thead>
            <tr style={{ borderBottom: `1px solid ${INK}` }}>
              <th style={{ textAlign: "left", padding: "8px 0", fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 700 }}>№</th>
              <th style={{ textAlign: "left", padding: "8px 0", fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 700 }}>Title</th>
              <th style={{ textAlign: "left", padding: "8px 0", fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 700 }}>Section</th>
              <th style={{ textAlign: "right", padding: "8px 0", fontSize: 11, letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 700 }}>Year</th>
            </tr>
          </thead>
          <tbody>
            {PROJECTS.map((p, i) => (
              <tr key={p.slug} style={{ borderBottom: `1px dotted ${INK}` }}>
                <td style={{ padding: "12px 0", fontSize: 14, fontStyle: "italic", color: "#666" }}>{String(i + 1).padStart(2, "0")}</td>
                <td style={{ padding: "12px 0" }}>
                  {p.url ? (
                    <a href={p.url} target="_blank" rel="noopener noreferrer" className={fontPlayfair.className} style={{ fontSize: 22, color: INK, fontWeight: 700 }}>
                      {p.title}
                    </a>
                  ) : (
                    <span className={fontPlayfair.className} style={{ fontSize: 22, fontWeight: 700 }}>{p.title}</span>
                  )}
                </td>
                <td style={{ padding: "12px 0", fontSize: 14, fontStyle: "italic" }}>{p.role}</td>
                <td style={{ padding: "12px 0", fontSize: 14, textAlign: "right" }}>{p.year}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <footer style={{ textAlign: "center", fontSize: 11, letterSpacing: "0.3em", textTransform: "uppercase" }}>
        — printed in lima · all rights reserved · {new Date().getFullYear()} —
      </footer>
    </main>
  );
}
