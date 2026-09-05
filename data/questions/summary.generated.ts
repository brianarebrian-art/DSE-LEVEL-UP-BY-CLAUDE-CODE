// ⚠️ 本檔由 scripts/gen-question-summary.mts 產生 —— 請勿手動修改。
// 重新產生：npm run gen:summary
// 迴歸鎖：data/questions/__tests__/summary-parity.test.mts（每次 npm test 均取真題庫重算比對）
//
// 本檔存在的唯一理由：令 client 組件毋須 import barrel。
// barrel 靜態 import 全部 25 科題庫，任何 'use client' 檔案觸及即會將 2.2MB
// 題目 build 入瀏覽器（2026-09-05 生產站實測）。此處是同一批數字，gzip 12KB。
//
// 只需要數字／課題名稱 → 使用本檔。
// 確實需要題目內容   → 使用 data/questions/load.ts 的逐科 lazy loader。
import type { Topic } from './types'

export interface SubjectSummary {
  /** 全部題目（MC ＋ 書寫題）*/
  total: number
  mc: number
  /** text ＋ long。此兩類永不由機器批改（憲章 §16.A）。 */
  written: number
  topics: number
}

export const SUBJECT_SUMMARY: Record<string, SubjectSummary> = {
  "math": {
    "total": 1539,
    "mc": 1509,
    "written": 30,
    "topics": 25
  },
  "m2": {
    "total": 1002,
    "mc": 1002,
    "written": 0,
    "topics": 10
  },
  "m1": {
    "total": 1016,
    "mc": 1016,
    "written": 0,
    "topics": 12
  },
  "physics": {
    "total": 1087,
    "mc": 1087,
    "written": 0,
    "topics": 13
  },
  "chemistry": {
    "total": 1002,
    "mc": 1002,
    "written": 0,
    "topics": 14
  },
  "biology": {
    "total": 1009,
    "mc": 1009,
    "written": 0,
    "topics": 11
  },
  "english": {
    "total": 1037,
    "mc": 1037,
    "written": 0,
    "topics": 12
  },
  "chinese": {
    "total": 1092,
    "mc": 1020,
    "written": 72,
    "topics": 19
  },
  "bafs": {
    "total": 1018,
    "mc": 1018,
    "written": 0,
    "topics": 13
  },
  "ict": {
    "total": 1001,
    "mc": 1001,
    "written": 0,
    "topics": 10
  },
  "economics": {
    "total": 1011,
    "mc": 1011,
    "written": 0,
    "topics": 13
  },
  "csd": {
    "total": 1003,
    "mc": 1003,
    "written": 0,
    "topics": 11
  },
  "chinese-history": {
    "total": 1074,
    "mc": 1074,
    "written": 0,
    "topics": 10
  },
  "history": {
    "total": 1089,
    "mc": 1051,
    "written": 38,
    "topics": 14
  },
  "geography": {
    "total": 1003,
    "mc": 1003,
    "written": 0,
    "topics": 10
  },
  "chinese-literature": {
    "total": 1042,
    "mc": 1042,
    "written": 0,
    "topics": 10
  },
  "english-literature": {
    "total": 1026,
    "mc": 1026,
    "written": 0,
    "topics": 10
  },
  "ethics-religious": {
    "total": 1074,
    "mc": 1074,
    "written": 0,
    "topics": 10
  },
  "ths": {
    "total": 1008,
    "mc": 1008,
    "written": 0,
    "topics": 10
  },
  "health-management": {
    "total": 1008,
    "mc": 1008,
    "written": 0,
    "topics": 11
  },
  "design-tech": {
    "total": 1010,
    "mc": 1010,
    "written": 0,
    "topics": 10
  },
  "visual-arts": {
    "total": 1000,
    "mc": 1000,
    "written": 0,
    "topics": 10
  },
  "music": {
    "total": 1014,
    "mc": 1014,
    "written": 0,
    "topics": 10
  },
  "pe": {
    "total": 1019,
    "mc": 1019,
    "written": 0,
    "topics": 10
  },
  "technology-living": {
    "total": 1020,
    "mc": 1020,
    "written": 0,
    "topics": 10
  }
}

