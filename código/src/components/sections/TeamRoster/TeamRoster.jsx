import { equipe } from '../../../data/content'
import useReveal from '../../../hooks/useReveal'
import MemberCard from '../../ui/MemberCard'
import styles from './TeamRoster.module.css'

/*
 * Um capítulo por setor, com contador cru no rótulo. A numeração dos cards é
 * contínua de 01 a 11 (não reinicia a cada setor), então vem daqui pronta.
 * Setor com mais de uma pessoa entra em bloco denso — é o caso da Área
 * Técnica, cujos cinco integrantes criam variação de andamento na página.
 */
export default function TeamRoster() {
  const ref = useReveal({ threshold: 0.03 })
  let numero = 0

  return (
    <section id="lista" className="section" data-theme="white" ref={ref}>
      <div className="container">
        <div className="section-head">
          <p className="micro reveal" style={{ '--i': 0 }}>
            {equipe.roster.kicker}
          </p>
          <h2 className="reveal" style={{ '--i': 1 }}>
            {equipe.roster.title}
          </h2>
        </div>
        {equipe.roster.setores.map((setor) => {
          const denso = false
          return (
            <section
              key={setor.slug}
              className={styles.capitulo}
              data-setor={setor.slug}
              aria-labelledby={`setor-${setor.slug}`}
            >
              <h3 id={`setor-${setor.slug}`} className={`micro ${styles.rotulo} reveal`}>
                {setor.setor} <span className={styles.contagem}>({setor.membros.length})</span>
              </h3>
              <ul className={styles.fluxo}>
                {setor.membros.map((membro) => {
                  numero += 1
                  return (
                    <MemberCard
                      key={membro.slug}
                      membro={membro}
                      setor={setor.setor}
                      numero={numero}
                      dense={denso}
                    />
                  )
                })}
              </ul>
            </section>
          )
        })}
      </div>
    </section>
  )
}
