#!/usr/bin/env node
// gen-long-drafts.mjs —— 書寫題（long）草稿生成器・理科第一批
//
// ══ 點解要有呢個腳本 ══
// 全庫非 MC 長期停喺 140 / 2,500。之前幾份報告把整條書寫題軸講成
// 「卡喺人手簽名」—— 呢個講法係錯嘅，而且錯得有後果：
// 它令一件本來做得到嘅事看起來做唔到，於是冇人去做。
//
// 實情係管線有四步：
//   drafts/ → review-drafts.mjs（機器閘） → 真人逐題批 → promote-drafts.mjs
// 只有第三步要簽名。頭兩步係機器嘅工作，而且憲章 §12 嘅指示本身就寫住
// 「每次生成後立即 git add drafts/」。
//
// ══ 本批次嘅設計 ══
// 理科書寫題可以 correct-by-construction：題幹給定數據，參考答案由同一組
// 參數算出，所以數值必然自洽，人手覆核只需判斷「呢條題值唔值得出」，
// 而唔使逐條驗算。
//
// ⚠️ 憲章 §16.A：markingScheme 係【自評對照表】，唔係考評局分數分配，
//    亦唔會被任何機器讀去批改。文案沿用 chinese-writing-b1.json 的既有寫法，
//    並明寫「本平台練習用尺度，並非香港考試及評核局的分數分配」。
//
// 用法：node scripts/qbank/gen-long-drafts.mjs
// 輸出：scripts/qbank/drafts/<subject>-long-b1.json（＋ .decisions.json 骨架）
//       decisions 的 reviewer 欄一律留空 —— 由真人填，機器永不代簽。

import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = fileURLToPath(new URL('../../', import.meta.url))
const OUT = path.join(ROOT, 'scripts/qbank/drafts')

const SCHEME_TAIL_ZH =
  '本題所列分數為本平台練習用尺度，並非香港考試及評核局的分數分配。' +
  '參考答案只列必達步驟與判準，刻意不提供可直接抄錄的完整答卷 —— ' +
  '解題能力來自自行組織的過程。交卷後請逐項對照自評，機器不會為本題評分。'
const SCHEME_TAIL_EN =
  'The marks shown are a practice scale used on this platform, not an HKEAA mark allocation. ' +
  'The reference answer lists the required steps and criteria rather than a copyable model script — ' +
  'the skill comes from organising the work yourself. Compare your own work against it point by point; ' +
  'nothing here is machine-marked.'

const rows = []
const push = (r) => rows.push(r)

