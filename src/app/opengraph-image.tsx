import { ImageResponse } from "next/og";
import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Generated social share card (WhatsApp, X, LinkedIn, etc.).
// Matches the site: white document, black Times-style serif, stacked name.
export const alt = "Flavio Manyari — Web developer and designer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Tinos is the libre, metrics-compatible twin of Times New Roman.
// Bundled in the repo so the card never depends on a runtime font fetch.
async function loadFonts() {
  try {
    const dir = join(process.cwd(), "src/app/_fonts");
    const [regular, bold, italic] = await Promise.all([
      readFile(join(dir, "Tinos-Regular.ttf")),
      readFile(join(dir, "Tinos-Bold.ttf")),
      readFile(join(dir, "Tinos-Italic.ttf")),
    ]);
    return [
      { name: "Tinos", data: regular, weight: 400 as const, style: "normal" as const },
      { name: "Tinos", data: bold, weight: 700 as const, style: "normal" as const },
      { name: "Tinos", data: italic, weight: 400 as const, style: "italic" as const },
    ];
  } catch {
    return undefined; // degrade to the default serif rather than 500
  }
}

export default async function Image() {
  const fonts = await loadFonts();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          background: "#fff",
          color: "#000",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "56px 64px",
          fontFamily: "Tinos, serif",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 26, color: "#555" }}>
          <div style={{ display: "flex" }}>index of /</div>
          <div style={{ display: "flex" }}>manyari.dev</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ display: "flex", flexDirection: "column", fontSize: 150, fontWeight: 700, lineHeight: 0.98 }}>
            <div style={{ display: "flex" }}>Flavio</div>
            <div style={{ display: "flex" }}>Manyari</div>
          </div>
          <div style={{ display: "flex", fontSize: 42, fontStyle: "italic", marginTop: 22, color: "#111" }}>
            Web developer and designer
          </div>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 25, color: "#333" }}>
          <div style={{ display: "flex" }}>Projects end to end - brand, design, code, deploy.</div>
          <div style={{ display: "flex" }}>Lima, PE</div>
        </div>
      </div>
    ),
    { ...size, ...(fonts ? { fonts } : {}) },
  );
}
