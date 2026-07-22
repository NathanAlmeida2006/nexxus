import { useEffect, useRef } from 'react'
import { prefersReducedMotion } from '../utils/media'
import listenScrollRaf from '../utils/rafScroll'

/*
 * Parallax sutil (fator 0.85–0.95; acima de 1 inverte o sentido, para
 * parallax interno de mídia). `rotate` adiciona rotação proporcional ao
 * deslocamento. Mede o pai — que não sofre transform — para evitar
 * retroalimentação do próprio deslocamento.
 */
export default function useParallax(factor = 0.9, { rotate = 0, clamp = 0.06 } = {}) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return undefined
    if (prefersReducedMotion()) return undefined
    const parent = el.parentElement ?? el
    return listenScrollRaf(() => {
      const rect = parent.getBoundingClientRect()
      const delta = rect.top + rect.height / 2 - window.innerHeight / 2
      const rawY = delta * (1 - factor)
      /*
       * O deslocamento bruto escala com a altura do viewport (via `delta`,
       * que depende de window.innerHeight), mas a folga que o CSS reserva
       * para o parallax não abrir vão nas bordas (ex.: inset: -6%) é uma
       * porcentagem da altura do próprio elemento pai. As duas grandezas
       * são independentes: em molduras baixas relativas ao viewport, o
       * deslocamento bruto pode superar a folga do CSS e expor o fundo da
       * moldura. Por isso limitamos (clamp) o deslocamento a `clamp` da
       * altura do pai — o mesmo valor da folga do CSS (padrão 6%, igual ao
       * `inset: -6%` usado nas molduras) — preservando o sinal.
       */
      const maxY = rect.height * clamp
      const y = Math.max(-maxY, Math.min(maxY, rawY)).toFixed(2)
      const r = rotate ? ` rotate(${(delta * rotate).toFixed(2)}deg)` : ''
      el.style.transform = `translate3d(0, ${y}px, 0)${r}`
    })
  }, [factor, rotate, clamp])

  return ref
}
