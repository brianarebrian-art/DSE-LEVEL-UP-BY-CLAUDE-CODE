import { headers } from 'next/headers'
import { serializeJsonLd } from '@/lib/structuredData'

/** Keep structured data in the initial response and compatible with the page CSP. */
export async function JsonLd({ data }: { data: unknown }) {
  const nonce = (await headers()).get('x-nonce') ?? undefined
  return <script type="application/ld+json" nonce={nonce} dangerouslySetInnerHTML={{ __html: serializeJsonLd(data) }} />
}
