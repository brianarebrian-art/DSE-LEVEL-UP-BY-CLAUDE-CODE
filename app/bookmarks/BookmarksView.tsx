'use client'

import { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, BookmarkX, FolderPen, Check, X } from 'lucide-react'
import MathText from '@/components/MathText'
import ReportQuestionButton from '@/components/ReportQuestionButton'
import { useLocale } from '@/lib/i18n'
import { getSubject } from '@/data/subjects'
import { loadSubjectQuestions } from '@/data/questions/load'
import type { AnyQuestion } from '@/data/questions/types'
import {
  DEFAULT_FOLDER,
  FOLDER_MAX_LEN,
  getBookmarks,
  removeBookmark,
  renameFolder,
  type Bookmark,
} from '@/lib/bookmarks'

// 收藏頁（#106）。100% 由 localStorage 指標 + 真題庫組成，零生成內容。
//
// 題目全文【即時由題庫讀返】而唔係收藏時抄低：題庫日後修訂，學生收藏嗰條會
// 自動跟到新版本。代價係要 lazy load 該科 chunk，故此逐科載入而唔係一次過拉晒
// 25 科（同 load.ts 嘅 code-splitting 設計一致）。
//
// 搵唔返嘅 id（例如該題已下架）唔會扮有嘢 —— 直接分開列出並畀學生剷走，
// 唔會靜靜隱藏令人以為收藏無故消失。

interface Resolved {
  bm: Bookmark
  q: AnyQuestion | null
}

