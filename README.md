# manyari.dev

Personal portfolio for Flavio Manyari, web designer and developer.
Live at https://manyari.dev.

## Stack

- Next.js 16 (App Router, Turbopack)
- React 19, TypeScript 5
- Tailwind CSS v4, used for the base reset only. Pages are inline-styled and ship their CSS as template strings.
- No animation or 3D libraries. The globe is hand-written WebGL.

## Layout

- `src/content.ts` holds all site content. `src/content.es.ts` is the Spanish mirror.
- `src/app/page.tsx` is the site.
- `src/app/_brutalist/` holds the shared sections, CSS, and client islands: globe, mobile nav, hover previews.

## Development

```bash
npm install
npm run dev    # localhost:3000
npm run build  # production build
npm run lint   # ESLint
```

## Deployment

- Host: Vercel, auto-deploys on push to `main`
- Domain: manyari.dev
- Repo: github.com/9000fm/manyari.dev
