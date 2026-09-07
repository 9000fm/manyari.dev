# CLAUDE.md

Guidance for Claude Code when working in this repo.

## Project

**manyari.dev** - personal portfolio for Flavio Manyari, freelance designer and developer in Lima.

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
- **No animation or 3D libraries.** `package.json` runtime deps are only `next`, `react`, `react-dom`.
  The globe is hand-written WebGL. Framer Motion appears in `SKILLS` as a claimed skill, not as a dependency.

## Layout

```
src/
  content.ts              # ME, PROJECTS, EXPERIENCE, SKILLS, EDUCATION,
                          # SERVICES, TICKER, LANGUAGES, VARIANTS - single source of truth
  fonts.ts                # next/font/google loaders
  app/
    page.tsx              # 2 lines: re-exports v11a-sidebar as the homepage
    layout.tsx            # minimal shell, no global font, no global background
    globals.css           # tailwind import + box-sizing reset only (18 lines, zero animation)
    opengraph-image.tsx · robots.ts · sitemap.ts · icon.svg
    v11a-sidebar/page.tsx # THE SITE. Monobook-style layout CSS + composition
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

- `npm run lint` reports **5 pre-existing errors**: 2 in `_brutalist/WorkHover.tsx` (refs accessed
  during render), and one each in `v03-newspaper`, `v06-terminal`, `v08-riso` (unescaped entities,
  comment-in-JSX). All predate current work. Fix them deliberately, not as drive-by noise, and
  do not treat a red lint run as proof that your change broke something.

## Commands

```bash
npm run dev      # localhost:3000
npm run build    # production build, 21 static routes
npm run lint     # ESLint (see Known issues above)
```
