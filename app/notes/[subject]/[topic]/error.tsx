"use client"
import Link from 'next/link'
export default function ErrorView({reset}:{reset:()=>void}) {
  return <div role="alert" className="mx-auto max-w-3xl space-y-4 px-4 py-20 text-ink"><h2 className="text-xl font-semibold">暫時未能載入課題</h2><p>請檢查網絡後重試；不會以其他課題內容代替。</p><button type="button" onClick={reset} className="min-h-12 rounded-xl border border-line-strong px-5 focus-visible:outline focus-visible:outline-[3px] focus-visible:outline-accent">重新載入</button><Link href="/notes" className="ml-4 inline-flex min-h-12 items-center text-accent underline">返回科目筆記</Link></div> // i18n-exempt: requested Traditional Chinese error state
}
