import { notFound } from 'next/navigation'
import { getSubjectTopics } from '@/data/questions'
import { CANTONESE_TOPICS, type CantoneseTopic } from '@/data/cantonese'
import { SITE_ORIGIN } from '@/lib/site'
import CantoneseView from './CantoneseView'

// 新來港 · 香港日常廣東話 —— 獨立非正規生活支援課程，唔屬中文科。
//
// ══ 範圍 ══
// 十六個場景 × 六句 = 九十六句，另加每個場景一張詞語表，全部係香港人平時出街真係會講嘅話。
// 2026-09-19 由 Yuna 定案：唔係校園／考試綁課題。所以【十六個全部冇 topicId】，
// 一個練習掣都冇。
//
// ⚠️ 呢個 0/16 令「呢版係 DSE 產品一部分」冇咗任何結構上嘅支撐。
//    範圍同憲章 §1.2 之間嘅缺口未補，草案喺
//    docs/charter-amendment-2026-09-19-DRAFT.md（⬜ 未簽署），三個選項由創辦人揀。
//    詳細理由見 data/cantonese.ts 檔頭。
//
// ⚠️ 本版【刻意冇】任何 DSE 卷別說明。上一版有卷三／卷四嗰段，因為當時呢版
//    綁住中文科；而家唔綁，喺一版教買嘢搭車嘅頁度講卷別，只會令人以為呢度
//    係試前溫習。
//
// ══ 2026-09-19：真人簽名閘剷除 ══
// 舊版要 data/cantonese.ts 嘅 `REVIEW.reviewer` 有真人名先 render。
// Yuna 裁決改為由 Claude Code 校對，內容即時出街。
//
// ⚠️ 換咗嘅係【邊個校對】，唔係【校對到幾深】。term-guard／i18n-guard／
//    copy-guard 一條都唔識粵拼，所以補返一個真係跑得到嘅檢查：
//    lib/jyutping.ts 逐個音節對返粵拼嘅封閉集合。佢證明到「冇唔存在嘅音節」，
//    證明唔到「個音讀得啱」—— 兩句唔同意思，頁面文案亦係咁寫。
//
// ══ 入口 ══
// 首頁一張全闊卡（信任列之後、科目 grid 之前）。⚠️ 2026-09-19 之前入口曾經
// 喺 /subjects/chinese 頂部，已剷 —— 呢個唔屬於任何一科。
// 冇入口嘅路由 = 孤兒，scripts/integration-guard.mjs 會嗌。

export const metadata = {
  title: '新來港・香港日常廣東話 | DSE Level Up', // i18n-exempt: 靜態 SEO <title>，Next.js metadata 唔跟 client locale
  description:
    '為新來港學生而設的獨立非正規生活支援課程：十六個日常生活場景、九十六句，每句附廣東話、粵拼、普通話與英文對照及溝通目的，另有詞語表與學習方法。與中國語文科及任何 DSE 科目無關。', // i18n-exempt: 靜態 SEO meta description
  alternates: { canonical: '/cantonese' },
}

/**
 * 十六個場景。現版全部冇 `topicId`，所以下面個檢查而家空轉 —— 留住佢，
 * 係因為日後若果加返綁課題嘅主題，個檢查即刻生效，唔使記得返嚟補。
 */
const TOPICS: CantoneseTopic[] = CANTONESE_TOPICS

export default function CantonesePage() {
  // 逐個對返真課題 —— 對唔上寧可 404，唔好留一堆死掣。
  //
  // ⚠️ 只查【有綁課題嗰批】。日常生活場景冇 topicId：中文科十九個課題冇一個
  //    載得起佢哋，留空好過夾硬綁（見 data/cantonese.ts 檔頭）。漏咗
  //    `t.topicId &&` 呢半，`live.has(undefined)` 一定係 false，成版會即刻
  //    404 —— 由八個校園主題改成全日常主題嗰陣真係撞到。
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
        name: '新來港・香港日常廣東話 — DSE Level Up', // i18n-exempt: JSON-LD，server-only，唔跟 client locale
        description:
          '為新來港學生而設的獨立非正規生活支援課程，涵蓋十六個日常生活場景、九十六句及詞語表。與任何科目課程無關。', // i18n-exempt: 同上
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
          { '@type': 'ListItem', position: 2, name: '新來港・香港日常廣東話' },
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
      <CantoneseView topics={TOPICS} />
    </>
  )
}
