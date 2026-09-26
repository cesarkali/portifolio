/* ═══════════════════════════════════════════════════════════════════
   CALIBERDA · 404 · o "404" desenhado com os pontinhos do retrato
   Os pontos chegam espalhados (se perderam no caminho), se montam no
   número e fogem do mouse/toque, com a mesma física de molas do hero.
   ═══════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  const canvas = document.getElementById('dots404');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const root = document.documentElement;
  const noMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));

  let W = 0, H = 0, dpr = 1, sp = 7, maxR = 4, dots = [], pointer = null, colors = null;
  let awake = true, motion = 0, t = 0, visible = true;

  function readColors() {
    const cs = getComputedStyle(root);
    colors = { ink: cs.getPropertyValue('--ink').trim(), accent: cs.getPropertyValue('--accent').trim() };
  }

  function build() {
    const r = canvas.getBoundingClientRect();
    W = Math.round(r.width); H = Math.round(r.height);
    if (!W || !H) return;
    dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
    sp = clamp(W / 90, 4, 8);
    maxR = sp * 0.6;
    const cols = Math.floor(W / sp), rows = Math.floor(H / sp);

    // 1) desenha o "404" grande numa tela de rascunho e mede o contorno REAL
    //    pelos pixels (a largura informada pela fonte não inclui o que vaza
    //    do glifo, e era isso que cortava o primeiro 4)
    const big = document.createElement('canvas');
    big.width = 1400; big.height = 700;
    const g = big.getContext('2d', { willReadFrequently: true });
    g.fillStyle = '#fff'; g.textAlign = 'center'; g.textBaseline = 'middle';
    g.font = '800 520px "Archivo", system-ui, sans-serif';
    if ('fontStretch' in g) g.fontStretch = 'condensed';
    g.fillText('404', 700, 350);
    const bd = g.getImageData(0, 0, 1400, 700).data;
    let x0 = 1400, x1 = 0, y0 = 700, y1 = 0;
    for (let y = 0; y < 700; y += 2) {
      for (let x = 0; x < 1400; x += 2) {
        if (bd[(y * 1400 + x) * 4 + 3] > 40) { if (x < x0) x0 = x; if (x > x1) x1 = x; if (y < y0) y0 = y; if (y > y1) y1 = y; }
      }
    }
    // 2) encaixa esse contorno na grade de pontos, centralizado e com margem
    const off = document.createElement('canvas');
    off.width = cols; off.height = rows;
    const o = off.getContext('2d', { willReadFrequently: true });
    const bw = Math.max(1, x1 - x0 + 2), bh = Math.max(1, y1 - y0 + 2);
    const k = Math.min((cols * 0.94) / bw, (rows * 0.94) / bh);
    const dw = bw * k, dh = bh * k;
    o.imageSmoothingQuality = 'high';
    o.drawImage(big, x0, y0, bw, bh, (cols - dw) / 2, (rows - dh) / 2, dw, dh);
    const data = o.getImageData(0, 0, cols, rows).data;

    const ox = (W - cols * sp) / 2 + sp / 2, oy = (H - rows * sp) / 2 + sp / 2;
    dots = [];
    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const a = data[(y * cols + x) * 4 + 3] / 255;
        if (a < 0.12) continue;
        const hx = ox + x * sp, hy = oy + y * sp;
        const d = { hx, hy, x: hx, y: hy, vx: 0, vy: 0, a, ph: Math.random() * 6.28 };
        if (!noMotion) { d.x = Math.random() * W; d.y = Math.random() * H; }
        dots.push(d);
      }
    }
    awake = true; t = 0;
    render(0);
  }

  function render(dt) {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    const K = 34, damp = Math.pow(0.84, dt * 60), R = 90, R2 = R * R, F = 6000;
    const ink = new Path2D(), hot = new Path2D();
    motion = 0;
    for (let i = 0; i < dots.length; i++) {
      const d = dots[i];
      if (dt > 0) {
        // os pontos chegam em ondas, da esquerda para a direita
        const k = t < 0.2 + (d.hx / W) * 0.9 ? 0 : K;
        let ax = (d.hx - d.x) * k, ay = (d.hy - d.y) * k;
        if (k === 0) { ax = Math.sin(t * 2 + d.ph) * 30; ay = Math.cos(t * 1.7 + d.ph) * 30; }
        if (pointer) {
          const dx = d.x - pointer.x, dy = d.y - pointer.y, q = dx * dx + dy * dy;
          if (q < R2 && q > 0.01) { const dist = Math.sqrt(q), f = 1 - dist / R; ax += dx / dist * f * f * F; ay += dy / dist * f * f * F; }
        }
        d.vx = (d.vx + ax * dt) * damp; d.vy = (d.vy + ay * dt) * damp;
        d.x += d.vx * dt; d.y += d.vy * dt;
        const mv = Math.abs(d.vx) + Math.abs(d.vy) + Math.abs(d.x - d.hx) + Math.abs(d.y - d.hy);
        if (mv > motion) motion = mv;
      }
      const r = maxR * (0.35 + 0.65 * d.a);
      const p = Math.abs(d.x - d.hx) + Math.abs(d.y - d.hy) > 3 ? hot : ink;
      p.moveTo(d.x + r, d.y); p.arc(d.x, d.y, r, 0, 6.2832);
    }
    ctx.fillStyle = colors.ink; ctx.fill(ink);
    ctx.fillStyle = colors.accent; ctx.fill(hot);
  }

  let last = performance.now();
  function loop(now) {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    if (visible && !noMotion && (awake || pointer)) {
      t += dt;
      render(dt);
      if (!pointer && t > 2 && motion < 0.05) awake = false; // parado: não redesenha
    }
    requestAnimationFrame(loop);
  }

  const local = (e) => { const r = canvas.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };
  canvas.addEventListener('pointermove', (e) => { if (e.pointerType !== 'touch') { pointer = local(e); awake = true; } }, { passive: true });
  canvas.addEventListener('pointerleave', () => { pointer = null; });
  canvas.addEventListener('pointerdown', (e) => {
    const at = local(e);
    dots.forEach((d) => {
      const dx = d.x - at.x, dy = d.y - at.y, dist = Math.hypot(dx, dy);
      if (dist < 110 && dist > 0.01) { const f = (1 - dist / 110) * 800; d.vx += dx / dist * f; d.vy += dy / dist * f; }
    });
    awake = true;
  }, { passive: true });

  if ('IntersectionObserver' in window) new IntersectionObserver((es) => { visible = es[0].isIntersecting; }).observe(canvas);
  // troca de tema: recolore na hora
  new MutationObserver(() => { readColors(); render(0); }).observe(root, { attributes: true, attributeFilter: ['data-theme'] });
  let rt = null;
  addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(build, 150); }, { passive: true });

  readColors();
  (document.fonts && document.fonts.ready ? document.fonts.ready : Promise.resolve()).then(() => {
    build();
    requestAnimationFrame(loop);
  });
})();
