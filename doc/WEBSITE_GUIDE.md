# Dr. Arpan Gandhi — Website Update Guide
> Paste this entire file at the start of every Claude conversation to get full context instantly.

---

## How to Use This Guide

1. Go to **claude.ai** (free version)
2. Start a new conversation
3. Paste this entire file as your first message
4. Then describe what you want to update
5. Claude will give you the exact code to copy-paste into the right file

You never need to re-explain the project. This file is your single source of truth.

---

## Project Overview

**Client:** Dr. Arpan Gandhi — Senior diagnostic medicine professional, healthcare strategist, based in India.
**Website:** `https://drarpangandhi.org`
**Type:** Static HTML/CSS/JS — no framework, no build tool, no npm.
**Hosted on:** GoDaddy (files uploaded via File Manager as a ZIP)
**Stack:** Vanilla HTML5 · Vanilla CSS (`css/style.css`) · Vanilla JS (`js/main.js`) · Google Fonts

**Tone of the website:** Happy · Confident · Credible · Intelligent. Not corporate. Warm, authoritative, human.

---

## Complete File Structure

```
/
├── index.html                  ← Landing page (homepage)
├── profile.html                ← About / Professional profile
├── consulting.html             ← Consulting services
├── laboratory-consulting.html  ← Laboratory operations consulting
├── journey.html                ← Career story with timeline
├── academic.html               ← Mentorship, research & contact form
├── mentorship-training.html    ← Mentorship & training page
├── 404.html                    ← Custom 404 error page
│
├── blog/
│   ├── index.html                            ← Blog listing page
│   ├── labs-need-leaders.html                ← Technical blog post
│   ├── career-pathways-laboratory-medicine.html
│   ├── diagnostic-networks-india.html
│   ├── diagnostic-startups-fail.html
│   ├── technology-healthcare-transformation.html
│   ├── turnaround-time-laboratory.html
│   ├── great-healthcare-begins-before-treatment.html
│   ├── whats-new-nexora-journey-2026.html    ← What's New post
│   ├── whats-new-nexora-lab-2026.html
│   ├── whats-new-ai-conclave-2026.html
│   ├── whats-new-doctors-day-2026.html
│   └── whats-new-july-2026.html
│
├── css/
│   └── style.css               ← Single global stylesheet (ALL styles here)
│
├── js/
│   └── main.js                 ← Single global JS file
│
├── images/                     ← All images (WebP preferred)
│   ├── hero-photo.webp
│   ├── logo.svg
│   ├── profile-white-coat.webp
│   ├── logo-apexcura.svg
│   ├── logo-steerx.webp
│   ├── setv-logo-2rhKXJWP.webp
│   ├── linkedin-quality-award.webp
│   ├── linkedin-joy-of-teacher.webp
│   ├── linkedin-kaizen-program.webp
│   ├── blog-technology-healthcare.webp
│   ├── blog-diagnostic-startups.webp
│   ├── diagnostic-networks-header.webp
│   ├── career-pathways-header.webp
│   ├── labs-need-leaders-header.webp
│   ├── doctors-day-2026.webp
│   ├── 20th_whatsNew.webp
│   ├── 5th_blog.webp
│   ├── 6th_blog.webp
│   ├── ai-conclave-2026-bengaluru.webp
│   ├── ai-conclave-2026-panel.webp
│   └── ai-conclave-2026-day2.webp
│
├── robots.txt
├── sitemap.xml
└── .htaccess
```

---

## Landing Page (index.html) — Section Map

| Section | ID / Class | What it contains |
|---|---|---|
| Nav | `.site-nav` | Logo + links + mobile menu |
| Hero | `.hero` | Animated tagline words + photo |
| Ticker | `.ticker` | Scrolling achievements strip |
| Services | `.services` | 6 service cards |
| Journey Teaser | `.journey-teaser` | Stats + photo + CTA |
| LinkedIn Strip | `#linkedin` | 3 LinkedIn post cards |
| Blog Preview | `#blog-preview` | Carousel of blog posts |
| Advisory | `#advisory` | Text + 3 advisor logos |
| How Can I Help | `#help` | 4 help cards |
| Contact | `#contact` | Form + direct contact info |
| Footer | `.site-footer` | Copyright + social links |

---

## Design Rules — NEVER Break These

### Colours (always use CSS variables, never hardcode)
```css
--accent: #40916c          /* Healing Green — buttons, links, highlights */
--accent-light: #74c69d    /* Lighter green */
--accent-teal: #1b8882     /* Ticker dots only */
--slate-900: #0f172a       /* Main headings */
--slate-600: #475569        /* Body text */
--slate-400: #94a3b8        /* Secondary/meta text */
```

