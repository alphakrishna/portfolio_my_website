# Portfolio Website — Task Breakdown

> Companion to `PLANNING.md`. Every task is the **smallest verifiable unit**.
> Each has a **Done when** check so completion is unambiguous.
> Mark `[x]` when the *Done when* condition is objectively met.
>
> Stack: **Vite + vanilla JS + three.js + GSAP + Lenis** ·
> Sections: **Hero → About → Skills → Projects → Reviews → Contact → Footer** ·
> Theme: **dark base + violet→cyan accent, snappy motion**

---

## PHASE 1 — Structure & Design

### 1.1 Project scaffolding
- [ ] **1.1.1** Initialize Vite vanilla project in repo root.
      _Done when:_ `npm run dev` starts a dev server and the default page loads at `localhost`.
- [ ] **1.1.2** Set up folder structure: `/src`, `/src/styles`, `/src/js`, `/src/assets`, `/public`.
      _Done when:_ folders exist and Vite resolves imports from them.
- [ ] **1.1.3** Add `.gitignore` (node_modules, dist, .env) and `git init`.
      _Done when:_ `git status` shows node_modules/dist ignored.
- [ ] **1.1.4** Install deps: `three`, `gsap`, `lenis`.
      _Done when:_ all three appear in `package.json` dependencies and import without error.
- [ ] **1.1.5** Create `index.html` skeleton with `<head>` meta (charset, viewport, title, description) and empty section anchors for all 7 sections.
      _Done when:_ page has 7 empty `<section id>` blocks + nav; validates with no console errors.

### 1.2 Design tokens (CSS custom properties)
- [ ] **1.2.1** Define color tokens in `:root`: `--bg`, `--bg-elevated`, `--text`, `--text-muted`, `--accent-1` (violet), `--accent-2` (cyan), `--accent-gradient`.
      _Done when:_ tokens exist and body background renders the dark base color.
- [ ] **1.2.2** Define typography tokens: font families (display + body), a modular type scale (`--fs-100`…`--fs-900`), line-heights, weights.
      _Done when:_ headings/body pull sizes from tokens only (no hard-coded px in components).
- [ ] **1.2.3** Define spacing scale tokens (`--space-1`…`--space-12`) and radius/shadow tokens.
      _Done when:_ a test element spaced with tokens renders correctly.
- [ ] **1.2.4** Define motion tokens: durations (`--dur-fast/base/slow`) and easings (`--ease-out`, `--ease-in-out`).
      _Done when:_ a test transition uses a token and animates.
- [ ] **1.2.5** Add CSS reset/normalize + base element styles (box-sizing, body, links, headings).
      _Done when:_ default margins removed; consistent baseline across elements.
- [ ] **1.2.6** Load chosen fonts (self-hosted or Google Fonts, `font-display: swap`).
      _Done when:_ display + body fonts render; no invisible-text flash.

### 1.3 Global layout & navigation
- [ ] **1.3.1** Build responsive container/grid utility (max-width, gutters).
      _Done when:_ content centers with consistent margins at 320px, 768px, 1440px widths.
- [ ] **1.3.2** Build sticky top nav: logo/name left, section links right, CTA button.
      _Done when:_ nav stays on scroll, links anchor-scroll to sections.
- [ ] **1.3.3** Build mobile nav (hamburger → menu) for < 768px.
      _Done when:_ hamburger toggles a menu; links work; closes on selection.
- [ ] **1.3.4** Integrate Lenis smooth scroll globally.
      _Done when:_ scrolling is smooth; anchor links glide to sections.
- [ ] **1.3.5** Add scroll-progress or active-link indicator in nav.
      _Done when:_ current section's nav link visibly highlights while scrolling.

### 1.4 Hero section (static structure — animation is Phase 2)
- [ ] **1.4.1** Build hero layout: name (H1), one-line tagline, primary CTA, secondary link, scroll cue.
      _Done when:_ hero fills viewport height; text is readable and centered/positioned per design.
- [ ] **1.4.2** Add empty `<canvas>`/container reserved for the three.js hero (Phase 2 mounts here).
      _Done when:_ container exists, sized to hero, with a static gradient fallback visible.
- [ ] **1.4.3** Style CTA buttons (primary gradient, secondary outline) with hover states.
      _Done when:_ buttons show accent gradient; hover animates per motion tokens.

### 1.5 About section
- [ ] **1.5.1** Build About layout: heading, 2–3 sentence value statement, optional photo slot.
      _Done when:_ section renders with placeholder copy + image placeholder, responsive.
- [ ] **1.5.2** Add focus-area tags/highlights (what you do).
      _Done when:_ tag chips render from a list and wrap responsively.

