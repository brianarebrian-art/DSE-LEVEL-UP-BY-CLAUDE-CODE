import type { Question } from './types'
import { createBank, qty, type TopicMeta, type FwMeta } from './_parametric'

// ═══════════════════════════════════════════════════════════════════════════
// health-management-bank2.ts —— 健康管理參數化母模板・第二批（2026-09-03）
// ---------------------------------------------------------------------------
// 本科現為 283 條、分佈 14–63（4.5 倍）。十一個課題全部低於每課題 91
// 的目標，故為全部十一個出題。
//
// ⚠️ 五條累積教訓（同日七役），開工前先寫下：
//   ① 誘答必須互不相同【且代數上不恆等】（ICT DC2、生物 GE2）。
//   ② 每個迴圈變數【必須出現在題幹】（音樂 HA1）。
//   ③ 補量用值域寬的數值參數，不要用固定枚舉表（音樂第一版只出 152 條）。
//   ④ 迴圈相乘：三層各加一值即八倍，不是加三。
//   ⑤ 【改完即量度，不要改完九個才跑一次】—— 旅遊與款待一批把九個迴圈
//      同時加闊，產出由 380 跳至 1049，八個課題 overshoot 至 127–171，
//      再花兩輪收回。教訓④寫在檔頭仍然重犯，因為問題不在於不知道，
//      而在於量度的頻率。
// ═══════════════════════════════════════════════════════════════════════════

const T = {
  determinants: { id: 'hm_care_ethics_determinants', zh: '照顧倫理與健康決定因素', en: 'Care ethics & determinants' },
  systems: { id: 'care_systems', zh: '醫療與社會照顧系統', en: 'Health & Social Care Systems' },
  community: { id: 'community_care', zh: '社區照顧', en: 'Community Care' },
  skills: { id: 'care_skills', zh: '照顧技巧', en: 'Care Skills' },
  prevention: { id: 'hm_prevention_levels', zh: '三級預防分類', en: 'Levels of prevention' },
  concept: { id: 'health_concept', zh: '健康概念', en: 'Concepts of Health' },
  ethics: { id: 'care_ethics', zh: '照顧倫理', en: 'Care Ethics' },
  holistic: { id: 'hm_holistic_concept', zh: '整全健康・概念應用', en: 'Holistic health — application' },
  lifespan: { id: 'lifespan', zh: '人生發展', en: 'Lifespan Development' },
  promotion: { id: 'health_promotion', zh: '促進健康', en: 'Health Promotion' },
  publicHealth: { id: 'public_health', zh: '公共衞生與疾病預防', en: 'Public Health & Disease Prevention' },
} satisfies Record<string, TopicMeta>

const FW = {
  logic: { id: 'logic', zh: '邏輯推理', en: 'Logical Reasoning', emoji: '🧠' },
  apply: { id: 'apply', zh: '應用分析', en: 'Application', emoji: '🛠️' },
} satisfies Record<string, FwMeta>

const b = createBank('health-management')

const distract = (correct: number, cands: number[]): number[] =>
  cands.filter((v, i, a) => v !== correct && a.indexOf(v) === i).slice(0, 3)

// ── 照顧倫理與健康決定因素 ────────────────────────────────────────────────

// DT1 — 健康差距：兩組人的預期壽命差
for (const rich of [80, 81, 82, 83, 84, 85, 86, 87, 88]) {
  for (const poor of [68, 70, 71, 72, 73, 74, 75, 76, 78]) {
    if (poor >= rich) continue
    const gap = rich - poor
    const d = distract(gap, [rich, poor, rich + poor])
    if (d.length < 3) continue
    b.add(`hmb2_dt1_${rich}_${poor}`, T.determinants, FW.apply, 'medium',
      [`某地最富裕地區的預期壽命為 ${rich} 歲，最貧窮地區為 ${poor} 歲。兩者相差多少歲？`,
       `Life expectancy is ${rich} years in a territory's wealthiest district and ${poor} in its poorest. What is the gap, in years?`],
      [qty(gap, '歲', 'years'), ...d.map((v) => qty(v, '歲', 'years'))],
      [`差距 = $${rich} - ${poor} = ${gap}$ 歲。這 ${gap} 年【不是】由個人選擇造成：住屋、收入、教育、工作環境與就醫距離共同構成健康的社會決定因素。把差距歸咎於「窮人生活習慣差」，會令政策方向由改善條件變成勸告個人，而後者對這 ${gap} 年幾乎無效。`,
       `The gap is $${rich} - ${poor} = ${gap}$ years. Those ${gap} years are NOT a matter of individual choice: housing, income, education, working conditions and distance to care together form the social determinants of health. Attributing the gap to "poor lifestyle choices" shifts policy from improving conditions to advising individuals, and the latter barely moves those ${gap} years.`])
  }
}

