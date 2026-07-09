import { marqueeWords, stats } from '../../../data/content'
import useCountUp from '../../../hooks/useCountUp'
import useReveal from '../../../hooks/useReveal'
import Marquee from '../../ui/Marquee'
import TextCta from '../../ui/TextCta'
import styles from './Stats.module.css'

function StatValue({ value, suffix }) {
  const [ref, current] = useCountUp(value)
  return (
    <span ref={ref} className={styles.value}>
      {current.toLocaleString('pt-BR')}
      {suffix}
    </span>
  )
}

export default function Stats() {
  const ref = useReveal({ threshold: 0.1 })

  return (
    <section className={`section ${styles.stats}`} data-theme="pistachio" ref={ref}>
      <div className="container">
        <div className="section-head">
          <p className="micro reveal" style={{ '--i': 0 }}>
            {stats.kicker}
          </p>
          <h2 className="reveal" style={{ '--i': 1 }}>
            {stats.title}
          </h2>
        </div>
        <ul className={styles.grid}>
          {stats.items.map((item, i) => (
            <li key={item.label} className={`${styles.cell} reveal reveal-pop`} style={{ '--i': i + 2 }}>
              <StatValue value={item.value} suffix={item.suffix} />
              <p className={`micro ${styles.label}`}>{item.label}</p>
            </li>
          ))}
        </ul>
        <div className={`${styles.asideRow} reveal`} style={{ '--i': 6 }}>
          <p className={styles.aside}>{stats.aside}</p>
          <TextCta href={stats.cta.href}>{stats.cta.label}</TextCta>
        </div>
      </div>
      <Marquee items={marqueeWords} className={styles.marquee} />
    </section>
  )
}
