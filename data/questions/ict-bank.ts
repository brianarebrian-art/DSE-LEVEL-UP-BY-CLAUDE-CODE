import type { Question } from './types'
import { createBank, n, qty, type TopicMeta, type FwMeta } from './_parametric'

// ═══════════════════════════════════════════════════════════════════════════
// ict-bank.ts —— ICT 參數化母模板（2026-08-29）
// ---------------------------------------------------------------------------
// 為何另立檔案而非併入 applied-banks.ts：
// applied-banks.ts 的 ICT 部分只涵蓋三個【計算型】課題
// （ict_data_rep_calc / ict_logic_algo / ict_network_calc），而該三者恰好
// 已是全科最厚的三個（62 / 27 / 24）。若僅擴充它們，ICT 將由
// 「10 個課題最薄 12 最厚 62」變成「3 個課題各三百餘條、7 個課題各十餘條」，
// 直接違反目標第 3 條「各科內部課題數量必須平均分配」。
//
// 因此本檔所做的是相反的事：為原本被視為純概念的 7 個課題，找出其確實可以
// correct-by-construction 出題的部分 ——
//   資料庫    → 記錄大小、關係基數、聯繫表欄位數
//   電腦系統  → 位址線與定址空間、快取命中率、時脈與指令數
//   網絡      → 子網主機數、傳播延遲與傳輸時間
//   多媒體    → 音訊檔案大小、壓縮比、色深
//   程式編寫  → 巢狀迴圈次數、二分搜尋比較次數、氣泡排序比較次數
//   資訊保安  → 金鑰空間、密碼組合數、同位檢查
//   資料表示  → 二補碼、字元編碼所需空間
// 答案全部由數字算出，毋須人手審批（與 math / chemistry / m2 各批相同）。
//
// ⚠️ 每個迴圈的輸出量必須先估算後撰寫。企會財一役的教訓：擴闊一個迴圈令
// 利息課題由 88 條跳至 190 條，其後須以四輪反覆收窄。本檔每個模板均刻意封頂。
//
// 退化組合（四個選項並非互不相同）由 createBank().add() 靜默丟棄並登記，
// 不會報錯，故每次修改後均須重新統計各課題的實際產出數量。
// ═══════════════════════════════════════════════════════════════════════════

const T = {
  data: { id: 'data_representation', zh: '資料表示與處理', en: 'Data Representation & Processing' },
  systems: { id: 'computer_systems', zh: '電腦系統與硬件', en: 'Computer Systems & Hardware' },
  network: { id: 'networking', zh: '網絡與互聯網', en: 'Networking & the Internet' },
  programming: { id: 'programming', zh: '程式編寫與算法', en: 'Programming & Algorithms' },
  database: { id: 'databases', zh: '資料庫', en: 'Databases' },
  security: { id: 'security_ethics', zh: '資訊保安與道德', en: 'Security & Ethics' },
  web: { id: 'multimedia_web', zh: '多媒體與網絡技術', en: 'Multimedia & Web' },
} satisfies Record<string, TopicMeta>

const FW = {
  logic: { id: 'logic', zh: '邏輯推理', en: 'Logical Reasoning', emoji: '🧠' },
  apply: { id: 'apply', zh: '應用分析', en: 'Application', emoji: '🛠️' },
} satisfies Record<string, FwMeta>

const b = createBank('ict')

/** 由候選值中選出三個與正解相異、彼此亦不重複的干擾項。
    若直接寫死四條算式，特定參數下會有兩條算出同一數值，整組被靜默丟棄。 */
const distract = (correct: number, cands: number[]): number[] =>
  cands.filter((v, i, a) => v !== correct && a.indexOf(v) === i).slice(0, 3)

// ── 資料庫 ────────────────────────────────────────────────────────────────

