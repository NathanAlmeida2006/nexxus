import { useEffect, useRef } from 'react'
import { prefersReducedMotion } from '../utils/media'
import listenScrollRaf from '../utils/rafScroll'

/*
 * Parallax sutil (fator 0.85–0.95; acima de 1 inverte o sentido, para
 * parallax interno de mídia). `rotate` adiciona rotação proporcional ao
 * deslocamento. Mede o pai — que não sofre transform — para evitar
 * retroalimentação do próprio deslocamento.
 */
export default function useParallax(factor = 0.9, { rotate = 0 } = {}) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return undefined
    if (prefersReducedMotion()) return undefined
    const parent = el.parentElement ?? el
    return listenScrollRaf(() => {
      const rect = parent.getBoundingClientRect()
      const delta = rect.top + rect.height / 2 - window.innerHeight / 2
      const y = (delta * (1 - factor)).toFixed(2)
      const r = rotate ? ` rotate(${(delta * rotate).toFixed(2)}deg)` : ''
      el.style.transform = `translate3d(0, ${y}px, 0)${r}`
    })
  }, [factor, rotate])

  return ref
}
