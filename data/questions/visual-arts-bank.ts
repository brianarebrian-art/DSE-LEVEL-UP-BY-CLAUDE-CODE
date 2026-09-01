import type { Question } from './types'
import { createBank, n, qty, round, type TopicMeta, type FwMeta } from './_parametric'

// ═══════════════════════════════════════════════════════════════════════════
// visual-arts-bank.ts —— 視覺藝術參數化母模板（2026-08-29）
// ---------------------------------------------------------------------------
// 第九批。視覺藝術是全站最小的科目（140 條），十個課題介乎 10 至 15 條，
// 倍差僅 1.5×——分佈本身並不失衡，問題只在總量。故本檔不需要「避開最厚
// 課題」，而是各課題平均增補。
//
// 撰寫前的迴圈估算：數值模板（色彩學、比例）目標 24 至 40 條，
// 分類型模板每個資料項出一至兩條，目標 12 至 24 條，
// 令十個課題各自落在 30 至 55 之間。
//
// ⚠️ 前八批累積的九項防範，本檔逐項遵守：
//   一、選項一律寫成明確的 [zh, en] 對，干擾項由具名雙語資料表取出。
//   二、以區間分類時取值落在區間內部。
//   三、每組模板的目標產出先估算後撰寫。
//   四、由清單取正確項用 `if (!x) continue`，不用 `!` 斷言。
//   五、【變體的題幹必須引用迴圈變數】——否則同一題幹會被複製 N 次。
//      健康管理科的 hmb_pv1_*_b 與 hmb_ho1_*_i 正是栽在這一點上。
//   六、題幹不可只靠英文大小寫區分（normStem 會 toLowerCase）。
// ═══════════════════════════════════════════════════════════════════════════

const T = {
  formal: { id: 'va_formal_analysis', zh: '形式分析・元素與原則', en: 'Formal analysis — elements & principles' },
  history: { id: 'va_history_context', zh: '藝術史・技法與風格', en: 'Art history — technique & style' },
  appreciation: { id: 'art_appreciation', zh: '藝術評賞', en: 'Art Appreciation' },
  elements: { id: 'elements_principles', zh: '藝術元素與原則', en: 'Elements & Principles' },
  western: { id: 'western_art', zh: '西方藝術', en: 'Western Art' },
  chinese: { id: 'chinese_art', zh: '中國藝術', en: 'Chinese Art' },
  media: { id: 'media_techniques', zh: '媒材與技法', en: 'Media & Techniques' },
  modern: { id: 'modern_contemporary', zh: '現代與當代藝術', en: 'Modern & Contemporary Art' },
  design: { id: 'visual_design', zh: '視覺設計', en: 'Visual Design' },
  context: { id: 'art_context', zh: '藝術與文化', en: 'Art & Culture' },
} satisfies Record<string, TopicMeta>

const FW = {
  apply: { id: 'apply', zh: '應用分析', en: 'Application', emoji: '🛠️' },
  logic: { id: 'logic', zh: '邏輯推理', en: 'Logical Reasoning', emoji: '🧠' },
} satisfies Record<string, FwMeta>

const b = createBank('visual-arts')
const distract = (correct: number, cands: number[]): number[] =>
  cands.filter((v, i, a) => v !== correct && a.indexOf(v) === i && Number.isFinite(v) && v > 0).slice(0, 3)

// ── 視覺設計：色相環角度（目標約 30 條）────────────────────────────────────

