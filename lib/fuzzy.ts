// 錯字容忍搜尋（藍圖功能 09 的前端版本）
//
// ── 為何改在前端做 ────────────────────────────────────────────────────────────
// 原藍圖用 Supabase 的 `pg_trgm`。該擴展確實已安裝，但 **Supabase 並無任何題目表**
// —— 5,000 餘條題目全部存放於 `data/questions/*.ts`，隨 bundle 送到瀏覽器。
// 資料不在資料庫，`pg_trgm` 便無從搜起。
//
// 原藍圖另提及以 `unaccent` 「忽略聲調」：`unaccent` 的作用是移除拉丁字母的變音
// 符號（é → e），對中文完全沒有作用，此處不採用。
//
// ── 為何值得做 ────────────────────────────────────────────────────────────────
// 讀寫障礙（Dyslexia）學生經常打錯字。傳統精確比對之下，一個錯字就會得出
// 「找不到結果」，學生往往因此以為平台沒有該內容而放棄 —— 這正是要消除的挫敗點。
//
// ── 做法 ──────────────────────────────────────────────────────────────────────
// 以 n-gram 集合的 Dice 係數量度相似度，中文用 2-gram（中文詞普遍較短，
// 3-gram 會令「共用品」這類三字詞只剩單一 shingle，過於脆弱），拉丁字母用 3-gram。
// 另加兩條捷徑：完全包含子字串給高分；查詢字元按序散見於目標（例如以「魚熊掌」
// 搜尋「魚我所欲也，熊掌亦我所欲也」）亦給予中等分數。
//
// 純函數、零依賴、零伺服器。

/** 高於此分數即視為命中。經下方測試案例校準。 */
export const FUZZY_THRESHOLD = 0.34

const CJK = /[㐀-鿿豈-﫿]/

/**
 * 正規化：轉小寫、全形轉半形、移除空白與標點。
 * 保留中日韓文字、拉丁字母與數字。
 */
export function normalise(s: string): string {
  return String(s ?? '')
    .toLowerCase()
    // 全形英數字與空格 → 半形
    .replace(/[！-～]/g, (c) => String.fromCharCode(c.charCodeAt(0) - 0xfee0))
    .replace(/　/g, ' ')
    // 只保留 CJK、拉丁字母、數字
    .replace(/[^㐀-鿿豈-﫿a-z0-9]/g, '')
}

/** 依內容決定 n：含中日韓文字用 2，純拉丁用 3。 */
function gramSize(s: string): number {
  return CJK.test(s) ? 2 : 3
}

export function ngrams(s: string, n: number): Set<string> {
  const out = new Set<string>()
  if (!s) return out
  // 字串短於 n 時，整串本身就是唯一的 shingle（否則單字查詢永遠得不到任何 gram）
  if (s.length <= n) {
    out.add(s)
    return out
  }
  for (let i = 0; i + n <= s.length; i++) out.add(s.slice(i, i + n))
  return out
}

/** 查詢字元是否按原有次序散見於目標之中（容許中間夾雜其他字）。 */
function isSubsequence(q: string, t: string): boolean {
  let i = 0
  for (const ch of t) {
    if (ch === q[i]) i++
    if (i === q.length) return true
  }
  return q.length === 0
}

/**
 * 相似度，值域 0–1。
 * 空查詢回傳 0（由呼叫方決定「沒有查詢時顯示全部」）。
 */
export function similarity(query: string, target: string): number {
  const q = normalise(query)
  const t = normalise(target)
  if (!q || !t) return 0

  // 完全包含 —— 最強訊號。分數按覆蓋比例遞增（完全相同 = 1.0），
  // 令「三角函數」在搜尋「三角函數」時排在「三角函數與恆等式」之前。
  //
  // 單字查詢【不】走這條捷徑：一個常用字（例如「也」）會出現在大量長標題之中，
  // 若給予高分就會把整個題庫拉出來，等於沒有搜尋。單字改由下方 n-gram 評分，
  // 自然得出接近零的分數。
  if (q.length >= 2 && t.includes(q)) return 0.6 + 0.4 * (q.length / t.length)

  const n = Math.min(gramSize(q), gramSize(t))
  const gq = ngrams(q, n)
  const gt = ngrams(t, n)
  let shared = 0
  for (const g of gq) if (gt.has(g)) shared++
  const dice = (2 * shared) / (gq.size + gt.size)

  // 中文補一層單字重疊，並【打折】後才與 n-gram 分數比較。
  // 理由：中文詞短，換一個字就足以令所有 2-gram 落空（「公共品」與「共用品」
  // 的 2-gram 交集為零），但兩者其實共用「共」「品」兩字。打折是為了避免
  // 純粹因常用字重疊而誤中（「數學」對「中國文學」只得 0.27，低於門檻）。
  let uni = 0
  if (CJK.test(q) || CJK.test(t)) {
    const uq = new Set(q)
    const ut = new Set(t)
    let s2 = 0
    for (const c of uq) if (ut.has(c)) s2++
    uni = ((2 * s2) / (uq.size + ut.size)) * 0.8
  }

  // 關鍵字散見（「魚熊掌」→「魚我所欲也，熊掌亦我所欲也」）。
  // 只在查詢有一定長度時採用，否則單字查詢會命中過多目標。
  if (q.length >= 3 && isSubsequence(q, t)) return Math.max(dice, uni, 0.55)

  return Math.max(dice, uni)
}

/** 對多個欄位取最高分（例如同時比對中文名、英文名、課題標籤）。 */
export function bestSimilarity(query: string, targets: (string | undefined | null)[]): number {
  let best = 0
  for (const t of targets) {
    if (!t) continue
    const s = similarity(query, t)
    if (s > best) best = s
  }
  return best
}

/**
 * 模糊篩選並依相關度排序。查詢為空時原樣回傳（不排序、不篩選）。
 *
 * `fields` 取出該項所有可供比對的文字。
 */
export function fuzzyFilter<T>(
  items: T[],
  query: string,
  fields: (item: T) => (string | undefined | null)[],
  threshold = FUZZY_THRESHOLD,
): T[] {
  const q = normalise(query)
  if (!q) return items
  return items
    .map((item) => ({ item, score: bestSimilarity(query, fields(item)) }))
    .filter((x) => x.score >= threshold)
    .sort((a, b) => b.score - a.score)
    .map((x) => x.item)
}
