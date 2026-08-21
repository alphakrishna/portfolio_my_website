/* ============================================================
   Reactive particle "energy core"
   Optimized canvas-2D field: repels + swirls around the cursor,
   breathes when idle. Paused off-screen / hidden / reduced-motion.
   ============================================================ */

const VIOLET = [124, 92, 255];
const CYAN = [34, 211, 238];
const lerp = (a, b, t) => a + (b - a) * t;

export function initParticles(canvas) {
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const ctx = canvas.getContext("2d", { alpha: true });
  if (!ctx) return;

  let W = 0, H = 0, dpr = 1;
  let particles = [];
  let raf = null;
  let running = false;

  // Pointer (smoothed) in CSS pixels relative to canvas.
  const pointer = { x: -9999, y: -9999, tx: -9999, ty: -9999, active: false };

  const FORCE_RADIUS = 150;   // px of influence
  const isCoarse = window.matchMedia("(pointer: coarse)").matches;

  function count() {
    // Scale particle count to area, but keep it cheap. Cap hard for mobiles.
    const area = W * H;
    const base = Math.round(area / 9000);
    const cap = isCoarse ? 90 : 220;
    return Math.max(40, Math.min(cap, base));
  }

  function makeParticles() {
    const n = count();
    particles = new Array(n).fill(0).map((_, i) => {
      // Distribute across an elliptical field biased toward the right (behind copy-free area)
      const angle = Math.random() * Math.PI * 2;
      const rad = Math.pow(Math.random(), 0.6);
      const cx = W * (isCoarse ? 0.5 : 0.66);
      const cy = H * 0.5;
      const ox = cx + Math.cos(angle) * rad * W * 0.42;
      const oy = cy + Math.sin(angle) * rad * H * 0.46;
      const t = i / n;
      return {
        ox, oy,               // home position
        x: ox, y: oy,
        vx: 0, vy: 0,
        size: lerp(0.7, 2.2, Math.random()),
        drift: Math.random() * Math.PI * 2,
        driftSpeed: lerp(0.0015, 0.006, Math.random()),
        col: [
          Math.round(lerp(VIOLET[0], CYAN[0], t)),
          Math.round(lerp(VIOLET[1], CYAN[1], t)),
          Math.round(lerp(VIOLET[2], CYAN[2], t)),
        ],
        alpha: lerp(0.25, 0.9, Math.random()),
      };
    });
  }

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    W = rect.width; H = rect.height;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    makeParticles();
  }

  function step() {
    ctx.clearRect(0, 0, W, H);
    ctx.globalCompositeOperation = "lighter";

    // Smooth pointer toward target
    pointer.x += (pointer.tx - pointer.x) * 0.18;
    pointer.y += (pointer.ty - pointer.y) * 0.18;

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      // gentle breathing drift around home
      p.drift += p.driftSpeed;
      const homeX = p.ox + Math.cos(p.drift) * 10;
      const homeY = p.oy + Math.sin(p.drift * 1.3) * 10;

      // spring back home
      p.vx += (homeX - p.x) * 0.008;
      p.vy += (homeY - p.y) * 0.008;

      // cursor force field: repel + swirl
      if (pointer.active) {
        const dx = p.x - pointer.x;
        const dy = p.y - pointer.y;
        const dist2 = dx * dx + dy * dy;
        if (dist2 < FORCE_RADIUS * FORCE_RADIUS) {
          const dist = Math.sqrt(dist2) || 1;
          const f = (1 - dist / FORCE_RADIUS);
          const nx = dx / dist, ny = dy / dist;
          // repel
          p.vx += nx * f * 2.6;
          p.vy += ny * f * 2.6;
          // swirl (tangential)
          p.vx += -ny * f * 1.5;
          p.vy += nx * f * 1.5;
        }
      }

      // damping + integrate
      p.vx *= 0.9;
      p.vy *= 0.9;
      p.x += p.vx;
      p.y += p.vy;

      const speed = Math.min(1, Math.hypot(p.vx, p.vy) / 6);
      const r = p.size + speed * 1.6;
      const a = Math.min(1, p.alpha + speed * 0.5);

      ctx.beginPath();
      ctx.fillStyle = `rgba(${p.col[0]},${p.col[1]},${p.col[2]},${a})`;
      ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
      ctx.fill();
    }

    // Connection lines to the cursor for the "energy tethers" feel (cheap: only near particles)
    if (pointer.active) {
      ctx.globalCompositeOperation = "lighter";
      for (let i = 0; i < particles.length; i += 2) {
        const p = particles[i];
        const dx = p.x - pointer.x, dy = p.y - pointer.y;
        const d = Math.hypot(dx, dy);
        if (d < FORCE_RADIUS) {
          const a = (1 - d / FORCE_RADIUS) * 0.28;
          ctx.strokeStyle = `rgba(${p.col[0]},${p.col[1]},${p.col[2]},${a})`;
          ctx.lineWidth = 0.6;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(pointer.x, pointer.y);
          ctx.stroke();
        }
      }
    }

    ctx.globalCompositeOperation = "source-over";
    raf = requestAnimationFrame(step);
  }

  function drawStatic() {
    // one frame, no motion (reduced-motion / paused)
    ctx.clearRect(0, 0, W, H);
    ctx.globalCompositeOperation = "lighter";
    for (const p of particles) {
      ctx.beginPath();
      ctx.fillStyle = `rgba(${p.col[0]},${p.col[1]},${p.col[2]},${p.alpha})`;
      ctx.arc(p.ox, p.oy, p.size, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalCompositeOperation = "source-over";
  }

  function start() {
    if (running || prefersReduced) return;
    running = true;
    raf = requestAnimationFrame(step);
  }
  function stop() {
    running = false;
    if (raf) cancelAnimationFrame(raf);
    raf = null;
  }

  // --- pointer events (listen on window so it works over the copy too) ---
  function onMove(e) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    // only "active" while pointer is within the hero area
    if (x >= -60 && x <= W + 60 && y >= -60 && y <= H + 60) {
      pointer.tx = x; pointer.ty = y; pointer.active = true;
    } else {
      pointer.active = false;
    }
  }
  function onLeave() { pointer.active = false; }

  // --- lifecycle ---
  resize();
  if (prefersReduced) {
    drawStatic();
    return; // no loops, no listeners beyond resize
  }

  window.addEventListener("pointermove", onMove, { passive: true });
  window.addEventListener("pointerout", onLeave, { passive: true });

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 200);
  });

  // Pause when hero is off-screen
  const io = new IntersectionObserver(
    (entries) => { entries[0].isIntersecting ? start() : stop(); },
    { threshold: 0.02 }
  );
  io.observe(canvas);

  // Pause when tab hidden
  document.addEventListener("visibilitychange", () => {
    document.hidden ? stop() : start();
  });

  start();
}
