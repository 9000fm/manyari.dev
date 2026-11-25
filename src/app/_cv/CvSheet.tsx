/**
 * The printed CV, in the site's aesthetic (Times, small-caps ruled headings,
 * blue links on screen, black in print). One A4 page.
 *
 * Not a route: this folder is private (underscore), so nothing here ships.
 * `scripts/cv-pdf.mjs` mounts it on a temporary /cv route, prints
 * the public CV PDFs and removes the temporary route again. Shared resume
 * content is kept in cvData.ts for both layouts.
 */

import { getCvData, type CvLang } from "./cvData";

export type { CvLang } from "./cvData";

export default function CvSheet({ lang }: { lang: CvLang }) {
  const data = getCvData(lang);
  const { headings: t, role, summary, jobs, work, skills, education, languages, linkedin } = data;
  const github = data.github.replace(/^https?:\/\//, "");

  return (
    <main className="cv">
      <style>{CSS}</style>
      <article className="sheet">
        <header className="head">
          <h1>{data.name}</h1>
          <p className="role">{role}</p>
          <p className="contact">
            <a href={`mailto:${data.email}`}>{data.email}</a> · <a href={`tel:${data.phoneHref}`}>{data.phone}</a> · {data.location}
            <br />
            <a href="https://manyari.dev">manyari.dev</a> · <a href={data.github}>{github}</a> ·{" "}
            <a href={linkedin}>linkedin</a>
          </p>
          <p className="summary">{summary}</p>
        </header>

        <div className="grid">
          <div className="main">
            <section>
              <h2>{t.work}</h2>
              <ul className="work">
                {work.map((w) => (
                  <li key={w.title}>
                    <strong>{w.title}</strong><span className="workMeta"> · {w.year}</span>{w.url ? <> · <a href={w.url} className="workLink">{w.host}</a></> : null}<span className="workMeta"> · {w.role}</span>
                    <br />
                    {w.blurb}
                  </li>
                ))}
              </ul>
            </section>

            <section>
              <h2>{t.experience}</h2>
              {jobs.map((j) => (
                <div className="item" key={j.title + j.period}>
                  <div className="itemTop">
                    <span className="itemRole">{j.title}</span>
                    <span className="itemDates">{j.period}</span>
                  </div>
                  <div className="itemOrg">{j.company}</div>
                  <p>{j.blurb}</p>
                </div>
              ))}
            </section>
          </div>

          <aside className="side">
            <section>
              <h2>{t.skills}</h2>
              {skills.map((s) => (
                <div className="skill" key={s.label}>
                  <span className="skillLabel">{s.label}</span>
                  <span>{s.items}</span>
                </div>
              ))}
            </section>

            <section>
              <h2>{t.education}</h2>
              {education.map((e) => (
                <div className="edu" key={e.school}>
                  <strong>{e.title}</strong>
                  <span>{e.school}</span>
                  {e.lines.map((line) => <span key={line}>{line}</span>)}
                </div>
              ))}
            </section>

            <section>
              <h2>{t.languages}</h2>
              <p className="langs">{languages}</p>
            </section>
          </aside>
        </div>
      </article>
    </main>
  );
}

const CSS = `
  .cv { background: #232220; min-height: 100vh; padding: 22px 16px 50px;
        font-family: "Times New Roman", Times, serif; color: #000; }
  .sheet { max-width: 800px; margin: 0 auto; background: #fff; border: 1px solid #a7d7f9;
        padding: 46px 52px 42px; box-shadow: 0 8px 40px rgba(0,0,0,0.5); }
  /* Leading and spacing are tuned so the Spanish edition (the longer one) fits
     one A4 page: scripts/cv-pdf.mjs checks the printable sheet height. Tighten here, never cut copy. */
  .head h1 { font-variant: small-caps; letter-spacing: 0.05em; font-weight: normal; font-size: 34px;
        line-height: 1; margin: 0; }
  .role { font-style: italic; font-size: 15px; color: #333; margin: 4px 0 0; }
  .contact { font-size: 13px; color: #444; margin: 8px 0 0; line-height: 1.5; }
  .contact a { color: #0645ad; text-decoration: none; }
  .summary { font-size: 13.5px; line-height: 1.4; margin: 10px 0 0; border-top: 1px solid #ccc; padding-top: 7px; }

  .grid { display: grid; grid-template-columns: 1fr 236px; gap: 34px; margin-top: 9px; }
  .cv h2 { font-variant: small-caps; letter-spacing: 0.05em; font-weight: normal; font-size: 18px;
        border-bottom: 1px solid #000; padding-bottom: 3px; margin: 0 0 9px; }
  .cv section { margin-bottom: 12px; break-inside: avoid; }

  .item { margin-bottom: 6px; break-inside: avoid; }
  .itemTop { display: flex; justify-content: space-between; align-items: baseline; gap: 10px; }
  .itemRole { font-weight: bold; font-size: 14.5px; }
  .itemDates { font-size: 12.5px; color: #666; white-space: nowrap; }
  .itemOrg { font-size: 13px; color: #555; font-style: italic; }
  .item p { margin: 4px 0 0; font-size: 13px; line-height: 1.38; color: #222; }

  .work { list-style: none; padding: 0; margin: 0; }
  .work li { font-size: 13px; line-height: 1.37; margin-bottom: 7px; break-inside: avoid; }
  .workMeta { font-size: 12px; color: #555; white-space: nowrap; }
  .workLink { font-size: 12px; color: #0645ad; text-decoration: underline; text-underline-offset: 2px; }

  .skill { margin-bottom: 8px; font-size: 13.5px; }
  .skillLabel { display: block; font-variant: small-caps; letter-spacing: 0.05em; font-weight: bold;
        font-size: 12px; color: #555; }
  .skill span:last-child { color: #222; }
  .edu { margin-bottom: 10px; font-size: 13.5px; }
  .edu strong { display: block; }
  .edu span { display: block; color: #555; font-size: 12px; }
  .langs { font-size: 13.5px; color: #333; margin: 0; }

  @media print {
    @page { size: A4; margin: 11mm; }
    .cv { background: #fff; padding: 0; min-height: 0; }
    .sheet { max-width: none; border: none; box-shadow: none; padding: 0; }
    .cv { line-height: 1.3; }
    .grid { grid-template-columns: minmax(0, 1fr) 222px; gap: 24px; }
    .cv h2 { margin-bottom: 7px; }
    .cv section { margin-bottom: 9px; }
    .work li { margin-bottom: 5px; line-height: 1.33; }
    .skill { margin-bottom: 6px; }
    .edu { margin-bottom: 7px; }
    a { color: #000 !important; }
  }
  @media screen and (max-width: 680px) {
    .grid { grid-template-columns: 1fr; gap: 16px; }
    .sheet { padding: 24px 20px; }
  }
`;
