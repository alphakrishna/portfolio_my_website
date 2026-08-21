# Portfolio Website — Planning & Design Doc

> Living document. We discuss and decide here **before** writing code.
> Status legend: ✅ decided · 🟡 leaning · ❓ open · 💤 later

---

## 1. Goal & Purpose

A personal portfolio to **showcase projects and skills**, designed as a
**conversion funnel** — guide the visitor from "who is this?" to a clear
call-to-action (contact / hire).

**Who I am:** ✅ Software Developer.
**Primary visitor:** ✅ **potential clients** (this is a client-facing portfolio).
**Primary CTA:** hire me / get in touch. _(exact wording TBD)_

---

## 2. Tech Stack — ✅ decided

Requirement: **fast, optimized animations** + a three.js particle hero.

| Option | Fit | Notes |
|---|---|---|
| **Plain HTML/CSS/JS + three.js + GSAP** | 🟡 strong | Zero build, full control, deploys free. Great for a single rich page. |
| **Vite + vanilla JS** | 🟡 strong | Same as above but with a dev server + bundling for cleaner code splitting. **Recommended for the animation work.** |
| **Astro** | possible | Great perf/SEO; can still drop in three.js. Good if a blog/many pages come later. |
| **React (Vite)** | overkill-ish | Only if UI gets very component-heavy/interactive. |

**✅ DECIDED:** Vite + vanilla JS + **three.js** (hero 3D) + **GSAP** (scroll/section
animations) + **Lenis** (smooth scroll).

**Fallback plan:** If the three.js hero proves too heavy later, we can recreate the
same *look* with lighter **SVG/CSS/canvas** for a fraction of the cost. Not locked in.

---

## 3. Funnel Structure (section order) — ✅ locked

The page flows top-to-bottom as a funnel:

1. **Hero** — name + one-line positioning + the three.js particle animation. Hooks attention.
2. **About / Value** — who you are, what you do, the promise. Builds trust.
3. **Skills** — tech/tools, visualized (not just a list). Establishes credibility.
4. **Projects** — the core proof. Featured project(s) first, then a grid.
5. **Reviews / Recommendations** — client testimonials & recommendations. Social
   proof placed right before the CTA (visitor is warmest here → convert now).
6. **Contact / CTA** — the conversion point. Clear, low-friction.
7. **Footer** — links, socials, resume download.

**Design rationale for order:** each section answers the visitor's next question —
Who? → Can they do it? → Prove it. → Do others trust them? → How do I reach them?

_Note: Experience/Timeline dropped in favor of Reviews for stronger credibility._

---

## 4. Hero Animation — ✅ BUILT (cinematic image + content card)

