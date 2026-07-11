import Link from 'next/link'

// Custom 404 — replaces Next's default so no framework/version detail is implied,
// and the user always has a way back. Static, no data access.
export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 text-center">
      <div>
        <div className="text-6xl mb-4" aria-hidden>🧭</div>
        <h1 className="text-2xl font-extrabold mb-2">搵唔到呢一頁</h1>
        <p className="text-slate-400 mb-6 text-sm">連結可能已經改咗，或者你打錯咗網址。</p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-black font-bold px-5 py-2.5 rounded-xl transition-all"
        >
          返回首頁
        </Link>
      </div>
    </div>
  )
}
