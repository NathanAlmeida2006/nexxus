import { Link } from 'react-router-dom'
import { onAnchorClick } from '../../hooks/useLenis'
import useMagnetic from '../../hooks/useMagnetic'
import styles from './TextCta.module.css'

/*
 * CTA em caixa-adesivo (.btn), magnético. Com `to` vira navegação de rota;
 * com `href` continua âncora/link externo. `faceClassName` estende a caixa
 * interna (ex.: variante vazada `btn-ghost` ou tamanho fixo de um par).
 */
export default function TextCta({ href, to, children, glyph = '↳', className = '', faceClassName = '', onClick, ...rest }) {
  const magRef = useMagnetic(0.2)
  const conteudo = (
    <span className={`btn ${faceClassName}`}>
      <span className={styles.glyph} aria-hidden="true">
        {glyph}
      </span>
      <span>{children}</span>
    </span>
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
