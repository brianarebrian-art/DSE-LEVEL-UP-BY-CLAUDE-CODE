import type { Question } from './types'
import { createBank, qty, type TopicMeta, type FwMeta } from './_parametric'

// ═══════════════════════════════════════════════════════════════════════════
// visual-arts-bank2.ts —— 視覺藝術參數化母模板・第二批（2026-09-03）
// ---------------------------------------------------------------------------
// 本科現為 222 條、分佈 16–37（2.3 倍）。分佈不算失衡，問題純在總量 ——
// 十個課題全部低於每課題 100 的目標，故為全部十個出題。
//
// 視覺藝術是本輪至今最「不像可以計算」的科目，但可 correct-by-construction
// 的部分仍然存在：色相環角度、構圖比例、透視消失點、畫幅比例、
// 展期與展品數、修復時數、版數與版畫編號、色階與明度層級。
// 關鍵在於：問的是【可由規則推出唯一答案】的事，而不是審美判斷。
//
// ⚠️ 六條累積教訓（同日八役），開工前先寫下：
//   ① 誘答必須互不相同【且代數上不恆等】（ICT DC2、生物 GE2）。
//   ② 每個迴圈變數【必須出現在題幹】（音樂 HA1）。
//   ③ 補量用值域寬的數值參數，不要用固定枚舉表（音樂第一版只出 152 條）。
//   ④ 迴圈相乘：三層各加一值即八倍，不是加三。
//   ⑤ 改完即量度，不要改完九個才跑一次（旅遊與款待 380 → 1049）。
//   ⑥ 一個模板的組合空間有上限時，要加的是【模板】而不是取值
//      （健康管理 care_skills 12 條、hm_holistic_concept 9 條，
//        擴闊迴圈補不了，各加一個新模板才解決）。
// ═══════════════════════════════════════════════════════════════════════════

const T = {
  formal: { id: 'va_formal_analysis', zh: '形式分析・元素與原則', en: 'Formal analysis — elements & principles' },
  history: { id: 'va_history_context', zh: '藝術史・技法與風格', en: 'Art history — technique & style' },
  context: { id: 'art_context', zh: '藝術與文化', en: 'Art & Culture' },
  media: { id: 'media_techniques', zh: '媒材與技法', en: 'Media & Techniques' },
  modern: { id: 'modern_contemporary', zh: '現代與當代藝術', en: 'Modern & Contemporary Art' },
  elements: { id: 'elements_principles', zh: '藝術元素與原則', en: 'Elements & Principles' },
  western: { id: 'western_art', zh: '西方藝術', en: 'Western Art' },
  appreciation: { id: 'art_appreciation', zh: '藝術評賞', en: 'Art Appreciation' },
  chinese: { id: 'chinese_art', zh: '中國藝術', en: 'Chinese Art' },
  design: { id: 'visual_design', zh: '視覺設計', en: 'Visual Design' },
} satisfies Record<string, TopicMeta>

const FW = {
  logic: { id: 'logic', zh: '邏輯推理', en: 'Logical Reasoning', emoji: '🧠' },
  apply: { id: 'apply', zh: '應用分析', en: 'Application', emoji: '🛠️' },
} satisfies Record<string, FwMeta>

const b = createBank('visual-arts')

const distract = (correct: number, cands: number[]): number[] =>
  cands.filter((v, i, a) => v !== correct && a.indexOf(v) === i).slice(0, 3)

// ── 形式分析・元素與原則 ──────────────────────────────────────────────────

