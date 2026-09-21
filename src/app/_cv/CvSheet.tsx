/**
 * The printed CV, in the site's aesthetic (Times, small-caps ruled headings,
 * blue links on screen, black in print). One A4 page.
 *
 * Not a route: this folder is private (underscore), so nothing here ships.
 * `scripts/cv-pdf.mjs` mounts it on a temporary /cv route, prints
 * public/Flavio-Manyari-CV.pdf (EN) and public/Flavio-Manyari-CV-ES.pdf (ES),
 * and removes the route again. Every string comes from content.ts and
 * content.es.ts, so the PDF cannot drift from the site the way it did in 2026.
 */

import { EDUCATION, EXPERIENCE, LANGUAGES, ME, PROJECTS, SKILLS } from "../../content";
import { EDUCATION_ES, EXPERIENCE_ES, LANGUAGES_ES, ME_ES, PROJECTS_ES, SKILLS_ES, UI_ES } from "../../content.es";

export type CvLang = "en" | "es";

const UI = {
  en: { experience: "Experience", work: "Selected Work", skills: "Skills", education: "Education", languages: "Languages" },
  es: { experience: UI_ES.experience, work: UI_ES.work, skills: UI_ES.skills, education: UI_ES.education, languages: UI_ES.languages },
} as const;

// The phone number lives only in the WhatsApp link; print it from there.
function phoneFromWhatsapp(href: string): string {
  const d = href.replace(/\D/g, "");
  return `+${d.slice(0, 2)} ${d.slice(2, 5)} ${d.slice(5, 8)} ${d.slice(8)}`;
}

