/* ============================================================
   BOOT — render content, smooth scroll, reveals, interactions
   ============================================================ */
import Lenis from "lenis";
import { skills } from "./data/skills.js";
import { projects } from "./data/projects.js";
import { caseStudies } from "./data/caseStudies.js";
import { reviews } from "./data/reviews.js";
import { initParticles } from "./lib/particles.js";
import { initStarfield } from "./lib/starfield.js";
import { initCursor, initTilt } from "./lib/cursor.js";
import { initProjectRope } from "./lib/projectRope.js";

const $ = (s, ctx = document) => ctx.querySelector(s);
const $$ = (s, ctx = document) => [...ctx.querySelectorAll(s)];
// Prefix a public asset path with Vite's base so images resolve on GitHub Pages
// subpaths (and in dev) instead of 404-ing from the domain root.
const asset = (p) => `${import.meta.env.BASE_URL}${String(p).replace(/^\//, "")}`;
const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
let lenisInstance = null; // captured in boot so the review popup can lock/unlock scroll

/* ---------- Render: marquee ---------- */
function renderMarquee() {
  const track = $("#marquee-track");
  if (!track) return;
  const words = [
    "Ship fast", "Best quality", "Shortest time", "Total focus",
    "Enable — don't just build", "Every second counts", "100% energy",
    "Raise the intensity",
  ];
  const one = words
    .map((w) => `<span class="marquee-item">${w}<span class="sep">✦</span></span>`)
    .join("");
  track.innerHTML = one + one; // duplicated for seamless loop
}

/* ---------- Render: skills ---------- */
function renderSkills() {
  const grid = $("#skills-grid");
  if (!grid) return;
  grid.innerHTML = skills
    .map(
      (g) => `
      <article class="skill-group" data-reveal>
        <div class="skill-group-head">
          <span class="ico">${g.art || g.icon}</span>
          <h3>${g.title}</h3>
          <span class="count">${String(g.items.length).padStart(2, "0")}</span>
        </div>
        <div class="chips">
          ${g.items.map((i) => `<span class="chip" data-cursor>${i}</span>`).join("")}
        </div>
      </article>`
    )
    .join("");
}

/* ---------- Render: projects ---------- */
function renderProjects() {
  const list = $("#projects-list");
  if (!list) return;
  list.innerHTML = projects
    .map((p, i) => {
      const links = [
        p.liveUrl && `<a href="${p.liveUrl}" target="_blank" rel="noopener" data-cursor>Live ↗</a>`,
        p.codeUrl && `<a href="${p.codeUrl}" target="_blank" rel="noopener" data-cursor>Code ↗</a>`,
      ]
        .filter(Boolean)
        .join("");
      const side = i % 2 === 0 ? "left" : "right";
      const visualStyle = p.image
        ? ` style="--project-img:url('${asset(p.image)}')${p.imagePos ? `;--project-pos:${p.imagePos}` : ""}"`
        : "";
      const classes = ["project", p.image && "has-img", p.imageContain && "img-contain", p.textOnly && "text-only"]
        .filter(Boolean)
        .join(" ");
      const visual = p.textOnly
        ? ""
        : `
        <div class="project-visual"${visualStyle}>
          <div class="grid-lines"></div>
          <span class="glyph">${p.glyph}</span>
        </div>`;
      return `
      <article class="${classes}" data-side="${side}" data-reveal>${visual}
        <div class="project-body">
          <div class="project-head">
            <span class="project-index">PROJECT ${String(i + 1).padStart(2, "0")}</span>
            <h3>${p.title}</h3>
            <span class="role">${p.role}</span>
          </div>
          <div class="project-detail">
            ${
              p.photo
                ? `<figure class="project-photo"><img src="${asset(p.photo)}" alt="${p.title} award" loading="lazy" />${p.photoCaption ? `<figcaption>${p.photoCaption}</figcaption>` : ""}</figure>`
                : ""
            }
            ${
              p.points
                ? `<ul class="project-points">${p.points.map((pt) => `<li>${pt}</li>`).join("")}</ul>`
                : `<p>${p.blurb}</p>`
            }
            <div class="tech">
              ${p.tech.map((t) => `<span class="chip" data-cursor>${t}</span>`).join("")}
            </div>
            ${links ? `<div class="links">${links}</div>` : ""}
          </div>
        </div>
      </article>`;
    })
    .join("");
}

/* ---------- Render: case studies ---------- */
function renderCaseStudies() {
  const grid = $("#cases-grid");
  if (!grid) return;
  grid.innerHTML = caseStudies
    .map((c, i) => {
      return `
      <article class="case-study" data-case="${i}" tabindex="0" role="button" aria-haspopup="dialog" data-cursor data-reveal>
        <div class="case-head">
          <span class="case-context">${c.context}</span>
          <span class="case-num">${String(i + 1).padStart(2, "0")}</span>
        </div>
        <h3>${c.title}</h3>
        <p class="case-teaser">${c.problem}</p>
        <div class="case-foot">
          <div class="tech">
            ${c.tech.map((t) => `<span class="chip" data-cursor>${t}</span>`).join("")}
          </div>
        </div>
      </article>`;
    })
    .join("");
}