const hues: Array<[string, string, number]> = [
  ['紅', 'red', 0], ['橙', 'orange', 30], ['黃', 'yellow', 60], ['黃綠', 'yellow-green', 90],
  ['綠', 'green', 120], ['青綠', 'blue-green', 150], ['青', 'cyan', 180],
  ['藍', 'blue', 210], ['藍紫', 'blue-violet', 240], ['紫', 'violet', 270],
  ['紫紅', 'red-violet', 300], ['洋紅', 'magenta', 330],
]
for (const [zh, en, deg] of hues) {
  const compDeg = (deg + 180) % 360
  const comp = hues.find((h) => h[2] === compDeg)
  if (!comp) continue
  const wrong = hues.filter((h) => h[2] !== compDeg && h[2] !== deg).slice(0, 3)
  b.add(`vab_vd1_${en}`, T.design, FW.apply, 'medium',
    [`在十二色相環上，${zh}（${deg}°）的互補色是哪一種顏色？`,
     `On a twelve-hue colour wheel, which hue is complementary to ${en} at ${deg}°?`],
    [[`${comp[0]}（${compDeg}°）`, `${comp[1]} at ${compDeg}°`],
     ...wrong.map((h) => [`${h[0]}（${h[2]}°）`, `${h[1]} at ${h[2]}°`] as [string, string])],
    [`互補色在色相環上相隔 180°，故 ${zh}（${deg}°）的互補色為${comp[0]}（$${deg} + 180 = ${deg + 180}$，超過 360° 則減 360，得 ${compDeg}°）。互補色並置時彼此的鮮明度都會提高，因而常用於需要強烈對比的場合；但大面積等量並置會令視覺疲勞，實務上通常一方為主、一方為點綴。`,
     `Complementary hues sit 180° apart on the wheel, so the complement of ${en} at ${deg}° is ${comp[1]} ($${deg} + 180 = ${deg + 180}$, less 360 where it exceeds a full turn, giving ${compDeg}°). Placed side by side, complements intensify one another, which is why they serve where strong contrast is wanted; but equal areas of both tire the eye, so in practice one dominates and the other accents.`])
}

// ── 視覺設計：構圖比例（目標約 24 條）──────────────────────────────────────

for (const w of [900, 1200, 1500, 1800, 2400]) {
  for (const rule of ['三分法', '黃金分割']) {
    const pos = rule === '三分法' ? Math.round(w / 3) : Math.round(w / 1.618)
    const other = rule === '三分法' ? Math.round(w / 1.618) : Math.round(w / 3)
    const d = distract(pos, [Math.round(w / 2), other, Math.round(w / 4)])
    if (d.length < 3) continue
    b.add(`vab_vd2_${w}_${rule === '三分法' ? 'thirds' : 'golden'}`, T.design, FW.apply, rule === '三分法' ? 'easy' : 'hard',
      [`一幅畫寬 ${w} 像素。按${rule}安排主體，主體的垂直分界線應約在距左邊多少像素處？`,
       `A picture is ${w} px wide. Placing the subject by ${rule === '三分法' ? 'the rule of thirds' : 'the golden section'}, roughly how far from the left edge should the dividing line fall?`],
      [qty(pos, '像素', 'px'), ...d.map((v) => qty(v, '像素', 'px'))],
      [`${rule}的分界位置 = $\\dfrac{${w}}{${rule === '三分法' ? '3' : '1.618'}} \\approx ${pos}$ 像素。兩者都是避免把主體放在正中央的做法：正中構圖穩定卻靜止，而偏離中心會產生張力與方向感。答 ${Math.round(w / 2)} 正是置中，恰恰是這兩條原則要避開的位置。要留意原則是起點而非規定——刻意置中亦可以是有力的選擇，關鍵在於是否出於判斷。`,
       `The dividing line falls at $\\dfrac{${w}}{${rule === '三分法' ? '3' : '1.618'}} \\approx ${pos}$ px. Both devices exist to keep the subject off dead centre: a centred composition is stable but static, while an offset one creates tension and direction. Answering ${Math.round(w / 2)} centres the subject, which is precisely what these rules avoid. Note that they are starting points rather than requirements — deliberate centring can be powerful, provided it is a judgement rather than a default.`])
  }
}

// ── 中國藝術（目標約 32 條）────────────────────────────────────────────────

