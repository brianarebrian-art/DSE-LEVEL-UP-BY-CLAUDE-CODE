// ============================================================================
// chemistry-median-b1.mts —— 化學：7 個未達中位數嘅課題，補至中位數 57
// ----------------------------------------------------------------------------
// 缺口（npx tsx scripts/qbank/builders/_gap.mts chemistry）：
//   有機化學（高階）36→21 · 氧化還原與平衡 44→13 · 週期表 47→10
//   化學式與式量 47→10 · 氧化還原 49→8 · 有機化學 54→3 · 氣體體積 55→2
//                                                        合共 67 條
// 難度 20 / 34 / 13 = 3 : 5 : 2（憲章 §12）。
//
// ── 現有題庫嘅形狀，決定咗呢批要點寫 ─────────────────────────────────────
// 掃過呢 7 個課題現有嘅題幹之後，見到兩種情況：
//   · gas_volume 51 條入面幾乎全部係「$x$ g $\mathrm{O_2}$ 喺 rtp 佔幾多體積」
//     —— 同一句換質量。formula_mass 47 條全部係「求某化合物中某元素嘅質量百分比」。
//   · periodic_table、redox、organic 三個課題現有嘅係【純概念判斷題】
//     （「氧化的定義（電子觀點）是？」「烷的通式是？」），冇一條要計。
// 所以呢批刻意行相反方向：可計嘅課題改問法（唔再換數字），概念課題就補
// 計算型，令同一個課題入面兩種能力都練到。
//
// ⚠️ 所有化學式、氧化數、配平係數都寫死喺參數表，並喺表旁註明出處式子；
// 生成之後另有一支獨立腳本用【唔同方法】重算（見 commit message）。
// correct-by-construction 只保證代碼同我寫嗰條式一致，式本身錯佢係唔會知嘅。
//
//   npx tsx scripts/qbank/builders/chemistry-median-b1.mts
// ============================================================================
import { emit, type Arch, type Inst } from './_archetype.mts'

const OUT = 'scripts/qbank/drafts/chemistry-median-b1.json'

/** 烷基名稱前綴 —— 1 至 8 個碳。 */
const ALKYL_ZH = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛']
const ALKYL_EN = ['meth', 'eth', 'prop', 'but', 'pent', 'hex', 'hept', 'oct']

/** 分子式排版：C_nH_m…，$1$ 唔寫下標。 */
const sub = (n: number) => (n === 1 ? '' : `_{${n}}`)
const CH = (c: number, h: number, tail = '') => `$\\mathrm{C${sub(c)}H${sub(h)}${tail}}$`