/* ---------- Render: reviews ---------- */
function renderReviews() {
  const track = $("#reviews-track");
  if (!track) return;
  track.innerHTML = reviews
    .map((r, i) => {
      const initials = r.name
        .split(" ")
        .map((w) => w[0])
        .slice(0, 2)
        .join("");
      return `
      <article class="review" data-review="${i}" tabindex="0" role="button" aria-haspopup="dialog" data-cursor data-reveal>
        <div class="quote-mark">“</div>
        <blockquote>${r.quote}</blockquote>
        <div class="who">
          <span class="avatar">${initials}</span>
          <div>
            <div class="name">${r.name}</div>
            <div class="role">${r.role}</div>
          </div>
        </div>
      </article>`;
    })
    .join("");
}

/* ---------- Shared popup used by reviews + case studies ---------- */
function createModal(ariaLabel) {
  const modal = document.createElement("div");
  modal.className = "modal";
  modal.setAttribute("aria-hidden", "true");
  modal.innerHTML = `
    <div class="modal-backdrop" data-modal-close></div>
    <div class="modal-panel" role="dialog" aria-modal="true" aria-label="${ariaLabel}">
      <button class="modal-close" type="button" aria-label="Close" data-modal-close>&times;</button>
      <div class="modal-body"></div>
    </div>`;
  document.body.appendChild(modal);

  const bodyEl = modal.querySelector(".modal-body");
  const closeBtn = modal.querySelector(".modal-close");
  const isOpen = () => modal.classList.contains("open");
  let lastFocused = null;

  const open = (html) => {
    bodyEl.innerHTML = html;
    lastFocused = document.activeElement;
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    lenisInstance?.stop(); // freeze smooth scroll behind the popup
    closeBtn.focus();
  };
  const close = () => {
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    lenisInstance?.start();
    if (lastFocused) lastFocused.focus();
  };

  modal.addEventListener("click", (e) => {
    if (e.target.closest("[data-modal-close]")) close();
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && isOpen()) close();
  });
  return { open, close, isOpen };
}

// Wire a grid of clickable cards to a popup: click / Enter / Space opens it.
function wireCardPopup(container, cardSelector, dataKey, buildHTML) {
  if (!container) return;
  const modal = createModal(buildHTML.label || "Details");
  const openFrom = (el) => modal.open(buildHTML(Number(el.dataset[dataKey])));
  container.addEventListener("click", (e) => {
    const card = e.target.closest(cardSelector);
    if (card) openFrom(card);
  });
  container.addEventListener("keydown", (e) => {
    if (e.key !== "Enter" && e.key !== " ") return;
    const card = e.target.closest(cardSelector);
    if (!card) return;
    e.preventDefault();
    openFrom(card);
  });
}

/* ---------- Reviews: click a card to open a popup ---------- */
function initReviewModal() {
  const html = (i) => {
    const r = reviews[i];
    if (!r) return "";
    const initials = r.name.split(" ").map((w) => w[0]).slice(0, 2).join("");
    return `
      <div class="quote-mark">“</div>
      <blockquote class="modal-quote">${r.quote}</blockquote>
      <div class="who">
        <span class="avatar">${initials}</span>
        <div>
          <div class="name">${r.name}</div>
          <div class="role">${r.role}</div>
        </div>
      </div>`;
  };
  html.label = "Testimonial";
  wireCardPopup($("#reviews-track"), ".review", "review", html);
}

/* ---------- Case studies: click a card to open the full write-up ---------- */
function initCaseModal() {
  const html = (i) => {
    const c = caseStudies[i];
    if (!c) return "";
    const link = c.link
      ? `<a class="case-link" href="${c.link}" target="_blank" rel="noopener" data-cursor>View live ↗</a>`
      : "";
    return `
      <span class="case-context">${c.context}</span>
      <h3 class="modal-title">${c.title}</h3>
      <div class="case-cols case-cols-stack">
        <div class="case-col"><span class="case-label">Problem</span><p>${c.problem}</p></div>
        <div class="case-col"><span class="case-label">Approach</span><p>${c.approach}</p></div>
        <div class="case-col"><span class="case-label">Outcome</span><p>${c.outcome}</p></div>
      </div>
      <div class="case-foot">
        <div class="tech">${c.tech.map((t) => `<span class="chip">${t}</span>`).join("")}</div>
        ${link}
      </div>`;
  };
  html.label = "Case study";
  wireCardPopup($("#cases-grid"), ".case-study", "case", html);
}

