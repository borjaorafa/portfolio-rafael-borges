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
