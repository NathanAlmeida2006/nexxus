import { useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { nav, site } from '../../../data/content'
import { getLenis, scrollToId } from '../../../hooks/useLenis'
import { pad2 } from '../../../utils/format'
import RollingText from '../../ui/RollingText'
import styles from './MenuOverlay.module.css'

export default function MenuOverlay({ open, onClose }) {
  const firstLinkRef = useRef(null)
  const { pathname } = useLocation()

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
          {nav.map((item, i) => {
            const conteudo = (
              <>
                <span className={`micro ${styles.index}`}>{pad2(i + 1)}</span>
                <RollingText>{item.label}</RollingText>
              </>
            )
            const comuns = {
              ref: i === 0 ? firstLinkRef : undefined,
              className: styles.link,
              tabIndex: open ? 0 : -1,
            }
            return (
              <li key={item.label} className={styles.item} style={{ '--i': i }}>
                {item.to ? (
                  <Link {...comuns} to={item.to} onClick={onClose}>
                    {conteudo}
                  </Link>
                ) : pathname === '/' ? (
                  <a {...comuns} href={`#${item.id}`} onClick={go}>
                    {conteudo}
                  </a>
                ) : (
                  <Link {...comuns} to={`/#${item.id}`} onClick={onClose}>
                    {conteudo}
                  </Link>
                )}
              </li>
            )
          })}
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
