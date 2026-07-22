
---

**Fonte da análise:** fetch do HTML renderizado de `https://locomotive.ca/en` e `https://locomotive.ca/en/careers` em 21/07/2026 (extração de conteúdo em markdown), complementado por fontes públicas: a ficha do próprio site no **Fonts In Use** (identidade e tipografia), os artigos oficiais do estúdio no Medium e os subsites documentados (`scroll.locomotive.ca`, `explore.locomotive.ca`, `six.locomotive.ca`).

**Stack detectada:**

- ✅ **Locomotive Scroll** — biblioteca de smooth-scroll criada pelo próprio estúdio (`scroll.locomotive.ca` e o repo `github.com/locomotivemtl` constam no rodapé). É a assinatura de scroll da casa.
- 🔎 **GSAP + ScrollTrigger** — padrão de mercado que integra nativamente com Locomotive Scroll; as seções "pinadas" (valores numerados 1–4) e os reveals por scroll são a assinatura clássica desse par. Confirmar em DevTools → Sources.
- 🔎 **Craft CMS** — inferido pelo padrão de caminho `/uploads/…` nas imagens e metadados (`og:image` em `/uploads/metadata/`), típico do Craft, muito usado por agências desse perfil.
- ✅ **Vimeo** para vídeo de cultura/trips (`player.vimeo.com/progressive_redirect/...` na página Careers).
- ✅ **Collage** (`secure.collage.co/jobs/locomotive/…`) como ATS/board das vagas — os cards de posição linkam para lá.
- ✅ **theme-color `#ffffff`** declarado no `<meta>` das duas páginas.

**Legenda de confiabilidade usada neste documento:**

- ✅ **Verificado** — presente no markup/metadados obtidos ou em fonte pública confiável (Fonts In Use / artigos do estúdio).
- 🔎 **Inferido** — dedução técnica a partir de padrões do markup ou do histórico documentado do estúdio.
- 🛠️ **Especificação de reconstrução** — valor recomendado para replicar o efeito no seu projeto (não extraído do código-fonte; validar no DevTools).

> **Nota sobre os "emojis" no markup.** Ao longo da extração aparecem glifos soltos (🔶 🟠 🟢 🟤 🛑 🚹 🚺 🦉 🔠 🔚 🔞 🔛 🔜 🔰 …) grudados em títulos, endereço e labels. ✅ O Fonts In Use documenta que a Locomotive desenhou **um tipo iconográfico customizado que funde iconografia (inspirada nos ícones técnicos de vagões de trem) com letras latinas**. 🔎 A dedução forte é que esses "emojis" são os glifos desse **icon-font proprietário** que o extrator de texto não conseguiu renderizar e substituiu por emojis de fallback. Ou seja: **não são decoração emoji literal — são um sistema de ícones tipográficos**. Validar no DevTools qual caractere/PUA cada glifo ocupa.

---

## 1. Contexto e Vibe

✅ A Locomotive® se apresenta como uma **"Digital-First Design Agency"** independente, sediada em **Montreal, Canadá**, com **15+ anos** de operação (`©2008-2026`) e reputação global. A home carimba a autoridade de forma crua: `Seven Years Running 2018-2024` com link para "The dynasty" (`six.locomotive.ca`) — referência à sequência de prêmios/reconhecimento (padrão Awwwards). O portfólio inclui Lightship, Wolverine Worldwide, The Drake Hotel, Dulcedo e Scout Motors.

🔎 A emoção transmitida é **excelência editorial com calor humano e irreverência técnica**. Diferente do brutalismo austero de outros estúdios de topo, a Locomotive equilibra dois registros: (a) o **rigor tipográfico editorial** (serifa de display + grotesca neutra) e (b) uma **camada lúdica de ícones-tipográficos** (o icon-font de vagões) e copy quente. O tom é o de "gente antes de ferramenta" — a tese central da seção People.

✅ **A tese "People" (home):** o bloco-manifesto declara, em tradução do conteúdo, que _design e código são apenas ferramentas de expressão; o que diferencia o estúdio e o trabalho são as pessoas — um grupo pequeno de pensadores criativos que cria identidades e experiências digital-first sob medida_. Logo abaixo vem o aside `Always looking for top shelf talent` e um parágrafo institucional ("from strategy to deployment and maintenance… the ultimate digital one-stop shop… Freshness guaranteed.") com dois CTAs textuais: **Agency** e **Careers**. É um bloco de **ponte**: da vitrine de trabalho para o recrutamento.

