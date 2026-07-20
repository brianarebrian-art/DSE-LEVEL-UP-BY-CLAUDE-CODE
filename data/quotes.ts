// 每日正向金句（方向二 /waiting）。靜態陣列，零成本。
// 憲章合規：無虛構統計（唔寫「Band A +X%」）、無 gamification、無醫療級宣稱、
// 無「你落後」壓力語。學長學姐共情語調；雙語（en 對照）。
// 品牌署名統一 'DSE LEVEL UP'。

export interface Quote {
  id: number
  zh: string
  en: string
}

export const quotes: Quote[] = [
  { id: 1, zh: '掌握邏輯，唔係背答案。無論數字點變，你都識答。', en: 'Master the logic, not the answer. However the numbers change, you can still answer.' },
  { id: 2, zh: '今日能打開嚟已經好叻。', en: 'Just showing up today already takes courage.' },
  { id: 3, zh: '每個錯誤都係一個新盲點，搵到就贏一半。', en: 'Every mistake is a new blind spot — finding it is half the battle.' },
  { id: 4, zh: '你唔係一個人溫書，我哋一齊行呢條路。', en: "You're not revising alone — we walk this road together." },
  { id: 5, zh: '錯咗唔緊要，緊要係你肯再試多次。', en: 'Getting it wrong is fine — what matters is you try again.' },
  { id: 6, zh: '慳返幾千蚊補習費，攞分嘅真功夫唔應該被窮富擋住。', en: 'Real exam skill should never be gated by how much you can pay.' },
  { id: 7, zh: '深呼吸，你已經準備好咗。', en: "Breathe. You've prepared for this." },
  { id: 8, zh: '無論結果點，你都值得被尊重。', en: 'Whatever the result, you deserve respect.' },
  { id: 9, zh: '進步係同自己比，唔係同其他人比。', en: 'Progress is measured against yourself, not against anyone else.' },
  { id: 10, zh: '今日淨係做到一題都算數。慢慢嚟。', en: 'Even one question today counts. Take it slow.' },
  { id: 11, zh: '休息一下，係為咗行更遠嘅路。', en: 'Resting is part of going the distance.' },
  { id: 12, zh: '你發現到嘅盲點，就係你最大嘅資產。', en: 'The blind spots you uncover are your greatest asset.' },
  { id: 13, zh: '過去係過去，未來係未來。由呢一瞬間開始。', en: 'The past is the past, the future is the future. Start from this moment.' },
  { id: 14, zh: '溫故知新 —— 舊嘅概念值得再鞏固一次。', en: 'Revisit to renew — old concepts are worth strengthening again.' },
  { id: 15, zh: '一步一步嚟，你已經行咗好遠。', en: "Step by step — you've already come a long way." },
  { id: 16, zh: '緊張係正常嘅，代表你好在乎。', en: "Feeling nervous is normal — it means you care." },
  { id: 17, zh: '唔識唔緊要，識問就叻。', en: "Not knowing is fine — knowing to ask is a strength." },
  { id: 18, zh: '你嘅努力，就算冇人睇到，都係真實存在。', en: 'Your effort is real, even when no one else sees it.' },
  { id: 19, zh: '放榜前呢段等待，我哋一齊承載。', en: "The waiting before results — we'll hold it together." },
  { id: 20, zh: '一次考試量度唔到你成個人。', en: 'One exam cannot measure the whole of who you are.' },
  { id: 21, zh: '溫書累嘅時候，記得對自己溫柔啲。', en: 'When revision gets tiring, be gentle with yourself.' },
  { id: 22, zh: '每一份練習，都係實打實嘅回報。', en: 'Every drill is a real, honest return.' },
  { id: 23, zh: '搞清楚一個概念，好過死記十條公式。', en: 'Truly understanding one concept beats memorising ten formulas.' },
  { id: 24, zh: '你行到嚟呢一步，已經好唔容易。', en: "Getting this far already wasn't easy." },
]
