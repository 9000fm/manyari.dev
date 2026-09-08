// Prints the CV PDFs from src/app/_cv/CvSheet.tsx through a temporary /cv route
// on the running dev server, then removes the route again.
//
//   npx next dev -p 4444              (in another terminal, port 3000 belongs to digeart)
//   node scripts/cv-pdf.mjs [--base http://localhost:4444]
//
// Writes public/Flavio-Manyari-CV.pdf (EN) and public/Flavio-Manyari-CV-ES.pdf (ES),
// A4 with 14mm margins, and reports the page count: both must be 1.

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright-core";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const i = args.indexOf("--base");
const BASE = i >= 0 ? args[i + 1] : "http://localhost:4444";
const p = args.indexOf("--png");
const PNG = p >= 0 ? path.resolve(args[p + 1]) : ""; // optional: full-page PNG of each sheet for a quick visual check
const ROUTE = path.join(ROOT, "src", "app", "cv");
const JOBS = [
  { route: "/cv", file: "Flavio-Manyari-CV.pdf", lang: "en" },
  { route: "/cv/es", file: "Flavio-Manyari-CV-ES.pdf", lang: "es" },
];

const pageSource = (lang) =>
  lang === "es"
    ? 'import CvSheet from "../../_cv/CvSheet";\nexport default function Page() {\n  return (\n    <div lang="es">\n      <CvSheet lang="es" />\n    </div>\n  );\n}\n'
    : 'import CvSheet from "../_cv/CvSheet";\nexport default function Page() {\n  return <CvSheet lang="en" />;\n}\n';

const pageCount = (pdf) => (fs.readFileSync(pdf).toString("latin1").match(/\/Type\s*\/Page[^s]/g) || []).length;

async function main() {
  const up = await fetch(BASE, { signal: AbortSignal.timeout(5000) }).catch(() => null);
  if (!up) {
    console.error(`no dev server at ${BASE}. Start it first: npx next dev -p 4444`);
    process.exit(1);
  }
  if (fs.existsSync(ROUTE)) throw new Error(`${ROUTE} already exists; remove it before printing`);
  fs.mkdirSync(path.join(ROUTE, "es"), { recursive: true });
  fs.writeFileSync(path.join(ROUTE, "page.tsx"), pageSource("en"));
  fs.writeFileSync(path.join(ROUTE, "es", "page.tsx"), pageSource("es"));
  const browser = await chromium.launch();
  try {
    const page = await browser.newPage();
    // printable A4 at 14mm margins: 182 x 269 mm = 688 x 1017 CSS px, so the
    // measured sheet height matches what the PDF will wrap to
    await page.setViewportSize({ width: 688, height: 1017 });
    for (const j of JOBS) {
      const out = path.join(ROOT, "public", j.file);
      // first request compiles the temp route, give it time
      await page.goto(BASE + j.route, { waitUntil: "networkidle", timeout: 120000 });
      await page.waitForSelector("article.sheet", { timeout: 60000 });
      await page.evaluate(() => document.fonts.ready);
      await page.emulateMedia({ media: "print" });
      // A4 minus 14mm margins is 269mm tall = 1017 CSS px; the sheet must fit in that
      const h = await page.evaluate(() => Math.ceil(document.querySelector("article.sheet").getBoundingClientRect().height));
      console.log(`${j.lang}: sheet ${h} px tall (usable 1017)`);
      if (PNG) await page.screenshot({ path: path.join(PNG, `cv-${j.lang}.png`), fullPage: true }); // --png <dir>: proof sheet
      await page.pdf({
        path: out,
        format: "A4",
        printBackground: true,
        preferCSSPageSize: true,
        margin: { top: "14mm", right: "14mm", bottom: "14mm", left: "14mm" },
      });
      const n = pageCount(out);
      console.log(`${j.file}: ${(fs.statSync(out).size / 1024).toFixed(0)} KB, ${n} page(s)${n === 1 ? "" : "  <-- must be 1, tighten CvSheet.tsx"}`);
    }
  } finally {
    await browser.close();
    fs.rmSync(ROUTE, { recursive: true, force: true });
  }
}

main().catch((e) => {
  console.error(e);
  fs.rmSync(ROUTE, { recursive: true, force: true });
  process.exit(1);
});
