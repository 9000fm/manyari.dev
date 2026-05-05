import Link from "next/link";
import type { Metadata } from "next";
import { ME, PROJECTS, EXPERIENCE, SKILLS, EDUCATION, LANGUAGES, SERVICES } from "@/content";
import { fontSilkscreen, fontChivoMono } from "@/fonts";

export const metadata: Metadata = { title: `${ME.name} — System 7` };

export default function MacOS7Page() {
  return (
    <main
      style={{
        background: "#bdbdbd",
        backgroundImage: "radial-gradient(#0a0a0a 1px, transparent 1px)",
        backgroundSize: "4px 4px",
        minHeight: "100vh",
        padding: "32px 4vw 64px",
        fontFamily: "Geneva, Helvetica, sans-serif",
        color: "#000",
      }}
    >
      <style>{`
        @keyframes m7scan { from { transform: translateY(-30px); opacity: 0; } to { transform: none; opacity: 1; } }
        .m7win { animation: m7scan .5s ease both; }
        .m7win:nth-child(2) { animation-delay: .08s; }
        .m7win:nth-child(3) { animation-delay: .16s; }
        .m7win:nth-child(4) { animation-delay: .24s; }
        .m7win:nth-child(5) { animation-delay: .32s; }
        .m7win:nth-child(6) { animation-delay: .40s; }
        .m7tb { background-image: repeating-linear-gradient(0deg, #000 0 1px, transparent 1px 3px); }
        .m7tb-active { background-image: repeating-linear-gradient(0deg, #000 0 1px, transparent 1px 2px); }
        .m7row:hover { background: #000; color: #fff; }
        .m7row:hover a { color: #fff; }
        .m7chip {
          display: inline-block;
          padding: 2px 6px;
          border: 1px solid #000;
          background: #fff;
          margin: 2px 3px 2px 0;
          font-size: 11px;
        }
        .m7chip:hover { background: #000; color: #fff; }
        @keyframes m7marqText { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .m7marq { display: inline-flex; gap: 24px; animation: m7marqText 30s linear infinite; }
      `}</style>

      <Link href="/" style={{ fontSize: 11, color: "#000", textDecoration: "underline" }}>
        ← all variants
      </Link>

      <div style={{ maxWidth: 760, margin: "16px auto 0", display: "grid", gap: 18 }}>
        {/* HERO */}
        <Window title="fm.about" active>
          <div style={{ padding: "32px 24px" }}>
            <h1 className={fontSilkscreen.className} style={{ fontSize: "clamp(28px, 6.5vw, 64px)", margin: 0, lineHeight: 1.05, letterSpacing: "0.02em" }}>
              {ME.name}
            </h1>
            <p className={fontChivoMono.className} style={{ fontSize: 14, margin: "12px 0 0" }}>
              ▢ {ME.role} <br /> ▢ {ME.location} <br /> ▢ {ME.available}
            </p>
          </div>
        </Window>

        {/* MARQUEE STRIP */}
        <Window title="services">
          <div style={{ overflow: "hidden", whiteSpace: "nowrap", padding: "8px 0", borderTop: "1px dashed #000" }}>
            <div className={`m7marq ${fontSilkscreen.className}`} style={{ fontSize: 13, paddingLeft: 12 }}>
              {[...Array(2)].flatMap((_, i) =>
                SERVICES.map((s) => (
                  <span key={`${i}-${s}`}>▢ {s}</span>
                ))
              )}
            </div>
          </div>
        </Window>

        {/* WORK */}
        <Window title="work">
          <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {PROJECTS.map((p, i) => (
              <li
                key={p.slug}
                className="m7row"
                style={{
                  borderBottom: i === PROJECTS.length - 1 ? "none" : "1px dashed #000",
                  padding: "16px 24px",
                  transition: "background .15s",
                }}
              >
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 16 }}>
                  <div>
                    {p.url ? (
                      <a
                        href={p.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={fontSilkscreen.className}
                        style={{ fontSize: "clamp(16px, 2.4vw, 22px)", color: "inherit", textDecoration: "underline" }}
                      >
                        ▢ {p.title}
                      </a>
                    ) : (
                      <span className={fontSilkscreen.className} style={{ fontSize: "clamp(16px, 2.4vw, 22px)" }}>
                        ▢ {p.title}
                      </span>
                    )}
                    <p className={fontChivoMono.className} style={{ fontSize: 12, margin: "6px 0 0", color: "inherit", opacity: 0.85 }}>{p.role}</p>
                  </div>
                  <span className={fontChivoMono.className} style={{ fontSize: 12 }}>{p.year}</span>
                </div>
                <p className={fontChivoMono.className} style={{ fontSize: 12, margin: "8px 0 0", lineHeight: 1.5, color: "inherit" }}>{p.blurb}</p>
              </li>
            ))}
          </ul>
        </Window>

        {/* EXPERIENCE */}
        <Window title="experience.log">
          <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {EXPERIENCE.map((j, i) => (
              <li
                key={i}
                style={{
                  borderBottom: i === EXPERIENCE.length - 1 ? "none" : "1px dashed #000",
                  padding: "14px 24px",
                }}
              >
                <p className={fontSilkscreen.className} style={{ fontSize: 14, margin: 0 }}>▢ {j.title} — {j.company}</p>
                <p className={fontChivoMono.className} style={{ fontSize: 11, margin: "4px 0", opacity: 0.7 }}>{j.period} · {j.location}</p>
                <p className={fontChivoMono.className} style={{ fontSize: 12, margin: "6px 0 0", lineHeight: 1.5 }}>{j.blurb}</p>
              </li>
            ))}
          </ul>
        </Window>

        {/* SKILLS */}
        <Window title="toolbox">
          <div style={{ padding: "16px 24px" }}>
            {SKILLS.map((g) => (
              <div key={g.label} style={{ marginBottom: 12 }}>
                <p className={fontSilkscreen.className} style={{ fontSize: 12, margin: "0 0 6px" }}>▢ {g.label}</p>
                <div className={fontChivoMono.className}>
                  {g.items.map((s) => (
                    <span key={s} className="m7chip">{s}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </Window>

        {/* ABOUT + EDU + CONTACT */}
        <Window title="readme">
          <div className={fontChivoMono.className} style={{ padding: "20px 24px", fontSize: 13, lineHeight: 1.7 }}>
            <p style={{ margin: 0 }}>{ME.about}</p>
            <hr style={{ border: 0, borderTop: "1px dashed #000", margin: "20px 0" }} />
            <p className={fontSilkscreen.className} style={{ fontSize: 12, margin: "0 0 8px" }}>▢ education</p>
            {EDUCATION.map((e) => (
              <p key={e.title} style={{ margin: "0 0 8px", fontSize: 12 }}>
                <strong>{e.title}</strong> — {e.school}, {e.period}
              </p>
            ))}
            <hr style={{ border: 0, borderTop: "1px dashed #000", margin: "16px 0" }} />
            <p className={fontSilkscreen.className} style={{ fontSize: 12, margin: "0 0 8px" }}>▢ languages</p>
            <p style={{ margin: 0, fontSize: 12 }}>
              {LANGUAGES.map((l) => `${l.lang} (${l.level})`).join(" · ")}
            </p>
            <hr style={{ border: 0, borderTop: "1px dashed #000", margin: "16px 0" }} />
            <p className={fontSilkscreen.className} style={{ fontSize: 12, margin: "0 0 8px" }}>▢ contact</p>
            <p style={{ margin: 0, fontSize: 13 }}>
              <a href={`mailto:${ME.email}`} style={{ color: "#000" }}>{ME.email}</a>
              <br />
              <a href={ME.socials.github} style={{ color: "#000" }}>github</a> · <a href={ME.socials.linkedin} style={{ color: "#000" }}>linkedin</a>
            </p>
          </div>
        </Window>
      </div>
    </main>
  );
}

function Window({ title, active = false, children }: { title: string; active?: boolean; children: React.ReactNode }) {
  return (
    <div
      className="m7win"
      style={{
        background: "#fff",
        border: "1px solid #000",
        boxShadow: "2px 2px 0 #000",
      }}
    >
      <div
        className={active ? "m7tb-active" : "m7tb"}
        style={{
          borderBottom: "1px solid #000",
          padding: "4px 8px",
          display: "flex",
          alignItems: "center",
          gap: 8,
        }}
      >
        <div style={{ width: 14, height: 14, border: "1px solid #000", background: "#fff" }} />
        <div style={{ flex: 1, textAlign: "center", background: "#fff", padding: "0 8px" }}>
          <span style={{ fontSize: 11, fontFamily: "Geneva, Helvetica, sans-serif" }}>{title}</span>
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          <div style={{ width: 12, height: 12, border: "1px solid #000", background: "#fff" }} />
          <div style={{ width: 12, height: 12, border: "1px solid #000", background: "#fff" }} />
        </div>
      </div>
      {children}
    </div>
  );
}
