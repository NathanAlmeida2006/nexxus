import { useEffect, useRef } from 'react'

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
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined
    const parent = el.parentElement ?? el
    let raf = 0
    const update = () => {
      raf = 0
      const rect = parent.getBoundingClientRect()
      const delta = rect.top + rect.height / 2 - window.innerHeight / 2
      const y = (delta * (1 - factor)).toFixed(2)
      const r = rotate ? ` rotate(${(delta * rotate).toFixed(2)}deg)` : ''
      el.style.transform = `translate3d(0, ${y}px, 0)${r}`
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
  }, [factor, rotate])

  return ref
}
