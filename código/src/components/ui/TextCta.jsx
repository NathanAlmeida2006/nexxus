import { Link } from 'react-router-dom'
import { onAnchorClick } from '../../hooks/useLenis'
import useMagnetic from '../../hooks/useMagnetic'
import styles from './TextCta.module.css'

/*
 * CTA tipográfico (sem caixa): glifo + label com sublinhado animado, magnético.
 * Com `to` vira navegação de rota; com `href` continua âncora/link externo.
 */
export default function TextCta({ href, to, children, glyph = '↳', className = '', onClick, ...rest }) {
  const magRef = useMagnetic(0.2)
  const conteudo = (
    <>
      <span className={styles.glyph} aria-hidden="true">
        {glyph}
      </span>
      <span className="link-underline">{children}</span>
    </>
  )

  if (to) {
    return (
      <Link {...rest} ref={magRef} to={to} onClick={onClick} className={`${styles.cta} ${className}`}>
        {conteudo}
      </Link>
    )
  }

  const handleClick = (e) => {
    onClick?.(e)
    onAnchorClick(e)
  }
  return (
    <a {...rest} ref={magRef} href={href} onClick={handleClick} className={`${styles.cta} ${className}`}>
      {conteudo}
    </a>
  )
}
