import type { Question, Topic } from './types'
import { makeQ, topicList, type Pair, type TopicMeta, type FwMeta } from './_builder'

// ════════════════════════════════════════════════════════════════════════════
// Physics — multi-step "hell" set (genuine 5★★). Every numeric answer is
// hand-computed and shown in the working; distractors are the classic DSE traps
// (KE "conserved" in an inelastic collision, ignoring internal resistance,
// simple-average mixing, frequency changing on refraction, answer depending on
// mass when it doesn't, etc.). g = 10 m/s². All hard.
// ════════════════════════════════════════════════════════════════════════════

const q = makeQ('physics')
const opt = (v: string): Pair => [`$${v}$`, `$${v}$`]
const C = (zh: string, en: string): Pair => [zh, en]

const T = {
  mech: { id: 'phys_hell_mechanics',    zh: '多步殺著・力學',       en: 'Multi-step — Mechanics' },
  ec:   { id: 'phys_hell_elec_heat',    zh: '多步殺著・電與熱',     en: 'Multi-step — Electricity & Heat' },
  wo:   { id: 'phys_hell_wave_optics',  zh: '多步殺著・波動光學放射', en: 'Multi-step — Waves, Optics & Radioactivity' },
} satisfies Record<string, TopicMeta>

const FW = {
  conserve: { id: 'conservation', zh: '守恆定律', en: 'Conservation Laws', emoji: '⚖️' },
  circuit:  { id: 'circuit', zh: '電路分析', en: 'Circuit Analysis', emoji: '⚡' },
  wave:     { id: 'wave', zh: '波的關係', en: 'Wave Relationships', emoji: '🌊' },
} satisfies Record<string, FwMeta>

let uid = 0
const id = (p: string) => `phyh_${p}_${++uid}`

