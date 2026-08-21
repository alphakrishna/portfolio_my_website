/* ============================================================
   Cursor system — custom ring+dot, spotlight glow, magnetic
   elements, and subtle mouse-tilt parallax.
   All disabled on touch / coarse pointers and reduced-motion.
   ============================================================ */

export function initCursor() {
  const fine = window.matchMedia("(pointer: fine)").matches;
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!fine) return; // touch devices: skip entirely

  const dot = document.querySelector(".cursor-dot");
  const ring = document.querySelector(".cursor-ring");
  const spotlight = document.querySelector(".cursor-spotlight");
  if (!dot || !ring) return;

  document.body.classList.add("cursor-ready");

  const mouse = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  const ringPos = { x: mouse.x, y: mouse.y };
  const spotPos = { x: mouse.x, y: mouse.y };

  window.addEventListener(
    "pointermove",
    (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      // dot is instant (feels responsive), ring/spotlight trail via RAF
      dot.style.transform = `translate(${mouse.x}px, ${mouse.y}px)`;
      if (spotlight && spotlight.style.opacity !== "1") spotlight.style.opacity = "1";
    },
    { passive: true }
  );

  window.addEventListener("pointerdown", () => ring.classList.add("hovering"));
  window.addEventListener("pointerup", () => {
    if (!hoveringInteractive) ring.classList.remove("hovering");
  });

  // Grow the ring over interactive targets
  let hoveringInteractive = false;
  const interactiveSel = "a, button, [data-cursor], input, textarea, .chip";
  document.addEventListener("pointerover", (e) => {
    if (e.target.closest(interactiveSel)) {
      hoveringInteractive = true;
      ring.classList.add("hovering");
    }
  });
  document.addEventListener("pointerout", (e) => {
    if (e.target.closest(interactiveSel)) {
      hoveringInteractive = false;
      ring.classList.remove("hovering");
    }
  });

  function raf() {
    ringPos.x += (mouse.x - ringPos.x) * 0.2;
    ringPos.y += (mouse.y - ringPos.y) * 0.2;
    ring.style.transform = `translate(${ringPos.x}px, ${ringPos.y}px)`;

    if (spotlight) {
      spotPos.x += (mouse.x - spotPos.x) * 0.08;
      spotPos.y += (mouse.y - spotPos.y) * 0.08;
      spotlight.style.transform = `translate(${spotPos.x}px, ${spotPos.y}px)`;
    }
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);

  // --- Magnetic elements ---------------------------------------------------
  if (!prefersReduced) {
    const magnets = document.querySelectorAll("[data-magnetic]");
    magnets.forEach((el) => {
      const strength = parseFloat(el.dataset.magnetic) || 0.35;
      el.addEventListener("pointermove", (e) => {
        const r = el.getBoundingClientRect();
        const mx = e.clientX - (r.left + r.width / 2);
        const my = e.clientY - (r.top + r.height / 2);
        el.style.transform = `translate(${mx * strength}px, ${my * strength}px)`;
      });
      el.addEventListener("pointerleave", () => {
        el.style.transform = "translate(0, 0)";
      });
    });
  }

  // --- Project card gradient-follow (the --mx/--my glow) --------------------
  document.querySelectorAll(".project").forEach((card) => {
    card.addEventListener("pointermove", (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${((e.clientX - r.left) / r.width) * 100}%`);
      card.style.setProperty("--my", `${((e.clientY - r.top) / r.height) * 100}%`);
    });
  });
}

/* Subtle whole-section tilt/parallax driven by mouse position. */
export function initTilt() {
  const fine = window.matchMedia("(pointer: fine)").matches;
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!fine || prefersReduced) return;

  const layers = document.querySelectorAll("[data-parallax]");
  if (!layers.length) return;

  let tx = 0, ty = 0, cx = 0, cy = 0;
  window.addEventListener(
    "pointermove",
    (e) => {
      tx = (e.clientX / window.innerWidth - 0.5) * 2;  // -1..1
      ty = (e.clientY / window.innerHeight - 0.5) * 2;
    },
    { passive: true }
  );

  function raf() {
    cx += (tx - cx) * 0.06;
    cy += (ty - cy) * 0.06;
    layers.forEach((el) => {
      const depth = parseFloat(el.dataset.parallax) || 12;
      el.style.transform = `translate3d(${cx * depth}px, ${cy * depth}px, 0)`;
    });
    requestAnimationFrame(raf);
  }
  requestAnimationFrame(raf);
}
