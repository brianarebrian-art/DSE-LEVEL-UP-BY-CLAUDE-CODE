import type { MetadataRoute } from 'next'
import { SITE_ORIGIN } from '@/lib/site'

/** noindex for application shells lives in metadata, not robots Disallow rules. */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/api/'] },
      { userAgent: 'GPTBot', allow: '/', disallow: ['/api/'] },
      { userAgent: 'ClaudeBot', allow: '/', disallow: ['/api/'] },
      { userAgent: 'PerplexityBot', allow: '/', disallow: ['/api/'] },
    ],
    sitemap: `${SITE_ORIGIN}/sitemap.xml`,
  }
}
