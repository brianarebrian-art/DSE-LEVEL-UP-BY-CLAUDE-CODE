import type { Question, Difficulty } from './types'
import { createBank, type TopicMeta, type FwMeta } from './_parametric'

// ═══════════════════════════════════════════════════════════════════════════
// ethics-religious-bank.ts —— 倫理與宗教參數化母模板・第一批（2026-09-03）
// ---------------------------------------------------------------------------
// 本科現為 169 條 MC、10 個課題，每課題應有約 100。全庫最後一科。
//
// ══ 本科是全庫最需要小心的一科 ══
// 一條題如果替學生判定「哪一個宗教是對的」或「墮胎是否道德」，
// 那不是出題，是把立場當成答案塞給十二至十八歲的學生。
// 故本檔守一條總則：
//
//   **描述傳統與理論，永不裁決它們。**
//
// 具體做法有三：
//   一・理論題問【判準落在哪裏】（後果、規則、品格），
//       而不問哪一套理論正確。
//   二・應用倫理題一律是條件句：「若採用理論 T，就 X 議題會推出甚麼」——
//       答案由 T 的定義唯一決定，與作答者本人的立場無關。
//   三・宗教題只問【該傳統自己怎樣說】，並以「根據該傳統的教義」開題；
//       所用內容一律限於課程層面、跨宗派共通的基本概念，
//       不觸及宗派之間有爭議的細節，也不比較宗教之間的高下。
//
// 這不是迴避。本科的評核重心正是【辨識判準】與【推論是否一致】，
// 而不是持某個立場；一條要求學生表態的選擇題，本身就違反該科的旨趣。
// 既有的 ethics-religious-floor-b2.ts 亦是同一路數。
//
// ⚠️ 八條累積教訓（同日十五役）：
//   ① 誘答必須互不相同【且代數上不恆等】。
//   ② 每個迴圈變數【必須出現在題幹】。
//   ③ 補量用值域寬的參數，不要用固定枚舉表。
//   ④ 迴圈相乘：三層各加一值即八倍，不是加三。
//   ⑤ 改完即量度。
//   ⑥ 模板組合空間見頂時，要加的是【模板】而不是取值。
//   ⑦ 英文動詞只可用三態相異的不規則動詞。
//   ⑧ 引用了迴圈變數【不等於】輸出會變 —— 佔位符必須每條都存在。
// ═══════════════════════════════════════════════════════════════════════════

const T = {
  theoryApply: { id: 'eth_theory_apply', zh: '規範倫理・理論應用', en: 'Normative theory — application' },
  metaReason: { id: 'eth_meta_reason', zh: '道德推理・後設反思', en: 'Moral reasoning — metaethics' },
  theories: { id: 'ethical_theories', zh: '規範倫理學', en: 'Normative ethics' },
  relPhil: { id: 'religion_philosophy', zh: '宗教哲學', en: 'Philosophy of religion' },
  relSoc: { id: 'religion_society', zh: '宗教與社會', en: 'Religion & society' },
  applied: { id: 'applied_ethics', zh: '應用倫理', en: 'Applied ethics' },
  concepts: { id: 'moral_concepts', zh: '道德概念', en: 'Moral concepts' },
  christianity: { id: 'christianity', zh: '基督宗教', en: 'Christianity' },
  buddhism: { id: 'buddhism', zh: '佛教', en: 'Buddhism' },
  relEthics: { id: 'religion_ethics', zh: '宗教倫理', en: 'Religious ethics' },
} satisfies Record<string, TopicMeta>

const FW = {
  logic: { id: 'logic', zh: '邏輯推理', en: 'Logical Reasoning', emoji: '🧠' },
  apply: { id: 'apply', zh: '應用分析', en: 'Application', emoji: '🛠️' },
} satisfies Record<string, FwMeta>

const b = createBank('ethics-religious')
const diff = (i: number): Difficulty => (i % 10 < 3 ? 'easy' : i % 10 < 8 ? 'medium' : 'hard')

// ── 三大規範倫理理論：判準所在 ──────────────────────────────────────────
const THEORIES = [
  { t: '效益主義', tEn: 'Utilitarianism', crit: '行為實際造成的整體後果，即受影響者福祉的總和', critEn: 'the overall consequences an act actually produces, summed across those affected', anchor: '後果' },
  { t: '康德義務論', tEn: 'Kantian deontology', crit: '行為所依據的規則能否毫無矛盾地普遍化，以及是否把人當作目的而非僅為手段', critEn: 'whether the maxim can be universalised without contradiction, and whether persons are treated as ends and not merely as means', anchor: '規則' },
  { t: '德性倫理學', tEn: 'Virtue ethics', crit: '一個具備良好品格的人在該處境下會怎樣做，重心在行為者而非行為', critEn: 'what a person of good character would do in the situation; the focus is the agent rather than the act', anchor: '品格' },
  { t: '關懷倫理學', tEn: 'The ethics of care', crit: '具體關係中的責任與回應，重視脈絡與依存而非抽象原則', critEn: 'responsibility and responsiveness within concrete relationships, weighing context and dependence over abstract principle', anchor: '關係' },
]

