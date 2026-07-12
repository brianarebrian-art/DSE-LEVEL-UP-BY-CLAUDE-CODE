'use client'

import { useLocale } from '@/lib/i18n'

// 感官菜單（Emma 得獎方案）— 入場先問「今日你想點樣感受呢個空間」。
// 三個可多選開關：安靜／聲音／畫面，決定 relax 區顯示乜嘢內容。
// 設定存 localStorage `dse_relax_sensory_pref`，任何時候可以重開再揀。

export interface SensoryPref {
  quiet: boolean
  sound: boolean
  visual: boolean
}

export const DEFAULT_PREF: SensoryPref = { quiet: false, sound: true, visual: true }
const KEY = 'dse_relax_sensory_pref'

export function loadSensoryPref(): SensoryPref | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return null
    const p = JSON.parse(raw)
    return { quiet: !!p.quiet, sound: !!p.sound, visual: !!p.visual }
  } catch {
    return null
  }
}

export function saveSensoryPref(p: SensoryPref): void {
  try { localStorage.setItem(KEY, JSON.stringify(p)) } catch { /* ignore */ }
}

const OPTIONS: { key: keyof SensoryPref; emoji: string; labelZh: string; labelEn: string; hintZh: string; hintEn: string }[] = [
  { key: 'quiet', emoji: '🔇', labelZh: '我想要安靜', labelEn: 'I want quiet', hintZh: '淨係文字，唔要聲音同動畫', hintEn: 'Text only — no sound or animation' },
  { key: 'sound', emoji: '🎵', labelZh: '我想要聲音', labelEn: 'I want sound', hintZh: '顯示聲音清單', hintEn: 'Show the sound list' },
  { key: 'visual', emoji: '🖼️', labelZh: '我想要畫面', labelEn: 'I want visuals', hintZh: '柔和漸變同動畫', hintEn: 'Soft gradients and animation' },
]

export default function SensoryMenu({
  pref,
  onChange,
  onDone,
}: {
  pref: SensoryPref
  onChange: (p: SensoryPref) => void
  onDone: () => void
}) {
  const { locale } = useLocale()
  const en = locale === 'en'
  const toggle = (key: keyof SensoryPref) => {
    let next = { ...pref, [key]: !pref[key] }
    // 「安靜」與「聲音」互斥：揀安靜會熄聲音，反之亦然
    if (key === 'quiet' && next.quiet) next = { ...next, sound: false }
    if (key === 'sound' && next.sound) next = { ...next, quiet: false }
    onChange(next)
  }

  return (
    <div className="fixed inset-0 z-50 bg-[#0A0A0F]/96 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-[#14141B] rounded-xl p-6">
        <h2 className="text-lg font-bold text-[#E8E8EC] mb-1">{en ? 'Welcome to ⚡ Buff Station' : '歡迎嚟到 ⚡ Buff 補給艙'}</h2>
        <p className="text-sm text-[#8B8B96] mb-5">{en ? 'How do you want this space to feel today? (you can pick more than one)' : '今日你想點樣感受呢個空間？（可以多選）'}</p>

        <div className="space-y-3 mb-6">
          {OPTIONS.map((o) => {
            const on = pref[o.key]
            return (
              <button
                key={o.key}
                onClick={() => toggle(o.key)}
                aria-pressed={on}
                className={`w-full min-h-11 flex items-center gap-3 text-left rounded-[10px] border px-4 py-3 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#00F5D4] ${
                  on
                    ? 'border-[#00F5D4]/60 bg-[#00F5D4]/10 text-[#E8E8EC]'
                    : 'border-white/10 bg-transparent text-[#8B8B96] hover:border-white/25'
                }`}
              >
                <span className="text-xl" aria-hidden>{o.emoji}</span>
                <span className="flex-1">
                  <span className="block text-sm font-medium">{en ? o.labelEn : o.labelZh}</span>
                  <span className="block text-xs opacity-70">{en ? o.hintEn : o.hintZh}</span>
                </span>
                <span className={`text-xs ${on ? 'text-[#00F5D4]' : 'opacity-40'}`}>{on ? (en ? 'Selected' : '已選') : ''}</span>
              </button>
            )
          })}
        </div>

        <button
          onClick={onDone}
          className="w-full min-h-11 rounded-[10px] bg-[#00F5D4]/15 border border-[#00F5D4]/40 text-[#00F5D4] font-medium py-3 hover:bg-[#00F5D4]/25 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#00F5D4]"
        >
          {en ? 'Enter' : '入去先'}
        </button>
        <p className="text-[11px] text-[#8B8B96] text-center mt-3">{en ? 'You can change this anytime from the main page.' : '之後隨時可以喺主頁改返。'}</p>
      </div>
    </div>
  )
}
