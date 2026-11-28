// Prints both CV layouts in English and Spanish from the shared React content.
// All files are generated and checked before any public PDF is replaced.
// Usage: node scripts/cv-pdf.mjs [--ats-only] [--png <directory>]

import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright-core";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(import.meta.url);
const ts = require("typescript");
const React = require("react");
const { renderToStaticMarkup } = require("react-dom/server");
const preflight = fs.readFileSync(require.resolve("tailwindcss/preflight.css"), "utf8");
const args = process.argv.slice(2);
const p = args.indexOf("--png");
if (p >= 0 && !args[p + 1]) throw new Error("--png requires a directory");
const PNG = p >= 0 ? path.resolve(args[p + 1]) : "";

// The CV components use local TSX and React only. Compile them in this process
// so printing never creates, overwrites, or deletes a Next.js route.
for (const ext of [".ts", ".tsx"]) {
  require.extensions[ext] = (module, filename) => {
    const source = fs.readFileSync(filename, "utf8");
    const { outputText } = ts.transpileModule(source, {
      compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020, jsx: ts.JsxEmit.ReactJSX, esModuleInterop: true },
      fileName: filename,
    });
    module._compile(outputText, filename);
  };
}

const CvSheet = require(path.join(ROOT, "src/app/_cv/CvSheet.tsx")).default;
const CvSingleColumn = require(path.join(ROOT, "src/app/_cv/CvSingleColumn.tsx")).default;
const jobs = [
  { lang: "en", layout: "editorial", component: CvSheet, file: "Flavio-Manyari-CV.pdf" },
  { lang: "es", layout: "editorial", component: CvSheet, file: "Flavio-Manyari-CV-ES.pdf" },
  { lang: "en", layout: "ats", component: CvSingleColumn, file: "Flavio-Manyari-CV-ATS.pdf" },
  { lang: "es", layout: "ats", component: CvSingleColumn, file: "Flavio-Manyari-CV-ATS-ES.pdf" },
].filter((job) => !args.includes("--ats-only") || job.layout === "ats");
const MARGIN_MM = 11;
const PRINT_WIDTH = Math.floor((210 - 2 * MARGIN_MM) * 96 / 25.4);
const PRINT_HEIGHT = Math.floor((297 - 2 * MARGIN_MM) * 96 / 25.4);
const margin = `${MARGIN_MM}mm`;
const pageCount = (pdf) => (fs.readFileSync(pdf).toString("latin1").match(/\/Type\s*\/Page[^s]/g) || []).length;
const html = (job) => {
  const body = renderToStaticMarkup(React.createElement(job.component, { lang: job.lang }));
  const title = `Flavio Manyari - CV ${job.layout === "ats" ? "ATS" : "Editorial"} - ${job.lang.toUpperCase()}`;
  return `<!doctype html><html lang="${job.lang}"><head><meta charset="utf-8"><title>${title}</title><style>${preflight}\n*,*::before,*::after{box-sizing:border-box}html,body{margin:0;padding:0}body{-webkit-font-smoothing:antialiased}</style></head><body>${body}</body></html>`;
};

async function main() {
  const temp = fs.mkdtempSync(path.join(os.tmpdir(), "manyari-cv-"));
  const realTempRoot = fs.realpathSync(os.tmpdir());
  const realTemp = fs.realpathSync(temp);
  if (path.dirname(realTemp).toLowerCase() !== realTempRoot.toLowerCase() || !path.basename(realTemp).startsWith("manyari-cv-")) throw new Error("Unexpected temporary directory");
  let browser;
  try {
    if (PNG) fs.mkdirSync(PNG, { recursive: true });
    browser = await chromium.launch(process.env.CV_CHROMIUM_PATH ? { executablePath: process.env.CV_CHROMIUM_PATH } : {});
    const page = await browser.newPage({ viewport: { width: PRINT_WIDTH, height: PRINT_HEIGHT } });
    await page.emulateMedia({ media: "print" });
    for (const job of jobs) {
      await page.setContent(html(job), { waitUntil: "load" });
      await page.evaluate(() => document.fonts.ready);
      const height = await page.locator("article.sheet").evaluate((sheet) => Math.ceil(sheet.getBoundingClientRect().height));
      console.log(`${job.layout} ${job.lang}: ${height}px de ${PRINT_HEIGHT}px`);
      if (height > PRINT_HEIGHT) throw new Error(`${job.layout} ${job.lang}: content exceeds one page`);
      if (PNG) await page.screenshot({ path: path.join(PNG, `cv-${job.layout}-${job.lang}.png`), fullPage: true });
      const target = path.join(temp, job.file);
      await page.pdf({ path: target, format: "A4", printBackground: true, preferCSSPageSize: true, tagged: true, margin: { top: margin, right: margin, bottom: margin, left: margin } });
      if (pageCount(target) !== 1) throw new Error(`${job.file}: PDF must have one page`);
    }
    for (const job of jobs) {
      fs.copyFileSync(path.join(temp, job.file), path.join(ROOT, "public", job.file));
      console.log(`${job.file}: generado`);
    }
  } finally {
    if (browser) await browser.close();
    for (const job of jobs) {
      const file = path.join(temp, job.file);
      if (fs.existsSync(file)) fs.unlinkSync(file);
    }
    fs.rmdirSync(temp);
  }
}

main().catch((error) => { console.error(error); process.exitCode = 1; });
