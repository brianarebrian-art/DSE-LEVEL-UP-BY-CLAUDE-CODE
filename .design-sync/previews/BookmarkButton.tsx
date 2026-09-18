import { BookmarkButton } from 'dse-level-up'

// 收藏題目。純本地 —— 收藏清單唔上雲（§16.E 白名單只得三個 key，
// 收藏唔喺入面，要加就要重新開題、重新簽名）。

export function Default() {
  return (
    <BookmarkButton subjectId="economics" questionId="econ_oc_1" topic="供求分析" />
  )
}

export function InQuestionHeader() {
  return (
    <div className="flex max-w-lg items-center justify-between rounded-2xl border border-line bg-surface-raised px-4 py-3">
      <span className="text-sm text-ink">經濟 · 供求分析</span>
      <BookmarkButton subjectId="economics" questionId="econ_oc_1" topic="供求分析" />
    </div>
  )
}
