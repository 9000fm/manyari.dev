import type { ReactElement } from "react";
import { ME, PROJECTS, SKILLS, TICKER, EXPERIENCE } from "@/content";
import {
  ME_ES, PROJECTS_ES, EXPERIENCE_ES, SKILLS_ES,
  UI_ES,
} from "@/content.es";

// Spanish lookups. A miss returns undefined, React drops the data-es attribute,
// and that one element stays English instead of blanking out.
const esProj = (slug: string) => PROJECTS_ES[slug];
const esJob = (company: string, period: string) => EXPERIENCE_ES[company + period];

/**
 * Shared brutalist / raw-HTML content for the portfolio homepage.
 * Layout lives in the page; the document body + typographic aesthetic live here.
 * Private folder (leading underscore) => not a route.
 */

// Monobook wiki-link blue - the ONE link colour, shared with the page chrome
// (topline, TOC "[hide]", toolbox, mobile menu all use it already).
export const BLUE = "#0645ad";

export const SHARED_CSS = `
  /* Type scale - the ONLY sizes allowed. Everything maps to one of these. */
  :root { --t-name: 28px; --t-head: 24px; --t-lead: 19px; --t-body: 18px; --t-small: 16px; --t-micro: 13px; }
  .brut a { color: ${BLUE}; }
  .brut h1, .brut h2 { font-variant: small-caps; letter-spacing: 0.04em; font-weight: normal; }
  .brut h2 { font-size: var(--t-head); margin: 32px 0 14px; padding-bottom: 5px; border-bottom: 1px solid currentColor; }
  .brut h2:first-child { margin-top: 0; }
  .brutAboutRow { display: flex; align-items: flex-start; }
  .brutDropCap { font-size: 4em; line-height: 0.85; font-weight: bold; padding: 6px 10px 0 0; flex-shrink: 0; }
  .brutAboutText { margin: 0; }
  /* Selected Work - "figura arriba" (lab-work option A): plate full width on
     top like a paper figure, text below, hairline rules between entries. */
  .brutWork { list-style: none; }
  .brutWork > li { position: relative; -webkit-tap-highlight-color: transparent; margin: 0 0 26px; padding: 0 0 22px; border-bottom: 1px solid #e3e6ea; }
  .brutWork > li:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }

  /* work plates - Wikipedia thumb frame. #c8ccd1 and #f6f7f9 already exist in
     the palette (.side border, GREY_PANEL), so this adds no new colours.
     Cap at the PNG's natural 440px so the 1-bit dither never CSS-upscales. */
  .brutPlate { max-width: 440px; margin: 0 0 10px; padding: 3px; border: 1px solid #c8ccd1; background: #f6f7f9; }
  .brutPlate img { display: block; width: 100%; height: auto; }
  .brutPlate figcaption { font-size: var(--t-micro); color: #555; line-height: 1.45; padding: 4px 2px 1px; }
  .brutWorkHead { margin: 0 0 2px; }
  .brutWorkBlurb { margin: 0; font-size: var(--t-small); opacity: 0.85; }
  .brutAst { text-align: center; margin: 32px 0; letter-spacing: 1em; color: #888; font-size: var(--t-micro); }
  /* letter-spacing adds a trailing 1em after the last asterisk; pull it back
     so the glyphs sit on true centre */
  .brutAst::before { content: "* * *"; margin-right: -1em; }
  .brutFootnote { vertical-align: super; font-size: 0.7em; color: #555; margin-right: 2px; }
  .brutColophon { text-align: center; margin-top: 48px; font-variant: small-caps; letter-spacing: 0.15em; font-size: var(--t-small); color: #000; }
  .brutCursor { display: inline-block; width: 0.5em; height: 0.95em; background: currentColor; vertical-align: -0.12em; margin-left: 5px; animation: brutBlink 1.1s steps(1) infinite; }
  .brutFooter { margin-top: 40px; border-top: 3px double #9aa0a8; padding-top: 22px; }
  .brutFootCols { display: flex; gap: clamp(36px, 8vw, 72px); margin-bottom: 22px; }
  .brutFootLabel { display: block; font-variant: small-caps; letter-spacing: 0.06em; font-weight: bold; font-size: var(--t-micro); color: #555; margin-bottom: 8px; }
  .brutFootCols ul { list-style: none; padding: 0; margin: 0; }
  .brutFootCols li { padding: 2px 0; font-size: var(--t-small); }
  .brutFootBottom { display: flex; justify-content: space-between; align-items: baseline; gap: 12px; flex-wrap: wrap; border-top: 1px solid #000; padding-top: 12px; }
  .brutFootCopy { font-variant: small-caps; letter-spacing: 0.15em; font-size: var(--t-micro); color: #000; }
  .brutTopLink { font-size: var(--t-micro); }
  @keyframes brutBlink { 50% { opacity: 0; } }
  @media (prefers-reduced-motion: reduce) { .brutCursor { animation: none; } }

  /* infinite seamless ticker - NOT used by the live page (v11a), which uses the
     static .topline instead. Still rendered by the frozen v11b/v11c variants. */
  .brutMarq { border-top: 1px solid currentColor; border-bottom: 1px solid currentColor; padding: 6px 0; margin: 0 0 24px; overflow: hidden; }
  .brutMarqTrack { display: inline-flex; white-space: nowrap; letter-spacing: 0.05em; animation: brutScroll 105s linear infinite; }
  .brutMarq:hover .brutMarqTrack { animation-play-state: paused; }
  .brutMarqTrack span { flex-shrink: 0; font-size: var(--t-small); }
  .brutMarqSep { margin: 0 10px; color: #444; letter-spacing: 0; }
  @keyframes brutScroll { from { transform: translateX(0); } to { transform: translateX(-50%); } }
  @media (prefers-reduced-motion: reduce) { .brutMarqTrack { animation: none; } }

  /* services */

  /* tools */
  .brutTools { display: flex; flex-direction: column; gap: 16px; }
  .brutToolLabel { display: block; font-variant: small-caps; letter-spacing: 0.06em; font-weight: bold; font-size: var(--t-micro); margin-bottom: 1px; }
  .brutToolItems { display: block; color: #222; }

  /* contact - the email is the section's one big object; everything else is a small row under it */
  .brutMail { font-size: var(--t-head); margin: 6px 0 10px; }
  .brutChannels { font-size: var(--t-small); margin: 0; }
  .brutBased { margin: 12px 0 0; font-size: var(--t-small); color: #555; }

  .brutRefsLabel { margin: 26px 0 6px; font-variant: small-caps; letter-spacing: 0.07em; font-weight: bold; font-size: var(--t-micro); color: #666; }
  .brutRefs { font-size: var(--t-micro); color: #555; padding-left: 0; margin: 0; line-height: 1.85; list-style: none; }
  .brutRefs li { padding-left: 22px; text-indent: -22px; }
  .brutRefs a { word-break: break-word; }
  .brutRefNum { color: #6f6f6f; margin-right: 5px; }

  /* experience / education - CV two-column: company + dates left, role + blurb right */
  .brutExp { list-style: none; padding: 0; margin: 0; }
  .brutExp > li { display: grid; grid-template-columns: 190px 1fr; gap: 26px; margin: 0 0 22px; }
  .brutExp > li:last-child { margin-bottom: 0; }
  .brutExpMeta strong { display: block; font-weight: bold; }
  .brutExpMeta span { display: block; color: #555; font-size: var(--t-small); margin-top: 2px; }
  .brutExpBody { min-width: 0; }
  .brutExpRole { display: block; font-weight: bold; font-size: var(--t-lead); margin-bottom: 3px; }
  .brutExpBody p { margin: 0; font-size: var(--t-small); opacity: 0.9; }
  @media (max-width: 620px) {
    .brutExp > li { grid-template-columns: 1fr; gap: 3px; margin-bottom: 20px; }
    .brutExpMeta { margin-bottom: 4px; }
    .brutExpMeta span { display: inline; margin-right: 12px; }
  }
`;

