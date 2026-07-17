'use client'

import { useId } from 'react'

// P1-6-R1 沙漏 SVG 霓虹動效（Leo 2026-07-16）—— 60 秒反思鎖嘅視覺計時器，
// 取代數字倒數。純 SVG path + CSS，零外部圖片／字體／Lottie。
//
// 非線性沙流（前快後慢，easeOut）：時間感知心理學 —— 開頭見到明顯流動俾學生
// 知道「個鎖行緊」，尾段放緩減低「最後幾秒」嘅壓迫感。剩餘時間本身由
// PracticeSession 嘅 deadline 計時器負責（準確度唔靠呢度嘅視覺 easing）。
//
// soft（calmLock／gentleLock）：沙流動畫速度減半＋降透明度＋減光暈。
// 完成時框轉綠（配合「Next」解鎖），sr 用戶靠 role="timer" aria-label。

interface HourglassTimerProps {
  /** 剩餘秒數（0 = 沙漏流完） */
  remaining: number
  /** 總秒數（60） */
  total: number
  /** 柔和模式：減速、降飽和 */
  soft: boolean
  /** 沙漏下方中央文案（已翻譯） */
  label: string
  /** role="timer" 嘅無障礙名（已翻譯） */
  ariaLabel: string
}

export default function HourglassTimer({ remaining, total, soft, label, ariaLabel }: HourglassTimerProps) {
  const uid = useId()
  const p = total > 0 ? Math.min(1, Math.max(0, 1 - remaining / total)) : 1
  // easeOutQuad：p=0 時流速最快，趨近完成時放緩
  const e = 1 - (1 - p) * (1 - p)
  const done = remaining <= 0
  // 上錐沙面由 y=16 落到 y=94（頸位）；下錐沙堆由 y=184 升到 y=110
  const topY = 16 + e * 78
  const pileH = e * 74
  const sandOpacity = soft ? 0.32 : 0.55
  const geomTransition = { transition: 'y 1s linear, height 1s linear' }

  return (
    <div
      role="timer"
      aria-label={ariaLabel}
      className={`flex flex-col items-center gap-3 ${soft ? 'hourglass-soft' : ''}`}
    >
      <svg
        viewBox="0 0 120 200"
        className="w-[120px] h-[200px] sm:w-[160px] sm:h-[260px]"
        aria-hidden
        style={{
          filter: done
            ? 'none'
            : `drop-shadow(0 0 ${soft ? 4 : 7}px rgba(0, 245, 212, ${soft ? 0.25 : 0.45}))`,
        }}
      >
        <defs>
          <clipPath id={`${uid}-top`}>
            <path d="M22 16 H98 L64 94 H56 Z" />
          </clipPath>
          <clipPath id={`${uid}-bottom`}>
            <path d="M56 106 H64 L98 184 H22 Z" />
          </clipPath>
        </defs>

        {/* 上錐剩餘沙（沙面逐秒下降） */}
        <rect
          clipPath={`url(#${uid}-top)`}
          x="14"
          y={topY}
          width="92"
          height={Math.max(0, 94 - topY)}
          fill="var(--color-neon-cyan)"
          fillOpacity={sandOpacity}
          style={geomTransition}
        />

        {/* 落沙流（虛線向下流動 —— 動畫喺 globals.css .hourglass-stream） */}
        {!done && (
          <line
            x1="60"
            y1="96"
            x2="60"
            y2={184 - pileH}
            stroke="var(--color-neon-cyan)"
            strokeOpacity={sandOpacity}
            strokeWidth="2"
            className="hourglass-stream"
          />
        )}

        {/* 下錐沙堆（逐秒升高） */}
        <rect
          clipPath={`url(#${uid}-bottom)`}
          x="14"
          y={184 - pileH}
          width="92"
          height={pileH + 2}
          fill="var(--color-neon-cyan)"
          fillOpacity={sandOpacity}
          style={geomTransition}
        />

        {/* 沙漏霓虹框（完成 → 綠） */}
        <g
          fill="none"
          stroke={done ? '#4ade80' : 'var(--color-neon-cyan)'}
          strokeWidth="2.5"
          strokeLinejoin="round"
          strokeLinecap="round"
          style={{ transition: 'stroke 0.2s cubic-bezier(0.4, 0, 0.2, 1)' }}
        >
          <line x1="14" y1="10" x2="106" y2="10" />
          <line x1="14" y1="190" x2="106" y2="190" />
          <path d="M22 12 H98 L64 96 V104 L98 188 H22 L56 104 V96 Z" />
        </g>
      </svg>
      <p className="text-sm text-slate-300 text-center leading-relaxed">{label}</p>
    </div>
  )
}
