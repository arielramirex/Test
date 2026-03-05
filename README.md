# Nook Companion

Nook Companion is a fully static Next.js (App Router + TypeScript) project designed for deployment on GitHub Pages only.

## Tech Stack
- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Local JSON datasets (no backend)

## Static Deployment Configuration
`next.config.js` includes:
- `output: 'export'`
- `basePath: '/nook-companion'`
- `assetPrefix: '/nook-companion/'`

This ensures `npm run build` outputs a static site in `out/` for GitHub Pages.

## Folder Structure
```text
.
+- .github/workflows/deploy.yml
+- app/
¦  +- globals.css
¦  +- layout.tsx
¦  +- page.tsx
+- components/
¦  +- Card.tsx
¦  +- DarkModeToggle.tsx
+- data/
¦  +- art.json
¦  +- critters.json
¦  +- flowers.json
¦  +- villagers.json
+- lib/types.ts
+- next.config.js
+- package.json
+- README.md
```

## Local Development
```bash
npm install
npm run dev
```

Production static build:
```bash
npm run build
```

## Create and Push GitHub Repository
1. Create a new GitHub repository named `nook-companion`.
2. In this project folder, run:
```bash
git init
git add .
git commit -m "Initial Nook Companion static app"
git branch -M main
git remote add origin https://github.com/<your-username>/nook-companion.git
git push -u origin main
```

## Enable GitHub Pages
1. Open your repo on GitHub.
2. Go to `Settings` -> `Pages`.
3. Under `Build and deployment`, set `Source` to `GitHub Actions`.

## Automatic Deployment (GitHub Actions)
The workflow file is at:
- `.github/workflows/deploy.yml`

On every push to `main`, it will:
1. Install dependencies (`npm ci`)
2. Build + export static site (`npm run build`)
3. Upload `out/` as Pages artifact
4. Deploy to GitHub Pages

## Notes
- No server code, API routes, Prisma, or database.
- All filtering, searching, and calculations run client-side.
- Data sources are local JSON files under `data/`.