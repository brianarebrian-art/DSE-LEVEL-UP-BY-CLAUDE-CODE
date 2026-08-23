// ============================================================================
// replace-chemistry.mts —— 化學科模板替換 22 條
// ----------------------------------------------------------------------------
// 被替換的三組克隆（每組封頂 6 條，其餘剷走）：
//   12 條  用 # mol/dm³ NaOH 中和 # cm³ 的 # mol/dm³ HCl，求所需體積
//    6 條  把 # mol 溶質溶於 # dm³ 溶液中，求其摩爾濃度
//    4 條  完全分解 # g CaCO₃，求生成物質量
// 三組都是「把數字代入一條公式」，換數字不換問法。
//
// 本批改為五個原型，各自問法不同：由質量求物質的量、酸鹼中和涉及 1:2 計量比、
// 由方程式求生成物質量、由質量配製溶液、稀釋並涉及單位換算。
//
// 公式（人手覆核點）：
//   n = m / M          物質的量 = 質量 ÷ 摩爾質量
//   c = n / V          摩爾濃度 = 物質的量 ÷ 溶液體積(dm³)
//   c₁V₁ = c₂V₂        稀釋前後溶質的物質的量不變
//   H₂SO₄ + 2NaOH → Na₂SO₄ + 2H₂O   計量比 1 : 2
//   2Mg + O₂ → 2MgO                 計量比 2 : 2，即 1 : 1
// 摩爾質量取自課程指定的相對原子質量，全部為整數或一位小數。
// ============================================================================
import { emit, num, type Arch } from './_archetype.mts'

const T = { stoi: ['stoichiometry', '化學計量', 'Stoichiometry'], conc: ['concentration', '濃度', 'Concentration'] } as const

// ── 原型 1：由質量求物質的量（n = m / M）────────────────────────────────────
// 干擾項：① 公式倒轉 M/m　② 把除誤作乘 m×M　③ 只除以相對原子質量而漏了下標
const S1: { name: string; nameEn: string; M: number; m: number }[] = [
  { name: 'NaCl',   nameEn: 'NaCl',   M: 58.5, m: 11.7 },
  { name: 'CaCO₃',  nameEn: 'CaCO₃',  M: 100,  m: 25 },
  { name: 'NaOH',   nameEn: 'NaOH',   M: 40,   m: 6 },
  { name: 'CuO',    nameEn: 'CuO',    M: 79.5, m: 15.9 },
  { name: 'MgO',    nameEn: 'MgO',    M: 40,   m: 14 },
  { name: 'H₂O',    nameEn: 'H₂O',    M: 18,   m: 4.5 },
]

// ── 原型 2：中和滴定，計量比 1 : 2 ─────────────────────────────────────────
const S2 = [
  { cB: 0.5, vB: 40, vA: 25 }, { cB: 1.0, vB: 30, vA: 20 }, { cB: 0.2, vB: 50, vA: 25 },
  { cB: 0.4, vB: 25, vA: 20 }, { cB: 2.0, vB: 20, vA: 25 }, { cB: 0.8, vB: 50, vA: 40 },
]

// ── 原型 3：由方程式求生成物質量（2Mg + O₂ → 2MgO）────────────────────────
const S3 = [{ m: 12 }, { m: 24 }, { m: 6 }, { m: 48 }]

// ── 原型 4：由質量配製溶液 ─────────────────────────────────────────────────
const C1 = [{ m: 8, V: 0.5 }, { m: 20, V: 2 }, { m: 4, V: 0.25 }]

// ── 原型 5：稀釋（cm³ → dm³ 換算）──────────────────────────────────────────
const C2 = [{ c1: 2, v1: 50, V2: 0.5 }, { c1: 0.5, v1: 200, V2: 2 }, { c1: 4, v1: 25, V2: 0.5 }]

