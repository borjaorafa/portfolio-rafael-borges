/**
 * Portfólio profissional de Rafael Borges.
 * Cada identificador abaixo aponta para um vídeo no Google Drive.
 * O player é carregado somente após o clique no vídeo.
 */
const videos = Object.freeze({
  financeiro: { titulo: 'Apresentação Financeira', identificador: '16xeV9lCVPOyWeZC488_8tPKZij_54cV3' },
  produtos: { titulo: 'Apresentação de Produtos', identificador: '1pfJQMGg7YWrXrgMefhqGoH1zN24qu7Tn' },
  pessoas: { titulo: 'Apresentação Cadastral de Pessoas', identificador: '1NL6UeyYiwIg1UpglAyZNK_0PVl6CRYmT' },
  estoque: { titulo: 'Apresentação de Estoque', identificador: '1wNbVYhPoWxlgjYXoT_XWs23z0ccJVZe3' }
});

const janela = document.getElementById('video-dialog');
const quadro = document.getElementById('video-frame');
const titulo = document.getElementById('video-dialog-title');
const linkOriginal = document.getElementById('video-direct');
const botaoFechar = document.getElementById('close-dialog');
let ultimoAcionador = null;

function abrirVideo(chave, acionador) {
  const video = videos[chave];
  if (!video || !janela || typeof janela.showModal !== 'function') return false;
  ultimoAcionador = acionador;
  titulo.textContent = video.titulo;
  quadro.title = `Vídeo: ${video.titulo}`;
  linkOriginal.href = `https://drive.google.com/file/d/${encodeURIComponent(video.identificador)}/view?usp=sharing`;
  quadro.src = `https://drive.google.com/file/d/${encodeURIComponent(video.identificador)}/preview`;
  janela.showModal();
  document.body.classList.add('modal-open');
  botaoFechar.focus();
  return true;
}

for (const acionador of document.querySelectorAll('[data-video]')) {
  acionador.addEventListener('click', (evento) => {
    if (abrirVideo(acionador.dataset.video, acionador)) evento.preventDefault();
  });
}

botaoFechar?.addEventListener('click', () => janela.close());
janela?.addEventListener('click', (evento) => {
  if (evento.target === janela) janela.close();
});
janela?.addEventListener('close', () => {
  quadro.removeAttribute('src'); // Interrompe áudio e libera recursos.
  document.body.classList.remove('modal-open');
  ultimoAcionador?.focus({ preventScroll: true });
});

document.getElementById('ano-atual').textContent = String(new Date().getFullYear());


/**
 * Interações da V5: barra de leitura, navegação por seção, menu para celular,
 * efeitos nos cartões e animações de entrada.
 * A navegação funciona sem GSAP e respeita a preferência por movimento reduzido.
 */
const movimentoReduzido = window.matchMedia('(prefers-reduced-motion: reduce)');
const ponteiroPreciso = window.matchMedia('(hover: hover) and (pointer: fine)');
const cabecalho = document.querySelector('.cabecalho');
const barraLeitura = document.getElementById('progresso-rolagem');
const botaoVoltar = document.getElementById('voltar-topo');
const anelLeitura = document.getElementById('anel-progresso');
const botaoMenu = document.getElementById('menu-alternar');
const menuMobile = document.getElementById('menu-mobile');
const linksNavegacao = document.querySelectorAll('.navegacao a, .menu-mobile a');
const secoesNavegacao = [...document.querySelectorAll('#sobre, #atuacao, #apresentacoes, #projetos-desenvolvidos, #experiencia, #conhecimentos, #formacao, #recomendacoes, #contato')];
let atualizacaoPendente = false;

function fecharMenu() {
  botaoMenu.setAttribute('aria-expanded', 'false');
  botaoMenu.setAttribute('aria-label', 'Abrir menu de navegação');
  menuMobile.hidden = true;
}

function alternarMenu() {
  const abrir = botaoMenu.getAttribute('aria-expanded') !== 'true';
  botaoMenu.setAttribute('aria-expanded', String(abrir));
  botaoMenu.setAttribute('aria-label', abrir ? 'Fechar menu de navegação' : 'Abrir menu de navegação');
  menuMobile.hidden = !abrir;
}

