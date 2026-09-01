import type { Question } from './types'
import { createBank, n, qty, round, type TopicMeta, type FwMeta } from './_parametric'

// ═══════════════════════════════════════════════════════════════════════════
// health-management-bank.ts —— 健康管理與社會關懷參數化母模板（2026-08-29）
// ---------------------------------------------------------------------------
// 第八批。public_health（63）為全科最厚，完全不碰；只為其餘十個
// 介乎 10 至 16 條的課題出題。
//
// 撰寫前的迴圈估算：數值模板目標 24 至 40 條，分類型模板 12 至 20 條，
// 令十個薄弱課題各自落在 30 至 55 之間。
//
// ⚠️ 沿用體育與設應科那兩批的防範（兩批均八閘一次通過）：
//   一、所有選項一律寫成明確的 [zh, en] 對；干擾項由具名的雙語資料表取出。
//   二、以區間分類時取值落在區間內部，避免題幹相同而答案互相否定。
//   三、每組模板的目標產出先估算後撰寫。
//   四、由清單取正確項一律用 `if (!x) continue`，不用 `!` 斷言。
//   五、分類型模板若要加量，必須寫【題幹與選項都不同】的變體，
//      不可把同一題幹複製成多個 variant（生物科 PC1 曾因此整組被退回）。
//
// ⚠️ 本科涉及健康資訊。所有題目只陳述教科書層面的公共衞生概念，
// 不提供個人化醫療建議，亦不描述任何自動偵測或介入機制。
// ═══════════════════════════════════════════════════════════════════════════

const T = {
  holistic: { id: 'hm_holistic_concept', zh: '整全健康・概念應用', en: 'Holistic health — application' },
  prevention: { id: 'hm_prevention_levels', zh: '三級預防分類', en: 'Levels of prevention' },
  determinants: { id: 'hm_care_ethics_determinants', zh: '照顧倫理與健康決定因素', en: 'Care ethics & determinants' },
  promotion: { id: 'health_promotion', zh: '促進健康', en: 'Health Promotion' },
  concept: { id: 'health_concept', zh: '健康概念', en: 'Concepts of Health' },
  lifespan: { id: 'lifespan', zh: '人生發展', en: 'Lifespan Development' },
  systems: { id: 'care_systems', zh: '醫療與社會照顧系統', en: 'Health & Social Care Systems' },
  community: { id: 'community_care', zh: '社區照顧', en: 'Community Care' },
  ethics: { id: 'care_ethics', zh: '照顧倫理', en: 'Care Ethics' },
  skills: { id: 'care_skills', zh: '照顧技巧', en: 'Care Skills' },
} satisfies Record<string, TopicMeta>

const FW = {
  apply: { id: 'apply', zh: '應用分析', en: 'Application', emoji: '🛠️' },
  logic: { id: 'logic', zh: '邏輯推理', en: 'Logical Reasoning', emoji: '🧠' },
} satisfies Record<string, FwMeta>

const b = createBank('health-management')
const distract = (correct: number, cands: number[]): number[] =>
  cands.filter((v, i, a) => v !== correct && a.indexOf(v) === i && Number.isFinite(v) && v > 0).slice(0, 3)

// ── 三級預防分類（目標約 36 條）────────────────────────────────────────────

