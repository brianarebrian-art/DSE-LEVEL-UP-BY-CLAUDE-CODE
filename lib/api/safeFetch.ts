export const BROTLI_ACCEPT_ENCODING = 'gzip, deflate'

function isExternalTarget(url: URL): boolean {
  if (url.protocol !== 'http:' && url.protocol !== 'https:') return false

  const host = url.hostname.toLowerCase()
  const localhostNames = new Set([
    'localhost',
    '127.0.0.1',
    '::1',
    '[::1]',
  ])

  return !localhostNames.has(host) && !host.endsWith('.localhost')
}

function resolveUrl(input: RequestInfo | URL): URL | null {
  if (typeof input === 'string') {
    try {
      return new URL(input)
    } catch {
      return null
    }
  }

  if (input instanceof URL) return input

  if (input instanceof Request) return new URL(input.url)

  return null
}

export function withBrotliDowngrade(
  input: RequestInfo | URL,
  init: RequestInit = {},
): RequestInit {
  const target = resolveUrl(input)
  if (!target || !isExternalTarget(target)) return init

  const headers = new Headers(init.headers ?? {})
  const value = headers.get('accept-encoding')?.toLowerCase() ?? ''

  if (!value || value.includes('br') || value.includes('brotli')) {
    headers.set('Accept-Encoding', BROTLI_ACCEPT_ENCODING)
  }

  return {
    ...init,
    headers,
  }
}

export function safeFetch(input: RequestInfo | URL, init: RequestInit = {}): Promise<Response> {
  const nextInit = withBrotliDowngrade(input, init)

  if (input instanceof Request) {
    return fetch(new Request(input, nextInit))
  }

  return fetch(input, nextInit)
}