// DB1 — 資料表大小 = 記錄大小 × 記錄數
for (const rec of [64, 80, 96, 120, 128, 160, 200, 256]) {
  for (const rows of [500, 1000, 2500, 5000]) {
    const kb = (rec * rows) / 1024
    if (!Number.isInteger(kb)) continue
    const d = distract(kb, [rec * rows, kb / 2, kb * 2, rec + rows])
    if (d.length < 3) continue
    b.add(`ictb_db1_${rec}_${rows}`, T.database, FW.apply, 'medium',
      [`一個資料表每筆記錄佔 ${rec} 位元組，共有 ${rows} 筆記錄。該資料表的大小是多少 KB？（1 KB = 1024 位元組）`,
       `Each record in a table occupies ${rec} bytes and there are ${rows} records. What is the table size in KB? (1 KB = 1024 bytes)`],
      [qty(kb, 'KB', 'KB'), ...d.map((v) => qty(v, 'KB', 'KB'))],
      [`資料表大小 = 記錄大小 × 記錄數 = $${rec} \\times ${rows} = ${rec * rows}$ 位元組，再除以 1024 得 ${kb} KB。要留意單位：題目給的是位元組，答案要求 KB，中間一定要除 1024。常見失分是算完位元組就直接作答，或者把記錄大小與記錄數相加。`,
       `Table size = record size × number of records = $${rec} \\times ${rows} = ${rec * rows}$ bytes, then divide by 1024 to get ${kb} KB. Watch the units: the data are in bytes and the answer is asked in KB, so the division by 1024 is compulsory. Marks are commonly lost by stopping at the byte figure, or by adding the record size to the record count.`])
  }
}

// DB2 — 規範化：複合主鍵所需的欄位數
for (const ent of [2, 3, 4]) {
  for (const attr of [3, 4, 5, 6, 7, 8]) {
    const total = ent + attr
    const d = distract(total, [attr, ent, attr * ent, attr - ent])
    if (d.length < 3) continue
    b.add(`ictb_db2_${ent}_${attr}`, T.database, FW.logic, 'medium',
      [`一個多對多關係由 ${ent} 個實體構成，聯繫表本身另有 ${attr} 個描述屬性。該聯繫表合共有多少個欄位？`,
       `A many-to-many relationship links ${ent} entities, and the junction table carries ${attr} descriptive attributes of its own. How many fields does the junction table have in total?`],
      [qty(total, '個', ''), ...d.map((v) => qty(v, '個', ''))],
      [`聯繫表要為【每一個】參與實體各存一個外鍵，共 ${ent} 個；再加上它自己的 ${attr} 個描述屬性，合共 $${ent} + ${attr} = ${total}$ 個欄位。這 ${ent} 個外鍵合起來構成複合主鍵。常見錯誤是只數描述屬性而忘記外鍵，或者以為外鍵可以合併成一個欄位。`,
       `A junction table stores one foreign key for EACH participating entity, giving ${ent}, plus its own ${attr} descriptive attributes: $${ent} + ${attr} = ${total}$ fields in all. Those ${ent} foreign keys together form the composite primary key. The usual errors are counting only the descriptive attributes, or assuming the foreign keys can be collapsed into a single field.`])
  }
}

// DB3 — 查詢結果的最大列數（笛卡兒積）
for (const a of [4, 5, 6, 8, 10, 12]) {
  for (const c of [3, 5, 7, 9, 11, 15]) {
    const prod = a * c
    const d = distract(prod, [a + c, Math.max(a, c), Math.abs(a - c)])
    if (d.length < 3) continue
    b.add(`ictb_db3_${a}_${c}`, T.database, FW.logic, 'hard',
      [`兩個資料表分別有 ${a} 筆與 ${c} 筆記錄。若查詢時遺漏了連接條件，結果最多會有多少列？`,
       `Two tables hold ${a} and ${c} records. If the join condition is omitted from the query, how many rows can the result contain at most?`],
      [qty(prod, '列', 'rows'), ...d.map((v) => qty(v, '列', 'rows'))],
      [`遺漏連接條件時，資料庫會產生【笛卡兒積】：左表每一筆都與右表每一筆配對一次，故列數 = $${a} \\times ${c} = ${prod}$。這正是漏寫連接條件最容易被發現的徵狀 —— 結果列數遠多於任何一個表。答 $${a + c}$ 是把兩表相加，那是聯集而非連接的結果。`,
       `With no join condition the database forms the CARTESIAN PRODUCT: every row on the left pairs with every row on the right, so the count is $${a} \\times ${c} = ${prod}$. That is exactly how a missing join condition announces itself — the result is far larger than either table. Answering $${a + c}$ adds the tables, which is what a union does, not a join.`])
  }
}

// ── 電腦系統與硬件 ────────────────────────────────────────────────────────

