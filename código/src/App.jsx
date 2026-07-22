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