✅ **A tese Careers:** hero curto e afirmativo — _"We believe in the potential of every individual, no matter their background. We're on the lookout for driven professionals…"_ — seguido de um CTA-âncora `View jobs↓`. O restante da página é uma narrativa de **cultura** (valores, viagens anuais, fotos de equipe) que precede as vagas. A frase-guia da cultura: _"loyalty is a two-way street"_.

🔎 A vibe resultante: **minimalista na base** (fundo branco, tipografia protagonista), **editorial na hierarquia** (serifa de display gigante alternando com grotesca), **quente no copy** e **técnica-lúdica no ornamento** (icon-font). O movimento (smooth scroll + reveals + seções pinadas) é o que confere a sensação "cara" e premiada.

---

## 2. Tipografia

✅ **Sistema de duas famílias + um icon-font**, confirmado pelo Fonts In Use para o site da Locomotive:

1. **Editorial New** (Pangram Pangram) — **serifa de display** de alto contraste, contemporânea, com itálicos expressivos. É a voz dos grandes títulos-manifesto e dos nomes de projeto/valor. Responsável pelo ar "revista de arte".
2. **Helvetica Now** (Monotype) — **grotesca neutra** para corpo, labels, navegação e microtexto. Traz a base técnica e limpa que contrabalança o drama da serifa.
3. **Icon-font iconográfico customizado** — funde **ícones técnicos de vagões de trem** com letras latinas; é a fonte dos glifos que aparecem como "emojis" na extração. Funciona como **camada de ornamento-sistema** (marcadores, selos, pontuação visual).

🛠️ **Substitutas de reconstrução** (mesmo DNA, caso não licencie as originais):

- No lugar de **Editorial New**: PP Editorial New (a própria PP), ou alternativas com contraste alto — Fraunces (variável, gratuita), GT Sectra, Reckless.
- No lugar de **Helvetica Now**: Helvetica Neue, Neue Haas Grotesk, Inter ou Suisse Int'l com tracking levemente apertado.
- Para o **icon-font**: montar um set próprio (SVG sprite ou ícone-font via Fontello/IcoMoon) com um vocabulário visual coeso ligado à sua marca — a graça é ser **proprietário**, não a biblioteca.

**Escala tipográfica** (🛠️ reconstrução proporcional a partir da hierarquia observada; o site usa dimensionamento fluido com Locomotive Scroll):

|Papel|Elemento observado ✅|Spec de reconstrução 🛠️|
|---|---|---|
|Display / Hero|"Careers"; manifesto People; nomes de projeto na home|**Editorial New**, `clamp(2.75rem, 7vw, 8rem)`, peso 400–500, line-height 0.95–1.05, letter-spacing −0.01em|
|H2 seção|"Featured work", "Our Values", "Culture", "Positions(5)"|`clamp(1.75rem, 4vw, 3.5rem)`, peso 500|
|H3 / Título de valor|"Embrace flexibility", "Cultivate genuine friendships" etc.|**Editorial New**, `clamp(1.5rem, 3vw, 2.75rem)`, peso 400|
|Corpo|Parágrafos de manifesto, valores e institucional|**Helvetica Now**, 16–19px, line-height 1.5–1.65, peso 400|
|Label / contador|"Positions(5)", "Trips (5)", "Extras (13)", "(1)…(4)", "01:10"|**Helvetica Now**, 11–13px, caixa alta, tracking +0.06em, `tabular-nums` nos números|

🔎 **Cores da tipografia:** preto quase puro sobre branco na base; inversões (texto claro sobre mídia/painel escuro) nas seções com vídeo e possivelmente nos painéis pinados de valor.

✅ **Detalhes tipográficos como UI:** setas como parte do texto guiam a ação — `View jobs↓`, `Watch film ↓`, `Newsletter ↓`, `Buy now→`. Números pontuados/entre parênteses expõem contagem crua ("(13)", "(5)"). O `®` aparece consistentemente coladinho ao nome ("Locomotive®") como assinatura. Esse uso de glifos e números como ornamento honesto é requisito central da estética.

---

## 3. Paleta de Cores

✅ **Único valor cromático declarado no markup:** `theme-color: #ffffff` (nas duas páginas) e `msapplication-TileColor: #da532c` (cor de tile do Windows/favicon — laranja-avermelhado, **não** necessariamente a cor da UI).

