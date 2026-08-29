/* ============================================================
   Project rope — a single glowing "light rope" (SVG) woven
   between the alternating project cards. The rope is generated
   from the cards' live layout positions, so it always connects
   the real anchors and re-fits on resize / mobile.

   As the section scrolls, a bright violet->cyan glow is revealed
   along the rope (stroke-dashoffset), igniting each card the
   moment the glow front passes its anchor node.

   Disabled to a static, fully-lit state under reduced-motion.
   ============================================================ */

const SVGNS = "http://www.w3.org/2000/svg";
const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

export function initProjectRope() {
  const container = document.querySelector(".projects-rope");
  if (!container) return;
  const cards = [...container.querySelectorAll(".project")];
  if (!cards.length) return;

  // --- Build the SVG scaffold (behind the cards) --------------------------
  const svg = document.createElementNS(SVGNS, "svg");
  svg.setAttribute("class", "rope-svg");
  svg.setAttribute("preserveAspectRatio", "none");
  svg.setAttribute("aria-hidden", "true");

  const defs = document.createElementNS(SVGNS, "defs");
  const grad = document.createElementNS(SVGNS, "linearGradient");
  grad.setAttribute("id", "ropeGrad");
  grad.setAttribute("x1", "0");
  grad.setAttribute("y1", "0");
  grad.setAttribute("x2", "0");
  grad.setAttribute("y2", "1");
  [
    ["0%", "#7c5cff"],
    ["50%", "#5b8dff"],
    ["100%", "#22d3ee"],
  ].forEach(([offset, color]) => {
    const stop = document.createElementNS(SVGNS, "stop");
    stop.setAttribute("offset", offset);
    stop.setAttribute("stop-color", color);
    grad.appendChild(stop);
  });
  defs.appendChild(grad);
  svg.appendChild(defs);

  const basePath = document.createElementNS(SVGNS, "path");
  basePath.setAttribute("class", "rope-base");
  const glowPath = document.createElementNS(SVGNS, "path");
  glowPath.setAttribute("class", "rope-glow");
  svg.appendChild(basePath);
  svg.appendChild(glowPath);

  const nodesGroup = document.createElementNS(SVGNS, "g");
  nodesGroup.setAttribute("class", "rope-nodes");
  const nodes = cards.map(() => {
    const c = document.createElementNS(SVGNS, "circle");
    c.setAttribute("class", "rope-node");
    c.setAttribute("r", "5");
    nodesGroup.appendChild(c);
    return c;
  });
  svg.appendChild(nodesGroup);

  // Small SVG-element helper for the wheel + label pieces below.
  const mk = (tag, attrs) => {
    const el = document.createElementNS(SVGNS, tag);
    for (const k in attrs) el.setAttribute(k, attrs[k]);
    return el;
  };

  // Terminal "more to come" label the wheel meets and mixes into at the end.
  const endLabel = mk("text", {
    class: "rope-end-label",
    "text-anchor": "middle",
    "dominant-baseline": "middle",
  });
  endLabel.textContent = "More to come";
  svg.appendChild(endLabel);

  // Ship's wheel that rides the glow's leading edge down the rope.
  const wheel = mk("g", { class: "rope-wheel" });
  const RIM = 12;
  wheel.appendChild(mk("circle", { class: "rw-rim", r: RIM }));
  const spokes = mk("g", { class: "rw-spokes" });
  const reach = RIM + 4;
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 3) * i;
    const dx = Math.cos(a);
    const dy = Math.sin(a);
    spokes.appendChild(
      mk("line", {
        x1: (dx * 2.5).toFixed(1),
        y1: (dy * 2.5).toFixed(1),
        x2: (dx * reach).toFixed(1),
        y2: (dy * reach).toFixed(1),
      })
    );
    spokes.appendChild(
      mk("circle", {
        class: "rw-handle",
        cx: (dx * reach).toFixed(1),
        cy: (dy * reach).toFixed(1),
        r: 2.1,
      })
    );
  }
  wheel.appendChild(spokes);
  wheel.appendChild(mk("circle", { class: "rw-hub", r: 3 }));
  svg.appendChild(wheel);

  container.prepend(svg);

  // --- Geometry -----------------------------------------------------------
  let ropeLen = 0;
  let fractions = []; // normalized path length at each card's anchor (0..1)
  let litState = cards.map(() => false);

  // Card position relative to the container, from the *layout* box
  // (offset*), so reveal translateY and the 3D tilt don't shift anchors.
  function anchorOf(card) {
    let x = 0, y = 0, node = card;
    while (node && node !== container) {
      x += node.offsetLeft;
      y += node.offsetTop;
      node = node.offsetParent;
    }
    const side = card.dataset.side === "right" ? "right" : "left";
    // On mobile the cards stack full-width, so run the rope straight down
    // their centre; on desktop it hooks onto each card's inner edge.
    const mobile = window.innerWidth <= 900;
    const cx = mobile ? x + card.offsetWidth / 2 : side === "left" ? x + card.offsetWidth : x;
    const cy = y + card.offsetHeight / 2;
    return { x: cx, y: cy };
  }

  function lengthAtY(targetY) {
    // y increases monotonically down the serpentine -> binary search.
    let lo = 0, hi = ropeLen;
    for (let k = 0; k < 22; k++) {
      const mid = (lo + hi) / 2;
      if (glowPath.getPointAtLength(mid).y < targetY) lo = mid;
      else hi = mid;
    }
    return (lo + hi) / 2;
  }

  function layout() {
    const W = container.offsetWidth;
    const H = container.offsetHeight;
    if (W < 2 || H < 2) return false;

    svg.setAttribute("viewBox", `0 0 ${W} ${H}`);

    const anchors = cards.map(anchorOf);
    const lastX = anchors[anchors.length - 1].x;
    const endY = H - 52; // where the rope line terminates (the wheel dissolves here)
    const labelY = endY + 34; // message sits below the line end with a clear gap
    // Enter from the top above the first card, leave in the tail below the last.
    const pts = [
      { x: anchors[0].x, y: 0 },
      ...anchors,
      { x: lastX, y: endY },
    ];

    // Smooth serpentine: vertical-tangent cubic between successive points.
    let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
    for (let i = 1; i < pts.length; i++) {
      const p0 = pts[i - 1];
      const p1 = pts[i];
      const dy = (p1.y - p0.y) * 0.5;
      d += ` C ${p0.x.toFixed(1)} ${(p0.y + dy).toFixed(1)}, ${p1.x.toFixed(1)} ${(p1.y - dy).toFixed(1)}, ${p1.x.toFixed(1)} ${p1.y.toFixed(1)}`;
    }
    basePath.setAttribute("d", d);
    glowPath.setAttribute("d", d);

    ropeLen = glowPath.getTotalLength();
    glowPath.style.strokeDasharray = `${ropeLen}`;

    // Place nodes + cache each anchor's fraction along the rope.
    fractions = anchors.map((a, i) => {
      nodes[i].setAttribute("cx", a.x.toFixed(1));
      nodes[i].setAttribute("cy", a.y.toFixed(1));
      return clamp(lengthAtY(a.y) / ropeLen, 0, 1);
    });

    // Sit the terminal label below the rope's end, with a gap between them.
    endLabel.setAttribute("x", lastX.toFixed(1));
    endLabel.setAttribute("y", labelY.toFixed(1));
    return true;
  }

  // --- Progress / render --------------------------------------------------
  function apply(progress) {
    glowPath.style.strokeDashoffset = `${ropeLen * (1 - progress)}`;
    for (let i = 0; i < cards.length; i++) {
      const lit = progress >= fractions[i] - 0.001;
      if (lit !== litState[i]) {
        litState[i] = lit;
        cards[i].classList.toggle("lit", lit);
        nodes[i].classList.toggle("lit", lit);
      }
    }

    // Ride the wheel on the glow's leading edge and roll it as it travels;
    // near the end it meets the "more to come" label and they mix/brighten.
    if (ropeLen) {
      const frontLen = ropeLen * progress;
      const p = glowPath.getPointAtLength(frontLen);
      const spin = frontLen * 0.6; // degrees — several turns down a long rope
      wheel.setAttribute(
        "transform",
        `translate(${p.x.toFixed(1)} ${p.y.toFixed(1)}) rotate(${spin.toFixed(1)})`
      );
      // Fade in as it sets off, then dissolve into the label at the very end
      // (and reappear when scrolling back up, since this tracks scroll both ways).
      const fadeIn = clamp(progress * 16, 0, 1);
      const fadeOut = clamp((1 - progress) / 0.06, 0, 1);
      wheel.style.opacity = Math.min(fadeIn, fadeOut).toFixed(2);
      wheel.classList.toggle("arrived", progress > 0.985);
      endLabel.classList.toggle("show", progress > 0.82);
      endLabel.classList.toggle("mix", progress > 0.985);
    }
  }

  function scrollProgress() {
    const r = container.getBoundingClientRect();
    const horizon = window.innerHeight * 0.6; // ignite line on screen
    return clamp((horizon - r.top) / r.height, 0, 1);
  }

  // --- Reduced motion: static, fully lit ----------------------------------
  if (prefersReduced) {
    if (layout()) apply(1);
    return;
  }

  // --- Live: rAF loop gated by visibility ---------------------------------
  let raf = 0;
  let running = false;
  function frame() {
    apply(scrollProgress());
    raf = requestAnimationFrame(frame);
  }
  function start() {
    if (running) return;
    running = true;
    raf = requestAnimationFrame(frame);
  }
  function stop() {
    running = false;
    cancelAnimationFrame(raf);
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => (e.isIntersecting ? start() : stop()));
    },
    { rootMargin: "20% 0px" }
  );
  io.observe(container);

  // --- Recompute on resize / late layout shifts ---------------------------
  let rt = 0;
  function relayout() {
    if (layout() && !running) apply(scrollProgress());
  }
  window.addEventListener("resize", () => {
    clearTimeout(rt);
    rt = setTimeout(relayout, 200);
  });

  // Refit whenever the stack changes height — e.g. a card expanding/collapsing
  // on click shifts every card below it, so the rope must re-anchor to them.
  if ("ResizeObserver" in window) {
    let scheduled = false;
    const ro = new ResizeObserver(() => {
      if (scheduled) return;
      scheduled = true;
      requestAnimationFrame(() => {
        scheduled = false;
        relayout();
      });
    });
    ro.observe(container);
  }

  window.addEventListener("load", relayout);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(relayout);

  // First build (retry next frame if the section isn't measurable yet).
  if (!layout()) requestAnimationFrame(relayout);
  else apply(scrollProgress());
}
