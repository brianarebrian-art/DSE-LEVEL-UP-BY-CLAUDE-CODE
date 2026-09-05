'use client'

import { useLocale } from '@/lib/i18n'

// 正在播放列：脈動綠點 + 停止掣。prefers-reduced-motion 時停用脈動。
export default function NowPlayingBar({ name, onStop }: { name: string | null; onStop: () => void }) {
  const { locale } = useLocale()
  const en = locale === 'en'
  if (!name) return null
  return (
    <div className="sticky bottom-4 rounded-xl bg-surface-raised border border-line px-4 py-3 flex items-center gap-3">
      <span className="w-2 h-2 rounded-full bg-accent animate-pulse motion-reduce:animate-none shrink-0" aria-hidden />
      <span className="flex-1 text-sm text-ink truncate">{en ? 'Now playing: ' : '正在播放：'}{name}</span>
      <button
        onClick={onStop}
        aria-label={en ? 'Stop playback' : '停止播放'}
        className="min-h-11 min-w-11 flex items-center justify-center rounded-lg border border-line text-ink-muted hover:text-ink hover:border-line-strong transition-colors"
      >
        <span className="block w-3 h-3 bg-current rounded-[2px]" aria-hidden />
      </button>
    </div>
  )
}