// FA1 — 色相環：互補色相距 180 度
for (const hue of [0, 10, 15, 20, 30, 40, 45, 50, 60, 70, 75, 80, 90, 100, 105, 110, 120, 130, 135, 140, 150, 160, 165, 170, 175, 195, 200, 205, 210, 220, 225, 230, 240, 250, 255, 260, 270, 280, 285, 290, 300, 310, 315, 320, 330, 340, 345, 350, 355]) {
  const complement = (hue + 180) % 360
  const d = distract(complement, [(hue + 90) % 360, (hue + 120) % 360, hue])
  if (d.length < 3) continue
  b.add(`vab2_fa1_${hue}`, T.formal, FW.logic, 'easy',
    [`在十二色相環上，某色位於 ${hue} 度。其【互補色】位於多少度？`,
     `On a twelve-part colour wheel a hue sits at ${hue} degrees. At how many degrees is its COMPLEMENT?`],
    [qty(complement, '度', 'degrees'), ...d.map((v) => qty(v, '度', 'degrees'))],
    [`互補色在色相環上相距 180 度：$${hue} + 180 = ${hue + 180}$${hue + 180 >= 360 ? `，超過 360 故減 360 得 ${complement}` : `，即 ${complement}`} 度。互補色並置時對比最強、互相襯托；混合時則互相抵消而趨向灰色。答 $${(hue + 120) % 360}$ 是【三等分】的位置，那是三原色式的配色關係，對比較柔和。`,
     `Complements lie 180 degrees apart: $${hue} + 180 = ${hue + 180}$${hue + 180 >= 360 ? `, which exceeds 360, so subtract for ${complement}` : `, that is ${complement}`} degrees. Placed side by side complements give maximum contrast and intensify each other; mixed, they cancel towards grey. Answering $${(hue + 120) % 360}$ is the TRIADIC position, a gentler relationship.`])
}

// FA2 — 三分法：分割線位置
for (const size of [300, 360, 450, 540, 600, 720, 750, 810, 900, 990, 1050, 1200, 1350, 1500, 1650, 1800, 1950, 2100, 2400, 2700, 3000, 3300, 3600]) {
  const third = size / 3
  if (!Number.isInteger(third)) continue
  const d = distract(third, [size / 2, size / 4, size])
  if (d.length < 3) continue
  b.add(`vab2_fa2_${size}`, T.formal, FW.apply, 'easy',
    [`一幅畫寬 ${size} 像素，按三分法在畫面上劃出兩條縱向分割線。第一條分割線距左邊多少像素？`,
     `A picture ${size} pixels wide is divided by the rule of thirds into two vertical lines. How many pixels from the left edge does the first line fall?`],
    [qty(third, '像素', 'px'), ...d.map((v) => qty(v, '像素', 'px'))],
    [`第一條分割線在 $${size} \\div 3 = ${third}$ 像素處，第二條在 $${third * 2}$ 像素處。三分法的用意是【避開正中】：主體置於正中會令畫面靜止而缺乏張力，置於三分線則保留空間讓視線移動。答 $${size / 2}$ 正是正中，即三分法要避開的位置。`,
     `The first line falls at $${size} \\div 3 = ${third}$ px and the second at $${third * 2}$ px. The rule of thirds exists to AVOID DEAD CENTRE: a subject placed centrally stills the picture and drains its tension, while a third-line placement leaves room for the eye to travel. Answering $${size / 2}$ is exactly the centre the rule steers away from.`])
}

// ── 藝術史・技法與風格 ────────────────────────────────────────────────────

// HI1 — 作品距今年數
for (const year of [1420, 1500, 1550, 1600, 1650, 1700, 1780, 1850, 1880, 1900, 1920, 1950, 1970]) {
  for (const now of [2026]) {
    const age = now - year
    const d = distract(age, [year, now, Math.round(age / 100)])
    if (d.length < 3) continue
    b.add(`vab2_hi1_${year}`, T.history, FW.apply, 'easy',
      [`一件作品創作於 ${year} 年。至 ${now} 年，該作品距今多少年？`,
       `A work was created in ${year}. How many years old is it in ${now}?`],
      [qty(age, '年', 'years'), ...d.map((v) => qty(v, '年', 'years'))],
      [`$${now} - ${year} = ${age}$ 年。判別作品年代不是靠背年份，而是靠【技法特徵】：${year < 1500 ? '蛋彩、金箔底、平面化空間指向文藝復興之前' : year < 1600 ? '油彩、線性透視、明暗對照指向文藝復興盛期' : year < 1800 ? '強烈明暗與動態構圖指向巴洛克' : year < 1900 ? '外光、可見筆觸、瞬間光線指向印象派' : '拼貼、現成物、抽象化指向現代主義之後'}。年份是結論，技法才是證據。`,
       `$${now} - ${year} = ${age}$ years. Dating a work is not a matter of memorising years but of reading TECHNIQUE: ${year < 1500 ? 'tempera, gold ground and flattened space point before the Renaissance' : year < 1600 ? 'oil, linear perspective and chiaroscuro point to the High Renaissance' : year < 1800 ? 'strong contrasts and dynamic composition point to the Baroque' : year < 1900 ? 'open-air light, visible brushwork and captured instants point to Impressionism' : 'collage, found objects and abstraction point past Modernism'}. The year is the conclusion; the technique is the evidence.`])
  }
}

