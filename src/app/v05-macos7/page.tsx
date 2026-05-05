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
        padding: "32px 16px 64px",
        fontFamily: "Geneva, Helvetica, sans-serif",
        color: "#000",
        overflowX: "hidden",
      }}
    >
      <style>{`
        @keyframes m7scan { from { transform: translateY(-30px); opacity: 0; } to { transform: none; opacity: 1; } }
        .m7win { animation: m7scan .5s ease both; max-width: 720px; margin: 0 auto; background: #fff; border: 1px solid #000; box-shadow: 2px 2px 0 #000; }
        .m7win + .m7win { margin-top: 18px; }
        .m7win:nth-child(2) { animation-delay: .08s; }
        .m7win:nth-child(3) { animation-delay: .16s; }
        .m7win:nth-child(4) { animation-delay: .24s; }
        .m7win:nth-child(5) { animation-delay: .32s; }
        .m7win:nth-child(6) { animation-delay: .40s; }
        .m7win:nth-child(7) { animation-delay: .48s; }

        .m7tb {
          display: flex;
          align-items: stretch;
          border-bottom: 1px solid #000;
          background: #fff;
          height: 22px;
        }
        .m7tb-stripe {
          flex: 1;
          min-width: 0;
          background-image: repeating-linear-gradient(0deg, #000 0 1px, transparent 1px 3px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 0 6px;
        }
        .m7tb-stripe-active {
          background-image: repeating-linear-gradient(0deg, #000 0 1px, transparent 1px 2px);
        }
        .m7tb-title {
          background: #fff;
          padding: 0 8px;
          font-size: 11px;
          font-family: Geneva, Helvetica, sans-serif;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          max-width: 60%;
          line-height: 22px;
        }
        .m7tb-box {
          width: 22px;
          height: 22px;
          flex: 0 0 22px;
          border-right: 1px solid #000;
          background: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .m7tb-box-r {
          border-right: 0;
          border-left: 1px solid #000;
        }
        .m7tb-box::after {
          content: "";
          width: 10px; height: 10px;
          border: 1px solid #000;
          background: #fff;
        }

        .m7row { transition: background .15s; }
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

        .m7marqWrap { overflow: hidden; min-width: 0; padding: 6px 0; border-top: 1px dashed #000; }
        @keyframes m7marqText { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .m7marq { display: inline-flex; gap: 24px; animation: m7marqText 50s linear infinite; padding-left: 12px; white-space: nowrap; will-change: transform; }

        .m7content { padding: 20px 24px; word-wrap: break-word; overflow-wrap: anywhere; }
        .m7content p { margin: 0; }
        .m7list { list-style: none; margin: 0; padding: 0; }
        .m7li { padding: 16px 24px; border-bottom: 1px dashed #000; word-wrap: break-word; overflow-wrap: anywhere; }
        .m7li:last-child { border-bottom: 0; }
      `}</style>

      <Link href="/" style={{ fontSize: 11, color: "#000", textDecoration: "underline", display: "block", maxWidth: 720, margin: "0 auto 16px" }}>
        ← all variants
      </Link>

      {/* HERO */}
      <Window title="fm.about" active>
        <div className="m7content">
          <h1 className={fontSilkscreen.className} style={{ fontSize: "clamp(26px, 5.5vw, 48px)", margin: 0, lineHeight: 1.05, letterSpacing: "0.02em", wordWrap: "break-word" }}>
            {ME.name}
          </h1>
          <p className={fontChivoMono.className} style={{ fontSize: 13, marginTop: 12 }}>
            ▢ {ME.role}<br />▢ {ME.location}<br />▢ {ME.available}
          </p>
        </div>
      </Window>

      {/* SERVICES MARQUEE */}
      <Window title="services">
        <div className="m7marqWrap">
          <div className={`m7marq ${fontSilkscreen.className}`} style={{ fontSize: 13 }}>
            {[...Array(2)].flatMap((_, i) =>
              SERVICES.map((s) => <span key={`${i}-${s}`}>▢ {s}</span>)
            )}
          </div>
        </div>
      </Window>

      {/* WORK */}
      <Window title="work">
        <ul className="m7list">
          {PROJECTS.map((p) => (
            <li key={p.slug} className="m7row m7li">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 16, flexWrap: "wrap" }}>
                <div style={{ minWidth: 0, flex: 1 }}>
                  {p.url ? (
                    <a href={p.url} target="_blank" rel="noopener noreferrer" className={fontSilkscreen.className} style={{ fontSize: "clamp(15px, 2.2vw, 20px)", color: "inherit", textDecoration: "underline", wordBreak: "break-word" }}>
                      ▢ {p.title}
                    </a>
                  ) : (
                    <span className={fontSilkscreen.className} style={{ fontSize: "clamp(15px, 2.2vw, 20px)", wordBreak: "break-word" }}>▢ {p.title}</span>
                  )}
                  <p className={fontChivoMono.className} style={{ fontSize: 12, margin: "6px 0 0", color: "inherit", opacity: 0.85 }}>{p.role}</p>
                </div>
                <span className={fontChivoMono.className} style={{ fontSize: 12, flex: "0 0 auto" }}>{p.year}</span>
              </div>
              <p className={fontChivoMono.className} style={{ fontSize: 12, margin: "8px 0 0", lineHeight: 1.5, color: "inherit" }}>{p.blurb}</p>
            </li>
          ))}
        </ul>
      </Window>

      {/* EXPERIENCE */}
      <Window title="experience.log">
        <ul className="m7list">
          {EXPERIENCE.map((j, i) => (
            <li key={i} className="m7li">
              <p className={fontSilkscreen.className} style={{ fontSize: 13, margin: 0, wordBreak: "break-word" }}>▢ {j.title} — {j.company}</p>
              <p className={fontChivoMono.className} style={{ fontSize: 11, margin: "4px 0", opacity: 0.7 }}>{j.period} · {j.location}</p>
              <p className={fontChivoMono.className} style={{ fontSize: 12, margin: "6px 0 0", lineHeight: 1.5 }}>{j.blurb}</p>
            </li>
          ))}
        </ul>
      </Window>

      {/* SKILLS */}
      <Window title="toolbox">
        <div className="m7content" style={{ paddingTop: 16, paddingBottom: 16 }}>
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
        <div className={`${fontChivoMono.className} m7content`} style={{ fontSize: 13, lineHeight: 1.7 }}>
          <p>{ME.about}</p>
          <hr style={{ border: 0, borderTop: "1px dashed #000", margin: "20px 0" }} />
          <p className={fontSilkscreen.className} style={{ fontSize: 12, marginBottom: 8 }}>▢ education</p>
          {EDUCATION.map((e) => (
            <p key={e.title} style={{ marginBottom: 8, fontSize: 12 }}>
              <strong>{e.title}</strong> — {e.school}, {e.period}
            </p>
          ))}
          <hr style={{ border: 0, borderTop: "1px dashed #000", margin: "16px 0" }} />
          <p className={fontSilkscreen.className} style={{ fontSize: 12, marginBottom: 8 }}>▢ languages</p>
          <p style={{ fontSize: 12 }}>{LANGUAGES.map((l) => `${l.lang} (${l.level})`).join(" · ")}</p>
          <hr style={{ border: 0, borderTop: "1px dashed #000", margin: "16px 0" }} />
          <p className={fontSilkscreen.className} style={{ fontSize: 12, marginBottom: 8 }}>▢ contact</p>
          <p style={{ fontSize: 13, wordBreak: "break-word" }}>
            <a href={`mailto:${ME.email}`} style={{ color: "#000" }}>{ME.email}</a>
            <br />
            <a href={ME.socials.github} style={{ color: "#000" }}>github</a> · <a href={ME.socials.linkedin} style={{ color: "#000" }}>linkedin</a>
          </p>
        </div>
      </Window>
    </main>
  );
}

function Window({ title, active = false, children }: { title: string; active?: boolean; children: React.ReactNode }) {
  return (
    <div className="m7win">
      <div className="m7tb">
        <div className="m7tb-box" />
        <div className={`m7tb-stripe ${active ? "m7tb-stripe-active" : ""}`}>
          <span className="m7tb-title">{title}</span>
        </div>
        <div className="m7tb-box m7tb-box-r" />
      </div>
      {children}
    </div>
  );
}