const chineseArt: Array<[string, string, string, string]> = [
  ['披麻皴', 'hemp-fibre texture strokes', '柔和綿長的線條，多用於表現江南土質丘陵', 'soft elongated lines, used for the earthen hills of the south'],
  ['斧劈皴', 'axe-cut texture strokes', '方硬峻峭的塊面，多用於表現北方岩石山體', 'angular chopped planes, used for the rocky massifs of the north'],
  ['文人畫', 'literati painting', '重意境與筆墨情趣，作者多為士大夫，詩書畫印結合', 'valuing conception and brushwork, made by scholar-officials, uniting poetry, calligraphy, painting and seal'],
  ['院體畫', 'academy painting', '重形似與工筆設色，多為宮廷畫院所作', 'valuing likeness and meticulous colouring, produced by the court academy'],
  ['留白', 'reserved blank space', '不著筆墨的空間本身即是構圖的一部分，用以表現雲水與氣韻', 'unpainted space is itself part of the composition, suggesting cloud, water and atmosphere'],
  ['題跋', 'inscription and colophon', '畫上的題字與印章，記錄作者、觀者與流傳，並參與構圖', 'inscriptions and seals recording maker, viewer and provenance, while also entering the composition'],
]
for (const [zh, en, def, defEn] of chineseArt) {
  const others = chineseArt.filter((c) => c[0] !== zh).slice(0, 3)
  b.add(`vab_ca1_${en.slice(0, 12)}_d`, T.chinese, FW.logic, 'medium',
    [`中國藝術中的「${zh}」指甚麼？`, `In Chinese art, what is meant by ${en}?`],
    [[def, defEn], ...others.map((c) => [c[2], c[3]] as [string, string])],
    [`「${zh}」指${def}。理解中國畫的關鍵在於：它並不以【再現眼前所見】為首要目標，而以筆墨傳達作者的心境與修養。因此評賞時若只問「畫得像不像」，便會錯過整套評價體系——筆法、墨色、留白、題跋，全部都是意義的載體。`,
     `${en.charAt(0).toUpperCase() + en.slice(1)} refers to ${defEn}. The key to Chinese painting is that REPRODUCING WHAT THE EYE SEES is not its first aim: brush and ink convey the maker's state of mind and cultivation. To ask only whether a work looks lifelike is therefore to miss the whole evaluative framework, in which stroke, ink tone, reserved space and inscription all carry meaning.`])
  b.add(`vab_ca1_${en.slice(0, 12)}_u`, T.chinese, FW.apply, 'hard',
    [`一幅山水畫大量運用「${zh}」。這對觀者理解該作品有何幫助？`,
     `A landscape makes extensive use of ${en}. How does recognising this help the viewer?`],
    [[`可由此推知${def}，從而理解作者的取法與所寫何地`,
      `it reveals that ${defEn}, and so points to the painter's lineage and subject`],
     ['只能判斷作品的年代，與內容理解無關', 'it dates the work but says nothing about its content'],
     ['只影響裝裱方式，與畫面本身無關', 'it affects only how the work is mounted, not the image'],
     ['無助理解，中國畫的技法純屬個人習慣', 'it does not help: technique in Chinese painting is merely personal habit']],
    [`辨認「${zh}」之後可以推知${def}。中國畫的技法從來不是中性的手段：選用哪一種皴法，同時說明了所寫的地貌與所承接的傳統；用文人畫抑或院體畫的路數，亦透露作者的身分與價值取向。故形式分析在中國藝術之中，本身就是內容分析的一部分。`,
     `Recognising ${en} tells the viewer that ${defEn}. Technique in Chinese painting is never a neutral means: the choice of texture stroke states both the terrain depicted and the tradition inherited, while working in the literati or the academy manner discloses the maker's position and values. Formal analysis is therefore already content analysis in this tradition.`])
}

// ── 西方藝術（目標約 30 條）────────────────────────────────────────────────