// ── 物理 ────────────────────────────────────────────────────────────────
// 每條的數值由參數算出，參考答案內的每一個數字都是由同一組參數推導的。
const PHYS = [
  { topic: '運動學', n: 8, make: (k) => {
      const u = 4 + k * 2, a = 2 + (k % 3), t = 3 + (k % 4)
      const v = u + a * t, s = u * t + 0.5 * a * t * t
      return {
        q: `一輛小車沿直線行駛，初速度為 ${u} m s⁻¹，以 ${a} m s⁻² 的等加速度加速 ${t} s。\n（a）求 ${t} s 後的速度。\n（b）求這 ${t} s 內走過的位移。\n（c）若同一輛車改為由靜止開始、以相同加速度走相同位移，所需時間會較長還是較短？試以算式說明，不要只憑直覺作答。`,
        ans: `（a）v = u + at = ${u} + ${a} × ${t} = ${v} m s⁻¹。\n（b）s = ut + ½at² = ${u} × ${t} + 0.5 × ${a} × ${t}² = ${s} m。\n（c）由靜止開始時 u = 0，s = ½at²，故 t' = √(2s/a) = √(2 × ${s} / ${a}) ≈ ${Math.sqrt((2 * s) / a).toFixed(2)} s，較原來的 ${t} s 為【長】。\n物理意義：原本的車一開始已有 ${u} m s⁻¹ 的初速度，等於「贏在起跑線」，所以走同一段距離所需時間較短。\n⚠️ 常見錯誤：把 (c) 直接答「一樣」，因為誤以為加速度相同即時間相同 —— 加速度只決定速度變化的快慢，不決定起點。`,
        ansEn: `(a) v = u + at = ${u} + ${a} × ${t} = ${v} m s⁻¹.\n(b) s = ut + ½at² = ${s} m.\n(c) From rest, s = ½at², so t' = √(2s/a) ≈ ${Math.sqrt((2 * s) / a).toFixed(2)} s, which is LONGER than ${t} s. The original car began with ${u} m s⁻¹ already in hand. Common error: answering "the same" because the acceleration is unchanged — acceleration fixes how fast the velocity changes, not where it starts.`,
        min: 10, diff: k % 3 === 0 ? 'basic' : 'intermediate',
      }
    } },
  { topic: '力與運動', n: 8, make: (k) => {
      const m = 2 + k, F = 10 + k * 4, mu = (0.2 + (k % 3) * 0.1).toFixed(1)
      const g = 10, fr = (Number(mu) * m * g).toFixed(1)
      const net = (F - Number(fr)).toFixed(1), acc = (Number(net) / m).toFixed(2)
      return {
        q: `一個質量 ${m} kg 的木箱放在水平地面上，動摩擦係數為 ${mu}。有人以 ${F} N 的水平力推動木箱（取 g = ${g} N kg⁻¹）。\n（a）求木箱所受的摩擦力。\n（b）求合力及加速度。\n（c）若把推力增至兩倍，加速度會否同樣變成兩倍？試以計算說明。`,
        ans: `（a）f = μmg = ${mu} × ${m} × ${g} = ${fr} N。\n（b）合力 = ${F} − ${fr} = ${net} N；a = F合/m = ${net} / ${m} = ${acc} m s⁻²。\n（c）推力變為 ${F * 2} N 時，合力 = ${F * 2} − ${fr} = ${(F * 2 - Number(fr)).toFixed(1)} N，a' = ${((F * 2 - Number(fr)) / m).toFixed(2)} m s⁻²。\na' / a = ${(((F * 2 - Number(fr)) / m) / Number(acc)).toFixed(2)}，【並非】兩倍。\n原因：摩擦力不隨推力增加而增加（在滑動階段為定值），所以推力加倍時，合力增加的比例大於一倍，加速度的倍數也不會剛好等於推力的倍數。\n⚠️ 這是本課題最常見的失分位：把「力加倍」直接讀成「加速度加倍」，忽略了合力中還有一項不變的摩擦力。`,
        ansEn: `(a) f = μmg = ${fr} N. (b) Net = ${net} N, a = ${acc} m s⁻². (c) At ${F * 2} N the net force is ${(F * 2 - Number(fr)).toFixed(1)} N and a' = ${((F * 2 - Number(fr)) / m).toFixed(2)} m s⁻², which is NOT double. Kinetic friction does not grow with the applied force, so doubling the push more than doubles the net force. This is the classic error: reading "double the force" as "double the acceleration" while ignoring the constant friction term.`,
        min: 12, diff: 'intermediate',
      }
    } },
  { topic: '功、能與功率', n: 8, make: (k) => {
      const m = 50 + k * 10, h = 2 + (k % 4), t = 4 + (k % 5), g = 10
      const W = m * g * h, P = (W / t).toFixed(1)
      return {
        q: `一部升降裝置把質量 ${m} kg 的貨物在 ${t} s 內垂直提升 ${h} m（取 g = ${g} N kg⁻¹，不計摩擦）。\n（a）求所做的功。\n（b）求平均功率。\n（c）若同一部裝置改為在 ${t * 2} s 內提升相同貨物至相同高度，所做的功與功率分別有何變化？試說明兩者為何不同步變化。`,
        ans: `（a）W = mgh = ${m} × ${g} × ${h} = ${W} J。\n（b）P = W/t = ${W} / ${t} = ${P} W。\n（c）功【不變】，仍為 ${W} J；功率變為 ${(W / (t * 2)).toFixed(1)} W，即減半。\n原因：功只由力與位移決定（mgh），與用了多少時間無關；功率是單位時間內做的功，所以時間加倍功率減半。\n⚠️ 常見錯誤：以為「慢慢做比較慳力」，於是把功也一併減半。慢做省的是功率而非功 —— 同一件貨提到同一高度，能量的轉移量是一樣的。`,
        ansEn: `(a) W = mgh = ${W} J. (b) P = ${P} W. (c) The work is UNCHANGED at ${W} J; the power halves to ${(W / (t * 2)).toFixed(1)} W. Work depends only on force and displacement, not on time; power is work per unit time. Common error: assuming that doing it slowly "saves effort" and halving the work as well. Going slower lowers the power, not the energy transferred.`,
        min: 10, diff: k % 4 === 0 ? 'basic' : 'intermediate',
      }
    } },
  { topic: '電學', n: 8, make: (k) => {
      const V = 6 + k * 2, R1 = 2 + (k % 4), R2 = 3 + (k % 5)
      const Rs = R1 + R2, Is = (V / Rs).toFixed(2)
      const Rp = ((R1 * R2) / (R1 + R2)).toFixed(2), Ip = (V / Number(Rp)).toFixed(2)
      return {
        q: `兩個電阻 R₁ = ${R1} Ω 與 R₂ = ${R2} Ω 接於 ${V} V 的電源。\n（a）若兩者串聯，求總電阻與電路電流。\n（b）若兩者改為並聯，求總電阻與由電源流出的總電流。\n（c）比較兩種接法下電源所供應的功率，並解釋為何並聯會令電源負擔較重。`,
        ans: `（a）串聯：R = ${R1} + ${R2} = ${Rs} Ω；I = V/R = ${V} / ${Rs} = ${Is} A。\n（b）並聯：1/R = 1/${R1} + 1/${R2}，R = ${Rp} Ω；I = ${V} / ${Rp} = ${Ip} A。\n（c）P = VI：串聯 P = ${V} × ${Is} = ${(V * Number(Is)).toFixed(1)} W；並聯 P = ${V} × ${Ip} = ${(V * Number(Ip)).toFixed(1)} W。\n並聯的總電阻【小於】任何一個分電阻，故在相同電壓下電流較大、功率較大。\n物理意義：並聯等於為電流多開了一條路，路愈多整體阻礙愈小 —— 這與「電阻串起來會愈加愈大」剛好相反，兩者必須分清。`,
        ansEn: `(a) Series: R = ${Rs} Ω, I = ${Is} A. (b) Parallel: R = ${Rp} Ω, I = ${Ip} A. (c) P = VI gives ${(V * Number(Is)).toFixed(1)} W in series and ${(V * Number(Ip)).toFixed(1)} W in parallel. A parallel combination has a total resistance SMALLER than either branch, so at the same voltage the current and the power are greater. Adding a parallel branch opens another route for current; adding a series resistor does the opposite.`,
        min: 12, diff: 'intermediate',
      }
    } },
  { topic: '熱學', n: 8, make: (k) => {
      const m = (0.2 + k * 0.1).toFixed(1), c = 4200, dT = 10 + k * 5
      const E = (Number(m) * c * dT).toFixed(0)
      return {
        q: `把 ${m} kg 的水由室溫加熱，溫度上升 ${dT} °C（水的比熱容為 ${c} J kg⁻¹ °C⁻¹）。\n（a）求所需的熱能。\n（b）若加熱器的輸出功率為 500 W 而全部熱能被水吸收，求所需時間。\n（c）實際所需時間必定較 (b) 的答案為長。試指出【兩個】原因，並說明它們分別屬於哪一類能量流失。`,
        ans: `（a）E = mcΔT = ${m} × ${c} × ${dT} = ${E} J。\n（b）t = E/P = ${E} / 500 = ${(Number(E) / 500).toFixed(1)} s。\n（c）兩個原因（任答兩項，須分類）：\n一、熱能由容器與水面散失至周圍空氣 —— 屬【傳導與對流的流失】。\n二、容器本身亦被加熱，吸收了部分熱能 —— 屬【被其他物體分走的熱】，並非流失至環境。\n三、加熱器本身有電阻發熱以外的損耗 —— 屬【裝置效率的損失】。\n⚠️ 答題要求是「兩個原因並分類」，只列原因而不分類，只能取一半分數。`,
        ansEn: `(a) E = mcΔT = ${E} J. (b) t = ${(Number(E) / 500).toFixed(1)} s. (c) Any two, each classified: heat lost to the surroundings by conduction and convection; heat absorbed by the container itself (taken by another body rather than lost to the environment); losses in the heater itself. The question asks for two reasons AND their classification — listing reasons without classifying them earns only half.`,
        min: 12, diff: 'intermediate',
      }
    } },
  { topic: '波動', n: 8, make: (k) => {
      const f = 200 + k * 50, lam = (1.5 + k * 0.2).toFixed(1)
      const v = (f * Number(lam)).toFixed(0)
      return {
        q: `一列波的頻率為 ${f} Hz，波長為 ${lam} m。\n（a）求波速。\n（b）該波由一種介質進入另一種介質後，波速變為原來的一半，而頻率不變。求新的波長。\n（c）為甚麼波由一種介質進入另一種介質時頻率不變，而波長會變？試由波源與介質的角色說明。`,
        ans: `（a）v = fλ = ${f} × ${lam} = ${v} m s⁻¹。\n（b）v' = ${(Number(v) / 2).toFixed(0)} m s⁻¹，f 不變；λ' = v'/f = ${(Number(v) / 2 / f).toFixed(3)} m，即原波長的一半。\n（c）頻率由【波源】決定 —— 波源每秒振動多少次，進入新介質後並不會因此改變；波速由【介質】決定。既然 v = fλ 而 f 固定、v 改變，λ 必然隨之改變。\n⚠️ 常見錯誤：以為波速改變時頻率也跟著變。分清「誰決定甚麼」是本題的關鍵：波源決定 f，介質決定 v，λ 是兩者的結果。`,
        ansEn: `(a) v = fλ = ${v} m s⁻¹. (b) v' = ${(Number(v) / 2).toFixed(0)} m s⁻¹ with f unchanged, so λ' = ${(Number(v) / 2 / f).toFixed(3)} m — half the original. (c) Frequency is set by the SOURCE and does not change on entering a new medium; speed is set by the MEDIUM. Since v = fλ with f fixed and v changed, λ must change. The common error is to let f change with v; keep straight which quantity is fixed by which.`,
        min: 10, diff: k % 3 === 0 ? 'basic' : 'intermediate',
      }
    } },
  { topic: '光學', n: 8, make: (k) => {
      const n1 = 1.0, n2 = (1.3 + k * 0.05).toFixed(2)
      const crit = (Math.asin(n1 / Number(n2)) * 180) / Math.PI
      return {
        q: `光由折射率 ${n2} 的介質射向空氣（折射率取 ${n1.toFixed(1)}）。\n（a）求發生全內反射的臨界角。\n（b）若入射角為臨界角減 5°，光會怎樣？若為臨界角加 5° 呢？\n（c）全內反射為何只可能發生在由光密介質射向光疏介質的方向？試說明。`,
        ans: `（a）sin C = n₁/n₂ = ${n1.toFixed(1)} / ${n2}，C = ${crit.toFixed(1)}°。\n（b）入射角 ${(crit - 5).toFixed(1)}°（小於 C）：光【會】折射出去，同時有部分反射。\n入射角 ${(crit + 5).toFixed(1)}°（大於 C）：發生【全內反射】，沒有折射光線射出。\n（c）由光密射向光疏時，折射角【大於】入射角；當入射角增大到某一點，折射角先達到 90°，再增大就沒有折射解 —— 這一點就是臨界角。反方向（光疏射向光密）折射角永遠小於入射角，不可能達到 90°，故不會出現全內反射。\n⚠️ 只答「因為要由密到疏」不足以取分，須說明折射角先到 90° 這個機制。`,
        ansEn: `(a) sin C = n₁/n₂, C = ${crit.toFixed(1)}°. (b) Below C the light refracts out (with partial reflection); above C it is totally internally reflected. (c) Going from dense to less dense, the refraction angle exceeds the incidence angle, so it reaches 90° first and beyond that no refracted solution exists — that point is the critical angle. In the reverse direction the refraction angle is always smaller and can never reach 90°. Stating only "it must go dense to rare" does not earn the mark; the 90° mechanism must be given.`,
        min: 12, diff: 'hard',
      }
    } },
  { topic: '放射現象', n: 8, make: (k) => {
      const T = 5 + k * 3, N0 = 800 + k * 100, nT = 2 + (k % 4)
      const left = N0 / Math.pow(2, nT)
      return {
        q: `某放射性樣本的半衰期為 ${T} 天，起始活度為 ${N0} Bq。\n（a）經過 ${nT * T} 天後，活度為多少？\n（b）需要多少天活度才降至起始值的八分之一？\n（c）有人說「再等足夠長的時間，活度必然降至零」。這個說法哪一部分正確、哪一部分不正確？`,
        ans: `（a）${nT * T} 天 = ${nT} 個半衰期，活度 = ${N0} ÷ 2^${nT} = ${left} Bq。\n（b）八分之一 = (½)³，故需 3 個半衰期 = ${3 * T} 天。\n（c）正確的部分：活度確實會持續下降，且下降沒有下限地趨近零。\n不正確的部分：衰變是【按比例】而非按定量減少，每過一個半衰期只剩一半，數學上永遠不會剛好等於零；實際上當剩餘原子核數目少到個位數時，統計描述亦不再適用。\n⚠️ 本題考的是「指數衰減」與「線性減少」的分別 —— 答「會歸零」多數源於把衰變想成每次減去固定數量。`,
        ansEn: `(a) ${nT} half-lives, so ${left} Bq. (b) One eighth is (½)³, so 3 half-lives = ${3 * T} days. (c) Correct: the activity does keep falling and approaches zero without limit. Incorrect: decay removes a fixed PROPORTION, not a fixed amount, so mathematically it never reaches exactly zero; and once only a handful of nuclei remain the statistical description no longer applies. The item tests exponential against linear decrease.`,
        min: 12, diff: 'intermediate',
      }
    } },
]

