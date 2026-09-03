import type { Question } from './types'
import { createBank, qty, type TopicMeta, type FwMeta } from './_parametric'

// ═══════════════════════════════════════════════════════════════════════════
// history-bank.ts —— 歷史參數化母模板・第一批（2026-09-03）
// ---------------------------------------------------------------------------
// 本科現為 MC 206 條、分佈 6–20，十四個課題全部遠低於每課題 71 的目標。
//
// ⚠️ 本檔的出題原則與其餘各科不同，必須先講清楚 ══════════════════════
//
// 歷史科不可以用參數化「生成史實」—— 憲章 §8 禁虛構數據，而一條由迴圈
// 生成的「某年某國死傷 X 人」就是虛構，即使數字看似合理。
//
// 故本檔一律採用同一結構：
//   【史實由題幹提供】→【學生據此推算或推理】→【解析教史學方法】
//
// 題目考的是「給定這些資料，可以推出甚麼」，而不是「你記不記得那個數字」。
// 這樣參數化的是【推理情境】而非【史實】，一條虛構的史實都不會產生。
//
// 這個做法同時貼合本科三個方法型課題（因果分析、影響評價、史料判讀）——
// 它們本來考的就是方法，不是記憶。
//
// ⚠️ 六條累積教訓（同日九役）：
//   ① 誘答不可代數上恆等 ② 迴圈變數必須出現在題幹
//   ③ 補量用值域寬的數值參數 ④ 迴圈相乘，三層各加一值即八倍
//   ⑤ 改完即量度 ⑥ 模板組合空間封頂時要加模板而非取值
// ═══════════════════════════════════════════════════════════════════════════

const T = {
  cause: { id: 'hist_causation', zh: '因果分析・導火線與根源', en: 'Causation — trigger vs root cause' },
  sig: { id: 'hist_significance', zh: '影響與意義評價', en: 'Significance & evaluation' },
  src: { id: 'hist_source', zh: '史料判讀', en: 'Source analysis' },
  hkMod: { id: 'hk_mod', zh: '香港的現代化與蛻變', en: 'Modernisation and Transformation of Hong Kong' },
  seasia: { id: 'seasia', zh: '東南亞：由殖民地到獨立國家', en: 'Southeast Asia: From Colonies to Independent Countries' },
  postwar: { id: 'postwar_conflicts', zh: '戰後衝突與聯合國', en: 'Post-war Conflicts and the United Nations' },
  region: { id: 'hk_seasia', zh: '香港與東南亞', en: 'Hong Kong & Southeast Asia' },
  dictators: { id: 'dictatorship', zh: '極權主義興起', en: 'Rise of Dictatorships' },
  ww1: { id: 'ww1', zh: '第一次世界大戰', en: 'The First World War' },
  cold: { id: 'cold_war', zh: '冷戰', en: 'The Cold War' },
  japan: { id: 'japan_mod', zh: '日本現代化', en: 'Modernisation of Japan' },
  ww2: { id: 'ww2', zh: '第二次世界大戰', en: 'The Second World War' },
  china: { id: 'china_mod', zh: '中國現代化', en: 'Modernisation of China' },
  intl: { id: 'intl_coop', zh: '國際合作', en: 'International Cooperation' },
} satisfies Record<string, TopicMeta>

const FW = {
  logic: { id: 'logic', zh: '邏輯推理', en: 'Logical Reasoning', emoji: '🧠' },
  apply: { id: 'apply', zh: '應用分析', en: 'Application', emoji: '🛠️' },
} satisfies Record<string, FwMeta>

const b = createBank('history')

const distract = (correct: number, cands: number[]): number[] =>
  cands.filter((v, i, a) => v !== correct && a.indexOf(v) === i).slice(0, 3)

// ── 因果分析・導火線與根源 ────────────────────────────────────────────────