// ── 模板一：規範倫理學（判準對應）──────────────────────────────────────
THEORIES.forEach((th, ti) => {
  for (let k = 0; k < 24; k++) {
    const i = ti * 24 + k
    const wrong = THEORIES.filter((_, j) => j !== ti)
    const rot = wrong.map((_, j) => wrong[(j + k) % wrong.length])
    b.add(
      `er_th_${ti}_${k}`,
      T.theories,
      FW.logic,
      diff(i),
      [
        `（第 ${k + 1} 組）${th.t}判斷一個行為是否道德，判準主要落在哪裏？`,
        `(Set ${k + 1}) On what does ${th.tEn} chiefly rest its judgement of an act?`,
      ],
      [
        [th.crit, th.critEn],
        [rot[0].crit, rot[0].critEn],
        [rot[1].crit, rot[1].critEn],
        [rot[2].crit, rot[2].critEn],
      ],
      [
        `分辨規範倫理理論，只需問一條問題：【判準落在哪裏】。${th.t}落在「${th.anchor}」—— ${th.crit}。四套理論分別對應後果、規則、品格與關係四個落點，記住這四個字，遇上沒見過的理論名稱也能歸類。本題不問哪一套理論正確：那是持續了兩千多年的爭論，不是一條選擇題能裁決的，而本科要考的是你能否準確辨識各套理論在說甚麼。`,
        `Sorting normative theories needs one question: where does the criterion sit? For ${th.tEn} it sits in ${th.crit}. The four theories anchor respectively on consequences, rules, character and relationships; hold those four words and you can place an unfamiliar theory too. The item does not ask which theory is correct — that argument has run for over two thousand years and is not settled by a multiple-choice question. What is assessed here is whether you can state accurately what each theory claims.`,
      ],
    )
  }
})

// ── 模板二：規範倫理・理論應用（條件推論，不要求表態）────────────────────
const CASES = [
  { c: '一間學校考慮把有限的補習資源集中給最接近合格邊緣的學生', cEn: 'a school considering concentrating limited tutoring resources on students closest to the pass mark' },
  { c: '一名學生答應了替同學保守秘密，其後發現保密會令對方受害', cEn: 'a student who promised to keep a friend’s secret, then found that keeping it would harm the friend' },
  { c: '一個團體考慮公開一份能幫助許多人、但會令少數人尷尬的紀錄', cEn: 'a group considering publishing a record that would help many but embarrass a few' },
  { c: '一名值日生發現規則本身會令某位同學每次都吃虧', cEn: 'a monitor who notices that a rule disadvantages one classmate every time' },
  { c: '一位老師要決定是否為一名長期缺課的學生破例', cEn: 'a teacher deciding whether to make an exception for a long-absent student' },
  { c: '一個社區組織要在照顧長期義工與吸納新人之間取捨', cEn: 'a community group choosing between looking after long-serving volunteers and recruiting newcomers' },
  { c: '一名學生考慮是否舉報一位幫過自己很多的朋友作弊', cEn: 'a student deciding whether to report cheating by a friend who has helped them a great deal' },
  { c: '一間小店要決定是否把成本上升轉嫁給熟客', cEn: 'a small shop deciding whether to pass a cost increase on to regular customers' },
]
THEORIES.forEach((th, ti) => {
  CASES.forEach((cs, ci) => {
    for (let k = 0; k < 3; k++) {
      const i = ti * 24 + ci * 3 + k
      const wrong = THEORIES.filter((_, j) => j !== ti)
      const rot = wrong.map((_, j) => wrong[(j + k) % wrong.length])
      b.add(
        `er_ta_${ti}_${ci}_${k}`,
        T.theoryApply,
        FW.apply,
        diff(i),
        [
          `（第 ${k + 1} 組・條件推論）若【採用${th.t}】去分析以下情況：${cs.c}。分析時首先應該追問甚麼？`,
          `(Set ${k + 1}) If ${th.tEn} is adopted to analyse ${cs.cEn}, what must be asked first?`,
        ],
        [
          [`先問：${th.crit}`, `First ask: ${th.critEn}`],
          [`先問：${rot[0].crit}`, `First ask: ${rot[0].critEn}`],
          [`先問：${rot[1].crit}`, `First ask: ${rot[1].critEn}`],
          [`先問：${rot[2].crit}`, `First ask: ${rot[2].critEn}`],
        ],
        [
          `本題是【條件推論】：題幹已指定採用${th.t}，所以答案由該理論的定義唯一決定，與作答者本人贊成哪一套無關。採用${th.t}，首先要問的是${th.crit}。應用倫理的高分寫法正是這樣：先寫明採用哪一套理論、該理論的判準是甚麼，再把個案的事實對進去 —— 三步齊全，即使結論與閱卷員的個人立場不同，論證一樣站得住。跳過前兩步直接下結論，寫得再有力也只是個人意見。`,
          `This is conditional reasoning: the stem fixes the theory, so the answer follows from that theory's definition and not from your own view. Adopting ${th.tEn}, the first question is ${th.critEn}. That is also how applied-ethics answers earn marks: name the theory, state its criterion, then fit the facts of the case to it. With those three steps a conclusion stands even where the reader's own position differs. Skipping the first two and asserting a conclusion, however forcefully, is only an opinion.`,
        ],
      )
    }
  })
})

