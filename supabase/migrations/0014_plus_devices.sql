-- 0014 —— Plus 同時使用裝置數限制（Phase 2.3，方案 B）。
--
-- ✅ 已套用：2026-09-04，生產資料庫 aegekxapxgcfdrkzisis（DSE-LEVEL-UP）。
--    套用後實測：plus_devices 存在、RLS 開住、0 行。
--    套用者係 Claude Code（創辦人明示要求代行）—— 詳見 0013 檔頭同一段。
--
-- ══════════════════════════════════════════════════════════════════
-- 一、點解唔係「限制登入」
-- ══════════════════════════════════════════════════════════════════
--
-- 原規格（修補 7）要求「限制設備登入數量，第 4 部登入就踢走最舊」。
-- 呢個喺本 app 做唔到：auth.ts:21 `session: { strategy: 'jwt' }` ——
-- 無狀態 JWT，冇 server 端 session 紀錄可以數，而且「踢走」廢除唔到
-- 一個已經發出咗嘅 token，嗰部機照樣用到過期為止。
--
-- 起一張表去數、再向用戶顯示「舊裝置已自動登出」，就係一個講大話嘅功能
-- —— 憲章 §16.D 判例（將唔存在嘅防護講成存在）。
--
-- 所以呢度閘住嘅係【功能】唔係【登入】：每次 server 端權限核對嗰陣認一次
-- 裝置，最近用開嘅 N 部先攞到 Plus 加速工具。JWT 之下呢個做得到，
-- 因為每次核對都真係經 server。
--
-- ══════════════════════════════════════════════════════════════════
-- 二、被讓位嘅裝置【冇被鎖走任何嘢】
-- ══════════════════════════════════════════════════════════════════
--
-- 讓位＝跌返 free tier。憲章 §3.1 永久免費層一樣都唔少：AI 出題、
-- 即時對錯、簡短解析、SEN 專注模式、60 秒逆向鎖死引擎連三維自診、
-- 減壓緩衝區、跨裝置同步 —— 全部照用。
--
-- 佢見唔到嘅淨係加速工具（計時 Paper 2、匯出 PDF 之類）。
-- 一個學生喺圖書館部機開唔到計時模式，同佢做唔到題，係兩件事。
--
-- ══════════════════════════════════════════════════════════════════
-- 三、LRU，唔係「第 4 部拒絕」
-- ══════════════════════════════════════════════════════════════════
--
-- 最近用開嘅 3 部有 Plus。第 4 部一用，最耐冇用嗰部自動讓位。
--
-- 點解唔用「第 4 部拒絕」：學生換咗新手機，舊機仲喺 3 部之內，
-- 新機就永遠上唔到 —— 一個買咗嘢嘅人被自己部舊機擋住。
--
-- ══════════════════════════════════════════════════════════════════
-- 四、device_token 唔係指紋
-- ══════════════════════════════════════════════════════════════════
--
-- 呢張表【冇】ip_address。【冇】user_agent。【冇】任何由硬件或網絡推導
-- 出嚟嘅嘢。
--
-- device_token 係瀏覽器自己 crypto.randomUUID() 出嚟、存喺 localStorage
-- 嘅一串隨機字。佢唔識別一部機，佢淨係識別「同一個瀏覽器設定檔」。
-- 學生清 localStorage 就變新 token —— 而咁樣淨係令佢自己嗰部機重新排隊，
-- LRU 會處理。
--
-- 呢個係刻意嘅取捨：一個繞得過嘅機制，換一個唔會追蹤未成年人裝置嘅設計。
-- （2026-09-04 曾提出 sha256(user_agent + IP 前 3 段) 指紋方案 —— 唔採用。
--  除咗私隱，佢技術上仲會令學校電腦室成間房撞同一個指紋。）

create table if not exists public.plus_devices (
  -- Auth.js Google sub（TEXT，冇 FK 去 auth.users —— 見 0013 第二節）
  user_id       text not null,

  -- 瀏覽器 crypto.randomUUID()。唔由任何個人資料推導。
  device_token  text not null,

  -- LRU 排序鍵。每次 server 端權限核對更新（有節流，唔會每次頁面載入都寫）。
  last_seen_at  timestamptz not null default now(),
  created_at    timestamptz not null default now(),

  primary key (user_id, device_token)
);

-- 唯一查詢路徑：呢個人最近用開嘅係邊幾部。
create index if not exists plus_devices_lru_idx
  on public.plus_devices (user_id, last_seen_at desc);

-- RLS：service-role only，一條 policy 都唔寫（同 0007／0012／0013 一致）。
alter table public.plus_devices enable row level security;

comment on table public.plus_devices is
  'Plus 同時使用裝置 LRU。閘住功能唔閘住登入（JWT 之下踢唔到登入）。刻意冇 IP／user-agent —— 見檔案內註釋。';
