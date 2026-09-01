import type { Question } from './types'
import { createBank, n, qty, round, type TopicMeta, type FwMeta } from './_parametric'

// ═══════════════════════════════════════════════════════════════════════════
// biology-bank.ts —— 生物科參數化母模板（2026-08-29）
// ---------------------------------------------------------------------------
// 沿用 ict-bank.ts 的做法：只擴充【原本最薄】的課題，不碰最厚的一個。
//
// 生物科現況為 11 個課題、254 條 MC，其中 bio_data_ecology 一個課題已佔 97 條
// （來自 applied-banks.ts 的數據型模板），其餘十個課題各只有 10 至 33 條。
// 若繼續擴充 bio_data_ecology，總數雖然上升，倍差卻會由 9.7× 進一步惡化，
// 直接違反目標第三條「各科內部課題數量必須平均分配」。
//
// 因此本檔為其餘各課題找出其可以 correct-by-construction 出題的部分：
//   細胞      顯微鏡放大率、表面積與體積比、滲透方向
//   酶        反應速率、最適條件的數據判讀
//   光合作用  淨光合與總光合、限制因子
//   遺傳      孟德爾比例、測交、伴性遺傳
//   遺傳推理  系譜與基因型反推
//   人體系統  心輸出量、肺氣量、腎小球濾過
//   營養與消化 能量值、營養素比例
//   神經與協調 神經傳導速度、反射時間
//   生態      能量傳遞效率、族群增長、生產力
//
// ⚠️ 每個迴圈的輸出量必須先估算後撰寫，避免重演企會財一役（擴闊一個迴圈
// 令單一課題由 88 條跳至 190 條，其後須以四輪反覆收窄）。
//
// 退化組合（四個選項並非互不相同）由 createBank().add() 靜默丟棄並登記，
// 不會報錯，故每次修改後均須重新統計各課題的實際產出數量。
// ═══════════════════════════════════════════════════════════════════════════

const T = {
  cells: { id: 'cells', zh: '細胞', en: 'Cells' },
  enzymes: { id: 'enzymes', zh: '酶', en: 'Enzymes' },
  photo: { id: 'photosynthesis', zh: '光合作用', en: 'Photosynthesis' },
  genetics: { id: 'genetics', zh: '遺傳', en: 'Genetics' },
  glogic: { id: 'bio_genetics_logic', zh: '遺傳推理', en: 'Genetics — reasoning' },
  body: { id: 'human_body', zh: '人體系統', en: 'Human Body Systems' },
  digest: { id: 'digestion', zh: '營養與消化', en: 'Nutrition & Digestion' },
  coord: { id: 'coordination', zh: '神經與協調', en: 'Coordination' },
  eco: { id: 'ecology', zh: '生態', en: 'Ecology' },
  chain: { id: 'bio_physio_chain', zh: '生理機制・因果鏈', en: 'Physiological mechanisms — causal chains' },
} satisfies Record<string, TopicMeta>

const FW = {
  apply: { id: 'apply', zh: '應用分析', en: 'Application', emoji: '🛠️' },
  logic: { id: 'logic', zh: '邏輯推理', en: 'Logical Reasoning', emoji: '🧠' },
} satisfies Record<string, FwMeta>

const b = createBank('biology')

/** 由候選值中選出三個與正解相異、彼此亦不重複的干擾項。 */
const distract = (correct: number, cands: number[]): number[] =>
  cands.filter((v, i, a) => v !== correct && a.indexOf(v) === i && Number.isFinite(v)).slice(0, 3)

// ── 細胞 ──────────────────────────────────────────────────────────────────

// CE1 — 顯微鏡總放大率 = 目鏡 × 物鏡
for (const eye of [5, 10, 15]) {
  for (const obj of [4, 10, 20, 40, 60, 100]) {
    const total = eye * obj
    const d = distract(total, [eye + obj, obj, total / 2, obj * 10])
    if (d.length < 3) continue
    b.add(`biob_ce1_${eye}_${obj}`, T.cells, FW.apply, 'easy',
      [`顯微鏡的目鏡放大率為 $\\times ${eye}$，物鏡放大率為 $\\times ${obj}$。總放大率是多少？`,
       `A microscope has a $\\times ${eye}$ eyepiece and a $\\times ${obj}$ objective. What is the total magnification?`],
      [n(`$\\times ${total}$`), ...d.map((v) => n(`$\\times ${v}$`))],
      [`總放大率是兩個鏡的放大率【相乘】而非相加：$${eye} \\times ${obj} = ${total}$。答 $\\times ${eye + obj}$ 是把兩者相加，這是最常見的失分位。要留意放大率提高並不等於解像力提高——看得更大而細節未必更清楚，兩者是不同的概念。`,
       `Total magnification is the PRODUCT of the two lenses, not their sum: $${eye} \\times ${obj} = ${total}$. Answering $\\times ${eye + obj}$ adds them, which is where marks are most often lost. Note that greater magnification does not mean greater resolution: an image can be larger without revealing more detail.`])
  }
}

