// 季節性架構（Q3-Q4 方向一）：純前端按月份判斷 DSE 年度節奏，零成本、零依賴。
// 用於首頁 Hero 動態文案（data/heroContent.ts）。無虛構數據、無倒數壓力。

export type Season = 'golden' | 'stable' | 'sprint' | 'peak' | 'transition' | 'anxiety'

// 以本地時間月份判斷（考生設備時區即香港時區）。
export function getCurrentSeason(now: Date = new Date()): Season {
  const month = now.getMonth() + 1 // 1–12
  if (month === 9) return 'golden' // 9 月：新學年黃金期
  if (month >= 10 && month <= 12) return 'stable' // 10–12 月：穩步期
  if (month >= 1 && month <= 2) return 'sprint' // 1–2 月：衝刺（最後 100 日）
  if (month >= 3 && month <= 4) return 'peak' // 3–4 月：最後 30 日
  if (month === 5) return 'transition' // 5 月：考完過渡
  return 'anxiety' // 6–8 月：等放榜
}
