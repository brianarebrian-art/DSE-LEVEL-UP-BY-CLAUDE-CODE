// ============================================================================
// _archetype.mts —— 模板替換的共用框架
// ----------------------------------------------------------------------------
// 稽核第 3 項：全站模板複製率 36%。最大的一組是「一等差數列首項為 #，公差為
// #，求第 # 項」，同一句子換數字重複了 139 次。封頂計劃訂明每個模板最多留 6 條，
// 但必須【先補後剷】—— 剷掉多少，就要補回多少條真正不同的題。
//
// ── 為何「參數化」本身並不解決問題 ───────────────────────────────────────
// 把同一條題的數字隨機化，生成一百條，句子骨架仍然完全相同，封頂計劃照樣把
// 它們算作一組。真正需要的是【原型】的多樣性：同一課題之下，改變問法本身
// ——問的是甚麼、給的是甚麼、答的是甚麼——而不只是改變數值。
//
// 故此本框架的規則是：
//   1. 一個原型最多出 6 條實例（等於封頂值），多了會被本框架拒絕。
//   2. 新原型的句子骨架不得與【現有題庫】任何一條相同 —— 否則等於替
//      已經超額的那一組再加料。此項為硬性檢查，撞到即中止。
//   3. 新原型之間的骨架亦不得相同。
//
// ── 答案的正確性從何而來 ─────────────────────────────────────────────────
// correct-by-construction：答案由程式按公式算出，不是人手填寫，故不存在計算
// 錯誤。人手負責的只有兩樣：公式本身是否正確，以及干擾項是否對應真實誤解。
// 兩者都寫在各原型的註釋裏，可逐項覆核。
//
// ── 干擾項的規則 ─────────────────────────────────────────────────────────
// 每個干擾項都必須來自一個【具名的錯誤】（例如等差數列用 a+nd 而非
// a+(n-1)d、彈性忘記取絕對值、折舊忘記減殘值）。隨機湊近似數不可接受：
// 學生選錯之後，應該立即知道自己犯了哪一個錯，而不是「差少少」。
// 本框架會檢查四個選項互異、正解確實在選項之內、沒有 NaN 或 undefined。
// ============================================================================
import { writeFileSync } from 'node:fs'

// ⚠️ 動態 import，唔可以改返靜態。
// `import { getSubjectQuestions } from '../../../data/questions/index.ts'` 喺
// tsx 4.19.2（本 repo 全線鎖住嘅版本）之下會拋：
//   SyntaxError: The requested module '…/index.ts' does not provide an export
//                named 'getSubjectQuestions'
// index.ts 係靠 `export *` 轉出嗰個函數，靜態分析階段睇唔到，要等到執行先解析到。
// 同一個坑 topic-coverage.mjs 檔頭已經記低過（佢用轉譯繞開）；floor-gap.mts
// 用 `await import(...)` 就一直行得。改成動態之後，成個 builders/ 目錄先跑得返。
// 2026-09-05 實測：改之前所有 builder 都係一開波就死喺呢一行。
const { getSubjectQuestions } = await import('../../../data/questions/index.ts')

export type Diff = 'basic' | 'intermediate' | 'hard'
export interface Inst {
  q: [zh: string, en: string]
  ans: string
  wrong: [string, string, string]
  e: [zh: string, en: string]
  /**
   * 選項的英文版（可選）。
   *
   * 數理科的選項多數為純數式或數值（`$12$`、`0.4 mol/dm³`），中英一致，
   * 無須填寫。但文字型選項（例如「$BA$ 沒有定義」「有唯一解」）若不填寫，
   * 英文介面的學生便會讀到中文 —— 25 科之中有 20 科為雙語題庫，此事不小。
   * 一旦填寫，必須連 `wrongEn` 一併填寫，次序與 `wrong` 對應。
   */
  ansEn?: string
  wrongEn?: [string, string, string]
}
export interface Arch {
  key: string
  topic: string
  topicZh: string
  topicEn: string
  diff: Diff
  n: number
  gen: (i: number) => Inst
}

/** 與 cap-plan.mts 逐字相同的骨架函數 —— 兩者必須一致，否則檢查沒有意義。 */
export const skeleton = (s: string): string =>
  String(s)
    .replace(/\\[a-zA-Z]+/g, '')
    .replace(/[\d０-９]+(\.[\d]+)?/g, '#')
    .replace(/[\s{}()（）$,，.。、]/g, '')
    .toLowerCase()

const CAP = 6

/** 正解位置按 0→1→2→3 輪轉，避免任何一個位置成為「安全選擇」。 */
const rotate = <X,>(arr: X[], k: number) =>
  arr.slice(-k % arr.length || arr.length).concat(arr.slice(0, -k % arr.length || arr.length))

