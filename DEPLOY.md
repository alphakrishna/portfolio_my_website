# Going Live

Your site builds to a **static `dist/` folder** (plain HTML/CSS/JS). Any static host can serve it —
no Node server runs in production. Pick one of the options below.

The build command and output are always the same:

- **Build command:** `npm run build`
- **Publish / output directory:** `dist`

---

## Option A — Vercel (recommended, easiest)

1. Push this project to a GitHub repo (see [First-time Git setup](#first-time-git-setup) below).
2. Go to **[vercel.com](https://vercel.com)** → sign in with GitHub → **Add New… → Project**.
3. Import your repo. Vercel auto-detects Vite:
   - Build command: `npm run build`
   - Output directory: `dist`
4. Click **Deploy**. You get a live `*.vercel.app` URL in ~30 seconds.

Every future `git push` auto-deploys. To use your own domain: **Project → Settings → Domains**.

### Or without GitHub (Vercel CLI)

```bash
npm i -g vercel
vercel            # follow prompts; deploys a preview
vercel --prod     # promote to production
```

---

## Option B — Netlify

**Via GitHub (auto-deploys on push):**

1. Push to GitHub.
2. **[netlify.com](https://netlify.com)** → **Add new site → Import an existing project** → pick the repo.
3. Set:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. **Deploy site.** You get a `*.netlify.app` URL.

**Or drag-and-drop (no Git):** run `npm run build`, then drag the `dist` folder onto
**[app.netlify.com/drop](https://app.netlify.com/drop)**. Instant live URL.

---

## Option C — GitHub Pages (free, uses your GitHub account)

GitHub Pages serves from a subpath (`https://<user>.github.io/<repo>/`), so set Vite's `base`
first, otherwise CSS/JS 404.

1. In `vite.config.js`, add `base` matching your repo name:
   ```js
   export default defineConfig({
     base: "/Potfolio_website/",   // <-- your repo name, with slashes
     server: { host: true },
     build: { target: "es2019" },
   });
   ```
2. Build and publish the `dist` folder. Easiest is the `gh-pages` package:
   ```bash
   npm i -D gh-pages
   ```
   Add to `package.json` scripts:
   ```json
   "deploy": "npm run build && gh-pages -d dist"
   ```
   Then:
   ```bash
   npm run deploy
   ```
3. On GitHub: **Repo → Settings → Pages → Source: `gh-pages` branch**. Your site appears at
   `https://<your-username>.github.io/Potfolio_website/`.

> If you later add a custom domain, remove the `base` line (set it back to `/`).

---

## First-time Git setup

If this folder isn't a Git repo yet:

```bash
git init
git add .
git commit -m "Portfolio site"
git branch -M main
git remote add origin https://github.com/<your-username>/<repo>.git
git push -u origin main
```

`node_modules/` and `dist/` are already in `.gitignore`, so only source is pushed — the host
rebuilds `dist/` for you.

---

## Quick comparison

| Host | Best for | Custom domain | Auto-deploy on push |
|---|---|---|---|
| **Vercel** | Fastest setup, best DX | ✅ free | ✅ |
| **Netlify** | Drag-and-drop, or Git | ✅ free | ✅ (Git) |
| **GitHub Pages** | 100% free, already on GitHub | ✅ free | ✅ (with action/`gh-pages`) |

**Recommendation:** start with **Vercel** — connect GitHub once and you're live, with every push
auto-deploying.
