# Krishna Singh — Portfolio

Personal portfolio website. Built with **Vite** + vanilla JS, **GSAP** (+ ScrollTrigger) for motion, and **Lenis** for smooth scrolling.

## Prerequisites

- [Node.js](https://nodejs.org/) **18 or newer** (includes `npm`)

Check your version:

```bash
node -v
```

## Getting started

From the project root (`Portfolio/`):

### 1. Install dependencies

```bash
npm install
```

Run this once, or whenever `package.json` changes.

### 2. Start the dev server

```bash
npm run dev
```

Then open the URL it prints — by default **http://localhost:5173/**.
The page hot-reloads as you edit files.

## Building for production

Create an optimized build in the `dist/` folder:

```bash
npm run build
```

Preview that production build locally:

```bash
npm run preview
```

This serves `dist/` at **http://localhost:4173/**.

## Available scripts

| Command           | What it does                                  |
| ----------------- | --------------------------------------------- |
| `npm run dev`     | Start the Vite dev server (hot reload)        |
| `npm run build`   | Build the production site into `dist/`        |
| `npm run preview` | Serve the built `dist/` for a final check     |

## Project structure

```
Portfolio/
├─ index.html            # Page markup (all sections)
├─ public/               # Static assets served as-is (hero.jpg, résumé PDF)
├─ src/
│  ├─ js/
│  │  ├─ main.js         # Boot: rendering, nav, scroll, animations
│  │  └─ data/           # Content: skills.js, projects.js, reviews.js
│  └─ styles/            # main.css, tokens.css, base.css
└─ package.json
```

To edit content (projects, skills, reviews), change the files in `src/js/data/` — the page re-renders automatically while `npm run dev` is running.