const westernArt: Array<[string, string, string, string]> = [
  ['線性透視', 'linear perspective', '以單一消失點統一畫面空間，觀者位置因而被明確設定', 'unifying pictorial space around one vanishing point, which fixes where the viewer stands'],
  ['明暗對照法', 'chiaroscuro', '以強烈的明暗對比塑造體積並營造戲劇性', 'strong contrasts of light and dark that model volume and heighten drama'],
  ['暈塗法', 'sfumato', '以極細膩的過渡消除輪廓線，令形體如籠煙霧', 'imperceptible transitions that dissolve outlines, veiling form as if in smoke'],
  ['印象派筆觸', 'the Impressionist touch', '短促而不調和的筆觸，以並置色彩取代調色盤上的混合', 'short unblended strokes, juxtaposing colours instead of mixing them on the palette'],
  ['拼貼', 'collage', '把現成材料貼入畫面，令日常物料進入藝術作品', 'pasting ready-made material into the picture, admitting everyday matter into art'],
  ['現成物', 'the readymade', '把既有物件宣告為藝術品，把界定藝術的權力本身變成問題', 'declaring an existing object to be art, and so making the power to define art itself the question'],
]
for (const [zh, en, def, defEn] of westernArt) {
  const others = westernArt.filter((w) => w[0] !== zh).slice(0, 3)
  b.add(`vab_wa1_${en.slice(0, 12)}_d`, T.western, FW.logic, 'medium',
    [`西方藝術中的「${zh}」指甚麼？`, `In Western art, what is ${en}?`],
    [[def, defEn], ...others.map((w) => [w[2], w[3]] as [string, string])],
    [`「${zh}」指${def}。西方藝術史的一條主線，是【再現方式的變化】：由文藝復興建立一套令畫面看似真實的規則，到印象派把注意力轉向光與感知本身，再到二十世紀直接質疑「甚麼算是藝術」。理解一項技法時，應同時問它想解決甚麼問題。`,
     `${en.charAt(0).toUpperCase() + en.slice(1)} means ${defEn}. One thread runs through Western art history: THE CHANGING TERMS OF REPRESENTATION — from the Renaissance building rules that make a picture look true, to Impressionism turning attention to light and perception themselves, to the twentieth century questioning what counts as art at all. When studying a technique, ask what problem it was devised to solve.`])
}

// ── 媒材與技法（目標約 24 條）──────────────────────────────────────────────

const media: Array<[string, string, string, string]> = [
  ['油彩', 'oil paint', '乾得慢，可反覆修改與罩染，適合細膩過渡與厚塗', 'slow-drying, allowing repeated reworking and glazing, suited to subtle transitions and impasto'],
  ['水彩', 'watercolour', '透明而依賴紙的白，落筆難以修改，講求預先計劃', 'transparent and dependent on the white of the paper; marks resist correction, so it rewards planning'],
  ['版畫', 'printmaking', '透過版模間接製作，可產生多份原作，並帶有製版本身的痕跡', 'made indirectly through a matrix, yielding multiple originals and bearing the marks of the process'],
  ['陶藝', 'ceramics', '經燒製而永久定形，收縮與釉變令結果無法完全預測', 'permanently fixed by firing, with shrinkage and glaze behaviour making outcomes only partly predictable'],
  ['攝影', 'photography', '以光學與感光記錄，選取與框取本身即是創作行為', 'recorded optically; selection and framing are themselves the creative act'],
]
for (const [zh, en, def, defEn] of media) {
  const others = media.filter((m) => m[0] !== zh).slice(0, 3)
  b.add(`vab_mt1_${en.slice(0, 10)}`, T.media, FW.apply, 'easy',
    [`就「${zh}」這種媒材而言，以下哪一項最準確描述其特性？`,
     `Which statement best describes ${en} as a medium?`],
    [[def, defEn], ...others.map((m) => [m[2], m[3]] as [string, string])],
    [`「${zh}」的特性為：${def}。媒材的物理限制會直接塑造創作方式——水彩不能反覆修改，所以要求預先計劃；油彩可以覆蓋，所以容許在畫布上思考。評賞作品時留意作者如何【順應或對抗】媒材的性質，往往比辨認媒材本身更有價值。`,
     `${en.charAt(0).toUpperCase() + en.slice(1)} is ${defEn}. A medium's physical constraints shape how work is made: watercolour resists correction and so demands planning, while oil can be overpainted and so permits thinking on the canvas. In appreciation, noticing how an artist WORKS WITH OR AGAINST the medium's nature is usually more valuable than naming the medium.`])
}

