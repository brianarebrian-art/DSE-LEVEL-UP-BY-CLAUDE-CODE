import { HotlineCard } from 'dse-level-up'

// 公開求助熱線卡。號碼係香港真實官方熱線（撒瑪利亞會 2896 0000、生命熱線 2382 0000），
// 唔可以改成示範號碼 —— 一個假號碼 render 出嚟就係一張教人打錯電話嘅卡。
// 佢喺影子溫書室永遠置頂，唔靠任何自動偵測觸發。

export function Default() {
  return (
    <div className="max-w-lg">
      <HotlineCard />
    </div>
  )
}

export function Emphasis() {
  return (
    <div className="max-w-lg">
      <HotlineCard emphasis />
    </div>
  )
}
