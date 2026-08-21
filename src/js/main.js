/* ============================================================
   BOOT — render content, smooth scroll, reveals, interactions
   ============================================================ */
import Lenis from "lenis";
import { skills } from "./data/skills.js";
import { projects } from "./data/projects.js";
import { reviews } from "./data/reviews.js";
import { initParticles } from "./lib/particles.js";
import { initCursor, initTilt } from "./lib/cursor.js";

const $ = (s, ctx = document) => ctx.querySelector(s);
const $$ = (s, ctx = document) => [...ctx.querySelectorAll(s)];
const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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
          <span class="ico">${g.icon}</span>
          <h3>${g.title}</h3>
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
      return `
      <article class="project ${p.featured ? "featured" : ""}" data-reveal>
        <div class="project-visual">
          <div class="grid-lines"></div>
          <span class="glyph">${p.glyph}</span>
        </div>
        <div class="project-body">
          <span class="project-index">PROJECT ${String(i + 1).padStart(2, "0")}</span>
          <h3>${p.title}</h3>
          <span class="role">${p.role}</span>
          <p>${p.blurb}</p>
          <div class="tech">
            ${p.tech.map((t) => `<span class="chip" data-cursor>${t}</span>`).join("")}
          </div>
          ${links ? `<div class="links">${links}</div>` : ""}
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
    .map((r) => {
      const initials = r.name
        .split(" ")
        .map((w) => w[0])
        .slice(0, 2)
        .join("");
      return `
      <article class="review" data-reveal>
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
  $$("#about, #skills, #work, #reviews").forEach((s) => io.observe(s));
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
  renderReviews();

  initSmoothScroll();
  initReveals();
  initNav();
  initMobileMenu();
  initMisc();

  // interactions that must run AFTER dynamic nodes exist
  initCursor();
  initTilt();

  const canvas = $("#hero-canvas");
  if (canvas) initParticles(canvas);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot);
} else {
  boot();
}
