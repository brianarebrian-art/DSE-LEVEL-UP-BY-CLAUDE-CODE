// AUTO-GATED question bank —— 由 scripts/qbank/auto-promote.mts 自動入庫。
// 【本檔題目未經真人逐題審批。】機器只能檢驗客觀項目：格式、選項、術語紅線、
// LaTeX、與現有題庫的重複度、topic id 是否已註冊。答案在學術上是否正確，
// 並不在此閘的能力範圍之內 —— 故出題端必須 correct-by-construction，或引用
// 可查證的原文。前端 QuestionProvenance 會如實向學生顯示
// 「經自動檢查 …本題未有實名逐題審批紀錄」。
//   subject  : m1
//   count    : 102  (easy 52 / medium 48 / hard 2)
//   types    : mc 102 / text 0 / long 0
//   updated  : 2026-08-22
// 請勿手動編輯 —— 修改將於下次執行 auto-promote 時被覆寫。
import type { Question } from './types'

export const m1AutoQuestions: Question[] = [
  {
    "id": "m1_rep_0001",
    "type": "mc",
    "subject": "m1",
    "topic": "differentiation",
    "topicZh": "微分法",
    "topicEn": "Differentiation",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "求 $\\dfrac{d}{dx}\\left(x^{3} \\sin 2x\\right)$。",
    "explanation": "兩個函數相乘，要用積法則 $(uv)' = u'v + uv'$。取 $u = x^{3}$、$v = \\sin 2x$，則 $u' = 3x^{2}$；$\\sin 2x$ 對 $x$ 求導時，鏈式法則帶出因子 $2$，所以 $v' = 2\\cos 2x$。代入得 $3x^{2} \\sin 2x + 2x^{3} \\cos 2x$。",
    "options": [
      "$3x^{2} \\sin 2x + 2x^{3} \\cos 2x$",
      "$6x^{2} \\cos 2x$",
      "$3x^{2} \\sin 2x + x^{3} \\cos 2x$",
      "$3x^{2} \\cos 2x + 2x^{3} \\sin 2x$"
    ],
    "correctIndex": 0,
    "marks": 1,
    "contentEn": "Find $\\dfrac{d}{dx}\\left(x^{3} \\sin 2x\\right)$.",
    "optionsEn": [
      "$3x^{2} \\sin 2x + 2x^{3} \\cos 2x$",
      "$6x^{2} \\cos 2x$",
      "$3x^{2} \\sin 2x + x^{3} \\cos 2x$",
      "$3x^{2} \\cos 2x + 2x^{3} \\sin 2x$"
    ],
    "explanationEn": "A product of two functions needs the product rule $(uv)' = u'v + uv'$. Take $u = x^{3}$ and $v = \\sin 2x$, so $u' = 3x^{2}$; differentiating $\\sin 2x$, the chain rule brings out the factor $2$, so $v' = 2\\cos 2x$. Substituting gives $3x^{2} \\sin 2x + 2x^{3} \\cos 2x$.",
    "frameworkEn": "Auto-gated",
    "optionNotes": [
      {
        "optionId": 0,
        "zh": "正確。$u'v = 3x^{2} \\sin 2x$，$uv' = 2x^{3} \\cos 2x$，兩項相加即得。",
        "en": "Correct. $u'v = 3x^{2} \\sin 2x$ and $uv' = 2x^{3} \\cos 2x$; add the two terms."
      },
      {
        "optionId": 1,
        "zh": "把兩個導數直接相乘：$3x^{2} \\times 2\\cos 2x = 6x^{2} \\cos 2x$。導數沒有這種乘法規則，這是初學積法則最常見的錯誤。",
        "en": "This multiplies the two derivatives: $3x^{2} \\times 2\\cos 2x = 6x^{2} \\cos 2x$. Derivatives have no such rule; it is the most common first mistake with products."
      },
      {
        "optionId": 2,
        "zh": "$uv'$ 一項漏了鏈式法則帶出的因子 $2$：$\\sin 2x$ 的導數是 $2\\cos 2x$，不是 $\\cos 2x$。",
        "en": "The $uv'$ term is missing the factor $2$ from the chain rule: the derivative of $\\sin 2x$ is $2\\cos 2x$, not $\\cos 2x$."
      },
      {
        "optionId": 3,
        "zh": "$\\sin$ 與 $\\cos$ 放錯了位置。被求導的是 $v = \\sin 2x$，所以 $\\cos 2x$ 應出現在 $uv'$ 一項；$u'v$ 一項保留原來的 $\\sin 2x$。",
        "en": "$\\sin$ and $\\cos$ are in the wrong places. It is $v = \\sin 2x$ that is differentiated, so $\\cos 2x$ belongs in the $uv'$ term, while the $u'v$ term keeps $\\sin 2x$."
      }
    ]
  },
  {
    "id": "m1_rep_0002",
    "type": "mc",
    "subject": "m1",
    "topic": "differentiation",
    "topicZh": "微分法",
    "topicEn": "Differentiation",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "求 $\\dfrac{d}{dx}\\left(x^{2} \\sin 3x\\right)$。",
    "explanation": "兩個函數相乘，要用積法則 $(uv)' = u'v + uv'$。取 $u = x^{2}$、$v = \\sin 3x$，則 $u' = 2x$；$\\sin 3x$ 對 $x$ 求導時，鏈式法則帶出因子 $3$，所以 $v' = 3\\cos 3x$。代入得 $2x \\sin 3x + 3x^{2} \\cos 3x$。",
    "options": [
      "$2x \\cos 3x + 3x^{2} \\sin 3x$",
      "$2x \\sin 3x + 3x^{2} \\cos 3x$",
      "$6x \\cos 3x$",
      "$2x \\sin 3x + x^{2} \\cos 3x$"
    ],
    "correctIndex": 1,
    "marks": 1,
    "contentEn": "Find $\\dfrac{d}{dx}\\left(x^{2} \\sin 3x\\right)$.",
    "optionsEn": [
      "$2x \\cos 3x + 3x^{2} \\sin 3x$",
      "$2x \\sin 3x + 3x^{2} \\cos 3x$",
      "$6x \\cos 3x$",
      "$2x \\sin 3x + x^{2} \\cos 3x$"
    ],
    "explanationEn": "A product of two functions needs the product rule $(uv)' = u'v + uv'$. Take $u = x^{2}$ and $v = \\sin 3x$, so $u' = 2x$; differentiating $\\sin 3x$, the chain rule brings out the factor $3$, so $v' = 3\\cos 3x$. Substituting gives $2x \\sin 3x + 3x^{2} \\cos 3x$.",
    "frameworkEn": "Auto-gated",
    "optionNotes": [
      {
        "optionId": 0,
        "zh": "$\\sin$ 與 $\\cos$ 放錯了位置。被求導的是 $v = \\sin 3x$，所以 $\\cos 3x$ 應出現在 $uv'$ 一項；$u'v$ 一項保留原來的 $\\sin 3x$。",
        "en": "$\\sin$ and $\\cos$ are in the wrong places. It is $v = \\sin 3x$ that is differentiated, so $\\cos 3x$ belongs in the $uv'$ term, while the $u'v$ term keeps $\\sin 3x$."
      },
      {
        "optionId": 1,
        "zh": "正確。$u'v = 2x \\sin 3x$，$uv' = 3x^{2} \\cos 3x$，兩項相加即得。",
        "en": "Correct. $u'v = 2x \\sin 3x$ and $uv' = 3x^{2} \\cos 3x$; add the two terms."
      },
      {
        "optionId": 2,
        "zh": "把兩個導數直接相乘：$2x \\times 3\\cos 3x = 6x \\cos 3x$。導數沒有這種乘法規則，這是初學積法則最常見的錯誤。",
        "en": "This multiplies the two derivatives: $2x \\times 3\\cos 3x = 6x \\cos 3x$. Derivatives have no such rule; it is the most common first mistake with products."
      },
      {
        "optionId": 3,
        "zh": "$uv'$ 一項漏了鏈式法則帶出的因子 $3$：$\\sin 3x$ 的導數是 $3\\cos 3x$，不是 $\\cos 3x$。",
        "en": "The $uv'$ term is missing the factor $3$ from the chain rule: the derivative of $\\sin 3x$ is $3\\cos 3x$, not $\\cos 3x$."
      }
    ]
  },
  {
    "id": "m1_rep_0003",
    "type": "mc",
    "subject": "m1",
    "topic": "differentiation",
    "topicZh": "微分法",
    "topicEn": "Differentiation",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "求 $\\dfrac{d}{dx}\\left(x^{3} \\sin 4x\\right)$。",
    "explanation": "兩個函數相乘，要用積法則 $(uv)' = u'v + uv'$。取 $u = x^{3}$、$v = \\sin 4x$，則 $u' = 3x^{2}$；$\\sin 4x$ 對 $x$ 求導時，鏈式法則帶出因子 $4$，所以 $v' = 4\\cos 4x$。代入得 $3x^{2} \\sin 4x + 4x^{3} \\cos 4x$。",
    "options": [
      "$3x^{2} \\sin 4x + x^{3} \\cos 4x$",
      "$3x^{2} \\cos 4x + 4x^{3} \\sin 4x$",
      "$3x^{2} \\sin 4x + 4x^{3} \\cos 4x$",
      "$12x^{2} \\cos 4x$"
    ],
    "correctIndex": 2,
    "marks": 1,
    "contentEn": "Find $\\dfrac{d}{dx}\\left(x^{3} \\sin 4x\\right)$.",
    "optionsEn": [
      "$3x^{2} \\sin 4x + x^{3} \\cos 4x$",
      "$3x^{2} \\cos 4x + 4x^{3} \\sin 4x$",
      "$3x^{2} \\sin 4x + 4x^{3} \\cos 4x$",
      "$12x^{2} \\cos 4x$"
    ],
    "explanationEn": "A product of two functions needs the product rule $(uv)' = u'v + uv'$. Take $u = x^{3}$ and $v = \\sin 4x$, so $u' = 3x^{2}$; differentiating $\\sin 4x$, the chain rule brings out the factor $4$, so $v' = 4\\cos 4x$. Substituting gives $3x^{2} \\sin 4x + 4x^{3} \\cos 4x$.",
    "frameworkEn": "Auto-gated",
    "optionNotes": [
      {
        "optionId": 0,
        "zh": "$uv'$ 一項漏了鏈式法則帶出的因子 $4$：$\\sin 4x$ 的導數是 $4\\cos 4x$，不是 $\\cos 4x$。",
        "en": "The $uv'$ term is missing the factor $4$ from the chain rule: the derivative of $\\sin 4x$ is $4\\cos 4x$, not $\\cos 4x$."
      },
      {
        "optionId": 1,
        "zh": "$\\sin$ 與 $\\cos$ 放錯了位置。被求導的是 $v = \\sin 4x$，所以 $\\cos 4x$ 應出現在 $uv'$ 一項；$u'v$ 一項保留原來的 $\\sin 4x$。",
        "en": "$\\sin$ and $\\cos$ are in the wrong places. It is $v = \\sin 4x$ that is differentiated, so $\\cos 4x$ belongs in the $uv'$ term, while the $u'v$ term keeps $\\sin 4x$."
      },
      {
        "optionId": 2,
        "zh": "正確。$u'v = 3x^{2} \\sin 4x$，$uv' = 4x^{3} \\cos 4x$，兩項相加即得。",
        "en": "Correct. $u'v = 3x^{2} \\sin 4x$ and $uv' = 4x^{3} \\cos 4x$; add the two terms."
      },
      {
        "optionId": 3,
        "zh": "把兩個導數直接相乘：$3x^{2} \\times 4\\cos 4x = 12x^{2} \\cos 4x$。導數沒有這種乘法規則，這是初學積法則最常見的錯誤。",
        "en": "This multiplies the two derivatives: $3x^{2} \\times 4\\cos 4x = 12x^{2} \\cos 4x$. Derivatives have no such rule; it is the most common first mistake with products."
      }
    ]
  },
  {
    "id": "m1_rep_0004",
    "type": "mc",
    "subject": "m1",
    "topic": "differentiation",
    "topicZh": "微分法",
    "topicEn": "Differentiation",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "求 $\\dfrac{d}{dx}\\left(x^{2} \\sin 5x\\right)$。",
    "explanation": "兩個函數相乘，要用積法則 $(uv)' = u'v + uv'$。取 $u = x^{2}$、$v = \\sin 5x$，則 $u' = 2x$；$\\sin 5x$ 對 $x$ 求導時，鏈式法則帶出因子 $5$，所以 $v' = 5\\cos 5x$。代入得 $2x \\sin 5x + 5x^{2} \\cos 5x$。",
    "options": [
      "$10x \\cos 5x$",
      "$2x \\sin 5x + x^{2} \\cos 5x$",
      "$2x \\cos 5x + 5x^{2} \\sin 5x$",
      "$2x \\sin 5x + 5x^{2} \\cos 5x$"
    ],
    "correctIndex": 3,
    "marks": 1,
    "contentEn": "Find $\\dfrac{d}{dx}\\left(x^{2} \\sin 5x\\right)$.",
    "optionsEn": [
      "$10x \\cos 5x$",
      "$2x \\sin 5x + x^{2} \\cos 5x$",
      "$2x \\cos 5x + 5x^{2} \\sin 5x$",
      "$2x \\sin 5x + 5x^{2} \\cos 5x$"
    ],
    "explanationEn": "A product of two functions needs the product rule $(uv)' = u'v + uv'$. Take $u = x^{2}$ and $v = \\sin 5x$, so $u' = 2x$; differentiating $\\sin 5x$, the chain rule brings out the factor $5$, so $v' = 5\\cos 5x$. Substituting gives $2x \\sin 5x + 5x^{2} \\cos 5x$.",
    "frameworkEn": "Auto-gated",
    "optionNotes": [
      {
        "optionId": 0,
        "zh": "把兩個導數直接相乘：$2x \\times 5\\cos 5x = 10x \\cos 5x$。導數沒有這種乘法規則，這是初學積法則最常見的錯誤。",
        "en": "This multiplies the two derivatives: $2x \\times 5\\cos 5x = 10x \\cos 5x$. Derivatives have no such rule; it is the most common first mistake with products."
      },
      {
        "optionId": 1,
        "zh": "$uv'$ 一項漏了鏈式法則帶出的因子 $5$：$\\sin 5x$ 的導數是 $5\\cos 5x$，不是 $\\cos 5x$。",
        "en": "The $uv'$ term is missing the factor $5$ from the chain rule: the derivative of $\\sin 5x$ is $5\\cos 5x$, not $\\cos 5x$."
      },
      {
        "optionId": 2,
        "zh": "$\\sin$ 與 $\\cos$ 放錯了位置。被求導的是 $v = \\sin 5x$，所以 $\\cos 5x$ 應出現在 $uv'$ 一項；$u'v$ 一項保留原來的 $\\sin 5x$。",
        "en": "$\\sin$ and $\\cos$ are in the wrong places. It is $v = \\sin 5x$ that is differentiated, so $\\cos 5x$ belongs in the $uv'$ term, while the $u'v$ term keeps $\\sin 5x$."
      },
      {
        "optionId": 3,
        "zh": "正確。$u'v = 2x \\sin 5x$，$uv' = 5x^{2} \\cos 5x$，兩項相加即得。",
        "en": "Correct. $u'v = 2x \\sin 5x$ and $uv' = 5x^{2} \\cos 5x$; add the two terms."
      }
    ]
  },
  {
    "id": "m1_rep_0005",
    "type": "mc",
    "subject": "m1",
    "topic": "differentiation",
    "topicZh": "微分法",
    "topicEn": "Differentiation",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "求 $\\dfrac{d}{dx}\\left(x^{4} \\sin 2x\\right)$。",
    "explanation": "兩個函數相乘，要用積法則 $(uv)' = u'v + uv'$。取 $u = x^{4}$、$v = \\sin 2x$，則 $u' = 4x^{3}$；$\\sin 2x$ 對 $x$ 求導時，鏈式法則帶出因子 $2$，所以 $v' = 2\\cos 2x$。代入得 $4x^{3} \\sin 2x + 2x^{4} \\cos 2x$。",
    "options": [
      "$4x^{3} \\sin 2x + 2x^{4} \\cos 2x$",
      "$8x^{3} \\cos 2x$",
      "$4x^{3} \\sin 2x + x^{4} \\cos 2x$",
      "$4x^{3} \\cos 2x + 2x^{4} \\sin 2x$"
    ],
    "correctIndex": 0,
    "marks": 1,
    "contentEn": "Find $\\dfrac{d}{dx}\\left(x^{4} \\sin 2x\\right)$.",
    "optionsEn": [
      "$4x^{3} \\sin 2x + 2x^{4} \\cos 2x$",
      "$8x^{3} \\cos 2x$",
      "$4x^{3} \\sin 2x + x^{4} \\cos 2x$",
      "$4x^{3} \\cos 2x + 2x^{4} \\sin 2x$"
    ],
    "explanationEn": "A product of two functions needs the product rule $(uv)' = u'v + uv'$. Take $u = x^{4}$ and $v = \\sin 2x$, so $u' = 4x^{3}$; differentiating $\\sin 2x$, the chain rule brings out the factor $2$, so $v' = 2\\cos 2x$. Substituting gives $4x^{3} \\sin 2x + 2x^{4} \\cos 2x$.",
    "frameworkEn": "Auto-gated",
    "optionNotes": [
      {
        "optionId": 0,
        "zh": "正確。$u'v = 4x^{3} \\sin 2x$，$uv' = 2x^{4} \\cos 2x$，兩項相加即得。",
        "en": "Correct. $u'v = 4x^{3} \\sin 2x$ and $uv' = 2x^{4} \\cos 2x$; add the two terms."
      },
      {
        "optionId": 1,
        "zh": "把兩個導數直接相乘：$4x^{3} \\times 2\\cos 2x = 8x^{3} \\cos 2x$。導數沒有這種乘法規則，這是初學積法則最常見的錯誤。",
        "en": "This multiplies the two derivatives: $4x^{3} \\times 2\\cos 2x = 8x^{3} \\cos 2x$. Derivatives have no such rule; it is the most common first mistake with products."
      },
      {
        "optionId": 2,
        "zh": "$uv'$ 一項漏了鏈式法則帶出的因子 $2$：$\\sin 2x$ 的導數是 $2\\cos 2x$，不是 $\\cos 2x$。",
        "en": "The $uv'$ term is missing the factor $2$ from the chain rule: the derivative of $\\sin 2x$ is $2\\cos 2x$, not $\\cos 2x$."
      },
      {
        "optionId": 3,
        "zh": "$\\sin$ 與 $\\cos$ 放錯了位置。被求導的是 $v = \\sin 2x$，所以 $\\cos 2x$ 應出現在 $uv'$ 一項；$u'v$ 一項保留原來的 $\\sin 2x$。",
        "en": "$\\sin$ and $\\cos$ are in the wrong places. It is $v = \\sin 2x$ that is differentiated, so $\\cos 2x$ belongs in the $uv'$ term, while the $u'v$ term keeps $\\sin 2x$."
      }
    ]
  },
  {
    "id": "m1_rep_0006",
    "type": "mc",
    "subject": "m1",
    "topic": "differentiation",
    "topicZh": "微分法",
    "topicEn": "Differentiation",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "求 $\\dfrac{d}{dx}\\left(x^{3} \\sin 6x\\right)$。",
    "explanation": "兩個函數相乘，要用積法則 $(uv)' = u'v + uv'$。取 $u = x^{3}$、$v = \\sin 6x$，則 $u' = 3x^{2}$；$\\sin 6x$ 對 $x$ 求導時，鏈式法則帶出因子 $6$，所以 $v' = 6\\cos 6x$。代入得 $3x^{2} \\sin 6x + 6x^{3} \\cos 6x$。",
    "options": [
      "$3x^{2} \\cos 6x + 6x^{3} \\sin 6x$",
      "$3x^{2} \\sin 6x + 6x^{3} \\cos 6x$",
      "$18x^{2} \\cos 6x$",
      "$3x^{2} \\sin 6x + x^{3} \\cos 6x$"
    ],
    "correctIndex": 1,
    "marks": 1,
    "contentEn": "Find $\\dfrac{d}{dx}\\left(x^{3} \\sin 6x\\right)$.",
    "optionsEn": [
      "$3x^{2} \\cos 6x + 6x^{3} \\sin 6x$",
      "$3x^{2} \\sin 6x + 6x^{3} \\cos 6x$",
      "$18x^{2} \\cos 6x$",
      "$3x^{2} \\sin 6x + x^{3} \\cos 6x$"
    ],
    "explanationEn": "A product of two functions needs the product rule $(uv)' = u'v + uv'$. Take $u = x^{3}$ and $v = \\sin 6x$, so $u' = 3x^{2}$; differentiating $\\sin 6x$, the chain rule brings out the factor $6$, so $v' = 6\\cos 6x$. Substituting gives $3x^{2} \\sin 6x + 6x^{3} \\cos 6x$.",
    "frameworkEn": "Auto-gated",
    "optionNotes": [
      {
        "optionId": 0,
        "zh": "$\\sin$ 與 $\\cos$ 放錯了位置。被求導的是 $v = \\sin 6x$，所以 $\\cos 6x$ 應出現在 $uv'$ 一項；$u'v$ 一項保留原來的 $\\sin 6x$。",
        "en": "$\\sin$ and $\\cos$ are in the wrong places. It is $v = \\sin 6x$ that is differentiated, so $\\cos 6x$ belongs in the $uv'$ term, while the $u'v$ term keeps $\\sin 6x$."
      },
      {
        "optionId": 1,
        "zh": "正確。$u'v = 3x^{2} \\sin 6x$，$uv' = 6x^{3} \\cos 6x$，兩項相加即得。",
        "en": "Correct. $u'v = 3x^{2} \\sin 6x$ and $uv' = 6x^{3} \\cos 6x$; add the two terms."
      },
      {
        "optionId": 2,
        "zh": "把兩個導數直接相乘：$3x^{2} \\times 6\\cos 6x = 18x^{2} \\cos 6x$。導數沒有這種乘法規則，這是初學積法則最常見的錯誤。",
        "en": "This multiplies the two derivatives: $3x^{2} \\times 6\\cos 6x = 18x^{2} \\cos 6x$. Derivatives have no such rule; it is the most common first mistake with products."
      },
      {
        "optionId": 3,
        "zh": "$uv'$ 一項漏了鏈式法則帶出的因子 $6$：$\\sin 6x$ 的導數是 $6\\cos 6x$，不是 $\\cos 6x$。",
        "en": "The $uv'$ term is missing the factor $6$ from the chain rule: the derivative of $\\sin 6x$ is $6\\cos 6x$, not $\\cos 6x$."
      }
    ]
  },
  {
    "id": "m1_rep_0007",
    "type": "mc",
    "subject": "m1",
    "topic": "differentiation",
    "topicZh": "微分法",
    "topicEn": "Differentiation",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "求 $\\dfrac{d}{dx}\\left(\\dfrac{3x}{x + 2}\\right)$。",
    "explanation": "用商法則 $\\left(\\dfrac{u}{v}\\right)' = \\dfrac{u'v - uv'}{v^{2}}$。取 $u = 3x$、$v = x + 2$，則 $u' = 3$、$v' = 1$。分子 $= 3(x + 2) - 3x \\cdot 1 = 6$，故導數為 $\\dfrac{6}{(x + 2)^{2}}$。分子的 $x$ 項恰好抵銷，是這類題目的特徵。",
    "options": [
      "$3$",
      "$\\dfrac{-6}{(x + 2)^{2}}$",
      "$\\dfrac{6}{(x + 2)^{2}}$",
      "$\\dfrac{3}{(x + 2)^{2}}$"
    ],
    "correctIndex": 2,
    "marks": 1,
    "contentEn": "Find $\\dfrac{d}{dx}\\left(\\dfrac{3x}{x + 2}\\right)$.",
    "optionsEn": [
      "$3$",
      "$\\dfrac{-6}{(x + 2)^{2}}$",
      "$\\dfrac{6}{(x + 2)^{2}}$",
      "$\\dfrac{3}{(x + 2)^{2}}$"
    ],
    "explanationEn": "Apply the quotient rule $\\left(\\dfrac{u}{v}\\right)' = \\dfrac{u'v - uv'}{v^{2}}$ with $u = 3x$ and $v = x + 2$, so $u' = 3$ and $v' = 1$. The numerator is $3(x + 2) - 3x \\cdot 1 = 6$, giving $\\dfrac{6}{(x + 2)^{2}}$. The $x$ terms cancel exactly, which is characteristic of this type.",
    "frameworkEn": "Auto-gated",
    "optionNotes": [
      {
        "optionId": 0,
        "zh": "分別對分子和分母求導再相除：$\\dfrac{u'}{v'} = \\dfrac{3}{1} = 3$。商的導數並不等於導數的商。",
        "en": "This differentiates the top and the bottom separately and divides: $\\dfrac{u'}{v'} = \\dfrac{3}{1} = 3$. The derivative of a quotient is not the quotient of the derivatives."
      },
      {
        "optionId": 1,
        "zh": "分子寫成 $uv' - u'v$，減法次序調轉了，所以答案的正負號相反。商法則的分子必須是 $u'v$ 在前。",
        "en": "The numerator was written as $uv' - u'v$, the subtraction the wrong way round, so the sign is flipped. In the quotient rule $u'v$ always comes first."
      },
      {
        "optionId": 2,
        "zh": "正確。分子 $u'v - uv' = 3(x + 2) - 3x = 6$，分母為 $(x + 2)^{2}$。",
        "en": "Correct. The numerator is $u'v - uv' = 3(x + 2) - 3x = 6$ and the denominator is $(x + 2)^{2}$."
      },
      {
        "optionId": 3,
        "zh": "分子只寫了 $u' = 3$，漏了 $u'v - uv'$ 的結構。",
        "en": "The numerator is just $u' = 3$; the $u'v - uv'$ structure is missing."
      }
    ]
  },
  {
    "id": "m1_rep_0008",
    "type": "mc",
    "subject": "m1",
    "topic": "differentiation",
    "topicZh": "微分法",
    "topicEn": "Differentiation",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "求 $\\dfrac{d}{dx}\\left(\\dfrac{5x}{x + 3}\\right)$。",
    "explanation": "用商法則 $\\left(\\dfrac{u}{v}\\right)' = \\dfrac{u'v - uv'}{v^{2}}$。取 $u = 5x$、$v = x + 3$，則 $u' = 5$、$v' = 1$。分子 $= 5(x + 3) - 5x \\cdot 1 = 15$，故導數為 $\\dfrac{15}{(x + 3)^{2}}$。分子的 $x$ 項恰好抵銷，是這類題目的特徵。",
    "options": [
      "$\\dfrac{5}{(x + 3)^{2}}$",
      "$5$",
      "$\\dfrac{-15}{(x + 3)^{2}}$",
      "$\\dfrac{15}{(x + 3)^{2}}$"
    ],
    "correctIndex": 3,
    "marks": 1,
    "contentEn": "Find $\\dfrac{d}{dx}\\left(\\dfrac{5x}{x + 3}\\right)$.",
    "optionsEn": [
      "$\\dfrac{5}{(x + 3)^{2}}$",
      "$5$",
      "$\\dfrac{-15}{(x + 3)^{2}}$",
      "$\\dfrac{15}{(x + 3)^{2}}$"
    ],
    "explanationEn": "Apply the quotient rule $\\left(\\dfrac{u}{v}\\right)' = \\dfrac{u'v - uv'}{v^{2}}$ with $u = 5x$ and $v = x + 3$, so $u' = 5$ and $v' = 1$. The numerator is $5(x + 3) - 5x \\cdot 1 = 15$, giving $\\dfrac{15}{(x + 3)^{2}}$. The $x$ terms cancel exactly, which is characteristic of this type.",
    "frameworkEn": "Auto-gated",
    "optionNotes": [
      {
        "optionId": 0,
        "zh": "分子只寫了 $u' = 5$，漏了 $u'v - uv'$ 的結構。",
        "en": "The numerator is just $u' = 5$; the $u'v - uv'$ structure is missing."
      },
      {
        "optionId": 1,
        "zh": "分別對分子和分母求導再相除：$\\dfrac{u'}{v'} = \\dfrac{5}{1} = 5$。商的導數並不等於導數的商。",
        "en": "This differentiates the top and the bottom separately and divides: $\\dfrac{u'}{v'} = \\dfrac{5}{1} = 5$. The derivative of a quotient is not the quotient of the derivatives."
      },
      {
        "optionId": 2,
        "zh": "分子寫成 $uv' - u'v$，減法次序調轉了，所以答案的正負號相反。商法則的分子必須是 $u'v$ 在前。",
        "en": "The numerator was written as $uv' - u'v$, the subtraction the wrong way round, so the sign is flipped. In the quotient rule $u'v$ always comes first."
      },
      {
        "optionId": 3,
        "zh": "正確。分子 $u'v - uv' = 5(x + 3) - 5x = 15$，分母為 $(x + 3)^{2}$。",
        "en": "Correct. The numerator is $u'v - uv' = 5(x + 3) - 5x = 15$ and the denominator is $(x + 3)^{2}$."
      }
    ]
  },
  {
    "id": "m1_rep_0009",
    "type": "mc",
    "subject": "m1",
    "topic": "differentiation",
    "topicZh": "微分法",
    "topicEn": "Differentiation",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "求 $\\dfrac{d}{dx}\\left(\\dfrac{2x}{x + 7}\\right)$。",
    "explanation": "用商法則 $\\left(\\dfrac{u}{v}\\right)' = \\dfrac{u'v - uv'}{v^{2}}$。取 $u = 2x$、$v = x + 7$，則 $u' = 2$、$v' = 1$。分子 $= 2(x + 7) - 2x \\cdot 1 = 14$，故導數為 $\\dfrac{14}{(x + 7)^{2}}$。分子的 $x$ 項恰好抵銷，是這類題目的特徵。",
    "options": [
      "$\\dfrac{14}{(x + 7)^{2}}$",
      "$\\dfrac{2}{(x + 7)^{2}}$",
      "$2$",
      "$\\dfrac{-14}{(x + 7)^{2}}$"
    ],
    "correctIndex": 0,
    "marks": 1,
    "contentEn": "Find $\\dfrac{d}{dx}\\left(\\dfrac{2x}{x + 7}\\right)$.",
    "optionsEn": [
      "$\\dfrac{14}{(x + 7)^{2}}$",
      "$\\dfrac{2}{(x + 7)^{2}}$",
      "$2$",
      "$\\dfrac{-14}{(x + 7)^{2}}$"
    ],
    "explanationEn": "Apply the quotient rule $\\left(\\dfrac{u}{v}\\right)' = \\dfrac{u'v - uv'}{v^{2}}$ with $u = 2x$ and $v = x + 7$, so $u' = 2$ and $v' = 1$. The numerator is $2(x + 7) - 2x \\cdot 1 = 14$, giving $\\dfrac{14}{(x + 7)^{2}}$. The $x$ terms cancel exactly, which is characteristic of this type.",
    "frameworkEn": "Auto-gated",
    "optionNotes": [
      {
        "optionId": 0,
        "zh": "正確。分子 $u'v - uv' = 2(x + 7) - 2x = 14$，分母為 $(x + 7)^{2}$。",
        "en": "Correct. The numerator is $u'v - uv' = 2(x + 7) - 2x = 14$ and the denominator is $(x + 7)^{2}$."
      },
      {
        "optionId": 1,
        "zh": "分子只寫了 $u' = 2$，漏了 $u'v - uv'$ 的結構。",
        "en": "The numerator is just $u' = 2$; the $u'v - uv'$ structure is missing."
      },
      {
        "optionId": 2,
        "zh": "分別對分子和分母求導再相除：$\\dfrac{u'}{v'} = \\dfrac{2}{1} = 2$。商的導數並不等於導數的商。",
        "en": "This differentiates the top and the bottom separately and divides: $\\dfrac{u'}{v'} = \\dfrac{2}{1} = 2$. The derivative of a quotient is not the quotient of the derivatives."
      },
      {
        "optionId": 3,
        "zh": "分子寫成 $uv' - u'v$，減法次序調轉了，所以答案的正負號相反。商法則的分子必須是 $u'v$ 在前。",
        "en": "The numerator was written as $uv' - u'v$, the subtraction the wrong way round, so the sign is flipped. In the quotient rule $u'v$ always comes first."
      }
    ]
  },
  {
    "id": "m1_rep_0010",
    "type": "mc",
    "subject": "m1",
    "topic": "differentiation",
    "topicZh": "微分法",
    "topicEn": "Differentiation",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "求 $\\dfrac{d}{dx}\\left(\\dfrac{4x}{x + 5}\\right)$。",
    "explanation": "用商法則 $\\left(\\dfrac{u}{v}\\right)' = \\dfrac{u'v - uv'}{v^{2}}$。取 $u = 4x$、$v = x + 5$，則 $u' = 4$、$v' = 1$。分子 $= 4(x + 5) - 4x \\cdot 1 = 20$，故導數為 $\\dfrac{20}{(x + 5)^{2}}$。分子的 $x$ 項恰好抵銷，是這類題目的特徵。",
    "options": [
      "$\\dfrac{-20}{(x + 5)^{2}}$",
      "$\\dfrac{20}{(x + 5)^{2}}$",
      "$\\dfrac{4}{(x + 5)^{2}}$",
      "$4$"
    ],
    "correctIndex": 1,
    "marks": 1,
    "contentEn": "Find $\\dfrac{d}{dx}\\left(\\dfrac{4x}{x + 5}\\right)$.",
    "optionsEn": [
      "$\\dfrac{-20}{(x + 5)^{2}}$",
      "$\\dfrac{20}{(x + 5)^{2}}$",
      "$\\dfrac{4}{(x + 5)^{2}}$",
      "$4$"
    ],
    "explanationEn": "Apply the quotient rule $\\left(\\dfrac{u}{v}\\right)' = \\dfrac{u'v - uv'}{v^{2}}$ with $u = 4x$ and $v = x + 5$, so $u' = 4$ and $v' = 1$. The numerator is $4(x + 5) - 4x \\cdot 1 = 20$, giving $\\dfrac{20}{(x + 5)^{2}}$. The $x$ terms cancel exactly, which is characteristic of this type.",
    "frameworkEn": "Auto-gated",
    "optionNotes": [
      {
        "optionId": 0,
        "zh": "分子寫成 $uv' - u'v$，減法次序調轉了，所以答案的正負號相反。商法則的分子必須是 $u'v$ 在前。",
        "en": "The numerator was written as $uv' - u'v$, the subtraction the wrong way round, so the sign is flipped. In the quotient rule $u'v$ always comes first."
      },
      {
        "optionId": 1,
        "zh": "正確。分子 $u'v - uv' = 4(x + 5) - 4x = 20$，分母為 $(x + 5)^{2}$。",
        "en": "Correct. The numerator is $u'v - uv' = 4(x + 5) - 4x = 20$ and the denominator is $(x + 5)^{2}$."
      },
      {
        "optionId": 2,
        "zh": "分子只寫了 $u' = 4$，漏了 $u'v - uv'$ 的結構。",
        "en": "The numerator is just $u' = 4$; the $u'v - uv'$ structure is missing."
      },
      {
        "optionId": 3,
        "zh": "分別對分子和分母求導再相除：$\\dfrac{u'}{v'} = \\dfrac{4}{1} = 4$。商的導數並不等於導數的商。",
        "en": "This differentiates the top and the bottom separately and divides: $\\dfrac{u'}{v'} = \\dfrac{4}{1} = 4$. The derivative of a quotient is not the quotient of the derivatives."
      }
    ]
  },
  {
    "id": "m1_rep_0011",
    "type": "mc",
    "subject": "m1",
    "topic": "differentiation",
    "topicZh": "微分法",
    "topicEn": "Differentiation",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "求 $\\dfrac{d}{dx}\\left(\\dfrac{7x}{x + 2}\\right)$。",
    "explanation": "用商法則 $\\left(\\dfrac{u}{v}\\right)' = \\dfrac{u'v - uv'}{v^{2}}$。取 $u = 7x$、$v = x + 2$，則 $u' = 7$、$v' = 1$。分子 $= 7(x + 2) - 7x \\cdot 1 = 7x + 14 - 7x = 14$，故導數為 $\\dfrac{14}{(x + 2)^{2}}$。留意分子的 $x$ 項【恰好抵銷】，這是本類題目的特徵。第一個干擾項只把分子的導數搬上去，忽略了商法則。答 $7$ 的把整條式當成一次函數直接求導。最後一項把分子兩項的減法次序調轉 —— 商法則的分子【必定是 $u'v$ 在前】，次序調轉會令整個符號相反。",
    "options": [
      "$7$",
      "$\\dfrac{-14}{(x + 2)^{2}}$",
      "$\\dfrac{14}{(x + 2)^{2}}$",
      "$\\dfrac{7}{(x + 2)^{2}}$"
    ],
    "correctIndex": 2,
    "marks": 1,
    "contentEn": "Find $\\dfrac{d}{dx}\\left(\\dfrac{7x}{x + 2}\\right)$.",
    "optionsEn": [
      "$7$",
      "$\\dfrac{-14}{(x + 2)^{2}}$",
      "$\\dfrac{14}{(x + 2)^{2}}$",
      "$\\dfrac{7}{(x + 2)^{2}}$"
    ],
    "explanationEn": "Apply the quotient rule $\\left(\\dfrac{u}{v}\\right)' = \\dfrac{u'v - uv'}{v^{2}}$ with $u = 7x$, $v = x + 2$, so $u' = 7$ and $v' = 1$. The numerator is $7(x + 2) - 7x \\cdot 1 = 7x + 14 - 7x = 14$, giving $\\dfrac{14}{(x + 2)^{2}}$. Note that the $x$ terms cancel exactly, which is characteristic of this type. The first distractor just moves the derivative of the numerator up and ignores the rule. Answering $7$ treats the whole expression as linear. The last option reverses the order of subtraction — in the quotient rule $u'v$ must come first, and reversing it flips every sign.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "m1_rep_0012",
    "type": "mc",
    "subject": "m1",
    "topic": "differentiation",
    "topicZh": "微分法",
    "topicEn": "Differentiation",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "求 $\\dfrac{d}{dx}\\left(\\dfrac{6x}{x + 5}\\right)$。",
    "explanation": "用商法則 $\\left(\\dfrac{u}{v}\\right)' = \\dfrac{u'v - uv'}{v^{2}}$。取 $u = 6x$、$v = x + 5$，則 $u' = 6$、$v' = 1$。分子 $= 6(x + 5) - 6x \\cdot 1 = 6x + 30 - 6x = 30$，故導數為 $\\dfrac{30}{(x + 5)^{2}}$。留意分子的 $x$ 項【恰好抵銷】，這是本類題目的特徵。第一個干擾項只把分子的導數搬上去，忽略了商法則。答 $6$ 的把整條式當成一次函數直接求導。最後一項把分子兩項的減法次序調轉 —— 商法則的分子【必定是 $u'v$ 在前】，次序調轉會令整個符號相反。",
    "options": [
      "$\\dfrac{6}{(x + 5)^{2}}$",
      "$6$",
      "$\\dfrac{-30}{(x + 5)^{2}}$",
      "$\\dfrac{30}{(x + 5)^{2}}$"
    ],
    "correctIndex": 3,
    "marks": 1,
    "contentEn": "Find $\\dfrac{d}{dx}\\left(\\dfrac{6x}{x + 5}\\right)$.",
    "optionsEn": [
      "$\\dfrac{6}{(x + 5)^{2}}$",
      "$6$",
      "$\\dfrac{-30}{(x + 5)^{2}}$",
      "$\\dfrac{30}{(x + 5)^{2}}$"
    ],
    "explanationEn": "Apply the quotient rule $\\left(\\dfrac{u}{v}\\right)' = \\dfrac{u'v - uv'}{v^{2}}$ with $u = 6x$, $v = x + 5$, so $u' = 6$ and $v' = 1$. The numerator is $6(x + 5) - 6x \\cdot 1 = 6x + 30 - 6x = 30$, giving $\\dfrac{30}{(x + 5)^{2}}$. Note that the $x$ terms cancel exactly, which is characteristic of this type. The first distractor just moves the derivative of the numerator up and ignores the rule. Answering $6$ treats the whole expression as linear. The last option reverses the order of subtraction — in the quotient rule $u'v$ must come first, and reversing it flips every sign.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "m1_rep_0013",
    "type": "mc",
    "subject": "m1",
    "topic": "differentiation",
    "topicZh": "微分法",
    "topicEn": "Differentiation",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "求 $\\dfrac{d}{dx}\\left((3x + 2)^{4}\\right)$。",
    "explanation": "鏈式法則：把括號 $u = 3x + 2$ 當作一個整體。外層 $u^{4}$ 的導數是 $4u^{3}$，內層 $3x + 2$ 的導數是 $3$，兩者相乘，得 $4 \\times 3(3x + 2)^{3} = 12(3x + 2)^{3}$。",
    "options": [
      "$12(3x + 2)^{3}$",
      "$4(3x + 2)^{3}$",
      "$12(3x + 2)^{4}$",
      "$4(3)^{3}$"
    ],
    "correctIndex": 0,
    "marks": 1,
    "contentEn": "Find $\\dfrac{d}{dx}\\left((3x + 2)^{4}\\right)$.",
    "optionsEn": [
      "$12(3x + 2)^{3}$",
      "$4(3x + 2)^{3}$",
      "$12(3x + 2)^{4}$",
      "$4(3)^{3}$"
    ],
    "explanationEn": "Chain rule: treat the bracket $u = 3x + 2$ as one object. The outer $u^{4}$ differentiates to $4u^{3}$ and the inner $3x + 2$ to $3$; multiplying gives $4 \\times 3(3x + 2)^{3} = 12(3x + 2)^{3}$.",
    "frameworkEn": "Auto-gated",
    "optionNotes": [
      {
        "optionId": 0,
        "zh": "正確。外層導數 $4(3x + 2)^{3}$ 乘以內層導數 $3$。",
        "en": "Correct. The outer derivative $4(3x + 2)^{3}$ times the inner derivative $3$."
      },
      {
        "optionId": 1,
        "zh": "只求了外層的導數，漏了乘以內層 $3x + 2$ 的導數 $3$。答案的形式看似正確，所以這個錯誤特別難自己察覺。",
        "en": "Only the outer function is differentiated; the inner derivative $3$ of $3x + 2$ is missing. The form looks right, which makes this slip hard to spot."
      },
      {
        "optionId": 2,
        "zh": "係數 $12$ 正確，但指數沒有減一：$u^{4}$ 求導後應為 $4u^{3}$。",
        "en": "The coefficient $12$ is right, but the power was not reduced: $u^{4}$ differentiates to $4u^{3}$."
      },
      {
        "optionId": 3,
        "zh": "把括號內的 $3x + 2$ 換成了它的導數 $3$。外層求導時括號內的式子應原封不動，內層導數只作為乘數。",
        "en": "The bracket $3x + 2$ was replaced by its derivative $3$. Differentiating the outer function leaves the bracket unchanged; the inner derivative is only a multiplier."
      }
    ]
  },
  {
    "id": "m1_rep_0014",
    "type": "mc",
    "subject": "m1",
    "topic": "differentiation",
    "topicZh": "微分法",
    "topicEn": "Differentiation",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "求 $\\dfrac{d}{dx}\\left((2x + 5)^{3}\\right)$。",
    "explanation": "鏈式法則：把括號 $u = 2x + 5$ 當作一個整體。外層 $u^{3}$ 的導數是 $3u^{2}$，內層 $2x + 5$ 的導數是 $2$，兩者相乘，得 $3 \\times 2(2x + 5)^{2} = 6(2x + 5)^{2}$。",
    "options": [
      "$3(2)^{2}$",
      "$6(2x + 5)^{2}$",
      "$3(2x + 5)^{2}$",
      "$6(2x + 5)^{3}$"
    ],
    "correctIndex": 1,
    "marks": 1,
    "contentEn": "Find $\\dfrac{d}{dx}\\left((2x + 5)^{3}\\right)$.",
    "optionsEn": [
      "$3(2)^{2}$",
      "$6(2x + 5)^{2}$",
      "$3(2x + 5)^{2}$",
      "$6(2x + 5)^{3}$"
    ],
    "explanationEn": "Chain rule: treat the bracket $u = 2x + 5$ as one object. The outer $u^{3}$ differentiates to $3u^{2}$ and the inner $2x + 5$ to $2$; multiplying gives $3 \\times 2(2x + 5)^{2} = 6(2x + 5)^{2}$.",
    "frameworkEn": "Auto-gated",
    "optionNotes": [
      {
        "optionId": 0,
        "zh": "把括號內的 $2x + 5$ 換成了它的導數 $2$。外層求導時括號內的式子應原封不動，內層導數只作為乘數。",
        "en": "The bracket $2x + 5$ was replaced by its derivative $2$. Differentiating the outer function leaves the bracket unchanged; the inner derivative is only a multiplier."
      },
      {
        "optionId": 1,
        "zh": "正確。外層導數 $3(2x + 5)^{2}$ 乘以內層導數 $2$。",
        "en": "Correct. The outer derivative $3(2x + 5)^{2}$ times the inner derivative $2$."
      },
      {
        "optionId": 2,
        "zh": "只求了外層的導數，漏了乘以內層 $2x + 5$ 的導數 $2$。答案的形式看似正確，所以這個錯誤特別難自己察覺。",
        "en": "Only the outer function is differentiated; the inner derivative $2$ of $2x + 5$ is missing. The form looks right, which makes this slip hard to spot."
      },
      {
        "optionId": 3,
        "zh": "係數 $6$ 正確，但指數沒有減一：$u^{3}$ 求導後應為 $3u^{2}$。",
        "en": "The coefficient $6$ is right, but the power was not reduced: $u^{3}$ differentiates to $3u^{2}$."
      }
    ]
  },
  {
    "id": "m1_rep_0015",
    "type": "mc",
    "subject": "m1",
    "topic": "differentiation",
    "topicZh": "微分法",
    "topicEn": "Differentiation",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "求 $\\dfrac{d}{dx}\\left((5x + 1)^{2}\\right)$。",
    "explanation": "鏈式法則：把括號 $u = 5x + 1$ 當作一個整體。外層 $u^{2}$ 的導數是 $2u$，內層 $5x + 1$ 的導數是 $5$，兩者相乘，得 $2 \\times 5(5x + 1) = 10(5x + 1)$。",
    "options": [
      "$10(5x + 1)^{2}$",
      "$2(5)$",
      "$10(5x + 1)$",
      "$2(5x + 1)$"
    ],
    "correctIndex": 2,
    "marks": 1,
    "contentEn": "Find $\\dfrac{d}{dx}\\left((5x + 1)^{2}\\right)$.",
    "optionsEn": [
      "$10(5x + 1)^{2}$",
      "$2(5)$",
      "$10(5x + 1)$",
      "$2(5x + 1)$"
    ],
    "explanationEn": "Chain rule: treat the bracket $u = 5x + 1$ as one object. The outer $u^{2}$ differentiates to $2u$ and the inner $5x + 1$ to $5$; multiplying gives $2 \\times 5(5x + 1) = 10(5x + 1)$.",
    "frameworkEn": "Auto-gated",
    "optionNotes": [
      {
        "optionId": 0,
        "zh": "係數 $10$ 正確，但指數沒有減一：$u^{2}$ 求導後應為 $2u$。",
        "en": "The coefficient $10$ is right, but the power was not reduced: $u^{2}$ differentiates to $2u$."
      },
      {
        "optionId": 1,
        "zh": "把括號內的 $5x + 1$ 換成了它的導數 $5$。外層求導時括號內的式子應原封不動，內層導數只作為乘數。",
        "en": "The bracket $5x + 1$ was replaced by its derivative $5$. Differentiating the outer function leaves the bracket unchanged; the inner derivative is only a multiplier."
      },
      {
        "optionId": 2,
        "zh": "正確。外層導數 $2(5x + 1)$ 乘以內層導數 $5$。",
        "en": "Correct. The outer derivative $2(5x + 1)$ times the inner derivative $5$."
      },
      {
        "optionId": 3,
        "zh": "只求了外層的導數，漏了乘以內層 $5x + 1$ 的導數 $5$。答案的形式看似正確，所以這個錯誤特別難自己察覺。",
        "en": "Only the outer function is differentiated; the inner derivative $5$ of $5x + 1$ is missing. The form looks right, which makes this slip hard to spot."
      }
    ]
  },
  {
    "id": "m1_rep_0016",
    "type": "mc",
    "subject": "m1",
    "topic": "differentiation",
    "topicZh": "微分法",
    "topicEn": "Differentiation",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "求 $\\dfrac{d}{dx}\\left((4x + 3)^{5}\\right)$。",
    "explanation": "鏈式法則：把括號 $u = 4x + 3$ 當作一個整體。外層 $u^{5}$ 的導數是 $5u^{4}$，內層 $4x + 3$ 的導數是 $4$，兩者相乘，得 $5 \\times 4(4x + 3)^{4} = 20(4x + 3)^{4}$。",
    "options": [
      "$5(4x + 3)^{4}$",
      "$20(4x + 3)^{5}$",
      "$5(4)^{4}$",
      "$20(4x + 3)^{4}$"
    ],
    "correctIndex": 3,
    "marks": 1,
    "contentEn": "Find $\\dfrac{d}{dx}\\left((4x + 3)^{5}\\right)$.",
    "optionsEn": [
      "$5(4x + 3)^{4}$",
      "$20(4x + 3)^{5}$",
      "$5(4)^{4}$",
      "$20(4x + 3)^{4}$"
    ],
    "explanationEn": "Chain rule: treat the bracket $u = 4x + 3$ as one object. The outer $u^{5}$ differentiates to $5u^{4}$ and the inner $4x + 3$ to $4$; multiplying gives $5 \\times 4(4x + 3)^{4} = 20(4x + 3)^{4}$.",
    "frameworkEn": "Auto-gated",
    "optionNotes": [
      {
        "optionId": 0,
        "zh": "只求了外層的導數，漏了乘以內層 $4x + 3$ 的導數 $4$。答案的形式看似正確，所以這個錯誤特別難自己察覺。",
        "en": "Only the outer function is differentiated; the inner derivative $4$ of $4x + 3$ is missing. The form looks right, which makes this slip hard to spot."
      },
      {
        "optionId": 1,
        "zh": "係數 $20$ 正確，但指數沒有減一：$u^{5}$ 求導後應為 $5u^{4}$。",
        "en": "The coefficient $20$ is right, but the power was not reduced: $u^{5}$ differentiates to $5u^{4}$."
      },
      {
        "optionId": 2,
        "zh": "把括號內的 $4x + 3$ 換成了它的導數 $4$。外層求導時括號內的式子應原封不動，內層導數只作為乘數。",
        "en": "The bracket $4x + 3$ was replaced by its derivative $4$. Differentiating the outer function leaves the bracket unchanged; the inner derivative is only a multiplier."
      },
      {
        "optionId": 3,
        "zh": "正確。外層導數 $5(4x + 3)^{4}$ 乘以內層導數 $4$。",
        "en": "Correct. The outer derivative $5(4x + 3)^{4}$ times the inner derivative $4$."
      }
    ]
  },
  {
    "id": "m1_rep_0017",
    "type": "mc",
    "subject": "m1",
    "topic": "differentiation",
    "topicZh": "微分法",
    "topicEn": "Differentiation",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "求 $\\dfrac{d}{dx}\\left((2x + 7)^{3}\\right)$。",
    "explanation": "鏈式法則：把括號 $u = 2x + 7$ 當作一個整體。外層 $u^{3}$ 的導數是 $3u^{2}$，內層 $2x + 7$ 的導數是 $2$，兩者相乘，得 $3 \\times 2(2x + 7)^{2} = 6(2x + 7)^{2}$。",
    "options": [
      "$6(2x + 7)^{2}$",
      "$3(2x + 7)^{2}$",
      "$6(2x + 7)^{3}$",
      "$3(2)^{2}$"
    ],
    "correctIndex": 0,
    "marks": 1,
    "contentEn": "Find $\\dfrac{d}{dx}\\left((2x + 7)^{3}\\right)$.",
    "optionsEn": [
      "$6(2x + 7)^{2}$",
      "$3(2x + 7)^{2}$",
      "$6(2x + 7)^{3}$",
      "$3(2)^{2}$"
    ],
    "explanationEn": "Chain rule: treat the bracket $u = 2x + 7$ as one object. The outer $u^{3}$ differentiates to $3u^{2}$ and the inner $2x + 7$ to $2$; multiplying gives $3 \\times 2(2x + 7)^{2} = 6(2x + 7)^{2}$.",
    "frameworkEn": "Auto-gated",
    "optionNotes": [
      {
        "optionId": 0,
        "zh": "正確。外層導數 $3(2x + 7)^{2}$ 乘以內層導數 $2$。",
        "en": "Correct. The outer derivative $3(2x + 7)^{2}$ times the inner derivative $2$."
      },
      {
        "optionId": 1,
        "zh": "只求了外層的導數，漏了乘以內層 $2x + 7$ 的導數 $2$。答案的形式看似正確，所以這個錯誤特別難自己察覺。",
        "en": "Only the outer function is differentiated; the inner derivative $2$ of $2x + 7$ is missing. The form looks right, which makes this slip hard to spot."
      },
      {
        "optionId": 2,
        "zh": "係數 $6$ 正確，但指數沒有減一：$u^{3}$ 求導後應為 $3u^{2}$。",
        "en": "The coefficient $6$ is right, but the power was not reduced: $u^{3}$ differentiates to $3u^{2}$."
      },
      {
        "optionId": 3,
        "zh": "把括號內的 $2x + 7$ 換成了它的導數 $2$。外層求導時括號內的式子應原封不動，內層導數只作為乘數。",
        "en": "The bracket $2x + 7$ was replaced by its derivative $2$. Differentiating the outer function leaves the bracket unchanged; the inner derivative is only a multiplier."
      }
    ]
  },
  {
    "id": "m1_rep_0018",
    "type": "mc",
    "subject": "m1",
    "topic": "differentiation",
    "topicZh": "微分法",
    "topicEn": "Differentiation",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "求 $\\dfrac{d}{dx}\\left((3x + 4)^{2}\\right)$。",
    "explanation": "鏈式法則：把括號 $u = 3x + 4$ 當作一個整體。外層 $u^{2}$ 的導數是 $2u$，內層 $3x + 4$ 的導數是 $3$，兩者相乘，得 $2 \\times 3(3x + 4) = 6(3x + 4)$。",
    "options": [
      "$2(3)$",
      "$6(3x + 4)$",
      "$2(3x + 4)$",
      "$6(3x + 4)^{2}$"
    ],
    "correctIndex": 1,
    "marks": 1,
    "contentEn": "Find $\\dfrac{d}{dx}\\left((3x + 4)^{2}\\right)$.",
    "optionsEn": [
      "$2(3)$",
      "$6(3x + 4)$",
      "$2(3x + 4)$",
      "$6(3x + 4)^{2}$"
    ],
    "explanationEn": "Chain rule: treat the bracket $u = 3x + 4$ as one object. The outer $u^{2}$ differentiates to $2u$ and the inner $3x + 4$ to $3$; multiplying gives $2 \\times 3(3x + 4) = 6(3x + 4)$.",
    "frameworkEn": "Auto-gated",
    "optionNotes": [
      {
        "optionId": 0,
        "zh": "把括號內的 $3x + 4$ 換成了它的導數 $3$。外層求導時括號內的式子應原封不動，內層導數只作為乘數。",
        "en": "The bracket $3x + 4$ was replaced by its derivative $3$. Differentiating the outer function leaves the bracket unchanged; the inner derivative is only a multiplier."
      },
      {
        "optionId": 1,
        "zh": "正確。外層導數 $2(3x + 4)$ 乘以內層導數 $3$。",
        "en": "Correct. The outer derivative $2(3x + 4)$ times the inner derivative $3$."
      },
      {
        "optionId": 2,
        "zh": "只求了外層的導數，漏了乘以內層 $3x + 4$ 的導數 $3$。答案的形式看似正確，所以這個錯誤特別難自己察覺。",
        "en": "Only the outer function is differentiated; the inner derivative $3$ of $3x + 4$ is missing. The form looks right, which makes this slip hard to spot."
      },
      {
        "optionId": 3,
        "zh": "係數 $6$ 正確，但指數沒有減一：$u^{2}$ 求導後應為 $2u$。",
        "en": "The coefficient $6$ is right, but the power was not reduced: $u^{2}$ differentiates to $2u$."
      }
    ]
  },
  {
    "id": "m1_rep_0019",
    "type": "mc",
    "subject": "m1",
    "topic": "differentiation",
    "topicZh": "微分法",
    "topicEn": "Differentiation",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "medium",
    "year": 0,
    "content": "求 $\\dfrac{d}{dx}\\ln(3x^{2} + 2)$。",
    "explanation": "$\\dfrac{d}{dx}\\ln f(x) = \\dfrac{f'(x)}{f(x)}$：分母照抄原式，分子是它的導數。此處 $f(x) = 3x^{2} + 2$，$f'(x) = 6x$，故答案為 $\\dfrac{6x}{3x^{2} + 2}$。",
    "options": [
      "$\\dfrac{6x}{3x^{2}}$",
      "$6x \\ln(3x^{2} + 2)$",
      "$\\dfrac{6x}{3x^{2} + 2}$",
      "$\\dfrac{1}{3x^{2} + 2}$"
    ],
    "correctIndex": 2,
    "marks": 1,
    "contentEn": "Find $\\dfrac{d}{dx}\\ln(3x^{2} + 2)$.",
    "optionsEn": [
      "$\\dfrac{6x}{3x^{2}}$",
      "$6x \\ln(3x^{2} + 2)$",
      "$\\dfrac{6x}{3x^{2} + 2}$",
      "$\\dfrac{1}{3x^{2} + 2}$"
    ],
    "explanationEn": "$\\dfrac{d}{dx}\\ln f(x) = \\dfrac{f'(x)}{f(x)}$: the original expression goes in the denominator and its derivative on top. Here $f(x) = 3x^{2} + 2$ and $f'(x) = 6x$, so the answer is $\\dfrac{6x}{3x^{2} + 2}$.",
    "frameworkEn": "Auto-gated",
    "optionNotes": [
      {
        "optionId": 0,
        "zh": "分子正確，但分母刪去了常數 $2$。分母必須是完整的原式 $3x^{2} + 2$。",
        "en": "The numerator is right, but the constant $2$ was dropped from the denominator. The denominator must be the whole of $3x^{2} + 2$."
      },
      {
        "optionId": 1,
        "zh": "把 $\\ln$ 當成可以留在外面的因子，再乘以內層的導數。對數求導之後不再含 $\\ln$。",
        "en": "This keeps $\\ln$ as a factor and multiplies by the inner derivative. Differentiating a logarithm leaves no $\\ln$ behind."
      },
      {
        "optionId": 2,
        "zh": "正確。分子是 $f'(x) = 6x$，分母保留原式 $3x^{2} + 2$。",
        "en": "Correct. The numerator is $f'(x) = 6x$ and the denominator keeps $3x^{2} + 2$ as it is."
      },
      {
        "optionId": 3,
        "zh": "這是 $\\ln u$ 對 $u$ 的導數 $\\dfrac{1}{u}$，漏了再乘以內層的導數 $6x$（鏈式法則）。",
        "en": "This is the derivative of $\\ln u$ with respect to $u$, $\\dfrac{1}{u}$, without the inner derivative $6x$ (chain rule)."
      }
    ]
  },
  {
    "id": "m1_rep_0020",
    "type": "mc",
    "subject": "m1",
    "topic": "differentiation",
    "topicZh": "微分法",
    "topicEn": "Differentiation",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "medium",
    "year": 0,
    "content": "求 $\\dfrac{d}{dx}\\ln(5x^{2} + 4)$。",
    "explanation": "$\\dfrac{d}{dx}\\ln f(x) = \\dfrac{f'(x)}{f(x)}$：分母照抄原式，分子是它的導數。此處 $f(x) = 5x^{2} + 4$，$f'(x) = 10x$，故答案為 $\\dfrac{10x}{5x^{2} + 4}$。",
    "options": [
      "$\\dfrac{1}{5x^{2} + 4}$",
      "$\\dfrac{10x}{5x^{2}}$",
      "$10x \\ln(5x^{2} + 4)$",
      "$\\dfrac{10x}{5x^{2} + 4}$"
    ],
    "correctIndex": 3,
    "marks": 1,
    "contentEn": "Find $\\dfrac{d}{dx}\\ln(5x^{2} + 4)$.",
    "optionsEn": [
      "$\\dfrac{1}{5x^{2} + 4}$",
      "$\\dfrac{10x}{5x^{2}}$",
      "$10x \\ln(5x^{2} + 4)$",
      "$\\dfrac{10x}{5x^{2} + 4}$"
    ],
    "explanationEn": "$\\dfrac{d}{dx}\\ln f(x) = \\dfrac{f'(x)}{f(x)}$: the original expression goes in the denominator and its derivative on top. Here $f(x) = 5x^{2} + 4$ and $f'(x) = 10x$, so the answer is $\\dfrac{10x}{5x^{2} + 4}$.",
    "frameworkEn": "Auto-gated",
    "optionNotes": [
      {
        "optionId": 0,
        "zh": "這是 $\\ln u$ 對 $u$ 的導數 $\\dfrac{1}{u}$，漏了再乘以內層的導數 $10x$（鏈式法則）。",
        "en": "This is the derivative of $\\ln u$ with respect to $u$, $\\dfrac{1}{u}$, without the inner derivative $10x$ (chain rule)."
      },
      {
        "optionId": 1,
        "zh": "分子正確，但分母刪去了常數 $4$。分母必須是完整的原式 $5x^{2} + 4$。",
        "en": "The numerator is right, but the constant $4$ was dropped from the denominator. The denominator must be the whole of $5x^{2} + 4$."
      },
      {
        "optionId": 2,
        "zh": "把 $\\ln$ 當成可以留在外面的因子，再乘以內層的導數。對數求導之後不再含 $\\ln$。",
        "en": "This keeps $\\ln$ as a factor and multiplies by the inner derivative. Differentiating a logarithm leaves no $\\ln$ behind."
      },
      {
        "optionId": 3,
        "zh": "正確。分子是 $f'(x) = 10x$，分母保留原式 $5x^{2} + 4$。",
        "en": "Correct. The numerator is $f'(x) = 10x$ and the denominator keeps $5x^{2} + 4$ as it is."
      }
    ]
  },
  {
    "id": "m1_rep_0021",
    "type": "mc",
    "subject": "m1",
    "topic": "differentiation",
    "topicZh": "微分法",
    "topicEn": "Differentiation",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "medium",
    "year": 0,
    "content": "求 $\\dfrac{d}{dx}\\ln(2x^{2} + 9)$。",
    "explanation": "$\\dfrac{d}{dx}\\ln f(x) = \\dfrac{f'(x)}{f(x)}$：分母照抄原式，分子是它的導數。此處 $f(x) = 2x^{2} + 9$，$f'(x) = 4x$，故答案為 $\\dfrac{4x}{2x^{2} + 9}$。",
    "options": [
      "$\\dfrac{4x}{2x^{2} + 9}$",
      "$\\dfrac{1}{2x^{2} + 9}$",
      "$\\dfrac{4x}{2x^{2}}$",
      "$4x \\ln(2x^{2} + 9)$"
    ],
    "correctIndex": 0,
    "marks": 1,
    "contentEn": "Find $\\dfrac{d}{dx}\\ln(2x^{2} + 9)$.",
    "optionsEn": [
      "$\\dfrac{4x}{2x^{2} + 9}$",
      "$\\dfrac{1}{2x^{2} + 9}$",
      "$\\dfrac{4x}{2x^{2}}$",
      "$4x \\ln(2x^{2} + 9)$"
    ],
    "explanationEn": "$\\dfrac{d}{dx}\\ln f(x) = \\dfrac{f'(x)}{f(x)}$: the original expression goes in the denominator and its derivative on top. Here $f(x) = 2x^{2} + 9$ and $f'(x) = 4x$, so the answer is $\\dfrac{4x}{2x^{2} + 9}$.",
    "frameworkEn": "Auto-gated",
    "optionNotes": [
      {
        "optionId": 0,
        "zh": "正確。分子是 $f'(x) = 4x$，分母保留原式 $2x^{2} + 9$。",
        "en": "Correct. The numerator is $f'(x) = 4x$ and the denominator keeps $2x^{2} + 9$ as it is."
      },
      {
        "optionId": 1,
        "zh": "這是 $\\ln u$ 對 $u$ 的導數 $\\dfrac{1}{u}$，漏了再乘以內層的導數 $4x$（鏈式法則）。",
        "en": "This is the derivative of $\\ln u$ with respect to $u$, $\\dfrac{1}{u}$, without the inner derivative $4x$ (chain rule)."
      },
      {
        "optionId": 2,
        "zh": "分子正確，但分母刪去了常數 $9$。分母必須是完整的原式 $2x^{2} + 9$。",
        "en": "The numerator is right, but the constant $9$ was dropped from the denominator. The denominator must be the whole of $2x^{2} + 9$."
      },
      {
        "optionId": 3,
        "zh": "把 $\\ln$ 當成可以留在外面的因子，再乘以內層的導數。對數求導之後不再含 $\\ln$。",
        "en": "This keeps $\\ln$ as a factor and multiplies by the inner derivative. Differentiating a logarithm leaves no $\\ln$ behind."
      }
    ]
  },
  {
    "id": "m1_rep_0022",
    "type": "mc",
    "subject": "m1",
    "topic": "differentiation",
    "topicZh": "微分法",
    "topicEn": "Differentiation",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "medium",
    "year": 0,
    "content": "求 $\\dfrac{d}{dx}\\ln(7x^{2} + 3)$。",
    "explanation": "$\\dfrac{d}{dx}\\ln f(x) = \\dfrac{f'(x)}{f(x)}$：分母照抄原式，分子是它的導數。此處 $f(x) = 7x^{2} + 3$，$f'(x) = 14x$，故答案為 $\\dfrac{14x}{7x^{2} + 3}$。",
    "options": [
      "$14x \\ln(7x^{2} + 3)$",
      "$\\dfrac{14x}{7x^{2} + 3}$",
      "$\\dfrac{1}{7x^{2} + 3}$",
      "$\\dfrac{14x}{7x^{2}}$"
    ],
    "correctIndex": 1,
    "marks": 1,
    "contentEn": "Find $\\dfrac{d}{dx}\\ln(7x^{2} + 3)$.",
    "optionsEn": [
      "$14x \\ln(7x^{2} + 3)$",
      "$\\dfrac{14x}{7x^{2} + 3}$",
      "$\\dfrac{1}{7x^{2} + 3}$",
      "$\\dfrac{14x}{7x^{2}}$"
    ],
    "explanationEn": "$\\dfrac{d}{dx}\\ln f(x) = \\dfrac{f'(x)}{f(x)}$: the original expression goes in the denominator and its derivative on top. Here $f(x) = 7x^{2} + 3$ and $f'(x) = 14x$, so the answer is $\\dfrac{14x}{7x^{2} + 3}$.",
    "frameworkEn": "Auto-gated",
    "optionNotes": [
      {
        "optionId": 0,
        "zh": "把 $\\ln$ 當成可以留在外面的因子，再乘以內層的導數。對數求導之後不再含 $\\ln$。",
        "en": "This keeps $\\ln$ as a factor and multiplies by the inner derivative. Differentiating a logarithm leaves no $\\ln$ behind."
      },
      {
        "optionId": 1,
        "zh": "正確。分子是 $f'(x) = 14x$，分母保留原式 $7x^{2} + 3$。",
        "en": "Correct. The numerator is $f'(x) = 14x$ and the denominator keeps $7x^{2} + 3$ as it is."
      },
      {
        "optionId": 2,
        "zh": "這是 $\\ln u$ 對 $u$ 的導數 $\\dfrac{1}{u}$，漏了再乘以內層的導數 $14x$（鏈式法則）。",
        "en": "This is the derivative of $\\ln u$ with respect to $u$, $\\dfrac{1}{u}$, without the inner derivative $14x$ (chain rule)."
      },
      {
        "optionId": 3,
        "zh": "分子正確，但分母刪去了常數 $3$。分母必須是完整的原式 $7x^{2} + 3$。",
        "en": "The numerator is right, but the constant $3$ was dropped from the denominator. The denominator must be the whole of $7x^{2} + 3$."
      }
    ]
  },
  {
    "id": "m1_rep_0023",
    "type": "mc",
    "subject": "m1",
    "topic": "differentiation",
    "topicZh": "微分法",
    "topicEn": "Differentiation",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "medium",
    "year": 0,
    "content": "求 $\\dfrac{d}{dx}\\ln(4x^{2} + 5)$。",
    "explanation": "$\\dfrac{d}{dx}\\ln f(x) = \\dfrac{f'(x)}{f(x)}$：分母照抄原式，分子是它的導數。此處 $f(x) = 4x^{2} + 5$，$f'(x) = 8x$，故答案為 $\\dfrac{8x}{4x^{2} + 5}$。",
    "options": [
      "$\\dfrac{8x}{4x^{2}}$",
      "$8x \\ln(4x^{2} + 5)$",
      "$\\dfrac{8x}{4x^{2} + 5}$",
      "$\\dfrac{1}{4x^{2} + 5}$"
    ],
    "correctIndex": 2,
    "marks": 1,
    "contentEn": "Find $\\dfrac{d}{dx}\\ln(4x^{2} + 5)$.",
    "optionsEn": [
      "$\\dfrac{8x}{4x^{2}}$",
      "$8x \\ln(4x^{2} + 5)$",
      "$\\dfrac{8x}{4x^{2} + 5}$",
      "$\\dfrac{1}{4x^{2} + 5}$"
    ],
    "explanationEn": "$\\dfrac{d}{dx}\\ln f(x) = \\dfrac{f'(x)}{f(x)}$: the original expression goes in the denominator and its derivative on top. Here $f(x) = 4x^{2} + 5$ and $f'(x) = 8x$, so the answer is $\\dfrac{8x}{4x^{2} + 5}$.",
    "frameworkEn": "Auto-gated",
    "optionNotes": [
      {
        "optionId": 0,
        "zh": "分子正確，但分母刪去了常數 $5$。分母必須是完整的原式 $4x^{2} + 5$。",
        "en": "The numerator is right, but the constant $5$ was dropped from the denominator. The denominator must be the whole of $4x^{2} + 5$."
      },
      {
        "optionId": 1,
        "zh": "把 $\\ln$ 當成可以留在外面的因子，再乘以內層的導數。對數求導之後不再含 $\\ln$。",
        "en": "This keeps $\\ln$ as a factor and multiplies by the inner derivative. Differentiating a logarithm leaves no $\\ln$ behind."
      },
      {
        "optionId": 2,
        "zh": "正確。分子是 $f'(x) = 8x$，分母保留原式 $4x^{2} + 5$。",
        "en": "Correct. The numerator is $f'(x) = 8x$ and the denominator keeps $4x^{2} + 5$ as it is."
      },
      {
        "optionId": 3,
        "zh": "這是 $\\ln u$ 對 $u$ 的導數 $\\dfrac{1}{u}$，漏了再乘以內層的導數 $8x$（鏈式法則）。",
        "en": "This is the derivative of $\\ln u$ with respect to $u$, $\\dfrac{1}{u}$, without the inner derivative $8x$ (chain rule)."
      }
    ]
  },
  {
    "id": "m1_rep_0024",
    "type": "mc",
    "subject": "m1",
    "topic": "differentiation",
    "topicZh": "微分法",
    "topicEn": "Differentiation",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "medium",
    "year": 0,
    "content": "求 $\\dfrac{d}{dx}\\ln(6x^{2} + 7)$。",
    "explanation": "$\\dfrac{d}{dx}\\ln f(x) = \\dfrac{f'(x)}{f(x)}$：分母照抄原式，分子是它的導數。此處 $f(x) = 6x^{2} + 7$，$f'(x) = 12x$，故答案為 $\\dfrac{12x}{6x^{2} + 7}$。",
    "options": [
      "$\\dfrac{1}{6x^{2} + 7}$",
      "$\\dfrac{12x}{6x^{2}}$",
      "$12x \\ln(6x^{2} + 7)$",
      "$\\dfrac{12x}{6x^{2} + 7}$"
    ],
    "correctIndex": 3,
    "marks": 1,
    "contentEn": "Find $\\dfrac{d}{dx}\\ln(6x^{2} + 7)$.",
    "optionsEn": [
      "$\\dfrac{1}{6x^{2} + 7}$",
      "$\\dfrac{12x}{6x^{2}}$",
      "$12x \\ln(6x^{2} + 7)$",
      "$\\dfrac{12x}{6x^{2} + 7}$"
    ],
    "explanationEn": "$\\dfrac{d}{dx}\\ln f(x) = \\dfrac{f'(x)}{f(x)}$: the original expression goes in the denominator and its derivative on top. Here $f(x) = 6x^{2} + 7$ and $f'(x) = 12x$, so the answer is $\\dfrac{12x}{6x^{2} + 7}$.",
    "frameworkEn": "Auto-gated",
    "optionNotes": [
      {
        "optionId": 0,
        "zh": "這是 $\\ln u$ 對 $u$ 的導數 $\\dfrac{1}{u}$，漏了再乘以內層的導數 $12x$（鏈式法則）。",
        "en": "This is the derivative of $\\ln u$ with respect to $u$, $\\dfrac{1}{u}$, without the inner derivative $12x$ (chain rule)."
      },
      {
        "optionId": 1,
        "zh": "分子正確，但分母刪去了常數 $7$。分母必須是完整的原式 $6x^{2} + 7$。",
        "en": "The numerator is right, but the constant $7$ was dropped from the denominator. The denominator must be the whole of $6x^{2} + 7$."
      },
      {
        "optionId": 2,
        "zh": "把 $\\ln$ 當成可以留在外面的因子，再乘以內層的導數。對數求導之後不再含 $\\ln$。",
        "en": "This keeps $\\ln$ as a factor and multiplies by the inner derivative. Differentiating a logarithm leaves no $\\ln$ behind."
      },
      {
        "optionId": 3,
        "zh": "正確。分子是 $f'(x) = 12x$，分母保留原式 $6x^{2} + 7$。",
        "en": "Correct. The numerator is $f'(x) = 12x$ and the denominator keeps $6x^{2} + 7$ as it is."
      }
    ]
  },
  {
    "id": "m1_rep_0025",
    "type": "mc",
    "subject": "m1",
    "topic": "differentiation",
    "topicZh": "微分法",
    "topicEn": "Differentiation",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "medium",
    "year": 0,
    "content": "已知 $2x^{2} + 3y^{2} = 10$。求 $\\dfrac{dy}{dx}$。",
    "explanation": "兩邊同時對 $x$ 求導。$2x^{2}$ 的導數是 $4x$；$3y^{2}$ 的導數是 $6y\\dfrac{dy}{dx}$ —— 因為 $y$ 是 $x$ 的函數，鏈式法則帶出 $\\dfrac{dy}{dx}$。右邊常數的導數為 $0$。由 $4x + 6y\\dfrac{dy}{dx} = 0$ 得 $\\dfrac{dy}{dx} = -\\dfrac{4x}{6y} = -\\dfrac{2x}{3y}$。",
    "options": [
      "$-\\dfrac{2x}{3y}$",
      "$\\dfrac{2x}{3y}$",
      "$-\\dfrac{4x}{3y}$",
      "$-\\dfrac{2x}{6y}$"
    ],
    "correctIndex": 0,
    "marks": 1,
    "contentEn": "Given $2x^{2} + 3y^{2} = 10$, find $\\dfrac{dy}{dx}$.",
    "optionsEn": [
      "$-\\dfrac{2x}{3y}$",
      "$\\dfrac{2x}{3y}$",
      "$-\\dfrac{4x}{3y}$",
      "$-\\dfrac{2x}{6y}$"
    ],
    "explanationEn": "Differentiate both sides with respect to $x$. $2x^{2}$ gives $4x$; $3y^{2}$ gives $6y\\dfrac{dy}{dx}$ — $y$ is a function of $x$, so the chain rule brings out $\\dfrac{dy}{dx}$. The constant on the right gives $0$. From $4x + 6y\\dfrac{dy}{dx} = 0$, $\\dfrac{dy}{dx} = -\\dfrac{4x}{6y} = -\\dfrac{2x}{3y}$.",
    "frameworkEn": "Auto-gated",
    "optionNotes": [
      {
        "optionId": 0,
        "zh": "正確。由 $4x + 6y\\dfrac{dy}{dx} = 0$ 移項，分子分母同除以 $2$。",
        "en": "Correct. Rearrange $4x + 6y\\dfrac{dy}{dx} = 0$ and divide top and bottom by $2$."
      },
      {
        "optionId": 1,
        "zh": "漏了負號：$4x$ 移到等號另一邊時要變號。",
        "en": "The minus sign is missing: $4x$ changes sign when it moves across the equals sign."
      },
      {
        "optionId": 2,
        "zh": "分母已除以 $2$，分子 $4x$ 卻沒有，兩邊約簡不一致。",
        "en": "The denominator was divided by $2$ but the numerator $4x$ was not."
      },
      {
        "optionId": 3,
        "zh": "分子已除以 $2$，分母 $6y$ 卻沒有，兩邊約簡不一致。",
        "en": "The numerator was divided by $2$ but the denominator $6y$ was not."
      }
    ]
  },
  {
    "id": "m1_rep_0026",
    "type": "mc",
    "subject": "m1",
    "topic": "differentiation",
    "topicZh": "微分法",
    "topicEn": "Differentiation",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "medium",
    "year": 0,
    "content": "已知 $5x^{2} + 2y^{2} = 10$。求 $\\dfrac{dy}{dx}$。",
    "explanation": "兩邊同時對 $x$ 求導。$5x^{2}$ 的導數是 $10x$；$2y^{2}$ 的導數是 $4y\\dfrac{dy}{dx}$ —— 因為 $y$ 是 $x$ 的函數，鏈式法則帶出 $\\dfrac{dy}{dx}$。右邊常數的導數為 $0$。由 $10x + 4y\\dfrac{dy}{dx} = 0$ 得 $\\dfrac{dy}{dx} = -\\dfrac{10x}{4y} = -\\dfrac{5x}{2y}$。",
    "options": [
      "$-\\dfrac{5x}{4y}$",
      "$-\\dfrac{5x}{2y}$",
      "$\\dfrac{5x}{2y}$",
      "$-\\dfrac{10x}{2y}$"
    ],
    "correctIndex": 1,
    "marks": 1,
    "contentEn": "Given $5x^{2} + 2y^{2} = 10$, find $\\dfrac{dy}{dx}$.",
    "optionsEn": [
      "$-\\dfrac{5x}{4y}$",
      "$-\\dfrac{5x}{2y}$",
      "$\\dfrac{5x}{2y}$",
      "$-\\dfrac{10x}{2y}$"
    ],
    "explanationEn": "Differentiate both sides with respect to $x$. $5x^{2}$ gives $10x$; $2y^{2}$ gives $4y\\dfrac{dy}{dx}$ — $y$ is a function of $x$, so the chain rule brings out $\\dfrac{dy}{dx}$. The constant on the right gives $0$. From $10x + 4y\\dfrac{dy}{dx} = 0$, $\\dfrac{dy}{dx} = -\\dfrac{10x}{4y} = -\\dfrac{5x}{2y}$.",
    "frameworkEn": "Auto-gated",
    "optionNotes": [
      {
        "optionId": 0,
        "zh": "分子已除以 $2$，分母 $4y$ 卻沒有，兩邊約簡不一致。",
        "en": "The numerator was divided by $2$ but the denominator $4y$ was not."
      },
      {
        "optionId": 1,
        "zh": "正確。由 $10x + 4y\\dfrac{dy}{dx} = 0$ 移項，分子分母同除以 $2$。",
        "en": "Correct. Rearrange $10x + 4y\\dfrac{dy}{dx} = 0$ and divide top and bottom by $2$."
      },
      {
        "optionId": 2,
        "zh": "漏了負號：$10x$ 移到等號另一邊時要變號。",
        "en": "The minus sign is missing: $10x$ changes sign when it moves across the equals sign."
      },
      {
        "optionId": 3,
        "zh": "分母已除以 $2$，分子 $10x$ 卻沒有，兩邊約簡不一致。",
        "en": "The denominator was divided by $2$ but the numerator $10x$ was not."
      }
    ]
  },
  {
    "id": "m1_rep_0027",
    "type": "mc",
    "subject": "m1",
    "topic": "differentiation",
    "topicZh": "微分法",
    "topicEn": "Differentiation",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "medium",
    "year": 0,
    "content": "已知 $3x^{2} + 7y^{2} = 10$。求 $\\dfrac{dy}{dx}$。",
    "explanation": "兩邊同時對 $x$ 求導。$3x^{2}$ 的導數是 $6x$；$7y^{2}$ 的導數是 $14y\\dfrac{dy}{dx}$ —— 因為 $y$ 是 $x$ 的函數，鏈式法則帶出 $\\dfrac{dy}{dx}$。右邊常數的導數為 $0$。由 $6x + 14y\\dfrac{dy}{dx} = 0$ 得 $\\dfrac{dy}{dx} = -\\dfrac{6x}{14y} = -\\dfrac{3x}{7y}$。",
    "options": [
      "$-\\dfrac{6x}{7y}$",
      "$-\\dfrac{3x}{14y}$",
      "$-\\dfrac{3x}{7y}$",
      "$\\dfrac{3x}{7y}$"
    ],
    "correctIndex": 2,
    "marks": 1,
    "contentEn": "Given $3x^{2} + 7y^{2} = 10$, find $\\dfrac{dy}{dx}$.",
    "optionsEn": [
      "$-\\dfrac{6x}{7y}$",
      "$-\\dfrac{3x}{14y}$",
      "$-\\dfrac{3x}{7y}$",
      "$\\dfrac{3x}{7y}$"
    ],
    "explanationEn": "Differentiate both sides with respect to $x$. $3x^{2}$ gives $6x$; $7y^{2}$ gives $14y\\dfrac{dy}{dx}$ — $y$ is a function of $x$, so the chain rule brings out $\\dfrac{dy}{dx}$. The constant on the right gives $0$. From $6x + 14y\\dfrac{dy}{dx} = 0$, $\\dfrac{dy}{dx} = -\\dfrac{6x}{14y} = -\\dfrac{3x}{7y}$.",
    "frameworkEn": "Auto-gated",
    "optionNotes": [
      {
        "optionId": 0,
        "zh": "分母已除以 $2$，分子 $6x$ 卻沒有，兩邊約簡不一致。",
        "en": "The denominator was divided by $2$ but the numerator $6x$ was not."
      },
      {
        "optionId": 1,
        "zh": "分子已除以 $2$，分母 $14y$ 卻沒有，兩邊約簡不一致。",
        "en": "The numerator was divided by $2$ but the denominator $14y$ was not."
      },
      {
        "optionId": 2,
        "zh": "正確。由 $6x + 14y\\dfrac{dy}{dx} = 0$ 移項，分子分母同除以 $2$。",
        "en": "Correct. Rearrange $6x + 14y\\dfrac{dy}{dx} = 0$ and divide top and bottom by $2$."
      },
      {
        "optionId": 3,
        "zh": "漏了負號：$6x$ 移到等號另一邊時要變號。",
        "en": "The minus sign is missing: $6x$ changes sign when it moves across the equals sign."
      }
    ]
  },
  {
    "id": "m1_rep_0028",
    "type": "mc",
    "subject": "m1",
    "topic": "differentiation",
    "topicZh": "微分法",
    "topicEn": "Differentiation",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "medium",
    "year": 0,
    "content": "已知 $4x^{2} + 5y^{2} = 10$。求 $\\dfrac{dy}{dx}$。",
    "explanation": "兩邊同時對 $x$ 求導。$4x^{2}$ 的導數是 $8x$；$5y^{2}$ 的導數是 $10y\\dfrac{dy}{dx}$ —— 因為 $y$ 是 $x$ 的函數，鏈式法則帶出 $\\dfrac{dy}{dx}$。右邊常數的導數為 $0$。由 $8x + 10y\\dfrac{dy}{dx} = 0$ 得 $\\dfrac{dy}{dx} = -\\dfrac{8x}{10y} = -\\dfrac{4x}{5y}$。",
    "options": [
      "$\\dfrac{4x}{5y}$",
      "$-\\dfrac{8x}{5y}$",
      "$-\\dfrac{4x}{10y}$",
      "$-\\dfrac{4x}{5y}$"
    ],
    "correctIndex": 3,
    "marks": 1,
    "contentEn": "Given $4x^{2} + 5y^{2} = 10$, find $\\dfrac{dy}{dx}$.",
    "optionsEn": [
      "$\\dfrac{4x}{5y}$",
      "$-\\dfrac{8x}{5y}$",
      "$-\\dfrac{4x}{10y}$",
      "$-\\dfrac{4x}{5y}$"
    ],
    "explanationEn": "Differentiate both sides with respect to $x$. $4x^{2}$ gives $8x$; $5y^{2}$ gives $10y\\dfrac{dy}{dx}$ — $y$ is a function of $x$, so the chain rule brings out $\\dfrac{dy}{dx}$. The constant on the right gives $0$. From $8x + 10y\\dfrac{dy}{dx} = 0$, $\\dfrac{dy}{dx} = -\\dfrac{8x}{10y} = -\\dfrac{4x}{5y}$.",
    "frameworkEn": "Auto-gated",
    "optionNotes": [
      {
        "optionId": 0,
        "zh": "漏了負號：$8x$ 移到等號另一邊時要變號。",
        "en": "The minus sign is missing: $8x$ changes sign when it moves across the equals sign."
      },
      {
        "optionId": 1,
        "zh": "分母已除以 $2$，分子 $8x$ 卻沒有，兩邊約簡不一致。",
        "en": "The denominator was divided by $2$ but the numerator $8x$ was not."
      },
      {
        "optionId": 2,
        "zh": "分子已除以 $2$，分母 $10y$ 卻沒有，兩邊約簡不一致。",
        "en": "The numerator was divided by $2$ but the denominator $10y$ was not."
      },
      {
        "optionId": 3,
        "zh": "正確。由 $8x + 10y\\dfrac{dy}{dx} = 0$ 移項，分子分母同除以 $2$。",
        "en": "Correct. Rearrange $8x + 10y\\dfrac{dy}{dx} = 0$ and divide top and bottom by $2$."
      }
    ]
  },
  {
    "id": "m1_rep_0029",
    "type": "mc",
    "subject": "m1",
    "topic": "differentiation",
    "topicZh": "微分法",
    "topicEn": "Differentiation",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "medium",
    "year": 0,
    "content": "已知 $6x^{2} + 5y^{2} = 10$。求 $\\dfrac{dy}{dx}$。",
    "explanation": "兩邊同時對 $x$ 求導。$6x^{2}$ 的導數是 $12x$；$5y^{2}$ 的導數是 $10y\\dfrac{dy}{dx}$ —— 因為 $y$ 是 $x$ 的函數，鏈式法則帶出 $\\dfrac{dy}{dx}$。右邊常數的導數為 $0$。由 $12x + 10y\\dfrac{dy}{dx} = 0$ 得 $\\dfrac{dy}{dx} = -\\dfrac{12x}{10y} = -\\dfrac{6x}{5y}$。",
    "options": [
      "$-\\dfrac{6x}{5y}$",
      "$\\dfrac{6x}{5y}$",
      "$-\\dfrac{12x}{5y}$",
      "$-\\dfrac{6x}{10y}$"
    ],
    "correctIndex": 0,
    "marks": 1,
    "contentEn": "Given $6x^{2} + 5y^{2} = 10$, find $\\dfrac{dy}{dx}$.",
    "optionsEn": [
      "$-\\dfrac{6x}{5y}$",
      "$\\dfrac{6x}{5y}$",
      "$-\\dfrac{12x}{5y}$",
      "$-\\dfrac{6x}{10y}$"
    ],
    "explanationEn": "Differentiate both sides with respect to $x$. $6x^{2}$ gives $12x$; $5y^{2}$ gives $10y\\dfrac{dy}{dx}$ — $y$ is a function of $x$, so the chain rule brings out $\\dfrac{dy}{dx}$. The constant on the right gives $0$. From $12x + 10y\\dfrac{dy}{dx} = 0$, $\\dfrac{dy}{dx} = -\\dfrac{12x}{10y} = -\\dfrac{6x}{5y}$.",
    "frameworkEn": "Auto-gated",
    "optionNotes": [
      {
        "optionId": 0,
        "zh": "正確。由 $12x + 10y\\dfrac{dy}{dx} = 0$ 移項，分子分母同除以 $2$。",
        "en": "Correct. Rearrange $12x + 10y\\dfrac{dy}{dx} = 0$ and divide top and bottom by $2$."
      },
      {
        "optionId": 1,
        "zh": "漏了負號：$12x$ 移到等號另一邊時要變號。",
        "en": "The minus sign is missing: $12x$ changes sign when it moves across the equals sign."
      },
      {
        "optionId": 2,
        "zh": "分母已除以 $2$，分子 $12x$ 卻沒有，兩邊約簡不一致。",
        "en": "The denominator was divided by $2$ but the numerator $12x$ was not."
      },
      {
        "optionId": 3,
        "zh": "分子已除以 $2$，分母 $10y$ 卻沒有，兩邊約簡不一致。",
        "en": "The numerator was divided by $2$ but the denominator $10y$ was not."
      }
    ]
  },
  {
    "id": "m1_rep_0030",
    "type": "mc",
    "subject": "m1",
    "topic": "differentiation",
    "topicZh": "微分法",
    "topicEn": "Differentiation",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "medium",
    "year": 0,
    "content": "已知 $7x^{2} + 2y^{2} = 10$。求 $\\dfrac{dy}{dx}$。",
    "explanation": "兩邊同時對 $x$ 求導。$7x^{2}$ 的導數是 $14x$；$2y^{2}$ 的導數是 $4y\\dfrac{dy}{dx}$ —— 因為 $y$ 是 $x$ 的函數，鏈式法則帶出 $\\dfrac{dy}{dx}$。右邊常數的導數為 $0$。由 $14x + 4y\\dfrac{dy}{dx} = 0$ 得 $\\dfrac{dy}{dx} = -\\dfrac{14x}{4y} = -\\dfrac{7x}{2y}$。",
    "options": [
      "$-\\dfrac{7x}{4y}$",
      "$-\\dfrac{7x}{2y}$",
      "$\\dfrac{7x}{2y}$",
      "$-\\dfrac{14x}{2y}$"
    ],
    "correctIndex": 1,
    "marks": 1,
    "contentEn": "Given $7x^{2} + 2y^{2} = 10$, find $\\dfrac{dy}{dx}$.",
    "optionsEn": [
      "$-\\dfrac{7x}{4y}$",
      "$-\\dfrac{7x}{2y}$",
      "$\\dfrac{7x}{2y}$",
      "$-\\dfrac{14x}{2y}$"
    ],
    "explanationEn": "Differentiate both sides with respect to $x$. $7x^{2}$ gives $14x$; $2y^{2}$ gives $4y\\dfrac{dy}{dx}$ — $y$ is a function of $x$, so the chain rule brings out $\\dfrac{dy}{dx}$. The constant on the right gives $0$. From $14x + 4y\\dfrac{dy}{dx} = 0$, $\\dfrac{dy}{dx} = -\\dfrac{14x}{4y} = -\\dfrac{7x}{2y}$.",
    "frameworkEn": "Auto-gated",
    "optionNotes": [
      {
        "optionId": 0,
        "zh": "分子已除以 $2$，分母 $4y$ 卻沒有，兩邊約簡不一致。",
        "en": "The numerator was divided by $2$ but the denominator $4y$ was not."
      },
      {
        "optionId": 1,
        "zh": "正確。由 $14x + 4y\\dfrac{dy}{dx} = 0$ 移項，分子分母同除以 $2$。",
        "en": "Correct. Rearrange $14x + 4y\\dfrac{dy}{dx} = 0$ and divide top and bottom by $2$."
      },
      {
        "optionId": 2,
        "zh": "漏了負號：$14x$ 移到等號另一邊時要變號。",
        "en": "The minus sign is missing: $14x$ changes sign when it moves across the equals sign."
      },
      {
        "optionId": 3,
        "zh": "分母已除以 $2$，分子 $14x$ 卻沒有，兩邊約簡不一致。",
        "en": "The denominator was divided by $2$ but the numerator $14x$ was not."
      }
    ]
  },
  {
    "id": "m1_rep_0031",
    "type": "mc",
    "subject": "m1",
    "topic": "differentiation",
    "topicZh": "微分法",
    "topicEn": "Differentiation",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "設 $f(x) = 2x^{3} + 5x^{2} + 3x$。求 $f''(x)$。",
    "explanation": "求導兩次。第一次：$f'(x) = 6x^{2} + 10x + 3$。第二次：$f''(x) = 12x + 10$ —— 常數項 $3$ 在第二次求導時變成 $0$。",
    "options": [
      "$12x + 10x$",
      "$12$",
      "$12x + 10$",
      "$6x^{2} + 10x + 3$"
    ],
    "correctIndex": 2,
    "marks": 1,
    "contentEn": "Let $f(x) = 2x^{3} + 5x^{2} + 3x$. Find $f''(x)$.",
    "optionsEn": [
      "$12x + 10x$",
      "$12$",
      "$12x + 10$",
      "$6x^{2} + 10x + 3$"
    ],
    "explanationEn": "Differentiate twice. First: $f'(x) = 6x^{2} + 10x + 3$. Second: $f''(x) = 12x + 10$ — the constant $3$ becomes $0$ on the second differentiation.",
    "frameworkEn": "Auto-gated",
    "optionNotes": [
      {
        "optionId": 0,
        "zh": "$10x$ 求導後應為 $10$，$x$ 要消去；這裏把 $x$ 保留了。",
        "en": "$10x$ differentiates to $10$; the $x$ should go, but it was kept."
      },
      {
        "optionId": 1,
        "zh": "這是 $f'''(x)$，多求了一次導數。",
        "en": "This is $f'''(x)$: one derivative too many."
      },
      {
        "optionId": 2,
        "zh": "正確。對 $f'(x) = 6x^{2} + 10x + 3$ 再求導一次。",
        "en": "Correct. Differentiate $f'(x) = 6x^{2} + 10x + 3$ once more."
      },
      {
        "optionId": 3,
        "zh": "這是 $f'(x)$，只求了一次導數。題目問的是 $f''(x)$，要再求導一次。",
        "en": "This is $f'(x)$, one derivative only. The question asks for $f''(x)$, so differentiate again."
      }
    ]
  },
  {
    "id": "m1_rep_0032",
    "type": "mc",
    "subject": "m1",
    "topic": "differentiation",
    "topicZh": "微分法",
    "topicEn": "Differentiation",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "設 $f(x) = 3x^{3} + 2x^{2} + 7x$。求 $f''(x)$。",
    "explanation": "求導兩次。第一次：$f'(x) = 9x^{2} + 4x + 7$。第二次：$f''(x) = 18x + 4$ —— 常數項 $7$ 在第二次求導時變成 $0$。",
    "options": [
      "$9x^{2} + 4x + 7$",
      "$18x + 4x$",
      "$18$",
      "$18x + 4$"
    ],
    "correctIndex": 3,
    "marks": 1,
    "contentEn": "Let $f(x) = 3x^{3} + 2x^{2} + 7x$. Find $f''(x)$.",
    "optionsEn": [
      "$9x^{2} + 4x + 7$",
      "$18x + 4x$",
      "$18$",
      "$18x + 4$"
    ],
    "explanationEn": "Differentiate twice. First: $f'(x) = 9x^{2} + 4x + 7$. Second: $f''(x) = 18x + 4$ — the constant $7$ becomes $0$ on the second differentiation.",
    "frameworkEn": "Auto-gated",
    "optionNotes": [
      {
        "optionId": 0,
        "zh": "這是 $f'(x)$，只求了一次導數。題目問的是 $f''(x)$，要再求導一次。",
        "en": "This is $f'(x)$, one derivative only. The question asks for $f''(x)$, so differentiate again."
      },
      {
        "optionId": 1,
        "zh": "$4x$ 求導後應為 $4$，$x$ 要消去；這裏把 $x$ 保留了。",
        "en": "$4x$ differentiates to $4$; the $x$ should go, but it was kept."
      },
      {
        "optionId": 2,
        "zh": "這是 $f'''(x)$，多求了一次導數。",
        "en": "This is $f'''(x)$: one derivative too many."
      },
      {
        "optionId": 3,
        "zh": "正確。對 $f'(x) = 9x^{2} + 4x + 7$ 再求導一次。",
        "en": "Correct. Differentiate $f'(x) = 9x^{2} + 4x + 7$ once more."
      }
    ]
  },
  {
    "id": "m1_rep_0033",
    "type": "mc",
    "subject": "m1",
    "topic": "differentiation",
    "topicZh": "微分法",
    "topicEn": "Differentiation",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "設 $f(x) = 5x^{3} + 4x^{2} + 2x$。求 $f''(x)$。",
    "explanation": "求導兩次。第一次：$f'(x) = 15x^{2} + 8x + 2$。第二次：$f''(x) = 30x + 8$ —— 常數項 $2$ 在第二次求導時變成 $0$。",
    "options": [
      "$30x + 8$",
      "$15x^{2} + 8x + 2$",
      "$30x + 8x$",
      "$30$"
    ],
    "correctIndex": 0,
    "marks": 1,
    "contentEn": "Let $f(x) = 5x^{3} + 4x^{2} + 2x$. Find $f''(x)$.",
    "optionsEn": [
      "$30x + 8$",
      "$15x^{2} + 8x + 2$",
      "$30x + 8x$",
      "$30$"
    ],
    "explanationEn": "Differentiate twice. First: $f'(x) = 15x^{2} + 8x + 2$. Second: $f''(x) = 30x + 8$ — the constant $2$ becomes $0$ on the second differentiation.",
    "frameworkEn": "Auto-gated",
    "optionNotes": [
      {
        "optionId": 0,
        "zh": "正確。對 $f'(x) = 15x^{2} + 8x + 2$ 再求導一次。",
        "en": "Correct. Differentiate $f'(x) = 15x^{2} + 8x + 2$ once more."
      },
      {
        "optionId": 1,
        "zh": "這是 $f'(x)$，只求了一次導數。題目問的是 $f''(x)$，要再求導一次。",
        "en": "This is $f'(x)$, one derivative only. The question asks for $f''(x)$, so differentiate again."
      },
      {
        "optionId": 2,
        "zh": "$8x$ 求導後應為 $8$，$x$ 要消去；這裏把 $x$ 保留了。",
        "en": "$8x$ differentiates to $8$; the $x$ should go, but it was kept."
      },
      {
        "optionId": 3,
        "zh": "這是 $f'''(x)$，多求了一次導數。",
        "en": "This is $f'''(x)$: one derivative too many."
      }
    ]
  },
  {
    "id": "m1_rep_0034",
    "type": "mc",
    "subject": "m1",
    "topic": "differentiation",
    "topicZh": "微分法",
    "topicEn": "Differentiation",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "設 $f(x) = 4x^{3} + 7x^{2} + 5x$。求 $f''(x)$。",
    "explanation": "求導兩次。第一次：$f'(x) = 12x^{2} + 14x + 5$。第二次：$f''(x) = 24x + 14$ —— 常數項 $5$ 在第二次求導時變成 $0$。",
    "options": [
      "$24$",
      "$24x + 14$",
      "$12x^{2} + 14x + 5$",
      "$24x + 14x$"
    ],
    "correctIndex": 1,
    "marks": 1,
    "contentEn": "Let $f(x) = 4x^{3} + 7x^{2} + 5x$. Find $f''(x)$.",
    "optionsEn": [
      "$24$",
      "$24x + 14$",
      "$12x^{2} + 14x + 5$",
      "$24x + 14x$"
    ],
    "explanationEn": "Differentiate twice. First: $f'(x) = 12x^{2} + 14x + 5$. Second: $f''(x) = 24x + 14$ — the constant $5$ becomes $0$ on the second differentiation.",
    "frameworkEn": "Auto-gated",
    "optionNotes": [
      {
        "optionId": 0,
        "zh": "這是 $f'''(x)$，多求了一次導數。",
        "en": "This is $f'''(x)$: one derivative too many."
      },
      {
        "optionId": 1,
        "zh": "正確。對 $f'(x) = 12x^{2} + 14x + 5$ 再求導一次。",
        "en": "Correct. Differentiate $f'(x) = 12x^{2} + 14x + 5$ once more."
      },
      {
        "optionId": 2,
        "zh": "這是 $f'(x)$，只求了一次導數。題目問的是 $f''(x)$，要再求導一次。",
        "en": "This is $f'(x)$, one derivative only. The question asks for $f''(x)$, so differentiate again."
      },
      {
        "optionId": 3,
        "zh": "$14x$ 求導後應為 $14$，$x$ 要消去；這裏把 $x$ 保留了。",
        "en": "$14x$ differentiates to $14$; the $x$ should go, but it was kept."
      }
    ]
  },
  {
    "id": "m1_rep_0035",
    "type": "mc",
    "subject": "m1",
    "topic": "differentiation",
    "topicZh": "微分法",
    "topicEn": "Differentiation",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "設 $f(x) = 6x^{3} + 3x^{2} + 4x$。求 $f''(x)$。",
    "explanation": "求導兩次。第一次：$f'(x) = 18x^{2} + 6x + 4$。第二次：$f''(x) = 36x + 6$ —— 常數項 $4$ 在第二次求導時變成 $0$。",
    "options": [
      "$36x + 6x$",
      "$36$",
      "$36x + 6$",
      "$18x^{2} + 6x + 4$"
    ],
    "correctIndex": 2,
    "marks": 1,
    "contentEn": "Let $f(x) = 6x^{3} + 3x^{2} + 4x$. Find $f''(x)$.",
    "optionsEn": [
      "$36x + 6x$",
      "$36$",
      "$36x + 6$",
      "$18x^{2} + 6x + 4$"
    ],
    "explanationEn": "Differentiate twice. First: $f'(x) = 18x^{2} + 6x + 4$. Second: $f''(x) = 36x + 6$ — the constant $4$ becomes $0$ on the second differentiation.",
    "frameworkEn": "Auto-gated",
    "optionNotes": [
      {
        "optionId": 0,
        "zh": "$6x$ 求導後應為 $6$，$x$ 要消去；這裏把 $x$ 保留了。",
        "en": "$6x$ differentiates to $6$; the $x$ should go, but it was kept."
      },
      {
        "optionId": 1,
        "zh": "這是 $f'''(x)$，多求了一次導數。",
        "en": "This is $f'''(x)$: one derivative too many."
      },
      {
        "optionId": 2,
        "zh": "正確。對 $f'(x) = 18x^{2} + 6x + 4$ 再求導一次。",
        "en": "Correct. Differentiate $f'(x) = 18x^{2} + 6x + 4$ once more."
      },
      {
        "optionId": 3,
        "zh": "這是 $f'(x)$，只求了一次導數。題目問的是 $f''(x)$，要再求導一次。",
        "en": "This is $f'(x)$, one derivative only. The question asks for $f''(x)$, so differentiate again."
      }
    ]
  },
  {
    "id": "m1_rep_0036",
    "type": "mc",
    "subject": "m1",
    "topic": "differentiation",
    "topicZh": "微分法",
    "topicEn": "Differentiation",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "設 $f(x) = 7x^{3} + 5x^{2} + 6x$。求 $f''(x)$。",
    "explanation": "求導兩次。第一次：$f'(x) = 21x^{2} + 10x + 6$。第二次：$f''(x) = 42x + 10$ —— 常數項 $6$ 在第二次求導時變成 $0$。",
    "options": [
      "$21x^{2} + 10x + 6$",
      "$42x + 10x$",
      "$42$",
      "$42x + 10$"
    ],
    "correctIndex": 3,
    "marks": 1,
    "contentEn": "Let $f(x) = 7x^{3} + 5x^{2} + 6x$. Find $f''(x)$.",
    "optionsEn": [
      "$21x^{2} + 10x + 6$",
      "$42x + 10x$",
      "$42$",
      "$42x + 10$"
    ],
    "explanationEn": "Differentiate twice. First: $f'(x) = 21x^{2} + 10x + 6$. Second: $f''(x) = 42x + 10$ — the constant $6$ becomes $0$ on the second differentiation.",
    "frameworkEn": "Auto-gated",
    "optionNotes": [
      {
        "optionId": 0,
        "zh": "這是 $f'(x)$，只求了一次導數。題目問的是 $f''(x)$，要再求導一次。",
        "en": "This is $f'(x)$, one derivative only. The question asks for $f''(x)$, so differentiate again."
      },
      {
        "optionId": 1,
        "zh": "$10x$ 求導後應為 $10$，$x$ 要消去；這裏把 $x$ 保留了。",
        "en": "$10x$ differentiates to $10$; the $x$ should go, but it was kept."
      },
      {
        "optionId": 2,
        "zh": "這是 $f'''(x)$，多求了一次導數。",
        "en": "This is $f'''(x)$: one derivative too many."
      },
      {
        "optionId": 3,
        "zh": "正確。對 $f'(x) = 21x^{2} + 10x + 6$ 再求導一次。",
        "en": "Correct. Differentiate $f'(x) = 21x^{2} + 10x + 6$ once more."
      }
    ]
  },
  {
    "id": "m1_rep_0037",
    "type": "mc",
    "subject": "m1",
    "topic": "differentiation",
    "topicZh": "微分法",
    "topicEn": "Differentiation",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "設 $f(x) = x^{2} -8 x$。求 $f(x)$ 為【遞增】的 $x$ 範圍。",
    "explanation": "函數遞增即導數為正。$f'(x) = 2x - 8$，令 $f'(x) > 0$，得 $x > 4$。亦可用圖像檢查：這是開口向上的拋物線，頂點在 $x = 4$，頂點右邊上升、左邊下降。",
    "options": [
      "$x > 4$",
      "$x < 4$",
      "$x > 8$",
      "$x > 0$"
    ],
    "correctIndex": 0,
    "marks": 1,
    "contentEn": "Let $f(x) = x^{2} -8 x$. For which values of $x$ is $f(x)$ *increasing*?",
    "optionsEn": [
      "$x > 4$",
      "$x < 4$",
      "$x > 8$",
      "$x > 0$"
    ],
    "explanationEn": "A function increases where its derivative is positive. $f'(x) = 2x - 8$; $f'(x) > 0$ gives $x > 4$. Check with the graph: an upward parabola with its vertex at $x = 4$, rising to the right of the vertex and falling to the left.",
    "frameworkEn": "Auto-gated",
    "optionNotes": [
      {
        "optionId": 0,
        "zh": "正確。解 $2x - 8 > 0$，得 $x > 4$。",
        "en": "Correct. Solving $2x - 8 > 0$ gives $x > 4$."
      },
      {
        "optionId": 1,
        "zh": "不等號方向反了：$x < 4$ 時 $f'(x) < 0$，那是遞減的範圍。",
        "en": "The inequality is the wrong way round: for $x < 4$, $f'(x) < 0$, which is where $f$ decreases."
      },
      {
        "optionId": 2,
        "zh": "把 $f'(x)$ 寫成 $x - 8$，漏了 $x^{2}$ 求導時帶出的係數 $2$。",
        "en": "This takes $f'(x)$ as $x - 8$, missing the coefficient $2$ that comes from differentiating $x^{2}$."
      },
      {
        "optionId": 3,
        "zh": "$x > 0$ 只是「正數」，但頂點在 $x = 4$，不在原點；$0 < x < 4$ 時函數其實在下降。",
        "en": "$x > 0$ just means \"positive\", but the vertex is at $x = 4$, not at the origin; for $0 < x < 4$ the function is falling."
      }
    ]
  },
  {
    "id": "m1_rep_0038",
    "type": "mc",
    "subject": "m1",
    "topic": "differentiation",
    "topicZh": "微分法",
    "topicEn": "Differentiation",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "設 $f(x) = 2x^{2} -12 x$。求 $f(x)$ 為【遞增】的 $x$ 範圍。",
    "explanation": "函數遞增即導數為正。$f'(x) = 4x - 12$，令 $f'(x) > 0$，得 $x > 3$。亦可用圖像檢查：這是開口向上的拋物線，頂點在 $x = 3$，頂點右邊上升、左邊下降。",
    "options": [
      "$x > 0$",
      "$x > 3$",
      "$x < 3$",
      "$x > 12$"
    ],
    "correctIndex": 1,
    "marks": 1,
    "contentEn": "Let $f(x) = 2x^{2} -12 x$. For which values of $x$ is $f(x)$ *increasing*?",
    "optionsEn": [
      "$x > 0$",
      "$x > 3$",
      "$x < 3$",
      "$x > 12$"
    ],
    "explanationEn": "A function increases where its derivative is positive. $f'(x) = 4x - 12$; $f'(x) > 0$ gives $x > 3$. Check with the graph: an upward parabola with its vertex at $x = 3$, rising to the right of the vertex and falling to the left.",
    "frameworkEn": "Auto-gated",
    "optionNotes": [
      {
        "optionId": 0,
        "zh": "$x > 0$ 只是「正數」，但頂點在 $x = 3$，不在原點；$0 < x < 3$ 時函數其實在下降。",
        "en": "$x > 0$ just means \"positive\", but the vertex is at $x = 3$, not at the origin; for $0 < x < 3$ the function is falling."
      },
      {
        "optionId": 1,
        "zh": "正確。解 $4x - 12 > 0$，得 $x > 3$。",
        "en": "Correct. Solving $4x - 12 > 0$ gives $x > 3$."
      },
      {
        "optionId": 2,
        "zh": "不等號方向反了：$x < 3$ 時 $f'(x) < 0$，那是遞減的範圍。",
        "en": "The inequality is the wrong way round: for $x < 3$, $f'(x) < 0$, which is where $f$ decreases."
      },
      {
        "optionId": 3,
        "zh": "把 $f'(x)$ 寫成 $x - 12$，漏了 $2x^{2}$ 求導時帶出的係數 $4$。",
        "en": "This takes $f'(x)$ as $x - 12$, missing the coefficient $4$ that comes from differentiating $2x^{2}$."
      }
    ]
  },
  {
    "id": "m1_rep_0039",
    "type": "mc",
    "subject": "m1",
    "topic": "differentiation",
    "topicZh": "微分法",
    "topicEn": "Differentiation",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "設 $f(x) = x^{2} -4 x$。求 $f(x)$ 為【遞增】的 $x$ 範圍。",
    "explanation": "函數遞增即導數為正。$f'(x) = 2x - 4$，令 $f'(x) > 0$，得 $x > 2$。亦可用圖像檢查：這是開口向上的拋物線，頂點在 $x = 2$，頂點右邊上升、左邊下降。",
    "options": [
      "$x > 4$",
      "$x > 0$",
      "$x > 2$",
      "$x < 2$"
    ],
    "correctIndex": 2,
    "marks": 1,
    "contentEn": "Let $f(x) = x^{2} -4 x$. For which values of $x$ is $f(x)$ *increasing*?",
    "optionsEn": [
      "$x > 4$",
      "$x > 0$",
      "$x > 2$",
      "$x < 2$"
    ],
    "explanationEn": "A function increases where its derivative is positive. $f'(x) = 2x - 4$; $f'(x) > 0$ gives $x > 2$. Check with the graph: an upward parabola with its vertex at $x = 2$, rising to the right of the vertex and falling to the left.",
    "frameworkEn": "Auto-gated",
    "optionNotes": [
      {
        "optionId": 0,
        "zh": "把 $f'(x)$ 寫成 $x - 4$，漏了 $x^{2}$ 求導時帶出的係數 $2$。",
        "en": "This takes $f'(x)$ as $x - 4$, missing the coefficient $2$ that comes from differentiating $x^{2}$."
      },
      {
        "optionId": 1,
        "zh": "$x > 0$ 只是「正數」，但頂點在 $x = 2$，不在原點；$0 < x < 2$ 時函數其實在下降。",
        "en": "$x > 0$ just means \"positive\", but the vertex is at $x = 2$, not at the origin; for $0 < x < 2$ the function is falling."
      },
      {
        "optionId": 2,
        "zh": "正確。解 $2x - 4 > 0$，得 $x > 2$。",
        "en": "Correct. Solving $2x - 4 > 0$ gives $x > 2$."
      },
      {
        "optionId": 3,
        "zh": "不等號方向反了：$x < 2$ 時 $f'(x) < 0$，那是遞減的範圍。",
        "en": "The inequality is the wrong way round: for $x < 2$, $f'(x) < 0$, which is where $f$ decreases."
      }
    ]
  },
  {
    "id": "m1_rep_0040",
    "type": "mc",
    "subject": "m1",
    "topic": "differentiation",
    "topicZh": "微分法",
    "topicEn": "Differentiation",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "設 $f(x) = 3x^{2} -18 x$。求 $f(x)$ 為【遞增】的 $x$ 範圍。",
    "explanation": "函數遞增即導數為正。$f'(x) = 6x - 18$，令 $f'(x) > 0$，得 $x > 3$。亦可用圖像檢查：這是開口向上的拋物線，頂點在 $x = 3$，頂點右邊上升、左邊下降。",
    "options": [
      "$x < 3$",
      "$x > 18$",
      "$x > 0$",
      "$x > 3$"
    ],
    "correctIndex": 3,
    "marks": 1,
    "contentEn": "Let $f(x) = 3x^{2} -18 x$. For which values of $x$ is $f(x)$ *increasing*?",
    "optionsEn": [
      "$x < 3$",
      "$x > 18$",
      "$x > 0$",
      "$x > 3$"
    ],
    "explanationEn": "A function increases where its derivative is positive. $f'(x) = 6x - 18$; $f'(x) > 0$ gives $x > 3$. Check with the graph: an upward parabola with its vertex at $x = 3$, rising to the right of the vertex and falling to the left.",
    "frameworkEn": "Auto-gated",
    "optionNotes": [
      {
        "optionId": 0,
        "zh": "不等號方向反了：$x < 3$ 時 $f'(x) < 0$，那是遞減的範圍。",
        "en": "The inequality is the wrong way round: for $x < 3$, $f'(x) < 0$, which is where $f$ decreases."
      },
      {
        "optionId": 1,
        "zh": "把 $f'(x)$ 寫成 $x - 18$，漏了 $3x^{2}$ 求導時帶出的係數 $6$。",
        "en": "This takes $f'(x)$ as $x - 18$, missing the coefficient $6$ that comes from differentiating $3x^{2}$."
      },
      {
        "optionId": 2,
        "zh": "$x > 0$ 只是「正數」，但頂點在 $x = 3$，不在原點；$0 < x < 3$ 時函數其實在下降。",
        "en": "$x > 0$ just means \"positive\", but the vertex is at $x = 3$, not at the origin; for $0 < x < 3$ the function is falling."
      },
      {
        "optionId": 3,
        "zh": "正確。解 $6x - 18 > 0$，得 $x > 3$。",
        "en": "Correct. Solving $6x - 18 > 0$ gives $x > 3$."
      }
    ]
  },
  {
    "id": "m1_rep_0041",
    "type": "mc",
    "subject": "m1",
    "topic": "differentiation",
    "topicZh": "微分法",
    "topicEn": "Differentiation",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "設 $f(x) = x^{2} -10 x$。求 $f(x)$ 為【遞增】的 $x$ 範圍。",
    "explanation": "函數遞增即導數為正。$f'(x) = 2x - 10$，令 $f'(x) > 0$，得 $x > 5$。亦可用圖像檢查：這是開口向上的拋物線，頂點在 $x = 5$，頂點右邊上升、左邊下降。",
    "options": [
      "$x > 5$",
      "$x < 5$",
      "$x > 10$",
      "$x > 0$"
    ],
    "correctIndex": 0,
    "marks": 1,
    "contentEn": "Let $f(x) = x^{2} -10 x$. For which values of $x$ is $f(x)$ *increasing*?",
    "optionsEn": [
      "$x > 5$",
      "$x < 5$",
      "$x > 10$",
      "$x > 0$"
    ],
    "explanationEn": "A function increases where its derivative is positive. $f'(x) = 2x - 10$; $f'(x) > 0$ gives $x > 5$. Check with the graph: an upward parabola with its vertex at $x = 5$, rising to the right of the vertex and falling to the left.",
    "frameworkEn": "Auto-gated",
    "optionNotes": [
      {
        "optionId": 0,
        "zh": "正確。解 $2x - 10 > 0$，得 $x > 5$。",
        "en": "Correct. Solving $2x - 10 > 0$ gives $x > 5$."
      },
      {
        "optionId": 1,
        "zh": "不等號方向反了：$x < 5$ 時 $f'(x) < 0$，那是遞減的範圍。",
        "en": "The inequality is the wrong way round: for $x < 5$, $f'(x) < 0$, which is where $f$ decreases."
      },
      {
        "optionId": 2,
        "zh": "把 $f'(x)$ 寫成 $x - 10$，漏了 $x^{2}$ 求導時帶出的係數 $2$。",
        "en": "This takes $f'(x)$ as $x - 10$, missing the coefficient $2$ that comes from differentiating $x^{2}$."
      },
      {
        "optionId": 3,
        "zh": "$x > 0$ 只是「正數」，但頂點在 $x = 5$，不在原點；$0 < x < 5$ 時函數其實在下降。",
        "en": "$x > 0$ just means \"positive\", but the vertex is at $x = 5$, not at the origin; for $0 < x < 5$ the function is falling."
      }
    ]
  },
  {
    "id": "m1_rep_0042",
    "type": "mc",
    "subject": "m1",
    "topic": "differentiation",
    "topicZh": "微分法",
    "topicEn": "Differentiation",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "設 $f(x) = 2x^{2} -20 x$。求 $f(x)$ 為【遞增】的 $x$ 範圍。",
    "explanation": "函數遞增即導數為正。$f'(x) = 4x - 20$，令 $f'(x) > 0$，得 $x > 5$。亦可用圖像檢查：這是開口向上的拋物線，頂點在 $x = 5$，頂點右邊上升、左邊下降。",
    "options": [
      "$x > 0$",
      "$x > 5$",
      "$x < 5$",
      "$x > 20$"
    ],
    "correctIndex": 1,
    "marks": 1,
    "contentEn": "Let $f(x) = 2x^{2} -20 x$. For which values of $x$ is $f(x)$ *increasing*?",
    "optionsEn": [
      "$x > 0$",
      "$x > 5$",
      "$x < 5$",
      "$x > 20$"
    ],
    "explanationEn": "A function increases where its derivative is positive. $f'(x) = 4x - 20$; $f'(x) > 0$ gives $x > 5$. Check with the graph: an upward parabola with its vertex at $x = 5$, rising to the right of the vertex and falling to the left.",
    "frameworkEn": "Auto-gated",
    "optionNotes": [
      {
        "optionId": 0,
        "zh": "$x > 0$ 只是「正數」，但頂點在 $x = 5$，不在原點；$0 < x < 5$ 時函數其實在下降。",
        "en": "$x > 0$ just means \"positive\", but the vertex is at $x = 5$, not at the origin; for $0 < x < 5$ the function is falling."
      },
      {
        "optionId": 1,
        "zh": "正確。解 $4x - 20 > 0$，得 $x > 5$。",
        "en": "Correct. Solving $4x - 20 > 0$ gives $x > 5$."
      },
      {
        "optionId": 2,
        "zh": "不等號方向反了：$x < 5$ 時 $f'(x) < 0$，那是遞減的範圍。",
        "en": "The inequality is the wrong way round: for $x < 5$, $f'(x) < 0$, which is where $f$ decreases."
      },
      {
        "optionId": 3,
        "zh": "把 $f'(x)$ 寫成 $x - 20$，漏了 $2x^{2}$ 求導時帶出的係數 $4$。",
        "en": "This takes $f'(x)$ as $x - 20$, missing the coefficient $4$ that comes from differentiating $2x^{2}$."
      }
    ]
  },
  {
    "id": "m1_rep_0043",
    "type": "mc",
    "subject": "m1",
    "topic": "differentiation",
    "topicZh": "微分法",
    "topicEn": "Differentiation",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "medium",
    "year": 0,
    "content": "設 $f(x) = x^{2} -6 x + 2$。試用二階導數判別法，判斷 $x = 3$ 這個駐點的性質。",
    "explanation": "二階導數判別法：先找駐點（$f'(x) = 0$），再看該點的二階導數。$f'(x) = 2x - 6$，在 $x = 3$ 時為 $0$，所以是駐點；$f''(x) = 2$，恆為正。$f'' > 0$ 表示曲線在該處向上凹（形如「U」），所以是極小值點。",
    "options": [
      "拐點，因為 $f''(3) = 0$",
      "極大值點，因為 $f'(3) = 0$",
      "極小值點，因為 $f''(3) = 2 > 0$",
      "極大值點，因為 $f''(3) = 2 > 0$"
    ],
    "correctIndex": 2,
    "marks": 1,
    "contentEn": "Let $f(x) = x^{2} -6 x + 2$. Use the second derivative test to classify the stationary point at $x = 3$.",
    "optionsEn": [
      "A point of inflexion, since $f''(3) = 0$",
      "A maximum, since $f'(3) = 0$",
      "A minimum, since $f''(3) = 2 > 0$",
      "A maximum, since $f''(3) = 2 > 0$"
    ],
    "explanationEn": "Second-derivative test: find where $f'(x) = 0$, then look at $f''$ there. $f'(x) = 2x - 6$ is $0$ at $x = 3$, so the point is stationary; $f''(x) = 2$ is always positive. $f'' > 0$ means the curve is concave up (a \"U\" shape), so the point is a minimum.",
    "frameworkEn": "Auto-gated",
    "optionNotes": [
      {
        "optionId": 0,
        "zh": "$f''(x)$ 恆等於 $2$，不等於 $0$。而且即使 $f'' = 0$，二階導數判別法亦只是未能判斷，並不表示該點是拐點。",
        "en": "$f''(x)$ is $2$ everywhere, not $0$. Even where $f'' = 0$, the test is only inconclusive; it does not make the point an inflection."
      },
      {
        "optionId": 1,
        "zh": "$f'(3) = 0$ 只說明這是駐點，不能分辨極大或極小；要看 $f''$ 的正負。",
        "en": "$f'(3) = 0$ only shows the point is stationary; it cannot tell a maximum from a minimum. Look at the sign of $f''$."
      },
      {
        "optionId": 2,
        "zh": "正確。$f''(3) = 2 > 0$，曲線向上凹，是極小值點。",
        "en": "Correct. $f''(3) = 2 > 0$: the curve is concave up, so this is a minimum."
      },
      {
        "optionId": 3,
        "zh": "$f''(3) > 0$ 的計算對，但結論反了：$f'' > 0$ 是極小值，$f'' < 0$ 才是極大值。",
        "en": "$f''(3) > 0$ is right, but the conclusion is reversed: $f'' > 0$ means a minimum; $f'' < 0$ a maximum."
      }
    ]
  },
  {
    "id": "m1_rep_0044",
    "type": "mc",
    "subject": "m1",
    "topic": "differentiation",
    "topicZh": "微分法",
    "topicEn": "Differentiation",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "medium",
    "year": 0,
    "content": "設 $f(x) = 2x^{2} -12 x + 5$。試用二階導數判別法，判斷 $x = 3$ 這個駐點的性質。",
    "explanation": "二階導數判別法：先找駐點（$f'(x) = 0$），再看該點的二階導數。$f'(x) = 4x - 12$，在 $x = 3$ 時為 $0$，所以是駐點；$f''(x) = 4$，恆為正。$f'' > 0$ 表示曲線在該處向上凹（形如「U」），所以是極小值點。",
    "options": [
      "極大值點，因為 $f''(3) = 4 > 0$",
      "拐點，因為 $f''(3) = 0$",
      "極大值點，因為 $f'(3) = 0$",
      "極小值點，因為 $f''(3) = 4 > 0$"
    ],
    "correctIndex": 3,
    "marks": 1,
    "contentEn": "Let $f(x) = 2x^{2} -12 x + 5$. Use the second derivative test to classify the stationary point at $x = 3$.",
    "optionsEn": [
      "A maximum, since $f''(3) = 4 > 0$",
      "A point of inflexion, since $f''(3) = 0$",
      "A maximum, since $f'(3) = 0$",
      "A minimum, since $f''(3) = 4 > 0$"
    ],
    "explanationEn": "Second-derivative test: find where $f'(x) = 0$, then look at $f''$ there. $f'(x) = 4x - 12$ is $0$ at $x = 3$, so the point is stationary; $f''(x) = 4$ is always positive. $f'' > 0$ means the curve is concave up (a \"U\" shape), so the point is a minimum.",
    "frameworkEn": "Auto-gated",
    "optionNotes": [
      {
        "optionId": 0,
        "zh": "$f''(3) > 0$ 的計算對，但結論反了：$f'' > 0$ 是極小值，$f'' < 0$ 才是極大值。",
        "en": "$f''(3) > 0$ is right, but the conclusion is reversed: $f'' > 0$ means a minimum; $f'' < 0$ a maximum."
      },
      {
        "optionId": 1,
        "zh": "$f''(x)$ 恆等於 $4$，不等於 $0$。而且即使 $f'' = 0$，二階導數判別法亦只是未能判斷，並不表示該點是拐點。",
        "en": "$f''(x)$ is $4$ everywhere, not $0$. Even where $f'' = 0$, the test is only inconclusive; it does not make the point an inflection."
      },
      {
        "optionId": 2,
        "zh": "$f'(3) = 0$ 只說明這是駐點，不能分辨極大或極小；要看 $f''$ 的正負。",
        "en": "$f'(3) = 0$ only shows the point is stationary; it cannot tell a maximum from a minimum. Look at the sign of $f''$."
      },
      {
        "optionId": 3,
        "zh": "正確。$f''(3) = 4 > 0$，曲線向上凹，是極小值點。",
        "en": "Correct. $f''(3) = 4 > 0$: the curve is concave up, so this is a minimum."
      }
    ]
  },
  {
    "id": "m1_rep_0045",
    "type": "mc",
    "subject": "m1",
    "topic": "normal_distribution",
    "topicZh": "正態分佈",
    "topicEn": "Normal Distribution",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "某校測驗成績服從正態分佈，平均分 $60$，標準差 $8$。小明考獲 $68$ 分。\n\n他的成績高於平均分多少個標準差？",
    "explanation": "標準分數量度的是「距離平均值有多少個標準差」：$z = \\dfrac{x - \\mu}{\\sigma} = \\dfrac{68 - 60}{8} = 1$。先減平均值得出差距，再除以標準差，把差距換算成標準差的數目。",
    "options": [
      "$1$ 個標準差",
      "$8$ 個標準差",
      "$7.5$ 個標準差",
      "$8.5$ 個標準差"
    ],
    "correctIndex": 0,
    "marks": 1,
    "contentEn": "Test scores at a school are normally distributed with mean $60$ and standard deviation $8$. Ming scored $68$.\n\nHow many standard deviations above the mean is his score?",
    "optionsEn": [
      "$1$ standard deviations",
      "$8$ standard deviations",
      "$7.5$ standard deviations",
      "$8.5$ standard deviations"
    ],
    "explanationEn": "A standard score measures how many standard deviations a value is from the mean: $z = \\dfrac{x - \\mu}{\\sigma} = \\dfrac{68 - 60}{8} = 1$. Subtract the mean to get the gap, then divide by the standard deviation to count it in standard deviations.",
    "frameworkEn": "Auto-gated",
    "optionNotes": [
      {
        "optionId": 0,
        "zh": "正確。$\\dfrac{68 - 60}{8} = 1$。",
        "en": "Correct. $\\dfrac{68 - 60}{8} = 1$."
      },
      {
        "optionId": 1,
        "zh": "$68 - 60 = 8$ 是分數的差距，單位仍然是「分」；還要除以標準差 $8$。",
        "en": "$68 - 60 = 8$ is the gap in marks; it still has to be divided by the standard deviation $8$."
      },
      {
        "optionId": 2,
        "zh": "$\\dfrac{60}{8}$：這是平均分除以標準差，與小明的分數無關。",
        "en": "$\\dfrac{60}{8}$ is the mean divided by the standard deviation; it has nothing to do with the student's score."
      },
      {
        "optionId": 3,
        "zh": "$\\dfrac{68}{8}$：直接把分數除以標準差，漏了先減去平均分 $60$。",
        "en": "$\\dfrac{68}{8}$ divides the score by the standard deviation without first subtracting the mean $60$."
      }
    ]
  },
  {
    "id": "m1_rep_0046",
    "type": "mc",
    "subject": "m1",
    "topic": "normal_distribution",
    "topicZh": "正態分佈",
    "topicEn": "Normal Distribution",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "某校測驗成績服從正態分佈，平均分 $100$，標準差 $15$。小明考獲 $130$ 分。\n\n他的成績高於平均分多少個標準差？",
    "explanation": "標準分數量度的是「距離平均值有多少個標準差」：$z = \\dfrac{x - \\mu}{\\sigma} = \\dfrac{130 - 100}{15} = 2$。先減平均值得出差距，再除以標準差，把差距換算成標準差的數目。",
    "options": [
      "$8.6667$ 個標準差",
      "$2$ 個標準差",
      "$30$ 個標準差",
      "$6.6667$ 個標準差"
    ],
    "correctIndex": 1,
    "marks": 1,
    "contentEn": "Test scores at a school are normally distributed with mean $100$ and standard deviation $15$. Ming scored $130$.\n\nHow many standard deviations above the mean is his score?",
    "optionsEn": [
      "$8.6667$ standard deviations",
      "$2$ standard deviations",
      "$30$ standard deviations",
      "$6.6667$ standard deviations"
    ],
    "explanationEn": "A standard score measures how many standard deviations a value is from the mean: $z = \\dfrac{x - \\mu}{\\sigma} = \\dfrac{130 - 100}{15} = 2$. Subtract the mean to get the gap, then divide by the standard deviation to count it in standard deviations.",
    "frameworkEn": "Auto-gated",
    "optionNotes": [
      {
        "optionId": 0,
        "zh": "$\\dfrac{130}{15}$：直接把分數除以標準差，漏了先減去平均分 $100$。",
        "en": "$\\dfrac{130}{15}$ divides the score by the standard deviation without first subtracting the mean $100$."
      },
      {
        "optionId": 1,
        "zh": "正確。$\\dfrac{130 - 100}{15} = 2$。",
        "en": "Correct. $\\dfrac{130 - 100}{15} = 2$."
      },
      {
        "optionId": 2,
        "zh": "$130 - 100 = 30$ 是分數的差距，單位仍然是「分」；還要除以標準差 $15$。",
        "en": "$130 - 100 = 30$ is the gap in marks; it still has to be divided by the standard deviation $15$."
      },
      {
        "optionId": 3,
        "zh": "$\\dfrac{100}{15}$：這是平均分除以標準差，與小明的分數無關。",
        "en": "$\\dfrac{100}{15}$ is the mean divided by the standard deviation; it has nothing to do with the student's score."
      }
    ]
  },
  {
    "id": "m1_rep_0047",
    "type": "mc",
    "subject": "m1",
    "topic": "normal_distribution",
    "topicZh": "正態分佈",
    "topicEn": "Normal Distribution",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "某校測驗成績服從正態分佈，平均分 $50$，標準差 $5$。小明考獲 $55$ 分。\n\n他的成績高於平均分多少個標準差？",
    "explanation": "標準分數量度的是「距離平均值有多少個標準差」：$z = \\dfrac{x - \\mu}{\\sigma} = \\dfrac{55 - 50}{5} = 1$。先減平均值得出差距，再除以標準差，把差距換算成標準差的數目。",
    "options": [
      "$10$ 個標準差",
      "$11$ 個標準差",
      "$1$ 個標準差",
      "$5$ 個標準差"
    ],
    "correctIndex": 2,
    "marks": 1,
    "contentEn": "Test scores at a school are normally distributed with mean $50$ and standard deviation $5$. Ming scored $55$.\n\nHow many standard deviations above the mean is his score?",
    "optionsEn": [
      "$10$ standard deviations",
      "$11$ standard deviations",
      "$1$ standard deviations",
      "$5$ standard deviations"
    ],
    "explanationEn": "A standard score measures how many standard deviations a value is from the mean: $z = \\dfrac{x - \\mu}{\\sigma} = \\dfrac{55 - 50}{5} = 1$. Subtract the mean to get the gap, then divide by the standard deviation to count it in standard deviations.",
    "frameworkEn": "Auto-gated",
    "optionNotes": [
      {
        "optionId": 0,
        "zh": "$\\dfrac{50}{5}$：這是平均分除以標準差，與小明的分數無關。",
        "en": "$\\dfrac{50}{5}$ is the mean divided by the standard deviation; it has nothing to do with the student's score."
      },
      {
        "optionId": 1,
        "zh": "$\\dfrac{55}{5}$：直接把分數除以標準差，漏了先減去平均分 $50$。",
        "en": "$\\dfrac{55}{5}$ divides the score by the standard deviation without first subtracting the mean $50$."
      },
      {
        "optionId": 2,
        "zh": "正確。$\\dfrac{55 - 50}{5} = 1$。",
        "en": "Correct. $\\dfrac{55 - 50}{5} = 1$."
      },
      {
        "optionId": 3,
        "zh": "$55 - 50 = 5$ 是分數的差距，單位仍然是「分」；還要除以標準差 $5$。",
        "en": "$55 - 50 = 5$ is the gap in marks; it still has to be divided by the standard deviation $5$."
      }
    ]
  },
  {
    "id": "m1_rep_0048",
    "type": "mc",
    "subject": "m1",
    "topic": "normal_distribution",
    "topicZh": "正態分佈",
    "topicEn": "Normal Distribution",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "某校測驗成績服從正態分佈，平均分 $72$，標準差 $8$。小明考獲 $88$ 分。\n\n他的成績高於平均分多少個標準差？",
    "explanation": "標準分數量度的是「距離平均值有多少個標準差」：$z = \\dfrac{x - \\mu}{\\sigma} = \\dfrac{88 - 72}{8} = 2$。先減平均值得出差距，再除以標準差，把差距換算成標準差的數目。",
    "options": [
      "$16$ 個標準差",
      "$9$ 個標準差",
      "$11$ 個標準差",
      "$2$ 個標準差"
    ],
    "correctIndex": 3,
    "marks": 1,
    "contentEn": "Test scores at a school are normally distributed with mean $72$ and standard deviation $8$. Ming scored $88$.\n\nHow many standard deviations above the mean is his score?",
    "optionsEn": [
      "$16$ standard deviations",
      "$9$ standard deviations",
      "$11$ standard deviations",
      "$2$ standard deviations"
    ],
    "explanationEn": "A standard score measures how many standard deviations a value is from the mean: $z = \\dfrac{x - \\mu}{\\sigma} = \\dfrac{88 - 72}{8} = 2$. Subtract the mean to get the gap, then divide by the standard deviation to count it in standard deviations.",
    "frameworkEn": "Auto-gated",
    "optionNotes": [
      {
        "optionId": 0,
        "zh": "$88 - 72 = 16$ 是分數的差距，單位仍然是「分」；還要除以標準差 $8$。",
        "en": "$88 - 72 = 16$ is the gap in marks; it still has to be divided by the standard deviation $8$."
      },
      {
        "optionId": 1,
        "zh": "$\\dfrac{72}{8}$：這是平均分除以標準差，與小明的分數無關。",
        "en": "$\\dfrac{72}{8}$ is the mean divided by the standard deviation; it has nothing to do with the student's score."
      },
      {
        "optionId": 2,
        "zh": "$\\dfrac{88}{8}$：直接把分數除以標準差，漏了先減去平均分 $72$。",
        "en": "$\\dfrac{88}{8}$ divides the score by the standard deviation without first subtracting the mean $72$."
      },
      {
        "optionId": 3,
        "zh": "正確。$\\dfrac{88 - 72}{8} = 2$。",
        "en": "Correct. $\\dfrac{88 - 72}{8} = 2$."
      }
    ]
  },
  {
    "id": "m1_rep_0049",
    "type": "mc",
    "subject": "m1",
    "topic": "normal_distribution",
    "topicZh": "正態分佈",
    "topicEn": "Normal Distribution",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "某校測驗成績服從正態分佈，平均分 $120$，標準差 $20$。小明考獲 $140$ 分。\n\n他的成績高於平均分多少個標準差？",
    "explanation": "標準分數量度的是「距離平均值有多少個標準差」：$z = \\dfrac{x - \\mu}{\\sigma} = \\dfrac{140 - 120}{20} = 1$。先減平均值得出差距，再除以標準差，把差距換算成標準差的數目。",
    "options": [
      "$1$ 個標準差",
      "$20$ 個標準差",
      "$6$ 個標準差",
      "$7$ 個標準差"
    ],
    "correctIndex": 0,
    "marks": 1,
    "contentEn": "Test scores at a school are normally distributed with mean $120$ and standard deviation $20$. Ming scored $140$.\n\nHow many standard deviations above the mean is his score?",
    "optionsEn": [
      "$1$ standard deviations",
      "$20$ standard deviations",
      "$6$ standard deviations",
      "$7$ standard deviations"
    ],
    "explanationEn": "A standard score measures how many standard deviations a value is from the mean: $z = \\dfrac{x - \\mu}{\\sigma} = \\dfrac{140 - 120}{20} = 1$. Subtract the mean to get the gap, then divide by the standard deviation to count it in standard deviations.",
    "frameworkEn": "Auto-gated",
    "optionNotes": [
      {
        "optionId": 0,
        "zh": "正確。$\\dfrac{140 - 120}{20} = 1$。",
        "en": "Correct. $\\dfrac{140 - 120}{20} = 1$."
      },
      {
        "optionId": 1,
        "zh": "$140 - 120 = 20$ 是分數的差距，單位仍然是「分」；還要除以標準差 $20$。",
        "en": "$140 - 120 = 20$ is the gap in marks; it still has to be divided by the standard deviation $20$."
      },
      {
        "optionId": 2,
        "zh": "$\\dfrac{120}{20}$：這是平均分除以標準差，與小明的分數無關。",
        "en": "$\\dfrac{120}{20}$ is the mean divided by the standard deviation; it has nothing to do with the student's score."
      },
      {
        "optionId": 3,
        "zh": "$\\dfrac{140}{20}$：直接把分數除以標準差，漏了先減去平均分 $120$。",
        "en": "$\\dfrac{140}{20}$ divides the score by the standard deviation without first subtracting the mean $120$."
      }
    ]
  },
  {
    "id": "m1_rep_0050",
    "type": "mc",
    "subject": "m1",
    "topic": "normal_distribution",
    "topicZh": "正態分佈",
    "topicEn": "Normal Distribution",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "某校測驗成績服從正態分佈，平均分 $45$，標準差 $4$。小明考獲 $57$ 分。\n\n他的成績高於平均分多少個標準差？",
    "explanation": "標準分數量度的是「距離平均值有多少個標準差」：$z = \\dfrac{x - \\mu}{\\sigma} = \\dfrac{57 - 45}{4} = 3$。先減平均值得出差距，再除以標準差，把差距換算成標準差的數目。",
    "options": [
      "$14.25$ 個標準差",
      "$3$ 個標準差",
      "$12$ 個標準差",
      "$11.25$ 個標準差"
    ],
    "correctIndex": 1,
    "marks": 1,
    "contentEn": "Test scores at a school are normally distributed with mean $45$ and standard deviation $4$. Ming scored $57$.\n\nHow many standard deviations above the mean is his score?",
    "optionsEn": [
      "$14.25$ standard deviations",
      "$3$ standard deviations",
      "$12$ standard deviations",
      "$11.25$ standard deviations"
    ],
    "explanationEn": "A standard score measures how many standard deviations a value is from the mean: $z = \\dfrac{x - \\mu}{\\sigma} = \\dfrac{57 - 45}{4} = 3$. Subtract the mean to get the gap, then divide by the standard deviation to count it in standard deviations.",
    "frameworkEn": "Auto-gated",
    "optionNotes": [
      {
        "optionId": 0,
        "zh": "$\\dfrac{57}{4}$：直接把分數除以標準差，漏了先減去平均分 $45$。",
        "en": "$\\dfrac{57}{4}$ divides the score by the standard deviation without first subtracting the mean $45$."
      },
      {
        "optionId": 1,
        "zh": "正確。$\\dfrac{57 - 45}{4} = 3$。",
        "en": "Correct. $\\dfrac{57 - 45}{4} = 3$."
      },
      {
        "optionId": 2,
        "zh": "$57 - 45 = 12$ 是分數的差距，單位仍然是「分」；還要除以標準差 $4$。",
        "en": "$57 - 45 = 12$ is the gap in marks; it still has to be divided by the standard deviation $4$."
      },
      {
        "optionId": 3,
        "zh": "$\\dfrac{45}{4}$：這是平均分除以標準差，與小明的分數無關。",
        "en": "$\\dfrac{45}{4}$ is the mean divided by the standard deviation; it has nothing to do with the student's score."
      }
    ]
  },
  {
    "id": "m1_rep_0051",
    "type": "mc",
    "subject": "m1",
    "topic": "normal_distribution",
    "topicZh": "正態分佈",
    "topicEn": "Normal Distribution",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "某產品的重量服從正態分佈，平均 $70$ 克，標準差 $10$ 克。\n\n根據正態分佈的經驗法則，重量介乎 $60$ 克與 $80$ 克之間的產品約佔多少？",
    "explanation": "先看題目給的範圍距離平均值多遠：$80 - 70 = 10$，而 $10 \\div 10 = 1$，即上下各 $1$ 個標準差。經驗法則：$\\pm1\\sigma$ 涵蓋約 68%、$\\pm2\\sigma$ 約 95%、$\\pm3\\sigma$ 約 99.7%，故答案為約 68%。做這類題目要【先換算成標準差個數】才對照法則，直接看克數毫無意義。答「約 50%」的把「平均值兩邊」理解成「一半」—— 對稱確實令兩邊各佔一半，但題目問的是這個區間之內的比例，不是其中一邊。",
    "options": [
      "約 99.7%",
      "約 50%",
      "約 68%",
      "約 95%"
    ],
    "correctIndex": 2,
    "marks": 1,
    "contentEn": "The weight of a product is normally distributed with mean $70$ g and standard deviation $10$ g.\n\nBy the empirical rule, roughly what proportion of products weigh between $60$ g and $80$ g?",
    "optionsEn": [
      "About 99.7%",
      "About 50%",
      "About 68%",
      "About 95%"
    ],
    "explanationEn": "First measure how far the stated range reaches from the mean: $80 - 70 = 10$, and $10 \\div 10 = 1$, so the range spans $1$ standard deviations either side. The empirical rule gives about 68% within $\\pm1\\sigma$, about 95% within $\\pm2\\sigma$ and about 99.7% within $\\pm3\\sigma$, so the answer is about 68%. Always convert to a number of standard deviations before applying the rule; the raw grams mean nothing on their own. Answering \"about 50%\" reads \"either side of the mean\" as \"half\" — symmetry does split the distribution in half, but the question asks for the proportion *inside* the interval, not on one side of it.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "m1_rep_0052",
    "type": "mc",
    "subject": "m1",
    "topic": "normal_distribution",
    "topicZh": "正態分佈",
    "topicEn": "Normal Distribution",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "某產品的重量服從正態分佈，平均 $500$ 克，標準差 $100$ 克。\n\n根據正態分佈的經驗法則，重量介乎 $300$ 克與 $700$ 克之間的產品約佔多少？",
    "explanation": "先看題目給的範圍距離平均值多遠：$700 - 500 = 200$，而 $200 \\div 100 = 2$，即上下各 $2$ 個標準差。經驗法則：$\\pm1\\sigma$ 涵蓋約 68%、$\\pm2\\sigma$ 約 95%、$\\pm3\\sigma$ 約 99.7%，故答案為約 95%。做這類題目要【先換算成標準差個數】才對照法則，直接看克數毫無意義。答「約 50%」的把「平均值兩邊」理解成「一半」—— 對稱確實令兩邊各佔一半，但題目問的是這個區間之內的比例，不是其中一邊。",
    "options": [
      "約 68%",
      "約 99.7%",
      "約 50%",
      "約 95%"
    ],
    "correctIndex": 3,
    "marks": 1,
    "contentEn": "The weight of a product is normally distributed with mean $500$ g and standard deviation $100$ g.\n\nBy the empirical rule, roughly what proportion of products weigh between $300$ g and $700$ g?",
    "optionsEn": [
      "About 68%",
      "About 99.7%",
      "About 50%",
      "About 95%"
    ],
    "explanationEn": "First measure how far the stated range reaches from the mean: $700 - 500 = 200$, and $200 \\div 100 = 2$, so the range spans $2$ standard deviations either side. The empirical rule gives about 68% within $\\pm1\\sigma$, about 95% within $\\pm2\\sigma$ and about 99.7% within $\\pm3\\sigma$, so the answer is about 95%. Always convert to a number of standard deviations before applying the rule; the raw grams mean nothing on their own. Answering \"about 50%\" reads \"either side of the mean\" as \"half\" — symmetry does split the distribution in half, but the question asks for the proportion *inside* the interval, not on one side of it.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "m1_rep_0053",
    "type": "mc",
    "subject": "m1",
    "topic": "normal_distribution",
    "topicZh": "正態分佈",
    "topicEn": "Normal Distribution",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "某產品的重量服從正態分佈，平均 $160$ 克，標準差 $5$ 克。\n\n根據正態分佈的經驗法則，重量介乎 $155$ 克與 $165$ 克之間的產品約佔多少？",
    "explanation": "先看題目給的範圍距離平均值多遠：$165 - 160 = 5$，而 $5 \\div 5 = 1$，即上下各 $1$ 個標準差。經驗法則：$\\pm1\\sigma$ 涵蓋約 68%、$\\pm2\\sigma$ 約 95%、$\\pm3\\sigma$ 約 99.7%，故答案為約 68%。做這類題目要【先換算成標準差個數】才對照法則，直接看克數毫無意義。答「約 50%」的把「平均值兩邊」理解成「一半」—— 對稱確實令兩邊各佔一半，但題目問的是這個區間之內的比例，不是其中一邊。",
    "options": [
      "約 68%",
      "約 95%",
      "約 99.7%",
      "約 50%"
    ],
    "correctIndex": 0,
    "marks": 1,
    "contentEn": "The weight of a product is normally distributed with mean $160$ g and standard deviation $5$ g.\n\nBy the empirical rule, roughly what proportion of products weigh between $155$ g and $165$ g?",
    "optionsEn": [
      "About 68%",
      "About 95%",
      "About 99.7%",
      "About 50%"
    ],
    "explanationEn": "First measure how far the stated range reaches from the mean: $165 - 160 = 5$, and $5 \\div 5 = 1$, so the range spans $1$ standard deviations either side. The empirical rule gives about 68% within $\\pm1\\sigma$, about 95% within $\\pm2\\sigma$ and about 99.7% within $\\pm3\\sigma$, so the answer is about 68%. Always convert to a number of standard deviations before applying the rule; the raw grams mean nothing on their own. Answering \"about 50%\" reads \"either side of the mean\" as \"half\" — symmetry does split the distribution in half, but the question asks for the proportion *inside* the interval, not on one side of it.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "m1_rep_0054",
    "type": "mc",
    "subject": "m1",
    "topic": "normal_distribution",
    "topicZh": "正態分佈",
    "topicEn": "Normal Distribution",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "某產品的重量服從正態分佈，平均 $82$ 克，標準差 $6$ 克。\n\n根據正態分佈的經驗法則，重量介乎 $70$ 克與 $94$ 克之間的產品約佔多少？",
    "explanation": "先看題目給的範圍距離平均值多遠：$94 - 82 = 12$，而 $12 \\div 6 = 2$，即上下各 $2$ 個標準差。經驗法則：$\\pm1\\sigma$ 涵蓋約 68%、$\\pm2\\sigma$ 約 95%、$\\pm3\\sigma$ 約 99.7%，故答案為約 95%。做這類題目要【先換算成標準差個數】才對照法則，直接看克數毫無意義。答「約 50%」的把「平均值兩邊」理解成「一半」—— 對稱確實令兩邊各佔一半，但題目問的是這個區間之內的比例，不是其中一邊。",
    "options": [
      "約 50%",
      "約 95%",
      "約 68%",
      "約 99.7%"
    ],
    "correctIndex": 1,
    "marks": 1,
    "contentEn": "The weight of a product is normally distributed with mean $82$ g and standard deviation $6$ g.\n\nBy the empirical rule, roughly what proportion of products weigh between $70$ g and $94$ g?",
    "optionsEn": [
      "About 50%",
      "About 95%",
      "About 68%",
      "About 99.7%"
    ],
    "explanationEn": "First measure how far the stated range reaches from the mean: $94 - 82 = 12$, and $12 \\div 6 = 2$, so the range spans $2$ standard deviations either side. The empirical rule gives about 68% within $\\pm1\\sigma$, about 95% within $\\pm2\\sigma$ and about 99.7% within $\\pm3\\sigma$, so the answer is about 95%. Always convert to a number of standard deviations before applying the rule; the raw grams mean nothing on their own. Answering \"about 50%\" reads \"either side of the mean\" as \"half\" — symmetry does split the distribution in half, but the question asks for the proportion *inside* the interval, not on one side of it.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "m1_rep_0055",
    "type": "mc",
    "subject": "m1",
    "topic": "normal_distribution",
    "topicZh": "正態分佈",
    "topicEn": "Normal Distribution",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "某產品的重量服從正態分佈，平均 $250$ 克，標準差 $25$ 克。\n\n根據正態分佈的經驗法則，重量介乎 $175$ 克與 $325$ 克之間的產品約佔多少？",
    "explanation": "先看題目給的範圍距離平均值多遠：$325 - 250 = 75$，而 $75 \\div 25 = 3$，即上下各 $3$ 個標準差。經驗法則：$\\pm1\\sigma$ 涵蓋約 68%、$\\pm2\\sigma$ 約 95%、$\\pm3\\sigma$ 約 99.7%，故答案為約 99.7%。做這類題目要【先換算成標準差個數】才對照法則，直接看克數毫無意義。答「約 50%」的把「平均值兩邊」理解成「一半」—— 對稱確實令兩邊各佔一半，但題目問的是這個區間之內的比例，不是其中一邊。",
    "options": [
      "約 68%",
      "約 50%",
      "約 99.7%",
      "約 95%"
    ],
    "correctIndex": 2,
    "marks": 1,
    "contentEn": "The weight of a product is normally distributed with mean $250$ g and standard deviation $25$ g.\n\nBy the empirical rule, roughly what proportion of products weigh between $175$ g and $325$ g?",
    "optionsEn": [
      "About 68%",
      "About 50%",
      "About 99.7%",
      "About 95%"
    ],
    "explanationEn": "First measure how far the stated range reaches from the mean: $325 - 250 = 75$, and $75 \\div 25 = 3$, so the range spans $3$ standard deviations either side. The empirical rule gives about 68% within $\\pm1\\sigma$, about 95% within $\\pm2\\sigma$ and about 99.7% within $\\pm3\\sigma$, so the answer is about 99.7%. Always convert to a number of standard deviations before applying the rule; the raw grams mean nothing on their own. Answering \"about 50%\" reads \"either side of the mean\" as \"half\" — symmetry does split the distribution in half, but the question asks for the proportion *inside* the interval, not on one side of it.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "m1_rep_0056",
    "type": "mc",
    "subject": "m1",
    "topic": "normal_distribution",
    "topicZh": "正態分佈",
    "topicEn": "Normal Distribution",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "某產品的重量服從正態分佈，平均 $36$ 克，標準差 $3$ 克。\n\n根據正態分佈的經驗法則，重量介乎 $33$ 克與 $39$ 克之間的產品約佔多少？",
    "explanation": "先看題目給的範圍距離平均值多遠：$39 - 36 = 3$，而 $3 \\div 3 = 1$，即上下各 $1$ 個標準差。經驗法則：$\\pm1\\sigma$ 涵蓋約 68%、$\\pm2\\sigma$ 約 95%、$\\pm3\\sigma$ 約 99.7%，故答案為約 68%。做這類題目要【先換算成標準差個數】才對照法則，直接看克數毫無意義。答「約 50%」的把「平均值兩邊」理解成「一半」—— 對稱確實令兩邊各佔一半，但題目問的是這個區間之內的比例，不是其中一邊。",
    "options": [
      "約 95%",
      "約 99.7%",
      "約 50%",
      "約 68%"
    ],
    "correctIndex": 3,
    "marks": 1,
    "contentEn": "The weight of a product is normally distributed with mean $36$ g and standard deviation $3$ g.\n\nBy the empirical rule, roughly what proportion of products weigh between $33$ g and $39$ g?",
    "optionsEn": [
      "About 95%",
      "About 99.7%",
      "About 50%",
      "About 68%"
    ],
    "explanationEn": "First measure how far the stated range reaches from the mean: $39 - 36 = 3$, and $3 \\div 3 = 1$, so the range spans $1$ standard deviations either side. The empirical rule gives about 68% within $\\pm1\\sigma$, about 95% within $\\pm2\\sigma$ and about 99.7% within $\\pm3\\sigma$, so the answer is about 68%. Always convert to a number of standard deviations before applying the rule; the raw grams mean nothing on their own. Answering \"about 50%\" reads \"either side of the mean\" as \"half\" — symmetry does split the distribution in half, but the question asks for the proportion *inside* the interval, not on one side of it.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "m1_rep_0057",
    "type": "mc",
    "subject": "m1",
    "topic": "normal_distribution",
    "topicZh": "正態分佈",
    "topicEn": "Normal Distribution",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "medium",
    "year": 0,
    "content": "設 $X \\sim N(60, 8^{2})$。已知某觀測值的標準分數為 $z = 1.5$，求該觀測值 $x$。",
    "explanation": "把 $z = \\dfrac{x - \\mu}{\\sigma}$ 倒轉即得 $x = \\mu + z\\sigma = 60 + (1.5)(8) = 72$。注意 $z$ 為正，代表該觀測值【高於】平均值，所以答案必定大過 $60$。第一個干擾項把加號寫成減號，方向剛好相反。第二項只算了 $z\\sigma$，即偏離平均值的距離，忘記加回平均值本身。第三項把 $z$ 直接加上平均值，漏了乘標準差 —— $z$ 是「幾多個標準差」，要先乘返標準差才是實際數值。",
    "options": [
      "$72$",
      "$48$",
      "$12$",
      "$61.5$"
    ],
    "correctIndex": 0,
    "marks": 1,
    "contentEn": "Let $X \\sim N(60, 8^{2})$. An observation has standard score $z = 1.5$. Find $x$.",
    "optionsEn": [
      "$72$",
      "$48$",
      "$12$",
      "$61.5$"
    ],
    "explanationEn": "Rearranging $z = \\dfrac{x - \\mu}{\\sigma}$ gives $x = \\mu + z\\sigma = 60 + (1.5)(8) = 72$. Since $z$ is positive the observation lies *above* the mean, so the answer must exceed $60$. The first distractor subtracts where it should add, reversing the direction. The second computes only $z\\sigma$, the distance from the mean, and forgets to add the mean back. The third adds $z$ directly to the mean without multiplying by the standard deviation — $z$ counts standard deviations, so it must be scaled before it becomes a real value.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "m1_rep_0058",
    "type": "mc",
    "subject": "m1",
    "topic": "normal_distribution",
    "topicZh": "正態分佈",
    "topicEn": "Normal Distribution",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "medium",
    "year": 0,
    "content": "設 $X \\sim N(100, 15^{2})$。已知某觀測值的標準分數為 $z = -2$，求該觀測值 $x$。",
    "explanation": "把 $z = \\dfrac{x - \\mu}{\\sigma}$ 倒轉即得 $x = \\mu + z\\sigma = 100 + (-2)(15) = 70$。注意 $z$ 為負，代表該觀測值【低於】平均值，所以答案必定細過 $100$ —— 見到大過平均值的答案就應該起疑。第一個干擾項把加號寫成減號，方向剛好相反。第二項只算了 $z\\sigma$，即偏離平均值的距離，忘記加回平均值本身。第三項把 $z$ 直接加上平均值，漏了乘標準差 —— $z$ 是「幾多個標準差」，要先乘返標準差才是實際數值。",
    "options": [
      "$98$",
      "$70$",
      "$130$",
      "$-30$"
    ],
    "correctIndex": 1,
    "marks": 1,
    "contentEn": "Let $X \\sim N(100, 15^{2})$. An observation has standard score $z = -2$. Find $x$.",
    "optionsEn": [
      "$98$",
      "$70$",
      "$130$",
      "$-30$"
    ],
    "explanationEn": "Rearranging $z = \\dfrac{x - \\mu}{\\sigma}$ gives $x = \\mu + z\\sigma = 100 + (-2)(15) = 70$. Since $z$ is negative the observation lies *below* the mean, so the answer must be smaller than $100$ — an answer above the mean should raise suspicion. The first distractor subtracts where it should add, reversing the direction. The second computes only $z\\sigma$, the distance from the mean, and forgets to add the mean back. The third adds $z$ directly to the mean without multiplying by the standard deviation — $z$ counts standard deviations, so it must be scaled before it becomes a real value.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "m1_rep_0059",
    "type": "mc",
    "subject": "m1",
    "topic": "normal_distribution",
    "topicZh": "正態分佈",
    "topicEn": "Normal Distribution",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "medium",
    "year": 0,
    "content": "設 $X \\sim N(50, 5^{2})$。已知某觀測值的標準分數為 $z = 2.4$，求該觀測值 $x$。",
    "explanation": "把 $z = \\dfrac{x - \\mu}{\\sigma}$ 倒轉即得 $x = \\mu + z\\sigma = 50 + (2.4)(5) = 62$。注意 $z$ 為正，代表該觀測值【高於】平均值，所以答案必定大過 $50$。第一個干擾項把加號寫成減號，方向剛好相反。第二項只算了 $z\\sigma$，即偏離平均值的距離，忘記加回平均值本身。第三項把 $z$ 直接加上平均值，漏了乘標準差 —— $z$ 是「幾多個標準差」，要先乘返標準差才是實際數值。",
    "options": [
      "$12$",
      "$52.4$",
      "$62$",
      "$38$"
    ],
    "correctIndex": 2,
    "marks": 1,
    "contentEn": "Let $X \\sim N(50, 5^{2})$. An observation has standard score $z = 2.4$. Find $x$.",
    "optionsEn": [
      "$12$",
      "$52.4$",
      "$62$",
      "$38$"
    ],
    "explanationEn": "Rearranging $z = \\dfrac{x - \\mu}{\\sigma}$ gives $x = \\mu + z\\sigma = 50 + (2.4)(5) = 62$. Since $z$ is positive the observation lies *above* the mean, so the answer must exceed $50$. The first distractor subtracts where it should add, reversing the direction. The second computes only $z\\sigma$, the distance from the mean, and forgets to add the mean back. The third adds $z$ directly to the mean without multiplying by the standard deviation — $z$ counts standard deviations, so it must be scaled before it becomes a real value.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "m1_rep_0060",
    "type": "mc",
    "subject": "m1",
    "topic": "normal_distribution",
    "topicZh": "正態分佈",
    "topicEn": "Normal Distribution",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "medium",
    "year": 0,
    "content": "設 $X \\sim N(72, 6^{2})$。已知某觀測值的標準分數為 $z = -1.5$，求該觀測值 $x$。",
    "explanation": "把 $z = \\dfrac{x - \\mu}{\\sigma}$ 倒轉即得 $x = \\mu + z\\sigma = 72 + (-1.5)(6) = 63$。注意 $z$ 為負，代表該觀測值【低於】平均值，所以答案必定細過 $72$ —— 見到大過平均值的答案就應該起疑。第一個干擾項把加號寫成減號，方向剛好相反。第二項只算了 $z\\sigma$，即偏離平均值的距離，忘記加回平均值本身。第三項把 $z$ 直接加上平均值，漏了乘標準差 —— $z$ 是「幾多個標準差」，要先乘返標準差才是實際數值。",
    "options": [
      "$81$",
      "$-9$",
      "$70.5$",
      "$63$"
    ],
    "correctIndex": 3,
    "marks": 1,
    "contentEn": "Let $X \\sim N(72, 6^{2})$. An observation has standard score $z = -1.5$. Find $x$.",
    "optionsEn": [
      "$81$",
      "$-9$",
      "$70.5$",
      "$63$"
    ],
    "explanationEn": "Rearranging $z = \\dfrac{x - \\mu}{\\sigma}$ gives $x = \\mu + z\\sigma = 72 + (-1.5)(6) = 63$. Since $z$ is negative the observation lies *below* the mean, so the answer must be smaller than $72$ — an answer above the mean should raise suspicion. The first distractor subtracts where it should add, reversing the direction. The second computes only $z\\sigma$, the distance from the mean, and forgets to add the mean back. The third adds $z$ directly to the mean without multiplying by the standard deviation — $z$ counts standard deviations, so it must be scaled before it becomes a real value.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "m1_rep_0061",
    "type": "mc",
    "subject": "m1",
    "topic": "normal_distribution",
    "topicZh": "正態分佈",
    "topicEn": "Normal Distribution",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "medium",
    "year": 0,
    "content": "設 $X \\sim N(200, 25^{2})$。已知某觀測值的標準分數為 $z = 1.2$，求該觀測值 $x$。",
    "explanation": "把 $z = \\dfrac{x - \\mu}{\\sigma}$ 倒轉即得 $x = \\mu + z\\sigma = 200 + (1.2)(25) = 230$。注意 $z$ 為正，代表該觀測值【高於】平均值，所以答案必定大過 $200$。第一個干擾項把加號寫成減號，方向剛好相反。第二項只算了 $z\\sigma$，即偏離平均值的距離，忘記加回平均值本身。第三項把 $z$ 直接加上平均值，漏了乘標準差 —— $z$ 是「幾多個標準差」，要先乘返標準差才是實際數值。",
    "options": [
      "$230$",
      "$170$",
      "$30$",
      "$201.2$"
    ],
    "correctIndex": 0,
    "marks": 1,
    "contentEn": "Let $X \\sim N(200, 25^{2})$. An observation has standard score $z = 1.2$. Find $x$.",
    "optionsEn": [
      "$230$",
      "$170$",
      "$30$",
      "$201.2$"
    ],
    "explanationEn": "Rearranging $z = \\dfrac{x - \\mu}{\\sigma}$ gives $x = \\mu + z\\sigma = 200 + (1.2)(25) = 230$. Since $z$ is positive the observation lies *above* the mean, so the answer must exceed $200$. The first distractor subtracts where it should add, reversing the direction. The second computes only $z\\sigma$, the distance from the mean, and forgets to add the mean back. The third adds $z$ directly to the mean without multiplying by the standard deviation — $z$ counts standard deviations, so it must be scaled before it becomes a real value.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "m1_rep_0062",
    "type": "mc",
    "subject": "m1",
    "topic": "normal_distribution",
    "topicZh": "正態分佈",
    "topicEn": "Normal Distribution",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "medium",
    "year": 0,
    "content": "設 $X \\sim N(88, 4^{2})$。已知某觀測值的標準分數為 $z = -0.5$，求該觀測值 $x$。",
    "explanation": "把 $z = \\dfrac{x - \\mu}{\\sigma}$ 倒轉即得 $x = \\mu + z\\sigma = 88 + (-0.5)(4) = 86$。注意 $z$ 為負，代表該觀測值【低於】平均值，所以答案必定細過 $88$ —— 見到大過平均值的答案就應該起疑。第一個干擾項把加號寫成減號，方向剛好相反。第二項只算了 $z\\sigma$，即偏離平均值的距離，忘記加回平均值本身。第三項把 $z$ 直接加上平均值，漏了乘標準差 —— $z$ 是「幾多個標準差」，要先乘返標準差才是實際數值。",
    "options": [
      "$87.5$",
      "$86$",
      "$90$",
      "$-2$"
    ],
    "correctIndex": 1,
    "marks": 1,
    "contentEn": "Let $X \\sim N(88, 4^{2})$. An observation has standard score $z = -0.5$. Find $x$.",
    "optionsEn": [
      "$87.5$",
      "$86$",
      "$90$",
      "$-2$"
    ],
    "explanationEn": "Rearranging $z = \\dfrac{x - \\mu}{\\sigma}$ gives $x = \\mu + z\\sigma = 88 + (-0.5)(4) = 86$. Since $z$ is negative the observation lies *below* the mean, so the answer must be smaller than $88$ — an answer above the mean should raise suspicion. The first distractor subtracts where it should add, reversing the direction. The second computes only $z\\sigma$, the distance from the mean, and forgets to add the mean back. The third adds $z$ directly to the mean without multiplying by the standard deviation — $z$ counts standard deviations, so it must be scaled before it becomes a real value.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "m1_rep_0063",
    "type": "mc",
    "subject": "m1",
    "topic": "normal_distribution",
    "topicZh": "正態分佈",
    "topicEn": "Normal Distribution",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "medium",
    "year": 0,
    "content": "某生應考兩份試卷。甲卷平均分 $70$、標準差 $5$，他得 $80$ 分；乙卷平均分 $60$、標準差 $10$，他得 $75$ 分。兩卷成績均服從正態分佈。\n\n就相對表現而言，他在哪一卷表現較佳？",
    "explanation": "兩份卷的平均分與標準差都不相同，原始分數【不可直接比較】—— 這正是標準分數存在的理由。甲卷 $z = \\dfrac{80 - 70}{5} = 2$；乙卷 $z = \\dfrac{75 - 60}{10} = 1.5$。甲卷的 $z$ 較高，故相對表現較佳。用原始分數比較是本題設下的主要陷阱：一份卷考 $80$ 分，另一份考 $75$ 分，數字大小與「表現好壞」並無必然關係，要看在各自的分佈中站在甚麼位置。最後一項只確認了兩卷都高於平均，但「都高於平均」並不代表「高得一樣多」。",
    "options": [
      "甲卷，因為原始分數較高",
      "兩卷表現相同，因為兩者都高於各自的平均分",
      "甲卷，因為其標準分數較高（甲 $z = 2$，乙 $z = 1.5$）",
      "乙卷，因為其標準分數較高"
    ],
    "correctIndex": 2,
    "marks": 1,
    "contentEn": "A student sits two papers. Paper A has mean $70$ and standard deviation $5$; he scored $80$. Paper B has mean $60$ and standard deviation $10$; he scored $75$. Both are normally distributed.\n\nIn relative terms, on which paper did he do better?",
    "optionsEn": [
      "Paper A, because the raw mark is higher",
      "Equally well, since both marks are above their respective means",
      "Paper A, because its standard score is higher (A: $z = 2$, B: $z = 1.5$)",
      "Paper B, because its standard score is higher"
    ],
    "explanationEn": "The two papers have different means and standard deviations, so the raw marks *cannot* be compared directly — which is precisely why standard scores exist. Paper A gives $z = \\dfrac{80 - 70}{5} = 2$ and Paper B gives $z = \\dfrac{75 - 60}{10} = 1.5$. The higher $z$ belongs to Paper A, so that is the better relative performance. Comparing raw marks is the main trap: scoring $80$ on one paper and $75$ on another says nothing on its own — what matters is where each mark sits within its own distribution. The last option notes only that both are above average, which does not mean both are above it by the same amount.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "m1_rep_0064",
    "type": "mc",
    "subject": "m1",
    "topic": "normal_distribution",
    "topicZh": "正態分佈",
    "topicEn": "Normal Distribution",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "medium",
    "year": 0,
    "content": "某生應考兩份試卷。甲卷平均分 $50$、標準差 $4$，他得 $58$ 分；乙卷平均分 $100$、標準差 $20$，他得 $130$ 分。兩卷成績均服從正態分佈。\n\n就相對表現而言，他在哪一卷表現較佳？",
    "explanation": "兩份卷的平均分與標準差都不相同，原始分數【不可直接比較】—— 這正是標準分數存在的理由。甲卷 $z = \\dfrac{58 - 50}{4} = 2$；乙卷 $z = \\dfrac{130 - 100}{20} = 1.5$。甲卷的 $z$ 較高，故相對表現較佳。用原始分數比較是本題設下的主要陷阱：一份卷考 $58$ 分，另一份考 $130$ 分，數字大小與「表現好壞」並無必然關係，要看在各自的分佈中站在甚麼位置。最後一項只確認了兩卷都高於平均，但「都高於平均」並不代表「高得一樣多」。",
    "options": [
      "乙卷，因為其標準分數較高",
      "乙卷，因為原始分數較高",
      "兩卷表現相同，因為兩者都高於各自的平均分",
      "甲卷，因為其標準分數較高（甲 $z = 2$，乙 $z = 1.5$）"
    ],
    "correctIndex": 3,
    "marks": 1,
    "contentEn": "A student sits two papers. Paper A has mean $50$ and standard deviation $4$; he scored $58$. Paper B has mean $100$ and standard deviation $20$; he scored $130$. Both are normally distributed.\n\nIn relative terms, on which paper did he do better?",
    "optionsEn": [
      "Paper B, because its standard score is higher",
      "Paper B, because the raw mark is higher",
      "Equally well, since both marks are above their respective means",
      "Paper A, because its standard score is higher (A: $z = 2$, B: $z = 1.5$)"
    ],
    "explanationEn": "The two papers have different means and standard deviations, so the raw marks *cannot* be compared directly — which is precisely why standard scores exist. Paper A gives $z = \\dfrac{58 - 50}{4} = 2$ and Paper B gives $z = \\dfrac{130 - 100}{20} = 1.5$. The higher $z$ belongs to Paper A, so that is the better relative performance. Comparing raw marks is the main trap: scoring $58$ on one paper and $130$ on another says nothing on its own — what matters is where each mark sits within its own distribution. The last option notes only that both are above average, which does not mean both are above it by the same amount.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "m1_rep_0065",
    "type": "mc",
    "subject": "m1",
    "topic": "normal_distribution",
    "topicZh": "正態分佈",
    "topicEn": "Normal Distribution",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "medium",
    "year": 0,
    "content": "某生應考兩份試卷。甲卷平均分 $120$、標準差 $15$，他得 $150$ 分；乙卷平均分 $80$、標準差 $6$，他得 $89$ 分。兩卷成績均服從正態分佈。\n\n就相對表現而言，他在哪一卷表現較佳？",
    "explanation": "兩份卷的平均分與標準差都不相同，原始分數【不可直接比較】—— 這正是標準分數存在的理由。甲卷 $z = \\dfrac{150 - 120}{15} = 2$；乙卷 $z = \\dfrac{89 - 80}{6} = 1.5$。甲卷的 $z$ 較高，故相對表現較佳。用原始分數比較是本題設下的主要陷阱：一份卷考 $150$ 分，另一份考 $89$ 分，數字大小與「表現好壞」並無必然關係，要看在各自的分佈中站在甚麼位置。最後一項只確認了兩卷都高於平均，但「都高於平均」並不代表「高得一樣多」。",
    "options": [
      "甲卷，因為其標準分數較高（甲 $z = 2$，乙 $z = 1.5$）",
      "乙卷，因為其標準分數較高",
      "甲卷，因為原始分數較高",
      "兩卷表現相同，因為兩者都高於各自的平均分"
    ],
    "correctIndex": 0,
    "marks": 1,
    "contentEn": "A student sits two papers. Paper A has mean $120$ and standard deviation $15$; he scored $150$. Paper B has mean $80$ and standard deviation $6$; he scored $89$. Both are normally distributed.\n\nIn relative terms, on which paper did he do better?",
    "optionsEn": [
      "Paper A, because its standard score is higher (A: $z = 2$, B: $z = 1.5$)",
      "Paper B, because its standard score is higher",
      "Paper A, because the raw mark is higher",
      "Equally well, since both marks are above their respective means"
    ],
    "explanationEn": "The two papers have different means and standard deviations, so the raw marks *cannot* be compared directly — which is precisely why standard scores exist. Paper A gives $z = \\dfrac{150 - 120}{15} = 2$ and Paper B gives $z = \\dfrac{89 - 80}{6} = 1.5$. The higher $z$ belongs to Paper A, so that is the better relative performance. Comparing raw marks is the main trap: scoring $150$ on one paper and $89$ on another says nothing on its own — what matters is where each mark sits within its own distribution. The last option notes only that both are above average, which does not mean both are above it by the same amount.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "m1_rep_0066",
    "type": "mc",
    "subject": "m1",
    "topic": "normal_distribution",
    "topicZh": "正態分佈",
    "topicEn": "Normal Distribution",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "medium",
    "year": 0,
    "content": "某生應考兩份試卷。甲卷平均分 $65$、標準差 $10$，他得 $85$ 分；乙卷平均分 $40$、標準差 $5$，他得 $48$ 分。兩卷成績均服從正態分佈。\n\n就相對表現而言，他在哪一卷表現較佳？",
    "explanation": "兩份卷的平均分與標準差都不相同，原始分數【不可直接比較】—— 這正是標準分數存在的理由。甲卷 $z = \\dfrac{85 - 65}{10} = 2$；乙卷 $z = \\dfrac{48 - 40}{5} = 1.6$。甲卷的 $z$ 較高，故相對表現較佳。用原始分數比較是本題設下的主要陷阱：一份卷考 $85$ 分，另一份考 $48$ 分，數字大小與「表現好壞」並無必然關係，要看在各自的分佈中站在甚麼位置。最後一項只確認了兩卷都高於平均，但「都高於平均」並不代表「高得一樣多」。",
    "options": [
      "兩卷表現相同，因為兩者都高於各自的平均分",
      "甲卷，因為其標準分數較高（甲 $z = 2$，乙 $z = 1.6$）",
      "乙卷，因為其標準分數較高",
      "甲卷，因為原始分數較高"
    ],
    "correctIndex": 1,
    "marks": 1,
    "contentEn": "A student sits two papers. Paper A has mean $65$ and standard deviation $10$; he scored $85$. Paper B has mean $40$ and standard deviation $5$; he scored $48$. Both are normally distributed.\n\nIn relative terms, on which paper did he do better?",
    "optionsEn": [
      "Equally well, since both marks are above their respective means",
      "Paper A, because its standard score is higher (A: $z = 2$, B: $z = 1.6$)",
      "Paper B, because its standard score is higher",
      "Paper A, because the raw mark is higher"
    ],
    "explanationEn": "The two papers have different means and standard deviations, so the raw marks *cannot* be compared directly — which is precisely why standard scores exist. Paper A gives $z = \\dfrac{85 - 65}{10} = 2$ and Paper B gives $z = \\dfrac{48 - 40}{5} = 1.6$. The higher $z$ belongs to Paper A, so that is the better relative performance. Comparing raw marks is the main trap: scoring $85$ on one paper and $48$ on another says nothing on its own — what matters is where each mark sits within its own distribution. The last option notes only that both are above average, which does not mean both are above it by the same amount.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "m1_rep_0067",
    "type": "mc",
    "subject": "m1",
    "topic": "normal_distribution",
    "topicZh": "正態分佈",
    "topicEn": "Normal Distribution",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "medium",
    "year": 0,
    "content": "某生應考兩份試卷。甲卷平均分 $200$、標準差 $25$，他得 $250$ 分；乙卷平均分 $30$、標準差 $3$，他得 $36$ 分。兩卷成績均服從正態分佈。\n\n就相對表現而言，他在哪一卷表現較佳？",
    "explanation": "兩份卷的平均分與標準差都不相同，原始分數【不可直接比較】—— 這正是標準分數存在的理由。甲卷 $z = \\dfrac{250 - 200}{25} = 2$；乙卷 $z = \\dfrac{36 - 30}{3} = 2$。乙卷的 $z$ 較高，故相對表現較佳。用原始分數比較是本題設下的主要陷阱：一份卷考 $250$ 分，另一份考 $36$ 分，數字大小與「表現好壞」並無必然關係，要看在各自的分佈中站在甚麼位置。最後一項只確認了兩卷都高於平均，但「都高於平均」並不代表「高得一樣多」。",
    "options": [
      "甲卷，因為原始分數較高",
      "兩卷表現相同，因為兩者都高於各自的平均分",
      "乙卷，因為其標準分數較高（甲 $z = 2$，乙 $z = 2$）",
      "甲卷，因為其標準分數較高"
    ],
    "correctIndex": 2,
    "marks": 1,
    "contentEn": "A student sits two papers. Paper A has mean $200$ and standard deviation $25$; he scored $250$. Paper B has mean $30$ and standard deviation $3$; he scored $36$. Both are normally distributed.\n\nIn relative terms, on which paper did he do better?",
    "optionsEn": [
      "Paper A, because the raw mark is higher",
      "Equally well, since both marks are above their respective means",
      "Paper B, because its standard score is higher (A: $z = 2$, B: $z = 2$)",
      "Paper A, because its standard score is higher"
    ],
    "explanationEn": "The two papers have different means and standard deviations, so the raw marks *cannot* be compared directly — which is precisely why standard scores exist. Paper A gives $z = \\dfrac{250 - 200}{25} = 2$ and Paper B gives $z = \\dfrac{36 - 30}{3} = 2$. The higher $z$ belongs to Paper B, so that is the better relative performance. Comparing raw marks is the main trap: scoring $250$ on one paper and $36$ on another says nothing on its own — what matters is where each mark sits within its own distribution. The last option notes only that both are above average, which does not mean both are above it by the same amount.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "m1_rep_0068",
    "type": "mc",
    "subject": "m1",
    "topic": "normal_distribution",
    "topicZh": "正態分佈",
    "topicEn": "Normal Distribution",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "medium",
    "year": 0,
    "content": "某生應考兩份試卷。甲卷平均分 $90$、標準差 $12$，他得 $108$ 分；乙卷平均分 $45$、標準差 $9$，他得 $63$ 分。兩卷成績均服從正態分佈。\n\n就相對表現而言，他在哪一卷表現較佳？",
    "explanation": "兩份卷的平均分與標準差都不相同，原始分數【不可直接比較】—— 這正是標準分數存在的理由。甲卷 $z = \\dfrac{108 - 90}{12} = 1.5$；乙卷 $z = \\dfrac{63 - 45}{9} = 2$。乙卷的 $z$ 較高，故相對表現較佳。用原始分數比較是本題設下的主要陷阱：一份卷考 $108$ 分，另一份考 $63$ 分，數字大小與「表現好壞」並無必然關係，要看在各自的分佈中站在甚麼位置。最後一項只確認了兩卷都高於平均，但「都高於平均」並不代表「高得一樣多」。",
    "options": [
      "甲卷，因為其標準分數較高",
      "甲卷，因為原始分數較高",
      "兩卷表現相同，因為兩者都高於各自的平均分",
      "乙卷，因為其標準分數較高（甲 $z = 1.5$，乙 $z = 2$）"
    ],
    "correctIndex": 3,
    "marks": 1,
    "contentEn": "A student sits two papers. Paper A has mean $90$ and standard deviation $12$; he scored $108$. Paper B has mean $45$ and standard deviation $9$; he scored $63$. Both are normally distributed.\n\nIn relative terms, on which paper did he do better?",
    "optionsEn": [
      "Paper A, because its standard score is higher",
      "Paper A, because the raw mark is higher",
      "Equally well, since both marks are above their respective means",
      "Paper B, because its standard score is higher (A: $z = 1.5$, B: $z = 2$)"
    ],
    "explanationEn": "The two papers have different means and standard deviations, so the raw marks *cannot* be compared directly — which is precisely why standard scores exist. Paper A gives $z = \\dfrac{108 - 90}{12} = 1.5$ and Paper B gives $z = \\dfrac{63 - 45}{9} = 2$. The higher $z$ belongs to Paper B, so that is the better relative performance. Comparing raw marks is the main trap: scoring $108$ on one paper and $63$ on another says nothing on its own — what matters is where each mark sits within its own distribution. The last option notes only that both are above average, which does not mean both are above it by the same amount.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "m1_rep_0069",
    "type": "mc",
    "subject": "m1",
    "topic": "normal_distribution",
    "topicZh": "正態分佈",
    "topicEn": "Normal Distribution",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "medium",
    "year": 0,
    "content": "設 $X \\sim B(100, 0.4)$。當 $n$ 足夠大時可用正態分佈逼近。\n\n求該逼近正態分佈的平均值與標準差。",
    "explanation": "逼近正態分佈直接沿用二項分佈的平均值與變異數：$\\mu = np = 100 \\times 0.4 = 40$，$\\mathrm{Var}(X) = np(1-p) = 100 \\times 0.4 \\times 0.6 = 24$，而標準差是變異數的【平方根】：$\\sigma = \\sqrt{24} = 4.899$。第一個干擾項把變異數當成標準差，忘記開方 —— 這是本題最主要的失分位，亦是統計題最常見的單位混淆。第二項用了 $n(1-p)$ 作平均值，那是「失敗次數」的期望而非題目所問。第三項開方時漏了因子 $(1-p)$。",
    "options": [
      "$\\mu = 40$，$\\sigma = 4.899$",
      "$\\mu = 40$，$\\sigma = 24$",
      "$\\mu = 60$，$\\sigma = 4.899$",
      "$\\mu = 40$，$\\sigma = 6.3246$"
    ],
    "correctIndex": 0,
    "marks": 1,
    "contentEn": "Let $X \\sim B(100, 0.4)$. For large $n$ this may be approximated by a normal distribution.\n\nFind the mean and standard deviation of that approximation.",
    "optionsEn": [
      "$\\mu = 40$, $\\sigma = 4.899$",
      "$\\mu = 40$, $\\sigma = 24$",
      "$\\mu = 60$, $\\sigma = 4.899$",
      "$\\mu = 40$, $\\sigma = 6.3246$"
    ],
    "explanationEn": "The approximating normal keeps the binomial's mean and variance: $\\mu = np = 100 \\times 0.4 = 40$ and $\\mathrm{Var}(X) = np(1-p) = 100 \\times 0.4 \\times 0.6 = 24$; the standard deviation is the *square root* of the variance, $\\sigma = \\sqrt{24} = 4.899$. The first distractor reports the variance as the standard deviation, forgetting to take the root — the main trap here and the commonest unit confusion in statistics. The second uses $n(1-p)$ as the mean, which is the expected number of failures. The third omits the factor $(1-p)$ before taking the root.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "m1_rep_0070",
    "type": "mc",
    "subject": "m1",
    "topic": "normal_distribution",
    "topicZh": "正態分佈",
    "topicEn": "Normal Distribution",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "medium",
    "year": 0,
    "content": "設 $X \\sim B(400, 0.25)$。當 $n$ 足夠大時可用正態分佈逼近。\n\n求該逼近正態分佈的平均值與標準差。",
    "explanation": "逼近正態分佈直接沿用二項分佈的平均值與變異數：$\\mu = np = 400 \\times 0.25 = 100$，$\\mathrm{Var}(X) = np(1-p) = 400 \\times 0.25 \\times 0.75 = 75$，而標準差是變異數的【平方根】：$\\sigma = \\sqrt{75} = 8.6603$。第一個干擾項把變異數當成標準差，忘記開方 —— 這是本題最主要的失分位，亦是統計題最常見的單位混淆。第二項用了 $n(1-p)$ 作平均值，那是「失敗次數」的期望而非題目所問。第三項開方時漏了因子 $(1-p)$。",
    "options": [
      "$\\mu = 100$，$\\sigma = 10$",
      "$\\mu = 100$，$\\sigma = 8.6603$",
      "$\\mu = 100$，$\\sigma = 75$",
      "$\\mu = 300$，$\\sigma = 8.6603$"
    ],
    "correctIndex": 1,
    "marks": 1,
    "contentEn": "Let $X \\sim B(400, 0.25)$. For large $n$ this may be approximated by a normal distribution.\n\nFind the mean and standard deviation of that approximation.",
    "optionsEn": [
      "$\\mu = 100$, $\\sigma = 10$",
      "$\\mu = 100$, $\\sigma = 8.6603$",
      "$\\mu = 100$, $\\sigma = 75$",
      "$\\mu = 300$, $\\sigma = 8.6603$"
    ],
    "explanationEn": "The approximating normal keeps the binomial's mean and variance: $\\mu = np = 400 \\times 0.25 = 100$ and $\\mathrm{Var}(X) = np(1-p) = 400 \\times 0.25 \\times 0.75 = 75$; the standard deviation is the *square root* of the variance, $\\sigma = \\sqrt{75} = 8.6603$. The first distractor reports the variance as the standard deviation, forgetting to take the root — the main trap here and the commonest unit confusion in statistics. The second uses $n(1-p)$ as the mean, which is the expected number of failures. The third omits the factor $(1-p)$ before taking the root.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "m1_rep_0071",
    "type": "mc",
    "subject": "m1",
    "topic": "normal_distribution",
    "topicZh": "正態分佈",
    "topicEn": "Normal Distribution",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "medium",
    "year": 0,
    "content": "設 $X \\sim B(200, 0.1)$。當 $n$ 足夠大時可用正態分佈逼近。\n\n求該逼近正態分佈的平均值與標準差。",
    "explanation": "逼近正態分佈直接沿用二項分佈的平均值與變異數：$\\mu = np = 200 \\times 0.1 = 20$，$\\mathrm{Var}(X) = np(1-p) = 200 \\times 0.1 \\times 0.9 = 18$，而標準差是變異數的【平方根】：$\\sigma = \\sqrt{18} = 4.2426$。第一個干擾項把變異數當成標準差，忘記開方 —— 這是本題最主要的失分位，亦是統計題最常見的單位混淆。第二項用了 $n(1-p)$ 作平均值，那是「失敗次數」的期望而非題目所問。第三項開方時漏了因子 $(1-p)$。",
    "options": [
      "$\\mu = 180$，$\\sigma = 4.2426$",
      "$\\mu = 20$，$\\sigma = 4.4721$",
      "$\\mu = 20$，$\\sigma = 4.2426$",
      "$\\mu = 20$，$\\sigma = 18$"
    ],
    "correctIndex": 2,
    "marks": 1,
    "contentEn": "Let $X \\sim B(200, 0.1)$. For large $n$ this may be approximated by a normal distribution.\n\nFind the mean and standard deviation of that approximation.",
    "optionsEn": [
      "$\\mu = 180$, $\\sigma = 4.2426$",
      "$\\mu = 20$, $\\sigma = 4.4721$",
      "$\\mu = 20$, $\\sigma = 4.2426$",
      "$\\mu = 20$, $\\sigma = 18$"
    ],
    "explanationEn": "The approximating normal keeps the binomial's mean and variance: $\\mu = np = 200 \\times 0.1 = 20$ and $\\mathrm{Var}(X) = np(1-p) = 200 \\times 0.1 \\times 0.9 = 18$; the standard deviation is the *square root* of the variance, $\\sigma = \\sqrt{18} = 4.2426$. The first distractor reports the variance as the standard deviation, forgetting to take the root — the main trap here and the commonest unit confusion in statistics. The second uses $n(1-p)$ as the mean, which is the expected number of failures. The third omits the factor $(1-p)$ before taking the root.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "m1_rep_0072",
    "type": "mc",
    "subject": "m1",
    "topic": "normal_distribution",
    "topicZh": "正態分佈",
    "topicEn": "Normal Distribution",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "medium",
    "year": 0,
    "content": "設 $X \\sim B(900, 0.2)$。當 $n$ 足夠大時可用正態分佈逼近。\n\n求該逼近正態分佈的平均值與標準差。",
    "explanation": "逼近正態分佈直接沿用二項分佈的平均值與變異數：$\\mu = np = 900 \\times 0.2 = 180$，$\\mathrm{Var}(X) = np(1-p) = 900 \\times 0.2 \\times 0.8 = 144$，而標準差是變異數的【平方根】：$\\sigma = \\sqrt{144} = 12$。第一個干擾項把變異數當成標準差，忘記開方 —— 這是本題最主要的失分位，亦是統計題最常見的單位混淆。第二項用了 $n(1-p)$ 作平均值，那是「失敗次數」的期望而非題目所問。第三項開方時漏了因子 $(1-p)$。",
    "options": [
      "$\\mu = 180$，$\\sigma = 144$",
      "$\\mu = 720$，$\\sigma = 12$",
      "$\\mu = 180$，$\\sigma = 13.4164$",
      "$\\mu = 180$，$\\sigma = 12$"
    ],
    "correctIndex": 3,
    "marks": 1,
    "contentEn": "Let $X \\sim B(900, 0.2)$. For large $n$ this may be approximated by a normal distribution.\n\nFind the mean and standard deviation of that approximation.",
    "optionsEn": [
      "$\\mu = 180$, $\\sigma = 144$",
      "$\\mu = 720$, $\\sigma = 12$",
      "$\\mu = 180$, $\\sigma = 13.4164$",
      "$\\mu = 180$, $\\sigma = 12$"
    ],
    "explanationEn": "The approximating normal keeps the binomial's mean and variance: $\\mu = np = 900 \\times 0.2 = 180$ and $\\mathrm{Var}(X) = np(1-p) = 900 \\times 0.2 \\times 0.8 = 144$; the standard deviation is the *square root* of the variance, $\\sigma = \\sqrt{144} = 12$. The first distractor reports the variance as the standard deviation, forgetting to take the root — the main trap here and the commonest unit confusion in statistics. The second uses $n(1-p)$ as the mean, which is the expected number of failures. The third omits the factor $(1-p)$ before taking the root.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "m1_rep_0073",
    "type": "mc",
    "subject": "m1",
    "topic": "normal_distribution",
    "topicZh": "正態分佈",
    "topicEn": "Normal Distribution",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "medium",
    "year": 0,
    "content": "設 $X \\sim B(500, 0.4)$。當 $n$ 足夠大時可用正態分佈逼近。\n\n求該逼近正態分佈的平均值與標準差。",
    "explanation": "逼近正態分佈直接沿用二項分佈的平均值與變異數：$\\mu = np = 500 \\times 0.4 = 200$，$\\mathrm{Var}(X) = np(1-p) = 500 \\times 0.4 \\times 0.6 = 120$，而標準差是變異數的【平方根】：$\\sigma = \\sqrt{120} = 10.9545$。第一個干擾項把變異數當成標準差，忘記開方 —— 這是本題最主要的失分位，亦是統計題最常見的單位混淆。第二項用了 $n(1-p)$ 作平均值，那是「失敗次數」的期望而非題目所問。第三項開方時漏了因子 $(1-p)$。",
    "options": [
      "$\\mu = 200$，$\\sigma = 10.9545$",
      "$\\mu = 200$，$\\sigma = 120$",
      "$\\mu = 300$，$\\sigma = 10.9545$",
      "$\\mu = 200$，$\\sigma = 14.1421$"
    ],
    "correctIndex": 0,
    "marks": 1,
    "contentEn": "Let $X \\sim B(500, 0.4)$. For large $n$ this may be approximated by a normal distribution.\n\nFind the mean and standard deviation of that approximation.",
    "optionsEn": [
      "$\\mu = 200$, $\\sigma = 10.9545$",
      "$\\mu = 200$, $\\sigma = 120$",
      "$\\mu = 300$, $\\sigma = 10.9545$",
      "$\\mu = 200$, $\\sigma = 14.1421$"
    ],
    "explanationEn": "The approximating normal keeps the binomial's mean and variance: $\\mu = np = 500 \\times 0.4 = 200$ and $\\mathrm{Var}(X) = np(1-p) = 500 \\times 0.4 \\times 0.6 = 120$; the standard deviation is the *square root* of the variance, $\\sigma = \\sqrt{120} = 10.9545$. The first distractor reports the variance as the standard deviation, forgetting to take the root — the main trap here and the commonest unit confusion in statistics. The second uses $n(1-p)$ as the mean, which is the expected number of failures. The third omits the factor $(1-p)$ before taking the root.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "m1_rep_0074",
    "type": "mc",
    "subject": "m1",
    "topic": "normal_distribution",
    "topicZh": "正態分佈",
    "topicEn": "Normal Distribution",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "medium",
    "year": 0,
    "content": "設 $X \\sim B(300, 0.3)$。當 $n$ 足夠大時可用正態分佈逼近。\n\n求該逼近正態分佈的平均值與標準差。",
    "explanation": "逼近正態分佈直接沿用二項分佈的平均值與變異數：$\\mu = np = 300 \\times 0.3 = 90$，$\\mathrm{Var}(X) = np(1-p) = 300 \\times 0.3 \\times 0.7 = 63$，而標準差是變異數的【平方根】：$\\sigma = \\sqrt{63} = 7.9373$。第一個干擾項把變異數當成標準差，忘記開方 —— 這是本題最主要的失分位，亦是統計題最常見的單位混淆。第二項用了 $n(1-p)$ 作平均值，那是「失敗次數」的期望而非題目所問。第三項開方時漏了因子 $(1-p)$。",
    "options": [
      "$\\mu = 90$，$\\sigma = 9.4868$",
      "$\\mu = 90$，$\\sigma = 7.9373$",
      "$\\mu = 90$，$\\sigma = 63$",
      "$\\mu = 210$，$\\sigma = 7.9373$"
    ],
    "correctIndex": 1,
    "marks": 1,
    "contentEn": "Let $X \\sim B(300, 0.3)$. For large $n$ this may be approximated by a normal distribution.\n\nFind the mean and standard deviation of that approximation.",
    "optionsEn": [
      "$\\mu = 90$, $\\sigma = 9.4868$",
      "$\\mu = 90$, $\\sigma = 7.9373$",
      "$\\mu = 90$, $\\sigma = 63$",
      "$\\mu = 210$, $\\sigma = 7.9373$"
    ],
    "explanationEn": "The approximating normal keeps the binomial's mean and variance: $\\mu = np = 300 \\times 0.3 = 90$ and $\\mathrm{Var}(X) = np(1-p) = 300 \\times 0.3 \\times 0.7 = 63$; the standard deviation is the *square root* of the variance, $\\sigma = \\sqrt{63} = 7.9373$. The first distractor reports the variance as the standard deviation, forgetting to take the root — the main trap here and the commonest unit confusion in statistics. The second uses $n(1-p)$ as the mean, which is the expected number of failures. The third omits the factor $(1-p)$ before taking the root.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "m1_rep_0075",
    "type": "mc",
    "subject": "m1",
    "topic": "integration",
    "topicZh": "積分法",
    "topicEn": "Integration",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "medium",
    "year": 0,
    "content": "已知 $f(x) = 3x$。試求 $f$ 在區間 $[1, 2]$ 上的定積分值。",
    "explanation": "先求原函數：$\\displaystyle\\int 3x \\, dx = \\dfrac{3x^{2}}{2}$。再代入上下限相減：$\\dfrac{3(2)^{2}}{2} - \\dfrac{3(1)^{2}}{2} = 6 - 1.5 = 4.5$。第一個干擾項只代入了上限而忘記減去下限的值 —— 定積分永遠是【上限減下限】兩項之差，這是最主要的失分位。第二項把相減次序調轉，得出的答案符號相反。第三項把被積函數當成常數乘以區間長度，那只有在被積函數確實是常數時才成立。",
    "options": [
      "$-4.5$",
      "$3$",
      "$4.5$",
      "$6$"
    ],
    "correctIndex": 2,
    "marks": 1,
    "contentEn": "Let $f(x) = 3x$. Find the value of the definite integral of $f$ over the interval $[1, 2]$.",
    "optionsEn": [
      "$-4.5$",
      "$3$",
      "$4.5$",
      "$6$"
    ],
    "explanationEn": "First find an antiderivative: $\\displaystyle\\int 3x \\, dx = \\dfrac{3x^{2}}{2}$. Then substitute the limits and subtract: $\\dfrac{3(2)^{2}}{2} - \\dfrac{3(1)^{2}}{2} = 6 - 1.5 = 4.5$. The first distractor substitutes the upper limit only and forgets to subtract the lower — a definite integral is always the difference *upper minus lower*, and this is the main trap. The second reverses the subtraction and flips the sign. The third multiplies the integrand by the width of the interval, which is valid only when the integrand really is constant.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "m1_rep_0076",
    "type": "mc",
    "subject": "m1",
    "topic": "integration",
    "topicZh": "積分法",
    "topicEn": "Integration",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "medium",
    "year": 0,
    "content": "已知 $f(x) = 2x$。試求 $f$ 在區間 $[1, 3]$ 上的定積分值。",
    "explanation": "先求原函數：$\\displaystyle\\int 2x \\, dx = \\dfrac{2x^{2}}{2}$。再代入上下限相減：$\\dfrac{2(3)^{2}}{2} - \\dfrac{2(1)^{2}}{2} = 9 - 1 = 8$。第一個干擾項只代入了上限而忘記減去下限的值 —— 定積分永遠是【上限減下限】兩項之差，這是最主要的失分位。第二項把相減次序調轉，得出的答案符號相反。第三項把被積函數當成常數乘以區間長度，那只有在被積函數確實是常數時才成立。",
    "options": [
      "$9$",
      "$-8$",
      "$4$",
      "$8$"
    ],
    "correctIndex": 3,
    "marks": 1,
    "contentEn": "Let $f(x) = 2x$. Find the value of the definite integral of $f$ over the interval $[1, 3]$.",
    "optionsEn": [
      "$9$",
      "$-8$",
      "$4$",
      "$8$"
    ],
    "explanationEn": "First find an antiderivative: $\\displaystyle\\int 2x \\, dx = \\dfrac{2x^{2}}{2}$. Then substitute the limits and subtract: $\\dfrac{2(3)^{2}}{2} - \\dfrac{2(1)^{2}}{2} = 9 - 1 = 8$. The first distractor substitutes the upper limit only and forgets to subtract the lower — a definite integral is always the difference *upper minus lower*, and this is the main trap. The second reverses the subtraction and flips the sign. The third multiplies the integrand by the width of the interval, which is valid only when the integrand really is constant.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "m1_rep_0077",
    "type": "mc",
    "subject": "m1",
    "topic": "integration",
    "topicZh": "積分法",
    "topicEn": "Integration",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "medium",
    "year": 0,
    "content": "已知 $f(x) = 4x$。試求 $f$ 在區間 $[1, 3]$ 上的定積分值。",
    "explanation": "先求原函數：$\\displaystyle\\int 4x \\, dx = \\dfrac{4x^{2}}{2}$。再代入上下限相減：$\\dfrac{4(3)^{2}}{2} - \\dfrac{4(1)^{2}}{2} = 18 - 2 = 16$。第一個干擾項只代入了上限而忘記減去下限的值 —— 定積分永遠是【上限減下限】兩項之差，這是最主要的失分位。第二項把相減次序調轉，得出的答案符號相反。第三項把被積函數當成常數乘以區間長度，那只有在被積函數確實是常數時才成立。",
    "options": [
      "$16$",
      "$18$",
      "$-16$",
      "$8$"
    ],
    "correctIndex": 0,
    "marks": 1,
    "contentEn": "Let $f(x) = 4x$. Find the value of the definite integral of $f$ over the interval $[1, 3]$.",
    "optionsEn": [
      "$16$",
      "$18$",
      "$-16$",
      "$8$"
    ],
    "explanationEn": "First find an antiderivative: $\\displaystyle\\int 4x \\, dx = \\dfrac{4x^{2}}{2}$. Then substitute the limits and subtract: $\\dfrac{4(3)^{2}}{2} - \\dfrac{4(1)^{2}}{2} = 18 - 2 = 16$. The first distractor substitutes the upper limit only and forgets to subtract the lower — a definite integral is always the difference *upper minus lower*, and this is the main trap. The second reverses the subtraction and flips the sign. The third multiplies the integrand by the width of the interval, which is valid only when the integrand really is constant.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "m1_rep_0078",
    "type": "mc",
    "subject": "m1",
    "topic": "integration",
    "topicZh": "積分法",
    "topicEn": "Integration",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "medium",
    "year": 0,
    "content": "已知 $f(x) = 6x$。試求 $f$ 在區間 $[2, 4]$ 上的定積分值。",
    "explanation": "先求原函數：$\\displaystyle\\int 6x \\, dx = \\dfrac{6x^{2}}{2}$。再代入上下限相減：$\\dfrac{6(4)^{2}}{2} - \\dfrac{6(2)^{2}}{2} = 48 - 12 = 36$。第一個干擾項只代入了上限而忘記減去下限的值 —— 定積分永遠是【上限減下限】兩項之差，這是最主要的失分位。第二項把相減次序調轉，得出的答案符號相反。第三項把被積函數當成常數乘以區間長度，那只有在被積函數確實是常數時才成立。",
    "options": [
      "$12$",
      "$36$",
      "$48$",
      "$-36$"
    ],
    "correctIndex": 1,
    "marks": 1,
    "contentEn": "Let $f(x) = 6x$. Find the value of the definite integral of $f$ over the interval $[2, 4]$.",
    "optionsEn": [
      "$12$",
      "$36$",
      "$48$",
      "$-36$"
    ],
    "explanationEn": "First find an antiderivative: $\\displaystyle\\int 6x \\, dx = \\dfrac{6x^{2}}{2}$. Then substitute the limits and subtract: $\\dfrac{6(4)^{2}}{2} - \\dfrac{6(2)^{2}}{2} = 48 - 12 = 36$. The first distractor substitutes the upper limit only and forgets to subtract the lower — a definite integral is always the difference *upper minus lower*, and this is the main trap. The second reverses the subtraction and flips the sign. The third multiplies the integrand by the width of the interval, which is valid only when the integrand really is constant.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "m1_rep_0079",
    "type": "mc",
    "subject": "m1",
    "topic": "integration",
    "topicZh": "積分法",
    "topicEn": "Integration",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "medium",
    "year": 0,
    "content": "已知 $f(x) = 5x$。試求 $f$ 在區間 $[1, 2]$ 上的定積分值。",
    "explanation": "先求原函數：$\\displaystyle\\int 5x \\, dx = \\dfrac{5x^{2}}{2}$。再代入上下限相減：$\\dfrac{5(2)^{2}}{2} - \\dfrac{5(1)^{2}}{2} = 10 - 2.5 = 7.5$。第一個干擾項只代入了上限而忘記減去下限的值 —— 定積分永遠是【上限減下限】兩項之差，這是最主要的失分位。第二項把相減次序調轉，得出的答案符號相反。第三項把被積函數當成常數乘以區間長度，那只有在被積函數確實是常數時才成立。",
    "options": [
      "$-7.5$",
      "$5$",
      "$7.5$",
      "$10$"
    ],
    "correctIndex": 2,
    "marks": 1,
    "contentEn": "Let $f(x) = 5x$. Find the value of the definite integral of $f$ over the interval $[1, 2]$.",
    "optionsEn": [
      "$-7.5$",
      "$5$",
      "$7.5$",
      "$10$"
    ],
    "explanationEn": "First find an antiderivative: $\\displaystyle\\int 5x \\, dx = \\dfrac{5x^{2}}{2}$. Then substitute the limits and subtract: $\\dfrac{5(2)^{2}}{2} - \\dfrac{5(1)^{2}}{2} = 10 - 2.5 = 7.5$. The first distractor substitutes the upper limit only and forgets to subtract the lower — a definite integral is always the difference *upper minus lower*, and this is the main trap. The second reverses the subtraction and flips the sign. The third multiplies the integrand by the width of the interval, which is valid only when the integrand really is constant.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "m1_rep_0080",
    "type": "mc",
    "subject": "m1",
    "topic": "integration",
    "topicZh": "積分法",
    "topicEn": "Integration",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "medium",
    "year": 0,
    "content": "已知 $f(x) = 3x$。試求 $f$ 在區間 $[2, 5]$ 上的定積分值。",
    "explanation": "先求原函數：$\\displaystyle\\int 3x \\, dx = \\dfrac{3x^{2}}{2}$。再代入上下限相減：$\\dfrac{3(5)^{2}}{2} - \\dfrac{3(2)^{2}}{2} = 37.5 - 6 = 31.5$。第一個干擾項只代入了上限而忘記減去下限的值 —— 定積分永遠是【上限減下限】兩項之差，這是最主要的失分位。第二項把相減次序調轉，得出的答案符號相反。第三項把被積函數當成常數乘以區間長度，那只有在被積函數確實是常數時才成立。",
    "options": [
      "$37.5$",
      "$-31.5$",
      "$9$",
      "$31.5$"
    ],
    "correctIndex": 3,
    "marks": 1,
    "contentEn": "Let $f(x) = 3x$. Find the value of the definite integral of $f$ over the interval $[2, 5]$.",
    "optionsEn": [
      "$37.5$",
      "$-31.5$",
      "$9$",
      "$31.5$"
    ],
    "explanationEn": "First find an antiderivative: $\\displaystyle\\int 3x \\, dx = \\dfrac{3x^{2}}{2}$. Then substitute the limits and subtract: $\\dfrac{3(5)^{2}}{2} - \\dfrac{3(2)^{2}}{2} = 37.5 - 6 = 31.5$. The first distractor substitutes the upper limit only and forgets to subtract the lower — a definite integral is always the difference *upper minus lower*, and this is the main trap. The second reverses the subtraction and flips the sign. The third multiplies the integrand by the width of the interval, which is valid only when the integrand really is constant.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "m1_rep_0081",
    "type": "mc",
    "subject": "m1",
    "topic": "integration",
    "topicZh": "積分法",
    "topicEn": "Integration",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "medium",
    "year": 0,
    "content": "已知 $\\dfrac{dy}{dx} = 6x$，且曲線經過點 $(1, 5)$。求 $y$ 關於 $x$ 的表達式。",
    "explanation": "不定積分得 $y = \\dfrac{6x^{2}}{2} + C = 3x^{2} + C$，其中 $C$ 是【積分常數】，必須靠題目給的一點定出來。代入 $(1, 5)$：$5 = 3(1)^{2} + C$，得 $C = 2$。第一個干擾項漏了積分常數 —— 不定積分的答案永遠帶一個 $C$，題目既然給了一點，就是要求你把它定出來，這是本題最主要的失分位。第二項積分時忘記除以 $2$。第三項的常數符號相反。",
    "options": [
      "$y = 3x^{2} + 2$",
      "$y = 3x^{2}$",
      "$y = 6x^{2} + 2$",
      "$y = 3x^{2} − 2$"
    ],
    "correctIndex": 0,
    "marks": 1,
    "contentEn": "Given $\\dfrac{dy}{dx} = 6x$ and that the curve passes through $(1, 5)$, express $y$ in terms of $x$.",
    "optionsEn": [
      "$y = 3x^{2} + 2$",
      "$y = 3x^{2}$",
      "$y = 6x^{2} + 2$",
      "$y = 3x^{2} − 2$"
    ],
    "explanationEn": "Integrating gives $y = \\dfrac{6x^{2}}{2} + C = 3x^{2} + C$, where $C$ is the *constant of integration* and must be pinned down by the given point. Substituting $(1, 5)$: $5 = 3(1)^{2} + C$, so $C = 2$. The first distractor omits the constant — an indefinite integral always carries one, and supplying a point is exactly how the question asks you to determine it. This is the main trap. The second forgets to divide by $2$ when integrating, and the third has the wrong sign on the constant.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "m1_rep_0082",
    "type": "mc",
    "subject": "m1",
    "topic": "integration",
    "topicZh": "積分法",
    "topicEn": "Integration",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "medium",
    "year": 0,
    "content": "已知 $\\dfrac{dy}{dx} = 4x$，且曲線經過點 $(2, 3)$。求 $y$ 關於 $x$ 的表達式。",
    "explanation": "不定積分得 $y = \\dfrac{4x^{2}}{2} + C = 2x^{2} + C$，其中 $C$ 是【積分常數】，必須靠題目給的一點定出來。代入 $(2, 3)$：$3 = 2(2)^{2} + C$，得 $C = -5$。第一個干擾項漏了積分常數 —— 不定積分的答案永遠帶一個 $C$，題目既然給了一點，就是要求你把它定出來，這是本題最主要的失分位。第二項積分時忘記除以 $2$。第三項的常數符號相反。",
    "options": [
      "$y = 2x^{2} + 5$",
      "$y = 2x^{2} − 5$",
      "$y = 2x^{2}$",
      "$y = 4x^{2} − 5$"
    ],
    "correctIndex": 1,
    "marks": 1,
    "contentEn": "Given $\\dfrac{dy}{dx} = 4x$ and that the curve passes through $(2, 3)$, express $y$ in terms of $x$.",
    "optionsEn": [
      "$y = 2x^{2} + 5$",
      "$y = 2x^{2} − 5$",
      "$y = 2x^{2}$",
      "$y = 4x^{2} − 5$"
    ],
    "explanationEn": "Integrating gives $y = \\dfrac{4x^{2}}{2} + C = 2x^{2} + C$, where $C$ is the *constant of integration* and must be pinned down by the given point. Substituting $(2, 3)$: $3 = 2(2)^{2} + C$, so $C = -5$. The first distractor omits the constant — an indefinite integral always carries one, and supplying a point is exactly how the question asks you to determine it. This is the main trap. The second forgets to divide by $2$ when integrating, and the third has the wrong sign on the constant.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "m1_rep_0083",
    "type": "mc",
    "subject": "m1",
    "topic": "integration",
    "topicZh": "積分法",
    "topicEn": "Integration",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "hard",
    "year": 0,
    "content": "曲線 $y = x^{2}$ 與 $x$ 軸及直線 $x = 4$ 所圍成的區域（$0 \\leq x \\leq 4$）。\n\n求該區域的面積。",
    "explanation": "曲線下的面積由定積分求出：$\\displaystyle\\int_{0}^{4} 1x^{2}\\,dx = \\left[\\dfrac{1x^{3}}{3}\\right]_{0}^{4} = \\dfrac{1(4)^{3}}{3} - 0 = 21.3333$。第一個干擾項只把 $x = 4$ 代入原函數，得出的是該點的【高度】而非面積 —— 面積必須經積分累加，不能用單一點的函數值代替。第二項積分時把 $x^{2}$ 的原函數誤寫成除以 $2$（應為除以 $3$，因為指數加一之後是 $3$）。第三項把答案再除一次 $2$，那是三角形面積公式的殘留 —— 曲線下的區域並非三角形，不可套用。",
    "options": [
      "$32$ 平方單位",
      "$10.6667$ 平方單位",
      "$21.3333$ 平方單位",
      "$16$ 平方單位"
    ],
    "correctIndex": 2,
    "marks": 1,
    "contentEn": "Find the area of the region bounded by the curve $y = x^{2}$, the $x$-axis and the line $x = 4$, for $0 \\leq x \\leq 4$.",
    "optionsEn": [
      "$32$ square units",
      "$10.6667$ square units",
      "$21.3333$ square units",
      "$16$ square units"
    ],
    "explanationEn": "The area under a curve is given by a definite integral: $\\displaystyle\\int_{0}^{4} 1x^{2}\\,dx = \\left[\\dfrac{1x^{3}}{3}\\right]_{0}^{4} = \\dfrac{1(4)^{3}}{3} - 0 = 21.3333$. The first distractor substitutes $x = 4$ into the original function, which gives the *height* at that point, not an area; areas must be accumulated by integration and cannot be read off a single function value. The second divides by $2$ instead of $3$ when integrating $x^{2}$ — raising the index gives $3$. The third halves the correct answer, a leftover from the triangle formula, which does not apply to a region bounded by a curve.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "m1_rep_0084",
    "type": "mc",
    "subject": "m1",
    "topic": "integration",
    "topicZh": "積分法",
    "topicEn": "Integration",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "hard",
    "year": 0,
    "content": "曲線 $y = 2x^{2}$ 與 $x$ 軸及直線 $x = 5$ 所圍成的區域（$0 \\leq x \\leq 5$）。\n\n求該區域的面積。",
    "explanation": "曲線下的面積由定積分求出：$\\displaystyle\\int_{0}^{5} 2x^{2}\\,dx = \\left[\\dfrac{2x^{3}}{3}\\right]_{0}^{5} = \\dfrac{2(5)^{3}}{3} - 0 = 83.3333$。第一個干擾項只把 $x = 5$ 代入原函數，得出的是該點的【高度】而非面積 —— 面積必須經積分累加，不能用單一點的函數值代替。第二項積分時把 $x^{2}$ 的原函數誤寫成除以 $2$（應為除以 $3$，因為指數加一之後是 $3$）。第三項把答案再除一次 $2$，那是三角形面積公式的殘留 —— 曲線下的區域並非三角形，不可套用。",
    "options": [
      "$50$ 平方單位",
      "$125$ 平方單位",
      "$41.6667$ 平方單位",
      "$83.3333$ 平方單位"
    ],
    "correctIndex": 3,
    "marks": 1,
    "contentEn": "Find the area of the region bounded by the curve $y = 2x^{2}$, the $x$-axis and the line $x = 5$, for $0 \\leq x \\leq 5$.",
    "optionsEn": [
      "$50$ square units",
      "$125$ square units",
      "$41.6667$ square units",
      "$83.3333$ square units"
    ],
    "explanationEn": "The area under a curve is given by a definite integral: $\\displaystyle\\int_{0}^{5} 2x^{2}\\,dx = \\left[\\dfrac{2x^{3}}{3}\\right]_{0}^{5} = \\dfrac{2(5)^{3}}{3} - 0 = 83.3333$. The first distractor substitutes $x = 5$ into the original function, which gives the *height* at that point, not an area; areas must be accumulated by integration and cannot be read off a single function value. The second divides by $2$ instead of $3$ when integrating $x^{2}$ — raising the index gives $3$. The third halves the correct answer, a leftover from the triangle formula, which does not apply to a region bounded by a curve.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "m1_rep_0085",
    "type": "mc",
    "subject": "m1",
    "topic": "binomial_distribution",
    "topicZh": "二項分佈",
    "topicEn": "Binomial Distribution",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "設 $X \\sim B(20, 0.4)$。求 $\\mathrm{Var}(X)$。",
    "explanation": "二項分佈的變異數為 $\\mathrm{Var}(X) = np(1-p) = 20 \\times 0.4 \\times 0.6 = 4.8$。三個因子缺一不可。第一個干擾項 $8$ 是【期望值】$E(X) = np$ —— 期望值同變異數用同一組參數但意義完全不同，混淆兩者是本題最主要的失分位。第二項開了平方根，那是標準差而非變異數。第三項把 $p$ 同 $(1-p)$ 的角色搞混，漏了其中一個因子。記法：變異數的公式一定同時出現 $p$ 同 $(1-p)$，因為它量度的是「成功與失敗兩邊的不確定性」。",
    "options": [
      "$4.8$",
      "$8$",
      "$2.1909$",
      "$12$"
    ],
    "correctIndex": 0,
    "marks": 1,
    "contentEn": "Let $X \\sim B(20, 0.4)$. Find $\\mathrm{Var}(X)$.",
    "optionsEn": [
      "$4.8$",
      "$8$",
      "$2.1909$",
      "$12$"
    ],
    "explanationEn": "The variance of a binomial distribution is $\\mathrm{Var}(X) = np(1-p) = 20 \\times 0.4 \\times 0.6 = 4.8$; all three factors are required. The first distractor, $8$, is the *expectation* $E(X) = np$ — the two use the same parameters but mean quite different things, and confusing them is the main trap. The second takes a square root, giving the standard deviation rather than the variance. The third drops one factor by muddling $p$ with $(1-p)$. As a memory aid: the variance formula always contains both $p$ and $(1-p)$, because it measures uncertainty on both the success and failure sides.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "m1_rep_0086",
    "type": "mc",
    "subject": "m1",
    "topic": "binomial_distribution",
    "topicZh": "二項分佈",
    "topicEn": "Binomial Distribution",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "設 $X \\sim B(50, 0.2)$。求 $\\mathrm{Var}(X)$。",
    "explanation": "二項分佈的變異數為 $\\mathrm{Var}(X) = np(1-p) = 50 \\times 0.2 \\times 0.8 = 8$。三個因子缺一不可。第一個干擾項 $10$ 是【期望值】$E(X) = np$ —— 期望值同變異數用同一組參數但意義完全不同，混淆兩者是本題最主要的失分位。第二項開了平方根，那是標準差而非變異數。第三項把 $p$ 同 $(1-p)$ 的角色搞混，漏了其中一個因子。記法：變異數的公式一定同時出現 $p$ 同 $(1-p)$，因為它量度的是「成功與失敗兩邊的不確定性」。",
    "options": [
      "$40$",
      "$8$",
      "$10$",
      "$2.8284$"
    ],
    "correctIndex": 1,
    "marks": 1,
    "contentEn": "Let $X \\sim B(50, 0.2)$. Find $\\mathrm{Var}(X)$.",
    "optionsEn": [
      "$40$",
      "$8$",
      "$10$",
      "$2.8284$"
    ],
    "explanationEn": "The variance of a binomial distribution is $\\mathrm{Var}(X) = np(1-p) = 50 \\times 0.2 \\times 0.8 = 8$; all three factors are required. The first distractor, $10$, is the *expectation* $E(X) = np$ — the two use the same parameters but mean quite different things, and confusing them is the main trap. The second takes a square root, giving the standard deviation rather than the variance. The third drops one factor by muddling $p$ with $(1-p)$. As a memory aid: the variance formula always contains both $p$ and $(1-p)$, because it measures uncertainty on both the success and failure sides.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "m1_rep_0087",
    "type": "mc",
    "subject": "m1",
    "topic": "binomial_distribution",
    "topicZh": "二項分佈",
    "topicEn": "Binomial Distribution",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "設 $X \\sim B(12, 0.25)$。求 $\\mathrm{Var}(X)$。",
    "explanation": "二項分佈的變異數為 $\\mathrm{Var}(X) = np(1-p) = 12 \\times 0.25 \\times 0.75 = 2.25$。三個因子缺一不可。第一個干擾項 $3$ 是【期望值】$E(X) = np$ —— 期望值同變異數用同一組參數但意義完全不同，混淆兩者是本題最主要的失分位。第二項開了平方根，那是標準差而非變異數。第三項把 $p$ 同 $(1-p)$ 的角色搞混，漏了其中一個因子。記法：變異數的公式一定同時出現 $p$ 同 $(1-p)$，因為它量度的是「成功與失敗兩邊的不確定性」。",
    "options": [
      "$1.5$",
      "$9$",
      "$2.25$",
      "$3$"
    ],
    "correctIndex": 2,
    "marks": 1,
    "contentEn": "Let $X \\sim B(12, 0.25)$. Find $\\mathrm{Var}(X)$.",
    "optionsEn": [
      "$1.5$",
      "$9$",
      "$2.25$",
      "$3$"
    ],
    "explanationEn": "The variance of a binomial distribution is $\\mathrm{Var}(X) = np(1-p) = 12 \\times 0.25 \\times 0.75 = 2.25$; all three factors are required. The first distractor, $3$, is the *expectation* $E(X) = np$ — the two use the same parameters but mean quite different things, and confusing them is the main trap. The second takes a square root, giving the standard deviation rather than the variance. The third drops one factor by muddling $p$ with $(1-p)$. As a memory aid: the variance formula always contains both $p$ and $(1-p)$, because it measures uncertainty on both the success and failure sides.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "m1_rep_0088",
    "type": "mc",
    "subject": "m1",
    "topic": "binomial_distribution",
    "topicZh": "二項分佈",
    "topicEn": "Binomial Distribution",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "設 $X \\sim B(80, 0.15)$。求 $\\mathrm{Var}(X)$。",
    "explanation": "二項分佈的變異數為 $\\mathrm{Var}(X) = np(1-p) = 80 \\times 0.15 \\times 0.85 = 10.2$。三個因子缺一不可。第一個干擾項 $12$ 是【期望值】$E(X) = np$ —— 期望值同變異數用同一組參數但意義完全不同，混淆兩者是本題最主要的失分位。第二項開了平方根，那是標準差而非變異數。第三項把 $p$ 同 $(1-p)$ 的角色搞混，漏了其中一個因子。記法：變異數的公式一定同時出現 $p$ 同 $(1-p)$，因為它量度的是「成功與失敗兩邊的不確定性」。",
    "options": [
      "$12$",
      "$3.1937$",
      "$68$",
      "$10.2$"
    ],
    "correctIndex": 3,
    "marks": 1,
    "contentEn": "Let $X \\sim B(80, 0.15)$. Find $\\mathrm{Var}(X)$.",
    "optionsEn": [
      "$12$",
      "$3.1937$",
      "$68$",
      "$10.2$"
    ],
    "explanationEn": "The variance of a binomial distribution is $\\mathrm{Var}(X) = np(1-p) = 80 \\times 0.15 \\times 0.85 = 10.2$; all three factors are required. The first distractor, $12$, is the *expectation* $E(X) = np$ — the two use the same parameters but mean quite different things, and confusing them is the main trap. The second takes a square root, giving the standard deviation rather than the variance. The third drops one factor by muddling $p$ with $(1-p)$. As a memory aid: the variance formula always contains both $p$ and $(1-p)$, because it measures uncertainty on both the success and failure sides.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "m1_rep_0089",
    "type": "mc",
    "subject": "m1",
    "topic": "binomial_distribution",
    "topicZh": "二項分佈",
    "topicEn": "Binomial Distribution",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "設 $X \\sim B(30, 0.6)$。求 $\\mathrm{Var}(X)$。",
    "explanation": "二項分佈的變異數為 $\\mathrm{Var}(X) = np(1-p) = 30 \\times 0.6 \\times 0.4 = 7.2$。三個因子缺一不可。第一個干擾項 $18$ 是【期望值】$E(X) = np$ —— 期望值同變異數用同一組參數但意義完全不同，混淆兩者是本題最主要的失分位。第二項開了平方根，那是標準差而非變異數。第三項把 $p$ 同 $(1-p)$ 的角色搞混，漏了其中一個因子。記法：變異數的公式一定同時出現 $p$ 同 $(1-p)$，因為它量度的是「成功與失敗兩邊的不確定性」。",
    "options": [
      "$7.2$",
      "$18$",
      "$2.6833$",
      "$12$"
    ],
    "correctIndex": 0,
    "marks": 1,
    "contentEn": "Let $X \\sim B(30, 0.6)$. Find $\\mathrm{Var}(X)$.",
    "optionsEn": [
      "$7.2$",
      "$18$",
      "$2.6833$",
      "$12$"
    ],
    "explanationEn": "The variance of a binomial distribution is $\\mathrm{Var}(X) = np(1-p) = 30 \\times 0.6 \\times 0.4 = 7.2$; all three factors are required. The first distractor, $18$, is the *expectation* $E(X) = np$ — the two use the same parameters but mean quite different things, and confusing them is the main trap. The second takes a square root, giving the standard deviation rather than the variance. The third drops one factor by muddling $p$ with $(1-p)$. As a memory aid: the variance formula always contains both $p$ and $(1-p)$, because it measures uncertainty on both the success and failure sides.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "m1_rep_0090",
    "type": "mc",
    "subject": "m1",
    "topic": "binomial_distribution",
    "topicZh": "二項分佈",
    "topicEn": "Binomial Distribution",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "設 $X \\sim B(45, 0.8)$。求 $\\mathrm{Var}(X)$。",
    "explanation": "二項分佈的變異數為 $\\mathrm{Var}(X) = np(1-p) = 45 \\times 0.8 \\times 0.2 = 7.2$。三個因子缺一不可。第一個干擾項 $36$ 是【期望值】$E(X) = np$ —— 期望值同變異數用同一組參數但意義完全不同，混淆兩者是本題最主要的失分位。第二項開了平方根，那是標準差而非變異數。第三項把 $p$ 同 $(1-p)$ 的角色搞混，漏了其中一個因子。記法：變異數的公式一定同時出現 $p$ 同 $(1-p)$，因為它量度的是「成功與失敗兩邊的不確定性」。",
    "options": [
      "$9$",
      "$7.2$",
      "$36$",
      "$2.6833$"
    ],
    "correctIndex": 1,
    "marks": 1,
    "contentEn": "Let $X \\sim B(45, 0.8)$. Find $\\mathrm{Var}(X)$.",
    "optionsEn": [
      "$9$",
      "$7.2$",
      "$36$",
      "$2.6833$"
    ],
    "explanationEn": "The variance of a binomial distribution is $\\mathrm{Var}(X) = np(1-p) = 45 \\times 0.8 \\times 0.2 = 7.2$; all three factors are required. The first distractor, $36$, is the *expectation* $E(X) = np$ — the two use the same parameters but mean quite different things, and confusing them is the main trap. The second takes a square root, giving the standard deviation rather than the variance. The third drops one factor by muddling $p$ with $(1-p)$. As a memory aid: the variance formula always contains both $p$ and $(1-p)$, because it measures uncertainty on both the success and failure sides.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "m1_rep_0091",
    "type": "mc",
    "subject": "m1",
    "topic": "binomial_distribution",
    "topicZh": "二項分佈",
    "topicEn": "Binomial Distribution",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "medium",
    "year": 0,
    "content": "設 $X \\sim B(5, 0.2)$。求 $P(X \\geq 1)$。",
    "explanation": "「至少一次」的反面是「一次也沒有」，用補集算最快：$P(X \\geq 1) = 1 - P(X = 0) = 1 - (1 - 0.2)^{5} = 1 - 0.3277 = 0.6723$。若逐項相加 $P(X=1) + P(X=2) + \\cdots + P(X=5)$，要算 $5$ 項，既慢又易漏。第一個干擾項答了 $P(X = 0)$ 本身，即補集而非題目所問。第二項只算了 $P(X = 1)$ —— 「至少一次」包括一次、兩次…以至 $5$ 次，不止一次。第三項答了期望值 $np$，那是次數不是概率，而且可以大過 $1$，僅憑這一點就應該排除。",
    "options": [
      "$0.4096$",
      "$1$",
      "$0.6723$",
      "$0.3277$"
    ],
    "correctIndex": 2,
    "marks": 1,
    "contentEn": "Let $X \\sim B(5, 0.2)$. Find $P(X \\geq 1)$.",
    "optionsEn": [
      "$0.4096$",
      "$1$",
      "$0.6723$",
      "$0.3277$"
    ],
    "explanationEn": "The complement of \"at least one\" is \"none at all\", which is far quicker: $P(X \\geq 1) = 1 - P(X = 0) = 1 - (1 - 0.2)^{5} = 1 - 0.3277 = 0.6723$. Summing $P(X=1) + P(X=2) + \\cdots + P(X=5)$ instead means $5$ separate terms, slower and easy to leave one out. The first distractor gives $P(X = 0)$, the complement rather than the answer. The second gives only $P(X = 1)$ — \"at least one\" also covers two, three and so on up to $5$. The third gives the expectation $np$, which counts occurrences rather than probability and can exceed $1$, ruling it out on that ground alone.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "m1_rep_0092",
    "type": "mc",
    "subject": "m1",
    "topic": "binomial_distribution",
    "topicZh": "二項分佈",
    "topicEn": "Binomial Distribution",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "medium",
    "year": 0,
    "content": "設 $X \\sim B(4, 0.5)$。求 $P(X \\geq 1)$。",
    "explanation": "「至少一次」的反面是「一次也沒有」，用補集算最快：$P(X \\geq 1) = 1 - P(X = 0) = 1 - (1 - 0.5)^{4} = 1 - 0.0625 = 0.9375$。若逐項相加 $P(X=1) + P(X=2) + \\cdots + P(X=4)$，要算 $4$ 項，既慢又易漏。第一個干擾項答了 $P(X = 0)$ 本身，即補集而非題目所問。第二項只算了 $P(X = 1)$ —— 「至少一次」包括一次、兩次…以至 $4$ 次，不止一次。第三項答了期望值 $np$，那是次數不是概率，而且可以大過 $1$，僅憑這一點就應該排除。",
    "options": [
      "$0.0625$",
      "$0.25$",
      "$2$",
      "$0.9375$"
    ],
    "correctIndex": 3,
    "marks": 1,
    "contentEn": "Let $X \\sim B(4, 0.5)$. Find $P(X \\geq 1)$.",
    "optionsEn": [
      "$0.0625$",
      "$0.25$",
      "$2$",
      "$0.9375$"
    ],
    "explanationEn": "The complement of \"at least one\" is \"none at all\", which is far quicker: $P(X \\geq 1) = 1 - P(X = 0) = 1 - (1 - 0.5)^{4} = 1 - 0.0625 = 0.9375$. Summing $P(X=1) + P(X=2) + \\cdots + P(X=4)$ instead means $4$ separate terms, slower and easy to leave one out. The first distractor gives $P(X = 0)$, the complement rather than the answer. The second gives only $P(X = 1)$ — \"at least one\" also covers two, three and so on up to $4$. The third gives the expectation $np$, which counts occurrences rather than probability and can exceed $1$, ruling it out on that ground alone.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "m1_rep_0093",
    "type": "mc",
    "subject": "m1",
    "topic": "binomial_distribution",
    "topicZh": "二項分佈",
    "topicEn": "Binomial Distribution",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "medium",
    "year": 0,
    "content": "設 $X \\sim B(6, 0.1)$。求 $P(X \\geq 1)$。",
    "explanation": "「至少一次」的反面是「一次也沒有」，用補集算最快：$P(X \\geq 1) = 1 - P(X = 0) = 1 - (1 - 0.1)^{6} = 1 - 0.5314 = 0.4686$。若逐項相加 $P(X=1) + P(X=2) + \\cdots + P(X=6)$，要算 $6$ 項，既慢又易漏。第一個干擾項答了 $P(X = 0)$ 本身，即補集而非題目所問。第二項只算了 $P(X = 1)$ —— 「至少一次」包括一次、兩次…以至 $6$ 次，不止一次。第三項答了期望值 $np$，那是次數不是概率，而且可以大過 $1$，僅憑這一點就應該排除。",
    "options": [
      "$0.4686$",
      "$0.5314$",
      "$0.3543$",
      "$0.6$"
    ],
    "correctIndex": 0,
    "marks": 1,
    "contentEn": "Let $X \\sim B(6, 0.1)$. Find $P(X \\geq 1)$.",
    "optionsEn": [
      "$0.4686$",
      "$0.5314$",
      "$0.3543$",
      "$0.6$"
    ],
    "explanationEn": "The complement of \"at least one\" is \"none at all\", which is far quicker: $P(X \\geq 1) = 1 - P(X = 0) = 1 - (1 - 0.1)^{6} = 1 - 0.5314 = 0.4686$. Summing $P(X=1) + P(X=2) + \\cdots + P(X=6)$ instead means $6$ separate terms, slower and easy to leave one out. The first distractor gives $P(X = 0)$, the complement rather than the answer. The second gives only $P(X = 1)$ — \"at least one\" also covers two, three and so on up to $6$. The third gives the expectation $np$, which counts occurrences rather than probability and can exceed $1$, ruling it out on that ground alone.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "m1_rep_0094",
    "type": "mc",
    "subject": "m1",
    "topic": "binomial_distribution",
    "topicZh": "二項分佈",
    "topicEn": "Binomial Distribution",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "medium",
    "year": 0,
    "content": "設 $X \\sim B(3, 0.4)$。求 $P(X \\geq 1)$。",
    "explanation": "「至少一次」的反面是「一次也沒有」，用補集算最快：$P(X \\geq 1) = 1 - P(X = 0) = 1 - (1 - 0.4)^{3} = 1 - 0.216 = 0.784$。若逐項相加 $P(X=1) + P(X=2) + \\cdots + P(X=3)$，要算 $3$ 項，既慢又易漏。第一個干擾項答了 $P(X = 0)$ 本身，即補集而非題目所問。第二項只算了 $P(X = 1)$ —— 「至少一次」包括一次、兩次…以至 $3$ 次，不止一次。第三項答了期望值 $np$，那是次數不是概率，而且可以大過 $1$，僅憑這一點就應該排除。",
    "options": [
      "$1.2$",
      "$0.784$",
      "$0.216$",
      "$0.432$"
    ],
    "correctIndex": 1,
    "marks": 1,
    "contentEn": "Let $X \\sim B(3, 0.4)$. Find $P(X \\geq 1)$.",
    "optionsEn": [
      "$1.2$",
      "$0.784$",
      "$0.216$",
      "$0.432$"
    ],
    "explanationEn": "The complement of \"at least one\" is \"none at all\", which is far quicker: $P(X \\geq 1) = 1 - P(X = 0) = 1 - (1 - 0.4)^{3} = 1 - 0.216 = 0.784$. Summing $P(X=1) + P(X=2) + \\cdots + P(X=3)$ instead means $3$ separate terms, slower and easy to leave one out. The first distractor gives $P(X = 0)$, the complement rather than the answer. The second gives only $P(X = 1)$ — \"at least one\" also covers two, three and so on up to $3$. The third gives the expectation $np$, which counts occurrences rather than probability and can exceed $1$, ruling it out on that ground alone.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "m1_rep_0099",
    "type": "mc",
    "subject": "m1",
    "topic": "statistics_inference",
    "topicZh": "統計推斷",
    "topicEn": "Statistical Inference",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "某總體的標準差為 $12$。現從中隨機抽取一個大小為 $36$ 的樣本。\n\n求樣本平均數的標準差（標準誤）。",
    "explanation": "樣本平均數的標準差為 $\\dfrac{\\sigma}{\\sqrt{n}} = \\dfrac{12}{\\sqrt{36}} = \\dfrac{12}{6} = 2$。意義是：樣本越大，樣本平均數就越集中在總體平均值附近，故標準誤越細 —— 但它隨【樣本量的平方根】下降，不是隨樣本量本身下降，所以樣本量要加大四倍，標準誤才減半。第一個干擾項照抄總體標準差，忽略了抽樣會令平均數的波動變細。第二項除以 $n$ 而非 $\\sqrt{n}$，令標準誤下降得太快。第三項把除號當成乘號，方向完全相反 —— 樣本越大反而波動越大，明顯不合理。",
    "options": [
      "$0.3333$",
      "$72$",
      "$2$",
      "$12$"
    ],
    "correctIndex": 2,
    "marks": 1,
    "contentEn": "A population has standard deviation $12$. A random sample of size $36$ is drawn.\n\nFind the standard deviation of the sample mean (the standard error).",
    "optionsEn": [
      "$0.3333$",
      "$72$",
      "$2$",
      "$12$"
    ],
    "explanationEn": "The standard deviation of the sample mean is $\\dfrac{\\sigma}{\\sqrt{n}} = \\dfrac{12}{\\sqrt{36}} = \\dfrac{12}{6} = 2$. The meaning: larger samples cluster more tightly around the population mean, so the standard error shrinks — but it shrinks with the *square root* of the sample size, not the size itself, so quadrupling the sample only halves the standard error. The first distractor reuses the population standard deviation and ignores that averaging reduces variability. The second divides by $n$ rather than $\\sqrt{n}$, shrinking it far too fast. The third multiplies instead of dividing, which would make larger samples *more* variable — clearly wrong.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "m1_rep_0100",
    "type": "mc",
    "subject": "m1",
    "topic": "statistics_inference",
    "topicZh": "統計推斷",
    "topicEn": "Statistical Inference",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "某總體的標準差為 $20$。現從中隨機抽取一個大小為 $100$ 的樣本。\n\n求樣本平均數的標準差（標準誤）。",
    "explanation": "樣本平均數的標準差為 $\\dfrac{\\sigma}{\\sqrt{n}} = \\dfrac{20}{\\sqrt{100}} = \\dfrac{20}{10} = 2$。意義是：樣本越大，樣本平均數就越集中在總體平均值附近，故標準誤越細 —— 但它隨【樣本量的平方根】下降，不是隨樣本量本身下降，所以樣本量要加大四倍，標準誤才減半。第一個干擾項照抄總體標準差，忽略了抽樣會令平均數的波動變細。第二項除以 $n$ 而非 $\\sqrt{n}$，令標準誤下降得太快。第三項把除號當成乘號，方向完全相反 —— 樣本越大反而波動越大，明顯不合理。",
    "options": [
      "$20$",
      "$0.2$",
      "$200$",
      "$2$"
    ],
    "correctIndex": 3,
    "marks": 1,
    "contentEn": "A population has standard deviation $20$. A random sample of size $100$ is drawn.\n\nFind the standard deviation of the sample mean (the standard error).",
    "optionsEn": [
      "$20$",
      "$0.2$",
      "$200$",
      "$2$"
    ],
    "explanationEn": "The standard deviation of the sample mean is $\\dfrac{\\sigma}{\\sqrt{n}} = \\dfrac{20}{\\sqrt{100}} = \\dfrac{20}{10} = 2$. The meaning: larger samples cluster more tightly around the population mean, so the standard error shrinks — but it shrinks with the *square root* of the sample size, not the size itself, so quadrupling the sample only halves the standard error. The first distractor reuses the population standard deviation and ignores that averaging reduces variability. The second divides by $n$ rather than $\\sqrt{n}$, shrinking it far too fast. The third multiplies instead of dividing, which would make larger samples *more* variable — clearly wrong.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "m1_rep_0101",
    "type": "mc",
    "subject": "m1",
    "topic": "statistics_inference",
    "topicZh": "統計推斷",
    "topicEn": "Statistical Inference",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "某總體的標準差為 $15$。現從中隨機抽取一個大小為 $25$ 的樣本。\n\n求樣本平均數的標準差（標準誤）。",
    "explanation": "樣本平均數的標準差為 $\\dfrac{\\sigma}{\\sqrt{n}} = \\dfrac{15}{\\sqrt{25}} = \\dfrac{15}{5} = 3$。意義是：樣本越大，樣本平均數就越集中在總體平均值附近，故標準誤越細 —— 但它隨【樣本量的平方根】下降，不是隨樣本量本身下降，所以樣本量要加大四倍，標準誤才減半。第一個干擾項照抄總體標準差，忽略了抽樣會令平均數的波動變細。第二項除以 $n$ 而非 $\\sqrt{n}$，令標準誤下降得太快。第三項把除號當成乘號，方向完全相反 —— 樣本越大反而波動越大，明顯不合理。",
    "options": [
      "$3$",
      "$15$",
      "$0.6$",
      "$75$"
    ],
    "correctIndex": 0,
    "marks": 1,
    "contentEn": "A population has standard deviation $15$. A random sample of size $25$ is drawn.\n\nFind the standard deviation of the sample mean (the standard error).",
    "optionsEn": [
      "$3$",
      "$15$",
      "$0.6$",
      "$75$"
    ],
    "explanationEn": "The standard deviation of the sample mean is $\\dfrac{\\sigma}{\\sqrt{n}} = \\dfrac{15}{\\sqrt{25}} = \\dfrac{15}{5} = 3$. The meaning: larger samples cluster more tightly around the population mean, so the standard error shrinks — but it shrinks with the *square root* of the sample size, not the size itself, so quadrupling the sample only halves the standard error. The first distractor reuses the population standard deviation and ignores that averaging reduces variability. The second divides by $n$ rather than $\\sqrt{n}$, shrinking it far too fast. The third multiplies instead of dividing, which would make larger samples *more* variable — clearly wrong.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "m1_rep_0102",
    "type": "mc",
    "subject": "m1",
    "topic": "statistics_inference",
    "topicZh": "統計推斷",
    "topicEn": "Statistical Inference",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "某總體的標準差為 $8$。現從中隨機抽取一個大小為 $64$ 的樣本。\n\n求樣本平均數的標準差（標準誤）。",
    "explanation": "樣本平均數的標準差為 $\\dfrac{\\sigma}{\\sqrt{n}} = \\dfrac{8}{\\sqrt{64}} = \\dfrac{8}{8} = 1$。意義是：樣本越大，樣本平均數就越集中在總體平均值附近，故標準誤越細 —— 但它隨【樣本量的平方根】下降，不是隨樣本量本身下降，所以樣本量要加大四倍，標準誤才減半。第一個干擾項照抄總體標準差，忽略了抽樣會令平均數的波動變細。第二項除以 $n$ 而非 $\\sqrt{n}$，令標準誤下降得太快。第三項把除號當成乘號，方向完全相反 —— 樣本越大反而波動越大，明顯不合理。",
    "options": [
      "$64$",
      "$1$",
      "$8$",
      "$0.125$"
    ],
    "correctIndex": 1,
    "marks": 1,
    "contentEn": "A population has standard deviation $8$. A random sample of size $64$ is drawn.\n\nFind the standard deviation of the sample mean (the standard error).",
    "optionsEn": [
      "$64$",
      "$1$",
      "$8$",
      "$0.125$"
    ],
    "explanationEn": "The standard deviation of the sample mean is $\\dfrac{\\sigma}{\\sqrt{n}} = \\dfrac{8}{\\sqrt{64}} = \\dfrac{8}{8} = 1$. The meaning: larger samples cluster more tightly around the population mean, so the standard error shrinks — but it shrinks with the *square root* of the sample size, not the size itself, so quadrupling the sample only halves the standard error. The first distractor reuses the population standard deviation and ignores that averaging reduces variability. The second divides by $n$ rather than $\\sqrt{n}$, shrinking it far too fast. The third multiplies instead of dividing, which would make larger samples *more* variable — clearly wrong.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "m1_rep_0095",
    "type": "mc",
    "subject": "m1",
    "topic": "binomial",
    "topicZh": "二項式定理",
    "topicEn": "Binomial Theorem",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "medium",
    "year": 0,
    "content": "求 $(2x + 1)^{4}$ 展開式中【所有係數之和】。",
    "explanation": "展開式是一條【恆等式】，對任何 $x$ 都成立。把每一項寫成 $c_k x^{k}$，代入 $x = 1$ 之後每個 $x^{k}$ 都變成 $1$，剩下的正好就是所有係數之和。故只需代 $x = 1$：$(2 \\times 1 + 1)^{4} = 3^{4} = 81$ —— 完全不需展開。第一個干擾項 $17$ 把指數分別作用到兩項之上，但 $(u+v)^{4} \\neq u^{4} + v^{4}$，這是代數上最常見的錯誤展開。$16$ 是 $(1+x)^{4}$ 的係數之和，套錯了公式 —— 只有當兩項都是 $1$ 時才等於 $2^{4}$。$12$ 把乘方誤作乘法。",
    "options": [
      "$16$",
      "$12$",
      "$81$",
      "$17$"
    ],
    "correctIndex": 2,
    "marks": 1,
    "contentEn": "Find the sum of *all* the coefficients in the expansion of $(2x + 1)^{4}$.",
    "optionsEn": [
      "$16$",
      "$12$",
      "$81$",
      "$17$"
    ],
    "explanationEn": "A binomial expansion is an *identity*, valid for every $x$. Writing each term as $c_k x^{k}$ and substituting $x = 1$ turns every $x^{k}$ into $1$, leaving exactly the sum of the coefficients. So simply put $x = 1$: $(2 \\times 1 + 1)^{4} = 3^{4} = 81$ — no expansion needed at all. The first distractor, $17$, applies the power to each term separately, but $(u+v)^{4} \\neq u^{4} + v^{4}$ — the commonest false expansion in algebra. $16$ is the coefficient sum for $(1+x)^{4}$, a formula that holds only when both terms are $1$. $12$ mistakes exponentiation for multiplication.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "m1_rep_0096",
    "type": "mc",
    "subject": "m1",
    "topic": "binomial",
    "topicZh": "二項式定理",
    "topicEn": "Binomial Theorem",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "medium",
    "year": 0,
    "content": "求 $(2x + 5)^{3}$ 展開式中【所有係數之和】。",
    "explanation": "展開式是一條【恆等式】，對任何 $x$ 都成立。把每一項寫成 $c_k x^{k}$，代入 $x = 1$ 之後每個 $x^{k}$ 都變成 $1$，剩下的正好就是所有係數之和。故只需代 $x = 1$：$(2 \\times 1 + 5)^{3} = 7^{3} = 343$ —— 完全不需展開。第一個干擾項 $133$ 把指數分別作用到兩項之上，但 $(u+v)^{3} \\neq u^{3} + v^{3}$，這是代數上最常見的錯誤展開。$8$ 是 $(1+x)^{3}$ 的係數之和，套錯了公式 —— 只有當兩項都是 $1$ 時才等於 $2^{3}$。$21$ 把乘方誤作乘法。",
    "options": [
      "$133$",
      "$8$",
      "$21$",
      "$343$"
    ],
    "correctIndex": 3,
    "marks": 1,
    "contentEn": "Find the sum of *all* the coefficients in the expansion of $(2x + 5)^{3}$.",
    "optionsEn": [
      "$133$",
      "$8$",
      "$21$",
      "$343$"
    ],
    "explanationEn": "A binomial expansion is an *identity*, valid for every $x$. Writing each term as $c_k x^{k}$ and substituting $x = 1$ turns every $x^{k}$ into $1$, leaving exactly the sum of the coefficients. So simply put $x = 1$: $(2 \\times 1 + 5)^{3} = 7^{3} = 343$ — no expansion needed at all. The first distractor, $133$, applies the power to each term separately, but $(u+v)^{3} \\neq u^{3} + v^{3}$ — the commonest false expansion in algebra. $8$ is the coefficient sum for $(1+x)^{3}$, a formula that holds only when both terms are $1$. $21$ mistakes exponentiation for multiplication.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "m1_rep_0097",
    "type": "mc",
    "subject": "m1",
    "topic": "binomial",
    "topicZh": "二項式定理",
    "topicEn": "Binomial Theorem",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "medium",
    "year": 0,
    "content": "求 $(3x + 2)^{3}$ 展開式中【所有係數之和】。",
    "explanation": "展開式是一條【恆等式】，對任何 $x$ 都成立。把每一項寫成 $c_k x^{k}$，代入 $x = 1$ 之後每個 $x^{k}$ 都變成 $1$，剩下的正好就是所有係數之和。故只需代 $x = 1$：$(3 \\times 1 + 2)^{3} = 5^{3} = 125$ —— 完全不需展開。第一個干擾項 $35$ 把指數分別作用到兩項之上，但 $(u+v)^{3} \\neq u^{3} + v^{3}$，這是代數上最常見的錯誤展開。$8$ 是 $(1+x)^{3}$ 的係數之和，套錯了公式 —— 只有當兩項都是 $1$ 時才等於 $2^{3}$。$15$ 把乘方誤作乘法。",
    "options": [
      "$125$",
      "$35$",
      "$8$",
      "$15$"
    ],
    "correctIndex": 0,
    "marks": 1,
    "contentEn": "Find the sum of *all* the coefficients in the expansion of $(3x + 2)^{3}$.",
    "optionsEn": [
      "$125$",
      "$35$",
      "$8$",
      "$15$"
    ],
    "explanationEn": "A binomial expansion is an *identity*, valid for every $x$. Writing each term as $c_k x^{k}$ and substituting $x = 1$ turns every $x^{k}$ into $1$, leaving exactly the sum of the coefficients. So simply put $x = 1$: $(3 \\times 1 + 2)^{3} = 5^{3} = 125$ — no expansion needed at all. The first distractor, $35$, applies the power to each term separately, but $(u+v)^{3} \\neq u^{3} + v^{3}$ — the commonest false expansion in algebra. $8$ is the coefficient sum for $(1+x)^{3}$, a formula that holds only when both terms are $1$. $15$ mistakes exponentiation for multiplication.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "m1_rep_0098",
    "type": "mc",
    "subject": "m1",
    "topic": "binomial",
    "topicZh": "二項式定理",
    "topicEn": "Binomial Theorem",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "medium",
    "year": 0,
    "content": "求 $(2x + 3)^{4}$ 展開式中【所有係數之和】。",
    "explanation": "展開式是一條【恆等式】，對任何 $x$ 都成立。把每一項寫成 $c_k x^{k}$，代入 $x = 1$ 之後每個 $x^{k}$ 都變成 $1$，剩下的正好就是所有係數之和。故只需代 $x = 1$：$(2 \\times 1 + 3)^{4} = 5^{4} = 625$ —— 完全不需展開。第一個干擾項 $97$ 把指數分別作用到兩項之上，但 $(u+v)^{4} \\neq u^{4} + v^{4}$，這是代數上最常見的錯誤展開。$16$ 是 $(1+x)^{4}$ 的係數之和，套錯了公式 —— 只有當兩項都是 $1$ 時才等於 $2^{4}$。$20$ 把乘方誤作乘法。",
    "options": [
      "$20$",
      "$625$",
      "$97$",
      "$16$"
    ],
    "correctIndex": 1,
    "marks": 1,
    "contentEn": "Find the sum of *all* the coefficients in the expansion of $(2x + 3)^{4}$.",
    "optionsEn": [
      "$20$",
      "$625$",
      "$97$",
      "$16$"
    ],
    "explanationEn": "A binomial expansion is an *identity*, valid for every $x$. Writing each term as $c_k x^{k}$ and substituting $x = 1$ turns every $x^{k}$ into $1$, leaving exactly the sum of the coefficients. So simply put $x = 1$: $(2 \\times 1 + 3)^{4} = 5^{4} = 625$ — no expansion needed at all. The first distractor, $97$, applies the power to each term separately, but $(u+v)^{4} \\neq u^{4} + v^{4}$ — the commonest false expansion in algebra. $16$ is the coefficient sum for $(1+x)^{4}$, a formula that holds only when both terms are $1$. $20$ mistakes exponentiation for multiplication.",
    "frameworkEn": "Auto-gated"
  }
]
