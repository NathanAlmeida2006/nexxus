import { equipe } from '../../../data/content'
import useCountUp from '../../../hooks/useCountUp'
import useParallax from '../../../hooks/useParallax'
import useReveal from '../../../hooks/useReveal'
import RevealText from '../../ui/RevealText'
import TextCta from '../../ui/TextCta'
import styles from './TeamHero.module.css'

/* Contador cru no padrão da referência: o número exposto como elemento gráfico */
function Contador({ value, label }) {
  const [ref, atual] = useCountUp(value)
  return (
    <p ref={ref} className={styles.contador}>
      {label} <span>({atual})</span>
    </p>
  )
}

/* Cada item precisa da própria chamada de hook — daí o componente separado */
function ItemMosaico({ item, index }) {
  const fotoRef = useParallax(index % 2 ? 0.94 : 0.88)
  return (
    <li
      className={`${styles.item} reveal reveal-tilt`}
      data-orientacao={item.orientacao}
      style={{ '--i': index }}
    >
      <img
        ref={fotoRef}
        className={styles.foto}
        src={`${item.base}-1600.webp`}
        srcSet={`${item.base}-900.webp 900w, ${item.base}-1600.webp 1600w`}
        sizes="(max-width: 760px) 92vw, 45vw"
        alt={item.alt}
        loading={index < 2 ? 'eager' : 'lazy'}
        fetchPriority={index < 2 ? 'high' : undefined}
        decoding="async"
      />
    </li>
  )
}

export default function TeamHero() {
  const ref = useReveal({ threshold: 0.05 })
  const { hero, mosaic } = equipe

  return (
    <section className={`section ${styles.hero}`} data-theme="navy" ref={ref}>
      <div className="container">
        <p className="micro reveal" style={{ '--i': 0 }}>
          {hero.kicker}
        </p>
        <RevealText as="h1" lines={hero.titleLines} split="chars" startIndex={1} />
        <p className={`${styles.lead} reveal`} style={{ '--i': 2 }}>
          {hero.lead}
        </p>
        <div className={`${styles.meta} reveal`} style={{ '--i': 3 }}>
          <Contador value={hero.counter.value} label={hero.counter.label} />
          <TextCta href={hero.cta.href} glyph="↓">
            {hero.cta.label}
          </TextCta>
        </div>
        <ul className={styles.mosaico}>
          {mosaic.map((item, i) => (
            <ItemMosaico key={item.base} item={item} index={i} />
          ))}
        </ul>
      </div>
    </section>
  )
}
