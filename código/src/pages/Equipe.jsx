import CarouselCultura from '../components/sections/CarouselCultura/CarouselCultura'
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
      <CarouselCultura />
      <TeamRoster />
      <TeamJoin />
    </>
  )
}
