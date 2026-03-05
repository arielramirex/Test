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
- `basePath` and `assetPrefix` for GitHub Pages static hosting
- Repository-name auto-detection in GitHub Actions (example: repo `Test` -> base path `/Test`)
- Fallback base path `/nook-companion` outside GitHub Actions

This ensures `npm run build` exports a static site to `out/`.

## Folder Structure
```text
.
|- .github/workflows/deploy.yml
|- app/
|  |- globals.css
|  |- layout.tsx
|  `- page.tsx
|- components/
|  |- Card.tsx
|  `- DarkModeToggle.tsx
|- data/
|  |- art.json
|  |- critters.json
|  |- flowers.json
|  `- villagers.json
|- lib/types.ts
|- next.config.js
|- package.json
`- README.md
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
1. Create a GitHub repository (for example: `nook-companion`).
2. In this project folder, run:
```bash
git init
git add .
git commit -m "Initial Nook Companion static app"
git branch -M main
git remote add origin https://github.com/<your-username>/<repo-name>.git
git push -u origin main
```

## Enable GitHub Pages
1. Open the repo on GitHub.
2. Go to `Settings` -> `Pages`.
3. Under `Build and deployment`, set `Source` to `GitHub Actions`.

## Automatic Deployment
Workflow file:
- `.github/workflows/deploy.yml`

On every push to `main`, it will:
1. Install dependencies (`npm install`)
2. Build and export static site (`npm run build`)
3. Upload `out/` as Pages artifact
4. Deploy to GitHub Pages

Site URL pattern:
- `https://<your-username>.github.io/<repo-name>/`

Example for repo `Test`:
- `https://arielramirezx.github.io/Test/`

## Notes
- No server code, API routes, Prisma, or database.
- All filtering, searching, and calculations run client-side.
- Data sources are local JSON files in `data/`.