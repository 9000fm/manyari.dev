// Plates and hover previews for Selected Work, built from the live sites.
// See CLAUDE.md "Regenerating plates and previews" and scripts/assets.config.mjs.
//
//   npm run assets -- probe                       browser version, WebGL2 and H.264 support
//   npm run assets -- capture --out <dir>         screenshots -> <dir>/raw/<slug>/
//   npm run assets -- build   --out <dir>         dither + encode -> <dir>/build/<slug>/, writes <dir>/sheet.html
//   npm run assets -- all     --out <dir>         capture + build
//   npm run assets -- apply   --out <dir> --pick digeart=grid,tonydecay=foundation,...
//                                                 copies the chosen assets into public/, patches plateW/plateH
//   npm run assets -- verify  --base http://localhost:4444
//
// Flags: --only slug[,slug]  --browser chromium|chrome|msedge  --headed  --swiftshader
//        --no-previews  --no-plates
//
// Needs ffmpeg on PATH and Python 3 with scripts/requirements.txt installed.

import { spawnSync } from "node:child_process";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { chromium } from "playwright-core";
import { PROJECTS, USER_AGENT, VIEWPORT } from "./assets.config.mjs";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const opt = (n, d) => {
  const i = args.indexOf(`--${n}`);
  return i >= 0 ? args[i + 1] : d;
};
const flag = (n) => args.includes(`--${n}`);
const OUT = path.resolve(opt("out", path.join(os.tmpdir(), "manyari-assets")));
const only = (opt("only", "") || "").split(",").filter(Boolean);
const projects = PROJECTS.filter((p) => !only.length || only.includes(p.slug));
// animations:'disabled' finishes CSS animations and transitions at capture time
const SHOT = { animations: "disabled", caret: "hide", scale: "css" };

// ---------------------------------------------------------------- browser

async function launch() {
  const browser = opt("browser", "chromium");
  const o = {
    headless: !flag("headed"),
    args: flag("swiftshader") ? ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] : [],
  };
  if (browser !== "chromium") o.channel = browser; // 'chrome' | 'msedge' = system browsers
  return chromium.launch(o);
}

async function newPage(browser, proj) {
  const ctx = await browser.newContext({
    viewport: VIEWPORT,
    deviceScaleFactor: 1,
    userAgent: USER_AGENT,
    locale: "en-US",
    timezoneId: "America/Lima",
    colorScheme: proj.colorScheme ?? "light",
  });
  const page = await ctx.newPage();
  page.setDefaultTimeout(20000);
  return page;
}

// "scroll + force-load pass" from the July notes: every lazy image decoded before the shot
async function forceLoad(page) {
  await page.evaluate(async () => {
    const step = Math.max(300, Math.round(innerHeight * 0.8));
    for (let y = 0; y <= document.documentElement.scrollHeight; y += step) {
      scrollTo(0, y);
      await new Promise((r) => setTimeout(r, 120));
    }
    scrollTo(0, 0);
    for (const img of document.images) img.loading = "eager";
    await Promise.allSettled([...document.images].map((i) => (i.complete ? null : i.decode().catch(() => {}))));
  });
  await page.waitForLoadState("networkidle", { timeout: 8000 }).catch(() => {});
}

// hero videos (silverback): pause and seek so the frame is deterministic
async function freezeVideos(page) {
  await page.evaluate(async () => {
    for (const v of document.querySelectorAll("video")) {
      try {
        v.pause();
        v.currentTime = 1.0;
        await new Promise((r) => {
          v.onseeked = r;
          setTimeout(r, 1500);
        });
      } catch {
        /* no video track, ignore */
      }
    }
  });
}

// superself: wait until a 2D canvas has drawn something that is not black
async function waitCanvas(page) {
  await page.waitForFunction(
    () => {
      const c = document.querySelector("canvas");
      if (!c) return false;
      try {
        const ctx = c.getContext("2d");
        if (!ctx) return true; // WebGL canvas: nothing we can read, assume drawn
        const d = ctx.getImageData(0, 0, c.width, c.height).data;
        for (let i = 0; i < d.length; i += 4 * 97) if (d[i] | d[i + 1] | d[i + 2]) return true;
        return false;
      } catch {
        return true;
      }
    },
    null,
    { timeout: 15000 },
  );
}

