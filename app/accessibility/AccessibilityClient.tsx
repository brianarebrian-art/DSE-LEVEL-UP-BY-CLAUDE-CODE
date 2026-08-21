'use client'

import Link from 'next/link'
import { useLocale } from '@/lib/i18n'

// 見 page.tsx 檔頭：呢版分三欄 —— 已提供／已知未達／未測試。
// 第三欄同頭兩欄一樣重要：一份只列優點嘅無障礙聲明，本身就係一種誤導。

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="mb-8">
      <h2 className="mb-3 text-lg font-medium text-ink">{title}</h2>
      <div className="space-y-3 text-sm leading-relaxed text-ink-soft">{children}</div>
    </section>
  )
}

type State = 'yes' | 'partial' | 'no' | 'untested'

const MARK: Record<State, { sign: string; cls: string }> = {
  yes: { sign: '✓', cls: 'text-accent-strong' },
  partial: { sign: '~', cls: 'text-gold' },
  no: { sign: '✕', cls: 'text-rose' },
  untested: { sign: '?', cls: 'text-ink-muted' },
}

function Row({ state, wcag, children }: { state: State; wcag: string; children: React.ReactNode }) {
  const m = MARK[state]
  return (
    <li className="flex gap-2 py-1">
      <span aria-hidden className={`w-4 shrink-0 font-mono ${m.cls}`}>
        {m.sign}
      </span>
      <span className="flex-1">
        <span className={state === 'yes' ? 'text-ink-soft' : 'text-ink-soft'}>{children}</span>
        <span className="ml-2 font-mono text-[11px] text-ink-muted">{wcag}</span>
      </span>
    </li>
  )
}