// CE2 — 實際大小 = 影像大小 ÷ 放大率
for (const img of [10, 15, 20, 25, 30, 40, 50]) {
  for (const mag of [100, 200, 400, 500]) {
    const real = (img * 1000) / mag
    if (!Number.isInteger(real)) continue
    const d = distract(real, [img * mag, img / mag, real * 10, img])
    if (d.length < 3) continue
    b.add(`biob_ce2_${img}_${mag}`, T.cells, FW.apply, 'medium',
      [`在放大率 $\\times ${mag}$ 之下，某細胞的影像長度為 ${img} 毫米。該細胞的實際長度是多少微米？（1 毫米 = 1000 微米）`,
       `Under $\\times ${mag}$ magnification a cell measures ${img} mm on the image. What is its actual length in micrometres? (1 mm = 1000 µm)`],
      [qty(real, '微米', 'µm'), ...d.map((v) => qty(v, '微米', 'µm'))],
      [`實際大小 = 影像大小 ÷ 放大率 = $\\dfrac{${img}}{${mag}} = ${round(img / mag, 4)}$ 毫米，換成微米即乘 1000，得 ${real} 微米。兩個關口都容易失分：一是把除法寫成乘法，二是漏了毫米與微米的換算。作答前先確認題目要求的單位。`,
       `Actual size = image size ÷ magnification = $\\dfrac{${img}}{${mag}} = ${round(img / mag, 4)}$ mm, then × 1000 for micrometres, giving ${real} µm. Marks are lost at two points: multiplying instead of dividing, and skipping the mm-to-µm conversion. Check the unit the question asks for before answering.`])
  }
}

// CE3 — 表面積與體積比（立方體模型）
for (const s of [1, 2, 3, 4, 5, 6, 8, 10]) {
  const sa = 6 * s * s, vol = s ** 3
  const ratio = sa / vol
  const d = distract(ratio, [vol / sa, sa, vol, s])
  if (d.length < 3) continue
  b.add(`biob_ce3_${s}`, T.cells, FW.apply, 'medium',
    [`一個邊長 ${s} 單位的立方體細胞模型，其表面積與體積之比是多少？`,
     `A cube-shaped cell model has sides of ${s} units. What is its surface area to volume ratio?`],
    [n(`$${round(ratio, 3)} : 1$`), ...d.map((v) => n(`$${round(v, 3)} : 1$`))],
    [`表面積 $= 6s^2 = 6 \\times ${s}^2 = ${sa}$，體積 $= s^3 = ${vol}$，故比值 $= \\dfrac{${sa}}{${vol}} = ${round(ratio, 3)}$。要掌握的規律是：細胞愈大，此比值愈【小】。物質靠表面進出而靠體積消耗，故體積增長快過表面積，正是細胞不能無限長大、以及大型生物需要專門交換表面的原因。`,
     `Surface area $= 6s^2 = 6 \\times ${s}^2 = ${sa}$ and volume $= s^3 = ${vol}$, so the ratio is $\\dfrac{${sa}}{${vol}} = ${round(ratio, 3)}$. The pattern to remember is that the ratio FALLS as a cell grows. Exchange happens across the surface while consumption scales with volume, which is why cells cannot grow indefinitely and why large organisms need specialised exchange surfaces.`])
}

// ── 酶 ────────────────────────────────────────────────────────────────────

// EN1 — 反應速率 = 產物量 ÷ 時間
for (const prod of [12, 18, 24, 30, 36, 45, 60, 72]) {
  for (const t of [2, 3, 4, 6]) {
    const rate = prod / t
    if (!Number.isInteger(rate)) continue
    const d = distract(rate, [prod * t, prod - t, prod + t, t / prod])
    if (d.length < 3) continue
    b.add(`biob_en1_${prod}_${t}`, T.enzymes, FW.apply, 'easy',
      [`某酶催化反應於 ${t} 分鐘內產生 ${prod} 立方厘米氣體。平均反應速率是多少？`,
       `An enzyme-catalysed reaction produces ${prod} cm³ of gas in ${t} minutes. What is the mean rate of reaction?`],
      [qty(rate, '立方厘米／分鐘', 'cm³/min'), ...d.map((v) => qty(v, '立方厘米／分鐘', 'cm³/min'))],
      [`平均速率 = 產物總量 ÷ 所用時間 = $\\dfrac{${prod}}{${t}} = ${rate}$ 立方厘米／分鐘。要留意「平均速率」與「瞬時速率」不同：酶反應初期最快，其後因底物耗盡而放緩，故平均值必然低於初速率。實驗題若問「初速率」，應取曲線起始一段的斜率而非全程平均。`,
       `Mean rate = total product ÷ time taken = $\\dfrac{${prod}}{${t}} = ${rate}$ cm³/min. Distinguish MEAN rate from INITIAL rate: an enzyme reaction is fastest at the start and slows as substrate is used up, so the mean is always below the initial rate. Where a question asks for the initial rate, take the gradient of the first part of the curve, not the overall average.`])
  }
}

// EN2 — 最適溫度之後速率下降的判讀
for (const opt of [35, 37, 40, 45, 50]) {
  for (const above of [10, 15, 20]) {
    const hot = opt + above
    b.add(`biob_en2_${opt}_${above}`, T.enzymes, FW.logic, 'medium',
      [`某酶的最適溫度為 ${opt}°C。當溫度由 ${opt}°C 升至 ${hot}°C 時，反應速率大幅下降。最合理的解釋是甚麼？`,
       `An enzyme has an optimum temperature of ${opt}°C. Raising the temperature from ${opt}°C to ${hot}°C sharply reduces the rate. What is the best explanation?`],
      [['高溫使酶的三維結構變性，活性部位形狀改變而無法與底物結合',
        'high temperature denatures the enzyme, so the active site no longer fits the substrate'],
       ['高溫使底物分子運動減慢，碰撞次數因而減少',
        'high temperature slows the substrate molecules, so collisions become less frequent'],
       ['高溫令酶被完全消耗，反應物中已無酶存在',
        'high temperature uses up the enzyme entirely, leaving none in the mixture'],
       ['高溫使酶轉化為底物，故產物不再生成',
        'high temperature converts the enzyme into substrate, so no product forms']],
      [`超過最適溫度後，維持酶三維結構的氫鍵等作用被破壞，【活性部位】形狀改變，底物不再吻合，速率因而下降——此即變性。要留意兩點：一、變性通常不可逆，降溫亦不會回復；二、溫度升高本身會加快分子運動，故速率下降並非由於碰撞減少，而是由於能夠催化的酶減少。酶屬催化劑，反應前後本身不被消耗，亦不會轉化為底物。`,
       `Above the optimum, the bonds holding the enzyme's three-dimensional shape break, the ACTIVE SITE changes shape, the substrate no longer fits and the rate falls — this is denaturation. Two points matter: denaturation is usually irreversible, so cooling does not restore activity; and higher temperature actually speeds molecular movement, so the fall is not from fewer collisions but from fewer functional enzymes. An enzyme is a catalyst: it is not consumed, nor converted into substrate.`])
  }
}

