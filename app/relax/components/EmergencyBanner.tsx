// 緊急熱線橫幅（Sarah — NON-NEGOTIABLE，可以救人一命）。
// 全 relax 區唯一允許帶紅調嘅元素（極淡 danger tint）。
// 號碼為公開官方熱線：香港撒瑪利亞會 2896 0000（24小時）、生命熱線 2382 0000。

export default function EmergencyBanner() {
  return (
    <div className="mt-8 p-4 rounded-xl border border-red-500/10 bg-red-500/5 text-center">
      <p className="text-sm text-white/80 leading-relaxed">
        覺得頂唔順？你唔係一個人。撒瑪利亞會 24hr 熱線：
        <a href="tel:28960000" className="text-[#00F5D4] underline underline-offset-2 px-1 min-h-11 inline-flex items-center">2896 0000</a>
        {' | '}生命熱線：
        <a href="tel:23820000" className="text-[#00F5D4] underline underline-offset-2 px-1 min-h-11 inline-flex items-center">2382 0000</a>
      </p>
      <p className="text-xs text-white/50 mt-1">如情況緊急，請立即致電 999 或前往就近急症室。</p>
    </div>
  )
}
