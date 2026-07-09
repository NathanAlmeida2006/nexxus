import { useEffect, useRef } from 'react'

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
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.style.setProperty('--entry', '1')
      return undefined
    }
    let raf = 0
    const update = () => {
      raf = 0
      const top = el.getBoundingClientRect().top
      const p = Math.min(1, Math.max(0, 1 - top / window.innerHeight))
      el.style.setProperty('--entry', easeInOutCubic(p).toFixed(4))
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [])

  return ref
}