// ── 化學 ────────────────────────────────────────────────────────────────
const CHEM = [
  { topic: '摩爾概念', n: 7, make: (k) => {
      const m = 4 + k * 2, M = 40 + k * 4
      const mol = (m / M).toFixed(3)
      return {
        q: `某化合物的莫耳質量為 ${M} g mol⁻¹。取樣品 ${m} g。\n（a）求樣品的物質的量。\n（b）求樣品所含的粒子數目（阿佛加德羅常數取 6.02 × 10²³ mol⁻¹）。\n（c）若把樣品質量加倍而化合物不變，(a) 與 (b) 的答案會如何變化？若改為換一種莫耳質量較大的化合物而質量不變呢？`,
        ans: `（a）n = m/M = ${m} / ${M} = ${mol} mol。\n（b）N = n × 6.02 × 10²³ = ${mol} × 6.02 × 10²³ ≈ ${(Number(mol) * 6.02).toFixed(2)} × 10²³ 個。\n（c）質量加倍：n 與 N 均【加倍】，因為兩者都與 m 成正比。\n換用莫耳質量較大的化合物而質量不變：n 與 N 均【減少】，因為 n = m/M，M 在分母。\n⚠️ 本題考的是比例關係的方向。常見錯誤是把「質量相同」讀成「粒子數相同」—— 同一質量的不同物質，粒子數目取決於各自的莫耳質量。`,
        ansEn: `(a) n = m/M = ${mol} mol. (b) N ≈ ${(Number(mol) * 6.02).toFixed(2)} × 10²³ particles. (c) Doubling the mass doubles both, since both are proportional to m. Using a compound with a larger molar mass at the same mass decreases both, since M sits in the denominator. The common error is reading "same mass" as "same number of particles".`,
        min: 10, diff: k % 3 === 0 ? 'basic' : 'intermediate',
      }
    } },
  { topic: '濃度', n: 7, make: (k) => {
      const c1 = (0.5 + k * 0.25).toFixed(2), v1 = 25 + k * 5, v2 = 100 + k * 20
      const c2 = ((Number(c1) * v1) / v2).toFixed(4)
      return {
        q: `把 ${v1} cm³、濃度 ${c1} mol dm⁻³ 的溶液稀釋至 ${v2} cm³。\n（a）求稀釋後的濃度。\n（b）稀釋前後，溶質的物質的量有沒有改變？試說明。\n（c）若某同學在稀釋時先量好 ${v1} cm³ 溶液，再加入 ${v2} cm³ 的水，所得濃度會否等於 (a) 的答案？試指出問題所在。`,
        ans: `（a）c₁V₁ = c₂V₂：c₂ = ${c1} × ${v1} / ${v2} = ${c2} mol dm⁻³。\n（b）【沒有改變】。稀釋只是加入溶劑，溶質的粒子一顆也沒有增減；改變的是它們分佈的體積，因而改變濃度。\n（c）【不等於】。(a) 所指的 ${v2} cm³ 是稀釋後的【總體積】；該同學的做法得出的總體積是 ${v1} + ${v2} = ${v1 + v2} cm³，濃度為 ${((Number(c1) * v1) / (v1 + v2)).toFixed(4)} mol dm⁻³，比 (a) 的答案為低。\n⚠️ 這是實驗操作中最常見的誤讀：「稀釋至 V」與「加入 V 的水」是兩回事，前者用容量瓶定容，後者不是。`,
        ansEn: `(a) c₂ = c₁V₁/V₂ = ${c2} mol dm⁻³. (b) Unchanged — dilution adds solvent only; no solute particle is gained or lost, but the volume they occupy changes. (c) Not equal. In (a), ${v2} cm³ is the FINAL total volume; adding ${v2} cm³ of water to ${v1} cm³ gives a total of ${v1 + v2} cm³ and a concentration of ${((Number(c1) * v1) / (v1 + v2)).toFixed(4)} mol dm⁻³. "Dilute to V" and "add V of water" are different operations.`,
        min: 10, diff: 'intermediate',
      }
    } },
  { topic: '化學計量', n: 7, make: (k) => {
      const a = 2 + (k % 3), mA = 10 + k * 3, MA = 24 + k * 2, MB = 32 + k * 3
      const nA = (mA / MA).toFixed(3), nB = (Number(nA) / a).toFixed(3)
      return {
        q: `已知反應：${a} A + B → C。A 的莫耳質量為 ${MA} g mol⁻¹，B 的為 ${MB} g mol⁻¹。今有 ${mA} g 的 A 完全反應。\n（a）求 A 的物質的量。\n（b）求需要多少克 B。\n（c）若實際加入的 B 為 (b) 答案的兩倍，產物 C 的量會否加倍？試以「限量試劑」的概念說明。`,
        ans: `（a）n(A) = ${mA} / ${MA} = ${nA} mol。\n（b）由方程式，n(B) = n(A) / ${a} = ${nB} mol；m(B) = ${nB} × ${MB} = ${(Number(nB) * MB).toFixed(2)} g。\n（c）【不會加倍】。A 的量沒有改變，仍為 ${nA} mol，故最多只能生成與之對應的 C；多出的 B 會有剩餘。\n此時【A 是限量試劑】，B 是過量試劑 —— 產物的量由限量試劑決定，加入更多過量試劑不會增加產量。\n⚠️ 常見錯誤：把「加多了原料」自動讀成「產物增加」。要先判斷哪一種是限量試劑，再由它計算產量。`,
        ansEn: `(a) n(A) = ${nA} mol. (b) n(B) = ${nB} mol, m(B) = ${(Number(nB) * MB).toFixed(2)} g. (c) No. The amount of A is unchanged, so the yield of C is unchanged and the extra B is left over. A is the LIMITING reagent here; yield is set by the limiting reagent, and adding more of the one in excess changes nothing. The common error is reading "more reactant" as "more product" without identifying which reagent limits.`,
        min: 12, diff: 'intermediate',
      }
    } },
  { topic: '酸鹼', n: 7, make: (k) => {
      const ca = (0.1 + k * 0.05).toFixed(2), va = 20 + k * 2
      const cb = (0.1 + (k % 3) * 0.05).toFixed(2)
      const vb = ((Number(ca) * va) / Number(cb)).toFixed(1)
      return {
        q: `以濃度 ${cb} mol dm⁻³ 的氫氧化鈉溶液滴定 ${va} cm³、濃度 ${ca} mol dm⁻³ 的鹽酸（一元對一元）。\n（a）求到達終點所需的鹼液體積。\n（b）到達終點時溶液的 pH 值約為多少？試說明理由。\n（c）若把酸換成同濃度、同體積的弱酸，所需鹼液體積會否改變？終點的 pH 又會否改變？兩者的答案為何不同？`,
        ans: `（a）n(酸) = ${ca} × ${va} / 1000 = ${((Number(ca) * va) / 1000).toFixed(4)} mol；一元對一元，n(鹼) 相同；V = ${vb} cm³。\n（b）強酸與強鹼完全中和，生成的鹽不水解，故 pH 約為 7。\n（c）所需體積【不變】—— 中和所需的鹼由酸的物質的量決定，與酸的強弱（電離程度）無關。\n終點 pH【會改變】—— 弱酸與強鹼中和所得的鹽會水解而呈鹼性，終點 pH 大於 7。\n⚠️ 這一題的關鍵，是分清「有多少可中和的酸」與「酸電離得有多徹底」是兩件事：前者決定體積，後者決定終點的 pH。`,
        ansEn: `(a) V = ${vb} cm³. (b) About 7 — a strong acid and strong base give a salt that does not hydrolyse. (c) The volume is UNCHANGED, because the base required is fixed by the amount of acid, not by how far it ionises. The end-point pH DOES change: the salt of a weak acid with a strong base hydrolyses and the pH exceeds 7. The point is that "how much acid there is" and "how completely it ionises" are separate questions.`,
        min: 14, diff: 'hard',
      }
    } },
  { topic: '氧化還原', n: 7, make: (k) => {
      const ox = ['Fe²⁺ → Fe³⁺', 'Cu → Cu²⁺', 'Zn → Zn²⁺', 'I⁻ → I₂', 'S²⁻ → S', 'Sn²⁺ → Sn⁴⁺', 'Mn²⁺ → MnO₂'][k % 7]
      const e = [1, 2, 2, 1, 2, 2, 2][k % 7]
      return {
        q: `考慮以下半反應：${ox}。\n（a）指出這是氧化還是還原，並寫出電子的得失數目。\n（b）在整個氧化還原反應中，這一半反應中的物質擔任氧化劑還是還原劑？\n（c）有同學說「失去電子的一方就是被還原」。試指出這句話錯在哪裏，並提出一個可以避免混淆的記法。`,
        ans: `（a）這是【氧化】—— 氧化數上升，每個粒子失去 ${e} 個電子。\n（b）失去電子者把電子交給對方，使對方被還原，故它本身是【還原劑】。\n（c）該句錯在把「失去電子」與「被還原」配對。正確的對應是：\n失電子＝氧化＝作還原劑；得電子＝還原＝作氧化劑。\n記法：可用「氧失還得」四字 —— 氧化是失電子，還原是得電子；至於劑的名稱則永遠與自身所受的變化【相反】（自己被氧化，就是還原劑）。\n⚠️ 本科最常見的混淆正在於「劑」的命名方向，多練幾條把兩層一併寫出，就不會再倒轉。`,
        ansEn: `(a) Oxidation — the oxidation number rises and each particle loses ${e} electron(s). (b) The species that loses electrons hands them to the other, which is thereby reduced; so it acts as the REDUCING agent. (c) The statement pairs "loses electrons" with "is reduced", which is wrong. Losing electrons is oxidation and makes the species a reducing agent; gaining electrons is reduction and makes it an oxidising agent. Note that the agent's name is always the opposite of what happens to it.`,
        min: 10, diff: 'intermediate',
      }
    } },
  { topic: '反應速率與能量', n: 7, make: (k) => {
      const t1 = 20 + k * 5, t2 = t1 + 10 + k * 2
      return {
        q: `同一反應分別在 ${t1} °C 與 ${t2} °C 下進行，其餘條件相同。\n（a）指出溫度較高時反應速率的變化方向。\n（b）以碰撞理論解釋這個變化，須同時提及【碰撞頻率】與【能量】兩方面。\n（c）有同學說「升溫加快反應，是因為分子撞得比較密」。這個解釋為何不完整？`,
        ans: `（a）在 ${t2} °C 下反應速率【較快】。\n（b）碰撞理論：\n一、溫度上升令粒子平均動能增加，運動較快，單位時間內的【碰撞頻率】增加。\n二、更重要的是，動能達到或超過【活化能】的粒子比例顯著上升，故【有效碰撞】的比例增加。\n兩者相乘，反應速率上升。\n（c）該解釋只講了第一點。實驗上碰撞頻率的增幅其實相當有限，而反應速率往往增加數倍 —— 主要貢獻來自越過活化能的粒子比例上升。只講「撞得密」解釋不了這個幅度。\n⚠️ 答本題必須兩點齊全，只寫碰撞頻率通常只得一半分數。`,
        ansEn: `(a) Faster at ${t2} °C. (b) Higher temperature raises the average kinetic energy, so collisions become more frequent; more importantly, the fraction of particles with energy at or above the ACTIVATION ENERGY rises sharply, so a greater proportion of collisions are effective. (c) The explanation gives only the first factor. The increase in collision frequency is modest, while rates often multiply — the dominant contribution is the larger fraction clearing the activation energy.`,
        min: 12, diff: 'intermediate',
      }
    } },
  { topic: '氣體體積', n: 7, make: (k) => {
      const mol = (0.2 + k * 0.1).toFixed(1), Vm = 24
      const V = (Number(mol) * Vm).toFixed(1)
      return {
        q: `在室溫及標準大氣壓下（莫耳體積取 ${Vm} dm³ mol⁻¹），某氣體樣本的物質的量為 ${mol} mol。\n（a）求該氣體的體積。\n（b）若把樣本換成另一種莫耳質量大得多的氣體，而物質的量不變，體積會否改變？試說明。\n（c）承 (b)，若改為【質量】不變而換氣體，體積又會如何？`,
        ans: `（a）V = n × Vm = ${mol} × ${Vm} = ${V} dm³。\n（b）【不變】。在相同溫度與壓力下，相同物質的量的任何氣體佔有相同體積（亞佛加德羅定律）——體積由粒子數目決定，與粒子有多重無關。\n（c）【會改變】。質量相同時，莫耳質量較大者物質的量較少（n = m/M），故體積較小。\n⚠️ 本題考的正是「物質的量固定」與「質量固定」兩個條件的分別。混淆兩者，是氣體計算最常見的失分來源。`,
        ansEn: `(a) V = nVm = ${V} dm³. (b) Unchanged — at the same temperature and pressure, equal amounts in moles of any gas occupy equal volumes (Avogadro's law); the volume depends on the number of particles, not their mass. (c) It changes: at equal mass, a larger molar mass means fewer moles (n = m/M) and therefore a smaller volume. The item tests the difference between holding n fixed and holding m fixed.`,
        min: 10, diff: k % 3 === 0 ? 'basic' : 'intermediate',
      }
    } },
]