// SY1 — 位址線數目與可定址空間
for (const bits of [8, 10, 12, 14, 16, 18, 20, 22, 24]) {
  const cells = 2 ** bits
  const d = distract(cells, [2 ** (bits - 1), 2 ** (bits + 1), bits * 1024])
  if (d.length < 3) continue
  b.add(`ictb_sy1_${bits}`, T.systems, FW.apply, 'medium',
    [`某處理器有 ${bits} 條位址線。它最多可以定址多少個記憶體單元？`,
     `A processor has ${bits} address lines. How many memory locations can it address at most?`],
    [n(`$2^{${bits}} = ${cells}$`), ...d.map((v) => n(`$${v}$`))],
    [`每條位址線只有 0 與 1 兩個狀態，${bits} 條線就有 $2^{${bits}} = ${cells}$ 個相異組合，每個組合對應一個記憶體單元。要記住的是位址線數目與可定址空間之間是【指數】關係：多加一條線，空間就翻一倍，而不是多一個單元。`,
     `Each address line has just two states, 0 and 1, so ${bits} lines give $2^{${bits}} = ${cells}$ distinct combinations, one per memory location. The relationship between address lines and addressable space is EXPONENTIAL: one extra line doubles the space rather than adding one location.`])
}

// SY2 — 快取命中率與平均存取時間
for (const hit of [80, 85, 90, 95]) {
  for (const cache of [2, 4, 5]) {
    for (const main of [50, 60, 80, 100]) {
      const avg = (hit * cache + (100 - hit) * main) / 100
      if (!Number.isInteger(avg)) continue
      const d = distract(avg, [(cache + main) / 2, main - cache, cache * 2])
        .filter((v) => Number.isInteger(v))
      if (d.length < 3) continue
      b.add(`ictb_sy2_${hit}_${cache}_${main}`, T.systems, FW.apply, 'hard',
        [`某系統的快取命中率為 ${hit}%，快取存取時間 ${cache} ns，主記憶體存取時間 ${main} ns。平均存取時間是多少？`,
         `A system has a cache hit rate of ${hit}%, a cache access time of ${cache} ns and a main memory access time of ${main} ns. What is the average access time?`],
        [qty(avg, 'ns', 'ns'), ...d.map((v) => qty(v, 'ns', 'ns'))],
        [`平均存取時間是按命中與未命中的【比例】加權：$${hit}\\% \\times ${cache} + ${100 - hit}\\% \\times ${main} = ${avg}$ ns。命中率越高，平均值就越貼近快取本身的速度 —— 這正是快取有效的原因。常見錯誤是把兩個時間直接取平均，那等於假設命中率固定為 50%。`,
         `Average access time weights hit and miss by their PROPORTIONS: $${hit}\\% \\times ${cache} + ${100 - hit}\\% \\times ${main} = ${avg}$ ns. The higher the hit rate, the closer the average sits to the cache's own speed, which is precisely why caching works. A common error is to take a plain average of the two times, which assumes a fixed 50% hit rate.`])
    }
  }
}

// SY3 — 時脈頻率與指令執行數
for (const ghz of [1.2, 1.6, 2, 2.4, 3, 3.2]) {
  for (const cpi of [2, 4, 5, 8]) {
    const mips = (ghz * 1000) / cpi
    if (!Number.isInteger(mips)) continue
    const d = distract(mips, [ghz * 1000 * cpi, ghz * 1000, mips / 2])
      .filter((v) => Number.isInteger(v))
    if (d.length < 3) continue
    b.add(`ictb_sy3_${String(ghz).replace('.', '')}_${cpi}`, T.systems, FW.apply, 'hard',
      [`某處理器時脈為 ${ghz} GHz，平均每條指令需時 ${cpi} 個時脈週期。它每秒可執行多少百萬條指令？`,
       `A processor runs at ${ghz} GHz and takes ${cpi} clock cycles per instruction on average. How many million instructions can it execute per second?`],
      [n(`$${mips}$`), ...d.map((v) => n(`$${v}$`))],
      [`${ghz} GHz 即每秒 $${ghz} \\times 10^9$ 個時脈週期。每條指令用 ${cpi} 個週期，故每秒指令數 = $\\dfrac{${ghz} \\times 10^9}{${cpi}} = ${mips} \\times 10^6$，即 ${mips} 百萬條。要點是週期數要【除】以每指令週期數而非相乘 —— 每條指令用得越多週期，每秒能做的指令就越少。`,
       `${ghz} GHz means $${ghz} \\times 10^9$ clock cycles per second. At ${cpi} cycles per instruction the rate is $\\dfrac{${ghz} \\times 10^9}{${cpi}} = ${mips} \\times 10^6$, that is ${mips} million. The point is that cycles are DIVIDED by cycles-per-instruction, not multiplied: the more cycles each instruction needs, the fewer instructions fit in a second.`])
  }
}

