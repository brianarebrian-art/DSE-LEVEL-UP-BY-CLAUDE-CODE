export type Subject = { slug: string; name: string; english: string; summary: string; topics: { slug: string; title: string; description: string }[] }

export const seoSubjects: Subject[] = [
  { slug: 'dse-maths', name: 'DSE Maths', english: 'Mathematics', summary: '由核心概念、公式到 Past Paper 題解，逐步建立 DSE Maths 解題思路。', topics: [{ slug: 'quadratic-equations', title: '一元二次方程', description: '整理因式分解、公式法、判別式與常見失分位。' }, { slug: 'functions', title: 'Functions 函數', description: '掌握定義域、值域、圖像變換與題型辨識。' }] },
  { slug: 'dse-english', name: 'DSE English', english: 'English Language', summary: '用清晰框架掌握 writing format、reading skills 與實用英文表達。', topics: [{ slug: 'writing-format', title: 'Writing Format', description: 'Letter、article、report 的結構、語氣與段落安排。' }, { slug: 'reading-techniques', title: 'Reading Techniques', description: '學習定位關鍵字、推論與 paraphrase 的閱讀方法。' }] },
  { slug: 'dse-chinese', name: 'DSE 中文', english: 'Chinese Language', summary: '集中整理卷一閱讀、卷二寫作與文言文常見技巧。', topics: [{ slug: 'reading-techniques', title: '閱讀理解技巧', description: '由題型、關鍵詞到答題組織，建立穩定閱讀流程。' }] },
  { slug: 'dse-biology', name: 'DSE Biology', english: 'Biology', summary: '以圖表和概念連結理解細胞、生物體與遺傳等 DSE Biology 主題。', topics: [{ slug: 'cell-cycle', title: 'Cell Cycle 細胞週期', description: '比較 interphase、mitosis 各階段及常見考點。' }] },
  { slug: 'dse-chemistry', name: 'DSE Chemistry', english: 'Chemistry', summary: '由粒子概念到計算題，清楚拆解 DSE Chemistry 常見題型。', topics: [{ slug: 'mole-calculations', title: 'Mole Calculations 摩爾計算', description: '掌握 mol、mass、concentration 與方程式的互換。' }] },
  { slug: 'dse-physics', name: 'DSE Physics', english: 'Physics', summary: '用單位、公式和圖像建立 DSE Physics 的解題流程。', topics: [{ slug: 'motion', title: 'Motion 運動', description: '理解 displacement、velocity、acceleration 與圖像題。' }] },
  { slug: 'dse-economics', name: 'DSE Economics', english: 'Economics', summary: '整理供求、彈性、宏觀經濟與圖表分析的答題重點。', topics: [{ slug: 'elasticity', title: 'Elasticity 彈性', description: '由公式到圖像，掌握 elasticity 題目的分析方法。' }] },
  { slug: 'dse-bafs', name: 'DSE BAFS', english: 'Business, Accounting and Financial Studies', summary: '清楚整理會計、商業管理與財務分析的核心概念。', topics: [{ slug: 'accounting-basics', title: 'Accounting Basics 會計基礎', description: '理解 double-entry、財務報表與常見分類。' }] },
]

export const aiTools = [
  { slug: 'practice-generator', title: 'AI 練習題生成器', description: '針對你的科目、章節和弱點生成適合的練習方向。' },
  { slug: 'study-plan', title: 'AI 個人化溫習計劃', description: '把考試日期和可用時間整理成可執行的溫習步驟。' },
  { slug: 'past-paper-explainer', title: 'AI Past Paper 題解', description: '逐步拆解題目要求、評分重點和常見失分位。' },
  { slug: 'essay-feedback', title: 'AI Essay Feedback', description: '從結構、語氣和論點角度檢視英文寫作方向。' },
]
