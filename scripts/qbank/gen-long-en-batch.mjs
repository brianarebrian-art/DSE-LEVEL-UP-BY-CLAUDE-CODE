// 生成 economics 長題補譯批次 b1（需求與供應 13 + 彈性 13 = 26 條）。
//
// 點解用模板代入而唔係逐條譯：呢 104 條係參數化題，抹走數字之後全科得 11 個
// 模板；單計呢兩個課題，26 條都係 2 個模板。逐條人手譯會有兩個唔必要嘅風險 ——
// ① 同一個模板嘅 13 個變體譯法漂移 ② 數字抄錯。代入法兩樣都冇。
//
// 生成之後會逐條斷言：英文抽出嚟嘅數字序列，必須同中文完全一致。
import { readFileSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const REL = 'data/questions/economics-long-b1-reviewed.ts'
const src = readFileSync(`${ROOT}/${REL}`, 'utf8')
const arr = JSON.parse(src.slice(src.indexOf('= [') + 2, src.lastIndexOf(']') + 1))

const TOPICS = ['需求與供應', '彈性']
const items = arr.filter((q) => !q.contentEn && TOPICS.includes(q.topicZh))

/**
 * 每個課題一個英文模板，`{0}`、`{1}`… 對應中文原文入面【由左至右】
 * 出現嘅數字。順序同個數已經核實過（需求與供應 4 個、彈性 4 個）。
 *
 * 術語跟憲章 §5 同香港課程用法：
 *   從量稅 = specific tax（唔係 per-unit levy）
 *   起點法 = point method using the initial price and quantity
 *            （同中點法 midpoint method 分開，兩者答案唔同）
 *   富有彈性／缺乏彈性 = elastic / inelastic
 */
const EN_TEMPLATE = {
  需求與供應:
    'A market is in equilibrium at a price of \\${0} with an equilibrium quantity of {1} units. ' +
    'The government then imposes a specific tax of \\${2} per unit.\n' +
    '(a) Explain how the tax affects the supply curve, stating both the direction and the size of the shift.\n' +
    '(b) If the new equilibrium quantity is {3} units, calculate the percentage change in quantity.\n' +
    '(c) Does it matter, for how the tax burden ends up being shared, whether the tax is paid by buyers or by sellers? Explain.',
  彈性:
    'The price of a good rises from \\${0} to \\${1}, and the quantity demanded falls from {2} units to {3} units.\n' +
    '(a) Calculate the price elasticity of demand, using the point method with the initial price and quantity.\n' +
    '(b) State whether this demand is elastic or inelastic, and explain the direction in which the firm’s total revenue moves after the price rise.\n' +
    '(c) Give TWO factors that would make demand for this good more elastic, explaining the mechanism in each case.',
}

/** 104 條共用同一段解析，所以英文亦只需一段。 */
const EXPLANATION_ZH = items[0].explanation
const EXPLANATION_EN =
  'What is being assessed is the whole path from the data to the conclusion: the calculation has to show its steps, ' +
  'the explanation has to identify the mechanism rather than restate the phenomenon, and the last part has to address ' +
  'the comparison or condition the question actually specifies. Marking looks not at the final figure but at whether ' +
  'each step is justified — a right answer that skips working usually loses more than complete reasoning with a slip ' +
  'in the last calculation.'

// ⚠️ 一定要要求至少一個數字。第一版寫 `[\d.]+`，喺英文度連句號都當咗一個
// 「數字」（"…the shift." → "."），於是英文序列變成 20,100,.,5,.,.,90,.,.
// 中文嗰邊啱啱好冇事，純粹因為中文用「。」唔用「.」—— 即係話個 bug 淨係
// 喺加咗英文之後先出現。下面條斷言就係為咗捉呢種嘢。
const nums = (s) => s.match(/\d+(?:\.\d+)?/g) ?? []

const out = []
for (const q of items) {
  const n = nums(q.content)
  const tpl = EN_TEMPLATE[q.topicZh]
  if (!tpl) throw new Error(`${q.id}: 冇 ${q.topicZh} 嘅英文模板`)
  const en = tpl.replace(/\{(\d)\}/g, (_, i) => {
    if (n[+i] === undefined) throw new Error(`${q.id}: 模板要 {${i}} 但中文只有 ${n.length} 個數字`)
    return n[+i]
  })
  // 斷言：英文數字序列必須同中文一模一樣
  const a = n.join(',')
  const b = nums(en).join(',')
  if (a !== b) throw new Error(`${q.id}: 數字對唔上\n  中 ${a}\n  英 ${b}`)
  if (q.explanation !== EXPLANATION_ZH) throw new Error(`${q.id}: 解析同第一條唔同，唔可以共用譯文`)

  out.push({
    id: q.id,
    subject: 'economics',
    sourceFile: REL,
    topicZh: q.topicZh,
    difficulty: q.difficulty,
    status: 'pending',
    zh: { content: q.content, explanation: q.explanation },
    en: { contentEn: en, explanationEn: EXPLANATION_EN },
  })
}

const doc = {
  kind: 'translation-batch',
  note:
    '為已入庫但缺 contentEn / explanationEn 嘅 economics 長題補譯（第一批：需求與供應 13 + 彈性 13）。' +
    '只新增英文欄，不改任何中文內容、分數或參考答案。' +
    '呢批題目係參數化模板 —— 每個課題 13 條同文不同數，所以英文由一個模板逐條代入生成，' +
    '生成時已斷言英文抽出嘅數字序列同中文完全一致。覆核請睇模板譯法本身：' +
    '一個模板批咗，佢 13 個變體就一齊成立。' +
    'referenceAnswerEn / markingSchemeEn 早已齊全，唔喺本批範圍。' +
    '機器唔會自動入庫 —— 要真人簽 decisions 嘅 _meta.reviewer 之後先套用。',
  created: '2026-09-19',
  reviewer: '',
  approvedAt: null,
  counts: { economics: out.length },
  items: out,
}

writeFileSync(`${ROOT}/scripts/qbank/drafts/economics-long-en-b1.json`, JSON.stringify(doc, null, 2) + '\n')
console.log(`寫咗 ${out.length} 條 · 模板 ${Object.keys(EN_TEMPLATE).length} 個 · 數字序列逐條核對通過`)