/** 課題清單，連同逐課題題數。等同 getSubjectTopics()，但不會拉入題目。 */
export const SUBJECT_TOPICS: Record<string, Topic[]> = {
  "math": [
    {
      "id": "quadratic_equations",
      "zh": "二次方程",
      "en": "Quadratic Equations",
      "framework": "轉化思維",
      "frameworkEn": "Transformative Thinking",
      "emoji": "🔄",
      "count": 283,
      "mcCount": 281,
      "writtenCount": 2
    },
    {
      "id": "probability",
      "zh": "概率",
      "en": "Probability",
      "framework": "條件分解",
      "frameworkEn": "Condition Decomposition",
      "emoji": "🎯",
      "count": 38,
      "mcCount": 36,
      "writtenCount": 2
    },
    {
      "id": "functions",
      "zh": "函數與建模",
      "en": "Functions & Modelling",
      "framework": "建模能力",
      "frameworkEn": "Modelling",
      "emoji": "🏗️",
      "count": 52,
      "mcCount": 52,
      "writtenCount": 0
    },
    {
      "id": "trigonometry",
      "zh": "三角函數",
      "en": "Trigonometry",
      "framework": "轉化思維",
      "frameworkEn": "Transformative Thinking",
      "emoji": "🔄",
      "count": 46,
      "mcCount": 44,
      "writtenCount": 2
    },
    {
      "id": "statistics",
      "zh": "統計",
      "en": "Statistics",
      "framework": "條件分解",
      "frameworkEn": "Condition Decomposition",
      "emoji": "🎯",
      "count": 34,
      "mcCount": 31,
      "writtenCount": 3
    },
    {
      "id": "logarithms",
      "zh": "對數與指數",
      "en": "Logarithms & Exponents",
      "framework": "轉化思維",
      "frameworkEn": "Transformative Thinking",
      "emoji": "🔄",
      "count": 43,
      "mcCount": 41,
      "writtenCount": 2
    },
    {
      "id": "sequences",
      "zh": "數列",
      "en": "Sequences",
      "framework": "數列規律",
      "frameworkEn": "Sequence Patterns",
      "emoji": "🔢",
      "count": 85,
      "mcCount": 84,
      "writtenCount": 1
    },
    {
      "id": "percentage",
      "zh": "百分數與利率",
      "en": "Percentages & Interest",
      "framework": "建模能力",
      "frameworkEn": "Modelling",
      "emoji": "🏗️",
      "count": 44,
      "mcCount": 42,
      "writtenCount": 2
    },
    {
      "id": "coordinate_geometry",
      "zh": "坐標幾何",
      "en": "Coordinate Geometry",
      "framework": "幾何直覺",
      "frameworkEn": "Geometric Intuition",
      "emoji": "📐",
      "count": 57,
      "mcCount": 55,
      "writtenCount": 2
    },
    {
      "id": "inequalities",
      "zh": "不等式",
      "en": "Inequalities",
      "framework": "條件分解",
      "frameworkEn": "Condition Decomposition",
      "emoji": "🎯",
      "count": 35,
      "mcCount": 35,
      "writtenCount": 0
    },
    {
      "id": "circles",
      "zh": "圓的幾何特性",
      "en": "Properties of Circles",
      "framework": "幾何直覺",
      "frameworkEn": "Geometric Intuition",
      "emoji": "📐",
      "count": 40,
      "mcCount": 38,
      "writtenCount": 2
    },
    {
      "id": "trig_3d",
      "zh": "三維三角學",
      "en": "3D Trigonometry",
      "framework": "幾何直覺",
      "frameworkEn": "Geometric Intuition",
      "emoji": "📐",
      "count": 40,
      "mcCount": 39,
      "writtenCount": 1
    },
    {
      "id": "permutation_combination",
      "zh": "排列與組合",
      "en": "Permutations & Combinations",
      "framework": "條件分解",
      "frameworkEn": "Condition Decomposition",
      "emoji": "🎯",
      "count": 35,
      "mcCount": 34,
      "writtenCount": 1
    },
    {
      "id": "locus",
      "zh": "軌跡與坐標",
      "en": "Locus & Coordinates",
      "framework": "幾何直覺",
      "frameworkEn": "Geometric Intuition",
      "emoji": "📐",
      "count": 70,
      "mcCount": 70,
      "writtenCount": 0
    },
    {
      "id": "polygons",
      "zh": "多邊形與角",
      "en": "Polygons & Angles",
      "framework": "幾何直覺",
      "frameworkEn": "Geometric Intuition",
      "emoji": "📐",
      "count": 47,
      "mcCount": 46,
      "writtenCount": 1
    },
    {
      "id": "similar_solids",
      "zh": "相似形與相似立體",
      "en": "Similar Figures & Solids",
      "framework": "幾何直覺",
      "frameworkEn": "Geometric Intuition",
      "emoji": "📐",
      "count": 34,
      "mcCount": 33,
      "writtenCount": 1
    },
    {
      "id": "variation",
      "zh": "變分",
      "en": "Variation",
      "framework": "建模能力",
      "frameworkEn": "Modelling",
      "emoji": "🏗️",
      "count": 65,
      "mcCount": 64,
      "writtenCount": 1
    },
    {
      "id": "approximation",
      "zh": "近似與誤差",
      "en": "Approximation & Error",
      "framework": "基礎運算",
      "frameworkEn": "Foundation Computation",
      "emoji": "🧮",
      "count": 44,
      "mcCount": 44,
      "writtenCount": 0
    },
    {
      "id": "number_systems",
      "zh": "數系",
      "en": "Number Systems",
      "framework": "基礎運算",
      "frameworkEn": "Foundation Computation",
      "emoji": "🧮",
      "count": 36,
      "mcCount": 36,
      "writtenCount": 0
    },
    {
      "id": "indices",
      "zh": "指數定律",
      "en": "Laws of Indices",
      "framework": "基礎運算",
      "frameworkEn": "Foundation Computation",
      "emoji": "🧮",
      "count": 63,
      "mcCount": 62,
      "writtenCount": 1
    },
    {
      "id": "linear_functions",
      "zh": "一次函數",
      "en": "Linear Functions",
      "framework": "基礎運算",
      "frameworkEn": "Foundation Computation",
      "emoji": "🧮",
      "count": 76,
      "mcCount": 76,
      "writtenCount": 0
    },
    {
      "id": "factors_multiples",
      "zh": "因數與倍數",
      "en": "Factors & Multiples",
      "framework": "基礎運算",
      "frameworkEn": "Foundation Computation",
      "emoji": "🧮",
      "count": 32,
      "mcCount": 32,
      "writtenCount": 0
    },
    {
      "id": "arithmetic_sequence",
      "zh": "等差數列",
      "en": "Arithmetic Sequences",
      "framework": "代數思維",
      "frameworkEn": "Algebraic Thinking",
      "emoji": "🔢",
      "count": 142,
      "mcCount": 140,
      "writtenCount": 2
    },
    {
      "id": "geometric_sequence",
      "zh": "等比數列",
      "en": "Geometric Sequences",
      "framework": "代數思維",
      "frameworkEn": "Algebraic Thinking",
      "emoji": "🔢",
      "count": 37,
      "mcCount": 36,
      "writtenCount": 1
    },
    {
      "id": "polynomials",
      "zh": "餘式與因式定理",
      "en": "Remainder & Factor Theorem",
      "framework": "代數思維",
      "frameworkEn": "Algebraic Thinking",
      "emoji": "🔢",
      "count": 61,
      "mcCount": 58,
      "writtenCount": 3
    }
  ],
  "m2": [
    {
      "id": "differentiation",
      "zh": "微分法",
      "en": "Differentiation",
      "framework": "變化率直覺",
      "frameworkEn": "Rate-of-change Intuition",
      "emoji": "📈",
      "count": 107,
      "mcCount": 107,
      "writtenCount": 0
    },
    {
      "id": "integration",
      "zh": "積分法",
      "en": "Integration",
      "framework": "轉化思維",
      "frameworkEn": "Transformative Thinking",
      "emoji": "🔄",
      "count": 100,
      "mcCount": 100,
      "writtenCount": 0
    },
    {
      "id": "limits",
      "zh": "極限",
      "en": "Limits",
      "framework": "轉化思維",
      "frameworkEn": "Transformative Thinking",
      "emoji": "🔄",
      "count": 102,
      "mcCount": 102,
      "writtenCount": 0
    },
    {
      "id": "matrices",
      "zh": "矩陣與行列式",
      "en": "Matrices & Determinants",
      "framework": "條件分解",
      "frameworkEn": "Condition Decomposition",
      "emoji": "🎯",
      "count": 103,
      "mcCount": 103,
      "writtenCount": 0
    },
    {
      "id": "vectors",
      "zh": "向量",
      "en": "Vectors",
      "framework": "幾何直覺",
      "frameworkEn": "Geometric Intuition",
      "emoji": "📐",
      "count": 96,
      "mcCount": 96,
      "writtenCount": 0
    },
    {
      "id": "mathematical_induction",
      "zh": "數學歸納法",
      "en": "Mathematical Induction",
      "framework": "條件分解",
      "frameworkEn": "Condition Decomposition",
      "emoji": "🎯",
      "count": 99,
      "mcCount": 99,
      "writtenCount": 0
    },
    {
      "id": "binomial_theorem",
      "zh": "二項式定理",
      "en": "Binomial Theorem",
      "framework": "條件分解",
      "frameworkEn": "Condition Decomposition",
      "emoji": "🎯",
      "count": 93,
      "mcCount": 93,
      "writtenCount": 0
    },
    {
      "id": "calculus_app",
      "zh": "微積分應用",
      "en": "Applications of Calculus",
      "framework": "建模能力",
      "frameworkEn": "Modelling",
      "emoji": "🏗️",
      "count": 100,
      "mcCount": 100,
      "writtenCount": 0
    },
    {
      "id": "m2_vectors_3d",
      "zh": "三維向量",
      "en": "3-D vectors",
      "framework": "建模能力",
      "frameworkEn": "Modelling",
      "emoji": "🏗️",
      "count": 101,
      "mcCount": 101,
      "writtenCount": 0
    },
    {
      "id": "linear_systems",
      "zh": "線性方程組",
      "en": "Systems of Linear Equations",
      "framework": "代數",
      "frameworkEn": "Algebra",
      "emoji": "🔢",
      "count": 101,
      "mcCount": 101,
      "writtenCount": 0
    }
  ],
  "m1": [
    {
      "id": "permutation_combination",
      "zh": "排列與組合",
      "en": "Permutations & Combinations",
      "framework": "條件分解",
      "frameworkEn": "Condition Decomposition",
      "emoji": "🎯",
      "count": 66,
      "mcCount": 66,
      "writtenCount": 0
    },
    {
      "id": "binomial",
      "zh": "二項式定理",
      "en": "Binomial Theorem",
      "framework": "條件分解",
      "frameworkEn": "Condition Decomposition",
      "emoji": "🎯",
      "count": 84,
      "mcCount": 84,
      "writtenCount": 0
    },
    {
      "id": "exp_log_calculus",
      "zh": "指數對數微積分",
      "en": "Exp/Log Calculus",
      "framework": "變化率直覺",
      "frameworkEn": "Rate-of-change Intuition",
      "emoji": "📈",
      "count": 66,
      "mcCount": 66,
      "writtenCount": 0
    },
    {
      "id": "calculus_app",
      "zh": "微積分應用",
      "en": "Applications of Calculus",
      "framework": "建模能力",
      "frameworkEn": "Modelling",
      "emoji": "🏗️",
      "count": 105,
      "mcCount": 105,
      "writtenCount": 0
    },
    {
      "id": "probability_dist",
      "zh": "概率分佈",
      "en": "Probability Distributions",
      "framework": "建模能力",
      "frameworkEn": "Modelling",
      "emoji": "🏗️",
      "count": 80,
      "mcCount": 80,
      "writtenCount": 0
    },
    {
      "id": "normal_distribution",
      "zh": "正態分佈",
      "en": "Normal Distribution",
      "framework": "建模能力",
      "frameworkEn": "Modelling",
      "emoji": "🏗️",
      "count": 80,
      "mcCount": 80,
      "writtenCount": 0
    },
    {
      "id": "statistics_inference",
      "zh": "統計推斷",
      "en": "Statistical Inference",
      "framework": "建模能力",
      "frameworkEn": "Modelling",
      "emoji": "🏗️",
      "count": 61,
      "mcCount": 61,
      "writtenCount": 0
    },
    {
      "id": "m1_distributions",
      "zh": "概率分佈（高階）",
      "en": "Probability distributions",
      "framework": "條件分解",
      "frameworkEn": "Condition Decomposition",
      "emoji": "🎯",
      "count": 62,
      "mcCount": 62,
      "writtenCount": 0
    },
    {
      "id": "m1_normal_calc",
      "zh": "正態分佈計算",
      "en": "Normal distribution — calculation",
      "framework": "建模能力",
      "frameworkEn": "Modelling",
      "emoji": "🏗️",
      "count": 121,
      "mcCount": 121,
      "writtenCount": 0
    },
    {
      "id": "differentiation",
      "zh": "微分",
      "en": "Differentiation",
      "framework": "微積分",
      "frameworkEn": "Calculus",
      "emoji": "📈",
      "count": 142,
      "mcCount": 142,
      "writtenCount": 0
    },
    {
      "id": "integration",
      "zh": "積分",
      "en": "Integration",
      "framework": "微積分",
      "frameworkEn": "Calculus",
      "emoji": "📈",
      "count": 79,
      "mcCount": 79,
      "writtenCount": 0
    },
    {
      "id": "binomial_distribution",
      "zh": "二項分佈",
      "en": "Binomial Distribution",
      "framework": "統計",
      "frameworkEn": "Statistics",
      "emoji": "📊",
      "count": 70,
      "mcCount": 70,
      "writtenCount": 0
    }
  ],
  "physics": [
    {
      "id": "mechanics",
      "zh": "力學",
      "en": "Mechanics",
      "framework": "守恆定律",
      "frameworkEn": "Conservation Laws",
      "emoji": "⚖️",
      "count": 91,
      "mcCount": 91,
      "writtenCount": 0
    },
    {
      "id": "electricity",
      "zh": "電學",
      "en": "Electricity",
      "framework": "電路分析",
      "frameworkEn": "Circuit Analysis",
      "emoji": "⚡",
      "count": 213,
      "mcCount": 213,
      "writtenCount": 0
    },
    {
      "id": "heat",
      "zh": "熱學",
      "en": "Heat",
      "framework": "能量轉移",
      "frameworkEn": "Energy Transfer",
      "emoji": "🔥",
      "count": 60,
      "mcCount": 60,
      "writtenCount": 0
    },
    {
      "id": "waves",
      "zh": "波動",
      "en": "Waves",
      "framework": "波的關係",
      "frameworkEn": "Wave Relationships",
      "emoji": "🌊",
      "count": 71,
      "mcCount": 71,
      "writtenCount": 0
    },
    {
      "id": "optics",
      "zh": "光學",
      "en": "Optics",
      "framework": "光的傳播",
      "frameworkEn": "Propagation of Light",
      "emoji": "🔦",
      "count": 65,
      "mcCount": 65,
      "writtenCount": 0
    },
    {
      "id": "radioactivity",
      "zh": "放射現象",
      "en": "Radioactivity",
      "framework": "衰變規律",
      "frameworkEn": "Decay Laws",
      "emoji": "☢️",
      "count": 81,
      "mcCount": 81,
      "writtenCount": 0
    },
    {
      "id": "phys_hell_mechanics",
      "zh": "多步計算・力學",
      "en": "Multi-step — Mechanics",
      "framework": "守恆定律",
      "frameworkEn": "Conservation Laws",
      "emoji": "⚖️",
      "count": 65,
      "mcCount": 65,
      "writtenCount": 0
    },
    {
      "id": "phys_hell_elec_heat",
      "zh": "多步計算・電與熱",
      "en": "Multi-step — Electricity & Heat",
      "framework": "電路分析",
      "frameworkEn": "Circuit Analysis",
      "emoji": "⚡",
      "count": 53,
      "mcCount": 53,
      "writtenCount": 0
    },
    {
      "id": "phys_hell_wave_optics",
      "zh": "多步計算・波動光學放射",
      "en": "Multi-step — Waves, Optics & Radioactivity",
      "framework": "波的關係",
      "frameworkEn": "Wave Relationships",
      "emoji": "🌊",
      "count": 68,
      "mcCount": 68,
      "writtenCount": 0
    },
    {
      "id": "kinematics",
      "zh": "運動學",
      "en": "Kinematics",
      "framework": "基礎公式",
      "frameworkEn": "Core Formula",
      "emoji": "🔬",
      "count": 96,
      "mcCount": 96,
      "writtenCount": 0
    },
    {
      "id": "force_motion",
      "zh": "力與運動",
      "en": "Force & Motion",
      "framework": "基礎公式",
      "frameworkEn": "Core Formula",
      "emoji": "🔬",
      "count": 80,
      "mcCount": 80,
      "writtenCount": 0
    },
    {
      "id": "pressure_density",
      "zh": "壓強與密度",
      "en": "Pressure & Density",
      "framework": "基礎公式",
      "frameworkEn": "Core Formula",
      "emoji": "🔬",
      "count": 65,
      "mcCount": 65,
      "writtenCount": 0
    },
    {
      "id": "work_energy",
      "zh": "功、能與功率",
      "en": "Work, Energy & Power",
      "framework": "能量守恆",
      "frameworkEn": "Energy Conservation",
      "emoji": "⚡",
      "count": 79,
      "mcCount": 79,
      "writtenCount": 0
    }
  ],
  "chemistry": [
    {
      "id": "mole",
      "zh": "摩爾概念",
      "en": "The Mole Concept",
      "framework": "定量推理",
      "frameworkEn": "Quantitative Reasoning",
      "emoji": "⚖️",
      "count": 92,
      "mcCount": 92,
      "writtenCount": 0
    },
    {
      "id": "acids_bases",
      "zh": "酸鹼",
      "en": "Acids & Bases",
      "framework": "平衡概念",
      "frameworkEn": "Equilibrium Concepts",
      "emoji": "⚗️",
      "count": 106,
      "mcCount": 106,
      "writtenCount": 0
    },
    {
      "id": "redox",
      "zh": "氧化還原",
      "en": "Redox",
      "framework": "電子轉移",
      "frameworkEn": "Electron Transfer",
      "emoji": "🔋",
      "count": 49,
      "mcCount": 49,
      "writtenCount": 0
    },
    {
      "id": "rates_energy",
      "zh": "反應速率與能量",
      "en": "Reaction Rates & Energy",
      "framework": "反應動力",
      "frameworkEn": "Reaction Dynamics",
      "emoji": "🔥",
      "count": 84,
      "mcCount": 84,
      "writtenCount": 0
    },
    {
      "id": "bonding",
      "zh": "化學鍵",
      "en": "Chemical Bonding",
      "framework": "結構與性質",
      "frameworkEn": "Structure & Properties",
      "emoji": "🔗",
      "count": 74,
      "mcCount": 74,
      "writtenCount": 0
    },
    {
      "id": "periodic_table",
      "zh": "週期表",
      "en": "The Periodic Table",
      "framework": "結構與性質",
      "frameworkEn": "Structure & Properties",
      "emoji": "🔗",
      "count": 47,
      "mcCount": 47,
      "writtenCount": 0
    },
    {
      "id": "organic",
      "zh": "有機化學",
      "en": "Organic Chemistry",
      "framework": "碳化合物",
      "frameworkEn": "Carbon Compounds",
      "emoji": "🛢️",
      "count": 54,
      "mcCount": 54,
      "writtenCount": 0
    },
    {
      "id": "chem_hell_quant",
      "zh": "定量計算（高階）",
      "en": "Quantitative killers",
      "framework": "定量推理",
      "frameworkEn": "Quantitative Reasoning",
      "emoji": "⚖️",
      "count": 134,
      "mcCount": 134,
      "writtenCount": 0
    },
    {
      "id": "chem_hell_redox_equil",
      "zh": "氧化還原與平衡",
      "en": "Redox & equilibrium",
      "framework": "電子轉移",
      "frameworkEn": "Electron Transfer",
      "emoji": "🔋",
      "count": 44,
      "mcCount": 44,
      "writtenCount": 0
    },
    {
      "id": "chem_hell_organic",
      "zh": "有機化學（高階）",
      "en": "Organic killers",
      "framework": "碳化合物",
      "frameworkEn": "Carbon Compounds",
      "emoji": "🛢️",
      "count": 36,
      "mcCount": 36,
      "writtenCount": 0
    },
    {
      "id": "formula_mass",
      "zh": "化學式與式量",
      "en": "Formulae & Formula Mass",
      "framework": "公式運算",
      "frameworkEn": "Formula Calculation",
      "emoji": "🧪",
      "count": 47,
      "mcCount": 47,
      "writtenCount": 0
    },
    {
      "id": "concentration",
      "zh": "濃度",
      "en": "Concentration",
      "framework": "公式運算",
      "frameworkEn": "Formula Calculation",
      "emoji": "🧪",
      "count": 121,
      "mcCount": 121,
      "writtenCount": 0
    },
    {
      "id": "gas_volume",
      "zh": "氣體體積",
      "en": "Gas Volume",
      "framework": "反應分析",
      "frameworkEn": "Reaction Analysis",
      "emoji": "🔬",
      "count": 55,
      "mcCount": 55,
      "writtenCount": 0
    },
    {
      "id": "stoichiometry",
      "zh": "化學計量",
      "en": "Stoichiometry",
      "framework": "反應分析",
      "frameworkEn": "Reaction Analysis",
      "emoji": "🔬",
      "count": 59,
      "mcCount": 59,
      "writtenCount": 0
    }
  ],
  "biology": [
    {
      "id": "cells",
      "zh": "細胞",
      "en": "Cells",
      "framework": "結構與功能",
      "frameworkEn": "Structure & Function",
      "emoji": "🔬",
      "count": 90,
      "mcCount": 90,
      "writtenCount": 0
    },
    {
      "id": "genetics",
      "zh": "遺傳",
      "en": "Genetics",
      "framework": "遺傳邏輯",
      "frameworkEn": "Genetic Logic",
      "emoji": "🧬",
      "count": 83,
      "mcCount": 83,
      "writtenCount": 0
    },
    {
      "id": "human_body",
      "zh": "人體系統",
      "en": "Human Body Systems",
      "framework": "系統調節",
      "frameworkEn": "System Regulation",
      "emoji": "❤️",
      "count": 89,
      "mcCount": 89,
      "writtenCount": 0
    },
    {
      "id": "coordination",
      "zh": "神經與協調",
      "en": "Nervous Coordination",
      "framework": "系統調節",
      "frameworkEn": "System Regulation",
      "emoji": "❤️",
      "count": 89,
      "mcCount": 89,
      "writtenCount": 0
    },
    {
      "id": "enzymes",
      "zh": "酶",
      "en": "Enzymes",
      "framework": "系統調節",
      "frameworkEn": "System Regulation",
      "emoji": "❤️",
      "count": 88,
      "mcCount": 88,
      "writtenCount": 0
    },
    {
      "id": "photosynthesis",
      "zh": "光合作用",
      "en": "Photosynthesis",
      "framework": "能量流動",
      "frameworkEn": "Energy Flow",
      "emoji": "🌿",
      "count": 99,
      "mcCount": 99,
      "writtenCount": 0
    },
    {
      "id": "ecology",
      "zh": "生態",
      "en": "Ecology",
      "framework": "能量流動",
      "frameworkEn": "Energy Flow",
      "emoji": "🌿",
      "count": 90,
      "mcCount": 90,
      "writtenCount": 0
    },
    {
      "id": "digestion",
      "zh": "營養與消化",
      "en": "Nutrition & Digestion",
      "framework": "結構與功能",
      "frameworkEn": "Structure & Function",
      "emoji": "🔬",
      "count": 107,
      "mcCount": 107,
      "writtenCount": 0
    },
    {
      "id": "bio_genetics_logic",
      "zh": "遺傳推理",
      "en": "Genetics — reasoning",
      "framework": "遺傳邏輯",
      "frameworkEn": "Genetic Logic",
      "emoji": "🧬",
      "count": 85,
      "mcCount": 85,
      "writtenCount": 0
    },
    {
      "id": "bio_physio_chain",
      "zh": "生理機制・因果鏈",
      "en": "Physiology — causal chains",
      "framework": "系統調節",
      "frameworkEn": "System Regulation",
      "emoji": "❤️",
      "count": 92,
      "mcCount": 92,
      "writtenCount": 0
    },
    {
      "id": "bio_data_ecology",
      "zh": "數據與生態",
      "en": "Data & ecology",
      "framework": "能量流動",
      "frameworkEn": "Energy Flow",
      "emoji": "🌿",
      "count": 97,
      "mcCount": 97,
      "writtenCount": 0
    }
  ],
  "english": [
    {
      "id": "grammar",
      "zh": "Grammar",
      "en": "Grammar",
      "framework": "Usage",
      "frameworkEn": "Usage",
      "emoji": "✏️",
      "count": 91,
      "mcCount": 91,
      "writtenCount": 0
    },
    {
      "id": "tenses",
      "zh": "Tenses",
      "en": "Tenses",
      "framework": "Usage",
      "frameworkEn": "Usage",
      "emoji": "✏️",
      "count": 91,
      "mcCount": 91,
      "writtenCount": 0
    },
    {
      "id": "vocabulary",
      "zh": "Vocabulary",
      "en": "Vocabulary",
      "framework": "Vocab",
      "frameworkEn": "Vocab",
      "emoji": "📚",
      "count": 86,
      "mcCount": 86,
      "writtenCount": 0
    },
    {
      "id": "word_formation",
      "zh": "Word Formation",
      "en": "Word Formation",
      "framework": "Vocab",
      "frameworkEn": "Vocab",
      "emoji": "📚",
      "count": 90,
      "mcCount": 90,
      "writtenCount": 0
    },
    {
      "id": "reading",
      "zh": "Reading Comprehension",
      "en": "Reading Comprehension",
      "framework": "Reading",
      "frameworkEn": "Reading",
      "emoji": "📖",
      "count": 84,
      "mcCount": 84,
      "writtenCount": 0
    },
    {
      "id": "genre_tone",
      "zh": "Genre, Tone & Register",
      "en": "Genre, Tone & Register",
      "framework": "Writing",
      "frameworkEn": "Writing",
      "emoji": "✍️",
      "count": 85,
      "mcCount": 85,
      "writtenCount": 0
    },
    {
      "id": "integrated",
      "zh": "Integrated Skills",
      "en": "Integrated Skills",
      "framework": "Writing",
      "frameworkEn": "Writing",
      "emoji": "✍️",
      "count": 91,
      "mcCount": 91,
      "writtenCount": 0
    },
    {
      "id": "cloze",
      "zh": "Cloze & Usage",
      "en": "Cloze & Usage",
      "framework": "Reading",
      "frameworkEn": "Reading",
      "emoji": "📖",
      "count": 80,
      "mcCount": 80,
      "writtenCount": 0
    },
    {
      "id": "paper1_reading",
      "zh": "DSE Paper 1 Reading",
      "en": "DSE Paper 1 Reading",
      "framework": "Reading",
      "frameworkEn": "Reading",
      "emoji": "📖",
      "count": 87,
      "mcCount": 87,
      "writtenCount": 0
    },
    {
      "id": "p1_inference",
      "zh": "Reading · Inference & Implication",
      "en": "Reading · Inference & Implication",
      "framework": "Reading",
      "frameworkEn": "Reading",
      "emoji": "📖",
      "count": 82,
      "mcCount": 82,
      "writtenCount": 0
    },
    {
      "id": "p1_tone",
      "zh": "Reading · Tone & Attitude",
      "en": "Reading · Tone & Attitude",
      "framework": "Reading",
      "frameworkEn": "Reading",
      "emoji": "📖",
      "count": 82,
      "mcCount": 82,
      "writtenCount": 0
    },
    {
      "id": "p1_vocab_ref",
      "zh": "Reading · Vocabulary & Reference",
      "en": "Reading · Vocabulary & Reference",
      "framework": "Reading",
      "frameworkEn": "Reading",
      "emoji": "📖",
      "count": 88,
      "mcCount": 88,
      "writtenCount": 0
    }
  ],
  "chinese": [
    {
      "id": "fanwen_content",
      "zh": "指定範文・內容",
      "en": "Set Texts — Content",
      "framework": "指定文言範文",
      "frameworkEn": "Prescribed Classical Texts",
      "emoji": "📜",
      "count": 57,
      "mcCount": 54,
      "writtenCount": 3
    },
    {
      "id": "fanwen_diction",
      "zh": "指定範文・字詞",
      "en": "Set Texts — Diction",
      "framework": "指定文言範文",
      "frameworkEn": "Prescribed Classical Texts",
      "emoji": "📜",
      "count": 59,
      "mcCount": 55,
      "writtenCount": 4
    },
    {
      "id": "fanwen_lines",
      "zh": "指定範文・名句手法",
      "en": "Set Texts — Key Lines & Devices",
      "framework": "指定文言範文",
      "frameworkEn": "Prescribed Classical Texts",
      "emoji": "📜",
      "count": 69,
      "mcCount": 56,
      "writtenCount": 13
    },
    {
      "id": "classical",
      "zh": "課外文言閱讀",
      "en": "Unseen Classical Chinese",
      "framework": "文言閱讀",
      "frameworkEn": "Classical Chinese Reading",
      "emoji": "🏯",
      "count": 60,
      "mcCount": 60,
      "writtenCount": 0
    },
    {
      "id": "comprehension",
      "zh": "白話閱讀理解",
      "en": "Modern Chinese Comprehension",
      "framework": "閱讀理解",
      "frameworkEn": "Reading Comprehension",
      "emoji": "📖",
      "count": 62,
      "mcCount": 62,
      "writtenCount": 0
    },
    {
      "id": "rhetoric",
      "zh": "修辭手法",
      "en": "Rhetorical Devices",
      "framework": "語文運用",
      "frameworkEn": "Language Use",
      "emoji": "✍️",
      "count": 56,
      "mcCount": 56,
      "writtenCount": 0
    },
    {
      "id": "idioms_vocab",
      "zh": "成語與詞語",
      "en": "Idioms & Vocabulary",
      "framework": "語文運用",
      "frameworkEn": "Language Use",
      "emoji": "✍️",
      "count": 60,
      "mcCount": 60,
      "writtenCount": 0
    },
    {
      "id": "chars_errors",
      "zh": "字音字形與病句",
      "en": "Characters, Sounds & Sentence Errors",
      "framework": "語文運用",
      "frameworkEn": "Language Use",
      "emoji": "✍️",
      "count": 53,
      "mcCount": 53,
      "writtenCount": 0
    },
    {
      "id": "classical_lexis",
      "zh": "文言實詞・一詞多義",
      "en": "Classical Vocabulary — Multiple Meanings",
      "framework": "文言閱讀",
      "frameworkEn": "Classical Chinese Reading",
      "emoji": "🏯",
      "count": 58,
      "mcCount": 58,
      "writtenCount": 0
    },
    {
      "id": "paragraph_function",
      "zh": "段落結構與作用",
      "en": "Paragraph Structure & Function",
      "framework": "閱讀理解",
      "frameworkEn": "Reading Comprehension",
      "emoji": "📖",
      "count": 59,
      "mcCount": 59,
      "writtenCount": 0
    },
    {
      "id": "argument_essay",
      "zh": "論說文・思辨立意",
      "en": "Argumentative Writing — Thesis & Reasoning",
      "framework": "閱讀理解",
      "frameworkEn": "Reading Comprehension",
      "emoji": "📖",
      "count": 69,
      "mcCount": 57,
      "writtenCount": 12
    },
    {
      "id": "narrative_essay",
      "zh": "命題寫作・記敘抒情",
      "en": "Set-Topic Writing — Narrative & Reflective",
      "framework": "寫作能力",
      "frameworkEn": "Writing",
      "emoji": "🖋️",
      "count": 65,
      "mcCount": 55,
      "writtenCount": 10
    },
    {
      "id": "descriptive_essay",
      "zh": "命題寫作・描寫",
      "en": "Set-Topic Writing — Descriptive",
      "framework": "寫作能力",
      "frameworkEn": "Writing",
      "emoji": "🖋️",
      "count": 65,
      "mcCount": 55,
      "writtenCount": 10
    },
    {
      "id": "mixed_essay",
      "zh": "命題寫作・綜合",
      "en": "Set-Topic Writing — Mixed Modes",
      "framework": "寫作能力",
      "frameworkEn": "Writing",
      "emoji": "🖋️",
      "count": 65,
      "mcCount": 55,
      "writtenCount": 10
    },
    {
      "id": "practical_writing",
      "zh": "實用寫作",
      "en": "Practical Writing",
      "framework": "寫作能力",
      "frameworkEn": "Writing",
      "emoji": "🖋️",
      "count": 65,
      "mcCount": 55,
      "writtenCount": 10
    },
    {
      "id": "material_essay",
      "zh": "材料作文・立意與引申",
      "en": "Material-based Composition",
      "framework": "寫作能力",
      "frameworkEn": "Writing",
      "emoji": "🖋️",
      "count": 0,
      "mcCount": 0,
      "writtenCount": 0
    },
    {
      "id": "classical_moral_infer",
      "zh": "課外文言・寓意推論",
      "en": "Unseen Classical — Inferring the Moral",
      "framework": "文言閱讀",
      "frameworkEn": "Classical Chinese Reading",
      "emoji": "🏯",
      "count": 59,
      "mcCount": 59,
      "writtenCount": 0
    },
    {
      "id": "classical_passage_read",
      "zh": "課外文言・篇章精讀",
      "en": "Unseen Classical — Close Reading",
      "framework": "文言閱讀",
      "frameworkEn": "Classical Chinese Reading",
      "emoji": "🏯",
      "count": 59,
      "mcCount": 59,
      "writtenCount": 0
    },
    {
      "id": "classical_compare",
      "zh": "課外文言・比較閱讀",
      "en": "Unseen Classical — Comparative Reading",
      "framework": "文言閱讀",
      "frameworkEn": "Classical Chinese Reading",
      "emoji": "🏯",
      "count": 52,
      "mcCount": 52,
      "writtenCount": 0
    }
  ],
  "bafs": [
    {
      "id": "business_env",
      "zh": "商業環境",
      "en": "Business Environment",
      "framework": "概念理解",
      "frameworkEn": "Concepts",
      "emoji": "📘",
      "count": 24,
      "mcCount": 24,
      "writtenCount": 0
    },
    {
      "id": "management",
      "zh": "管理",
      "en": "Management",
      "framework": "概念理解",
      "frameworkEn": "Concepts",
      "emoji": "📘",
      "count": 25,
      "mcCount": 25,
      "writtenCount": 0
    },
    {
      "id": "accounting",
      "zh": "會計",
      "en": "Accounting",
      "framework": "計算分析",
      "frameworkEn": "Quantitative Analysis",
      "emoji": "🧮",
      "count": 86,
      "mcCount": 86,
      "writtenCount": 0
    },
    {
      "id": "financial_mgmt",
      "zh": "財務管理",
      "en": "Financial Management",
      "framework": "計算分析",
      "frameworkEn": "Quantitative Analysis",
      "emoji": "🧮",
      "count": 84,
      "mcCount": 84,
      "writtenCount": 0
    },
    {
      "id": "personal_finance",
      "zh": "個人理財",
      "en": "Personal Finance",
      "framework": "概念理解",
      "frameworkEn": "Concepts",
      "emoji": "📘",
      "count": 119,
      "mcCount": 119,
      "writtenCount": 0
    },
    {
      "id": "bafs_ratio_analysis",
      "zh": "比率分析（高階）",
      "en": "Ratio analysis",
      "framework": "計算分析",
      "frameworkEn": "Quantitative Analysis",
      "emoji": "🧮",
      "count": 83,
      "mcCount": 83,
      "writtenCount": 0
    },
    {
      "id": "bafs_costing_pricing",
      "zh": "成本・定價・回本",
      "en": "Costing, pricing & payback",
      "framework": "計算分析",
      "frameworkEn": "Quantitative Analysis",
      "emoji": "🧮",
      "count": 79,
      "mcCount": 79,
      "writtenCount": 0
    },
    {
      "id": "bafs_depreciation",
      "zh": "折舊計算",
      "en": "Depreciation",
      "framework": "計算分析",
      "frameworkEn": "Quantitative Analysis",
      "emoji": "🧮",
      "count": 95,
      "mcCount": 95,
      "writtenCount": 0
    },
    {
      "id": "financial_statements",
      "zh": "財務報表",
      "en": "Financial Statements",
      "framework": "會計",
      "frameworkEn": "Accounting",
      "emoji": "📒",
      "count": 98,
      "mcCount": 98,
      "writtenCount": 0
    },
    {
      "id": "ratios",
      "zh": "財務比率",
      "en": "Financial Ratios",
      "framework": "會計",
      "frameworkEn": "Accounting",
      "emoji": "📒",
      "count": 80,
      "mcCount": 80,
      "writtenCount": 0
    },
    {
      "id": "depreciation",
      "zh": "折舊",
      "en": "Depreciation",
      "framework": "會計",
      "frameworkEn": "Accounting",
      "emoji": "📒",
      "count": 85,
      "mcCount": 85,
      "writtenCount": 0
    },
    {
      "id": "interest",
      "zh": "利息",
      "en": "Interest",
      "framework": "財務",
      "frameworkEn": "Finance",
      "emoji": "💰",
      "count": 88,
      "mcCount": 88,
      "writtenCount": 0
    },
    {
      "id": "costing",
      "zh": "成本與定價",
      "en": "Costing & Pricing",
      "framework": "財務",
      "frameworkEn": "Finance",
      "emoji": "💰",
      "count": 72,
      "mcCount": 72,
      "writtenCount": 0
    }
  ],
  "ict": [
    {
      "id": "data_representation",
      "zh": "資料表示與處理",
      "en": "Data Representation & Processing",
      "framework": "邏輯推理",
      "frameworkEn": "Logical Reasoning",
      "emoji": "🧠",
      "count": 99,
      "mcCount": 99,
      "writtenCount": 0
    },
    {
      "id": "computer_systems",
      "zh": "電腦系統與硬件",
      "en": "Computer Systems & Hardware",
      "framework": "概念理解",
      "frameworkEn": "Concepts",
      "emoji": "📘",
      "count": 103,
      "mcCount": 103,
      "writtenCount": 0
    },
    {
      "id": "networking",
      "zh": "網絡與互聯網",
      "en": "Networking & the Internet",
      "framework": "概念理解",
      "frameworkEn": "Concepts",
      "emoji": "📘",
      "count": 101,
      "mcCount": 101,
      "writtenCount": 0
    },
    {
      "id": "programming",
      "zh": "程式編寫與算法",
      "en": "Programming & Algorithms",
      "framework": "邏輯推理",
      "frameworkEn": "Logical Reasoning",
      "emoji": "🧠",
      "count": 101,
      "mcCount": 101,
      "writtenCount": 0
    },
    {
      "id": "databases",
      "zh": "資料庫",
      "en": "Databases",
      "framework": "概念理解",
      "frameworkEn": "Concepts",
      "emoji": "📘",
      "count": 102,
      "mcCount": 102,
      "writtenCount": 0
    },
    {
      "id": "security_ethics",
      "zh": "資訊保安與道德",
      "en": "Security & Ethics",
      "framework": "概念理解",
      "frameworkEn": "Concepts",
      "emoji": "📘",
      "count": 98,
      "mcCount": 98,
      "writtenCount": 0
    },
    {
      "id": "multimedia_web",
      "zh": "多媒體與網絡技術",
      "en": "Multimedia & Web",
      "framework": "概念理解",
      "frameworkEn": "Concepts",
      "emoji": "📘",
      "count": 101,
      "mcCount": 101,
      "writtenCount": 0
    },
    {
      "id": "ict_data_rep_calc",
      "zh": "資料表示計算",
      "en": "Data representation — calculation",
      "framework": "應用分析",
      "frameworkEn": "Application",
      "emoji": "🛠️",
      "count": 97,
      "mcCount": 97,
      "writtenCount": 0
    },
    {
      "id": "ict_logic_algo",
      "zh": "邏輯與算法",
      "en": "Logic & algorithms",
      "framework": "邏輯推理",
      "frameworkEn": "Logical Reasoning",
      "emoji": "🧠",
      "count": 103,
      "mcCount": 103,
      "writtenCount": 0
    },
    {
      "id": "ict_network_calc",
      "zh": "網絡計算",
      "en": "Networking — calculation",
      "framework": "應用分析",
      "frameworkEn": "Application",
      "emoji": "🛠️",
      "count": 96,
      "mcCount": 96,
      "writtenCount": 0
    }
  ],
  "economics": [
    {
      "id": "basic_concepts",
      "zh": "基礎概念",
      "en": "Basic Concepts",
      "framework": "稀缺與選擇",
      "frameworkEn": "Scarcity & Choice",
      "emoji": "💡",
      "count": 54,
      "mcCount": 54,
      "writtenCount": 0
    },
    {
      "id": "ppf",
      "zh": "生產可能線（PPF）",
      "en": "Production Possibility Frontier",
      "framework": "稀缺與選擇",
      "frameworkEn": "Scarcity & Choice",
      "emoji": "💡",
      "count": 55,
      "mcCount": 55,
      "writtenCount": 0
    },
    {
      "id": "demand_supply",
      "zh": "需求與供應",
      "en": "Demand & Supply",
      "framework": "市場機制",
      "frameworkEn": "Market Mechanism",
      "emoji": "📈",
      "count": 77,
      "mcCount": 77,
      "writtenCount": 0
    },
    {
      "id": "elasticity",
      "zh": "彈性",
      "en": "Elasticity",
      "framework": "市場機制",
      "frameworkEn": "Market Mechanism",
      "emoji": "📈",
      "count": 86,
      "mcCount": 86,
      "writtenCount": 0
    },
    {
      "id": "firm_production",
      "zh": "廠商與生產",
      "en": "Firms & Production",
      "framework": "生產理論",
      "frameworkEn": "Production Theory",
      "emoji": "🏭",
      "count": 98,
      "mcCount": 98,
      "writtenCount": 0
    },
    {
      "id": "market_structure",
      "zh": "市場結構",
      "en": "Market Structure",
      "framework": "市場機制",
      "frameworkEn": "Market Mechanism",
      "emoji": "📈",
      "count": 79,
      "mcCount": 79,
      "writtenCount": 0
    },
    {
      "id": "market_failure",
      "zh": "市場失靈",
      "en": "Market Failure",
      "framework": "效率與干預",
      "frameworkEn": "Efficiency & Intervention",
      "emoji": "⚖️",
      "count": 71,
      "mcCount": 71,
      "writtenCount": 0
    },
    {
      "id": "macroeconomics",
      "zh": "宏觀經濟",
      "en": "Macroeconomics",
      "framework": "市場機制",
      "frameworkEn": "Market Mechanism",
      "emoji": "📈",
      "count": 100,
      "mcCount": 100,
      "writtenCount": 0
    },
    {
      "id": "trade",
      "zh": "國際貿易",
      "en": "International Trade",
      "framework": "國際經濟",
      "frameworkEn": "International Economics",
      "emoji": "🌐",
      "count": 85,
      "mcCount": 85,
      "writtenCount": 0
    },
    {
      "id": "econ_micro_calc",
      "zh": "微觀計算（高階）",
      "en": "Microeconomics — calculation",
      "framework": "市場機制",
      "frameworkEn": "Market Mechanism",
      "emoji": "📈",
      "count": 73,
      "mcCount": 73,
      "writtenCount": 0
    },
    {
      "id": "econ_macro_calc",
      "zh": "宏觀計算（高階）",
      "en": "Macroeconomics — calculation",
      "framework": "宏觀分析",
      "frameworkEn": "Macro analysis",
      "emoji": "🏦",
      "count": 102,
      "mcCount": 102,
      "writtenCount": 0
    },
    {
      "id": "econ_trade_failure",
      "zh": "貿易與市場失靈",
      "en": "Trade & market failure",
      "framework": "國際經濟",
      "frameworkEn": "International Economics",
      "emoji": "🌐",
      "count": 71,
      "mcCount": 71,
      "writtenCount": 0
    },
    {
      "id": "market",
      "zh": "市場效率",
      "en": "Market Efficiency",
      "framework": "量化分析",
      "frameworkEn": "Quantitative Analysis",
      "emoji": "📊",
      "count": 60,
      "mcCount": 60,
      "writtenCount": 0
    }
  ],
  "csd": [
    {
      "id": "hk_constitution",
      "zh": "「一國兩制」與憲制秩序",
      "en": "OCTS & Constitutional Order",
      "framework": "概念理解",
      "frameworkEn": "Concepts",
      "emoji": "📘",
      "count": 92,
      "mcCount": 92,
      "writtenCount": 0
    },
    {
      "id": "hk_rule_of_law",
      "zh": "法治、權利與責任",
      "en": "Rule of Law, Rights & Duties",
      "framework": "概念理解",
      "frameworkEn": "Concepts",
      "emoji": "📘",
      "count": 105,
      "mcCount": 105,
      "writtenCount": 0
    },
    {
      "id": "hk_society",
      "zh": "香港社會與參與",
      "en": "Hong Kong Society & Participation",
      "framework": "議題分析",
      "frameworkEn": "Issue Analysis",
      "emoji": "🔗",
      "count": 91,
      "mcCount": 91,
      "writtenCount": 0
    },
    {
      "id": "china_reform",
      "zh": "改革開放與國家發展",
      "en": "Reform & National Development",
      "framework": "概念理解",
      "frameworkEn": "Concepts",
      "emoji": "📘",
      "count": 94,
      "mcCount": 94,
      "writtenCount": 0
    },
    {
      "id": "china_tech_power",
      "zh": "科技創新與綜合國力",
      "en": "Innovation & National Strength",
      "framework": "概念理解",
      "frameworkEn": "Concepts",
      "emoji": "📘",
      "count": 93,
      "mcCount": 93,
      "writtenCount": 0
    },
    {
      "id": "globalization",
      "zh": "經濟全球化",
      "en": "Economic Globalisation",
      "framework": "概念理解",
      "frameworkEn": "Concepts",
      "emoji": "📘",
      "count": 92,
      "mcCount": 92,
      "writtenCount": 0
    },
    {
      "id": "interdependence",
      "zh": "互聯相依的世界",
      "en": "An Interdependent World",
      "framework": "議題分析",
      "frameworkEn": "Issue Analysis",
      "emoji": "🔗",
      "count": 99,
      "mcCount": 99,
      "writtenCount": 0
    },
    {
      "id": "sustainability",
      "zh": "可持續發展與公共衞生",
      "en": "Sustainability & Public Health",
      "framework": "概念理解",
      "frameworkEn": "Concepts",
      "emoji": "📘",
      "count": 91,
      "mcCount": 91,
      "writtenCount": 0
    },
    {
      "id": "csd_data_response",
      "zh": "資料回應・數據詮釋",
      "en": "Data-response · interpreting data",
      "framework": "資料回應",
      "frameworkEn": "Data-response",
      "emoji": "📊",
      "count": 82,
      "mcCount": 82,
      "writtenCount": 0
    },
    {
      "id": "csd_stakeholder_eval",
      "zh": "多角度評鑑・持份者權衡",
      "en": "Multi-perspective · stakeholders",
      "framework": "多角度評鑑",
      "frameworkEn": "Evaluation",
      "emoji": "⚖️",
      "count": 82,
      "mcCount": 82,
      "writtenCount": 0
    },
    {
      "id": "csd_concept_apply",
      "zh": "概念應用・當代世界",
      "en": "Applying concepts · the contemporary world",
      "framework": "議題分析",
      "frameworkEn": "Issue analysis",
      "emoji": "🔗",
      "count": 82,
      "mcCount": 82,
      "writtenCount": 0
    }
  ],
  "chinese-history": [
    {
      "id": "preqin_polity",
      "zh": "先秦政治",
      "en": "Pre-Qin Statecraft",
      "framework": "古代史",
      "frameworkEn": "Ancient History",
      "emoji": "🏛️",
      "count": 112,
      "mcCount": 112,
      "writtenCount": 0
    },
    {
      "id": "qinhan_tang",
      "zh": "秦漢至隋唐制度",
      "en": "Institutions: Qin–Han to Sui–Tang",
      "framework": "古代史",
      "frameworkEn": "Ancient History",
      "emoji": "🏛️",
      "count": 112,
      "mcCount": 112,
      "writtenCount": 0
    },
    {
      "id": "song_qing",
      "zh": "宋元明清",
      "en": "Song, Yuan, Ming & Qing",
      "framework": "古代史",
      "frameworkEn": "Ancient History",
      "emoji": "🏛️",
      "count": 112,
      "mcCount": 112,
      "writtenCount": 0
    },
    {
      "id": "late_qing",
      "zh": "晚清變局",
      "en": "Upheaval in the Late Qing",
      "framework": "近代史",
      "frameworkEn": "Modern History",
      "emoji": "⚔️",
      "count": 112,
      "mcCount": 112,
      "writtenCount": 0
    },
    {
      "id": "revolution",
      "zh": "辛亥革命",
      "en": "The 1911 Revolution",
      "framework": "近代史",
      "frameworkEn": "Modern History",
      "emoji": "⚔️",
      "count": 112,
      "mcCount": 112,
      "writtenCount": 0
    },
    {
      "id": "republic",
      "zh": "民國發展",
      "en": "The Republican Era",
      "framework": "近代史",
      "frameworkEn": "Modern History",
      "emoji": "⚔️",
      "count": 112,
      "mcCount": 112,
      "writtenCount": 0
    },
    {
      "id": "prc",
      "zh": "中共建國至改革",
      "en": "The PRC: Founding to Reform",
      "framework": "現代史",
      "frameworkEn": "Contemporary History",
      "emoji": "🚩",
      "count": 87,
      "mcCount": 87,
      "writtenCount": 0
    },
    {
      "id": "hk_taiwan",
      "zh": "香港與兩岸",
      "en": "Hong Kong and Cross-Strait Relations",
      "framework": "現代史",
      "frameworkEn": "Contemporary History",
      "emoji": "🚩",
      "count": 111,
      "mcCount": 111,
      "writtenCount": 0
    },
    {
      "id": "chist_ancient_institution",
      "zh": "古代制度・因果",
      "en": "Ancient Institutions — Cause & Effect",
      "framework": "古代史",
      "frameworkEn": "Ancient History",
      "emoji": "🏛️",
      "count": 102,
      "mcCount": 102,
      "writtenCount": 0
    },
    {
      "id": "chist_modern_causation",
      "zh": "近現代變局・評價",
      "en": "Modern Upheavals — Evaluation",
      "framework": "近代史",
      "frameworkEn": "Modern History",
      "emoji": "⚔️",
      "count": 102,
      "mcCount": 102,
      "writtenCount": 0
    }
  ],
  "history": [
    {
      "id": "ww1",
      "zh": "第一次世界大戰",
      "en": "The First World War",
      "framework": "因果分析",
      "frameworkEn": "Causation",
      "emoji": "🔗",
      "count": 77,
      "mcCount": 75,
      "writtenCount": 2
    },
    {
      "id": "ww2",
      "zh": "第二次世界大戰",
      "en": "The Second World War",
      "framework": "因果分析",
      "frameworkEn": "Causation",
      "emoji": "🔗",
      "count": 88,
      "mcCount": 83,
      "writtenCount": 5
    },
    {
      "id": "cold_war",
      "zh": "冷戰",
      "en": "The Cold War",
      "framework": "因果分析",
      "frameworkEn": "Causation",
      "emoji": "🔗",
      "count": 71,
      "mcCount": 68,
      "writtenCount": 3
    },
    {
      "id": "dictatorship",
      "zh": "極權主義興起",
      "en": "Rise of Dictatorships",
      "framework": "因果分析",
      "frameworkEn": "Causation",
      "emoji": "🔗",
      "count": 68,
      "mcCount": 68,
      "writtenCount": 0
    },
    {
      "id": "intl_coop",
      "zh": "國際合作",
      "en": "International Cooperation",
      "framework": "評價影響",
      "frameworkEn": "Significance & Evaluation",
      "emoji": "⚖️",
      "count": 83,
      "mcCount": 77,
      "writtenCount": 6
    },
    {
      "id": "china_mod",
      "zh": "中國現代化",
      "en": "Modernisation of China",
      "framework": "因果分析",
      "frameworkEn": "Causation",
      "emoji": "🔗",
      "count": 74,
      "mcCount": 68,
      "writtenCount": 6
    },
    {
      "id": "japan_mod",
      "zh": "日本現代化",
      "en": "Modernisation of Japan",
      "framework": "因果分析",
      "frameworkEn": "Causation",
      "emoji": "🔗",
      "count": 78,
      "mcCount": 73,
      "writtenCount": 5
    },
    {
      "id": "hk_seasia",
      "zh": "香港與東南亞",
      "en": "Hong Kong & Southeast Asia",
      "framework": "評價影響",
      "frameworkEn": "Significance & Evaluation",
      "emoji": "⚖️",
      "count": 66,
      "mcCount": 66,
      "writtenCount": 0
    },
    {
      "id": "hk_mod",
      "zh": "香港的現代化與蛻變",
      "en": "Modernisation and Transformation of Hong Kong",
      "framework": "評價影響",
      "frameworkEn": "Significance & Evaluation",
      "emoji": "⚖️",
      "count": 86,
      "mcCount": 82,
      "writtenCount": 4
    },
    {
      "id": "seasia",
      "zh": "東南亞：由殖民地到獨立國家",
      "en": "Southeast Asia: From Colonies to Independent Countries",
      "framework": "因果分析",
      "frameworkEn": "Causation",
      "emoji": "🔗",
      "count": 87,
      "mcCount": 83,
      "writtenCount": 4
    },
    {
      "id": "postwar_conflicts",
      "zh": "戰後衝突與聯合國",
      "en": "Post-war Conflicts and the United Nations",
      "framework": "評價影響",
      "frameworkEn": "Significance & Evaluation",
      "emoji": "⚖️",
      "count": 76,
      "mcCount": 73,
      "writtenCount": 3
    },
    {
      "id": "hist_causation",
      "zh": "因果分析・導火線與根源",
      "en": "Causation — trigger vs root cause",
      "framework": "因果分析",
      "frameworkEn": "Causation",
      "emoji": "🔗",
      "count": 82,
      "mcCount": 82,
      "writtenCount": 0
    },
    {
      "id": "hist_significance",
      "zh": "影響與意義評價",
      "en": "Significance & evaluation",
      "framework": "評價影響",
      "frameworkEn": "Significance & Evaluation",
      "emoji": "⚖️",
      "count": 74,
      "mcCount": 74,
      "writtenCount": 0
    },
    {
      "id": "hist_source",
      "zh": "史料判讀",
      "en": "Source analysis",
      "framework": "史料判讀",
      "frameworkEn": "Source Analysis",
      "emoji": "🔍",
      "count": 79,
      "mcCount": 79,
      "writtenCount": 0
    }
  ],
  "geography": [
    {
      "id": "plate_hazards",
      "zh": "板塊與自然災害",
      "en": "Plates & Natural Hazards",
      "framework": "地理過程",
      "frameworkEn": "Geographical Processes",
      "emoji": "🌍",
      "count": 103,
      "mcCount": 103,
      "writtenCount": 0
    },
    {
      "id": "rivers_coasts",
      "zh": "河流與海岸環境",
      "en": "River & Coastal Environments",
      "framework": "地理過程",
      "frameworkEn": "Geographical Processes",
      "emoji": "🌍",
      "count": 111,
      "mcCount": 111,
      "writtenCount": 0
    },
    {
      "id": "weather_climate",
      "zh": "天氣與氣候",
      "en": "Weather & Climate",
      "framework": "地理過程",
      "frameworkEn": "Geographical Processes",
      "emoji": "🌍",
      "count": 99,
      "mcCount": 99,
      "writtenCount": 0
    },
    {
      "id": "urban",
      "zh": "城市發展",
      "en": "Urban Development",
      "framework": "地理過程",
      "frameworkEn": "Geographical Processes",
      "emoji": "🌍",
      "count": 97,
      "mcCount": 97,
      "writtenCount": 0
    },
    {
      "id": "industry",
      "zh": "工業區位",
      "en": "Industrial Location",
      "framework": "成因分析",
      "frameworkEn": "Causal Analysis",
      "emoji": "🔗",
      "count": 97,
      "mcCount": 97,
      "writtenCount": 0
    },
    {
      "id": "food",
      "zh": "糧食與飢荒",
      "en": "Food & Famine",
      "framework": "成因分析",
      "frameworkEn": "Causal Analysis",
      "emoji": "🔗",
      "count": 110,
      "mcCount": 110,
      "writtenCount": 0
    },
    {
      "id": "rainforest",
      "zh": "熱帶雨林",
      "en": "Tropical Rainforest",
      "framework": "地理過程",
      "frameworkEn": "Geographical Processes",
      "emoji": "🌍",
      "count": 93,
      "mcCount": 93,
      "writtenCount": 0
    },
    {
      "id": "climate_change",
      "zh": "氣候變化與環境管理",
      "en": "Climate Change & Management",
      "framework": "管理與評鑑",
      "frameworkEn": "Management & Evaluation",
      "emoji": "⚖️",
      "count": 101,
      "mcCount": 101,
      "writtenCount": 0
    },
    {
      "id": "geo_process_chain",
      "zh": "地理過程・因果鏈",
      "en": "Geographical process chains",
      "framework": "地理過程",
      "frameworkEn": "Geographical Processes",
      "emoji": "🌍",
      "count": 98,
      "mcCount": 98,
      "writtenCount": 0
    },
    {
      "id": "geo_data_manage",
      "zh": "數據與環境管理",
      "en": "Data & environmental management",
      "framework": "成因分析",
      "frameworkEn": "Causal Analysis",
      "emoji": "🔗",
      "count": 94,
      "mcCount": 94,
      "writtenCount": 0
    }
  ],
  "chinese-literature": [
    {
      "id": "pre_qin_han",
      "zh": "先秦兩漢文學",
      "en": "Pre-Qin and Han Literature",
      "framework": "古典文學",
      "frameworkEn": "Classical Literature",
      "emoji": "📜",
      "count": 104,
      "mcCount": 104,
      "writtenCount": 0
    },
    {
      "id": "tang_poetry",
      "zh": "唐詩",
      "en": "Tang Poetry",
      "framework": "詩詞曲",
      "frameworkEn": "Poetry, Ci and Qu",
      "emoji": "🎴",
      "count": 104,
      "mcCount": 104,
      "writtenCount": 0
    },
    {
      "id": "song_ci",
      "zh": "宋詞",
      "en": "Song Ci Lyrics",
      "framework": "詩詞曲",
      "frameworkEn": "Poetry, Ci and Qu",
      "emoji": "🎴",
      "count": 104,
      "mcCount": 104,
      "writtenCount": 0
    },
    {
      "id": "yuan_drama",
      "zh": "元曲戲劇",
      "en": "Yuan Qu and Drama",
      "framework": "古典文學",
      "frameworkEn": "Classical Literature",
      "emoji": "📜",
      "count": 104,
      "mcCount": 104,
      "writtenCount": 0
    },
    {
      "id": "ming_qing",
      "zh": "明清小說",
      "en": "Ming and Qing Fiction",
      "framework": "古典文學",
      "frameworkEn": "Classical Literature",
      "emoji": "📜",
      "count": 104,
      "mcCount": 104,
      "writtenCount": 0
    },
    {
      "id": "genres",
      "zh": "文學體裁",
      "en": "Literary Genres",
      "framework": "文學鑑賞",
      "frameworkEn": "Literary Appreciation",
      "emoji": "🖌️",
      "count": 110,
      "mcCount": 110,
      "writtenCount": 0
    },
    {
      "id": "techniques",
      "zh": "寫作手法",
      "en": "Writing Techniques",
      "framework": "文學鑑賞",
      "frameworkEn": "Literary Appreciation",
      "emoji": "🖌️",
      "count": 110,
      "mcCount": 110,
      "writtenCount": 0
    },
    {
      "id": "appreciation",
      "zh": "文學鑑賞",
      "en": "Literary Appreciation",
      "framework": "文學鑑賞",
      "frameworkEn": "Literary Appreciation",
      "emoji": "🖌️",
      "count": 108,
      "mcCount": 108,
      "writtenCount": 0
    },
    {
      "id": "clit_poetry_appreciation",
      "zh": "詩詞鑑賞・手法與意境",
      "en": "Poetry Appreciation — Devices & Imagery",
      "framework": "詩詞曲",
      "frameworkEn": "Poetry, Ci and Qu",
      "emoji": "🎴",
      "count": 100,
      "mcCount": 100,
      "writtenCount": 0
    },
    {
      "id": "clit_craft_compare",
      "zh": "風格比較・婉約與豪放",
      "en": "Comparing Styles — Wanyue and Haofang",
      "framework": "文學鑑賞",
      "frameworkEn": "Literary Appreciation",
      "emoji": "🖌️",
      "count": 94,
      "mcCount": 94,
      "writtenCount": 0
    }
  ],
  "english-literature": [
    {
      "id": "poetry",
      "zh": "Poetry",
      "en": "Poetry",
      "framework": "Genre & Form",
      "frameworkEn": "Genre & Form",
      "emoji": "📖",
      "count": 104,
      "mcCount": 104,
      "writtenCount": 0
    },
    {
      "id": "drama",
      "zh": "Drama",
      "en": "Drama",
      "framework": "Genre & Form",
      "frameworkEn": "Genre & Form",
      "emoji": "📖",
      "count": 104,
      "mcCount": 104,
      "writtenCount": 0
    },
    {
      "id": "prose_fiction",
      "zh": "Prose Fiction",
      "en": "Prose Fiction",
      "framework": "Genre & Form",
      "frameworkEn": "Genre & Form",
      "emoji": "📖",
      "count": 104,
      "mcCount": 104,
      "writtenCount": 0
    },
    {
      "id": "devices",
      "zh": "Literary Devices",
      "en": "Literary Devices",
      "framework": "Craft",
      "frameworkEn": "Craft",
      "emoji": "🖋️",
      "count": 108,
      "mcCount": 108,
      "writtenCount": 0
    },
    {
      "id": "characterisation",
      "zh": "Characterisation",
      "en": "Characterisation",
      "framework": "Analysis",
      "frameworkEn": "Analysis",
      "emoji": "🔍",
      "count": 104,
      "mcCount": 104,
      "writtenCount": 0
    },
    {
      "id": "themes",
      "zh": "Themes",
      "en": "Themes",
      "framework": "Analysis",
      "frameworkEn": "Analysis",
      "emoji": "🔍",
      "count": 104,
      "mcCount": 104,
      "writtenCount": 0
    },
    {
      "id": "shakespeare",
      "zh": "Shakespeare",
      "en": "Shakespeare",
      "framework": "Analysis",
      "frameworkEn": "Analysis",
      "emoji": "🔍",
      "count": 104,
      "mcCount": 104,
      "writtenCount": 0
    },
    {
      "id": "criticism",
      "zh": "Criticism",
      "en": "Criticism",
      "framework": "Analysis",
      "frameworkEn": "Analysis",
      "emoji": "🔍",
      "count": 102,
      "mcCount": 102,
      "writtenCount": 0
    },
    {
      "id": "elit_device_effect",
      "zh": "Device & effect",
      "en": "Device & effect",
      "framework": "Craft",
      "frameworkEn": "Craft",
      "emoji": "🖋️",
      "count": 98,
      "mcCount": 98,
      "writtenCount": 0
    },
    {
      "id": "elit_theme_irony",
      "zh": "Theme & irony",
      "en": "Theme & irony",
      "framework": "Analysis",
      "frameworkEn": "Analysis",
      "emoji": "🔍",
      "count": 94,
      "mcCount": 94,
      "writtenCount": 0
    }
  ],
  "ethics-religious": [
    {
      "id": "ethical_theories",
      "zh": "規範倫理學",
      "en": "Normative Ethics",
      "framework": "規範倫理",
      "frameworkEn": "Normative Ethics",
      "emoji": "⚖️",
      "count": 114,
      "mcCount": 114,
      "writtenCount": 0
    },
    {
      "id": "applied_ethics",
      "zh": "應用倫理",
      "en": "Applied Ethics",
      "framework": "應用倫理",
      "frameworkEn": "Applied Ethics",
      "emoji": "🧬",
      "count": 103,
      "mcCount": 103,
      "writtenCount": 0
    },
    {
      "id": "moral_concepts",
      "zh": "道德概念",
      "en": "Moral Concepts",
      "framework": "道德反思",
      "frameworkEn": "Moral Reflection",
      "emoji": "🧭",
      "count": 107,
      "mcCount": 107,
      "writtenCount": 0
    },
    {
      "id": "christianity",
      "zh": "基督宗教",
      "en": "Christianity",
      "framework": "宗教傳統",
      "frameworkEn": "Religious Tradition",
      "emoji": "🕊️",
      "count": 109,
      "mcCount": 109,
      "writtenCount": 0
    },
    {
      "id": "buddhism",
      "zh": "佛教",
      "en": "Buddhism",
      "framework": "宗教傳統",
      "frameworkEn": "Religious Tradition",
      "emoji": "🕊️",
      "count": 109,
      "mcCount": 109,
      "writtenCount": 0
    },
    {
      "id": "religion_philosophy",
      "zh": "宗教哲學",
      "en": "Philosophy of Religion",
      "framework": "宗教哲學",
      "frameworkEn": "Philosophy of Religion",
      "emoji": "🤔",
      "count": 108,
      "mcCount": 108,
      "writtenCount": 0
    },
    {
      "id": "religion_ethics",
      "zh": "宗教倫理",
      "en": "Religious Ethics",
      "framework": "宗教傳統",
      "frameworkEn": "Religious Tradition",
      "emoji": "🕊️",
      "count": 109,
      "mcCount": 109,
      "writtenCount": 0
    },
    {
      "id": "religion_society",
      "zh": "宗教與社會",
      "en": "Religion & Society",
      "framework": "宗教社會",
      "frameworkEn": "Religion & Society",
      "emoji": "🌍",
      "count": 108,
      "mcCount": 108,
      "writtenCount": 0
    },
    {
      "id": "eth_theory_apply",
      "zh": "規範倫理・理論應用",
      "en": "Normative theory — application",
      "framework": "規範倫理",
      "frameworkEn": "Normative Ethics",
      "emoji": "⚖️",
      "count": 106,
      "mcCount": 106,
      "writtenCount": 0
    },
    {
      "id": "eth_meta_reason",
      "zh": "道德推理・後設反思",
      "en": "Moral reasoning — reflection",
      "framework": "道德反思",
      "frameworkEn": "Moral Reflection",
      "emoji": "🧭",
      "count": 101,
      "mcCount": 101,
      "writtenCount": 0
    }
  ],
  "ths": [
    {
      "id": "intro",
      "zh": "旅遊與款待業概論",
      "en": "Intro to Tourism & Hospitality",
      "framework": "概念理解",
      "frameworkEn": "Concepts",
      "emoji": "📘",
      "count": 91,
      "mcCount": 91,
      "writtenCount": 0
    },
    {
      "id": "service",
      "zh": "優質顧客服務",
      "en": "Quality Customer Service",
      "framework": "服務技巧",
      "frameworkEn": "Service Skills",
      "emoji": "🤝",
      "count": 112,
      "mcCount": 112,
      "writtenCount": 0
    },
    {
      "id": "destinations",
      "zh": "旅遊目的地",
      "en": "Destinations",
      "framework": "概念理解",
      "frameworkEn": "Concepts",
      "emoji": "📘",
      "count": 100,
      "mcCount": 100,
      "writtenCount": 0
    },
    {
      "id": "accommodation",
      "zh": "住宿營運",
      "en": "Accommodation Operations",
      "framework": "概念理解",
      "frameworkEn": "Concepts",
      "emoji": "📘",
      "count": 107,
      "mcCount": 107,
      "writtenCount": 0
    },
    {
      "id": "food_beverage",
      "zh": "餐飲服務",
      "en": "Food & Beverage",
      "framework": "概念理解",
      "frameworkEn": "Concepts",
      "emoji": "📘",
      "count": 95,
      "mcCount": 95,
      "writtenCount": 0
    },
    {
      "id": "travel_trade",
      "zh": "旅行社與會展",
      "en": "Travel Trade & MICE",
      "framework": "概念理解",
      "frameworkEn": "Concepts",
      "emoji": "📘",
      "count": 95,
      "mcCount": 95,
      "writtenCount": 0
    },
    {
      "id": "sustainable",
      "zh": "可持續旅遊",
      "en": "Sustainable Tourism",
      "framework": "分析評鑑",
      "frameworkEn": "Analysis",
      "emoji": "🔗",
      "count": 114,
      "mcCount": 114,
      "writtenCount": 0
    },
    {
      "id": "impacts",
      "zh": "旅遊影響",
      "en": "Impacts of Tourism",
      "framework": "分析評鑑",
      "frameworkEn": "Analysis",
      "emoji": "🔗",
      "count": 103,
      "mcCount": 103,
      "writtenCount": 0
    },
    {
      "id": "ths_hotel_metrics",
      "zh": "酒店營運計算",
      "en": "Hotel operations — metrics",
      "framework": "分析評鑑",
      "frameworkEn": "Analysis",
      "emoji": "🔗",
      "count": 83,
      "mcCount": 83,
      "writtenCount": 0
    },
    {
      "id": "ths_concept_analysis",
      "zh": "概念分析・服務與可持續",
      "en": "Concepts — service & sustainability",
      "framework": "概念理解",
      "frameworkEn": "Concepts",
      "emoji": "📘",
      "count": 108,
      "mcCount": 108,
      "writtenCount": 0
    }
  ],
  "health-management": [
    {
      "id": "health_concept",
      "zh": "健康概念",
      "en": "Concepts of Health",
      "framework": "概念理解",
      "frameworkEn": "Concepts",
      "emoji": "📘",
      "count": 87,
      "mcCount": 87,
      "writtenCount": 0
    },
    {
      "id": "lifespan",
      "zh": "人生發展",
      "en": "Human Development",
      "framework": "概念理解",
      "frameworkEn": "Concepts",
      "emoji": "📘",
      "count": 91,
      "mcCount": 91,
      "writtenCount": 0
    },
    {
      "id": "care_systems",
      "zh": "醫療與社會照顧系統",
      "en": "Health & Social Care Systems",
      "framework": "概念理解",
      "frameworkEn": "Concepts",
      "emoji": "📘",
      "count": 83,
      "mcCount": 83,
      "writtenCount": 0
    },
    {
      "id": "health_promotion",
      "zh": "促進健康",
      "en": "Health Promotion",
      "framework": "概念理解",
      "frameworkEn": "Concepts",
      "emoji": "📘",
      "count": 100,
      "mcCount": 100,
      "writtenCount": 0
    },
    {
      "id": "community_care",
      "zh": "社區照顧",
      "en": "Community Care",
      "framework": "概念理解",
      "frameworkEn": "Concepts",
      "emoji": "📘",
      "count": 87,
      "mcCount": 87,
      "writtenCount": 0
    },
    {
      "id": "public_health",
      "zh": "公共衞生與疾病預防",
      "en": "Public Health & Prevention",
      "framework": "概念理解",
      "frameworkEn": "Concepts",
      "emoji": "📘",
      "count": 104,
      "mcCount": 104,
      "writtenCount": 0
    },
    {
      "id": "care_ethics",
      "zh": "照顧倫理",
      "en": "Ethics in Care",
      "framework": "概念理解",
      "frameworkEn": "Concepts",
      "emoji": "📘",
      "count": 86,
      "mcCount": 86,
      "writtenCount": 0
    },
    {
      "id": "care_skills",
      "zh": "照顧技巧",
      "en": "Care Skills",
      "framework": "應用判斷",
      "frameworkEn": "Application",
      "emoji": "🛠️",
      "count": 98,
      "mcCount": 98,
      "writtenCount": 0
    },
    {
      "id": "hm_holistic_concept",
      "zh": "整全健康・概念應用",
      "en": "Holistic health — application",
      "framework": "概念理解",
      "frameworkEn": "Concepts",
      "emoji": "📘",
      "count": 90,
      "mcCount": 90,
      "writtenCount": 0
    },
    {
      "id": "hm_prevention_levels",
      "zh": "三級預防分類",
      "en": "Levels of prevention",
      "framework": "應用判斷",
      "frameworkEn": "Application",
      "emoji": "🛠️",
      "count": 87,
      "mcCount": 87,
      "writtenCount": 0
    },
    {
      "id": "hm_care_ethics_determinants",
      "zh": "照顧倫理與健康決定因素",
      "en": "Care ethics & determinants",
      "framework": "分析評鑑",
      "frameworkEn": "Analysis",
      "emoji": "⚖️",
      "count": 95,
      "mcCount": 95,
      "writtenCount": 0
    }
  ],
  "design-tech": [
    {
      "id": "design_process",
      "zh": "設計過程",
      "en": "Design Process",
      "framework": "概念理解",
      "frameworkEn": "Concepts",
      "emoji": "📘",
      "count": 89,
      "mcCount": 89,
      "writtenCount": 0
    },
    {
      "id": "design_elements",
      "zh": "設計元素與原則",
      "en": "Elements & Principles",
      "framework": "概念理解",
      "frameworkEn": "Concepts",
      "emoji": "📘",
      "count": 94,
      "mcCount": 94,
      "writtenCount": 0
    },
    {
      "id": "materials",
      "zh": "材料與特性",
      "en": "Materials & Properties",
      "framework": "概念理解",
      "frameworkEn": "Concepts",
      "emoji": "📘",
      "count": 91,
      "mcCount": 91,
      "writtenCount": 0
    },
    {
      "id": "structures_mech",
      "zh": "結構與機械",
      "en": "Structures & Mechanisms",
      "framework": "概念理解",
      "frameworkEn": "Concepts",
      "emoji": "📘",
      "count": 115,
      "mcCount": 115,
      "writtenCount": 0
    },
    {
      "id": "manufacturing",
      "zh": "生產工序",
      "en": "Manufacturing Processes",
      "framework": "概念理解",
      "frameworkEn": "Concepts",
      "emoji": "📘",
      "count": 111,
      "mcCount": 111,
      "writtenCount": 0
    },
    {
      "id": "cad_cam",
      "zh": "電腦輔助設計與製造",
      "en": "CAD/CAM & Technology",
      "framework": "概念理解",
      "frameworkEn": "Concepts",
      "emoji": "📘",
      "count": 112,
      "mcCount": 112,
      "writtenCount": 0
    },
    {
      "id": "ergonomics",
      "zh": "人體工學",
      "en": "Ergonomics & Human Factors",
      "framework": "概念理解",
      "frameworkEn": "Concepts",
      "emoji": "📘",
      "count": 101,
      "mcCount": 101,
      "writtenCount": 0
    },
    {
      "id": "sustainability",
      "zh": "可持續設計",
      "en": "Sustainable Design",
      "framework": "分析評鑑",
      "frameworkEn": "Analysis",
      "emoji": "⚖️",
      "count": 104,
      "mcCount": 104,
      "writtenCount": 0
    },
    {
      "id": "dat_mechanisms_calc",
      "zh": "結構與機械・計算",
      "en": "Structures & mechanisms — calculation",
      "framework": "應用判斷",
      "frameworkEn": "Application",
      "emoji": "🛠️",
      "count": 97,
      "mcCount": 97,
      "writtenCount": 0
    },
    {
      "id": "dat_materials_reason",
      "zh": "材料與結構・推理",
      "en": "Materials & structures — reasoning",
      "framework": "概念理解",
      "frameworkEn": "Concepts",
      "emoji": "📘",
      "count": 96,
      "mcCount": 96,
      "writtenCount": 0
    }
  ],
  "visual-arts": [
    {
      "id": "art_appreciation",
      "zh": "藝術評賞",
      "en": "Art Appreciation",
      "framework": "描述分析",
      "frameworkEn": "Describe & Analyse",
      "emoji": "🔍",
      "count": 96,
      "mcCount": 96,
      "writtenCount": 0
    },
    {
      "id": "elements_principles",
      "zh": "藝術元素與原則",
      "en": "Elements & Principles",
      "framework": "概念知識",
      "frameworkEn": "Concepts",
      "emoji": "📘",
      "count": 92,
      "mcCount": 92,
      "writtenCount": 0
    },
    {
      "id": "western_art",
      "zh": "西方藝術",
      "en": "Western Art",
      "framework": "概念知識",
      "frameworkEn": "Concepts",
      "emoji": "📘",
      "count": 100,
      "mcCount": 100,
      "writtenCount": 0
    },
    {
      "id": "chinese_art",
      "zh": "中國藝術",
      "en": "Chinese Art",
      "framework": "概念知識",
      "frameworkEn": "Concepts",
      "emoji": "📘",
      "count": 103,
      "mcCount": 103,
      "writtenCount": 0
    },
    {
      "id": "media_techniques",
      "zh": "媒材與技法",
      "en": "Media & Techniques",
      "framework": "概念知識",
      "frameworkEn": "Concepts",
      "emoji": "📘",
      "count": 97,
      "mcCount": 97,
      "writtenCount": 0
    },
    {
      "id": "modern_contemporary",
      "zh": "現代與當代藝術",
      "en": "Modern & Contemporary",
      "framework": "詮釋判斷",
      "frameworkEn": "Interpret & Judge",
      "emoji": "⚖️",
      "count": 114,
      "mcCount": 114,
      "writtenCount": 0
    },
    {
      "id": "visual_design",
      "zh": "視覺設計",
      "en": "Visual Design",
      "framework": "概念知識",
      "frameworkEn": "Concepts",
      "emoji": "📘",
      "count": 103,
      "mcCount": 103,
      "writtenCount": 0
    },
    {
      "id": "art_context",
      "zh": "藝術與文化",
      "en": "Art, Culture & Society",
      "framework": "詮釋判斷",
      "frameworkEn": "Interpret & Judge",
      "emoji": "⚖️",
      "count": 95,
      "mcCount": 95,
      "writtenCount": 0
    },
    {
      "id": "va_formal_analysis",
      "zh": "形式分析・元素與原則",
      "en": "Formal analysis — elements & principles",
      "framework": "描述分析",
      "frameworkEn": "Describe & Analyse",
      "emoji": "🔍",
      "count": 88,
      "mcCount": 88,
      "writtenCount": 0
    },
    {
      "id": "va_history_context",
      "zh": "藝術史・技法與風格",
      "en": "Art history — technique & style",
      "framework": "詮釋判斷",
      "frameworkEn": "Interpret & Judge",
      "emoji": "⚖️",
      "count": 112,
      "mcCount": 112,
      "writtenCount": 0
    }
  ],
  "music": [
    {
      "id": "elements",
      "zh": "音樂元素",
      "en": "Elements of Music",
      "framework": "概念理解",
      "frameworkEn": "Concepts",
      "emoji": "📘",
      "count": 107,
      "mcCount": 107,
      "writtenCount": 0
    },
    {
      "id": "theory_notation",
      "zh": "樂理與記譜",
      "en": "Theory & Notation",
      "framework": "概念理解",
      "frameworkEn": "Concepts",
      "emoji": "📘",
      "count": 92,
      "mcCount": 92,
      "writtenCount": 0
    },
    {
      "id": "form_structure",
      "zh": "曲式與結構",
      "en": "Form & Structure",
      "framework": "概念理解",
      "frameworkEn": "Concepts",
      "emoji": "📘",
      "count": 108,
      "mcCount": 108,
      "writtenCount": 0
    },
    {
      "id": "western_history",
      "zh": "西方音樂史",
      "en": "Western Music History",
      "framework": "概念理解",
      "frameworkEn": "Concepts",
      "emoji": "📘",
      "count": 112,
      "mcCount": 112,
      "writtenCount": 0
    },
    {
      "id": "chinese_music",
      "zh": "中國音樂",
      "en": "Chinese Music",
      "framework": "概念理解",
      "frameworkEn": "Concepts",
      "emoji": "📘",
      "count": 93,
      "mcCount": 93,
      "writtenCount": 0
    },
    {
      "id": "instruments",
      "zh": "樂器與合奏",
      "en": "Instruments & Ensembles",
      "framework": "概念理解",
      "frameworkEn": "Concepts",
      "emoji": "📘",
      "count": 109,
      "mcCount": 109,
      "writtenCount": 0
    },
    {
      "id": "listening",
      "zh": "聆聽與分析",
      "en": "Listening & Analysis",
      "framework": "聆聽辨析",
      "frameworkEn": "Aural Skills",
      "emoji": "👂",
      "count": 102,
      "mcCount": 102,
      "writtenCount": 0
    },
    {
      "id": "creating",
      "zh": "創作與演奏",
      "en": "Creating & Performing",
      "framework": "應用分析",
      "frameworkEn": "Application",
      "emoji": "🛠️",
      "count": 94,
      "mcCount": 94,
      "writtenCount": 0
    },
    {
      "id": "mus_theory_intervals",
      "zh": "樂理・音程與調號",
      "en": "Theory — intervals & keys",
      "framework": "應用分析",
      "frameworkEn": "Application",
      "emoji": "🛠️",
      "count": 110,
      "mcCount": 110,
      "writtenCount": 0
    },
    {
      "id": "mus_harmony_form",
      "zh": "和聲・和弦與曲式",
      "en": "Harmony — chords & form",
      "framework": "概念理解",
      "frameworkEn": "Concepts",
      "emoji": "📘",
      "count": 87,
      "mcCount": 87,
      "writtenCount": 0
    }
  ],
  "pe": [
    {
      "id": "anatomy",
      "zh": "解剖學",
      "en": "Anatomy",
      "framework": "概念理解",
      "frameworkEn": "Concepts",
      "emoji": "📘",
      "count": 96,
      "mcCount": 96,
      "writtenCount": 0
    },
    {
      "id": "physiology",
      "zh": "運動生理學",
      "en": "Exercise Physiology",
      "framework": "概念理解",
      "frameworkEn": "Concepts",
      "emoji": "📘",
      "count": 89,
      "mcCount": 89,
      "writtenCount": 0
    },
    {
      "id": "biomechanics",
      "zh": "生物力學",
      "en": "Biomechanics",
      "framework": "概念理解",
      "frameworkEn": "Concepts",
      "emoji": "📘",
      "count": 101,
      "mcCount": 101,
      "writtenCount": 0
    },
    {
      "id": "fitness_training",
      "zh": "體適能與訓練",
      "en": "Fitness & Training",
      "framework": "概念理解",
      "frameworkEn": "Concepts",
      "emoji": "📘",
      "count": 111,
      "mcCount": 111,
      "writtenCount": 0
    },
    {
      "id": "nutrition_health",
      "zh": "營養與健康",
      "en": "Nutrition & Health",
      "framework": "概念理解",
      "frameworkEn": "Concepts",
      "emoji": "📘",
      "count": 130,
      "mcCount": 130,
      "writtenCount": 0
    },
    {
      "id": "injuries",
      "zh": "運動創傷",
      "en": "Sports Injuries",
      "framework": "應用分析",
      "frameworkEn": "Application",
      "emoji": "🛠️",
      "count": 90,
      "mcCount": 90,
      "writtenCount": 0
    },
    {
      "id": "psychology",
      "zh": "運動心理學",
      "en": "Sport Psychology",
      "framework": "概念理解",
      "frameworkEn": "Concepts",
      "emoji": "📘",
      "count": 109,
      "mcCount": 109,
      "writtenCount": 0
    },
    {
      "id": "sport_society",
      "zh": "運動與社會",
      "en": "Sport & Society",
      "framework": "概念理解",
      "frameworkEn": "Concepts",
      "emoji": "📘",
      "count": 99,
      "mcCount": 99,
      "writtenCount": 0
    },
    {
      "id": "pe_physiology_calc",
      "zh": "運動生理計算",
      "en": "Exercise physiology — calculation",
      "framework": "計算分析",
      "frameworkEn": "Quantitative",
      "emoji": "🧮",
      "count": 92,
      "mcCount": 92,
      "writtenCount": 0
    },
    {
      "id": "pe_biomech_systems",
      "zh": "生物力學與能量系統",
      "en": "Biomechanics & energy systems",
      "framework": "應用分析",
      "frameworkEn": "Application",
      "emoji": "🛠️",
      "count": 102,
      "mcCount": 102,
      "writtenCount": 0
    }
  ],
  "technology-living": [
    {
      "id": "nutrition",
      "zh": "膳食營養素",
      "en": "Nutrients",
      "framework": "營養健康",
      "frameworkEn": "Nutrition & Health",
      "emoji": "🍎",
      "count": 91,
      "mcCount": 91,
      "writtenCount": 0
    },
    {
      "id": "lifecycle",
      "zh": "生命週期營養",
      "en": "Lifecycle Nutrition",
      "framework": "營養健康",
      "frameworkEn": "Nutrition & Health",
      "emoji": "🍎",
      "count": 88,
      "mcCount": 88,
      "writtenCount": 0
    },
    {
      "id": "meal_planning",
      "zh": "膳食計劃",
      "en": "Meal Planning",
      "framework": "營養健康",
      "frameworkEn": "Nutrition & Health",
      "emoji": "🍎",
      "count": 115,
      "mcCount": 115,
      "writtenCount": 0
    },
    {
      "id": "food_science",
      "zh": "食物科學",
      "en": "Food Science",
      "framework": "食物科學",
      "frameworkEn": "Food Science",
      "emoji": "🔬",
      "count": 113,
      "mcCount": 113,
      "writtenCount": 0
    },
    {
      "id": "food_safety",
      "zh": "食物安全",
      "en": "Food Safety",
      "framework": "食物科學",
      "frameworkEn": "Food Science",
      "emoji": "🔬",
      "count": 96,
      "mcCount": 96,
      "writtenCount": 0
    },
    {
      "id": "fibres",
      "zh": "纖維與布料",
      "en": "Fibres & Fabrics",
      "framework": "紡織科學",
      "frameworkEn": "Textile Science",
      "emoji": "🧵",
      "count": 106,
      "mcCount": 106,
      "writtenCount": 0
    },
    {
      "id": "fashion",
      "zh": "成衣與時尚",
      "en": "Garments & Fashion",
      "framework": "紡織科學",
      "frameworkEn": "Textile Science",
      "emoji": "🧵",
      "count": 109,
      "mcCount": 109,
      "writtenCount": 0
    },
    {
      "id": "consumer",
      "zh": "消費與可持續",
      "en": "Consumer & Sustainability",
      "framework": "消費文化",
      "frameworkEn": "Consumer Culture",
      "emoji": "🛍️",
      "count": 102,
      "mcCount": 102,
      "writtenCount": 0
    },
    {
      "id": "tl_nutrition_calc",
      "zh": "營養計算",
      "en": "Nutrition — calculation",
      "framework": "營養健康",
      "frameworkEn": "Nutrition & Health",
      "emoji": "🍎",
      "count": 95,
      "mcCount": 95,
      "writtenCount": 0
    },
    {
      "id": "tl_food_textile_sci",
      "zh": "食物與紡織科學",
      "en": "Food & textile science",
      "framework": "食物科學",
      "frameworkEn": "Food Science",
      "emoji": "🔬",
      "count": 105,
      "mcCount": 105,
      "writtenCount": 0
    }
  ]
}

/** 全站題目總數。 */
export const TOTAL_QUESTIONS = 26204
