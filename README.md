# Rafael Borges | Portfólio profissional

Portfólio profissional de Rafael Borges, com trajetória em tecnologia, projetos, consultoria e treinamentos.

**Versão:** V12.11 (aprovada), HF3: demonstrações de interface Kronus e DataBridge + favicon multiplataforma

**Site:** https://borjaorafa.github.io/portfolio-rafael-borges/

## Conteúdo

- Sobre mim e trajetória profissional
- Atuação, experiência e formação
- Onze soluções e projetos desenvolvidos, com vídeos demonstrativos/conceituais e fichas técnicas
- Apresentações e treinamentos
- Recomendações profissionais e contato

## Estrutura técnica

Site estático em HTML, CSS e JavaScript, com mídias locais e deploy pelo GitHub Pages.

- `index.html`: página principal
- `styles-v12-11.css`: estilos versionados
- `script-v12-11.js`: interações versionadas
- `assets/`: imagens, logos, currículo e vídeos

**Publicação:** GitHub Pages a partir da branch `main`.

## Ícone nos navegadores e na tela inicial

O favicon oficial `rb.` foi mantido em `favicon.svg`. Para assegurar compatibilidade:

- `favicon.ico`, `favicon-16x16.png`, `favicon-32x32.png`: guias e favoritos em diferentes navegadores.
- `apple-touch-icon.png` (180 × 180): tela inicial do iPhone e iPad.
- `icon-192.png`, `icon-512.png`, `icon-maskable-512.png` e `site.webmanifest`: atalhos em Android e navegadores compatíveis.
- Todas as referências do `index.html` são relativas (`./`), portanto funcionam no subdiretório do GitHub Pages `portfolio-rafael-borges/`.

O manifesto preserva a abertura como site (`display: browser`); não foi incluído service worker nem prometido acesso offline.

**Teste após publicação:** abra o site no Safari do iPhone, toque em Compartilhar e selecione Adicionar à Tela de Início. O atalho deve mostrar o mesmo símbolo `rb.`. Favoritos e atalhos antigos podem conservar o ícone armazenado em cache; se necessário, remova o atalho e adicione novamente.

## HF3 · Evolut Kronus e RBS DataBridge

Dois projetos incluídos na vitrine editorial, com logotipos aprovados separados em alta resolução, fichas técnicas e vídeos MP4 de interfaces demonstrativas. A versão HF3 substitui as antigas apresentações estáticas por simulações de navegação com telas de cada módulo. As telas foram reconstruídas de forma conceitual a partir das funcionalidades conhecidas. Não são capturas de softwares instalados. O vídeo mostra navegação simulada, apontamentos do cursor e transições entre módulos; GIFs correspondentes acompanham o pacote.

- `assets/projetos/logos/evolut-kronus-oficial.webp` e `rbs-databridge-oficial.webp`
- `assets/projetos/previews/evolut-kronus.jpg` e `rbs-databridge.jpg`
- `assets/videos/evolut-kronus.mp4` e `rbs-databridge.mp4`
- `assets/videos/evolut-kronus-apresentacao.gif` e `rbs-databridge-apresentacao.gif`

A seção Soluções agora contém 11 projetos. Mantido o favicon oficial `rb.` e sua compatibilidade com iPhone, Android e navegadores tradicionais.

## HF3 · Fluxos incluídos nas novas animações

- **Evolut Kronus:** Central de operações → Planejamento semanal → Ativo 360° → Ordens de serviço → Indicadores → Assistência técnica.
- **RBS DataBridge:** Central de importações → Importar dados → Mapeamento → Validação → Prévia da conversão → Exportação concluída.
- MP4 compactos com imagens em alta definição para reprodução na vitrine e GIFs para compartilhamento.
- As telas são demonstrativas e os valores/nomes são exemplos fictícios, não dados reais de clientes.
