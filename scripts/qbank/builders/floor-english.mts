// ============================================================================
// floor-english.mts —— English Language「補底」容易題草稿 40 條
// ----------------------------------------------------------------------------
// 英文科 149 條 MC 之中容易題【只得 5 條】，一節按憲章 3:5:2 要派 6 易 ——
// 全站最後一科派唔出 3:5:2 嘅科目就係佢，實測「缺 1 條」。
// 但補到剛好 6 條係假通過：6 條易題會條條重複出現。本批補 40 條造出真緩衝。
//
// ── 大綱範圍（HKEAA English Language 2026 評核大綱）────────────────────────
//   卷一 閱讀 20%（分卷 A 必答／分卷 B 二擇一）
//   卷二 寫作 25%（一必答＋一選答，設定體裁、對象、目的）
//   卷三 聆聽及綜合能力 30%（資料檔案 → 指定體裁寫作）
//   卷四 口語 25%
// 本批只出卷一、卷二、卷三嘅【知識檢查】題，唔扮係卷面題型（見 dse-conformance §1）。
//
// ── 「容易」點界定 ───────────────────────────────────────────────────────
// 答案要喺句子或選段之內指得出嚟：一個主語、一個時間標記、一個指代詞、
// 一個語域訊號。唔係考生僻詞，亦唔係要考生猜作者心意。
// 對應真實失分位：卷一考生最常喺【指代詞同上下文詞義】失分，
// 卷三最常喺【對象／體裁認錯】失分 —— 所以兩者都放咗喺呢批入面。
//
// ── 題幹刻意寫長 ─────────────────────────────────────────────────────────
// 稽核第 4 項：全站 19 科七成以上題幹短於 40 字。舊英文題係
// 「Choose the correct sentence:」加四個選項 —— 學生見唔到語境，變咗背句型。
// 本批每題都有語境（通告、電郵、廣告、敘事選段），答題要先讀文本。
//
// ── 版權（憲章 §4）──────────────────────────────────────────────────────
// 全部選段、通告、電郵、廣告均為【原創撰寫】，不引用任何在版權期內的作品。
//
// 語言科慣例：英文欄重複同一串（`m(s)=[s,s]`），全卷以英文命題。
// ============================================================================
import { writeFileSync } from 'node:fs'

type P = [zh: string, en: string]
interface Q { t: keyof typeof T; stim?: string; q: string; o: string[]; e: string }

const T = {
  gram:  ['grammar',        'Grammar'],
  tense: ['tenses',         'Tenses'],
  vocab: ['vocabulary',     'Vocabulary'],
  wform: ['word_formation', 'Word Formation'],
  cloze: ['cloze',          'Cloze & Usage'],
  read:  ['reading',        'Reading Comprehension'],
  genre: ['genre_tone',     'Genre, Tone & Register'],
  integ: ['integrated',     'Integrated Skills'],
  p1r:   ['paper1_reading', 'DSE Paper 1 Reading'],
  p1vr:  ['p1_vocab_ref',   'Reading · Vocabulary & Reference'],
} as const

