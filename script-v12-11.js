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
const secoesNavegacao = [...document.querySelectorAll('#sobre, #atuacao, #projetos-desenvolvidos, #apresentacoes, #experiencia, #recomendacoes, #contato')];
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
const todosAlvos = ['inicio','sobre','atuacao','projetos-desenvolvidos','apresentacoes','experiencia','recomendacoes','contato'];
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
  inicio: 'Início', sobre: 'Sobre mim', atuacao: 'Atuação', 'projetos-desenvolvidos': 'Soluções', apresentacoes: 'Treinamentos', experiencia: 'Experiência', recomendacoes: 'Recomendações', contato: 'Contato'
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
  'rbs-databridge': { titulo: 'RBS DataBridge', arquivo: './assets/videos/rbs-databridge.mp4', imagem: './assets/projetos/previews/rbs-databridge.jpg', conceitual: true },
  'evolut-kronus': { titulo: 'Evolut Kronus', arquivo: './assets/videos/evolut-kronus.mp4', imagem: './assets/projetos/previews/evolut-kronus.jpg', conceitual: true },
  'diario-de-pressao': { titulo: 'Diário de Pressão', arquivo: './assets/videos/diario-de-pressao.mp4', imagem: './assets/projetos/previews/diario-de-pressao.jpg' },
  'meu-roteirista': { titulo: 'Meu Roteirista', arquivo: './assets/videos/meu-roteirista.mp4', imagem: './assets/projetos/previews/meu-roteirista.jpg' },
  'midas-by-rbs-technology': { titulo: 'Midas', arquivo: './assets/videos/midas-by-rbs-technology.mp4', imagem: './assets/projetos/previews/midas-by-rbs-technology.jpg' },
  'evolut-lite': { titulo: 'Evolut Lite', arquivo: './assets/videos/evolut-lite.mp4', imagem: './assets/projetos/previews/evolut-lite.jpg' },
  'rastro': { titulo: 'Rastro', arquivo: './assets/videos/rastro.mp4', imagem: './assets/projetos/previews/rastro.jpg' },
  'nine2five': { titulo: 'Nine2Five', arquivo: './assets/videos/nine2five.mp4', imagem: './assets/projetos/previews/nine2five.jpg' },
  'rafoot': { titulo: 'Rafoot', arquivo: './assets/videos/rafoot.mp4', imagem: './assets/projetos/previews/rafoot.jpg' },
  'da-o-papo': { titulo: 'Dá o Papo!', arquivo: './assets/videos/da-o-papo.mp4', imagem: './assets/projetos/previews/da-o-papo.jpg' },
  'submundo': { titulo: 'Submundo', arquivo: './assets/videos/submundo.mp4', imagem: './assets/projetos/previews/submundo.jpg' }
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
  const descricao = document.getElementById('projeto-video-descricao');
  if (descricao) descricao.textContent = projeto.conceitual
    ? 'Apresentação conceitual das funcionalidades, sem capturas da interface real.'
    : 'Uma prévia do aplicativo ou software em funcionamento.';
  const indicador = janelaDemonstracao.querySelector('.projeto-video-modal__indicador');
  if (indicador) indicador.textContent = projeto.conceitual ? 'Vídeo conceitual' : 'Demonstração em vídeo';
  playerDemonstracao.setAttribute('aria-label', `Demonstração do projeto ${projeto.titulo}`);
  playerDemonstracao.muted = true;
  playerDemonstracao.loop = true;
  playerDemonstracao.poster = projeto.imagem;
  // Mesma capa desfocada preenche o fundo do player, sem distorcer o vídeo.
  janelaDemonstracao.querySelector(".projeto-video-modal__tela")?.style.setProperty("--poster-video", `url("${projeto.imagem}")`);
  playerDemonstracao.src = projeto.arquivo;
  janelaDemonstracao.showModal();
  document.body.classList.add('modal-open');
  playerDemonstracao.play().catch(() => {
    // Se o navegador bloquear autoplay, os controles permanecem acessíveis.
  });
  botaoFecharDemonstracao?.focus({preventScroll:true});
}

