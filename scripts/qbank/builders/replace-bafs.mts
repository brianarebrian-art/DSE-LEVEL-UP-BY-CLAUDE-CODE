// ============================================================================
// replace-bafs.mts —— 企業、會計與財務概論模板替換 55 條
// ----------------------------------------------------------------------------
// 被替換的克隆組（每組封頂 6 條）：求毛利 15、求毛利率 13、直線折舊 13、
// 營運資金 12、求淨利 12、單利利息 12、成本加成求售價 11、複利本利和 10、
// 淨利率 10、收支平衡銷量 7。全部是「兩個數代入一條公式」。
//
// ── 本批同時修正三個單一難度課題（dse-conformance 第 2 節）──────────────
//   financial_statements  現有 27 條【全易】 → 本批補 12 中
//   depreciation          現有 13 條【全中】 → 本批補 6 易 + 1 難
//   interest / costing    現有【零易題】     → 本批各補 6 易 / 4 易
// 一個課題只得一種難度，該課題的練習就會一面倒，補題順手把它拆開。
//
// ── 紅線 ────────────────────────────────────────────────────────────────
// 本科屬 CURRENCY_ONLY：所有金額的貨幣符號必須轉義為 \$，且全檔不用 $…$
// 數學語法 —— 否則 KaTeX 會把兩個金額之間的文字當成數學模式排版。
//
// ── 公式（人手覆核點）──────────────────────────────────────────────────
//   流動比率     = 流動資產 ÷ 流動負債
//   速動比率     = (流動資產 − 存貨) ÷ 流動負債
//   存貨周轉率   = 銷貨成本 ÷ 平均存貨
//   銷貨成本     = 期初存貨 + 購貨 − 期末存貨
//   會計等式     資產 = 負債 + 資本
//   單利         利息 = 本金 × 年利率 × 年期
//   複利本利和   = 本金 × (1 + 年利率)^年期
//   遞減餘額法   首年折舊 = 成本 × 折舊率（不減殘值）
//   年中購入     年折舊 × 實際持有月數 ÷ 12
//   加成率→毛利率  毛利率 = 加成率 ÷ (1 + 加成率)
// ============================================================================
import { emit, num, money, type Arch } from './_archetype.mts'

const T = {
  ratio: ['ratios', '財務比率', 'Financial Ratios'],
  fs:    ['financial_statements', '財務報表', 'Financial Statements'],
  int:   ['interest', '利息', 'Interest'],
  dep:   ['depreciation', '折舊', 'Depreciation'],
  cost:  ['costing', '成本與定價', 'Costing and Pricing'],
} as const

const R1 = [{ ca: 240, cl: 96 }, { ca: 500, cl: 200 }, { ca: 135, cl: 90 },
            { ca: 840, cl: 240 }, { ca: 320, cl: 128 }, { ca: 990, cl: 396 }]
const R2 = [{ ca: 300, inv: 120, cl: 90 }, { ca: 450, inv: 150, cl: 100 }, { ca: 260, inv: 60, cl: 80 },
            { ca: 720, inv: 220, cl: 125 }, { ca: 180, inv: 80, cl: 50 }, { ca: 640, inv: 240, cl: 160 }]
const R3 = [{ cogs: 480, o: 60, c: 100 }, { cogs: 900, o: 120, c: 180 }, { cogs: 350, o: 40, c: 60 },
            { cogs: 1440, o: 200, c: 280 }, { cogs: 600, o: 90, c: 110 }]
const F1 = [{ o: 40, p: 260, c: 50 }, { o: 120, p: 700, c: 180 }, { o: 25, p: 160, c: 35 },
            { o: 300, p: 1200, c: 250 }, { o: 90, p: 410, c: 100 }, { o: 55, p: 345, c: 60 }]
const F2 = [{ a: 500, l: 180 }, { a: 1200, l: 750 }, { a: 860, l: 260 },
            { a: 2400, l: 900 }, { a: 340, l: 115 }, { a: 1750, l: 1250 }]
