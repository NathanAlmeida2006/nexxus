import { pad2 } from '../../utils/format'
import styles from './MemberCard.module.css'

/*
 * Card do integrante no padrão-assinatura da referência de estrutura: o nome
 * é quebrado ao redor da foto. Ímpares alinham à esquerda (NOME · foto ·
 * SETOR); pares vão para a direita e invertem a ordem. Quem tem duas fotos
 * troca a imagem no hover — o equivalente ao vídeo-no-hover dos cards do Büro.
 *
 * Não é link: não existe página por integrante, então o card é conteúdo.
 * A troca é 100% CSS (:hover/:focus-within) — sem estado, sem re-render.
 */
export default function MemberCard({ membro, setor, numero, dense = false }) {
  const troca = membro.fotos.length > 1
  /* No modo denso o setor já é o título do capítulo; repeti-lo em cinco
     cards seguidos é ruído. Cargo nominal, quando existir, sempre aparece. */
  const rotulo = membro.cargo || (dense ? '' : setor)

  return (
    <li
      className={styles.card}
      data-membro={membro.slug}
      data-invertido={!dense && numero % 2 === 0 ? '' : undefined}
      data-denso={dense ? '' : undefined}
      data-troca={troca ? '' : undefined}
    >
      <span className={`micro ${styles.num}`}>{pad2(numero)}</span>
      <h4 className={styles.nome}>{membro.nome}</h4>
      <figure className={styles.moldura}>
        {membro.fotos.map((base, i) => (
          <img
            key={base}
            className={styles.foto}
            src={`${base}-1200.webp`}
            srcSet={`${base}-640.webp 640w, ${base}-1200.webp 1200w`}
            sizes="(max-width: 760px) 60vw, 22vw"
            style={{ objectPosition: membro.focus }}
            alt={i === 0 ? membro.alt : ''}
            aria-hidden={i > 0 ? 'true' : undefined}
            loading="lazy"
            decoding="async"
          />
        ))}
      </figure>
      {rotulo ? <p className={`micro ${styles.setor}`}>{rotulo}</p> : null}
    </li>
  )
}
