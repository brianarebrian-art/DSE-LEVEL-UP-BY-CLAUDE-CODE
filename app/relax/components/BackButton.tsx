import Link from 'next/link'

// 返去 ⚡ Buff 補給艙主頁（44px 觸控目標，SEN 要求）。
export default function BackButton() {
  return (
    <Link
      href="/relax"
      className="inline-flex items-center gap-1.5 min-h-11 px-2 -ml-2 text-sm text-[#8B8B96] hover:text-[#E8E8EC] transition-colors"
    >
      ← 返去補給艙
    </Link>
  )
}