/** Infinite, seamless services ticker. Pure CSS - two identical halves, translateX(-50%).
 *  The live page (v11a) deliberately does NOT use this, see commit 08a4246; it is
 *  kept for the frozen v11b-wide and v11c-split variants, which still render it. */
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
  { id: "about", label: "about", labelEs: UI_ES.tocAbout },
  { id: "work", label: "work", labelEs: UI_ES.tocWork },
  { id: "experience", label: "experience", labelEs: UI_ES.tocExperience },
  { id: "tools", label: "skills", labelEs: UI_ES.tocSkills },
  { id: "contact", label: "contact", labelEs: UI_ES.tocContact },
] as const;

/** The document body: About -> References. */
export function Sections(): ReactElement {
  return (
    <>
      <section id="about" className="brutAbout">
        <h2 data-es={UI_ES.about}>About</h2>
        <div className="brutAboutRow">
          <span className="brutDropCap" data-es={ME_ES.about.charAt(0)}>{ME.about.charAt(0)}</span>
          <p className="brutAboutText" data-es={ME_ES.about.slice(1)}>{ME.about.slice(1)}</p>
        </div>
      </section>

      <p className="brutAst" />

      <section id="work">
        <h2 data-es={UI_ES.work}>Selected Work</h2>
        <ol className="brutWork" style={{ margin: 0, padding: 0 }}>
          {PROJECTS.map((p, i) => (
            <li key={p.slug}>
              {/* The plate deliberately contains no <a>: WorkHover maps each row
                  to its project via the first anchor inside the <li>, so a link
                  here would silently kill the hover previews for the whole list. */}
              {p.plate ? (
                <figure className="brutPlate">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={p.plate}
                    alt={p.plateAlt ?? ""}
                    width={p.plateW}
                    height={p.plateH}
                    loading={i === 0 ? "eager" : "lazy"}
                    decoding="async"
                  />
                  <figcaption
                    data-es={esProj(p.slug) ? `Fig. ${i + 1}. ${esProj(p.slug).plateCap}` : undefined}
                  >
                    Fig. {i + 1}. {p.plateCap}
                  </figcaption>
                </figure>
              ) : null}
              <p className="brutWorkHead">
                {p.url ? (
                  <a href={p.url} target="_blank" rel="noopener noreferrer" style={{ fontWeight: "bold" }}>
                    {p.title}
                  </a>
                ) : (
                  <strong>{p.title}</strong>
                )}
                <span className="brutFootnote">[{i + 1}]</span>
                {" - "}
                <em data-es={esProj(p.slug)?.role}>{p.role}</em>
                {" ("}
                {p.year}
                {")"}
              </p>
              <p className="brutWorkBlurb" data-es={esProj(p.slug)?.blurb}>{p.blurb}</p>
            </li>
          ))}
        </ol>

        <p className="brutRefsLabel" data-es={UI_ES.references}>References</p>
        <ol className="brutRefs">
          {PROJECTS.map((p, i) => {
            const kind = p.tag === "self" ? "Own brand" : p.tag === "personal" ? "Personal project" : "Client work";
            const kindEs = p.tag === "self" ? UI_ES.ownBrand : p.tag === "personal" ? UI_ES.personalProject : UI_ES.clientWork;
            return (
              <li key={p.slug}>
                <span className="brutRefNum">{i + 1}.</span>
                {p.title} ({p.year}). <span data-es={kindEs}>{kind}</span>.{" "}
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

      <section id="experience">
        <h2 data-es={UI_ES.experience}>Experience</h2>
        <ol className="brutExp">
          {EXPERIENCE.map((job) => (
            <li key={job.company + job.period}>
              <div className="brutExpMeta">
                <strong data-es={esJob(job.company, job.period)?.company}>{job.company}</strong>
                <span data-es={esJob(job.company, job.period)?.period}>{job.period}</span>
                {job.location ? (
                  <span data-es={esJob(job.company, job.period)?.location}>{job.location}</span>
                ) : null}
              </div>
              <div className="brutExpBody">
                <span className="brutExpRole" data-es={esJob(job.company, job.period)?.title}>{job.title}</span>
                <p data-es={esJob(job.company, job.period)?.blurb}>{job.blurb}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <p className="brutAst" />

      <section id="tools">
        <h2 data-es={UI_ES.skills}>Skills</h2>
        <div className="brutTools">
          {SKILLS.map((g) => (
            <div key={g.label}>
              <span className="brutToolLabel" data-es={SKILLS_ES[g.label]}>{g.label}</span>
              <span className="brutToolItems">{g.items.join(", ")}</span>
            </div>
          ))}
        </div>
      </section>

      <p className="brutAst" />

      <section id="contact">
        <h2 data-es={UI_ES.contact}>Contact</h2>
        <p style={{ marginTop: 0, fontSize: "var(--t-lead)", fontStyle: "italic" }} data-es={UI_ES.contactLead}>Tell me what you need.</p>
        <p className="brutMail">
          <a href={`mailto:${ME.email}`}>{ME.email}</a>
        </p>
        <p className="brutChannels">
          <a href={ME.socials.whatsapp} target="_blank" rel="noopener noreferrer">WhatsApp</a>
          {" · "}
          <a href={ME.socials.github} target="_blank" rel="noopener noreferrer">GitHub</a>
          {" · "}
          <a href={ME.socials.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
          {" · "}
          <a href="/Flavio-Manyari-CV.pdf" data-es-href="/Flavio-Manyari-CV-ES.pdf" target="_blank" rel="noopener noreferrer" data-es={`${UI_ES.downloadCv} ↗︎`}>Download CV {"↗︎"}</a>
        </p>
        <p className="brutBased" data-es={UI_ES.contactBased}>
          Based in {ME.location}. Spanish and English. Available for freelance or full-time.
        </p>
      </section>

      <p className="brutAst" />

      <footer className="brutFooter">
        <div className="brutFootCols">
          <div>
            <span className="brutFootLabel" data-es={UI_ES.footIndex}>Index</span>
            <ul>
              {NAV_SECTIONS.map((s) => (
                <li key={s.id}>
                  <a href={`#${s.id}`} data-es={s.labelEs}>{s.label}</a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <span className="brutFootLabel" data-es={UI_ES.contact}>Contact</span>
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
          <a href="#top" className="brutTopLink" data-es={`${UI_ES.backToTop} ↑`}>Back to top ↑</a>
        </div>
      </footer>
    </>
  );
}
