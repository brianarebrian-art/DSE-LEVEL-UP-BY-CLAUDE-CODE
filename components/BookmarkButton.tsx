'use client'

import { useEffect, useState } from 'react'
import { Bookmark as BookmarkIcon, BookmarkCheck } from 'lucide-react'
import { useLocale } from '@/lib/i18n'
import {
  DEFAULT_FOLDER,
  FOLDER_MAX_LEN,
  addBookmark,
  getFolders,
  isBookmarked,
  removeBookmark,
} from '@/lib/bookmarks'

// 收藏掣（#106）。一撳即收，唔逼學生即刻揀資料夾 —— 揀分類係第二步、可選。
//
// 互動：
//   未收藏 → 撳一下即收藏落「未分類」，同時彈出分類選擇（可以完全忽略）
//   已收藏 → 撳一下即取消收藏
// 刻意唔用確認對話框：收藏本身係零風險動作，多一個「確定嗎？」只係阻手。

export default function BookmarkButton({
  subjectId,
  questionId,
  topic,
  className = '',
}: {
  subjectId: string
  questionId: string
  topic: string
  className?: string
}) {
  const { locale } = useLocale()
  const en = locale === 'en'

  const [saved, setSaved] = useState(false)
  const [pickerOpen, setPickerOpen] = useState(false)
  const [folders, setFolders] = useState<string[]>([])
  const [draft, setDraft] = useState('')

  // 只在 mount 後讀 localStorage（避免 SSR／CSR 落差）。題目一換就重讀。
  useEffect(() => {
    setSaved(isBookmarked(subjectId, questionId))
    setPickerOpen(false)
  }, [subjectId, questionId])

  const toggle = () => {
    if (saved) {
      removeBookmark(subjectId, questionId)
      setSaved(false)
      setPickerOpen(false)
      return
    }
    addBookmark({ subjectId, questionId, topic })
    setSaved(true)
    setFolders(getFolders().filter((f) => f !== DEFAULT_FOLDER))
    setPickerOpen(true)
  }

  const assign = (folder: string) => {
    addBookmark({ subjectId, questionId, topic, folder })
    setPickerOpen(false)
    setDraft('')
  }

  return (
    <div className={className}>
      <button
        onClick={toggle}
        aria-pressed={saved}
        aria-label={en ? (saved ? 'Remove bookmark' : 'Bookmark this question') : saved ? '取消收藏' : '收藏呢條題'}
        className={`min-h-11 inline-flex items-center gap-1.5 rounded-lg px-2.5 text-xs transition-colors ${
          saved ? 'text-gold hover:text-ink-soft' : 'text-ink-muted hover:text-accent'
        }`}
      >
        {saved ? <BookmarkCheck size={14} aria-hidden /> : <BookmarkIcon size={14} aria-hidden />}
        {saved ? (en ? 'Saved' : '已收藏') : en ? 'Save' : '收藏'}
      </button>

      {pickerOpen && (
        <div className="mt-2 rounded-xl border border-line bg-surface-sunken p-3">
          <p className="text-xs text-ink-muted">
            {en ? 'Put it in a folder? (optional)' : '要唔要分類？（可以唔理）'}
          </p>
          {folders.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5">
              {folders.map((f) => (
                <button
                  key={f}
                  onClick={() => assign(f)}
                  className="min-h-11 rounded-lg border border-line-strong px-2.5 text-xs text-ink-soft transition-colors hover:border-accent/40 hover:text-accent"
                >
                  {f}
                </button>
              ))}
            </div>
          )}
          <div className="mt-2 flex gap-2">
            <input
              value={draft}
              maxLength={FOLDER_MAX_LEN}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && draft.trim() && assign(draft)}
              placeholder={en ? 'New folder name' : '新資料夾名'}
              aria-label={en ? 'New folder name' : '新資料夾名'}
              className="min-h-11 w-full rounded-lg border border-line-strong bg-surface px-2.5 text-xs text-ink-soft outline-none placeholder:text-ink-muted focus:border-accent"
            />
            <button
              onClick={() => draft.trim() && assign(draft)}
              disabled={!draft.trim()}
              className="min-h-11 shrink-0 rounded-lg border border-accent/30 bg-surface-sunken px-3 text-xs text-accent transition-colors hover:bg-surface-sunken disabled:opacity-40"
            >
              {en ? 'Add' : '加入'}
            </button>
          </div>
          <button
            onClick={() => setPickerOpen(false)}
            className="mt-2 min-h-11 text-xs text-ink-muted underline underline-offset-4 transition-colors hover:text-ink-soft"
          >
            {en ? `Leave it in ${DEFAULT_FOLDER}` : `就咁放喺「${DEFAULT_FOLDER}」`}
          </button>
        </div>
      )}
    </div>
  )
}
