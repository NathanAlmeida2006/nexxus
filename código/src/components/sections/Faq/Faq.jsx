import { useState } from 'react'
import { faq } from '../../../data/content'
import useReveal from '../../../hooks/useReveal'
import RollingText from '../../ui/RollingText'
import styles from './Faq.module.css'

/* Carrossel textual no padrão do Büro: anterior/próxima + paginação "01 — 05" */
export default function Faq() {
  const ref = useReveal({ threshold: 0.15 })
  const [index, setIndex] = useState(0)
  const total = faq.items.length
  const fmt = (n) => String(n).padStart(2, '0')

  return (
    <section id="jogo-rapido" className="section" data-theme="white" ref={ref}>
      <div className="container">
        <div className="section-head">
          <p className="micro reveal" style={{ '--i': 0 }}>
            {faq.kicker}
          </p>
          <h2 className="reveal" style={{ '--i': 1 }}>
            {faq.title}
          </h2>
        </div>
        <div className={`${styles.carousel} reveal`} style={{ '--i': 2 }}>
          <div className={styles.viewport}>
            <div className={styles.track} style={{ transform: `translateX(-${index * 100}%)` }}>
              {faq.items.map((item, i) => (
                <article key={item.q} className={styles.slide} aria-hidden={i !== index}>
                  <h3 className={styles.q}>{item.q}</h3>
                  <p className={styles.a}>{item.a}</p>
                </article>
              ))}
            </div>
          </div>
          <div className={styles.controls}>
            <button
              type="button"
              className={`micro ${styles.navBtn}`}
              onClick={() => setIndex((v) => Math.max(0, v - 1))}
              disabled={index === 0}
            >
              <RollingText>{faq.prev}</RollingText>
            </button>
            <p className={`micro ${styles.pagination}`} aria-live="polite">
              <span className={styles.current}>{fmt(index + 1)}</span> — {fmt(total)}
            </p>
            <button
              type="button"
              className={`micro ${styles.navBtn}`}
              onClick={() => setIndex((v) => Math.min(total - 1, v + 1))}
              disabled={index === total - 1}
            >
              <RollingText>{faq.next}</RollingText>
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
