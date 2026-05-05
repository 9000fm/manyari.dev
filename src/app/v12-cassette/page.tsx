import Link from "next/link";
import type { Metadata } from "next";
import { ME, PROJECTS } from "@/content";
import { fontMajorMono, fontIBMPlexMono } from "@/fonts";

export const metadata: Metadata = { title: `${ME.name} — FM-2087` };

const BG = "#0a0700";
const AMBER = "#FFB000";
const DIM = "#7a5400";

export default function CassettePage() {
  return (
    <main
      className={fontIBMPlexMono.className}
      style={{
        background: BG,
        color: AMBER,
        minHeight: "100vh",
        padding: "24px 4vw 64px",
        fontSize: 14,
        lineHeight: 1.6,
        position: "relative",
      }}
    >
      <style>{`
        @keyframes flicker { 0%, 97%, 100% { opacity: 1; } 98% { opacity: 0.85; } }
        @keyframes blink { 0%, 49% { opacity: 1; } 50%, 100% { opacity: 0; } }
        .flicker { animation: flicker 4s infinite; }
        .blink { animation: blink 1.1s step-end infinite; }
        .scan::before {
          content: "";
          position: fixed; inset: 0;
          background: repeating-linear-gradient(0deg, rgba(0,0,0,0.18) 0 1px, transparent 1px 4px);
          pointer-events: none; z-index: 999;
        }
        .glow {
          text-shadow: 0 0 6px rgba(255,176,0,0.55), 0 0 14px rgba(255,176,0,0.35);
        }
      `}</style>
      <div className="scan" />

      <Link href="/" style={{ color: DIM, textDecoration: "none", fontSize: 12 }}>
        ← all variants
      </Link>

      <div className="flicker" style={{ maxWidth: 760, margin: "16px auto 0" }}>
        {/* Hero panel */}
        <pre
          className={`${fontIBMPlexMono.className} glow`}
          style={{ margin: 0, fontSize: 13, lineHeight: 1.2, color: AMBER, whiteSpace: "pre" }}
        >{`╔══════════════════════════════════════════╗
║   F M - 2 0 8 7   //   PERSONNEL FILE    ║
╠══════════════════════════════════════════╣`}</pre>
        <pre
          className={`${fontMajorMono.className} glow`}
          style={{
            margin: 0,
            fontSize: "clamp(28px, 7vw, 72px)",
            lineHeight: 1,
            color: AMBER,
            whiteSpace: "pre",
            paddingTop: 8,
          }}
        >{`  flavio
  manyari`}</pre>
        <pre
          className={`${fontIBMPlexMono.className} glow`}
          style={{ margin: "8px 0 0", fontSize: 13, lineHeight: 1.5, color: AMBER, whiteSpace: "pre" }}
        >{`  ROLE  : ${ME.role}
  ORIGIN: ${ME.location}
  STATUS: ${'>'} AVAILABLE FOR CONTRACT
╚══════════════════════════════════════════╝`}</pre>

        {/* Mission log / about */}
        <pre
          className="glow"
          style={{ margin: "32px 0 8px", fontSize: 13, color: AMBER, whiteSpace: "pre" }}
        >{`╔═ MISSION LOG ═══════════════════════════╗`}</pre>
        <p className="glow" style={{ margin: 0, padding: "0 12px", color: AMBER, lineHeight: 1.7 }}>
          {ME.about}
        </p>
        <pre
          className="glow"
          style={{ margin: "8px 0 0", fontSize: 13, color: AMBER, whiteSpace: "pre" }}
        >{`╚═════════════════════════════════════════╝`}</pre>

        {/* Archive / projects */}
        <pre
          className="glow"
          style={{ margin: "32px 0 8px", fontSize: 13, color: AMBER, whiteSpace: "pre" }}
        >{`╔═ ARCHIVE ═══════════════════════════════╗
║ ID   TITLE                          YEAR ║
╟──────────────────────────────────────────╢`}</pre>
        <div style={{ paddingLeft: 12, paddingRight: 12 }}>
          {PROJECTS.map((p, i) => {
            const id = String(i + 1).padStart(2, "0");
            const titleEl = p.url ? (
              <a
                href={p.url}
                target="_blank"
                rel="noopener noreferrer"
                className="glow"
                style={{ color: AMBER, textDecoration: "underline" }}
              >
                {p.title}
              </a>
            ) : (
              <span className="glow" style={{ color: AMBER }}>{p.title}</span>
            );
            return (
              <div key={p.slug} style={{ display: "flex", gap: 12, padding: "4px 0", alignItems: "baseline" }}>
                <span style={{ color: DIM, minWidth: 32 }}>[{id}]</span>
                <span style={{ flex: 1 }}>{titleEl}<span style={{ color: DIM }}> — {p.role}</span></span>
                <span style={{ color: DIM }}>{p.year}</span>
              </div>
            );
          })}
        </div>
        <pre
          className="glow"
          style={{ margin: "8px 0 0", fontSize: 13, color: AMBER, whiteSpace: "pre" }}
        >{`╚══════════════════════════════════════════╝`}</pre>

        {/* Comms */}
        <pre
          className="glow"
          style={{ margin: "32px 0 8px", fontSize: 13, color: AMBER, whiteSpace: "pre" }}
        >{`╔═ COMMS ═════════════════════════════════╗`}</pre>
        <div style={{ paddingLeft: 12, paddingRight: 12, lineHeight: 1.8 }}>
          <p className="glow" style={{ margin: 0 }}>
            CHANNEL.MAIL ▸{" "}
            <a href={`mailto:${ME.email}`} style={{ color: AMBER, textDecoration: "underline" }}>
              {ME.email}
            </a>
          </p>
          <p className="glow" style={{ margin: 0 }}>
            CHANNEL.GIT  ▸{" "}
            <a href={ME.socials.github} style={{ color: AMBER, textDecoration: "underline" }}>
              github.com/9000fm
            </a>
          </p>
          <p className="glow" style={{ margin: 0 }}>
            CHANNEL.LINK ▸{" "}
            <a href={ME.socials.linkedin} style={{ color: AMBER, textDecoration: "underline" }}>
              linkedin
            </a>
          </p>
        </div>
        <pre
          className="glow"
          style={{ margin: "8px 0 0", fontSize: 13, color: AMBER, whiteSpace: "pre" }}
        >{`╚═════════════════════════════════════════╝`}</pre>

        <p style={{ marginTop: 32, color: DIM, fontSize: 12 }}>
          {'>'} END.OF.FILE
          <span className="blink" style={{ display: "inline-block", marginLeft: 6, width: 8, height: 14, background: AMBER, verticalAlign: "middle" }} />
        </p>
      </div>
    </main>
  );
}
