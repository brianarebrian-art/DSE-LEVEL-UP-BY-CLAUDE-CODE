import GroupCommunity from '../components/GroupCommunity'

// /relax/group — 👥 戰友集結區（Instagram Group 影子溫書室，由 school.q.1 管理）。
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: '戰友集結區 | DSE Level Up', // i18n-exempt: 靜態 SEO <title>，唔跟 client locale
  // i18n-exempt: 靜態 SEO description，唔跟 client locale（標記須同行，故此句唔換行）
  description: '一個學生自發嘅 Instagram 溫書群組入口。唔係官方頻道，我哋無法審核入面嘅內容。', // i18n-exempt
}

export default function RelaxGroupPage() {
  return <GroupCommunity />
}
