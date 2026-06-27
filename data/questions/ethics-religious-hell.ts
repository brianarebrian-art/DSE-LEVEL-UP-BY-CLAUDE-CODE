import type { Question, Topic } from './types'
import { makeQ, topicList, type Pair, type TopicMeta, type FwMeta } from './_builder'

// ════════════════════════════════════════════════════════════════════════════
// 倫理與宗教 Ethics & Religious Studies "hell" set (genuine 5★★). Tests precise
// APPLICATION of normative theories (consequentialism / deontology / virtue ethics)
// to cases, and the is–ought distinction. Presented neutrally: the questions test
// the LOGIC of each theory, not which moral view is "right". Distractors swap the
// theories' defining criteria. All hard.
// ════════════════════════════════════════════════════════════════════════════

const q = makeQ('ethics-religious')
const opt = (zh: string, en: string): Pair => [zh, en]
const C = (zh: string, en: string): Pair => [zh, en]

const T = {
  theory: { id: 'eth_theory_apply', zh: '規範倫理・理論應用', en: 'Normative theory — application' },
  meta:   { id: 'eth_meta_reason',  zh: '道德推理・後設反思', en: 'Moral reasoning — reflection' },
} satisfies Record<string, TopicMeta>

const FW = {
  normative: { id: 'normative', zh: '規範倫理', en: 'Normative Ethics', emoji: '⚖️' },
  concept:   { id: 'concept',   zh: '道德反思', en: 'Moral Reflection', emoji: '🧭' },
} satisfies Record<string, FwMeta>

let uid = 0
const id = (p: string) => `ethh_${p}_${++uid}`

const theory: Question[] = [
  q(id('th'), T.theory, FW.normative, 'hard', 2024, 3,
    C('一名「結果論者／效益主義者」(consequentialist / utilitarian) 判斷一個行為是否道德上正確，最根本的依據是？',
      'A consequentialist / utilitarian judges whether an act is morally right fundamentally by?'),
    [opt('該行為所帶來的整體結果——能否為最多受影響者帶來最大的福祉（或最小的痛苦）',
        'the overall consequences it produces — whether it brings the greatest well-being (or least suffering) to those affected'),
      opt('該行為是否符合一條無論後果如何都必須遵守的道德義務',
        'whether it conforms to a moral duty that must be kept regardless of consequences'),
      opt('行為者是否擁有良好的品格與德性',
        'whether the agent has good character and virtue'),
      opt('該行為是否獲得多數人即時的情緒認同',
        'whether most people instantly feel emotionally approving of it')],
    C('結果論的判準在於「結果」：效益主義主張正確的行為是能極大化整體福祉者。注意它看的是實際後果，而非義務、品格或一時情緒。\n\n【陷阱】「無論後果都要守的義務」是義務論(deontology)；「品格德性」是德性倫理(virtue ethics)；「多數人即時情緒」混淆了道德與情緒贊同，並非效益主義的計算。',
      'Consequentialism judges by outcomes: utilitarianism holds the right act is the one that maximises overall well-being. It looks to actual consequences, not duty, character or momentary feeling.\n\n【Trap】 “A duty to keep regardless of consequences” is deontology; “character and virtue” is virtue ethics; “most people’s instant feeling” confuses morality with emotional approval, not the utilitarian calculation.')),

  q(id('th'), T.theory, FW.normative, 'hard', 2023, 3,
    C('一名嚴格的「義務論者」(deontologist，如康德式立場) 面對「是否可以說謊以帶來好結果」這一處境，最可能的立場是？',
      'A strict deontologist (e.g. a Kantian) facing “may one lie to bring about a good outcome?” would most likely hold that?'),
    [opt('說謊本身違反道德義務，即使能帶來好結果也不應為之——行為的對錯不取決於後果',
        'lying itself violates a moral duty and should not be done even for a good outcome — the rightness of an act does not depend on its consequences'),
      opt('只要說謊能帶來較大的整體利益，就應該說謊',
        'one should lie whenever it produces a greater overall benefit'),
      opt('應視乎說謊者當時是否心情良好',
        'it depends on whether the liar is in a good mood at the time'),
      opt('說謊的對錯完全無法判斷',
        'the rightness of lying simply cannot be judged at all')],
    C('義務論主張某些行為（如說謊）本身違反道德義務，其對錯不取決於後果；康德更以「可普遍化的格律」與「把人當作目的而非僅手段」為據，故反對為好結果而說謊。\n\n【陷阱】「能帶來較大利益就應說謊」正是效益主義立場；「視乎心情」與義務論的原則性相違；「完全無法判斷」誤把義務論讀成道德虛無。',
      'Deontology holds that some acts (such as lying) violate a moral duty in themselves, and their rightness does not depend on consequences; Kant further appeals to a universalisable maxim and treating persons as ends, not merely means — so lying for a good outcome is rejected.\n\n【Trap】 “Lie whenever it brings greater benefit” is the utilitarian position; “depends on mood” contradicts deontology’s principled stance; “cannot be judged at all” misreads deontology as nihilism.')),

  q(id('th'), T.theory, FW.normative, 'hard', 2024, 3,
    C('「德性倫理學」(virtue ethics) 與結果論、義務論的根本分別在於，它最關注的是？',
      'Virtue ethics differs fundamentally from consequentialism and deontology in that it is most concerned with?'),
    [opt('行為者應成為怎樣的人——培養勇敢、誠實、節制等德性，由良好品格自然引導出恰當的行為',
        'what sort of person one should become — cultivating virtues such as courage, honesty and temperance, so that good character guides right action'),
      opt('每個行為能否極大化整體福祉',
        'whether each act maximises overall well-being'),
      opt('每個行為是否符合一條普遍的道德規則',
        'whether each act conforms to a universal moral rule'),
      opt('行為是否合乎法律規定',
        'whether the act complies with the law')],
    C('德性倫理把焦點由「行為」轉向「行為者」：關鍵不是某一行為的後果或是否合規則，而是培養良好品格（德性），使人自然而然地行事得宜。\n\n【陷阱】「極大化福祉」是結果論；「符合普遍規則」是義務論；「合乎法律」混淆了道德與法律，三者都不是德性倫理的核心。',
      'Virtue ethics shifts the focus from the act to the agent: the key is not the consequences of an act or its conformity to a rule, but cultivating good character (the virtues) so one acts well naturally.\n\n【Trap】 “Maximise well-being” is consequentialism; “conform to a universal rule” is deontology; “comply with the law” confuses morality with law — none is the core of virtue ethics.')),
]

