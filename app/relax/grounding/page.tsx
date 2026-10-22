import { completeSeoMetadata } from '@/lib/seo'
import GroundingExercise from '../components/GroundingExercise'

// /relax/grounding — 5-4-3-2-1 五官落地練習（SEN-07 靜態安全網）。
// layout 已常駐 ExitBar + EmergencyBanner（真熱線 + 醫療免責），呢頁只放練習本身。

export const metadata = completeSeoMetadata({
  title: '接地練習 | DSE Level Up', // i18n-exempt: zh-Hant fixed search metadata
  description: '使用 5-4-3-2-1 感官接地步驟，把注意力帶回眼前可看見、聽見和感受到的事物，作為讀書期間短暫停下來的自助練習；本工具不收集或儲存任何回答，不提供醫療診斷、治療或危機服務，若你感到不安全或需要即時協助，請聯絡可信任人士或當地緊急支援。完成後可自行返回學習頁面，沒有連續使用、完成次數或表現紀錄要求。', // i18n-exempt: zh-Hant fixed search metadata
}, '/relax/grounding')

export default function RelaxGroundingPage() {
  return <GroundingExercise />
}
