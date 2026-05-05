import Link from "next/link";
import type { Metadata } from "next";
import { ME, PROJECTS } from "@/content";
import { fontSilkscreen, fontChivoMono } from "@/fonts";

export const metadata: Metadata = { title: `${ME.name} — System 7` };

const dottedBg = {
  backgroundImage: "radial-gradient(#000 1px, transparent 1px)",
  backgroundSize: "4px 4px",
};

const titlebar = (active = true) => ({
  background: active ? "#fff" : "#fff",
  borderBottom: "1px solid #000",
  padding: "4px 8px",
  display: "flex",
  alignItems: "center" as const,
  gap: 8,
  ...dottedBg,
  backgroundImage: "repeating-linear-gradient(0deg, #000 0, #000 1px, transparent 1px, transparent 3px)",
});

export default function MacOS7Page() {
  return (
    <main
      style={{
        background: "#bdbdbd",
        minHeight: "100vh",
        padding: "32px 4vw 64px",
        fontFamily: "Geneva, Helvetica, sans-serif",
        color: "#000",
      }}
    >
      <Link href="/" style={{ fontSize: 11, color: "#000", textDecoration: "underline" }}>
        ← all variants
      </Link>

      {/* Hero window */}
      <div
        style={{
          maxWidth: 720,
          margin: "16px auto 24px",
          background: "#fff",
          border: "1px solid #000",
          boxShadow: "2px 2px 0 #000",
        }}
      >
        <div style={titlebar()}>
          <div style={{ width: 14, height: 14, border: "1px solid #000", background: "#fff" }} />
          <div style={{ flex: 1, textAlign: "center", background: "#fff", padding: "0 8px" }}>
            <span className={fontSilkscreen.className} style={{ fontSize: 11 }}>fm.about</span>
          </div>
          <div style={{ width: 14, height: 14 }} />
        </div>
        <div style={{ padding: "32px 24px" }}>
          <h1 className={fontSilkscreen.className} style={{ fontSize: "clamp(28px, 6vw, 56px)", margin: 0, lineHeight: 1.1, letterSpacing: "0.02em" }}>
            {ME.name}
          </h1>
          <p className={fontChivoMono.className} style={{ fontSize: 14, margin: "12px 0 0" }}>
            {ME.role} · {ME.location}
          </p>
        </div>
      </div>

      {/* Work window */}
      <div style={{ maxWidth: 720, margin: "0 auto 24px", background: "#fff", border: "1px solid #000", boxShadow: "2px 2px 0 #000" }}>
        <div style={titlebar()}>
          <div style={{ width: 14, height: 14, border: "1px solid #000", background: "#fff" }} />
          <div style={{ flex: 1, textAlign: "center", background: "#fff", padding: "0 8px" }}>
            <span className={fontSilkscreen.className} style={{ fontSize: 11 }}>work</span>
          </div>
          <div style={{ width: 14, height: 14 }} />
        </div>
        <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
          {PROJECTS.map((p, i) => (
            <li
              key={p.slug}
              style={{
                borderBottom: i === PROJECTS.length - 1 ? "none" : "1px dashed #000",
                padding: "16px 24px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "baseline",
                gap: 16,
              }}
            >
              <div>
                {p.url ? (
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={fontSilkscreen.className}
                    style={{ fontSize: "clamp(16px, 2.4vw, 22px)", color: "#000", textDecoration: "underline" }}
                  >
                    ▢ {p.title}
                  </a>
                ) : (
                  <span className={fontSilkscreen.className} style={{ fontSize: "clamp(16px, 2.4vw, 22px)" }}>
                    ▢ {p.title}
                  </span>
                )}
                <p className={fontChivoMono.className} style={{ fontSize: 12, margin: "6px 0 0", color: "#404040" }}>{p.role}</p>
              </div>
              <span className={fontChivoMono.className} style={{ fontSize: 12 }}>{p.year}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* About + contact window */}
      <div style={{ maxWidth: 720, margin: "0 auto", background: "#fff", border: "1px solid #000", boxShadow: "2px 2px 0 #000" }}>
        <div style={titlebar()}>
          <div style={{ width: 14, height: 14, border: "1px solid #000", background: "#fff" }} />
          <div style={{ flex: 1, textAlign: "center", background: "#fff", padding: "0 8px" }}>
            <span className={fontSilkscreen.className} style={{ fontSize: 11 }}>readme</span>
          </div>
          <div style={{ width: 14, height: 14 }} />
        </div>
        <div className={fontChivoMono.className} style={{ padding: "20px 24px", fontSize: 13, lineHeight: 1.7 }}>
          <p style={{ margin: 0 }}>{ME.about}</p>
          <hr style={{ border: 0, borderTop: "1px dashed #000", margin: "20px 0" }} />
          <p style={{ margin: 0 }}>
            <span className={fontSilkscreen.className} style={{ fontSize: 11 }}>contact ▶</span>
            <br />
            <a href={`mailto:${ME.email}`} style={{ color: "#000" }}>{ME.email}</a>
            <br />
            <a href={ME.socials.github} style={{ color: "#000" }}>github</a> · <a href={ME.socials.linkedin} style={{ color: "#000" }}>linkedin</a>
          </p>
        </div>
      </div>
    </main>
  );
}
