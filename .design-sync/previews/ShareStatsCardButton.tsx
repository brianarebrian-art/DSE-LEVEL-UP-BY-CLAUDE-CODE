import { ShareStatsCardButton } from 'dse-level-up'

// 「分享戰績卡」—— 用 html2canvas 將 off-screen 嘅 DailyStatsCard 影成 PNG，
// 再經 Web Share API（手機）或下載（桌面）交畀用戶。
//
// 點解唔用 @vercel/og：用瀏覽器自己嘅字型 → 中文正常顯示、零 Edge Function
// invocation（最貼 $0）、繞開 CJK 字型嵌入死結。html2canvas 動態 import，唔入主 bundle。
// 分享係用戶自發（分享自己嘅數據），唔係平台代發。

const data = {
  date: '2026-09-18',
  subject: '經濟',
  questionsDone: 10,
  accuracy: 80,
  correctCount: 8,
  totalCount: 10,
  timeSpent: '16 分鐘',
  avgPerQuestion: '1 分 36 秒',
  strengthTopic: '供求分析',
  focusTopic: '彈性計算',
  igLink: 'dse-level-up-by-claude-code.vercel.app',
}

export function Zh() {
  return <ShareStatsCardButton data={data} />
}

export function En() {
  return <ShareStatsCardButton data={data} en />
}