// ── 藝術與文化 ────────────────────────────────────────────────────────────

// CX1 — 展覽觀眾人次與日均
for (const totalK of [12, 18, 24, 30, 36, 48, 60, 72, 90, 120]) {
  for (const days of [10, 12, 15, 20, 24, 30, 40, 60]) {
    const perDay = (totalK * 1000) / days
    if (!Number.isInteger(perDay)) continue
    const d = distract(perDay, [totalK, days, totalK * days])
    if (d.length < 3) continue
    b.add(`vab2_cx1_${totalK}_${days}`, T.context, FW.apply, 'easy',
      [`一個展覽展期 ${days} 日，合共吸引 ${totalK} 千名觀眾。平均每日入場多少人？`,
       `An exhibition runs for ${days} days and draws ${totalK} thousand visitors in total. What is the average daily attendance?`],
      [qty(perDay, '人', 'people'), ...d.map((v) => qty(v, '人', 'people'))],
      [`平均每日 = $${totalK * 1000} \\div ${days} = ${perDay}$ 人。⚠️ 觀眾人次【不能量度展覽的價值】：一個十萬人次的話題展與一個五千人次的研究型展覽，服務的是不同目的。用人次評價博物館，會令機構傾向辦易入口的展覽而減少困難但必要的研究工作 —— 指標一旦成為目標，就會扭曲被量度的行為。`,
       `Daily average = $${totalK * 1000} \\div ${days} = ${perDay}$. NOTE attendance CANNOT measure an exhibition's worth: a blockbuster drawing a hundred thousand and a research display drawing five thousand serve different purposes. Judging museums by footfall pushes them towards accessible shows and away from difficult but necessary scholarship — once a measure becomes a target, it distorts the behaviour it measures.`])
  }
}

// ── 媒材與技法 ────────────────────────────────────────────────────────────

// ME1 — 版畫版數與編號
for (const edition of [10, 15, 20, 25, 30, 50, 60, 75, 100, 150, 200]) {
  for (const numberOn of [1, 3, 5, 8, 12, 20, 25, 40, 60]) {
    if (numberOn > edition) continue
    const remaining = edition - numberOn
    const d = distract(remaining, [edition, numberOn, edition + numberOn])
    if (d.length < 3) continue
    b.add(`vab2_me1_${edition}_${numberOn}`, T.media, FW.apply, 'easy',
      [`一套版畫的版數為 ${edition} 張，編號寫作「${numberOn}／${edition}」。這套版畫在該張之後還有多少張？`,
       `A print edition runs to ${edition} impressions and one is numbered "${numberOn}/${edition}". How many impressions follow it in the edition?`],
      [qty(remaining, '張', 'impressions'), ...d.map((v) => qty(v, '張', 'impressions'))],
      [`$${edition} - ${numberOn} = ${remaining}$ 張。版數編號的意義在於【限量】：版數印畢後版模須銷毀或劃記，以保證不再增印。⚠️ 編號在前【不代表】品質較好 —— 現代印製方法之下各張質素一致，編號只記錄次序。認為 1／${edition} 必然優於 ${edition}／${edition}，是市場心理而非技術事實。`,
       `$${edition} - ${numberOn} = ${remaining}$ impressions. Numbering exists to guarantee a LIMITED EDITION: once the run is complete the plate is destroyed or cancelled so no further impressions can be pulled. NOTE a low number does NOT mean better quality — modern printing gives consistent results across the run and the number records only sequence. Believing 1/${edition} must beat ${edition}/${edition} is market psychology, not a technical fact.`])
  }
}

