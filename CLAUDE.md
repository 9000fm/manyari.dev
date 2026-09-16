# CLAUDE.md

Guidance for Claude Code when working in this repo.

## Project

**manyari.dev** - personal portfolio for Flavio Manyari, freelance designer and developer.

The direction study is over. `v11a-sidebar` won and is live at `/`.
The other 14 variants still build and are still routed, kept as a reference archive rather than as candidates.
Only `/` is the real site. Treat everything under `v01-*` … `v12-*` as frozen unless asked otherwise.

## Repo & Deploy

- **Repo:** github.com/9000fm/fm-portfolio
- **Deploy:** Vercel, auto-deploys on push to `main`
- **Live:** https://manyari.dev
- Never push without asking. The user verifies on localhost first and decides when something is done.

## Stack

- Next.js 16.1.1 (App Router, Turbopack) · React 19.2.3 · TypeScript 5
- Tailwind CSS v4 present but barely used. Pages are inline-styled and ship CSS as template strings.
- **No animation or 3D libraries.** `package.json` runtime deps are `next`, `react`, `react-dom` and
  `@vercel/analytics` (Web Analytics, mounted once in `layout.tsx`; the project must have Analytics
  enabled in the Vercel dashboard or nothing is collected). The globe is hand-written WebGL.
  Framer Motion appears in `SKILLS` as a claimed skill, not as a dependency.
- Dev deps include `playwright-core` (pinned) for `scripts/`: the plates/previews pipeline and the CV printer.

## Layout

```
src/
  content.ts              # ME, PROJECTS, EXPERIENCE, SKILLS, EDUCATION,
                          # SERVICES, TICKER, LANGUAGES, VARIANTS - single source of truth
  fonts.ts                # next/font/google loaders
  app/
    page.tsx              # 2 lines: re-exports v11a-sidebar as the homepage
    layout.tsx            # minimal shell, metadata from ME, Vercel Analytics
    not-found.tsx         # the 404, "this page does not exist" in the site frame
    globals.css           # tailwind import + box-sizing reset only (18 lines, zero animation)
    opengraph-image.tsx · robots.ts · sitemap.ts · icon.svg · icon.png · favicon.ico
    v11a-sidebar/page.tsx # THE SITE. Monobook-style layout CSS + composition
    _cv/CvSheet.tsx       # the printed CV, reads content.ts; not a route (see CV PDFs)
    _brutalist/           # shared internals for the v11 family (underscore = not a route)
      shared.tsx          #   SHARED_CSS, Sections(), NAV_SECTIONS - all page content
      WelcomeBanner.tsx   #   dismissible yellow notice
      WireSphere.tsx      #   globe canvas; lazy-imports the heavy module
      globeGL.ts          #   WebGL renderer + spin physics
      globeDrag.ts        #   slingshot pointer handling
      globeMainThread.ts  #   rAF loop, wires drag to the controller
      MobileNav.tsx · Ticker.tsx · WorkHover.tsx · WorkHoverLazy.tsx
      SmoothScroll.tsx · SmoothWheel.tsx · useMountOnInteraction.ts
      coastline.ts · landfill.ts · landgrid.ts   # ~140KB of geo data for the globe
    v01-* … v12-*         # frozen variant archive
scripts/
  assets.mjs · assets.config.mjs · plate.py   # plates + previews pipeline (see below)
  cv-pdf.mjs                                  # prints the CV PDFs from _cv/CvSheet.tsx
```

## Conventions

- **Server components by default.** `'use client'` only where there is real interactivity.
- **Inline `style={{}}` and template-string CSS** are the house style. `globals.css` stays minimal on purpose.
- Content lives in `content.ts`, never hardcoded into a page.
- **Anchor ids are load-bearing.** `#about #work #experience #education #services #tools #contact`
  feed `NAV_SECTIONS` in `shared.tsx`, which drives the sidebar TOC, the mobile burger menu, and the footer index.
  Renaming one silently breaks three navs.
- Editing `.brutExp` styling hits **both** Experience and Education, they share the class.

## Type scale (enforced, 6 sizes, defined in shared.tsx :root)

| Token | px | Where |
|---|---|---|
| `--t-name` | 28 | Sidebar name only |
| `--t-head` | 24 | Section h2 |
| `--t-lead` | 19 | Lead lines (contact lead, banner close) |
| `--t-body` | 18 | Body text |
| `--t-small` | 16 | Lists and items: TOC, Toolbox, footer lists, mobile nav |
| `--t-micro` | 13 | Small-caps LABELS (Herramientas, Index, Contacto), topline, colophon |

Rule: small-caps section labels are `--t-micro`; the list ITEMS under them are `--t-small`. Never a hardcoded px.

## Motion

Every animation is hand-rolled CSS in a template string. The established idiom:

- Interaction transitions **0.12s - 0.34s**, easing `ease` or `cubic-bezier(0.16,0.84,0.28,1)`
- Ambient loops are `linear infinite` at very long durations
- **Every non-trivial animation needs a `prefers-reduced-motion: reduce` escape hatch.** No exceptions.
- Prefer transform + opacity so it stays on the GPU

