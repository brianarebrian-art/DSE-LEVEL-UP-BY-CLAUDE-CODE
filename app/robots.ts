import type { MetadataRoute } from 'next'
import { SITE_ORIGIN } from '@/lib/site'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: ['/api/', '/admin/', '/account', '/sign-in', '/sign-up', '/dashboard', '/result'] },
      { userAgent: 'GPTBot', allow: '/', disallow: ['/api/', '/admin/', '/account', '/sign-in', '/sign-up'] },
      { userAgent: 'ClaudeBot', allow: '/', disallow: ['/api/', '/admin/', '/account', '/sign-in', '/sign-up'] },
      { userAgent: 'PerplexityBot', allow: '/', disallow: ['/api/', '/admin/', '/account', '/sign-in', '/sign-up'] },
    ],
    sitemap: `${SITE_ORIGIN}/sitemap.xml`,
  }
}