export default function BookmarksView() {
  const { locale } = useLocale()
  const en = locale === 'en'

  const [rows, setRows] = useState<Resolved[] | null>(null)
  const [renaming, setRenaming] = useState<string | null>(null)
  const [draft, setDraft] = useState('')

  const load = async () => {
    const bms = getBookmarks()
    if (!bms.length) {
      setRows([])
      return
    }
    // 逐科載入一次，同一科嘅收藏共用該次結果。
    const bySubject = new Map<string, Bookmark[]>()
    for (const b of bms) bySubject.set(b.subjectId, [...(bySubject.get(b.subjectId) ?? []), b])

    const banks = await Promise.all(
      [...bySubject.keys()].map(async (sid) => {
        const qs = await loadSubjectQuestions(sid)
        return [sid, new Map(qs.map((q) => [q.id, q]))] as const
      }),
    )
    const lookup = new Map(banks)
    setRows(bms.map((bm) => ({ bm, q: lookup.get(bm.subjectId)?.get(bm.questionId) ?? null })))
  }

  useEffect(() => {
    void load()
    const onChange = () => void load()
    window.addEventListener('dse-bookmarks', onChange)
    return () => window.removeEventListener('dse-bookmarks', onChange)
  }, [])

  const folders = useMemo(() => {
    if (!rows) return []
    const map = new Map<string, Resolved[]>()
    for (const r of rows) map.set(r.bm.folder, [...(map.get(r.bm.folder) ?? []), r])
    // 「未分類」永遠排最後 —— 有心分過類嗰啲先係學生真正整理過嘅嘢。
    return [...map.entries()].sort((a, b) =>
      a[0] === DEFAULT_FOLDER ? 1 : b[0] === DEFAULT_FOLDER ? -1 : b[1].length - a[1].length,
    )
  }, [rows])

  const drop = (b: Bookmark) => {
    removeBookmark(b.subjectId, b.questionId)
    void load()
  }

  const commitRename = (from: string) => {
    renameFolder(from, draft)
    setRenaming(null)
    setDraft('')
    void load()
  }

  return (
    <div className="min-h-screen bg-surface px-4 py-12 text-ink-soft">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/dashboard"
          className="mb-6 inline-flex min-h-11 items-center gap-1.5 text-sm text-ink-muted transition-colors hover:text-accent"
        >
          <ArrowLeft size={15} aria-hidden /> {en ? 'Back to progress' : '返回我的進度'}
        </Link>

        <h1 className="mb-1 text-3xl font-medium text-ink">{en ? 'Saved questions' : '我嘅收藏'}</h1>
        <p className="mb-8 text-sm text-ink-muted">
          {en
            ? 'Only on this device unless you sign in. No counts, no ranking — just the questions you wanted to keep.'
            : '未登入就只留喺呢部裝置。唔計數、唔排名 —— 淨係你想留低嗰啲題。'}
        </p>

        {rows === null && <p className="text-sm text-ink-muted">{en ? 'Loading…' : '載入中⋯'}</p>}

        {rows?.length === 0 && (
          <div className="rounded-2xl border border-line bg-surface-raised p-8 text-center">
            <div className="mb-3 text-4xl" aria-hidden>🔖</div>
            <p className="text-sm text-ink-muted">
              {en
                ? 'Nothing saved yet. While practising, tap “Save” under the explanation.'
                : '仲未收藏過。做練習嗰陣，喺解析下面撳「收藏」就得。'}
            </p>
            <Link
              href="/subjects"
              className="mt-5 inline-flex min-h-11 items-center rounded-xl bg-accent-strong px-5 py-2.5 text-sm font-medium text-on-accent transition-colors hover:bg-accent-hover"
            >
              {en ? 'Start practising' : '開始練習'}
            </Link>
          </div>
        )}

        {folders.map(([folder, list]) => (
          <section key={folder} className="mb-8">
            <div className="mb-3 flex items-center gap-2">
              {renaming === folder ? (
                <>
                  <input
                    value={draft}
                    maxLength={FOLDER_MAX_LEN}
                    onChange={(e) => setDraft(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && commitRename(folder)}
                    aria-label={en ? 'Folder name' : '資料夾名'}
                    className="min-h-11 rounded-lg border border-line-strong bg-surface-sunken px-2.5 text-sm text-ink outline-none focus:border-accent"
                  />
                  <button
                    onClick={() => commitRename(folder)}
                    aria-label={en ? 'Save name' : '儲存名稱'}
                    className="min-h-11 min-w-11 inline-flex items-center justify-center rounded-lg text-accent transition-colors hover:bg-line"
                  >
                    <Check size={16} aria-hidden />
                  </button>
                  <button
                    onClick={() => setRenaming(null)}
                    aria-label={en ? 'Cancel' : '取消'}
                    className="min-h-11 min-w-11 inline-flex items-center justify-center rounded-lg text-ink-muted transition-colors hover:bg-line"
                  >
                    <X size={16} aria-hidden />
                  </button>
                </>
              ) : (
                <>
                  <h2 className="text-lg font-medium text-ink">{folder}</h2>
                  <span className="text-xs text-ink-muted">{list.length}</span>
                  <button
                    onClick={() => {
                      setRenaming(folder)
                      setDraft(folder)
                    }}
                    aria-label={en ? `Rename folder ${folder}` : `重新命名「${folder}」`}
                    className="min-h-11 min-w-11 inline-flex items-center justify-center rounded-lg text-ink-muted transition-colors hover:bg-line hover:text-accent"
                  >
                    <FolderPen size={14} aria-hidden />
                  </button>
                </>
              )}
            </div>

            <ul className="space-y-3">
              {list.map(({ bm, q }) => {
                const meta = getSubject(bm.subjectId)
                const subjectName = meta ? (en ? (meta.nameEn ?? meta.name) : meta.name) : bm.subjectId
                return (
                  <li key={`${bm.subjectId}:${bm.questionId}`} className="rounded-2xl border border-line bg-surface-raised p-4">
                    <div className="mb-2 flex items-start justify-between gap-3">
                      <div className="flex flex-wrap items-center gap-2 text-xs text-ink-muted">
                        <span className="rounded-full border border-accent/30 bg-accent/10 px-2 py-0.5 text-accent">
                          {subjectName}
                        </span>
                        <span>{bm.topic}</span>
                      </div>
                      <button
                        onClick={() => drop(bm)}
                        aria-label={en ? 'Remove from saved' : '從收藏移除'}
                        className="min-h-11 min-w-11 shrink-0 inline-flex items-center justify-center rounded-lg text-ink-muted transition-colors hover:bg-line hover:text-ink"
                      >
                        <BookmarkX size={15} aria-hidden />
                      </button>
                    </div>

                    {q ? (
                      <>
                        <div className="text-sm leading-relaxed text-ink">
                          <MathText>{en && q.contentEn ? q.contentEn : q.content}</MathText>
                        </div>
                        {/* 重溫嗰陣先發現題目有問題，係好常見嘅事 —— 練習頁有報錯入口，
                            呢度亦要有，否則學生要記住題號返去練習頁先報得到。 */}
                        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1">
                          <Link
                            href={`/practice?subject=${bm.subjectId}&topic=${encodeURIComponent(q.topic)}`}
                            className="inline-flex min-h-11 items-center text-xs text-accent transition-colors hover:text-accent-strong"
                          >
                            {en ? 'Practise this topic →' : '練返呢個課題 →'}
                          </Link>
                          <ReportQuestionButton questionId={q.id} variant="standalone" />
                        </div>
                      </>
                    ) : (
                      <p className="text-sm text-ink-muted">
                        {en
                          ? 'This question is no longer in the bank (it may have been revised or withdrawn).'
                          : '呢條題已經唔喺題庫（可能已修訂或下架）。'}
                      </p>
                    )}
                  </li>
                )
              })}
            </ul>
          </section>
        ))}
      </div>
    </div>
  )
}
