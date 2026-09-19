import { notFound } from 'next/navigation'
import { getSubjectTopics } from '@/data/questions'
import { CAMPUS_TOPICS, REVIEW, type CampusTopic } from '@/data/cantonese'
import { SITE_ORIGIN } from '@/lib/site'
import CantoneseView from './CantoneseView'

// 新來港支援 · 香港日常廣東話 —— 獨立課程，唔屬中文科。
//
// ══ 範圍 ══
// 十三個場景，全部係香港人平時出街真係會講嘅話。2026-09-19 由 Yuna 定案：
// 唔係校園／考試綁課題。所以【十三個全部冇 topicId】，一個練習掣都冇。
//
// ⚠️ 呢個 0/13 令「呢版係 DSE 產品一部分」冇咗任何結構上嘅支撐。
//    範圍同憲章 §1.2 之間嘅缺口未補，草案喺
//    docs/charter-amendment-2026-09-19-DRAFT.md（⬜ 未簽署），三個選項由創辦人揀。
//    詳細理由見 data/cantonese.ts 檔頭。
//
// ⚠️ 本版【刻意冇】卷三／卷四嗰段說明。上一版有，因為當時呢版綁住中文科；
//    而家唔綁，喺一版教買嘢搭車嘅頁度講 DSE 卷別，只會令人以為呢度係試前溫習。
//
// ══ 點解要簽名先出得街 ══
// 內容喺 data/cantonese.ts，而 `REVIEW.reviewer` 留白就唔會 render ——
// 頁面顯示「仲未上線」。理由唔係手續：粵拼係事實資料，一個聲調數字寫錯，
// 學生照住讀就會讀錯個音，而 term-guard／i18n-guard／copy-guard 一條都
// 捉唔到，唔會 build fail、唔會有紅字。
//
// ══ 入口 ══
// 首頁一張全闊卡（信任列之後、科目 grid 之前）。⚠️ 2026-09-19 之前入口曾經
// 喺 /subjects/chinese 頂部，已剷 —— 呢個唔屬於任何一科。
// 冇入口嘅路由 = 孤兒，scripts/integration-guard.mjs 會嗌。

export const metadata = {
  title: '新來港支援｜香港日常廣東話 | DSE Level Up', // i18n-exempt: 靜態 SEO <title>，Next.js metadata 唔跟 client locale
  description:
    '為新來港學生而設的日常廣東話參考：十三個生活場景，每句附廣東話、粵拼、普通話與英文對照。獨立課程、非正規課程，與任何科目課程無關。', // i18n-exempt: 靜態 SEO meta description
  alternates: { canonical: '/cantonese' },
}

/**
 * 十三個場景。現版全部冇 `topicId`，所以下面個檢查而家空轉 —— 留住佢，
 * 係因為日後若果加返綁課題嘅主題，個檢查即刻生效，唔使記得返嚟補。
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
        name: '新來港支援｜香港日常廣東話 — DSE Level Up', // i18n-exempt: JSON-LD，server-only，唔跟 client locale
        description:
          '為新來港學生而設的日常廣東話參考，涵蓋十三個生活場景。獨立課程，與任何科目課程無關。', // i18n-exempt: 同上
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
