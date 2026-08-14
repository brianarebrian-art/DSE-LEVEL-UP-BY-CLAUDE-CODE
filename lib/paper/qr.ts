// QR 碼編碼器 —— 零依賴，純函數，輸出布林矩陣供 SVG 繪製。
//
// ── 為何自行實作，而非引入套件 ──────────────────────────────────────────────
// `paper.ts` 檔頭已記錄：卷號刻意設計成「學生打得返、掃得返，不含任何個人資料」，
// 當時唯一未做 QR 的理由是「不使用 QR library（零新 dependency）」。成本紅線禁止
// 新增套件，故此處自行實作編碼器，令掃描這條原定用法得以成立，同時不新增依賴。
//
// 注意：當初被否決的是「QR 內含 localStorage session key」的設計（私隱外洩 +
// 綁定裝置）。本實作編碼的是公開卷號深連結，不含任何個人資料，與該否決無衝突。
//
// ── 實作範圍 ────────────────────────────────────────────────────────────────
// 位元組模式（byte mode）、糾錯等級 M、版本 1–10。卷號深連結約 120 位元組，
// 版本 10-M 容量 271 位元組，餘裕充足。刻意不支援全部 40 個版本：版本表需人手
// 抄錄，抄錄越多出錯機會越大，而超出的容量本專案永遠用不著。
//
// 糾錯選 M（約可復原 15%）而非 L：試卷會被摺疊、書寫、放在桌面沾污，紙面污損
// 是實際情況，不宜取最低等級。
//
// 遮罩（mask）八種全部實作並按標準罰分規則擇優 —— 罰分規則的作用正是確保實體
// 掃描可靠度（避免大面積同色、避免與定位圖案混淆），對印刷用途不可省略。

// ── GF(256) 有限體，供 Reed-Solomon 使用。本原多項式 0x11d ────────────────
const EXP = new Uint8Array(512)
const LOG = new Uint8Array(256)
{
  let x = 1
  for (let i = 0; i < 255; i++) {
    EXP[i] = x
    LOG[x] = i
    x <<= 1
    if (x & 0x100) x ^= 0x11d
  }
  for (let i = 255; i < 512; i++) EXP[i] = EXP[i - 255]
}
const gfMul = (a: number, b: number): number => (a === 0 || b === 0 ? 0 : EXP[LOG[a] + LOG[b]])

/** 產生 n 次的 Reed-Solomon 生成多項式，係數由最高次項排起。 */
function rsGenerator(n: number): Uint8Array {
  let poly = new Uint8Array([1])
  for (let i = 0; i < n; i++) {
    const next = new Uint8Array(poly.length + 1)
    for (let j = 0; j < poly.length; j++) {
      next[j] ^= poly[j]
      next[j + 1] ^= gfMul(poly[j], EXP[i])
    }
    poly = next
  }
  return poly
}

/** 計算 data 的糾錯碼字（多項式除法餘式）。 */
function rsEncode(data: Uint8Array, ecLen: number): Uint8Array {
  const gen = rsGenerator(ecLen)
  const buf = new Uint8Array(data.length + ecLen)
  buf.set(data)
  for (let i = 0; i < data.length; i++) {
    const factor = buf[i]
    if (factor === 0) continue
    for (let j = 0; j < gen.length; j++) buf[i + j] ^= gfMul(gen[j], factor)
  }
  return buf.slice(data.length)
}

// ── 版本表（糾錯等級 M，版本 1–10）─────────────────────────────────────────
// [每區塊糾錯碼字, 第一組區塊數, 第一組每區塊資料碼字, 第二組區塊數, 第二組每區塊資料碼字]
// 自校驗：總碼字數 = Σ(區塊數 × (資料 + 糾錯))，須等於 TOTAL_CODEWORDS 同項。
const ECC_M: readonly (readonly [number, number, number, number, number])[] = [
  [10, 1, 16, 0, 0], // v1
  [16, 1, 28, 0, 0], // v2
  [26, 1, 44, 0, 0], // v3
  [18, 2, 32, 0, 0], // v4
  [24, 2, 43, 0, 0], // v5
  [16, 4, 27, 0, 0], // v6
  [18, 4, 31, 0, 0], // v7
  [22, 2, 38, 2, 39], // v8
  [22, 3, 36, 2, 37], // v9
  [26, 4, 43, 1, 44], // v10
]
const TOTAL_CODEWORDS = [26, 44, 70, 100, 134, 172, 196, 242, 292, 346]

