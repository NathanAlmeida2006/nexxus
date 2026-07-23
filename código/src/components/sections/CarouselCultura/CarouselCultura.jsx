import { useState } from 'react'
import useReveal from '../../../hooks/useReveal'
import Marquee from '../../ui/Marquee'
import styles from './CarouselCultura.module.css'

/* Fotos da cultura em WebP (800x1200); base sem sufixo, montado no JSX */
const fotos = [
  '/fotos/carrossel/IMG_6189',
  '/fotos/carrossel/IMG_6210',
  '/fotos/carrossel/IMG_6228',
  '/fotos/carrossel/IMG_6233',
  '/fotos/carrossel/IMG_6240',
]

/* Repetido o bastante para preencher telas largas sem falhas no loop */
const letreiroTopo = Array(8).fill('ESSE É NOSSO TIME')
const letreiroBase = Array(8).fill('PASSE O DEDO POR CIMA')

export default function CarouselCultura() {
  const ref = useReveal({ threshold: 0.2 })
  const [ativa, setAtiva] = useState(0)

  return (
    <section className={`section ${styles.carrossel}`} data-theme="pistachio" ref={ref}>
      <Marquee items={letreiroTopo} duration={26} className={styles.letreiro} />

      <ul className={styles.trilha}>
        {fotos.map((base, i) => (
          <li
            key={base}
            className={styles.item}
            data-ativa={i === ativa ? '' : undefined}
            onMouseEnter={() => setAtiva(i)}
            onFocus={() => setAtiva(i)}
            tabIndex={0}
          >
            <img
              className={styles.foto}
              src={`${base}-1200.webp`}
              srcSet={`${base}-800.webp 533w, ${base}-1200.webp 800w`}
              sizes="(max-width: 760px) 70vw, 32rem"
              alt={`A equipe da Nexxus, foto ${i + 1}`}
              loading="lazy"
              decoding="async"
            />
          </li>
        ))}
      </ul>

      <Marquee items={letreiroBase} duration={21} className={styles.letreiro} />
    </section>
  )
}
