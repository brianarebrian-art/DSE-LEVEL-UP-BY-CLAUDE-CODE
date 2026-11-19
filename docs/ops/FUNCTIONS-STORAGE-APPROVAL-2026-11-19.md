# Functions Storage 清理批准包（工作包 1）

狀態：**待批准 · 未刪除任何資源**  
查詢時間：**2026-11-19T22:28:16+08:00**（Asia/Hong_Kong）  
Team：`dselevelup` · Project：`dse-level-up-by-claude-code`（`prj_CQRC5oit3FL5KrrmCaAXxqUugfYu`）  
正式網域：`www.dselevelup.com`／`dselevelup.com`（verified）

機器可讀完整清單：[functions-storage-approval-2026-11-19.json](./functions-storage-approval-2026-11-19.json)

## 基線（已證實）

| 指標 | 值 | 證據等級 |
|------|-----|----------|
| Inventory（去重） | **179** deployments | 已證實（Vercel MCP list） |
| READY production | 29 | 已證實 |
| READY preview | 87 | 已證實 |
| CANCELED | 46 | 已證實 |
| ERROR | 17 | 已證實 |
| Functions Storage GB | **未知** | MCP 無 Usage 讀數；**待你 Dashboard 截圖** |
| Deployment Storage GB | **未知** | 同上 |
| 預期釋放量 | **未知** | 唔虛構 GB；刪後再量 |

歷史參考（唔當即時）：[`L-COST-AND-CAPACITY-2026-10-29.md`](./L-COST-AND-CAPACITY-2026-10-29.md) 曾報 Functions Storage 100%。

## 受保護／保留（A／B）

預設與 [`scripts/ops/delete-old-vercel-previews.mjs`](../../scripts/ops/delete-old-vercel-previews.mjs) 一致：`KEEP_PRODUCTION=3`，`KEEP_PREVIEW=0`。

| ID | 類 | commit | 建立 (HKT) | rollback | 說明 |
|----|----|--------|------------|----------|------|
| `dpl_6qjo5KJKtLkiXrhUQyobEh1MU3Pn` | A | `62331d600080` | 2026-11-13T12:40:41+08:00 | True | 正式使用中 |
| `dpl_56GAcsG82Bwrhy8r31CeEp3TP94x` | B | `a3fb22632b51` | 2026-11-13T12:40:24+08:00 | True | 回滾保留（KEEP_PRODUCTION=3） |
| `dpl_8a6QSm6dhadaZtuGNEeViM8yrWYp` | B | `d453de83ea7c` | 2026-11-13T10:14:37+08:00 | False | 回滾保留（KEEP_PRODUCTION=3） |

最新 production READY（建議視為正式）：`dpl_6qjo5KJKtLkiXrhUQyobEh1MU3Pn` @ `62331d60`（`main`）。

## 分類摘要

| 類 | 意思 | 數量 |
|----|------|------|
| A | 正式使用中 | 1 |
| B | 必要回滾 | 2 |
| D | 建議刪除候選 | 158 |
| E | 待確認（唔刪） | 18 |

建議：**刪除 158** · **待確認 18** · **保留 3**

## 建議分批刪除（批准後先執行）

每批刪除影響：該 deployment URL／preview 失效；正式網域應不受影響（若只刪非 alias 對象）。  
恢復：可重新 build／deploy；**唔保證**同一 `dpl_` ID。刪除後有平台 recovery 期，但通常即時唔再計入用量（以 Dashboard 為準）。

### Batch 1 — 低風險：ERROR + CANCELED（63）

