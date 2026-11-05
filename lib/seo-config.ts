/**
 * SEO Configuration for all 25 subjects & priority pages on DSE LEVEL UP.
 *
 * Title rule: [科目全名] DSE 筆記 | [數字+賣點] - DSE LEVEL UP (keyword FIRST, max 28中文字 / <60 chars)
 * Description rule: 70-90字, 必須有 免費 + 筆記 + 題目/重點 + CTA
 */

export interface SubjectSeoConfig {
  id: string
  name: string
  subjectTitle: string
  notesTitle: string
  subjectDescription: string
  notesDescription: string
  faqs: Array<{ question: string; answer: string }>
}

export const HOMEPAGE_SEO = {
  title: 'DSE LEVEL UP | DSE 溫習平台 免費26,000+題 選擇題操練 - 考試急症室',
  description: 'DSE LEVEL UP 為考生提供免費 DSE 筆記與題庫操練，涵蓋 26,000+ 條精選試題與詳盡解析。零廣告無須登入，助你針對常犯錯誤補底拔尖，立即開始免費溫習！',
}

export const SUBJECT_SEO_CONFIGS: Record<string, SubjectSeoConfig> = {
  'maths': {
    id: 'maths',
    name: '數學必修部分',
    subjectTitle: '數學 DSE 筆記 | 2800+題目詳解 - DSE LEVEL UP',
    notesTitle: '數學 DSE 筆記 | 精讀公式與題型 - DSE LEVEL UP',
    subjectDescription: '免費數學 DSE 筆記與 2800+ 條題目操練，按課題整理常考題型與解題公式。附詳盡答案解析與陷阱分析，助你由基礎概念穩奪高分，立即免費開始溫習！',
    notesDescription: '精選數學 DSE 筆記整理常考公式與核心概念，附免費題庫與步驟拆解。涵蓋代數、幾何及三角學等課題重點，助你迅速釐清弱點，立即免費閱讀筆記！',
    faqs: [
      { question: '數學 DSE 必修部分如何有效溫習？', answer: '建議先熟讀常考公式與核心定理，再針對薄弱課題進行操練，每次做完務必核對解析並釐清計算步驟。' },
      { question: '數學 Paper 2 選擇題如何提升速度？', answer: '善用代入法、逆向思維及計數機程式，同時留意常見代數陷阱，能有效節省作答時間。' },
      { question: 'DSE 數學幾何與三角學怎樣補底？', answer: '由基礎圓定理與直角三角形比例切入，配合圖形標記輔助線，能更快掌握解題突破點。' }
    ]
  },
  'm1': {
    id: 'm1',
    name: '數學 M1（微積分與統計）',
    subjectTitle: '數學 M1 DSE 筆記 | 700+題微積分統計 - DSE LEVEL UP',
    notesTitle: '數學 M1 DSE 筆記 | 核心公式重點 - DSE LEVEL UP',
    subjectDescription: '免費數學 M1 DSE 筆記與 700+ 題操練，全面覆蓋微積分應用及常態分佈重點。附解題步驟與常犯錯誤提示，助你掌握統計題型，立即免費開始溫習！',
    notesDescription: '專業數學 M1 DSE 筆記精讀，整理微積分求導、積分技巧及機率分佈公式重點。附免費題目對照，助你快速掌握核心定義與計算步驟，立即免費閱讀！',
    faqs: [
      { question: '數學 M1 微積分最常考哪些題型？', answer: '極值求取、速率變化問題及利用二項式展式求近似值均為高頻題型。' },
      { question: 'M1 統計部分常態分佈怎樣避免失分？', answer: '標準化轉換為 Z 值時須格外小心符號及查表方向，並留意連續性校正的適用條件。' },
      { question: '數學 M1 與核心數學怎樣分配時間？', answer: '建立每週定時專項練習習慣，先穩固核心微積分運算，再操練統計大題。' }
    ]
  },
  'm2': {
    id: 'm2',
    name: '數學 M2（代數與微積分）',
    subjectTitle: '數學 M2 DSE 筆記 | 800+矩陣微積分 - DSE LEVEL UP',
    notesTitle: '數學 M2 DSE 筆記 | 矩陣向量重點 - DSE LEVEL UP',
    subjectDescription: '免費數學 M2 DSE 筆記及 800+ 條精選題目，拆解矩陣、向量及微積分難題重點。每題提供步驟詳解助你跨越深奧概念，即刻免費開始題庫練習！',
    notesDescription: '精選數學 M2 DSE 筆記總結矩陣運算、三維向量及三角微積分重點。配套免費原創題目與論證解析，助你釐清抽象證明，立即免費閱讀溫習！',
    faqs: [
      { question: '數學 M2 數學歸納法有何作答要訣？', answer: '嚴格遵守三步論證格式，清楚寫出歸納假設並在演繹步驟中標明代入依據。' },
      { question: 'M2 向量與三維幾何題目怎樣理清空間感？', answer: '多畫立體草圖並善用純量積與向量積公式，注意法向量的求法與平面的交角。' },
      { question: '數學 M2 積分技巧如何熟練？', answer: '精通分部積分法與代換積分法，並熟記常見三角函數代換型式。' }
    ]
  },
  'physics': {
    id: 'physics',
    name: '物理',
    subjectTitle: '物理 DSE 筆記 | 1600+題目力學電學 - DSE LEVEL UP',
    notesTitle: '物理 DSE 筆記 | 概念公式重點 - DSE LEVEL UP',
    subjectDescription: '免費物理 DSE 筆記結合 1600+ 條力學、波動及電磁學題目操練。深入剖析歷年陷阱與公式原理，助你釐清物理思維，立即免費開啟高效溫習！',
    notesDescription: '實用物理 DSE 筆記濃縮熱學、牛頓定律、光學及電路核心重點。結合免費題目練習及概念圖解，助你輕鬆破除盲點，立即免費在線溫習筆記！',
    faqs: [
      { question: '物理 DSE 力學題目怎樣理清受力圖？', answer: '標記接觸力與非接觸力，將斜面受力正交分解為沿斜面與垂直斜面的分量。' },
      { question: '物理電學與磁場題如何避免混淆定律？', answer: '熟練右手開掌定則與弗萊明左手定則的適用情境，分清洛倫茲力與感應電動勢。' },
      { question: '物理 Paper 1A 選擇題有哪些衝分技巧？', answer: '利用量綱分析（維度檢驗）與極值邊界法排除錯誤選項，能顯著加快判斷。' }
    ]
  },
  'chemistry': {
    id: 'chemistry',
    name: '化學',
    subjectTitle: '化學 DSE 筆記 | 1500+有機與酸鹼題 - DSE LEVEL UP',
    notesTitle: '化學 DSE 筆記 | 反應物與方程式 - DSE LEVEL UP',
    subjectDescription: '免費化學 DSE 筆記搭配 1500+ 精選化學題目，覆蓋摩爾、酸鹼及有機化學核心重點。每題均有步驟解構與顏色變化指引，立即免費展開高效溫習！',
    notesDescription: '系統化化學 DSE 筆記梳理化學鍵、氧化還原反應及有機化合物命名重點。配合免費練習題與實驗觀察總結，助你牢記關鍵詞，立即免費閱讀溫習！',
    faqs: [
      { question: '化學 DSE 有機合成題如何有系統作答？', answer: '分析官能團轉化路徑，先鎖定碳骨架變化，再考慮反應試劑與特定催化條件。' },
      { question: '化學摩爾計算怎樣做到零失誤？', answer: '寫出完整平衡化學方程式，清楚列出限制反應物及每步單位轉換。' },
      { question: '化學實驗題如何準確描述顏色變化？', answer: '記住試劑初始與最終顏色，使用標準術語（如無色轉為粉紅、沉澱生成）。' }
    ]
  },
  'biology': {
    id: 'biology',
    name: '生物',
    subjectTitle: '生物 DSE 筆記 | 1400+遺傳人體題庫 - DSE LEVEL UP',
    notesTitle: '生物 DSE 筆記 | 系統與生態重點 - DSE LEVEL UP',
    subjectDescription: '免費生物 DSE 筆記包含 1400+ 條原創生物題目，針對細胞光合、遺傳及人體系統等重點。詳細解析扣分盲點，助你掌握考評關鍵詞，立即免費練習！',
    notesDescription: '必讀生物 DSE 筆記整合生態學、神經調節與分子遺傳學核心概念重點。結合免費課後題目自我檢測，助你理清生理反應機制，立即免費閱讀溫習！',
    faqs: [
      { question: '生物 DSE 答題怎樣滿足考評關鍵詞要求？', answer: '標記題目關鍵詞，將生理機制按「刺激－感受器－傳導路徑－效應器」完整陳述。' },
      { question: '生物遺傳圖解（Genetic Diagram）怎樣拿滿分？', answer: '寫齊親代基因型、配子種類、子代基因型與表現型比例，並清楚定義等位基因代號。' },
      { question: '生物顯微鏡與實驗設計題有何得分位？', answer: '註明對照組設定、控制變數及量度指標，確保實驗具可重複性。' }
    ]
  },
  'english': {
    id: 'english',
    name: '英國語文',
    subjectTitle: '英文 DSE 筆記 | 1800+文法閱讀題目 - DSE LEVEL UP',
    notesTitle: '英文 DSE 筆記 | 寫作文法精讀重點 - DSE LEVEL UP',
    subjectDescription: '免費英文 DSE 筆記提供 1800+ 題目操練，涵蓋 Reading 題型技巧與必備 Grammar 重點。提供詳盡語境分析與詞彙擴充，立即免費開始針對性溫習！',
    notesDescription: '實用英文 DSE 筆記匯集高級文法句構、連詞應用及寫作範文重點。配合免費練習題目深造語感，助你輕鬆突破語文瓶頸，立即免費在線閱讀！',
    faqs: [
      { question: 'DSE 英文 Reading Paper 1 如何控制時間？', answer: 'Part A 建議於 45 分鐘內完成，為 Part B 預留足夠時間細閱長篇與推論題。' },
      { question: '英文 Paper 2 寫作怎樣提升語文豐富度？', answer: '適當運用倒裝句、分詞短語及精準動詞，避免過度堆砌生僻詞彙。' },
      { question: '如何有效提升 DSE 英文詞彙量？', answer: '按主題分類記憶（如環保、科技、心理），並掌握詞性變化與慣用語搭配。' }
    ]
  },
  'chinese': {
    id: 'chinese',
    name: '中國語文',
    subjectTitle: '中文 DSE 筆記 | 1700+字詞成語題庫 - DSE LEVEL UP',
    notesTitle: '中文 DSE 筆記 | 文言白話重點精讀 - DSE LEVEL UP',
    subjectDescription: '免費中文 DSE 筆記配合 1700+ 條字詞、成語及文言題目，深入解析修辭技巧與閱讀重點。逐題提供答題結構示範，助你突破中文關卡，立即免費開始溫習！',
    notesDescription: '專業中文 DSE 筆記總結常用成語、文言虛詞及白話文閱讀理解技巧重點。結合免費線上題目操練，助你掌握閱卷評分要旨，立即免費閱讀學習！',
    faqs: [
      { question: '中文 DSE 卷一文言文怎樣掌握字詞虛實？', answer: '精讀常見文言虛詞（如之、乎、者、也、以）的語法功能，並結合上下文語境推斷。' },
      { question: '白話文閱讀理解長題目如何作答？', answer: '採用「引文＋手法＋內容剖析＋主旨情感」四部曲，確保論據充分。' },
      { question: '中文字詞辨正與病句題怎樣提分？', answer: '分析句子主謂賓結構，留意搭配不當、成分殘缺與語序不順等常犯病因。' }
    ]
  },
  'bafs': {
    id: 'bafs',
    name: '企業、會計與財務概論',
    subjectTitle: '企會財 DSE 筆記 | 1200+會計商業題 - DSE LEVEL UP',
    notesTitle: 'BAFS DSE 筆記 | 會計財務報表重點 - DSE LEVEL UP',
    subjectDescription: '免費 BAFS DSE 筆記配合 1200+ 條題目操練，專攻會計分錄、財務報表及商業管理重點。附解析及陷阱提示，助你掌握作答規範，立即免費開始實戰！',
    notesDescription: '精選 BAFS DSE 筆記整理試算表調正、比率分析與管理學核心理論重點。配套免費線上題目即時核對，助你理清營運決策邏輯，立即免費閱讀溫習！',
    faqs: [
      { question: 'BAFS 會計編製財務報表怎樣避免借貸不平？', answer: '每次記帳堅持複式簿記原則，特別留意應計項目、預付款項與壞帳撥備。' },
      { question: 'BAFS 財務比率分析題目怎樣拿足分數？', answer: '除了寫出計算數值外，必須結合題目背景評價流動性與盈利能力之變化趨勢。' },
      { question: '商業管理模組理論題如何組織答案？', answer: '依據管理職能（計劃、組織、領導、控制）架構回答，並援引個案細節作證。' }
    ]
  },
  'ict': {
    id: 'ict',
    name: '資訊及通訊科技',
    subjectTitle: 'ICT DSE 筆記 | 1100+編程網絡題目 - DSE LEVEL UP',
    notesTitle: 'ICT DSE 筆記 | 數據庫與網絡重點 - DSE LEVEL UP',
    subjectDescription: '免費 ICT DSE 筆記涵蓋 1100+ 條數據庫、二進制編碼及網絡通訊題目練習重點。附完整演算法拆解，助你提升資訊科技思維，立即免費開啟溫習模式！',
    notesDescription: '必讀 ICT DSE 筆記重點歸納 SQL 查詢語句、演算法追蹤與系統開發週期重點。提供免費題目操練與解答，助你釐清程式邏輯，立即免費上網精讀！',
    faqs: [
      { question: 'ICT DSE 編程與演算法追蹤題如何做對？', answer: '建立變數追蹤表（Trace Table），逐行執行迴圈與條件判斷，標記數值變化。' },
      { question: 'ICT SQL 數據庫查詢常犯錯誤有哪些？', answer: '混淆 WHERE 與 HAVING 條件過濾時機，或在多表連接時忽略主鍵外鍵對應。' },
      { question: '網絡協議與安全概念怎樣有效記憶？', answer: '對比 OSI 各層功能與 TCP/IP 協定群，並結合日常加密應用場景理解。' }
    ]
  },
  'economics': {
    id: 'economics',
    name: '經濟',
    subjectTitle: '經濟 DSE 筆記 | 1500+微觀宏觀題庫 - DSE LEVEL UP',
    notesTitle: '經濟 DSE 筆記 | 供求曲線與圖表重點 - DSE LEVEL UP',
    subjectDescription: '免費經濟 DSE 筆記整合 1500+ 條題目操練，涵蓋供求彈性、市場結構及國民收入重點。每題提供圖表變動說明，助你穩奪高分，立即免費進入題庫溫習！',
    notesDescription: '權威經濟 DSE 筆記梳理外部效應、貨幣政策及國際貿易理論重點。配合免費練習題目加深印象，助你掌握精確經濟學定義，立即免費閱讀溫習！',
    faqs: [
      { question: '經濟 DSE 供求圖表分析題作答規範？', answer: '清楚標註坐標軸變量、原曲線與新曲線位移方向，並以文字交代價格與產量變化。' },
      { question: '宏觀經濟貨幣銀行學公式怎樣理解？', answer: '掌握貨幣創造過程與法定儲備比率關係，分清資產負債表各項目的借貸增減。' },
      { question: '經濟 Paper 1 選擇題如何提高準確度？', answer: '細讀條件限制詞（如其他因素不變、價格上限有效），排除不合情境的干擾項。' }
    ]
  },
  'csd': {
    id: 'csd',
    name: '公民與社會發展',
    subjectTitle: '公民與社會發展 DSE 筆記 | 1000+題目 - DSE LEVEL UP',
    notesTitle: 'CSD DSE 筆記 | 一國兩制當代世界重點 - DSE LEVEL UP',
    subjectDescription: '免費公民與社會發展 DSE 筆記結合 1000+ 精選題目練習，涵蓋一國兩制、國家發展及當代世界焦點重點。附詳解助你達標，立即免費進行主題操練！',
    notesDescription: '精華 CSD DSE 筆記系統歸納憲法基本法常識、國家經濟科技成就與全球治理重點。搭配免費題目自測，助你輕鬆掌握核心資料，立即免費在線溫習！',
    faqs: [
      { question: '公民與社會發展科 DSE 如何穩奪「達標」？', answer: '掌握三大主題基本事實與法定架構，作答時緊扣資料關鍵數據並以平實客觀語調論證。' },
      { question: 'CSD 多項選擇題考評重心是什麼？', answer: '側重基本法條文、特區行政架構、國家重大發展策略及國際合作組織宗旨。' },
      { question: 'CSD 資料分析題怎樣引述數據作佐證？', answer: '指出趨勢變化（上升、平穩或降幅），配合具體年份百分比說明論點。' }
    ]
  },
  'chinese-history': {
    id: 'chinese-history',
    name: '中國歷史',
    subjectTitle: '中史 DSE 筆記 | 1100+歷代政治題庫 - DSE LEVEL UP',
    notesTitle: '中國歷史 DSE 筆記 | 朝代演變制度重點 - DSE LEVEL UP',
    subjectDescription: '免費中國歷史 DSE 筆記提供 1100+ 歷代政治制度及改革盛衰題目練習重點。附史料分析與答題脈絡指南，助你建立完整歷史觀，立即免費在線溫習！',
    notesDescription: '必備中史 DSE 筆記貫通秦漢至現代制度變革、外交條約及文化演變核心重點。附免費題目反覆測試史實記憶，助你突破盲區，立即免費閱讀學習！',
    faqs: [
      { question: '中史 DSE 申論題如何建構清晰論點？', answer: '按背景、導火線、過程、影響四層鋪排，論述兼顧正反史家評價與史實支撐。' },
      { question: '中國歷史制度史（如兵制、科舉）怎樣記憶？', answer: '製作歷朝橫向對比表格，比較各朝制度創設目的、運作特點與弊病。' },
      { question: '中史史料題如何提取有效訊息？', answer: '分析作者立場與時代背景，引用原文關鍵詞句作為論證依據。' }
    ]
  },
  'history': {
    id: 'history',
    name: '歷史',
    subjectTitle: '歷史科 DSE 筆記 | 900+二十世紀史題 - DSE LEVEL UP',
    notesTitle: '歷史 DSE 筆記 | 國際冷戰衝突重點精讀 - DSE LEVEL UP',
    subjectDescription: '免費歷史科 DSE 筆記配備 900+ 條二十世紀世界局勢題目練習，涵蓋兩次大戰與冷戰重點。逐題提供史實解析與評分參考，立即免費開始高效複習！',
    notesDescription: '精華歷史科 DSE 筆記總結國際聯盟、冷戰對峙及歐洲一體化核心歷史重點。配套免費題目訓練史料推論能力，助你奪取優異成績，立即免費閱讀溫習！',
    faqs: [
      { question: '歷史科 Paper 1 DBQ 漫畫史料題作答步驟？', answer: '描述漫畫細節象徵、說明作者立場偏向，並引用歷史背景事實佐證論調。' },
      { question: '歷史長問答題如何達到「持平論述」？', answer: '在肯定題目說法的同時，指出其他重要推動因素，最後做出權衡結論。' },
      { question: '歷史科冷戰時期重要事件如何串聯？', answer: '依時間軸梳理危機節點（柏林危機、古巴導彈危機、越戰），歸納對抗模式。' }
    ]
  },
  'geography': {
    id: 'geography',
    name: '地理',
    subjectTitle: '地理 DSE 筆記 | 1300+板塊氣候題目 - DSE LEVEL UP',
    notesTitle: '地理 DSE 筆記 | 地圖技巧地貌重點 - DSE LEVEL UP',
    subjectDescription: '免費地理 DSE 筆記結合 1300+ 條板塊地貌、氣候變遷及城市發展題目練習重點。提供詳盡地圖測繪與圖表指引，助你扎實應試基礎，立即免費練習！',
    notesDescription: '實用地理 DSE 筆記梳理河流沉積、熱帶雨林生態及可持續發展策略核心重點。配合免費練習題目自檢，助你輕鬆掌握自然地理概念，立即免費精讀！',
    faqs: [
      { question: '地理 DSE 地圖閱讀與剖面圖技巧要點？', answer: '精準量度比例尺、換算網格座標（Easting/Northing），並準確計算坡度梯度。' },
      { question: '自然地理河流地貌形成過程怎樣寫好？', answer: '交代流水侵蝕作用（水力、磨蝕）、搬運方式及在特定地形下的沉積條件。' },
      { question: '地理 Paper 1 選擇題氣候圖如何快速判讀？', answer: '查看最冷月氣溫判斷氣候帶，結合降水量季節分配特徵鎖定氣候類型。' }
    ]
  },
  'chinese-literature': {
    id: 'chinese-literature',
    name: '中國文學',
    subjectTitle: '文學 DSE 筆記 | 800+詩歌散文題目 - DSE LEVEL UP',
    notesTitle: '中國文學 DSE 筆記 | 賞析手法名篇重點 - DSE LEVEL UP',
    subjectDescription: '免費中國文學 DSE 筆記提供 800+ 名篇文本分析與賞析技巧練習題目重點。深度剖析意象運用與思想情感，助你建立鑑賞能力，立即免費開始筆記溫習！',
    notesDescription: '專業中國文學 DSE 筆記整理古典詩詞、現代小說及戲劇名作藝術手法重點。附免費題目自我檢閱，助你流暢組織文學評論，立即免費在線研讀！',
    faqs: [
      { question: '中國文學 DSE 詩歌評賞如何分析意象？', answer: '指出具體物象特徵，說明其象徵意義及營造之氛圍意境。' },
      { question: '文學創作題怎樣構思立意才能脫穎而出？', answer: '避免平鋪直敘，從生活細膩觀察切入，運用寄託與反襯深化思想內涵。' },
      { question: '散文賞析如何精準評述語言風格？', answer: '從用字造句、疊字偶句及抒情敘事筆調展開，具體引用原文佐證。' }
    ]
  },
  'english-literature': {
    id: 'english-literature',
    name: '英語文學',
    subjectTitle: '文學 DSE 筆記 | 700+小說詩歌題庫 - DSE LEVEL UP',
    notesTitle: 'Literature DSE 筆記 | 文本分析修辭重點 - DSE LEVEL UP',
    subjectDescription: '免費英語文學 DSE 筆記配合 700+ 詩歌、戲劇及小說文本分析題目重點練習。附詳盡文學主題剖析與評分範例，提升英文論述實力，立即免費在線溫習！',
    notesDescription: '精華 Literature DSE 筆記梳理敘事視角、人物塑造及隱喻修辭重點。結合免費題目練習與答題架構示範，助你下筆有理有據，立即免費深入研習！',
    faqs: [
      { question: 'How to structure an English Literature essay?', answer: 'Use the PEAL structure (Point, Evidence, Analysis, Link) to ensure cohesive arguments.' },
      { question: 'How to analyze poetic meter and rhyme scheme?', answer: 'Identify the prevailing rhythm (such as iambic pentameter) and explain how sound reinforces thematic meaning.' },
      { question: 'What are key drama analysis components?', answer: 'Examine stage directions, dramatic irony, monologue delivery, and character foil dynamics.' }
    ]
  },
  'ethics-religious': {
    id: 'ethics-religious',
    name: '倫理與宗教',
    subjectTitle: '倫理與宗教 DSE 筆記 | 800+道德哲學題 - DSE LEVEL UP',
    notesTitle: '倫宗 DSE 筆記 | 規範倫理宗教思維重點 - DSE LEVEL UP',
    subjectDescription: '免費倫理與宗教 DSE 筆記配合 800+ 條哲學理論與道德兩難情境題目練習重點。深入探討各家學說理據，助你靈活應用答題，即刻免費展開高效溫習！',
    notesDescription: '必讀倫宗 DSE 筆記重點梳理效益主義、義務論、美德倫理及宗教傳統倫理重點。提供免費題目與答題指引，助你建構有力論點，立即免費閱讀在線筆記！',
    faqs: [
      { question: '倫理與宗教 DSE 難唔難？', answer: '本科重視哲學理論架構與道德思維邏輯，只要熟記效益主義、義務論等核心框架並掌握多角度論證，即可穩步取得理想成績。' },
      { question: '倫宗道德兩難題目該如何權衡論述？', answer: '先引述不同倫理學派的原則判斷，分析各方案的權益得失，再根據核心價值給出具說服力的立場抉擇。' },
      { question: '宗教傳統部分如何記憶教義與戒律？', answer: '將佛家四聖諦或基督宗教愛人如己等核心教義與現代醫療、環境議題對應記憶，能顯著加深理解。' }
    ]
  },
  'ths': {
    id: 'ths',
    name: '旅遊與款待',
    subjectTitle: '旅遊與款待 DSE 筆記 | 900+款待業題庫 - DSE LEVEL UP',
    notesTitle: 'THS DSE 筆記 | 款待營運旅遊地理重點 - DSE LEVEL UP',
    subjectDescription: '免費旅遊與款待 DSE 筆記結合 900+ 條款待業運作、旅遊景點規劃實用題目練習重點。附行業實務分析，助你輕鬆掌握考試脈絡，立即免費開啟溫習！',
    notesDescription: '專業 THS DSE 筆記系統總結酒店餐飲服務流程、旅遊業經濟文化影響重點。配套免費練習題目自我測試，助你靈活應對案例考題，立即免費在線研習！',
    faqs: [
      { question: 'THS 科目 DSE 考核特點是什麼？', answer: '重視業界實務案例與旅遊趨勢分析，題目常結合航空、酒店及會議展覽業營運情境考驗綜合應用。' },
      { question: '款待業前台與餐飲營運如何拿足細節分？', answer: '掌握標準服務流程（SOP）、顧客服務補救措施及食品安全衛生法規要點。' },
      { question: '可持續旅遊發展概念有何考點？', answer: '分析旅遊承載力、生態足跡評估以及如何平衡經濟收益與環境保育關係。' }
    ]
  },
  'health-management': {
    id: 'health-management',
    name: '健康管理與社會關懷',
    subjectTitle: '健康管理與社會關懷 DSE 筆記 | 1000+題目 - DSE LEVEL UP',
    notesTitle: '健康管理 DSE 筆記 | 健社照顧體系重點 - DSE LEVEL UP',
    subjectDescription: '免費健康管理與社會關懷 DSE 筆記配搭 1000+ 條身心健康、公共衛生題目操練重點。深入剖析社會福利政策，助你掌握奪星架構，立即免費開始溫習！',
    notesDescription: '必讀健康管理 DSE 筆記整合全人健康維度、疾病預防策略及社會支援網絡核心重點。配套免費題目訓練案例解構技巧，助你破除難題，立即免費精讀筆記！',
    faqs: [
      { question: '健康管理與社會關懷 DSE 答題有何黃金架構？', answer: '貫徹「生理、心理、社交、靈性」全人健康四大維度，並按初級、次級、三級預防策略分層分析。' },
      { question: '健社個案分析題如何命中採分點？', answer: '分析服務使用者在不同人生階段的身心特徵與需求，對應適當的社區照護與家庭支援服務。' },
      { question: '公共衛生政策推廣應包含哪些要素？', answer: '結合健康教育宣傳、法規監管措施及醫療服務提供三大支柱完整闡述。' }
    ]
  },
  'design-tech': {
    id: 'design-tech',
    name: '設計與應用科技',
    subjectTitle: '設計與科技 DSE 筆記 | 700+工程材料題 - DSE LEVEL UP',
    notesTitle: 'DAT DSE 筆記 | 機構材料科技創新重點 - DSE LEVEL UP',
    subjectDescription: '免費設計與應用科技 DSE 筆記搭配 700+ 條材料特性、機構原理題目練習重點。附工程圖繪製與設計思維指引，助你扎實應試實力，立即免費開始題庫複習！',
    notesDescription: '實用 DAT DSE 筆記整合金屬木材特性、齒輪傳動結構及現代製造技術重點。配合免費線上題目即時反饋，助你輕鬆掌握科技原理，立即免費在線研習！',
    faqs: [
      { question: 'DAT 設計題目如何展示創新思維？', answer: '遵循以人為本設計流程，明確定義用戶痛點並給出具可行性的多樣化原型方案。' },
      { question: '工程材料選取題怎樣作答？', answer: '對比抗拉強度、耐腐蝕性、加工成本及環保回收性等具體物理化學指標。' },
      { question: '機械傳動機構如何快速計算速比？', answer: '熟練齒輪齒數比、帶輪直徑比公式，分清增速與增扭機構的運作特點。' }
    ]
  },
  'visual-arts': {
    id: 'visual-arts',
    name: '視覺藝術',
    subjectTitle: '視覺藝術 DSE 筆記 | 600+藝術評賞題目 - DSE LEVEL UP',
    notesTitle: '視藝 DSE 筆記 | 形式美感評賞重點精讀 - DSE LEVEL UP',
    subjectDescription: '免費視覺藝術 DSE 筆記包含 600+ 條藝術評賞、創作手法理論題目練習重點。深入剖析構圖色彩與時代背景，助你昇華美學視野，立即免費閱讀溫習！',
    notesDescription: '精華視藝 DSE 筆記整理視覺元素、形式組織原理與中西藝術史名作重點。附免費題目自我檢閱，助你流暢撰寫深度藝術評析，立即免費在線精讀！',
    faqs: [
      { question: '視覺藝術評賞文章的標準結構？', answer: '按照「描述外貌、分析形式原理、解釋思想意涵、評價藝術價值」四部曲作答。' },
      { question: '色彩與構圖在視藝考試中怎樣分析？', answer: '探討色調對比、冷暖氛圍以及黃金分割、三角對稱等視覺引導手法。' },
      { question: '視藝評賞如何融入時代文化背景？', answer: '結合作者生平、當時社會變革或藝術思潮，論證作品所反映的時代精神。' }
    ]
  },
  'music': {
    id: 'music',
    name: '音樂',
    subjectTitle: '音樂科 DSE 筆記 | 600+樂理聆聽題目 - DSE LEVEL UP',
    notesTitle: '音樂 DSE 筆記 | 樂曲風格作曲手法重點 - DSE LEVEL UP',
    subjectDescription: '免費音樂科 DSE 筆記結合 600+ 條西洋音樂史、中國音樂及粵劇題庫練習重點。每題均有樂理解析與曲式分析指引，助你扎穩樂理基礎，立即免費練習！',
    notesDescription: '專業音樂 DSE 筆記系統歸納古典浪漫樂派曲式、和聲進行與器樂音色重點。配合免費題目訓練聆聽辨識能力，助你奪取高分，立即免費在線閱讀！',
    faqs: [
      { question: '音樂科聆聽測驗怎樣快速捕捉樂器音色？', answer: '注意發音原理（弓弦、木管、銅管、打擊）與常規演奏技巧（撥弦、弱音器）。' },
      { question: '曲式分析（如奏鳴曲式）如何精確定位？', answer: '透過呈示部、發展部、再現部的調性轉化與主題動機再現加以辨認。' },
      { question: '中樂與粵劇知識有哪些高頻重點？', answer: '熟記八音分類、五聲音階體系、工尺譜符號以及粵劇牌子曲牌常識。' }
    ]
  },
  'pe': {
    id: 'pe',
    name: '體育',
    subjectTitle: '體育 DSE 筆記 | 800+運動科學題庫 - DSE LEVEL UP',
    notesTitle: 'DSE PE 筆記 | 解剖生理訓練法重點 - DSE LEVEL UP',
    subjectDescription: '免費體育 DSE 筆記匯集 800+ 運動生理學、生物力學及訓練原則題目練習重點。附運動解剖與處方剖析，助你鞏固運動知識，立即免費展開在線溫習！',
    notesDescription: '必讀 DSE PE 筆記整合人體三大能量系統、骨骼肌肉構造及運動心理學重點。配套免費原創題目核對，助你輕鬆破除理論盲點，立即免費在線精讀！',
    faqs: [
      { question: 'DSE PE 筆記運動生理學有何必讀核心？', answer: '三大能量系統（ATP-CP、乳酸、有氧系統）的供能特點、燃料來源及運動持續時間對應。' },
      { question: '體育生物力學運動槓桿題目怎樣區分？', answer: '根據支點、施力點與抗力點的相對位置，準確判定第一、二、三類槓桿及其機械利益。' },
      { question: '體育訓練原則（FITT）如何應用於個案？', answer: '結合運動頻率（Frequency）、強度（Intensity）、時間（Time）與類型（Type）制訂科學訓練處方。' }
    ]
  },
  'technology-living': {
    id: 'technology-living',
    name: '科技與生活',
    subjectTitle: '科技與生活 DSE 筆記 | 800+營養食品題 - DSE LEVEL UP',
    notesTitle: '科技與生活 DSE 筆記 | 食物科學服裝重點 - DSE LEVEL UP',
    subjectDescription: '免費科技與生活 DSE 筆記提供 800+ 條食物科學、營養學及時尚生活題目練習重點。附詳細營養計算與生活實務解析，立即免費開啟高效學習模式！',
    notesDescription: '精華科技與生活 DSE 筆記梳理巨量微量營養素、食品保存技術與紡織纖維重點。配合免費線上題庫強化記憶，助你輕鬆攻克考核難關，立即免費閱讀溫習！',
    faqs: [
      { question: '科技與生活 DSE 考核重點有哪些？', answer: '本科主要涵蓋食物科學與營養、膳食設計、食物安全衛生，以及時尚紡織材料與消費者可持續發展抉擇。' },
      { question: '膳食計劃與營養需求題目作答關鍵？', answer: '針對不同生命週期族群（如長者、孕婦、青少年）的特殊生理需求，計算熱量配比與微量營養素補充。' },
      { question: '食品變質與保存技術如何深入分析？', answer: '探討微生物生長條件（水分活度、溫度、酸鹼值）及巴氏消毒、真空包裝等防腐原理。' }
    ]
  }
}

export function getSubjectSeoConfig(subjectId: string): SubjectSeoConfig | undefined {
  return SUBJECT_SEO_CONFIGS[subjectId]
}
