// ============================================================================
// #83 計數機貼士卡（Casio fx-50FH II / fx-3650P II）— 首批 5 Topic
// ----------------------------------------------------------------------------
// ⚠️ 學術生死線：每張卡必須由真人喺實體計數機逐步撳過、用 testZh 嘅測試數據
// 核對輸出，先可以將 verified 改做 true（並填 verifiedBy 實名）。機器永不自動
// 改呢個 flag。CalcTipCard 喺 production build 只 render verified:true 嘅卡；
// development 先會顯示草稿（帶「未經真機驗證」警示），方便審批。
// 驗證清單見 docs/calc-tips-83-review.md。
//
// 語法註：program 碼用 fx-50FH II／fx-3650P II 共通寫法 —— `?→A` 提示輸入、
// `:` 分隔指令、`◢` 暫停輸出。按鍵「路徑」（入 Program 模式嘅選單次序）各機
// 版本有異，正正係人手驗證重點。
// ============================================================================

export interface CalcTipStep {
  zh: string
  en: string
}

export interface CalcTip {
  /** 命中呢張卡嘅題目 topic id（靜態庫同參數庫 id 有異，一律列齊） */
  topics: string[]
  titleZh: string
  titleEn: string
  /** 真人真機驗證後先改 true —— 機器永不自動改 */
  verified: boolean
  /** 實名（驗證人），verified:true 時必填 */
  verifiedBy?: string
  /** (1) 適用題型判斷 */
  whenZh: string
  whenEn: string
  /** (2) Program 碼（無需 program 嘅內置功能卡則省略） */
  program?: string
  /** (3) 按鍵步驟 */
  steps: CalcTipStep[]
  /** (4) 常見陷阱 */
  trapsZh: string[]
  trapsEn: string[]
  /** 真機驗證用測試數據及預期輸出（唔會顯示畀學生，供覆核用） */
  testZh: string
}