async function hide(page, sels = []) {
  for (const s of sels) {
    await page
      .locator(s)
      .evaluateAll((els) => els.forEach((e) => e.style.setProperty("visibility", "hidden", "important")))
      .catch(() => {});
  }
}

async function scrollPage(page, target, offset = 0) {
  if (typeof target === "number") await page.evaluate((y) => scrollTo(0, y), target);
  else
    await page
      .locator(target)
      .first()
      .evaluate((el, off) => scrollTo(0, el.getBoundingClientRect().top + scrollY - off), offset);
  await page.waitForTimeout(300);
}

// Click, or fall back to a synthetic click when an overlay (CRT effect, intro
// fade) intercepts the pointer. Entry gates on superself and tonydecay need this.
async function tap(page, sel) {
  const l = page.locator(sel).first();
  try {
    await l.click({ timeout: 5000 });
  } catch {
    try {
      await l.dispatchEvent("click", undefined, { timeout: 3000 });
    } catch {
      // gone in the meantime (a gate that dismissed itself) is fine; never there is not
      if ((await l.count()) > 0) throw new Error(`could not click ${sel}`);
    }
  }
}

// Same, but only if the element shows up within 3 s: entry gates that a site
// remembers (session storage) are gone on the second visit of a context.
async function tapIf(page, sel) {
  const l = page.locator(sel).first();
  const there = await l.waitFor({ state: "visible", timeout: 3000 }).then(() => true).catch(() => false);
  if (there) await tap(page, sel);
}

async function runSteps(page, steps = []) {
  for (const s of steps) {
    if (s.goto) await page.goto(s.goto, { waitUntil: "load" });
    if (s.click) await tap(page, s.click);
    if (s.tapIf) await tapIf(page, s.tapIf);
    if (s.press) await page.keyboard.press(s.press);
    if (s.hover) await page.locator(s.hover).first().hover();
    if (s.scroll !== undefined) await scrollPage(page, s.scroll, s.offset ?? 0);
    if (s.evaluate) await page.evaluate(s.evaluate);
    if (s.hide) await hide(page, s.hide);
    if (s.waitCanvas) await waitCanvas(page);
    if (s.wait) await page.waitForTimeout(s.wait);
  }
}

async function open(page, proj, url) {
  await page.goto(url, { waitUntil: "load", timeout: 60000 });
  await page.waitForLoadState("networkidle", { timeout: 10000 }).catch(() => {}); // never block on beacons
  for (const s of proj.dismiss ?? []) {
    const l = page.locator(s).first();
    if (await l.isVisible().catch(() => false)) {
      await tap(page, s).catch(() => {});
      await page.waitForTimeout(800);
    }
  }
  await forceLoad(page);
  await page.evaluate(() => document.fonts.ready);
  await hide(page, proj.hide ?? []);
  await freezeVideos(page);
  await runSteps(page, proj.afterOpen ?? []);
}

// ---------------------------------------------------------------- commands

async function probe() {
  const browser = await launch();
  const page = await (await browser.newContext({ userAgent: USER_AGENT })).newPage();
  await page.goto("about:blank");
  const caps = await page.evaluate(() => ({
    webgl2: !!document.createElement("canvas").getContext("webgl2"),
    h264: document.createElement("video").canPlayType('video/mp4; codecs="avc1.42E01E"') || "NO",
  }));
  console.log(browser.version(), caps);
  await browser.close();
}

