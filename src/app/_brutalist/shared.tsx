import type { ReactElement } from "react";
import LangSwitch from "./LangSwitch";
import BotanicalSprig from "./BotanicalSprig";
import { ME, PROJECTS, SKILLS, SKILL_LABELS, EXPERIENCE, LANGUAGES, type Project } from "@/content";
import {
  ME_ES, PROJECTS_ES, EXPERIENCE_ES, SKILLS_ES, SKILL_ITEMS_ES, LANGUAGES_ES,
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

/** Shared social links with visible labels. Brand glyphs from Bootstrap Icons (MIT). */
export function SocialLinks({ includeWhatsApp = false }: { includeWhatsApp?: boolean }) {
  return (
    <span className="socialLinks">
      <a href={ME.socials.github} target="_blank" rel="noopener noreferrer">
        <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27s1.36.09 2 .27c1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8"/></svg>
        GitHub
      </a>
      <a href={ME.socials.linkedin} target="_blank" rel="noopener noreferrer">
        <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854zm4.943 12.248V6.169H2.542v7.225zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248S2.4 3.226 2.4 3.934c0 .694.521 1.248 1.327 1.248zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016l.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225z"/></svg>
        LinkedIn
      </a>
      {includeWhatsApp && <a href={ME.socials.whatsapp} target="_blank" rel="noopener noreferrer">WhatsApp</a>}
    </span>
  );
}

export const SHARED_CSS = `
  .socialLinks { display: flex; flex-wrap: wrap; align-items: center; gap: 8px 16px; }
  .socialLinks a { display: inline-flex; align-items: center; gap: 6px; white-space: nowrap; }
  .socialLinks svg { width: 15px; height: 15px; flex: none; fill: currentColor; }

  /* Editorial type scale. Rem units respect browser font preferences. */
  :root { --t-name: 1.75rem; --t-head: 1.625rem; --t-lead: 1.25rem; --t-body: 1.0625rem; --t-small: 1rem; --t-meta: 0.9375rem; --t-micro: 0.875rem; }
  .brut a { color: ${BLUE}; }
  .brut h1, .brut h2 { font-variant: small-caps; letter-spacing: 0.04em; font-weight: normal; }
  .brut h2 { font-size: var(--t-head); margin: 32px 0 14px; padding-bottom: 5px; border-bottom: 1px solid currentColor; }
  .brut h2:first-child { margin-top: 0; }
  /* Classic drop cap: three lines tall, the paragraph wraps around it, its foot on
     the third baseline. A plain float, tuned by eye for Times at 18px / 1.6
     (initial-letter was tried and Chromium did not apply it to the span). */
  .brutAboutText { margin: 0; }
  .brutAboutText + .brutAboutText { margin-top: 1em; }
  .brutInitial { float: left; display: inline-flex; align-items: center; gap: 0.12em; margin: 0 0.48em 0 0; }
  .brutDropCap { font-weight: bold; font-size: 5.3em; line-height: 0.78; padding-top: 0.04em; }
  .brutSprig { display: block; width: 3em; height: 4.65em; flex: none; overflow: visible; }
  @media (max-width: 420px) { .brutSprig { width: 2.7em; height: 4.24em; } .brutInitial { margin-right: 0.38em; } }
  /* Selected Work - "figura arriba" (lab-work option A): plate full width on
     top like a paper figure, text below, hairline rules between entries. */
  .brutWork { list-style: none; }
  .brutWork > li { position: relative; -webkit-tap-highlight-color: transparent; margin: 0 0 26px; padding: 0 0 22px; border-bottom: 1px solid #e3e6ea; }
  .brutWork > li:last-child { border-bottom: none; margin-bottom: 0; padding-bottom: 0; }

  /* work plates - Wikipedia thumb frame. #c8ccd1 and #f6f7f9 already exist in
     the palette (.side border, GREY_PANEL), so this adds no new colours.
     Cap at the PNG's natural 440px so the 1-bit dither never CSS-upscales. */
  .brutPlate { max-width: 440px; margin: 0 0 10px; padding: 3px; border: 1px solid #c8ccd1; background: #f6f7f9; }
  .brutPlate a[href] { display: block; }
  .brutPlate a[href]:focus-visible { outline: 2px solid #0645ad; outline-offset: 2px; }
  .brutPlate img { display: block; width: 100%; height: auto; }
  .brutPlate figcaption { font-size: var(--t-micro); color: #555; line-height: 1.45; padding: 4px 2px 1px; }
  /* One hierarchy for each project: name, role/year, description, stack. */
  .brutWorkHead { margin: 0 0 3px; font-size: var(--t-lead); font-weight: bold; line-height: 1.3; }
  .brutWorkHead a { text-decoration: underline; text-decoration-thickness: 1px; text-underline-offset: 3px; }
  .brutWorkMeta { margin: 0 0 9px; font-size: var(--t-meta); font-style: italic; color: #45494d; line-height: 1.5; }
  .brutWorkYear { white-space: nowrap; }
  .brutWorkBlurb { margin: 0; font-size: var(--t-body); color: #202122; line-height: 1.6; }
  .brutWork > li[id] { scroll-margin-top: 16px; }
  .brutWorkTech { margin: 9px 0 0; font-size: var(--t-small); line-height: 1.45; color: #202122; }
  .brutWorkTechLabel { display: block; margin-bottom: 3px; }
  .brutWorkTechItems { font-weight: normal; }
  /* Shared editorial metadata treatment: no arbitrary tracking/weights. */
  .brutWorkTechLabel, .brutRefsLabel, .brutFootLabel {
    font-variant: small-caps; font-size: var(--t-small); font-weight: normal;
    letter-spacing: 0.035em; color: #45494d;
  }
  @media (max-width: 899px) { .brutWork > li[id] { scroll-margin-top: 72px; } }
  .brutAst { text-align: center; margin: 32px 0; letter-spacing: 1em; color: #888; font-size: var(--t-micro); }
  /* letter-spacing adds a trailing 1em after the last asterisk; pull it back
     so the glyphs sit on true centre */
  .brutAst::before { content: "* * *"; margin-right: -1em; }
  .brutFootnote { vertical-align: super; font-size: 0.7em; color: #555; margin-right: 2px; }
  .brutColophon { text-align: center; margin-top: 48px; font-variant: small-caps; letter-spacing: 0.15em; font-size: var(--t-small); color: #000; }
  .brutCursor { display: inline-block; width: 0.5em; height: 0.95em; background: currentColor; vertical-align: -0.12em; margin-left: 5px; animation: brutBlink 1.1s steps(1) infinite; }
  .brutFooter { margin-top: 40px; border-top: 1px solid #9aa0a8; padding-top: 22px; }
  .brutFootCols { display: grid; grid-template-columns: minmax(0, 1fr) minmax(0, 1.45fr); gap: clamp(20px, 5vw, 56px); margin-bottom: 22px; }
  .brutFootThanks { margin-top: 0.65em !important; }
  .brutFootNote { margin: 0; font-size: var(--t-small); line-height: 1.6; max-width: 34ch; }
  @media (max-width: 420px) { .brutFootCols { grid-template-columns: minmax(0, 1fr); gap: 20px; } }
  .brutFootLabel { display: block; margin-bottom: 8px; }
  .brutFootCols ul { list-style: none; padding: 0; margin: 0; }
  .brutFootCols li { padding: 2px 0; font-size: var(--t-small); }
  .brutFootBottom { display: flex; justify-content: space-between; align-items: baseline; gap: 12px; flex-wrap: wrap; border-top: 1px solid #000; padding-top: 12px; }
  .brutFootCopy { font-variant: small-caps; letter-spacing: 0.15em; font-size: var(--t-micro); color: #000; }
  .brutTopLink { font-size: var(--t-meta); }
  @keyframes brutBlink { 50% { opacity: 0; } }
  @media (prefers-reduced-motion: reduce) { .brutCursor { animation: none; } }

  /* services */

  /* Skills and contact: compact Monobook reference table / directory. */
  .brutTools, .brutContactDirectory { margin: 0; }
  .brutTools { border: 1px solid #c8ccd1; }
  .brutTools > div, .brutContactDirectory > div { display: grid; grid-template-columns: minmax(0, 32%) minmax(0, 1fr); border-bottom: 1px solid #c8ccd1; }
  .brutTools > div:last-child, .brutContactDirectory > div:last-child { border-bottom: 0; }
  .brutToolLabel, .brutContactDirectory dt { font-variant: small-caps; font-size: var(--t-small); font-weight: bold; letter-spacing: 0.015em; color: #202122; line-height: 1.4; }
  .brutToolLabel { background: #f6f7f9; border-right: 1px solid #c8ccd1; padding: 10px 12px; font-weight: bold; line-height: 1.4; }
  .brutToolItems { margin: 0; padding: 10px 12px; font-size: var(--t-small); color: #222; overflow-wrap: anywhere; }
  .brutContactLead { margin: 0 0 14px; font-size: var(--t-lead); font-style: italic; }
  .brutContactDirectory { border-top: 1px solid #c8ccd1; }
  .brutContactDirectory dt, .brutContactDirectory dd { margin: 0; padding: 9px 0; }
  .brutContactDirectory dt { padding-right: 10px; }
  .brutContactDirectory dd { min-width: 0; font-size: var(--t-small); overflow-wrap: anywhere; }
  .brutContactDirectory .brutMail { font-size: var(--t-lead); }
  @media (max-width: 620px) {
    .brutTools > div, .brutContactDirectory > div { grid-template-columns: minmax(0, 1fr); }
    .brutToolLabel { border-right: 0; padding: 6px 10px; }
    .brutToolItems { padding: 8px 10px; }
    .brutContactDirectory dt { padding: 6px 0 0; }
    .brutContactDirectory dd { padding: 0 0 8px; }
  }

  .brutRefsLabel { margin: 26px 0 6px; }
  .brutRefs { font-size: var(--t-meta); color: #34373a; padding-left: 0; margin: 0; line-height: 1.7; list-style: none; }
  .brutRefs li { padding-left: 22px; text-indent: -22px; margin-bottom: 4px; }
  .brutRefs a { word-break: break-word; }
  .brutRefNum { color: #45494d; margin-right: 5px; }

  /* experience / education - CV two-column: company + dates left, role + blurb right */
  .brutExp { list-style: none; padding: 0; margin: 0; }
  .brutExp > li { display: grid; grid-template-columns: 190px 1fr; gap: 26px; margin: 0 0 22px; }
  .brutExp > li:last-child { margin-bottom: 0; }
  .brutExpMeta strong { display: block; font-weight: bold; font-size: var(--t-lead); line-height: 1.35; }
  .brutExpMeta span { display: block; color: #45494d; font-size: var(--t-meta); margin-top: 4px; line-height: 1.5; }
  .brutExpBody { min-width: 0; }
  .brutExpRole { display: block; font-weight: bold; font-size: var(--t-lead); line-height: 1.35; margin-bottom: 4px; }
  .brutExpBody p { margin: 0; font-size: var(--t-body); line-height: 1.6; color: #202122; }
  @media (max-width: 620px) {
    .brutExp > li { grid-template-columns: 1fr; gap: 3px; margin-bottom: 20px; }
    .brutExpMeta { margin-bottom: 4px; }
    .brutExpMeta span { display: inline; margin-right: 12px; }
  }
`;

/** Section anchor list, reused by the sidebar TOC. */
export const NAV_SECTIONS = [
  { id: "about", label: "About", labelEs: UI_ES.tocAbout },
  { id: "work", label: "Selected Projects", labelEs: UI_ES.work },
  { id: "experience", label: "Experience", labelEs: UI_ES.tocExperience },
  { id: "tools", label: "Skills", labelEs: UI_ES.tocSkills },
  { id: "contact", label: "Contact", labelEs: UI_ES.tocContact },
] as const;

function ProjectList({ projects }: { projects: Project[] }) {
  return (
    <ol className="brutWork" style={{ margin: 0, padding: 0 }}>
      {projects.map((p, i) => (
        <li key={p.slug} id={"project-" + p.slug}>
          {p.plate ? (
            <figure className="brutPlate">
              <a href={p.url ?? undefined} target={p.url ? "_blank" : undefined} rel={p.url ? "noopener noreferrer" : undefined} aria-label={p.url ? p.title : undefined}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.plate}
                  alt={p.plateAlt ?? ""}
                  width={p.plateW}
                  height={p.plateH}
                  loading={i === 0 ? "eager" : "lazy"}
                  decoding="async"
                />
              </a>
              <figcaption data-es={esProj(p.slug)?.plateCap}>{p.plateCap}</figcaption>
            </figure>
          ) : null}
          <h3 className="brutWorkHead">
            {p.url ? (
              <a href={p.url} target="_blank" rel="noopener noreferrer">
                {p.title}
              </a>
            ) : (
              <strong>{p.title}</strong>
            )}
            <span className="brutFootnote">[{i + 1}]</span>
          </h3>
          <p className="brutWorkMeta">
            <span data-es={esProj(p.slug)?.role}>{p.role}</span>
            {" · "}<span className="brutWorkYear">{p.year}</span>
          </p>
          <p className="brutWorkBlurb" data-es={esProj(p.slug)?.blurb}>{p.blurb}</p>
          <p className="brutWorkTech">
            <span className="brutWorkTechLabel" data-es="Tecnologías">Technologies</span>{" "}
            <span className="brutWorkTechItems">
              {p.technologies.map((tech, index) => (
                <span key={tech}>{index > 0 ? " · " : null}{tech}</span>
              ))}
            </span>
          </p>
        </li>
      ))}
    </ol>
  );
}

