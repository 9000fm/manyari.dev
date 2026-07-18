import type { ReactElement } from "react";
import { ME, PROJECTS, SKILLS, SERVICES, LANGUAGES } from "@/content";

/**
 * Shared brutalist / raw-HTML content for the portfolio homepage.
 * Layout lives in the page; the document body + typographic aesthetic live here.
 * Private folder (leading underscore) => not a route.
 */

export const BLUE = "#0000EE";

export const SHARED_CSS = `
  .brut a { color: ${BLUE}; }
  .brut h1, .brut h2 { font-variant: small-caps; letter-spacing: 0.04em; font-weight: normal; }
  .brut h2 { font-size: 24px; margin: 32px 0 14px; padding-bottom: 5px; border-bottom: 1px solid currentColor; }
  .brut h2:first-child { margin-top: 0; }
  .brutAbout p::first-letter {
    float: left; font-size: 4em; line-height: 0.85; padding: 6px 8px 0 0; font-weight: bold;
  }
  .brutAst { text-align: center; margin: 32px 0; letter-spacing: 1em; color: #888; font-size: 14px; }
  .brutAst::before { content: "* * *"; }
  .brutFootnote { vertical-align: super; font-size: 0.7em; color: #555; margin-right: 2px; }
  .brutColophon { text-align: center; margin-top: 48px; font-variant: small-caps; letter-spacing: 0.15em; font-size: 15px; color: #000; }
  .brutCursor { display: inline-block; width: 0.5em; height: 0.95em; background: currentColor; vertical-align: -0.12em; margin-left: 5px; animation: brutBlink 1.1s steps(1) infinite; }
  @keyframes brutBlink { 50% { opacity: 0; } }

  /* infinite seamless ticker */
  .brutMarq { border-top: 1px solid currentColor; border-bottom: 1px solid currentColor; padding: 6px 0; margin: 0 0 24px; overflow: hidden; }
  .brutMarqTrack { display: inline-flex; white-space: nowrap; animation: brutScroll 75s linear infinite; }
  .brutMarqTrack span { flex-shrink: 0; font-size: 15px; }
  @keyframes brutScroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
  @media (prefers-reduced-motion: reduce) { .brutMarqTrack { animation: none; } }

  /* services */
  .brutServices { list-style: none; padding: 0; margin: 0; column-count: 2; column-gap: 44px; }
  @media (max-width: 620px) { .brutServices { column-count: 1; } }
  .brutServices li { margin: 0 0 9px; break-inside: avoid; }
  .brutSvcNum { color: #999; margin-right: 12px; font-variant-numeric: tabular-nums; }

  /* tools */
  .brutTools { display: flex; flex-direction: column; gap: 16px; }
  .brutToolLabel { display: block; font-variant: small-caps; letter-spacing: 0.06em; font-weight: bold; font-size: 14px; margin-bottom: 1px; }
  .brutToolItems { display: block; color: #222; }
  .brutLangs { margin-top: 22px; font-size: 15px; color: #333; }

  /* contact */
  .brutContact { list-style: none; padding: 0; margin: 0; line-height: 2; }
  .brutRefs { font-size: 13px; color: #555; padding-left: 22px; margin: 0; line-height: 1.7; }
  .brutRefs a { word-break: break-word; }
`;

/** Infinite, seamless services ticker. Pure CSS - two identical halves, translateX(-50%). */
export function Marquee(): ReactElement {
  const line = [...SERVICES, ME.available, ME.email].join("  •  ") + "  •  ";
  const half = line.repeat(4); // repeat so even ultra-wide screens stay filled
  return (
    <div className="brutMarq" aria-hidden="true">
      <div className="brutMarqTrack">
        <span>{half}</span>
        <span>{half}</span>
      </div>
    </div>
  );
}

/** Section anchor list, reused by the sidebar TOC. */
export const NAV_SECTIONS = [
  { id: "about", label: "about" },
  { id: "work", label: "work" },
  { id: "services", label: "services" },
  { id: "tools", label: "tools" },
  { id: "contact", label: "contact" },
] as const;

/** The document body: About -> References. */
export function Sections(): ReactElement {
  return (
    <>
      <section id="about" className="brutAbout">
        <h2>About</h2>
        <p>{ME.about}</p>
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

      <section id="services">
        <h2>Services</h2>
        <ol className="brutServices">
          {SERVICES.map((s, i) => (
            <li key={s}>
              <span className="brutSvcNum">{String(i + 1).padStart(2, "0")}</span>
              {s}
            </li>
          ))}
        </ol>
      </section>

      <p className="brutAst" />

      <section id="tools">
        <h2>Tools</h2>
        <div className="brutTools">
          {SKILLS.map((g) => (
            <div key={g.label}>
              <span className="brutToolLabel">{g.label}</span>
              <span className="brutToolItems">{g.items.join(", ")}</span>
            </div>
          ))}
        </div>
        <p className="brutLangs">
          Languages: {LANGUAGES.map((l) => `${l.lang} (${l.level})`).join(", ")}.
        </p>
      </section>

      <p className="brutAst" />

      <section id="contact">
        <h2>Contact</h2>
        <p style={{ marginTop: 0 }}>
          Based in {ME.location}. Available for freelance or full-time - let&apos;s build something that sells.
        </p>
        <ul className="brutContact">
          <li>
            <a href={`mailto:${ME.email}`}>{ME.email}</a>
          </li>
          <li>Phone: {ME.phone}</li>
          <li>
            <a href={ME.socials.whatsapp} target="_blank" rel="noopener noreferrer">WhatsApp</a>
            {" · "}
            <a href={ME.socials.github} target="_blank" rel="noopener noreferrer">GitHub</a>
            {" · "}
            <a href={ME.socials.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
            {" · "}
            <a href="#">Portfolio ↗</a>
          </li>
          <li style={{ color: "#555", fontSize: 14 }}>Full CV on request.</li>
        </ul>
      </section>

      <p className="brutAst" />

      <section id="references">
        <h2>References</h2>
        <ol className="brutRefs">
          {PROJECTS.map((p) => (
            <li key={p.slug}>
              {p.title} -{" "}
              <a href={p.url ?? "#"} target="_blank" rel="noopener noreferrer">
                {(p.url ?? "").replace(/^https?:\/\//, "")}
              </a>
            </li>
          ))}
        </ol>
      </section>

      <p className="brutAst" />

      <p className="brutColophon">
        © Flavio Manyari 2026<span className="brutCursor" />
      </p>
    </>
  );
}
