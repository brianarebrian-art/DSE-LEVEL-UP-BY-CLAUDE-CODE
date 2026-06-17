import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import MathText from '@/components/MathText'

const frameworks = [
  {
    id: 1,
    emoji: '🔄',
    name: '轉化思維',
    tagline: '將複雜問題化為已知形式',
    description:
      '考試最常考的方式——看似新題，其實係同一個結構。識得「轉化」，任何數字都難唔到你。',
    official: {
      year: 2023,
      paper: 'Paper 1 Q1',
      content: '解方程 $2x^2 + 3x - 5 = 0$，求 $x$ 的值。',
      answer: '$x = 1$ 或 $x = -\\frac{5}{2}$',
    },
    analysis: '考核「因式分解」或「求根公式」的應用能力。數字改晒都係考同一個技能——辨認方程形式、選擇正確方法。',
    rewritten: {
      content: '解方程 $3x^2 + 5x - 2 = 0$，求 $x$ 的值。',
      answer: '$x = \\frac{1}{3}$ 或 $x = -2$',
    },
    topics: ['二次方程', '三角方程', '指數方程'],
  },
  {
    id: 2,
    emoji: '📈',
    name: '變化率直覺',
    tagline: '導數 = 斜率 = 速度 = 瞬時變化',
    description:
      '每年必考微積分——但考核唔係「計導數」，係「理解導數代表咩」。斜率、極值、切線，全都係同一個概念的不同表現。',
    official: {
      year: 2022,
      paper: 'Paper 1 Q5',
      content: '設 $f(x) = x^3 - 3x^2 + 4$，求 $f(x)$ 的極大值。',
      answer: '$f(0) = 4$（極大值）',
    },
    analysis: '考核：用 $f\'(x) = 0$ 找臨界點，再用二階導判斷極大/極小。變化率為零的點就是極值——這是核心直覺。',
    rewritten: {
      content: '設 $g(x) = 2x^3 - 6x^2 + 3$，求 $g(x)$ 的極大值。',
      answer: '$g(0) = 3$（極大值）',
    },
    topics: ['導數', '極值', '切線', '優化問題'],
  },
  {
    id: 3,
    emoji: '🎯',
    name: '條件分解',
    tagline: '將複合條件逐步拆解',
    description:
      '概率題唔係靠感覺——係靠系統分解。「發生 A 同發生 B 的概率」 = 先拆開條件，再組合答案。',
    official: {
      year: 2021,
      paper: 'Paper 1 Q8',
      content: '袋中有 3 紅球和 4 藍球，隨機取出 2 球，求兩球顏色相同的概率。',
      answer: '$\\frac{3}{7}$',
    },
    analysis: '條件分解：「兩球同色」= 「兩紅」OR「兩藍」。$P = \\frac{C_3^2 + C_4^2}{C_7^2} = \\frac{3+6}{21} = \\frac{9}{21} = \\frac{3}{7}$',
    rewritten: {
      content: '袋中有 4 紅球和 6 藍球，隨機取出 2 球，求兩球顏色相同的概率。',
      answer: '$\\frac{C_4^2+C_6^2}{C_{10}^2} = \\frac{6+15}{45} = \\frac{21}{45} = \\frac{7}{15}$',
    },
    topics: ['概率', '組合計數', '條件概率'],
  },
  {
    id: 4,
    emoji: '🏗️',
    name: '建模能力',
    tagline: '將文字問題轉化為數學模型',
    description:
      '考試最「trap」的題型——題目係關於商品、人口、面積，但底層係數學函數。識得建模，文字再長都唔怕。',
    official: {
      year: 2023,
      paper: 'Paper 1 Q10',
      content: '某商品定價 $p$ 元，每週銷量為 $(80 - p)$ 件。求最高週收益。',
      answer: '$\\$1600$（當 $p = 40$ 時）',
    },
    analysis: '建模步驟：設收益 $R(p) = p(80-p) = 80p - p^2$。這係開口向下的拋物線，頂點 $p = 40$。$R(40) = 40 \\times 40 = \\$1600$。',
    rewritten: {
      content: '某商品定價 $x$ 元，月銷量為 $(100 - 2x)$ 件（$0 < x < 50$）。求最高月收益。',
      answer: '$\\$1250$（當 $x = 25$ 時）',
    },
    topics: ['函數建模', '最優化', '應用題'],
  },
]

