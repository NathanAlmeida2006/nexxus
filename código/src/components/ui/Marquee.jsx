import styles from './Marquee.module.css'

/*
 * Marquee infinito em CSS puro: conteúdo duplicado, translateX(-50%) em loop.
 * A camada .skew enverga o conjunto conforme a velocidade do scroll
 * (var --scroll-velocity, alimentada pelo Lenis).
 */
export default function Marquee({ items, duration = 22, className = '' }) {
  const group = (hidden) => (
    <div className={styles.group} aria-hidden={hidden || undefined}>
      {items.map((item, i) => (
        <span key={`${item}-${i}`} className={styles.item}>
          {item}
          <span className={styles.dot} aria-hidden="true">
            •
          </span>
        </span>
      ))}
    </div>
  )
  return (
    <div className={`${styles.marquee} ${className}`} style={{ '--dur': `${duration}s` }}>
      <div className={styles.skew}>
        <div className={styles.track}>
          {group(false)}
          {group(true)}
        </div>
      </div>
    </div>
  )
}
