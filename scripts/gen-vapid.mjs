#!/usr/bin/env node
// 生成一對 VAPID 金鑰（Web Push 用）。
//
// 用法：  node scripts/gen-vapid.mjs
//
// ⚠️ 呢個 script【只會印出嚟】，一個字都唔會寫入任何檔案。
// 係刻意嘅：私鑰一旦落咗地，就有機會被 commit、被備份、被同步上雲。
// 你自己複製兩條 key 去 Vercel 嘅環境變數（同 .env.local），
// 印完之後清返個 terminal。
//
// 呢個 script 唔需要任何套件 —— Node 內置 crypto 就做得晒（憲章 §5）。

import { generateKeyPairSync } from 'node:crypto'

const { publicKey, privateKey } = generateKeyPairSync('ec', { namedCurve: 'prime256v1' })
const pubJwk = publicKey.export({ format: 'jwk' })
const privJwk = privateKey.export({ format: 'jwk' })

// VAPID 公鑰係 65 bytes 未壓縮 EC 點：0x04 ‖ x ‖ y。
const pub = Buffer.concat([
  Buffer.from([4]),
  Buffer.from(pubJwk.x, 'base64url'),
  Buffer.from(pubJwk.y, 'base64url'),
]).toString('base64url')
const priv = Buffer.from(privJwk.d, 'base64url').toString('base64url')

const BAR = '─'.repeat(70)
console.log(`\n${BAR}\n  VAPID 金鑰（Web Push）\n${BAR}\n`)
console.log('複製落 Vercel → Settings → Environment Variables，以及本機 .env.local：\n')
console.log(`NEXT_PUBLIC_VAPID_PUBLIC_KEY=${pub}`)
console.log(`VAPID_PRIVATE_KEY=${priv}`)
console.log('VAPID_SUBJECT=mailto:你嘅電郵@example.com')
console.log(`\n仲要設一個 cron 密碼（Vercel 會用佢嚟叫 /api/cron/exam-day-nudge）：`)
console.log(`CRON_SECRET=${Buffer.from(crypto.getRandomValues(new Uint8Array(33))).toString('base64url')}`)
console.log(`\n${BAR}`)
console.log('  ⚠️  VAPID_PRIVATE_KEY 同 CRON_SECRET 係秘密。')
console.log('     唔好 commit、唔好貼落對話、唔好寫入任何追蹤緊嘅檔案。')
console.log('     設完之後清返個 terminal（macOS：⌘K）。')
console.log(`${BAR}\n`)