// ── 藝術評賞（目標約 24 條）────────────────────────────────────────────────

const steps: Array<[string, string, number, string, string]> = [
  ['描述', 'description', 1, '客觀列出所見：題材、媒材、尺寸、可辨認的形象', 'setting out what is objectively there: subject, medium, size, recognisable forms'],
  ['分析', 'analysis', 2, '說明各元素如何組織：構圖、色彩關係、視線引導', 'showing how the elements are organised: composition, colour relationships, the path of the eye'],
  ['詮釋', 'interpretation', 3, '提出作品可能表達的意義，並以前兩步的觀察為證據', 'proposing what the work may mean, using the earlier observations as evidence'],
  ['判斷', 'judgement', 4, '評價作品的成就，並說明所依據的準則', 'assessing the work\'s achievement and stating the criteria used'],
]
for (const [zh, en, order, def, defEn] of steps) {
  const others = steps.filter((s) => s[0] !== zh).slice(0, 3)
  b.add(`vab_ap1_${en.slice(0, 10)}_d`, T.appreciation, FW.logic, 'easy',
    [`藝術評賞四步之中，「${zh}」這一步要做甚麼？`, `In the four steps of art appreciation, what does ${en} involve?`],
    [[def, defEn], ...others.map((s) => [s[3], s[4]] as [string, string])],
    [`「${zh}」是第 ${order} 步，內容為${def}。四步的次序有其道理：先確認看見甚麼，再說明它如何組織，然後才談意義，最後才作評價。把次序倒過來——一開口就說「我覺得這幅畫很沉重」——問題不在於判斷本身，而在於缺乏可供他人檢視的依據。`,
     `${en.charAt(0).toUpperCase() + en.slice(1)} is step ${order}: ${defEn}. The order has a reason: establish what is present, then how it is organised, then what it may mean, and only then evaluate. Reversing it — opening with "this painting feels heavy to me" — is not wrong because it judges, but because it offers nothing another viewer can examine.`])
  b.add(`vab_ap1_${en.slice(0, 10)}_e`, T.appreciation, FW.apply, 'medium',
    [`一篇評賞文章完全略去「${zh}」這一步，其餘三步照做。這會造成甚麼問題？`,
     `An appreciation essay omits the ${en} step entirely while keeping the other three. What problem does this create?`],
    [[`失去${def}這一環，其後的論述缺少必要的基礎或收束`,
      `without ${defEn}, what follows lacks either its necessary basis or its conclusion`],
     ['沒有問題，四步本來就可以任意取捨', 'no problem: the four steps may be taken or left at will'],
     ['只影響文章長度，不影響說服力', 'it affects only length, not persuasiveness'],
     ['會令文章變得更客觀，因為減少了主觀成分', 'it makes the essay more objective by removing subjectivity']],
    [`略去「${zh}」即失去${def}這一環。四步各有不可替代的功能：缺少描述，讀者不知道在談哪一件作品；缺少分析，詮釋變成憑空聯想；缺少詮釋，文章停留在技術清單；缺少判斷，則始終未曾表態。四步是一條【由證據走向結論】的路徑，抽走任何一段，路都接不上。`,
     `Omitting ${en} removes the step in which ${defEn}. Each has a function nothing else supplies: without description the reader does not know which work is discussed; without analysis interpretation becomes free association; without interpretation the essay stops at a technical inventory; without judgement no position is ever taken. The four steps are a path FROM EVIDENCE TO CONCLUSION, and removing any segment breaks it.`])
}

