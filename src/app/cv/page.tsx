"use client";
import { ME, EXPERIENCE, EDUCATION, SKILLS, PROJECTS, LANGUAGES } from "@/content";

/**
 * Print-ready CV in the site's Monobook/Times aesthetic. Linked from Contact
 * as "Download CV". A4-optimised: the toolbar is hidden in print, so Save as
 * PDF (or the Download button) produces a clean one/two-page document. Content
 * is pulled from content.ts, so the CV stays in sync with the site.
 */
export default function CV() {
  const clean = (u: string | null) => (u ?? "").replace(/^https?:\/\//, "");
  return (
    <main className="cv">
      <style>{CSS}</style>

      <div className="cvBar">
        <button onClick={() => window.print()}>&#8595; Download PDF</button>
        <a href="/">&#8592; back to site</a>
      </div>

      <article className="cvSheet">
        <header className="cvHead">
          <h1>{ME.name}</h1>
          <p className="cvRole">{ME.role}</p>
          <p className="cvContact">
            <a href={`mailto:${ME.email}`}>{ME.email}</a>
            {" · "}{ME.phone}{" · "}{ME.location}
            <br />
            <a href={ME.socials.github}>{clean(ME.socials.github)}</a>
            {" · "}
            <a href={ME.socials.linkedin}>linkedin</a>
            {" · "}
            <a href="https://manyari.dev">manyari.dev</a>
          </p>
          <p className="cvSummary">
            Web design and development, end to end - from identity to deployment.
            4+ years across e-commerce, editorial portfolios, and independent
            products, with a creative-coding edge (WebGL, generative visuals).
          </p>
        </header>

        <div className="cvGrid">
          <div className="cvMain">
            <section>
              <h2>Experience</h2>
              {EXPERIENCE.map((job) => (
                <div className="cvItem" key={job.company + job.period}>
                  <div className="cvMeta">
                    <strong>{job.company}</strong>
                    <span>{job.period}</span>
                    {job.location ? <span>{job.location}</span> : null}
                  </div>
                  <div className="cvBody">
                    <span className="cvTitle">{job.title}</span>
                    <p>{job.blurb}</p>
                  </div>
                </div>
              ))}
            </section>

            <section>
              <h2>Selected Work</h2>
              <ul className="cvWork">
                {PROJECTS.map((p) => (
                  <li key={p.slug}>
                    <a href={p.url ?? "#"}>{p.title}</a> - <em>{p.role}</em> ({p.year})
                    <br />
                    <span>{p.blurb}</span>
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <aside className="cvSide">
            <section>
              <h2>Skills</h2>
              {SKILLS.map((g) => (
                <div className="cvSkill" key={g.label}>
                  <span className="cvSkillLabel">{g.label}</span>
                  <span>{g.items.join(", ")}</span>
                </div>
              ))}
            </section>

            <section>
              <h2>Education</h2>
              {EDUCATION.map((ed) => (
                <div className="cvEd" key={ed.school}>
                  <strong>{ed.title}</strong>
                  <span>{ed.school} · {ed.period}</span>
                  {ed.detail ? <span className="cvEdDetail">{ed.detail}</span> : null}
                </div>
              ))}
            </section>

            <section>
              <h2>Languages</h2>
              <p className="cvLangs">
                {LANGUAGES.map((l) => `${l.lang} (${l.level})`).join(", ")}.
              </p>
            </section>
          </aside>
        </div>
      </article>
    </main>
  );
}

const CSS = `
  :root { --c-name: 30px; --c-h2: 15px; --c-body: 12px; --c-small: 11px; --c-micro: 10px; }
  .cv { background: #232220; min-height: 100vh; padding: 24px 16px 60px;
        font-family: "Times New Roman", Times, serif; color: #000; }
  .cvBar { max-width: 820px; margin: 0 auto 16px; display: flex; gap: 14px; align-items: center; }
  .cvBar button, .cvBar a { font-family: inherit; font-size: 13px; color: #a7d7f9;
        background: none; border: 1px solid #55606c; padding: 6px 12px; cursor: pointer;
        text-decoration: none; }
  .cvBar button:hover, .cvBar a:hover { color: #fff; border-color: #a7d7f9; }

  .cvSheet { max-width: 820px; margin: 0 auto; background: #fff; border: 1px solid #a7d7f9;
        padding: 40px 44px; box-shadow: 0 8px 40px rgba(0,0,0,0.5); }
  .cvHead h1 { font-variant: small-caps; letter-spacing: 0.04em; font-weight: normal;
        font-size: var(--c-name); line-height: 1; margin: 0; }
  .cvRole { font-style: italic; font-size: var(--c-body); color: #333; margin: 4px 0 0; }
  .cvContact { font-size: var(--c-small); color: #444; margin: 8px 0 0; line-height: 1.5; }
  .cvContact a { color: #0645ad; }
  .cvSummary { font-size: var(--c-body); line-height: 1.5; margin: 12px 0 0;
        border-top: 1px solid #ccc; padding-top: 12px; }

  .cvGrid { display: grid; grid-template-columns: 1fr 250px; gap: 34px; margin-top: 20px; }
  .cv h2 { font-variant: small-caps; letter-spacing: 0.05em; font-weight: normal;
        font-size: var(--c-h2); border-bottom: 1px solid #000; padding-bottom: 3px;
        margin: 0 0 10px; }
  .cv section { margin-bottom: 18px; break-inside: avoid; }

  .cvItem { display: grid; grid-template-columns: 120px 1fr; gap: 14px; margin-bottom: 12px;
        break-inside: avoid; }
  .cvMeta strong { display: block; font-size: var(--c-body); }
  .cvMeta span { display: block; color: #555; font-size: var(--c-micro); margin-top: 1px; }
  .cvTitle { display: block; font-weight: bold; font-size: var(--c-body); }
  .cvBody p { margin: 2px 0 0; font-size: var(--c-small); color: #222; line-height: 1.45; }

  .cvWork { list-style: none; padding: 0; margin: 0; }
  .cvWork li { margin-bottom: 8px; font-size: var(--c-small); line-height: 1.45; break-inside: avoid; }
  .cvWork a { color: #0645ad; font-weight: bold; }
  .cvWork span { color: #444; }

  .cvSkill { margin-bottom: 8px; font-size: var(--c-small); }
  .cvSkillLabel { display: block; font-variant: small-caps; letter-spacing: 0.05em;
        font-weight: bold; font-size: var(--c-micro); color: #555; }
  .cvSkill span:last-child { color: #222; }
  .cvEd { margin-bottom: 10px; font-size: var(--c-small); }
  .cvEd strong { display: block; }
  .cvEd span { display: block; color: #555; font-size: var(--c-micro); }
  .cvEdDetail { margin-top: 1px; }
  .cvLangs { font-size: var(--c-small); color: #333; margin: 0; }

  @media print {
    @page { size: A4; margin: 12mm; }
    .cv { background: #fff; padding: 0; }
    .cvBar { display: none; }
    .cvSheet { max-width: none; border: none; box-shadow: none; padding: 0; }
    a { color: #000 !important; text-decoration: none; }
  }
  @media (max-width: 680px) {
    .cvGrid { grid-template-columns: 1fr; gap: 20px; }
    .cvSheet { padding: 26px 22px; }
  }
`;