**Reference:** Shopify Editions hero — re-examined from actual video frames
(`Frames/1080.mp4`). It is **NOT a particle field**. It's a full-bleed
Renaissance painting (two figures reaching toward each other — "Creation of
Adam" motif) with a **centered glass content card** holding a title, subline,
and a **Roman-numeral index** of the site's sections; on scroll the card
parallaxes/lifts away.

**What we built (matches the reference):**
- Full-bleed background: a clean frame extracted from the reference video
  (`public/hero.jpg`, 1080×638). Shopify's UI chrome removed — top bar cropped,
  and their center card feathered out with a radial gaussian blur so no Shopify
  text survives behind our own card.
- Centered **glass content card** (`backdrop-blur`, thin border + corner ticks):
  kicker → display title with a gradient accent word → subline → Roman-numeral
  section index (links) → primary/ghost CTAs.
- **Motion:** slow CSS ken-burns drift on the image; GSAP intro reveal of the
  card + children (staggered); GSAP ScrollTrigger parallax (image drifts up, card
  lifts + fades as the hero leaves). All gated on `prefers-reduced-motion`.

**Why this replaced the particle approach:**
- It's the *actual* reference effect (confirmed from the video), and
- It's **dramatically lighter** — three.js is dropped entirely. Bundle went from
  ~465 KB three.js chunk → **0**; total JS is now ~141 KB (53.5 KB gzip, GSAP +
  Lenis). The LCP is a single optimized ~59 KB JPG.

**Performance guardrails (met):**
- LCP image uses `fetchpriority="high"` + explicit width/height (no layout shift).
- No WebGL, no render loop. Reduced-motion → static card, no parallax.
- Mobile: art `object-position` biased toward a figure; card width capped.

_Swap the background any time by replacing `public/hero.jpg`. `three` can be
removed from package.json (no longer imported)._
_Open tuning: colors/framing of the image, card copy, whether to add the
Shopify-style "index pins to a sidebar on scroll" behavior later._

---

## 4b. Projects Section Animation — 🟡 spec ("rolling ball journey")

**Concept:** a winding SVG path snakes down the Projects section. A **rolling ball**
travels along it as the user scrolls (scroll-driven), rolling realistically. Projects
sit on **alternating sides** (zigzag) as "stops" along the path. As the ball reaches
each project, that project **reveals with its own animation/image** to engage the user.

**Interaction model:** ✅ **cursor-driven** — the ball rolls along the track following
the cursor. The track runs continuously **over all projects**.

**⏳ Build order:** structure/layout FIRST. The rolling-ball animation is a **later
phase** — not built at the start. Site must look good and be usable before the ball
is added.

**Ball meaning:** ✅ the ball will carry meaning (concept TBD) — decided later with the animation.

**Build (with locked stack):**
- SVG path = the winding "road," curving left↔right down the section.
- **GSAP ScrollTrigger + MotionPathPlugin** → ball follows the path by scroll progress.
- **DrawSVG** (optional) → path draws itself in / leaves a trail behind the ball.
- Ball rotation synced to travel (real "rolling" look) + soft shadow/glow.
- Each project pinned to a point on the path; reaching it fires that project's reveal.

**Per-project engagement:** each stop = image/animation + title + blurb + tech tags +
links. Vary the reveal (looping preview GIF/video, parallax image, small custom effect)
so each feels fresh.

**Performance / responsive:**
- Desktop: full winding path, alternating sides.
- **Mobile: straighten the path** (mostly vertical/center), projects stack single-column,
  ball still rolls down. Keeps the spirit without cramping.
- Honor `prefers-reduced-motion` → static path + normal reveals.

_Open: ball look/color (❓), path style straight-curves vs organic (❓), interaction model (❓)._

---

## 5. Animation & Motion Principles — 🟡

- **Fast & optimized** is the mandate. Motion should feel snappy, never laggy.
- **Smooth scroll** (Lenis) + **scroll-triggered reveals** (GSAP ScrollTrigger)
  for sections entering the funnel.
- Prefer GPU-friendly properties: `transform` / `opacity` only. Avoid layout thrash.
- Consistent easing + timing scale (define a motion token set).
- Always honor `prefers-reduced-motion`.

---

## 6. Design System — 🟡 direction set

**Design personality (from the brief):** the site is an *embodiment of me* —
**cool, chill, smart most of the time; dynamic & bold in moments; gives 100% energy.**
Translation → **calm confident dark base + one vibrant accent used sparingly for the
bold/energetic moments.** Vibrancy with a light hand — sophisticated, not loud.

- **Vibe:** ✅ dark base, mostly calm, with subtle vibrant pops (the "little vibrant theme").
- **Color palette:** 🟡 proposed
  - Base: deep charcoal / near-black (~`#0a0a0f`) — cool, smart, premium.
  - Accent: vibrant **violet → cyan** gradient, used for CTAs, hovers, hero glow,
    rolling ball. Energetic but not aggressive; glows well on dark.
  - Text: soft off-white (primary), muted grey (secondary).
  - _Confirm accent colors: ❓_
- **Motion character:** snappy & purposeful (never sluggish) = the "100% energy" trait.
- **Typography:** ❓ (strong display font for hero + clean body font — to pick)
- **Layout grid & spacing scale:** ❓ (define with tokens)
- **Dark/light mode:** likely dark-only (fits the personality); light mode optional later.
- All defined as CSS custom properties (design tokens) up front.

---

## 7. Deployment — 💤

- Free + professional: **Netlify / Vercel / GitHub Pages**.
- Custom domain later (optional).

---

## 8. Open Questions (answer these next)

1. **Tech stack:** OK to go Vite + vanilla JS + three.js + GSAP + Lenis?
2. **Design vibe & colors:** what feeling should the site give?
3. **Hero concept:** abstract sphere, your initials as a point cloud, or something else? Particle color?
4. **Content ready?** Do you have project details, skills list, bio, resume, socials?
5. **Primary CTA:** what's the #1 action you want visitors to take?

---

## 9. Decisions Log

- ✅ **Tech stack:** Vite + vanilla JS + three.js + GSAP + Lenis. SVG/CSS fallback kept in reserve.
- ✅ **Hero:** ~~three.js particle hero~~ → **cinematic image + centered content card** (the *actual* Shopify Editions effect, confirmed from the video). three.js dropped. See §4. (2026‑07‑21)
- ✅ **Sections locked:** Hero → About → Skills → Projects → Reviews/Recommendations → Contact → Footer. (Experience/Timeline dropped in favor of client Reviews for credibility.)
- ✅ **Identity:** Software Developer; audience = potential clients; CTA = hire/contact.
- ✅ **Projects animation:** cursor-driven ball on a track over all projects, ball carries meaning. **Deferred to a later build phase** — structure/layout built first.
- 📌 **Content pending from you:** resume + current project deliverables.

---

## Build Phases

- **Phase 1 — Structure & design:** scaffold project, design tokens (colors/type),
  build all sections with real layout + placeholder content. Responsive. Launchable.
- **Phase 2 — Hero animation:** ✅ done — cinematic image + content card (image sampled from the reference video; GSAP intro + scroll parallax).
- **Phase 3 — Content:** drop in resume, real projects, skills, reviews.
- **Phase 4 — Projects rolling-ball track animation:** the cursor-driven ball + track.
- **Phase 5 — Polish & deploy:** micro-animations, QA, deploy to Netlify/Vercel.
