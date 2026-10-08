// AUTO-GATED question bank —— 由 scripts/qbank/auto-promote.mts 自動入庫。
// 【本檔題目未經真人逐題審批。】機器只能檢驗客觀項目：格式、選項、術語紅線、
// LaTeX、與現有題庫的重複度、topic id 是否已註冊。答案在學術上是否正確，
// 並不在此閘的能力範圍之內 —— 故出題端必須 correct-by-construction，或引用
// 可查證的原文。前端 QuestionProvenance 會如實向學生顯示
// 「經自動檢查 …本題未有實名逐題審批紀錄」。
//   subject  : chemistry
//   count    : 30  (easy 12 / medium 16 / hard 2)
//   types    : mc 30 / text 0 / long 0
//   updated  : 2026-10-08
// 請勿手動編輯 —— 修改將於下次執行 auto-promote 時被覆寫。
import type { Question } from './types'

export const chemistryAutoQuestions: Question[] = [
  {
    "id": "chem_rep_0001",
    "type": "mc",
    "subject": "chemistry",
    "topic": "stoichiometry",
    "topicZh": "化學計量",
    "topicEn": "Stoichiometry",
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
    "topicEn": "Stoichiometry",
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
    "topicEn": "Stoichiometry",
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
    "topicEn": "Stoichiometry",
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
    "topicEn": "Stoichiometry",
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
    "topicEn": "Stoichiometry",
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
    "topicEn": "Stoichiometry",
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
    "topicEn": "Stoichiometry",
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
    "topicEn": "Stoichiometry",
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
    "topicEn": "Stoichiometry",
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
    "topicEn": "Stoichiometry",
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
    "topicEn": "Stoichiometry",
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
    "topicEn": "Stoichiometry",
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
    "topicEn": "Stoichiometry",
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
    "topicEn": "Stoichiometry",
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
    "topicEn": "Stoichiometry",
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
    "topicEn": "Concentration",
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
    "topicEn": "Concentration",
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
    "topicEn": "Concentration",
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
    "topicEn": "Concentration",
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
    "explanationEn": "Dilution adds only water, so the amount of solute is unchanged: $n = 2 \\times \\dfrac{50}{1000} = 0.1$ mol, and the new molarity is $\\dfrac{0.1}{0.5} = 0.2$ mol/dm³. The question mixes cm³ and dm³; missing the $1$ dm³ $= 1000$ cm³ step gives $200$, a thousand times too large — the main trap here. The second distractor inverts $c_1V_1 = c_2V_2$; the third reads \"diluted to $0.5$ dm³\" as \"$0.5$ dm³ of water added\", which is a different final volume.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "chem_rep_0021",
    "type": "mc",
    "subject": "chemistry",
    "topic": "concentration",
    "topicZh": "濃度",
    "topicEn": "Concentration",
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
    "explanationEn": "Dilution adds only water, so the amount of solute is unchanged: $n = 0.5 \\times \\dfrac{200}{1000} = 0.1$ mol, and the new molarity is $\\dfrac{0.1}{2} = 0.05$ mol/dm³. The question mixes cm³ and dm³; missing the $1$ dm³ $= 1000$ cm³ step gives $50$, a thousand times too large — the main trap here. The second distractor inverts $c_1V_1 = c_2V_2$; the third reads \"diluted to $2$ dm³\" as \"$2$ dm³ of water added\", which is a different final volume.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "chem_rep_0022",
    "type": "mc",
    "subject": "chemistry",
    "topic": "concentration",
    "topicZh": "濃度",
    "topicEn": "Concentration",
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
    "explanationEn": "Dilution adds only water, so the amount of solute is unchanged: $n = 4 \\times \\dfrac{25}{1000} = 0.1$ mol, and the new molarity is $\\dfrac{0.1}{0.5} = 0.2$ mol/dm³. The question mixes cm³ and dm³; missing the $1$ dm³ $= 1000$ cm³ step gives $200$, a thousand times too large — the main trap here. The second distractor inverts $c_1V_1 = c_2V_2$; the third reads \"diluted to $0.5$ dm³\" as \"$0.5$ dm³ of water added\", which is a different final volume.",
    "frameworkEn": "Auto-gated"
  },
  {
    "id": "rcl_chem_ab_18",
    "type": "mc",
    "subject": "chemistry",
    "topic": "acids_bases",
    "topicZh": "酸鹼",
    "topicEn": "Acids & Bases",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEn": "Auto-gated",
    "frameworkEmoji": "⚙️",
    "difficulty": "medium",
    "year": 0,
    "content": "胃酸過多的人可服用含氫氧化鎂的胃藥紓緩不適。下列哪項最能解釋這種胃藥的作用？",
    "explanation": "$\\mathrm{Mg(OH)_2 + 2HCl \\rightarrow MgCl_2 + 2H_2O}$：鹼與酸反應生成鹽和水，屬中和反應，胃中的氫離子因此減少。稀釋只會降低濃度，不會減少酸的總量，與中和不同。產生氫氣的是較活潑的金屬與酸的反應，鹼與酸反應不會產生氫氣。氫氧化鎂難溶於水，只會與胃酸逐步反應；而且胃需要酸性環境消化蛋白質，令胃液變成鹼性並不理想，所以「用量越多越好」並不正確。",
    "options": [
      "氫氧化鎂只是把胃酸稀釋，酸的總量其實沒有減少。",
      "氫氧化鎂與胃中的鹽酸發生中和反應，生成鹽和水。",
      "氫氧化鎂與鹽酸反應生成氫氣，把胃酸從胃中排走。",
      "氫氧化鎂是強鹼，用量越多越好，可使胃液變成鹼性。"
    ],
    "correctIndex": 1,
    "marks": 1,
    "contentEn": "People with too much stomach acid can take an antacid containing magnesium hydroxide to relieve discomfort. Which statement best explains how the antacid works?",
    "optionsEn": [
      "Magnesium hydroxide only dilutes the acid; the total amount of acid does not fall.",
      "Magnesium hydroxide neutralises the hydrochloric acid in the stomach, forming a salt and water.",
      "Magnesium hydroxide reacts with the acid to give hydrogen, which carries the acid away.",
      "Magnesium hydroxide is a strong alkali, so the more the better, until the stomach turns alkaline."
    ],
    "explanationEn": "$\\mathrm{Mg(OH)_2 + 2HCl \\rightarrow MgCl_2 + 2H_2O}$: a base reacts with an acid to form a salt and water, which is neutralisation, so the hydrogen ions in the stomach decrease. Dilution only lowers the concentration and does not reduce the total amount of acid, so it is not neutralisation. Hydrogen comes from the reaction of a reactive metal with an acid; a base and an acid do not produce hydrogen. Magnesium hydroxide is only sparingly soluble and reacts with the acid gradually, and the stomach needs acid to digest protein, so making the stomach alkaline is not desirable and more is not better."
  },
  {
    "id": "rcl_chem_rx_40",
    "type": "mc",
    "subject": "chemistry",
    "topic": "redox",
    "topicZh": "氧化還原",
    "topicEn": "Redox",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEn": "Auto-gated",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "把鋅片放入硫酸銅(II)溶液中，鋅片表面出現紅褐色固體，溶液的藍色變淡。反應的離子方程式為 $\\mathrm{Zn(s) + Cu^{2+}(aq) \\rightarrow Zn^{2+}(aq) + Cu(s)}$。下列哪項描述正確？",
    "explanation": "鋅變成鋅離子（$\\mathrm{Zn \\rightarrow Zn^{2+} + 2e^-}$），失去電子，氧化數由 0 升至 +2，被氧化；銅(II)離子變成銅（$\\mathrm{Cu^{2+} + 2e^- \\rightarrow Cu}$），得到電子，氧化數由 +2 降至 0，被還原。接收電子、令鋅被氧化的是銅(II)離子，所以它是氧化劑，鋅則是還原劑。認為「鋅被氧化，所以是氧化劑」，混淆了兩個概念：氧化劑本身是被還原的一方。認為「銅(II)離子變成固體所以被氧化」，是以物態判斷；判斷氧化還原要看電子得失或氧化數的變化。認為「沒有氧所以不是氧化還原」，沿用了舊定義；現時以電子轉移為準。",
    "options": [
      "鋅被氧化，所以鋅就是這個反應的氧化劑。",
      "銅(II)離子被氧化，因為它由離子變成固體。",
      "鋅失去電子而被氧化，銅(II)離子是氧化劑。",
      "這不是氧化還原反應，因為反應中沒有氧參與。"
    ],
    "correctIndex": 2,
    "marks": 1,
    "contentEn": "A piece of zinc is placed in copper(II) sulfate solution. A reddish-brown solid forms on the zinc and the blue colour of the solution fades. The ionic equation is $\\mathrm{Zn(s) + Cu^{2+}(aq) \\rightarrow Zn^{2+}(aq) + Cu(s)}$. Which statement is correct?",
    "optionsEn": [
      "Zinc is oxidised, so zinc is the oxidising agent in this reaction.",
      "Copper(II) ions are oxidised, because they change from ions into a solid.",
      "Zinc loses electrons and is oxidised; copper(II) ions are the oxidising agent.",
      "This is not a redox reaction, because no oxygen is involved."
    ],
    "explanationEn": "Zinc becomes zinc ions ($\\mathrm{Zn \\rightarrow Zn^{2+} + 2e^-}$): it loses electrons and its oxidation number rises from 0 to +2, so it is oxidised. Copper(II) ions become copper ($\\mathrm{Cu^{2+} + 2e^- \\rightarrow Cu}$): they gain electrons and their oxidation number falls from +2 to 0, so they are reduced. The copper(II) ions accept the electrons and so oxidise the zinc: they are the oxidising agent, and zinc is the reducing agent. Saying zinc is the oxidising agent because it is oxidised mixes up the two ideas: the oxidising agent is itself reduced. Judging by the change from ions to a solid looks at the state, not at electrons or oxidation numbers. Saying there is no redox without oxygen uses the old definition; redox is defined by electron transfer."
  },
  {
    "id": "rcl_chem_rx_41",
    "type": "mc",
    "subject": "chemistry",
    "topic": "redox",
    "topicZh": "氧化還原",
    "topicEn": "Redox",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEn": "Auto-gated",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "把氯水加入無色的溴化鉀溶液中，溶液變成橙色。反應的離子方程式為 $\\mathrm{Cl_2 + 2Br^- \\rightarrow 2Cl^- + Br_2}$。下列哪項描述正確？",
    "explanation": "$\\mathrm{Cl_2 + 2e^- \\rightarrow 2Cl^-}$：氯得到電子，氧化數由 0 降至 −1，被還原。$\\mathrm{2Br^- \\rightarrow Br_2 + 2e^-}$：溴離子失去電子，氧化數由 −1 升至 0，被氧化，生成的溴令溶液呈橙色。提供電子、令氯被還原的是溴離子，所以溴離子是還原劑，氯則是氧化劑。認為「氯被還原，所以是還原劑」，混淆了被還原的物質與還原劑。認為溴離子得到電子，是把電子轉移的方向倒轉了。氯離子帶 −1 電荷，氯的氧化數是下降而不是上升。",
    "options": [
      "氯被還原，所以氯就是這個反應的還原劑。",
      "溴離子得到電子而被還原，令溶液變成橙色。",
      "氯的氧化數由 0 升至 +1，所以氯被氧化。",
      "氯的氧化數由 0 降至 −1，溴離子是還原劑。"
    ],
    "correctIndex": 3,
    "marks": 1,
    "contentEn": "Chlorine water is added to colourless potassium bromide solution and the solution turns orange. The ionic equation is $\\mathrm{Cl_2 + 2Br^- \\rightarrow 2Cl^- + Br_2}$. Which statement is correct?",
    "optionsEn": [
      "Chlorine is reduced, so chlorine is the reducing agent in this reaction.",
      "Bromide ions gain electrons and are reduced, turning the solution orange.",
      "The oxidation number of chlorine rises from 0 to +1, so chlorine is oxidised.",
      "The oxidation number of chlorine falls from 0 to −1; bromide ions are the reducing agent."
    ],
    "explanationEn": "$\\mathrm{Cl_2 + 2e^- \\rightarrow 2Cl^-}$: chlorine gains electrons and its oxidation number falls from 0 to −1, so it is reduced. $\\mathrm{2Br^- \\rightarrow Br_2 + 2e^-}$: bromide ions lose electrons and their oxidation number rises from −1 to 0, so they are oxidised, and the bromine formed turns the solution orange. The bromide ions give the electrons that reduce the chlorine, so they are the reducing agent and chlorine is the oxidising agent. Saying chlorine is the reducing agent because it is reduced confuses the substance reduced with the reducing agent. Saying bromide ions gain electrons reverses the direction of electron transfer. Chloride ions carry a −1 charge, so the oxidation number of chlorine falls, not rises."
  },
  {
    "id": "rcl_chem_rx_42",
    "type": "mc",
    "subject": "chemistry",
    "topic": "redox",
    "topicZh": "氧化還原",
    "topicEn": "Redox",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEn": "Auto-gated",
    "frameworkEmoji": "⚙️",
    "difficulty": "medium",
    "year": 0,
    "content": "燃燒中的鎂帶放入二氧化碳中仍可繼續燃燒，生成氧化鎂和碳：$\\mathrm{2Mg + CO_2 \\rightarrow 2MgO + C}$。下列哪項正確？",
    "explanation": "鎂的氧化數由 0 升至 +2（在 MgO 中），失去電子，被氧化；碳的氧化數由 +4（在 $\\mathrm{CO_2}$ 中）降至 0，被還原。提供電子的鎂是還原劑，接收電子的二氧化碳是氧化劑。失去氧的物質是被還原，所以二氧化碳是氧化劑而不是還原劑。鎂與氧結合表示鎂被氧化，被氧化的物質是還原劑，不是氧化劑。反應物中雖然沒有氧氣，但有元素的氧化數改變，所以仍然是氧化還原反應。",
    "options": [
      "鎂是還原劑，因為鎂的氧化數由 0 升至 +2。",
      "二氧化碳是還原劑，因為它在反應中失去了氧。",
      "鎂是氧化劑，因為鎂在反應中與氧結合。",
      "這不是氧化還原反應，因為反應物中沒有氧氣。"
    ],
    "correctIndex": 0,
    "marks": 1,
    "contentEn": "Burning magnesium ribbon keeps burning in carbon dioxide, forming magnesium oxide and carbon: $\\mathrm{2Mg + CO_2 \\rightarrow 2MgO + C}$. Which statement is correct?",
    "optionsEn": [
      "Magnesium is the reducing agent, because its oxidation number rises from 0 to +2.",
      "Carbon dioxide is the reducing agent, because it loses oxygen in the reaction.",
      "Magnesium is the oxidising agent, because it combines with oxygen.",
      "This is not a redox reaction, because there is no oxygen gas among the reactants."
    ],
    "explanationEn": "The oxidation number of magnesium rises from 0 to +2 (in MgO): it loses electrons and is oxidised. The oxidation number of carbon falls from +4 (in $\\mathrm{CO_2}$) to 0: it is reduced. Magnesium gives the electrons, so it is the reducing agent; carbon dioxide accepts them, so it is the oxidising agent. A substance that loses oxygen is reduced, so carbon dioxide is the oxidising agent, not the reducing agent. Magnesium combining with oxygen means magnesium is oxidised, and the substance oxidised is the reducing agent, not the oxidising agent. There is no oxygen gas, but oxidation numbers change, so it is still a redox reaction."
  },
  {
    "id": "rcl_chem_rx_50",
    "type": "mc",
    "subject": "chemistry",
    "topic": "redox",
    "topicZh": "氧化還原",
    "topicEn": "Redox",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEn": "Auto-gated",
    "frameworkEmoji": "⚙️",
    "difficulty": "medium",
    "year": 0,
    "content": "把酸化的過錳酸鉀溶液逐滴加入硫酸鐵(II)溶液中，紫色隨即褪去。反應為 $\\mathrm{MnO_4^- + 5Fe^{2+} + 8H^+ \\rightarrow Mn^{2+} + 5Fe^{3+} + 4H_2O}$。下列哪項正確？",
    "explanation": "在 $\\mathrm{MnO_4^-}$ 中錳的氧化數是 +7，變成 $\\mathrm{Mn^{2+}}$ 後是 +2：錳得到電子，被還原，所以過錳酸根離子是氧化劑。$\\mathrm{Fe^{2+} \\rightarrow Fe^{3+} + e^-}$：鐵(II)離子失去電子，氧化數上升，被氧化，是還原劑。認為鐵(II)離子被還原，是把氧化數上升誤當作還原。失去氧的物質是被還原，所以過錳酸根離子是氧化劑而不是還原劑。紫色褪去，是因為紫色的過錳酸根離子被還原成近乎無色的錳(II)離子。",
    "options": [
      "鐵(II)離子變成鐵(III)離子，所以鐵(II)離子被還原。",
      "錳的氧化數由 +7 降至 +2，過錳酸根離子是氧化劑。",
      "過錳酸根離子失去了氧，所以它是這個反應的還原劑。",
      "紫色褪去，表示過錳酸根離子在反應中被氧化。"
    ],
    "correctIndex": 1,
    "marks": 1,
    "contentEn": "Acidified potassium permanganate solution is added drop by drop to iron(II) sulfate solution, and the purple colour disappears at once. The reaction is $\\mathrm{MnO_4^- + 5Fe^{2+} + 8H^+ \\rightarrow Mn^{2+} + 5Fe^{3+} + 4H_2O}$. Which statement is correct?",
    "optionsEn": [
      "Iron(II) ions become iron(III) ions, so iron(II) ions are reduced.",
      "Manganese falls from +7 to +2, so permanganate ions are the oxidising agent.",
      "Permanganate ions lose oxygen, so they are the reducing agent in this reaction.",
      "The purple colour fading shows that permanganate ions are oxidised."
    ],
    "explanationEn": "Manganese has an oxidation number of +7 in $\\mathrm{MnO_4^-}$ and +2 in $\\mathrm{Mn^{2+}}$: it gains electrons and is reduced, so permanganate ions are the oxidising agent. $\\mathrm{Fe^{2+} \\rightarrow Fe^{3+} + e^-}$: iron(II) ions lose an electron, their oxidation number rises, and they are oxidised, acting as the reducing agent. Saying iron(II) ions are reduced mistakes a rise in oxidation number for reduction. A substance that loses oxygen is reduced, so permanganate ions are the oxidising agent, not the reducing agent. The purple colour fades because purple permanganate ions are reduced to almost colourless manganese(II) ions."
  },
  {
    "id": "rcl_chem_floor_01",
    "type": "mc",
    "subject": "chemistry",
    "topic": "chem_hell_redox_equil",
    "topicZh": "氧化還原與平衡",
    "topicEn": "Redox & equilibrium",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEn": "Auto-gated",
    "frameworkEmoji": "⚙️",
    "difficulty": "easy",
    "year": 0,
    "content": "在反應 $\\mathrm{SO_2 + 2H_2S \\rightarrow 3S + 2H_2O}$ 中，兩種反應物都含有硫。下列哪項描述正確？",
    "explanation": "計算硫的氧化數：在 $\\mathrm{SO_2}$ 中是 +4，在 $\\mathrm{H_2S}$ 中是 −2，在硫單質中是 0。由 +4 降至 0，二氧化硫中的硫得到電子，被還原；由 −2 升至 0，硫化氫中的硫失去電子，被氧化。兩者最後雖然都變成硫，但起點不同，變化方向相反，所以不能說兩者都被還原。同一元素可以在一個反應中同時被氧化和被還原，只要它來自不同的物質或處於不同的氧化數。失去氧表示被還原，所以二氧化硫中的硫是被還原而不是被氧化。",
    "options": [
      "兩種反應物中的硫都被還原，因為最後都變成硫。",
      "同一元素不能同時被氧化和被還原，所以不是氧化還原反應。",
      "二氧化硫中的硫被還原，硫化氫中的硫被氧化。",
      "二氧化硫中的硫被氧化，因為二氧化硫失去了氧。"
    ],
    "correctIndex": 2,
    "marks": 1,
    "contentEn": "In the reaction $\\mathrm{SO_2 + 2H_2S \\rightarrow 3S + 2H_2O}$, both reactants contain sulfur. Which statement is correct?",
    "optionsEn": [
      "The sulfur in both reactants is reduced, because both end up as sulfur.",
      "One element cannot be both oxidised and reduced, so this is not a redox reaction.",
      "The sulfur in sulfur dioxide is reduced and the sulfur in hydrogen sulfide is oxidised.",
      "The sulfur in sulfur dioxide is oxidised, because sulfur dioxide loses oxygen."
    ],
    "explanationEn": "Work out the oxidation number of sulfur: +4 in $\\mathrm{SO_2}$, −2 in $\\mathrm{H_2S}$ and 0 in elemental sulfur. Going from +4 to 0, the sulfur in sulfur dioxide gains electrons and is reduced; going from −2 to 0, the sulfur in hydrogen sulfide loses electrons and is oxidised. Both end up as sulfur, but they start from different oxidation numbers and change in opposite directions, so they are not both reduced. One element can be oxidised and reduced in the same reaction when it comes from different substances with different oxidation numbers. Losing oxygen means reduction, so the sulfur in sulfur dioxide is reduced, not oxidised."
  },
  {
    "id": "rcl_chem_re_64",
    "type": "mc",
    "subject": "chemistry",
    "topic": "rates_energy",
    "topicZh": "反應速率與能量",
    "topicEn": "Reaction Rates & Energy",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEn": "Auto-gated",
    "frameworkEmoji": "⚙️",
    "difficulty": "hard",
    "year": 0,
    "content": "火柴放在空氣中不會自行燃燒，但在火柴盒側面擦一下便會燃燒；燃燒開始後，即使不再擦，火柴仍會繼續燃燒。下列哪項最能解釋這現象？",
    "explanation": "反應物粒子相撞時，必須具有至少等於活化能的能量才可反應。常溫下只有極少粒子達到活化能，所以火柴不會自燃。擦火柴產生的熱提供能量，令部分反應物越過活化能；燃燒是放熱反應，放出的熱又令更多反應物越過活化能，所以反應能自行持續。擦火柴並沒有改變活化能的大小，降低活化能的是催化劑。燃燒能自行持續，正好說明它是放熱反應而非吸熱反應。火柴不自燃的原因是活化能高，而不是產物能量較高；燃燒的產物能量其實比反應物低。",
    "options": [
      "擦火柴降低了燃燒反應的活化能，所以反應較容易進行。",
      "燃燒是吸熱反應，所以必須不斷從外界吸收熱能才能進行。",
      "火柴不會自燃，是因為燃燒產物的能量比反應物的能量高。",
      "擦火柴提供能量，使反應物越過活化能；燃燒放出的熱再維持反應。"
    ],
    "correctIndex": 3,
    "marks": 1,
    "contentEn": "A match left in air does not catch fire by itself, but it burns once struck on the side of the box; after that it keeps burning without being struck again. Which statement best explains this?",
    "optionsEn": [
      "Striking lowers the activation energy of the reaction, so it happens more easily.",
      "Burning is endothermic, so it must keep absorbing heat from outside to continue.",
      "The match does not ignite because the products of burning have more energy than the reactants.",
      "Striking supplies energy to overcome the activation energy; heat from burning then keeps it going."
    ],
    "explanationEn": "Reacting particles must collide with at least the activation energy. At room temperature very few particles have that much energy, so the match does not ignite by itself. The heat from striking supplies energy so that some reactants overcome the activation energy; burning is exothermic, and the heat it gives out lets more reactants overcome the activation energy, so the reaction sustains itself. Striking does not change the size of the activation energy; lowering it is what a catalyst does. Burning that sustains itself shows it is exothermic, not endothermic. The match does not ignite because the activation energy is high, not because the products have more energy; in fact the products of burning have less energy than the reactants."
  },
  {
    "id": "rcl_chem_pt_101",
    "type": "mc",
    "subject": "chemistry",
    "topic": "periodic_table",
    "topicZh": "週期表",
    "topicEn": "The Periodic Table",
    "framework": "auto",
    "frameworkZh": "機器閘放行題",
    "frameworkEn": "Auto-gated",
    "frameworkEmoji": "⚙️",
    "difficulty": "hard",
    "year": 0,
    "content": "氯有兩種同位素：氯-35（17 個質子、18 個中子）及氯-37（17 個質子、20 個中子）。兩者與鈉反應時的化學性質是否相同？原因是甚麼？",
    "explanation": "化學性質取決於電子，特別是最外層電子的數目。同位素的質子數相同，中性原子的電子數及電子排布亦相同，所以化學性質相同。中子數不同只影響原子質量及部分物理性質，例如密度。原子序就是質子數，兩者都是 17；質量數是質子數加中子數，分別為 35 和 37，並不相同。所以「質量數不同令原子序不同」和「質量數相同」兩種說法都不正確。",
    "options": [
      "相同，因為兩者的質子數和電子排布都相同。",
      "不同，因為氯-37 的中子較多，反應會較慢。",
      "不同，因為兩者的質量數不同，原子序亦因此不同。",
      "相同，因為兩者的質量數相同，所以性質一樣。"
    ],
    "correctIndex": 0,
    "marks": 1,
    "contentEn": "Chlorine has two isotopes: chlorine-35 (17 protons, 18 neutrons) and chlorine-37 (17 protons, 20 neutrons). Do they have the same chemical properties when reacting with sodium, and why?",
    "optionsEn": [
      "Yes, because they have the same number of protons and the same electronic arrangement.",
      "No, because chlorine-37 has more neutrons, so it reacts more slowly.",
      "No, because their mass numbers differ, so their atomic numbers differ too.",
      "Yes, because they have the same mass number, so they behave alike."
    ],
    "explanationEn": "Chemical properties depend on electrons, especially the number of outermost electrons. Isotopes have the same number of protons, so their neutral atoms have the same number and arrangement of electrons and the same chemical properties. A different number of neutrons only affects atomic mass and some physical properties, such as density. The atomic number is the number of protons, 17 for both; the mass number is protons plus neutrons, 35 and 37, which differ. So both the claim that different mass numbers change the atomic number and the claim that the mass numbers are the same are wrong."
  }
]