// ── 光合作用 ──────────────────────────────────────────────────────────────

// PH1 — 總光合 = 淨光合 + 呼吸
for (const net of [4, 6, 8, 10, 12, 15, 18, 20]) {
  for (const resp of [2, 3, 5, 6]) {
    const gross = net + resp
    const d = distract(gross, [net - resp, net, resp, net * resp])
    if (d.length < 3) continue
    b.add(`biob_ph1_${net}_${resp}`, T.photo, FW.apply, 'medium',
      [`某植物的淨光合速率為每小時 ${net} 單位，同時期的呼吸速率為每小時 ${resp} 單位。總光合速率是多少？`,
       `A plant has a net photosynthetic rate of ${net} units per hour and a respiration rate of ${resp} units per hour over the same period. What is the gross rate of photosynthesis?`],
      [qty(gross, '單位／小時', 'units/h'), ...d.map((v) => qty(v, '單位／小時', 'units/h'))],
      [`實驗測得的氣體交換量是【淨】值，因為植物同時進行呼吸，把部分光合產物消耗掉。故總光合 = 淨光合 + 呼吸 = $${net} + ${resp} = ${gross}$ 單位／小時。答 $${net - resp}$ 是把兩者相減，方向剛好寫反。理解方法：植物實際製造的多於我們量到的，量到的只是扣除自用之後的餘額。`,
       `What an experiment measures as gas exchange is the NET value, because the plant respires at the same time and consumes part of what it makes. So gross = net + respiration = $${net} + ${resp} = ${gross}$ units/h. Answering $${net - resp}$ subtracts and reverses the direction. Think of it this way: the plant makes more than we measure; what we measure is only the balance after its own use.`])
  }
}

// PH2 — 補償點的判讀
for (const light of [2, 4, 6, 8, 10]) {
  b.add(`biob_ph2_${light}`, T.photo, FW.logic, 'medium',
    [`在光強度為 ${light} 任意單位時，某植物的二氧化碳淨吸收量為零。這一點代表甚麼？`,
     `At a light intensity of ${light} arbitrary units, a plant shows zero net uptake of carbon dioxide. What does this point represent?`],
    [['光合作用速率與呼吸作用速率相等，即補償點',
      'photosynthesis and respiration proceed at equal rates — the compensation point'],
     ['植物已停止光合作用，只進行呼吸作用',
      'photosynthesis has stopped and only respiration continues'],
     ['植物已停止呼吸作用，只進行光合作用',
      'respiration has stopped and only photosynthesis continues'],
     ['植物已達最大光合速率，再增加光強度亦無效',
      'the maximum rate has been reached and more light has no further effect']],
    [`淨吸收量為零並不代表兩個過程都停止，而是代表兩者【速率相等】，互相抵消——此即補償點。光合作用消耗的二氧化碳恰好等於呼吸作用釋出的，故外界量不到淨變化。這是本課題最常見的誤解：把「量不到」讀成「沒有發生」。至於再增加光強度亦無效，那是【光飽和點】，位置在補償點之後很遠。`,
     `Zero net uptake does not mean both processes have stopped; it means their RATES ARE EQUAL and cancel out — the compensation point. The carbon dioxide consumed by photosynthesis exactly matches that released by respiration, so no net change can be measured externally. The common misreading is to take "nothing measured" for "nothing happening". The point at which more light has no further effect is the LIGHT SATURATION point, which lies far beyond the compensation point.`])
}

// ── 遺傳 ──────────────────────────────────────────────────────────────────

// GE1 — 單基因雜交的表現型比例
// ⚠️ 親本必須以【文字】描述，不可只寫基因型：validate-banks 的 normStem
// 會 toLowerCase()，令 Aa／aa／AA 正規化後完全相同，題幹因而被判為重複。
const crosses: Array<[string, string, string, string, string, string]> = [
  ['Aa', 'Aa', '3 : 1', '顯性 : 隱性', '兩個雜合子個體互相雜交', 'two heterozygous individuals are crossed'],
  ['Aa', 'aa', '1 : 1', '顯性 : 隱性', '一個雜合子與一個隱性純合個體雜交', 'a heterozygote is crossed with a homozygous recessive individual'],
  ['AA', 'Aa', '1 : 0', '全為顯性', '一個顯性純合個體與一個雜合子雜交', 'a homozygous dominant individual is crossed with a heterozygote'],
  ['AA', 'aa', '1 : 0', '全為顯性', '一個顯性純合個體與一個隱性純合個體雜交', 'a homozygous dominant individual is crossed with a homozygous recessive one'],
  ['aa', 'aa', '0 : 1', '全為隱性', '兩個隱性純合個體互相雜交', 'two homozygous recessive individuals are crossed'],
]
for (const [p1, p2, ans, note, desc, descEn] of crosses) {
  for (const trait of ['花色', '種子形狀', '株高', '毛色']) {
    const wrong = crosses.filter((c) => c[2] !== ans).map((c) => c[2])
    const d = [...new Set(wrong)].slice(0, 3)
    if (d.length < 3) continue
    b.add(`biob_ge1_${p1}_${p2}_${trait}`, T.genetics, FW.apply, 'easy',
      [`就${trait}而言，${desc}（即 ${p1} × ${p2}）。子代的表現型比例（顯性 : 隱性）為何？`,
       `For ${trait === '花色' ? 'flower colour' : trait === '種子形狀' ? 'seed shape' : trait === '株高' ? 'plant height' : 'coat colour'}, ${descEn} (${p1} × ${p2}). What is the expected phenotypic ratio (dominant : recessive)?`],
      [n(`$${ans}$`), ...d.map((v) => n(`$${v}$`))],
      [`列旁氏表可得子代基因型，再按顯隱關係轉為表現型：$${p1} \\times ${p2}$ 的結果為 ${note}，故表現型比例為 $${ans}$。要分清【基因型比例】與【表現型比例】：$Aa \\times Aa$ 的基因型比例是 $1 : 2 : 1$，表現型比例才是 $3 : 1$，混淆兩者是本課題最常見的失分位。`,
       `Draw the Punnett square for the offspring genotypes, then convert to phenotypes using the dominance relationship: $${p1} \\times ${p2}$ gives ${note === '全為顯性' ? 'all dominant' : note === '全為隱性' ? 'all recessive' : 'dominant and recessive offspring'}, so the phenotypic ratio is $${ans}$. Keep GENOTYPIC and PHENOTYPIC ratios apart: $Aa \\times Aa$ gives $1 : 2 : 1$ by genotype but $3 : 1$ by phenotype, and confusing the two is where this topic is most often lost.`])
  }
}