/** 校準圖案中心座標（版本 1 無校準圖案）。 */
const ALIGN: readonly (readonly number[])[] = [
  [], [6, 18], [6, 22], [6, 26], [6, 30], [6, 34],
  [6, 22, 38], [6, 24, 42], [6, 26, 46], [6, 28, 50],
]

const sizeOf = (version: number) => 17 + 4 * version
const dataCapacity = (version: number): number => {
  const [ec, b1, d1, b2, d2] = ECC_M[version - 1]
  void ec
  return b1 * d1 + b2 * d2
}

// ── 位元串流 ────────────────────────────────────────────────────────────────
class BitBuffer {
  private bits: number[] = []
  put(value: number, length: number) {
    for (let i = length - 1; i >= 0; i--) this.bits.push((value >>> i) & 1)
  }
  get length() {
    return this.bits.length
  }
  toBytes(): Uint8Array {
    const out = new Uint8Array(Math.ceil(this.bits.length / 8))
    this.bits.forEach((b, i) => {
      if (b) out[i >> 3] |= 0x80 >> (i & 7)
    })
    return out
  }
}

/** UTF-8 編碼。卷號深連結為 ASCII，但保留正確處理以免日後傳入非 ASCII 時靜默出錯。 */
function utf8(text: string): Uint8Array {
  return new TextEncoder().encode(text)
}

/** 選出足以容納 payload 的最小版本。 */
function pickVersion(byteLen: number): number {
  for (let v = 1; v <= 10; v++) {
    // 模式指示碼 4 位 + 字元數（v1–9 為 8 位，v10 為 16 位）+ 資料
    const countBits = v < 10 ? 8 : 16
    if (4 + countBits + byteLen * 8 <= dataCapacity(v) * 8) return v
  }
  throw new Error(`QR payload 過長（${byteLen} 位元組），超出版本 10-M 容量`)
}

/** 產生完整碼字串流（資料 + 糾錯，已按標準交錯）。 */
function buildCodewords(text: string, version: number): Uint8Array {
  const data = utf8(text)
  const capacity = dataCapacity(version)
  const bb = new BitBuffer()
  bb.put(0b0100, 4) // 位元組模式
  bb.put(data.length, version < 10 ? 8 : 16)
  for (const byte of data) bb.put(byte, 8)

  // 結束符最多 4 位，且不得超出容量
  const remaining = capacity * 8 - bb.length
  bb.put(0, Math.min(4, remaining))
  // 補至位元組邊界
  if (bb.length % 8 !== 0) bb.put(0, 8 - (bb.length % 8))

  const bytes = Array.from(bb.toBytes())
  // 交替填充碼字，直至填滿資料容量
  const PAD = [0xec, 0x11]
  for (let i = 0; bytes.length < capacity; i++) bytes.push(PAD[i % 2])

  // 分區塊 → 各自計糾錯 → 交錯
  const [ecLen, b1, d1, b2, d2] = ECC_M[version - 1]
  const blocks: { data: Uint8Array; ec: Uint8Array }[] = []
  let offset = 0
  for (let i = 0; i < b1 + b2; i++) {
    const len = i < b1 ? d1 : d2
    const chunk = Uint8Array.from(bytes.slice(offset, offset + len))
    offset += len
    blocks.push({ data: chunk, ec: rsEncode(chunk, ecLen) })
  }

  const out: number[] = []
  const maxData = Math.max(d1, d2)
  for (let i = 0; i < maxData; i++) {
    for (const blk of blocks) if (i < blk.data.length) out.push(blk.data[i])
  }
  for (let i = 0; i < ecLen; i++) {
    for (const blk of blocks) out.push(blk.ec[i])
  }

  if (out.length !== TOTAL_CODEWORDS[version - 1]) {
    throw new Error(`碼字數不符：版本 ${version} 應為 ${TOTAL_CODEWORDS[version - 1]}，實得 ${out.length}`)
  }
  return Uint8Array.from(out)
}

// ── 矩陣構築 ────────────────────────────────────────────────────────────────
type Grid = { m: (boolean | null)[][]; reserved: boolean[][]; size: number }

function blankGrid(size: number): Grid {
  return {
    size,
    m: Array.from({ length: size }, () => Array<boolean | null>(size).fill(null)),
    reserved: Array.from({ length: size }, () => Array<boolean>(size).fill(false)),
  }
}

function place(g: Grid, r: number, c: number, dark: boolean) {
  g.m[r][c] = dark
  g.reserved[r][c] = true
}

