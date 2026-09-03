import type { Question } from './types'
import { createBank, qty, type TopicMeta, type FwMeta } from './_parametric'

// ═══════════════════════════════════════════════════════════════════════════
// ict-bank4.ts —— ICT 參數化母模板・第二批（2026-09-03）
// ---------------------------------------------------------------------------
// 承接 ict-bank.ts。該檔為七個「概念型」課題找出可計算的部分，令 ICT 由
// 265 條增至 627 條。本檔處理餘下的分佈問題：全科十個課題之中，
// networking(101) 與 data_representation(99) 已達每課題約 100 條的目標，
// 而最薄的四個仍然是 ict_network_calc(24)、ict_logic_algo(27)、
// computer_systems(48)、security_ethics(58)。
//
// 故本檔【只】為這四個課題出題，一條都不加給已達標的課題 ——
// 目標第 3 條要求各課題平均分配，補在厚的地方等於把分佈推得更歪。
//
// ⚠️ 每個迴圈的輸出量先估算後撰寫（企會財一役的教訓：擴闊一個迴圈令單一
// 課題由 88 條跳至 190 條，其後須四輪反覆收窄）。本檔每個模板均刻意封頂，
// 寫完即以實測數字核對，不憑估算作結。
//
// 退化組合（四個選項並非互不相同）由 createBank().add() 靜默丟棄並登記，
// 故每次修改後均須重新統計實際產出。
// ═══════════════════════════════════════════════════════════════════════════

const T = {
  netcalc: { id: 'ict_network_calc', zh: '網絡計算', en: 'Networking — calculation' },
  logic: { id: 'ict_logic_algo', zh: '邏輯與算法', en: 'Logic & Algorithms' },
  systems: { id: 'computer_systems', zh: '電腦系統與硬件', en: 'Computer Systems & Hardware' },
  security: { id: 'security_ethics', zh: '資訊保安與道德', en: 'Security & Ethics' },
} satisfies Record<string, TopicMeta>

const FW = {
  logic: { id: 'logic', zh: '邏輯推理', en: 'Logical Reasoning', emoji: '🧠' },
  apply: { id: 'apply', zh: '應用分析', en: 'Application', emoji: '🛠️' },
} satisfies Record<string, FwMeta>

const b = createBank('ict')

/** 干擾項：剔除與正確答案相同者及重複者，取前三個。不足三個則整題丟棄。 */
const distract = (correct: number, cands: number[]): number[] =>
  cands.filter((v, i, a) => v !== correct && a.indexOf(v) === i).slice(0, 3)

// ── 網絡計算 ──────────────────────────────────────────────────────────────

// NC1 — 傳輸量 = 頻寬 × 時間（位元轉位元組須除以 8）
for (const mbps of [2, 4, 8, 16, 20, 24, 40, 80]) {
  for (const sec of [5, 10, 30, 60]) {
    const mb = (mbps * sec) / 8
    if (!Number.isInteger(mb)) continue
    const d = distract(mb, [mbps * sec, mb * 8, mbps + sec, mb / 2])
    if (d.length < 3) continue
    b.add(`ictb4_nc1_${mbps}_${sec}`, T.netcalc, FW.apply, 'easy',
      [`一條頻寬為 ${mbps} Mbps 的連線持續傳輸 ${sec} 秒。合共傳送了多少 MB 的資料？`,
       `A ${mbps} Mbps link transmits continuously for ${sec} seconds. How many MB of data are sent?`],
      [qty(mb, 'MB', 'MB'), ...d.map((v) => qty(v, 'MB', 'MB'))],
      [`頻寬以【位元】每秒計，檔案大小以【位元組】計，兩者相差八倍。先求位元數：$${mbps} \\times ${sec} = ${mbps * sec}$ Mb，再除以 8 得 ${mb} MB。答 $${mbps * sec}$ 是漏了除以 8，得出的是位元數而非位元組數 —— 這是本課題最常見的失分位，因為 Mbps 與 MB 只差一個字母。`,
       `Bandwidth is quoted in BITS per second while file sizes are in BYTES, a factor of eight apart. Bits first: $${mbps} \\times ${sec} = ${mbps * sec}$ Mb, then divide by 8 for ${mb} MB. Answering $${mbps * sec}$ omits the division and gives a bit count — the commonest slip here, since Mbps and MB differ by one letter.`])
  }
}

