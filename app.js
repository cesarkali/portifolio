/* ═══════════════════════════════════════════════════════════════════
   JÚLIO CALIBERDA · PORTFÓLIO · motor de interações
   Vanilla JS, um único requestAnimationFrame para tudo:
   · loader: a porcentagem é desenhada com os mesmos pontinhos do hero;
   · hero: os pontinhos pousam e formam o meu retrato em meio-tom;
   · voo: ao rolar, os pontinhos voam até o menu (mini-retrato);
   · índice de projetos com palco no tema de cada produto, filtros e
     detalhes; linha do tempo; tema com View Transitions; Lenis.
   ═══════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  const root = document.documentElement;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const ease = (x) => 1 - Math.pow(1 - clamp(x), 3);
  const noMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const THEME_KEY = 'caliberda-pf-theme';
  const TAU = Math.PI * 2;
  let speed = 1; // acelerado pelo easter egg
  let lenis = null;
  const barH = () => ($('#bar') ? $('#bar').offsetHeight : 64);

  const DATA = window.PORTFOLIO || { CATEGORIES: {}, PROJECTS: [] };
  const PROJECTS = DATA.PROJECTS, CATS = DATA.CATEGORIES;
  const byId = {};
  PROJECTS.forEach((p) => { byId[p.id] = p; });
  const host = (u) => (u ? u.replace(/^https?:\/\//, '').replace(/^www\./, '').replace(/\/$/, '') : '');
  const MONTHS = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
  const fmtMonth = (iso) => { const [y, m] = iso.split('-'); return MONTHS[+m - 1] + ' ' + y; };
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const ACC = { á: 'a', à: 'a', â: 'a', ã: 'a', é: 'e', ê: 'e', í: 'i', ó: 'o', ô: 'o', õ: 'o', ú: 'u', ü: 'u', ç: 'c' };
  const norm = (s) => String(s || '').toLowerCase().replace(/[áàâãéêíóôõúüç]/g, (c) => ACC[c]);
  const ARROW = '<svg class="cta-arrow" viewBox="0 0 24 24" aria-hidden="true"><path d="M7 17 17 7M8 7h9v9" /></svg>';

  /* ── PALETA LIDA DO CSS (compartilhada com os canvases) ─────────── */
  function hexToRgb(hex) {
    hex = hex.trim().replace('#', '');
    if (hex.length === 3) hex = hex.split('').map((c) => c + c).join('');
    const n = parseInt(hex, 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }
  function readColors(el) {
    const cs = getComputedStyle(el || root);
    const raw = {};
    ['ink', 'bg', 'accent', 'muted'].forEach((k) => { raw[k] = hexToRgb(cs.getPropertyValue('--' + k) || '#000'); });
    const css = (c) => 'rgb(' + c.join(',') + ')';
    return {
      ink: css(raw.ink), bg: css(raw.bg), accent: css(raw.accent), muted: css(raw.muted),
      rgba: (k, a) => 'rgba(' + raw[k].join(',') + ',' + clamp(a).toFixed(3) + ')',
      mix: (k, a) => css(raw.bg.map((b, i) => Math.round(b + (raw[k][i] - b) * a)))
    };
  }
  let C = readColors();

  /* ── PROJETOS: monta as linhas do índice ────────────────────────── */
  const rowsEl = $('#rows');
  function rowHtml(p) {
    const cat = CATS[p.category] || '';
    const live = !!p.deploy;
    const links = [];
    if (p.deploy) links.push('<a class="cta cta-main" href="' + p.deploy + '" target="_blank" rel="noopener"><span class="cta-label">Abrir ' + esc(host(p.deploy)) + '</span>' + ARROW + '</a>');
    if (p.repoSlug) links.push('<a class="cta" href="https://github.com/cesarkali/' + p.repoSlug + '" target="_blank" rel="noopener"><span class="cta-label">Ver no GitHub</span>' + ARROW + '</a>');
    else links.push('<span class="cta is-off"><span class="cta-label">Repositório privado</span></span>');
    const status = (live ? 'No ar' : 'Ainda não publicado') + ', código ' + (p.visibility === 'public' ? 'aberto' : 'privado');
    return '<li class="row" id="p-' + p.id + '" data-id="' + p.id + '">' +
      '<button class="row-head" type="button" aria-expanded="false" aria-controls="det-' + p.id + '">' +
      '<canvas class="row-glyph" data-gen="' + p.gen + '"' + (p.p ? ' data-p="' + p.p + '"' : '') + ' aria-hidden="true"></canvas>' +
      '<span class="row-main">' +
      '<span class="row-name">' + esc(p.name) + '</span>' +
      '<span class="row-sub">' + esc(p.sub || cat) + '</span>' +
      '<span class="row-desc">' + esc(p.desc) + '</span>' +
      '<span class="row-tags">' + p.tags.map(esc).join(' · ') + '</span>' +
      '</span>' +
      '<span class="row-side"><span>' + esc(cat) + '</span><span>' + fmtMonth(p.created) + '</span><span' + (live ? ' class="row-live"' : '') + '>' + (live ? 'No ar' : 'Em breve') + '</span></span>' +
      '<span class="row-plus" aria-hidden="true"><i></i><i></i></span>' +
      '</button>' +
      '<div class="row-det" id="det-' + p.id + '" role="region" aria-label="Detalhes de ' + esc(p.name) + '" inert><div class="row-det-in"><div class="det">' +
      '<ul class="det-list">' + p.highlights.map((h) => '<li>' + esc(h) + '</li>').join('') + '</ul>' +
      '<div class="det-side">' +
      '<div><p class="det-label">Stack técnica</p><p class="det-stack">' + p.stack.split('·').map((s) => esc(s.trim())).join(' · ') + '</p></div>' +
      '<div><p class="det-label">Status</p><p class="det-status">' + status + '</p></div>' +
      '<div class="ctas">' + links.join('') + '</div>' +
      '</div></div></div></div>' +
      '</li>';
  }
  if (rowsEl) rowsEl.innerHTML = PROJECTS.map(rowHtml).join('');
  const total = $('#proj-total');
  if (total) total.textContent = PROJECTS.length + ' projetos';

  /* ── ESPÉCIMES GENERATIVOS ──────────────────────────────────────── */
  const GEN = window.CaliGen || {};
  const STATEFUL = { neon: 1, kessler: 1, temper: 1, afotica: 1 };
  const specimens = [];
  const visIO = 'IntersectionObserver' in window ? new IntersectionObserver((entries) => {
    entries.forEach((e) => { const s = e.target.__spec; if (s) s.visible = e.isIntersecting; });
  }, { rootMargin: '120px' }) : null;
  const sizeRO = 'ResizeObserver' in window ? new ResizeObserver((entries) => {
    entries.forEach((e) => { const s = e.target.__spec; if (s) s.resize(); });
  }) : null;

  function Specimen(canvas, name, opts) {
    this.canvas = canvas; this.ctx = canvas.getContext('2d');
    this.name = name; this.S = {}; this.t = 0;
    this.active = !!(opts && opts.active);
    this.visible = !visIO; this.dirty = true;
    this.w = 0; this.h = 0; this.dpr = 1;
    canvas.__spec = this;
    this.C = readColors(canvas);
    this.ptr = null;
    canvas.addEventListener('pointermove', (e) => {
      if (e.pointerType === 'touch') return;
      const r = canvas.getBoundingClientRect();
      this.ptr = { x: e.clientX - r.left, y: e.clientY - r.top };
    }, { passive: true });
    canvas.addEventListener('pointerleave', () => { this.ptr = null; });
    specimens.push(this);
    if (visIO) visIO.observe(canvas);
    if (sizeRO) sizeRO.observe(canvas);
    this.resize();
  }
  Specimen.prototype.resize = function () {
    const r = this.canvas.getBoundingClientRect();
    const w = Math.round(r.width), h = Math.round(r.height);
    const dpr = Math.min(devicePixelRatio || 1, 1.5);
    if (!w || !h || (w === this.w && h === this.h && dpr === this.dpr)) return;
    this.w = w; this.h = h; this.dpr = dpr;
    this.canvas.width = Math.round(w * dpr); this.canvas.height = Math.round(h * dpr);
    this.S = {}; this.dirty = true;
  };
  Specimen.prototype.draw = function (dt) {
    const g = GEN[this.name];
    if (!g || !this.w) return;
    const c = this.ctx;
    c.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    c.clearRect(0, 0, this.w, this.h);
    c.save();
    this.S.ptr = this.ptr;
    try { g(c, this.w, this.h, this.t, this.C, this.S, dt); } catch (e) { /* um espécime com erro não derruba os outros */ }
    c.restore();
  };
  Specimen.prototype.still = function () {
    this.S = {}; this.t = 0;
    const T = 3.2, step = 1 / 30;
    if (STATEFUL[this.name]) { for (let i = 0; i < T / step; i++) { this.t += step; this.draw(step); } }
    else { this.t = T; this.draw(step); }
    this.dirty = false;
  };
  Specimen.prototype.setName = function (name) { this.name = name; this.S = {}; this.t = 0; this.dirty = true; };
  Specimen.prototype.refresh = function () { this.C = readColors(this.canvas); this.dirty = true; };
  Specimen.prototype.frame = function (dt) {
    if (!this.visible || !this.w) return;
    if (this.active && !noMotion) { this.t += dt; this.draw(dt); this.dirty = false; }
    else if (this.dirty) this.still();
  };

  $$('canvas.row-glyph').forEach((cv) => { new Specimen(cv, cv.dataset.gen, { active: false }); });

  /* ═══════════════════════════════════════════════════════════════
     PONTINHOS: loader → retrato no hero → mini-retrato no menu
     Um só conjunto de pontos (física de molas) atravessa as três
     cenas. As coordenadas são sempre locais ao canvas do hero; na
     camada #fly elas ganham o deslocamento do canvas na tela.
     ═══════════════════════════════════════════════════════════════ */
  const swarm = (function () {
    const canvas = $('#swarm');
    if (!canvas) return null;
    const ctx = canvas.getContext('2d');
    const fly = $('#fly'), fctx = fly ? fly.getContext('2d') : null;
    const slot = $('.mark-slot'), mini = $('.mark-avatar');
    const loaderEl = $('#loader'), loaderBar = $('#loader-bar'), loaderCap = $('#loader-cap');

    let W = 0, H = 0, dpr = 1, sp = 6, maxR = 4, ready = false;
    let portraitPts = [];        // meu retrato em pontos (coords locais do canvas)
    let dots = [];               // o conjunto único de pontos
    let clock = 0, topY = 0;
    let mode = noMotion || !root.classList.contains('is-loading') ? 'hero' : 'loader';
    let pointer = null, visible = true, awake = true, motion = 0, pending = 0;
    let img = null, imgReady = false;

    /* tamanho do ponto no retrato: escuro = ponto grande no tema claro, e
       o contrário no escuro (a foto "acende" no fundo preto) */
    const tone = (lum) => (root.getAttribute('data-theme') === 'dark' ? lum : 1 - lum);
    // o teto (0,9) mantém um respiro entre os pontos no preto: a camiseta vira textura, não mancha
    const sizeOf = (lum) => { const v = 0.12 + 0.88 * Math.pow(Math.min(0.9, tone(lum)), 1.05); return v * v; };

    /* ── Retrato: a foto do portfólio (pano azul ao fundo) em meio-tom ── */
    function buildPortrait() {
      if (!imgReady || !W) return false;
      const cols = Math.floor(W / sp), rows = Math.floor(H / sp), NN = cols * rows;
      // recorte da foto (1000×784) na proporção do canvas, centrado no rosto
      let cw = 520, ch = cw * rows / cols;
      if (ch > 784 - 120) { ch = 784 - 120; cw = ch * cols / rows; }
      const cx = 512 - cw / 2, cy = Math.min(784 - ch, 130);
      const off = document.createElement('canvas'); off.width = cols; off.height = rows;
      const o = off.getContext('2d', { willReadFrequently: true });
      o.imageSmoothingQuality = 'high';
      o.drawImage(img, cx, cy, cw, ch, 0, 0, cols, rows);
      let data;
      try { data = o.getImageData(0, 0, cols, rows).data; } catch (e) { return false; }
      // 1) máscara: o fundo é um pano azul; a pessoa não
      const inc = new Uint8Array(NN), L = new Float32Array(NN);
      for (let k = 0; k < NN; k++) {
        const r = data[k * 4], g = data[k * 4 + 1], b = data[k * 4 + 2];
        L[k] = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
        inc[k] = (b - r > 30 && b > g + 6) ? 0 : 1;
      }
      // 2) maior região conectada; buracos internos (lentes dos óculos) preenchidos
      const lab = new Int32Array(NN).fill(-1), st = [];
      const nb = [[1, 0], [-1, 0], [0, 1], [0, -1]];
      let best = -1, bestSize = 0, id = 0;
      for (let k = 0; k < NN; k++) {
        if (!inc[k] || lab[k] >= 0) continue;
        let size = 0; lab[k] = id; st.push(k);
        while (st.length) {
          const c = st.pop(); size++;
          const x0 = c % cols, y0 = (c / cols) | 0;
          nb.forEach(([dx, dy]) => { const x = x0 + dx, y = y0 + dy; if (x < 0 || y < 0 || x >= cols || y >= rows) return; const n = y * cols + x; if (inc[n] && lab[n] < 0) { lab[n] = id; st.push(n); } });
        }
        if (size > bestSize) { bestSize = size; best = id; }
        id++;
      }
      const outside = new Uint8Array(NN);
      for (let x = 0; x < cols; x++) st.push(x, (rows - 1) * cols + x);
      for (let y = 0; y < rows; y++) st.push(y * cols, y * cols + cols - 1);
      while (st.length) {
        const c = st.pop();
        if (outside[c] || lab[c] === best) continue;
        outside[c] = 1;
        const x0 = c % cols, y0 = (c / cols) | 0;
        nb.forEach(([dx, dy]) => { const x = x0 + dx, y = y0 + dy; if (x < 0 || y < 0 || x >= cols || y >= rows) return; st.push(y * cols + x); });
      }
      // 3) nitidez + contraste esticado (mesma receita do hub)
      const S2 = new Float32Array(NN);
      for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
        let sum = 0, cnt = 0;
        for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
          const nx = x + dx, ny = y + dy;
          if (nx < 0 || ny < 0 || nx >= cols || ny >= rows) continue;
          sum += L[ny * cols + nx]; cnt++;
        }
        const k = y * cols + x;
        S2[k] = clamp(L[k] + 0.9 * (L[k] - sum / cnt));
      }
      const vals = [];
      for (let k = 0; k < NN; k++) if (!outside[k]) vals.push(S2[k]);
      vals.sort((a, b) => a - b);
      const lo = vals[Math.floor(vals.length * 0.02)] || 0, hi = vals[Math.floor(vals.length * 0.98)] || 1;
      const ox = (W - cols * sp) / 2 + sp / 2, oy = (H - rows * sp) / 2 + sp / 2;
      portraitPts = [];
      for (let y = 0; y < rows; y++) for (let x = 0; x < cols; x++) {
        const k = y * cols + x;
        if (outside[k]) continue;
        // a base do busto se dissolve (os pontos diminuem até sumir)
        const f = clamp((rows - 1 - y) / (rows * 0.16));
        if (f <= 0.02) continue;
        portraitPts.push({ x: ox + x * sp, y: oy + y * sp, lum: clamp((S2[k] - lo) / ((hi - lo) || 1)), f: f * f });
      }
      topY = portraitPts.reduce((m, p) => Math.min(m, p.y), Infinity);
      return true;
    }

    function ensureDots(n) {
      const r = canvas.getBoundingClientRect();
      for (let i = dots.length; i < n; i++) {
        const d = { x: 0, y: 0, vx: 0, vy: 0, hx: 0, hy: 0, a: 0, ta: 0, nx: 0, ny: 0, na: 0, lum: -1, nl: -1, f: 1, nf: 1, sw: -1, seed: Math.random(), fe: 0 };
        if (mode === 'loader') { d.x = Math.random() * innerWidth - r.left; d.y = Math.random() * innerHeight - r.top; }
        else { d.x = W / 2 + (Math.random() - 0.5) * W; d.y = H / 2 + (Math.random() - 0.5) * H; }
        d.hx = d.x; d.hy = d.y;
        dots.push(d);
      }
    }

    function build() {
      const r = canvas.getBoundingClientRect();
      const w = Math.round(r.width), h = Math.round(r.height);
      if (!w || !h) return false;
      if (w === W && h === H && portraitPts.length) return false;
      const first = !portraitPts.length;
      W = w; H = h;
      dpr = Math.min(devicePixelRatio || 1, 2);
      canvas.width = Math.round(W * dpr); canvas.height = Math.round(H * dpr);
      // ~84 colunas em qualquer tamanho: uns 3,5 mil pontos no retrato
      sp = clamp(W / 84, 3.2, 6.5);
      maxR = sp * 0.68;
      ensureDots(1600); // o loader já começa com pontos, antes da foto chegar
      if (buildPortrait()) {
        ensureDots(portraitPts.length);
        ready = true;
        if (mode === 'hero') { if (first && !noMotion) gather(); else home(true); }
        else if (mode === 'landing') home(true, true);
      }
      lastFlyKey = '';
      return true;
    }

    /* distribui os pontos pelos alvos: ordena os dois pela mesma chave,
       então cada ponto viaja pouco. Alvo com mais de um ponto: só o
       primeiro aparece; os outros vão junto, invisíveis. */
    function assign(pts, key, delay, set, hide) {
      const M = pts.length;
      if (!M) return;
      const T = pts.map((p) => ({ p, k: key(p.x, p.y) })).sort((a, b) => a.k - b.k);
      const D = (set || dots).map((d) => ({ d, k: key(d.x, d.y) })).sort((a, b) => a.k - b.k);
      let prev = -1;
      for (let j = 0; j < D.length; j++) {
        const idx = Math.floor(j * M / D.length), t = T[idx].p, d = D[j].d;
        const vis = !hide && idx !== prev;
        d.nx = t.x; d.ny = t.y; prev = idx;
        if (t.lum !== undefined) { d.nl = vis ? t.lum : -1; d.nf = t.f; d.na = vis ? sizeOf(t.lum) * t.f : 0; }
        else { d.nl = -1; d.na = vis ? t.a : 0; }
        d.sw = clock + delay(d, j / D.length);
      }
      pending += D.length; awake = true;
    }

    // leva todos os pontos para o retrato (depois de um resize, por exemplo)
    // entrada sem loader (visita repetida na mesma sessão): os pontos se juntam no retrato
    function gather() {
      dots.forEach((d) => { const a = Math.random() * TAU, r = (0.3 + Math.random() * 0.7) * W * 0.6; d.x = W / 2 + Math.cos(a) * r; d.y = H / 2 + Math.sin(a) * r; });
      assign(portraitPts, (x, y) => Math.atan2(y - H / 2, x - W / 2), (d, f) => 0.25 + f * 0.25 + d.seed * 0.2);
    }
    // (usado quando o canvas muda de tamanho): o retrato é refeito e todos
    // os pontos vão direto para o lugar certo, sem animação de reorganização
    function home(instant, keepMotion) {
      assign(portraitPts, (x, y) => y * 10000 + x, () => 0);
      dots.forEach((d) => {
        if (!keepMotion) { d.x = d.nx; d.y = d.ny; d.vx = d.vy = 0; }
        d.hx = d.nx; d.hy = d.ny; d.a = d.ta = d.na; d.lum = d.nl; d.f = d.nf; d.sw = -1;
      });
      pending = 0; renderHero();
    }

    /* ── física: molas até o alvo, com troca de alvo escalonada ───── */
    function step(dt) {
      const K = mode === 'loader' ? 120 : 60, damp = Math.pow(mode === 'loader' ? 0.7 : 0.8, dt * 60);
      const R = 80, R2 = R * R, F = 5200, fa = Math.min(1, dt * (mode === 'loader' ? 9 : 5));
      const ptr = mode === 'hero' ? pointer : null;
      motion = 0; pending = 0;
      for (let i = 0; i < dots.length; i++) {
        const d = dots[i];
        if (d.sw >= 0) {
          if (clock >= d.sw) { d.hx = d.nx; d.hy = d.ny; d.ta = d.na; d.lum = d.nl; d.f = d.nf; d.sw = -1; } else pending++;
        }
        let ax = (d.hx - d.x) * K, ay = (d.hy - d.y) * K;
        if (ptr) {
          const dx = d.x - ptr.x, dy = d.y - ptr.y, q = dx * dx + dy * dy;
          if (q < R2 && q > 0.01) { const dist = Math.sqrt(q), f = 1 - dist / R; ax += dx / dist * f * f * F; ay += dy / dist * f * f * F; }
        }
        d.vx = (d.vx + ax * dt) * damp; d.vy = (d.vy + ay * dt) * damp;
        d.x += d.vx * dt; d.y += d.vy * dt;
        d.a += (d.ta - d.a) * fa;
        const mv = Math.abs(d.vx) + Math.abs(d.vy) + Math.abs(d.x - d.hx) + Math.abs(d.y - d.hy) + Math.abs(d.ta - d.a) * 40;
        if (mv > motion) motion = mv;
      }
    }

    /* desenha os pontos num contexto; (ox, oy) = deslocamento na tela */
    function paint(c, ox, oy, skipFlown) {
      const R = maxR;
      // todos na cor da tinta, parados ou em movimento
      const ink = new Path2D();
      for (let i = 0; i < dots.length; i++) {
        const d = dots[i];
        if (skipFlown && d.fe > 0) continue;
        const r = R * Math.sqrt(Math.max(0, d.a));
        if (r < 0.3) continue;
        const x = d.x + ox, y = d.y + oy;
        ink.moveTo(x + r, y); ink.arc(x, y, r, 0, TAU);
      }
      c.fillStyle = C.ink; c.fill(ink);
    }
    function renderHero() {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      if (mode === 'hero') paint(ctx, 0, 0, true);
    }

    /* ── LOADER: a porcentagem desenhada em pontinhos ─────────────── */
    const glyphs = {};
    let gl = null;
    function buildGlyphs() {
      const vw = innerWidth, vh = innerHeight;
      const lsp = clamp(Math.min(vw, vh * 1.6) / 150, 3.6, 8);
      const gh = Math.min(vh * 0.3, vw * 0.24);
      const R = Math.max(12, Math.round(gh / lsp)), F = 3;
      const probe = document.createElement('canvas'); probe.width = 400; probe.height = 400;
      const pg = probe.getContext('2d', { willReadFrequently: true });
      const fontFor = (px) => '800 ' + px + 'px "Archivo", "Arial Narrow", sans-serif';
      pg.font = fontFor(200); if ('fontStretch' in pg) pg.fontStretch = 'condensed';
      pg.fillText('0', 100, 300);
      const pd = pg.getImageData(0, 0, 400, 400).data;
      let y0 = 400, y1 = 0;
      for (let y = 0; y < 400; y++) for (let x = 0; x < 400; x += 2) if (pd[(y * 400 + x) * 4 + 3] > 60) { if (y < y0) y0 = y; if (y > y1) y1 = y; }
      const ratio = (y1 - y0 + 1) / 200, over = (y1 - 300 + 1) / 200;
      const ch = R * F, px = ch / ratio;
      '0123456789%'.split('').forEach((chr) => {
        const cw = Math.ceil(px * 1.2);
        const c = document.createElement('canvas'); c.width = cw; c.height = ch;
        const g = c.getContext('2d', { willReadFrequently: true });
        g.font = fontFor(px); if ('fontStretch' in g) g.fontStretch = 'condensed';
        g.fillStyle = '#000'; g.textBaseline = 'alphabetic';
        g.fillText(chr, px * 0.1, ch - over * px);
        const d = g.getImageData(0, 0, cw, ch).data;
        let x0 = cw, x1 = 0;
        for (let y = 0; y < ch; y++) for (let x = 0; x < cw; x++) if (d[(y * cw + x) * 4 + 3] > 40) { if (x < x0) x0 = x; if (x > x1) x1 = x; }
        const gcols = Math.max(1, Math.ceil((x1 - x0 + 1) / F));
        const cells = [];
        for (let gy = 0; gy < R; gy++) for (let gx = 0; gx < gcols; gx++) {
          let s = 0;
          for (let j = 0; j < F; j++) for (let i = 0; i < F; i++) { const X = x0 + gx * F + i; if (X < cw) s += d[((gy * F + j) * cw + X) * 4 + 3]; }
          const a = s / (F * F * 255);
          if (a >= 0.12) cells.push([gx, gy, Math.min(1, a * 1.1)]);
        }
        glyphs[chr] = { w: gcols, cells };
      });
      gl = { sp: lsp, rows: R };
    }
    /* casas fixas: três algarismos + "%". Cada casa tem os seus pontos,
       que viajam de um algarismo para o outro; só a casa que muda se mexe. */
    let slots = null, slotChars = [];
    function slotLayout() {
      const dw = Math.max(...'0123456789'.split('').map((c) => glyphs[c].w)), gap = 1.6;
      const widths = [dw, dw, dw, glyphs['%'].w];
      const total = widths.reduce((a, b) => a + b, 0) + gap * 3;
      const r = canvas.getBoundingClientRect();
      const x0 = innerWidth / 2 - total * gl.sp / 2 - r.left, y0 = innerHeight * 0.47 - gl.rows * gl.sp / 2 - r.top;
      let x = 0;
      const pool = dots.slice().sort((p, q) => p.x - q.x), per = Math.floor(pool.length / 4);
      slots = widths.map((w, k) => { const sl = { x: x0 + x * gl.sp, y: y0, w, set: pool.slice(k * per, k === 3 ? pool.length : (k + 1) * per) }; x += w + gap; return sl; });
      slotChars = [];
    }
    function glyphPts(ch, sl) {
      const g = glyphs[ch], off = (sl.w - g.w) / 2, k = Math.pow(gl.sp * 0.6 / maxR, 2);
      return g.cells.map(([gx, gy, a]) => ({ x: sl.x + (off + gx + 0.5) * gl.sp, y: sl.y + (gy + 0.5) * gl.sp, a: a * k }));
    }
    function setNumber(n, first) {
      if (!slots) slotLayout();
      const txt = String(n).padStart(3, ' ') + '%';
      const key = (x, y) => x * 4 + y * 0.01;
      for (let k = 0; k < 4; k++) {
        if (slotChars[k] === txt[k]) continue;
        slotChars[k] = txt[k];
        const blank = txt[k] === ' ';
        assign(glyphPts(blank ? '0' : txt[k], slots[k]), key, first ? (d, f) => f * 0.4 + d.seed * 0.3 : (d) => d.seed * 0.06, slots[k].set, blank);
      }
    }

    // progresso: tempo mínimo para dar para ler a contagem, e só chega a
    // 100% quando a foto, as fontes e a página terminaram de carregar
    const MIN_S = 3.6;
    let t0 = performance.now(), fontsOk = false, pageOk = false, shownPct = -1, lastPct = 0, glyphReady = false, doneAt = 0, landedAt = 0;
    if (mode === 'loader') {
      if (document.readyState === 'complete') pageOk = true; else addEventListener('load', () => { pageOk = true; }, { once: true });
      Promise.race([
        document.fonts && document.fonts.load ? document.fonts.load('800 100px "Archivo"').then(() => document.fonts.ready) : Promise.resolve(),
        new Promise((r) => setTimeout(r, 1600))
      ]).then(() => { fontsOk = true; buildGlyphs(); glyphReady = true; });
      setTimeout(() => { pageOk = true; }, 6000); // rede lenta: não segura o visitante
    }
    function loaderTick(now) {
      if (!glyphReady) return;
      const el = (now - t0) / 1000;
      const real = (fontsOk ? 0.4 : 0.1) + (ready ? 0.35 : 0) + (pageOk ? 0.25 : 0);
      const x = clamp(el / MIN_S), target = Math.min(real, x * x * (3 - 2 * x)) * 100;
      if (shownPct === 100) {
        if (!doneAt) doneAt = now;
        else if (now - doneAt > 650 && ready) land();
        return;
      }
      const n = Math.min(100, Math.floor(target));
      if (n !== shownPct && (now - lastPct > 240 || (n === 100 && now - lastPct > 180))) {
        setNumber(n, shownPct < 0);
        shownPct = n; lastPct = now;
        if (loaderBar) loaderBar.style.transform = 'scaleX(' + (n / 100).toFixed(3) + ')';
        if (loaderCap) loaderCap.textContent = n < 45 ? 'carregando projetos' : n < 85 ? 'revelando o retrato' : 'quase lá';
      }
    }
    /* fim do loader: os pontos do "100%" formam o meu retrato no hero */
    function land() {
      if (mode === 'loader') {
        mode = 'landing'; landedAt = clock;
        if (loaderEl) { loaderEl.classList.add('is-leaving'); setTimeout(() => { loaderEl.hidden = true; loaderEl.classList.remove('is-leaving'); }, 1100); }
        root.classList.remove('is-loading');
        try { sessionStorage.setItem('pf-loader', '1'); } catch (e) { }
        document.dispatchEvent(new Event('pf:loaded'));
      }
      const vw = innerWidth, r = canvas.getBoundingClientRect();
      // de cima para baixo: o cabelo se forma primeiro, os ombros por último
      assign(portraitPts, (x, y) => x * 10 + y * 0.001, (d) => clamp((d.y + r.top) / innerHeight) * 0.15 + clamp((d.x + r.left) / vw) * 0.3 + d.seed * 0.12);
    }

    /* ── Favicon no mesmo esquema: os pontos do retrato num quadrado ── */
    function makeFavicon() {
      if (!portraitPts.length) return;
      const links = $$('link[rel="icon"]');
      if (!links.length) return;
      const S = 180, fc = document.createElement('canvas');
      fc.width = S; fc.height = S;
      const c = fc.getContext('2d');
      c.fillStyle = C.bg;
      c.beginPath(); c.moveTo(24, 0); c.arcTo(S, 0, S, S, 24); c.arcTo(S, S, 0, S, 24); c.arcTo(0, S, 0, 0, 24); c.arcTo(0, 0, S, 0, 24); c.closePath(); c.fill();
      c.save(); c.clip();
      const k = (S * 1.02) / W, ox = (S - W * k) / 2, oy = S * 0.05 - (topY - sp / 2) * k;
      const p = new Path2D();
      portraitPts.forEach((d) => { const r = maxR * Math.sqrt(sizeOf(d.lum) * d.f) * k; if (r > 0.2) { const x = ox + d.x * k, y = oy + d.y * k; p.moveTo(x + r, y); p.arc(x, y, r, 0, TAU); } });
      c.fillStyle = C.ink; c.fill(p);
      c.restore();
      try { const url = fc.toDataURL('image/png'); links.forEach((l) => { l.href = url; }); } catch (e) { }
    }

    /* ── VOO até o menu: disparado quando o topo da cabeça encosta na
          barra. Cada ponto some do hero quando decola e o mini-retrato
          final é o próprio retrato em miniatura (mesmos pontos). ───── */
    let fp = 0, gone = false, lastFlyKey = '';
    function sizeFly() {
      if (!fly) return;
      const fd = Math.max(2, Math.min(devicePixelRatio || 1, 3));
      fly.width = Math.round(innerWidth * fd); fly.height = Math.round(innerHeight * fd);
      fctx.setTransform(fd, 0, 0, fd, 0, 0);
    }
    function fit(box) {
      const k = Math.min(box.width / W, box.height / H);
      return { k, x: box.left + (box.width - W * k) / 2, y: box.top + (box.height - H * k) / 2 };
    }
    function flight(dt) {
      if (!fly || !slot || !ready || mode !== 'hero') return;
      const pr = canvas.getBoundingClientRect(), barB = $('#bar').getBoundingClientRect().bottom;
      const target = pr.top + topY < barB + 2 ? 1 : 0;
      if (noMotion) fp = target;
      else if (fp < target) fp = Math.min(1, fp + (dt || 0) / 1.1);
      else if (fp > target) fp = Math.max(0, fp - (dt || 0) / 0.85);
      const flying = fp > 0 && fp < 1;
      const key = fp.toFixed(4) + '|' + innerWidth + 'x' + innerHeight + '|' + root.getAttribute('data-theme') + (flying ? '|' + pr.top.toFixed(1) + '|' + pr.left.toFixed(1) : '');
      if (key === lastFlyKey) return;
      lastFlyKey = key;
      slot.style.setProperty('--fly', fp.toFixed(3));
      fctx.clearRect(0, 0, innerWidth, innerHeight);
      if (fp <= 0) {
        if (gone) { dots.forEach((d) => { d.fe = 0; }); gone = false; renderHero(); }
        return;
      }
      gone = true;
      const o = fit(mini.getBoundingClientRect());
      const ink = new Path2D();
      for (let i = 0; i < dots.length; i++) {
        const d = dots[i];
        const start = (d.hy / H) * 0.4 + d.seed * 0.08;
        const e = fp >= 1 ? 1 : 1 - Math.pow(1 - clamp((fp - start) / 0.52), 3);
        d.fe = e;
        if (e <= 0) continue;
        const rh = maxR * Math.sqrt(Math.max(0, d.a));
        let x = o.x + d.hx * o.k, y = o.y + d.hy * o.k, r = rh * o.k;
        if (e < 1) {
          const sx = pr.left + d.x, sy = pr.top + d.y;
          x = sx + (x - sx) * e + Math.sin(e * Math.PI) * (d.seed - 0.5) * 50;
          y = sy + (y - sy) * e - Math.sin(e * Math.PI) * (16 + d.seed * 34);
          r = rh + (r - rh) * e;
        }
        if (r < 0.12) continue;
        ink.moveTo(x + r, y); ink.arc(x, y, r, 0, TAU);
      }
      fctx.fillStyle = C.ink; fctx.fill(ink);
      renderHero(); // o hero perde os pontos que decolaram
    }

    /* ── ponteiro ──────────────────────────────────────────────────── */
    const local = (e) => { const r = canvas.getBoundingClientRect(); return { x: e.clientX - r.left, y: e.clientY - r.top }; };
    canvas.addEventListener('pointermove', (e) => { if (e.pointerType !== 'touch') { pointer = local(e); awake = true; } }, { passive: true });
    canvas.addEventListener('pointerleave', () => { pointer = null; });
    canvas.addEventListener('pointerdown', (e) => { if (e.pointerType === 'touch') burst(local(e), 90, 700); }, { passive: true });
    function burst(at, radius, power) {
      awake = true;
      dots.forEach((d) => {
        const dx = d.x - at.x, dy = d.y - at.y, dist = Math.hypot(dx, dy);
        if (dist < radius && dist > 0.01) { const f = (1 - dist / radius) * power; d.vx += dx / dist * f; d.vy += dy / dist * f; }
      });
    }
    if ('IntersectionObserver' in window) new IntersectionObserver((es) => { visible = es[0].isIntersecting; }).observe(canvas);
    if ('ResizeObserver' in window) new ResizeObserver(() => build()).observe(canvas);

    img = new Image();
    img.decoding = 'async';
    img.onload = () => { imgReady = true; W = 0; build(); makeFavicon(); };
    img.src = '/julio.jpg';

    if (fly) { sizeFly(); addEventListener('resize', () => { sizeFly(); lastFlyKey = ''; }, { passive: true }); }
    build();

    return {
      frame(dt, now) {
        clock += dt;
        if (mode === 'loader') {
          loaderTick(now);
          step(dt);
          const r = canvas.getBoundingClientRect();
          fctx.clearRect(0, 0, innerWidth, innerHeight);
          paint(fctx, r.left, r.top, false);
          return;
        }
        if (mode === 'landing') {
          step(dt);
          const r = canvas.getBoundingClientRect();
          fctx.clearRect(0, 0, innerWidth, innerHeight);
          paint(fctx, r.left, r.top, false);
          if (clock - landedAt > 1.2 && pending === 0 && motion < 2) {
            mode = 'hero'; fctx.clearRect(0, 0, innerWidth, innerHeight); lastFlyKey = ''; renderHero();
          }
          return;
        }
        if (noMotion || !ready) return;
        if (visible && fp < 1 && (awake || pointer || pending)) {
          step(dt);
          renderHero();
          if (!pointer && !pending && motion < 0.05) awake = false;
        }
      },
      flight,
      redraw() {
        // troca de tema: o tamanho de cada ponto depende do tema
        dots.forEach((d) => { if (d.lum >= 0) d.a = d.ta = sizeOf(d.lum) * d.f; if (d.nl >= 0) d.na = sizeOf(d.nl) * d.nf; });
        if (mode === 'hero') renderHero();
        lastFlyKey = ''; makeFavicon();
      },
      rebuild: build,
      scatter() { awake = true; dots.forEach((d) => { const a = Math.random() * TAU, s = 600 + Math.random() * 1400; d.vx += Math.cos(a) * s; d.vy += Math.sin(a) * s; }); },
      loading: () => mode !== 'hero'
    };
  })();
  // sem o motor dos pontinhos, o loader não pode prender a página
  if (!swarm) { root.classList.remove('is-loading'); }

  /* ── TEMA (escuro padrão, claro opcional) com transição circular ── */
  const themeBtn = $('#theme-toggle');
  const themeMeta = $('meta[name="theme-color"]');
  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    C = readColors();
    if (themeMeta) themeMeta.setAttribute('content', theme === 'dark' ? '#0c0d0f' : '#f0f0ec');
    specimens.forEach((s) => { s.C = readColors(s.canvas); if (s.visible) { if (s.active && !noMotion) s.draw(0); else s.still(); } else s.dirty = true; });
    if (swarm) swarm.redraw();
  }
  if (themeMeta && root.getAttribute('data-theme') === 'light') themeMeta.setAttribute('content', '#f0f0ec');
  if (themeBtn) {
    themeBtn.addEventListener('click', (e) => {
      const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
      try { localStorage.setItem(THEME_KEY, next); } catch (err) { }
      if (!document.startViewTransition || noMotion) { applyTheme(next); return; }
      const r = themeBtn.getBoundingClientRect();
      const x = e.clientX || r.left + r.width / 2, y = e.clientY || r.top + r.height / 2;
      const end = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));
      const vt = document.startViewTransition(() => applyTheme(next));
      vt.ready.then(() => {
        root.animate(
          { clipPath: ['circle(0px at ' + x + 'px ' + y + 'px)', 'circle(' + end + 'px at ' + x + 'px ' + y + 'px)'] },
          { duration: 750, easing: 'cubic-bezier(0.7, 0, 0.2, 1)', pseudoElement: '::view-transition-new(root)' }
        );
      }).catch(() => { });
    });
  }

  /* ── DIVISÃO DE TEXTO PARA AS MÁSCARAS ──────────────────────────── */
  $$('[data-words]').forEach((el) => {
    let i = 0;
    (function walk(node) {
      [...node.childNodes].forEach((n) => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach((part) => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(' ')); return; }
            const mask = document.createElement('span'); mask.className = 'w-mask';
            const w = document.createElement('span'); w.className = 'w'; w.textContent = part;
            w.style.setProperty('--d', (i++ * 75) + 'ms');
            mask.appendChild(w); frag.appendChild(mask);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1 && n.tagName !== 'BR') walk(n);
      });
    })(el);
  });
  $$('[data-chars]').forEach((el, line) => {
    const text = el.textContent.trim();
    el.textContent = '';
    [...text].forEach((ch, i) => {
      const mask = document.createElement('span'); mask.className = 'c-mask';
      const c = document.createElement('span'); c.className = 'c'; c.textContent = ch;
      c.style.setProperty('--d', (120 + line * 260 + i * 45) + 'ms');
      mask.appendChild(c); el.appendChild(mask);
    });
  });

  /* ── LINHA DO TEMPO ─────────────────────────────────────────────── */
  const logEl = $('#log');
  if (logEl && PROJECTS.length) {
    const sorted = PROJECTS.slice().sort((a, b) => a.created.localeCompare(b.created));
    const months = [];
    sorted.forEach((p) => {
      const k = p.created.slice(0, 7);
      if (!months.length || months[months.length - 1].k !== k) months.push({ k, items: [] });
      months[months.length - 1].items.push(p);
    });
    logEl.innerHTML = months.map((m) => {
      const [y, mm] = m.k.split('-');
      return '<li class="log-row" data-reveal>' +
        '<span class="log-month">' + MONTHS[+mm - 1] + '<small>' + y + '</small></span>' +
        '<span class="log-dots" aria-hidden="true">' + m.items.map((p, i) => '<i style="--d:' + (200 + i * 90) + 'ms"></i>').join('') + '</span>' +
        '<span class="log-items">' + m.items.map((p) => '<button type="button" data-open="' + p.id + '">' + esc(p.name) + '<span>' + p.created.slice(8) + '/' + mm + '</span></button>').join('') + '</span>' +
        '</li>';
    }).join('');
    const range = $('#log-range');
    if (range) range.textContent = fmtMonth(sorted[0].created) + ' a ' + fmtMonth(sorted[sorted.length - 1].created);
    $$('[data-open]', logEl).forEach((b) => b.addEventListener('click', () => openProject(b.dataset.open)));
  }

  /* ── REVELAÇÃO NO SCROLL ────────────────────────────────────────── */
  const revealEls = $$('[data-reveal], [data-words], [data-chars], .hero-name');
  $$('[data-reveal]').forEach((el) => {
    let i = 0, p = el.previousElementSibling;
    while (p && p.hasAttribute('data-reveal')) { i++; p = p.previousElementSibling; }
    if (i) el.style.setProperty('--d', Math.min(i * 80, 480) + 'ms');
  });
  if (noMotion || !('IntersectionObserver' in window)) {
    revealEls.forEach((el) => el.classList.add('in'));
  } else {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -5% 0px' });
    revealEls.forEach((el) => io.observe(el));
  }

  /* ── FRASE ROTATIVA ─────────────────────────────────────────────── */
  const rotWin = $('.rot-window');
  const PHRASES = ['Analista de Sistemas', 'Arquiteto de automação (n8n)', 'Ponte entre negócio e engenharia', 'Do discovery ao deploy'];
  if (rotWin && !noMotion) {
    let idx = 0;
    setInterval(() => {
      if (document.hidden) return;
      const items = $$('.rot-item', rotWin);
      const cur = items.find((el) => el.classList.contains('is-on'));
      items.forEach((el) => { if (el !== cur) el.remove(); });
      idx = (idx + 1) % PHRASES.length;
      const next = document.createElement('span');
      next.className = 'rot-item';
      next.textContent = PHRASES[idx];
      rotWin.appendChild(next);
      next.getBoundingClientRect();
      next.classList.add('is-on');
      if (cur) { cur.classList.remove('is-on'); cur.classList.add('is-out'); setTimeout(() => cur.remove(), 800); }
    }, 2800);
  }

  /* ── ÍNDICE DE PROJETOS: palco, filtros, busca e detalhes ───────── */
  const rows = $$('.row');
  const stageEl = $('.stage');
  const stagePlate = stageEl ? $('.stage-plate', stageEl) : null;
  const stageCanvas = $('#stage-canvas');
  const first = PROJECTS[0];
  const stageSpec = stageCanvas && first ? new Specimen(stageCanvas, first.gen, { active: true }) : null;
  const wideIndex = () => stageEl && getComputedStyle(stageEl).display !== 'none';
  let activeRow = null, hoverRow = null, swapTimer = null;

  function setActive(row, instant) {
    if (!row || row === activeRow) return;
    if (activeRow) {
      activeRow.classList.remove('is-active');
      const g = $('.row-glyph', activeRow); if (g && g.__spec) g.__spec.active = false;
    }
    activeRow = row;
    row.classList.add('is-active');
    if (!wideIndex()) { const g = $('.row-glyph', row); if (g && g.__spec) { g.__spec.active = true; g.__spec.t = 0; } }
    if (!stageSpec) return;
    const p = byId[row.dataset.id];
    const fill = () => {
      if (p.p) stagePlate.dataset.p = p.p; else delete stagePlate.dataset.p;
      stageSpec.setName(p.gen);
      stageSpec.refresh();
      $('.stage-name', stageEl).textContent = p.name;
      $('.stage-tags', stageEl).textContent = p.tags.join(' · ');
      $('.stage-host', stageEl).textContent = host(p.deploy) || 'em desenvolvimento';
      $('.stage-status', stageEl).textContent = p.deploy ? 'no ar' : 'em breve';
    };
    if (instant || noMotion) { fill(); return; }
    stageEl.classList.add('is-swapping'); stageCanvas.classList.add('is-swapping');
    clearTimeout(swapTimer);
    swapTimer = setTimeout(() => {
      fill();
      stageEl.classList.remove('is-swapping'); stageCanvas.classList.remove('is-swapping');
    }, 230);
  }
  function toggleRow(row, open) {
    const want = open === undefined ? !row.classList.contains('is-open') : open;
    row.classList.toggle('is-open', want);
    $('.row-head', row).setAttribute('aria-expanded', String(want));
    $('.row-det', row).inert = !want;
    if (want) setActive(row);
  }
  rows.forEach((row) => {
    row.addEventListener('mouseenter', () => { hoverRow = row; setActive(row); });
    row.addEventListener('mouseleave', () => { hoverRow = null; });
    const head = $('.row-head', row);
    head.addEventListener('click', () => toggleRow(row));
    head.addEventListener('focus', () => setActive(row));
  });
  if (rows[0]) setActive(rows[0], true);

  function spyRows() {
    if (hoverRow || !rows.length) return;
    const vis = rows.filter((r) => !r.hidden);
    if (!vis.length) return;
    const mid = innerHeight * 0.5;
    const a = vis[0].getBoundingClientRect(), b = vis[vis.length - 1].getBoundingClientRect();
    if (a.top > innerHeight || b.bottom < 0) return;
    for (const row of vis) {
      const r = row.getBoundingClientRect();
      if (r.top <= mid && r.bottom > mid) { setActive(row); return; }
    }
  }

  // filtros e busca
  const filtersEl = $('#filters'), searchEl = $('#proj-search');
  const countEl = $('#rows-count'), emptyEl = $('#rows-empty');
  let filter = 'all', query = '';
  const hay = {};
  PROJECTS.forEach((p) => { hay[p.id] = norm([p.name, p.sub, p.desc, p.tags.join(' '), p.stack, CATS[p.category]].join(' ')); });
  if (filtersEl) {
    const counts = { all: PROJECTS.length };
    PROJECTS.forEach((p) => { counts[p.category] = (counts[p.category] || 0) + 1; });
    const keys = ['all'].concat(Object.keys(CATS).filter((k) => counts[k]));
    filtersEl.innerHTML = keys.map((k) => '<button type="button" data-f="' + k + '" aria-pressed="' + (k === 'all') + '">' + (k === 'all' ? 'Todos' : esc(CATS[k])) + '<sup>' + counts[k] + '</sup></button>').join('');
    $$('button', filtersEl).forEach((b) => b.addEventListener('click', () => {
      filter = b.dataset.f;
      $$('button', filtersEl).forEach((x) => x.setAttribute('aria-pressed', String(x === b)));
      applyFilter();
    }));
  }
  if (searchEl) searchEl.addEventListener('input', () => { query = norm(searchEl.value.trim()); applyFilter(); });
  function applyFilter() {
    let n = 0;
    rows.forEach((row) => {
      const p = byId[row.dataset.id];
      const ok = (filter === 'all' || p.category === filter) && (!query || hay[p.id].includes(query));
      row.hidden = !ok;
      if (ok) n++;
    });
    if (countEl) countEl.innerHTML = 'Exibindo <b>' + n + '</b> de <b>' + PROJECTS.length + '</b>';
    if (emptyEl) emptyEl.hidden = n > 0;
    if (activeRow && activeRow.hidden) { const v = rows.find((r) => !r.hidden); if (v) setActive(v); }
    if (lenis) lenis.resize();
  }
  applyFilter();

  /* abre um projeto vindo do hero ou da linha do tempo */
  function openProject(id) {
    const row = $('#p-' + id);
    if (!row) return;
    if (row.hidden) {
      filter = 'all'; query = '';
      if (searchEl) searchEl.value = '';
      if (filtersEl) $$('button', filtersEl).forEach((x) => x.setAttribute('aria-pressed', String(x.dataset.f === 'all')));
      applyFilter();
    }
    toggleRow(row, true);
    const y = Math.max(0, row.getBoundingClientRect().top + scrollY - barH() - 24);
    if (lenis) lenis.scrollTo(y, { duration: 1.4 }); else scrollTo({ top: y, behavior: noMotion ? 'auto' : 'smooth' });
    setTimeout(() => $('.row-head', row).focus({ preventScroll: true }), noMotion ? 0 : 1200);
  }

  /* ── TRAJETÓRIA: o trilho azul desce conforme a leitura ─────────── */
  const career = $('#career'), careerItems = career ? $$('li', career) : [];
  let lastCareer = -1;
  function updateCareer() {
    if (!career) return;
    const r = career.getBoundingClientRect();
    if (r.top > innerHeight || r.bottom < 0) return;
    const p = noMotion ? 1 : clamp((innerHeight * 0.62 - r.top) / r.height);
    if (Math.abs(p - lastCareer) < 0.001) return;
    lastCareer = p;
    career.style.setProperty('--p', p.toFixed(4));
    careerItems.forEach((li) => { li.classList.toggle('is-lit', li.offsetTop + 22 <= p * r.height); });
  }

  /* ── FÓLIO, NAVEGAÇÃO ATIVA E BARRA ─────────────────────────────── */
  const folio = $('.folio'), folioText = $('#folio'), folioBar = $('#folio-bar');
  const bar = $('#bar');
  const sections = $$('[data-section]');
  const navLinks = $$('.bar-nav a');
  let curSection = null;
  function updateChrome() {
    if (bar) bar.classList.toggle('is-scrolled', scrollY > 8);
    const probe = innerHeight * 0.4;
    let cur = null;
    sections.forEach((s) => { if (s.getBoundingClientRect().top <= probe) cur = s; });
    if (cur !== curSection) {
      curSection = cur;
      if (folioText) folioText.textContent = cur ? cur.dataset.section : 'Capa';
      navLinks.forEach((a) => a.classList.toggle('is-current', !!cur && a.getAttribute('href') === '#' + cur.id));
    }
    const max = document.documentElement.scrollHeight - innerHeight;
    if (folioBar) folioBar.style.transform = 'scaleY(' + (max > 0 ? scrollY / max : 0).toFixed(4) + ')';
    if (folio) folio.classList.toggle('is-on', scrollY > innerHeight * 0.5);
  }

  /* ── MENU MOBILE ────────────────────────────────────────────────── */
  const menu = $('#menu'), menuBtn = $('#menu-toggle');
  let menuTimer = null;
  function setMenu(open) {
    if (!menu || !menuBtn) return;
    clearTimeout(menuTimer);
    menuBtn.setAttribute('aria-expanded', String(open));
    $('.sr-only', menuBtn).textContent = open ? 'Fechar menu' : 'Abrir menu';
    document.body.classList.toggle('menu-open', open);
    if (open) {
      menu.hidden = false;
      requestAnimationFrame(() => requestAnimationFrame(() => menu.classList.add('is-open')));
      if (lenis) lenis.stop(); else root.style.overflow = 'hidden';
    } else {
      menu.classList.remove('is-open');
      menuTimer = setTimeout(() => { menu.hidden = true; }, 600);
      if (lenis) lenis.start(); else root.style.overflow = '';
    }
  }
  if (menuBtn) menuBtn.addEventListener('click', () => setMenu(menuBtn.getAttribute('aria-expanded') !== 'true'));
  addEventListener('keydown', (e) => { if (e.key === 'Escape' && document.body.classList.contains('menu-open')) { setMenu(false); menuBtn.focus(); } });

  /* ── SCROLL SUAVE (Lenis) + ÂNCORAS ─────────────────────────────── */
  if (window.Lenis && !noMotion) {
    try { lenis = new window.Lenis({ duration: 1.15, smoothWheel: true }); } catch (e) { lenis = null; }
  }
  if (lenis && swarm && swarm.loading()) {
    lenis.stop();
    document.addEventListener('pf:loaded', () => lenis.start(), { once: true });
  }
  $$('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id === '#conteudo') return;
      const target = id === '#topo' ? document.body : $(id);
      if (!target) return;
      e.preventDefault();
      if (document.body.classList.contains('menu-open')) setMenu(false);
      const head = id === '#topo' ? null : ($('.sec-head', target) || target);
      const y = head ? Math.max(0, head.getBoundingClientRect().top + scrollY - barH() - 28) : 0;
      if (lenis) lenis.scrollTo(y, { duration: 1.4 });
      else scrollTo({ top: y, behavior: noMotion ? 'auto' : 'smooth' });
      history.replaceState(null, '', id);
    });
  });

  /* ── TOAST + COPIAR EMAIL ───────────────────────────────────────── */
  const toast = $('#toast');
  let toastTimer = null;
  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg; toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2600);
  }
  const copyBtn = $('#copy-email');
  if (copyBtn) {
    copyBtn.addEventListener('click', async () => {
      const email = copyBtn.dataset.email;
      try { await navigator.clipboard.writeText(email); showToast('Email copiado: ' + email); }
      catch (e) { showToast(email); }
    });
  }

  /* ── EASTER EGG: KONAMI → pontos explodem e tudo acelera ───────── */
  const KONAMI = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  let kPos = 0;
  addEventListener('keydown', (e) => {
    const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
    kPos = k === KONAMI[kPos] ? kPos + 1 : (k === KONAMI[0] ? 1 : 0);
    if (kPos === KONAMI.length) {
      kPos = 0;
      speed = speed === 1 ? 2.6 : 1;
      if (swarm) swarm.scatter();
      showToast(speed > 1 ? 'Modo turbo ligado ↑↑↓↓←→←→BA' : 'Modo turbo desligado');
    }
  });

  const yearEl = $('#ft-year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  let resizeTimer = null;
  addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      if (swarm) swarm.rebuild();
      if (activeRow && !wideIndex()) { const g = $('.row-glyph', activeRow); if (g && g.__spec) g.__spec.active = true; }
    }, 150);
  }, { passive: true });
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { specimens.forEach((s) => { s.dirty = true; }); });

  /* ── LOOP ÚNICO ─────────────────────────────────────────────────── */
  let last = performance.now();
  function loop(now) {
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    if (lenis) lenis.raf(now);
    updateChrome();
    updateCareer();
    spyRows();
    specimens.forEach((s) => s.frame(dt * speed));
    if (swarm) { swarm.frame(dt * speed, now); swarm.flight(dt); }
    requestAnimationFrame(loop);
  }
  requestAnimationFrame(loop);
})();
