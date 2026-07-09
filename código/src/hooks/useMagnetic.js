import { useEffect, useRef } from 'react'
import { hasFinePointer, prefersReducedMotion } from '../utils/media'

/*
 * Efeito magnético: o elemento acompanha o cursor dentro da própria área
 * e volta com mola ao sair. Só em ponteiros finos e sem reduced motion.
 * O consumidor deve ter `transition: transform` no CSS para o retorno suave.
 */
export default function useMagnetic(strength = 0.25) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return undefined
    if (!hasFinePointer()) return undefined
    if (prefersReducedMotion()) return undefined

    const onMove = (e) => {
      const r = el.getBoundingClientRect()
      const dx = e.clientX - (r.left + r.width / 2)
      const dy = e.clientY - (r.top + r.height / 2)
      el.style.transform = `translate(${(dx * strength).toFixed(1)}px, ${(dy * strength).toFixed(1)}px)`
    }
    const onLeave = () => {
      el.style.transform = ''
    }
    el.addEventListener('mousemove', onMove)
    el.addEventListener('mouseleave', onLeave)
    return () => {
      el.removeEventListener('mousemove', onMove)
      el.removeEventListener('mouseleave', onLeave)
      el.style.transform = ''
    }
  }, [strength])

  return ref
}