// CA1 — 根源與導火線的時間距離
for (const rootYear of [1870, 1878, 1882, 1890, 1900, 1905, 1910]) {
  for (const triggerYear of [1911, 1912, 1914, 1919, 1929, 1931, 1933, 1937, 1939]) {
    if (triggerYear <= rootYear) continue
    const gap = triggerYear - rootYear
    if (gap < 4) continue
    const d = distract(gap, [rootYear, triggerYear, triggerYear + rootYear])
    if (d.length < 3) continue
    b.add(`hisb_ca1_${rootYear}_${triggerYear}`, T.cause, FW.logic, 'medium',
      [`一份教科書把某場戰爭的【根源】定在 ${rootYear} 年的一項結構性變化，把【導火線】定在 ${triggerYear} 年的一宗突發事件。兩者相隔多少年？`,
       `A textbook dates the ROOT CAUSE of a war to a structural change in ${rootYear} and its TRIGGER to a sudden event in ${triggerYear}. How many years apart are they?`],
      [qty(gap, '年', 'years'), ...d.map((v) => qty(v, '年', 'years'))],
      [`$${triggerYear} - ${rootYear} = ${gap}$ 年。這 ${gap} 年正是理解因果的關鍵：【導火線】只解釋戰爭為何在那一刻爆發，【根源】才解釋為何早已具備爆發的條件。把兩者混為一談，會得出「若無那宗事件便無戰爭」這個站不住的結論 —— 因為結構性條件仍在，換一宗事件一樣會引爆。答題時必須分開處理這兩層。`,
       `$${triggerYear} - ${rootYear} = ${gap}$ years. Those ${gap} years are the crux of causal reasoning: the TRIGGER explains only why war broke out at that moment, while the ROOT CAUSE explains why the conditions for war were already in place. Conflating them yields the untenable claim that without that one event there would have been no war — the structural conditions remained, and another spark would have served. Answers must keep the two layers apart.`])
  }
}

// CA2 — 多因分析：各因素所佔權重
for (const factors of [3, 4, 5, 6]) {
  for (const topPct of [30, 35, 40, 45, 50, 60]) {
    const rest = 100 - topPct
    const others = factors - 1
    const each = rest / others
    if (!Number.isInteger(each)) continue
    const d = distract(each, [topPct, rest, factors])
    if (d.length < 3) continue
    b.add(`hisb_ca2_${factors}_${topPct}`, T.cause, FW.apply, 'hard',
      [`一位史家把某事件歸因於 ${factors} 項因素，其中最主要一項佔 ${topPct}% 的解釋力，其餘 ${others} 項平均分配剩餘部分。每項次要因素佔多少百分比？`,
       `A historian attributes an event to ${factors} factors, the chief one carrying ${topPct}% of the explanatory weight and the remaining ${others} sharing the rest equally. What percentage does each secondary factor carry?`],
      [qty(each, '%', '%'), ...d.map((v) => qty(v, '%', '%'))],
      [`剩餘 $100\\% - ${topPct}\\% = ${rest}\\%$，分予 ${others} 項，每項 $${rest} \\div ${others} = ${each}\\%$。⚠️ 這種百分比【只是表達重點的方式，不是可量度的事實】—— 歷史因果無法像實驗那樣分離變項。史家給出權重，是在陳述一個【可被質疑的判斷】，而評卷要求的正是說明為何如此排序，不是背誦排序本身。`,
       `The remainder is $100\\% - ${topPct}\\% = ${rest}\\%$ shared by ${others} factors, giving $${rest} \\div ${others} = ${each}\\%$ each. NOTE such percentages are A WAY OF EXPRESSING EMPHASIS, NOT MEASURABLE FACT — historical causation cannot isolate variables as an experiment can. A historian assigning weights is stating a CONTESTABLE JUDGEMENT, and what marks demand is the reasoning behind the ordering, never the ordering itself.`])
  }
}

// ── 影響與意義評價 ────────────────────────────────────────────────────────

// SG1 — 短期與長期影響的時間界線
for (const eventYear of [1911, 1919, 1929, 1937, 1945, 1949, 1966, 1978, 1989, 1997]) {
  for (const span of [3, 5, 10, 20, 30, 40, 50]) {
    const endYear = eventYear + span
    if (endYear > 2026) continue
    const d = distract(endYear, [eventYear, span, eventYear - span])
    if (d.length < 3) continue
    b.add(`hisb_sg1_${eventYear}_${span}`, T.sig, FW.apply, 'easy',
      [`一項研究把某 ${eventYear} 年事件的影響分為短期與長期，並以事件後 ${span} 年為分界。該分界落在哪一年？`,
       `A study divides the impact of an event of ${eventYear} into short and long term, setting the boundary ${span} years after the event. In which year does the boundary fall?`],
      [qty(endYear, '年', ''), ...d.map((v) => qty(v, '年', ''))],
      [`$${eventYear} + ${span} = ${endYear}$ 年。⚠️ 這條界線【由研究者自行劃定】，並非史實本身具有的性質。同一事件用五年與用五十年去看，結論可以完全相反 —— 短期看似災難的，長期可能是制度轉型的起點；短期看似勝利的，長期可能埋下下一場衝突。所以評價影響時，必須先交代【用甚麼時間尺度】。`,
       `$${eventYear} + ${span} = ${endYear}$. NOTE this boundary is SET BY THE RESEARCHER and is not a property of the past itself. Viewed over five years or over fifty, the same event can yield opposite conclusions — what looks like catastrophe in the short run may begin institutional change, and what looks like victory may seed the next conflict. Any evaluation of impact must therefore state the TIME SCALE it uses.`])
  }
}