// ⚠️ `o[0]` 必須係正解 —— 下面 rotate() 會將佢搬去第 i%4 個位。
const QS: Q[] = [
  // ── Grammar 4 ────────────────────────────────────────────────────────────
  {
    t: 'gram',
    stim: 'A notice on the staff-room door reads:\n\n“A box of spare markers ___ been left in the Art Room. Please collect it before Friday.”',
    q: 'Which word completes the notice correctly?',
    o: ['has', 'have', 'were', 'are'],
    e: 'The subject of the sentence is “a box”, which is singular, so the singular “has” is required. “Of spare markers” is a prepositional phrase describing the box; a phrase between the subject and the verb never changes the number of the subject. Candidates lose this mark by looking at the nearest noun — “markers” — and matching the verb to that instead. Find the head noun of the subject first, then choose the verb.',
  },
  {
    t: 'gram',
    stim: 'A Form 6 student is drafting a personal statement:\n\n“My elder brother wants to become ___ engineer, so he chose Physics and Mathematics.”',
    q: 'Which word completes the sentence correctly?',
    o: ['an', 'a', 'the', 'some'],
    e: 'The choice between “a” and “an” depends on the sound that follows, not the letter. “Engineer” begins with the vowel sound /e/, so “an” is used. “The” would wrongly point to one particular engineer already known to the reader, and “some” cannot introduce a single countable job title in this position. Test by saying the phrase aloud: if a vowel sound follows, use “an”.',
  },
  {
    t: 'gram',
    stim: 'A student is writing a covering letter:\n\n“I am writing to apply ___ the post of part-time library assistant advertised in your newsletter.”',
    q: 'Which preposition completes the sentence correctly?',
    o: ['for', 'to', 'on', 'with'],
    e: 'The fixed pattern is “apply for” + the position you want. “Apply to” is also correct English, but it takes the organisation you are writing to — “I applied to the university” — not the post itself. The other two prepositions do not combine with “apply” in this meaning at all. Learn the verb together with the preposition that follows it; that pairing is what is being tested.',
  },
  {
    t: 'gram',
    stim: 'From a school magazine profile:\n\n“The student ___ designed the recycling posters is now studying Visual Arts.”',
    q: 'Which word completes the sentence correctly?',
    o: ['who', 'which', 'what', 'whose'],
    e: '“Who” is the relative pronoun used for people, and here it is the subject of “designed”. “Which” is used for things, not people. “What” cannot introduce a relative clause of this kind. “Whose” shows possession and would need a noun after it — “whose posters won” — but no noun follows here. Ask what the relative pronoun stands for: a person doing the action takes “who”.',
  },

  // ── Tenses 4 ─────────────────────────────────────────────────────────────
  {
    t: 'tense',
    stim: 'Ken is telling a classmate about his holiday:\n\n“I ___ to Osaka last July, and I would love to go again next year.”',
    q: 'Which form completes the sentence correctly?',
    o: ['went', 'have gone', 'have been going', 'had gone'],
    e: '“Last July” is a finished time expression, and a finished time takes the past simple: “went”. The present perfect cannot be used with a stated finished time, which rules out “have gone” and “have been going”. The past perfect “had gone” would need a second, later past event for it to happen before, and there is none here. Look for the time marker first — it usually decides the tense on its own.',
  },
  {
    t: 'tense',
    stim: 'A committee member is confirming arrangements:\n\n“We ___ the inter-class singing contest next Saturday — the tickets have already been printed.”',
    q: 'Which form best completes the sentence?',
    o: ['are holding', 'hold', 'will have held', 'held'],
    e: 'The present continuous is used for a future event that is already arranged, and the printed tickets show the arrangement is fixed. The present simple “hold” would state a habit or timetable fact rather than a one-off plan. “Will have held” is the future perfect and would mean the contest is over by a later point. “Held” is past and contradicts “next Saturday”. Where a sentence gives evidence of an arrangement, the present continuous is the natural choice.',
  },
  {
    t: 'tense',
    stim: 'From a student’s account of a fire drill:\n\n“While I ___ my notes in the study room, the alarm suddenly rang.”',
    q: 'Which form completes the sentence correctly?',
    o: ['was reviewing', 'reviewed', 'have reviewed', 'had been reviewed'],
    e: 'Two past actions are described: a longer one already in progress and a short one that interrupts it. The longer background action takes the past continuous — “was reviewing” — and the interrupting action takes the past simple, “rang”. “Reviewed” would make both actions equally brief and lose the sense of interruption. “Have reviewed” is present perfect and cannot sit beside “rang”. “Had been reviewed” is passive and would mean somebody else reviewed the notes.',
  },
  {
    t: 'tense',
    stim: 'From a retirement speech:\n\n“Miss Lau ___ at this school for twenty-two years, and she is still teaching Form 6 today.”',
    q: 'Which form completes the sentence correctly?',
    o: ['has taught', 'taught', 'is teaching', 'had taught'],
    e: 'The period runs from the past up to the present moment and is still continuing — “she is still teaching today” — so the present perfect “has taught” is required. The past simple “taught” would close the period and contradict the second clause. “Is teaching” describes only what is happening now and cannot carry “for twenty-two years”. “Had taught” needs a later past reference point, which the sentence does not supply.',
  },

  // ── Vocabulary 4 ─────────────────────────────────────────────────────────
  {
    t: 'vocab',
    stim: 'From a news report:\n\n“The department has pledged to shorten waiting times at public clinics by the end of next year.”',
    q: 'In this sentence, “pledged” is closest in meaning to —',
    o: ['promised', 'refused', 'doubted', 'delayed'],
    e: '“Pledge” means to make a firm public promise, so “promised” carries the same meaning here. “Refused” reverses the meaning entirely. “Doubted” would suggest the department is unsure, which the sentence does not say. “Delayed” describes the waiting times, not the department’s undertaking. When a word is unfamiliar, check whether the surrounding sentence is positive or negative before choosing — that alone removes two options here.',
  },
  {
    t: 'vocab',
    stim: 'From a teacher’s feedback:\n\n“The instructions on the worksheet were so vague that half the class attempted the wrong exercise.”',
    q: 'In this sentence, “vague” means —',
    o: ['unclear', 'detailed', 'strict', 'urgent'],
    e: 'The result clause — half the class did the wrong exercise — shows the instructions failed to make things clear, so “vague” means “unclear”. “Detailed” is the opposite and would not produce that result. “Strict” and “urgent” describe tone and timing rather than clarity, and neither would explain the mistake. Use the consequence stated in the sentence to test your choice: the meaning must make the consequence follow.',
  },
  {
    t: 'vocab',
    stim: 'From an estate notice:\n\n“Sorting waste into the three bins provided is now compulsory for all households in the estate.”',
    q: 'In this notice, “compulsory” means —',
    o: ['required by rule', 'left to personal choice', 'expensive to arrange', 'available for a short time'],
    e: '“Compulsory” means something must be done because a rule requires it. “Left to personal choice” is the exact opposite — the word for that is “optional” or “voluntary”. Cost and duration are not part of the meaning, so the remaining two options describe things the notice never mentions. Note that a notice using “compulsory” is stating an obligation, not making a request.',
  },
  {
    t: 'vocab',
    stim: 'From the minutes of a meeting:\n\n“The secretary gave a brief account of what had happened at the previous meeting before the new business was discussed.”',
    q: 'In this sentence, “brief” means —',
    o: ['short', 'dishonest', 'angry', 'written'],
    e: '“Brief” describes length: the account was short. The sentence gives no hint of dishonesty or anger, so those two options add meaning that is not in the text. “Written” is a tempting trap because minutes are written documents, but “gave an account” describes speaking at the meeting, and in any case “brief” never means “written”. Choose the meaning the sentence supports, not the one the setting suggests.',
  },

  // ── Word Formation 5 ─────────────────────────────────────────────────────
  {
    t: 'wform',
    stim: 'Complete the sentence with the correct form of DECIDE:\n\n“Choosing a university programme is an important ___ for every Form 6 student.”',
    q: 'Which form fits the gap?',
    o: ['decision', 'decide', 'decisive', 'decidedly'],
    e: 'The gap follows the article “an” and the adjective “important”, so a noun is required, and the noun formed from “decide” is “decision”. “Decide” is the verb, “decisive” the adjective and “decidedly” the adverb — none of them can follow “an important”. Identify the part of speech the gap needs before you think about the word itself; the words immediately before the gap usually tell you.',
  },
  {
    t: 'wform',
    stim: 'Complete the sentence with the correct form of SAFE:\n\n“Please read the ___ instructions carefully before operating any machine in the workshop.”',
    q: 'Which form fits the gap?',
    o: ['safety', 'safely', 'safe', 'safest'],
    e: '“Safety instructions” is the established compound: a noun used before another noun to say what kind of instructions these are. “Safe instructions” would mean the instructions themselves are not dangerous, which is not the meaning intended. “Safely” is an adverb and cannot modify a noun, and the superlative “safest” would need a comparison the sentence does not make.',
  },
  {
    t: 'wform',
    stim: 'Complete the sentence with the correct form of SUCCESS:\n\n“The team ___ completed the project one full week ahead of schedule.”',
    q: 'Which form fits the gap?',
    o: ['successfully', 'success', 'successful', 'succeed'],
    e: 'The gap sits between the subject and the verb “completed”, so it must be an adverb describing how the action was carried out: “successfully”. “Success” is a noun and “successful” an adjective, neither of which can modify a verb. “Succeed” is a second verb and would leave the sentence with two main verbs and no link between them.',
  },
  {
    t: 'wform',
    stim: 'Complete the sentence with the correct form of ADVERTISE:\n\n“The school placed an ___ in the district newspaper to recruit volunteer coaches.”',
    q: 'Which form fits the gap?',
    o: ['advertisement', 'advertise', 'advertising', 'advertised'],
    e: 'The article “an” signals a singular countable noun, and the countable noun here is “advertisement” — one particular notice placed in the paper. “Advertising” is an uncountable noun meaning the activity as a whole, so it cannot follow “an”. “Advertise” is the verb and “advertised” its past form, and neither can be the object of “placed”.',
  },
  {
    t: 'wform',
    stim: 'Complete the sentence with the correct form of DIFFICULT:\n\n“Many candidates underestimate the ___ of the listening paper and do not practise for it.”',
    q: 'Which form fits the gap?',
    o: ['difficulty', 'difficult', 'difficultly', 'differences'],
    e: 'The pattern “the ___ of” requires a noun, and the noun formed from “difficult” is “difficulty”. “Difficult” is the adjective and cannot follow “the” in this structure. “Difficultly” is not used in standard written English. “Differences” is a real noun but comes from “different”, a different word, and would change the meaning of the sentence.',
  },

  // ── Cloze & Usage 5 ──────────────────────────────────────────────────────
  {
    t: 'cloze',
    stim: 'From a school announcement:\n\n“Heavy rain flooded the playground on Friday morning. ___, this year’s Sports Day was moved to the indoor hall.”',
    q: 'Which connective fits the gap?',
    o: ['As a result', 'In contrast', 'For example', 'Nevertheless'],
    e: 'The second sentence states what happened because of the first, so a connective of result is needed. “In contrast” would signal a difference between the two sentences, but they agree rather than contrast. “For example” would introduce an illustration of the first sentence, and moving Sports Day is a consequence, not an example. “Nevertheless” would signal that the move happened despite the flooding, which reverses the logic.',
  },
  {
    t: 'cloze',
    stim: 'From a student’s article on transport:\n\n“Cycling is cheap and produces no exhaust fumes. ___, it is not practical for everyone, particularly in the hilly parts of the territory.”',
    q: 'Which connective fits the gap?',
    o: ['However', 'Therefore', 'Similarly', 'In addition'],
    e: 'The first sentence gives advantages and the second gives a limitation, so a contrastive connective is needed. “Therefore” would present the limitation as a result of the advantages, which makes no sense. “Similarly” and “In addition” both signal that more of the same is coming, but the second sentence turns the argument the other way. Decide whether the two sentences agree or disagree before choosing.',
  },
  {
    t: 'cloze',
    stim: 'From a proposal on food waste:\n\n“Several simple measures could cut food waste in schools. ___, canteens could let students choose a smaller portion at no extra cost.”',
    q: 'Which connective fits the gap?',
    o: ['For instance', 'On the contrary', 'As a result', 'Finally'],
    e: 'The second sentence gives one of the “several simple measures” just announced, so it is an example. “On the contrary” would deny the first sentence rather than illustrate it. “As a result” would make the smaller portions a consequence of the measures, but they are one of the measures. “Finally” would signal the last item in a list, yet this is the first item mentioned.',
  },
  {
    t: 'cloze',
    stim: 'From a library notice:\n\n“___ the notice was posted a month ago, several parents said at the meeting that they had never seen it.”',
    q: 'Which word fits the gap?',
    o: ['Although', 'Because', 'So', 'Unless'],
    e: 'The two clauses conflict: the notice was up for a month, yet parents did not see it. “Although” is the conjunction that introduces this kind of concession. “Because” would make the month-long posting the reason nobody saw it, which is illogical. “So” introduces a result and cannot begin the first clause in this structure. “Unless” sets a condition, but no condition is being stated here.',
  },
  {
    t: 'cloze',
    stim: 'From an examination timetable notice:\n\n“The library will open at eight in the morning ___ close at ten at night throughout the examination period.”',
    q: 'Which word fits the gap?',
    o: ['and', 'but', 'or', 'because'],
    e: 'The two facts about the library’s hours simply add to each other, so the additive conjunction “and” is correct. “But” would signal a contrast, yet an opening time and a closing time do not oppose each other. “Or” would offer an alternative, as though only one of the two would happen. “Because” would make the closing time the reason for the opening time.',
  },

  // ── Reading Comprehension 4 ──────────────────────────────────────────────
  {
    t: 'read',
    stim: 'NOTICE\n\nThe Students’ Union will hold its second-hand book sale in the covered playground on 14 March, from 12:30 to 2:00 p.m. Books you wish to sell must be handed in at Room 204 on or before 10 March. Unsold books may be collected on 15 March.',
    q: 'According to the notice, what must a student do on or before 10 March?',
    o: [
      'Hand in at Room 204 any books they wish to sell.',
      'Buy second-hand books in the covered playground.',
      'Collect any books that have not been sold.',
      'Register with the Students’ Union to attend the sale.',
    ],
    e: 'The notice gives three dates and attaches a different action to each: 10 March for handing in, 14 March for the sale, 15 March for collecting unsold books. Only handing in is tied to “on or before 10 March”. The other options describe real actions in the notice but attach them to the wrong date, and registration is never mentioned at all. In date questions, match the action to its own date rather than to the first date you see.',
  },
  {
    t: 'read',
    stim: 'EMAIL\n\nDear Ms Ho,\n\nI am sorry that I will not be able to attend Thursday’s rehearsal. I have a medical appointment that morning which cannot be rearranged. I have asked Karen to take my part for that day so the group can still run the full piece.\n\nYours sincerely,\nJanice Lam',
    q: 'What is the main purpose of this email?',
    o: [
      'To explain an absence and say who will cover the part.',
      'To ask for Thursday’s rehearsal to be cancelled.',
      'To complain about the time at which rehearsals are held.',
      'To invite Ms Ho to attend a medical appointment.',
    ],
    e: 'The email does two things, and both belong to the same purpose: it gives a reason for missing the rehearsal and it names a substitute. Nothing in it asks for a cancellation — the writer’s arrangement is designed precisely so that the rehearsal can go ahead. There is no complaint about the timing, only a clash the writer cannot control. The invitation option misreads whose appointment it is. Read to the end before deciding purpose; the last sentence often carries it.',
  },
  {
    t: 'read',
    stim: 'From a report on canteen use:\n\n“The school canteen serves about 620 meals on a normal school day. On days when the whole of Form 6 is away on study leave, that figure falls to roughly 480.”',
    q: 'What can reasonably be worked out from these two figures?',
    o: [
      'Form 6 accounts for roughly 140 of the meals served on a normal day.',
      'Form 6 students eat more meals each than students in other year groups.',
      'The canteen serves 480 meals on every day of the school year.',
      'The canteen loses money whenever Form 6 is on study leave.',
    ],
    e: 'The only figure the passage supports is the difference between the two numbers: 620 − 480 = 140, which is the share attributable to Form 6. Nothing is said about how much each individual eats, so no comparison between year groups can be drawn. The figure 480 applies only to study-leave days, not to every day. Profit and loss are never mentioned, so the last option imports information from outside the text. Stay inside what the figures actually state.',
  },
  {
    t: 'read',
    stim: 'ADVERTISEMENT\n\nPart-time tutor wanted. Two evenings a week, 7:00–9:00 p.m. Applicants must have completed Form 6. Experience of tutoring is preferred but not essential. Please email a short self-introduction to the address below.',
    q: 'Which applicant clearly meets the stated requirements?',
    o: [
      'A Form 6 graduate with no tutoring experience who is free on two evenings.',
      'A Form 4 student with two years of tutoring experience.',
      'A Form 6 graduate who is available only on weekend mornings.',
      'A university student with experience who can work four afternoons a week.',
    ],
    e: 'The advertisement separates a requirement from a preference. Completing Form 6 and being free on two evenings are stated requirements; tutoring experience is only “preferred but not essential”, so its absence does not disqualify anyone. The Form 4 applicant fails the education requirement however much experience they have. The remaining two applicants are free at the wrong times. Distinguish “must” from “preferred” — the examiners build the distractors on exactly that difference.',
  },

  // ── Genre, Tone & Register 4 ─────────────────────────────────────────────
  {
    t: 'genre',
    stim: 'You have been asked to write a letter to the editor of a local newspaper arguing that more covered walkways are needed near schools in your district.',
    q: 'Which opening sentence best suits this text type?',
    o: [
      'I am writing to urge the authorities to build more covered walkways near schools in our district.',
      'Hi there! Just wanted to say the walkway situation round here is a total mess.',
      'Once upon a time there were no covered walkways in the district at all.',
      'Please find attached the construction budget for the proposed walkways for your approval.',
    ],
    e: 'A letter to the editor is a formal public text with a stated position, and the first option opens with the writer’s purpose in a formal register. The second is conversational and would not be printed. The third borrows the opening of a story, which belongs to narrative writing rather than argument. The fourth is the covering note of a business document and assumes a working relationship the writer does not have with a newspaper editor. Match the opening to the text type, the audience and the purpose together.',
  },
  {
    t: 'genre',
    stim: 'You are to write a speech to be delivered by a student representative at your school’s Speech Day.',
    q: 'Which feature would you expect the finished text to contain?',
    o: [
      'Direct address to those present, such as “Principal, teachers and fellow students”.',
      'Column headings and figures arranged in a table.',
      'A list of references in alphabetical order at the end.',
      'A subject line and a “Re:” field at the top.',
    ],
    e: 'A speech is spoken to an audience who are physically present, so direct address at the start is the defining convention. Tables belong to reports, reference lists to academic writing, and a subject line to an email or memo. Candidates lose marks in Paper 2 for producing content that is sound but formatted as the wrong text type, so decide the conventions before you begin drafting.',
  },
  {
    t: 'genre',
    stim: 'A shop replies to a customer:\n\n“We are sorry that the jacket reached you damaged. A replacement was posted this morning, and you will not be charged for the return postage.”',
    q: 'What is the tone of this reply?',
    o: ['Apologetic and helpful', 'Defensive and reluctant', 'Casual and joking', 'Angry and accusing'],
    e: 'The reply opens with an apology and then offers two concrete remedies, so the tone is apologetic and helpful. A defensive reply would explain why the shop was not at fault, and a reluctant one would offer the least it could. Nothing here is humorous, and no blame is placed on the customer. Tone is judged from what the writer does as well as what they say — here, acting to put the problem right sets the tone as much as the word “sorry”.',
  },
  {
    t: 'genre',
    stim: 'A student is writing a formal email to a company to request sponsorship for the school’s charity run.',
    q: 'Which sentence is written in an appropriate register?',
    o: [
      'We should be most grateful if your company would consider sponsoring our charity run.',
      'Give us some money for our charity run, thanks a lot.',
      'You guys should totally sponsor us, it would be so good for your image.',
      'Sponsor us, or we will approach another company instead.',
    ],
    e: 'A request to an organisation the writer does not know calls for a formal, courteous register, and the first option uses a standard polite request form. The second is blunt and treats a request as an instruction. The third uses conversational language unsuited to a business email. The fourth adds an implied threat, which is inappropriate whatever the register. Politeness and formality are marked in Paper 2 as part of the task, not as an optional extra.',
  },

  // ── Integrated Skills 4 ──────────────────────────────────────────────────
  {
    t: 'integ',
    stim: 'Paper 3 task:\n\n“You are the chairperson of the Environmental Club. Write a proposal to the Principal suggesting how the school could reduce its electricity consumption.”',
    q: 'Who is the intended audience, and what does that mean for the writing?',
    o: [
      'The Principal — so the register should be formal and the suggestions practical and costed.',
      'Fellow club members — so informal language and shared jokes are acceptable.',
      'The general public — so no background about the school is needed.',
      'The examiner — so the stated audience can safely be ignored.',
    ],
    e: 'Paper 3 always names an audience, and the named audience here is the Principal — a senior reader who will judge whether the suggestions can actually be carried out. That sets both the register and the kind of content required. Writing for club members would lower the register wrongly. Writing for the general public would remove the school-specific detail the Principal needs. The last option describes a common and costly error: the examiner marks how well you addressed the stated audience, so ignoring it loses marks directly.',
  },
  {
    t: 'integ',
    stim: 'Paper 3 task: “Write a proposal to the Principal on reducing electricity consumption.”',
    q: 'Which layout feature is expected in a proposal?',
    o: [
      'A title and clear section headings such as “Background”, “Suggestions” and “Expected benefits”.',
      'A greeting such as “Dear Diary” followed by the day’s date.',
      'A rhyming refrain repeated at the end of each section.',
      'A cast list naming the speakers before the first paragraph.',
    ],
    e: 'A proposal is a structured document, and headings that separate the situation, the recommendations and their benefits are its defining layout feature. A diary entry, a poem and a play script each have their own conventions, and using them here would signal the wrong text type at first glance. In Paper 3 the format mark is awarded for these visible conventions, so set the headings out before writing the content.',
  },
  {
    t: 'integ',
    stim: 'Your Paper 3 data file contains five separate pieces of information. On reading the task, you find that only three of them relate to what you have been asked to write.',
    q: 'What should you do with the remaining two?',
    o: [
      'Leave them out — including material the task does not call for weakens the response.',
      'Include them anyway, to show the marker that you read the whole data file.',
      'Reinterpret the task so that all five pieces can be used.',
      'Place them in a footnote at the end of the response.',
    ],
    e: 'Selecting from the data file is itself part of what Paper 3 assesses; a response that uses everything shows no selection has taken place. Padding the answer with irrelevant material dilutes the argument and costs marks for content and coherence. Rewriting the task in your head is worse, because the response then answers a question that was never set. Footnotes are not a convention of the text types Paper 3 asks for. Read the task first, then return to the data file knowing what you are looking for.',
  },
  {
    t: 'integ',
    stim: 'In Paper 3 you hear the recorded material and are allowed to take notes while listening.',
    q: 'Which note-taking approach is the most useful?',
    o: [
      'Write short key words and figures that can be expanded once the recording ends.',
      'Try to write down every word the speaker says, in full sentences.',
      'Write nothing during the recording and rely on memory afterwards.',
      'Copy out the task instructions instead, to save time later.',
    ],
    e: 'Notes exist to hold the information the ear cannot retain — names, numbers, and the shape of an argument. Key words are fast enough to keep pace with the speaker and are all that is needed to reconstruct the point afterwards. Attempting full sentences guarantees falling behind and missing the next item. Relying on memory fails as soon as several figures are given. Copying the instructions uses listening time on text that is already printed in front of you.',
  },

  // ── DSE Paper 1 Reading 3 ────────────────────────────────────────────────
  {
    t: 'p1r',
    stim: '“Kelvin checked the noticeboard three times that morning. The list still was not there. By lunchtime he had stopped looking, and was telling everyone that he had never really wanted the place anyway.”',
    q: 'What does the last sentence most likely suggest about Kelvin?',
    o: [
      'He is covering up his disappointment.',
      'He genuinely had no interest in the place.',
      'He has already been offered the place.',
      'He has forgotten what the list was for.',
    ],
    e: 'The behaviour described in the first two sentences — checking three times in one morning — shows how much Kelvin wanted the place. What he says at lunchtime contradicts what he has been doing, and the reader is meant to trust the actions rather than the words. Taking the last sentence at face value gives the second option, which is exactly the trap. The third and fourth options require information the passage never supplies. Where actions and statements conflict, the conflict itself is the point.',
  },
  {
    t: 'p1r',
    stim: '“The rain had stopped some minutes earlier, but the umbrellas stayed up all the way down the queue — nobody wanted to be the first to trust the sky.”',
    q: 'Why are the umbrellas still up?',
    o: [
      'The people in the queue are not yet convinced the rain has finished.',
      'The rain is in fact still falling heavily.',
      'The umbrellas have jammed and cannot be closed.',
      'The queue is moving too quickly for anyone to close them.',
    ],
    e: 'The dash introduces the explanation, and the phrase “trust the sky” gives the reason directly: the queue doubts the weather will hold. The second option contradicts the opening clause, which states plainly that the rain had stopped. The third and fourth invent mechanical and practical reasons the text does not mention. When a sentence supplies its own explanation after a dash or a colon, the answer is usually there rather than in the reader’s inference.',
  },
  {
    t: 'p1r',
    stim: '“Mrs Chan read the report card twice, folded it, and put it into her bag without a word. On the bus home she asked Ian what he would like for dinner.”',
    q: 'What does Mrs Chan’s behaviour most likely show?',
    o: [
      'She has decided not to discuss the report card at that moment.',
      'She did not understand what the report card said.',
      'She was delighted by the results and said so at once.',
      'She has lost interest in how Ian is doing at school.',
    ],
    e: 'Reading the card twice shows close attention, and folding it away without speaking shows a deliberate choice to hold back rather than an absence of reaction. Turning to an ordinary question about dinner keeps the silence going. Reading it twice rules out both incomprehension and indifference. Nothing is said aloud, so the option about being delighted contradicts “without a word”. Silence in a narrative is usually a decision, not an emptiness — ask what the character is choosing not to do.',
  },

  // ── Reading · Vocabulary & Reference 3 ───────────────────────────────────
  {
    t: 'p1vr',
    stim: '“The school introduced a no-phone rule in September. It has not been popular with students, but borrowing from the library has almost doubled since then.”',
    q: 'In the second sentence, what does “It” refer to?',
    o: ['The no-phone rule', 'September', 'The library', 'Borrowing from the library'],
    e: 'A pronoun normally refers back to the most recent noun phrase that fits the sense, and only the rule can be described as unpopular with students. “September” is a time reference and cannot be popular or unpopular. The library and the borrowing both appear after “It”, so neither can be what it points back to. Test a reference answer by substituting it into the sentence: “The no-phone rule has not been popular” reads correctly, and the others do not.',
  },
  {
    t: 'p1vr',
    stim: '“Volunteers cleared the beach on Sunday morning. Many of them had never taken part in a clean-up before, and several said they would return next month.”',
    q: 'Who does “them” refer to?',
    o: [
      'The volunteers who cleared the beach',
      'The organisers who arranged the clean-up',
      'The residents who live near the beach',
      'Only those who said they would return next month',
    ],
    e: 'The only group named before the pronoun is the volunteers, and “many of them” selects a part of that group. Organisers and residents never appear in the passage, so both options add people the text does not mention. The last option reverses the logic: those returning next month are a subset picked out later, not the group “them” refers to. Always look backwards from the pronoun to the nearest group it can sensibly stand for.',
  },
  {
    t: 'p1vr',
    stim: '“The proposal was shelved after the committee failed to reach agreement on how it would be paid for.”',
    q: 'In this sentence, “shelved” means —',
    o: [
      'put aside without a decision being taken',
      'approved and put into effect immediately',
      'stored physically on a shelf in an office',
      'rejected permanently and beyond appeal',
    ],
    e: '“Shelved” is used figuratively here: the proposal has been set aside because no decision could be reached, and it may be taken up again. The literal meaning about a physical shelf is the trap the metaphor is built on, and it makes no sense of a proposal. “Approved immediately” contradicts the failure to agree. “Rejected permanently” is too strong — shelving leaves the matter open, which is precisely the difference between the two words. Check how strong a word is, not only its general direction.',
  },
]