// ── 現代與當代藝術 ────────────────────────────────────────────────────────

// MO1 — 裝置作品的展出空間
for (const length of [4, 5, 6, 7, 8, 9, 10, 12, 14, 15, 18, 20]) {
  for (const width of [3, 4, 5, 6, 7, 8, 10, 12]) {
    const area = length * width
    const d = distract(area, [length + width, 2 * (length + width), length])
    if (d.length < 3) continue
    b.add(`vab2_mo1_${length}_${width}`, T.modern, FW.apply, 'easy',
      [`一件裝置作品需要一個長 ${length} 米、闊 ${width} 米的展出空間。所需地面面積為多少平方米？`,
       `An installation requires a display space ${length} m long and ${width} m wide. What floor area is needed, in m²?`],
      [qty(area, '平方米', 'm²'), ...d.map((v) => qty(v, '平方米', 'm²'))],
      [`面積 = $${length} \\times ${width} = ${area}$ 平方米。答 $${2 * (length + width)}$ 是【周界】而非面積。裝置藝術與繪畫的根本分別正在於它佔用空間：觀眾要【走進去】而非站在前面看，所以作品的意義有一部分由觀眾在其中的移動路徑構成 —— 這也是它無法用一張照片完整呈現的原因。`,
       `Area = $${length} \\times ${width} = ${area}$ m². Answering $${2 * (length + width)}$ gives the PERIMETER, not the area. What separates installation from painting is precisely that it occupies space: the viewer walks INTO it rather than standing before it, so part of the work's meaning is made by the path the viewer takes through it — which is also why a single photograph can never fully represent it.`])
  }
}

// ── 藝術元素與原則 ────────────────────────────────────────────────────────

// EL1 — 明度階：由黑至白的層級
for (const steps of [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 15, 17, 19, 21, 25]) {
  const gaps = steps - 1
  const d = distract(gaps, [steps, steps + 1, Math.floor(steps / 2)])
  if (d.length < 3) continue
  b.add(`vab2_el1_${steps}`, T.elements, FW.logic, 'medium',
    [`一個明度階由純黑至純白共分 ${steps} 級。相鄰兩級之間共有多少個明度差？`,
     `A value scale runs from pure black to pure white in ${steps} steps. How many intervals lie between adjacent steps?`],
    [qty(gaps, '個', ''), ...d.map((v) => qty(v, '個', ''))],
    [`${steps} 級之間有 $${steps} - 1 = ${gaps}$ 個間距。明度階的級數愈多，過渡愈細膩但每級之間的分別愈難辨認 —— 這正是素描訓練通常由九級開始的原因：足以表現立體，又不至於細到分辨不出。答 $${steps}$ 是把級數當成間距，即經典的柵欄與柱問題。`,
     `With ${steps} steps there are $${steps} - 1 = ${gaps}$ intervals. More steps give smoother transitions but make each pair harder to tell apart — which is why drawing is usually taught on a nine-step scale: enough to model form without becoming indistinguishable. Answering $${steps}$ mistakes steps for intervals, the classic fencepost problem.`])
}

// ── 西方藝術 ──────────────────────────────────────────────────────────────