// ── 醫療與社會照顧系統 ────────────────────────────────────────────────────

// SY1 — 病床與人口比
for (const beds of [1000, 1200, 1500, 1800, 2000, 2400, 3000, 3600, 4000, 4800]) {
  for (const popK of [300, 400, 500, 600, 800, 1000, 1200]) {
    const per1000 = Math.round((beds / popK) * 100) / 100
    if (per1000 > 10) continue
    const d = distract(per1000, [beds, popK, Math.round((popK / beds) * 100) / 100])
    if (d.length < 3) continue
    b.add(`hmb2_sy1_${beds}_${popK}`, T.systems, FW.apply, 'medium',
      [`某地區有 ${beds} 張公立醫院病床，人口 ${popK} 千人。每千人可分得多少張病床？`,
       `A district has ${beds} public hospital beds for a population of ${popK} thousand. How many beds are there per thousand people?`],
      [qty(per1000, '張', 'beds'), ...d.map((v) => qty(v, '張', 'beds'))],
      [`每千人病床數 = $${beds} \\div ${popK} = ${per1000}$ 張。⚠️ 這個比率【不能單獨判斷醫療是否足夠】：一個以社區與家居照顧為主的體系，病床比率會較低而服務未必較差；反之病床多而人手不足，床位一樣用不上。要一併看的是醫護人手比、平均住院日數與輪候時間。`,
       `Beds per thousand = $${beds} \\div ${popK} = ${per1000}$. NOTE this ratio ALONE cannot say whether provision is adequate: a system built on community and home care shows fewer beds without worse service, while abundant beds with too few staff cannot be used. Staffing ratios, average length of stay and waiting times must be read alongside.`])
  }
}

// ── 社區照顧 ──────────────────────────────────────────────────────────────

// CM1 — 家居照顧服務時數
for (const perVisit of [2, 3, 4]) {
  for (const perWeek of [2, 3, 4, 5, 6, 7]) {
    for (const weeks of [4, 8, 12, 26, 52]) {
      const total = perVisit * perWeek * weeks
      const d = distract(total, [perVisit * perWeek, perVisit * weeks, perWeek * weeks])
      if (d.length < 3) continue
      b.add(`hmb2_cm1_${perVisit}_${perWeek}_${weeks}`, T.community, FW.apply, 'easy',
        [`一名長者接受家居照顧服務，每次 ${perVisit} 小時、每週 ${perWeek} 次，持續 ${weeks} 週。合共接受多少小時服務？`,
         `An older person receives home care of ${perVisit} hours per visit, ${perWeek} times a week, for ${weeks} weeks. How many hours of service is that in total?`],
        [qty(total, '小時', 'hours'), ...d.map((v) => qty(v, '小時', 'hours'))],
        [`總時數 = $${perVisit} \\times ${perWeek} \\times ${weeks} = ${total}$ 小時。社區照顧的政策取向是【原址安老】：讓長者留在熟悉的環境，維持既有的社交網絡與生活節奏。院舍雖然照顧密度高，但代價是離開自己的生活場景，而這一項無法用服務時數補回。`,
         `Total = $${perVisit} \\times ${perWeek} \\times ${weeks} = ${total}$ hours. The policy direction in community care is AGEING IN PLACE: keeping people in familiar surroundings so their social network and daily rhythm survive. Residential care offers denser support but at the cost of leaving one's own setting — and that loss cannot be made up in service hours.`])
    }
  }
}

// ── 照顧技巧 ──────────────────────────────────────────────────────────────

