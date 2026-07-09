import { useEffect, useRef } from 'react'
import { prefersReducedMotion } from '../utils/media'
import listenScrollRaf, { setCssVar } from '../utils/rafScroll'

/*
 * Progresso de entrada da seção (0 → 1) enquanto o topo dela viaja do rodapé
 * ao topo do viewport, exposto como --entry no próprio elemento. A curva
 * ease-in-out é aplicada aqui para dar peso cinematográfico à revelação
 * (o CSS consome o valor já easado — ex.: o arco do Manifesto).
 */
const easeInOutCubic = (t) => (t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2)

export default function useEntryProgress() {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return undefined
    if (prefersReducedMotion()) {
      el.style.setProperty('--entry', '1')
      return undefined
    }
    return listenScrollRaf(() => {
      const top = el.getBoundingClientRect().top
      const p = Math.min(1, Math.max(0, 1 - top / window.innerHeight))
      setCssVar(el, '--entry', easeInOutCubic(p).toFixed(4))
    })
  }, [])

  return ref
}
