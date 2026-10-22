import Link from 'next/link'
import { completeSeoMetadata } from '@/lib/seo'
import { getActiveSubjects } from '@/data/subjects'
import { getSubjectQuestions } from '@/data/questions'
import PracticeShell from './PracticeShell'
import PracticeCatalogHeader from './PracticeCatalogHeader'

// ── 伺服器端外殼（2026-07-29，Backlog A-25）────────────────────────────────────
// 原本本檔第一行係 `'use client'`，整版由客戶端渲染 —— 爬蟲取得嘅 HTML 只有一句
// 「載入中…」，等同一版白紙。平台核心功能頁完全無法索引。
//
// 修法：本檔改回 server component，只負責輸出「爬蟲讀得到」嘅標題與描述，
// 互動邏輯原封不動搬入 `PracticeShell.tsx`（client）。
//
// 2026-10-22：頁面維持 noindex（任務外殼）。有 ?subject= 時題庫目錄改 sr-only，
// 避免同練習引擎搶屏；公開搜尋落地靠 /subjects。無參數時目錄可見作揀科入口。

export const metadata = completeSeoMetadata({
  title: 'DSE 練習 | DSE Level Up', // i18n-exempt: zh-Hant fixed search metadata
  description: '選擇科目與課題開始個人化 DSE 練習，作答紀錄只儲存在你的裝置。公開科目入口見科目總覽。', // i18n-exempt: zh-Hant fixed search metadata
}, '/practice')

export default function PracticePage() {
  const subjects = getActiveSubjects()
  const all = subjects.flatMap((s) => getSubjectQuestions(s.id))
  const total = all.length
  const written = all.filter((q) => q.type === 'long' || q.type === 'text').length
  const mc = total - written

  return (
    <>
      <PracticeCatalogHeader>
        <h1>DSE 練習題庫 · HKDSE Practice{/* i18n-exempt: 雙語已並列（server component 冇 locale） */}</h1>
        <p className="mt-3 text-sm leading-relaxed text-ink-soft">
          共 {total} 條獨立改寫題目（多項選擇 {mc} 條、書寫題 {written} 條），涵蓋 {subjects.length} 個 DSE 科目。答錯即時睇到解析。書寫題永不機器批改，交卷後對照參考答案自評。所有題目為原創改寫，並非香港考試及評核局（HKEAA）官方試題。
          {/* i18n-exempt: 雙語已並列，緊接下段英文 */}
        </p>
        <p className="mt-2 text-sm leading-relaxed text-ink-muted">
          {total} independently rewritten questions across {subjects.length} HKDSE subjects
          ({mc} multiple-choice, {written} written-response). The explanation opens as soon as you
          answer. Written-response questions are never machine-marked — you self-assess
          against the reference answer. Not affiliated with the HKEAA.
        </p>
        <p className="mt-3 text-sm">
          <Link href="/subjects" className="text-accent underline underline-offset-4 hover:text-accent-strong">
            科目總覽 · Browse all subjects{/* i18n-exempt: 雙語並列 */}
          </Link>
        </p>
        <section aria-labelledby="practice-subjects-heading" className="mt-6">
          <h2 id="practice-subjects-heading" className="text-base font-medium text-ink">
            科目 · Subjects{/* i18n-exempt: 雙語已並列 */}
          </h2>
          <ul className="mt-3 space-y-2 text-sm text-ink-soft">
            {subjects.map((s) => {
              const subjectQuestions = getSubjectQuestions(s.id)
              const subjectWritten = subjectQuestions.filter((q) => q.type === 'long' || q.type === 'text').length
              const subjectMc = subjectQuestions.length - subjectWritten
              return (
                <li key={s.id}>
                  <Link href={`/subjects/${s.id}`} className="hover:text-accent underline-offset-2 hover:underline">
                    {s.name} — {subjectQuestions.length} 總題數 / total questions（{subjectMc} MC / multiple-choice、{subjectWritten} 書寫題 / written-response）
                    {/* i18n-exempt: 雙語並列 */}
                  </Link>
                </li>
              )
            })}
          </ul>
        </section>
      </PracticeCatalogHeader>

      <PracticeShell />
    </>
  )
}
