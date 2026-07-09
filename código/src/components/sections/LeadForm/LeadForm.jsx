import { leadForm, site } from '../../../data/content'
import useMagnetic from '../../../hooks/useMagnetic'
import useReveal from '../../../hooks/useReveal'
import TextCta from '../../ui/TextCta'
import styles from './LeadForm.module.css'

/*
 * Campo com label flutuante em CSS puro: o placeholder=" " permite usar
 * :placeholder-shown; em selects, o :valid (required + option vazia) cumpre
 * o mesmo papel. A .line é a linha de foco que cresce 0 → 100%.
 */
function Field({ id, label, as = 'input', type = 'text', options, full = false, required = false, autoComplete, index }) {
  return (
    <div className={`${styles.field} ${full ? styles.full : ''} reveal`} style={{ '--i': index }}>
      {as === 'select' ? (
        <select id={id} name={id} required={required} defaultValue="" className={styles.control}>
          <option value="" disabled hidden />
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      ) : as === 'textarea' ? (
        <textarea id={id} name={id} rows={3} placeholder=" " className={styles.control} />
      ) : (
        <input
          id={id}
          name={id}
          type={type}
          required={required}
          placeholder=" "
          autoComplete={autoComplete}
          className={styles.control}
        />
      )}
      <label htmlFor={id} className={styles.label}>
        {label}
        {required && <span aria-hidden="true"> *</span>}
      </label>
      {as === 'select' && (
        <span className={styles.chevron} aria-hidden="true">
          ↓
        </span>
      )}
      <span className={styles.line} aria-hidden="true" />
    </div>
  )
}

export default function LeadForm() {
  const ref = useReveal({ threshold: 0.1 })
  const magRef = useMagnetic(0.2)

  const onSubmit = (e) => {
    e.preventDefault()
    const d = new FormData(e.currentTarget)
    const subject = encodeURIComponent(`Pedido de proposta — ${d.get('empresa')}`)
    const body = encodeURIComponent(
      [
        `Empresa: ${d.get('empresa')}`,
        `Contato: ${d.get('contato')}`,
        `Telefone: ${d.get('telefone')}`,
        `E-mail: ${d.get('email')}`,
        `Segmento: ${d.get('segmento')}`,
        `Necessidade: ${d.get('necessidade')}`,
        `Obs: ${d.get('obs') || '—'}`,
      ].join('\n'),
    )
    window.location.href = `mailto:${site.email}?subject=${subject}&body=${body}`
  }

  return (
    <section id="orcamento" className="section" data-theme="pistachio" ref={ref}>
      <div className="container">
        <div className={styles.grid}>
          <div className={styles.intro}>
            <div className="section-head">
              <p className="micro reveal" style={{ '--i': 0 }}>
                {leadForm.kicker}
              </p>
              <h2 className="reveal" style={{ '--i': 1 }}>
                {leadForm.title}
              </h2>
            </div>
            <p className={`${styles.lead} reveal`} style={{ '--i': 2 }}>
              {leadForm.lead}
            </p>
            <div className="reveal" style={{ '--i': 3 }}>
              <TextCta href={site.whatsapp} target="_blank" rel="noreferrer">
                {leadForm.whatsappCta}
              </TextCta>
            </div>
          </div>
          <form className={styles.form} onSubmit={onSubmit}>
            <Field id="empresa" label={leadForm.fields.empresa} required autoComplete="organization" index={4} />
            <Field id="contato" label={leadForm.fields.contato} required autoComplete="name" index={5} />
            <Field id="telefone" label={leadForm.fields.telefone} type="tel" required autoComplete="tel" index={6} />
            <Field id="email" label={leadForm.fields.email} type="email" required autoComplete="email" index={7} />
            <Field id="segmento" label={leadForm.fields.segmento} as="select" options={leadForm.segmentos} required index={8} />
            <Field
              id="necessidade"
              label={leadForm.fields.necessidade}
              as="select"
              options={leadForm.necessidades}
              required
              index={9}
            />
            <Field id="obs" label={leadForm.fields.obs} as="textarea" full index={10} />
            <div className={`${styles.actions} reveal`} style={{ '--i': 11 }}>
              <span ref={magRef} className={styles.magnet}>
                <button type="submit" className={styles.submit}>
                  <span className={styles.glyph} aria-hidden="true">
                    ↳
                  </span>
                  <span className="link-underline">{leadForm.submit}</span>
                </button>
              </span>
              <p className={styles.privacy}>{leadForm.privacy}</p>
            </div>
          </form>
        </div>
      </div>
    </section>
  )
}
