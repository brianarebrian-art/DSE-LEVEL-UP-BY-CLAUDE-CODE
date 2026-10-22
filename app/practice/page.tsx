import { completeSeoMetadata } from '@/lib/seo'
import { getActiveSubjects } from '@/data/subjects'
import { getSubjectQuestions } from '@/data/questions'
import PracticeShell from './PracticeShell'

// ── 伺服器端外殼（2026-07-29，Backlog A-25）────────────────────────────────────
// 原本本檔第一行係 `'use client'`，整版由客戶端渲染 —— 爬蟲取得嘅 HTML 只有一句
// 「載入中…」，等同一版白紙。平台核心功能頁完全無法索引。
//
// 修法：本檔改回 server component，只負責輸出「爬蟲讀得到」嘅標題與描述，
// 互動邏輯原封不動搬入 `PracticeShell.tsx`（client）。
// 練習引擎、反思鎖、錯因自診、NTM 二次確認、SEN 支援一律無改動。
//
// 伺服器端標題與題庫導覽保持可見：內容服務學生，不是只給爬蟲或讀屏軟件的隱藏文字。

export const metadata = completeSeoMetadata({
  title: 'DSE 練習 | DSE Level Up', // i18n-exempt: zh-Hant fixed search metadata
  description: '選擇科目與課題開始個人化 DSE 練習，作答紀錄只儲存在你的裝置。', // i18n-exempt: zh-Hant fixed search metadata
}, '/practice')

export default function PracticePage() {
  const subjects = getActiveSubjects()
  const all = subjects.flatMap((s) => getSubjectQuestions(s.id))
  const total = all.length
  // 2026-08-27：題庫唔再係 100% MC —— 數學 30 條、歷史 38 條、中文 26 條書寫題已上線。
  // 英文文案本來寫死「multiple-choice questions」，一上線就變成一句唔準確嘅對外描述。
  // 由實數計，唔好寫死；下一批書寫題上線亦唔使記得返嚟改。
  const written = all.filter((q) => q.type === 'long' || q.type === 'text').length
  const mc = total - written

  return (
    <>
      <header className="mx-auto max-w-4xl px-4 pt-8">
        <h1>DSE 練習題庫 · HKDSE Practice{/* i18n-exempt: 雙語已並列（server component 冇 locale） */}</h1>
        <p>共 {total} 條獨立改寫題目（多項選擇 {mc} 條、書寫題 {written} 條），涵蓋 {subjects.length} 個 DSE 科目。答錯即時睇到解析。書寫題永不機器批改，交卷後對照參考答案自評。所有題目為原創改寫，並非香港考試及評核局（HKEAA）官方試題。{/* i18n-exempt: 雙語已並列，緊接下段英文（server component 冇 locale） */}</p>
        <p>
          {total} independently rewritten questions across {subjects.length} HKDSE subjects
          ({mc} multiple-choice, {written} written-response). The explanation opens as soon as you
          answer. Written-response questions are never machine-marked — you self-assess
          against the reference answer. Not affiliated with the HKEAA.
        </p>
        <section aria-labelledby="practice-subjects-heading">
          <h2 id="practice-subjects-heading">科目 · Subjects{/* i18n-exempt: 雙語已並列（server component 冇 locale） */}</h2>
          <ul>
            {subjects.map((s) => (
              (() => {
                const subjectQuestions = getSubjectQuestions(s.id)
                const subjectWritten = subjectQuestions.filter((q) => q.type === 'long' || q.type === 'text').length
                const subjectMc = subjectQuestions.length - subjectWritten
                return (
                  <li key={s.id}>
                    <a href={`/subjects/${s.id}`}>
                      {s.name} — {subjectQuestions.length} 總題數 / total questions（{subjectMc} MC / multiple-choice、{subjectWritten} 書寫題 / written-response）{/* i18n-exempt: 雙語並列（server component 冇 locale） */}
                    </a>
                  </li>
                )
              })()
            ))}
          </ul>
        </section>
      </header>

      <PracticeShell />
    </>
  )
}
