import { useEffect } from 'react'
import Lenis from 'lenis'
import { prefersReducedMotion } from '../utils/media'

let lenisInstance = null

export function getLenis() {
  return lenisInstance
}

export function scrollToId(hash) {
  const el = document.querySelector(hash)
  if (!el) return
  if (lenisInstance) {
    lenisInstance.scrollTo(el, { duration: 1.2 })
  } else {
    el.scrollIntoView({ behavior: prefersReducedMotion() ? 'auto' : 'smooth' })
  }
}

/* Handler padrão para âncoras internas — delega o scroll ao Lenis */
export function onAnchorClick(e) {
  const href = e.currentTarget.getAttribute('href')
  if (href && href.startsWith('#')) {
    e.preventDefault()
    scrollToId(href)
  }
}

export default function useLenis() {
  useEffect(() => {
    if (prefersReducedMotion()) return undefined
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    })
    lenisInstance = lenis
    /* Velocidade do scroll exposta como CSS var — alimenta o skew do marquee */
    lenis.on('scroll', ({ velocity }) => {
      const v = Math.max(-18, Math.min(18, velocity))
      document.documentElement.style.setProperty('--scroll-velocity', v.toFixed(2))
    })
    let raf = requestAnimationFrame(function loop(time) {
      lenis.raf(time)
      raf = requestAnimationFrame(loop)
    })
    return () => {
      cancelAnimationFrame(raf)
      lenis.destroy()
      lenisInstance = null
      document.documentElement.style.removeProperty('--scroll-velocity')
    }
  }, [])
}