// ── 藝術元素與原則 ＋ 形式分析（目標各約 24 條）────────────────────────────

const els: Array<[string, string, string, string]> = [
  ['線條', 'line', '界定形狀、引導視線，並可透過粗細與方向傳達情緒', 'defining shape, leading the eye, and carrying feeling through weight and direction'],
  ['形狀', 'shape', '二維的封閉區域，可為幾何或有機', 'a closed two-dimensional area, geometric or organic'],
  ['質感', 'texture', '表面的觸感或視覺上的觸感暗示', 'the feel of a surface, whether actual or implied to the eye'],
  ['明度', 'value', '色彩的明暗程度，是塑造體積的主要手段', 'the lightness or darkness of a colour, the chief means of modelling volume'],
  ['空間', 'space', '物象之間與周圍的區域，包括正形與負形', 'the area between and around forms, including both positive and negative shape'],
  ['色彩', 'colour', '由色相、明度與彩度三者共同構成', 'constituted together by hue, value and saturation'],
]
for (const [zh, en, def, defEn] of els) {
  const others = els.filter((e) => e[0] !== zh).slice(0, 3)
  b.add(`vab_ep1_${en}`, T.elements, FW.logic, 'easy',
    [`藝術元素中的「${zh}」指甚麼？`, `As an element of art, what is ${en}?`],
    [[def, defEn], ...others.map((e) => [e[2], e[3]] as [string, string])],
    [`「${zh}」指${def}。要分清【元素】與【原則】：元素是構成作品的材料（線條、形狀、色彩……），原則是組織這些材料的方式（平衡、對比、韻律……）。分析作品時先辨認用了哪些元素，再說明它們如何被組織，論述才有層次。`,
     `${en.charAt(0).toUpperCase() + en.slice(1)} is ${defEn}. Keep ELEMENTS and PRINCIPLES apart: elements are the materials a work is made of — line, shape, colour — while principles are the ways those materials are organised — balance, contrast, rhythm. Identify the elements first, then show how they are organised, and the analysis gains structure.`])
  b.add(`vab_fa1_${en}`, T.formal, FW.apply, 'medium',
    [`分析一件作品時，若只指出「畫中有${zh}」而不作進一步說明，這樣的形式分析為何不足？`,
     `In analysing a work, why is it insufficient merely to note that ${en} is present, without going further?`],
    [[`元素存在是必然的，分析要說明它【如何】被運用及造成甚麼效果`,
      `the presence of an element is a given; analysis must show HOW it is used and to what effect`],
     ['因為該元素並不重要，應改為分析其他元素', 'because that element is unimportant and another should be analysed instead'],
     ['因為形式分析只應處理色彩，不應處理其他元素', 'because formal analysis should treat colour only'],
     ['並無不足，指出元素存在已經完成分析', 'nothing is missing: naming the element completes the analysis']],
    [`任何作品都必然包含${zh}，故指出它存在等於甚麼都沒說。有效的形式分析要回答三個問題：這個元素【怎樣】被運用（${def}）、它與其他元素【如何互動】、以及由此產生【甚麼效果】。三者齊備，形式分析才連接得上詮釋。`,
     `Every work necessarily contains ${en}, so noting its presence says nothing. Effective formal analysis answers three questions: HOW the element is used — ${defEn} — how it INTERACTS with the others, and what EFFECT results. With all three, formal analysis connects to interpretation.`])
}

// ── 現代與當代藝術（目標約 20 條）──────────────────────────────────────────

