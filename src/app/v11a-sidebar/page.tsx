import type { Metadata } from "next";
import { ME } from "@/content";
import { SHARED_CSS, Sections, NAV_SECTIONS } from "../_brutalist/shared";
import LangSwitch from "../_brutalist/LangSwitch";
import { UI_ES, ME_ES } from "@/content.es";
import WireSphere from "../_brutalist/WireSphere";
import MobileNav from "../_brutalist/MobileNav";
import WelcomeBanner from "../_brutalist/WelcomeBanner";
import WorkHoverLazy from "../_brutalist/WorkHoverLazy";
import SmoothScroll from "../_brutalist/SmoothScroll";
import SmoothWheel from "../_brutalist/SmoothWheel";

export const metadata: Metadata = { title: "flavio manyari - designer & developer" };

// build-time "last updated" for the sidebar colophon - refreshes on each deploy
const NOW = new Date();
const UPDATED = NOW.toLocaleDateString("en-GB", { month: "long", year: "numeric" });
// the month name has to be localised too, or the Spanish colophon reads
// "por ultima vez en August 2026"
const UPDATED_ES = NOW.toLocaleDateString("es-ES", { month: "long", year: "numeric" });

// Classic Monobook palette: dark desk, grey page frame, white article box.
const GREY_PAGE = "#232220";   // desk background (warm charcoal, behind the page frame)
const BLUE_LINE = "#a7d7f9";   // Monobook light-blue border
const GREY_PANEL = "#f6f7f9";  // light grey panels (ticker, toc)