// ── 網絡與互聯網 ──────────────────────────────────────────────────────────

// NW1 — 子網可用主機數 = 2^h − 2
for (const h of [3, 4, 5, 6, 7, 8, 9, 10, 11, 12]) {
  const usable = 2 ** h - 2
  const d = distract(usable, [2 ** h, 2 ** h - 1, 2 ** (h - 1) - 2])
  if (d.length < 3) continue
  b.add(`ictb_nw1_${h}`, T.network, FW.apply, 'hard',
    [`某子網的主機部分佔 ${h} 個位元。該子網可分配給主機的位址有多少個？`,
     `A subnet leaves ${h} bits for the host portion. How many addresses can be assigned to hosts?`],
    [n(`$2^{${h}} - 2 = ${usable}$`), ...d.map((v) => n(`$${v}$`))],
    [`${h} 個主機位元共有 $2^{${h}} = ${2 ** h}$ 個位址，但其中兩個【不能分配給主機】：全 0 是網絡位址，全 1 是廣播位址，故可用數為 $${2 ** h} - 2 = ${usable}$。答 $${2 ** h}$ 忘記扣除；答 $${2 ** h - 1}$ 只扣了一個。這條「減二」是子網劃分題最常見的失分位。`,
     `${h} host bits give $2^{${h}} = ${2 ** h}$ addresses, but two of them CANNOT go to a host: all zeros is the network address and all ones is the broadcast address, leaving $${2 ** h} - 2 = ${usable}$. Answering $${2 ** h}$ forgets the deduction; $${2 ** h - 1}$ deducts only one. This "minus two" is where subnetting questions are most often lost.`])
}

// NW2 — 總延遲 = 傳播延遲 + 傳輸時間
for (const prop of [10, 20, 25, 40, 50]) {
  for (const mb of [2, 4, 5, 8, 10]) {
    for (const mbps of [8, 16, 20]) {
      const tx = (mb * 8 * 1000) / mbps
      if (!Number.isInteger(tx)) continue
      const total = tx + prop
      const d = distract(total, [tx, prop, tx - prop, tx * 2])
      if (d.length < 3) continue
      b.add(`ictb_nw2_${prop}_${mb}_${mbps}`, T.network, FW.apply, 'hard',
        [`要把 ${mb} MB 的檔案經 ${mbps} Mbps 的鏈路傳送，單程傳播延遲為 ${prop} ms。由開始傳送到最後一位元抵達，共需多少毫秒？`,
         `A ${mb} MB file is sent over a ${mbps} Mbps link with a one-way propagation delay of ${prop} ms. How many milliseconds pass between the start of transmission and the arrival of the last bit?`],
        [qty(total, '毫秒', 'ms'), ...d.map((v) => qty(v, '毫秒', 'ms'))],
        [`總時間由兩部分組成，兩者性質不同。傳輸時間 = 資料量 ÷ 頻寬 = $\\dfrac{${mb} \\times 8}{${mbps}} = ${tx / 1000}$ 秒 = ${tx} 毫秒，取決於檔案大小；傳播延遲 ${prop} 毫秒則取決於距離，與檔案大小無關。兩者相加得 ${total} 毫秒。要留意 MB 是位元組而 Mbps 是位元，中間必須乘 8。`,
         `The total has two parts of different nature. Transmission time = data ÷ bandwidth = $\\dfrac{${mb} \\times 8}{${mbps}} = ${tx / 1000}$ s = ${tx} ms, which depends on file size; propagation delay of ${prop} ms depends on distance and not on file size at all. Together they give ${total} ms. Note that MB is bytes while Mbps is bits, so the factor of 8 is compulsory.`])
    }
  }
}

// ── 多媒體與網絡技術 ──────────────────────────────────────────────────────

