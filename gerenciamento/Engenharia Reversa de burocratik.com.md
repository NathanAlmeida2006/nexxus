
---

**Fonte da análise:** fetch do HTML renderizado de `https://www.burocratik.com/` em 06/07/2026, complementado por informações públicas do estúdio (Awwwards, microsite 18.burocratik.com). **Stack detectada no código:** Nuxt (Vue) — assets em `/_nuxt/` —, CMS headless Sanity (`cdn.sanity.io` no og:image), vídeos em CDN DigitalOcean Spaces (`burosite.fra1.cdn.digitaloceanspaces.com`), formulário de recrutamento via Typeform. O `<noscript>` exibe "This website requires Javascript", confirmando que toda a experiência é orquestrada por JS.

**Legenda de confiabilidade usada neste documento:**

- ✅ **Verificado** — presente no markup/metadados obtidos.
- 🔎 **Inferido** — dedução técnica a partir de padrões do markup ou do histórico documentado do estúdio.
- 🛠️ **Especificação de reconstrução** — valor recomendado para replicar o efeito no seu projeto (não extraído do código-fonte; validar no DevTools).

---

## 1. Contexto e Vibe

✅ O Bürocratik ("Büro") se define como uma prática transdisciplinar de branding e digital, e se apresenta como "a fearless digital studio" com duas décadas de ofício, ranqueado como estúdio digital nº 1 da Europa pela liga de agências dos European Design Awards (2021–2025). O nicho é o topo da cadeia: branding e experiências digitais premiadas (Awwwards, CSSDA, ED Awards) para clientes como Remote, Unilever, Clear Street e MultiversX.

A emoção transmitida é a de **confiança absoluta com irreverência controlada**. Não é neobrutalismo de contornos grossos nem corporativismo asséptico: é um **editorial-brutalismo tipográfico** — a página se comporta como uma revista impressa de altíssimo padrão que ganhou motor de animação. O humor está no copy, não na decoração: "18 fkn Years", "We take design seriously—ourselves, not so much", "Say no more, It's a match ↓", o emoji 🤟 dentro do próprio H1 e a piada geográfica sobre Portugal na seção de prêmios. ✅ Todos esses textos constam do markup.

🔎 A vibe resultante: minimalista na base (fundo neutro, tipografia dominante), brutalista na escala (títulos gigantes, contadores numéricos crus como "7.340 days" e "303" prêmios), lúdica nos detalhes (emojis, setas tipográficas ↳ ↓, glifos como †). O conteúdo — vídeos de cases — é quem traz a cor; o chrome do site se mantém neutro para não competir.

---

## 2. Tipografia

🔎 **Família primária:** uma **grotesca sans-serif customizada/proprietária**. O estúdio tem histórico documentado de desenhar as próprias fontes (a "Mutant Sans" foi a primeira fonte custom do Büro, citada na timeline oficial de 18 anos) e lista "Type design" entre os serviços ✅. O fetch estático não expõe os arquivos `@font-face`, portanto o nome exato da fonte atual deve ser confirmado no DevTools (aba Network → filtro Font).

🛠️ **Substitutas de reconstrução** com o mesmo DNA (grotescas neutras com personalidade nos detalhes): Neue Haas Grotesk, Helvetica Now, Suisse Int'l ou, em alternativa gratuita, Inter/General Sans com tracking apertado.

🔎 **Família secundária:** não há evidência de segunda família no markup; a hierarquia parece ser construída com **uma única família em pesos e escalas contrastantes** — prática coerente com a ênfase declarada do estúdio em "typography and detail" ✅.

**Escala tipográfica** (🛠️ reconstrução proporcional a partir da hierarquia do markup; o site usa dimensionamento fluido):

