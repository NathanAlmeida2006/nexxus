import { useContext, useEffect, useRef } from 'react'
import { RevealGate } from './RevealGate'

/*
 * Marca o elemento com data-inview quando entra no viewport.
 * O CSS (.reveal / .mask-line em base.css) cuida da animação com stagger.
 */
export default function useReveal({ threshold = 0.15, rootMargin = '0px 0px -8% 0px', once = true } = {}) {
  const ref = useRef(null)
  const enabled = useContext(RevealGate)

  useEffect(() => {
    const el = ref.current
    if (!el || !enabled) return undefined
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.dataset.inview = 'true'
          if (once) io.disconnect()
        } else if (!once) {
          el.dataset.inview = 'false'
        }
      },
      { threshold, rootMargin },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [enabled, threshold, rootMargin, once])

  return ref
}
