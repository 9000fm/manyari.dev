"use client";

/**
 * Print-ready CV, matching Flavio's established resume style (clean navy
 * sans-serif, single column, section bands, bulleted experience, a projects
 * table) - not the site's Monobook look. A4, fills the page. Generated to a
 * PDF (public/Flavio-Manyari-CV.pdf) via scripts; the download link points at
 * that file. Content is CV-specific (fuller than the public site).
 */

const SUMMARY =
  "Web developer and graphic designer with 4+ years of experience in frontend development, visual identity design, and web infrastructure management. Complementary training in audiovisual design and music production. Comfortable working with remote, multidisciplinary teams, technical analysis, and problem-solving.";

const EXPERIENCE = [
  {
    title: "Web Developer & IT Consultant",
    org: "Ecolution Industries Pty Ltd, Sunshine Coast, QLD, Australia (Remote)",
    note: "Australian renewable energy and electrical contracting company.",
    dates: "May 2024 - Present",
    points: [
      "Led the full redesign of ecolution.com.au on WordPress - restructured site architecture, content hierarchy, and visual consistency.",
      "Implemented technical SEO, structured metadata, and lazy loading, improving Core Web Vitals.",
      "Configured SPF, DKIM, and DMARC records, resolving corporate email deliverability issues.",
      "Managed DNS migration, SSL provisioning, and hosting infrastructure.",
    ],
  },
  {
    title: "Freelance Web Developer & Designer",
    org: "Independent, Lima (Remote)",
    note: "",
    dates: "Dec 2023 - Present",
    points: [
      "Designed and developed superself.online, a multilingual music-label site (ES/EN/JP) with i18n routing - Next.js 16, React 19, TypeScript, p5.js, Tailwind 4. Built the full brand identity and generative ASCII animations; deployed on Vercel.",
      "Built Micaela Lucía's photography portfolio with Next.js 16, TypeScript, Sanity CMS, and Framer Motion animated transitions.",
      "Created graphic materials for clients: logos, brand manuals, digital banners, and social assets (Illustrator, Photoshop, Canva).",
      "Configured and troubleshot infrastructure: DNS, SSL, hosting, email deliverability, and CMS platforms.",
    ],
  },
  {
    title: "Freelance Graphic Designer",
    org: "Independent, Lima",
    note: "",
    dates: "Nov 2020 - Dec 2023",
    points: [
      "Designed printed materials for a medical-sector company: brochures, forms, corporate agendas, and institutional documents.",
      "Created event flyers and promotional materials for Lima's electronic-music scene.",
      "Developed brand identities for small businesses and personal projects.",
    ],
  },
  {
    title: "Community Manager",
    org: "T&IL Cleaning Services LLC, Baltimore, Maryland (Remote)",
    note: "Residential and commercial cleaning company.",
    dates: "Dec 2021 - Oct 2023",
    points: [
      "Created and managed content for Instagram, Facebook, and TikTok.",
      "Coordinated client communications, scheduling, and engagement strategies.",
      "Produced and edited video content for social-media campaigns.",
    ],
  },
];

const PROJECTS = [
  ["superself.online", "Next.js, TypeScript, p5.js, Tailwind", "Multilingual music-label site in 3 languages (ES/EN/JP) with i18n routing, generative ASCII visuals, and full brand design. Lighthouse 100/100."],
  ["Tony Decay", "Next.js, Supabase, PayPal", "Limited-edition print store - brand, shop, and a live inventory counter, built end to end."],
  ["Micaela Lucía", "Next.js, TypeScript, Sanity CMS, Framer Motion", "Photographer & filmmaker portfolio - editorial layout, animated transitions, and a client-managed CMS. Lighthouse 99/100."],
  ["Silverback Stripes", "Shopify, Liquid", "Storefront redesign for a combat-sports apparel brand - homepage, navigation, and key brand pages."],
  ["digeart", "Next.js, Supabase", "Hand-curated discovery app for underground electronic music - genre filters and YouTube playback."],
];