const F3 = [
  { item: '欠供應商的貨款，須於三個月內清還', itemEn: 'money owed to a supplier, due within three months', ans: '流動負債', ansEn: 'Current liability' },
  { item: '公司持有並用於送貨的貨車', itemEn: 'a delivery van owned and used by the business', ans: '非流動資產', ansEn: 'Non-current asset' },
  { item: '客戶尚未支付的賒銷貨款', itemEn: 'amounts owed by credit customers', ans: '流動資產', ansEn: 'Current asset' },
]
const I1 = [{ i: 150, r: 5, n: 2 }, { i: 90, r: 3, n: 2 }, { i: 480, r: 4, n: 3 },
            { i: 60, r: 2, n: 3 }, { i: 700, r: 7, n: 2 }, { i: 240, r: 6, n: 4 }]
const I2 = [{ p: 1000, r: 10, n: 2 }, { p: 5000, r: 8, n: 2 }, { p: 2000, r: 5, n: 3 }, { p: 800, r: 12, n: 2 }]
const D1 = [{ c: 50000, r: 20 }, { c: 12000, r: 25 }, { c: 80000, r: 15 },
            { c: 36000, r: 30 }, { c: 24000, r: 5 }, { c: 60000, r: 40 }]
const D2 = [{ c: 96000, s: 6000, y: 5, m: 8 }]
const C1 = [{ cost: 160, price: 200 }, { cost: 250, price: 325 }, { cost: 480, price: 600 }, { cost: 90, price: 126 }]
const C2 = [{ mk: 40 }, { mk: 25 }]

