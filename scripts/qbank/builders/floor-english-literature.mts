// ============================================================================
// floor-english-literature.mts —— Literature in English「補底」容易題草稿
// ----------------------------------------------------------------------------
// 英語文學 127 條 MC 之中，容易題【只得 2 條】。練習引擎一節按 3:5:2 抽 6 易，
// 實際永遠派得出同兩條，之後靠中／難題補位 —— 學生一開波就撞牆。
//
// 真實卷面（HKEAA 2027 大綱）：卷一論文寫作 50%（3 小時；小說、戲劇、短篇小說
// 比較各一題）、卷二賞析 30%（2 小時；指定篇章、指定詩作、**未見過的詩作**）
// —— 全卷無多項選擇題。
//
// ── 本批的取向：由「認得個名」轉為「讀得出文本」 ───────────────────────────
// 現有題庫幾乎全部是術語定義題（「甚麼是 volta」「甚麼是 foil」）。認得術語是
// 入場券，但卷二真正要求的是：面對一段【未見過】的文字，指出哪一處在起作用、
// 以及它造成甚麼效果。所以本批 36 條全部是【短文本應用題】：先給一兩行原創
// 選段，再問一個一步到位的問題。
//
// 「容易」的界定：答案必須可在選段之內指得出來 —— 一個詞、一個標點、一處排版。
// 唔係要學生猜作者心意，而係要佢養成「先睇文本再落判斷」的習慣。
//
// ── 版權（憲章 §4） ──────────────────────────────────────────────────────
// 一切現代選段均為【原創撰寫】，不引用任何在版權期內的作品。
// 只有莎士比亞題引用其原文 —— 該等文本已屬公有領域（作者卒於 1616 年）。
//
// ── 干擾項的設計原則 ─────────────────────────────────────────────────────
// 干擾項一律取材自考生的【真實誤解】，而非明顯荒謬的選項：
//   · 把敘述者當作作者本人
//   · 把 dramatic irony 當成 verbal irony
//   · 以為「conflict」必定是有人吵架
//   · 以為引用了原文就等於做了分析
//   · 以為舞台指示只是給導演看、不必分析
// 揀錯的學生，應該即刻知道自己混淆了哪兩樣東西。
//
// 語言科慣例：英文欄重複同一串（`m(s)=[s,s]`），全卷以英文命題。
// ============================================================================
import { writeFileSync } from 'node:fs'

type P = [zh: string, en: string]
interface Q { t: keyof typeof T; stim?: string; q: string; o: string[]; e: string }

const T = {
  poetry:    ['poetry',           'Poetry',            'Poetry'],
  drama:     ['drama',            'Drama',             'Drama'],
  prose:     ['prose_fiction',    'Prose Fiction',     'Prose Fiction'],
  devices:   ['devices',          'Literary Devices',  'Literary Devices'],
  character: ['characterisation', 'Characterisation',  'Characterisation'],
  themes:    ['themes',           'Themes',            'Themes'],
  shake:     ['shakespeare',      'Shakespeare',       'Shakespeare'],
  crit:      ['criticism',        'Criticism',         'Criticism'],
} as const

