'use client'

import { useEffect, useState } from 'react'
import { useLocale } from '@/lib/i18n'
import { evidenceLine } from '@/components/SubjectProgressPanel'
import { getTopicStats, topicLabel as labelOf, type TopicStatEntry } from '@/lib/topicStats'
import { weakestInSubject } from '@/lib/topicEvidence'

// 練習頁 1440px 起的左欄（UX 循環 LOOP 40；第二份 loop prompt §19「desktop 係工作區」）。
//
// 1440px 以上兩欄已置中，左右各有大片空白。左欄放做題時用得着的背景：這一題屬甚麼課題、
// 本科你最需要練的課題（附題數）。只顯示，不放連結：做題途中離開會中斷這一節。
// 只讀本機的 dse_topic_stats（課題名稱亦取自該紀錄，毋須把全科課題表載入練習頁），不寫入。
export default function PracticeContextRail({ subjectId, topicLabel }: { subjectId: string; topicLabel: string }) {
  const { locale } = useLocale()
  const en = locale === 'en'
  const [rows, setRows] = useState<TopicStatEntry[]>([])
  // 掛載後才讀；每題更新一次，令這一節剛做完的題目都計在內。
  useEffect(() => setRows(getTopicStats()), [topicLabel])
  const weakest = weakestInSubject(rows, subjectId)

  return (
    <aside aria-label={en ? 'About this session' : '今節背景'} className="focus-dim hidden desk:block sticky top-20 space-y-5 text-sm">
      <section>
        <h2 className="text-xs font-medium uppercase tracking-wide text-ink-muted">{en ? 'This question' : '呢一題'}</h2>
        <p className="mt-1 text-ink-soft">{topicLabel}</p>
      </section>
      <section>
        <h2 className="text-xs font-medium uppercase tracking-wide text-ink-muted">{en ? 'Topics to work on' : '本科最需要練'}</h2>
        {weakest.length === 0 ? (
          <p className="mt-1 text-xs text-ink-muted">
            {en ? 'Not enough answers in any topic yet to say.' : '未有課題做夠題數，暫時講唔到。'}
          </p>
        ) : (
          <ul className="mt-1 space-y-2">
            {weakest.map(({ r, e }) => (
              <li key={r.key}>
                <span className="text-ink-soft">{labelOf(r, en)}</span>
                <span className="block text-xs text-ink-muted">{evidenceLine(e, en)}</span>
              </li>
            ))}
          </ul>
        )}
        <p className="mt-2 text-xs text-ink-muted">{en ? 'From your practice on this device.' : '按你喺呢部機嘅練習計。'}</p>
      </section>
    </aside>
  )
}