// SK1 — 轉身時間表：每日轉身次數
for (const intervalHr of [2, 3, 4]) {
  for (const hoursInBed of [12, 14, 16, 18, 20, 24]) {
    const times = hoursInBed / intervalHr
    if (!Number.isInteger(times)) continue
    const d = distract(times, [hoursInBed, intervalHr, hoursInBed - intervalHr])
    if (d.length < 3) continue
    b.add(`hmb2_sk1_${intervalHr}_${hoursInBed}`, T.skills, FW.apply, 'medium',
      [`一名臥床長者每日臥床 ${hoursInBed} 小時，護理指引要求每 ${intervalHr} 小時協助轉身一次。每日須協助轉身多少次？`,
       `A bed-bound resident spends ${hoursInBed} hours a day in bed and the care guideline requires repositioning every ${intervalHr} hours. How many repositionings are needed each day?`],
      [qty(times, '次', ''), ...d.map((v) => qty(v, '次', ''))],
      [`次數 = $${hoursInBed} \\div ${intervalHr} = ${times}$ 次。定時轉身的目的是預防【壓瘡】：持續受壓的皮膚組織會因缺血而壞死，而一旦形成，治療需時數週至數月。這是預防成本遠低於治療成本的典型例子 —— ${times} 次轉身所需的人手，比一個壓瘡的護理少得多。`,
       `Repositionings = $${hoursInBed} \\div ${intervalHr} = ${times}$. Regular turning prevents PRESSURE ULCERS: skin under sustained pressure loses its blood supply and dies, and once an ulcer forms it takes weeks or months to heal. It is a textbook case of prevention costing far less than treatment — the staff time for ${times} turns is a fraction of what one ulcer demands.`])
  }
}

// ── 三級預防分類 ──────────────────────────────────────────────────────────

// PV1 — 篩查覆蓋率
for (const screened of [1000, 1200, 1500, 1800, 2000, 2400, 2500, 3000, 3600, 4000, 4500, 5000, 6000]) {
  for (const eligible of [4000, 5000, 6000, 8000, 10000, 12000]) {
    if (screened > eligible) continue
    const pct = Math.round((screened / eligible) * 1000) / 10
    const d = distract(pct, [Math.round(((eligible - screened) / eligible) * 1000) / 10, screened, eligible - screened])
    if (d.length < 3) continue
    b.add(`hmb2_pv1_${screened}_${eligible}`, T.prevention, FW.apply, 'medium',
      [`某社區有 ${eligible} 名合資格居民，其中 ${screened} 人接受了大腸癌篩查。篩查覆蓋率為多少百分比？`,
       `A community has ${eligible} eligible residents and ${screened} took up colorectal cancer screening. What is the screening coverage, as a percentage?`],
      [qty(pct, '%', '%'), ...d.map((v) => qty(v, '%', '%'))],
      [`覆蓋率 = $${screened} \\div ${eligible} \\times 100\\% = ${pct}\\%$。篩查屬【第二級預防】：疾病已經開始但尚未出現症狀，及早發現可大幅改善預後。第一級是預防疾病發生（疫苗、戒煙），第三級是已患病後減少失能（復康）。三級的分別不在於做甚麼，而在於【在疾病進程的哪一點介入】。`,
       `Coverage = $${screened} \\div ${eligible} \\times 100\\% = ${pct}\\%$. Screening is SECONDARY prevention: the disease has begun but has not yet declared itself, and early detection greatly improves the outlook. Primary prevention stops disease arising at all through vaccination or smoking cessation, while tertiary limits disability once disease is established. The three differ not in what is done but in WHERE ON THE DISEASE COURSE the intervention lands.`])
  }
}

// ── 健康概念 ──────────────────────────────────────────────────────────────

// HC1 — 健康壽命與預期壽命之差
for (const life of [80, 82, 83, 84, 85, 86, 87, 88]) {
  for (const healthy of [68, 70, 71, 72, 73, 74, 75, 76]) {
    if (healthy >= life) continue
    const years = life - healthy
    const d = distract(years, [life, healthy, life + healthy])
    if (d.length < 3) continue
    b.add(`hmb2_hc1_${life}_${healthy}`, T.concept, FW.logic, 'medium',
      [`某地的預期壽命為 ${life} 歲，健康預期壽命為 ${healthy} 歲。平均而言，一個人有多少年在非完全健康的狀態下度過？`,
       `A territory has a life expectancy of ${life} years and a healthy life expectancy of ${healthy}. On average, how many years are spent in less than full health?`],
      [qty(years, '年', 'years'), ...d.map((v) => qty(v, '年', 'years'))],
      [`$${life} - ${healthy} = ${years}$ 年。這個差距說明【長壽不等於健康】—— 醫療進步延長了生命，但若沒有同步延長健康年期，多出來的年份是在失能或長期病患之中度過。健康管理的目標因此不是把預期壽命推得更高，而是把兩條線之間的 ${years} 年壓縮。`,
       `$${life} - ${healthy} = ${years}$ years. The gap shows that LONGER IS NOT HEALTHIER — medicine has extended life, but where healthy years have not kept pace the additional time is spent in disability or chronic illness. The aim of health management is therefore not to push life expectancy higher but to compress those ${years} years between the two curves.`])
  }
}

