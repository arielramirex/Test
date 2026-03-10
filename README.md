# Nook Companion (Static GitHub Pages App)

Nook Companion is a static Next.js + TailwindCSS Animal Crossing-inspired companion guide.

## Static-Only Architecture
- Static export only (`output: "export"`)
- No backend
- No database
- No API routes
- No server actions
- All data is local TypeScript data in `src/data`

## Tech Stack
- Next.js (App Router)
- TypeScript
- TailwindCSS
- Local image assets in `public/images`

## Local Development
```bash
npm install
npm run dev
```

## Production Build
```bash
npm run build
```

With `output: "export"`, `npm run build` generates the static site in `out/`.

## GitHub Pages Notes
This repo is configured for a GitHub Pages repo named `Test`:
- `basePath`: `/Test` in production
- `assetPrefix`: `/Test/` in production
- images are `unoptimized` for static export

`next.config.js` uses:
- dev: no base path
- production: `/Test` base path and asset prefix

## Deployment Workflow
Workflow file: `.github/workflows/deploy.yml`

On push to `main`, GitHub Actions:
1. Uses Node 20
2. Installs dependencies (`npm ci` when lockfile exists, otherwise `npm install`)
3. Runs `npm run build`
4. Uploads `out/`
5. Deploys to GitHub Pages using official Pages actions

## Project Structure
```text
src/
  app/
    art/page.tsx
    critters/page.tsx
    flowers/page.tsx
    items/page.tsx
    seasonal/page.tsx
    villagers/page.tsx
    globals.css
    layout.tsx
    page.tsx
  data/
    art.ts
    critters.ts
    flowers.ts
    items.ts
    seasonal.ts
    types.ts
    villagers.ts
components/
  layout/
  ui/
  features/
public/images/
  home/
  flowers/
  critters/
  art/
  items/
  villagers/
```

## UI + Theming
- Cozy pastel day palette and nighttime island dark mode
- Class-based dark mode
- Theme preference persisted in `localStorage` (`nook-theme`)
- Reusable UI primitives (`SectionHero`, `PreviewCard`, `IslandCard`, `LeafBadge`, `SpeechBubbleCard`, `ThemedButton`, `ThemeToggle`, `FilterBar`, `EmptyState`, `ImageWithFallback`)

## Data Coverage
- Flowers (hybrid recipes)
- Critters (fish, bugs, sea creatures)
- Redd art (real vs fake comparisons)
- High value items
- Villagers
- Seasonal monthly dashboard