botaoMenu?.addEventListener('click', alternarMenu);
menuMobile?.querySelectorAll('a').forEach(link => link.addEventListener('click', fecharMenu));
document.addEventListener('keydown', evento => {
  if (evento.key === 'Escape' && !menuMobile.hidden) {
    fecharMenu();
    botaoMenu.focus();
  }
});
document.addEventListener('click', evento => {
  if (!menuMobile.hidden && !cabecalho.contains(evento.target)) fecharMenu();
});
window.matchMedia('(min-width: 801px)').addEventListener('change', evento => {
  if (evento.matches) fecharMenu();
});

function atualizarNavegacao() {
  const rolado = Math.max(0, window.scrollY);
  const percorrido = document.documentElement.scrollHeight - window.innerHeight;
  const proporcao = percorrido > 0 ? Math.min(rolado / percorrido, 1) : 0;
  barraLeitura.style.transform = `scaleX(${proporcao})`;
  anelLeitura.style.strokeDashoffset = String(125.66 * (1 - proporcao));
  cabecalho.classList.toggle('cabecalho--rolagem', rolado > 24);
  const mostrarVoltar = rolado > 520;
  botaoVoltar.classList.toggle('visivel', mostrarVoltar);
  botaoVoltar.tabIndex = mostrarVoltar ? 0 : -1;

  // A seção mais próxima do ponto de leitura tem seu link destacado.
  let secaoAtiva = '';
  const referencia = window.innerHeight * .36 + cabecalho.offsetHeight;
  for (const secao of secoesNavegacao) {
    if (secao.getBoundingClientRect().top <= referencia) secaoAtiva = secao.id;
  }
  if (percorrido > 0 && percorrido - rolado < 6) secaoAtiva = 'contato';
  linksNavegacao.forEach(link => {
    const ativo = link.getAttribute('href') === `#${secaoAtiva}`;
    link.classList.toggle('ativo', ativo);
    if (ativo) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
  atualizacaoPendente = false;
}

window.addEventListener('scroll', () => {
  if (!atualizacaoPendente) {
    atualizacaoPendente = true;
    requestAnimationFrame(atualizarNavegacao);
  }
}, {passive: true});
window.addEventListener('resize', () => requestAnimationFrame(atualizarNavegacao), {passive: true});
window.addEventListener('load', atualizarNavegacao);
atualizarNavegacao();

// Ponto de luz que acompanha o mouse no cartão. A inclinação máxima é sutil.
if (ponteiroPreciso.matches && !movimentoReduzido.matches) {
  document.querySelectorAll('.video__capa').forEach(capa => {
    capa.addEventListener('pointermove', evento => {
      const caixa = capa.getBoundingClientRect();
      const x = (evento.clientX - caixa.left) / caixa.width;
      const y = (evento.clientY - caixa.top) / caixa.height;
      capa.style.setProperty('--ponteiro-x', `${(x * 100).toFixed(1)}%`);
      capa.style.setProperty('--ponteiro-y', `${(y * 100).toFixed(1)}%`);
      capa.style.transform = `perspective(1000px) rotateX(${((.5-y)*3).toFixed(2)}deg) rotateY(${((x-.5)*3).toFixed(2)}deg) translateY(-5px)`;
    }, {passive:true});
    capa.addEventListener('pointerleave', () => {
      capa.style.removeProperty('transform');
      capa.style.removeProperty('--ponteiro-x');
      capa.style.removeProperty('--ponteiro-y');
    });
  });
}

function iniciarAnimacoes() {
  if (movimentoReduzido.matches || document.visibilityState === 'prerender') return;
  const entradas = [
    '.secao-topo', '.video', '.sobre__foto-wrap', '.sobre__conteudo', '.especialidades__item',
    '.experiencia__titulo', '.experiencia__item', '.experiencia__mais',
    '.contato__intro', '.contato__opcoes', '.conhecimento', '.formacao__lista article', '.recomendacao-card'
  ];

  if (window.gsap && window.ScrollTrigger) {
    gsap.registerPlugin(ScrollTrigger);
    const apresentacao = ['.sobretitulo', '.destaque h1', '.destaque__area', '.destaque__descricao', '.destaque__acoes', '.destaque__nota'];
    const animacaoInicial = gsap.timeline({defaults:{ease:'power3.out'}});
    animacaoInicial.from(apresentacao.join(','), {autoAlpha:0,y:22,duration:.8,stagger:.095,clearProps:'all'});

    for (const seletor of entradas) {
      for (const elemento of document.querySelectorAll(seletor)) {
        gsap.from(elemento, {
          autoAlpha:0, y:34, duration:.8, ease:'power2.out', clearProps:'all',
          scrollTrigger:{trigger:elemento,start:'top 90%',once:true}
        });
      }
    }
    return;
  }

  // Alternativa nativa: anima apenas quando os elementos entram em cena.
  if ('IntersectionObserver' in window) {
    const observador = new IntersectionObserver(registros => {
      registros.forEach(registro => {
        if (!registro.isIntersecting) return;
        observador.unobserve(registro.target);
        registro.target.animate(
          [{opacity:.28,transform:'translateY(26px)'},{opacity:1,transform:'translateY(0)'}],
          {duration:680,easing:'cubic-bezier(.22,1,.36,1)'}
        );
      });
    }, {threshold:.07,rootMargin:'0px 0px -25px 0px'});
    document.querySelectorAll(entradas.join(',')).forEach(elemento => observador.observe(elemento));
  }
}

iniciarAnimacoes();

/**
 * V6 · Navegação editorial, luz ambiente e leitura da linha do tempo.
 * Nenhuma interação essencial depende da biblioteca de animações.
 */
const atalhosSecoes = [...document.querySelectorAll('.secoes-flutuantes a')];
const trilhoExperiencia = document.querySelector('.experiencia__trilho');
const blocoExperiencias = document.querySelector('.experiencia__lista');
const itensExperiencia = [...document.querySelectorAll('.experiencia__item')];
const cartaoDestaque = document.querySelector('.visual__moldura');
const faixaEspecialidades = document.querySelector('.especialidades__grade');
const todosAlvos = ['inicio','sobre','atuacao','apresentacoes','experiencia','conhecimentos','formacao','recomendacoes','contato'];
const luzPonteiro = document.createElement('div');
luzPonteiro.className = 'luz-ponteiro';
luzPonteiro.setAttribute('aria-hidden', 'true');
if (ponteiroPreciso.matches && !movimentoReduzido.matches) document.body.append(luzPonteiro);

function atualizarDetalhesV6() {
  // Realça o capítulo lido mantendo o início como primeira referência.
  const marco = window.innerHeight * 0.38 + (cabecalho?.offsetHeight || 0);
  let ativa = 'inicio';
  for (const identificador of todosAlvos.slice(1)) {
    const alvo = document.getElementById(identificador);
    if (alvo && alvo.getBoundingClientRect().top <= marco) ativa = identificador;
  }
  if (document.documentElement.scrollHeight - window.innerHeight - scrollY < 8) ativa = 'contato';
  atalhosSecoes.forEach(link => {
    const estaAtivo = link.dataset.secao === ativa;
    link.classList.toggle('ativo',estaAtivo);
    if (estaAtivo) link.setAttribute('aria-current','location');
    else link.removeAttribute('aria-current');
  });
  // Preenche a linha do tempo apenas conforme ela é percorrida.
  if (blocoExperiencias && trilhoExperiencia) {
    const dimensoes = blocoExperiencias.getBoundingClientRect();
    const cursor = window.innerHeight * .55 - dimensoes.top;
    const distancia = Math.max(1, dimensoes.height - 100);
    trilhoExperiencia.style.setProperty('--trilho-progresso', `${Math.round(100 * Math.max(0,Math.min(1,cursor/distancia)))}%`);
  }
}
let aguardandoDetalhes = false;
function solicitarDetalhesV6() {
  if (aguardandoDetalhes) return;
  aguardandoDetalhes = true;
  requestAnimationFrame(() => { atualizarDetalhesV6(); aguardandoDetalhes = false; });
}
addEventListener('scroll', solicitarDetalhesV6, {passive:true});
addEventListener('resize', solicitarDetalhesV6, {passive:true});
atualizarDetalhesV6();

// Uma etapa de carreira é destacada quando alcança a região de leitura.
if ('IntersectionObserver' in window) {
  const observadorCarreira = new IntersectionObserver(registros => {
    registros.forEach(registro => registro.target.classList.toggle('em-foco',registro.isIntersecting));
  },{rootMargin:'-26% 0px -41% 0px',threshold:0});
  itensExperiencia.forEach(item => observadorCarreira.observe(item));
}

// Mouse em desktop: brilho quase imperceptível e profundidade no vídeo destacado.
if (ponteiroPreciso.matches && !movimentoReduzido.matches) {
  let posicaoX = -400, posicaoY = -400;
  document.addEventListener('pointermove', evento => {
    posicaoX = evento.clientX; posicaoY = evento.clientY;
    if (luzPonteiro.parentNode) {
      luzPonteiro.style.left = `${posicaoX}px`;
      luzPonteiro.style.top = `${posicaoY}px`;
      luzPonteiro.style.opacity = '.65';
    }
  }, {passive:true});
  document.addEventListener('pointerleave', () => {luzPonteiro.style.opacity='0';});
  cartaoDestaque?.addEventListener('pointermove', evento => {
    const caixa=cartaoDestaque.getBoundingClientRect();
    const x=(evento.clientX-caixa.left)/caixa.width-.5;
    const y=(evento.clientY-caixa.top)/caixa.height-.5;
    cartaoDestaque.style.transform=`perspective(1200px) rotateX(${(-y*2.3).toFixed(2)}deg) rotateY(${(x*2.3).toFixed(2)}deg)`;
  }, {passive:true});
  cartaoDestaque?.addEventListener('pointerleave', () => {cartaoDestaque.style.transform='';});
}

// Animações adicionais com GSAP. Caso indisponível, todos os elementos permanecem visíveis.
function prepararCenasV6() {
  if (movimentoReduzido.matches || !window.gsap || !window.ScrollTrigger) return;
  gsap.registerPlugin(ScrollTrigger);
  gsap.from('.especialidades__introducao', {
    opacity: .65, duration: .8, ease:'power2.out',
    scrollTrigger: {trigger:'.especialidades',start:'top 96%',once:true}
  });
  gsap.from('.marcos__item', {
    opacity:0, y:27, duration:.85, stagger:.15, ease:'power3.out',
    scrollTrigger:{trigger:'.marcos',start:'top 86%',once:true}
  });
}
if (document.readyState==='complete') prepararCenasV6();
else window.addEventListener('load',prepararCenasV6,{once:true});

// Entrada editorial das especialidades, sem ocultar o conteúdo se JS/CDN falhar.
if (!movimentoReduzido.matches && 'IntersectionObserver' in window) {
  const observerEspecialidades = new IntersectionObserver((itens, observador) => {
    for (const item of itens) {
      if (!item.isIntersecting) continue;
      item.target.classList.add('especialidade-visivel');
      observador.unobserve(item.target);
    }
  }, { threshold:.15 });
  document.querySelectorAll('.especialidades__item').forEach((item,i) => {
    item.style.setProperty('--indice-entrada',i);
    observerEspecialidades.observe(item);
  });
}

/**
 * V8 · Aperfeiçoamento editorial e leitura em capítulos.
 * Os botões das especialidades usam aria-expanded e os detalhes da
 * experiência utilizam <details>, funcionando inclusive sem JavaScript.
 */
const botoesEspecialidades = [...document.querySelectorAll('.especialidades__item')];
botoesEspecialidades.forEach(botao => {
  botao.addEventListener('click', () => {
    const expandir = botao.getAttribute('aria-expanded') !== 'true';
    botoesEspecialidades.forEach(outro => outro.setAttribute('aria-expanded', 'false'));
    botao.setAttribute('aria-expanded', String(expandir));
  });
});

const capituloAtual = document.getElementById('capitulo-atual');
const nomesCapitulos = Object.freeze({
  inicio: 'Início', sobre: 'Sobre mim', atuacao: 'Atuação', apresentacoes: 'Treinamentos', experiencia: 'Experiência', conhecimentos: 'Conhecimentos', formacao: 'Formação', recomendacoes: 'Recomendações', contato: 'Contato'
});
function atualizarCapituloV8() {
  if (!capituloAtual) return;
  const limite = innerHeight * 0.38 + (cabecalho?.offsetHeight || 0);
  let chave = 'inicio';
  for (const identificador of Object.keys(nomesCapitulos).slice(1)) {
    const secao = document.getElementById(identificador);
    if (secao && secao.getBoundingClientRect().top <= limite) chave = identificador;
  }
  if (document.documentElement.scrollHeight - innerHeight - scrollY < 8) chave = 'contato';
  if (capituloAtual.textContent !== nomesCapitulos[chave]) capituloAtual.textContent = nomesCapitulos[chave];
}
let capituloPendente = false;
function solicitarCapituloV8() {
  if (capituloPendente) return;
  capituloPendente = true;
  requestAnimationFrame(() => { atualizarCapituloV8(); capituloPendente = false; });
}
window.addEventListener('scroll', solicitarCapituloV8, { passive: true });
window.addEventListener('resize', solicitarCapituloV8, { passive: true });
atualizarCapituloV8();

// Ajuda a recuperar a leitura ao abrir vários itens de carreira no celular.
document.querySelectorAll('.experiencia__detalhes').forEach(bloco => {
  bloco.addEventListener('toggle', () => {
    // Abertura é automática e não força a página a saltar de posição.
    if (window.ScrollTrigger && typeof window.ScrollTrigger.refresh === 'function') {
      window.ScrollTrigger.refresh();
    }
    requestAnimationFrame(atualizarDetalhesV6);
  });
});

// Ao chegar em Contato, os botões grandes da seção substituem os balões flutuantes.
const baloesContato = document.querySelector('.baloes-contato');
const secaoContato = document.getElementById('contato');
if ('IntersectionObserver' in window && baloesContato && secaoContato) {
  const observadorContato = new IntersectionObserver(registros => {
    baloesContato.classList.toggle('baloes-contato--oculto', registros[0].isIntersecting);
  }, { threshold: .18 });
  observadorContato.observe(secaoContato);
}

/** V10: libera a leitura dos depoimentos no celular, sem botões flutuantes sobre os textos. */
const secaoRecomendacoes = document.getElementById('recomendacoes');
if (secaoRecomendacoes && 'IntersectionObserver' in window) {
  const observadorRecomendacoes = new IntersectionObserver((registros) => {
    for (const registro of registros) {
      document.body.classList.toggle('recomendacoes-em-leitura', registro.isIntersecting);
    }
  }, {rootMargin:'-70px 0px -70px 0px',threshold:0});
  observadorRecomendacoes.observe(secaoRecomendacoes);
}


/** V10.2: interações editoriais discretas, sem dependência de biblioteca externa. */
if (!movimentoReduzido.matches) {
  // Ao clicar em links e botões, um pequeno pulso acompanha o gesto.
  document.querySelectorAll('.botao, .navegacao a, .painel-editorial__item, .video__capa, .contato__opcao, .menu-mobile a, .secoes-flutuantes a, .recomendacoes__origem').forEach(elemento => {
    elemento.classList.add('interacao-tatil');
    elemento.addEventListener('pointerdown', evento => {
      if (evento.pointerType === 'mouse' && evento.button !== 0) return;
      const caixa = elemento.getBoundingClientRect();
      const onda = document.createElement('span');
      onda.className = 'interacao-tatil__onda';
      onda.style.left = `${evento.clientX - caixa.left}px`;
      onda.style.top = `${evento.clientY - caixa.top}px`;
      onda.addEventListener('animationend', () => onda.remove(), {once:true});
      elemento.append(onda);
    }, {passive:true});
  });

  // Entrada escalonada dos depoimentos, mantendo tudo legível sem JavaScript.
  if ('IntersectionObserver' in window) {
    const observaDepoimentos = new IntersectionObserver(registros => {
      for (const registro of registros) {
        if (!registro.isIntersecting) continue;
        registro.target.classList.add('recomendacao-card--visivel');
        observaDepoimentos.unobserve(registro.target);
      }
    }, {threshold:.12,rootMargin:'0px 0px -45px 0px'});
    document.querySelectorAll('.recomendacao-card').forEach((card, indice) => {
      card.style.setProperty('--ordem-card',indice % 2);
      observaDepoimentos.observe(card);
    });
  }

  // O cartão de destaque acompanha delicadamente o ponteiro sem deslocar a página.
  const painel = document.querySelector('.destaque__painel');
  if (painel && ponteiroPreciso.matches) {
    painel.addEventListener('pointermove', evento => {
      const r = painel.getBoundingClientRect();
      const x = (evento.clientX-r.left)/r.width-.5;
      const y = (evento.clientY-r.top)/r.height-.5;
      painel.style.setProperty('--paralaxe-x',`${(x*7).toFixed(2)}px`);
      painel.style.setProperty('--paralaxe-y',`${(y*7).toFixed(2)}px`);
    }, {passive:true});
    painel.addEventListener('pointerleave', () => {
      painel.style.setProperty('--paralaxe-x','0px');
      painel.style.setProperty('--paralaxe-y','0px');
    });
  }
}

// Identificador de capítulo se atualiza mesmo quando a seção foi removida.
const observadorNovasSecoes = document.querySelectorAll('.recomendacoes__lista, .apresentacoes .galeria, .experiencia__lista');
if ('IntersectionObserver' in window && !movimentoReduzido.matches) {
  const observadorDetalhes = new IntersectionObserver(entradas => {
    entradas.forEach(entrada => {
      if (!entrada.isIntersecting) return;
      entrada.target.classList.add('conteudo-em-cena');
      observadorDetalhes.unobserve(entrada.target);
    });
  }, {threshold:.1});
  observadorNovasSecoes.forEach(secao => observadorDetalhes.observe(secao));
}

// V11.7: prévias em vídeo, abertas ao clicar em qualquer área do cartão.
// Os MP4 não são carregados até a primeira interação do visitante.
const demonstracoesProjetos = Object.freeze({
  'diario-de-pressao': { titulo: 'Diário de Pressão', arquivo: './assets/videos/diario-de-pressao.mp4', imagem: './assets/projetos/poster-diario-de-pressao.webp' },
  'meu-roteirista': { titulo: 'Meu Roteirista', arquivo: './assets/videos/meu-roteirista.mp4', imagem: './assets/projetos/poster-meu-roteirista.webp' },
  'midas-by-rbs-technology': { titulo: 'Midas by RBS Technology', arquivo: './assets/videos/midas-by-rbs-technology.mp4', imagem: './assets/projetos/poster-midas-by-rbs-technology.webp' },
  'evolut-lite': { titulo: 'Evolut Lite', arquivo: './assets/videos/evolut-lite.mp4', imagem: './assets/projetos/poster-evolut-lite.webp' },
  'rastro': { titulo: 'Rastro', arquivo: './assets/videos/rastro.mp4', imagem: './assets/projetos/poster-rastro.webp' },
  'nine2five': { titulo: 'Nine2Five', arquivo: './assets/videos/nine2five.mp4', imagem: './assets/projetos/poster-nine2five.webp' },
  'rafoot': { titulo: 'Rafoot', arquivo: './assets/videos/rafoot.mp4', imagem: './assets/projetos/poster-rafoot.webp' },
  'da-o-papo': { titulo: 'Dá o Papo!', arquivo: './assets/videos/da-o-papo.mp4', imagem: './assets/projetos/poster-da-o-papo.webp' },
  'submundo': { titulo: 'Submundo', arquivo: './assets/videos/submundo.mp4', imagem: './assets/projetos/poster-submundo.webp' }
});
const janelaDemonstracao = document.getElementById('projeto-video-modal');
const playerDemonstracao = document.getElementById('projeto-video-player');
const tituloDemonstracao = document.getElementById('projeto-video-titulo');
const botaoFecharDemonstracao = document.getElementById('projeto-video-fechar');
let ultimoCartaoDemonstracao = null;

function abrirDemonstracao(chave, cartao) {
  const projeto = demonstracoesProjetos[chave];
  if (!projeto || !janelaDemonstracao || !playerDemonstracao || janelaDemonstracao.open) return;
  ultimoCartaoDemonstracao = cartao;
  tituloDemonstracao.textContent = projeto.titulo;
  playerDemonstracao.setAttribute('aria-label', `Demonstração do projeto ${projeto.titulo}`);
  playerDemonstracao.muted = true;
  playerDemonstracao.loop = true;
  playerDemonstracao.poster = projeto.imagem;
  playerDemonstracao.src = projeto.arquivo;
  janelaDemonstracao.showModal();
  document.body.classList.add('modal-open');
  playerDemonstracao.play().catch(() => {
    // Se o navegador bloquear autoplay, os controles permanecem acessíveis.
  });
  botaoFecharDemonstracao?.focus({preventScroll:true});
}

for (const cartao of document.querySelectorAll('.projeto-autor[data-video-projeto]')) {
  cartao.addEventListener('click', () => abrirDemonstracao(cartao.dataset.videoProjeto, cartao));
  cartao.addEventListener('keydown', evento => {
    if (evento.target !== cartao || !['Enter',' '].includes(evento.key)) return;
    evento.preventDefault();
    abrirDemonstracao(cartao.dataset.videoProjeto, cartao);
  });
}
botaoFecharDemonstracao?.addEventListener('click', () => janelaDemonstracao?.close());
janelaDemonstracao?.addEventListener('click', evento => {
  if (evento.target === janelaDemonstracao) janelaDemonstracao.close();
});
janelaDemonstracao?.addEventListener('close', () => {
  playerDemonstracao?.pause();
  playerDemonstracao?.removeAttribute('src');
  playerDemonstracao?.load(); // Descarta o vídeo anterior e libera a memória.
  document.body.classList.remove('modal-open');
  ultimoCartaoDemonstracao?.focus({preventScroll:true});
});
