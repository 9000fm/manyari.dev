import type { Metadata } from "next";
import { ME } from "@/content";
import { SHARED_CSS, Sections, NAV_SECTIONS } from "../_brutalist/shared";
import Ticker from "../_brutalist/Ticker";
import WireSphere from "../_brutalist/WireSphere";

export const metadata: Metadata = { title: `${ME.name} — index of /` };

const LAYOUT_CSS = `
  .wrap { max-width: 1160px; margin: 0 auto; padding: 20px 20px 64px; }
  .grid { display: grid; gap: 40px; grid-template-columns: 1fr; margin-top: 8px; }
  .side { display: flex; flex-direction: column; }
  .side h1 { font-size: 27px; line-height: 0.98; margin: 0; }
  .identRow { display: flex; flex-direction: row; align-items: flex-start; justify-content: space-between; gap: 12px; }
  .identText { min-width: 0; }
  .identSphere { flex-shrink: 0; }
  .sideToc { list-style: none; padding: 0; margin: 16px 0; }
  .sideToc li { padding: 3px 0; }
  .sideMeta { color: #444; font-size: 14px; margin: 6px 0 0; }
  .content { min-width: 0; }
  .content .inner { max-width: 68ch; }
  @media (min-width: 900px) {
    .grid { grid-template-columns: 288px 1fr; }
    .side {
      position: sticky; top: 20px; align-self: start;
      border-right: 1px solid #000; padding-right: 24px;
      max-height: calc(100vh - 40px); overflow: auto;
    }
    .identRow { flex-direction: column-reverse; align-items: flex-start; justify-content: flex-start; gap: 14px; }
  }
  @media (max-width: 899px) {
    .side h1 { font-size: 35px; }
    .content { font-size: 18px; }
    .identSphere canvas { width: 168px !important; height: 168px !important; }
    .side .snav { order: -1; margin-bottom: 6px; }
    .side .contentsLabel { display: none; }
    .sideToc { display: flex; flex-wrap: wrap; gap: 10px 18px; margin: 4px 0 14px; border-bottom: 1px solid #000; padding-bottom: 12px; }
    .sideToc li { padding: 0; }
  }
`;

export default function BrutalistSidebar() {
  return (
    <main
      id="top"
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
        <Ticker />

        <div className="grid">
          <aside className="side">
            <div className="ident">
              <div className="identRow">
                <div className="identText">
                  <h1>
                    {ME.name.split(" ").map((w, i) => (
                      <span key={i} style={{ display: "block" }}>
                        {w}
                      </span>
                    ))}
                  </h1>
                  <p style={{ margin: "6px 0 4px", fontStyle: "italic", fontSize: 15 }}>{ME.role}.</p>
                  <p className="sideMeta">
                    <a href={`mailto:${ME.email}`}>{ME.email}</a>
                    <br />
                    {ME.phone}
                    <br />
                    Status: <strong>{ME.available}</strong>
                  </p>
                </div>
                <div className="identSphere">
                  <WireSphere size={176} />
                </div>
              </div>
            </div>

            <nav className="snav">
              <p
                className="contentsLabel"
                style={{ fontVariant: "small-caps", letterSpacing: "0.06em", margin: "18px 0 4px", color: "#555", fontSize: 13 }}
              >
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
          </aside>

          <div className="content">
            <div className="inner">
              <Sections />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