const modern: Array<[string, string, string, string]> = [
  ['抽象', 'abstraction', '不以再現可辨認的物象為目的，由形色本身承擔表達', 'not aiming to depict recognisable objects; form and colour carry the expression themselves'],
  ['觀念藝術', 'conceptual art', '以構想本身為作品，物質形式退居次要', 'the idea itself is the work, and material form becomes secondary'],
  ['裝置藝術', 'installation art', '為特定空間而作，觀者身處其中而非在外觀看', 'made for a particular space, with the viewer inside the work rather than before it'],
  ['行為藝術', 'performance art', '以藝術家的身體與行動為媒介，作品在時間中發生', 'using the artist\'s body and actions as medium, the work unfolding in time'],
  ['公共藝術', 'public art', '設於公共空間，須面對非自願觀眾與社區意見', 'sited in public space, facing an unchosen audience and community opinion'],
]
for (const [zh, en, def, defEn] of modern) {
  const others = modern.filter((m) => m[0] !== zh).slice(0, 3)
  b.add(`vab_mc1_${en.slice(0, 12)}`, T.modern, FW.logic, 'easy',
    [`當代藝術中的「${zh}」有何特點？`, `What characterises ${en} in contemporary practice?`],
    [[def, defEn], ...others.map((m) => [m[2], m[3]] as [string, string])],
    [`「${zh}」的特點是${def}。二十世紀以來，藝術的定義由【技藝】轉向【提問】：作品愈來愈不靠手工精湛取勝，而靠它提出甚麼問題、放在甚麼脈絡。評賞當代作品若仍只問「畫得是否精細」，等於用一套不適用的準則。適切的問法是：它把甚麼變成了問題？`,
     `${en.charAt(0).toUpperCase() + en.slice(1)} is characterised in that ${defEn}. Since the twentieth century the definition of art has shifted from CRAFT to INQUIRY: works increasingly succeed not through manual accomplishment but through the questions they raise and the context they occupy. To ask only whether a contemporary work is well made is to apply a criterion that no longer fits. The apt question is: what has it turned into a question?`])
}

// ── 藝術與文化（目標約 20 條）──────────────────────────────────────────────

for (const [zh, en, issue, issueEn] of [
  ['文物修復', 'conservation', '修復到甚麼程度才算恰當——回復原狀抑或保留歲月痕跡', 'how far restoration should go: returning a work to its original state, or preserving the marks of time'],
  ['文化挪用', 'cultural appropriation', '借用他者文化的符號時，權力關係與脈絡是否被顧及', 'whether power relations and context are considered when another culture\'s signs are borrowed'],
  ['藝術市場', 'the art market', '價格與藝術價值並不等同，市場亦會反過來影響創作', 'price and artistic value are not the same, and the market in turn shapes what is made'],
  ['美術館的選擇', 'the museum\'s choices', '展出甚麼、如何陳列，本身即是一種詮釋與價值判斷', 'what is shown and how it is displayed is itself an interpretation and a judgement'],
] as Array<[string, string, string, string]>) {
  const pool: Array<[string, string]> = [
    ['修復到甚麼程度才算恰當——回復原狀抑或保留歲月痕跡', 'how far restoration should go: returning a work to its original state, or preserving the marks of time'],
    ['借用他者文化的符號時，權力關係與脈絡是否被顧及', 'whether power relations and context are considered when another culture\'s signs are borrowed'],
    ['價格與藝術價值並不等同，市場亦會反過來影響創作', 'price and artistic value are not the same, and the market in turn shapes what is made'],
    ['展出甚麼、如何陳列，本身即是一種詮釋與價值判斷', 'what is shown and how it is displayed is itself an interpretation and a judgement'],
  ]
  const others = pool.filter((p) => p[0] !== issue).slice(0, 3)
  b.add(`vab_ac1_${en.slice(0, 12)}`, T.context, FW.apply, 'medium',
    [`就「${zh}」而言，當中最核心的爭議是甚麼？`, `What is the central issue raised by ${en}?`],
    [[issue, issueEn], ...others],
    [`「${zh}」的核心爭議是${issue}。這類議題沒有單一正確答案，考核的是能否【指出爭議的結構】——即衝突的雙方各自根據甚麼價值。答題時若只表明立場而不說明另一方的理由，論述便顯得單薄；能同時交代兩邊的考量，再說明自己何以偏向其一，才算完整。`,
     `The central issue in ${en} is ${issueEn}. Such questions have no single right answer; what is assessed is whether the STRUCTURE OF THE DISAGREEMENT can be set out — on what values each side rests. An answer that states a position without giving the other side's reasons is thin; one that presents both considerations and then explains its own leaning is complete.`])
}