### Fonts (always use CSS variables)
```css
--font-heading: 'Playfair Display', Georgia, serif   /* All h1, h2, h3 */
--font-body:    'Open Sans', Arial, sans-serif        /* All body text */
--font-nav:     'DM Sans', sans-serif                 /* Nav, labels, tags */
```

### Paths — always absolute from root
```html
<!-- Inner pages use ../ prefix -->
<link rel="stylesheet" href="../css/style.css" />
<img src="../images/hero-photo.webp" />
<script src="../js/main.js" defer></script>

<!-- Root index.html uses no prefix -->
<link rel="stylesheet" href="css/style.css" />
<img src="images/hero-photo.webp" />
```

### Images
- Always use **WebP** format (not JPG or PNG)
- Always include `alt` text on every `<img>`
- Above-fold: `loading="eager"` | Below-fold: `loading="lazy"`
- Never hardcode width/height unless needed for layout

### No comments in code unless the reason is non-obvious.

---

## Content & Language Rules

- **Tone:** Senior, authoritative, measured. Reads like someone with 30 years of experience.
- **Not casual.** No "Hey!", no "Awesome!", no "Let's dive in".
- **Not corporate.** No buzzword soup.
- **First person** — "I have", "I believe", "In my experience"
- **British/Indian English** — "organisation" not "organization", "behaviour" not "behavior"
- **Bold for key phrases** — use `<strong>` sparingly, only on the most important idea per paragraph
- **Short paragraphs** — 3–4 lines max per paragraph on the website

---

## Standard Head Block (copy for every new page)

```html
<head>
  <meta charset="UTF-8" />
  <!-- Google tag (gtag.js) -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-547EHQP5YB"></script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-547EHQP5YB');
  </script>

  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="description" content="PAGE DESCRIPTION HERE" />
  <meta property="og:title" content="PAGE TITLE HERE — Dr. Arpan Gandhi" />
  <meta property="og:description" content="PAGE DESCRIPTION HERE" />
  <meta property="og:type" content="article" />
  <meta property="og:image" content="../images/YOUR-IMAGE.webp" />
  <title>PAGE TITLE HERE — Dr. Arpan Gandhi</title>
  <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' rx='15' fill='white'/><text y='.9em' font-size='85'>🩺</text></svg>" />
  <link rel="dns-prefetch" href="https://www.googletagmanager.com" />
  <link rel="dns-prefetch" href="https://www.google-analytics.com" />
  <link rel="preconnect" href="https://www.google.co.in" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Open+Sans:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" media="print" onload="this.media='all'" />
  <noscript><link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Open+Sans:wght@300;400;500;600;700&family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet" /></noscript>
  <link rel="preload" href="../css/style.css" as="style" />
  <link rel="stylesheet" href="../css/style.css" />
</head>
```
> For root-level pages (index.html), remove `../` from CSS paths.

---

## Standard Nav Block (copy for every new page)

```html
<nav class="site-nav">
  <div class="container nav-inner">
    <a href="../" class="nav-logo">
      <img src="../images/logo.svg" alt="Dr. Arpan Gandhi" />
    </a>
    <ul class="nav-links">
      <li><a href="../" data-nav-link>HOME</a></li>
      <li><a href="../profile.html" data-nav-link>ABOUT</a></li>
      <li><a href="../consulting.html" data-nav-link>CONSULTING</a></li>
      <li><a href="../journey.html" data-nav-link>JOURNEY</a></li>
      <li><a href="../academic.html" data-nav-link>ACADEMIC</a></li>
      <li><a href="../blog/" data-nav-link>BLOG</a></li>
      <li><a href="../index.html#contact" data-nav-link>CONTACT</a></li>
    </ul>
    <button id="menu-toggle" class="menu-toggle" aria-label="Toggle navigation menu">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 9h16.5m-16.5 6.75h16.5" /></svg>
    </button>
  </div>
  <div id="mobile-menu" class="mobile-menu">
    <ul>
      <li><a href="../">HOME</a></li>
      <li><a href="../profile.html">ABOUT</a></li>
      <li><a href="../consulting.html">CONSULTING</a></li>
      <li><a href="../journey.html">JOURNEY</a></li>
      <li><a href="../academic.html">ACADEMIC</a></li>
      <li><a href="../blog/">BLOG</a></li>
      <li><a href="../index.html#contact">CONTACT</a></li>
    </ul>
  </div>
</nav>
```
> For blog posts add `class="active"` to the BLOG link.
> For root index.html remove `../` from all paths.

---

