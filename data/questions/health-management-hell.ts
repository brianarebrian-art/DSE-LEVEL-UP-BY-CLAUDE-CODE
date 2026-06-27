import type { Question, Topic } from './types'
import { makeQ, topicList, type Pair, type TopicMeta, type FwMeta } from './_builder'

// ════════════════════════════════════════════════════════════════════════════
// Health Management & Social Care "hell" set (genuine 5★★). Tests precise framework
// application: the holistic (WHO) concept of health, the three levels of prevention,
// social determinants, and care ethics — applied to scenarios. Distractors collapse
// health to "no disease", misclassify prevention levels, or blame the individual.
// All hard.
// ════════════════════════════════════════════════════════════════════════════

const q = makeQ('health-management')
const opt = (zh: string, en: string): Pair => [zh, en]
const C = (zh: string, en: string): Pair => [zh, en]

const T = {
  concept: { id: 'hm_holistic_concept', zh: '整全健康・概念應用', en: 'Holistic health — application' },
  prevent: { id: 'hm_prevention_levels', zh: '三級預防分類', en: 'Levels of prevention' },
  ethics:  { id: 'hm_care_ethics_determinants', zh: '照顧倫理與健康決定因素', en: 'Care ethics & determinants' },
} satisfies Record<string, TopicMeta>

const FW = {
  concept:  { id: 'concept',  zh: '概念理解', en: 'Concepts', emoji: '📘' },
  apply:    { id: 'apply',    zh: '應用判斷', en: 'Application', emoji: '🛠️' },
  evaluate: { id: 'evaluate', zh: '分析評鑑', en: 'Analysis', emoji: '⚖️' },
} satisfies Record<string, FwMeta>

let uid = 0
const id = (p: string) => `hmh_${p}_${++uid}`

const concept: Question[] = [
  q(id('co'), T.concept, FW.concept, 'hard', 2024, 3,
    C('世界衞生組織（WHO）對「健康」的定義是身體、心理及社會三方面的完全安寧，而不僅是沒有疾病。一名長者身體檢查一切正常，但喪偶後長期獨居、與社會脫節、情緒低落。按整全健康觀，最準確的判斷是？',
      'The WHO defines health as complete physical, mental and social well-being, not merely the absence of disease. An elderly man is physically healthy on examination, but after losing his spouse he lives alone, is socially isolated and low in mood. On the holistic view of health, the most accurate judgement is that?'),
    [opt('他並非「健康」，因為其心理與社會層面的安寧已受損——健康不止於沒有疾病',
        'he is NOT “healthy”, because his mental and social well-being are impaired — health is more than the absence of disease'),
      opt('他完全健康，因為身體檢查沒有任何疾病',
        'he is fully healthy because the physical examination found no disease'),
      opt('情緒與社交問題與健康無關',
        'emotional and social problems are unrelated to health'),
      opt('只要將來患病才算不健康',
        'one is unhealthy only once a disease actually appears')],
    C('整全（holistic）健康觀涵蓋身、心、社三方面：此長者雖無生理疾病，但情緒低落（心理）與社會脫節（社會）已損及其安寧，故按 WHO 定義並非健康。這正是「健康 ≠ 沒有疾病」的關鍵。\n\n【陷阱】「身體無病即完全健康」把健康窄化為生理層面；「情緒社交與健康無關」「患病才算不健康」均否定了心理與社會維度。',
      'The holistic view spans physical, mental and social dimensions: though free of physical disease, his low mood (mental) and isolation (social) impair his well-being, so by the WHO definition he is not healthy. This is the crux of “health ≠ absence of disease.”\n\n【Trap】 “No physical disease = fully healthy” narrows health to the physical; “emotions/social unrelated to health” and “unhealthy only once ill” deny the mental and social dimensions.')),

  q(id('co'), T.concept, FW.apply, 'hard', 2023, 3,
    C('在一個照顧計劃中，社工除了安排長者覆診（身體），還組織興趣小組讓他結識朋友、重建社交網絡。後者主要照顧了長者健康的哪一個維度？',
      'In a care plan, besides arranging medical follow-up (physical), a social worker organises interest groups so an elderly person makes friends and rebuilds a social network. The latter mainly addresses which dimension of health?'),
    [opt('社會（社交）維度——透過人際連結與社會參與，提升社會安寧',
        'the social dimension — boosting social well-being through connection and participation'),
      opt('純粹的身體維度',
        'purely the physical dimension'),
      opt('與健康完全無關的休閒活動',
        'leisure that has nothing to do with health'),
      opt('只屬經濟層面的安排',
        'a purely economic arrangement')],
    C('興趣小組重建人際連結與社會參與，針對的是「社會維度」的健康；整全照顧要求兼顧身、心、社（甚至靈性）各方面，而非只處理疾病。\n\n【陷阱】「純身體」「與健康無關」「只屬經濟」都看漏了社交參與對健康社會維度的作用。',
      'Interest groups rebuild connection and participation, addressing the social dimension of health; holistic care attends to physical, mental and social (even spiritual) needs, not just disease.\n\n【Trap】 “Purely physical”, “unrelated to health” and “purely economic” all miss the role of social participation in the social dimension of health.')),
]

