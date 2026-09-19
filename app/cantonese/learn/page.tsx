import { SITE_ORIGIN } from '@/lib/site'
import LearnView from './LearnView'

// 「點樣學廣東話」（/cantonese/learn）。
//
// ══ 點解要有呢一版 ══
// 十六個場景教嘅係【講咩】。但一個識普通話嘅學生睇住 `caap3 sou1` 照讀，
// 讀出嚟係普通話腔 —— 因為佢用緊普通話嘅音系去讀一套唔同嘅音。
// 呢版教嘅係【點讀、點記、點由普通話推過去】。
//
// ⚠️ 靜態 segment `learn` 喺 Next.js 會贏過同級嘅動態 `[sceneId]`，所以
//    呢條 route 攔唔到任何場景。但反過嚟講：如果將來有人開一個 id 叫
//    `learn` 嘅場景，嗰個場景就會永遠入唔到而且【唔會有任何錯誤】——
//    測試鎖住咗呢點（冇場景 id 可以撞正保留字）。
//
// 內容正本喺 data/cantoneseLearn.ts。

export const metadata = {
  title: '點樣學廣東話｜新來港・香港日常廣東話 | DSE Level Up', // i18n-exempt: 靜態 SEO <title>
  description:
    '為識普通話的新來港學生而設：廣東話六個聲調、普通話與廣東話之間的對應規律（入聲、捲舌音、-n／-ng／-m 韻尾）、最常見的用詞陷阱，以及每日五分鐘的練習方法。', // i18n-exempt: 靜態 SEO meta description
  alternates: { canonical: '/cantonese/learn' },
}

export default function LearnPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'LearningResource',
        '@id': `${SITE_ORIGIN}/cantonese/learn#resource`,
        url: `${SITE_ORIGIN}/cantonese/learn`,
        name: '點樣學廣東話 — 新來港・香港日常廣東話', // i18n-exempt: JSON-LD，server-only
        description:
          '廣東話六個聲調、由普通話推導廣東話讀音的對應規律，以及最常見的用詞陷阱。', // i18n-exempt: 同上
        learningResourceType: 'Study guide',
        inLanguage: 'zh-HK',
        isAccessibleForFree: true,
        audience: { '@type': 'EducationalAudience', educationalRole: 'student' },
        provider: { '@id': `${SITE_ORIGIN}/#organization` },
        isFamilyFriendly: true,
        isPartOf: { '@id': `${SITE_ORIGIN}/cantonese#resource` },
      },
      {
        '@type': 'BreadcrumbList',
        '@id': `${SITE_ORIGIN}/cantonese/learn#breadcrumb`,
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'DSE Level Up', item: SITE_ORIGIN },
          {
            '@type': 'ListItem',
            position: 2,
            name: '香港日常廣東話', // i18n-exempt: JSON-LD，server-only
            item: `${SITE_ORIGIN}/cantonese`,
          },
          { '@type': 'ListItem', position: 3, name: '點樣學廣東話' }, // i18n-exempt: 同上
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
      <LearnView />
    </>
  )
}