export function emit(subject: string, prefix: string, archs: Arch[], outPath: string) {
  // 對比材料要剔走【本科自己的 auto bank】。呢批題一旦入咗庫，再跑同一個
  // builder（改錯字、補料、重新生成）就會每一條都同上一次嘅自己 100% 撞骨架，
  // 全批被拒 —— 等於個 builder 變成一次性。auto-promote.mts 亦曾踩過同一個坑，
  // 兩邊修法一致：入庫本身係按 id 覆寫，剔走之後唔會產生重複記錄。
  const live = (getSubjectQuestions(subject) as { content: string; framework?: string }[])
    .filter((q) => q.framework !== 'auto')
  const liveSkel = new Set(live.map((q) => skeleton(q.content)))
  const seenSkel = new Map<string, string>()
  const rows: unknown[] = []
  const errs: string[] = []
  let seq = 0

  for (const a of archs) {
    if (a.n > CAP) { errs.push(`${a.key}: n=${a.n} 超過封頂值 ${CAP}`); continue }
    for (let i = 0; i < a.n; i++) {
      let inst: Inst
      try { inst = a.gen(i) } catch (e) { errs.push(`${a.key}#${i}: gen 拋出 ${(e as Error).message}`); continue }
      const opts = [inst.ans, ...inst.wrong]
      const bad = opts.find((o) => typeof o !== 'string' || !o.trim() || /NaN|undefined|Infinity/.test(o))
      if (bad !== undefined) { errs.push(`${a.key}#${i}: 選項無效「${bad}」`); continue }
      if (new Set(opts).size !== 4) { errs.push(`${a.key}#${i}: 四個選項並非互異 → ${opts.join(' | ')}`); continue }
      if (!inst.q[0]?.trim() || !inst.q[1]?.trim()) { errs.push(`${a.key}#${i}: 題幹缺中文或英文`); continue }
      // 散文只捉 NaN 同 [object Object]。刻意【唔捉】"undefined" ——
      // 佢喺英文入面係正當數學術語（"$BA$ is undefined"），2026-08-22 實測
      // 誤殺咗 m2 五條題。插值失敗嘅情況由下面選項嗰個嚴格檢查兜住。
      if (/NaN|\[object Object\]/.test(inst.q[0] + inst.q[1] + inst.e[0] + inst.e[1])) { errs.push(`${a.key}#${i}: 題幹或解析含 NaN／[object Object]`); continue }

      const sk = skeleton(inst.q[0])
      if (i === 0) {
        if (liveSkel.has(sk)) { errs.push(`${a.key}: 骨架與現有題庫重複 —— 「${inst.q[0].replace(/\s+/g, ' ').slice(0, 60)}」`); break }
        const owner = seenSkel.get(sk)
        if (owner) { errs.push(`${a.key}: 骨架與原型 ${owner} 重複`); break }
        seenSkel.set(sk, a.key)
      }

      const k = seq % 4
      seq++
      const optsEn = inst.ansEn && inst.wrongEn ? [inst.ansEn, ...inst.wrongEn] : opts
      if (inst.ansEn && new Set(optsEn).size !== 4) { errs.push(`${a.key}#${i}: 英文選項並非互異`); continue }
      rows.push({
        id: `${prefix}_${String(seq).padStart(4, '0')}`,
        type: 'mc',
        subject,
        topic: a.topicZh, topicId: a.topic, topicZh: a.topicZh, topicEn: a.topicEn,
        difficulty: a.diff,
        question: inst.q[0], questionEn: inst.q[1],
        options: rotate(opts, k), optionsEn: rotate(optsEn, k),
        correctIndex: k,
        explanation: inst.e[0], explanationEn: inst.e[1],
      })
    }
  }

  if (errs.length) {
    console.error(`\n✗ ${errs.length} 項問題 —— 未寫出任何檔案：`)
    for (const e of errs.slice(0, 30)) console.error('   ' + e)
    if (errs.length > 30) console.error(`   …… 另外 ${errs.length - 30} 項`)
    process.exit(1)
  }

  writeFileSync(outPath, JSON.stringify(rows, null, 2) + '\n')
  const byT: Record<string, number> = {}
  const byD: Record<string, number> = {}
  for (const a of archs) { byT[a.topicZh] = (byT[a.topicZh] ?? 0) + a.n; byD[a.diff] = (byD[a.diff] ?? 0) + a.n }
  console.log(`✅ ${rows.length} 條（原型 ${archs.length} 個，每個 ≤${CAP} 條）→ ${outPath}`)
  console.log('   難度', JSON.stringify(byD))
  console.log('   課題', JSON.stringify(byT))
}

// ── 數值格式化 ──────────────────────────────────────────────────────────────
/** 去掉浮點誤差尾巴；整數不留小數點。 */
export const num = (x: number, dp = 4): string => {
  const r = Number(x.toFixed(dp))
  return Number.isInteger(r) ? String(r) : String(r)
}
/** 最大公因數（用於約分）。 */
export const gcd = (a: number, b: number): number => (b ? gcd(b, Math.abs(a % b)) : Math.abs(a))
/** 化為最簡分數的 LaTeX；分母為 1 時回整數。 */
export const frac = (n: number, d: number): string => {
  const g = gcd(n, d) || 1
  let nn = n / g, dd = d / g
  if (dd < 0) { nn = -nn; dd = -dd }
  return dd === 1 ? String(nn) : `\\dfrac{${nn}}{${dd}}`
}
/** 金額（保留兩位小數，整數則不留）。 */
export const money = (x: number): string => {
  const r = Math.round(x * 100) / 100
  return Number.isInteger(r) ? String(r) : r.toFixed(2)
}
