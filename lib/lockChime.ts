// P1-6-R3 反思鎖尾 5 秒溫和提示音（Leo 2026-07-16）
//
// 60 秒鎖最後 5 秒：OscillatorNode 正弦波（最柔和波形，禁方波／鋸齒波），
// 每秒一響共 5 響，每響 0.8s + 0.2s 間隔，100% 程序化生成 —— 零外部音檔。
// 雙耳節拍：左聲道 base Hz、右聲道 base+4 Hz（4Hz theta 差頻，要戴耳機先有效；
// 冇耳機聽落只係好輕嘅拍頻，無害）。
// 柔和模式（calmLock／gentleLock）：174Hz（舒緩頻率）＋音量減至 0.08。
// 每響 50ms attack 漸入 + 線性 fade-out（gain envelope 防 pop 雜音）。
//
// 降級策略：唔支援 Web Audio／autoplay 政策攔 → 靜默 return，永不 throw。
// 同 /relax SoloPlayer 各自獨立 AudioContext（播完 6.5s 後自動 close），冇衝突。

export function playLockChime(soft: boolean): void {
  try {
    if (typeof window === 'undefined' || typeof window.AudioContext !== 'function') return
    const ctx = new AudioContext()
    if (ctx.state === 'suspended') {
      // 用戶啱啱撳過選項／自診掣，通常 resume 得；唔得就由佢靜
      void ctx.resume().catch(() => {})
    }
    const base = soft ? 174 : 220 // A3=220（標準）；174Hz（柔和舒緩）
    const peak = soft ? 0.08 : 0.15
    const t0 = ctx.currentTime + 0.05

    for (let i = 0; i < 5; i++) {
      const start = t0 + i // 每秒一響
      for (const [freq, pan] of [
        [base, -1],
        [base + 4, 1],
      ] as const) {
        const osc = ctx.createOscillator()
        osc.type = 'sine'
        osc.frequency.value = freq
        const gain = ctx.createGain()
        gain.gain.setValueAtTime(0, start)
        gain.gain.linearRampToValueAtTime(peak, start + 0.05)
        gain.gain.linearRampToValueAtTime(0, start + 0.8)
        const panner = ctx.createStereoPanner()
        panner.pan.value = pan
        osc.connect(gain).connect(panner).connect(ctx.destination)
        osc.start(start)
        osc.stop(start + 0.85)
      }
    }
    setTimeout(() => {
      void ctx.close().catch(() => {})
    }, 6500)
  } catch {
    /* 靜默降級 —— 冇聲都唔可以阻住個鎖正常運作 */
  }
}