const measures: Array<[string, string, string, string, string, string]> = [
  ['為初中學生接種疫苗', 'vaccinating junior secondary students', '第一級預防', 'primary prevention', '在疾病發生【之前】降低發病風險', 'reducing risk BEFORE disease occurs'],
  ['推行禁煙教育', 'running anti-smoking education', '第一級預防', 'primary prevention', '在疾病發生【之前】降低發病風險', 'reducing risk BEFORE disease occurs'],
  ['為五十歲以上人士安排大腸癌篩查', 'screening people over fifty for colorectal cancer', '第二級預防', 'secondary prevention', '在疾病【早期而未有症狀】時及早發現', 'detecting disease EARLY, before symptoms appear'],
  ['為高血壓風險人士定期量血壓', 'regular blood-pressure checks for those at risk', '第二級預防', 'secondary prevention', '在疾病【早期而未有症狀】時及早發現', 'detecting disease EARLY, before symptoms appear'],
  ['為中風後患者提供復康訓練', 'providing rehabilitation after a stroke', '第三級預防', 'tertiary prevention', '在疾病【已經發生】之後減少失能與併發症', 'limiting disability and complications AFTER disease has occurred'],
  ['為糖尿病患者提供足部護理指導', 'giving foot-care guidance to people with diabetes', '第三級預防', 'tertiary prevention', '在疾病【已經發生】之後減少失能與併發症', 'limiting disability and complications AFTER disease has occurred'],
  ['在食水中添加適量氟化物', 'adding fluoride to the water supply', '第一級預防', 'primary prevention', '在疾病發生【之前】降低發病風險', 'reducing risk BEFORE disease occurs'],
  ['為初生嬰兒進行聽力篩檢', 'screening newborns for hearing loss', '第二級預防', 'secondary prevention', '在疾病【早期而未有症狀】時及早發現', 'detecting disease EARLY, before symptoms appear'],
  ['為截肢者提供義肢與步行訓練', 'providing prostheses and gait training after amputation', '第三級預防', 'tertiary prevention', '在疾病【已經發生】之後減少失能與併發症', 'limiting disability and complications AFTER disease has occurred'],
]
const levelOpts: Array<[string, string]> = [
  ['第一級預防', 'primary prevention'], ['第二級預防', 'secondary prevention'],
  ['第三級預防', 'tertiary prevention'], ['並不屬於預防措施', 'not a preventive measure at all'],
]
for (const [zh, en, level, levelEn, why, whyEn] of measures) {
  const correct = levelOpts.find((o) => o[0] === level)
  if (!correct) continue
  const rest = levelOpts.filter((o) => o !== correct).slice(0, 3)
  // 變體一：由措施推層級
  b.add(`hmb_pv1_${en.slice(0, 12)}_a`, T.prevention, FW.logic, 'medium',
    [`「${zh}」屬於哪一級預防？`, `Which level of prevention is ${en}?`],
    [correct, ...rest],
    [`「${zh}」屬${level}，因為它${why}。三級預防的分界不在於措施本身有多積極，而在於【介入時點相對疾病進程的位置】：病前為第一級，早期無症狀為第二級，病後減害為第三級。同一種行為在不同時點可以落入不同層級——為健康人士做的運動指導屬第一級，為心臟病康復者做的則屬第三級。`,
     `${en.charAt(0).toUpperCase() + en.slice(1)} is ${levelEn}, because it involves ${whyEn}. The boundaries do not depend on how vigorous a measure is but on WHERE THE INTERVENTION SITS RELATIVE TO THE DISEASE PROCESS: before onset is primary, early and asymptomatic is secondary, and after onset is tertiary. The same activity can fall into different levels at different points — exercise advice for a healthy person is primary, while the same advice for someone recovering from heart disease is tertiary.`])
}

// 變體二：由層級推措施。每個級別只出一條——同級措施的 why 完全相同，
// 若逐個措施都出一條，題幹會一模一樣（實測被撞題閘捉到）。
for (const [level, levelEn] of [
  ['第一級預防', 'primary prevention'], ['第二級預防', 'secondary prevention'], ['第三級預防', 'tertiary prevention'],
] as Array<[string, string]>) {
  const inLevel = measures.filter((m) => m[2] === level)
  const outLevel = measures.filter((m) => m[2] !== level)
  if (inLevel.length === 0 || outLevel.length < 3) continue
  const why = inLevel[0][4], whyEn = inLevel[0][5]
  b.add(`hmb_pv2_${levelEn.slice(0, 9)}`, T.prevention, FW.apply, 'hard',
    [`某項健康計劃的目標是${why}。以下哪一項措施最切合此目標？`,
     `A health programme aims at ${whyEn}. Which measure best matches that aim?`],
    [[inLevel[0][0], inLevel[0][1]], ...outLevel.slice(0, 3).map((m) => [m[0], m[1]] as [string, string])],
    [`目標「${why}」對應${level}，故應選「${inLevel[0][0]}」。答此類題須先把目標翻譯成【疾病進程上的位置】，再挑選處於該位置的措施。留意三級預防並非互相排斥，一個完整的健康政策通常三級並用；試題只是要求辨明某一項措施的定位。`,
     `The aim of ${whyEn} corresponds to ${levelEn}, so the answer is ${inLevel[0][1]}. Translate the aim into a POSITION ON THE DISEASE PROCESS first, then pick the measure sitting at that position. The three levels are not mutually exclusive: a complete health policy normally uses all three, and the question asks only where one particular measure belongs.`])
}

// ── 整全健康・概念應用（目標約 32 條）──────────────────────────────────────