for (const cartao of document.querySelectorAll('.projeto-autor[data-video-projeto]')) {
  cartao.addEventListener('click', (evento) => { if(evento.target.closest('.v125__ficha')) return; abrirDemonstracao(cartao.dataset.videoProjeto, cartao); });
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



// V12 alternativa editorial. Seleção acessível com destaque e vídeo sob demanda.
const projetosEditorial = [{"key":"diario-de-pressao","title":"Diário de Pressão","category":"SAÚDE E ACOMPANHAMENTO","desc":"Aplicativo para acompanhar a pressão arterial e organizar informações importantes da rotina de saúde em um só lugar. Permite registrar medições de pressão e batimentos, acompanhar peso e medicamentos e consultar o histórico por diferentes períodos. Gráficos, médias e indicadores facilitam a identificação de variações ao longo do tempo, ajudando o usuário a levar registros mais claros às consultas. É uma ferramenta de acompanhamento pessoal, não de diagnóstico médico.","logo":"./assets/projetos/logos/diario-de-pressao-oficial.webp","num":"01","color":"#d24083","poster":"./assets/projetos/previews/diario-de-pressao.jpg","ficha":{"linguagens":"HTML5 · CSS3 · JavaScript","front":"PWA responsiva · Service Worker","frameworks":"JavaScript nativo · APIs do navegador","backend":"Processamento local em JavaScript","dados":"IndexedDB (registros e histórico), localStorage para compatibilidade/configuração, snapshots e cache offline.","componentes":"Cards · Formulários · Tabelas · Gráficos Canvas · Tabs · Segmented Controls · Tab Bar · Modais · Badges · Toasts · Filtros · Alertas","ferramentas":"Service Worker · Web App Manifest · Cloudflare Pages · JavaScript com Node.js"}},{"key":"nine2five","title":"Nine2Five","category":"CONSULTORIA E PROJETOS","desc":"Plataforma de gestão integrada para projetos, consultorias e serviços profissionais. Centraliza clientes, contratos, atas de reuniões, atividades, prazos, responsáveis e entregáveis, evitando que informações importantes fiquem espalhadas por diferentes ferramentas. Também contempla o acompanhamento de treinamentos, execução de serviços, organização financeira e indicadores. O objetivo é dar visibilidade ao andamento do trabalho, facilitar a colaboração das equipes e manter histórico e rastreabilidade de cada entrega.","logo":"./assets/projetos/logos/nine2five-oficial.png","num":"02","color":"#7655fb","poster":"./assets/projetos/previews/nine2five.jpg","ficha":{"linguagens":"TypeScript · TSX/JSX · CSS3 · JavaScript","front":"React · Interface desktop responsiva","frameworks":"React · Vite · Electron","backend":"Node.js · Electron Main Process · Electron IPC · Processamento local","dados":"SQLite · Migrações de banco de dados","componentes":"Sidebar · Topbar · Cards · Tabelas · Formulários controlados · Selects · Date Picker · Time Picker · Tabs · Stepper · Modais · Drawers · Accordions · Badges · Timeline · Calendário · Filtros · Toasts","ferramentas":"Node.js · npm · TypeScript Compiler · Vite Build · Scripts BAT"}},{"key":"rastro","title":"Rastro","category":"AUDITORIA OPERACIONAL","desc":"Software voltado à organização e auditoria de informações operacionais de deslocamentos, jornadas, motoristas e veículos. A partir da importação de registros e planilhas, apoia a conferência de dados, a investigação de ocorrências e a preparação de relatórios para acompanhamento da operação. O projeto também contempla um processo de distribuição de novas versões para os usuários do sistema. Seu objetivo é reduzir o trabalho manual de análise e tornar o histórico operacional mais acessível e verificável.","logo":"./assets/projetos/logos/rastro-oficial.webp","num":"03","color":"#8b91a8","poster":"./assets/projetos/previews/rastro.jpg","ficha":{"linguagens":"C# · HTML5 · CSS3 · JavaScript · PowerShell · Python","front":"Windows Forms · Microsoft Edge WebView2","frameworks":".NET 10 · WinForms · WebView2","backend":".NET 10 · Cloudflare Workers · APIs REST · Sincronização via Neon PostgreSQL · HMAC · PBKDF2 · SHA-256","dados":"Arquivos locais · Importação/exportação de planilhas","componentes":"Sidebar · Topbar · Dashboard Cards · Tabelas · Formulários · Tabs · Modais · Accordions · Stepper · Alertas · Badges · Paginação · Drawer lateral · Filtros · Menus contextuais","ferramentas":".NET SDK · PowerShell · GitHub Actions · Instalador Windows"}},{"key":"midas-by-rbs-technology","title":"Midas","category":"AUTOMAÇÃO CONTÁBIL","desc":"Ferramenta de automação contábil criada para agilizar o tratamento de extratos bancários de clientes. Importa movimentações, aplica regras de classificação para débitos e créditos, identifica lançamentos que precisam de revisão e aproveita classificações já aprendidas. Reúne informações por cliente, permite conferência das pendências e gera planilhas estruturadas para continuidade do processo contábil. O foco é diminuir tarefas repetitivas e melhorar a padronização sem eliminar a validação humana.","logo":"./assets/projetos/logos/midas-oficial-v2.png","num":"04","color":"#db9c51","poster":"./assets/projetos/previews/midas-by-rbs-technology.jpg","ficha":{"linguagens":"HTML5 · CSS3 · JavaScript","front":"PWA responsiva · Service Worker","frameworks":"JavaScript nativo · SheetJS/XLSX","backend":"Motor de regras em JavaScript · Processamento local · Importação XLSX/CSV/OFX","dados":"IndexedDB · localStorage · arquivos XLSX/CSV/OFX","componentes":"Sidebar · Topbar · Cards · Tabelas · Formulários · Filtros · Selects · Accordions · Modais · Drawers · Badges · Assistente flutuante · Tabs · Toasts · Seleção múltipla","ferramentas":"Cloudflare Pages · SheetJS · Web App Manifest · Node.js · Chromium"}},{"key":"rbs-databridge","title":"RBS DataBridge","category":"MIGRAÇÃO E CONVERSÃO DE DADOS","desc":"Plataforma para importação, transformação e conversão de planilhas e dados entre sistemas empresariais. Trabalha com formatos como XLSX, CSV, ODS e TXT, permitindo mapear colunas, aplicar tratamentos e validar registros antes da exportação. O projeto contempla modelos de conversão, histórico auditável e fluxos de migração entre ERPs, com foco em reduzir retrabalho e tornar transferências de dados mais consistentes.","logo":"./assets/projetos/logos/rbs-databridge-oficial.webp","color":"#e14a72","poster":"./assets/projetos/previews/rbs-databridge.jpg","conceitual":true,"ficha":{"linguagens":"JavaScript · HTML5 · CSS3","front":"React · Interface web e desktop","frameworks":"React · Electron","backend":"Cloudflare Workers para processamento e integração","dados":"Arquivos XLSX · ODS · CSV · TXT · Modelos e histórico de conversões","componentes":"Importação de arquivos · Mapeamento de campos · Validação de dados · Conversão entre formatos · Modelos · Histórico · Relatórios de divergências","ferramentas":"Electron · React · Cloudflare Workers · Exportação de planilhas"},"num":"05"},{"key":"evolut-lite","title":"Evolut Lite","category":"GESTÃO EMPRESARIAL","desc":"Sistema de gestão empresarial para concentrar processos comerciais e administrativos em uma mesma operação. Reúne cadastros, vendas rápidas e pedidos, controle de estoque, compras, serviços, rotinas financeiras e consultas gerenciais. A proposta é permitir que pequenas operações encontrem as ferramentas do dia a dia sem alternar entre vários sistemas, acompanhando produtos, movimentações e resultados com mais organização. A interface busca equilibrar rapidez no atendimento e controle das informações.","logo":"./assets/projetos/logos/evolut-lite-oficial.webp","num":"06","color":"#bf7648","poster":"./assets/projetos/previews/evolut-lite.jpg","ficha":{"linguagens":"C# · HTML5 · CSS3 · JavaScript · SQL","front":"Windows Forms · WebView2","frameworks":".NET 10 · WinForms · Microsoft.Web.WebView2","backend":"C# · .NET 10 · Cloudflare Workers · API de sincronização · API de licenciamento","dados":"SQLite local · PostgreSQL em nuvem · Cloudflare D1 (licenciamento)","componentes":"Sidebar expansível · Topbar · Navigation Rail · Cards · Tabelas · Filtros · Formulários · Accordions · Painel lateral de venda · Modais · Badges · Paginação · Atalhos de teclado · Tabs · Menus contextuais · Selects · Toasts","ferramentas":".NET SDK · Inno Setup · SQLite · Wrangler"}},{"key":"evolut-kronus","title":"Evolut Kronus","category":"GESTÃO DE ATIVOS E MANUTENÇÃO","desc":"Sistema para gestão técnica de ativos, manutenção e assistência, com uma visão organizada de equipamentos, histórico e intervenções. Centraliza ordens de serviço, inspeções, ocorrências e planejamento, além de informações de custos e arquivos vinculados aos ativos. Foi concebido para dar rastreabilidade às atividades de campo e apoiar a gestão da operação e dos serviços prestados.","logo":"./assets/projetos/logos/evolut-kronus-oficial.webp","color":"#9275e9","poster":"./assets/projetos/previews/evolut-kronus.jpg","conceitual":true,"ficha":{"linguagens":"JavaScript · CommonJS · ECMAScript Modules","front":"Aplicação desktop · Electron","frameworks":"Electron · JavaScript","backend":"Processamento local · Serviços de planejamento · Integrações com sistemas","dados":"SQLite local · Histórico de ativos, serviços e inspeções","componentes":"Gestão de ativos · Ordens de serviço · Inspeções · Assistência técnica · Planejamento · Histórico técnico · Painéis de acompanhamento","ferramentas":"Electron · SQLite · Integrações por APIs"},"num":"07"},{"key":"meu-roteirista","title":"Meu Roteirista","category":"ROTAS E DESLOCAMENTOS","desc":"Aplicativo para planejar deslocamentos com múltiplas paradas e comparar possibilidades antes de iniciar uma viagem. Organiza o roteiro de forma sequencial e apresenta alternativas considerando fatores como distância, tempo e custo estimado, ajudando a escolher a opção mais adequada à necessidade do momento. O projeto também considera preferências do usuário e o aprendizado com o uso da ferramenta. O objetivo é facilitar a preparação do percurso e reduzir decisões improvisadas durante a rota.","logo":"./assets/projetos/logos/meu-roteirista-oficial.webp","num":"08","color":"#3e8eff","poster":"./assets/projetos/previews/meu-roteirista.jpg","ficha":{"linguagens":"HTML5 · CSS3 · JavaScript · Swift","front":"PWA mobile-first · WKWebView","frameworks":"SwiftUI · WKWebView · APIs do navegador","backend":"Cloudflare Workers · OSRM API · Cloudflare D1","dados":"Cloudflare D1 · Armazenamento local","componentes":"Tab Bar · Bottom Sheets · Cards · Modais · Formulários · Selects · Chips · Listas · Alertas · Toasts · Controles de navegação","ferramentas":"Cloudflare Pages · Wrangler · Cloudflare D1 · OSRM"}},{"key":"da-o-papo","title":"Dá o Papo!","category":"TRANSCRIÇÃO E PRODUTIVIDADE","desc":"Aplicativo de transcrição que transforma conteúdo falado em texto para facilitar o registro e o aproveitamento de informações. Foi pensado para quem lida com gravações de reuniões, apresentações, entrevistas, estudos ou orientações de trabalho e precisa consultar o conteúdo depois. O fluxo reúne envio de arquivos, processamento de áudio ou vídeo e acesso à transcrição resultante. A proposta é economizar o tempo gasto ouvindo repetidamente uma gravação e tornar o material mais fácil de pesquisar, revisar e reutilizar.","logo":"./assets/projetos/logos/da-o-papo-oficial.png","num":"09","color":"#9b61fc","poster":"./assets/projetos/previews/da-o-papo.jpg","ficha":{"linguagens":"HTML5 · CSS3 · JavaScript","front":"PWA responsiva · Web APIs de mídia","frameworks":"JavaScript nativo · APIs do navegador","backend":"Cloudflare Workers · Groq API · Whisper · Processamento de mídia · Cloudflare KV","dados":"Cloudflare KV","componentes":"Cards · Upload de arquivos · Player de áudio/vídeo · Editor de transcrição · Listas · Tabs · Barra de progresso · Modais · Toasts · Busca · Selects · Formulários","ferramentas":"Cloudflare Pages · Cloudflare Workers · KV · Groq API"}},{"key":"submundo","title":"Submundo","category":"JOGO E SIMULAÇÃO","desc":"Projeto de jogo de simulação e estratégia em que o usuário acompanha a evolução de um personagem dentro de uma cidade com diferentes atividades e possibilidades de decisão. A experiência combina missões, negócios, territórios e mecanismos de progressão para criar objetivos de curto e longo prazo. O desenvolvimento explora a organização de sistemas de jogo, a apresentação de informações e a construção de uma interface coerente com sua ambientação. Seu foco é oferecer uma experiência interativa com identidade própria.","logo":"./assets/projetos/logos/submundo-oficial.webp","num":"10","color":"#ed537a","poster":"./assets/projetos/previews/submundo.jpg","ficha":{"linguagens":"HTML5 · CSS3 · JavaScript","front":"Interface web responsiva · DOM API","frameworks":"JavaScript nativo · APIs do navegador","backend":"JavaScript · Motor de simulação local · Persistência JSON","dados":"localStorage · JSON","componentes":"Cards · Tabs · Modais · Formulários · Badges · Tabelas · Rankings · Drawers · Alertas · Listas · Menus de navegação","ferramentas":"HTML standalone · Node.js · Cloudflare Pages"}},{"key":"rafoot","title":"Rafoot","category":"ESPORTE E ESTRATÉGIA","desc":"Projeto de aplicativo dedicado ao universo do futebol, com uma proposta visual ligada à leitura de partidas e à organização de informações esportivas. A experiência busca apresentar conteúdos relacionados ao jogo de forma acessível, com atenção à navegação, ao acompanhamento de situações em campo e à visualização tática. O Rafoot também funciona como um espaço de experimentação de interface e interação para um tema muito presente no cotidiano dos torcedores. A demonstração em vídeo apresenta o estágio visual do projeto.","logo":"./assets/projetos/logos/rafoot-oficial.png","num":"11","color":"#45bc86","poster":"./assets/projetos/previews/rafoot.jpg","ficha":{"linguagens":"HTML5 · CSS3 · JavaScript · SQL","front":"PWA mobile-first · Service Worker","frameworks":"JavaScript nativo · Supabase JS v2","backend":"Supabase Auth · Supabase API · Autenticação por e-mail e senha · Sincronização de dados · Row Level Security (RLS)","dados":"Supabase/PostgreSQL · localStorage · IndexedDB","componentes":"Tab Bar · Bottom Sheets · Cards · Modais · Placar · Prancheta tática · Chips · Filtros · Listas · Alertas · Toasts · Formulários · Tabs","ferramentas":"Cloudflare Pages · Supabase · Web App Manifest · Service Worker"}}];
const vitrineEditorial = document.querySelector('.v13');
const vitrineDestaque = document.getElementById('v13-destaque');
const vitrineCatalogo = document.getElementById('v13-catalogo');
const vitrinePosicao = document.getElementById('v13-posicao');
const vitrineProgresso = document.getElementById('v13-progresso');
let selecionadoEditorial = 0;
const modoVitrine = 'a';
const escaparTexto = (s) => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const escaparAtributo = escaparTexto;
function preencherVitrineEditorial(indice, moverFoco=false){
  const n=projetosEditorial.length;
  selecionadoEditorial=(indice+n)%n;
  const projeto=projetosEditorial[selecionadoEditorial];
  vitrineEditorial.style.setProperty('--cor-produto', projeto.color);
  vitrineEditorial.style.setProperty('--imagem-projeto', `url(\"${projeto.poster}\")`);
  vitrineDestaque.setAttribute('data-video-projeto',projeto.key);
  vitrineDestaque.setAttribute('aria-label',(projeto.conceitual ? 'Assistir à apresentação conceitual de ' : 'Assistir à demonstração de ')+projeto.title);
  vitrineDestaque.classList.remove('v13__entrada');
  // Usamos IMG verdadeiro, com fallback e tamanho definido: evita a capa invisível.
  vitrineDestaque.innerHTML=`<div class="v13__corpo"><div class="v13__texto">
    <img class="v13__logo" src="${escaparAtributo(projeto.logo)}" alt="Logo do ${escaparAtributo(projeto.title)}" width="76" height="76" decoding="async" />
    <span class="v13__categoria">${escaparTexto(projeto.category)}</span>
    <h3 class="v13__titulo">${escaparTexto(projeto.title)}</h3>
    <span aria-hidden="true" class="v13__linha"></span>
    <p class="v13__descricao">${escaparTexto(projeto.desc)}</p>

    <span class="v13__acao"><i aria-hidden="true">▶</i> ${projeto.conceitual ? 'Ver apresentação conceitual' : 'Assistir demonstração'}</span>
    </div><div class="v13__arte"><div class="v1210__quadro"><img class="v13__poster-img" src="${escaparAtributo(projeto.poster)}" alt="Prévia do projeto ${escaparAtributo(projeto.title)}" width="704" height="396" loading="eager" decoding="async" /><video class="v123__preview-video" muted playsinline loop preload="none" poster="${escaparAtributo(projeto.poster)}" aria-hidden="true"></video></div><span class="v13__play-arte" aria-hidden="true">▶</span></div>
    <details class="v125__ficha">
      <summary class="v125__resumo"><span class="v128__abrir">Veja a ficha técnica da solução</span><span class="v128__fechar">Ocultar ficha técnica da solução</span><span class="v125__indicador" aria-hidden="true">⌄</span></summary>
      <dl class="v125__linhas">
        ${[['Linguagens','linguagens'],['Frontend e UI','front'],['Frameworks e bibliotecas','frameworks'],['Backend e APIs','backend'],['Banco e armazenamento','dados'],['Componentes','componentes'],['Ferramentas e entrega','ferramentas']].map(([rotulo,chave])=>`<div class="v125__linha"><dt>${rotulo}</dt><dd>${escaparTexto(projeto.ficha[chave])}</dd></div>`).join('')}
      </dl>
      
    </details>
</div>`;
  // Se o frame não carregar, exibe a logo, sem deixar uma área preta.
  const imagemVitrine = vitrineDestaque.querySelector('.v13__poster-img');
  imagemVitrine.addEventListener('error', () => {
    if (imagemVitrine.dataset.fallbackAplicado) return;
    imagemVitrine.dataset.fallbackAplicado='true';
    imagemVitrine.src=projeto.logo;
    imagemVitrine.classList.add('v123__poster-fallback');
  }, {once:true});
  // Reinicia a transição apenas quando houver movimento habilitado.
  if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches){void vitrineDestaque.offsetWidth;vitrineDestaque.classList.add('v13__entrada')}
  vitrinePosicao.textContent=String(selecionadoEditorial+1).padStart(2,'0')+' / '+String(n).padStart(2,'0');
  vitrineProgresso.style.width=((selecionadoEditorial+1)/n*100).toFixed(2)+'%';
  vitrineCatalogo.querySelectorAll('[data-editorial-indice]').forEach(botao=>{
    const ativo=Number(botao.dataset.editorialIndice)===selecionadoEditorial;
    botao.setAttribute('aria-current',ativo?'true':'false');
    if (ativo && moverFoco && window.innerWidth<=580) botao.scrollIntoView({block:'nearest',inline:'nearest',behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'instant':'smooth'});
  });
}
function montarCatalogoEditorial(){
  vitrineCatalogo.innerHTML=projetosEditorial.map((projeto,indice)=>`<a class="v13__opcao" href="${escaparAtributo(demonstracoesProjetos[projeto.key].arquivo)}" data-editorial-indice="${indice}" aria-current="false" aria-label="Selecionar ${escaparAtributo(projeto.title)}">
  <img class="v13__mini-logo" src="${escaparAtributo(projeto.logo)}" alt="" loading="lazy" />
  <span class="v13__mini-texto"><strong>${escaparTexto(projeto.title)}</strong><small>${escaparTexto(projeto.category)}</small></span>
  <span class="v13__mini-num" aria-hidden="true">${projeto.num}</span></a>`).join('');
  vitrineCatalogo.querySelectorAll('[data-editorial-indice]').forEach(botao=>botao.addEventListener('click',e=>{e.preventDefault();preencherVitrineEditorial(Number(botao.dataset.editorialIndice),true)}));
}
if(vitrineEditorial && vitrineDestaque && vitrineCatalogo){
  montarCatalogoEditorial();preencherVitrineEditorial(selecionadoEditorial);
  document.getElementById('v13-anterior')?.addEventListener('click',()=>preencherVitrineEditorial(selecionadoEditorial-1,true));
  document.getElementById('v13-proximo')?.addEventListener('click',()=>preencherVitrineEditorial(selecionadoEditorial+1,true));
  vitrineCatalogo.addEventListener('keydown',e=>{
    if(!['ArrowRight','ArrowLeft','ArrowDown','ArrowUp'].includes(e.key))return;
    const item=e.target.closest('[data-editorial-indice]');if(!item)return;
    e.preventDefault();const sentido=['ArrowRight','ArrowDown'].includes(e.key)?1:-1;
    const indice=(Number(item.dataset.editorialIndice)+sentido+projetosEditorial.length)%projetosEditorial.length;
    preencherVitrineEditorial(indice,true);
    vitrineCatalogo.querySelector(`[data-editorial-indice="${indice}"]`)?.focus({preventScroll:true});
  });
}


