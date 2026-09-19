// 等級預測頁（/predictor）用嘅兩個聚合：逐週正確率、錯因三維比例。
//
// 純函數，唔讀 localStorage —— 由呼叫者傳入 loadAttempts() 同 getReverseLog()
// 嘅結果，所以測試唔使模擬瀏覽器。
//
// ══ 點解係「逐週」而唔係逐日 ══
// /dashboard 嘅 ProgressTrajectory 已經畫咗最近 14 個活躍日。同一條線喺兩頁
// 各畫一次冇意思。逐週係另一個粒度，而且係憲章 §7.2 反思鎖實驗 2026-11-09
// 覆檢指定要睇嗰條 curve（「每星期答啱幾多條、答錯幾多條、正確率」）——
// 學生自己睇到嘅，同我哋覆檢用嘅，係同一條線。
//
// ══ 點解用「滾動七日」而唔用星期一至日 ══
// 月曆週要揀時區同一週由邊日開始，而且「本週」喺星期一朝早只有幾粒鐘，
// 條線最右嗰點會永遠係一個細樣本。滾動七日每一格都係完整七日。
import type { AttemptRecord } from './progress'
import type { ReverseCause, ReverseLogEntry } from './reverseLog'
import { sessionIsValid } from './mastery'

const DAY = 86_400_000
const WEEK = 7 * DAY

export interface WeekBucket {
  /** 0 = 過去七日，1 = 七至十四日前，如此類推。 */
  weeksAgo: number
  correct: number
  total: number
  /** 冇作答嗰週係 null，唔係 0 —— 冇做過同做錯晒係兩回事。 */
  accuracy: number | null
}

/**
 * 最近 `weeks` 個滾動週嘅正確率，由舊至新排列（圖表由左至右讀）。
 *
 * 太快完成嘅節（每題少過 3 秒，見 mastery.ts `sessionIsValid`）唔計 ——
 * 同等級估算用同一條規則，否則兩個數字喺同一版上面會自相矛盾。
 */
export function weeklyAccuracy(
  attempts: readonly AttemptRecord[],
  now: number,
  weeks = 8,
): WeekBucket[] {
  const buckets: WeekBucket[] = Array.from({ length: weeks }, (_, i) => ({
    weeksAgo: i,
    correct: 0,
    total: 0,
    accuracy: null,
  }))
  for (const a of attempts) {
    const age = now - a.timestamp
    if (age < 0) continue // 未來時間戳：裝置時鐘錯，唔好估佢屬邊週
    const i = Math.floor(age / WEEK)
    if (i >= weeks) continue
    if (!sessionIsValid(a.total, a.elapsed)) continue
    buckets[i].correct += a.score
    buckets[i].total += a.total
  }
  for (const b of buckets) b.accuracy = b.total > 0 ? b.correct / b.total : null
  return buckets.reverse()
}

export interface CauseShares {
  counts: Record<ReverseCause, number>
  total: number
}

/** 某時間點之後嘅錯因自診分佈。 */
export function causeShares(log: readonly ReverseLogEntry[], since: number): CauseShares {
  const counts: Record<ReverseCause, number> = { A: 0, B: 0, C: 0 }
  let total = 0
  for (const e of log) {
    if (e.ts < since) continue
    if (e.cause !== 'A' && e.cause !== 'B' && e.cause !== 'C') continue
    counts[e.cause]++
    total++
  }
  return { counts, total }
}
