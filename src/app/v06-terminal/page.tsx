import Link from "next/link";
import type { Metadata } from "next";
import { ME, PROJECTS } from "@/content";
import { fontJetBrains } from "@/fonts";

export const metadata: Metadata = { title: `${ME.name} — terminal` };

const BG = "#0A0A0A";
const GREEN = "#33FF33";
const DIM = "#1c8e1c";

export default function TerminalPage() {
  return (
    <main
      className={fontJetBrains.className}
      style={{
        background: BG,
        color: GREEN,
        minHeight: "100vh",
        padding: "32px 4vw 64px",
        fontSize: 15,
        lineHeight: 1.6,
        position: "relative",
      }}
    >
      {/* CSS scanlines + cursor blink */}
      <style>{`
        @keyframes blink { 0%, 49% { opacity: 1; } 50%, 100% { opacity: 0; } }
        .blink { animation: blink 1s step-end infinite; }
        .scanlines::before {
          content: "";
          position: fixed; inset: 0;
          background: repeating-linear-gradient(0deg, rgba(0,0,0,0.18) 0 1px, transparent 1px 3px);
          pointer-events: none; z-index: 999;
        }
      `}</style>
      <div className="scanlines" />

      <Link href="/" style={{ color: DIM, textDecoration: "none", fontSize: 13 }}>
        ← all variants
      </Link>

      <div style={{ maxWidth: 760, margin: "32px auto 0" }}>
        <pre style={{ margin: 0, color: GREEN, fontSize: 13, lineHeight: 1.2 }}>{`
 ███████╗███╗   ███╗
 ██╔════╝████╗ ████║
 █████╗  ██╔████╔██║
 ██╔══╝  ██║╚██╔╝██║
 ██║     ██║ ╚═╝ ██║
 ╚═╝     ╚═╝     ╚═╝
`}</pre>

        <p style={{ margin: "16px 0 0" }}>
          <span style={{ color: DIM }}>$</span> whoami
        </p>
        <p style={{ margin: 0, fontSize: "clamp(20px, 3vw, 32px)", color: GREEN }}>
          {ME.name}
        </p>
        <p style={{ margin: "4px 0 0", color: DIM }}>// {ME.role} @ {ME.location}</p>

        <p style={{ margin: "24px 0 0" }}>
          <span style={{ color: DIM }}>$</span> cat about.txt
        </p>
        <p style={{ margin: "4px 0 0", maxWidth: 680 }}>{ME.about}</p>

        <p style={{ margin: "24px 0 0" }}>
          <span style={{ color: DIM }}>$</span> ls -la work/
        </p>
        <pre style={{ margin: "4px 0 0", color: GREEN, fontSize: 14, lineHeight: 1.6 }}>
{PROJECTS.map((p) => {
  const date = `${p.year}-01-01`;
  const name = p.url ? `${p.slug}/  →  ${p.url}` : `${p.slug}/`;
  return `drwxr-xr-x  ${date}  ${name}`;
}).join("\n")}
        </pre>

        <div style={{ marginTop: 12 }}>
          {PROJECTS.map((p, i) => (
            <p key={p.slug} style={{ margin: "6px 0 0" }}>
              <span style={{ color: DIM }}>[0{i + 1}]</span>{" "}
              {p.url ? (
                <a href={p.url} target="_blank" rel="noopener noreferrer" style={{ color: GREEN, textDecoration: "underline" }}>
                  {p.title}
                </a>
              ) : (
                <span>{p.title}</span>
              )}
              <span style={{ color: DIM }}> — {p.role} ({p.year})</span>
            </p>
          ))}
        </div>

        <p style={{ margin: "24px 0 0" }}>
          <span style={{ color: DIM }}>$</span> contact --all
        </p>
        <p style={{ margin: "4px 0 0" }}>
          mail   →{" "}
          <a href={`mailto:${ME.email}`} style={{ color: GREEN, textDecoration: "underline" }}>
            {ME.email}
          </a>
        </p>
        <p style={{ margin: "2px 0 0" }}>
          github →{" "}
          <a href={ME.socials.github} style={{ color: GREEN, textDecoration: "underline" }}>
            github.com/9000fm
          </a>
        </p>
        <p style={{ margin: "2px 0 0" }}>
          linked →{" "}
          <a href={ME.socials.linkedin} style={{ color: GREEN, textDecoration: "underline" }}>
            linkedin
          </a>
        </p>

        <p style={{ margin: "24px 0 0" }}>
          <span style={{ color: DIM }}>$</span>
          <span className="blink" style={{ display: "inline-block", marginLeft: 6, width: 9, height: 16, background: GREEN, verticalAlign: "middle" }} />
        </p>
      </div>
    </main>
  );
}
