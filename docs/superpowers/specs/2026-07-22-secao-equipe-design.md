# Seção Equipe — design

**Data:** 2026-07-22
**Escopo:** seção resumida "As Nozes" na Home + subpágina dedicada `/equipe` com os 11 integrantes.

## 1. Contexto

A landing page da Nexxus Hub EJ hoje é single-page (Vite + React 18, sem router), com scroll orquestrado:
Lenis, um sticky stack que produz match-cut entre capítulos, fade-out de seção por scroll e um sistema de
reveal com stagger gated pelo Preloader. A seção `Team` (`#nozes`) lista apenas os 7 setores e traz um
`namesNote` dizendo que os nomes viriam "quando a papelada de fundação sair do forno".

Os nomes agora existem, e existe um ensaio fotográfico: 20 retratos individuais (2 por pessoa, exceto
Kamilly e Lucas) e 6 fotos de grupo, todas JPG de 7–10 MB direto da câmera.

**Referências que governam o trabalho** (ambas em `gerenciamento/`):

- **Estrutura** — `Engenharia reversa — Locomotive® · Seção "People" (home) + página Careers.md`
- **Estética** — `Engenharia Reversa de burocratik.com.md`

Nota decisiva da referência de estrutura (§8.3): o bloco People da home deve ser **texto grande e contido
com reveal por máscara de linha, não uma grade de headshots corporativa**. O mosaico fotográfico e a
narrativa de cultura pertencem à subpágina.

## 2. Decisões tomadas

| Decisão | Escolha |
|---|---|
| Roteamento | `react-router-dom`, URL real `/equipe`, com fallback SPA no host |
| Seção da Home | Bloco-manifesto: texto editorial + **uma** foto de equipe + CTA. Sem lista de setores |
| Copy por pessoa | Apenas dado real: nome + setor. Campos `cargo` e `instagram` existem vazios |
| Tratamento das fotos | Cor natural, corte 3:4 no CSS, troca para a 2ª foto no hover |
| Escopo da `/equipe` | Hero + contador + mosaico → cultura → listagem por setor → CTA de recrutamento |
| Card do integrante | Nome quebrado ao redor da foto (padrão-assinatura Locomotive) |
| Organização | Capítulos por setor com contador cru; Área Técnica em bloco mais denso |
| Navegação | O item "As Nozes" do menu passa a apontar para `/equipe` |

Sem seção de valores pinados: os 7 princípios de cultura já são o `Manifesto` da Home, e duplicá-los na
subpágina custaria muito código para repetir conteúdo.

## 3. Arquitetura de rotas

`App` vira shell persistente; apenas o miolo troca.

```
main.jsx
└── <BrowserRouter>
    └── App                        Preloader · Cursor · Header · Footer persistem
        ├── ScrollManager          efeitos de scroll por troca de rota
        └── <Routes>
            ├── /        → pages/Home.jsx     Hero…Globe (extraído do App atual)
            └── /equipe  → pages/Equipe.jsx   4 capítulos novos
```

### 3.1 Hooks globais precisam reescanear o DOM

`useStickyStack`, `useSectionDepart` e `useHeaderTheme` fazem `querySelectorAll` uma única vez, com deps
`[]`. Como o `App` permanece montado entre rotas, eles não reescaneariam ao navegar — o match-cut sticky,
o fade-out de capítulo e a troca de tema do header quebrariam na `/equipe`.

Correção: os três passam a receber uma chave e a incluí-la nas deps do efeito.

```js
useStickyStack(pathname)     // useEffect(..., [key])
useSectionDepart(pathname)
useHeaderTheme(pathname)
```

A lógica interna não muda. `useLenis` continua com deps `[]` — a instância deve sobreviver à troca de rota.

### 3.2 `ScrollManager`

Componente sem render, montado dentro do `App`:

- ao mudar `pathname`: `getLenis()?.scrollTo(0, { immediate: true })`, com fallback `window.scrollTo(0, 0)`
  quando o Lenis não existe (reduced motion);
- se `location.hash` estiver presente após a navegação, aguarda a montagem (um `requestAnimationFrame`) e
  chama `scrollToId(hash)`;
- executa o scroll ao topo antes da pintura (`useLayoutEffect`) para não haver flash da rolagem anterior.

### 3.3 Âncoras cross-page

`onAnchorClick` (em `useLenis.js`) continua válido para navegação na mesma página. Header, MenuOverlay e
Footer passam a montar hrefs conscientes de rota: quando `pathname !== '/'`, `#cases` vira `/#cases` e o
link é um `<Link>` do router; na Home, permanece `#cases` com o handler do Lenis. Um helper único
`anchorHref(id, pathname)` centraliza a regra para não espalhar condicional pelos componentes.