const prevent: Question[] = [
  q(id('pv'), T.prevent, FW.apply, 'hard', 2024, 3,
    C('公共衞生把預防分為三級：一級（疾病發生前的預防）、二級（早期偵測與治療）、三級（減低已患病者的併發與失能）。下列哪一組「措施—級別」配對完全正確？',
      'Public health distinguishes three levels of prevention: primary (before disease occurs), secondary (early detection and treatment), tertiary (limiting complications and disability in those already ill). Which pairing of measure-to-level is entirely correct?'),
    [opt('注射疫苗／健康教育＝一級；癌症篩查＝二級；中風後的復康治療＝三級',
        'vaccination / health education = primary; cancer screening = secondary; post-stroke rehabilitation = tertiary'),
      opt('癌症篩查＝一級；注射疫苗＝二級；健康教育＝三級',
        'cancer screening = primary; vaccination = secondary; health education = tertiary'),
      opt('復康治療＝一級；疫苗＝三級；篩查＝三級',
        'rehabilitation = primary; vaccination = tertiary; screening = tertiary'),
      opt('三者全部屬於一級預防',
        'all three are primary prevention')],
    C('一級預防在「疾病發生前」阻止其出現（疫苗、健康教育）；二級在「早期」偵測並治療（篩查）；三級在「已患病後」減少併發與失能（復康）。故正確配對為疫苗／教育＝一級、篩查＝二級、復康＝三級。\n\n【陷阱】其餘各項把篩查、疫苗、復康的級別對調或一概歸入一級，皆混淆了「病前／早期／病後」這條時間軸。',
      'Primary prevention stops disease before it occurs (vaccines, health education); secondary detects and treats it early (screening); tertiary limits complications and disability after disease (rehabilitation). So vaccine/education = primary, screening = secondary, rehab = tertiary.\n\n【Trap】 The others swap or lump the levels, confusing the before/early/after timeline.')),
]

const ethics: Question[] = [
  q(id('et'), T.ethics, FW.evaluate, 'hard', 2024, 3,
    C('兩個收入、教育與居住環境差異很大的社區，健康狀況也明顯不同。把這種差異「全部」歸咎於個人生活習慣（如不運動、飲食差），主要忽略了？',
      'Two communities differing greatly in income, education and housing also differ markedly in health. Blaming this difference ENTIRELY on individual lifestyle (e.g. lack of exercise, poor diet) mainly overlooks?'),
    [opt('健康的「社會決定因素」——收入、教育、居住、醫療可及性等社會結構條件，會系統性地影響個人的健康與選擇',
        'the social determinants of health — income, education, housing and access to care systematically shape individual health and even the choices people can make'),
      opt('個人習慣其實與健康毫無關係',
        'that personal habits are actually irrelevant to health'),
      opt('健康差異純屬隨機，沒有任何成因',
        'that the health gap is purely random with no causes'),
      opt('只有遺傳基因才會影響健康',
        'that only genes affect health')],
    C('把健康不平等全歸於個人選擇，忽略了「社會決定因素」：低收入、低教育、惡劣居住與醫療可及性差等結構條件，本身就限制了人的健康與其能作的選擇。整全的分析須兼顧個人與社會因素。\n\n【陷阱】「習慣與健康無關」走向另一極端；「純屬隨機」「只有基因」都否定了社會結構因素的系統性影響。',
      'Blaming health inequality wholly on individual choice ignores the social determinants of health: low income, low education, poor housing and weak access to care are structural conditions that themselves constrain health and the choices people can make. A holistic analysis weighs both individual and social factors.\n\n【Trap】 “Habits irrelevant” over-corrects; “purely random” and “only genes” deny the systematic influence of social structure.')),

  q(id('et'), T.ethics, FW.evaluate, 'hard', 2023, 3,
    C('一名照顧者未經服務使用者同意，便把對方的病歷與私人情況告訴鄰居。從照顧倫理看，這主要違反了哪一原則？',
      'A carer tells a neighbour about a service user’s medical history and private circumstances without consent. In care ethics, this mainly violates which principle?'),
    [opt('保密原則（及尊重自主）——未經同意披露個人敏感資料，損害服務使用者的私隱與自決',
        'confidentiality (and respect for autonomy) — disclosing sensitive personal information without consent harms the user’s privacy and self-determination'),
      opt('行善原則，因為這樣做幫助了鄰居',
        'beneficence, because it helped the neighbour'),
      opt('公平原則，因為人人都應知道',
        'fairness, because everyone deserves to know'),
      opt('沒有違反任何照顧倫理原則',
        'no care-ethics principle is violated')],
    C('未經同意披露服務使用者的病歷與私事，直接違反「保密原則」，亦不尊重其自主與私隱。照顧關係建立於信任，保密是專業倫理的基石。\n\n【陷阱】「行善」「公平」是張冠李戴——把侵犯私隱說成助人或人人該知；「沒有違反」更是錯認。',
      'Disclosing a user’s medical history and private matters without consent directly violates confidentiality and disrespects their autonomy and privacy. Care relationships rest on trust, and confidentiality is a cornerstone of professional ethics.\n\n【Trap】 “Beneficence”/“fairness” misapply principles — recasting a privacy breach as helping or a right to know; “no violation” simply misreads it.')),
]

export const healthManagementHellQuestions: Question[] = [...concept, ...prevent, ...ethics]

export const healthManagementHellTopics: Topic[] = topicList([
  { topic: T.concept, fw: FW.concept,  count: concept.length },
  { topic: T.prevent, fw: FW.apply,    count: prevent.length },
  { topic: T.ethics,  fw: FW.evaluate, count: ethics.length },
])
