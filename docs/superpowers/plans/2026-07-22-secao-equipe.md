# Seção Equipe — plano de implementação

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Publicar a equipe da Nexxus em dois lugares: um bloco-manifesto na Home com uma foto e um CTA, e a subpágina `/equipe` com os 11 integrantes organizados nos 7 setores.

**Architecture:** `react-router-dom` transforma o `App` em shell persistente (Preloader, Cursor, Header, Footer) com duas rotas. Os três hooks globais que hoje escaneiam o DOM uma única vez passam a receber a rota como chave e reescaneiam a cada navegação, preservando o sticky stack, o fade-out de capítulo e a troca de tema do header. As fotos do ensaio (~200 MB de JPG) viram WebP em duas larguras por um script ffmpeg versionado.

**Tech Stack:** Vite 5 · React 18 (JSX, sem TypeScript) · CSS Modules · Lenis · `react-router-dom` ^6.30 · ffmpeg (pipeline de imagens) · Python + CDP (verificação de aceite)

## Global Constraints

- **Spec:** `docs/superpowers/specs/2026-07-22-secao-equipe-design.md` — em caso de divergência, a spec vence.
- **Idioma:** todo texto de interface em **português do Brasil**. Comentários de código em português, como no resto do repo.
- **Tom de voz:** jovem, caloroso, coloquial, autodepreciativo (`gerenciamento/Briefing.md`). Sem jargão.
- **Nomes de exibição, com acento:** Júlia, Lara, Ísis, Leandro, **Lavínia** (a pasta de origem `lívinia/` tem grafia divergente — ignorar), Lucas, Ana, Otávio, Kauã, Luan, Kamilly.
- **Nada de fato inventado sobre pessoas reais.** Rótulo de cada integrante é o **setor**; `cargo` e `instagram` existem no data como string vazia, para preenchimento posterior. Não inferir gênero gramatical de foto ou nome.
- **Paleta e motion:** usar exclusivamente os tokens de `src/styles/tokens.css`. Nada linear, nada abaixo de 200 ms, nada acima de 1 s.
- **Sem novas dependências além de `react-router-dom`.**
- **Comandos rodam de `código/`.** O diretório tem acento no nome: sempre entre aspas em comandos shell.
- **Não há test runner no projeto.** A verificação de cada tarefa é `npm run lint` + `npm run build` + checagens executáveis descritas na própria tarefa. A Tarefa 10 constrói o verificador de aceite headless que cobre os 8 critérios da spec §10.

---

## Estrutura de arquivos

| Arquivo | Responsabilidade |
|---|---|
| `scripts/fotos.sh` | Único lugar que conhece os caminhos de origem do ensaio e as larguras de saída |
| `public/fotos/**` | WebP servidos (versionados) |
| `src/pages/Home.jsx` | Ordem dos capítulos da Home |
| `src/pages/Equipe.jsx` | Ordem dos capítulos da subpágina + meta da rota |
| `src/components/layout/ScrollManager.jsx` | Todo o comportamento de scroll ligado a troca de rota |
| `src/components/ui/AnchorLink.jsx` | Única regra de "âncora da Home a partir de qualquer rota" |
| `src/components/ui/MemberCard.jsx` | Card de um integrante (nome quebrado ao redor da foto, troca no hover) |
| `src/components/sections/Team*/` | Um capítulo por pasta, no padrão já usado em `sections/` |
| `src/hooks/usePageMeta.js` | `document.title` e description por rota |
| `src/data/content.js` | Todo o copy e os caminhos das fotos |

---

### Task 1: Pipeline de fotos

**Files:**
- Create: `código/scripts/fotos.sh`
- Create: `código/public/fotos/**` (saída gerada pelo script)

**Interfaces:**
- Consumes: nada.
- Produces: os caminhos que a Tarefa 4 referencia no data —
  retratos `/fotos/<slug>-<n>-<largura>.webp` com `<n>` ∈ {1,2}, `<largura>` ∈ {640,1200};
  grupo `/fotos/equipe/time-<h|v><n>-<largura>.webp` com `<largura>` ∈ {900,1600}.
  Slugs: `julia lara isis leandro lavinia lucas ana otavio kaua luan kamilly`.
  Só `lucas` e `kamilly` têm uma única foto (`-1`).

- [ ] **Step 1: Criar o script**

Criar `código/scripts/fotos.sh`:

```bash
#!/usr/bin/env bash
# Otimiza o ensaio fotográfico (gerenciamento/fotos) para código/public/fotos.
# Idempotente: regenera tudo a cada execução. Requer ffmpeg no PATH.
#
# O ffmpeg aplica a rotação EXIF antes dos filtros, então os arquivos de
# câmera (6000x4000 com flag de rotação) saem corretamente em retrato.
# min(largura, iw) impede upscale das duas fotos que já vêm pequenas.
set -euo pipefail

raiz="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
origem="$raiz/gerenciamento/fotos"
destino="$raiz/código/public/fotos"

# <caminho relativo à origem>|<nome de saída, sem largura nem extensão>
retratos=(
  "julia/julia1.JPG|julia-1"
  "julia/julia2.JPG|julia-2"
  "lara/lara1.JPG|lara-1"
  "lara/lara2.JPG|lara-2"
  "ísis/isis1.JPG|isis-1"
  "ísis/isis2.JPG|isis-2"
  "leandro/leandro1.JPG|leandro-1"
  "leandro/leandro2.JPG|leandro-2"
  "lívinia/i1.JPG|lavinia-1"
  "lívinia/i2.JPG|lavinia-2"
  "lucas/lucas1.jpeg|lucas-1"
  "ana/ana1.JPG|ana-1"
  "ana/ana2.JPG|ana-2"
  "otávio/otávio1.JPG|otavio-1"
  "otávio/otávio2.JPG|otavio-2"
  "kaua/kaua1.JPG|kaua-1"
  "kaua/kaua2.JPG|kaua-2"
  "luan/luan1.JPG|luan-1"
  "luan/luan2.JPG|luan-2"
  "kamilly/kamilly1.jpeg|kamilly-1"
)

grupo=(
  "equipe/horizontal1.JPG|equipe/time-h1"
  "equipe/horizontal2.JPG|equipe/time-h2"
  "equipe/horizontal3.JPG|equipe/time-h3"
  "equipe/vertical1.JPG|equipe/time-v1"
  "equipe/vertical 2.JPG|equipe/time-v2"
  "equipe/vertical3.JPG|equipe/time-v3"
)

converter() { # converter <origem> <saída sem extensão> <larguras...>
  local src="$1" out="$2"
  shift 2
  local w
  for w in "$@"; do
    ffmpeg -nostdin -loglevel error -y -i "$src" \
      -vf "scale='min($w,iw)':-2" \
      -c:v libwebp -quality 80 -compression_level 6 \
      "$destino/$out-$w.webp"
  done
}

mkdir -p "$destino/equipe"

for par in "${retratos[@]}"; do
  converter "$origem/${par%%|*}" "${par##*|}" 640 1200
done

for par in "${grupo[@]}"; do
  converter "$origem/${par%%|*}" "${par##*|}" 900 1600
done

echo "retratos: $(ls "$destino"/*.webp | wc -l) | grupo: $(ls "$destino"/equipe/*.webp | wc -l)"
```

- [ ] **Step 2: Tornar executável e rodar**

```bash
chmod +x "código/scripts/fotos.sh" && "código/scripts/fotos.sh"
```

Esperado: `retratos: 40 | grupo: 12`

- [ ] **Step 3: Verificar contagem, peso e rotação**

```bash
ls "código/public/fotos"/*.webp | wc -l
ls "código/public/fotos/equipe"/*.webp | wc -l
du -sh "código/public/fotos"
ffprobe -v error -show_entries stream=width,height -of csv=p=0 "código/public/fotos/julia-1-1200.webp"
ffprobe -v error -show_entries stream=width,height -of csv=p=0 "código/public/fotos/equipe/time-h1-1600.webp"
```

Esperado: `40`; `12`; peso total **abaixo de 6 MB**; `1200,1800` (retrato — prova que a rotação EXIF foi aplicada); `1600,1066`.

- [ ] **Step 4: Verificar que os 11 integrantes têm foto**

```bash
for s in julia lara isis leandro lavinia lucas ana otavio kaua luan kamilly; do
  n=$(ls "código/public/fotos/$s"-*-1200.webp 2>/dev/null | wc -l)
  echo "$s: $n"
done
```

Esperado: `1` para `lucas` e `kamilly`, `2` para os outros nove. Nenhum `0`.

- [ ] **Step 5: Commit**

```bash
git add "código/scripts/fotos.sh" "código/public/fotos"
git commit -m "feat: pipeline ffmpeg do ensaio fotográfico para webp"
```

---

### Task 2: Shell de rotas

**Files:**
- Modify: `código/package.json` (dependência)
- Modify: `código/src/main.jsx`
- Modify: `código/src/App.jsx`
- Create: `código/src/pages/Home.jsx`
- Create: `código/src/pages/Equipe.jsx` (mínima; a Tarefa 9 compõe os capítulos)
- Create: `código/src/components/layout/ScrollManager.jsx`
- Modify: `código/src/hooks/useStickyStack.js`, `useSectionDepart.js`, `useHeaderTheme.js`
- Modify: `código/src/components/layout/Header/Header.jsx` (só a chamada do hook)
- Create: `código/public/_redirects`, `código/vercel.json`

