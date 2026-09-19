import { notFound } from 'next/navigation'
import { SCENE_IDS, topicById } from '@/data/cantonese'
import { SITE_ORIGIN } from '@/lib/site'
import SceneView from './SceneView'

// 一個場景嘅詳情頁（/cantonese/[sceneId]）。
//
// ══ 點解要有呢一層 ══
// 列表頁十六張卡 × 六句，一屏睇唔晒，而逐句嘅文化提示（「走X＝唔要X」、
// 「小巴冇落車鐘要開聲嗌」）先係真正令一個學生開得到口嘅嘢。全部塞入列表
// 就會變成一幅字牆，冇人讀得完。
//
// ⚠️ 所以列表【刻意唔出】文化提示，詳情頁先出 —— 加埋詞語表、學習提示
//    同置頂安全提示。一個撳入去見到同一樣嘢嘅「深入了解」係講大話。
//
// ══ 2026-09-19：真人簽名閘剷除 ══
// 舊版兩版都要 `REVIEW.reviewer` 有真人名先 render 啲句。Yuna 裁決改為由
// Claude Code 校對，內容即時出街。取而代之嘅係粵拼結構檢查（lib/jyutping.ts）。
//
// ══ 路由 ══
// 場景 id 由 SCENE_IDS 推導，冇第二張手寫清單 —— 加一個場景唔使記得返嚟
// 補呢度。PAGE_ORDER 唔收動態頁，所以 lib/pageOrder.ts 嘅 EXCLUDED 有一條
// 明示理由（返回路徑係返 /cantonese），否則 scripts/guard-nav.mjs 會 exit 1。

export function generateStaticParams() {
  return SCENE_IDS.map((sceneId) => ({ sceneId }))
}

export async function generateMetadata({ params }: { params: Promise<{ sceneId: string }> }) {
  const { sceneId } = await params
  const topic = topicById(sceneId)
  if (!topic) return {}
  return {
    title: `${topic.zh}｜新來港・香港日常廣東話 | DSE Level Up`, // i18n-exempt: 靜態 SEO <title>，Next.js metadata 唔跟 client locale
    description: `${topic.whyZh} 六句香港日常廣東話，每句附粵拼、普通話與英文對照及溝通目的。獨立非正規生活支援課程，與中國語文科及任何 DSE 科目無關。`, // i18n-exempt: 靜態 SEO meta description
    alternates: { canonical: `/cantonese/${topic.id}` },
  }
}

export default async function ScenePage({ params }: { params: Promise<{ sceneId: string }> }) {
  const { sceneId } = await params
  const topic = topicById(sceneId)
  if (!topic) notFound()

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'LearningResource',
        '@id': `${SITE_ORIGIN}/cantonese/${topic.id}#resource`,
        url: `${SITE_ORIGIN}/cantonese/${topic.id}`,
        name: `${topic.zh} — 新來港・香港日常廣東話`, // i18n-exempt: JSON-LD，server-only
        description: topic.whyZh, // i18n-exempt: 同上
        learningResourceType: 'Supplementary reference',
        educationalLevel: 'Hong Kong Diploma of Secondary Education (HKDSE)',
        inLanguage: 'zh-HK',
        isAccessibleForFree: true,
        audience: { '@type': 'EducationalAudience', educationalRole: 'student' },
        provider: { '@id': `${SITE_ORIGIN}/#organization` },
        isFamilyFriendly: true,
        isPartOf: { '@id': `${SITE_ORIGIN}/cantonese#resource` },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${SITE_ORIGIN}/cantonese/${topic.id}#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'DSE Level Up', item: SITE_ORIGIN },
          {
            '@type': 'ListItem',
            position: 2,
            name: '香港日常廣東話', // i18n-exempt: JSON-LD，server-only
            item: `${SITE_ORIGIN}/cantonese`,
          },
          { '@type': 'ListItem', position: 3, name: topic.zh },
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
      <SceneView topic={topic} />
    </>
  )
}
