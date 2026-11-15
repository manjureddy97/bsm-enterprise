# BSM Enterprise | Company site (React + Vite)

Separate from the personal job portfolio. Deploys from its own GitHub repo.

## Deploy (recommended: automatic)
1. Create a NEW GitHub repo (for example `bsm-enterprise`), push this folder to the `main` branch.
2. Settings > Pages > Source = "GitHub Actions". Every push to `main` now builds and publishes.
3. Settings > Pages > Custom domain = `bsmenterprise.in`, then tick Enforce HTTPS once available.
4. DNS at your registrar: four A records for `@` (185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153) and a CNAME `www` to `<your-username>.github.io`.

## Local
npm install, npm run dev. Alternative deploy without Actions: npm run deploy (publishes the gh-pages branch).

## Edit content
`src/data.js` (brand, contact, services, FAQ) and `src/projects.js` (work). Images: `public/projects`.