// GE2 — 伴性遺傳：帶因者母親與正常父親
for (const cond of ['紅綠色盲', '血友病']) {
  for (const sex of ['兒子', '女兒']) {
    const affected = sex === '兒子' ? '50%' : '0%'
    const d = ['50%', '0%', '25%', '100%'].filter((v) => v !== affected).slice(0, 3)
    b.add(`biob_ge2_${cond}_${sex}`, T.genetics, FW.logic, 'hard',
      [`${cond}屬 X 染色體隱性遺傳。一位帶因者母親與一位表現型正常的父親生育，其${sex}患病的機率是多少？`,
       `${cond === '紅綠色盲' ? 'Red-green colour blindness' : 'Haemophilia'} is X-linked recessive. A carrier mother and an unaffected father have children. What is the probability that a ${sex === '兒子' ? 'son' : 'daughter'} is affected?`],
      [n(affected), ...d.map((v) => n(v))],
      [`母親為 $X^A X^a$，父親為 $X^A Y$。兒子的 X 必來自母親，故有一半機會取得 $X^a$ 而發病（兒子只有一條 X，無另一條可作補償）；女兒必從父親取得正常的 $X^A$，故必為正常或帶因者，不會發病。${sex}的患病機率因而是 ${affected}。伴性遺傳題的固定解法：先寫出雙親的完整基因型（連 Y 一併寫出），再分男女討論。`,
       `The mother is $X^A X^a$ and the father $X^A Y$. A son's single X comes from his mother, so half of sons receive $X^a$ and are affected, having no second X to compensate. Every daughter receives the father's normal $X^A$, so daughters are unaffected or carriers. The probability for a ${sex === '兒子' ? 'son' : 'daughter'} is therefore ${affected}. The standard method for X-linked questions: write both parents' full genotypes including the Y, then treat sons and daughters separately.`])
  }
}

// ── 遺傳推理 ──────────────────────────────────────────────────────────────

// GL1 — 由患病子代反推雙親基因型
for (const trait of ['白化病', '囊性纖維化', '苯丙酮尿症']) {
  for (const parent of ['父母表現型均正常', '父親患病而母親正常']) {
    const ans = parent === '父母表現型均正常' ? '雙親均為雜合子（Aa × Aa）' : '父親為 aa，母親為 Aa'
    const opts = ['雙親均為雜合子（Aa × Aa）', '父親為 aa，母親為 Aa',
      '雙親均為純合顯性（AA × AA）', '雙親均為純合隱性（aa × aa）']
    const optsEn: Record<string, string> = {
      '雙親均為雜合子（Aa × Aa）': 'both parents are heterozygous (Aa × Aa)',
      '父親為 aa，母親為 Aa': 'the father is aa and the mother Aa',
      '雙親均為純合顯性（AA × AA）': 'both parents are homozygous dominant (AA × AA)',
      '雙親均為純合隱性（aa × aa）': 'both parents are homozygous recessive (aa × aa)',
    }
    const ansEn = optsEn[ans]
    const d = opts.filter((o) => o !== ans).slice(0, 3)
    const dEn = d.map((o) => optsEn[o])
    b.add(`biob_gl1_${trait}_${parent.slice(0, 4)}`, T.glogic, FW.logic, 'medium',
      [`${trait}由常染色體隱性基因控制。已知${parent}，而他們生下一名患${trait}的子女。雙親的基因型最可能為何？`,
       `${trait === '白化病' ? 'Albinism' : trait === '囊性纖維化' ? 'Cystic fibrosis' : 'Phenylketonuria'} is autosomal recessive. Given that ${parent === '父母表現型均正常' ? 'both parents are unaffected' : 'the father is affected and the mother is not'}, and they have an affected child, what are the parents' most likely genotypes?`],
      [[ans, ansEn], [d[0], dEn[0]], [d[1], dEn[1]], [d[2], dEn[2]]],
      [`患病子女必為 $aa$，兩個隱性等位基因分別來自父與母，故雙親各自至少帶有一個 $a$。${parent === '父母表現型均正常' ? '雙親表現型正常，不可能是 $aa$，因此各自必為 $Aa$。' : '父親患病故為 $aa$；母親表現型正常卻能傳出 $a$，故為 $Aa$。'}此類題的解法固定：先由患者反推其基因型，再向上追溯雙親必須提供甚麼等位基因，最後用雙親的表現型排除不可能的組合。`,
       `An affected child must be $aa$, receiving one recessive allele from each parent, so each parent carries at least one $a$. ${parent === '父母表現型均正常' ? 'Both parents are unaffected and so cannot be $aa$; each must therefore be $Aa$.' : 'The affected father is $aa$; the unaffected mother must still have passed an $a$, so she is $Aa$.'} The method is always the same: deduce the affected individual's genotype, work upwards to what each parent must have supplied, then use the parents' phenotypes to eliminate impossible combinations.`])
  }
}

