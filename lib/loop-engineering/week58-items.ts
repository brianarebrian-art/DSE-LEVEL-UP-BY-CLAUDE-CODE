/**
 * 第 5–8 星期必修數學升級草稿。
 * 題幹由可覆算的自編模板生成，只使用來源題的編號、課題、題型、分值與基準剖面。
 * 不讀取、不改寫來源題幹。答案句以「結果是：」開頭，題幹不得出現這四個字。
 */
import { stemFingerprint } from './asset-map.ts'
import { BANK_DISCLOSURE_ZH, PREVIEW_ITEM_LABEL_ZH } from './disclosure.ts'
import {
  type BaselineProfileId,
  type DimensionScores,
  composite,
  meetsUpgradeTarget,
  profileComposite,
} from './rubric.ts'
import { type SampleCandidate } from './week58-scope.ts'

export const WEEK58_AT = '2026-11-27T16:00:00+08:00'

export function week58DisclosureZh(): string {
  return `${BANK_DISCLOSURE_ZH} ${PREVIEW_ITEM_LABEL_ZH}。難度宣稱：未驗證。`
}

export const PROPOSED_BY_PROFILE: Record<BaselineProfileId, DimensionScores> = {
  // 選擇題基準 11，門檻 12.1。步驟 2→3、表達 1→2，其餘維持基準。
  p2_mc: { reasoning: 3, stepIntegration: 3, trapQuality: 3, expression: 2, transfer: 2 },
  // 甲部(1) 基準 11，門檻 12.1。推理、步驟、陷阱各升一檔。
  p1_a1: { reasoning: 3, stepIntegration: 3, trapQuality: 3, expression: 3, transfer: 2 },
  // 甲部(2) 基準 15，門檻 16.5。推理與表達各升一檔。
  p1_a2: { reasoning: 4, stepIntegration: 3, trapQuality: 3, expression: 4, transfer: 3 },
  // 乙部基準 18，門檻 19.8。陷阱與遷移各升一檔，第 (c) 部要寫方法邊界。
  p1_b: { reasoning: 4, stepIntegration: 4, trapQuality: 4, expression: 4, transfer: 4 },
}

for (const id of Object.keys(PROPOSED_BY_PROFILE) as BaselineProfileId[]) {
  const score = composite(PROPOSED_BY_PROFILE[id])
  if (!meetsUpgradeTarget(score, profileComposite(id))) {
    throw new Error(`擬評未達到公式 (1)：${id}`)
  }
}

export const UPGRADE_KINDS = [
  'compare_models',
  'reverse_parameter',
  'choose_method',
  'boundary_judgment',
  'bigger_numbers',
] as const

export type UpgradeKind = (typeof UPGRADE_KINDS)[number]

export const FAMILY_IDS = [
  'successive_percent',
  'replacement_probability',
  'quadratic_sum_squares',
  'arithmetic_positive',
  'index_two_laws',
  'log_product',
  'remainder_pair',
  'line_relation',
  'circle_position',
  'domain_two_gates',
  'trig_included_angle',
  'line_plane_tan',
  'polygon_in_out',
  'inequality_two',
  'joint_variation',
  'order_or_not',
  'error_perimeter',
  'inscribed_or_semicircle',
  'hcf_two_three',
  'surd_product',
  'similar_powers',
  'median_vs_mean',
  'locus_line',
  'geometric_infinite',
  'sequence_which',
] as const

export type FamilyId = (typeof FAMILY_IDS)[number]

export const WEEK58_TOPICS: Record<string, { family: FamilyId; syllabusNoteZh: string }> = {
  percentage: { family: 'successive_percent', syllabusNoteZh: '百分變化屬假定已掌握的初中範圍，草稿不超出這個範圍。' },
  probability: { family: 'replacement_probability', syllabusNoteZh: '必修概率：放回與不放回。' },
  quadratic_equations: { family: 'quadratic_sum_squares', syllabusNoteZh: '必修二次方程：根與係數、判別式。' },
  arithmetic_sequence: { family: 'arithmetic_positive', syllabusNoteZh: '必修等差數列通項，並判斷正數項到哪裡為止。' },
  indices: { family: 'index_two_laws', syllabusNoteZh: '指數定律：冪的冪與同底相除。' },
  logarithms: { family: 'log_product', syllabusNoteZh: '對數的乘積定律，不引入換底公式以外的微積分。' },
  polynomials: { family: 'remainder_pair', syllabusNoteZh: '餘式定理，用兩個餘數求係數。' },
  linear_functions: { family: 'line_relation', syllabusNoteZh: '直線斜率與是否相交。' },
  coordinate_geometry: { family: 'circle_position', syllabusNoteZh: '圓方程的圓心，以及點在圓內、圓上或圓外。' },
  functions: { family: 'domain_two_gates', syllabusNoteZh: '函數定義域：根號與分母。' },
  trigonometry: { family: 'trig_included_angle', syllabusNoteZh: '餘弦公式，用於已知兩邊及其夾角。' },
  trig_3d: { family: 'line_plane_tan', syllabusNoteZh: '直線與平面的夾角，鄰邊取地板對角線。' },
  polygons: { family: 'polygon_in_out', syllabusNoteZh: '正多邊形內角與外角，屬假定已掌握的初中範圍。' },
  inequalities: { family: 'inequality_two', syllabusNoteZh: '不等式變號，以及兩個條件的交集。' },
  variation: { family: 'joint_variation', syllabusNoteZh: '正變與反變同時出現，分母是平方。' },
  permutation_combination: { family: 'order_or_not', syllabusNoteZh: '必修排列與組合：先判斷次序是否要計。' },
  approximation: { family: 'error_perimeter', syllabusNoteZh: '近似與誤差：半個單位，以及周界的最大絕對誤差。' },
  circles: { family: 'inscribed_or_semicircle', syllabusNoteZh: '同弧圓心角，以及半圓上的圓周角定理何時不適用。' },
  factors_multiples: { family: 'hcf_two_three', syllabusNoteZh: '兩個正整數的 H.C.F. 與 L.C.M.，以及三個數時關係不再自動成立。' },
  number_systems: { family: 'surd_product', syllabusNoteZh: '實數與根式：兩個無理數的乘積可以是有理數。' },
  similar_solids: { family: 'similar_powers', syllabusNoteZh: '相似立體的邊長、面積與體積用不同次方。' },
  statistics: { family: 'median_vs_mean', syllabusNoteZh: '偶數項的中位數，以及極端值對平均數的影響。' },
  locus: { family: 'locus_line', syllabusNoteZh: '與兩點等距的軌跡是垂直平分線。' },
  geometric_sequence: { family: 'geometric_infinite', syllabusNoteZh: '無窮等比數列要先看公比絕對值是否小於 1。' },
  sequences: { family: 'sequence_which', syllabusNoteZh: '先分辨等差與等比，再寫第 n 項。' },
}

const FAMILY_KIND: Record<FamilyId, Exclude<UpgradeKind, 'bigger_numbers'>> = {
  successive_percent: 'compare_models',
  replacement_probability: 'compare_models',
  quadratic_sum_squares: 'reverse_parameter',
  arithmetic_positive: 'boundary_judgment',
  index_two_laws: 'choose_method',
  log_product: 'choose_method',
  remainder_pair: 'reverse_parameter',
  line_relation: 'compare_models',
  circle_position: 'boundary_judgment',
  domain_two_gates: 'boundary_judgment',
  trig_included_angle: 'choose_method',
  line_plane_tan: 'choose_method',
  polygon_in_out: 'compare_models',
  inequality_two: 'boundary_judgment',
  joint_variation: 'choose_method',
  order_or_not: 'choose_method',
  error_perimeter: 'boundary_judgment',
  inscribed_or_semicircle: 'boundary_judgment',
  hcf_two_three: 'boundary_judgment',
  surd_product: 'boundary_judgment',
  similar_powers: 'choose_method',
  median_vs_mean: 'compare_models',
  locus_line: 'choose_method',
  geometric_infinite: 'boundary_judgment',
  sequence_which: 'choose_method',
}

const SETTINGS = ['課後練習', '小組討論', '補課工作紙', '自修筆記', '課堂小測', '學習社溫習', '午間複習', '家長伴讀']
const GOODS = ['書', '球衣', '文具套裝', '科學模型', '社區課程材料', '影印本', '義賣餅卡', '實驗耗材', '校巴月票', '練習簿']
const THINGS = ['貼紙', '波子', '卡片']

export interface SolvedDraft {
  scenario: string
  correctText: string
  traps: [string, string, string]
  why: string
  gist: string
  markers: readonly string[]
  partB: string
  partC: string
  limitation: string
  transferNote: string
}

export interface Week58Item {
  draftId: string
  sourceQuestionId: string
  topic: string
  topicZh: string
  family: FamilyId
  upgradeKind: UpgradeKind
  itemType: 'mc' | 'long'
  marks: number
  marksFromSource: boolean
  baselineProfileId: BaselineProfileId
  proposed: DimensionScores
  params: Record<string, number>
  gistZh: string
  syllabusNoteZh: string
  content: string
  options?: string[]
  correctIndex?: number
  referenceAnswer?: string
  explanation: string
  disclosureZh: string
  stemFingerprint: string
}