// NC2 — 子網可用主機數 = 2^h − 2（扣除網絡位址與廣播位址）
for (const host of [3, 4, 5, 6, 7, 8, 9, 10, 11, 12]) {
  const usable = 2 ** host - 2
  const d = distract(usable, [2 ** host, 2 ** host - 1, 2 ** (host - 1) - 2])
  if (d.length < 3) continue
  b.add(`ictb4_nc2_${host}`, T.netcalc, FW.logic, 'medium',
    [`某子網的位址之中有 ${host} 個位元屬於主機部分。該子網最多可分配多少個主機位址？`,
     `A subnet reserves ${host} bits for the host portion. How many host addresses can it assign at most?`],
    [qty(usable, '個', ''), ...d.map((v) => qty(v, '個', ''))],
    [`${host} 個主機位元合共可以表示 $2^{${host}} = ${2 ** host}$ 個位址，但其中兩個不能分配給主機：全 0 代表網絡本身，全 1 是廣播位址。故可用數目為 $${2 ** host} - 2 = ${usable}$。答 $${2 ** host}$ 是忘記扣除這兩個保留位址 —— 子網愈細，這兩個的比重愈大，切勿因為數目小而略過。`,
     `${host} host bits address $2^{${host}} = ${2 ** host}$ values, but two are unusable: all-zeros names the network itself and all-ones is the broadcast address. Usable count is $${2 ** host} - 2 = ${usable}$. Answering $${2 ** host}$ forgets the two reserved addresses — the smaller the subnet, the larger a share they represent, so never skip them because the number looks small.`])
}

// NC3 — 傳播延遲 = 距離 ÷ 訊號速度（以 200,000 km/s 計）
for (const km of [200, 400, 600, 1000, 1600, 2000, 3000, 4000]) {
  const ms = km / 200
  if (!Number.isInteger(ms)) continue
  const d = distract(ms, [km / 100, km / 300, km, ms * 2])
  if (d.length < 3) continue
  b.add(`ictb4_nc3_${km}`, T.netcalc, FW.apply, 'medium',
    [`訊號在光纖中的傳播速度約為每秒 200,000 公里。訊號傳送 ${km} 公里的傳播延遲約為多少毫秒？`,
     `A signal travels through fibre at about 200,000 km per second. What is the propagation delay over ${km} km, in milliseconds?`],
    [qty(ms, '毫秒', 'ms'), ...d.map((v) => qty(v, '毫秒', 'ms'))],
    [`傳播延遲 = 距離 ÷ 速度 = $${km} \\div 200000 = ${ms / 1000}$ 秒 = ${ms} 毫秒。要注意傳播延遲【與頻寬無關】：把線路加粗不會令訊號跑得快些，只會令同一時間內送出的資料多些。這是傳播延遲與傳輸時間的根本分別，也是本題設問的用意。`,
     `Propagation delay = distance ÷ speed = $${km} \\div 200000 = ${ms / 1000}$ s = ${ms} ms. Note that propagation delay is INDEPENDENT of bandwidth: a fatter pipe does not make the signal travel faster, it only lets more data leave per second. That distinction between propagation delay and transmission time is what this question tests.`])
}

// NC4 — 位址空間 = 2^(32 − 前綴長度)
for (const prefix of [20, 21, 22, 23, 24, 25, 26, 27, 28, 29]) {
  const total = 2 ** (32 - prefix)
  const d = distract(total, [2 ** (32 - prefix) - 2, 2 ** prefix, 32 - prefix])
  if (d.length < 3) continue
  b.add(`ictb4_nc4_${prefix}`, T.netcalc, FW.logic, 'medium',
    [`一個 IPv4 網絡以 /${prefix} 表示。該網絡合共包含多少個 IP 位址（未扣除保留位址）？`,
     `An IPv4 network is written as /${prefix}. How many IP addresses does it contain in total (before removing reserved addresses)?`],
    [qty(total, '個', ''), ...d.map((v) => qty(v, '個', ''))],
    [`IPv4 位址長 32 位元。前綴 /${prefix} 表示前 ${prefix} 位固定為網絡部分，餘下 $32 - ${prefix} = ${32 - prefix}$ 位可變，故位址總數為 $2^{${32 - prefix}} = ${total}$ 個。題目問的是【總數】，未扣除網絡位址與廣播位址；若問可分配的主機數，才需要減 2。看清楚問的是哪一個，是本題的關鍵。`,
     `An IPv4 address is 32 bits. A /${prefix} prefix fixes the first ${prefix} bits as the network part, leaving $32 - ${prefix} = ${32 - prefix}$ variable bits, so the block holds $2^{${32 - prefix}} = ${total}$ addresses. The question asks for the TOTAL, before removing the network and broadcast addresses; subtract 2 only when asked for assignable hosts. Reading which one is being asked is the whole of this question.`])
}

