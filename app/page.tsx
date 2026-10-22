import type { Metadata } from 'next'
import HomePageClient from './HomePageClient'
import { createSeoMetadata } from '@/lib/seo'

export const metadata: Metadata = createSeoMetadata({
  title: 'DSE Level Up | DSE 溫習平台 | 掌握 DSE 核心邏輯',
  description: '為香港中學生整理 DSE 科目筆記、原創練習題和 AI 學習工具，從每一題理解核心邏輯，不作成績保證。',
  path: '/',
  type: 'website',
})

export default function HomePage() {
  return <HomePageClient />
}