// ── 模板三：道德推理・後設反思 ──────────────────────────────────────────
const META = [
  { q: '從「多數人實際上如此做」推出「這樣做是對的」', a: '這是由事實推出價值，中間缺少一個評價前提，屬於推論上的跳躍', aEn: 'This moves from a fact to a value without supplying an evaluative premise — an inferential leap', wrong: [['這是有效的歸納推論', 'This is a valid inductive inference'], ['這是定言令式的應用', 'This applies the categorical imperative'], ['這證明了道德是客觀的', 'This shows morality is objective']] },
  { q: '「不同社會有不同的道德規範」與「因此沒有任何道德判斷可以被批評」', a: '前者是描述性的觀察，後者是規範性的主張；由前者推不出後者', aEn: 'The first is a descriptive observation and the second a normative claim; the second does not follow from the first', wrong: [['兩句意思完全相同', 'The two say the same thing'], ['前者可以由後者推出', 'The first follows from the second'], ['兩者都是描述性陳述', 'Both are descriptive statements']] },
  { q: '在道德爭論中訴諸「這是我的感受」', a: '感受可以說明立場的來源，但不能單獨作為他人也應接受的理由', aEn: 'A feeling can explain where a position comes from but cannot by itself be a reason others must accept', wrong: [['感受是最可靠的道德依據', 'Feelings are the most reliable moral ground'], ['感受與道德判斷完全無關', 'Feelings have nothing to do with moral judgement'], ['只要感受強烈即構成充分理由', 'A strong enough feeling is a sufficient reason']] },
  { q: '同一個人在相似個案中作出相反判斷而不作說明', a: '這違反一致性要求；若兩案相關特徵相同，判斷理應相同，否則須指出相關差異', aEn: 'This breaches consistency: like cases should be judged alike unless a relevant difference is identified', wrong: [['道德判斷本來就不必一致', 'Moral judgements need not be consistent'], ['這證明兩個個案毫無關係', 'It shows the two cases are unrelated'], ['只要動機良好即無問題', 'Good intentions settle the matter']] },
  { q: '「這條規則一向如此」作為維持規則的理由', a: '傳統說明了規則的來歷，但來歷不等於理由；仍須交代該規則現時服務甚麼目的', aEn: 'Tradition explains a rule’s origin, and an origin is not a justification; the purpose it now serves still needs stating', wrong: [['傳統本身即構成充分理由', 'Tradition is by itself a sufficient reason'], ['傳統與道德判斷無關', 'Tradition is irrelevant to moral judgement'], ['凡是傳統的規則都應廢除', 'Any traditional rule should be abolished']] },
  { q: '把對方的立場說成一個較易反駁的版本再加以反駁', a: '這是稻草人謬誤；反駁的對象必須是對方最強的版本，否則論證不成立', aEn: 'This is the straw-man fallacy: the version refuted must be the opponent’s strongest, or the argument fails', wrong: [['這是有效的歸謬法', 'This is a valid reductio'], ['只要反駁成功即論證成立', 'A successful refutation settles it either way'], ['這屬於訴諸權威', 'This is an appeal to authority']] },
  { q: '「若容許這一步，最終必然導致極端後果」而不說明中間環節', a: '這是滑坡論證；若無法指出每一步為何必然發生，該推論不成立', aEn: 'This is a slippery slope: without showing why each step must follow, the inference fails', wrong: [['這是合理的後果論分析', 'This is sound consequentialist analysis'], ['只要後果嚴重即值得接受', 'A severe enough outcome makes it acceptable'], ['這屬於循環論證', 'This is circular reasoning']] },
]
META.forEach((mt, mi) => {
  for (let k = 0; k < 13; k++) {
    const i = mi * 13 + k
    const rot = mt.wrong.map((_, j) => mt.wrong[(j + k) % mt.wrong.length])
    b.add(
      `er_mt_${mi}_${k}`,
      T.metaReason,
      FW.logic,
      diff(i),
      [
        `（第 ${k + 1} 組）就道德推理而言，「${mt.q}」這種做法的問題在哪裏？`,
        `(Set ${k + 1}) In moral reasoning, what is the problem with this move: ${mt.q}?`,
      ],
      [
        [mt.a, mt.aEn],
        [rot[0][0], rot[0][1]],
        [rot[1][0], rot[1][1]],
        [rot[2][0], rot[2][1]],
      ],
      [
        `後設反思考的不是「哪個立場對」，而是【這個推論本身站不站得住】。此處的問題是：${mt.a}。做這類題有一套通用的檢查：一、前提之中有沒有評價成分（沒有就推不出評價結論）；二、描述性陳述與規範性陳述有沒有混用；三、相似個案有沒有一致處理；四、反駁的是不是對方最強的版本。四項一過，論證的漏洞通常就現形，而且這套檢查對任何立場都同樣適用。`,
        `Metaethical work asks not which position is right but whether the reasoning holds. The problem here: ${mt.aEn}. A general checklist serves for this whole family: are any premises evaluative (without one, no evaluative conclusion follows); are descriptive and normative statements being mixed; are like cases treated alike; and is the version being refuted the opponent's strongest. Run those four and the gap usually shows — and the checklist applies equally whatever position you hold.`,
      ],
    )
  }
})

