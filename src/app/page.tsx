import Link from "next/link";
import { VARIANTS, ME } from "@/content";

export default function Home() {
  return (
    <main
      style={{
        fontFamily: "ui-monospace, 'SF Mono', Menlo, monospace",
        background: "#fafafa",
        color: "#111",
        minHeight: "100vh",
        padding: "48px 32px",
        maxWidth: 720,
        margin: "0 auto",
      }}
    >
      <header style={{ marginBottom: 48 }}>
        <h1 style={{ fontSize: 14, fontWeight: 500, margin: 0, letterSpacing: "0.02em" }}>
          {ME.name} — portfolio direction studies
        </h1>
        <p style={{ fontSize: 13, color: "#666", margin: "6px 0 0" }}>
          12 fully-coded variants · same content, radically different shells. Pick one.
        </p>
      </header>

      <ol style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {VARIANTS.map((v) => (
          <li
            key={v.slug}
            style={{
              borderTop: "1px solid #ddd",
              padding: "16px 0",
            }}
          >
            <Link
              href={`/${v.slug}`}
              style={{
                color: "inherit",
                textDecoration: "none",
                display: "flex",
                gap: 16,
                alignItems: "baseline",
              }}
            >
              <span style={{ color: "#999", fontSize: 12, minWidth: 24 }}>{v.n}</span>
              <span style={{ fontSize: 15, fontWeight: 500, minWidth: 200 }}>{v.name}</span>
              <span style={{ fontSize: 13, color: "#666" }}>{v.vibe}</span>
              <span style={{ marginLeft: "auto", fontSize: 12, color: "#999" }}>→</span>
            </Link>
          </li>
        ))}
        <li style={{ borderTop: "1px solid #ddd" }} />
      </ol>

      <footer style={{ marginTop: 48, fontSize: 12, color: "#999" }}>
        <code>fm-portfolio · {new Date().getFullYear()}</code>
      </footer>
    </main>
  );
}