// MM1 — 未壓縮音訊檔案大小
for (const khz of [8, 22, 44, 48]) {
  for (const depth of [8, 16, 24]) {
    for (const ch of [1, 2]) {
      for (const sec of [10, 30, 60]) {
        const kb = (khz * 1000 * depth * ch * sec) / 8 / 1024
        if (!Number.isInteger(kb)) continue
        const d = distract(kb, [kb * 8, kb / ch, kb * 2, khz * depth * sec])
          .filter((v) => Number.isInteger(v))
        if (d.length < 3) continue
        b.add(`ictb_mm1_${khz}_${depth}_${ch}_${sec}`, T.web, FW.apply, 'hard',
          [`一段 ${sec} 秒的未壓縮音訊，取樣頻率 ${khz} kHz、量化位元 ${depth} 位元、${ch} 個聲道。檔案大小是多少 KB？（1 KB = 1024 位元組）`,
           `An uncompressed audio clip lasts ${sec} s at a ${khz} kHz sampling rate, ${depth}-bit depth and ${ch} channel(s). What is the file size in KB? (1 KB = 1024 bytes)`],
          [qty(kb, 'KB', 'KB'), ...d.map((v) => qty(v, 'KB', 'KB'))],
          [`未壓縮音訊大小 = 取樣頻率 × 量化位元 × 聲道數 × 時間，算出來的單位是【位元】，故要除 8 換成位元組，再除 1024 換成 KB：$\\dfrac{${khz}000 \\times ${depth} \\times ${ch} \\times ${sec}}{8 \\times 1024} = ${kb}$ KB。四個因子缺一不可，最常漏的是聲道數，其次是忘記除 8。`,
           `Uncompressed audio size = sampling rate × bit depth × channels × duration, which yields BITS, so divide by 8 for bytes and again by 1024 for KB: $\\dfrac{${khz}000 \\times ${depth} \\times ${ch} \\times ${sec}}{8 \\times 1024} = ${kb}$ KB. All four factors are needed; the channel count is the one most often dropped, followed by the division by 8.`])
      }
    }
  }
}

// MM2 — 壓縮比
for (const orig of [200, 400, 500, 800, 1000, 1200, 1600, 2000]) {
  for (const ratio of [2, 4, 5, 8, 10]) {
    const comp = orig / ratio
    if (!Number.isInteger(comp)) continue
    const saved = orig - comp
    const d = distract(saved, [comp, orig, orig + comp, saved / 2]).filter((v) => Number.isInteger(v))
    if (d.length < 3) continue
    b.add(`ictb_mm2_${orig}_${ratio}`, T.web, FW.apply, 'medium',
      [`一個 ${orig} KB 的檔案以 ${ratio}:1 的壓縮比壓縮。壓縮後節省了多少 KB？`,
       `A ${orig} KB file is compressed at a ratio of ${ratio}:1. How many KB are saved?`],
      [qty(saved, 'KB', 'KB'), ...d.map((v) => qty(v, 'KB', 'KB'))],
      [`${ratio}:1 表示壓縮後大小為原本的 $\\dfrac{1}{${ratio}}$，即 $\\dfrac{${orig}}{${ratio}} = ${comp}$ KB。題目問的是【節省】了多少，故要用原大小減去壓縮後大小：$${orig} - ${comp} = ${saved}$ KB。答 ${comp} 是壓縮後的大小而非節省量 —— 這兩者的分別是本題唯一的考點。`,
       `A ratio of ${ratio}:1 means the compressed file is $\\dfrac{1}{${ratio}}$ of the original, that is $\\dfrac{${orig}}{${ratio}} = ${comp}$ KB. The question asks what is SAVED, so subtract: $${orig} - ${comp} = ${saved}$ KB. Answering ${comp} gives the compressed size instead of the saving, and that distinction is the whole point of the question.`])
  }
}

// MM3 — 色深與可表示顏色數
for (const bits of [1, 2, 4, 8, 12, 16, 24]) {
  const cols = 2 ** bits
  const d = distract(cols, [bits * 2, 2 ** (bits - 1), bits ** 2])
  if (d.length < 3) continue
  b.add(`ictb_mm3_${bits}`, T.web, FW.apply, 'easy',
    [`某影像的色深為 ${bits} 位元。每個像素最多可表示多少種顏色？`,
     `An image has a colour depth of ${bits} bits. How many colours can each pixel represent at most?`],
    [n(`$2^{${bits}} = ${cols}$`), ...d.map((v) => n(`$${v}$`))],
    [`色深指每個像素用多少位元記錄顏色，$${bits}$ 個位元有 $2^{${bits}} = ${cols}$ 種相異組合，每種對應一種顏色。這裡同樣是【指數】關係：色深由 8 增至 16 位元，顏色數並非加倍，而是由 256 變成 65536。`,
     `Colour depth is the number of bits recording each pixel's colour; $${bits}$ bits give $2^{${bits}} = ${cols}$ distinct combinations, one per colour. The relationship is again EXPONENTIAL: raising the depth from 8 to 16 bits does not double the palette but takes it from 256 to 65536.`])
}