// ── 生物 ────────────────────────────────────────────────────────────────
const BIO = [
  { topic: '遺傳', n: 9, make: (k) => {
      const trait = ['圓粒與皺粒', '高莖與矮莖', '紅花與白花', '黑毛與棕毛', '有耳垂與無耳垂', '正常與白化', '捲舌與不捲舌', '長翅與殘翅', '灰身與黑身'][k % 9]
      const n = 400 + k * 40
      return {
        q: `某性狀由一對等位基因控制，顯性為完全顯性（${trait}）。兩隻雜合子個體交配，共產生 ${n} 個子代。\n（a）寫出親本的基因型，並以棋盤方格推算子代的基因型比例。\n（b）按理論比例，預期有多少個子代表現隱性性狀？\n（c）實際觀察所得的隱性個體為 ${Math.round(n / 4) + 12 + k} 個，與理論值不同。這是否代表遺傳定律不成立？試說明。`,
        ans: `（a）親本均為 Aa。棋盤方格得子代基因型 AA : Aa : aa = 1 : 2 : 1；表現型顯性 : 隱性 = 3 : 1。\n（b）隱性（aa）預期 = ${n} × 1/4 = ${Math.round(n / 4)} 個。\n（c）【不代表定律不成立】。孟德爾比例是【機率】而非保證，實際數目必然圍繞理論值波動；本例觀察值 ${Math.round(n / 4) + 12 + k} 與理論值 ${Math.round(n / 4)} 相差 ${12 + k}，屬合理範圍。\n樣本愈大，實際比例愈接近理論比例（大數法則）；若樣本只有十餘個子代，偏差比例會大得多。\n⚠️ 答「定律不準」或「其中一隻親本基因型判斷錯誤」而不作任何統計考慮，屬未掌握「機率與實測」的關係。`,
        ansEn: `(a) Both parents are Aa; the Punnett square gives 1 AA : 2 Aa : 1 aa, i.e. 3 dominant : 1 recessive. (b) Expected recessive = ${Math.round(n / 4)}. (c) It does not. Mendelian ratios are probabilities, not guarantees; observed counts fluctuate around the expectation, and a deviation of ${12 + k} on ${n} offspring is unremarkable. Larger samples converge on the theoretical ratio. Concluding that the law fails, without any statistical consideration, misses the relation between probability and observation.`,
        min: 14, diff: 'intermediate',
      }
    } },
  { topic: '酶', n: 9, make: (k) => {
      const opt = 35 + k, lo = opt - 15, hi = opt + 15
      return {
        q: `某酶的最適溫度為 ${opt} °C。實驗分別在 ${lo} °C、${opt} °C 與 ${hi} °C 下測量反應速率，其餘條件相同。\n（a）預測三個溫度下反應速率的高低次序。\n（b）${lo} °C 與 ${hi} °C 下速率都較低，但成因【不同】。試分別說明。\n（c）若把 ${hi} °C 的樣本降回 ${opt} °C，速率能否回復？把 ${lo} °C 的樣本升至 ${opt} °C 呢？`,
        ans: `（a）${opt} °C 最快；${lo} °C 與 ${hi} °C 均較慢。\n（b）成因不同：\n${lo} °C —— 粒子動能較低，酶與受質【碰撞頻率下降】，有效碰撞減少；酶的結構【未受破壞】。\n${hi} °C —— 高溫破壞維持酶三維結構的鍵，活性部位形狀改變，即【變性】；酶已失去催化能力。\n（c）由 ${hi} °C 降回 ${opt} °C：【不能回復】，因為變性通常不可逆。\n由 ${lo} °C 升至 ${opt} °C：【可以回復】，因為低溫只是減慢，未破壞結構。\n⚠️ 本題的分數幾乎全在 (b)(c) 的「不同成因」上。只答「溫度不適合」而不區分「慢」與「壞」，是最常見的失分寫法。`,
        ansEn: `(a) Fastest at ${opt} °C; slower at both ${lo} °C and ${hi} °C. (b) The causes differ: at ${lo} °C the particles have less kinetic energy so collisions are less frequent, but the enzyme is INTACT; at ${hi} °C the bonds holding the tertiary structure are disrupted, the active site changes shape and the enzyme is DENATURED. (c) Cooling from ${hi} °C does not restore activity, as denaturation is generally irreversible; warming from ${lo} °C does, since low temperature only slows the reaction. Nearly all the marks lie in distinguishing "slowed" from "destroyed".`,
        min: 14, diff: 'intermediate',
      }
    } },
  { topic: '光合作用', n: 9, make: (k) => {
      const li = 20 + k * 10, co2 = (0.03 + k * 0.01).toFixed(2)
      return {
        q: `在光強度由低逐步增至 ${li} 任意單位的實驗中，光合作用速率先隨光強度上升，其後不再增加（二氧化碳濃度固定為 ${co2}%）。\n（a）解釋為何速率在初段隨光強度上升。\n（b）解釋為何其後速率不再增加，並指出此時甚麼因素成為限制因素。\n（c）設計一項實驗以驗證 (b) 的推斷。須說明改變甚麼、固定甚麼、預期看到甚麼結果。`,
        ans: `（a）初段光強度是【限制因素】：光提供光反應所需能量，光愈強，單位時間內產生的 ATP 與還原力愈多，故速率上升。\n（b）其後曲線變平，代表光已不再限制速率 —— 此時【二氧化碳濃度】（在本實驗固定於 ${co2}%）成為限制因素，或溫度成為限制因素。\n（c）驗證方法：\n改變：把二氧化碳濃度提高（例如由 ${co2}% 提高一倍），\n固定：溫度、光強度範圍、葉片面積與品種、實驗時間，\n預期結果：若二氧化碳確為限制因素，新曲線的【平台高度上升】，即在同一光強度下速率較高；若平台高度不變，則限制因素另有其他。\n⚠️ 實驗設計題必須三項齊全（變、控、預期），只寫「加多些二氧化碳看看」不能取分。`,
        ansEn: `(a) At low light, light is the LIMITING factor: more light means more ATP and reducing power from the light reactions, so the rate rises. (b) The plateau shows light is no longer limiting; carbon dioxide (held at ${co2}%) or temperature has become the limiting factor. (c) Change the CO₂ concentration (say double it); hold temperature, the range of light intensities, leaf area, variety and duration constant; predict that if CO₂ was limiting, the plateau rises. An unchanged plateau points to another factor. Design answers need all three parts — variable, controls, prediction.`,
        min: 15, diff: 'hard',
      }
    } },
  { topic: '生態', n: 9, make: (k) => {
      const p = 1200 + k * 150, h = Math.round(p * 0.1), c = Math.round(h * 0.1)
      return {
        q: `某生態系統的能量流動記錄如下（單位：kJ m⁻² 年⁻¹）：生產者固定 ${p}，初級消費者獲得 ${h}，次級消費者獲得 ${c}。\n（a）計算兩個營養級之間的能量傳遞效率。\n（b）解釋為何能量在營養級之間會大量流失，須列出【兩個】途徑。\n（c）根據上述數字，說明為何食物鏈通常不超過四至五個營養級。`,
        ans: `（a）生產者 → 初級：${h} / ${p} × 100% = ${((h / p) * 100).toFixed(1)}%；初級 → 次級：${c} / ${h} × 100% = ${((c / h) * 100).toFixed(1)}%。\n（b）流失途徑（列兩個）：\n一、【呼吸作用】—— 大部分同化的能量用於維持生命活動並以熱能散失。\n二、【未被攝食或未被消化的部分】—— 例如根、木質部分未被取食，或已攝食但隨糞便排出。\n（c）每上升一個營養級只餘約 10%，故由 ${p} 出發，第四級只餘約 ${Math.round(p * 0.001)}，第五級約 ${(p * 0.0001).toFixed(1)}。能量少至不足以支持一個可存活的族群，故食物鏈長度受能量而非受空間或時間限制。\n⚠️ (c) 必須用數字說明「少到不足以支持族群」，只答「能量會流失」不足以解釋為何剛好停在四至五級。`,
        ansEn: `(a) ${((h / p) * 100).toFixed(1)}% and ${((c / h) * 100).toFixed(1)}%. (b) Two routes: respiration, which dissipates most assimilated energy as heat; and material never eaten or never digested, lost in faeces or left uneaten. (c) With roughly 10% passing on at each step, ${p} falls to about ${Math.round(p * 0.001)} at the fourth level and ${(p * 0.0001).toFixed(1)} at the fifth — too little to support a viable population. Chain length is limited by energy, not by space or time. Part (c) needs the numbers, not just "energy is lost".`,
        min: 14, diff: 'intermediate',
      }
    } },
  { topic: '人體系統', n: 9, make: (k) => {
      const hr = 60 + k * 5, sv = 65 + k * 3
      const co = ((hr * sv) / 1000).toFixed(2)
      return {
        q: `某人靜息時心率為 ${hr} 次 min⁻¹，每搏輸出量為 ${sv} cm³。\n（a）計算心輸出量（以 dm³ min⁻¹ 表示）。\n（b）運動時心輸出量顯著上升。指出【兩個】可以令心輸出量上升的生理途徑。\n（c）長期進行耐力訓練的人，靜息心率往往較低，但靜息心輸出量與常人相若。試解釋這個現象。`,
        ans: `（a）心輸出量 = 心率 × 每搏輸出量 = ${hr} × ${sv} = ${hr * sv} cm³ min⁻¹ = ${co} dm³ min⁻¹。\n（b）兩個途徑：一、心率上升；二、每搏輸出量上升（心肌收縮力增強、回心血量增加）。\n（c）耐力訓練令心肌增厚、心室容積增大，【每搏輸出量上升】。由於心輸出量 = 心率 × 每搏輸出量，在身體對血流的需求不變時，每搏輸出量上升就容許心率下降而維持相同的心輸出量。\n這是效率的提升：同樣的血流量，心臟跳動次數較少。\n⚠️ 答「因為身體較好」不能取分，必須指出兩個變量之間的乘積關係。`,
        ansEn: `(a) Cardiac output = HR × stroke volume = ${hr * sv} cm³ min⁻¹ = ${co} dm³ min⁻¹. (b) Raise the heart rate; raise the stroke volume (stronger contraction, greater venous return). (c) Endurance training thickens the myocardium and enlarges the ventricles, raising STROKE VOLUME. Since output is the product of the two, a larger stroke volume allows a lower rate at the same output — the same flow for fewer beats. "Because they are fitter" earns nothing; the product relationship must be stated.`,
        min: 12, diff: 'intermediate',
      }
    } },
  { topic: '神經與協調', n: 9, make: (k) => {
      const d = 0.5 + k * 0.1, v = 40 + k * 5
      const t = ((d / v) * 1000).toFixed(1)
      return {
        q: `某神經纖維的傳導速度為 ${v} m s⁻¹，由受器至中樞的距離為 ${d.toFixed(1)} m。\n（a）計算衝動由受器傳至中樞所需時間（以毫秒表示）。\n（b）反射弧的實際反應時間遠長於 (a) 的計算值。指出【兩個】原因。\n（c）解釋為何反射動作可以在訊息傳至大腦之前已經發生，並說明這種安排的生存意義。`,
        ans: `（a）t = d/v = ${d.toFixed(1)} / ${v} = ${(d / v).toFixed(4)} s = ${t} ms。\n（b）兩個原因：一、【突觸傳遞需時】—— 神經遞質的釋放、擴散與受體結合每個突觸約需 0.5–1 ms，而反射弧至少有兩至三個突觸；二、還須加上【效應器反應的時間】（肌肉由收到訊號至產生張力並非瞬時）。\n（c）反射弧的整合中心在【脊髓】而非大腦：感覺神經元進入脊髓後可直接或經中間神經元傳至運動神經元，不必先上行至腦。\n生存意義：縮短了反應時間 —— 在觸及高溫或尖銳物體等情況下，早幾十毫秒縮手可以顯著減少組織損傷。訊息仍會上傳至腦，但那是在動作發生【之後】才產生痛覺。\n⚠️ 常見錯誤：以為先感到痛才縮手。實際次序相反，這正是本題要考的。`,
        ansEn: `(a) t = d/v = ${t} ms. (b) Synaptic transmission takes about 0.5–1 ms at each of the two or three synapses in the arc; and the effector itself takes time to develop tension. (c) The integrating centre of a reflex arc is the SPINAL CORD, not the brain: the sensory neurone passes to the motor neurone directly or through a relay neurone without ascending to the brain. This shortens the response, and on a hot or sharp object a few tens of milliseconds saves tissue. The signal still reaches the brain, but pain is felt AFTER the movement — the reverse of the usual assumption.`,
        min: 14, diff: 'hard',
      }
    } },
  { topic: '細胞', n: 9, make: (k) => {
      const c1 = (0.2 + k * 0.05).toFixed(2), c2 = (0.6 - k * 0.03).toFixed(2)
      return {
        q: `把植物細胞分別放入濃度 ${c1} mol dm⁻³ 與 ${c2} mol dm⁻³ 的蔗糖溶液中（細胞液濃度約為 0.35 mol dm⁻³）。\n（a）分別預測兩種情況下水分的淨移動方向。\n（b）描述在較高濃度溶液中細胞會出現的變化，並寫出該現象的名稱。\n（c）若把同一實驗改用動物細胞進行，較高濃度一組的結果會有何不同？試由結構上的分別解釋。`,
        ans: `（a）在 ${c1} mol dm⁻³（低於細胞液）：水【淨移入】細胞；在 ${c2} mol dm⁻³（高於細胞液）：水【淨移出】細胞。\n（b）在較高濃度中，液泡失水收縮，原生質層與細胞壁分離 —— 此現象稱為【質壁分離】。細胞壁本身不變形，故細胞整體外形大致維持。\n（c）動物細胞【沒有細胞壁】，失水後整個細胞皺縮變形（皺縮），而不是出現質壁分離。\n結構解釋：細胞壁提供機械支撐，使植物細胞在失水時仍維持外形，只有內部的原生質層退離；動物細胞沒有這層支撐，形狀直接隨體積改變。\n⚠️ 本題必須答出「質壁分離」與「皺縮」兩個不同名稱及其結構原因，只寫「都會失水」不足以取分。`,
        ansEn: `(a) At ${c1} mol dm⁻³ water moves INTO the cell; at ${c2} mol dm⁻³ it moves OUT. (b) In the stronger solution the vacuole shrinks and the protoplast pulls away from the wall — PLASMOLYSIS. The wall itself does not deform, so the cell keeps its outline. (c) An animal cell has NO cell wall, so it crenates: the whole cell shrinks and distorts rather than showing plasmolysis. The wall supplies mechanical support; without it, shape follows volume directly. Both terms and the structural reason are required.`,
        min: 14, diff: 'intermediate',
      }
    } },
  { topic: '營養與消化', n: 9, make: (k) => {
      const ph1 = 2, ph2 = 8, len = 5 + k
      return {
        q: `胃液的 pH 約為 ${ph1}，小腸內容物經胰液中和後 pH 約為 ${ph2}。某人的小腸長度約 ${len} m。\n（a）指出在胃與小腸各自活躍的一種蛋白酶，並說明為何兩者的最適 pH 不同。\n（b）解釋小腸長而具絨毛的結構如何配合其功能。\n（c）若某人因手術切除了部分小腸，哪一項功能最先受影響？試以 (b) 的原理說明。`,
        ans: `（a）胃：【胃蛋白酶】，最適 pH 約 2；小腸：【胰蛋白酶】，最適 pH 約 8。\n每種酶的活性部位形狀由其三維結構決定，而該結構對 pH 敏感；兩者在各自器官的 pH 環境下演化出最高活性，離開該範圍活性即下降。\n（b）小腸長 ${len} m 並具環狀皺襞、絨毛與微絨毛，把【吸收表面積】放大數百倍；絨毛內有豐富微血管與乳糜管，使吸收後的養分能迅速被帶走，維持濃度梯度。\n（c）最先受影響的是【吸收】而非消化 —— 消化酶主要由胰臟與腸腺分泌，切除部分腸段不會令酶消失；但吸收表面積下降，養分未被完全吸收即被推進大腸，導致營養吸收不足。\n⚠️ 答題要指出「消化與吸收是兩件事」，這是本題的分辨點。`,
        ansEn: `(a) Pepsin in the stomach (optimum about pH 2) and trypsin in the small intestine (about pH 8). An enzyme's active site depends on a tertiary structure that is pH-sensitive, and each works best in the pH of its own organ. (b) A length of ${len} m with folds, villi and microvilli multiplies the ABSORPTIVE SURFACE several hundredfold, and the capillaries and lacteals inside each villus carry absorbed nutrients away, maintaining the gradient. (c) ABSORPTION suffers first, not digestion: the enzymes come from the pancreas and intestinal glands and are not removed with the tissue, but less surface means nutrients pass on before being taken up. The distinction between digestion and absorption is the point.`,
        min: 14, diff: 'intermediate',
      }
    } },
]