| ID | target | state | branch | commit | created (HKT) |
|----|--------|-------|--------|--------|---------------|
| `dpl_3DRBfYZZfyAheZFEDVP46URyX5gA` | preview | CANCELED | `dependabot/npm_and_yarn/lucide-react-1.72.0` | `9d0a9fee356f` | 2026-11-16T09:14:26+08:00 |
| `dpl_9y3qnpa9nGXdtpNf3JnMoSFUVQST` | preview | CANCELED | `dependabot/npm_and_yarn/anthropic-ai/sdk-1.8.0` | `012fa4a1a809` | 2026-11-16T09:14:05+08:00 |
| `dpl_2yRj2j1Xvw7JXDz3x2gjyc5RZ6MK` | preview | CANCELED | `dependabot/npm_and_yarn/tailwindcss-4.3.5` | `3c1468ef65af` | 2026-11-16T09:13:56+08:00 |
| `dpl_HFFEUYNwd8HEZnXRm1FhnQhRjjdB` | preview | CANCELED | `dependabot/npm_and_yarn/next-16.4.6` | `9a6a1263e7df` | 2026-11-16T09:13:48+08:00 |
| `dpl_81mEgyvmbyF9n5ynHTk93Dqg6Yqo` | preview | CANCELED | `dependabot/npm_and_yarn/sentry/nextjs-11.12.0` | `5ee98a16b0ff` | 2026-11-16T09:13:40+08:00 |
| `dpl_F8FS1GK6VqWVAU8NkKjZss5A8Cux` | preview | CANCELED | `dependabot/npm_and_yarn/eslint-config-next-16.4.6` | `468b9b45dbfc` | 2026-11-16T09:13:18+08:00 |
| `dpl_DXugcc3sKFdnyCpwg5o5GEtffkDP` | preview | CANCELED | `dependabot/npm_and_yarn/eslint-10.14.0` | `c174d2f84a0b` | 2026-11-10T08:56:05+08:00 |
| `dpl_85PbjEubDGJPu7rHFFeZnxs9h7US` | production | CANCELED | `main` | `c0d1900c2184` | 2026-11-10T08:54:12+08:00 |
| `dpl_9XBnJT5TLE19K4KmrgkmyKwh5S1r` | preview | CANCELED | `dependabot/npm_and_yarn/supabase/ssr-0.12.7` | `5894cf62a379` | 2026-11-09T09:14:12+08:00 |
| `dpl_96TQNeH2ajyQysrSee9ZgSpawAcE` | preview | CANCELED | `dependabot/npm_and_yarn/lucide-react-1.69.0` | `ad341430c773` | 2026-11-09T09:14:02+08:00 |
| `dpl_GRvQVbTk4rGheVjhQjpoDbsi8iZQ` | preview | CANCELED | `dependabot/npm_and_yarn/tailwindcss/postcss-4.3.4` | `64872faa1945` | 2026-11-09T09:13:51+08:00 |
| `dpl_8w1wuePENGfk3T2mY8W8Kjtky6rM` | preview | CANCELED | `dependabot/npm_and_yarn/types/node-26.6.6` | `819c6aa3ac9c` | 2026-11-09T09:13:48+08:00 |
| `dpl_8BCFsaPvMzWPtjWXNtwwbqxH5gnf` | preview | CANCELED | `dependabot/npm_and_yarn/eslint-config-next-16.4.5` | `5fdf31bd9cd5` | 2026-11-09T09:13:36+08:00 |
| `dpl_E8iYCsWiqykCZ3hSvzcRzFN4hJjZ` | preview | CANCELED | `dependabot/npm_and_yarn/tailwindcss-4.3.4` | `ba64c4f9b698` | 2026-11-09T09:13:26+08:00 |
| `dpl_GNa6k96Q6RzphwBSjfzu34f5K7tM` | preview | CANCELED | `dependabot/npm_and_yarn/vercel/speed-insights-2.1.0` | `687a7c8c87b3` | 2026-11-09T09:13:17+08:00 |
| `dpl_Dqkk26fiu2p2VigUxEoUjZpv2Fw3` | preview | CANCELED | `dependabot/npm_and_yarn/eslint-10.14.0` | `8b9fd370f17a` | 2026-11-09T09:13:11+08:00 |
| `dpl_FktWyy2pPskJP1vyHXUykSUkC1J5` | preview | CANCELED | `dependabot/npm_and_yarn/sentry/nextjs-11.11.0` | `e9521b8ebf23` | 2026-11-09T09:13:01+08:00 |
| `dpl_B2hUKe9DGrAfmEWbXkey7NjzqJ3o` | preview | CANCELED | `dependabot/npm_and_yarn/anthropic-ai/sdk-1.6.0` | `5403c7e7e2fc` | 2026-11-09T09:12:49+08:00 |
| `dpl_2oKzFzbvwgvv2UuqEbcrisPriyBe` | preview | CANCELED | `cursor/error-system-phase1-ba17` | `44591969272d` | 2026-11-05T21:01:15+08:00 |
| `dpl_CjuuxkrsAw1Qrje85zznsT6J7DhY` | preview | CANCELED | `dependabot/npm_and_yarn/lucide-react-1.64.0` | `a3fdba7b6c6d` | 2026-11-05T18:47:36+08:00 |
| `dpl_BAaLjWehEcCMrNWNh5KSxokJPzsc` | preview | CANCELED | `dependabot/npm_and_yarn/lucide-react-1.64.0` | `2f3d899c53bc` | 2026-11-05T16:42:46+08:00 |
| `dpl_EnnQKF97BiJQnK9GMSoEjGUNCQjL` | preview | CANCELED | `dependabot/npm_and_yarn/katex-0.19.1` | `9a5b097a8208` | 2026-11-05T16:42:44+08:00 |
| `dpl_Cw2vs9YqRbg2h9hXC9vKeoZBh7cb` | preview | CANCELED | `dependabot/npm_and_yarn/anthropic-ai/sdk-1.3.0` | `8025c8ed0fe6` | 2026-11-05T16:42:41+08:00 |
| `dpl_DRVZxsxcH3guMcuAYw3BzrB68opa` | production | CANCELED | `main` | `aa1394f6ad74` | 2026-11-05T16:40:26+08:00 |
| `dpl_7rpiLat7hp36aKVuyB7jnK93ZGpM` | preview | CANCELED | `dependabot/npm_and_yarn/typescript-7.0.2` | `7eb4eda6e78c` | 2026-11-05T16:22:14+08:00 |
| … | | | | | （其餘 38 項見 JSON） |

