import createGlobe from 'cobe'
import { useCallback, useEffect, useRef } from 'react'
import { mundo } from '../../../data/content'
import useReveal from '../../../hooks/useReveal'
import { prefersReducedMotion } from '../../../utils/media'
import styles from './Globe.module.css'

/*
 * Globo interativo (cobe/WebGL) puramente estético antes do footer: pontos
 * azul-claros sobre o navy da seção, marcador pistache em Blumenau e arcos
 * até onde a gente ainda quer chegar. O giro pausa durante o arraste (com
 * inércia na soltura) e para de vez com prefers-reduced-motion. Os rótulos
 * usam CSS Anchor Positioning — melhoria progressiva, só onde há suporte.
 */

const HOME_ID = 'bnu'

const DOTS = [0.62, 0.72, 0.95] // azul-claro derivado do --blue
const PISTACHIO = [0.84, 0.87, 0.63] // --pistachio
const GLOW = [0.05, 0.11, 0.25] // --navy-deep: halo que se dissolve no fundo

// phi inicial deixa Blumenau de frente quando o globo aparece
const HOME_PHI = Math.PI - ((mundo.home.location[1] * Math.PI) / 180 - Math.PI / 2)
const BASE_THETA = -0.18

const MARKERS = [{ id: HOME_ID, location: mundo.home.location, size: 0.08 }]
const ARCS = mundo.dreams.map((d) => ({ id: d.id, from: mundo.home.location, to: d.location }))

const supportsAnchors = typeof CSS !== 'undefined' && CSS.supports('position-anchor: --x')

function anchoredStyle(name) {
  return {
    positionAnchor: `--cobe-${name}`,
    opacity: `var(--cobe-visible-${name}, 0)`,
    filter: `blur(calc((1 - var(--cobe-visible-${name}, 0)) * 6px))`,
  }
}

