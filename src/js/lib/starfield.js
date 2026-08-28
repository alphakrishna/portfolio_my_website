/* ============================================================
   Global starfield — a subtle, fixed twinkling star layer behind
   the ENTIRE page, so the cosmic backdrop continues past the hero
   all the way to the footer. Lighter/sparser than the hero scene
   (which has its own stars) to stay quiet under the content.
   Paused when the tab is hidden; static under reduced-motion.
   ============================================================ */

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

const STAR_TINTS = [
  [255, 255, 255],
  [206, 196, 255], // violet-white
  [190, 240, 255], // cyan-white
  [255, 236, 210], // warm-white
];

export function initStarfield() {
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const canvas = document.createElement("canvas");
  canvas.className = "stars-bg";
  canvas.setAttribute("aria-hidden", "true");
  document.body.prepend(canvas);

  const ctx = canvas.getContext("2d", { alpha: true });
  if (!ctx) return;

  let W = 0, H = 0, dpr = 1;
  let stars = [];
  let raf = null, running = false;

  // A periodic comet streaking top-right → lower-left, drawn only while the
  // content sections are in view (never over the hero or the footer).
  let comet = null;
  let cometTimer = 200;                       // frames until the first one may spawn
  const heroEl = document.getElementById("hero");
  const footerEl = document.querySelector(".site-footer");

  function build() {
    // sparse: quieter than the hero so it never competes with the copy
    const n = Math.min(240, Math.round((W * H) / 9000));
    stars = new Array(n).fill(0).map(() => {
      const depth = Math.pow(Math.random(), 1.6);            // 0 far … 1 near
      return {
        x: Math.random() * W,
        y: Math.random() * H,
        r: (0.4 + depth * 1.1) * (0.7 + Math.random() * 0.5),
        base: 0.1 + Math.random() * 0.5,
        tint: STAR_TINTS[(Math.random() * STAR_TINTS.length) | 0],
        tw: Math.random() * Math.PI * 2,                     // twinkle phase
        twSpeed: 0.005 + Math.random() * 0.02,
      };
    });
  }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    build();
  }

  // comet only flies when the hero has scrolled away and the footer isn't yet
  // in view — i.e. while the reader is in the middle content sections.
  function cometAllowed() {
    const vh = window.innerHeight;
    if (heroEl) {
      const r = heroEl.getBoundingClientRect();
      if (r.bottom > vh * 0.4) return false;      // hero still fills the screen
    }
    if (footerEl) {
      const r = footerEl.getBoundingClientRect();
      if (r.top < vh) return false;               // footer creeping into view
    }
    return true;
  }

  function maybeSpawnComet() {
    if (comet) return;
    if (cometTimer > 0) { cometTimer--; return; }
    if (!cometAllowed()) return;
    if (Math.random() > 0.02) return;             // sporadic

    const min = Math.min(W, H);
    const head = clamp(min * 0.03, 12, 30);       // bigger, more prominent head
    const sp = 5.5 + Math.random() * 2;
    comet = {
      x: W * (0.86 + Math.random() * 0.16),       // start upper-right, off-screen
      y: -H * (0.06 + Math.random() * 0.12),
      vx: -sp,                                     // equal L + down → a true ~45° diagonal
      vy: sp,
      head,
      len: 20 + Math.random() * 8,                // long tail (× velocity)
    };
  }

  function drawComet() {
    const cm = comet;
    cm.x += cm.vx;
    cm.y += cm.vy;
    // retire once fully past the bottom-left
    if (cm.y - cm.head > H + 40 || cm.x + cm.head < -40) {
      comet = null;
      cometTimer = 260 + Math.floor(Math.random() * 420); // ~4–11s gap
      return;
    }

    const hx = cm.x, hy = cm.y;
    const tx = hx - cm.vx * cm.len, ty = hy - cm.vy * cm.len; // tail trails up-right

    ctx.globalCompositeOperation = "lighter";

    // blue-white tail, fading back toward where it came from
    const tail = ctx.createLinearGradient(hx, hy, tx, ty);
    tail.addColorStop(0, "rgba(214,236,255,0.72)");
    tail.addColorStop(0.35, "rgba(150,190,255,0.26)");
    tail.addColorStop(1, "rgba(120,160,255,0)");
    ctx.strokeStyle = tail;
    ctx.lineCap = "round";
    ctx.lineWidth = cm.head * 1.4;
    ctx.beginPath(); ctx.moveTo(hx, hy); ctx.lineTo(tx, ty); ctx.stroke();

    // soft white-blue glow around the head
    const glow = ctx.createRadialGradient(hx, hy, 0, hx, hy, cm.head * 2.6);
    glow.addColorStop(0, "rgba(255,255,255,0.95)");
    glow.addColorStop(0.35, "rgba(226,242,255,0.5)");
    glow.addColorStop(1, "rgba(150,190,255,0)");
    ctx.fillStyle = glow;
    ctx.beginPath(); ctx.arc(hx, hy, cm.head * 2.6, 0, Math.PI * 2); ctx.fill();

    // hot pink/magenta core (from the reference)
    const core = ctx.createRadialGradient(hx, hy, 0, hx, hy, cm.head);
    core.addColorStop(0, "rgba(255,232,242,1)");
    core.addColorStop(0.5, "rgba(255,96,150,0.85)");
    core.addColorStop(1, "rgba(255,64,120,0)");
    ctx.fillStyle = core;
    ctx.beginPath(); ctx.arc(hx, hy, cm.head, 0, Math.PI * 2); ctx.fill();

    ctx.globalCompositeOperation = "source-over";
  }

  function frame() {
    ctx.clearRect(0, 0, W, H);
    ctx.globalCompositeOperation = "lighter";
    for (const s of stars) {
      s.tw += s.twSpeed;
      const a = s.base * (0.55 + 0.45 * Math.sin(s.tw));
      ctx.fillStyle = `rgba(${s.tint[0]},${s.tint[1]},${s.tint[2]},${a})`;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalCompositeOperation = "source-over";

    maybeSpawnComet();
    if (comet) drawComet();

    raf = requestAnimationFrame(frame);
  }

  function drawStatic() {
    ctx.clearRect(0, 0, W, H);
    ctx.globalCompositeOperation = "lighter";
    for (const s of stars) {
      ctx.fillStyle = `rgba(${s.tint[0]},${s.tint[1]},${s.tint[2]},${s.base})`;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalCompositeOperation = "source-over";
  }

  function start() {
    if (running || prefersReduced) return;
    running = true;
    raf = requestAnimationFrame(frame);
  }
  function stop() {
    running = false;
    if (raf) cancelAnimationFrame(raf);
    raf = null;
  }

  resize();

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 200);
  });

  if (prefersReduced) {
    drawStatic();
    return;
  }

  document.addEventListener("visibilitychange", () => {
    document.hidden ? stop() : start();
  });

  start();
}
