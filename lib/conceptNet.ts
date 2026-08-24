// 知識概念網 —— 中國語文指定文言範文（第 2 週 · 引擎三）
//
// 規格書 §4.4。呢個【唔係】徽章收集，係知識結構可視化：
//   • 冇稀有度、冇解鎖動畫、冇完成度百分比
//   • 未探索嘅節點寫「等待發現」，唔寫「未完成」
//   • 只顯示「已建立幾多個連接」，強調「連接」而唔係「擁有」
//
// 【零虛構原則】節點同連接全部由實物推導：
//   1. 十二篇 = 香港考評局指定文言經典學習材料嘅官方篇目，非本平台自訂。
//   2. 一條題目屬於邊一篇，由題幹原文出現嘅篇名決定（TITLE_PATTERNS），
//      唔靠人手標註，亦唔靠估。
//   3. 跨篇連接只會喺【同一條題目同時提到兩篇】而學生又答啱嗰陣先建立 ——
//      即係題庫入面真實存在嘅跨篇比較題，唔係我哋畫出嚟嘅關係。
//
// 「文體分組」（GROUPS）係本平台為咗令個網睇得明而做嘅導覽分類，
// 屬通行嘅文體歸類，但【並非考評局嘅官方分類】，UI 需如實說明。

import { notifyProgressChanged } from '@/lib/sync'

const KEY = 'dse_concept_net'
const STORE_VERSION = 1

export interface ConceptText {
  id: string
  zh: string
  en: string
  author: string
  /** 導覽用文體分組（本平台分類，非考評局官方分類） */
  group: ConceptGroup
}

export type ConceptGroup = 'masters' | 'prose' | 'travel' | 'poetry'

export const GROUPS: Record<ConceptGroup, { zh: string; en: string }> = {
  masters: { zh: '先秦諸子・說理', en: 'Pre-Qin Masters — Argumentation' },
  prose: { zh: '史傳・章表・論說', en: 'History, Memorials & Treatises' },
  travel: { zh: '記遊・記體', en: 'Travel & Récit' },
  poetry: { zh: '詩詞', en: 'Poetry & Ci' },
}

/**
 * 考評局指定文言經典學習材料十二篇。
 * 第十一、十二項本身各含三首，故 TITLE_PATTERNS 會逐首相認。
 */
export const CONCEPT_TEXTS: ConceptText[] = [
  { id: 'lunyu', zh: '論仁、論孝、論君子', en: 'On Benevolence, Filial Piety and the Superior Person', author: '《論語》', group: 'masters' },
  { id: 'yuwo', zh: '魚我所欲也', en: 'Fish Is What I Desire', author: '孟子', group: 'masters' },
  { id: 'xiaoyao', zh: '逍遙遊（節錄）', en: 'Free and Easy Wandering (excerpt)', author: '莊子', group: 'masters' },
  { id: 'quanxue', zh: '勸學（節錄）', en: 'An Exhortation to Learning (excerpt)', author: '荀子', group: 'masters' },
  { id: 'lianpo', zh: '廉頗藺相如列傳（節錄）', en: 'Biographies of Lian Po and Lin Xiangru (excerpt)', author: '司馬遷', group: 'prose' },
  { id: 'chushi', zh: '出師表', en: 'Memorial on Dispatching the Troops', author: '諸葛亮', group: 'prose' },
  { id: 'shishuo', zh: '師說', en: 'On Teachers', author: '韓愈', group: 'prose' },
  { id: 'liuguo', zh: '六國論', en: 'On the Six States', author: '蘇洵', group: 'prose' },
  { id: 'xishan', zh: '始得西山宴遊記', en: 'First Excursion to West Mountain', author: '柳宗元', group: 'travel' },
  { id: 'yueyang', zh: '岳陽樓記', en: 'Record of the Yueyang Tower', author: '范仲淹', group: 'travel' },
  { id: 'tangshi', zh: '唐詩三首', en: 'Three Tang Poems', author: '王維・李白・杜甫', group: 'poetry' },
  { id: 'songci', zh: '詞三首', en: 'Three Ci Lyrics', author: '蘇軾・李清照・辛棄疾', group: 'poetry' },
]

/**
 * 篇名辨認式。刻意用最短而唯一嘅片段：題幹有時寫全名（《魚我所欲也》），
 * 有時只寫關鍵字（「魚與熊掌」出自該篇但唔算篇名，故【不】收 —— 寧可漏認
 * 都唔可以認錯，認錯會令個網顯示一段學生根本未讀過嘅關係）。
 */
const TITLE_PATTERNS: Record<string, RegExp> = {
  lunyu: /論仁|論孝|論君子/,
  yuwo: /魚我所欲也/,
  xiaoyao: /逍遙遊/,
  quanxue: /勸學/,
  lianpo: /廉頗藺相如|藺相如/,
  chushi: /出師表/,
  shishuo: /師說/,
  liuguo: /六國論/,
  xishan: /始得西山|西山宴遊/,
  yueyang: /岳陽樓記/,
  tangshi: /山居秋暝|月下獨酌|登樓/,
  songci: /念奴嬌|赤壁懷古|聲聲慢|青玉案|元夕/,
}

/** 一條題目觸及邊幾篇範文。回傳已排序嘅篇 id，冇命中就係空陣列。 */
export function textsInQuestion(...blobs: (string | null | undefined)[]): string[] {
  const blob = blobs.filter((b): b is string => typeof b === 'string' && b.length > 0).join('\n')
  if (!blob) return []
  const hit: string[] = []
  for (const [id, re] of Object.entries(TITLE_PATTERNS)) {
    if (re.test(blob)) hit.push(id)
  }
  return hit.sort()
}

