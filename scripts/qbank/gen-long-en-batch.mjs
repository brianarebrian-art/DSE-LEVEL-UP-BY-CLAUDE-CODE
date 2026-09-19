// 生成 economics 長題補譯批次。用法：node scripts/qbank/gen-long-en-batch.mjs --batch=b2
//
// 點解用模板代入而唔係逐條譯：呢 104 條係參數化題，抹走數字之後全科得 11 個
// 模板。逐條人手譯會有兩個唔必要嘅風險 —— ① 同一個模板嘅 13 個變體譯法漂移
// ② 數字抄錯。代入法兩樣都冇。
//
// 生成之後會逐條斷言：英文抽出嚟嘅數字序列，必須同中文完全一致。
//
// ⚠️ 2026-09-19 由「b1 專用」改成可傳參。原本個檔由頭到尾寫死 b1 嘅兩個課題，
//    做第二批嗰陣最順手嘅做法係複製一份改個名 —— 咁就會有兩個各有一半模板
//    嘅生成器，而模板漂移正正係代入法想避免嗰樣嘢。所以模板集中一處，
//    批次只係一張「邊幾個課題」嘅表。
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..')
const REL = 'data/questions/economics-long-b1-reviewed.ts'

const arg = (k) => process.argv.find((a) => a.startsWith(`--${k}=`))?.split('=')[1]
const FORCE = process.argv.includes('--force')
const BATCH = arg('batch')

/**
 * 每批做邊幾個課題。
 *
 * ⚠️ 一批 = 若干個【完整】課題，唔會喺一個課題中間切開。
 *    代入法嘅前提係「一個模板批咗，佢 13 個變體就一齊成立」——
 *    同一個模板分兩批覆核，覆核人要記得返上一批點判，前提就冇咗。
 *    所以 78 條分 3 批 × 26，唔係 25／25／28。
 */
const BATCHES = {
  b1: { topics: ['需求與供應', '彈性'], label: '第一批' },
  b2: { topics: ['生產可能線（PPF）', '市場失靈'], label: '第二批' },
  b3: { topics: ['宏觀經濟', '市場結構'], label: '第三批' },
  b4: { topics: ['廠商與生產', '基礎概念'], label: '第四批' },
}

if (!BATCH || !BATCHES[BATCH]) {
  console.error(`要指定批次：--batch=${Object.keys(BATCHES).join('|')}`)
  process.exit(1)
}

const OUT = `scripts/qbank/drafts/economics-long-en-${BATCH}.json`
const DECISIONS = `scripts/qbank/drafts/economics-long-en-${BATCH}.decisions.json`

// ⚠️ 呢個閘唔係為咗小心，係為咗一個真係發生過嘅意外：2026-09-19 攞一個
//    已簽名嘅批次去做煙霧測試，結果洗咗 brian 個簽名（要由 HEAD~1 還原）。
//    生成器本身唔掂 decisions 檔，但覆蓋咗草稿就等於覆核人審過嗰份嘢冇咗，
//    而簽名仲喺度指住一份已經唔同咗嘅內容 —— 呢個比冇簽名更差。
if (existsSync(join(ROOT, DECISIONS))) {
  const d = JSON.parse(readFileSync(join(ROOT, DECISIONS), 'utf8'))
  const signed = (d._meta?.reviewer ?? '').trim()
  if (signed && !FORCE) {
    console.error(
      `${DECISIONS} 已經由「${signed}」簽咗名。\n` +
        `重新生成草稿會令個簽名指住一份唔同嘅內容 —— 拒絕覆寫。\n` +
        `真係要重做，先處理咗個簽名，再加 --force。`,
    )
    process.exit(1)
  }
}
if (existsSync(join(ROOT, OUT)) && !FORCE) {
  console.error(`${OUT} 已經存在。要覆寫請加 --force。`)
  process.exit(1)
}

const src = readFileSync(join(ROOT, REL), 'utf8')
const arr = JSON.parse(src.slice(src.indexOf('= [') + 2, src.lastIndexOf(']') + 1))

const { topics: TOPICS, label } = BATCHES[BATCH]
const items = arr.filter((q) => !q.contentEn && TOPICS.includes(q.topicZh))