/* V12 consolidada · Depoimentos: uma leitura completa + quatro escolhas em Bento */
(() => {
  const secao = document.getElementById('recomendacoes');
  const lista = secao?.querySelector('.recomendacoes__lista');
  const painel = document.getElementById('recomendacoes-hibrido');
  const grade = document.getElementById('hibrido-grade');
  const identificacao = document.getElementById('hibrido-identificacao');
  const texto = document.getElementById('hibrido-texto');
  const destaque = document.getElementById('hibrido-destaque');
  if (!lista || !painel || !grade || !identificacao || !texto || !destaque) return;
  const depoimentos = Array.from(lista.querySelectorAll('.recomendacao-card')).map(cartao => ({
    nome: cartao.querySelector('h3')?.textContent.trim() || '',
    cargo: cartao.querySelector('.recomendacao-card__cargo')?.textContent.trim() || '',
    relacao: cartao.querySelector('.recomendacao-card__relacao')?.textContent.trim() || '',
    foto: cartao.querySelector('.recomendacao-card__foto')?.getAttribute('src') || '',
    tipo: cartao.dataset.relacaoTipo || 'Profissional',
    paragrafos: Array.from(cartao.querySelectorAll('.recomendacao-card__texto p')).map(p=>p.textContent.trim())
  }));
  if (depoimentos.length < 2 || depoimentos.some(d=>!d.nome || !d.foto || !d.paragrafos.length)) return;
  const escapar = t => String(t).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  let selecionado=0;
  let proximaEscolha=null;
  function mostrar(indice, moverFoco=false) {
    selecionado=(indice+depoimentos.length)%depoimentos.length;
    const atual=depoimentos[selecionado];
    identificacao.innerHTML=`<img class="hibrido__foto" src="${escapar(atual.foto)}" alt="Foto de ${escapar(atual.nome)}" width="79" height="79"><div class="hibrido__dados"><h3 id="hibrido-nome">${escapar(atual.nome)}</h3><p class="hibrido__cargo">${escapar(atual.cargo)}</p><span class="v123__relacao-tipo">${escapar(atual.tipo)}</span><span class="hibrido__relacao">${escapar(atual.relacao)}</span></div>`;
    texto.innerHTML=atual.paragrafos.map(paragrafo=>`<p>${escapar(paragrafo)}</p>`).join('');
    document.getElementById('hibrido-contador').textContent=String(selecionado+1).padStart(2,'0')+' / '+String(depoimentos.length).padStart(2,'0');
    const outros=depoimentos.map((d,i)=>({d,i})).filter(o=>o.i!==selecionado);
    grade.innerHTML=outros.map(({d,i})=>`<button class="hibrido__opcao" type="button" data-indice="${i}" aria-label="Ler recomendação completa de ${escapar(d.nome)}"><img class="hibrido__foto-mini" src="${escapar(d.foto)}" alt="" loading="lazy" width="54" height="54"/><span class="hibrido__mini-dados"><strong>${escapar(d.nome)}</strong><small>${escapar(d.cargo)}</small><em class="v123__tipo-mini">${escapar(d.tipo)}</em></span><span class="hibrido__mini-acao">Ler depoimento <span aria-hidden="true">↗</span></span></button>`).join('');
    grade.querySelectorAll('button').forEach(botao=>botao.addEventListener('click',()=>mostrar(Number(botao.dataset.indice),true)));
    if (!movimentoReduzido.matches) {destaque.classList.remove('hibrido__entrada');void destaque.offsetWidth;destaque.classList.add('hibrido__entrada');}
    if (moverFoco) {
      // Ao trocar, posiciona o foco no depoimento completo sem rolar a página abruptamente.
      destaque.setAttribute('tabindex','-1'); destaque.focus({preventScroll:true});
    }
  }
  lista.hidden=true; painel.hidden=false;
  mostrar(0);
  document.getElementById('hibrido-anterior')?.addEventListener('click',()=>mostrar(selecionado-1,true));
  document.getElementById('hibrido-proximo')?.addEventListener('click',()=>mostrar(selecionado+1,true));
  // Navegação por teclas nos cartões menores.
  grade.addEventListener('keydown',e=>{
    if(!['ArrowLeft','ArrowRight'].includes(e.key))return;
    const atual=e.target.closest('.hibrido__opcao');if(!atual)return;
    e.preventDefault();const itens=Array.from(grade.querySelectorAll('button'));
    const idx=itens.indexOf(atual);itens[(idx+(e.key==='ArrowRight'?1:-1)+itens.length)%itens.length].focus();
  });
})();