// ── 人體系統 ──────────────────────────────────────────────────────────────

// HB1 — 心輸出量 = 心搏量 × 心率
for (const stroke of [60, 65, 70, 75, 80, 85, 90]) {
  for (const hr of [60, 70, 72, 80, 100]) {
    const co = (stroke * hr) / 1000
    const d = distract(co, [stroke + hr, (stroke * hr) / 100, stroke / hr, co * 2])
    if (d.length < 3) continue
    b.add(`biob_hb1_${stroke}_${hr}`, T.body, FW.apply, 'medium',
      [`某人的心搏量為 ${stroke} 毫升，心率為每分鐘 ${hr} 次。心輸出量是多少公升／分鐘？`,
       `A person has a stroke volume of ${stroke} ml and a heart rate of ${hr} beats per minute. What is the cardiac output in litres per minute?`],
      [qty(round(co, 3), '公升／分鐘', 'L/min'), ...d.map((v) => qty(round(v, 3), '公升／分鐘', 'L/min'))],
      [`心輸出量 = 心搏量 × 心率 = $${stroke} \\times ${hr} = ${stroke * hr}$ 毫升／分鐘，除以 1000 得 ${round(co, 3)} 公升／分鐘。要留意運動時心輸出量上升，可以來自心率上升，亦可以來自心搏量上升；受過訓練者靜息心率較低，正是因為心搏量較大，同樣的輸出量只需較少次數。`,
       `Cardiac output = stroke volume × heart rate = $${stroke} \\times ${hr} = ${stroke * hr}$ ml/min, which is ${round(co, 3)} L/min. Note that a rise in cardiac output during exercise can come from a higher rate or a larger stroke volume; a trained person has a lower resting heart rate precisely because the stroke volume is larger, so fewer beats deliver the same output.`])
  }
}

// HB2 — 肺氣量：肺活量 = 潮氣量 + 補吸氣量 + 補呼氣量
for (const tidal of [400, 450, 500, 550]) {
  for (const irv of [2500, 3000, 3300]) {
    for (const erv of [1000, 1100, 1200]) {
      const vc = tidal + irv + erv
      const d = distract(vc, [tidal + irv, irv + erv, vc + 1200, tidal])
      if (d.length < 3) continue
      const hbDiff = erv === 1000 ? 'easy' : 'medium'
      b.add(`biob_hb2_${tidal}_${irv}_${erv}`, T.body, FW.apply, hbDiff,
        [`某人的潮氣量為 ${tidal} 毫升，補吸氣量為 ${irv} 毫升，補呼氣量為 ${erv} 毫升。其肺活量是多少？`,
         `A person has a tidal volume of ${tidal} ml, an inspiratory reserve volume of ${irv} ml and an expiratory reserve volume of ${erv} ml. What is the vital capacity?`],
        [qty(vc, '毫升', 'ml'), ...d.map((v) => qty(v, '毫升', 'ml'))],
        [`肺活量 = 潮氣量 + 補吸氣量 + 補呼氣量 = $${tidal} + ${irv} + ${erv} = ${vc}$ 毫升。要留意肺活量【不包括】餘氣量——即用力呼氣後仍留在肺中的空氣，那部分無法自主排出，故不計入可用容量。肺總量才等於肺活量加餘氣量。`,
         `Vital capacity = tidal volume + inspiratory reserve + expiratory reserve = $${tidal} + ${irv} + ${erv} = ${vc}$ ml. Note that vital capacity EXCLUDES the residual volume — the air remaining after a forced expiration, which cannot be voluntarily expelled and so is not part of the usable capacity. Total lung capacity is vital capacity plus residual volume.`])
    }
  }
}

// ── 營養與消化 ────────────────────────────────────────────────────────────

// DG1 — 食物能量值
for (const carb of [20, 30, 40, 50, 60]) {
  for (const prot of [10, 15, 20, 25]) {
    for (const fat of [5, 10, 15]) {
      const kj = carb * 17 + prot * 17 + fat * 37
      const d = distract(kj, [(carb + prot + fat) * 17, carb * 37 + prot * 37 + fat * 17, kj / 2])
      if (d.length < 3) continue
      // 脂肪含量決定計算的層次：只有兩種能量值時較淺，三種混合且比例懸殊時較難。
      const dgDiff = fat === 5 ? 'easy' : fat === 15 ? 'hard' : 'medium'
      b.add(`biob_dg1_${carb}_${prot}_${fat}`, T.digest, FW.apply, dgDiff,
        [`某份食物含碳水化合物 ${carb} 克、蛋白質 ${prot} 克、脂肪 ${fat} 克。已知每克碳水化合物與蛋白質各釋出 17 千焦，每克脂肪釋出 37 千焦。該份食物的能量值是多少？`,
         `A portion of food contains ${carb} g carbohydrate, ${prot} g protein and ${fat} g fat. Carbohydrate and protein each release 17 kJ per gram and fat 37 kJ per gram. What is its energy value?`],
        [qty(kj, '千焦', 'kJ'), ...d.map((v) => qty(v, '千焦', 'kJ'))],
        [`逐項相乘後相加：$${carb} \\times 17 + ${prot} \\times 17 + ${fat} \\times 37 = ${carb * 17} + ${prot * 17} + ${fat * 37} = ${kj}$ 千焦。要留意脂肪的能量值約為碳水化合物的兩倍多，故即使脂肪的質量最小，它在總能量中所佔的比例往往不低——這正是同樣重量的食物能量值可以相差很遠的原因。`,
         `Multiply each component and add: $${carb} \\times 17 + ${prot} \\times 17 + ${fat} \\times 37 = ${carb * 17} + ${prot * 17} + ${fat * 37} = ${kj}$ kJ. Note that fat yields more than twice the energy of carbohydrate per gram, so even when its mass is smallest its share of the total is often substantial — which is why foods of equal weight can differ widely in energy value.`])
    }
  }
}

