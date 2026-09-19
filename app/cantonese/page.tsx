import { notFound } from 'next/navigation'
import { getSubjectTopics } from '@/data/questions'
import { CAMPUS_TOPICS, REVIEW, type CampusTopic } from '@/data/cantonese'
import { SITE_ORIGIN } from '@/lib/site'
import CantoneseView from './CantoneseView'

// 中文科新來港支援（業餘班 · 非正規課程）。
//
// ══ 範圍 ══
// 目的係幫新來港學生快啲融入香港學生嘅廣東話環境。對象係 DSE 考生，所以
// 喺憲章 §1.2「戰場只有一個：香港 DSE」之內；但語境係【校園】—— 冇地鐵、
// 冇問路、冇買嘢。八個題目各自綁返一個中文科真課題，撳得入去做練習，
// 而第八個（口語轉書面語）直接服務卷二。
//
// ══ 點解冇卷三卷四 ══
// 2024 核心科目優化已經剷走中國語文科嘅卷三（聆聽及綜合能力）同卷四（說話），
// 見 docs/dse-syllabus-sources.md:40。原本嘅需求寫「綁卷一至卷四」，照做就會
// 喺一個 DSE 產品度教學生兩張【唔存在嘅卷】。所以只有卷一、卷二。
//
// ══ 點解要簽名先出得街 ══
// 內容喺 data/cantonese.ts，而 `REVIEW.reviewer` 留白就唔會 render ——
// 頁面顯示「仲未上線」。理由唔係手續：粵拼係事實資料，一個聲調數字寫錯，
// 學生照住讀就會讀錯個音，而 term-guard／i18n-guard／copy-guard 一條都
// 捉唔到，唔會 build fail、唔會有紅字。詳見 data/cantonese.ts 檔頭。
//
// ══ 入口 ══
// /subjects/chinese 頂部有一條連結入嚟。冇入口嘅路由 = 孤兒，
// scripts/integration-guard.mjs 會嗌。

export const metadata = {
  title: '中文科新來港支援 | DSE Level Up', // i18n-exempt: 靜態 SEO <title>，Next.js metadata 唔跟 client locale
  description:
    '為新來港學生而設的中文科輔助參考：按中文科真實課題整理香港書面語與口語的分別。業餘班、非正規課程，並非考評局教材。', // i18n-exempt: 靜態 SEO meta description
  alternates: { canonical: '/cantonese' },
}

/**
 * 八個題目，逐個對應 `data/questions` 嘅真課題 id。
 *
 * ⚠️ id 唔係求其改嘅字串 —— 下面 build 時會逐個對返中文科嘅課題清單，
 *    對唔上即刻 `notFound()`。咁樣課題改名／剷走嗰日，呢版會即刻壞畀人睇，
 *    而唔係靜靜哋留住一堆撳極都去唔到嘅掣。
 */
const TOPICS: CampusTopic[] = CAMPUS_TOPICS

export default function CantonesePage() {
  // 逐個對返真課題 —— 對唔上寧可 404，唔好留一堆死掣。
  const live = new Set(getSubjectTopics('chinese').map((t) => t.id))
  const missing = TOPICS.filter((t) => !live.has(t.topicId))
  if (missing.length) notFound()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'LearningResource',
        '@id': `${SITE_ORIGIN}/cantonese#resource`,
        url: `${SITE_ORIGIN}/cantonese`,
        // JSON-LD 喺 server render，唔跟 client locale；而 `inLanguage` 已經
        // 聲明咗 zh-HK，所以呢兩句寫中文先至同結構化資料自己講嘅嘢一致。
        name: '中文科新來港支援 — DSE Level Up', // i18n-exempt: JSON-LD，server-only，唔跟 client locale
        description:
          '為新來港學生而設的中文科輔助參考，按中文科真實課題整理香港書面語與口語的分別。非正規課程，並非考評局教材。', // i18n-exempt: 同上
        learningResourceType: 'Supplementary reference',
        educationalLevel: 'Hong Kong Diploma of Secondary Education (HKDSE)',
        teaches: TOPICS.map((t) => t.zh),
        inLanguage: 'zh-HK',
        isAccessibleForFree: true,
        audience: { '@type': 'EducationalAudience', educationalRole: 'student' },
        provider: { '@id': `${SITE_ORIGIN}/#organization` },
        isFamilyFriendly: true,
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${SITE_ORIGIN}/cantonese#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'DSE Level Up', item: SITE_ORIGIN },
          { '@type': 'ListItem', position: 2, name: '中文科新來港支援' },
        ],
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <CantoneseView topics={TOPICS} signed={REVIEW.reviewer.trim().length > 0} />
    </>
  )
}
