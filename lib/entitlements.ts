// The platform is 100% free, for everyone — fully open, no limits or gating of any
// kind. Every subject is available to every visitor, signed in or not. (Google
// sign-in still exists, but only to sync progress across devices; it grants no
// extra access.)
//
// The only thing the practice runner still needs from here is how many questions to
// draw per run.

// ── 一節幾多題 ────────────────────────────────────────────────────────────
// 2026-09-09：由 20 減到 10（Yuna 裁決）。
//
// 兩個實測數字推出呢個決定：
//   · 484 節入面 357 節（74%）冇做夠 20 題 —— 中位數停喺 15 題
//   · 174 個帳號只有 97 個做過至少一節（56%）
// 假設係：見到「20 題」本身就係一道門檻。目標係將 74% 壓到 30%，
// 觀察一個月（2026-10-09 覆檢）。呢個係一個【假設】，唔係已證實嘅結論 ——
// 覆檢嗰陣要對返數，唔啱就改返。
// 2026-10-09 覆檢（創辦人 2026-10-08 回覆「38a」）：維持 10。74% 量的是已完成的節，
// 不是中途離開率；改以匿名計數再檢討（暫定 2026-11-09），見 docs/charter-review-2026-10-09.md。
//
// 為咗 ADHD 學生：10 題 × 約 1.5 分鐘 ≈ 15 分鐘，穩陣咁坐喺一個番茄鐘
// （25 分鐘）之內，而且留返位畀答錯之後嗰 30 秒反思鎖。做完想繼續，
// 再開一節就得 —— 十題十題咁加上去，而唔係一開始就擺 20 題喺佢面前。
//
// ⚠️ 呢個數字係單一來源。改之前記住：
//   · 憲章 §7 講「按 3:5:2 出卷，一節 10 題只有 2 題 hard」—— 條文一直
//     假設咗 10，係代碼嗰邊寫住 20。今次改完，條文同代碼先至對得返。
//   · 憲章 §12「每 session 20 題」講嘅係【出題入庫】嘅批次大小，
//     唔係練習卷長度，唔受本次改動影響。
//   · 等級預測按比例計（lib/grading.ts:25 `score / totalMarks`），
//     所以數字改咗都唔會計錯。但樣本細一半，區間會闊咗 ——
//     /prediction-method 同 FAQ 嗰兩段文案已同步改。
export const SESSION_SIZE = 10

// ── 一節大約要幾耐 ────────────────────────────────────────────────────────
// 每題約 1.5 分鐘（§7.1 的估算，2026-09-09 反思鎖剷除後只計作答時間），
// 最少寫 5 分鐘。首頁快速開始及科目頁快速開始卡同用此函數，兩處不再各自計算。
export const MINUTES_PER_QUESTION = 1.5

export function sessionMinutes(questions: number = SESSION_SIZE): number {
  return Math.max(5, Math.round(questions * MINUTES_PER_QUESTION))
}
