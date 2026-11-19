import type { Metadata } from 'next'
import NotFoundView from './NotFoundView'

// Missing paths must not inherit the homepage title or index,follow.
// Do not publish a canonical URL: one address would be attached to every unknown path.
export const metadata: Metadata = {
  title: '找不到頁面 | DSE Level Up', // i18n-exempt: 404 document title
  description: '這個網址沒有對應頁面。', // i18n-exempt: 404 document description
  robots: {
    index: false,
    follow: false,
    googleBot: { index: false, follow: false },
  },
}

export default function NotFound() {
  return <NotFoundView />
}
