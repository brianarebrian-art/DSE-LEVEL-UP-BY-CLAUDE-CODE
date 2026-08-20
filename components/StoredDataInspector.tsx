'use client'

import { useCallback, useEffect, useState } from 'react'
import { Trash2, RefreshCw, CloudOff, Cloud } from 'lucide-react'
import { useLocale } from '@/lib/i18n'

// 「睇實我哋存咗你啲乜」—— 把數據承諾由文字變成可即場驗證嘅嘢。
//
// ══ 點解要有 ══
// /transparency 一直用文字講「你嘅練習記錄預設只存喺你部裝置」。文字係要人信，
// 而信任唔可以要求。呢個面板令學生撳一下就見到：實際存咗邊啲 key、幾大、
// 邊啲會喺登入後上雲、邊啲一世都唔會。講嘅嘢當場核對得到，比任何文案有力。
//
// ══ 兩條實作紀律 ══
// ① 【runtime 枚舉，唔硬編清單】。硬編一張表，將來新增一個 key 就會漏報 ——
//    而一個聲稱「呢度列晒」但實際漏咗嘢嘅面板，比冇更差。所以直接掃
//    localStorage，見到 dse_ 開頭就列，未認得嘅標「未分類」而唔係隱藏。
// ② 【上雲清單同兩條同步通道對齊】。一開始只計到 lib/sync.ts 就漏咗
//    lib/settingsSync.ts 嗰條，真實數目由 4 變 12 —— 即係差啲向學生講漏咗
//    8 項。有測試同時對兩個檔，加咗新 key 而冇更新呢度就會 fail。

/**
 * 登入後會上傳到 Supabase 嘅 key。
 *
 * ⚠️ 有【兩條】獨立同步通道，一開始只計到第一條就會向學生講漏嘢：
 *   ① 進度   —— lib/sync.ts snapshotLocal() → POST /api/progress → user_progress
 *   ② 設定   —— lib/settingsSync.ts pushSettings() → user_settings
 * 兩條都要列。有測試把關，加咗新 key 而冇更新呢度就會 fail。
 */
export const CLOUD_PROGRESS_KEYS = [
  'dse_progress',
  'dse_free_attempts_total',
  'dse_topic_stats',
  'dse_active_session',
] as const

export const CLOUD_SETTINGS_KEYS = [
  'dse_easy_font',
  'dse_reading_ruler',
  'dse_hide_timer',
  'dse_calm_lock',
  'dse_font_size',
  'dse_line_height',
  'dse_letter_spacing',
  'dse_relax_sensory_pref',
] as const

export const CLOUD_KEYS = [...CLOUD_PROGRESS_KEYS, ...CLOUD_SETTINGS_KEYS] as const

/** 已知 key 嘅人話說明。未列嘅會顯示為「未分類」，唔會隱藏。 */
const LABELS: Record<string, { zh: string; en: string }> = {
  dse_progress: { zh: '每次練習嘅分數同用時', en: 'Score and time for each practice set' },
  dse_topic_stats: { zh: '逐個課題嘅答對率', en: 'Accuracy per topic' },
  dse_free_attempts_total: { zh: '累計做過幾多份卷', en: 'Total practice sets completed' },
  dse_active_session: { zh: '未做完嗰份卷（供續做）', en: 'An unfinished set, so you can resume' },
  dse_reverse_log: { zh: '錯題同你自己揀嘅錯因', en: 'Wrong answers and the causes you picked' },
  dse_bookmarks: { zh: '你收藏咗嘅題目', en: 'Questions you bookmarked' },
  dse_result: { zh: '最近一次練習結果', en: 'Your most recent result' },
  dse_review_done: { zh: '複習排程進度', en: 'Spaced-review progress' },
  dse_daily_spectrum: { zh: '每日難度分佈', en: 'Daily difficulty spread' },
  dse_emotion_log: { zh: '情緒記錄（私密，永不上雲）', en: 'Mood records (private, never uploaded)' },
  dse_writing_draft: { zh: '寫作草稿', en: 'Writing drafts' },
  dse_own_cheers: { zh: '你寫過嘅打氣說話', en: 'Encouragement notes you wrote' },
  dse_good_today: { zh: '今日做得好嘅嘢', en: 'What went well today' },
  dse_focus_today: { zh: '今日想專注嘅嘢', en: "Today's focus" },
  dse_not_tonight_until: { zh: '「今晚唔溫」設定', en: '"Not tonight" setting' },
  dse_calm_lock: { zh: '反思鎖偏好', en: 'Reflection-lock preference' },
  dse_explain_always_full: { zh: '解析always攤開', en: 'Always expand explanations' },
  dse_locale: { zh: '語言選擇', en: 'Language preference' },
  dse_easy_font: { zh: '易讀字體開關', en: 'Easy-reading font toggle' },
  dse_font_size: { zh: '字級', en: 'Font size' },
  dse_line_height: { zh: '行距', en: 'Line height' },
  dse_letter_spacing: { zh: '字距', en: 'Letter spacing' },
  dse_reading_ruler: { zh: '閱讀尺開關', en: 'Reading ruler toggle' },
  dse_hide_timer: { zh: '隱藏計時器', en: 'Hide the timer' },
  dse_relax_sensory_pref: { zh: '呼吸空間感官偏好', en: 'Breathing Space sensory preference' },
  dse_sync_owner: { zh: '上次同步嘅帳戶', en: 'Account last synced with' },
  dse_synced_at: { zh: '上次同步時間', en: 'Last sync time' },
  dse_updated_at: { zh: '本機最後改動時間', en: 'Last local change' },
  dse_quote_seen: { zh: '睇過嘅金句', en: 'Quotes already shown' },
  dse_today_nudge: { zh: '今日提示紀錄', en: "Today's nudge record" },
  dse_nudged_at: { zh: '上次提示時間', en: 'Last nudge time' },
}