async function capture() {
  const browser = await launch();
  const meta = { at: new Date().toISOString(), browser: browser.version(), viewport: VIEWPORT, out: OUT, failed: [] };
  // one broken selector must not kill a 10-minute run: log it, skip that shot, keep going
  const attempt = async (label, fn) => {
    try {
      await fn();
      console.log(`${label}: ok`);
    } catch (e) {
      const msg = String(e.message || e).split("\n")[0];
      meta.failed.push(`${label}: ${msg}`);
      console.log(`${label}: FAILED (${msg})`);
    }
  };
  for (const proj of projects) {
    const dir = path.join(OUT, "raw", proj.slug);
    fs.rmSync(dir, { recursive: true, force: true });
    fs.mkdirSync(path.join(dir, "frames"), { recursive: true });
    if (proj.frames[0]?.name !== "home") throw new Error(`${proj.slug}: first frame must be "home" (it becomes the poster)`);
    const page = await newPage(browser, proj);
    let n = 0;
    for (const f of proj.frames) {
      await attempt(`${proj.slug} frame ${f.name}`, async () => {
        // fresh navigation per frame unless continue:true, so one frame's clicks cannot leak into the next
        if (!f.continue) await open(page, proj, f.url ?? proj.url);
        await runSteps(page, f.steps);
        await page.waitForTimeout(f.settle ?? proj.settle ?? 600);
        const file = path.join(dir, "frames", `${String(n + 1).padStart(2, "0")}-${f.name}.png`);
        await page.screenshot({ path: file, ...SHOT });
        n += 1;
      });
    }
    for (const c of proj.plates) {
      await attempt(`${proj.slug} plate ${c.name}`, async () => {
        await open(page, proj, c.url ?? proj.url);
        await runSteps(page, c.steps);
        await hide(page, c.hide ?? []);
        await page.waitForTimeout(c.settle ?? proj.settle ?? 600);
        const file = path.join(dir, `plate-${c.name}.png`);
        if (c.selector) await page.locator(c.selector).first().screenshot({ path: file, ...SHOT });
        else await page.screenshot({ path: file, clip: c.clip, ...SHOT }); // clip is viewport-relative
      });
    }
    await page.context().close();
  }
  await browser.close();
  fs.writeFileSync(path.join(OUT, "capture.json"), JSON.stringify(meta, null, 2));
  if (meta.failed.length) console.log(`\n${meta.failed.length} shot(s) failed:\n  ${meta.failed.join("\n  ")}`);
}

const PY = spawnSync("python", ["--version"]).status === 0 ? "python" : "py";

function run(cmd, a) {
  const r = spawnSync(cmd, a, { stdio: "inherit" });
  if (r.status !== 0) throw new Error(`${cmd} ${a.join(" ")} -> exit ${r.status}`);
}

// cover-crop to 16:10, then 480x300 (the hover card's exact box)
const VF = "scale=480:300:force_original_aspect_ratio=increase:flags=lanczos,crop=480:300";

function encodePreview(seq, out) {
  for (const crf of [22, 25, 28]) {
    run("ffmpeg", [
      "-y", "-loglevel", "error",
      "-framerate", "11/8", "-i", path.join(seq, "%02d.png"),
      "-vf", VF, "-pix_fmt", "yuv420p",
      "-c:v", "libx264", "-profile:v", "high", "-preset", "veryslow", "-tune", "stillimage",
      "-crf", String(crf), "-r", "11/8", "-movflags", "+faststart", "-an",
      out,
    ]);
    const kb = fs.statSync(out).size / 1024;
    console.log(`${path.basename(path.dirname(out))}: crf ${crf} -> ${kb.toFixed(0)} KB`);
    if (kb <= 250) break;
  }
}

function poster(png, jpg) {
  run("ffmpeg", ["-y", "-loglevel", "error", "-i", png, "-vf", VF, "-frames:v", "1", "-q:v", "3", jpg]);
}

function pngSize(f) {
  const b = fs.readFileSync(f); // IHDR: width at byte 16, height at byte 20
  return { w: b.readUInt32BE(16), h: b.readUInt32BE(20) };
}

async function build() {
  for (const proj of projects) {
    const raw = path.join(OUT, "raw", proj.slug);
    const b = path.join(OUT, "build", proj.slug);
    fs.rmSync(b, { recursive: true, force: true });
    fs.mkdirSync(path.join(b, "seq"), { recursive: true });
    fs.mkdirSync(path.join(b, "old"));
    for (const c of proj.plates) {
      if (!fs.existsSync(path.join(raw, `plate-${c.name}.png`))) {
        console.log(`${proj.slug}: plate ${c.name} was not captured, skipped`);
        continue;
      }
      run(PY, [
        path.join(ROOT, "scripts", "plate.py"),
        path.join(raw, `plate-${c.name}.png`),
        path.join(b, `plate-${c.name}.png`),
        "--width", "440",
        "--gamma", String(c.gamma ?? 1),
        "--contrast", String(c.contrast ?? 1),
        "--autocontrast", String(c.autocontrast ?? 0),
      ]);
    }
    fs.readdirSync(path.join(raw, "frames"))
      .filter((f) => f.endsWith(".png"))
      .sort()
      .forEach((f, i) => fs.copyFileSync(path.join(raw, "frames", f), path.join(b, "seq", `${String(i + 1).padStart(2, "0")}.png`)));
    encodePreview(path.join(b, "seq"), path.join(b, "preview.mp4"));
    poster(path.join(b, "seq", "01.png"), path.join(b, "poster.jpg"));
    const old = path.join(ROOT, "public", "previews", `${proj.slug}.mp4`);
    if (fs.existsSync(old)) run("ffmpeg", ["-y", "-loglevel", "error", "-i", old, "-fps_mode", "passthrough", path.join(b, "old", "%02d.png")]);
  }
  writeSheet();
  console.log(`\nout: ${OUT}\nsheet: ${path.join(OUT, "sheet.html")}`);
}