// ── 史料判讀 ──────────────────────────────────────────────────────────────

// SR1 — 史料成書年與事件年的距離
for (const eventYear of [1839, 1894, 1911, 1919, 1937, 1945, 1949]) {
  for (const writtenGap of [0, 1, 2, 5, 8, 10, 15, 20, 30, 50, 80]) {
    const written = eventYear + writtenGap
    if (written > 2026) continue
    const d = distract(writtenGap, [eventYear, written, written + eventYear])
    if (d.length < 3) continue
    b.add(`hisb_sr1_${eventYear}_${writtenGap}`, T.src, FW.logic, 'medium',
      [`一份史料記述 ${eventYear} 年發生的事，而該史料寫成於 ${written} 年。史料成書距事件多少年？`,
       `A source describes events of ${eventYear} and was written in ${written}. How many years after the events was it composed?`],
      [qty(writtenGap, '年', 'years'), ...d.map((v) => qty(v, '年', 'years'))],
      [`$${written} - ${eventYear} = ${writtenGap}$ 年。⚠️ 時間距離【本身不決定可靠性】。${writtenGap <= 2 ? '當時寫成的記述細節鮮明，但作者身處其中，未必看得見全局，亦可能有即時的利害考量。' : writtenGap >= 30 ? '事後多年寫成的記述可以綜觀全局，但記憶會重整，而且作者已知道結局，容易把偶然寫成必然。' : '事隔數年寫成的記述在細節與距離之間，兩種偏差都可能存在。'}判讀史料要問的從來是四件事：誰寫、寫給誰、為何而寫、寫作時知道甚麼。`,
       `$${written} - ${eventYear} = ${writtenGap}$ years. NOTE that distance in time DOES NOT BY ITSELF DETERMINE RELIABILITY. ${writtenGap <= 2 ? 'An account written at the time is vivid in detail, but its author stood inside events, may not have seen the whole, and had immediate interests at stake.' : writtenGap >= 30 ? 'An account written decades later can survey the whole, but memory reorganises, and an author who knows the ending readily turns contingency into inevitability.' : 'An account written a few years on sits between detail and distance, and either bias may be present.'} Reading a source always asks the same four things: who wrote it, for whom, to what end, and what they knew at the time.`])
  }
}

// ── 第一次世界大戰 ────────────────────────────────────────────────────────

// W1 — 戰爭持續時間（由題幹提供起訖）
for (const start of [1911, 1912, 1913, 1914, 1915, 1916, 1917]) {
  for (const end of [1917, 1918, 1919, 1920, 1921, 1922, 1923, 1925]) {
    if (end <= start) continue
    const months = (end - start) * 12
    const d = distract(months, [end - start, start, end])
    if (d.length < 3) continue
    b.add(`hisb_w1_${start}_${end}`, T.ww1, FW.apply, 'easy',
      [`一場戰事由 ${start} 年某月持續至 ${end} 年同月。以整年計，該戰事歷時多少個月？`,
       `A campaign runs from a month in ${start} to the same month in ${end}. Counting whole years, how many months did it last?`],
      [qty(months, '個月', 'months'), ...d.map((v) => qty(v, '個月', 'months'))],
      [`$(${end} - ${start}) \\times 12 = ${months}$ 個月。第一次世界大戰之所以被稱為現代戰爭的分水嶺，關鍵不在長度而在【性質】：工業化生產令戰爭可以持續數年而不崩潰，鐵路與徵兵制令整個社會被動員。戰爭由「軍隊之間的事」變成「國家之間的總體戰」，這個轉變比任何一場戰役都重要。`,
       `$(${end} - ${start}) \\times 12 = ${months}$ months. What made the First World War a watershed was not its length but its CHARACTER: industrial production let war continue for years without collapse, while railways and conscription mobilised whole societies. War shifted from an affair between armies to total war between nations, and that shift matters more than any single battle.`])
  }
}

