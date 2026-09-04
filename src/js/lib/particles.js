/* ============================================================
   Cosmic hero scene — pure canvas 2D
   A living slice of space: parallax starfield, a distant sun,
   ringed planets on slow orbits, drifting shooting stars, and a
   glowing crescent moon with a lone figure sitting and fishing.
   Reacts to the pointer (parallax + gentle dust repel + a line
   that sways toward the cursor). Paused off-screen / tab-hidden /
   reduced-motion.  Export signature unchanged: initParticles(canvas)
   ============================================================ */

const lerp = (a, b, t) => a + (b - a) * t;
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

// Palette (theme-aligned)
const STAR_TINTS = [
  [255, 255, 255],
  [206, 196, 255], // violet-white
  [190, 240, 255], // cyan-white
  [255, 236, 210], // warm-white
];
const MOON_LIGHT = [224, 232, 255];
const SILHOUETTE = "rgba(4, 5, 12, 0.94)";

export function initParticles(canvas) {
  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const ctx = canvas.getContext("2d", { alpha: true });
  if (!ctx) return;

  let W = 0, H = 0, dpr = 1;
  let stars = [];
  let planets = [];
  let shooters = [];
  let scene = {};
  let L = {};                // responsive layout (recomputed on resize)
  let moonSprite = null;
  let moonGlow = null;       // blurred crescent-shaped halo
  let t = 0;                 // frame time accumulator
  let raf = null, running = false;

  // Smoothed pointer, normalised to [-0.5, 0.5] around centre (for parallax)
  const ptr = { x: 0.5, y: 0.5, nx: 0, ny: 0, tnx: 0, tny: 0, px: -9999, py: -9999, active: false };

  /* ---------------- build ---------------- */

  // Pick a layout tier from the viewport width so every screen class — phone,
  // tablet, laptop, desktop, 4K — gets tuned placement, sizing and density.
  function computeLayout() {
    const min = Math.min(W, H);
    let tier;
    if (W < 560) tier = "xs";        // phones
    else if (W < 900) tier = "sm";   // large phones / small tablets
    else if (W < 1280) tier = "md";  // tablets landscape / small laptops
    else if (W < 1680) tier = "lg";  // laptops / desktops
    else tier = "xl";                // large & 4K monitors
    const narrow = tier === "xs" || tier === "sm";
    // how many planets to draw (keep small screens light & legible)
    const planetCount = tier === "xs" ? 1 : tier === "sm" ? 2 : 3;
    const starCap = { xs: 90, sm: 150, md: 210, lg: 270, xl: 330 }[tier];
    L = { tier, min, narrow, planetCount, starCap };
  }

  function starCount() {
    const area = W * H;
    const base = Math.round(area / (L.narrow ? 6800 : 5200));
    return Math.min(L.starCap, base);
  }

  function buildStars() {
    const n = starCount();
    stars = new Array(n).fill(0).map(() => {
      const depth = Math.pow(Math.random(), 1.6);        // 0 far … 1 near
      return {
        bx: Math.random() * W,
        by: Math.random() * H,
        r: lerp(0.4, 1.9, depth) * (Math.random() * 0.6 + 0.7),
        depth,
        tint: STAR_TINTS[(Math.random() * STAR_TINTS.length) | 0],
        base: lerp(0.15, 0.85, Math.random()),
        tw: Math.random() * Math.PI * 2,                 // twinkle phase
        twSpeed: lerp(0.006, 0.03, Math.random()),
        vx: 0, vy: 0,                                    // repel velocity
      };
    });
  }

  function buildPlanets() {
    const min = L.min;
    const narrow = L.narrow;
    // Weighted to the right / lower area so the left-side copy stays clear.
    const all = [
      {
        // Saturn-like ringed planet, hard against the lower-left edge (clear of the copy)
        ax: W * (narrow ? 0.12 : 0.05), ay: H * (narrow ? 0.86 : 0.86),
        orbitR: min * 0.02, orbitA: 0.6, orbitSpeed: 0.0016,
        r: clamp(min * 0.055, 20, 54),
        body: [124, 92, 255], ring: [34, 211, 238],
        ringTilt: -0.5, spin: 0, depth: 0.5, hasRing: true,
      },
      {
        // small teal orb, far right (near the moon)
        ax: W * (narrow ? 0.86 : 0.9), ay: H * (narrow ? 0.14 : 0.19),
        orbitR: min * 0.015, orbitA: 2.1, orbitSpeed: 0.0022,
        r: clamp(min * 0.03, 11, 30),
        body: [34, 211, 238], ring: [124, 92, 255],
        ringTilt: 0.7, spin: 0, depth: 0.7, hasRing: false,
        moon: true,
      },
      {
        // Jupiter — banded gas giant, centre-right lower
        ax: W * 0.6, ay: H * 0.74,
        orbitR: min * 0.016, orbitA: 4.0, orbitSpeed: 0.0011,
        r: clamp(min * 0.06, 26, 62),
        body: [216, 194, 162], ring: [124, 92, 255],
        ringTilt: 0.16, spin: 0, depth: 0.5, hasRing: false,
        bands: [
          [222, 206, 178], [188, 148, 108], [232, 216, 188],
          [172, 128, 94], [230, 210, 180], [196, 156, 116],
          [214, 200, 176], [182, 140, 102],
        ],
        spot: [0.28, 0.22, 0.16], // Great Red Spot: x, y, radius (× r)
      },
    ];
    // xs → Saturn only · sm → + teal orb · md+ → all three
    planets = all.slice(0, L.planetCount);
    // Mobile (phones / small tablets): drop the ringed Saturn to keep it clean.
    if (L.narrow) planets = planets.filter((p) => !p.hasRing);
  }

  function buildScene() {
    const min = L.min;
    const narrow = L.narrow;
    scene = {
      sun: {
        x: W * (narrow ? 0.14 : 0.05),
        y: H * (narrow ? 0.1 : 0.14),
        r: clamp(min * 0.05, 16, 46), depth: 0.25,
      },
      moon: {
        x: W * (narrow ? 0.74 : 0.8),
        y: H * (narrow ? 0.7 : 0.46),   // mobile: lower-right, clear of the top copy
        r: clamp(min * (narrow ? 0.15 : 0.17), 60, 190),
        depth: 0.85,
      },
    };
    buildMoonSprite();
    buildMoonGlow();
  }

  /* ---- crescent-shaped halo: a blurred copy of the crescent, so the glow
         hugs the moon instead of ringing the empty shadow side ---- */
  function buildMoonGlow() {
    const r = scene.moon.r;
    const blur = Math.max(6, r * 0.22);
    const pad = Math.ceil(r * 0.5 + blur * 3);
    const size = Math.ceil(r * 2 + pad * 2);
    const cx = size / 2, cy = size / 2;

    // sharp solid-colour crescent (same carve as the moon)
    const tmp = document.createElement("canvas");
    tmp.width = Math.ceil(size * dpr);
    tmp.height = Math.ceil(size * dpr);
    const tc = tmp.getContext("2d");
    tc.setTransform(dpr, 0, 0, dpr, 0, 0);
    tc.fillStyle = "rgba(150,175,255,1)";
    tc.beginPath(); tc.arc(cx, cy, r, 0, Math.PI * 2); tc.fill();
    tc.globalCompositeOperation = "destination-out";
    tc.fillStyle = "rgba(0,0,0,1)";
    tc.beginPath(); tc.arc(cx + r * 0.55, cy - r * 0.06, r, 0, Math.PI * 2); tc.fill();

    // blur it into the glow sprite
    const s = document.createElement("canvas");
    s.width = tmp.width; s.height = tmp.height;
    const c = s.getContext("2d");
    c.setTransform(dpr, 0, 0, dpr, 0, 0);
    c.filter = `blur(${blur}px)`;
    c.drawImage(tmp, 0, 0, size, size);
    c.filter = "none";

    moonGlow = { canvas: s, cssSize: size, half: size / 2 };
  }

  /* ---- crescent moon + fisherman baked to an offscreen sprite ---- */
  function buildMoonSprite() {
    const r = scene.moon.r;
    const pad = Math.ceil(r * 0.55);          // room for the seat / rod handle
    const size = Math.ceil((r * 2 + pad * 2));
    const cx = size / 2, cy = size / 2;

    const s = document.createElement("canvas");
    s.width = Math.ceil(size * dpr);
    s.height = Math.ceil(size * dpr);
    const c = s.getContext("2d");
    c.setTransform(dpr, 0, 0, dpr, 0, 0);

    // 1) lit disc (light from upper-left — fat side is on the left)
    const g = c.createRadialGradient(cx - r * 0.3, cy - r * 0.35, r * 0.15, cx, cy, r * 1.02);
    g.addColorStop(0, "rgba(244,247,255,1)");
    g.addColorStop(0.6, `rgba(${MOON_LIGHT[0]},${MOON_LIGHT[1]},${MOON_LIGHT[2]},0.95)`);
    g.addColorStop(1, "rgba(150,170,230,0.7)");
    c.fillStyle = g;
    c.beginPath();
    c.arc(cx, cy, r, 0, Math.PI * 2);
    c.fill();

    // 3 shaded craters on the lit crescent (light comes from the upper-left):
    // recessed floor + bright rim on the light side + shadow rim opposite.
    const craters = [[-0.46, 0.34, 0.16], [-0.56, -0.12, 0.12], [-0.70, 0.14, 0.08]];
    for (const [dx, dy, cr] of craters) {
      const gx = cx + dx * r, gy = cy + dy * r, rad = cr * r;
      // floor
      const cg = c.createRadialGradient(gx - rad * 0.3, gy - rad * 0.3, rad * 0.1, gx, gy, rad);
      cg.addColorStop(0, "rgba(86,100,150,0.30)");
      cg.addColorStop(0.7, "rgba(70,84,128,0.24)");
      cg.addColorStop(1, "rgba(120,140,200,0)");
      c.fillStyle = cg;
      c.beginPath(); c.arc(gx, gy, rad, 0, Math.PI * 2); c.fill();
      // shadow rim (lower-right)
      c.strokeStyle = "rgba(38,46,84,0.32)";
      c.lineWidth = rad * 0.16;
      c.beginPath(); c.arc(gx, gy, rad * 0.9, -0.1, Math.PI * 0.75); c.stroke();
      // bright rim (upper-left, catches the light)
      c.strokeStyle = "rgba(240,245,255,0.38)";
      c.lineWidth = rad * 0.14;
      c.beginPath(); c.arc(gx, gy, rad * 0.9, Math.PI * 0.9, Math.PI * 1.7); c.stroke();
    }

    // 2) carve the crescent — an equal-radius disc offset to the right leaves a
    //    "C" opening right (fat on the left).
    //    NB: destination-out erases by the fill's alpha, so force fully opaque.
    c.globalCompositeOperation = "destination-out";
    c.fillStyle = "rgba(0,0,0,1)";
    c.beginPath();
    c.arc(cx + r * 0.55, cy - r * 0.06, r, 0, Math.PI * 2);
    c.fill();
    c.globalCompositeOperation = "source-over";

    moonSprite = { canvas: s, cssSize: size, half: size / 2 };
  }

  /* ---------------- sizing ---------------- */
  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    const rect = canvas.getBoundingClientRect();
    W = rect.width; H = rect.height;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    computeLayout();
    buildStars();
    buildPlanets();
    buildScene();
  }

  /* ---------------- draw helpers ---------------- */

  function drawSun() {
    const p = scene.sun;
    const x = p.x + ptr.nx * 10 * p.depth;
    const y = p.y + ptr.ny * 8 * p.depth;
    const pulse = 1 + Math.sin(t * 0.02) * 0.06;
    const R = p.r * pulse;

    ctx.globalCompositeOperation = "lighter";
    // corona
    const halo = ctx.createRadialGradient(x, y, R * 0.2, x, y, R * 5);
    halo.addColorStop(0, "rgba(255,196,120,0.5)");
    halo.addColorStop(0.25, "rgba(255,140,90,0.18)");
    halo.addColorStop(1, "rgba(255,120,80,0)");
    ctx.fillStyle = halo;
    ctx.beginPath(); ctx.arc(x, y, R * 5, 0, Math.PI * 2); ctx.fill();
    // core
    const core = ctx.createRadialGradient(x, y, 0, x, y, R);
    core.addColorStop(0, "rgba(255,247,235,1)");
    core.addColorStop(0.6, "rgba(255,205,140,0.95)");
    core.addColorStop(1, "rgba(255,160,100,0.2)");
    ctx.fillStyle = core;
    ctx.beginPath(); ctx.arc(x, y, R, 0, Math.PI * 2); ctx.fill();
    ctx.globalCompositeOperation = "source-over";
  }

  function drawStars() {
    ctx.globalCompositeOperation = "lighter";
    const repelR = 130, repelR2 = repelR * repelR;
    for (const st of stars) {
      st.tw += st.twSpeed;
      const tw = 0.55 + 0.45 * Math.sin(st.tw);

      // parallax by depth
      let x = st.bx + ptr.nx * 42 * st.depth;
      let y = st.by + ptr.ny * 30 * st.depth;

      // gentle dust repel near the cursor
      if (ptr.active) {
        const dx = st.bx - ptr.px, dy = st.by - ptr.py;
        const d2 = dx * dx + dy * dy;
        if (d2 < repelR2) {
          const d = Math.sqrt(d2) || 1;
          const f = (1 - d / repelR) * 6;
          st.vx += (dx / d) * f * 0.05;
          st.vy += (dy / d) * f * 0.05;
        }
      }
      st.vx *= 0.86; st.vy *= 0.86;
      x += st.vx; y += st.vy;

      const a = st.base * tw;
      ctx.fillStyle = `rgba(${st.tint[0]},${st.tint[1]},${st.tint[2]},${a})`;
      ctx.beginPath();
      ctx.arc(x, y, st.r, 0, Math.PI * 2);
      ctx.fill();

      // sparkle cross for the brightest, nearest stars
      if (st.r > 1.5 && a > 0.7) {
        ctx.strokeStyle = `rgba(${st.tint[0]},${st.tint[1]},${st.tint[2]},${a * 0.5})`;
        ctx.lineWidth = 0.6;
        const g = st.r * 2.4;
        ctx.beginPath();
        ctx.moveTo(x - g, y); ctx.lineTo(x + g, y);
        ctx.moveTo(x, y - g); ctx.lineTo(x, y + g);
        ctx.stroke();
      }
    }
    ctx.globalCompositeOperation = "source-over";
  }

  function drawPlanet(pl) {
    pl.orbitA += pl.orbitSpeed;
    const x = pl.ax + Math.cos(pl.orbitA) * pl.orbitR + ptr.nx * 22 * pl.depth;
    const y = pl.ay + Math.sin(pl.orbitA) * pl.orbitR + ptr.ny * 16 * pl.depth;
    const r = pl.r;

    ctx.save();
    ctx.translate(x, y);
    ctx.rotate(pl.ringTilt);

    const ringCol = pl.ring;
    if (pl.hasRing) {
      // back half of the ring
      ctx.strokeStyle = `rgba(${ringCol[0]},${ringCol[1]},${ringCol[2]},0.28)`;
      ctx.lineWidth = r * 0.34;
      ctx.beginPath();
      ctx.ellipse(0, 0, r * 1.95, r * 0.6, 0, Math.PI, Math.PI * 2);
      ctx.stroke();
    }

    // body with a lit terminator
    const g = ctx.createRadialGradient(-r * 0.4, -r * 0.4, r * 0.15, 0, 0, r);
    g.addColorStop(0, `rgba(${pl.body[0]},${pl.body[1]},${pl.body[2]},1)`);
    g.addColorStop(0.7, `rgba(${pl.body[0]},${pl.body[1]},${pl.body[2]},0.85)`);
    g.addColorStop(1, "rgba(10,10,25,0.9)");
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fill();

    // banded gas-giant surface (Jupiter): horizontal belts + Great Red Spot,
    // shaded into a sphere.
    if (pl.bands) {
      ctx.save();
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.clip();
      const n = pl.bands.length;
      for (let i = 0; i < n; i++) {
        const y0 = -r + (2 * r) * (i / n);
        const b = pl.bands[i];
        ctx.fillStyle = `rgba(${b[0]},${b[1]},${b[2]},0.92)`;
        ctx.fillRect(-r, y0, 2 * r, (2 * r) / n + 0.6);
      }
      // Great Red Spot
      if (pl.spot) {
        const sx = pl.spot[0] * r, sy = pl.spot[1] * r, sr = pl.spot[2] * r;
        const sg = ctx.createRadialGradient(sx, sy, 0, sx, sy, sr);
        sg.addColorStop(0, "rgba(206,96,72,0.95)");
        sg.addColorStop(0.6, "rgba(184,80,60,0.7)");
        sg.addColorStop(1, "rgba(184,80,60,0)");
        ctx.fillStyle = sg;
        ctx.beginPath();
        ctx.ellipse(sx, sy, sr * 1.35, sr * 0.85, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      // spherical shading: highlight upper-left, dark terminator lower-right
      const sh = ctx.createRadialGradient(-r * 0.35, -r * 0.4, r * 0.2, 0, 0, r);
      sh.addColorStop(0, "rgba(255,250,240,0.14)");
      sh.addColorStop(0.6, "rgba(0,0,0,0)");
      sh.addColorStop(1, "rgba(6,8,20,0.9)");
      ctx.fillStyle = sh;
      ctx.beginPath();
      ctx.arc(0, 0, r, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }

    // soft rim light
    ctx.strokeStyle = `rgba(${ringCol[0]},${ringCol[1]},${ringCol[2]},0.35)`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(0, 0, r, -0.4, 1.8);
    ctx.stroke();

    if (pl.hasRing) {
      // front half of the ring
      ctx.strokeStyle = `rgba(${ringCol[0]},${ringCol[1]},${ringCol[2]},0.5)`;
      ctx.lineWidth = r * 0.34;
      ctx.beginPath();
      ctx.ellipse(0, 0, r * 1.95, r * 0.6, 0, 0, Math.PI);
      ctx.stroke();
    }
    ctx.restore();

    // a tiny orbiting moon for the small planet
    if (pl.moon) {
      const ma = pl.orbitA * 3.2;
      const mx = x + Math.cos(ma) * r * 2.1;
      const my = y + Math.sin(ma) * r * 0.9;
      ctx.fillStyle = "rgba(210,220,255,0.9)";
      ctx.beginPath();
      ctx.arc(mx, my, Math.max(1.6, r * 0.16), 0, Math.PI * 2);
      ctx.fill();
    }
  }

  function drawMoon() {
    const m = scene.moon;
    const x = m.x + ptr.nx * 16 * m.depth;
    const y = m.y + ptr.ny * 12 * m.depth;

    // crescent-shaped halo — a blurred copy of the crescent, so the glow hugs
    // the moon and fades to nothing on the empty shadow side.
    if (moonGlow) {
      const breathe = 0.85 + Math.sin(t * 0.015) * 0.12;
      ctx.globalCompositeOperation = "lighter";
      // wide soft aura (scaled up)
      ctx.globalAlpha = 0.62 * breathe;
      const wide = moonGlow.cssSize * 1.4;
      ctx.drawImage(moonGlow.canvas, x - wide / 2, y - wide / 2, wide, wide);
      // tight bright glow
      ctx.globalAlpha = 1.0 * breathe;
      ctx.drawImage(moonGlow.canvas, x - moonGlow.half, y - moonGlow.half, moonGlow.cssSize, moonGlow.cssSize);
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = "source-over";
    }

    // crescent moon sprite
    if (moonSprite) {
      const half = moonSprite.half;
      ctx.drawImage(moonSprite.canvas, x - half, y - half, moonSprite.cssSize, moonSprite.cssSize);
    }

    // the capped fisherman, seated on the crescent, facing right
    drawFisherman(x, y, m.r);
  }

  /* ---- lone fisherman: a capped man in profile, facing right, perched on the
         lower-left EDGE of the crescent with his legs dangling over. Both arms
         reach forward to a rod that angles up-right; the line drops straight
         down into cyan water waves below. Graded into the theme — a violet body
         with a cyan glow — so it reads over both the bright crescent and the
         dark opening. Coords are in moon-radius units from the moon centre
         (X right, Y down); scales at every resolution. ---- */
  function drawFisherman(cx, cy, r) {
    const X = (dx) => cx + (dx + 0.68) * r;  // nudge the whole figure right
    const Y = (dy) => cy + (dy + 0.24) * r + 1;  // nudge down (+1px)
    const GLOW = "rgba(34,211,238,0.34)";   // cyan halo
    const ROD = "rgba(214,184,142,0.96)";   // warm rod tone

    ctx.save();
    ctx.lineJoin = "round";
    ctx.lineCap = "round";

    // graded body: cyan-cool at the top, deep violet at the bottom — used for
    // every core stroke/fill so the whole figure reads as one cohesive shape.
    const CORE = ctx.createLinearGradient(X(-0.5), Y(-0.45), X(0.1), Y(1.0));
    CORE.addColorStop(0, "rgba(120,210,245,0.97)");
    CORE.addColorStop(0.45, "rgba(148,118,252,0.97)");
    CORE.addColorStop(1, "rgba(116,78,226,0.97)");

    // a limb = a polyline stroked wide-and-soft (cyan glow) then the graded core
    function limb(pts, w) {
      ctx.beginPath();
      ctx.moveTo(X(pts[0][0]), Y(pts[0][1]));
      for (let i = 1; i < pts.length; i++) ctx.lineTo(X(pts[i][0]), Y(pts[i][1]));
      ctx.strokeStyle = GLOW;
      ctx.lineWidth = Math.max(4, r * (w + 0.05));
      ctx.stroke();
      ctx.strokeStyle = CORE;
      ctx.lineWidth = Math.max(2, r * w);
      ctx.stroke();
    }

    // far leg + foot (behind) — dangling over the edge
    limb([[-0.54, 0.50], [-0.14, 0.60], [-0.18, 0.94]], 0.10);  // far leg
    limb([[-0.18, 0.94], [-0.05, 0.98]], 0.07);                 // far foot

    // far arm (behind), reaching to the grip
    limb([[-0.30, 0.06], [-0.08, 0.12], [0.14, 0.15]], 0.075);

    // torso (seated, leaning slightly forward: hip → shoulder)
    limb([[-0.52, 0.50], [-0.30, 0.04]], 0.20);

    // near leg + foot (in front) — dangling over the edge
    limb([[-0.50, 0.50], [-0.06, 0.56], [-0.08, 0.92]], 0.11);  // near leg
    limb([[-0.08, 0.92], [0.07, 0.95]], 0.08);                  // near foot

    // near arm, reaching to the grip
    limb([[-0.30, 0.04], [-0.08, 0.16], [0.14, 0.20]], 0.09);
    // neck
    limb([[-0.30, 0.02], [-0.22, -0.10]], 0.11);

    // hands gripping the rod
    ctx.beginPath(); ctx.arc(X(0.15), Y(0.18), 0.06 * r, 0, Math.PI * 2);
    ctx.fillStyle = GLOW; ctx.fill();
    ctx.beginPath(); ctx.arc(X(0.15), Y(0.18), 0.045 * r, 0, Math.PI * 2);
    ctx.fillStyle = CORE; ctx.fill();

    // head — glow halo, graded disc, then a small right-facing nose profile
    const hx = -0.17, hy = -0.20, hr = 0.145 * r;
    ctx.beginPath(); ctx.arc(X(hx), Y(hy), hr + Math.max(2, r * 0.04), 0, Math.PI * 2);
    ctx.fillStyle = GLOW; ctx.fill();
    ctx.fillStyle = CORE;
    ctx.beginPath(); ctx.arc(X(hx), Y(hy), hr, 0, Math.PI * 2); ctx.fill();
    ctx.beginPath();                                   // nose (profile points right)
    ctx.moveTo(X(hx + 0.10), Y(hy - 0.02));
    ctx.lineTo(X(hx + 0.19), Y(hy + 0.03));
    ctx.lineTo(X(hx + 0.09), Y(hy + 0.07));
    ctx.closePath(); ctx.fill();

    // baseball cap — crown dome, brim pointing right (forward), top button
    ctx.beginPath();
    ctx.arc(X(-0.18), Y(-0.23), 0.175 * r, Math.PI * 0.82, Math.PI * 2.02);
    ctx.closePath(); ctx.fill();
    ctx.beginPath();
    ctx.moveTo(X(-0.08), Y(-0.29));
    ctx.lineTo(X(0.28), Y(-0.32));
    ctx.lineTo(X(0.28), Y(-0.27));
    ctx.lineTo(X(-0.06), Y(-0.23));
    ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.arc(X(-0.19), Y(-0.375), 0.028 * r, 0, Math.PI * 2); ctx.fill();

    // rod — warm tone, curving up to the right
    ctx.beginPath();
    ctx.moveTo(X(0.14), Y(0.22));
    ctx.quadraticCurveTo(X(0.52), Y(-0.26), X(0.80), Y(-0.62));
    ctx.strokeStyle = GLOW;
    ctx.lineWidth = Math.max(3, r * 0.05); ctx.stroke();
    ctx.strokeStyle = ROD;
    ctx.lineWidth = Math.max(1.4, r * 0.022); ctx.stroke();
    // line guides along the rod + a defined tip
    ctx.lineWidth = Math.max(1, r * 0.012);
    for (const [gx, gy, gr] of [[0.43, -0.14, 0.028], [0.62, -0.39, 0.024], [0.80, -0.62, 0.03]]) {
      ctx.beginPath(); ctx.arc(X(gx), Y(gy), gr * r, 0, Math.PI * 2); ctx.stroke();
    }
    // reel at the grip
    ctx.beginPath(); ctx.arc(X(0.12), Y(0.25), 0.05 * r, 0, Math.PI * 2);
    ctx.fillStyle = CORE; ctx.fill();

    // fishing line straight down from the rod tip to the water
    ctx.beginPath();
    ctx.moveTo(X(0.80), Y(-0.62));
    ctx.lineTo(X(0.81), Y(1.00));
    ctx.strokeStyle = "rgba(220,235,255,0.55)";
    ctx.lineWidth = Math.max(1, r * 0.01); ctx.stroke();

    // water — soft entry ripple, a bright glint, and two wavy cyan lines
    ctx.beginPath(); ctx.arc(X(0.81), Y(1.03), 0.12 * r, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(90,210,240,0.14)"; ctx.fill();
    ctx.strokeStyle = "rgba(200,240,255,0.35)";
    ctx.lineWidth = Math.max(1, r * 0.012);
    ctx.beginPath(); ctx.moveTo(X(0.66), Y(1.02)); ctx.lineTo(X(0.98), Y(1.02)); ctx.stroke();
    ctx.strokeStyle = "rgba(90,210,240,0.6)";
    ctx.lineWidth = Math.max(1.4, r * 0.02);
    for (let row = 0; row < 2; row++) {
      const wy = 1.02 + row * 0.11;
      ctx.beginPath();
      ctx.moveTo(X(0.30), Y(wy));
      const amp = 0.045, seg = 0.14;
      let k = 0;
      for (let wx = 0.30; wx < 1.15; wx += seg) {
        const dir = (k % 2 === 0) ? -1 : 1;
        ctx.quadraticCurveTo(X(wx + seg / 2), Y(wy + dir * amp), X(wx + seg), Y(wy));
        k++;
      }
      ctx.stroke();
    }

    ctx.restore();
  }

  /* ---- shooting stars ---- */
  function maybeSpawnShooter() {
    if (shooters.length > 2) return;
    if (Math.random() > 0.008) return;
    const fromLeft = Math.random() > 0.5;
    const y = Math.random() * H * 0.5;
    shooters.push({
      x: fromLeft ? -40 : W + 40,
      y,
      vx: (fromLeft ? 1 : -1) * lerp(7, 12, Math.random()),
      vy: lerp(2.5, 5, Math.random()),
      life: 1,
    });
  }
  function drawShooters() {
    ctx.globalCompositeOperation = "lighter";
    for (let i = shooters.length - 1; i >= 0; i--) {
      const s = shooters[i];
      s.x += s.vx; s.y += s.vy; s.life -= 0.012;
      if (s.life <= 0 || s.x < -80 || s.x > W + 80 || s.y > H + 80) {
        shooters.splice(i, 1);
        continue;
      }
      const tailX = s.x - s.vx * 6, tailY = s.y - s.vy * 6;
      const grad = ctx.createLinearGradient(s.x, s.y, tailX, tailY);
      grad.addColorStop(0, `rgba(200,230,255,${0.9 * s.life})`);
      grad.addColorStop(1, "rgba(200,230,255,0)");
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.6;
      ctx.beginPath(); ctx.moveTo(s.x, s.y); ctx.lineTo(tailX, tailY); ctx.stroke();
    }
    ctx.globalCompositeOperation = "source-over";
  }

  /* ---------------- loop ---------------- */
  function step() {
    t += 1;
    // ease parallax pointer
    ptr.nx += (ptr.tnx - ptr.nx) * 0.06;
    ptr.ny += (ptr.tny - ptr.ny) * 0.06;

    ctx.clearRect(0, 0, W, H);

    drawSun();
    drawStars();
    // planets behind the moon
    for (const pl of planets) drawPlanet(pl);
    drawMoon();
    maybeSpawnShooter();
    drawShooters();

    raf = requestAnimationFrame(step);
  }

  function drawStatic() {
    ptr.nx = 0; ptr.ny = 0; ptr.active = false;
    ctx.clearRect(0, 0, W, H);
    drawSun();
    // stars at rest
    ctx.globalCompositeOperation = "lighter";
    for (const st of stars) {
      ctx.fillStyle = `rgba(${st.tint[0]},${st.tint[1]},${st.tint[2]},${st.base})`;
      ctx.beginPath(); ctx.arc(st.bx, st.by, st.r, 0, Math.PI * 2); ctx.fill();
    }
    ctx.globalCompositeOperation = "source-over";
    for (const pl of planets) drawPlanet(pl);
    drawMoon();
  }

  /* ---------------- lifecycle ---------------- */
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

  function onMove(e) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    ptr.tnx = clamp((x / W) - 0.5, -0.6, 0.6);
    ptr.tny = clamp((y / H) - 0.5, -0.6, 0.6);
    if (x >= -80 && x <= W + 80 && y >= -80 && y <= H + 80) {
      ptr.px = x; ptr.py = y; ptr.active = true;
    } else {
      ptr.active = false;
    }
  }
  function onLeave() { ptr.active = false; }

  resize();
  if (prefersReduced) {
    drawStatic();
    return;
  }

  window.addEventListener("pointermove", onMove, { passive: true });
  window.addEventListener("pointerout", onLeave, { passive: true });

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(resize, 200);
  });

  const io = new IntersectionObserver(
    (entries) => { entries[0].isIntersecting ? start() : stop(); },
    { threshold: 0.02 }
  );
  io.observe(canvas);

  document.addEventListener("visibilitychange", () => {
    document.hidden ? stop() : start();
  });

  start();
}
