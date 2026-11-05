/* Simplifica Energia — troca de perfil, animações de rolagem e simulador */
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const body = document.body;
  const tabs = [...document.querySelectorAll('.perfis button')];
  const paineis = Object.fromEntries([...document.querySelectorAll('.painel')].map(p => [p.dataset.nome, p]));
  const thumb = document.querySelector('.perfis .thumb');
  const cortina = document.getElementById('cortina');
  const nav = document.getElementById('nav');
  const reais = n => 'R$ ' + Math.round(n).toLocaleString('pt-BR');
  let lenis = null;
  const paraTopo = () => { if (lenis) lenis.scrollTo(0, { immediate: true }); else scrollTo(0, 0); };

  /* ---------- revelar ao entrar na tela ---------- */
  document.querySelectorAll('.lines').forEach(h => [...h.children].forEach((line, i) => {
    line.innerHTML = `<span>${line.innerHTML}</span>`;
    line.firstElementChild.style.setProperty('--i', i);
  }));
  document.querySelectorAll('[data-reveal]').forEach(g => [...g.children].forEach((c, i) => c.style.setProperty('--i', i)));

  function contar(el) {
    const to = +el.dataset.count, dec = +(el.dataset.dec || 0), pre = el.dataset.pre || '', suf = el.dataset.suf || '';
    const fmt = v => pre + v.toLocaleString('pt-BR', { minimumFractionDigits: dec, maximumFractionDigits: dec }) + suf;
    if (reduce) { el.textContent = fmt(to); return; }
    const t0 = performance.now(), dur = 1800;
    const step = t => {
      const p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 4);
      el.textContent = fmt(to * e);
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('in');
    e.target.querySelectorAll('[data-count]').forEach(contar);
    io.unobserve(e.target);
  }), { rootMargin: '0px 0px -12% 0px' });
  const ANIM = '[data-reveal],.lines,.wipe,[data-steps],.etapas';
  const armar = root => root.querySelectorAll(ANIM).forEach(el => { el.classList.remove('in'); io.observe(el); });
  document.querySelectorAll('footer ' + ANIM).forEach(el => io.observe(el));

  /* ---------- troca de perfil ---------- */
  let atual = null, trocando = false;
  const ALIAS = { indicador: 'parceiro' };
  const alvo = h => ALIAS[h] || h;
  function moverThumb() {
    const b = tabs.find(t => t.getAttribute('aria-selected') === 'true');
    if (!b) return;
    thumb.style.width = b.offsetWidth + 'px';
    thumb.style.transform = `translateX(${b.offsetLeft}px)`;
  }
  addEventListener('resize', moverThumb);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(moverThumb);
  function mostrar(nome) {
    Object.entries(paineis).forEach(([n, p]) => { p.hidden = n !== nome; });
    tabs.forEach((b, i) => {
      const on = b.dataset.alvo === nome;
      b.setAttribute('aria-selected', on);
      b.tabIndex = on ? 0 : -1;
    });
    moverThumb();
    body.dataset.perfil = nome;
    document.title = paineis[nome].dataset.titulo;
    paraTopo();
    armar(paineis[nome]);
    atual = nome;
    onScroll();
  }
  function trocar(nome, foco) {
    if (nome === atual || trocando || !paineis[nome]) return;
    history.replaceState(null, '', '#' + nome);
    if (foco) foco.focus({ preventScroll: true });
    if (reduce) { mostrar(nome); return; }
    trocando = true;
    cortina.className = 'cortina entra';
    setTimeout(() => {
      mostrar(nome);
      cortina.className = 'cortina sai';
      setTimeout(() => { cortina.className = 'cortina'; trocando = false; }, 560);
    }, 410);
  }
  tabs.forEach((b, i) => {
    b.onclick = () => trocar(b.dataset.alvo);
    b.onkeydown = e => {
      const d = { ArrowRight: 1, ArrowLeft: -1 }[e.key];
      if (!d) return;
      e.preventDefault();
      const prox = tabs[(i + d + tabs.length) % tabs.length];
      trocar(prox.dataset.alvo, prox);
    };
  });
  document.querySelectorAll('[data-ir]').forEach(a => a.onclick = e => { e.preventDefault(); trocar(a.dataset.ir); });
  addEventListener('hashchange', () => trocar(alvo(location.hash.slice(1))));

  /* ---------- topo: fica sólido ao rolar; no celular o logo sobe e o seletor permanece ---------- */
  let lastY = scrollY;
  function onScroll() {
    const y = scrollY;
    nav.classList.toggle('solid', y > 40);
    const recolhe = y > 240 && y > lastY + 4, mostra = y < lastY - 4 || y <= 240;
    if (recolhe || mostra) { nav.classList.toggle('hide', recolhe); body.classList.toggle('topo-oculto', recolhe); }
    lastY = y;
  }
  addEventListener('scroll', onScroll, { passive: true });

  /* ---------- mapa dos escritórios: embutido para usar a fonte do site nos nomes das cidades ---------- */
  document.querySelectorAll('[data-svg]').forEach(el => {
    fetch(el.dataset.svg).then(r => r.ok ? r.text() : '').then(t => { if (t.startsWith('<svg')) el.innerHTML = t; }).catch(() => {});
  });

  /* ---------- depoimentos ---------- */
  document.querySelectorAll('.dep').forEach(sec => {
    const sl = sec.querySelector('.slider'), prog = sec.querySelector('.prog i');
    sec.querySelectorAll('.arrows button').forEach(b => b.onclick = () => sl.scrollBy({ left: b.dataset.d * sl.clientWidth * .8, behavior: 'smooth' }));
    const pinta = () => {
      const max = sl.scrollWidth - sl.clientWidth, w = sl.clientWidth / sl.scrollWidth || 1;
      prog.style.width = (w * 100) + '%';
      prog.style.transform = `translateX(${max ? (sl.scrollLeft / max) * ((1 - w) / w) * 100 : 0}%)`;
    };
    sl.addEventListener('scroll', pinta, { passive: true });
    new ResizeObserver(pinta).observe(sl);
  });

  /* ---------- simulador: barra fixa + formulário ---------- */
  const eco = document.getElementById('eco');
  const out = eco.querySelector('output'), res = eco.querySelector('.res strong');
  const form = document.getElementById('simule'), gasto = form.querySelector('[name=gasto]');
  const TETO = .25; /* até 25% de economia na conta */
  const MIN = 500, MAX = 15000;
  let conta = MIN;
  const anual = v => v * TETO * 12;
  function pintar(deOnde) {
    out.textContent = reais(conta);
    res.textContent = reais(anual(conta)) + '/ano';
    if (deOnde !== 'form') gasto.value = conta;
  }
  eco.querySelectorAll('.step button').forEach(b => b.onclick = () => {
    conta = Math.min(MAX, Math.max(MIN, conta + (+b.dataset.d)));
    pintar();
  });
  gasto.oninput = () => {
    const v = +gasto.value;
    if (!v) return;
    conta = Math.min(MAX, Math.max(MIN, v));
    pintar('form');
  };
  document.querySelectorAll('[data-simular]').forEach(a => a.addEventListener('click', e => {
    e.preventDefault();
    if (lenis) lenis.scrollTo(0); else scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
    setTimeout(() => form.querySelector('input').focus({ preventScroll: true }), reduce ? 0 : 700);
  }));
  document.querySelectorAll('.eco,.fixa').forEach(b => {
    b.querySelector('.fechar').onclick = () => b.classList.add('minimo');
    b.querySelector('.abrir').onclick = () => b.classList.remove('minimo');
  });
  form.onsubmit = e => {
    e.preventDefault();
    form.classList.add('feito');
    form.querySelector('.ok b').textContent = reais(anual(conta)) + ' por ano';
  };
  pintar();

  /* ---------- início: abre no perfil do link ou em Cliente ---------- */
  const ini = alvo(location.hash.slice(1));
  history.scrollRestoration = 'manual';
  thumb.style.transition = 'none';
  mostrar(paineis[ini] ? ini : 'cliente');
  requestAnimationFrame(() => requestAnimationFrame(() => { thumb.style.transition = ''; }));

  /* ---------- scroll suave no desktop; a página funciona sem ele ---------- */
  addEventListener('load', () => {
    if (reduce || !matchMedia('(min-width: 1001px) and (pointer: fine)').matches) return;
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/lenis@1.1.13/dist/lenis.min.js';
    s.onload = () => {
      lenis = new Lenis({ lerp: .1 });
      const raf = t => { lenis.raf(t); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
    };
    document.head.appendChild(s);
  });
})();
