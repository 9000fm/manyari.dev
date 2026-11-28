import type { CvLang } from "./cvData";
import { getCvAtsData } from "./cvAtsData";

export default function CvSingleColumn({ lang }: { lang: CvLang }) {
  const data = getCvAtsData(lang);
  const t = data.headings;
  const github = data.github.replace(/^https?:\/\//, "");
  const linkedin = data.linkedin.replace(/^https?:\/\/(?:www\.)?/, "").replace(/\/$/, "");
  return (
    <main className="cvSingle" lang={lang}>
      <style>{CSS}</style>
      <article className="sheet">
        <header className="singleHead">
          <h1>{data.name}</h1>
          <p className="singleRole">{data.role}</p>
          <p className="singleContact">
            <a href={`mailto:${data.email}`}>{data.email}</a> · <a href={`tel:${data.phoneHref}`}>{data.phone}</a> · {data.location} ·{" "}
            <a href="https://manyari.dev">manyari.dev</a> · <a href={data.github}>{github}</a> ·{" "}
            <a href={data.linkedin}>{linkedin}</a>
          </p>
        </header>

        <section>
          <h2>{t.summary}</h2>
          <p className="singleSummary">{data.summary}</p>
        </section>

        <section>
          <h2>{t.skills}</h2>
          {data.skills.map((skill) => <p className="singleSkill" key={skill.label}><strong>{skill.label}:</strong> {skill.items}.</p>)}
        </section>

        <section>
          <h2>{t.experience}</h2>
          {data.jobs.map((job) => (
            <div className="singleJob" key={job.title + job.period}>
              <p><strong>{job.title}</strong></p>
              <p>{job.company}{job.location ? <> | {job.location}</> : null} | {job.period}</p>
              {job.context ? <p>{job.context}</p> : null}
              <ul className="singleBullets">{job.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}</ul>
            </div>
          ))}
        </section>

        <section>
          <h2>{t.work}</h2>
          {data.work.map((work) => (
            <p className="singleProject" key={work.slug}>
              <strong>{work.title}</strong><span className="singleMeta"> · {work.year}</span>{work.url ? <> · <a href={work.url}>{work.host}</a></> : null}{" "}
              <span className="singleMeta">· {work.role}</span><br />{work.blurb}
            </p>
          ))}
        </section>

        <section>
          <h2>{t.education}</h2>
          {data.education.map((entry) => (
            <p className="singleEducation" key={entry.title}>
              <strong>{entry.title}</strong> · {entry.school} · {entry.period}
            </p>
          ))}
        </section>

        <section>
          <h2>{t.languages}</h2>
          <p>{data.languages}</p>
        </section>
      </article>
    </main>
  );
}

const CSS = `
  .cvSingle { min-height: 100vh; background: #232220; padding: 22px 16px 50px; color: #000; font-family: "Times New Roman", Times, serif; }
  .cvSingle .sheet { max-width: 800px; margin: 0 auto; padding: 46px 52px 42px; border: 1px solid #a7d7f9; background: #fff; box-shadow: 0 8px 40px rgba(0,0,0,.5); font-size: 13.5px; line-height: 1.3; }
  .cvSingle h1 { margin: 0; font-size: 32px; line-height: 1; font-weight: bold; }
  .cvSingle p { margin: 0; }
  .cvSingle .singleRole { font-size: 15px; font-style: italic; color: #333; margin-top: 4px; }
  .cvSingle .singleContact { font-size: 13px; line-height: 1.4; margin-top: 8px; }
  .cvSingle a { color: #0645ad; text-decoration: underline; text-underline-offset: 2px; }
  .cvSingle .singleContact a { text-decoration: none; }
  .cvSingle .singleSummary { font-size: inherit; line-height: inherit; }
  .cvSingle section { margin-top: 8px; }
  .cvSingle h2 { font-size: 16px; font-weight: bold; border-bottom: 1px solid #000; padding-bottom: 2px; margin: 0 0 3px; }
  .cvSingle .singleProject { margin-bottom: 4px; break-inside: avoid; }
  .cvSingle .singleMeta { color: #555; font-size: 12.5px; }
  .cvSingle .singleJob { margin-bottom: 6px; break-inside: avoid; }
  .cvSingle .singleEducation { margin-bottom: 2px; break-inside: avoid; }
  .cvSingle .singleBullets { list-style: disc; padding-left: 17px; margin: 2px 0 0; }
  .cvSingle .singleBullets li { padding-left: 1px; }
  @media print {
    @page { size: A4; margin: 11mm; }
    .cvSingle { background: #fff; padding: 0; min-height: 0; }
    .cvSingle .sheet { max-width: none; padding: 0; border: none; box-shadow: none; }
    .cvSingle .sheet { line-height: 1.22; }
    .cvSingle section { margin-top: 5px; }
    .cvSingle .singleProject { margin-bottom: 2px; }
    .cvSingle .singleJob { margin-bottom: 3px; }
    .cvSingle a { color: #000; }
  }
  @media screen and (max-width: 680px) { .cvSingle .sheet { padding: 24px 20px; } }
`;