|Papel|Elemento observado ✅|Spec de reconstrução 🛠️|
|---|---|---|
|Display/H1|Manifesto do herói ("We're a fearless 🤟 digital studio…")|`clamp(2.5rem, 6vw, 6.5rem)`, peso 500–700, line-height 1.0–1.1, letter-spacing −0.02em|
|H2|"Our Accolades.", "What we do", "Testimonials"|`clamp(2rem, 4vw, 4rem)`, peso 600|
|H3|Manifesto numerado 1–7, nomes dos 4 pilares de serviço|`clamp(1.25rem, 2vw, 2rem)`, peso 500|
|Corpo|Parágrafos institucionais e depoimentos|16–18px, line-height 1.5–1.6, peso 400|
|Micro/labels|"No. awards", "GPS", coordenadas, "01 — 00"|11–13px, caixa alta ou tabular-nums, tracking +0.05em|

🔎 **Cores da tipografia:** texto em preto quase puro sobre fundo claro na base do site (ver seção 3); inversões pontuais (texto claro sobre mídia escura) nos cards de case com vídeo.

✅ **Detalhes tipográficos como UI:** o site usa glifos como interface — a seta `↳` introduz a tagline de cada case ("Clear Street ↳ Designed for the Future."), a seta `↓` guia o scroll no rodapé, a cruz `†` marca homenagens na lista de equipe e números pontuados à europeia ("7.340 days") funcionam como dado bruto exposto. Esse uso de caracteres como ornamento é um requisito central para capturar a estética.

---

## 3. Paleta de Cores

✅ **Único valor cromático declarado no markup obtido:** `theme-color: #fff` — o branco é oficialmente a cor-base da interface.

🔎 A paleta funcional deduzida é **monocromática de alto contraste**, com a cor delegada ao conteúdo (vídeos e logos dos cases). Estrutura recomendada de tokens 🛠️:

|Token|Valor estimado|Uso|
|---|---|---|
|`--bg-base`|`#FFFFFF` ✅|Fundo global (confirmado pelo theme-color)|
|`--text-primary`|`#0A0A0A`–`#111111` 🛠️|Títulos e corpo|
|`--text-secondary`|`#666666`–`#8A8A8A` 🛠️|Labels, metadados, legendas de case|
|`--line`|`#E5E5E5` 🛠️|Hairlines/divisores de seção e listas|
|`--bg-inverse`|`#0A0A0A` 🛠️|Overlay do menu fullscreen e blocos invertidos|
|`--accent`|Nenhum accent fixo 🔎|O "accent" é a mídia: cada thumbnail de vídeo injeta a paleta do case|

🔎 **Princípio extraível:** a marca não disputa cor com o portfólio. Para um documento de requisitos, a regra é "chrome neutro, conteúdo colorido" — qualquer cor de destaque fixa quebraria a lógica do sistema. Validar os hex exatos no DevTools (Computed → color/background-color).

---

## 4. Layout e Estrutura

### 4.1 Header

✅ O cabeçalho é **mínimo e reduzido a três âncoras**: a logomarca/wordmark ("We are Büro", linkando para `/`), um botão único "Open/close menu" (hambúrguer textual) e o CTA persistente "Let's talk ?". A navegação completa não fica exposta: vive dentro de um **menu overlay** que, quando aberto, revela itens com **thumbnails visuais** (o markup traz "homepage thumbnail", "Studios thumbnail", "Recognition thumbnail", "Work thumbnail"), submenus (Work → Branding, Naming), o link para o microsite dos 18 anos e a barra de redes sociais.

🔎 Comportamento deduzido: header fixo/sticky de altura enxuta, provavelmente com **auto-hide no scroll para baixo e reaparecimento no scroll para cima**, e o menu abrindo como **painel fullscreen** (padrão consistente com a estrutura de overlay do markup e com o estilo do estúdio). 🛠️ Reconstrução: `position: fixed; mix-blend-mode: difference` ou troca de tema por seção para manter legibilidade sobre mídia.

### 4.2 Containers principais e seções

