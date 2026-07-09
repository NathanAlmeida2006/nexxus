import { useEffect, useState } from 'react'

/* Header auto-hide: some no scroll para baixo, reaparece no scroll para cima */
export default function useHeaderHide({ delta = 8, minY = 120 } = {}) {
  const [hidden, setHidden] = useState(false)
  const [atTop, setAtTop] = useState(true)

  useEffect(() => {
    let lastY = window.scrollY
    let raf = 0
    const update = () => {
      raf = 0
      const y = window.scrollY
      setAtTop(y < 10)
      if (Math.abs(y - lastY) > delta) {
        setHidden(y > lastY && y > minY)
        lastY = y
      }
    }
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(raf)
    }
  }, [delta, minY])

  return { hidden, atTop }
}
