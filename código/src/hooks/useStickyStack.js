import { useEffect } from 'react'

/*
 * Calcula o top sticky de cada .section: seções mais altas que o viewport
 * recebem top negativo para rolarem por inteiro antes de fixar e serem
 * cobertas pela seção seguinte (efeito match-cut). O ResizeObserver cobre
 * mudanças de altura (accordion, imagens, resize).
 */
export default function useStickyStack(routeKey = '') {
  useEffect(() => {
    /* routeKey só existe como dependência: trocar de rota troca as .section
       da página e exige recalcular todos os tops do sticky stack. */
    void routeKey
    const sections = Array.from(document.querySelectorAll('.section'))
    if (!sections.length) return undefined
    let raf = 0
    const apply = () => {
      raf = 0
      sections.forEach((s) => {
        s.style.top = `${Math.min(0, window.innerHeight - s.offsetHeight)}px`
      })
    }
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(apply)
    }
    apply()
    const ro = new ResizeObserver(schedule)
    sections.forEach((s) => ro.observe(s))
    window.addEventListener('resize', schedule)
    return () => {
      ro.disconnect()
      window.removeEventListener('resize', schedule)
      cancelAnimationFrame(raf)
    }
  }, [routeKey])
}