// ── Mechanics ────────────────────────────────────────────────────────────────
const mech: Question[] = [
  q(id('me'), T.mech, FW.conserve, 'hard', 2024, 2,
    C('一輛汽車由 $30\\,\\text{m/s}$ 在 $60\\,\\text{m}$ 內均勻減速至靜止。其減速度的大小是？',
      'A car decelerates uniformly from $30\\,\\text{m/s}$ to rest over $60\\,\\text{m}$. The magnitude of its deceleration is?'),
    [opt('7.5\\,\\text{m/s}^2'), opt('0.5\\,\\text{m/s}^2'), opt('15\\,\\text{m/s}^2'), opt('900\\,\\text{m/s}^2')],
    C('用 $v^2 = u^2 + 2as$：$0 = 30^2 + 2a(60) \\Rightarrow a = -900/120 = -7.5\\,\\text{m/s}^2$，大小 $7.5\\,\\text{m/s}^2$。\n\n【陷阱】$0.5$ 把 $30$ 當 $v^2$；$15 = 30/2$ 誤用時間公式；$900$ 漏除 $2s$。',
      'Use $v^2 = u^2 + 2as$: $0 = 30^2 + 2a(60) \\Rightarrow a = -7.5\\,\\text{m/s}^2$, magnitude $7.5\\,\\text{m/s}^2$.\n\n【Trap】 $0.5$ treats $30$ as $v^2$; $15=30/2$ misuses a time formula; $900$ omits dividing by $2s$.')),

  q(id('me'), T.mech, FW.conserve, 'hard', 2023, 3,
    C('質量 $2\\,\\text{kg}$、速度 $3\\,\\text{m/s}$ 的小車撞向靜止的 $4\\,\\text{kg}$ 小車並黏在一起。碰撞中損失的動能是？',
      'A $2\\,\\text{kg}$ trolley at $3\\,\\text{m/s}$ hits a stationary $4\\,\\text{kg}$ trolley and they stick together. The kinetic energy lost in the collision is?'),
    [opt('6\\,\\text{J}'), opt('0\\,\\text{J}'), opt('9\\,\\text{J}'), opt('3\\,\\text{J}')],
    C('動量守恆求共速：$v = (2\\times3)/(2+4) = 1\\,\\text{m/s}$。撞前 $KE = \\tfrac12(2)(3^2) = 9\\,\\text{J}$；撞後 $KE = \\tfrac12(6)(1^2) = 3\\,\\text{J}$；損失 $= 9 - 3 = 6\\,\\text{J}$。\n\n【陷阱】$0\\,\\text{J}$ 誤以為動能守恆——非彈性碰撞動量守恆但動能不守恆，正是此題殺著；$9$、$3$ 分別只取撞前／撞後。',
      'Momentum conservation: $v = (2\\times3)/6 = 1\\,\\text{m/s}$. Before: $KE = \\tfrac12(2)(9) = 9\\,\\text{J}$; after: $KE = \\tfrac12(6)(1) = 3\\,\\text{J}$; lost $= 6\\,\\text{J}$.\n\n【Trap】 $0\\,\\text{J}$ wrongly assumes KE is conserved — in an inelastic collision momentum is conserved but KE is NOT; $9$/$3$ take only before/after.')),

  q(id('me'), T.mech, FW.conserve, 'hard', 2024, 2,
    C('一物體由 $5\\,\\text{m}$ 高、無摩擦的斜面靜止滑下，到達底部時的速率是？（$g=10\\,\\text{m/s}^2$）',
      'An object slides from rest down a frictionless incline of height $5\\,\\text{m}$. Its speed at the bottom is? ($g=10\\,\\text{m/s}^2$)'),
    [opt('10\\,\\text{m/s}'), C('依物體質量而定', 'depends on the object’s mass'), opt('5\\,\\text{m/s}'), opt('50\\,\\text{m/s}')],
    C('能量守恆：$mgh = \\tfrac12 mv^2 \\Rightarrow v = \\sqrt{2gh} = \\sqrt{2(10)(5)} = \\sqrt{100} = 10\\,\\text{m/s}$。質量 $m$ 兩邊消去，與質量無關。\n\n【陷阱】「依質量而定」正是此題殺著——$m$ 消去故無關；$5$ 漏開方／係數；$50 = 2gh$ 漏開方。',
      'Energy conservation: $mgh = \\tfrac12 mv^2 \\Rightarrow v = \\sqrt{2gh} = \\sqrt{100} = 10\\,\\text{m/s}$. The mass cancels.\n\n【Trap】 “Depends on mass” is the killer — $m$ cancels; $5$ drops the root/factor; $50=2gh$ forgets the square root.')),
]