// Local contact sheet: the owner opens it himself, ticks one plate per project,
// pastes the command it prints. Never copied into the repo, never published.
function writeSheet() {
  const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/"/g, "&quot;");
  const url = (p) => pathToFileURL(p).href;
  const kb = (p) => (fs.statSync(p).size / 1024).toFixed(0);
  const sections = projects.map((proj) => {
    const b = path.join(OUT, "build", proj.slug);
    const rawFrames = path.join(OUT, "raw", proj.slug, "frames");
    const current = path.join(ROOT, "public", "plates", `${proj.slug}.png`);
    const plates = [
      fs.existsSync(current)
        ? `<figure class="plate"><span class="tag">current (public/plates, ${kb(current)} KB)</span><img src="${url(current)}"></figure>`
        : "",
      ...proj.plates.map((c, i) => {
        const f = path.join(b, `plate-${c.name}.png`);
        if (!fs.existsSync(f)) return "";
        const { w, h } = pngSize(f);
        return `<figure class="plate"><label><input type="radio" name="${esc(proj.slug)}" value="${esc(c.name)}"${i === 0 ? " checked" : ""}> ${esc(c.name)} &middot; ${w}x${h} &middot; ${kb(f)} KB</label><img src="${url(f)}"><figcaption>${esc(c.caption)}</figcaption></figure>`;
      }),
    ].join("");
    const mp4 = path.join(b, "preview.mp4");
    const oldMp4 = path.join(ROOT, "public", "previews", `${proj.slug}.mp4`);
    const videos = [
      fs.existsSync(mp4)
        ? `<div class="card"><div class="media"><video src="${url(mp4)}" muted loop autoplay playsinline></video></div><p>new &middot; ${kb(mp4)} KB</p></div>`
        : "",
      fs.existsSync(oldMp4)
        ? `<div class="card"><div class="media"><video src="${url(oldMp4)}" muted loop autoplay playsinline></video></div><p>current (public/previews, ${kb(oldMp4)} KB)</p></div>`
        : "",
    ].join("");
    const frames = fs.existsSync(rawFrames)
      ? fs
          .readdirSync(rawFrames)
          .filter((f) => f.endsWith(".png"))
          .sort()
          .map((f) => `<figure class="frame"><img src="${url(path.join(rawFrames, f))}"><figcaption>${esc(f)}</figcaption></figure>`)
          .join("")
      : "";
    return `<section><h2>${esc(proj.slug)} <small>${esc(proj.url)}</small></h2><div class="row">${plates}</div><div class="row">${videos}</div><div class="row frames">${frames}</div></section>`;
  });
  const html = [
    '<!doctype html><meta charset="utf-8"><title>plates and previews</title>',
    "<style>",
    'body{font-family:Times,"Times New Roman",serif;background:#f6f7f9;color:#000;margin:0;padding:24px 24px 120px}',
    "h1{font-size:19px;font-weight:normal;margin:0 0 20px}h2{font-size:24px;font-weight:normal;margin:36px 0 10px}h2 small{font-size:13px;color:#555;margin-left:10px}",
    ".row{display:flex;flex-wrap:wrap;gap:18px;align-items:flex-start;margin:10px 0}",
    ".plate{margin:0;width:440px;padding:3px;border:1px solid #c8ccd1;background:#f6f7f9}.plate img{display:block;width:100%;height:auto}",
    ".plate label,.plate .tag{display:block;font-size:13px;padding:2px 2px 6px}.plate .tag{color:#555}.plate figcaption{font-size:13px;color:#555;line-height:1.45;padding:4px 2px 1px}",
    ".card{width:480px}.media{aspect-ratio:16/10;overflow:hidden;background:#232220;border:1px solid #7c828b}.media video{width:100%;height:100%;object-fit:cover;display:block}.card p{font-size:13px;color:#555;margin:4px 0}",
    ".frames{gap:10px}.frame{margin:0;width:240px}.frame img{display:block;width:100%;border:1px solid #c8ccd1}.frame figcaption{font-size:11px;color:#555}",
    "pre{position:fixed;left:24px;right:24px;bottom:16px;margin:0;background:#fff;border:1px solid #c8ccd1;padding:10px;font-size:13px;white-space:pre-wrap;word-break:break-all}",
    "</style>",
    "<h1>Pick one plate per project. The command at the bottom applies the picks.</h1>",
    ...sections,
    '<pre id="cmd"></pre>',
    "<script>",
    `var OUT=${JSON.stringify(OUT)};`,
    "function update(){var picks=[].slice.call(document.querySelectorAll('input[type=radio]:checked')).map(function(r){return r.name+'='+r.value});",
    "document.getElementById('cmd').textContent='npm run assets -- apply --out \"'+OUT+'\" --pick '+picks.join(',');}",
    "document.addEventListener('change',update);update();",
    "</script>",
  ].join("\n");
  fs.writeFileSync(path.join(OUT, "sheet.html"), html);
}