const LAYOUT_CSS = `
  html { scroll-behavior: smooth; touch-action: manipulation; }
  @media (prefers-reduced-motion: reduce) { html { scroll-behavior: auto; } }
  .brut { padding: 28px 26px; box-sizing: border-box; font-size: var(--t-body); }
  /* the page frame - a defined window/PDF edge so the ticker ends at the page limit */
  .wrap { max-width: 1160px; margin: 0 auto; padding: 0; background: #e9ebef; border: 1px solid #7c828b; box-shadow: 0 8px 40px rgba(0,0,0,0.55); }
  .grid { display: grid; gap: 32px; grid-template-columns: 1fr; margin: 0; padding: 14px 26px 44px; }

  .side { display: flex; flex-direction: column; padding-top: 2px; }
  .side h1 { font-size: var(--t-name); line-height: 0.98; margin: 0; }
  .identRow { display: flex; flex-direction: row; align-items: flex-start; justify-content: space-between; gap: 12px; }
  .identText { min-width: 0; }
  /* fixed box so the sphere's space is always reserved - the name never shifts
     when the globe mounts (placeholder -> null frame -> real canvas all fit here) */
  .identSphere { flex-shrink: 0; width: 215px; height: 215px; display: flex; align-items: center; justify-content: center; }
  .sideMeta { color: #444; font-size: var(--t-small); margin: 6px 0 0; }
  .sideMeta a { text-decoration: underline; }

  /* content = the white "article" box with the Monobook blue border */
  .content { min-width: 0; background: #fff; border: 1px solid ${BLUE_LINE}; padding: 18px 30px 40px; }
  .content .inner { max-width: none; }

  /* static top line (replaced the scrolling ticker) - non-moving, document-like */
  .topline { text-align: center; font-size: var(--t-micro); color: #444; background: ${GREY_PANEL}; border-bottom: 1px solid ${BLUE_LINE}; padding: 9px 18px; letter-spacing: 0.02em; }
  .topline a { color: #0645ad; }
  /* language switch: wiki chrome, not a control. The active language is plain
     dark text like the rest of the topline; the other one is a blue link. */
  .langSwitch { white-space: nowrap; }
  .langSwitch button { font: inherit; letter-spacing: inherit; background: none; border: 0; padding: 0; }
  .langSwitch .langOff { color: #0645ad; text-decoration: underline; cursor: pointer; }
  .langSwitch .langOff:hover { text-decoration: none; }
  .langSwitch .langOn { color: #444; font-weight: bold; cursor: default; }
  .langSwitch button:focus-visible { outline: 1px solid #0645ad; outline-offset: 2px; }

  /* welcome banner - full-width yellow wiki notice at the top, above Contents; dismissible */
  .welcome { position: relative; display: flex; align-items: center; justify-content: center; text-align: center; background: #fdf3d7; border: 1px solid #e0cf95; padding: 12px 46px; margin: 14px 26px 0; font-size: var(--t-body); line-height: 1.5; color: #111; }
  .welcome b { font-weight: bold; }
  .welcomeText { margin: 0; }
  /* padded out to a ~44px hit area (WCAG target size); glyph stays put */
  .welcomeX { position: absolute; top: 0; right: 0; background: none; border: none; font-size: var(--t-lead); line-height: 1; color: #6f6f6f; cursor: pointer; padding: 10px 12px; }
  .welcomeX:hover { color: #000; }
  /* dismissal: the notice is squashed flat instead of just clipped away.
     .welcomeInner's overflow:hidden traps the notice's 14px top margin inside
     the row, so it collapses too and leaves no gap.
     The box's scaleY and the row's 1fr -> 0fr share the exact same duration and
     curve, so the squashing box always fills the shrinking row precisely - no
     gap, no early-clipped border. scaleX overshoots to 1.045 for the squash-and-
     stretch bulge (horizontal, so it can't break that vertical lock), and the
     text scales down harder than its parent so it looks crushed into the seam
     rather than sliding under it. Transform + opacity only: GPU, no repaint. */
  .welcomeWrap { display: grid; grid-template-rows: 1fr; transition: grid-template-rows 0.42s cubic-bezier(0.16,0.84,0.28,1); }
  .welcomeWrap.isLeaving { grid-template-rows: 0fr; pointer-events: none; }
  .welcomeInner { overflow: hidden; min-height: 0; }
  .welcome { transform-origin: top center; transition: transform 0.42s cubic-bezier(0.16,0.84,0.28,1), opacity 0.3s ease 0.12s; }
  .welcomeText, .welcomeX { transform-origin: top center; transition: transform 0.42s cubic-bezier(0.16,0.84,0.28,1); }
  /* the box can only bulge to ~1.047 before it outgrows .wrap and overflow:hidden
     starts shaving its side borders, so the box stays at that ceiling and the
     extra drama goes into the text: it splays wider as it is crushed flatter
     than its own container. opacity is delayed 0.12s so the crush is legible
     before it fades out. */
  .welcomeWrap.isLeaving .welcome { transform: scaleY(0) scaleX(1.045); opacity: 0; will-change: transform, opacity; }
  .welcomeWrap.isLeaving .welcomeText { transform: scaleY(0.18) scaleX(1.07); }
  .welcomeWrap.isLeaving .welcomeX { transform: scaleY(0.18); }
  @media (prefers-reduced-motion: reduce) {
    .welcomeWrap, .welcome, .welcomeText, .welcomeX { transition: none; }
    .welcomeWrap.isLeaving .welcome { transform: none; }
  }

  /* numbered Contents [hide] box */
  .wikiToc { border: 1px solid #a2a9b1; background: ${GREY_PANEL}; display: inline-block; padding: 8px 18px 11px; margin: 18px 0 0; font-size: var(--t-small); }
  .wikiToc summary { cursor: pointer; font-weight: bold; list-style: none; user-select: none; }
  .wikiToc summary::-webkit-details-marker { display: none; }
  .wikiToc summary::after { content: " [hide]"; font-weight: normal; color: #0645ad; font-size: var(--t-micro); }
  .wikiToc:not([open]) summary::after { content: " [show]"; }
  /* pseudo-element text is CSS, not a text node, so data-es cannot reach it */
  html[lang="es"] .wikiToc summary::after { content: " [ocultar]"; }
  html[lang="es"] .wikiToc:not([open]) summary::after { content: " [mostrar]"; }
  .wikiToc ol { list-style: decimal outside; margin: 8px 0 0; padding-left: 26px; }
  .wikiToc li { display: list-item; padding: 2px 0; }

  /* sidebar toolbox + colophon - fills the space under Contents on desktop */
  .sideTools { margin-top: 20px; }
  .sideToolsLabel { display: block; font-variant: small-caps; letter-spacing: 0.06em; font-weight: bold; font-size: var(--t-micro); color: #555; margin-bottom: 6px; }
  .sideTools ul { list-style: none; margin: 0; padding: 0; font-size: var(--t-small); }
  .sideTools li { padding: 2px 0; }
  .sideTools a { color: #0645ad; text-decoration: none; }
  .sideTools a:hover { text-decoration: underline; }
  /* #5f5f5f: 4.5:1+ on the grey sidebar panel (#6f6f6f failed AA at 4.48) */
  .langList { list-style: none; margin: 0; padding: 0; font-size: var(--t-small); }
  .langList li { padding: 2px 0; }
  .langList button, .langSwitch button { font: inherit; letter-spacing: inherit; background: none; border: 0; padding: 0; text-align: left; }
  .langList .langOff, .langSwitch .langOff { color: #0645ad; cursor: pointer; }
  .langList .langOff:hover, .langSwitch .langOff:hover { text-decoration: underline; }
  .langList .langOn, .langSwitch .langOn { color: #202122; font-weight: bold; cursor: default; }
  .langList button:focus-visible, .langSwitch button:focus-visible { outline: 1px solid #0645ad; outline-offset: 2px; }

  /* interlanguage button, Vector 2022 shape: hairline box, language glyph, the
     name of the edition it takes you to. Sits flush with the right edge of the
     text column and clears the first heading. */
  .langBar { display: flex; justify-content: flex-end; margin: 0 0 10px; }
  .langBtn { display: inline-flex; align-items: center; justify-content: center; font: inherit;
    background: #f8f9fa; border: 1px solid #a2a9b1; border-radius: 2px;
    padding: 3px 9px; cursor: pointer; line-height: 1.35;
    transition: background 0.12s ease, border-color 0.12s ease; }
  .langBtn:hover, .langBtn.langBtnOpen { background: #eaecf0; border-color: #72777d; }
  .langBtn:focus-visible { outline: 2px solid #0645ad; outline-offset: 1px; }
  .langBtnIcon { font-size: var(--t-small); color: #202122; letter-spacing: 0.02em; }

  /* Panel of editions, placed at the pointer rather than pinned to the button,
     so on a phone the choices land under the thumb that opened them. */
  .langPop { position: fixed; z-index: 240; min-width: 132px;
    background: #fff; border: 1px solid #a2a9b1; box-shadow: 0 6px 18px rgba(0,0,0,0.22);
    padding: 7px 0 6px; font-size: var(--t-small); }
  .langPopLabel { display: block; font-variant: small-caps; letter-spacing: 0.06em;
    font-weight: bold; font-size: var(--t-micro); color: #555; padding: 0 12px 4px;
    margin-bottom: 3px; border-bottom: 1px solid #eaecf0; }
  .langPop button { display: block; width: 100%; text-align: left; font: inherit;
    background: none; border: 0; padding: 5px 12px; cursor: pointer; }
  .langPop .langOff { color: #0645ad; }
  .langPop .langOff:hover { background: #eaecf0; }
  .langPop .langOn { color: #202122; font-weight: bold; cursor: default; }
  .langPop button:focus-visible { outline: 2px solid #0645ad; outline-offset: -2px; }
  @media (prefers-reduced-motion: reduce) { .langBtn { transition: none; } }
  .sideColophon { margin-top: 16px; padding-top: 12px; border-top: 1px solid #c8ccd1; font-size: var(--t-micro); color: #5f5f5f; line-height: 1.7; }

  /* mobile sticky header (FM + burger) - hidden on desktop */
  .mnav { display: none; }

  @media (min-width: 900px) {
    .grid { grid-template-columns: 264px 1fr; }
    .side { position: sticky; top: 18px; align-self: start; padding: 16px 16px 20px; background: #f0f2f5; border: 1px solid #c8ccd1; }
    .identRow { flex-direction: column-reverse; align-items: stretch; gap: 16px; }
    .identSphere { align-self: center; }
    .identText { padding-left: 2px; }
    .wikiToc { margin-left: 0; }
  }
  @media (max-width: 899px) {
    /* land section headings below the fixed mobile navbar, not under it */
    section[id], #top { scroll-margin-top: 72px; }
    .brut { padding: 0 0 8px; }
    .wrap { border-left: none; border-right: none; }
    .grid { padding: 12px 22px 40px; }
    .content { padding: 16px 22px 36px; }
    /* shrinks with the viewport so MANYARI never runs under the globe (<380px) */
    :root { --t-name: clamp(26px, 9vw, 34px); }
    .identRow { align-items: center; }
    .identText { padding-left: 8px; }
    .identSphere { width: 168px; height: 168px; }
    .identSphere canvas { width: 168px !important; height: 168px !important; }
    /* The sidebar is the TOP of the page on mobile, so what is not identity or
       contents comes out of it. The language button lives over the document and
       is unaffected. */
    .sideTools, .sideColophon { display: none; }
    /* keep 46px sides: less than that and the centered text runs under the X */
    .welcome { padding: 11px 46px; margin: 12px 22px 0; }

    /* "Article chrome" header (lab pick): the bar is wiki furniture - grey
       panel, Monobook blue rule, name in small caps, contents [show]/[hide].
       visibility toggles with the slide so the hidden bar's links are never
       keyboard-focusable while invisible (transform alone leaves them tabbable) */
    .mnav { display: flex; align-items: center; justify-content: space-between; position: fixed; top: 0; left: 0; right: 0; z-index: 100; background: ${GREY_PANEL}; border-bottom: 1px solid ${BLUE_LINE}; padding: 5px 16px; transform: translateY(-101%); visibility: hidden; transition: transform 0.28s ease, visibility 0s 0.28s; will-change: transform; pointer-events: none; }
    .mnav.mnavShown { transform: translateY(0); visibility: visible; transition: transform 0.28s ease, visibility 0s 0s; pointer-events: auto; }
    /* .mnav prefix: outranks the generic .brut a link blue */
    .mnav .mnavBrand { font-variant: small-caps; letter-spacing: 0.05em; font-size: var(--t-body); color: #000; text-decoration: none; padding: 11px 4px; }
    .mnavTog { display: inline-flex; align-items: center; min-height: 44px; background: none; border: none; font: inherit; font-size: var(--t-small); color: #0645ad; cursor: pointer; padding: 0 4px; }
    /* the drop squishes open and releases the entries one by one */
    .mnavDrop { position: absolute; top: 100%; left: 0; right: 0; display: grid; grid-template-rows: 0fr; visibility: hidden; transition: grid-template-rows 0.34s cubic-bezier(0.16,0.84,0.28,1), visibility 0s 0.34s; }
    .mnavDrop.on { grid-template-rows: 1fr; visibility: visible; transition: grid-template-rows 0.34s cubic-bezier(0.16,0.84,0.28,1), visibility 0s 0s; }
    .mnavDropIn { overflow: hidden; min-height: 0; background: ${GREY_PANEL}; box-shadow: 0 10px 24px rgba(0,0,0,0.22); }
    .mnavList { list-style: none; margin: 0; padding: 8px 18px 12px 18px; border-bottom: 1px solid ${BLUE_LINE}; font-size: var(--t-small); }
    .mnavList li { opacity: 0; }
    .mnavDrop.on .mnavList li { animation: mnavIn 0.3s cubic-bezier(0.16,0.84,0.28,1) both; animation-delay: calc(50ms + var(--i) * 45ms); }
    .mnavList a { display: block; padding: 8px 0; color: #0645ad; text-decoration: none; }
    .mnavLangs { padding: 10px 18px 14px 44px; }
    .mnavLangsLabel { display: block; font-variant: small-caps; letter-spacing: 0.06em; font-weight: bold; font-size: var(--t-micro); color: #555; margin-bottom: 3px; }
    .mnavLangs .langList li { padding: 6px 0; }
  }
  @keyframes mnavIn { from { opacity: 0; transform: translateY(-7px); } to { opacity: 1; transform: none; } }
  @media (prefers-reduced-motion: reduce) {
    .mnav, .mnavDrop { transition: none; }
    .mnavDrop.on .mnavList li { animation: none; opacity: 1; }
  }
`;

