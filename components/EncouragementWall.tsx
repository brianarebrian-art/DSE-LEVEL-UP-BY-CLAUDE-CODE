'use client'

import { useEffect, useState } from 'react'
import { HeartHandshake } from 'lucide-react'
import { useLocale } from '@/lib/i18n'

// 匿名打氣牆（Sarah/駐校社工）— 預設學長學姐留言，溫暖共情、零責備。
// 每日輪換 3 條（以日期作種子，避免 hydration 不一致：mount 後才渲染）。

const MESSAGES: { zh: string; en: string }[] = [
  { zh: '我當年都係 Band 3，而家讀緊 U。條路唔止一條。', en: 'I was from a Band 3 school too — now I’m at university. There’s more than one road.' },
  { zh: '錯題係寶藏，唔係垃圾。今日搵到一個盲點，考試就少一個伏。', en: 'Wrong answers are treasure, not trash — every blind spot you find now is one fewer trap in the exam.' },
  { zh: '今日肯打開嚟做題，已經贏咗好多同齡人。', en: 'Just showing up to practise today already puts you ahead.' },
  { zh: '溫唔入腦嗰陣，唞 5 分鐘好過死撐 50 分鐘。', en: 'When nothing goes in, a 5-minute break beats 50 minutes of forcing it.' },
  { zh: 'DSE 係一場馬拉松，唔係鬥快 100 米。穩住自己個 pace。', en: 'The DSE is a marathon, not a 100m sprint. Hold your own pace.' },
  { zh: '分數只反映嗰一日嘅你，唔代表你嘅上限。', en: 'A score reflects you on one day — never your ceiling.' },
  { zh: '我 Mock 考包尾，最後都夠分入到心儀科。唔好咁早放棄自己。', en: 'I came last in the mocks and still made my dream programme. Don’t write yourself off early.' },
  { zh: '攰就早啲瞓。瞓夠先記得入腦，通頂溫書係假努力。', en: 'Tired? Sleep. Memory consolidates when you rest — all-nighters are fake diligence.' },
]

export default function EncouragementWall() {
  const { locale } = useLocale()
  const en = locale === 'en'
  const [picks, setPicks] = useState<typeof MESSAGES>([])

  useEffect(() => {
    const day = Math.floor(Date.now() / 86_400_000)
    setPicks([0, 1, 2].map((i) => MESSAGES[(day * 3 + i) % MESSAGES.length]))
  }, [])

  if (picks.length === 0) return null

  return (
    <div className="bg-white border border-black/[0.06] rounded-2xl p-5">
      <div className="flex items-center gap-2 text-[#2D2D2D] font-medium mb-3">
        <HeartHandshake size={16} className="text-[#B8860B]" />
        {en ? 'From those who walked this road' : '過來人打氣牆'}
      </div>
      <ul className="space-y-2">
        {picks.map((msg, i) => (
          <li key={i} className="text-sm text-[#6B6B6B] leading-relaxed border-l-2 border-[#B8860B]/30 pl-3">
            {en ? msg.en : msg.zh}
            <span className="text-[#9CA3AF] text-xs ml-2">{en ? '— an anonymous senior' : '—— 匿名學長姐'}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
