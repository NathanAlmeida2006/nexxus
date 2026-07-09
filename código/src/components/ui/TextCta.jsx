import { onAnchorClick } from '../../hooks/useLenis'
import useMagnetic from '../../hooks/useMagnetic'
import styles from './TextCta.module.css'

/* CTA tipográfico (sem caixa): glifo + label com sublinhado animado, magnético */
export default function TextCta({ href, children, glyph = '↳', className = '', onClick, ...rest }) {
  const magRef = useMagnetic(0.2)
  const handleClick = (e) => {
    onClick?.(e)
    onAnchorClick(e)
  }
  return (
    <a {...rest} ref={magRef} href={href} onClick={handleClick} className={`${styles.cta} ${className}`}>
      <span className={styles.glyph} aria-hidden="true">
        {glyph}
      </span>
      <span className="link-underline">{children}</span>
    </a>
  )
}