🔎 A paleta funcional deduzida é **monocromática de alto contraste** (preto sobre branco), com a **cor delegada ao conteúdo** — thumbnails de projeto, fotos de equipe e vídeos de viagem é que injetam cor. Estrutura recomendada de tokens 🛠️:

|Token|Valor estimado|Uso|
|---|---|---|
|`--bg-base`|`#FFFFFF` ✅|Fundo global (confirmado pelo theme-color)|
|`--text-primary`|`#0A0A0A`–`#111111` 🛠️|Títulos e corpo|
|`--text-secondary`|`#6B6B6B`–`#8A8A8A` 🛠️|Labels, metadados, legendas|
|`--line`|`#E6E6E6` 🛠️|Hairlines/divisores de seção e listas|
|`--bg-inverse`|`#0A0A0A` 🛠️|Overlay do menu fullscreen, painéis de valor invertidos, footer|
|`--accent-tile`|`#DA532C` ✅ (tile)|Presente nos metadados; **validar** se é usado na UI ou só no favicon|
|`--accent`|Sem accent fixo na UI 🔎|O "accent" é a mídia: cada card de projeto/valor traz a própria paleta|

🔎 **Princípio extraível:** "chrome neutro, conteúdo colorido". A marca não disputa cor com o portfólio nem com as fotos de equipe/viagem — que são o coração emocional da narrativa People/Careers. Validar hex exatos no DevTools (Computed → color/background-color) e checar se `#DA532C` reaparece em algum estado (hover, seleção, marcador de icon-font).

---

## 4. Layout e Estrutura

### 4.1 Header

✅ Cabeçalho **mínimo e persistente**, idêntico nas duas páginas: wordmark **`Locomotive®`** (link para `/en`), navegação enxuta (**Work · Agency · Careers · Store**), CTA **`Let's talk`** (→ `/contact`) e um toggle **`Menu`**. Há também alternador de idioma **`Français`** e o carimbo de localização **`Montréal, Quebec`** (acompanhado de glifos do icon-font). O `Store` aponta para subdomínio externo (`store.locomotive.ca`).

🔎 Comportamento deduzido: header fixo de altura enxuta; o `Menu` abre um **overlay/painel fullscreen** (a lista de navegação reaparece duplicada no markup — assinatura de menu-overlay separado do header inline). Provável **auto-hide no scroll para baixo / reaparição no scroll para cima**, e troca de tema (claro/escuro) por seção para manter legibilidade sobre mídia. 🛠️ Reconstrução: `position: fixed` + `mix-blend-mode: difference` **ou** swap de cor via `data-theme` por seção observada pelo Locomotive Scroll.

✅ **Intro tipográfica animada (pré-conteúdo):** no topo das duas páginas o markup traz sequências escalonadas — `Digital → Digital-First → Digital-First Design → Digital-First Agency` e `Based → Based in → Based in Montreal → Based in Montreal, Canada` — cada linha repetida em múltiplos estados. 🔎 É a assinatura de um **preloader / intro com revelação por incremento** (efeito "máquina de escrever" ou linhas que se completam palavra a palavra) antes de liberar o hero.

### 4.2 Containers principais e seções

#### Home — a seção "People" no fluxo da página

✅ Ordem observada da home: (1) intro animada + hero `Locomotive® Digital-first Design Agency` com carimbos `©2008-2026` e `Seven Years Running`; (2) **Featured work** — lista de projetos (Lightship, Wolverine Worldwide, The Drake Hotel, Dulcedo, Scout Motors, All Work), cada card com **nome "quebrado" ao redor de uma imagem/vídeo** no meio (padrão "Palavra ![mídia] Palavra") e link "Read more about this project"; (3) **seção People** (o alvo do seu projeto); (4) blocos Extras/Articles/Culture/Store; (5) footer.

🔎 **Anatomia da seção People** (o bloco-manifesto):