// ── 模板四：道德概念（定義辨析）────────────────────────────────────────
const CONCEPTS = [
  { c: '自主', cEn: 'Autonomy', d: '行動者按自己經過反思的意願作決定的能力與空間', dEn: 'the capacity and space to decide by one’s own reflectively held will', wrong: [['做任何自己想做的事而不受任何限制', 'doing whatever one wants with no limits at all'], ['依照他人的期望行事以維持和諧', 'acting on others’ expectations to preserve harmony'], ['由專家代為作出最有利的決定', 'having an expert decide what is best on one’s behalf']] },
  { c: '尊嚴', cEn: 'Dignity', d: '人不因其能力、貢獻或身分而被貶為工具的地位', dEn: 'a standing whereby a person is not reduced to an instrument on account of ability, contribution or status', wrong: [['一個人所享有的社會聲望', 'the social prestige a person enjoys'], ['一個人對自己外表的滿意程度', 'satisfaction with one’s own appearance'], ['按貢獻大小分配的敬意', 'respect apportioned to contribution']] },
  { c: '權利', cEn: 'A right', d: '一項可以向他人主張、並對應他人義務的資格', dEn: 'an entitlement one can claim against others, correlating with their duties', wrong: [['任何人希望得到的東西', 'anything a person would like to have'], ['由多數人投票決定的優待', 'a privilege settled by majority vote'], ['只在法律明文寫出時才存在的許可', 'a permission that exists only where a statute says so']] },
  { c: '責任', cEn: 'Responsibility', d: '因行動者的能力、角色或因果貢獻而應承擔的問責', dEn: 'accountability arising from an agent’s capacity, role or causal contribution', wrong: [['事後被指責的可能性', 'the likelihood of being blamed afterwards'], ['一個人自願承擔的額外工作', 'extra work a person volunteers for'], ['只有法律指明時才存在的負擔', 'a burden that exists only where the law specifies']] },
  { c: '公正', cEn: 'Justice', d: '按相關理由給予各人應得者，相同情況相同對待', dEn: 'giving each their due on relevant grounds, and treating like cases alike', wrong: [['人人所得完全相同', 'everyone receiving exactly the same'], ['由最多人支持的分配方式', 'whatever distribution most people favour'], ['按各人的意願分配', 'distribution according to what each prefers']] },
  { c: '良心', cEn: 'Conscience', d: '個人對自身行為作道德判斷的內在能力，可以被教育亦可能出錯', dEn: 'the inner capacity to judge one’s own conduct morally — educable, and fallible', wrong: [['一種不可能出錯的直覺', 'an intuition that cannot be mistaken'], ['社會規範在個人身上的複製', 'a mere copy of social norms in the individual'], ['對違規被發現的恐懼', 'fear of being found out']] },
  { c: '寬容', cEn: 'Toleration', d: '在不認同某種做法的同時，仍克制不加以壓制', dEn: 'refraining from suppression while still disapproving of the practice', wrong: [['對所有做法一律表示認同', 'approving of every practice alike'], ['對任何做法都不作判斷', 'withholding all judgement'], ['因為對該議題毫不在意', 'simply not caring about the issue']] },
  { c: '共善', cEn: 'The common good', d: '成員藉共同生活而得以實現、且不能各自單獨取得的好處', dEn: 'goods realised through shared life that members cannot secure separately', wrong: [['多數人利益的總和', 'the sum of the majority’s interests'], ['政府所定的政策目標', 'whatever goals the government sets'], ['各人私利的平均值', 'the average of individual interests']] },
]
CONCEPTS.forEach((cp, ci) => {
  for (let k = 0; k < 11; k++) {
    const i = ci * 11 + k
    const rot = cp.wrong.map((_, j) => cp.wrong[(j + k) % cp.wrong.length])
    b.add(
      `er_cp_${ci}_${k}`,
      T.concepts,
      FW.logic,
      diff(i),
      [
        `（第 ${k + 1} 組）就道德哲學的用法而言，「${cp.c}」最準確的界定是甚麼？`,
        `(Set ${k + 1}) In moral philosophy, how is "${cp.cEn}" most accurately defined?`,
      ],
      [
        [cp.d, cp.dEn],
        [rot[0][0], rot[0][1]],
        [rot[1][0], rot[1][1]],
        [rot[2][0], rot[2][1]],
      ],
      [
        `道德概念在日常用語與哲學用語之間往往有落差，而失分多數就在這個落差上。「${cp.c}」在本科的界定是：${cp.d}。三個誘答並非胡亂寫成，它們正是日常語感中最容易滑過去的版本 —— 把自主讀成「想做甚麼就做甚麼」、把尊嚴讀成聲望、把權利讀成願望、把良心讀成不會錯的直覺。作答前先把概念的界定寫出來，往後整段論證都會穩：界定一鬆，結論怎樣寫都站不住。`,
        `Moral terms drift between everyday and philosophical use, and that gap is where marks are lost. Here "${cp.cEn}" means: ${cp.dEn}. The distractors are not arbitrary; each is the everyday reading that slips past unnoticed — autonomy as doing whatever one likes, dignity as prestige, a right as a wish, conscience as an infallible intuition. Set out the definition before you argue: once the definition is loose, no conclusion built on it will hold.`,
      ],
    )
  }
})

// ── 模板五：應用倫理（條件推論，永不要求表態）──────────────────────────
const ISSUES = [
  { z: '資源分配', e: 'resource allocation' },
  { z: '保密與披露', e: 'confidentiality and disclosure' },
  { z: '承諾與例外', e: 'promises and exceptions' },
  { z: '個人自由與公共安全', e: 'individual liberty and public safety' },
  { z: '代際責任', e: 'responsibility to future generations' },
  { z: '照顧者的負擔', e: 'the burden borne by carers' },
  { z: '資訊的準確與傳播', e: 'accuracy and circulation of information' },
]
ISSUES.forEach((is, ii) => {
  THEORIES.forEach((th, ti) => {
    for (let k = 0; k < 3; k++) {
      const i = ii * 12 + ti * 3 + k
      b.add(
        `er_ap_${ii}_${ti}_${k}`,
        T.applied,
        FW.apply,
        diff(i),
        [
          `（第 ${k + 1} 組・條件推論）就「${is.z}」這一類議題，若採用${th.t}，論證的第一步應該是甚麼？`,
          `(Set ${k + 1}) On issues of ${is.e}, if ${th.tEn} is adopted, what is the first step of the argument?`,
        ],
        [
          [`確定該理論的判準（${th.crit}），再把個案的相關事實對進去`, `Fix the theory’s criterion (${th.critEn}), then fit the relevant facts of the case to it`],
          ['先確定自己的立場，再挑選支持該立場的理由', 'Fix one’s own position first, then select reasons that support it'],
          ['先統計哪一種看法的支持者較多', 'First count which view has more supporters'],
          ['先指出持相反意見者的動機不純', 'First impugn the motives of those who disagree'],
        ],
        [
          `應用倫理不是問「你覺得對不對」，而是問「按這一套判準，會推出甚麼」。題幹已經指定${th.t}，所以第一步必然是把它的判準寫明 —— ${th.crit} —— 再把個案事實對進去。三個誤答分別是三種常見的失分寫法：先有結論再找理由（那不是論證，是修辭）、以人數代替理由（多數與正確是兩回事），以及攻擊對方動機而非其論點。留意本題不要求你贊成${th.t}：本科考的是能否一致地運用一套判準，而不是你持哪個立場。`,
          `Applied ethics does not ask what you feel; it asks what follows on a stated criterion. The stem fixes ${th.tEn}, so the first move is to state its criterion — ${th.critEn} — and then fit the facts to it. The distractors are three familiar ways to lose marks: settling the conclusion first and recruiting reasons afterwards (rhetoric, not argument), counting heads instead of giving reasons, and attacking motives rather than claims. Note that you are not asked to endorse ${th.tEn}: what is assessed is consistent application of a criterion, not which side you take.`,
        ],
      )
    }
  })
})