✅ A homepage é uma **narrativa vertical em capítulos**, nesta ordem exata: (1) preloader/marquee com "We are Büro" repetido; (2) herói com showreel em vídeo + botão Play + H1-manifesto; (3) contador "7.340 days" + CTA "Apply now"; (4) lista-créditos "Every Büro, through the years" com todos os nomes que passaram pelo estúdio; (5) bloco "18 fkn Years" com CTA para a timeline; (6) grade de cases intercalada em dois blocos, com thumbnails em vídeo `.mp4` e padrão textual "Nome ↳ tagline / Serviço / Setor"; (7) contador de prêmios "303" + texto "Our Accolades" + selos SVG clicáveis; (8) manifesto numerado de 1 a 7 em H3; (9) "What we do" em **quatro colunas de serviços** (Branding, Digital Branding, Experience, Business Design) com sublistas extensas — 🔎 provavelmente colapsáveis/accordion no mobile; (10) carrossel de depoimentos com logos SVG, blockquotes e navegação Previous/Next com paginação numérica "01 — 00"; (11) rodapé-contato.

🔎 **Grid e respiro:** a variedade de larguras (cases full-bleed com vídeo versus texto institucional contido) indica um **grid de 12 colunas com containers de larguras alternadas** e uso extensivo de whitespace vertical entre capítulos. 🛠️ Reconstrução: container máx. ~1400–1600px, gutters de 24–32px, espaçamento entre seções de 120–200px em desktop (`clamp(80px, 12vw, 200px)`), e cards de case quebrando o container para criar ritmo assimétrico. A grade de cases sugere layout em **CSS Grid com células de proporções desiguais** (padrão masonry editorial), enquanto listas internas (serviços, contatos) se resolvem em Flexbox/colunas.

### 4.3 Footer

✅ O rodapé abre com um título-convite em tom de flerte — "Say no more. It's a match ↓" — e se organiza nos seguintes blocos: coluna de contato geral (e-mail `hello@burocratik.com` e CTA "Let's talk!" para novos negócios); **lista completa de redes** (Instagram, Facebook, Tumblr, Vimeo, Behance, Dribbble, Medium e link "Awwwarded websites"); **dois endereços físicos** (Coimbra e Matosinhos, Portugal) apresentados com um detalhe de personalidade raro — as **coordenadas GPS em graus/minutos/segundos** como links para o Google Maps; e um **formulário de newsletter/contato** com botão "Send" e consentimento vinculado à Privacy Policy.

🔎 Disposição deduzida: 3–4 colunas em desktop colapsando para empilhamento no mobile, com o título "It's a match" em escala display fazendo par com o H1 do herói (abertura e fechamento tipográficos espelhados).

---

## 5. Efeitos Visuais e Transições

### 5.1 Animações

✅ **Evidências diretas no markup:** o texto "We are Büro" aparece repetido quatro vezes consecutivas no topo — assinatura de **preloader tipográfico e/ou marquee** em que a frase entra em loop/stagger antes de revelar o herói. Os vídeos usam o truque `#t=0.01` na URL do `.mp4` (força o primeiro frame como poster) e há botão "Play" separado — indicando **vídeo ambiente autoplay/muted com reprodução expandida sob demanda**. Contadores numéricos crus ("7.340 days", "303") são o alvo clássico de **count-up disparado por scroll** 🔎. O manifesto numerado de 1 a 7 e a lista de nomes da equipe são estruturas típicas de **reveal sequencial em stagger** conforme entram no viewport 🔎.

🛠️ **Spec de reconstrução do sistema de motion:** entradas por `translateY(40–60px) + opacity 0→1` com stagger de 60–100ms entre itens; máscaras de texto (linhas sobem dentro de `overflow: hidden`) para títulos display; parallax sutil (fator 0.85–0.95) nas mídias de case; count-up de 1.2–2s com easing desacelerado; smooth scroll com inércia (biblioteca tipo Lenis) — padrão da categoria Awwwards em que o estúdio compete.

### 5.2 Transições

🛠️ O fetch estático não expõe os valores de `transition`. Especificação recomendada para replicar a sensação "cara" do site: micro-interações (links, botões) em `0.3s–0.4s` com `cubic-bezier(0.25, 0.1, 0.25, 1)` (ease padrão refinado); movimentos de layout e reveals em `0.6s–0.9s` com curva expo-out `cubic-bezier(0.16, 1, 0.3, 1)`; abertura do menu overlay em `0.6s–0.8s` com o painel deslizando e itens em stagger. Regra de ouro do estilo: **nada linear, nada abaixo de 200ms, nada acima de 1s** em interações diretas.

