import { notFound } from 'next/navigation'
import AnswerCardsPreview from './AnswerCardsPreview'

// 開發專用預覽 —— 用固定樣本渲染兩張書寫題答題卡（文字題／長題目）。
//
// 點解需要呢一版：憲章 §4 要求「同一 session 內必須交付可手動驗證嘅 UI 觸發點」。
// 但書寫題受制於另一條更硬嘅紅線 ——【機器永不自動入庫】—— 首批題目必須留喺
// drafts/ 等真人逐題批，所以 /practice 嗰邊暫時一條書寫題都攞唔到，冇嘢可以渲染。
// 而 /admin 覆核面板需要 Google 登入 + ADMIN_EMAILS 白名單，亦唔係通用驗證面。
//
// 故此設一版純樣本預覽：唔碰題庫、唔碰任何學生數據，只證明兩張卡本身渲染正確、
// 雙主題對比度達標。順帶亦係 Kate 睇設計、日後改動做視覺回歸嘅固定參照。
//
// 生產環境一律 404：呢版唔屬於學生體驗，亦唔應該出現喺 sitemap 或搜尋結果。
export const dynamic = 'force-dynamic'

export default function DevAnswerCardsPage() {
  if (process.env.NODE_ENV === 'production') notFound()
  return <AnswerCardsPreview />
}