const SKILLS: [string, string][] = [
  ["Design", "Adobe Illustrator, Photoshop, Premiere, After Effects, Canva, Brand Identity, UI/UX"],
  ["Frontend", "JavaScript, TypeScript, React 19, Next.js 16, HTML5/CSS3, Tailwind CSS 4"],
  ["Creative Coding", "p5.js, WebGL, Framer Motion, TouchDesigner, Blender, Generative Art"],
  ["E-commerce & CMS", "Shopify / Liquid, PayPal, Sanity, Supabase, WordPress"],
  ["Infra & Tools", "Git, Vercel, Linux/EC2, DNS / SSL / Hosting, Technical SEO, AI-augmented development (Claude, Cursor)"],
];

const EDUCATION = [
  {
    title: "Full Stack Python Developer",
    school: "Skillnest (ex Coding Dojo Latam)",
    dates: "2023",
    detail: "HTML, CSS, JavaScript, Python, Flask, Django, MySQL. Final project: full-stack e-commerce.",
  },
  {
    title: "University Studies - Industrial Engineering & Music Production",
    school: "Universidad Peruana de Ciencias Aplicadas (UPC)",
    dates: "2018 - 2023",
    detail: "Coursework across two programs; analytical and creative foundation.",
  },
];

export default function CV() {
  return (
    <main className="cv">
      <style>{CSS}</style>
      <div className="cvBar">
        <button onClick={() => window.print()}>&#8595; Download PDF</button>
        <a href="/">&#8592; back to site</a>
      </div>

      <article className="sheet">
        <header className="head">
          <h1>Flavio Alejandro Manyari Zamalloa</h1>
          <p className="contact">
            Lima, PE <span>·</span> <a href="mailto:flavio@manyari.dev">flavio@manyari.dev</a>{" "}
            <span>·</span> +51 990 028 077 <span>·</span>{" "}
            <a href="https://www.linkedin.com/in/flavio-manyari-bab9a9215/">LinkedIn</a>{" "}
            <span>·</span> <a href="https://github.com/9000fm">GitHub</a>{" "}
            <span>·</span> <a href="https://manyari.dev">manyari.dev</a>
          </p>
          <p className="summary">{SUMMARY}</p>
        </header>

        <section>
          <h2>Experience</h2>
          {EXPERIENCE.map((j) => (
            <div className="job" key={j.title + j.dates}>
              <div className="jobTop">
                <span className="jobTitle">{j.title}</span>
                <span className="jobDates">{j.dates}</span>
              </div>
              <div className="jobOrg">{j.org}</div>
              {j.note ? <div className="jobNote">{j.note}</div> : null}
              <ul>
                {j.points.map((p, i) => (
                  <li key={i}>{p}</li>
                ))}
              </ul>
            </div>
          ))}
        </section>

        <section>
          <h2>Selected Projects</h2>
          <table className="proj">
            <thead>
              <tr>
                <th>Project</th>
                <th>Stack</th>
                <th>Description</th>
              </tr>
            </thead>
            <tbody>
              {PROJECTS.map((p) => (
                <tr key={p[0]}>
                  <td className="pName">{p[0]}</td>
                  <td className="pStack">{p[1]}</td>
                  <td>{p[2]}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <section>
          <h2>Skills</h2>
          <ul className="skills">
            {SKILLS.map(([label, items]) => (
              <li key={label}>
                <strong>{label}:</strong> {items}.
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2>Education</h2>
          {EDUCATION.map((e) => (
            <div className="edu" key={e.title}>
              <div className="jobTop">
                <span className="jobTitle">{e.title}</span>
                <span className="jobDates">{e.dates}</span>
              </div>
              <div className="jobOrg">{e.school}</div>
              <ul>
                <li>{e.detail}</li>
              </ul>
            </div>
          ))}
        </section>

        <section>
          <h2>Additional Information</h2>
          <ul className="skills">
            <li><strong>Languages:</strong> Spanish (native), English (fluent).</li>
            <li><strong>Music Production:</strong> Ableton Live, Logic Pro, Pro Tools.</li>
            <li><strong>Interests:</strong> Artificial intelligence, generative art, football, cooking.</li>
          </ul>
        </section>
      </article>
    </main>
  );
}

const CSS = `
  .cv { --navy: #1f4e79; --blue: #2b6cb0; --ink: #222; --grey: #666; --band: #eef1f4;
        background: #4a4a4a; min-height: 100vh; padding: 24px 16px 60px;
        font-family: "Segoe UI", "Helvetica Neue", Arial, sans-serif; color: var(--ink); }
  .cvBar { max-width: 820px; margin: 0 auto 16px; display: flex; gap: 14px; }
  .cvBar button, .cvBar a { font: 13px "Segoe UI", Arial, sans-serif; color: #dbe6f2;
        background: none; border: 1px solid #6b7683; padding: 6px 12px; cursor: pointer; text-decoration: none; }
  .cvBar button:hover, .cvBar a:hover { color: #fff; border-color: #dbe6f2; }

  .sheet { max-width: 820px; margin: 0 auto; background: #fff; padding: 46px 52px 40px;
        box-shadow: 0 8px 40px rgba(0,0,0,0.5); }
  .head { text-align: center; border-bottom: 1px solid #cfd6de; padding-bottom: 14px; }
  .head h1 { margin: 0; font-size: 25px; font-weight: 700; letter-spacing: 0.22em;
        text-transform: uppercase; color: var(--navy); }
  .contact { margin: 9px 0 0; font-size: 11.5px; color: var(--grey); letter-spacing: 0.01em; }
  .contact a { color: var(--blue); text-decoration: none; }
  .contact span { color: #b7bfc9; margin: 0 2px; }
  .summary { text-align: justify; font-size: 11.5px; line-height: 1.55; color: #333; margin: 14px 0 0; }

  .cv section { margin-top: 20px; }
  .cv h2 { font-size: 12px; font-weight: 700; letter-spacing: 0.16em; text-transform: uppercase;
        color: var(--navy); background: var(--band); border-left: 4px solid var(--navy);
        padding: 6px 10px; margin: 0 0 12px; }

  .job, .edu { margin-bottom: 13px; break-inside: avoid; }
  .jobTop { display: flex; justify-content: space-between; align-items: baseline; gap: 12px; }
  .jobTitle { font-size: 12.5px; font-weight: 700; color: #1a1a1a; }
  .jobDates { font-size: 11px; color: var(--grey); white-space: nowrap; }
  .jobOrg { font-size: 11.5px; color: #333; margin-top: 1px; }
  .jobNote { font-size: 11px; color: var(--grey); font-style: italic; margin-top: 1px; }
  .job ul, .edu ul, .skills { margin: 5px 0 0; padding-left: 18px; }
  .job li, .edu li, .skills li { font-size: 11.3px; line-height: 1.5; color: #2a2a2a;
        margin-bottom: 2px; break-inside: avoid; }
  .job li::marker, .edu li::marker, .skills li::marker { color: var(--blue); }
  .skills { padding-left: 18px; }
  .skills strong { color: #1a1a1a; }

  .proj { width: 100%; border-collapse: collapse; font-size: 11.2px; }
  .proj th { text-align: left; font-size: 10px; letter-spacing: 0.08em; text-transform: uppercase;
        color: var(--grey); border-bottom: 1.5px solid var(--navy); padding: 0 10px 5px 0; }
  .proj td { vertical-align: top; padding: 7px 10px 7px 0; border-bottom: 1px solid #e4e8ed; line-height: 1.45; }
  .proj tr:last-child td { border-bottom: none; }
  .pName { font-weight: 700; color: var(--blue); white-space: nowrap; }
  .pStack { color: var(--grey); width: 27%; }

  @media print {
    @page { size: A4; margin: 13mm 14mm; }
    .cv { background: #fff; padding: 0; }
    .cvBar { display: none; }
    .sheet { max-width: none; box-shadow: none; padding: 0; }
    a { color: var(--blue) !important; }
  }
  @media (max-width: 680px) {
    .sheet { padding: 26px 22px; }
    .proj, .proj thead, .proj tbody, .proj tr, .proj td, .proj th { display: block; }
    .proj th { display: none; }
    .proj td { border: none; padding: 1px 0; }
    .pName { margin-top: 8px; }
  }
`;
