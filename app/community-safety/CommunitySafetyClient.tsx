'use client'

import Link from 'next/link'
import { useLocale } from '@/lib/i18n'
import HotlineCard from '@/components/HotlineCard'

const CONTACT = 'dselevelup@gmail.com'

// 章節殼 —— module scope（喺 render 入面定義 = 每次 locale 變都拆走重建）。
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="mb-3 text-lg font-medium text-ink">{title}</h2>
      <div className="space-y-3 text-sm leading-relaxed text-ink-soft">{children}</div>
    </section>
  )
}

function NoRow({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex gap-2 text-ink-soft">
      <span aria-hidden className="text-ink-muted">
        ✕
      </span>
      <span>{children}</span>
    </li>
  )
}

export default function CommunitySafetyClient() {
  const { locale } = useLocale()
  const en = locale === 'en'

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <header className="mb-8">
        <h1 className="text-2xl font-medium text-ink">{en ? 'Student safety' : '學生安全'}</h1>
        <p className="mt-2 text-sm leading-relaxed text-ink-muted">
          {en
            ? 'Most study platforms answer this page with “here is how we moderate our community”. Ours answers it differently. Checked against the actual code on 21 August 2026.'
            : '大部分溫習平台喺呢一版嘅答案係「我哋點樣審核我哋個社群」。我哋嘅答案唔同。2026 年 8 月 21 日對住實際代碼核實。'}
        </p>
      </header>

      <Section title={en ? 'There is nothing here to be unsafe in' : '呢度冇一個可以出事嘅地方'}>
        <p className="rounded-xl border border-accent/25 bg-accent/[0.06] p-4">
          {en
            ? 'DSE Level Up has no user-to-user interaction at all. You cannot message anyone here. Nobody can message you. There are no posts, no comments, no replies, no likes, no follows, no matching, no voice rooms. Not restricted, not moderated, not “coming soon” — simply not built.'
            : 'DSE Level Up 完全冇用戶對用戶互動。你喺呢度搵唔到任何人，任何人亦搵唔到你。冇留言、冇回覆、冇心心、冇跟隨、冇配對、冇語音房。唔係限制咗、唔係審核緊、亦唔係「即將推出」—— 係根本冇起。'}
        </p>
        <p>
          {en
            ? 'We used to run an anonymous encouragement wall. Every post was read by a real person before it went public, and nothing was ever auto-published. We removed it anyway, on 21 August 2026.'
            : '我哋以前有一個匿名打氣互助牆。每一則留言公開之前都由真人睇過，冇任何嘢係自動出街。我哋喺 2026 年 8 月 21 日照樣將佢移除。'}
        </p>
      </Section>

      <Section title={en ? 'Why we removed it' : '點解要移除'}>
        <p>
          {en
            ? 'Running a space for teenagers safely needs a moderation queue, people on duty, a reporting flow, a blocking mechanism and a crisis procedure. We are two people doing this in our spare time.'
            : '要安全咁營運一個畀青少年嘅空間，需要一個審核 queue、有人當值、一套舉報流程、一套封鎖機制、一套危機處理程序。而我哋係兩個人，喺工餘時間做。'}
        </p>
        <p>
          {en
            ? 'A space we cannot supervise is not a safe space, however carefully it is worded. The real choice was never “safe or unsafe” — it was “a small promise we can keep, or a large one we cannot”.'
            : '一個我哋監督唔到嘅空間，無論寫得幾小心，都唔係安全空間。真正嘅取捨從來唔係「安全定唔安全」，而係「一個守得住嘅小承諾，定一個守唔住嘅大承諾」。'}
        </p>
        <p>
          {en
            ? 'We should also be honest that this costs something. That wall was answering a real need — 3 a.m., nothing going in, feeling like the only person still awake. Deleting it does not make that feeling go away.'
            : '亦要誠實講，呢個決定有代價。嗰個牆真係服務緊一個真實需要 —— 凌晨三點、乜都入唔到腦、覺得全世界得返自己一個未瞓。刪走佢唔會令嗰種感覺消失。'}
        </p>
      </Section>

      <Section title={en ? 'What replaced it' : '用咩接住'}>
        <p>
          {en ? 'A ' : '一個'}
          <Link href="/capsule" className="font-medium text-accent-strong underline underline-offset-2">
            {en ? 'time capsule' : '時間囊'}
          </Link>
          {en
            ? '. Write down how things are right now, choose a date, and seal it. You read it back when that day arrives.'
            : '。寫低而家係點，揀一個日期封存，到期先開得返。'}
        </p>
        <p>
          {en
            ? 'What the wall was actually giving people was not “someone replies to you” — with human review, replies were slow anyway. It was “someone understands you”. A capsule keeps that and changes who: three months from now, you get to read what you were carrying three months ago. That is the one version of this that cannot hurt a young person.'
            : '嗰個牆真正畀到人嘅唔係「有人回覆你」—— 人手審核之下，回覆本來就慢。佢畀到嘅係「有人明白你」。時間囊保留呢件事，只係換咗個人：三個月後嘅你，會睇返三個月前嘅你揹緊啲乜。而呢個版本，係唯一一個一定唔會傷害到未成年人嘅版本。'}
        </p>
        <p>
          {en
            ? 'It stays on your device. Not uploaded, not synced, and nobody else — including us — can read it.'
            : '佢留喺你部機。唔會上傳、唔會同步，冇其他人睇得到 —— 包括我哋。'}
        </p>
      </Section>

      <Section title={en ? 'Things this site will not have' : '本站唔會有嘅嘢'}>
        <ul className="space-y-2">
          <NoRow>{en ? 'Private messages, DMs or chat of any kind' : '私訊、DM，或者任何形式嘅聊天'}</NoRow>
          <NoRow>{en ? 'Posts, comments, replies or any wall' : '留言、回覆，或者任何形式嘅牆'}</NoRow>
          <NoRow>
            {en
              ? 'Likes or reactions — even anonymous, a like is still one user signalling to another'
              : '心心或者反應 —— 即使匿名，一個心心仍然係一個用戶向另一個用戶發出嘅訊號'}
          </NoRow>
          <NoRow>{en ? 'Following, buddy matching or voice rooms' : '跟隨、戰友配對，或者語音房'}</NoRow>
          <NoRow>
            {en
              ? 'Live “students online” counts — real or invented'
              : '「幾多人在線」嘅數字 —— 真實嘅同虛構嘅都唔會有'}
          </NoRow>
        </ul>
        <p className="text-ink-muted">
          {en
            ? 'This is not a policy we intend to remember. It is enforced by an automated check that fails the build if any of the above starts to appear — including under a different name.'
            : '呢個唔係一條靠記性守嘅政策。佢由一個自動檢查釘住：以上任何一樣一出現，即使改咗第二個名，測試都會紅。'}
        </p>
      </Section>

      <Section title={en ? 'The one thing that looks social, and is not' : '一樣睇落似互動、但唔係嘅嘢'}>
        <p>
          {en ? 'On ' : '喺'}
          <Link href="/focus" className="font-medium text-accent-strong underline underline-offset-2">
            {en ? 'the focus timer' : '專注計時器'}
          </Link>
          {en
            ? ' you can share a room code so classmates start a session at the same time. Each device runs its own timer. Nothing is sent between you — no server, no sync, no shared state, no way to see who else is “in” the room. It is a promise you make to each other, not a connection between your devices.'
            : '你可以 share 一個房號，等同學同一時間開始溫。每部機各自計時。你哋之間冇任何嘢傳送 —— 冇 server、冇同步、冇共享狀態，亦冇任何方法睇到仲有邊個「喺房入面」。佢係你哋之間嘅一個約定，唔係你哋部機之間嘅連線。'}
        </p>
      </Section>

      <Section title={en ? 'Links that leave this site' : '離開本站嘅連結'}>
        <p>
          {en
            ? 'A few pages link out — a student-run Instagram group, YouTube, GitHub. Before you go, we show you exactly where you are heading. Once you are there, everything above stops applying: that platform has accounts, direct messages and its own rules, and we can neither see nor moderate what happens.'
            : '有幾個頁會連出去 —— 一個學生自發嘅 Instagram 群組、YouTube、GitHub。你去之前，我哋會話你知你去緊邊。你一到咗嗰邊，以上全部唔再適用：對方平台有帳戶、有私訊、有自己嘅規則，我哋既睇唔到亦管唔到入面發生咩事。'}
        </p>
        <p>
          {en
            ? 'On any outside platform: never share your phone number, address, school or photos. If somebody asks to move to private chat, asks for photos, or makes you uncomfortable — leave, and tell an adult you trust.'
            : '喺任何站外平台：唔好分享電話、地址、就讀學校或者相片。如果有人要求私下傾、要相，或者令你唔舒服 —— 離開，並且話畀你信得過嘅大人知。'}
        </p>
      </Section>

      <Section title={en ? 'If things are heavy right now' : '如果你而家好辛苦'}>
        <p>
          {en
            ? 'We are not counsellors and this site is not a crisis service. It never was, and now it does not even look like one. The numbers below are real, free, and answered by trained people.'
            : '我哋唔係輔導員，本站亦唔係危機支援服務。佢從來都唔係，而家連個樣都唔會似。下面啲號碼係真實、免費，而且有受過訓練嘅人接聽。'}
        </p>
        <div className="pt-1">
          <HotlineCard emphasis />
        </div>
      </Section>

      <Section title={en ? 'Parents, teachers and schools' : '家長、老師同學校'}>
        <p>
          {en
            ? 'There is no user-generated content on this site, so there is nothing about your student here for anyone to see. If you want to understand what is stored, see our '
            : '本站冇任何用戶產生嘅內容，所以呢度冇任何關於你學生嘅嘢畀人睇到。想了解我哋存咗咩，請睇'}
          <Link href="/privacy" className="font-medium text-accent-strong underline underline-offset-2">
            {en ? 'privacy policy' : '私隱政策'}
          </Link>
          {en ? '. Anything else: ' : '。其他事：'}
          <a href={`mailto:${CONTACT}`} className="font-medium text-accent-strong underline underline-offset-2">
            {CONTACT}
          </a>
          {en ? '.' : '。'}
        </p>
      </Section>

      <p className="mt-10 border-t border-line pt-5 text-xs leading-relaxed text-ink-muted">
        {en
          ? 'If you find a statement on this page that does not match what the site actually does, tell us — that is a bug, and we will treat it as one.'
          : '如果你發現呢版有任何一句同個站實際做法唔同，話我哋知 —— 嗰個係 bug，我哋會當 bug 處理。'}
      </p>
    </div>
  )
}
