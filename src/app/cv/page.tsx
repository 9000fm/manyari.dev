"use client";

/**
 * Print-ready ONE-PAGE CV in the SITE's aesthetic (Times, small-caps ruled
 * headings, blue links, framed sheet) - a print version of manyari.dev. A4,
 * fits a single page. Rendered to public/Flavio-Manyari-CV.pdf; the Download
 * CV link points at that file.
 */

const SUMMARY =
  "Web design and development, end to end - from identity to deployment. I build distinctive sites across e-commerce, editorial portfolios, and independent products, with a creative-coding edge (WebGL, generative visuals). I use AI-assisted workflows to prototype fast while keeping design, architecture, and the final build under my control.";

const EXPERIENCE = [
  {
    role: "Freelance Web Developer & Designer",
    org: "Independent · Lima (Remote)",
    dates: "2023 - Present",
    blurb: "Sites built end to end - superself.online, Micaela Lucía, client brand and the infrastructure behind them (DNS, SSL, hosting, technical SEO).",
  },
  {
    role: "Freelance Graphic Designer",
    org: "Independent · Lima",
    dates: "2020 - 2023",
    blurb: "Print materials for a medical-sector company; event flyers for Lima's electronic-music scene; brand identities for small businesses.",
  },
  {
    role: "Community Manager",
    org: "T&IL Cleaning Services · USA (Remote)",
    dates: "2021 - 2023",
    blurb: "Content, social, and video for a US brand - improved audience retention and streamlined content workflows.",
  },
];

const WORK: [string, string][] = [
  ["Tony Decay", "Limited-edition print store - brand, shop, live inventory counter (Next.js, Supabase, PayPal)."],
  ["Superself.online", "Multilingual music-label site in 3 languages - generative visuals, full brand (Next.js, WebGL)."],
  ["Micaela Lucía", "Photographer portfolio - editorial layout, animated transitions, CMS (Next.js, Sanity)."],
  ["Silverback Stripes", "Combat-sports apparel storefront redesign (Shopify, Liquid)."],
  ["Digeart", "Discovery app for underground electronic music - genre filters, YouTube playback (Next.js, Supabase)."],
];

const SKILLS: [string, string][] = [
  ["Frontend", "Next.js / React, TypeScript, Tailwind"],
  ["Creative Code", "p5.js, WebGL, Framer Motion, Generative Art"],
  ["Design", "Adobe Suite, Figma, Brand Identity, UI/UX"],
  ["E-commerce & CMS", "Shopify / Liquid, PayPal, Sanity, Supabase, WordPress"],
  ["Infra & Tools", "Vercel, DNS / SSL / Hosting, Technical SEO, Git"],
  ["Workflow", "AI-augmented development (Claude, Cursor)"],
];