function gcd(a: number, b: number): number {
  let x = Math.abs(a)
  let y = Math.abs(b)
  while (y) {
    const t = x % y
    x = y
    y = t
  }
  return x || 1
}

function frac(n: number, d: number): string {
  const g = gcd(n, d)
  return `${n / g}/${d / g}`
}

function result(text: string): string {
  return `結果是：${text}`
}

function four(correct: string, a: string, b: string, c: string): [string, string, string] | null {
  const traps = [a, b, c]
  if ([correct, ...traps].some((text) => !text.startsWith('結果是：') || text.includes('結果是：結果是'))) return null
  if (new Set([correct, ...traps]).size !== 4) return null
  return [a, b, c]
}

function setting(n: number): string {
  return SETTINGS[Math.abs(n) % SETTINGS.length] ?? SETTINGS[0]
}

function ban(scenario: string): boolean {
  return scenario.includes('結果是')
}

export function placeOptions(correct: string, traps: [string, string, string], slot: number): { options: string[]; correctIndex: number } {
  const index = ((slot % 4) + 4) % 4
  const options = [...traps]
  options.splice(index, 0, correct)
  return { options, correctIndex: index }
}

function percentOutcome(pct: number): string {
  if (pct > 0) return `獲利 ${pct}%`
  if (pct < 0) return `虧蝕 ${-pct}%`
  return '不賺不蝕'
}

function solvePercent(p: Record<string, number>): SolvedDraft | null {
  const { cost, markup, discount, goods, setting: settingIndex } = p
  if (!Number.isInteger(cost) || cost <= 0 || cost % 100 !== 0) return null
  const marked = (cost * (100 + markup)) / 100
  const sale = (marked * (100 - discount)) / 100
  if (!Number.isInteger(marked) || !Number.isInteger(sale)) return null
  const profitPct = ((sale - cost) * 100) / cost
  if (!Number.isInteger(profitPct)) return null
  const naive = markup - discount
  const correct = result(percentOutcome(profitPct))
  const traps = four(correct, result(percentOutcome(naive)), result(`虧蝕 ${discount}%`), result(`獲利 ${markup}%`))
  if (!traps) return null
  const good = GOODS[goods] ?? GOODS[0]
  const scenario = `用於${setting(settingIndex)}。一件${good}的成本是 $${cost}。賣家先把標價定為成本加 ${markup}%，其後再按標價給予 ${discount}% 的折扣。問相對成本的百分變化。`
  if (ban(scenario)) return null
  return {
    scenario,
    correctText: correct,
    traps,
    why: `標價 = ${cost} × ${100 + markup}/100 = ${marked}。售價 = ${marked} × ${100 - discount}/100 = ${sale}。相對成本是 (${sale} - ${cost}) / ${cost} = ${profitPct}%。`,
    gist: '兩次百分變化的底數不同，要先乘完再與成本比較。',
    markers: ['成本', '標價', '折扣'],
    partB: `說明為甚麼不能把 ${markup}% 與 ${discount}% 直接相減，當作相對成本的變化。`,
    partC: '若折扣改為按成本計算而不是按標價，為甚麼不能把今次的比較直接搬去？',
    limitation: `若 ${discount}% 改為按成本 $${cost} 計算，底數不再是標價，不能把今次的步驟原封不動搬去。`,
    transferNote: '每次只對上一步的金額做變化，最後才與成本比較。',
  }
}

const PERCENT_PAIRS: Array<[number, number]> = [
  [25, 20],
  [20, 10],
  [50, 20],
  [40, 25],
  [25, 4],
  [10, 10],
  [30, 20],
]

function solveProbability(p: Record<string, number>): SolvedDraft | null {
  const red = p.red
  const blue = p.blue
  const total = red + blue
  if (red < 2 || blue < 1 || total < 3) return null
  const withNum = red * red
  const withDen = total * total
  const withoutNum = red * (red - 1)
  const withoutDen = total * (total - 1)
  if (withNum * withoutDen <= withoutNum * withDen) return null
  const withF = frac(withNum, withDen)
  const withoutF = frac(withoutNum, withoutDen)
  const thing = THINGS[p.thing] ?? THINGS[0]
  const correct = result(`放回的概率是 ${withF}，不放回是 ${withoutF}，放回較大`)
  const traps = four(
    correct,
    result(`不放回的概率是 ${withF}，放回是 ${withoutF}，不放回較大`),
    result(`兩次抽法的概率都是 ${withF}`),
    result('不放回的抽法不能寫成分數'),
  )
  if (!traps) return null
  const scenario = `用於${setting(p.setting)}。袋中有 ${red} 張紅${thing}與 ${blue} 張藍${thing}。甲每次抽出一張後放回，再抽第二次。乙不放回地連續抽兩張。比較兩人抽得兩張紅${thing}的概率。`
  if (ban(scenario)) return null
  return {
    scenario,
    correctText: correct,
    traps,
    why: `放回時兩次分母都是 ${total}，概率是 ${withF}。不放回時第二次分母是 ${total - 1}，概率是 ${withoutF}。交叉相乘後放回較大。`,
    gist: '要同時寫出放回與不放回，再比較，而不是只背一次抽取。',
    markers: ['放回', '不放回'],
    partB: '說明為甚麼不能把不放回說成「分母變了就不能用分數」。',
    partC: '若第二次抽取前有人加入或取走物件，為甚麼今次的比較不能直接搬去？',
    limitation: '母體在兩次抽取之間若被增減，放回與不放回的式子都要重寫。',
    transferNote: '先分清有沒有放回，再決定第二次的分母。',
  }
}

function solveQuadratic(p: Record<string, number>): SolvedDraft | null {
  const s = p.s
  const q = p.q
  if ((s * s - q) % 2 !== 0) return null
  const k = (s * s - q) / 2
  const disc = s * s - 4 * k
  const wrongA = (s * s + q) / 2
  const wrongB = s * s - q
  if (!Number.isInteger(k) || !Number.isInteger(wrongA) || k <= 0 || disc <= 0) return null
  const correct = result(`k=${k}，判別式是 ${disc}，大於 0，所以有兩個相異實根`)
  const traps = four(
    correct,
    result(`k=${wrongA}，判別式大於 0，所以有兩個相異實根`),
    result(`k=${wrongB}，判別式大於 0，所以有兩個相異實根`),
    result(`k=${k}，判別式小於 0，所以沒有實根`),
  )
  if (!traps) return null
  const scenario = `用於${setting(p.setting)}。二次方程 x^2 - ${s}x + k = 0 的兩根平方和是 ${q}。求 k，並判斷兩根是否為相異實根。`
  if (ban(scenario)) return null
  return {
    scenario,
    correctText: correct,
    traps,
    why: `設兩根為 α、β。α+β=${s}，αβ=k，α^2+β^2=(α+β)^2-2αβ=${s * s}-2k=${q}，所以 k=${k}。判別式 = ${s * s}-4×${k} = ${disc} > 0。`,
    gist: '先把平方和改寫成和與積，再檢查判別式，而不是只代一個更大的係數。',
    markers: ['平方和', '實根'],
    partB: '說明為甚麼不能把平方和寫成 (α+β)^2+2αβ。',
    partC: '若方程首項係數不是 1，為甚麼不能直接把和與積讀成題中的 s 與 k？',
    limitation: '首項係數不是 1 時，和與積要先除以首項係數，不能直接套這條式。',
    transferNote: '根與係數先改成和與積，再用恆等式，最後用判別式確認實根。',
  }
}

function solveArithmetic(p: Record<string, number>): SolvedDraft | null {
  const a = p.a
  const step = p.step
  if (a <= step || step <= 0) return null
  const d = -step
  const expr = `${a + step}-${step}n`
  const forgot = `${a}-${step}n`
  const flipped = `${a + step}+${step}n`
  let last = 0
  for (let n = 1; n <= 40; n += 1) {
    if (a + (n - 1) * d > 0) last = n
  }
  const next = a + last * d
  if (last < 2 || last > 15 || next > 0) return null
  if (a + step - step !== a) return null
  const correct = result(`通項是 ${expr}，第 ${last} 項是正數，第 ${last + 1} 項不是`)
  const traps = four(
    correct,
    result(`通項是 ${forgot}，第 ${Math.max(1, last - 1)} 項是最後的正數`),
    result(`通項是 ${flipped}，第 ${last} 項是正數`),
    result(`通項是 ${expr}，第 ${last + 1} 項仍是正數`),
  )
  if (!traps) return null
  const scenario = `用於${setting(p.setting)}。壁報由上而下排列，第 1 行有 ${a} 張，其後每一行都少 ${step} 張。求通項，並求最後一個仍是正數的行數。`
  if (ban(scenario)) return null
  return {
    scenario,
    correctText: correct,
    traps,
    why: `通項 = ${a}+(n-1)×(${d}) = ${expr}。第 1 行代回是 ${a}。第 ${last} 行仍是正數，第 ${last + 1} 行是 ${next}，不再是正數。`,
    gist: '要自己寫通項，再用正數條件找出最後一行，而不是只代一個給定的式。',
    markers: ['通項', '正數'],
    partB: '說明為甚麼不能把通項寫成首項直接減 n 乘公差。',
    partC: '若某一行允許是 0 張，為甚麼「最後一個正數行」的答案可能改變？',
    limitation: '若 0 張仍算可排，停止條件要改成大於或等於 0，不能沿用只取正數的行數。',
    transferNote: '先寫 a+(n-1)d，代 n=1 核對首項，再找使項為正的最大 n。',
  }
}