- **Marcador de abertura** com glifo do icon-font (o "🔰" da extração).
- **Statement em Editorial New**, grande, provavelmente alinhado à esquerda ou centralizado, ocupando largura editorial contida (não full-bleed) — o texto sobre "pessoas acima de ferramentas".
- **Aside curto** em grotesca/label: `Always looking for top shelf talent` — menor, funcionando como legenda/gancho para Careers.
- **Parágrafo de apoio** (institucional, "one-stop shop… Freshness guaranteed") em Helvetica Now.
- **Dois CTAs textuais**: `Agency` e `Careers`, em lista vertical/inline, estilo ghost tipográfico. 🛠️ Reconstrução: container de ~680–820px de medida de texto para o statement (leitura editorial), com o statement em `clamp(1.75rem, 3.5vw, 3.25rem)`; reveal por scroll com máscara de linha; os dois CTAs com seta/sublinhado animado.

#### Careers — a página inteira

✅ Sequência observada:

1. **Hero** `Careers` (Editorial New display) + parágrafo de missão + CTA-âncora `View jobs↓` (→ `#positions`).
2. **Contador `Positions(5)`** e uma **grade/mosaico extenso de fotos de equipe** (dezenas de `![]()` em sequência — 🔎 um **grid/marquee de fotografias da cultura**, provavelmente com parallax e/ou scroll horizontal).
3. **Culture** — bloco de texto quente ("built for people who love growing, learning and creating together… loyalty is a two-way street").
4. **Trips (5)** — showcase das viagens anuais com **vídeo Vimeo** (rendition 1080p), legenda `Panama / April 2025`, timecode `[01:10]` e CTA `Watch film ↓`; link para `explore.locomotive.ca`.
5. **Our Values** — intro + **lista numerada 1–4**: (1) Embrace flexibility, (2) Cultivate genuine friendships, (3) Have room to grow, (4) Have your team's back. Cada valor reaparece como **painel dedicado** com `(n)`, label curto, imagem e um H3 + parágrafo longo. 🔎 A repetição dos rótulos com índice `(1)…(4)` e imagens é a **assinatura de uma seção "pinada" (sticky/pin via ScrollTrigger)**: o bloco trava na viewport e troca de painel conforme o scroll avança (horizontal ou cross-fade vertical).
6. **Positions(5)** — listagem de vagas no **mesmo padrão de card dos projetos** ("Palavra ![mídia] Palavra" + índice `01/02/03`): Project Manager, UX Strategist, Front-end developer (abertas, link → Collage) e Art Director / Back-end Developer marcadas **`Closed`** (sem link). É a materialização do `Always looking for top shelf talent` da home.
7. **Footer** (idêntico à home).

🔎 **Grid e respiro:** alternância entre blocos full-bleed (fotos, vídeo, cards de vaga que "quebram" o container) e texto contido (missão, valores, cultura) indica **grid de 12 colunas com containers de larguras alternadas** e whitespace vertical generoso entre capítulos. 🛠️ Reconstrução: container máx. ~1440–1600px, gutters 24–32px, espaçamento entre seções `clamp(80px, 12vw, 200px)`, cards de vaga/projeto em **CSS Grid com células de proporções desiguais** (ritmo editorial assimétrico); listas internas (valores, nav) em Flexbox.

### 4.3 Footer