const QS: Q[] = [
  // ── Poetry ────────────────────────────────────────────────────────────────
  {
    t: 'poetry',
    stim: '“The harbour lights came on at seven, / the ferry pulled against the tide, / my mother said we’d wait till eleven, / and watched the water from my side.”',
    q: 'What is the rhyme scheme of this stanza?',
    o: ['ABAB', 'AABB', 'ABBA', 'ABCB'],
    e: 'Match the end words in order: “seven” and “eleven” rhyme, and so do “tide” and “side”. The rhyming pairs alternate — first with third, second with fourth — which is written ABAB. AABB would need the rhymes to fall in adjacent pairs, and ABBA would need the outer two lines to rhyme with each other while the inner two rhyme separately. Always letter the end words before choosing; guessing from the look of the stanza is where marks go.',
  },
  {
    t: 'poetry',
    stim: '“Wait, he said. Wait. / And I waited, and the light went, and still: wait.”',
    q: 'Which feature of these lines is most prominent, and what does it convey?',
    o: [
      'repetition of “wait”, which stretches out how long the waiting felt',
      'alliteration on the letter w, which makes the speaker sound harsh',
      'rhyme between the two lines, which gives them a song-like lilt',
      'a simile comparing the fading light to the act of waiting',
    ],
    e: 'The word “wait” returns four times in two lines, and each return leaves the speaker where they were — that is what makes the waiting feel long. The other three can be checked against the text and ruled out: “wait” and “went” alone are too few for alliteration to be the point, the line endings do not rhyme, and no comparison is made using “like” or “as”. Name the feature only after you have found it on the page.',
  },
  {
    t: 'poetry',
    stim: '“The bread had gone hard; the kitchen smelled of yesterday’s rain.”',
    q: 'The imagery in this line appeals mainly to which senses?',
    o: ['touch and smell', 'sight and hearing', 'hearing and taste', 'sight only'],
    e: '“Gone hard” is something you register by touching, and “smelled” names the sense outright. Note the common assumption that imagery must be visual — it is not: writers reach for smell and touch precisely because those senses carry memory. Nothing here is heard, and while bread suggests taste, the line never describes a flavour.',
  },
  {
    t: 'poetry',
    stim: '“She opened the letter and read that her son / was coming home.”',
    q: 'The sentence runs over the line ending. What does that break do?',
    o: [
      'it holds the reader for a moment before the news arrives',
      'it shows the poet ran out of room at the end of the line',
      'it marks the end of the stanza and the start of a new one',
      'it instructs the reader to pause and take a breath there',
    ],
    e: 'Breaking after “her son” suspends the sentence at its most uncertain point, so “was coming home” lands with weight when it finally comes. Line endings in verse are chosen, not forced — the page has room for more words, and the poet declined to use it. Note also that a run-on line does the opposite of asking for a pause: the sense pulls the reader across the gap.',
  },
  {
    t: 'poetry',
    stim: '“They called it a garden. Four pots on a fire escape.”',
    q: 'What does the second sentence do to the first?',
    o: [
      'it undercuts it, showing the “garden” is far smaller than the word suggests',
      'it expands it, adding further detail about how large the garden was',
      'it confirms it, showing that the speaker admires the garden greatly',
      'it relocates it, showing that the poem is set in the countryside',
    ],
    e: 'The gap between the word “garden” and the four pots that answer it is the whole point; the speaker never says “it was not really a garden” because the second sentence has already said it. This is irony working through arrangement rather than through any single word, and the distance between “they called it” and what it actually was is where the feeling sits.',
  },

  // ── Drama ─────────────────────────────────────────────────────────────────
  {
    t: 'drama',
    stim: 'MEI: (not looking up) It’s fine. Take it.',
    q: 'What does the stage direction add to the spoken line?',
    o: [
      'it shows Mei’s words and her manner do not match, so “fine” may not be meant',
      'it tells the actor to raise the volume of the line when speaking it',
      'it explains an event that happened before this scene began',
      'it is a note for the printer and not part of the play to analyse',
    ],
    e: 'On the page the words say one thing and the body says another, and that gap is where the meaning of the moment sits. Stage directions are written by the playwright and belong to the text — treating them as if only the director need read them throws away evidence you are entitled to quote in Paper 1. Nothing here concerns volume or earlier events.',
  },
  {
    t: 'drama',
    stim: 'LAM: (to the audience) He has already spent the money. / CHAN: You look pale. Sit down.',
    q: 'Which statement about Lam’s line is correct?',
    o: [
      'Chan does not hear it; it is directed to the audience alone',
      'Chan hears it clearly and chooses to say nothing about it',
      'it is spoken by a narrator standing outside the action',
      'it is a stage direction rather than a line of dialogue',
    ],
    e: 'The bracketed instruction fixes who is being addressed, and Chan’s reply shows no sign of having heard: he responds to how Lam looks, not to what Lam has just said. A remark of this kind lets a character tell the audience something the others on stage do not know — which is exactly how a playwright builds a gap between what we know and what they know.',
  },
  {
    t: 'drama',
    stim: 'The audience has just watched Tsang hide a letter. Wong now enters and says: “Nobody has touched anything in this room.”',
    q: 'What does the audience’s extra knowledge create at this moment?',
    o: [
      'dramatic irony — we know Wong is wrong, and we watch him act on it',
      'verbal irony — Wong means the opposite of the words he speaks',
      'suspense — the audience is waiting to learn what the letter says',
      'nothing yet — the audience must be told before any effect can arise',
    ],
    e: 'The distinction turns on who knows what. Wong believes what he says, so he is not being ironic; the irony belongs to the audience, who saw the letter hidden. Verbal irony would require Wong himself to intend the opposite of his words. Mixing up these two is one of the commonest errors in writing about drama, and it changes the whole reading of the scene.',
  },
  {
    t: 'drama',
    stim: 'YIU: I could take the job in Shenzhen. / YIU: (pause) And leave her here alone.',
    q: 'What kind of conflict do these two lines present?',
    o: [
      'internal conflict, between two things Yiu wants at the same time',
      'external conflict, between Yiu and another character on stage',
      'external conflict, between Yiu and a force of nature',
      'no conflict at all, because nobody is arguing with anyone',
    ],
    e: 'Both lines are Yiu’s, and the pause between them is where the pull happens: the job draws one way, the person left behind draws the other. Note that conflict in drama does not require a quarrel — the fact that no one raises their voice here is precisely what makes the moment work. A scene with a single character on stage can carry as much conflict as a scene with six.',
  },
  {
    t: 'drama',
    stim: 'FATHER: Did you pass? / (Long silence.) / FATHER: Right.',
    q: 'What does the silence do here?',
    o: [
      'it answers the question, and the father’s “Right” shows he has understood',
      'it shows that the actor has forgotten the next line of the script',
      'it gives the audience a moment to look through the programme',
      'it signals that the scene has finished and the lights will go down',
    ],
    e: 'The father asks, receives no words, and replies as though he has been told — because he has. A silence written into the script is a piece of dialogue: it is chosen, timed and placed, and it can carry what a character cannot bring themselves to say. Quote it as evidence exactly as you would quote a line.',
  },

  // ── Prose Fiction ─────────────────────────────────────────────────────────
  {
    t: 'prose',
    stim: '“I did not tell them about the phone call. I told myself there would be a better moment.”',
    q: 'Which point of view is used, and what follows from it?',
    o: [
      'first person — we are given only what this narrator chooses to tell',
      'third-person omniscient — we are given every character’s thoughts',
      'third-person limited — we follow one character from the outside',
      'second person — the narrator is addressing the reader directly',
    ],
    e: 'The pronoun “I” settles the point of view, but the useful half of the answer is what it costs us: everything reaches the reader through one person, including the silence about the phone call. That is not a flaw to complain about — it is the writer choosing what we may and may not see, and it is worth saying so in an essay.',
  },
  {
    t: 'prose',
    stim: '“I only borrowed it. She would have said yes. She always says yes.”',
    q: 'What does the repetition in these lines suggest about the narrator?',
    o: [
      'the narrator is arguing with themself, so the claim should not be taken at face value',
      'the narrator is stating settled facts and is entirely certain of them',
      'the narrator is addressing a crowd and repeating for their benefit',
      'the narrator has a weak memory and repeats things by accident',
    ],
    e: 'Nobody restates a permission they are sure of. Each sentence reaches for firmer ground than the one before — “only borrowed”, then “would have”, then “always” — and the reaching is what gives the narrator away. Reading a first-person narrator means weighing what they say against how they say it, not simply accepting the account.',
  },
  {
    t: 'prose',
    stim: '“The flat had been repainted, but the smell of the old tenants’ cooking came back every time it rained.”',
    q: 'What is the setting doing here, beyond telling us where the story takes place?',
    o: [
      'suggesting that what came before has not really been covered over',
      'supplying factual background only, with no bearing on the meaning',
      'establishing the exact year in which the events are taking place',
      'showing that the narrator dislikes the smell of other people’s food',
    ],
    e: 'Fresh paint over a smell that keeps returning is a physical fact doing a second job. Note the assumption to avoid: description is not neutral scene-setting that can be skimmed on the way to the plot. When a detail is given room, ask what it is placed there to carry.',
  },
  {
    t: 'prose',
    stim: '“He signed the form. Twenty years earlier, in a room like this one, his mother had signed another.”',
    q: 'What does the second sentence do?',
    o: [
      'it moves back in time, setting the present act against an earlier one',
      'it moves forward in time, predicting what will happen after this',
      'it shows that the two signings are happening at the same moment',
      'it shows the narrator has lost track of the order of the events',
    ],
    e: '“Twenty years earlier” fixes the direction of the move, and the past-perfect “had signed” confirms it. The reason for the jump matters as much as the jump: placing the mother’s signature beside the son’s invites us to read one through the other. When you meet a shift in time, ask what the two moments are being made to say about each other.',
  },
  {
    t: 'prose',
    stim: 'Two versions of the same moment — (i) “She was nervous.” (ii) “She checked the lock, walked to the lift, then came back and checked it again.”',
    q: 'What is the difference between the two versions?',
    o: [
      'the first tells the reader the feeling; the second shows it and lets us conclude',
      'the second is simply longer and carries exactly the same information',
      'the first is stronger because it is direct and cannot be misunderstood',
      'the second is weaker because it never actually names the feeling at all',
    ],
    e: 'The second version never uses the word “nervous”, yet the returning to the lock puts the reader in the position of noticing it — and a reader who notices is more convinced than a reader who is told. This is why quoting an action often makes better evidence in an essay than quoting a stated feeling: the action is what the writer built, and it can be analysed.',
  },

  // ── Literary Devices ──────────────────────────────────────────────────────
  {
    t: 'devices',
    stim: '“The exam paper stared back at me.”',
    q: 'The device here is personification. What does it achieve?',
    o: [
      'it makes the paper feel active and confronting, conveying the candidate’s dread',
      'it states a plain fact about how the printed paper looked on the desk',
      'it compares the paper to a person by means of the word “like” or “as”',
      'it exaggerates the situation for a comic effect the reader will smile at',
    ],
    e: 'Giving the paper the power to stare turns the candidate from the one doing the looking into the one being looked at, and the reversal is the feeling. Naming the device earns little on its own; the marks are in what it does to the reader. Note that a comparison using “like” or “as” would be a simile, and deliberate overstatement would be hyperbole — different devices, different effects.',
  },
  {
    t: 'devices',
    stim: '“A thousand small delays, and then the year was over.”',
    q: 'Which device is used, and what is its effect?',
    o: [
      'hyperbole — the overstatement conveys how relentless the delays felt',
      'understatement — the phrasing plays down how much time was lost',
      'simile — the year is directly compared to a thousand small delays',
      'onomatopoeia — the words imitate the sound of time passing by',
    ],
    e: '“A thousand” is not a count; it is a way of saying the delays were beyond counting, and the exaggeration carries the exhaustion that a precise number would not. Understatement would work in the opposite direction, a simile would need “like” or “as”, and onomatopoeia requires words that imitate sounds. Say which device, then say what the exaggeration is for.',
  },
  {
    t: 'devices',
    stim: '“The wedding photographs were still on the wall. The suitcases were by the door.”',
    q: 'How do the two sentences work together?',
    o: [
      'they are set side by side so that the contrast between them does the work',
      'the second sentence restates the first one using a different set of words',
      'the second sentence is a simile that stands as an image for the first',
      'they are unrelated details of the room and carry no particular meaning',
    ],
    e: 'Nothing is explained: the photographs point back, the suitcases point away, and the reader supplies the marriage in between. Placing two things together and refusing to comment is itself a technique — and in an essay it is worth saying that the writer withholds the explanation, because the withholding is part of the effect.',
  },

  // ── Characterisation ──────────────────────────────────────────────────────
  {
    t: 'character',
    stim: '“Ho paid for the tea before anyone else reached for a wallet, and did not mention it again.”',
    q: 'What does this sentence show about Ho, and by what means?',
    o: [
      'that Ho is generous and does not seek credit — shown indirectly, through action',
      'that Ho is generous — stated directly, because the writer says so outright',
      'that Ho is wealthy, which is the only conclusion the sentence supports',
      'nothing at all, since the writer has not told us what Ho is like',
    ],
    e: 'Two actions are given and no trait is named: paying first, and then letting it drop. The second half is what makes the reading precise — many people pay, fewer say nothing afterwards. Note the assumption to resist: character is not confined to what the narrator states. Most of what you can prove about a character in an essay comes from what they do.',
  },
  {
    t: 'character',
    stim: '“How was it?” / “Fine.” / “And the interview?” / “I said fine.”',
    q: 'What does the second speaker’s manner suggest?',
    o: [
      'that they do not want to talk about it, and are closing the subject down',
      'that they were pleased with the interview and are being modest about it',
      'that they did not hear the second question and are answering the first',
      'that they are speaking to a stranger and so are being careful and polite',
    ],
    e: '“I said fine” refuses the second question by pointing back at the first — a reply that answers nothing while sounding like an answer. The length of the replies is evidence too: two words against a question that invited more. In drama and fiction alike, how little a character says can carry as much as what they say.',
  },
  {
    t: 'character',
    stim: '“Ka-yan checks the timetable three times before leaving. Her brother has never once known which platform he needs.”',
    q: 'Why might a writer place these two characters side by side?',
    o: [
      'so that each throws the other into relief and the contrast sharpens both',
      'to establish that the brother is the more important of the two characters',
      'to fill the space with detail before the main action of the story begins',
      'because two characters described together must later become enemies',
    ],
    e: 'Set against her brother, Ka-yan’s checking looks like anxiety rather than mere habit; set against her, his vagueness looks like ease rather than carelessness. Neither reading is available from one character alone. When two characters are introduced in the same breath, ask what each lets you see in the other.',
  },
  {
    t: 'character',
    stim: '“Sum returned the wallet, then stood outside the shop for a while before going in.”',
    q: 'Which question asks about Sum’s motivation?',
    o: [
      'Why did Sum wait outside before going into the shop?',
      'What was the object that Sum returned to the shop?',
      'Where was Sum standing before entering the shop?',
      'When did Sum finally go inside the shop that day?',
    ],
    e: 'Motivation is the reason behind an action, so it is reached by asking why. What, where and when recover the events, and an essay that answers only those has retold the story rather than examined it. The waiting is the detail worth asking about: the wallet was already returned, so something else kept Sum outside.',
  },
  {
    t: 'character',
    stim: 'In the first chapter Wai refuses to speak in class. By the final chapter she is the one asking the questions.',
    q: 'What does this tell us about Wai as a character?',
    o: [
      'she is a character who changes over the course of the story',
      'she is a minor character with little bearing on the plot',
      'she is a character defined throughout by a single trait',
      'the writer has been inconsistent in describing her',
    ],
    e: 'The two chapters are being compared for a reason: the same situation, the opposite behaviour. A character who ends elsewhere from where they began gives an essay its natural shape — you can trace the turning. Note that a change of this kind is not an inconsistency to be corrected; it is usually the point of the book.',
  },

  // ── Themes ────────────────────────────────────────────────────────────────
  {
    t: 'themes',
    stim: 'A novel follows two brothers who stop speaking to each other after their father’s shop closes down.',
    q: 'Which of these is a statement of theme rather than a subject?',
    o: [
      'Shared loss can drive people apart as easily as it can draw them together.',
      'Family relationships between brothers in a Hong Kong setting.',
      'The closing down of the father’s shop and what followed.',
      'Two brothers who stop speaking to each other for years.',
    ],
    e: 'A subject can be named in a phrase; a theme has to be said in a sentence, because it makes a claim. “Family” tells a reader what the book is about, not what the book holds to be true about it. When you write a theme statement, check that it could be argued with — if nobody could disagree, it is a subject.',
  },
  {
    t: 'themes',
    stim: 'Throughout a story, a character keeps a broken watch in her pocket and refuses to have it mended.',
    q: 'What is the most reasonable way to read the watch?',
    o: [
      'as a symbol whose meaning comes from the way this story uses it',
      'as a symbol carrying one fixed meaning that all watches carry',
      'as a realistic detail that carries no significance whatsoever',
      'as foreshadowing, since it predicts a later event exactly',
    ],
    e: 'The refusal to mend it is what makes the watch mean anything; a working watch in a pocket would pass unnoticed. Note both errors to avoid: symbols do not come with fixed meanings looked up from a list, and not every object in a story is one. Evidence for a symbolic reading is the text’s own insistence — it keeps coming back.',
  },
  {
    t: 'themes',
    stim: 'In six different chapters of a novel, doors are described as closed, locked or jammed.',
    q: 'What is this recurring detail called, and what does it do?',
    o: [
      'a motif — its repetition accumulates and builds towards a theme',
      'a symbol — a single object standing for one particular idea',
      'a subplot — a separate strand of story running alongside',
      'a coincidence — repeated details in fiction are accidental',
    ],
    e: 'One locked door is an event; six across a book is a pattern, and patterns in fiction are placed. The distinction from a symbol is repetition: a motif works by recurring until the reader begins to expect it. Note that nothing in a finished novel is accidental in this sense — the writer chose to describe the doors that way each time.',
  },
  {
    t: 'themes',
    stim: 'A student writes: “This story is about how ambition isolates people.”',
    q: 'What must the student do next in an essay?',
    o: [
      'point to places in the text where ambition leads the character away from others',
      'state the same claim again in stronger and more confident wording',
      'summarise the events of the whole story in the order they occur',
      'explain what the author intended the reader to feel while reading',
    ],
    e: 'The claim is a good one, and a claim without textual evidence earns little however good it is. Note two familiar detours: restating a point more loudly does not support it, and retelling the plot shows only that the book has been read. What the author intended is unknowable and, in any case, not what is being marked — the text is.',
  },
  {
    t: 'themes',
    stim: 'A short story is titled “The Spare Key”. The key itself is mentioned only twice.',
    q: 'What does the title suggest about how the story should be read?',
    o: [
      'that the key matters more than its two mentions would suggest on their own',
      'that the key is unimportant, since it appears only twice in the whole story',
      'that the title is a mistake, because a title should name the main character',
      'that the title is there to tell the reader which genre the story belongs to',
    ],
    e: 'A title is the one piece of the text the writer places outside the story to point back at it, so a title naming an object that barely appears is an instruction to look harder at that object. Frequency is a poor guide to importance: a detail mentioned twice at the right two moments can carry the whole story.',
  },

  // ── Shakespeare （公有領域原文） ────────────────────────────────────────────
  {
    t: 'shake',
    stim: '【Romeo and Juliet】 “O Romeo, Romeo! wherefore art thou Romeo?”',
    q: 'What does “wherefore” mean in this line?',
    o: [
      '“why” — for what reason',
      '“where” — in what place',
      '“whether” — if or not',
      '“therefore” — for that reason',
    ],
    e: 'Juliet is not looking for Romeo — she knows he is a Montague and is asking why he has to be one. Reading “wherefore” as “where” turns a speech about the trap of family names into a search for someone in the dark, which is the single most common misreading of the play. The “-fore” ending is the same as in “therefore”, meaning “for what reason”.',
  },
  {
    t: 'shake',
    stim: '【Hamlet】 “I am thy father’s spirit.”',
    q: 'In Shakespeare’s English, what does “thy” mean here?',
    o: [
      '“your” — belonging to the person being spoken to',
      '“my” — belonging to the speaker of the line',
      '“his” — belonging to some third person',
      '“their” — belonging to more than one person',
    ],
    e: '“Thy” is the possessive belonging with “thou” and “thee”, so it means “your” when addressing one person. Setting these out once saves trouble in the exam: thou = you (as subject), thee = you (as object), thy or thine = your. The Ghost is telling Hamlet whose spirit it is, which only makes sense if the word points to Hamlet, not to the speaker.',
  },
  {
    t: 'shake',
    stim: 'On the page, a character’s lines each begin with a capital letter and stop well short of the right-hand margin, while another character’s lines run right across the page.',
    q: 'What does this difference in layout tell you?',
    o: [
      'the first character is speaking in verse and the second in prose',
      'the first character is whispering and the second is speaking aloud',
      'the first passage is a stage direction and the second is dialogue',
      'the first passage is a song and is meant to be sung by the actor',
    ],
    e: 'Verse is set out in measured lines, so it ends where the metre ends rather than where the page does; prose runs on to the margin like ordinary writing. This is worth noticing before reading a word, because Shakespeare moves between the two, and a character shifting from verse to prose — or the reverse — is doing something the layout announces.',
  },
  {
    t: 'shake',
    stim: '【Romeo and Juliet】 “’Tis but thy name that is my enemy.”',
    q: 'What does “but” mean in this line?',
    o: [
      '“only” — nothing more than that',
      '“however” — introducing a contrast',
      '“except for” — leaving that aside',
      '“almost” — very nearly but not quite',
    ],
    e: 'The sense is “it is only your name that is my enemy” — Juliet is narrowing the quarrel down to a single thing, not raising an objection. “But” meaning “only” is everywhere in Shakespeare, and reading it as the modern contrast word turns clear lines into confusing ones. When “but” appears where a contrast makes no sense, try “only” first.',
  },
  {
    t: 'shake',
    stim: 'Shakespeare’s plays were performed in the open air, in daylight, with almost no scenery on the stage.',
    q: 'Which consequence follows for the language of the plays?',
    o: [
      'the characters’ own words must tell the audience the place and the time of day',
      'the plays have to be considerably shorter than plays written for modern stages',
      'the plays contain no description of setting, since there was nothing to describe',
      'the audience had to read the script in advance to follow what was happening',
    ],
    e: 'With no lighting to darken the stage and no set to build a castle, a line such as one telling us the night is cold does the work that scenery and lighting do today. This is why the verse is so full of place and weather and hour — those passages are not decoration, they are the set. Reading them as spare description misses what they were for.',
  },

  // ── Criticism ─────────────────────────────────────────────────────────────
  {
    t: 'crit',
    stim: 'A student writes: “The writer uses a metaphor: ‘Her patience was a thin rope.’ This is very effective.”',
    q: 'What is the main weakness of this comment?',
    o: [
      'it names the device and quotes it, but never explains how the metaphor works',
      'the quotation chosen is far too short to serve as evidence in an essay',
      'the student should have found a simile to write about instead of this',
      'metaphors are not a suitable subject for discussion in a literary essay',
    ],
    e: 'Everything is in place except the analysis: a rope that is thin can still hold, but only for a while and only under so much weight — and that is what the sentence says about her patience. Naming plus quoting plus “effective” is the most common shape of a low-scoring paragraph. Make the last step the longest one: say what the words do.',
  },
  {
    t: 'crit',
    stim: 'Four sentences taken from students’ essays on the same chapter.',
    q: 'Which sentence is analysis rather than retelling?',
    o: [
      'The short, unfinished sentences slow the scene and hold us in her hesitation.',
      'The character walks to the door, stops, and then returns to the table again.',
      'After the argument the two of them do not speak for the rest of the chapter.',
      'The chapter opens in the kitchen and closes outside the building at night.',
    ],
    e: 'Three of these report what happens; one reports what the writing does to the reader, and names the feature responsible. The test is simple: if a sentence would still be true for someone who had only been told the plot, it is retelling. Analysis has to point at the words on the page.',
  },
  {
    t: 'crit',
    stim: '“How generous of you to remember me — only eight months late.”',
    q: 'What is the tone of this remark?',
    o: [
      'ironic — the praise is shaped to sting rather than to thank',
      'sincere — the speaker is warmly grateful for being remembered',
      'neutral — the speaker is simply recording when the message came',
      'anxious — the speaker is worried about what the delay may mean',
    ],
    e: 'The compliment and the complaint sit in one sentence, and the dash is where it turns: “generous” cannot survive “only eight months late”. Tone is the attitude the words take up towards their subject, and it is often carried by exactly this kind of collision. Reading the first half alone would give the opposite answer — always read to the end of the sentence.',
  },
]

