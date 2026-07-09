import { useEffect, useRef } from 'react'
import { prefersReducedMotion } from '../../../utils/media'
import { msSincePointerMove, trackPointerActivity } from '../../../utils/pointerActivity'
import { NOTES, pluck } from './guitarAudio'
import styles from './Manifesto.module.css'

const W = 1200
const MID = 30
const REST = `M 0 ${MID} Q ${W / 2} ${MID} ${W} ${MID}`

/*
 * Uma corda do violão: linha SVG que, dedilhada, vibra no modo fundamental
 * com oscilação amortecida — o ponto de controle da Bézier segue o lugar do
 * toque e balança em seno com decaimento exponencial, enquanto guitarAudio
 * solta a nota correspondente. Cordas graves são mais grossas, balançam mais
 * largo, mais devagar e por mais tempo.
 */
export default function GuitarString({ index }) {
  const btnRef = useRef(null)
  const pathRef = useRef(null)
  const raf = useRef(0)
  const lastPluck = useRef(0)

  useEffect(() => {
    trackPointerActivity()
    return () => cancelAnimationFrame(raf.current)
  }, [])

  const strum = (clientX) => {
    const now = performance.now()
    if (now - lastPluck.current < 120) return
    lastPluck.current = now
    pluck(index)

    const btn = btnRef.current
    const path = pathRef.current
    if (!btn || !path) return
    btn.dataset.vibrating = 'true'

    if (prefersReducedMotion()) {
      window.setTimeout(() => {
        btn.dataset.vibrating = 'false'
      }, 600)
      return
    }

    const rect = btn.getBoundingClientRect()
    const rel = rect.width ? (clientX - rect.left) / rect.width : 0.5
    const cx = W * Math.min(0.82, Math.max(0.18, rel || 0.5))
    const amp = 19 - index * 1.9
    const freq = 3.1 + index * 0.85
    const tau = 1.15 - index * 0.09
    const start = now

    cancelAnimationFrame(raf.current)
    const tick = (t) => {
      const s = (t - start) / 1000
      if (s > tau * 4.5) {
        path.setAttribute('d', REST)
        btn.dataset.vibrating = 'false'
        return
      }
      const a = amp * Math.sin(2 * Math.PI * freq * s) * Math.exp(-s / tau)
      path.setAttribute('d', `M 0 ${MID} Q ${cx.toFixed(1)} ${(MID + a).toFixed(2)} ${W} ${MID}`)
      raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
  }

  const note = NOTES[index]

  return (
    <button
      type="button"
      ref={btnRef}
      className={styles.string}
      data-cursor="♪ toca"
      aria-label={`Tocar corda ${index + 1} — ${note.label}`}
      onPointerEnter={(e) => {
        if (e.pointerType !== 'mouse') return
        /* sem movimento recente é a rolagem passando a corda sob o cursor
           parado — não conta como dedilhada (toque/teclado entram no click) */
        if (msSincePointerMove() > 150) return
        strum(e.clientX)
      }}
      onClick={(e) => strum(e.clientX)}
    >
      <svg viewBox={`0 0 ${W} 60`} preserveAspectRatio="none" aria-hidden="true" focusable="false">
        <path
          ref={pathRef}
          d={REST}
          vectorEffect="non-scaling-stroke"
          strokeWidth={(2.6 - index * 0.28).toFixed(2)}
          className={styles.stringPath}
        />
      </svg>
      <span className={`micro ${styles.noteName}`} aria-hidden="true">
        {note.label}
      </span>
    </button>
  )
}
