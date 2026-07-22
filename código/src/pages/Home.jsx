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