// NC5 — 封包數目 = 檔案大小 ÷ 有效載荷（不足一個封包亦須整個送出）
for (const kb of [100, 200, 400, 500, 800, 1000]) {
  for (const payload of [500, 1000, 1250]) {
    const packets = Math.ceil((kb * 1024) / payload)
    const d = distract(packets, [Math.floor((kb * 1024) / payload), Math.ceil(kb / payload), packets * 2])
    if (d.length < 3) continue
    b.add(`ictb4_nc5_${kb}_${payload}`, T.netcalc, FW.apply, 'hard',
      [`一個 ${kb} KB 的檔案要經網絡傳送，每個封包最多可載 ${payload} 位元組資料。最少需要多少個封包？（1 KB = 1024 位元組）`,
       `A ${kb} KB file is sent over a network where each packet carries at most ${payload} bytes of data. What is the minimum number of packets? (1 KB = 1024 bytes)`],
      [qty(packets, '個', ''), ...d.map((v) => qty(v, '個', ''))],
      [`檔案共 $${kb} \\times 1024 = ${kb * 1024}$ 位元組，每個封包載 ${payload} 位元組，故需 $${kb * 1024} \\div ${payload} = ${((kb * 1024) / payload).toFixed(2)}$ 個封包。封包不能切半，餘下的資料仍要一個完整封包來載，所以必須【向上取整】為 ${packets} 個。答 $${Math.floor((kb * 1024) / payload)}$ 是向下取整，等於把最後一段資料丟掉。`,
       `The file is $${kb} \\times 1024 = ${kb * 1024}$ bytes and each packet carries ${payload}, so $${kb * 1024} \\div ${payload} = ${((kb * 1024) / payload).toFixed(2)}$ packets are needed. A packet cannot be split, and the remainder still needs one whole packet, so the figure must be ROUNDED UP to ${packets}. Answering $${Math.floor((kb * 1024) / payload)}$ rounds down, which discards the final piece of the file.`])
  }
}

// ── 邏輯與算法 ────────────────────────────────────────────────────────────

// LA1 — 真值表列數 = 2^(輸入數)
for (const inputs of [2, 3, 4, 5, 6, 7, 8, 9, 10, 11]) {
  const rows = 2 ** inputs
  const d = distract(rows, [inputs * 2, 2 ** inputs - 1, inputs ** 2])
  if (d.length < 3) continue
  b.add(`ictb4_la1_${inputs}`, T.logic, FW.logic, 'easy',
    [`一個邏輯電路有 ${inputs} 個輸入。其真值表須列出多少行才能窮盡所有輸入組合？`,
     `A logic circuit has ${inputs} inputs. How many rows must its truth table have to cover every input combination?`],
    [qty(rows, '行', 'rows'), ...d.map((v) => qty(v, '行', 'rows'))],
    [`每個輸入只有 0 與 1 兩個取值，${inputs} 個輸入互相獨立，故組合數為 $2^{${inputs}} = ${rows}$ 行。答 $${inputs * 2}$ 是把輸入數乘 2，那是「兩倍」而非「二的次方」—— 兩者在輸入數為 2 時碰巧相等，正是這個巧合令不少人一直用錯公式而未被發現。`,
     `Each input takes only 0 or 1, and the ${inputs} inputs are independent, so there are $2^{${inputs}} = ${rows}$ combinations. Answering $${inputs * 2}$ doubles the input count, which is "twice" rather than "two to the power of" — the two happen to agree when there are 2 inputs, and that coincidence is exactly why the wrong rule often goes unnoticed.`])
}