export default function AccessibilityClient() {
  const { locale } = useLocale()
  const en = locale === 'en'

  return (
    <div className="mx-auto max-w-2xl px-4 py-10">
      <header className="mb-8">
        <h1 className="text-2xl font-medium text-ink">
          {en ? 'Accessibility self-assessment' : '無障礙自評'}
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-ink-muted">
          {en
            ? 'Measured against WCAG 2.2 level AA, on 21 August 2026. This is a self-assessment, not a certification and not a third-party audit.'
            : '對照 WCAG 2.2 AA 級，2026 年 8 月 21 日。呢個係自評，唔係認證，亦唔係第三方審計。'}
        </p>
      </header>

      <p className="mb-8 rounded-xl border border-gold/25 bg-gold/[0.06] p-4 text-sm leading-relaxed text-ink-soft">
        {en
          ? 'A page that lists only the things we got right would itself be misleading — especially on a site that calls itself SEN-friendly. So the last two sections below are the gaps and the things we simply have not tested. Please read those too.'
          : '一份只列做得啱嘅嘢嘅無障礙聲明，本身就係一種誤導 —— 對一個自稱 SEN 友善嘅平台嚟講尤其係。所以下面最後兩節係缺口，同埋我哋根本未測試過嘅嘢。請一併睇埋。'}
      </p>

      <Section title={en ? 'Provided' : '已提供'}>
        <ul>
          <Row state="yes" wcag="2.4.1">
            {en ? '“Skip to main content” link — first thing a keyboard user reaches' : '「跳至主要內容」連結 —— 鍵盤用戶第一下 Tab 就見到'}
          </Row>
          <Row state="yes" wcag="2.1.1">
            {en ? 'Everything works by keyboard; no mouse-only control' : '所有功能鍵盤操作得到，冇淨係用滑鼠先做到嘅控制'}
          </Row>
          <Row state="yes" wcag="2.4.7">
            {en ? 'Visible focus outline on interactive elements' : '互動元素有可見嘅焦點框'}
          </Row>
          <Row state="yes" wcag="2.5.8">
            {en ? 'Touch targets at least 44 px tall' : '觸控目標至少 44 像素高'}
          </Row>
          <Row state="yes" wcag="1.4.3">
            {en
              ? 'Text contrast is checked automatically on every build — a failing colour blocks the build'
              : '文字對比度每次 build 都自動檢查 —— 有一處不合格就 build 唔到'}
          </Row>
          <Row state="yes" wcag="1.4.4 / 1.4.12">
            {en
              ? 'Text size 12–24 px, plus line height and letter spacing, adjustable and remembered'
              : '字級 12–24 像素，連同行距、字距，可調整並記住'}
          </Row>
          <Row state="yes" wcag="1.4.8">
            {en
              ? 'Dyslexia-friendly font stack (BDA-style spacing) and a line-tracking reading ruler'
              : '讀寫障礙友善字體堆疊（BDA 式間距）同防跳行閱讀尺'}
          </Row>
          <Row state="yes" wcag="2.3.3">
            {en ? 'Animation is reduced automatically when your system asks for it' : '你系統要求減少動態時，動畫會自動減少'}
          </Row>
          <Row state="yes" wcag="2.2.1">
            {en ? 'Timers can be hidden; the practice timer never forces you to finish' : '計時器可以隱藏；練習計時唔會逼你限時完成'}
          </Row>
          <Row state="yes" wcag="1.4.2">
            {en ? 'No audio plays on its own — you always press play first' : '冇任何聲音會自己播 —— 一定要你先撳播放'}
          </Row>
          <Row state="yes" wcag="1.1.1 / 1.3.1">
            {en
              ? 'Maths formulas carry MathML, so a screen reader reads the equation rather than the symbols one by one'
              : '數學公式帶 MathML，螢幕閱讀器會讀出成條式，唔係逐個符號讀'}
          </Row>
          <Row state="yes" wcag="4.1.2">
            {en ? 'Dialogs are marked as dialogs, trap focus sensibly and close on Esc' : '對話框有正確標記、焦點處理合理、撳 Esc 收得'}
          </Row>
          <Row state="yes" wcag="3.1.1">
            {en ? 'Page language declared; full Chinese/English switch across the site' : '頁面語言已宣告；全站中英切換'}
          </Row>
        </ul>
      </Section>

      <Section title={en ? 'Known gaps' : '已知未達標'}>
        <ul>
          <Row state="no" wcag="1.4.3">
            {en
              ? 'One grey (#9CA3AF) sits at 2.4:1 — below AA. It is used only for decorative marks and disabled controls, never for text you need to read. We kept it deliberately and we are naming it rather than hiding it.'
              : '有一隻灰（#9CA3AF）只有 2.4:1，未達 AA。佢只用喺裝飾符號同停用咗嘅控制項，唔會用喺你需要讀嘅文字。呢個係刻意保留，我哋寧願講明，唔收埋。'}
          </Row>
          <Row state="partial" wcag="1.4.11">
            {en
              ? 'Non-text contrast (borders, icons) is not covered by the automatic check — only text is. Borders are reviewed by eye.'
              : '非文字對比（邊框、圖示）唔喺自動檢查範圍內 —— 佢只掃文字。邊框係人眼睇。'}
          </Row>
          <Row state="no" wcag="—">
            {en
              ? 'No third-party audit and no formal conformance claim. Nobody outside the project has checked this.'
              : '冇第三方審計，亦冇正式符合性聲明。呢個站冇任何專案以外嘅人審過。'}
          </Row>
        </ul>
      </Section>

      <Section title={en ? 'Not tested' : '未測試過'}>
        <p>
          {en
            ? 'We have not run the site through a screen reader end to end. Saying “screen-reader friendly” without having done that would be a claim we cannot back, so we are not saying it.'
            : '我哋未曾用螢幕閱讀器由頭到尾行過一次個站。冇做過就講「螢幕閱讀器友善」係一句撐唔住嘅宣稱，所以我哋唔會講。'}
        </p>
        <ul>
          <Row state="untested" wcag="—">
            {en ? 'VoiceOver / NVDA / TalkBack end-to-end walkthrough' : 'VoiceOver／NVDA／TalkBack 完整走一次'}
          </Row>
          <Row state="untested" wcag="—">
            {en ? 'Voice control and switch access' : '語音控制同輔助開關'}
          </Row>
          <Row state="untested" wcag="—">
            {en
              ? 'The Google sign-in screen — it is Google’s, not ours, and we cannot change it'
              : 'Google 登入畫面 —— 嗰個係 Google 嘅，唔係我哋嘅，我哋改唔到'}
          </Row>
          <Row state="untested" wcag="—">
            {en
              ? 'The embedded YouTube player on the audio page (third-party)'
              : '獨處充電頁嵌入嘅 YouTube 播放器（第三方）'}
          </Row>
        </ul>
      </Section>

      <Section title={en ? 'Where to find the controls' : '啲控制喺邊'}>
        <p>
          {en
            ? 'Bottom-left of every page: the ♿ button opens text size, easy-read font, line and letter spacing, plus a single switch that turns on the three most-used supports at once. The 📏 button next to it toggles the reading ruler.'
            : '每一版嘅左下角：♿ 掣開字級、易讀字體、行距字距，同埋一個一撳齊開三項常用支援嘅掣。隔籬 📏 掣係閱讀尺。'}
        </p>
        <p>
          {en ? 'Stress and sensory options live in ' : '壓力同感官相關嘅選項喺'}
          <Link href="/relax" className="font-medium text-accent-strong underline underline-offset-2">
            {en ? 'the breathing space' : '呼吸空間'}
          </Link>
          {en ? '.' : '。'}
        </p>
      </Section>

      <Section title={en ? 'Tell us what breaks' : '有嘢用唔到就話我哋知'}>
        <p>
          {en
            ? 'If something on this site is unusable for you, that is the most useful message we can receive — more useful than any audit. Email '
            : '如果呢個站有任何嘢你用唔到，嗰個係我哋收得到最有用嘅訊息 —— 比任何審計都有用。電郵 '}
          <a
            href="mailto:dselevelup@gmail.com?subject=%5BDSE%20Level%20Up%5D%20Accessibility"
            className="font-medium text-accent-strong underline underline-offset-2"
          >
            dselevelup@gmail.com
          </a>
          {en ? '. Please say what device and what assistive tool you use, if you can.' : '。可以嘅話講埋你用咩裝置、咩輔助工具。'}
        </p>
      </Section>

      <p className="mt-10 border-t border-line pt-5 text-xs leading-relaxed text-ink-muted">
        {en
          ? 'When any line above changes — a gap closed, a test finally run — this page changes on the same day.'
          : '上面任何一行有變 —— 補咗個缺口、終於做咗個測試 —— 呢版會喺同一日更新。'}
      </p>
    </div>
  )
}
