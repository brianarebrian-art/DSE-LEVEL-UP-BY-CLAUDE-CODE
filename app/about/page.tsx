import Link from 'next/link'
import { ArrowRight, Mail } from 'lucide-react'

export default function AboutPage() {
  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-3xl sm:text-4xl font-extrabold mb-4">
            關於 <span className="text-amber-400">DSE Level Up</span>
          </h1>
          <p className="text-slate-400 text-lg">
            一個 2026 DSE 考生，一個問題：點樣真係考好 DSE？
          </p>
        </div>

        {/* Story */}
        <div className="space-y-6 text-slate-300 leading-relaxed">

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h2 className="font-bold text-lg mb-3">為什麼要做呢個平台？</h2>
            <p className="text-slate-400 mb-4">
              我係今屆（2026）DSE 考生。溫書期間，我一直用 past paper 操練，但做完一份又一份之後，慢慢發現一件事：
            </p>
            <p className="text-slate-300 font-medium mb-4">
              「咦，其實每年 DSE 都係考緊同一樣嘢——只係換左個數字。」
            </p>
            <p className="text-slate-400">
              我決定用 AI 系統分析 2014–2023 年的 DSE Math 試卷，提煉每道題背後考核的底層邏輯。
              發現唔係 100 個邏輯，係 12 個核心框架。
            </p>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h2 className="font-bold text-lg mb-3">改寫題目的方法</h2>
            <ol className="space-y-3 text-slate-400">
              <li className="flex gap-3">
                <span className="text-amber-400 font-bold shrink-0">1.</span>
                <span>分析每道官方試題的考核能力點（唔係答案，係「考緊乜嘢」）</span>
              </li>
              <li className="flex gap-3">
                <span className="text-amber-400 font-bold shrink-0">2.</span>
                <span>將數字、名稱、情景全部改動，但保留相同的邏輯結構</span>
              </li>
              <li className="flex gap-3">
                <span className="text-amber-400 font-bold shrink-0">3.</span>
                <span>每道改寫題標注「考核框架」，讓你知道自己在練習哪個邏輯</span>
              </li>
              <li className="flex gap-3">
                <span className="text-amber-400 font-bold shrink-0">4.</span>
                <span>解釋說明不直接給答案，而係點出邏輯，留思考空間</span>
              </li>
            </ol>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h2 className="font-bold text-lg mb-3">承諾</h2>
            <div className="space-y-2 text-slate-400">
              <div className="flex items-start gap-2">
                <span className="text-green-400 mt-0.5">✓</span>
                <span><strong className="text-slate-300">完全免費</strong>——我唔係為咗賺錢，係想幫同屆考生</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-400 mt-0.5">✓</span>
                <span><strong className="text-slate-300">無廣告</strong>——唔想破壞學習體驗</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-400 mt-0.5">✓</span>
                <span><strong className="text-slate-300">開源方法論</strong>——即使平台有一日唔喺，方法論永遠存在</span>
              </div>
              <div className="flex items-start gap-2">
                <span className="text-green-400 mt-0.5">✓</span>
                <span><strong className="text-slate-300">持續改善</strong>——你的 feedback 係我最大動力</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
            <h2 className="font-bold text-lg mb-3">聯絡我</h2>
            <p className="text-slate-400 mb-4">
              有任何問題、建議、或者你想報告 bug——都可以搵我。
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href="mailto:brianarebrian@gmail.com"
                className="inline-flex items-center gap-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 px-4 py-2.5 rounded-xl text-sm transition-all"
              >
                <Mail size={16} className="text-amber-400" /> brianarebrian@gmail.com
              </a>
            </div>
          </div>

          {/* Legal */}
          <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-5 text-xs text-slate-600 leading-relaxed">
            <strong className="text-slate-500">法律聲明：</strong>
            本平台提供之試題均為獨立改寫版本，旨在協助考生練習應試技巧，並非香港考試及評核局（HKEAA）官方試題。
            官方歷屆試題請前往 HKEAA 網站下載。等級預測僅供參考，最終成績以 HKEAA 公布為準。
          </div>
        </div>

        {/* CTA */}
        <div className="mt-10">
          <Link
            href="/practice"
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-black font-bold px-6 py-3 rounded-xl transition-all"
          >
            開始練習 <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </div>
  )
}