### 1.6 Skills section
- [ ] **1.6.1** Build skills data structure (array grouped by category: Languages / Frameworks / Tools).
      _Done when:_ a JS array/JSON holds categorized skills, rendered into the DOM.
- [ ] **1.6.2** Build skills grid UI (grouped chips/logos, NOT percentage bars).
      _Done when:_ skills render grouped; layout responsive; no % bars.
- [ ] **1.6.3** Add hover/entrance micro-interaction on skill items.
      _Done when:_ items animate on hover and on scroll-into-view.

### 1.7 Projects section (structure only — ball animation is Phase 4)
- [ ] **1.7.1** Build project data structure (array: title, blurb, tech[], image, liveUrl, codeUrl).
      _Done when:_ a JS array holds N placeholder projects, rendered dynamically.
- [ ] **1.7.2** Build a reusable project card component (image, title, blurb, tech tags, links).
      _Done when:_ one card renders fully from a data object.
- [ ] **1.7.3** Build alternating (zigzag) layout: cards alternate left/right on desktop.
      _Done when:_ desktop shows alternating sides; mobile stacks single-column.
- [ ] **1.7.4** Add a featured-project block (larger, first) distinct from the grid.
      _Done when:_ first project renders larger; rest in standard layout.
- [ ] **1.7.5** Add scroll-reveal animation per card (fade/slide from its side).
      _Done when:_ cards animate in on scroll; honor `prefers-reduced-motion`.
- [ ] **1.7.6** Reserve a container/SVG layer for the Phase-4 track+ball (empty for now).
      _Done when:_ an overlay layer exists spanning the projects section, not yet animated.

### 1.8 Reviews / Recommendations section
- [ ] **1.8.1** Build review data structure (quote, name, role/company, avatar/logo).
      _Done when:_ array of placeholder reviews renders into cards.
- [ ] **1.8.2** Build review card + layout (carousel OR grid OR marquee — pick one).
      _Done when:_ reviews display in chosen format; responsive.
- [ ] **1.8.3** Add entrance/scroll animation for reviews.
      _Done when:_ reviews animate into view smoothly.

### 1.9 Contact / CTA section
- [ ] **1.9.1** Build contact layout: headline, short line, primary contact method.
      _Done when:_ section renders with clear CTA and value line.
- [ ] **1.9.2** Add click-to-copy email OR a contact form (decide).
      _Done when:_ email copies to clipboard with feedback, OR form validates required fields.
- [ ] **1.9.3** Add social/link buttons (GitHub, LinkedIn, etc.) + resume download button.
      _Done when:_ all links open correctly; resume button downloads a file (placeholder ok).

### 1.10 Footer
- [ ] **1.10.1** Build footer: repeated key links, socials, back-to-top, copyright.
      _Done when:_ footer renders; back-to-top scrolls to hero; year is correct.

### 1.11 Responsive & QA pass (Phase 1 gate)
- [ ] **1.11.1** Verify all sections at 320 / 375 / 768 / 1024 / 1440 px.
      _Done when:_ no overflow, overlap, or unreadable text at any breakpoint.
- [ ] **1.11.2** Verify keyboard nav + focus states + basic a11y (alt text, landmarks, contrast).
      _Done when:_ all interactive elements reachable by keyboard; contrast passes AA on text.
- [ ] **1.11.3** Console + Lighthouse check (no errors; performance/a11y baseline recorded).
      _Done when:_ zero console errors; Lighthouse scores noted in PLANNING.md.

---

## PHASE 2 — Hero Particle Animation (three.js)

- [ ] **2.1** Mount a three.js `WebGLRenderer` + scene + camera into the hero canvas container.
      _Done when:_ a test cube/point renders in the hero without blocking page paint.
- [ ] **2.2** Generate the particle point cloud (`THREE.Points`) — concept: abstract field/sphere (or chosen shape).
      _Done when:_ particles render as the hero backdrop.
- [ ] **2.3** Add custom shader/material for particle look (color = accent gradient, soft glow, size).
      _Done when:_ particles show the violet→cyan palette with a glow.
- [ ] **2.4** Add ambient motion (slow rotation/drift) via `requestAnimationFrame`.
      _Done when:_ field animates smoothly at 60fps on desktop.
- [ ] **2.5** Add cursor force-field interactivity (particles react to pointer).
      _Done when:_ moving the mouse visibly displaces/attracts nearby particles.
- [ ] **2.6** Lazy-init: initialize AFTER first content paint; don't block LCP.
      _Done when:_ hero text paints first; canvas mounts after (verify in perf trace).