✅ Rodapé consistente nas duas páginas, com três colunas nomeadas — **Menu** (Work, Agency, Careers, Let's talk, Privacy, Français, Cookie preferences), **Social** (Instagram, Twitter, LinkedIn, Behance, GitHub) e **External** (Store, Locomotive Scroll, Annual trips, Dynasty) — mais **bloco de newsletter** (`Newsletter ↓` / "Give an email, get the newsletter" / `Subscribe`), **endereço físico** (1211 Jean-Talon Est, Montréal (QC), Canada, H2R 1W1) como **link para o Google Maps**, **telefone** (`+1 514 524 5678`), **e-mail** (`info@locomotive.ca`) e carimbo `©2026`. Os glifos do icon-font pontuam o endereço.

🔎 Disposição deduzida: 3–4 colunas em desktop colapsando para empilhamento no mobile; a coluna External (linkando os subsites próprios — Scroll, Trips, Dynasty, Store) é um traço de identidade: o estúdio expõe seu ecossistema de produtos/cultura no rodapé.

---

## 5. Efeitos Visuais e Transições

### 5.1 Animações

✅ **Evidências diretas no markup:**

- **Intro incremental** (as sequências `Digital-First…` e `Based in Montreal…` em múltiplos estados) — texto que se completa/entra em stagger antes do hero.
- **Vídeo Vimeo** com rendition 1080p e timecode → reprodução ambiente/expandida na seção Trips.
- **Contadores crus** expostos: `Extras (13)`, `Trips (5)`, `Positions(5)` — 🔎 alvos típicos de **count-up disparado por scroll**.
- **Seção de valores 1–4 com painéis repetidos** → 🔎 **sticky/pin** com transição entre painéis.
- **Grid extenso de fotos** → 🔎 reveal em stagger e/ou parallax por scroll.

✅ **Smooth scroll:** o uso do **Locomotive Scroll** (biblioteca da casa) é a base do movimento — scroll com inércia, `data-scroll` / `data-scroll-speed` para parallax por elemento e scrollbar customizada (`.c-scrollbar`).

🛠️ **Spec de reconstrução do sistema de motion:**

- Entradas por `translateY(40–60px) + opacity 0→1`, stagger de 60–100ms entre itens de lista (valores, cards, fotos).
- **Máscaras de linha** (`overflow: hidden` + `translateY(100%)→0`) nos títulos em Editorial New — reveal "linha que sobe".
- **Parallax** (fator 0.85–0.95, via `data-scroll-speed`) nas fotos de equipe e mídias de projeto.
- **Pin da seção de valores**: `ScrollTrigger` com `pin: true`, trocando painel por `x`/cross-fade a cada trecho de scroll; índice `(1)…(4)` atualizando junto.
- **Count-up** de 1.2–2s com easing desacelerado para os contadores.
- Scroll suave via Locomotive Scroll (ou Lenis, se optar por stack mais atual) sincronizado ao ScrollTrigger.

### 5.2 Transições

🛠️ O fetch estático não expõe os valores de `transition`. Especificação recomendada para replicar a sensação premiada:

- Micro-interações (links, botões, toggles) em `0.3s–0.4s` com `cubic-bezier(0.25, 0.1, 0.25, 1)`.
- Reveals e movimentos de layout em `0.6s–0.9s` com expo-out `cubic-bezier(0.16, 1, 0.3, 1)`.
- Abertura do menu overlay fullscreen em `0.6s–0.8s`, painel deslizando + itens em stagger.
- Troca de painel na seção pinada de valores em `0.6s–1s` sincronizada ao progresso do scroll.
- Regra de ouro do estilo: **nada linear, nada abaixo de 200ms, nada acima de ~1s** em interação direta.

### 5.3 Estados de hover

🔎 Deduções ancoradas na estrutura:

- **Cards de projeto e de vaga** (padrão "Palavra ![mídia] Palavra"): a mídia central provavelmente **anima/roda vídeo no hover** com leve escala (`scale 1 → 1.04–1.06`) dentro de container `overflow: hidden`; o nome pode preencher/inverter.
- **Vagas `Closed`** (Art Director, Back-end Developer): estado **desabilitado** — sem link, provável opacidade reduzida e cursor `not-allowed`.
- **Links de texto e menu**: sublinhado animado (largura 0→100%) ou troca de opacidade/cor com deslocamento mínimo.
- **CTAs** (`Let's talk`, `View jobs↓`, `Watch film ↓`): inversão de cor (fundo escuro ↔ texto claro) ou preenchimento deslizante; seta com micro-deslocamento no eixo indicado. 🛠️ Considerar **cursor customizado/ampliado** sobre mídia ("Watch", "Drag", "View") — recorrente na categoria Awwwards em que o estúdio compete; validar no site ao vivo.

---

## 6. Componentes Interativos

### 6.1 Botões e links

✅ O site **evita botões-caixa tradicionais**: os CTAs são **textuais** com seta/glifo — `Let's talk`, `View jobs↓`, `Watch film ↓`, `Read more about this project/position`, `Subscribe`, `Buy now→`. Reforça o caráter editorial. 🔎 Estilo dominante **flat/ghost tipográfico**: texto forte, feedback por sublinhado/inversão/deslocamento, **sem sombra nem relevo** (zero neomorfismo).

✅ **Cards como link inteiro:** projetos e vagas são blocos clicáveis (nome + mídia + "Read more…"), com as vagas abertas apontando para o **ATS externo Collage** (`secure.collage.co/jobs/locomotive/{id}`) e as fechadas sem destino.

✅ **Contadores como design:** `(13)`, `(5)`, `(1)…(4)`, `[01:10]` — número tratado como elemento gráfico, não só informação.

🛠️ Links de rodapé/redes em lista vertical simples, hover por sublinhado/opacidade; newsletter com campo único + `Subscribe` e overlay "Give an email, get the newsletter".

### 6.2 Efeitos sonoros

✅ **Nenhum elemento `<audio>` ou biblioteca de som (Howler, Tone) foi detectável** na extração das duas páginas — sem evidência verificável de audio feedback. 🔎 Se quiser incorporar essa camada no seu projeto, a spec coerente com o estilo seria 🛠️: sons **sutis** (clicks de 20–50ms, pops de baixa frequência a −20/−30dB), apenas em interações intencionais (abrir menu, play do vídeo de trips), sempre com **toggle de mute** e **nunca em autoplay**.

---

## 7. Checklist de validação no DevTools (para fechar os tokens exatos)

Abra as duas páginas no Chrome DevTools e confirme, nesta ordem:

1. **Network → Font:** os arquivos `@font-face` reais — confirmar **Editorial New**, **Helvetica Now** e o **icon-font** proprietário (e qual PUA/caracteres os glifos "emoji" ocupam).
2. **Elements → Computed** sobre `body` e um H1: hex exatos de `color`/`background-color`, tamanhos computados da escala e se `#DA532C` aparece em algum estado real da UI.
3. **Elements:** procurar `transition`/`animation` no hover dos cards de projeto e vaga (durações e curvas reais) e os atributos `data-scroll`, `data-scroll-speed`, `data-scroll-sticky` do Locomotive Scroll.
4. **Sources:** confirmar **Locomotive Scroll** e a presença de **GSAP/ScrollTrigger** (assinatura da seção pinada de valores) — e a ausência de bundle de framework (React/Vue).
5. **Network → Media:** comportamento dos vídeos (Vimeo na seção Trips; mídia dos cards) no hover/scroll.
6. **Elements (careers):** inspecionar a seção **Our Values** para verificar se o pin é horizontal (translate X) ou cross-fade vertical, e como o índice `(1)…(4)` é atualizado.

Com esses seis pontos, todos os valores marcados como 🛠️/🔎 podem ser promovidos a ✅.

---

## 8. Nota de adaptação (ponte com o seu projeto)

Para reconstruir uma seção "People/Equipe" e uma página de "Vagas" **no espírito da Locomotive** dentro do seu site (Nexxus), o que vale importar não são os valores literais, e sim **seis princípios de sistema**:

1. **Duas vozes tipográficas + um icon-font próprio.** Uma serifa de display (drama editorial) contra uma grotesca neutra (base técnica), mais um pequeno **sistema de ícones proprietário** que vire assinatura — no seu caso, glifos que conversem com o universo da Nexxus, não vagões de trem.
2. **Chrome neutro, conteúdo colorido.** Deixe as **fotos da equipe** e a **cor da marca** carregarem a emoção; a interface fica quase monocromática. Aqui está a diferença estratégica: a Locomotive pode ser branco-e-preto porque tem 7 anos de prêmios como prova. Uma marca em construção deve manter sua **paleta própria (navy + pistache)** como assinatura de aquecimento sobre a mesma disciplina estrutural — use o navy como `--bg-inverse`/texto e o pistache como o único `--accent` real (hover, marcadores de icon-font, sublinhados).
3. **"Pessoas antes de ferramentas" dito em Editorial-display.** O bloco-manifesto deve ser **texto grande e contido**, com reveal por máscara de linha — não uma grade de headshots corporativa.
4. **Cultura como narrativa, não como lista.** Valores em **seção pinada** (1–4), viagens/bastidores em **vídeo**, equipe em **mosaico fotográfico com parallax** — a página de vagas vende o ambiente antes de listar cargos.
5. **Cards de vaga = cards de projeto.** Reaproveite o mesmo componente do portfólio para as posições (nome + mídia + "Read more"), com estado `Closed` desabilitado. Integre um ATS (Collage, Greenhouse, Recruitee) via link, sem reinventar o board.
6. **Movimento é o "caro".** Smooth scroll (Locomotive Scroll ou Lenis) + reveals em stagger + count-up nos contadores + hover de vídeo nos cards. Sem isso, a mesma estrutura parece um template; com isso, parece premiada.

**Requisito de honestidade estrutural a preservar:** copy quente e humano (a Locomotive fala "loyalty is a two-way street", "lots of heart"), contadores crus expostos e glifos como ornamento — humor e calor no **texto e no sistema de ícones**, nunca em decoração supérflua.