// ── 程式編寫與算法 ────────────────────────────────────────────────────────

// PG1 — 巢狀迴圈的執行次數
for (const i of [3, 4, 5, 6, 8, 10, 12]) {
  for (const j of [4, 5, 6, 7, 9, 11]) {
    const times = i * j
    const d = distract(times, [i + j, i ** 2, j ** 2, Math.abs(i - j)])
    if (d.length < 3) continue
    b.add(`ictb_pg1_${i}_${j}`, T.programming, FW.logic, 'easy',
      [`外層迴圈執行 ${i} 次，其內每次都執行一個 ${j} 次的內層迴圈。最內層的敘述句合共執行多少次？`,
       `An outer loop runs ${i} times, and each pass runs an inner loop ${j} times. How many times does the innermost statement execute in total?`],
      [qty(times, '次', 'times'), ...d.map((v) => qty(v, '次', 'times'))],
      [`巢狀迴圈的總次數是【相乘】而非相加：外層每執行一次，內層就完整跑 ${j} 次，故總數 = $${i} \\times ${j} = ${times}$ 次。答 $${i + j}$ 是把兩層相加，那對應的是兩個並列（而非巢狀）的迴圈。判斷時先看內層是否寫在外層的迴圈體之內。`,
       `Nested loops MULTIPLY rather than add: each pass of the outer loop runs the inner loop through all ${j} iterations, so the total is $${i} \\times ${j} = ${times}$. Answering $${i + j}$ adds the two, which is what two loops placed side by side would give. Check whether the inner loop sits inside the outer loop's body.`])
  }
}

// PG2 — 線性搜尋 vs 二分搜尋的最壞比較次數
for (const p of [4, 5, 6, 7, 8, 9, 10, 11, 12]) {
  const nItems = 2 ** p
  const d = distract(p, [nItems, nItems / 2, p * 2])
  if (d.length < 3) continue
  b.add(`ictb_pg2_${p}`, T.programming, FW.logic, 'medium',
    [`一個已排序的陣列有 ${nItems} 個元素。用二分搜尋法，最壞情況下需要比較多少次？`,
     `A sorted array holds ${nItems} elements. In the worst case, how many comparisons does a binary search need?`],
    [qty(p, '次', 'times'), ...d.map((v) => qty(v, '次', 'times'))],
    [`二分搜尋每比較一次就把搜尋範圍減半，故最壞情況的比較次數是把 ${nItems} 連續除以 2 直至剩下 1 的次數，即 $\\log_2 ${nItems} = ${p}$。對比線性搜尋的最壞情況 ${nItems} 次，差距隨資料量增大而急速拉開 —— 這正是二分搜尋要求資料【必須先排序】仍然值得的原因。`,
       `Binary search halves the search range with every comparison, so the worst case is the number of times ${nItems} can be halved down to 1, that is $\\log_2 ${nItems} = ${p}$. Against linear search's worst case of ${nItems}, the gap widens sharply as data grow — which is why binary search is worth its precondition that the data MUST already be sorted.`])
}

// PG3 — 氣泡排序第一輪的比較次數
for (const m of [5, 6, 7, 8, 9, 10, 12, 15, 20, 25]) {
  const first = m - 1
  const totalPass = (m * (m - 1)) / 2
  const d = distract(first, [m, totalPass, m + 1])
  if (d.length < 3) continue
  b.add(`ictb_pg3_${m}`, T.programming, FW.logic, 'medium',
    [`用氣泡排序法處理 ${m} 個元素的陣列，第一輪需要進行多少次相鄰比較？`,
     `Bubble sort is applied to an array of ${m} elements. How many adjacent comparisons take place in the first pass?`],
    [qty(first, '次', 'comparisons'), ...d.map((v) => qty(v, '次', 'comparisons'))],
    [`第一輪由頭到尾逐對相鄰元素比較，${m} 個元素之間有 $${m} - 1 = ${first}$ 對相鄰位置，故比較 ${first} 次。答 ${m} 是把元素數當成比較次數；答 ${totalPass} 是【全部輪次】的總比較次數 $\\dfrac{${m}(${m}-1)}{2}$，而題目只問第一輪。`,
     `The first pass compares each adjacent pair from one end to the other; ${m} elements have $${m} - 1 = ${first}$ adjacent positions, hence ${first} comparisons. Answering ${m} mistakes the element count for the comparison count; ${totalPass} is the total over ALL passes, $\\dfrac{${m}(${m}-1)}{2}$, whereas the question asks only about the first.`])
}