### Batch 2 — READY preview（69）

Dependabot／Jules／相對舊 preview。

| ID | target | state | branch | commit | created (HKT) |
|----|--------|-------|--------|--------|---------------|
| `dpl_GANicTHacCtAgr4ZQmZR54ixnueC` | preview | READY | `jules-2252358248411228645-9f547546` | `c79477328109` | 2026-11-11T22:02:58+08:00 |
| `dpl_EV74zmAcaYgqBwuE1CALH7XvDSsf` | preview | READY | `cursor/p1-home-practice-signup-eea4` | `98c32361ba3d` | 2026-11-06T14:00:26+08:00 |
| `dpl_GJxUVzoEFweuf6u47MKfpfXR7Jzo` | preview | READY | `cursor/lock-general-feedback-writes-f2eb` | `6927ba3dc056` | 2026-11-06T11:35:27+08:00 |
| `dpl_GUqa2hkSiyW4ZhsXyW4MTzQ9Dk41` | preview | READY | `cursor/anonymous-feedback-bc93` | `c934bdc7fc81` | 2026-11-06T10:17:02+08:00 |
| `dpl_wS1zNeP5GZ3E7EQCiz4ptn99Rq7C` | preview | READY | `cursor/fsrs-socratic-pillars-1fa9` | `c604f211b5bb` | 2026-11-05T22:56:07+08:00 |
| `dpl_6S1CYAM1nqhQkGkWKhkrRe67v1f3` | preview | READY | `cursor/fsrs-socratic-pillars-1fa9` | `a41231ee7302` | 2026-11-05T22:30:44+08:00 |
| `dpl_869iLD6vdQRqSjZzm8PHJrrhYJma` | preview | READY | `cursor/fsrs-socratic-pillars-1fa9` | `0e8c3faa4093` | 2026-11-05T22:25:16+08:00 |
| `dpl_AkCGPbbb9pv2DM8RZbnRbgsNRdt1` | preview | READY | `cursor/fsrs-socratic-pillars-1fa9` | `25c2040fcae6` | 2026-11-05T22:17:27+08:00 |
| `dpl_CzeFRX7efqFXfTiFeHBqzTx3tFnv` | preview | READY | `cursor/error-system-phase1-ba17` | `2bc70c448f57` | 2026-11-05T21:10:33+08:00 |
| `dpl_9bkBDM3gYg1Nk6C75tP7m4Pqi6on` | preview | READY | `cursor/error-system-phase1-ba17` | `e75e18f944fe` | 2026-11-05T21:06:28+08:00 |
| `dpl_4wWZShV2uQwdi3skseAKtJMxLfAL` | preview | READY | `cursor/error-system-phase1-ba17` | `c36f73680b1a` | 2026-11-05T21:03:41+08:00 |
| `dpl_7bd4v2ENQd9byBZ8Hjqb1uQCRh2W` | preview | READY | `cursor/error-system-phase1-ba17` | `a1796fa31b35` | 2026-11-05T20:57:38+08:00 |
| `dpl_AVepp6d1Q4ofZh8dBbiH5QddR8ha` | preview | READY | `cursor/error-system-phase1-ba17` | `634149c3557a` | 2026-11-05T20:55:07+08:00 |
| `dpl_J64faneuWz1Ahdd6QzzdZpk3FzAn` | preview | READY | `fix/ci-green-pipeline-hardening-5162916862186614060` | `1a9d452f9517` | 2026-11-05T20:38:50+08:00 |
| `dpl_C2FmYXTfzd5bDu3QkR658dbvbrkM` | preview | READY | `feat/original-icon-system-13800322783841313982` | `9482a7c555ae` | 2026-11-05T20:28:14+08:00 |
| `dpl_BiFcjiUvjyofmZU4ndmiNkJmbUut` | preview | READY | `feat/original-icon-system-13800322783841313982` | `fc61a1d4d349` | 2026-11-05T20:16:46+08:00 |
| `dpl_J5i8toTTaNyJWdeiwHAKb6iaWDYF` | preview | READY | `fix/ci-green-pipeline-hardening-5162916862186614060` | `34155c345b04` | 2026-11-05T19:57:11+08:00 |
| `dpl_B53fjUV1HnFEK6ige6ZsHE85EmaF` | preview | READY | `fix/jules-v2-mega-hardening-1834313361107824094` | `df4e92f5be78` | 2026-11-05T19:56:53+08:00 |
| `dpl_EmySYfbA8CxFFkp3iSujDU4QXaiW` | preview | READY | `fix/ci-green-pipeline-hardening-5162916862186614060` | `4f978af25925` | 2026-11-05T18:30:11+08:00 |
| `dpl_HcMJYRXsiVH6GVxi8GDbhg9MPBwZ` | preview | READY | `fix/ci-green-pipeline-hardening-5162916862186614060` | `9fd4227a8ebc` | 2026-11-05T18:08:58+08:00 |
| `dpl_6UMUQMuoW4vF3xov8nz8RwuvohGf` | preview | READY | `fix/jules-v2-mega-hardening-1834313361107824094` | `a1167838689f` | 2026-11-05T16:35:13+08:00 |
| `dpl_AdFAvytj5YHdnRGWYDVJHRteSqZs` | preview | READY | `fix/unblock-and-v6-hardening-5072772221867053830` | `d966caeb1378` | 2026-11-05T16:18:36+08:00 |
| `dpl_4D7wqB4nJuSiLFDFHMLfLNgf1JNq` | preview | READY | `fix/vercel-deployment-and-admin-ssr-13235156653816259292` | `0c4a9da288f1` | 2026-11-05T15:15:55+08:00 |
| `dpl_Hu4fF625c2QpxjRpE4k4XzoxAKAA` | preview | READY | `docs/pre-commit-verification-7620716863346364219` | `c5acb62125f0` | 2026-11-05T13:41:11+08:00 |
| `dpl_8qxKAtnAgeEfeqMq7zLsmEgoNJ91` | preview | READY | `security/p0-critical-rce-full-fix-14952407914974235964` | `d474cc9c726c` | 2026-11-05T12:33:13+08:00 |
| … | | | | | （其餘 44 項見 JSON） |

