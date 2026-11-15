# BSM Enterprise | Company site (React + Vite)

Separate from the personal job portfolio. Deploys from its own GitHub repo.

## Deploy (recommended: automatic)
1. Create a NEW GitHub repo (for example `bsm-enterprise`), push this folder to the `main` branch.
2. Settings > Pages > Source = "GitHub Actions". Every push to `main` now builds and publishes.
3. Live at https://manjureddy97.github.io/bsm-enterprise/ . Add a custom domain later only on a NEW address (not bsmenterprise.in, which hosts the main company site).

## Local
npm install, npm run dev. Alternative deploy without Actions: npm run deploy (publishes the gh-pages branch).

## Edit content
`src/data.js` (brand, contact, services, FAQ) and `src/projects.js` (work). Images: `public/projects`.