Globe interaction is a **slingshot**: drag accumulates "pull", the visible rotation is a
tanh-compressed fraction of it, so the globe deliberately lags further behind the further you
haul. Release converts stored pull (distance, not speed) into velocity, capped by `MAX_VEL`,
decaying back to idle over ~4s. Tuning constants are documented at the top of
`globeDrag.ts` and above `MAX_VEL` in `globeGL.ts`.

## Performance

TBT was a real problem and the fixes are load-bearing. Do not undo them casually:

- The globe's WebGL + geo data is dynamic-imported one `requestAnimationFrame` **after** mount,
  so it stays out of the initial bundle but still loads reliably. Do not make it eager,
  and do not gate it on interaction (it would render blank).
- `.identSphere` reserves the canvas box so the name never shifts when the globe arrives.
- `WorkHoverLazy` defers the hover previews until first interaction.

## Writing

- **Never use em dashes or en dashes**, anywhere: code, content strings, comments, commit messages, chat.
  Use a plain hyphen. This applies to `content.ts` strings, which render to the live page.
- The `humanizer` skill is installed. Run new prose through it before committing.
- Site register is plain and factual, close to a Wikipedia article. No promotional language.
- **Never invent biographical facts.** Ground every claim in `content.ts` or the CV at
  `E:\WEB+DESIGN\_PERSONAL\cv\Flavio-Manyari-CV-2026-ATS-EN.txt`. Ask instead of guessing.
- The freelance Experience blurb stays **general, with no named projects** (deliberate, commit `bcaf56e`).
  The projects are already listed in Work directly above it.

## Content facts

- Name: **Flavio Manyari** (single i)
- Public email: `flavio@manyari.dev`
- Live projects: Tony Decay, Silverback Stripes, Superself.online, Micaela Lucía, Digeart
- Ecolution was removed from both CV and site (the client's site was hacked). Do not re-add it.
- No degree is claimed. Both UPC careers are unfinished, so education is framed as "studies".
  The Skillnest bootcamp is the one completed credential and is listed first.

## Known issues

- `npm run lint` reports **3 pre-existing errors**, one each in `v03-newspaper`, `v06-terminal`,
  `v08-riso` (unescaped entities, comment-in-JSX), all in the frozen archive. Fix them deliberately,
  not as drive-by noise, and do not treat a red lint run as proof that your change broke something.

## Commands

```bash
npx next dev -p 4444   # localhost:4444 (port 3000 belongs to the digeart dev server)
npm run build          # production build, 21 static routes
npm run lint           # ESLint (see Known issues above)
```

## Regenerating plates and previews

Plates (`public/plates/<slug>.png`, 1-bit Atkinson, 440px wide) and hover previews
(`public/previews/<slug>.mp4` + `.jpg` poster, 480x300, 11/8 fps stepped slideshow) are built
from live-site screenshots by `scripts/assets.mjs` (Node + playwright-core) and `scripts/plate.py`
(Pillow + numpy). What gets captured is declared per project in `scripts/assets.config.mjs`:
ordered frames (the first is always `home`, it becomes the poster) and 2-3 plate candidates with
crop and gamma. Scout a site's real DOM first: `npm run assets -- inspect <url> [--click <sel>]`.

1. `npm run assets -- all --out "<scratch dir>"` captures, dithers, encodes, writes `<scratch dir>\sheet.html`.
2. Open the sheet locally and pick one plate per project. The sheet is never committed or published.
3. `npm run assets -- apply --out "<scratch dir>" --pick digeart=grid,tonydecay=foundation,...`
   copies the chosen assets and rewrites `plateW`/`plateH` in `content.ts`. When the subject changed,
   rewrite `plateAlt`/`plateCap` (`content.ts`) and `plateCap` (`content.es.ts`) by hand.
4. `npx next dev -p 4444`, then `npm run assets -- verify --base http://localhost:4444`.

Needs ffmpeg on PATH, Python 3 with `pip install -r scripts/requirements.txt`, and the pinned
Playwright headless shell (`npx playwright-core install chromium` on a fresh machine).
`--browser chrome` uses the system Chrome, `--only <slug>` limits the run.
Never CSS-upscale a plate: 440px is its natural width.

## CV PDFs

`public/Flavio-Manyari-CV.pdf` (EN) and `public/Flavio-Manyari-CV-ES.pdf` (ES) are printed from
`src/app/_cv/CvSheet.tsx`, which reads `content.ts` and `content.es.ts`. Nothing is hardcoded there,
so a copy change on the site is a reprint away. With the dev server on 4444:
`node scripts/cv-pdf.mjs [--png <dir>]`. The script mounts a temporary `/cv` route (gitignored),
prints A4 at 14mm margins, removes the route and reports the sheet height: it must stay under
1017px for one page. Tighten leading in `CvSheet.tsx`, never cut copy. The Spanish site links the
ES PDF through `data-es-href`, swapped by `useLang.ts`.
