import { team } from '../../../data/content'
import useParallax from '../../../hooks/useParallax'
import useReveal from '../../../hooks/useReveal'
import RevealText from '../../ui/RevealText'
import TextCta from '../../ui/TextCta'
import styles from './Team.module.css'

/*
 * Bloco People no padrão da referência de estrutura: statement contido, uma
 * foto e o CTA para a subpágina. Sem inventário de setores — eles são os
 * capítulos do roster em /equipe.
 */
export default function Team() {
  const ref = useReveal({ threshold: 0.2 })
  const fotoRef = useParallax(0.9)

  return (
    <section id="nozes" className="section" data-theme="navy" ref={ref}>
      <div className="container">
        <div className="section-head">
          <p className="micro reveal" style={{ '--i': 0 }}>
            {team.kicker}
          </p>
          <RevealText as="h2" lines={[team.title]} startIndex={1} />
        </div>
        <div className={styles.corpo}>
          <div className={styles.statement}>
            {team.statement.map((paragrafo, i) => (
              <p key={paragrafo} className="reveal" style={{ '--i': i + 2 }}>
                {paragrafo}
              </p>
            ))}
            <TextCta
              to={team.cta.to}
              className={`${styles.cta} reveal`}
              style={{ '--i': 4 }}
              data-cursor="conhecer"
            >
              {team.cta.label}
            </TextCta>
          </div>
          <figure className={`${styles.figura} reveal reveal-tilt`} style={{ '--i': 3 }}>
            <div className={styles.moldura}>
              <img
                ref={fotoRef}
                className={styles.foto}
                src={`${team.photo.base}-1600.webp`}
                srcSet={`${team.photo.base}-900.webp 900w, ${team.photo.base}-1600.webp 1600w`}
                sizes="(max-width: 900px) 92vw, 55vw"
                alt={team.photo.alt}
                loading="lazy"
                decoding="async"
              />
            </div>
          </figure>
        </div>
      </div>
    </section>
  )
}
