import { equipe } from '../../../data/content'
import useReveal from '../../../hooks/useReveal'
import RevealText from '../../ui/RevealText'
import styles from './TeamCulture.module.css'

/* Cultura antes da listagem: a página vende o ambiente antes de apresentar gente */
export default function TeamCulture() {
  const ref = useReveal({ threshold: 0.2 })
  const { culture } = equipe

  return (
    <section className="section" data-theme="pistachio" ref={ref}>
      <div className="container">
        <div className="section-head">
          <p className="micro reveal" style={{ '--i': 0 }}>
            {culture.kicker}
          </p>
          <RevealText as="h2" lines={[culture.title]} startIndex={1} />
        </div>
        <div className={styles.texto}>
          {culture.paragraphs.map((paragrafo, i) => (
            <p key={paragrafo} className="reveal" style={{ '--i': i + 2 }}>
              {paragrafo}
            </p>
          ))}
        </div>
      </div>
    </section>
  )
}
