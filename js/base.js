/* Ludfor — script comum: monta menu, rodapé, IA e Ludi, e roda as animações de rolagem.
   Cada página marca <body data-page="..."> (item ativo do menu) e, se precisar,
   data-foot="cor" (cor da metade clara do degrau antes do rodapé). */
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const page = document.body.dataset.page || '';
  const menu = [
    ['a-ludfor', 'A Ludfor', 'a-ludfor.html'],
    ['solucoes', 'Soluções', 'solucoes.html'],
    ['marcas', 'Marcas', 'marcas.html'],
    ['canal-energia', 'Canal Energia', 'canal-energia.html'],
    ['fale-conosco', 'Fale conosco', 'fale-conosco.html'],
  ];
  const CLIENTE = 'https://haus.ludfor.com.br/login';
  const WA_ICON = '<svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M207 48A111 111 0 0 0 31 183L15 241l59-16a112 112 0 0 0 54 14c62 0 113-50 113-112 0-30-13-58-34-79Zm-79 172c-17 0-33-4-47-13l-4-2-35 9 9-34-2-4a92 92 0 0 1 79-142c25 0 48 10 66 27a92 92 0 0 1-66 159Zm51-70c-3-1-17-8-19-9-3-1-5-1-7 2l-9 11c-1 2-3 2-6 1-16-8-27-15-38-33-3-5 3-5 8-15 1-2 0-4 0-5l-9-21c-2-5-4-5-6-5h-5c-2 0-5 1-7 4-3 3-10 9-10 23s10 28 11 30c2 2 20 30 48 42 18 8 25 8 34 7 5-1 17-7 19-14s2-12 2-13c-1-2-3-2-6-4Z"/></svg>';

  /* ---------- menu, rodapé, Ludi e IA ---------- */
  const links = menu.map(([id, label, href]) => `<li><a href="${href}"${id === page ? ' class="on" aria-current="page"' : ''}>${label}</a></li>`).join('');
  document.body.insertAdjacentHTML('afterbegin', `
<nav class="nav" id="nav"><div class="wrap">
  <a href="index.html" class="logo"><img src="assets/logo_branco.svg" alt="Ludfor"></a>
  <ul>${links}</ul>
  <div class="cta"><a href="${CLIENTE}">Área do Cliente</a></div>
  <button class="burger" aria-label="Abrir menu" aria-expanded="false"><i></i><i></i><i></i></button>
</div></nav>
<div class="drawer" id="drawer">${menu.map(([, l, h]) => `<a href="${h}">${l}</a>`).join('')}<a class="cliente" href="${CLIENTE}">Área do Cliente</a></div>`);

  document.body.insertAdjacentHTML('beforeend', `
<div class="steps up" data-steps style="background:${document.body.dataset.foot || 'var(--off)'}"><div class="v"></div><div></div></div>
<footer><div class="wrap">
  <div class="cols" data-reveal>
    <div class="news"><p>Novidades do mercado de energia no seu e-mail</p><input placeholder="Seu e-mail" aria-label="Seu e-mail">
      <div class="social"><a href="https://br.linkedin.com/company/ludforenergia" aria-label="LinkedIn">in</a><a href="https://www.instagram.com/LudforEnergia/" aria-label="Instagram">ig</a><a href="https://www.youtube.com/@ludforenergia9713" aria-label="YouTube">yt</a><a href="https://www.facebook.com/LudforEnergia/" aria-label="Facebook">fb</a></div>
    </div>
    <div><h4>Navegação</h4><ul>${menu.slice(0, 4).map(([, l, h]) => `<li><a href="${h}">${l}</a></li>`).join('')}<li><a href="https://ludfor.vagas.solides.com.br/">Trabalhe conosco</a></li></ul></div>
    <div><h4>Soluções</h4><ul>
      <li><a href="solucoes.html#gestao">Gestão</a></li><li><a href="solucoes.html#autoproducao">Autoprodução</a></li><li><a href="solucoes.html#geracao">Geração</a></li>
      <li><a href="solucoes.html#comercializacao">Comercialização</a></li><li><a href="solucoes.html#gd">Geração Distribuída</a></li><li><a href="solucoes.html#engenharia">Engenharia</a></li>
    </ul></div>
    <div><h4>Contato</h4><ul><li>(54) 3451.1413</li><li>Alameda Fenavinho, 214<br>Bento Gonçalves · RS</li><li><a href="fale-conosco.html#filiais">Filiais</a></li><li><a href="fale-conosco.html">Fale conosco</a></li></ul>
      <div class="wa">
        <button type="button" class="wa-btn" aria-expanded="false">${WA_ICON}Fale pelo WhatsApp</button>
        <form class="wa-form" onsubmit="return false">
          <strong>Entre em contato!</strong>
          <input placeholder="Nome" aria-label="Nome" required>
          <input placeholder="E-mail" type="email" aria-label="E-mail" required>
          <input placeholder="Telefone" type="tel" aria-label="Telefone" required>
          <button>Iniciar conversa</button>
        </form>
      </div>
    </div>
  </div>
  <div class="big" id="footBig"><img src="assets/logo_branco.svg" alt="Ludfor">
    <div class="legal"><a href="#">Política de privacidade</a><a href="${CLIENTE}">Área do Cliente</a><span>© 2026 Grupo Ludfor</span></div>
  </div>
</div></footer>
<div class="ludi" id="ludi" aria-hidden="true"><div class="body"><div><span>Ludi<br>(GIF)</span></div></div></div>
<aside class="ia" id="ia">
  <header id="iaHead">
    <b class="spark" aria-hidden="true"><svg viewBox="0 0 24 24"><path class="s1" d="M12 2c.5 4.6 2.9 7.3 8 8-5.1.7-7.5 3.4-8 8-.5-4.6-2.9-7.3-8-8 5.1-.7 7.5-3.4 8-8Z"/><path class="s2" d="M19 15c.2 1.7 1 2.6 2.8 3-1.8.3-2.6 1.2-2.8 3-.2-1.8-1-2.7-2.8-3 1.8-.4 2.6-1.3 2.8-3Z"/></svg></b>
    <div>Assistente Ludfor<small>IA · online agora</small></div>
    <button type="button" class="toggle" aria-label="Minimizar assistente"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="square"><path d="M6 9l6 6 6-6"/></svg></button>
  </header>
  <div class="body">
    <div class="msg">Olá! Quer saber quanto sua empresa pode economizar com energia?</div>
    <form onsubmit="return false"><input placeholder="Escreva sua pergunta" aria-label="Pergunta"><button aria-label="Enviar">→</button></form>
  </div>
</aside>`);

  /* ---------- revelar ao entrar na tela ---------- */
  const fmt = n => n.toLocaleString('pt-BR');
  function countUp(el) {
    const to = +el.dataset.count, pre = el.dataset.pre || '', suf = el.dataset.suf || '';
    if (reduce) return;
    const t0 = performance.now(), dur = 1800;
    const step = t => {
      const p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 4);
      el.textContent = pre + fmt(Math.round(to * e)) + suf;
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }
  /* títulos .lines: cada filho é uma linha; o invólucro interno é criado aqui se faltar */
  document.querySelectorAll('.lines').forEach(h => [...h.children].forEach((line, i) => {
    const wrapped = line.children.length === 1 && line.firstElementChild.tagName === 'SPAN' && line.textContent === line.firstElementChild.textContent;
    if (!wrapped) line.innerHTML = `<span>${line.innerHTML}</span>`;
    line.firstElementChild.style.setProperty('--i', i);
  }));
  document.querySelectorAll('[data-reveal]').forEach(g => [...g.children].forEach((c, i) => c.style.setProperty('--i', i)));
  const io = new IntersectionObserver(es => es.forEach(e => {
    if (!e.isIntersecting) return;
    e.target.classList.add('in');
    e.target.querySelectorAll('[data-count]').forEach(countUp);
    io.unobserve(e.target);
  }), { rootMargin: '0px 0px -12% 0px' });
  /* elementos marcados com data-intro entram ao carregar, em sequência (topo da página) */
  const intro = [...document.querySelectorAll('[data-intro]')];
  document.querySelectorAll('[data-reveal],.lines,.wipe,[data-steps],#footBig').forEach(el => { if (!intro.includes(el)) io.observe(el); });
  addEventListener('load', () => setTimeout(() => intro.forEach((el, i) => setTimeout(() => el.classList.add('in'), i * 220)), 150));

  /* ---------- abas com linha de progresso ---------- */
  function autoTabs(buttons, ms, onShow, root) {
    let cur = 0, anim = null, visible = false;
    const show = i => {
      buttons.forEach((b, j) => b.classList.toggle('on', j === i));
      buttons.forEach(b => { const l = b.querySelector('i'); l.getAnimations().forEach(a => a.cancel()); l.style.transform = 'scaleX(0)'; });
      cur = i; onShow(i);
      const line = buttons[i].querySelector('i');
      if (reduce) { line.style.transform = 'scaleX(1)'; return; }
      anim = line.animate([{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }], { duration: ms, easing: 'linear', fill: 'forwards' });
      if (!visible) anim.pause();
      anim.onfinish = () => show((cur + 1) % buttons.length);
    };
    buttons.forEach((b, i) => b.onclick = () => show(i));
    new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (anim) visible ? anim.play() : anim.pause(); }).observe(root);
    show(0);
  }

  /* ---------- interações do menu, WhatsApp e IA ---------- */
  const burger = document.querySelector('.burger');
  burger.onclick = () => {
    const open = document.body.classList.toggle('menu-open');
    burger.setAttribute('aria-expanded', open);
    burger.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  };
  const wa = document.querySelector('footer .wa'), waBtn = wa.querySelector('.wa-btn');
  waBtn.onclick = () => waBtn.setAttribute('aria-expanded', wa.classList.toggle('open'));
  const ia = document.getElementById('ia'), iaToggle = ia.querySelector('.toggle');
  document.getElementById('iaHead').onclick = () => {
    const min = ia.classList.toggle('min');
    iaToggle.setAttribute('aria-label', min ? 'Abrir assistente' : 'Minimizar assistente');
  };

  /* ---------- efeitos de rolagem: menu some/volta, Ludi atravessa a tela ---------- */
  const nav = document.getElementById('nav'), ludi = document.getElementById('ludi');
  const hooks = [];
  let lastY = scrollY, ludiX = 0;
  function onScroll() {
    const y = scrollY;
    nav.classList.toggle('solid', y > 40);
    nav.classList.toggle('hide', y > 600 && y > lastY + 4 && !document.body.classList.contains('menu-open'));
    if (y < lastY - 4) nav.classList.remove('hide');
    const doc = document.documentElement.scrollHeight - innerHeight;
    const p = doc ? y / doc : 0;
    const target = (innerWidth - ludi.offsetWidth) * (0.5 - 0.5 * Math.cos(p * Math.PI * 3));
    ludi.classList.toggle('back', target < ludiX);
    ludiX = target;
    ludi.style.transform = `translateX(${target}px)`;
    hooks.forEach(fn => fn(y));
    lastY = y;
  }
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll);
  addEventListener('load', onScroll);
  onScroll();

  /* ---------- scroll suave no desktop; a página funciona sem ele ---------- */
  addEventListener('load', () => {
    if (reduce || !matchMedia('(min-width: 1001px) and (pointer: fine)').matches) return;
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/lenis@1.1.13/dist/lenis.min.js';
    s.onload = () => {
      const lenis = new Lenis({ lerp: .1 });
      const raf = t => { lenis.raf(t); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
    };
    document.head.appendChild(s);
  });

  window.Ludfor = { reduce, autoTabs, countUp, onScroll: fn => { hooks.push(fn); fn(scrollY); } };
})();