interface IndexTuple { b: number; m: number; n: number; p: number; exp: number; t1: number; t2: number; t3: number }

function buildIndexTuples(): IndexTuple[] {
  const out: IndexTuple[] = []
  for (const b of [2, 3, 5]) {
    for (const m of [2, 3, 4, 5]) {
      for (const n of [2, 3, 4, 5]) {
        for (const p of [1, 2, 3, 4, 5, 6]) {
          const exp = m * n - p
          if (exp <= 0 || exp > 24) continue
          if (exp === m || exp === n || exp === p) continue
          const candidates = [m * n + p, m + n - p, m ** n, n ** m]
          if (m * n % p === 0) candidates.unshift((m * n) / p)
          const traps: number[] = []
          for (const value of candidates) {
            if (!Number.isInteger(value) || value <= 0 || value > 80) continue
            if (value === exp || traps.includes(value)) continue
            traps.push(value)
            if (traps.length === 3) break
          }
          if (traps.length < 3) continue
          out.push({ b, m, n, p, exp, t1: traps[0], t2: traps[1], t3: traps[2] })
        }
      }
    }
  }
  return out
}

const INDEX_TUPLES = buildIndexTuples()

function solveIndex(p: Record<string, number>): SolvedDraft | null {
  const row = INDEX_TUPLES[p.row]
  if (!row) return null
  const correct = result(`${row.b} 的 ${row.exp} 次冪`)
  const traps = four(correct, result(`${row.b} 的 ${row.t1} 次冪`), result(`${row.b} 的 ${row.t2} 次冪`), result(`${row.b} 的 ${row.t3} 次冪`))
  if (!traps) return null
  const scenario = `用於${setting(p.setting)}。把（${row.b} 的 ${row.m} 次冪）的 ${row.n} 次冪，除以 ${row.b} 的 ${row.p} 次冪，寫成 ${row.b} 的單一冪。先用冪的冪，再用同底數相除。`
  if (ban(scenario)) return null
  return {
    scenario,
    correctText: correct,
    traps,
    why: `先把括號內寫成 ${row.b} 的 ${row.m * row.n} 次冪，再相除，指數相減得 ${row.exp}。`,
    gist: '要先選對冪的冪，再選同底相除，而不是把指數改大。',
    markers: ['冪', '除'],
    partB: '說明為甚麼不能把括號內的指數相加，或把相除改成指數相除。',
    partC: '若底數不相同，為甚麼不能沿用今次的指數相減？',
    limitation: '底數不同，或中間夾有加法時，不能把指數直接相減。',
    transferNote: '先處理括號，再處理同底的乘除，最後才合併指數。',
  }
}

const LOG_PAIRS: Array<[number, number]> = (() => {
  const pairs: Array<[number, number]> = []
  for (let u = 2; u <= 7; u += 1) {
    for (let v = 2; v <= 7; v += 1) {
      if (u === v) continue
      const sum = u + v
      const left = 2 ** u
      const right = 2 ** v
      if (sum === left || sum === right || 2 ** sum > 4096) continue
      const values = [sum, u * v, Math.abs(u - v), 2 ** sum]
      if (new Set(values).size < 4) continue
      pairs.push([u, v])
    }
  }
  return pairs
})()

function solveLog(p: Record<string, number>): SolvedDraft | null {
  const pair = LOG_PAIRS[p.row]
  if (!pair) return null
  const [u, v] = pair
  const left = 2 ** u
  const right = 2 ** v
  const sum = u + v
  const product = u * v
  const diff = Math.abs(u - v)
  const arg = 2 ** sum
  if (sum === left || sum === right || new Set([sum, product, diff, arg]).size < 4) return null
  const correct = result(`${sum}，也等於 log2(${arg})`)
  const traps = four(correct, result(`${product}，因為把兩個對數值相乘`), result(`${arg}`), result(`${diff}，因為把兩個對數值相減`))
  if (!traps) return null
  const scenario = `用於${setting(p.setting)}。計算 log2(${left}) + log2(${right})。使用乘積定律，不要把真數或兩個對數值亂乘。`
  if (ban(scenario)) return null
  return {
    scenario,
    correctText: correct,
    traps,
    why: `log2(${left})=${u}，log2(${right})=${v}，和是 ${sum}。乘積定律寫成 log2(${left * right}) = log2(${arg})。`,
    gist: '乘積定律把對數的和變成真數的積，不是把兩個對數值相乘。',
    markers: ['log2', '乘積'],
    partB: '說明為甚麼不能把兩個對數值相乘，或把答案寫成真數本身。',
    partC: '若兩項是相減而不是相加，為甚麼不能仍用乘積定律？',
    limitation: '對數相減對應真數相除；底數不同時，也不能直接把對數值相加。',
    transferNote: '先確認是和還是差，再決定真數相乘還是相除。',
  }
}

interface RemainderTuple { r1: number; r2: number; p: number; q: number }

function buildRemainderTuples(): RemainderTuple[] {
  const out: RemainderTuple[] = []
  for (let r1 = 0; r1 <= 12; r1 += 1) {
    for (let r2 = 0; r2 <= 12; r2 += 1) {
      if ((r1 - r2) % 2 !== 0 || (r1 + r2) % 2 !== 0 || r1 === r2) continue
      const p = (r1 - r2) / 2
      const q = (r1 + r2) / 2 - 1
      if (p === q || p === 0) continue
      if (p === r1 - r2 || p === (r2 - r1) / 2) continue
      out.push({ r1, r2, p, q })
    }
  }
  return out
}

const REMAINDER_TUPLES = buildRemainderTuples()

function solveRemainder(p: Record<string, number>): SolvedDraft | null {
  const row = REMAINDER_TUPLES[p.row]
  if (!row) return null
  const correct = result(`p=${row.p}，q=${row.q}`)
  const traps = four(
    correct,
    result(`p=${row.q}，q=${row.p}`),
    result(`p=${row.r1 - row.r2}，q=${row.q}`),
    result(`p=${(row.r2 - row.r1) / 2}，q=${row.q}`),
  )
  if (!traps) return null
  const scenario = `用於${setting(p.setting)}。f(x)=x^2+px+q。f(1)=${row.r1}，f(-1)=${row.r2}。用餘數定理求 p 與 q。`
  if (ban(scenario)) return null
  return {
    scenario,
    correctText: correct,
    traps,
    why: `1+p+q=${row.r1}，1-p+q=${row.r2}。兩式相減得 2p=${row.r1 - row.r2}，所以 p=${row.p}。代回得 q=${row.q}。`,
    gist: '用兩個餘數列聯立式，而不是只代一個值。',
    markers: ['餘數', 'f(1)'],
    partB: '說明為甚麼不能把 f(1)-f(-1) 直接當成 p，而不除以 2。',
    partC: '若除式不是 x-1 與 x+1，為甚麼不能仍用 f(1) 與 f(-1)？',
    limitation: '餘數定理要代入的是除式的根。除式改變，代入的數也要改。',
    transferNote: '先確認除式的根，再把兩個餘數相減求一次項係數。',
  }
}

function solveLine(p: Record<string, number>): SolvedDraft | null {
  const parallel = p.parallel === 1
  const m = p.m
  const c1 = p.c1
  const c2 = p.c2
  const k = 2
  if (m <= 0 || c1 <= 0 || c2 === c1) return null
  const eq1 = `${k}y = ${k * m}x + ${k * c1}`
  const slope2 = parallel ? m : m + 1
  const eq2 = `y = ${slope2}x + ${c2}`
  const correct = parallel
    ? result(`斜率都是 ${m}，截距不同，兩線不相交`)
    : result(`斜率是 ${m} 與 ${m + 1}，兩線相交於一點`)
  const traps = four(correct, result('兩線相交於一點'), result('兩線重合'), result('兩線互相垂直'))
  const trapsIntersect = four(correct, result('兩線不相交'), result('兩線重合'), result('兩線互相垂直'))
  const chosen = parallel ? traps : trapsIntersect
  if (!chosen) return null
  const scenario = `用於${setting(p.setting)}。兩條直線是 ${eq1} 與 ${eq2}。先化成 y = mx + c，再判斷斜率，以及它們是否相交。`
  if (ban(scenario)) return null
  return {
    scenario,
    correctText: correct,
    traps: chosen,
    why: parallel
      ? `第一式兩邊除以 ${k} 得 y = ${m}x + ${c1}。第二式斜率也是 ${m}，截距是 ${c2}。斜率相同而截距不同，所以不相交，也不是垂直。`
      : `第一式兩邊除以 ${k} 得 y = ${m}x + ${c1}。第二式斜率是 ${m + 1}。斜率不同，所以相交於一點，而且斜率乘積不是 -1。`,
    gist: '先化成斜率式，再判斷重合、平行或相交，而不是只看係數大小。',
    markers: ['斜率', '相交'],
    partB: '說明為甚麼斜率相同不足以推出兩線重合。',
    partC: '若第二式在相加之前先被乘上一個負數，為甚麼要重新化簡才能判斷垂直？',
    limitation: '未化成 y = mx + c 之前，不能把原式的 x 係數直接當成斜率。',
    transferNote: '先把兩式写成斜率式，再比較斜率與截距。',
  }
}

