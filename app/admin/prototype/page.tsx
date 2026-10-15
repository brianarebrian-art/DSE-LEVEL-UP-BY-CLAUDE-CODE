import Link from 'next/link'
import { ArrowLeft, LockKeyhole, Sparkles } from 'lucide-react'
import PrototypeDashboard from './PrototypeDashboard'

export default function AdminPrototypePage() {
  return (
    <main className="min-h-screen bg-surface text-ink-soft">
      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-10">
        <Link href="/admin" className="mb-6 inline-flex min-h-11 items-center gap-2 text-sm text-ink-muted underline-offset-4 hover:text-accent-strong hover:underline">
          <ArrowLeft aria-hidden /> 返回審核面板
        </Link>
        <header className="mb-8 rounded-3xl border border-line bg-surface-raised p-5 sm:p-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent-strong"><Sparkles aria-hidden /> AI 管理原型</div>
              <h1 className="text-3xl font-medium tracking-tight text-ink sm:text-4xl">DSE Level Up 控制台</h1>
              <p className="mt-3 max-w-2xl text-sm leading-6 text-ink-muted">這是未連接 Supabase 的互動原型。以下數字均為示範資料，不代表真實學生紀錄；AI 只會提出建議，正式修改仍需人手確認。</p>
            </div>
            <div className="flex items-center gap-2 rounded-xl border border-gold/30 bg-gold/10 px-3 py-2 text-xs text-gold-strong"><LockKeyhole aria-hidden /> Demo mode · 不讀取真實資料</div>
          </div>
        </header>
        <PrototypeDashboard />
      </div>
    </main>
  )
}

export const metadata = { title: '管理原型｜DSE Level Up' }

