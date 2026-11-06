/* Ludfor — script comum: monta menu, rodapé, IA e Ludi, e roda as animações de rolagem.
   Cada página marca <body data-page="..."> (item ativo do menu). */
(() => {
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const page = document.body.dataset.page || '';
  const menu = [
    ['solucoes', 'Soluções', '', [['Gestão', 'solucao-gestao.html'], ['Autoprodução', 'solucao-autoproducao.html'], ['Geração', 'solucao-geracao.html'], ['Comercialização', 'solucao-comercializacao.html'], ['Geração Distribuída', 'solucao-geracao-distribuida.html'], ['Engenharia', 'solucao-engenharia.html'], ['Marcas', 'marcas.html', 'sep']]],
    ['a-ludfor', 'A Ludfor', 'a-ludfor.html'],
    ['blog', 'Blog', 'blog.html'],
    ['fale-conosco', 'Fale conosco', 'fale-conosco.html'],
  ];
  const CLIENTE = 'https://haus.ludfor.com.br/login';
  const WA_ICON = '<svg viewBox="0 0 256 256" fill="currentColor" aria-hidden="true"><path d="M207 48A111 111 0 0 0 31 183L15 241l59-16a112 112 0 0 0 54 14c62 0 113-50 113-112 0-30-13-58-34-79Zm-79 172c-17 0-33-4-47-13l-4-2-35 9 9-34-2-4a92 92 0 0 1 79-142c25 0 48 10 66 27a92 92 0 0 1-66 159Zm51-70c-3-1-17-8-19-9-3-1-5-1-7 2l-9 11c-1 2-3 2-6 1-16-8-27-15-38-33-3-5 3-5 8-15 1-2 0-4 0-5l-9-21c-2-5-4-5-6-5h-5c-2 0-5 1-7 4-3 3-10 9-10 23s10 28 11 30c2 2 20 30 48 42 18 8 25 8 34 7 5-1 17-7 19-14s2-12 2-13c-1-2-3-2-6-4Z"/></svg>';

  /* ---------- ícones de linha: use <i data-ic="nome"></i> ou Ludfor.ic('nome') ---------- */
  const DRAW = 'class="a-draw" pathLength="100"';
  const ICONS = {
    alimentos: '<path d="M12 7c-2-2-7-2-8 3-.8 4 2 11 5 11 1.2 0 2-.8 3-.8s1.800.8 3 .8c3 0 5.800-7 5-11-1-5-6-5-8-3Z"/><path d="M12 7c0-2 1-4 3-5"/>',
    bebidas: '<path d="M8 2h8l1 7a5 5 0 0 1-10 0z"/><path d="M12 14v8M8 22h8M7.300 8h9.400"/>',
    calcados: '<path d="M3 7v11h18v-2.500c0-1.700-1.300-2.900-3-3.200l-4-.8L9 7c-1 1.500-3.500 1.500-6 0Z"/><path d="M3 15h18M11.500 9 10 11M14 11l-1.500 1.600"/>',
    carnes: '<path d="M14.500 3a6.500 6.500 0 0 1 4.600 11.100c-2 2-5 2.300-7.600 1.400l-3 3a2 2 0 1 1-3 2.500 2 2 0 1 1-2.500-3l3-3c-.9-2.600-.6-5.600 1.400-7.600A6.500 6.500 0 0 1 14.500 3Z"/>',
    ceramica: '<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M12 3v18M3 12h18"/>',
    clubes: '<circle cx="9" cy="8" r="3.500"/><path d="M2.500 20c0-3.600 2.900-6 6.500-6s6.500 2.400 6.500 6"/><path d="M16 4.800a3.500 3.500 0 0 1 0 6.400M18 14.500c2 .8 3.500 2.800 3.500 5.500"/>',
    comercio: '<path d="M4 10v10a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V10"/><path d="M3 9l1.500-5.500h15L21 9a3 3 0 0 1-6 0 3 3 0 0 1-6 0 3 3 0 0 1-6 0Z"/><path d="M10 21v-6h4v6"/>',
    diversos: '<circle cx="7" cy="7" r="4"/><rect x="13.500" y="3" width="7.500" height="8" rx="2"/><path d="M7 13.500 11.500 21h-9zM17.300 13.500l3.700 3.700-3.700 3.800-3.800-3.800z"/>',
    hotel: '<path d="M2 5v15M2 16h20v4M22 16v-3a3 3 0 0 0-3-3h-8v6"/><circle cx="6.500" cy="11.500" r="2"/>',
    plasticos: '<path d="M10 2h4v3l2 3.500V20a2 2 0 0 1-2 2h-4a2 2 0 0 1-2-2V8.500L10 5z"/><path d="M8 12h8M8 17h8"/>',
    ensino: '<path d="M12 4 2 9.500 12 15l10-5.500z"/><path d="M6 12v5c2 2 4 3 6 3s4-1 6-3v-5M22 9.500V15"/>',
    madeira: '<path d="M12 2 6.500 9H9l-4 5.500h4.500L6 19h12l-3.500-4.500H19L15 9h2.500z"/><path d="M12 19v3"/>',
    metal: '<circle cx="12" cy="12" r="7"/><circle cx="12" cy="12" r="2.600"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.900 4.900 7 7M17 17l2.100 2.100M4.900 19.100 7 17M17 7l2.100-2.100"/>',
    mineracao: '<path d="M2 20 9 7l4 6 2.500-3.500L22 20z"/><path d="M7.200 10.500 9.500 12l2-1"/>',
    moveleiro: '<path d="M6 11V7a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3v4"/><path d="M4 11a2 2 0 0 0-2 2v4a1 1 0 0 0 1 1h18a1 1 0 0 0 1-1v-4a2 2 0 0 0-4 0v1H6v-1a2 2 0 0 0-2-2Z"/><path d="M5 18v2.500M19 18v2.500"/>',
    nutricao: '<circle cx="5" cy="11" r="2"/><circle cx="9.500" cy="6" r="2"/><circle cx="14.500" cy="6" r="2"/><circle cx="19" cy="11" r="2"/><path d="M12 11c-3 0-5.500 3.500-5.500 6.300 0 2.500 2.500 3 3.500 2.500 1.300-.6 2.700-.6 4 0 1 .5 3.500 0 3.500-2.500 0-2.800-2.500-6.300-5.500-6.300Z"/>',
    outros: '<circle cx="12" cy="12" r="9.500"/><path d="M12 8v8M8 12h8"/>',
    papel: '<path d="M12 2.500 3 7.500v9l9 5 9-5v-9z"/><path d="M3 7.500 12 12.500l9-5M12 12.500v9"/>',
    saude: '<path d="M12 21C7 17 2.500 13.500 2.500 8.500A5.200 5.200 0 0 1 12 5.700a5.200 5.200 0 0 1 9.500 2.800C21.500 13.500 17 17 12 21Z"/><path d="M6 12h3l1.500-3 2.500 5.500 1.500-2.500h3"/>',
    shopping: '<path d="M5 8h14l1.500 13h-17z"/><path d="M8.500 11V6.500a3.500 3.500 0 0 1 7 0V11"/>',
    supermercado: '<path d="M2 3h3l2.500 12.500h11.500L21.500 7H6"/><circle cx="9" cy="20" r="1.700"/><circle cx="17.500" cy="20" r="1.700"/>',
    vidros: '<rect x="4" y="2.500" width="16" height="19" rx="2"/><path d="m8 11 4-4M10 16l6-6"/>',
    gestao: `<path d="M3.500 18a9.500 9.500 0 1 1 17 0"/><path ${DRAW} d="m12 14 4-5"/><circle cx="12" cy="14" r="1.600"/>`,
    autoproducao: `<path d="M6 12h12l3 9H3zM9.700 12 8 21M14.300 12 16 21M4.500 16.500h15"/><circle cx="12" cy="5" r="1.700"/><path ${DRAW} d="M12 1v.8M12 8.200V9M8 5h.8M15.200 5h.8"/>`,
    geracao: `<path d="M12 2.500s7 7 7 12a7 7 0 0 1-14 0c0-5 7-12 7-12Z"/><path ${DRAW} d="M12.800 9.500 10 14.500h4l-2.800 5"/>`,
    comercializacao: `<path ${DRAW} d="M20 7H4M8 3 4 7l4 4"/><path ${DRAW} style="animation-delay:.4s" d="M4 17h16M16 21l4-4-4-4"/>`,
    gd: `<path d="M3 11.500 12 3l9 8.500"/><path d="M5.500 9.500V21h13V9.500"/><path ${DRAW} d="M12.800 10.500 10.300 15h3.400l-2.500 4"/>`,
    engenharia: '<path d="M10 10V5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5"/><path d="M14 6a6 6 0 0 1 6 6v3"/><path d="M4 15v-3a6 6 0 0 1 6-6"/><rect x="2" y="15" width="20" height="4" rx="1"/>',
    raio: `<path ${DRAW} d="M13.200 3 6.500 13.400h4.700L10.300 21l7.200-10.600h-4.800z"/>`,
    pin: '<path d="M12 22s7.500-6.500 7.500-12.500a7.500 7.500 0 0 0-15 0C4.500 15.500 12 22 12 22Z"/><circle cx="12" cy="9.500" r="2.600"/>',
    tel: '<path d="M21 16.500v3a2 2 0 0 1-2.200 2A18 18 0 0 1 2.500 5.200 2 2 0 0 1 4.500 3h3a2 2 0 0 1 2 1.700c.1 1 .4 1.900.7 2.800a2 2 0 0 1-.5 2.100L8.500 10.800a15 15 0 0 0 4.700 4.700l1.200-1.200a2 2 0 0 1 2.100-.5c.9.300 1.800.6 2.800.7a2 2 0 0 1 1.700 2Z"/>',
    monitor: `<rect x="2.500" y="4" width="19" height="13" rx="2"/><path d="M8.500 21h7M12 17v4"/><path ${DRAW} d="m6.500 13 3.500-3.500 2.500 2 5-4.500"/>`,
    pasta: '<rect x="2.500" y="7.500" width="19" height="13.500" rx="2"/><path d="M8.500 7.500V5a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2v2.500M2.500 13h19"/>',
    relogio: `<circle cx="12" cy="12" r="9.500"/><path ${DRAW} d="M12 6.500V12l3.500 2"/>`,
    check: `<circle cx="12" cy="12" r="9.500"/><path ${DRAW} d="m7.500 12.500 3 3 6-6.500"/>`,
    soma: `<path d="M3 21h18"/><rect x="4.500" y="14" width="4" height="7" rx="1"/><rect x="10" y="9.500" width="4" height="11.500" rx="1"/><rect x="15.500" y="5" width="4" height="16" rx="1"/>`,
    livro: '<path d="M12 6.500C10 4.500 7 4 3 4v15c4 0 7 .5 9 2.500 2-2 5-2.500 9-2.500V4c-4 0-7 .5-9 2.500Z"/><path d="M12 6.500v15"/>',
    olho: `<path d="M2 12s3.500-7 10-7 10 7 10 7-3.500 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>`,
    balanca: '<path d="M12 3v18M7.5 21h9M5 6.5h14"/><path d="m5 6.5-3 7a3 3 0 0 0 6 0zM19 6.5l-3 7a3 3 0 0 0 6 0z"/>',
    alvo: `<circle cx="12" cy="12" r="9.500"/><circle cx="12" cy="12" r="5.500"/><circle cx="12" cy="12" r="1.500"/>`,
    grafico: `<path d="M3 3v18h18"/><path ${DRAW} d="m7 15 4-4 3 3 6-7"/>`,
    pessoas: '<circle cx="9" cy="8" r="3.500"/><path d="M2.500 20c0-3.600 2.900-6 6.500-6s6.500 2.400 6.500 6"/><path d="M16 4.800a3.500 3.500 0 0 1 0 6.400M18 14.500c2 .8 3.500 2.800 3.500 5.500"/>',
  };
  const ic = n => `<svg class="ic" viewBox="0 0 24 24" aria-hidden="true">${ICONS[n]}</svg>`;
  document.querySelectorAll('[data-ic]').forEach(el => { el.innerHTML = ic(el.dataset.ic); });

  /* seta dupla dos botões */
  const SETA = '<svg viewBox="0 0 20 20" aria-hidden="true"><path d="M5 15 15 5M15 5H7M15 5v8"/></svg>';
  document.querySelectorAll('.btn i').forEach(el => { el.innerHTML = SETA + SETA; });

  /* ---------- menu, rodapé, Ludi e IA ---------- */
  const CHEVRON = '<svg viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.6" aria-hidden="true"><path d="M2 4l4 4 4-4"/></svg>';
  const isOn = id => id === page || (id === 'solucoes' && page === 'marcas');
  const aqui = location.pathname.split('/').pop();
  const subLink = ([l, h, sep]) => { const c = [sep, h === aqui && 'on'].filter(Boolean).join(' '); return `<a href="${h}"${c ? ` class="${c}"` : ''}${h === aqui ? ' aria-current="page"' : ''}>${l}</a>`; };
  const links = menu.map(([id, label, href, sub]) => sub
    ? `<li class="has-sub"><a role="button" tabindex="0" aria-haspopup="true"${isOn(id) ? ' class="on"' : ''}>${label}${CHEVRON}</a><div class="sub"><div>${sub.map(subLink).join('')}</div></div></li>`
    : `<li><a href="${href}"${isOn(id) ? ' class="on" aria-current="page"' : ''}>${label}</a></li>`).join('');
  document.body.insertAdjacentHTML('afterbegin', `
<nav class="nav" id="nav"><div class="wrap">
  <a href="index.html" class="logo"><img src="assets/logo_branco.svg" alt="Ludfor"></a>
  <ul>${links}</ul>
  <div class="cta"><a href="${CLIENTE}">Área do Cliente</a></div>
  <button class="burger" aria-label="Abrir menu" aria-expanded="false"><i></i><i></i><i></i></button>
</div></nav>
<div class="drawer" id="drawer">${menu.map(([, l, h, sub]) => (sub ? `<span class="grupo">${l}</span>` : `<a href="${h}">${l}</a>`) + (sub ? sub.map(([sl, sh]) => `<a class="subitem" href="${sh}">${sl}</a>`).join('') : '')).join('')}<a class="cliente" href="${CLIENTE}">Área do Cliente</a></div>`);

  document.body.insertAdjacentHTML('beforeend', `
<footer><div class="wrap">
  <div class="news" data-reveal>
    <div class="news-tx"><h3>Novidades do mercado de energia no seu <span>e-mail</span></h3><p>Inscreva-se e receba análises e tendências do setor elétrico.</p></div>
    <form class="news-form" id="newsForm" novalidate>
      <div class="campo"><input type="email" id="newsEmail" placeholder="Seu melhor e-mail" aria-label="Seu e-mail" autocomplete="email" required><button class="btn"><span>Inscrever-se</span><i>${SETA}${SETA}</i></button></div>
      <small id="newsMsg" role="status"></small>
    </form>
  </div>
  <div class="cols" data-reveal>
    <div class="redes"><h4>Redes sociais</h4>
      <div class="social"><a href="https://br.linkedin.com/company/ludforenergia" aria-label="LinkedIn"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.450 20.450h-3.550v-5.570c0-1.330-.03-3.040-1.850-3.040-1.850 0-2.140 1.450-2.140 2.940v5.670H9.350V9h3.410v1.560h.05c.48-.9 1.640-1.850 3.370-1.850 3.600 0 4.270 2.370 4.270 5.460v6.280ZM5.340 7.430a2.060 2.060 0 1 1 0-4.120 2.060 2.060 0 0 1 0 4.120Zm1.780 13.020H3.560V9h3.560v11.450Z"/></svg></a><a href="https://www.instagram.com/LudforEnergia/" aria-label="Instagram"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5.500"/><circle cx="12" cy="12" r="4.200"/><circle cx="17.300" cy="6.700" r="1.100" fill="currentColor" stroke="none"/></svg></a><a href="https://www.youtube.com/@ludforenergia9713" aria-label="YouTube"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M23.500 6.190a3.020 3.020 0 0 0-2.120-2.140C19.500 3.550 12 3.550 12 3.550s-7.500 0-9.380.5A3.020 3.020 0 0 0 .5 6.190C0 8.070 0 12 0 12s0 3.930.5 5.810a3.020 3.020 0 0 0 2.120 2.140c1.880.5 9.380.5 9.380.5s7.500 0 9.380-.5a3.020 3.020 0 0 0 2.120-2.140C24 15.930 24 12 24 12s0-3.930-.5-5.810ZM9.550 15.570V8.430L15.820 12l-6.270 3.570Z"/></svg></a><a href="https://www.facebook.com/LudforEnergia/" aria-label="Facebook"><svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M14 8.500V6.600c0-.9.600-1.100 1-1.100h2.600V2H14c-3.500 0-4.300 2.600-4.300 4.300v2.200H7.400V12h2.300v10H14V12h3.100l.5-3.500H14Z"/></svg></a></div>
    </div>
    <div><h4>Navegação</h4><ul><li><a href="marcas.html">Marcas</a></li><li><a href="a-ludfor.html">A Ludfor</a></li><li><a href="blog.html">Blog da Energia</a></li><li><a href="https://ludfor.vagas.solides.com.br/">Trabalhe conosco</a></li></ul></div>
    <div><h4>Soluções</h4><ul>
      <li><a href="solucao-gestao.html">Gestão</a></li><li><a href="solucao-autoproducao.html">Autoprodução</a></li><li><a href="solucao-geracao.html">Geração</a></li>
      <li><a href="solucao-comercializacao.html">Comercialização</a></li><li><a href="solucao-geracao-distribuida.html">Geração Distribuída</a></li><li><a href="solucao-engenharia.html">Engenharia</a></li>
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
<aside class="ia" id="ia">
  <header id="iaHead">
    <b class="spark" aria-hidden="true"><svg viewBox="0 0 24 24"><path d="M12 3.500c.9 5 3.500 7.600 8.500 8.500-5 .9-7.600 3.500-8.500 8.500-.9-5-3.500-7.600-8.500-8.500 5-.9 7.600-3.500 8.500-8.500Z"/></svg></b>
    <div>Assistente Ludfor<small>IA · online agora</small></div>
    <button type="button" class="toggle" aria-label="Minimizar assistente"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg></button>
  </header>
  <div class="body">
    <div class="msg">Olá! Quer saber quanto sua empresa pode economizar com energia?</div>
    <form onsubmit="return false"><input placeholder="Escreva sua pergunta" aria-label="Pergunta"><button aria-label="Enviar">→</button></form>
  </div>
</aside>`);

  /* ---------- revelar ao entrar na tela ---------- */
  function countUp(el) {
    const to = +el.dataset.count, pre = el.dataset.pre || '', suf = el.dataset.suf || '', dec = +el.dataset.dec || 0;
    if (reduce) return;
    const t0 = performance.now(), dur = 2600;
    const step = t => {
      const p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 3);
      el.textContent = pre + (to * e).toLocaleString('pt-BR', { minimumFractionDigits: dec, maximumFractionDigits: dec }) + suf;
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
  document.querySelectorAll('[data-reveal],.lines,.wipe,#footBig').forEach(el => { if (!intro.includes(el)) io.observe(el); });
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
  const newsForm = document.getElementById('newsForm'), newsEmail = document.getElementById('newsEmail'), newsMsg = document.getElementById('newsMsg');
  newsForm.addEventListener('submit', e => {
    e.preventDefault(); /* falta ligar à ferramenta de e-mail do cliente: por enquanto nada é gravado */
    const ok = newsEmail.value.trim() && newsEmail.checkValidity();
    newsMsg.textContent = ok ? 'Obrigado! Em breve você recebe nossas novidades.' : 'Digite um e-mail válido.';
    if (ok) newsForm.reset();
  });
  const wa = document.querySelector('footer .wa'), waBtn = wa.querySelector('.wa-btn');
  waBtn.onclick = () => waBtn.setAttribute('aria-expanded', wa.classList.toggle('open'));
  const ia = document.getElementById('ia'), iaToggle = ia.querySelector('.toggle');
  if (matchMedia('(max-width:640px)').matches) { ia.classList.add('min'); iaToggle.setAttribute('aria-label', 'Abrir assistente'); }
  document.getElementById('iaHead').onclick = () => {
    const min = ia.classList.toggle('min');
    iaToggle.setAttribute('aria-label', min ? 'Abrir assistente' : 'Minimizar assistente');
  };

  /* ---------- efeitos de rolagem: o menu fica sempre visível e ganha fundo depois do banner ---------- */
  const nav = document.getElementById('nav'), hero = document.querySelector('body > header');
  const hooks = [];
  function onScroll() {
    const y = scrollY, heroEnd = hero ? hero.offsetHeight - nav.offsetHeight : 40;
    nav.classList.toggle('solid', y >= heroEnd);
    hooks.forEach(fn => fn(y));
  }
  addEventListener('scroll', onScroll, { passive: true });
  addEventListener('resize', onScroll);
  addEventListener('load', onScroll);
  onScroll();

  /* ---------- fundo que se revela sob o mouse: <section data-revela> ---------- */
  const BOLT = 'M112.43,58.37c-3.38,3.72-6.18,7.64-8.51,11.64-21.59,40.99-43.17,81.98-64.76,122.97-1.43,2.5-11.7,21.15-3.54,41.96,6.73,17.17,23.36,29.08,42.65,30.6,112.56-.12,225.13-.24,337.69-.37,21.04-.63,39.94,12.11,46.64,31.04,5.8,16.4,1.6,35.06-10.76,48.13-95.64,99.83-191.29,199.66-286.93,299.48-15.63,15.93-40.17,17.55-56.14,5.05-13.42-10.5-18.79-29.4-12.9-46.76,73.04-164.03,146.09-328.06,219.13-492.09,1.42-2.39,13.09-22.8,3.88-45.67-7.06-17.54-23.68-29.8-43.05-31.87-31.39.08-62.78.16-94.17.24-11.7-.22-46.56.66-69.23,25.64Z';
  const fino = matchMedia('(pointer: fine)').matches;
  document.querySelectorAll('[data-revela]').forEach((el, n) => {
    if (reduce) return;
    const b = (x, y) => `<path d="${BOLT}" transform="translate(${x} ${y}) scale(.075)" fill="none" stroke="#F9B519" stroke-width="20" stroke-linecap="round" stroke-linejoin="round"/>`;
    el.insertAdjacentHTML('afterbegin', `<div class="revela" aria-hidden="true"><svg width="100%" height="100%"><defs><pattern id="rv${n}" width="104" height="124" patternUnits="userSpaceOnUse" patternTransform="rotate(-8)">${b(6, 6)}${b(58, 66)}</pattern></defs><rect width="100%" height="100%" fill="url(#rv${n})"/></svg></div>`);
    const c = el.firstElementChild;
    let x = 0, y = 0, tx = 0, ty = 0, raf = 0;
    const tick = () => {
      x += (tx - x) * .12; y += (ty - y) * .12;
      c.style.setProperty('--mx', x + 'px'); c.style.setProperty('--my', y + 'px');
      raf = Math.abs(tx - x) + Math.abs(ty - y) > .5 ? requestAnimationFrame(tick) : 0;
    };
    const vai = () => { if (!raf) raf = requestAnimationFrame(tick); };
    if (fino) {
      const pos = e => { const r = el.getBoundingClientRect(); tx = e.clientX - r.left; ty = e.clientY - r.top; };
      el.addEventListener('pointerenter', e => { pos(e); x = tx; y = ty; c.classList.add('on'); vai(); });
      el.addEventListener('pointermove', e => { pos(e); vai(); });
      el.addEventListener('pointerleave', () => c.classList.remove('on'));
    } else {
      /* sem mouse: a luz acompanha a rolagem */
      c.classList.add('on');
      hooks.push(() => { const r = el.getBoundingClientRect(); if (r.bottom < 0 || r.top > innerHeight) return; tx = el.offsetWidth * .6; ty = innerHeight * .5 - r.top; vai(); });
    }
  });

  /* ---------- raio que se desenha com a rolagem: <section data-raio> ---------- */
  const raios = [...document.querySelectorAll('[data-raio]')].map((el, n) => {
    const svg = `<svg class="raio" viewBox="0 0 490 700" aria-hidden="true"><defs><linearGradient id="rg${n}" gradientUnits="userSpaceOnUse" x1="40" y1="60" x2="440" y2="660"><stop offset="0" stop-color="#dcff5e"/><stop offset=".8" stop-color="#fab42c"/></linearGradient></defs><path pathLength="1" d="${BOLT}" fill="none" stroke="url(#rg${n})" stroke-width="30" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    el.insertAdjacentHTML('afterbegin', svg);
    const path = el.querySelector('.raio path');
    path.style.strokeDasharray = '1';
    path.style.strokeDashoffset = reduce ? '0' : '1';
    if (!reduce) path.style.visibility = 'hidden';
    return { el, path, p: 0 };
  });
  let raioAtivo = false;
  const animaRaios = () => {
    let segue = false;
    raios.forEach(o => {
      const r = o.el.getBoundingClientRect();
      /* começa com o topo da seção a 40% da altura da tela e termina um pouco antes de ela preencher a tela */
      const ini = innerHeight * .4, fim = innerHeight * .04;
      const alvo = Math.min(1, Math.max(0, (ini - r.top) / (ini - fim)));
      o.p += (alvo - o.p) * .08;
      if (Math.abs(alvo - o.p) < .001) o.p = alvo; else segue = true;
      o.path.style.strokeDashoffset = 1 - o.p;
      o.path.style.visibility = o.p > .002 ? 'visible' : 'hidden';
    });
    if (segue) requestAnimationFrame(animaRaios); else raioAtivo = false;
  };
  if (!reduce && raios.length) hooks.push(() => { if (!raioAtivo) { raioAtivo = true; requestAnimationFrame(animaRaios); } });

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

  window.Ludfor = { reduce, ic, autoTabs, countUp, onScroll: fn => { hooks.push(fn); fn(scrollY); } };
})();