// ── 極權主義興起 ──────────────────────────────────────────────────────────

// DI1 — 選舉席次與過半門檻
for (const seats of [300, 400, 450, 500, 600, 640, 700]) {
  for (const wonPct of [25, 30, 33, 37, 40, 44, 48]) {
    const won = Math.round((seats * wonPct) / 100)
    const majority = Math.floor(seats / 2) + 1
    const shortBy = majority - won
    if (shortBy <= 0) continue
    const d = distract(shortBy, [won, majority, seats - won])
    if (d.length < 3) continue
    b.add(`hisb_di1_${seats}_${wonPct}`, T.dictators, FW.logic, 'hard',
      [`一個議會共 ${seats} 席，某黨取得 ${wonPct}%（即 ${won} 席）。距離單獨過半（${majority} 席）尚欠多少席？`,
       `A parliament has ${seats} seats and a party wins ${wonPct}% of them, that is ${won}. How many seats short of an outright majority of ${majority} is it?`],
      [qty(shortBy, '席', 'seats'), ...d.map((v) => qty(v, '席', 'seats'))],
      [`尚欠 $${majority} - ${won} = ${shortBy}$ 席。⚠️ 極權政體的興起【往往不是靠選舉取得多數】，而是靠在未過半的情況下取得組閣權，再以行政手段逐步取消制衡：緊急權力、政黨禁令、新聞管制。所以研究極權興起要看的不是得票率，而是【制度上有哪些關卡失守】，以及為何當時的政治精英認為可以控制局面。`,
       `The shortfall is $${majority} - ${won} = ${shortBy}$ seats. NOTE that authoritarian regimes typically arise WITHOUT WINNING A MAJORITY: they secure office short of one, then dismantle the checks by administrative means — emergency powers, bans on parties, control of the press. Studying their rise therefore means examining WHICH INSTITUTIONAL SAFEGUARDS GAVE WAY, and why the political elite of the day believed the situation could be managed.`])
  }
}

// ── 第二次世界大戰 ────────────────────────────────────────────────────────

// W2 — 佔領期長度
for (const from of [1931, 1933, 1935, 1937, 1938, 1939, 1940, 1941, 1942]) {
  for (const to of [1943, 1944, 1945, 1946, 1947, 1948, 1949]) {
    if (to <= from) continue
    const years = to - from
    const d = distract(years, [from, to, from + to])
    if (d.length < 3) continue
    b.add(`hisb_w2_${from}_${to}`, T.ww2, FW.apply, 'easy',
      [`一份年表記載某地由 ${from} 年被佔領至 ${to} 年結束。佔領期歷時多少年？`,
       `A chronology records a territory under occupation from ${from} until ${to}. How many years did the occupation last?`],
      [qty(years, '年', 'years'), ...d.map((v) => qty(v, '年', 'years'))],
      [`$${to} - ${from} = ${years}$ 年。研究佔領期不能只數年份 —— 同樣是 ${years} 年，行政體制被完全取代、抑或保留原有官僚而換上新的頂層，戰後的重建路徑會完全不同。前者要從零重建制度，後者則面對「原有人員是否清算」這個更棘手的問題。`,
       `$${to} - ${from} = ${years}$ years. Studying an occupation means more than counting years — over the same ${years} years, whether the administration was wholly replaced or the existing bureaucracy retained under new leadership sets entirely different paths for post-war reconstruction. The first must rebuild institutions from nothing; the second faces the harder question of whether to purge those who stayed.`])
  }
}

// ── 冷戰 ──────────────────────────────────────────────────────────────────

