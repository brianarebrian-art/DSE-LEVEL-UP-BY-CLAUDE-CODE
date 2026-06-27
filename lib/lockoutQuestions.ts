import type { ReverseCause } from './reverseLog'

// ─────────────────────────────────────────────────────────────────────────────
// 60-second lockout: after a wrong answer on a HARD question, the student picks
// which underlying trap caught them (the 3-way reverse diagnosis), then must read
// the breakdown AND answer one short "logic follow-up" about that error type
// correctly — and wait out a forced countdown — before the next question unlocks.
//
// These follow-ups are metacognition checks, not subject content: each has a single
// unambiguous best study response (opts[0]) and clearly-wrong distractors, so the
// gate is fully verifiable and the same bank serves every subject.
// ─────────────────────────────────────────────────────────────────────────────

export type LPair = [zh: string, en: string]

export interface LockoutQ {
  prompt: LPair
  options: LPair[] // opts[0] is ALWAYS the correct response (caller shuffles for display)
  explain: LPair
}

const BANK: Record<ReverseCause, LockoutQ[]> = {
  // A — 概念盲區 / Conceptual blindspot
  A: [
    {
      prompt: ['你今次中咗「概念盲區」。下一步邊個做法最能根治，避免下次再錯？',
        'You fell into a “conceptual blindspot”. Which next step actually fixes the root cause?'],
      options: [
        ['翻查相關定理／公式嘅前提條件同適用範圍，再揾一條同類題親手重做印證',
          'Re-check the theorem/formula’s preconditions and scope, then redo a similar question to confirm you’ve got it'],
        ['強記呢題嘅答案，下次見到照抄',
          'Memorise this question’s answer and copy it next time'],
        ['唔理喇，繼續做下一題儲數量',
          'Skip it and grind more questions for volume'],
        ['怪題目出得太刁鑽，唔關自己事',
          'Blame the question for being tricky — not your problem'],
      ],
      explain: ['概念盲區嘅根源係未理解底層原理。唯有回到定義／前提去補，再用一條新題親手印證，先能轉化為長期理解；死記單題答案治標不治本。',
        'A blindspot means the underlying principle wasn’t understood. Only returning to the definition/preconditions and re-testing on a fresh question turns it into lasting understanding; memorising one answer treats the symptom, not the cause.'],
    },
    {
      prompt: ['以下邊一句最能反映你已經真正修補咗「概念盲區」？',
        'Which statement best shows you have genuinely repaired the “conceptual blindspot”?'],
      options: [
        ['我能夠用自己嘅說話講出呢條定理嘅成立條件，並指出今次邊一個前提被我忽略咗',
          'I can restate the theorem’s conditions in my own words and name the exact precondition I overlooked'],
        ['我背熟咗呢題四個選項邊個啱',
          'I’ve memorised which of the four options was correct'],
        ['我知道呢題好難，所以決定放棄',
          'I know it’s hard, so I’ve decided to give up on it'],
        ['我覺得再做多幾題自然會識',
          'I reckon I’ll just get it by doing a few more'],
      ],
      explain: ['真正補好概念，標準係能用自己語言重述原理同前提，並準確指出被忽略嘅一步——能做到先算理解，而唔係記憶。',
        'The test of real repair is being able to re-explain the principle and its preconditions in your own words and pinpoint the step you missed — that is understanding, not memorisation.'],
    },
  ],
  // B — 審題陷阱 / Reading trap
  B: [
    {
      prompt: ['你今次中咗「審題陷阱」。下次審題最有效嘅防錯動作係？',
        'You fell for a “reading trap”. What is the most effective guard when reading the next question?'],
      options: [
        ['落筆前先圈出題目嘅關鍵詞、限制條件同否定詞（如「除外」「最少」「不正確」），確認問乜先答',
          'Before answering, circle the keywords, constraints and negatives (e.g. “except”, “at least”, “NOT”) and confirm what is actually being asked'],
        ['睇得越快越好，慳返時間做多幾題',
          'Read as fast as possible to save time for more questions'],
        ['只睇最後一句問題，前面背景全部跳過',
          'Read only the final question line and skip all the context'],
        ['見到熟悉字眼就即刻揀，唔使睇完',
          'Pick as soon as you spot a familiar phrase, without finishing the question'],
      ],
      explain: ['審題陷阱多數藏喺限制詞同否定詞。主動圈出關鍵詞、睇清楚「問乜」先答，先可以避免答非所問——速度唔可以用犧牲審題去換。',
        'Reading traps usually hide in constraints and negatives. Actively marking keywords and confirming what is asked prevents answering the wrong question — speed must never come at the cost of reading carefully.'],
    },
    {
      prompt: ['題目問「下列何者『不』正確」，你揀咗一個本身正確嘅描述。呢個錯誤屬於邊類？',
        'A question asks “which is NOT correct” and you picked a statement that is actually correct. This error is a case of?'],
      options: [
        ['審題陷阱 —— 睇漏咗否定詞「不」，答成相反',
          'A reading trap — you missed the negative “NOT” and answered the opposite'],
        ['概念盲區 —— 唔識相關知識',
          'A conceptual blindspot — you didn’t know the content'],
        ['運算粗心 —— 計錯咗數',
          'A calculation slip — you got the arithmetic wrong'],
        ['題目出錯，唔關自己事',
          'A faulty question — nothing to do with you'],
      ],
      explain: ['知識其實識，錯只因睇漏否定詞，答成相反——典型審題陷阱。對策係每見「不／除外／最少」就即刻圈起，作答前再確認一次。',
        'You knew the content; the error was missing the negative and answering its opposite — a textbook reading trap. The fix is to circle every “NOT/except/least” and re-confirm before answering.'],
    },
  ],
  // C — 運算粗心 / Execution slip
  C: [
    {
      prompt: ['你今次中咗「運算粗心」。最能減少呢類失誤嘅習慣係？',
        'You made an “execution slip”. Which habit best reduces this kind of error?'],
      options: [
        ['分步寫出每一步運算，完成後將答案回代原式或用另一方法驗算',
          'Write out each step, then substitute the answer back into the original (or re-check by a second method)'],
        ['心算快啲，唔使寫低中間步驟',
          'Do it in your head — faster without writing the steps'],
        ['計完一次就交，信自己唔會錯',
          'Hand it in after one pass and trust you didn’t slip'],
        ['錯就錯，呢啲分唔重要',
          'Whatever — these marks don’t matter'],
      ],
      explain: ['運算粗心源於跳步同無覆核。分步書寫加回代驗算，可即場揪出符號、進位等低級錯誤——呢啲先係考場執得返嚟嘅分。',
        'Execution slips come from skipping steps and not checking. Writing each step and substituting back catches sign and carry errors on the spot — exactly the marks you can win back in the exam.'],
    },
    {
      prompt: ['你思路完全正確，但最後答案計錯一個負號。最務實嘅補救係？',
        'Your method was completely right, but the final answer had a sign error. The most practical fix is?'],
      options: [
        ['針對易錯步驟（轉號、開方、代入）建立即場回代驗算嘅習慣',
          'Build a habit of substitution-checking exactly at error-prone steps (sign changes, roots, substitution)'],
        ['下次唔好咁緊張就得',
          'Just be less nervous next time'],
        ['呢種錯無得救，靠彩數',
          'These errors are unfixable — down to luck'],
        ['改用更複雜嘅方法去顯示實力',
          'Switch to a more complicated method to show off'],
      ],
      explain: ['負號／轉號係最常見嘅粗心位。針對易錯步驟即場回代驗算，比泛泛「提自己小心」有效得多，亦唔需要改變正確嘅解題思路。',
        'Sign errors are the most common slip. Targeted substitution-checking at error-prone steps beats a vague “be careful”, and you keep your already-correct method.'],
    },
  ],
}

export function pickLockoutQuestion(cause: ReverseCause): LockoutQ {
  const pool = BANK[cause]
  return pool[Math.floor(Math.random() * pool.length)]
}
