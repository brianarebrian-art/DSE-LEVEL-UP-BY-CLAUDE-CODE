// AUTO-GATED question bank —— 由 scripts/qbank/auto-promote.mts 自動入庫。
// 【本檔題目未經真人逐題審批。】機器只能檢驗客觀項目：格式、選項、術語紅線、
// LaTeX、與現有題庫的重複度、topic id 是否已註冊。答案在學術上是否正確，
// 並不在此閘的能力範圍之內 —— 故出題端必須 correct-by-construction，或引用
// 可查證的原文。前端 QuestionProvenance 會如實向學生顯示
// 「經自動檢查 …本題未有實名逐題審批紀錄」。
//   subject  : chemistry
//   count    : 22  (easy 9 / medium 13 / hard 0)
//   types    : mc 22 / text 0 / long 0
//   updated  : 2026-08-21
// 請勿手動編輯 —— 修改將於下次執行 auto-promote 時被覆寫。
import type { Question } from './types'

export const chemistryAutoQuestions: Question[] = [
  {
    "id": "chem_rep_0001",
    "type": "mc",
    "subject": "chemistry",
    "topic": "stoichiometry",
    "topicZh": "化學計量",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "已知 NaCl 的摩爾質量為 $58.5$ g/mol。求 $11.7$ g NaCl 的物質的量（mol）。",
    "explanation": "物質的量由 $n = \\dfrac{m}{M}$ 求得，即 $\\dfrac{11.7}{58.5} = 0.2$ mol。把公式倒轉寫成 $\\dfrac{M}{m}$ 會得出 $5$，這是最常見的一種錯誤，可用單位檢查排除：g ÷ (g/mol) 的結果才是 mol。把除號誤作乘號則得出 $684.45$，數值遠大於合理範圍。另一個干擾項把摩爾質量誤取一半，源於混淆了摩爾質量與相對原子質量。",
    "options": [
      "$0.2$ mol",
      "$5$ mol",
      "$684.45$ mol",
      "$0.4$ mol"
    ],
    "correctIndex": 0,
    "marks": 1,
    "contentEn": "The molar mass of NaCl is $58.5$ g/mol. Find the number of moles in $11.7$ g of NaCl.",
    "optionsEn": [
      "$0.2$ mol",
      "$5$ mol",
      "$684.45$ mol",
      "$0.4$ mol"
    ],
    "explanationEn": "Use $n = \\dfrac{m}{M} = \\dfrac{11.7}{58.5} = 0.2$ mol. Inverting the formula to $\\dfrac{M}{m}$ gives $5$ — check the units: g ÷ (g/mol) yields mol, which only works one way round. Multiplying instead of dividing gives $684.45$, far outside a sensible range. The remaining distractor halves the molar mass, a slip that comes from confusing molar mass with relative atomic mass.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "chem_rep_0002",
    "type": "mc",
    "subject": "chemistry",
    "topic": "stoichiometry",
    "topicZh": "化學計量",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "已知 CaCO₃ 的摩爾質量為 $100$ g/mol。求 $25$ g CaCO₃ 的物質的量（mol）。",
    "explanation": "物質的量由 $n = \\dfrac{m}{M}$ 求得，即 $\\dfrac{25}{100} = 0.25$ mol。把公式倒轉寫成 $\\dfrac{M}{m}$ 會得出 $4$，這是最常見的一種錯誤，可用單位檢查排除：g ÷ (g/mol) 的結果才是 mol。把除號誤作乘號則得出 $2500$，數值遠大於合理範圍。另一個干擾項把摩爾質量誤取一半，源於混淆了摩爾質量與相對原子質量。",
    "options": [
      "$0.5$ mol",
      "$0.25$ mol",
      "$4$ mol",
      "$2500$ mol"
    ],
    "correctIndex": 1,
    "marks": 1,
    "contentEn": "The molar mass of CaCO₃ is $100$ g/mol. Find the number of moles in $25$ g of CaCO₃.",
    "optionsEn": [
      "$0.5$ mol",
      "$0.25$ mol",
      "$4$ mol",
      "$2500$ mol"
    ],
    "explanationEn": "Use $n = \\dfrac{m}{M} = \\dfrac{25}{100} = 0.25$ mol. Inverting the formula to $\\dfrac{M}{m}$ gives $4$ — check the units: g ÷ (g/mol) yields mol, which only works one way round. Multiplying instead of dividing gives $2500$, far outside a sensible range. The remaining distractor halves the molar mass, a slip that comes from confusing molar mass with relative atomic mass.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "chem_rep_0003",
    "type": "mc",
    "subject": "chemistry",
    "topic": "stoichiometry",
    "topicZh": "化學計量",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "已知 NaOH 的摩爾質量為 $40$ g/mol。求 $6$ g NaOH 的物質的量（mol）。",
    "explanation": "物質的量由 $n = \\dfrac{m}{M}$ 求得，即 $\\dfrac{6}{40} = 0.15$ mol。把公式倒轉寫成 $\\dfrac{M}{m}$ 會得出 $6.6667$，這是最常見的一種錯誤，可用單位檢查排除：g ÷ (g/mol) 的結果才是 mol。把除號誤作乘號則得出 $240$，數值遠大於合理範圍。另一個干擾項把摩爾質量誤取一半，源於混淆了摩爾質量與相對原子質量。",
    "options": [
      "$240$ mol",
      "$0.3$ mol",
      "$0.15$ mol",
      "$6.6667$ mol"
    ],
    "correctIndex": 2,
    "marks": 1,
    "contentEn": "The molar mass of NaOH is $40$ g/mol. Find the number of moles in $6$ g of NaOH.",
    "optionsEn": [
      "$240$ mol",
      "$0.3$ mol",
      "$0.15$ mol",
      "$6.6667$ mol"
    ],
    "explanationEn": "Use $n = \\dfrac{m}{M} = \\dfrac{6}{40} = 0.15$ mol. Inverting the formula to $\\dfrac{M}{m}$ gives $6.6667$ — check the units: g ÷ (g/mol) yields mol, which only works one way round. Multiplying instead of dividing gives $240$, far outside a sensible range. The remaining distractor halves the molar mass, a slip that comes from confusing molar mass with relative atomic mass.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "chem_rep_0004",
    "type": "mc",
    "subject": "chemistry",
    "topic": "stoichiometry",
    "topicZh": "化學計量",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "已知 CuO 的摩爾質量為 $79.5$ g/mol。求 $15.9$ g CuO 的物質的量（mol）。",
    "explanation": "物質的量由 $n = \\dfrac{m}{M}$ 求得，即 $\\dfrac{15.9}{79.5} = 0.2$ mol。把公式倒轉寫成 $\\dfrac{M}{m}$ 會得出 $5$，這是最常見的一種錯誤，可用單位檢查排除：g ÷ (g/mol) 的結果才是 mol。把除號誤作乘號則得出 $1264.05$，數值遠大於合理範圍。另一個干擾項把摩爾質量誤取一半，源於混淆了摩爾質量與相對原子質量。",
    "options": [
      "$5$ mol",
      "$1264.05$ mol",
      "$0.4$ mol",
      "$0.2$ mol"
    ],
    "correctIndex": 3,
    "marks": 1,
    "contentEn": "The molar mass of CuO is $79.5$ g/mol. Find the number of moles in $15.9$ g of CuO.",
    "optionsEn": [
      "$5$ mol",
      "$1264.05$ mol",
      "$0.4$ mol",
      "$0.2$ mol"
    ],
    "explanationEn": "Use $n = \\dfrac{m}{M} = \\dfrac{15.9}{79.5} = 0.2$ mol. Inverting the formula to $\\dfrac{M}{m}$ gives $5$ — check the units: g ÷ (g/mol) yields mol, which only works one way round. Multiplying instead of dividing gives $1264.05$, far outside a sensible range. The remaining distractor halves the molar mass, a slip that comes from confusing molar mass with relative atomic mass.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "chem_rep_0005",
    "type": "mc",
    "subject": "chemistry",
    "topic": "stoichiometry",
    "topicZh": "化學計量",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "已知 MgO 的摩爾質量為 $40$ g/mol。求 $14$ g MgO 的物質的量（mol）。",
    "explanation": "物質的量由 $n = \\dfrac{m}{M}$ 求得，即 $\\dfrac{14}{40} = 0.35$ mol。把公式倒轉寫成 $\\dfrac{M}{m}$ 會得出 $2.8571$，這是最常見的一種錯誤，可用單位檢查排除：g ÷ (g/mol) 的結果才是 mol。把除號誤作乘號則得出 $560$，數值遠大於合理範圍。另一個干擾項把摩爾質量誤取一半，源於混淆了摩爾質量與相對原子質量。",
    "options": [
      "$0.35$ mol",
      "$2.8571$ mol",
      "$560$ mol",
      "$0.7$ mol"
    ],
    "correctIndex": 0,
    "marks": 1,
    "contentEn": "The molar mass of MgO is $40$ g/mol. Find the number of moles in $14$ g of MgO.",
    "optionsEn": [
      "$0.35$ mol",
      "$2.8571$ mol",
      "$560$ mol",
      "$0.7$ mol"
    ],
    "explanationEn": "Use $n = \\dfrac{m}{M} = \\dfrac{14}{40} = 0.35$ mol. Inverting the formula to $\\dfrac{M}{m}$ gives $2.8571$ — check the units: g ÷ (g/mol) yields mol, which only works one way round. Multiplying instead of dividing gives $560$, far outside a sensible range. The remaining distractor halves the molar mass, a slip that comes from confusing molar mass with relative atomic mass.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "chem_rep_0006",
    "type": "mc",
    "subject": "chemistry",
    "topic": "stoichiometry",
    "topicZh": "化學計量",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "已知 H₂O 的摩爾質量為 $18$ g/mol。求 $4.5$ g H₂O 的物質的量（mol）。",
    "explanation": "物質的量由 $n = \\dfrac{m}{M}$ 求得，即 $\\dfrac{4.5}{18} = 0.25$ mol。把公式倒轉寫成 $\\dfrac{M}{m}$ 會得出 $4$，這是最常見的一種錯誤，可用單位檢查排除：g ÷ (g/mol) 的結果才是 mol。把除號誤作乘號則得出 $81$，數值遠大於合理範圍。另一個干擾項把摩爾質量誤取一半，源於混淆了摩爾質量與相對原子質量。",
    "options": [
      "$0.5$ mol",
      "$0.25$ mol",
      "$4$ mol",
      "$81$ mol"
    ],
    "correctIndex": 1,
    "marks": 1,
    "contentEn": "The molar mass of H₂O is $18$ g/mol. Find the number of moles in $4.5$ g of H₂O.",
    "optionsEn": [
      "$0.5$ mol",
      "$0.25$ mol",
      "$4$ mol",
      "$81$ mol"
    ],
    "explanationEn": "Use $n = \\dfrac{m}{M} = \\dfrac{4.5}{18} = 0.25$ mol. Inverting the formula to $\\dfrac{M}{m}$ gives $4$ — check the units: g ÷ (g/mol) yields mol, which only works one way round. Multiplying instead of dividing gives $81$, far outside a sensible range. The remaining distractor halves the molar mass, a slip that comes from confusing molar mass with relative atomic mass.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "chem_rep_0007",
    "type": "mc",
    "subject": "chemistry",
    "topic": "stoichiometry",
    "topicZh": "化學計量",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "medium",
    "year": 0,
    "content": "以 $0.5$ mol/dm³ 的 NaOH 溶液 $40$ cm³ 恰好中和 $25$ cm³ 的稀硫酸。\n\n反應方程式：$\\text{H}_2\\text{SO}_4 + 2\\text{NaOH} \\to \\text{Na}_2\\text{SO}_4 + 2\\text{H}_2\\text{O}$\n\n求該硫酸的摩爾濃度。",
    "explanation": "先求鹼的物質的量：$n(\\text{NaOH}) = 0.5 \\times \\dfrac{40}{1000} = 0.02$ mol。方程式顯示每 1 mol 硫酸消耗 2 mol 氫氧化鈉，故 $n(\\text{H}_2\\text{SO}_4) = 0.01$ mol，再除以酸的體積 $\\dfrac{25}{1000}$ dm³，得 $0.4$ mol/dm³。忽略 1 : 2 的計量比而直接代入 $c_1V_1 = c_2V_2$，會得出 $0.8$，這是本題最主要的失分位——該式只在計量比為 1 : 1 時成立。把比例用反則得 $1.6$。最後一項把兩個體積對調。",
    "options": [
      "$1.6$ mol/dm³",
      "$0.1563$ mol/dm³",
      "$0.4$ mol/dm³",
      "$0.8$ mol/dm³"
    ],
    "correctIndex": 2,
    "marks": 1,
    "contentEn": "$40$ cm³ of $0.5$ mol/dm³ NaOH exactly neutralises $25$ cm³ of dilute sulphuric acid.\n\nEquation: $\\text{H}_2\\text{SO}_4 + 2\\text{NaOH} \\to \\text{Na}_2\\text{SO}_4 + 2\\text{H}_2\\text{O}$\n\nFind the molarity of the acid.",
    "optionsEn": [
      "$1.6$ mol/dm³",
      "$0.1563$ mol/dm³",
      "$0.4$ mol/dm³",
      "$0.8$ mol/dm³"
    ],
    "explanationEn": "First, $n(\\text{NaOH}) = 0.5 \\times \\dfrac{40}{1000} = 0.02$ mol. The equation shows 1 mol of acid consumes 2 mol of base, so $n(\\text{H}_2\\text{SO}_4) = 0.01$ mol; dividing by $\\dfrac{25}{1000}$ dm³ gives $0.4$ mol/dm³. Applying $c_1V_1 = c_2V_2$ without the ratio gives $0.8$ — the main trap here, since that shortcut holds only for a 1 : 1 ratio. Using the ratio the wrong way round gives $1.6$, and the last distractor swaps the two volumes.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "chem_rep_0008",
    "type": "mc",
    "subject": "chemistry",
    "topic": "stoichiometry",
    "topicZh": "化學計量",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "medium",
    "year": 0,
    "content": "以 $1$ mol/dm³ 的 NaOH 溶液 $30$ cm³ 恰好中和 $20$ cm³ 的稀硫酸。\n\n反應方程式：$\\text{H}_2\\text{SO}_4 + 2\\text{NaOH} \\to \\text{Na}_2\\text{SO}_4 + 2\\text{H}_2\\text{O}$\n\n求該硫酸的摩爾濃度。",
    "explanation": "先求鹼的物質的量：$n(\\text{NaOH}) = 1 \\times \\dfrac{30}{1000} = 0.03$ mol。方程式顯示每 1 mol 硫酸消耗 2 mol 氫氧化鈉，故 $n(\\text{H}_2\\text{SO}_4) = 0.015$ mol，再除以酸的體積 $\\dfrac{20}{1000}$ dm³，得 $0.75$ mol/dm³。忽略 1 : 2 的計量比而直接代入 $c_1V_1 = c_2V_2$，會得出 $1.5$，這是本題最主要的失分位——該式只在計量比為 1 : 1 時成立。把比例用反則得 $3$。最後一項把兩個體積對調。",
    "options": [
      "$1.5$ mol/dm³",
      "$3$ mol/dm³",
      "$0.3333$ mol/dm³",
      "$0.75$ mol/dm³"
    ],
    "correctIndex": 3,
    "marks": 1,
    "contentEn": "$30$ cm³ of $1$ mol/dm³ NaOH exactly neutralises $20$ cm³ of dilute sulphuric acid.\n\nEquation: $\\text{H}_2\\text{SO}_4 + 2\\text{NaOH} \\to \\text{Na}_2\\text{SO}_4 + 2\\text{H}_2\\text{O}$\n\nFind the molarity of the acid.",
    "optionsEn": [
      "$1.5$ mol/dm³",
      "$3$ mol/dm³",
      "$0.3333$ mol/dm³",
      "$0.75$ mol/dm³"
    ],
    "explanationEn": "First, $n(\\text{NaOH}) = 1 \\times \\dfrac{30}{1000} = 0.03$ mol. The equation shows 1 mol of acid consumes 2 mol of base, so $n(\\text{H}_2\\text{SO}_4) = 0.015$ mol; dividing by $\\dfrac{20}{1000}$ dm³ gives $0.75$ mol/dm³. Applying $c_1V_1 = c_2V_2$ without the ratio gives $1.5$ — the main trap here, since that shortcut holds only for a 1 : 1 ratio. Using the ratio the wrong way round gives $3$, and the last distractor swaps the two volumes.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "chem_rep_0009",
    "type": "mc",
    "subject": "chemistry",
    "topic": "stoichiometry",
    "topicZh": "化學計量",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "medium",
    "year": 0,
    "content": "以 $0.2$ mol/dm³ 的 NaOH 溶液 $50$ cm³ 恰好中和 $25$ cm³ 的稀硫酸。\n\n反應方程式：$\\text{H}_2\\text{SO}_4 + 2\\text{NaOH} \\to \\text{Na}_2\\text{SO}_4 + 2\\text{H}_2\\text{O}$\n\n求該硫酸的摩爾濃度。",
    "explanation": "先求鹼的物質的量：$n(\\text{NaOH}) = 0.2 \\times \\dfrac{50}{1000} = 0.01$ mol。方程式顯示每 1 mol 硫酸消耗 2 mol 氫氧化鈉，故 $n(\\text{H}_2\\text{SO}_4) = 0.005$ mol，再除以酸的體積 $\\dfrac{25}{1000}$ dm³，得 $0.2$ mol/dm³。忽略 1 : 2 的計量比而直接代入 $c_1V_1 = c_2V_2$，會得出 $0.4$，這是本題最主要的失分位——該式只在計量比為 1 : 1 時成立。把比例用反則得 $0.8$。最後一項把兩個體積對調。",
    "options": [
      "$0.2$ mol/dm³",
      "$0.4$ mol/dm³",
      "$0.8$ mol/dm³",
      "$0.05$ mol/dm³"
    ],
    "correctIndex": 0,
    "marks": 1,
    "contentEn": "$50$ cm³ of $0.2$ mol/dm³ NaOH exactly neutralises $25$ cm³ of dilute sulphuric acid.\n\nEquation: $\\text{H}_2\\text{SO}_4 + 2\\text{NaOH} \\to \\text{Na}_2\\text{SO}_4 + 2\\text{H}_2\\text{O}$\n\nFind the molarity of the acid.",
    "optionsEn": [
      "$0.2$ mol/dm³",
      "$0.4$ mol/dm³",
      "$0.8$ mol/dm³",
      "$0.05$ mol/dm³"
    ],
    "explanationEn": "First, $n(\\text{NaOH}) = 0.2 \\times \\dfrac{50}{1000} = 0.01$ mol. The equation shows 1 mol of acid consumes 2 mol of base, so $n(\\text{H}_2\\text{SO}_4) = 0.005$ mol; dividing by $\\dfrac{25}{1000}$ dm³ gives $0.2$ mol/dm³. Applying $c_1V_1 = c_2V_2$ without the ratio gives $0.4$ — the main trap here, since that shortcut holds only for a 1 : 1 ratio. Using the ratio the wrong way round gives $0.8$, and the last distractor swaps the two volumes.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "chem_rep_0010",
    "type": "mc",
    "subject": "chemistry",
    "topic": "stoichiometry",
    "topicZh": "化學計量",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "medium",
    "year": 0,
    "content": "以 $0.4$ mol/dm³ 的 NaOH 溶液 $25$ cm³ 恰好中和 $20$ cm³ 的稀硫酸。\n\n反應方程式：$\\text{H}_2\\text{SO}_4 + 2\\text{NaOH} \\to \\text{Na}_2\\text{SO}_4 + 2\\text{H}_2\\text{O}$\n\n求該硫酸的摩爾濃度。",
    "explanation": "先求鹼的物質的量：$n(\\text{NaOH}) = 0.4 \\times \\dfrac{25}{1000} = 0.01$ mol。方程式顯示每 1 mol 硫酸消耗 2 mol 氫氧化鈉，故 $n(\\text{H}_2\\text{SO}_4) = 0.005$ mol，再除以酸的體積 $\\dfrac{20}{1000}$ dm³，得 $0.25$ mol/dm³。忽略 1 : 2 的計量比而直接代入 $c_1V_1 = c_2V_2$，會得出 $0.5$，這是本題最主要的失分位——該式只在計量比為 1 : 1 時成立。把比例用反則得 $1$。最後一項把兩個體積對調。",
    "options": [
      "$0.16$ mol/dm³",
      "$0.25$ mol/dm³",
      "$0.5$ mol/dm³",
      "$1$ mol/dm³"
    ],
    "correctIndex": 1,
    "marks": 1,
    "contentEn": "$25$ cm³ of $0.4$ mol/dm³ NaOH exactly neutralises $20$ cm³ of dilute sulphuric acid.\n\nEquation: $\\text{H}_2\\text{SO}_4 + 2\\text{NaOH} \\to \\text{Na}_2\\text{SO}_4 + 2\\text{H}_2\\text{O}$\n\nFind the molarity of the acid.",
    "optionsEn": [
      "$0.16$ mol/dm³",
      "$0.25$ mol/dm³",
      "$0.5$ mol/dm³",
      "$1$ mol/dm³"
    ],
    "explanationEn": "First, $n(\\text{NaOH}) = 0.4 \\times \\dfrac{25}{1000} = 0.01$ mol. The equation shows 1 mol of acid consumes 2 mol of base, so $n(\\text{H}_2\\text{SO}_4) = 0.005$ mol; dividing by $\\dfrac{20}{1000}$ dm³ gives $0.25$ mol/dm³. Applying $c_1V_1 = c_2V_2$ without the ratio gives $0.5$ — the main trap here, since that shortcut holds only for a 1 : 1 ratio. Using the ratio the wrong way round gives $1$, and the last distractor swaps the two volumes.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "chem_rep_0011",
    "type": "mc",
    "subject": "chemistry",
    "topic": "stoichiometry",
    "topicZh": "化學計量",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "medium",
    "year": 0,
    "content": "以 $2$ mol/dm³ 的 NaOH 溶液 $20$ cm³ 恰好中和 $25$ cm³ 的稀硫酸。\n\n反應方程式：$\\text{H}_2\\text{SO}_4 + 2\\text{NaOH} \\to \\text{Na}_2\\text{SO}_4 + 2\\text{H}_2\\text{O}$\n\n求該硫酸的摩爾濃度。",
    "explanation": "先求鹼的物質的量：$n(\\text{NaOH}) = 2 \\times \\dfrac{20}{1000} = 0.04$ mol。方程式顯示每 1 mol 硫酸消耗 2 mol 氫氧化鈉，故 $n(\\text{H}_2\\text{SO}_4) = 0.02$ mol，再除以酸的體積 $\\dfrac{25}{1000}$ dm³，得 $0.8$ mol/dm³。忽略 1 : 2 的計量比而直接代入 $c_1V_1 = c_2V_2$，會得出 $1.6$，這是本題最主要的失分位——該式只在計量比為 1 : 1 時成立。把比例用反則得 $3.2$。最後一項把兩個體積對調。",
    "options": [
      "$3.2$ mol/dm³",
      "$1.25$ mol/dm³",
      "$0.8$ mol/dm³",
      "$1.6$ mol/dm³"
    ],
    "correctIndex": 2,
    "marks": 1,
    "contentEn": "$20$ cm³ of $2$ mol/dm³ NaOH exactly neutralises $25$ cm³ of dilute sulphuric acid.\n\nEquation: $\\text{H}_2\\text{SO}_4 + 2\\text{NaOH} \\to \\text{Na}_2\\text{SO}_4 + 2\\text{H}_2\\text{O}$\n\nFind the molarity of the acid.",
    "optionsEn": [
      "$3.2$ mol/dm³",
      "$1.25$ mol/dm³",
      "$0.8$ mol/dm³",
      "$1.6$ mol/dm³"
    ],
    "explanationEn": "First, $n(\\text{NaOH}) = 2 \\times \\dfrac{20}{1000} = 0.04$ mol. The equation shows 1 mol of acid consumes 2 mol of base, so $n(\\text{H}_2\\text{SO}_4) = 0.02$ mol; dividing by $\\dfrac{25}{1000}$ dm³ gives $0.8$ mol/dm³. Applying $c_1V_1 = c_2V_2$ without the ratio gives $1.6$ — the main trap here, since that shortcut holds only for a 1 : 1 ratio. Using the ratio the wrong way round gives $3.2$, and the last distractor swaps the two volumes.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "chem_rep_0012",
    "type": "mc",
    "subject": "chemistry",
    "topic": "stoichiometry",
    "topicZh": "化學計量",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "medium",
    "year": 0,
    "content": "以 $0.8$ mol/dm³ 的 NaOH 溶液 $50$ cm³ 恰好中和 $40$ cm³ 的稀硫酸。\n\n反應方程式：$\\text{H}_2\\text{SO}_4 + 2\\text{NaOH} \\to \\text{Na}_2\\text{SO}_4 + 2\\text{H}_2\\text{O}$\n\n求該硫酸的摩爾濃度。",
    "explanation": "先求鹼的物質的量：$n(\\text{NaOH}) = 0.8 \\times \\dfrac{50}{1000} = 0.04$ mol。方程式顯示每 1 mol 硫酸消耗 2 mol 氫氧化鈉，故 $n(\\text{H}_2\\text{SO}_4) = 0.02$ mol，再除以酸的體積 $\\dfrac{40}{1000}$ dm³，得 $0.5$ mol/dm³。忽略 1 : 2 的計量比而直接代入 $c_1V_1 = c_2V_2$，會得出 $1$，這是本題最主要的失分位——該式只在計量比為 1 : 1 時成立。把比例用反則得 $2$。最後一項把兩個體積對調。",
    "options": [
      "$1$ mol/dm³",
      "$2$ mol/dm³",
      "$0.32$ mol/dm³",
      "$0.5$ mol/dm³"
    ],
    "correctIndex": 3,
    "marks": 1,
    "contentEn": "$50$ cm³ of $0.8$ mol/dm³ NaOH exactly neutralises $40$ cm³ of dilute sulphuric acid.\n\nEquation: $\\text{H}_2\\text{SO}_4 + 2\\text{NaOH} \\to \\text{Na}_2\\text{SO}_4 + 2\\text{H}_2\\text{O}$\n\nFind the molarity of the acid.",
    "optionsEn": [
      "$1$ mol/dm³",
      "$2$ mol/dm³",
      "$0.32$ mol/dm³",
      "$0.5$ mol/dm³"
    ],
    "explanationEn": "First, $n(\\text{NaOH}) = 0.8 \\times \\dfrac{50}{1000} = 0.04$ mol. The equation shows 1 mol of acid consumes 2 mol of base, so $n(\\text{H}_2\\text{SO}_4) = 0.02$ mol; dividing by $\\dfrac{40}{1000}$ dm³ gives $0.5$ mol/dm³. Applying $c_1V_1 = c_2V_2$ without the ratio gives $1$ — the main trap here, since that shortcut holds only for a 1 : 1 ratio. Using the ratio the wrong way round gives $2$, and the last distractor swaps the two volumes.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "chem_rep_0013",
    "type": "mc",
    "subject": "chemistry",
    "topic": "stoichiometry",
    "topicZh": "化學計量",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "medium",
    "year": 0,
    "content": "$12$ g 鎂在足量氧氣中完全燃燒。\n\n反應方程式：$2\\text{Mg} + \\text{O}_2 \\to 2\\text{MgO}$；摩爾質量：Mg $= 24$ g/mol，MgO $= 40$ g/mol。\n\n求所生成氧化鎂的質量。",
    "explanation": "先求鎂的物質的量：$\\dfrac{12}{24} = 0.5$ mol。方程式中 Mg 與 MgO 的係數同為 2，計量比是 1 : 1，故生成 $0.5$ mol MgO，質量為 $0.5 \\times 40 = 20$ g。答 $12$ g 的學生把質量守恆理解錯了：守恆的是反應物與生成物的【總】質量，氧的質量亦計算在內，故產物必定重於原來的鎂。第二個干擾項把兩個摩爾質量對調。第三個把係數 2 重複計算了一次——係數已在 1 : 1 的比例中反映，不可再乘。",
    "options": [
      "$20$ g",
      "$12$ g",
      "$7.2$ g",
      "$40$ g"
    ],
    "correctIndex": 0,
    "marks": 1,
    "contentEn": "$12$ g of magnesium burns completely in excess oxygen.\n\nEquation: $2\\text{Mg} + \\text{O}_2 \\to 2\\text{MgO}$; molar masses: Mg $= 24$ g/mol, MgO $= 40$ g/mol.\n\nFind the mass of magnesium oxide formed.",
    "optionsEn": [
      "$20$ g",
      "$12$ g",
      "$7.2$ g",
      "$40$ g"
    ],
    "explanationEn": "First, $n(\\text{Mg}) = \\dfrac{12}{24} = 0.5$ mol. Mg and MgO both carry the coefficient 2, so the ratio is 1 : 1 and $0.5$ mol of MgO forms, with mass $0.5 \\times 40 = 20$ g. Choosing $12$ g misreads conservation of mass: what is conserved is the *total* mass including the oxygen, so the product must be heavier than the magnesium. The second distractor swaps the two molar masses; the third applies the coefficient 2 twice, although it is already accounted for in the 1 : 1 ratio.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "chem_rep_0014",
    "type": "mc",
    "subject": "chemistry",
    "topic": "stoichiometry",
    "topicZh": "化學計量",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "medium",
    "year": 0,
    "content": "$24$ g 鎂在足量氧氣中完全燃燒。\n\n反應方程式：$2\\text{Mg} + \\text{O}_2 \\to 2\\text{MgO}$；摩爾質量：Mg $= 24$ g/mol，MgO $= 40$ g/mol。\n\n求所生成氧化鎂的質量。",
    "explanation": "先求鎂的物質的量：$\\dfrac{24}{24} = 1$ mol。方程式中 Mg 與 MgO 的係數同為 2，計量比是 1 : 1，故生成 $1$ mol MgO，質量為 $1 \\times 40 = 40$ g。答 $24$ g 的學生把質量守恆理解錯了：守恆的是反應物與生成物的【總】質量，氧的質量亦計算在內，故產物必定重於原來的鎂。第二個干擾項把兩個摩爾質量對調。第三個把係數 2 重複計算了一次——係數已在 1 : 1 的比例中反映，不可再乘。",
    "options": [
      "$80$ g",
      "$40$ g",
      "$24$ g",
      "$14.4$ g"
    ],
    "correctIndex": 1,
    "marks": 1,
    "contentEn": "$24$ g of magnesium burns completely in excess oxygen.\n\nEquation: $2\\text{Mg} + \\text{O}_2 \\to 2\\text{MgO}$; molar masses: Mg $= 24$ g/mol, MgO $= 40$ g/mol.\n\nFind the mass of magnesium oxide formed.",
    "optionsEn": [
      "$80$ g",
      "$40$ g",
      "$24$ g",
      "$14.4$ g"
    ],
    "explanationEn": "First, $n(\\text{Mg}) = \\dfrac{24}{24} = 1$ mol. Mg and MgO both carry the coefficient 2, so the ratio is 1 : 1 and $1$ mol of MgO forms, with mass $1 \\times 40 = 40$ g. Choosing $24$ g misreads conservation of mass: what is conserved is the *total* mass including the oxygen, so the product must be heavier than the magnesium. The second distractor swaps the two molar masses; the third applies the coefficient 2 twice, although it is already accounted for in the 1 : 1 ratio.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "chem_rep_0015",
    "type": "mc",
    "subject": "chemistry",
    "topic": "stoichiometry",
    "topicZh": "化學計量",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "medium",
    "year": 0,
    "content": "$6$ g 鎂在足量氧氣中完全燃燒。\n\n反應方程式：$2\\text{Mg} + \\text{O}_2 \\to 2\\text{MgO}$；摩爾質量：Mg $= 24$ g/mol，MgO $= 40$ g/mol。\n\n求所生成氧化鎂的質量。",
    "explanation": "先求鎂的物質的量：$\\dfrac{6}{24} = 0.25$ mol。方程式中 Mg 與 MgO 的係數同為 2，計量比是 1 : 1，故生成 $0.25$ mol MgO，質量為 $0.25 \\times 40 = 10$ g。答 $6$ g 的學生把質量守恆理解錯了：守恆的是反應物與生成物的【總】質量，氧的質量亦計算在內，故產物必定重於原來的鎂。第二個干擾項把兩個摩爾質量對調。第三個把係數 2 重複計算了一次——係數已在 1 : 1 的比例中反映，不可再乘。",
    "options": [
      "$3.6$ g",
      "$20$ g",
      "$10$ g",
      "$6$ g"
    ],
    "correctIndex": 2,
    "marks": 1,
    "contentEn": "$6$ g of magnesium burns completely in excess oxygen.\n\nEquation: $2\\text{Mg} + \\text{O}_2 \\to 2\\text{MgO}$; molar masses: Mg $= 24$ g/mol, MgO $= 40$ g/mol.\n\nFind the mass of magnesium oxide formed.",
    "optionsEn": [
      "$3.6$ g",
      "$20$ g",
      "$10$ g",
      "$6$ g"
    ],
    "explanationEn": "First, $n(\\text{Mg}) = \\dfrac{6}{24} = 0.25$ mol. Mg and MgO both carry the coefficient 2, so the ratio is 1 : 1 and $0.25$ mol of MgO forms, with mass $0.25 \\times 40 = 10$ g. Choosing $6$ g misreads conservation of mass: what is conserved is the *total* mass including the oxygen, so the product must be heavier than the magnesium. The second distractor swaps the two molar masses; the third applies the coefficient 2 twice, although it is already accounted for in the 1 : 1 ratio.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "chem_rep_0016",
    "type": "mc",
    "subject": "chemistry",
    "topic": "stoichiometry",
    "topicZh": "化學計量",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "medium",
    "year": 0,
    "content": "$48$ g 鎂在足量氧氣中完全燃燒。\n\n反應方程式：$2\\text{Mg} + \\text{O}_2 \\to 2\\text{MgO}$；摩爾質量：Mg $= 24$ g/mol，MgO $= 40$ g/mol。\n\n求所生成氧化鎂的質量。",
    "explanation": "先求鎂的物質的量：$\\dfrac{48}{24} = 2$ mol。方程式中 Mg 與 MgO 的係數同為 2，計量比是 1 : 1，故生成 $2$ mol MgO，質量為 $2 \\times 40 = 80$ g。答 $48$ g 的學生把質量守恆理解錯了：守恆的是反應物與生成物的【總】質量，氧的質量亦計算在內，故產物必定重於原來的鎂。第二個干擾項把兩個摩爾質量對調。第三個把係數 2 重複計算了一次——係數已在 1 : 1 的比例中反映，不可再乘。",
    "options": [
      "$48$ g",
      "$28.8$ g",
      "$160$ g",
      "$80$ g"
    ],
    "correctIndex": 3,
    "marks": 1,
    "contentEn": "$48$ g of magnesium burns completely in excess oxygen.\n\nEquation: $2\\text{Mg} + \\text{O}_2 \\to 2\\text{MgO}$; molar masses: Mg $= 24$ g/mol, MgO $= 40$ g/mol.\n\nFind the mass of magnesium oxide formed.",
    "optionsEn": [
      "$48$ g",
      "$28.8$ g",
      "$160$ g",
      "$80$ g"
    ],
    "explanationEn": "First, $n(\\text{Mg}) = \\dfrac{48}{24} = 2$ mol. Mg and MgO both carry the coefficient 2, so the ratio is 1 : 1 and $2$ mol of MgO forms, with mass $2 \\times 40 = 80$ g. Choosing $48$ g misreads conservation of mass: what is conserved is the *total* mass including the oxygen, so the product must be heavier than the magnesium. The second distractor swaps the two molar masses; the third applies the coefficient 2 twice, although it is already accounted for in the 1 : 1 ratio.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "chem_rep_0017",
    "type": "mc",
    "subject": "chemistry",
    "topic": "concentration",
    "topicZh": "濃度",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "將 $8$ g 氫氧化鈉（摩爾質量 $= 40$ g/mol）完全溶於水中，配成 $0.5$ dm³ 溶液。求該溶液的摩爾濃度。",
    "explanation": "摩爾濃度須以【物質的量】而非質量計算，故要分兩步：先求 $n = \\dfrac{8}{40} = 0.2$ mol，再除以體積 $c = \\dfrac{0.2}{0.5} = 0.4$ mol/dm³。直接用質量除以體積得 $16$，漏了轉換為物質的量這一步，是本題最常見的錯誤；由單位可以立即察覺——所得的是 g/dm³ 而非 mol/dm³。第二個干擾項把除以摩爾質量誤作乘以摩爾質量；第三個把除以體積誤作乘以體積。",
    "options": [
      "$0.4$ mol/dm³",
      "$16$ mol/dm³",
      "$640$ mol/dm³",
      "$0.1$ mol/dm³"
    ],
    "correctIndex": 0,
    "marks": 1,
    "contentEn": "$8$ g of sodium hydroxide (molar mass $= 40$ g/mol) is dissolved in water to make $0.5$ dm³ of solution. Find its molarity.",
    "optionsEn": [
      "$0.4$ mol/dm³",
      "$16$ mol/dm³",
      "$640$ mol/dm³",
      "$0.1$ mol/dm³"
    ],
    "explanationEn": "Molarity is defined per *mole*, not per gram, so two steps are needed: $n = \\dfrac{8}{40} = 0.2$ mol, then $c = \\dfrac{0.2}{0.5} = 0.4$ mol/dm³. Dividing mass by volume directly gives $16$ and skips the conversion — the units give it away, since that result is g/dm³, not mol/dm³. The second distractor multiplies by the molar mass instead of dividing; the third multiplies by the volume instead of dividing.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "chem_rep_0018",
    "type": "mc",
    "subject": "chemistry",
    "topic": "concentration",
    "topicZh": "濃度",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "將 $20$ g 氫氧化鈉（摩爾質量 $= 40$ g/mol）完全溶於水中，配成 $2$ dm³ 溶液。求該溶液的摩爾濃度。",
    "explanation": "摩爾濃度須以【物質的量】而非質量計算，故要分兩步：先求 $n = \\dfrac{20}{40} = 0.5$ mol，再除以體積 $c = \\dfrac{0.5}{2} = 0.25$ mol/dm³。直接用質量除以體積得 $10$，漏了轉換為物質的量這一步，是本題最常見的錯誤；由單位可以立即察覺——所得的是 g/dm³ 而非 mol/dm³。第二個干擾項把除以摩爾質量誤作乘以摩爾質量；第三個把除以體積誤作乘以體積。",
    "options": [
      "$1$ mol/dm³",
      "$0.25$ mol/dm³",
      "$10$ mol/dm³",
      "$400$ mol/dm³"
    ],
    "correctIndex": 1,
    "marks": 1,
    "contentEn": "$20$ g of sodium hydroxide (molar mass $= 40$ g/mol) is dissolved in water to make $2$ dm³ of solution. Find its molarity.",
    "optionsEn": [
      "$1$ mol/dm³",
      "$0.25$ mol/dm³",
      "$10$ mol/dm³",
      "$400$ mol/dm³"
    ],
    "explanationEn": "Molarity is defined per *mole*, not per gram, so two steps are needed: $n = \\dfrac{20}{40} = 0.5$ mol, then $c = \\dfrac{0.5}{2} = 0.25$ mol/dm³. Dividing mass by volume directly gives $10$ and skips the conversion — the units give it away, since that result is g/dm³, not mol/dm³. The second distractor multiplies by the molar mass instead of dividing; the third multiplies by the volume instead of dividing.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "chem_rep_0019",
    "type": "mc",
    "subject": "chemistry",
    "topic": "concentration",
    "topicZh": "濃度",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "將 $4$ g 氫氧化鈉（摩爾質量 $= 40$ g/mol）完全溶於水中，配成 $0.25$ dm³ 溶液。求該溶液的摩爾濃度。",
    "explanation": "摩爾濃度須以【物質的量】而非質量計算，故要分兩步：先求 $n = \\dfrac{4}{40} = 0.1$ mol，再除以體積 $c = \\dfrac{0.1}{0.25} = 0.4$ mol/dm³。直接用質量除以體積得 $16$，漏了轉換為物質的量這一步，是本題最常見的錯誤；由單位可以立即察覺——所得的是 g/dm³ 而非 mol/dm³。第二個干擾項把除以摩爾質量誤作乘以摩爾質量；第三個把除以體積誤作乘以體積。",
    "options": [
      "$640$ mol/dm³",
      "$0.025$ mol/dm³",
      "$0.4$ mol/dm³",
      "$16$ mol/dm³"
    ],
    "correctIndex": 2,
    "marks": 1,
    "contentEn": "$4$ g of sodium hydroxide (molar mass $= 40$ g/mol) is dissolved in water to make $0.25$ dm³ of solution. Find its molarity.",
    "optionsEn": [
      "$640$ mol/dm³",
      "$0.025$ mol/dm³",
      "$0.4$ mol/dm³",
      "$16$ mol/dm³"
    ],
    "explanationEn": "Molarity is defined per *mole*, not per gram, so two steps are needed: $n = \\dfrac{4}{40} = 0.1$ mol, then $c = \\dfrac{0.1}{0.25} = 0.4$ mol/dm³. Dividing mass by volume directly gives $16$ and skips the conversion — the units give it away, since that result is g/dm³, not mol/dm³. The second distractor multiplies by the molar mass instead of dividing; the third multiplies by the volume instead of dividing.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "chem_rep_0020",
    "type": "mc",
    "subject": "chemistry",
    "topic": "concentration",
    "topicZh": "濃度",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "medium",
    "year": 0,
    "content": "取 $50$ cm³ 的 $2$ mol/dm³ 鹽酸，加水稀釋至 $0.5$ dm³。求稀釋後溶液的摩爾濃度。",
    "explanation": "稀釋只加水，溶質的物質的量不變：$n = 2 \\times \\dfrac{50}{1000} = 0.1$ mol。稀釋後濃度為 $\\dfrac{0.1}{0.5} = 0.2$ mol/dm³。題目一邊用 cm³ 一邊用 dm³，漏了 $1$ dm³ $= 1000$ cm³ 這一步就會得出 $200$，即答案大了一千倍——這是本題設下的主要陷阱。第二個干擾項把 $c_1V_1 = c_2V_2$ 的比例倒轉；第三個把「稀釋至 $0.5$ dm³」誤讀成「加入 $0.5$ dm³ 的水」，兩者的分別在於前者是最終總體積。",
    "options": [
      "$200$ mol/dm³",
      "$20$ mol/dm³",
      "$0.2222$ mol/dm³",
      "$0.2$ mol/dm³"
    ],
    "correctIndex": 3,
    "marks": 1,
    "contentEn": "$50$ cm³ of $2$ mol/dm³ hydrochloric acid is diluted with water to $0.5$ dm³. Find the molarity of the diluted solution.",
    "optionsEn": [
      "$200$ mol/dm³",
      "$20$ mol/dm³",
      "$0.2222$ mol/dm³",
      "$0.2$ mol/dm³"
    ],
    "explanationEn": "Dilution adds only water, so the amount of solute is unchanged: $n = 2 \\times \\dfrac{50}{1000} = 0.1$ mol, and the new molarity is $\\dfrac{0.1}{0.5} = 0.2$ mol/dm³. The question mixes cm³ and dm³; missing the $1$ dm³ $= 1000$ cm³ step gives $200$, a thousand times too large — the main trap here. The second distractor inverts $c_1V_1 = c_2V_2$; the third reads \"diluted **to** $0.5$ dm³\" as \"$0.5$ dm³ of water **added**\", which is a different final volume.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "chem_rep_0021",
    "type": "mc",
    "subject": "chemistry",
    "topic": "concentration",
    "topicZh": "濃度",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "medium",
    "year": 0,
    "content": "取 $200$ cm³ 的 $0.5$ mol/dm³ 鹽酸，加水稀釋至 $2$ dm³。求稀釋後溶液的摩爾濃度。",
    "explanation": "稀釋只加水，溶質的物質的量不變：$n = 0.5 \\times \\dfrac{200}{1000} = 0.1$ mol。稀釋後濃度為 $\\dfrac{0.1}{2} = 0.05$ mol/dm³。題目一邊用 cm³ 一邊用 dm³，漏了 $1$ dm³ $= 1000$ cm³ 這一步就會得出 $50$，即答案大了一千倍——這是本題設下的主要陷阱。第二個干擾項把 $c_1V_1 = c_2V_2$ 的比例倒轉；第三個把「稀釋至 $2$ dm³」誤讀成「加入 $2$ dm³ 的水」，兩者的分別在於前者是最終總體積。",
    "options": [
      "$0.05$ mol/dm³",
      "$50$ mol/dm³",
      "$5$ mol/dm³",
      "$0.0556$ mol/dm³"
    ],
    "correctIndex": 0,
    "marks": 1,
    "contentEn": "$200$ cm³ of $0.5$ mol/dm³ hydrochloric acid is diluted with water to $2$ dm³. Find the molarity of the diluted solution.",
    "optionsEn": [
      "$0.05$ mol/dm³",
      "$50$ mol/dm³",
      "$5$ mol/dm³",
      "$0.0556$ mol/dm³"
    ],
    "explanationEn": "Dilution adds only water, so the amount of solute is unchanged: $n = 0.5 \\times \\dfrac{200}{1000} = 0.1$ mol, and the new molarity is $\\dfrac{0.1}{2} = 0.05$ mol/dm³. The question mixes cm³ and dm³; missing the $1$ dm³ $= 1000$ cm³ step gives $50$, a thousand times too large — the main trap here. The second distractor inverts $c_1V_1 = c_2V_2$; the third reads \"diluted **to** $2$ dm³\" as \"$2$ dm³ of water **added**\", which is a different final volume.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "chem_rep_0022",
    "type": "mc",
    "subject": "chemistry",
    "topic": "concentration",
    "topicZh": "濃度",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEmoji": "⚙️",
    "difficulty": "medium",
    "year": 0,
    "content": "取 $25$ cm³ 的 $4$ mol/dm³ 鹽酸，加水稀釋至 $0.5$ dm³。求稀釋後溶液的摩爾濃度。",
    "explanation": "稀釋只加水，溶質的物質的量不變：$n = 4 \\times \\dfrac{25}{1000} = 0.1$ mol。稀釋後濃度為 $\\dfrac{0.1}{0.5} = 0.2$ mol/dm³。題目一邊用 cm³ 一邊用 dm³，漏了 $1$ dm³ $= 1000$ cm³ 這一步就會得出 $200$，即答案大了一千倍——這是本題設下的主要陷阱。第二個干擾項把 $c_1V_1 = c_2V_2$ 的比例倒轉；第三個把「稀釋至 $0.5$ dm³」誤讀成「加入 $0.5$ dm³ 的水」，兩者的分別在於前者是最終總體積。",
    "options": [
      "$0.2105$ mol/dm³",
      "$0.2$ mol/dm³",
      "$200$ mol/dm³",
      "$80$ mol/dm³"
    ],
    "correctIndex": 1,
    "marks": 1,
    "contentEn": "$25$ cm³ of $4$ mol/dm³ hydrochloric acid is diluted with water to $0.5$ dm³. Find the molarity of the diluted solution.",
    "optionsEn": [
      "$0.2105$ mol/dm³",
      "$0.2$ mol/dm³",
      "$200$ mol/dm³",
      "$80$ mol/dm³"
    ],
    "explanationEn": "Dilution adds only water, so the amount of solute is unchanged: $n = 4 \\times \\dfrac{25}{1000} = 0.1$ mol, and the new molarity is $\\dfrac{0.1}{0.5} = 0.2$ mol/dm³. The question mixes cm³ and dm³; missing the $1$ dm³ $= 1000$ cm³ step gives $200$, a thousand times too large — the main trap here. The second distractor inverts $c_1V_1 = c_2V_2$; the third reads \"diluted **to** $0.5$ dm³\" as \"$0.5$ dm³ of water **added**\", which is a different final volume.",
    "frameworkEn": "Auto-gated"
  }
]
