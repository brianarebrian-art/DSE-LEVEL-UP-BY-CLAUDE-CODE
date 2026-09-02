// 考試日管家 —— 港鐵網絡模型（地方名 → 車程估算）
//
// ══ 點解要有呢個檔 ══
// 「幾點出門口」呢條數，冇【目的地】就計唔出。舊版只收出發站，然後由
// 考試時間扣一個寫死嘅 40／55 分鐘 —— 個數字睇落好個人化，其實同你住
// 邊、去邊完全無關。天水圍去柴灣同天后去銅鑼灣，攞返同一個答案。
// 呢個模組就係補返嗰忽：出發地 → 試場，行一次最短路，出一個真車程。
//
// ══ 點解唔用 API ══
// 港鐵冇公開行程規劃 API（data.gov.hk 嗰個 getSchedule 只出某一站嘅
// 下一班車，唔出站與站之間嘅時間）。要有目的地就一定要自己有網絡圖。
// 一張本地圖 = 零上游、零延遲、零新增套件，而且離線都計到 —— 考試朝早
// 網絡唔通嗰陣，出門時間反而係最唔可以失去嘅嗰樣嘢。
//
// ══ 準確度嘅立場（重要）══
// 每段行車時間係按港鐵實際班次【向上取整】嘅估算，唔係官方數字。
// 呢個唔對稱係刻意嘅：估多咗學生早到，估少咗學生遲到 —— 兩種錯誤嘅
// 代價差天共地。所以寧可鬆，唔可以緊，UI 亦必須明講呢個係估算。

export interface Station {
  id: string
  zh: string
  en: string
  lines: string[]
}

/** 一條線：站序 + 相鄰站之間嘅行車分鐘（segs.length === stops.length - 1）。 */
interface LineDef {
  line: string
  zh: string
  en: string
  stops: [string, string, string][]
  segs: number[]
}

