'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useAuthSession, authSignInGoogle, authSignOutAndWait } from '@/lib/auth/session'
import { wipeThisDevice, type WipeReport } from '@/lib/privacy/wipeDevice'
import { useLocale } from '@/lib/i18n'
// 進度檔案導出／導入 —— 刻意放喺登入牆之外（服務對象正正係唔想登入嘅學生）
import DataPortability from '@/components/DataPortability'
import StoredDataInspector from '@/components/StoredDataInspector'
import RestDayPicker from '@/components/RestDayPicker'

// Account settings — the PDPO one-click erasure (bilingual via useLocale). Deletes the
// user's server-side data (cloud progress) and clears local data.
export default function AccountPageClient() {
  const { status } = useAuthSession()
  const { locale } = useLocale()
  const en = locale === 'en'
  const [confirming, setConfirming] = useState(false)
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState<string | null>(null)
  // 本機清除嘅實際結果 —— 完成畫面按佢講嘢，唔係預設講「全部清晒」。
  const [report, setReport] = useState<WipeReport | null>(null)
  // 冇登入嘅人只清本機；有登入嘅先清雲端。完成畫面要知係邊種。
  const [cloudCleared, setCloudCleared] = useState(false)

  // 已登入：雲端 → 本機 → 登出。次序唔可以調：
  //   · 雲端要行先 —— 如果先清本機，SyncProvider 一收到 focus 就會由雲端
  //     拉返舊資料寫落 localStorage，等於白清。
  //   · 登出要行最尾 —— 仲登入緊嘅話，reload 後 SyncProvider 會即刻 ping
  //     /api/sync/session，刪除之後幾秒雲端又有返一行綁住 user_id 嘅紀錄。
  const del = async () => {
    setBusy(true)
    setError(null)
    try {
      const res = await fetch('/api/me', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ confirm: true }),
      })
      if (!res.ok) {
        setError(en ? 'Something went wrong while deleting — please try again later.' : '刪除時發生問題，請稍後再試。')
        return
      }
      setReport(await wipeThisDevice())
      await authSignOutAndWait()
      setCloudCleared(true)
      setDone(true)
    } catch {
      setError(en ? 'Something went wrong while deleting — please try again later.' : '刪除時發生問題，請稍後再試。')
    } finally {
      setBusy(false)
    }
  }

  // 冇登入：資料全部喺呢部機，所以唔使（亦唔應該）叫佢先登入 ——
  // 登入咗 SyncProvider 會先將本機資料推上雲，即係為咗刪除而先上傳一次。
  const wipeLocalOnly = async () => {
    setBusy(true)
    setError(null)
    try {
      setReport(await wipeThisDevice())
      setDone(true)
    } catch {
      setError(en ? 'Something went wrong while clearing — please try again.' : '清除時發生問題，請再試一次。')
    } finally {
      setBusy(false)
    }
  }

  // 完整 reload，唔用 <Link>：未關嘅 IndexedDB 連線會令刪除排隊，
  // reload 關晒連線先完成得到；亦同時清走記憶體入面嘅舊 state。
  const leave = () => window.location.replace('/')

  return (
    <div className="min-h-screen px-4 py-16">
      <div className="max-w-lg mx-auto">
        <h1 className="text-2xl font-extrabold mb-6">{en ? 'Profile & Account' : '個人檔案與帳戶'}</h1>

        {/* $0 跨裝置：導出／導入進度檔案（毋須登入） */}
        {!done && <DataPortability />}

        {/* 休息日護盾。擺喺導出／導入之後、數據檢視之前 ——
            上面兩格講「你嘅資料點處理」，呢格講「你點用呢個平台」，
            都係同一類：由學生自己話事嘅設定，唔使登入。 */}
        {!done && (
          <div className="mt-6">
            <RestDayPicker />
          </div>
        )}

        {/* 數據承諾可驗證 —— 擺喺導出／導入之後：先話你可以攞走，再畀你睇實
            究竟有咩喺度、邊啲會上雲。文字承諾要人信，呢個唔使。 */}
        {!done && (
          <div className="mt-6">
            <StoredDataInspector />
          </div>
        )}

        {done ? (
          <div className="bg-surface-raised border border-line rounded-2xl p-6 text-center">
            <div className="text-4xl mb-3" aria-hidden>🧹</div>
            <p className="text-ink font-bold mb-2">{en ? 'Your data has been deleted' : '已刪除你的資料'}</p>
            <p className="text-ink-muted text-sm leading-relaxed mb-3">
              {cloudCleared
                ? en
                  ? 'Your cloud progress has been removed and you have been signed out. Everything this site stored on this device — progress, settings, exam reminders and cached questions — has been cleared.'
                  : '你的雲端進度已經清除，亦已經登出。呢部機上面本站存過嘅嘢 —— 進度、設定、考試提醒、題目快取 —— 全部清走咗。'
                : en
                  ? 'Everything this site stored on this device — progress, settings, exam reminders and cached questions — has been cleared.'
                  : '呢部機上面本站存過嘅嘢 —— 進度、設定、考試提醒、題目快取 —— 全部清走咗。'}
            </p>
            {/* 如實回報：有步驟冇完成就講，唔可以同一句「全部清走咗」蓋過去。 */}
            {report && report.failed.length > 0 && (
              <p className="text-sm text-ink bg-surface-sunken border border-gold rounded-lg px-3 py-2 mb-3 text-left">
                {en
                  ? `Some items could not be cleared: ${report.failed.join(', ')}. You can remove them in your browser's site settings.`
                  : `有部分項目清唔到：${report.failed.join('、')}。可以喺瀏覽器嘅網站設定度手動清除。`}
              </p>
            )}
            {report && report.queued.length > 0 && (
              <p className="text-[11px] text-ink-muted mb-3">
                {en
                  ? 'Some stored data finishes clearing when you leave this page.'
                  : '有部分儲存會喺你離開呢頁之後先清完。'}
              </p>
            )}
            {cloudCleared && (
              <p className="text-[11px] text-ink-muted mb-5">
                {/* 推送訂閱冇綁 user_id（私隱設計），所以伺服器分唔到邊部機屬於你。 */}
                {en
                  ? 'Exam reminders on your other devices are not linked to your account — turn them off on each device.'
                  : '其他裝置上嘅考試提醒冇同帳戶連結，要喺嗰部機逐部關。'}
              </p>
            )}
            <button
              onClick={leave}
              className="inline-flex items-center gap-2 bg-accent-strong hover:bg-accent-hover text-on-accent font-bold px-5 py-2.5 rounded-xl transition-all"
            >
              {en ? 'Back to home' : '返回首頁'}
            </button>
          </div>
        ) : status === 'unauthenticated' ? (
          <div className="bg-surface-raised border border-rose/25 rounded-2xl p-6">
            <h2 className="text-base font-bold text-ink mb-2">{en ? 'Clear this device' : '清除呢部機嘅資料'}</h2>
            <p className="text-sm text-ink-muted leading-relaxed mb-4">
              {en
                ? 'You are not signed in, so your data lives only on this device. This clears everything this site stored here — progress, settings, exam reminders and cached questions. It cannot be undone.'
                : '你冇登入，所以你嘅資料只喺呢部機。呢個會清走本站喺呢度存過嘅所有嘢 —— 進度、設定、考試提醒、題目快取。清咗就攞唔返。'}
            </p>
            {error && <p className="text-gold/90 text-sm mb-3">{error}</p>}
            {confirming ? (
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-sm text-ink-soft">{en ? 'Clear everything on this device?' : '確定清除呢部機嘅所有資料？'}</span>
                <button
                  onClick={wipeLocalOnly}
                  disabled={busy}
                  className="bg-rose-strong hover:bg-rose text-on-accent font-bold px-4 py-2.5 rounded-xl text-sm transition-all disabled:opacity-50"
                >
                  {busy ? (en ? 'Clearing…' : '清除中…') : en ? 'Confirm' : '確定清除'}
                </button>
                <button onClick={() => setConfirming(false)} disabled={busy} className="text-ink-muted hover:text-ink text-sm">
                  {en ? 'Cancel' : '取消'}
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirming(true)}
                className="border border-rose/40 text-rose hover:bg-surface-sunken font-medium px-4 py-2.5 rounded-xl text-sm transition-all"
              >
                {en ? 'Clear this device' : '清除呢部機嘅資料'}
              </button>
            )}
            <p className="text-[11px] text-ink-muted mt-4 leading-relaxed">
              {en ? 'Synced progress from another device? ' : '喺其他裝置登入過同步？'}
              <button onClick={() => authSignInGoogle('/account')} className="text-accent underline underline-offset-2">
                {en ? 'Sign in to delete your cloud data' : '登入後可以刪除雲端資料'}
              </button>
            </p>
          </div>
        ) : (
          <div className="bg-surface-raised border border-rose/25 rounded-2xl p-6">
            <h2 className="text-base font-bold text-ink mb-2">{en ? 'Delete my data' : '刪除我的資料'}</h2>
            <p className="text-sm text-ink-muted leading-relaxed mb-4">
              {en
                ? 'This permanently deletes your cloud learning progress. Your browser data is cleared too. This cannot be undone.'
                : '此操作會永久刪除你儲存在雲端的學習進度。本機瀏覽器的資料亦會一併清除。此操作無法復原。'}
            </p>
            {error && <p className="text-gold/90 text-sm mb-3">{error}</p>}
            {confirming ? (
              <div className="flex flex-wrap items-center gap-3">
                <span className="text-sm text-ink-soft">{en ? 'Permanently delete?' : '確定要永久刪除嗎？'}</span>
                <button
                  onClick={del}
                  disabled={busy}
                  className="bg-rose-strong hover:bg-rose text-on-accent font-bold px-4 py-2.5 rounded-xl text-sm transition-all disabled:opacity-50"
                >
                  {busy ? (en ? 'Deleting…' : '刪除中…') : en ? 'Confirm delete' : '確定刪除'}
                </button>
                <button
                  onClick={() => setConfirming(false)}
                  disabled={busy}
                  className="text-ink-muted hover:text-ink text-sm"
                >
                  {en ? 'Cancel' : '取消'}
                </button>
              </div>
            ) : (
              <button
                onClick={() => setConfirming(true)}
                className="border border-rose/40 text-rose hover:bg-surface-sunken font-medium px-4 py-2.5 rounded-xl text-sm transition-all"
              >
                {en ? 'Delete my data' : '刪除我的資料'}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