// ── 藝術史・技法與風格（目標約 24 條）──────────────────────────────────────

const periods: Array<[string, string, number, number, string, string]> = [
  ['文藝復興', 'the Renaissance', 1400, 1600, '線性透視、解剖準確、古典題材復興', 'linear perspective, anatomical accuracy, and a revival of classical subjects'],
  ['巴洛克', 'the Baroque', 1600, 1750, '強烈明暗、動態構圖、戲劇性的瞬間', 'strong chiaroscuro, dynamic composition, and the dramatic instant'],
  ['印象派', 'Impressionism', 1860, 1890, '戶外寫生、短促筆觸、捕捉光線的瞬間變化', 'painting outdoors, broken brushwork, and the fleeting effects of light'],
  ['立體派', 'Cubism', 1907, 1920, '把物象拆解為多個視點同時呈現於平面', 'breaking objects apart and presenting several viewpoints at once on one surface'],
]
for (const [zh, en, from, to, feat, featEn] of periods) {
  const others = periods.filter((p) => p[0] !== zh).slice(0, 3)
  b.add(`vab_hc1_${en.slice(0, 12)}_f`, T.history, FW.logic, 'medium',
    [`「${zh}」（約 ${from}–${to}）在技法與風格上有何特徵？`,
     `What technical and stylistic features mark ${en} (about ${from}–${to})?`],
    [[feat, featEn], ...others.map((p) => [p[4], p[5]] as [string, string])],
    [`${zh}的特徵是${feat}。分期是後人為理解方便而作的歸納，交界前後風格並存，個別作者亦可跨期。用分期的正確方式是把它當作【提問的起點】——這件作品為何在此時出現、它回應了前一代的甚麼問題——而非把作品塞進標籤了事。`,
     `${en.charAt(0).toUpperCase() + en.slice(1)} is marked by ${featEn}. Periods are a later generalisation made for convenience: styles overlap at the boundaries and individual artists straddle them. The right use of periodisation is as a STARTING POINT FOR QUESTIONS — why did this work appear when it did, and what problem of the preceding generation does it answer — rather than as a label to file works under.`])
  b.add(`vab_hc1_${en.slice(0, 12)}_c`, T.history, FW.apply, 'hard',
    [`一件作品呈現「${feat}」。它最可能屬於哪一個時期？`,
     `A work shows ${featEn}. To which period does it most likely belong?`],
    [[`${zh}（約 ${from}–${to}）`, `${en} (about ${from}–${to})`],
     ...others.map((p) => [`${p[0]}（約 ${p[2]}–${p[3]}）`, `${p[1]} (about ${p[2]}–${p[3]})`] as [string, string])],
    [`所述特徵對應${zh}（約 ${from}–${to}）。由特徵反推時期，靠的是每個時期各自要解決的問題不同：文藝復興要建立空間的可信度，巴洛克要製造動勢與感染力，印象派要捕捉知覺本身，立體派則質疑單一視點的前提。抓住「它在解決甚麼問題」，比記憶年份可靠得多。`,
     `The features described belong to ${en} (about ${from}–${to}). Reasoning from feature to period works because each period sets itself a different problem: the Renaissance to make space credible, the Baroque to generate movement and impact, Impressionism to capture perception itself, Cubism to question the premise of a single viewpoint. Grasping WHAT PROBLEM IS BEING SOLVED is far more reliable than memorising dates.`])
}

export const visualArtsBank2Questions: Question[] = b.bank
