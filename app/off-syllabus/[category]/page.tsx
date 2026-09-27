import { notFound } from 'next/navigation'
import { CATEGORIES, categoryBySlug } from '@/data/offSyllabus'
import CategoryView from './CategoryView'

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
  }
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params
  const c = categoryBySlug(category)
  if (!c) notFound()
  return <CategoryView emoji={c.emoji} title={c.title} titleEn={c.titleEn} cards={c.cards} />
}
