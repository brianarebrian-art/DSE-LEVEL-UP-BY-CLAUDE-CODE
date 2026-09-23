// 靜態資產入面唔准有收款工具。
//
// 2026-09-23 加。憲章 §3「絕對免費原則」＋ §3.2 記低咗 2026-09-05 剷除整套
// 收費框架：Stripe 接線、/confirm-payment、/thank-you、lib/payment/、五張資料表
// 全部刪走。**但 `public/` 漏低咗兩個檔**：
//
//   public/alipayhk-qr.png   （2026-06-22，108KB）
//   public/wechatpay-qr.png  （2026-06-22，120KB）
//
// 兩個都係真嘅收款二維碼 —— alipayhk 嗰張畫面上面寫住「收款 (HKD)」同
// 「開啟 AlipayHK App 掃描二維碼付款」。全 repo 零引用，所以冇任何測試、
// 冇任何 lint、冇 claims-guard 捉得到佢哋：**冇人 import 嘅檔案唔會出現喺
// 任何掃描結果入面**。而 `public/` 係原樣派出去嘅，即係嗰三個月入面，
// 任何人都 fetch 得到一個屬於創辦人嘅收款碼。
//
// 呢個就係點解個閘要掃【檔案系統】，唔係掃 import graph：
// 上一次剷收費系統，剷嘅係「代碼入面搵得到」嘅嘢。
//
// 個閘守嘅係【類】：任何收款／支付品牌嘅靜態資產。唔淨止嗰兩個檔名。

import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readdirSync, statSync } from 'node:fs'
import { join, relative } from 'node:path'
import { fileURLToPath } from 'node:url'

const ROOT = fileURLToPath(new URL('../../', import.meta.url))

/** 收款／支付工具嘅品牌同字眼。 */
const PAYMENT = /alipay|wechat\s?pay|wechatpay|payme|fps|octopus|八達通|stripe|paypal|收款|付款|轉數快/i

/**
 * 刻意唔攔嘅字：
 * · `qr` 自己 —— `public/qr.png` 係戰績卡上面嗰個【連去本站】嘅 QR
 *   （`components/DailyStatsCard.tsx` 預設 `qrSrc = '/qr.png'`），
 *   佢喺度嘅理由同收款完全無關。一個攔住 `qr` 嘅閘會即刻要人加 allowlist，
 *   而一個要日日加 allowlist 嘅閘，好快就冇人再讀佢嗌乜。
 */
const ALLOW = new Set<string>([])

function filesIn(dir: string, out: string[] = []): string[] {
  for (const name of readdirSync(dir)) {
    if (name.startsWith('.')) continue
    const full = join(dir, name)
    if (statSync(full).isDirectory()) filesIn(full, out)
    else out.push(full)
  }
  return out
}

test('public/ 入面冇收款工具嘅靜態資產', () => {
  const hits = filesIn(join(ROOT, 'public'))
    .map((f) => relative(ROOT, f))
    .filter((f) => PAYMENT.test(f) && !ALLOW.has(f))

  assert.deepEqual(
    hits,
    [],
    '本平台 100% 免費（憲章 §3）。收款資產就算冇任何代碼引用，' +
      'public/ 一樣係原樣派出去，任何人 fetch 得到：\n' + hits.join('\n'),
  )
})

test('閘本身捉得到（負向自測）', () => {
  // 冇呢條，上面條測試就算永遠掃唔到嘢都會綠。
  for (const bad of ['public/alipayhk-qr.png', 'public/wechatpay-qr.png', 'public/payme.svg', 'public/收款.png']) {
    assert.ok(PAYMENT.test(bad), `偵測器應該捉到 ${bad}`)
  }
  // 戰績卡嗰個連結 QR 唔可以被當成收款碼。
  assert.equal(PAYMENT.test('public/qr.png'), false, 'public/qr.png 係連去本站嘅 QR，唔應該被攔')
})