## Standard Footer Block (copy for every new page)

```html
<footer class="site-footer">
  <div class="container footer-inner">
    <p class="footer-copy">&copy; 2026 Dr. Arpan Gandhi</p>
    <div class="footer-links">
      <a href="https://www.linkedin.com/in/arpan-gandhi-13074b6/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
      <a href="https://www.instagram.com/drarpanhealthcare?igsh=MTBqanZ6ZDk2anlhNw==" target="_blank" rel="noopener noreferrer">Instagram</a>
      <a href="https://pathoindia.com/" target="_blank" rel="noopener noreferrer">PathoIndia</a>
    </div>
  </div>
</footer>

<div class="dev-credit">
  <a href="https://mail.google.com/mail/?view=cm&fs=1&to=krishna191217@gmail.com&su=Web%20Development%20Enquiry&body=Hi%20Krishna%2C%0A%0AYou%20noticed%20the%20quality%20%E2%80%94%20and%20that%20says%20a%20lot%20about%20you.%0A%0A%2F%2F%20So%20tell%20me%20%E2%80%94%20what%27s%20in%20your%20mind%3F" target="_blank" rel="noopener noreferrer">Designed &amp; built by <strong>Krishna Singh</strong> &middot; Get in touch &rarr;</a>
</div>

<button id="back-to-top" class="back-to-top" aria-label="Back to top">
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" /></svg>
</button>

<a href="../index.html" class="back-home" aria-label="Back to homepage">
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" /></svg>
</a>

<script src="../js/main.js" defer></script>
```

---

## Task: Add a New Blog Post (What's New)

**Step 1 — Create the file**
Duplicate `blog/whats-new-ai-conclave-2026.html` and rename it, e.g. `blog/whats-new-august-2026.html`.

**Step 2 — Update the head**
Change `<title>`, `<meta name="description">`, and `<meta property="og:*">`.

**Step 3 — Update the article body**
Inside `<div class="blog-content">`:
- Change `<p class="post-date">` to the new date
- Change `<h1>` to the new title
- Write the content using `<p>` tags
- Images: use `.whats-new-photo` class for right-float, `.blog-inline-image` for left-float
- For photo + text side by side use `.blog-photo-block` (see below)

**Step 4 — Add a card to `blog/index.html`**
Open `blog/index.html`. Find `id="carousel-new"`. Inside the `.blog-carousel-track` div inside it, add at the TOP:
```html
<a href="whats-new-august-2026.html" class="blog-card blog-card-text">
  <div class="blog-card-body">
    <span class="blog-card-tag">Event</span>
    <h3 class="blog-card-title">YOUR POST TITLE</h3>
    <p class="blog-card-excerpt">A 2–3 sentence summary of the post.</p>
    <div class="blog-card-footer">
      <span class="blog-card-date">August 1, 2026</span>
      <span class="blog-card-link">Read more →</span>
    </div>
  </div>
</a>
```
Also add a row to the title list at the bottom of `blog/index.html`.

**Step 5 — Add to `sitemap.xml`**
```xml
<url>
  <loc>https://drarpangandhi.org/blog/whats-new-august-2026.html</loc>
  <changefreq>monthly</changefreq>
  <priority>0.7</priority>
</url>
```

**Step 6 — Upload to GoDaddy**
Upload: `blog/whats-new-august-2026.html`, `blog/index.html`, `sitemap.xml`, and any new images.

---

## Task: Add a New Technical Blog Post

Same as above but:
- Duplicate `blog/technology-healthcare-transformation.html` instead
- Open `blog/index.html`, find `id="carousel-technical"`. Inside its `.blog-carousel-track`, add the image card at the TOP
- Also add a row to the numbered title list under the Technical Blog section — renumber all existing entries down by one (newest = 01)
- Add to `sitemap.xml` and upload to GoDaddy

**Blog card with image:**
```html
<a href="your-post.html" class="blog-card">
  <div class="blog-card-img-wrap">
    <img src="../images/your-image.webp" alt="Description" loading="lazy" />
  </div>
  <div class="blog-card-body">
    <span class="blog-card-tag">Leadership</span>
    <h3 class="blog-card-title">Your Post Title</h3>
    <p class="blog-card-excerpt">2–3 sentence excerpt.</p>
    <div class="blog-card-footer">
      <span class="blog-card-date">August 1, 2026</span>
      <span class="blog-card-link">Read more →</span>
    </div>
  </div>
</a>
```

---

## Task: Add Photos with Text Wrapping in Blog Posts

**Option A — Float right (photo on right, text wraps left):**
```html
<img src="../images/your-photo.webp" alt="Description" class="whats-new-photo" loading="lazy" />
```