// 機場快綫、迪士尼綫刻意唔收錄：兩條都唔會通去試場，但收咗之後
// Dijkstra 會為咗慳兩分鐘把學生 routing 落機場快綫（單程數十蚊）。
// 一個「最短時間」演算法唔識車費，所以唔啱嘅選項要喺數據層剷走。
const LINES: LineDef[] = [
  {
    line: 'TWL', zh: '荃灣綫', en: 'Tsuen Wan Line',
    stops: [
      ['CEN', '中環', 'Central'], ['ADM', '金鐘', 'Admiralty'], ['TST', '尖沙咀', 'Tsim Sha Tsui'],
      ['JOR', '佐敦', 'Jordan'], ['YMT', '油麻地', 'Yau Ma Tei'], ['MOK', '旺角', 'Mong Kok'],
      ['PRE', '太子', 'Prince Edward'], ['SSP', '深水埗', 'Sham Shui Po'], ['CSW', '長沙灣', 'Cheung Sha Wan'],
      ['LCK', '荔枝角', 'Lai Chi Kok'], ['MEF', '美孚', 'Mei Foo'], ['LAK', '荔景', 'Lai King'],
      ['KWF', '葵芳', 'Kwai Fong'], ['KWH', '葵興', 'Kwai Hing'], ['TWH', '大窩口', 'Tai Wo Hau'],
      ['TSW', '荃灣', 'Tsuen Wan'],
    ],
    segs: [2, 3, 2, 2, 2, 2, 2, 2, 2, 2, 3, 2, 2, 2, 3],
  },
  {
    line: 'KTL', zh: '觀塘綫', en: 'Kwun Tong Line',
    stops: [
      ['WHA', '黃埔', 'Whampoa'], ['HOM', '何文田', 'Ho Man Tin'], ['YMT', '油麻地', 'Yau Ma Tei'],
      ['MOK', '旺角', 'Mong Kok'], ['PRE', '太子', 'Prince Edward'], ['SKM', '石硤尾', 'Shek Kip Mei'],
      ['KOT', '九龍塘', 'Kowloon Tong'], ['LOF', '樂富', 'Lok Fu'], ['WTS', '黃大仙', 'Wong Tai Sin'],
      ['DIH', '鑽石山', 'Diamond Hill'], ['CHH', '彩虹', 'Choi Hung'], ['KOB', '九龍灣', 'Kowloon Bay'],
      ['NTK', '牛頭角', 'Ngau Tau Kok'], ['KWT', '觀塘', 'Kwun Tong'], ['LAT', '藍田', 'Lam Tin'],
      ['YAT', '油塘', 'Yau Tong'], ['TIK', '調景嶺', 'Tiu Keng Leng'],
    ],
    segs: [2, 3, 2, 2, 2, 2, 2, 2, 2, 2, 3, 2, 2, 3, 2, 2],
  },
  {
    line: 'ISL', zh: '港島綫', en: 'Island Line',
    stops: [
      ['KET', '堅尼地城', 'Kennedy Town'], ['HKU', '香港大學', 'HKU'], ['SYP', '西營盤', 'Sai Ying Pun'],
      ['SHW', '上環', 'Sheung Wan'], ['CEN', '中環', 'Central'], ['ADM', '金鐘', 'Admiralty'],
      ['WAC', '灣仔', 'Wan Chai'], ['CAB', '銅鑼灣', 'Causeway Bay'], ['TIH', '天后', 'Tin Hau'],
      ['FOH', '炮台山', 'Fortress Hill'], ['NOP', '北角', 'North Point'], ['QUB', '鰂魚涌', 'Quarry Bay'],
      ['TAK', '太古', 'Tai Koo'], ['SWH', '西灣河', 'Sai Wan Ho'], ['SKW', '筲箕灣', 'Shau Kei Wan'],
      ['HFC', '杏花邨', 'Heng Fa Chuen'], ['CHW', '柴灣', 'Chai Wan'],
    ],
    segs: [2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3],
  },
  {
    line: 'TKL', zh: '將軍澳綫', en: 'Tseung Kwan O Line',
    stops: [
      ['NOP', '北角', 'North Point'], ['QUB', '鰂魚涌', 'Quarry Bay'], ['YAT', '油塘', 'Yau Tong'],
      ['TIK', '調景嶺', 'Tiu Keng Leng'], ['TKO', '將軍澳', 'Tseung Kwan O'], ['HAH', '坑口', 'Hang Hau'],
      ['POA', '寶琳', 'Po Lam'],
    ],
    segs: [2, 4, 2, 2, 2, 2],
  },
  {
    line: 'TCL', zh: '東涌綫', en: 'Tung Chung Line',
    stops: [
      ['HOK', '香港', 'Hong Kong'], ['KOW', '九龍', 'Kowloon'], ['OLY', '奧運', 'Olympic'],
      ['NAC', '南昌', 'Nam Cheong'], ['LAK', '荔景', 'Lai King'], ['TSY', '青衣', 'Tsing Yi'],
      ['SUN', '欣澳', 'Sunny Bay'], ['TUC', '東涌', 'Tung Chung'],
    ],
    segs: [2, 2, 2, 4, 4, 8, 6],
  },
  {
    line: 'EAL', zh: '東鐵綫', en: 'East Rail Line',
    stops: [
      ['ADM', '金鐘', 'Admiralty'], ['EXC', '會展', 'Exhibition Centre'], ['HUH', '紅磡', 'Hung Hom'],
      ['MKK', '旺角東', 'Mong Kok East'], ['KOT', '九龍塘', 'Kowloon Tong'], ['TAW', '大圍', 'Tai Wai'],
      ['SHT', '沙田', 'Sha Tin'], ['FOT', '火炭', 'Fo Tan'], ['UNI', '大學', 'University'],
      ['TAP', '大埔墟', 'Tai Po Market'], ['TWO', '太和', 'Tai Wo'], ['FAN', '粉嶺', 'Fanling'],
      ['SHS', '上水', 'Sheung Shui'],
    ],
    // 羅湖／落馬洲刻意唔收：兩個都係口岸，唔會係試場，收咗只會多兩個
    // 搞亂搜尋嘅名。
    segs: [3, 3, 4, 3, 4, 3, 3, 3, 5, 3, 3, 3],
  },
  {
    line: 'TML', zh: '屯馬綫', en: 'Tuen Ma Line',
    stops: [
      ['TUM', '屯門', 'Tuen Mun'], ['SIH', '兆康', 'Siu Hong'], ['TIS', '天水圍', 'Tin Shui Wai'],
      ['LOP', '朗屏', 'Long Ping'], ['YUL', '元朗', 'Yuen Long'], ['KSR', '錦上路', 'Kam Sheung Road'],
      ['TWW', '荃灣西', 'Tsuen Wan West'], ['MEF', '美孚', 'Mei Foo'], ['NAC', '南昌', 'Nam Cheong'],
      ['AUS', '柯士甸', 'Austin'], ['ETS', '尖東', 'East Tsim Sha Tsui'], ['HUH', '紅磡', 'Hung Hom'],
      ['HOM', '何文田', 'Ho Man Tin'], ['TKW', '土瓜灣', 'To Kwa Wan'], ['SUW', '宋皇臺', 'Sung Wong Toi'],
      ['KAT', '啟德', 'Kai Tak'], ['DIH', '鑽石山', 'Diamond Hill'], ['HIK', '顯徑', 'Hin Keng'],
      ['TAW', '大圍', 'Tai Wai'], ['CKT', '車公廟', 'Che Kung Temple'], ['STW', '沙田圍', 'Sha Tin Wai'],
      ['CIO', '第一城', 'City One'], ['SHM', '石門', 'Shek Mun'], ['TSH', '大水坑', 'Tai Shui Hang'],
      ['HEO', '恆安', 'Heng On'], ['MOS', '馬鞍山', 'Ma On Shan'], ['WKS', '烏溪沙', 'Wu Kai Sha'],
    ],
    segs: [3, 5, 3, 2, 5, 7, 3, 2, 3, 2, 2, 3, 2, 2, 2, 2, 3, 2, 2, 2, 2, 2, 2, 2, 2, 2],
  },
  {
    line: 'SIL', zh: '南港島綫', en: 'South Island Line',
    stops: [
      ['ADM', '金鐘', 'Admiralty'], ['OCP', '海洋公園', 'Ocean Park'], ['WCH', '黃竹坑', 'Wong Chuk Hang'],
      ['LET', '利東', 'Lei Tung'], ['SOH', '海怡半島', 'South Horizons'],
    ],
    segs: [4, 2, 2, 2],
  },
]