function GlobeCanvas() {
  const canvasRef = useRef(null)
  const pointer = useRef(null)
  const lastPointer = useRef(null)
  const dragOffset = useRef({ phi: 0, theta: 0 })
  const velocity = useRef({ phi: 0, theta: 0 })
  const phiOffset = useRef(HOME_PHI)
  const thetaOffset = useRef(0)
  const paused = useRef(false)

  const onPointerDown = useCallback((e) => {
    pointer.current = { x: e.clientX, y: e.clientY }
    if (canvasRef.current) canvasRef.current.style.cursor = 'grabbing'
    paused.current = true
  }, [])

  useEffect(() => {
    const onMove = (e) => {
      if (!pointer.current) return
      dragOffset.current = {
        phi: (e.clientX - pointer.current.x) / 300,
        theta: (e.clientY - pointer.current.y) / 1000,
      }
      const now = Date.now()
      if (lastPointer.current) {
        const dt = Math.max(now - lastPointer.current.t, 1)
        const cap = 0.15
        velocity.current = {
          phi: Math.max(-cap, Math.min(cap, ((e.clientX - lastPointer.current.x) / dt) * 0.3)),
          theta: Math.max(-cap, Math.min(cap, ((e.clientY - lastPointer.current.y) / dt) * 0.08)),
        }
      }
      lastPointer.current = { x: e.clientX, y: e.clientY, t: now }
    }
    const onUp = () => {
      if (pointer.current) {
        phiOffset.current += dragOffset.current.phi
        thetaOffset.current += dragOffset.current.theta
        dragOffset.current = { phi: 0, theta: 0 }
        lastPointer.current = null
      }
      pointer.current = null
      if (canvasRef.current) canvasRef.current.style.cursor = 'grab'
      paused.current = false
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerup', onUp, { passive: true })
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
    }
  }, [])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return undefined
    const speed = prefersReducedMotion() ? 0 : 0.0025
    let globe = null
    let raf = 0
    let phi = 0
    let inView = false

    const destroy = () => {
      cancelAnimationFrame(raf)
      raf = 0
      globe?.destroy()
      globe = null
    }

    const render = () => {
      if (!paused.current) {
        phi += speed
        if (Math.abs(velocity.current.phi) > 0.0001 || Math.abs(velocity.current.theta) > 0.0001) {
          phiOffset.current += velocity.current.phi
          thetaOffset.current += velocity.current.theta
          velocity.current.phi *= 0.95
          velocity.current.theta *= 0.95
        }
        // mola que traz a inclinação de volta pro alcance confortável
        if (thetaOffset.current < -0.4) thetaOffset.current += (-0.4 - thetaOffset.current) * 0.1
        else if (thetaOffset.current > 0.4) thetaOffset.current += (0.4 - thetaOffset.current) * 0.1
      }
      globe.update({
        phi: phi + phiOffset.current + dragOffset.current.phi,
        theta: BASE_THETA + thetaOffset.current + dragOffset.current.theta,
        markers: MARKERS,
        arcs: ARCS,
      })
    }

    const animate = () => {
      render()
      raf = inView ? requestAnimationFrame(animate) : 0
    }

    const wake = () => {
      if (globe && inView && !raf) raf = requestAnimationFrame(animate)
    }

    const init = () => {
      destroy()
      const width = canvas.offsetWidth
      if (!width) return
      globe = createGlobe(canvas, {
        devicePixelRatio: Math.min(window.devicePixelRatio || 1, 2),
        width,
        height: width,
        phi: 0,
        theta: BASE_THETA,
        dark: 1,
        diffuse: 1.6,
        mapSamples: 16000,
        mapBrightness: 7,
        baseColor: DOTS,
        markerColor: PISTACHIO,
        glowColor: GLOW,
        markerElevation: 0.01,
        markers: MARKERS,
        arcs: ARCS,
        arcColor: PISTACHIO,
        arcWidth: 0.4,
        arcHeight: 0.3,
        opacity: 0.85,
      })
      // 1º frame imediato mesmo fora da viewport: o canvas nunca aparece vazio
      render()
      wake()
      canvas.style.opacity = '1'
    }

    /*
     * O loop (e o render WebGL) só roda com o globo na viewport — fora dela
     * ele dorme e não custa GPU/CPU. A margem acorda o giro um pouco antes
     * de a seção entrar em cena.
     */
    const io = new IntersectionObserver(
      ([entry]) => {
        inView = entry.isIntersecting
        if (inView) wake()
        else {
          cancelAnimationFrame(raf)
          raf = 0
        }
      },
      { rootMargin: '160px' },
    )
    io.observe(canvas)

    // Inicia quando o canvas ganha largura e recria no resize (debounced)
    let lastWidth = 0
    let timer = 0
    const ro = new ResizeObserver(() => {
      const w = canvas.offsetWidth
      if (!w || w === lastWidth) return
      lastWidth = w
      clearTimeout(timer)
      timer = setTimeout(init, globe ? 200 : 0)
    })
    ro.observe(canvas)

    return () => {
      io.disconnect()
      ro.disconnect()
      clearTimeout(timer)
      destroy()
    }
  }, [])

  return (
    <div className={styles.wrap}>
      <canvas
        ref={canvasRef}
        className={styles.canvas}
        onPointerDown={onPointerDown}
        data-cursor="gira"
        role="img"
        aria-label="Globo giratório marcando Blumenau, no Vale do Itajaí"
      />
      {supportsAnchors && (
        <>
          <span className={styles.homeTag} style={anchoredStyle(HOME_ID)}>
            {mundo.home.label}
          </span>
          {mundo.dreams.map((d) => (
            <span key={d.id} className={styles.dreamTag} style={anchoredStyle(`arc-${d.id}`)}>
              {d.label}
            </span>
          ))}
        </>
      )}
    </div>
  )
}

export default function Globe() {
  const ref = useReveal({ threshold: 0.15 })

  return (
    <section id="mundo" className={`section ${styles.mundo}`} data-theme="navy" ref={ref}>
      <div className="container">
        <div className="section-head">
          <p className="micro reveal" style={{ '--i': 0 }}>
            {mundo.kicker}
          </p>
          <h2 className="reveal" style={{ '--i': 1 }}>
            {mundo.title}
          </h2>
        </div>
        <div className="reveal reveal-pop" style={{ '--i': 2 }}>
          <GlobeCanvas />
        </div>
        <p className={`micro reveal ${styles.note}`} style={{ '--i': 3 }}>
          {mundo.note}
        </p>
      </div>
    </section>
  )
}