**Option B — Float left (photo on left, text wraps right) — desktop only:**
```html
<img src="../images/your-photo.webp" alt="Description" class="blog-inline-image" loading="lazy" />
```

**Option C — Side-by-side grid (image + text, premium layout) — RECOMMENDED for portrait photos:**
```html
<!-- Image right -->
<div class="blog-photo-block">
  <div class="blog-photo-block-text">
    <h2>Section Heading</h2>
    <p>Your paragraph text here.</p>
    <p>More text here.</p>
  </div>
  <div class="blog-photo-block-img">
    <img src="../images/your-photo.webp" alt="Description" loading="lazy" />
  </div>
</div>

<!-- Image left -->
<div class="blog-photo-block photo-left">
  <div class="blog-photo-block-text">
    <h2>Section Heading</h2>
    <p>Your paragraph text here.</p>
  </div>
  <div class="blog-photo-block-img">
    <img src="../images/your-photo.webp" alt="Description" loading="lazy" />
  </div>
</div>
```
> Use Option C for portrait photos (phone camera shots). Options A/B work for landscape images.

---

## Blog Styling Reference

### Blog Post Page Structure

Every blog post uses this skeleton inside `<main>`:

```html
<article class="blog-article">
  <div class="container-narrow">
    <a href="./" class="back-link">&larr; Back to Blog</a>
    <p class="post-date">July 16, 2026</p>
    <h1>Post Title Here</h1>
    <div class="blog-content">
      <!-- all content goes here -->
    </div>
  </div>
</article>
```

| Class | What it does |
|---|---|
| `.blog-article` | Centers and pads the article, white background |
| `.container-narrow` | Constrains content to ~720px max-width, centered |
| `.back-link` | Small green back arrow link at the top |
| `.post-date` | Small grey date above the title |
| `.blog-content` | Wrapper for all body text and images; sets font, line-height, paragraph spacing |

### Typography Inside `.blog-content`

- `<p>` — body text, `Open Sans`, `var(--slate-600)`, line-height 1.8
- `<h2>` — section subheading, `Playfair Display`, `var(--slate-900)`
- `<strong>` — use sparingly, one bold phrase per paragraph max
- `<em>` — italics for medical terms or emphasis
- `<ul>` / `<li>` — bulleted list with left padding

### Image Classes Inside Blog Posts

| Class | Behaviour | Best for |
|---|---|---|
| `.whats-new-photo` | Floats right on desktop (640px+), full-width on mobile | Landscape/banner images |
| `.blog-inline-image` | Floats left on desktop, full-width on mobile | Landscape images, alternate side |
| `.blog-photo-block` | CSS Grid: text left + image right (240px wide) | **Portrait phone photos** |
| `.blog-photo-block.photo-left` | CSS Grid: image left + text right | Portrait photos, alternate side |

On mobile all image classes stack full-width above their text automatically — no extra work needed.

### Blog Card Variants (for `blog/index.html`)

**Card with image** — used in Technical Blog carousel:
```html
<a href="your-post.html" class="blog-card">
  <div class="blog-card-img-wrap">
    <img src="../images/your-image.webp" alt="Description" loading="lazy" />
  </div>
  <div class="blog-card-body">
    <span class="blog-card-tag">Leadership</span>
    <h3 class="blog-card-title">Post Title</h3>
    <p class="blog-card-excerpt">2–3 sentence excerpt.</p>
    <div class="blog-card-footer">
      <span class="blog-card-date">July 16, 2026</span>
      <span class="blog-card-link">Read more →</span>
    </div>
  </div>
</a>
```

**Text-only card** — used in What's New carousel:
```html
<a href="whats-new-post.html" class="blog-card blog-card-text">
  <div class="blog-card-body">
    <span class="blog-card-tag">Event</span>
    <h3 class="blog-card-title">Post Title</h3>
    <p class="blog-card-excerpt">2–3 sentence excerpt.</p>
    <div class="blog-card-footer">
      <span class="blog-card-date">July 11, 2026</span>
      <span class="blog-card-link">Read more →</span>
    </div>
  </div>
</a>
```

The only difference is `blog-card-text` (no image slot) vs plain `blog-card` (has image slot).

### Title List Entry (numbered list below carousels)

```html
<a href="your-post.html" class="blog-title-item">
  <span class="blog-title-num">01</span>
  <span class="blog-title-text">Post Title Here</span>
  <span class="blog-title-meta">
    <span class="blog-title-date">July 16, 2026</span>
    <svg class="blog-title-arrow" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2" stroke="currentColor" aria-hidden="true"><path stroke-linecap="round" stroke-linejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" /></svg>
  </span>
</a>
```

