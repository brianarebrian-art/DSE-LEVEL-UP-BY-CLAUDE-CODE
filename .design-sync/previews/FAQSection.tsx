import { FAQSection } from 'dse-level-up'

// 常見問題。入面包括「Sensei 係咪真人」呢類問題 —— 憲章 §16.B 規定
// AI 功能被問到係咪真人時必須如實答，唔可以繞開、唔可以打哈哈。

export function Default() {
  return (
    <div className="max-w-2xl">
      <FAQSection />
    </div>
  )
}