/**
 * 每個課題一個英文模板，`{0}`、`{1}`… 對應中文原文入面【由左至右】
 * 出現嘅數字。順序同個數逐個課題核實過。
 *
 * ⚠️ `\\$` 係刻意嘅：中文原文存住一個【轉義咗嘅】錢號（`\$`），因為呢啲題
 *    經 KaTeX 渲染，未轉義嘅 `$` 會被當成數式開頭。英文要跟返，否則同一條題
 *    中英兩版一個顯示 `$10` 一個顯示緊一段崩咗嘅數式。
 *
 * 術語跟憲章 §5 同香港課程用法：
 *   從量稅 = specific tax（唔係 per-unit levy）
 *   起點法 = point method using the initial price and quantity
 *            （同中點法 midpoint method 分開，兩者答案唔同）
 *   富有彈性／缺乏彈性 = elastic / inelastic
 *   私人成本／外部成本／社會成本 = private / external / social cost
 *   社會最適水平 = socially optimal level
 *   生產可能線 = production possibility frontier
 *   機會成本 = opportunity cost
 *   支出法 = expenditure approach
 *   本地生產總值 = Gross Domestic Product
 *   億元 = hundred million dollars（⚠️【唔可以】寫 "$100 million"）
 *   完全競爭 = perfect competition
 *   價格接受者 = price taker
 *   訂價能力 = price-setting power
 *   產品差異 = product differentiation
 *   進入障礙 = barriers to entry
 *
 * ⚠️ b3 兩個模板嘅譯法唔係另起爐灶 —— 係由【已經入咗庫嘅 referenceAnswerEn】
 *    抄返出嚟（"hundred million"、"price-setting power"、"barriers to entry"
 *    全部原文照用）。同一條題嘅題幹同參考答案由兩個人分兩次譯，就會出現
 *    題幹問 "pricing power" 而答案答 "price-setting power" 呢種漂移 ——
 *    學生會以為係兩樣嘢。
 *
 * ⚠️「億元」呢個單位特別容易出事：寫 "$100 million" 會憑空多咗一個數字
 *    「100」，而下面條斷言逐個數字比對中英，會即刻 throw。呢個唔係斷言過嚴，
 *    係佢做緊嘢 —— 一個代入咗 7 個數字嘅模板，多一個假數字就對唔返位。
 *
 * 中文用【】標重點，英文用全大寫 —— 英文冇對應嘅括號，而粗體入唔到
 * 純文字欄位。b1 已經係咁做（"Give TWO factors…"），兩批保持一致。
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

  // ⚠️ 呢個模板頭兩個數字【係同一個值】（「可生產 100 單位；由 100 單位甲
  //    減至…」）。所以 {0} 同 {1} 會代入同一個數 —— 唔係手民之誤，唔好「修」。
  '生產可能線（PPF）':
    'An economy produces only two goods, A and B. If all its resources go to A, it can produce {0} units. ' +
    'When output of A is cut from {1} units to {2} units, output of B can rise from {3} units to {4} units.\n' +
    '(a) Calculate the opportunity cost of each additional unit of B, expressed in units of A.\n' +
    '(b) Explain why a production possibility frontier is usually bowed outwards (concave to the origin) rather than a straight line.\n' +
    '(c) If the economy’s current combination of output lies INSIDE the frontier, explain what that indicates, and how it differs from a movement ALONG the frontier.',

  市場失靈:
    'Each unit a factory produces imposes an external cost of \\${0} on nearby residents. Its current output is {1} units.\n' +
    '(a) Explain how private cost, external cost and social cost relate to one another, and calculate the total external cost at this level of output.\n' +
    '(b) Explain why a free market produces more of such a good than the socially optimal level.\n' +
    '(c) Name TWO policy tools that could address this, explaining for each its mechanism and one limitation.',

  // ⚠️ 尾兩個數字【係同一個值】（「政府開支增加 20 億元……增幅會等於、大於
  //    還是小於 20 億元」）。{5} 同 {6} 代入同一個數，同 PPF 嗰個情況一樣，
  //    唔係手民之誤。
  宏觀經濟:
    'An economy records the following expenditure data for one year ' +
    '(all figures in hundred million dollars): private consumption {0}, investment {1}, ' +
    'government expenditure {2}, exports {3}, imports {4}.\n' +
    '(a) Calculate Gross Domestic Product using the expenditure approach.\n' +
    '(b) Explain why imports must be SUBTRACTED in this calculation.\n' +
    // ⚠️ 單位只喺開頭講一次，(c) 用淨數字。唔好寫 "rises by 20 hundred million
    //    dollars" —— 英文讀起上嚟係「二十個一億」，而且已入庫嘅
    //    referenceAnswerEn 寫嘅係 "GREATER than 20"，題幹跟返先對得上。
    '(c) If government expenditure rises by {5} the following year while every other item ' +
    'stays unchanged, will the rise in Gross Domestic Product be equal to, greater than, ' +
    'or less than {6}? Explain.',

  // ⚠️ 同上：{1} 同 {2} 係同一個百分比（題幹講一次，提示再引一次）。
  市場結構:
    'Compare a perfectly competitive market with a market served by only {0} firms, ' +
    'in which the largest firm holds about {1}% of the market.\n' +
    '(a) State how the two differ in NUMBER OF FIRMS, PRODUCT DIFFERENTIATION and ' +
    'PRICE-SETTING POWER.\n' +
    '(Hint: what does the figure of {2}% for the largest firm tell you on its own?)\n' +
    '(b) Explain why a firm under perfect competition is a “price taker”.\n' +
    '(c) A classmate says “the fewer the firms, the higher the price must be”. ' +
    'Which part of that statement holds, and which part is an over-simplification?',
}

/** 104 條共用同一段解析，所以英文亦只需一段。 */
const EXPLANATION_ZH = arr[0].explanation
const EXPLANATION_EN =
  'What is being assessed is the whole path from the data to the conclusion: the calculation has to show its steps, ' +
  'the explanation has to identify the mechanism rather than restate the phenomenon, and the last part has to address ' +
  'the comparison or condition the question actually specifies. Marking looks not at the final figure but at whether ' +
  'each step is justified — a right answer that skips working usually loses more than complete reasoning with a slip ' +
  'in the last calculation.'

