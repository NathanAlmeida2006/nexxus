import { useEffect, useRef } from 'react'
import { nav, site } from '../../../data/content'
import { getLenis, scrollToId } from '../../../hooks/useLenis'
import RollingText from '../../ui/RollingText'
import styles from './MenuOverlay.module.css'

export default function MenuOverlay({ open, onClose }) {
  const firstLinkRef = useRef(null)

  useEffect(() => {
    if (!open) return undefined
    const lenis = getLenis()
    lenis?.stop()
    document.documentElement.classList.add('menu-open')
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    const t = setTimeout(() => firstLinkRef.current?.focus(), 400)
    return () => {
      window.removeEventListener('keydown', onKey)
      clearTimeout(t)
      document.documentElement.classList.remove('menu-open')
      lenis?.start()
    }
  }, [open, onClose])

  const go = (e) => {
    e.preventDefault()
    const href = e.currentTarget.getAttribute('href')
    onClose()
    setTimeout(() => scrollToId(href), 120)
  }

  return (
    <div
      id="menu-overlay"
      className={styles.overlay}
      data-open={open}
      aria-hidden={!open}
      role="dialog"
      aria-modal={open || undefined}
      aria-label="Menu de navegação"
    >
      <nav aria-label="Navegação principal">
        <ol className={styles.list}>
          {nav.map((item, i) => (
            <li key={item.id} className={styles.item} style={{ '--i': i }}>
              <a
                ref={i === 0 ? firstLinkRef : undefined}
                href={`#${item.id}`}
                className={styles.link}
                onClick={go}
                tabIndex={open ? 0 : -1}
              >
                <span className={`micro ${styles.index}`}>{String(i + 1).padStart(2, '0')}</span>
                <RollingText>{item.label}</RollingText>
              </a>
            </li>
          ))}
        </ol>
      </nav>
      <div className={styles.foot} style={{ '--i': nav.length }}>
        <a className="micro link-underline" href={`mailto:${site.email}`} tabIndex={open ? 0 : -1}>
          {site.email}
        </a>
        <p className={`micro ${styles.claim}`}>{site.claim}</p>
      </div>
    </div>
  )
}