// ── 模板六：基督宗教（只述該傳統自身教義，不作裁決）──────────────────────
const CHRIST = [
  { q: '「愛人如己」在雙重誡命中的位置', a: '與愛神並列為誡命的總綱，兩者被表述為不可分割', aEn: 'It stands alongside love of God as the summary of the commandments, the two presented as inseparable', wrong: [['是十誡以外一條次要的補充', 'a minor addition outside the Decalogue'], ['僅適用於信仰群體內部', 'applying only within the community of faith'], ['是後世神學家提出而非源自經文', 'a later theological proposal rather than scriptural']] },
  { q: '「恩典」一詞在該傳統中的基本含意', a: '指並非因人的功績而賜予的恩惠，重點在於施予者的主動', aEn: 'a favour given apart from merit, the emphasis falling on the giver’s initiative', wrong: [['按人的善行按比例賜予的報酬', 'a reward proportioned to good works'], ['人透過修行自行達致的境界', 'a state one attains through one’s own practice'], ['只在特定節期才生效的赦免', 'a remission effective only in certain seasons']] },
  { q: '「盟約」概念的結構', a: '指立約雙方的關係與相應承諾，而非單方面的規條', aEn: 'a relationship between two parties with corresponding commitments, not a one-sided set of rules', wrong: [['單方面頒布而不涉關係的法律', 'a law promulgated unilaterally with no relational element'], ['一份可隨時由任一方撤銷的協議', 'an agreement either side may revoke at will'], ['只涉及物質祝福的交易', 'a transaction concerning material blessing only']] },
  { q: '「悔改」在該傳統中的意思', a: '指心思與方向的轉變，並不止於為過失感到難過', aEn: 'a turning of mind and direction, not merely feeling sorry for a fault', wrong: [['僅指公開承認過錯的行為', 'the public admission of a fault alone'], ['指按規定次數重複的儀式', 'a rite repeated a prescribed number of times'], ['指以善行抵銷過失', 'offsetting a fault by good deeds']] },
  { q: '「金律」的表述形式', a: '以你願意別人怎樣待你的方式待人，是一條可以互換立場檢驗的原則', aEn: 'treat others as you would wish to be treated — a principle testable by exchanging positions', wrong: [['只要不主動傷害他人即為已足', 'refraining from harm is by itself enough'], ['按對方的身分決定對待的方式', 'treating people according to their status'], ['以對方待你的方式回報對方', 'returning the treatment one receives']] },
  { q: '「憐憫」與「公義」在該傳統中的關係', a: '兩者被表述為並行而非互相取消，經文多處要求同時持守', aEn: 'presented as held together rather than cancelling one another, with texts requiring both', wrong: [['憐憫必然取代公義', 'mercy necessarily supersedes justice'], ['公義只適用於群體之外的人', 'justice applies only to outsiders'], ['兩者屬於不同時代的教導', 'the two belong to different eras of teaching']] },
]
CHRIST.forEach((cq, ci) => {
  for (let k = 0; k < 15; k++) {
    const i = ci * 15 + k
    const rot = cq.wrong.map((_, j) => cq.wrong[(j + k) % cq.wrong.length])
    b.add(
      `er_ch_${ci}_${k}`,
      T.christianity,
      FW.apply,
      diff(i),
      [
        `（第 ${k + 1} 組）根據該傳統自身的教義，${cq.q}應如何理解？`,
        `(Set ${k + 1}) According to the tradition’s own teaching, how is ${cq.q} to be understood?`,
      ],
      [
        [cq.a, cq.aEn],
        [rot[0][0], rot[0][1]],
        [rot[1][0], rot[1][1]],
        [rot[2][0], rot[2][1]],
      ],
      [
        `本題問的是【該傳統自己怎樣說】，屬描述而非評價 —— 本科不會、也不應該用一條選擇題去裁決任何宗教主張的真假。正確的理解是：${cq.a}。三個誘答多數不是憑空捏造，而是把該概念換成了另一套邏輯（例如把恩典換成按功勞計算的報酬、把盟約換成單方面的法令）。溫習宗教科的有效方法，正是逐個概念問「若換成另一套邏輯，這個傳統會失去甚麼」—— 答得出，就代表真正掌握了該概念的位置。`,
        `The question asks what the tradition itself teaches: this is description, not evaluation — no multiple-choice item should adjudicate the truth of a religious claim, and this subject does not attempt it. The correct account: ${cq.aEn}. The distractors are rarely inventions; each substitutes a different logic for the concept (grace as merited reward, covenant as unilateral decree). A good revision habit is to ask, concept by concept, what the tradition would lose under the substituted logic — answering that shows you have located the concept, not merely memorised a phrase.`,
      ],
    )
  }
})