// ── 組裝 ────────────────────────────────────────────────────────────────────
// 正解位置按 0→1→2→3 輪轉，避免任何一個位置成為「安全選擇」。
const rotate = <X,>(arr: X[], k: number) =>
  arr.slice(-k % arr.length || arr.length).concat(arr.slice(0, -k % arr.length || arr.length))

const m = (s: string): P => [s, s] // 語言科慣例：英文欄重複同一串

const rows = QS.map((qq, i) => {
  const [tid, tlabel] = T[qq.t]
  const k = i % 4
  const opts = rotate(qq.o, k)
  const stem = qq.stim ? `${qq.stim}\n\n${qq.q}` : qq.q
  return {
    id: `en_floor_${String(i + 1).padStart(2, '0')}`,
    type: 'mc',
    subject: 'english',
    topic: tlabel, topicId: tid, topicZh: tlabel, topicEn: tlabel,
    difficulty: 'basic',
    question: m(stem)[0], questionEn: m(stem)[1],
    options: opts.map((o) => m(o)[0]), optionsEn: opts.map((o) => m(o)[1]),
    correctIndex: k,
    explanation: m(qq.e)[0], explanationEn: m(qq.e)[1],
  }
})

const OUT = 'scripts/qbank/drafts/english-floor.json'
writeFileSync(OUT, JSON.stringify(rows, null, 2) + '\n')
console.log(`✅ ${rows.length} 條容易題 → ${OUT}`)
const byT: Record<string, number> = {}
for (const qq of QS) byT[T[qq.t][1]] = (byT[T[qq.t][1]] ?? 0) + 1
console.log('   課題分佈', JSON.stringify(byT, null, 0))
