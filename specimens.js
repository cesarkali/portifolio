/* ═══════════════════════════════════════════════════════════════════
   CALIBERDA · espécimes generativos (cópia do hub, com hub e iaorhuman a mais)
   Cada projeto tem uma animação desenhada em canvas 2D, sempre com a
   mesma assinatura:

     gen(ctx, w, h, t, C, S, dt)
       w, h  tamanho em px CSS (o contexto já está escalado pelo DPR)
       t     tempo local do espécime, em segundos
       C     paleta do tema: C.ink/.bg/.accent/.muted, C.rgba(k, a), C.mix(k, a)
       S     estado persistente (simulações); S.ptr = mouse sobre o canvas
       dt    passo desde o último quadro (s)

   Produtos usam a paleta do site (ilustração de interface). Jogos e
   mods do Playground usam a paleta do próprio projeto, como um print.
   O motor (loop, visibilidade, DPR, tema) fica em app.js.
   ═══════════════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  const TAU = Math.PI * 2;
  const clamp = (v, a = 0, b = 1) => Math.max(a, Math.min(b, v));
  const lerp = (a, b, k) => a + (b - a) * k;
  const ease = (x) => 1 - Math.pow(1 - clamp(x), 3);
  const easeBack = (x) => { x = clamp(x); const c = 1.7; return 1 + (c + 1) * Math.pow(x - 1, 3) + c * Math.pow(x - 1, 2); };
  const seg = (t, a, b) => clamp((t - a) / (b - a));
  // ruído barato por soma de senos, aprox. [-1, 1]
  const nz = (x) => Math.sin(x) * 0.5 + Math.sin(x * 2.13 + 1.7) * 0.3 + Math.sin(x * 4.71 + 0.3) * 0.2;
  const hash = (n) => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

  function rng(seed) {
    let s = (seed >>> 0) || 1;
    return () => { s ^= s << 13; s ^= s >>> 17; s ^= s << 5; return ((s >>> 0) % 100000) / 100000; };
  }

  const MONO = '"IBM Plex Mono", ui-monospace, monospace';
  const SANS = '"Archivo", system-ui, sans-serif';
  function font(ctx, px, fam, weight) {
    ctx.font = (weight || 400) + ' ' + Math.max(6, Math.round(px)) + 'px ' + (fam === 'mono' ? MONO : SANS);
  }
  function wrap(ctx, text, maxW) {
    const out = []; let cur = '';
    text.split(' ').forEach((wd) => {
      const test = cur ? cur + ' ' + wd : wd;
      if (cur && ctx.measureText(test).width > maxW) { out.push(cur); cur = wd; } else cur = test;
    });
    if (cur) out.push(cur);
    return out;
  }
  function ell(ctx, s, maxW) {
    if (ctx.measureText(s).width <= maxW) return s;
    while (s.length > 1 && ctx.measureText(s + '…').width > maxW) s = s.slice(0, -1);
    return s + '…';
  }
  const typed = (s, p) => s.slice(0, Math.floor(clamp(p) * s.length));

  function line(ctx, x1, y1, x2, y2) { ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); }
  function dot(ctx, x, y, r) { ctx.beginPath(); ctx.arc(x, y, r, 0, TAU); ctx.fill(); }
  function rrect(ctx, x, y, w, h, r) {
    r = Math.max(0, Math.min(r, w / 2, h / 2));
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }
  function label(ctx, s, x, y, px, fam, weight, color, align, base) {
    font(ctx, px, fam, weight);
    ctx.fillStyle = color; ctx.textAlign = align || 'left'; ctx.textBaseline = base || 'middle';
    ctx.fillText(s, x, y);
  }

  const G = {};

  /* ── Financial Kali · gráfico do painel de destaque ─────────────── */
  G.kaliChart = function (ctx, w, h, t, C) {
    const top = h * 0.06, bot = h * 0.84, padR = w * 0.04;
    ctx.lineWidth = 1;
    ctx.strokeStyle = C.rgba('ink', 0.08);
    for (let i = 0; i <= 4; i++) { const y = top + (bot - top) * i / 4; line(ctx, 0, y, w, y); }

    const months = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];
    font(ctx, clamp(h * 0.035, 9, 11), 'mono');
    ctx.fillStyle = C.muted; ctx.textAlign = 'center'; ctx.textBaseline = 'alphabetic';
    const step = w < 420 ? 2 : 1;
    for (let i = 0; i < 12; i += step) ctx.fillText(months[i], (w - padR) * (i + 0.5) / 12, h * 0.95);

    const N = 96, rev = ease(t / 2.4), sh = t * 0.22;
    const f = (x) => 0.16 + 0.62 * x + 0.06 * Math.sin(x * 8 + sh) + 0.03 * Math.sin(x * 21 + sh * 2.3);
    const g = (x) => 0.12 + 0.2 * x + 0.05 * Math.sin(x * 6 + sh * 1.4 + 2) + 0.025 * Math.sin(x * 17 + sh * 2);
    const X = (i) => (w - padR) * i / (N - 1);
    const Y = (v) => bot - (bot - top) * v;
    const n = Math.max(2, Math.round((N - 1) * rev) + 1);

    const grad = ctx.createLinearGradient(0, top, 0, bot);
    grad.addColorStop(0, C.rgba('accent', 0.24));
    grad.addColorStop(1, C.rgba('accent', 0));
    ctx.beginPath(); ctx.moveTo(X(0), bot);
    for (let i = 0; i < n; i++) ctx.lineTo(X(i), Y(f(i / (N - 1))));
    ctx.lineTo(X(n - 1), bot); ctx.closePath();
    ctx.fillStyle = grad; ctx.fill();

    ctx.beginPath();
    for (let i = 0; i < n; i++) { const x = X(i), y = Y(f(i / (N - 1))); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
    ctx.strokeStyle = C.accent; ctx.lineWidth = 2; ctx.lineJoin = 'round'; ctx.stroke();

    ctx.setLineDash([4, 5]);
    ctx.beginPath();
    for (let i = 0; i < n; i++) { const x = X(i), y = Y(g(i / (N - 1))); i ? ctx.lineTo(x, y) : ctx.moveTo(x, y); }
    ctx.strokeStyle = C.muted; ctx.lineWidth = 1.5; ctx.stroke();
    ctx.setLineDash([]);

    const ci = rev < 1 ? n - 1 : Math.round((N - 1) * (0.55 + 0.4 * Math.sin(t * 0.4)));
    const px = X(ci), py = Y(f(ci / (N - 1)));
    ctx.strokeStyle = C.rgba('ink', 0.22); ctx.lineWidth = 1;
    line(ctx, px, top, px, bot);
    const pulse = (t * 0.9) % 1;
    ctx.strokeStyle = C.rgba('accent', 0.6 * (1 - pulse));
    ctx.beginPath(); ctx.arc(px, py, 4 + pulse * 16, 0, TAU); ctx.stroke();
    ctx.fillStyle = C.bg; dot(ctx, px, py, 4.5);
    ctx.strokeStyle = C.accent; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(px, py, 4.5, 0, TAU); ctx.stroke();
  };

  /* ── PM Time Tracker · relógio de categorias ────────────────────── */
  G.pmtt = function (ctx, w, h, t, C) {
    const cx = w / 2, cy = h / 2, m = Math.min(w, h), R = m * 0.3;
    ctx.lineCap = 'butt';
    ctx.strokeStyle = C.rgba('ink', 0.4);
    ctx.lineWidth = Math.max(1, m / 260);
    for (let i = 0; i < 60; i++) {
      const a = i / 60 * TAU - Math.PI / 2;
      const r0 = R * 1.28, len = i % 5 ? R * 0.05 : R * 0.13;
      line(ctx, cx + Math.cos(a) * r0, cy + Math.sin(a) * r0, cx + Math.cos(a) * (r0 + len), cy + Math.sin(a) * (r0 + len));
    }
    const segs = [0.24, 0.13, 0.19, 0.09, 0.17, 0.12];
    const drawn = ease(t / 2.2) * TAU;
    let a0 = 0; const gap = 0.045;
    ctx.lineWidth = Math.max(3, R * 0.24);
    segs.forEach((s, i) => {
      const span = s * TAU;
      const fill = clamp((drawn - a0) / span);
      if (fill > 0) {
        ctx.strokeStyle = i === 0 ? C.accent : C.rgba('ink', i % 2 ? 0.6 : 0.26);
        ctx.beginPath();
        ctx.arc(cx, cy, R, -Math.PI / 2 + a0 + gap, -Math.PI / 2 + a0 + gap + Math.max(0, (span - gap * 2) * fill));
        ctx.stroke();
      }
      a0 += span;
    });
    const ha = -Math.PI / 2 + t * 0.5;
    ctx.strokeStyle = C.ink; ctx.lineWidth = Math.max(1.5, m / 130); ctx.lineCap = 'round';
    line(ctx, cx, cy, cx + Math.cos(ha) * R * 0.66, cy + Math.sin(ha) * R * 0.66);
    ctx.lineCap = 'butt';
    ctx.fillStyle = C.accent; dot(ctx, cx, cy, Math.max(2, R * 0.07));
  };

  /* ── FlowVoice · fala crua vira texto polido ────────────────────── */
  G.flowvoice = function (ctx, w, h, t, C) {
    const m = Math.min(w, h);
    if (m < 110) {
      const n = 9, bw = w * 0.055;
      for (let i = 0; i < n; i++) {
        const x = w * 0.2 + i * (w * 0.6 / (n - 1));
        const a = 0.25 + 0.75 * Math.abs(Math.sin(t * 6 + i * 1.3)) * (0.5 + 0.5 * Math.abs(nz(i + t)));
        const hh = a * h * 0.28;
        ctx.fillStyle = i === 4 ? C.accent : C.rgba('ink', 0.8);
        ctx.fillRect(x - bw / 2, h / 2 - hh, bw, hh * 2);
      }
      return;
    }
    const T = 10.5, ph = t % T;
    ctx.globalAlpha = 1 - seg(ph, 9.8, T);
    const pad = w * 0.07, fs = clamp(w * 0.03, 10, 15);

    // campo de texto de um app qualquer
    const fx = pad, fy = h * 0.07, fw = w - pad * 2, fh = h * 0.47;
    ctx.fillStyle = C.mix('ink', 0.04); ctx.fillRect(fx, fy, fw, fh);
    ctx.strokeStyle = C.rgba('ink', 0.22); ctx.lineWidth = 1; ctx.strokeRect(fx + 0.5, fy + 0.5, fw - 1, fh - 1);
    label(ctx, 'Nova mensagem', fx + fs, fy + fs * 1.3, fs * 0.78, 'mono', 400, C.muted);
    line(ctx, fx, fy + fs * 2.6, fx + fw, fy + fs * 2.6);

    const polished = 'Você recebeu meu relatório de ontem à tarde? Queria saber se está tudo certo.';
    font(ctx, fs * 1.28, 'sans', 500);
    const lines = wrap(ctx, polished, fw - fs * 2);
    const lh = fs * 1.75;
    let left = Math.floor(seg(ph, 4.5, 7.3) * polished.length);
    let cx = fx + fs, cy = fy + fs * 3.9;
    ctx.fillStyle = C.ink; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
    lines.forEach((ln, i) => {
      if (left <= 0) return;
      const part = ln.slice(0, left);
      left -= ln.length + 1;
      ctx.fillText(part, fx + fs, fy + fs * 3.9 + i * lh);
      cx = fx + fs + ctx.measureText(part).width; cy = fy + fs * 3.9 + i * lh;
    });
    if (Math.floor(t * 2.2) % 2 === 0) { ctx.fillStyle = C.accent; ctx.fillRect(cx + 2, cy - fs * 0.75, 2, fs * 1.5); }

    // janelinha do FlowVoice
    const px = w * 0.1, pw = w * 0.8, py = h * 0.61, pH = h * 0.32;
    ctx.fillStyle = C.ink; rrect(ctx, px, py, pw, pH, 8); ctx.fill();
    const recording = ph < 3.7, polishing = ph >= 3.7 && ph < 4.5;
    const state = recording ? 'GRAVANDO' : polishing ? 'POLINDO COM IA' : 'DIGITADO';
    ctx.fillStyle = recording ? C.rgba('accent', 0.55 + 0.45 * Math.sin(t * 8)) : C.accent;
    dot(ctx, px + fs * 1.1, py + fs * 1.25, fs * 0.32);
    label(ctx, state, px + fs * 1.8, py + fs * 1.25, fs * 0.78, 'mono', 500, C.bg);
    label(ctx, 'Ctrl + Shift + Space', px + pw - fs, py + fs * 1.25, fs * 0.72, 'mono', 400, C.rgba('bg', 0.55), 'right');

    const raw = '"então queria saber se... é... você recebeu meu relatório ontem a tarde tipo tá certo?"';
    font(ctx, fs * 0.82, 'mono', 400);
    const rawLines = wrap(ctx, typed(raw, seg(ph, 0.2, 3.5)), pw - fs * 2);
    const shown = rawLines.slice(-2);
    ctx.fillStyle = C.rgba('bg', 0.72); ctx.textAlign = 'left';
    shown.forEach((ln, i) => ctx.fillText(ln, px + fs, py + fs * 2.9 + i * fs * 1.35));

    const bars = 34, bx = px + fs, bwid = pw - fs * 2, by = py + pH - fs * 1.4, bw = bwid / bars;
    for (let i = 0; i < bars; i++) {
      let a = 0.08;
      if (recording) a = 0.2 + 0.8 * Math.abs(nz(i * 0.5 + t * 7)) * (0.4 + 0.6 * Math.abs(Math.sin(t * 3 + i)));
      const hh = Math.max(1, a * fs * 0.9);
      const sweep = polishing && Math.abs(i / bars - seg(ph, 3.7, 4.5)) < 0.08;
      ctx.fillStyle = sweep ? C.accent : C.rgba('bg', recording ? 0.85 : 0.35);
      ctx.fillRect(bx + i * bw + bw * 0.2, by - hh, bw * 0.6, hh * 2);
    }
    ctx.globalAlpha = 1;
  };

  /* ── Semantic Tab Grouper · abas viram grupo ────────────────────── */
  G.stg = function (ctx, w, h, t, C) {
    const m = Math.min(w, h), small = m < 110;
    const TABS = ['Pull requests', 'LATAM · Reservas', 'Sprint 42 · Notion', 'Skyscanner', 'YouTube', 'Google Voos'];
    const TRAVEL = [1, 3, 5], AFTER = [1, 3, 5, 0, 2, 4];
    const T = 9.5, ph = t % T;
    const k = ease(seg(ph, 4.7, 5.6)) * (1 - ease(seg(ph, 8.9, T)));

    const pad = small ? w * 0.06 : w * 0.05;
    const wx = pad, wy = small ? h * 0.26 : h * 0.07, ww = w - pad * 2, wh = small ? h * 0.48 : h * 0.86;
    ctx.fillStyle = C.mix('ink', 0.05); rrect(ctx, wx, wy, ww, wh, small ? 3 : 8); ctx.fill();
    ctx.strokeStyle = C.rgba('ink', 0.28); ctx.lineWidth = 1; ctx.stroke();

    const gut = small ? 2 : 8;
    let sy = wy + gut;
    const th = small ? wh * 0.3 : clamp(h * 0.065, 22, 34);
    if (!small) {
      ctx.fillStyle = C.rgba('ink', 0.3);
      for (let i = 0; i < 3; i++) dot(ctx, wx + 14 + i * 12, wy + 14, 3.5);
      sy = wy + 28;
    }
    const chipW = (small ? ww * 0.16 : clamp(ww * 0.17, 64, 110)) * k;
    const tabW = (ww - gut * 2 - chipW) / 6;
    const fsz = clamp(th * 0.36, 7, 11);

    if (chipW > 2) {
      ctx.fillStyle = C.accent; rrect(ctx, wx + gut, sy + th * 0.18, chipW - 4, th * 0.64, th * 0.32); ctx.fill();
      if (!small && k > 0.6) {
        ctx.globalAlpha = seg(k, 0.6, 1);
        font(ctx, fsz, 'sans', 600);
        label(ctx, ell(ctx, 'Passagens', chipW - 16), wx + gut + (chipW - 4) / 2, sy + th / 2, fsz, 'sans', 600, C.bg, 'center');
        ctx.globalAlpha = 1;
      }
    }
    TABS.forEach((d, i) => {
      const isT = TRAVEL.includes(i);
      const pos = lerp(i, AFTER.indexOf(i), k);
      const x = wx + gut + chipW + pos * tabW;
      const scan = isT && ph > 1.3 + TRAVEL.indexOf(i) * 0.4 && ph < 4.8;
      ctx.fillStyle = i === 5 ? C.mix('ink', 0.13) : C.mix('ink', 0.08);
      if (isT && k > 0) ctx.fillStyle = C.rgba('accent', 0.1 + 0.08 * k);
      rrect(ctx, x + 1, sy, tabW - 2, th, small ? 1 : 5); ctx.fill();
      if (scan) { ctx.strokeStyle = C.rgba('accent', 0.55 + 0.45 * Math.sin(t * 7)); ctx.lineWidth = 1.5; ctx.stroke(); ctx.lineWidth = 1; }
      if (isT && k > 0.05) { ctx.fillStyle = C.accent; ctx.fillRect(x + 3, sy + th - 2, (tabW - 6) * k, 2); }
      ctx.fillStyle = isT && k > 0.5 ? C.accent : C.rgba('ink', 0.4);
      dot(ctx, x + (small ? tabW / 2 : 11), sy + th / 2, small ? 1.4 : 3);
      if (!small) {
        font(ctx, fsz, 'mono', 400);
        label(ctx, ell(ctx, d, tabW - 24), x + 19, sy + th / 2, fsz, 'mono', 400, C.rgba('ink', 0.75));
      }
    });
    if (small) return;

    const ay = sy + th + 8, ah = th * 0.9;
    ctx.fillStyle = C.mix('ink', 0.1); rrect(ctx, wx + gut, ay, ww - gut * 2, ah, ah / 2); ctx.fill();
    label(ctx, '←  →  ↻     google.com/flights', wx + gut + 14, ay + ah / 2, fsz, 'mono', 400, C.muted);

    // página aberta: busca de voos
    const bx = wx + 20, bwid = ww - 40, bodyY = ay + ah + 22;
    label(ctx, 'Voos', bx, bodyY + fsz, fsz * 2, 'sans', 600, C.rgba('ink', 0.85));
    const iw = (bwid - 10) / 2, ih = fsz * 2.8, iy = bodyY + fsz * 3;
    [['GRU  São Paulo', 0], ['EZE  Buenos Aires', 1]].forEach(([s2, i]) => {
      ctx.strokeStyle = C.rgba('ink', 0.2); rrect(ctx, bx + i * (iw + 10), iy, iw, ih, 4); ctx.stroke();
      font(ctx, fsz, 'mono', 400);
      label(ctx, ell(ctx, s2, iw - 16), bx + i * (iw + 10) + 10, iy + ih / 2, fsz, 'mono', 400, C.rgba('ink', 0.7));
    });
    for (let i = 0; i < 4; i++) {
      const ry = iy + ih + fsz * 1.6 + i * fsz * 3.2;
      if (ry > wy + wh - fsz * 7) break;
      ctx.strokeStyle = C.rgba('ink', 0.1); line(ctx, bx, ry + fsz * 2.6, bx + bwid, ry + fsz * 2.6);
      ctx.fillStyle = C.rgba('ink', 0.35); dot(ctx, bx + 6, ry + fsz * 1.2, 4);
      ctx.fillStyle = C.rgba('ink', 0.22); ctx.fillRect(bx + 20, ry + fsz * 0.7, bwid * (0.28 + hash(i) * 0.12), 6);
      ctx.fillStyle = C.rgba('ink', 0.12); ctx.fillRect(bx + 20, ry + fsz * 1.5, bwid * 0.2, 5);
      label(ctx, 'R$ ' + (980 + i * 137) + ',00', bx + bwid, ry + fsz * 1.2, fsz * 1.05, 'mono', 500, C.rgba('ink', 0.7), 'right');
    }

    // cartão de sugestão da extensão
    const appear = ease(seg(ph, 2.3, 2.9)) * (1 - seg(ph, 4.9, 5.3));
    if (appear > 0.01) {
      const cw = Math.min(ww * 0.7, 300), ch = Math.min(wh * 0.5, 200);
      const cx = wx + ww - cw - 14, cy = wy + wh - ch - 14 + (1 - appear) * 16;
      ctx.globalAlpha = appear;
      ctx.fillStyle = C.bg; rrect(ctx, cx, cy, cw, ch, 8); ctx.fill();
      ctx.strokeStyle = C.rgba('ink', 0.3); ctx.stroke();
      const f = clamp(cw * 0.042, 8, 11), ip = f * 1.4;
      label(ctx, 'SUGESTÃO DE GRUPO', cx + ip, cy + ip * 1.1, f * 0.9, 'mono', 400, C.muted);
      label(ctx, 'sim 0.82', cx + cw - ip, cy + ip * 1.1, f * 0.9, 'mono', 500, C.accent, 'right');
      label(ctx, 'Passagens · voos', cx + ip, cy + ip * 2.6, f * 1.35, 'sans', 600, C.ink);
      ['latam.com/reservas', 'skyscanner.com.br', 'google.com/flights'].forEach((d, i) => {
        const yy = cy + ip * 4 + i * f * 1.7;
        if (yy > cy + ch - f * 4) return;
        ctx.fillStyle = C.accent; dot(ctx, cx + ip + 2, yy, 2.5);
        label(ctx, d, cx + ip + 10, yy, f, 'mono', 400, C.rgba('ink', 0.75));
      });
      const bh = f * 2.4, byy = cy + ch - bh - ip * 0.8, bw = (cw - ip * 3) / 2;
      ctx.strokeStyle = C.rgba('ink', 0.3); rrect(ctx, cx + ip, byy, bw, bh, 4); ctx.stroke();
      label(ctx, 'Ignorar', cx + ip + bw / 2, byy + bh / 2, f, 'sans', 500, C.ink, 'center');
      const press = ph > 4.1 && ph < 4.5;
      ctx.fillStyle = press ? C.mix('accent', 0.75) : C.accent;
      rrect(ctx, cx + ip * 2 + bw + (press ? 2 : 0), byy + (press ? 1 : 0), bw - (press ? 4 : 0), bh - (press ? 2 : 0), 4); ctx.fill();
      label(ctx, 'Agrupar', cx + ip * 2 + bw * 1.5, byy + bh / 2, f, 'sans', 600, C.bg, 'center');
      ctx.globalAlpha = 1;
    }
    if (k > 0.9) {
      label(ctx, '3 abas sobre o mesmo assunto agrupadas', wx + 20, wy + wh - 22, fsz, 'mono', 400, C.rgba('ink', 0.6 * seg(k, 0.9, 1)));
    }
  };

  /* ── Eatz Tablet · totem do cardápio (vermelho da marca) ────────── */
  const RED = '#e3262b';
  const DISHES = [
    { tag: 'OFERTA ESPECIAL', n: 'Combo Casal · Picanha + Vinho', p: 'R$ 109,90', c: ['#7c2f17', '#b8532a', '#e08a4f'] },
    { tag: 'PRATO DO DIA', n: 'Salmão Grelhado', p: 'R$ 54,90', c: ['#e0763c', '#f4a261', '#4c8c3f'] },
    { tag: 'HAPPY HOUR', n: 'Drinks 2 por 1', p: 'R$ 17,50', c: ['#d99a2b', '#f5d27a', '#b3541e'] }
  ];
  function plate(ctx, cx, cy, r, col, spin) {
    ctx.fillStyle = '#ece6dc'; dot(ctx, cx, cy, r);
    ctx.fillStyle = '#d9d2c6'; dot(ctx, cx, cy, r * 0.8);
    ctx.save(); ctx.translate(cx, cy); ctx.rotate(spin);
    for (let i = 0; i < 5; i++) {
      ctx.fillStyle = col[i % 3];
      ctx.beginPath(); ctx.ellipse(Math.cos(i * 1.3) * r * 0.28, Math.sin(i * 1.3) * r * 0.22, r * 0.34, r * 0.16, i * 0.7, 0, TAU); ctx.fill();
    }
    ctx.restore();
  }
  G.eatz = function (ctx, w, h, t, C) {
    const m = Math.min(w, h), small = m < 110;
    let tw = w * 0.92, th = tw * 0.64;
    if (th > h * 0.84) { th = h * 0.84; tw = th / 0.64; }
    const x0 = (w - tw) / 2, y0 = (h - th) / 2, bez = Math.max(3, tw * 0.028);
    ctx.fillStyle = '#0a0a0b'; rrect(ctx, x0, y0, tw, th, tw * 0.045); ctx.fill();
    ctx.strokeStyle = C.rgba('ink', 0.3); ctx.lineWidth = 1; ctx.stroke();
    const sx = x0 + bez, sy = y0 + bez, sw = tw - bez * 2, sh = th - bez * 2;
    ctx.fillStyle = '#161617'; ctx.fillRect(sx, sy, sw, sh);

    const idx = Math.floor(t / 3.2) % 3, lt = t % 3.2, d = DISHES[idx];
    const fade = Math.min(1, lt / 0.35, (3.2 - lt) / 0.35);
    const hw = sw * 0.52, f = clamp(sw * 0.026, 6, 13);

    ctx.save(); ctx.beginPath(); ctx.rect(sx, sy, hw, sh); ctx.clip();
    ctx.globalAlpha = fade;
    plate(ctx, sx + hw * 0.5, sy + sh * 0.38, Math.min(hw, sh) * 0.36, d.c, t * 0.15);
    ctx.globalAlpha = 1;
    const g = ctx.createLinearGradient(0, sy + sh * 0.4, 0, sy + sh);
    g.addColorStop(0, 'rgba(22,22,23,0)'); g.addColorStop(0.55, 'rgba(22,22,23,0.92)'); g.addColorStop(1, 'rgba(22,22,23,1)');
    ctx.fillStyle = g; ctx.fillRect(sx, sy, hw, sh);
    if (!small) {
      ctx.globalAlpha = fade;
      font(ctx, f * 0.72, 'sans', 700);
      const tagW = ctx.measureText(d.tag).width + f;
      ctx.fillStyle = RED; rrect(ctx, sx + f, sy + sh * 0.66, tagW, f * 1.3, 3); ctx.fill();
      label(ctx, d.tag, sx + f * 1.5, sy + sh * 0.66 + f * 0.65, f * 0.72, 'sans', 700, '#fff');
      font(ctx, f * 1.15, 'sans', 700);
      label(ctx, ell(ctx, d.n, hw - f * 2), sx + f, sy + sh * 0.66 + f * 2.5, f * 1.15, 'sans', 700, '#fff');
      label(ctx, d.p, sx + f, sy + sh * 0.66 + f * 4.2, f * 1.2, 'sans', 700, '#fff');
      ctx.globalAlpha = 1;
      const bw = f * 7, bh = f * 1.9, bx = sx + hw - bw - f, by = sy + sh - bh - f * 1.6;
      const press = lt > 1.7 && lt < 2.0;
      ctx.fillStyle = press ? '#b91c20' : RED; rrect(ctx, bx, by, bw, bh, bh / 2); ctx.fill();
      label(ctx, '+ Adicionar', bx + bw / 2, by + bh / 2, f * 0.8, 'sans', 700, '#fff', 'center');
      if (lt > 1.7 && lt < 2.5) {
        const r = seg(lt, 1.7, 2.5);
        ctx.strokeStyle = 'rgba(255,255,255,' + (1 - r).toFixed(3) + ')'; ctx.lineWidth = 1.5;
        ctx.beginPath(); ctx.arc(bx + bw / 2, by + bh / 2, bh * (0.4 + r * 1.4), 0, TAU); ctx.stroke();
      }
    }
    ctx.restore();
    for (let i = 0; i < 3; i++) {
      ctx.fillStyle = i === idx ? RED : 'rgba(255,255,255,0.3)';
      ctx.fillRect(sx + f + i * (small ? 5 : f * 1.2), sy + sh - (small ? 4 : f * 0.7), small ? 3 : (i === idx ? f * 0.9 : f * 0.4), small ? 2 : 3);
    }

    const gx = sx + hw + sw * 0.02, gw = sw - hw - sw * 0.04, cols = 2, rows = 3, gap = sw * 0.018;
    const cw = (gw - gap) / cols, ch = (sh - gap * (rows + 1)) / rows;
    const pal = [DISHES[0].c, DISHES[1].c, DISHES[2].c, ['#c94f3d', '#e6b35c', '#fff1d6'], ['#3f7d3a', '#8cc152', '#f0c05a'], ['#6b3a26', '#a86a3d', '#f1e3c8']];
    for (let i = 0; i < 6; i++) {
      const cx = gx + (i % cols) * (cw + gap), cy = sy + gap + Math.floor(i / cols) * (ch + gap);
      ctx.fillStyle = '#212123'; rrect(ctx, cx, cy, cw, ch, small ? 1 : 4); ctx.fill();
      plate(ctx, cx + cw * 0.5, cy + ch * 0.4, Math.min(cw, ch) * 0.3, pal[i], i + t * 0.05);
      if (!small) {
        ctx.fillStyle = RED; ctx.fillRect(cx + 4, cy + 4, cw * 0.32, f * 0.55);
        ctx.fillStyle = 'rgba(255,255,255,0.75)'; ctx.fillRect(cx + 4, cy + ch * 0.78, cw * 0.6, Math.max(2, f * 0.35));
        ctx.fillStyle = RED; ctx.fillRect(cx + 4, cy + ch * 0.88, cw * 0.3, Math.max(2, f * 0.35));
      }
    }
    if (!small) {
      // sacola com o contador de itens
      const count = 1 + Math.floor(t / 3.2) % 9 + (lt > 2 ? 1 : 0);
      const bx = sx + sw - f * 2.6, by = sy + f * 1.2;
      ctx.fillStyle = 'rgba(0,0,0,0.55)'; dot(ctx, bx, by, f * 1.2);
      ctx.strokeStyle = '#fff'; ctx.lineWidth = 1.3; ctx.strokeRect(bx - f * 0.45, by - f * 0.25, f * 0.9, f * 0.75);
      ctx.beginPath(); ctx.arc(bx, by - f * 0.25, f * 0.28, Math.PI, 0); ctx.stroke(); ctx.lineWidth = 1;
      ctx.fillStyle = RED; dot(ctx, bx + f * 0.85, by - f * 0.8, f * 0.6);
      label(ctx, String(count), bx + f * 0.85, by - f * 0.78, f * 0.7, 'sans', 700, '#fff', 'center');
    }
  };

  /* ── Check-in Hotel PMS · modal de check-in sendo preenchido ────── */
  const GREEN = '#1f9d61';
  G.hotel = function (ctx, w, h, t, C) {
    const m = Math.min(w, h), small = m < 110;
    const T = 11.5, ph = t % T;
    const fadeOut = 1 - seg(ph, 11, T);
    ctx.globalAlpha = fadeOut;
    const mx = w * 0.05, my = small ? h * 0.12 : h * 0.04, mw = w - mx * 2, mh = h - my * 2;
    ctx.fillStyle = C.mix('ink', 0.04); rrect(ctx, mx, my, mw, mh, 6); ctx.fill();
    ctx.strokeStyle = C.rgba('ink', 0.25); ctx.lineWidth = 1; ctx.stroke();

    const hh = small ? mh * 0.22 : clamp(mh * 0.13, 40, 62);
    ctx.save(); rrect(ctx, mx, my, mw, mh, 6); ctx.clip();
    ctx.fillStyle = C.accent; ctx.fillRect(mx, my, mw, hh);
    ctx.restore();

    const fields = [['DATA INICIAL', '26/03/2026 14:00'], ['DATA FINAL', '27/03/2026 11:59'], ['CPF', '123.456.789-00'],
      ['TITULAR', 'Júlio Caliberda'], ['NACIONALIDADE', 'Brasil'], ['ÓRGÃO EXPEDIDOR', 'SSP/PR'],
      ['MOTIVO DA VIAGEM', 'Lazer / Férias'], ['MEIO DE TRANSPORTE', 'Automóvel']];
    if (small) {
      for (let i = 0; i < 4; i++) {
        const y = my + hh + 6 + i * (mh - hh - 22) / 4;
        ctx.fillStyle = C.rgba('ink', 0.15); ctx.fillRect(mx + 5, y, mw - 10, 4);
        ctx.fillStyle = C.rgba('ink', 0.6); ctx.fillRect(mx + 5, y, (mw - 10) * seg(ph, 0.5 + i * 1.2, 1.3 + i * 1.2), 4);
      }
      ctx.fillStyle = GREEN; ctx.fillRect(mx + mw * 0.55, my + mh - 11, mw * 0.4, 7);
      ctx.globalAlpha = 1; return;
    }
    const f = clamp(mw * 0.024, 8, 12);
    font(ctx, f * 0.85, 'mono', 500);
    const chipW = ctx.measureText('WALK-IN').width + f * 1.4;
    ctx.fillStyle = 'rgba(255,255,255,0.22)';
    rrect(ctx, mx + f * 1.2, my + hh / 2 - f, chipW, f * 2, 3); ctx.fill();
    label(ctx, 'WALK-IN', mx + f * 1.2 + chipW / 2, my + hh / 2, f * 0.85, 'mono', 500, '#fff', 'center');
    label(ctx, 'UH: 108', mx + f * 2.2 + chipW, my + hh / 2 - f * 0.55, f * 1.35, 'sans', 700, '#fff');
    label(ctx, 'Quarto Superior (Duplo)', mx + f * 2.2 + chipW, my + hh / 2 + f * 0.9, f * 0.9, 'sans', 400, 'rgba(255,255,255,0.8)');

    const tabsY = my + hh, tabH = f * 3;
    let tx = mx + f * 1.2;
    ['Hospedagem', 'Faturamento', 'Acompanhantes', 'Tarifas'].forEach((s, i) => {
      font(ctx, f, 'sans', i ? 400 : 600);
      const tw = ctx.measureText(s).width;
      if (tx + tw > mx + mw - f) return;
      label(ctx, s, tx, tabsY + tabH / 2, f, 'sans', i ? 400 : 600, i ? C.muted : C.ink);
      if (!i) { ctx.fillStyle = C.accent; ctx.fillRect(tx, tabsY + tabH - 2, tw, 2); }
      tx += tw + f * 1.6;
    });
    ctx.strokeStyle = C.rgba('ink', 0.15); line(ctx, mx, tabsY + tabH, mx + mw, tabsY + tabH);

    const footH = f * 4.4, bodyY = tabsY + tabH + f * 1.2, bodyH = my + mh - footH - bodyY - f * 0.6;
    const cols = 2, gx = f * 1.2, cw = (mw - gx * 3) / cols, rh = Math.min(bodyH / 4, f * 5.2);
    fields.forEach(([lab, val], i) => {
      const cx = mx + gx + (i % cols) * (cw + gx), cy = bodyY + Math.floor(i / cols) * rh;
      label(ctx, lab, cx, cy + f * 0.6, f * 0.72, 'mono', 400, C.muted);
      const iy = cy + f * 1.4, ih = Math.max(f * 1.6, Math.min(f * 2.5, rh - f * 2));
      const p = seg(ph, 0.4 + i * 0.66, 0.95 + i * 0.66);
      ctx.fillStyle = C.bg; ctx.fillRect(cx, iy, cw, ih);
      const focus = p > 0 && p < 1;
      ctx.strokeStyle = focus ? C.accent : C.rgba('ink', 0.22); ctx.lineWidth = focus ? 1.5 : 1;
      ctx.strokeRect(cx + 0.5, iy + 0.5, cw - 1, ih - 1); ctx.lineWidth = 1;
      font(ctx, f, 'sans', 500);
      label(ctx, ell(ctx, typed(val, p), cw - f * 3), cx + f * 0.7, iy + ih / 2, f, 'sans', 500, C.ink);
      if (p >= 1) {
        ctx.strokeStyle = GREEN; ctx.lineWidth = 1.6; ctx.beginPath();
        const kx = cx + cw - f * 1.3, ky = iy + ih / 2;
        ctx.moveTo(kx - f * 0.35, ky); ctx.lineTo(kx - f * 0.08, ky + f * 0.3); ctx.lineTo(kx + f * 0.4, ky - f * 0.35); ctx.stroke(); ctx.lineWidth = 1;
      }
    });

    const noteY = bodyY + rh * 4 + f * 0.8;
    if (noteY < my + mh - footH - f) {
      const ok = ph > 5.8;
      ctx.fillStyle = ok ? GREEN : C.rgba('ink', 0.3); dot(ctx, mx + gx + 4, noteY, 3.5);
      label(ctx, ok ? 'FNRH digital pronta para envio' : 'FNRH digital · preenchendo dados obrigatórios', mx + gx + 14, noteY, f * 0.8, 'mono', 400, ok ? GREEN : C.muted);
    }
    const fy = my + mh - footH;
    ctx.strokeStyle = C.rgba('ink', 0.15); line(ctx, mx, fy, mx + mw, fy);
    label(ctx, 'TOTAL', mx + f * 1.2, fy + footH * 0.35, f * 0.72, 'mono', 400, C.muted);
    label(ctx, 'R$ 199,00', mx + f * 1.2, fy + footH * 0.66, f * 1.1, 'sans', 700, C.ink);
    const bw = Math.min(mw * 0.36, f * 10), bh = f * 2.6, bx = mx + mw - bw - f * 1.2, by = fy + (footH - bh) / 2;
    const press = ph > 6.1 && ph < 6.4;
    ctx.fillStyle = press ? '#177a4b' : GREEN; rrect(ctx, bx + (press ? 2 : 0), by + (press ? 1 : 0), bw - (press ? 4 : 0), bh - (press ? 2 : 0), 4); ctx.fill();
    label(ctx, '✓  Check-in', bx + bw / 2, by + bh / 2, f, 'sans', 700, '#fff', 'center');

    const done = ease(seg(ph, 6.4, 6.9));
    if (done > 0) {
      ctx.globalAlpha = Math.min(fadeOut, done);
      ctx.fillStyle = C.rgba('bg', 0.94); ctx.fillRect(mx + 1, tabsY, mw - 2, mh - hh - 1);
      const cy = tabsY + (mh - hh) * 0.42, r = Math.max(0.01, f * 3 * easeBack(seg(ph, 6.5, 7.1)));
      ctx.fillStyle = GREEN; dot(ctx, w / 2, cy, r);
      ctx.strokeStyle = '#fff'; ctx.lineWidth = f * 0.35; ctx.lineCap = 'round';
      ctx.beginPath(); ctx.moveTo(w / 2 - r * 0.38, cy + r * 0.02); ctx.lineTo(w / 2 - r * 0.08, cy + r * 0.32); ctx.lineTo(w / 2 + r * 0.42, cy - r * 0.28); ctx.stroke();
      ctx.lineCap = 'butt'; ctx.lineWidth = 1;
      label(ctx, 'Check-in realizado', w / 2, cy + f * 5, f * 1.5, 'sans', 700, C.ink, 'center');
      label(ctx, 'UH 108 · Júlio Caliberda · 1 diária', w / 2, cy + f * 7, f * 0.85, 'mono', 400, C.muted, 'center');
    }
    ctx.globalAlpha = 1;
  };

  /* ── API Consulta CNPJ · requisição e JSON de resposta ──────────── */
  G.cnpj = function (ctx, w, h, t, C) {
    const m = Math.min(w, h);
    if (m < 110) {
      label(ctx, '{ }', w / 2, h * 0.36, m * 0.32, 'mono', 500, C.accent, 'center');
      for (let i = 0; i < 3; i++) {
        ctx.fillStyle = C.rgba('ink', 0.5); ctx.fillRect(w * 0.22, h * (0.6 + i * 0.1), w * (0.56 * seg(t % 4, i * 0.5, i * 0.5 + 0.8)), 2.5);
      }
      return;
    }
    const T = 9.5, ph = t % T, fadeOut = 1 - seg(ph, 9, T);
    ctx.globalAlpha = fadeOut;
    const pad = w * 0.07;
    const J = [['{', ''], ['  "cnpj"', '"00.000.000/0001-91"'], ['  "razao_social"', '"BANCO DO BRASIL SA"'],
      ['  "natureza_juridica"', '"Sociedade de Economia Mista"'], ['  "situacao"', '"ATIVA"'],
      ['  "municipio"', '"BRASILIA"'], ['  "uf"', '"DF"'], ['}', '']];
    let f = clamp(w * 0.03, 9, 14);
    font(ctx, f, 'mono');
    const longest = Math.max(...J.map(([k, v]) => ctx.measureText('00  ' + k + ': ' + v + ',').width));
    if (longest > w - pad * 2 - f * 2) f *= (w - pad * 2 - f * 2) / longest;

    const by = h * 0.07, bh = f * 2.8;
    ctx.strokeStyle = C.rgba('ink', 0.28); ctx.lineWidth = 1; ctx.strokeRect(pad + 0.5, by + 0.5, w - pad * 2 - 1, bh);
    ctx.fillStyle = C.accent; ctx.fillRect(pad, by, f * 3.6, bh + 1);
    label(ctx, 'GET', pad + f * 1.8, by + bh / 2, f * 0.95, 'mono', 500, C.bg, 'center');
    label(ctx, typed('/cnpj/00000000000191', seg(ph, 0.3, 1.4)), pad + f * 4.6, by + bh / 2, f, 'mono', 400, C.ink);

    const sy = by + bh + f * 1.2, jy = sy + f * 3.2;
    const travel = seg(ph, 1.5, 2.1);
    if (travel > 0 && travel < 1) {
      ctx.fillStyle = C.accent; ctx.fillRect(w / 2 - 3, lerp(by + bh, jy, travel) - 3, 6, 6);
    }
    if (ph > 2.1) {
      ctx.globalAlpha = Math.min(fadeOut, seg(ph, 2.1, 2.4));
      ctx.fillStyle = GREEN; ctx.fillRect(pad, sy, f * 5.4, f * 1.9);
      label(ctx, '200 OK', pad + f * 2.7, sy + f * 0.95, f * 0.85, 'mono', 500, '#fff', 'center');
      label(ctx, '84 ms · application/json', pad + f * 6.2, sy + f * 0.95, f * 0.85, 'mono', 400, C.muted);
      ctx.globalAlpha = fadeOut;
    }

    const jh = Math.min(h * 0.93 - jy, J.length * f * 1.9 + f * 1.6);
    ctx.fillStyle = C.mix('ink', 0.05); ctx.fillRect(pad, jy, w - pad * 2, jh);
    const lh = Math.min(f * 1.9, (jh - f * 2) / J.length);
    J.forEach(([k, v], i) => {
      const at = 2.4 + i * 0.3;
      if (ph < at) return;
      const y = jy + f * 1.4 + i * lh;
      label(ctx, String(i + 1).padStart(2, '0'), pad + f * 0.8, y, f * 0.8, 'mono', 400, C.rgba('muted', 0.7));
      let x = pad + f * 3;
      label(ctx, k, x, y, f, 'mono', 400, C.ink);
      if (!v) return;
      x += ctx.measureText(k).width;
      label(ctx, ': ', x, y, f, 'mono', 400, C.muted);
      x += ctx.measureText(': ').width;
      const val = typed(v, seg(ph, at, at + 0.3));
      label(ctx, val, x, y, f, 'mono', 500, C.accent);
      if (i < J.length - 2 && val.length === v.length) label(ctx, ',', x + ctx.measureText(val).width, y, f, 'mono', 400, C.muted);
    });
    ctx.globalAlpha = 1;
  };

  /* ── Script Sandbox · cola o script, executa, o webchat aparece ─── */
  G.sandbox = function (ctx, w, h, t, C) {
    const m = Math.min(w, h);
    if (m < 110) {
      const ph = t % 5;
      ctx.strokeStyle = C.rgba('ink', 0.4); ctx.lineWidth = 1; ctx.strokeRect(w * 0.12, h * 0.16, w * 0.76, h * 0.68);
      ctx.fillStyle = C.rgba('ink', 0.45);
      for (let i = 0; i < 3; i++) ctx.fillRect(w * 0.2, h * (0.28 + i * 0.1), w * (0.3 + hash(i) * 0.3), 2.5);
      const pop = easeBack(seg(ph, 1.5, 2));
      ctx.fillStyle = C.accent; dot(ctx, w * 0.72, h * 0.7, Math.max(0.01, w * 0.08 * pop));
      return;
    }
    const T = 11, ph = t % T, fadeOut = 1 - seg(ph, 10.5, T);
    ctx.globalAlpha = fadeOut;
    const pad = w * 0.06, f = clamp(w * 0.024, 8, 12.5), gap = f * 1.2;
    const stacked = h > w * 0.85;
    let E, B, P;
    if (stacked) {
      E = [pad, h * 0.05, w - pad * 2, h * 0.36];
      B = [pad, E[1] + E[3] + gap * 0.7, w - pad * 2, f * 2.8];
      P = [pad, B[1] + B[3] + gap, w - pad * 2, h * 0.95 - (B[1] + B[3] + gap)];
    } else {
      const ew = (w - pad * 3) * 0.5;
      E = [pad, h * 0.08, ew, h * 0.68];
      B = [pad, E[1] + E[3] + gap * 0.7, ew, f * 2.8];
      P = [pad * 2 + ew, h * 0.08, w - pad * 3 - ew, h * 0.84];
    }
    label(ctx, 'COLE O CÓDIGO COMPLETO ABAIXO', E[0], E[1] + f * 0.5, f * 0.75, 'mono', 500, C.muted);
    const ey = E[1] + f * 1.4, eh = E[3] - f * 1.4;
    ctx.fillStyle = C.mix('ink', 0.05); ctx.fillRect(E[0], ey, E[2], eh);
    ctx.strokeStyle = C.rgba('ink', 0.2); ctx.lineWidth = 1; ctx.strokeRect(E[0] + 0.5, ey + 0.5, E[2] - 1, eh - 1);
    const CODE = ['<script src="webchat.js"></script>', '<script>', '  WebChat.init({', '    hotel: "108",', '    tema: "claro"', '  });', '</script>'];
    if (ph <= 0.7) {
      label(ctx, 'Cole aqui o script e a inicialização...', E[0] + f, ey + f * 1.4, f * 0.9, 'mono', 400, C.rgba('muted', 0.8));
    } else {
      const sel = 1 - seg(ph, 0.7, 1.6);
      const lh = Math.min(f * 1.5, (eh - f * 2) / CODE.length);
      font(ctx, f * 0.9, 'mono');
      CODE.forEach((ln, i) => {
        const y = ey + f * 1.2 + i * lh;
        if (sel > 0) { ctx.fillStyle = C.rgba('accent', 0.25 * sel); ctx.fillRect(E[0] + f * 0.6, y - lh / 2, Math.min(ctx.measureText(ln).width + 6, E[2] - f), lh); }
        const isTag = ln.trim().startsWith('<');
        font(ctx, f * 0.9, 'mono', isTag ? 500 : 400);
        label(ctx, ell(ctx, ln, E[2] - f * 1.6), E[0] + f, y, f * 0.9, 'mono', isTag ? 500 : 400, isTag ? C.accent : C.rgba('ink', 0.85));
      });
    }
    if (ph > 2.3) label(ctx, '// script carregado ✓', E[0] + f, ey + eh - f * 0.9, f * 0.8, 'mono', 400, GREEN);

    const press = ph > 1.8 && ph < 2.15;
    ctx.fillStyle = press ? C.mix('accent', 0.75) : C.accent;
    rrect(ctx, B[0] + (press ? 3 : 0), B[1] + (press ? 1 : 0), B[2] - (press ? 6 : 0), B[3] - (press ? 2 : 0), 6); ctx.fill();
    label(ctx, '▶  Executar e Testar', B[0] + B[2] / 2, B[1] + B[3] / 2, f * 1.05, 'sans', 600, C.bg, 'center');

    // prévia: navegador com o widget de chat
    ctx.fillStyle = C.mix('ink', 0.03); rrect(ctx, P[0], P[1], P[2], P[3], 8); ctx.fill();
    ctx.strokeStyle = C.rgba('ink', 0.25); ctx.stroke();
    const barH = f * 2.4;
    ctx.fillStyle = C.rgba('ink', 0.3);
    for (let i = 0; i < 3; i++) dot(ctx, P[0] + f * (1 + i * 0.9), P[1] + barH / 2, f * 0.28);
    font(ctx, f * 0.78, 'mono');
    label(ctx, ell(ctx, 'preview-hotel-instance.local/v3/test', P[2] - f * 5), P[0] + f * 3.8, P[1] + barH / 2, f * 0.78, 'mono', 400, C.muted);
    ctx.strokeStyle = C.rgba('ink', 0.15); line(ctx, P[0], P[1] + barH, P[0] + P[2], P[1] + barH);
    const by0 = P[1] + barH, bh = P[3] - barH;
    if (ph < 2.3) {
      label(ctx, 'Aguardando código para teste...', P[0] + P[2] / 2, by0 + bh / 2, f * 0.9, 'sans', 400, C.muted, 'center');
    } else {
      const k = seg(ph, 2.3, 2.7);
      ctx.fillStyle = C.rgba('ink', 0.1 * k);
      ctx.fillRect(P[0] + f, by0 + f, P[2] - f * 2, bh * 0.22);
      [0.7, 0.55, 0.62].forEach((q, i) => ctx.fillRect(P[0] + f, by0 + f * 1.8 + bh * 0.22 + i * f * 1.2, (P[2] - f * 2) * q, f * 0.5));

      const lr = f * 1.5, lx = P[0] + P[2] - lr - f, ly = by0 + bh - lr - f;
      const open = ease(seg(ph, 4, 4.5));
      if (open < 1) {
        ctx.fillStyle = C.accent; dot(ctx, lx, ly, Math.max(0.01, lr * easeBack(seg(ph, 2.8, 3.3))));
        if (ph > 3.3) { ctx.fillStyle = C.bg; rrect(ctx, lx - lr * 0.45, ly - lr * 0.35, lr * 0.9, lr * 0.6, 3); ctx.fill(); }
      }
      if (open > 0) {
        const cw = Math.min(P[2] - f * 2, f * 18) * open, chH = Math.min(bh - f * 2, f * 17) * open;
        const cx = P[0] + P[2] - f - cw, cy = by0 + bh - f - chH;
        ctx.fillStyle = C.bg; rrect(ctx, cx, cy, cw, chH, 8); ctx.fill();
        ctx.strokeStyle = C.rgba('ink', 0.25); ctx.stroke();
        ctx.save(); rrect(ctx, cx, cy, cw, chH, 8); ctx.clip();
        ctx.fillStyle = C.accent; ctx.fillRect(cx, cy, cw, f * 2.4);
        if (open > 0.9) {
          label(ctx, 'Atendimento', cx + f, cy + f * 1.2, f * 0.95, 'sans', 600, C.bg);
          const msgs = [[4.6, 0, 'Olá! Como posso ajudar?'], [5.8, 1, 'Quero fazer o check-in'], [7.4, 0, 'Claro! Qual o número da reserva?']];
          let yy = cy + f * 3.4;
          msgs.forEach(([at, me, s]) => {
            if (ph < at) return;
            font(ctx, f * 0.85, 'sans', 400);
            const tw = Math.min(ctx.measureText(s).width, cw - f * 4);
            const bx = me ? cx + cw - tw - f * 2 : cx + f * 0.8;
            ctx.fillStyle = me ? C.accent : C.mix('ink', 0.1);
            rrect(ctx, bx, yy, tw + f * 1.2, f * 1.9, 6); ctx.fill();
            label(ctx, ell(ctx, s, tw), bx + f * 0.6, yy + f * 0.95, f * 0.85, 'sans', 400, me ? C.bg : C.ink);
            yy += f * 2.4;
          });
          if (ph > 6.6 && ph < 7.4) {
            for (let i = 0; i < 3; i++) { ctx.fillStyle = C.rgba('ink', Math.floor(t * 4) % 3 === i ? 0.8 : 0.3); dot(ctx, cx + f * (1.4 + i * 0.8), yy + f * 0.9, f * 0.22); }
          }
        }
        ctx.restore();
      }
    }
    ctx.globalAlpha = 1;
  };

  /* ── Neon Strike · arcade de sobrevivência ──────────────────────── */
  G.neon = function (ctx, w, h, t, C, S, dt) {
    const m = Math.min(w, h), sx = w / 2, sy = h / 2;
    if (!S.init) { S.init = 1; S.en = []; S.bu = []; S.px = []; S.spawn = 0; S.fire = 0; S.ang = -Math.PI / 2; S.r = rng(3); }
    const r = S.r;
    S.spawn -= dt;
    if (S.spawn <= 0) {
      S.spawn = 0.45 + r() * 0.3;
      const a = r() * TAU;
      S.en.push({ x: sx + Math.cos(a) * m * 0.75, y: sy + Math.sin(a) * m * 0.75, v: m * (0.12 + r() * 0.08), rot: r() * TAU });
    }
    let target = null, best = 1e9;
    S.en.forEach((e) => {
      const dx = sx - e.x, dy = sy - e.y, d = Math.hypot(dx, dy) || 1;
      e.x += dx / d * e.v * dt; e.y += dy / d * e.v * dt; e.rot += dt * 2;
      if (d < best) { best = d; target = e; }
    });
    S.en = S.en.filter((e) => Math.hypot(sx - e.x, sy - e.y) > m * 0.05);
    if (target) {
      const want = Math.atan2(target.y - sy, target.x - sx);
      const diff = Math.atan2(Math.sin(want - S.ang), Math.cos(want - S.ang));
      S.ang += diff * Math.min(1, dt * 10);
      S.fire -= dt;
      if (S.fire <= 0 && Math.abs(diff) < 0.3) {
        S.fire = 0.2;
        S.bu.push({ x: sx, y: sy, vx: Math.cos(S.ang) * m * 1.3, vy: Math.sin(S.ang) * m * 1.3, life: 1 });
      }
    }
    S.bu.forEach((b) => { b.x += b.vx * dt; b.y += b.vy * dt; b.life -= dt * 1.2; });
    S.bu.forEach((b) => {
      S.en.forEach((e) => {
        if (!e.dead && b.life > 0 && Math.hypot(b.x - e.x, b.y - e.y) < m * 0.045) {
          e.dead = true; b.life = 0;
          for (let i = 0; i < 9; i++) {
            const a = r() * TAU, s = m * (0.1 + r() * 0.3);
            S.px.push({ x: e.x, y: e.y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, life: 1 });
          }
        }
      });
    });
    S.en = S.en.filter((e) => !e.dead);
    S.bu = S.bu.filter((b) => b.life > 0);
    S.px.forEach((p) => { p.x += p.vx * dt; p.y += p.vy * dt; p.vx *= 0.94; p.vy *= 0.94; p.life -= dt * 1.8; });
    S.px = S.px.filter((p) => p.life > 0);

    const es = m * 0.035;
    ctx.strokeStyle = C.ink; ctx.lineWidth = Math.max(1, m / 180);
    S.en.forEach((e) => { ctx.save(); ctx.translate(e.x, e.y); ctx.rotate(e.rot); ctx.strokeRect(-es / 2, -es / 2, es, es); ctx.restore(); });
    ctx.strokeStyle = C.accent; ctx.lineWidth = Math.max(1.5, m / 120);
    S.bu.forEach((b) => line(ctx, b.x, b.y, b.x - b.vx * 0.03, b.y - b.vy * 0.03));
    S.px.forEach((p) => { ctx.fillStyle = C.rgba('accent', p.life); ctx.fillRect(p.x - 1.5, p.y - 1.5, 3, 3); });

    const s = m * 0.055;
    ctx.save(); ctx.translate(sx, sy); ctx.rotate(S.ang + Math.PI / 2);
    ctx.beginPath(); ctx.moveTo(0, -s); ctx.lineTo(s * 0.7, s * 0.7); ctx.lineTo(0, s * 0.35); ctx.lineTo(-s * 0.7, s * 0.7); ctx.closePath();
    ctx.fillStyle = C.bg; ctx.fill();
    ctx.strokeStyle = C.ink; ctx.lineWidth = Math.max(1.2, m / 150); ctx.stroke();
    ctx.fillStyle = C.accent; dot(ctx, 0, s * 0.1, s * 0.16);
    ctx.restore();
  };

  /* ── Kessler Cascade · poço gravitacional e detritos ────────────── */
  const K_CYAN = '#3ec6e0', K_ORANGE = '#ff8a3d';
  function poly(ctx, x, y, r, n, rot) {
    ctx.beginPath();
    for (let i = 0; i < n; i++) {
      const a = rot + i / n * TAU;
      i ? ctx.lineTo(x + Math.cos(a) * r, y + Math.sin(a) * r) : ctx.moveTo(x + Math.cos(a) * r, y + Math.sin(a) * r);
    }
    ctx.closePath();
  }
  G.kessler = function (ctx, w, h, t, C, S, dt) {
    const m = Math.min(w, h), cx = w / 2, cy = h / 2, sq = 0.55;
    if (!S.p) {
      const r = rng(11);
      S.p = Array.from({ length: 58 }, () => ({ r: m * (0.13 + r() * 0.3), a: r() * TAU, s: 0.8 + r() * 0.4, k: r(), rot: r() * TAU }));
      S.fl = []; S.next = 1.2; S.r = rng(5);
    }
    // poço: anel ciano com núcleo laranja, como no jogo
    const pulse = 1 + Math.sin(t * 3) * 0.04;
    ctx.lineWidth = Math.max(2, m * 0.012);
    ctx.strokeStyle = K_CYAN; ctx.globalAlpha = 0.9;
    ctx.beginPath(); ctx.arc(cx, cy, m * 0.075 * pulse, 0, TAU); ctx.stroke();
    ctx.strokeStyle = K_ORANGE; ctx.globalAlpha = 0.7; ctx.lineWidth = Math.max(1, m * 0.006);
    ctx.beginPath(); ctx.arc(cx, cy, m * 0.058 * pulse, 0, TAU); ctx.stroke();
    ctx.globalAlpha = 0.25; ctx.strokeStyle = K_CYAN; ctx.lineWidth = 1;
    ctx.beginPath(); ctx.arc(cx, cy, m * 0.1 * pulse, 0, TAU); ctx.stroke();
    ctx.globalAlpha = 1;

    S.p.forEach((p) => {
      p.a += dt * p.s * Math.pow((m * 0.12) / p.r, 1.5) * 1.8; p.rot += dt;
      ctx.strokeStyle = C.rgba('ink', 0.12); ctx.lineWidth = 1;
      ctx.beginPath(); ctx.ellipse(cx, cy, p.r, p.r * sq, 0, p.a - 0.3, p.a); ctx.stroke();
      const x = cx + Math.cos(p.a) * p.r, y = cy + Math.sin(p.a) * p.r * sq, s = m * 0.016;
      if (p.k < 0.45) { ctx.fillStyle = K_CYAN; poly(ctx, x, y, s, 6, p.rot); ctx.fill(); }
      else if (p.k < 0.75) { ctx.fillStyle = K_ORANGE; poly(ctx, x, y, s, 3, p.rot); ctx.fill(); }
      else { ctx.fillStyle = C.rgba('ink', 0.8); ctx.fillRect(x - 1.2, y - 1.2, 2.4, 2.4); }
    });

    S.next -= dt;
    if (S.next <= 0) {
      S.next = 2.2 + S.r() * 1.2;
      const a = S.r() * TAU;
      S.fl.push({ x: cx, y: cy, vx: Math.cos(a) * m * 0.9, vy: Math.sin(a) * m * 0.9 * sq, life: 1, trail: [] });
    }
    S.fl.forEach((f) => {
      f.trail.push([f.x, f.y]); if (f.trail.length > 16) f.trail.shift();
      f.x += f.vx * dt; f.y += f.vy * dt; f.life -= dt * 0.7;
      const a = Math.max(0, f.life);
      ctx.strokeStyle = 'rgba(255,138,61,' + (0.5 * a).toFixed(3) + ')'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(cx, cy, m * 0.08 + (1 - a) * m * 0.25, 0, TAU); ctx.stroke();
      ctx.beginPath();
      f.trail.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])));
      ctx.lineTo(f.x, f.y);
      ctx.strokeStyle = 'rgba(255,138,61,' + a.toFixed(3) + ')'; ctx.lineWidth = 2; ctx.stroke();
      ctx.fillStyle = K_ORANGE; poly(ctx, f.x, f.y, m * 0.022, 3, t * 4); ctx.fill();
    });
    S.fl = S.fl.filter((f) => f.life > 0);
  };

  /* ── Terreno voxel · mesmo motor do site do modpack ─────────────────
     Raycast de altura por coluna (estilo "voxel space"): ruído fbm vira
     relevo em blocos, com água, areia, árvores, pedra e neve, e névoa
     atmosférica. Renderizado em baixa resolução e ampliado pixelado. */
  function vhash(ix, iz) {
    let h = (ix * 374761393 + iz * 668265263) | 0;
    h = Math.imul(h ^ (h >>> 13), 1274126177);
    return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
  }
  const vsm = (t) => t * t * (3 - 2 * t);
  function vnoise(x, z) {
    const ix = Math.floor(x), iz = Math.floor(z), fx = vsm(x - ix), fz = vsm(z - iz);
    const a = vhash(ix, iz), b = vhash(ix + 1, iz), c = vhash(ix, iz + 1), d = vhash(ix + 1, iz + 1);
    return a + (b - a) * fx + (c - a) * fz + (a - b - c + d) * fx * fz;
  }
  function fbm(x, z, oct) {
    let v = 0, amp = 1, f = 1, tot = 0;
    for (let o = 0; o < oct; o++) { v += vnoise(x * f, z * f) * amp; tot += amp; amp *= 0.55; f *= 2.15; }
    return v / tot;
  }
  const HCACHE = new Map();
  const SEA = 12, MAXH = 58;
  function colH(bx, bz) {
    const key = (bx + 4096) * 8192 + (bz + 4096);
    let h = HCACHE.get(key);
    if (h === undefined) {
      if (HCACHE.size > 250000) HCACHE.clear();
      h = Math.floor(Math.pow(fbm(bx * 0.013, bz * 0.013, 5), 1.7) * 1.6 * MAXH);
      HCACHE.set(key, h);
    }
    return h;
  }
  function renderTerrain(cv, o) {
    const W = cv.width, H = cv.height, c = cv.getContext('2d');
    const img = c.createImageData(W, H), px = img.data;
    const horizonY = Math.round(H * o.hor), proj = H * 0.9, camH = 75, fov = 2.1;
    const sunX = W * o.sunX;
    const put = (x, y0, y1, r, g, b) => {
      for (let y = Math.max(0, y0); y < Math.min(H, y1); y++) {
        const i = (y * W + x) * 4; px[i] = r; px[i + 1] = g; px[i + 2] = b; px[i + 3] = 255;
      }
    };
    for (let x = 0; x < W; x++) {
      const yaw = o.yaw + (x / W - 0.5) * fov, dx = Math.sin(yaw), dz = Math.cos(yaw);
      const sunProx = Math.exp(-Math.pow((x - sunX) / (W * 0.16), 2));
      let fr, fg, fb;
      if (o.night) { fr = 24 + 20 * sunProx; fg = 38 + 22 * sunProx; fb = 74 + 26 * sunProx; }
      else { fr = 150 + 105 * sunProx; fg = 190 + 16 * sunProx; fb = 150 - 30 * sunProx; }
      let prevY = H, lastH = SEA, d = 40;
      while (d < o.maxD && prevY > horizonY) {
        const bx = Math.floor(60 + dx * d), bz = Math.floor(-40 + dz * d);
        let h = colH(bx, bz), tree = false, sub = false;
        if (h > SEA + 2 && h < 36 && d < 260 && vhash(bx, bz) > 0.8) { h += 2; tree = true; }
        if (h <= SEA) { h = SEA; sub = true; }
        const sy = Math.max(horizonY, Math.round(horizonY + (camH - h) * proj / d));
        if (sy < prevY) {
          const par = ((bx + bz) & 1) ? 1 : 0.93;
          const bio = 0.82 + 0.36 * vnoise(bx * 0.004 + 9, bz * 0.004 + 7);
          let r, g, b;
          if (sub) { r = 22; g = 64; b = 94; if (!o.night && sunProx > 0.4 && vhash(bx * 3, bz * 3) > 0.5) { r = 205; g = 172; b = 115; } }
          else if (tree) { r = 52 * par * bio; g = 102 * par * bio; b = 42 * par; }
          else if (h < 15) { r = 194 * par; g = 178 * par; b = 128 * par; }
          else if (h < 38) { r = 100 * par * bio; g = 165 * par * bio; b = 62 * par; }
          else if (h < 50) { r = 118 * par; g = 121 * par; b = 126 * par; }
          else { r = 232 * par; g = 238 * par; b = 244 * par; }
          if (!sub) { const k = Math.max(0.62, Math.min(1.18, 1 + (h - lastH) * 0.06)); r *= k; g *= k; b *= k; }
          if (o.night) { r = r * 0.3 + 6; g = g * 0.36 + 10; b = b * 0.5 + 30; }
          const tt = Math.min(1, d / o.fogD), fog = tt * tt * (3 - 2 * tt) * 0.96;
          put(x, sy, prevY, (r + (fr - r) * fog) | 0, (g + (fg - g) * fog) | 0, (b + (fb - b) * fog) | 0);
          prevY = sy;
        }
        lastH = h;
        d += Math.max(0.7, d * 0.009);
      }
      if (prevY > horizonY) put(x, horizonY, prevY, fr | 0, fg | 0, fb | 0);
    }
    c.putImageData(img, 0, 0);
  }
  function terrainLayer(ctx, w, h, t, S, o, every) {
    const sc = 3, W = Math.max(40, Math.ceil(w / sc)), H = Math.max(30, Math.ceil(h / sc));
    if (!S.off || S.off.width !== W || S.off.height !== H) {
      S.off = document.createElement('canvas'); S.off.width = W; S.off.height = H; S.last = -1e9;
    }
    if (Math.abs(t - S.last) > (every || 0.1)) { renderTerrain(S.off, o); S.last = t; }
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(S.off, 0, 0, W * sc, H * sc);
    ctx.imageSmoothingEnabled = true;
  }

  /* ── Afótica · a criatura branca no abismo; o eco desenha a caverna ─ */
  G.afotica = function (ctx, w, h, t, C, S) {
    const m = Math.min(w, h);
    ctx.fillStyle = '#010405'; ctx.fillRect(0, 0, w, h);
    const q = Math.max(3, Math.round(m / 62));
    const scroll = t * h * 0.05; // descendo
    const pathX = (wy) => w * (0.5 + 0.2 * nz(wy * 0.005));
    const solid = (x, wy) => {
      const dx = (x - pathX(wy)) / w;
      return fbm(x * 0.017 + 3, wy * 0.017, 3) + dx * dx * 3.4 > 0.63;
    };

    const hx = pathX(h * 0.45 + scroll) + Math.sin(t * 1.2) * w * 0.05;
    const hy = h * 0.45 + Math.sin(t * 0.4) * h * 0.08;
    if (!S.trail) { S.trail = []; S.echo = []; S.nextEcho = 0.3; }
    S.trail.unshift([hx, hy + scroll]);
    if (S.trail.length > 70) S.trail.pop();
    if (t > S.nextEcho) { S.echo.push({ t0: t, x: hx, y: hy + scroll }); S.nextEcho = t + 2.2; if (S.echo.length > 4) S.echo.shift(); }

    // neve marinha
    for (let i = 0; i < 46; i++) {
      const y = ((hash(i + 7) * h - t * h * 0.03 * (0.5 + hash(i + 3))) % h + h) % h;
      ctx.fillStyle = 'rgba(190,230,225,' + (0.08 + hash(i) * 0.14).toFixed(3) + ')';
      ctx.fillRect(hash(i) * w, y, 1.5, 1.5);
    }

    const v = m * 0.6;
    const cols = Math.ceil(w / q) + 2, rows = Math.ceil(h / q) + 2, j0 = Math.floor(scroll / q);
    // cada linha da caverna é calculada uma vez só e reaproveitada enquanto rola
    if (!S.rows || S.rowsW !== w) { S.rows = new Map(); S.rowsW = w; }
    const grid = new Uint8Array(cols * rows);
    for (let j = 0; j < rows; j++) {
      const wr = j0 + j;
      let rowArr = S.rows.get(wr);
      if (!rowArr) {
        rowArr = new Uint8Array(cols);
        for (let i = 0; i < cols; i++) rowArr[i] = solid(i * q, wr * q) ? 1 : 0;
        S.rows.set(wr, rowArr);
      }
      grid.set(rowArr, j * cols);
    }
    for (const k of S.rows.keys()) if (k < j0 - 2) S.rows.delete(k);
    for (let j = 1; j < rows - 1; j++) {
      for (let i = 1; i < cols - 1; i++) {
        const k = j * cols + i;
        if (!grid[k] || (grid[k - 1] && grid[k + 1] && grid[k - cols] && grid[k + cols])) continue;
        const x = i * q, wy = (j0 + j) * q, y = wy - scroll;
        let b = 0.06;
        const dh = Math.hypot(x - hx, y - hy);
        b = Math.max(b, Math.exp(-dh / (m * 0.2)) * 0.55);
        for (let e = 0; e < S.echo.length; e++) {
          const E = S.echo[e], tau = (t - E.t0) - Math.hypot(x - E.x, wy - E.y) / v;
          if (tau > 0) b = Math.max(b, Math.exp(-tau * 0.7));
        }
        ctx.fillStyle = 'rgba(80,235,205,' + (b * 0.14).toFixed(3) + ')';
        ctx.fillRect(x - q, y - q, q * 3, q * 3);
        ctx.fillStyle = 'rgba(170,255,238,' + (0.12 + b * 0.85).toFixed(3) + ')';
        ctx.fillRect(x, y, q, q);
      }
    }
    S.echo.forEach((E) => {
      const age = t - E.t0, a = Math.max(0, 1 - age / 2.4);
      if (a <= 0) return;
      ctx.strokeStyle = 'rgba(95,242,214,' + (0.35 * a).toFixed(3) + ')'; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(E.x, E.y - scroll, age * v, 0, TAU); ctx.stroke();
    });

    const glow = ctx.createRadialGradient(hx, hy, 0, hx, hy, m * 0.22);
    glow.addColorStop(0, 'rgba(215,255,248,0.25)'); glow.addColorStop(1, 'rgba(215,255,248,0)');
    ctx.fillStyle = glow; ctx.fillRect(hx - m * 0.22, hy - m * 0.22, m * 0.44, m * 0.44);
    ctx.lineCap = 'round';
    for (let i = S.trail.length - 2; i >= 0; i--) {
      const a = S.trail[i + 1], b2 = S.trail[i], k = 1 - i / S.trail.length;
      ctx.strokeStyle = 'rgba(242,255,252,' + (0.1 + 0.9 * k).toFixed(3) + ')';
      ctx.lineWidth = Math.max(0.8, m * 0.028 * Math.sin(Math.min(1, k * 1.15) * Math.PI * 0.5));
      line(ctx, a[0], a[1] - scroll, b2[0], b2[1] - scroll);
    }
    ctx.lineCap = 'butt'; ctx.lineWidth = 1;
    ctx.fillStyle = '#ffffff'; dot(ctx, hx, hy, m * 0.017);

    if (w > 200) {
      font(ctx, 8.5, 'sans', 400);
      ctx.letterSpacing = '2px';
      label(ctx, 'ZONA MESOPELÁGICA', 12, 16, 8.5, 'sans', 400, 'rgba(180,230,222,0.6)');
      ctx.letterSpacing = '0px';
      label(ctx, String(Math.floor(200 + t * 1.6)), w - 12, 18, 16, 'sans', 300, 'rgba(230,255,250,0.92)', 'right');
      label(ctx, 'METROS', w - 12, 33, 7.5, 'sans', 400, 'rgba(180,230,222,0.6)', 'right');
    }
  };

  /* ── AllayFriend · a Allay do site do mod, na cena noturna do site ─
     Usa os próprios assets de allayfriend.caliberda.com.br (a cena e os
     58 quadros da Allay), carregados só quando o pôster aparece. */
  const AF = 'https://allayfriend.caliberda.com.br/img/gen/';
  const AF_ASSETS = { started: false, scene: null, frames: [] };
  function loadAllay() {
    if (AF_ASSETS.started) return;
    AF_ASSETS.started = true;
    const sc = new Image(); sc.src = AF + 'hero-cena.webp'; AF_ASSETS.scene = sc;
    for (let i = 1; i <= 58; i++) { const im = new Image(); im.src = AF + 'allay-frames/f' + String(i).padStart(2, '0') + '.png'; AF_ASSETS.frames.push(im); }
  }
  const MC_CHAT = [
    ['<você>', ' Pipoca, vem comigo'],
    ['<Pipoca>', ' Bora! Tô logo atrás de você'],
    ['<você>', ' que horas são?'],
    ['<Pipoca>', ' Já é noite, cuidado com os zumbis'],
    ['<você>', ' em que bioma a gente tá?'],
    ['<Pipoca>', ' Floresta de pinheiros. Olha a lua!']
  ];
  const AF_PART = ['#2bc4ff', '#8de6ff', '#7dfff0'];
  const PIXEL = '"VT323", ui-monospace, monospace';
  G.allay = function (ctx, w, h, t) {
    loadAllay();
    const m = Math.min(w, h), sc = AF_ASSETS.scene;
    if (sc && sc.complete && sc.naturalWidth) {
      // cena em "cover" com um pan lento (Ken Burns)
      const k = Math.max(w / sc.naturalWidth, h / sc.naturalHeight) * 1.12;
      const dw = sc.naturalWidth * k, dh = sc.naturalHeight * k;
      const px = (dw - w) * (0.5 + 0.5 * Math.sin(t * 0.06)), py = (dh - h) * 0.55;
      ctx.drawImage(sc, -px, -py, dw, dh);
    } else {
      const g = ctx.createLinearGradient(0, 0, 0, h);
      g.addColorStop(0, '#040a1c'); g.addColorStop(1, '#0d3350');
      ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    }

    const ax = w * 0.52 + Math.sin(t * 0.5) * w * 0.14, ay = h * 0.42 + Math.sin(t * 1.4) * m * 0.03;
    // rastro de partículas nas cores do site
    for (let i = 0; i < 12; i++) {
      const cyc = t * 0.55 + i / 12, life = cyc % 1, seed = i + Math.floor(cyc) * 13;
      const x = ax - Math.cos(t * 0.5) * life * m * 0.35 + (hash(seed) - 0.5) * m * 0.12;
      const y = ay + m * 0.05 + (hash(seed + 5) - 0.5) * m * 0.12 + life * m * 0.06;
      const s = (3 + hash(seed + 2) * 4) * (1 - life) * (m / 260);
      ctx.fillStyle = AF_PART[i % 3]; ctx.globalAlpha = 0.9 * (1 - life);
      ctx.fillRect(x, y, s, s);
    }
    ctx.globalAlpha = 1;
    const fr = AF_ASSETS.frames[Math.floor(t * 18) % 58];
    if (fr && fr.complete && fr.naturalWidth) {
      const fw = m * 0.62, fh = fw * fr.naturalHeight / fr.naturalWidth;
      const halo = ctx.createRadialGradient(ax, ay, 0, ax, ay, fw * 0.6);
      halo.addColorStop(0, 'rgba(43,196,255,0.35)'); halo.addColorStop(1, 'rgba(43,196,255,0)');
      ctx.fillStyle = halo; ctx.fillRect(ax - fw * 0.6, ay - fw * 0.6, fw * 1.2, fw * 1.2);
      ctx.save();
      ctx.translate(ax, ay); ctx.rotate(Math.cos(t * 0.5) * -0.08);
      ctx.drawImage(fr, -fw / 2, -fh / 2, fw, fh);
      ctx.restore();
    }

    // chat do jogo (fonte pixelada, sombra dura como no Minecraft)
    const fsz = Math.round(clamp(w * 0.045, 12, 17)), lh = fsz * 1.05;
    const idx = Math.floor(t / 2.6) % MC_CHAT.length;
    const msgs = [MC_CHAT[(idx + MC_CHAT.length - 1) % MC_CHAT.length], MC_CHAT[idx]];
    ctx.font = fsz + 'px ' + PIXEL; ctx.textAlign = 'left'; ctx.textBaseline = 'middle';
    msgs.forEach(([name, txt], i) => {
      const y = h - 12 - (1 - i) * (lh + 2) - lh / 2;
      const nw = ctx.measureText(name).width, full = ell(ctx, txt, w - 34 - nw);
      ctx.fillStyle = 'rgba(0,0,0,0.5)'; ctx.fillRect(8, y - lh / 2, nw + ctx.measureText(full).width + 10, lh);
      ctx.fillStyle = '#3f3f3f'; ctx.fillText(name + full, 14, y + 1.5);
      ctx.fillStyle = name === '<Pipoca>' ? '#7fdcff' : '#ffffff'; ctx.fillText(name, 13, y);
      ctx.fillStyle = '#ffffff'; ctx.fillText(full, 13 + nw, y);
    });
  };

  /* ── Minecraft Modpack · o horizonte do site, com Distant Horizons ─ */
  G.voxel = function (ctx, w, h, t, C, S) {
    const m = Math.min(w, h), hor = 0.34;
    const T = 12, ph = t % T;
    const reveal = ease(seg(ph, 1.5, 6.5)) * (1 - ease(seg(ph, 10.5, T)));
    const sky = ctx.createLinearGradient(0, 0, 0, h * hor + 1);
    sky.addColorStop(0, '#0a1214'); sky.addColorStop(0.35, '#143632'); sky.addColorStop(0.62, '#3c643f');
    sky.addColorStop(0.84, '#96884c'); sky.addColorStop(1, '#e2ac66');
    ctx.fillStyle = sky; ctx.fillRect(0, 0, w, h);
    const sx = w * 0.58, sy = h * hor - m * 0.12, ss = Math.round(m * 0.075);
    const bloom = ctx.createRadialGradient(sx, sy, 0, sx, sy, w * 0.4);
    bloom.addColorStop(0, 'rgba(255,214,140,0.45)'); bloom.addColorStop(0.4, 'rgba(255,190,100,0.14)'); bloom.addColorStop(1, 'rgba(255,190,100,0)');
    ctx.fillStyle = bloom; ctx.fillRect(0, 0, w, h * hor + 2);
    const sg = ctx.createLinearGradient(0, sy - ss / 2, 0, sy + ss / 2);
    sg.addColorStop(0, '#fff9dd'); sg.addColorStop(1, '#ffd27a');
    ctx.fillStyle = sg; ctx.fillRect(Math.round(sx - ss / 2), Math.round(sy - ss / 2), ss, ss);

    terrainLayer(ctx, w, h, t, S, { yaw: 0.4 + Math.sin(t * 0.06) * 0.3, maxD: lerp(150, 900, reveal), fogD: lerp(100, 650, reveal), hor, sunX: 0.58 }, 0.14);
    const haze = ctx.createLinearGradient(0, h * hor - h * 0.1, 0, h * hor + 2);
    haze.addColorStop(0, 'rgba(190,214,166,0)'); haze.addColorStop(1, 'rgba(198,216,168,0.45)');
    ctx.fillStyle = haze; ctx.fillRect(0, h * hor - h * 0.1, w, h * 0.1 + 2);

    const chunks = Math.round(lerp(12, 512, reveal)), f = clamp(w * 0.03, 8, 12);
    const txt = reveal > 0.97 ? 'Distant Horizons · LOD ativo' : 'Distância de renderização';
    font(ctx, f * 0.85, 'mono', 400);
    const bw = Math.max(ctx.measureText(txt).width, f * 8) + f * 1.6;
    ctx.fillStyle = 'rgba(0,0,0,0.5)'; ctx.fillRect(10, h - f * 3.6 - 10, bw, f * 3.6);
    label(ctx, txt, 10 + f * 0.8, h - f * 2.5 - 10, f * 0.85, 'mono', 400, 'rgba(255,255,255,0.8)');
    label(ctx, chunks + ' chunks', 10 + f * 0.8, h - f * 1.1 - 10, f * 1.1, 'mono', 500, '#8dff4a');
  };

  /* ── CS2 Mix Balancer · lobby vira dois times equilibrados ──────── */
  const PLAYERS = [['kali', 8.1], ['nando', 6.2], ['biel', 7.4], ['zeca', 5.1], ['m0uz', 9.0], ['tuca', 4.3], ['rafa', 6.8], ['dudu', 5.9], ['lipe', 7.7], ['gui', 3.9]];
  const TEAMS = (function () {
    const order = PLAYERS.map((p, i) => i).sort((a, b) => PLAYERS[b][1] - PLAYERS[a][1]);
    const A = [], B = []; let sa = 0, sb = 0;
    order.forEach((i) => {
      if ((sa <= sb && A.length < 5) || B.length >= 5) { A.push(i); sa += PLAYERS[i][1]; } else { B.push(i); sb += PLAYERS[i][1]; }
    });
    return { A, B, sa, sb };
  })();
  G.cs2mix = function (ctx, w, h, t, C) {
    const T = 9.5, ph = t % T, fadeOut = 1 - seg(ph, 9, T);
    ctx.globalAlpha = fadeOut;
    const pad = w * 0.06, f = clamp(w * 0.034, 8, 13);
    const n = Math.min(10, Math.floor(seg(ph, 0.2, 3.2) * 10.99));
    label(ctx, 'LOBBY', pad, h * 0.1, f * 0.85, 'mono', 400, C.muted);
    label(ctx, n + '/10', pad + f * 4.2, h * 0.1, f * 1.1, 'mono', 500, C.ink);
    const bw = f * 8, bh = f * 2.2, bx = w - pad - bw, by = h * 0.1 - bh / 2;
    const on = ph > 3.7;
    ctx.strokeStyle = C.accent; ctx.lineWidth = 1;
    rrect(ctx, bx, by, bw, bh, 3);
    if (on) { ctx.fillStyle = C.accent; ctx.fill(); }
    ctx.stroke();
    label(ctx, 'EQUILIBRAR', bx + bw / 2, h * 0.1, f * 0.8, 'mono', 500, on ? C.bg : C.accent, 'center');

    const k = ease(seg(ph, 4.3, 5.4));
    const top = h * 0.24, rowH = (h * 0.62) / 5, colW = (w - pad * 3) / 2;
    if (k > 0) {
      ctx.globalAlpha = Math.min(fadeOut, k);
      label(ctx, 'CT', pad, top - rowH * 0.45, f, 'mono', 500, C.accent);
      label(ctx, 'TR', pad * 2 + colW, top - rowH * 0.45, f, 'mono', 500, C.ink);
    }
    PLAYERS.forEach(([nick, r], i) => {
      if (i >= n) return;
      const lx = pad + (i % 2) * (colW + pad), ly = top + Math.floor(i / 2) * rowH;
      const inA = TEAMS.A.indexOf(i), team = inA >= 0 ? 0 : 1, rank = team ? TEAMS.B.indexOf(i) : inA;
      const tx = pad + team * (colW + pad), ty = top + rank * rowH;
      const x = lerp(lx, tx, k), y = lerp(ly, ty, k) + Math.sin(k * Math.PI) * (team ? 8 : -8);
      ctx.globalAlpha = Math.min(fadeOut, seg(ph, 0.2 + i * 0.3, 0.5 + i * 0.3));
      const ct = k > 0.5 && !team;
      ctx.fillStyle = C.mix('ink', 0.06); ctx.fillRect(x, y, colW, rowH * 0.78);
      ctx.fillStyle = ct ? C.accent : C.rgba('ink', 0.5); ctx.fillRect(x, y, 2, rowH * 0.78);
      label(ctx, nick, x + f * 0.8, y + rowH * 0.39, f, 'mono', 500, C.ink);
      const sw = colW * 0.34, sx = x + colW - sw - f * 2.6;
      ctx.fillStyle = C.rgba('ink', 0.12); ctx.fillRect(sx, y + rowH * 0.36, sw, 3);
      ctx.fillStyle = ct ? C.accent : C.rgba('ink', 0.7); ctx.fillRect(sx, y + rowH * 0.36, sw * r / 10, 3);
      label(ctx, r.toFixed(1), x + colW - f * 0.6, y + rowH * 0.39, f * 0.85, 'mono', 400, C.muted, 'right');
    });
    ctx.globalAlpha = fadeOut;
    if (k > 0.95) {
      const tot = TEAMS.sa + TEAMS.sb, pa = TEAMS.sa / tot * 100;
      const yy = top + rowH * 5 + f * 0.6;
      label(ctx, 'Σ ' + TEAMS.sa.toFixed(1), pad, yy, f, 'mono', 500, C.accent);
      label(ctx, 'Σ ' + TEAMS.sb.toFixed(1), pad * 2 + colW, yy, f, 'mono', 500, C.ink);
      label(ctx, pa.toFixed(1) + '% × ' + (100 - pa).toFixed(1) + '%', w - pad, yy, f * 0.85, 'mono', 400, C.muted, 'right');
    }
    ctx.globalAlpha = 1;
  };

  /* ── CSGO-Skins Inspector · AK-47 | Redline em exibição ─────────── */
  const AK = new Image();
  let akReady = false;
  AK.onload = () => { akReady = true; };
  AK.src = 'https://csskins.caliberda.com.br/assets/ak-redline.png';
  G.skins = function (ctx, w, h, t, C, S) {
    const bg = ctx.createRadialGradient(w / 2, h * 0.45, 0, w / 2, h * 0.45, Math.max(w, h) * 0.7);
    bg.addColorStop(0, '#3a1512'); bg.addColorStop(1, '#0f0b0b');
    ctx.fillStyle = bg; ctx.fillRect(0, 0, w, h);
    const f = clamp(w * 0.03, 8, 12);
    const iw = Math.min(w * 0.9, h * 1.15), ih = iw * 0.75;

    if (akReady) {
      // arma pronta num canvas próprio, com um reflexo de luz que passa por cima
      if (!S.ak || S.ak.width !== Math.round(iw)) { S.ak = document.createElement('canvas'); S.ak.width = Math.round(iw); S.ak.height = Math.round(ih); }
      const a = S.ak.getContext('2d');
      a.clearRect(0, 0, S.ak.width, S.ak.height);
      a.globalCompositeOperation = 'source-over';
      a.drawImage(AK, 0, 0, S.ak.width, S.ak.height);
      const sweep = ((t % 5) / 5) * 1.8 - 0.4;
      a.globalCompositeOperation = 'source-atop';
      const g = a.createLinearGradient(S.ak.width * (sweep - 0.15), 0, S.ak.width * (sweep + 0.15), S.ak.height * 0.4);
      g.addColorStop(0, 'rgba(255,255,255,0)'); g.addColorStop(0.5, 'rgba(255,255,255,0.28)'); g.addColorStop(1, 'rgba(255,255,255,0)');
      a.fillStyle = g; a.fillRect(0, 0, S.ak.width, S.ak.height);
      a.globalCompositeOperation = 'source-over';
      ctx.save();
      ctx.translate(w / 2, h * 0.43 + Math.sin(t * 1.1) * 4);
      ctx.rotate(Math.sin(t * 0.6) * 0.035);
      ctx.drawImage(S.ak, -iw / 2, -ih / 2, iw, ih);
      ctx.restore();
      const sh = ctx.createRadialGradient(w / 2, h * 0.7, 0, w / 2, h * 0.7, iw * 0.4);
      sh.addColorStop(0, 'rgba(0,0,0,0.35)'); sh.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = sh; ctx.fillRect(0, h * 0.6, w, h * 0.2);
    } else {
      ctx.fillStyle = '#2a2a2a'; ctx.fillRect(w * 0.15, h * 0.4, w * 0.7, h * 0.07);
    }

    label(ctx, 'INSPECIONAR NO CS2', 12, 16, f * 0.8, 'mono', 500, 'rgba(255,255,255,0.6)');
    const by = h * 0.8;
    label(ctx, 'AK-47 | Redline', 12, by, f * 1.25, 'sans', 700, '#ffffff');
    label(ctx, 'TESTADA EM CAMPO · FLOAT 0.1673', 12, by + f * 1.5, f * 0.75, 'mono', 400, 'rgba(255,255,255,0.55)');
    const wx = 12, ww = w - 24, wy = h - f * 1.3;
    const segs = [[0.07, '#4caf50'], [0.15, '#8bc34a'], [0.38, '#fdd835'], [0.45, '#ff9800'], [1, '#e53935']];
    let x0 = 0;
    segs.forEach(([e, c]) => { ctx.fillStyle = c; ctx.fillRect(wx + x0 * ww, wy, (e - x0) * ww - 1, 3); x0 = e; });
    const mk = wx + ww * 0.1673 * ease(seg(t % 8, 0.2, 1.4));
    ctx.fillStyle = '#fff'; ctx.fillRect(mk - 1, wy - 4, 2, 10);
    label(ctx, 'R$ 92,40', w - 12, by, f * 1.1, 'sans', 700, '#ffffff', 'right');
    label(ctx, 'Steam R$ 104,75 · +13%', w - 12, by + f * 1.5, f * 0.75, 'mono', 400, '#5fd38d', 'right');
  };

  /* ── Os Quatro Temperamentos · roda dos elementos ───────────────── */
  const TEMPS = [
    { n: 'Colérico', e: 'Fogo', hu: 'bile amarela', q: 'O que não aguenta ficar parado', c: '#e4572e', sym: 'fire' },
    { n: 'Sanguíneo', e: 'Ar', hu: 'sangue', q: 'O que acende a sala sem tentar', c: '#e8a33a', sym: 'air' },
    { n: 'Fleumático', e: 'Água', hu: 'fleuma', q: 'O que segura tudo sem levantar a voz', c: '#3b82c4', sym: 'water' },
    { n: 'Melancólico', e: 'Terra', hu: 'bile negra', q: 'O que sente fundo e não solta', c: '#7a8f55', sym: 'earth' }
  ];
  function elementSymbol(ctx, x, y, s, kind) {
    const up = kind === 'fire' || kind === 'air';
    ctx.beginPath();
    if (up) { ctx.moveTo(x, y - s); ctx.lineTo(x + s * 0.9, y + s * 0.6); ctx.lineTo(x - s * 0.9, y + s * 0.6); }
    else { ctx.moveTo(x, y + s); ctx.lineTo(x + s * 0.9, y - s * 0.6); ctx.lineTo(x - s * 0.9, y - s * 0.6); }
    ctx.closePath(); ctx.stroke();
    if (kind === 'air') line(ctx, x - s * 0.75, y + s * 0.05, x + s * 0.75, y + s * 0.05);
    if (kind === 'earth') line(ctx, x - s * 0.75, y - s * 0.05, x + s * 0.75, y - s * 0.05);
  }
  G.temper = function (ctx, w, h, t, C, S, dt) {
    const step = Math.min(1, (dt || 0.016) * 5);
    const R = Math.min(h * 0.36, w * 0.2), r0 = R * 0.6, cx = R * 1.1 + Math.min(w, h) * 0.05, cy = h / 2;
    let active = Math.floor(t / 3) % 4;
    if (S.ptr) {
      const dx = S.ptr.x - cx, dy = S.ptr.y - cy;
      if (Math.hypot(dx, dy) < R * 1.4) {
        const a = (Math.atan2(dy, dx) + Math.PI / 2 + Math.PI / 4 + TAU) % TAU; // 0 = topo
        active = Math.floor(a / (Math.PI / 2)) % 4;
      } else if (S.lastActive !== undefined) active = S.lastActive;
    }
    if (!S.a) { S.a = [0, 0, 0, 0]; S.fade = 1; S.shown = active; }
    if (active !== S.shown) { S.fade = 0; S.shown = active; }
    S.lastActive = active;
    S.fade = Math.min(1, S.fade + step * 0.6);

    TEMPS.forEach((tp, i) => {
      S.a[i] = lerp(S.a[i], i === active ? 1 : 0, step);
      const a = S.a[i], mid = -Math.PI / 2 + i * Math.PI / 2, gap = 0.06;
      const ro = R + a * R * 0.08;
      ctx.beginPath();
      ctx.arc(cx, cy, ro, mid - Math.PI / 4 + gap, mid + Math.PI / 4 - gap);
      ctx.arc(cx, cy, r0, mid + Math.PI / 4 - gap, mid - Math.PI / 4 + gap, true);
      ctx.closePath();
      ctx.fillStyle = tp.c; ctx.globalAlpha = 0.16 + 0.74 * a; ctx.fill(); ctx.globalAlpha = 1;
      const lr = (r0 + ro) / 2;
      label(ctx, tp.e.toUpperCase(), cx + Math.cos(mid) * lr, cy + Math.sin(mid) * lr, Math.max(7, R * 0.11), 'mono', 500, a > 0.5 ? '#ffffff' : C.rgba('ink', 0.6), 'center');
    });
    const tp = TEMPS[active];
    ctx.strokeStyle = tp.c; ctx.lineWidth = Math.max(1.5, R * 0.035); ctx.lineJoin = 'round';
    elementSymbol(ctx, cx, cy, r0 * 0.42, tp.sym);
    ctx.lineWidth = 1;

    const tx = cx + R * 1.3, tw = w - tx - Math.min(w, h) * 0.05;
    const f = clamp(tw * 0.085, 9, 14);
    ctx.globalAlpha = ease(S.fade);
    const oy = (1 - ease(S.fade)) * 8;
    label(ctx, 'TEMPERAMENTO', tx, cy - f * 4.2 + oy, f * 0.75, 'mono', 400, C.muted);
    font(ctx, f * 2, 'sans', 700);
    label(ctx, ell(ctx, tp.n, tw), tx, cy - f * 2.4 + oy, f * 2, 'sans', 700, C.ink);
    label(ctx, (tp.e + ' · ' + tp.hu).toUpperCase(), tx, cy - f * 0.6 + oy, f * 0.72, 'mono', 500, tp.c);
    font(ctx, f * 0.98, 'sans', 400);
    wrap(ctx, tp.q, tw).slice(0, 4).forEach((ln, j) => label(ctx, ln, tx, cy + f * 1.3 + j * f * 1.35 + oy, f * 0.98, 'sans', 400, C.rgba('ink', 0.78)));
    ctx.globalAlpha = 1;
    ctx.fillStyle = C.rgba('ink', 0.3);
    for (let i = 0; i < 4; i++) { ctx.fillStyle = i === active ? tp.c : C.rgba('ink', 0.2); ctx.fillRect(tx + i * f * 1.4, h - f * 1.6, f, 2); }
  };

  /* ── Creator Hubs · live da Twitch com chat rolando ─────────────── */
  const NICKS = [['lucaszk', '#ff7a59'], ['mariih', '#b77cf6'], ['tuca_gg', '#22b07d'], ['biel', '#3f8cf0'], ['nanda', '#e0559a'], ['rafa_cs', '#d8a018'], ['pedrin', '#12a3b8']];
  const MSGS = ['GG demais', 'que clutch!!', '!sorteio', 'boa noite chat', 'KEKW', 'ace ace ace', 'cheguei agora', 'rush B sem pensar', 'bora plinko', 'essa foi limpa', 'LUL', 'mais uma!', 'que mira', 'entrei no sorteio'];
  G.live = function (ctx, w, h, t, C) {
    const m = Math.min(w, h), x0 = w * 0.08, y0 = h * 0.08;
    const vw = w * 0.84, vh = Math.min(vw * 9 / 16, h * 0.46);
    ctx.strokeStyle = C.rgba('ink', 0.6); ctx.lineWidth = 1; ctx.strokeRect(x0, y0, vw, vh);
    ctx.fillStyle = C.rgba('ink', 0.14);
    dot(ctx, x0 + vw / 2, y0 + vh * 0.45, vh * 0.16);
    ctx.beginPath(); ctx.ellipse(x0 + vw / 2, y0 + vh, vh * 0.34, vh * 0.3, 0, Math.PI, TAU); ctx.fill();

    const bh = Math.max(8, vh * 0.13), bw = bh * 2.6;
    ctx.fillStyle = C.accent; ctx.fillRect(x0 + bh * 0.5, y0 + bh * 0.5, bw, bh);
    if (m > 110) label(ctx, 'LIVE', x0 + bh * 0.5 + bw / 2, y0 + bh, bh * 0.62, 'mono', 500, C.bg, 'center');

    for (let i = 0; i < 5; i++) {
      const life = (t * 0.45 + i / 5) % 1;
      const hx = x0 + vw * (0.8 + Math.sin((t + i) * 1.7) * 0.05), hy = y0 + vh * (0.9 - life * 0.75), hs = m * 0.022 * (1 - life * 0.4);
      ctx.fillStyle = C.rgba('accent', 1 - life);
      ctx.beginPath();
      ctx.moveTo(hx, hy + hs);
      ctx.bezierCurveTo(hx - hs * 2, hy - hs * 0.2, hx - hs * 0.6, hy - hs * 1.6, hx, hy - hs * 0.5);
      ctx.bezierCurveTo(hx + hs * 0.6, hy - hs * 1.6, hx + hs * 2, hy - hs * 0.2, hx, hy + hs);
      ctx.fill();
    }

    // chat de verdade, em letra pequena, subindo
    const cTop = y0 + vh + m * 0.05, cBot = h * 0.96, fs = clamp(m * 0.048, 8, 11.5), rh = fs * 1.55;
    ctx.save(); ctx.beginPath(); ctx.rect(x0, cTop, vw, cBot - cTop); ctx.clip();
    const base = Math.floor(t * 0.9), frac = t * 0.9 - base;
    const visible = Math.ceil((cBot - cTop) / rh) + 1;
    for (let k = 0; k < visible; k++) {
      const idx = base - k;
      const y = cBot - (k + 1 - frac) * rh + rh / 2;
      const nk = NICKS[Math.floor(hash(idx) * NICKS.length)], msg = MSGS[Math.floor(hash(idx + 50) * MSGS.length)];
      font(ctx, fs, 'sans', 700);
      label(ctx, nk[0], x0, y, fs, 'sans', 700, nk[1]);
      const nw = ctx.measureText(nk[0] + ': ').width;
      label(ctx, ': ', x0 + ctx.measureText(nk[0]).width, y, fs, 'sans', 700, C.rgba('ink', 0.6));
      font(ctx, fs, 'sans', 400);
      label(ctx, ell(ctx, msg, vw - nw), x0 + nw, y, fs, 'sans', 400, C.rgba('ink', 0.82));
    }
    ctx.restore();
    // topo do chat esmaece em vez de cortar a linha no meio
    const fade = ctx.createLinearGradient(0, cTop, 0, cTop + rh * 1.4);
    fade.addColorStop(0, C.rgba('bg', 1)); fade.addColorStop(1, C.rgba('bg', 0));
    ctx.fillStyle = fade; ctx.fillRect(x0 - 2, cTop - 1, vw + 4, rh * 1.4);
  };

  /* ── Caliberda Home · o próprio hub em miniatura ────────────────── */
  G.hub = function (ctx, w, h, t, C) {
    const m = Math.min(w, h), px = w * 0.1, py = h * 0.1, iw = w * 0.8;
    // nome gigante (duas barras de "texto") e o ponto quadrado azul
    const nh = m * 0.075;
    ctx.fillStyle = C.ink;
    ctx.fillRect(px, py, iw * 0.34, nh);
    ctx.fillRect(px + iw * 0.05, py + nh * 1.3, iw * 0.5, nh);
    ctx.fillStyle = C.accent;
    ctx.fillRect(px + iw * 0.57, py + nh * 1.3 + nh * 0.55, nh * 0.45, nh * 0.45);
    // retrato em meio-tom dentro do triângulo (só os dois lados de baixo)
    const tx = px + iw * 0.66, tw = iw * 0.34, ty = py, th = tw * 1.15;
    const cols = 11, sp = tw / cols;
    ctx.fillStyle = C.ink;
    for (let y = 0; y < cols * 1.15; y++) {
      for (let x = 0; x < cols; x++) {
        const u = (x + 0.5) / cols - 0.5, v = (y + 0.5) / (cols * 1.15);
        const head = Math.hypot(u / 0.26, (v - 0.32) / 0.24);
        const body = v > 0.62 && Math.abs(u) < 0.2 + (v - 0.62) * 0.9;
        if (head > 1 && !body) continue;
        const lum = 0.35 + 0.35 * Math.sin(x * 1.7 + y * 0.9 + t * 1.4);
        dot(ctx, tx + (x + 0.5) * sp, ty + (y + 0.5) * sp, sp * 0.42 * (0.4 + lum * 0.6));
      }
    }
    ctx.strokeStyle = C.accent; ctx.lineWidth = 1.2;
    ctx.beginPath(); ctx.moveTo(tx - tw * 0.05, ty + th * 0.52); ctx.lineTo(tx + tw / 2, ty + th * 1.02); ctx.lineTo(tx + tw * 1.05, ty + th * 0.52); ctx.stroke();
    // índice de produtos: a linha ativa desce uma a uma
    const ry = py + th * 1.12, rh = (h - py - ry) / 5, act = Math.floor(t / 1.1) % 5, k = ease((t % 1.1) / 0.5);
    for (let i = 0; i < 5; i++) {
      const y = ry + i * rh;
      ctx.strokeStyle = C.rgba('ink', 0.18); ctx.lineWidth = 1; line(ctx, px, y + rh, px + iw, y + rh);
      ctx.fillStyle = C.rgba('ink', i === act ? 0.95 : 0.45);
      ctx.fillRect(px + (i === act ? m * 0.02 * k : 0), y + rh * 0.34, iw * (0.3 + hash(i) * 0.22), rh * 0.3);
      ctx.fillStyle = C.rgba('ink', 0.2);
      ctx.fillRect(px + iw * 0.72, y + rh * 0.42, iw * 0.18, rh * 0.14);
      if (i === act) { ctx.strokeStyle = C.accent; ctx.lineWidth = 1.5; line(ctx, px, y + rh, px + iw * k, y + rh); }
    }
  };

  /* ── iaorhuman · cartas que deslizam: IA ou humano? ─────────────── */
  const IAH = [['Um pôr do sol que parece pintado a óleo.', 'IA'], ['Foto tremida do show de ontem.', 'HUMANO'], ['Poema que rima sem errar uma sílaba.', 'IA'], ['Receita da vó, com erro de digitação.', 'HUMANO']];
  G.iaorhuman = function (ctx, w, h, t, C) {
    const m = Math.min(w, h), cw = Math.min(w * 0.6, m * 0.62), ch = cw * 1.25;
    const cx = w / 2, cy = h * 0.46, P = 2.6;
    const i = Math.floor(t / P), f = (t % P) / P;
    const out = ease(seg(f, 0.62, 0.95));
    // cartas de trás
    for (let k = 2; k >= 1; k--) {
      const lift = k === 1 ? out : 0;
      const s = 1 - (k - lift) * 0.06, dy = (k - lift) * m * 0.035;
      ctx.save(); ctx.translate(cx, cy + dy); ctx.scale(s, s);
      rrect(ctx, -cw / 2, -ch / 2, cw, ch, m * 0.03);
      ctx.fillStyle = C.mix('ink', 0.06 + (2 - k) * 0.04); ctx.fill();
      ctx.strokeStyle = C.rgba('ink', 0.2); ctx.lineWidth = 1; ctx.stroke();
      ctx.restore();
    }
    // carta da frente
    const card = IAH[i % IAH.length], dir = card[1] === 'IA' ? -1 : 1;
    const tilt = Math.sin(f * Math.PI * 2) * 0.03 * (1 - out) + dir * out * 0.35;
    ctx.save();
    ctx.translate(cx + dir * out * w * 0.75, cy - out * m * 0.06);
    ctx.rotate(tilt);
    rrect(ctx, -cw / 2, -ch / 2, cw, ch, m * 0.03);
    ctx.fillStyle = C.mix('ink', 0.12); ctx.fill();
    ctx.strokeStyle = C.rgba('ink', 0.35); ctx.lineWidth = 1; ctx.stroke();
    const pad = cw * 0.1;
    ctx.fillStyle = C.rgba('accent', 0.22);
    rrect(ctx, -cw / 2 + pad, -ch / 2 + pad, cw - pad * 2, ch * 0.42, m * 0.015); ctx.fill();
    font(ctx, clamp(cw * 0.075, 8, 15), 'sans', 500);
    ctx.fillStyle = C.rgba('ink', 0.9); ctx.textAlign = 'left'; ctx.textBaseline = 'top';
    wrap(ctx, card[0], cw - pad * 2).slice(0, 3).forEach((ln, j) => ctx.fillText(ln, -cw / 2 + pad, -ch / 2 + pad * 1.5 + ch * 0.42 + j * cw * 0.1));
    // carimbo do veredito
    const st = ease(seg(f, 0.4, 0.55));
    if (st > 0) {
      ctx.save();
      ctx.globalAlpha = st;
      ctx.translate(dir * cw * 0.12, -ch * 0.1); ctx.rotate(-dir * 0.2);
      ctx.scale(1.4 - st * 0.4, 1.4 - st * 0.4);
      const fs = clamp(cw * 0.13, 10, 26);
      font(ctx, fs, 'sans', 800);
      const tw = ctx.measureText(card[1]).width + cw * 0.08;
      ctx.strokeStyle = dir < 0 ? C.accent : C.ink; ctx.lineWidth = 2;
      ctx.strokeRect(-tw / 2, -fs * 0.8, tw, fs * 1.6);
      label(ctx, card[1], 0, 0, fs, 'sans', 800, dir < 0 ? C.accent : C.ink, 'center');
      ctx.restore();
    }
    ctx.restore();
    // botões embaixo
    const by = cy + ch / 2 + m * 0.1;
    if (by + m * 0.04 < h) {
      const fs = clamp(m * 0.045, 8, 12), on = f > 0.4;
      label(ctx, '← IA', cx - cw * 0.35, by, fs, 'mono', 500, dir < 0 && on ? C.accent : C.muted, 'center');
      label(ctx, 'HUMANO →', cx + cw * 0.35, by, fs, 'mono', 500, dir > 0 && on ? C.ink : C.muted, 'center');
    }
  };

  window.CaliGen = G;
})();