// LA2 — 二分搜尋最壞比較次數 = ⌊log2 n⌋ + 1
for (const n2 of [7, 15, 31, 63, 127, 255, 511, 1023]) {
  const cmp = Math.floor(Math.log2(n2)) + 1
  const d = distract(cmp, [n2, Math.ceil(n2 / 2), cmp - 1])
  if (d.length < 3) continue
  b.add(`ictb4_la2_${n2}`, T.logic, FW.logic, 'medium',
    [`以二分搜尋法在一個已排序、含 ${n2} 個元素的陣列中尋找目標值。最壞情況下需要比較多少次？`,
     `Binary search is used on a sorted array of ${n2} elements. How many comparisons are needed in the worst case?`],
    [qty(cmp, '次', ''), ...d.map((v) => qty(v, '次', ''))],
    [`二分搜尋每比較一次就把搜尋範圍減半：${n2} → ${Math.floor(n2 / 2)} → ${Math.floor(n2 / 4)} → ⋯ 直至剩一個。次數為 $\\lfloor \\log_2 ${n2} \\rfloor + 1 = ${cmp}$ 次。答 $${n2}$ 是線性搜尋的最壞次數 —— 兩者的分別正是二分搜尋的價值所在：資料量增至一千倍，比較次數只增加約十次。`,
     `Each comparison halves the range: ${n2} → ${Math.floor(n2 / 2)} → ${Math.floor(n2 / 4)} → ⋯ down to one, giving $\\lfloor \\log_2 ${n2} \\rfloor + 1 = ${cmp}$ comparisons. Answering $${n2}$ is the worst case for LINEAR search — and the gap between the two is precisely the point of binary search: multiply the data by a thousand and the comparisons rise by about ten.`])
}

// LA3 — 巢狀迴圈執行次數 = 外層 × 內層
for (const outer of [3, 4, 5, 6, 8, 10, 12]) {
  for (const inner of [4, 6, 7, 9, 11, 15]) {
    const total = outer * inner
    const d = distract(total, [outer + inner, Math.max(outer, inner), total - outer])
    if (d.length < 3) continue
    b.add(`ictb4_la3_${outer}_${inner}`, T.logic, FW.apply, 'easy',
      [`一個外層迴圈執行 ${outer} 次，其內每次都完整執行一個 ${inner} 次的內層迴圈。內層迴圈的迴圈體合共執行多少次？`,
       `An outer loop runs ${outer} times, and each pass runs an inner loop of ${inner} iterations in full. How many times does the inner loop body execute in total?`],
      [qty(total, '次', ''), ...d.map((v) => qty(v, '次', ''))],
      [`外層每執行一次，內層就整個跑完 ${inner} 次，故總數為 $${outer} \\times ${inner} = ${total}$ 次。答 $${outer + inner}$ 是把兩者相加，那是兩個【並列】迴圈的情況；巢狀是相乘，並列才是相加。分辨方法只有一個：看內層迴圈是否寫在外層的迴圈體之內。`,
       `Each pass of the outer loop runs the inner loop through all ${inner} iterations, so the total is $${outer} \\times ${inner} = ${total}$. Answering $${outer + inner}$ adds them, which is what happens with two loops placed SIDE BY SIDE; nesting multiplies, sequencing adds. There is only one way to tell them apart: check whether the inner loop sits inside the outer loop's body.`])
  }
}

// LA4 — 氣泡排序總比較次數 = n(n−1)/2
for (const items of [5, 6, 7, 8, 9, 10, 12, 15, 20]) {
  const cmp = (items * (items - 1)) / 2
  const d = distract(cmp, [items * items, items - 1, items * (items - 1)])
  if (d.length < 3) continue
  b.add(`ictb4_la4_${items}`, T.logic, FW.logic, 'hard',
    [`以氣泡排序法處理 ${items} 個元素，且不設提早結束的檢查。合共需要比較多少次？`,
     `Bubble sort is run on ${items} elements with no early-exit check. How many comparisons are made in total?`],
    [qty(cmp, '次', ''), ...d.map((v) => qty(v, '次', ''))],
    [`第一輪比較 ${items - 1} 次，其後每輪因最大值已就位而少比較一次：$(${items - 1}) + (${items - 2}) + \\cdots + 1 = \\frac{${items} \\times ${items - 1}}{2} = ${cmp}$ 次。答 $${items * (items - 1)}$ 是漏了除以 2 —— 該式把每一對元素數了兩次，而比較是無序的，甲與乙比較一次即可。`,
     `The first pass makes ${items - 1} comparisons and each later pass makes one fewer, since the largest value is already in place: $(${items - 1}) + (${items - 2}) + \\cdots + 1 = \\frac{${items} \\times ${items - 1}}{2} = ${cmp}$. Answering $${items * (items - 1)}$ omits the division by two — that expression counts every pair twice, but a comparison is unordered: A against B happens once.`])
}

