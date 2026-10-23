import type { Metadata } from 'next'
import Link from 'next/link'
import HomePageClient from './HomePageClient'
import { createSeoMetadata, breadcrumbJsonLd } from '@/lib/seo'
import { JsonLd } from '@/components/Seo/JsonLd'

export const metadata: Metadata = createSeoMetadata({
  title: 'DSE Level Up | DSE 溫習平台 | 選擇題練判斷', // i18n-exempt: zh-Hant fixed search metadata
  description: 'DSE Level Up 為香港中學生提供免費原創 DSE 題庫、科目筆記和寫作自評。由一元二次方程的完整步驟、英文文體比較到物理運動計算，先理解概念再選擇練習。多項選擇題提供答案核對，書寫題由學生自行評估；沒有即時 AI 生成題目或作文機器評分。本平台並非考評局官方網站，內容需配合課本及教師指引使用，不作成績保證。', // i18n-exempt: zh-Hant fixed search metadata
  path: '/',
  type: 'website',
})

export default function HomePage() {
  return <>
    <JsonLd data={breadcrumbJsonLd([{ name: 'DSE Level Up', path: '/' }])} />
    <HomePageClient />
    <nav aria-label="Subject learning routes" className="mx-auto max-w-5xl px-4 py-10">
      <h2 className="text-2xl font-medium text-ink">由概念筆記開始，再選擇練習 · Learn concepts, then practise</h2>{/* i18n-exempt: actual bilingual static text */}
      <p lang="zh-Hant" className="mt-4 leading-8 text-ink-soft">數學先核對解題步驟，英文先辨認讀者與文體。本站提供原創教學及題庫練習，並非官方試卷或閱卷服務。</p>{/* i18n-exempt: paired with English paragraph below */}
      <p lang="en" className="mt-2 leading-8 text-ink-soft">For maths, check each solution step; for English, identify the reader and text type. These are original learning materials and practice questions, not official papers or an examination marking service.</p>
      <ul className="mt-5 flex flex-wrap gap-5 text-accent">
        <li><Link href="/dse-maths" className="underline underline-offset-4">數學學習路線 · Maths learning route</Link></li>{/* i18n-exempt: actual bilingual static text */}
        <li><Link href="/dse-english" className="underline underline-offset-4">英文閱讀與寫作 · English reading and writing</Link></li>{/* i18n-exempt: actual bilingual static text */}
        <li><Link href="/subjects" className="underline underline-offset-4">按科目選擇原創練習 · Original subject practice</Link></li>{/* i18n-exempt: actual bilingual static text */}
        <li><Link href="/methodology" className="underline underline-offset-4">題庫來源與核對方法 · Question sources and checks</Link></li>{/* i18n-exempt: actual bilingual static text */}
      </ul>
    </nav>
  </>
}