function coordTerm(variable: string, value: number): string {
  if (value === 0) return variable
  if (value > 0) return `(${variable}-${value})`
  return `(${variable}+${-value})`
}

function pointText(x: number, y: number): string {
  return `(${x},${y})`
}

function solveCircle(p: Record<string, number>): SolvedDraft | null {
  const h = p.h
  const k = p.k
  const r = p.r
  const mode = p.mode
  if (h === 0 || k === 0 || r < 2) return null
  const x = mode === 0 ? h : h + r + (mode === 2 ? 1 : 0)
  const y = k
  const correct =
    mode === 0
      ? result(`圓心是 ${pointText(h, k)}，該點是圓心，在圓內而不在圓周上`)
      : mode === 1
        ? result(`圓心是 ${pointText(h, k)}，該點在圓周上`)
        : result(`圓心是 ${pointText(h, k)}，該點在圓外`)
  const otherA = mode === 0 ? result(`圓心是 ${pointText(h, k)}，該點在圓周上`) : result(`圓心是 ${pointText(h, k)}，該點是圓心，在圓內而不在圓周上`)
  const otherB = mode === 2 ? result(`圓心是 ${pointText(h, k)}，該點在圓周上`) : result(`圓心是 ${pointText(h, k)}，該點在圓外`)
  const traps = four(correct, otherA, otherB, result(`圓心是 ${pointText(-h, -k)}，半徑是 ${r * r}`))
  if (!traps) return null
  const scenario = `用於${setting(p.setting)}。圓的方程是 ${coordTerm('x', h)}^2+${coordTerm('y', k)}^2=${r * r}。已知點 ${pointText(x, y)}。判斷圓心，以及該點在圓內、圓周上還是圓外。`
  if (ban(scenario)) return null
  return {
    scenario,
    correctText: correct,
    traps,
    why: `方程是圓心 ${pointText(h, k)}、半徑 ${r} 的標準式，右方 ${r * r} 是半徑平方。點 ${pointText(x, y)} 與圓心的距離平方要與 ${r * r} 比較。`,
    gist: '要同時讀出圓心符號和點與圓的位置，而不是把右方當成半徑。',
    markers: ['圓心', '圓周'],
    partB: '說明為甚麼方程右方不是半徑本身。',
    partC: '若點的坐標與圓心只差一個符號，為甚麼不能把它當成圓心？',
    limitation: '方程若還未配成標準式，不能把某個係數直接讀成圓心。',
    transferNote: '先寫出圓心與半徑，再比較距離平方和半徑平方。',
  }
}

function solveDomain(p: Record<string, number>): SolvedDraft | null {
  const a = p.a
  const b = p.b
  if (b <= a) return null
  const correct = result(`x=${a} 在定義域內，x=${b} 不在`)
  const traps = four(
    correct,
    result(`x=${a} 不在，因為有根號`),
    result(`x=${b} 在定義域內`),
    result(`x=${a} 與 x=${b} 都不在`),
  )
  if (!traps) return null
  const scenario = `用於${setting(p.setting)}。f(x) = √(x-${a}) ÷ (x-${b})。分母是 x-${b}。x=${a} 與 x=${b} 是否在定義域內？`
  if (ban(scenario)) return null
  return {
    scenario,
    correctText: correct,
    traps,
    why: `根號要求 x-${a} ≥ 0，所以 x=${a} 可以，根號值是 0。分母 x-${b} 在 x=${b} 時是 0，所以 x=${b} 不在定義域。`,
    gist: '根號的邊界可以取等號，分母則不可以是 0。兩件限制要一起看。',
    markers: ['定義域', '分母'],
    partB: '說明為甚麼根號等於 0 時，該點仍然可以在定義域內。',
    partC: '若根號改成寫在分母，為甚麼 x 等於根號邊界時的判斷要改變？',
    limitation: '根號若出現在分母，邊界使分母為 0，該點就要排除。',
    transferNote: '先分開寫根號條件和分母條件，再取交集。',
  }
}

function solveTrig(p: Record<string, number>): SolvedDraft | null {
  const a = p.a
  if (a < 3) return null
  const correct = result(`應使用餘弦公式，第三邊是 ${a} cm`)
  const traps = four(
    correct,
    result(`用勾股定理，第三邊是 ${a}√2 cm`),
    result(`用正弦定理，第三邊是 ${a}√3/2 cm`),
    result(`第三邊是 ${2 * a} cm`),
  )
  if (!traps) return null
  const scenario = `用於${setting(p.setting)}。三角形有兩邊長都是 ${a} cm，夾角是 60°。應使用餘弦公式還是勾股定理？第三邊是多少？`
  if (ban(scenario)) return null
  return {
    scenario,
    correctText: correct,
    traps,
    why: `已知的是兩邊及其夾角，用餘弦公式。c^2 = ${a}^2+${a}^2-2×${a}×${a}×1/2 = ${a * a}，所以第三邊是 ${a} cm。`,
    gist: '先判斷已知的是夾角還是直角，再選公式。',
    markers: ['夾角', '餘弦'],
    partB: '說明為甚麼這個三角形不能先用勾股定理。',
    partC: '若 60° 不是這兩邊的夾角，為甚麼不能沿用餘弦公式的這一種代法？',
    limitation: '餘弦公式裡的角必須是所代兩邊的夾角。角若對著另一邊，就要改用對應的寫法或正弦公式。',
    transferNote: '先在圖上指出角夾住的兩邊，再決定用餘弦公式還是正弦公式。',
  }
}

const BOXES: Array<[number, number, number]> = [
  [6, 8, 10],
  [5, 12, 13],
  [8, 15, 17],
  [7, 24, 25],
  [9, 12, 15],
  [9, 40, 41],
  [12, 16, 20],
  [12, 35, 37],
  [15, 20, 25],
  [15, 36, 39],
  [18, 24, 30],
  [20, 21, 29],
]

function solvePlane(p: Record<string, number>): SolvedDraft | null {
  const box = BOXES[p.box]
  const h = p.h
  if (!box || h <= 0) return null
  const [a, b, c] = box
  if (a * a + b * b !== c * c) return null
  const texts = [frac(h, c), frac(h, a), frac(h, b), frac(c, h)]
  if (new Set(texts).size < 4) return null
  const correct = result(`鄰邊是地板對角線 ${c}，正切是 ${texts[0]}`)
  const traps = four(correct, result(`鄰邊是長 ${a}，正切是 ${texts[1]}`), result(`鄰邊是闊 ${b}，正切是 ${texts[2]}`), result(`正切是 ${texts[3]}`))
  if (!traps) return null
  const scenario = `用於${setting(p.setting)}。長方體的長是 ${a}、闊是 ${b}、高是 ${h}。空間對角線與地板的夾角，其正切應以哪一條作鄰邊？該正切是多少？`
  if (ban(scenario)) return null
  return {
    scenario,
    correctText: correct,
    traps,
    why: `地板對角線是 √(${a}^2+${b}^2) = ${c}。夾角的鄰邊是這條地板對角線，對邊是高 ${h}，所以正切是 ${texts[0]}。`,
    gist: '鄰邊是地板對角線，不是長方體的一條棱。',
    markers: ['地板', '正切'],
    partB: '說明為甚麼不能把長或闊直接當成鄰邊。',
    partC: '若問的是空間對角線與一條直立棱的夾角，為甚麼鄰邊不再是地板對角線？',
    limitation: '夾角所對的平面改變時，鄰邊要改成落在那個平面上的投影，不能沿用地板對角線。',
    transferNote: '先指出角所在的直角三角形，再決定對邊和鄰邊。',
  }
}

const POLYGONS = [5, 6, 8, 9, 10, 12, 15, 18]