// ── 資訊保安與道德 ────────────────────────────────────────────────────────

// SE1 — 金鑰空間
for (const k of [4, 6, 8, 10, 12, 16, 20, 24, 32]) {
  const space = 2 ** k
  const d = distract(space, [k * 2, 2 ** (k / 2), k ** 2]).filter((v) => Number.isInteger(v))
  if (d.length < 3) continue
  b.add(`ictb_se1_${k}`, T.security, FW.apply, 'medium',
    [`某加密系統使用 ${k} 位元金鑰。可能的金鑰共有多少個？`,
     `An encryption system uses a ${k}-bit key. How many possible keys are there?`],
    [n(`$2^{${k}} = ${space}$`), ...d.map((v) => n(`$${v}$`))],
    [`每個位元有 0 與 1 兩種取值，${k} 個位元就有 $2^{${k}} = ${space}$ 個相異金鑰。金鑰長度每增加一位元，暴力破解所需的嘗試次數就【翻一倍】—— 這就是為何由 56 位元升級到 128 位元不是「安全兩倍多」，而是安全性差距大到無法比較。`,
     `Each bit takes two values, so ${k} bits give $2^{${k}} = ${space}$ distinct keys. Every extra bit DOUBLES the work a brute-force attack must do — which is why moving from 56-bit to 128-bit keys is not "about twice as safe" but a difference too large to compare meaningfully.`])
}

// SE2 — 密碼組合數（字元集大小 ^ 長度）
for (const set of [10, 26, 36, 62]) {
  for (const len of [3, 4, 5, 6]) {
    const combos = set ** len
    if (combos > 1e12) continue
    const d = distract(combos, [set * len, len ** set, combos / set]).filter((v) => Number.isInteger(v) && v > 0)
    if (d.length < 3) continue
    b.add(`ictb_se2_${set}_${len}`, T.security, FW.apply, 'hard',
      [`密碼長度為 ${len} 個字元，每個位置可從 ${set} 個字元中選取，且可重複。可能的密碼共有多少個？`,
       `A password is ${len} characters long and each position is chosen from a set of ${set} characters, with repetition allowed. How many passwords are possible?`],
      [n(`$${set}^{${len}} = ${combos}$`), ...d.map((v) => n(`$${v}$`))],
      [`每個位置獨立地有 ${set} 個選擇，${len} 個位置就是 $${set}^{${len}} = ${combos}$ 個組合。注意底數是【字元集大小】、指數是【密碼長度】，兩者掉轉會得出完全不同的數量級。由此亦可見：加長密碼比擴大字元集更有效，因為長度在指數位置。`,
       `Each position independently has ${set} choices, so ${len} positions give $${set}^{${len}} = ${combos}$ combinations. The base is the CHARACTER SET SIZE and the exponent is the PASSWORD LENGTH; swapping them changes the order of magnitude entirely. It also shows why lengthening a password beats enlarging the character set: length sits in the exponent.`])
  }
}

