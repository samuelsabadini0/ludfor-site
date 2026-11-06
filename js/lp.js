/* Landing page de solução: faixa de logos, depoimentos e formulário. */
(() => {
  const LOGOS = { Tramontina: 106, 'John Deere': 107, Outback: 108, Urbano: 109, Dass: 110, Pittol: 111, Anselmi: 112, 'Orquídea': 113, Oderich: 114, 'Intercity Hotels': 115, Unimed: 116, Soprano: 117, 'Multimóveis': 118, 'Grupo Passarela': 119, Madesa: 120, 'Santa Clara': 121, 'Comercial Zaffari': 122, 'Caitá Supermercados': 123, UnidaSul: 124, Cotriel: 125, Coocam: 126, Saif: 127, Azeplast: 128, Peruzzo: 129, Agrale: 130, 'Agrária': 131, 'Rede Vivo': 132, Imec: 133, 'Progás': 134, Be8: 135, Gazin: 136, MOR: 137, Amarim: 138, 'Roldão Atacadista': 139, 'Vinícola Aurora': 140, 'Supermercados Andreazza': 141, Buffon: 142, 'Master Supermercados': 143, Seta: 144 };
  const trilho = document.getElementById('trilho');
  if (trilho) {
    const volta = Object.entries(LOGOS).map(([n, i]) => '<img src="assets/clientes/image' + i + '.svg" alt="' + n + '">').join('');
    trilho.innerHTML = volta + volta;
    trilho.style.setProperty('--dur', Object.keys(LOGOS).length * 3 + 's');
    const faixa = trilho.closest('.faixa');
    const vel = v => trilho.getAnimations().forEach(a => { a.playbackRate = v; });
    faixa.addEventListener('pointerenter', () => vel(.25));
    faixa.addEventListener('pointerleave', () => vel(1));
  }
  /* percurso: a linha segue a rolagem com atraso; marcador e texto ganham cor quando ela chega */
  const tr = document.getElementById('tr');
  if (tr) {
    const linha = document.getElementById('trLinha'), nos = [...tr.querySelectorAll('.no')];
    const coluna = matchMedia('(max-width:1199px)');
    const TOTAL = linha.getTotalLength();
    linha.style.strokeDasharray = TOTAL;
    const pts = [];
    for (let l = 0; l <= TOTAL; l += 6) { const q = linha.getPointAtLength(l); pts.push([l, q.x, q.y]); }
    const marcos = nos.map(n => { const x = +n.dataset.x, y = +n.dataset.y; return pts.reduce((m, q) => { const d = (q[1] - x) ** 2 + (q[2] - y) ** 2; return d < m[0] ? [d, q[0]] : m; }, [1e12, 0])[1] / TOTAL; });
    let alvo = 0, p = 0, rodando = false;
    const pinta = () => {
      linha.style.strokeDashoffset = TOTAL * (1 - p);
      tr.style.setProperty('--prog', p);
      nos.forEach((n, i) => n.classList.toggle('on', coluna.matches ? p * tr.offsetHeight >= n.offsetTop : p >= marcos[i] - .002));
    };
    const anda = () => {
      const v = (alvo - p) * .07;
      p = Math.abs(alvo - p) < .0005 ? alvo : p + Math.max(-.02, Math.min(.0055, v));
      pinta();
      if (p !== alvo) requestAnimationFrame(anda); else rodando = false;
    };
    const rola = () => {
      if (Ludfor.reduce) { alvo = p = 1; return pinta(); }
      const r = tr.getBoundingClientRect(), vh = innerHeight;
      alvo = Math.max(0, Math.min(1, (vh * .72 - r.top) / (r.height - vh * .08)));
      if (!rodando) { rodando = true; requestAnimationFrame(anda); }
    };
    Ludfor.onScroll(rola);
    addEventListener('resize', rola);
  }
  const sl = document.getElementById('depSlider'), prog = document.getElementById('depProg');
  if (sl) {
    document.querySelectorAll('.dep .arrows button').forEach(b => { b.onclick = () => sl.scrollBy({ left: b.dataset.d * sl.clientWidth * .8, behavior: 'smooth' }); });
    const barra = () => {
      const max = sl.scrollWidth - sl.clientWidth, w = sl.clientWidth / sl.scrollWidth;
      prog.style.width = (w * 100) + '%';
      prog.style.transform = 'translateX(' + ((max ? sl.scrollLeft / max : 0) * (1 / w - 1) * 100) + '%)';
    };
    sl.addEventListener('scroll', barra, { passive: true });
    addEventListener('resize', barra);
    barra();
  }
  /* falta ligar o formulário ao sistema do cliente: por enquanto nada é enviado */
  const form = document.getElementById('lpForm');
  if (form) form.addEventListener('submit', e => {
    e.preventDefault();
    const msg = form.querySelector('.msg'), ok = form.checkValidity();
    msg.classList.toggle('erro', !ok);
    msg.textContent = ok ? 'Recebemos sua mensagem. Em breve um especialista entra em contato.' : 'Preencha os campos e aceite o aviso para enviar.';
    if (ok) form.reset();
  });
})();