// ⚠️ 104 條共用一段中文解析，所以【已經入咗庫嗰批】嘅英文解析必須同呢一段
//    逐字一樣。唔對嘅話，同一段中文喺題庫會有兩個英文版本 —— 而兩個都唔會
//    有任何閘嗌，學生見到嘅係「同一句解析，換一條題就換咗個講法」。
const applied = arr.find((q) => q.explanationEn)
if (applied && applied.explanationEn !== EXPLANATION_EN) {
  throw new Error(
    `已入庫嘅 explanationEn 同本檔嘅 EXPLANATION_EN 唔同 —— 兩個版本會同時存在。\n` +
      `  已入庫：${applied.explanationEn.slice(0, 80)}…\n` +
      `  本檔　：${EXPLANATION_EN.slice(0, 80)}…`,
  )
}

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
  // 錢號轉義要中英一致，否則 KaTeX 會喺其中一版食咗個 `$` 當數式開頭。
  const dollars = (s) => (s.match(/\\\$/g) ?? []).length
  if (dollars(q.content) !== dollars(en)) {
    throw new Error(`${q.id}: 轉義錢號數目唔同（中 ${dollars(q.content)} / 英 ${dollars(en)}）`)
  }

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

if (!out.length) throw new Error(`${BATCH}: 揀唔到任何未譯題目 —— 課題名寫錯，定係已經譯晒？`)

const doc = {
  kind: 'translation-batch',
  note:
    `為已入庫但缺 contentEn / explanationEn 嘅 economics 長題補譯（${label}：` +
    `${TOPICS.map((t) => `${t} ${items.filter((q) => q.topicZh === t).length}`).join(' + ')}）。` +
    '只新增英文欄，不改任何中文內容、分數或參考答案。' +
    '呢批題目係參數化模板 —— 每個課題 13 條同文不同數，所以英文由一個模板逐條代入生成，' +
    '生成時已斷言英文抽出嘅數字序列同中文完全一致，轉義錢號數目亦一致。覆核請睇模板譯法本身：' +
    '一個模板批咗，佢 13 個變體就一齊成立。' +
    'referenceAnswerEn / markingSchemeEn 早已齊全，唔喺本批範圍。' +
    '機器唔會自動入庫 —— 要真人簽 decisions 嘅 _meta.reviewer 之後先套用。',
  created: new Date().toISOString().slice(0, 10),
  reviewer: '',
  approvedAt: null,
  counts: { economics: out.length },
  items: out,
}

writeFileSync(join(ROOT, OUT), JSON.stringify(doc, null, 2) + '\n')
console.log(
  `${BATCH}：寫咗 ${out.length} 條 · 課題 ${TOPICS.join('、')} · 模板 ${TOPICS.length} 個\n` +
    `數字序列逐條核對通過、轉義錢號數目一致 → ${OUT}`,
)
