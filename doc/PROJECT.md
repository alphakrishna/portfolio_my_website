# PathMole Expert Lab: Complete Project Documentation

> One document that explains the whole project: what it is, who it is for, how it is
> built, every page and file, the rules, the brand, what is done, and what is still
> pending before launch. If you read only one file, read this one.
>
> **Last updated:** 2026-08-29 · **Status:** v1 built, content and design locked, awaiting
> a few client-supplied assets and launch-infrastructure values.

---

## 1. What This Project Is

A **static, multi-page marketing website** for **PathMole Expert Lab**, a specialist
**Histopathology and Molecular Diagnostics referral laboratory** in **Sector 6, Gurugram
(Haryana, Delhi NCR), India**. The site is a credibility-first brochure plus two working
tools: a **rule-based chatbot** (the site's test-finder) and a **de-identified case-study
section** that also feeds a doctor email newsletter.

- **Audience:** roughly **90% B2B, 10% B2C**. The primary readers are **referring doctors,
  hospitals, and diagnostic centres**; a minority are **direct walk-in patients**, so
  patient-facing pages stay clear and reassuring without leading the site.
- **Two disciplines on one platform:**
  - **Histopathology:** "What does the disease look like?" (tissue morphology, biopsy,
    cytology, immunohistochemistry).
  - **Molecular Diagnostics:** "What is driving it?" (molecular and mutation panels, PCR
    testing), oncology-leaning and precision-focused.
- **Positioning:** quality-driven, technology-enabled, fast turnaround, responsive
  clinician support. The site leads with diagnostic capability, quality, and clinician
  trust, not consumer or price messaging.
- **Tone:** clinical, precise, trustworthy, modern. Institutional lab voice ("At PathMole
  Expert Lab..."), credible for doctors first and reassuring for patients second.
- **Original launch target:** 17 Aug 2026. Content and design were signed off (locked) on
  20 Aug 2026.

**Principals / clients:**
- **Dr. Arpan Gandhi:** roughly three decades in pathology, laboratory medicine, and
  quality systems (ocular pathology, oncology, CAP/NABL background, 200+ mentored).
- **Mr. Ashok Yadav:** 20+ years in diagnostic laboratory operations.

---

## 2. The Hard Rules (never break these)

These override any default behavior and apply to the site, the chatbot, and all content.

1. **No pricing anywhere.** Not on any page, not in `data/tests.js`, not in the chatbot.
   Every pricing question is redirected to the contact flow (Call / WhatsApp / enquiry).
2. **Case studies are always de-identified** (DPDP Act 2023): no patient name, ID, photo,
   or re-identifying detail; each carries a disclaimer. Applies to the site and the email.
3. **Invent nothing.** Only real, verifiable facts, tests, and accreditations. Where a real
   value is not yet supplied, use a clearly marked placeholder, never a fabricated one.
4. **Never store patient health data.** The Patient Form is a download-only PDF. The
   enquiry forms only email the lab; no health records are stored.
5. **Never build or replace the third-party Reporting Portal.** Only link out to it (a
   top-of-site button, opens in a new tab).
6. **Never use em dashes** in any output (code comments, docs, copy). Use a comma, period,
   parentheses, or colon, or rewrite. En dashes and middots are allowed in site style.
7. **No frameworks, no npm packages, no build step** for the site to run. Vanilla only.
8. **Never hardcode colours or fonts.** All theme values live in `:root` CSS variables.
9. **Do not edit the hand-built pages via `scripts/build_pages.py`, and do not run it.**
   Edit the HTML directly. A rebuild could revert direct edits.
10. **Commit and push only when explicitly asked.**

---

## 3. Tech Stack

- **HTML5 + CSS3 + vanilla JavaScript.** No framework, no bundler, no npm, no backend.
- **Fonts:** Google Fonts, Poppins (headings) and Inter (body), loaded async with a
  `media="print" onload` swap and a `<noscript>` fallback.
- **Icons and illustrations:** inline SVG only (no icon library). Case-study art is
  hand-built branded SVG in navy/magenta.
- **Chatbot:** rule-based engine (`js/chatbot.js`) reading editable rules
  (`data/chatbot-rules.js`). No AI, no API, no backend.
- **Forms:** front-end only, delivered via **Web3Forms** (free, no server). Until the
  access key is pasted, forms validate and show a friendly "call us" fallback.
- **Analytics:** Google Analytics 4 (gtag), with the Measurement ID as a placeholder
  (`G-XXXXXXX`) until the client supplies it.
- **Hosting:** GoDaddy shared hosting, files uploaded via File Manager as a ZIP into
  `public_html/`.
- **Responsive:** mobile-first, works down to about 320px. Target breakpoints 320 / 768 /
  1280.
- **Accessibility target:** WCAG AA contrast, keyboard-navigable, ARIA labels on icon-only
  buttons.

**How to run locally:** open any `.html` directly in a browser, or serve the folder with a
static server (VS Code "Live Server", `npx serve`, or `python -m http.server 8099`).

---

## 4. Folder and File Structure

```
PATHMOLE Website proejct/
├── index.html                       # Home (lean funnel, the only page with the hero video)
├── about.html                       # About the lab (story, quality, leadership: Gandhi + Yadav)
├── services.html                    # Services hub (Training Institute + Histo + Molecular + more)
├── tests.html                       # Test list (renders from data/tests.js, NO prices)
├── quality.html                     # Quality and patient safety
├── physicians.html                  # Team / for clinicians (leadership profile blocks)
├── patients.html                    # Patient info + downloadable Patient Form (PDF)
├── faq.html                         # FAQ
├── careers.html                     # Careers / openings
├── contact.html                     # Enquiry form + Google Maps placeholder + details
├── partner.html                     # Partner With Us page + native partnership enquiry form
├── training-institute.html          # Training Institute service page + enquiry form
├── histopathology.html              # Service sub-page
├── cytopathology.html               # Service sub-page
├── molecular-diagnostics.html       # Service sub-page
├── diagnostic-support.html          # Service sub-page (specialised diagnostic support)
├── gallery.html                     # Facility + equipment gallery (6 photo placeholders)
├── videos.html                      # Video section (2 YouTube embed placeholders)
├── publications.html                # Retired: redirect stub to case-studies/ (noindex)
├── 404.html                         # Custom 404
├── favicon-preview.html             # Dev-only preview of favicon options (do not ship)
│
├── case-studies/
│   ├── index.html                   # "Case Studies & Research" listing + Research section
│   │   ── Guideline / standard explainers ──
│   ├── asco-cap-her2.html
│   ├── cap-amp-mmr-msi.html
│   ├── cap-iaslc-amp-lung.html
│   ├── who-classification-tumours.html
│   │   ── Landmark educational cases (published literature, honestly framed) ──
│   ├── landmark-bcr-abl-cml.html
│   ├── landmark-carcinoma-biopsy.html
│   ├── landmark-cervical-hpv-pap.html
│   ├── landmark-granuloma-histopathology.html
│   ├── landmark-hepatitis-liver-cancer.html
│   ├── landmark-hiv-molecular.html
│   ├── landmark-hla-b27-spondylitis.html
│   └── landmark-tuberculosis-molecular.html
│
├── css/
│   └── style.css                    # Single global stylesheet (~1016 lines), :root variables
├── js/
│   ├── main.js                      # Nav, mobile menu, scroll reveal, count-up, forms (~378 lines)
│   ├── chatbot.js                   # Rule-based chatbot engine (~255 lines)
│   └── tests.js                     # Tests-page renderer (groups + renders data/tests.js)
├── data/
│   ├── tests.js                     # Test catalogue data (NO price field, never add one)
│   └── chatbot-rules.js             # Editable chatbot Q&A rules (~357 lines)
│
├── assets/                          # Shippable media: hero video/poster, logos, favicons,
│                                    # leadership photos, training-institute video
├── image/                           # WebP imagery: nav logo, case-study figures, lab photos
│
├── docs/                            # Project documentation (NOT shipped to public_html)
│   ├── PATHMOLE-WEBSITE-GUIDE.md     # Build source of truth (page tree + shared code blocks)
│   ├── PLAN.md                       # High-level context, decisions, costs, newsletter plan
│   ├── TASKS.md                      # Progress checklist and blockers
│   ├── INSTRUCTIONS.md               # Conventions / how to edit
│   ├── brand-assets.md               # Brand kit (name, logo, colours, type, contact)
│   ├── test-categories-reference.md  # Domain reference: typical tests per category
│   ├── design-reference-aiforia.md   # Design analysis of aiforia.com
│   ├── hero-accent-options.md        # Hero accent colour exploration
│   ├── reference-drarpangandhi-guide.md
│   ├── Dr-Arpan-Gandhi-Profile.md    # Private source for the leadership bio
│   ├── HOSTING-EMAIL.md / HOSTING-PRICING.md
│   ├── PATHMOLE-Content-Request.md/.docx  # Content still needed from client
│   └── (client dumps, .docx sources)
│
├── contract/                        # Commercial paperwork (NOT shipped)
├── scripts/                         # Dev tools (NOT shipped): build_pages.py, cdp_shot.mjs, docx gen
├── robots.txt · sitemap.xml · .htaccess   # Site config (shipped)
├── README.md                        # Short repo readme
└── PROJECT.md                       # This file
```

**Ship to `public_html/`:** all root `.html` (except `favicon-preview.html`), `case-studies/`,
`css/`, `js/`, `data/`, `assets/`, `image/`, `robots.txt`, `sitemap.xml`, `.htaccess`.
**Do not ship:** `docs/`, `contract/`, `scripts/`, `.git`, `.vscode`, `PROJECT.md`, `README.md`.

---

## 5. Every Page, Explained

### Root pages

| Page | Purpose |
|---|---|
| `index.html` | Lean funnel homepage. The **only** page with the hero background video. Sections: top bar, nav, hero + dual CTA, trust bar (animated count-up stats), "Our Philosophy", what-we-do cards, why-choose-us, case-studies teaser, final CTA band, footer, floating chatbot. |
| `about.html` | The lab's story, quality philosophy, technology, and two leadership profile blocks (Dr. Arpan Gandhi and Mr. Ashok Yadav) with circular headshots and credential chips. |
| `services.html` | Services hub. Order: Training Institute, Histopathology, Molecular Diagnostics, Cytopathology, Specialised Diagnostic Support. Each links to its sub-page. Kept lean (no re-explaining the sub-pages). |
| `histopathology.html`, `cytopathology.html`, `molecular-diagnostics.html`, `diagnostic-support.html` | Service sub-pages. Each: short "what it is" line then "what we offer", breadcrumb Home / Services / X, SERVICES nav active. Deliberately no duplication of the landing cards or each other. |
| `tests.html` | Renders the test list from `data/tests.js` via `js/tests.js`, grouped by category. Info only (symptoms/indications), a "contact us for details" note, and Call / WhatsApp block. **No prices.** |
| `quality.html` | Quality and patient-safety framework. |
| `physicians.html` | Team / for clinicians. Premium leadership profile blocks (mirror of About). |
| `patients.html` | Patient-facing info + a download link for the Patient Form PDF (link is live at `patients.html`; the PDF asset is still pending). |
| `faq.html` | Frequently asked questions. |
| `careers.html` | Careers / openings. |
| `contact.html` | Enquiry form (`id="enquiry-form"`), contact details, working hours, and a static Google Maps placeholder card (real embed swapped in later). |
| `partner.html` | "Partner With Us" page built from client copy: intro, partner list, four "what we offer" cards, and a full native partnership enquiry form with `<select>` dropdowns. Uses "PATHMOLE EXPERT LLP". |
| `training-institute.html` | Training Institute service page from client copy, surfaced at the top of Services and in the footer + mobile menu. Includes a training video. Registration form is a placeholder pending client Google Form / fields. Uses "PATHMOLE EXPERT LLP". |
| `gallery.html` | Facility and equipment gallery. Currently 6 `Photo [PLACEHOLDER]` tiles pending real lab photos. |
| `videos.html` | Video section. Currently 2 `YouTube embed [PLACEHOLDER]` tiles pending real video links. |
| `publications.html` | **Retired.** A tiny meta-refresh + JS redirect stub to `case-studies/` (noindex), kept so old bookmarks and newsletter links still land. Removed from nav and footer. |
| `404.html` | Custom 404 page (wired via `.htaccess` `ErrorDocument`). |
| `favicon-preview.html` | Dev-only visual preview of favicon options. Not part of the site; do not ship. |

### Case-studies section (`case-studies/`)

The section is titled **"Case Studies & Research"**. It merges two things:
1. **Landmark educational cases** from the published literature, honestly framed as
   milestones in diagnostic pathology (not PathMole's own patients), each tied to a test
   the lab actually offers where possible. This fills the section credibly while the lab
   accumulates its own de-identified cases. An explicit note says the lab's own cases will
   be added over time.
2. **Research and References:** explainers of the external guidelines/standards the lab's
   reporting aligns with (ASCO-CAP HER2, CAP-AMP MMR/MSI, CAP-IASLC-AMP lung, WHO
   Classification of Tumours).

**Landmark case pages** (each: `What happened`, `Why it mattered`, `Key points` tick-list,
`How this connects to our testing`, `Sources`, and an educational disclaimer `.notice`):
- `landmark-cervical-hpv-pap.html`: Pap smear + HPV (Papanicolaou; zur Hausen, Nobel 2008).
- `landmark-hepatitis-liver-cancer.html`: HBV/HCV to liver cancer (Blumberg 1976; Alter/Houghton/Rice 2020).
- `landmark-hiv-molecular.html`: HIV isolation and molecular/viral-load testing (Barre-Sinoussi & Montagnier, Nobel 2008).
- `landmark-tuberculosis-molecular.html`: Koch's bacillus (1882) to rapid molecular TB detection.
- `landmark-hla-b27-spondylitis.html`: HLA-B27 and ankylosing spondylitis (1973).
- `landmark-bcr-abl-cml.html`: Philadelphia chromosome / BCR-ABL to imatinib (educational milestone; this specific test framing is honest about menu scope).
- `landmark-carcinoma-biopsy.html`, `landmark-granuloma-histopathology.html`: histopathology landmark explainers.

Every case-study page reuses the same head / top-bar / nav / footer / back-buttons / scripts
as the site chrome, with `../` relative paths. Only the hero and content block differ.

---

## 6. Shared Chrome (on every page)

- **Top bar (`.top-bar`):** phone, working hours, Call Now, WhatsApp, and a "Check Your
  Report" link to the third-party reporting portal (opens new tab).
- **Nav (`.site-nav`):** logo (links home), desktop links, and a mobile hamburger menu.
  Desktop nav: HOME, ABOUT, SERVICES, TESTS, RESEARCH, PARTNER WITH US, CONTACT. The mobile
  menu is fuller (adds Quality, Gallery, Videos, Patients, Physicians, FAQ, Careers, Reports).
  Frosted sticky nav that shrinks on scroll; two-tone gradient link underline.
- **Footer (`.site-footer`):** brand block with a clickable logo (returns home), Services /
  Explore / Contact columns, copyright, and a hidden-until-supplied social links block.
- **Back-to-top button** (all pages) and a **floating "Back" button** (interior pages only,
  slides in past 300px, uses browser history with a `data-home` fallback).
- **Floating chatbot mount** (`#chatbot`) on all pages.

**Logo href logic:** root pages use `./` and `image/...` or `assets/...`; case-studies pages
use `../` and `../image/...` or `../assets/...`.

---

## 7. Styling (`css/style.css`)

Single global stylesheet, about 1016 lines, organised into 17 commented sections: Variables,
Reset/Base, Typography, Layout, Buttons, Top bar, Nav, Hero, Sections/Cards, Case studies,
CTA band, Footer, Back-to-top, Chatbot, Forms/Map, Reveal, Responsive.

**Brand tokens (in `:root`):**

```css
--brand-navy:      #232C8E;   --brand-navy-deep: #1A2270;
--brand-pink:      #EC008C;   --brand-pink-deep: #C1006F;
--ink-900: #14202B;  --ink-600: #3B4A57;  --ink-400: #7A8894;
--line: #E6E9F2;  --surface: #FFFFFF;  --bg-soft: #F5F7FB;
--accent: var(--brand-pink);  --accent-deep: var(--brand-pink-deep);  --heading: var(--brand-navy);
--font-heading: 'Poppins', 'Segoe UI', sans-serif;
--font-body:    'Inter', Arial, sans-serif;
--radius: 12px;  --radius-lg: 20px;  --maxw: 1160px;
--shadow-sm/md/lg, --ring;
```

**Conventions:**
- Mobile-first; base styles for mobile, `@media (min-width: ...)` for larger screens.
- `rem` for font sizes and spacing. Descriptive kebab-case class names.
- Re-theme by editing the `:root` variables, not scattered values.
- Signature motif: navy to magenta gradient icon tiles, angular chevron accents, closing
  "Refer a case" CTA band on interior pages.
- The hero overlay/scrim is currently reverted to the committed original navy scrim (three
  responsive `.hero-media-overlay` rules at base, 768px, 1024px).

---

## 8. JavaScript (`js/`)

### `js/main.js` (about 378 lines)
Self-invoking IIFE, `"use strict"`, vanilla only. Modules:
- **Sticky nav shadow** and show/hide of back-to-top and back-page buttons on scroll.
- **Topbar height docking:** measures the sticky top bar on mobile and exposes `--topbar-h`
  so the nav sits flush beneath it.
- **Mobile menu** toggle with `aria-expanded`.
- **Back-to-top** and **back-page** (history with `data-home` fallback).
- **News strip:** rotating highlights and a "see all updates" modal.
- **Scroll reveal:** IntersectionObserver reveals `.reveal` on downward entry; re-arms only
  when the element sits fully below the viewport again.
- **Trust-bar count-up:** the stats animate from 0 to their value (easeOutCubic, 1600ms)
  and **replay every time** the section scrolls back down into view. Respects
  `prefers-reduced-motion`; full values live in the HTML so they show with no JS.
- **CTA band accent line:** fills/empties in lockstep with scroll.
- **Case scroller:** swipeable, arrow-navigable, auto-advancing carousel.
- **Enquiry / Partner / Training forms:** one handler for `id="enquiry-form"`. Validates,
  adds a honeypot, and posts to Web3Forms. **`const WEB3FORMS_ACCESS_KEY = "";` is empty**,
  so until it is set, forms show a graceful "call or WhatsApp us" message instead of failing.

### `js/chatbot.js` (about 255 lines)
The rule-based chatbot engine. Floating launcher (branded PathMole "P" tile with a white
contrast ring), quick-reply menu, free-text keyword matching, typing indicator, keyboard
accessible (Tab/Enter/Esc). Chat history persists across page navigation via sessionStorage
and clears only on a full reload. **Do not edit the engine to change answers**, edit the
rules file instead.

### `js/tests.js`
Reads `data/tests.js`, groups tests by `CATEGORY_ORDER`, and renders the cards on
`tests.html`. No prices anywhere.

---

## 9. The Chatbot Rules (`data/chatbot-rules.js`)

Rule-based, no AI. It is the site's **only** test-finder (there is no search box). All Q&A
lives here (about 357 lines) so non-developers can edit answers without touching the engine.

Each rule shape:
```js
{
  id: "find-test",
  label: "Find a test",                          // quick-reply button text
  keywords: ["test", "biopsy", "thyroid"],       // lowercase, matched case-insensitively
  answer: "Tell me the symptom or test name...",
  action: { type: "link", href: "tests.html", text: "Browse all tests" }
}
```
- **Pricing rule** must use `action: { type: "contact" }` (renders Call / WhatsApp) and must
  never contain a price.
- Keep a **fallback** rule that routes to WhatsApp / phone.
- Other rules: enquiry (to `contact.html#enquiry`), quality, turnaround (no invented times),
  partner, plus menu-accurate links (subdirectory links fixed for case-studies).

---

## 10. The Test Catalogue (`data/tests.js`)

Client-supplied live menu (19 Aug 2026). **Schema:** `{ slug, name, category, symptoms[],
info }`. **There is no price field, and one must never be added.**

- **Categories in use:** `Histopathology`, `Molecular Diagnostics`. (`Immunohistochemistry`
  and `FISH & Cytogenetics` groups are commented out, kept for easy re-enable when the lab
  adds them.)
- **Histopathology:** Small / Medium / Large / Extra Large Biopsy, Second Opinion, Cell
  Block, Slides & Blocks, Fluid Cytology / LBC Pap Smear.
- **Molecular Diagnostics:** HBV, HCV, HIV, HLA-B27, Flu Panel, HPV, TB, EBV, BCR-ABL,
  TORCH by PCR.

A few names are pending final client confirmation (scope of "Slides & Blocks", whether
"Fluid Cytology / LBC Pap Smear" is one item or two, "Flu Panel" method). Typos from the
client's list were corrected (Opinon to Opinion, Floid to Fluid, Lb to LBC, HLAB-27 to
HLA-B27, FluPanel to Flu Panel).

---

## 11. Brand Kit

Derived from the client's official letterhead (`image/WhatsApp Image 2026-08-07 at 10.33.30 AM.webp`).

- **Name / wordmark:** "**Path**Mole" as one word (Path = navy, Mole = magenta), then
  "**EXPERT LAB**" in navy small-caps. Discipline line: `HISTOPATHOLOGY | MOLECULAR BIOLOGY`.
- **Icon:** microscope + DNA double-helix + a molecular/cell cluster (navy + magenta).
- **Tagline:** "**Precision in Diagnosis. Confidence in Care.**" (footer strap and hero
  sub-line). The letterhead's "Precision in Diagnosis. Confidence in Results." is the
  original; the site uses "...Confidence in Care." Note the letterhead's "NOT VALID FOR
  MEDICO LEGAL PURPOSE" is a report disclaimer, not for the website.
- **Colours:** navy `#232C8E`, magenta `#EC008C` on white with a cool soft-grey alt
  background `#F5F7FB`. Navy is safe for text on white; magenta is for button fills with
  white text and accents/links (avoid magenta for small body text: borderline AA).
- **Type:** Poppins (headings), Inter (body). Both free Google Fonts.
- **Signature motif:** angular navy-to-magenta chevron bands + a faint microscope/DNA
  watermark, kept restrained with lots of whitespace (Aiforia-inspired polish).

**Confirmed real contact details (used site-wide):**
- **Address:** Building No. 1164/1, 1st Floor, Shri JP Tower, New Railway Road, Opposite
  Fire Station, Dayanand Colony, Sector 6, Gurugram (Haryana).
- **Phone / WhatsApp:** +91 98998 22375.
- **Email:** pathmolelab@gmail.com (a domain mailbox via Zoho is planned).
- **Working hours (current on the site):** Mon to Sat, 8:00 AM to 8:00 PM. (The brand-assets
  doc's older "11 to 11" was superseded during the content lock.)

---

## 12. Assets and Imagery

- **`assets/`** (shippable media): `hero.mp4` (hero background video, HandBrake 4K to 1080p,
  about 3.5 MB) + poster, `logo-white-bg.png`, `logo.png`, `favicon.svg` (+ monogram and
  microscope favicon variants), `dr-arpan-gandhi.png`, `dr-ashok-yadav.jpg`,
  `training-institute.mp4` + poster, plus some source GIFs/MOV that are working files.
- **`image/`** (WebP imagery): `logo_Nave_bar.webp` (nav logo) and logo variants, lab photos,
  and the case-study figures (`Cervical_Cancer.webp`, `Hepatitis.webp`, `Tuberculosis.webp`,
  `HLA-B27.webp`, `Philadelphia_Chromosome.webp`, `Granuloma.webp`,
  `Diagnosing_Carcinoma.webp`, `nejmp038194_f2.webp`, etc.), and the leadership headshot
  source (`Dr_Ashok_sir.webp`).
- Rule: prefer **WebP** for photos and inline **SVG** for icons/illustrations. The raster
  logo is a stopgap; a vector logo (SVG) is still wanted from the client.

---

## 13. SEO and Config

- **Per page:** unique `<title>` and `<meta description>`, `<link rel="canonical">`,
  exactly one `<h1>`, Open Graph tags, descriptive `alt` text.
- **`sitemap.xml`** lists the pages; **`robots.txt`** is open to all crawlers and points to
  the sitemap. Both use the `[DOMAIN]` placeholder until the real domain is set.
- **`.htaccess`** (GoDaddy/Apache): custom 404, gzip, cache headers for CSS/JS/images, and a
  commented-out force-HTTPS block to enable once SSL is active.
- **GA4:** gtag snippet in every head with `G-XXXXXXX` placeholder.

---

## 14. Launch Status: Done vs Pending

**Done and locked (content + design signed off 2026-08-20):**
- All pages built and styled; site-wide consistency pass complete.
- Chatbot rewritten (active, menu-accurate, subdirectory links fixed).
- Reports Login URL wired site-wide; hours set to 8:00 AM to 8:00 PM everywhere.
- Full client test list entered; leadership profiles built with real photos and bios.
- Case Studies merged with Research; landmark educational cases fill the section honestly.
- Forms fully wired to Web3Forms (delivery off until the key is pasted).

**Still pending: three client-supplied drop-in assets (the only content blockers):**
- [ ] **Patient Form PDF** to `assets/pathmole-patient-form.pdf` (link already live on `patients.html`).
- [ ] **Lab photos** for the 6 placeholder tiles in `gallery.html`.
- [ ] **Lab videos** for the 2 placeholder tiles in `videos.html`.

**Still pending: launch-infrastructure values (handle at go-live, not "content"):**
- [ ] **Web3Forms access key** pasted into `js/main.js` (create at web3forms.com using
      pathmolelab@gmail.com), then live-test all three forms.
- [ ] **Training Institute registration form** (client Google Form embed or field list).
- [ ] **Vector logo** (SVG) to replace the raster PNG.
- [ ] **Domain + Zoho email** set up on GoDaddy.
- [ ] **Google Maps embed** URL (contact page currently shows a static map card).
- [ ] **Social links** (footer block is commented out until real URLs arrive).
- [ ] **GA4 Measurement ID** to replace `G-XXXXXXX`.
- [ ] **Newsletter email stack:** Zoho Mail + Zoho Campaigns/Brevo (free tiers), SPF/DKIM/DMARC,
      import roughly 150 referring doctors from the client CSV, branded template, unsubscribe.

**QA still to run:** device pass at 320/768/1280, full accessibility audit, cross-browser,
final "no PLACEHOLDER/TODO remaining" sweep, performance check.

---

## 15. How to Edit (for the client / non-developers)

- **Page text:** open the relevant `.html`, find the section, edit the text between the
  tags. Do not touch anything inside `< >` unless you know what it does.
- **Tests:** edit `data/tests.js`. Each test has `slug`, `name`, `category`, `symptoms[]`,
  `info`. **There is no price field; never add one.**
- **Chatbot answers:** edit `data/chatbot-rules.js` only (not `js/chatbot.js`). Keep the
  pricing rule as a contact action and keep a fallback rule.
- **Images:** drop WebP files into `image/` (or `assets/`) and update the `src="..."` path.
- **Colours / fonts:** edit the `:root { ... }` block at the top of `css/style.css`.
- **Contact details:** search the pages for the phone / email / address to update them.
- **Placeholders left on purpose:** `[DOMAIN]`, `G-XXXXXXX`, portal and social `#`, and any
  `[PLACEHOLDER: ...]`. Leave these as-is until the real value is supplied. Never invent one.

---

## 16. How to Deploy

1. ZIP the shippable files (see Section 4: exclude `docs/`, `contract/`, `scripts/`,
   `favicon-preview.html`, `README.md`, `PROJECT.md`, `.git`, `.vscode`).
2. GoDaddy: Hosting, File Manager, `public_html/`.
3. Upload the ZIP and extract so files land directly in `public_html/`.
4. On updates, upload the changed HTML plus `css/style.css`, `js/*.js`, `data/*.js` (if the
   catalogue or chatbot changed), any new images, and `sitemap.xml` (if pages were added).
5. Point the domain, verify HTTPS (enable the force-HTTPS block in `.htaccess`), and submit
   the sitemap in Search Console once.

---

## 17. Commercial Terms (from the plan / contract)

Total **INR 26,000**: **INR 7,000** advance (received, non-refundable) and **INR 19,000**
balance before go-live, with **INR 2,000/month** optional maintenance. Post-launch: bugs
free for 14 days, then an INR 1,000 charge, then covered by maintenance. Two clients: Dr.
Arpan Gandhi and Mr. Ashok Yadav. Full terms in `contract/CONTRACT.md`. Newsletter and email
stack are planned on free tiers (about INR 0/month); the client buys the domain (roughly INR
500 to 1,300/year).

---

## 18. Quick Reference: Things to Never Do

- Never show a **price** anywhere (site or chatbot). Route pricing to the contact flow.
- Never publish a case study that is not **fully de-identified** (DPDP).
- Never **invent** tests, symptoms, accreditations (NABL/CAP), or contact details.
- Never **store patient health data** (Patient Form is download-only).
- Never build or replace the third-party **Reporting Portal** (link out only).
- Never overload the homepage; it stays a lean funnel.
- Never hardcode colours or fonts; use `:root` variables.
- Never add a framework, npm package, or build step.
- Never edit or run `scripts/build_pages.py` for the hand-built pages; edit HTML directly.
- Never use **em dashes**.
- Never **commit or push** unless explicitly asked.
- Never ship with `PLACEHOLDER` / `TODO` remaining; clear or confirm them before launch.

---

_Documentation companion files: `docs/PATHMOLE-WEBSITE-GUIDE.md` (build spec with shared
code blocks), `docs/PLAN.md` (context and decisions), `docs/TASKS.md` (live checklist),
`docs/INSTRUCTIONS.md` (conventions), `docs/brand-assets.md` (brand kit)._