### Batch 3 — 舊 production READY（超出保留 3）（26）

| ID | target | state | branch | commit | created (HKT) |
|----|--------|-------|--------|--------|---------------|
| `dpl_4qy25qzpjX9uvuvK61HSczQ1G7tX` | production | READY | `main` | `87a71a209a4e` | 2026-11-13T09:26:37+08:00 |
| `dpl_8MvSFzUxq2Ji37rtPkkUwdHESNtu` | production | READY | `main` | `52106485eecb` | 2026-11-13T09:17:10+08:00 |
| `dpl_5NL9fF8k7qKw5ZoMjorYNT6TE4kW` | production | READY | `main` | `1cf7b6277847` | 2026-11-13T08:08:51+08:00 |
| `dpl_ArG2RQCEG3qKKGMJq4MEsp6iFagW` | production | READY | `main` | `5607babce657` | 2026-11-11T22:03:25+08:00 |
| `dpl_Bfx5RHsJ4FtNWQEhZtzHUs6Wdaff` | production | READY | `main` | `2d5c3f524bd5` | 2026-11-10T22:16:13+08:00 |
| `dpl_81JQUNd91YRRp7ehnR8TdxyzcPVx` | production | READY | `main` | `d8fd41a8f95b` | 2026-11-10T08:54:26+08:00 |
| `dpl_4o8ucAmkibFEcP33EzY5hwZVukeu` | production | READY | `main` | `5cfd9edd2a4e` | 2026-11-10T08:53:49+08:00 |
| `dpl_7jUoCGukzSuGG9XtyQtEWfbdRU4C` | production | READY | `main` | `f75e05e4d3f5` | 2026-11-06T14:38:33+08:00 |
| `dpl_Furq2dtWD7MAAL4oez9hCmwXkxdW` | production | READY | `main` | `b3f41b6a7d87` | 2026-11-06T10:24:41+08:00 |
| `dpl_BTBaC4FYiFxVcvZZgpa3LCGhkUTU` | production | READY | `main` | `a135c129b60b` | 2026-11-05T22:39:56+08:00 |
| `dpl_EWg6BsmtLeGBY5eUkNXQMcYEwJkc` | production | READY | `main` | `9700240353d4` | 2026-11-05T21:11:35+08:00 |
| `dpl_9Na47MA2sFNfLKepdp4PJRHSPzqU` | production | READY | `main` | `0dc04222d6e6` | 2026-11-05T16:41:00+08:00 |
| `dpl_G7X5zfDUmApbvvxZLpSZggg6i76E` | production | READY | `main` | `9d5bead64e1f` | 2026-11-05T16:40:17+08:00 |
| `dpl_FK6ZkSSNWsBKzthQRqJzEmpeZYQr` | production | READY | `main` | `f90adbc33267` | 2026-11-05T16:20:04+08:00 |
| `dpl_2vJGyH57krM8QPbjvEn7AEGhCaK1` | production | READY | `main` | `cd060af9965b` | 2026-11-05T13:45:16+08:00 |
| `dpl_JDw8gGef56osyHz3WVbqQ1Pzs3CJ` | production | READY | `main` | `f7961a8088b3` | 2026-11-05T12:07:47+08:00 |
| `dpl_AhPLd4H5copApzNBtkWpdtYAdtSD` | production | READY | `main` | `bf31707c82b2` | 2026-11-05T00:02:52+08:00 |
| `dpl_8dC4fd7rDgdpTLsRULtaGYGCrWVz` | production | READY | `main` | `ecc887bb8a32` | 2026-11-04T23:21:27+08:00 |
| `dpl_CPHDSyNzpc5owBQ562XsbmNqm3LG` | production | READY | `main` | `d9bb6a31b962` | 2026-11-04T22:57:18+08:00 |
| `dpl_ARuLBcQnFQtKi5wPLaGHsXrahAbw` | production | READY | `main` | `1740cb1ce79d` | 2026-11-04T22:25:55+08:00 |
| `dpl_8pSU2cH3VfXuen2f6Jm3qddB9YV5` | production | READY | `main` | `95134df63126` | 2026-11-04T08:34:42+08:00 |
| `dpl_CcWaxcU7ZqLMKanLYNsq9Wh3swn5` | production | READY | `main` | `a67e08de6e19` | 2026-11-03T19:59:41+08:00 |
| `dpl_J6DB8MFAmHC61tzUzYGv3gMZWFZ7` | production | READY | `main` | `a4849f993f19` | 2026-11-03T19:55:46+08:00 |
| `dpl_5FcDQsvYx3q6AHpehj7NBsSPJehq` | production | READY | `main` | `cec770e623db` | 2026-11-03T19:25:02+08:00 |
| `dpl_HgDJuN8FBYEymjFdSzLTsordjBM8` | production | READY | `main` | `39091482d48b` | 2026-11-03T19:10:39+08:00 |
| `dpl_24aDFNtuVzgbkqygCg2D6VXBVa1e` | production | READY | `main` | `1c4476788555` | 2026-11-01T12:03:16+08:00 |