// LA5 — 線性搜尋平均比較次數（目標必定存在）= (n+1)/2
for (const n5 of [7, 9, 11, 15, 19, 25, 31, 49, 99]) {
  const avg = (n5 + 1) / 2
  if (!Number.isInteger(avg)) continue
  const d = distract(avg, [n5, Math.floor(n5 / 2), n5 - 1])
  if (d.length < 3) continue
  b.add(`ictb4_la5_${n5}`, T.logic, FW.logic, 'medium',
    [`以線性搜尋法在一個含 ${n5} 個元素的未排序陣列中尋找目標值。若目標必定存在且出現在任何位置的機會均等，平均需要比較多少次？`,
     `Linear search is used on an unsorted array of ${n5} elements. If the target is always present and equally likely to be at any position, how many comparisons are needed on average?`],
    [qty(avg, '次', ''), ...d.map((v) => qty(v, '次', ''))],
    [`目標在第 1 個位置需比較 1 次，在最後一個位置需比較 ${n5} 次，各位置機會均等，故平均為 $\\frac{1 + ${n5}}{2} = ${avg}$ 次。答 $${n5}$ 是最壞情況而非平均 —— 兩者是不同的問題，題目問哪一個必須看清楚。`,
     `A target in the first position takes 1 comparison and one in the last takes ${n5}; with all positions equally likely the average is $\\frac{1 + ${n5}}{2} = ${avg}$. Answering $${n5}$ gives the WORST case, not the average — they are different questions, and which one is being asked must be read carefully.`])
}

// ── 電腦系統與硬件 ────────────────────────────────────────────────────────

// SY_A — 平均存取時間 = 命中率 × 快取時間 + (1 − 命中率) × 主記憶體時間
for (const hit of [80, 85, 90, 95]) {
  for (const cache of [2, 5]) {
    for (const main of [50, 80, 100]) {
      const avg = (hit / 100) * cache + (1 - hit / 100) * main
      const r = Math.round(avg * 100) / 100
      const d = distract(r, [cache, main, Math.round(((cache + main) / 2) * 100) / 100])
      if (d.length < 3) continue
      b.add(`ictb4_sya_${hit}_${cache}_${main}`, T.systems, FW.apply, 'hard',
        [`某系統的快取命中率為 ${hit}%，快取存取時間 ${cache} 納秒，主記憶體存取時間 ${main} 納秒。平均存取時間約為多少納秒？`,
         `A system has a ${hit}% cache hit rate, a cache access time of ${cache} ns and a main memory access time of ${main} ns. What is the average access time, in ns?`],
        [qty(r, '納秒', 'ns'), ...d.map((v) => qty(v, '納秒', 'ns'))],
        [`平均存取時間 = 命中率 × 快取時間 + 未命中率 × 主記憶體時間 = $${hit / 100} \\times ${cache} + ${(1 - hit / 100).toFixed(2)} \\times ${main} = ${r}$ 納秒。留意答案【貼近快取時間而非兩者的中間值】：命中率高，絕大多數存取根本不會走到主記憶體。答中間值 $${Math.round(((cache + main) / 2) * 100) / 100}$ 是把兩個時間平均，等於當作各佔一半，忽略了命中率本身就是權重。`,
         `Average access time = hit rate × cache time + miss rate × memory time = $${hit / 100} \\times ${cache} + ${(1 - hit / 100).toFixed(2)} \\times ${main} = ${r}$ ns. Note the answer sits CLOSE TO THE CACHE TIME rather than midway: with a high hit rate, most accesses never reach main memory. Answering the midpoint $${Math.round(((cache + main) / 2) * 100) / 100}$ averages the two times, treating them as equally frequent and ignoring that the hit rate is itself the weight.`])
    }
  }
}

