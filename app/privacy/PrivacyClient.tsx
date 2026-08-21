'use client'

import Link from 'next/link'
import { useLocale } from '@/lib/i18n'
import { CLOUD_PROGRESS_KEYS, CLOUD_SETTINGS_KEYS } from '@/components/StoredDataInspector'
import { USER_SCOPED_TABLES } from '@/lib/privacy/userData'

// 見 page.tsx 檔頭：呢版每一句都對過實物。數量由 import 嚟嘅常數即時算，
// 唔硬編 —— 硬編一個「12」落去，同步代碼改嗰日呢版就會靜靜哋講錯。
const CLOUD_COUNT = CLOUD_PROGRESS_KEYS.length + CLOUD_SETTINGS_KEYS.length

const CONTACT = 'dselevelup@gmail.com'

// 章節殼。必須留喺 module scope —— 定義喺 render function 入面嘅話，每次
// `locale` 一變，React 就會當佢係一個【全新嘅組件類型】，成版嘢連 <details>
// 開合狀態一齊被拆走重建。同 components/BlindTestQuestion.tsx 嗰個係同一類錯。
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="mb-3 text-lg font-medium text-ink">{title}</h2>
      <div className="space-y-3 text-sm leading-relaxed text-ink-soft">{children}</div>
    </section>
  )
}

