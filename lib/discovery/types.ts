// 發現引擎 —— 型別（BUILD-SPEC §1.3）
//
// 一節練習留低嘅單位係「發現」，唔係「錯誤」。學生做完一節，帶走嘅係一張
// 具體清單（「共用品 ≠ 政府提供嘅嘢」），唔係一個分數。
//
// ⚠️ 維度【沿用現有 ReverseCause】，唔另開一套。
// BUILD-SPEC §2.2 寫 'concept' | 'trap' | 'careless'，但 repo 由 2026-07 起
// 一直用 'A' | 'B' | 'C'（lib/reverseLog.ts），對應同一組概念：
//     A = 概念盲區   B = 審題陷阱   C = 運算粗心
// 兩套並存嘅後果唔係「多咗個 type」咁簡單 —— 錯因雷達、重溫排程、
// gentleSuggestions 全部食 ReverseCause，新開一套就會由第一日開始分叉，
// 而學生喺兩個地方會見到同一件事有兩個名。可讀名喺 dimensions.ts 提供。
import type { ReverseCause } from '@/lib/reverseLog'

export type Dimension = ReverseCause

export interface Discovery {
  /** crypto.randomUUID()。純本機，唔會離開呢部機。 */
  id: string
  questionId: string
  subjectId: string
  dimension: Dimension
  /** 學生自己揀（或自己寫）嘅具名描述 —— 遲啲佢自己睇返要睇得明。 */
  label: string
  createdAt: number
}

export interface SessionSummary {
  startedAt: number
  endedAt: number
  /** 做咗幾多題。可以顯示 —— 呢個係事實，唔係評價。 */
  attempted: number
  discoveries: Discovery[]
}

// ⚠️ 紅線（BUILD-SPEC §1.3）：SessionSummary 永遠唔可以加 correctCount 或 accuracy。
//
// 理由係【發現敘事】本身，唔係任何合規要求 —— 呢點要講清楚，因為規格書原稿
// 寫嘅理由（「L2 裁決本身就禁咗儲存正確率」）已經唔成立：憲章 §16.E 喺
// 2026-09-04 經 Brian ＋ Yuna 雙簽修訂，明文准許 dse_topic_stats 上雲，
// 而 lib/progress.ts 一直有計 accuracy。
//
// 用一個【已經廢止嘅裁決】做理由去守一條紅線，同憲章 §16.A 記低嗰個教訓一樣：
// 理由錯咗，下一個人一查證就會連紅線一齊拆。所以理由要寫真嗰個 ——
// 一節練習結尾擺個分數出嚟，會即刻將「我今日搞明白咗三樣嘢」壓返做
// 「我啱咗六題」，而後者正正係學生逃避溫書嘅原因。