// CW1 — 對峙年期與世代
for (const start of [1943, 1944, 1945, 1946, 1947, 1948, 1949, 1950]) {
  for (const end of [1985, 1987, 1989, 1990, 1991, 1993]) {
    const years = end - start
    const generations = Math.round(years / 25)
    const d = distract(years, [generations, start, end])
    if (d.length < 3) continue
    b.add(`hisb_cw1_${start}_${end}`, T.cold, FW.apply, 'medium',
      [`一份研究把某段兩極對峙由 ${start} 年計至 ${end} 年。該段對峙歷時多少年？`,
       `A study dates a period of bipolar confrontation from ${start} to ${end}. How many years did it last?`],
      [qty(years, '年', 'years'), ...d.map((v) => qty(v, '年', 'years'))],
      [`$${end} - ${start} = ${years}$ 年，約 ${generations} 個世代。⚠️ 起訖年份【本身就是一個論點】：把起點定在戰爭結束抑或定在某項政策宣布，反映的是研究者認為對峙由何而起。同理，終點定在圍牆倒下抑或定在國家解體，反映的是他認為對峙結束於象徵事件抑或制度終結。看見不同教科書給出不同年份，第一個問題應該是「他為甚麼這樣劃」。`,
       `$${end} - ${start} = ${years}$ years, roughly ${generations} generations. NOTE the start and end dates ARE THEMSELVES AN ARGUMENT: placing the start at the end of a war or at a policy announcement reveals what the writer thinks began the confrontation, just as ending it at a wall's fall or at a state's dissolution reveals whether they see the close as symbolic or institutional. When textbooks disagree on dates, the first question is why each drew the line where it did.`])
  }
}

// ── 中國現代化 ────────────────────────────────────────────────────────────

// CM1 — 改革階段的年期
for (const start of [1860, 1885, 1898, 1911, 1919, 1949, 1978]) {
  for (const span of [3, 10, 12, 15, 20, 30, 40]) {
    const end = start + span
    if (end > 2026) continue
    const d = distract(span, [start, end, end - 1900])
    if (d.length < 3) continue
    b.add(`hisb_cm1_${start}_${span}`, T.china, FW.apply, 'easy',
      [`一份年表把某項改革由 ${start} 年計至 ${end} 年。該階段歷時多少年？`,
       `A chronology dates a reform programme from ${start} to ${end}. How many years does the phase span?`],
      [qty(span, '年', 'years'), ...d.map((v) => qty(v, '年', 'years'))],
      [`$${end} - ${start} = ${span}$ 年。評價一項改革不能只看年期長短，要看【改甚麼層次】：器物層（技術、裝備）、制度層（法制、組織）、觀念層（教育、思想）。只改器物而不動制度，往往在遇上真正考驗時失效 —— 這是理解近代中國多次改革成敗的一條主線。`,
       `$${end} - ${start} = ${span}$ years. Judging a reform means asking not how long it ran but WHAT LEVEL IT CHANGED: material (technology and equipment), institutional (law and organisation), or intellectual (education and ideas). Reform confined to the material while institutions stay untouched tends to fail its first real test — a thread running through the successes and failures of modern Chinese reform.`])
  }
}

// ── 日本現代化 ────────────────────────────────────────────────────────────

// JM1 — 現代化速度：年均增長
for (const before of [100, 150, 200, 250]) {
  for (const after of [300, 500, 800, 1000]) {
    for (const years of [20, 25, 40, 50]) {
      const growth = Math.round(((after - before) / years) * 10) / 10
      const d = distract(growth, [after - before, years, before])
      if (d.length < 3) continue
      b.add(`hisb_jm1_${before}_${after}_${years}`, T.japan, FW.apply, 'medium',
        [`一份統計顯示某項工業指標由 ${before} 單位在 ${years} 年間升至 ${after} 單位。年均增加多少單位？`,
         `A statistic shows an industrial index rising from ${before} to ${after} units over ${years} years. What is the average annual increase, in units?`],
        [qty(growth, '單位', 'units'), ...d.map((v) => qty(v, '單位', 'units'))],
        [`年均 = $(${after} - ${before}) \\div ${years} = ${growth}$ 單位。⚠️ 年均值【假設增長平均分佈】，而現代化幾乎從不如此：初期投入基礎建設而產出未見，中期加速，後期放緩。把年均值當成每年實況，會錯過最關鍵的問題 —— 加速是在哪一段發生，以及那一段有甚麼制度條件在配合。`,
         `Annual average = $(${after} - ${before}) \\div ${years} = ${growth}$ units. NOTE an average ASSUMES EVEN GROWTH, which modernisation almost never shows: early years pour into infrastructure with little output, the middle accelerates, the late years slow. Reading the average as the annual reality misses the question that matters — when the acceleration happened, and what institutional conditions accompanied it.`])
    }
  }
}

// ── 國際合作 ──────────────────────────────────────────────────────────────

