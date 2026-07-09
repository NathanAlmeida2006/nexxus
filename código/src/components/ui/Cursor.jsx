import { useEffect, useRef } from 'react'
import { hasFinePointer, prefersReducedMotion } from '../../utils/media'
import styles from './Cursor.module.css'

/*
 * Ponto que acompanha o mouse com lerp. Sobre [data-cursor] vira uma
 * pílula pistache com rótulo contextual (ex.: data-cursor="ver").
 * O loop de lerp dorme quando o ponto assenta no alvo (< 0.1px) e
 * acorda no próximo mousemove — parado, não custa nada por frame.
 */
export default function Cursor() {
  const ref = useRef(null)
  const labelRef = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return undefined
    if (!hasFinePointer()) return undefined
    if (prefersReducedMotion()) return undefined

    el.dataset.active = 'true'
    let x = window.innerWidth / 2
    let y = window.innerHeight / 2
    let tx = x
    let ty = y
    let raf = 0
    const loop = () => {
      x += (tx - x) * 0.18
      y += (ty - y) * 0.18
      if (Math.abs(tx - x) < 0.1 && Math.abs(ty - y) < 0.1) {
        x = tx
        y = ty
        raf = 0
      } else {
        raf = requestAnimationFrame(loop)
      }
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`
    }
    const onMove = (e) => {
      tx = e.clientX
      ty = e.clientY
      const target = e.target.closest?.('[data-cursor]')
      el.dataset.big = target ? 'true' : 'false'
      if (target && labelRef.current) {
        labelRef.current.textContent = target.dataset.cursor === 'true' ? '' : target.dataset.cursor
      }
      if (!raf) raf = requestAnimationFrame(loop)
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
