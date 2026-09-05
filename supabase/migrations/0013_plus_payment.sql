-- 0013 —— Plus 付費系統基礎表（憲章 §8.2 受控收費框架）。
--
-- ✅ 已套用：2026-09-04，生產資料庫 aegekxapxgcfdrkzisis（DSE-LEVEL-UP）。
--    套用後實測：plus_entitlements / purchases / consent_logs / site_config
--    四張表存在、RLS 全開、site_config 有 1 行（plus_enabled = false）。
--    現有表一行都冇郁（user_progress 166 / user_settings 144 / profiles 6
--    / review_decisions 197 / wall_posts 1，套用前後相同）。
--
--    ⚠️ 套用者係 Claude Code，唔係創辦人本人 —— 創辦人 2026-09-04 表示
--    唔識用 Supabase SQL Editor，明示要求代行。本 repo 其餘 migration
--    （0012 等）維持「由創辦人自己行」嘅慣例，呢次係例外，故此註明。
--
-- 依據：憲章 §3.2／§5 例外一／§8.2／§16.E／§17（2026-09-04 Brian ＋ Yuna 雙簽），
--       修訂案全文見 docs/charter-amendment-2026-09-04.md。
--
-- ══════════════════════════════════════════════════════════════════
-- 一、【冇自動續費】—— 呢個決定塑造咗成個 schema
-- ══════════════════════════════════════════════════════════════════
--
-- 2026-09-04 創辦人決定：Plus 全部 SKU 一律【一次性收費】，冇任何自動續費。
--
-- 所以呢度【冇】張表叫 `subscriptions`。
--
-- 呢個唔係改名咁簡單。憲章 §16.A 記低過一個教訓：一份權威文件入面
-- 唔準確嘅描述，會被下一個 session 讀成【授權】。一張叫 `subscriptions`
-- 嘅表擺喺一個冇訂閱嘅系統入面，就係一張邀請函 —— 遲早有人見到個名，
-- 覺得「咁加返 renewal 好合理喎」，然後 12–18 歲用戶就有咗自動扣款。
--
-- 所以叫 `plus_entitlements`：一次過畀錢，換一段有期限嘅存取權。期限一到，
-- 靜靜哋變返免費層，唔會再扣錢，唔使取消，冇嘢要 cancel。
--
-- 連帶【冇】咗嘅嘢（唔好加返）：
--   · stripe_subscription_id      —— 冇 Stripe Subscription 物件
--   · invoice.paid / payment_failed webhook —— 淨係處理
--     checkout.session.completed ＋ charge.refunded 兩個 event
--   · Stripe Customer Portal      —— 冇嘢好管理
--   · 續費前 3 日電郵提醒          —— 冇續費
--   · 「取消續費」路徑             —— 同上
--   · past_due / unpaid / trialing 狀態 —— 一次性交易只有兩個結局
--
-- ══════════════════════════════════════════════════════════════════
-- 二、身分：TEXT，唔係 UUID，唔係 auth.users
-- ══════════════════════════════════════════════════════════════════
--
-- 本 app 用 Auth.js v5（Google OAuth），【冇】Supabase Auth。
-- 所以 auth.uid() 恆 null，auth.users 唔係身份來源（見 0001:7-8、0007:13-14）。
--
-- 每個 user_id 都係 Auth.js 嘅 Google `sub`，型別 TEXT，【冇】FK 去 auth.users。
-- 任何寫住 `user_id UUID REFERENCES auth.users(id)` 嘅規格書都係錯 ——
-- 個 FK 建唔到，個 RLS policy 會靜靜哋永遠 deny。
--
-- ══════════════════════════════════════════════════════════════════
-- 三、RLS：service-role only，一條 policy 都唔寫
-- ══════════════════════════════════════════════════════════════════
--
-- 同 0007／0008／0012 一致：開住 RLS 而唔寫任何 policy，即係任何
-- anon／authenticated client 一行都讀唔到。就算 anon key 洩漏，
-- 都攞唔到任何一筆交易紀錄。全部存取經 server-only getServiceSupabase()，
-- 每條查詢由 auth() session 注入 user_id。
--
-- ══════════════════════════════════════════════════════════════════
-- 四、§4.3 數據隔離：付款資料同學習數據分表
-- ══════════════════════════════════════════════════════════════════
--
-- 呢四張表【冇】任何一欄係學習數據 —— 冇錯題、冇弱項、冇正確率、
-- 冇科目表現、冇等級預測。付款同學習之間唯一嘅連結係 user_id。
--
-- 反方向亦然：user_progress 唔會加 subscription_tier 快取欄。
-- 權限每次都 server-side 查呢度，唔喺學習表度放一個會漂移嘅副本。


