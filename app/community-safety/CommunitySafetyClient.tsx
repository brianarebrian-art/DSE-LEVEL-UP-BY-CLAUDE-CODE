'use client'

import Link from 'next/link'
import { useLocale } from '@/lib/i18n'
import HotlineCard from '@/components/HotlineCard'

const CONTACT = 'dselevelup@gmail.com'

// 章節殼 —— 必須留喺 module scope（喺 render 入面定義 = 每次 locale 變都拆走重建）。
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="mb-3 text-lg font-medium text-ink">{title}</h2>
      <div className="space-y-3 text-sm leading-relaxed text-ink-soft">{children}</div>
    </section>
  )
}

/** 「有／冇」對照行。呢版嘅重點就係後者 —— 見 page.tsx 檔頭。 */
function Fact({ has, children }: { has: boolean; children: React.ReactNode }) {
  return (
    <li className="flex gap-2">
      <span aria-hidden className={has ? 'text-accent-strong' : 'text-ink-muted'}>
        {has ? '✓' : '✕'}
      </span>
      <span className={has ? 'text-ink-soft' : 'text-ink-muted'}>{children}</span>
    </li>
  )
}

export default function CommunitySafetyClient() {
  const { locale } = useLocale()
  const en = locale === 'en'

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <header className="mb-8">
        <h1 className="text-2xl font-medium text-ink">{en ? 'Community safety' : '社群安全守則'}</h1>
        <p className="mt-2 text-sm leading-relaxed text-ink-muted">
          {en
            ? 'What the rules are, how posts are checked, how you report something — and, just as importantly, what we cannot do. Checked against the actual code on 20 August 2026.'
            : '呢度嘅規矩、每則留言點樣審、你點樣舉報 —— 以及同樣重要嘅：我哋做唔到啲乜。2026 年 8 月 20 日對住實際代碼核實。'}
        </p>
      </header>

      <div className="mb-8">
        <HotlineCard emphasis />
      </div>

      <Section title={en ? 'The single most important fact' : '最重要嗰件事'}>
        <p className="rounded-xl border border-accent/25 bg-accent/[0.06] p-4">
          {en
            ? 'There is no private messaging anywhere on this site. No DMs, no private chat, no way for one student to contact another. The only thing you can do is post to the wall — which a real person reads first — and give someone a heart. Nobody here can reach you privately, because the feature does not exist.'
            : '呢個網站冇任何私訊功能。冇 DM、冇私聊、冇任何途徑令一個同學可以私下搵另一個。你可以做嘅只有兩樣：喺個牆留言（會有真人先睇過），同埋畀個心心。呢度冇人可以私下搵到你，因為呢個功能根本唔存在。'}
        </p>
        <p>
          {en
            ? 'That matters because most of what goes wrong for young people online starts in a private message. We would rather not build the thing than build it and try to police it.'
            : '呢點好緊要，因為年輕人喺網上出事，大部分都係由一個私訊開始。與其起咗佢再嘗試管，我哋寧願唔起。'}
        </p>
      </Section>

      <Section title={en ? 'House rules' : '呢度嘅規矩'}>
        <ul className="ml-4 list-disc space-y-1.5">
          <li>{en ? 'Never post your phone number, address, school or photos — yours or anyone else’s.' : '唔好貼電話、地址、就讀學校或者相片 —— 你自己嘅同人哋嘅都唔好。'}</li>
          <li>{en ? 'Don’t ask anyone for contact details, photos, or to move the conversation somewhere private.' : '唔好問人攞聯絡方法、相片，或者叫人轉去私下傾。'}</li>
          <li>{en ? 'No bullying, harassment or discrimination.' : '唔准欺凌、騷擾、歧視。'}</li>
          <li>{en ? 'Nothing sexual, nothing violent, nothing that encourages self-harm.' : '唔准性、暴力，或者鼓勵自我傷害嘅內容。'}</li>
          <li>{en ? 'No advertising, no tutoring promotions, no links to paid services.' : '唔准賣廣告、唔准推補習、唔准放付費服務連結。'}</li>
        </ul>
        <p>
          {en
            ? 'A post that breaks these simply never becomes public — see below for why that is different from most sites.'
            : '違反以上任何一條嘅留言，根本唔會變成公開 —— 點解呢個同大部分網站唔同，見下面。'}
        </p>
      </Section>

      <Section title={en ? 'How posts are checked' : '每則留言點樣審'}>
        <p>
          {en
            ? 'Every post goes into a queue as “pending” and stays there until one of the two founders reads it and decides. There is no automatic path from “pending” to “public” — not a filter, not a score, not a delay. If nobody reads it, it never appears.'
            : '每一則留言都會以「待審」入 queue，一直留喺度，直到兩位創辦人其中一個親自睇過並落決定。由「待審」變「公開」冇任何自動途徑 —— 唔係過濾器、唔係分數、唔係等一陣就出。冇人睇過，佢就永遠唔會出現。'}
        </p>
        <p>
          {en
            ? 'Each decision records who made it and when, so it can be answered for later. One person can have at most three posts waiting at a time, so nobody can flood the queue.'
            : '每個決定都會記低係邊個、幾時落 —— 之後交代得到。一個人同一時間最多三條喺 queue 度等，所以冇人可以洗爆佢。'}
        </p>
        <p>
          {en
            ? 'The trade-off is honest: it is slow. Two people run this in their spare time. Your post may sit for a while.'
            : '代價要講清楚：佢慢。呢個站得兩個人喺工餘做。你嘅留言可能會等一陣。'}
        </p>
      </Section>

      <Section title={en ? 'Reporting something' : '舉報'}>
        <p>
          {en ? 'Every published post has a “Report” link. It opens an email to ' : '每一則已公開嘅留言都有「舉報」。撳咗會開一封電郵去 '}
          <a href={`mailto:${CONTACT}`} className="font-medium text-accent-strong underline underline-offset-2">
            {CONTACT}
          </a>
          {en
            ? ' with the post reference already filled in, so we can find it.'
            : '，帖編號已經填好，等我哋搵得返係邊條。'}
        </p>
        <p>
          {en
            ? 'We are not going to pretend to be on duty around the clock, because we are not. If you or somebody else is in danger right now, do not wait for us — call 999, or one of the hotlines at the top of this page.'
            : '我哋唔會扮 24 小時當值，因為我哋唔係。如果你或者其他人而家有即時危險，唔好等我哋 —— 即刻打 999，或者打呢版頂嗰兩條熱線。'}
        </p>
      </Section>

      <Section title={en ? 'What we have, and what we do not' : '我哋有咩、冇咩'}>
        <ul className="space-y-2">
          <Fact has>{en ? 'Every post read by a real person before it is public' : '每一則留言公開之前由真人睇過'}</Fact>
          <Fact has>{en ? 'Crisis hotlines pinned at the top of the wall, always — not triggered by anything' : '熱線永遠置頂喺個牆，唔靠任何嘢觸發'}</Fact>
          <Fact has>{en ? 'A report link on every published post' : '每則已公開留言都有舉報連結'}</Fact>
          <Fact has>{en ? 'A record of who moderated what, and when' : '邊個審過邊條、幾時審，有紀錄'}</Fact>
          <Fact has={false}>
            {en
              ? 'No private messaging — deliberately never built'
              : '冇私訊功能 —— 刻意由頭到尾都冇起'}
          </Fact>
          <Fact has={false}>
            {en
              ? 'No blocking or account suspension yet. Because there is no way to contact you privately and nothing is published unchecked, there is nothing for a block to protect you from today — but we are naming the gap rather than hiding it.'
              : '暫時冇封鎖或者停權機制。因為呢度冇途徑可以私下搵你，而且冇嘢係未審就出街，所以今日一個封鎖掣其實冇嘢好擋 —— 但我哋寧願講明呢個缺口，唔收埋佢。'}
          </Fact>
          <Fact has={false}>
            {en
              ? 'No automated self-harm detection, and no automatic crisis intervention. This one is a deliberate refusal, not a missing feature — see below.'
              : '冇自動自殘偵測，亦冇自動危機介入。呢樣係刻意唔做，唔係做漏 —— 見下面。'}
          </Fact>
          <Fact has={false}>
            {en ? 'No 24-hour response commitment — two people, spare time' : '冇 24 小時回應承諾 —— 兩個人，工餘時間'}
          </Fact>
        </ul>
      </Section>

      <Section title={en ? 'Why we refuse to auto-detect distress' : '點解我哋拒絕自動偵測情緒危機'}>
        <p>
          {en
            ? 'We could run your words through a keyword list or a model and flag you as “at risk”. We have chosen not to, and we want you to know why.'
            : '我哋大可以攞你啲字去撞關鍵字或者跑個模型，然後將你標記為「高風險」。我哋揀咗唔做，而我哋想你知點解。'}
        </p>
        <p>
          {en
            ? 'Getting it wrong in one direction means missing someone who needed help. Getting it wrong in the other means hiding a post from somebody at the exact moment they reached out — telling a student in their worst hour that even here, they were shut down. Neither of those is a risk we are willing to take with a keyword list.'
            : '判斷錯一邊，係漏咗一個真係需要幫手嘅人。錯另一邊，係喺一個人終於肯開口嗰刻收埋佢嘅留言 —— 即係話畀一個處於最差狀態嘅學生知，連呢度都唔畀佢講。呢兩個風險，我哋都唔願意交畀一張關鍵字表去賭。'}
        </p>
        <p>
          {en
            ? 'What we do instead: the hotlines sit at the top of the wall for everyone, all the time. And if what you are typing contains words we recognise as distress, we show you the hotline card straight away — on your own screen, only to you. Nothing is flagged, nothing is stored, nothing is sent to anyone, and your post carries on to the queue exactly as normal.'
            : '我哋做嘅係另一件事：熱線永遠置頂喺個牆，對所有人、所有時候。另外，如果你打緊嘅字入面有我哋認得出嘅求助字眼，我哋會即刻喺你自己個畫面彈返張熱線卡 —— 只有你自己見到。唔會標記、唔會儲存、唔會通知任何人，你嘅留言照樣入 queue，一切如常。'}
        </p>
        <p>
          {en
            ? 'We are not counsellors and this wall is not a crisis service. Please treat it as what it is: other students, saying they are tired too.'
            : '我哋唔係輔導員，呢個牆亦唔係危機支援服務。請當佢係佢本身嘅樣：一班同路人，講緊佢哋都好攰。'}
        </p>
      </Section>

      <Section title={en ? 'Links that leave this site' : '離開呢個網站嘅連結'}>
        <p>
          {en
            ? 'A few pages link out — a student-run Instagram group, YouTube, GitHub. Before you go, we show you exactly where you are heading. Once you are there, none of the above applies: that platform’s accounts, direct messages and rules take over, and we can neither see nor moderate what happens.'
            : '有幾個頁會連出去 —— 一個學生自發嘅 Instagram 群組、YouTube、GitHub。你去之前，我哋會話你知你去緊邊。你一到咗嗰邊，以上全部唔再適用：對方平台嘅帳戶、私訊同規則接手，我哋既睇唔到亦管唔到入面發生咩事。'}
        </p>
        <p>
          {en
            ? 'On any outside platform: never share your phone number, address, school or photos; and if somebody asks to move to private chat, asks for photos, or makes you uncomfortable — leave, and tell an adult you trust.'
            : '喺任何站外平台：唔好分享電話、地址、就讀學校或者相片；如果有人要求私下傾、要相，或者令你唔舒服 —— 離開，並且話畀你信得過嘅大人知。'}
        </p>
      </Section>

      <Section title={en ? 'Parents, teachers and schools' : '家長、老師同學校'}>
        <p>
          {en ? 'If you want something removed, or want to understand how any of this works, email ' : '如果你想移除任何嘢，或者想了解以上任何一項點運作，請電郵 '}
          <a href={`mailto:${CONTACT}`} className="font-medium text-accent-strong underline underline-offset-2">
            {CONTACT}
          </a>
          {en ? '. See also our ' : '。另見我哋嘅'}
          <Link href="/privacy" className="font-medium text-accent-strong underline underline-offset-2">
            {en ? 'privacy policy' : '私隱政策'}
          </Link>
          {en ? ' for what is collected and how to delete it.' : '，講明收集咩同點刪除。'}
        </p>
      </Section>

      <p className="mt-10 border-t border-line pt-5 text-xs leading-relaxed text-ink-muted">
        {en
          ? 'If we build a blocking mechanism, an in-app report queue, or anything else listed above as missing, this page changes on the same day. If you find a statement here that does not match what the site actually does, tell us — that is a bug.'
          : '如果我哋將來起咗封鎖機制、站內舉報 queue，或者以上任何一項標住「冇」嘅嘢，呢版會喺同一日更新。如果你發現呢版有任何一句同個站實際做法唔同，話我哋知 —— 嗰個係 bug。'}
      </p>
    </div>
  )
}