// WE1 — 線性透視：消失點與視平線
for (const points of [1, 2, 3]) {
  for (const boxes of [2, 3, 4, 5, 6, 8]) {
    const totalLines = points * boxes
    const d = distract(totalLines, [points + boxes, boxes, points])
    if (d.length < 3) continue
    b.add(`vab2_we1_${points}_${boxes}`, T.western, FW.logic, 'medium',
      [`一幅畫採用 ${points} 點透視，畫中有 ${boxes} 個立方體，每個立方體的每組平行邊都指向各自的消失點。這 ${boxes} 個立方體合共產生多少組指向消失點的線束？`,
       `A picture uses ${points}-point perspective and contains ${boxes} cubes, each set of parallel edges converging on its own vanishing point. How many convergent line-sets do the ${boxes} cubes produce in total?`],
      [qty(totalLines, '組', 'sets'), ...d.map((v) => qty(v, '組', 'sets'))],
      [`每個立方體產生 ${points} 組，共 $${points} \\times ${boxes} = ${totalLines}$ 組。${points === 1 ? '一點透視所有立方體共用同一個消失點，畫面正面感強而略顯呆板。' : points === 2 ? '兩點透視多用於表現物體的角部，空間感自然。' : '三點透視加入垂直方向的收斂，用於仰視或俯視的極端視角。'}⚠️ 消失點的數目取決於【立方體與畫面的角度】，不是取決於立方體的數目 —— 十個平行擺放的立方體仍然共用同一組消失點。`,
       `Each cube yields ${points} set(s), giving $${points} \\times ${boxes} = ${totalLines}$. ${points === 1 ? 'In one-point perspective all cubes share a single vanishing point, giving a frontal and somewhat static picture.' : points === 2 ? 'Two-point perspective shows objects cornerwise and reads most naturally.' : 'Three-point perspective adds vertical convergence for extreme views from below or above.'} NOTE the number of vanishing points depends on the ANGLE between cube and picture plane, not on how many cubes there are — ten cubes set parallel still share one set of points.`])
  }
}

// ── 藝術評賞 ──────────────────────────────────────────────────────────────

// AP1 — 四步評賞法所需時間分配
for (const total of [20, 24, 25, 28, 30, 32, 36, 40, 45, 48, 50, 60, 72, 75, 80, 90, 100]) {
  for (const describePct of [10, 12, 15, 20, 24, 25, 30, 32, 35, 36, 40, 45, 50, 60]) {
    const mins = (total * describePct) / 100
    if (!Number.isInteger(mins)) continue
    const d = distract(mins, [total, describePct, total - mins])
    if (d.length < 3) continue
    b.add(`vab2_ap1_${total}_${describePct}`, T.appreciation, FW.apply, 'medium',
      [`一節 ${total} 分鐘的評賞課按「描述、分析、詮釋、判斷」四步進行，其中描述佔 ${describePct}%。描述環節佔多少分鐘？`,
       `A ${total}-minute appreciation lesson follows the four steps of describe, analyse, interpret and judge, with description taking ${describePct}%. How many minutes go to description?`],
      [qty(mins, '分鐘', 'min'), ...d.map((v) => qty(v, '分鐘', 'min'))],
      [`描述環節 = $${total} \\times ${describePct}\\% = ${mins}$ 分鐘。四步的次序不可跳：【描述】只講看見甚麼（不加判斷），【分析】講元素如何組織，【詮釋】講可能的意義，【判斷】才作評價。跳過描述直接判斷，是評賞最常見的失誤 —— 因為所有判斷都必須有看得見的證據支撐，而證據就在描述那一步。`,
       `Description takes $${total} \\times ${describePct}\\% = ${mins}$ minutes. The four steps cannot be skipped: DESCRIBE states only what is visible without judgement, ANALYSE covers how the elements are organised, INTERPRET proposes possible meaning, and only JUDGE evaluates. Jumping straight to judgement is the commonest failure in appreciation — every judgement needs visible evidence behind it, and that evidence is gathered in the describing.`])
  }
}

// ── 中國藝術 ──────────────────────────────────────────────────────────────

// CH1 — 手卷長度與觀看段落
for (const lengthCm of [120, 160, 180, 240, 270, 300, 360, 420, 480, 540, 600, 660, 720, 780, 840, 900, 960, 1080, 1200]) {
  for (const sectionCm of [20, 30, 40, 60, 90, 120]) {
    const sections = lengthCm / sectionCm
    if (!Number.isInteger(sections)) continue
    const d = distract(sections, [lengthCm, sectionCm, lengthCm - sectionCm])
    if (d.length < 3) continue
    b.add(`vab2_ch1_${lengthCm}_${sectionCm}`, T.chinese, FW.apply, 'medium',
      [`一幅中國手卷長 ${lengthCm} 厘米。若觀看時每次展開 ${sectionCm} 厘米，須分多少段才能看完全卷？`,
       `A Chinese handscroll is ${lengthCm} cm long. Unrolled ${sectionCm} cm at a time, how many sections are needed to view it all?`],
      [qty(sections, '段', 'sections'), ...d.map((v) => qty(v, '段', 'sections'))],
      [`$${lengthCm} \\div ${sectionCm} = ${sections}$ 段。手卷的觀看方式決定了它的構圖邏輯：它【不是】一幅要一次看盡的畫，而是隨着展卷逐段推進的時間性經驗，故常見「移步換景」而非單一固定視點。把手卷掛起來整幅展示，其實違反了它原本的觀看設計。`,
       `$${lengthCm} \\div ${sectionCm} = ${sections}$ sections. How a handscroll is viewed governs how it is composed: it is NOT a picture to be taken in at once but a temporal experience unrolled section by section, which is why it shifts viewpoint as it advances rather than holding one fixed station. Hanging a handscroll open in full actually contradicts the way it was designed to be seen.`])
  }
}