const dims: Array<[string, string, string, string]> = [
  ['身體健康', 'physical health', '身體機能與生理狀態，例如體適能、睡眠與營養', 'bodily function and physiology, such as fitness, sleep and nutrition'],
  ['心理健康', 'mental health', '情緒調節、思維與應對壓力的能力', 'the regulation of emotion, thinking, and the capacity to cope with stress'],
  ['社交健康', 'social health', '與他人建立及維繫關係、獲得支援的能力', 'forming and sustaining relationships and drawing on support'],
  ['靈性健康', 'spiritual health', '對生命意義、價值與方向的感受', 'a sense of meaning, values and direction in life'],
  ['情緒健康', 'emotional health', '辨識、表達與調節自身情緒的能力', 'the ability to recognise, express and regulate one\'s own emotions'],
  ['職業健康', 'occupational health', '工作與生活的平衡，以及工作帶來的滿足與壓力', 'the balance between work and life, and the satisfaction and strain that work brings'],
]
for (const [zh, en, def, defEn] of dims) {
  const others = dims.filter((d) => d[0] !== zh).slice(0, 3)
  b.add(`hmb_ho1_${en.slice(0, 10)}_d`, T.holistic, FW.logic, 'easy',
    [`整全健康概念中的「${zh}」指甚麼？`, `In the holistic concept of health, what does ${en} refer to?`],
    [[def, defEn], ...others.map((d) => [d[2], d[3]] as [string, string])],
    [`「${zh}」指${def}。整全健康的核心主張是各個面向【互相影響】而非各自獨立：長期缺乏社交支援會影響情緒，情緒困擾又會影響睡眠與免疫功能。因此評估健康不能只看單一指標，而干預亦不應只針對表面症狀。`,
     `${en.charAt(0).toUpperCase() + en.slice(1)} refers to ${defEn}. The central claim of holistic health is that the dimensions INTERACT rather than stand apart: prolonged lack of social support affects mood, and distress in turn affects sleep and immune function. Health therefore cannot be assessed on a single indicator, and intervention should not address only the surface symptom.`])
}

// 個案題只出一次：其題幹不涉及個別面向，若放在迴圈內會產生六條相同的題
// （實測被撞題閘捉到）。
b.add('hmb_ho2_case', T.holistic, FW.apply, 'hard',
  ['一名長者退休後與舊同事失去聯絡，數月後出現食慾下降與睡眠困難。就整全健康而言，此個案說明了甚麼？',
   'After retiring, an older person loses contact with former colleagues and, months later, sleeps and eats poorly. What does this illustrate about holistic health?'],
  [['健康各面向互相影響，社交層面的改變可以循心理進而影響身體',
    'the dimensions interact: a change in the social dimension can affect the physical by way of the psychological'],
   ['身體症狀必然只有生理成因，與社交無關',
    'physical symptoms always have purely physiological causes, unrelated to social factors'],
   ['靈性健康是唯一重要的面向，其餘可以忽略',
    'spiritual health is the only dimension that matters and the rest can be ignored'],
   ['各面向完全獨立，一個面向的改變不會波及其他',
    'the dimensions are wholly independent, and change in one never touches another']],
  ['此個案顯示健康各面向互相影響：退休令社交網絡收窄（社交層面），繼而影響情緒與作息（心理層面），最終呈現為食慾與睡眠問題（身體層面）。這正是「整全」二字的意思——把人視為一個相互關連的整體，而非幾個互不相干的系統。故照顧計劃亦應同時處理社交連繫，而非只針對睡眠與食慾。',
   'The case shows the dimensions interacting: retirement narrows the social network, which affects mood and routine, and this finally appears as poor appetite and sleep. That is what "holistic" means — treating the person as one interconnected whole rather than several unrelated systems. A care plan should therefore address social connection as well as sleep and appetite.'])

// 每個面向另出一條應用題，題幹含該面向名稱，故彼此不會重複。
for (const [zh, en, def, defEn] of dims) {
  const others = dims.filter((d) => d[0] !== zh).slice(0, 3)
  b.add(`hmb_ho3_${en.slice(0, 10)}`, T.holistic, FW.apply, 'medium',
    [`若一項照顧計劃完全忽略「${zh}」這個面向，最可能出現甚麼後果？`,
     `What is the likely consequence if a care plan wholly neglects ${en}?`],
    [[`與${def}有關的需要長期未被處理，其他面向亦會受連累`,
      `needs relating to ${defEn} go unaddressed, and the other dimensions suffer in turn`],
     ['沒有後果，各面向互不相干，忽略其一不影響其餘',
      'no consequence: the dimensions are unrelated, so neglecting one does not affect the rest'],
     ['只會影響紀錄的完整性，不影響服務使用者',
      'only the completeness of the records is affected, not the person'],
     ['計劃會即時失效，服務使用者無法接受任何照顧',
      'the plan fails immediately and the person can receive no care at all']],
    [`忽略「${zh}」意味著與${def}有關的需要長期無人處理。由於各面向互相影響，缺口不會停留在原處——例如長期忽略社交需要，最終會以情緒與身體症狀呈現。制訂照顧計劃時逐一檢視各面向，正是為了避免這種「看不見的缺口」。`,
     `Neglecting ${en} means that needs concerning ${defEn} go unmet indefinitely. Because the dimensions interact, the gap does not stay where it started: neglected social needs, for instance, eventually present as emotional and physical symptoms. Reviewing each dimension when drawing up a care plan exists precisely to prevent such invisible gaps.`])
}