export default function MethodologyPage() {
  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-4xl mx-auto">

        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-full px-4 py-2 mb-6 text-sm text-amber-300">
            核心方法論
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-4">
            點解改寫版練習
            <br />
            <span className="text-amber-400">真係可以幫你考好 DSE？</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
            佢唔係叫你背多幾道題目。係叫你睇穿每道題目背後的邏輯——
            然後無論 HKEAA 點改數字、點換情景，你都識答。
          </p>
        </div>

        {/* The core insight */}
        <div className="bg-gradient-to-r from-amber-500/10 to-orange-500/5 border border-amber-500/20 rounded-2xl p-6 sm:p-8 mb-16">
          <h2 className="text-xl font-bold mb-4">點解有人永遠考好成績？</h2>
          <p className="text-slate-300 leading-relaxed mb-4">
            唔係因為佢背曬全部 past paper 答案。係因為佢知道每道題目背後考的是<strong className="text-amber-400">哪個底層邏輯</strong>——
            所以無論 HKEAA 換咩數字、換咩情景，只要邏輯係一樣的，佢都即刻 get 到怎麼做。
          </p>
          <p className="text-slate-400 text-sm">
            本平台的改寫題，就係用 AI 分析 10 年 DSE 試卷，提煉出每道題的核心考點，
            然後用新的數字、新的情景，考你同一個邏輯。做完，你掌握的係邏輯——不是答案。
          </p>
        </div>

        {/* 4 Frameworks */}
        <h2 className="text-2xl font-bold mb-8">4 個核心框架示範</h2>

        <div className="space-y-10">
          {frameworks.map((f) => (
            <div key={f.id} className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">
              {/* Framework header */}
              <div className="border-b border-slate-800 px-6 py-5 flex items-center gap-4">
                <span className="text-3xl">{f.emoji}</span>
                <div>
                  <h3 className="text-lg font-bold">{f.name}</h3>
                  <p className="text-slate-400 text-sm">{f.tagline}</p>
                </div>
                <div className="ml-auto hidden sm:flex gap-2 flex-wrap justify-end">
                  {f.topics.map((t) => (
                    <span key={t} className="text-xs text-amber-400/70 bg-amber-400/10 px-2 py-0.5 rounded-full">
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              {/* Description */}
              <div className="px-6 py-4 text-slate-400 text-sm leading-relaxed border-b border-slate-800/50">
                {f.description}
              </div>

              {/* 3-column breakdown */}
              <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-800">
                {/* Official */}
                <div className="p-5">
                  <div className="text-xs text-slate-600 uppercase tracking-wide mb-3 font-medium">官方試題</div>
                  <div className="text-xs text-amber-400 mb-3 font-mono">{f.official.year} DSE {f.official.paper}</div>
                  <p className="text-slate-300 text-sm leading-relaxed mb-3">
                    <MathText>{f.official.content}</MathText>
                  </p>
                  <div className="text-xs text-slate-600">
                    答案：<MathText>{f.official.answer}</MathText>
                  </div>
                </div>

                {/* Analysis */}
                <div className="p-5 bg-amber-500/5">
                  <div className="text-xs text-slate-600 uppercase tracking-wide mb-3 font-medium">核心邏輯分析</div>
                  <p className="text-slate-400 text-sm leading-relaxed">
                    <MathText>{f.analysis}</MathText>
                  </p>
                </div>

                {/* Rewritten */}
                <div className="p-5 bg-green-500/5">
                  <div className="text-xs text-slate-600 uppercase tracking-wide mb-3 font-medium">改寫版（本平台）</div>
                  <p className="text-slate-300 text-sm leading-relaxed mb-3">
                    <MathText>{f.rewritten.content}</MathText>
                  </p>
                  <div className="text-xs text-slate-600 mb-4">
                    答案：<MathText>{f.rewritten.answer}</MathText>
                  </div>
                  <Link
                    href="/practice"
                    className="text-xs text-green-400 bg-green-400/10 hover:bg-green-400/20 border border-green-400/20 px-3 py-1.5 rounded-lg transition-all inline-block"
                  >
                    練習類似題 →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <h2 className="text-2xl font-bold mb-4">準備好實戰？</h2>
          <p className="text-slate-500 mb-6">12 條改寫版練習題，涵蓋以上 4 個框架</p>
          <Link
            href="/practice"
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-black font-bold px-8 py-4 rounded-xl transition-all"
          >
            開始練習 <ArrowRight size={18} />
          </Link>
        </div>
      </div>
    </div>
  )
}