/** 將軍澳綫康城支綫（唔喺主站序上，另外接）。 */
const BRANCHES: [string, string, string, [string, string, string], number][] = [
  ['TKL', 'TKO', 'LHP', ['LHP', '康城', 'LOHAS Park'], 4],
]

/**
 * 站與站之間要行路嘅接駁（唔算轉車，係真係要用腳）。
 * 收錄呢三條係因為佢哋喺實際行程入面經常出現，唔收就會計多十幾分鐘。
 */
const WALKS: [string, string, number][] = [
  ['CEN', 'HOK', 8],   // 中環 ↔ 香港：付費區行人隧道
  ['TST', 'ETS', 7],   // 尖沙咀 ↔ 尖東：長隧道
  ['MOK', 'MKK', 10],  // 旺角 ↔ 旺角東：地面街道，落雨會慢
]

/**
 * 轉車penalty（分鐘）：由落車到企好喺下一條線嘅月台。
 * 冇列出嘅站用 DEFAULT_INTERCHANGE。呢啲數係按實際月台佈局分三檔：
 * 同月台對面 2、要上落一層 3–4、要行長走廊 5。
 */
const INTERCHANGE: Record<string, number> = {
  MOK: 2, PRE: 2, YMT: 2, LAK: 2, NOP: 2, YAT: 2, TIK: 2, NAC: 2,
  CEN: 3, TAW: 3, HUH: 3, TSY: 3,
  QUB: 4, MEF: 4, DIH: 4, HOM: 4, KOT: 4, ADM: 4,
}
const DEFAULT_INTERCHANGE = 5