function drawFinder(g: Grid, top: number, left: number) {
  for (let r = -1; r <= 7; r++) {
    for (let c = -1; c <= 7; c++) {
      const rr = top + r
      const cc = left + c
      if (rr < 0 || cc < 0 || rr >= g.size || cc >= g.size) continue
      const inRing = (r >= 0 && r <= 6 && (c === 0 || c === 6)) || (c >= 0 && c <= 6 && (r === 0 || r === 6))
      const inCore = r >= 2 && r <= 4 && c >= 2 && c <= 4
      place(g, rr, cc, inRing || inCore)
    }
  }
}

function drawAlignment(g: Grid, version: number) {
  const centers = ALIGN[version - 1]
  for (const r of centers) {
    for (const c of centers) {
      // 與三個定位圖案重疊者略過
      if ((r === 6 && c === 6) || (r === 6 && c === centers[centers.length - 1]) ||
          (r === centers[centers.length - 1] && c === 6)) continue
      for (let dr = -2; dr <= 2; dr++) {
        for (let dc = -2; dc <= 2; dc++) {
          const ring = Math.max(Math.abs(dr), Math.abs(dc))
          place(g, r + dr, c + dc, ring !== 1)
        }
      }
    }
  }
}

function drawFunctionPatterns(g: Grid, version: number) {
  drawFinder(g, 0, 0)
  drawFinder(g, 0, g.size - 7)
  drawFinder(g, g.size - 7, 0)
  // 時序圖案
  for (let i = 8; i < g.size - 8; i++) {
    place(g, 6, i, i % 2 === 0)
    place(g, i, 6, i % 2 === 0)
  }
  drawAlignment(g, version)
  // 固定深色模組
  place(g, g.size - 8, 8, true)
  // 預留格式資訊區（值稍後填入）
  for (let i = 0; i < 9; i++) {
    if (!g.reserved[8][i]) place(g, 8, i, false)
    if (!g.reserved[i][8]) place(g, i, 8, false)
  }
  for (let i = 0; i < 8; i++) {
    if (!g.reserved[8][g.size - 1 - i]) place(g, 8, g.size - 1 - i, false)
    if (!g.reserved[g.size - 1 - i][8]) place(g, g.size - 1 - i, 8, false)
  }
  // 預留版本資訊區（版本 7 以上）
  if (version >= 7) {
    for (let i = 0; i < 6; i++) {
      for (let j = 0; j < 3; j++) {
        place(g, i, g.size - 11 + j, false)
        place(g, g.size - 11 + j, i, false)
      }
    }
  }
}

/** 之字形填入資料位元（由右下角起，每次兩欄，跳過第 6 欄）。 */
function placeData(g: Grid, codewords: Uint8Array) {
  let bitIndex = 0
  const totalBits = codewords.length * 8
  let upward = true
  for (let right = g.size - 1; right > 0; right -= 2) {
    if (right === 6) right = 5 // 第 6 欄為時序圖案，整欄跳過
    for (let step = 0; step < g.size; step++) {
      const r = upward ? g.size - 1 - step : step
      for (const c of [right, right - 1]) {
        if (g.reserved[r][c]) continue
        let dark = false
        if (bitIndex < totalBits) {
          dark = ((codewords[bitIndex >> 3] >> (7 - (bitIndex & 7))) & 1) === 1
        }
        g.m[r][c] = dark
        bitIndex++
      }
    }
    upward = !upward
  }
}

const MASKS: ((r: number, c: number) => boolean)[] = [
  (r, c) => (r + c) % 2 === 0,
  (r) => r % 2 === 0,
  (_r, c) => c % 3 === 0,
  (r, c) => (r + c) % 3 === 0,
  (r, c) => (Math.floor(r / 2) + Math.floor(c / 3)) % 2 === 0,
  (r, c) => ((r * c) % 2) + ((r * c) % 3) === 0,
  (r, c) => (((r * c) % 2) + ((r * c) % 3)) % 2 === 0,
  (r, c) => (((r + c) % 2) + ((r * c) % 3)) % 2 === 0,
]

/** BCH(15,5) 格式資訊。等級 M 的兩位指示碼為 0b00。 */
function formatBits(maskId: number): number {
  const data = (0b00 << 3) | maskId
  let rem = data << 10
  for (let i = 4; i >= 0; i--) {
    if ((rem >>> (i + 10)) & 1) rem ^= 0b10100110111 << i
  }
  return ((data << 10) | rem) ^ 0b101010000010010
}

