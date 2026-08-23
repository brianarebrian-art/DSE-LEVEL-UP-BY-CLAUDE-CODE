// 答對輕柔提示音（第 1 週 · 引擎一「溫暖即時反饋」）
//
// 規格：輕柔「叮」聲，可關閉，預設關閉。
// 100% 程序化生成（OscillatorNode 正弦波），零外部音檔、零新套件、零經常性成本。
//
// 音色設計理由：
//   • 只用 sine（最柔和波形）—— 禁 square／sawtooth，泛音刺耳，對聽覺敏感學生係干擾源。
//   • 兩個音（C6 1046.5Hz → G6 1568Hz，完全五度）輕微上行，語意為「向前」而非「勝利」。
//     刻意避開大三度上行琶音（典型遊戲得分音效），與憲章「無慶祝式獎賞」一致。
//   • 總長 0.34 秒，峰值 gain 0.06 —— 遠低於 lockChime 的 0.15，屬背景級提示。
//   • 每個音有 30ms attack 漸入及線性 fade-out（gain envelope），防止 pop 雜音。
//
// 答錯不設任何音效 —— 憲章第 7 條：答錯的回饋力度必須與答對一致，
// 而「一致」在此處的實作是「兩邊都不用聲音表達對錯判斷」，
// 答對的音只是操作確認，不是評價。故答錯時保持靜默，並非懲罰性的「無獎勵」。
//
// 降級策略：不支援 Web Audio／被 autoplay 政策攔截 → 靜默 return，永不 throw。

export const ANSWER_SOUND_KEY = 'dse_answer_sound'

/** 讀取答題提示音設定。預設關閉 —— 學生需主動開啟（SEN 友善）。 */
export function isAnswerSoundOn(): boolean {
  try {
    return localStorage.getItem(ANSWER_SOUND_KEY) === '1'
  } catch {
    return false
  }
}

/**
 * 播放答對提示音。設定關閉時直接 return，呼叫端無須自行判斷。
 * 全部例外都吞掉：沒有聲音絕不可以阻礙作答流程。
 */
export function playCorrectChime(): void {
  try {
    if (typeof window === 'undefined' || typeof window.AudioContext !== 'function') return
    if (!isAnswerSoundOn()) return

    const ctx = new AudioContext()
    if (ctx.state === 'suspended') {
      // 學生剛按過選項，屬用戶手勢範圍內，通常 resume 成功；失敗就保持靜默。
      void ctx.resume().catch(() => {})
    }

    const t0 = ctx.currentTime + 0.01
    const peak = 0.06
    // [頻率 Hz, 起始偏移秒, 持續秒]
    const notes: readonly (readonly [number, number, number])[] = [
      [1046.5, 0, 0.22], // C6
      [1568.0, 0.12, 0.22], // G6
    ]

    for (const [freq, offset, dur] of notes) {
      const start = t0 + offset
      const osc = ctx.createOscillator()
      osc.type = 'sine'
      osc.frequency.value = freq
      const gain = ctx.createGain()
      gain.gain.setValueAtTime(0, start)
      gain.gain.linearRampToValueAtTime(peak, start + 0.03)
      gain.gain.linearRampToValueAtTime(0, start + dur)
      osc.connect(gain).connect(ctx.destination)
      osc.start(start)
      osc.stop(start + dur + 0.02)
    }

    setTimeout(() => {
      void ctx.close().catch(() => {})
    }, 900)
  } catch {
    /* 靜默降級 */
  }
}