const meta: Question[] = [
  q(id('me'), T.meta, FW.concept, 'hard', 2023, 3,
    C('有人說：「大多數人都這樣做，所以這樣做就是道德上對的。」從道德推理的角度，這個論證的主要謬誤是？',
      'Someone argues: “Most people do this, therefore doing it is morally right.” In moral reasoning, the main fallacy here is?'),
    [opt('由「事實上如何（is）」直接推出「道德上應該如何（ought）」——把普遍的「現況」當成道德「對錯」的證明（自然主義／訴諸群眾之失）',
        'inferring an “ought” straight from an “is” — treating what is commonly done as proof of what is morally right (an is–ought / appeal-to-the-majority error)'),
      opt('這個論證完全沒有謬誤，多數人認同就等於道德正確',
        'there is no fallacy: majority approval just is moral correctness'),
      opt('錯在它引用了具體的事實數據',
        'the error is that it cites concrete factual data'),
      opt('錯在它沒有引用任何宗教經典',
        'the error is that it does not cite any religious scripture')],
    C('「多數人這樣做」是一項事實陳述（is），但「應該這樣做／這樣做是對的」是規範判斷（ought）；由事實直接跳到價值，未提供道德理由，犯了「是–應」斷裂（兼訴諸群眾）的謬誤——歷史上不乏多數人接受卻不道德的做法。\n\n【陷阱】「沒有謬誤」正中陷阱；「錯在引用數據」「錯在沒引經典」皆未指出真正的推理斷裂。',
      '“Most people do this” is a factual claim (an is), but “one ought to / it is right” is a normative judgement (an ought); jumping from fact to value without a moral reason commits the is–ought gap (and appeal to the majority) — history is full of widely accepted practices that were not moral.\n\n【Trap】 “No fallacy” walks into the trap; “error is citing data” and “error is not citing scripture” both miss the real break in reasoning.')),

  q(id('me'), T.meta, FW.concept, 'hard', 2024, 3,
    C('在關於安樂死的討論中，「生命神聖」(sanctity of life) 與「個人自主」(autonomy) 兩種原則常被對舉。對這兩種原則最準確的理解是？',
      'In debates on euthanasia, “sanctity of life” and “autonomy” are often contrasted. The most accurate understanding of these two principles is that?'),
    [opt('「生命神聖」強調生命本身具不可侵犯的內在價值，傾向反對主動結束生命；「個人自主」強調人有權就自己的生命作決定——兩者代表不同的價值優先次序，討論須權衡而非簡單取一',
        '“sanctity of life” stresses the inviolable intrinsic value of life and tends to oppose actively ending it, while “autonomy” stresses a person’s right to decide about their own life — they represent different value priorities to be weighed, not a simple either/or'),
      opt('兩個原則意思完全相同，可以互相替代',
        'the two principles mean exactly the same thing and are interchangeable'),
      opt('「個人自主」必然是正確的，「生命神聖」必然是錯的',
        'autonomy is necessarily right and sanctity of life necessarily wrong'),
      opt('這類爭議沒有任何理性討論的空間',
        'such disputes leave no room for rational discussion at all')],
    C('高階的倫理反思要準確掌握對立原則各自的理據：「生命神聖」訴諸生命的內在不可侵犯性，「個人自主」訴諸自決權；二者體現不同的價值優先，恰當的討論在於說明理據並權衡，而非武斷地取消一方。\n\n【陷阱】「意思相同」抹去了張力；「自主必對、神聖必錯」是武斷選邊；「沒有理性空間」否定了倫理論證本身。',
      'Higher-order ethical reflection accurately grasps the rationale of each opposing principle: sanctity of life appeals to the inviolable intrinsic worth of life; autonomy appeals to self-determination. They embody different value priorities, and sound discussion sets out reasons and weighs them rather than abolishing one side.\n\n【Trap】 “Same meaning” erases the tension; “autonomy right, sanctity wrong” arbitrarily picks a side; “no room for reason” denies ethical argument itself.')),
]

export const ethicsReligiousHellQuestions: Question[] = [...theory, ...meta]

export const ethicsReligiousHellTopics: Topic[] = topicList([
  { topic: T.theory, fw: FW.normative, count: theory.length },
  { topic: T.meta,   fw: FW.concept,   count: meta.length },
])