// SE3 — 偶同位檢查位
for (const bitsStr of ['1011000', '1100101', '1110001', '0110110', '1010101', '1111000',
  '0011011', '1001110', '0101101', '1101011', '0111100', '1000111',
  '0010110', '1011101', '0100011', '1110110', '0001111', '1100011']) {
  const ones = bitsStr.split('').filter((c) => c === '1').length
  const parity = ones % 2 === 0 ? 0 : 1
  b.add(`ictb_se3_${bitsStr}`, T.security, FW.logic, 'medium',
    [`資料位元為 $${bitsStr}$，採用【偶同位】。同位檢查位應為何？`,
     `The data bits are $${bitsStr}$ and EVEN parity is used. What should the parity bit be?`],
    [n(`$${parity}$`), n(`$${1 - parity}$`), n(`$${ones}$`), n(`$${bitsStr.length}$`)],
    [`偶同位要求【連同同位檢查位在內】，1 的總數為偶數。資料中的 1 有 ${ones} 個，${ones % 2 === 0 ? '已經是偶數，故同位檢查位為 0' : '是奇數，故同位檢查位要補上 1'}。要記住同位檢查只能偵測【奇數個】位元出錯，兩個位元同時翻轉便偵測不到 —— 這是它的固有限制。`,
     `Even parity requires the number of 1s, COUNTING THE PARITY BIT ITSELF, to be even. The data contain ${ones} ones, which is ${ones % 2 === 0 ? 'already even, so the parity bit is 0' : 'odd, so the parity bit must be 1'}. Note that a parity check detects only an ODD number of bit errors; two simultaneous flips pass undetected, which is its inherent limitation.`])
}

// ── 資料表示與處理 ────────────────────────────────────────────────────────

// DR1 — 8 位元二補碼表示負數
for (let v = 1; v <= 40; v++) {
  if (v % 2 !== 0 && v % 3 !== 0) continue
  const tc = (256 - v).toString(2).padStart(8, '0')
  const sm = '1' + v.toString(2).padStart(7, '0')
  const ones = (255 - v).toString(2).padStart(8, '0')
  if (new Set([tc, sm, ones]).size < 3) continue
  b.add(`ictb_dr1_${v}`, T.data, FW.apply, 'hard',
    [`用 8 位元二補碼表示 $-${v}$，結果是甚麼？`,
     `What is $-${v}$ represented as an 8-bit two's complement number?`],
    [n(`$${tc}$`), n(`$${sm}$`), n(`$${ones}$`), n(`$${v.toString(2).padStart(8, '0')}$`)],
    [`二補碼的求法：先寫出 $+${v}$ 的 8 位元二進位 $${v.toString(2).padStart(8, '0')}$，逐位取反得 $${ones}$，再加 1 得 $${tc}$。陷阱：$${sm}$ 是【符號—數值】表示法（最高位當符號位）；$${ones}$ 只做了取反而未加 1，那是一補碼。二補碼被普遍採用，是因為它只有一個零，而且加減法可以用同一套電路完成。`,
     `To form the two's complement, write $+${v}$ in eight bits as $${v.toString(2).padStart(8, '0')}$, invert every bit to get $${ones}$, then add one to get $${tc}$. Traps: $${sm}$ is SIGN-AND-MAGNITUDE, using the top bit as a sign; $${ones}$ stops after inverting and is the one's complement. Two's complement is standard because it has a single zero and lets one circuit handle both addition and subtraction.`])
}

// DR2 — 字元編碼所需的儲存空間
for (const chars of [100, 250, 500, 800, 1200, 2000, 3000, 5000]) {
  for (const enc of [1, 2, 4]) {
    const bytes = chars * enc
    const d = distract(bytes, [chars, chars * 8, bytes * 8])
    if (d.length < 3) continue
    b.add(`ictb_dr2_${chars}_${enc}`, T.data, FW.apply, 'easy',
      [`一份文件有 ${chars} 個字元，每個字元以 ${enc} 個位元組編碼。文件共佔多少位元組？`,
       `A document contains ${chars} characters, each encoded in ${enc} byte(s). How many bytes does it occupy?`],
      [qty(bytes, '位元組', 'bytes'), ...d.map((v) => qty(v, '位元組', 'bytes'))],
      [`所需空間 = 字元數 × 每字元位元組數 = $${chars} \\times ${enc} = ${bytes}$ 位元組。要分清【位元】與【位元組】：答 $${bytes * 8}$ 是把答案再乘 8，得出的是位元數。ASCII 每字元 1 個位元組，而中文字在 UTF-8 之下通常佔 3 個 —— 同樣字數的中文檔案因此比英文大。`,
       `Space = number of characters × bytes per character = $${chars} \\times ${enc} = ${bytes}$ bytes. Keep BITS and BYTES apart: $${bytes * 8}$ multiplies by eight again and gives a bit count. ASCII uses one byte per character while a Chinese character typically takes three under UTF-8, which is why a Chinese file of the same length is larger.`])
  }
}

export const ictBank3Questions: Question[] = b.bank