### 5.3 Estados de hover

🔎 Deduções ancoradas na estrutura: nos **cards de case**, os arquivos `.mp4` de thumbnail indicam **play do vídeo no hover** (imagem estática → vídeo em loop), acompanhado tipicamente de leve escala da mídia (`scale 1 → 1.04–1.06`) dentro de container com `overflow: hidden`. Nos **links de texto e menu**, o padrão do estúdio é sublinhado animado (largura 0→100%) ou troca rápida de opacidade/cor com deslocamento mínimo. No **CTA "Let's talk ?"** e no botão Play, espera-se inversão de cores (fundo escuro ↔ texto claro) ou preenchimento deslizante. 🛠️ Incluir também cursor customizado/ampliado sobre mídia ("Play", "Drag") — recurso recorrente na categoria, a validar no site ao vivo.

---

## 6. Componentes Interativos

### 6.1 Botões e links

✅ O site praticamente **não usa botões-caixa tradicionais**: os CTAs são textuais ("Let's talk ?", "Apply now", "Let's Rewind", "Send", "Previous/Next"), reforçando o caráter editorial. 🔎 O estilo dominante é **flat/ghost tipográfico** — texto forte, às vezes acompanhado de seta ou glifo, com feedback por sublinhado, inversão ou deslocamento, sem sombras nem relevo (zero neomorfismo). O carrossel de depoimentos usa navegação textual explícita com **paginação numérica** ("01 — 00"), tratando o número como elemento de design. Links de rodapé e redes sociais em lista vertical simples, hover por sublinhado/opacidade 🛠️.

### 6.2 Efeitos sonoros

✅ **Nenhum elemento `<audio>` ou referência a biblioteca de som (Howler, Tone) foi detectável no markup extraído da homepage** — portanto não há evidência verificável de audio feedback em clique/hover na home. 🔎 Contexto relevante: o estúdio comprovadamente projeta com som em trabalhos de cliente — o case Kōzōwood inclui música customizada e micro-interações ao scroll, com convite explícito ao uso de fones. Se o seu projeto quiser incorporar essa camada, a especificação coerente com o estilo seria 🛠️: sons **sutis e discretos** (clicks suaves de 20–50ms, pops de baixa frequência a −20/−30dB), disparados apenas em interações intencionais (abrir menu, play), sempre com toggle de mute e nunca em autoplay.

---

## 7. Checklist de validação no DevTools (para fechar os tokens exatos)

Abra o site no Chrome DevTools e confirme, nesta ordem: em **Network → Font**, os arquivos `@font-face` reais (nome da grotesca proprietária); em **Elements → Computed** sobre o `body` e um H1, os hex exatos de `color`/`background-color` e os tamanhos computados da escala; em **Elements**, procure `transition` e `animation` nos estados de hover dos cards de case para capturar durações e curvas reais; em **Sources**, verifique a presença de bibliotecas como Lenis/GSAP (assinatura provável do sistema de scroll e reveals); e em **Network → Media**, o comportamento dos `.mp4` no hover dos cards. Com esses cinco pontos, todos os valores marcados como 🛠️ neste documento podem ser promovidos a ✅.

---

## 8. Nota de adaptação (ponte com o seu projeto)

O que vale importar do Bürocratik para um projeto no espírito da Nexxus não são os valores literais, e sim quatro princípios de sistema: tipografia como protagonista absoluta (uma família, muitos pesos e escalas); chrome neutro que cede a cor ao conteúdo/portfólio; números e glifos crus (contadores, ↳, ↓) como ornamento honesto; e humor no copy, não na decoração. A diferença estratégica a preservar: o Büro pode ser austero porque tem 300+ prêmios como prova; uma marca em fundação deve manter a paleta própria (navy + pistache) como assinatura de aquecimento sobre essa mesma disciplina estrutural.