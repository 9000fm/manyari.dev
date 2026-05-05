import Link from "next/link";
import type { Metadata } from "next";
import { ME, PROJECTS } from "@/content";
import { fontVT323 } from "@/fonts";

export const metadata: Metadata = { title: `${ME.name} — FM.exe` };

const TEAL = "#008080";
const SILVER = "#c0c0c0";
const NAVY = "#000080";
const SHADOW_DARK = "#808080";

const win = {
  background: SILVER,
  border: "2px solid",
  borderColor: "#fff #404040 #404040 #fff",
  boxShadow: "inset -1px -1px 0 #808080, inset 1px 1px 0 #dfdfdf",
};
const titlebar = {
  background: NAVY,
  color: "#fff",
  padding: "3px 6px",
  fontFamily: "Tahoma, 'MS Sans Serif', sans-serif",
  fontSize: 12,
  fontWeight: 700 as const,
  display: "flex",
  justifyContent: "space-between" as const,
  alignItems: "center" as const,
};
const btn = {
  background: SILVER,
  border: "2px solid",
  borderColor: "#fff #404040 #404040 #fff",
  padding: "1px 4px",
  fontFamily: "Tahoma, 'MS Sans Serif', sans-serif",
  fontSize: 11,
  fontWeight: 700 as const,
  cursor: "default" as const,
};

export default function Win95Page() {
  return (
    <main
      style={{
        background: TEAL,
        minHeight: "100vh",
        padding: "32px 4vw 80px",
        fontFamily: "Tahoma, 'MS Sans Serif', sans-serif",
        color: "#000",
      }}
    >
      <Link href="/" style={{ fontSize: 12, color: "#fff", textDecoration: "underline", display: "inline-block", marginBottom: 16 }}>
        ← all variants
      </Link>

      {/* Hero window */}
      <div style={{ ...win, maxWidth: 720, margin: "0 auto 24px" }}>
        <div style={titlebar}>
          <span>📄 FM.exe — about</span>
          <div style={{ display: "flex", gap: 2 }}>
            <span style={btn}>_</span>
            <span style={btn}>□</span>
            <span style={btn}>×</span>
          </div>
        </div>
        <div style={{ padding: "20px 24px" }}>
          <h1 className={fontVT323.className} style={{ fontSize: 56, margin: 0, lineHeight: 1, color: NAVY }}>
            C:\&gt; {ME.name}
          </h1>
          <p className={fontVT323.className} style={{ fontSize: 22, margin: "8px 0 0", color: "#000" }}>
            {ME.role} — {ME.location}
          </p>
        </div>
      </div>

      {/* Work window */}
      <div style={{ ...win, maxWidth: 720, margin: "0 auto 24px" }}>
        <div style={titlebar}>
          <span>📁 work\</span>
          <div style={{ display: "flex", gap: 2 }}>
            <span style={btn}>_</span>
            <span style={btn}>□</span>
            <span style={btn}>×</span>
          </div>
        </div>
        <div style={{ padding: 16, display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: 8 }}>
          {PROJECTS.map((p) => {
            const inner = (
              <>
                <div style={{ fontSize: 40 }}>📂</div>
                <div style={{ fontSize: 12, marginTop: 4 }}>{p.title}.exe</div>
                <div style={{ fontSize: 11, color: "#404040", marginTop: 2 }}>{p.year}</div>
              </>
            );
            return (
              <div key={p.slug} style={{ textAlign: "center", padding: 8, cursor: "default" }}>
                {p.url ? (
                  <a href={p.url} target="_blank" rel="noopener noreferrer" style={{ color: "#000", textDecoration: "none", display: "block" }}>
                    {inner}
                  </a>
                ) : (
                  inner
                )}
              </div>
            );
          })}
        </div>
        <div style={{ borderTop: `1px solid ${SHADOW_DARK}`, padding: "4px 8px", fontSize: 11, background: SILVER }}>
          {PROJECTS.length} object(s)
        </div>
      </div>

      {/* About + contact window */}
      <div style={{ ...win, maxWidth: 720, margin: "0 auto 24px" }}>
        <div style={titlebar}>
          <span>📝 readme.txt — Notepad</span>
          <div style={{ display: "flex", gap: 2 }}>
            <span style={btn}>_</span>
            <span style={btn}>□</span>
            <span style={btn}>×</span>
          </div>
        </div>
        <div style={{ background: "#fff", padding: 16, fontSize: 14, fontFamily: "ui-monospace, 'Courier New', monospace", lineHeight: 1.6 }}>
          {ME.about}
          <br /><br />
          --- contact ---
          <br />
          mail: <a href={`mailto:${ME.email}`} style={{ color: NAVY }}>{ME.email}</a>
          <br />
          web : <a href={ME.socials.github} style={{ color: NAVY }}>github.com/9000fm</a>
          <br />
          web : <a href={ME.socials.linkedin} style={{ color: NAVY }}>linkedin</a>
        </div>
      </div>

      {/* Taskbar */}
      <div
        style={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          background: SILVER,
          borderTop: "2px solid #fff",
          padding: "3px 6px",
          display: "flex",
          gap: 6,
          alignItems: "center",
        }}
      >
        <button style={{ ...btn, padding: "2px 8px", fontSize: 12, display: "flex", alignItems: "center", gap: 4 }}>
          <span style={{ fontSize: 14 }}>⊞</span> Start
        </button>
        <div style={{ flex: 1 }} />
        <div style={{ ...btn, padding: "2px 6px", fontSize: 11 }}>
          {new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
        </div>
      </div>
    </main>
  );
}
