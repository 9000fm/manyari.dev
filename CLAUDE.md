# CLAUDE.md

Guidance for Claude Code when working in this repo.

## Project

**fm-portfolio** — Personal portfolio for Flavio Manyari.

Status: **direction-study phase** — 12 fully-coded variants live at `/v01-…` through `/v12-…`. User picks the winner; losing variants get deleted in a follow-up; winner is promoted to `/`.

## Repo & Deploy

- **Repo:** github.com/9000fm/fm-portfolio
- **Deploy:** Vercel (auto-deploys on push to `main`)
- **Live:** https://fm-portfolio-nine.vercel.app

## Stack

- Next.js 16.1.1 (App Router, Turbopack) · React 19.2.3 · TypeScript 5
- Tailwind CSS v4 (PostCSS plugin) — used minimally; variants are mostly inline-styled
- No 3D, no GSAP, no Framer Motion, no Lenis. Type-only.

## Layout

```
src/
  content.ts            # ME + PROJECTS + VARIANTS — single source of truth
  fonts.ts              # next/font/google loaders, one export per variant
  app/
    layout.tsx          # minimal HTML shell; no global font; no global bg
    globals.css         # tailwind import + box-sizing reset only
    page.tsx            # variant index — lists all 12 with vibe notes
    v01-swiss/page.tsx
    v02-warm70s/page.tsx
    v03-newspaper/page.tsx
    v04-win95/page.tsx
    v05-macos7/page.tsx
    v06-terminal/page.tsx
    v07-y2k/page.tsx
    v08-riso/page.tsx
    v09-bauhaus/page.tsx
    v10-midcentury/page.tsx
    v11-brutalist/page.tsx
    v12-cassette/page.tsx
```

## Variant policies

- Each variant is a **single self-contained `page.tsx`** — no shared variant components. Deleting losers should be `rm -rf src/app/vNN-*`.
- All variants pull content from `@/content` (ME, PROJECTS).
- Variants differ **only in presentation**. Same 4 sections: hero, work, about, contact.
- Each variant ships its own `metadata.title` (`Flavio Manyari — <variant name>`) so browser tabs are identifiable.
- A `← all variants` link top-left back to `/`.
- Project items render as `<a target="_blank">` when `url` is set, plain text when `null`.

## Conventions

- **Inline `style={{ ... }}` is the default for variant pages** — each variant is one-off; Tailwind utility ceremony adds friction. globals.css stays minimal on purpose.
- **Server components by default**. Use `'use client'` only when actually needed (no variant currently needs it — blinking cursors are CSS animations).
- **No new font families without updating `src/fonts.ts`.** All fonts via `next/font/google`.
- **Don't add real project imagery / OG images / CV PDF until a winning variant is picked.**

## Content

- Populated from CV at `../../personal-docs/Flavio-Manyari-CV-2026-ATS-EN.txt`.
- Featured projects: Ecolution, Superself.online, Micaela Lucia's Portfolio, Digeart.
- Email on the public site: `flavio@superself.online` (CV email, branded).
- Name: **Flavio Manyari** (single i — matches CV/LinkedIn/email).

## Commands

```bash
npm run dev      # dev server, localhost:3000
npm run build    # production build (TS + 16 static routes)
npm run lint     # ESLint
```