// SY_B — MIPS = 時脈頻率(MHz) ÷ 每指令周期數
for (const mhz of [400, 800, 1600, 2400, 3200]) {
  for (const cpi of [2, 4, 8]) {
    const mips = mhz / cpi
    if (!Number.isInteger(mips)) continue
    const d = distract(mips, [mhz * cpi, mhz, cpi * 1000])
    if (d.length < 3) continue
    b.add(`ictb4_syb_${mhz}_${cpi}`, T.systems, FW.apply, 'medium',
      [`某處理器的時脈頻率為 ${mhz} MHz，平均每條指令需時 ${cpi} 個時脈周期。該處理器每秒可執行多少百萬條指令（MIPS）？`,
       `A processor runs at ${mhz} MHz and averages ${cpi} clock cycles per instruction. How many million instructions per second (MIPS) can it execute?`],
      [qty(mips, 'MIPS', 'MIPS'), ...d.map((v) => qty(v, 'MIPS', 'MIPS'))],
      [`${mhz} MHz 表示每秒 ${mhz} 百萬個時脈周期。每條指令用去 ${cpi} 個周期，故每秒可完成 $${mhz} \\div ${cpi} = ${mips}$ 百萬條指令。答 $${mhz * cpi}$ 是把兩者相乘 —— 每指令用的周期【愈多】，速度應該【愈慢】，相乘會令兩者同向變動，方向明顯相反。`,
       `${mhz} MHz means ${mhz} million clock cycles per second. Each instruction consumes ${cpi} cycles, so $${mhz} \\div ${cpi} = ${mips}$ million instructions complete per second. Answering $${mhz * cpi}$ multiplies instead — but MORE cycles per instruction must mean SLOWER execution, and multiplying makes the two move together, which is plainly the wrong direction.`])
  }
}

// SY_C — 磁碟容量 = 磁面 × 每面磁軌 × 每軌磁區 × 512 位元組
for (const surfaces of [2, 4, 6, 8]) {
  for (const tracks of [2000, 4000]) {
    for (const sectors of [64, 128]) {
      const mb = (surfaces * tracks * sectors * 512) / (1024 * 1024)
      if (!Number.isInteger(mb)) continue
      const d = distract(mb, [mb / 2, mb * 2, surfaces * tracks * sectors])
      if (d.length < 3) continue
      b.add(`ictb4_syc_${surfaces}_${tracks}_${sectors}`, T.systems, FW.apply, 'hard',
        [`一個硬碟有 ${surfaces} 個記錄面，每面 ${tracks} 條磁軌，每條磁軌 ${sectors} 個磁區，每個磁區 512 位元組。該硬碟容量為多少 MB？`,
         `A hard disk has ${surfaces} recording surfaces, ${tracks} tracks per surface, ${sectors} sectors per track and 512 bytes per sector. What is its capacity in MB?`],
        [qty(mb, 'MB', 'MB'), ...d.map((v) => qty(v, 'MB', 'MB'))],
        [`容量 = 記錄面 × 磁軌 × 磁區 × 每磁區位元組 = $${surfaces} \\times ${tracks} \\times ${sectors} \\times 512 = ${surfaces * tracks * sectors * 512}$ 位元組，再除以 $1024^2$ 得 ${mb} MB。四個數缺一不可：漏掉記錄面等於只算了一面，而碟片是雙面記錄的。答 $${surfaces * tracks * sectors}$ 是漏了每磁區的 512 位元組，得出的是磁區數目而非容量。`,
         `Capacity = surfaces × tracks × sectors × bytes per sector = $${surfaces} \\times ${tracks} \\times ${sectors} \\times 512 = ${surfaces * tracks * sectors * 512}$ bytes, then divide by $1024^2$ for ${mb} MB. All four factors are needed: dropping the surface count means counting one side only, and platters record on both. Answering $${surfaces * tracks * sectors}$ omits the 512 bytes per sector and gives a sector count, not a capacity.`])
    }
  }
}

// ── 資訊保安與道德 ────────────────────────────────────────────────────────

// SE_A — 金鑰空間 = 2^金鑰長度
for (const bits of [8, 10, 12, 14, 16, 18, 20, 22, 24, 28, 32]) {
  const space = 2 ** bits
  const d = distract(space, [bits * 2, 2 ** (bits / 2), bits ** 2])
  if (d.length < 3) continue
  b.add(`ictb4_sea_${bits}`, T.security, FW.logic, 'easy',
    [`某加密方案使用 ${bits} 位元金鑰。可能的金鑰共有多少個？`,
     `An encryption scheme uses a ${bits}-bit key. How many possible keys are there?`],
    [qty(space, '個', ''), ...d.map((v) => qty(v, '個', ''))],
    [`每個位元有 0 與 1 兩種可能，${bits} 個位元互相獨立，故金鑰空間為 $2^{${bits}} = ${space}$ 個。金鑰每加長一個位元，可能性就【翻一倍】而非加一 —— 這正是加長金鑰能有效抵禦暴力破解的原因。答 $${bits * 2}$ 把次方誤作乘二，兩者在位元數細時差距不明顯，位元數一大就相差極遠。`,
     `Each bit is either 0 or 1 and the ${bits} bits are independent, so the key space is $2^{${bits}} = ${space}$. Every extra bit DOUBLES the possibilities rather than adding one — which is exactly why longer keys resist brute force. Answering $${bits * 2}$ treats the exponent as a doubling; the gap is small for few bits and enormous for many.`])
}

