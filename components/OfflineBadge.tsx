'use client'

import { Check, Cloud, CloudOff, Loader2 } from 'lucide-react'
import { useLocale } from '@/lib/i18n'
import { useSettingsSyncState } from '@/components/SettingsSync'

// v8.0 CLOUD-FIRST · UI1 —— 溫和同步狀態章。
//
// 情緒安全網規矩（憲章 §3）：
//   ✗ 唔用紅色、✗ 唔用「！」警告圖示、✗ 唔用「失敗」字眼
//   ✗ 唔會喺做題途中彈出 —— 呢個組件只放喺 dashboard／設定區
//   「未同步」講嘅係「你部機好安全」，唔係「你出事喇」。

export default function OfflineBadge({ className = '' }: { className?: string }) {
  const state = useSettingsSyncState()
  const { locale } = useLocale()
  const en = locale === 'en'

  if (state === 'idle' || state === 'synced') {
    // 一切正常就唔好嘈住學生 —— 只留一個極淡嘅已同步提示
    if (state !== 'synced') return null
    return (
      <span
        className={`inline-flex items-center gap-1.5 text-xs text-[#9CA3AF] ${className}`}
        aria-live="off"
      >
        <Check size={12} className="text-[#008B84]" />
        {en ? 'Settings synced' : '設定已同步'}
      </span>
    )
  }

  if (state === 'syncing') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 text-xs text-[#9CA3AF] ${className}`}
        aria-live="off"
      >
        <Loader2 size={12} className="animate-spin motion-reduce:animate-none" />
        {en ? 'Saving…' : '儲緊進度⋯⋯'}
      </span>
    )
  }

  if (state === 'pending') {
    return (
      <span
        className={`inline-flex items-center gap-1.5 rounded-full border border-black/[0.10] bg-[#F5F5F0] px-3 py-1 text-xs text-[#6B6B6B] ${className}`}
      >
        <CloudOff size={12} />
        {en
          ? 'Your progress is safe on this device — it will sync when you are back online.'
          : '進度喺呢部機好安全，返到網就會自動同步。'}
      </span>
    )
  }

  // anonymous —— 邀請，唔係要脅。做唔做題完全唔受影響。
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border border-black/[0.10] bg-[#F5F5F0] px-3 py-1 text-xs text-[#6B6B6B] ${className}`}
    >
      <Cloud size={12} />
      {en
        ? 'Sign in with Google to carry your settings across devices.'
        : '登入 Google 就可以將設定帶去其他裝置。'}
    </span>
  )
}