/* Experiências profissionais: linha do tempo com destaque contextual. */
(() => {
  if (!('IntersectionObserver' in window)) return;
  const itens=[...document.querySelectorAll('.experiencia--timeline-v12 .experiencia__item')];
  if(!itens.length)return;
  const observador=new IntersectionObserver(entradas=>{
    entradas.forEach(entrada=>{if(entrada.isIntersecting)entrada.target.classList.add('timeline--ativo');});
  },{rootMargin:'0px 0px -30% 0px',threshold:.25});
  itens.forEach(item=>observador.observe(item));
})();


/** V12.3 · Prévia silenciosa sob demanda: somente o projeto em foco. */
(() => {
  if (!vitrineDestaque || !vitrineCatalogo) return;
  let ativo = null;
  const podePrever = matchMedia('(hover: hover) and (pointer: fine)');
  const preferencias = matchMedia('(prefers-reduced-motion: reduce)');
  function encerrarPreview() {
    if (!ativo) return;
    ativo.pause();
    ativo.removeAttribute('src');
    ativo.load();
    ativo.closest('.v13__arte')?.classList.remove('v123__preview-ativo');
    ativo=null;
  }
  function iniciarPreview() {
    if (!podePrever.matches || preferencias.matches || janelaDemonstracao?.open || document.hidden) return;
    const video = vitrineDestaque.querySelector('.v123__preview-video');
    const arquivo = demonstracoesProjetos[vitrineDestaque.dataset.videoProjeto]?.arquivo;
    if (!video || !arquivo || ativo === video) return;
    encerrarPreview();
    ativo=video;
    video.src=arquivo;
    video.currentTime=0;
    video.play().then(() => video.closest('.v13__arte')?.classList.add('v123__preview-ativo')).catch(encerrarPreview);
  }
  vitrineDestaque.addEventListener('pointerenter',iniciarPreview);
  vitrineDestaque.addEventListener('pointerleave',encerrarPreview);
  vitrineDestaque.addEventListener('focusout',encerrarPreview);
  vitrineDestaque.addEventListener('click',encerrarPreview,{capture:true});
  vitrineCatalogo.addEventListener('click',encerrarPreview,{capture:true});
  document.addEventListener('visibilitychange',()=>{if(document.hidden)encerrarPreview()});
  const proximo=document.getElementById('v13-proximo');
  const anterior=document.getElementById('v13-anterior');
  proximo?.addEventListener('click',encerrarPreview,{capture:true});
  anterior?.addEventListener('click',encerrarPreview,{capture:true});
  // Arraste horizontal pelo catálogo mobile, sem capturar a rolagem vertical da página.
  let toqueX=0,toqueY=0;
  vitrineCatalogo.addEventListener('touchstart',e=>{toqueX=e.touches[0].clientX;toqueY=e.touches[0].clientY},{passive:true});
  vitrineCatalogo.addEventListener('touchend',e=>{
    const dx=e.changedTouches[0].clientX-toqueX,dy=e.changedTouches[0].clientY-toqueY;
    if (Math.abs(dx)>75 && Math.abs(dx)>Math.abs(dy)*1.6) {
      // O scroll-snap já move o catálogo, sem troca inesperada de item.
      vitrineCatalogo.classList.add('v123__arrastado');
    }
  },{passive:true});
})();


