# Nook Companion

Nook Companion is a fully static Next.js (App Router + TypeScript) companion app with an Animal Crossing-inspired cozy UI.

## Static-Only Setup
- No backend
- No API routes
- No database
- All data comes from local JSON files
- All filtering, sorting, searching, and calculators run client-side

## GitHub Pages Export Configuration
`next.config.js` is configured with:
- `output: 'export'`
- `basePath: '/Test'`
- `assetPrefix: '/Test/'`

## Features
1. Redd-inspired Art Guide (`/art`)
2. Blathers/CJ-inspired Critter Price Guide (`/critters`)
3. Leif-inspired Flower Breeding Calculator (`/flowers`)
4. Isabelle-inspired Seasonal Dashboard (`/seasonal`)
5. Tom Nook-inspired High Value Items (`/items`)
6. Villager Popularity page (`/villagers`)
7. Dark mode toggle with `localStorage` persistence

## UI Components
- `LeafBadge`
- `SpeechBubbleCard`
- `IslandCard`
- `PastelButton`
- `FloatingNavigationBar`
- `ToggleSwitch`

## Folder Structure
```text
.
|- .github/workflows/deploy.yml
|- app/
|  |- art/page.tsx
|  |- critters/page.tsx
|  |- flowers/page.tsx
|  |- items/page.tsx
|  |- seasonal/page.tsx
|  |- villagers/page.tsx
|  |- globals.css
|  |- layout.tsx
|  `- page.tsx
|- components/
|  |- features/ThemeControl.tsx
|  |- layout/FloatingNavigationBar.tsx
|  |- layout/IslandCard.tsx
|  `- ui/
|     |- CharacterPlaceholder.tsx
|     |- LeafBadge.tsx
|     |- PastelButton.tsx
|     |- SpeechBubbleCard.tsx
|     `- ToggleSwitch.tsx
|- data/
|  |- art.json
|  |- critters.json
|  |- flowers.json
|  |- items.json
|  `- villagers.json
|- lib/
|  |- hooks/useTheme.tsx
|  `- types.ts
|- next.config.js
|- package.json
`- tailwind.config.ts
```

## Local Development
```bash
npm install
npm run dev
```

## Production Build (Static Export)
```bash
npm run build
```
Build output is generated in `out/`.

## GitHub Repository Setup
1. Create a GitHub repository named `nook-companion`.
2. Push this project to the `main` branch.

Example commands:
```bash
git init
git add .
git commit -m "Initial Nook Companion static app"
git branch -M main
git remote add origin https://github.com/<your-username>/nook-companion.git
git push -u origin main
```

## Enable GitHub Pages
1. Open repository on GitHub.
2. Go to `Settings` -> `Pages`.
3. Set `Build and deployment` source to `GitHub Actions`.

## Automatic Deployment Workflow
Workflow file: `.github/workflows/deploy.yml`

On push to `main`, it automatically:
1. Installs dependencies
2. Runs static build/export
3. Uploads `out/` artifact
4. Deploys to GitHub Pages

After deploy, site URL:
- `https://arielramirezx.github.io/Test/`