// ── 神經與協調 ────────────────────────────────────────────────────────────

// CO1 — 神經傳導速度 = 距離 ÷ 時間
for (const dist of [30, 45, 60, 75, 90, 120]) {
  for (const ms of [1, 2, 3]) {
    const speed = (dist / 100) / (ms / 1000)
    if (!Number.isInteger(speed)) continue
    const d = distract(speed, [dist * ms, dist / ms, speed / 2])
    if (d.length < 3) continue
    b.add(`biob_co1_${dist}_${ms}`, T.coord, FW.apply, 'hard',
      [`一個神經衝動沿長 ${dist} 厘米的神經纖維傳導，需時 ${ms} 毫秒。傳導速度是多少米／秒？`,
       `A nerve impulse travels ${dist} cm along a fibre in ${ms} ms. What is the conduction velocity in metres per second?`],
      [qty(speed, '米／秒', 'm/s'), ...d.map((v) => qty(v, '米／秒', 'm/s'))],
      [`先統一單位：${dist} 厘米 = ${round(dist / 100, 3)} 米，${ms} 毫秒 = ${round(ms / 1000, 4)} 秒。速度 = 距離 ÷ 時間 = $\\dfrac{${round(dist / 100, 3)}}{${round(ms / 1000, 4)}} = ${speed}$ 米／秒。單位換算是本題唯一的難點，直接用厘米除毫秒會得出相差一百倍的數值。有髓鞘的神經纖維因跳躍式傳導而速度遠高於無髓鞘者。`,
       `Convert units first: ${dist} cm = ${round(dist / 100, 3)} m and ${ms} ms = ${round(ms / 1000, 4)} s. Velocity = distance ÷ time = $\\dfrac{${round(dist / 100, 3)}}{${round(ms / 1000, 4)}} = ${speed}$ m/s. Unit conversion is the only real difficulty here; dividing centimetres by milliseconds directly gives a value out by a factor of a hundred. Myelinated fibres conduct far faster than unmyelinated ones because of saltatory conduction.`])
  }
}

// ── 生態 ──────────────────────────────────────────────────────────────────

// EC1 — 能量傳遞效率
for (const prod of [1000, 2000, 5000, 8000, 10000, 20000]) {
  for (const pct of [5, 10, 20]) {
    const next = (prod * pct) / 100
    const d = distract(next, [prod - next, prod / pct, prod * pct])
    if (d.length < 3) continue
    b.add(`biob_ec1_${prod}_${pct}`, T.eco, FW.apply, 'medium',
      [`某生態系統的生產者固定了 ${prod} 千焦的能量。若營養級之間的能量傳遞效率為 ${pct}%，則第一級消費者可獲得多少能量？`,
       `Producers in an ecosystem fix ${prod} kJ of energy. If energy transfer between trophic levels is ${pct}% efficient, how much reaches the primary consumers?`],
      [qty(next, '千焦', 'kJ'), ...d.map((v) => qty(v, '千焦', 'kJ'))],
      [`可獲得的能量 = $${prod} \\times ${pct}\\% = ${next}$ 千焦。其餘 ${100 - pct}% 並非消失，而是以呼吸作用產生的熱能散失、未被攝食的部分、以及糞便與遺體中未被消化的部分離開該營養級。正因為每級都有這樣的損耗，食物鏈通常只有四至五級——再上去可用的能量已不足以維持一個族群。`,
       `Energy passed on = $${prod} \\times ${pct}\\% = ${next}$ kJ. The remaining ${100 - pct}% is not destroyed: it leaves the trophic level as heat from respiration, as parts never eaten, and as undigested material in faeces and dead remains. Because every level loses energy this way, food chains rarely exceed four or five levels — beyond that too little remains to support a population.`])
  }
}

// EC2 — 族群增長率
for (const start of [200, 400, 500, 800, 1000]) {
  for (const pct of [5, 10, 15, 20, 25]) {
    const growth = (start * pct) / 100
    const end = start + growth
    if (!Number.isInteger(growth)) continue
    const d = distract(end, [start - growth, growth, start * pct])
    if (d.length < 3) continue
    b.add(`biob_ec2_${start}_${pct}`, T.eco, FW.apply, 'easy',
      [`某族群原有 ${start} 個個體，一年之內增長 ${pct}%。一年後的族群大小是多少？`,
       `A population of ${start} individuals grows by ${pct}% in one year. What is its size after that year?`],
      [qty(end, '個', ''), ...d.map((v) => qty(v, '個', ''))],
      [`增長數目 = $${start} \\times ${pct}\\% = ${growth}$，故一年後為 $${start} + ${growth} = ${end}$ 個。要留意百分率增長屬【複合】性質：若增長率維持不變，第二年的增長數目會大於第一年，因為基數已經變大。這正是指數增長曲線在初期看似平緩、其後急升的原因。`,
       `The increase is $${start} \\times ${pct}\\% = ${growth}$, so after one year the population is $${start} + ${growth} = ${end}$. Note that percentage growth COMPOUNDS: if the rate stays the same, the second year's increase is larger than the first because the base has grown. That is why an exponential curve looks gentle at first and then rises steeply.`])
  }
}

// ── 生理機制・因果鏈 ──────────────────────────────────────────────────────
// 此課題原為概念型，但因果鏈本身有固定方向，可由「正確鏈 vs 方向寫反的鏈」
// 構成 correct-by-construction 的題目：干擾項一律由正確鏈的某一環反轉而成。

