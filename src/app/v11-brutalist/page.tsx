import Link from "next/link";
import type { Metadata } from "next";
import { ME, PROJECTS, EXPERIENCE, SKILLS, EDUCATION, LANGUAGES, SERVICES } from "@/content";

export const metadata: Metadata = { title: `${ME.name} — index of /` };

export default function BrutalistPage() {
  const updated = new Date().toISOString().slice(0, 10);
  return (
    <main
      style={{
        background: "#fff",
        color: "#000",
        minHeight: "100vh",
        fontFamily: '"Times New Roman", Times, serif',
        fontSize: 17,
        lineHeight: 1.6,
      }}
    >
      <style>{`
        .brutWrap { max-width: 64ch; margin: 0 auto; padding: 32px 16px 64px; }
        .brutWrap h1, .brutWrap h2 {
          font-variant: small-caps;
          letter-spacing: 0.04em;
          font-weight: normal;
        }
        .brutWrap h1 { font-size: 42px; margin: 24px 0 4px; }
        .brutWrap h2 { font-size: 24px; margin: 32px 0 12px; }
        .brutAbout p::first-letter {
          float: left;
          font-size: 4em;
          line-height: 0.85;
          padding: 6px 8px 0 0;
          font-weight: bold;
        }
        .brutAst {
          text-align: center;
          margin: 32px 0;
          letter-spacing: 1em;
          color: #888;
          font-size: 14px;
        }
        .brutAst::before { content: "* * *"; }
        .brutWrap hr { display: none; }
        .brutFootnote { vertical-align: super; font-size: 0.7em; color: #555; margin-right: 2px; }
        .brutPullquote {
          border-left: 3px solid #000;
          margin: 24px 0;
          padding: 4px 0 4px 20px;
          font-style: italic;
          font-size: 19px;
        }
        .brutPagenum { text-align: center; color: #555; margin-top: 48px; font-size: 14px; letter-spacing: 0.3em; }
        .brutTable { border-collapse: collapse; width: 100%; font-size: 15px; }
        .brutTable th, .brutTable td { padding: 10px 8px; vertical-align: top; }
        .brutTable th { border-bottom: 1px solid #000; text-align: left; font-variant: small-caps; letter-spacing: 0.03em; }
        .brutTable tr { border-bottom: 1px dotted #888; }
        .brutMarq {
          border-top: 1px solid #000;
          border-bottom: 1px solid #000;
          padding: 6px 0;
          margin: 16px 0 24px;
          font-size: 15px;
        }
        .brutNav { font-size: 14px; color: #555; margin-bottom: 16px; }
        .brutNav a { color: #0000EE; }
      `}</style>

      <div className="brutWrap">
        <p className="brutNav">
          <Link href="/" style={{ color: "#0000EE" }}>[back to all variants]</Link>
          {" · "}
          <a href="#about" style={{ color: "#0000EE" }}>[about]</a>
          {" · "}
          <a href="#work" style={{ color: "#0000EE" }}>[work]</a>
          {" · "}
          <a href="#experience" style={{ color: "#0000EE" }}>[experience]</a>
          {" · "}
          <a href="#tools" style={{ color: "#0000EE" }}>[tools]</a>
          {" · "}
          <a href="#contact" style={{ color: "#0000EE" }}>[contact]</a>
        </p>

        {/* literal marquee — peak brutalism */}
        <div className="brutMarq">
          {(() => {
            const Marquee = "marquee" as unknown as React.ElementType;
            return <Marquee scrollamount={4}>{SERVICES.join("  •  ")}  •  {ME.available}  •  {ME.email}  •</Marquee>;
          })()}
        </div>

        <h1>{ME.name}</h1>
        <p style={{ margin: "0 0 4px", fontStyle: "italic" }}>{ME.role}.</p>
        <p style={{ margin: 0, color: "#444", fontSize: 15 }}>
          {ME.location} · <a href={`mailto:${ME.email}`} style={{ color: "#0000EE" }}>{ME.email}</a> · {ME.phone}
          <br />
          Status: <strong>{ME.available}</strong>
        </p>

        <hr />
        <p className="brutAst" />

        <section id="about" className="brutAbout">
          <h2>About</h2>
          <p>{ME.about}</p>
          <blockquote className="brutPullquote">
            I treat code as a craft and brand work as architecture.
          </blockquote>
        </section>

        <hr />
        <p className="brutAst" />

        <section id="work">
          <h2>Selected Work</h2>
          <ol style={{ margin: 0, paddingLeft: 24 }}>
            {PROJECTS.map((p, i) => (
              <li key={p.slug} style={{ marginBottom: 18 }}>
                {p.url ? (
                  <a href={p.url} target="_blank" rel="noopener noreferrer" style={{ color: "#0000EE", fontWeight: "bold" }}>
                    {p.title}
                  </a>
                ) : (
                  <strong>{p.title}</strong>
                )}
                <span className="brutFootnote">[{i + 1}]</span>
                {" — "}
                <em>{p.role}</em>
                {" ("}
                {p.year}
                {")"}
                <br />
                <span style={{ fontSize: 15, color: "#222" }}>{p.blurb}</span>
              </li>
            ))}
          </ol>
        </section>

        <hr />
        <p className="brutAst" />

        <section id="experience">
          <h2>Experience</h2>
          <table className="brutTable">
            <thead>
              <tr>
                <th>Period</th>
                <th>Title</th>
                <th>Where</th>
              </tr>
            </thead>
            <tbody>
              {EXPERIENCE.map((j, i) => (
                <tr key={i}>
                  <td>{j.period}</td>
                  <td>
                    <strong>{j.title}</strong> — {j.company}
                    <br />
                    <span style={{ fontSize: 14, color: "#333" }}>{j.blurb}</span>
                  </td>
                  <td style={{ fontSize: 13, color: "#555" }}>{j.location}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <hr />
        <p className="brutAst" />

        <section id="tools">
          <h2>Tools</h2>
          <dl style={{ margin: 0 }}>
            {SKILLS.map((g) => (
              <div key={g.label} style={{ marginBottom: 12 }}>
                <dt style={{ display: "inline", fontWeight: "bold", fontVariant: "small-caps", letterSpacing: "0.04em" }}>{g.label}:</dt>
                <dd style={{ display: "inline", margin: 0, marginLeft: 6 }}>
                  {g.items.join(", ")}.
                </dd>
              </div>
            ))}
          </dl>
        </section>

        <hr />
        <p className="brutAst" />

        <section>
          <h2>Education</h2>
          <ul style={{ margin: 0, paddingLeft: 24 }}>
            {EDUCATION.map((e) => (
              <li key={e.title} style={{ marginBottom: 12 }}>
                <strong>{e.title}</strong> — {e.school} ({e.period}).<br />
                <span style={{ fontSize: 15, color: "#333" }}>{e.detail}</span>
              </li>
            ))}
          </ul>

          <h2>Languages</h2>
          <ul style={{ margin: 0, paddingLeft: 24 }}>
            {LANGUAGES.map((l) => (
              <li key={l.lang}>{l.lang} — {l.level}</li>
            ))}
          </ul>
        </section>

        <hr />
        <p className="brutAst" />

        <section id="contact">
          <h2>Contact</h2>
          <ul style={{ margin: 0, paddingLeft: 24 }}>
            <li><a href={`mailto:${ME.email}`} style={{ color: "#0000EE" }}>{ME.email}</a></li>
            <li>Phone: {ME.phone}</li>
            <li><a href={ME.socials.github} style={{ color: "#0000EE" }}>GitHub</a></li>
            <li><a href={ME.socials.linkedin} style={{ color: "#0000EE" }}>LinkedIn</a></li>
          </ul>
        </section>

        <hr />
        <p className="brutAst" />

        <p style={{ fontSize: 13, color: "#555", textAlign: "center" }}>
          Last modified: {updated}. No cookies. No tracking. No frameworks visible.
        </p>
        <p className="brutPagenum">— 1 —</p>
      </div>
    </main>
  );
}
