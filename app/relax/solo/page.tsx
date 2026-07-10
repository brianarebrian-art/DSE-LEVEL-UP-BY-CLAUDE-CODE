import BackButton from '../components/BackButton'
import SoloPlayer from '../components/SoloPlayer'

// /relax/solo — 自己靜靜地：四段聲音（程序生成 + 官方 Lo-fi 嵌入）。
export default function RelaxSoloPage() {
  return (
    <div>
      <BackButton />
      <div className="mt-4 mb-6">
        <h1 className="text-xl font-bold text-[#E8E8EC]">🎧 自己靜靜地</h1>
        <p className="text-sm text-[#8B8B96] mt-1">揀首聲音，閉埋眼，抖一陣。聽 1 首都得。</p>
      </div>
      <SoloPlayer />
    </div>
  )
}
