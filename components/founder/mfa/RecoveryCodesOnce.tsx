'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

export default function RecoveryCodesOnce() {
  const [codes, setCodes] = useState<string[] | null>(null)

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('fos_recovery_codes_once')
      if (!raw) {
        setCodes([])
        return
      }
      const parsed = JSON.parse(raw) as string[]
      setCodes(Array.isArray(parsed) ? parsed : [])
      sessionStorage.removeItem('fos_recovery_codes_once')
    } catch {
      setCodes([])
    }
  }, [])

  if (codes == null) {
    return <p className="text-sm text-slate-400">載入中…</p>
  }

  if (!codes.length) {
    return (
      <div className="space-y-3 text-sm text-slate-400">
        <p>冇可顯示嘅復原碼（可能已睇過或頁面已重新整理）。</p>
        <Link href="/founder" className="text-cyan-300 underline">
          進入 Founder OS
        </Link>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <ul className="grid gap-2 rounded-lg border border-cyan-500/20 bg-[#07111f] p-4 font-mono text-sm text-cyan-100 sm:grid-cols-2">
        {codes.map((c) => (
          <li key={c}>{c}</li>
        ))}
      </ul>
      <p className="text-xs text-amber-200/90">關閉或重新整理後唔會再顯示原碼。</p>
      <Link
        href="/founder"
        className="inline-flex items-center justify-center rounded-lg bg-cyan-500/90 px-4 py-3 text-sm font-semibold text-slate-950"
      >
        我已離線保存，進入 Founder OS
      </Link>
    </div>
  )
}
