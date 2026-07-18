import type { ReactElement } from "react";
import { ME, PROJECTS, SKILLS, SERVICES, LANGUAGES, TICKER, WORKFLOW } from "@/content";

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
  .brutAboutRow { display: flex; align-items: flex-start; }
  .brutDropCap { font-size: 4em; line-height: 0.85; font-weight: bold; padding: 6px 10px 0 0; flex-shrink: 0; }
  .brutAboutText { margin: 0; }
  .brutWork { list-style: none; }
  .brutWork > li { position: relative; }
  .brutWork > li::before { content: "—"; position: absolute; left: -20px; color: #b0b0b0; font-weight: normal; }
  .brutAst { text-align: center; margin: 32px 0; letter-spacing: 1em; color: #888; font-size: 13px; }
  .brutAst::before { content: "* * *"; }
  .brutFootnote { vertical-align: super; font-size: 0.7em; color: #555; margin-right: 2px; }
  .brutColophon { text-align: center; margin-top: 48px; font-variant: small-caps; letter-spacing: 0.15em; font-size: 15px; color: #000; }
  .brutCursor { display: inline-block; width: 0.5em; height: 0.95em; background: currentColor; vertical-align: -0.12em; margin-left: 5px; animation: brutBlink 1.1s steps(1) infinite; }
  .brutFooter { margin-top: 40px; border-top: 3px double #9aa0a8; padding-top: 22px; }
  .brutFootCols { display: flex; gap: clamp(36px, 8vw, 72px); margin-bottom: 22px; }
  .brutFootLabel { display: block; font-variant: small-caps; letter-spacing: 0.06em; font-weight: bold; font-size: 13px; color: #555; margin-bottom: 8px; }
  .brutFootCols ul { list-style: none; padding: 0; margin: 0; }
  .brutFootCols li { padding: 2px 0; font-size: 13px; }
  .brutFootBottom { display: flex; justify-content: space-between; align-items: baseline; gap: 12px; flex-wrap: wrap; border-top: 1px solid #000; padding-top: 12px; }
  .brutFootCopy { font-variant: small-caps; letter-spacing: 0.15em; font-size: 13px; color: #000; }
  .brutTopLink { font-size: 13px; }
  @keyframes brutBlink { 50% { opacity: 0; } }

  /* infinite seamless ticker */
  .brutMarq { border-top: 1px solid currentColor; border-bottom: 1px solid currentColor; padding: 6px 0; margin: 0 0 24px; overflow: hidden; }
  .brutMarqTrack { display: inline-flex; white-space: nowrap; letter-spacing: 0.05em; animation: brutScroll 105s linear infinite; }
  .brutMarq:hover .brutMarqTrack { animation-play-state: paused; }
  .brutMarqTrack span { flex-shrink: 0; font-size: 15px; }
  .brutMarqSep { margin: 0 10px; color: #444; letter-spacing: 0; }
  @keyframes brutScroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
  @media (prefers-reduced-motion: reduce) { .brutMarqTrack { animation: none; } }

  /* services */
  .brutServices { list-style: none; padding: 0; margin: 0; column-count: 2; column-gap: 44px; }
  @media (max-width: 620px) { .brutServices { column-count: 1; } }
  .brutServices li { margin: 0 0 9px; break-inside: avoid; }
  .brutSvcNum { color: #999; margin-right: 12px; font-variant-numeric: tabular-nums; }

  /* tools */
  .brutWorkflow { margin: 0 0 20px; font-style: italic; font-size: 17px; color: #222; }
  .brutTools { display: flex; flex-direction: column; gap: 16px; }
  .brutToolLabel { display: block; font-variant: small-caps; letter-spacing: 0.06em; font-weight: bold; font-size: 13px; margin-bottom: 1px; }
  .brutToolItems { display: block; color: #222; }
  .brutLangs { margin-top: 22px; font-size: 15px; color: #333; }

  /* contact */
  .brutContact { list-style: none; padding: 0; margin: 0; line-height: 2; }
  .brutRefsLabel { margin: 26px 0 6px; font-variant: small-caps; letter-spacing: 0.07em; font-weight: bold; font-size: 13px; color: #666; }
  .brutRefs { font-size: 13px; color: #555; padding-left: 0; margin: 0; line-height: 1.85; list-style: none; }
  .brutRefs li { padding-left: 22px; text-indent: -22px; }
  .brutRefs a { word-break: break-word; }
  .brutRefNum { color: #999; margin-right: 5px; }
`;

/** Infinite, seamless services ticker. Pure CSS - two identical halves, translateX(-50%). */
export function Marquee(): ReactElement {
  const tags = [ME.role, ...TICKER];
  const unit = (rk: string) => (
    <span key={rk}>
      {tags.map((t, i) => (
        <span key={i}>{t}{"  •  "}</span>
      ))}
      <a href="#contact">Available now</a>
      {"  •  "}
    </span>
  );
  // 8 identical units; translateX(-50%) moves 4 => seamless loop. Pauses on hover so the link is clickable.
  return (
    <div className="brutMarq">
      <div className="brutMarqTrack">
        {[0, 1, 2, 3].map((n) => unit(`a${n}`))}
        {[0, 1, 2, 3].map((n) => unit(`b${n}`))}
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
        <div className="brutAboutRow">
          <span className="brutDropCap">{ME.about.charAt(0)}</span>
          <p className="brutAboutText">{ME.about.slice(1)}</p>
        </div>
      </section>

      <p className="brutAst" />

      <section id="work">
        <h2>Selected Work</h2>
        <ol className="brutWork" style={{ margin: 0, paddingLeft: 24 }}>
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
              {" - "}
              <em>{p.role}</em>
              {" ("}
              {p.year}
              {")"}
              <br />
              <span style={{ fontSize: 15, opacity: 0.85 }}>{p.blurb}</span>
            </li>
          ))}
        </ol>

        <p className="brutRefsLabel">References</p>
        <ol className="brutRefs">
          {PROJECTS.map((p, i) => {
            const kind = p.tag === "self" ? "Own brand" : p.tag === "personal" ? "Personal project" : "Client work";
            return (
              <li key={p.slug}>
                <span className="brutRefNum">{i + 1}.</span>
                {p.title} ({p.year}). {kind}.{" "}
                <a href={p.url ?? "#"} target="_blank" rel="noopener noreferrer">
                  {(p.url ?? "").replace(/^https?:\/\//, "")}
                </a>
                .
              </li>
            );
          })}
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
        <p className="brutWorkflow">{WORKFLOW}</p>
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
        <p style={{ marginTop: 0, fontSize: 21, fontStyle: "italic" }}>Let&apos;s build something.</p>
        <p style={{ margin: "0 0 4px" }}>
          Based in {ME.location}. Available for freelance or full-time.
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
            <a href="#">Portfolio {"↗︎"}</a>
          </li>
          <li style={{ color: "#555", fontSize: 14 }}>Full CV on request.</li>
        </ul>
      </section>

      <p className="brutAst" />

      <footer className="brutFooter">
        <div className="brutFootCols">
          <div>
            <span className="brutFootLabel">Index</span>
            <ul>
              {NAV_SECTIONS.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`}>{s.label}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <span className="brutFootLabel">Contact</span>
            <ul>
              <li>
                <a href={`mailto:${ME.email}`}>{ME.email}</a>
              </li>
              <li>
                <a href={ME.socials.whatsapp} target="_blank" rel="noopener noreferrer">WhatsApp</a>
                {" · "}
                <a href={ME.socials.github} target="_blank" rel="noopener noreferrer">GitHub</a>
              </li>
              <li>
                <a href={ME.socials.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
              </li>
            </ul>
          </div>
        </div>
        <div className="brutFootBottom">
          <span className="brutFootCopy">© Flavio Manyari 2026<span className="brutCursor" /></span>
          <a href="#top" className="brutTopLink">Back to top ↑</a>
        </div>
      </footer>
    </>
  );
}