O wordmark do Header aponta para `/`. O item de menu "As Nozes" passa a apontar para `/equipe` e usa
`<Link>` — o overlay fecha e navega, sem `scrollToId`.

### 3.4 Fallback SPA

Sem reescrita no servidor, um refresh em `/equipe` retorna 404. Entram no repositório:

- `código/public/_redirects` → `/*  /index.html  200` (Netlify)
- `código/vercel.json` → `{ "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }] }`

## 4. Pipeline de fotos

Script versionado `código/scripts/fotos.sh`, executável e idempotente, para que a otimização seja
reproduzível e não um passo manual. Usa ffmpeg (já instalado; `sharp` e ImageMagick não estão disponíveis).
A rotação EXIF é aplicada automaticamente pelo ffmpeg — os arquivos 6000×4000 saem em retrato 1200×1800.

```sh
ffmpeg -nostdin -y -i "$src" -vf "scale=$w:-2" -c:v libwebp -quality 80 -compression_level 6 "$out"
```

Aferido: retrato a 1200 px de largura = **42 KB**. As 26 fotos em duas larguras devem ficar em ~2 MB.

| Origem | Destino | Larguras |
|---|---|---|
| `gerenciamento/fotos/<pessoa>/*` | `código/public/fotos/<slug>-N-<w>.webp` | 640 e 1200 |
| `gerenciamento/fotos/equipe/*` | `código/public/fotos/equipe/grupo-N-<w>.webp` | 900 e 1600 |

Consumo no JSX com `srcset`/`sizes`. Os `.webp` gerados são versionados (não há CDN no projeto).

### 4.1 Mapa de integrantes

| Nome exibido | slug | Setor | Origem |
|---|---|---|---|
| Júlia | `julia` | Presidência | `julia/julia1.JPG`, `julia2.JPG` |
| Lara | `lara` | Coordenação | `lara/lara1.JPG`, `lara2.JPG` |
| Ísis | `isis` | Vendas | `ísis/isis1.JPG`, `isis2.JPG` |
| Leandro | `leandro` | Recursos Humanos | `leandro/leandro1.JPG`, `leandro2.JPG` |
| Lavínia | `lavinia` | Financeiro | `lívinia/i1.JPG`, `i2.JPG` |
| Lucas | `lucas` | Marketing Interno | `lucas/lucas1.jpeg` — **1 foto, horizontal** |
| Ana | `ana` | Área Técnica | `ana/ana1.JPG`, `ana2.JPG` |
| Otávio | `otavio` | Área Técnica | `otávio/otávio1.JPG`, `otávio2.JPG` |
| Kauã | `kaua` | Área Técnica | `kaua/kaua1.JPG`, `kaua2.JPG` |
| Luan | `luan` | Área Técnica | `luan/luan1.JPG`, `luan2.JPG` |
| Kamilly | `kamilly` | Área Técnica | `kamilly/kamilly1.jpeg` — **1 foto, externa** |

A pasta de origem da Lavínia é `lívinia/` (grafia divergente) — o nome correto de exibição é **Lavínia**.
Nomes de origem têm acentos, espaços (`vertical 2.JPG`) e extensões mistas (`.JPG`/`.jpeg`): o script
precisa citar caminhos e normalizar extensão.

### 4.2 Enquadramento

O recorte é responsabilidade do CSS: `aspect-ratio: 3/4` + `object-fit: cover`, com `object-position`
vindo do campo `focus` de cada pessoa. Assim o enquadramento se ajusta no data, sem tocar em componente.
Necessário sobretudo para Lucas (origem horizontal 1600×1066, recortada nas laterais) e Kamilly (foto
externa, fora do padrão do ensaio).

## 5. Modelo de dados

Em `código/src/data/content.js`, junto do restante do copy.

```js
export const equipe = {
  hero: { kicker, titleLines: [...], lead, cta: { label, href: '#lista' } },
  counter: { value: 11, label: 'nozes' },
  mosaic: [ { base: '/fotos/equipe/grupo-2', alt, orientation: 'h' | 'v' } ],  // as 5 não usadas na Home
  culture: { kicker, title, paragraphs: [...] },
  roster: [
    {
      setor: 'Presidência',
      slug: 'presidencia',
      membros: [
        {
          nome: 'Júlia',
          slug: 'julia',
          fotos: ['/fotos/julia-1', '/fotos/julia-2'],  // sufixo -<w>.webp no componente
          focus: '50% 25%',
          alt: 'Júlia, da presidência da Nexxus, em retrato de estúdio',
          cargo: '',       // título nominal — preencher quando definido
          instagram: '',   // opcional
        },
      ],
    },
    /* …demais 6 setores… */
  ],
  join: { kicker, title, lead, cta: { label, href: '/#orcamento' } },
}
```