function solvePolygon(p: Record<string, number>): SolvedDraft | null {
  const n = POLYGONS[p.row]
  if (!n || 360 % n !== 0) return null
  const exterior = 360 / n
  const interior = 180 - exterior
  const correct = result(`每個內角是 ${interior}°，每個外角是 ${exterior}°`)
  const traps = four(correct, result(`每個內角是 180°`), result(`每個內角是 ${(n - 2) * 180}°`), result(`每個外角是 ${interior}°`))
  if (!traps) return null
  const scenario = `用於${setting(p.setting)}。正 ${n} 邊形的每個內角和每個外角分別是多少？`
  if (ban(scenario)) return null
  return {
    scenario,
    correctText: correct,
    traps,
    why: `外角和是 360°，每個外角是 ${exterior}°。內角與外角互補，所以內角是 ${interior}°。`,
    gist: '內角要先用外角或 (n-2)×180 再除以 n，不能只寫 (n-2)×180。',
    markers: ['內角', '外角'],
    partB: '說明為甚麼 (n-2)×180 還不是每個內角。',
    partC: '若多邊形不是正多邊形，為甚麼不能仍說每個外角都是 360°/n？',
    limitation: '各邊各角不相等時，只能說外角和是 360°，不能把每個外角都寫成 360°/n。',
    transferNote: '先判斷是不是正多邊形，再決定求一個角還是只求和。',
  }
}

function solveInequality(p: Record<string, number>): SolvedDraft | null {
  const a = p.a
  const bound = p.bound
  const empty = p.empty === 1
  const low = empty ? 0 : -bound - 2 - (p.extra % 3)
  if (a < 2 || bound < 1) return null
  if (!empty && low >= -bound) return null
  const correct = empty ? result('沒有實數同時滿足兩個條件') : result(`${low} ≤ x < ${-bound}`)
  const traps = empty
    ? four(correct, result(`x < ${-bound}`), result(`x > ${-bound}`), result('x ≥ 0'))
    : four(correct, result(`x < ${-bound}`), result(`x > ${-bound}`), result('沒有實數同時滿足兩個條件'))
  if (!traps) return null
  const scenario = `用於${setting(p.setting)}。求同時滿足 -${a}x > ${a * bound} 和 x ≥ ${low} 的實數範圍。不等式兩邊的方向要一併處理。`
  if (ban(scenario)) return null
  return {
    scenario,
    correctText: correct,
    traps,
    why: `-${a}x > ${a * bound}。兩邊除以 -${a}，不等號要改向，得 x < ${-bound}。再與 x ≥ ${low} 取交集。`,
    gist: '負數相除要改不等號方向，然後才與第二個條件取交集。',
    markers: ['不等式', '同時'],
    partB: '說明為甚麼除以負數時不能保持不等號方向。',
    partC: '若第二個條件改成嚴格大於交集的上界，為甚麼解集會變成空集？',
    limitation: '第二個條件若與第一個條件沒有重疊，交集是空集，不能只寫其中一個條件。',
    transferNote: '先單獨化簡每一條不等式，再在數線上取交集。',
  }
}

function solveVariation(p: Record<string, number>): SolvedDraft | null {
  const s = p.s
  if (s < 1) return null
  const x1 = 4 * s
  const y1 = 6 * s
  const z1 = 2
  const x2 = 8 * s
  const z2 = 4
  const y2 = 3 * s
  const trapA = 6 * s
  const trapB = 12 * s
  const trapC = 768 * s
  const correct = result(String(y2))
  const traps = four(correct, result(String(trapA)), result(String(trapB)), result(String(trapC)))
  if (!traps) return null
  const scenario = `用於${setting(p.setting)}。y 正變於 x，而且反變於 z 的平方。當 x=${x1}、z=${z1} 時，y=${y1}。當 x=${x2}、z=${z2} 時，y 是多少？`
  if (ban(scenario)) return null
  return {
    scenario,
    correctText: correct,
    traps,
    why: `y = kx/z^2。由第一組得 k = ${y1}×${z1 * z1}/${x1} = 6。代入第二組，y = 6×${x2}/${z2 * z2} = ${y2}。`,
    gist: '正變與平方反變要寫在同一個式，不能只按 x 放大。',
    markers: ['正變', '反變'],
    partB: '說明為甚麼不能把 z 的平方漏掉，或改成乘上平方。',
    partC: '若 y 改為反變於 z 而不是 z 的平方，為甚麼 k 與新值都要重算？',
    limitation: '反變的冪次改變時，k 的求法和代入的分母都要改，不能只換最後一個數。',
    transferNote: '先寫 y = kx/z^n，用一組已知數求 k，再代入新的一組。',
  }
}

function solveOrder(p: Record<string, number>): SolvedDraft | null {
  const n = p.n
  const ordered = p.ordered === 1
  if (n < 5) return null
  const c = (n * (n - 1)) / 2
  const perm = n * (n - 1)
  const square = n * n
  const sum = n + 2
  if (new Set([c, perm, square, sum]).size < 4) return null
  const correct = ordered ? result(`職位不同，要計次序，共 ${perm} 種`) : result(`不計次序，共 ${c} 種`)
  const traps = four(correct, result(ordered ? `不計次序，共 ${c} 種` : `職位不同，要計次序，共 ${perm} 種`), result(`共 ${square} 種`), result(`共 ${sum} 種`))
  if (!traps) return null
  const scenario = ordered
    ? `用於${setting(p.setting)}。從 ${n} 位同學選出正副班長，兩個職位不同，要計次序。有多少種選法？`
    : `用於${setting(p.setting)}。從 ${n} 位同學選 2 人做義工，不設職位次序。有多少種選法？`
  if (ban(scenario)) return null
  return {
    scenario,
    correctText: correct,
    traps,
    why: ordered ? `兩個職位不同，是排列 ${n}×${n - 1} = ${perm}。` : `不計次序，是組合 ${n}×${n - 1}/2 = ${c}。`,
    gist: '先判斷職位或名次使次序變得重要，再選擇排列或組合。',
    markers: ['次序', '職位'],
    partB: '說明為甚麼不能一律用 n 的平方。',
    partC: ordered
      ? '若兩個職位改成沒有分別的兩名幹事，為甚麼種數要再除以 2？'
      : '若改為選正副班長、兩個職位不同，為甚麼要改用排列，而不是沿用今次的組合數？',
    limitation: ordered
      ? '選出的位置若不再可區分，排列就要改成組合，不能保留次序。'
      : '這題已經不計次序。職位變得可區分時要改用排列，不能沿用今次的組合數。',
    transferNote: '先問調換兩人的位置會不會變成另一種結果。',
  }
}

function oneDecimal(tenths: number): string {
  const sign = tenths < 0 ? '-' : ''
  const abs = Math.abs(tenths)
  return `${sign}${Math.floor(abs / 10)}.${abs % 10}`
}

function solveError(p: Record<string, number>): SolvedDraft | null {
  const length = p.length
  const width = p.width
  if (length < 3 || width < 3 || length === width) return null
  const nominalTenths = 2 * (length + width) * 10
  const upper = nominalTenths + 2
  const fullUnit = nominalTenths + 4
  const half = (length + width) * 10 + 1
  const correct = result(`${oneDecimal(upper)} cm`)
  const traps = four(correct, result(`${oneDecimal(nominalTenths)} cm`), result(`${oneDecimal(fullUnit)} cm`), result(`${oneDecimal(half)} cm`))
  if (!traps) return null
  const scenario = `用於${setting(p.setting)}。長 ${length} cm、闊 ${width} cm，兩度都準確至 0.1 cm。最大絕對誤差是 0.05 cm。求長方形周界的最大可能值。`
  if (ban(scenario)) return null
  return {
    scenario,
    correctText: correct,
    traps,
    why: `準確至 0.1 cm 時，每個度量的最大絕對誤差是 0.05 cm。周界有四段，最大可能值是 2×(${length}+0.05+${width}+0.05) = ${oneDecimal(upper)} cm。`,
    gist: '半個單位的誤差要按周界的四段累加，不是只加在一邊。',
    markers: ['最大絕對誤差', '周界'],
    partB: '說明為甚麼不能把 0.1 cm 整個都當成單邊的最大絕對誤差。',
    partC: '若問的是面積而不是周界，為甚麼不能仍把四個 0.05 cm 相加？',
    limitation: '面積的最大絕對誤差不是把各邊誤差相加。度量對象改變，誤差傳遞的式子也要改。',
    transferNote: '先取半個最小單位，再數這個誤差在目標式裡出現幾次。',
  }
}

const ANGLES = [20, 24, 28, 32, 36, 40, 42, 48, 18, 16, 30, 44]