const archs: Arch[] = [
  // ── 財務比率 17（全部中等）────────────────────────────────────────────
  {
    key: 'bafs_current_ratio', topic: T.ratio[0], topicZh: T.ratio[1], topicEn: T.ratio[2], diff: 'intermediate', n: 6,
    gen: (i) => {
      const { ca, cl } = R1[i]
      const ans = ca / cl
      return {
        q: [`某企業年結時的流動資產為 \\$${ca}，流動負債為 \\$${cl}。求其流動比率。`,
            `At the year end a business has current assets of \\$${ca} and current liabilities of \\$${cl}. Find its current ratio.`],
        ans: `${num(ans)} : 1`,
        wrong: [`${num(cl / ca)} : 1`, `\\$${money(ca - cl)}`, `${num((ca / cl) * 100)}%`],
        e: [`流動比率 = 流動資產 ÷ 流動負債 = ${ca} ÷ ${cl} = ${num(ans)}，習慣寫成 ${num(ans)} : 1，即每 \\$1 流動負債有 \\$${num(ans)} 流動資產支持。把分子分母對調得 ${num(cl / ca)} : 1，比率隨即失去意義 —— 記法是：能償還的東西在上，要償還的在下。\\$${money(ca - cl)} 是營運資金，兩者用同一組數字但答的是不同問題：營運資金是【差額】，比率是【倍數】，差額回答「夠不夠」，比率回答「寬裕到甚麼程度」。最後一項把比率誤作百分比表達，流動比率按慣例不用百分號。`,
            `Current ratio = current assets ÷ current liabilities = ${ca} ÷ ${cl} = ${num(ans)}, conventionally written ${num(ans)} : 1 — that is, \\$${num(ans)} of current assets backs every \\$1 of current liabilities. Inverting gives ${num(cl / ca)} : 1 and destroys the meaning; remember that what can pay goes on top. \\$${money(ca - cl)} is working capital: same figures, different question. Working capital is a *difference* answering "is there enough"; the ratio is a *multiple* answering "how comfortably". The last option expresses the ratio as a percentage, which is not the convention here.`],
      }
    },
  },
  {
    key: 'bafs_quick_ratio', topic: T.ratio[0], topicZh: T.ratio[1], topicEn: T.ratio[2], diff: 'intermediate', n: 6,
    gen: (i) => {
      const { ca, inv, cl } = R2[i]
      const ans = (ca - inv) / cl
      return {
        q: [`某企業的流動資產為 \\$${ca}，其中存貨佔 \\$${inv}；流動負債為 \\$${cl}。求其速動比率。`,
            `A business has current assets of \\$${ca}, of which \\$${inv} is inventory, and current liabilities of \\$${cl}. Find its quick ratio.`],
        ans: `${num(ans)} : 1`,
        wrong: [`${num(ca / cl)} : 1`, `${num(inv / cl)} : 1`, `${num(cl / (ca - inv))} : 1`],
        e: [`速動比率把【存貨】剔出流動資產之外：(${ca} − ${inv}) ÷ ${cl} = ${num(ans)}，即 ${num(ans)} : 1。點解要剔走存貨：存貨要先賣出、再收到錢，變現最慢，遇上急需還債時未必幫得上。忘記扣除存貨得 ${num(ca / cl)} : 1，那是流動比率，是本題最主要的失分位。${num(inv / cl)} : 1 只用了存貨本身，方向剛好相反。最後一項把分子分母對調。`,
            `The quick ratio strips *inventory* out of current assets: (${ca} − ${inv}) ÷ ${cl} = ${num(ans)}, i.e. ${num(ans)} : 1. Inventory is excluded because it must first be sold and then collected, making it the slowest current asset to turn into cash — of little help when debts fall due suddenly. Forgetting to deduct it gives ${num(ca / cl)} : 1, which is the current ratio and the main trap here. ${num(inv / cl)} : 1 uses only the inventory, the opposite of what is required, and the last option inverts the ratio.`],
      }
    },
  },
  {
    key: 'bafs_inventory_turnover', topic: T.ratio[0], topicZh: T.ratio[1], topicEn: T.ratio[2], diff: 'intermediate', n: 5,
    gen: (i) => {
      const { cogs, o, c } = R3[i]
      const avg = (o + c) / 2
      const ans = cogs / avg
      return {
        q: [`某零售商本年度的銷貨成本為 \\$${cogs}。期初存貨為 \\$${o}，期末存貨為 \\$${c}。求其存貨周轉率（次）。`,
            `A retailer's cost of goods sold for the year is \\$${cogs}. Opening inventory was \\$${o} and closing inventory \\$${c}. Find the inventory turnover (times).`],
        ans: `${num(ans)} 次`,
        wrong: [`${num(cogs / c)} 次`, `${num(cogs / (o + c))} 次`, `${num(avg / cogs)} 次`],
        e: [`存貨周轉率 = 銷貨成本 ÷ 平均存貨。平均存貨 = (${o} + ${c}) ÷ 2 = \\$${money(avg)}，故周轉率 = ${cogs} ÷ ${money(avg)} = ${num(ans)} 次，即該年存貨平均換手 ${num(ans)} 次。只用期末存貨作分母得 ${num(cogs / c)} 次 —— 期末數字只代表年結一刻的水平，遇上季節性生意會嚴重失真，故要取平均。把兩期存貨【相加】而不除以二得 ${num(cogs / (o + c))} 次，分母大了一倍。最後一項把分子分母對調，所得是周轉一次所需的年數而非次數。`,
            `Inventory turnover = cost of goods sold ÷ average inventory. Average inventory = (${o} + ${c}) ÷ 2 = \\$${money(avg)}, so turnover = ${cogs} ÷ ${money(avg)} = ${num(ans)} times — stock turned over ${num(ans)} times during the year. Using closing inventory alone gives ${num(cogs / c)} times, but a year-end figure reflects one instant and distorts badly in a seasonal trade, which is why the average is used. Adding the two figures without halving them gives ${num(cogs / (o + c))} times, doubling the denominator. The last option inverts the ratio, giving years per turn rather than turns per year.`],
      }
    },
  },

  // ── 財務報表 15（12 中 + 3 易，為 27 條全易的課題補回中等難度）────────
  {
    key: 'bafs_cogs_from_inventory', topic: T.fs[0], topicZh: T.fs[1], topicEn: T.fs[2], diff: 'intermediate', n: 6,
    gen: (i) => {
      const { o, p, c } = F1[i]
      const ans = o + p - c
      return {
        q: [`某商號本年度期初存貨 \\$${o}，年內購貨 \\$${p}，期末存貨 \\$${c}。求本年度的銷貨成本。`,
            `A trader had opening inventory of \\$${o}, purchases of \\$${p} during the year and closing inventory of \\$${c}. Find the cost of goods sold.`],
        ans: `\\$${money(ans)}`,
        wrong: [`\\$${money(o + p + c)}`, `\\$${money(p - o + c)}`, `\\$${money(p)}`],
        e: [`銷貨成本 = 期初存貨 + 購貨 − 期末存貨 = ${o} + ${p} − ${c} = \\$${money(ans)}。理路是：年初已有的加上年內買入的，就是【可供出售】的貨；仍然留在倉的（期末存貨）未曾賣出，所以要減走。把期末存貨【加】上去得 \\$${money(o + p + c)}，等於把未賣出的貨也算作成本，是本題最主要的失分位。第二項把期初與期末的加減調轉。答 \\$${money(p)} 的只計購貨，忽略了兩期存貨的變動 —— 只有在期初與期末存貨相等時，兩者才會碰巧相同。`,
            `Cost of goods sold = opening inventory + purchases − closing inventory = ${o} + ${p} − ${c} = \\$${money(ans)}. The logic: what was held at the start plus what was bought is what was *available* for sale; what is still in the warehouse was not sold, so it is deducted. Adding closing inventory instead gives \\$${money(o + p + c)} and counts unsold goods as a cost — the main trap. The second option reverses the signs of the two inventory figures. Answering \\$${money(p)} counts purchases only and ignores the change in inventory; the two coincide only when opening and closing inventory happen to be equal.`],
      }
    },
  },
  {
    key: 'bafs_accounting_equation', topic: T.fs[0], topicZh: T.fs[1], topicEn: T.fs[2], diff: 'intermediate', n: 6,
    gen: (i) => {
      const { a, l } = F2[i]
      const ans = a - l
      return {
        q: [`某獨資企業的資產總額為 \\$${a}，負債總額為 \\$${l}。求東主資本。`,
            `A sole trader has total assets of \\$${a} and total liabilities of \\$${l}. Find the owner's capital.`],
        ans: `\\$${money(ans)}`,
        wrong: [`\\$${money(a + l)}`, `\\$${money(l - a)}`, `\\$${money(a)}`],
        e: [`會計等式為：資產 = 負債 + 資本。移項得資本 = 資產 − 負債 = ${a} − ${l} = \\$${money(ans)}。意義是：企業擁有的資源之中，扣除欠外人的部分，餘下才是東主真正擁有的。把兩者相加得 \\$${money(a + l)}，等於把債主的權益也當成東主的。第二項把減數次序調轉，在負債少於資產時會得出負數，僅憑常識即可排除。答 \\$${money(a)} 的忽略了負債 —— 只有在企業完全無負債時，資本才等於資產。`,
            `The accounting equation is assets = liabilities + capital, so capital = assets − liabilities = ${a} − ${l} = \\$${money(ans)}. In words: of the resources the business controls, what is left after settling outside claims belongs to the owner. Adding the two gives \\$${money(a + l)} and treats creditors' claims as the owner's. The second option reverses the subtraction and turns negative whenever liabilities are smaller than assets, which common sense rules out. Answering \\$${money(a)} ignores liabilities; capital equals assets only when the business owes nothing.`],
      }
    },
  },
  {
    key: 'bafs_classify_item', topic: T.fs[0], topicZh: T.fs[1], topicEn: T.fs[2], diff: 'basic', n: 3,
    gen: (i) => {
      const { item, itemEn, ans, ansEn } = F3[i]
      const all = ['流動資產', '非流動資產', '流動負債', '非流動負債']
      return {
        q: [`在財務狀況表中，下列項目應歸入哪一類？\n\n「${item}」`,
            `Under which heading should the following appear in a statement of financial position?\n\n"${itemEn}"`],
        ans,
        wrong: all.filter((x) => x !== ans).slice(0, 3) as [string, string, string],
        e: [`分類只需連問兩條：第一，這是企業【擁有】的資源，還是【欠人】的責任？前者是資產，後者是負債。第二，它會在【一年之內】變現或清償嗎？會的是流動，不會的是非流動。本項為「${item}」，故屬${ans}。考生最常在第二問失手：把用足幾年的設備當成流動資產，或把三個月內到期的欠款當成非流動負債 —— 判斷的是【時間】，不是金額大小。`,
            `Classification needs two questions in order. First: is this something the business *owns* or something it *owes*? Owned items are assets, owed items liabilities. Second: will it be turned into cash or settled *within one year*? If yes it is current, if no it is non-current. Here the item is "${itemEn}", so it belongs under ${ansEn}. Most marks are lost on the second question — treating equipment used for years as current, or a debt due in three months as non-current. What decides it is the *timing*, not the size of the amount.`],
      }
    },
  },

  // ── 利息 10（6 易 + 4 中，為零易題的課題補底）──────────────────────────
  {
    key: 'bafs_principal_from_simple_interest', topic: T.int[0], topicZh: T.int[1], topicEn: T.int[2], diff: 'basic', n: 6,
    gen: (i) => {
      const { i: interest, r, n } = I1[i]
      const ans = interest / ((r / 100) * n)
      return {
        q: [`某筆存款按單利計息，年利率 ${r}%，存滿 ${n} 年後共得利息 \\$${interest}。求原本的本金。`,
            `A deposit earns simple interest at ${r}% a year. After ${n} years the interest received totals \\$${interest}. Find the original principal.`],
        ans: `\\$${money(ans)}`,
        wrong: [`\\$${money(interest / (r / 100))}`, `\\$${money(interest * (r / 100) * n)}`, `\\$${money(interest * n)}`],
        e: [`單利公式為：利息 = 本金 × 年利率 × 年期。已知利息求本金，把公式倒轉：本金 = ${interest} ÷ (${r}% × ${n}) = \\$${money(ans)}。可以代回檢查：${money(ans)} × ${r}% × ${n} = \\$${money(interest)}，與題目相符。漏了年期得 \\$${money(interest / (r / 100))}，等於當作只存了一年。第二項把除號當成乘號，所得數值遠小於利息本身，明顯不合理 —— 本金必定大於它所產生的利息。最後一項只乘年期而漏了利率。`,
            `Simple interest is interest = principal × rate × years. Rearranging to find the principal: ${interest} ÷ (${r}% × ${n}) = \\$${money(ans)}. Check by substituting back: ${money(ans)} × ${r}% × ${n} = \\$${money(interest)}, which matches. Omitting the number of years gives \\$${money(interest / (r / 100))}, as if only one year had elapsed. The second option multiplies where it should divide and returns a figure far smaller than the interest itself — impossible, since a principal always exceeds the interest it earns. The last option applies the years but drops the rate.`],
      }
    },
  },
  {
    key: 'bafs_compound_vs_simple', topic: T.int[0], topicZh: T.int[1], topicEn: T.int[2], diff: 'intermediate', n: 4,
    gen: (i) => {
      const { p, r, n } = I2[i]
      const comp = p * Math.pow(1 + r / 100, n) - p
      const simple = p * (r / 100) * n
      const ans = comp - simple
      return {
        q: [`本金 \\$${p}，年利率 ${r}%，存 ${n} 年。若改用【每年複利】而非單利計息，${n} 年後所得利息會多出多少？`,
            `\\$${p} is invested for ${n} years at ${r}% a year. How much more interest is earned under *annual compounding* than under simple interest?`],
        ans: `\\$${money(ans)}`,
        wrong: [`\\$${money(comp)}`, `\\$${money(p * Math.pow(1 + r / 100, n))}`, `\\$${money(simple)}`],
        e: [`分兩邊計，再相減。複利利息 = ${p} × (1 + ${r}%)^${n} − ${p} = \\$${money(comp)}；單利利息 = ${p} × ${r}% × ${n} = \\$${money(simple)}。差額 = \\$${money(ans)}。多出來的部分，來源是複利之下【上一年的利息本身也會生息】，而單利永遠只以原本金計算。答 \\$${money(comp)} 的停在複利利息本身，未有作差；答 \\$${money(p * Math.pow(1 + r / 100, n))} 的更連本金也算了進去 —— 那是本利和而非利息。最後一項答的是單利利息。題目問「多出多少」，答案必定是一個差額。`,
            `Work out both sides, then subtract. Compound interest = ${p} × (1 + ${r}%)^${n} − ${p} = \\$${money(comp)}; simple interest = ${p} × ${r}% × ${n} = \\$${money(simple)}. The difference is \\$${money(ans)}. The extra arises because under compounding *the previous year's interest itself earns interest*, whereas simple interest is always computed on the original principal alone. Answering \\$${money(comp)} stops at the compound interest without subtracting; \\$${money(p * Math.pow(1 + r / 100, n))} also includes the principal and is the amount, not the interest. The last option gives the simple interest. The question asks "how much more", so the answer must be a difference.`],
      }
    },
  },

  // ── 折舊 7（6 易 + 1 難，為 13 條全中的課題補回兩端）────────────────────
  {
    key: 'bafs_reducing_balance_y1', topic: T.dep[0], topicZh: T.dep[1], topicEn: T.dep[2], diff: 'basic', n: 6,
    gen: (i) => {
      const { c, r } = D1[i]
      const ans = c * (r / 100)
      return {
        q: [`某機器成本 \\$${c}，按【遞減餘額法】以每年 ${r}% 計提折舊。求第一年的折舊額。`,
            `A machine costing \\$${c} is depreciated by the *reducing balance* method at ${r}% a year. Find the depreciation for the first year.`],
        ans: `\\$${money(ans)}`,
        wrong: [`\\$${money(c / r)}`, `\\$${money((c - ans) * (r / 100))}`, `\\$${money(c - ans)}`],
        e: [`遞減餘額法首年以【成本】為基數：${c} × ${r}% = \\$${money(ans)}。要留意首年【不需】扣除殘值 —— 這是遞減餘額法與直線法最大的分別：直線法先把殘值扣走再攤分，遞減餘額法則直接對帳面淨值計算，殘值只作停止折舊的下限。\\$${money((c - ans) * (r / 100))} 是第二年的折舊額（基數已變成帳面淨值），錯在提早了一年。\\$${money(c - ans)} 是首年年末的帳面淨值，不是折舊額本身。第一項把折舊率當成年期來除。`,
            `Under the reducing balance method the first year is charged on *cost*: ${c} × ${r}% = \\$${money(ans)}. Note that residual value is *not* deducted first — this is the key difference from the straight-line method, which spreads cost less residual value evenly, whereas reducing balance charges a percentage of carrying amount and treats residual value only as a floor. \\$${money((c - ans) * (r / 100))} is the second year's charge, computed on the reduced carrying amount, so it is one year early. \\$${money(c - ans)} is the carrying amount at the end of year one, not the depreciation. The first option divides by the rate as though it were a number of years.`],
      }
    },
  },
  {
    key: 'bafs_partial_year_depreciation', topic: T.dep[0], topicZh: T.dep[1], topicEn: T.dep[2], diff: 'hard', n: 1,
    gen: () => {
      const { c, s, y, m } = D2[0]
      const full = (c - s) / y
      const ans = (full * m) / 12
      return {
        q: [`某公司於年度開始後第 ${12 - m + 1} 個月購入一部設備，成本 \\$${c}，估計殘值 \\$${s}，可用年期 ${y} 年，按直線法折舊。該設備於【購入當年】只持有 ${m} 個月。\n\n求該公司於購入當年應為此設備計提的折舊額。`,
            `A company bought equipment in month ${12 - m + 1} of its financial year: cost \\$${c}, residual value \\$${s}, useful life ${y} years, straight-line basis. It was therefore held for only ${m} months in the year of purchase.\n\nFind the depreciation to be charged in that year.`],
        ans: `\\$${money(ans)}`,
        wrong: [`\\$${money(full)}`, `\\$${money((c * m) / (y * 12))}`, `\\$${money((c - s) / y / m)}`],
        e: [`分兩步。先求全年折舊：(${c} − ${s}) ÷ ${y} = \\$${money(full)}。再按實際持有月數比例分攤：${money(full)} × ${m} ÷ 12 = \\$${money(ans)}。兩個關卡缺一不可 —— 忘記按月分攤得 \\$${money(full)}，等於當作年初已購入，是本題最主要的失分位；忘記扣除殘值則得 \\$${money((c * m) / (y * 12))}，因為直線法攤分的是【可折舊金額】而非成本全數。第三項把月數當成除數，把折舊額愈算愈細，方向完全相反。實務上此類題目亦可能改為「按整月計，購入當月計一個月」，作答時應留意題目對月份的界定。`,
            `Two steps. First the full-year charge: (${c} − ${s}) ÷ ${y} = \\$${money(full)}. Then pro-rate by months held: ${money(full)} × ${m} ÷ 12 = \\$${money(ans)}. Both gates matter — omitting the pro-rating gives \\$${money(full)} and assumes the asset was owned from day one, the main trap here; omitting the residual value gives \\$${money((c * m) / (y * 12))}, since the straight-line method spreads the *depreciable amount*, not the full cost. The third option divides by the months instead of multiplying, driving the charge the wrong way entirely. In practice a question may instead say "count the month of purchase as a full month", so always check how the months are defined.`],
      }
    },
  },

  // ── 成本與定價 6（4 易 + 2 中，為零易題的課題補底）─────────────────────
  {
    key: 'bafs_markup_rate', topic: T.cost[0], topicZh: T.cost[1], topicEn: T.cost[2], diff: 'basic', n: 4,
    gen: (i) => {
      const { cost, price } = C1[i]
      const ans = ((price - cost) / cost) * 100
      return {
        q: [`某商品的成本為 \\$${cost}，售價為 \\$${price}。求其加成率（以成本為基數的百分比）。`,
            `A product costs \\$${cost} and sells for \\$${price}. Find the mark-up rate (as a percentage of cost).`],
        ans: `${num(ans)}%`,
        wrong: [`${num(((price - cost) / price) * 100)}%`, `${num((price / cost) * 100)}%`, `${num((cost / price) * 100)}%`],
        e: [`加成率以【成本】為基數：(${price} − ${cost}) ÷ ${cost} × 100% = ${num(ans)}%。第一個干擾項 ${num(((price - cost) / price) * 100)}% 是【毛利率】，它以售價為基數 —— 同一件貨品，同一個毛利額，兩個比率的數值必定不同，而且加成率永遠較高，因為分母較細。混淆這兩者是本課題最集中的失分位，判斷方法只有一句：題目說「以成本為基數」就是加成率，說「佔售價」就是毛利率。餘下兩項把售價與成本直接相除，所得是倍數而非加成的比率。`,
            `Mark-up is measured against *cost*: (${price} − ${cost}) ÷ ${cost} × 100% = ${num(ans)}%. The first distractor, ${num(((price - cost) / price) * 100)}%, is the *gross profit margin*, which is measured against selling price. For the same item and the same money profit the two percentages must differ, and mark-up is always the larger because its denominator is smaller. Confusing the two is where most marks go on this topic, and the test is one line: "as a percentage of cost" means mark-up, "as a percentage of sales" means margin. The remaining options divide price by cost outright, giving a multiple rather than a rate of mark-up.`],
      }
    },
  },
  {
    key: 'bafs_markup_to_margin', topic: T.cost[0], topicZh: T.cost[1], topicEn: T.cost[2], diff: 'intermediate', n: 2,
    gen: (i) => {
      const { mk } = C2[i]
      const ans = (mk / (100 + mk)) * 100
      return {
        q: [`某零售商一律按成本加成 ${mk}% 定價。求該商品的毛利率（即毛利佔售價的百分比）。`,
            `A retailer prices all goods at cost plus ${mk}%. Find the gross profit margin (gross profit as a percentage of selling price).`],
        ans: `${num(ans)}%`,
        wrong: [`${mk}%`, `${num(((100 + mk) / 100) * 100)}%`, `${num((100 / (100 + mk)) * 100)}%`],
        e: [`設成本為 100，則售價為 ${100 + mk}，毛利為 ${mk}。毛利率以售價為基數：${mk} ÷ ${100 + mk} × 100% = ${num(ans)}%。換言之，加成率 ${mk}% 對應的毛利率必定【細過】${mk}%，因為分母由成本 100 換成了售價 ${100 + mk}。直接答 ${mk}% 是把加成率當成毛利率，是本題設下的主要陷阱。${num(((100 + mk) / 100) * 100)}% 是售價相對成本的百分比，並非任何一種利潤率。最後一項 ${num((100 / (100 + mk)) * 100)}% 是成本佔售價的比例，剛好是毛利率的補數 —— 兩者相加為 100%，可用作檢查。`,
            `Take cost as 100; then selling price is ${100 + mk} and gross profit is ${mk}. Margin is measured on selling price: ${mk} ÷ ${100 + mk} × 100% = ${num(ans)}%. So a mark-up of ${mk}% always corresponds to a *smaller* margin, because the denominator moves from cost 100 to price ${100 + mk}. Answering ${mk}% treats mark-up as margin and is the main trap. ${num(((100 + mk) / 100) * 100)}% expresses price as a percentage of cost and is neither profit measure. The last option, ${num((100 / (100 + mk)) * 100)}%, is cost as a percentage of sales — the complement of the margin, and the two sum to 100%, which makes a useful check.`],
      }
    },
  },
]

emit('bafs', 'bafs_rep', archs, 'scripts/qbank/drafts/bafs-replace.json')
