// Punchy game SFX synthesised live with the Web Audio API — zero audio assets,
// zero network, zero copyright, and no multi-track lockup (every call spins up its
// own short-lived nodes). Degrades to a silent no-op where Web Audio is missing.

const MUTE_KEY = 'dse_muted'

let ctx: AudioContext | null = null
function ac(): AudioContext | null {
  if (typeof window === 'undefined') return null
  try {
    if (!ctx) {
      const AC: typeof AudioContext | undefined =
        window.AudioContext || (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext
      if (!AC) return null
      ctx = new AC()
    }
    if (ctx.state === 'suspended') ctx.resume().catch(() => {})
    return ctx
  } catch {
    return null
  }
}

export function isMuted(): boolean {
  if (typeof window === 'undefined') return false
  try {
    return localStorage.getItem(MUTE_KEY) === '1'
  } catch {
    return false
  }
}
export function setMuted(m: boolean): void {
  try {
    localStorage.setItem(MUTE_KEY, m ? '1' : '0')
  } catch {
    /* ignore */
  }
}

interface ToneOpts {
  freq: number
  type?: OscillatorType
  dur: number
  gain?: number
  slideTo?: number
  delay?: number
}
function tone(o: ToneOpts): void {
  const c = ac()
  if (!c) return
  const t0 = c.currentTime + (o.delay ?? 0)
  const osc = c.createOscillator()
  const g = c.createGain()
  osc.type = o.type ?? 'sine'
  osc.frequency.setValueAtTime(o.freq, t0)
  if (o.slideTo) osc.frequency.exponentialRampToValueAtTime(Math.max(1, o.slideTo), t0 + o.dur)
  const peak = o.gain ?? 0.18
  g.gain.setValueAtTime(0.0001, t0)
  g.gain.exponentialRampToValueAtTime(peak, t0 + 0.012)
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + o.dur)
  osc.connect(g)
  g.connect(c.destination)
  osc.start(t0)
  osc.stop(t0 + o.dur + 0.03)
}
function noise(dur: number, gain = 0.2): void {
  const c = ac()
  if (!c) return
  const t0 = c.currentTime
  const buf = c.createBuffer(1, Math.max(1, Math.floor(c.sampleRate * dur)), c.sampleRate)
  const data = buf.getChannelData(0)
  for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length)
  const src = c.createBufferSource()
  src.buffer = buf
  const g = c.createGain()
  g.gain.setValueAtTime(gain, t0)
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur)
  const hp = c.createBiquadFilter()
  hp.type = 'highpass'
  hp.frequency.value = 700
  src.connect(hp)
  hp.connect(g)
  g.connect(c.destination)
  src.start(t0)
  src.stop(t0 + dur)
}

/** Clean confirm blip for an ordinary correct answer. */
export function playCorrect(): void {
  if (isMuted()) return
  tone({ freq: 660, type: 'triangle', dur: 0.12, slideTo: 990, gain: 0.16 })
}
/** Ascending "zap" for a combo milestone — more energy the higher the combo. */
export function playCombo(n: number): void {
  if (isMuted()) return
  const lift = Math.min(1 + n * 0.05, 2)
  tone({ freq: 520 * lift, type: 'square', dur: 0.08, slideTo: 1040 * lift, gain: 0.14 })
  tone({ freq: 780 * lift, type: 'square', dur: 0.1, slideTo: 1560 * lift, gain: 0.12, delay: 0.06 })
}
/** Heavier shotgun hit for nailing a 🔴 hell-level question. */
export function playHell(): void {
  if (isMuted()) return
  tone({ freq: 300, type: 'sawtooth', dur: 0.18, slideTo: 1200, gain: 0.18 })
  tone({ freq: 900, type: 'square', dur: 0.12, slideTo: 1800, gain: 0.12, delay: 0.1 })
}
/** Crunchy "screen crack" for a wrong answer. */
export function playWrong(): void {
  if (isMuted()) return
  noise(0.18, 0.22)
  tone({ freq: 320, type: 'sawtooth', dur: 0.22, slideTo: 80, gain: 0.16 })
}
/** Jackpot arpeggio for the 5% gacha drop. */
export function playJackpot(): void {
  if (isMuted()) return
  ;[0, 0.09, 0.18, 0.28].forEach((d, i) =>
    tone({ freq: 523 * (1 + i * 0.26), type: 'triangle', dur: 0.18, gain: 0.16, delay: d }),
  )
}
