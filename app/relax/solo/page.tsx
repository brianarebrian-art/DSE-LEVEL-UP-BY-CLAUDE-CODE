import BackButton from '../components/BackButton'
import SoloPlayer from '../components/SoloPlayer'

// /relax/solo — 🎧 單排補 MP：官方 YouTube 電台（Lo-fi／落雨）+ Web Audio 雙耳節拍。
export default function RelaxSoloPage() {
  return (
    <div>
      <BackButton />
      <div className="mt-4 mb-6">
        <h1 className="text-xl font-bold text-[#E8E8EC]">🎧 單排補 MP</h1>
        <p className="text-sm text-[#8B8B96] mt-1">揀首聲音，閉埋眼，抖一陣。聽 1 首都得。</p>
      </div>
      <SoloPlayer />
    </div>
  )
}