// ── Electricity & Heat ───────────────────────────────────────────────────────
const ec: Question[] = [
  q(id('ec'), T.ec, FW.circuit, 'hard', 2024, 3,
    C('一個電動勢 $12\\,\\text{V}$、內阻 $1\\,\\Omega$ 的電池接上 $5\\,\\Omega$ 的外電阻。電池的端電壓是？',
      'A battery of emf $12\\,\\text{V}$ and internal resistance $1\\,\\Omega$ is connected to an external resistor of $5\\,\\Omega$. The terminal voltage is?'),
    [opt('10\\,\\text{V}'), opt('12\\,\\text{V}'), opt('2\\,\\text{V}'), opt('11\\,\\text{V}')],
    C('電流 $I = \\dfrac{\\varepsilon}{R+r} = \\dfrac{12}{5+1} = 2\\,\\text{A}$。端電壓 $= IR = 2\\times5 = 10\\,\\text{V}$（亦即 $\\varepsilon - Ir = 12 - 2 = 10\\,\\text{V}$）。\n\n【陷阱】$12\\,\\text{V}$ 忽略了內阻的電壓降——這正是內阻題的殺著；$2\\,\\text{V}$ 是內阻上的電壓；$11$ 用錯電流。',
      'Current $I = \\dfrac{\\varepsilon}{R+r} = \\dfrac{12}{6} = 2\\,\\text{A}$. Terminal voltage $= IR = 10\\,\\text{V}$ (or $\\varepsilon - Ir = 12 - 2 = 10\\,\\text{V}$).\n\n【Trap】 $12\\,\\text{V}$ ignores the internal-resistance drop — the classic internal-resistance trap; $2\\,\\text{V}$ is the drop across $r$; $11$ uses the wrong current.')),

  q(id('ec'), T.ec, FW.circuit, 'hard', 2023, 3,
    C('兩個 $6\\,\\Omega$ 電阻並聯，接上 $12\\,\\text{V}$ 電源（電源內阻可忽略）。電路消耗的總功率是？',
      'Two $6\\,\\Omega$ resistors are connected in parallel across a $12\\,\\text{V}$ supply (negligible internal resistance). The total power dissipated is?'),
    [opt('48\\,\\text{W}'), opt('24\\,\\text{W}'), opt('12\\,\\text{W}'), opt('288\\,\\text{W}')],
    C('並聯等效電阻 $= \\dfrac{6}{2} = 3\\,\\Omega$。總功率 $P = \\dfrac{V^2}{R} = \\dfrac{12^2}{3} = \\dfrac{144}{3} = 48\\,\\text{W}$（校驗：每個電阻 $12/6=2\\,\\text{A}$、功率 $24\\,\\text{W}$，兩個共 $48\\,\\text{W}$）。\n\n【陷阱】$24\\,\\text{W}$ 只算一個電阻；$12\\,\\text{W}$ 把並聯當串聯（用 $12\\,\\Omega$）；$288$ 把電阻當 $0.5\\,\\Omega$。',
      'Parallel resistance $= 3\\,\\Omega$. Total power $P = \\dfrac{V^2}{R} = \\dfrac{144}{3} = 48\\,\\text{W}$ (check: each resistor draws $2\\,\\text{A}$, $24\\,\\text{W}$ each, $48\\,\\text{W}$ total).\n\n【Trap】 $24\\,\\text{W}$ counts one resistor; $12\\,\\text{W}$ treats parallel as series ($12\\,\\Omega$); $288$ mis-uses the resistance.')),

  q(id('ec'), T.ec, FW.circuit, 'hard', 2024, 3,
    C('把 $0.2\\,\\text{kg}$、$80°\\text{C}$ 的水與 $0.3\\,\\text{kg}$、$30°\\text{C}$ 的水混合（忽略容器及散熱）。最終溫度是？',
      'Mix $0.2\\,\\text{kg}$ of water at $80°\\text{C}$ with $0.3\\,\\text{kg}$ at $30°\\text{C}$ (ignore the container and heat loss). The final temperature is?'),
    [opt('50°\\text{C}'), opt('55°\\text{C}'), opt('45°\\text{C}'), opt('60°\\text{C}')],
    C('熱平衡：熱水放熱 = 冷水吸熱（$c$ 相同可消去）：$0.2(80-T) = 0.3(T-30)$。$16 - 0.2T = 0.3T - 9 \\Rightarrow 25 = 0.5T \\Rightarrow T = 50°\\text{C}$。\n\n【陷阱】$55°\\text{C}$ 是簡單平均 $(80+30)/2$——忽略了兩者質量不等，正是此題殺著；$45$、$60$ 為配比算錯。',
      'Heat balance: heat lost by hot = heat gained by cold (equal $c$ cancels): $0.2(80-T) = 0.3(T-30)$. $16 - 0.2T = 0.3T - 9 \\Rightarrow 25 = 0.5T \\Rightarrow T = 50°\\text{C}$.\n\n【Trap】 $55°\\text{C}$ is the simple average $(80+30)/2$ — it ignores the unequal masses, the killer here; $45$/$60$ mis-weight.')),
]