// ── 由上面嘅定義砌出車站表同圖 ─────────────────────────────────────────

const stationMap = new Map<string, Station>()
function reg(id: string, zh: string, en: string, line: string) {
  const s = stationMap.get(id)
  if (s) { if (!s.lines.includes(line)) s.lines.push(line); return }
  stationMap.set(id, { id, zh, en, lines: [line] })
}
for (const L of LINES) for (const [id, zh, en] of L.stops) reg(id, zh, en, L.line)
for (const [line, , , [id, zh, en]] of BRANCHES) reg(id, zh, en, line)

export const STATIONS: Station[] = [...stationMap.values()]

/** 圖嘅節點係「車站＋線」，唔係淨係車站 —— 咁先分得出轉車嘅成本。 */
const node = (sta: string, line: string) => `${sta}@${line}`
const adj = new Map<string, { to: string; mins: number }[]>()
function link(a: string, b: string, mins: number) {
  if (!adj.has(a)) adj.set(a, [])
  if (!adj.has(b)) adj.set(b, [])
  adj.get(a)!.push({ to: b, mins })
  adj.get(b)!.push({ to: a, mins })
}

for (const L of LINES) {
  for (let i = 0; i < L.segs.length; i++) {
    link(node(L.stops[i][0], L.line), node(L.stops[i + 1][0], L.line), L.segs[i])
  }
}
for (const [line, from, to, , mins] of BRANCHES) link(node(from, line), node(to, line), mins)

// 同一站不同線之間 = 轉車
for (const s of STATIONS) {
  const p = INTERCHANGE[s.id] ?? DEFAULT_INTERCHANGE
  for (let i = 0; i < s.lines.length; i++)
    for (let j = i + 1; j < s.lines.length; j++)
      link(node(s.id, s.lines[i]), node(s.id, s.lines[j]), p)
}

// 行路接駁：兩邊每條線都要接
for (const [a, b, mins] of WALKS) {
  const sa = stationMap.get(a), sb = stationMap.get(b)
  if (!sa || !sb) continue
  for (const la of sa.lines) for (const lb of sb.lines) link(node(a, la), node(b, lb), mins)
}

// ── 地方名 → 車站 ─────────────────────────────────────────────────────

/**
 * 冇自己車站嘅地方 → 最就腳嗰個站。
 *
 * 呢張表存在嘅原因好實際：用戶舉嘅例子入面，「小西灣」根本冇港鐵站。
 * 一個只認得車站名嘅搜尋框，喺小西灣嗰位學生手上就係一個死胡同 ——
 * 佢唔會知自己「應該」打柴灣。所以要接受佢真係住嗰個地方名。
 *
 * ⚠️ 只收【行得到或者一程短車到】嘅地方。離島、赤柱、西貢市中心
 * 呢類冇合理港鐵接駁嘅，故意唔收 —— 硬砌一個「最近站」會出一個
 * 差幾十分鐘嘅車程，比搵唔到仲危險。嗰啲情況要用巴士模式。
 */
const ALIASES: [string, string][] = [
  ['小西灣', 'CHW'], ['環翠', 'CHW'],
  ['石澳', 'SKW'], ['筲箕灣避風塘', 'SKW'],
  ['鰂魚涌公園', 'QUB'], ['康怡', 'TAK'], ['太古城', 'TAK'],
  ['北角碼頭', 'NOP'], ['大坑', 'TIH'], ['跑馬地', 'CAB'],
  ['薄扶林', 'HKU'], ['數碼港', 'HKU'], ['石塘咀', 'HKU'],
  ['香港仔', 'WCH'], ['田灣', 'WCH'], ['華富', 'WCH'], ['鴨脷洲', 'LET'],
  ['慈雲山', 'DIH'], ['鑽石山荷里活', 'DIH'],
  ['秀茂坪', 'KWT'], ['麗港城', 'LAT'], ['佐敦谷', 'KOB'],
  ['九龍城', 'SUW'], ['土瓜灣道', 'TKW'], ['又一村', 'KOT'],
  ['日出康城', 'LHP'], ['將軍澳市中心', 'TKO'],
  ['沙田市中心', 'SHT'], ['新城市廣場', 'SHT'], ['大埔', 'TAP'], ['大埔中心', 'TAP'],
  ['馬灣', 'TSY'], ['深井', 'TSW'], ['葵涌', 'KWF'],
  ['洪水橋', 'TIS'], ['屯門市中心', 'TUM'], ['大澳', 'TUC'],
]

