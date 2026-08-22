// ============================================================================
// replace-economics.mts —— 經濟科模板替換 84 條
// ----------------------------------------------------------------------------
// 被替換的克隆組（每組封頂 6 條）：總收入減總成本求利潤 21、價格乘銷量求總收入
// 18、總成本除產量求平均成本 14、由兩個百分比求需求彈性 10，餘此類推。全部是
// 「把兩個數代入一條公式」，換數字不換問法。
//
// ── 紅線（憲章 §5 及 _gate.mjs 之 ECON_REDLINES）─────────────────────────
//   · 收入彈性／交叉彈性／點彈性 —— 不在 EDB 課程及評估指引範圍，全批不得出現。
//     本批只用【需求價格彈性】與【供給價格彈性】，兩者均在課程之內。
//   · 「共用品」不得寫作「公共財」；「企業家職能」不得寫作「企業家才能」。
//   · 本科屬 CURRENCY_ONLY：所有金額的貨幣符號必須轉義為 \$，否則 KaTeX 會把
//     兩個金額之間的文字當成數學模式來排版。本檔一律不用 $…$ 數學語法。
//
// ── 公式（人手覆核點）─────────────────────────────────────────────────────
//   利潤 = 總收入 − 總成本；平均成本 = 總成本 ÷ 產量
//   邊際成本 = 總成本的增量 ÷ 產量的增量
//   經濟利潤 = 會計利潤 − 隱含成本
//   短期停業點：售價低於平均可變成本時停業
//   需求價格彈性（絕對值）= 需求量變動百分比 ÷ 價格變動百分比
//   供給價格彈性 = 供給量變動百分比 ÷ 價格變動百分比
//   失業率 = 失業人數 ÷ 勞動人口 × 100%
//   實質變動 ≈ 名義變動 − 通脹率
//   生產者剩餘（線性供給）= 底 × 高 ÷ 2
// ============================================================================
import { emit, num, money, type Arch } from './_archetype.mts'

const T = {
  firm:  ['firm_production', '廠商與生產', 'The Firm and Production'],
  ds:    ['demand_supply',   '需求與供給',  'Demand and Supply'],
  elas:  ['elasticity',      '彈性',        'Elasticity'],
  macro: ['macroeconomics',  '宏觀經濟',    'Macroeconomics'],
  mkt:   ['market',          '市場效率',    'Market Efficiency'],
} as const

const P1 = [{ ac: 12, q: 5 }, { ac: 8, q: 12 }, { ac: 25, q: 4 }, { ac: 6, q: 30 }, { ac: 15, q: 8 }, { ac: 40, q: 3 }]
const P2 = [{ q1: 4, c1: 60, q2: 6, c2: 96 }, { q1: 8, c1: 200, q2: 10, c2: 260 }, { q1: 2, c1: 30, q2: 4, c2: 54 },
            { q1: 6, c1: 150, q2: 8, c2: 190 }, { q1: 1, c1: 20, q2: 3, c2: 44 }, { q1: 10, c1: 300, q2: 12, c2: 336 }]
const P3 = [{ rev: 500, exp: 320, imp: 90 }, { rev: 1200, exp: 800, imp: 250 }, { rev: 260, exp: 140, imp: 60 },
            { rev: 900, exp: 600, imp: 400 }, { rev: 75, exp: 40, imp: 25 }, { rev: 2000, exp: 1500, imp: 300 }]
const P4 = [{ p: 18, avc: 20, afc: 6 }, { p: 25, avc: 22, afc: 5 }, { p: 9, avc: 12, afc: 4 },
            { p: 40, avc: 35, afc: 10 }, { p: 14, avc: 14, afc: 3 }, { p: 7, avc: 9, afc: 2 }]
const P5 = [{ fc: 600, vc: 12, q: 40 }, { fc: 1500, vc: 8, q: 100 }, { fc: 250, vc: 15, q: 20 },
            { fc: 900, vc: 5, q: 60 }, { fc: 400, vc: 20, q: 15 }, { fc: 3000, vc: 30, q: 50 }]
const P6 = [{ tc: 800, fc: 200, q: 25 }, { tc: 1000, fc: 400, q: 40 }, { tc: 540, fc: 60, q: 30 },
            { tc: 2400, fc: 900, q: 50 }, { tc: 350, fc: 110, q: 12 }]
const P7 = [{ p: 6, qd: 90, qs: 50 }, { p: 12, qd: 40, qs: 70 }, { p: 3, qd: 200, qs: 120 },
            { p: 20, qd: 55, qs: 85 }, { p: 8, qd: 64, qs: 64 }, { p: 15, qd: 30, qs: 30 }]
// 場景刻意避開題庫已有的「替代品／互補品價格上升」與「派發現金津貼（正常商品）」
// —— 該兩條已在庫，重寫等於複製。改用原料、技術、稅、補貼、人口五項非價格因素，
// 另加一條「商品本身價格變動」，用以分辨「需求量變動」與「需求變動」。
const P8 = [
  { z: '生產該商品所需的原料價格上升', zEn: 'the price of a raw material used to make the good rises', side: 's', dir: -1 },
  { z: '生產技術改良，令每單位生產成本下降', zEn: 'better technology lowers the unit cost of production', side: 's', dir: 1 },
  { z: '該商品本身的市場價格下跌', zEn: 'the market price of the good itself falls', side: 'q', dir: 1 },
  { z: '政府向該商品的生產者徵收從量稅', zEn: 'the government imposes a per-unit tax on producers of the good', side: 's', dir: -1 },
  { z: '政府按產量向該商品的生產者發放補貼', zEn: 'the government pays producers a per-unit subsidy', side: 's', dir: 1 },
  { z: '該區人口增長，購買該商品的消費者人數上升', zEn: 'population growth raises the number of consumers buying the good', side: 'd', dir: 1 },
]
const P9 = [{ dp: 10, dq: 25 }, { dp: 20, dq: 10 }, { dp: 5, dq: 15 }, { dp: 12, dq: 3 }, { dp: 8, dq: 2 }, { dp: 4, dq: 12 }]
const P10 = [{ e: 0.4, up: true }, { e: 2.5, up: true }, { e: 1.6, up: false }, { e: 0.25, up: false }, { e: 3, up: true }, { e: 0.5, up: false }]
const P11 = [{ dp: 10, dq: 30 }, { dp: 20, dq: 30 }, { dp: 5, dq: 20 }, { dp: 25, dq: 5 }]
const P12 = [{ lf: 4000, un: 200 }, { lf: 3800, un: 152 }, { lf: 5000, un: 350 },
             { lf: 2500, un: 75 }, { lf: 6400, un: 448 }, { lf: 1200, un: 60 }]