// ── Waves, Optics & Radioactivity ────────────────────────────────────────────
const wo: Question[] = [
  q(id('wo'), T.wo, FW.wave, 'hard', 2024, 3,
    C('一列波在介質一中頻率 $50\\,\\text{Hz}$、波長 $0.4\\,\\text{m}$。它進入介質二後波速減半。在介質二中的波長是？',
      'A wave in medium 1 has frequency $50\\,\\text{Hz}$ and wavelength $0.4\\,\\text{m}$. On entering medium 2 its speed halves. Its wavelength in medium 2 is?'),
    [opt('0.2\\,\\text{m}'), opt('0.4\\,\\text{m}'), opt('0.8\\,\\text{m}'), opt('0.1\\,\\text{m}')],
    C('介質一波速 $v_1 = f\\lambda_1 = 50\\times0.4 = 20\\,\\text{m/s}$。折射時頻率不變（仍 $50\\,\\text{Hz}$），$v_2 = 10\\,\\text{m/s}$，故 $\\lambda_2 = v_2/f = 10/50 = 0.2\\,\\text{m}$。\n\n【陷阱】$0.4\\,\\text{m}$ 以為波長不變；$0.8$ 把波速與波長關係搞反；$0.1$ 誤改頻率——折射時改變的是波速與波長，頻率不變，正是此題殺著。',
      'In medium 1, $v_1 = f\\lambda_1 = 50\\times0.4 = 20\\,\\text{m/s}$. On refraction frequency is unchanged ($50\\,\\text{Hz}$), $v_2 = 10\\,\\text{m/s}$, so $\\lambda_2 = v_2/f = 10/50 = 0.2\\,\\text{m}$.\n\n【Trap】 $0.4$ assumes wavelength is unchanged; $0.8$ inverts the relation; $0.1$ wrongly changes frequency — on refraction speed and wavelength change, frequency does not.')),

  q(id('wo'), T.wo, FW.wave, 'hard', 2023, 2,
    C('某放射性樣本的活度為 $800\\,\\text{Bq}$，半衰期為 $3$ 天。經過 $12$ 天後，其活度約為？',
      'A radioactive sample has an activity of $800\\,\\text{Bq}$ and a half-life of $3$ days. After $12$ days its activity is about?'),
    [opt('50\\,\\text{Bq}'), opt('100\\,\\text{Bq}'), opt('200\\,\\text{Bq}'), opt('0\\,\\text{Bq}')],
    C('$12$ 天 $= 4$ 個半衰期，活度 $= 800 \\div 2^4 = 800 \\div 16 = 50\\,\\text{Bq}$。\n\n【陷阱】$100$ 只算 $3$ 個半衰期；$200$ 只算 $2$ 個；$0$ 誤以為衰變至零——指數衰變永不真正歸零。',
      '$12$ days $= 4$ half-lives, so activity $= 800 \\div 2^4 = 50\\,\\text{Bq}$.\n\n【Trap】 $100$ counts only 3 half-lives; $200$ counts 2; $0$ assumes it decays to zero — exponential decay never truly reaches zero.')),

  q(id('wo'), T.wo, FW.wave, 'hard', 2024, 3,
    C('某透明介質的折射率為 $1.5$。光由該介質射向空氣時，全內反射的臨界角約為？（$\\sin^{-1}(0.667)\\approx41.8°$）',
      'A transparent medium has refractive index $1.5$. For light passing from the medium into air, the critical angle for total internal reflection is about? ($\\sin^{-1}(0.667)\\approx41.8°$)'),
    [opt('41.8°'), opt('48.2°'), opt('33.6°'), opt('90°')],
    C('臨界角 $\\theta_c$ 滿足 $\\sin\\theta_c = \\dfrac{1}{n} = \\dfrac{1}{1.5} = 0.667$，故 $\\theta_c \\approx 41.8°$。\n\n【陷阱】$48.2° = 90°-41.8°$（取了餘角）；$33.6°$ 用 $\\sin\\theta_c = n-1$ 之類錯式；$90°$ 誤解臨界角定義。',
      'The critical angle $\\theta_c$ satisfies $\\sin\\theta_c = \\dfrac{1}{n} = \\dfrac{1}{1.5} = 0.667$, so $\\theta_c \\approx 41.8°$.\n\n【Trap】 $48.2° = 90°-41.8°$ (the complement); $33.6°$ uses a wrong formula; $90°$ misreads the definition.')),
]

export const physicsHellQuestions: Question[] = [...mech, ...ec, ...wo]

export const physicsHellTopics: Topic[] = topicList([
  { topic: T.mech, fw: FW.conserve, count: mech.length },
  { topic: T.ec,   fw: FW.circuit,  count: ec.length },
  { topic: T.wo,   fw: FW.wave,     count: wo.length },
])
