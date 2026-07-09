/*
 * Corda dedilhada por síntese Karplus-Strong: um sopro de ruído recircula
 * num delay do tamanho do período da nota, passando por um filtro de média —
 * os harmônicos agudos morrem primeiro e a amplitude decai exponencialmente,
 * como numa corda real. Sem samples: cada buffer é gerado uma vez, sob demanda.
 *
 * Afinação padrão do violão, da corda mais grave à mais aguda.
 */
export const NOTES = [
  { label: 'mi', freq: 82.41, decay: 4.2 }, // E2
  { label: 'lá', freq: 110.0, decay: 4.0 }, // A2
  { label: 'ré', freq: 146.83, decay: 3.6 }, // D3
  { label: 'sol', freq: 196.0, decay: 3.2 }, // G3
  { label: 'si', freq: 246.94, decay: 2.9 }, // B3
  { label: 'mi', freq: 329.63, decay: 2.6 }, // E4
]

let ctx = null
let master = null
const buffers = []

function getContext() {
  if (ctx) return ctx
  const AC = window.AudioContext || window.webkitAudioContext
  if (!AC) return null
  ctx = new AC()
  // Compressor de segurança: dedilhar as seis cordas de uma vez não estoura
  master = ctx.createDynamicsCompressor()
  master.threshold.value = -18
  master.knee.value = 24
  master.ratio.value = 4
  master.connect(ctx.destination)
  return ctx
}

function renderBuffer(c, { freq, decay }) {
  const sr = c.sampleRate
  const n = Math.ceil(sr * (decay + 0.3))
  const buf = c.createBuffer(1, n, sr)
  const out = buf.getChannelData(0)
  const period = Math.max(2, Math.round(sr / freq))
  const line = new Float32Array(period)
  for (let i = 0; i < period; i++) line[i] = Math.random() * 2 - 1
  // Duas passadas de média no ruído inicial: ataque mais quente, menos "chiado"
  for (let pass = 0; pass < 2; pass++) {
    let prev = line[period - 1]
    for (let i = 0; i < period; i++) {
      const cur = line[i]
      line[i] = (cur + prev) / 2
      prev = cur
    }
  }
  // Amortecimento por recirculação calibrado para -60 dB no tempo de decay
  const damp = Math.pow(10, -3 / (freq * decay))
  let idx = 0
  for (let i = 0; i < n; i++) {
    const cur = line[idx]
    const next = line[(idx + 1) % period]
    out[i] = cur
    line[idx] = damp * 0.5 * (cur + next)
    idx = (idx + 1) % period
  }
  // Fade no rabo do buffer evita clique quando a fonte termina
  const fade = Math.min(n, Math.floor(sr * 0.25))
  for (let i = 0; i < fade; i++) out[n - 1 - i] *= i / fade
  return buf
}

export function pluck(stringIndex) {
  const c = getContext()
  if (!c) return
  if (c.state === 'suspended') c.resume()
  let buf = buffers[stringIndex]
  if (!buf) {
    buf = renderBuffer(c, NOTES[stringIndex])
    buffers[stringIndex] = buf
  }
  const src = c.createBufferSource()
  src.buffer = buf
  const gain = c.createGain()
  gain.gain.value = 0.22
  src.connect(gain)
  gain.connect(master)
  src.start()
}

/*
 * Navegadores só liberam áudio após um gesto "de verdade" (clique/tecla) —
 * e o primeiro hover pode chegar antes disso. Retomamos o contexto no
 * primeiro gesto da página para que as cordas já nasçam audíveis.
 */
let armed = false
export function unlockAudio() {
  if (armed) return
  armed = true
  const resume = () => {
    const c = getContext()
    if (c && c.state === 'suspended') c.resume()
  }
  window.addEventListener('pointerdown', resume, { once: true, passive: true })
  window.addEventListener('keydown', resume, { once: true })
}
