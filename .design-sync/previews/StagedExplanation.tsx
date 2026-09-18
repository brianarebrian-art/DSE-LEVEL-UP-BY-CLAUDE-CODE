import { StagedExplanation } from 'dse-level-up'

// 分段解析 —— 唔係一次過倒晒成段解析出嚟，而係一步一步揭。
// 對 ADHD 同閱讀吃力嘅學生實際：一次得一個判斷點。

export function WithSteps() {
  return (
    <div className="max-w-lg">
      <StagedExplanation
        text="租金上限低於均衡水平時，市場會出現短缺。"
        steps={[
          '先認出題目講緊價格【下限】定【上限】—— 上限畫喺均衡之下先有效。',
          '喺上限價格度分別讀出需求量同供給量。',
          '兩者之差就係短缺；短期供給缺乏彈性，所以短缺會持續。',
        ]}
      />
    </div>
  )
}

export function TextOnly() {
  return (
    <div className="max-w-lg">
      <StagedExplanation text="判別式為零時，二次方程有兩個相等的實根，圖像與橫軸相切。" />
    </div>
  )
}
