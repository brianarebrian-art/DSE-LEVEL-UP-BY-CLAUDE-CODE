'use client'

import { useState } from 'react'
import { ChevronDown, Calculator } from 'lucide-react'
import { useLocale } from '@/lib/i18n'
import { getCalcTip } from '@/data/calcTips'

// #83 計數機貼士卡（Victor 起草 → 真人真機驗證 → 先上線）—— 解析底部折疊區。
//
// 學術生死線閘：verified:false 嘅卡喺 production 完全唔 render（return null）；
// 只有 development 先會見到草稿 + 「未經真機驗證」警示，方便 Brian/Yuna 審批。
// NODE_ENV 判斷係 build-time 常數，生產 bundle 直接剪走草稿分支。
// 驗證清單：docs/calc-tips-83-review.md。禁 GIF —— 純文字步驟 + CSS 键帽樣式。

export default function CalcTipCard({ topicId }: { topicId: string }) {
  const { locale } = useLocale()
  const en = locale === 'en'
  const [open, setOpen] = useState(false)
  const tip = getCalcTip(topicId)
  if (!tip) return null
  const isDraft = !tip.verified
  if (isDraft && process.env.NODE_ENV !== 'development') return null

  return (
    <div className="rounded-2xl mb-4 border bg-accent/[0.06] border-accent/25">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        className="w-full min-h-11 flex items-center gap-2 px-5 py-3 text-left"
      >
        <Calculator size={16} className="text-accent shrink-0" />
        <span className="text-sm font-semibold text-accent flex-1">
          🧮 {en ? 'Calculator tip · ' : '計數機貼士 · '}
          {en ? tip.titleEn : tip.titleZh}
        </span>
        {isDraft && (
          <span className="text-[10px] font-bold text-gold bg-gold/[0.10] border border-gold/30 rounded-full px-2 py-0.5 shrink-0">
            ⚠️ {en ? 'DRAFT — not machine-verified' : '草稿 · 未經真機驗證'}
          </span>
        )}
        <ChevronDown
          size={16}
          className={`text-accent shrink-0 transition-transform ${open ? 'rotate-180' : ''}`}
        />
      </button>

      {open && (
        <div className="px-5 pb-5 space-y-4 text-sm">
          {/* (1) 適用題型判斷 */}
          <div>
            <p className="text-xs font-bold text-accent mb-1">
              {en ? 'When to use' : '適用題型判斷'}
            </p>
            <p className="text-ink-soft leading-relaxed">{en ? tip.whenEn : tip.whenZh}</p>
          </div>

          {/* (2) Program 碼 —— 刻意保持深底：程式碼區塊深色係常規，而且深底 +
              淺字（cyan-100）本身自洽，對比 13:1 以上。 */}
          {tip.program && (
            <div>
              <p className="text-xs font-bold text-accent mb-1">
                {en ? 'Program (fx-50FH II / fx-3650P II)' : 'Program 碼（fx-50FH II / fx-3650P II）'}
              </p>
              <code className="block bg-slate-950 border border-slate-700 rounded-lg px-3 py-2 text-cyan-100 text-xs leading-relaxed overflow-x-auto whitespace-nowrap">
                {tip.program}
              </code>
            </div>
          )}

          {/* (3) 按鍵步驟 */}
          <div>
            <p className="text-xs font-bold text-accent mb-1">{en ? 'Key steps' : '按鍵步驟'}</p>
            <ol className="space-y-1.5">
              {tip.steps.map((s, i) => (
                <li key={i} className="flex items-start gap-2 text-ink-soft leading-relaxed">
                  <span className="shrink-0 w-5 h-5 rounded bg-accent text-on-accent text-[11px] font-bold flex items-center justify-center mt-0.5">
                    {i + 1}
                  </span>
                  {en ? s.en : s.zh}
                </li>
              ))}
            </ol>
          </div>

          {/* (4) 常見陷阱 */}
          <div>
            <p className="text-xs font-bold text-accent mb-1">{en ? 'Common traps' : '常見陷阱'}</p>
            <ul className="space-y-1.5">
              {(en ? tip.trapsEn : tip.trapsZh).map((t, i) => (
                <li key={i} className="flex items-start gap-2 text-ink-soft leading-relaxed">
                  <span className="text-gold shrink-0" aria-hidden>⚠</span>
                  {t}
                </li>
              ))}
            </ul>
          </div>

          <p className="text-[11px] text-ink-muted leading-relaxed border-t border-line pt-2">
            {en
              ? 'Menu paths vary slightly between calculator revisions — verify on your own machine before the exam.'
              : '唔同機版嘅選單路徑有少少出入 —— 考試前用自己部機行一次先算數。'}
          </p>
        </div>
      )}
    </div>
  )
}
