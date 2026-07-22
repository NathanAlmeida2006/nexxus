import { useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { Link } from 'react-router-dom'
import AnchorLink from '../../ui/AnchorLink'
import { site } from '../../../data/content'
import useHeaderHide from '../../../hooks/useHeaderHide'
import useHeaderTheme from '../../../hooks/useHeaderTheme'
import { onAnchorClick } from '../../../hooks/useLenis'
import useMagnetic from '../../../hooks/useMagnetic'
import RollingText from '../../ui/RollingText'
import MenuOverlay from '../MenuOverlay/MenuOverlay'
import styles from './Header.module.css'

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const { hidden, atTop } = useHeaderHide()
  const { pathname } = useLocation()
  const theme = useHeaderTheme(pathname)
  const menuBtnRef = useRef(null)
  const magRef = useMagnetic(0.3)

  const close = () => {
    setMenuOpen(false)
    menuBtnRef.current?.focus()
  }

  return (
    <>
      <header
        className={styles.header}
        data-hidden={hidden && !menuOpen}
        data-top={atTop}
        data-on={menuOpen ? 'navy' : theme}
      >
        <div className={styles.inner}>
          {pathname === '/' ? (
            <a href="#inicio" className={styles.wordmark} onClick={onAnchorClick}>
              {site.wordmark}
            </a>
          ) : (
            <Link to="/" className={styles.wordmark}>
              {site.wordmark}
            </Link>
          )}
          <nav className={styles.actions} aria-label="Ações rápidas">
            <AnchorLink id="orcamento" className={`micro ${styles.talk}`}>
              <RollingText>bora conversar?</RollingText>
            </AnchorLink>
            <span ref={magRef} className={styles.magnet}>
              <button
                ref={menuBtnRef}
                type="button"
                className={`micro ${styles.menuBtn}`}
                aria-expanded={menuOpen}
                aria-controls="menu-overlay"
                onClick={() => (menuOpen ? close() : setMenuOpen(true))}
              >
                <RollingText>{menuOpen ? 'fechar' : 'menu'}</RollingText>
              </button>
            </span>
          </nav>
        </div>
      </header>
      <MenuOverlay open={menuOpen} onClose={close} />
    </>
  )
}