// ── 模板七：佛教（只述該傳統自身教義）──────────────────────────────────
const BUDDH = [
  { q: '「四聖諦」的結構', a: '苦、集、滅、道四者構成「問題—成因—止息—方法」的完整次序', aEn: 'suffering, its arising, its cessation and the path form a complete sequence: problem, cause, ending, method', wrong: [['四者為四種互不相關的教導', 'four unrelated teachings'], ['四者按修行者的喜好選擇其一', 'four options from which one is chosen by preference'], ['四者只描述苦而不涉及方法', 'four descriptions of suffering with no method']] },
  { q: '「無常」的含意', a: '指一切有為法處於生滅變化之中，並非指世界不真實', aEn: 'all conditioned things arise and pass; it does not mean the world is unreal', wrong: [['指世界完全不存在', 'that the world does not exist at all'], ['指命運不可預測故無須努力', 'that fate is unpredictable so effort is pointless'], ['指人生必然痛苦而無可改變', 'that life is necessarily painful and unchangeable']] },
  { q: '「無我」的含意', a: '指找不到一個恆常不變、獨立自存的自我，並非否定有經驗與行為的主體', aEn: 'no permanent, independently existing self is found; it does not deny a subject of experience and action', wrong: [['指人沒有任何行為責任', 'that no one bears responsibility for action'], ['指個人的感受並不真實', 'that personal experience is not real'], ['指應當放棄一切人際關係', 'that all relationships should be abandoned']] },
  { q: '「緣起」的基本表述', a: '此有故彼有，此生故彼生 —— 事物依條件而生，非獨立自成', aEn: 'when this exists, that comes to be — things arise dependent on conditions rather than of themselves', wrong: [['一切由單一原因決定', 'everything is fixed by a single cause'], ['事物之間並無任何關聯', 'things bear no relation to one another'], ['條件一經確立即不可改變', 'conditions once set cannot change']] },
  { q: '「業」的意思', a: '指有意的行為及其後續影響，重點在於意志而非單純的動作', aEn: 'intentional action and its consequences, with the emphasis on volition rather than the bare deed', wrong: [['指與行為無關的命定', 'a fate unconnected with action'], ['指他人施加於己的遭遇', 'what others inflict upon one'], ['指只在來世才生效的獎懲', 'reward and punishment effective only in a future life']] },
  { q: '「中道」的意思', a: '避開放縱與極端苦行兩邊的修行取向，並非折衷或妥協的同義詞', aEn: 'a way avoiding both indulgence and extreme austerity; not a synonym for compromise', wrong: [['凡事取兩者的平均', 'taking the average of any two positions'], ['對任何主張都不表態', 'declining to take any position'], ['同時接受互相矛盾的說法', 'accepting contradictory claims at once']] },
]
BUDDH.forEach((bq, bi) => {
  for (let k = 0; k < 15; k++) {
    const i = bi * 15 + k
    const rot = bq.wrong.map((_, j) => bq.wrong[(j + k) % bq.wrong.length])
    b.add(
      `er_bd_${bi}_${k}`,
      T.buddhism,
      FW.apply,
      diff(i),
      [
        `（第 ${k + 1} 組）根據該傳統自身的教義，${bq.q}應如何理解？`,
        `(Set ${k + 1}) According to the tradition’s own teaching, how is ${bq.q} to be understood?`,
      ],
      [
        [bq.a, bq.aEn],
        [rot[0][0], rot[0][1]],
        [rot[1][0], rot[1][1]],
        [rot[2][0], rot[2][1]],
      ],
      [
        `本題問的是【該傳統自己怎樣說】，屬描述而非評價。正確的理解是：${bq.a}。本科最常見的誤讀，是把這些概念讀成消極或虛無 —— 把無常讀成「世界不真實」、把無我讀成「沒有責任」、把中道讀成「凡事取中間」。三個誘答正是照這些誤讀寫的。分辨方法：問這個概念在該傳統的整體架構中【承擔甚麼功能】；若某個讀法會令整套教理失去着力點，那個讀法多數就是誤讀。`,
        `The question asks what the tradition itself teaches — description, not evaluation. The correct account: ${bq.aEn}. The commonest misreading in this subject turns these concepts nihilistic: impermanence as "the world is unreal", non-self as "no one is responsible", the middle way as "always split the difference". The distractors are written from exactly those misreadings. The test is to ask what work the concept does within the tradition's whole structure; a reading that leaves the rest of the teaching without purchase is almost certainly the wrong one.`,
      ],
    )
  }
})

// ── 模板八：宗教哲學（論證結構，不裁決結論）────────────────────────────
const RELPHIL = [
  { arg: '設計論證', argEn: 'the design argument', form: '由自然界中的秩序推出存在一位安排者', formEn: 'infers an orderer from the order observed in nature', chal: '其關鍵爭點在於：秩序是否必須由有意識的安排產生', chalEn: 'the crux is whether order must issue from conscious arrangement' },
  { arg: '宇宙論證', argEn: 'the cosmological argument', form: '由事物皆有原因推出必有一個不依賴他者的起點', formEn: 'infers from the causedness of things a starting point that depends on nothing else', chal: '其關鍵爭點在於：因果鏈是否必須有起點，以及該起點是否須具位格', chalEn: 'the crux is whether a causal chain needs a first term, and whether that term must be personal' },
  { arg: '惡的難題', argEn: 'the problem of evil', form: '指出「全善全能」與「世上有惡」三者難以同時成立', formEn: 'presses the difficulty of holding omnibenevolence, omnipotence and the existence of evil together' , chal: '其關鍵爭點在於：是否存在一種理由能使容許惡與全善相容', chalEn: 'the crux is whether any reason could make permitting evil compatible with perfect goodness' },
  { arg: '宗教經驗論證', argEn: 'the argument from religious experience', form: '由主體的經驗推出所經驗的對象存在', formEn: 'infers the existence of what is experienced from the subject’s experience of it', chal: '其關鍵爭點在於：私人經驗能否作為公共的證據', chalEn: 'the crux is whether private experience can serve as public evidence' },
  { arg: '道德論證', argEn: 'the moral argument', form: '由道德義務具客觀性推出其來源不在人類約定之內', formEn: 'infers from the objectivity of moral obligation a source outside human convention' , chal: '其關鍵爭點在於：道德的客觀性是否需要人類以外的來源', chalEn: 'the crux is whether moral objectivity requires a source beyond the human' },
  { arg: '信仰與理性的關係', argEn: 'the relation of faith and reason', form: '處理信仰主張能否、以及在何種意義下接受理性檢視', formEn: 'concerns whether and in what sense claims of faith are open to rational scrutiny', chal: '其關鍵爭點在於：兩者是互相排斥、互不相干，還是可以互補', chalEn: 'the crux is whether the two exclude, ignore or complement one another' },
]
RELPHIL.forEach((rp, ri) => {
  for (let k = 0; k < 15; k++) {
    const i = ri * 15 + k
    b.add(
      `er_rp_${ri}_${k}`,
      T.relPhil,
      FW.logic,
      diff(i),
      [
        `（第 ${k + 1} 組）就宗教哲學的討論而言，「${rp.arg}」的論證結構是甚麼？`,
        `(Set ${k + 1}) In philosophy of religion, what is the structure of ${rp.argEn}?`,
      ],
      [
        [`${rp.form}；${rp.chal}`, `It ${rp.formEn}; ${rp.chalEn}`],
        ['該論證已被證明成立，故不再有爭議', 'The argument has been proved and is no longer contested'],
        ['該論證已被證明不成立，故不再有討論價值', 'The argument has been refuted and no longer merits discussion'],
        ['該論證只是個人信念的表達，不具論證形式', 'It is merely an expression of personal belief with no argumentative form'],
      ],
      [
        `宗教哲學考的是【論證的結構與爭點】，不是替學生決定結論。「${rp.arg}」${rp.form}，而${rp.chal}。三個誤答的共通毛病，是把一個仍在進行的哲學討論說成已經有定論 —— 無論宣稱它已被證明成立還是已被推翻，都同樣越過了本科的範圍；第三個則否認它具論證形式，而事實上它有明確的前提與結論。作答時應該做的是：把前提列出、指出結論如何由前提推出、再說明爭點落在哪一個前提上。`,
        `Philosophy of religion assesses the structure of an argument and where it is contested, not which conclusion the student should hold. ${rp.argEn} ${rp.formEn}, and ${rp.chalEn}. What the distractors share is the claim that a live philosophical debate has been settled — asserting proof or refutation oversteps equally — while the third denies the argument any form at all, though its premises and conclusion are perfectly explicit. Set out the premises, show how the conclusion is drawn, and name the premise where the dispute sits.`,
      ],
    )
  }
})

