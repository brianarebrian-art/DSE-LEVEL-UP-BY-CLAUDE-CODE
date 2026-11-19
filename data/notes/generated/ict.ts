// ⚠️ 由 scripts/gen-study-notes.mts 產生 —— 請勿手動修改。
import type { StudyNote } from '../types'

export const notes: Record<string, StudyNote> = {
  "data_representation": {
    "subjectId": "ict",
    "topicId": "data_representation",
    "titleZh": "資料表示與處理",
    "titleEn": "Data Representation & Processing",
    "conceptZh": "按位權相加：$00001010_2 = 10_{10}$。",
    "conceptEn": "Summing place values: $00001010_2 = 10_{10}$.",
    "mustKnowZh": [
      "按位權相加：$00001010_2 = 10_{10}$。",
      "$12_{10} = 00001100_2$。",
      "$2A_{16} = 42_{10}$。",
      "$4F_{16} = 79_{10}$。"
    ],
    "mustKnowEn": [
      "Summing place values: $00001010_2 = 10_{10}$.",
      "$12_{10} = 00001100_2$.",
      "$2A_{16} = 42_{10}$.",
      "$4F_{16} = 79_{10}$."
    ],
    "examTipZh": "DSE 作答「資料表示與處理」時：寫清楚步驟同單位；選擇題用排除法核對陷阱選項；長題按分步列式。",
    "examTipEn": "In DSE “Data Representation & Processing”: show steps and units; eliminate trap options in MC; structure long answers by marks.",
    "commonTrapZh": "$1011_2$ 是 11 的二進位；$12_2$ 是八進位的寫法；$0101_2$ 把餘數次序讀反 —— 除法取餘數時，【最後】得出的餘數是最高位，這是最常見的失分位。",
    "commonTrapEn": "Mixing nearby concepts, missing stem constraints, or not checking the answer in the original setup.",
    "source": "generated"
  },
  "computer_systems": {
    "subjectId": "ict",
    "topicId": "computer_systems",
    "titleZh": "電腦系統與硬件",
    "titleEn": "Computer Systems & Hardware",
    "conceptZh": "ALU 負責加減及 AND/OR 等運算；CU 負責解碼與控制。",
    "conceptEn": "The ALU does arithmetic and logic; the CU decodes and controls.",
    "mustKnowZh": [
      "ALU 負責加減及 AND/OR 等運算；CU 負責解碼與控制。",
      "RAM 是揮發性（斷電即失），ROM 是非揮發性（保留內容）。",
      "快取放在 CPU 與主記憶體之間，存放常用資料以加速存取。",
      "打印機輸出資料；鍵盤、掃描器、滑鼠均為輸入裝置。"
    ],
    "mustKnowEn": [
      "The ALU does arithmetic and logic; the CU decodes and controls.",
      "RAM is volatile (lost on power-off); ROM is non-volatile.",
      "Cache sits between CPU and main memory, holding frequently used data for speed.",
      "A printer outputs data; keyboard, scanner and mouse are inputs."
    ],
    "examTipZh": "DSE 作答「電腦系統與硬件」時：寫清楚步驟同單位；選擇題用排除法核對陷阱選項；長題按分步列式。",
    "examTipEn": "In DSE “Computer Systems & Hardware”: show steps and units; eliminate trap options in MC; structure long answers by marks.",
    "commonTrapZh": "混淆相近概念、漏讀題幹限制，或計算後未代回原式檢查。",
    "commonTrapEn": "Mixing nearby concepts, missing stem constraints, or not checking the answer in the original setup.",
    "source": "generated"
  },
  "networking": {
    "subjectId": "ict",
    "topicId": "networking",
    "titleZh": "網絡與互聯網",
    "titleEn": "Networking & the Internet",
    "conceptZh": "IP 位址用以在網絡上定位與尋址裝置。",
    "conceptEn": "An IP address locates and addresses a device on a network.",
    "mustKnowZh": [
      "IP 位址用以在網絡上定位與尋址裝置。",
      "DNS 把人類可讀的域名（如 example.com）解析成 IP 位址。",
      "LAN 覆蓋小範圍（如一棟樓），WAN 跨城市或國家。",
      "HTTPS 以 TLS 加密通訊，防止竊聽與竄改。"
    ],
    "mustKnowEn": [
      "An IP address locates and addresses a device on a network.",
      "DNS resolves human-readable domain names into IP addresses.",
      "A LAN covers a small area (a building); a WAN spans cities or countries.",
      "HTTPS encrypts the connection with TLS, preventing eavesdropping and tampering."
    ],
    "examTipZh": "DSE 作答「網絡與互聯網」時：寫清楚步驟同單位；選擇題用排除法核對陷阱選項；長題按分步列式。",
    "examTipEn": "In DSE “Networking & the Internet”: show steps and units; eliminate trap options in MC; structure long answers by marks.",
    "commonTrapZh": "混淆相近概念、漏讀題幹限制，或計算後未代回原式檢查。",
    "commonTrapEn": "Mixing nearby concepts, missing stem constraints, or not checking the answer in the original setup.",
    "source": "generated"
  },
  "programming": {
    "subjectId": "ict",
    "topicId": "programming",
    "titleZh": "程式編寫與算法",
    "titleEn": "Programming & Algorithms",
    "conceptZh": "AND 閘需兩輸入皆 1 才輸出 1。",
    "conceptEn": "An AND gate outputs 1 only if both inputs are 1.",
    "mustKnowZh": [
      "AND 閘需兩輸入皆 1 才輸出 1。",
      "OR 閘只要有一輸入為 1 就輸出 1。",
      "NOT 反轉輸入：NOT(1)=0。",
      "XOR 在兩輸入相同時輸出 0，相異時輸出 1。"
    ],
    "mustKnowEn": [
      "An AND gate outputs 1 only if both inputs are 1.",
      "An OR gate outputs 1 if any input is 1.",
      "NOT inverts its input: NOT(1)=0.",
      "XOR outputs 0 when inputs are equal, 1 when they differ."
    ],
    "examTipZh": "DSE 作答「程式編寫與算法」時：寫清楚步驟同單位；選擇題用排除法核對陷阱選項；長題按分步列式。",
    "examTipEn": "In DSE “Programming & Algorithms”: show steps and units; eliminate trap options in MC; structure long answers by marks.",
    "commonTrapZh": "混淆相近概念、漏讀題幹限制，或計算後未代回原式檢查。",
    "commonTrapEn": "Mixing nearby concepts, missing stem constraints, or not checking the answer in the original setup.",
    "source": "generated"
  },
  "databases": {
    "subjectId": "ict",
    "topicId": "databases",
    "titleZh": "資料庫",
    "titleEn": "Databases",
    "conceptZh": "一列即一筆紀錄；一欄 (column) 為一個欄位。",
    "conceptEn": "A row is one record; a column is a field.",
    "mustKnowZh": [
      "一列即一筆紀錄；一欄 (column) 為一個欄位。",
      "主鍵的值在表中唯一且不可重複，用以識別紀錄。",
      "外鍵參照另一表的主鍵，建立表間關係。",
      "查詢按條件檢索、篩選或更新資料。"
    ],
    "mustKnowEn": [
      "A row is one record; a column is a field.",
      "A primary key value is unique per record and cannot repeat.",
      "A foreign key references another table’s primary key to relate them.",
      "A query retrieves, filters or updates data by given criteria."
    ],
    "examTipZh": "DSE 作答「資料庫」時：寫清楚步驟同單位；選擇題用排除法核對陷阱選項；長題按分步列式。",
    "examTipEn": "In DSE “Databases”: show steps and units; eliminate trap options in MC; structure long answers by marks.",
    "commonTrapZh": "混淆相近概念、漏讀題幹限制，或計算後未代回原式檢查。",
    "commonTrapEn": "Mixing nearby concepts, missing stem constraints, or not checking the answer in the original setup.",
    "source": "generated"
  },
  "security_ethics": {
    "subjectId": "ict",
    "topicId": "security_ethics",
    "titleZh": "資訊保安與道德",
    "titleEn": "Security & Ethics",
    "conceptZh": "加密用金鑰把明文轉為密文，保障機密性。",
    "conceptEn": "Encryption uses a key to turn plaintext into ciphertext, protecting confidentiality.",
    "mustKnowZh": [
      "加密用金鑰把明文轉為密文，保障機密性。",
      "長度與字元多樣性提高破解難度；切勿用易猜資訊。",
      "malware 泛指各類惡意程式，包括病毒、蠕蟲、木馬、勒索軟件等。",
      "2FA 結合「你知道的」與「你擁有的」，即使密碼洩漏亦多一重保障。"
    ],
    "mustKnowEn": [
      "Encryption uses a key to turn plaintext into ciphertext, protecting confidentiality.",
      "Length and character variety resist cracking; avoid guessable info.",
      "Malware is the umbrella term for malicious software: viruses, worms, trojans, ransomware, etc.",
      "2FA combines something you know with something you have, so a leaked password alone is not enough."
    ],
    "examTipZh": "DSE 作答「資訊保安與道德」時：寫清楚步驟同單位；選擇題用排除法核對陷阱選項；長題按分步列式。",
    "examTipEn": "In DSE “Security & Ethics”: show steps and units; eliminate trap options in MC; structure long answers by marks.",
    "commonTrapZh": "混淆相近概念、漏讀題幹限制，或計算後未代回原式檢查。",
    "commonTrapEn": "Mixing nearby concepts, missing stem constraints, or not checking the answer in the original setup.",
    "source": "generated"
  },
  "multimedia_web": {
    "subjectId": "ict",
    "topicId": "multimedia_web",
    "titleZh": "多媒體與網絡技術",
    "titleEn": "Multimedia & Web",
    "conceptZh": "HTML 以標記定義網頁結構；CSS 負責樣式，JavaScript 負責互動。",
    "conceptEn": "HTML marks up page structure; CSS styles it and JavaScript adds interactivity.",
    "mustKnowZh": [
      "HTML 以標記定義網頁結構；CSS 負責樣式，JavaScript 負責互動。",
      "CSS 把樣式（顏色、排版）與 HTML 結構分離，便於維護。",
      "向量圖以數學描述形狀，放大不會出現鋸齒；點陣放大會失真。",
      "響應式設計用彈性版面與媒體查詢，適配手機、平板與桌面。"
    ],
    "mustKnowEn": [
      "HTML marks up page structure; CSS styles it and JavaScript adds interactivity.",
      "CSS separates styling (colours, layout) from HTML structure for easier maintenance.",
      "Vectors describe shapes mathematically and scale cleanly; bitmaps pixelate when enlarged.",
      "Responsive design uses flexible layouts and media queries to fit phones, tablets and desktops."
    ],
    "examTipZh": "DSE 作答「多媒體與網絡技術」時：寫清楚步驟同單位；選擇題用排除法核對陷阱選項；長題按分步列式。",
    "examTipEn": "In DSE “Multimedia & Web”: show steps and units; eliminate trap options in MC; structure long answers by marks.",
    "commonTrapZh": "混淆相近概念、漏讀題幹限制，或計算後未代回原式檢查。",
    "commonTrapEn": "Mixing nearby concepts, missing stem constraints, or not checking the answer in the original setup.",
    "source": "generated"
  },
  "ict_data_rep_calc": {
    "subjectId": "ict",
    "topicId": "ict_data_rep_calc",
    "titleZh": "資料表示計算",
    "titleEn": "Data representation — calculation",
    "conceptZh": "+20 = 00010100。",
    "conceptEn": "+20 = 00010100. Two’s complement: invert all bits → 11101011, then add 1 → 11101100. (Check: invert 11101100 → 00010011, +1 = 00010100 = 20, so it is −20.) 【Trap】 11101011 omits t…",
    "mustKnowZh": [
      "+20 = 00010100。",
      "像素數 = 1024 × 768 = 786,432。",
      "由右至左，各位的權值依次為 1、2、4、8。",
      "以權值分解：26 = 16 + 8 + 2，對應的權值位置為 16、8、2，其餘為 0，寫成 8 位元即 00011010。"
    ],
    "mustKnowEn": [
      "+20 = 00010100. Two’s complement: invert all bits → 11101011, then add 1 → 11101100. (Check: invert 11101100 → 00010011, +1 = 00010100 = 20, so it is −20.) 【Trap】 11101011 omits t…",
      "Pixels = 1024 × 768 = 786,432. 24 bits per pixel = 3 bytes. Size = 786,432 × 3 = 2,359,296 bytes = 2,359,296 ÷ 1,048,576 ≈ 2.25 MiB. 【Trap】 786,432 uses 1 byte/pixel (drops ×3); 1…",
      "Reading from the right, the place values are 1, 2, 4 and 8. The digits of 1011 are 1, 1, 0 and 1, so the value is 8 + 0 + 2 + 1 = 11. The answer 13 swaps the place values 2 and 4;…",
      "Decompose by place value: 26 = 16 + 8 + 2, so the 16, 8 and 2 positions hold a 1 and the rest hold 0, giving 00011010 in eight bits."
    ],
    "examTipZh": "DSE 作答「資料表示計算」時：寫清楚步驟同單位；選擇題用排除法核對陷阱選項；長題按分步列式。",
    "examTipEn": "In DSE “Data representation — calculation”: show steps and units; eliminate trap options in MC; structure long answers by marks.",
    "commonTrapZh": "$72$ 誤按八進位換算；$110$ 把二進位數字當成十進位數字直接讀出；$2$ 只數了 1 的個數。",
    "commonTrapEn": "255 is the largest value an 8-bit number can hold, but the count of representable values is 256, because zero must be counted too — the largest value and the total differ by one, a distinction that recurs in questions on colour depth, memory addressing and unsigned integer ranges. The answers 128 and 512 are 2 to the power 7 and 2 to the power 9, one bit short and one bit over. Remember that the relation is exponential rather than proportional: raising the depth from 8 bits to 16 does not double the colours but takes them from 256 to 65,536, which is also why increasing colour depth makes file sizes grow so noticeably.",
    "source": "generated"
  },
  "ict_logic_algo": {
    "subjectId": "ict",
    "topicId": "ict_logic_algo",
    "titleZh": "邏輯與算法",
    "titleEn": "Logic & algorithms",
    "conceptZh": "展開：A·(Ā + B) = A·Ā + A·B = 0 + A·B = A·B = A AND B（A·Ā = 0 是互補律）。",
    "conceptEn": "Expand: A·(Ā + B) = A·Ā + A·B = 0 + A·B = A·B = A AND B (A·Ā = 0 by complement).",
    "mustKnowZh": [
      "展開：A·(Ā + B) = A·Ā + A·B = 0 + A·B = A·B = A AND B（A·Ā = 0 是互補律）。",
      "二分搜尋每次比較把搜尋範圍減半，最壞次數 ≈ ⌈log₂ 1000⌉。",
      "AND 只有在所有輸入皆為 1 時輸出才是 1，其餘三種組合的輸出都是 0。",
      "按運算次序先計 NOT：NOT 1 = 0。"
    ],
    "mustKnowEn": [
      "Expand: A·(Ā + B) = A·Ā + A·B = 0 + A·B = A·B = A AND B (A·Ā = 0 by complement).",
      "Each comparison halves the search range, so the worst case ≈ ⌈log₂ 1000⌉.",
      "AND outputs 1 only when every input is 1; the other three combinations all give 0. The description \"at least one input is 1\" belongs to OR; \"the two inputs differ\" belongs to XOR …",
      "Following the order of operations, evaluate NOT first: NOT 1 = 0. Then the OR: 0 OR 0 = 0, so the answer is 0. Reading the expression as NOT (1 OR 0) would give 1 OR 0 = 1 and the…"
    ],
    "examTipZh": "DSE 作答「邏輯與算法」時：寫清楚步驟同單位；選擇題用排除法核對陷阱選項；長題按分步列式。",
    "examTipEn": "In DSE “Logic & algorithms”: show steps and units; eliminate trap options in MC; structure long answers by marks.",
    "commonTrapZh": "8 次是線性搜尋的最壞情況；4 次是線性搜尋的平均情況；6 次多算了一倍。",
    "commonTrapEn": "Mixing nearby concepts, missing stem constraints, or not checking the answer in the original setup.",
    "source": "generated"
  },
  "ict_network_calc": {
    "subjectId": "ict",
    "topicId": "ict_network_calc",
    "titleZh": "網絡計算",
    "titleEn": "Networking — calculation",
    "conceptZh": "關鍵是位元組 vs 位元：12 MB = 12 × 8 = 96 兆位元 (Mb)。",
    "conceptEn": "The key is bytes vs bits: 12 MB = 12 × 8 = 96 megabits (Mb).",
    "mustKnowZh": [
      "關鍵是位元組 vs 位元：12 MB = 12 × 8 = 96 兆位元 (Mb)。",
      "1 位元組固定等於 8 位元，這是資訊科技科所有容量與速率換算的基礎。",
      "以二進位前綴計算，1 KB = 1,024 位元組，所以 2 KB = 2 × 1,024 = 2,048 位元組。",
      "時間等於資料量除以速率：2,000 ÷ 500 = 4 秒。"
    ],
    "mustKnowEn": [
      "The key is bytes vs bits: 12 MB = 12 × 8 = 96 megabits (Mb).",
      "One byte is always 8 bits, and this is the basis of every capacity and rate conversion in ICT.",
      "Using binary prefixes, 1 KB = 1,024 bytes, so 2 KB = 2 × 1,024 = 2,048 bytes.",
      "Time equals amount of data divided by rate: 2,000 ÷ 500 = 4 seconds."
    ],
    "examTipZh": "DSE 作答「網絡計算」時：寫清楚步驟同單位；選擇題用排除法核對陷阱選項；長題按分步列式。",
    "examTipEn": "In DSE “Networking — calculation”: show steps and units; eliminate trap options in MC; structure long answers by marks.",
    "commonTrapZh": "壓縮省下的是傳送時間，但壓縮本身亦要花時間，兩者必須一併計算。由此亦可見壓縮並非永遠划算——若連線速率夠高，或壓縮率不理想，壓縮所花的時間可能超過所省下的時間。",
    "commonTrapEn": "Mixing nearby concepts, missing stem constraints, or not checking the answer in the original setup.",
    "source": "generated"
  }
}
