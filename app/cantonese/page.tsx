import { notFound } from 'next/navigation'
import { getSubjectTopics } from '@/data/questions'
import { CAMPUS_TOPICS, REVIEW, type CampusTopic } from '@/data/cantonese'
import { SITE_ORIGIN } from '@/lib/site'
import CantoneseView from './CantoneseView'

// 新來港支援 · 校園同日常生活廣東話（業餘班 · 非正規課程）。
//
// ══ 範圍 ══
// 十二個情境：1–8 校園，9–12 日常生活（買嘢／買衫／食嘢／交通住行）。
// 校園嗰八個各自綁一個中文科真課題，撳得入去做練習；日常嗰四個綁唔到
// 任何課題，所以冇練習掣。範圍轉變同憲章嗰邊仲未調和，見 data/cantonese.ts
// 檔頭嘅 ⚠️ —— 嗰度記低咗「買嘢」同一批用語同日曾經被否決過。
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
// 首頁一張全闊卡（信任列之後、科目 grid 之前）。⚠️ 2026-09-19 之前入口曾經
// 喺 /subjects/chinese 頂部，已剷 —— 新來港支援唔屬於任何一科。
// 冇入口嘅路由 = 孤兒，scripts/integration-guard.mjs 會嗌。

export const metadata = {
  title: '新來港支援｜校園同日常生活廣東話 | DSE Level Up', // i18n-exempt: 靜態 SEO <title>，Next.js metadata 唔跟 client locale
  description:
    '為新來港學生而設的廣東話輔助參考：八個校園情境加四個日常生活情境，每項附廣東話、粵拼、普通話與英文對照。業餘班、非正規課程，並非考評局教材。', // i18n-exempt: 靜態 SEO meta description
  alternates: { canonical: '/cantonese' },
}

/**
 * 十二個情境。有綁課題嗰八個，`topicId` 唔係求其改嘅字串 —— 下面 build 時
 * 會逐個對返中文科嘅課題清單，對唔上即刻 `notFound()`。咁樣課題改名／剷走
 * 嗰日，呢版會即刻壞畀人睇，而唔係靜靜哋留住一堆撳極都去唔到嘅掣。
 */
const TOPICS: CampusTopic[] = CAMPUS_TOPICS

export default function CantonesePage() {
  // 逐個對返真課題 —— 對唔上寧可 404，唔好留一堆死掣。
  //
  // ⚠️ 只查【有綁課題嗰批】。日常生活主題（買嘢／買衫／食嘢／交通住行）冇
  //    topicId：中文科十九個課題冇一個載得起佢哋，留空好過夾硬綁（見
  //    data/cantonese.ts 檔頭）。漏咗 `t.topicId &&` 呢半，`live.has(undefined)`
  //    一定係 false，成版會即刻 404 —— 加日常主題嗰陣真係撞到。
  const live = new Set(getSubjectTopics('chinese').map((t) => t.id))
  const missing = TOPICS.filter((t) => t.topicId && !live.has(t.topicId))
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
        name: '新來港支援｜校園同日常生活廣東話 — DSE Level Up', // i18n-exempt: JSON-LD，server-only，唔跟 client locale
        description:
          '為新來港學生而設的廣東話輔助參考，涵蓋校園與日常生活情境。非正規課程，並非考評局教材。', // i18n-exempt: 同上
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
          { '@type': 'ListItem', position: 2, name: '新來港支援' },
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
