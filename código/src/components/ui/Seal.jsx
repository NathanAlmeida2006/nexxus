import { useId } from 'react'
import styles from './Seal.module.css'

/* Selo circular "1ª Empresa Júnior de Marketing da FURB", girando devagar */
export default function Seal({ size = 150, className = '' }) {
  const pathId = `seal-${useId().replace(/[^a-zA-Z0-9_-]/g, '')}`
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      className={`${styles.seal} ${className}`}
      aria-hidden="true"
      focusable="false"
    >
      <defs>
        <path id={pathId} d="M 50 50 m -38 0 a 38 38 0 1 1 76 0 a 38 38 0 1 1 -76 0" fill="none" />
      </defs>
      <circle cx="50" cy="50" r="49" fill="none" stroke="currentColor" strokeOpacity="0.35" />
      <circle cx="50" cy="50" r="27" fill="none" stroke="currentColor" strokeOpacity="0.35" />
      <text className={styles.ring}>
        <textPath href={`#${pathId}`}>1ª empresa júnior de marketing da furb ✶ nexxus hub ej ✶</textPath>
      </text>
      <text x="50" y="56" textAnchor="middle" className={styles.center}>
        ej.
      </text>
    </svg>
  )
}
