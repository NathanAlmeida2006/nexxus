import { team } from '../../../data/content'
import useReveal from '../../../hooks/useReveal'
import styles from './Team.module.css'

function TeamRow({ index, area }) {
  const ref = useReveal({ threshold: 0.3 })
  return (
    <li ref={ref} className={styles.row}>
      <div className={`${styles.rowInner} reveal`} style={{ '--i': index % 3 }}>
        <span className={`micro ${styles.num}`}>{String(index + 1).padStart(2, '0')}</span>
        <h3 className={styles.area}>{area}</h3>
      </div>
    </li>
  )
}

export default function Team() {
  const ref = useReveal()

  return (
    <section id="nozes" className="section" data-theme="navy" ref={ref}>
      <div className="container">
        <div className="section-head">
          <p className="micro reveal" style={{ '--i': 0 }}>
            {team.kicker}
          </p>
          <h2 className="reveal" style={{ '--i': 1 }}>
            {team.title}
          </h2>
          <p className={`reveal ${styles.note}`} style={{ '--i': 2 }}>
            {team.note}
          </p>
        </div>
        <ul>
          {team.areas.map((area, i) => (
            <TeamRow key={area} index={i} area={area} />
          ))}
        </ul>
        <p className={`${styles.namesNote} reveal`} style={{ '--i': 3 }}>
          {team.namesNote}
        </p>
      </div>
    </section>
  )
}