function solveInscribed(p: Record<string, number>): SolvedDraft | null {
  const theta = ANGLES[p.row]
  if (!theta || theta === 45 || theta % 2 !== 0) return null
  const correct = result(`同弧圓心角是 ${2 * theta}°；該弦不是直徑，所以不是半圓上的圓周角`)
  const traps = four(
    correct,
    result(`同弧圓心角是 ${theta}°`),
    result(`同弧圓心角是 ${theta / 2}°`),
    result('同弧圓心角是 90°，因為圓周角在半圓上'),
  )
  if (!traps) return null
  const scenario = `用於${setting(p.setting)}。圓周角是 ${theta}°，它所對的弦不是直徑。同弧的圓心角是多少？半圓上的圓周角定理適用嗎？`
  if (ban(scenario)) return null
  return {
    scenario,
    correctText: correct,
    traps,
    why: `同弧的圓心角是圓周角的兩倍，所以是 ${2 * theta}°。半圓上的圓周角要對着直徑。題中該弦不是直徑，而且角不是 90°，所以這條定理不適用。`,
    gist: '要同時用倍角關係，並排除一條條件不成立的定理。',
    markers: ['圓心角', '直徑'],
    partB: '說明為甚麼「圓周角」三個字不足以推出它在半圓上。',
    partC: '若該弦改為直徑，為甚麼今次的度數判斷不能保留？',
    limitation: '弦若是直徑，圓周角應是 90°。度數或弦的身分改變後，要重新選擇定理。',
    transferNote: '先確認圓周角所對的弦是不是直徑，再決定用倍角還是半圓定理。',
  }
}

function solveHcf(p: Record<string, number>): SolvedDraft | null {
  const a = p.a
  const b = p.b
  const c = p.c
  if (a <= 1 || b <= a || c <= b) return null
  const g2 = gcd(a, b)
  const l2 = (a / g2) * b
  if (g2 * l2 !== a * b) return null
  const g3 = gcd(g2, c)
  const l3 = (l2 / gcd(l2, c)) * c
  if (g3 * l3 === a * b * c) return null
  const correct = result(`${a} 與 ${b} 成立，加入 ${c} 之後不成立`)
  const traps = four(correct, result('兩組都成立'), result('兩組都不成立'), result(`只在 ${a}、${b}、${c} 這三個數時成立`))
  if (!traps) return null
  const scenario = `用於${setting(p.setting)}。對 ${a} 與 ${b}，H.C.F. 乘 L.C.M. 是否等於兩數乘積？對 ${a}、${b}、${c} 三個數又是否成立？`
  if (ban(scenario)) return null
  return {
    scenario,
    correctText: correct,
    traps,
    why: `${a} 與 ${b} 的 H.C.F. 是 ${g2}，L.C.M. 是 ${l2}，乘積等於 ${a * b}。三個數的 H.C.F. 是 ${g3}，L.C.M. 是 ${l3}，兩者之積不等於 ${a * b * c}。`,
    gist: '兩個數的關係不要自動搬到三個數。',
    markers: ['H.C.F.', 'L.C.M.'],
    partB: '說明為甚麼不能由兩個數成立，就說三個數也成立。',
    partC: '若只研究多項式而不是正整數，為甚麼還要先確認討論的物件是甚麼？',
    limitation: '這條乘積關係是對兩個正整數說的。物件改成三個數或改成多項式時，要重新證明，不能直接搬結論。',
    transferNote: '先數清楚是兩個數還是三個數，再使用 H.C.F. 與 L.C.M. 的關係。',
  }
}

function solveSurd(p: Record<string, number>): SolvedDraft | null {
  const t = p.t
  if (t < 2) return null
  const x = 2 * t * t
  const y = 2
  const product = 2 * t
  const sum = x + y
  const correct = result(`兩個因數都是無理數，乘積是有理數 ${product}`)
  const traps = four(correct, result('乘積仍是無理數'), result(`乘積是 ${sum}`), result(`乘積是 √${sum}`))
  if (!traps) return null
  const scenario = `用於${setting(p.setting)}。√${x} 與 √${y} 都是無理數嗎？它們的乘積是有理數還是無理數？`
  if (ban(scenario)) return null
  return {
    scenario,
    correctText: correct,
    traps,
    why: `√${x}×√${y} = √${x * y} = √${product * product} = ${product}，是有理數。兩個因數本身都不是完全平方數。`,
    gist: '無理數對乘法不是封閉的。要計算乘積，不能只看每個因數。',
    markers: ['無理數', '乘積'],
    partB: '說明為甚麼不能由「兩個都是無理數」推出乘積仍是無理數。',
    partC: '若改為相加而不是相乘，為甚麼今次的有理數結論不能保留？',
    limitation: '√a+√b 在 a、b 不是完全平方時通常仍是無理數。運算由乘法改成加法，結論要重算。',
    transferNote: '先把乘積寫成一個根號，再看根號裡是不是完全平方。',
  }
}

const SIMILAR_PAIRS: Array<[number, number]> = [
  [2, 3],
  [1, 2],
  [2, 5],
  [3, 4],
  [3, 5],
  [4, 5],
  [2, 7],
  [3, 7],
  [4, 7],
  [5, 6],
]

function solveSimilar(p: Record<string, number>): SolvedDraft | null {
  const pair = SIMILAR_PAIRS[p.row]
  if (!pair) return null
  const [small, large] = pair
  const correct = result(`表面面積比是 ${small * small}:${large * large}`)
  const traps = four(
    correct,
    result(`表面面積比是 ${small ** 3}:${large ** 3}`),
    result(`表面面積比是 ${small}:${large}`),
    result(`表面面積比是 ${small ** 4}:${large ** 4}`),
  )
  if (!traps) return null
  const scenario = `用於${setting(p.setting)}。兩個相似立體的體積比是 ${small ** 3}:${large ** 3}。先求對應邊長比，再求表面面積比。`
  if (ban(scenario)) return null
  return {
    scenario,
    correctText: correct,
    traps,
    why: `體積比是邊長比的立方，所以邊長比是 ${small}:${large}。表面面積比是邊長比的平方，即 ${small * small}:${large * large}。`,
    gist: '由體積回到邊長要開立方，再到面積要平方，不能把體積比直接當成面積比。',
    markers: ['體積', '表面面積'],
    partB: '說明為甚麼不能把體積比或邊長比直接寫成表面面積比。',
    partC: '若已知的是表面面積比而要求體積比，為甚麼次方的方向要倒過來？',
    limitation: '由面積求體積，要先開平方得到邊長比，再立方。方向與今次相反。',
    transferNote: '先把已知比化成邊長比，再按所求是長度、面積或體積選擇次方。',
  }
}

function solveStats(p: Record<string, number>): SolvedDraft | null {
  const a = p.a
  const gap = p.gap
  const c = a + gap
  const d = c + gap
  const e = d + gap
  const base = a + a + c + d + e
  let outlier = Math.max(p.outlier, e + 10)
  while ((base + outlier) % 6 !== 0 && outlier < p.outlier + e + 16) outlier += 1
  const data = [a, a, c, d, e, outlier]
  if (a < 1 || gap < 2 || outlier < e + 10) return null
  if (data.some((value, index) => index > 0 && value < data[index - 1])) return null
  const sum = data.reduce((total, value) => total + value, 0)
  if (sum % 6 !== 0) return null
  const mean = sum / 6
  const median = (c + d) / 2
  if (!Number.isInteger(median) || median === mean || mean === c) return null
  const correct = result(`中位數是 ${median}，平均數是 ${mean}，中位數較少被 ${outlier} 拉高`)
  const traps = four(correct, result(`中位數是 ${c}`), result(`中位數是 ${mean}`), result(`平均數是 ${median}`))
  if (!traps) return null
  const scenario = `用於${setting(p.setting)}。6 個數據由小至大是 ${data.join('、')}。哪一句同時講對中位數與平均數？`
  if (ban(scenario)) return null
  return {
    scenario,
    correctText: correct,
    traps,
    why: `項數是偶數，中位數是第 3、第 4 項的平均，即 (${c}+${d})/2 = ${median}。平均數是 ${sum}/6 = ${mean}。${outlier} 進入總和，所以拉高平均數，但不改變中間兩項。`,
    gist: '偶數項的中位數不是單一個數據，極端值也不會自動變成中位數。',
    markers: ['中位數', '平均數'],
    partB: '說明為甚麼不能只取中間偏左的一個數當中位數。',
    partC: '若極端值改為插在中間兩項之間，為甚麼「它不影響中位數」的說法要重審？',
    limitation: '極端值只有在它不占據中間位置時，才不會改變中位數。資料重新排序後要再看位置。',
    transferNote: '先排好序，按項數找中間位置，再另看極端值有沒有進入所問的統計量。',
  }
}

