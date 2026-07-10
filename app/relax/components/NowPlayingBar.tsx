'use client'

// 正在播放列：脈動綠點 + 停止掣。prefers-reduced-motion 時停用脈動。
export default function NowPlayingBar({ name, onStop }: { name: string | null; onStop: () => void }) {
  if (!name) return null
  return (
    <div className="sticky bottom-4 rounded-xl bg-[#14141B] border border-white/10 px-4 py-3 flex items-center gap-3">
      <span className="w-2 h-2 rounded-full bg-[#00F5D4] animate-pulse motion-reduce:animate-none shrink-0" aria-hidden />
      <span className="flex-1 text-sm text-[#E8E8EC] truncate">正在播放：{name}</span>
      <button
        onClick={onStop}
        aria-label="停止播放"
        className="min-h-11 min-w-11 flex items-center justify-center rounded-lg border border-white/15 text-[#8B8B96] hover:text-[#E8E8EC] hover:border-white/30 transition-colors"
      >
        <span className="block w-3 h-3 bg-current rounded-[2px]" aria-hidden />
      </button>
    </div>
  )
}