// SE_B — 密碼組合數 = 字元集大小 ^ 密碼長度
for (const set of [10, 26, 36, 62]) {
  for (const len of [3, 4, 5, 6]) {
    const combos = set ** len
    const d = distract(combos, [set * len, len ** set, set ** (len - 1)])
    if (d.length < 3) continue
    b.add(`ictb4_seb_${set}_${len}`, T.security, FW.logic, 'medium',
      [`某系統要求密碼長 ${len} 個字元，每個字元取自一個 ${set} 個字元的字元集。可能的密碼共有多少個？`,
       `A system requires a ${len}-character password, each character drawn from a set of ${set} characters. How many possible passwords are there?`],
      [qty(combos, '個', ''), ...d.map((v) => qty(v, '個', ''))],
      [`每個位置獨立地有 ${set} 個選擇，共 ${len} 個位置，故組合數為 $${set}^{${len}} = ${combos}$ 個。底數是【字元集大小】，指數是【密碼長度】，兩者不可對調：答 $${len ** set}$ 就是把兩者調轉。順帶一提，加長密碼一個字元的效果，遠大於把字元集擴大 —— 因為長度在指數的位置。`,
       `Each position independently offers ${set} choices across ${len} positions, so there are $${set}^{${len}} = ${combos}$ passwords. The BASE is the character-set size and the EXPONENT is the length; they cannot be swapped, and answering $${len ** set}$ does exactly that. Note too that adding one character to the length helps far more than enlarging the character set — because length sits in the exponent.`])
  }
}

// SE_C — 暴力破解平均時間 = 組合數 ÷ 2 ÷ 每秒嘗試次數
for (const bits of [16, 18, 20, 22, 24]) {
  // ⚠️ rate 必須為 2 的次方，否則 2^bits / 2 / rate 不是整數，整組會被 continue 丟棄。
  // 原本寫 [1000, 4000, 16384]，實測只有 16384 能出題 —— 十五個組合只剩五條。
  for (const rate of [1024, 4096, 16384]) {
    const sec = 2 ** bits / 2 / rate
    if (!Number.isInteger(sec)) continue
    const d = distract(sec, [sec * 2, sec / 2, 2 ** bits])
    if (d.length < 3) continue
    b.add(`ictb4_sec_${bits}_${rate}`, T.security, FW.apply, 'hard',
      [`某 ${bits} 位元金鑰以暴力法破解，攻擊者每秒可嘗試 ${rate} 個金鑰。平均需時多少秒才能找到正確金鑰？`,
       `A ${bits}-bit key is attacked by brute force at ${rate} keys per second. On average, how many seconds are needed to find the correct key?`],
      [qty(sec, '秒', 's'), ...d.map((v) => qty(v, '秒', 's'))],
      [`金鑰空間為 $2^{${bits}} = ${2 ** bits}$ 個。逐個試下去，正確金鑰平均出現在【一半】的位置，故平均嘗試 $${2 ** bits} \\div 2 = ${2 ** bits / 2}$ 個，需時 $${2 ** bits / 2} \\div ${rate} = ${sec}$ 秒。答 $${sec * 2}$ 是漏了除以 2，那是【最壞情況】即試盡全部金鑰所需的時間。題目問平均還是最壞，必須看清楚。`,
       `The key space is $2^{${bits}} = ${2 ** bits}$. Trying keys one by one, the correct key sits on average HALFWAY through, so $${2 ** bits} \\div 2 = ${2 ** bits / 2}$ attempts are needed, taking $${2 ** bits / 2} \\div ${rate} = ${sec}$ s. Answering $${sec * 2}$ omits the division by two and gives the WORST case — the time to exhaust every key. Read whether the question asks for the average or the worst case.`])
  }
}

export const ictBank4Questions: Question[] = b.bank
