import type { ReactElement } from "react";
import BadgeGrid from "./BadgeGrid";
import LangSwitch from "./LangSwitch";
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
        <span>GitHub</span>
      </a>
      <a href={ME.socials.linkedin} target="_blank" rel="noopener noreferrer">
        <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854zm4.943 12.248V6.169H2.542v7.225zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248S2.4 3.226 2.4 3.934c0 .694.521 1.248 1.327 1.248zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016l.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225z"/></svg>
        <span>LinkedIn</span>
      </a>
      {includeWhatsApp && <a href={ME.socials.whatsapp} target="_blank" rel="noopener noreferrer">
        <svg viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="M13.6 2.4A7.86 7.86 0 0 0 8.02.07a7.93 7.93 0 0 0-6.87 11.89L.03 16l4.2-1.1a7.91 7.91 0 0 0 3.79.97h.01a7.93 7.93 0 0 0 5.57-13.47ZM8.02 14.53a6.56 6.56 0 0 1-3.35-.92l-.24-.14-2.49.65.67-2.43-.16-.25a6.59 6.59 0 1 1 5.57 3.09Zm3.61-4.94c-.2-.1-1.17-.58-1.35-.65-.18-.06-.32-.1-.45.1-.13.2-.51.65-.63.78-.11.13-.23.15-.43.05-.2-.1-.84-.31-1.6-.99-.59-.53-.99-1.18-1.1-1.38-.12-.2-.01-.31.09-.41.09-.09.2-.23.3-.34.1-.11.13-.2.2-.33.06-.13.03-.25-.02-.35-.05-.1-.45-1.08-.61-1.48-.16-.39-.33-.34-.45-.35h-.38c-.13 0-.35.05-.53.25-.18.2-.7.68-.7 1.65s.72 1.91.82 2.05c.1.13 1.4 2.13 3.38 2.99.47.2.84.32 1.13.41.47.15.9.13 1.24.08.38-.06 1.17-.48 1.34-.94.17-.46.17-.86.12-.94-.05-.08-.18-.13-.38-.23Z"/></svg>
        <span>WhatsApp</span>
      </a>}
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
  /* P–03: CRT phototypesetting with widely spaced scan cuts, fitted to three text lines. */
  .brutAbout { container: about-copy / inline-size; }
  .brutAboutText { margin: 0; }
  /* Contain the drop cap in its own paragraph at any font or window width. */
  .brutAboutText:has(> .brutInitial) { display:flow-root; }
  .brutAboutText + .brutAboutText { margin-top: 1em; }
  .brutInitial { float:left; width:5em; height:4.54em; height:calc(3lh - .2em); margin:0 0.45em 0 0; }
  /* The shorter English introduction becomes two lines on wide articles.
     The Spanish introduction remains three lines. Mobile keeps the same cap. */
  @container about-copy (min-width:63em) {
    html:lang(en) .brutInitial { width:3.36em; height:2.96em; height:calc(2lh - .2em); }
  }
  .brutInitial svg { display:block; width:100%; height:100%; }
  .brutInitialText { position:absolute; width:1px; height:1px; overflow:hidden; clip-path:inset(50%); white-space:nowrap; }
  .brutAbout a { text-decoration:underline; text-underline-offset:2px; }
  @media (max-width:420px) { .brutInitial { width:4.65em; margin-right:0.42em; } }
  /* Selected Work - "figura arriba" (lab-work option A): plate full width on
     top like a paper figure, text below, hairline rules between entries. */
  .brutWork { list-style: none; }
  .brutWork > li { position: relative; -webkit-tap-highlight-color: transparent; margin: 0 0 32px; padding: 0 0 28px; border-bottom: 1px solid #e3e6ea; }
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
  .plateZoom { display:block; width:100%; padding:0; border:0; background:none; cursor:zoom-in; }
  .plateZoom:focus-visible { outline:2px solid #0645ad; outline-offset:2px; }
  .brutWorkHeading, .brutWorkDetails { min-width:0; }
  .brutVisit { margin:0 0 13px; font-size:var(--t-body); }
  .brutVisit a { text-decoration:underline; text-underline-offset:2px; }
  @media (max-width:719px) {
    .brutWorkHead { font-size:1.4rem; }
    .brutWorkMeta { margin:0 0 17px; }
    .brutPlate { max-width:none; width:100%; margin-bottom:14px; }
    .brutVisit { margin:0 0 14px; }
    .brutWorkTech { margin-top:13px; }
    .brutWork > li { padding-bottom:27px; margin-bottom:27px; border-bottom-color:#a2a9b1; }
  }
  @media (min-width:720px) {
    .brutWork > li { display:grid; grid-template-columns:minmax(0,45%) minmax(0,1fr); grid-template-areas:"plate heading" "plate detail"; grid-template-rows:auto 1fr; column-gap:clamp(20px,3vw,42px); row-gap:0; align-items:start; }
    .brutWorkHeading { grid-area:heading; }
    .brutWorkDetails { grid-area:detail; }
    .brutPlate { grid-area:plate; margin:0; width:100%; max-width:none; }
    .brutWork > li:not(:has(.brutPlate)) { grid-template-columns:minmax(0,1fr); grid-template-areas:"heading" "detail"; }
    .brutVisit { display:none; }
    .brutWorkHead { font-size:1.5rem; }
  }
  .experienceTimeline { border-left:1px solid #b5bdc7; margin-left:5px; padding-left:17px; }
  .experienceTimeline > li { position:relative; grid-template-columns:minmax(0,26%) minmax(0,1fr); gap:clamp(15px,2.7vw,33px); padding:0 0 17px; margin:0 0 17px; border-bottom:1px solid #e2e5e9; }
  .experienceTimeline > li::before { content:""; position:absolute; width:9px; height:9px; border:1px solid #68737f; background:#fff; left:-22px; top:8px; }
  .experienceTimeline > li:first-child::before { background:#46744d; border-color:#46744d; animation:currentRoleBlink 1.7776s steps(1,end) infinite; }
  @keyframes currentRoleBlink { 0%,100% { background-color:#46744d; } 50% { background-color:#fff; } }
  @media (prefers-reduced-motion:reduce) { .experienceTimeline > li:first-child::before { animation:none; } }
  .experienceTimeline > li:last-child { border-bottom:0; margin-bottom:0; padding-bottom:0; }
  @media (max-width:620px) { .experienceTimeline > li { grid-template-columns:1fr; gap:3px; } }
  .skillsJournal { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); border:0; column-gap:28px; row-gap:0; }
  .skillsJournal > div { display:block; min-width:0; padding:13px 0; border-top:1px solid #c8ccd1; border-bottom:0; }
  .skillsJournal > div:nth-last-child(-n+2) { border-bottom:1px solid #c8ccd1; }
  .skillsJournal .brutToolLabel { background:transparent; border:0; padding:0; margin:0 0 6px; font-size:var(--t-small); }
  .skillsJournal .brutToolItems { padding:0; margin:0; line-height:1.5; }
  @media (max-width:620px) { .skillsJournal { grid-template-columns:1fr; } .skillsJournal > div:nth-last-child(2) { border-bottom:0; } }
  .brutAst { margin:26px 0; }
  .brutFootCols { grid-template-columns:minmax(115px,1fr) minmax(0,3fr); gap:24px; margin-bottom:18px; }
  .brutBadges { display:grid; grid-template-columns:repeat(4,minmax(0,1fr)); gap:7.5px; width:83%; max-width:581px; align-content:start; }
  .brutBadges img { display:block; width:100%; aspect-ratio:3.1; object-fit:contain; }
  @media (max-width:719px) { .brutBadges { grid-template-columns:repeat(2,minmax(0,1fr)); max-width:299px; } }
  @media (max-width:420px) {
    .brutFootCols { grid-template-columns:minmax(0,1fr); gap:18px; }
    .brutFootCols ul { display:flex; flex-wrap:wrap; gap:0 12px; }
    .brutBadges { grid-template-columns:repeat(2,minmax(0,1fr)); max-width:299px; }
  }
  .brutFooter { padding-top:18px; margin-top:28px; }
  .contactOnlyIcon, .skillsAccordion { display:none; }
  @media (max-width:899px) {
    .brutContactLead { margin-bottom:13px; line-height:1.35; }
    .brutContactDirectory > .contactAction { display:block; }
    .brutContactDirectory > .contactAction > dt {
      position:absolute; width:1px; height:1px; padding:0; overflow:hidden; clip-path:inset(50%); white-space:nowrap;
    }
    .brutContactDirectory > .contactAction > dd { padding:0; }
    .brutContactDirectory .contactAction a {
      display:grid; grid-template-columns:24px minmax(0,1fr) 20px; column-gap:14px;
      align-items:center; width:100%; padding:9px 2px; min-height:38px; font-size:var(--t-body); line-height:1.25;
    }
    .brutContactDirectory .contactAction a > span { text-decoration:underline; text-underline-offset:2px; }
    .brutContactDirectory .contactAction a > svg { display:block; width:20px; height:20px; justify-self:center; }
    .brutContactDirectory .contactAction:not(.contactMailRow) a::after {
      content:"→"; color:#0645ad; font-size:1.2em; justify-self:end; text-decoration:none;
    }
    .brutContactDirectory .contactSocialRow .socialLinks { display:block; }
    .brutContactDirectory .contactSocialRow a + a { border-top:1px solid #c8ccd1; }
    .brutContactDirectory .contactDesktopArrow { display:none; }
    .brutContactDirectory > .contactMetaStart { margin-top:20px; border-top:1px solid #c8ccd1; }
    .brutContactDirectory > div:not(.contactAction) { grid-template-columns:minmax(0,34%) minmax(0,1fr); }
    .brutContactDirectory > div:not(.contactAction) > dt,
    .brutContactDirectory > div:not(.contactAction) > dd { padding:7px 0; font-size:var(--t-meta); line-height:1.4; }
    .brutContactDirectory > div:not(.contactAction) > dt { padding-right:9px; }
    .brutContactDirectory > div:last-child { border-bottom:1px solid #c8ccd1; }
    .skillsJournal { display:none; }
    .skillsAccordion { display:block; }
    .skillItem { border-bottom:1px solid #c8ccd1; }
    .skillItem summary {
      display:flex; align-items:center; justify-content:space-between; gap:12px; list-style:none; cursor:pointer;
      font-variant:small-caps; font-weight:bold; font-size:var(--t-small); line-height:1.4; padding:10px 2px; color:#202122;
    }
    .skillItem summary::-webkit-details-marker { display:none; }
    .skillItem summary::after {
      content:""; width:9px; height:9px; flex:none; border-right:1.5px solid #34383d; border-bottom:1.5px solid #34383d;
      transform:rotate(45deg); margin:0 7px 5px 0; transition:transform .2s ease;
    }
    .skillItem[open] summary::after { transform:rotate(225deg); margin:5px 7px 0 0; }
    .skillPanel { min-height:0; overflow:hidden; }
    .skillPanel p { margin:0; padding:0 2px 10px; font-size:var(--t-small); line-height:1.48; }
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
          <div className="brutWorkHeading">
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
          </div>
          {p.plate ? (
            <figure className="brutPlate">
              <button type="button" className="plateZoom" aria-haspopup="dialog" data-preview={p.slug} aria-label={`Preview ${p.title}`} data-es-aria-label={`Vista previa de ${p.title}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={p.plate}
                  alt={p.plateAlt ?? ""}
                  width={p.plateW}
                  height={p.plateH}
                  loading={i === 0 ? "eager" : "lazy"}
                  decoding="async"
                />
              </button>
              <figcaption data-es={esProj(p.slug)?.plateCap}>{p.plateCap}</figcaption>
            </figure>
          ) : null}
          <div className="brutWorkDetails">
          {p.url && <p className="brutVisit"><a href={p.url} target="_blank" rel="noopener noreferrer"><span data-es="Visitar sitio web">Visit website</span>{" "}<span aria-hidden="true">↗</span></a></p>}
          <p className="brutWorkBlurb" data-es={esProj(p.slug)?.blurb}>{p.blurb}</p>
          <p className="brutWorkTech">
            <span className="brutWorkTechLabel" data-es="Tecnologías">Technologies</span>{" "}
            <span className="brutWorkTechItems">
              {p.technologies.map((tech, index) => (
                <span key={tech}>{index > 0 ? " · " : null}{tech}</span>
              ))}
            </span>
          </p>
          </div>
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
        <h2 data-es={UI_ES.about}>About</h2>
        <div className="desktopLang"><LangSwitch /></div>
        <p className="brutAboutText">
          <span className="brutInitial">
            <span className="brutInitialText">H</span>
            <svg viewBox="35 0 1524 1341" aria-hidden="true" focusable="false" fill="currentColor">
              <defs>
                <mask id="cap-crt-scan" maskUnits="userSpaceOnUse" x="35" y="0" width="1524" height="1341">
                  <rect x="35" width="1524" height="1341" fill="white" />
                  <path d="M35 93H1559M35 171H1559M35 249H1559M35 327H1559M35 405H1559M35 483H1559M35 561H1559M35 639H1559M35 717H1559M35 795H1559M35 873H1559M35 951H1559M35 1029H1559M35 1107H1559M35 1185H1559M35 1263H1559" stroke="black" strokeWidth="18" />
                </mask>
              </defs>
              <g mask="url(#cap-crt-scan)">
                <path transform="translate(0 1341) scale(1 -1)" d="M35 0V74L207 100V1241L35 1268V1341H694V1268L522 1241V745H1070V1241L898 1268V1341H1559V1268L1386 1241V100L1559 74V0H898V74L1070 100V635H522V100L694 74V0Z" />
              </g>
            </svg>
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
        <ol className="brutExp experienceTimeline">
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
        <dl className="brutTools skillsJournal">
          {SKILLS.map((g) => (
            <div key={g.label}>
              <dt className="brutToolLabel" data-es={SKILLS_ES[g.label]}>{SKILL_LABELS[g.label] ?? g.label}</dt>
              <dd className="brutToolItems" data-es={SKILL_ITEMS_ES[g.label]}>{g.items.join(", ")}</dd>
            </div>
          ))}
        </dl>
        <div className="skillsAccordion">
          {SKILLS.map((g, index) => (
            <details className="skillItem" key={g.label} open={index === 0}>
              <summary><span data-es={SKILLS_ES[g.label]}>{SKILL_LABELS[g.label] ?? g.label}</span></summary>
              <div className="skillPanel"><p data-es={SKILL_ITEMS_ES[g.label]}>{g.items.join(", ")}</p></div>
            </details>
          ))}
        </div>
      </section>

      <p className="brutAst" />

      <section id="contact">
        <h2 data-es={UI_ES.contact}>Contact</h2>
        <p className="brutContactLead" data-es={UI_ES.contactLead}>Available for independent projects and remote positions.</p>
        <dl className="brutContactDirectory">
          <div className="contactAction contactMailRow">
            <dt data-es={UI_ES.email}>Email</dt>
            <dd><a className="brutMail" href={`mailto:${ME.email}`}><svg className="contactOnlyIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M2 5h20v14H2zM2 5l10 8L22 5"/></svg><span>{ME.email}</span></a></dd>
          </div>
          <div className="contactAction contactSocialRow">
            <dt data-es="Enlaces externos">External links</dt>
            <dd>
              <SocialLinks includeWhatsApp />
            </dd>
          </div>
          <div className="contactAction contactCvRow">
            <dt data-es="CV">CV</dt>
            <dd><a href="/Flavio-Manyari-CV-ATS.pdf" data-es-href="/Flavio-Manyari-CV-ATS-ES.pdf" target="_blank" rel="noopener noreferrer"><svg className="contactOnlyIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M5 2h9l5 5v15H5zM14 2v6h5"/></svg><span data-es="Ver CV (PDF)">View CV (PDF)</span><span className="contactDesktopArrow" aria-hidden="true"> ↗</span></a></dd>
          </div>
          <div className="contactMetaStart">
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
            <span className="brutFootLabel" data-es="Gracias por la visita">Thanks for visiting</span>
            <BadgeGrid />
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
