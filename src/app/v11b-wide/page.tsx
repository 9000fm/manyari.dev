import Link from "next/link";
import type { Metadata } from "next";
import { ME } from "@/content";
import { SHARED_CSS, Marquee, Sections, NAV_SECTIONS, BLUE } from "../_brutalist/shared";
import WireSphere from "../_brutalist/WireSphere";

export const metadata: Metadata = { title: `${ME.name} — index of /` };

const LAYOUT_CSS = `
  .wrap {
    max-width: min(92vw, 980px);
    margin: 0 auto;
    padding: clamp(28px, 3vw, 56px) 20px 72px;
    font-size: clamp(17px, 0.9rem + 0.35vw, 20px);
  }
  .wrap h1 { font-size: clamp(42px, 5vw, 60px); margin: 24px 0 4px; }
  .topNav { font-size: 14px; color: #555; margin-bottom: 16px; }
`;

export default function BrutalistWide() {
  return (
    <main
      className="brut"
      style={{
        background: "#fff",
        color: "#000",
        minHeight: "100vh",
        fontFamily: '"Times New Roman", Times, serif',
        lineHeight: 1.6,
      }}
    >
      <style>{SHARED_CSS + LAYOUT_CSS}</style>

      <div className="wrap">
        <p className="topNav">
          <Link href="/" style={{ color: BLUE }}>[all variants]</Link>
          {NAV_SECTIONS.map((s) => (
            <span key={s.id}>
              {" · "}
              <a href={`#${s.id}`}>[{s.label}]</a>
            </span>
          ))}
        </p>

        <Marquee />

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 24, flexWrap: "wrap" }}>
          <div style={{ minWidth: 280, flex: "1 1 340px" }}>
            <h1>{ME.name}</h1>
            <p style={{ margin: "0 0 4px", fontStyle: "italic" }}>{ME.role}.</p>
            <p style={{ margin: 0, color: "#444", fontSize: 15 }}>
              {ME.location} · <a href={`mailto:${ME.email}`}>{ME.email}</a>
              <br />
              Status: <strong>{ME.available}</strong>
            </p>
          </div>
          <div style={{ flexShrink: 0 }}>
            <WireSphere size={180} />
          </div>
        </div>

        <p className="brutAst" />

        <Sections />
      </div>
    </main>
  );
}
