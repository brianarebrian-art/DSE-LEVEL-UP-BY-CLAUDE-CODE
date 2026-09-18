import { DailyStatsCard } from 'dse-level-up'

// 每日戰績卡 —— 專門畀學生自己 share 出去（html2canvas 影成 PNG）。
// ⚠️ 呢張卡**唔跟主題變數走**：佢用鎖定嘅標準色版（含四隻霓虹色），
// 因為張圖會離開網站，喺 IG／WhatsApp 度都要睇得明。呢個係 §14 色系
// 嗰條「霓虹只保留喺導出圖卡」條文嘅唯一合法用途。

const data = {
  date: '2026-09-18',
  subject: '經濟',
  questionsDone: 10,
  accuracy: 80, // 整數百分比 —— 真實呼叫點傳 Math.round(score / total * 100)，唔係 0–1 小數
  correctCount: 8,
  totalCount: 10,
  timeSpent: '16 分鐘',
  avgPerQuestion: '1 分 36 秒',
  tiers: [
    { label: '基礎', correct: 3, total: 3, color: '#57685C' },
    { label: '核心', correct: 4, total: 5, color: '#706347' },
    { label: '進階', correct: 1, total: 2, color: '#9B5DE5' },
  ],
  strengthTopic: '供求分析',
  focusTopic: '彈性計算',
  igLink: 'dse-level-up-by-claude-code.vercel.app',
}

export function Zh() {
  return <DailyStatsCard data={data} />
}

export function En() {
  return <DailyStatsCard data={data} en />
}