// IC1 — 成員國數目與表決門檻
for (const members of [12, 15, 18, 20, 24, 30, 36, 40, 45, 48, 50, 60, 72, 75, 90, 100, 120, 150, 180, 190]) {
  for (const thresholdPct of [50, 60, 66, 75]) {
    const needed = Math.ceil((members * thresholdPct) / 100)
    const d = distract(needed, [members, thresholdPct, members - needed])
    if (d.length < 3) continue
    b.add(`hisb_ic1_${members}_${thresholdPct}`, T.intl, FW.apply, 'medium',
      [`一個國際組織有 ${members} 個成員國，通過議案須取得 ${thresholdPct}% 成員支持。最少須有多少國支持？`,
       `An international organisation of ${members} members requires ${thresholdPct}% support to pass a motion. What is the minimum number of members needed?`],
      [qty(needed, '國', 'members'), ...d.map((v) => qty(v, '國', 'members'))],
      [`$${members} \\times ${thresholdPct}\\% = ${(members * thresholdPct) / 100}$，票數不能是小數，故【向上取整】為 ${needed} 國。⚠️ 表決門檻的高低是一種取捨：門檻低則決議易通過而易被多數強加於少數，門檻高則保障小國而容易陷入僵局。國際組織的成效，往往不取決於它有多少成員，而取決於【最強的成員願不願意受它約束】。`,
       `$${members} \\times ${thresholdPct}\\% = ${(members * thresholdPct) / 100}$, and votes cannot be fractional, so ROUND UP to ${needed}. NOTE the threshold embodies a trade-off: a low bar passes resolutions easily but lets a majority impose on a minority, while a high bar protects small states and invites deadlock. What determines an international body's effectiveness is rarely its membership size but WHETHER ITS STRONGEST MEMBERS ACCEPT ITS CONSTRAINTS.`])
  }
}

// ── 香港的現代化與蛻變 ────────────────────────────────────────────────────

// HK1 — 人口增長與住屋需求
for (const popK of [600, 800, 900, 1000, 1200, 1500, 1600, 1800, 2000, 2400, 2500, 3000, 3600, 4000, 4500, 5000, 6000, 7200]) {
  for (const perFlat of [2, 3, 4, 5, 6]) {
    const flats = popK / perFlat
    if (!Number.isInteger(flats)) continue
    const d = distract(flats, [popK, perFlat, popK * perFlat])
    if (d.length < 3) continue
    b.add(`hisb_hk1_${popK}_${perFlat}`, T.hkMod, FW.apply, 'medium',
      [`一份規劃文件假設某地 ${popK} 千人口，平均每個住宅單位居住 ${perFlat} 人。按此假設須提供多少千個單位？`,
       `A planning document assumes a population of ${popK} thousand with an average of ${perFlat} persons per dwelling. How many thousand dwellings must be provided?`],
      [qty(flats, '千個', 'thousand'), ...d.map((v) => qty(v, '千個', 'thousand'))],
      [`$${popK} \\div ${perFlat} = ${flats}$ 千個單位。⚠️ 這條算式的假設本身就是政策：把每戶人數定在 ${perFlat} 人，等於預設了家庭結構不變。若家庭規模下降（子女減少、獨居增加），同樣人口需要的單位數會【上升】—— 用舊假設規劃新人口，是住屋供應長期落後的常見成因之一。`,
       `$${popK} \\div ${perFlat} = ${flats}$ thousand dwellings. NOTE the assumption is itself a policy: fixing household size at ${perFlat} presumes family structure will not change. If households shrink through fewer children and more single occupancy, the same population needs MORE dwellings — planning new populations on old assumptions is a standard reason housing supply falls behind.`])
  }
}

// ── 東南亞：由殖民地到獨立國家 ────────────────────────────────────────────

// SE1 — 殖民統治年期
for (const colonised of [1511, 1596, 1619, 1786, 1819, 1824, 1858, 1898]) {
  for (const independent of [1945, 1946, 1947, 1949, 1954, 1957, 1963, 1965, 1975, 1984]) {
    const years = independent - colonised
    if (years < 50) continue
    const d = distract(years, [colonised, independent, Math.round(years / 100)])
    if (d.length < 3) continue
    b.add(`hisb_se1_${colonised}_${independent}`, T.seasia, FW.apply, 'easy',
      [`一份年表記載某地由 ${colonised} 年起被外來勢力管治，至 ${independent} 年獨立。該段管治歷時多少年？`,
       `A chronology records a territory under foreign rule from ${colonised} until independence in ${independent}. How many years did that rule last?`],
      [qty(years, '年', 'years'), ...d.map((v) => qty(v, '年', 'years'))],
      [`$${independent} - ${colonised} = ${years}$ 年。⚠️ 獨立【不等於】殖民影響隨即結束：邊界的劃法、行政語言、教育制度、經濟作物的單一化，往往在獨立後仍然決定着國家的走向數十年。研究去殖民化，要問的是【哪些結構被保留下來】，而不只是政權何時易手。`,
       `$${independent} - ${colonised} = ${years}$ years. NOTE independence does NOT end colonial influence at a stroke: how borders were drawn, which language administers, how schooling is organised and how far the economy depends on a single crop continue to shape a country for decades afterwards. Studying decolonisation asks WHICH STRUCTURES SURVIVED, not merely when authority changed hands.`])
  }
}