/** 跨篇連接嘅鍵。永遠細 id 喺前，令 a-b 同 b-a 係同一條邊。 */
export function pairKey(a: string, b: string): string {
  return a < b ? `${a}::${b}` : `${b}::${a}`
}

interface Store {
  v: number
  /** 每篇答啱咗幾多條 */
  hits: Record<string, number>
  /** 真實跨篇題答啱咗幾多次 */
  cross: Record<string, number>
}

/**
 * 每次都新起一個 —— 【唔可以】用一個模組級常數再 spread。
 * `{ ...EMPTY }` 係淺複製，`hits` 同 `cross` 會共用同一個物件，
 * 於是「未有紀錄」嘅情況下寫入會直接改到嗰個常數：清空概念網之後
 * 舊數字仲會喺記憶體度復活。呢個 bug 由 week2 測試撞到。
 */
function emptyStore(): Store {
  return { v: STORE_VERSION, hits: {}, cross: {} }
}

function load(): Store {
  if (typeof window === 'undefined') return emptyStore()
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return emptyStore()
    const p = JSON.parse(raw) as Partial<Store>
    if (!p || typeof p !== 'object') return emptyStore()
    return {
      v: STORE_VERSION,
      hits: typeof p.hits === 'object' && p.hits ? { ...p.hits } : {},
      cross: typeof p.cross === 'object' && p.cross ? { ...p.cross } : {},
    }
  } catch {
    return emptyStore()
  }
}

/**
 * 記低一節練習之中【答啱咗】嘅題目觸及嘅範文。
 * 只收答啱 —— 個網代表「你已經有把握嘅知識版圖」，答錯嗰啲由錯題系統負責。
 */
export function recordConceptHits(rows: { texts: string[]; correct: boolean }[]): void {
  if (typeof window === 'undefined') return
  const rel = rows.filter((r) => r.correct && r.texts.length > 0)
  if (!rel.length) return
  const s = load()
  for (const r of rel) {
    for (const t of r.texts) s.hits[t] = (s.hits[t] ?? 0) + 1
    // 同一條題提到兩篇或以上 = 真實嘅跨篇比較題
    for (let i = 0; i < r.texts.length; i++) {
      for (let j = i + 1; j < r.texts.length; j++) {
        const k = pairKey(r.texts[i], r.texts[j])
        s.cross[k] = (s.cross[k] ?? 0) + 1
      }
    }
  }
  try {
    localStorage.setItem(KEY, JSON.stringify(s))
  } catch {
    /* quota / private mode —— 概念網係附加層，寫唔到唔可以影響作答 */
  }
  notifyProgressChanged()
}

export interface ConceptNode extends ConceptText {
  hits: number
  explored: boolean
}

export interface ConceptEdge {
  a: string
  b: string
  /** true = 真實跨篇題答啱過；false = 兩篇都探索過，可以開始比較 */
  crossText: boolean
}

export interface ConceptNetState {
  nodes: ConceptNode[]
  edges: ConceptEdge[]
  exploredCount: number
  connectionCount: number
}

/**
 * 由儲存推導成個網。
 *
 * 邊嘅兩種來源（規格書 §4.4）：
 *   • 同組之內兩篇都探索過 → 可比較連接（幼線）。限同組係為咗個網睇得明 ——
 *     十二篇全開會出到 66 條線，變成一嚿嘢，資訊過載本身就係壓力源。
 *   • 真實跨篇題答啱過 → 跨篇連接（亮線），【不限】組別，因為呢條關係
 *     係題庫真實存在嘅，唔應該畀我哋自訂嘅文體分組擋住。
 */
export function computeConceptNet(): ConceptNetState {
  const s = load()
  const nodes: ConceptNode[] = CONCEPT_TEXTS.map((t) => ({
    ...t,
    hits: s.hits[t.id] ?? 0,
    explored: (s.hits[t.id] ?? 0) > 0,
  }))
  const byId = new Map(nodes.map((n) => [n.id, n]))

  const edges: ConceptEdge[] = []
  const seen = new Set<string>()

  for (const k of Object.keys(s.cross)) {
    if ((s.cross[k] ?? 0) <= 0) continue
    const [a, b] = k.split('::')
    const na = byId.get(a)
    const nb = byId.get(b)
    if (!na || !nb) continue
    // 兩端都要著咗先畫。recordConceptHits 記跨篇對嗰陣一定同時加返兩篇嘅 hits，
    // 所以正常用法唔會唔對數；呢個守衛係防手改／半殘嘅 storage 畫出一條
    // 連去一個「等待發現」節點嘅線 —— 嗰種線讀落似「你有一段唔存在嘅關係」。
    if (!na.explored || !nb.explored) continue
    edges.push({ a, b, crossText: true })
    seen.add(k)
  }

  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const a = nodes[i]
      const b = nodes[j]
      if (a.group !== b.group) continue
      if (!a.explored || !b.explored) continue
      const k = pairKey(a.id, b.id)
      if (seen.has(k)) continue
      edges.push({ a: a.id, b: b.id, crossText: false })
      seen.add(k)
    }
  }

  return {
    nodes,
    edges,
    exploredCount: nodes.filter((n) => n.explored).length,
    connectionCount: edges.length,
  }
}

export function resetConceptNet(): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.removeItem(KEY)
  } catch {
    /* ignore */
  }
}