// ── 組裝 ────────────────────────────────────────────────────────────────────
// 正解位置按 0→1→2→3 輪轉，避免任何一個位置成為「安全選擇」。
const rotate = <X,>(arr: X[], k: number) =>
  arr.slice(-k % arr.length || arr.length).concat(arr.slice(0, -k % arr.length || arr.length))

const m = (s: string): P => [s, s] // 語言科慣例：英文欄重複同一串

const rows = QS.map((qq, i) => {
  const [tid, tzh, ten] = T[qq.t]
  const k = i % 4
  const opts = rotate(qq.o, k)
  const stem = qq.stim ? `${qq.stim}\n\n${qq.q}` : qq.q
  return {
    id: `elit_floor_${String(i + 1).padStart(2, '0')}`,
    type: 'mc',
    subject: 'english-literature',
    topic: tzh, topicId: tid, topicZh: tzh, topicEn: ten,
    difficulty: 'basic',
    question: m(stem)[0], questionEn: m(stem)[1],
    options: opts.map((o) => m(o)[0]), optionsEn: opts.map((o) => m(o)[1]),
    correctIndex: k,
    explanation: m(qq.e)[0], explanationEn: m(qq.e)[1],
  }
})

const OUT = 'scripts/qbank/drafts/english-literature-floor.json'
writeFileSync(OUT, JSON.stringify(rows, null, 2) + '\n')
console.log(`✅ ${rows.length} 條容易題 → ${OUT}`)
const byT: Record<string, number> = {}
for (const qq of QS) byT[T[qq.t][1]] = (byT[T[qq.t][1]] ?? 0) + 1
console.log('   課題分佈', JSON.stringify(byT))
