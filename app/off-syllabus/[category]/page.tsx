import { completeSeoMetadata } from '@/lib/seo'
import { notFound } from 'next/navigation'
import { CATEGORIES, categoryBySlug } from '@/data/offSyllabus'
import CategoryView from './CategoryView'
import { SITE_ORIGIN } from '@/lib/site'
import { JsonLd } from '@/components/Seo/JsonLd'
import { offSyllabusSeoDescription } from '@/lib/dynamicSeoDescriptions'
import { Breadcrumb } from '@/components/Seo/SeoNavigation'

// One category of 不考之地 topic cards (/off-syllabus/[category]), 20 cards each.
// Static: the slugs come from CATEGORIES, so adding a category needs no change here.
// PAGE_ORDER does not take dynamic pages; lib/pageOrder.ts EXCLUDED has the reason.

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ category: c.slug }))
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params
  const c = categoryBySlug(category)
  if (!c) notFound()
  return completeSeoMetadata({
    title: `${c.title}｜不考之地 | DSE Level Up`, // i18n-exempt: 靜態 SEO <title>，Next.js metadata 唔跟 client locale
    description: offSyllabusSeoDescription({ title: c.title, cardCount: c.cards.length }), // i18n-exempt: 靜態 SEO meta description
    openGraph: {
      type: 'article',
    },
  }, `/off-syllabus/${c.slug}`)
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params
  const c = categoryBySlug(category)
  if (!c) notFound()
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'LearningResource',
    name: `${c.title}｜不考之地`, // i18n-exempt: zh-Hant JSON-LD resource name
    url: `${SITE_ORIGIN}/off-syllabus/${c.slug}`,
    description: offSyllabusSeoDescription({ title: c.title, cardCount: c.cards.length }),
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
      <Breadcrumb items={[{ name: 'DSE Level Up', path: '/' }, { name: '不考之地 · Beyond the syllabus', path: '/off-syllabus' }, { name: c.title, path: `/off-syllabus/${c.slug}` }]} />{/* i18n-exempt: actual bilingual static label; final name is content data */}
      <JsonLd data={jsonLd} />
      <CategoryView emoji={c.emoji} title={c.title} titleEn={c.titleEn} cards={c.cards} />
    </>
  )
}
