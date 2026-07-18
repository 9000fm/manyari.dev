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
  .brut h2 { font-size: 24px; margin: 32px 0 12px; }
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
  .brutMarqTrack { display: inline-flex; white-space: nowrap; animation: brutScroll 45s linear infinite; }
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
  .brutWa { width: 14px; height: 14px; vertical-align: -2px; margin-right: 3px; fill: currentColor; }
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

function WaIcon(): ReactElement {
  return (
    <svg className="brutWa" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.885-9.885 9.885M20.52 3.449C18.24 1.245 15.24 0 12.045 0 5.463 0 .104 5.359.101 11.945c0 2.096.549 4.14 1.595 5.945L0 24l6.335-1.652a11.882 11.882 0 005.71 1.447h.006c6.585 0 11.946-5.359 11.949-11.945a11.821 11.821 0 00-3.48-8.4" />
    </svg>
  );
}

/** The document body: About -> Contact. */
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
          Available for freelance or full-time. Let&apos;s build something that sells.
        </p>
        <ul className="brutContact">
          <li>
            <a href={`mailto:${ME.email}`}>{ME.email}</a>
          </li>
          <li>
            <WaIcon />
            <a href={ME.socials.whatsapp} target="_blank" rel="noopener noreferrer">
              WhatsApp
            </a>{" "}
            · {ME.phone}
          </li>
          <li>
            <a href={ME.socials.github} target="_blank" rel="noopener noreferrer">
              GitHub
            </a>{" "}
            ·{" "}
            <a href={ME.socials.linkedin} target="_blank" rel="noopener noreferrer">
              LinkedIn
            </a>
          </li>
          <li style={{ color: "#555", fontSize: 14 }}>Full CV on request.</li>
        </ul>
      </section>

      <p className="brutAst" />

      <p className="brutColophon">
        © Flavio Manyari 2026<span className="brutCursor" />
      </p>
    </>
  );
}
