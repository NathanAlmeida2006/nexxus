import { hero } from '../../../data/content'
import useReveal from '../../../hooks/useReveal'
import RevealText from '../../ui/RevealText'
import TextCta from '../../ui/TextCta'
import styles from './Hero.module.css'

export default function Hero() {
  const ref = useReveal({ threshold: 0.2 })

  return (
    <section id="inicio" className={`section ${styles.hero}`} data-theme="navy" ref={ref}>
      <div className={`container ${styles.inner}`}>
        <p className={`micro reveal ${styles.kicker}`} style={{ '--i': 0 }}>
          {hero.kicker}
        </p>
        <RevealText as="h1" lines={hero.titleLines} className={styles.title} split="chars" />
        <p className={`reveal ${styles.lead}`} style={{ '--i': 3 }}>
          {hero.lead}
        </p>
        <div className="reveal" style={{ '--i': 4 }}>
          <TextCta href={hero.cta.href} className={styles.cta}>
            {hero.cta.label}
          </TextCta>
        </div>
      </div>
      <p className={`micro reveal float-bob ${styles.cue}`} style={{ '--i': 5 }}>
        {hero.scrollCue}
      </p>
    </section>
  )
}
