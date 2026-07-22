import { equipe } from '../../../data/content'
import useReveal from '../../../hooks/useReveal'
import RevealText from '../../ui/RevealText'
import TextCta from '../../ui/TextCta'
import styles from './TeamJoin.module.css'

export default function TeamJoin() {
  const ref = useReveal({ threshold: 0.25 })
  const { join } = equipe

  return (
    <section className="section" data-theme="navy" ref={ref}>
      <div className="container">
        <div className="section-head">
          <p className="micro reveal" style={{ '--i': 0 }}>
            {join.kicker}
          </p>
          <RevealText as="h2" lines={[join.title]} startIndex={1} />
        </div>
        <div className={styles.corpo}>
          <p className={`${styles.lead} reveal`} style={{ '--i': 2 }}>
            {join.lead}
          </p>
          <TextCta to={join.cta.to} className="reveal" style={{ '--i': 3 }} data-cursor="bora?">
            {join.cta.label}
          </TextCta>
        </div>
      </div>
    </section>
  )
}