function solveLocus(p: Record<string, number>): SolvedDraft | null {
  const distance = p.distance
  const vertical = p.vertical === 1
  if (distance < 1) return null
  const correct = vertical ? result(`軌跡是直線 y=${distance}`) : result(`軌跡是直線 x=${distance}`)
  const traps = vertical
    ? four(correct, result(`軌跡是直線 x=${distance}`), result(`軌跡是直線 y=${2 * distance}`), result('軌跡是直線 y=0'))
    : four(correct, result(`軌跡是直線 y=${distance}`), result(`軌跡是直線 x=${2 * distance}`), result('軌跡是直線 x=0'))
  if (!traps) return null
  const scenario = vertical
    ? `用於${setting(p.setting)}。動點 P 與 A(0,0)、B(0,${2 * distance}) 的距離相等。它的軌跡是哪條直線？`
    : `用於${setting(p.setting)}。動點 P 與 A(0,0)、B(${2 * distance},0) 的距離相等。它的軌跡是哪條直線？`
  if (ban(scenario)) return null
  return {
    scenario,
    correctText: correct,
    traps,
    why: vertical
      ? `與兩點等距的軌跡是垂直平分線。A、B 的中點是 (0,${distance})，所以軌跡是 y=${distance}。`
      : `與兩點等距的軌跡是垂直平分線。A、B 的中點是 (${distance},0)，所以軌跡是 x=${distance}。`,
    gist: '等距軌跡是垂直平分線，中點坐標才是該直線的常數。',
    markers: ['動點', '軌跡'],
    partB: '說明為甚麼軌跡不是通過 B 的那條坐標軸。',
    partC: '若條件改成與一個定點保持固定距離，為甚麼軌跡不再是直線？',
    limitation: '與一定點距離固定的軌跡是圓。條件從「與兩點等距」改掉之後，不能再寫垂直平分線。',
    transferNote: '先分清條件是等距於兩點，還是固定距離於一點。',
  }
}

function solveGeometric(p: Record<string, number>): SolvedDraft | null {
  const a = p.a
  if (a < 6 || a % 6 !== 0) return null
  const sum = 2 * a
  const wrongRatio = (2 * a) / 3
  const half = a / 2
  const correct = result(`公比絕對值小於 1，無窮和是 ${sum}`)
  const traps = four(correct, result(`無窮和是 ${wrongRatio}`), result('沒有無窮和'), result(`無窮和是 ${half}`))
  if (!traps) return null
  const scenario = `用於${setting(p.setting)}。等比數列首項是 ${a}，公比是 1/2。無窮和是否存在？若存在，和是多少？`
  if (ban(scenario)) return null
  return {
    scenario,
    correctText: correct,
    traps,
    why: `公比絕對值 1/2 < 1，無窮和存在，等於 ${a}/(1-1/2) = ${sum}。`,
    gist: '要先檢查公比絕對值，再用 a/(1-r)，不是把首項乘公比。',
    markers: ['無窮', '公比'],
    partB: '說明為甚麼不能用 a/(1+r)，或在公比絕對值小於 1 時說沒有無窮和。',
    partC: '若公比改成 2，為甚麼不能仍用今次的和？',
    limitation: '公比絕對值大於或等於 1 時，無窮等比級數不收斂，不能代 a/(1-r) 當成和。',
    transferNote: '先看 |r| 是否小於 1，再代入無窮和公式。',
  }
}

function solveSequence(p: Record<string, number>): SolvedDraft | null {
  const u = p.u
  const r = p.r
  if (u < 2 || r < 2) return null
  const terms = [u, u * r, u * r * r, u * r * r * r]
  const correct = result(`這是等比數列，第 n 項是 ${u}×${r}^(n-1)`)
  const traps = four(
    correct,
    result(`這是等差數列，第 n 項是 ${u}+${u * (r - 1)}(n-1)`),
    result(`這是等比數列，第 n 項是 ${u}×${r}^n`),
    result(`這是等差數列，第 n 項是 ${u}+${r}(n-1)`),
  )
  if (!traps) return null
  const scenario = `用於${setting(p.setting)}。數列的前四項是 ${terms.join('、')}。這是等差數列還是等比數列？第 n 項是甚麼？`
  if (ban(scenario)) return null
  return {
    scenario,
    correctText: correct,
    traps,
    why: `相鄰項的比都是 ${r}，差則不是常數，所以是等比數列。第 n 項是首項乘公比的 (n-1) 次冪。`,
    gist: '先用差與比判斷種類，再決定第 n 項的指數是 n-1 還是 n。',
    markers: ['等差', '等比'],
    partB: '說明為甚麼不能因為項在變大，就把它當成等差數列。',
    partC: '若公比是負數，為甚麼還要重新檢查它是不是等比，而不能只看前兩項的差？',
    limitation: '公比為負時，項會正負相間。只看前兩項的差，會誤判成等差。',
    transferNote: '先檢查差是否固定，再檢查比是否固定，最後才寫通項。',
  }
}

function paramsFor(family: FamilyId, n: number): Record<string, number> | null {
  const slot = n
  const settingIndex = Math.floor(n / 9) % SETTINGS.length
  switch (family) {
    case 'successive_percent': {
      const pair = PERCENT_PAIRS[n % PERCENT_PAIRS.length]
      return { slot, setting: settingIndex, goods: Math.floor(n / 7) % GOODS.length, cost: 100 * (1 + (Math.floor(n / 7) % 9)), markup: pair[0], discount: pair[1] }
    }
    case 'replacement_probability':
      return { slot, setting: settingIndex, red: 2 + (n % 4), blue: 3 + (Math.floor(n / 4) % 5), thing: Math.floor(n / 20) % THINGS.length }
    case 'quadratic_sum_squares': {
      const found = quadraticAt(n)
      return found ? { slot, setting: settingIndex, ...found } : null
    }
    case 'arithmetic_positive':
      return { slot, setting: settingIndex, a: 8 + (n % 10), step: 2 + (Math.floor(n / 10) % 4) }
    case 'index_two_laws':
      return INDEX_TUPLES.length ? { slot, setting: settingIndex, row: n % INDEX_TUPLES.length } : null
    case 'log_product':
      return { slot, setting: settingIndex, row: n % LOG_PAIRS.length }
    case 'remainder_pair':
      return REMAINDER_TUPLES.length ? { slot, setting: settingIndex, row: n % REMAINDER_TUPLES.length } : null
    case 'line_relation':
      return {
        slot,
        setting: settingIndex,
        parallel: n % 2 === 0 ? 1 : 0,
        m: 2 + (Math.floor(n / 2) % 7),
        c1: 1 + (Math.floor(n / 14) % 5),
        c2: 8 + (Math.floor(n / 14) % 5),
      }
    case 'circle_position':
      return { slot, setting: settingIndex, h: 1 + (n % 5), k: n % 2 === 0 ? 1 + (Math.floor(n / 5) % 4) : -(1 + (Math.floor(n / 5) % 4)), r: 2 + (Math.floor(n / 10) % 4), mode: n % 3 }
    case 'domain_two_gates':
      return { slot, setting: settingIndex, a: 1 + (n % 6), b: 4 + (n % 6) + (Math.floor(n / 6) % 4) }
    case 'trig_included_angle':
      return { slot, setting: settingIndex, a: 3 + (n % 12) }
    case 'line_plane_tan':
      return { slot, setting: settingIndex, box: n % BOXES.length, h: 1 + (Math.floor(n / BOXES.length) % 6) }
    case 'polygon_in_out':
      return { slot, setting: settingIndex, row: n % POLYGONS.length }
    case 'inequality_two':
      return { slot, setting: settingIndex, a: 2 + (n % 5), bound: 1 + (Math.floor(n / 5) % 6), empty: n % 2, extra: n % 3 }
    case 'joint_variation':
      return { slot, setting: settingIndex, s: 1 + (n % 8) }
    case 'order_or_not':
      return { slot, setting: settingIndex, n: 5 + (n % 10), ordered: n % 2 }
    case 'error_perimeter':
      return { slot, setting: settingIndex, length: 6 + (n % 10), width: 3 + (Math.floor(n / 10) % 5) }
    case 'inscribed_or_semicircle':
      return { slot, setting: settingIndex, row: n % ANGLES.length }
    case 'hcf_two_three':
      return { slot, setting: settingIndex, a: 4 + (n % 6), b: 8 + (n % 6), c: 14 + (Math.floor(n / 6) % 8) }
    case 'surd_product':
      return { slot, setting: settingIndex, t: 2 + (n % 12) }
    case 'similar_powers':
      return { slot, setting: settingIndex, row: n % SIMILAR_PAIRS.length }
    case 'median_vs_mean':
      return { slot, setting: settingIndex, a: 1 + (n % 4), gap: 2 + (Math.floor(n / 4) % 3), outlier: 24 + (n % 8) * 3 }
    case 'locus_line':
      return { slot, setting: settingIndex, distance: 1 + (n % 12), vertical: n % 2 }
    case 'geometric_infinite':
      return { slot, setting: settingIndex, a: 6 * (1 + (n % 12)) }
    case 'sequence_which':
      return { slot, setting: settingIndex, u: 2 + (n % 6), r: 2 + (Math.floor(n / 6) % 3) }
    default:
      return null
  }
}

const QUADRATIC_MATCHES = (() => {
  const matches: Array<{ s: number; q: number }> = []
  for (let s = 5; s <= 14; s += 1) {
    for (let q = 1; q < s * s; q += 1) {
      if ((s * s - q) % 2 !== 0) continue
      const k = (s * s - q) / 2
      const disc = s * s - 4 * k
      const wrongA = (s * s + q) / 2
      const wrongB = s * s - q
      if (k <= 0 || disc <= 0 || !Number.isInteger(wrongA)) continue
      if (new Set([k, wrongA, wrongB]).size < 3) continue
      matches.push({ s, q })
    }
  }
  return matches
})()

