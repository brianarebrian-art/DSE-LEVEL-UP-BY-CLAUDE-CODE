import Link from 'next/link'
import '@/components/founder/founder-theme.css'

export default function FounderMfaChrome({
  title,
  email,
  gateState,
  children,
}: {
  title: string
  email?: string
  gateState?: string
  children: React.ReactNode
}) {
  return (
    <div data-founder-os data-founder-mfa className="min-h-dvh">
      <div className="mx-auto flex min-h-dvh max-w-lg flex-col px-4 py-10">
        <header className="mb-8">
          <p className="text-xs font-semibold tracking-[0.2em] text-cyan-400/90 uppercase">
            DSE Level Up
          </p>
          <h1 className="mt-2 text-2xl font-semibold text-slate-100">{title}</h1>
          <p className="mt-2 text-sm text-slate-400">
            Founder OS 需要 Google 身份同 Authenticator 驗證碼。TOTP 唔係防釣魚驗證。
          </p>
          {email ? (
            <p className="mt-3 text-xs text-slate-500">
              已驗證 Google：{email}
              {gateState ? ` · ${gateState}` : ''}
            </p>
          ) : null}
        </header>
        <main className="fos-panel flex-1 p-5 sm:p-6">{children}</main>
        <footer className="mt-8 flex items-center justify-between gap-3 text-xs text-slate-500">
          <Link href="/" className="underline decoration-cyan-800/50 hover:text-cyan-300">
            返回首頁
          </Link>
          <form action="/api/founder/mfa/sign-out" method="post">
            <button type="submit" className="underline decoration-cyan-800/50 hover:text-cyan-300">
              登出
            </button>
          </form>
        </footer>
      </div>
    </div>
  )
}