// ── 照顧倫理 ──────────────────────────────────────────────────────────────

// ET1 — 知情同意：資料理解率
for (const explained of [16, 20, 24, 25, 30, 36, 40, 48, 50, 60, 80]) {
  for (const understood of [8, 10, 12, 15, 20, 24, 30, 40]) {
    if (understood > explained) continue
    const pct = Math.round((understood / explained) * 1000) / 10
    const d = distract(pct, [explained, understood, explained - understood])
    if (d.length < 3) continue
    b.add(`hmb2_et1_${explained}_${understood}`, T.ethics, FW.apply, 'hard',
      [`一項研究向病人解釋 ${explained} 項治療資訊，事後測試顯示病人平均正確理解 ${understood} 項。理解率為多少百分比？`,
       `A study explains ${explained} items of treatment information to patients, who afterwards recall ${understood} correctly on average. What is the comprehension rate, as a percentage?`],
      [qty(pct, '%', '%'), ...d.map((v) => qty(v, '%', '%'))],
      [`理解率 = $${understood} \\div ${explained} \\times 100\\% = ${pct}\\%$。⚠️ 知情同意的成立條件是【理解】而非【告知】：簽署了同意書但只理解 ${pct}% 的資訊，在倫理上並不構成有效同意。這正是為何醫護要求病人【用自己的話複述】—— 覆述不出，就是未理解，而未理解的同意等於沒有同意。`,
       `Comprehension = $${understood} \\div ${explained} \\times 100\\% = ${pct}\\%$. NOTE that informed consent rests on UNDERSTANDING, not on having been told: a signed form covering ${pct}% comprehension is not ethically valid consent. This is exactly why clinicians ask patients to REPEAT BACK in their own words — what cannot be restated has not been understood, and consent without understanding is not consent.`])
  }
}

// ── 整全健康・概念應用 ────────────────────────────────────────────────────

// HO1 — 六個面向的評分總和與平均
for (const sum of [12, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30]) {
  const avg = Math.round((sum / 6) * 100) / 100
  if (avg > 5) continue
  const d = distract(avg, [sum, sum - 6, Math.round((6 / sum) * 100) / 100])
  if (d.length < 3) continue
  b.add(`hmb2_ho1_${sum}`, T.holistic, FW.apply, 'easy',
    [`整全健康評估涵蓋生理、心理、社交、情緒、精神與環境六個面向，各以五分為滿分。某人六項合計 ${sum} 分，其平均分為多少？`,
     `A holistic health assessment covers six dimensions — physical, mental, social, emotional, spiritual and environmental — each out of five. Someone scores ${sum} in total. What is their mean score?`],
    [qty(avg, '分', ''), ...d.map((v) => qty(v, '分', ''))],
    [`平均 = $${sum} \\div 6 = ${avg}$ 分。⚠️ 整全健康【不可以只看平均】：五項滿分而一項零分，平均是 ${Math.round((25 / 6) * 100) / 100} 分，看似不錯，但那零分的一項（例如社交完全孤立）足以拖垮其餘五項。評估的用意正是找出【最弱的一環】，而平均數恰恰把它藏起來。`,
     `Mean = $${sum} \\div 6 = ${avg}$. NOTE that holistic health must NOT be read as an average: five perfect scores and one zero average ${Math.round((25 / 6) * 100) / 100}, which looks respectable, yet that single zero — complete social isolation, say — will drag the other five down. The point of the assessment is to find the WEAKEST dimension, and an average is precisely what hides it.`])
}

// ── 人生發展 ──────────────────────────────────────────────────────────────