function quadraticAt(n: number): { s: number; q: number } | null {
  return QUADRATIC_MATCHES.length ? QUADRATIC_MATCHES[n % QUADRATIC_MATCHES.length] : null
}

export function solveWeek58(family: FamilyId, params: Record<string, number>): SolvedDraft | null {
  switch (family) {
    case 'successive_percent':
      return solvePercent(params)
    case 'replacement_probability':
      return solveProbability(params)
    case 'quadratic_sum_squares':
      return solveQuadratic(params)
    case 'arithmetic_positive':
      return solveArithmetic(params)
    case 'index_two_laws':
      return solveIndex(params)
    case 'log_product':
      return solveLog(params)
    case 'remainder_pair':
      return solveRemainder(params)
    case 'line_relation':
      return solveLine(params)
    case 'circle_position':
      return solveCircle(params)
    case 'domain_two_gates':
      return solveDomain(params)
    case 'trig_included_angle':
      return solveTrig(params)
    case 'line_plane_tan':
      return solvePlane(params)
    case 'polygon_in_out':
      return solvePolygon(params)
    case 'inequality_two':
      return solveInequality(params)
    case 'joint_variation':
      return solveVariation(params)
    case 'order_or_not':
      return solveOrder(params)
    case 'error_perimeter':
      return solveError(params)
    case 'inscribed_or_semicircle':
      return solveInscribed(params)
    case 'hcf_two_three':
      return solveHcf(params)
    case 'surd_product':
      return solveSurd(params)
    case 'similar_powers':
      return solveSimilar(params)
    case 'median_vs_mean':
      return solveStats(params)
    case 'locus_line':
      return solveLocus(params)
    case 'geometric_infinite':
      return solveGeometric(params)
    case 'sequence_which':
      return solveSequence(params)
    default:
      return null
  }
}

export function familyVariantCount(family: FamilyId, limit = 160): number {
  const seen = new Set<string>()
  for (let n = 0; n < limit; n += 1) {
    const params = paramsFor(family, n)
    if (!params) continue
    const solved = solveWeek58(family, params)
    if (!solved) continue
    if (solved.markers.some((marker) => !solved.scenario.includes(marker))) continue
    if (solved.scenario.includes(solved.correctText) || solved.traps.some((trap) => solved.scenario.includes(trap))) continue
    seen.add(stemFingerprint(solved.scenario) ?? '')
  }
  seen.delete('')
  return seen.size
}

function splitMarks(total: number, parts: number): number[] {
  if (parts < 1 || total < parts) throw new Error('分值不足以拆開')
  const base = Math.floor(total / parts)
  const extra = total % parts
  return Array.from({ length: parts }, (_, index) => base + (index < extra ? 1 : 0))
}

function draftMarks(row: SampleCandidate): { marks: number; fromSource: boolean } {
  if (row.itemType === 'mc') return { marks: row.marks && row.marks > 0 ? row.marks : 1, fromSource: row.marks != null }
  if (typeof row.marks === 'number' && row.marks >= 2) return { marks: row.marks, fromSource: true }
  const fallback = row.baselineProfileId === 'p1_b' ? 9 : row.baselineProfileId === 'p1_a2' ? 6 : 4
  return { marks: fallback, fromSource: false }
}

export function createWeek58Item(row: SampleCandidate, draftId: string, usedFingerprints: Set<string>): Week58Item {
  const topic = WEEK58_TOPICS[row.topic]
  if (!topic || !row.baselineProfileId) throw new Error(`課題未有升級模板：${row.topic}`)
  if (row.itemType === 'mc' && row.baselineProfileId !== 'p2_mc') throw new Error(`選擇題剖面不是 p2_mc：${row.id}`)
  if (row.itemType !== 'mc' && row.baselineProfileId === 'p2_mc') throw new Error(`書寫題不應使用選擇題剖面：${row.id}`)
  const seed = stableSeed(row.id)
  const { marks, fromSource } = draftMarks(row)
  for (let salt = 0; salt < 80; salt += 1) {
    const params = paramsFor(topic.family, seed + salt)
    if (!params) continue
    const solved = solveWeek58(topic.family, params)
    if (!solved) continue
    if (solved.markers.some((marker) => !solved.scenario.includes(marker))) {
      throw new Error(`模板缺少標記：${topic.family}`)
    }
    const item = renderItem(row, draftId, topic.family, topic.syllabusNoteZh, params, solved, marks, fromSource)
    if (item.content.includes('結果是')) continue
    if (item.content.includes(solved.correctText)) continue
    if (solved.traps.some((trap) => item.content.includes(trap))) continue
    const fingerprint = item.stemFingerprint
    if (!fingerprint || usedFingerprints.has(fingerprint)) continue
    usedFingerprints.add(fingerprint)
    return item
  }
  throw new Error(`無法為 ${row.id} 生成不重複草稿`)
}

function renderItem(
  row: SampleCandidate,
  draftId: string,
  family: FamilyId,
  syllabusNoteZh: string,
  params: Record<string, number>,
  solved: SolvedDraft,
  marks: number,
  fromSource: boolean,
): Week58Item {
  const profile = row.baselineProfileId
  if (!profile) throw new Error('缺少基準剖面')
  const proposed = PROPOSED_BY_PROFILE[profile]
  const header = `【自編．${row.topicZh}】`
  const markNote = fromSource ? '分值沿用來源題。' : '來源題沒有可用分值，此分值只按基準剖面暫定，不是官方分值。'
  let content = ''
  let referenceAnswer: string | undefined
  let options: string[] | undefined
  let correctIndex: number | undefined
  if (row.itemType === 'mc') {
    content = `${header}\n${solved.scenario}\n\n下列哪一項正確？`
    const placed = placeOptions(solved.correctText, solved.traps, params.slot ?? 0)
    options = placed.options
    correctIndex = placed.correctIndex
  } else {
    const parts = profile === 'p1_b' ? 3 : 2
    const weights = splitMarks(marks, parts)
    const lines = [
      `（${marks} 分，自編練習，不是官方試題。${markNote}）`,
      header,
      solved.scenario,
      `(a) 寫出正確結論。（${weights[0]} 分）`,
      `(b) ${solved.partB}（${weights[1]} 分）`,
    ]
    const reference = [`(a) ${solved.correctText}`, `(b) ${solved.why}`]
    if (parts === 3) {
      lines.push(`(c) ${solved.partC}（${weights[2]} 分）`)
      reference.push(`(c) ${solved.limitation}`)
    }
    content = lines.join('\n')
    referenceAnswer = reference.join('\n')
  }
  const explanation = [
    solved.why,
    `正確結論：${solved.correctText}`,
    `常見錯因：${solved.traps.join('；')}`,
    `可遷移的做法：${solved.transferNote}`,
  ].join('\n')
  return {
    draftId,
    sourceQuestionId: row.id,
    topic: row.topic,
    topicZh: row.topicZh,
    family,
    upgradeKind: FAMILY_KIND[family],
    itemType: row.itemType === 'mc' ? 'mc' : 'long',
    marks,
    marksFromSource: fromSource,
    baselineProfileId: profile,
    proposed,
    params,
    gistZh: `${solved.gist}算術上用公式 (1) 比較綜合分，難度宣稱維持未驗證。`,
    syllabusNoteZh,
    content,
    options,
    correctIndex,
    referenceAnswer,
    explanation,
    disclosureZh: week58DisclosureZh(),
    stemFingerprint: stemFingerprint(content) ?? '',
  }
}

export function stableSeed(id: string): number {
  let hash = 2166136261
  for (let index = 0; index < id.length; index += 1) {
    hash ^= id.charCodeAt(index)
    hash = Math.imul(hash, 16777619)
  }
  return hash >>> 0
}

export function allowedTopicSet(): Set<string> {
  return new Set(Object.keys(WEEK58_TOPICS))
}

export function toCatalogInput(item: {
  id: unknown
  topic: unknown
  topicZh?: unknown
  type: unknown
  marks?: unknown
  content?: unknown
  options?: unknown
  correctIndex?: unknown
  explanation?: unknown
  referenceAnswer?: unknown
  markingScheme?: unknown
}) {
  return {
    id: String(item.id),
    topic: String(item.topic),
    topicZh: typeof item.topicZh === 'string' ? item.topicZh : undefined,
    type: String(item.type),
    marks: typeof item.marks === 'number' ? item.marks : null,
    content: typeof item.content === 'string' ? item.content : '',
    options: Array.isArray(item.options) ? item.options.map(String) : undefined,
    correctIndex: typeof item.correctIndex === 'number' ? item.correctIndex : undefined,
    explanation: typeof item.explanation === 'string' ? item.explanation : undefined,
    referenceAnswer: typeof item.referenceAnswer === 'string' ? item.referenceAnswer : undefined,
    markingScheme: typeof item.markingScheme === 'string' ? item.markingScheme : undefined,
  }
}