**Interfaces:**
- Consumes: nada das tarefas anteriores.
- Produces:
  - `useStickyStack(routeKey)`, `useSectionDepart(routeKey)`, `useHeaderTheme(routeKey)` — assinatura passa a aceitar uma chave de rota opcional (string).
  - `pages/Home.jsx` e `pages/Equipe.jsx` como default exports sem props.
  - Rotas `/` e `/equipe` disponíveis para a Tarefa 3 linkar.

- [ ] **Step 1: Instalar o router**

```bash
cd "código" && npm install react-router-dom@^6.30.0
```

Esperado: instala sem erro. **Usar a major 6**: a 7 declara `engines.node >= 20` e o ambiente roda Node 18.

- [ ] **Step 2: Envolver a aplicação no BrowserRouter**

Em `código/src/main.jsx`, adicionar o import e envolver o `<App />`:

```jsx
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
/* Só o subset latin: todo o texto do site (pt-BR) vive nele — os glifos
   decorativos (↳ ✶ ♪) nunca estiveram nos outros subsets e seguem no fallback */
import '@fontsource/poppins/latin-400.css'
import '@fontsource/poppins/latin-500.css'
import '@fontsource/poppins/latin-600.css'
import '@fontsource/poppins/latin-700.css'
import 'lenis/dist/lenis.css'
import './styles/tokens.css'
import './styles/base.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
```

- [ ] **Step 3: Dar chave de rota aos três hooks globais**

Os três varrem o DOM uma vez só (deps `[]`). Como o `App` não desmonta ao navegar, eles nunca reescaneariam. `void routeKey` deixa o parâmetro genuinamente usado — sem ele o `react-hooks/exhaustive-deps` acusa dependência desnecessária.

Em `código/src/hooks/useStickyStack.js`, trocar a assinatura e as deps:

```js
export default function useStickyStack(routeKey = '') {
  useEffect(() => {
    /* routeKey só existe como dependência: trocar de rota troca as .section
       da página e exige recalcular todos os tops do sticky stack. */
    void routeKey
    const sections = Array.from(document.querySelectorAll('.section'))
    if (!sections.length) return undefined
```

e o fecho do efeito passa de `}, [])` para `}, [routeKey])`.

Em `código/src/hooks/useSectionDepart.js`, o mesmo:

```js
export default function useSectionDepart(routeKey = '') {
  useEffect(() => {
    void routeKey
    if (prefersReducedMotion()) return undefined
    const sections = Array.from(document.querySelectorAll('.section'))
    if (sections.length < 2) return undefined
```

fecho `}, [routeKey])`.

Em `código/src/hooks/useHeaderTheme.js`:

```js
export default function useHeaderTheme(routeKey = '') {
  const [onNavy, setOnNavy] = useState(true)

  useEffect(() => {
    void routeKey
    const sections = document.querySelectorAll('[data-theme]')
```

fecho `}, [routeKey])`.

- [ ] **Step 4: Criar o ScrollManager**

Criar `código/src/components/layout/ScrollManager.jsx`:

```jsx
import { useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { getLenis, scrollToId } from '../../hooks/useLenis'

/*
 * Scroll ligado à troca de rota. Sobe ao topo antes da pintura (senão a
 * página nova aparece na altura de rolagem da anterior) e, quando a URL
 * traz hash — "/#cases" vindo da subpágina —, rola até a âncora no quadro
 * seguinte, já com a Home montada.
 */
export default function ScrollManager() {
  const { pathname, hash } = useLocation()

  useLayoutEffect(() => {
    const lenis = getLenis()
    if (lenis) lenis.scrollTo(0, { immediate: true })
    else window.scrollTo(0, 0)
  }, [pathname])

  useLayoutEffect(() => {
    if (!hash) return undefined
    const raf = requestAnimationFrame(() => scrollToId(hash))
    return () => cancelAnimationFrame(raf)
  }, [pathname, hash])

  return null
}
```

- [ ] **Step 5: Extrair a Home para uma página**

Criar `código/src/pages/Home.jsx`:

```jsx
import Cases from '../components/sections/Cases/Cases'
import Faq from '../components/sections/Faq/Faq'
import Globe from '../components/sections/Globe/Globe'
import Hero from '../components/sections/Hero/Hero'
import LeadForm from '../components/sections/LeadForm/LeadForm'
import Manifesto from '../components/sections/Manifesto/Manifesto'
import Services from '../components/sections/Services/Services'
import Stats from '../components/sections/Stats/Stats'
import Team from '../components/sections/Team/Team'

export default function Home() {
  return (
    <>
      <Hero />
      <Stats />
      <Cases />
      <Manifesto />
      <Services />
      <Team />
      <Faq />
      <LeadForm />
      <Globe />
    </>
  )
}
```

- [ ] **Step 6: Criar a página /equipe mínima**

Andaime temporário — existe para a rota ser verificável agora; a Tarefa 9 substitui o corpo pelos capítulos reais.

Criar `código/src/pages/Equipe.jsx`:

```jsx
import useReveal from '../hooks/useReveal'

export default function Equipe() {
  const ref = useReveal()

  return (
    <section className="section" data-theme="navy" ref={ref}>
      <div className="container">
        <h1 className="reveal">As Nozes.</h1>
      </div>
    </section>
  )
}
```

- [ ] **Step 7: Transformar o App em shell**

Substituir todo o conteúdo de `código/src/App.jsx`:

```jsx
import { useState } from 'react'
import { Route, Routes, useLocation } from 'react-router-dom'
import Footer from './components/layout/Footer/Footer'
import Header from './components/layout/Header/Header'
import ScrollManager from './components/layout/ScrollManager'
import Preloader from './components/sections/Preloader/Preloader'
import Cursor from './components/ui/Cursor'
import { RevealGate } from './hooks/RevealGate'
import useLenis from './hooks/useLenis'
import useSectionDepart from './hooks/useSectionDepart'
import useStickyStack from './hooks/useStickyStack'
import Equipe from './pages/Equipe'
import Home from './pages/Home'

export default function App() {
  const [ready, setReady] = useState(false)
  const { pathname } = useLocation()
  useLenis()
  /* A chave por rota faz os hooks reescanearem as .section da página nova.
     O Lenis fica de fora: a instância precisa sobreviver à navegação. */
  useStickyStack(pathname)
  useSectionDepart(pathname)

  return (
    <RevealGate.Provider value={ready}>
      <a className="skip-link" href="#conteudo">
        Pular para o conteúdo
      </a>
      {!ready && <Preloader onDone={() => setReady(true)} />}
      <ScrollManager />
      <Cursor />
      <Header />
      <main id="conteudo">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/equipe" element={<Equipe />} />
        </Routes>
      </main>
      <Footer />
    </RevealGate.Provider>
  )
}
```

- [ ] **Step 8: Passar a rota para o tema do header**

Em `código/src/components/layout/Header/Header.jsx`, adicionar o import do `useLocation` e usar a rota como chave. Trocar:

```jsx
import { useRef, useState } from 'react'
import { site } from '../../../data/content'
```

por:

```jsx
import { useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { site } from '../../../data/content'
```

e, dentro do componente, trocar `const theme = useHeaderTheme()` por:

```jsx
  const { pathname } = useLocation()
  const theme = useHeaderTheme(pathname)
```

- [ ] **Step 9: Fallback SPA para o host**

Criar `código/public/_redirects` (Netlify):

```
/*  /index.html  200
```

Criar `código/vercel.json`:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

- [ ] **Step 10: Lint e build**

```bash
cd "código" && npm run lint && npm run build
```

Esperado: lint sem erro nem warning; build conclui com `✓ built in …`.

- [ ] **Step 11: Verificar que a rota responde no preview**

```bash
cd "código" && npm run preview &
sleep 3
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:4173/equipe
curl -s http://localhost:4173/equipe | grep -c '<div id="root">'
kill %1
```

Esperado: `200` e `1` — o `vite preview` já faz fallback SPA, então isso prova que o roteamento client-side vai receber a URL.

- [ ] **Step 12: Commit**

```bash
git add -A "código"
git commit -m "feat: shell de rotas com /equipe e hooks de scroll cientes de rota"
```

---

### Task 3: Navegação ciente de rota

**Files:**
- Create: `código/src/components/ui/AnchorLink.jsx`
- Modify: `código/src/components/ui/TextCta.jsx`
- Modify: `código/src/data/content.js` (só o array `nav`)
- Modify: `código/src/components/layout/Header/Header.jsx`
- Modify: `código/src/components/layout/MenuOverlay/MenuOverlay.jsx`
- Modify: `código/src/components/layout/Footer/Footer.jsx`

**Interfaces:**
- Consumes: rotas `/` e `/equipe` (Tarefa 2).
- Produces:
  - `<AnchorLink id="cases">rótulo</AnchorLink>` — âncora da Home que funciona de qualquer rota.
  - `<TextCta to="/equipe">` — o CTA tipográfico passa a aceitar `to` (navegação de router) além de `href`. Consumido pelas Tarefas 5 e 9.
  - `nav` ganha itens com `to` em vez de `id`.

- [ ] **Step 1: Criar o AnchorLink**

Criar `código/src/components/ui/AnchorLink.jsx`:

```jsx
import { Link, useLocation } from 'react-router-dom'
import { onAnchorClick } from '../../hooks/useLenis'

/*
 * Âncora da Home que funciona de qualquer rota: na própria Home o scroll é
 * delegado ao Lenis; fora dela navega para "/" carregando o hash e quem
 * termina o trabalho é o ScrollManager.
 */
export default function AnchorLink({ id, children, className = '', onClick, ...rest }) {
  const { pathname } = useLocation()

  if (pathname === '/') {
    return (
      <a
        {...rest}
        href={`#${id}`}
        className={className}
        onClick={(e) => {
          onClick?.(e)
          onAnchorClick(e)
        }}
      >
        {children}
      </a>
    )
  }
  return (
    <Link {...rest} to={`/#${id}`} className={className} onClick={onClick}>
      {children}
    </Link>
  )
}
```

- [ ] **Step 2: Dar suporte a `to` no TextCta**

Substituir todo o conteúdo de `código/src/components/ui/TextCta.jsx`:

```jsx
import { Link } from 'react-router-dom'
import { onAnchorClick } from '../../hooks/useLenis'
import useMagnetic from '../../hooks/useMagnetic'
import styles from './TextCta.module.css'

/*
 * CTA tipográfico (sem caixa): glifo + label com sublinhado animado, magnético.
 * Com `to` vira navegação de rota; com `href` continua âncora/link externo.
 */
