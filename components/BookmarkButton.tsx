'use client'

import { useEffect, useState } from 'react'
import Icon from '@/src/components/ui/Icon'
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
  const [toast, setToast] = useState<string | null>(null)

  // 只在 mount 後讀 localStorage（避免 SSR／CSR 落差）。題目一換就重讀。
  useEffect(() => {
    setSaved(isBookmarked(subjectId, questionId))
    setPickerOpen(false)
  }, [subjectId, questionId])

  useEffect(() => {
    if (!toast) return
    const timer = setTimeout(() => setToast(null), 3000)
    return () => clearTimeout(timer)
  }, [toast])

  const toggle = () => {
    if (saved) {
      removeBookmark(subjectId, questionId)
      setSaved(false)
      setPickerOpen(false)
      setToast(en ? 'Removed from saved questions' : '已從錯題本移除')
      return
    }
    addBookmark({ subjectId, questionId, topic })
    setSaved(true)
    setToast(en ? 'Added to review notebook' : '已收藏到錯題本')
    setFolders(getFolders().filter((f) => f !== DEFAULT_FOLDER))
    setPickerOpen(true)
  }

  const assign = (folder: string) => {
    addBookmark({ subjectId, questionId, topic, folder })
    setPickerOpen(false)
    setDraft('')
  }

  const label = en
    ? (saved ? 'Remove bookmark' : 'Bookmark this question')
    : (saved ? '取消收藏' : '收藏呢條題')

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={toggle}
        aria-pressed={saved}
        aria-label={label}
        title={label}
        className={`min-h-12 inline-flex items-center gap-1.5 rounded-lg px-2.5 text-xs transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent ${
          saved ? 'text-gold hover:text-ink-soft' : 'text-ink-muted hover:text-accent'
        }`}
      >
        {saved ? <Icon name="bookmark-filled" size={14} label={en ? 'Saved' : '已收藏'} /> : <Icon name="bookmark" size={14} label={en ? 'Save' : '收藏'} />}
        {saved ? (en ? 'Saved' : '已收藏') : en ? 'Save' : '收藏'}
      </button>

      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="absolute left-0 -top-8 z-20 whitespace-nowrap rounded bg-surface-raised border border-line px-2 py-1 text-xs text-accent font-medium shadow-sm"
        >
          {toast}
        </div>
      )}

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
                  className="min-h-12 rounded-lg border border-line-strong px-2.5 text-xs text-ink-soft transition-colors hover:border-accent/40 hover:text-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
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
              className="min-h-12 w-full rounded-lg border border-line-strong bg-surface px-2.5 text-xs text-ink-soft outline-none placeholder:text-ink-muted focus:border-accent focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
            />
            <button
              onClick={() => draft.trim() && assign(draft)}
              disabled={!draft.trim()}
              className="min-h-12 shrink-0 rounded-lg border border-accent/30 bg-surface-sunken px-3 text-xs text-accent transition-colors hover:bg-surface-sunken focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {en ? 'Add' : '加入'}
            </button>
          </div>
          <button
            onClick={() => setPickerOpen(false)}
            className="mt-2 min-h-12 text-xs text-ink-muted underline underline-offset-4 transition-colors hover:text-ink-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-accent"
          >
            {en ? `Leave it in ${DEFAULT_FOLDER}` : `就咁放喺「${DEFAULT_FOLDER}」`}
          </button>
        </div>
      )}
    </div>
  )
}