const EDUCATION: [string, string][] = [
  ["Full Stack Python Developer", "Skillnest · 2023"],
  ["University studies - Engineering & Music Production", "UPC · 2018 - 2023"],
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
          <h1>Flavio Manyari</h1>
          <p className="role">Web Designer &amp; Developer</p>
          <p className="contact">
            <a href="mailto:flavio@manyari.dev">flavio@manyari.dev</a> · +51 990 028 077 · Lima, PE
            <br />
            <a href="https://manyari.dev">manyari.dev</a> ·{" "}
            <a href="https://github.com/9000fm">github.com/9000fm</a> ·{" "}
            <a href="https://www.linkedin.com/in/flavio-manyari-bab9a9215/">linkedin</a>
          </p>
          <p className="summary">{SUMMARY}</p>
        </header>

        <div className="grid">
          <div className="main">
            <section>
              <h2>Experience</h2>
              {EXPERIENCE.map((j) => (
                <div className="item" key={j.role + j.dates}>
                  <div className="itemTop">
                    <span className="itemRole">{j.role}</span>
                    <span className="itemDates">{j.dates}</span>
                  </div>
                  <div className="itemOrg">{j.org}</div>
                  <p>{j.blurb}</p>
                </div>
              ))}
            </section>

            <section>
              <h2>Selected Work</h2>
              <ul className="work">
                {WORK.map(([name, desc]) => (
                  <li key={name}>
                    <strong>{name}</strong> - {desc}
                  </li>
                ))}
              </ul>
            </section>
          </div>

          <aside className="side">
            <section>
              <h2>Skills</h2>
              {SKILLS.map(([label, items]) => (
                <div className="skill" key={label}>
                  <span className="skillLabel">{label}</span>
                  <span>{items}</span>
                </div>
              ))}
            </section>

            <section>
              <h2>Education</h2>
              {EDUCATION.map(([title, meta]) => (
                <div className="edu" key={title}>
                  <strong>{title}</strong>
                  <span>{meta}</span>
                </div>
              ))}
            </section>

            <section>
              <h2>Languages</h2>
              <p className="langs">Spanish (native), English (fluent).</p>
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
  .cvBar { max-width: 800px; margin: 0 auto 14px; display: flex; gap: 14px; }
  .cvBar button, .cvBar a { font: 13px "Times New Roman", serif; color: #a7d7f9; background: none;
        border: 1px solid #55606c; padding: 6px 12px; cursor: pointer; text-decoration: none; }
  .cvBar button:hover, .cvBar a:hover { color: #fff; border-color: #a7d7f9; }

  .sheet { max-width: 800px; margin: 0 auto; background: #fff; border: 1px solid #a7d7f9;
        padding: 46px 52px 42px; box-shadow: 0 8px 40px rgba(0,0,0,0.5); }
  .head h1 { font-variant: small-caps; letter-spacing: 0.05em; font-weight: normal; font-size: 37px;
        line-height: 1; margin: 0; }
  .role { font-style: italic; font-size: 15px; color: #333; margin: 5px 0 0; }
  .contact { font-size: 13px; color: #444; margin: 10px 0 0; line-height: 1.6; }
  .contact a { color: #0645ad; }
  .summary { font-size: 14px; line-height: 1.6; margin: 14px 0 0; border-top: 1px solid #ccc; padding-top: 14px; }

  .grid { display: grid; grid-template-columns: 1fr 252px; gap: 42px; margin-top: 26px; }
  .cv h2 { font-variant: small-caps; letter-spacing: 0.05em; font-weight: normal; font-size: 20px;
        border-bottom: 1px solid #000; padding-bottom: 4px; margin: 0 0 14px; }
  .cv section { margin-bottom: 28px; break-inside: avoid; }

  .item { margin-bottom: 19px; break-inside: avoid; }
  .itemTop { display: flex; justify-content: space-between; align-items: baseline; gap: 10px; }
  .itemRole { font-weight: bold; font-size: 15px; }
  .itemDates { font-size: 13px; color: #666; white-space: nowrap; }
  .itemOrg { font-size: 13.5px; color: #555; font-style: italic; }
  .item p { margin: 6px 0 0; font-size: 13.5px; line-height: 1.6; color: #222; }

  .work { list-style: none; padding: 0; margin: 0; }
  .work li { font-size: 13.5px; line-height: 1.6; margin-bottom: 12px; break-inside: avoid; }

  .skill { margin-bottom: 12px; font-size: 13.5px; }
  .skillLabel { display: block; font-variant: small-caps; letter-spacing: 0.05em; font-weight: bold;
        font-size: 12px; color: #555; }
  .skill span:last-child { color: #222; }
  .edu { margin-bottom: 13px; font-size: 13.5px; }
  .edu strong { display: block; }
  .edu span { display: block; color: #555; font-size: 12px; }
  .langs { font-size: 13.5px; color: #333; margin: 0; }

  @media print {
    @page { size: A4; margin: 14mm; }
    .cv { background: #fff; padding: 0; }
    .cvBar { display: none; }
    .sheet { max-width: none; border: none; box-shadow: none; padding: 0; }
    a { color: #000 !important; }
  }
  @media (max-width: 680px) {
    .grid { grid-template-columns: 1fr; gap: 16px; }
    .sheet { padding: 24px 20px; }
  }
`;
