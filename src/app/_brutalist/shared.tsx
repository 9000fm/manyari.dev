import type { ReactElement } from "react";
import { ME, PROJECTS, EXPERIENCE, SKILLS, EDUCATION, LANGUAGES, SERVICES } from "@/content";

/**
 * Shared brutalist / raw-HTML content, used by the 3 layout finalists
 * (v11a-sidebar, v11b-wide, v11c-split). Layout differs per page; the
 * document body + typographic aesthetic live here so content edits stay
 * in one place. Private folder (leading underscore) => not a route.
 */

export const BLUE = "#0000EE";

// Layout-agnostic typographic rules. Each page adds its own layout CSS.
export const SHARED_CSS = `
  .brut a { color: ${BLUE}; }
  .brut h1, .brut h2 { font-variant: small-caps; letter-spacing: 0.04em; font-weight: normal; }
  .brut h2 { font-size: 24px; margin: 32px 0 12px; }
  .brut h2:first-child { margin-top: 0; }
  .brutAbout p::first-letter {
    float: left; font-size: 4em; line-height: 0.85; padding: 6px 8px 0 0; font-weight: bold;
  }
  .brutAst { text-align: center; margin: 32px 0; letter-spacing: 1em; color: #888; font-size: 14px; }
  .brutAst::before { content: "* * *"; }
  .brutFootnote { vertical-align: super; font-size: 0.7em; color: #555; margin-right: 2px; }
  .brutPullquote {
    border-left: 3px solid currentColor; margin: 24px 0; padding: 4px 0 4px 20px;
    font-style: italic; font-size: 19px;
  }
  .brutColophon { text-align: center; margin-top: 48px; font-variant: small-caps; letter-spacing: 0.15em; font-size: 15px; color: #000; }
  .brutCursor { display: inline-block; width: 0.5em; height: 0.95em; background: currentColor; vertical-align: -0.12em; margin-left: 5px; animation: brutBlink 1.1s steps(1) infinite; }
  @keyframes brutBlink { 50% { opacity: 0; } }
  .brutTable { border-collapse: collapse; width: 100%; font-size: 15px; }
  .brutTable th, .brutTable td { padding: 10px 8px; vertical-align: top; }
  .brutTable th { border-bottom: 1px solid currentColor; text-align: left; font-variant: small-caps; letter-spacing: 0.03em; }
  .brutTable tr { border-bottom: 1px dotted #888; }
  .brutMarq { border-top: 1px solid currentColor; border-bottom: 1px solid currentColor; padding: 6px 0; margin: 0 0 24px; font-size: 15px; overflow: hidden; }
`;

/** Scrolling services marquee - peak brutalism. */
export function Marquee(): ReactElement {
  const Tag = "marquee" as unknown as React.ElementType;
  return (
    <div className="brutMarq">
      <Tag scrollamount={4}>
        {SERVICES.join("  •  ")}  •  {ME.available}  •  {ME.email}  •
      </Tag>
    </div>
  );
}

/** Section anchor list, reused by every layout's nav / TOC. */
export const NAV_SECTIONS = [
  { id: "about", label: "about" },
  { id: "work", label: "work" },
  { id: "experience", label: "experience" },
  { id: "tools", label: "tools" },
  { id: "contact", label: "contact" },
] as const;

/** The document body: About -> Contact. Layout-agnostic. */
export function Sections(): ReactElement {
  const updated = new Date().toISOString().slice(0, 10);
  return (
    <>
      <section id="about" className="brutAbout">
        <h2>About</h2>
        <p>{ME.about}</p>
        <blockquote className="brutPullquote">
          I treat code as a craft and brand work as architecture.
        </blockquote>
      </section>

      <p className="brutAst" />

      <section id="work">
        <h2>Selected Work</h2>
        <ol style={{ margin: 0, paddingLeft: 24 }}>
          {PROJECTS.map((p, i) => (
            <li key={p.slug} style={{ marginBottom: 18 }}>
              {p.url ? (
                <a href={p.url} target="_blank" rel="noopener noreferrer" style={{ fontWeight: "bold" }}>
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
              <span style={{ fontSize: 15, opacity: 0.85 }}>{p.blurb}</span>
            </li>
          ))}
        </ol>
      </section>

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
                  <span style={{ fontSize: 14, opacity: 0.8 }}>{j.blurb}</span>
                </td>
                <td style={{ fontSize: 13, opacity: 0.7 }}>{j.location}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </section>

      <p className="brutAst" />

      <section id="tools">
        <h2>Tools</h2>
        <dl style={{ margin: 0 }}>
          {SKILLS.map((g) => (
            <div key={g.label} style={{ marginBottom: 12 }}>
              <dt style={{ display: "inline", fontWeight: "bold", fontVariant: "small-caps", letterSpacing: "0.04em" }}>
                {g.label}:
              </dt>
              <dd style={{ display: "inline", margin: 0, marginLeft: 6 }}>{g.items.join(", ")}.</dd>
            </div>
          ))}
        </dl>
      </section>

      <p className="brutAst" />

      <section>
        <h2>Education</h2>
        <ul style={{ margin: 0, paddingLeft: 24 }}>
          {EDUCATION.map((e) => (
            <li key={e.title} style={{ marginBottom: 12 }}>
              <strong>{e.title}</strong> — {e.school} ({e.period}).<br />
              <span style={{ fontSize: 15, opacity: 0.8 }}>{e.detail}</span>
            </li>
          ))}
        </ul>

        <h2>Languages</h2>
        <ul style={{ margin: 0, paddingLeft: 24 }}>
          {LANGUAGES.map((l) => (
            <li key={l.lang}>
              {l.lang} — {l.level}
            </li>
          ))}
        </ul>
      </section>

      <p className="brutAst" />

      <section id="contact">
        <h2>Contact</h2>
        <ul style={{ margin: 0, paddingLeft: 24 }}>
          <li>
            <a href={`mailto:${ME.email}`}>{ME.email}</a>
          </li>
          <li>Phone: {ME.phone}</li>
          <li>
            <a href={ME.socials.github}>GitHub</a>
          </li>
          <li>
            <a href={ME.socials.linkedin}>LinkedIn</a>
          </li>
        </ul>
      </section>

      <p className="brutAst" />

      <p style={{ fontSize: 13, color: "#555", textAlign: "center" }}>
        Last modified: {updated}. No cookies. No tracking. No frameworks visible.
      </p>
      <p className="brutColophon">
        © Flavio Manyari 2026<span className="brutCursor" />
      </p>
    </>
  );
}
