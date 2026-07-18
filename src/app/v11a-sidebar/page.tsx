import Link from "next/link";
import type { Metadata } from "next";
import { ME } from "@/content";
import { SHARED_CSS, Marquee, Sections, NAV_SECTIONS, BLUE } from "../_brutalist/shared";

export const metadata: Metadata = { title: `${ME.name} — index of /` };

const LAYOUT_CSS = `
  .wrap { max-width: 1160px; margin: 0 auto; padding: 32px 20px 64px; }
  .grid { display: grid; gap: 40px; grid-template-columns: 1fr; }
  .side h1 { font-size: 26px; margin: 0 0 2px; }
  .sideToc { list-style: none; padding: 0; margin: 18px 0; }
  .sideToc li { padding: 3px 0; }
  .sideMeta { color: #444; font-size: 14px; margin: 6px 0 0; }
  .content { min-width: 0; }
  .content .inner { max-width: 68ch; }
  @media (min-width: 900px) {
    .grid { grid-template-columns: 232px 1fr; }
    .side {
      position: sticky; top: 32px; align-self: start;
      border-right: 1px solid #000; padding-right: 24px;
      max-height: calc(100vh - 64px); overflow: auto;
    }
  }
`;

export default function BrutalistSidebar() {
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

      <div className="wrap">
        <div className="grid">
          <aside className="side">
            <h1>{ME.name}</h1>
            <p style={{ margin: "0 0 4px", fontStyle: "italic", fontSize: 15 }}>{ME.role}.</p>
            <p className="sideMeta">
              {ME.location}
              <br />
              <a href={`mailto:${ME.email}`}>{ME.email}</a>
              <br />
              {ME.phone}
              <br />
              Status: <strong>{ME.available}</strong>
            </p>

            <nav>
              <p style={{ fontVariant: "small-caps", letterSpacing: "0.06em", margin: "18px 0 4px", color: "#555", fontSize: 13 }}>
                Contents
              </p>
              <ul className="sideToc">
                {NAV_SECTIONS.map((s) => (
                  <li key={s.id}>
                    <a href={`#${s.id}`}>{s.label}</a>
                  </li>
                ))}
              </ul>
            </nav>

            <p style={{ fontSize: 13, marginTop: 20 }}>
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
      </div>
    </main>
  );
}
