import { GoodTodayCard } from 'dse-level-up'

// 「今日已經好叻」。服務對象：今日狀態差、做唔到題、但仍然開咗個站嘅學生。
// 憲章大愛設計要求平台唔可以【只在有成績時先出聲】。
//
// `dse_good_today` 只存「今日日期 + 今日抽中嗰句」，逐日覆寫 —— 刻意唔存歷史。
//
// ⚠️ 得一格：鼓勵語要撳咗「我今日有嚟過」先出，而撳掣係互動，靜態卡造唔到。
// 自訂鼓勵語（dse_own_cheers）同樣要撳咗先見到，所以唔另開一格 ——
// 兩格一模一樣係冇資訊嘅。

function seed(own?: string[]) {
  try {
    localStorage.removeItem('dse_good_today')
    if (own) localStorage.setItem('dse_own_cheers', JSON.stringify(own))
    else localStorage.removeItem('dse_own_cheers')
  } catch {
    /* 封鎖咗 storage 就 render 預設句 */
  }
}

export function Default() {
  seed()
  return (
    <div className="max-w-md">
      <GoodTodayCard />
    </div>
  )
}
