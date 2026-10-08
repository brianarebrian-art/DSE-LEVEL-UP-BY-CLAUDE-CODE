// AUTO-GATED question bank —— 由 scripts/qbank/auto-promote.mts 自動入庫。
// 【本檔題目未經真人逐題審批。】機器只能檢驗客觀項目：格式、選項、術語紅線、
// LaTeX、與現有題庫的重複度、topic id 是否已註冊。答案在學術上是否正確，
// 並不在此閘的能力範圍之內 —— 故出題端必須 correct-by-construction，或引用
// 可查證的原文。前端 QuestionProvenance 會如實向學生顯示
// 「經自動檢查 …本題未有實名逐題審批紀錄」。
//   subject  : physics
//   count    : 80  (easy 48 / medium 22 / hard 10)
//   types    : mc 80 / text 0 / long 0
//   updated  : 2026-08-22
// 請勿手動編輯 —— 修改將於下次執行 auto-promote 時被覆寫。
import type { Question } from './types'

export const physicsAutoQuestions: Question[] = [
  {
    "id": "phy_rep_0001",
    "type": "mc",
    "subject": "physics",
    "topic": "electricity",
    "topicZh": "電學",
    "topicEn": "Electricity",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "一個電阻為 $4\\,\\Omega$ 的電器接上 $12\\,\\text{V}$ 的電源。求通過它的電流。",
    "explanation": "歐姆定律 $V = IR$，移項得 $I = \\dfrac{V}{R} = \\dfrac{12}{4} = 3\\,\\text{A}$。可用常理檢查：電壓不變時，電阻越大，電流越小。",
    "options": [
      "$3\\,\\text{A}$",
      "$48\\,\\text{A}$",
      "$0.3333\\,\\text{A}$",
      "$8\\,\\text{A}$"
    ],
    "correctIndex": 0,
    "marks": 1,
    "contentEn": "A device of resistance $4\\,\\Omega$ is connected to a $12\\,\\text{V}$ supply. Find the current through it.",
    "optionsEn": [
      "$3\\,\\text{A}$",
      "$48\\,\\text{A}$",
      "$0.3333\\,\\text{A}$",
      "$8\\,\\text{A}$"
    ],
    "explanationEn": "Ohm's law $V = IR$ rearranges to $I = \\dfrac{V}{R} = \\dfrac{12}{4} = 3\\,\\text{A}$. A quick check: at a fixed voltage, a larger resistance gives a smaller current.",
    "frameworkEn": "Auto-gated",
    "optionNotes": [
      {
        "optionId": 0,
        "zh": "正確。$I = \\dfrac{V}{R} = \\dfrac{12}{4} = 3\\,\\text{A}$。",
        "en": "Correct. $I = \\dfrac{V}{R} = \\dfrac{12}{4} = 3\\,\\text{A}$."
      },
      {
        "optionId": 1,
        "zh": "$12 \\times 4 = 48$ 把電壓與電阻相乘。電阻越大，電流應該越小；相乘卻令電流隨電阻上升。",
        "en": "$12 \\times 4 = 48$ multiplies voltage by resistance. A larger resistance should give a smaller current; multiplying makes it larger."
      },
      {
        "optionId": 2,
        "zh": "$\\dfrac{4}{12} \\approx 0.3333$ 把分子分母對調了，數值上是電流的倒數，並非電流。",
        "en": "$\\dfrac{4}{12} \\approx 0.3333$ has the fraction upside down; it is the reciprocal of the current, not the current."
      },
      {
        "optionId": 3,
        "zh": "$12 - 4 = 8$ 把電壓減去電阻；兩者單位不同，不能相減。",
        "en": "$12 - 4 = 8$ subtracts resistance from voltage; quantities with different units cannot be subtracted."
      }
    ]
  },
  {
    "id": "phy_rep_0002",
    "type": "mc",
    "subject": "physics",
    "topic": "electricity",
    "topicZh": "電學",
    "topicEn": "Electricity",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "一個電阻為 $6\\,\\Omega$ 的電器接上 $24\\,\\text{V}$ 的電源。求通過它的電流。",
    "explanation": "歐姆定律 $V = IR$，移項得 $I = \\dfrac{V}{R} = \\dfrac{24}{6} = 4\\,\\text{A}$。可用常理檢查：電壓不變時，電阻越大，電流越小。",
    "options": [
      "$18\\,\\text{A}$",
      "$4\\,\\text{A}$",
      "$144\\,\\text{A}$",
      "$0.25\\,\\text{A}$"
    ],
    "correctIndex": 1,
    "marks": 1,
    "contentEn": "A device of resistance $6\\,\\Omega$ is connected to a $24\\,\\text{V}$ supply. Find the current through it.",
    "optionsEn": [
      "$18\\,\\text{A}$",
      "$4\\,\\text{A}$",
      "$144\\,\\text{A}$",
      "$0.25\\,\\text{A}$"
    ],
    "explanationEn": "Ohm's law $V = IR$ rearranges to $I = \\dfrac{V}{R} = \\dfrac{24}{6} = 4\\,\\text{A}$. A quick check: at a fixed voltage, a larger resistance gives a smaller current.",
    "frameworkEn": "Auto-gated",
    "optionNotes": [
      {
        "optionId": 0,
        "zh": "$24 - 6 = 18$ 把電壓減去電阻；兩者單位不同，不能相減。",
        "en": "$24 - 6 = 18$ subtracts resistance from voltage; quantities with different units cannot be subtracted."
      },
      {
        "optionId": 1,
        "zh": "正確。$I = \\dfrac{V}{R} = \\dfrac{24}{6} = 4\\,\\text{A}$。",
        "en": "Correct. $I = \\dfrac{V}{R} = \\dfrac{24}{6} = 4\\,\\text{A}$."
      },
      {
        "optionId": 2,
        "zh": "$24 \\times 6 = 144$ 把電壓與電阻相乘。電阻越大，電流應該越小；相乘卻令電流隨電阻上升。",
        "en": "$24 \\times 6 = 144$ multiplies voltage by resistance. A larger resistance should give a smaller current; multiplying makes it larger."
      },
      {
        "optionId": 3,
        "zh": "$\\dfrac{6}{24} = 0.25$ 把分子分母對調了，數值上是電流的倒數，並非電流。",
        "en": "$\\dfrac{6}{24} = 0.25$ has the fraction upside down; it is the reciprocal of the current, not the current."
      }
    ]
  },
  {
    "id": "phy_rep_0003",
    "type": "mc",
    "subject": "physics",
    "topic": "electricity",
    "topicZh": "電學",
    "topicEn": "Electricity",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "一個電阻為 $3\\,\\Omega$ 的電器接上 $9\\,\\text{V}$ 的電源。求通過它的電流。",
    "explanation": "歐姆定律 $V = IR$，移項得 $I = \\dfrac{V}{R} = \\dfrac{9}{3} = 3\\,\\text{A}$。可用常理檢查：電壓不變時，電阻越大，電流越小。",
    "options": [
      "$0.3333\\,\\text{A}$",
      "$6\\,\\text{A}$",
      "$3\\,\\text{A}$",
      "$27\\,\\text{A}$"
    ],
    "correctIndex": 2,
    "marks": 1,
    "contentEn": "A device of resistance $3\\,\\Omega$ is connected to a $9\\,\\text{V}$ supply. Find the current through it.",
    "optionsEn": [
      "$0.3333\\,\\text{A}$",
      "$6\\,\\text{A}$",
      "$3\\,\\text{A}$",
      "$27\\,\\text{A}$"
    ],
    "explanationEn": "Ohm's law $V = IR$ rearranges to $I = \\dfrac{V}{R} = \\dfrac{9}{3} = 3\\,\\text{A}$. A quick check: at a fixed voltage, a larger resistance gives a smaller current.",
    "frameworkEn": "Auto-gated",
    "optionNotes": [
      {
        "optionId": 0,
        "zh": "$\\dfrac{3}{9} \\approx 0.3333$ 把分子分母對調了，數值上是電流的倒數，並非電流。",
        "en": "$\\dfrac{3}{9} \\approx 0.3333$ has the fraction upside down; it is the reciprocal of the current, not the current."
      },
      {
        "optionId": 1,
        "zh": "$9 - 3 = 6$ 把電壓減去電阻；兩者單位不同，不能相減。",
        "en": "$9 - 3 = 6$ subtracts resistance from voltage; quantities with different units cannot be subtracted."
      },
      {
        "optionId": 2,
        "zh": "正確。$I = \\dfrac{V}{R} = \\dfrac{9}{3} = 3\\,\\text{A}$。",
        "en": "Correct. $I = \\dfrac{V}{R} = \\dfrac{9}{3} = 3\\,\\text{A}$."
      },
      {
        "optionId": 3,
        "zh": "$9 \\times 3 = 27$ 把電壓與電阻相乘。電阻越大，電流應該越小；相乘卻令電流隨電阻上升。",
        "en": "$9 \\times 3 = 27$ multiplies voltage by resistance. A larger resistance should give a smaller current; multiplying makes it larger."
      }
    ]
  },
  {
    "id": "phy_rep_0004",
    "type": "mc",
    "subject": "physics",
    "topic": "electricity",
    "topicZh": "電學",
    "topicEn": "Electricity",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "一個電阻為 $9\\,\\Omega$ 的電器接上 $18\\,\\text{V}$ 的電源。求通過它的電流。",
    "explanation": "歐姆定律 $V = IR$，移項得 $I = \\dfrac{V}{R} = \\dfrac{18}{9} = 2\\,\\text{A}$。可用常理檢查：電壓不變時，電阻越大，電流越小。",
    "options": [
      "$162\\,\\text{A}$",
      "$0.5\\,\\text{A}$",
      "$9\\,\\text{A}$",
      "$2\\,\\text{A}$"
    ],
    "correctIndex": 3,
    "marks": 1,
    "contentEn": "A device of resistance $9\\,\\Omega$ is connected to a $18\\,\\text{V}$ supply. Find the current through it.",
    "optionsEn": [
      "$162\\,\\text{A}$",
      "$0.5\\,\\text{A}$",
      "$9\\,\\text{A}$",
      "$2\\,\\text{A}$"
    ],
    "explanationEn": "Ohm's law $V = IR$ rearranges to $I = \\dfrac{V}{R} = \\dfrac{18}{9} = 2\\,\\text{A}$. A quick check: at a fixed voltage, a larger resistance gives a smaller current.",
    "frameworkEn": "Auto-gated",
    "optionNotes": [
      {
        "optionId": 0,
        "zh": "$18 \\times 9 = 162$ 把電壓與電阻相乘。電阻越大，電流應該越小；相乘卻令電流隨電阻上升。",
        "en": "$18 \\times 9 = 162$ multiplies voltage by resistance. A larger resistance should give a smaller current; multiplying makes it larger."
      },
      {
        "optionId": 1,
        "zh": "$\\dfrac{9}{18} = 0.5$ 把分子分母對調了，數值上是電流的倒數，並非電流。",
        "en": "$\\dfrac{9}{18} = 0.5$ has the fraction upside down; it is the reciprocal of the current, not the current."
      },
      {
        "optionId": 2,
        "zh": "$18 - 9 = 9$ 把電壓減去電阻；兩者單位不同，不能相減。",
        "en": "$18 - 9 = 9$ subtracts resistance from voltage; quantities with different units cannot be subtracted."
      },
      {
        "optionId": 3,
        "zh": "正確。$I = \\dfrac{V}{R} = \\dfrac{18}{9} = 2\\,\\text{A}$。",
        "en": "Correct. $I = \\dfrac{V}{R} = \\dfrac{18}{9} = 2\\,\\text{A}$."
      }
    ]
  },
  {
    "id": "phy_rep_0005",
    "type": "mc",
    "subject": "physics",
    "topic": "electricity",
    "topicZh": "電學",
    "topicEn": "Electricity",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "一個電阻為 $12\\,\\Omega$ 的電器接上 $36\\,\\text{V}$ 的電源。求通過它的電流。",
    "explanation": "歐姆定律 $V = IR$，移項得 $I = \\dfrac{V}{R} = \\dfrac{36}{12} = 3\\,\\text{A}$。可用常理檢查：電壓不變時，電阻越大，電流越小。",
    "options": [
      "$3\\,\\text{A}$",
      "$432\\,\\text{A}$",
      "$0.3333\\,\\text{A}$",
      "$24\\,\\text{A}$"
    ],
    "correctIndex": 0,
    "marks": 1,
    "contentEn": "A device of resistance $12\\,\\Omega$ is connected to a $36\\,\\text{V}$ supply. Find the current through it.",
    "optionsEn": [
      "$3\\,\\text{A}$",
      "$432\\,\\text{A}$",
      "$0.3333\\,\\text{A}$",
      "$24\\,\\text{A}$"
    ],
    "explanationEn": "Ohm's law $V = IR$ rearranges to $I = \\dfrac{V}{R} = \\dfrac{36}{12} = 3\\,\\text{A}$. A quick check: at a fixed voltage, a larger resistance gives a smaller current.",
    "frameworkEn": "Auto-gated",
    "optionNotes": [
      {
        "optionId": 0,
        "zh": "正確。$I = \\dfrac{V}{R} = \\dfrac{36}{12} = 3\\,\\text{A}$。",
        "en": "Correct. $I = \\dfrac{V}{R} = \\dfrac{36}{12} = 3\\,\\text{A}$."
      },
      {
        "optionId": 1,
        "zh": "$36 \\times 12 = 432$ 把電壓與電阻相乘。電阻越大，電流應該越小；相乘卻令電流隨電阻上升。",
        "en": "$36 \\times 12 = 432$ multiplies voltage by resistance. A larger resistance should give a smaller current; multiplying makes it larger."
      },
      {
        "optionId": 2,
        "zh": "$\\dfrac{12}{36} \\approx 0.3333$ 把分子分母對調了，數值上是電流的倒數，並非電流。",
        "en": "$\\dfrac{12}{36} \\approx 0.3333$ has the fraction upside down; it is the reciprocal of the current, not the current."
      },
      {
        "optionId": 3,
        "zh": "$36 - 12 = 24$ 把電壓減去電阻；兩者單位不同，不能相減。",
        "en": "$36 - 12 = 24$ subtracts resistance from voltage; quantities with different units cannot be subtracted."
      }
    ]
  },
  {
    "id": "phy_rep_0006",
    "type": "mc",
    "subject": "physics",
    "topic": "electricity",
    "topicZh": "電學",
    "topicEn": "Electricity",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "一個電阻為 $2\\,\\Omega$ 的電器接上 $6\\,\\text{V}$ 的電源。求通過它的電流。",
    "explanation": "歐姆定律 $V = IR$，移項得 $I = \\dfrac{V}{R} = \\dfrac{6}{2} = 3\\,\\text{A}$。可用常理檢查：電壓不變時，電阻越大，電流越小。",
    "options": [
      "$4\\,\\text{A}$",
      "$3\\,\\text{A}$",
      "$12\\,\\text{A}$",
      "$0.3333\\,\\text{A}$"
    ],
    "correctIndex": 1,
    "marks": 1,
    "contentEn": "A device of resistance $2\\,\\Omega$ is connected to a $6\\,\\text{V}$ supply. Find the current through it.",
    "optionsEn": [
      "$4\\,\\text{A}$",
      "$3\\,\\text{A}$",
      "$12\\,\\text{A}$",
      "$0.3333\\,\\text{A}$"
    ],
    "explanationEn": "Ohm's law $V = IR$ rearranges to $I = \\dfrac{V}{R} = \\dfrac{6}{2} = 3\\,\\text{A}$. A quick check: at a fixed voltage, a larger resistance gives a smaller current.",
    "frameworkEn": "Auto-gated",
    "optionNotes": [
      {
        "optionId": 0,
        "zh": "$6 - 2 = 4$ 把電壓減去電阻；兩者單位不同，不能相減。",
        "en": "$6 - 2 = 4$ subtracts resistance from voltage; quantities with different units cannot be subtracted."
      },
      {
        "optionId": 1,
        "zh": "正確。$I = \\dfrac{V}{R} = \\dfrac{6}{2} = 3\\,\\text{A}$。",
        "en": "Correct. $I = \\dfrac{V}{R} = \\dfrac{6}{2} = 3\\,\\text{A}$."
      },
      {
        "optionId": 2,
        "zh": "$6 \\times 2 = 12$ 把電壓與電阻相乘。電阻越大，電流應該越小；相乘卻令電流隨電阻上升。",
        "en": "$6 \\times 2 = 12$ multiplies voltage by resistance. A larger resistance should give a smaller current; multiplying makes it larger."
      },
      {
        "optionId": 3,
        "zh": "$\\dfrac{2}{6} \\approx 0.3333$ 把分子分母對調了，數值上是電流的倒數，並非電流。",
        "en": "$\\dfrac{2}{6} \\approx 0.3333$ has the fraction upside down; it is the reciprocal of the current, not the current."
      }
    ]
  },
  {
    "id": "phy_rep_0013",
    "type": "mc",
    "subject": "physics",
    "topic": "electricity",
    "topicZh": "電學",
    "topicEn": "Electricity",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "三個電阻 $2\\,\\Omega$、$3\\,\\Omega$ 及 $5\\,\\Omega$ 串聯接在同一電路中。求總電阻。",
    "explanation": "串聯時電流只有一條路徑，各電阻的阻礙逐個累加：$R = 2 + 3 + 5 = 10\\,\\Omega$。$0.9677\\,\\Omega$ 是用了並聯公式 $1/R = \\sum 1/R_i$ 的結果——分辨方法是看電流有沒有分岔：串聯無分岔，總電阻必定【大於】其中任何一個；並聯有分岔，總電阻必定【小於】最小的一個。$5\\,\\Omega$ 漏了第三個電阻。最後一項把相加誤作相乘。",
    "options": [
      "$10\\,\\text{\\Omega}$",
      "$0.9677\\,\\text{\\Omega}$",
      "$5\\,\\text{\\Omega}$",
      "$30\\,\\text{\\Omega}$"
    ],
    "correctIndex": 0,
    "marks": 1,
    "contentEn": "Three resistors of $2\\,\\Omega$, $3\\,\\Omega$ and $5\\,\\Omega$ are connected in series. Find the total resistance.",
    "optionsEn": [
      "$10\\,\\text{\\Omega}$",
      "$0.9677\\,\\text{\\Omega}$",
      "$5\\,\\text{\\Omega}$",
      "$30\\,\\text{\\Omega}$"
    ],
    "explanationEn": "In series there is only one path, so the resistances simply add: $R = 2 + 3 + 5 = 10\\,\\Omega$. $0.9677\\,\\Omega$ comes from the parallel formula $1/R = \\sum 1/R_i$. The test is whether the current branches: in series it does not, and the total must be *larger* than any single resistor; in parallel it does, and the total must be *smaller* than the smallest. $5\\,\\Omega$ omits the third resistor, and the last option multiplies instead of adding.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "phy_rep_0014",
    "type": "mc",
    "subject": "physics",
    "topic": "electricity",
    "topicZh": "電學",
    "topicEn": "Electricity",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "三個電阻 $4\\,\\Omega$、$6\\,\\Omega$ 及 $10\\,\\Omega$ 串聯接在同一電路中。求總電阻。",
    "explanation": "串聯時電流只有一條路徑，各電阻的阻礙逐個累加：$R = 4 + 6 + 10 = 20\\,\\Omega$。$1.9355\\,\\Omega$ 是用了並聯公式 $1/R = \\sum 1/R_i$ 的結果——分辨方法是看電流有沒有分岔：串聯無分岔，總電阻必定【大於】其中任何一個；並聯有分岔，總電阻必定【小於】最小的一個。$10\\,\\Omega$ 漏了第三個電阻。最後一項把相加誤作相乘。",
    "options": [
      "$240\\,\\text{\\Omega}$",
      "$20\\,\\text{\\Omega}$",
      "$1.9355\\,\\text{\\Omega}$",
      "$10\\,\\text{\\Omega}$"
    ],
    "correctIndex": 1,
    "marks": 1,
    "contentEn": "Three resistors of $4\\,\\Omega$, $6\\,\\Omega$ and $10\\,\\Omega$ are connected in series. Find the total resistance.",
    "optionsEn": [
      "$240\\,\\text{\\Omega}$",
      "$20\\,\\text{\\Omega}$",
      "$1.9355\\,\\text{\\Omega}$",
      "$10\\,\\text{\\Omega}$"
    ],
    "explanationEn": "In series there is only one path, so the resistances simply add: $R = 4 + 6 + 10 = 20\\,\\Omega$. $1.9355\\,\\Omega$ comes from the parallel formula $1/R = \\sum 1/R_i$. The test is whether the current branches: in series it does not, and the total must be *larger* than any single resistor; in parallel it does, and the total must be *smaller* than the smallest. $10\\,\\Omega$ omits the third resistor, and the last option multiplies instead of adding.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "phy_rep_0015",
    "type": "mc",
    "subject": "physics",
    "topic": "electricity",
    "topicZh": "電學",
    "topicEn": "Electricity",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "三個電阻 $1\\,\\Omega$、$2\\,\\Omega$ 及 $4\\,\\Omega$ 串聯接在同一電路中。求總電阻。",
    "explanation": "串聯時電流只有一條路徑，各電阻的阻礙逐個累加：$R = 1 + 2 + 4 = 7\\,\\Omega$。$0.5714\\,\\Omega$ 是用了並聯公式 $1/R = \\sum 1/R_i$ 的結果——分辨方法是看電流有沒有分岔：串聯無分岔，總電阻必定【大於】其中任何一個；並聯有分岔，總電阻必定【小於】最小的一個。$3\\,\\Omega$ 漏了第三個電阻。最後一項把相加誤作相乘。",
    "options": [
      "$3\\,\\text{\\Omega}$",
      "$8\\,\\text{\\Omega}$",
      "$7\\,\\text{\\Omega}$",
      "$0.5714\\,\\text{\\Omega}$"
    ],
    "correctIndex": 2,
    "marks": 1,
    "contentEn": "Three resistors of $1\\,\\Omega$, $2\\,\\Omega$ and $4\\,\\Omega$ are connected in series. Find the total resistance.",
    "optionsEn": [
      "$3\\,\\text{\\Omega}$",
      "$8\\,\\text{\\Omega}$",
      "$7\\,\\text{\\Omega}$",
      "$0.5714\\,\\text{\\Omega}$"
    ],
    "explanationEn": "In series there is only one path, so the resistances simply add: $R = 1 + 2 + 4 = 7\\,\\Omega$. $0.5714\\,\\Omega$ comes from the parallel formula $1/R = \\sum 1/R_i$. The test is whether the current branches: in series it does not, and the total must be *larger* than any single resistor; in parallel it does, and the total must be *smaller* than the smallest. $3\\,\\Omega$ omits the third resistor, and the last option multiplies instead of adding.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "phy_rep_0016",
    "type": "mc",
    "subject": "physics",
    "topic": "electricity",
    "topicZh": "電學",
    "topicEn": "Electricity",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "三個電阻 $5\\,\\Omega$、$5\\,\\Omega$ 及 $10\\,\\Omega$ 串聯接在同一電路中。求總電阻。",
    "explanation": "串聯時電流只有一條路徑，各電阻的阻礙逐個累加：$R = 5 + 5 + 10 = 20\\,\\Omega$。$2\\,\\Omega$ 是用了並聯公式 $1/R = \\sum 1/R_i$ 的結果——分辨方法是看電流有沒有分岔：串聯無分岔，總電阻必定【大於】其中任何一個；並聯有分岔，總電阻必定【小於】最小的一個。$10\\,\\Omega$ 漏了第三個電阻。最後一項把相加誤作相乘。",
    "options": [
      "$2\\,\\text{\\Omega}$",
      "$10\\,\\text{\\Omega}$",
      "$250\\,\\text{\\Omega}$",
      "$20\\,\\text{\\Omega}$"
    ],
    "correctIndex": 3,
    "marks": 1,
    "contentEn": "Three resistors of $5\\,\\Omega$, $5\\,\\Omega$ and $10\\,\\Omega$ are connected in series. Find the total resistance.",
    "optionsEn": [
      "$2\\,\\text{\\Omega}$",
      "$10\\,\\text{\\Omega}$",
      "$250\\,\\text{\\Omega}$",
      "$20\\,\\text{\\Omega}$"
    ],
    "explanationEn": "In series there is only one path, so the resistances simply add: $R = 5 + 5 + 10 = 20\\,\\Omega$. $2\\,\\Omega$ comes from the parallel formula $1/R = \\sum 1/R_i$. The test is whether the current branches: in series it does not, and the total must be *larger* than any single resistor; in parallel it does, and the total must be *smaller* than the smallest. $10\\,\\Omega$ omits the third resistor, and the last option multiplies instead of adding.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "phy_rep_0017",
    "type": "mc",
    "subject": "physics",
    "topic": "electricity",
    "topicZh": "電學",
    "topicEn": "Electricity",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "三個電阻 $8\\,\\Omega$、$12\\,\\Omega$ 及 $4\\,\\Omega$ 串聯接在同一電路中。求總電阻。",
    "explanation": "串聯時電流只有一條路徑，各電阻的阻礙逐個累加：$R = 8 + 12 + 4 = 24\\,\\Omega$。$2.1818\\,\\Omega$ 是用了並聯公式 $1/R = \\sum 1/R_i$ 的結果——分辨方法是看電流有沒有分岔：串聯無分岔，總電阻必定【大於】其中任何一個；並聯有分岔，總電阻必定【小於】最小的一個。$20\\,\\Omega$ 漏了第三個電阻。最後一項把相加誤作相乘。",
    "options": [
      "$24\\,\\text{\\Omega}$",
      "$2.1818\\,\\text{\\Omega}$",
      "$20\\,\\text{\\Omega}$",
      "$384\\,\\text{\\Omega}$"
    ],
    "correctIndex": 0,
    "marks": 1,
    "contentEn": "Three resistors of $8\\,\\Omega$, $12\\,\\Omega$ and $4\\,\\Omega$ are connected in series. Find the total resistance.",
    "optionsEn": [
      "$24\\,\\text{\\Omega}$",
      "$2.1818\\,\\text{\\Omega}$",
      "$20\\,\\text{\\Omega}$",
      "$384\\,\\text{\\Omega}$"
    ],
    "explanationEn": "In series there is only one path, so the resistances simply add: $R = 8 + 12 + 4 = 24\\,\\Omega$. $2.1818\\,\\Omega$ comes from the parallel formula $1/R = \\sum 1/R_i$. The test is whether the current branches: in series it does not, and the total must be *larger* than any single resistor; in parallel it does, and the total must be *smaller* than the smallest. $20\\,\\Omega$ omits the third resistor, and the last option multiplies instead of adding.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "phy_rep_0018",
    "type": "mc",
    "subject": "physics",
    "topic": "electricity",
    "topicZh": "電學",
    "topicEn": "Electricity",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "三個電阻 $10\\,\\Omega$、$15\\,\\Omega$ 及 $5\\,\\Omega$ 串聯接在同一電路中。求總電阻。",
    "explanation": "串聯時電流只有一條路徑，各電阻的阻礙逐個累加：$R = 10 + 15 + 5 = 30\\,\\Omega$。$2.7273\\,\\Omega$ 是用了並聯公式 $1/R = \\sum 1/R_i$ 的結果——分辨方法是看電流有沒有分岔：串聯無分岔，總電阻必定【大於】其中任何一個；並聯有分岔，總電阻必定【小於】最小的一個。$25\\,\\Omega$ 漏了第三個電阻。最後一項把相加誤作相乘。",
    "options": [
      "$750\\,\\text{\\Omega}$",
      "$30\\,\\text{\\Omega}$",
      "$2.7273\\,\\text{\\Omega}$",
      "$25\\,\\text{\\Omega}$"
    ],
    "correctIndex": 1,
    "marks": 1,
    "contentEn": "Three resistors of $10\\,\\Omega$, $15\\,\\Omega$ and $5\\,\\Omega$ are connected in series. Find the total resistance.",
    "optionsEn": [
      "$750\\,\\text{\\Omega}$",
      "$30\\,\\text{\\Omega}$",
      "$2.7273\\,\\text{\\Omega}$",
      "$25\\,\\text{\\Omega}$"
    ],
    "explanationEn": "In series there is only one path, so the resistances simply add: $R = 10 + 15 + 5 = 30\\,\\Omega$. $2.7273\\,\\Omega$ comes from the parallel formula $1/R = \\sum 1/R_i$. The test is whether the current branches: in series it does not, and the total must be *larger* than any single resistor; in parallel it does, and the total must be *smaller* than the smallest. $25\\,\\Omega$ omits the third resistor, and the last option multiplies instead of adding.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "phy_rep_0019",
    "type": "mc",
    "subject": "physics",
    "topic": "electricity",
    "topicZh": "電學",
    "topicEn": "Electricity",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "一條導線中通過 $2\\,\\text{A}$ 的穩定電流，歷時 $1\\,\\text{min}$。求通過的電荷量。",
    "explanation": "$Q = It$，但 $t$ 必須用秒：$1\\,\\text{min} = 60\\,\\text{s}$，故 $Q = 2 \\times 60 = 120\\,\\text{C}$。$2\\,\\text{C}$ 直接用了分鐘，是本題唯一的陷阱，亦是最多人中招的一項——公式本身答得對，單位換算漏了。其餘兩項把乘法誤作除法。",
    "options": [
      "$0.0333\\,\\text{C}$",
      "$30\\,\\text{C}$",
      "$120\\,\\text{C}$",
      "$2\\,\\text{C}$"
    ],
    "correctIndex": 2,
    "marks": 1,
    "contentEn": "A steady current of $2\\,\\text{A}$ flows in a wire for $1\\,\\text{min}$. Find the charge that passes.",
    "optionsEn": [
      "$0.0333\\,\\text{C}$",
      "$30\\,\\text{C}$",
      "$120\\,\\text{C}$",
      "$2\\,\\text{C}$"
    ],
    "explanationEn": "$Q = It$, but $t$ must be in seconds: $1\\,\\text{min} = 60\\,\\text{s}$, so $Q = 2 \\times 60 = 120\\,\\text{C}$. $2\\,\\text{C}$ uses minutes directly — the one trap here, and the commonest slip: the formula is right but the unit conversion is missed. The other two divide where they should multiply.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "phy_rep_0020",
    "type": "mc",
    "subject": "physics",
    "topic": "electricity",
    "topicZh": "電學",
    "topicEn": "Electricity",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "一條導線中通過 $0.5\\,\\text{A}$ 的穩定電流，歷時 $2\\,\\text{min}$。求通過的電荷量。",
    "explanation": "$Q = It$，但 $t$ 必須用秒：$2\\,\\text{min} = 120\\,\\text{s}$，故 $Q = 0.5 \\times 120 = 60\\,\\text{C}$。$1\\,\\text{C}$ 直接用了分鐘，是本題唯一的陷阱，亦是最多人中招的一項——公式本身答得對，單位換算漏了。其餘兩項把乘法誤作除法。",
    "options": [
      "$1\\,\\text{C}$",
      "$0.0042\\,\\text{C}$",
      "$240\\,\\text{C}$",
      "$60\\,\\text{C}$"
    ],
    "correctIndex": 3,
    "marks": 1,
    "contentEn": "A steady current of $0.5\\,\\text{A}$ flows in a wire for $2\\,\\text{min}$. Find the charge that passes.",
    "optionsEn": [
      "$1\\,\\text{C}$",
      "$0.0042\\,\\text{C}$",
      "$240\\,\\text{C}$",
      "$60\\,\\text{C}$"
    ],
    "explanationEn": "$Q = It$, but $t$ must be in seconds: $2\\,\\text{min} = 120\\,\\text{s}$, so $Q = 0.5 \\times 120 = 60\\,\\text{C}$. $1\\,\\text{C}$ uses minutes directly — the one trap here, and the commonest slip: the formula is right but the unit conversion is missed. The other two divide where they should multiply.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "phy_rep_0021",
    "type": "mc",
    "subject": "physics",
    "topic": "electricity",
    "topicZh": "電學",
    "topicEn": "Electricity",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "一條導線中通過 $3\\,\\text{A}$ 的穩定電流，歷時 $5\\,\\text{min}$。求通過的電荷量。",
    "explanation": "$Q = It$，但 $t$ 必須用秒：$5\\,\\text{min} = 300\\,\\text{s}$，故 $Q = 3 \\times 300 = 900\\,\\text{C}$。$15\\,\\text{C}$ 直接用了分鐘，是本題唯一的陷阱，亦是最多人中招的一項——公式本身答得對，單位換算漏了。其餘兩項把乘法誤作除法。",
    "options": [
      "$900\\,\\text{C}$",
      "$15\\,\\text{C}$",
      "$0.01\\,\\text{C}$",
      "$100\\,\\text{C}$"
    ],
    "correctIndex": 0,
    "marks": 1,
    "contentEn": "A steady current of $3\\,\\text{A}$ flows in a wire for $5\\,\\text{min}$. Find the charge that passes.",
    "optionsEn": [
      "$900\\,\\text{C}$",
      "$15\\,\\text{C}$",
      "$0.01\\,\\text{C}$",
      "$100\\,\\text{C}$"
    ],
    "explanationEn": "$Q = It$, but $t$ must be in seconds: $5\\,\\text{min} = 300\\,\\text{s}$, so $Q = 3 \\times 300 = 900\\,\\text{C}$. $15\\,\\text{C}$ uses minutes directly — the one trap here, and the commonest slip: the formula is right but the unit conversion is missed. The other two divide where they should multiply.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "phy_rep_0022",
    "type": "mc",
    "subject": "physics",
    "topic": "electricity",
    "topicZh": "電學",
    "topicEn": "Electricity",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "一條導線中通過 $1.5\\,\\text{A}$ 的穩定電流，歷時 $4\\,\\text{min}$。求通過的電荷量。",
    "explanation": "$Q = It$，但 $t$ 必須用秒：$4\\,\\text{min} = 240\\,\\text{s}$，故 $Q = 1.5 \\times 240 = 360\\,\\text{C}$。$6\\,\\text{C}$ 直接用了分鐘，是本題唯一的陷阱，亦是最多人中招的一項——公式本身答得對，單位換算漏了。其餘兩項把乘法誤作除法。",
    "options": [
      "$160\\,\\text{C}$",
      "$360\\,\\text{C}$",
      "$6\\,\\text{C}$",
      "$0.0063\\,\\text{C}$"
    ],
    "correctIndex": 1,
    "marks": 1,
    "contentEn": "A steady current of $1.5\\,\\text{A}$ flows in a wire for $4\\,\\text{min}$. Find the charge that passes.",
    "optionsEn": [
      "$160\\,\\text{C}$",
      "$360\\,\\text{C}$",
      "$6\\,\\text{C}$",
      "$0.0063\\,\\text{C}$"
    ],
    "explanationEn": "$Q = It$, but $t$ must be in seconds: $4\\,\\text{min} = 240\\,\\text{s}$, so $Q = 1.5 \\times 240 = 360\\,\\text{C}$. $6\\,\\text{C}$ uses minutes directly — the one trap here, and the commonest slip: the formula is right but the unit conversion is missed. The other two divide where they should multiply.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "phy_rep_0023",
    "type": "mc",
    "subject": "physics",
    "topic": "electricity",
    "topicZh": "電學",
    "topicEn": "Electricity",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "一條導線中通過 $0.2\\,\\text{A}$ 的穩定電流，歷時 $10\\,\\text{min}$。求通過的電荷量。",
    "explanation": "$Q = It$，但 $t$ 必須用秒：$10\\,\\text{min} = 600\\,\\text{s}$，故 $Q = 0.2 \\times 600 = 120\\,\\text{C}$。$2\\,\\text{C}$ 直接用了分鐘，是本題唯一的陷阱，亦是最多人中招的一項——公式本身答得對，單位換算漏了。其餘兩項把乘法誤作除法。",
    "options": [
      "$0.0003\\,\\text{C}$",
      "$3000\\,\\text{C}$",
      "$120\\,\\text{C}$",
      "$2\\,\\text{C}$"
    ],
    "correctIndex": 2,
    "marks": 1,
    "contentEn": "A steady current of $0.2\\,\\text{A}$ flows in a wire for $10\\,\\text{min}$. Find the charge that passes.",
    "optionsEn": [
      "$0.0003\\,\\text{C}$",
      "$3000\\,\\text{C}$",
      "$120\\,\\text{C}$",
      "$2\\,\\text{C}$"
    ],
    "explanationEn": "$Q = It$, but $t$ must be in seconds: $10\\,\\text{min} = 600\\,\\text{s}$, so $Q = 0.2 \\times 600 = 120\\,\\text{C}$. $2\\,\\text{C}$ uses minutes directly — the one trap here, and the commonest slip: the formula is right but the unit conversion is missed. The other two divide where they should multiply.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "phy_rep_0024",
    "type": "mc",
    "subject": "physics",
    "topic": "electricity",
    "topicZh": "電學",
    "topicEn": "Electricity",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "一條導線中通過 $4\\,\\text{A}$ 的穩定電流，歷時 $3\\,\\text{min}$。求通過的電荷量。",
    "explanation": "$Q = It$，但 $t$ 必須用秒：$3\\,\\text{min} = 180\\,\\text{s}$，故 $Q = 4 \\times 180 = 720\\,\\text{C}$。$12\\,\\text{C}$ 直接用了分鐘，是本題唯一的陷阱，亦是最多人中招的一項——公式本身答得對，單位換算漏了。其餘兩項把乘法誤作除法。",
    "options": [
      "$12\\,\\text{C}$",
      "$0.0222\\,\\text{C}$",
      "$45\\,\\text{C}$",
      "$720\\,\\text{C}$"
    ],
    "correctIndex": 3,
    "marks": 1,
    "contentEn": "A steady current of $4\\,\\text{A}$ flows in a wire for $3\\,\\text{min}$. Find the charge that passes.",
    "optionsEn": [
      "$12\\,\\text{C}$",
      "$0.0222\\,\\text{C}$",
      "$45\\,\\text{C}$",
      "$720\\,\\text{C}$"
    ],
    "explanationEn": "$Q = It$, but $t$ must be in seconds: $3\\,\\text{min} = 180\\,\\text{s}$, so $Q = 4 \\times 180 = 720\\,\\text{C}$. $12\\,\\text{C}$ uses minutes directly — the one trap here, and the commonest slip: the formula is right but the unit conversion is missed. The other two divide where they should multiply.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "phy_rep_0025",
    "type": "mc",
    "subject": "physics",
    "topic": "electricity",
    "topicZh": "電學",
    "topicEn": "Electricity",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "某電器在 $220\\,\\text{V}$ 下工作，通過的電流為 $2\\,\\text{A}$。求它的電功率。",
    "explanation": "電功率 $P = VI = 220 \\times 2 = 440\\,\\text{W}$。功率是每秒轉換的能量，計算時不涉及時間；答案的單位必須是瓦特。",
    "options": [
      "$440\\,\\text{W}$",
      "$110\\,\\text{W}$",
      "$222\\,\\text{W}$",
      "$26400\\,\\text{W}$"
    ],
    "correctIndex": 0,
    "marks": 1,
    "contentEn": "An appliance operates at $220\\,\\text{V}$ and draws $2\\,\\text{A}$. Find its power.",
    "optionsEn": [
      "$440\\,\\text{W}$",
      "$110\\,\\text{W}$",
      "$222\\,\\text{W}$",
      "$26400\\,\\text{W}$"
    ],
    "explanationEn": "Electrical power is $P = VI = 220 \\times 2 = 440\\,\\text{W}$. Power is energy per second, so no time enters the calculation, and the answer must be in watts.",
    "frameworkEn": "Auto-gated",
    "optionNotes": [
      {
        "optionId": 0,
        "zh": "正確。$P = VI = 220 \\times 2 = 440\\,\\text{W}$。",
        "en": "Correct. $P = VI = 220 \\times 2 = 440\\,\\text{W}$."
      },
      {
        "optionId": 1,
        "zh": "$\\dfrac{V}{I} = \\dfrac{220}{2} = 110$ 是電器的電阻（單位為 $\\Omega$），不是功率。",
        "en": "$\\dfrac{V}{I} = \\dfrac{220}{2} = 110$ is the appliance's resistance (in $\\Omega$), not its power."
      },
      {
        "optionId": 2,
        "zh": "$220 + 2 = 222$ 把電壓與電流相加；兩者單位不同，不能相加。",
        "en": "$220 + 2 = 222$ adds voltage and current; quantities with different units cannot be added."
      },
      {
        "optionId": 3,
        "zh": "$VI \\times 60 = 26400$ 多乘了 $60$ 秒，得出的是一分鐘內轉換的能量（焦耳），不是功率。功率是每秒轉換的能量。",
        "en": "$VI \\times 60 = 26400$ multiplies by $60$ seconds, giving the energy converted in one minute (in joules), not the power. Power is energy per second."
      }
    ]
  },
  {
    "id": "phy_rep_0026",
    "type": "mc",
    "subject": "physics",
    "topic": "electricity",
    "topicZh": "電學",
    "topicEn": "Electricity",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "某電器在 $12\\,\\text{V}$ 下工作，通過的電流為 $3\\,\\text{A}$。求它的電功率。",
    "explanation": "電功率 $P = VI = 12 \\times 3 = 36\\,\\text{W}$。功率是每秒轉換的能量，計算時不涉及時間；答案的單位必須是瓦特。",
    "options": [
      "$2160\\,\\text{W}$",
      "$36\\,\\text{W}$",
      "$4\\,\\text{W}$",
      "$15\\,\\text{W}$"
    ],
    "correctIndex": 1,
    "marks": 1,
    "contentEn": "An appliance operates at $12\\,\\text{V}$ and draws $3\\,\\text{A}$. Find its power.",
    "optionsEn": [
      "$2160\\,\\text{W}$",
      "$36\\,\\text{W}$",
      "$4\\,\\text{W}$",
      "$15\\,\\text{W}$"
    ],
    "explanationEn": "Electrical power is $P = VI = 12 \\times 3 = 36\\,\\text{W}$. Power is energy per second, so no time enters the calculation, and the answer must be in watts.",
    "frameworkEn": "Auto-gated",
    "optionNotes": [
      {
        "optionId": 0,
        "zh": "$VI \\times 60 = 2160$ 多乘了 $60$ 秒，得出的是一分鐘內轉換的能量（焦耳），不是功率。功率是每秒轉換的能量。",
        "en": "$VI \\times 60 = 2160$ multiplies by $60$ seconds, giving the energy converted in one minute (in joules), not the power. Power is energy per second."
      },
      {
        "optionId": 1,
        "zh": "正確。$P = VI = 12 \\times 3 = 36\\,\\text{W}$。",
        "en": "Correct. $P = VI = 12 \\times 3 = 36\\,\\text{W}$."
      },
      {
        "optionId": 2,
        "zh": "$\\dfrac{V}{I} = \\dfrac{12}{3} = 4$ 是電器的電阻（單位為 $\\Omega$），不是功率。",
        "en": "$\\dfrac{V}{I} = \\dfrac{12}{3} = 4$ is the appliance's resistance (in $\\Omega$), not its power."
      },
      {
        "optionId": 3,
        "zh": "$12 + 3 = 15$ 把電壓與電流相加；兩者單位不同，不能相加。",
        "en": "$12 + 3 = 15$ adds voltage and current; quantities with different units cannot be added."
      }
    ]
  },
  {
    "id": "phy_rep_0027",
    "type": "mc",
    "subject": "physics",
    "topic": "electricity",
    "topicZh": "電學",
    "topicEn": "Electricity",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "某電器在 $240\\,\\text{V}$ 下工作，通過的電流為 $5\\,\\text{A}$。求它的電功率。",
    "explanation": "電功率 $P = VI = 240 \\times 5 = 1200\\,\\text{W}$。功率是每秒轉換的能量，計算時不涉及時間；答案的單位必須是瓦特。",
    "options": [
      "$245\\,\\text{W}$",
      "$72000\\,\\text{W}$",
      "$1200\\,\\text{W}$",
      "$48\\,\\text{W}$"
    ],
    "correctIndex": 2,
    "marks": 1,
    "contentEn": "An appliance operates at $240\\,\\text{V}$ and draws $5\\,\\text{A}$. Find its power.",
    "optionsEn": [
      "$245\\,\\text{W}$",
      "$72000\\,\\text{W}$",
      "$1200\\,\\text{W}$",
      "$48\\,\\text{W}$"
    ],
    "explanationEn": "Electrical power is $P = VI = 240 \\times 5 = 1200\\,\\text{W}$. Power is energy per second, so no time enters the calculation, and the answer must be in watts.",
    "frameworkEn": "Auto-gated",
    "optionNotes": [
      {
        "optionId": 0,
        "zh": "$240 + 5 = 245$ 把電壓與電流相加；兩者單位不同，不能相加。",
        "en": "$240 + 5 = 245$ adds voltage and current; quantities with different units cannot be added."
      },
      {
        "optionId": 1,
        "zh": "$VI \\times 60 = 72000$ 多乘了 $60$ 秒，得出的是一分鐘內轉換的能量（焦耳），不是功率。功率是每秒轉換的能量。",
        "en": "$VI \\times 60 = 72000$ multiplies by $60$ seconds, giving the energy converted in one minute (in joules), not the power. Power is energy per second."
      },
      {
        "optionId": 2,
        "zh": "正確。$P = VI = 240 \\times 5 = 1200\\,\\text{W}$。",
        "en": "Correct. $P = VI = 240 \\times 5 = 1200\\,\\text{W}$."
      },
      {
        "optionId": 3,
        "zh": "$\\dfrac{V}{I} = \\dfrac{240}{5} = 48$ 是電器的電阻（單位為 $\\Omega$），不是功率。",
        "en": "$\\dfrac{V}{I} = \\dfrac{240}{5} = 48$ is the appliance's resistance (in $\\Omega$), not its power."
      }
    ]
  },
  {
    "id": "phy_rep_0028",
    "type": "mc",
    "subject": "physics",
    "topic": "electricity",
    "topicZh": "電學",
    "topicEn": "Electricity",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "某電器在 $6\\,\\text{V}$ 下工作，通過的電流為 $0.5\\,\\text{A}$。求它的電功率。",
    "explanation": "電功率 $P = VI = 6 \\times 0.5 = 3\\,\\text{W}$。功率是每秒轉換的能量，計算時不涉及時間；答案的單位必須是瓦特。",
    "options": [
      "$12\\,\\text{W}$",
      "$6.5\\,\\text{W}$",
      "$180\\,\\text{W}$",
      "$3\\,\\text{W}$"
    ],
    "correctIndex": 3,
    "marks": 1,
    "contentEn": "An appliance operates at $6\\,\\text{V}$ and draws $0.5\\,\\text{A}$. Find its power.",
    "optionsEn": [
      "$12\\,\\text{W}$",
      "$6.5\\,\\text{W}$",
      "$180\\,\\text{W}$",
      "$3\\,\\text{W}$"
    ],
    "explanationEn": "Electrical power is $P = VI = 6 \\times 0.5 = 3\\,\\text{W}$. Power is energy per second, so no time enters the calculation, and the answer must be in watts.",
    "frameworkEn": "Auto-gated",
    "optionNotes": [
      {
        "optionId": 0,
        "zh": "$\\dfrac{V}{I} = \\dfrac{6}{0.5} = 12$ 是電器的電阻（單位為 $\\Omega$），不是功率。",
        "en": "$\\dfrac{V}{I} = \\dfrac{6}{0.5} = 12$ is the appliance's resistance (in $\\Omega$), not its power."
      },
      {
        "optionId": 1,
        "zh": "$6 + 0.5 = 6.5$ 把電壓與電流相加；兩者單位不同，不能相加。",
        "en": "$6 + 0.5 = 6.5$ adds voltage and current; quantities with different units cannot be added."
      },
      {
        "optionId": 2,
        "zh": "$VI \\times 60 = 180$ 多乘了 $60$ 秒，得出的是一分鐘內轉換的能量（焦耳），不是功率。功率是每秒轉換的能量。",
        "en": "$VI \\times 60 = 180$ multiplies by $60$ seconds, giving the energy converted in one minute (in joules), not the power. Power is energy per second."
      },
      {
        "optionId": 3,
        "zh": "正確。$P = VI = 6 \\times 0.5 = 3\\,\\text{W}$。",
        "en": "Correct. $P = VI = 6 \\times 0.5 = 3\\,\\text{W}$."
      }
    ]
  },
  {
    "id": "phy_rep_0029",
    "type": "mc",
    "subject": "physics",
    "topic": "electricity",
    "topicZh": "電學",
    "topicEn": "Electricity",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "某電器在 $110\\,\\text{V}$ 下工作，通過的電流為 $4\\,\\text{A}$。求它的電功率。",
    "explanation": "電功率 $P = VI = 110 \\times 4 = 440\\,\\text{W}$。功率是每秒轉換的能量，計算時不涉及時間；答案的單位必須是瓦特。",
    "options": [
      "$440\\,\\text{W}$",
      "$27.5\\,\\text{W}$",
      "$114\\,\\text{W}$",
      "$26400\\,\\text{W}$"
    ],
    "correctIndex": 0,
    "marks": 1,
    "contentEn": "An appliance operates at $110\\,\\text{V}$ and draws $4\\,\\text{A}$. Find its power.",
    "optionsEn": [
      "$440\\,\\text{W}$",
      "$27.5\\,\\text{W}$",
      "$114\\,\\text{W}$",
      "$26400\\,\\text{W}$"
    ],
    "explanationEn": "Electrical power is $P = VI = 110 \\times 4 = 440\\,\\text{W}$. Power is energy per second, so no time enters the calculation, and the answer must be in watts.",
    "frameworkEn": "Auto-gated",
    "optionNotes": [
      {
        "optionId": 0,
        "zh": "正確。$P = VI = 110 \\times 4 = 440\\,\\text{W}$。",
        "en": "Correct. $P = VI = 110 \\times 4 = 440\\,\\text{W}$."
      },
      {
        "optionId": 1,
        "zh": "$\\dfrac{V}{I} = \\dfrac{110}{4} = 27.5$ 是電器的電阻（單位為 $\\Omega$），不是功率。",
        "en": "$\\dfrac{V}{I} = \\dfrac{110}{4} = 27.5$ is the appliance's resistance (in $\\Omega$), not its power."
      },
      {
        "optionId": 2,
        "zh": "$110 + 4 = 114$ 把電壓與電流相加；兩者單位不同，不能相加。",
        "en": "$110 + 4 = 114$ adds voltage and current; quantities with different units cannot be added."
      },
      {
        "optionId": 3,
        "zh": "$VI \\times 60 = 26400$ 多乘了 $60$ 秒，得出的是一分鐘內轉換的能量（焦耳），不是功率。功率是每秒轉換的能量。",
        "en": "$VI \\times 60 = 26400$ multiplies by $60$ seconds, giving the energy converted in one minute (in joules), not the power. Power is energy per second."
      }
    ]
  },
  {
    "id": "phy_rep_0030",
    "type": "mc",
    "subject": "physics",
    "topic": "electricity",
    "topicZh": "電學",
    "topicEn": "Electricity",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "某電器在 $24\\,\\text{V}$ 下工作，通過的電流為 $1.5\\,\\text{A}$。求它的電功率。",
    "explanation": "電功率 $P = VI = 24 \\times 1.5 = 36\\,\\text{W}$。功率是每秒轉換的能量，計算時不涉及時間；答案的單位必須是瓦特。",
    "options": [
      "$2160\\,\\text{W}$",
      "$36\\,\\text{W}$",
      "$16\\,\\text{W}$",
      "$25.5\\,\\text{W}$"
    ],
    "correctIndex": 1,
    "marks": 1,
    "contentEn": "An appliance operates at $24\\,\\text{V}$ and draws $1.5\\,\\text{A}$. Find its power.",
    "optionsEn": [
      "$2160\\,\\text{W}$",
      "$36\\,\\text{W}$",
      "$16\\,\\text{W}$",
      "$25.5\\,\\text{W}$"
    ],
    "explanationEn": "Electrical power is $P = VI = 24 \\times 1.5 = 36\\,\\text{W}$. Power is energy per second, so no time enters the calculation, and the answer must be in watts.",
    "frameworkEn": "Auto-gated",
    "optionNotes": [
      {
        "optionId": 0,
        "zh": "$VI \\times 60 = 2160$ 多乘了 $60$ 秒，得出的是一分鐘內轉換的能量（焦耳），不是功率。功率是每秒轉換的能量。",
        "en": "$VI \\times 60 = 2160$ multiplies by $60$ seconds, giving the energy converted in one minute (in joules), not the power. Power is energy per second."
      },
      {
        "optionId": 1,
        "zh": "正確。$P = VI = 24 \\times 1.5 = 36\\,\\text{W}$。",
        "en": "Correct. $P = VI = 24 \\times 1.5 = 36\\,\\text{W}$."
      },
      {
        "optionId": 2,
        "zh": "$\\dfrac{V}{I} = \\dfrac{24}{1.5} = 16$ 是電器的電阻（單位為 $\\Omega$），不是功率。",
        "en": "$\\dfrac{V}{I} = \\dfrac{24}{1.5} = 16$ is the appliance's resistance (in $\\Omega$), not its power."
      },
      {
        "optionId": 3,
        "zh": "$24 + 1.5 = 25.5$ 把電壓與電流相加；兩者單位不同，不能相加。",
        "en": "$24 + 1.5 = 25.5$ adds voltage and current; quantities with different units cannot be added."
      }
    ]
  },
  {
    "id": "phy_rep_0031",
    "type": "mc",
    "subject": "physics",
    "topic": "electricity",
    "topicZh": "電學",
    "topicEn": "Electricity",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "一件 $1000\\,\\text{W}$ 的電器接在 $220\\,\\text{V}$ 的家庭電源上。可選的保險絲額定值為 $3\\,\\text{A}$、$5\\,\\text{A}$、$10\\,\\text{A}$、$13\\,\\text{A}$。應選哪一個？",
    "explanation": "先求正常工作電流：$I = \\dfrac{P}{V} = \\dfrac{1000}{220} \\approx 4.5455\\,\\text{A}$。保險絲的額定值要略高於這個電流：太低，電器一開就熔斷；太高，出現故障時未能及時切斷。可選的額定值中最合適的是 $5\\,\\text{A}$。",
    "options": [
      "$10\\,\\text{A}$",
      "$100\\,\\text{A}$",
      "$5\\,\\text{A}$",
      "$3\\,\\text{A}$"
    ],
    "correctIndex": 2,
    "marks": 1,
    "contentEn": "A $1000\\,\\text{W}$ appliance runs from a $220\\,\\text{V}$ mains supply. Fuses of $3\\,\\text{A}$, $5\\,\\text{A}$, $10\\,\\text{A}$ and $13\\,\\text{A}$ are available. Which should be fitted?",
    "optionsEn": [
      "$10\\,\\text{A}$",
      "$100\\,\\text{A}$",
      "$5\\,\\text{A}$",
      "$3\\,\\text{A}$"
    ],
    "explanationEn": "First find the working current: $I = \\dfrac{P}{V} = \\dfrac{1000}{220} \\approx 4.5455\\,\\text{A}$. The fuse rating should be just above it: too low and it blows when the appliance starts; too high and it does not cut off quickly in a fault. The best of the available ratings is $5\\,\\text{A}$.",
    "frameworkEn": "Auto-gated",
    "optionNotes": [
      {
        "optionId": 0,
        "zh": "$10\\,\\text{A}$ 不會熔斷，但比所需高；出現故障時，電流要升到很高才會切斷，保護作用減弱。",
        "en": "$10\\,\\text{A}$ would not blow, but it is higher than needed; in a fault the current must rise much further before it cuts off, so it protects less."
      },
      {
        "optionId": 1,
        "zh": "$\\dfrac{1000}{10} = 100$ 把功率除以 $10$，與電壓無關；電流應是 $\\dfrac{P}{V}$。",
        "en": "$\\dfrac{1000}{10} = 100$ divides the power by $10$, which has nothing to do with the voltage; the current is $\\dfrac{P}{V}$."
      },
      {
        "optionId": 2,
        "zh": "正確。正常工作電流 $I = \\dfrac{P}{V} = \\dfrac{1000}{220} \\approx 4.5455\\,\\text{A}$，額定值要略高於此值，可選的額定值中最接近的是 $5\\,\\text{A}$。",
        "en": "Correct. The working current is $I = \\dfrac{P}{V} = \\dfrac{1000}{220} \\approx 4.5455\\,\\text{A}$; the fuse rating should be just above it, and the closest available is $5\\,\\text{A}$."
      },
      {
        "optionId": 3,
        "zh": "$3\\,\\text{A}$ 低於正常工作電流 $4.5455\\,\\text{A}$，電器一開保險絲就會熔斷。",
        "en": "$3\\,\\text{A}$ is below the working current of $4.5455\\,\\text{A}$, so the fuse would blow as soon as the appliance is switched on."
      }
    ]
  },
  {
    "id": "phy_rep_0032",
    "type": "mc",
    "subject": "physics",
    "topic": "electricity",
    "topicZh": "電學",
    "topicEn": "Electricity",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "一件 $800\\,\\text{W}$ 的電器接在 $220\\,\\text{V}$ 的家庭電源上。可選的保險絲額定值為 $3\\,\\text{A}$、$5\\,\\text{A}$、$10\\,\\text{A}$、$13\\,\\text{A}$。應選哪一個？",
    "explanation": "先求正常工作電流：$I = \\dfrac{P}{V} = \\dfrac{800}{220} \\approx 3.6364\\,\\text{A}$。保險絲的額定值要略高於這個電流：太低，電器一開就熔斷；太高，出現故障時未能及時切斷。可選的額定值中最合適的是 $5\\,\\text{A}$。",
    "options": [
      "$3\\,\\text{A}$",
      "$10\\,\\text{A}$",
      "$80\\,\\text{A}$",
      "$5\\,\\text{A}$"
    ],
    "correctIndex": 3,
    "marks": 1,
    "contentEn": "A $800\\,\\text{W}$ appliance runs from a $220\\,\\text{V}$ mains supply. Fuses of $3\\,\\text{A}$, $5\\,\\text{A}$, $10\\,\\text{A}$ and $13\\,\\text{A}$ are available. Which should be fitted?",
    "optionsEn": [
      "$3\\,\\text{A}$",
      "$10\\,\\text{A}$",
      "$80\\,\\text{A}$",
      "$5\\,\\text{A}$"
    ],
    "explanationEn": "First find the working current: $I = \\dfrac{P}{V} = \\dfrac{800}{220} \\approx 3.6364\\,\\text{A}$. The fuse rating should be just above it: too low and it blows when the appliance starts; too high and it does not cut off quickly in a fault. The best of the available ratings is $5\\,\\text{A}$.",
    "frameworkEn": "Auto-gated",
    "optionNotes": [
      {
        "optionId": 0,
        "zh": "$3\\,\\text{A}$ 低於正常工作電流 $3.6364\\,\\text{A}$，電器一開保險絲就會熔斷。",
        "en": "$3\\,\\text{A}$ is below the working current of $3.6364\\,\\text{A}$, so the fuse would blow as soon as the appliance is switched on."
      },
      {
        "optionId": 1,
        "zh": "$10\\,\\text{A}$ 不會熔斷，但比所需高；出現故障時，電流要升到很高才會切斷，保護作用減弱。",
        "en": "$10\\,\\text{A}$ would not blow, but it is higher than needed; in a fault the current must rise much further before it cuts off, so it protects less."
      },
      {
        "optionId": 2,
        "zh": "$\\dfrac{800}{10} = 80$ 把功率除以 $10$，與電壓無關；電流應是 $\\dfrac{P}{V}$。",
        "en": "$\\dfrac{800}{10} = 80$ divides the power by $10$, which has nothing to do with the voltage; the current is $\\dfrac{P}{V}$."
      },
      {
        "optionId": 3,
        "zh": "正確。正常工作電流 $I = \\dfrac{P}{V} = \\dfrac{800}{220} \\approx 3.6364\\,\\text{A}$，額定值要略高於此值，可選的額定值中最接近的是 $5\\,\\text{A}$。",
        "en": "Correct. The working current is $I = \\dfrac{P}{V} = \\dfrac{800}{220} \\approx 3.6364\\,\\text{A}$; the fuse rating should be just above it, and the closest available is $5\\,\\text{A}$."
      }
    ]
  },
  {
    "id": "phy_rep_0033",
    "type": "mc",
    "subject": "physics",
    "topic": "electricity",
    "topicZh": "電學",
    "topicEn": "Electricity",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "一件 $2000\\,\\text{W}$ 的電器接在 $220\\,\\text{V}$ 的家庭電源上。可選的保險絲額定值為 $3\\,\\text{A}$、$5\\,\\text{A}$、$10\\,\\text{A}$、$13\\,\\text{A}$。應選哪一個？",
    "explanation": "先求正常工作電流：$I = \\dfrac{P}{V} = \\dfrac{2000}{220} \\approx 9.0909\\,\\text{A}$。保險絲的額定值要略高於這個電流：太低，電器一開就熔斷；太高，出現故障時未能及時切斷。可選的額定值中最合適的是 $10\\,\\text{A}$。",
    "options": [
      "$10\\,\\text{A}$",
      "$5\\,\\text{A}$",
      "$13\\,\\text{A}$",
      "$200\\,\\text{A}$"
    ],
    "correctIndex": 0,
    "marks": 1,
    "contentEn": "A $2000\\,\\text{W}$ appliance runs from a $220\\,\\text{V}$ mains supply. Fuses of $3\\,\\text{A}$, $5\\,\\text{A}$, $10\\,\\text{A}$ and $13\\,\\text{A}$ are available. Which should be fitted?",
    "optionsEn": [
      "$10\\,\\text{A}$",
      "$5\\,\\text{A}$",
      "$13\\,\\text{A}$",
      "$200\\,\\text{A}$"
    ],
    "explanationEn": "First find the working current: $I = \\dfrac{P}{V} = \\dfrac{2000}{220} \\approx 9.0909\\,\\text{A}$. The fuse rating should be just above it: too low and it blows when the appliance starts; too high and it does not cut off quickly in a fault. The best of the available ratings is $10\\,\\text{A}$.",
    "frameworkEn": "Auto-gated",
    "optionNotes": [
      {
        "optionId": 0,
        "zh": "正確。正常工作電流 $I = \\dfrac{P}{V} = \\dfrac{2000}{220} \\approx 9.0909\\,\\text{A}$，額定值要略高於此值，可選的額定值中最接近的是 $10\\,\\text{A}$。",
        "en": "Correct. The working current is $I = \\dfrac{P}{V} = \\dfrac{2000}{220} \\approx 9.0909\\,\\text{A}$; the fuse rating should be just above it, and the closest available is $10\\,\\text{A}$."
      },
      {
        "optionId": 1,
        "zh": "$5\\,\\text{A}$ 低於正常工作電流 $9.0909\\,\\text{A}$，電器一開保險絲就會熔斷。",
        "en": "$5\\,\\text{A}$ is below the working current of $9.0909\\,\\text{A}$, so the fuse would blow as soon as the appliance is switched on."
      },
      {
        "optionId": 2,
        "zh": "$13\\,\\text{A}$ 不會熔斷，但比所需高；出現故障時，電流要升到很高才會切斷，保護作用減弱。",
        "en": "$13\\,\\text{A}$ would not blow, but it is higher than needed; in a fault the current must rise much further before it cuts off, so it protects less."
      },
      {
        "optionId": 3,
        "zh": "$\\dfrac{2000}{10} = 200$ 把功率除以 $10$，與電壓無關；電流應是 $\\dfrac{P}{V}$。",
        "en": "$\\dfrac{2000}{10} = 200$ divides the power by $10$, which has nothing to do with the voltage; the current is $\\dfrac{P}{V}$."
      }
    ]
  },
  {
    "id": "phy_rep_0034",
    "type": "mc",
    "subject": "physics",
    "topic": "electricity",
    "topicZh": "電學",
    "topicEn": "Electricity",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "一件 $1500\\,\\text{W}$ 的電器接在 $240\\,\\text{V}$ 的家庭電源上。可選的保險絲額定值為 $3\\,\\text{A}$、$5\\,\\text{A}$、$10\\,\\text{A}$、$13\\,\\text{A}$。應選哪一個？",
    "explanation": "先求正常工作電流：$I = \\dfrac{P}{V} = \\dfrac{1500}{240} = 6.25\\,\\text{A}$。保險絲的額定值要略高於這個電流：太低，電器一開就熔斷；太高，出現故障時未能及時切斷。可選的額定值中最合適的是 $10\\,\\text{A}$。",
    "options": [
      "$150\\,\\text{A}$",
      "$10\\,\\text{A}$",
      "$5\\,\\text{A}$",
      "$13\\,\\text{A}$"
    ],
    "correctIndex": 1,
    "marks": 1,
    "contentEn": "A $1500\\,\\text{W}$ appliance runs from a $240\\,\\text{V}$ mains supply. Fuses of $3\\,\\text{A}$, $5\\,\\text{A}$, $10\\,\\text{A}$ and $13\\,\\text{A}$ are available. Which should be fitted?",
    "optionsEn": [
      "$150\\,\\text{A}$",
      "$10\\,\\text{A}$",
      "$5\\,\\text{A}$",
      "$13\\,\\text{A}$"
    ],
    "explanationEn": "First find the working current: $I = \\dfrac{P}{V} = \\dfrac{1500}{240} = 6.25\\,\\text{A}$. The fuse rating should be just above it: too low and it blows when the appliance starts; too high and it does not cut off quickly in a fault. The best of the available ratings is $10\\,\\text{A}$.",
    "frameworkEn": "Auto-gated",
    "optionNotes": [
      {
        "optionId": 0,
        "zh": "$\\dfrac{1500}{10} = 150$ 把功率除以 $10$，與電壓無關；電流應是 $\\dfrac{P}{V}$。",
        "en": "$\\dfrac{1500}{10} = 150$ divides the power by $10$, which has nothing to do with the voltage; the current is $\\dfrac{P}{V}$."
      },
      {
        "optionId": 1,
        "zh": "正確。正常工作電流 $I = \\dfrac{P}{V} = \\dfrac{1500}{240} = 6.25\\,\\text{A}$，額定值要略高於此值，可選的額定值中最接近的是 $10\\,\\text{A}$。",
        "en": "Correct. The working current is $I = \\dfrac{P}{V} = \\dfrac{1500}{240} = 6.25\\,\\text{A}$; the fuse rating should be just above it, and the closest available is $10\\,\\text{A}$."
      },
      {
        "optionId": 2,
        "zh": "$5\\,\\text{A}$ 低於正常工作電流 $6.25\\,\\text{A}$，電器一開保險絲就會熔斷。",
        "en": "$5\\,\\text{A}$ is below the working current of $6.25\\,\\text{A}$, so the fuse would blow as soon as the appliance is switched on."
      },
      {
        "optionId": 3,
        "zh": "$13\\,\\text{A}$ 不會熔斷，但比所需高；出現故障時，電流要升到很高才會切斷，保護作用減弱。",
        "en": "$13\\,\\text{A}$ would not blow, but it is higher than needed; in a fault the current must rise much further before it cuts off, so it protects less."
      }
    ]
  },
  {
    "id": "phy_rep_0035",
    "type": "mc",
    "subject": "physics",
    "topic": "electricity",
    "topicZh": "電學",
    "topicEn": "Electricity",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "一件 $1200\\,\\text{W}$ 的電器接在 $240\\,\\text{V}$ 的家庭電源上。可選的保險絲額定值為 $3\\,\\text{A}$、$5\\,\\text{A}$、$10\\,\\text{A}$、$13\\,\\text{A}$。應選哪一個？",
    "explanation": "先求正常工作電流：$I = \\dfrac{P}{V} = \\dfrac{1200}{240} = 5\\,\\text{A}$。保險絲的額定值要略高於這個電流：太低，電器一開就熔斷；太高，出現故障時未能及時切斷。可選的額定值中最合適的是 $10\\,\\text{A}$。",
    "options": [
      "$13\\,\\text{A}$",
      "$120\\,\\text{A}$",
      "$10\\,\\text{A}$",
      "$3\\,\\text{A}$"
    ],
    "correctIndex": 2,
    "marks": 1,
    "contentEn": "A $1200\\,\\text{W}$ appliance runs from a $240\\,\\text{V}$ mains supply. Fuses of $3\\,\\text{A}$, $5\\,\\text{A}$, $10\\,\\text{A}$ and $13\\,\\text{A}$ are available. Which should be fitted?",
    "optionsEn": [
      "$13\\,\\text{A}$",
      "$120\\,\\text{A}$",
      "$10\\,\\text{A}$",
      "$3\\,\\text{A}$"
    ],
    "explanationEn": "First find the working current: $I = \\dfrac{P}{V} = \\dfrac{1200}{240} = 5\\,\\text{A}$. The fuse rating should be just above it: too low and it blows when the appliance starts; too high and it does not cut off quickly in a fault. The best of the available ratings is $10\\,\\text{A}$.",
    "frameworkEn": "Auto-gated",
    "optionNotes": [
      {
        "optionId": 0,
        "zh": "$13\\,\\text{A}$ 不會熔斷，但比所需高；出現故障時，電流要升到很高才會切斷，保護作用減弱。",
        "en": "$13\\,\\text{A}$ would not blow, but it is higher than needed; in a fault the current must rise much further before it cuts off, so it protects less."
      },
      {
        "optionId": 1,
        "zh": "$\\dfrac{1200}{10} = 120$ 把功率除以 $10$，與電壓無關；電流應是 $\\dfrac{P}{V}$。",
        "en": "$\\dfrac{1200}{10} = 120$ divides the power by $10$, which has nothing to do with the voltage; the current is $\\dfrac{P}{V}$."
      },
      {
        "optionId": 2,
        "zh": "正確。正常工作電流 $I = \\dfrac{P}{V} = \\dfrac{1200}{240} = 5\\,\\text{A}$，額定值要略高於此值，可選的額定值中最接近的是 $10\\,\\text{A}$。",
        "en": "Correct. The working current is $I = \\dfrac{P}{V} = \\dfrac{1200}{240} = 5\\,\\text{A}$; the fuse rating should be just above it, and the closest available is $10\\,\\text{A}$."
      },
      {
        "optionId": 3,
        "zh": "$3\\,\\text{A}$ 低於正常工作電流 $5\\,\\text{A}$，電器一開保險絲就會熔斷。",
        "en": "$3\\,\\text{A}$ is below the working current of $5\\,\\text{A}$, so the fuse would blow as soon as the appliance is switched on."
      }
    ]
  },
  {
    "id": "phy_rep_0036",
    "type": "mc",
    "subject": "physics",
    "topic": "electricity",
    "topicZh": "電學",
    "topicEn": "Electricity",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "一件 $900\\,\\text{W}$ 的電器接在 $220\\,\\text{V}$ 的家庭電源上。可選的保險絲額定值為 $3\\,\\text{A}$、$5\\,\\text{A}$、$10\\,\\text{A}$、$13\\,\\text{A}$。應選哪一個？",
    "explanation": "先求正常工作電流：$I = \\dfrac{P}{V} = \\dfrac{900}{220} \\approx 4.0909\\,\\text{A}$。保險絲的額定值要略高於這個電流：太低，電器一開就熔斷；太高，出現故障時未能及時切斷。可選的額定值中最合適的是 $5\\,\\text{A}$。",
    "options": [
      "$3\\,\\text{A}$",
      "$10\\,\\text{A}$",
      "$90\\,\\text{A}$",
      "$5\\,\\text{A}$"
    ],
    "correctIndex": 3,
    "marks": 1,
    "contentEn": "A $900\\,\\text{W}$ appliance runs from a $220\\,\\text{V}$ mains supply. Fuses of $3\\,\\text{A}$, $5\\,\\text{A}$, $10\\,\\text{A}$ and $13\\,\\text{A}$ are available. Which should be fitted?",
    "optionsEn": [
      "$3\\,\\text{A}$",
      "$10\\,\\text{A}$",
      "$90\\,\\text{A}$",
      "$5\\,\\text{A}$"
    ],
    "explanationEn": "First find the working current: $I = \\dfrac{P}{V} = \\dfrac{900}{220} \\approx 4.0909\\,\\text{A}$. The fuse rating should be just above it: too low and it blows when the appliance starts; too high and it does not cut off quickly in a fault. The best of the available ratings is $5\\,\\text{A}$.",
    "frameworkEn": "Auto-gated",
    "optionNotes": [
      {
        "optionId": 0,
        "zh": "$3\\,\\text{A}$ 低於正常工作電流 $4.0909\\,\\text{A}$，電器一開保險絲就會熔斷。",
        "en": "$3\\,\\text{A}$ is below the working current of $4.0909\\,\\text{A}$, so the fuse would blow as soon as the appliance is switched on."
      },
      {
        "optionId": 1,
        "zh": "$10\\,\\text{A}$ 不會熔斷，但比所需高；出現故障時，電流要升到很高才會切斷，保護作用減弱。",
        "en": "$10\\,\\text{A}$ would not blow, but it is higher than needed; in a fault the current must rise much further before it cuts off, so it protects less."
      },
      {
        "optionId": 2,
        "zh": "$\\dfrac{900}{10} = 90$ 把功率除以 $10$，與電壓無關；電流應是 $\\dfrac{P}{V}$。",
        "en": "$\\dfrac{900}{10} = 90$ divides the power by $10$, which has nothing to do with the voltage; the current is $\\dfrac{P}{V}$."
      },
      {
        "optionId": 3,
        "zh": "正確。正常工作電流 $I = \\dfrac{P}{V} = \\dfrac{900}{220} \\approx 4.0909\\,\\text{A}$，額定值要略高於此值，可選的額定值中最接近的是 $5\\,\\text{A}$。",
        "en": "Correct. The working current is $I = \\dfrac{P}{V} = \\dfrac{900}{220} \\approx 4.0909\\,\\text{A}$; the fuse rating should be just above it, and the closest available is $5\\,\\text{A}$."
      }
    ]
  },
  {
    "id": "phy_rep_0037",
    "type": "mc",
    "subject": "physics",
    "topic": "electricity",
    "topicZh": "電學",
    "topicEn": "Electricity",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "兩個電阻 $4\\,\\Omega$ 與 $6\\,\\Omega$ 並聯後接上 $12\\,\\text{V}$ 電源。$4\\,\\Omega$ 那一支的兩端電壓是多少？",
    "explanation": "並聯的每一支都直接跨在電源的兩極之間，所以每一支的電壓都等於電源電壓 $12\\,\\text{V}$，與該支的電阻值無關。$4.8\\,\\text{V}$ 與 $7.2\\,\\text{V}$ 用了【分壓】公式，那是串聯的行為：串聯分電壓、並聯分電流，兩者剛好相反。$6\\,\\text{V}$ 假設了平均分配，但即使在串聯之下，兩個不同電阻也不會平分電壓。",
    "options": [
      "$12\\,\\text{V}$",
      "$4.8\\,\\text{V}$",
      "$6\\,\\text{V}$",
      "$7.2\\,\\text{V}$"
    ],
    "correctIndex": 0,
    "marks": 1,
    "contentEn": "Resistors of $4\\,\\Omega$ and $6\\,\\Omega$ are connected in parallel across a $12\\,\\text{V}$ supply. What is the p.d. across the $4\\,\\Omega$ branch?",
    "optionsEn": [
      "$12\\,\\text{V}$",
      "$4.8\\,\\text{V}$",
      "$6\\,\\text{V}$",
      "$7.2\\,\\text{V}$"
    ],
    "explanationEn": "Each parallel branch is connected directly across the supply terminals, so every branch has the full supply p.d. of $12\\,\\text{V}$, whatever its resistance. $4.8\\,\\text{V}$ and $7.2\\,\\text{V}$ apply the potential-divider formula, which describes a *series* circuit: series divides voltage, parallel divides current — exactly opposite. $6\\,\\text{V}$ assumes an even split, which would not hold for unequal resistors even in series.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "phy_rep_0038",
    "type": "mc",
    "subject": "physics",
    "topic": "electricity",
    "topicZh": "電學",
    "topicEn": "Electricity",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "兩個電阻 $8\\,\\Omega$ 與 $12\\,\\Omega$ 並聯後接上 $24\\,\\text{V}$ 電源。$8\\,\\Omega$ 那一支的兩端電壓是多少？",
    "explanation": "並聯的每一支都直接跨在電源的兩極之間，所以每一支的電壓都等於電源電壓 $24\\,\\text{V}$，與該支的電阻值無關。$9.6\\,\\text{V}$ 與 $14.4\\,\\text{V}$ 用了【分壓】公式，那是串聯的行為：串聯分電壓、並聯分電流，兩者剛好相反。$12\\,\\text{V}$ 假設了平均分配，但即使在串聯之下，兩個不同電阻也不會平分電壓。",
    "options": [
      "$14.4\\,\\text{V}$",
      "$24\\,\\text{V}$",
      "$9.6\\,\\text{V}$",
      "$12\\,\\text{V}$"
    ],
    "correctIndex": 1,
    "marks": 1,
    "contentEn": "Resistors of $8\\,\\Omega$ and $12\\,\\Omega$ are connected in parallel across a $24\\,\\text{V}$ supply. What is the p.d. across the $8\\,\\Omega$ branch?",
    "optionsEn": [
      "$14.4\\,\\text{V}$",
      "$24\\,\\text{V}$",
      "$9.6\\,\\text{V}$",
      "$12\\,\\text{V}$"
    ],
    "explanationEn": "Each parallel branch is connected directly across the supply terminals, so every branch has the full supply p.d. of $24\\,\\text{V}$, whatever its resistance. $9.6\\,\\text{V}$ and $14.4\\,\\text{V}$ apply the potential-divider formula, which describes a *series* circuit: series divides voltage, parallel divides current — exactly opposite. $12\\,\\text{V}$ assumes an even split, which would not hold for unequal resistors even in series.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "phy_rep_0039",
    "type": "mc",
    "subject": "physics",
    "topic": "electricity",
    "topicZh": "電學",
    "topicEn": "Electricity",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "兩個電阻 $2\\,\\Omega$ 與 $3\\,\\Omega$ 並聯後接上 $6\\,\\text{V}$ 電源。$2\\,\\Omega$ 那一支的兩端電壓是多少？",
    "explanation": "並聯的每一支都直接跨在電源的兩極之間，所以每一支的電壓都等於電源電壓 $6\\,\\text{V}$，與該支的電阻值無關。$2.4\\,\\text{V}$ 與 $3.6\\,\\text{V}$ 用了【分壓】公式，那是串聯的行為：串聯分電壓、並聯分電流，兩者剛好相反。$3\\,\\text{V}$ 假設了平均分配，但即使在串聯之下，兩個不同電阻也不會平分電壓。",
    "options": [
      "$3\\,\\text{V}$",
      "$3.6\\,\\text{V}$",
      "$6\\,\\text{V}$",
      "$2.4\\,\\text{V}$"
    ],
    "correctIndex": 2,
    "marks": 1,
    "contentEn": "Resistors of $2\\,\\Omega$ and $3\\,\\Omega$ are connected in parallel across a $6\\,\\text{V}$ supply. What is the p.d. across the $2\\,\\Omega$ branch?",
    "optionsEn": [
      "$3\\,\\text{V}$",
      "$3.6\\,\\text{V}$",
      "$6\\,\\text{V}$",
      "$2.4\\,\\text{V}$"
    ],
    "explanationEn": "Each parallel branch is connected directly across the supply terminals, so every branch has the full supply p.d. of $6\\,\\text{V}$, whatever its resistance. $2.4\\,\\text{V}$ and $3.6\\,\\text{V}$ apply the potential-divider formula, which describes a *series* circuit: series divides voltage, parallel divides current — exactly opposite. $3\\,\\text{V}$ assumes an even split, which would not hold for unequal resistors even in series.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "phy_rep_0040",
    "type": "mc",
    "subject": "physics",
    "topic": "electricity",
    "topicZh": "電學",
    "topicEn": "Electricity",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "兩個電阻 $6\\,\\Omega$ 與 $9\\,\\Omega$ 並聯後接上 $18\\,\\text{V}$ 電源。$6\\,\\Omega$ 那一支的兩端電壓是多少？",
    "explanation": "並聯的每一支都直接跨在電源的兩極之間，所以每一支的電壓都等於電源電壓 $18\\,\\text{V}$，與該支的電阻值無關。$7.2\\,\\text{V}$ 與 $10.8\\,\\text{V}$ 用了【分壓】公式，那是串聯的行為：串聯分電壓、並聯分電流，兩者剛好相反。$9\\,\\text{V}$ 假設了平均分配，但即使在串聯之下，兩個不同電阻也不會平分電壓。",
    "options": [
      "$7.2\\,\\text{V}$",
      "$9\\,\\text{V}$",
      "$10.8\\,\\text{V}$",
      "$18\\,\\text{V}$"
    ],
    "correctIndex": 3,
    "marks": 1,
    "contentEn": "Resistors of $6\\,\\Omega$ and $9\\,\\Omega$ are connected in parallel across a $18\\,\\text{V}$ supply. What is the p.d. across the $6\\,\\Omega$ branch?",
    "optionsEn": [
      "$7.2\\,\\text{V}$",
      "$9\\,\\text{V}$",
      "$10.8\\,\\text{V}$",
      "$18\\,\\text{V}$"
    ],
    "explanationEn": "Each parallel branch is connected directly across the supply terminals, so every branch has the full supply p.d. of $18\\,\\text{V}$, whatever its resistance. $7.2\\,\\text{V}$ and $10.8\\,\\text{V}$ apply the potential-divider formula, which describes a *series* circuit: series divides voltage, parallel divides current — exactly opposite. $9\\,\\text{V}$ assumes an even split, which would not hold for unequal resistors even in series.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "phy_rep_0041",
    "type": "mc",
    "subject": "physics",
    "topic": "electricity",
    "topicZh": "電學",
    "topicEn": "Electricity",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "兩個電阻 $10\\,\\Omega$ 與 $15\\,\\Omega$ 並聯後接上 $30\\,\\text{V}$ 電源。$10\\,\\Omega$ 那一支的兩端電壓是多少？",
    "explanation": "並聯的每一支都直接跨在電源的兩極之間，所以每一支的電壓都等於電源電壓 $30\\,\\text{V}$，與該支的電阻值無關。$12\\,\\text{V}$ 與 $18\\,\\text{V}$ 用了【分壓】公式，那是串聯的行為：串聯分電壓、並聯分電流，兩者剛好相反。$15\\,\\text{V}$ 假設了平均分配，但即使在串聯之下，兩個不同電阻也不會平分電壓。",
    "options": [
      "$30\\,\\text{V}$",
      "$12\\,\\text{V}$",
      "$15\\,\\text{V}$",
      "$18\\,\\text{V}$"
    ],
    "correctIndex": 0,
    "marks": 1,
    "contentEn": "Resistors of $10\\,\\Omega$ and $15\\,\\Omega$ are connected in parallel across a $30\\,\\text{V}$ supply. What is the p.d. across the $10\\,\\Omega$ branch?",
    "optionsEn": [
      "$30\\,\\text{V}$",
      "$12\\,\\text{V}$",
      "$15\\,\\text{V}$",
      "$18\\,\\text{V}$"
    ],
    "explanationEn": "Each parallel branch is connected directly across the supply terminals, so every branch has the full supply p.d. of $30\\,\\text{V}$, whatever its resistance. $12\\,\\text{V}$ and $18\\,\\text{V}$ apply the potential-divider formula, which describes a *series* circuit: series divides voltage, parallel divides current — exactly opposite. $15\\,\\text{V}$ assumes an even split, which would not hold for unequal resistors even in series.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "phy_rep_0042",
    "type": "mc",
    "subject": "physics",
    "topic": "electricity",
    "topicZh": "電學",
    "topicEn": "Electricity",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "兩個電阻 $3\\,\\Omega$ 與 $6\\,\\Omega$ 並聯後接上 $9\\,\\text{V}$ 電源。$3\\,\\Omega$ 那一支的兩端電壓是多少？",
    "explanation": "並聯的每一支都直接跨在電源的兩極之間，所以每一支的電壓都等於電源電壓 $9\\,\\text{V}$，與該支的電阻值無關。$3\\,\\text{V}$ 與 $6\\,\\text{V}$ 用了【分壓】公式，那是串聯的行為：串聯分電壓、並聯分電流，兩者剛好相反。$4.5\\,\\text{V}$ 假設了平均分配，但即使在串聯之下，兩個不同電阻也不會平分電壓。",
    "options": [
      "$6\\,\\text{V}$",
      "$9\\,\\text{V}$",
      "$3\\,\\text{V}$",
      "$4.5\\,\\text{V}$"
    ],
    "correctIndex": 1,
    "marks": 1,
    "contentEn": "Resistors of $3\\,\\Omega$ and $6\\,\\Omega$ are connected in parallel across a $9\\,\\text{V}$ supply. What is the p.d. across the $3\\,\\Omega$ branch?",
    "optionsEn": [
      "$6\\,\\text{V}$",
      "$9\\,\\text{V}$",
      "$3\\,\\text{V}$",
      "$4.5\\,\\text{V}$"
    ],
    "explanationEn": "Each parallel branch is connected directly across the supply terminals, so every branch has the full supply p.d. of $9\\,\\text{V}$, whatever its resistance. $3\\,\\text{V}$ and $6\\,\\text{V}$ apply the potential-divider formula, which describes a *series* circuit: series divides voltage, parallel divides current — exactly opposite. $4.5\\,\\text{V}$ assumes an even split, which would not hold for unequal resistors even in series.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "phy_rep_0043",
    "type": "mc",
    "subject": "physics",
    "topic": "electricity",
    "topicZh": "電學",
    "topicEn": "Electricity",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "一件 $1000\\,\\text{W}$ 的電器連續使用 $3\\,\\text{h}$。若每度電（$1\\,\\text{kW}\\,\\text{h}$）收費 $1.2$ 元，求電費。",
    "explanation": "先把功率化為千瓦：$1000\\,\\text{W} = 1\\,\\text{kW}$。耗電量 $= 1 \\times 3 = 3\\,\\text{kW}\\,\\text{h}$（即 $3$ 度電），電費 $= 3 \\times 1.2 = 3.6$ 元。",
    "options": [
      "$3$ 元",
      "$1.2$ 元",
      "$3.6$ 元",
      "$3600$ 元"
    ],
    "correctIndex": 2,
    "marks": 1,
    "contentEn": "A $1000\\,\\text{W}$ appliance runs for $3\\,\\text{h}$. At $1.2$ dollars per unit ($1\\,\\text{kW}\\,\\text{h}$), find the cost.",
    "optionsEn": [
      "$3$ dollars",
      "$1.2$ dollars",
      "$3.6$ dollars",
      "$3600$ dollars"
    ],
    "explanationEn": "Convert the power to kilowatts: $1000\\,\\text{W} = 1\\,\\text{kW}$. Energy used $= 1 \\times 3 = 3\\,\\text{kW}\\,\\text{h}$ ($3$ units), so the cost is $3 \\times 1.2 = 3.6$ dollars.",
    "frameworkEn": "Auto-gated",
    "optionNotes": [
      {
        "optionId": 0,
        "zh": "$3$ 是耗電量（$\\text{kW}\\,\\text{h}$），還要乘以每度電的收費 $1.2$ 元。",
        "en": "$3$ is the energy used (in $\\text{kW}\\,\\text{h}$); it still has to be multiplied by the price of $1.2$ dollars per unit."
      },
      {
        "optionId": 1,
        "zh": "$1 \\times 1.2 = 1.2$ 漏了使用時間 $3\\,\\text{h}$。",
        "en": "$1 \\times 1.2 = 1.2$ leaves out the time of $3\\,\\text{h}$."
      },
      {
        "optionId": 2,
        "zh": "正確。$1000\\,\\text{W} = 1\\,\\text{kW}$，耗電 $1 \\times 3 = 3\\,\\text{kW}\\,\\text{h}$，電費 $3 \\times 1.2 = 3.6$ 元。",
        "en": "Correct. $1000\\,\\text{W} = 1\\,\\text{kW}$, energy $1 \\times 3 = 3\\,\\text{kW}\\,\\text{h}$, cost $3 \\times 1.2 = 3.6$ dollars."
      },
      {
        "optionId": 3,
        "zh": "沒有把瓦特化為千瓦，數值大了一千倍：$1000 \\times 3 \\times 1.2 = 3600$。",
        "en": "The watts were not converted to kilowatts, so the value is a thousand times too big: $1000 \\times 3 \\times 1.2 = 3600$."
      }
    ]
  },
  {
    "id": "phy_rep_0044",
    "type": "mc",
    "subject": "physics",
    "topic": "electricity",
    "topicZh": "電學",
    "topicEn": "Electricity",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "一件 $500\\,\\text{W}$ 的電器連續使用 $4\\,\\text{h}$。若每度電（$1\\,\\text{kW}\\,\\text{h}$）收費 $1.2$ 元，求電費。",
    "explanation": "先把功率化為千瓦：$500\\,\\text{W} = 0.5\\,\\text{kW}$。耗電量 $= 0.5 \\times 4 = 2\\,\\text{kW}\\,\\text{h}$（即 $2$ 度電），電費 $= 2 \\times 1.2 = 2.4$ 元。",
    "options": [
      "$2400$ 元",
      "$2$ 元",
      "$0.6$ 元",
      "$2.4$ 元"
    ],
    "correctIndex": 3,
    "marks": 1,
    "contentEn": "A $500\\,\\text{W}$ appliance runs for $4\\,\\text{h}$. At $1.2$ dollars per unit ($1\\,\\text{kW}\\,\\text{h}$), find the cost.",
    "optionsEn": [
      "$2400$ dollars",
      "$2$ dollars",
      "$0.6$ dollars",
      "$2.4$ dollars"
    ],
    "explanationEn": "Convert the power to kilowatts: $500\\,\\text{W} = 0.5\\,\\text{kW}$. Energy used $= 0.5 \\times 4 = 2\\,\\text{kW}\\,\\text{h}$ ($2$ units), so the cost is $2 \\times 1.2 = 2.4$ dollars.",
    "frameworkEn": "Auto-gated",
    "optionNotes": [
      {
        "optionId": 0,
        "zh": "沒有把瓦特化為千瓦，數值大了一千倍：$500 \\times 4 \\times 1.2 = 2400$。",
        "en": "The watts were not converted to kilowatts, so the value is a thousand times too big: $500 \\times 4 \\times 1.2 = 2400$."
      },
      {
        "optionId": 1,
        "zh": "$2$ 是耗電量（$\\text{kW}\\,\\text{h}$），還要乘以每度電的收費 $1.2$ 元。",
        "en": "$2$ is the energy used (in $\\text{kW}\\,\\text{h}$); it still has to be multiplied by the price of $1.2$ dollars per unit."
      },
      {
        "optionId": 2,
        "zh": "$0.5 \\times 1.2 = 0.6$ 漏了使用時間 $4\\,\\text{h}$。",
        "en": "$0.5 \\times 1.2 = 0.6$ leaves out the time of $4\\,\\text{h}$."
      },
      {
        "optionId": 3,
        "zh": "正確。$500\\,\\text{W} = 0.5\\,\\text{kW}$，耗電 $0.5 \\times 4 = 2\\,\\text{kW}\\,\\text{h}$，電費 $2 \\times 1.2 = 2.4$ 元。",
        "en": "Correct. $500\\,\\text{W} = 0.5\\,\\text{kW}$, energy $0.5 \\times 4 = 2\\,\\text{kW}\\,\\text{h}$, cost $2 \\times 1.2 = 2.4$ dollars."
      }
    ]
  },
  {
    "id": "phy_rep_0045",
    "type": "mc",
    "subject": "physics",
    "topic": "electricity",
    "topicZh": "電學",
    "topicEn": "Electricity",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "一件 $2000\\,\\text{W}$ 的電器連續使用 $2\\,\\text{h}$。若每度電（$1\\,\\text{kW}\\,\\text{h}$）收費 $1.5$ 元，求電費。",
    "explanation": "先把功率化為千瓦：$2000\\,\\text{W} = 2\\,\\text{kW}$。耗電量 $= 2 \\times 2 = 4\\,\\text{kW}\\,\\text{h}$（即 $4$ 度電），電費 $= 4 \\times 1.5 = 6$ 元。",
    "options": [
      "$6$ 元",
      "$6000$ 元",
      "$4$ 元",
      "$3$ 元"
    ],
    "correctIndex": 0,
    "marks": 1,
    "contentEn": "A $2000\\,\\text{W}$ appliance runs for $2\\,\\text{h}$. At $1.5$ dollars per unit ($1\\,\\text{kW}\\,\\text{h}$), find the cost.",
    "optionsEn": [
      "$6$ dollars",
      "$6000$ dollars",
      "$4$ dollars",
      "$3$ dollars"
    ],
    "explanationEn": "Convert the power to kilowatts: $2000\\,\\text{W} = 2\\,\\text{kW}$. Energy used $= 2 \\times 2 = 4\\,\\text{kW}\\,\\text{h}$ ($4$ units), so the cost is $4 \\times 1.5 = 6$ dollars.",
    "frameworkEn": "Auto-gated",
    "optionNotes": [
      {
        "optionId": 0,
        "zh": "正確。$2000\\,\\text{W} = 2\\,\\text{kW}$，耗電 $2 \\times 2 = 4\\,\\text{kW}\\,\\text{h}$，電費 $4 \\times 1.5 = 6$ 元。",
        "en": "Correct. $2000\\,\\text{W} = 2\\,\\text{kW}$, energy $2 \\times 2 = 4\\,\\text{kW}\\,\\text{h}$, cost $4 \\times 1.5 = 6$ dollars."
      },
      {
        "optionId": 1,
        "zh": "沒有把瓦特化為千瓦，數值大了一千倍：$2000 \\times 2 \\times 1.5 = 6000$。",
        "en": "The watts were not converted to kilowatts, so the value is a thousand times too big: $2000 \\times 2 \\times 1.5 = 6000$."
      },
      {
        "optionId": 2,
        "zh": "$4$ 是耗電量（$\\text{kW}\\,\\text{h}$），還要乘以每度電的收費 $1.5$ 元。",
        "en": "$4$ is the energy used (in $\\text{kW}\\,\\text{h}$); it still has to be multiplied by the price of $1.5$ dollars per unit."
      },
      {
        "optionId": 3,
        "zh": "$2 \\times 1.5 = 3$ 漏了使用時間 $2\\,\\text{h}$。",
        "en": "$2 \\times 1.5 = 3$ leaves out the time of $2\\,\\text{h}$."
      }
    ]
  },
  {
    "id": "phy_rep_0046",
    "type": "mc",
    "subject": "physics",
    "topic": "electricity",
    "topicZh": "電學",
    "topicEn": "Electricity",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "一件 $1500\\,\\text{W}$ 的電器連續使用 $2\\,\\text{h}$。若每度電（$1\\,\\text{kW}\\,\\text{h}$）收費 $1.5$ 元，求電費。",
    "explanation": "先把功率化為千瓦：$1500\\,\\text{W} = 1.5\\,\\text{kW}$。耗電量 $= 1.5 \\times 2 = 3\\,\\text{kW}\\,\\text{h}$（即 $3$ 度電），電費 $= 3 \\times 1.5 = 4.5$ 元。",
    "options": [
      "$2.25$ 元",
      "$4.5$ 元",
      "$4500$ 元",
      "$3$ 元"
    ],
    "correctIndex": 1,
    "marks": 1,
    "contentEn": "A $1500\\,\\text{W}$ appliance runs for $2\\,\\text{h}$. At $1.5$ dollars per unit ($1\\,\\text{kW}\\,\\text{h}$), find the cost.",
    "optionsEn": [
      "$2.25$ dollars",
      "$4.5$ dollars",
      "$4500$ dollars",
      "$3$ dollars"
    ],
    "explanationEn": "Convert the power to kilowatts: $1500\\,\\text{W} = 1.5\\,\\text{kW}$. Energy used $= 1.5 \\times 2 = 3\\,\\text{kW}\\,\\text{h}$ ($3$ units), so the cost is $3 \\times 1.5 = 4.5$ dollars.",
    "frameworkEn": "Auto-gated",
    "optionNotes": [
      {
        "optionId": 0,
        "zh": "$1.5 \\times 1.5 = 2.25$ 漏了使用時間 $2\\,\\text{h}$。",
        "en": "$1.5 \\times 1.5 = 2.25$ leaves out the time of $2\\,\\text{h}$."
      },
      {
        "optionId": 1,
        "zh": "正確。$1500\\,\\text{W} = 1.5\\,\\text{kW}$，耗電 $1.5 \\times 2 = 3\\,\\text{kW}\\,\\text{h}$，電費 $3 \\times 1.5 = 4.5$ 元。",
        "en": "Correct. $1500\\,\\text{W} = 1.5\\,\\text{kW}$, energy $1.5 \\times 2 = 3\\,\\text{kW}\\,\\text{h}$, cost $3 \\times 1.5 = 4.5$ dollars."
      },
      {
        "optionId": 2,
        "zh": "沒有把瓦特化為千瓦，數值大了一千倍：$1500 \\times 2 \\times 1.5 = 4500$。",
        "en": "The watts were not converted to kilowatts, so the value is a thousand times too big: $1500 \\times 2 \\times 1.5 = 4500$."
      },
      {
        "optionId": 3,
        "zh": "$3$ 是耗電量（$\\text{kW}\\,\\text{h}$），還要乘以每度電的收費 $1.5$ 元。",
        "en": "$3$ is the energy used (in $\\text{kW}\\,\\text{h}$); it still has to be multiplied by the price of $1.5$ dollars per unit."
      }
    ]
  },
  {
    "id": "phy_rep_0047",
    "type": "mc",
    "subject": "physics",
    "topic": "electricity",
    "topicZh": "電學",
    "topicEn": "Electricity",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "一件 $800\\,\\text{W}$ 的電器連續使用 $5\\,\\text{h}$。若每度電（$1\\,\\text{kW}\\,\\text{h}$）收費 $1.5$ 元，求電費。",
    "explanation": "先把功率化為千瓦：$800\\,\\text{W} = 0.8\\,\\text{kW}$。耗電量 $= 0.8 \\times 5 = 4\\,\\text{kW}\\,\\text{h}$（即 $4$ 度電），電費 $= 4 \\times 1.5 = 6$ 元。",
    "options": [
      "$4$ 元",
      "$1.2$ 元",
      "$6$ 元",
      "$6000$ 元"
    ],
    "correctIndex": 2,
    "marks": 1,
    "contentEn": "A $800\\,\\text{W}$ appliance runs for $5\\,\\text{h}$. At $1.5$ dollars per unit ($1\\,\\text{kW}\\,\\text{h}$), find the cost.",
    "optionsEn": [
      "$4$ dollars",
      "$1.2$ dollars",
      "$6$ dollars",
      "$6000$ dollars"
    ],
    "explanationEn": "Convert the power to kilowatts: $800\\,\\text{W} = 0.8\\,\\text{kW}$. Energy used $= 0.8 \\times 5 = 4\\,\\text{kW}\\,\\text{h}$ ($4$ units), so the cost is $4 \\times 1.5 = 6$ dollars.",
    "frameworkEn": "Auto-gated",
    "optionNotes": [
      {
        "optionId": 0,
        "zh": "$4$ 是耗電量（$\\text{kW}\\,\\text{h}$），還要乘以每度電的收費 $1.5$ 元。",
        "en": "$4$ is the energy used (in $\\text{kW}\\,\\text{h}$); it still has to be multiplied by the price of $1.5$ dollars per unit."
      },
      {
        "optionId": 1,
        "zh": "$0.8 \\times 1.5 = 1.2$ 漏了使用時間 $5\\,\\text{h}$。",
        "en": "$0.8 \\times 1.5 = 1.2$ leaves out the time of $5\\,\\text{h}$."
      },
      {
        "optionId": 2,
        "zh": "正確。$800\\,\\text{W} = 0.8\\,\\text{kW}$，耗電 $0.8 \\times 5 = 4\\,\\text{kW}\\,\\text{h}$，電費 $4 \\times 1.5 = 6$ 元。",
        "en": "Correct. $800\\,\\text{W} = 0.8\\,\\text{kW}$, energy $0.8 \\times 5 = 4\\,\\text{kW}\\,\\text{h}$, cost $4 \\times 1.5 = 6$ dollars."
      },
      {
        "optionId": 3,
        "zh": "沒有把瓦特化為千瓦，數值大了一千倍：$800 \\times 5 \\times 1.5 = 6000$。",
        "en": "The watts were not converted to kilowatts, so the value is a thousand times too big: $800 \\times 5 \\times 1.5 = 6000$."
      }
    ]
  },
  {
    "id": "phy_rep_0048",
    "type": "mc",
    "subject": "physics",
    "topic": "electricity",
    "topicZh": "電學",
    "topicEn": "Electricity",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "一件 $250\\,\\text{W}$ 的電器連續使用 $8\\,\\text{h}$。若每度電（$1\\,\\text{kW}\\,\\text{h}$）收費 $2$ 元，求電費。",
    "explanation": "先把功率化為千瓦：$250\\,\\text{W} = 0.25\\,\\text{kW}$。耗電量 $= 0.25 \\times 8 = 2\\,\\text{kW}\\,\\text{h}$（即 $2$ 度電），電費 $= 2 \\times 2 = 4$ 元。",
    "options": [
      "$4000$ 元",
      "$2$ 元",
      "$0.5$ 元",
      "$4$ 元"
    ],
    "correctIndex": 3,
    "marks": 1,
    "contentEn": "A $250\\,\\text{W}$ appliance runs for $8\\,\\text{h}$. At $2$ dollars per unit ($1\\,\\text{kW}\\,\\text{h}$), find the cost.",
    "optionsEn": [
      "$4000$ dollars",
      "$2$ dollars",
      "$0.5$ dollars",
      "$4$ dollars"
    ],
    "explanationEn": "Convert the power to kilowatts: $250\\,\\text{W} = 0.25\\,\\text{kW}$. Energy used $= 0.25 \\times 8 = 2\\,\\text{kW}\\,\\text{h}$ ($2$ units), so the cost is $2 \\times 2 = 4$ dollars.",
    "frameworkEn": "Auto-gated",
    "optionNotes": [
      {
        "optionId": 0,
        "zh": "沒有把瓦特化為千瓦，數值大了一千倍：$250 \\times 8 \\times 2 = 4000$。",
        "en": "The watts were not converted to kilowatts, so the value is a thousand times too big: $250 \\times 8 \\times 2 = 4000$."
      },
      {
        "optionId": 1,
        "zh": "$2$ 是耗電量（$\\text{kW}\\,\\text{h}$），還要乘以每度電的收費 $2$ 元。",
        "en": "$2$ is the energy used (in $\\text{kW}\\,\\text{h}$); it still has to be multiplied by the price of $2$ dollars per unit."
      },
      {
        "optionId": 2,
        "zh": "$0.25 \\times 2 = 0.5$ 漏了使用時間 $8\\,\\text{h}$。",
        "en": "$0.25 \\times 2 = 0.5$ leaves out the time of $8\\,\\text{h}$."
      },
      {
        "optionId": 3,
        "zh": "正確。$250\\,\\text{W} = 0.25\\,\\text{kW}$，耗電 $0.25 \\times 8 = 2\\,\\text{kW}\\,\\text{h}$，電費 $2 \\times 2 = 4$ 元。",
        "en": "Correct. $250\\,\\text{W} = 0.25\\,\\text{kW}$, energy $0.25 \\times 8 = 2\\,\\text{kW}\\,\\text{h}$, cost $2 \\times 2 = 4$ dollars."
      }
    ]
  },
  {
    "id": "phy_rep_0049",
    "type": "mc",
    "subject": "physics",
    "topic": "electricity",
    "topicZh": "電學",
    "topicEn": "Electricity",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "medium",
    "year": 0,
    "content": "電流 $2\\,\\text{A}$ 通過一個 $5\\,\\Omega$ 的電熱線。求它的發熱功率。",
    "explanation": "$P = I^2R = 2^2 \\times 5 = 20\\,\\text{W}$。$10\\,\\text{W}$ 漏了平方，所得其實是電壓 $IR$（單位應為 $\\text{V}$），是本題最主要的失分位。$50\\,\\text{W}$ 把平方加了在電阻上。留意這條關係的重點：功率隨電流的【平方】上升，所以電流加倍，發熱變成四倍——這正是電纜要限流的原因。",
    "options": [
      "$20\\,\\text{W}$",
      "$10\\,\\text{W}$",
      "$50\\,\\text{W}$",
      "$0.4\\,\\text{W}$"
    ],
    "correctIndex": 0,
    "marks": 1,
    "contentEn": "A current of $2\\,\\text{A}$ flows through a $5\\,\\Omega$ heating element. Find the rate at which heat is produced.",
    "optionsEn": [
      "$20\\,\\text{W}$",
      "$10\\,\\text{W}$",
      "$50\\,\\text{W}$",
      "$0.4\\,\\text{W}$"
    ],
    "explanationEn": "$P = I^2R = 2^2 \\times 5 = 20\\,\\text{W}$. $10\\,\\text{W}$ drops the square and is really the p.d. $IR$, which should carry volts — the main trap. $50\\,\\text{W}$ squares the resistance instead. The point of this relation is that power rises with the *square* of the current, so doubling the current quadruples the heating — which is why cables carry a current limit.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "phy_rep_0050",
    "type": "mc",
    "subject": "physics",
    "topic": "electricity",
    "topicZh": "電學",
    "topicEn": "Electricity",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "medium",
    "year": 0,
    "content": "電流 $3\\,\\text{A}$ 通過一個 $4\\,\\Omega$ 的電熱線。求它的發熱功率。",
    "explanation": "$P = I^2R = 3^2 \\times 4 = 36\\,\\text{W}$。$12\\,\\text{W}$ 漏了平方，所得其實是電壓 $IR$（單位應為 $\\text{V}$），是本題最主要的失分位。$48\\,\\text{W}$ 把平方加了在電阻上。留意這條關係的重點：功率隨電流的【平方】上升，所以電流加倍，發熱變成四倍——這正是電纜要限流的原因。",
    "options": [
      "$0.75\\,\\text{W}$",
      "$36\\,\\text{W}$",
      "$12\\,\\text{W}$",
      "$48\\,\\text{W}$"
    ],
    "correctIndex": 1,
    "marks": 1,
    "contentEn": "A current of $3\\,\\text{A}$ flows through a $4\\,\\Omega$ heating element. Find the rate at which heat is produced.",
    "optionsEn": [
      "$0.75\\,\\text{W}$",
      "$36\\,\\text{W}$",
      "$12\\,\\text{W}$",
      "$48\\,\\text{W}$"
    ],
    "explanationEn": "$P = I^2R = 3^2 \\times 4 = 36\\,\\text{W}$. $12\\,\\text{W}$ drops the square and is really the p.d. $IR$, which should carry volts — the main trap. $48\\,\\text{W}$ squares the resistance instead. The point of this relation is that power rises with the *square* of the current, so doubling the current quadruples the heating — which is why cables carry a current limit.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "phy_rep_0051",
    "type": "mc",
    "subject": "physics",
    "topic": "electricity",
    "topicZh": "電學",
    "topicEn": "Electricity",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "medium",
    "year": 0,
    "content": "電流 $0.5\\,\\text{A}$ 通過一個 $40\\,\\Omega$ 的電熱線。求它的發熱功率。",
    "explanation": "$P = I^2R = 0.5^2 \\times 40 = 10\\,\\text{W}$。$20\\,\\text{W}$ 漏了平方，所得其實是電壓 $IR$（單位應為 $\\text{V}$），是本題最主要的失分位。$800\\,\\text{W}$ 把平方加了在電阻上。留意這條關係的重點：功率隨電流的【平方】上升，所以電流加倍，發熱變成四倍——這正是電纜要限流的原因。",
    "options": [
      "$800\\,\\text{W}$",
      "$0.0125\\,\\text{W}$",
      "$10\\,\\text{W}$",
      "$20\\,\\text{W}$"
    ],
    "correctIndex": 2,
    "marks": 1,
    "contentEn": "A current of $0.5\\,\\text{A}$ flows through a $40\\,\\Omega$ heating element. Find the rate at which heat is produced.",
    "optionsEn": [
      "$800\\,\\text{W}$",
      "$0.0125\\,\\text{W}$",
      "$10\\,\\text{W}$",
      "$20\\,\\text{W}$"
    ],
    "explanationEn": "$P = I^2R = 0.5^2 \\times 40 = 10\\,\\text{W}$. $20\\,\\text{W}$ drops the square and is really the p.d. $IR$, which should carry volts — the main trap. $800\\,\\text{W}$ squares the resistance instead. The point of this relation is that power rises with the *square* of the current, so doubling the current quadruples the heating — which is why cables carry a current limit.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "phy_rep_0052",
    "type": "mc",
    "subject": "physics",
    "topic": "electricity",
    "topicZh": "電學",
    "topicEn": "Electricity",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "medium",
    "year": 0,
    "content": "電流 $1.5\\,\\text{A}$ 通過一個 $8\\,\\Omega$ 的電熱線。求它的發熱功率。",
    "explanation": "$P = I^2R = 1.5^2 \\times 8 = 18\\,\\text{W}$。$12\\,\\text{W}$ 漏了平方，所得其實是電壓 $IR$（單位應為 $\\text{V}$），是本題最主要的失分位。$96\\,\\text{W}$ 把平方加了在電阻上。留意這條關係的重點：功率隨電流的【平方】上升，所以電流加倍，發熱變成四倍——這正是電纜要限流的原因。",
    "options": [
      "$12\\,\\text{W}$",
      "$96\\,\\text{W}$",
      "$0.1875\\,\\text{W}$",
      "$18\\,\\text{W}$"
    ],
    "correctIndex": 3,
    "marks": 1,
    "contentEn": "A current of $1.5\\,\\text{A}$ flows through a $8\\,\\Omega$ heating element. Find the rate at which heat is produced.",
    "optionsEn": [
      "$12\\,\\text{W}$",
      "$96\\,\\text{W}$",
      "$0.1875\\,\\text{W}$",
      "$18\\,\\text{W}$"
    ],
    "explanationEn": "$P = I^2R = 1.5^2 \\times 8 = 18\\,\\text{W}$. $12\\,\\text{W}$ drops the square and is really the p.d. $IR$, which should carry volts — the main trap. $96\\,\\text{W}$ squares the resistance instead. The point of this relation is that power rises with the *square* of the current, so doubling the current quadruples the heating — which is why cables carry a current limit.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "phy_rep_0053",
    "type": "mc",
    "subject": "physics",
    "topic": "electricity",
    "topicZh": "電學",
    "topicEn": "Electricity",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "medium",
    "year": 0,
    "content": "電流 $4\\,\\text{A}$ 通過一個 $3\\,\\Omega$ 的電熱線。求它的發熱功率。",
    "explanation": "$P = I^2R = 4^2 \\times 3 = 48\\,\\text{W}$。$12\\,\\text{W}$ 漏了平方，所得其實是電壓 $IR$（單位應為 $\\text{V}$），是本題最主要的失分位。$36\\,\\text{W}$ 把平方加了在電阻上。留意這條關係的重點：功率隨電流的【平方】上升，所以電流加倍，發熱變成四倍——這正是電纜要限流的原因。",
    "options": [
      "$48\\,\\text{W}$",
      "$12\\,\\text{W}$",
      "$36\\,\\text{W}$",
      "$1.3333\\,\\text{W}$"
    ],
    "correctIndex": 0,
    "marks": 1,
    "contentEn": "A current of $4\\,\\text{A}$ flows through a $3\\,\\Omega$ heating element. Find the rate at which heat is produced.",
    "optionsEn": [
      "$48\\,\\text{W}$",
      "$12\\,\\text{W}$",
      "$36\\,\\text{W}$",
      "$1.3333\\,\\text{W}$"
    ],
    "explanationEn": "$P = I^2R = 4^2 \\times 3 = 48\\,\\text{W}$. $12\\,\\text{W}$ drops the square and is really the p.d. $IR$, which should carry volts — the main trap. $36\\,\\text{W}$ squares the resistance instead. The point of this relation is that power rises with the *square* of the current, so doubling the current quadruples the heating — which is why cables carry a current limit.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "phy_rep_0054",
    "type": "mc",
    "subject": "physics",
    "topic": "electricity",
    "topicZh": "電學",
    "topicEn": "Electricity",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "medium",
    "year": 0,
    "content": "電流 $5\\,\\text{A}$ 通過一個 $2\\,\\Omega$ 的電熱線。求它的發熱功率。",
    "explanation": "$P = I^2R = 5^2 \\times 2 = 50\\,\\text{W}$。$10\\,\\text{W}$ 漏了平方，所得其實是電壓 $IR$（單位應為 $\\text{V}$），是本題最主要的失分位。$20\\,\\text{W}$ 把平方加了在電阻上。留意這條關係的重點：功率隨電流的【平方】上升，所以電流加倍，發熱變成四倍——這正是電纜要限流的原因。",
    "options": [
      "$2.5\\,\\text{W}$",
      "$50\\,\\text{W}$",
      "$10\\,\\text{W}$",
      "$20\\,\\text{W}$"
    ],
    "correctIndex": 1,
    "marks": 1,
    "contentEn": "A current of $5\\,\\text{A}$ flows through a $2\\,\\Omega$ heating element. Find the rate at which heat is produced.",
    "optionsEn": [
      "$2.5\\,\\text{W}$",
      "$50\\,\\text{W}$",
      "$10\\,\\text{W}$",
      "$20\\,\\text{W}$"
    ],
    "explanationEn": "$P = I^2R = 5^2 \\times 2 = 50\\,\\text{W}$. $10\\,\\text{W}$ drops the square and is really the p.d. $IR$, which should carry volts — the main trap. $20\\,\\text{W}$ squares the resistance instead. The point of this relation is that power rises with the *square* of the current, so doubling the current quadruples the heating — which is why cables carry a current limit.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "phy_rep_0055",
    "type": "mc",
    "subject": "physics",
    "topic": "electricity",
    "topicZh": "電學",
    "topicEn": "Electricity",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "medium",
    "year": 0,
    "content": "兩個電阻並聯後的總電阻為 $2\\,\\Omega$。已知其中一個為 $6\\,\\Omega$，求另一個。",
    "explanation": "並聯公式 $\\dfrac{1}{R} = \\dfrac{1}{R_1} + \\dfrac{1}{R_2}$，移項得 $\\dfrac{1}{R_2} = \\dfrac{1}{2} - \\dfrac{1}{6}$，故 $R_2 = 3\\,\\Omega$。$4\\,\\Omega$ 把電阻本身相減，那是串聯的算法用錯了地方——並聯要相加的是【倒數】，不是電阻。驗算方法很簡單：並聯的總電阻必定小於任何一個分支，$2 < 6$ 與 $2 < 3$ 都成立，答案就合理。",
    "options": [
      "$8\\,\\text{\\Omega}$",
      "$12\\,\\text{\\Omega}$",
      "$3\\,\\text{\\Omega}$",
      "$4\\,\\text{\\Omega}$"
    ],
    "correctIndex": 2,
    "marks": 1,
    "contentEn": "Two resistors in parallel give a total resistance of $2\\,\\Omega$. One of them is $6\\,\\Omega$. Find the other.",
    "optionsEn": [
      "$8\\,\\text{\\Omega}$",
      "$12\\,\\text{\\Omega}$",
      "$3\\,\\text{\\Omega}$",
      "$4\\,\\text{\\Omega}$"
    ],
    "explanationEn": "From $\\dfrac{1}{R} = \\dfrac{1}{R_1} + \\dfrac{1}{R_2}$ we get $\\dfrac{1}{R_2} = \\dfrac{1}{2} - \\dfrac{1}{6}$, so $R_2 = 3\\,\\Omega$. $4\\,\\Omega$ subtracts the resistances themselves, applying series arithmetic in the wrong place: in parallel it is the *reciprocals* that add. The check is quick — a parallel total must be smaller than either branch, and both $2 < 6$ and $2 < 3$ hold.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "phy_rep_0056",
    "type": "mc",
    "subject": "physics",
    "topic": "electricity",
    "topicZh": "電學",
    "topicEn": "Electricity",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "medium",
    "year": 0,
    "content": "兩個電阻並聯後的總電阻為 $4\\,\\Omega$。已知其中一個為 $12\\,\\Omega$，求另一個。",
    "explanation": "並聯公式 $\\dfrac{1}{R} = \\dfrac{1}{R_1} + \\dfrac{1}{R_2}$，移項得 $\\dfrac{1}{R_2} = \\dfrac{1}{4} - \\dfrac{1}{12}$，故 $R_2 = 6\\,\\Omega$。$8\\,\\Omega$ 把電阻本身相減，那是串聯的算法用錯了地方——並聯要相加的是【倒數】，不是電阻。驗算方法很簡單：並聯的總電阻必定小於任何一個分支，$4 < 12$ 與 $4 < 6$ 都成立，答案就合理。",
    "options": [
      "$8\\,\\text{\\Omega}$",
      "$16\\,\\text{\\Omega}$",
      "$48\\,\\text{\\Omega}$",
      "$6\\,\\text{\\Omega}$"
    ],
    "correctIndex": 3,
    "marks": 1,
    "contentEn": "Two resistors in parallel give a total resistance of $4\\,\\Omega$. One of them is $12\\,\\Omega$. Find the other.",
    "optionsEn": [
      "$8\\,\\text{\\Omega}$",
      "$16\\,\\text{\\Omega}$",
      "$48\\,\\text{\\Omega}$",
      "$6\\,\\text{\\Omega}$"
    ],
    "explanationEn": "From $\\dfrac{1}{R} = \\dfrac{1}{R_1} + \\dfrac{1}{R_2}$ we get $\\dfrac{1}{R_2} = \\dfrac{1}{4} - \\dfrac{1}{12}$, so $R_2 = 6\\,\\Omega$. $8\\,\\Omega$ subtracts the resistances themselves, applying series arithmetic in the wrong place: in parallel it is the *reciprocals* that add. The check is quick — a parallel total must be smaller than either branch, and both $4 < 12$ and $4 < 6$ hold.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "phy_rep_0057",
    "type": "mc",
    "subject": "physics",
    "topic": "electricity",
    "topicZh": "電學",
    "topicEn": "Electricity",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "medium",
    "year": 0,
    "content": "兩個電阻並聯後的總電阻為 $3\\,\\Omega$。已知其中一個為 $6\\,\\Omega$，求另一個。",
    "explanation": "並聯公式 $\\dfrac{1}{R} = \\dfrac{1}{R_1} + \\dfrac{1}{R_2}$，移項得 $\\dfrac{1}{R_2} = \\dfrac{1}{3} - \\dfrac{1}{6}$，故 $R_2 = 6\\,\\Omega$。$3\\,\\Omega$ 把電阻本身相減，那是串聯的算法用錯了地方——並聯要相加的是【倒數】，不是電阻。驗算方法很簡單：並聯的總電阻必定小於任何一個分支，$3 < 6$ 與 $3 < 6$ 都成立，答案就合理。",
    "options": [
      "$6\\,\\text{\\Omega}$",
      "$3\\,\\text{\\Omega}$",
      "$9\\,\\text{\\Omega}$",
      "$18\\,\\text{\\Omega}$"
    ],
    "correctIndex": 0,
    "marks": 1,
    "contentEn": "Two resistors in parallel give a total resistance of $3\\,\\Omega$. One of them is $6\\,\\Omega$. Find the other.",
    "optionsEn": [
      "$6\\,\\text{\\Omega}$",
      "$3\\,\\text{\\Omega}$",
      "$9\\,\\text{\\Omega}$",
      "$18\\,\\text{\\Omega}$"
    ],
    "explanationEn": "From $\\dfrac{1}{R} = \\dfrac{1}{R_1} + \\dfrac{1}{R_2}$ we get $\\dfrac{1}{R_2} = \\dfrac{1}{3} - \\dfrac{1}{6}$, so $R_2 = 6\\,\\Omega$. $3\\,\\Omega$ subtracts the resistances themselves, applying series arithmetic in the wrong place: in parallel it is the *reciprocals* that add. The check is quick — a parallel total must be smaller than either branch, and both $3 < 6$ and $3 < 6$ hold.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "phy_rep_0058",
    "type": "mc",
    "subject": "physics",
    "topic": "electricity",
    "topicZh": "電學",
    "topicEn": "Electricity",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "medium",
    "year": 0,
    "content": "兩個電阻並聯後的總電阻為 $6\\,\\Omega$。已知其中一個為 $10\\,\\Omega$，求另一個。",
    "explanation": "並聯公式 $\\dfrac{1}{R} = \\dfrac{1}{R_1} + \\dfrac{1}{R_2}$，移項得 $\\dfrac{1}{R_2} = \\dfrac{1}{6} - \\dfrac{1}{10}$，故 $R_2 = 15\\,\\Omega$。$4\\,\\Omega$ 把電阻本身相減，那是串聯的算法用錯了地方——並聯要相加的是【倒數】，不是電阻。驗算方法很簡單：並聯的總電阻必定小於任何一個分支，$6 < 10$ 與 $6 < 15$ 都成立，答案就合理。",
    "options": [
      "$60\\,\\text{\\Omega}$",
      "$15\\,\\text{\\Omega}$",
      "$4\\,\\text{\\Omega}$",
      "$16\\,\\text{\\Omega}$"
    ],
    "correctIndex": 1,
    "marks": 1,
    "contentEn": "Two resistors in parallel give a total resistance of $6\\,\\Omega$. One of them is $10\\,\\Omega$. Find the other.",
    "optionsEn": [
      "$60\\,\\text{\\Omega}$",
      "$15\\,\\text{\\Omega}$",
      "$4\\,\\text{\\Omega}$",
      "$16\\,\\text{\\Omega}$"
    ],
    "explanationEn": "From $\\dfrac{1}{R} = \\dfrac{1}{R_1} + \\dfrac{1}{R_2}$ we get $\\dfrac{1}{R_2} = \\dfrac{1}{6} - \\dfrac{1}{10}$, so $R_2 = 15\\,\\Omega$. $4\\,\\Omega$ subtracts the resistances themselves, applying series arithmetic in the wrong place: in parallel it is the *reciprocals* that add. The check is quick — a parallel total must be smaller than either branch, and both $6 < 10$ and $6 < 15$ hold.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "phy_rep_0059",
    "type": "mc",
    "subject": "physics",
    "topic": "electricity",
    "topicZh": "電學",
    "topicEn": "Electricity",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "medium",
    "year": 0,
    "content": "兩個電阻並聯後的總電阻為 $2.4\\,\\Omega$。已知其中一個為 $4\\,\\Omega$，求另一個。",
    "explanation": "並聯公式 $\\dfrac{1}{R} = \\dfrac{1}{R_1} + \\dfrac{1}{R_2}$，移項得 $\\dfrac{1}{R_2} = \\dfrac{1}{2.4} - \\dfrac{1}{4}$，故 $R_2 = 6\\,\\Omega$。$1.6\\,\\Omega$ 把電阻本身相減，那是串聯的算法用錯了地方——並聯要相加的是【倒數】，不是電阻。驗算方法很簡單：並聯的總電阻必定小於任何一個分支，$2.4 < 4$ 與 $2.4 < 6$ 都成立，答案就合理。",
    "options": [
      "$6.4\\,\\text{\\Omega}$",
      "$9.6\\,\\text{\\Omega}$",
      "$6\\,\\text{\\Omega}$",
      "$1.6\\,\\text{\\Omega}$"
    ],
    "correctIndex": 2,
    "marks": 1,
    "contentEn": "Two resistors in parallel give a total resistance of $2.4\\,\\Omega$. One of them is $4\\,\\Omega$. Find the other.",
    "optionsEn": [
      "$6.4\\,\\text{\\Omega}$",
      "$9.6\\,\\text{\\Omega}$",
      "$6\\,\\text{\\Omega}$",
      "$1.6\\,\\text{\\Omega}$"
    ],
    "explanationEn": "From $\\dfrac{1}{R} = \\dfrac{1}{R_1} + \\dfrac{1}{R_2}$ we get $\\dfrac{1}{R_2} = \\dfrac{1}{2.4} - \\dfrac{1}{4}$, so $R_2 = 6\\,\\Omega$. $1.6\\,\\Omega$ subtracts the resistances themselves, applying series arithmetic in the wrong place: in parallel it is the *reciprocals* that add. The check is quick — a parallel total must be smaller than either branch, and both $2.4 < 4$ and $2.4 < 6$ hold.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "phy_rep_0060",
    "type": "mc",
    "subject": "physics",
    "topic": "electricity",
    "topicZh": "電學",
    "topicEn": "Electricity",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "medium",
    "year": 0,
    "content": "兩個電阻並聯後的總電阻為 $5\\,\\Omega$。已知其中一個為 $20\\,\\Omega$，求另一個。",
    "explanation": "並聯公式 $\\dfrac{1}{R} = \\dfrac{1}{R_1} + \\dfrac{1}{R_2}$，移項得 $\\dfrac{1}{R_2} = \\dfrac{1}{5} - \\dfrac{1}{20}$，故 $R_2 = 6.6667\\,\\Omega$。$15\\,\\Omega$ 把電阻本身相減，那是串聯的算法用錯了地方——並聯要相加的是【倒數】，不是電阻。驗算方法很簡單：並聯的總電阻必定小於任何一個分支，$5 < 20$ 與 $5 < 6.6667$ 都成立，答案就合理。",
    "options": [
      "$15\\,\\text{\\Omega}$",
      "$25\\,\\text{\\Omega}$",
      "$100\\,\\text{\\Omega}$",
      "$6.6667\\,\\text{\\Omega}$"
    ],
    "correctIndex": 3,
    "marks": 1,
    "contentEn": "Two resistors in parallel give a total resistance of $5\\,\\Omega$. One of them is $20\\,\\Omega$. Find the other.",
    "optionsEn": [
      "$15\\,\\text{\\Omega}$",
      "$25\\,\\text{\\Omega}$",
      "$100\\,\\text{\\Omega}$",
      "$6.6667\\,\\text{\\Omega}$"
    ],
    "explanationEn": "From $\\dfrac{1}{R} = \\dfrac{1}{R_1} + \\dfrac{1}{R_2}$ we get $\\dfrac{1}{R_2} = \\dfrac{1}{5} - \\dfrac{1}{20}$, so $R_2 = 6.6667\\,\\Omega$. $15\\,\\Omega$ subtracts the resistances themselves, applying series arithmetic in the wrong place: in parallel it is the *reciprocals* that add. The check is quick — a parallel total must be smaller than either branch, and both $5 < 20$ and $5 < 6.6667$ hold.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "phy_rep_0061",
    "type": "mc",
    "subject": "physics",
    "topic": "electricity",
    "topicZh": "電學",
    "topicEn": "Electricity",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "medium",
    "year": 0,
    "content": "一個理想變壓器由 $240\\,\\text{V}$ 供電，次級輸出電壓為 $12\\,\\text{V}$，次級功率為 $360\\,\\text{W}$。求次級電流。",
    "explanation": "次級側的功率與電壓已知，直接用 $P = VI$：$I = 360/12 = 30\\,\\text{A}$。$1.5\\,\\text{A}$ 用了初級電壓，所得是【初級】電流；理想變壓器兩側功率相等，但電流與電壓成反比——降壓的一側電流反而大，這正是變壓器的用處。$0.075\\,\\text{A}$ 由初級電流再乘一次電壓比，方向倒轉了。$20\\,\\text{A}$ 只算了匝數比（無單位），不是電流。",
    "options": [
      "$30\\,\\text{A}$",
      "$1.5\\,\\text{A}$",
      "$0.075\\,\\text{A}$",
      "$20\\,\\text{A}$"
    ],
    "correctIndex": 0,
    "marks": 1,
    "contentEn": "An ideal transformer is supplied at $240\\,\\text{V}$ and delivers $12\\,\\text{V}$ at a power of $360\\,\\text{W}$. Find the secondary current.",
    "optionsEn": [
      "$30\\,\\text{A}$",
      "$1.5\\,\\text{A}$",
      "$0.075\\,\\text{A}$",
      "$20\\,\\text{A}$"
    ],
    "explanationEn": "Power and voltage on the secondary side are both given, so $P = VI$ applies directly: $I = 360/12 = 30\\,\\text{A}$. $1.5\\,\\text{A}$ uses the primary voltage and gives the *primary* current. An ideal transformer passes equal power both sides, so current varies inversely with voltage — the step-down side carries the larger current, which is the whole point of the device. $0.075\\,\\text{A}$ scales the primary current by the voltage ratio the wrong way round. $20\\,\\text{A}$ is just the turns ratio, a pure number, not a current.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "phy_rep_0062",
    "type": "mc",
    "subject": "physics",
    "topic": "electricity",
    "topicZh": "電學",
    "topicEn": "Electricity",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "medium",
    "year": 0,
    "content": "一個理想變壓器由 $240\\,\\text{V}$ 供電，次級輸出電壓為 $24\\,\\text{V}$，次級功率為 $600\\,\\text{W}$。求次級電流。",
    "explanation": "次級側的功率與電壓已知，直接用 $P = VI$：$I = 600/24 = 25\\,\\text{A}$。$2.5\\,\\text{A}$ 用了初級電壓，所得是【初級】電流；理想變壓器兩側功率相等，但電流與電壓成反比——降壓的一側電流反而大，這正是變壓器的用處。$0.25\\,\\text{A}$ 由初級電流再乘一次電壓比，方向倒轉了。$10\\,\\text{A}$ 只算了匝數比（無單位），不是電流。",
    "options": [
      "$10\\,\\text{A}$",
      "$25\\,\\text{A}$",
      "$2.5\\,\\text{A}$",
      "$0.25\\,\\text{A}$"
    ],
    "correctIndex": 1,
    "marks": 1,
    "contentEn": "An ideal transformer is supplied at $240\\,\\text{V}$ and delivers $24\\,\\text{V}$ at a power of $600\\,\\text{W}$. Find the secondary current.",
    "optionsEn": [
      "$10\\,\\text{A}$",
      "$25\\,\\text{A}$",
      "$2.5\\,\\text{A}$",
      "$0.25\\,\\text{A}$"
    ],
    "explanationEn": "Power and voltage on the secondary side are both given, so $P = VI$ applies directly: $I = 600/24 = 25\\,\\text{A}$. $2.5\\,\\text{A}$ uses the primary voltage and gives the *primary* current. An ideal transformer passes equal power both sides, so current varies inversely with voltage — the step-down side carries the larger current, which is the whole point of the device. $0.25\\,\\text{A}$ scales the primary current by the voltage ratio the wrong way round. $10\\,\\text{A}$ is just the turns ratio, a pure number, not a current.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "phy_rep_0063",
    "type": "mc",
    "subject": "physics",
    "topic": "electricity",
    "topicZh": "電學",
    "topicEn": "Electricity",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "medium",
    "year": 0,
    "content": "一個理想變壓器由 $240\\,\\text{V}$ 供電，次級輸出電壓為 $6\\,\\text{V}$，次級功率為 $120\\,\\text{W}$。求次級電流。",
    "explanation": "次級側的功率與電壓已知，直接用 $P = VI$：$I = 120/6 = 20\\,\\text{A}$。$0.5\\,\\text{A}$ 用了初級電壓，所得是【初級】電流；理想變壓器兩側功率相等，但電流與電壓成反比——降壓的一側電流反而大，這正是變壓器的用處。$0.0125\\,\\text{A}$ 由初級電流再乘一次電壓比，方向倒轉了。$40\\,\\text{A}$ 只算了匝數比（無單位），不是電流。",
    "options": [
      "$0.0125\\,\\text{A}$",
      "$40\\,\\text{A}$",
      "$20\\,\\text{A}$",
      "$0.5\\,\\text{A}$"
    ],
    "correctIndex": 2,
    "marks": 1,
    "contentEn": "An ideal transformer is supplied at $240\\,\\text{V}$ and delivers $6\\,\\text{V}$ at a power of $120\\,\\text{W}$. Find the secondary current.",
    "optionsEn": [
      "$0.0125\\,\\text{A}$",
      "$40\\,\\text{A}$",
      "$20\\,\\text{A}$",
      "$0.5\\,\\text{A}$"
    ],
    "explanationEn": "Power and voltage on the secondary side are both given, so $P = VI$ applies directly: $I = 120/6 = 20\\,\\text{A}$. $0.5\\,\\text{A}$ uses the primary voltage and gives the *primary* current. An ideal transformer passes equal power both sides, so current varies inversely with voltage — the step-down side carries the larger current, which is the whole point of the device. $0.0125\\,\\text{A}$ scales the primary current by the voltage ratio the wrong way round. $40\\,\\text{A}$ is just the turns ratio, a pure number, not a current.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "phy_rep_0064",
    "type": "mc",
    "subject": "physics",
    "topic": "electricity",
    "topicZh": "電學",
    "topicEn": "Electricity",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "medium",
    "year": 0,
    "content": "一個理想變壓器由 $240\\,\\text{V}$ 供電，次級輸出電壓為 $45\\,\\text{V}$，次級功率為 $900\\,\\text{W}$。求次級電流。",
    "explanation": "次級側的功率與電壓已知，直接用 $P = VI$：$I = 900/45 = 20\\,\\text{A}$。$3.75\\,\\text{A}$ 用了初級電壓，所得是【初級】電流；理想變壓器兩側功率相等，但電流與電壓成反比——降壓的一側電流反而大，這正是變壓器的用處。$0.7031\\,\\text{A}$ 由初級電流再乘一次電壓比，方向倒轉了。$5.3333\\,\\text{A}$ 只算了匝數比（無單位），不是電流。",
    "options": [
      "$3.75\\,\\text{A}$",
      "$0.7031\\,\\text{A}$",
      "$5.3333\\,\\text{A}$",
      "$20\\,\\text{A}$"
    ],
    "correctIndex": 3,
    "marks": 1,
    "contentEn": "An ideal transformer is supplied at $240\\,\\text{V}$ and delivers $45\\,\\text{V}$ at a power of $900\\,\\text{W}$. Find the secondary current.",
    "optionsEn": [
      "$3.75\\,\\text{A}$",
      "$0.7031\\,\\text{A}$",
      "$5.3333\\,\\text{A}$",
      "$20\\,\\text{A}$"
    ],
    "explanationEn": "Power and voltage on the secondary side are both given, so $P = VI$ applies directly: $I = 900/45 = 20\\,\\text{A}$. $3.75\\,\\text{A}$ uses the primary voltage and gives the *primary* current. An ideal transformer passes equal power both sides, so current varies inversely with voltage — the step-down side carries the larger current, which is the whole point of the device. $0.7031\\,\\text{A}$ scales the primary current by the voltage ratio the wrong way round. $5.3333\\,\\text{A}$ is just the turns ratio, a pure number, not a current.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "phy_rep_0065",
    "type": "mc",
    "subject": "physics",
    "topic": "electricity",
    "topicZh": "電學",
    "topicEn": "Electricity",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "medium",
    "year": 0,
    "content": "一個理想變壓器由 $240\\,\\text{V}$ 供電，次級輸出電壓為 $20\\,\\text{V}$，次級功率為 $400\\,\\text{W}$。求次級電流。",
    "explanation": "次級側的功率與電壓已知，直接用 $P = VI$：$I = 400/20 = 20\\,\\text{A}$。$1.6667\\,\\text{A}$ 用了初級電壓，所得是【初級】電流；理想變壓器兩側功率相等，但電流與電壓成反比——降壓的一側電流反而大，這正是變壓器的用處。$0.1389\\,\\text{A}$ 由初級電流再乘一次電壓比，方向倒轉了。$12\\,\\text{A}$ 只算了匝數比（無單位），不是電流。",
    "options": [
      "$20\\,\\text{A}$",
      "$1.6667\\,\\text{A}$",
      "$0.1389\\,\\text{A}$",
      "$12\\,\\text{A}$"
    ],
    "correctIndex": 0,
    "marks": 1,
    "contentEn": "An ideal transformer is supplied at $240\\,\\text{V}$ and delivers $20\\,\\text{V}$ at a power of $400\\,\\text{W}$. Find the secondary current.",
    "optionsEn": [
      "$20\\,\\text{A}$",
      "$1.6667\\,\\text{A}$",
      "$0.1389\\,\\text{A}$",
      "$12\\,\\text{A}$"
    ],
    "explanationEn": "Power and voltage on the secondary side are both given, so $P = VI$ applies directly: $I = 400/20 = 20\\,\\text{A}$. $1.6667\\,\\text{A}$ uses the primary voltage and gives the *primary* current. An ideal transformer passes equal power both sides, so current varies inversely with voltage — the step-down side carries the larger current, which is the whole point of the device. $0.1389\\,\\text{A}$ scales the primary current by the voltage ratio the wrong way round. $12\\,\\text{A}$ is just the turns ratio, a pure number, not a current.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "phy_rep_0066",
    "type": "mc",
    "subject": "physics",
    "topic": "electricity",
    "topicZh": "電學",
    "topicEn": "Electricity",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "medium",
    "year": 0,
    "content": "一個理想變壓器由 $240\\,\\text{V}$ 供電，次級輸出電壓為 $15\\,\\text{V}$，次級功率為 $300\\,\\text{W}$。求次級電流。",
    "explanation": "次級側的功率與電壓已知，直接用 $P = VI$：$I = 300/15 = 20\\,\\text{A}$。$1.25\\,\\text{A}$ 用了初級電壓，所得是【初級】電流；理想變壓器兩側功率相等，但電流與電壓成反比——降壓的一側電流反而大，這正是變壓器的用處。$0.0781\\,\\text{A}$ 由初級電流再乘一次電壓比，方向倒轉了。$16\\,\\text{A}$ 只算了匝數比（無單位），不是電流。",
    "options": [
      "$16\\,\\text{A}$",
      "$20\\,\\text{A}$",
      "$1.25\\,\\text{A}$",
      "$0.0781\\,\\text{A}$"
    ],
    "correctIndex": 1,
    "marks": 1,
    "contentEn": "An ideal transformer is supplied at $240\\,\\text{V}$ and delivers $15\\,\\text{V}$ at a power of $300\\,\\text{W}$. Find the secondary current.",
    "optionsEn": [
      "$16\\,\\text{A}$",
      "$20\\,\\text{A}$",
      "$1.25\\,\\text{A}$",
      "$0.0781\\,\\text{A}$"
    ],
    "explanationEn": "Power and voltage on the secondary side are both given, so $P = VI$ applies directly: $I = 300/15 = 20\\,\\text{A}$. $1.25\\,\\text{A}$ uses the primary voltage and gives the *primary* current. An ideal transformer passes equal power both sides, so current varies inversely with voltage — the step-down side carries the larger current, which is the whole point of the device. $0.0781\\,\\text{A}$ scales the primary current by the voltage ratio the wrong way round. $16\\,\\text{A}$ is just the turns ratio, a pure number, not a current.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "phy_rep_0067",
    "type": "mc",
    "subject": "physics",
    "topic": "electricity",
    "topicZh": "電學",
    "topicEn": "Electricity",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "medium",
    "year": 0,
    "content": "同一種金屬造的兩條導線，第二條的長度是第一條的 $3$ 倍，截面積是第一條的 $6$ 倍。第二條的電阻是第一條的多少倍？",
    "explanation": "$R = \\rho L / A$：電阻與長度成正比、與截面積成反比，故倍數 $= 3 \\div 6 = 0.5$。$18$ 倍把兩個因素【都】當成令電阻上升，忽略了截面積在分母；直觀理解是：導線越粗，載流的通道越闊，阻礙反而越小。$3$ 倍只計了長度而漏了粗細。",
    "options": [
      "$3$ 倍",
      "$2$ 倍",
      "$0.5$ 倍",
      "$18$ 倍"
    ],
    "correctIndex": 2,
    "marks": 1,
    "contentEn": "Two wires are made of the same metal. The second is $3$ times as long and has $6$ times the cross-sectional area of the first. The resistance of the second is how many times that of the first?",
    "optionsEn": [
      "$3$ times",
      "$2$ times",
      "$0.5$ times",
      "$18$ times"
    ],
    "explanationEn": "$R = \\rho L / A$: resistance is proportional to length and inversely proportional to area, so the factor is $3 \\div 6 = 0.5$. $18$ treats *both* changes as increasing the resistance and forgets that area sits in the denominator; physically, a thicker wire offers a wider channel for the charge and so less opposition. $3$ counts only the length and ignores the thickness.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "phy_rep_0068",
    "type": "mc",
    "subject": "physics",
    "topic": "electricity",
    "topicZh": "電學",
    "topicEn": "Electricity",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "medium",
    "year": 0,
    "content": "同一種金屬造的兩條導線，第二條的長度是第一條的 $4$ 倍，截面積是第一條的 $2$ 倍。第二條的電阻是第一條的多少倍？",
    "explanation": "$R = \\rho L / A$：電阻與長度成正比、與截面積成反比，故倍數 $= 4 \\div 2 = 2$。$8$ 倍把兩個因素【都】當成令電阻上升，忽略了截面積在分母；直觀理解是：導線越粗，載流的通道越闊，阻礙反而越小。$4$ 倍只計了長度而漏了粗細。",
    "options": [
      "$8$ 倍",
      "$4$ 倍",
      "$0.5$ 倍",
      "$2$ 倍"
    ],
    "correctIndex": 3,
    "marks": 1,
    "contentEn": "Two wires are made of the same metal. The second is $4$ times as long and has $2$ times the cross-sectional area of the first. The resistance of the second is how many times that of the first?",
    "optionsEn": [
      "$8$ times",
      "$4$ times",
      "$0.5$ times",
      "$2$ times"
    ],
    "explanationEn": "$R = \\rho L / A$: resistance is proportional to length and inversely proportional to area, so the factor is $4 \\div 2 = 2$. $8$ treats *both* changes as increasing the resistance and forgets that area sits in the denominator; physically, a thicker wire offers a wider channel for the charge and so less opposition. $4$ counts only the length and ignores the thickness.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "phy_rep_0069",
    "type": "mc",
    "subject": "physics",
    "topic": "electricity",
    "topicZh": "電學",
    "topicEn": "Electricity",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "medium",
    "year": 0,
    "content": "同一種金屬造的兩條導線，第二條的長度是第一條的 $2$ 倍，截面積是第一條的 $6$ 倍。第二條的電阻是第一條的多少倍？",
    "explanation": "$R = \\rho L / A$：電阻與長度成正比、與截面積成反比，故倍數 $= 2 \\div 6 = 0.3333$。$12$ 倍把兩個因素【都】當成令電阻上升，忽略了截面積在分母；直觀理解是：導線越粗，載流的通道越闊，阻礙反而越小。$2$ 倍只計了長度而漏了粗細。",
    "options": [
      "$0.3333$ 倍",
      "$12$ 倍",
      "$2$ 倍",
      "$3$ 倍"
    ],
    "correctIndex": 0,
    "marks": 1,
    "contentEn": "Two wires are made of the same metal. The second is $2$ times as long and has $6$ times the cross-sectional area of the first. The resistance of the second is how many times that of the first?",
    "optionsEn": [
      "$0.3333$ times",
      "$12$ times",
      "$2$ times",
      "$3$ times"
    ],
    "explanationEn": "$R = \\rho L / A$: resistance is proportional to length and inversely proportional to area, so the factor is $2 \\div 6 = 0.3333$. $12$ treats *both* changes as increasing the resistance and forgets that area sits in the denominator; physically, a thicker wire offers a wider channel for the charge and so less opposition. $2$ counts only the length and ignores the thickness.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "phy_rep_0070",
    "type": "mc",
    "subject": "physics",
    "topic": "electricity",
    "topicZh": "電學",
    "topicEn": "Electricity",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "medium",
    "year": 0,
    "content": "同一種金屬造的兩條導線，第二條的長度是第一條的 $6$ 倍，截面積是第一條的 $2$ 倍。第二條的電阻是第一條的多少倍？",
    "explanation": "$R = \\rho L / A$：電阻與長度成正比、與截面積成反比，故倍數 $= 6 \\div 2 = 3$。$12$ 倍把兩個因素【都】當成令電阻上升，忽略了截面積在分母；直觀理解是：導線越粗，載流的通道越闊，阻礙反而越小。$6$ 倍只計了長度而漏了粗細。",
    "options": [
      "$0.3333$ 倍",
      "$3$ 倍",
      "$12$ 倍",
      "$6$ 倍"
    ],
    "correctIndex": 1,
    "marks": 1,
    "contentEn": "Two wires are made of the same metal. The second is $6$ times as long and has $2$ times the cross-sectional area of the first. The resistance of the second is how many times that of the first?",
    "optionsEn": [
      "$0.3333$ times",
      "$3$ times",
      "$12$ times",
      "$6$ times"
    ],
    "explanationEn": "$R = \\rho L / A$: resistance is proportional to length and inversely proportional to area, so the factor is $6 \\div 2 = 3$. $12$ treats *both* changes as increasing the resistance and forgets that area sits in the denominator; physically, a thicker wire offers a wider channel for the charge and so less opposition. $6$ counts only the length and ignores the thickness.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "phy_rep_0071",
    "type": "mc",
    "subject": "physics",
    "topic": "electricity",
    "topicZh": "電學",
    "topicEn": "Electricity",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "hard",
    "year": 0,
    "content": "$12\\,\\text{V}$ 電源接上串聯的 $4\\,\\Omega$ 與 $8\\,\\Omega$。求 $4\\,\\Omega$ 兩端的電壓。",
    "explanation": "串聯電路中電流處處相同：$I = \\dfrac{12}{4 + 8} = 1\\,\\text{A}$，故 $V_1 = IR_1 = 4\\,\\text{V}$。等價寫法是分壓式 $V_1 = V \\times \\dfrac{R_1}{R_1 + R_2}$：分子放所求的電阻。",
    "options": [
      "$6\\,\\text{V}$",
      "$2.6667\\,\\text{V}$",
      "$4\\,\\text{V}$",
      "$8\\,\\text{V}$"
    ],
    "correctIndex": 2,
    "marks": 1,
    "contentEn": "A $12\\,\\text{V}$ supply is connected across $4\\,\\Omega$ in series with $8\\,\\Omega$. Find the p.d. across the $4\\,\\Omega$ resistor.",
    "optionsEn": [
      "$6\\,\\text{V}$",
      "$2.6667\\,\\text{V}$",
      "$4\\,\\text{V}$",
      "$8\\,\\text{V}$"
    ],
    "explanationEn": "In a series circuit the current is the same everywhere: $I = \\dfrac{12}{4 + 8} = 1\\,\\text{A}$, so $V_1 = IR_1 = 4\\,\\text{V}$. Equivalently, the divider formula $V_1 = V \\times \\dfrac{R_1}{R_1 + R_2}$ puts the resistor asked about on top.",
    "frameworkEn": "Auto-gated",
    "optionNotes": [
      {
        "optionId": 0,
        "zh": "$\\dfrac{12}{2} = 6$ 假設兩個電阻平分電壓，只在兩個電阻相等時才成立。",
        "en": "$\\dfrac{12}{2} = 6$ assumes the two resistors share the voltage equally, which holds only when they are equal."
      },
      {
        "optionId": 1,
        "zh": "用了並聯組合電阻 $\\dfrac{4 \\times 8}{4 + 8} \\approx 2.6667\\,\\Omega$ 乘以電流；但兩個電阻是串聯的。",
        "en": "This multiplies the current by the parallel combination $\\dfrac{4 \\times 8}{4 + 8} \\approx 2.6667\\,\\Omega$, but the resistors are in series."
      },
      {
        "optionId": 2,
        "zh": "正確。$I = \\dfrac{12}{4 + 8} = 1\\,\\text{A}$，$V_1 = IR_1 = 1 \\times 4 = 4\\,\\text{V}$。",
        "en": "Correct. $I = \\dfrac{12}{4 + 8} = 1\\,\\text{A}$, so $V_1 = IR_1 = 1 \\times 4 = 4\\,\\text{V}$."
      },
      {
        "optionId": 3,
        "zh": "$8\\,\\text{V}$ 是 $8\\,\\Omega$ 兩端的電壓。分壓式的分子要放所求的電阻 $4\\,\\Omega$。",
        "en": "$8\\,\\text{V}$ is the p.d. across the $8\\,\\Omega$ resistor. In the divider formula, the resistor asked about goes on top."
      }
    ]
  },
  {
    "id": "phy_rep_0072",
    "type": "mc",
    "subject": "physics",
    "topic": "electricity",
    "topicZh": "電學",
    "topicEn": "Electricity",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "hard",
    "year": 0,
    "content": "$24\\,\\text{V}$ 電源接上串聯的 $6\\,\\Omega$ 與 $18\\,\\Omega$。求 $6\\,\\Omega$ 兩端的電壓。",
    "explanation": "串聯電路中電流處處相同：$I = \\dfrac{24}{6 + 18} = 1\\,\\text{A}$，故 $V_1 = IR_1 = 6\\,\\text{V}$。等價寫法是分壓式 $V_1 = V \\times \\dfrac{R_1}{R_1 + R_2}$：分子放所求的電阻。",
    "options": [
      "$18\\,\\text{V}$",
      "$12\\,\\text{V}$",
      "$4.5\\,\\text{V}$",
      "$6\\,\\text{V}$"
    ],
    "correctIndex": 3,
    "marks": 1,
    "contentEn": "A $24\\,\\text{V}$ supply is connected across $6\\,\\Omega$ in series with $18\\,\\Omega$. Find the p.d. across the $6\\,\\Omega$ resistor.",
    "optionsEn": [
      "$18\\,\\text{V}$",
      "$12\\,\\text{V}$",
      "$4.5\\,\\text{V}$",
      "$6\\,\\text{V}$"
    ],
    "explanationEn": "In a series circuit the current is the same everywhere: $I = \\dfrac{24}{6 + 18} = 1\\,\\text{A}$, so $V_1 = IR_1 = 6\\,\\text{V}$. Equivalently, the divider formula $V_1 = V \\times \\dfrac{R_1}{R_1 + R_2}$ puts the resistor asked about on top.",
    "frameworkEn": "Auto-gated",
    "optionNotes": [
      {
        "optionId": 0,
        "zh": "$18\\,\\text{V}$ 是 $18\\,\\Omega$ 兩端的電壓。分壓式的分子要放所求的電阻 $6\\,\\Omega$。",
        "en": "$18\\,\\text{V}$ is the p.d. across the $18\\,\\Omega$ resistor. In the divider formula, the resistor asked about goes on top."
      },
      {
        "optionId": 1,
        "zh": "$\\dfrac{24}{2} = 12$ 假設兩個電阻平分電壓，只在兩個電阻相等時才成立。",
        "en": "$\\dfrac{24}{2} = 12$ assumes the two resistors share the voltage equally, which holds only when they are equal."
      },
      {
        "optionId": 2,
        "zh": "用了並聯組合電阻 $\\dfrac{6 \\times 18}{6 + 18} = 4.5\\,\\Omega$ 乘以電流；但兩個電阻是串聯的。",
        "en": "This multiplies the current by the parallel combination $\\dfrac{6 \\times 18}{6 + 18} = 4.5\\,\\Omega$, but the resistors are in series."
      },
      {
        "optionId": 3,
        "zh": "正確。$I = \\dfrac{24}{6 + 18} = 1\\,\\text{A}$，$V_1 = IR_1 = 1 \\times 6 = 6\\,\\text{V}$。",
        "en": "Correct. $I = \\dfrac{24}{6 + 18} = 1\\,\\text{A}$, so $V_1 = IR_1 = 1 \\times 6 = 6\\,\\text{V}$."
      }
    ]
  },
  {
    "id": "phy_rep_0073",
    "type": "mc",
    "subject": "physics",
    "topic": "electricity",
    "topicZh": "電學",
    "topicEn": "Electricity",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "hard",
    "year": 0,
    "content": "$9\\,\\text{V}$ 電源接上串聯的 $3\\,\\Omega$ 與 $6\\,\\Omega$。求 $3\\,\\Omega$ 兩端的電壓。",
    "explanation": "串聯電路中電流處處相同：$I = \\dfrac{9}{3 + 6} = 1\\,\\text{A}$，故 $V_1 = IR_1 = 3\\,\\text{V}$。等價寫法是分壓式 $V_1 = V \\times \\dfrac{R_1}{R_1 + R_2}$：分子放所求的電阻。",
    "options": [
      "$3\\,\\text{V}$",
      "$6\\,\\text{V}$",
      "$4.5\\,\\text{V}$",
      "$2\\,\\text{V}$"
    ],
    "correctIndex": 0,
    "marks": 1,
    "contentEn": "A $9\\,\\text{V}$ supply is connected across $3\\,\\Omega$ in series with $6\\,\\Omega$. Find the p.d. across the $3\\,\\Omega$ resistor.",
    "optionsEn": [
      "$3\\,\\text{V}$",
      "$6\\,\\text{V}$",
      "$4.5\\,\\text{V}$",
      "$2\\,\\text{V}$"
    ],
    "explanationEn": "In a series circuit the current is the same everywhere: $I = \\dfrac{9}{3 + 6} = 1\\,\\text{A}$, so $V_1 = IR_1 = 3\\,\\text{V}$. Equivalently, the divider formula $V_1 = V \\times \\dfrac{R_1}{R_1 + R_2}$ puts the resistor asked about on top.",
    "frameworkEn": "Auto-gated",
    "optionNotes": [
      {
        "optionId": 0,
        "zh": "正確。$I = \\dfrac{9}{3 + 6} = 1\\,\\text{A}$，$V_1 = IR_1 = 1 \\times 3 = 3\\,\\text{V}$。",
        "en": "Correct. $I = \\dfrac{9}{3 + 6} = 1\\,\\text{A}$, so $V_1 = IR_1 = 1 \\times 3 = 3\\,\\text{V}$."
      },
      {
        "optionId": 1,
        "zh": "$6\\,\\text{V}$ 是 $6\\,\\Omega$ 兩端的電壓。分壓式的分子要放所求的電阻 $3\\,\\Omega$。",
        "en": "$6\\,\\text{V}$ is the p.d. across the $6\\,\\Omega$ resistor. In the divider formula, the resistor asked about goes on top."
      },
      {
        "optionId": 2,
        "zh": "$\\dfrac{9}{2} = 4.5$ 假設兩個電阻平分電壓，只在兩個電阻相等時才成立。",
        "en": "$\\dfrac{9}{2} = 4.5$ assumes the two resistors share the voltage equally, which holds only when they are equal."
      },
      {
        "optionId": 3,
        "zh": "用了並聯組合電阻 $\\dfrac{3 \\times 6}{3 + 6} = 2\\,\\Omega$ 乘以電流；但兩個電阻是串聯的。",
        "en": "This multiplies the current by the parallel combination $\\dfrac{3 \\times 6}{3 + 6} = 2\\,\\Omega$, but the resistors are in series."
      }
    ]
  },
  {
    "id": "phy_rep_0074",
    "type": "mc",
    "subject": "physics",
    "topic": "electricity",
    "topicZh": "電學",
    "topicEn": "Electricity",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "hard",
    "year": 0,
    "content": "$18\\,\\text{V}$ 電源接上串聯的 $12\\,\\Omega$ 與 $6\\,\\Omega$。求 $12\\,\\Omega$ 兩端的電壓。",
    "explanation": "串聯電路中電流處處相同：$I = \\dfrac{18}{12 + 6} = 1\\,\\text{A}$，故 $V_1 = IR_1 = 12\\,\\text{V}$。等價寫法是分壓式 $V_1 = V \\times \\dfrac{R_1}{R_1 + R_2}$：分子放所求的電阻。",
    "options": [
      "$4\\,\\text{V}$",
      "$12\\,\\text{V}$",
      "$6\\,\\text{V}$",
      "$9\\,\\text{V}$"
    ],
    "correctIndex": 1,
    "marks": 1,
    "contentEn": "A $18\\,\\text{V}$ supply is connected across $12\\,\\Omega$ in series with $6\\,\\Omega$. Find the p.d. across the $12\\,\\Omega$ resistor.",
    "optionsEn": [
      "$4\\,\\text{V}$",
      "$12\\,\\text{V}$",
      "$6\\,\\text{V}$",
      "$9\\,\\text{V}$"
    ],
    "explanationEn": "In a series circuit the current is the same everywhere: $I = \\dfrac{18}{12 + 6} = 1\\,\\text{A}$, so $V_1 = IR_1 = 12\\,\\text{V}$. Equivalently, the divider formula $V_1 = V \\times \\dfrac{R_1}{R_1 + R_2}$ puts the resistor asked about on top.",
    "frameworkEn": "Auto-gated",
    "optionNotes": [
      {
        "optionId": 0,
        "zh": "用了並聯組合電阻 $\\dfrac{12 \\times 6}{12 + 6} = 4\\,\\Omega$ 乘以電流；但兩個電阻是串聯的。",
        "en": "This multiplies the current by the parallel combination $\\dfrac{12 \\times 6}{12 + 6} = 4\\,\\Omega$, but the resistors are in series."
      },
      {
        "optionId": 1,
        "zh": "正確。$I = \\dfrac{18}{12 + 6} = 1\\,\\text{A}$，$V_1 = IR_1 = 1 \\times 12 = 12\\,\\text{V}$。",
        "en": "Correct. $I = \\dfrac{18}{12 + 6} = 1\\,\\text{A}$, so $V_1 = IR_1 = 1 \\times 12 = 12\\,\\text{V}$."
      },
      {
        "optionId": 2,
        "zh": "$6\\,\\text{V}$ 是 $6\\,\\Omega$ 兩端的電壓。分壓式的分子要放所求的電阻 $12\\,\\Omega$。",
        "en": "$6\\,\\text{V}$ is the p.d. across the $6\\,\\Omega$ resistor. In the divider formula, the resistor asked about goes on top."
      },
      {
        "optionId": 3,
        "zh": "$\\dfrac{18}{2} = 9$ 假設兩個電阻平分電壓，只在兩個電阻相等時才成立。",
        "en": "$\\dfrac{18}{2} = 9$ assumes the two resistors share the voltage equally, which holds only when they are equal."
      }
    ]
  },
  {
    "id": "phy_rep_0075",
    "type": "mc",
    "subject": "physics",
    "topic": "electricity",
    "topicZh": "電學",
    "topicEn": "Electricity",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "hard",
    "year": 0,
    "content": "$30\\,\\text{V}$ 電源接上串聯的 $5\\,\\Omega$ 與 $25\\,\\Omega$。求 $5\\,\\Omega$ 兩端的電壓。",
    "explanation": "串聯電路中電流處處相同：$I = \\dfrac{30}{5 + 25} = 1\\,\\text{A}$，故 $V_1 = IR_1 = 5\\,\\text{V}$。等價寫法是分壓式 $V_1 = V \\times \\dfrac{R_1}{R_1 + R_2}$：分子放所求的電阻。",
    "options": [
      "$15\\,\\text{V}$",
      "$4.1667\\,\\text{V}$",
      "$5\\,\\text{V}$",
      "$25\\,\\text{V}$"
    ],
    "correctIndex": 2,
    "marks": 1,
    "contentEn": "A $30\\,\\text{V}$ supply is connected across $5\\,\\Omega$ in series with $25\\,\\Omega$. Find the p.d. across the $5\\,\\Omega$ resistor.",
    "optionsEn": [
      "$15\\,\\text{V}$",
      "$4.1667\\,\\text{V}$",
      "$5\\,\\text{V}$",
      "$25\\,\\text{V}$"
    ],
    "explanationEn": "In a series circuit the current is the same everywhere: $I = \\dfrac{30}{5 + 25} = 1\\,\\text{A}$, so $V_1 = IR_1 = 5\\,\\text{V}$. Equivalently, the divider formula $V_1 = V \\times \\dfrac{R_1}{R_1 + R_2}$ puts the resistor asked about on top.",
    "frameworkEn": "Auto-gated",
    "optionNotes": [
      {
        "optionId": 0,
        "zh": "$\\dfrac{30}{2} = 15$ 假設兩個電阻平分電壓，只在兩個電阻相等時才成立。",
        "en": "$\\dfrac{30}{2} = 15$ assumes the two resistors share the voltage equally, which holds only when they are equal."
      },
      {
        "optionId": 1,
        "zh": "用了並聯組合電阻 $\\dfrac{5 \\times 25}{5 + 25} \\approx 4.1667\\,\\Omega$ 乘以電流；但兩個電阻是串聯的。",
        "en": "This multiplies the current by the parallel combination $\\dfrac{5 \\times 25}{5 + 25} \\approx 4.1667\\,\\Omega$, but the resistors are in series."
      },
      {
        "optionId": 2,
        "zh": "正確。$I = \\dfrac{30}{5 + 25} = 1\\,\\text{A}$，$V_1 = IR_1 = 1 \\times 5 = 5\\,\\text{V}$。",
        "en": "Correct. $I = \\dfrac{30}{5 + 25} = 1\\,\\text{A}$, so $V_1 = IR_1 = 1 \\times 5 = 5\\,\\text{V}$."
      },
      {
        "optionId": 3,
        "zh": "$25\\,\\text{V}$ 是 $25\\,\\Omega$ 兩端的電壓。分壓式的分子要放所求的電阻 $5\\,\\Omega$。",
        "en": "$25\\,\\text{V}$ is the p.d. across the $25\\,\\Omega$ resistor. In the divider formula, the resistor asked about goes on top."
      }
    ]
  },
  {
    "id": "phy_rep_0076",
    "type": "mc",
    "subject": "physics",
    "topic": "electricity",
    "topicZh": "電學",
    "topicEn": "Electricity",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "hard",
    "year": 0,
    "content": "一個電動勢為 $12\\,\\text{V}$ 的電池接上負載後，端電壓降至 $11.4\\,\\text{V}$，此時電流為 $3\\,\\text{A}$。求電池的內阻。",
    "explanation": "電動勢分成兩部分：一部分落在外電路（端電壓），餘下的落在內阻上。內阻上的電壓 $= 12 - 11.4 = 0.6\\,\\text{V}$，故 $r = 0.6/3 = 0.2\\,\\Omega$。$3.8\\,\\Omega$ 用了端電壓，所得是【外】電阻，不是內阻；$4\\,\\Omega$ 用了整個電動勢，所得是內外電阻之和。$0.6\\,\\Omega$ 停在電壓差就當成電阻，漏了除以電流——留意單位就會發現不對。",
    "options": [
      "$4\\,\\text{\\Omega}$",
      "$3.8\\,\\text{\\Omega}$",
      "$0.6\\,\\text{\\Omega}$",
      "$0.2\\,\\text{\\Omega}$"
    ],
    "correctIndex": 3,
    "marks": 1,
    "contentEn": "A cell of e.m.f. $12\\,\\text{V}$ has its terminal p.d. drop to $11.4\\,\\text{V}$ when it delivers $3\\,\\text{A}$. Find the internal resistance.",
    "optionsEn": [
      "$4\\,\\text{\\Omega}$",
      "$3.8\\,\\text{\\Omega}$",
      "$0.6\\,\\text{\\Omega}$",
      "$0.2\\,\\text{\\Omega}$"
    ],
    "explanationEn": "The e.m.f. splits in two: part appears across the external circuit (the terminal p.d.) and the rest is lost inside the cell. The p.d. across the internal resistance is $12 - 11.4 = 0.6\\,\\text{V}$, so $r = 0.6/3 = 0.2\\,\\Omega$. $3.8\\,\\Omega$ uses the terminal p.d. and gives the *external* resistance; $4\\,\\Omega$ uses the whole e.m.f. and gives internal plus external. $0.6\\,\\Omega$ stops at the voltage difference without dividing by the current — the unit gives it away.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "phy_rep_0077",
    "type": "mc",
    "subject": "physics",
    "topic": "electricity",
    "topicZh": "電學",
    "topicEn": "Electricity",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "hard",
    "year": 0,
    "content": "一個電動勢為 $9\\,\\text{V}$ 的電池接上負載後，端電壓降至 $8.4\\,\\text{V}$，此時電流為 $2\\,\\text{A}$。求電池的內阻。",
    "explanation": "電動勢分成兩部分：一部分落在外電路（端電壓），餘下的落在內阻上。內阻上的電壓 $= 9 - 8.4 = 0.6\\,\\text{V}$，故 $r = 0.6/2 = 0.3\\,\\Omega$。$4.2\\,\\Omega$ 用了端電壓，所得是【外】電阻，不是內阻；$4.5\\,\\Omega$ 用了整個電動勢，所得是內外電阻之和。$0.6\\,\\Omega$ 停在電壓差就當成電阻，漏了除以電流——留意單位就會發現不對。",
    "options": [
      "$0.3\\,\\text{\\Omega}$",
      "$4.5\\,\\text{\\Omega}$",
      "$4.2\\,\\text{\\Omega}$",
      "$0.6\\,\\text{\\Omega}$"
    ],
    "correctIndex": 0,
    "marks": 1,
    "contentEn": "A cell of e.m.f. $9\\,\\text{V}$ has its terminal p.d. drop to $8.4\\,\\text{V}$ when it delivers $2\\,\\text{A}$. Find the internal resistance.",
    "optionsEn": [
      "$0.3\\,\\text{\\Omega}$",
      "$4.5\\,\\text{\\Omega}$",
      "$4.2\\,\\text{\\Omega}$",
      "$0.6\\,\\text{\\Omega}$"
    ],
    "explanationEn": "The e.m.f. splits in two: part appears across the external circuit (the terminal p.d.) and the rest is lost inside the cell. The p.d. across the internal resistance is $9 - 8.4 = 0.6\\,\\text{V}$, so $r = 0.6/2 = 0.3\\,\\Omega$. $4.2\\,\\Omega$ uses the terminal p.d. and gives the *external* resistance; $4.5\\,\\Omega$ uses the whole e.m.f. and gives internal plus external. $0.6\\,\\Omega$ stops at the voltage difference without dividing by the current — the unit gives it away.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "phy_rep_0078",
    "type": "mc",
    "subject": "physics",
    "topic": "electricity",
    "topicZh": "電學",
    "topicEn": "Electricity",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "hard",
    "year": 0,
    "content": "一個電動勢為 $6\\,\\text{V}$ 的電池接上負載後，端電壓降至 $5.6\\,\\text{V}$，此時電流為 $4\\,\\text{A}$。求電池的內阻。",
    "explanation": "電動勢分成兩部分：一部分落在外電路（端電壓），餘下的落在內阻上。內阻上的電壓 $= 6 - 5.6 = 0.4\\,\\text{V}$，故 $r = 0.4/4 = 0.1\\,\\Omega$。$1.4\\,\\Omega$ 用了端電壓，所得是【外】電阻，不是內阻；$1.5\\,\\Omega$ 用了整個電動勢，所得是內外電阻之和。$0.4\\,\\Omega$ 停在電壓差就當成電阻，漏了除以電流——留意單位就會發現不對。",
    "options": [
      "$0.4\\,\\text{\\Omega}$",
      "$0.1\\,\\text{\\Omega}$",
      "$1.5\\,\\text{\\Omega}$",
      "$1.4\\,\\text{\\Omega}$"
    ],
    "correctIndex": 1,
    "marks": 1,
    "contentEn": "A cell of e.m.f. $6\\,\\text{V}$ has its terminal p.d. drop to $5.6\\,\\text{V}$ when it delivers $4\\,\\text{A}$. Find the internal resistance.",
    "optionsEn": [
      "$0.4\\,\\text{\\Omega}$",
      "$0.1\\,\\text{\\Omega}$",
      "$1.5\\,\\text{\\Omega}$",
      "$1.4\\,\\text{\\Omega}$"
    ],
    "explanationEn": "The e.m.f. splits in two: part appears across the external circuit (the terminal p.d.) and the rest is lost inside the cell. The p.d. across the internal resistance is $6 - 5.6 = 0.4\\,\\text{V}$, so $r = 0.4/4 = 0.1\\,\\Omega$. $1.4\\,\\Omega$ uses the terminal p.d. and gives the *external* resistance; $1.5\\,\\Omega$ uses the whole e.m.f. and gives internal plus external. $0.4\\,\\Omega$ stops at the voltage difference without dividing by the current — the unit gives it away.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "phy_rep_0079",
    "type": "mc",
    "subject": "physics",
    "topic": "electricity",
    "topicZh": "電學",
    "topicEn": "Electricity",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "hard",
    "year": 0,
    "content": "一個電動勢為 $12\\,\\text{V}$ 的電池接上負載後，端電壓降至 $10.8\\,\\text{V}$，此時電流為 $4\\,\\text{A}$。求電池的內阻。",
    "explanation": "電動勢分成兩部分：一部分落在外電路（端電壓），餘下的落在內阻上。內阻上的電壓 $= 12 - 10.8 = 1.2\\,\\text{V}$，故 $r = 1.2/4 = 0.3\\,\\Omega$。$2.7\\,\\Omega$ 用了端電壓，所得是【外】電阻，不是內阻；$3\\,\\Omega$ 用了整個電動勢，所得是內外電阻之和。$1.2\\,\\Omega$ 停在電壓差就當成電阻，漏了除以電流——留意單位就會發現不對。",
    "options": [
      "$2.7\\,\\text{\\Omega}$",
      "$1.2\\,\\text{\\Omega}$",
      "$0.3\\,\\text{\\Omega}$",
      "$3\\,\\text{\\Omega}$"
    ],
    "correctIndex": 2,
    "marks": 1,
    "contentEn": "A cell of e.m.f. $12\\,\\text{V}$ has its terminal p.d. drop to $10.8\\,\\text{V}$ when it delivers $4\\,\\text{A}$. Find the internal resistance.",
    "optionsEn": [
      "$2.7\\,\\text{\\Omega}$",
      "$1.2\\,\\text{\\Omega}$",
      "$0.3\\,\\text{\\Omega}$",
      "$3\\,\\text{\\Omega}$"
    ],
    "explanationEn": "The e.m.f. splits in two: part appears across the external circuit (the terminal p.d.) and the rest is lost inside the cell. The p.d. across the internal resistance is $12 - 10.8 = 1.2\\,\\text{V}$, so $r = 1.2/4 = 0.3\\,\\Omega$. $2.7\\,\\Omega$ uses the terminal p.d. and gives the *external* resistance; $3\\,\\Omega$ uses the whole e.m.f. and gives internal plus external. $1.2\\,\\Omega$ stops at the voltage difference without dividing by the current — the unit gives it away.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "phy_rep_0080",
    "type": "mc",
    "subject": "physics",
    "topic": "electricity",
    "topicZh": "電學",
    "topicEn": "Electricity",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "hard",
    "year": 0,
    "content": "一個電動勢為 $24\\,\\text{V}$ 的電池接上負載後，端電壓降至 $22.5\\,\\text{V}$，此時電流為 $5\\,\\text{A}$。求電池的內阻。",
    "explanation": "電動勢分成兩部分：一部分落在外電路（端電壓），餘下的落在內阻上。內阻上的電壓 $= 24 - 22.5 = 1.5\\,\\text{V}$，故 $r = 1.5/5 = 0.3\\,\\Omega$。$4.5\\,\\Omega$ 用了端電壓，所得是【外】電阻，不是內阻；$4.8\\,\\Omega$ 用了整個電動勢，所得是內外電阻之和。$1.5\\,\\Omega$ 停在電壓差就當成電阻，漏了除以電流——留意單位就會發現不對。",
    "options": [
      "$4.8\\,\\text{\\Omega}$",
      "$4.5\\,\\text{\\Omega}$",
      "$1.5\\,\\text{\\Omega}$",
      "$0.3\\,\\text{\\Omega}$"
    ],
    "correctIndex": 3,
    "marks": 1,
    "contentEn": "A cell of e.m.f. $24\\,\\text{V}$ has its terminal p.d. drop to $22.5\\,\\text{V}$ when it delivers $5\\,\\text{A}$. Find the internal resistance.",
    "optionsEn": [
      "$4.8\\,\\text{\\Omega}$",
      "$4.5\\,\\text{\\Omega}$",
      "$1.5\\,\\text{\\Omega}$",
      "$0.3\\,\\text{\\Omega}$"
    ],
    "explanationEn": "The e.m.f. splits in two: part appears across the external circuit (the terminal p.d.) and the rest is lost inside the cell. The p.d. across the internal resistance is $24 - 22.5 = 1.5\\,\\text{V}$, so $r = 1.5/5 = 0.3\\,\\Omega$. $4.5\\,\\Omega$ uses the terminal p.d. and gives the *external* resistance; $4.8\\,\\Omega$ uses the whole e.m.f. and gives internal plus external. $1.5\\,\\Omega$ stops at the voltage difference without dividing by the current — the unit gives it away.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "phy_rep_0007",
    "type": "mc",
    "subject": "physics",
    "topic": "electricity",
    "topicZh": "電學",
    "topicEn": "Electricity",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "同一個電阻器兩端的電壓由 $3\\,\\text{V}$ 改為 $6\\,\\text{V}$，電阻值不變。通過它的電流會變成原來的多少倍？",
    "explanation": "由 $I = \\dfrac{V}{R}$，電阻不變時電流與電壓成【正比】，故電流變為原來的 $\\dfrac{6}{3} = 2$ 倍。與電流成反比的是電阻，不是電壓。",
    "options": [
      "$1$ 倍",
      "$3$ 倍",
      "$2$ 倍",
      "$0.5$ 倍"
    ],
    "correctIndex": 2,
    "marks": 1,
    "contentEn": "The p.d. across a fixed resistor changes from $3\\,\\text{V}$ to $6\\,\\text{V}$, its resistance unchanged. The current becomes how many times the original?",
    "optionsEn": [
      "$1$ times",
      "$3$ times",
      "$2$ times",
      "$0.5$ times"
    ],
    "explanationEn": "From $I = \\dfrac{V}{R}$, with the resistance fixed the current is *proportional* to the voltage, so it becomes $\\dfrac{6}{3} = 2$ times the original. Current is inversely proportional to resistance, not to voltage.",
    "frameworkEn": "Auto-gated",
    "optionNotes": [
      {
        "optionId": 0,
        "zh": "電阻不變不代表電流不變；電壓改變，電流會按相同比例改變。",
        "en": "A fixed resistance does not mean a fixed current; when the voltage changes, the current changes in the same proportion."
      },
      {
        "optionId": 1,
        "zh": "$|6 - 3| = 3$ 是電壓的變化量，不是比值。",
        "en": "$|6 - 3| = 3$ is the change in voltage, not the ratio."
      },
      {
        "optionId": 2,
        "zh": "正確。電阻不變時，電流與電壓成正比：$\\dfrac{6}{3} = 2$。",
        "en": "Correct. With the resistance fixed, current is proportional to voltage: $\\dfrac{6}{3} = 2$."
      },
      {
        "optionId": 3,
        "zh": "$\\dfrac{3}{6} = 0.5$ 把關係看成反比。與電流成反比的是電阻，不是電壓。",
        "en": "$\\dfrac{3}{6} = 0.5$ treats the relation as inverse. Current is inversely proportional to resistance, not to voltage."
      }
    ]
  },
  {
    "id": "phy_rep_0008",
    "type": "mc",
    "subject": "physics",
    "topic": "electricity",
    "topicZh": "電學",
    "topicEn": "Electricity",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "同一個電阻器兩端的電壓由 $4\\,\\text{V}$ 改為 $12\\,\\text{V}$，電阻值不變。通過它的電流會變成原來的多少倍？",
    "explanation": "由 $I = \\dfrac{V}{R}$，電阻不變時電流與電壓成【正比】，故電流變為原來的 $\\dfrac{12}{4} = 3$ 倍。與電流成反比的是電阻，不是電壓。",
    "options": [
      "$0.3333$ 倍",
      "$1$ 倍",
      "$8$ 倍",
      "$3$ 倍"
    ],
    "correctIndex": 3,
    "marks": 1,
    "contentEn": "The p.d. across a fixed resistor changes from $4\\,\\text{V}$ to $12\\,\\text{V}$, its resistance unchanged. The current becomes how many times the original?",
    "optionsEn": [
      "$0.3333$ times",
      "$1$ times",
      "$8$ times",
      "$3$ times"
    ],
    "explanationEn": "From $I = \\dfrac{V}{R}$, with the resistance fixed the current is *proportional* to the voltage, so it becomes $\\dfrac{12}{4} = 3$ times the original. Current is inversely proportional to resistance, not to voltage.",
    "frameworkEn": "Auto-gated",
    "optionNotes": [
      {
        "optionId": 0,
        "zh": "$\\dfrac{4}{12} \\approx 0.3333$ 把關係看成反比。與電流成反比的是電阻，不是電壓。",
        "en": "$\\dfrac{4}{12} \\approx 0.3333$ treats the relation as inverse. Current is inversely proportional to resistance, not to voltage."
      },
      {
        "optionId": 1,
        "zh": "電阻不變不代表電流不變；電壓改變，電流會按相同比例改變。",
        "en": "A fixed resistance does not mean a fixed current; when the voltage changes, the current changes in the same proportion."
      },
      {
        "optionId": 2,
        "zh": "$|12 - 4| = 8$ 是電壓的變化量，不是比值。",
        "en": "$|12 - 4| = 8$ is the change in voltage, not the ratio."
      },
      {
        "optionId": 3,
        "zh": "正確。電阻不變時，電流與電壓成正比：$\\dfrac{12}{4} = 3$。",
        "en": "Correct. With the resistance fixed, current is proportional to voltage: $\\dfrac{12}{4} = 3$."
      }
    ]
  },
  {
    "id": "phy_rep_0009",
    "type": "mc",
    "subject": "physics",
    "topic": "electricity",
    "topicZh": "電學",
    "topicEn": "Electricity",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "同一個電阻器兩端的電壓由 $2\\,\\text{V}$ 改為 $10\\,\\text{V}$，電阻值不變。通過它的電流會變成原來的多少倍？",
    "explanation": "由 $I = \\dfrac{V}{R}$，電阻不變時電流與電壓成【正比】，故電流變為原來的 $\\dfrac{10}{2} = 5$ 倍。與電流成反比的是電阻，不是電壓。",
    "options": [
      "$5$ 倍",
      "$0.2$ 倍",
      "$1$ 倍",
      "$8$ 倍"
    ],
    "correctIndex": 0,
    "marks": 1,
    "contentEn": "The p.d. across a fixed resistor changes from $2\\,\\text{V}$ to $10\\,\\text{V}$, its resistance unchanged. The current becomes how many times the original?",
    "optionsEn": [
      "$5$ times",
      "$0.2$ times",
      "$1$ times",
      "$8$ times"
    ],
    "explanationEn": "From $I = \\dfrac{V}{R}$, with the resistance fixed the current is *proportional* to the voltage, so it becomes $\\dfrac{10}{2} = 5$ times the original. Current is inversely proportional to resistance, not to voltage.",
    "frameworkEn": "Auto-gated",
    "optionNotes": [
      {
        "optionId": 0,
        "zh": "正確。電阻不變時，電流與電壓成正比：$\\dfrac{10}{2} = 5$。",
        "en": "Correct. With the resistance fixed, current is proportional to voltage: $\\dfrac{10}{2} = 5$."
      },
      {
        "optionId": 1,
        "zh": "$\\dfrac{2}{10} = 0.2$ 把關係看成反比。與電流成反比的是電阻，不是電壓。",
        "en": "$\\dfrac{2}{10} = 0.2$ treats the relation as inverse. Current is inversely proportional to resistance, not to voltage."
      },
      {
        "optionId": 2,
        "zh": "電阻不變不代表電流不變；電壓改變，電流會按相同比例改變。",
        "en": "A fixed resistance does not mean a fixed current; when the voltage changes, the current changes in the same proportion."
      },
      {
        "optionId": 3,
        "zh": "$|10 - 2| = 8$ 是電壓的變化量，不是比值。",
        "en": "$|10 - 2| = 8$ is the change in voltage, not the ratio."
      }
    ]
  },
  {
    "id": "phy_rep_0010",
    "type": "mc",
    "subject": "physics",
    "topic": "electricity",
    "topicZh": "電學",
    "topicEn": "Electricity",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "同一個電阻器兩端的電壓由 $5\\,\\text{V}$ 改為 $15\\,\\text{V}$，電阻值不變。通過它的電流會變成原來的多少倍？",
    "explanation": "由 $I = \\dfrac{V}{R}$，電阻不變時電流與電壓成【正比】，故電流變為原來的 $\\dfrac{15}{5} = 3$ 倍。與電流成反比的是電阻，不是電壓。",
    "options": [
      "$10$ 倍",
      "$3$ 倍",
      "$0.3333$ 倍",
      "$1$ 倍"
    ],
    "correctIndex": 1,
    "marks": 1,
    "contentEn": "The p.d. across a fixed resistor changes from $5\\,\\text{V}$ to $15\\,\\text{V}$, its resistance unchanged. The current becomes how many times the original?",
    "optionsEn": [
      "$10$ times",
      "$3$ times",
      "$0.3333$ times",
      "$1$ times"
    ],
    "explanationEn": "From $I = \\dfrac{V}{R}$, with the resistance fixed the current is *proportional* to the voltage, so it becomes $\\dfrac{15}{5} = 3$ times the original. Current is inversely proportional to resistance, not to voltage.",
    "frameworkEn": "Auto-gated",
    "optionNotes": [
      {
        "optionId": 0,
        "zh": "$|15 - 5| = 10$ 是電壓的變化量，不是比值。",
        "en": "$|15 - 5| = 10$ is the change in voltage, not the ratio."
      },
      {
        "optionId": 1,
        "zh": "正確。電阻不變時，電流與電壓成正比：$\\dfrac{15}{5} = 3$。",
        "en": "Correct. With the resistance fixed, current is proportional to voltage: $\\dfrac{15}{5} = 3$."
      },
      {
        "optionId": 2,
        "zh": "$\\dfrac{5}{15} \\approx 0.3333$ 把關係看成反比。與電流成反比的是電阻，不是電壓。",
        "en": "$\\dfrac{5}{15} \\approx 0.3333$ treats the relation as inverse. Current is inversely proportional to resistance, not to voltage."
      },
      {
        "optionId": 3,
        "zh": "電阻不變不代表電流不變；電壓改變，電流會按相同比例改變。",
        "en": "A fixed resistance does not mean a fixed current; when the voltage changes, the current changes in the same proportion."
      }
    ]
  },
  {
    "id": "phy_rep_0011",
    "type": "mc",
    "subject": "physics",
    "topic": "electricity",
    "topicZh": "電學",
    "topicEn": "Electricity",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "同一個電阻器兩端的電壓由 $6\\,\\text{V}$ 改為 $24\\,\\text{V}$，電阻值不變。通過它的電流會變成原來的多少倍？",
    "explanation": "由 $I = \\dfrac{V}{R}$，電阻不變時電流與電壓成【正比】，故電流變為原來的 $\\dfrac{24}{6} = 4$ 倍。與電流成反比的是電阻，不是電壓。",
    "options": [
      "$1$ 倍",
      "$18$ 倍",
      "$4$ 倍",
      "$0.25$ 倍"
    ],
    "correctIndex": 2,
    "marks": 1,
    "contentEn": "The p.d. across a fixed resistor changes from $6\\,\\text{V}$ to $24\\,\\text{V}$, its resistance unchanged. The current becomes how many times the original?",
    "optionsEn": [
      "$1$ times",
      "$18$ times",
      "$4$ times",
      "$0.25$ times"
    ],
    "explanationEn": "From $I = \\dfrac{V}{R}$, with the resistance fixed the current is *proportional* to the voltage, so it becomes $\\dfrac{24}{6} = 4$ times the original. Current is inversely proportional to resistance, not to voltage.",
    "frameworkEn": "Auto-gated",
    "optionNotes": [
      {
        "optionId": 0,
        "zh": "電阻不變不代表電流不變；電壓改變，電流會按相同比例改變。",
        "en": "A fixed resistance does not mean a fixed current; when the voltage changes, the current changes in the same proportion."
      },
      {
        "optionId": 1,
        "zh": "$|24 - 6| = 18$ 是電壓的變化量，不是比值。",
        "en": "$|24 - 6| = 18$ is the change in voltage, not the ratio."
      },
      {
        "optionId": 2,
        "zh": "正確。電阻不變時，電流與電壓成正比：$\\dfrac{24}{6} = 4$。",
        "en": "Correct. With the resistance fixed, current is proportional to voltage: $\\dfrac{24}{6} = 4$."
      },
      {
        "optionId": 3,
        "zh": "$\\dfrac{6}{24} = 0.25$ 把關係看成反比。與電流成反比的是電阻，不是電壓。",
        "en": "$\\dfrac{6}{24} = 0.25$ treats the relation as inverse. Current is inversely proportional to resistance, not to voltage."
      }
    ]
  },
  {
    "id": "phy_rep_0012",
    "type": "mc",
    "subject": "physics",
    "topic": "electricity",
    "topicZh": "電學",
    "topicEn": "Electricity",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "同一個電阻器兩端的電壓由 $8\\,\\text{V}$ 改為 $4\\,\\text{V}$，電阻值不變。通過它的電流會變成原來的多少倍？",
    "explanation": "由 $I = \\dfrac{V}{R}$，電阻不變時電流與電壓成【正比】，故電流變為原來的 $\\dfrac{4}{8} = 0.5$ 倍。與電流成反比的是電阻，不是電壓。",
    "options": [
      "$2$ 倍",
      "$1$ 倍",
      "$4$ 倍",
      "$0.5$ 倍"
    ],
    "correctIndex": 3,
    "marks": 1,
    "contentEn": "The p.d. across a fixed resistor changes from $8\\,\\text{V}$ to $4\\,\\text{V}$, its resistance unchanged. The current becomes how many times the original?",
    "optionsEn": [
      "$2$ times",
      "$1$ times",
      "$4$ times",
      "$0.5$ times"
    ],
    "explanationEn": "From $I = \\dfrac{V}{R}$, with the resistance fixed the current is *proportional* to the voltage, so it becomes $\\dfrac{4}{8} = 0.5$ times the original. Current is inversely proportional to resistance, not to voltage.",
    "frameworkEn": "Auto-gated",
    "optionNotes": [
      {
        "optionId": 0,
        "zh": "$\\dfrac{8}{4} = 2$ 把關係看成反比。與電流成反比的是電阻，不是電壓。",
        "en": "$\\dfrac{8}{4} = 2$ treats the relation as inverse. Current is inversely proportional to resistance, not to voltage."
      },
      {
        "optionId": 1,
        "zh": "電阻不變不代表電流不變；電壓改變，電流會按相同比例改變。",
        "en": "A fixed resistance does not mean a fixed current; when the voltage changes, the current changes in the same proportion."
      },
      {
        "optionId": 2,
        "zh": "$|4 - 8| = 4$ 是電壓的變化量，不是比值。",
        "en": "$|4 - 8| = 4$ is the change in voltage, not the ratio."
      },
      {
        "optionId": 3,
        "zh": "正確。電阻不變時，電流與電壓成正比：$\\dfrac{4}{8} = 0.5$。",
        "en": "Correct. With the resistance fixed, current is proportional to voltage: $\\dfrac{4}{8} = 0.5$."
      }
    ]
  }
]