const norm = (s: string) => s.trim().toLowerCase().replace(/[\s·・．.。,，]/g, '')

const lookup = new Map<string, string>()
for (const s of STATIONS) {
  lookup.set(norm(s.zh), s.id)
  lookup.set(norm(s.zh + '站'), s.id)
  lookup.set(norm(s.en), s.id)
  lookup.set(norm(s.id), s.id)
}
for (const [name, id] of ALIASES) lookup.set(norm(name), id)

export interface Resolved {
  station: Station
  /** true = 用戶打嘅名唔係車站名，係由 ALIASES 對過去（UI 要講返俾佢知）。 */
  viaAlias: boolean
}

/** 由用戶打嘅地方名搵車站。搵唔到就 null —— 唔猜、唔 fuzzy。 */
export function resolvePlace(input: string): Resolved | null {
  const k = norm(input)
  if (!k) return null
  const id = lookup.get(k) ?? lookup.get(k.replace(/站$/, ''))
  if (!id) return null
  const station = stationMap.get(id)
  if (!station) return null
  return { station, viaAlias: norm(station.zh) !== k && norm(station.en) !== k }
}

/** 搜尋框嘅 datalist 用：所有車站名 + 所有別名。 */
export function suggestNames(en = false): string[] {
  const names = STATIONS.map((s) => (en ? s.en : s.zh))
  if (!en) names.push(...ALIASES.map(([n]) => n))
  return names.sort((a, b) => a.localeCompare(b, en ? 'en' : 'zh-HK'))
}

// ── 最短路 ────────────────────────────────────────────────────────────

export interface Leg {
  /** 線代碼；'WALK' = 要行過去 */
  line: string
  fromId: string
  toId: string
  minutes: number
}

export interface Journey {
  /** 純車程（含轉車行路時間），分鐘，已向上取整 */
  minutes: number
  /**
   * 企喺月台等車嘅時間：第一程 3 分鐘 + 每次轉車 2 分鐘。
   *
   * 分開一個欄位而唔係加落 minutes，係因為對住實測數要對得返數 ——
   * 未加候車之前，本模組出嘅時間比港鐵官方行程規劃低 3–5 分鐘，
   * 而且轉得越多次低得越犀利（將軍澳→銅鑼灣 18 對 22、
   * 天水圍→柴灣 64 對 70）。個差額嘅形狀就係「等車」。
   * 加返之後兩邊對得上，而且學生喺介面度見到呢一行，
   * 佢自己知道呢個唔係港鐵嘅官方數字。
   */
  waitMinutes: number
  /** 轉車次數 */
  interchanges: number
  legs: Leg[]
  /** 上車站（用嚟拎實時班次）—— 只有呢一個站會傳去伺服器 */
  boardLine: string
  boardStation: string
}

export function lineLabel(code: string, en = false): string {
  const L = LINES.find((l) => l.line === code)
  if (!L) return code
  return en ? L.en : L.zh
}

/**
 * 只作【顯示】用嘅站名，唔喺路線圖入面。
 *
 * 港鐵實時班次個 `dest` 係站代碼，而終點站唔一定係我哋 routing 收錄嘅站。
 * 羅湖同落馬洲就係咁：兩個都係口岸，唔會係試場，所以唔收入圖（收咗只會
 * 多兩個搞亂搜尋嘅名）—— 但東鐵綫嘅車真係開去嗰度，一個上水出發嘅學生
 * 會喺班次表見到佢哋。冇呢張表就會出返「往 LOW」，即係我哋啱啱先由
 * 輸入框剷走嘅代碼，由上游繞返入顯示層。
 */
