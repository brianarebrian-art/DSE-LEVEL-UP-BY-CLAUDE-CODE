import { notFound } from 'next/navigation'
import { CATEGORIES, categoryBySlug } from '@/data/offSyllabus'
import CategoryView from './CategoryView'
import { SITE_ORIGIN } from '@/lib/site'

// One category of 不考之地 topic cards (/off-syllabus/[category]), 20 cards each.
// Static: the slugs come from CATEGORIES, so adding a category needs no change here.
// PAGE_ORDER does not take dynamic pages; lib/pageOrder.ts EXCLUDED has the reason.

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ category: c.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params
  const c = categoryBySlug(category)
  if (!c) return {}
  return {
    title: `${c.title}｜不考之地 | DSE Level Up`, // i18n-exempt: 靜態 SEO <title>，Next.js metadata 唔跟 client locale
    description: `不考之地話題卡：${c.title}。不計分、不考試，純粹為樂趣而學。`, // i18n-exempt: 靜態 SEO meta description
    alternates: { canonical: `/off-syllabus/${c.slug}` },
    openGraph: {
      type: 'article',
      url: `${SITE_ORIGIN}/off-syllabus/${c.slug}`,
      title: `${c.emoji} ${c.title}｜不考之地 | DSE Level Up`,
      description: `探索 ${c.cards.length} 張${c.title}知識卡，純粹為樂趣而學。`,
      siteName: 'DSE Level Up',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${c.emoji} ${c.title}｜不考之地`,
      description: `探索 ${c.cards.length} 張${c.title}知識卡。`,
    },
  }
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params
  const c = categoryBySlug(category)
  if (!c) notFound()
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LearningResource',
    name: `${c.title}｜不考之地`,
    url: `${SITE_ORIGIN}/off-syllabus/${c.slug}`,
    description: `不考之地 ${c.title} 知識卡集合，純粹為樂趣而學。`,
    learningResourceType: 'Knowledge cards',
    educationalLevel: 'Secondary education',
    isAccessibleForFree: true,
    inLanguage: 'zh-HK',
    hasPart: c.cards.map((card) => ({
      '@type': 'LearningResource',
      name: card.title,
      description: card.trivia,
      url: `${SITE_ORIGIN}/off-syllabus/${c.slug}#card-${card.id}`,
    })),
  }
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <CategoryView emoji={c.emoji} title={c.title} titleEn={c.titleEn} cards={c.cards} />
    </>
  )
}
