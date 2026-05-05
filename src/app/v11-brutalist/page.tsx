import Link from "next/link";
import type { Metadata } from "next";
import { ME, PROJECTS, EXPERIENCE, SKILLS, EDUCATION, LANGUAGES, SERVICES } from "@/content";

export const metadata: Metadata = { title: `${ME.name} — index of /` };

export default function BrutalistPage() {
  const updated = new Date().toISOString().slice(0, 10);
  return (
    <main
      style={{
        background: "#fff",
        color: "#000",
        minHeight: "100vh",
        padding: "16px",
        fontFamily: '"Times New Roman", Times, serif',
        fontSize: 16,
        lineHeight: 1.4,
      }}
    >
      <p>
        <Link href="/" style={{ color: "#0000EE" }}>[back to all variants]</Link>
        {" · "}
        <a href="#work" style={{ color: "#0000EE" }}>[work]</a>
        {" · "}
        <a href="#experience" style={{ color: "#0000EE" }}>[experience]</a>
        {" · "}
        <a href="#tools" style={{ color: "#0000EE" }}>[tools]</a>
        {" · "}
        <a href="#about" style={{ color: "#0000EE" }}>[about]</a>
        {" · "}
        <a href="#contact" style={{ color: "#0000EE" }}>[contact]</a>
      </p>

      {/* literal marquee — peak brutalism */}
      <p style={{ border: "1px solid #000", padding: "4px 8px", margin: "8px 0" }}>
        {/* deprecated HTML element, used here on purpose */}
        {(() => {
          const Marquee = "marquee" as unknown as React.ElementType;
          return <Marquee scrollamount={4}>{SERVICES.join("  •  ")}  •  {ME.available}  •  {ME.email}  •</Marquee>;
        })()}
      </p>

      <h1 style={{ fontSize: 32, margin: "16px 0 0" }}>{ME.name}</h1>
      <p style={{ margin: "4px 0 16px" }}>
        <em>{ME.role}.</em> {ME.location}.<br />
        Email: <a href={`mailto:${ME.email}`} style={{ color: "#0000EE" }}>{ME.email}</a><br />
        Phone: {ME.phone}<br />
        Status: <strong>{ME.available}</strong>
      </p>

      <hr />

      <h2 id="about" style={{ fontSize: 22, margin: "16px 0 8px" }}>About</h2>
      <p style={{ maxWidth: "65ch", margin: 0 }}>{ME.about}</p>

      <hr style={{ marginTop: 16 }} />

      <h2 id="work" style={{ fontSize: 22, margin: "16px 0 8px" }}>Selected Work</h2>
      <ol style={{ margin: 0, paddingLeft: 24 }}>
        {PROJECTS.map((p) => (
          <li key={p.slug} style={{ marginBottom: 12 }}>
            {p.url ? (
              <a href={p.url} target="_blank" rel="noopener noreferrer" style={{ color: "#0000EE", fontWeight: "bold" }}>
                {p.title}
              </a>
            ) : (
              <strong>{p.title}</strong>
            )}
            {" — "}
            <em>{p.role}</em>
            {" ("}
            {p.year}
            {")"}
            <br />
            <span style={{ fontSize: 14 }}>{p.blurb}</span>
          </li>
        ))}
      </ol>

      <hr style={{ marginTop: 16 }} />

      <h2 id="experience" style={{ fontSize: 22, margin: "16px 0 8px" }}>Experience</h2>
      <table style={{ borderCollapse: "collapse", width: "100%", maxWidth: 900, fontSize: 14 }}>
        <thead>
          <tr>
            <th align="left" style={{ borderBottom: "1px solid #000", padding: "4px 8px 4px 0" }}>Period</th>
            <th align="left" style={{ borderBottom: "1px solid #000", padding: "4px 8px" }}>Title</th>
            <th align="left" style={{ borderBottom: "1px solid #000", padding: "4px 8px" }}>Where</th>
          </tr>
        </thead>
        <tbody>
          {EXPERIENCE.map((j, i) => (
            <tr key={i} style={{ borderBottom: "1px dotted #888" }}>
              <td style={{ padding: "8px 8px 8px 0", verticalAlign: "top" }}>{j.period}</td>
              <td style={{ padding: "8px", verticalAlign: "top" }}>
                <strong>{j.title}</strong> — {j.company}
                <br />
                <span style={{ fontSize: 13 }}>{j.blurb}</span>
              </td>
              <td style={{ padding: "8px", verticalAlign: "top", fontSize: 13 }}>{j.location}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <hr style={{ marginTop: 16 }} />

      <h2 id="tools" style={{ fontSize: 22, margin: "16px 0 8px" }}>Tools</h2>
      <dl style={{ margin: 0 }}>
        {SKILLS.map((g) => (
          <div key={g.label} style={{ marginBottom: 8 }}>
            <dt style={{ display: "inline", fontWeight: "bold" }}>{g.label}:</dt>
            <dd style={{ display: "inline", margin: 0, marginLeft: 6 }}>
              {g.items.join(", ")}.
            </dd>
          </div>
        ))}
      </dl>

      <hr style={{ marginTop: 16 }} />

      <h2 style={{ fontSize: 22, margin: "16px 0 8px" }}>Education</h2>
      <ul style={{ margin: 0, paddingLeft: 24 }}>
        {EDUCATION.map((e) => (
          <li key={e.title} style={{ marginBottom: 8 }}>
            <strong>{e.title}</strong> — {e.school} ({e.period}).<br />
            <span style={{ fontSize: 14 }}>{e.detail}</span>
          </li>
        ))}
      </ul>

      <h2 style={{ fontSize: 22, margin: "16px 0 8px" }}>Languages</h2>
      <ul style={{ margin: 0, paddingLeft: 24 }}>
        {LANGUAGES.map((l) => (
          <li key={l.lang}>{l.lang} — {l.level}</li>
        ))}
      </ul>

      <hr style={{ marginTop: 16 }} />

      <h2 id="contact" style={{ fontSize: 22, margin: "16px 0 8px" }}>Links</h2>
      <ul style={{ margin: 0, paddingLeft: 24 }}>
        <li><a href={ME.socials.github} style={{ color: "#0000EE" }}>GitHub</a></li>
        <li><a href={ME.socials.linkedin} style={{ color: "#0000EE" }}>LinkedIn</a></li>
        <li><a href={`mailto:${ME.email}`} style={{ color: "#0000EE" }}>Email</a></li>
        <li>Phone: {ME.phone}</li>
      </ul>

      <hr style={{ marginTop: 16 }} />

      <h2 style={{ fontSize: 22, margin: "16px 0 8px" }}>What&rsquo;s new</h2>
      <ul style={{ margin: 0, paddingLeft: 24, fontSize: 14 }}>
        <li>{updated} — Added experience, skills, and education sections.</li>
        <li>2026-05-04 — Site rebuilt; removed scaffolding.</li>
      </ul>

      <hr style={{ marginTop: 16 }} />

      <p style={{ fontSize: 12, color: "#444", marginTop: 16 }}>
        Last modified: {updated}.
        No cookies. No tracking. No frameworks visible.
        {" "}
        <a href="#top" style={{ color: "#0000EE" }}>[top]</a>
      </p>
    </main>
  );
}