// ── 促進健康（目標約 30 條）────────────────────────────────────────────────

// HP1 — 發病率與盛行率
for (const pop of [2000, 5000, 8000, 10000, 20000]) {
  for (const cases of [20, 40, 60, 100, 150]) {
    const per1000 = (cases / pop) * 1000
    if (!Number.isInteger(per1000 * 10)) continue
    const d = distract(per1000, [cases, pop / cases, per1000 * 10])
    if (d.length < 3) continue
    b.add(`hmb_hp1_${pop}_${cases}`, T.promotion, FW.apply, cases <= 40 ? 'easy' : 'medium',
      [`某社區有 ${pop} 名居民，一年內有 ${cases} 人新確診某疾病。每千人的發病率是多少？`,
       `In a community of ${pop} residents, ${cases} people are newly diagnosed with a disease in one year. What is the incidence per 1000?`],
      [qty(round(per1000, 2), '／千人', 'per 1000'), ...d.map((v) => qty(round(v, 2), '／千人', 'per 1000'))],
      [`發病率 = $\\dfrac{${cases}}{${pop}} \\times 1000 = ${round(per1000, 2)}$／千人。要分清【發病率】與【盛行率】：發病率只計某段時間內的【新】個案，反映疾病發生的速度；盛行率則計某一時點的【所有】個案（新舊皆計），反映負擔的總量。慢性病的盛行率可以很高而發病率不高，因為患者長期存活而不斷累積。`,
       `Incidence = $\\dfrac{${cases}}{${pop}} \\times 1000 = ${round(per1000, 2)}$ per 1000. Distinguish INCIDENCE from PREVALENCE: incidence counts only NEW cases arising in a period and reflects the rate at which disease occurs, while prevalence counts ALL cases present at a point in time, new and old alike, and reflects total burden. A chronic disease can have high prevalence but low incidence, because those affected survive and accumulate.`])
  }
}

// ── 健康概念（目標約 24 條）────────────────────────────────────────────────

const models: Array<[string, string, string, string]> = [
  ['生物醫學模式', 'the biomedical model', '把健康視為沒有疾病，焦點在病理與治療', 'treating health as the absence of disease, focusing on pathology and cure'],
  ['社會生態模式', 'the socio-ecological model', '把健康視為個人、社區與環境互動的結果', 'treating health as the outcome of interaction between person, community and environment'],
  ['整全模式', 'the holistic model', '把健康視為身心社靈各面向的整體狀態', 'treating health as the overall state of physical, mental, social and spiritual dimensions'],
  ['健康促進模式', 'the health promotion model', '強調賦權，令人有能力控制並改善自身健康', 'emphasising empowerment, so people gain control over and improve their own health'],
]
for (const [zh, en, def, defEn] of models) {
  const others = models.filter((m) => m[0] !== zh).slice(0, 3)
  b.add(`hmb_hc1_${en.slice(4, 14)}`, T.concept, FW.logic, 'medium',
    [`「${zh}」如何理解健康？`, `How does ${en} understand health?`],
    [[def, defEn], ...others.map((m) => [m[2], m[3]] as [string, string])],
    [`${zh}${def}。各模式並非互相取代，而是【關注焦點不同】：生物醫學模式在急症處理上仍然不可或缺，但它難以解釋為何同一種病在不同社群的發病率相差甚遠——那需要社會生態的視角。理解模式的用處，在於知道每一種視角看得見甚麼、看不見甚麼。`,
     `${en.charAt(0).toUpperCase() + en.slice(1)} understands health as ${defEn}. The models do not replace one another but DIFFER IN FOCUS: the biomedical model remains indispensable in acute care, yet it struggles to explain why the same disease occurs at very different rates in different communities — that requires a socio-ecological view. The value of knowing the models lies in knowing what each makes visible and what it leaves out.`])
}

// ── 人生發展（目標約 24 條）────────────────────────────────────────────────

