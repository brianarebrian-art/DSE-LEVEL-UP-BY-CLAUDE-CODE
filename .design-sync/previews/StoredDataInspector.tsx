import { StoredDataInspector } from 'dse-level-up'

// 「睇下我部機存咗啲乜」—— PDPO 透明度：逐個 localStorage key 列出嚟畀學生自己睇。
// 唔係一句「我哋尊重你私隱」，係直接打開畀你數。

export function Default() {
  return (
    <div className="max-w-2xl">
      <StoredDataInspector />
    </div>
  )
}
