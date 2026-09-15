// ============================================================================
// gen-quality-flags.mts —— 生成 data/qualityFlags.ts：「機器已驗出、等人手修」嘅上線題
// ----------------------------------------------------------------------------
// 用法：npx tsx scripts/qbank/gen-quality-flags.mts
//
// ══ 呢份清單係乜 ══
// 答案解析頁嘅品質徽章有三個狀態：實名審批 ／ 機檢通過 ／ 待核。
// 「待核」只畀【機器已經驗出具體問題、但仲未有人手修正】嘅上線題：
//
//   posref / posref-en  解析用位置講選項（「第二項」／"the second option"）。
//                       選項每次呈現都洗牌，所以呢句【一定】指錯。
//                       來源：scripts/qbank/posref-bank-baseline.json 嘅祖父清單。
//
//   兩類都要【對住而家嘅文字重新驗】先收：基線係 2026-09-05 量嘅候選清單，
//   已經修好嘅題唔可以仲掛住待核。欄位決定邊個介面受影響（explanation → 中文、
//   explanationEn → 英文），而中英兩個 pattern 都要試 —— 語言科係單語，英文科個
//   explanation 欄入面係英文（"the first option"），中文科個 explanationEn 欄入面係中文
//   （「第四項」）。2026-09-15 只用欄位揀 pattern，漏驗咗呢 14 條。
//
// ══ 點解【冇】「英文欄混中文」呢一類（2026-09-15 抽樣後剷走）══
// 原本有，685 條。抽樣之後發現入面好多係【刻意】嘅：化學「硫酸 / sulfuric acid」
// 中英對照、科技與生活「"9 折" and "10% off"」教香港寫法、歷史「Comment on（引語評論）」、
// 經濟「The Chinese term must be 企業家職能」。對住呢啲貼「英文有未翻譯中文」係講錯嘢。
// 真漏譯（倫理與宗教「it sits in 行為實際造成的整體後果…」）同刻意對照，regex 分唔到，
// 要真人逐條分（docs/qbank-en-fix-math-p1-long.md §七：619 條不同字串）。分完先加返。
//
// ══ 點解「待核」唔可以係其他意思 ══
// 上線題全部都已經 promote 過，所以一個泛指「未審」嘅待核狀態係冇成員嘅 ——
// 加一個永遠唔會出現嘅顏色，係假透明。呢度嘅待核係有具體成員、有具體原因，
// 而且對學生有用：佢知道嗰題解析入面「第二項」嗰句唔可以信。
//
// ══ 同 gen-provenance.mjs 一樣嘅紀律 ══
// · 【只有直接執行先寫檔】。import 就寫檔的話，過時閘會自己修好自己
//   （gen-provenance.mjs 2026-08-28 踩過：跑第一次紅、第二次綠）。
// · 清單只可以因為題目真係修好咗而變短，唔可以手改。
// ============================================================================
import fs from 'node:fs'
import { pathToFileURL } from 'node:url'

// ⚠️ dynamic import 而唔係具名 import：tsx 之下 `.ts` 模組（CJS interop）唔可以由
// `.mts` 具名 import 出 runtime 值，會 SyntaxError。同 live-charscan.mts 一致。
const mod = async <T,>(p: string): Promise<T> =>
  await import(p).then((m: Record<string, unknown>) => (m.default ?? m) as T)
const { loadSubjectQuestions, loadWrittenQuestions } = await mod<{
  loadSubjectQuestions: (id: string) => Promise<Array<Record<string, unknown>>>
  loadWrittenQuestions: (id: string) => Promise<Array<Record<string, unknown>>>
}>('../../data/questions/load.ts')
const { getActiveSubjects } = await mod<{ getActiveSubjects: () => Array<{ id: string }> }>('../../data/subjects.ts')

export type QualityFlag = 'posref' | 'posref-en'

const OUT = 'data/qualityFlags.ts'
// 同 scripts/qbank/check-posref.mjs 一致。改嗰邊要改埋呢度 —— 測試 ③ 會對。
const POS_ZH = /第[一二三四]項(?!因素|變[項數]|憑證|獨立)/
const POS_EN = /\b[Tt]he (?:first|second|third|fourth) (?:option|distractor)s?\b|\boptions? [ABCD]\b/

/** 題目 id → 已驗出嘅問題。純函數（除咗讀檔），唔寫任何嘢。 */
export async function collectFlags(): Promise<Record<string, QualityFlag[]>> {
  const flags = new Map<string, Set<QualityFlag>>()
  const add = (id: string, f: QualityFlag) => {
    if (!flags.has(id)) flags.set(id, new Set())
    flags.get(id)!.add(f)
  }

  // ① 枚舉上線題（重新驗要用現行文字）
  const live = new Map<string, Record<string, unknown>>()
  for (const sub of getActiveSubjects()) {
    const qs = await loadSubjectQuestions(sub.id)
    let written: Array<Record<string, unknown>> = []
    try { written = await loadWrittenQuestions(sub.id) } catch { /* 冇寫作題 */ }
    for (const q of [...qs, ...written]) {
      const id = String(q.id ?? '')
      if (id) live.set(id, q)
    }
  }

  // ② posref 祖父清單 —— 只收仍然上線嘅 id（基線可能有已經落架嘅題）
  const base = JSON.parse(fs.readFileSync('scripts/qbank/posref-bank-baseline.json', 'utf8')) as {
    grandfathered: Record<string, string[]>
  }
  for (const list of Object.values(base.grandfathered)) {
    for (const entry of list) {
      const m = entry.match(/^(\S+) \[(\w+)\]$/)
      if (!m) continue
      const q = live.get(m[1])
      if (!q) continue // 已落架
      const text = String(q[m[2]] ?? '')
      if (!POS_ZH.test(text) && !POS_EN.test(text)) continue // 已修好 —— 唔可以仲掛住待核
      add(m[1], /En$/.test(m[2]) ? 'posref-en' : 'posref')
    }
  }

  const out: Record<string, QualityFlag[]> = {}
  for (const id of [...flags.keys()].sort()) out[id] = [...flags.get(id)!].sort() as QualityFlag[]
  return out
}

export function render(flags: Record<string, QualityFlag[]>): string {
  const counts = { posref: 0, 'posref-en': 0 } as Record<QualityFlag, number>
  for (const fs_ of Object.values(flags)) for (const f of fs_) counts[f]++
  const lines = Object.entries(flags).map(([id, f]) => `  ${JSON.stringify(id)}: ${JSON.stringify(f)},`)
  return `// ⚠️ 生成檔 —— 唔好手改。由 scripts/qbank/gen-quality-flags.mts 生成。
// 「待核」徽章嘅成員：機器已經驗出具體問題、但仲未有人手修正嘅上線題。
// 只可以因為題目真係修好咗而變短。
//   posref ${counts.posref} · posref-en ${counts['posref-en']} · 合共 ${Object.keys(flags).length} 條題

export type QualityFlag = 'posref' | 'posref-en'

export const FLAGGED: Record<string, QualityFlag[]> = {
${lines.join('\n')}
}
`
}

const isDirectRun = process.argv[1] && pathToFileURL(process.argv[1]).href === import.meta.url
if (isDirectRun) {
  const out = render(await collectFlags())
  const prev = fs.existsSync(OUT) ? fs.readFileSync(OUT, 'utf8') : ''
  if (prev === out) console.log(`✅ ${OUT} 已係最新（無變更）`)
  else { fs.writeFileSync(OUT, out); console.log(`✅ 已生成 ${OUT}`) }
  console.log(out.split('\n')[3])
}
