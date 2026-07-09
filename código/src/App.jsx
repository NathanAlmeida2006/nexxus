import { useState } from 'react'
import Footer from './components/layout/Footer/Footer'
import Header from './components/layout/Header/Header'
import Cases from './components/sections/Cases/Cases'
import Faq from './components/sections/Faq/Faq'
import Globe from './components/sections/Globe/Globe'
import Hero from './components/sections/Hero/Hero'
import LeadForm from './components/sections/LeadForm/LeadForm'
import Manifesto from './components/sections/Manifesto/Manifesto'
import Preloader from './components/sections/Preloader/Preloader'
import Services from './components/sections/Services/Services'
import Stats from './components/sections/Stats/Stats'
import Team from './components/sections/Team/Team'
import Cursor from './components/ui/Cursor'
import { RevealGate } from './hooks/RevealGate'
import useLenis from './hooks/useLenis'
import useSectionDepart from './hooks/useSectionDepart'
import useStickyStack from './hooks/useStickyStack'

export default function App() {
  const [ready, setReady] = useState(false)
  useLenis()
  useStickyStack()
  useSectionDepart()

  return (
    <RevealGate.Provider value={ready}>
      <a className="skip-link" href="#conteudo">
        Pular para o conteúdo
      </a>
      {!ready && <Preloader onDone={() => setReady(true)} />}
      <Cursor />
      <Header />
      <main id="conteudo">
        <Hero />
        <Stats />
        <Cases />
        <Manifesto />
        <Services />
        <Team />
        <Faq />
        <LeadForm />
        <Globe />
      </main>
      <Footer />
    </RevealGate.Provider>
  )
}