// ── 視覺設計 ──────────────────────────────────────────────────────────────

// DE1 — 版面留白比例
for (const pageArea of [600, 720, 800, 900, 1000, 1200, 1440, 1500, 1800, 2000, 2400]) {
  for (const contentPct of [40, 50, 60, 65, 70, 75, 80]) {
    const white = (pageArea * (100 - contentPct)) / 100
    if (!Number.isInteger(white)) continue
    const d = distract(white, [(pageArea * contentPct) / 100, pageArea, contentPct])
    if (d.length < 3) continue
    b.add(`vab2_de1_${pageArea}_${contentPct}`, T.design, FW.apply, 'easy',
      [`一個版面總面積 ${pageArea} 平方厘米，內容區佔 ${contentPct}%。留白面積為多少平方厘米？`,
       `A layout of ${pageArea} cm² devotes ${contentPct}% to content. How many cm² are white space?`],
      [qty(white, '平方厘米', 'cm²'), ...d.map((v) => qty(v, '平方厘米', 'cm²'))],
      [`留白 = $${pageArea} \\times (100\\% - ${contentPct}\\%) = ${white}$ 平方厘米。留白【不是浪費】：它界定內容的邊界、建立閱讀節奏、決定視線先看哪裏。把內容填滿整個版面，讀者會不知從何看起 —— 所以留白其實是一種主動的設計決定，而非剩下來的空地。`,
       `White space = $${pageArea} \\times (100\\% - ${contentPct}\\%) = ${white}$ cm². White space is NOT waste: it bounds the content, sets the reading rhythm and decides where the eye goes first. Fill the page and the reader has no entry point — so white space is an active design decision, not the ground left over.`])
  }
}

// ── 教訓⑥：以下三個課題的首個模板組合空間封頂（13／10／9 條），
// 擴闊取值補不了量，故各加一個新模板。

// EL2 — 對稱平衡：左右兩側的視覺重量
for (const leftWeight of [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 15, 16, 18, 20, 21, 24, 25, 28, 30, 36, 40, 45]) {
  for (const rightItems of [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15]) {
    const perItem = leftWeight / rightItems
    if (!Number.isInteger(perItem)) continue
    const d = distract(perItem, [leftWeight, rightItems, leftWeight + rightItems])
    if (d.length < 3) continue
    b.add(`vab2_el2_${leftWeight}_${rightItems}`, T.elements, FW.logic, 'medium',
      [`一幅畫的左側有一個視覺重量為 ${leftWeight} 單位的主體，右側以 ${rightItems} 個相同的小元素平衡。每個小元素的視覺重量須為多少單位？`,
       `A picture carries a subject of visual weight ${leftWeight} on the left, balanced on the right by ${rightItems} identical small elements. What visual weight must each small element have?`],
      [qty(perItem, '單位', 'units'), ...d.map((v) => qty(v, '單位', 'units'))],
      [`每個 = $${leftWeight} \\div ${rightItems} = ${perItem}$ 單位。這是【不對稱平衡】：兩側形狀不同而重量相等，畫面既穩定又不呆板。對稱平衡（左右鏡像）穩重而莊嚴，多用於宗教與紀念性題材；不對稱平衡則保留動勢。⚠️ 視覺重量不等於物理面積 —— 深色、高彩度、輪廓清晰的小塊，可以重過一大片淺色。`,
       `Each carries $${leftWeight} \\div ${rightItems} = ${perItem}$ units. This is ASYMMETRICAL balance: the two sides differ in shape yet match in weight, so the picture is stable without being static. Symmetrical balance, a mirror image, reads as solemn and is common in religious and commemorative work, while asymmetry keeps a sense of movement. NOTE visual weight is not physical area — a small dark, saturated, sharply outlined shape can outweigh a large pale one.`])
  }
}