const life: Array<[string, string, string, string]> = [
  ['嬰幼兒期', 'infancy and early childhood', '建立依附關係與基本信任，感官與動作迅速發展', 'forming attachment and basic trust, with rapid sensory and motor development'],
  ['兒童期', 'childhood', '發展勤奮感與同儕關係，開始建立自我概念', 'developing industry and peer relationships, and beginning to form a self-concept'],
  ['青少年期', 'adolescence', '確立自我身分，同儕影響上升而尋求自主', 'establishing identity, with rising peer influence and a search for autonomy'],
  ['成年期', 'adulthood', '建立親密關係、承擔工作與家庭責任', 'forming intimate relationships and taking on work and family responsibilities'],
  ['長者期', 'later life', '面對角色轉變與失落，整理並回顧一生的意義', 'facing role change and loss, and reviewing the meaning of a life'],
]
for (const [zh, en, task, taskEn] of life) {
  const others = life.filter((l) => l[0] !== zh).slice(0, 3)
  b.add(`hmb_ls1_${en.slice(0, 10)}`, T.lifespan, FW.logic, 'easy',
    [`就人生發展而言，${zh}的主要發展任務是甚麼？`, `What is the main developmental task of ${en}?`],
    [[task, taskEn], ...others.map((l) => [l[2], l[3]] as [string, string])],
    [`${zh}的主要發展任務是${task}。理解發展任務的用處在於【照顧應配合階段】：對青少年而言，過度保護會妨礙自主的建立；對長者而言，只提供身體照顧而忽略生命回顧的需要，同樣是照顧不足。發展階段提供的是理解需要的框架，而非年齡與行為的硬性對照。`,
     `The main developmental task of ${en} is ${taskEn}. Knowing the tasks matters because CARE SHOULD FIT THE STAGE: overprotecting an adolescent obstructs the development of autonomy, while providing an older person with physical care alone, ignoring the need to review a life, is equally inadequate. Developmental stages give a framework for understanding needs, not a rigid mapping of age to behaviour.`])
}

// ── 醫療與社會照顧系統（目標約 24 條）──────────────────────────────────────

const levels: Array<[string, string, string, string]> = [
  ['基層醫療', 'primary care', '首個接觸點，處理常見疾病、預防與轉介', 'the first point of contact, handling common conditions, prevention and referral'],
  ['第二層醫療', 'secondary care', '由專科醫生處理，通常經轉介而來', 'specialist care, usually reached by referral'],
  ['第三層醫療', 'tertiary care', '高度專科與複雜個案，設於大型醫院', 'highly specialised and complex care, based in major hospitals'],
  ['社區照顧服務', 'community care services', '在住所或社區內提供支援，令服務使用者可留在熟悉環境', 'support at home or in the neighbourhood, so people can remain in familiar surroundings'],
]
for (const [zh, en, def, defEn] of levels) {
  const others = levels.filter((l) => l[0] !== zh).slice(0, 3)
  b.add(`hmb_cs1_${en.slice(0, 10)}`, T.systems, FW.logic, 'easy',
    [`醫療體系中的「${zh}」承擔甚麼角色？`, `What role does ${en} play in the health care system?`],
    [[def, defEn], ...others.map((l) => [l[2], l[3]] as [string, string])],
    [`${zh}${def}。分層的用意在於【把資源與需要配對】：若所有問題都直接湧向第三層，成本高昂而輪候時間拉長，真正需要高度專科的病人反而被延誤。強化基層醫療之所以是政策重點，正因為它能在問題變複雜之前處理，並承擔預防與長期跟進的角色。`,
     `${en.charAt(0).toUpperCase() + en.slice(1)} is ${defEn}. The point of tiering is to MATCH RESOURCES TO NEED: if every problem went straight to the tertiary level, costs would rise and waiting times lengthen, delaying the patients who genuinely require highly specialised care. Strengthening primary care is a policy priority precisely because it addresses problems before they grow complex, and carries prevention and long-term follow-up.`])
}

// ── 社區照顧（目標約 20 條）────────────────────────────────────────────────