// 課題標籤 → topic id。既有的 chinese-writing 草稿有帶 topicId，
// promote 時直接用，不必靠 slug() 猜 —— 中文標籤 slug 完 match 不到任何
// 已宣告 id，會變成孤兒課題（_gate.mjs 註釋記錄過實測 58 條）。
const TOPIC_ID = {
  運動學: 'kinematics', 力與運動: 'force_motion', '功、能與功率': 'work_energy',
  電學: 'electricity', 熱學: 'heat', 波動: 'waves', 光學: 'optics', 放射現象: 'radioactivity',
  摩爾概念: 'mole', 濃度: 'concentration', 化學計量: 'stoichiometry', 酸鹼: 'acids_bases',
  氧化還原: 'redox', 反應速率與能量: 'rates_energy', 氣體體積: 'gas_volume',
  遺傳: 'genetics', 酶: 'enzymes', 光合作用: 'photosynthesis', 生態: 'ecology',
  人體系統: 'human_body', 神經與協調: 'coordination', 細胞: 'cells', 營養與消化: 'digestion',
}

const build = (subject, subjectZh, groups, prefix) => {
  const out = []
  groups.forEach((g, gi) => {
    for (let k = 0; k < g.n; k++) {
      const r = g.make(k)
      out.push({
        id: `${prefix}_${gi}_${String(k + 1).padStart(2, '0')}`,
        type: 'long',
        subject,
        topic: g.topic,
        topicId: TOPIC_ID[g.topic] ?? null,
        topicZh: g.topic,
        difficulty: r.diff,
        marks: 8,
        suggestedMinutes: r.min,
        question: r.q,
        explanation: r.why ?? (
          '本題考核的是【由數據走到結論】的完整過程：計算要寫得出步驟，'
          + '解釋要指出機制而非複述現象，延伸部分要處理題目指定的比較或條件。'
          + '評卷關注的不是最終數字，而是每一步是否有依據 —— '
          + '答案正確而過程跳步，與過程完整而末步算錯，前者失分往往更多。'
        ),
        referenceAnswer: r.ans,
        referenceAnswerEn: r.ansEn,
        markingScheme:
          `本題分三部分評分（本平台練習用尺度）：\n` +
          `（a）計算或辨識 —— 步驟是否寫出、單位是否正確。\n` +
          `（b）解釋 —— 是否指出機制而非只複述現象。\n` +
          `（c）延伸判斷 —— 是否處理了題目指定的比較或條件，並說明理由。\n` +
          `建議用時 ${r.min} 分鐘。\n${SCHEME_TAIL_ZH}`,
        markingSchemeEn:
          `Three parts (a practice scale used on this platform):\n` +
          `(a) calculation or identification — are the steps shown and the units correct;\n` +
          `(b) explanation — is a mechanism given rather than the observation restated;\n` +
          `(c) extension — is the specified comparison or condition addressed, with reasons.\n` +
          `Suggested time: ${r.min} minutes.\n${SCHEME_TAIL_EN}`,
      })
    }
  })
  const file = path.join(OUT, `${subject}-long-b1.json`)
  fs.writeFileSync(file, JSON.stringify(out, null, 1) + '\n', 'utf8')
  // decisions 骨架：reviewer 一律留空 —— 憲章 §12，機器永不代簽。
  const dec = {
    _meta: { source: `${subject}-long-b1.json`, subject, reviewer: '', reviewedAt: '' },
    decisions: Object.fromEntries(out.map((q) => [q.id, 'pending'])),
  }
  fs.writeFileSync(path.join(OUT, `${subject}-long-b1.decisions.json`), JSON.stringify(dec, null, 1) + '\n', 'utf8')
  console.log(`  ${subjectZh.padEnd(6)} → ${out.length} 條  ${path.relative(ROOT, file)}`)
  return out.length
}

console.log('生成書寫題草稿（reviewer 欄一律留空，待真人逐題簽署）：')
let total = 0
total += build('physics', '物理', PHYS, 'ph_l')
total += build('chemistry', '化學', CHEM, 'ch_l')
total += build('biology', '生物', BIO, 'bio_l')
console.log(`\n合計 ${total} 條草稿。下一步：`)
console.log('  node scripts/qbank/review-drafts.mjs --in scripts/qbank/drafts/<file>.json --subject <subject>')
console.log('  然後由真人喺 .review.html 逐題批，簽名後先可以 promote。')