// ── 模板九：宗教倫理（結構上與世俗規範理論的異同）──────────────────────
const RELETH = [
  { q: '宗教倫理與義務論在結構上的共通處', a: '兩者都以規則或誡命作為判準，重心落在行為所依據的規範上', aEn: 'both anchor judgement in rules or commands, with the weight falling on the norm the act follows', wrong: [['兩者都只看行為的後果', 'both look only to consequences'], ['兩者都只看行為者的品格', 'both look only to the agent’s character'], ['兩者在結構上沒有任何共通處', 'they share no structural feature at all']] },
  { q: '「神命論」的基本主張', a: '道德義務的根據在於神的命令，其經典難題是：善之為善，是因為被命令，還是被命令因為它是善', aEn: 'moral obligation rests on divine command; its classic difficulty is whether an act is good because commanded, or commanded because good', wrong: [['道德義務完全由社會共識決定', 'obligation is settled wholly by social consensus'], ['道德義務由行為的後果決定', 'obligation is settled by consequences'], ['宗教傳統中不存在任何倫理主張', 'religious traditions make no ethical claims']] },
  { q: '宗教倫理中德性進路的特點', a: '重心在於培養特定品格與生活方式，而非逐項規則的遵守', aEn: 'the emphasis falls on forming character and a way of life rather than on rule-by-rule compliance', wrong: [['以計算後果總量為唯一方法', 'calculating aggregate consequences is the sole method'], ['要求信眾放棄一切判斷', 'adherents are to abandon all judgement'], ['與世俗德性倫理學毫無可比之處', 'it bears no comparison with secular virtue ethics']] },
  { q: '在多元社會中援引宗教理由參與公共討論', a: '可以提出，但在公共論證中通常需要同時給出他人也能評估的理由', aEn: 'they may be offered, though public argument usually also requires reasons others can assess', wrong: [['宗教理由在公共討論中完全不可提出', 'religious reasons may never be raised in public discussion'], ['宗教理由本身即足以結束討論', 'a religious reason by itself ends the discussion'], ['只有宗教理由才具有道德分量', 'only religious reasons carry moral weight']] },
  { q: '宗教傳統之間倫理主張的關係', a: '在具體規範上可以分歧，在若干基本關懷（如不可任意傷害）上則常見交疊', aEn: 'they may diverge on specific norms while overlapping on some basic concerns, such as not harming arbitrarily', wrong: [['各傳統的倫理主張完全相同', 'their ethical claims are identical'], ['各傳統之間毫無任何交疊', 'they overlap in nothing at all'], ['分歧證明其中必有一方不誠實', 'divergence proves one side is dishonest']] },
  { q: '「良心」在宗教倫理中的位置', a: '被視為需要受教育與檢視的能力，而非可以豁免一切檢查的最終權威', aEn: 'treated as a capacity to be formed and examined, not a final authority exempt from scrutiny', wrong: [['被視為絕對不可能出錯', 'held to be incapable of error'], ['被視為與宗教教導完全無關', 'held to be unrelated to religious teaching'], ['被視為僅指對懲罰的恐懼', 'held to be no more than fear of punishment']] },
]
RELETH.forEach((re, ri) => {
  for (let k = 0; k < 15; k++) {
    const i = ri * 15 + k
    const rot = re.wrong.map((_, j) => re.wrong[(j + k) % re.wrong.length])
    b.add(
      `er_re_${ri}_${k}`,
      T.relEthics,
      FW.logic,
      diff(i),
      [
        `（第 ${k + 1} 組）就宗教倫理的討論而言，${re.q}應如何理解？`,
        `(Set ${k + 1}) In religious ethics, how is ${re.q} to be understood?`,
      ],
      [
        [re.a, re.aEn],
        [rot[0][0], rot[0][1]],
        [rot[1][0], rot[1][1]],
        [rot[2][0], rot[2][1]],
      ],
      [
        `宗教倫理放在本科，考的是【它與各套規範理論在結構上的異同】，而不是它是否正確。此處：${re.a}。把宗教倫理與世俗理論並置討論時，最有用的做法是照樣問那條老問題 —— 判準落在後果、規則，還是品格？答得出，兩邊就可以在同一個平面上比較，而不必先判定誰對誰錯。三個誘答的共通毛病，是把可比較的差異說成完全對立或完全相同。`,
        `Religious ethics is assessed here for how it compares structurally with the normative theories, not for whether it is correct. Here: ${re.aEn}. When setting religious and secular ethics side by side, the most useful move is the same old question — does the criterion sit in consequences, rules or character? Answer it and the two can be compared on one plane without first ruling on which is right. What the distractors share is turning a comparable difference into either flat opposition or flat identity.`,
      ],
    )
  }
})