interface Row { key: string; bytes: number; cloud: boolean }

const fmtBytes = (b: number) => (b < 1024 ? `${b} B` : `${(b / 1024).toFixed(1)} KB`)

export default function StoredDataInspector() {
  const { locale } = useLocale()
  const en = locale === 'en'
  const [rows, setRows] = useState<Row[] | null>(null)
  const [confirming, setConfirming] = useState<string | null>(null)

  const scan = useCallback(() => {
    if (typeof window === 'undefined') return
    const out: Row[] = []
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (!key || !key.startsWith('dse_')) continue
      const val = localStorage.getItem(key) ?? ''
      out.push({
        key,
        bytes: new Blob([val]).size,
        cloud: (CLOUD_KEYS as readonly string[]).includes(key),
      })
    }
    out.sort((a, b) => Number(b.cloud) - Number(a.cloud) || b.bytes - a.bytes)
    setRows(out)
  }, [])

  useEffect(scan, [scan])

  const remove = (key: string) => {
    localStorage.removeItem(key)
    setConfirming(null)
    scan()
  }

  if (rows === null) return null

  const total = rows.reduce((s, r) => s + r.bytes, 0)
  const cloudCount = rows.filter((r) => r.cloud).length

  return (
    <section className="bg-surface-raised border border-line rounded-2xl p-6">
      <div className="flex items-start justify-between gap-3 mb-1">
        <h2 className="text-lg font-medium text-ink">
          {en ? 'What is actually stored on this device' : '呢部裝置實際存咗啲乜'}
        </h2>
        <button
          onClick={scan}
          className="min-h-11 min-w-11 flex items-center justify-center text-ink-muted hover:text-accent transition-colors"
          aria-label={en ? 'Rescan' : '重新掃描'}
        >
          <RefreshCw size={15} aria-hidden />
        </button>
      </div>
      <p className="text-xs text-ink-muted leading-relaxed mb-5">
        {en
          ? `Read live from this browser's storage — not a list we wrote in advance. ${rows.length} items, ${fmtBytes(total)} in total.`
          : `即場由你部瀏覽器讀出，唔係我哋預先寫好嘅清單。共 ${rows.length} 項，${fmtBytes(total)}。`}
      </p>

      {rows.length === 0 ? (
        <p className="text-sm text-ink-soft">
          {en ? 'Nothing stored yet — do a practice set and come back.' : '暫時乜都冇 —— 做一份卷再返嚟睇。'}
        </p>
      ) : (
        <ul className="space-y-2">
          {rows.map((r) => {
            const label = LABELS[r.key]
            return (
              <li key={r.key} className="flex items-start gap-3 border border-line rounded-xl px-3 py-2.5">
                <span className="shrink-0 mt-0.5" title={r.cloud ? (en ? 'Uploaded when signed in' : '登入後會上雲') : (en ? 'Never leaves this device' : '永不離開本機')}>
                  {r.cloud
                    ? <Cloud size={14} className="text-accent" aria-hidden />
                    : <CloudOff size={14} className="text-ink-muted" aria-hidden />}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="text-sm text-ink-soft">
                    {label ? (en ? label.en : label.zh) : (en ? 'Unclassified' : '未分類')}
                  </div>
                  <div className="text-[11px] text-ink-muted font-mono break-all">
                    {r.key} · {fmtBytes(r.bytes)}
                  </div>
                </div>
                {confirming === r.key ? (
                  <span className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => remove(r.key)}
                      className="min-h-11 px-2 text-xs text-rose hover:underline"
                    >
                      {en ? 'Delete' : '刪除'}
                    </button>
                    <button
                      onClick={() => setConfirming(null)}
                      className="min-h-11 px-2 text-xs text-ink-muted hover:underline"
                    >
                      {en ? 'Cancel' : '取消'}
                    </button>
                  </span>
                ) : (
                  <button
                    onClick={() => setConfirming(r.key)}
                    className="min-h-11 min-w-11 shrink-0 flex items-center justify-center text-ink-muted hover:text-rose transition-colors"
                    aria-label={en ? `Delete ${r.key}` : `刪除 ${r.key}`}
                  >
                    <Trash2 size={14} aria-hidden />
                  </button>
                )}
              </li>
            )
          })}
        </ul>
      )}

      <p className="text-[11px] text-ink-muted leading-relaxed mt-5 pt-4 border-t border-line">
        <Cloud size={11} className="inline text-accent mr-1 -mt-0.5" aria-hidden />
        {en
          ? `${cloudCount} of these are uploaded — and only if you sign in, so your progress follows you to another device. Everything else, including your mood records, wrong-answer log and writing drafts, stays here.`
          : `以上有 ${cloudCount} 項會上傳 —— 而且只喺你登入之後，目的係令你嘅進度跟得到去另一部機。其餘全部，包括情緒記錄、錯題日誌同寫作草稿，一世都留喺呢部機。`}
      </p>
    </section>
  )
}