const chains: Array<[string, string, string, string, string, string]> = [
  ['血糖上升', '胰島 β 細胞分泌胰島素 → 肝細胞加速把葡萄糖轉為肝糖 → 血糖下降',
   '胰島 α 細胞分泌升糖素 → 肝糖分解為葡萄糖 → 血糖進一步上升',
   'blood glucose rises',
   'beta cells secrete insulin → liver converts glucose to glycogen → blood glucose falls',
   'alpha cells secrete glucagon → glycogen breaks down → blood glucose rises further'],
  ['體溫上升', '下視丘偵測到體溫上升 → 皮膚小動脈舒張、汗腺分泌增加 → 散熱增加、體溫下降',
   '下視丘偵測到體溫上升 → 皮膚小動脈收縮、豎毛肌收縮 → 保溫增加、體溫再上升',
   'body temperature rises',
   'the hypothalamus detects the rise → skin arterioles dilate and sweating increases → heat loss rises and temperature falls',
   'the hypothalamus detects the rise → skin arterioles constrict and hair erector muscles contract → heat is retained and temperature rises further'],
  ['血液水勢下降', '下視丘的滲透壓感受器受刺激 → 腦下垂體後葉釋出抗利尿激素 → 腎小管對水的通透性提高 → 尿量減少',
   '下視丘的滲透壓感受器受刺激 → 抗利尿激素分泌減少 → 腎小管對水的通透性降低 → 尿量增加',
   'blood water potential falls',
   'osmoreceptors in the hypothalamus are stimulated → the posterior pituitary releases ADH → the kidney tubule becomes more permeable to water → urine volume falls',
   'osmoreceptors are stimulated → less ADH is released → the tubule becomes less permeable to water → urine volume rises'],
  ['劇烈運動開始', '肌肉耗氧增加、二氧化碳濃度上升 → 延腦呼吸中樞受刺激 → 呼吸速率與深度增加',
   '肌肉耗氧增加、二氧化碳濃度上升 → 延腦呼吸中樞受抑制 → 呼吸速率減慢',
   'vigorous exercise begins',
   'muscles use more oxygen and carbon dioxide rises → the medullary centre is stimulated → breathing rate and depth increase',
   'muscles use more oxygen and carbon dioxide rises → the medullary centre is inhibited → breathing slows'],
  ['光線變強', '瞳孔括約肌收縮、輻射肌舒張 → 瞳孔縮小 → 進入眼球的光量減少',
   '瞳孔括約肌舒張、輻射肌收縮 → 瞳孔放大 → 進入眼球的光量增加',
   'light intensity increases',
   'the circular muscles contract and the radial muscles relax → the pupil constricts → less light enters the eye',
   'the circular muscles relax and the radial muscles contract → the pupil dilates → more light enters the eye'],
  ['血壓下降', '壓力感受器傳入訊號減少 → 交感神經活性上升 → 心率加快、小動脈收縮 → 血壓回升',
   '壓力感受器傳入訊號減少 → 副交感神經活性上升 → 心率減慢、小動脈舒張 → 血壓進一步下降',
   'blood pressure falls',
   'baroreceptor input decreases → sympathetic activity rises → heart rate rises and arterioles constrict → pressure is restored',
   'baroreceptor input decreases → parasympathetic activity rises → heart rate falls and arterioles dilate → pressure falls further'],
]

for (const [stim, right, reversed, stimEn, rightEn, reversedEn] of chains) {
  const wrongMid = right.split(' → ').slice(0, -1).join(' → ') + ' → 效應與上述相反'
  const wrongMidEn = rightEn.split(' → ').slice(0, -1).join(' → ') + ' → the effect is the opposite of the above'
  const wrongFirst = '刺激被偵測為相反方向 → ' + right.split(' → ').slice(1).join(' → ')
  const wrongFirstEn = 'the stimulus is detected in the opposite direction → ' + rightEn.split(' → ').slice(1).join(' → ')

  // PC1 —— 選出正確的因果鏈
  b.add(`biob_pc1_${stim}`, T.chain, FW.logic, 'medium',
    [`當${stim}時，體內的調節反應依循哪一條因果鏈？`,
     `When ${stimEn}, which causal chain describes the body's regulatory response?`],
    [[right, rightEn], [reversed, reversedEn], [wrongMid, wrongMidEn], [wrongFirst, wrongFirstEn]],
    [`負反饋調節的方向永遠是【抵消原來的改變】：${stim}之後，各環節必須合力把數值推回設定點。正確鏈為 ${right}。其餘三項各有一處斷裂——或把偵測方向寫反，或把效應器的反應寫反，或中途方向一致而結尾結論相反。答這類題的固定方法：先確定最終效果應該是「回落」還是「回升」，再逐環檢查方向是否一致，任何一環相反即可排除。`,
     `Negative feedback always acts to OPPOSE the original change: after ${stimEn}, every step must work to return the value to its set point. The correct chain is: ${rightEn}. Each of the other options breaks somewhere — the detection is reversed, the effector response is reversed, or the steps agree but the stated outcome contradicts them. The method is fixed: decide first whether the final effect should be a fall or a rise, then check each link for direction; a single reversed link is enough to eliminate an option.`])

  // PC2 —— 調節失效之後的後果（題幹與選項均異於 PC1）
  b.add(`biob_pc2_${stim}`, T.chain, FW.logic, 'hard',
    [`若某人在${stim}之後，上述負反饋調節完全失效，最可能出現甚麼情況？`,
     `If the negative feedback response to ${stimEn} failed completely in a person, what would most likely follow?`],
    [['原來的偏離持續擴大，數值無法回到設定點', 'the original deviation keeps growing and the value never returns to its set point'],
     ['數值立即回到設定點，只是所需時間較長', 'the value still returns to its set point, only more slowly'],
     ['數值會反向偏離，越過設定點到另一極端', 'the value swings past the set point to the opposite extreme'],
     ['數值維持不變，因為調節失效等於沒有改變', 'the value stays unchanged, since a failed response means no change at all']],
    [`負反饋的唯一功能是把偏離拉回設定點。一旦整條鏈失效，抵消偏離的力量消失，而造成偏離的原因仍然存在，故偏離只會持續擴大——這正是糖尿病、體溫失調等狀況的共同結構。要留意：失效不等於反向調節，故不會越過設定點到另一極端；亦不等於凍結，因為外界的擾動一直存在。`,
     `The sole function of negative feedback is to pull a deviation back to the set point. If the whole chain fails, the opposing force disappears while the cause of the deviation remains, so the deviation simply grows — the shared structure behind conditions such as diabetes and impaired thermoregulation. Note that failure is not reversed regulation, so the value does not overshoot to the opposite extreme; nor is it a freeze, since the external disturbance continues.`])
}

