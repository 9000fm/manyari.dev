# Fable 5 brief - "image trail" interaction for Selected Work (manyari.dev)

> Handoff from an Opus 4.8 session on 2026-07-22. Two attempts were rejected by the
> owner; he wants a more artistic/original take, so bringing in Fable 5.
> **Nothing is live. Production is untouched. Do NOT push without explicit approval.**

## TL;DR

Build a signature, award-quality **image-trail / "worm"** interaction over the
**Selected Work** list on manyari.dev. As the cursor moves, screenshots reveal and
follow the movement ("like a worm that leaves a trail"). Must also work on mobile.
The current live behavior (a single preview card that trails the cursor) is fine but
the owner wants something *much* more pro.

## The site (context)

- **Repo:** `E:\WEB+DESIGN\_LIVE\manyari.dev`. Next 16, React 19, TypeScript, Tailwind v4.
  Only runtime deps are `next`/`react`/`react-dom` (keep that minimalism if possible).
  Deploys to **manyari.dev** via Vercel on push to `main`. Last good commit: `403b4a8`.
- **Aesthetic:** Wikipedia "Monobook" document look - Times New Roman, small-caps ruled
  headings, blue underline links, grey page frame on a dark desk, a WebGL globe in the
  sidebar. Minimal, editorial, "raw HTML document". The effect must fit a *document*, not
  read like a generic glossy agency site. That tension is the whole design challenge.
- **Homepage:** `src/app/v11a-sidebar/page.tsx` (re-exported by `app/page.tsx`). Shared body
  markup in `src/app/_brutalist/shared.tsx`.
- **Selected Work markup:** `<ol class="brutWork"> <li> <a href={url}>Title</a> ...blurb </li> </ol>`
  - 5 projects, each `<li>` = one project. Data in `src/content.ts` (`PROJECTS`: slug/title/url/blurb).

## Currently LIVE (the fallback to preserve)

`src/app/_brutalist/WorkHover.tsx` (+ `WorkHoverLazy.tsx` wrapper, mounted in `page.tsx`).
Desktop: hovering a row shows ONE bordered preview card (the project GIF) easing after the
cursor. Mobile: tap a row -> centered preview over a backdrop. Keep this as the fallback;
the new effect replaces it only once approved.

## The goal (owner's words, distilled)

- Reveals screenshots, **triggered by MOUSE MOVEMENT** (stop moving = nothing new spawns).
- Feels rich - *"que no sean pocos"* (not sparse).
- Must **also trigger on mobile** (no hover) - e.g. autoplay when the section scrolls into
  view, or touch-driven.
- Must NOT feel chaotic / must not "show all the pages at once".

## Two attempts ALREADY REJECTED (do not repeat)

1. **Worm-chain (follow-with-easing).** A chain of N images; head follows the cursor, each
   segment lags. **REJECTED:** when the cursor slows/stops, all segments converge into a
   PILE - looked like a messy stack of overlapping images. Wrong algorithm for a trail.
2. **Placement trail (Codrops-style pop + fade), per-project, static frames.** On movement
   past a threshold, drop a copy of the hovered project's screenshot at the cursor point; it
   fades out in place. Technically correct (no pile), per-project relevance. **REJECTED:**
   owner said *"el fade esta horrible y no es el efecto que busco"*. The plain opacity
   pop-fade is not the vibe.

## The real creative question

He rejected BOTH the naive chain and the classic pop-fade -> he wants something more
original/artistic. Explore directions **beyond a plain fade**, for example:

- Trail images that persist and **slide/scale with momentum**, **masked/clip-path reveals**
  (wipe in like a scan), or a brief **distortion / RGB-split / photocopy** treatment on spawn.
- A **canvas/WebGL** image trail (curl-noise displacement, fluid, or a mesh sampling the
  screenshots) - but weigh hard against the minimalist document aesthetic + no-deps goal.
- A treatment that leans INTO the Monobook/editorial feel (hard-edged, printy, halftone,
  1-bit, "photocopied") instead of glossy - that could be the thing that makes it feel
  bespoke to THIS site rather than a template effect.

**Propose 2-3 genuinely distinct directions with tiny live demos and let the owner PICK.**
He strongly prefers option pickers for every design decision.

## Assets

- 5 project GIFs: `public/previews/{tonydecay,silverback,superself,micaela,digeart}.gif`.
  These are **animated slideshows** of each site (many pages) - using them animated in a
  trail looks chaotic (his complaint: "veo de todas las paginas"). Prefer clean **static**
  screenshots for the trail.
- Owner's preferred asset workflow: **you capture several good screenshots per project, then
  build a dynamic HTML picker** (same pattern as the temporary `globe-bg` preview page this
  session used) so HE curates which shots make it in. His words: *"mejor tu tomalas y yo las
  elijo en algun HTML dinamico."*
- Live sites to capture: tonydecay.com, silverbackstripes.com, superself.online,
  micaelalucia.com, digeart.online. (superself is WebGL-heavy, may render slowly.)
- Capture MULTIPLE distinct shots per project (hero / mid-scroll / detail) so a single
  project's hover has real variety.
- First-frame extraction that worked this session (if you want quick statics from the GIFs):
  `ffmpeg -y -ss 1.5 -i in.gif -frames:v 1 -vf scale=560:-1 out.jpg` (ffmpeg is installed).

## Hard constraints (non-negotiable)

- **DO NOT push to `main` without explicit owner approval.** Build + `npm run start`, let him
  test on localhost:3000, push only when he says.
- **Cannot break navigation:** the trail overlay must be `position:fixed; pointer-events:none`
  so it never intercepts clicks - project links must stay usable. z-index below the mobile
  nav (nav is z-100; use ~80).
- **prefers-reduced-motion:** disable the effect entirely.
- **No layout shift, no console errors, performant.** He is very sensitive to jank and told me
  "lo ultimo que necesito es bugs en mi portafolio".
- **Isolated:** one component mounted in `page.tsx`; do not touch the globe, smooth-scroll,
  sidebar, etc.

## How the owner works

- Wants genuinely DISTINCT options via a **picker** for any design/behavior call - never
  guess-and-apply, even when the fix seems obvious.
- Short replies (he's dyslexic) - be terse, no walls of text. Spanish or English both fine.
- **No em-dashes or en-dashes anywhere** - use plain hyphens. (Hard global rule of his.)
- Verify on localhost before committing; he decides when it's "done" and authorizes each push.
- Avoid `claude-in-chrome` browser automation (wastes tokens). Playwright MCP is OK for
  headless screenshots.

## Server hygiene (learned the hard way this session)

Multiple `npm run start` background servers piled up as **zombies** and kept serving STALE
builds on :3000, causing repeated "I don't see my changes" confusion. Before starting a
server: **kill all existing next-start node processes, start ONE, then verify it serves the
CURRENT build** (grep a known marker string in the served HTML).

## Suggested first moves for Fable 5

1. Capture 2-3 clean screenshots per project (Playwright headless) -> build a dynamic HTML
   picker page so the owner curates the set.
2. Propose 2-3 DISTINCT trail directions (NOT chain, NOT plain pop-fade) with tiny live demos
   -> owner picks.
3. Build the chosen one behind every safety constraint above. Verify on localhost. Await push.
