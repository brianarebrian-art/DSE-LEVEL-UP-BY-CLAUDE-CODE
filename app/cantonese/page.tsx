import { notFound } from 'next/navigation'
import { getSubjectTopics } from '@/data/questions'
import { SITE_ORIGIN } from '@/lib/site'
import CantoneseView from './CantoneseView'
import type { CantoneseTopic } from '@/components/CantoneseDseCard'

// 中文科新來港支援（業餘班 · 非正規課程）。
//
// ══ 範圍 ══
// 憲章 §1.2：戰場只有一個，香港 DSE，禁止全齡層擴張。所以呢版【唔係】
// 通用廣東話班 —— 冇地鐵用語、冇問路、冇買嘢。八個題目全部綁返中文科
// 真實課題，而且每個都撳得入去做嗰個課題嘅練習。
//
// ══ 點解冇卷三卷四 ══
// 2024 核心科目優化已經剷走中國語文科嘅卷三（聆聽及綜合能力）同卷四（說話），
// 見 docs/dse-syllabus-sources.md:40。原本嘅需求寫「綁卷一至卷四」，照做就會
// 喺一個 DSE 產品度教學生兩張【唔存在嘅卷】。所以只有卷一、卷二。
//
// ══ 點解內容留白 ══
// 四欄對照（廣東話／粵拼／普通話／English）係中文科教學內容，憲章 §12 要求
// 經真人逐條審批先入庫。呢版而家出嘅係【已定好嘅範圍】加上一個明明白白嘅
// 「仲未上線」狀態，唔係一個扮有嘢嘅空殼。
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
const TOPICS: CantoneseTopic[] = [
  {
    topicId: 'fanwen_diction',
    zh: '指定範文・字詞',
    en: 'Set texts — diction',
    paper: 1,
    whyZh: '十二篇範文嘅字詞考得好細。母語唔係粵語嘅話，最蝕底通常唔係唔明篇文，係逐隻字嘅本義同引申義分唔清。',
    whyEn: 'The set texts are examined at word level. If Cantonese is not your first language, the usual loss is not the passage itself but telling a character’s literal sense from its extended one.',
  },
  {
    topicId: 'classical_lexis',
    zh: '文言實詞・一詞多義',
    en: 'Classical Chinese — polysemous words',
    paper: 1,
    whyZh: '同一隻字喺唔同篇文解唔同意思。呢類題冇得靠語感，要逐個義項記，而普通話語感喺呢度幫唔到手。',
    whyEn: 'The same character carries different senses across passages. Intuition does not help here — each sense has to be learnt, and Putonghua intuition does not transfer.',
  },
  {
    topicId: 'comprehension',
    zh: '白話閱讀理解',
    en: 'Modern Chinese reading',
    paper: 1,
    whyZh: '香港書面語有一批同內地用法唔同嘅詞。睇得明大意但撳錯選項，多數就係卡喺呢批詞度。',
    whyEn: 'Written Hong Kong Chinese uses a set of words differently from the mainland. Getting the gist but picking the wrong option usually traces back to those.',
  },
  {
    topicId: 'idioms_vocab',
    zh: '成語與詞語',
    en: 'Idioms and vocabulary',
    paper: 1,
    whyZh: '成語考嘅係用法唔係解釋。知道意思但用錯語境，喺卷一同卷二都照樣失分。',
    whyEn: 'Idioms are examined on use, not on meaning. Knowing the sense but misjudging the context loses marks in both papers.',
  },
  {
    topicId: 'chars_errors',
    zh: '字音字形與病句',
    en: 'Pronunciation, character form and faulty sentences',
    paper: 1,
    whyZh: '呢個題目對新來港學生最直接：同音字、形近字、同埋普通話講得通但香港書面語唔通嘅句式。',
    whyEn: 'The most direct of the eight: homophones, look-alike characters, and sentence patterns that work in Putonghua but not in written Hong Kong Chinese.',
  },
  {
    topicId: 'rhetoric',
    zh: '修辭手法',
    en: 'Rhetorical devices',
    paper: 1,
    whyZh: '修辭名稱要用香港課程嘅叫法。同一個手法喺內地教材可能係另一個名，答咗另一個名就攞唔到分。',
    whyEn: 'Devices must be named the way the Hong Kong curriculum names them. The same device may go by another name in mainland textbooks, and that name earns nothing here.',
  },
  {
    topicId: 'practical_writing',
    zh: '實用寫作',
    en: 'Practical writing',
    paper: 2,
    whyZh: '實用文有固定格式同固定套語。呢啲係記得就攞得到嘅分，唔使靠文采。',
    whyEn: 'Practical writing has fixed formats and fixed phrasing. These are marks you get by knowing them, with no flair required.',
  },
  {
    topicId: 'argument_essay',
    zh: '論說文・思辨立意',
    en: 'Argumentative writing — stance and reasoning',
    paper: 2,
    whyZh: '呢度要嘅係書面語，唔係口語。口語詞、口語句式直接寫入卷二，就算論點企得住都會失分。',
    whyEn: 'This calls for written Chinese, not speech. Spoken words and spoken sentence patterns written into Paper 2 cost marks even when the argument holds.',
  },
]

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
      <CantoneseView topics={TOPICS} />
    </>
  )
}