// ── 戰後衝突與聯合國 ──────────────────────────────────────────────────────

// PW1 — 維持和平部隊的派遣規模
for (const troopsK of [2, 3, 5, 6, 8, 10, 12, 15, 20, 24, 30]) {
  for (const countries of [4, 5, 6, 8, 10, 12, 15, 20]) {
    const per = (troopsK * 1000) / countries
    if (!Number.isInteger(per)) continue
    const d = distract(per, [troopsK, countries, troopsK * countries])
    if (d.length < 3) continue
    b.add(`hisb_pw1_${troopsK}_${countries}`, T.postwar, FW.apply, 'medium',
      [`一支維持和平部隊共 ${troopsK} 千人，由 ${countries} 個國家平均派出。每國派出多少人？`,
       `A peacekeeping force of ${troopsK} thousand is contributed equally by ${countries} countries. How many personnel does each provide?`],
      [qty(per, '人', 'personnel'), ...d.map((v) => qty(v, '人', 'personnel'))],
      [`$${troopsK * 1000} \\div ${countries} = ${per}$ 人。⚠️ 維持和平行動的成效【不取決於人數】，而取決於三件事：是否取得衝突各方同意、任務授權是否清晰、以及有否政治解決方案在推進。缺了第三項，部隊只能凍結衝突而無法終止它 —— 這也是為何有些行動一駐就是數十年。`,
       `$${troopsK * 1000} \\div ${countries} = ${per}$ personnel. NOTE the effectiveness of peacekeeping does NOT rest on numbers but on three conditions: the consent of the parties, a clear mandate, and a political settlement being pursued alongside. Without the third, a force can only freeze a conflict rather than end it — which is why some deployments have lasted decades.`])
  }
}

// ── 香港與東南亞 ──────────────────────────────────────────────────────────

// RG1 — 轉口貿易比重
for (const reExport of [40, 50, 60, 75, 80, 90, 100, 120, 150]) {
  for (const total of [100, 120, 150, 200, 240, 250, 300]) {
    if (reExport > total) continue
    const pct = Math.round((reExport / total) * 1000) / 10
    const d = distract(pct, [reExport, total - reExport, Math.round((total / reExport) * 10) / 10])
    if (d.length < 3) continue
    b.add(`hisb_rg1_${reExport}_${total}`, T.region, FW.apply, 'medium',
      [`一份貿易統計顯示某港口總出口 ${total} 億元，其中轉口佔 ${reExport} 億元。轉口佔總出口的百分比為多少？`,
       `Trade figures show a port with total exports of ${total} × 10⁸ of which ${reExport} × 10⁸ are re-exports. What percentage of exports are re-exports?`],
      [qty(pct, '%', '%'), ...d.map((v) => qty(v, '%', '%'))],
      [`轉口佔 $${reExport} \\div ${total} \\times 100\\% = ${pct}\\%$。轉口貿易的特點是【依賴他人的生產與他人的市場】：本地提供的是航運、金融、法律與資訊等服務。這種角色在區域貿易暢通時利潤豐厚，一旦上游改為直接對接下游，中介的位置就會被繞過 —— 所以轉口港的長期策略，往往是把中介服務升級為不可替代的專業服務。`,
       `Re-exports are $${reExport} \\div ${total} \\times 100\\% = ${pct}\\%$ of exports. Entrepôt trade depends on OTHERS' PRODUCTION AND OTHERS' MARKETS, with the port supplying shipping, finance, law and information. The role is lucrative while regional trade flows through it, but once upstream connects directly to downstream the intermediary is bypassed — which is why entrepôts' long-term strategy is usually to upgrade intermediation into professional services that cannot be routed around.`])
  }
}

export const historyBank1Questions: Question[] = b.bank