const archs: Arch[] = [
  {
    key: 'chem_mole_from_mass', topic: T.stoi[0], topicZh: T.stoi[1], topicEn: T.stoi[2],
    diff: 'basic', n: 6,
    gen: (i) => {
      const { name, M, m } = S1[i]
      const ans = m / M
      return {
        q: [
          `已知 ${name} 的摩爾質量為 $${M}$ g/mol。求 $${m}$ g ${name} 的物質的量（mol）。`,
          `The molar mass of ${name} is $${M}$ g/mol. Find the number of moles in $${m}$ g of ${name}.`,
        ],
        ans: `$${num(ans)}$ mol`,
        wrong: [`$${num(M / m)}$ mol`, `$${num(m * M)}$ mol`, `$${num(m / (M / 2))}$ mol`],
        e: [
          `物質的量由 $n = \\dfrac{m}{M}$ 求得，即 $\\dfrac{${m}}{${M}} = ${num(ans)}$ mol。把公式倒轉寫成 $\\dfrac{M}{m}$ 會得出 $${num(M / m)}$，這是最常見的一種錯誤，可用單位檢查排除：g ÷ (g/mol) 的結果才是 mol。把除號誤作乘號則得出 $${num(m * M)}$，數值遠大於合理範圍。另一個干擾項把摩爾質量誤取一半，源於混淆了摩爾質量與相對原子質量。`,
          `Use $n = \\dfrac{m}{M} = \\dfrac{${m}}{${M}} = ${num(ans)}$ mol. Inverting the formula to $\\dfrac{M}{m}$ gives $${num(M / m)}$ — check the units: g ÷ (g/mol) yields mol, which only works one way round. Multiplying instead of dividing gives $${num(m * M)}$, far outside a sensible range. The remaining distractor halves the molar mass, a slip that comes from confusing molar mass with relative atomic mass.`,
        ],
      }
    },
  },
  {
    key: 'chem_titration_1to2', topic: T.stoi[0], topicZh: T.stoi[1], topicEn: T.stoi[2],
    diff: 'intermediate', n: 6,
    gen: (i) => {
      const { cB, vB, vA } = S2[i]
      const ans = (cB * vB) / (2 * vA)
      return {
        q: [
          `以 $${cB}$ mol/dm³ 的 NaOH 溶液 $${vB}$ cm³ 恰好中和 $${vA}$ cm³ 的稀硫酸。\n\n反應方程式：$\\text{H}_2\\text{SO}_4 + 2\\text{NaOH} \\to \\text{Na}_2\\text{SO}_4 + 2\\text{H}_2\\text{O}$\n\n求該硫酸的摩爾濃度。`,
          `$${vB}$ cm³ of $${cB}$ mol/dm³ NaOH exactly neutralises $${vA}$ cm³ of dilute sulphuric acid.\n\nEquation: $\\text{H}_2\\text{SO}_4 + 2\\text{NaOH} \\to \\text{Na}_2\\text{SO}_4 + 2\\text{H}_2\\text{O}$\n\nFind the molarity of the acid.`,
        ],
        ans: `$${num(ans)}$ mol/dm³`,
        wrong: [
          `$${num((cB * vB) / vA)}$ mol/dm³`,
          `$${num((2 * cB * vB) / vA)}$ mol/dm³`,
          `$${num((cB * vA) / (2 * vB))}$ mol/dm³`,
        ],
        e: [
          `先求鹼的物質的量：$n(\\text{NaOH}) = ${cB} \\times \\dfrac{${vB}}{1000} = ${num((cB * vB) / 1000)}$ mol。方程式顯示每 1 mol 硫酸消耗 2 mol 氫氧化鈉，故 $n(\\text{H}_2\\text{SO}_4) = ${num((cB * vB) / 2000)}$ mol，再除以酸的體積 $\\dfrac{${vA}}{1000}$ dm³，得 $${num(ans)}$ mol/dm³。忽略 1 : 2 的計量比而直接代入 $c_1V_1 = c_2V_2$，會得出 $${num((cB * vB) / vA)}$，這是本題最主要的失分位——該式只在計量比為 1 : 1 時成立。把比例用反則得 $${num((2 * cB * vB) / vA)}$。最後一項把兩個體積對調。`,
          `First, $n(\\text{NaOH}) = ${cB} \\times \\dfrac{${vB}}{1000} = ${num((cB * vB) / 1000)}$ mol. The equation shows 1 mol of acid consumes 2 mol of base, so $n(\\text{H}_2\\text{SO}_4) = ${num((cB * vB) / 2000)}$ mol; dividing by $\\dfrac{${vA}}{1000}$ dm³ gives $${num(ans)}$ mol/dm³. Applying $c_1V_1 = c_2V_2$ without the ratio gives $${num((cB * vB) / vA)}$ — the main trap here, since that shortcut holds only for a 1 : 1 ratio. Using the ratio the wrong way round gives $${num((2 * cB * vB) / vA)}$, and the last distractor swaps the two volumes.`,
        ],
      }
    },
  },
  {
    key: 'chem_mass_of_product', topic: T.stoi[0], topicZh: T.stoi[1], topicEn: T.stoi[2],
    diff: 'intermediate', n: 4,
    gen: (i) => {
      const { m } = S3[i]
      const ans = (m / 24) * 40
      return {
        q: [
          `$${m}$ g 鎂在足量氧氣中完全燃燒。\n\n反應方程式：$2\\text{Mg} + \\text{O}_2 \\to 2\\text{MgO}$；摩爾質量：Mg $= 24$ g/mol，MgO $= 40$ g/mol。\n\n求所生成氧化鎂的質量。`,
          `$${m}$ g of magnesium burns completely in excess oxygen.\n\nEquation: $2\\text{Mg} + \\text{O}_2 \\to 2\\text{MgO}$; molar masses: Mg $= 24$ g/mol, MgO $= 40$ g/mol.\n\nFind the mass of magnesium oxide formed.`,
        ],
        ans: `$${num(ans)}$ g`,
        wrong: [`$${m}$ g`, `$${num((m / 40) * 24)}$ g`, `$${num((m / 24) * 40 * 2)}$ g`],
        e: [
          `先求鎂的物質的量：$\\dfrac{${m}}{24} = ${num(m / 24)}$ mol。方程式中 Mg 與 MgO 的係數同為 2，計量比是 1 : 1，故生成 $${num(m / 24)}$ mol MgO，質量為 $${num(m / 24)} \\times 40 = ${num(ans)}$ g。答 $${m}$ g 的學生把質量守恆理解錯了：守恆的是反應物與生成物的【總】質量，氧的質量亦計算在內，故產物必定重於原來的鎂。第二個干擾項把兩個摩爾質量對調。第三個把係數 2 重複計算了一次——係數已在 1 : 1 的比例中反映，不可再乘。`,
          `First, $n(\\text{Mg}) = \\dfrac{${m}}{24} = ${num(m / 24)}$ mol. Mg and MgO both carry the coefficient 2, so the ratio is 1 : 1 and $${num(m / 24)}$ mol of MgO forms, with mass $${num(m / 24)} \\times 40 = ${num(ans)}$ g. Choosing $${m}$ g misreads conservation of mass: what is conserved is the *total* mass including the oxygen, so the product must be heavier than the magnesium. The second distractor swaps the two molar masses; the third applies the coefficient 2 twice, although it is already accounted for in the 1 : 1 ratio.`,
        ],
      }
    },
  },
  {
    key: 'chem_make_solution', topic: T.conc[0], topicZh: T.conc[1], topicEn: T.conc[2],
    diff: 'basic', n: 3,
    gen: (i) => {
      const { m, V } = C1[i]
      const ans = m / 40 / V
      return {
        q: [
          `將 $${m}$ g 氫氧化鈉（摩爾質量 $= 40$ g/mol）完全溶於水中，配成 $${V}$ dm³ 溶液。求該溶液的摩爾濃度。`,
          `$${m}$ g of sodium hydroxide (molar mass $= 40$ g/mol) is dissolved in water to make $${V}$ dm³ of solution. Find its molarity.`,
        ],
        ans: `$${num(ans)}$ mol/dm³`,
        wrong: [`$${num(m / V)}$ mol/dm³`, `$${num((m * 40) / V)}$ mol/dm³`, `$${num((m / 40) * V)}$ mol/dm³`],
        e: [
          `摩爾濃度須以【物質的量】而非質量計算，故要分兩步：先求 $n = \\dfrac{${m}}{40} = ${num(m / 40)}$ mol，再除以體積 $c = \\dfrac{${num(m / 40)}}{${V}} = ${num(ans)}$ mol/dm³。直接用質量除以體積得 $${num(m / V)}$，漏了轉換為物質的量這一步，是本題最常見的錯誤；由單位可以立即察覺——所得的是 g/dm³ 而非 mol/dm³。第二個干擾項把除以摩爾質量誤作乘以摩爾質量；第三個把除以體積誤作乘以體積。`,
          `Molarity is defined per *mole*, not per gram, so two steps are needed: $n = \\dfrac{${m}}{40} = ${num(m / 40)}$ mol, then $c = \\dfrac{${num(m / 40)}}{${V}} = ${num(ans)}$ mol/dm³. Dividing mass by volume directly gives $${num(m / V)}$ and skips the conversion — the units give it away, since that result is g/dm³, not mol/dm³. The second distractor multiplies by the molar mass instead of dividing; the third multiplies by the volume instead of dividing.`,
        ],
      }
    },
  },
  {
    key: 'chem_dilution_units', topic: T.conc[0], topicZh: T.conc[1], topicEn: T.conc[2],
    diff: 'intermediate', n: 3,
    gen: (i) => {
      const { c1, v1, V2 } = C2[i]
      const ans = (c1 * (v1 / 1000)) / V2
      return {
        q: [
          `取 $${v1}$ cm³ 的 $${c1}$ mol/dm³ 鹽酸，加水稀釋至 $${V2}$ dm³。求稀釋後溶液的摩爾濃度。`,
          `$${v1}$ cm³ of $${c1}$ mol/dm³ hydrochloric acid is diluted with water to $${V2}$ dm³. Find the molarity of the diluted solution.`,
        ],
        ans: `$${num(ans)}$ mol/dm³`,
        wrong: [
          `$${num((c1 * v1) / V2)}$ mol/dm³`,
          `$${num((c1 * V2 * 1000) / v1)}$ mol/dm³`,
          `$${num((c1 * (v1 / 1000)) / (V2 - v1 / 1000))}$ mol/dm³`,
        ],
        e: [
          `稀釋只加水，溶質的物質的量不變：$n = ${c1} \\times \\dfrac{${v1}}{1000} = ${num((c1 * v1) / 1000)}$ mol。稀釋後濃度為 $\\dfrac{${num((c1 * v1) / 1000)}}{${V2}} = ${num(ans)}$ mol/dm³。題目一邊用 cm³ 一邊用 dm³，漏了 $1$ dm³ $= 1000$ cm³ 這一步就會得出 $${num((c1 * v1) / V2)}$，即答案大了一千倍——這是本題設下的主要陷阱。第二個干擾項把 $c_1V_1 = c_2V_2$ 的比例倒轉；第三個把「稀釋至 $${V2}$ dm³」誤讀成「加入 $${V2}$ dm³ 的水」，兩者的分別在於前者是最終總體積。`,
          `Dilution adds only water, so the amount of solute is unchanged: $n = ${c1} \\times \\dfrac{${v1}}{1000} = ${num((c1 * v1) / 1000)}$ mol, and the new molarity is $\\dfrac{${num((c1 * v1) / 1000)}}{${V2}} = ${num(ans)}$ mol/dm³. The question mixes cm³ and dm³; missing the $1$ dm³ $= 1000$ cm³ step gives $${num((c1 * v1) / V2)}$, a thousand times too large — the main trap here. The second distractor inverts $c_1V_1 = c_2V_2$; the third reads "diluted to $${V2}$ dm³" as "$${V2}$ dm³ of water added", which is a different final volume.`,
        ],
      }
    },
  },
]

emit('chemistry', 'chem_rep', archs, 'scripts/qbank/drafts/chemistry-replace.json')