`cargo` fica vazio de propósito: os dados fornecidos trazem apenas o setor, e títulos nominais em português
carregam gênero gramatical que não cabe inferir de foto ou de nome. O componente exibe `cargo` quando
existir e o setor caso contrário.

O objeto `team` (seção da Home) perde `areas` e `namesNote`, e ganha `statement`, `photo: { base, alt }` e
`cta: { label, to: '/equipe' }`.

## 6. Seção da Home — bloco-manifesto

Mantém `id="nozes"` e `data-theme="navy"`; o resto é reescrito para o padrão People da referência de
estrutura — **statement contido, não inventário**. A anatomia passa a ser:

1. **kicker** em `micro` (mantido);
2. **título** "As Nozes." (mantido);
3. **statement** curto e editorial (~2–3 linhas, medida ~46ch), com reveal por máscara de linha — o
   argumento "as onze pessoas são o diferencial", incluindo a piada de origem do nome ("Nozes" vem de
   "nós"), que hoje vive no campo `note`;
4. **uma foto de equipe** (`horizontal1`), larga, com `useParallax` (fator 0.9) e reveal próprio;
5. **`TextCta`** "conhecer as 11 nozes ↳" → `/equipe`, com `data-cursor` para o cursor customizado.

**Sai da Home:** a lista numerada dos 7 setores e o `namesNote`. Os setores passam a existir apenas na
`/equipe`, onde são os 7 capítulos do roster — a Home argumenta, a subpágina detalha. Isso remove a
duplicação e alinha o bloco à nota §8.3 da referência ("texto grande e contido, não inventário").

Em `content.js`, `team` perde `areas` e `namesNote`, e ganha `statement`, `photo` e `cta`. A foto é um
campo do data: trocar `horizontal1` por outra é uma linha, sem tocar em componente.

As outras 5 fotos de grupo (`horizontal2`, `horizontal3`, `vertical1–3`) ficam para o mosaico do hero da
`/equipe` — nenhuma foto aparece nas duas páginas.

## 7. Página `/equipe`

Quatro capítulos, cada um uma `.section` participando do sticky stack existente.

| # | Componente | `data-theme` | Conteúdo |
|---|---|---|---|
| 1 | `TeamHero` | navy | Display "AS NOZES." em máscara de linha, lead, contador cru `nozes (11)`, mosaico assimétrico das 5 fotos de grupo restantes com parallax, CTA-âncora "ver a equipe ↓" → `#lista` |
| 2 | `TeamCulture` | pistachio | Bloco de cultura em medida editorial (~60ch), reveal por máscara de linha, aside curto em micro |
| 3 | `TeamRoster` | white | `id="lista"`; 7 capítulos de setor, cada um com rótulo e contador cru (`presidência (1)` … `área técnica (5)`); cada pessoa é um `MemberCard` |
| 4 | `TeamJoin` | navy | "quer ser a 12ª noz?" + `TextCta` para `/#orcamento` |

O Header e o Footer vêm do shell — a página não os redeclara.

### 7.1 `MemberCard`

O padrão-assinatura da referência de estrutura (usado lá tanto em cards de projeto quanto de vaga): o nome
é quebrado ao redor da mídia.

```
01 —
  JÚLIA  ┌──────┐  PRESIDÊNCIA
         │ foto │
         └──────┘
                              02 —
         COORDENAÇÃO ┌──────┐ LARA
                     │ foto │
                     └──────┘
```

- **Índice**: numeração crua `01`–`11` em `micro`, contínua ao longo de toda a página (não reinicia a cada
  setor) — o `MemberCard` recebe o número já calculado, não o deriva sozinho.
- **Alternância**: cards de número ímpar (`01`, `03`, …) alinham à esquerda com a ordem `NOME · foto ·
  SETOR`; os de número par alinham à direita e invertem para `SETOR · foto · NOME`.
- **Hover**: crossfade de 350 ms para a 2ª foto (duas `<img>` empilhadas, opacidade alternada) +
  `scale(1.04)` dentro de container com `overflow: hidden`. Quem tem uma só foto (Kamilly, Lucas) recebe
  apenas a escala — o componente decide por `fotos.length`.
- **Reduced motion**: sem troca e sem escala; a 1ª foto permanece estática.
- **Não é link.** Não há página por pessoa; o card é conteúdo, não navegação. Sem `<a>`, sem `cursor:
  pointer`, sem `data-cursor` de ação.