function apply() {
  const picks = (opt("pick", "") || "")
    .split(",")
    .filter(Boolean)
    .map((kv) => kv.split("="));
  if (!picks.length) throw new Error("--pick slug=candidate,... required");
  const ctsPath = path.join(ROOT, "src", "content.ts");
  let cts = fs.readFileSync(ctsPath, "utf8");
  for (const [slug, cand] of picks) {
    const proj = PROJECTS.find((p) => p.slug === slug);
    const c = proj?.plates.find((x) => x.name === cand);
    if (!c) throw new Error(`unknown pick ${slug}=${cand}`);
    const b = path.join(OUT, "build", slug);
    if (!flag("no-plates")) {
      const src = path.join(b, `plate-${cand}.png`);
      fs.copyFileSync(src, path.join(ROOT, "public", "plates", `${slug}.png`));
      const { w, h } = pngSize(src);
      const re = new RegExp(`(slug: "${slug}"[\\s\\S]*?plateW: )\\d+(,\\r?\\n\\s*plateH: )\\d+`); // \r?\n: autocrlf repo
      if (!re.test(cts)) throw new Error(`plateW/plateH block not found for ${slug}`);
      cts = cts.replace(re, `$1${w}$2${h}`);
      const cap = (cts.match(new RegExp(`slug: "${slug}"[\\s\\S]*?plateCap: "([^"]*)"`)) || [])[1];
      const changed = cap !== c.caption
        ? `\n  SUBJECT CHANGED: plateCap is "${cap}", candidate says "${c.caption}" -> rewrite plateAlt/plateCap (content.ts) and plateCap (content.es.ts)`
        : "";
      console.log(`${slug}: plate ${w}x${h} from "${cand}"${changed}`);
    }
    if (!flag("no-previews")) {
      fs.copyFileSync(path.join(b, "preview.mp4"), path.join(ROOT, "public", "previews", `${slug}.mp4`));
      fs.copyFileSync(path.join(b, "poster.jpg"), path.join(ROOT, "public", "previews", `${slug}.jpg`));
      console.log(`${slug}: preview + poster`);
    }
  }
  fs.writeFileSync(ctsPath, cts); // only digits change, line endings preserved
}

// Against the local dev server: every plate at its natural size, every preview playing at 480x300, no console errors.
async function verify() {
  const base = opt("base", "http://localhost:4444");
  const browser = await launch();
  const page = await (await browser.newContext({ viewport: VIEWPORT })).newPage();
  const errors = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(String(e)));
  await page.goto(base, { waitUntil: "networkidle" });
  const plates = await page.$$eval("figure.brutPlate", (figs) =>
    figs.map((f) => {
      const i = f.querySelector("img");
      return {
        cap: f.querySelector("figcaption").textContent.trim().slice(0, 14),
        src: i.getAttribute("src"),
        attr: [+i.getAttribute("width"), +i.getAttribute("height")],
        natural: [i.naturalWidth, i.naturalHeight],
        complete: i.complete,
      };
    }),
  );
  console.table(plates);
  for (const p of plates) {
    if (!(p.complete && p.natural[0] === 440 && p.attr[0] === 440 && p.attr[1] === p.natural[1])) throw new Error(`plate mismatch ${p.src}`);
  }
  await page.mouse.move(20, 20);
  await page.mouse.move(40, 40); // arms WorkHoverLazy, which mounts on first interaction
  await page.waitForTimeout(500);
  for (const li of await page.$$(".brutWork > li")) {
    await li.scrollIntoViewIfNeeded();
    await li.hover();
    await page.waitForTimeout(900);
    const v = await page
      .$eval(".workHoverMedia video", (el) => ({ src: el.getAttribute("src"), ready: el.readyState, paused: el.paused, size: [el.videoWidth, el.videoHeight] }))
      .catch(() => null);
    console.log(v);
    if (!v || v.ready < 2 || v.paused || v.size[0] !== 480 || v.size[1] !== 300) throw new Error("preview not playing at 480x300");
  }
  if (errors.length) throw new Error(`console errors:\n${errors.join("\n")}`);
  await browser.close();
  console.log("verify OK");
}