// ── 神經與協調（補充）────────────────────────────────────────────────────

// CO2 — 反射弧所需時間
for (const syn of [2, 3, 4, 5]) {
  for (const delay of [0.5, 1, 1.5]) {
    for (const conduct of [10, 15, 20]) {
      const total = syn * delay + conduct
      const d = distract(total, [syn * delay, conduct, syn + delay + conduct, total * 2])
      if (d.length < 3) continue
      b.add(`biob_co2_${syn}_${String(delay).replace('.', '')}_${conduct}`, T.coord, FW.apply, 'hard',
        [`某反射弧包含 ${syn} 個突觸，每個突觸的傳遞延遲為 ${delay} 毫秒，神經纖維上的總傳導時間為 ${conduct} 毫秒。由刺激到反應合共需時多少毫秒？`,
         `A reflex arc contains ${syn} synapses, each adding a ${delay} ms delay, with a total conduction time of ${conduct} ms along the fibres. How long does the whole reflex take?`],
        [qty(round(total, 3), '毫秒', 'ms'), ...d.map((v) => qty(round(v, 3), '毫秒', 'ms'))],
        [`總時間 = 突觸延遲總和 + 纖維傳導時間 = $${syn} \\times ${delay} + ${conduct} = ${round(total, 3)}$ 毫秒。突觸延遲來自神經遞質的釋放、擴散與受體結合，屬化學過程，因此比電訊號沿纖維傳導慢得多。這正是反射弧的突觸數目愈少、反應愈快的原因——膝跳反射只有一個突觸，故是人體最快的反射之一。`,
         `Total time = sum of synaptic delays + conduction time = $${syn} \\times ${delay} + ${conduct} = ${round(total, 3)}$ ms. Synaptic delay comes from releasing, diffusing and binding a neurotransmitter — a chemical process, and therefore much slower than an electrical signal travelling along a fibre. This is why a reflex with fewer synapses is faster: the knee-jerk reflex has just one, making it among the quickest in the body.`])
    }
  }
}

// ── 遺傳推理（補充）──────────────────────────────────────────────────────

// GL2 — 測交判斷未知基因型
for (const trait of ['黑毛', '高莖', '紅花', '圓粒']) {
  for (const outcome of ['子代全為顯性', '子代顯性與隱性各半']) {
    const ans = outcome === '子代全為顯性' ? '該親本為純合顯性（AA）' : '該親本為雜合子（Aa）'
    const ansEn = outcome === '子代全為顯性' ? 'the parent is homozygous dominant (AA)' : 'the parent is heterozygous (Aa)'
    const opts: Array<[string, string]> = [
      ['該親本為純合顯性（AA）', 'the parent is homozygous dominant (AA)'],
      ['該親本為雜合子（Aa）', 'the parent is heterozygous (Aa)'],
      ['該親本為純合隱性（aa）', 'the parent is homozygous recessive (aa)'],
      ['無法判斷，需要再作一次雜交', 'it cannot be determined without a further cross'],
    ]
    const rest = opts.filter((o) => o[0] !== ans)
    b.add(`biob_gl2_${trait}_${outcome.slice(0, 6)}`, T.glogic, FW.logic, 'medium',
      [`為判斷一株表現${trait}（顯性）的植株屬純合抑或雜合，將它與隱性純合個體進行測交，結果${outcome}。可以推斷甚麼？`,
       `To determine whether a plant showing the dominant trait is homozygous or heterozygous, it is test-crossed with a homozygous recessive individual. The offspring are ${outcome === '子代全為顯性' ? 'all dominant' : 'half dominant and half recessive'}. What can be concluded?`],
      [[ans, ansEn], rest[0], rest[1], rest[2]],
      [`測交是以【隱性純合個體】作對照：由於它只能提供 $a$，子代的表現型直接反映未知親本提供了甚麼配子。若該親本為 $AA$，只能提供 $A$，子代全為 $Aa$，即全部表現顯性；若為 $Aa$，可提供 $A$ 或 $a$ 各半，子代 $Aa$ 與 $aa$ 各半，即顯性與隱性各半。本題結果為${outcome}，故 ${ans}。`,
       `A test cross uses a HOMOZYGOUS RECESSIVE partner: since it can only contribute $a$, the offspring phenotypes directly reveal which gametes the unknown parent supplied. An $AA$ parent supplies only $A$, so all offspring are $Aa$ and show the dominant trait; an $Aa$ parent supplies $A$ and $a$ equally, giving $Aa$ and $aa$ in equal numbers — half dominant, half recessive. Here the offspring are ${outcome === '子代全為顯性' ? 'all dominant' : 'half and half'}, so ${ansEn}.`])
  }
}

export const biologyBank3Questions: Question[] = b.bank