## 待確認（E）— 本輪**不刪**（18）

近約 7 日（相對最新樣本）READY preview；若你確認無用途，可下一輪改為刪除。

| ID | target | state | branch | commit | created (HKT) |
|----|--------|-------|--------|--------|---------------|
| `dpl_G85ZQ7hrvWhVyeLcnVhTz8HFXQmq` | preview | READY | `v0/fix-language-control-overlap` | `0f15a9421dd1` | 2026-11-13T10:45:05+08:00 |
| `dpl_HoEXENa36qaNvWrnfpvfTLF2y6TR` | preview | READY | `v0/practice-question-translation` | `2cdc20ee9300` | 2026-11-13T10:12:56+08:00 |
| `dpl_BVnzMVn6EhuLxMsFgTBHLa4uoWhc` | preview | READY | `v0/always-visible-language-switch` | `bedd2e147b77` | 2026-11-13T09:23:26+08:00 |
| `dpl_GUsEaJfqJU3Y8bDMcD9hTPY32Liv` | preview | READY | `cursor/i18n-phase1-language-switch-d17c` | `a40a1aff4723` | 2026-11-13T09:01:58+08:00 |
| `dpl_77TgaHGnPPTnM4hiSeqhwPgagMQN` | preview | READY | `cursor/ci-free-runner-ad5a` | `f3e2f606309b` | 2026-11-13T08:04:41+08:00 |
| `dpl_7sQ36J3e2kX2sjGjgjdSasSCGQUH` | preview | READY | `cursor/v4-duo-trust-funnel-7f97` | `15e3e528dbdf` | 2026-11-13T00:45:57+08:00 |
| `dpl_7qUsqBcVJrXeZxdihJUSmTgdN4EW` | preview | READY | `cursor/v4-duo-trust-funnel-7f97` | `abac8cb80797` | 2026-11-13T00:36:57+08:00 |
| `dpl_6TsyJ24hsLpAwCt2AYTzz5KqJU5d` | preview | READY | `cursor/practice-data-webhook-d7e1` | `d44b26265eef` | 2026-11-12T22:38:05+08:00 |
| `dpl_43DTAfveZWF8TNaWB1qcs8QfavyW` | preview | READY | `cursor/regenerate-token-doc-255e` | `adf95397ba09` | 2026-11-12T22:12:44+08:00 |
| `dpl_BFGK9NMu4cRfDrGiCPcJNoRVyWXN` | preview | READY | `vibes-larp-audit-remediation-3451695300137890461` | `d412dc030923` | 2026-11-10T22:07:37+08:00 |
| `dpl_E8ZqZuN1WuMD2kadgDPHXCtnx34V` | preview | READY | `v0/jules-v4-audit` | `b5a0e03296c7` | 2026-11-10T22:06:47+08:00 |
| `dpl_5VLS7pwUU4n5JhXprcQmEXrr5HFB` | preview | READY | `security/react-nextjs-dos-patched-preview` | `b26205792b39` | 2026-11-10T22:06:13+08:00 |
| `dpl_6FYhzPUGdas9h8WHFLnTcjm3MSnZ` | preview | READY | `jules/growth-seo-ui-overhaul-16748498362259939976` | `6e01cdbd87d1` | 2026-11-10T21:40:22+08:00 |
| `dpl_4wXqLSPva9weo2W8Wt2GjBoP29S9` | preview | READY | `cursor/mobile-chrome-guest-progress-e1cf` | `85ab74370732` | 2026-11-10T11:47:39+08:00 |
| `dpl_E8CHSUEcHugAkMrPQqWHXj4FEXni` | preview | READY | `cursor/tighten-secondary-labels-78a2` | `96e440e01e8a` | 2026-11-10T11:28:56+08:00 |
| `dpl_3Uo6cTJaxje2FCNLMfjz2niH9qxp` | preview | READY | `cursor/feedback-comfort-homepage-35a0` | `d96d5ba8055f` | 2026-11-10T11:18:35+08:00 |
| `dpl_F8diAcHBRSd7EjLSRJrKM2AuEuq9` | preview | READY | `cursor/tighten-secondary-labels-78a2` | `aab332b5b89b` | 2026-11-10T11:09:50+08:00 |
| `dpl_4g6P83ibZPQtyU4knmpPhYASZYNF` | preview | READY | `cursor/subject-explain-brand-35f7` | `9c34965edb60` | 2026-11-10T09:38:34+08:00 |