export const CALC_TIPS: CalcTip[] = [
  {
    topics: ['quadratic_equations'],
    titleZh: '二次方程求根 Program（連判別式）',
    titleEn: 'Quadratic root solver program (with discriminant)',
    verified: false,
    whenZh:
      '題目要求解 ax² + bx + c = 0 的根、判斷實根數目，或求兩根之和／積再作後續運算時適用。先將方程整理為一般式再讀出 a、b、c。',
    whenEn:
      'Use when solving ax² + bx + c = 0, counting real roots, or extracting the two roots for follow-up work. Rearrange into general form first, then read off a, b, c.',
    program: '?→A: ?→B: ?→C: B²−4AC→D◢ (−B+√D)÷(2A)◢ (−B−√D)÷(2A)',
    steps: [
      { zh: '進入 Program 編輯模式，選一個空的程式位（P1–P4）', en: 'Enter Program edit mode and pick an empty slot (P1–P4)' },
      { zh: '逐字元輸入上面的程式碼（? 與 → 在 Program 功能選單內）', en: 'Key in the program above character by character (? and → live in the program function menu)' },
      { zh: '執行：按 Prog 及程式位編號，依次輸入 a、b、c，每次以 EXE 確認', en: 'Run: press Prog + slot number, then enter a, b, c, confirming each with EXE' },
      { zh: '第一個輸出是判別式 D；再按 EXE 逐個顯示兩根', en: 'The first output is the discriminant D; press EXE to step through the two roots' },
    ],
    trapsZh: [
      '輸入負數係數必須用 (−) 負號鍵，誤用減號鍵會令輸入無效或出錯。',
      'D < 0 時 √D 會顯示 Math ERROR —— 這本身就是答案：方程無實根。',
      '方程未化成一般式（例如 3x² = 2x + 5）就讀係數，是最常見的失分位。',
    ],
    trapsEn: [
      'Negative coefficients must use the (−) sign key; the subtraction key breaks the input.',
      'When D < 0 the √D step shows Math ERROR — that itself is the answer: no real roots.',
      'Reading coefficients before rearranging into general form (e.g. 3x² = 2x + 5) is the classic slip.',
    ],
    testZh: '測試：a=1, b=−2, c=−2 → D=12，根 = 1+√3 ≈ 2.7321 及 1−√3 ≈ −0.7321。再測 a=1, b=2, c=5 → D=−16，√D 應出 Math ERROR（無實根）。',
  },
  {
    topics: ['coordinate_geometry'],
    titleZh: '兩點全套 Program（距離＋中點＋斜率）',
    titleEn: 'Two-point all-in-one program (distance + midpoint + slope)',
    verified: false,
    whenZh:
      '題目給出兩點 (x₁, y₁)、(x₂, y₂) 要求距離、中點或斜率時適用 —— 一條 program 依次輸出三樣，MC 常見的「求 AB 長度再比較」「求中點坐標」「判斷斜率正負」一次過覆蓋。',
    whenEn:
      'Use when a question gives two points and asks for distance, midpoint or slope — one program outputs all three in turn, covering the usual MC variants.',
    program: '?→A: ?→B: ?→C: ?→D: √((C−A)²+(D−B)²)◢ (A+C)÷2◢ (B+D)÷2◢ (D−B)÷(C−A)',
    steps: [
      { zh: '進入 Program 編輯模式，選空程式位輸入程式碼', en: 'Enter Program edit mode and key the program into an empty slot' },
      { zh: '執行時依次輸入 x₁(A)、y₁(B)、x₂(C)、y₂(D)', en: 'On run, enter x₁ (A), y₁ (B), x₂ (C), y₂ (D) in order' },
      { zh: '輸出次序：距離 → 中點 x 坐標 → 中點 y 坐標 → 斜率，每按一次 EXE 前進一項', en: 'Output order: distance → midpoint x → midpoint y → slope; each EXE advances one value' },
    ],
    trapsZh: [
      '輸入次序必須是 x₁、y₁、x₂、y₂ —— 將兩點的 x 先後輸入（x₁、x₂、y₁、y₂）是最常見錯誤。',
      '兩點 x 坐標相同（豎直線）時斜率一步會出 Math ERROR：斜率不存在，並非機器壞。',
      '距離題答案多為根式：MC 選項若以根式出現，記得對比 √ 形式而非小數近似。',
    ],
    trapsEn: [
      'Input order must be x₁, y₁, x₂, y₂ — entering both x-values first is the classic mistake.',
      'Equal x-coordinates (a vertical line) make the slope step show Math ERROR: the slope is undefined, the machine is fine.',
      'Distances are often surds: match the √ form in MC options, not the decimal.',
    ],
    testZh: '測試：(1,2) 與 (4,6) → 距離 5，中點 (2.5, 4)，斜率 4÷3 ≈ 1.3333。再測 (2,1) 與 (2,5) → 距離 4，中點 (2,3)，斜率一步應出 Math ERROR（豎直線）。',
  },
  {
    topics: ['sequences', 'arithmetic_sequence'],
    titleZh: '等差數列 Program（通項＋前 n 項和）',
    titleEn: 'Arithmetic sequence program (nth term + sum)',
    verified: false,
    whenZh:
      '題目給首項 a 與公差 d，求第 n 項 T(n) 或首 n 項和 S(n) 時適用。若題目反過來由兩項求 a、d，先手解聯立再用此卡驗算。',
    whenEn:
      'Use when a and d are given and T(n) or S(n) is asked. If the question gives two terms instead, solve for a and d by hand first, then verify with this card.',
    program: '?→A: ?→D: ?→N: A+(N−1)D◢ N(2A+(N−1)D)÷2',
    steps: [
      { zh: '進入 Program 編輯模式，選空程式位輸入程式碼', en: 'Enter Program edit mode and key the program into an empty slot' },
      { zh: '執行時依次輸入首項 a(A)、公差 d(D)、項數 n(N)', en: 'On run, enter first term a (A), common difference d (D), then n (N)' },
      { zh: '第一個輸出是 T(n)，按 EXE 再顯示 S(n)', en: 'First output is T(n); press EXE for S(n)' },
    ],
    trapsZh: [
      '公差是「後項減前項」：遞減數列 d 為負，輸入時要用 (−) 負號鍵。',
      '題目問「第幾項開始超過／小於某值」時，program 只能逐個試 n —— 快而穩的做法是先手解不等式估 n，再用 program 核實。',
      'T(n) 與 S(n) 混淆是 MC 干擾項的固定套路：睇清楚問「項」還是「和」。',
    ],
    trapsEn: [
      'd is next-term minus previous-term: decreasing sequences need the (−) sign key.',
      'For "which term first exceeds…" questions, estimate n by hand-solving the inequality first, then confirm with the program.',
      'Mixing up T(n) and S(n) is a standard distractor pattern: check whether the question asks a term or a sum.',
    ],
    testZh: '測試：a=3, d=4, n=10 → T(10)=39，S(10)=210。再測 a=20, d=−3, n=7 → T(7)=2，S(7)=77。',
  },
  {
    topics: ['permutation_combination'],
    titleZh: '內置 nCr／nPr 鍵直算（免 program）',
    titleEn: 'Built-in nCr / nPr keys (no program needed)',
    verified: false,
    whenZh:
      '「從 n 個選 r 個」的計數題：選出後次序不重要用 nCr（組合），次序重要（排隊、排位、編號）用 nPr（排列）。判斷準則只有一條：交換兩個被選中者會否產生新結果 —— 會，就是排列。',
    whenEn:
      'Choosing r from n: order irrelevant → nCr; order matters (queues, seats, labels) → nPr. One test: does swapping two chosen items create a new outcome? If yes, it is a permutation.',
    steps: [
      { zh: '先輸入 n，按 nCr（或 SHIFT 後的 nPr）鍵，再輸入 r，按 EXE', en: 'Enter n, press the nCr key (or SHIFT for nPr), enter r, press EXE' },
      { zh: '「至少一個」類題目：用補集 —— 全部組合減去「零個」的組合', en: 'For "at least one" questions use the complement: total minus the "none" case' },
      { zh: '分步事件相乘、分類事件相加，先寫式再按機', en: 'Multiply across stages, add across cases — write the expression before keying it' },
    ],
    trapsZh: [
      '「至少一個」直接硬數各情況極易重複計算 —— 補集（全取減零取）先係正路。',
      'nCr 與 nPr 撳錯掣：8C3 = 56 而 8P3 = 336，差 r! 倍，兩個數多數同時出現喺選項度。',
      '相鄰要「捆綁」（當一個單位再乘內部排列）、相隔要「插空」—— 呢兩步 program 幫唔到，要先諗清楚先按機。',
    ],
    trapsEn: [
      'Counting "at least one" case-by-case invites double counting — the complement is the safe route.',
      'nCr vs nPr mis-keys: 8C3 = 56 but 8P3 = 336 (a factor of r!) — both usually appear among the options.',
      'Adjacency needs bundling and separation needs gap-insertion — the calculator cannot decide that for you; set up the expression first.',
    ],
    testZh: '測試：8C3 = 56、8P3 = 336；「6 人中至少 1 名女生（3 女 3 男）選 3 人」= C(6,3)−C(3,3) = 20−1 = 19。',
  },
  {
    topics: ['statistics'],
    titleZh: 'SD 統計模式（平均數＋標準差）',
    titleEn: 'SD statistics mode (mean + standard deviation)',
    verified: false,
    whenZh:
      '求一組數據的平均數 x̄、母體標準差 σ 或方差 σ² 時適用 —— 用內置 SD 模式逐個輸入數據，免逐項計 (x−x̄)²。加權／頻數數據可用「數值 × 頻數」的輸入格式。',
    whenEn:
      'Use for the mean, population SD σ or variance σ² of a data set — the built-in SD mode replaces term-by-term (x−x̄)² work. Frequency data can be entered as value × frequency.',
    steps: [
      { zh: '切換至 SD 模式（統計模式），先清除舊數據記憶', en: 'Switch to SD (statistics) mode and clear old data memory first' },
      { zh: '逐個輸入數據，每個以資料輸入鍵（DT／M+）確認', en: 'Enter each datum, confirming with the data key (DT / M+)' },
      { zh: '輸入完畢後經統計結果選單讀出 x̄ 與 σ；方差 = σ 再平方', en: 'Read x̄ and σ from the stats results menu; variance = σ squared' },
    ],
    trapsZh: [
      '舊數據未清（記憶殘留上一題）是 SD 模式最大殺手 —— 每題開始必先清除。',
      'σ（母體，除以 n）與 s（樣本，除以 n−1）是兩個鍵：DSE 題目寫「標準差」而無註明抽樣時，一般用母體 σ。',
      '離開 SD 模式返回 COMP 前，數據仍佔記憶 —— 下一題若忘記清除會靜靜地計錯。',
    ],
    trapsEn: [
      'Stale data from the previous question is the biggest SD-mode killer — clear memory at the start of every question.',
      'σ (population, ÷n) and s (sample, ÷(n−1)) are separate keys: an unqualified "standard deviation" in DSE usually means population σ.',
      'Data persists in memory until cleared, even after leaving SD mode — the next question silently inherits it.',
    ],
    testZh: '測試：數據 2, 4, 6 → x̄ = 4，σ = √(8/3) ≈ 1.6330（s = 2）。再測 1, 1, 1, 5 → x̄ = 2，σ = √3 ≈ 1.7321。',
  },
]

/** 按題目 topic id 搵對應貼士卡（冇就 null） */
export function getCalcTip(topicId: string): CalcTip | null {
  return CALC_TIPS.find((t) => t.topics.includes(topicId)) ?? null
}
