# Phase 1 影響報告 — 第三方出口閘門與 `/relax/group` 安全化

**日期：** 2026-08-20
**觸發：** `DSE_Level_Up_網站信譽與聲譽審核報告.md` §1「先處理『匿名互助』與外部群組：這是聲譽最大的單點風險」
**狀態：** read-only 審計完成，未動任何檔案

---

## 一、審核報告講咗一個出口。實際有六個。

報告只點名 `/relax/group` 嘅 Instagram 連結。全站掃描（`app/` + `components/`，所有 `.tsx`）之後，實際嘅第三方出口如下：

| # | 目的地 | 位置 | 類型 | 學生資料點樣流出 |
|---|---|---|---|---|
| 1 | `ig.me/j/AbYCy6ZUDR-yWVPN/` | `app/relax/components/GroupCommunity.tsx:10` | 點擊離站 | 加入由第三方（`school.q.1`）管理嘅 IG 群組 |
| 2 | `youtube-nocookie.com/embed/…` | `SoloPlayer.tsx:24,29` | **iframe 嵌入** | 播放時 YouTube 取得 IP + UA |
| 3 | `youtube.com/watch?v=…` | `SoloPlayer.tsx:25,30` | 點擊離站 | 去 YouTube 主站（非 nocookie） |
| 4 | `i.ytimg.com/vi/…/hqdefault.jpg` | `SoloPlayer.tsx:26,31` | **載入即請求** | **一入 `/relax/solo` 就自動送 IP 去 Google，唔使撳任何嘢** |
| 5 | `github.com/hugow0528` | `components/GuardianCredits.tsx:46` | 點擊離站 | 低風險 |
| 6 | `wa.me/?text=…` | `app/focus/page.tsx:224` | 點擊離站 | 開 WhatsApp 分享房號 |

**#4 係報告完全冇提、但技術上最「無聲」嗰個** —— 學生淨係入到個減壓頁，未撳過任何嘢，Google 已經知道佢個 IP。呢個係唯一一個唔需要用戶動作嘅洩漏。

---

## 二、`/relax/group` 嘅結構性問題（比報告描述嚴重）

讀完 `GroupCommunity.tsx` 全 186 行之後：

### 2.1 免責聲明喺 CTA **之後**

DOM 次序係：功能卡 → **「立即組隊 →」大按鈕（L104-112）** → 功能一覽 → **「唔係官方頻道」免責（L136-149）**。

學生撳完個按鈕、離開咗個站，先至有機會睇到「呢個唔係官方頻道」。**免責喺點擊之後出現，等於冇免責。**

### 2.2 平台主動宣傳未成年人同陌生人一對一私訊

`IG_FEATURES` 入面兩項：

- `🕳️ 1對1 戰友傾偈 — 私訊樹洞，講完就算，冇人會 judge`（L20）
- `🎙️ 群組語音房（安靜模式）`（L22）

呢兩項唔係「有呢個功能」，係**平台喺一個心理支援脈絡度主動推銷**。審核報告引嘅 UN／UNICEF 兩份文件，講嘅正正係呢類「由可信情境導入陌生人私訊／語音」嘅風險。

### 2.3 收 email 冇喺收集點交代用途

L162-179 收 email，寫入 Supabase `ig_group_waitlist`。表單旁邊淨係寫「如果 IG Group 連結失效…」，冇交代：由邊個收、保存幾耐、點刪除、會唔會轉移。PCPD DPP1(3) 要求**喺收集時或之前**告知。

---

## 三、影響範圍（如果執行）

| 檔案 | 改動性質 | 風險 |
|---|---|---|
| `components/ExternalLinkGate.tsx` | **新增** | 無（新檔） |
| `app/relax/components/GroupCommunity.tsx` | 重排 + 刪 2 張功能卡 + 加收集聲明 | **產品面改動 —— 需要創辦人確認**（見四） |
| `app/relax/components/SoloPlayer.tsx` | 換走遠端縮圖 + 外開連結上閘 | 視覺輕微改變 |
| `components/GuardianCredits.tsx` | GitHub 連結上閘 | 無 |
| `app/focus/page.tsx` | WhatsApp 連結上閘 | 無 |
| `app/wall/WallClient.tsx` | 發帖前顯示守則 | 無 |
| `lib/__tests__/external-links.test.mts` | **新增**（回歸測試） | 無 |

**唔會掂：** 任何題庫、任何 migration、任何 Supabase 表、`/api/*` 任何路由、auth。

---

## 四、需要創辦人拍板嘅一項

刪走「1對1 戰友傾偈」同「群組語音房」兩張宣傳卡，係**產品決定，唔係技術決定**。

- 我嘅取態：呢兩項係全站最高風險嘅單點，而且係我哋自己主動推銷嘅。IG 群組本身可以保留（真實學生社群，加閘門就夠）；但「快啲去同陌生人私訊」呢句唔應該由一個未成年人平台講。
- 我會照做，並喺此標明係可逆嘅單一 commit，你想恢復隨時 revert。

---

## 五、唔喺本批次（留畀之後）

- `/privacy`（PCPD 對照）—— 閘門文案會指向佢，但佢本身係下一批
- `/community-safety` 完整守則頁
- `/wall` 舉報按鈕 —— 需要新表，要 migration，要你批
- 7 個核心頁獨立 metadata
