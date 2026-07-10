import BackButton from './BackButton'

// 同大家一齊 — Discord 影子溫書室。
// ⚠️ NO-PLACEHOLDER 紅線：server 未開，所以唔會放 discord.gg/placeholder 死連結。
// 開咗 server 之後，把下面 DISCORD_INVITE 換成真邀請連結，CTA 自動切換。
// 頻道規則/FAQ/工單已備妥：content/community/。
const DISCORD_INVITE: string | null = null

const CHANNELS = [
  { tag: '#general', desc: '吹水閒聊，任何話題' },
  { tag: '#econ-help / #chinese-help / #math-help / #english-help', desc: '科目互助' },
  { tag: '#late-night-study', desc: '凌晨 12 點後的溫書打卡區' },
  { tag: '#treehole', desc: '樹洞頻道，講完就算，冇人會 judge' },
  { tag: '#sen-friendly', desc: 'ADHD / 讀寫障礙 / 焦慮友善專區' },
]

export default function GroupCommunity() {
  return (
    <div>
      <BackButton />
      <div className="mt-4 mb-6">
        <h1 className="text-xl font-bold text-[#E8E8EC]">👥 同大家一齊</h1>
        <p className="text-sm text-[#8B8B96] mt-1">你唔係一個人。入嚟傾偈、問問題、或者純粹睇人吹水。</p>
      </div>

      <div className="rounded-xl bg-[#14141B] border border-white/10 p-6 mb-4">
        <h2 className="font-bold text-[#E8E8EC]">DSE LEVEL UP 影子溫書室</h2>
        <p className="text-xs text-[#FF006E] mt-0.5 mb-3">Discord{DISCORD_INVITE ? ' · 24/7 開放' : ' · 快將開放'}</p>
        <p className="text-sm text-[#8B8B96] leading-relaxed mb-3">
          一個冇壓力嘅空間。你可以問 Econ 點解，可以呻中文範文太難，可以純粹講「今日好攰」。
        </p>
        <p className="text-xs text-[#8B8B96] mb-5">🌙 深夜溫書室頻道 · 📚 科目互助區 · 🫂 樹洞頻道（純聽唔講都得）</p>

        {DISCORD_INVITE ? (
          <a
            href={DISCORD_INVITE}
            target="_blank"
            rel="noopener noreferrer"
            className="block w-full text-center min-h-11 rounded-[10px] bg-[#14141B] border border-[#FF006E] text-[#FF006E] py-3 font-medium hover:bg-[#FF006E] hover:text-[#0A0A0F] transition-colors"
          >
            加入 Discord 溫書室
          </a>
        ) : (
          <a
            href="mailto:dselevelup@gmail.com?subject=%E6%88%91%E6%83%B3%E5%85%A5%E6%BA%AB%E6%9B%B8%E5%AE%A4&body=%E9%96%8B%E5%AE%A4%E8%A8%98%E5%BE%97%E7%95%99%E4%BD%8D%E4%BF%BE%E6%88%91%EF%BC%81"
            className="block w-full text-center min-h-11 rounded-[10px] bg-[#14141B] border border-[#FF006E] text-[#FF006E] py-3 font-medium hover:bg-[#FF006E] hover:text-[#0A0A0F] transition-colors"
          >
            留低 Email，開室即刻通知你
          </a>
        )}
      </div>

      <div className="rounded-xl bg-[#14141B] border border-white/10 p-6">
        <h3 className="text-sm font-bold text-[#E8E8EC] mb-4">📋 頻道一覽{DISCORD_INVITE ? '' : '（規劃中，規則已寫好）'}</h3>
        <ul className="space-y-3">
          {CHANNELS.map((c) => (
            <li key={c.tag} className="flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#00F5D4] mt-1.5 shrink-0" aria-hidden />
              <span className="text-sm">
                <span className="text-[#E8E8EC] font-medium">{c.tag}</span>
                <span className="text-[#8B8B96]"> — {c.desc}</span>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