-- ──────────────────────────────────────────────────────────────────
-- 1. plus_entitlements —— 時限式 Plus 存取權（月費／考季／年費）
-- ──────────────────────────────────────────────────────────────────
create table if not exists public.plus_entitlements (
  id                          uuid primary key default gen_random_uuid(),

  -- Auth.js Google sub。TEXT，冇 FK（見上文第二節）。
  user_id                     text not null,

  -- 憲章 §8.2 白名單。加任何一個新 SKU 都要雙簽 —— 呢個 check
  -- 係故意收得咁緊，令「順手加個 SKU」喺 DB 層面都要改 migration。
  sku                         text not null
    check (sku in ('plus_monthly', 'plus_season', 'plus_yearly')),

  -- 冪等鍵。Webhook 同 /thank-you 輪詢補救會【同時】試寫同一筆交易
  -- （見修補 1 方案 B）。unique 喺呢度，兩邊隨便邊個先到都寫得成，
  -- 第二個撞 conflict 靜靜哋收工，唔會出現雙重入賬。
  stripe_checkout_session_id  text not null unique,
  stripe_payment_intent_id    text,

  -- 一次性交易只有兩個結局。冇 past_due，冇 unpaid，冇 trialing。
  status                      text not null default 'active'
    check (status in ('active', 'refunded')),

  -- 到期日【一律 server-side 計】（§5.5）。前端永遠唔准用 new Date()
  -- 判斷到期 —— 改部機時鐘就過到關。
  --   plus_monthly +30 日 ／ plus_season +9 個月 ／ plus_yearly +12 個月
  starts_at                   timestamptz not null default now(),
  expires_at                  timestamptz not null,

  created_at                  timestamptz not null default now(),
  updated_at                  timestamptz not null default now()
);

-- 權限核對嘅唯一查詢路徑：邊個、仲有效嘅、最遲幾時到期。
create index if not exists plus_entitlements_user_active_idx
  on public.plus_entitlements (user_id, expires_at desc)
  where status = 'active';

-- 刻意【冇】 unique(user_id, sku)：到期之後同一個人可以再買一次。
-- 多過一筆有效權限就取 max(expires_at)，自然疊加，唔使特別處理。

alter table public.plus_entitlements enable row level security;

comment on table public.plus_entitlements is
  '時限式 Plus 存取權。一次性收費，冇自動續費 —— 到期靜靜哋變返免費層。刻意唔叫 subscriptions（憲章 §8.2，2026-09-04）。';


-- ──────────────────────────────────────────────────────────────────
-- 2. purchases —— 一次性產品解鎖（單科試卷／衝刺包）
-- ──────────────────────────────────────────────────────────────────
-- 呢兩個 SKU 按路線圖分別 2026-11 同 2027-02 先推。表而家起定，
-- 但唔會有任何一行，直到嗰時。
create table if not exists public.purchases (
  id                          uuid primary key default gen_random_uuid(),
  user_id                     text not null,

  sku                         text not null
    check (sku in ('mock_paper', 'sprint_pack')),

  -- mock_paper 買邊科（subject id，例如 'economics'）。sprint_pack 為 null。
  sku_variant                 text,

  stripe_checkout_session_id  text not null unique,
  stripe_payment_intent_id    text,

  status                      text not null default 'completed'
    check (status in ('completed', 'refunded')),

  -- sprint_pack：+30 日。mock_paper：null＝買咗就一直有。
  expires_at                  timestamptz,

  created_at                  timestamptz not null default now()
);

create index if not exists purchases_user_idx
  on public.purchases (user_id)
  where status = 'completed';

alter table public.purchases enable row level security;

comment on table public.purchases is
  '一次性產品解鎖（單科模擬試卷／考前衝刺包）。憲章 §8.2 白名單。';