// LS1 — 人口老化：長者人口比例
for (const elderly of [50, 60, 75, 80, 90, 100, 120, 150, 160, 180, 200, 240]) {
  for (const total of [500, 600, 750, 800, 1000, 1200]) {
    if (elderly > total) continue
    const pct = Math.round((elderly / total) * 1000) / 10
    const d = distract(pct, [elderly, total - elderly, Math.round((total / elderly) * 10) / 10])
    if (d.length < 3) continue
    b.add(`hmb2_ls1_${elderly}_${total}`, T.lifespan, FW.apply, 'easy',
      [`某地區 65 歲及以上人口有 ${elderly} 萬人，總人口 ${total} 萬人。長者人口比例為多少百分比？`,
       `A territory has ${elderly} × 10⁴ people aged 65 or above out of ${total} × 10⁴ in total. What percentage are older persons?`],
      [qty(pct, '%', '%'), ...d.map((v) => qty(v, '%', '%'))],
      [`比例 = $${elderly} \\div ${total} \\times 100\\% = ${pct}\\%$。國際上一般以 7% 為「高齡化社會」、14% 為「高齡社會」、20% 為「超高齡社會」。⚠️ 比例上升可以來自兩個方向：長者增加，或者【出生人數下跌】。兩者對政策的含意不同 —— 前者要加照顧服務，後者要同時處理勞動人口萎縮。`,
       `Share = $${elderly} \\div ${total} \\times 100\\% = ${pct}\\%$. Internationally 7% marks an "ageing society", 14% an "aged society" and 20% a "super-aged" one. NOTE the share can rise from either direction: more older people, or FEWER BIRTHS. The policy implications differ — the first calls for more care services, the second additionally for a shrinking workforce.`])
  }
}

// ── 促進健康 ──────────────────────────────────────────────────────────────

// PR1 — 發病率
for (const newCases of [25, 30, 36, 40, 48, 50, 60, 72, 80, 100, 120, 150]) {
  for (const atRiskK of [10, 12, 15, 20, 25, 30, 50]) {
    const per10k = Math.round((newCases / atRiskK) * 10 * 10) / 10
    const d = distract(per10k, [newCases, atRiskK, Math.round((atRiskK / newCases) * 100) / 100])
    if (d.length < 3) continue
    b.add(`hmb2_pr1_${newCases}_${atRiskK}`, T.promotion, FW.apply, 'hard',
      [`某年某疾病在一個 ${atRiskK} 千人的高危群組中新增 ${newCases} 宗個案。該年的發病率為每萬人多少宗？`,
       `In one year ${newCases} new cases arise in an at-risk group of ${atRiskK} thousand. What is the incidence, per ten thousand people?`],
      [qty(per10k, '宗', 'cases'), ...d.map((v) => qty(v, '宗', 'cases'))],
      [`發病率 = $${newCases} \\div ${atRiskK}000 \\times 10000 = ${per10k}$ 宗／萬人。⚠️ 發病率與【盛行率】不同：發病率只數【新增】個案，量度的是疾病發生的速度；盛行率數所有【現存】個案，量度的是負擔總量。一種可治癒的急性病發病率可以很高而盛行率很低，一種不可逆的慢性病則相反。`,
       `Incidence = $${newCases} \\div ${atRiskK}000 \\times 10000 = ${per10k}$ per ten thousand. NOTE incidence differs from PREVALENCE: incidence counts only NEW cases and measures how fast disease arises, while prevalence counts all EXISTING cases and measures the burden carried. A curable acute illness can show high incidence with low prevalence; an irreversible chronic one shows the reverse.`])
  }
}

// ── 公共衞生與疾病預防 ────────────────────────────────────────────────────

// PH1 — 疫苗接種率與群體免疫門檻
for (const vaccinated of [500, 550, 600, 650, 700, 750, 800, 850, 900, 950, 1000]) {
  for (const population of [1000, 1100, 1200, 1250]) {
    const pct = Math.round((vaccinated / population) * 1000) / 10
    if (pct > 100) continue
    const d = distract(pct, [vaccinated, population - vaccinated, Math.round((population / vaccinated) * 100) / 100])
    if (d.length < 3) continue
    b.add(`hmb2_ph1_${vaccinated}_${population}`, T.publicHealth, FW.apply, 'medium',
      [`某社區 ${population} 人之中有 ${vaccinated} 人已完成接種。接種率為多少百分比？`,
       `In a community of ${population}, ${vaccinated} have completed vaccination. What is the vaccination rate, as a percentage?`],
      [qty(pct, '%', '%'), ...d.map((v) => qty(v, '%', '%'))],
      [`接種率 = $${vaccinated} \\div ${population} \\times 100\\% = ${pct}\\%$。群體免疫的門檻視乎疾病的傳染力而定：麻疹傳染力極強，需約 95% 才能阻斷傳播；季節性流感的門檻低得多。⚠️ 群體免疫保護的是【不能接種的人】—— 嬰兒、免疫缺損者。接種率不足時，最先受害的是他們，而不是選擇不接種的人。`,
       `Vaccination rate = $${vaccinated} \\div ${population} \\times 100\\% = ${pct}\\%$. The herd-immunity threshold depends on how transmissible the disease is: measles is so infectious that about 95% is needed to stop spread, while seasonal influenza sits far lower. NOTE herd immunity protects THOSE WHO CANNOT BE VACCINATED — infants and the immunocompromised. When coverage falls short they are harmed first, not those who declined.`])
  }
}