## 執行閘門

1. ~~明確批准 Batch 1／2／3~~ **已批准**（對話 2026-11-19）。  
2. **仍缺授權憑證**（唔好喺對話貼 secret）：
   - 喺 Cloud Agent 環境加入 secret `VERCEL_TOKEN`（team `dselevelup`，可 DELETE deployment），然後：
     ```bash
     VERCEL_TOKEN=… node scripts/ops/delete-approved-vercel-deployments.mjs --dry-run
     VERCEL_TOKEN=… node scripts/ops/delete-approved-vercel-deployments.mjs
     ```
     （只刪 JSON 內 batch1+2+3；永不碰 `keep[]`／`confirm_E[]`）
   - 或 Dashboard 人手刪：https://vercel.com/dselevelup/dse-level-up-by-claude-code/deployments  
3. Vercel MCP **無** delete tool（只有 cancel）；腳本用 `DELETE /v13/deployments/:id`。  
4. `confirm_E`（18 個近 7 日 preview）**仍不刪**，直至另一次批准。

## 驗證計劃（刪後）

- 同一範圍再 list deployments  
- Dashboard Usage：Functions Storage／Deployment Storage（標：已確認釋放／等待更新／無法驗證）  
- Smoke：`https://www.dselevelup.com/` 科目→練習主流程  
- 確認保留嘅 3 個 production READY 仍在  

## 容量閘門 → 工作包 2

**未通過。** 未刪除、未量到釋放前，**唔**開始大規模網站實作／唔新增部署驗證清理。  
WP2 改善計劃另文提交，等本清理批准＋釋放驗證後先做。
