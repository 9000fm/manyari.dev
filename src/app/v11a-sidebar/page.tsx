import type { Metadata } from "next";
import { ME } from "@/content";
import { SHARED_CSS, Sections, NAV_SECTIONS } from "../_brutalist/shared";
import WireSphereLazy from "../_brutalist/WireSphereLazy";
import MobileNav from "../_brutalist/MobileNav";
import WelcomeBanner from "../_brutalist/WelcomeBanner";
import WorkHoverLazy from "../_brutalist/WorkHoverLazy";
import SmoothScroll from "../_brutalist/SmoothScroll";

export const metadata: Metadata = { title: "flavio manyari - designer & developer" };

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
  .identSphere { flex-shrink: 0; }
  .sideMeta { color: #444; font-size: var(--t-small); margin: 6px 0 0; }
  .sideMeta a { text-decoration: underline; }

  /* content = the white "article" box with the Monobook blue border */
  .content { min-width: 0; background: #fff; border: 1px solid ${BLUE_LINE}; padding: 18px 30px 40px; }
  .content .inner { max-width: none; }

  /* static top line (replaced the scrolling ticker) - non-moving, document-like */
  .topline { text-align: center; font-size: var(--t-micro); color: #444; background: ${GREY_PANEL}; border-bottom: 1px solid ${BLUE_LINE}; padding: 9px 18px; letter-spacing: 0.02em; }
  .topline a { color: #0645ad; }

  /* welcome banner - full-width yellow wiki notice at the top, above Contents; dismissible */
  .welcome { position: relative; display: flex; align-items: center; justify-content: center; text-align: center; background: #fdf3d7; border: 1px solid #e0cf95; padding: 22px 46px; margin: 14px 26px 0; min-height: 84px; font-size: var(--t-lead); line-height: 1.55; color: #111; }
  .welcome b { font-weight: bold; }
  .welcomeText { margin: 0; }
  .welcomeX { position: absolute; top: 6px; right: 9px; background: none; border: none; font-size: 19px; line-height: 1; color: #6f6f6f; cursor: pointer; padding: 2px 7px; }
  .welcomeX:hover { color: #000; }

  /* numbered Contents [hide] box */
  .wikiToc { border: 1px solid #a2a9b1; background: ${GREY_PANEL}; display: inline-block; padding: 8px 18px 11px; margin: 18px 0 0; font-size: var(--t-small); }
  .wikiToc summary { cursor: pointer; font-weight: bold; list-style: none; user-select: none; }
  .wikiToc summary::-webkit-details-marker { display: none; }
  .wikiToc summary::after { content: " [hide]"; font-weight: normal; color: #0645ad; font-size: var(--t-micro); }
  .wikiToc:not([open]) summary::after { content: " [show]"; }
  .wikiToc ol { list-style: decimal outside; margin: 8px 0 0; padding-left: 26px; }
  .wikiToc li { display: list-item; padding: 2px 0; }

  /* mobile sticky header (FM + burger) - hidden on desktop */
  .mnav { display: none; }

  @media (min-width: 900px) {
    .grid { grid-template-columns: 264px 1fr; }
    .side { position: sticky; top: 18px; align-self: start; padding-left: 14px; padding-right: 18px; max-height: calc(100vh - 36px); overflow: auto; }
    .identRow { flex-direction: column-reverse; align-items: stretch; gap: 16px; }
    .identSphere { align-self: center; }
    .identText { padding-left: 2px; }
    .wikiToc { margin-left: 0; }
  }
  @media (max-width: 899px) {
    /* land section headings below the fixed mobile navbar, not under it */
    section[id], #top { scroll-margin-top: 64px; }
    .brut { padding: 0 0 8px; }
    .wrap { border-left: none; border-right: none; }
    .grid { padding: 12px 22px 40px; }
    .content { padding: 16px 22px 36px; }
    :root { --t-name: 34px; }
    .identRow { align-items: center; }
    .identText { padding-left: 8px; }
    .identSphere canvas { width: 168px !important; height: 168px !important; }
    .welcome { padding: 20px 30px; margin: 12px 22px 0; }

    .mnav { display: flex; align-items: center; justify-content: space-between; position: fixed; top: 0; left: 0; right: 0; z-index: 100; background: #fff; border-bottom: 1px solid #7c828b; padding: 8px 16px; transform: translateY(-101%); transition: transform 0.28s ease; will-change: transform; pointer-events: none; }
    .mnav.mnavShown { transform: translateY(0); pointer-events: auto; }
    .mnav .mnavFM { display: inline-flex; align-items: center; justify-content: center; width: 42px; height: 36px; background: #000; color: #fff; font-weight: bold; font-size: 19px; letter-spacing: 0.03em; text-decoration: none; box-sizing: border-box; }
    .mnavBurger { display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 4px; width: 42px; height: 36px; background: none; border: 1px solid #999; padding: 0 9px; cursor: pointer; box-sizing: border-box; }
    .mnavBurger span { display: block; width: 100%; height: 2px; background: #000; }
    .mnavMenu { position: absolute; top: 100%; left: 0; right: 0; background: ${GREY_PANEL}; border-bottom: 1px solid #7c828b; box-shadow: 0 8px 20px rgba(0,0,0,0.25); padding: 12px 18px 16px; font-size: var(--t-small); }
    .mnavMenuLabel { display: block; font-weight: bold; margin-bottom: 8px; }
    .mnavMenu ol { list-style: decimal outside; margin: 0; padding-left: 26px; }
    .mnavMenu li { padding: 6px 0; }
    .mnavMenu a { color: #0645ad; text-decoration: none; }
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

      <div className="wrap">
        <div className="topline">
          <span>{ME.role}</span>
          {" · "}
          <a href="#contact">Available for work</a>
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
                <p style={{ margin: "6px 0 4px", fontStyle: "italic", fontSize: "var(--t-small)" }}>{ME.role}.</p>
                <p className="sideMeta">
                  <a href={`mailto:${ME.email}`}>{ME.email}</a>
                  <br />
                  Status: <strong>{ME.available}</strong>
                </p>
              </div>
              <div className="identSphere">
                <WireSphereLazy size={215} />
              </div>
            </div>

            <details className="wikiToc" open>
              <summary>Contents</summary>
              <ol>
                {NAV_SECTIONS.map((s) => (
                  <li key={s.id}><a href={`#${s.id}`}>{s.label}</a></li>
                ))}
              </ol>
            </details>
          </aside>

          <div className="content">
            <div className="inner">
              <Sections />
            </div>
          </div>
        </div>
      </div>

      <WorkHoverLazy />
    </main>
  );
}