/** The document body: About -> References. */
export function Sections(): ReactElement {
  const [aboutIntro, aboutDetails, aboutContact] = ME.about.split("\n\n");
  const [aboutIntroEs, aboutDetailsEs, aboutContactEs] = ME_ES.about.split("\n\n");
  const [aboutBeforeContact, aboutAfterContact] = aboutContact.split(ME.aboutContactLabel);
  const [aboutBeforeContactEs, aboutAfterContactEs] = aboutContactEs.split(ME_ES.aboutContactLabel);
  return (
    <>
      <section id="about" className="brutAbout">
        <div className="aboutHead">
          <h2 data-es={UI_ES.about}>About</h2>
          <div className="langBar"><LangSwitch variant="button" /></div>
        </div>
        <p className="brutAboutText">
          <span className="brutInitial">
            <BotanicalSprig />
            <span className="brutDropCap" data-es={ME_ES.about.charAt(0)}>{ME.about.charAt(0)}</span>
          </span>
          <span data-es={aboutIntroEs.slice(1)}>{aboutIntro.slice(1)}</span>
        </p>
        <p className="brutAboutText" data-es={aboutDetailsEs}>{aboutDetails}</p>
        <p className="brutAboutText">
          <span data-es={aboutBeforeContactEs}>{aboutBeforeContact}</span>
          <a href="#contact" data-es={ME_ES.aboutContactLabel}>{ME.aboutContactLabel}</a>
          <span data-es={aboutAfterContactEs}>{aboutAfterContact}</span>
        </p>
      </section>

      <p className="brutAst" />

      <section id="work">
        <h2 data-es="Proyectos seleccionados">Selected Projects</h2>
        <ProjectList projects={PROJECTS} />

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
        <dl className="brutTools">
          {SKILLS.map((g) => (
            <div key={g.label}>
              <dt className="brutToolLabel" data-es={SKILLS_ES[g.label]}>{SKILL_LABELS[g.label] ?? g.label}</dt>
              <dd className="brutToolItems" data-es={SKILL_ITEMS_ES[g.label]}>{g.items.join(", ")}</dd>
            </div>
          ))}
        </dl>
      </section>

      <p className="brutAst" />

      <section id="contact">
        <h2 data-es={UI_ES.contact}>Contact</h2>
        <p className="brutContactLead" data-es={UI_ES.contactLead}>Available for independent projects and remote positions.</p>
        <dl className="brutContactDirectory">
          <div>
            <dt data-es={UI_ES.email}>Email</dt>
            <dd><a className="brutMail" href={`mailto:${ME.email}`}>{ME.email}</a></dd>
          </div>
          <div>
            <dt data-es="Enlaces externos">External links</dt>
            <dd>
              <SocialLinks includeWhatsApp />
            </dd>
          </div>
          <div>
            <dt data-es="CV">CV</dt>
            <dd><a href="/Flavio-Manyari-CV-ATS.pdf" data-es-href="/Flavio-Manyari-CV-ATS-ES.pdf" target="_blank" rel="noopener noreferrer" data-es="Ver CV (PDF) ↗">View CV (PDF) ↗</a></dd>
          </div>
          <div>
            <dt data-es="Ubicación">Location</dt>
            <dd data-es="Lima, Perú">Lima, Peru</dd>
          </div>
          <div>
            <dt data-es={UI_ES.languages}>Languages</dt>
            <dd data-es={LANGUAGES.map((l) => {
              const translated = LANGUAGES_ES[l.lang];
              return `${translated.lang} (${translated.level.toLowerCase()})`;
            }).join(", ")}>{LANGUAGES.map((l) => `${l.lang} (${l.level.toLowerCase()})`).join(", ")}</dd>
          </div>
        </dl>
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
            <span className="brutFootLabel" data-es="Notas del sitio">Site notes</span>
            <p className="brutFootNote" data-es="Una web inspirada en los inicios de internet.">A personal site inspired by the early days of the web.</p>
            <p className="brutFootNote brutFootThanks" data-es="Gracias por tomarte el tiempo de revisar mi trabajo.">Thanks for taking the time to explore my work.</p>
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
