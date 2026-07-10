import type { Question, Topic } from './types'
import { makeQ, topicList, type Pair, type TopicMeta, type FwMeta } from './_builder'

// ════════════════════════════════════════════════════════════════════════════
// ICT — multi-step "hell" set (genuine 5★★). Every numeric/bit answer is
// hand-verified; distractors are the standard traps (forgetting the +1 in two's
// complement, bits vs bytes, MB vs Mb in bandwidth, dropping the absorption law,
// linear vs log search count). All hard.
// ════════════════════════════════════════════════════════════════════════════

const q = makeQ('ict')
const opt = (zh: string, en: string): Pair => [zh, en]
const C = (zh: string, en: string): Pair => [zh, en]

const T = {
  rep:   { id: 'ict_data_rep_calc', zh: '資料表示計算', en: 'Data representation — calculation' },
  logic: { id: 'ict_logic_algo',    zh: '邏輯與算法',   en: 'Logic & algorithms' },
  net:   { id: 'ict_network_calc',  zh: '網絡計算',     en: 'Networking — calculation' },
} satisfies Record<string, TopicMeta>

const FW = {
  logic: { id: 'logic', zh: '邏輯推理', en: 'Logical Reasoning', emoji: '🧠' },
  apply: { id: 'apply', zh: '應用分析', en: 'Application', emoji: '🛠️' },
} satisfies Record<string, FwMeta>

let uid = 0
const id = (p: string) => `icth_${p}_${++uid}`

// ── Data representation — calculation ────────────────────────────────────────
const rep: Question[] = [
  q(id('re'), T.rep, FW.apply, 'hard', 2024, 2,
    C('用 8 位元二補數（two’s complement）表示 −20，結果是？',
      'Represent −20 in 8-bit two’s complement. The result is?'),
    [opt('11101100', '11101100'),
      opt('11101011', '11101011'),
      opt('10010100', '10010100'),
      opt('00010100', '00010100')],
    C('+20 = 00010100。二補數步驟：逐位取反 → 11101011，再加 1 → 11101100。\n（驗算：11101100 取反 00010011 +1 = 00010100 = 20，故代表 −20。）\n\n【陷阱】11101011 漏了最後「+1」（只是一補數）；10010100 是符號–數值法（最高位當符號）；00010100 是正 20。',
      '+20 = 00010100. Two’s complement: invert all bits → 11101011, then add 1 → 11101100.\n(Check: invert 11101100 → 00010011, +1 = 00010100 = 20, so it is −20.)\n\n【Trap】 11101011 omits the final +1 (that is one’s complement); 10010100 is sign-and-magnitude; 00010100 is +20.')),

  q(id('re'), T.rep, FW.apply, 'hard', 2023, 2,
    C('一幅未經壓縮的點陣圖像，解像度 1024 × 768，色深 24 位元。其檔案大小是？',
      'An uncompressed bitmap image is 1024 × 768 with a colour depth of 24 bits. Its file size is?'),
    [opt('2,359,296 位元組（≈ 2.25 MiB）', '2,359,296 bytes (≈ 2.25 MiB)'),
      opt('786,432 位元組', '786,432 bytes'),
      opt('18,874,368 位元組', '18,874,368 bytes'),
      opt('25,165,824 位元組', '25,165,824 bytes')],
    C('像素數 = 1024 × 768 = 786,432。每像素 24 位元 = 3 位元組。檔案大小 = 786,432 × 3 = 2,359,296 位元組 = 2,359,296 ÷ 1,048,576 ≈ 2.25 MiB。\n\n【陷阱】786,432 當每像素 1 位元組（漏了 ×3）；18,874,368 是位元數（×24，未 ÷8）；25,165,824 = ×32 用錯色深。',
      'Pixels = 1024 × 768 = 786,432. 24 bits per pixel = 3 bytes. Size = 786,432 × 3 = 2,359,296 bytes = 2,359,296 ÷ 1,048,576 ≈ 2.25 MiB.\n\n【Trap】 786,432 uses 1 byte/pixel (drops ×3); 18,874,368 is the bit count (×24, not ÷8); 25,165,824 uses ×32 (wrong depth).')),
]