/** BCH(18,6) 版本資訊（版本 7 以上）。 */
function versionBits(version: number): number {
  let rem = version << 12
  for (let i = 5; i >= 0; i--) {
    if ((rem >>> (i + 12)) & 1) rem ^= 0b1111100100101 << i
  }
  return (version << 12) | rem
}

function applyFormatAndVersion(m: boolean[][], size: number, version: number, maskId: number) {
  const fmt = formatBits(maskId)
  const bit = (n: number) => ((fmt >> n) & 1) === 1
  // 第一份副本圍繞左上定位圖案：位元 0–5 沿【第 8 欄】向下，位元 9–14 沿
  // 【第 8 列】向左。兩者方向不可互換 —— 寫成轉置版本時 Vision 完全解不到碼。
  for (let i = 0; i <= 5; i++) m[i][8] = bit(i)
  m[7][8] = bit(6)
  m[8][8] = bit(7)
  m[8][7] = bit(8)
  for (let i = 9; i <= 14; i++) m[8][14 - i] = bit(i)

  for (let i = 0; i <= 7; i++) m[size - 1 - i][8] = bit(i)
  for (let i = 8; i <= 14; i++) m[8][size - 15 + i] = bit(i)
  m[size - 8][8] = true // 固定深色模組

  if (version >= 7) {
    const ver = versionBits(version)
    for (let i = 0; i < 18; i++) {
      const on = ((ver >> i) & 1) === 1
      m[Math.floor(i / 3)][size - 11 + (i % 3)] = on
      m[size - 11 + (i % 3)][Math.floor(i / 3)] = on
    }
  }
}

/** 標準罰分規則 1–4。分數越低越適合掃描。 */
function penalty(m: boolean[][], size: number): number {
  let score = 0

  // 規則 1：同色連續 5 格以上
  for (let i = 0; i < size; i++) {
    for (const line of [m[i], m.map((row) => row[i])]) {
      let run = 1
      for (let j = 1; j < size; j++) {
        if (line[j] === line[j - 1]) {
          run++
        } else {
          if (run >= 5) score += 3 + (run - 5)
          run = 1
        }
      }
      if (run >= 5) score += 3 + (run - 5)
    }
  }

  // 規則 2：2×2 同色方塊
  for (let r = 0; r < size - 1; r++) {
    for (let c = 0; c < size - 1; c++) {
      const v = m[r][c]
      if (v === m[r][c + 1] && v === m[r + 1][c] && v === m[r + 1][c + 1]) score += 3
    }
  }

  // 規則 3：與定位圖案相似的 1:1:3:1:1 序列
  const P1 = [true, false, true, true, true, false, true, false, false, false, false]
  const P2 = [false, false, false, false, true, false, true, true, true, false, true]
  const match = (line: boolean[], start: number, pat: boolean[]) =>
    pat.every((v, k) => line[start + k] === v)
  for (let i = 0; i < size; i++) {
    for (const line of [m[i], m.map((row) => row[i])]) {
      for (let j = 0; j + 11 <= size; j++) {
        if (match(line, j, P1) || match(line, j, P2)) score += 40
      }
    }
  }

  // 規則 4：深色比例偏離 50%
  let dark = 0
  for (let r = 0; r < size; r++) for (let c = 0; c < size; c++) if (m[r][c]) dark++
  const pct = (dark * 100) / (size * size)
  score += Math.floor(Math.abs(pct - 50) / 5) * 10

  return score
}

/**
 * 將文字編碼為 QR 布林矩陣（true = 深色模組）。不含靜區（quiet zone）——
 * 靜區由繪製層負責，因為它屬於留白而非模組。
 */
export function encodeQR(text: string): boolean[][] {
  const version = pickVersion(utf8(text).length)
  const size = sizeOf(version)
  const codewords = buildCodewords(text, version)

  const base = blankGrid(size)
  drawFunctionPatterns(base, version)
  placeData(base, codewords)

  let best: boolean[][] | null = null
  let bestScore = Infinity
  for (let maskId = 0; maskId < 8; maskId++) {
    const m = base.m.map((row, r) =>
      row.map((v, c) => {
        const val = v ?? false
        return base.reserved[r][c] ? val : val !== MASKS[maskId](r, c)
      }),
    )
    applyFormatAndVersion(m, size, version, maskId)
    const s = penalty(m, size)
    if (s < bestScore) {
      bestScore = s
      best = m
    }
  }
  return best as boolean[][]
}
