import Link from "next/link";
import type { Metadata } from "next";
import { ME, PROJECTS } from "@/content";

export const metadata: Metadata = { title: `${ME.name} — index of /` };

export default function BrutalistPage() {
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
      </p>

      <h1 style={{ fontSize: 24, margin: "16px 0 0" }}>{ME.name}</h1>
      <p style={{ margin: "4px 0 16px" }}>
        {ME.role}. {ME.location}.<br />
        Email: <a href={`mailto:${ME.email}`} style={{ color: "#0000EE" }}>{ME.email}</a>
      </p>

      <hr />

      <h2 style={{ fontSize: 20, margin: "16px 0 8px" }}>About</h2>
      <p style={{ maxWidth: "60ch", margin: 0 }}>{ME.about}</p>

      <hr style={{ marginTop: 16 }} />

      <h2 style={{ fontSize: 20, margin: "16px 0 8px" }}>Selected Work</h2>
      <ul style={{ margin: 0, paddingLeft: 24 }}>
        {PROJECTS.map((p) => (
          <li key={p.slug} style={{ marginBottom: 4 }}>
            {p.url ? (
              <a href={p.url} target="_blank" rel="noopener noreferrer" style={{ color: "#0000EE" }}>
                {p.title}
              </a>
            ) : (
              <span>{p.title}</span>
            )}
            {" — "}
            <em>{p.role}</em>
            {" ("}
            {p.year}
            {")"}
          </li>
        ))}
      </ul>

      <hr style={{ marginTop: 16 }} />

      <h2 style={{ fontSize: 20, margin: "16px 0 8px" }}>Links</h2>
      <ul style={{ margin: 0, paddingLeft: 24 }}>
        <li>
          <a href={ME.socials.github} style={{ color: "#0000EE" }}>GitHub</a>
        </li>
        <li>
          <a href={ME.socials.linkedin} style={{ color: "#0000EE" }}>LinkedIn</a>
        </li>
        <li>
          <a href={`mailto:${ME.email}`} style={{ color: "#0000EE" }}>Email</a>
        </li>
      </ul>

      <hr style={{ marginTop: 16 }} />

      <p style={{ fontSize: 12, color: "#444", marginTop: 16 }}>
        Last modified: {new Date().toISOString().slice(0, 10)}.
        No cookies. No tracking. No frameworks visible.
      </p>
    </main>
  );
}
