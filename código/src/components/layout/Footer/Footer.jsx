import { footer, site } from '../../../data/content'
import { scrollToId } from '../../../hooks/useLenis'
import useReveal from '../../../hooks/useReveal'
import RevealText from '../../ui/RevealText'
import RollingText from '../../ui/RollingText'
import TextCta from '../../ui/TextCta'
import styles from './Footer.module.css'

export default function Footer() {
  const ref = useReveal({ threshold: 0.1 })

  return (
    <footer id="contato" className={`section ${styles.footer}`} data-theme="navy" ref={ref}>
      <div className="container">
        <RevealText as="h2" lines={footer.titleLines} className={styles.title} split="chars" />
        <div className={styles.grid}>
          <div className={`${styles.col} reveal`} style={{ '--i': 2 }}>
            <h3 className={`micro ${styles.colTitle}`}>{footer.contact.kicker}</h3>
            <p className={styles.lead}>{footer.contact.lead}</p>
            <div className={styles.ctas}>
              <TextCta href={site.whatsapp} target="_blank" rel="noreferrer">
                {footer.contact.whatsappLabel}
              </TextCta>
              <TextCta href={`mailto:${site.email}`} glyph="@">
                {footer.contact.emailLabel}
              </TextCta>
            </div>
          </div>
          <div className={`${styles.col} reveal`} style={{ '--i': 3 }}>
            <h3 className={`micro ${styles.colTitle}`}>{footer.socials.kicker}</h3>
            <ul className={styles.socialList}>
              {footer.socials.items.map((s) => (
                <li key={s.label}>
                  <a href={s.href} target="_blank" rel="noreferrer">
                    <RollingText>{s.label}</RollingText>
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div className={`${styles.col} reveal`} style={{ '--i': 4 }}>
            <h3 className={`micro ${styles.colTitle}`}>{footer.address.kicker}</h3>
            <p className={styles.address}>
              {footer.address.lines.map((line) => (
                <span key={line}>
                  {line}
                  <br />
                </span>
              ))}
            </p>
            <a
              className={`micro link-underline ${styles.gps}`}
              href={footer.address.gps.href}
              target="_blank"
              rel="noreferrer"
            >
              GPS {footer.address.gps.label}
            </a>
          </div>
        </div>
        <div className={styles.bottom}>
          <p className="micro">{footer.bottom.copyright}</p>
          <p className={`micro ${styles.bottomClaim}`}>{footer.bottom.claim}</p>
          <button type="button" className="micro link-underline" onClick={() => scrollToId('#inicio')}>
            {footer.bottom.backToTop}
          </button>
        </div>
      </div>
    </footer>
  )
}
