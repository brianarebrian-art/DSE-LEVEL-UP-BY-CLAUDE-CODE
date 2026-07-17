'use client'

import { useRef, useState } from 'react'
import { Download, Upload } from 'lucide-react'
import { useLocale } from '@/lib/i18n'

// 進度檔案導出／導入（$0 跨裝置方案，取代技術不成立嘅 QR Code 同步）。
// 純 client-side：<a download> 出 JSON、<input type="file"> 入 JSON，零後端、零新依賴。
// 數據主權：檔案由學生自己落地自己保管——「數據歸於學生」。
// 【隱私】dse_emotion_log 情緒記錄「刻意」唔喺白名單：私密數據唔應該跟檔案周圍走；
// 無障礙設定屬裝置偏好，同樣唔搬。

const FORMAT = 'dse-levelup-progress'
const VERSION = 1
const MAX_FILE_BYTES = 2 * 1024 * 1024 // 2MB 上限（正常進度檔遠細過呢個數）

// 可攜學習數據白名單（key → 值必須通過嘅形狀檢查）
const PORTABLE_KEYS: Record<string, (v: unknown) => boolean> = {
  dse_progress: Array.isArray,
  dse_topic_stats: (v) => typeof v === 'object' && v !== null && !Array.isArray(v),
  dse_reverse_log: Array.isArray,
  dse_review_done: (v) => typeof v === 'object' && v !== null && !Array.isArray(v),
  dse_daily_spectrum: (v) => typeof v === 'object' && v !== null,
  dse_result: (v) => typeof v === 'object' && v !== null,
}