const P13 = [{ nom: 5, inf: 3 }, { nom: 2, inf: 4.5 }, { nom: 8, inf: 2.5 }, { nom: 6, inf: 6 }, { nom: 1.5, inf: 3.5 }]
const P14 = [{ p: 10, pmin: 4, q: 30 }, { p: 25, pmin: 15, q: 12 }, { p: 6, pmin: 2, q: 50 }, { p: 40, pmin: 10, q: 8 }]

const archs: Arch[] = [
  // ── 廠商與生產 35 ────────────────────────────────────────────────────────
  {
    key: 'econ_tc_from_ac', topic: T.firm[0], topicZh: T.firm[1], topicEn: T.firm[2], diff: 'basic', n: 6,
    gen: (i) => {
      const { ac, q } = P1[i]
      const ans = ac * q
      return {
        q: [`某廠商生產 ${q} 單位產品，平均成本為每單位 \\$${ac}。求其總成本。`,
            `A firm produces ${q} units at an average cost of \\$${ac} per unit. Find its total cost.`],
        ans: `\\$${money(ans)}`,
        wrong: [`\\$${money(ac / q)}`, `\\$${money(ac)}`, `\\$${money(ac * q - q)}`],
        e: [`平均成本是總成本攤分到每一單位之後的數值，故總成本 = 平均成本 × 產量 = ${ac} × ${q} = \\$${money(ans)}。把兩者相除得 \\$${money(ac / q)}，是把「平均成本 = 總成本 ÷ 產量」這條式倒轉使用的結果；由定義可以立即察覺不對，因為總成本必定不小於平均成本。答 \\$${money(ac)} 的學生把「每單位成本」直接當作總成本，等於當作只生產了一單位。餘下一項多減了一次產量，並無對應的經濟意義。`,
            `Average cost is total cost spread over each unit, so total cost = average cost × output = ${ac} × ${q} = \\$${money(ans)}. Dividing instead gives \\$${money(ac / q)}, which inverts the definition — total cost can never be smaller than average cost. Choosing \\$${money(ac)} treats the per-unit figure as the total, i.e. assumes only one unit was made. The remaining option subtracts the output once more, which has no economic meaning.`],
      }
    },
  },
  {
    key: 'econ_marginal_cost', topic: T.firm[0], topicZh: T.firm[1], topicEn: T.firm[2], diff: 'basic', n: 6,
    gen: (i) => {
      const { q1, c1, q2, c2 } = P2[i]
      const ans = (c2 - c1) / (q2 - q1)
      return {
        q: [`某廠商生產 ${q1} 單位時總成本為 \\$${c1}；產量增至 ${q2} 單位時總成本為 \\$${c2}。求這段增產的邊際成本（每單位）。`,
            `A firm's total cost is \\$${c1} at ${q1} units and \\$${c2} at ${q2} units. Find the marginal cost per unit over this range.`],
        ans: `\\$${money(ans)}`,
        wrong: [`\\$${money(c2 - c1)}`, `\\$${money(c2 / q2)}`, `\\$${money((c2 - c1) / q2)}`],
        e: [`邊際成本是每【增加一單位】產量所引致的總成本增量，故要把成本的增量除以產量的增量：(${c2} − ${c1}) ÷ (${q2} − ${q1}) = \\$${money(ans)}。答 \\$${money(c2 - c1)} 的學生只求了成本增量而忘記除以增加的單位數，當產量只增加一單位時兩者恰好相同，因而容易養成錯誤習慣。\\$${money(c2 / q2)} 求的是新產量下的平均成本，與邊際成本並非同一概念。最後一項除以總產量而非產量的增量。`,
            `Marginal cost is the rise in total cost per *additional* unit, so divide the change in cost by the change in output: (${c2} − ${c1}) ÷ (${q2} − ${q1}) = \\$${money(ans)}. Answering \\$${money(c2 - c1)} stops at the cost increase and forgets the division — the two coincide only when output rises by exactly one unit, which is how the habit forms. \\$${money(c2 / q2)} is the average cost at the new output, a different concept. The last option divides by total output rather than the change in output.`],
      }
    },
  },
  {
    key: 'econ_economic_profit', topic: T.firm[0], topicZh: T.firm[1], topicEn: T.firm[2], diff: 'intermediate', n: 6,
    gen: (i) => {
      const { rev, exp, imp } = P3[i]
      const ans = rev - exp - imp
      return {
        q: [`陳先生辭去年薪 \\$${imp} 的工作，自行開設小店。該店一年的收入為 \\$${rev}，需要以現金支付的各項開支為 \\$${exp}。\n\n求該店一年的經濟利潤。`,
            `Mr Chan gave up a job paying \\$${imp} a year to open a shop. In one year the shop takes in \\$${rev} and pays out \\$${exp} in cash expenses.\n\nFind the shop's economic profit for the year.`],
        ans: `\\$${money(ans)}`,
        wrong: [`\\$${money(rev - exp)}`, `\\$${money(rev - imp)}`, `\\$${money(rev - exp + imp)}`],
        e: [`經濟利潤除了明確支付的成本之外，還要扣除隱含成本 —— 即把資源投入本業而放棄的最高代價。此處放棄的年薪 \\$${imp} 正是隱含成本，故經濟利潤 = ${rev} − ${exp} − ${imp} = \\$${money(ans)}。答 \\$${money(rev - exp)} 的是會計利潤，只計現金開支，這是本題最主要的失分位。\\$${money(rev - imp)} 漏了現金開支。最後一項把放棄的年薪當作收入加回去，方向剛好相反。`,
            `Economic profit deducts implicit cost — the best alternative given up — as well as explicit cost. The \\$${imp} salary forgone is that implicit cost, so economic profit = ${rev} − ${exp} − ${imp} = \\$${money(ans)}. Answering \\$${money(rev - exp)} gives accounting profit, which counts cash outlays only; this is the main trap. \\$${money(rev - imp)} omits the cash expenses. The last option adds the forgone salary as if it were revenue, reversing its sign.`],
      }
    },
  },
  {
    key: 'econ_shutdown_point', topic: T.firm[0], topicZh: T.firm[1], topicEn: T.firm[2], diff: 'intermediate', n: 6,
    gen: (i) => {
      const { p, avc, afc } = P4[i]
      const cont = p >= avc
      const zh = cont
        ? '應繼續生產，因為售價不低於平均可變成本，每賣一件仍能為固定成本作出貢獻'
        : '應停止生產，因為售價低於平均可變成本，每多賣一件反而擴大虧損'
      const en = cont
        ? 'Keep producing: price is not below average variable cost, so each unit still contributes towards fixed cost'
        : 'Shut down: price is below average variable cost, so each extra unit widens the loss'
      return {
        q: [`某廠商目前售價為每件 \\$${p}，平均可變成本為 \\$${avc}，平均固定成本為 \\$${afc}。\n\n就短期而言，該廠商應否繼續生產？`,
            `A firm currently sells at \\$${p} per unit, with average variable cost \\$${avc} and average fixed cost \\$${afc}.\n\nIn the short run, should it keep producing?`],
        ans: zh,
        wrong: [
          cont ? '應停止生產，因為售價低於平均總成本，繼續生產必定虧損' : '應繼續生產，因為售價高於平均固定成本',
          '應停止生產，因為固定成本在短期內仍須繳付',
          '無法判斷，因為題目沒有提供產量',
        ],
        ansEn: en,
        wrongEn: [
          cont
            ? 'Shut down: price is below average total cost, so producing must run at a loss'
            : 'Keep producing: price is above average fixed cost',
          'Shut down: fixed cost still has to be paid in the short run',
          'Cannot be determined: the question gives no level of output',
        ],
        e: [`短期的停業準則只比較售價與【平均可變成本】：固定成本在短期內無論生產與否都要繳付，故不影響這個決定。此處售價 \\$${p} ${cont ? '不低於' : '低於'} 平均可變成本 \\$${avc}，所以${cont ? '應繼續生產 —— 每賣一件所得可抵回可變成本並有餘額貼補固定成本，虧損比停業時為小' : '應停止生產 —— 每多賣一件連可變成本也收不回，虧損比停業時更大'}。用平均總成本作準則的干擾項是最常見的錯誤：售價低於平均總成本只代表有虧損，並不代表應該停業。至於固定成本一項，正因它無論如何都要付，才【不應】納入短期決定。產量並非判斷所需的資料。`,
            `The short-run shutdown rule compares price with *average variable cost* only: fixed cost must be paid whether or not the firm produces, so it cannot affect the decision. Here \\$${p} is ${cont ? 'not below' : 'below'} the average variable cost of \\$${avc}, so the firm should ${cont ? 'keep producing — each unit covers its variable cost and leaves something towards fixed cost, giving a smaller loss than shutting down' : 'shut down — each extra unit fails even to cover its variable cost, giving a larger loss than shutting down'}. Using average total cost is the commonest error: a price below average total cost means a loss, not a reason to shut. Fixed cost is excluded precisely because it is payable either way, and output is not needed for this judgement.`],
      }
    },
  },
  {
    key: 'econ_total_cost_split', topic: T.firm[0], topicZh: T.firm[1], topicEn: T.firm[2], diff: 'basic', n: 6,
    gen: (i) => {
      const { fc, vc, q } = P5[i]
      const ans = fc + vc * q
      return {
        q: [`某工場每月的固定成本為 \\$${fc}，每生產一件產品的可變成本為 \\$${vc}。該月生產了 ${q} 件。\n\n求該月的總成本。`,
            `A workshop has monthly fixed cost \\$${fc} and variable cost \\$${vc} per unit. It produced ${q} units this month.\n\nFind the total cost for the month.`],
        ans: `\\$${money(ans)}`,
        wrong: [`\\$${money(vc * q)}`, `\\$${money(fc + vc)}`, `\\$${money((fc + vc) * q)}`],
        e: [`總成本 = 固定成本 + 可變成本總額 = ${fc} + ${vc} × ${q} = \\$${money(ans)}。可變成本要先乘產量才是總額，這一步不可省。答 \\$${money(vc * q)} 漏了固定成本 —— 固定成本雖然不隨產量改變，但仍然是成本。\\$${money(fc + vc)} 只把單位可變成本加了一次，等於當作只生產了一件。最後一項把固定成本也乘上產量，等於當作每生產一件就要重新支付一次固定成本，與「固定」的定義相違。`,
            `Total cost = fixed cost + total variable cost = ${fc} + ${vc} × ${q} = \\$${money(ans)}. The per-unit variable cost must be multiplied by output first. Answering \\$${money(vc * q)} drops the fixed cost, which does not vary with output but is a cost nonetheless. \\$${money(fc + vc)} adds the variable cost only once, as if a single unit were made. The last option multiplies fixed cost by output too, implying it is paid afresh for every unit — which contradicts the meaning of "fixed".`],
      }
    },
  },
  {
    key: 'econ_avc_from_tc', topic: T.firm[0], topicZh: T.firm[1], topicEn: T.firm[2], diff: 'intermediate', n: 5,
    gen: (i) => {
      const { tc, fc, q } = P6[i]
      const ans = (tc - fc) / q
      return {
        q: [`某廠商生產 ${q} 單位時，總成本為 \\$${tc}，其中固定成本為 \\$${fc}。求其平均可變成本。`,
            `At an output of ${q} units a firm's total cost is \\$${tc}, of which \\$${fc} is fixed cost. Find its average variable cost.`],
        ans: `\\$${money(ans)}`,
        wrong: [`\\$${money(tc / q)}`, `\\$${money(fc / q)}`, `\\$${money(tc - fc)}`],
        e: [`先把可變成本總額分離出來：${tc} − ${fc} = \\$${money(tc - fc)}，再除以產量 ${q}，得平均可變成本 \\$${money(ans)}。答 \\$${money(tc / q)} 求的是平均總成本，未有先扣除固定成本 —— 這是本題最主要的失分位，兩者只在固定成本為零時才相等。\\$${money(fc / q)} 求的是平均固定成本。最後一項停在可變成本總額，忘記除以產量，由「平均」二字即可察覺尚欠一步。`,
            `First isolate total variable cost: ${tc} − ${fc} = \\$${money(tc - fc)}, then divide by output ${q} to get \\$${money(ans)}. Answering \\$${money(tc / q)} gives average *total* cost, skipping the deduction of fixed cost — the main trap, since the two coincide only when fixed cost is zero. \\$${money(fc / q)} is average fixed cost, and the last option stops at total variable cost; the word "average" signals that a division is still outstanding.`],
      }
    },
  },

  // ── 需求與供給 18 ────────────────────────────────────────────────────────
  {
    key: 'econ_surplus_shortage', topic: T.ds[0], topicZh: T.ds[1], topicEn: T.ds[2], diff: 'basic', n: 6,
    gen: (i) => {
      const { p, qd, qs } = P7[i]
      const gap = qs - qd
      const zh = gap > 0 ? `出現過剩 ${gap} 件，價格將趨向下跌` : gap < 0 ? `出現短缺 ${-gap} 件，價格將趨向上升` : '市場處於均衡，價格沒有變動的壓力'
      const en = gap > 0 ? `a surplus of ${gap} units; price will tend to fall` : gap < 0 ? `a shortage of ${-gap} units; price will tend to rise` : 'the market is in equilibrium; there is no pressure on price'
      return {
        q: [`在價格為 \\$${p} 時，某商品的需求量為 ${qd} 件，供給量為 ${qs} 件。\n\n此時市場的狀況及價格的變動趨勢是甚麼？`,
            `At a price of \\$${p}, quantity demanded of a good is ${qd} units and quantity supplied is ${qs} units.\n\nWhat is the market condition and the likely movement of price?`],
        ans: zh,
        wrong: [
          gap > 0 ? `出現短缺 ${gap} 件，價格將趨向上升` : gap < 0 ? `出現過剩 ${-gap} 件，價格將趨向下跌` : `出現短缺 ${qd} 件，價格將趨向上升`,
          gap !== 0 ? `出現過剩 ${qs + qd} 件，價格將趨向下跌` : `出現過剩 ${qs + qd} 件，價格將趨向下跌`,
          '需求曲線將向左移動，直至市場回復均衡',
        ],
        ansEn: en,
        wrongEn: [
          gap > 0 ? `a shortage of ${gap} units; price will tend to rise` : gap < 0 ? `a surplus of ${-gap} units; price will tend to fall` : `a shortage of ${qd} units; price will tend to rise`,
          `a surplus of ${qs + qd} units; price will tend to fall`,
          'the demand curve will shift left until the market returns to equilibrium',
        ],
        e: [`比較同一價格下的兩個數量：供給量 ${qs} 件、需求量 ${qd} 件，${gap > 0 ? `供過於求，過剩 ${gap} 件；賣方為清貨而減價，故價格趨跌` : gap < 0 ? `求過於供，短缺 ${-gap} 件；買方競相出價，故價格趨升` : '兩者相等，市場已在均衡，價格沒有變動的壓力'}。把過剩與短缺的方向調轉，是本題最常見的錯誤，記法是：貨多過人要就跌價。第二個干擾項把兩個數量相加而非相減，所得並非任何有意義的數量。最後一項混淆了兩件事：此處調整的是【價格】沿着固定的曲線移動，需求曲線本身並不會因為價格而移動。`,
            `Compare the two quantities at the same price: supply ${qs}, demand ${qd}. ${gap > 0 ? `Supply exceeds demand by ${gap} units, so sellers cut price to clear stock and price tends to fall.` : gap < 0 ? `Demand exceeds supply by ${-gap} units, so buyers bid price up and price tends to rise.` : 'They are equal, so the market is already in equilibrium and there is no pressure on price.'} Reversing surplus and shortage is the commonest error. The second distractor adds the quantities instead of subtracting, which yields no meaningful figure. The last option confuses two things: it is *price* that adjusts along fixed curves — the demand curve itself does not shift because of a price change.`],
      }
    },
  },
  {
    key: 'econ_shift_vs_movement', topic: T.ds[0], topicZh: T.ds[1], topicEn: T.ds[2], diff: 'basic', n: 6,
    gen: (i) => {
      const { z, zEn, side, dir } = P8[i]
      const curve = side === 'd' ? '需求' : '供給'
      const move = dir > 0 ? '右' : '左'
      const pDir = side === 'd' ? (dir > 0 ? '上升' : '下跌') : (dir > 0 ? '下跌' : '上升')
      const qDir = dir > 0 ? '增加' : '減少'
      const other = side === 'd' ? '供給' : '需求'
      const zh = side === 'q'
        ? '需求量沿原有的需求曲線增加；需求曲線本身並不移位，均衡點只是沿曲線滑動'
        : `${curve}${qDir}：整條${curve}曲線向${move}移，均衡價格${pDir}而均衡成交量${qDir}`
      // 英文版逐項對應：曲線名稱、移動方向、價量方向都要按同一組條件生成，
      // 否則兩種介面會描述不同的情況。
      const curveEn = side === 'd' ? 'demand' : 'supply'
      const otherEn = side === 'd' ? 'supply' : 'demand'
      const moveEn = dir > 0 ? 'right' : 'left'
      const verbEn = dir > 0 ? 'increases' : 'decreases'
      const pDirEn = pDir === '上升' ? 'rises' : 'falls'
      const qDirEn = dir > 0 ? 'rises' : 'falls'
      const cap = (w: string) => w[0].toUpperCase() + w.slice(1)
      return {
        q: [`其他情況不變下，${z}。\n\n這對該商品的市場有甚麼影響？`,
            `Other things being equal, ${zEn}.\n\nWhat effect does this have on the market for the good?`],
        ans: zh,
        wrong: [
          side === 'q'
            ? '需求增加：整條需求曲線向右移，均衡價格上升而均衡成交量增加'
            : `${other}${qDir}：整條${other}曲線向${move}移，均衡價格${side === 'd' ? (dir > 0 ? '下跌' : '上升') : (dir > 0 ? '上升' : '下跌')}而均衡成交量${qDir}`,
          side === 'q'
            ? '供給減少：整條供給曲線向左移，均衡價格上升而均衡成交量減少'
            : `${curve}${dir > 0 ? '減少' : '增加'}：整條${curve}曲線向${dir > 0 ? '左' : '右'}移，均衡價格${pDir === '上升' ? '下跌' : '上升'}而均衡成交量${dir > 0 ? '減少' : '增加'}`,
          '需求曲線與供給曲線同時向右移，均衡價格因兩者互相抵銷而維持不變',
        ],
        ansEn: side === 'q'
          ? 'Quantity demanded increases along the existing demand curve; the curve itself does not shift, the equilibrium point merely slides along it'
          : `${cap(curveEn)} ${verbEn}: the whole ${curveEn} curve shifts ${moveEn}, so equilibrium price ${pDirEn} and equilibrium quantity ${qDirEn}`,
        wrongEn: [
          side === 'q'
            ? 'Demand increases: the whole demand curve shifts right, so equilibrium price rises and equilibrium quantity rises'
            : `${cap(otherEn)} ${verbEn}: the whole ${otherEn} curve shifts ${moveEn}, so equilibrium price ${side === 'd' ? (dir > 0 ? 'falls' : 'rises') : (dir > 0 ? 'rises' : 'falls')} and equilibrium quantity ${qDirEn}`,
          side === 'q'
            ? 'Supply decreases: the whole supply curve shifts left, so equilibrium price rises and equilibrium quantity falls'
            : `${cap(curveEn)} ${dir > 0 ? 'decreases' : 'increases'}: the whole ${curveEn} curve shifts ${dir > 0 ? 'left' : 'right'}, so equilibrium price ${pDirEn === 'rises' ? 'falls' : 'rises'} and equilibrium quantity ${dir > 0 ? 'falls' : 'rises'}`,
          'The demand and supply curves both shift right, and the two effects cancel so equilibrium price is unchanged',
        ],
        e: [`分辨的關鍵只有一條：改變的是【該商品本身的價格】，還是【價格以外】的因素。前者令數量沿原有曲線滑動，曲線本身不動；後者才會令整條曲線移位。${side === 'q' ? '本題所述正是商品本身的價格變動，故只有需求量沿曲線改變 —— 把它說成「需求增加」，是「需求量變動」與「需求變動」混淆的典型例子，亦是本課題最集中的失分位。' : side === 'd' ? `本題所述屬價格以外影響買方的因素（買家人數），故影響需求：整條需求曲線向${move}移，均衡價格${pDir}、成交量${qDir}。` : `本題所述屬價格以外影響賣方成本或生產條件的因素，故影響供給：整條供給曲線向${move}移，均衡價格${pDir}、成交量${qDir}。`}把受影響的一方認錯（供給當作需求，或相反），是另一個常見錯誤；判斷方法是問：這件事直接改變的，是買方的購買意願，還是賣方的生產條件。最後一項假設兩條曲線同時移動而互相抵銷，但題幹已訂明其他情況不變，只有一項因素改變。`,
            `The test is single: has the price of the good itself changed, or something other than price? The former slides quantity along an unchanged curve; only the latter shifts the whole curve. ${side === 'q' ? 'Here it is the good\u2019s own price that changes, so only quantity demanded moves along the curve. Calling this "an increase in demand" is the classic confusion between a change in quantity demanded and a change in demand, and the heaviest loss of marks on this topic.' : side === 'd' ? 'Here a non-price factor affecting buyers (the number of consumers) changes, so demand shifts and both equilibrium price and quantity move with it.' : 'Here a non-price factor affecting sellers\u2019 costs or production conditions changes, so supply shifts; equilibrium price moves opposite to the shift while quantity moves with it.'} Attributing the effect to the wrong side is the other common error \u2014 ask whether the event directly changes buyers\u2019 willingness or sellers\u2019 conditions. The final option assumes both curves move and cancel out, but the question holds all other factors constant.`],
      }
    },
  },
  {
    // 題庫現有的均衡題全部是【單一曲線】移動（供應曲線右移、颱風失收），
    // 故本原型只取【兩條曲線同時移動】的六種組合 —— 這正是 DSE 真正的難度位：
    // 其中兩種的交易量方向【無法確定】，考生最常在此硬答一個方向。
    key: 'econ_equilibrium_shift', topic: T.ds[0], topicZh: T.ds[1], topicEn: T.ds[2], diff: 'intermediate', n: 6,
    gen: (i) => {
      const cases = [
        { zh: '需求增加，同時供給減少', en: 'demand rises while supply falls', p: '上升', q: '不定' },
        { zh: '需求減少，同時供給增加', en: 'demand falls while supply rises', p: '下跌', q: '不定' },
        { zh: '需求與供給同時增加，而需求的增幅較大', en: 'both rise, with demand rising by more', p: '上升', q: '增加' },
        { zh: '需求與供給同時增加，而供給的增幅較大', en: 'both rise, with supply rising by more', p: '下跌', q: '增加' },
        { zh: '需求與供給同時減少，而需求的減幅較大', en: 'both fall, with demand falling by more', p: '下跌', q: '減少' },
        { zh: '需求與供給同時減少，而供給的減幅較大', en: 'both fall, with supply falling by more', p: '上升', q: '減少' },
      ]
      const c = cases[i]
      const flipP = c.p === '上升' ? '下跌' : '上升'
      const amb = c.q === '不定'
      const ans = amb
        ? `均衡價格必定${c.p}，但均衡交易量的變動方向不能確定`
        : `均衡價格${c.p}，均衡交易量${c.q}`
      const pEn = (x: string) => (x === '上升' ? 'rises' : 'falls')
      const qEn = (x: string) => (x === '增加' ? 'rises' : 'falls')
      // 情態動詞 must 之後要用原形：must fall，不是 must falls。
      const pBare = (x: string) => (x === '上升' ? 'rise' : 'fall')
      return {
        q: [`某商品市場同時出現以下兩項變化：${c.zh}。\n\n均衡價格與均衡交易量會怎樣變動？`,
            `In the market for a good, ${c.en}.\n\nHow do the equilibrium price and quantity change?`],
        ans,
        wrong: amb
          ? [`均衡價格${c.p}，均衡交易量增加`, `均衡價格${c.p}，均衡交易量減少`, '均衡價格與均衡交易量的變動方向均不能確定']
          : [`均衡價格${flipP}，均衡交易量${c.q}`,
             `均衡價格${c.p}，均衡交易量${c.q === '增加' ? '減少' : '增加'}`,
             `均衡價格必定${c.p}，但均衡交易量的變動方向不能確定`],
        ansEn: amb
          ? `Equilibrium price must ${pBare(c.p)}, but the direction of equilibrium quantity cannot be determined`
          : `Equilibrium price ${pEn(c.p)} and equilibrium quantity ${qEn(c.q)}`,
        wrongEn: amb
          ? [`Equilibrium price ${pEn(c.p)} and equilibrium quantity rises`,
             `Equilibrium price ${pEn(c.p)} and equilibrium quantity falls`,
             'Neither the direction of equilibrium price nor that of equilibrium quantity can be determined']
          : [`Equilibrium price ${pEn(flipP)} and equilibrium quantity ${qEn(c.q)}`,
             `Equilibrium price ${pEn(c.p)} and equilibrium quantity ${c.q === '增加' ? 'falls' : 'rises'}`,
             `Equilibrium price must ${pBare(c.p)}, but the direction of equilibrium quantity cannot be determined`],
        e: [`兩條曲線同時移動時，必須逐項判斷：某一項的方向，只有在兩條曲線【推同一個方向】時才能確定。${amb
              ? `本題之中，需求與供給對價格的影響同向（兩者都把價格推${c.p === '上升' ? '高' : '低'}），故價格${c.p}是確定的；但兩者對交易量的影響相反 —— 一邊把交易量推上，一邊把它推落，最終方向取決於哪一邊的移幅較大，而題幹並無交代，故交易量【不能確定】。此處硬答一個方向，是本課題最典型的失分位：能確定的只有一項，答兩項就等於憑空補上了題目沒有給的資料。`
              : `本題之中，兩者對交易量的影響同向，故交易量${c.q}是確定的；價格方面兩者相反，但題幹已交代哪一邊的移幅較大，由較大的一邊主導，故價格${c.p}。若題幹沒有交代移幅大小，價格的方向便無法確定。`}
            最穩妥的做法是動手畫圖：把兩次移動分開畫，逐次觀察交點的位置，比死記結論可靠。`,
            `When both curves move, judge each variable separately: a direction is determinate only where the two shifts push the same way. ${amb
              ? 'Here both shifts push price the same way, so the price direction is certain; but they push quantity in opposite directions, and which wins depends on the relative sizes of the shifts, which the question does not state. Quantity is therefore indeterminate. Forcing a direction anyway is the classic error on this topic — only one variable can be pinned down, and answering both invents information the question never supplied.'
              : 'Here both shifts push quantity the same way, so quantity is determinate; price is pushed in opposite directions, but the question states which shift is larger, and the larger one decides. Without that information the price direction would be indeterminate.'} The safest method is to draw it: shift one curve at a time and watch where the intersection lands, rather than memorising conclusions.`],
      }
    },
  },

  // ── 彈性 16 ──────────────────────────────────────────────────────────────
  {
    key: 'econ_elasticity_classify', topic: T.elas[0], topicZh: T.elas[1], topicEn: T.elas[2], diff: 'basic', n: 6,
    gen: (i) => {
      const { dp, dq } = P9[i]
      const e = dq / dp
      const zh = e > 1 ? `富有彈性（彈性值 ${num(e)}，大於 1）` : e < 1 ? `缺乏彈性（彈性值 ${num(e)}，小於 1）` : `單位彈性（彈性值 ${num(e)}，等於 1）`
      return {
        q: [`某商品的價格上升 ${dp}%，其需求量隨之下降 ${dq}%。\n\n該商品的需求價格彈性屬於哪一類？`,
            `The price of a good rises by ${dp}% and the quantity demanded falls by ${dq}%.\n\nHow is the price elasticity of demand best described?`],
        ans: zh,
        wrong: [
          e > 1 ? `缺乏彈性（彈性值 ${num(dp / dq)}，小於 1）` : `富有彈性（彈性值 ${num(dp / dq)}，大於 1）`,
          `完全無彈性（彈性值 0）`,
          `完全有彈性（彈性值趨於無限大）`,
        ],
        ansEn: e > 1 ? `Elastic (elasticity ${num(e)}, greater than 1)`
          : e < 1 ? `Inelastic (elasticity ${num(e)}, less than 1)`
            : `Unit elastic (elasticity ${num(e)}, equal to 1)`,
        wrongEn: [
          e > 1 ? `Inelastic (elasticity ${num(dp / dq)}, less than 1)` : `Elastic (elasticity ${num(dp / dq)}, greater than 1)`,
          'Perfectly inelastic (elasticity 0)',
          'Perfectly elastic (elasticity tending to infinity)',
        ],
        e: [`需求價格彈性（取絕對值）＝ 需求量變動百分比 ÷ 價格變動百分比 ＝ ${dq}% ÷ ${dp}% ＝ ${num(e)}，${e > 1 ? '大於 1，故富有彈性' : e < 1 ? '小於 1，故缺乏彈性' : '等於 1，故屬單位彈性'}。把分子分母對調得 ${num(dp / dq)}，分類隨即倒轉，這是最常見的錯誤；記法是：彈性量度的是【量】對價的反應，故量在上。完全無彈性指價格無論怎樣變動，需求量都不變；完全有彈性指價格稍有變動，需求量即由零跳至無限大 —— 兩者都是極端情況，與本題所給的有限百分比不符。`,
            `Price elasticity of demand (absolute value) = % change in quantity ÷ % change in price = ${dq}% ÷ ${dp}% = ${num(e)}, which is ${e > 1 ? 'greater than 1, so demand is elastic' : e < 1 ? 'less than 1, so demand is inelastic' : 'equal to 1, so demand is unit elastic'}. Swapping numerator and denominator gives ${num(dp / dq)} and reverses the classification — remember that elasticity measures how *quantity* responds to price, so quantity goes on top. Perfectly inelastic means quantity never changes whatever the price; perfectly elastic means quantity jumps from zero to unlimited at the slightest change. Both are extremes and neither fits the finite percentages given.`],
      }
    },
  },
  {
    key: 'econ_elasticity_revenue', topic: T.elas[0], topicZh: T.elas[1], topicEn: T.elas[2], diff: 'intermediate', n: 6,
    gen: (i) => {
      const { e, up } = P10[i]
      const rise = (e < 1 && up) || (e > 1 && !up)
      const zh = e === 1 ? '總收入維持不變' : rise ? '總收入增加' : '總收入減少'
      return {
        q: [`已知某商品的需求價格彈性（絕對值）為 ${e}。若該商品的售價${up ? '上升' : '下調'}，\n\n在其他情況不變下，賣方的總收入會怎樣變動？`,
            `The price elasticity of demand for a good is ${e} in absolute value. If its price is ${up ? 'raised' : 'lowered'},\n\nother things being equal, how does the seller's total revenue change?`],
        ans: zh,
        wrong: [rise ? '總收入減少' : '總收入增加', '總收入維持不變', `無法判斷，因為題目沒有提供原來的價格與銷量`],
        ansEn: e === 1 ? 'Total revenue is unchanged' : rise ? 'Total revenue rises' : 'Total revenue falls',
        wrongEn: [
          rise ? 'Total revenue falls' : 'Total revenue rises',
          'Total revenue is unchanged',
          'Cannot be determined, because the original price and quantity are not given',
        ],
        e: [`總收入 ＝ 價格 × 銷量，價格${up ? '升' : '跌'}時銷量必定${up ? '跌' : '升'}，故勝負取決於兩者的變動幅度，而彈性正是量度這個比較。彈性 ${e} ${e > 1 ? '大於 1，代表銷量的變動幅度大於價格，銷量的一方主導' : e < 1 ? '小於 1，代表銷量的變動幅度小於價格，價格的一方主導' : '等於 1，代表兩者的變動幅度相同，剛好抵銷'}，所以${zh}。一句記法：缺乏彈性時加價得益，富有彈性時減價得益。至於「無法判斷」一項 —— 由於比較的是變動【百分比】，原來的價格與銷量並不影響方向，故資料已經足夠。`,
            `Total revenue = price × quantity, and a ${up ? 'rise' : 'fall'} in price always brings a ${up ? 'fall' : 'rise'} in quantity, so the outcome turns on which moves proportionally more — which is exactly what elasticity measures. An elasticity of ${e} is ${e > 1 ? 'above 1, so quantity moves proportionally more and dominates' : e < 1 ? 'below 1, so quantity moves proportionally less and price dominates' : 'equal to 1, so the two exactly offset'}, giving the answer above. As a rule: raise price when demand is inelastic, cut price when it is elastic. "Cannot be determined" fails because the comparison is between *percentage* changes, so the original price and quantity do not affect the direction.`],
      }
    },
  },
  {
    key: 'econ_supply_elasticity', topic: T.elas[0], topicZh: T.elas[1], topicEn: T.elas[2], diff: 'intermediate', n: 4,
    gen: (i) => {
      const { dp, dq } = P11[i]
      const e = dq / dp
      return {
        q: [`某商品的價格上升 ${dp}%，其供給量隨之增加 ${dq}%。求該商品的供給價格彈性。`,
            `When the price of a good rises by ${dp}%, the quantity supplied rises by ${dq}%. Find the price elasticity of supply.`],
        ans: `${num(e)}`,
        wrong: [`${num(dp / dq)}`, `${num(-e)}`, `${num(dq - dp)}`],
        e: [`供給價格彈性 ＝ 供給量變動百分比 ÷ 價格變動百分比 ＝ ${dq}% ÷ ${dp}% ＝ ${num(e)}。與需求彈性不同的是，供給彈性【本身就是正數】：價格上升，供給量亦上升，兩者同向，故不需要另加絕對值。答 ${num(-e)} 的學生把需求彈性習慣性加上的負號搬了過來，是本題最主要的失分位。${num(dp / dq)} 把分子分母對調。最後一項把兩個百分比相減而非相除 —— 彈性是比率，不是差額。`,
            `Price elasticity of supply = % change in quantity supplied ÷ % change in price = ${dq}% ÷ ${dp}% = ${num(e)}. Unlike demand elasticity, this figure is *naturally positive*: price and quantity supplied move together, so no absolute value is needed. Answering ${num(-e)} carries over the minus sign that belongs to demand elasticity — the main trap here. ${num(dp / dq)} inverts the ratio, and the last option subtracts the percentages instead of dividing; elasticity is a ratio, not a difference.`],
      }
    },
  },

  // ── 宏觀經濟 11 ──────────────────────────────────────────────────────────
  {
    key: 'econ_unemployment_rate', topic: T.macro[0], topicZh: T.macro[1], topicEn: T.macro[2], diff: 'basic', n: 6,
    gen: (i) => {
      const { lf, un } = P12[i]
      const ans = (un / lf) * 100
      return {
        q: [`某地的勞動人口為 ${lf} 萬人，其中失業人數為 ${un} 萬人。求該地的失業率。`,
            `An economy has a labour force of ${lf} thousand, of whom ${un} thousand are unemployed. Find the unemployment rate.`],
        ans: `${num(ans)}%`,
        wrong: [`${num((un / (lf - un)) * 100)}%`, `${num(((lf - un) / lf) * 100)}%`, `${num((lf / un) * 100)}%`],
        e: [`失業率 ＝ 失業人數 ÷ 勞動人口 × 100% ＝ ${un} ÷ ${lf} × 100% ＝ ${num(ans)}%。分母是【整個勞動人口】，即就業與失業人數之和，而非只計就業人數；用 ${lf} − ${un} 作分母會得出 ${num((un / (lf - un)) * 100)}%，是本題最主要的失分位。${num(((lf - un) / lf) * 100)}% 求的是就業率，剛好是失業率的補數。最後一項把分子分母對調，所得數值大於 100%，僅憑常識即可排除。`,
            `Unemployment rate = unemployed ÷ labour force × 100% = ${un} ÷ ${lf} × 100% = ${num(ans)}%. The denominator is the *whole* labour force — employed plus unemployed — not the employed alone; using ${lf} − ${un} gives ${num((un / (lf - un)) * 100)}%, the main trap here. ${num(((lf - un) / lf) * 100)}% is the employment rate, the complement of the answer. The last option inverts the ratio and exceeds 100%, which common sense alone rules out.`],
      }
    },
  },
  {
    key: 'econ_real_vs_nominal', topic: T.macro[0], topicZh: T.macro[1], topicEn: T.macro[2], diff: 'intermediate', n: 5,
    gen: (i) => {
      const { nom, inf } = P13[i]
      const ans = nom - inf
      const zh = ans > 0 ? `實質工資上升約 ${num(ans)}%，購買力提高` : ans < 0 ? `實質工資下跌約 ${num(-ans)}%，購買力反而下降` : '實質工資維持不變，購買力沒有改變'
      return {
        q: [`某年某地的名義工資上升 ${nom}%，同期的通脹率為 ${inf}%。\n\n該地工人的實質工資有何變動？`,
            `In one year nominal wages in an economy rise by ${nom}% while the inflation rate is ${inf}%.\n\nWhat happens to workers' real wages?`],
        ans: zh,
        wrong: [
          `實質工資上升約 ${num(nom + inf)}%，因為兩項升幅應該相加`,
          `實質工資上升 ${nom}%，通脹率並不影響實質工資`,
          ans >= 0 ? `實質工資下跌約 ${num(nom + inf)}%` : `實質工資上升約 ${num(inf - ans)}%`,
        ],
        ansEn: ans > 0 ? `Real wages rise by about ${num(ans)}%, so purchasing power improves`
          : ans < 0 ? `Real wages fall by about ${num(-ans)}%, so purchasing power actually declines`
            : 'Real wages are unchanged, so purchasing power is unaffected',
        wrongEn: [
          `Real wages rise by about ${num(nom + inf)}%, because the two increases should be added`,
          `Real wages rise by ${nom}%, because inflation does not affect real wages`,
          ans >= 0 ? `Real wages fall by about ${num(nom + inf)}%` : `Real wages rise by about ${num(inf - ans)}%`,
        ],
        e: [`實質變動 ≈ 名義變動 − 通脹率 ＝ ${nom}% − ${inf}% ＝ ${num(ans)}%，故${ans > 0 ? '實質工資上升，工人的購買力確有提高' : ans < 0 ? '實質工資下跌 —— 名義工資雖然加了，但物價升得更快，實際能買到的東西反而少了' : '實質工資不變，名義上的加幅剛好被物價抵銷'}。把兩者相加是本題最主要的錯誤：通脹侵蝕購買力，方向與加薪相反，故應相減。至於「通脹率並不影響實質工資」，正好違反了實質與名義的分別 —— 兩者的分別就在於有沒有把物價的變動剔除。`,
            `Real change ≈ nominal change − inflation = ${nom}% − ${inf}% = ${num(ans)}%, so ${ans > 0 ? 'real wages rise and purchasing power genuinely improves' : ans < 0 ? 'real wages fall — the pay rise is outpaced by prices, so workers can buy less than before' : 'real wages are unchanged, the rise being exactly offset by prices'}. Adding the two is the main error: inflation erodes purchasing power and works against the pay rise, so it must be subtracted. The option denying any effect contradicts the very distinction between real and nominal, which is precisely whether price changes have been stripped out.`],
      }
    },
  },

  // ── 市場效率 4 ───────────────────────────────────────────────────────────
  {
    key: 'econ_producer_surplus', topic: T.mkt[0], topicZh: T.mkt[1], topicEn: T.mkt[2], diff: 'intermediate', n: 4,
    gen: (i) => {
      const { p, pmin, q } = P14[i]
      const ans = ((p - pmin) * q) / 2
      return {
        q: [`某商品的供給曲線為一直線。當市價為 \\$${p} 時成交量為 ${q} 件；供給曲線與縱軸相交於 \\$${pmin}，即賣方願意供應第一件的最低價格。\n\n求生產者剩餘。`,
            `The supply curve for a good is a straight line. At a market price of \\$${p}, ${q} units are traded; the supply curve meets the vertical axis at \\$${pmin}, the lowest price at which the first unit would be supplied.\n\nFind the producer surplus.`],
        ans: `\\$${money(ans)}`,
        wrong: [`\\$${money((p - pmin) * q)}`, `\\$${money((p * q) / 2)}`, `\\$${money(p - pmin)}`],
        e: [`生產者剩餘是市價與供給曲線之間、成交量以左的面積。供給曲線既為直線，該面積是一個三角形：底為成交量 ${q}，高為 ${p} − ${pmin} ＝ \\$${money(p - pmin)}，故剩餘 ＝ ${q} × ${money(p - pmin)} ÷ 2 ＝ \\$${money(ans)}。忘記除以 2 得 \\$${money((p - pmin) * q)}，即把三角形當作長方形，是本題最主要的失分位。\\$${money((p * q) / 2)} 用了市價本身作高，等於把供給曲線的起點誤當作零。最後一項只求了高度而未乘底。`,
            `Producer surplus is the area between the market price and the supply curve, to the left of the quantity traded. With a straight-line supply curve that area is a triangle: base ${q}, height ${p} − ${pmin} = \\$${money(p - pmin)}, so the surplus is ${q} × ${money(p - pmin)} ÷ 2 = \\$${money(ans)}. Omitting the division by 2 gives \\$${money((p - pmin) * q)} and treats the triangle as a rectangle — the main trap. \\$${money((p * q) / 2)} uses the market price itself as the height, i.e. assumes the supply curve starts at zero. The last option gives the height alone, without multiplying by the base.`],
      }
    },
  },
]

emit('economics', 'econ_rep', archs, 'scripts/qbank/drafts/economics-replace.json')
