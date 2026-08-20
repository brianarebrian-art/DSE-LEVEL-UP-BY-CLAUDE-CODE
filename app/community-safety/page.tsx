import type { Metadata } from 'next'
import CommunitySafetyClient from './CommunitySafetyClient'

// /community-safety —— 社群安全守則。
//
// ══ 呢版最易寫錯嘅地方 ══
// 「社群安全頁」呢種嘢有一套標準模板：舉報三級分類、24 小時回應、封鎖機制、
// 危機升級流程、受訓管理員⋯⋯ 抄落嚟一版好靚，但我哋一樣都冇。而寫低一個
// 唔存在嘅舉報流程，比冇個頁更差 —— 學生會照住等，等一個永遠唔會嚟嘅回覆。
//
// 所以呢版嘅寫法係：講【實際有咩】，同埋明明白白講【冇咩】。
// 2026-08-20 對住代碼核實：
//   有 · 每帖真人審（app/api/wall/moderate 白名單 admin；零自動 approve 路徑）
//   有 · 熱線卡永遠置頂 + 發帖者自己撞到危機詞會即時見到（lib/wall/safety.ts）
//   有 · 一人最多 3 條 pending（防洗版）· 版主決定留低問責紀錄
//   有 · 舉報（mailto，帶帖 id）
//   冇 · 私訊功能 —— 全站零 DM／私聊，呢個係最大嘅安全優勢，之前冇一處講過
//   冇 · 封鎖／停權機制（全 repo 零命中）
//   冇 · 自動自殘偵測同危機自動介入 —— 呢個係【刻意唔做】，見 lib/wall/safety.ts
//   冇 · 24 小時當值 —— 兩個創辦人，業餘營運，唔可以承諾一個守唔到嘅回應時間
export const metadata: Metadata = {
  title: '社群安全守則 | DSE Level Up', // i18n-exempt: 靜態 SEO <title>，唔跟 client locale
  // i18n-exempt: 靜態 SEO description，唔跟 client locale（標記須同行，故此句唔換行）
  description: '呢度嘅規矩、每則留言點樣審、你點樣舉報、我哋做唔到啲乜。連同我哋唔會做嘅嘢一齊講清楚。', // i18n-exempt
}

export default function CommunitySafetyPage() {
  return (
    <div className="min-h-screen bg-surface text-ink-soft">
      <CommunitySafetyClient />
    </div>
  )
}
