import Link from "next/link";
import type { Metadata } from "next";
import { ME } from "@/content";
import { SHARED_CSS, Marquee, Sections, NAV_SECTIONS, BLUE } from "../_brutalist/shared";

export const metadata: Metadata = { title: `${ME.name} — index of /` };

const LAYOUT_CSS = `
  .grid { display: grid; gap: 48px; grid-template-columns: 1fr; max-width: 1200px; margin: 0 auto; padding: 32px 20px 64px; }
  .pane h1 { font-size: clamp(44px, 6vw, 68px); line-height: 0.95; margin: 0 0 14px; }
  .paneMeta { color: #444; font-size: 15px; margin: 0 0 18px; }
  .paneToc { list-style: none; padding: 0; margin: 0; font-size: 15px; }
  .paneToc li { padding: 2px 0; }
  .content { min-width: 0; }
  .content .inner { max-width: 68ch; }
  @media (min-width: 960px) {
    .grid { grid-template-columns: 360px 1fr; }
    .pane { position: sticky; top: 32px; align-self: start; }
  }
`;

export default function BrutalistSplit() {
  const words = ME.name.split(" ");
  return (
    <main
      className="brut"
      style={{
        background: "#fff",
        color: "#000",
        minHeight: "100vh",
        fontFamily: '"Times New Roman", Times, serif',
        fontSize: 17,
        lineHeight: 1.6,
      }}
    >
      <style>{SHARED_CSS + LAYOUT_CSS}</style>

      <div className="grid">
        <aside className="pane">
          <h1>
            {words.map((w, i) => (
              <span key={i} style={{ display: "block" }}>
                {w}
              </span>
            ))}
          </h1>
          <p style={{ margin: "0 0 10px", fontStyle: "italic" }}>{ME.role}.</p>
          <p className="paneMeta">
            {ME.location}
            <br />
            <a href={`mailto:${ME.email}`}>{ME.email}</a>
            <br />
            Status: <strong>{ME.available}</strong>
          </p>

          <nav>
            <ul className="paneToc">
              {NAV_SECTIONS.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`}>[{s.label}]</a>
                </li>
              ))}
            </ul>
          </nav>

          <p style={{ fontSize: 13, marginTop: 18 }}>
            <Link href="/" style={{ color: BLUE }}>[all variants]</Link>
          </p>
        </aside>

        <div className="content">
          <div className="inner">
            <Marquee />
            <Sections />
          </div>
        </div>
      </div>
    </main>
  );
}
