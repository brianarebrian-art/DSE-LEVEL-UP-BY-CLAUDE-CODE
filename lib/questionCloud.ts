// ============================================================================
// questionCloud.ts —— 瀏覽器直連 Supabase 攞題目（唔經 Vercel）
// ----------------------------------------------------------------------------
// 2026-09-05 Brian 指示：題目搬入 Supabase，學生做題時直接向 Supabase 攞，
// 慳 Vercel Edge Request。憲章 §3 同日修訂記低呢個新增嘅存取模式。
//
// ── 點解唔用 @supabase/supabase-js ──────────────────────────────────────────
// 個套件而家【只喺 server 出現】（utils/supabase/server.ts）。喺瀏覽器 import
// 一次，成個 client 連 auth／realtime／storage 就會入埋 bundle（約 40KB gzip）
// —— 為咗兩個 GET 請求。PostgREST 本身就係 REST，用 fetch 直接打，bundle 加零。
//
// ── 點解要 IndexedDB，唔可以每次都攞 ───────────────────────────────────────
// 實測 gzip 之後每科題庫 85–186KB（中文 182KB、歷史 186KB）。每開一次練習就
// 攞一次，Supabase 免費額度 5GB／月 ≈ 28,000 次科目載入就爆 —— 而爆咗就唔係
// 慢啲咁簡單，係停止服務，同憲章 §5「每月成本死鎖」直接對撞。
//
// 所以流程係：
//   ① 攞版本號（一行，約 100 bytes）
//   ② 版本冇變 → 直接用 IndexedDB 入面嗰份，題目零流量
//   ③ 版本變咗（或者首次）→ 攞成科，寫入 IndexedDB
// 亦即係話，回頭客每次練習嘅題目流量係【100 bytes 左右】，唔係 182KB。
//
// ── 離線 ────────────────────────────────────────────────────────────────────
// 呢一層令離線【好過】現狀而唔係差過：IndexedDB 有嗰份就照用，連版本查詢都
// 唔使成功。真係咩都冇（第一次用、又冇網），caller 會回落靜態 chunk。
// 兩條路都行唔通先至係空手 —— 而現狀本來就只有一條路。
//
// ⚠️ 呢個模組【只讀】。anon key 對 questions 表只有 SELECT 權限
// （supabase/migrations/0017），寫入永遠只經 service role ＋ 人手執行嘅
// scripts/qbank/sync-questions.mts。憲章 §12「機器永不自動入庫」靠嗰兩層，
// 唔係靠呢度客氣。
// ============================================================================
import type { AnyQuestion } from '@/data/questions/types'

const URL_ = process.env.NEXT_PUBLIC_SUPABASE_URL
const ANON = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

/** 未設 anon key（或喺 server）即係整層停用，caller 靜靜哋回落靜態 chunk。 */
export const cloudBankEnabled = (): boolean =>
  typeof window !== 'undefined' && !!URL_ && !!ANON

// ── IndexedDB（迷你封裝，唔為咗一個 object store 拉個套件入嚟）──────────────
const DB = 'dse-qbank'
const STORE = 'banks'

function openDb(): Promise<IDBDatabase | null> {
  return new Promise((resolve) => {
    if (typeof indexedDB === 'undefined') return resolve(null)
    let req: IDBOpenDBRequest
    try { req = indexedDB.open(DB, 1) } catch { return resolve(null) }
    req.onupgradeneeded = () => {
      if (!req.result.objectStoreNames.contains(STORE)) req.result.createObjectStore(STORE)
    }
    req.onsuccess = () => resolve(req.result)
    // 私隱瀏覽模式、磁碟滿、用戶封鎖咗儲存 —— 全部行呢條，唔係錯誤。
    req.onerror = () => resolve(null)
    req.onblocked = () => resolve(null)
  })
}

type Cached = { version: string; questions: AnyQuestion[] }

function idbGet(db: IDBDatabase, key: string): Promise<Cached | null> {
  return new Promise((resolve) => {
    try {
      const r = db.transaction(STORE, 'readonly').objectStore(STORE).get(key)
      r.onsuccess = () => resolve((r.result as Cached | undefined) ?? null)
      r.onerror = () => resolve(null)
    } catch { resolve(null) }
  })
}

function idbPut(db: IDBDatabase, key: string, val: Cached): Promise<void> {
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(STORE, 'readwrite')
      tx.objectStore(STORE).put(val, key)
      tx.oncomplete = () => resolve()
      // 寫唔入（額度爆）唔應該搞冧一節練習 —— 題目已經喺手，落次再攞就係。
      tx.onerror = () => resolve()
      tx.onabort = () => resolve()
    } catch { resolve() }
  })
}

// ── PostgREST ───────────────────────────────────────────────────────────────
const headers = () => ({ apikey: ANON as string, Authorization: `Bearer ${ANON}` })

// Supabase 預設 db-max-rows 會截斷回應，而最大嗰科（數學 1,539 條）超出。
// 截斷唔會報錯 —— 佢就咁少返幾百條題，學生見到嘅係「個題庫縮咗水」。
// 所以一定要分頁攞到攞唔到為止，唔可以靠一次 GET。
const PAGE = 1000

async function fetchBank(subject: string, signal?: AbortSignal): Promise<AnyQuestion[]> {
  const out: AnyQuestion[] = []
  for (let from = 0; ; from += PAGE) {
    const res = await fetch(
      `${URL_}/rest/v1/questions?subject=eq.${encodeURIComponent(subject)}&select=data`,
      { headers: { ...headers(), Range: `${from}-${from + PAGE - 1}` }, signal },
    )
    if (!res.ok) throw new Error(`questions ${res.status}`)
    const rows = await res.json() as { data: AnyQuestion }[]
    for (const r of rows) out.push(r.data)
    if (rows.length < PAGE) return out
  }
}

async function fetchVersion(subject: string, signal?: AbortSignal): Promise<string | null> {
  const res = await fetch(
    `${URL_}/rest/v1/question_bank_versions?subject=eq.${encodeURIComponent(subject)}&select=version`,
    { headers: headers(), signal },
  )
  if (!res.ok) return null
  const rows = await res.json() as { version: string }[]
  return rows[0]?.version ?? null
}

/**
 * 攞一科題目。攞唔到（離線、未設 key、雲端故障、cache 亦空）回 `null`，
 * 由 caller 決定回落靜態 chunk —— 呢度刻意唔自己拋錯，因為「攞唔到雲端」
 * 係一個【預期之內】嘅狀態，唔係例外。
 */
export async function loadFromCloud(
  subject: string,
  signal?: AbortSignal,
): Promise<AnyQuestion[] | null> {
  if (!cloudBankEnabled()) return null

  const db = await openDb()
  const cached = db ? await idbGet(db, subject) : null

  let version: string | null = null
  try {
    version = await fetchVersion(subject, signal)
  } catch {
    // 離線／DNS 死。有 cache 就照用 —— 呢個就係離線做題行得通嘅原因。
    return cached?.questions.length ? cached.questions : null
  }

  if (cached && version && cached.version === version && cached.questions.length) {
    return cached.questions
  }

  try {
    const questions = await fetchBank(subject, signal)
    if (!questions.length) return cached?.questions.length ? cached.questions : null
    if (db && version) await idbPut(db, subject, { version, questions })
    return questions
  } catch {
    return cached?.questions.length ? cached.questions : null
  }
}