for (const [zh, en, adv, advEn] of [
  ['居家安老', 'ageing in place', '維持熟悉環境與社區網絡，有助心理與社交健康', 'familiar surroundings and social networks are preserved, supporting mental and social health'],
  ['日間護理中心', 'day care centres', '日間提供照顧與活動，同時讓家庭照顧者得到喘息', 'daytime care and activities, while giving family carers respite'],
  ['家居照顧服務', 'home care services', '把服務送到住所，減少因交通與行動不便造成的障礙', 'bringing services to the home and removing barriers of transport and mobility'],
  ['院舍照顧', 'residential care', '為需要密集照顧者提供二十四小時支援', 'twenty-four-hour support for those needing intensive care'],
] as Array<[string, string, string, string]>) {
  const pool: Array<[string, string]> = [
    ['維持熟悉環境與社區網絡，有助心理與社交健康', 'familiar surroundings and social networks are preserved, supporting mental and social health'],
    ['日間提供照顧與活動，同時讓家庭照顧者得到喘息', 'daytime care and activities, while giving family carers respite'],
    ['把服務送到住所，減少因交通與行動不便造成的障礙', 'bringing services to the home and removing barriers of transport and mobility'],
    ['為需要密集照顧者提供二十四小時支援', 'twenty-four-hour support for those needing intensive care'],
  ]
  const others = pool.filter((p) => p[0] !== adv).slice(0, 3)
  b.add(`hmb_cc1_${en.slice(0, 10)}`, T.community, FW.apply, 'easy',
    [`「${zh}」這種社區照顧模式，其主要優點為何？`, `What is the principal advantage of ${en} as a mode of community care?`],
    [[adv, advEn], ...others],
    [`${zh}的主要優點是：${adv}。社區照顧的整體方向是【盡可能讓人留在自己的生活環境之中】，因為遷離熟悉環境本身即是一種失落，會影響心理與社交健康。但這不表示院舍照顧是次等選擇——當照顧需要超出家庭與社區服務所能承擔，適時入住院舍才是負責任的安排。判斷關鍵在於需要的強度，而非模式的優劣。`,
     `The principal advantage of ${en} is that ${advEn}. Community care is oriented towards KEEPING PEOPLE IN THEIR OWN SETTING wherever possible, since leaving familiar surroundings is itself a loss that affects mental and social health. This does not make residential care a lesser option: when needs exceed what family and community services can carry, timely admission is the responsible arrangement. The judgement turns on the intensity of need, not on a ranking of models.`])
}

// ── 照顧倫理（目標約 24 條）────────────────────────────────────────────────

const ethics: Array<[string, string, string, string]> = [
  ['自主原則', 'respect for autonomy', '尊重服務使用者自行作出知情決定的權利', 'respecting the right to make informed decisions for oneself'],
  ['行善原則', 'beneficence', '主動促進服務使用者的福祉', 'acting positively to promote the wellbeing of the person cared for'],
  ['不傷害原則', 'non-maleficence', '避免造成傷害，包括衡量介入本身的風險', 'avoiding harm, including weighing the risks of the intervention itself'],
  ['公義原則', 'justice', '公平分配資源，相同需要應獲相同對待', 'distributing resources fairly, so that like needs receive like treatment'],
]
for (const [zh, en, def, defEn] of ethics) {
  const others = ethics.filter((e) => e[0] !== zh).slice(0, 3)
  b.add(`hmb_ce1_${en.slice(0, 12)}_d`, T.ethics, FW.logic, 'easy',
    [`照顧倫理中的「${zh}」指甚麼？`, `In care ethics, what does ${en} mean?`],
    [[def, defEn], ...others.map((e) => [e[2], e[3]] as [string, string])],
    [`「${zh}」指${def}。四項原則在實務中經常互相衝突：例如一名認知能力尚存的長者拒絕接受治療，自主原則要求尊重其決定，行善原則卻指向介入。倫理判斷的工作不是背誦原則，而是在具體處境中衡量各原則的分量，並說明取捨的理由。`,
     `${en.charAt(0).toUpperCase() + en.slice(1)} means ${defEn}. The four principles frequently conflict in practice: when an older person with intact capacity refuses treatment, autonomy requires that the decision be respected while beneficence points towards intervening. Ethical reasoning is not the recitation of principles but the weighing of their force in a particular situation, together with reasons for the choice made.`])
}

// ── 照顧倫理與健康決定因素（目標約 24 條）──────────────────────────────────

