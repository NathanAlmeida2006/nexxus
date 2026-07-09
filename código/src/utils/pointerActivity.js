/*
 * Idade do último movimento de ponteiro. Serve para distinguir hover real
 * de elemento que passou sob um cursor parado durante a rolagem (as cordas
 * do Manifesto só dedilham com movimento recente). O listener global entra
 * uma única vez, no primeiro uso — não no import.
 */
let lastMove = 0
let armed = false

export function trackPointerActivity() {
  if (armed) return
  armed = true
  window.addEventListener(
    'pointermove',
    () => {
      lastMove = performance.now()
    },
    { passive: true },
  )
}

export function msSincePointerMove() {
  return performance.now() - lastMove
}