export default function PrivacyClient() {
  const { locale } = useLocale()
  const en = locale === 'en'

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <header className="mb-8">
        <h1 className="text-2xl font-medium text-ink">{en ? 'Privacy policy' : '私隱政策'}</h1>
        <p className="mt-2 text-sm leading-relaxed text-ink-muted">
          {en
            ? 'Written against Hong Kong’s Personal Data (Privacy) Ordinance. Every statement below was checked against the actual code and the actual database on 20 August 2026 — not against a specification.'
            : '對照香港《個人資料（私隱）條例》寫。以下每一句都喺 2026 年 8 月 20 日對住實際代碼同實際資料庫核實過 —— 唔係對住一份文件。'}
        </p>
      </header>

      <Section title={en ? 'Who we are' : '我哋係邊個'}>
        <p>
          {en
            ? 'DSE Level Up is a free, non-profit study project run by DSE students and alumni. It is not a company, not a school, and not affiliated with the HKEAA. For anything in this policy — including asking us to delete your data — email '
            : 'DSE Level Up 係一個由 DSE 學生同舊生營運嘅免費非牟利溫習專案。唔係公司，唔係學校，亦同考評局冇任何從屬關係。就本政策嘅任何事（包括要求我哋刪除你嘅資料），請電郵 '}
          <a href={`mailto:${CONTACT}`} className="font-medium text-accent-strong underline underline-offset-2">
            {CONTACT}
          </a>
          {en ? '.' : '。'}
        </p>
      </Section>

      <Section title={en ? 'You do not have to sign in' : '你唔使登入'}>
        <p>
          {en
            ? 'Every practice question, every subject, every note and every wellbeing tool works without an account. If you never sign in, your data never leaves your browser — there is no account for us to look at.'
            : '所有練習題、所有科目、所有筆記同所有情緒工具，唔登入都用得。如果你由頭到尾都唔登入，你嘅資料完全唔會離開你部瀏覽器 —— 我哋根本冇一個帳戶可以睇。'}
        </p>
        <p>
          {en
            ? 'Signing in with Google does one thing and one thing only: it lets your progress follow you to another device. It unlocks no extra content — the whole site is free either way.'
            : 'Google 登入只做一件事：令你嘅進度可以跟你去另一部機。佢唔會解鎖任何額外內容 —— 全站無論點都係免費。'}
        </p>
      </Section>

      <Section title={en ? 'What is stored on your own device' : '存喺你自己部機嘅嘢'}>
        <p>
          {en
            ? 'By default everything lives in your browser’s local storage: your scores, which topics you get wrong, the causes you pick during error diagnosis, your bookmarks, your accessibility settings, your mood log, your writing drafts, and anything you sealed in a time capsule.'
            : '預設情況下所有嘢都存喺你瀏覽器嘅本機儲存：你嘅分數、你邊啲課題易錯、你喺錯因自診揀嘅原因、你嘅收藏、你嘅無障礙設定、你嘅心情記錄、你嘅寫作草稿，同埋你封存喺時間囊入面嘅字。'}
        </p>
        <p>
          {en ? 'You can see the exact list, on your own device, at ' : '你可以喺你自己部機睇到完整清單：'}
          <Link href="/account" className="font-medium text-accent-strong underline underline-offset-2">
            /account
          </Link>
          {en
            ? '. Clearing your browser data removes all of it. We cannot see any of it unless it is in the synced list below.'
            : '。清除瀏覽器資料就會全部消失。除非佢喺下面嗰張同步清單，否則我哋一律睇唔到。'}
        </p>
      </Section>

      <Section title={en ? `What is synced when you sign in (${CLOUD_COUNT} items)` : `登入之後會同步嘅嘢（${CLOUD_COUNT} 項）`}>
        <p>
          {en
            ? 'Signing in uploads exactly these, and nothing else:'
            : '登入之後上傳嘅【只有】以下呢啲，冇其他：'}
        </p>
        <ul className="ml-4 list-disc space-y-1">
          <li>
            {en ? 'Practice progress: ' : '練習進度：'}
            <span className="text-ink-muted">
              {en
                ? 'your scores and time per set, your accuracy per topic, how many sets you have done, and any unfinished set so you can resume it.'
                : '每份卷嘅分數同用時、逐個課題嘅答對率、做過幾多份卷，以及未做完嗰份卷（方便你續做）。'}
            </span>
          </li>
          <li>
            {en ? 'Accessibility and display settings: ' : '無障礙同顯示設定：'}
            <span className="text-ink-muted">
              {en
                ? 'easy-read font, reading ruler, hidden timer, calm lock, font size, line height, letter spacing, and your sensory preferences.'
                : '易讀字體、閱讀尺、隱藏計時器、平靜鎖、字級、行距、字距，同你嘅感官偏好。'}
            </span>
          </li>
        </ul>
        <p className="rounded-xl border border-gold/25 bg-gold/[0.06] p-3">
          {en
            ? 'Deliberately NOT synced, even when you are signed in: your time capsules, your mood log, your error-diagnosis notes, your bookmarks, your writing drafts, and your most recent result. Those stay on your device. Your capsules and your mood log in particular are never uploaded — those are words you wrote to yourself, and they are not something we want to hold.'
            : '就算你登入咗，以下都【刻意唔會】上傳：你嘅時間囊、你嘅心情記錄、你嘅錯因自診紀錄、你嘅收藏、你嘅寫作草稿，同你最近一次練習結果。呢啲留喺你部機。特別係時間囊同心情記錄 —— 嗰啲係你寫畀自己嘅字，我哋唔想手上有一份。'}
        </p>
      </Section>

      <Section title={en ? 'What Google tells us' : 'Google 會話畀我哋知咩'}>
        <p>
          {en
            ? 'When you sign in with Google, we receive a stable account identifier for you. That identifier is what we store next to your progress so we can hand it back to you on your next device.'
            : '你用 Google 登入嗰陣，我哋會收到一個屬於你嘅穩定帳戶識別碼。我哋就係用呢個識別碼去對應你嘅進度，等你換機嗰陣攞得返。'}
        </p>
        <p>
          {en
            ? 'We do not store your email address in our database. We checked: there is no path in the code that writes a student’s email address to any table.'
            : '我哋唔會將你嘅電郵地址存入資料庫。呢點我哋查過：代碼入面冇任何路徑會將學生嘅電郵地址寫入任何一張表。'}
        </p>
        <p>
          {en
            ? 'Your use of Google’s own sign-in is governed by Google’s privacy policy, not ours.'
            : '你使用 Google 本身嘅登入服務，係受 Google 自己嘅私隱政策規管，唔係受我哋規管。'}
        </p>
      </Section>

      <Section title={en ? 'Where it goes' : '啲資料去咗邊'}>
        <ul className="ml-4 list-disc space-y-1">
          <li>
            {en
              ? 'Supabase (PostgreSQL), hosted in Tokyo (ap-northeast-1) — this is where synced progress and settings sit.'
              : 'Supabase（PostgreSQL），伺服器喺東京（ap-northeast-1）—— 同步嘅進度同設定就放喺度。'}
          </li>
          <li>
            {en ? 'Vercel — this is where the website itself is hosted and served from.' : 'Vercel —— 個網站本身就係喺度寄存同發送。'}
          </li>
        </ul>
        <p>
          {en
            ? 'That is the whole list. There is no analytics service, no advertising network, and no tracking pixel anywhere on this site — we scanned for the usual ones (Google Analytics, Tag Manager, PostHog, Mixpanel, Sentry, Hotjar, Meta Pixel, Plausible, Umami, Vercel Analytics) and there are none. We do not sell data, and we have never shared it with anyone for marketing.'
            : '就係咁多。全站冇任何分析服務、冇廣告網絡、冇追蹤像素 —— 我哋掃過常見嗰批（Google Analytics、Tag Manager、PostHog、Mixpanel、Sentry、Hotjar、Meta Pixel、Plausible、Umami、Vercel Analytics），一個都冇。我哋唔賣數據，亦從來冇為咗營銷而分享畀任何人。'}
        </p>
      </Section>

      <Section title={en ? 'Technical logs' : '技術日誌'}>
        <p>
          {en
            ? 'To stop abuse, the server counts requests per IP address in memory. That count is not written to a database and disappears when the server restarts.'
            : '為咗防濫用，伺服器會喺記憶體按 IP 位址計算請求次數。呢個計數唔會寫入資料庫，伺服器重啟就會消失。'}
        </p>
        <p>
          {en
            ? 'When something breaks, we log the error message and code only — never the contents of your data. Those logs are private to the project.'
            : '出錯嗰陣，我哋只記錄錯誤訊息同代碼 —— 唔會記錄你資料嘅內容。呢啲日誌只有專案本身睇到。'}
        </p>
      </Section>

      <Section title={en ? 'No user content, so nothing about you is public' : '冇用戶內容，所以冇任何關於你嘅嘢係公開嘅'}>
        <p>
          {en
            ? 'This site has no messaging, no posts, no comments and no likes — nothing you do here is visible to another user. The anonymous encouragement wall that used to exist was removed on 21 August 2026, along with everything it stored.'
            : '本站冇訊息、冇留言、冇回覆、冇心心 —— 你喺呢度做嘅嘢，冇一樣係另一個用戶睇得到。以前嗰個匿名打氣互助牆已經喺 2026 年 8 月 21 日移除，連同佢儲存過嘅嘢一齊。'}
        </p>
        <p>
          {en ? 'Why, and what took its place: see ' : '點解，同埋用咩接住：見'}
          <Link href="/community-safety" className="font-medium text-accent-strong underline underline-offset-2">
            {en ? 'student safety' : '學生安全'}
          </Link>
          {en ? '.' : '。'}
        </p>
      </Section>

      <Section title={en ? 'How long we keep it, and how you delete it' : '我哋留幾耐、你點樣刪除'}>
        <p>
          {en
            ? 'Synced data is kept while your account is in use. There is no fixed expiry — instead, you can erase it yourself at any time.'
            : '同步嘅資料喺你仲用緊嘅期間會保留。冇固定到期日 —— 取而代之，你隨時可以自己刪除。'}
        </p>
        <p>
          {en ? 'Sign in and go to ' : '登入之後去 '}
          <Link href="/account" className="font-medium text-accent-strong underline underline-offset-2">
            /account
          </Link>
          {en
            ? `. That deletes your rows from every table that holds anything keyed to you (${USER_SCOPED_TABLES.length} tables). If any part of the deletion fails, we tell you rather than reporting success.`
            : `。呢個動作會刪走你喺每一張帶住你識別碼嘅表入面嘅資料（共 ${USER_SCOPED_TABLES.length} 張表）。如果有任何一部分刪唔到，我哋會話你知，唔會扮成功。`}
        </p>
        <p>
          {en
            ? 'Data stored only on your device is removed by clearing your browser data — we cannot do that for you, because we cannot reach it.'
            : '只存喺你部機嘅資料，清除瀏覽器資料就會移除 —— 呢部分我哋幫你唔到，因為我哋根本掂唔到。'}
        </p>
        <p>
          {en
            ? 'You also have the right to ask what we hold about you and to have it corrected. Email us and we will answer.'
            : '你亦有權查詢我哋持有你咩資料，以及要求改正。電郵我哋，我哋會回覆。'}
        </p>
      </Section>

      <Section title={en ? 'If you are under 18' : '如果你未夠 18 歲'}>
        <p>
          {en
            ? 'This site is built for DSE candidates, so most of you are. We keep collection to the minimum that makes progress sync work, and we do not profile you, target you with advertising, or share anything with third parties for marketing.'
            : '呢個網站係為 DSE 考生而做，所以你哋大部分都係。我哋將收集減到「令進度同步行得通」嘅最低限度，唔會為你建立個人檔案、唔會用廣告針對你，亦唔會為營銷而向第三方分享任何嘢。'}
        </p>
        <p>
          {en
            ? 'If you are a parent, a teacher or a school and you want something removed or explained, email us at '
            : '如果你係家長、老師或者學校，想移除或者了解任何嘢，請電郵 '}
          <a href={`mailto:${CONTACT}`} className="font-medium text-accent-strong underline underline-offset-2">
            {CONTACT}
          </a>
          {en ? '. We will answer a real email from a real person.' : '。會有真人回覆你。'}
        </p>
      </Section>

      <Section title={en ? 'Leaving this site' : '離開呢個網站'}>
        <p>
          {en
            ? 'Some pages link out — for example to a student-run Instagram group, or to YouTube. Once you leave, this policy stops applying and the other platform’s rules take over. We show you where you are going before you go.'
            : '有啲頁會連出去 —— 例如一個學生自發嘅 Instagram 群組，或者 YouTube。你一離開，本政策就唔再適用，改由對方平台嘅規則接手。我哋會喺你去之前話你知你去緊邊。'}
        </p>
      </Section>

      <p className="mt-10 border-t border-line pt-5 text-xs leading-relaxed text-ink-muted">
        {en
          ? 'If we change how any of this works, we change this page at the same time. If you ever find a statement here that does not match what the site actually does, tell us — that is a bug, and we will treat it as one.'
          : '如果以上任何做法有改變，我哋會同一時間改呢版。如果你發現呢版有任何一句同個站實際做法唔同，話我哋知 —— 嗰個係 bug，我哋會當 bug 處理。'}
      </p>
    </div>
  )
}
