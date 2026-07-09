/*
 * Rótulo em duas camadas para o efeito de "rolagem" no hover.
 * O gatilho é o <a>/<button> pai (ver .roll em base.css).
 */
export default function RollingText({ children, className = '' }) {
  return (
    <span className={`roll ${className}`}>
      <span className="roll-inner">
        <span>{children}</span>
        <span aria-hidden="true">{children}</span>
      </span>
    </span>
  )
}
