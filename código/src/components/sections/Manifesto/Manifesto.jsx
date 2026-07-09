import { useCallback, useEffect } from 'react'
import { manifesto } from '../../../data/content'
import useEntryProgress from '../../../hooks/useEntryProgress'
import useReveal from '../../../hooks/useReveal'
import { pad2 } from '../../../utils/format'
import RevealText from '../../ui/RevealText'
import GuitarString from './GuitarString'
import { unlockAudio } from './guitarAudio'
import styles from './Manifesto.module.css'

/*
 * Cada regra revela ao entrar no viewport; a corda acima dela se encordoa
 * junto (scaleX da esquerda pra direita, ver .string svg no CSS).
 */
function ManifestoItem({ index, text }) {
  const ref = useReveal({ threshold: 0.3 })
  return (
    <li ref={ref} className={styles.item}>
      {index > 0 && <GuitarString index={index - 1} />}
      <div className={`${styles.itemInner} reveal reveal-left`} style={{ '--i': index % 3 }}>
        <span className={`micro ${styles.num}`}>{pad2(index + 1)}</span>
        <h3 className={styles.text}>{text}</h3>
      </div>
    </li>
  )
}

/*
 * "Regras não ditas" como braço de violão: 7 regras, 6 cordas tocáveis entre
 * elas. A seção entra por cima dos Cases com o topo em arco que se aplaina
 * (--entry via useEntryProgress) — a transição de capítulo, sem parallax.
 */
export default function Manifesto() {
  const revealRef = useReveal()
  const entryRef = useEntryProgress()
  /* um só <section> alimenta os dois hooks; estável entre renders */
  const sectionRef = useCallback(
    (el) => {
      revealRef.current = el
      entryRef.current = el
    },
    [revealRef, entryRef],
  )

  useEffect(() => {
    unlockAudio()
  }, [])

  return (
    <section className={`section ${styles.manifesto}`} data-theme="navy" ref={sectionRef}>
      <div className="container">
        <div className="section-head">
          <p className="micro reveal" style={{ '--i': 0 }}>
            {manifesto.kicker}
          </p>
          <RevealText as="h2" lines={[manifesto.title]} startIndex={1} />
        </div>
        <ol className={styles.list}>
          {manifesto.items.map((text, i) => (
            <ManifestoItem key={i} index={i} text={text} />
          ))}
        </ol>
      </div>
    </section>
  )
}