/* ---------- Projects: click to expand detail ---------- */
function initProjectExpand() {
  const cards = $$(".projects-list .project");
  const closeAll = (except) =>
    cards.forEach((c) => {
      if (c !== except && c.classList.contains("open")) {
        c.classList.remove("open");
        c.setAttribute("aria-expanded", "false");
      }
    });

  cards.forEach((card) => {
    card.setAttribute("tabindex", "0");
    card.setAttribute("aria-expanded", "false");
    const toggle = () => {
      const willOpen = !card.classList.contains("open");
      closeAll(card); // accordion: keep at most one card open so the stack stays short
      card.classList.toggle("open", willOpen);
      card.setAttribute("aria-expanded", willOpen ? "true" : "false");
    };
    card.addEventListener("click", (e) => {
      if (e.target.closest("a")) return; // let real links work without toggling
      toggle();
    });
    card.addEventListener("keydown", (e) => {
      if (e.target.closest("a")) return;
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggle();
      }
    });
  });

  // A click anywhere outside the cards (or Escape) closes whatever is open.
  document.addEventListener("click", (e) => {
    if (!e.target.closest(".projects-list .project")) closeAll(null);
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeAll(null);
  });
}

/* ---------- Smooth scroll (Lenis) ---------- */
function initSmoothScroll() {
  if (prefersReduced) return null;
  const lenis = new Lenis({
    duration: 1.1,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  });
  function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // anchor links
  $$('a[href^="#"]').forEach((a) => {
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href");
      if (id.length < 2) return;
      const target = $(id);
      if (!target) return;
      e.preventDefault();
      lenis.scrollTo(target, { offset: -70 });
      closeMobileMenu();
    });
  });
  return lenis;
}

/* ---------- Scroll reveals (IntersectionObserver) ---------- */
function initReveals() {
  const items = $$("[data-reveal], [data-reveal-stagger]");
  if (prefersReduced) {
    items.forEach((el) => el.classList.add("in"));
    return;
  }
  // stagger children delays
  $$("[data-reveal-stagger]").forEach((parent) => {
    [...parent.children].forEach((child, i) => {
      child.style.transitionDelay = `${i * 90}ms`;
    });
  });
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("in");
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
  );
  items.forEach((el) => io.observe(el));
}

/* ---------- Nav: scrolled state + active link ---------- */
function initNav() {
  const nav = $("#nav");
  const sections = $$("main section[id], #hero");
  const links = $$(".nav-links a[data-nav]");

  const onScroll = () => {
    nav.classList.toggle("scrolled", window.scrollY > 40);
    $("#back-to-top").classList.toggle("show", window.scrollY > 600);
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // active link via IntersectionObserver on sections
  const byId = new Map(links.map((l) => [l.getAttribute("href").slice(1), l]));
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          links.forEach((l) => l.classList.remove("active"));
          const active = byId.get(entry.target.id);
          if (active) active.classList.add("active");
        }
      });
    },
    { threshold: 0.5 }
  );
  $$("#about, #skills, #work, #cases, #reviews").forEach((s) => io.observe(s));
}

/* ---------- Mobile menu ---------- */
function closeMobileMenu() {
  $("#mobile-menu")?.classList.remove("open");
}
function initMobileMenu() {
  const toggle = $("#menu-toggle");
  const menu = $("#mobile-menu");
  if (!toggle || !menu) return;
  toggle.addEventListener("click", () => menu.classList.toggle("open"));
  $$("#mobile-menu a").forEach((a) => a.addEventListener("click", closeMobileMenu));
}

/* ---------- Copy email + misc ---------- */
function initMisc() {
  $("#year").textContent = new Date().getFullYear();

  const copyBtn = $("#copy-email");
  const toast = $("#copy-toast");
  copyBtn?.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText("krishna191217@gmail.com");
      toast.classList.add("show");
      setTimeout(() => toast.classList.remove("show"), 1800);
    } catch {
      window.location.href = "mailto:krishna191217@gmail.com";
    }
  });

  $("#back-to-top")?.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: prefersReduced ? "auto" : "smooth" });
  });
}

/* ---------- Init ---------- */
function boot() {
  renderMarquee();
  renderSkills();
  renderProjects();
  renderCaseStudies();
  renderReviews();

  lenisInstance = initSmoothScroll();
  initReveals();
  initNav();
  initMobileMenu();
  initMisc();

  // interactions that must run AFTER dynamic nodes exist
  initCursor();
  initTilt();
  initProjectExpand();
  initProjectRope();
  initReviewModal();
  initCaseModal();

  initStarfield();

  const canvas = $("#hero-canvas");
  if (canvas) initParticles(canvas);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot);
} else {
  boot();
}
