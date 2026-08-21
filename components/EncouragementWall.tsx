'use client'

import { useEffect, useState } from 'react'
import { HeartHandshake } from 'lucide-react'
import { useLocale } from '@/lib/i18n'

// 打氣說話（Emma/UDL）— 溫暖共情、零責備。每日輪換 3 條（以日期作種子，
// 避免 hydration 不一致：mount 後才渲染）。
//
// ══ 2026-08-21：拆走假見證 ══
// 舊版標題係「過來人打氣牆」，每條落款「—— 匿名學長姐」。但呢啲說話係我哋
// 自己寫嘅，唔係任何一個真實學生講過嘅話。一句我哋寫、但簽住別人名嘅說話，
// 就係憲章 §8 禁嘅「假用戶見證」—— 而且係最難解釋嗰種：學生喺最脆弱嗰刻信咗
// 一個唔存在嘅人。
//
// 兩處改動：
//   ① 落款同標題拆走 —— 呢啲係編輯部寫畀你嘅說話，就照咁講。
//   ② 兩條【內容本身就係第一人稱經歷】嘅刪走重寫。「我當年都係 Band 3，
//      而家讀緊 U」同「我 Mock 考包尾，最後都夠分入到心儀科」唔係拆招牌就
//      補救得到 —— 佢哋本身就係一個關於某個具體人嘅事實聲稱，而嗰個人唔存在。
//      改寫成唔假託任何人嘅講法，唔會削弱佢哋想講嘅嘢。

const MESSAGES: { zh: string; en: string }[] = [
  { zh: '入到大學嘅路唔止一條，band 幾都好，都唔係終點。', en: 'There is more than one road into university — whichever band you are in, it is not the end of the line.' },
  { zh: '錯題係寶藏，唔係垃圾。今日搵到一個盲點，考試就少一個伏。', en: 'Wrong answers are treasure, not trash — every blind spot you find now is one fewer trap in the exam.' },
  { zh: '今日肯打開嚟做題，已經贏咗好多同齡人。', en: 'Just showing up to practise today already puts you ahead.' },
  { zh: '溫唔入腦嗰陣，唞 5 分鐘好過死撐 50 分鐘。', en: 'When nothing goes in, a 5-minute break beats 50 minutes of forcing it.' },
  { zh: 'DSE 係一場馬拉松，唔係鬥快 100 米。穩住自己個 pace。', en: 'The DSE is a marathon, not a 100m sprint. Hold your own pace.' },
  { zh: '分數只反映嗰一日嘅你，唔代表你嘅上限。', en: 'A score reflects you on one day — never your ceiling.' },
  { zh: 'Mock 嘅分數唔係判詞。由 Mock 到正式考仲有好多時間。', en: 'A mock result is not a verdict — there is still a lot of time between it and the real thing.' },
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
    <div className="bg-surface-raised border border-line rounded-2xl p-5">
      <div className="flex items-center gap-2 text-ink-soft font-medium mb-3">
        <HeartHandshake size={16} className="text-gold" />
        {en ? 'A word from us' : '想同你講幾句'}
      </div>
      <ul className="space-y-2">
        {picks.map((msg, i) => (
          <li key={i} className="text-sm text-ink-muted leading-relaxed border-l-2 border-gold/30 pl-3">
            {en ? msg.en : msg.zh}
          </li>
        ))}
      </ul>
    </div>
  )
}