// Selector scouting: what a live page exposes at 1440x900, so the config can be
// written against the real DOM (buttons, links, headings, fixed bars).
async function inspect() {
  const urls = args.slice(1).filter((a) => /^https?:/.test(a));
  if (!urls.length) throw new Error("inspect <url> [url...] [--click <selector>]");
  const click = opt("click", "");
  const browser = await launch();
  for (const u of urls) {
    const page = await newPage(browser, {});
    await page.goto(u, { waitUntil: "load", timeout: 60000 });
    await page.waitForLoadState("networkidle", { timeout: 8000 }).catch(() => {});
    await page.waitForTimeout(1500);
    if (click) {
      await tap(page, click); // e.g. an entry gate, to scout what sits behind it
      await page.waitForTimeout(2000);
    }
    const info = await page.evaluate(() => {
      const t = (s) => (s || "").replace(/\s+/g, " ").trim().slice(0, 60);
      const cls = (e) => t(typeof e.className === "string" ? e.className : e.getAttribute("class")).slice(0, 50);
      const vis = (e) => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0; };
      const items = [...document.querySelectorAll("a,button,[role=button],input,select")].filter(vis).slice(0, 70).map((e) => ({
        tag: e.tagName.toLowerCase(), id: e.id || "", text: t(e.innerText || e.value), aria: t(e.getAttribute("aria-label")),
        title: t(e.getAttribute("title")), href: e.getAttribute("href") || "", cls: cls(e),
      }));
      const heads = [...document.querySelectorAll("h1,h2")].filter(vis).slice(0, 25).map((e) => `${e.tagName}: ${t(e.innerText)}`);
      const fixed = [...document.querySelectorAll("body *")]
        .filter((e) => { const p = getComputedStyle(e).position; return (p === "fixed" || p === "sticky") && vis(e); })
        .slice(0, 15)
        .map((e) => `${e.tagName.toLowerCase()}${e.id ? `#${e.id}` : ""} .${cls(e)} :: ${t(e.innerText).slice(0, 40)}`);
      return { title: document.title, h: document.documentElement.scrollHeight, canvas: document.querySelectorAll("canvas").length,
        video: document.querySelectorAll("video").length, imgs: document.images.length, items, heads, fixed };
    });
    console.log(`\n==== ${u} :: ${info.title} :: scrollH ${info.h} canvas ${info.canvas} video ${info.video} imgs ${info.imgs}`);
    console.log("-- headings"); info.heads.forEach((h) => console.log(`  ${h}`));
    console.log("-- fixed/sticky"); info.fixed.forEach((h) => console.log(`  ${h}`));
    console.log("-- interactive");
    info.items.forEach((i) => console.log(`  <${i.tag}${i.id ? `#${i.id}` : ""}> text="${i.text}" aria="${i.aria}" title="${i.title}" href="${i.href}" cls="${i.cls}"`));
    await page.context().close();
  }
  await browser.close();
}

// ---------------------------------------------------------------- main

const USAGE = "usage: node scripts/assets.mjs probe|inspect <url>|capture|build|all|apply|verify [--out <dir>] [--only slug,..] [--pick slug=name,..] [--browser chromium|chrome|msedge] [--headed] [--swiftshader] [--base <url>]";

async function main() {
  switch (args[0]) {
    case "probe": await probe(); break;
    case "inspect": await inspect(); break;
    case "capture": await capture(); break;
    case "build": await build(); break;
    case "all": await capture(); await build(); break;
    case "apply": apply(); break;
    case "verify": await verify(); break;
    default:
      console.log(USAGE);
      process.exit(args[0] ? 1 : 0);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