/**
 * V12.9 · Entrada progressiva das seções.
 * Evita ocultar conteúdo quando o JavaScript ou a API não estiver disponível.
 */
(() => {
  const reduzir = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (reduzir.matches || !('IntersectionObserver' in window)) return;
  const alvos = [
    '#sobre .sobre__conteudo',
    '#atuacao .secao-topo',
    '#atuacao .especialidades__item',
    '#atuacao .v12-repertorio__cabecalho',
    '#atuacao .v12-repertorio__item',
    '#projetos-desenvolvidos .projetos-autorais__cabecalho',
    '#projetos-desenvolvidos .v13__barra',
    '#projetos-desenvolvidos .v13__principal',
    '#projetos-desenvolvidos .v13__catalogo',
    '#apresentacoes .secao-topo',
    '#apresentacoes .video',
    '#experiencia .experiencia__titulo',
    '#experiencia .experiencia__item',
    '#recomendacoes .secao-topo',
    '#recomendacoes .recomendacoes-hibrido',
    '#contato .contato__intro',
    '#contato .contato__opcoes'
  ];
  const elementos=[...new Set(alvos.flatMap(seletor=>Array.from(document.querySelectorAll(seletor))))];
  if (!elementos.length) return;
  const observador=new IntersectionObserver((entradas,observer)=>{
    for(const entrada of entradas){
      if(!entrada.isIntersecting) continue;
      entrada.target.classList.add('v129-visible');
      observer.unobserve(entrada.target);
    }
  },{threshold:.04,rootMargin:'0px 0px -35px 0px'});
  for(const elemento of elementos){
    elemento.classList.add('v129-reveal');
    elemento.style.setProperty('--v129-delay',`${Math.min(elementos.indexOf(elemento)%4,2)*55}ms`);
    observador.observe(elemento);
  }
  document.documentElement.classList.add('v129-motion-ready');
  const revelarTudo=()=>{for(const el of elementos)el.classList.add('v129-visible');observador.disconnect()};
  reduzir.addEventListener?.('change',evento=>{if(evento.matches)revelarTudo()});
  window.addEventListener('pageshow',()=>{for(const el of elementos){if(el.getBoundingClientRect().top<innerHeight*1.02)el.classList.add('v129-visible')}},{once:true});
})();