export default function CvSheet({ lang }: { lang: CvLang }) {
  const es = lang === "es";
  const t = UI[lang];
  const role = es ? ME_ES.role : ME.role;
  const summary = es ? ME_ES.summary : ME.summary;

  const jobs = EXPERIENCE.map((j) => {
    const x = es ? EXPERIENCE_ES[j.company + j.period] : undefined;
    return {
      title: x?.title ?? j.title,
      company: x?.company ?? j.company,
      location: x?.location ?? j.location,
      period: x?.period ?? j.period,
      blurb: x?.blurb ?? j.blurb,
    };
  });
  const work = PROJECTS.map((p) => {
    const x = es ? PROJECTS_ES[p.slug] : undefined;
    return { title: p.title, host: p.url ? new URL(p.url).host : "", role: x?.role ?? p.role, blurb: x?.blurb ?? p.blurb };
  });
  const skills = SKILLS.map((g) => ({ label: es ? SKILLS_ES[g.label] : g.label, items: g.items.join(", ") }));
  const education = EDUCATION.map((e) => {
    const x = es ? EDUCATION_ES[e.school] : undefined;
    return { title: x?.title ?? e.title, school: e.school, period: e.period, detail: x?.detail ?? e.detail };
  });
  // "Spanish (native), English (fluent)." / "Español (nativo), inglés (fluido)."
  // Spanish does not capitalise language names, so only the first word keeps its case.
  const languages =
    LANGUAGES.map((l, i) => {
      const x = es ? LANGUAGES_ES[l.lang] : undefined;
      const name = x?.lang ?? l.lang;
      return `${es && i > 0 ? name.toLowerCase() : name} (${(x?.level ?? l.level).toLowerCase()})`;
    }).join(", ") + ".";

  const linkedin = ME.socials.linkedin;
  const github = ME.socials.github.replace(/^https?:\/\//, "");

  return (
    <main className="cv">
      <style>{CSS}</style>
      <article className="sheet">
        <header className="head">
          <h1>{ME.name}</h1>
          <p className="role">{role}</p>
          <p className="contact">
            <a href={`mailto:${ME.email}`}>{ME.email}</a> · {phoneFromWhatsapp(ME.socials.whatsapp)} · {ME.location}
            <br />
            <a href="https://manyari.dev">manyari.dev</a> · <a href={ME.socials.github}>{github}</a> ·{" "}
            <a href={linkedin}>linkedin</a>
          </p>
          <p className="summary">{summary}</p>
        </header>

        <div className="grid">
          <div className="main">
            <section>
              <h2>{t.experience}</h2>
              {jobs.map((j) => (
                <div className="item" key={j.title + j.period}>
                  <div className="itemTop">
                    <span className="itemRole">{j.title}</span>
                    <span className="itemDates">{j.period}</span>
                  </div>
                  <div className="itemOrg">
                    {j.company}{j.location ? ` · ${j.location}` : ""}
                  </div>
                  <p>{j.blurb}</p>
                </div>
              ))}
            </section>

            <section>
              <h2>{t.work}</h2>
              <ul className="work">
                {work.map((w) => (
                  <li key={w.title}>
                    <strong>{w.title}</strong> <span className="workMeta">{w.host} · {w.role}</span>
                    <br />
                    {w.blurb}
                  </li>
                ))}
              </ul>
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
                  <span>
                    {e.school} · {e.period}
                  </span>
                  {e.detail ? <span>{e.detail}</span> : null}
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
     one A4 page at 14mm margins: scripts/cv-pdf.mjs prints the sheet height,
     it must stay under 1017px. Tighten here, never cut copy. */
  .head h1 { font-variant: small-caps; letter-spacing: 0.05em; font-weight: normal; font-size: 34px;
        line-height: 1; margin: 0; }
  .role { font-style: italic; font-size: 15px; color: #333; margin: 4px 0 0; }
  .contact { font-size: 13px; color: #444; margin: 8px 0 0; line-height: 1.5; }
  .contact a { color: #0645ad; }
  .summary { font-size: 13.5px; line-height: 1.45; margin: 10px 0 0; border-top: 1px solid #ccc; padding-top: 10px; }

  .grid { display: grid; grid-template-columns: 1fr 236px; gap: 34px; margin-top: 16px; }
  .cv h2 { font-variant: small-caps; letter-spacing: 0.05em; font-weight: normal; font-size: 18px;
        border-bottom: 1px solid #000; padding-bottom: 3px; margin: 0 0 9px; }
  .cv section { margin-bottom: 15px; break-inside: avoid; }

  .item { margin-bottom: 9px; break-inside: avoid; }
  .itemTop { display: flex; justify-content: space-between; align-items: baseline; gap: 10px; }
  .itemRole { font-weight: bold; font-size: 14.5px; }
  .itemDates { font-size: 12.5px; color: #666; white-space: nowrap; }
  .itemOrg { font-size: 13px; color: #555; font-style: italic; }
  .item p { margin: 4px 0 0; font-size: 13px; line-height: 1.36; color: #222; }

  .work { list-style: none; padding: 0; margin: 0; }
  .work li { font-size: 13px; line-height: 1.33; margin-bottom: 5px; break-inside: avoid; }
  .workMeta { font-size: 12px; color: #555; }

  .skill { margin-bottom: 8px; font-size: 13px; }
  .skillLabel { display: block; font-variant: small-caps; letter-spacing: 0.05em; font-weight: bold;
        font-size: 12px; color: #555; }
  .skill span:last-child { color: #222; }
  .edu { margin-bottom: 10px; font-size: 13px; }
  .edu strong { display: block; }
  .edu span { display: block; color: #555; font-size: 12px; }
  .langs { font-size: 13px; color: #333; margin: 0; }

  @media print {
    @page { size: A4; margin: 14mm; }
    .cv { background: #fff; padding: 0; min-height: 0; }
    .sheet { max-width: none; border: none; box-shadow: none; padding: 0; }
    a { color: #000 !important; text-decoration: none; }
  }
  @media (max-width: 680px) {
    .grid { grid-template-columns: 1fr; gap: 16px; }
    .sheet { padding: 24px 20px; }
  }
`;
