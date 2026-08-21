import type { Metadata } from 'next'
import WritingClient from './WritingClient'

// 2026-08-21：本版原本淨係一個 client component，冇自己嘅 metadata，所以喺搜尋
// 結果同社交預覽入面同全站其他頁共用同一個泛用標題。老師／家長好多時就係由
// 搜尋結果撳入嚟，泛用標題等於冇講過呢版係咩。
//
// Next.js 只認 server component 嘅 `metadata`，所以呢度拆成「殼（server，帶
// metadata）＋ 內容（client，帶 i18n）」—— 同 /privacy、/community-safety 一致。
export const metadata: Metadata = {
  title: '英文寫作自評 | DSE Level Up', // i18n-exempt: 靜態 SEO <title>，唔跟 client locale
  // i18n-exempt: 靜態 SEO description，唔跟 client locale（標記須同行，故此句唔換行）
  description: '參照公開評核概念設計嘅寫作自評工具。書寫題永遠唔由機器批改，呢度只幫你自己對照。', // i18n-exempt
}

export default function Page() {
  return <WritingClient />
}
