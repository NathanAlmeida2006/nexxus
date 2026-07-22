import { useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { getLenis, scrollToId } from '../../hooks/useLenis'

/*
 * Scroll ligado à troca de rota. Sobe ao topo antes da pintura (senão a
 * página nova aparece na altura de rolagem da anterior) e, quando a URL
 * traz hash — "/#cases" vindo da subpágina —, rola até a âncora no quadro
 * seguinte, já com a Home montada.
 */
export default function ScrollManager() {
  const { pathname, hash } = useLocation()

  useLayoutEffect(() => {
    const lenis = getLenis()
    if (lenis) lenis.scrollTo(0, { immediate: true })
    else window.scrollTo(0, 0)
  }, [pathname])

  useLayoutEffect(() => {
    if (!hash) return undefined
    const raf = requestAnimationFrame(() => scrollToId(hash))
    return () => cancelAnimationFrame(raf)
  }, [pathname, hash])

  return null
}
