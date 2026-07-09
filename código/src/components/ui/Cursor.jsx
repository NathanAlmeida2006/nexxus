import { useEffect, useRef } from 'react'
import styles from './Cursor.module.css'

/*
 * Ponto que acompanha o mouse com lerp. Sobre [data-cursor] vira uma
 * pílula pistache com rótulo contextual (ex.: data-cursor="ver").
 */
export default function Cursor() {
  const ref = useRef(null)
  const labelRef = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return undefined
    if (!window.matchMedia('(pointer: fine)').matches) return undefined
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined

    el.dataset.active = 'true'
    let x = window.innerWidth / 2
    let y = window.innerHeight / 2
    let tx = x
    let ty = y
    let raf = 0
    const onMove = (e) => {
      tx = e.clientX
      ty = e.clientY
      const target = e.target.closest?.('[data-cursor]')
      el.dataset.big = target ? 'true' : 'false'
      if (target && labelRef.current) {
        labelRef.current.textContent = target.dataset.cursor === 'true' ? '' : target.dataset.cursor
      }
    }
    const loop = () => {
      x += (tx - x) * 0.18
      y += (ty - y) * 0.18
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`
      raf = requestAnimationFrame(loop)
    }
    window.addEventListener('mousemove', onMove, { passive: true })
    raf = requestAnimationFrame(loop)
    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf)
      delete el.dataset.active
    }
  }, [])

  return (
    <div ref={ref} className={styles.cursor} aria-hidden="true">
      <span ref={labelRef} className={styles.label} />
    </div>
  )
}
