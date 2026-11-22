import type { Metadata } from 'next'

/** Optional public ownership proof. Unconfigured sites must not emit a fake token. */
export function googleVerification(token: string | undefined): Metadata['verification'] {
  const value = token?.trim()
  return value ? { google: value } : undefined
}