// SK2 — 藥物劑量：每日總劑量 = 單次劑量 × 每日次數
for (const dose of [125, 250, 375, 500, 750, 1000]) {
  for (const times of [2, 3, 4]) {
    for (const days of [3, 5, 7, 14]) {
      const totalMg = dose * times * days
      const d = distract(totalMg, [dose * times, dose * days, times * days])
      if (d.length < 3) continue
      b.add(`hmb2_sk2_${dose}_${times}_${days}`, T.skills, FW.apply, 'medium',
        [`一名長者的處方為每次 ${dose} 毫克、每日 ${times} 次、服用 ${days} 日。整個療程合共服用多少毫克？`,
         `A prescription reads ${dose} mg per dose, ${times} times daily, for ${days} days. What is the total dose over the whole course, in mg?`],
        [qty(totalMg, '毫克', 'mg'), ...d.map((v) => qty(v, '毫克', 'mg'))],
        [`總劑量 = $${dose} \\times ${times} \\times ${days} = ${totalMg}$ 毫克。⚠️ 照顧者最常見的用藥錯誤不是算錯總量，而是【自行停藥】：症狀消失就停，療程未完。抗生素尤其如此 —— 未殺盡的細菌會留下抗藥性較強的一群，下次再病就更難治。療程訂為 ${days} 日，就是 ${days} 日。`,
         `Total dose = $${dose} \\times ${times} \\times ${days} = ${totalMg}$ mg. NOTE the commonest medication error among carers is not miscalculation but STOPPING EARLY once symptoms ease. With antibiotics this matters most — the bacteria that survive are the more resistant ones, and the next infection is harder to treat. A ${days}-day course means ${days} days.`])
    }
  }
}

// HO2 — 面向失衡：最弱一項與其餘平均之差
for (const others of [2, 2.5, 3, 3.5, 4, 4.5, 5]) {
  for (const weakest of [0, 0.25, 0.5, 1, 1.25, 1.5, 2, 2.5, 3, 3.5, 4]) {
    if (weakest >= others) continue
    const gap = Math.round((others - weakest) * 10) / 10
    const mean = Math.round(((others * 5 + weakest) / 6) * 100) / 100
    const d = distract(gap, [mean, others, weakest])
    if (d.length < 3) continue
    b.add(`hmb2_ho2_${String(others).replace('.', 'p')}_${String(weakest).replace('.', 'p')}`, T.holistic, FW.logic, 'hard',
      [`一次整全健康評估之中，六個面向有五項各得 ${others} 分，最弱的一項只得 ${weakest} 分（五分為滿分）。最弱一項與其餘各項相差多少分？`,
       `In a holistic health assessment five of the six dimensions each score ${others} while the weakest scores ${weakest}, out of five. By how many points does the weakest fall short of the others?`],
      [qty(gap, '分', ''), ...d.map((v) => qty(v, '分', ''))],
      [`差距 = $${others} - ${weakest} = ${gap}$ 分，而六項平均為 ${mean} 分。⚠️ 平均分 ${mean} 看似尚可，卻【完全看不出】有一項低至 ${weakest} 分。整全健康的六個面向互相影響：社交孤立會拖低情緒，情緒低落會影響生理。所以評估要找的是最弱一環，介入亦應從該環入手，而非平均地補足六項。`,
       `The gap is $${others} - ${weakest} = ${gap}$ points against a six-dimension mean of ${mean}. NOTE that a mean of ${mean} looks acceptable while REVEALING NOTHING about a dimension sitting at ${weakest}. The six dimensions interact: social isolation drags emotional health down, and low mood undermines physical health. Assessment therefore looks for the weakest link and intervention starts there, rather than topping up all six evenly.`])
  }
}

export const healthManagementBank3Questions: Question[] = b.bank
