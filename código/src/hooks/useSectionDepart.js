import { useEffect } from 'react'
import { prefersReducedMotion } from '../utils/media'
import listenScrollRaf, { setCssVar } from '../utils/rafScroll'

/*
 * Fade-out de capítulo: mede quanto a seção seguinte já cobriu a atual
 * (sticky stack) e expõe --depart 0 → 1 na coberta. O CSS (.section > *
 * em base.css) consome o valor para recuar/apagar o conteúdo — contínuo,
 * dirigido pelo scroll e reversível ao voltar.
 */
export default function useSectionDepart(routeKey = '') {
  useEffect(() => {
    void routeKey
    if (prefersReducedMotion()) return undefined
    const sections = Array.from(document.querySelectorAll('.section'))
    if (sections.length < 2) return undefined
    return listenScrollRaf(() => {
      const vh = window.innerHeight
      sections.forEach((section, i) => {
        const next = sections[i + 1]
        if (!next) return
        const p = Math.min(1, Math.max(0, 1 - next.getBoundingClientRect().top / vh))
        setCssVar(section, '--depart', p.toFixed(4))
      })
    })
  }, [routeKey])
}
