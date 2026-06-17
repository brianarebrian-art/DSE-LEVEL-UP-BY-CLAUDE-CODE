import Link from 'next/link'
import { ArrowRight, Trophy, Flame } from 'lucide-react'

const mockLeaderboard = [
  { rank: 1, name: 'Marco L.', score: 12, grade: '5**', streak: 7 },
  { rank: 2, name: 'Rachel C.', score: 11, grade: '5*', streak: 5 },
  { rank: 3, name: 'Jayden K.', score: 11, grade: '5*', streak: 3 },
  { rank: 4, name: 'Sofia W.', score: 10, grade: '5*', streak: 4 },
  { rank: 5, name: 'Ethan H.', score: 9, grade: '5', streak: 2 },
  { rank: 6, name: 'Chloe T.', score: 9, grade: '5', streak: 1 },
  { rank: 7, name: 'Lucas M.', score: 8, grade: '4', streak: 6 },
  { rank: 8, name: 'Emma Y.', score: 7, grade: '4', streak: 2 },
]

const gradeColors: Record<string, string> = {
  '5**': 'text-amber-400 bg-amber-400/10',
  '5*': 'text-amber-300 bg-amber-300/10',
  '5': 'text-green-400 bg-green-400/10',
  '4': 'text-blue-400 bg-blue-400/10',
  '3': 'text-purple-400 bg-purple-400/10',
}

export default function LeaderboardPage() {
  return (
    <div className="min-h-screen px-4 py-12">
      <div className="max-w-2xl mx-auto">

        <div className="mb-10 text-center">
          <div className="text-4xl mb-3">🏆</div>
          <h1 className="text-3xl font-extrabold mb-2">今日排行榜</h1>
          <p className="text-slate-500">數學綜合練習 · 匿名排名</p>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {[
            { label: '今日參與', value: '342' },
            { label: '平均分', value: '7.8 / 12' },
            { label: '5 級以上', value: '23%' },
          ].map((s) => (
            <div key={s.label} className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center">
              <div className="text-xl font-bold text-amber-400 mb-1">{s.value}</div>
              <div className="text-xs text-slate-500">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Leaderboard table */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden mb-8">
          <div className="px-5 py-3 border-b border-slate-800 flex items-center gap-2">
            <Trophy size={14} className="text-amber-400" />
            <span className="text-sm font-semibold text-slate-300">本週最高分</span>
          </div>
          <div className="divide-y divide-slate-800/50">
            {mockLeaderboard.map((entry) => (
              <div key={entry.rank} className="flex items-center gap-4 px-5 py-3.5">
                {/* Rank */}
                <div className="w-8 text-center">
                  {entry.rank <= 3 ? (
                    <span className="text-lg">
                      {entry.rank === 1 ? '🥇' : entry.rank === 2 ? '🥈' : '🥉'}
                    </span>
                  ) : (
                    <span className="text-sm text-slate-600 font-mono">{entry.rank}</span>
                  )}
                </div>

                {/* Name */}
                <div className="flex-1">
                  <div className="font-medium text-sm">{entry.name}</div>
                  <div className="text-xs text-slate-600 flex items-center gap-1">
                    <Flame size={10} className="text-orange-400" />
                    {entry.streak} 日連續
                  </div>
                </div>

                {/* Score */}
                <div className="text-right">
                  <div className="font-bold">{entry.score}/12</div>
                  <div className={`text-xs px-2 py-0.5 rounded-full inline-block ${gradeColors[entry.grade] ?? 'text-slate-500 bg-slate-700'}`}>
                    {entry.grade}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <p className="text-slate-500 text-sm mb-4">完成練習，上榜！</p>
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