const DEST_ONLY: Record<string, [string, string]> = {
  LOW: ['羅湖', 'Lo Wu'],
  LMC: ['落馬洲', 'Lok Ma Chau'],
}

export function stationLabel(id: string, en = false): string {
  const s = stationMap.get(id)
  if (s) return en ? s.en : s.zh
  const d = DEST_ONLY[id]
  if (d) return en ? d[1] : d[0]
  return id
}

/**
 * 由 A 站去 B 站嘅最短行程。
 *
 * 用最樸素嘅 Dijkstra（線性搵最細）—— 全圖得 ~130 個節點，
 * 加個 binary heap 慳到嘅時間量度唔到，但會多一舊要維護嘅碼。
 */
export function planJourney(fromId: string, toId: string): Journey | null {
  if (fromId === toId) {
    const s = stationMap.get(fromId)
    if (!s) return null
    return { minutes: 0, waitMinutes: 0, interchanges: 0, legs: [], boardLine: s.lines[0], boardStation: fromId }
  }
  const from = stationMap.get(fromId), to = stationMap.get(toId)
  if (!from || !to) return null

  const dist = new Map<string, number>()
  const prev = new Map<string, string>()
  const done = new Set<string>()
  for (const l of from.lines) dist.set(node(fromId, l), 0)

  for (;;) {
    let cur: string | null = null
    let best = Infinity
    for (const [n, d] of dist) if (!done.has(n) && d < best) { best = d; cur = n }
    if (cur === null) break
    done.add(cur)
    if (cur.startsWith(`${toId}@`)) break
    for (const e of adj.get(cur) ?? []) {
      if (done.has(e.to)) continue
      const nd = best + e.mins
      if (nd < (dist.get(e.to) ?? Infinity)) { dist.set(e.to, nd); prev.set(e.to, cur) }
    }
  }

  let end: string | null = null
  let endD = Infinity
  for (const l of to.lines) {
    const d = dist.get(node(toId, l))
    if (d !== undefined && d < endD) { endD = d; end = node(toId, l) }
  }
  if (end === null) return null

  // 倒推路徑，再把連續同線嘅節點併成一段 leg。
  const path: string[] = []
  for (let n: string | undefined = end; n; n = prev.get(n)) path.unshift(n)

  const legs: Leg[] = []
  for (let i = 0; i < path.length - 1; i++) {
    const [aSta, aLine] = path[i].split('@')
    const [bSta, bLine] = path[i + 1].split('@')
    const mins = (adj.get(path[i]) ?? []).find((e) => e.to === path[i + 1])?.mins ?? 0
    // 同站換線 = 轉車，唔係一段行程；併入下一段嘅時間就得。
    const kind = aSta === bSta ? (aLine === bLine ? aLine : 'CHANGE') : (aLine === bLine ? aLine : 'WALK')
    const last = legs[legs.length - 1]
    if (last && last.line === kind && last.toId === aSta) {
      last.toId = bSta; last.minutes += mins
    } else {
      legs.push({ line: kind, fromId: aSta, toId: bSta, minutes: mins })
    }
  }
  // 把 CHANGE 嘅時間攤入前後，唔另外列一段（學生唔需要見到「轉車 4 分鐘」呢一行）
  const merged: Leg[] = []
  for (const l of legs) {
    if (l.line === 'CHANGE') {
      if (merged.length) merged[merged.length - 1].minutes += l.minutes
      else if (legs.length > 1) legs[1].minutes += l.minutes
      continue
    }
    merged.push(l)
  }

  const boardLeg = merged[0]
  const interchanges = Math.max(0, merged.filter((l) => l.line !== 'WALK').length - 1)
  return {
    minutes: Math.ceil(endD),
    waitMinutes: 3 + 2 * interchanges,
    interchanges,
    legs: merged,
    boardLine: boardLeg ? boardLeg.line : from.lines[0],
    boardStation: fromId,
  }
}