const archs: Arch[] = [

  // ══ 有機化學（高階）21 條 ═════════════════════════════════════════════════
  // 現有 36 條集中喺「不飽和度」。呢五個原型改為【由反應推產物分子式】——
  // 酯化、加成、燃燒配平、相對分子質量、馬氏規則，全部要真係寫得出方程式先答到。
  {
    key: 'co_esterification', topic: 'chem_hell_organic',
    topicZh: '有機化學（高階）', topicEn: 'Organic Chemistry (Advanced)',
    diff: 'intermediate', n: 6,
    gen: (i): Inst => {
      // CH3COOH (C2H4O2) + CnH(2n+1)OH  →  酯 C(n+2)H(2n+4)O2 + H2O
      const n = i + 1
      const eC = n + 2, eH = 2 * n + 4
      return {
        q: [
          `乙酸與含 $${n}$ 個碳原子的直鏈飽和一元醇，在濃硫酸催化下加熱發生酯化反應。所生成的酯，其分子式是甚麼？`,
          `Ethanoic acid reacts with a straight-chain saturated monohydric alcohol containing $${n}$ carbon atom(s), heated with concentrated sulphuric acid as catalyst. What is the molecular formula of the ester formed?`,
        ],
        ans: CH(eC, eH, 'O_{2}'),
        wrong: [CH(eC, 2 * n + 6, 'O_{3}'), CH(eC, 2 * n + 2, 'O_{2}'), CH(n + 1, 2 * n + 2, 'O_{2}')],
        e: [
          `酯化屬縮合反應：酸的 $\\mathrm{-OH}$ 與醇的 $\\mathrm{-H}$ 結合成一分子水離去。`
          + `乙酸為 $\\mathrm{C_{2}H_{4}O_{2}}$，該醇為 $\\mathrm{C${sub(n)}H${sub(2 * n + 2)}O}$，`
          + `相加得 $\\mathrm{C${sub(eC)}H${sub(2 * n + 6)}O_{3}}$，再減去 $\\mathrm{H_{2}O}$，`
          + `即得 $\\mathrm{C${sub(eC)}H${sub(eH)}O_{2}}$。`
          + `寫成 $\\mathrm{C${sub(eC)}H${sub(2 * n + 6)}O_{3}}$ 的，是把兩個反應物直接相加而忘記脫水，氧原子因而多了一個。`
          + `寫成 $\\mathrm{C${sub(eC)}H${sub(2 * n + 2)}O_{2}}$ 的，減去了 $\\mathrm{H_{2}O}$ 的兩個氫卻連氧也一併減走，等於減了兩次。`
          + `寫成 $\\mathrm{C${sub(n + 1)}H${sub(2 * n + 2)}O_{2}}$ 的，碳數只加了 $1$，漏了乙酸本身有兩個碳。`,
          `Esterification is a condensation: the $\\mathrm{-OH}$ of the acid and the $\\mathrm{-H}$ of the alcohol leave as one molecule of water. `
          + `Ethanoic acid is $\\mathrm{C_{2}H_{4}O_{2}}$ and the alcohol is $\\mathrm{C${sub(n)}H${sub(2 * n + 2)}O}$; adding them gives $\\mathrm{C${sub(eC)}H${sub(2 * n + 6)}O_{3}}$, and removing $\\mathrm{H_{2}O}$ leaves $\\mathrm{C${sub(eC)}H${sub(eH)}O_{2}}$. `
          + `The option with three oxygens adds the reactants without losing water. `
          + `The option with $\\mathrm{H${sub(2 * n + 2)}}$ removes the oxygen of the water twice. `
          + `The option with $${n + 1}$ carbons forgets that ethanoic acid contributes two carbons.`,
        ],
      }
    },
  },
  {
    key: 'co_combustion_oxygen', topic: 'chem_hell_organic',
    topicZh: '有機化學（高階）', topicEn: 'Organic Chemistry (Advanced)',
    diff: 'hard', n: 6,
    gen: (i): Inst => {
      // CnH(2n+2) + (3n+1)/2 O2 → n CO2 + (n+1) H2O
      const n = i + 2
      const o2 = (3 * n + 1) / 2
      const fmt = (x: number) => `$${Number.isInteger(x) ? x : x.toFixed(1)}$`
      return {
        q: [
          `$1$ mol 的 ${CH(n, 2 * n + 2)}（直鏈烷）完全燃燒，需要多少 mol 氧氣？`,
          `How many moles of oxygen are required for the complete combustion of $1$ mol of ${CH(n, 2 * n + 2)} (a straight-chain alkane)?`,
        ],
        ans: fmt(o2),
        wrong: [fmt(n), fmt(n + 1), fmt(3 * n + 1)],
        e: [
          `完全燃燒的產物為 $${n}$ mol $\\mathrm{CO_{2}}$ 與 $${n + 1}$ mol $\\mathrm{H_{2}O}$，`
          + `合共需要 $2 \\times ${n} + ${n + 1} = ${3 * n + 1}$ 個氧原子，即 $\\dfrac{${3 * n + 1}}{2} = ${o2}$ mol $\\mathrm{O_{2}}$。`
          + `答 ${fmt(n)} 的只數了二氧化碳而漏了水。`
          + `答 ${fmt(n + 1)} 的只數了水而漏了二氧化碳。`
          + `答 ${fmt(3 * n + 1)} 的數對了氧【原子】總數，但題目問的是氧【分子】的物質的量，須再除以 $2$ —— 這一步是本題最常見的失分位。`,
          `Complete combustion gives $${n}$ mol $\\mathrm{CO_{2}}$ and $${n + 1}$ mol $\\mathrm{H_{2}O}$, requiring $2 \\times ${n} + ${n + 1} = ${3 * n + 1}$ oxygen atoms, i.e. $\\dfrac{${3 * n + 1}}{2} = ${o2}$ mol $\\mathrm{O_{2}}$. `
          + `The option ${fmt(n)} counts only the carbon dioxide; ${fmt(n + 1)} counts only the water. `
          + `The option ${fmt(3 * n + 1)} counts oxygen *atoms* correctly but does not halve to get oxygen *molecules* — the usual place marks are lost here.`,
        ],
      }
    },
  },
  {
    key: 'co_bromine_addition', topic: 'chem_hell_organic',
    topicZh: '有機化學（高階）', topicEn: 'Organic Chemistry (Advanced)',
    diff: 'intermediate', n: 6,
    gen: (i): Inst => {
      // CnH2n (一個 C=C) + Br2 → CnH2nBr2（加成，唔放出 HBr）
      const n = i + 2
      return {
        q: [
          `${CH(n, 2 * n)}（分子中含一個碳碳雙鍵）與足量溴水完全反應。所得有機產物的分子式是甚麼？`,
          `${CH(n, 2 * n)}, containing one carbon–carbon double bond, reacts completely with excess bromine water. What is the molecular formula of the organic product?`,
        ],
        ans: CH(n, 2 * n, 'Br_{2}'),
        wrong: [CH(n, 2 * n - 1, 'Br'), CH(n, 2 * n, 'Br_{4}'), CH(n, 2 * n + 2, 'Br_{2}')],
        e: [
          `雙鍵打開後，兩個溴原子分別加到相鄰的兩個碳上，屬【加成】反應：氫原子一個都不會離開，`
          + `故產物為 $\\mathrm{C${sub(n)}H${sub(2 * n)}Br_{2}}$。`
          + `寫成 $\\mathrm{C${sub(n)}H${sub(2 * n - 1)}Br}$ 的，是把它當成【取代】反應 —— 取代會放出 $\\mathrm{HBr}$，那是烷在紫外光下的反應，不是烯與溴水的反應。`
          + `寫成 $\\mathrm{C${sub(n)}H${sub(2 * n)}Br_{4}}$ 的，加了兩分子溴，但分子中只有一個雙鍵，只能加一分子。`
          + `寫成 $\\mathrm{C${sub(n)}H${sub(2 * n + 2)}Br_{2}}$ 的，把氫數當成了烷的 $2n+2$，忽略了原化合物是烯。`
          + `這個反應同時是區分烷與烯的測試：溴水的橙色會褪去。`,
          `The double bond opens and one bromine atom adds to each of the two carbons — an *addition*, so no hydrogen is lost and the product is $\\mathrm{C${sub(n)}H${sub(2 * n)}Br_{2}}$. `
          + `The option $\\mathrm{C${sub(n)}H${sub(2 * n - 1)}Br}$ treats it as a substitution, which releases $\\mathrm{HBr}$ and is the reaction of an alkane under UV light. `
          + `The option with $\\mathrm{Br_{4}}$ adds two bromine molecules, but there is only one double bond. `
          + `The option with $\\mathrm{H${sub(2 * n + 2)}}$ uses the alkane hydrogen count. `
          + `This reaction is also the test that distinguishes alkanes from alkenes: the orange colour of bromine water fades.`,
        ],
      }
    },
  },
  {
    key: 'co_carboxylic_mr', topic: 'chem_hell_organic',
    topicZh: '有機化學（高階）', topicEn: 'Organic Chemistry (Advanced)',
    diff: 'intermediate', n: 2,
    gen: (i): Inst => {
      // CnH(2n+1)COOH：Mr = 12(n+1) + (2n+2) + 32 = 14n + 46
      const n = i + 1
      const mr = 14 * n + 46
      return {
        q: [
          `直鏈飽和一元羧酸 $\\mathrm{C${sub(n)}H${sub(2 * n + 1)}COOH}$ 的相對分子質量是多少？（相對原子質量：$\\mathrm{H}=1$、$\\mathrm{C}=12$、$\\mathrm{O}=16$）`,
          `What is the relative molecular mass of the straight-chain saturated monocarboxylic acid $\\mathrm{C${sub(n)}H${sub(2 * n + 1)}COOH}$? (Relative atomic masses: $\\mathrm{H}=1$, $\\mathrm{C}=12$, $\\mathrm{O}=16$)`,
        ],
        ans: `$${mr}$`,
        wrong: [`$${mr - 2}$`, `$${mr - 16}$`, `$${mr + 16}$`],
        e: [
          `整個分子共有 $${n + 1}$ 個碳、$${2 * n + 2}$ 個氫、$2$ 個氧：`
          + `$12 \\times ${n + 1} + 1 \\times ${2 * n + 2} + 16 \\times 2 = ${mr}$。`
          + `答 $${mr - 2}$ 的漏數了 $\\mathrm{-COOH}$ 上的那個氫（羧基本身有一個氫，烷基上有 $${2 * n + 1}$ 個）。`
          + `答 $${mr - 16}$ 的只計了一個氧，但羧基 $\\mathrm{-COOH}$ 含兩個氧。`
          + `答 $${mr + 16}$ 的多計了一個氧。`
          + `數原子時把 $\\mathrm{-COOH}$ 拆開來數（$1$ 個 C、$2$ 個 O、$1$ 個 H），可避免這三種錯。`,
          `The molecule contains $${n + 1}$ carbons, $${2 * n + 2}$ hydrogens and $2$ oxygens: $12 \\times ${n + 1} + 1 \\times ${2 * n + 2} + 16 \\times 2 = ${mr}$. `
          + `The option $${mr - 2}$ misses the hydrogen of the $\\mathrm{-COOH}$ group. `
          + `The option $${mr - 16}$ counts only one oxygen; $${mr + 16}$ counts three. `
          + `Counting $\\mathrm{-COOH}$ explicitly as 1 C, 2 O and 1 H avoids all three.`,
        ],
      }
    },
  },
  {
    key: 'co_markovnikov', topic: 'chem_hell_organic',
    topicZh: '有機化學（高階）', topicEn: 'Organic Chemistry (Advanced)',
    diff: 'hard', n: 1,
    gen: (): Inst => ({
      q: [
        '丙烯 $\\mathrm{CH_{3}CH{=}CH_{2}}$ 與溴化氫 $\\mathrm{HBr}$ 加成，主要產物是甚麼？',
        'Propene, $\\mathrm{CH_{3}CH{=}CH_{2}}$, undergoes addition with hydrogen bromide $\\mathrm{HBr}$. What is the major product?',
      ],
      ans: '$\\mathrm{CH_{3}CHBrCH_{3}}$',
      wrong: ['$\\mathrm{CH_{3}CH_{2}CH_{2}Br}$', '$\\mathrm{CH_{3}CHBrCH_{2}Br}$', '$\\mathrm{CH_{3}CH{=}CHBr}$'],
      e: [
        '不對稱烯與 $\\mathrm{HBr}$ 加成時，氫會加到【本身已連較多氫】的那個雙鍵碳上，溴則加到另一個碳，'
        + '主要產物為 $\\mathrm{CH_{3}CHBrCH_{3}}$（$2$-溴丙烷）。'
        + '原因是這樣形成的碳正離子連着兩個烷基，較為穩定，反應途徑的能壘較低。'
        + '答 $\\mathrm{CH_{3}CH_{2}CH_{2}Br}$ 的把加成方向倒轉，那是次要產物而非主要產物。'
        + '答 $\\mathrm{CH_{3}CHBrCH_{2}Br}$ 的加了兩個溴，但 $\\mathrm{HBr}$ 每分子只提供一個溴。'
        + '答 $\\mathrm{CH_{3}CH{=}CHBr}$ 的仍然保留雙鍵，那屬取代而非加成 —— 加成之後雙鍵必定消失。',
        'When an unsymmetrical alkene adds $\\mathrm{HBr}$, the hydrogen goes to the double-bond carbon that already carries more hydrogens, giving $\\mathrm{CH_{3}CHBrCH_{3}}$ (2-bromopropane) as the major product. '
        + 'The carbocation formed this way bears two alkyl groups and is more stable, so that pathway has the lower barrier. '
        + 'The option $\\mathrm{CH_{3}CH_{2}CH_{2}Br}$ reverses the orientation and is the minor product. '
        + 'The option with two bromines cannot arise, as each $\\mathrm{HBr}$ supplies one bromine. '
        + 'The option retaining the double bond describes a substitution; after an addition the double bond is always gone.',
      ],
    }),
  },

  // ══ 氧化還原與平衡（高階）13 條 ═══════════════════════════════════════════
  // 現有 44 條集中喺「求氧化數」同「勒沙特列判斷移動方向」。呢三個原型改為
  // 【由電子數推化學計量】、【由平衡濃度計 Kc】同【平衡常數本身嘅意義】。
  {
    key: 'cr_electron_stoichiometry', topic: 'chem_hell_redox_equil',
    topicZh: '氧化還原與平衡', topicEn: 'Redox & Equilibrium',
    diff: 'intermediate', n: 6,
    gen: (i): Inst => {
      // [氧化劑, 產物, 每 mol 得電子數]
      const OX: [string, string, number][] = [
        ['\\mathrm{MnO_{4}^{-}}', '\\mathrm{Mn^{2+}}', 5],
        ['\\mathrm{Cr_{2}O_{7}^{2-}}', '\\mathrm{Cr^{3+}}', 6],
        ['\\mathrm{MnO_{2}}', '\\mathrm{Mn^{2+}}', 2],
        ['\\mathrm{ClO_{3}^{-}}', '\\mathrm{Cl^{-}}', 6],
        ['\\mathrm{NO_{3}^{-}}', '\\mathrm{NO}', 3],
        ['\\mathrm{H_{2}O_{2}}', '\\mathrm{H_{2}O}', 2],
      ]
      const [ox, prod, e] = OX[i]
      // Fe²⁺ → Fe³⁺ 每 mol 失 1 個電子，故 1 mol 氧化劑可氧化 e mol Fe²⁺。
      return {
        q: [
          `在酸性溶液中，$1$ mol $${ox}$ 被還原為 $${prod}$。它最多可以把多少 mol 的 $\\mathrm{Fe^{2+}}$ 氧化成 $\\mathrm{Fe^{3+}}$？`,
          `In acidic solution, $1$ mol of $${ox}$ is reduced to $${prod}$. What is the maximum number of moles of $\\mathrm{Fe^{2+}}$ it can oxidise to $\\mathrm{Fe^{3+}}$?`,
        ],
        ans: `$${e}$`,
        wrong: [`$${e * 2}$`, `$1$`, `$${e + 1}$`],
        e: [
          `氧化還原反應中，氧化劑得到的電子總數必定等於還原劑失去的電子總數。`
          + `$1$ mol $${ox}$ 還原成 $${prod}$ 時得到 $${e}$ mol 電子；`
          + `而每 $1$ mol $\\mathrm{Fe^{2+}}$ 氧化成 $\\mathrm{Fe^{3+}}$ 只失去 $1$ mol 電子，`
          + `故可氧化 $\\dfrac{${e}}{1} = ${e}$ mol。`
          + `答 $${e * 2}$ 的把電子數乘了 $2$，那對應 $\\mathrm{Fe^{2+}}$ 每 mol 失兩個電子，但鐵由 $+2$ 變 $+3$ 只變了一價。`
          + `答 $1$ 的按化學式的係數 $1 : 1$ 配對，忽略了兩邊得失電子數不同。`
          + `答 $${e + 1}$ 的把氧化數的【變化量】與【電子數】混淆，多算了一個。`,
          `In a redox reaction the electrons gained by the oxidant equal those lost by the reductant. `
          + `$1$ mol of $${ox}$ gains $${e}$ mol of electrons, while each mole of $\\mathrm{Fe^{2+}}$ oxidised to $\\mathrm{Fe^{3+}}$ loses only $1$ mol, so $${e}$ mol can be oxidised. `
          + `The option $${e * 2}$ doubles the electron count, as if iron changed by two units. `
          + `The option $1$ pairs the species $1 : 1$, ignoring the different electron counts. `
          + `The option $${e + 1}$ confuses the change in oxidation number with the electron count.`,
        ],
      }
    },
  },
  {
    key: 'cr_kc_value', topic: 'chem_hell_redox_equil',
    topicZh: '氧化還原與平衡', topicEn: 'Redox & Equilibrium',
    diff: 'hard', n: 6,
    gen: (i): Inst => {
      // H2 + I2 ⇌ 2HI，Kc = [HI]² / ([H2][I2])
      const P: [number, number, number][] = [
        [1, 3, 6], [1, 4, 8], [1, 5, 10], [2, 3, 12], [1, 6, 6], [2, 4, 8],
      ]
      const [a, b, c] = P[i]
      const kc = (c * c) / (a * b)
      return {
        q: [
          `反應 $\\mathrm{H_{2}(g) + I_{2}(g) \\rightleftharpoons 2HI(g)}$ 達至平衡。平衡時 $[\\mathrm{H_{2}}] = ${a}$、$[\\mathrm{I_{2}}] = ${b}$、$[\\mathrm{HI}] = ${c}$（單位均為 $\\mathrm{mol\\,dm^{-3}}$）。求平衡常數 $K_c$。`,
          `The reaction $\\mathrm{H_{2}(g) + I_{2}(g) \\rightleftharpoons 2HI(g)}$ reaches equilibrium with $[\\mathrm{H_{2}}] = ${a}$, $[\\mathrm{I_{2}}] = ${b}$ and $[\\mathrm{HI}] = ${c}$ (all in $\\mathrm{mol\\,dm^{-3}}$). Find the equilibrium constant $K_c$.`,
        ],
        ans: `$${kc}$`,
        wrong: [`$${c / (a * b)}$`, `$${c * c - a * b}$`, `$${a * b * c}$`],
        e: [
          `$K_c = \\dfrac{[\\mathrm{HI}]^{2}}{[\\mathrm{H_{2}}][\\mathrm{I_{2}}]} = \\dfrac{${c}^{2}}{${a} \\times ${b}} = \\dfrac{${c * c}}{${a * b}} = ${kc}$。`
          + `方程式中 $\\mathrm{HI}$ 的係數 $2$ 要寫成【指數】而非乘數 —— 答 $${c / (a * b)}$ 的正是把 $[\\mathrm{HI}]$ 直接代入而沒有平方。`
          + `答 $${c * c - a * b}$ 的用了相減，但平衡常數的定義是產物項除以反應物項。`
          + `答 $${a * b * c}$ 的把三個濃度相乘，既沒有分子分母之分，也沒有處理係數。`
          + `留意 $K_c$ 只隨溫度改變；改變濃度或壓力只會令系統重新達至同一個 $K_c$，不會改變它的數值。`,
          `$K_c = \\dfrac{[\\mathrm{HI}]^{2}}{[\\mathrm{H_{2}}][\\mathrm{I_{2}}]} = \\dfrac{${c * c}}{${a * b}} = ${kc}$. `
          + `The coefficient $2$ becomes an *exponent*, not a multiplier — the option $${c / (a * b)}$ omits the square. `
          + `The option $${c * c - a * b}$ subtracts instead of dividing. `
          + `The option $${a * b * c}$ multiplies all three concentrations. `
          + `Note that $K_c$ changes only with temperature; altering concentration or pressure shifts the system back to the same $K_c$.`,
        ],
      }
    },
  },
  {
    key: 'cr_kc_meaning', topic: 'chem_hell_redox_equil',
    topicZh: '氧化還原與平衡', topicEn: 'Redox & Equilibrium',
    diff: 'basic', n: 1,
    gen: (): Inst => ({
      q: [
        '某可逆反應在指定溫度下的平衡常數 $K_c$ 遠大於 $1$。這代表甚麼？',
        'For a reversible reaction at a given temperature, the equilibrium constant $K_c$ is much greater than $1$. What does this indicate?',
      ],
      ans: '平衡時產物的濃度遠高於反應物',
      ansEn: 'At equilibrium the concentrations of the products are much higher than those of the reactants',
      wrong: ['反應速率很快', '正反應為放熱反應', '反應一旦開始便不可逆轉'],
      wrongEn: [
        'The reaction proceeds very quickly',
        'The forward reaction is exothermic',
        'The reaction cannot be reversed once started',
      ],
      e: [
        '$K_c$ 是平衡時產物項與反應物項的比值，故 $K_c \\gg 1$ 只說明【平衡的位置】偏向產物一方，'
        + '即平衡時產物濃度遠高於反應物。'
        + '它與反應【快慢】無關 —— 速率由活化能與催化劑決定，一個 $K_c$ 很大的反應也可以慢到常溫下觀察不到。'
        + '它亦不能判斷放熱或吸熱 —— 那要看 $\\Delta H$；$K_c$ 只是在該溫度下的一個定值。'
        + '而「不可逆轉」更與事實相反：$K_c$ 是【可逆】反應才有的量，正逆反應一直同時進行，只是速率相等而已。',
        '$K_c$ is the ratio of product terms to reactant terms at equilibrium, so $K_c \\gg 1$ tells us only about the *position* of equilibrium: products dominate. '
        + 'It says nothing about *rate*, which depends on activation energy and catalysis — a reaction with a large $K_c$ can still be immeasurably slow. '
        + 'Nor does it indicate whether the reaction is exothermic; that is given by $\\Delta H$. '
        + 'And irreversibility is the opposite of the truth: $K_c$ exists only for reversible reactions, where both directions proceed at equal rates.',
      ],
    }),
  },

  // ══ 週期表 10 條 ══════════════════════════════════════════════════════════
  // 現有 47 條全部係概念判斷（「同一族有相同數目的？」）。呢兩個原型補【由
  // 原子序推電子排布】—— 同樣考週期表，但要真係寫得出排布先答到。
  {
    key: 'pt_outer_shell', topic: 'periodic_table',
    topicZh: '週期表', topicEn: 'Periodic Table',
    diff: 'basic', n: 6,
    gen: (i): Inst => {
      // 第 3 週期：Na(11)…Cl(17)。最外殼電子數 = Z − 10。
      const Z = [11, 13, 14, 15, 16, 17][i]
      const SYM = { 11: '\\mathrm{Na}', 13: '\\mathrm{Al}', 14: '\\mathrm{Si}', 15: '\\mathrm{P}', 16: '\\mathrm{S}', 17: '\\mathrm{Cl}' }[Z]!
      const outer = Z - 10
      return {
        q: [
          `元素 $${SYM}$ 的原子序為 $${Z}$。其原子的最外電子殼有多少個電子？`,
          `The element $${SYM}$ has atomic number $${Z}$. How many electrons are in the outermost shell of its atom?`,
        ],
        ans: `$${outer}$`,
        wrong: [`$${Z}$`, `$${Z - 2}$`, `$${8 - outer}$`],
        e: [
          `原子序 $${Z}$ 即有 $${Z}$ 個電子，按 $2, 8, 8$ 的次序填入：`
          + `第一殼 $2$ 個、第二殼 $8$ 個，餘下 $${Z} - 10 = ${outer}$ 個在第三殼，故最外殼有 $${outer}$ 個電子。`
          + `答 $${Z}$ 的把電子總數當成最外殼電子數。`
          + `答 $${Z - 2}$ 的只扣了第一殼的 $2$ 個，忘記第二殼還可容納 $8$ 個。`
          + `答 $${8 - outer}$ 的求的是「還差多少個電子才填滿最外殼」，那決定該元素常見的化合價，但不是最外殼現有的電子數。`
          + `最外殼電子數等於該元素在週期表中的族數（第 $1$、$2$ 族及第 $13$ 至 $18$ 族），這是判斷化學性質的起點。`,
          `Atomic number $${Z}$ means $${Z}$ electrons, filled as $2, 8, 8$: two in the first shell, eight in the second, leaving $${Z} - 10 = ${outer}$ in the third. `
          + `The option $${Z}$ uses the total electron count. `
          + `The option $${Z - 2}$ subtracts only the first shell. `
          + `The option $${8 - outer}$ gives how many more electrons are needed to fill the shell, which governs the usual valency but is not the count asked for. `
          + `The outermost electron count equals the group number and is the starting point for predicting chemical behaviour.`,
        ],
      }
    },
  },
  {
    key: 'pt_isoelectronic_ion', topic: 'periodic_table',
    topicZh: '週期表', topicEn: 'Periodic Table',
    diff: 'intermediate', n: 4,
    gen: (i): Inst => {
      // 離子電子數 = 稀有氣體電子數；原子序 = 電子數 + 電荷
      const P: [string, number, number, string][] = [
        ['\\mathrm{X^{2+}}', 2, 10, '\\mathrm{Ne}'],
        ['\\mathrm{Y^{-}}', -1, 18, '\\mathrm{Ar}'],
        ['\\mathrm{Z^{3+}}', 3, 10, '\\mathrm{Ne}'],
        ['\\mathrm{W^{2-}}', -2, 18, '\\mathrm{Ar}'],
      ]
      const [ion, charge, eCount, gas] = P[i]
      const Zn = eCount + charge
      return {
        q: [
          `離子 $${ion}$ 的電子排布與 $${gas}$ 相同（$${gas}$ 有 $${eCount}$ 個電子）。該元素的原子序是多少？`,
          `The ion $${ion}$ has the same electron arrangement as $${gas}$, which has $${eCount}$ electrons. What is the atomic number of the element?`,
        ],
        ans: `$${Zn}$`,
        wrong: [`$${eCount}$`, `$${eCount - charge}$`, `$${eCount + 2 * charge}$`],
        e: [
          `${charge > 0 ? `陽離子是原子【失去】 $${charge}$ 個電子而成，故原子的電子數比離子多 $${charge}$ 個` : `陰離子是原子【得到】 $${Math.abs(charge)}$ 個電子而成，故原子的電子數比離子少 $${Math.abs(charge)}$ 個`}：`
          + `$${eCount} ${charge > 0 ? '+' : '-'} ${Math.abs(charge)} = ${Zn}$。中性原子的電子數等於質子數，故原子序為 $${Zn}$。`
          + `答 $${eCount}$ 的直接用了離子的電子數，忘記離子的電子數已不等於質子數。`
          + `答 $${eCount - charge}$ 的把加減方向弄反了。`
          + `答 $${eCount + 2 * charge}$ 的把電荷數算了兩次。`
          + `關鍵在於：原子序看的是【質子】數，而形成離子時質子數從不改變，改變的只有電子。`,
          `${charge > 0 ? `A cation forms by *losing* $${charge}$ electron(s), so the atom has $${charge}$ more` : `An anion forms by *gaining* $${Math.abs(charge)}$ electron(s), so the atom has $${Math.abs(charge)}$ fewer`}: `
          + `$${eCount} ${charge > 0 ? '+' : '-'} ${Math.abs(charge)} = ${Zn}$. A neutral atom has equal electrons and protons, so the atomic number is $${Zn}$. `
          + `The option $${eCount}$ uses the ion's electron count. `
          + `The option $${eCount - charge}$ reverses the direction. `
          + `The option $${eCount + 2 * charge}$ applies the charge twice. `
          + `The atomic number counts *protons*, which never change when an ion forms.`,
        ],
      }
    },
  },

  // ══ 化學式與式量 10 條 ════════════════════════════════════════════════════
  // 現有 47 條全部係「求某元素嘅質量百分比」。呢兩個原型改為【由實驗式同 Mr
  // 推分子式】同【由物質的量反推 Mr】。
  {
    key: 'fm_empirical_to_molecular', topic: 'formula_mass',
    topicZh: '化學式與式量', topicEn: 'Chemical Formulae & Formula Mass',
    diff: 'basic', n: 6,
    gen: (i): Inst => {
      // 實驗式 CH2（式量 14），分子式 = (CH2)k
      const k = i + 2
      const mr = 14 * k
      return {
        q: [
          `某烴的實驗式為 $\\mathrm{CH_{2}}$，相對分子質量為 $${mr}$。其分子式是甚麼？（$\\mathrm{H}=1$、$\\mathrm{C}=12$）`,
          `A hydrocarbon has empirical formula $\\mathrm{CH_{2}}$ and relative molecular mass $${mr}$. What is its molecular formula? ($\\mathrm{H}=1$, $\\mathrm{C}=12$)`,
        ],
        ans: CH(k, 2 * k),
        wrong: [CH(1, 2), CH(mr, 2 * mr), CH(k, k)],
        e: [
          `實驗式 $\\mathrm{CH_{2}}$ 的式量為 $12 + 2 = 14$。`
          + `分子式必為實驗式的整數倍：$${mr} \\div 14 = ${k}$，故分子式為 $\\mathrm{C${sub(k)}H${sub(2 * k)}}$。`
          + `答 $\\mathrm{CH_{2}}$ 的把實驗式當成分子式 —— 兩者只在倍數為 $1$ 時才相同，這裏是 $${k}$ 倍。`
          + `答 $\\mathrm{C${sub(mr)}H${sub(2 * mr)}}$ 的把相對分子質量當成了碳原子數目。`
          + `答 $\\mathrm{C${sub(k)}H${sub(k)}}$ 的碳氫比寫成 $1 : 1$，與實驗式 $\\mathrm{CH_{2}}$ 的 $1 : 2$ 不符。`
          + `實驗式只給出【最簡整數比】，要定分子式必須另外知道相對分子質量。`,
          `The empirical formula $\\mathrm{CH_{2}}$ has formula mass $12 + 2 = 14$. The molecular formula is a whole-number multiple: $${mr} \\div 14 = ${k}$, giving $\\mathrm{C${sub(k)}H${sub(2 * k)}}$. `
          + `The option $\\mathrm{CH_{2}}$ treats the empirical formula as the molecular formula. `
          + `The option with $${mr}$ carbons uses the relative molecular mass as the carbon count. `
          + `The option $\\mathrm{C${sub(k)}H${sub(k)}}$ has a $1 : 1$ ratio, contradicting $\\mathrm{CH_{2}}$. `
          + `An empirical formula gives only the simplest ratio; the relative molecular mass is needed to fix the molecular formula.`,
        ],
      }
    },
  },
  {
    key: 'fm_mr_from_moles', topic: 'formula_mass',
    topicZh: '化學式與式量', topicEn: 'Chemical Formulae & Formula Mass',
    diff: 'intermediate', n: 4,
    gen: (i): Inst => {
      // Mr = 質量 ÷ 物質的量
      const P: [number, number][] = [[36, 0.5], [88, 2], [30, 0.25], [117, 2]]
      const [mass, mol] = P[i]
      const mr = mass / mol
      return {
        q: [
          `$${mass}$ g 的某化合物含有 $${mol}$ mol 該化合物。其相對分子質量是多少？`,
          `$${mass}$ g of a compound contains $${mol}$ mol of that compound. What is its relative molecular mass?`,
        ],
        ans: `$${mr}$`,
        wrong: [`$${mass * mol}$`, `$${mass}$`, `$${Math.round((mol / mass) * 1000) / 1000}$`],
        e: [
          `物質的量 $=\\dfrac{\\text{質量}}{\\text{摩爾質量}}$，故摩爾質量 $=\\dfrac{${mass}}{${mol}} = ${mr}\\ \\mathrm{g\\,mol^{-1}}$，`
          + `相對分子質量在數值上與摩爾質量相同，即 $${mr}$。`
          + `答 $${mass * mol}$ 的把兩個數相乘，方向剛好倒轉。`
          + `答 $${mass}$ 的直接用了質量，那只在物質的量恰好為 $1$ mol 時才成立。`
          + `答 $${Math.round((mol / mass) * 1000) / 1000}$ 的把分子分母對調。`
          + `檢查的方法：摩爾質量的單位是 $\\mathrm{g\\,mol^{-1}}$，所以一定是「克」除以「摩爾」，而不是相乘。`,
          `Amount $=\\dfrac{\\text{mass}}{\\text{molar mass}}$, so the molar mass is $\\dfrac{${mass}}{${mol}} = ${mr}\\ \\mathrm{g\\,mol^{-1}}$, and the relative molecular mass is numerically the same, $${mr}$. `
          + `The option $${mass * mol}$ multiplies instead of dividing. `
          + `The option $${mass}$ uses the mass directly, valid only if the amount were exactly $1$ mol. `
          + `The option $${Math.round((mol / mass) * 1000) / 1000}$ inverts the fraction. `
          + `The unit $\\mathrm{g\\,mol^{-1}}$ is the check: grams divided by moles.`,
        ],
      }
    },
  },

  // ══ 氧化還原 8 條 ═════════════════════════════════════════════════════════
  // 現有 49 條全部係定義題（「氧化的定義（電子觀點）是？」）。呢兩個原型補
  // 【判斷氧化劑】同【由氧化數變化定係數】，把定義用落去。
  {
    key: 'rx_identify_oxidant', topic: 'redox',
    topicZh: '氧化還原', topicEn: 'Redox Reactions',
    diff: 'basic', n: 4,
    gen: (i): Inst => {
      // [方程式, 氧化劑, 還原劑, 兩個唔參與氧化還原嘅物種]
      const P: [string, string, string, string, string][] = [
        ['\\mathrm{Zn + CuSO_{4} \\rightarrow ZnSO_{4} + Cu}', '\\mathrm{CuSO_{4}}', '\\mathrm{Zn}', '\\mathrm{ZnSO_{4}}', '\\mathrm{SO_{4}^{2-}}'],
        ['\\mathrm{Fe + Cl_{2} \\rightarrow FeCl_{2}}', '\\mathrm{Cl_{2}}', '\\mathrm{Fe}', '\\mathrm{FeCl_{2}}', '\\mathrm{Cl^{-}}'],
        ['\\mathrm{Mg + 2HCl \\rightarrow MgCl_{2} + H_{2}}', '\\mathrm{HCl}', '\\mathrm{Mg}', '\\mathrm{MgCl_{2}}', '\\mathrm{H_{2}}'],
        ['\\mathrm{2Na + Br_{2} \\rightarrow 2NaBr}', '\\mathrm{Br_{2}}', '\\mathrm{Na}', '\\mathrm{NaBr}', '\\mathrm{Na^{+}}'],
      ]
      const [eqn, oxidant, reductant, product, spectator] = P[i]
      return {
        q: [
          `在反應 $${eqn}$ 中，哪一種物質是氧化劑？`,
          `In the reaction $${eqn}$, which substance is the oxidising agent?`,
        ],
        ans: `$${oxidant}$`,
        wrong: [`$${reductant}$`, `$${product}$`, `$${spectator}$`],
        e: [
          `氧化劑是【使他物氧化、自己被還原】的物質，即在反應中【得到】電子的一方。`
          + `$${oxidant}$ 在此反應中得到電子（其中元素的氧化數下降），故為氧化劑。`
          + `$${reductant}$ 失去電子、氧化數上升，是還原劑 —— 兩者角色相反，最易混淆。`
          + `$${product}$ 是生成物，反應完成後才出現，不能同時是反應中的氧化劑。`
          + `$${spectator}$ 在反應前後的氧化數不變，屬旁觀者，並未參與電子轉移。`
          + `判斷次序：先寫出各元素的氧化數，再看哪一種物質的氧化數下降 —— 下降者得電子，即氧化劑。`,
          `An oxidising agent oxidises something else and is itself reduced: it *gains* electrons. `
          + `$${oxidant}$ gains electrons here (its element's oxidation number falls), so it is the oxidising agent. `
          + `$${reductant}$ loses electrons and is the reducing agent — the opposite role, and the easiest confusion. `
          + `$${product}$ is a product, formed only after the reaction. `
          + `$${spectator}$ keeps the same oxidation number throughout and is a spectator. `
          + `Assign oxidation numbers first, then look for the species whose number falls.`,
        ],
      }
    },
  },
  {
    key: 'rx_oxidation_number_change', topic: 'redox',
    topicZh: '氧化還原', topicEn: 'Redox Reactions',
    diff: 'intermediate', n: 4,
    gen: (i): Inst => {
      // 由氧化數變化求每 mol 轉移電子數（升為失、降為得）
      const P: [string, string, number, number][] = [
        ['\\mathrm{S}', '\\mathrm{H_{2}SO_{4}}', 0, 6],
        ['\\mathrm{C}', '\\mathrm{CO_{2}}', 0, 4],
        ['\\mathrm{N}', '\\mathrm{NH_{3}}', 0, -3],
        ['\\mathrm{Cl}', '\\mathrm{HClO_{3}}', 0, 5],
      ]
      const [el, cmpd, from, to] = P[i]
      const change = to - from
      const lost = Math.abs(change)
      const word = change > 0 ? '失去' : '得到'
      const wordEn = change > 0 ? 'loses' : 'gains'
      return {
        q: [
          `元素 $${el}$ 由單質狀態（氧化數 $0$）轉變為 $${cmpd}$ 中的狀態。每個 $${el}$ 原子在此過程中得到還是失去電子？數目是多少？`,
          `The element $${el}$ changes from its elemental state (oxidation number $0$) to its state in $${cmpd}$. Does each $${el}$ atom gain or lose electrons, and how many?`,
        ],
        ans: `${word} $${lost}$ 個`,
        ansEn: `${wordEn} $${lost}$`,
        wrong: [`${change > 0 ? '得到' : '失去'} $${lost}$ 個`, `${word} $${lost + 1}$ 個`, `${word} $${Math.abs(to)}$ 個，即等於氧化數本身`],
        wrongEn: [
          `${change > 0 ? 'gains' : 'loses'} $${lost}$`,
          `${wordEn} $${lost + 1}$`,
          `${wordEn} $${Math.abs(to)}$, equal to the oxidation number itself`,
        ],
        e: [
          `$${el}$ 在 $${cmpd}$ 中的氧化數為 $${to}$，由 $0$ 變為 $${to}$，變化量為 $${change}$。`
          + `氧化數【上升】代表失去電子（被氧化），【下降】代表得到電子（被還原）；`
          + `此處氧化數${change > 0 ? '上升' : '下降'}，故每個原子${word} $${lost}$ 個電子。`
          + `把方向答反的，正是把「氧化數上升」與「得到電子」配對了 —— 電子帶負電，多得一個電子會令氧化數【下降】而非上升。`
          + `答${word} $${lost + 1}$ 個的，多數了一個。`
          + `答等於氧化數本身的，在起始氧化數為 $0$ 時看似相同，但只要起點不是 $0$ 便會出錯：轉移的是【變化量】，不是終點的數值。`,
          `In $${cmpd}$, $${el}$ has oxidation number $${to}$; changing from $0$ gives a change of $${change}$. `
          + `A rise means electrons are lost (oxidation); a fall means electrons are gained (reduction). Here the number ${change > 0 ? 'rises' : 'falls'}, so each atom ${wordEn} $${lost}$ electron(s). `
          + `Reversing the direction pairs "oxidation number rises" with "gains electrons"; since electrons are negative, gaining one makes the number *fall*. `
          + `The option with $${lost + 1}$ miscounts by one. `
          + `The option equal to the oxidation number itself happens to match only because the start is $0$; the quantity transferred is the *change*, not the final value.`,
        ],
      }
    },
  },

  // ══ 有機化學 3 條 ═════════════════════════════════════════════════════════
  // 現有 54 條係通式、官能團、同系列等概念題。呢個原型補【由碳數寫名稱】。
  {
    key: 'or_naming_prefix', topic: 'organic',
    topicZh: '有機化學', topicEn: 'Organic Chemistry',
    diff: 'basic', n: 3,
    gen: (i): Inst => {
      const n = i + 3   // 丙、丁、戊
      const zh = ALKYL_ZH[n - 1]
      const en = ALKYL_EN[n - 1]
      return {
        q: [
          `直鏈烷 ${CH(n, 2 * n + 2)} 的名稱是甚麼？`,
          `What is the name of the straight-chain alkane ${CH(n, 2 * n + 2)}?`,
        ],
        ans: `${zh}烷（${en}ane）`,
        ansEn: `${en}ane`,
        wrong: [
          `${ALKYL_ZH[n]}烷（${ALKYL_EN[n]}ane）`,
          `${zh}烯（${en}ene）`,
          `${ALKYL_ZH[n - 2]}烷（${ALKYL_EN[n - 2]}ane）`,
        ],
        wrongEn: [`${ALKYL_EN[n]}ane`, `${en}ene`, `${ALKYL_EN[n - 2]}ane`],
        e: [
          `有機物的名稱由兩部分組成：字首表示碳原子數目，字尾表示所屬同系列。`
          + `此分子有 $${n}$ 個碳，字首為「${zh}」（${en}-）；氫數 $${2 * n + 2}$ 符合烷的通式 $\\mathrm{C_{n}H_{2n+2}}$，`
          + `屬飽和烴，字尾為「烷」（-ane），故名為${zh}烷。`
          + `答${ALKYL_ZH[n]}烷或${ALKYL_ZH[n - 2]}烷的，碳數分別多數或少數了一個。`
          + `答${zh}烯的，字尾錯誤 —— 烯的通式是 $\\mathrm{C_{n}H_{2n}}$，含一個雙鍵，氫數會比這裏少兩個。`
          + `先數碳定字首、再看氫數定字尾，兩步分開做就不易錯。`,
          `An organic name has two parts: a stem for the number of carbons and an ending for the homologous series. `
          + `This molecule has $${n}$ carbons, so the stem is ${en}-; with $${2 * n + 2}$ hydrogens it fits the alkane general formula $\\mathrm{C_{n}H_{2n+2}}$, so the ending is -ane. `
          + `The options ${ALKYL_EN[n]}ane and ${ALKYL_EN[n - 2]}ane miscount the carbons. `
          + `The option ${en}ene has the wrong ending: alkenes follow $\\mathrm{C_{n}H_{2n}}$ and would have two fewer hydrogens. `
          + `Count carbons for the stem, then check hydrogens for the ending.`,
        ],
      }
    },
  },

  // ══ 氣體體積 2 條 ═════════════════════════════════════════════════════════
  // 現有 51 條幾乎全部係「$x$ g $\mathrm{O_2}$ 喺 rtp 佔幾多體積」，同一句換質量。
  // 呢個原型改為【氣體反應嘅體積比】—— 用阿伏加德羅定律，唔使算摩爾體積。
  {
    key: 'gv_reacting_volumes', topic: 'gas_volume',
    topicZh: '氣體體積', topicEn: 'Gas Volume',
    diff: 'intermediate', n: 2,
    gen: (i): Inst => {
      // 同溫同壓下，氣體體積比 = 物質的量比 = 方程式係數比
      const P: [string, string, number, number, number][] = [
        ['\\mathrm{N_{2}(g) + 3H_{2}(g) \\rightarrow 2NH_{3}(g)}', '\\mathrm{H_{2}}', 3, 2, 30],
        ['\\mathrm{2CO(g) + O_{2}(g) \\rightarrow 2CO_{2}(g)}', '\\mathrm{CO}', 2, 2, 40],
      ]
      const [eqn, gas, coefIn, coefOut, vol] = P[i]
      const ans = (vol / coefIn) * coefOut
      return {
        q: [
          `在同溫同壓下，$${vol}\\ \\mathrm{cm^{3}}$ 的 $${gas}$ 按方程式 $${eqn}$ 完全反應。所生成的氣體產物體積是多少？`,
          `At the same temperature and pressure, $${vol}\\ \\mathrm{cm^{3}}$ of $${gas}$ reacts completely according to $${eqn}$. What is the volume of the gaseous product formed?`,
        ],
        ans: `$${ans}\\ \\mathrm{cm^{3}}$`,
        wrong: [`$${vol}\\ \\mathrm{cm^{3}}$`, `$${(vol / coefOut) * coefIn}\\ \\mathrm{cm^{3}}$`, `$${vol * coefOut}\\ \\mathrm{cm^{3}}$`],
        e: [
          `同溫同壓下，相同體積的任何氣體含有相同數目的分子（阿伏加德羅定律），`
          + `所以氣體之間的【體積比】直接等於方程式的【係數比】，完全不需要用到摩爾體積或質量。`
          + `由方程式，$${gas}$ 與氣體產物的係數比為 $${coefIn} : ${coefOut}$，`
          + `故產物體積 $= ${vol} \\times \\dfrac{${coefOut}}{${coefIn}} = ${ans}\\ \\mathrm{cm^{3}}$。`
          + `答 $${vol}\\ \\mathrm{cm^{3}}$ 的假設體積不變，那只在係數相等時才成立。`
          + `答 $${(vol / coefOut) * coefIn}\\ \\mathrm{cm^{3}}$ 的把比例倒轉了。`
          + `答 $${vol * coefOut}\\ \\mathrm{cm^{3}}$ 的只乘了產物的係數而沒有除以反應物的係數。`,
          `At the same temperature and pressure, equal volumes of gases contain equal numbers of molecules (Avogadro's law), so volume ratios equal the coefficient ratios directly — no molar volume or mass is needed. `
          + `The coefficients give $${coefIn} : ${coefOut}$, so the product volume is $${vol} \\times \\dfrac{${coefOut}}{${coefIn}} = ${ans}\\ \\mathrm{cm^{3}}$. `
          + `The option $${vol}\\ \\mathrm{cm^{3}}$ assumes no change, true only when the coefficients match. `
          + `The option $${(vol / coefOut) * coefIn}\\ \\mathrm{cm^{3}}$ inverts the ratio. `
          + `The option $${vol * coefOut}\\ \\mathrm{cm^{3}}$ multiplies by the product coefficient without dividing by the reactant's.`,
        ],
      }
    },
  },
]

emit('chemistry', 'chem_med_b1', archs, OUT)
