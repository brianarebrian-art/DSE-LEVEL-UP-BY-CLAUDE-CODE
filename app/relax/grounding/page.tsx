import GroundingExercise from '../components/GroundingExercise'

// /relax/grounding — 5-4-3-2-1 五官落地練習（SEN-07 靜態安全網）。
// layout 已常駐 ExitBar + EmergencyBanner（真熱線 + 醫療免責），呢頁只放練習本身。
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '接地練習 | DSE Level Up', // i18n-exempt: 靜態 SEO <title>，唔跟 client locale
  // i18n-exempt: 靜態 SEO description，唔跟 client locale（標記須同行，故此句唔換行）
  description: '5-4-3-2-1 感官接地練習，幫你由緊張抽返出嚟。本工具唔會儲存你嘅任何回答。', // i18n-exempt
}

export default function RelaxGroundingPage() {
  return <GroundingExercise />
}
