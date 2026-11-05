import type { MetadataRoute } from 'next'
import { SITE_ORIGIN } from '@/lib/site'

/** noindex for application shells lives in metadata, not robots Disallow rules. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: ['/', '/subjects', '/practice'], disallow: ['/admin', '/api/'] },
      { userAgent: 'GPTBot', allow: ['/', '/subjects', '/practice'], disallow: ['/admin', '/api/'] },
      { userAgent: 'ClaudeBot', allow: ['/', '/subjects', '/practice'], disallow: ['/admin', '/api/'] },
      { userAgent: 'PerplexityBot', allow: ['/', '/subjects', '/practice'], disallow: ['/admin', '/api/'] },
    ],
    sitemap: `${SITE_ORIGIN}/sitemap.xml`,
  }
}