-- ──────────────────────────────────────────────────────────────────
-- 3. consent_logs —— 年齡／監護人同意聲明紀錄
-- ──────────────────────────────────────────────────────────────────
--
-- ══════════════════════════════════════════════════════════════════
-- 呢張表【冇】乜嘢，同佢有乜嘢一樣重要
-- ══════════════════════════════════════════════════════════════════
--
-- 冇 parent_email。冇 ip_address。冇 user_agent。
--
-- 【冇家長電郵】：2026-09-04 版執行憑證曾提出「記錄家長電郵但唔自動
-- 發送」。呢個唔採用 —— 收集一個第三方（家長）嘅個人資料，而完全
-- 唔通知該第三方，喺 PDPO 下有問題；而且個用途係日後攞出嚟同佢對質。
-- 創辦人最終決定改為純自我聲明勾選框，唔收家長電郵。呢張表跟足。
--
-- 【冇 IP／user-agent】：原規格想用嚟做 chargeback 抗辯。但 Stripe
-- 自己個 Checkout Session 已經記低咗呢啲，抗辯嗰陣直接由 Stripe 導出
-- 就得。喺我哋邊再抄一份，係為咗同一個用途，多開一個未成年人個人
-- 資料類別 —— 承 §16.E 精神（新個人資料類別上雲要創辦人書面批准），
-- 呢個唔值。
--
-- 留低嘅係聲明本身：邊個、幾時、就邊筆交易、聲明咗乜。呢個就係證據。
--
-- ⚠️ 呢張表唔係法律意見。香港法下未成年人合約嘅可執行性，
-- 要執業律師判斷。luna-legal 係 skill 角色，唔可以簽法務驗收（§16.C）。
create table if not exists public.consent_logs (
  id                          uuid primary key default gen_random_uuid(),
  user_id                     text not null,
  stripe_checkout_session_id  text not null unique,

  -- 現階段只有一種：用戶自行聲明已滿 18 歲，或已獲監護人同意。
  consent_type                text not null
    check (consent_type in ('self_declared_18_or_guardian')),

  -- 用戶睇到嗰段聲明文字嘅版本號。文案改咗，舊紀錄仍然講得出
  -- 當時佢究竟同意咗乜 —— 冇呢欄，證據就係一句「佢撳過個掣」。
  consent_text_version        text not null,

  consent_at                  timestamptz not null default now(),
  amount_cents                integer not null,
  currency                    text not null default 'hkd',
  sku                         text not null,

  -- 上述欄位嘅 SHA-256。防止事後靜靜哋改紀錄。
  evidence_hash               text not null,

  created_at                  timestamptz not null default now()
);

create index if not exists consent_logs_user_idx
  on public.consent_logs (user_id);

alter table public.consent_logs enable row level security;

comment on table public.consent_logs is
  '年齡／監護人同意聲明紀錄。刻意冇家長電郵、冇 IP、冇 user-agent —— 見檔案內註釋。';


-- ──────────────────────────────────────────────────────────────────
-- 4. site_config —— feature flag（暗部署開關）
-- ──────────────────────────────────────────────────────────────────
--
-- ⚠️ 【價格唔喺呢度。】
--
-- 執行憑證原本寫呢張表係「價格熱切換」。唔採用 —— 規格 §5.1 同時要求
-- 「價格必須由 server-side PRICE_MAP 決定」。價格放喺 DB 一行 jsonb，
-- 等於將定價變成一個【資料】問題：任何攞到 service-role key 或者入到
-- Supabase dashboard 嘅途徑，都可以改價。放喺 code 入面，改價要
-- commit、要 review、有 git blame。
--
-- 所以 site_config 淨係擺開關，唔擺金額。
create table if not exists public.site_config (
  key         text primary key,
  value       jsonb not null,
  updated_at  timestamptz not null default now(),
  -- 邊個改嘅（Auth.js sub）。冚唪唥開關都應該有得追。
  updated_by  text
);

alter table public.site_config enable row level security;

comment on table public.site_config is
  'Feature flag 開關。刻意唔存價格 —— 價格由 server-side PRICE_MAP（code）決定，見檔案內註釋。';

-- 暗部署：預設【關】。9/19 開賣日先改成 true。
insert into public.site_config (key, value)
values ('plus_enabled', 'false'::jsonb)
on conflict (key) do nothing;


-- ══════════════════════════════════════════════════════════════════
-- 本次【冇】起嘅表（唔係漏，係未到期）
-- ══════════════════════════════════════════════════════════════════
--   revenue_recognition   —— 按月攤分，P1，開賣後 7 日內（修補 3）
--   discount_applications —— 基層減免，Phase 3.1（§17）
--   active_sessions       —— 同時登入限制，Phase 2.3（修補 7 修訂版）
--
-- 起嗰陣一樣要跟返上面四節：TEXT user_id、service-role-only RLS、
-- 付款同學習數據分表、以及「冇乜嘢」嗰段要寫清楚。
