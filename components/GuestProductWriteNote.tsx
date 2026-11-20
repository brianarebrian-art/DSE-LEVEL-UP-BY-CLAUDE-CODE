'use client'

import Link from 'next/link'

// Shown when a guest tries to keep session feedback, /feedback, or a question report.
// The row is not saved. Practice itself stays free.
export default function GuestProductWriteNote({ en }: { en: boolean }) {
  return (
    <div role="status" className="mt-2 space-y-2">
      <p className="text-sm leading-relaxed text-ink-muted">
        {en
          ? 'This stays on this page and is not saved. To keep it so we can improve the product, sign in with Google. This is still completely free. Signing in is not a paywall and unlocks no paid content.'
          : '呢份留喺呢一頁，未有保存。如果想留低嚟幫我哋改進產品，請用 Google 登入。仍然完全免費。登入唔係付費牆，亦唔會解鎖任何收費內容。'}
      </p>
      <Link
        href="/sign-in"
        className="inline-flex min-h-11 items-center text-sm text-accent underline underline-offset-2"
      >
        {en ? 'Sign in with Google' : '用 Google 登入'}
      </Link>
    </div>
  )
}
