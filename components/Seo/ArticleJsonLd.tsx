import type { Metadata } from 'next'
import { SITE_ORIGIN } from '@/lib/site'
import { ARTICLE_DATES } from '@/lib/articleDates'

// 文章型頁面嘅 Article 結構化資料 ＋ 頁底可見日期（server component）。
//
// 日期唔由 props 傳入，一律由 lib/articleDates.ts 讀 —— 一個頁面只可以有一個
// 發布日期，唔可以每個 caller 各自寫一個。頁面冇登記就唔出任何嘢（唔會作一個日期出嚟）。
//
// 點解日期要【可見】：JSON-LD 係畀機器讀嘅，讀者睇唔到。一個只喺 JSON-LD 聲稱
// 「2026-09-15 更新」而頁面冇講嘅日期，讀者核實唔到 —— 同一句話要兩邊都講。
//
// publisher 冇 logo：Google 對 Article 嘅 logo 係「建議」唔係「必須」，而本站
// 唯一嘅標誌係 SVG（public/icons/owl.svg），唔確定會唔會被接受。寧願唔填，都唔填
// 一個可能無效嘅值。image 用 app/opengraph-image.tsx 生成嘅 PNG。

/** YYYY-MM-DD → YYYY-MM-DD（驗證過格式）。規格：new Date(d).toISOString().split('T')[0] */
export function toIso(d: string): string {
  return new Date(d).toISOString().split('T')[0]
}

export default function ArticleJsonLd({
  route,
  meta,
}: {
  /** 例如 '/about' —— 用嚟查日期同組 URL */
  route: string
  /** 頁面自己個 `metadata` —— headline／description 由佢取，唔另抄一份（抄咗遲早分叉）。 */
  meta: Metadata
}) {
  const dates = ARTICLE_DATES[route]
  if (!dates) return null
  const headline = String(meta.title ?? '').replace(/\s*\|\s*DSE Level Up$/, '')
  const description = meta.description ?? ''

  const url = `${SITE_ORIGIN}${route}`
  const published = toIso(dates.published)
  const modified = toIso(dates.modified || dates.published)
  const org = { '@type': 'Organization', '@id': `${SITE_ORIGIN}/#organization`, name: 'DSE Level Up', url: SITE_ORIGIN }
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: headline.slice(0, 110), // Google：headline 唔好超過 110 字元
    description,
    datePublished: published,
    dateModified: modified,
    author: org,
    publisher: org,
    mainEntityOfPage: { '@type': 'WebPage', '@id': url },
    url,
    image: `${SITE_ORIGIN}/opengraph-image`,
    inLanguage: 'zh-HK',
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }} />
      <p className="max-w-3xl mx-auto px-4 pb-10 text-xs text-ink-muted">
        {/* server component 冇 locale hook，雙語並列（同 skip-link 一樣嘅做法） */}
        發布 Published：<time dateTime={published}>{published}</time>{/* i18n-exempt: 雙語已並列（server component 冇 locale） */}
        {' · '}
        最後更新 Updated：<time dateTime={modified}>{modified}</time>{/* i18n-exempt: 雙語已並列（server component 冇 locale） */}
      </p>
    </>
  )
}