export default function DataPortability() {
  const { locale } = useLocale()
  const en = locale === 'en'
  const fileRef = useRef<HTMLInputElement>(null)
  const [confirmImport, setConfirmImport] = useState<Record<string, unknown> | null>(null)
  const [status, setStatus] = useState<'idle' | 'exported' | 'imported' | 'error'>('idle')
  const [errMsg, setErrMsg] = useState('')

  const exportFile = () => {
    try {
      const data: Record<string, unknown> = {}
      for (const key of Object.keys(PORTABLE_KEYS)) {
        const raw = localStorage.getItem(key)
        if (raw) data[key] = JSON.parse(raw)
      }
      // Luna（法務）：檔案內置免責聲明（純文字欄位，唔影響解析）
      const payload = {
        _format: FORMAT,
        _notice: '此檔案由 DSE LEVEL UP 導出，僅供個人備份用途。This file was exported from DSE LEVEL UP for personal backup only.', // i18n-exempt: 檔案內容（非 UI 文字），中英已並列
        version: VERSION,
        exportedAt: new Date().toISOString(),
        data,
      }
      const blob = new Blob([JSON.stringify(payload)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `DSE_LevelUp_Progress_${new Date().toISOString().slice(0, 10)}.json`
      a.click()
      URL.revokeObjectURL(url)
      setStatus('exported')
    } catch {
      setErrMsg(en ? 'Export failed — please try again.' : '導出失敗，請再試一次。')
      setStatus('error')
    }
  }

  const readFile = (file: File) => {
    setErrMsg('')
    if (file.size > MAX_FILE_BYTES) {
      setErrMsg(en ? 'File too large — not a valid progress file.' : '檔案過大，唔係有效嘅進度檔。')
      setStatus('error')
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result))
        // 格式驗證：白名單以外嘅 key 一律唔碰（防止惡意檔案寫入任意 localStorage）
        if (parsed?._format !== FORMAT || typeof parsed?.data !== 'object' || parsed.data === null) {
          throw new Error('bad format')
        }
        const clean: Record<string, unknown> = {}
        for (const [key, check] of Object.entries(PORTABLE_KEYS)) {
          if (key in parsed.data && check(parsed.data[key])) clean[key] = parsed.data[key]
        }
        if (Object.keys(clean).length === 0) throw new Error('empty')
        setConfirmImport(clean) // 二次確認先寫入
      } catch {
        setErrMsg(en ? 'Not a valid DSE Level Up progress file.' : '呢個唔係有效嘅 DSE Level Up 進度檔。')
        setStatus('error')
      }
    }
    reader.readAsText(file)
  }

  const applyImport = () => {
    if (!confirmImport) return
    try {
      for (const [key, value] of Object.entries(confirmImport)) {
        localStorage.setItem(key, JSON.stringify(value))
      }
      setConfirmImport(null)
      setStatus('imported')
      // 令 dashboard／報告即時反映新數據
      setTimeout(() => window.location.reload(), 900)
    } catch {
      setErrMsg(en ? 'Import failed — storage may be full.' : '導入失敗，儲存空間可能已滿。')
      setStatus('error')
    }
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-6">
      <h2 className="text-base font-bold text-slate-100 mb-2">
        {en ? 'Move my progress between devices' : '跨裝置搬遷我的進度'}
      </h2>
      <p className="text-sm text-slate-300 leading-relaxed mb-4">
        {en
          ? 'Prefer not to sign in with Google? Export your progress as a file on this device, then import it on another. The file stays with you — nothing is uploaded.'
          : '唔想用 Google 登入？可以喺呢部裝置導出進度檔案，再喺另一部裝置導入。檔案由你自己保管，唔會上傳到任何伺服器。'}
      </p>

      <div className="flex flex-wrap gap-3">
        <button
          onClick={exportFile}
          className="inline-flex items-center gap-2 min-h-11 bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 hover:bg-cyan-500/20 px-4 py-2.5 rounded-xl transition-all text-sm font-semibold"
        >
          <Download size={15} /> {en ? 'Export progress file' : '導出進度檔案'}
        </button>
        <button
          onClick={() => fileRef.current?.click()}
          className="inline-flex items-center gap-2 min-h-11 bg-slate-800 border border-slate-700 text-slate-200 hover:bg-slate-700 px-4 py-2.5 rounded-xl transition-all text-sm font-semibold"
        >
          <Upload size={15} /> {en ? 'Import progress file' : '導入進度檔案'}
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="application/json,.json"
          className="hidden"
          aria-label={en ? 'Choose progress file' : '揀選進度檔案'}
          onChange={(e) => {
            const f = e.target.files?.[0]
            if (f) readFile(f)
            e.target.value = '' // 同一檔案可重覆揀
          }}
        />
      </div>

      {/* 導入覆蓋二次確認 */}
      {confirmImport && (
        <div className="mt-4 rounded-xl border border-amber-500/40 bg-amber-500/10 p-4">
          <p className="text-sm text-amber-200 leading-relaxed mb-3">
            {en
              ? 'Importing will overwrite the progress currently on this device. Continue?'
              : '導入會覆蓋呢部裝置上而家嘅進度記錄。確定要繼續？'}
          </p>
          <div className="flex gap-2">
            <button
              onClick={applyImport}
              className="min-h-11 bg-amber-500 hover:bg-amber-400 text-black font-bold px-4 py-2 rounded-xl transition-all text-sm"
            >
              {en ? 'Overwrite and import' : '確定覆蓋並導入'}
            </button>
            <button
              onClick={() => setConfirmImport(null)}
              className="min-h-11 border border-slate-700 text-slate-300 hover:text-slate-100 px-4 py-2 rounded-xl transition-all text-sm"
            >
              {en ? 'Cancel' : '取消'}
            </button>
          </div>
        </div>
      )}

      {status === 'exported' && (
        <p className="text-sm mt-3" style={{ color: 'var(--color-neon-cyan)' }}>
          ✓ {en ? 'Progress file downloaded — keep it somewhere safe.' : '進度檔案已下載，記得好好保管。'}
        </p>
      )}
      {status === 'imported' && (
        <p className="text-sm mt-3" style={{ color: 'var(--color-neon-cyan)' }}>
          ✓ {en ? 'Imported! Refreshing…' : '導入成功！刷新緊頁面…'}
        </p>
      )}
      {status === 'error' && errMsg && <p className="text-sm text-amber-400 mt-3">{errMsg}</p>}

      <p className="text-[11px] text-slate-500 mt-3 leading-relaxed">
        {en
          ? 'For privacy, mood-log entries never leave this device and are not included in the file.'
          : '為保私隱，情緒記錄永遠只留喺本機，唔會包含喺檔案入面。'}
      </p>
    </div>
  )
}
