'use client'

import { useState } from 'react'
import { useLocale } from '@/lib/i18n'

// 錯題情緒標籤（F01，Emma — 腦震盪 5 票冠軍）。答錯後三個情緒掣，
// 按選擇回應唔同語氣；記錄入 localStorage `dse_emotion_log`（本地，供將來
// 壓力指數分析用）。以 key={question.id} 掛載，每題自動重置。零罪疚語言。

type Emotion = 'upset' | 'neutral' | 'curious'
const KEY = 'dse_emotion_log'
const CAP = 200

function logEmotion(tag: Emotion) {
  try {
    const raw = localStorage.getItem(KEY)
    const list: { tag: Emotion; ts: number }[] = raw ? JSON.parse(raw) : []
    list.unshift({ tag, ts: Date.now() })
    localStorage.setItem(KEY, JSON.stringify(list.slice(0, CAP)))
  } catch { /* best-effort */ }
}

const TAGS: { key: Emotion; emoji: string; zh: string; en: string }[] = [
  { key: 'upset', emoji: '😰', zh: '唔開心', en: 'Upset' },
  { key: 'neutral', emoji: '😐', zh: '冇所謂', en: 'Meh' },
  { key: 'curious', emoji: '💡', zh: '反而想知點解', en: 'Curious why' },
]

const REPLY: Record<Emotion, { zh: string; en: string }> = {
  upset: {
    zh: '你發現咗一個新盲點，呢個係進步嘅開始 💡 錯喺練習度，好過錯喺考場。攰嘅話，左下角「唞一唞」隨時喺度。',
    en: 'You just found a new blind spot — that IS progress. Better here than in the exam hall. The “Breathe” button is there whenever you need it.',
  },
  neutral: {
    zh: '收到。錯因已經入咗錯題本 —— 下次同類題就係你嘅攞分位。',
    en: 'Noted. This cause is in your error log — next time, this question type is yours.',
  },
  curious: {
    zh: '好嘢，呢種心態進步最快 🚀 上面「正解思路」逐步睇；想加操同類題，做完呢輪再嚟一輪同一課題。',
    en: 'That mindset is how you level up fastest 🚀 Walk through the reasoning above, then run another round on this topic.',
  },
}

export default function EmotionTags() {
  const { locale } = useLocale()
  const en = locale === 'en'
  const [picked, setPicked] = useState<Emotion | null>(null)

  return (
    <div className="border-t border-amber-500/15 pt-3 mt-3">
      {picked === null ? (
        <>
          <p className="text-xs text-slate-500 mb-2">{en ? 'How does this one feel?' : '呢題答完，你而家感覺係？'}</p>
          <div className="flex flex-wrap gap-2">
            {TAGS.map((t) => (
              <button
                key={t.key}
                onClick={() => { setPicked(t.key); logEmotion(t.key) }}
                className="min-h-11 px-3 py-2 rounded-[10px] border border-slate-700 bg-slate-800/40 text-xs text-slate-300 hover:border-amber-500/40 hover:text-amber-200 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-amber-400"
              >
                {t.emoji} {en ? t.en : t.zh}
              </button>
            ))}
          </div>
        </>
      ) : (
        <p className="text-xs text-slate-300 leading-relaxed bg-slate-800/40 rounded-[10px] px-3 py-2.5">
          {en ? REPLY[picked].en : REPLY[picked].zh}
        </p>
      )}
    </div>
  )
}
