import { ME } from "@/content";
import { SHARED_CSS, Sections, NAV_SECTIONS, SocialLinks } from "./_brutalist/shared";
import { UI_ES, ME_ES } from "@/content.es";
import WireSphere from "./_brutalist/WireSphere";
import MobileNav from "./_brutalist/MobileNav";
import WelcomeBanner from "./_brutalist/WelcomeBanner";
import WorkHoverLazy from "./_brutalist/WorkHoverLazy";
import SmoothScroll from "./_brutalist/SmoothScroll";
import SmoothWheel from "./_brutalist/SmoothWheel";
import LangSwitch from "./_brutalist/LangSwitch";
import "./portfolio.css";

const NOW = new Date();
const UPDATED = NOW.toLocaleDateString("en-GB", { month: "long", year: "numeric" });
const UPDATED_ES = NOW.toLocaleDateString("es-ES", { month: "long", year: "numeric" });

function CvLink({ compact = false }: { compact?: boolean }) {
  return <a className={compact ? "mobileCv" : "sideCv"} href="/Flavio-Manyari-CV-ATS.pdf" data-es-href="/Flavio-Manyari-CV-ATS-ES.pdf" target={compact ? undefined : "_blank"} rel="noopener noreferrer" download={compact || undefined}>
    <span data-es={compact ? "CV (PDF)" : "Ver CV (PDF) ↗"}>{compact ? "CV (PDF)" : "View CV (PDF) ↗"}</span>
    {compact && <svg className="cvDownloadIcon" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="square" strokeLinejoin="miter" aria-hidden="true" focusable="false"><path d="M8 2v8M4.5 6.5 8 10l3.5-3.5M3 11v3h10v-3"/></svg>}
  </a>;
}

export default function BrutalistSidebar() {
  return (
    <main id="top" className="brut portfolio">
      <style>{SHARED_CSS}</style>
      <MobileNav />
      <SmoothScroll />
      <SmoothWheel />
      <div className="wrap">
        <div className="topline">
          <span className="toplineCopy">
            <span className="toplinePart" data-es={ME_ES.topline.split(" · ").slice(0, 2).join(" · ")}>{ME.topline.split(" · ").slice(0, 2).join(" · ")}</span>
            <span className="toplineDivider" aria-hidden="true">{" · "}</span>
            <span className="toplinePart" data-es={ME_ES.topline.split(" · ").slice(2).join(" · ")}>{ME.topline.split(" · ").slice(2).join(" · ")}</span>
          </span>
        </div>
        <div className="bodyGrid">
          <aside className="side">
            <header className="identity">
              <div className="identSphere"><WireSphere size={200} /></div>
              <h1 className="identName"><span>Flavio</span>{" "}<span>Manyari</span></h1>
              <p className="identRole" data-es={ME_ES.role}>{ME.role}</p>
              <p className="sideAvailable"><span data-es="Actualmente disponible">Available for work</span></p>
              <div className="identContact">
                <a className="identMail" href={`mailto:${ME.email}`}>{ME.email}</a><CvLink compact />
              </div>
              <div className="identLang"><LangSwitch /></div>
              <nav className="mobileLinks" aria-label="Social links"><SocialLinks includeWhatsApp /></nav>
            </header>
            <div className="sideExtra">
              <div className="sideGroup">
                <h2 data-es="Enlaces externos">External links</h2>
                <nav aria-label="External links" className="sideTools">
                  <a href={ME.socials.github} target="_blank" rel="noopener noreferrer">GitHub</a>
                  <a href={ME.socials.linkedin} target="_blank" rel="noopener noreferrer">LinkedIn</a>
                  <CvLink />
                </nav>
              </div>
            </div>
            <details className="wikiToc" id="wikiToc" open suppressHydrationWarning>
              <summary data-es={UI_ES.contents}>Contents</summary>
              <div className="wikiTocPanel">
                <ol>
                  {NAV_SECTIONS.map((s) => <li key={s.id}><a href={"#" + s.id} data-es={s.labelEs} aria-current={s.id === "about" ? "location" : undefined}>{s.label}</a></li>)}
                </ol>
              </div>
            </details>
            <div className="sideExtra">
              <details className="sideNote" id="wikiNote" open suppressHydrationWarning>
                <summary><h2><span className="noteIcon" aria-hidden="true">i</span><span data-es="Nota">Note</span></h2></summary>
                <p data-es="Una web inspirada en los inicios de internet. Gracias por tomarte el tiempo de revisar mi trabajo.">A personal site inspired by the early days of the web. Thanks for taking the time to explore my work.</p>
              </details>
              <p className="sideColophon" data-es={`${UI_ES.colophon} ${UPDATED_ES}.`}>This page was last edited {UPDATED}.</p>
            </div>
            <script dangerouslySetInnerHTML={{__html:'try{document.getElementById("wikiToc").open=matchMedia("(min-width:900px)").matches;document.getElementById("wikiNote").open=!matchMedia("(min-width:900px) and (max-height:654px)").matches}catch(e){}'}} />
          </aside>
          <div className="mainColumn">
            <WelcomeBanner />
            <article className="content">
              <div className="inner"><Sections /></div>
            </article>
          </div>
        </div>
      </div>
      <WorkHoverLazy />
    </main>
  );
}