export default function BrutalistSidebar() {
  return (
    <main
      id="top"
      className="brut"
      style={{
        background: GREY_PAGE,
        color: "#000",
        minHeight: "100vh",
        fontFamily: '"Times New Roman", Times, serif',
        lineHeight: 1.6,
      }}
    >
      <style>{SHARED_CSS + LAYOUT_CSS}</style>

      <MobileNav />
      <SmoothScroll />
      <SmoothWheel />

      <div className="wrap">
        <div className="topline">
          <span data-es={ME_ES.role}>{ME.role}</span>
          {" · "}
          <a href="#contact" data-es={UI_ES.availableForWork}>Available for work</a>
          {" · "}
          <span>{ME.location}</span>
        </div>

        <WelcomeBanner />

        <div className="grid">
          <aside className="side">
            <div className="identRow">
              <div className="identText">
                <h1>
                  {ME.name.split(" ").map((w, i) => (
                    <span key={i} style={{ display: "block" }}>{w}</span>
                  ))}
                </h1>
                <p style={{ margin: "6px 0 4px", fontStyle: "italic", fontSize: "var(--t-small)" }} data-es={ME_ES.role + "."}>{ME.role}.</p>
                <p className="sideMeta">
                  <a href={`mailto:${ME.email}`}>{ME.email}</a>
                  <br />
                  <span data-es={UI_ES.status}>Status:</span> <strong data-es={ME_ES.available}>{ME.available}</strong>
                </p>
              </div>
              <div className="identSphere">
                <WireSphere size={215} />
              </div>
            </div>

            <details className="wikiToc" id="wikiToc" suppressHydrationWarning>
              <summary data-es={UI_ES.contents}>Contents</summary>
              <ol>
                {NAV_SECTIONS.map((s) => (
                  <li key={s.id}><a href={`#${s.id}`} data-es={s.labelEs}>{s.label}</a></li>
                ))}
              </ol>
            </details>
            {/* Contents ships CLOSED so mobile gets the compressed "[show]" box with
                no open-then-collapse flash. This runs while the parser is still on
                this node, before first paint, and re-opens it on desktop where the
                sidebar TOC is the whole point of the layout. Same 900px breakpoint
                as the CSS below. */}
            <script
              dangerouslySetInnerHTML={{
                __html:
                  'try{if(matchMedia("(min-width:900px)").matches)document.getElementById("wikiToc").open=true}catch(e){}',
              }}
            />

            <nav className="sideTools" aria-label="Toolbox">
              <span className="sideToolsLabel" data-es={UI_ES.toolbox}>Toolbox</span>
              <ul>
                <li><a href="/Flavio-Manyari-CV.pdf" target="_blank" rel="noopener noreferrer" data-es={UI_ES.downloadCv}>Download CV</a></li>
                <li><a href={`mailto:${ME.email}`} data-es={UI_ES.email}>Email</a></li>
                <li><a href={ME.socials.github} target="_blank" rel="noopener noreferrer">GitHub</a></li>
                <li><a href={ME.socials.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
              </ul>
            </nav>

            {/* The colophon closes the whole sidebar. */}
            <p className="sideColophon" data-es={`${UI_ES.colophon} ${UPDATED_ES}.`}>
              This page was last edited {UPDATED}.
            </p>
          </aside>

          <div className="content">
            <div className="inner">
              {/* Vector 2022 puts the interlanguage control here: a bordered
                  button at the top right of the article, above the first
                  heading. With two languages a dropdown would be theatre, so
                  the button names the edition you get by pressing it. */}
              <div className="langBar">
                <LangSwitch variant="button" />
              </div>
              <Sections />
            </div>
          </div>
        </div>
      </div>

      <WorkHoverLazy />
    </main>
  );
}
