import { useEffect, useState } from 'react'

/*
 * Observa qual seção passa sob o header e devolve 'navy' | 'light'
 * para a troca de tema por seção (alternativa ao mix-blend-mode).
 */
export default function useHeaderTheme() {
  const [onNavy, setOnNavy] = useState(true)

  useEffect(() => {
    const sections = document.querySelectorAll('[data-theme]')
    if (!sections.length) return undefined
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setOnNavy(entry.target.dataset.theme === 'navy')
        })
      },
      { rootMargin: '0px 0px -94% 0px', threshold: 0 },
    )
    sections.forEach((s) => io.observe(s))
    return () => io.disconnect()
  }, [])

  return onNavy ? 'navy' : 'light'
}
