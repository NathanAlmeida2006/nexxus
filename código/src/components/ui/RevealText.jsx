import { Fragment } from 'react'

/*
 * Título display com reveal mascarado, em dois modos:
 * - 'lines': cada linha sobe dentro de overflow: hidden;
 * - 'chars': cada letra sobe com leve rotação, em cascata (tipografia cinética).
 * Depende de um ancestral com data-inview (via useReveal) para disparar.
 */
export default function RevealText({ as: Tag = 'h1', lines, className = '', startIndex = 0, split = 'lines' }) {
  if (split === 'chars') {
    let n = startIndex
    return (
      <Tag className={className}>
        {lines.map((line, li) => (
          <span key={li} className="mask-row">
            {line.split(' ').map((word, wi) => (
              <Fragment key={wi}>
                {wi > 0 && ' '}
                <span className="mask-word">
                  {Array.from(word).map((ch, ci) => (
                    <span key={ci} className="mask-char" style={{ '--i': n++ }}>
                      {ch}
                    </span>
                  ))}
                </span>
              </Fragment>
            ))}
          </span>
        ))}
      </Tag>
    )
  }
  return (
    <Tag className={className}>
      {lines.map((line, i) => (
        <span key={i} className="mask-line" style={{ '--i': startIndex + i }}>
          <span>{line}</span>
        </span>
      ))}
    </Tag>
  )
}
