import { useState } from 'react'
import { services } from '../../../data/content'
import useMediaQuery from '../../../hooks/useMediaQuery'
import useReveal from '../../../hooks/useReveal'
import { pad2 } from '../../../utils/format'
import styles from './Services.module.css'

/* Quatro colunas no desktop; no mobile, vira accordion (um pilar aberto por vez) */
export default function Services() {
  const ref = useReveal({ threshold: 0.1 })
  const isMobile = useMediaQuery('(max-width: 899px)')
  const [open, setOpen] = useState(0)

  return (
    <section id="servicos" className="section" data-theme="pistachio" ref={ref}>
      <div className="container">
        <div className="section-head">
          <p className="micro reveal" style={{ '--i': 0 }}>
            {services.kicker}
          </p>
          <h2 className="reveal" style={{ '--i': 1 }}>
            {services.title}
          </h2>
        </div>
        <div className={styles.grid}>
          {services.items.map((pillar, i) => {
            const expanded = !isMobile || open === i
            const head = (
              <>
                <span className={`micro ${styles.num}`}>{pad2(i + 1)}</span>
                <h3 className={styles.pillarTitle}>{pillar.title}</h3>
              </>
            )
            return (
              <div key={pillar.title} className={`${styles.pillar} reveal reveal-tilt`} style={{ '--i': i + 2 }}>
                {isMobile ? (
                  <button
                    type="button"
                    className={styles.head}
                    aria-expanded={open === i}
                    aria-controls={`pillar-${i}`}
                    onClick={() => setOpen(open === i ? -1 : i)}
                  >
                    {head}
                    <span className={styles.toggle} aria-hidden="true">
                      {open === i ? '−' : '+'}
                    </span>
                  </button>
                ) : (
                  <div className={styles.head}>{head}</div>
                )}
                <div id={`pillar-${i}`} className={styles.panel} data-expanded={expanded}>
                  <ul className={styles.sublist}>
                    {pillar.items.map((entry) => (
                      <li key={entry} className={styles.entry}>
                        {entry}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
