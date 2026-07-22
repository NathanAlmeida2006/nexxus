import { Link, useLocation } from 'react-router-dom'
import { onAnchorClick } from '../../hooks/useLenis'

/*
 * Âncora da Home que funciona de qualquer rota: na própria Home o scroll é
 * delegado ao Lenis; fora dela navega para "/" carregando o hash e quem
 * termina o trabalho é o ScrollManager.
 */
export default function AnchorLink({ id, children, className = '', onClick, ...rest }) {
  const { pathname } = useLocation()

  if (pathname === '/') {
    return (
      <a
        {...rest}
        href={`#${id}`}
        className={className}
        onClick={(e) => {
          onClick?.(e)
          onAnchorClick(e)
        }}
      >
        {children}
      </a>
    )
  }
  return (
    <Link {...rest} to={`/#${id}`} className={className} onClick={onClick}>
      {children}
    </Link>
  )
}
