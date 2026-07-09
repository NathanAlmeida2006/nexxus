import { cases, site } from '../../../data/content'
import { onAnchorClick } from '../../../hooks/useLenis'
import useReveal from '../../../hooks/useReveal'
import Petal from '../../ui/Petal'
import Seal from '../../ui/Seal'
import styles from './Cases.module.css'

/*
 * A área de mídia aceita `item.video` (mp4) no futuro: o vídeo entra em loop
 * no hover, no padrão do Büro. Enquanto não há cases, os tiles são compostos.
 */
function CaseMedia({ item }) {
  if (item.type === 'self') {
    return (
      <div className={`${styles.media} ${styles.self}`}>
        <Petal size={150} className={styles.selfPetal} />
        <span className={styles.selfMark}>{site.wordmark}</span>
        <Seal size={100} className={styles.selfSeal} />
      </div>
    )
  }
  return (
    <div className={`${styles.media} ${styles.slot}`}>
      <span className={`micro ${styles.slotLabel}`}>vaga aberta</span>
      <span className={styles.slotMark}>:)</span>
    </div>
  )
}

/* Sem parallax: a mídia responde só ao hover — a troca de capítulo fica
   por conta do arco de entrada do Manifesto */
function CaseCard({ item, index }) {
  return (
    <article className={`${styles.card} reveal`} style={{ '--i': index + 2 }}>
      <a
        href={item.href}
        className={styles.link}
        onClick={onAnchorClick}
        data-cursor={item.type === 'self' ? 'ver' : 'bora?'}
      >
        <div className={styles.frame}>
          <CaseMedia item={item} />
        </div>
        <h3 className={styles.name}>
          {item.name}{' '}
          <span className={styles.arrow} aria-hidden="true">
            ↳
          </span>{' '}
          <span className={styles.tagline}>{item.tagline}</span>
        </h3>
        <p className={`micro ${styles.meta}`}>
          {item.services} · case {item.number}
        </p>
      </a>
    </article>
  )
}

export default function Cases() {
  const ref = useReveal({ threshold: 0.08 })

  return (
    <section id="cases" className={`section ${styles.cases}`} data-theme="white" ref={ref}>
      <div className="container">
        <div className="section-head">
          <p className="micro reveal" style={{ '--i': 0 }}>
            {cases.kicker}
          </p>
          <h2 className="reveal" style={{ '--i': 1 }}>
            {cases.title}
          </h2>
        </div>
        <div className={styles.grid}>
          {cases.items.map((item, i) => (
            <CaseCard key={item.number} item={item} index={i} />
          ))}
        </div>
        <p className={`${styles.note} reveal`} style={{ '--i': 5 }}>
          {cases.note}
        </p>
      </div>
    </section>
  )
}
