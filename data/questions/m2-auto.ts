// AUTO-GATED question bank —— 由 scripts/qbank/auto-promote.mts 自動入庫。
// 【本檔題目未經真人逐題審批。】機器只能檢驗客觀項目：格式、選項、術語紅線、
// LaTeX、與現有題庫的重複度、topic id 是否已註冊。答案在學術上是否正確，
// 並不在此閘的能力範圍之內 —— 故出題端必須 correct-by-construction，或引用
// 可查證的原文。前端 QuestionProvenance 會如實向學生顯示
// 「經自動檢查 …本題未有實名逐題審批紀錄」。
//   subject  : m2
//   count    : 68  (easy 41 / medium 27 / hard 0)
//   types    : mc 68 / text 0 / long 0
//   updated  : 2026-08-22
// 請勿手動編輯 —— 修改將於下次執行 auto-promote 時被覆寫。
import type { Question } from './types'

export const m2AutoQuestions: Question[] = [
  {
    "id": "m2_rep_0001",
    "type": "mc",
    "subject": "m2",
    "topic": "matrices",
    "topicZh": "矩陣與行列式",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "設 $A = \\begin{pmatrix} 2 & 3 \\\\ 4 & k \\end{pmatrix}$。求 $k$ 的值，使 $A$ 【沒有】逆矩陣。",
    "explanation": "一個 $2 \\times 2$ 矩陣沒有逆矩陣，當且僅當其行列式為零。$\\det A = 2k - (3)(4) = 2k - 12$，令其為 $0$ 得 $k = 6$。要留意題目問的是【沒有】逆矩陣，即要令行列式等於零；若看漏了否定字眼而去求「有逆矩陣」的條件，答案便會變成一個範圍（$k \\neq 6$）而非單一數值 —— 選項全部是單一數值，本身已經提示了題目要的是使行列式歸零的那一點。第一個干擾項漏了符號，其餘兩項把矩陣元素的位置對調。",
    "options": [
      "$k = 6$",
      "$k = -6$",
      "$k = 5$",
      "$k = 1.5$"
    ],
    "correctIndex": 0,
    "marks": 1,
    "contentEn": "Let $A = \\begin{pmatrix} 2 & 3 \\\\ 4 & k \\end{pmatrix}$. Find $k$ such that $A$ has *no* inverse.",
    "optionsEn": [
      "$k = 6$",
      "$k = -6$",
      "$k = 5$",
      "$k = 1.5$"
    ],
    "explanationEn": "A $2 \\times 2$ matrix has no inverse exactly when its determinant is zero. $\\det A = 2k - (3)(4) = 2k - 12$; setting this to $0$ gives $k = 6$. Note the question asks when the inverse does *not* exist, i.e. when the determinant vanishes. Missing the negative would turn the answer into a range ($k \\neq 6$) rather than a single value — and since every option is a single value, that in itself signals which condition is wanted. The first distractor drops a sign; the other two swap the positions of the entries.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "m2_rep_0002",
    "type": "mc",
    "subject": "m2",
    "topic": "matrices",
    "topicZh": "矩陣與行列式",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "設 $A = \\begin{pmatrix} 1 & 5 \\\\ 2 & k \\end{pmatrix}$。求 $k$ 的值，使 $A$ 【沒有】逆矩陣。",
    "explanation": "一個 $2 \\times 2$ 矩陣沒有逆矩陣，當且僅當其行列式為零。$\\det A = 1k - (5)(2) = 1k - 10$，令其為 $0$ 得 $k = 10$。要留意題目問的是【沒有】逆矩陣，即要令行列式等於零；若看漏了否定字眼而去求「有逆矩陣」的條件，答案便會變成一個範圍（$k \\neq 10$）而非單一數值 —— 選項全部是單一數值，本身已經提示了題目要的是使行列式歸零的那一點。第一個干擾項漏了符號，其餘兩項把矩陣元素的位置對調。",
    "options": [
      "$k = 2.5$",
      "$k = 10$",
      "$k = -10$",
      "$k = -3$"
    ],
    "correctIndex": 1,
    "marks": 1,
    "contentEn": "Let $A = \\begin{pmatrix} 1 & 5 \\\\ 2 & k \\end{pmatrix}$. Find $k$ such that $A$ has *no* inverse.",
    "optionsEn": [
      "$k = 2.5$",
      "$k = 10$",
      "$k = -10$",
      "$k = -3$"
    ],
    "explanationEn": "A $2 \\times 2$ matrix has no inverse exactly when its determinant is zero. $\\det A = 1k - (5)(2) = 1k - 10$; setting this to $0$ gives $k = 10$. Note the question asks when the inverse does *not* exist, i.e. when the determinant vanishes. Missing the negative would turn the answer into a range ($k \\neq 10$) rather than a single value — and since every option is a single value, that in itself signals which condition is wanted. The first distractor drops a sign; the other two swap the positions of the entries.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "m2_rep_0003",
    "type": "mc",
    "subject": "m2",
    "topic": "matrices",
    "topicZh": "矩陣與行列式",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "設 $A = \\begin{pmatrix} 3 & 2 \\\\ 6 & k \\end{pmatrix}$。求 $k$ 的值，使 $A$ 【沒有】逆矩陣。",
    "explanation": "一個 $2 \\times 2$ 矩陣沒有逆矩陣，當且僅當其行列式為零。$\\det A = 3k - (2)(6) = 3k - 12$，令其為 $0$ 得 $k = 4$。要留意題目問的是【沒有】逆矩陣，即要令行列式等於零；若看漏了否定字眼而去求「有逆矩陣」的條件，答案便會變成一個範圍（$k \\neq 4$）而非單一數值 —— 選項全部是單一數值，本身已經提示了題目要的是使行列式歸零的那一點。第一個干擾項漏了符號，其餘兩項把矩陣元素的位置對調。",
    "options": [
      "$k = 16$",
      "$k = 1$",
      "$k = 4$",
      "$k = -4$"
    ],
    "correctIndex": 2,
    "marks": 1,
    "contentEn": "Let $A = \\begin{pmatrix} 3 & 2 \\\\ 6 & k \\end{pmatrix}$. Find $k$ such that $A$ has *no* inverse.",
    "optionsEn": [
      "$k = 16$",
      "$k = 1$",
      "$k = 4$",
      "$k = -4$"
    ],
    "explanationEn": "A $2 \\times 2$ matrix has no inverse exactly when its determinant is zero. $\\det A = 3k - (2)(6) = 3k - 12$; setting this to $0$ gives $k = 4$. Note the question asks when the inverse does *not* exist, i.e. when the determinant vanishes. Missing the negative would turn the answer into a range ($k \\neq 4$) rather than a single value — and since every option is a single value, that in itself signals which condition is wanted. The first distractor drops a sign; the other two swap the positions of the entries.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "m2_rep_0004",
    "type": "mc",
    "subject": "m2",
    "topic": "matrices",
    "topicZh": "矩陣與行列式",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "設 $A = \\begin{pmatrix} 4 & 1 \\\\ 8 & k \\end{pmatrix}$。求 $k$ 的值，使 $A$ 【沒有】逆矩陣。",
    "explanation": "一個 $2 \\times 2$ 矩陣沒有逆矩陣，當且僅當其行列式為零。$\\det A = 4k - (1)(8) = 4k - 8$，令其為 $0$ 得 $k = 2$。要留意題目問的是【沒有】逆矩陣，即要令行列式等於零；若看漏了否定字眼而去求「有逆矩陣」的條件，答案便會變成一個範圍（$k \\neq 2$）而非單一數值 —— 選項全部是單一數值，本身已經提示了題目要的是使行列式歸零的那一點。第一個干擾項漏了符號，其餘兩項把矩陣元素的位置對調。",
    "options": [
      "$k = -2$",
      "$k = 31$",
      "$k = 0.5$",
      "$k = 2$"
    ],
    "correctIndex": 3,
    "marks": 1,
    "contentEn": "Let $A = \\begin{pmatrix} 4 & 1 \\\\ 8 & k \\end{pmatrix}$. Find $k$ such that $A$ has *no* inverse.",
    "optionsEn": [
      "$k = -2$",
      "$k = 31$",
      "$k = 0.5$",
      "$k = 2$"
    ],
    "explanationEn": "A $2 \\times 2$ matrix has no inverse exactly when its determinant is zero. $\\det A = 4k - (1)(8) = 4k - 8$; setting this to $0$ gives $k = 2$. Note the question asks when the inverse does *not* exist, i.e. when the determinant vanishes. Missing the negative would turn the answer into a range ($k \\neq 2$) rather than a single value — and since every option is a single value, that in itself signals which condition is wanted. The first distractor drops a sign; the other two swap the positions of the entries.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "m2_rep_0005",
    "type": "mc",
    "subject": "m2",
    "topic": "matrices",
    "topicZh": "矩陣與行列式",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "設 $A = \\begin{pmatrix} 5 & 3 \\\\ 10 & k \\end{pmatrix}$。求 $k$ 的值，使 $A$ 【沒有】逆矩陣。",
    "explanation": "一個 $2 \\times 2$ 矩陣沒有逆矩陣，當且僅當其行列式為零。$\\det A = 5k - (3)(10) = 5k - 30$，令其為 $0$ 得 $k = 6$。要留意題目問的是【沒有】逆矩陣，即要令行列式等於零；若看漏了否定字眼而去求「有逆矩陣」的條件，答案便會變成一個範圍（$k \\neq 6$）而非單一數值 —— 選項全部是單一數值，本身已經提示了題目要的是使行列式歸零的那一點。第一個干擾項漏了符號，其餘兩項把矩陣元素的位置對調。",
    "options": [
      "$k = 6$",
      "$k = -6$",
      "$k = 47$",
      "$k = 1.5$"
    ],
    "correctIndex": 0,
    "marks": 1,
    "contentEn": "Let $A = \\begin{pmatrix} 5 & 3 \\\\ 10 & k \\end{pmatrix}$. Find $k$ such that $A$ has *no* inverse.",
    "optionsEn": [
      "$k = 6$",
      "$k = -6$",
      "$k = 47$",
      "$k = 1.5$"
    ],
    "explanationEn": "A $2 \\times 2$ matrix has no inverse exactly when its determinant is zero. $\\det A = 5k - (3)(10) = 5k - 30$; setting this to $0$ gives $k = 6$. Note the question asks when the inverse does *not* exist, i.e. when the determinant vanishes. Missing the negative would turn the answer into a range ($k \\neq 6$) rather than a single value — and since every option is a single value, that in itself signals which condition is wanted. The first distractor drops a sign; the other two swap the positions of the entries.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "m2_rep_0006",
    "type": "mc",
    "subject": "m2",
    "topic": "matrices",
    "topicZh": "矩陣與行列式",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "設 $A = \\begin{pmatrix} 2 & 7 \\\\ 3 & k \\end{pmatrix}$。求 $k$ 的值，使 $A$ 【沒有】逆矩陣。",
    "explanation": "一個 $2 \\times 2$ 矩陣沒有逆矩陣，當且僅當其行列式為零。$\\det A = 2k - (7)(3) = 2k - 21$，令其為 $0$ 得 $k = 10.5$。要留意題目問的是【沒有】逆矩陣，即要令行列式等於零；若看漏了否定字眼而去求「有逆矩陣」的條件，答案便會變成一個範圍（$k \\neq 10.5$）而非單一數值 —— 選項全部是單一數值，本身已經提示了題目要的是使行列式歸零的那一點。第一個干擾項漏了符號，其餘兩項把矩陣元素的位置對調。",
    "options": [
      "$k = 4.6667$",
      "$k = 10.5$",
      "$k = -10.5$",
      "$k = -1$"
    ],
    "correctIndex": 1,
    "marks": 1,
    "contentEn": "Let $A = \\begin{pmatrix} 2 & 7 \\\\ 3 & k \\end{pmatrix}$. Find $k$ such that $A$ has *no* inverse.",
    "optionsEn": [
      "$k = 4.6667$",
      "$k = 10.5$",
      "$k = -10.5$",
      "$k = -1$"
    ],
    "explanationEn": "A $2 \\times 2$ matrix has no inverse exactly when its determinant is zero. $\\det A = 2k - (7)(3) = 2k - 21$; setting this to $0$ gives $k = 10.5$. Note the question asks when the inverse does *not* exist, i.e. when the determinant vanishes. Missing the negative would turn the answer into a range ($k \\neq 10.5$) rather than a single value — and since every option is a single value, that in itself signals which condition is wanted. The first distractor drops a sign; the other two swap the positions of the entries.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "m2_rep_0007",
    "type": "mc",
    "subject": "m2",
    "topic": "matrices",
    "topicZh": "矩陣與行列式",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "設 $A = \\begin{pmatrix} 1 & 2 \\\\ 3 & 4 \\end{pmatrix}$。求 $3A$。",
    "explanation": "純量乘法要把該數乘以矩陣的【每一個】元素，故 $3A = \\begin{pmatrix} 3 & 6 \\\\ 9 & 12 \\end{pmatrix}$。第一個干擾項只乘了主對角線，是把純量乘法同「乘以單位矩陣的倍數」混淆了 —— 後者才只影響對角線。第二個把乘法做成了加法。第三個乘對了每個元素，但同時把矩陣轉置了：$3A$ 不會改變元素的位置，只改變它們的大小。純量乘法的結果，行列數必定同原矩陣一樣。",
    "options": [
      "$\\begin{pmatrix} 4 & 5 \\\\ 6 & 7 \\end{pmatrix}$",
      "$\\begin{pmatrix} 3 & 9 \\\\ 6 & 12 \\end{pmatrix}$",
      "$\\begin{pmatrix} 3 & 6 \\\\ 9 & 12 \\end{pmatrix}$",
      "$\\begin{pmatrix} 3 & 2 \\\\ 3 & 12 \\end{pmatrix}$"
    ],
    "correctIndex": 2,
    "marks": 1,
    "contentEn": "Let $A = \\begin{pmatrix} 1 & 2 \\\\ 3 & 4 \\end{pmatrix}$. Find $3A$.",
    "optionsEn": [
      "$\\begin{pmatrix} 4 & 5 \\\\ 6 & 7 \\end{pmatrix}$",
      "$\\begin{pmatrix} 3 & 9 \\\\ 6 & 12 \\end{pmatrix}$",
      "$\\begin{pmatrix} 3 & 6 \\\\ 9 & 12 \\end{pmatrix}$",
      "$\\begin{pmatrix} 3 & 2 \\\\ 3 & 12 \\end{pmatrix}$"
    ],
    "explanationEn": "Scalar multiplication multiplies *every* entry, so $3A = \\begin{pmatrix} 3 & 6 \\\\ 9 & 12 \\end{pmatrix}$. The first distractor scales only the leading diagonal, confusing scalar multiplication with multiplying by a multiple of the identity matrix, which is what affects the diagonal alone. The second adds instead of multiplying. The third scales every entry correctly but also transposes the matrix: $3A$ changes the size of the entries, never their positions. The result always has the same dimensions as the original.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "m2_rep_0008",
    "type": "mc",
    "subject": "m2",
    "topic": "matrices",
    "topicZh": "矩陣與行列式",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "設 $A = \\begin{pmatrix} 2 & 0 \\\\ 1 & 5 \\end{pmatrix}$。求 $4A$。",
    "explanation": "純量乘法要把該數乘以矩陣的【每一個】元素，故 $4A = \\begin{pmatrix} 8 & 0 \\\\ 4 & 20 \\end{pmatrix}$。第一個干擾項只乘了主對角線，是把純量乘法同「乘以單位矩陣的倍數」混淆了 —— 後者才只影響對角線。第二個把乘法做成了加法。第三個乘對了每個元素，但同時把矩陣轉置了：$4A$ 不會改變元素的位置，只改變它們的大小。純量乘法的結果，行列數必定同原矩陣一樣。",
    "options": [
      "$\\begin{pmatrix} 8 & 0 \\\\ 1 & 20 \\end{pmatrix}$",
      "$\\begin{pmatrix} 6 & 4 \\\\ 5 & 9 \\end{pmatrix}$",
      "$\\begin{pmatrix} 8 & 4 \\\\ 0 & 20 \\end{pmatrix}$",
      "$\\begin{pmatrix} 8 & 0 \\\\ 4 & 20 \\end{pmatrix}$"
    ],
    "correctIndex": 3,
    "marks": 1,
    "contentEn": "Let $A = \\begin{pmatrix} 2 & 0 \\\\ 1 & 5 \\end{pmatrix}$. Find $4A$.",
    "optionsEn": [
      "$\\begin{pmatrix} 8 & 0 \\\\ 1 & 20 \\end{pmatrix}$",
      "$\\begin{pmatrix} 6 & 4 \\\\ 5 & 9 \\end{pmatrix}$",
      "$\\begin{pmatrix} 8 & 4 \\\\ 0 & 20 \\end{pmatrix}$",
      "$\\begin{pmatrix} 8 & 0 \\\\ 4 & 20 \\end{pmatrix}$"
    ],
    "explanationEn": "Scalar multiplication multiplies *every* entry, so $4A = \\begin{pmatrix} 8 & 0 \\\\ 4 & 20 \\end{pmatrix}$. The first distractor scales only the leading diagonal, confusing scalar multiplication with multiplying by a multiple of the identity matrix, which is what affects the diagonal alone. The second adds instead of multiplying. The third scales every entry correctly but also transposes the matrix: $4A$ changes the size of the entries, never their positions. The result always has the same dimensions as the original.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "m2_rep_0009",
    "type": "mc",
    "subject": "m2",
    "topic": "matrices",
    "topicZh": "矩陣與行列式",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "設 $A = \\begin{pmatrix} 3 & 1 \\\\ 2 & 2 \\end{pmatrix}$。求 $2A$。",
    "explanation": "純量乘法要把該數乘以矩陣的【每一個】元素，故 $2A = \\begin{pmatrix} 6 & 2 \\\\ 4 & 4 \\end{pmatrix}$。第一個干擾項只乘了主對角線，是把純量乘法同「乘以單位矩陣的倍數」混淆了 —— 後者才只影響對角線。第二個把乘法做成了加法。第三個乘對了每個元素，但同時把矩陣轉置了：$2A$ 不會改變元素的位置，只改變它們的大小。純量乘法的結果，行列數必定同原矩陣一樣。",
    "options": [
      "$\\begin{pmatrix} 6 & 2 \\\\ 4 & 4 \\end{pmatrix}$",
      "$\\begin{pmatrix} 6 & 1 \\\\ 2 & 4 \\end{pmatrix}$",
      "$\\begin{pmatrix} 5 & 3 \\\\ 4 & 4 \\end{pmatrix}$",
      "$\\begin{pmatrix} 6 & 4 \\\\ 2 & 4 \\end{pmatrix}$"
    ],
    "correctIndex": 0,
    "marks": 1,
    "contentEn": "Let $A = \\begin{pmatrix} 3 & 1 \\\\ 2 & 2 \\end{pmatrix}$. Find $2A$.",
    "optionsEn": [
      "$\\begin{pmatrix} 6 & 2 \\\\ 4 & 4 \\end{pmatrix}$",
      "$\\begin{pmatrix} 6 & 1 \\\\ 2 & 4 \\end{pmatrix}$",
      "$\\begin{pmatrix} 5 & 3 \\\\ 4 & 4 \\end{pmatrix}$",
      "$\\begin{pmatrix} 6 & 4 \\\\ 2 & 4 \\end{pmatrix}$"
    ],
    "explanationEn": "Scalar multiplication multiplies *every* entry, so $2A = \\begin{pmatrix} 6 & 2 \\\\ 4 & 4 \\end{pmatrix}$. The first distractor scales only the leading diagonal, confusing scalar multiplication with multiplying by a multiple of the identity matrix, which is what affects the diagonal alone. The second adds instead of multiplying. The third scales every entry correctly but also transposes the matrix: $2A$ changes the size of the entries, never their positions. The result always has the same dimensions as the original.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "m2_rep_0010",
    "type": "mc",
    "subject": "m2",
    "topic": "matrices",
    "topicZh": "矩陣與行列式",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "設 $A = \\begin{pmatrix} 5 & 2 \\\\ 0 & 3 \\end{pmatrix}$。求 $5A$。",
    "explanation": "純量乘法要把該數乘以矩陣的【每一個】元素，故 $5A = \\begin{pmatrix} 25 & 10 \\\\ 0 & 15 \\end{pmatrix}$。第一個干擾項只乘了主對角線，是把純量乘法同「乘以單位矩陣的倍數」混淆了 —— 後者才只影響對角線。第二個把乘法做成了加法。第三個乘對了每個元素，但同時把矩陣轉置了：$5A$ 不會改變元素的位置，只改變它們的大小。純量乘法的結果，行列數必定同原矩陣一樣。",
    "options": [
      "$\\begin{pmatrix} 25 & 0 \\\\ 10 & 15 \\end{pmatrix}$",
      "$\\begin{pmatrix} 25 & 10 \\\\ 0 & 15 \\end{pmatrix}$",
      "$\\begin{pmatrix} 25 & 2 \\\\ 0 & 15 \\end{pmatrix}$",
      "$\\begin{pmatrix} 10 & 7 \\\\ 5 & 8 \\end{pmatrix}$"
    ],
    "correctIndex": 1,
    "marks": 1,
    "contentEn": "Let $A = \\begin{pmatrix} 5 & 2 \\\\ 0 & 3 \\end{pmatrix}$. Find $5A$.",
    "optionsEn": [
      "$\\begin{pmatrix} 25 & 0 \\\\ 10 & 15 \\end{pmatrix}$",
      "$\\begin{pmatrix} 25 & 10 \\\\ 0 & 15 \\end{pmatrix}$",
      "$\\begin{pmatrix} 25 & 2 \\\\ 0 & 15 \\end{pmatrix}$",
      "$\\begin{pmatrix} 10 & 7 \\\\ 5 & 8 \\end{pmatrix}$"
    ],
    "explanationEn": "Scalar multiplication multiplies *every* entry, so $5A = \\begin{pmatrix} 25 & 10 \\\\ 0 & 15 \\end{pmatrix}$. The first distractor scales only the leading diagonal, confusing scalar multiplication with multiplying by a multiple of the identity matrix, which is what affects the diagonal alone. The second adds instead of multiplying. The third scales every entry correctly but also transposes the matrix: $5A$ changes the size of the entries, never their positions. The result always has the same dimensions as the original.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "m2_rep_0011",
    "type": "mc",
    "subject": "m2",
    "topic": "matrices",
    "topicZh": "矩陣與行列式",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "設 $A = \\begin{pmatrix} 1 & 4 \\\\ 6 & 1 \\end{pmatrix}$。求 $3A$。",
    "explanation": "純量乘法要把該數乘以矩陣的【每一個】元素，故 $3A = \\begin{pmatrix} 3 & 12 \\\\ 18 & 3 \\end{pmatrix}$。第一個干擾項只乘了主對角線，是把純量乘法同「乘以單位矩陣的倍數」混淆了 —— 後者才只影響對角線。第二個把乘法做成了加法。第三個乘對了每個元素，但同時把矩陣轉置了：$3A$ 不會改變元素的位置，只改變它們的大小。純量乘法的結果，行列數必定同原矩陣一樣。",
    "options": [
      "$\\begin{pmatrix} 4 & 7 \\\\ 9 & 4 \\end{pmatrix}$",
      "$\\begin{pmatrix} 3 & 18 \\\\ 12 & 3 \\end{pmatrix}$",
      "$\\begin{pmatrix} 3 & 12 \\\\ 18 & 3 \\end{pmatrix}$",
      "$\\begin{pmatrix} 3 & 4 \\\\ 6 & 3 \\end{pmatrix}$"
    ],
    "correctIndex": 2,
    "marks": 1,
    "contentEn": "Let $A = \\begin{pmatrix} 1 & 4 \\\\ 6 & 1 \\end{pmatrix}$. Find $3A$.",
    "optionsEn": [
      "$\\begin{pmatrix} 4 & 7 \\\\ 9 & 4 \\end{pmatrix}$",
      "$\\begin{pmatrix} 3 & 18 \\\\ 12 & 3 \\end{pmatrix}$",
      "$\\begin{pmatrix} 3 & 12 \\\\ 18 & 3 \\end{pmatrix}$",
      "$\\begin{pmatrix} 3 & 4 \\\\ 6 & 3 \\end{pmatrix}$"
    ],
    "explanationEn": "Scalar multiplication multiplies *every* entry, so $3A = \\begin{pmatrix} 3 & 12 \\\\ 18 & 3 \\end{pmatrix}$. The first distractor scales only the leading diagonal, confusing scalar multiplication with multiplying by a multiple of the identity matrix, which is what affects the diagonal alone. The second adds instead of multiplying. The third scales every entry correctly but also transposes the matrix: $3A$ changes the size of the entries, never their positions. The result always has the same dimensions as the original.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "m2_rep_0012",
    "type": "mc",
    "subject": "m2",
    "topic": "matrices",
    "topicZh": "矩陣與行列式",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "設 $A = \\begin{pmatrix} 4 & 3 \\\\ 2 & 6 \\end{pmatrix}$。求 $2A$。",
    "explanation": "純量乘法要把該數乘以矩陣的【每一個】元素，故 $2A = \\begin{pmatrix} 8 & 6 \\\\ 4 & 12 \\end{pmatrix}$。第一個干擾項只乘了主對角線，是把純量乘法同「乘以單位矩陣的倍數」混淆了 —— 後者才只影響對角線。第二個把乘法做成了加法。第三個乘對了每個元素，但同時把矩陣轉置了：$2A$ 不會改變元素的位置，只改變它們的大小。純量乘法的結果，行列數必定同原矩陣一樣。",
    "options": [
      "$\\begin{pmatrix} 8 & 3 \\\\ 2 & 12 \\end{pmatrix}$",
      "$\\begin{pmatrix} 6 & 5 \\\\ 4 & 8 \\end{pmatrix}$",
      "$\\begin{pmatrix} 8 & 4 \\\\ 6 & 12 \\end{pmatrix}$",
      "$\\begin{pmatrix} 8 & 6 \\\\ 4 & 12 \\end{pmatrix}$"
    ],
    "correctIndex": 3,
    "marks": 1,
    "contentEn": "Let $A = \\begin{pmatrix} 4 & 3 \\\\ 2 & 6 \\end{pmatrix}$. Find $2A$.",
    "optionsEn": [
      "$\\begin{pmatrix} 8 & 3 \\\\ 2 & 12 \\end{pmatrix}$",
      "$\\begin{pmatrix} 6 & 5 \\\\ 4 & 8 \\end{pmatrix}$",
      "$\\begin{pmatrix} 8 & 4 \\\\ 6 & 12 \\end{pmatrix}$",
      "$\\begin{pmatrix} 8 & 6 \\\\ 4 & 12 \\end{pmatrix}$"
    ],
    "explanationEn": "Scalar multiplication multiplies *every* entry, so $2A = \\begin{pmatrix} 8 & 6 \\\\ 4 & 12 \\end{pmatrix}$. The first distractor scales only the leading diagonal, confusing scalar multiplication with multiplying by a multiple of the identity matrix, which is what affects the diagonal alone. The second adds instead of multiplying. The third scales every entry correctly but also transposes the matrix: $2A$ changes the size of the entries, never their positions. The result always has the same dimensions as the original.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "m2_rep_0013",
    "type": "mc",
    "subject": "m2",
    "topic": "matrices",
    "topicZh": "矩陣與行列式",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "medium",
    "year": 0,
    "content": "設 $A$ 為 $2 \\times 3$ 矩陣，$B$ 為 $3 \\times 4$ 矩陣。關於乘積 $AB$ 與 $BA$，以下哪一項正確？",
    "explanation": "矩陣相乘的條件是：前者的【行數】要等於後者的【列數】。$A$ 為 $2 \\times 3$、$B$ 為 $3 \\times 4$，中間兩個數同為 $3$，故 $AB$ 有定義，結果取外面兩個數，即 $2 \\times 4$。至於 $BA$：$B$ 的行數為 $4$，$A$ 的列數為 $2$，$4 \\neq 2$，故 $BA$ 沒有定義。矩陣乘法【不符合交換律】，這是它同數字乘法最根本的分別，亦是本題的考點。",
    "options": [
      "$AB$ 為 $2 \\times 4$ 矩陣；$BA$ 沒有定義",
      "$AB$ 為 $3 \\times 3$ 矩陣；$BA$ 沒有定義",
      "$AB$ 與 $BA$ 都沒有定義",
      "$AB$ 為 $2 \\times 4$ 矩陣，且必定等於 $BA$"
    ],
    "correctIndex": 0,
    "marks": 1,
    "contentEn": "Let $A$ be a $2 \\times 3$ matrix and $B$ a $3 \\times 4$ matrix. Which statement about $AB$ and $BA$ is correct?",
    "optionsEn": [
      "$AB$ is $2 \\times 4$; $BA$ is undefined",
      "$AB$ is $3 \\times 3$; $BA$ is undefined",
      "Neither $AB$ nor $BA$ is defined",
      "$AB$ is $2 \\times 4$ and must equal $BA$"
    ],
    "explanationEn": "Two matrices can be multiplied when the *columns* of the first match the *rows* of the second. Here $A$ is $2 \\times 3$ and $B$ is $3 \\times 4$: the inner dimensions agree at $3$, so $AB$ exists and takes the outer dimensions, $2 \\times 4$. For $BA$, the columns of $B$ number $4$ and the rows of $A$ number $2$; $4 \\neq 2$, so $BA$ is undefined. Matrix multiplication is *not commutative*, which is its most basic departure from ordinary multiplication and the point being tested.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "m2_rep_0014",
    "type": "mc",
    "subject": "m2",
    "topic": "matrices",
    "topicZh": "矩陣與行列式",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "medium",
    "year": 0,
    "content": "設 $A$ 為 $3 \\times 2$ 矩陣，$B$ 為 $2 \\times 5$ 矩陣。關於乘積 $AB$ 與 $BA$，以下哪一項正確？",
    "explanation": "矩陣相乘的條件是：前者的【行數】要等於後者的【列數】。$A$ 為 $3 \\times 2$、$B$ 為 $2 \\times 5$，中間兩個數同為 $2$，故 $AB$ 有定義，結果取外面兩個數，即 $3 \\times 5$。至於 $BA$：$B$ 的行數為 $5$，$A$ 的列數為 $3$，$5 \\neq 3$，故 $BA$ 沒有定義。矩陣乘法【不符合交換律】，這是它同數字乘法最根本的分別，亦是本題的考點。",
    "options": [
      "$AB$ 為 $3 \\times 5$ 矩陣，且必定等於 $BA$",
      "$AB$ 為 $3 \\times 5$ 矩陣；$BA$ 沒有定義",
      "$AB$ 為 $2 \\times 2$ 矩陣；$BA$ 沒有定義",
      "$AB$ 與 $BA$ 都沒有定義"
    ],
    "correctIndex": 1,
    "marks": 1,
    "contentEn": "Let $A$ be a $3 \\times 2$ matrix and $B$ a $2 \\times 5$ matrix. Which statement about $AB$ and $BA$ is correct?",
    "optionsEn": [
      "$AB$ is $3 \\times 5$ and must equal $BA$",
      "$AB$ is $3 \\times 5$; $BA$ is undefined",
      "$AB$ is $2 \\times 2$; $BA$ is undefined",
      "Neither $AB$ nor $BA$ is defined"
    ],
    "explanationEn": "Two matrices can be multiplied when the *columns* of the first match the *rows* of the second. Here $A$ is $3 \\times 2$ and $B$ is $2 \\times 5$: the inner dimensions agree at $2$, so $AB$ exists and takes the outer dimensions, $3 \\times 5$. For $BA$, the columns of $B$ number $5$ and the rows of $A$ number $3$; $5 \\neq 3$, so $BA$ is undefined. Matrix multiplication is *not commutative*, which is its most basic departure from ordinary multiplication and the point being tested.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "m2_rep_0015",
    "type": "mc",
    "subject": "m2",
    "topic": "matrices",
    "topicZh": "矩陣與行列式",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "medium",
    "year": 0,
    "content": "設 $A$ 為 $4 \\times 4$ 矩陣，$B$ 為 $4 \\times 2$ 矩陣。關於乘積 $AB$ 與 $BA$，以下哪一項正確？",
    "explanation": "矩陣相乘的條件是：前者的【行數】要等於後者的【列數】。$A$ 為 $4 \\times 4$、$B$ 為 $4 \\times 2$，中間兩個數同為 $4$，故 $AB$ 有定義，結果取外面兩個數，即 $4 \\times 2$。至於 $BA$：$B$ 的行數為 $2$，$A$ 的列數為 $4$，$2 \\neq 4$，故 $BA$ 沒有定義。矩陣乘法【不符合交換律】，這是它同數字乘法最根本的分別，亦是本題的考點。",
    "options": [
      "$AB$ 與 $BA$ 都沒有定義",
      "$AB$ 為 $4 \\times 2$ 矩陣，且必定等於 $BA$",
      "$AB$ 為 $4 \\times 2$ 矩陣；$BA$ 沒有定義",
      "$AB$ 為 $4 \\times 4$ 矩陣；$BA$ 沒有定義"
    ],
    "correctIndex": 2,
    "marks": 1,
    "contentEn": "Let $A$ be a $4 \\times 4$ matrix and $B$ a $4 \\times 2$ matrix. Which statement about $AB$ and $BA$ is correct?",
    "optionsEn": [
      "Neither $AB$ nor $BA$ is defined",
      "$AB$ is $4 \\times 2$ and must equal $BA$",
      "$AB$ is $4 \\times 2$; $BA$ is undefined",
      "$AB$ is $4 \\times 4$; $BA$ is undefined"
    ],
    "explanationEn": "Two matrices can be multiplied when the *columns* of the first match the *rows* of the second. Here $A$ is $4 \\times 4$ and $B$ is $4 \\times 2$: the inner dimensions agree at $4$, so $AB$ exists and takes the outer dimensions, $4 \\times 2$. For $BA$, the columns of $B$ number $2$ and the rows of $A$ number $4$; $2 \\neq 4$, so $BA$ is undefined. Matrix multiplication is *not commutative*, which is its most basic departure from ordinary multiplication and the point being tested.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "m2_rep_0016",
    "type": "mc",
    "subject": "m2",
    "topic": "matrices",
    "topicZh": "矩陣與行列式",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "medium",
    "year": 0,
    "content": "設 $A$ 為 $1 \\times 5$ 矩陣，$B$ 為 $5 \\times 3$ 矩陣。關於乘積 $AB$ 與 $BA$，以下哪一項正確？",
    "explanation": "矩陣相乘的條件是：前者的【行數】要等於後者的【列數】。$A$ 為 $1 \\times 5$、$B$ 為 $5 \\times 3$，中間兩個數同為 $5$，故 $AB$ 有定義，結果取外面兩個數，即 $1 \\times 3$。至於 $BA$：$B$ 的行數為 $3$，$A$ 的列數為 $1$，$3 \\neq 1$，故 $BA$ 沒有定義。矩陣乘法【不符合交換律】，這是它同數字乘法最根本的分別，亦是本題的考點。",
    "options": [
      "$AB$ 為 $5 \\times 5$ 矩陣；$BA$ 沒有定義",
      "$AB$ 與 $BA$ 都沒有定義",
      "$AB$ 為 $1 \\times 3$ 矩陣，且必定等於 $BA$",
      "$AB$ 為 $1 \\times 3$ 矩陣；$BA$ 沒有定義"
    ],
    "correctIndex": 3,
    "marks": 1,
    "contentEn": "Let $A$ be a $1 \\times 5$ matrix and $B$ a $5 \\times 3$ matrix. Which statement about $AB$ and $BA$ is correct?",
    "optionsEn": [
      "$AB$ is $5 \\times 5$; $BA$ is undefined",
      "Neither $AB$ nor $BA$ is defined",
      "$AB$ is $1 \\times 3$ and must equal $BA$",
      "$AB$ is $1 \\times 3$; $BA$ is undefined"
    ],
    "explanationEn": "Two matrices can be multiplied when the *columns* of the first match the *rows* of the second. Here $A$ is $1 \\times 5$ and $B$ is $5 \\times 3$: the inner dimensions agree at $5$, so $AB$ exists and takes the outer dimensions, $1 \\times 3$. For $BA$, the columns of $B$ number $3$ and the rows of $A$ number $1$; $3 \\neq 1$, so $BA$ is undefined. Matrix multiplication is *not commutative*, which is its most basic departure from ordinary multiplication and the point being tested.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "m2_rep_0017",
    "type": "mc",
    "subject": "m2",
    "topic": "matrices",
    "topicZh": "矩陣與行列式",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "medium",
    "year": 0,
    "content": "設 $A$ 為 $5 \\times 3$ 矩陣，$B$ 為 $3 \\times 1$ 矩陣。關於乘積 $AB$ 與 $BA$，以下哪一項正確？",
    "explanation": "矩陣相乘的條件是：前者的【行數】要等於後者的【列數】。$A$ 為 $5 \\times 3$、$B$ 為 $3 \\times 1$，中間兩個數同為 $3$，故 $AB$ 有定義，結果取外面兩個數，即 $5 \\times 1$。至於 $BA$：$B$ 的行數為 $1$，$A$ 的列數為 $5$，$1 \\neq 5$，故 $BA$ 沒有定義。矩陣乘法【不符合交換律】，這是它同數字乘法最根本的分別，亦是本題的考點。",
    "options": [
      "$AB$ 為 $5 \\times 1$ 矩陣；$BA$ 沒有定義",
      "$AB$ 為 $3 \\times 3$ 矩陣；$BA$ 沒有定義",
      "$AB$ 與 $BA$ 都沒有定義",
      "$AB$ 為 $5 \\times 1$ 矩陣，且必定等於 $BA$"
    ],
    "correctIndex": 0,
    "marks": 1,
    "contentEn": "Let $A$ be a $5 \\times 3$ matrix and $B$ a $3 \\times 1$ matrix. Which statement about $AB$ and $BA$ is correct?",
    "optionsEn": [
      "$AB$ is $5 \\times 1$; $BA$ is undefined",
      "$AB$ is $3 \\times 3$; $BA$ is undefined",
      "Neither $AB$ nor $BA$ is defined",
      "$AB$ is $5 \\times 1$ and must equal $BA$"
    ],
    "explanationEn": "Two matrices can be multiplied when the *columns* of the first match the *rows* of the second. Here $A$ is $5 \\times 3$ and $B$ is $3 \\times 1$: the inner dimensions agree at $3$, so $AB$ exists and takes the outer dimensions, $5 \\times 1$. For $BA$, the columns of $B$ number $1$ and the rows of $A$ number $5$; $1 \\neq 5$, so $BA$ is undefined. Matrix multiplication is *not commutative*, which is its most basic departure from ordinary multiplication and the point being tested.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "m2_rep_0018",
    "type": "mc",
    "subject": "m2",
    "topic": "matrices",
    "topicZh": "矩陣與行列式",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "medium",
    "year": 0,
    "content": "設 $A = \\begin{pmatrix} 2 & 1 & 0 \\\\ 1 & 3 & 1 \\\\ 0 & 2 & 2 \\end{pmatrix}$。\n\n$A$ 是否可逆？其行列式的值為何？",
    "explanation": "矩陣可逆當且僅當行列式不為零，所以要先把行列式算出來。沿第一行展開，注意【正負相間】：$2 \\times (3 \\times 2 - 1 \\times 2) - 1 \\times (1 \\times 2 - 1 \\times 0) + 0 \\times (1 \\times 2 - 3 \\times 0) = 6$，不為零，故 $A$ 可逆。三項的符號依次為 $+,-,+$，中間一項【必須變號】，忘記這一點會得出 $10$，是三階行列式最集中的失分位。$12$ 只把主對角線相乘，那是把二階的做法搬過來，對三階並不成立。",
    "options": [
      "不可逆，且 $\\det A = 0$",
      "可逆，且 $\\det A = 6$",
      "可逆，且 $\\det A = 10$",
      "可逆，且 $\\det A = 12$"
    ],
    "correctIndex": 1,
    "marks": 1,
    "contentEn": "Let $A = \\begin{pmatrix} 2 & 1 & 0 \\\\ 1 & 3 & 1 \\\\ 0 & 2 & 2 \\end{pmatrix}$.\n\nIs $A$ invertible, and what is its determinant?",
    "optionsEn": [
      "Not invertible, with $\\det A = 0$",
      "Invertible, with $\\det A = 6$",
      "Invertible, with $\\det A = 10$",
      "Invertible, with $\\det A = 12$"
    ],
    "explanationEn": "A matrix is invertible exactly when its determinant is non-zero, so evaluate the determinant first. Expanding along the first row with alternating signs: $2 \\times (3 \\times 2 - 1 \\times 2) - 1 \\times (1 \\times 2 - 1 \\times 0) + 0 \\times (1 \\times 2 - 3 \\times 0) = 6$, which is non-zero, so $A$ is invertible. The three terms carry signs $+,-,+$ and the middle one *must* change sign; forgetting that gives $10$, the commonest error on $3 \\times 3$ determinants. $12$ multiplies the leading diagonal only, carrying over a $2 \\times 2$ shortcut that does not hold here.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "m2_rep_0019",
    "type": "mc",
    "subject": "m2",
    "topic": "matrices",
    "topicZh": "矩陣與行列式",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "medium",
    "year": 0,
    "content": "設 $A = \\begin{pmatrix} 1 & 2 & 3 \\\\ 0 & 1 & 4 \\\\ 5 & 6 & 0 \\end{pmatrix}$。\n\n$A$ 是否可逆？其行列式的值為何？",
    "explanation": "矩陣可逆當且僅當行列式不為零，所以要先把行列式算出來。沿第一行展開，注意【正負相間】：$1 \\times (1 \\times 0 - 4 \\times 6) - 2 \\times (0 \\times 0 - 4 \\times 5) + 3 \\times (0 \\times 6 - 1 \\times 5) = 1$，不為零，故 $A$ 可逆。三項的符號依次為 $+,-,+$，中間一項【必須變號】，忘記這一點會得出 $-79$，是三階行列式最集中的失分位。$0$ 只把主對角線相乘，那是把二階的做法搬過來，對三階並不成立。",
    "options": [
      "不可逆，且 $\\det A = 0$",
      "可逆，且 $\\det A = -1$",
      "可逆，且 $\\det A = 1$",
      "可逆，且 $\\det A = -79$"
    ],
    "correctIndex": 2,
    "marks": 1,
    "contentEn": "Let $A = \\begin{pmatrix} 1 & 2 & 3 \\\\ 0 & 1 & 4 \\\\ 5 & 6 & 0 \\end{pmatrix}$.\n\nIs $A$ invertible, and what is its determinant?",
    "optionsEn": [
      "Not invertible, with $\\det A = 0$",
      "Invertible, with $\\det A = -1$",
      "Invertible, with $\\det A = 1$",
      "Invertible, with $\\det A = -79$"
    ],
    "explanationEn": "A matrix is invertible exactly when its determinant is non-zero, so evaluate the determinant first. Expanding along the first row with alternating signs: $1 \\times (1 \\times 0 - 4 \\times 6) - 2 \\times (0 \\times 0 - 4 \\times 5) + 3 \\times (0 \\times 6 - 1 \\times 5) = 1$, which is non-zero, so $A$ is invertible. The three terms carry signs $+,-,+$ and the middle one *must* change sign; forgetting that gives $-79$, the commonest error on $3 \\times 3$ determinants. $0$ multiplies the leading diagonal only, carrying over a $2 \\times 2$ shortcut that does not hold here.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "m2_rep_0020",
    "type": "mc",
    "subject": "m2",
    "topic": "matrices",
    "topicZh": "矩陣與行列式",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "medium",
    "year": 0,
    "content": "設 $A = \\begin{pmatrix} 3 & 1 & 2 \\\\ 2 & 1 & 1 \\\\ 1 & 2 & 4 \\end{pmatrix}$。\n\n$A$ 是否可逆？其行列式的值為何？",
    "explanation": "矩陣可逆當且僅當行列式不為零，所以要先把行列式算出來。沿第一行展開，注意【正負相間】：$3 \\times (1 \\times 4 - 1 \\times 2) - 1 \\times (2 \\times 4 - 1 \\times 1) + 2 \\times (2 \\times 2 - 1 \\times 1) = 5$，不為零，故 $A$ 可逆。三項的符號依次為 $+,-,+$，中間一項【必須變號】，忘記這一點會得出 $19$，是三階行列式最集中的失分位。$12$ 只把主對角線相乘，那是把二階的做法搬過來，對三階並不成立。",
    "options": [
      "可逆，且 $\\det A = 19$",
      "可逆，且 $\\det A = 12$",
      "不可逆，且 $\\det A = 0$",
      "可逆，且 $\\det A = 5$"
    ],
    "correctIndex": 3,
    "marks": 1,
    "contentEn": "Let $A = \\begin{pmatrix} 3 & 1 & 2 \\\\ 2 & 1 & 1 \\\\ 1 & 2 & 4 \\end{pmatrix}$.\n\nIs $A$ invertible, and what is its determinant?",
    "optionsEn": [
      "Invertible, with $\\det A = 19$",
      "Invertible, with $\\det A = 12$",
      "Not invertible, with $\\det A = 0$",
      "Invertible, with $\\det A = 5$"
    ],
    "explanationEn": "A matrix is invertible exactly when its determinant is non-zero, so evaluate the determinant first. Expanding along the first row with alternating signs: $3 \\times (1 \\times 4 - 1 \\times 2) - 1 \\times (2 \\times 4 - 1 \\times 1) + 2 \\times (2 \\times 2 - 1 \\times 1) = 5$, which is non-zero, so $A$ is invertible. The three terms carry signs $+,-,+$ and the middle one *must* change sign; forgetting that gives $19$, the commonest error on $3 \\times 3$ determinants. $12$ multiplies the leading diagonal only, carrying over a $2 \\times 2$ shortcut that does not hold here.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "m2_rep_0021",
    "type": "mc",
    "subject": "m2",
    "topic": "matrices",
    "topicZh": "矩陣與行列式",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "medium",
    "year": 0,
    "content": "設 $A = \\begin{pmatrix} 1 & 2 & 3 \\\\ 2 & 4 & 6 \\\\ 1 & 0 & 1 \\end{pmatrix}$。\n\n$A$ 是否可逆？其行列式的值為何？",
    "explanation": "矩陣可逆當且僅當行列式不為零，所以要先把行列式算出來。沿第一行展開，注意【正負相間】：$1 \\times (4 \\times 1 - 6 \\times 0) - 2 \\times (2 \\times 1 - 6 \\times 1) + 3 \\times (2 \\times 0 - 4 \\times 1) = 0$，等於零，故 $A$ 【不可逆】。留意本題第二行剛好是第一行的兩倍 —— 任何一行是另一行的倍數，行列式必定為零，看得出這一點就不必展開。三項的符號依次為 $+,-,+$，中間一項【必須變號】，忘記這一點會得出 $-16$，是三階行列式最集中的失分位。$4$ 只把主對角線相乘，那是把二階的做法搬過來，對三階並不成立。",
    "options": [
      "不可逆，且 $\\det A = 0$",
      "可逆，且 $\\det A = -16$",
      "可逆，且 $\\det A = 4$",
      "可逆，且 $\\det A = 1$"
    ],
    "correctIndex": 0,
    "marks": 1,
    "contentEn": "Let $A = \\begin{pmatrix} 1 & 2 & 3 \\\\ 2 & 4 & 6 \\\\ 1 & 0 & 1 \\end{pmatrix}$.\n\nIs $A$ invertible, and what is its determinant?",
    "optionsEn": [
      "Not invertible, with $\\det A = 0$",
      "Invertible, with $\\det A = -16$",
      "Invertible, with $\\det A = 4$",
      "Invertible, with $\\det A = 1$"
    ],
    "explanationEn": "A matrix is invertible exactly when its determinant is non-zero, so evaluate the determinant first. Expanding along the first row with alternating signs: $1 \\times (4 \\times 1 - 6 \\times 0) - 2 \\times (2 \\times 1 - 6 \\times 1) + 3 \\times (2 \\times 0 - 4 \\times 1) = 0$, which is zero, so $A$ is *not* invertible. Note that the second row here is exactly twice the first — whenever one row is a multiple of another the determinant must vanish, which can be seen without expanding at all. The three terms carry signs $+,-,+$ and the middle one *must* change sign; forgetting that gives $-16$, the commonest error on $3 \\times 3$ determinants. $4$ multiplies the leading diagonal only, carrying over a $2 \\times 2$ shortcut that does not hold here.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "m2_rep_0022",
    "type": "mc",
    "subject": "m2",
    "topic": "limits",
    "topicZh": "極限",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "求 $\\lim_{x \\to 2} (2x^2 − 3x + 5)$。",
    "explanation": "多項式在整個實數域上連續，而連續函數在某點的極限就等於該點的函數值，故直接代入即可：$2(2)^2 − 3(2) + 5 = 7$。第一個干擾項漏了常數項。第二個代入了【導函數】$4x − 3$ —— 求極限同求導數是兩件事，混淆兩者是初學極限時最常見的錯。第三項把 $x$ 當成 $1$ 代入。留意：只有當代入後出現 $\\frac{0}{0}$ 一類不定式時，才需要先化簡；本題不屬此類。",
    "options": [
      "$4$",
      "$7$",
      "$2$",
      "$5$"
    ],
    "correctIndex": 1,
    "marks": 1,
    "contentEn": "Evaluate $\\lim_{x \\to 2} (2x^2 − 3x + 5)$.",
    "optionsEn": [
      "$4$",
      "$7$",
      "$2$",
      "$5$"
    ],
    "explanationEn": "A polynomial is continuous everywhere, and the limit of a continuous function at a point is simply its value there, so substitute directly: $2(2)^2 − 3(2) + 5 = 7$. The first distractor drops the constant term. The second substitutes into the *derivative* $4x − 3$ — taking a limit and differentiating are different operations, and confusing them is the classic beginner's error. The third substitutes $x = 1$. Note that simplification is needed only when substitution produces an indeterminate form such as $\\frac{0}{0}$, which is not the case here.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "m2_rep_0023",
    "type": "mc",
    "subject": "m2",
    "topic": "limits",
    "topicZh": "極限",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "求 $\\lim_{x \\to 3} (1x^2 + 4x − 6)$。",
    "explanation": "多項式在整個實數域上連續，而連續函數在某點的極限就等於該點的函數值，故直接代入即可：$1(3)^2 + 4(3) − 6 = 15$。第一個干擾項漏了常數項。第二個代入了【導函數】$2x + 4$ —— 求極限同求導數是兩件事，混淆兩者是初學極限時最常見的錯。第三項把 $x$ 當成 $1$ 代入。留意：只有當代入後出現 $\\frac{0}{0}$ 一類不定式時，才需要先化簡；本題不屬此類。",
    "options": [
      "$10$",
      "$-1$",
      "$15$",
      "$21$"
    ],
    "correctIndex": 2,
    "marks": 1,
    "contentEn": "Evaluate $\\lim_{x \\to 3} (1x^2 + 4x − 6)$.",
    "optionsEn": [
      "$10$",
      "$-1$",
      "$15$",
      "$21$"
    ],
    "explanationEn": "A polynomial is continuous everywhere, and the limit of a continuous function at a point is simply its value there, so substitute directly: $1(3)^2 + 4(3) − 6 = 15$. The first distractor drops the constant term. The second substitutes into the *derivative* $2x + 4$ — taking a limit and differentiating are different operations, and confusing them is the classic beginner's error. The third substitutes $x = 1$. Note that simplification is needed only when substitution produces an indeterminate form such as $\\frac{0}{0}$, which is not the case here.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "m2_rep_0024",
    "type": "mc",
    "subject": "m2",
    "topic": "limits",
    "topicZh": "極限",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "求 $\\lim_{x \\to -2} (3x^2 − 1x + 2)$。",
    "explanation": "多項式在整個實數域上連續，而連續函數在某點的極限就等於該點的函數值，故直接代入即可：$3(-2)^2 − 1(-2) + 2 = 16$。第一個干擾項漏了常數項。第二個代入了【導函數】$6x − 1$ —— 求極限同求導數是兩件事，混淆兩者是初學極限時最常見的錯。第三項把 $x$ 當成 $1$ 代入。留意：只有當代入後出現 $\\frac{0}{0}$ 一類不定式時，才需要先化簡；本題不屬此類。",
    "options": [
      "$14$",
      "$-13$",
      "$4$",
      "$16$"
    ],
    "correctIndex": 3,
    "marks": 1,
    "contentEn": "Evaluate $\\lim_{x \\to -2} (3x^2 − 1x + 2)$.",
    "optionsEn": [
      "$14$",
      "$-13$",
      "$4$",
      "$16$"
    ],
    "explanationEn": "A polynomial is continuous everywhere, and the limit of a continuous function at a point is simply its value there, so substitute directly: $3(-2)^2 − 1(-2) + 2 = 16$. The first distractor drops the constant term. The second substitutes into the *derivative* $6x − 1$ — taking a limit and differentiating are different operations, and confusing them is the classic beginner's error. The third substitutes $x = 1$. Note that simplification is needed only when substitution produces an indeterminate form such as $\\frac{0}{0}$, which is not the case here.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "m2_rep_0025",
    "type": "mc",
    "subject": "m2",
    "topic": "limits",
    "topicZh": "極限",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "求 $\\lim_{x \\to -2} (2x^2 + 5x + 1)$。",
    "explanation": "多項式在整個實數域上連續，而連續函數在某點的極限就等於該點的函數值，故直接代入即可：$2(-2)^2 + 5(-2) + 1 = -1$。第一個干擾項漏了常數項。第二個代入了【導函數】$4x + 5$ —— 求極限同求導數是兩件事，混淆兩者是初學極限時最常見的錯。第三項把 $x$ 當成 $1$ 代入。留意：只有當代入後出現 $\\frac{0}{0}$ 一類不定式時，才需要先化簡；本題不屬此類。",
    "options": [
      "$-1$",
      "$-2$",
      "$-3$",
      "$8$"
    ],
    "correctIndex": 0,
    "marks": 1,
    "contentEn": "Evaluate $\\lim_{x \\to -2} (2x^2 + 5x + 1)$.",
    "optionsEn": [
      "$-1$",
      "$-2$",
      "$-3$",
      "$8$"
    ],
    "explanationEn": "A polynomial is continuous everywhere, and the limit of a continuous function at a point is simply its value there, so substitute directly: $2(-2)^2 + 5(-2) + 1 = -1$. The first distractor drops the constant term. The second substitutes into the *derivative* $4x + 5$ — taking a limit and differentiating are different operations, and confusing them is the classic beginner's error. The third substitutes $x = 1$. Note that simplification is needed only when substitution produces an indeterminate form such as $\\frac{0}{0}$, which is not the case here.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "m2_rep_0026",
    "type": "mc",
    "subject": "m2",
    "topic": "limits",
    "topicZh": "極限",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "求 $\\lim_{x \\to 3} (4x^2 + 0x − 7)$。",
    "explanation": "多項式在整個實數域上連續，而連續函數在某點的極限就等於該點的函數值，故直接代入即可：$4(3)^2 + 0(3) − 7 = 29$。第一個干擾項漏了常數項。第二個代入了【導函數】$8x + 0$ —— 求極限同求導數是兩件事，混淆兩者是初學極限時最常見的錯。第三項把 $x$ 當成 $1$ 代入。留意：只有當代入後出現 $\\frac{0}{0}$ 一類不定式時，才需要先化簡；本題不屬此類。",
    "options": [
      "$-3$",
      "$29$",
      "$36$",
      "$24$"
    ],
    "correctIndex": 1,
    "marks": 1,
    "contentEn": "Evaluate $\\lim_{x \\to 3} (4x^2 + 0x − 7)$.",
    "optionsEn": [
      "$-3$",
      "$29$",
      "$36$",
      "$24$"
    ],
    "explanationEn": "A polynomial is continuous everywhere, and the limit of a continuous function at a point is simply its value there, so substitute directly: $4(3)^2 + 0(3) − 7 = 29$. The first distractor drops the constant term. The second substitutes into the *derivative* $8x + 0$ — taking a limit and differentiating are different operations, and confusing them is the classic beginner's error. The third substitutes $x = 1$. Note that simplification is needed only when substitution produces an indeterminate form such as $\\frac{0}{0}$, which is not the case here.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "m2_rep_0027",
    "type": "mc",
    "subject": "m2",
    "topic": "limits",
    "topicZh": "極限",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "求 $\\lim_{x \\to 4} (1x^2 − 6x + 9)$。",
    "explanation": "多項式在整個實數域上連續，而連續函數在某點的極限就等於該點的函數值，故直接代入即可：$1(4)^2 − 6(4) + 9 = 1$。第一個干擾項漏了常數項。第二個代入了【導函數】$2x − 6$ —— 求極限同求導數是兩件事，混淆兩者是初學極限時最常見的錯。第三項把 $x$ 當成 $1$ 代入。留意：只有當代入後出現 $\\frac{0}{0}$ 一類不定式時，才需要先化簡；本題不屬此類。",
    "options": [
      "$2$",
      "$4$",
      "$1$",
      "$-8$"
    ],
    "correctIndex": 2,
    "marks": 1,
    "contentEn": "Evaluate $\\lim_{x \\to 4} (1x^2 − 6x + 9)$.",
    "optionsEn": [
      "$2$",
      "$4$",
      "$1$",
      "$-8$"
    ],
    "explanationEn": "A polynomial is continuous everywhere, and the limit of a continuous function at a point is simply its value there, so substitute directly: $1(4)^2 − 6(4) + 9 = 1$. The first distractor drops the constant term. The second substitutes into the *derivative* $2x − 6$ — taking a limit and differentiating are different operations, and confusing them is the classic beginner's error. The third substitutes $x = 1$. Note that simplification is needed only when substitution produces an indeterminate form such as $\\frac{0}{0}$, which is not the case here.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "m2_rep_0028",
    "type": "mc",
    "subject": "m2",
    "topic": "limits",
    "topicZh": "極限",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "medium",
    "year": 0,
    "content": "求 $\\lim_{x \\to \\infty} \\dfrac{3x^2 + 1}{6x^2 + x}$。",
    "explanation": "$x \\to \\infty$ 時，有理式的極限只由分子與分母的【最高次項】決定，低次項與常數的影響趨於零。本題分子最高次為 $2$ 次，分母為 $2$ 次，兩者同次，極限等於最高次項係數之比 $\\dfrac{3}{6} = \\dfrac{1}{2}$。判斷次序應為：先比次數，同次才比係數。一上手就約掉係數而不看次數，是本題最主要的失分位。最後一項把係數之比倒轉。",
    "options": [
      "$0$",
      "不存在（趨向無限大）",
      "$2$",
      "$\\dfrac{1}{2}$"
    ],
    "correctIndex": 3,
    "marks": 1,
    "contentEn": "Evaluate $\\lim_{x \\to \\infty} \\dfrac{3x^2 + 1}{6x^2 + x}$.",
    "optionsEn": [
      "$0$",
      "Does not exist (tends to infinity)",
      "$2$",
      "$\\dfrac{1}{2}$"
    ],
    "explanationEn": "As $x \\to \\infty$ the limit of a rational function is governed by the *highest-degree* terms; lower-order terms and constants become negligible. Here the numerator has degree $2$ and the denominator degree $2$. The degrees match, so the limit is the ratio of leading coefficients, $\\dfrac{3}{6} = \\dfrac{1}{2}$. The order of reasoning matters: compare degrees first, and only compare coefficients when the degrees agree. Jumping straight to the coefficients is where most marks are lost. The final option inverts the ratio.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "m2_rep_0029",
    "type": "mc",
    "subject": "m2",
    "topic": "limits",
    "topicZh": "極限",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "medium",
    "year": 0,
    "content": "求 $\\lim_{x \\to \\infty} \\dfrac{5x^2 + 1}{2x^2 + x}$。",
    "explanation": "$x \\to \\infty$ 時，有理式的極限只由分子與分母的【最高次項】決定，低次項與常數的影響趨於零。本題分子最高次為 $2$ 次，分母為 $2$ 次，兩者同次，極限等於最高次項係數之比 $\\dfrac{5}{2} = \\dfrac{5}{2}$。判斷次序應為：先比次數，同次才比係數。一上手就約掉係數而不看次數，是本題最主要的失分位。最後一項把係數之比倒轉。",
    "options": [
      "$\\dfrac{5}{2}$",
      "$0$",
      "不存在（趨向無限大）",
      "$\\dfrac{2}{5}$"
    ],
    "correctIndex": 0,
    "marks": 1,
    "contentEn": "Evaluate $\\lim_{x \\to \\infty} \\dfrac{5x^2 + 1}{2x^2 + x}$.",
    "optionsEn": [
      "$\\dfrac{5}{2}$",
      "$0$",
      "Does not exist (tends to infinity)",
      "$\\dfrac{2}{5}$"
    ],
    "explanationEn": "As $x \\to \\infty$ the limit of a rational function is governed by the *highest-degree* terms; lower-order terms and constants become negligible. Here the numerator has degree $2$ and the denominator degree $2$. The degrees match, so the limit is the ratio of leading coefficients, $\\dfrac{5}{2} = \\dfrac{5}{2}$. The order of reasoning matters: compare degrees first, and only compare coefficients when the degrees agree. Jumping straight to the coefficients is where most marks are lost. The final option inverts the ratio.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "m2_rep_0030",
    "type": "mc",
    "subject": "m2",
    "topic": "limits",
    "topicZh": "極限",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "medium",
    "year": 0,
    "content": "求 $\\lim_{x \\to \\infty} \\dfrac{x^2 + 1}{4x^3 + x}$。",
    "explanation": "$x \\to \\infty$ 時，有理式的極限只由分子與分母的【最高次項】決定，低次項與常數的影響趨於零。本題分子最高次為 $2$ 次，分母為 $3$ 次，分母次數較高，分母增長得快得多，故整體趨向 $0$。判斷次序應為：先比次數，同次才比係數。一上手就約掉係數而不看次數，是本題最主要的失分位。最後一項把係數之比倒轉。",
    "options": [
      "$4$",
      "$0$",
      "$\\dfrac{1}{4}$",
      "不存在（趨向無限大）"
    ],
    "correctIndex": 1,
    "marks": 1,
    "contentEn": "Evaluate $\\lim_{x \\to \\infty} \\dfrac{x^2 + 1}{4x^3 + x}$.",
    "optionsEn": [
      "$4$",
      "$0$",
      "$\\dfrac{1}{4}$",
      "Does not exist (tends to infinity)"
    ],
    "explanationEn": "As $x \\to \\infty$ the limit of a rational function is governed by the *highest-degree* terms; lower-order terms and constants become negligible. Here the numerator has degree $2$ and the denominator degree $3$. The denominator has the higher degree and grows far faster, so the quotient tends to $0$. The order of reasoning matters: compare degrees first, and only compare coefficients when the degrees agree. Jumping straight to the coefficients is where most marks are lost. The final option inverts the ratio.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "m2_rep_0031",
    "type": "mc",
    "subject": "m2",
    "topic": "limits",
    "topicZh": "極限",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "medium",
    "year": 0,
    "content": "求 $\\lim_{x \\to \\infty} \\dfrac{2x^3 + 1}{x^2 + x}$。",
    "explanation": "$x \\to \\infty$ 時，有理式的極限只由分子與分母的【最高次項】決定，低次項與常數的影響趨於零。本題分子最高次為 $3$ 次，分母為 $2$ 次，分子次數較高，分子增長得快得多，故無有限極限。判斷次序應為：先比次數，同次才比係數。一上手就約掉係數而不看次數，是本題最主要的失分位。最後一項把係數之比倒轉。",
    "options": [
      "$0$",
      "$\\dfrac{1}{2}$",
      "不存在（趨向無限大）",
      "$2$"
    ],
    "correctIndex": 2,
    "marks": 1,
    "contentEn": "Evaluate $\\lim_{x \\to \\infty} \\dfrac{2x^3 + 1}{x^2 + x}$.",
    "optionsEn": [
      "$0$",
      "$\\dfrac{1}{2}$",
      "Does not exist (tends to infinity)",
      "$2$"
    ],
    "explanationEn": "As $x \\to \\infty$ the limit of a rational function is governed by the *highest-degree* terms; lower-order terms and constants become negligible. Here the numerator has degree $3$ and the denominator degree $2$. The numerator has the higher degree and grows far faster, so no finite limit exists. The order of reasoning matters: compare degrees first, and only compare coefficients when the degrees agree. Jumping straight to the coefficients is where most marks are lost. The final option inverts the ratio.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "m2_rep_0032",
    "type": "mc",
    "subject": "m2",
    "topic": "limits",
    "topicZh": "極限",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "medium",
    "year": 0,
    "content": "求 $\\lim_{x \\to \\infty} \\dfrac{7x^2 + 1}{14x^2 + x}$。",
    "explanation": "$x \\to \\infty$ 時，有理式的極限只由分子與分母的【最高次項】決定，低次項與常數的影響趨於零。本題分子最高次為 $2$ 次，分母為 $2$ 次，兩者同次，極限等於最高次項係數之比 $\\dfrac{7}{14} = \\dfrac{1}{2}$。判斷次序應為：先比次數，同次才比係數。一上手就約掉係數而不看次數，是本題最主要的失分位。最後一項把係數之比倒轉。",
    "options": [
      "$0$",
      "不存在（趨向無限大）",
      "$2$",
      "$\\dfrac{1}{2}$"
    ],
    "correctIndex": 3,
    "marks": 1,
    "contentEn": "Evaluate $\\lim_{x \\to \\infty} \\dfrac{7x^2 + 1}{14x^2 + x}$.",
    "optionsEn": [
      "$0$",
      "Does not exist (tends to infinity)",
      "$2$",
      "$\\dfrac{1}{2}$"
    ],
    "explanationEn": "As $x \\to \\infty$ the limit of a rational function is governed by the *highest-degree* terms; lower-order terms and constants become negligible. Here the numerator has degree $2$ and the denominator degree $2$. The degrees match, so the limit is the ratio of leading coefficients, $\\dfrac{7}{14} = \\dfrac{1}{2}$. The order of reasoning matters: compare degrees first, and only compare coefficients when the degrees agree. Jumping straight to the coefficients is where most marks are lost. The final option inverts the ratio.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "m2_rep_0033",
    "type": "mc",
    "subject": "m2",
    "topic": "limits",
    "topicZh": "極限",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "medium",
    "year": 0,
    "content": "求 $\\lim_{x \\to \\infty} \\dfrac{3x^2 + 1}{5x^3 + x}$。",
    "explanation": "$x \\to \\infty$ 時，有理式的極限只由分子與分母的【最高次項】決定，低次項與常數的影響趨於零。本題分子最高次為 $2$ 次，分母為 $3$ 次，分母次數較高，分母增長得快得多，故整體趨向 $0$。判斷次序應為：先比次數，同次才比係數。一上手就約掉係數而不看次數，是本題最主要的失分位。最後一項把係數之比倒轉。",
    "options": [
      "$0$",
      "$\\dfrac{3}{5}$",
      "不存在（趨向無限大）",
      "$\\dfrac{5}{3}$"
    ],
    "correctIndex": 0,
    "marks": 1,
    "contentEn": "Evaluate $\\lim_{x \\to \\infty} \\dfrac{3x^2 + 1}{5x^3 + x}$.",
    "optionsEn": [
      "$0$",
      "$\\dfrac{3}{5}$",
      "Does not exist (tends to infinity)",
      "$\\dfrac{5}{3}$"
    ],
    "explanationEn": "As $x \\to \\infty$ the limit of a rational function is governed by the *highest-degree* terms; lower-order terms and constants become negligible. Here the numerator has degree $2$ and the denominator degree $3$. The denominator has the higher degree and grows far faster, so the quotient tends to $0$. The order of reasoning matters: compare degrees first, and only compare coefficients when the degrees agree. Jumping straight to the coefficients is where most marks are lost. The final option inverts the ratio.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "m2_rep_0034",
    "type": "mc",
    "subject": "m2",
    "topic": "limits",
    "topicZh": "極限",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "medium",
    "year": 0,
    "content": "求 $\\lim_{x \\to 0} \\dfrac{\\sin 3x}{5x}$。",
    "explanation": "基本極限為 $\\lim_{\\theta \\to 0} \\dfrac{\\sin \\theta}{\\theta} = 1$，但它要求【正弦內的角】同【分母】完全相同。本題分子的角是 $3x$，分母卻是 $5x$，故要先湊：$\\dfrac{\\sin 3x}{5x} = \\dfrac{3}{5} \\cdot \\dfrac{\\sin 3x}{3x}$，右邊的分式趨向 $1$，故極限為 $\\dfrac{3}{5}$。直接答 $1$ 是把基本極限硬套而不理會兩個角並不相同，這是本題設下的主要陷阱。答 $0$ 的把分子的 $\\sin 0 = 0$ 代入而忽略了分母同樣趨於零，$\\frac{0}{0}$ 是不定式，不可直接判為零。最後一項把比例倒轉。",
    "options": [
      "$0$",
      "$\\dfrac{3}{5}$",
      "$\\dfrac{5}{3}$",
      "$1$"
    ],
    "correctIndex": 1,
    "marks": 1,
    "contentEn": "Evaluate $\\lim_{x \\to 0} \\dfrac{\\sin 3x}{5x}$.",
    "optionsEn": [
      "$0$",
      "$\\dfrac{3}{5}$",
      "$\\dfrac{5}{3}$",
      "$1$"
    ],
    "explanationEn": "The standard limit is $\\lim_{\\theta \\to 0} \\dfrac{\\sin \\theta}{\\theta} = 1$, but it requires the angle inside the sine to match the denominator exactly. Here the angle is $3x$ while the denominator is $5x$, so first rewrite: $\\dfrac{\\sin 3x}{5x} = \\dfrac{3}{5} \\cdot \\dfrac{\\sin 3x}{3x}$; the second factor tends to $1$, giving $\\dfrac{3}{5}$. Answering $1$ applies the standard limit without checking that the two angles differ — the main trap here. Answering $0$ substitutes $\\sin 0 = 0$ while ignoring that the denominator also tends to zero; $\\frac{0}{0}$ is indeterminate and cannot be read off as zero. The last option inverts the ratio.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "m2_rep_0035",
    "type": "mc",
    "subject": "m2",
    "topic": "limits",
    "topicZh": "極限",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "medium",
    "year": 0,
    "content": "求 $\\lim_{x \\to 0} \\dfrac{\\sin 2x}{7x}$。",
    "explanation": "基本極限為 $\\lim_{\\theta \\to 0} \\dfrac{\\sin \\theta}{\\theta} = 1$，但它要求【正弦內的角】同【分母】完全相同。本題分子的角是 $2x$，分母卻是 $7x$，故要先湊：$\\dfrac{\\sin 2x}{7x} = \\dfrac{2}{7} \\cdot \\dfrac{\\sin 2x}{2x}$，右邊的分式趨向 $1$，故極限為 $\\dfrac{2}{7}$。直接答 $1$ 是把基本極限硬套而不理會兩個角並不相同，這是本題設下的主要陷阱。答 $0$ 的把分子的 $\\sin 0 = 0$ 代入而忽略了分母同樣趨於零，$\\frac{0}{0}$ 是不定式，不可直接判為零。最後一項把比例倒轉。",
    "options": [
      "$1$",
      "$0$",
      "$\\dfrac{2}{7}$",
      "$\\dfrac{7}{2}$"
    ],
    "correctIndex": 2,
    "marks": 1,
    "contentEn": "Evaluate $\\lim_{x \\to 0} \\dfrac{\\sin 2x}{7x}$.",
    "optionsEn": [
      "$1$",
      "$0$",
      "$\\dfrac{2}{7}$",
      "$\\dfrac{7}{2}$"
    ],
    "explanationEn": "The standard limit is $\\lim_{\\theta \\to 0} \\dfrac{\\sin \\theta}{\\theta} = 1$, but it requires the angle inside the sine to match the denominator exactly. Here the angle is $2x$ while the denominator is $7x$, so first rewrite: $\\dfrac{\\sin 2x}{7x} = \\dfrac{2}{7} \\cdot \\dfrac{\\sin 2x}{2x}$; the second factor tends to $1$, giving $\\dfrac{2}{7}$. Answering $1$ applies the standard limit without checking that the two angles differ — the main trap here. Answering $0$ substitutes $\\sin 0 = 0$ while ignoring that the denominator also tends to zero; $\\frac{0}{0}$ is indeterminate and cannot be read off as zero. The last option inverts the ratio.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "m2_rep_0036",
    "type": "mc",
    "subject": "m2",
    "topic": "limits",
    "topicZh": "極限",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "medium",
    "year": 0,
    "content": "求 $\\lim_{x \\to 0} \\dfrac{\\sin 4x}{3x}$。",
    "explanation": "基本極限為 $\\lim_{\\theta \\to 0} \\dfrac{\\sin \\theta}{\\theta} = 1$，但它要求【正弦內的角】同【分母】完全相同。本題分子的角是 $4x$，分母卻是 $3x$，故要先湊：$\\dfrac{\\sin 4x}{3x} = \\dfrac{4}{3} \\cdot \\dfrac{\\sin 4x}{4x}$，右邊的分式趨向 $1$，故極限為 $\\dfrac{4}{3}$。直接答 $1$ 是把基本極限硬套而不理會兩個角並不相同，這是本題設下的主要陷阱。答 $0$ 的把分子的 $\\sin 0 = 0$ 代入而忽略了分母同樣趨於零，$\\frac{0}{0}$ 是不定式，不可直接判為零。最後一項把比例倒轉。",
    "options": [
      "$\\dfrac{3}{4}$",
      "$1$",
      "$0$",
      "$\\dfrac{4}{3}$"
    ],
    "correctIndex": 3,
    "marks": 1,
    "contentEn": "Evaluate $\\lim_{x \\to 0} \\dfrac{\\sin 4x}{3x}$.",
    "optionsEn": [
      "$\\dfrac{3}{4}$",
      "$1$",
      "$0$",
      "$\\dfrac{4}{3}$"
    ],
    "explanationEn": "The standard limit is $\\lim_{\\theta \\to 0} \\dfrac{\\sin \\theta}{\\theta} = 1$, but it requires the angle inside the sine to match the denominator exactly. Here the angle is $4x$ while the denominator is $3x$, so first rewrite: $\\dfrac{\\sin 4x}{3x} = \\dfrac{4}{3} \\cdot \\dfrac{\\sin 4x}{4x}$; the second factor tends to $1$, giving $\\dfrac{4}{3}$. Answering $1$ applies the standard limit without checking that the two angles differ — the main trap here. Answering $0$ substitutes $\\sin 0 = 0$ while ignoring that the denominator also tends to zero; $\\frac{0}{0}$ is indeterminate and cannot be read off as zero. The last option inverts the ratio.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "m2_rep_0037",
    "type": "mc",
    "subject": "m2",
    "topic": "limits",
    "topicZh": "極限",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "medium",
    "year": 0,
    "content": "求 $\\lim_{x \\to 0} \\dfrac{\\sin 6x}{2x}$。",
    "explanation": "基本極限為 $\\lim_{\\theta \\to 0} \\dfrac{\\sin \\theta}{\\theta} = 1$，但它要求【正弦內的角】同【分母】完全相同。本題分子的角是 $6x$，分母卻是 $2x$，故要先湊：$\\dfrac{\\sin 6x}{2x} = \\dfrac{6}{2} \\cdot \\dfrac{\\sin 6x}{6x}$，右邊的分式趨向 $1$，故極限為 $3$。直接答 $1$ 是把基本極限硬套而不理會兩個角並不相同，這是本題設下的主要陷阱。答 $0$ 的把分子的 $\\sin 0 = 0$ 代入而忽略了分母同樣趨於零，$\\frac{0}{0}$ 是不定式，不可直接判為零。最後一項把比例倒轉。",
    "options": [
      "$3$",
      "$\\dfrac{1}{3}$",
      "$1$",
      "$0$"
    ],
    "correctIndex": 0,
    "marks": 1,
    "contentEn": "Evaluate $\\lim_{x \\to 0} \\dfrac{\\sin 6x}{2x}$.",
    "optionsEn": [
      "$3$",
      "$\\dfrac{1}{3}$",
      "$1$",
      "$0$"
    ],
    "explanationEn": "The standard limit is $\\lim_{\\theta \\to 0} \\dfrac{\\sin \\theta}{\\theta} = 1$, but it requires the angle inside the sine to match the denominator exactly. Here the angle is $6x$ while the denominator is $2x$, so first rewrite: $\\dfrac{\\sin 6x}{2x} = \\dfrac{6}{2} \\cdot \\dfrac{\\sin 6x}{6x}$; the second factor tends to $1$, giving $3$. Answering $1$ applies the standard limit without checking that the two angles differ — the main trap here. Answering $0$ substitutes $\\sin 0 = 0$ while ignoring that the denominator also tends to zero; $\\frac{0}{0}$ is indeterminate and cannot be read off as zero. The last option inverts the ratio.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "m2_rep_0038",
    "type": "mc",
    "subject": "m2",
    "topic": "limits",
    "topicZh": "極限",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "設 $f(x) = \\begin{cases} 5 & x < 2 \\\\ 5 & x > 2 \\end{cases}$。\n\n$\\lim_{x \\to 2} f(x)$ 是否存在？若存在，其值為何？",
    "explanation": "極限存在的條件是【左極限等於右極限】。本題左極限為 $5$，右極限為 $5$，兩者相等，故極限存在並等於 $5$。要留意：函數在 $x = 2$ 一點【有沒有定義】同極限是否存在完全無關 —— 極限只描述趨近的過程，不理會該點本身。分段函數求極限，必定要分左右兩邊各自檢查，不可只看其中一段。",
    "options": [
      "不存在，因為左極限與右極限並不相等",
      "存在，且等於 $5$",
      "不存在，因為 $f(2)$ 沒有定義",
      "存在，且等於 $10$"
    ],
    "correctIndex": 1,
    "marks": 1,
    "contentEn": "Let $f(x) = \\begin{cases} 5 & x < 2 \\\\ 5 & x > 2 \\end{cases}$.\n\nDoes $\\lim_{x \\to 2} f(x)$ exist, and if so what is its value?",
    "optionsEn": [
      "It does not exist, because the one-sided limits differ",
      "It exists and equals $5$",
      "It does not exist, because $f(2)$ is undefined",
      "It exists and equals $10$"
    ],
    "explanationEn": "A limit exists precisely when the left-hand and right-hand limits agree. Here they are $5$ and $5$. They agree, so the limit exists and equals $5$. Note that whether $f$ is *defined* at $x = 2$ is irrelevant: a limit describes the approach, not the point itself. For a piecewise function, always check each side separately rather than reading off one branch.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "m2_rep_0039",
    "type": "mc",
    "subject": "m2",
    "topic": "limits",
    "topicZh": "極限",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "設 $f(x) = \\begin{cases} 3 & x < 1 \\\\ 7 & x > 1 \\end{cases}$。\n\n$\\lim_{x \\to 1} f(x)$ 是否存在？若存在，其值為何？",
    "explanation": "極限存在的條件是【左極限等於右極限】。本題左極限為 $3$，右極限為 $7$，兩者不相等，故極限不存在。此時不可以取兩者的平均 $5$ 或任意一邊的值 —— 極限要求兩邊趨向同一個數，做不到就是不存在，沒有折衷。分段函數求極限，必定要分左右兩邊各自檢查，不可只看其中一段。",
    "options": [
      "存在，且等於 $5$",
      "存在，且等於 $7$",
      "不存在，因為左極限 $3$ 與右極限 $7$ 並不相等",
      "存在，且等於 $3$"
    ],
    "correctIndex": 2,
    "marks": 1,
    "contentEn": "Let $f(x) = \\begin{cases} 3 & x < 1 \\\\ 7 & x > 1 \\end{cases}$.\n\nDoes $\\lim_{x \\to 1} f(x)$ exist, and if so what is its value?",
    "optionsEn": [
      "It exists and equals $5$",
      "It exists and equals $7$",
      "It does not exist: the left-hand limit $3$ differs from the right-hand limit $7$",
      "It exists and equals $3$"
    ],
    "explanationEn": "A limit exists precisely when the left-hand and right-hand limits agree. Here they are $3$ and $7$. They differ, so the limit does not exist. Averaging them to $5$ or picking one side is not permitted — the limit requires both sides to approach the same value, and where they do not, there is no compromise. For a piecewise function, always check each side separately rather than reading off one branch.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "m2_rep_0040",
    "type": "mc",
    "subject": "m2",
    "topic": "limits",
    "topicZh": "極限",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "設 $f(x) = \\begin{cases} 4 & x < 3 \\\\ 4 & x > 3 \\end{cases}$。\n\n$\\lim_{x \\to 3} f(x)$ 是否存在？若存在，其值為何？",
    "explanation": "極限存在的條件是【左極限等於右極限】。本題左極限為 $4$，右極限為 $4$，兩者相等，故極限存在並等於 $4$。要留意：函數在 $x = 3$ 一點【有沒有定義】同極限是否存在完全無關 —— 極限只描述趨近的過程，不理會該點本身。分段函數求極限，必定要分左右兩邊各自檢查，不可只看其中一段。",
    "options": [
      "不存在，因為 $f(3)$ 沒有定義",
      "存在，且等於 $8$",
      "不存在，因為左極限與右極限並不相等",
      "存在，且等於 $4$"
    ],
    "correctIndex": 3,
    "marks": 1,
    "contentEn": "Let $f(x) = \\begin{cases} 4 & x < 3 \\\\ 4 & x > 3 \\end{cases}$.\n\nDoes $\\lim_{x \\to 3} f(x)$ exist, and if so what is its value?",
    "optionsEn": [
      "It does not exist, because $f(3)$ is undefined",
      "It exists and equals $8$",
      "It does not exist, because the one-sided limits differ",
      "It exists and equals $4$"
    ],
    "explanationEn": "A limit exists precisely when the left-hand and right-hand limits agree. Here they are $4$ and $4$. They agree, so the limit exists and equals $4$. Note that whether $f$ is *defined* at $x = 3$ is irrelevant: a limit describes the approach, not the point itself. For a piecewise function, always check each side separately rather than reading off one branch.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "m2_rep_0041",
    "type": "mc",
    "subject": "m2",
    "topic": "limits",
    "topicZh": "極限",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "設 $f(x) = \\begin{cases} 2 & x < -1 \\\\ 6 & x > -1 \\end{cases}$。\n\n$\\lim_{x \\to -1} f(x)$ 是否存在？若存在，其值為何？",
    "explanation": "極限存在的條件是【左極限等於右極限】。本題左極限為 $2$，右極限為 $6$，兩者不相等，故極限不存在。此時不可以取兩者的平均 $4$ 或任意一邊的值 —— 極限要求兩邊趨向同一個數，做不到就是不存在，沒有折衷。分段函數求極限，必定要分左右兩邊各自檢查，不可只看其中一段。",
    "options": [
      "不存在，因為左極限 $2$ 與右極限 $6$ 並不相等",
      "存在，且等於 $2$",
      "存在，且等於 $4$",
      "存在，且等於 $6$"
    ],
    "correctIndex": 0,
    "marks": 1,
    "contentEn": "Let $f(x) = \\begin{cases} 2 & x < -1 \\\\ 6 & x > -1 \\end{cases}$.\n\nDoes $\\lim_{x \\to -1} f(x)$ exist, and if so what is its value?",
    "optionsEn": [
      "It does not exist: the left-hand limit $2$ differs from the right-hand limit $6$",
      "It exists and equals $2$",
      "It exists and equals $4$",
      "It exists and equals $6$"
    ],
    "explanationEn": "A limit exists precisely when the left-hand and right-hand limits agree. Here they are $2$ and $6$. They differ, so the limit does not exist. Averaging them to $4$ or picking one side is not permitted — the limit requires both sides to approach the same value, and where they do not, there is no compromise. For a piecewise function, always check each side separately rather than reading off one branch.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "m2_rep_0042",
    "type": "mc",
    "subject": "m2",
    "topic": "linear_systems",
    "topicZh": "線性方程組",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "考慮方程組 $\\begin{cases} 2x + 1y = 7 \\\\ 1x + 3y = 9 \\end{cases}$。\n\n該方程組的解的情況是？",
    "explanation": "兩個二元一次方程有唯一解，當且僅當【係數行列式不為零】。此處 $\\begin{vmatrix} 2 & 1 \\\\ 1 & 3 \\end{vmatrix} = 2 \\times 3 - 1 \\times 1 = 5$，不為零，故有唯一解。幾何上，行列式為零即代表兩條直線平行或重合。方程數同未知數同為兩個，故「未知數多於方程」一項同題目不符。",
    "options": [
      "無法判斷，因為未知數多於方程",
      "有唯一解",
      "沒有解",
      "有無限多解"
    ],
    "correctIndex": 1,
    "marks": 1,
    "contentEn": "Consider $\\begin{cases} 2x + 1y = 7 \\\\ 1x + 3y = 9 \\end{cases}$.\n\nWhat can be said about its solutions?",
    "optionsEn": [
      "It cannot be decided, as there are more unknowns than equations",
      "There is a unique solution",
      "There is no solution",
      "There are infinitely many solutions"
    ],
    "explanationEn": "A pair of linear equations in two unknowns has a unique solution exactly when the coefficient determinant is non-zero. Here $\\begin{vmatrix} 2 & 1 \\\\ 1 & 3 \\end{vmatrix} = 2 \\times 3 - 1 \\times 1 = 5$, which is non-zero, so the solution is unique. Geometrically a zero determinant means the two lines are parallel or coincident. There are two equations and two unknowns, so the option about unknowns outnumbering equations does not apply.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "m2_rep_0043",
    "type": "mc",
    "subject": "m2",
    "topic": "linear_systems",
    "topicZh": "線性方程組",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "考慮方程組 $\\begin{cases} 1x + 2y = 7 \\\\ 2x + 4y = 9 \\end{cases}$。\n\n該方程組的解的情況是？",
    "explanation": "兩個二元一次方程有唯一解，當且僅當【係數行列式不為零】。此處 $\\begin{vmatrix} 1 & 2 \\\\ 2 & 4 \\end{vmatrix} = 1 \\times 4 - 2 \\times 2 = 0$，等於零，故【沒有】唯一解 —— 但零行列式只告訴我們唯一解不存在，究竟是無解還是無限多解，要看兩條方程是否成比例，不能一口斷定。幾何上，行列式為零即代表兩條直線平行或重合。方程數同未知數同為兩個，故「未知數多於方程」一項同題目不符。",
    "options": [
      "必定有無限多解",
      "無法判斷，因為未知數多於方程",
      "沒有唯一解（無解或有無限多解，須進一步檢查）",
      "有唯一解"
    ],
    "correctIndex": 2,
    "marks": 1,
    "contentEn": "Consider $\\begin{cases} 1x + 2y = 7 \\\\ 2x + 4y = 9 \\end{cases}$.\n\nWhat can be said about its solutions?",
    "optionsEn": [
      "There must be infinitely many solutions",
      "It cannot be decided, as there are more unknowns than equations",
      "There is no unique solution (either none or infinitely many — further checking needed)",
      "There is a unique solution"
    ],
    "explanationEn": "A pair of linear equations in two unknowns has a unique solution exactly when the coefficient determinant is non-zero. Here $\\begin{vmatrix} 1 & 2 \\\\ 2 & 4 \\end{vmatrix} = 1 \\times 4 - 2 \\times 2 = 0$, which is zero, so there is *no* unique solution — though a zero determinant only rules that out; whether there is no solution or infinitely many depends on whether the equations are proportional, which cannot be settled from the determinant alone. Geometrically a zero determinant means the two lines are parallel or coincident. There are two equations and two unknowns, so the option about unknowns outnumbering equations does not apply.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "m2_rep_0044",
    "type": "mc",
    "subject": "m2",
    "topic": "linear_systems",
    "topicZh": "線性方程組",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "考慮方程組 $\\begin{cases} 3x + 1y = 7 \\\\ 2x + 5y = 9 \\end{cases}$。\n\n該方程組的解的情況是？",
    "explanation": "兩個二元一次方程有唯一解，當且僅當【係數行列式不為零】。此處 $\\begin{vmatrix} 3 & 1 \\\\ 2 & 5 \\end{vmatrix} = 3 \\times 5 - 1 \\times 2 = 13$，不為零，故有唯一解。幾何上，行列式為零即代表兩條直線平行或重合。方程數同未知數同為兩個，故「未知數多於方程」一項同題目不符。",
    "options": [
      "沒有解",
      "有無限多解",
      "無法判斷，因為未知數多於方程",
      "有唯一解"
    ],
    "correctIndex": 3,
    "marks": 1,
    "contentEn": "Consider $\\begin{cases} 3x + 1y = 7 \\\\ 2x + 5y = 9 \\end{cases}$.\n\nWhat can be said about its solutions?",
    "optionsEn": [
      "There is no solution",
      "There are infinitely many solutions",
      "It cannot be decided, as there are more unknowns than equations",
      "There is a unique solution"
    ],
    "explanationEn": "A pair of linear equations in two unknowns has a unique solution exactly when the coefficient determinant is non-zero. Here $\\begin{vmatrix} 3 & 1 \\\\ 2 & 5 \\end{vmatrix} = 3 \\times 5 - 1 \\times 2 = 13$, which is non-zero, so the solution is unique. Geometrically a zero determinant means the two lines are parallel or coincident. There are two equations and two unknowns, so the option about unknowns outnumbering equations does not apply.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "m2_rep_0045",
    "type": "mc",
    "subject": "m2",
    "topic": "linear_systems",
    "topicZh": "線性方程組",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "考慮方程組 $\\begin{cases} 4x + 2y = 7 \\\\ 6x + 3y = 9 \\end{cases}$。\n\n該方程組的解的情況是？",
    "explanation": "兩個二元一次方程有唯一解，當且僅當【係數行列式不為零】。此處 $\\begin{vmatrix} 4 & 2 \\\\ 6 & 3 \\end{vmatrix} = 4 \\times 3 - 2 \\times 6 = 0$，等於零，故【沒有】唯一解 —— 但零行列式只告訴我們唯一解不存在，究竟是無解還是無限多解，要看兩條方程是否成比例，不能一口斷定。幾何上，行列式為零即代表兩條直線平行或重合。方程數同未知數同為兩個，故「未知數多於方程」一項同題目不符。",
    "options": [
      "沒有唯一解（無解或有無限多解，須進一步檢查）",
      "有唯一解",
      "必定有無限多解",
      "無法判斷，因為未知數多於方程"
    ],
    "correctIndex": 0,
    "marks": 1,
    "contentEn": "Consider $\\begin{cases} 4x + 2y = 7 \\\\ 6x + 3y = 9 \\end{cases}$.\n\nWhat can be said about its solutions?",
    "optionsEn": [
      "There is no unique solution (either none or infinitely many — further checking needed)",
      "There is a unique solution",
      "There must be infinitely many solutions",
      "It cannot be decided, as there are more unknowns than equations"
    ],
    "explanationEn": "A pair of linear equations in two unknowns has a unique solution exactly when the coefficient determinant is non-zero. Here $\\begin{vmatrix} 4 & 2 \\\\ 6 & 3 \\end{vmatrix} = 4 \\times 3 - 2 \\times 6 = 0$, which is zero, so there is *no* unique solution — though a zero determinant only rules that out; whether there is no solution or infinitely many depends on whether the equations are proportional, which cannot be settled from the determinant alone. Geometrically a zero determinant means the two lines are parallel or coincident. There are two equations and two unknowns, so the option about unknowns outnumbering equations does not apply.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "m2_rep_0046",
    "type": "mc",
    "subject": "m2",
    "topic": "linear_systems",
    "topicZh": "線性方程組",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "考慮方程組 $\\begin{cases} 1x + 3y = 7 \\\\ 2x + 6y = 9 \\end{cases}$。\n\n該方程組的解的情況是？",
    "explanation": "兩個二元一次方程有唯一解，當且僅當【係數行列式不為零】。此處 $\\begin{vmatrix} 1 & 3 \\\\ 2 & 6 \\end{vmatrix} = 1 \\times 6 - 3 \\times 2 = 0$，等於零，故【沒有】唯一解 —— 但零行列式只告訴我們唯一解不存在，究竟是無解還是無限多解，要看兩條方程是否成比例，不能一口斷定。幾何上，行列式為零即代表兩條直線平行或重合。方程數同未知數同為兩個，故「未知數多於方程」一項同題目不符。",
    "options": [
      "無法判斷，因為未知數多於方程",
      "沒有唯一解（無解或有無限多解，須進一步檢查）",
      "有唯一解",
      "必定有無限多解"
    ],
    "correctIndex": 1,
    "marks": 1,
    "contentEn": "Consider $\\begin{cases} 1x + 3y = 7 \\\\ 2x + 6y = 9 \\end{cases}$.\n\nWhat can be said about its solutions?",
    "optionsEn": [
      "It cannot be decided, as there are more unknowns than equations",
      "There is no unique solution (either none or infinitely many — further checking needed)",
      "There is a unique solution",
      "There must be infinitely many solutions"
    ],
    "explanationEn": "A pair of linear equations in two unknowns has a unique solution exactly when the coefficient determinant is non-zero. Here $\\begin{vmatrix} 1 & 3 \\\\ 2 & 6 \\end{vmatrix} = 1 \\times 6 - 3 \\times 2 = 0$, which is zero, so there is *no* unique solution — though a zero determinant only rules that out; whether there is no solution or infinitely many depends on whether the equations are proportional, which cannot be settled from the determinant alone. Geometrically a zero determinant means the two lines are parallel or coincident. There are two equations and two unknowns, so the option about unknowns outnumbering equations does not apply.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "m2_rep_0047",
    "type": "mc",
    "subject": "m2",
    "topic": "linear_systems",
    "topicZh": "線性方程組",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "考慮方程組 $\\begin{cases} 5x + 2y = 7 \\\\ 1x + 4y = 9 \\end{cases}$。\n\n該方程組的解的情況是？",
    "explanation": "兩個二元一次方程有唯一解，當且僅當【係數行列式不為零】。此處 $\\begin{vmatrix} 5 & 2 \\\\ 1 & 4 \\end{vmatrix} = 5 \\times 4 - 2 \\times 1 = 18$，不為零，故有唯一解。幾何上，行列式為零即代表兩條直線平行或重合。方程數同未知數同為兩個，故「未知數多於方程」一項同題目不符。",
    "options": [
      "有無限多解",
      "無法判斷，因為未知數多於方程",
      "有唯一解",
      "沒有解"
    ],
    "correctIndex": 2,
    "marks": 1,
    "contentEn": "Consider $\\begin{cases} 5x + 2y = 7 \\\\ 1x + 4y = 9 \\end{cases}$.\n\nWhat can be said about its solutions?",
    "optionsEn": [
      "There are infinitely many solutions",
      "It cannot be decided, as there are more unknowns than equations",
      "There is a unique solution",
      "There is no solution"
    ],
    "explanationEn": "A pair of linear equations in two unknowns has a unique solution exactly when the coefficient determinant is non-zero. Here $\\begin{vmatrix} 5 & 2 \\\\ 1 & 4 \\end{vmatrix} = 5 \\times 4 - 2 \\times 1 = 18$, which is non-zero, so the solution is unique. Geometrically a zero determinant means the two lines are parallel or coincident. There are two equations and two unknowns, so the option about unknowns outnumbering equations does not apply.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "m2_rep_0048",
    "type": "mc",
    "subject": "m2",
    "topic": "linear_systems",
    "topicZh": "線性方程組",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "考慮齊次方程組 $\\begin{cases} 2x + 4y = 0 \\\\ 3x + ky = 0 \\end{cases}$。\n\n求 $k$ 的值，使該方程組有【非零解】。",
    "explanation": "齊次方程組必定有零解（$x = y = 0$）；它有【非零】解，當且僅當係數行列式等於零。故 $\\begin{vmatrix} 2 & 4 \\\\ 3 & k \\end{vmatrix} = 2k - 12 = 0$，得 $k = 6$。「任何 $k$ 值皆可」一項混淆了兩件事：任何 $k$ 都能保證【零解】存在，但要有非零解就必須額外令行列式歸零。第一個干擾項漏了符號，第二個把兩條方程的係數對調了位置。",
    "options": [
      "$k = -6$",
      "$k = 1.5$",
      "任何 $k$ 值皆可",
      "$k = 6$"
    ],
    "correctIndex": 3,
    "marks": 1,
    "contentEn": "Consider the homogeneous system $\\begin{cases} 2x + 4y = 0 \\\\ 3x + ky = 0 \\end{cases}$.\n\nFind $k$ for which it has a *non-trivial* solution.",
    "optionsEn": [
      "$k = -6$",
      "$k = 1.5$",
      "Any value of $k$ will do",
      "$k = 6$"
    ],
    "explanationEn": "A homogeneous system always admits the trivial solution $x = y = 0$; it has a *non-trivial* solution exactly when the coefficient determinant vanishes. So $\\begin{vmatrix} 2 & 4 \\\\ 3 & k \\end{vmatrix} = 2k - 12 = 0$, giving $k = 6$. The option \"any $k$\" confuses two things: every $k$ guarantees the *trivial* solution, but a non-trivial one additionally requires the determinant to be zero. The first distractor drops a sign and the second swaps coefficients between the equations.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "m2_rep_0049",
    "type": "mc",
    "subject": "m2",
    "topic": "linear_systems",
    "topicZh": "線性方程組",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "考慮齊次方程組 $\\begin{cases} 3x + 6y = 0 \\\\ 3x + ky = 0 \\end{cases}$。\n\n求 $k$ 的值，使該方程組有【非零解】。",
    "explanation": "齊次方程組必定有零解（$x = y = 0$）；它有【非零】解，當且僅當係數行列式等於零。故 $\\begin{vmatrix} 3 & 6 \\\\ 3 & k \\end{vmatrix} = 3k - 18 = 0$，得 $k = 6$。「任何 $k$ 值皆可」一項混淆了兩件事：任何 $k$ 都能保證【零解】存在，但要有非零解就必須額外令行列式歸零。第一個干擾項漏了符號，第二個把兩條方程的係數對調了位置。",
    "options": [
      "$k = 6$",
      "$k = -6$",
      "$k = 1.5$",
      "任何 $k$ 值皆可"
    ],
    "correctIndex": 0,
    "marks": 1,
    "contentEn": "Consider the homogeneous system $\\begin{cases} 3x + 6y = 0 \\\\ 3x + ky = 0 \\end{cases}$.\n\nFind $k$ for which it has a *non-trivial* solution.",
    "optionsEn": [
      "$k = 6$",
      "$k = -6$",
      "$k = 1.5$",
      "Any value of $k$ will do"
    ],
    "explanationEn": "A homogeneous system always admits the trivial solution $x = y = 0$; it has a *non-trivial* solution exactly when the coefficient determinant vanishes. So $\\begin{vmatrix} 3 & 6 \\\\ 3 & k \\end{vmatrix} = 3k - 18 = 0$, giving $k = 6$. The option \"any $k$\" confuses two things: every $k$ guarantees the *trivial* solution, but a non-trivial one additionally requires the determinant to be zero. The first distractor drops a sign and the second swaps coefficients between the equations.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "m2_rep_0050",
    "type": "mc",
    "subject": "m2",
    "topic": "linear_systems",
    "topicZh": "線性方程組",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "考慮齊次方程組 $\\begin{cases} 1x + 5y = 0 \\\\ 3x + ky = 0 \\end{cases}$。\n\n求 $k$ 的值，使該方程組有【非零解】。",
    "explanation": "齊次方程組必定有零解（$x = y = 0$）；它有【非零】解，當且僅當係數行列式等於零。故 $\\begin{vmatrix} 1 & 5 \\\\ 3 & k \\end{vmatrix} = 1k - 15 = 0$，得 $k = 15$。「任何 $k$ 值皆可」一項混淆了兩件事：任何 $k$ 都能保證【零解】存在，但要有非零解就必須額外令行列式歸零。第一個干擾項漏了符號，第二個把兩條方程的係數對調了位置。",
    "options": [
      "任何 $k$ 值皆可",
      "$k = 15$",
      "$k = -15$",
      "$k = 0.6$"
    ],
    "correctIndex": 1,
    "marks": 1,
    "contentEn": "Consider the homogeneous system $\\begin{cases} 1x + 5y = 0 \\\\ 3x + ky = 0 \\end{cases}$.\n\nFind $k$ for which it has a *non-trivial* solution.",
    "optionsEn": [
      "Any value of $k$ will do",
      "$k = 15$",
      "$k = -15$",
      "$k = 0.6$"
    ],
    "explanationEn": "A homogeneous system always admits the trivial solution $x = y = 0$; it has a *non-trivial* solution exactly when the coefficient determinant vanishes. So $\\begin{vmatrix} 1 & 5 \\\\ 3 & k \\end{vmatrix} = 1k - 15 = 0$, giving $k = 15$. The option \"any $k$\" confuses two things: every $k$ guarantees the *trivial* solution, but a non-trivial one additionally requires the determinant to be zero. The first distractor drops a sign and the second swaps coefficients between the equations.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "m2_rep_0051",
    "type": "mc",
    "subject": "m2",
    "topic": "linear_systems",
    "topicZh": "線性方程組",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "考慮齊次方程組 $\\begin{cases} 4x + 2y = 0 \\\\ 3x + ky = 0 \\end{cases}$。\n\n求 $k$ 的值，使該方程組有【非零解】。",
    "explanation": "齊次方程組必定有零解（$x = y = 0$）；它有【非零】解，當且僅當係數行列式等於零。故 $\\begin{vmatrix} 4 & 2 \\\\ 3 & k \\end{vmatrix} = 4k - 6 = 0$，得 $k = 1.5$。「任何 $k$ 值皆可」一項混淆了兩件事：任何 $k$ 都能保證【零解】存在，但要有非零解就必須額外令行列式歸零。第一個干擾項漏了符號，第二個把兩條方程的係數對調了位置。",
    "options": [
      "$k = 6$",
      "任何 $k$ 值皆可",
      "$k = 1.5$",
      "$k = -1.5$"
    ],
    "correctIndex": 2,
    "marks": 1,
    "contentEn": "Consider the homogeneous system $\\begin{cases} 4x + 2y = 0 \\\\ 3x + ky = 0 \\end{cases}$.\n\nFind $k$ for which it has a *non-trivial* solution.",
    "optionsEn": [
      "$k = 6$",
      "Any value of $k$ will do",
      "$k = 1.5$",
      "$k = -1.5$"
    ],
    "explanationEn": "A homogeneous system always admits the trivial solution $x = y = 0$; it has a *non-trivial* solution exactly when the coefficient determinant vanishes. So $\\begin{vmatrix} 4 & 2 \\\\ 3 & k \\end{vmatrix} = 4k - 6 = 0$, giving $k = 1.5$. The option \"any $k$\" confuses two things: every $k$ guarantees the *trivial* solution, but a non-trivial one additionally requires the determinant to be zero. The first distractor drops a sign and the second swaps coefficients between the equations.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "m2_rep_0052",
    "type": "mc",
    "subject": "m2",
    "topic": "linear_systems",
    "topicZh": "線性方程組",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "medium",
    "year": 0,
    "content": "設實數 $x$、$y$、$z$ 同時滿足以下三項條件：\n\n$x + y + z = 7$　　$x - y + 2z = 7$　　$2x + y - z = 0$\n\n試求 $x$ 的值。",
    "explanation": "用消元法。第一式減第二式消去 $x$：$2y - z = 0$；第三式減第一式的兩倍消去 $x$：$-y - 3z = -14$。兩式聯立解得 $y = 2$、$z = 4$，代回第一式得 $x = 7 - 2 - 4 = 1$。三元方程組的關鍵在於【每次消去同一個未知數】，若第一步消 $x$、第二步卻消了 $y$，剩下的兩式仍有三個未知數，等於做了白工。其餘干擾項分別是 $y$ 與 $z$ 的值 —— 算對了方程組卻答錯了題目所問的那一個，是本類題目最可惜的失分。",
    "options": [
      "$x = 2$",
      "$x = 4$",
      "$x = 0$",
      "$x = 1$"
    ],
    "correctIndex": 3,
    "marks": 1,
    "contentEn": "Real numbers $x$, $y$ and $z$ satisfy all three conditions below:\n\n$x + y + z = 7$　　$x - y + 2z = 7$　　$2x + y - z = 0$\n\nFind the value of $x$.",
    "optionsEn": [
      "$x = 2$",
      "$x = 4$",
      "$x = 0$",
      "$x = 1$"
    ],
    "explanationEn": "Eliminate systematically. Subtracting the second equation from the first removes $x$: $2y - z = 0$. Subtracting twice the first from the third also removes $x$: $-y - 3z = -14$. Solving these two gives $y = 2$ and $z = 4$, and substituting back into the first equation gives $x = 7 - 2 - 4 = 1$. The key with three unknowns is to eliminate the *same* variable each time; eliminating $x$ first and $y$ second leaves two equations still carrying three unknowns. The other distractors are the values of $y$ and $z$ — solving the system correctly but answering for the wrong variable is the most frustrating way to lose these marks.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "m2_rep_0053",
    "type": "mc",
    "subject": "m2",
    "topic": "linear_systems",
    "topicZh": "線性方程組",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "medium",
    "year": 0,
    "content": "設實數 $x$、$y$、$z$ 同時滿足以下三項條件：\n\n$x + y + z = 2$　　$x - y + 2z = 5$　　$2x + y - z = 2$\n\n試求 $x$ 的值。",
    "explanation": "用消元法。第一式減第二式消去 $x$：$2y - z = -3$；第三式減第一式的兩倍消去 $x$：$-y - 3z = -2$。兩式聯立解得 $y = -1$、$z = 1$，代回第一式得 $x = 2 - -1 - 1 = 2$。三元方程組的關鍵在於【每次消去同一個未知數】，若第一步消 $x$、第二步卻消了 $y$，剩下的兩式仍有三個未知數，等於做了白工。其餘干擾項分別是 $y$ 與 $z$ 的值 —— 算對了方程組卻答錯了題目所問的那一個，是本類題目最可惜的失分。",
    "options": [
      "$x = 2$",
      "$x = -1$",
      "$x = 1$",
      "$x = -3$"
    ],
    "correctIndex": 0,
    "marks": 1,
    "contentEn": "Real numbers $x$, $y$ and $z$ satisfy all three conditions below:\n\n$x + y + z = 2$　　$x - y + 2z = 5$　　$2x + y - z = 2$\n\nFind the value of $x$.",
    "optionsEn": [
      "$x = 2$",
      "$x = -1$",
      "$x = 1$",
      "$x = -3$"
    ],
    "explanationEn": "Eliminate systematically. Subtracting the second equation from the first removes $x$: $2y - z = -3$. Subtracting twice the first from the third also removes $x$: $-y - 3z = -2$. Solving these two gives $y = -1$ and $z = 1$, and substituting back into the first equation gives $x = 2 - -1 - 1 = 2$. The key with three unknowns is to eliminate the *same* variable each time; eliminating $x$ first and $y$ second leaves two equations still carrying three unknowns. The other distractors are the values of $y$ and $z$ — solving the system correctly but answering for the wrong variable is the most frustrating way to lose these marks.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "m2_rep_0054",
    "type": "mc",
    "subject": "m2",
    "topic": "linear_systems",
    "topicZh": "線性方程組",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "medium",
    "year": 0,
    "content": "設實數 $x$、$y$、$z$ 同時滿足以下三項條件：\n\n$x + y + z = 4$　　$x - y + 2z = 0$　　$2x + y - z = -1$\n\n試求 $x$ 的值。",
    "explanation": "用消元法。第一式減第二式消去 $x$：$2y - z = 4$；第三式減第一式的兩倍消去 $x$：$-y - 3z = -9$。兩式聯立解得 $y = 3$、$z = 2$，代回第一式得 $x = 4 - 3 - 2 = -1$。三元方程組的關鍵在於【每次消去同一個未知數】，若第一步消 $x$、第二步卻消了 $y$，剩下的兩式仍有三個未知數，等於做了白工。其餘干擾項分別是 $y$ 與 $z$ 的值 —— 算對了方程組卻答錯了題目所問的那一個，是本類題目最可惜的失分。",
    "options": [
      "$x = 4$",
      "$x = -1$",
      "$x = 3$",
      "$x = 2$"
    ],
    "correctIndex": 1,
    "marks": 1,
    "contentEn": "Real numbers $x$, $y$ and $z$ satisfy all three conditions below:\n\n$x + y + z = 4$　　$x - y + 2z = 0$　　$2x + y - z = -1$\n\nFind the value of $x$.",
    "optionsEn": [
      "$x = 4$",
      "$x = -1$",
      "$x = 3$",
      "$x = 2$"
    ],
    "explanationEn": "Eliminate systematically. Subtracting the second equation from the first removes $x$: $2y - z = 4$. Subtracting twice the first from the third also removes $x$: $-y - 3z = -9$. Solving these two gives $y = 3$ and $z = 2$, and substituting back into the first equation gives $x = 4 - 3 - 2 = -1$. The key with three unknowns is to eliminate the *same* variable each time; eliminating $x$ first and $y$ second leaves two equations still carrying three unknowns. The other distractors are the values of $y$ and $z$ — solving the system correctly but answering for the wrong variable is the most frustrating way to lose these marks.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "m2_rep_0055",
    "type": "mc",
    "subject": "m2",
    "topic": "linear_systems",
    "topicZh": "線性方程組",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "medium",
    "year": 0,
    "content": "設實數 $x$、$y$、$z$ 同時滿足以下三項條件：\n\n$x + y + z = 2$　　$x - y + 2z = -2$　　$2x + y - z = 9$\n\n試求 $x$ 的值。",
    "explanation": "用消元法。第一式減第二式消去 $x$：$2y - z = 4$；第三式減第一式的兩倍消去 $x$：$-y - 3z = 5$。兩式聯立解得 $y = 1$、$z = -2$，代回第一式得 $x = 2 - 1 - -2 = 3$。三元方程組的關鍵在於【每次消去同一個未知數】，若第一步消 $x$、第二步卻消了 $y$，剩下的兩式仍有三個未知數，等於做了白工。其餘干擾項分別是 $y$ 與 $z$ 的值 —— 算對了方程組卻答錯了題目所問的那一個，是本類題目最可惜的失分。",
    "options": [
      "$x = -2$",
      "$x = 4$",
      "$x = 3$",
      "$x = 1$"
    ],
    "correctIndex": 2,
    "marks": 1,
    "contentEn": "Real numbers $x$, $y$ and $z$ satisfy all three conditions below:\n\n$x + y + z = 2$　　$x - y + 2z = -2$　　$2x + y - z = 9$\n\nFind the value of $x$.",
    "optionsEn": [
      "$x = -2$",
      "$x = 4$",
      "$x = 3$",
      "$x = 1$"
    ],
    "explanationEn": "Eliminate systematically. Subtracting the second equation from the first removes $x$: $2y - z = 4$. Subtracting twice the first from the third also removes $x$: $-y - 3z = 5$. Solving these two gives $y = 1$ and $z = -2$, and substituting back into the first equation gives $x = 2 - 1 - -2 = 3$. The key with three unknowns is to eliminate the *same* variable each time; eliminating $x$ first and $y$ second leaves two equations still carrying three unknowns. The other distractors are the values of $y$ and $z$ — solving the system correctly but answering for the wrong variable is the most frustrating way to lose these marks.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "m2_rep_0056",
    "type": "mc",
    "subject": "m2",
    "topic": "mathematical_induction",
    "topicZh": "數學歸納法",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "在數學歸納法的證明中，「奠基步驟」（起始步驟）的作用是甚麼？",
    "explanation": "奠基步驟只做一件事：確認第一塊骨牌真的倒下。若沒有它，即使歸納步驟成立，整條鏈也可能從未開始 —— 例如「$n$ 為正整數時 $n = n+1$」的歸納步驟形式上推得下去，但因為沒有任何一個 $n$ 使它成立，命題依然是假的。其餘三項分別是歸納假設、歸納步驟與整個證明的結論，都不是奠基步驟本身。",
    "options": [
      "證明命題對所有 $n$ 都成立",
      "假設命題在 $n = k$ 時成立",
      "推導出命題在 $n = k+1$ 時成立",
      "驗證命題在最小的一個 $n$ 值上成立，為整條推論鏈提供起點"
    ],
    "correctIndex": 3,
    "marks": 1,
    "contentEn": "In a proof by mathematical induction, what is the purpose of the base step?",
    "optionsEn": [
      "It proves the statement for all $n$",
      "It assumes the statement holds at $n = k$",
      "It deduces the statement at $n = k+1$",
      "It verifies the statement at the smallest value of $n$, giving the chain of reasoning a starting point"
    ],
    "explanationEn": "The base step does exactly one thing: it confirms that the first domino actually falls. Without it the chain may never start even when the inductive step is valid — the statement \"$n = n+1$ for positive integers\" has a formally workable inductive step, yet is false because no $n$ satisfies it. The other options describe the inductive hypothesis, the inductive step and the overall conclusion, none of which is the base step.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "m2_rep_0057",
    "type": "mc",
    "subject": "m2",
    "topic": "mathematical_induction",
    "topicZh": "數學歸納法",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "在數學歸納法中，「歸納假設」指的是甚麼？",
    "explanation": "歸納假設只假設【某一個】 $k$ 成立，然後據此推出 $k+1$ 亦成立。若一開始就假設「對所有 $n$ 成立」，那正是要證明的結論，等於循環論證 —— 這是初學者最常犯的邏輯錯誤。餘下兩項分別是奠基步驟與歸納步驟。",
    "options": [
      "假設命題在某一個 $n = k$ 時成立",
      "假設命題對所有 $n$ 都成立",
      "驗證命題在 $n = 1$ 時成立",
      "證明命題在 $n = k+1$ 時成立"
    ],
    "correctIndex": 0,
    "marks": 1,
    "contentEn": "In mathematical induction, what is the inductive hypothesis?",
    "optionsEn": [
      "It assumes the statement holds for one particular $n = k$",
      "It assumes the statement holds for every $n$",
      "It verifies the statement at $n = 1$",
      "It proves the statement at $n = k+1$"
    ],
    "explanationEn": "The inductive hypothesis assumes the statement holds for *one particular* $k$, and from that deduces it holds for $k+1$. Assuming it for all $n$ at the outset would assume the very conclusion being proved, which is circular — the commonest logical slip for beginners. The remaining options describe the base step and the inductive step.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "m2_rep_0058",
    "type": "mc",
    "subject": "m2",
    "topic": "mathematical_induction",
    "topicZh": "數學歸納法",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "若某命題的奠基步驟由 $n = 3$ 開始驗證，並已完成歸納步驟，則該證明確立了命題對哪些 $n$ 成立？",
    "explanation": "歸納法確立的範圍由奠基點起計。奠基於 $n = 3$，歸納步驟把 $3$ 推到 $4$、$4$ 推到 $5$，如此不斷，故涵蓋 $n \\geq 3$ 的所有正整數，而 $3$ 本身正是已驗證的一個，必須包括在內。$n = 1, 2$ 並未經任何步驟觸及，故不能宣稱成立 —— 這是本題的考點：結論的範圍不可超出奠基點。",
    "options": [
      "所有大於 $3$ 的正整數，但不包括 $3$ 本身",
      "所有大於或等於 $3$ 的正整數",
      "所有正整數",
      "只有 $n = 3$"
    ],
    "correctIndex": 1,
    "marks": 1,
    "contentEn": "If the base step is verified at $n = 3$ and the inductive step is complete, for which $n$ is the statement established?",
    "optionsEn": [
      "All positive integers greater than $3$, excluding $3$ itself",
      "All positive integers greater than or equal to $3$",
      "All positive integers",
      "Only $n = 3$"
    ],
    "explanationEn": "Induction establishes the statement from the base point onwards. Anchored at $n = 3$, the inductive step carries $3$ to $4$, $4$ to $5$, and so on, covering every integer $n \\geq 3$; and $3$ itself, having been verified directly, must be included. Nothing in the argument touches $n = 1$ or $2$, so no claim can be made there — the point being tested is that the conclusion cannot reach below the base point.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "m2_rep_0059",
    "type": "mc",
    "subject": "m2",
    "topic": "mathematical_induction",
    "topicZh": "數學歸納法",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "以下哪一項【不是】一個有效的數學歸納法證明所必需的？",
    "explanation": "歸納法的價值正在於【不需要】逐個驗證。命題涉及無限多個 $n$，逐個驗證永遠做不完；歸納法用「奠基 + 遞推」兩步取代無限次驗證，這正是它作為證明方法的意義所在。其餘三項都是必要組成部分，缺一則證明不成立。",
    "options": [
      "寫出歸納假設",
      "由 $n = k$ 推出 $n = k+1$",
      "驗證命題在每一個具體的 $n$ 值上成立",
      "驗證奠基步驟"
    ],
    "correctIndex": 2,
    "marks": 1,
    "contentEn": "Which of the following is *not* required in a valid proof by mathematical induction?",
    "optionsEn": [
      "Stating the inductive hypothesis",
      "Deducing $n = k+1$ from $n = k$",
      "Verifying the statement at every individual value of $n$",
      "Verifying the base step"
    ],
    "explanationEn": "The whole value of induction is that case-by-case checking is *not* needed. The statement concerns infinitely many $n$, so exhaustive verification could never finish; induction replaces it with two steps, a base case and a recursive one. The other three options are all indispensable parts of the proof.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "m2_rep_0060",
    "type": "mc",
    "subject": "m2",
    "topic": "mathematical_induction",
    "topicZh": "數學歸納法",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "某證明完成了歸納步驟，卻【沒有】驗證奠基步驟。該證明的效力如何？",
    "explanation": "歸納步驟只保證「若某個 $k$ 成立，則 $k+1$ 亦成立」，它本身並不保證有任何 $k$ 成立。缺了奠基，就像一排骨牌排得整整齊齊卻沒有人推第一塊。答「歸納步驟已足夠」的正是忽略了這一點。至於歸納假設，它在證明中是可以使用的 —— 使用它並非錯誤，錯誤在於沒有起點。",
    "options": [
      "成立，歸納步驟已足夠",
      "成立，但只適用於偶數",
      "不成立，因為歸納假設不可以使用",
      "不成立，因為缺少起點，推論鏈可能從未開始"
    ],
    "correctIndex": 3,
    "marks": 1,
    "contentEn": "A proof completes the inductive step but omits the base step. What is its status?",
    "optionsEn": [
      "Valid — the inductive step is enough on its own",
      "Valid, but only for even numbers",
      "Invalid, because the inductive hypothesis may not be used",
      "Invalid: with no starting point, the chain of reasoning may never begin"
    ],
    "explanationEn": "The inductive step only guarantees that *if* some $k$ works then $k+1$ works; it never establishes that any $k$ works. Without a base case the dominoes are lined up but nobody pushes the first one. Answering that the inductive step suffices overlooks exactly this. The inductive hypothesis itself is legitimate to use — using it is not the error; having no starting point is.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "m2_rep_0061",
    "type": "mc",
    "subject": "m2",
    "topic": "calculus_app",
    "topicZh": "微積分應用",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "medium",
    "year": 0,
    "content": "設 $f(x) = 1x^2 − 6x + 5$。求 $f(x)$ 的極小值。",
    "explanation": "極值出現在導函數為零之處。$f'(x) = 2x − 6$，令其為零得 $x = 3$。因為二次項係數 $1 > 0$，拋物線開口向上，此點為極小值點。把 $x = 3$ 代回【原函數】得極值 $f(3) = -4$。答 $3$ 的停在了使導數為零的 $x$ 值 —— 那是極值出現的【位置】，不是極值本身，這是本題最主要的失分位。答 $5$ 的把 $y$ 截距當成極值，兩者只在頂點恰好落在縱軸上時才相同。",
    "options": [
      "$-4$",
      "$3$",
      "$5$",
      "$4$"
    ],
    "correctIndex": 0,
    "marks": 1,
    "contentEn": "Let $f(x) = 1x^2 − 6x + 5$. Find the minimum value of $f(x)$.",
    "optionsEn": [
      "$-4$",
      "$3$",
      "$5$",
      "$4$"
    ],
    "explanationEn": "A turning point occurs where the derivative vanishes. $f'(x) = 2x − 6$, which is zero at $x = 3$. Since the coefficient of $x^2$ is $1 > 0$, the parabola opens upwards and this is a minimum. Substituting back into the *original* function gives $f(3) = -4$. Answering $3$ stops at the $x$-value where the derivative is zero — that is *where* the extremum occurs, not the extremum itself, and it is the main trap here. Answering $5$ mistakes the $y$-intercept for the extreme value; the two agree only when the vertex happens to sit on the $y$-axis.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "m2_rep_0062",
    "type": "mc",
    "subject": "m2",
    "topic": "calculus_app",
    "topicZh": "微積分應用",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "medium",
    "year": 0,
    "content": "設 $f(x) = 2x^2 − 8x + 3$。求 $f(x)$ 的極小值。",
    "explanation": "極值出現在導函數為零之處。$f'(x) = 4x − 8$，令其為零得 $x = 2$。因為二次項係數 $2 > 0$，拋物線開口向上，此點為極小值點。把 $x = 2$ 代回【原函數】得極值 $f(2) = -5$。答 $2$ 的停在了使導數為零的 $x$ 值 —— 那是極值出現的【位置】，不是極值本身，這是本題最主要的失分位。答 $3$ 的把 $y$ 截距當成極值，兩者只在頂點恰好落在縱軸上時才相同。",
    "options": [
      "$5$",
      "$-5$",
      "$2$",
      "$3$"
    ],
    "correctIndex": 1,
    "marks": 1,
    "contentEn": "Let $f(x) = 2x^2 − 8x + 3$. Find the minimum value of $f(x)$.",
    "optionsEn": [
      "$5$",
      "$-5$",
      "$2$",
      "$3$"
    ],
    "explanationEn": "A turning point occurs where the derivative vanishes. $f'(x) = 4x − 8$, which is zero at $x = 2$. Since the coefficient of $x^2$ is $2 > 0$, the parabola opens upwards and this is a minimum. Substituting back into the *original* function gives $f(2) = -5$. Answering $2$ stops at the $x$-value where the derivative is zero — that is *where* the extremum occurs, not the extremum itself, and it is the main trap here. Answering $3$ mistakes the $y$-intercept for the extreme value; the two agree only when the vertex happens to sit on the $y$-axis.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "m2_rep_0063",
    "type": "mc",
    "subject": "m2",
    "topic": "calculus_app",
    "topicZh": "微積分應用",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "medium",
    "year": 0,
    "content": "設 $f(x) = 1x^2 + 4x − 1$。求 $f(x)$ 的極小值。",
    "explanation": "極值出現在導函數為零之處。$f'(x) = 2x + 4$，令其為零得 $x = -2$。因為二次項係數 $1 > 0$，拋物線開口向上，此點為極小值點。把 $x = -2$ 代回【原函數】得極值 $f(-2) = -5$。答 $-2$ 的停在了使導數為零的 $x$ 值 —— 那是極值出現的【位置】，不是極值本身，這是本題最主要的失分位。答 $-1$ 的把 $y$ 截距當成極值，兩者只在頂點恰好落在縱軸上時才相同。",
    "options": [
      "$-1$",
      "$5$",
      "$-5$",
      "$-2$"
    ],
    "correctIndex": 2,
    "marks": 1,
    "contentEn": "Let $f(x) = 1x^2 + 4x − 1$. Find the minimum value of $f(x)$.",
    "optionsEn": [
      "$-1$",
      "$5$",
      "$-5$",
      "$-2$"
    ],
    "explanationEn": "A turning point occurs where the derivative vanishes. $f'(x) = 2x + 4$, which is zero at $x = -2$. Since the coefficient of $x^2$ is $1 > 0$, the parabola opens upwards and this is a minimum. Substituting back into the *original* function gives $f(-2) = -5$. Answering $-2$ stops at the $x$-value where the derivative is zero — that is *where* the extremum occurs, not the extremum itself, and it is the main trap here. Answering $-1$ mistakes the $y$-intercept for the extreme value; the two agree only when the vertex happens to sit on the $y$-axis.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "m2_rep_0064",
    "type": "mc",
    "subject": "m2",
    "topic": "calculus_app",
    "topicZh": "微積分應用",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "medium",
    "year": 0,
    "content": "設 $f(x) = 3x^2 − 12x + 7$。求 $f(x)$ 的極小值。",
    "explanation": "極值出現在導函數為零之處。$f'(x) = 6x − 12$，令其為零得 $x = 2$。因為二次項係數 $3 > 0$，拋物線開口向上，此點為極小值點。把 $x = 2$ 代回【原函數】得極值 $f(2) = -5$。答 $2$ 的停在了使導數為零的 $x$ 值 —— 那是極值出現的【位置】，不是極值本身，這是本題最主要的失分位。答 $7$ 的把 $y$ 截距當成極值，兩者只在頂點恰好落在縱軸上時才相同。",
    "options": [
      "$2$",
      "$7$",
      "$5$",
      "$-5$"
    ],
    "correctIndex": 3,
    "marks": 1,
    "contentEn": "Let $f(x) = 3x^2 − 12x + 7$. Find the minimum value of $f(x)$.",
    "optionsEn": [
      "$2$",
      "$7$",
      "$5$",
      "$-5$"
    ],
    "explanationEn": "A turning point occurs where the derivative vanishes. $f'(x) = 6x − 12$, which is zero at $x = 2$. Since the coefficient of $x^2$ is $3 > 0$, the parabola opens upwards and this is a minimum. Substituting back into the *original* function gives $f(2) = -5$. Answering $2$ stops at the $x$-value where the derivative is zero — that is *where* the extremum occurs, not the extremum itself, and it is the main trap here. Answering $7$ mistakes the $y$-intercept for the extreme value; the two agree only when the vertex happens to sit on the $y$-axis.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "m2_rep_0065",
    "type": "mc",
    "subject": "m2",
    "topic": "vectors",
    "topicZh": "向量",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "設 $\\vec{a} = (3, 4)$、$\\vec{b} = (2, t)$。求 $t$ 的值，使 $\\vec{a}$ 與 $\\vec{b}$ 互相垂直。",
    "explanation": "兩個非零向量垂直，當且僅當其純量積為零：$\\vec{a} \\cdot \\vec{b} = 3 \\times 2 + 4t = 0$，故 $t = -1.5$。可以代回檢查：$3 \\times 2 + 4 \\times -1.5 = 0$。第一個干擾項漏了負號 —— 純量積為零通常要求兩個分量的乘積互相抵銷，故 $t$ 的符號多數同 $\\vec{a}$ 的分量相反，見到答案同號就應該起疑。第二項把兩個分量的角色對調（那是【平行】的條件所用的比例關係）。垂直看純量積，平行看分量成比例，兩者不可混淆。",
    "options": [
      "$t = -1.5$",
      "$t = 1.5$",
      "$t = 2.6667$",
      "$t = 2$"
    ],
    "correctIndex": 0,
    "marks": 1,
    "contentEn": "Let $\\vec{a} = (3, 4)$ and $\\vec{b} = (2, t)$. Find $t$ so that $\\vec{a}$ and $\\vec{b}$ are perpendicular.",
    "optionsEn": [
      "$t = -1.5$",
      "$t = 1.5$",
      "$t = 2.6667$",
      "$t = 2$"
    ],
    "explanationEn": "Two non-zero vectors are perpendicular exactly when their scalar product is zero: $\\vec{a} \\cdot \\vec{b} = 3 \\times 2 + 4t = 0$, giving $t = -1.5$. Check by substituting: $3 \\times 2 + 4 \\times -1.5 = 0$. The first distractor drops the minus sign — a zero scalar product usually needs the two component products to cancel, so $t$ normally takes the opposite sign to the components of $\\vec{a}$; an answer with matching signs should raise suspicion. The second swaps the roles of the components, which belongs to the proportionality test for *parallel* vectors. Perpendicularity is tested by the scalar product, parallelism by proportional components; the two must not be confused.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "m2_rep_0066",
    "type": "mc",
    "subject": "m2",
    "topic": "vectors",
    "topicZh": "向量",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "設 $\\vec{a} = (2, -6)$、$\\vec{b} = (3, t)$。求 $t$ 的值，使 $\\vec{a}$ 與 $\\vec{b}$ 互相垂直。",
    "explanation": "兩個非零向量垂直，當且僅當其純量積為零：$\\vec{a} \\cdot \\vec{b} = 2 \\times 3 + -6t = 0$，故 $t = 1$。可以代回檢查：$2 \\times 3 + -6 \\times 1 = 0$。第一個干擾項漏了負號 —— 純量積為零通常要求兩個分量的乘積互相抵銷，故 $t$ 的符號多數同 $\\vec{a}$ 的分量相反，見到答案同號就應該起疑。第二項把兩個分量的角色對調（那是【平行】的條件所用的比例關係）。垂直看純量積，平行看分量成比例，兩者不可混淆。",
    "options": [
      "$t = -2$",
      "$t = 1$",
      "$t = -1$",
      "$t = -9$"
    ],
    "correctIndex": 1,
    "marks": 1,
    "contentEn": "Let $\\vec{a} = (2, -6)$ and $\\vec{b} = (3, t)$. Find $t$ so that $\\vec{a}$ and $\\vec{b}$ are perpendicular.",
    "optionsEn": [
      "$t = -2$",
      "$t = 1$",
      "$t = -1$",
      "$t = -9$"
    ],
    "explanationEn": "Two non-zero vectors are perpendicular exactly when their scalar product is zero: $\\vec{a} \\cdot \\vec{b} = 2 \\times 3 + -6t = 0$, giving $t = 1$. Check by substituting: $2 \\times 3 + -6 \\times 1 = 0$. The first distractor drops the minus sign — a zero scalar product usually needs the two component products to cancel, so $t$ normally takes the opposite sign to the components of $\\vec{a}$; an answer with matching signs should raise suspicion. The second swaps the roles of the components, which belongs to the proportionality test for *parallel* vectors. Perpendicularity is tested by the scalar product, parallelism by proportional components; the two must not be confused.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "m2_rep_0067",
    "type": "mc",
    "subject": "m2",
    "topic": "vectors",
    "topicZh": "向量",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "設 $\\vec{a} = (5, 2)$、$\\vec{b} = (4, t)$。求 $t$ 的值，使 $\\vec{a}$ 與 $\\vec{b}$ 互相垂直。",
    "explanation": "兩個非零向量垂直，當且僅當其純量積為零：$\\vec{a} \\cdot \\vec{b} = 5 \\times 4 + 2t = 0$，故 $t = -10$。可以代回檢查：$5 \\times 4 + 2 \\times -10 = 0$。第一個干擾項漏了負號 —— 純量積為零通常要求兩個分量的乘積互相抵銷，故 $t$ 的符號多數同 $\\vec{a}$ 的分量相反，見到答案同號就應該起疑。第二項把兩個分量的角色對調（那是【平行】的條件所用的比例關係）。垂直看純量積，平行看分量成比例，兩者不可混淆。",
    "options": [
      "$t = 1.6$",
      "$t = 0.5$",
      "$t = -10$",
      "$t = 10$"
    ],
    "correctIndex": 2,
    "marks": 1,
    "contentEn": "Let $\\vec{a} = (5, 2)$ and $\\vec{b} = (4, t)$. Find $t$ so that $\\vec{a}$ and $\\vec{b}$ are perpendicular.",
    "optionsEn": [
      "$t = 1.6$",
      "$t = 0.5$",
      "$t = -10$",
      "$t = 10$"
    ],
    "explanationEn": "Two non-zero vectors are perpendicular exactly when their scalar product is zero: $\\vec{a} \\cdot \\vec{b} = 5 \\times 4 + 2t = 0$, giving $t = -10$. Check by substituting: $5 \\times 4 + 2 \\times -10 = 0$. The first distractor drops the minus sign — a zero scalar product usually needs the two component products to cancel, so $t$ normally takes the opposite sign to the components of $\\vec{a}$; an answer with matching signs should raise suspicion. The second swaps the roles of the components, which belongs to the proportionality test for *parallel* vectors. Perpendicularity is tested by the scalar product, parallelism by proportional components; the two must not be confused.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "m2_rep_0068",
    "type": "mc",
    "subject": "m2",
    "topic": "vectors",
    "topicZh": "向量",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "設 $\\vec{a} = (1, 8)$、$\\vec{b} = (2, t)$。求 $t$ 的值，使 $\\vec{a}$ 與 $\\vec{b}$ 互相垂直。",
    "explanation": "兩個非零向量垂直，當且僅當其純量積為零：$\\vec{a} \\cdot \\vec{b} = 1 \\times 2 + 8t = 0$，故 $t = -0.25$。可以代回檢查：$1 \\times 2 + 8 \\times -0.25 = 0$。第一個干擾項漏了負號 —— 純量積為零通常要求兩個分量的乘積互相抵銷，故 $t$ 的符號多數同 $\\vec{a}$ 的分量相反，見到答案同號就應該起疑。第二項把兩個分量的角色對調（那是【平行】的條件所用的比例關係）。垂直看純量積，平行看分量成比例，兩者不可混淆。",
    "options": [
      "$t = 0.25$",
      "$t = 16$",
      "$t = 4$",
      "$t = -0.25$"
    ],
    "correctIndex": 3,
    "marks": 1,
    "contentEn": "Let $\\vec{a} = (1, 8)$ and $\\vec{b} = (2, t)$. Find $t$ so that $\\vec{a}$ and $\\vec{b}$ are perpendicular.",
    "optionsEn": [
      "$t = 0.25$",
      "$t = 16$",
      "$t = 4$",
      "$t = -0.25$"
    ],
    "explanationEn": "Two non-zero vectors are perpendicular exactly when their scalar product is zero: $\\vec{a} \\cdot \\vec{b} = 1 \\times 2 + 8t = 0$, giving $t = -0.25$. Check by substituting: $1 \\times 2 + 8 \\times -0.25 = 0$. The first distractor drops the minus sign — a zero scalar product usually needs the two component products to cancel, so $t$ normally takes the opposite sign to the components of $\\vec{a}$; an answer with matching signs should raise suspicion. The second swaps the roles of the components, which belongs to the proportionality test for *parallel* vectors. Perpendicularity is tested by the scalar product, parallelism by proportional components; the two must not be confused.",
    "frameworkEn": "Auto-gated"
  }
]
