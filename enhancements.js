/* ═══════════════════════════════════════════════════════════
   NOESIS · CAPA TECH JS (additive enhancements)
═══════════════════════════════════════════════════════════ */
(function(){

  // ── 1. Mark reveal indices on direct children of each slide ──
  document.querySelectorAll('.slide').forEach(slide => {
    const interesting = slide.querySelectorAll(
      'h1,h2,h3,h4,p,ul,ol,li,article,.section-tag,.pill,.eyebrow,' +
      '.cover-foot,.cover-divider,.mf-greek,.mf-greek-def,.mf-greek-lbl,' +
      '.pl-card,.tm-card,.tm-strip,.tm-strip-item,' +
      '.pain,.pr-big,.pr-substat,.compare-col,.compare-vs,.sol-feat,' +
      '.ht-step,.ht-arrow,.ht-result,.ht-result-stat,' +
      '.pk-card,.pk-foot,.fn-margin-card,.fn-bo,.fn-metric,' +
      '.bi-t-item,.bi-claim-strip,' +
      '.mp-donut-wrap,.mp-item,.mp-strip-item,' +
      '.pc-mock,.cl-gantt,.cl-kpi,' +
      '.ev-poster-l,.ev-poster-r,.ev-strip-item,' +
      '.ep-slot,.es-phase,.es-foot > div,' +
      '.dw-feat,.dw-feats,.dw-left,.dw-right,.browser-mock,' +
      '.sc-platform,.sc-content-pillars,' +
      '.fu-stage,.fu-kpi,' +
      '.db-frame,.db-bar,.db-side,' +
      '.closing-team,.closing-divider,.closing-footer,.closing-logo'
    );
    let i = 0;
    interesting.forEach(el => {
      // Skip nested cases by limiting depth
      el.setAttribute('data-reveal','');
      el.style.setProperty('--i', i);
      i++;
    });
  });

  // ── 2. Reveal-on-active wiring ─────────────────────────
  const stage = document.querySelector('deck-stage');
  function revealCurrent() {
    document.querySelectorAll('.slide').forEach(s => s.classList.remove('is-revealed'));
    // Trigger reflow then add
    requestAnimationFrame(() => {
      const slides = document.querySelectorAll('.slide');
      const visible = [...slides].find(s => {
        const cs = getComputedStyle(s);
        return cs.visibility !== 'hidden' && cs.opacity !== '0' && cs.display !== 'none';
      }) || slides[0];
      if (visible) visible.classList.add('is-revealed');
      // Kick counter animations on the visible slide
      if (visible) animateCounters(visible);
    });
  }
  if (stage) {
    stage.addEventListener('slidechange', revealCurrent);
  }
  // Initial
  setTimeout(revealCurrent, 200);

  // ── 3. Kinetic typography (split text into spans) ─────
  document.querySelectorAll('[data-kinetic]').forEach(el => {
    if (el.dataset.kineticBuilt) return;
    el.dataset.kineticBuilt = '1';
    el.classList.add('kinetic');
    const txt = el.textContent;
    el.textContent = '';
    let ki = 0;
    [...txt].forEach(ch => {
      const span = document.createElement('span');
      if (ch === ' ') { span.className = 'sp'; }
      else { span.className = 'ch'; span.textContent = ch; }
      span.style.setProperty('--ki', ki++);
      el.appendChild(span);
    });
  });

  // ── 4. Counter-up animation ───────────────────────────
  function animateCounters(scope) {
    scope.querySelectorAll('[data-count]').forEach(el => {
      if (el.dataset.counted === '1') return;
      const target = parseFloat(el.dataset.count);
      const suffix = el.dataset.suffix || '';
      const prefix = el.dataset.prefix || '';
      const dur = parseInt(el.dataset.dur || '1400', 10);
      const start = performance.now();
      const from = 0;
      const fmt = (v) => {
        if (Math.abs(target) >= 1000) return Math.round(v).toLocaleString('es-ES');
        if (Number.isInteger(target)) return Math.round(v).toString();
        return v.toFixed(1);
      };
      function frame(t) {
        const p = Math.min(1, (t - start) / dur);
        // ease-out cubic
        const e = 1 - Math.pow(1 - p, 3);
        const v = from + (target - from) * e;
        el.textContent = prefix + fmt(v) + suffix;
        if (p < 1) requestAnimationFrame(frame);
        else el.dataset.counted = '1';
      }
      requestAnimationFrame(frame);
    });
  }

  // ── 5. Indexes for staggered animations ───────────────
  // Donut segments
  document.querySelectorAll('.mp-donut circle[stroke-dasharray]').forEach((c, i) => {
    c.style.setProperty('--di', i);
  });
  // Funnel stages
  document.querySelectorAll('.fu-stage').forEach((s, i) => {
    s.style.setProperty('--fi', i);
  });

  // ── 6. Live ticker injection on dark slides ───────────
  const tickerSlides = ['solution','packs','team','event-spread','funnel'];
  const tickerLines = [
    ['NOESIS · OS 1.0', 'tick-dot'],
    ['MRR  ', 'tick-up', '4.500€  ▲ 12%'],
    ['LEADS', 'tick-up', '+18 esta semana'],
    ['CHURN', 'tick-down', '3.2% ▼'],
    ['CAC  ', 'tick-up', '135€ ▲ óptimo'],
    ['NPS  ', 'tick-up', '67  ▲ +4'],
    ['CLIENTES ACTIVOS', 'tick-dot', '12'],
    ['TICKER · NOESIS PARTNERS · LIVE FEED'],
    ['MRR  ', 'tick-up', '4.500€  ▲ 12%'],
    ['CONVERSACIONES IA · ÚLTIMA HORA', 'tick-dot', '1.247'],
    ['HORAS AHORRADAS · MES', 'tick-up', '342h'],
  ];
  tickerSlides.forEach(cls => {
    const slide = document.querySelector('.slide.' + cls);
    if (!slide || slide.querySelector('.live-ticker')) return;
    const ticker = document.createElement('div');
    ticker.className = 'live-ticker';
    const track = document.createElement('div');
    track.className = 'live-ticker-track';
    // Repeat content twice for seamless loop
    for (let r = 0; r < 2; r++) {
      tickerLines.forEach(parts => {
        const span = document.createElement('span');
        if (parts.length === 1) {
          span.textContent = parts[0];
        } else {
          const lbl = document.createElement('span'); lbl.textContent = parts[0];
          const val = document.createElement('span'); val.className = parts[1]; val.textContent = parts[2] || '';
          span.appendChild(lbl); span.appendChild(val);
        }
        track.appendChild(span);
      });
    }
    ticker.appendChild(track);
    slide.appendChild(ticker);
  });

  // ── 7. HUD corner on dark hero slides ─────────────────
  const hudSlides = ['cover','solution','bigidea','event-concept','digital-web','closing'];
  hudSlides.forEach(cls => {
    const slide = document.querySelector('.slide.' + cls);
    if (!slide || slide.querySelector('.hud-corner')) return;
    const hud = document.createElement('div');
    hud.className = 'hud-corner';
    hud.innerHTML = `
      <span class="hud-bracket">[</span>
      <span class="hud-blip"></span>
      <span>NOESIS · OS 1.0</span>
      <span>·</span>
      <span class="hud-coord">TFG · 2026</span>
      <span class="hud-bracket">]</span>
    `;
    slide.appendChild(hud);
  });

  // ── 8. Data stream on heavy dark slides ───────────────
  function buildDataStream(slide, count = 8) {
    if (slide.querySelector('.data-stream')) return;
    const ds = document.createElement('div');
    ds.className = 'data-stream';
    const chars = '01';
    for (let i = 0; i < count; i++) {
      const col = document.createElement('div');
      col.className = 'ds';
      col.style.left = (Math.random() * 100) + '%';
      col.style.animationDuration = (8 + Math.random() * 12) + 's';
      col.style.animationDelay = (-Math.random() * 16) + 's';
      let txt = '';
      const n = 12 + Math.floor(Math.random() * 10);
      for (let j = 0; j < n; j++) txt += chars[Math.floor(Math.random() * 2)] + '\n';
      col.textContent = txt;
      ds.appendChild(col);
    }
    slide.appendChild(ds);
  }
  ['solution','bigidea','event-concept','digital-web','dashboard'].forEach(cls => {
    const slide = document.querySelector('.slide.' + cls);
    if (slide) buildDataStream(slide, 6);
  });

  // ── 9. Dashboard "live" data jitter ───────────────────
  const dashSlide = document.querySelector('.slide.dashboard');
  if (dashSlide) {
    const liveKpis = [
      { el: null, sel: '[data-view="overview"] .kpi:nth-of-type(1) .kpi-val', base: 1247, var: 8 },
      { el: null, sel: '[data-view="overview"] .kpi:nth-of-type(2) .kpi-val', base: 86, var: 2 },
      { el: null, sel: '[data-view="overview"] .kpi:nth-of-type(3) .kpi-val', base: 42, var: 1 },
      { el: null, sel: '[data-view="overview"] .kpi:nth-of-type(4) .kpi-val', base: 24, var: 0, suf: 'h' },
    ];
    liveKpis.forEach(k => { k.el = dashSlide.querySelector(k.sel); });
    setInterval(() => {
      liveKpis.forEach(k => {
        if (!k.el) return;
        const jitter = k.var ? Math.round((Math.random() - 0.3) * k.var) : 0;
        const v = k.base + jitter;
        if (k.suf) k.el.textContent = v + k.suf;
        else k.el.textContent = v.toLocaleString('es-ES');
        k.el.classList.add('flip');
        setTimeout(() => k.el.classList.remove('flip'), 400);
      });
    }, 3200);
  }

  // ── 10. Bigidea claim em underline reveal handled in CSS ─

  // ── 11. Section watermark numbers on section openers ──
  const openers = [
    { sel: '.manifesto', num: '01' },
    { sel: '.problem',   num: '02' },
    { sel: '.bigidea',   num: '03' },
    { sel: '.event-concept', num: '04' },
    { sel: '.digital-web',   num: '05' },
  ];
  openers.forEach(o => {
    const s = document.querySelector(o.sel);
    if (!s || s.querySelector('.section-watermark')) return;
    const wm = document.createElement('div');
    wm.className = 'section-watermark section-watermark--br';
    wm.textContent = o.num;
    s.appendChild(wm);
  });

  // ── 12. Subtle bg net on light-content slides ─────────
  ['pillars','team','packs','event-spread','funnel'].forEach(cls => {
    const slide = document.querySelector('.slide.' + cls);
    if (!slide || slide.querySelector('.bgnet')) return;
    const net = document.createElement('div');
    net.className = 'bgnet';
    slide.insertBefore(net, slide.firstChild);
  });

  // ── 13. Re-run reveals if user toggles tweaks etc. ───
  window.addEventListener('resize', () => {
    // no-op for now
  });

})();