export default function TextCta({ href, to, children, glyph = '↳', className = '', onClick, ...rest }) {
  const magRef = useMagnetic(0.2)
  const conteudo = (
    <>
      <span className={styles.glyph} aria-hidden="true">
        {glyph}
      </span>
      <span className="link-underline">{children}</span>
    </>
  )

  if (to) {
    return (
      <Link {...rest} ref={magRef} to={to} onClick={onClick} className={`${styles.cta} ${className}`}>
        {conteudo}
      </Link>
    )
  }

  const handleClick = (e) => {
    onClick?.(e)
    onAnchorClick(e)
  }
  return (
    <a {...rest} ref={magRef} href={href} onClick={handleClick} className={`${styles.cta} ${className}`}>
      {conteudo}
    </a>
  )
}
```

- [ ] **Step 3: Apontar o item de menu para a subpágina**

Em `código/src/data/content.js`, substituir o array `nav`:

```js
export const nav = [
  { id: 'inicio', label: 'Início' },
  { id: 'cases', label: 'Cases' },
  { id: 'servicos', label: 'O que fazemos' },
  { to: '/equipe', label: 'As Nozes' },
  { id: 'jogo-rapido', label: 'Jogo rápido' },
  { id: 'contato', label: 'Contato' },
]
```

- [ ] **Step 4: Adaptar o MenuOverlay**

Em `código/src/components/layout/MenuOverlay/MenuOverlay.jsx`: trocar o import do `useRef` por um que também traga o `Link` e a rota, e trocar o `<li>` do map.

Import — substituir a primeira linha e adicionar:

```jsx
import { useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { nav, site } from '../../../data/content'
```

Dentro do componente, logo abaixo de `const firstLinkRef = useRef(null)`:

```jsx
  const { pathname } = useLocation()
```

Substituir o corpo do `nav.map(...)` por este bloco — três casos: item de rota (`item.to`), âncora estando na Home (scroll pelo Lenis) e âncora fora da Home (navegar para `/` levando o hash, por `Link`, para não recarregar a aplicação inteira):

```jsx
          {nav.map((item, i) => {
            const conteudo = (
              <>
                <span className={`micro ${styles.index}`}>{pad2(i + 1)}</span>
                <RollingText>{item.label}</RollingText>
              </>
            )
            const comuns = {
              ref: i === 0 ? firstLinkRef : undefined,
              className: styles.link,
              tabIndex: open ? 0 : -1,
            }
            return (
              <li key={item.label} className={styles.item} style={{ '--i': i }}>
                {item.to ? (
                  <Link {...comuns} to={item.to} onClick={onClose}>
                    {conteudo}
                  </Link>
                ) : pathname === '/' ? (
                  <a {...comuns} href={`#${item.id}`} onClick={go}>
                    {conteudo}
                  </a>
                ) : (
                  <Link {...comuns} to={`/#${item.id}`} onClick={onClose}>
                    {conteudo}
                  </Link>
                )}
              </li>
            )
          })}
```

- [ ] **Step 5: Adaptar o wordmark e o CTA do Header**

Em `código/src/components/layout/Header/Header.jsx`, adicionar aos imports:

```jsx
import { Link } from 'react-router-dom'
import AnchorLink from '../../ui/AnchorLink'
```

Substituir o wordmark e o link "bora conversar?":

```jsx
          {pathname === '/' ? (
            <a href="#inicio" className={styles.wordmark} onClick={onAnchorClick}>
              {site.wordmark}
            </a>
          ) : (
            <Link to="/" className={styles.wordmark}>
              {site.wordmark}
            </Link>
          )}
          <nav className={styles.actions} aria-label="Ações rápidas">
            <AnchorLink id="orcamento" className={`micro ${styles.talk}`}>
              <RollingText>bora conversar?</RollingText>
            </AnchorLink>
```

- [ ] **Step 6: Corrigir o "voltar ao topo" do Footer**

O botão chama `scrollToId('#inicio')`, que não existe fora da Home. Topo é topo em qualquer rota — trocar por scroll direto.

Em `código/src/components/layout/Footer/Footer.jsx`, trocar o import:

```jsx
import { getLenis } from '../../../hooks/useLenis'
```

e o botão:

```jsx
          <button
            type="button"
            className="micro link-underline"
            onClick={() => {
              const lenis = getLenis()
              if (lenis) lenis.scrollTo(0)
              else window.scrollTo({ top: 0, behavior: 'smooth' })
            }}
          >
            {footer.bottom.backToTop}
          </button>
```

- [ ] **Step 7: Lint e build**

```bash
cd "código" && npm run lint && npm run build
```

Esperado: sem erro nem warning. Se o lint acusar `scrollToId` não usado no Footer, remover o import antigo.

- [ ] **Step 8: Verificar navegação real no preview**

```bash
cd "código" && npm run preview &
sleep 3
curl -s http://localhost:4173/ | grep -c 'id="root"'
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:4173/equipe
kill %1
```

Esperado: `1` e `200`. A navegação client-side é exercitada de verdade na Tarefa 10.

- [ ] **Step 9: Commit**

```bash
git add -A "código"
git commit -m "feat: navegação ciente de rota no header, menu e rodapé"
```

---

### Task 4: Dados da equipe

**Files:**
- Modify: `código/src/data/content.js`

**Interfaces:**
- Consumes: caminhos de foto da Tarefa 1.
- Produces (usado pelas Tarefas 5 a 9):

```js
team = { kicker, title, statement: string[], photo: { base, alt }, cta: { label, to } }

equipe = {
  meta:    { title, description },
  hero:    { kicker, titleLines: string[], lead, counter: { value, label }, cta: { label, href } },
  mosaic:  [{ base, alt, orientacao: 'h' | 'v' }],       // 5 itens
  culture: { kicker, title, paragraphs: string[] },
  roster:  { kicker, title, setores: [{ setor, slug, membros: Membro[] }] },  // 7 setores, 11 membros
  join:    { kicker, title, lead, cta: { label, to } },
}

Membro = { nome, slug, fotos: string[], focus, alt, cargo: '', instagram: '' }
```

- [ ] **Step 1: Atualizar o cabeçalho do arquivo**

Em `código/src/data/content.js`, a lista de TODO ainda pede "nomes reais dos 11 fundadores". Substituir o bloco de comentário do topo:

```js
/*
 * Todo o copy da landing page, centralizado.
 * Tom de voz: jovem, caloroso, coloquial, autodepreciativo — gerenciamento/Briefing.md.
 *
 * TODO(nexxus): trocar os contatos placeholder pelos oficiais quando existirem:
 *   - número do WhatsApp Business
 *   - e-mail (depende do Google Workspace pós-CNPJ)
 *   - URLs das redes sociais
 *   - cargos nominais de cada integrante (campo `cargo` em equipe.roster)
 */
```

- [ ] **Step 2: Substituir o objeto `team`**

Trocar todo o `export const team = { … }` por:

```js
/*
 * Bloco-manifesto da Home: statement + uma foto + CTA. Os setores não vivem
 * mais aqui — viraram os capítulos do roster em /equipe.
 */
export const team = {
  kicker: 'onze pessoas fundando algo que nunca existiu na FURB',
  title: 'As Nozes.',
  statement: [
    '“Nozes” vem de “nós”. A gente avisou que o humor era assim.',
    'Ferramenta boa qualquer um contrata. O que muda o jogo são as onze pessoas que sentam do seu lado para entender o seu negócio — e que precisam que ele dê certo tanto quanto você.',
  ],
  photo: {
    base: '/fotos/equipe/time-h1',
    alt: 'A equipe da Nexxus reunida no estúdio',
  },
  cta: { label: 'conhecer as 11 nozes', to: '/equipe' },
}
```

- [ ] **Step 3: Adicionar o objeto `equipe`**

Inserir logo depois do `team`:

```js
/*
 * Subpágina /equipe. `cargo` e `instagram` ficam vazios de propósito: os dados
 * confirmados são nome e setor, e título nominal em português carrega gênero
 * gramatical que não cabe inferir. O componente cai no setor quando não há cargo.
 * `focus` é o object-position do recorte 3:4 — ajuste de enquadramento por aqui.
 */
export const equipe = {
  meta: {
    title: 'As Nozes — Nexxus Hub EJ',
    description:
      'As onze pessoas que fundaram a primeira empresa júnior de marketing da FURB. Sem foto de banco de imagem: somos nós mesmos.',
  },
  hero: {
    kicker: 'blumenau · vale do itajaí · sc',
    titleLines: ['As Nozes.'],
    lead:
      'Onze estudantes que decidiram fundar uma empresa júnior do zero, dentro da FURB. Sem case herdado, sem sócio investidor, sem histórico para inflar: método, supervisão e uma vontade absurda de fazer acontecer.',
    counter: { value: 11, label: 'nozes' },
    cta: { label: 'ver a equipe', href: '#lista' },
  },
  mosaic: [
    { base: '/fotos/equipe/time-h2', alt: 'Parte da equipe da Nexxus durante o ensaio', orientacao: 'h' },
    { base: '/fotos/equipe/time-h3', alt: 'A equipe da Nexxus rindo entre uma foto e outra', orientacao: 'h' },
    { base: '/fotos/equipe/time-v1', alt: 'Três integrantes da Nexxus posando no estúdio', orientacao: 'v' },
    { base: '/fotos/equipe/time-v2', alt: 'Integrantes da Nexxus em foto de grupo vertical', orientacao: 'v' },
    { base: '/fotos/equipe/time-v3', alt: 'A equipe da Nexxus reunida ao final do ensaio', orientacao: 'v' },
  ],
  culture: {
    kicker: 'como é trabalhar com a gente',
    title: 'Gente antes de ferramenta.',
    paragraphs: [
      'A Nexxus nasceu de uma pergunta simples: e se a gente parasse de esperar experiência para começar a ter experiência? A resposta foram onze pessoas, sete setores e uma associação sem fins lucrativos dentro da FURB.',
      'Aqui perguntar não é vergonha — ninguém nasceu sabendo marketing, e quem finge que nasceu costuma entregar pior. Toda reunião começa com cinco minutos de conversa sem pauta nenhuma. Pedir ajuda é legítimo; devolver ajuda é obrigatório.',
      'E se a Nexxus atrapalhar as notas, o trabalho ou a vida de alguém, a gente revê o combinado. É o tipo de acordo que não cabe em contrato, mas segura uma equipe inteira de pé.',
    ],
  },
  roster: {
    kicker: 'os onze, um por um',
    title: 'Quem faz.',
    setores: [
      {
        setor: 'Presidência',
        slug: 'presidencia',
        membros: [
          {
            nome: 'Júlia',
            slug: 'julia',
            fotos: ['/fotos/julia-1', '/fotos/julia-2'],
            focus: '50% 20%',
            alt: 'Júlia, da presidência da Nexxus, em retrato de estúdio',
            cargo: '',
            instagram: '',
          },
        ],
      },
      {
        setor: 'Coordenação',
        slug: 'coordenacao',
        membros: [
          {
            nome: 'Lara',
            slug: 'lara',
            fotos: ['/fotos/lara-1', '/fotos/lara-2'],
            focus: '50% 12%',
            alt: 'Lara, da coordenação da Nexxus, em retrato de estúdio',
            cargo: '',
            instagram: '',
          },
        ],
      },
      {
        setor: 'Vendas',
        slug: 'vendas',
        membros: [
          {
            nome: 'Ísis',
            slug: 'isis',
            fotos: ['/fotos/isis-1', '/fotos/isis-2'],
            focus: '50% 15%',
            alt: 'Ísis, do setor de vendas da Nexxus, em retrato de estúdio',
            cargo: '',
            instagram: '',
          },
        ],
      },
      {
        setor: 'Recursos Humanos',
        slug: 'recursos-humanos',
        membros: [
          {
            nome: 'Leandro',
            slug: 'leandro',
            fotos: ['/fotos/leandro-1', '/fotos/leandro-2'],
            focus: '50% 12%',
            alt: 'Leandro, de recursos humanos da Nexxus, em retrato de estúdio',
            cargo: '',
            instagram: '',
          },
        ],
      },
      {
        setor: 'Financeiro',
        slug: 'financeiro',
        membros: [
          {
            nome: 'Lavínia',
            slug: 'lavinia',
            fotos: ['/fotos/lavinia-1', '/fotos/lavinia-2'],
            focus: '55% 12%',
            alt: 'Lavínia, do financeiro da Nexxus, em retrato de estúdio',
            cargo: '',
            instagram: '',
          },
        ],
      },
      {
        setor: 'Marketing Interno',
        slug: 'marketing-interno',
        membros: [
          {
            nome: 'Lucas',
            slug: 'lucas',
            fotos: ['/fotos/lucas-1'],
            focus: '50% 25%',
            alt: 'Lucas, do marketing interno da Nexxus, em retrato',
            cargo: '',
            instagram: '',
          },
        ],
      },
      {
        setor: 'Área Técnica',
        slug: 'area-tecnica',
        membros: [
          {
            nome: 'Ana',
            slug: 'ana',
            fotos: ['/fotos/ana-1', '/fotos/ana-2'],
            focus: '55% 15%',
            alt: 'Ana, da área técnica da Nexxus, em retrato de estúdio',
            cargo: '',
            instagram: '',
          },
          {
            nome: 'Otávio',
            slug: 'otavio',
            fotos: ['/fotos/otavio-1', '/fotos/otavio-2'],
            focus: '50% 15%',
            alt: 'Otávio, da área técnica da Nexxus, em retrato de estúdio',
            cargo: '',
            instagram: '',
          },
          {
            nome: 'Kauã',
            slug: 'kaua',
            fotos: ['/fotos/kaua-1', '/fotos/kaua-2'],
            focus: '50% 15%',
            alt: 'Kauã, da área técnica da Nexxus, em retrato de estúdio',
            cargo: '',
            instagram: '',
          },
          {
            nome: 'Luan',
            slug: 'luan',
            fotos: ['/fotos/luan-1', '/fotos/luan-2'],
            focus: '50% 12%',
            alt: 'Luan, da área técnica da Nexxus, em retrato de estúdio',
            cargo: '',
            instagram: '',
          },
          {
            nome: 'Kamilly',
            slug: 'kamilly',
            fotos: ['/fotos/kamilly-1'],
            focus: '50% 18%',
            alt: 'Kamilly, da área técnica da Nexxus, em retrato',
            cargo: '',
            instagram: '',
          },
        ],
      },
    ],
  },
  join: {
    kicker: 'a mesa ainda tem cadeira sobrando',
    title: 'Quer ser a 12ª noz?',
    lead:
      'A gente abre processo seletivo para estudantes da FURB e vive de olho em gente boa. Se você chegou até aqui rolando a página inteira, já é um bom sinal.',
    cta: { label: 'chama a gente', to: '/#orcamento' },
  },
}
```

- [ ] **Step 4: Verificar o data contra os arquivos em disco**

O data é ESM puro, então o Node importa direto — isso checa de uma vez a contagem de membros e a existência de cada arquivo referenciado.

```bash
cd "código" && node --input-type=module -e "
import { equipe, team } from './src/data/content.js'
import { existsSync } from 'node:fs'

const setores = equipe.roster.setores
const membros = setores.flatMap((s) => s.membros)
console.log('setores:', setores.length, '| membros:', membros.length)

const bases = [
  team.photo.base,
  ...equipe.mosaic.map((m) => m.base),
]
const faltando = []
for (const b of bases) for (const w of [900, 1600]) {
  if (!existsSync('public' + b + '-' + w + '.webp')) faltando.push(b + '-' + w)
}
for (const m of membros) for (const f of m.fotos) for (const w of [640, 1200]) {
  if (!existsSync('public' + f + '-' + w + '.webp')) faltando.push(f + '-' + w)
}
console.log('arquivos faltando:', faltando.length ? faltando : 'nenhum')
"
```

Esperado: `setores: 7 | membros: 11` e `arquivos faltando: nenhum`.

- [ ] **Step 5: Lint e build**

```bash
cd "código" && npm run lint && npm run build
```

Esperado: sem erro. O build ainda passa mesmo com `Team.jsx` usando `team.areas`? **Não** — `Team.jsx` referencia `team.areas` e `team.namesNote`, que acabaram de sumir. O build do Vite não quebra (é acesso a propriedade `undefined`), mas o `.map` de `areas` lança em runtime. A Tarefa 5 corrige; até lá a Home fica quebrada. Se preferir manter a árvore sempre executável, faça as Tarefas 4 e 5 num mesmo commit.

- [ ] **Step 6: Commit**

```bash
git add "código/src/data/content.js"
git commit -m "feat: dados dos 11 integrantes e do bloco-manifesto da Home"
```

---

### Task 5: Bloco-manifesto na Home

**Files:**
- Modify: `código/src/components/sections/Team/Team.jsx` (reescrita completa)
- Modify: `código/src/components/sections/Team/Team.module.css` (reescrita completa)

**Interfaces:**
- Consumes: `team` (Tarefa 4), `<TextCta to>` (Tarefa 3).
- Produces: a seção `#nozes` da Home com um único `<img>` e um link para `/equipe`. A Tarefa 10 verifica exatamente isso.

- [ ] **Step 1: Reescrever o componente**

Substituir todo o conteúdo de `código/src/components/sections/Team/Team.jsx`:

```jsx
import { team } from '../../../data/content'
import useParallax from '../../../hooks/useParallax'
import useReveal from '../../../hooks/useReveal'
import RevealText from '../../ui/RevealText'
import TextCta from '../../ui/TextCta'
import styles from './Team.module.css'

/*
 * Bloco People no padrão da referência de estrutura: statement contido, uma
 * foto e o CTA para a subpágina. Sem inventário de setores — eles são os
 * capítulos do roster em /equipe.
 */
export default function Team() {
  const ref = useReveal({ threshold: 0.2 })
  const fotoRef = useParallax(0.9)

  return (
    <section id="nozes" className="section" data-theme="navy" ref={ref}>
      <div className="container">
        <div className="section-head">
          <p className="micro reveal" style={{ '--i': 0 }}>
            {team.kicker}
          </p>
          <RevealText as="h2" lines={[team.title]} startIndex={1} />
        </div>
        <div className={styles.corpo}>
          <div className={styles.statement}>
            {team.statement.map((paragrafo, i) => (
              <p key={paragrafo} className="reveal" style={{ '--i': i + 2 }}>
                {paragrafo}
              </p>
            ))}
            <TextCta
              to={team.cta.to}
              className={`${styles.cta} reveal`}
              style={{ '--i': 4 }}
              data-cursor="conhecer"
            >
              {team.cta.label}
            </TextCta>
          </div>
          <figure className={`${styles.figura} reveal reveal-tilt`} style={{ '--i': 3 }}>
            <div className={styles.moldura}>
              <img
                ref={fotoRef}
                className={styles.foto}
                src={`${team.photo.base}-1600.webp`}
                srcSet={`${team.photo.base}-900.webp 900w, ${team.photo.base}-1600.webp 1600w`}
                sizes="(max-width: 900px) 92vw, 55vw"
                alt={team.photo.alt}
                loading="lazy"
                decoding="async"
              />
            </div>
          </figure>
        </div>
      </div>
    </section>
  )
}
```

Por que o statement usa `.reveal` e não `.mask-line`: a máscara anima uma linha inteira dentro de `overflow: hidden` e depende de quebras fixas. Num parágrafo que reflui, ela corta descendentes e anima o bloco todo como se fosse uma linha só. A máscara fica no título (linha única, via `RevealText`), que é onde a referência a usa.

- [ ] **Step 2: Reescrever o CSS**

Substituir todo o conteúdo de `código/src/components/sections/Team/Team.module.css`:

```css
.corpo {
  display: grid;
  grid-template-columns: minmax(0, 0.85fr) minmax(0, 1.15fr);
  gap: clamp(2rem, 6vw, 5rem);
  align-items: center;
}

.statement {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  max-width: 46ch;
}

.statement p {
  font-size: clamp(1.125rem, 1.6vw, 1.5rem);
  line-height: 1.4;
}

.statement p:first-child {
  color: var(--accent);
}

.cta {
  margin-top: 1rem;
  align-self: flex-start;
}

.figura {
  margin: 0;
}

/* A moldura reserva a proporção (CLS zero) e recorta o parallax da foto */
.moldura {
  position: relative;
  overflow: hidden;
  aspect-ratio: 3 / 2;
  background: rgb(255 255 255 / 6%);
}

.foto {
  position: absolute;
  inset: -6% 0;
  width: 100%;
  height: 112%;
  object-fit: cover;
}

@media (max-width: 900px) {
  .corpo {
    grid-template-columns: minmax(0, 1fr);
  }
}
```

A folga de `-6%`/`112%` existe para o deslocamento do parallax não abrir vão nas bordas da moldura.

- [ ] **Step 3: Lint e build**

```bash
cd "código" && npm run lint && npm run build
```

Esperado: sem erro nem warning.

- [ ] **Step 4: Verificar a seção no preview**

```bash
cd "código" && npm run preview &
sleep 3
curl -s http://localhost:4173/fotos/equipe/time-h1-1600.webp -o /dev/null -w "foto da home: %{http_code}\n"
kill %1
```

Esperado: `foto da home: 200`.

- [ ] **Step 5: Commit**

```bash
git add "código/src/components/sections/Team"
git commit -m "feat: bloco-manifesto das Nozes na Home com foto e CTA"
```

---

### Task 6: MemberCard

**Files:**
- Create: `código/src/components/ui/MemberCard.jsx`
- Create: `código/src/components/ui/MemberCard.module.css`

**Interfaces:**
- Consumes: o tipo `Membro` (Tarefa 4), `pad2` de `utils/format`.
- Produces: `<MemberCard membro={m} setor="Vendas" numero={3} dense={false} />` — renderiza um `<li>` com `data-membro={membro.slug}`, o atributo que a Tarefa 10 conta para provar que os 11 estão na página.

- [ ] **Step 1: Criar o componente**

Criar `código/src/components/ui/MemberCard.jsx`:

```jsx
import { pad2 } from '../../utils/format'
import styles from './MemberCard.module.css'

/*
 * Card do integrante no padrão-assinatura da referência de estrutura: o nome
 * é quebrado ao redor da foto. Ímpares alinham à esquerda (NOME · foto ·
 * SETOR); pares vão para a direita e invertem a ordem. Quem tem duas fotos
 * troca a imagem no hover — o equivalente ao vídeo-no-hover dos cards do Büro.
 *
 * Não é link: não existe página por integrante, então o card é conteúdo.
 * A troca é 100% CSS (:hover/:focus-within) — sem estado, sem re-render.
 */
export default function MemberCard({ membro, setor, numero, dense = false }) {
  const troca = membro.fotos.length > 1
  /* No modo denso o setor já é o título do capítulo; repeti-lo em cinco
     cards seguidos é ruído. Cargo nominal, quando existir, sempre aparece. */
  const rotulo = membro.cargo || (dense ? '' : setor)

  return (
    <li
      className={styles.card}
      data-membro={membro.slug}
      data-invertido={!dense && numero % 2 === 0 ? '' : undefined}
      data-denso={dense ? '' : undefined}
      data-troca={troca ? '' : undefined}
    >
      <span className={`micro ${styles.num}`}>{pad2(numero)}</span>
      <h4 className={styles.nome}>{membro.nome}</h4>
      <figure className={styles.moldura}>
        {membro.fotos.map((base, i) => (
          <img
            key={base}
            className={styles.foto}
            src={`${base}-1200.webp`}
            srcSet={`${base}-640.webp 640w, ${base}-1200.webp 1200w`}
            sizes="(max-width: 760px) 60vw, 22vw"
            style={{ objectPosition: membro.focus }}
            alt={i === 0 ? membro.alt : ''}
            aria-hidden={i > 0 ? 'true' : undefined}
            loading="lazy"
            decoding="async"
          />
        ))}
      </figure>
      {rotulo ? <p className={`micro ${styles.setor}`}>{rotulo}</p> : null}
    </li>
  )
}
```

- [ ] **Step 2: Criar o CSS**

Criar `código/src/components/ui/MemberCard.module.css`:

```css
.card {
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
  align-items: center;
  gap: clamp(0.75rem, 2.5vw, 2rem);
  width: min(100%, 62rem);
  padding-block: clamp(1.5rem, 4vw, 3rem);
}

.num {
  grid-column: 1 / -1;
  color: var(--accent);
}

.nome {
  grid-column: 1;
  justify-self: end;
  text-align: right;
  font-size: clamp(1.75rem, 5vw, 4rem);
  font-weight: 700;
  line-height: 0.95;
  letter-spacing: -0.02em;
  text-transform: uppercase;
}

.moldura {
  grid-column: 2;
  position: relative;
  overflow: hidden;
  margin: 0;
  width: clamp(8rem, 18vw, 15rem);
  aspect-ratio: 3 / 4;
  background: rgb(19 39 92 / 8%);
}

.setor {
  grid-column: 3;
  justify-self: start;
  text-align: left;
  color: var(--muted);
}

/* Ritmo assimétrico: o card par migra para a direita e espelha a ordem */
.card[data-invertido] {
  margin-left: auto;
}

.card[data-invertido] .num {
  text-align: right;
}

.card[data-invertido] .nome {
  grid-column: 3;
  justify-self: start;
  text-align: left;
}

.card[data-invertido] .setor {
  grid-column: 1;
  justify-self: end;
  text-align: right;
}

.foto {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition:
    opacity var(--dur-micro) var(--ease-standard),
    transform 600ms var(--ease-expo);
}

.foto + .foto {
  opacity: 0;
}

.card:hover .foto,
.card:focus-within .foto {
  transform: scale(1.04);
}

/* Só troca quem tem segunda foto — sem o guarda, Kamilly e Lucas sumiriam */
.card[data-troca]:hover .foto:first-child,
.card[data-troca]:focus-within .foto:first-child {
  opacity: 0;
}

.card[data-troca]:hover .foto + .foto,
.card[data-troca]:focus-within .foto + .foto {
  opacity: 1;
}

/* Bloco denso (Área Técnica): card vertical, nome menor, sem rótulo repetido */
.card[data-denso] {
  grid-template-columns: minmax(0, 1fr);
  width: 100%;
  margin: 0;
  gap: 0.75rem;
  justify-items: start;
  padding-block: 0;
}

.card[data-denso] .nome {
  grid-column: 1;
  justify-self: start;
  text-align: left;
  font-size: clamp(1.5rem, 2.4vw, 2.25rem);
}

.card[data-denso] .moldura {
  grid-column: 1;
  width: 100%;
}

.card[data-denso] .setor {
  grid-column: 1;
  justify-self: start;
  text-align: left;
}

@media (max-width: 760px) {
  .card,
  .card[data-invertido] {
    grid-template-columns: minmax(0, 1fr);
    width: 100%;
    margin: 0;
    justify-items: start;
  }

  .card .num,
  .card[data-invertido] .num {
    text-align: left;
  }

  .card .nome,
  .card[data-invertido] .nome,
  .card .setor,
  .card[data-invertido] .setor {
    grid-column: 1;
    justify-self: start;
    text-align: left;
  }

  .card .moldura,
  .card[data-invertido] .moldura {
    grid-column: 1;
    width: min(100%, 18rem);
  }
}

@media (prefers-reduced-motion: reduce) {
  .card[data-troca]:hover .foto:first-child,
  .card[data-troca]:focus-within .foto:first-child {
    opacity: 1;
  }

  .card[data-troca]:hover .foto + .foto,
  .card[data-troca]:focus-within .foto + .foto {
    opacity: 0;
  }

  .card:hover .foto,
  .card:focus-within .foto {
    transform: none;
  }
}
```

- [ ] **Step 3: Lint**

```bash
cd "código" && npm run lint
```

Esperado: sem erro. (O componente ainda não é importado por ninguém; o build entra na Tarefa 7.)

- [ ] **Step 4: Commit**

```bash
git add "código/src/components/ui/MemberCard.jsx" "código/src/components/ui/MemberCard.module.css"
git commit -m "feat: card de integrante com nome quebrado ao redor da foto"
```

---

### Task 7: Capítulos por setor (TeamRoster)

**Files:**
- Create: `código/src/components/sections/TeamRoster/TeamRoster.jsx`
- Create: `código/src/components/sections/TeamRoster/TeamRoster.module.css`
- Modify: `código/src/pages/Equipe.jsx` (montar o roster para poder ver)

**Interfaces:**
- Consumes: `equipe.roster` (Tarefa 4), `<MemberCard>` (Tarefa 6).
- Produces: a seção `#lista`, alvo do CTA-âncora do hero (Tarefa 8). Cada capítulo carrega `data-setor={slug}` — a Tarefa 10 conta esses nós para provar os 7 setores.

- [ ] **Step 1: Criar o componente**

Criar `código/src/components/sections/TeamRoster/TeamRoster.jsx`:

```jsx
import { equipe } from '../../../data/content'
import useReveal from '../../../hooks/useReveal'
import MemberCard from '../../ui/MemberCard'
import styles from './TeamRoster.module.css'

/*
 * Um capítulo por setor, com contador cru no rótulo. A numeração dos cards é
 * contínua de 01 a 11 (não reinicia a cada setor), então vem daqui pronta.
 * Setor com mais de uma pessoa entra em bloco denso — é o caso da Área
 * Técnica, cujos cinco integrantes criam variação de andamento na página.
 */
export default function TeamRoster() {
  const ref = useReveal({ threshold: 0.03 })
  let numero = 0

  return (
    <section id="lista" className="section" data-theme="white" ref={ref}>
      <div className="container">
        <div className="section-head">
          <p className="micro reveal" style={{ '--i': 0 }}>
            {equipe.roster.kicker}
          </p>
          <h2 className="reveal" style={{ '--i': 1 }}>
            {equipe.roster.title}
          </h2>
        </div>
        {equipe.roster.setores.map((setor) => {
          const denso = setor.membros.length > 1
          return (
            <section
              key={setor.slug}
              className={styles.capitulo}
              data-setor={setor.slug}
              aria-labelledby={`setor-${setor.slug}`}
            >
              <h3 id={`setor-${setor.slug}`} className={`micro ${styles.rotulo} reveal`}>
                {setor.setor} <span className={styles.contagem}>({setor.membros.length})</span>
              </h3>
              <ul className={denso ? styles.denso : styles.fluxo}>
                {setor.membros.map((membro) => {
                  numero += 1
                  return (
                    <MemberCard
                      key={membro.slug}
                      membro={membro}
                      setor={setor.setor}
                      numero={numero}
                      dense={denso}
                    />
                  )
                })}
              </ul>
            </section>
          )
        })}
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Criar o CSS**

Criar `código/src/components/sections/TeamRoster/TeamRoster.module.css`:

```css
.capitulo {
  border-top: 1px solid var(--line);
  padding-top: 1rem;
}

.capitulo + .capitulo {
  margin-top: clamp(2.5rem, 6vw, 5rem);
}

.rotulo {
  color: var(--muted);
}

.contagem {
  color: var(--accent);
  font-variant-numeric: tabular-nums;
}

.fluxo {
  display: block;
}

.denso {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: clamp(1.5rem, 4vw, 3rem);
  margin-top: clamp(1.5rem, 4vw, 2.5rem);
}

@media (max-width: 1000px) {
  .denso {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 620px) {
  .denso {
    grid-template-columns: minmax(0, 1fr);
  }
}
```

- [ ] **Step 3: Montar o roster na página**

Substituir todo o conteúdo de `código/src/pages/Equipe.jsx` (ainda provisório — a Tarefa 9 fecha a página):

```jsx
import TeamRoster from '../components/sections/TeamRoster/TeamRoster'

export default function Equipe() {
  return <TeamRoster />
}
```

- [ ] **Step 4: Lint e build**

```bash
cd "código" && npm run lint && npm run build
```

Esperado: sem erro nem warning.

- [ ] **Step 5: Conferir a contagem no HTML gerado em runtime**

```bash
cd "código" && npm run preview &
sleep 3
curl -s -o /dev/null -w "kamilly 1200: %{http_code}\n" http://localhost:4173/fotos/kamilly-1-1200.webp
curl -s -o /dev/null -w "otavio 640:  %{http_code}\n" http://localhost:4173/fotos/otavio-2-640.webp
kill %1
```

Esperado: `200` nas duas. A contagem de 11 cards renderizados é verificada na Tarefa 10, que executa o JS.

- [ ] **Step 6: Commit**

```bash
git add "código/src/components/sections/TeamRoster" "código/src/pages/Equipe.jsx"
git commit -m "feat: capítulos por setor com os 11 integrantes"
```

---

### Task 8: Hero da subpágina (TeamHero)

**Files:**
- Create: `código/src/components/sections/TeamHero/TeamHero.jsx`
- Create: `código/src/components/sections/TeamHero/TeamHero.module.css`
- Modify: `código/src/pages/Equipe.jsx`

**Interfaces:**
- Consumes: `equipe.hero` e `equipe.mosaic` (Tarefa 4), `useCountUp`, `useParallax`, `RevealText`, `TextCta`.
- Produces: o primeiro capítulo da `/equipe`, com CTA-âncora para `#lista` (Tarefa 7).

- [ ] **Step 1: Criar o componente**

Criar `código/src/components/sections/TeamHero/TeamHero.jsx`:

```jsx
import { equipe } from '../../../data/content'
import useCountUp from '../../../hooks/useCountUp'
import useParallax from '../../../hooks/useParallax'
import useReveal from '../../../hooks/useReveal'
import RevealText from '../../ui/RevealText'
import TextCta from '../../ui/TextCta'
import styles from './TeamHero.module.css'

/* Contador cru no padrão da referência: o número exposto como elemento gráfico */
function Contador({ value, label }) {
  const [ref, atual] = useCountUp(value)
  return (
    <p ref={ref} className={styles.contador}>
      {label} <span>({atual})</span>
    </p>
  )
}

/* Cada item precisa da própria chamada de hook — daí o componente separado */
function ItemMosaico({ item, index }) {
  const fotoRef = useParallax(index % 2 ? 0.94 : 0.88)
  return (
    <li
      className={`${styles.item} reveal reveal-tilt`}
      data-orientacao={item.orientacao}
      style={{ '--i': index }}
    >
      <img
        ref={fotoRef}
        className={styles.foto}
        src={`${item.base}-1600.webp`}
        srcSet={`${item.base}-900.webp 900w, ${item.base}-1600.webp 1600w`}
        sizes="(max-width: 760px) 92vw, 45vw"
        alt={item.alt}
        loading={index < 2 ? 'eager' : 'lazy'}
        decoding="async"
      />
    </li>
  )
}

export default function TeamHero() {
  const ref = useReveal({ threshold: 0.05 })
  const { hero, mosaic } = equipe

  return (
    <section className={`section ${styles.hero}`} data-theme="navy" ref={ref}>
      <div className="container">
        <p className="micro reveal" style={{ '--i': 0 }}>
          {hero.kicker}
        </p>
        <RevealText as="h1" lines={hero.titleLines} split="chars" startIndex={1} />
        <p className={`${styles.lead} reveal`} style={{ '--i': 2 }}>
          {hero.lead}
        </p>
        <div className={`${styles.meta} reveal`} style={{ '--i': 3 }}>
          <Contador value={hero.counter.value} label={hero.counter.label} />
          <TextCta href={hero.cta.href} glyph="↓">
            {hero.cta.label}
          </TextCta>
        </div>
        <ul className={styles.mosaico}>
          {mosaic.map((item, i) => (
            <ItemMosaico key={item.base} item={item} index={i} />
          ))}
        </ul>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Criar o CSS**

Criar `código/src/components/sections/TeamHero/TeamHero.module.css`:

```css
/* Primeiro capítulo da rota: precisa de respiro para o header fixo */
.hero {
  padding-top: calc(var(--header-h) + clamp(3rem, 10vw, 8rem));
}

.lead {
  max-width: 52ch;
  margin-top: clamp(1.5rem, 3vw, 2.5rem);
  font-size: clamp(1.05rem, 1.4vw, 1.35rem);
  color: var(--muted);
}

.meta {
  display: flex;
  flex-wrap: wrap;
  align-items: baseline;
  gap: clamp(1rem, 4vw, 3rem);
  margin-top: clamp(2rem, 5vw, 3.5rem);
}

.contador {
  font-size: clamp(1.75rem, 4vw, 3rem);
  font-weight: 600;
  letter-spacing: -0.02em;
  text-transform: lowercase;
}

.contador span {
  color: var(--accent);
  font-variant-numeric: tabular-nums;
}

/*
 * Grade de 6 colunas: as duas horizontais ocupam 3 cada (uma linha),
 * as três verticais ocupam 2 cada (linha seguinte). Ritmo assimétrico
 * pelo deslocamento vertical dos ímpares, não por tamanhos aleatórios.
 */
.mosaico {
  display: grid;
  grid-template-columns: repeat(6, minmax(0, 1fr));
  gap: clamp(0.75rem, 2vw, 1.5rem);
  margin-top: clamp(3rem, 8vw, 6rem);
}

.item {
  position: relative;
  overflow: hidden;
  background: rgb(255 255 255 / 6%);
}

.item[data-orientacao='h'] {
  grid-column: span 3;
  aspect-ratio: 3 / 2;
}

.item[data-orientacao='v'] {
  grid-column: span 2;
  aspect-ratio: 2 / 3;
}

.item:nth-child(odd) {
  margin-top: clamp(0.75rem, 3vw, 2.5rem);
}

.foto {
  position: absolute;
  inset: -6% 0;
  width: 100%;
  height: 112%;
  object-fit: cover;
}

@media (max-width: 760px) {
  .mosaico {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .item[data-orientacao='h'] {
    grid-column: span 2;
  }

  .item[data-orientacao='v'] {
    grid-column: span 1;
  }
}
```

- [ ] **Step 3: Montar o hero na página**

Substituir `código/src/pages/Equipe.jsx`:

```jsx
import TeamHero from '../components/sections/TeamHero/TeamHero'
import TeamRoster from '../components/sections/TeamRoster/TeamRoster'

export default function Equipe() {
  return (
    <>
      <TeamHero />
      <TeamRoster />
    </>
  )
}
```

- [ ] **Step 4: Lint e build**

```bash
cd "código" && npm run lint && npm run build
```

Esperado: sem erro nem warning.

- [ ] **Step 5: Commit**

```bash
git add "código/src/components/sections/TeamHero" "código/src/pages/Equipe.jsx"
git commit -m "feat: hero da /equipe com contador cru e mosaico em parallax"
```

---

### Task 9: Cultura, recrutamento e fechamento da página

**Files:**
- Create: `código/src/components/sections/TeamCulture/TeamCulture.jsx` + `.module.css`
- Create: `código/src/components/sections/TeamJoin/TeamJoin.jsx` + `.module.css`
- Create: `código/src/hooks/usePageMeta.js`
- Modify: `código/src/pages/Equipe.jsx`

**Interfaces:**
- Consumes: `equipe.culture`, `equipe.join`, `equipe.meta` (Tarefa 4); `<TextCta to>` (Tarefa 3).
- Produces: a `/equipe` completa, na ordem hero → cultura → roster → recrutamento, com `document.title` próprio.

- [ ] **Step 1: Criar o capítulo de cultura**

Criar `código/src/components/sections/TeamCulture/TeamCulture.jsx`:

```jsx
import { equipe } from '../../../data/content'
import useReveal from '../../../hooks/useReveal'
import RevealText from '../../ui/RevealText'
import styles from './TeamCulture.module.css'

/* Cultura antes da listagem: a página vende o ambiente antes de apresentar gente */
export default function TeamCulture() {
  const ref = useReveal({ threshold: 0.2 })
  const { culture } = equipe

  return (
    <section className="section" data-theme="pistachio" ref={ref}>
      <div className="container">
        <div className="section-head">
          <p className="micro reveal" style={{ '--i': 0 }}>
            {culture.kicker}
          </p>
          <RevealText as="h2" lines={[culture.title]} startIndex={1} />
        </div>
        <div className={styles.texto}>
          {culture.paragraphs.map((paragrafo, i) => (
            <p key={paragrafo} className="reveal" style={{ '--i': i + 2 }}>
              {paragrafo}
            </p>
          ))}
        </div>
      </div>
    </section>
  )
}
```

Criar `código/src/components/sections/TeamCulture/TeamCulture.module.css`:

```css
.texto {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 60ch;
  font-size: clamp(1.05rem, 1.4vw, 1.35rem);
  line-height: 1.55;
}

.texto p:first-child {
  font-size: clamp(1.25rem, 2vw, 1.75rem);
  line-height: 1.35;
}
```

- [ ] **Step 2: Criar o capítulo de recrutamento**

Criar `código/src/components/sections/TeamJoin/TeamJoin.jsx`:

```jsx
import { equipe } from '../../../data/content'
import useReveal from '../../../hooks/useReveal'
import RevealText from '../../ui/RevealText'
import TextCta from '../../ui/TextCta'
import styles from './TeamJoin.module.css'

export default function TeamJoin() {
  const ref = useReveal({ threshold: 0.25 })
  const { join } = equipe

  return (
    <section className="section" data-theme="navy" ref={ref}>
      <div className="container">
        <div className="section-head">
          <p className="micro reveal" style={{ '--i': 0 }}>
            {join.kicker}
          </p>
          <RevealText as="h2" lines={[join.title]} startIndex={1} />
        </div>
        <div className={styles.corpo}>
          <p className={`${styles.lead} reveal`} style={{ '--i': 2 }}>
            {join.lead}
          </p>
          <TextCta to={join.cta.to} className="reveal" style={{ '--i': 3 }} data-cursor="bora?">
            {join.cta.label}
          </TextCta>
        </div>
      </div>
    </section>
  )
}
```

Criar `código/src/components/sections/TeamJoin/TeamJoin.module.css`:

```css
.corpo {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: clamp(1.5rem, 4vw, 2.5rem);
}

.lead {
  max-width: 52ch;
  font-size: clamp(1.05rem, 1.4vw, 1.35rem);
  color: var(--muted);
}
```

- [ ] **Step 3: Criar o hook de meta por rota**

Criar `código/src/hooks/usePageMeta.js`:

```js
import { useEffect } from 'react'

/*
 * Título e description por rota, sem biblioteca de head. Restaura os valores
 * anteriores ao desmontar, então a Home volta ao que está no index.html.
 */
export default function usePageMeta({ title, description }) {
  useEffect(() => {
    const tituloAnterior = document.title
    const tag = document.querySelector('meta[name="description"]')
    const descAnterior = tag?.getAttribute('content')

    if (title) document.title = title
    if (tag && description) tag.setAttribute('content', description)

    return () => {
      document.title = tituloAnterior
      if (tag && descAnterior) tag.setAttribute('content', descAnterior)
    }
  }, [title, description])
}
```

- [ ] **Step 4: Fechar a página**

Substituir todo o conteúdo de `código/src/pages/Equipe.jsx`:

```jsx
import TeamCulture from '../components/sections/TeamCulture/TeamCulture'
import TeamHero from '../components/sections/TeamHero/TeamHero'
import TeamJoin from '../components/sections/TeamJoin/TeamJoin'
import TeamRoster from '../components/sections/TeamRoster/TeamRoster'
import { equipe } from '../data/content'
import usePageMeta from '../hooks/usePageMeta'

export default function Equipe() {
  usePageMeta(equipe.meta)

  return (
    <>
      <TeamHero />
      <TeamCulture />
      <TeamRoster />
      <TeamJoin />
    </>
  )
}
```

- [ ] **Step 5: Lint e build**

```bash
cd "código" && npm run lint && npm run build
```

Esperado: sem erro nem warning.

- [ ] **Step 6: Commit**

```bash
git add "código/src/components/sections/TeamCulture" "código/src/components/sections/TeamJoin" "código/src/hooks/usePageMeta.js" "código/src/pages/Equipe.jsx"
git commit -m "feat: cultura, recrutamento e fechamento da página /equipe"
```

---

### Task 10: Verificação de aceite

**Files:**
- Create: `código/scripts/verificar-equipe.py`

**Interfaces:**
- Consumes: a aplicação construída e servida em `http://localhost:4173`.
- Produces: saída `OK` / `FALHOU` por critério da spec §10.

O projeto não tem test runner, então os critérios de aceite viram um verificador executável que dirige o Chrome por CDP. Node 18 não expõe `WebSocket` global — por isso o driver é em Python, com `websocket-client`.

- [ ] **Step 1: Criar o verificador**

Criar `código/scripts/verificar-equipe.py`:

```python
#!/usr/bin/env python3
"""Verifica os critérios de aceite da seção Equipe contra o build servido.

Uso:
    cd código && npm run build && npm run preview &
    python3 scripts/verificar-equipe.py

Requer websocket-client (pip install websocket-client) e um Chrome/Chromium.
Procura o chrome-headless-shell do cache do Playwright; CHROME_BIN sobrescreve.
"""
import glob
import json
import os
import subprocess
import sys
import time
import urllib.request

import websocket

BASE = os.environ.get("BASE_URL", "http://localhost:4173")
PORTA = 9333


def achar_chrome():
    if os.environ.get("CHROME_BIN"):
        return os.environ["CHROME_BIN"]
    padroes = [
        "~/.cache/ms-playwright/chromium_headless_shell-*/chrome-headless-shell-linux64/chrome-headless-shell",
        "~/.cache/ms-playwright/chromium-*/chrome-linux/chrome",
        "/usr/bin/chromium",
        "/usr/bin/google-chrome",
    ]
    for padrao in padroes:
        achados = sorted(glob.glob(os.path.expanduser(padrao)))
        if achados:
            return achados[-1]
    sys.exit("Chrome não encontrado — defina CHROME_BIN")


class Aba:
    def __init__(self, url_ws):
        self.ws = websocket.create_connection(url_ws, suppress_origin=True)
        self.seq = 0

    def cmd(self, metodo, **params):
        self.seq += 1
        self.ws.send(json.dumps({"id": self.seq, "method": metodo, "params": params}))
        while True:
            msg = json.loads(self.ws.recv())
            if msg.get("id") == self.seq:
                if "error" in msg:
                    raise RuntimeError(msg["error"])
                return msg.get("result", {})

    def ir(self, caminho, espera=3.0):
        self.cmd("Page.navigate", url=BASE + caminho)
        time.sleep(espera)

    def js(self, expressao):
        r = self.cmd(
            "Runtime.evaluate", expression=expressao, returnByValue=True, awaitPromise=True
        )
        return r["result"].get("value")


def esperar_devtools(tempo=10):
    limite = time.time() + tempo
    while time.time() < limite:
        try:
            with urllib.request.urlopen(f"http://127.0.0.1:{PORTA}/json/version") as r:
                return json.load(r)
        except Exception:
            time.sleep(0.3)
    sys.exit("DevTools não subiu")


def main():
    chrome = achar_chrome()
    proc = subprocess.Popen(
        [
            chrome,
            f"--remote-debugging-port={PORTA}",
            "--remote-allow-origins=*",
            "--no-sandbox",
            "--disable-gpu",
            "--window-size=1440,900",
            "about:blank",
        ],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )
    try:
        esperar_devtools()
        req = urllib.request.Request(
            f"http://127.0.0.1:{PORTA}/json/new?about:blank", method="PUT"
        )
        with urllib.request.urlopen(req) as r:
            alvo = json.load(r)
        aba = Aba(alvo["webSocketDebuggerUrl"])
        aba.cmd("Page.enable")
        aba.cmd("Runtime.enable")

        falhas = []

        def checar(rotulo, condicao, detalhe=""):
            print(f"{'OK    ' if condicao else 'FALHOU'}  {rotulo} {detalhe}")
            if not condicao:
                falhas.append(rotulo)

        # --- Home -------------------------------------------------------
        aba.ir("/", espera=5.0)  # o preloader precisa terminar
        home = aba.js(
            """(() => {
              const s = document.querySelector('#nozes');
              if (!s) return { existe: false };
              return {
                existe: true,
                imgs: s.querySelectorAll('img').length,
                linkEquipe: !!s.querySelector('a[href="/equipe"]'),
                temSetores: /Presid[êe]ncia|Marketing Interno/.test(s.textContent),
                temNamesNote: /papelada/.test(s.textContent),
              };
            })()"""
        )
        checar("§10.8 Home tem a seção #nozes", home and home["existe"])
        checar("§10.8 Home tem exatamente 1 foto", home.get("imgs") == 1, f"(imgs={home.get('imgs')})")
        checar("§10.8 Home aponta para /equipe", home.get("linkEquipe"))
        checar("§10.8 Home sem lista de setores", not home.get("temSetores"))
        checar("§10.8 Home sem namesNote", not home.get("temNamesNote"))

        # --- Navegação client-side para /equipe -------------------------
        aba.js("""document.querySelector('#nozes a[href="/equipe"]').click()""")
        time.sleep(3.5)
        nav = aba.js("({ rota: location.pathname, titulo: document.title })")
        checar("Navegação client-side chega em /equipe", nav["rota"] == "/equipe", f"({nav['rota']})")
        checar("§7.2 título por rota", nav["titulo"].startswith("As Nozes"), f"({nav['titulo']})")

        # --- Conteúdo da /equipe ----------------------------------------
        equipe = aba.js(
            """(() => {
              const membros = [...document.querySelectorAll('[data-membro]')];
              const imgs = [...document.querySelectorAll('img')];
              return {
                membros: membros.length,
                slugs: membros.map((m) => m.dataset.membro),
                setores: document.querySelectorAll('[data-setor]').length,
                imgsQuebradas: imgs.filter((i) => i.complete && i.naturalWidth === 0).length,
                temLista: !!document.querySelector('#lista'),
                stickyAplicado: [...document.querySelectorAll('.section')].every((s) => s.style.top !== ''),
              };
            })()"""
        )
        checar("§10.2 onze integrantes", equipe["membros"] == 11, f"({equipe['membros']})")
        checar("§10.2 sete setores", equipe["setores"] == 7, f"({equipe['setores']})")
        checar("§10.2 nenhuma imagem quebrada", equipe["imgsQuebradas"] == 0)
        checar("§7 âncora #lista existe", equipe["temLista"])
        checar("§10.3 sticky stack recalculado na rota nova", equipe["stickyAplicado"])

        esperados = {
            "julia", "lara", "isis", "leandro", "lavinia", "lucas",
            "ana", "otavio", "kaua", "luan", "kamilly",
        }
        checar(
            "§10.2 todos os slugs presentes",
            set(equipe["slugs"]) == esperados,
            f"(faltando: {sorted(esperados - set(equipe['slugs']))})",
        )

        # --- Carga direta e âncora cross-page ---------------------------
        aba.ir("/equipe", espera=5.0)
        direto = aba.js("({ rota: location.pathname, membros: document.querySelectorAll('[data-membro]').length })")
        checar("§10.4 carga direta de /equipe funciona", direto["membros"] == 11, f"({direto['membros']})")

        aba.ir("/#cases", espera=4.0)
        ancora = aba.js(
            """(() => {
              const el = document.querySelector('#cases');
              if (!el) return { ok: false };
              const t = el.getBoundingClientRect().top;
              return { ok: Math.abs(t) < window.innerHeight * 0.5, top: Math.round(t) };
            })()"""
        )
        checar("§3.3 /#cases rola até a âncora", ancora.get("ok"), f"(top={ancora.get('top')})")

        print()
        if falhas:
            print(f"{len(falhas)} critério(s) falharam:")
            for f in falhas:
                print(f"  - {f}")
            sys.exit(1)
        print("todos os critérios verificados passaram")
    finally:
        proc.terminate()


if __name__ == "__main__":
    main()
```

- [ ] **Step 2: Rodar o verificador**

```bash
cd "código" && npm run build && (npm run preview &) && sleep 4 && python3 scripts/verificar-equipe.py; pkill -f "vite preview"
```

Esperado: todas as linhas com `OK` e a mensagem final `todos os critérios verificados passaram`.

Se `import websocket` falhar: `pip install --user websocket-client`.

- [ ] **Step 3: Conferir os critérios que o script não cobre**

```bash
du -sh "código/public/fotos"
grep -c "prefers-reduced-motion" "código/src/components/ui/MemberCard.module.css"
```

Esperado: peso **abaixo de 6 MB** (§10.5) e `1` — a regra que desliga a troca de foto sob movimento reduzido (§10.7).

O critério §10.6 (hover com duas fotos troca; Kamilly e Lucas não piscam) é visual: abrir `http://localhost:4173/equipe` e passar o mouse sobre um card com duas fotos e sobre o do Lucas.

- [ ] **Step 4: Commit**

```bash
git add "código/scripts/verificar-equipe.py"
git commit -m "test: verificador headless dos critérios de aceite da seção Equipe"
```

---

## Notas de revisão do plano

Conferido contra a spec, seção a seção:

- **§3.1 hooks com chave de rota** → Tarefa 2, passos 3 e 8. `useLenis` deliberadamente sem chave.
- **§3.2 ScrollManager** → Tarefa 2, passo 4. Verificado na Tarefa 10 (`/#cases`).
- **§3.3 âncoras cross-page** → Tarefa 3. O `AnchorLink` substituiu o `anchorHref.js` previsto na spec: um componente resolve o caso inteiro, enquanto o util deixaria cada consumidor montando o `<a>`/`<Link>` na mão. Desvio deliberado, mesmo comportamento.
- **§3.4 fallback SPA** → Tarefa 2, passo 9; verificado na Tarefa 10 (carga direta).
- **§4 pipeline de fotos** → Tarefa 1, com verificação de contagem, peso, rotação e cobertura dos 11.
- **§5 modelo de dados** → Tarefa 4, com checagem por Node de que todo caminho referenciado existe em disco.
- **§6 bloco da Home** → Tarefa 5. Único desvio: statement com `.reveal` em vez de `.mask-line`, justificado no passo 1 (máscara em texto que reflui corta descendentes).
- **§7 quatro capítulos** → Tarefas 7, 8 e 9.
- **§7.1 MemberCard** → Tarefa 6, incluindo o guarda `data-troca` para os dois integrantes com foto única.
- **§7.2 head por rota** → Tarefa 9, `usePageMeta`.
- **§8 motion e acessibilidade** → distribuído; `loading`/`decoding`, `aria-hidden` na 2ª foto, `aria-labelledby` nos capítulos e o bloco `prefers-reduced-motion` estão nos componentes correspondentes.
- **§10 critérios de aceite** → Tarefa 10 cobre 1–4 e 8 automaticamente; 5 e 7 por comando; 6 é inspeção visual.

Dependência entre tarefas: 1 → 4 (caminhos), 2 → 3 e 9 (rotas), 4 → 5, 6, 7, 8, 9 (data), 6 → 7 (card). A Tarefa 4 quebra a Home em runtime até a Tarefa 5 entrar; se preferir a árvore sempre executável, comitar 4 e 5 juntas.