// ── 模板十：宗教與社會（研究方法，描述而非評價）────────────────────────
const RELSOC = [
  { q: '研究一個宗教群體的實踐時，訪談與經典文本的關係', a: '文本說明該傳統應當如何，訪談說明成員實際如何；兩者都需要，且可能不一致', aEn: 'texts state what the tradition prescribes and interviews what members actually do; both are needed and they may diverge', wrong: [['只需查閱經典即可掌握實踐', 'consulting the texts alone suffices'], ['只需訪談成員即可掌握教義', 'interviewing members alone suffices for doctrine'], ['兩者若不一致必有一方說謊', 'any divergence means one side is lying']] },
  { q: '以問卷統計某個宗教群體的信念', a: '得出的是自我報告的分佈，未必等同實際信念或實踐', aEn: 'what results is a distribution of self-reports, which need not match actual belief or practice', wrong: [['問卷結果即等同該群體的教義', 'survey results are the group’s doctrine'], ['問卷結果不具任何研究價值', 'survey results have no research value'], ['樣本愈大結論愈必然正確', 'a larger sample makes the conclusion necessarily correct']] },
  { q: '描述一個宗教群體時使用該群體自己的用語', a: '有助準確呈現其自我理解，但研究者仍須另行說明這些用語的含意', aEn: 'it helps present their self-understanding accurately, but the researcher must still explain what the terms mean', wrong: [['等同接受該群體的全部主張', 'it amounts to accepting all their claims'], ['會令研究失去客觀性故應避免', 'it destroys objectivity and should be avoided'], ['只適用於研究者本身所屬的傳統', 'it applies only to the researcher’s own tradition']] },
  { q: '比較兩個宗教傳統的社會角色', a: '須先說明比較的面向（例如組織方式、與教育的關係），否則比較無從落實', aEn: 'the dimension of comparison must be stated first — organisation, relation to education — or the comparison has no purchase', wrong: [['直接比較兩者的信徒人數即可', 'comparing adherent numbers is enough'], ['兩者不可比較故不應並列', 'they are incomparable and should not be juxtaposed'], ['應以其中一方為標準衡量另一方', 'one should serve as the standard for the other']] },
  { q: '在社會研究中處理研究者自身的立場', a: '應明確交代自身位置與可能的影響，而不是聲稱完全沒有立場', aEn: 'state one’s position and its likely influence rather than claiming to have none', wrong: [['研究者必須完全沒有任何立場', 'a researcher must have no position at all'], ['研究者的立場無須交代', 'the researcher’s position need not be disclosed'], ['有立場即代表研究無效', 'having a position invalidates the research']] },
  { q: '宗教群體在社會中的多重角色', a: '同一群體可以同時承擔信仰、教育、福利等不同功能，描述時應分別處理', aEn: 'one group may carry religious, educational and welfare functions at once, and these should be described separately', wrong: [['宗教群體只承擔信仰功能', 'religious groups carry a religious function only'], ['多重角色代表該群體立場矛盾', 'multiple roles indicate a contradictory stance'], ['社會功能與信仰內容完全無關', 'social function is unrelated to religious content']] },
]
RELSOC.forEach((rs, ri) => {
  for (let k = 0; k < 15; k++) {
    const i = ri * 15 + k
    const rot = rs.wrong.map((_, j) => rs.wrong[(j + k) % rs.wrong.length])
    b.add(
      `er_rs_${ri}_${k}`,
      T.relSoc,
      FW.apply,
      diff(i),
      [
        `（第 ${k + 1} 組・研究方法）${rs.q}，恰當的處理是甚麼？`,
        `(Set ${k + 1}) On method: ${rs.q} — what is the sound approach?`,
      ],
      [
        [rs.a, rs.aEn],
        [rot[0][0], rot[0][1]],
        [rot[1][0], rot[1][1]],
        [rot[2][0], rot[2][1]],
      ],
      [
        `研究宗教與社會，第一步是分清【規範】與【實況】：經典說的是應當如何，田野看到的是實際如何，兩者不一致並不代表有人說謊，而往往正是最值得研究的地方。此處恰當的處理是：${rs.a}。三個誤答分別是：以單一來源代替多重來源、把方法上的限制誇大成「不可研究」，以及以其中一方為標準去衡量另一方。要留意本科要求的是準確描述，不是評定高下。`,
        `Studying religion and society begins by separating the normative from the actual: texts say what ought to be, fieldwork shows what is, and a divergence between them is usually the most interesting finding rather than evidence that someone is lying. The sound approach here: ${rs.aEn}. The distractors respectively substitute one source for many, inflate a methodological limit into "cannot be studied", and make one tradition the yardstick for another. What is assessed is accurate description, not ranking.`,
      ],
    )
  }
})

export const ethicsReligiousBank1Questions: Question[] = b.bank
export const ethicsReligiousBank1Drops = b.drops