const determinants: Array<[string, string, string, string]> = [
  ['收入與社會地位', 'income and social position', '影響能否負擔健康的食物、居所與求醫', 'shaping whether healthy food, housing and care are affordable'],
  ['教育程度', 'education', '影響健康資訊的理解與運用能力', 'shaping the ability to understand and act on health information'],
  ['居住環境', 'physical environment', '影響空氣、噪音、擠迫程度與活動空間', 'shaping air quality, noise, crowding and space for activity'],
  ['社會支援網絡', 'social support networks', '影響面對壓力與疾病時可得的協助', 'shaping the help available when facing stress or illness'],
]
for (const [zh, en, how, howEn] of determinants) {
  const others = determinants.filter((d) => d[0] !== zh).slice(0, 3)
  b.add(`hmb_dt1_${en.slice(0, 12)}`, T.determinants, FW.apply, 'medium',
    [`健康決定因素中的「${zh}」，主要透過甚麼途徑影響健康？`,
     `Through what pathway does ${en}, as a determinant of health, mainly act?`],
    [[how, howEn], ...others.map((d) => [d[2], d[3]] as [string, string])],
    [`「${zh}」主要${how}。健康決定因素的核心觀點是：健康差距很大程度由【個人選擇以外的條件】造成，故單靠健康教育難以拉近差距——若一個家庭負擔不起新鮮蔬果，再多的營養資訊亦改變不了餐桌。這正是政策層面的介入（房屋、收入保障、社區設施）被視為健康措施的原因。`,
     `${en.charAt(0).toUpperCase() + en.slice(1)} acts mainly by ${howEn}. The central insight of the determinants framework is that health inequalities arise largely from CONDITIONS BEYOND INDIVIDUAL CHOICE, so health education alone cannot close them: no amount of nutritional information changes what is on the table if a household cannot afford fresh produce. This is why interventions in housing, income security and community facilities are regarded as health measures.`])
}

// ── 照顧技巧（目標約 20 條）────────────────────────────────────────────────

for (const [zh, en, key, keyEn] of [
  ['協助長者轉移體位', 'assisting an older person to transfer', '事前說明步驟並取得同意，動作分段而不突然', 'explaining the steps and obtaining consent first, then moving in stages rather than abruptly'],
  ['餵食有吞嚥困難者', 'feeding someone with swallowing difficulty', '保持坐姿挺直、小口進食、進食後維持坐姿一段時間', 'keeping the person upright, offering small mouthfuls, and staying seated for a while afterwards'],
  ['協助沐浴', 'assisting with bathing', '維護私隱與尊嚴，讓對方盡量自行完成能力所及的部分', 'protecting privacy and dignity, and letting the person do whatever they still can'],
  ['與認知障礙症患者溝通', 'communicating with a person with dementia', '簡短清晰、一次一項、給予充足反應時間', 'using short clear sentences, one point at a time, and allowing ample time to respond'],
] as Array<[string, string, string, string]>) {
  const pool: Array<[string, string]> = [
    ['事前說明步驟並取得同意，動作分段而不突然', 'explaining the steps and obtaining consent first, then moving in stages rather than abruptly'],
    ['保持坐姿挺直、小口進食、進食後維持坐姿一段時間', 'keeping the person upright, offering small mouthfuls, and staying seated for a while afterwards'],
    ['維護私隱與尊嚴，讓對方盡量自行完成能力所及的部分', 'protecting privacy and dignity, and letting the person do whatever they still can'],
    ['簡短清晰、一次一項、給予充足反應時間', 'using short clear sentences, one point at a time, and allowing ample time to respond'],
  ]
  const others = pool.filter((p) => p[0] !== key).slice(0, 3)
  b.add(`hmb_sk1_${en.slice(0, 12)}`, T.skills, FW.apply, 'medium',
    [`「${zh}」時，最重要的原則是甚麼？`, `What is the most important principle when ${en}?`],
    [[key, keyEn], ...others],
    [`要點是：${key}。所有照顧技巧背後有一條共通原則——【保留對方的能力與尊嚴】。照顧者代勞得愈多，服務使用者的能力流失得愈快，這稱為過度照顧。恰當的做法是提供剛好足夠的協助，讓對方仍然參與，而非把事情全部做完。`,
     `The key point is ${keyEn}. One principle underlies every care skill: PRESERVE THE PERSON'S CAPACITY AND DIGNITY. The more a carer does on someone's behalf, the faster that person's own ability declines — this is over-caring. The right approach is to give just enough assistance for the person to remain involved, rather than completing the task for them.`])
}

// ── 分類型課題的第二變體 ───────────────────────────────────────────────────
// 每個變體的題幹與選項均與第一變體不同，不是同一題幹的 variant
// （生物科 PC1 曾因複製題幹被撞題閘整組退回）。

