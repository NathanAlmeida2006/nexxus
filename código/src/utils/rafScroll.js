/*
 * Padrão comum dos efeitos dirigidos por scroll: agenda `update` para o
 * próximo animation frame a cada scroll/resize (no máximo 1× por frame)
 * e devolve o cleanup — cada hook fica só com a sua medição.
 */
export default function listenScrollRaf(update, { resize = true, immediate = true } = {}) {
  let raf = 0
  const run = () => {
    raf = 0
    update()
  }
  const schedule = () => {
    if (!raf) raf = requestAnimationFrame(run)
  }
  if (immediate) update()
  window.addEventListener('scroll', schedule, { passive: true })
  if (resize) window.addEventListener('resize', schedule)
  return () => {
    window.removeEventListener('scroll', schedule)
    if (resize) window.removeEventListener('resize', schedule)
    cancelAnimationFrame(raf)
  }
}

/* Escreve a CSS var só quando o valor muda — poupa invalidação de estilo
   nos elementos cujo valor já saturou em 0 ou 1 */
export function setCssVar(el, name, value) {
  if (el.style.getPropertyValue(name) !== value) el.style.setProperty(name, value)
}