Na Área Técnica (5 pessoas) o mesmo card entra em ritmo mais denso — 2 colunas no desktop, com o nome em
escala menor — criando variação de andamento em vez de esconder o desequilíbrio entre setores.

### 7.2 `<head>` por rota

`document.title` e a meta description são ajustados por rota em um efeito dentro de cada página (sem
biblioteca de head). Título da subpágina: `As Nozes — Nexxus Hub EJ`.

## 8. Motion e acessibilidade

Nada de motion novo: reaproveita `.reveal` (+ variantes `reveal-left/right/pop`) com stagger via `--i`,
`.mask-line`, `useParallax`, `useReveal` e o `RevealGate` do Preloader.

- Fotos com `loading="lazy"` (exceto as duas primeiras do mosaico do hero, que são `eager` + `fetchpriority
  high`), `decoding="async"` e `width`/`height` explícitos para CLS zero.
- `alt` descritivo por pessoa; o mosaico de grupo usa `alt` de contexto, não decorativo vazio.
- Capítulos de setor como `<section aria-labelledby>` com heading real; a lista de pessoas é `<ul>`.
- Contadores com `font-variant-numeric: tabular-nums` (já em `.micro`).
- Foco visível herdado de `base.css`; o CTA-âncora do hero é um link real para `#lista`.
- Toda animação sob `prefers-reduced-motion` já é neutralizada globalmente em `base.css`; o hover-swap
  precisa ser desativado explicitamente por ser troca de opacidade, não transição de layout.

## 9. Arquivos

**Novos**

```
código/scripts/fotos.sh
código/public/fotos/**                      (webp gerados, versionados)
código/public/_redirects
código/vercel.json
código/src/pages/Home.jsx
código/src/pages/Equipe.jsx
código/src/components/layout/ScrollManager.jsx
código/src/components/sections/TeamHero/{TeamHero.jsx,TeamHero.module.css}
código/src/components/sections/TeamCulture/{TeamCulture.jsx,TeamCulture.module.css}
código/src/components/sections/TeamRoster/{TeamRoster.jsx,TeamRoster.module.css}
código/src/components/sections/TeamJoin/{TeamJoin.jsx,TeamJoin.module.css}
código/src/components/ui/{MemberCard.jsx,MemberCard.module.css}
código/src/utils/anchorHref.js
```

**Modificados**

```
código/package.json                         + react-router-dom
código/src/main.jsx                         + BrowserRouter
código/src/App.jsx                          shell + Routes
código/src/data/content.js                  + equipe; team perde areas e namesNote, ganha statement, photo e cta
código/src/components/sections/Team/*       faixa de fotos + CTA para /equipe
código/src/components/layout/Header/Header.jsx        hrefs cientes de rota
código/src/components/layout/MenuOverlay/MenuOverlay.jsx  "As Nozes" → /equipe
código/src/components/layout/Footer/Footer.jsx        hrefs cientes de rota
código/src/hooks/{useStickyStack,useSectionDepart,useHeaderTheme}.js   deps por chave de rota
```

## 10. Critérios de aceite

1. `npm run build` e `npm run lint` passam sem erro nem warning novo.
2. `/equipe` renderiza os **11** integrantes, distribuídos nos 7 setores, cada um com foto carregada — nenhum
   404 em `/fotos/*`.
3. Navegar Home → `/equipe` → voltar preserva: match-cut sticky funcionando, tema do header trocando por
   seção e reveals disparando na página nova.
4. Refresh direto em `/equipe` serve a aplicação (verificado com `npm run preview`).
5. `código/public/fotos/` abaixo de 6 MB no total.
6. Hover em um card com duas fotos troca a imagem; em Kamilly e Lucas, não quebra nem pisca.
7. Sob `prefers-reduced-motion`, nenhuma troca de foto e nenhum parallax.
8. A seção da Home é statement + uma foto + CTA para `/equipe`: sem lista de setores e sem `namesNote`.
   Nenhuma foto de grupo aparece na Home e na `/equipe` ao mesmo tempo.

## 11. Fora de escopo

- Página individual por integrante.
- Seção de valores pinados na `/equipe` (o Manifesto da Home cobre o conteúdo).
- Títulos nominais de cargo e links de Instagram — campos existem, preenchimento é posterior.
- Vídeo de cultura (o equivalente à seção Trips da referência): não há material.
- Substituir as fotos fora do padrão do ensaio (Kamilly, Lucas) — mitigado por enquadramento, não por
  tratamento de cor.