Numbers must be sequential — no gaps, no duplicates. Newest post = 01. When you add a post, renumber all existing entries down by one.

### Tag Colour Reference

Tags are styled automatically by their text value — use exact spelling:

| Tag text | Colour |
|---|---|
| `Leadership` | Green |
| `Strategy` | Blue |
| `Career` | Purple |
| `Milestone` | Gold |
| `Event` | Teal |
| `Update` | Grey |
| `Research` | Indigo |
| `Quality` | Orange |

---

## Task: Update the Ticker (Scrolling Achievements)

Open `index.html`. Find the `.ticker-track` div. Each item follows this pattern:
```html
<span class="ticker-item"><span class="ticker-dot">◆</span> YOUR TEXT HERE</span>
```
The ticker has the items **duplicated** (listed twice) — this keeps the animation seamless. Always update both copies.

---

## Task: Update the Advisory Section (Logos)

Open `index.html`. Find `<section id="advisory">`. The logos are inside `.advisory-logos`:
```html
<a href="https://company-url.com" target="_blank" rel="noopener noreferrer" class="advisory-logo-link">
  <img src="images/your-logo.webp" alt="Company Name" />
  <span>Label Text</span>
</a>
```
- Dark logos need `class="advisory-logo-dark"` on the `<img>` (adds dark background)
- The last logo gets a rounded square treatment automatically (it's the SETV style)

---

## Task: Update the LinkedIn Strip

Open `index.html`. Find `<section id="linkedin">`. Each card:
```html
<a href="LINKEDIN_POST_URL" target="_blank" rel="noopener noreferrer" class="linkedin-card">
  <div class="linkedin-card-photo">
    <img src="images/your-image.webp" alt="Description" loading="lazy" />
  </div>
  <div class="linkedin-card-body">
    <div>
      <span class="linkedin-card-tag">🏆 Tag Label</span>
      <p class="linkedin-excerpt">"Quote from the LinkedIn post."</p>
    </div>
    <span class="linkedin-cta">View on LinkedIn →</span>
  </div>
</a>
```
Rules: exactly 3 cards, all must be visible on desktop without scrolling.

---

## Task: Update Text on Any Page

Tell Claude:
- Which page (e.g. `consulting.html`)
- Which section (e.g. the hero paragraph, or the second service card)
- What the current text says
- What the new text should say

Claude will give you the exact replacement HTML.

---

## Task: Update Contact Information

Contact details appear in `index.html` inside `<section id="contact">`:
- Phone: `<a href="tel:+919810195021">+91 98101 95021</a>`
- Email: `<a href="mailto:arpangandhi@gmail.com">arpangandhi@gmail.com</a>`

The contact form action is currently `/contact.php`. To enable Formspree:
1. Sign up at formspree.io with Dr. Gandhi's email
2. Create a new form, copy the hash (e.g. `xabcdefg`)
3. Replace `action="/contact.php"` with `action="https://formspree.io/f/xabcdefg"` in both `index.html` and `academic.html`

---

## Task: Change the Accent Colour

Open `css/style.css`. Find the `:root` block at the very top. Change:
```css
--accent: #40916c;
--accent-light: #74c69d;
```

---

## Task: Deploy to GoDaddy (Upload Files)

1. Select all updated files on your computer
2. Create a ZIP file
3. Log into GoDaddy → Hosting → File Manager
4. Navigate to `public_html/`
5. Upload the ZIP
6. Extract it (right-click → Extract)
7. Make sure files land directly in `public_html/` — not in a subfolder

**Always upload:**
- The HTML file(s) you changed
- `css/style.css` if you changed any styles
- `js/main.js` if you changed any scripts
- Any new images added to `images/`
- `sitemap.xml` if you added new pages

---

## Key Contacts

| Person | Email | Role |
|--------|-------|------|
| Dr. Arpan Gandhi | arpangandhi@gmail.com | Client |
| Krishna Singh | krishna191217@gmail.com | Developer |

---

## Things to NEVER Do

- Never add a section to the homepage that isn't in the funnel (Hero → Ticker → Services → LinkedIn → Help → Contact)
- Never hardcode colours or font names — always use CSS variables
- Never add more than 3 cards to the "What I Do" services grid on the homepage
- Never put the LinkedIn section behind a scroll — all 3 posts must be visible at once on desktop
- Never add a framework, npm package, or build step
- Never commit the `Proejct_Docs/` folder or `.claude/` folder to git
- Never write multi-paragraph comments in the code
- Never use PNG or JPG for new images — always WebP