// WE2 — 畫幅比例
for (const w of [3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 16]) {
  for (const h of [2, 3, 4, 5, 6, 7, 8, 9, 10]) {
    if (w <= h) continue
    const cm = 60
    const height = Math.round((cm * h) / w)
    if (height < 10) continue
    const d = distract(height, [cm, w, h])
    if (d.length < 3) continue
    b.add(`vab2_we2_${w}_${h}`, T.western, FW.apply, 'easy',
      [`一幅畫的長闊比為 ${w}∶${h}（橫向）。若畫的長邊為 ${cm} 厘米，短邊約為多少厘米？`,
       `A painting has a landscape ratio of ${w}∶${h}. If the long side is ${cm} cm, what is the short side, to the nearest cm?`],
      [qty(height, '厘米', 'cm'), ...d.map((v) => qty(v, '厘米', 'cm'))],
      [`短邊 $= ${cm} \\times \\frac{${h}}{${w}} \\approx ${height}$ 厘米。畫幅比例本身就是內容決定：${w / h >= 2 ? '極闊的橫幅適合全景與敘事式的橫向展開' : w / h >= 1.4 ? '接近黃金比例的橫幅適合風景' : '接近正方的畫幅令視線停留在中央，適合肖像與靜物'}。⚠️ 比例決定觀者的視線【怎樣移動】—— 闊幅引導橫向掃視，方幅引導向心凝視。`,
       `Short side $= ${cm} \\times \\frac{${h}}{${w}} \\approx ${height}$ cm. The format is itself a content decision: ${w / h >= 2 ? 'a very wide panorama suits sweeping narrative' : w / h >= 1.4 ? 'a landscape format near the golden ratio suits scenery' : 'a near-square format holds the eye centrally and suits portraits and still life'}. NOTE the ratio governs HOW THE EYE MOVES — wide formats invite a lateral scan, square ones a centripetal gaze.`])
  }
}

// HI2 — 時期辨識：由技法特徵推年代區間
for (const start of [1300, 1400, 1450, 1500, 1550, 1600, 1650, 1700, 1750, 1800, 1850, 1900]) {
  for (const span of [40, 50, 60, 80, 100, 150, 200]) {
    const end = start + span
    if (end > 2000) continue
    const mid = start + span / 2
    if (!Number.isInteger(mid)) continue
    const d = distract(mid, [start, end, span])
    if (d.length < 3) continue
    b.add(`vab2_hi2_${start}_${span}`, T.history, FW.logic, 'medium',
      [`某藝術時期由 ${start} 年延續至 ${end} 年。該時期的中點年份為何？`,
       `An art period runs from ${start} to ${end}. What is the midpoint year?`],
      [qty(mid, '年', ''), ...d.map((v) => qty(v, '年', ''))],
      [`中點 = $(${start} + ${end}) \\div 2 = ${mid}$ 年。⚠️ 藝術時期的起訖年份是【後人劃定的方便界線】，不是當時的人宣布的 —— 沒有畫家在 ${end} 年決定改換風格。實際情況是重疊與漸變：界線附近的作品往往兼有兩邊特徵，而地域之間的時差可達數十年。分期是整理工具，不是事實描述。`,
       `Midpoint = $(${start} + ${end}) \\div 2 = ${mid}$. NOTE that period dates are BOUNDARIES DRAWN AFTERWARDS for convenience, not announcements made at the time — no painter resolved in ${end} to change style. Periods overlap and shade into one another, works near a boundary show features of both, and regions can lag one another by decades. Periodisation is a tool for organising, not a description of fact.`])
  }
}

export const visualArtsBank3Questions: Question[] = b.bank
