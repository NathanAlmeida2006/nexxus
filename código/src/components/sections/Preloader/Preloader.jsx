import { useEffect, useRef, useState } from 'react'
import { preloader } from '../../../data/content'
import { getLenis } from '../../../hooks/useLenis'
import { prefersReducedMotion } from '../../../utils/media'
import styles from './Preloader.module.css'

/* Preloader tipográfico: "somos a nexxus." em stagger, depois o painel sobe */
export default function Preloader({ onDone }) {
  const [leaving, setLeaving] = useState(false)
  const doneRef = useRef(false)

  useEffect(() => {
    document.documentElement.classList.add('is-loading')
    getLenis()?.stop()

    const finish = () => {
      if (doneRef.current) return
      doneRef.current = true
      document.documentElement.classList.remove('is-loading')
      getLenis()?.start()
      onDone()
    }

    const reduced = prefersReducedMotion()
    const tLeave = setTimeout(() => setLeaving(true), reduced ? 0 : 1700)
    const tDone = setTimeout(finish, reduced ? 250 : 2450)
    return () => {
      clearTimeout(tLeave)
      clearTimeout(tDone)
      document.documentElement.classList.remove('is-loading')
    }
  }, [onDone])

  return (
    <div className={styles.preloader} data-leaving={leaving} aria-hidden="true">
      <div className={styles.lines}>
        {Array.from({ length: preloader.repeats }, (_, i) => (
          <span key={i} className={styles.line} style={{ '--i': i }}>
            {preloader.line}
          </span>
        ))}
      </div>
    </div>
  )
}
