import { NextResponse } from 'next/server'
import { getActiveSubjects } from '@/data/subjects'
import { getSubjectQuestions } from '@/data/questions'
import { SITE_ORIGIN } from '@/lib/site'

export async function GET() {
  const subjects = getActiveSubjects()

  // Generate question URLs across subjects
  const urls: string[] = []
  for (const s of subjects) {
    const questions = getSubjectQuestions(s.id)
    for (const q of questions.slice(0, 500)) {
      urls.push(`${SITE_ORIGIN}/questions/${s.id}/${q.id}`)
    }
  }

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${url}</loc>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`
  )
  .join('\n')}
</urlset>`

  return new NextResponse(sitemapXml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  })
}