- [ ] **2.7** Pause render loop when hero is off-screen (IntersectionObserver).
      _Done when:_ scrolling away stops the RAF loop (verify via profiler/log).
- [ ] **2.8** Mobile-lite variant: reduced particle count or static fallback.
      _Done when:_ mobile uses fewer particles or a static image; no jank on a real phone.
- [ ] **2.9** Honor `prefers-reduced-motion`: static hero, no animation loop.
      _Done when:_ with reduced-motion on, no particle motion runs.
- [ ] **2.10** Handle resize + cleanup (dispose geometry/material on unmount).
      _Done when:_ resizing keeps aspect correct; no memory leaks/warnings.

---

## PHASE 3 — Real Content

- [ ] **3.1** Replace hero name + tagline with real copy.
      _Done when:_ hero shows your real name + finalized tagline.
- [ ] **3.2** Fill About with real bio + focus areas + photo.
      _Done when:_ About reflects real content, image optimized.
- [ ] **3.3** Fill Skills from real skill set (from resume).
      _Done when:_ skills list matches your actual stack.
- [ ] **3.4** Add real projects (from resume + deliverables): copy, images, tech, live/code links.
      _Done when:_ every project card has real data and working links.
- [ ] **3.5** Add real client reviews.
      _Done when:_ reviews are genuine quotes with attribution.
- [ ] **3.6** Add real contact details + socials + final resume PDF.
      _Done when:_ contact + resume download use real files/links.
- [ ] **3.7** Optimize all images (compress, correct dimensions, lazy-load, width/height set).
      _Done when:_ no oversized images; CLS stable; lazy-loading works.

---

## PHASE 4 — Projects Rolling-Ball Track Animation

- [ ] **4.1** Draw the SVG track path spanning all project cards (desktop winding route).
      _Done when:_ an SVG path visibly connects/passes all project positions.
- [ ] **4.2** Create the ball element (styled, glowing; meaning/concept applied — TBD).
      _Done when:_ ball renders on the track at the start point.
- [ ] **4.3** Bind ball position to the cursor along the path (GSAP MotionPathPlugin).
      _Done when:_ moving the cursor moves the ball along the track path.
- [ ] **4.4** Add ball rotation synced to travel (real "rolling" look) + shadow.
      _Done when:_ ball visibly rotates proportional to distance traveled.
- [ ] **4.5** Optional: path draw-in / trail effect (DrawSVG) as ball passes.
      _Done when:_ track reveals/trails behind the ball.
- [ ] **4.6** Trigger per-project engagement animation as ball reaches each stop.
      _Done when:_ each project's effect fires when the ball is nearest it.
- [ ] **4.7** Mobile: straighten path (vertical/center), single-column, ball still travels.
      _Done when:_ mobile shows a simplified track that works without cramping.
- [ ] **4.8** Honor `prefers-reduced-motion`: static track, normal reveals, no ball chase.
      _Done when:_ reduced-motion disables the ball follow behavior.
- [ ] **4.9** Performance check for the track section.
      _Done when:_ scrolling/cursor stays smooth (no dropped frames) on desktop + mid phone.

---

## PHASE 5 — Polish & Deploy

- [ ] **5.1** Add section-transition + scroll-reveal polish (GSAP ScrollTrigger) site-wide.
      _Done when:_ every section enters with intentional, snappy motion.
- [ ] **5.2** Add hover/micro-interactions on all interactive elements.
      _Done when:_ buttons, cards, links, nav all have tactile feedback.
- [ ] **5.3** SEO pass: title, meta description, Open Graph tags, favicon.
      _Done when:_ social preview renders correctly; favicon shows.
- [ ] **5.4** Full cross-browser test (Chrome, Firefox, Safari/WebKit, Edge).
      _Done when:_ layout + animations work in all four.
- [ ] **5.5** Final Lighthouse: Performance / A11y / Best Practices / SEO all ≥ 90 (target).
      _Done when:_ scores recorded and meet target (or gaps documented).
- [ ] **5.6** Production build (`npm run build`) verified locally (`npm run preview`).
      _Done when:_ built site runs with no errors and matches dev.
- [ ] **5.7** Deploy to Netlify/Vercel.
      _Done when:_ live URL loads the site publicly.
- [ ] **5.8** Post-deploy smoke test on the live URL (mobile + desktop).
      _Done when:_ all sections/links/animations work on the deployed site.

---

## Notes
- Do NOT start Phase 2 until Phase 1 gate (1.11) passes.
- Content (resume + project deliverables) unblocks Phase 3 — request from user when Phase 1 nears done.
- Any new decisions get logged in `PLANNING.md` § 9.