for (const [zh, en, def, defEn] of models) {
  const others = models.filter((m) => m[0] !== zh).slice(0, 3)
  b.add(`hmb_hc2_${en.slice(4, 14)}`, T.concept, FW.apply, 'hard',
    [`若一項健康政策完全依照「${zh}」的視角制定，最可能出現甚麼盲點？`,
     `If a health policy were framed entirely through ${en}, what blind spot would most likely arise?`],
    [[`只看見${def}所涵蓋的部分，忽略其他模式所關注的層面`,
      `it would see only what ${defEn} covers, and miss what the other models attend to`],
     ['沒有任何盲點，單一模式已足以涵蓋全部健康議題',
      'no blind spot: one model suffices for every health issue'],
     ['盲點只在於資料收集的技術層面，與視角無關',
      'the blind spot would be purely technical, in data collection, not in perspective'],
     ['政策必然失效，單一模式無法產生任何有效措施',
      'the policy would simply fail, since one model can produce no effective measure']],
    [`任何模式都是【一種看法】，看見某些東西的同時必然遮蔽另一些。${zh}${def}，其盲點正在於它不處理的層面。實務上的做法並非挑選唯一正確的模式，而是自覺地指出「我此刻用哪一個視角、它看不見甚麼」，再以其他視角補足。`,
     `Every model is A WAY OF SEEING, and in showing some things it necessarily obscures others. ${en.charAt(0).toUpperCase() + en.slice(1)} treats health as ${defEn}, and its blind spot lies precisely in what it does not address. The practical response is not to choose one correct model but to state deliberately which perspective is in use and what it cannot see, then supplement it with the others.`])
}

for (const [zh, en, task, taskEn] of life) {
  const others = life.filter((l) => l[0] !== zh).slice(0, 3)
  b.add(`hmb_ls2_${en.slice(0, 10)}`, T.lifespan, FW.apply, 'medium',
    [`一項為${zh}人士而設的服務，若完全不考慮該階段的發展任務，最可能出現甚麼問題？`,
     `A service designed for people in ${en} takes no account of the developmental task of that stage. What is the likely problem?`],
    [[`服務未能配合「${task}」這項需要，即使資源充足亦難以真正幫到對方`,
      `it fails to meet the need to be ${taskEn}, and cannot truly help however well resourced`],
     ['沒有問題，只要資源充足，服務內容並不重要',
      'no problem: content does not matter provided resources are sufficient'],
     ['問題只在於成本，與發展任務無關',
      'the only issue is cost, unrelated to developmental tasks'],
     ['發展任務只適用於兒童，成人服務不需考慮',
      'developmental tasks apply only to children, so adult services need not consider them']],
    [`${zh}的發展任務是${task}。服務若與此脫節，即使資源充足亦難以奏效——例如為青少年設計而全程由成人代為決定的計劃，恰恰妨礙了自主的建立。發展任務貫穿一生，並非只屬兒童階段：長者的生命回顧、成年人的親密與承擔，同樣是需要被照顧計劃納入的發展需要。`,
     `The developmental task of ${en} is ${taskEn}. A service disconnected from it cannot work however well funded — a programme for adolescents in which adults make every decision obstructs the very autonomy the stage requires. Developmental tasks run through the whole lifespan and are not confined to childhood: life review in later years, and intimacy and responsibility in adulthood, are equally needs that a care plan must accommodate.`])
}

for (const [zh, en, def, defEn] of ethics) {
  const others = ethics.filter((e) => e[0] !== zh).slice(0, 3)
  b.add(`hmb_ce2_${en.slice(0, 12)}`, T.ethics, FW.apply, 'medium',
    [`一名認知能力健全的服務使用者，其決定與照顧者認為對他最有利的做法相反。就「${zh}」而言，這個處境如何理解？`,
     `A service user with full capacity makes a decision contrary to what the carer believes is best for them. How does ${en} bear on this situation?`],
    [[`此原則要求${def}，故在此處境中須與其他原則一併衡量，不能單獨決定`,
      `the principle requires ${defEn}, so here it must be weighed against the others rather than settling the matter alone`],
     ['此原則凌駕其他一切原則，毋須衡量',
      'the principle overrides all others and needs no weighing'],
     ['照顧倫理不適用於有認知能力的使用者',
      'care ethics does not apply to users who have capacity'],
     ['應由照顧者單方面決定，使用者的意願不予考慮',
      'the carer should decide unilaterally, disregarding the user\'s wishes']],
    [`「${zh}」要求${def}。此處境正是自主與行善相衝突的典型：使用者有能力作決定，其選擇卻可能帶來風險。倫理上的正確處理不是宣布某一原則勝出，而是先確認能力是否健全、資訊是否充分，再在衡量之後說明取捨的理由，並把決定過程記錄下來。單方面代為決定，在使用者具備能力時並不正當。`,
     `${en.charAt(0).toUpperCase() + en.slice(1)} requires ${defEn}. This situation is the classic conflict between autonomy and beneficence: the user has capacity, yet their choice may carry risk. The ethically sound response is not to declare one principle the winner but to establish first whether capacity is intact and information adequate, then to weigh, state the reasons for the choice made, and record the process. Deciding unilaterally is not legitimate where the user has capacity.`])
}

export const healthManagementBank2Questions: Question[] = b.bank