// ── Logic & algorithms ───────────────────────────────────────────────────────
const logic: Question[] = [
  q(id('lo'), T.logic, FW.logic, 'hard', 2024, 2,
    C('布林表達式 A AND (NOT A OR B) 可化簡為？',
      'The Boolean expression A AND (NOT A OR B) simplifies to?'),
    [opt('A AND B', 'A AND B'),
      opt('A', 'A'),
      opt('B', 'B'),
      opt('A OR B', 'A OR B')],
    C('展開：A·(Ā + B) = A·Ā + A·B = 0 + A·B = A·B = A AND B（A·Ā = 0 是互補律）。可用真值表逐行核對：只有 A=1 且 B=1 時為真。\n\n【陷阱】「A」忽略了 B 的限制；「B」忽略了 A；「A OR B」把 AND 當 OR。',
      'Expand: A·(Ā + B) = A·Ā + A·B = 0 + A·B = A·B = A AND B (A·Ā = 0 by complement). A truth table confirms: true only when A=1 and B=1.\n\n【Trap】 “A” drops the B condition; “B” drops A; “A OR B” swaps AND for OR.')),

  q(id('lo'), T.logic, FW.apply, 'hard', 2023, 2,
    C('對一個已排序、含 1000 個元素的陣列進行「二分搜尋」(binary search)，在最壞情況下所需的比較次數最接近？',
      'A binary search is run on a sorted array of 1000 elements. The worst-case number of comparisons is closest to?'),
    [opt('10', '10'),
      opt('1000', '1000'),
      opt('500', '500'),
      opt('100', '100')],
    C('二分搜尋每次比較把搜尋範圍減半，最壞次數 ≈ ⌈log₂ 1000⌉。2¹⁰ = 1024 > 1000 > 512 = 2⁹，故約 10 次。\n\n【陷阱】1000 是「線性搜尋」最壞次數；500 是線性搜尋平均；100 無對應算法依據。二分搜尋的威力正在於對數級增長。',
      'Each comparison halves the search range, so the worst case ≈ ⌈log₂ 1000⌉. Since 2¹⁰ = 1024 > 1000 > 512 = 2⁹, it is about 10.\n\n【Trap】 1000 is linear search’s worst case; 500 is its average; 100 has no algorithmic basis. Binary search’s power is its logarithmic growth.')),
]

// ── Networking — calculation ─────────────────────────────────────────────────
const net: Question[] = [
  q(id('ne'), T.net, FW.apply, 'hard', 2024, 2,
    C('以一條 8 Mbps（每秒 8 兆位元）的網絡連線傳送一個 12 MB（兆位元組）的檔案，忽略額外開銷，所需時間約為？',
      'A 12 MB (megabyte) file is sent over an 8 Mbps (megabit per second) link. Ignoring overhead, the time required is about?'),
    [opt('12 秒', '12 seconds'),
      opt('1.5 秒', '1.5 seconds'),
      opt('96 秒', '96 seconds'),
      opt('8 秒', '8 seconds')],
    C('關鍵是位元組 vs 位元：12 MB = 12 × 8 = 96 兆位元 (Mb)。時間 = 96 Mb ÷ 8 Mbps = 12 秒。\n\n【陷阱】1.5 秒 = 12 ÷ 8，直接用 MB 除 Mbps，漏了 ×8 換算（最常見錯誤）；96 秒誤把分子分母關係弄錯；8 秒無依據。',
      'The key is bytes vs bits: 12 MB = 12 × 8 = 96 megabits (Mb). Time = 96 Mb ÷ 8 Mbps = 12 seconds.\n\n【Trap】 1.5 s = 12 ÷ 8, dividing MB by Mbps without the ×8 conversion (the classic error); 96 s mishandles the ratio; 8 s has no basis.')),
]

export const ictHellQuestions: Question[] = [...rep, ...logic, ...net]

export const ictHellTopics: Topic[] = topicList([
  { topic: T.rep,   fw: FW.apply, count: rep.length },
  { topic: T.logic, fw: FW.logic, count: logic.length },
  { topic: T.net,   fw: FW.apply, count: net.length },
])
