// English Paper 1 — ORIGINAL parallel reading passages (原創平行對齊法).
// 100% original prose written for this platform; NOT reproductions of any HKEAA
// or third-party text. Each passage is aligned to the underlying skill a real
// 2023 DSE section tests (Dramatic Irony / Attitude Matching / Metaphor & Tone),
// with comprehension questions whose distractors model the four 考評局 traps.
// options[0] is always the correct answer (the UI shuffles display order).

export interface ReadingQuestion {
  q: string
  options: string[] // [0] = correct
  explanation: string
}

export interface ReadingPassage {
  id: string
  part: string
  partZh: string
  skill: string
  skillZh: string
  title: string
  body: string[]
  questions: ReadingQuestion[]
}

export const readingPassages: ReadingPassage[] = [
  {
    id: 'false-alarm',
    part: 'Part A (Compulsory)',
    partZh: '甲部（必答）',
    skill: 'Dramatic Irony',
    skillZh: '戲劇性反諷',
    title: 'The False Alarm',
    body: [
      'Marcus had never been the kind of student teachers remembered. So when he wheeled his project — a tangle of copper coils, a humming battery pack and a glass tube that glowed faintly green — into the school hall, nobody expected much.',
      'It was the glow that caused the trouble. Mr Pang, the chemistry teacher, took one look at the bubbling tube and went pale. “Everybody back!” he shouted, herding students towards the doors. Within minutes the hall had been cleared, the caretaker summoned, and a small crowd had gathered outside, whispering that the new boy had built a bomb.',
      'Marcus, who had simply mixed a harmless fluorescent dye into warm water, stood beside his project in bewildered silence.',
      'By the time the panic subsided, the judges had decided that any project frightening enough to empty a hall must be a work of genius. Marcus was awarded first prize for “Innovation and Daring”.',
      'He accepted the trophy with a fixed smile. Later, a junior asked him to explain how the reaction worked. Marcus opened his mouth, paused, and admitted that he was not entirely sure himself.',
    ],
    questions: [
      {
        q: 'What makes Marcus’s victory ironic?',
        options: [
          'He is honoured for “daring innovation” when his project was harmless and he does not even understand it',
          'He worked harder than any other student and finally received the recognition he had earned',
          'He deliberately designed his project to frighten the judges into giving him the prize',
          'He was the only student whose experiment actually succeeded on the day',
        ],
        explanation:
          'Dramatic irony lies in the gap between what the reader knows and what the characters believe: we know the “dangerous” device was only dye in warm water and that Marcus cannot explain it, yet he is crowned for genius. 【Distractor autopsy】“worked harder… earned it” is a Concept-Substitution trap (the text shows the opposite — he is unremarkable and clueless); “deliberately designed it to frighten” is Over-inference with no textual support; “the only experiment that succeeded” is Half-right/Half-wrong — there was a reaction, but “success” misreads an accident as achievement.',
      },
      {
        q: 'Mr Pang’s behaviour in the second paragraph is best described as —',
        options: [
          'an over-reaction to something he has misjudged',
          'a calm, expert assessment of a genuine danger',
          'a deliberate attempt to sabotage Marcus’s project',
          'long-standing dislike of Marcus finally boiling over',
        ],
        explanation:
          'He “went pale” and evacuated the hall over harmless dye — the “false alarm” of the title. 【Distractor autopsy】“calm, expert assessment of a genuine danger” reverses the facts (Concept Substitution); “deliberate sabotage” and “long-standing dislike” are Over-inference — the passage gives no evidence of motive or history, only sudden fright.',
      },
      {
        q: 'The “fixed smile” with which Marcus accepts the trophy most strongly suggests that he feels —',
        options: [
          'uncomfortable, sensing that the honour is undeserved',
          'proud and fully vindicated at last',
          'furious at the judges for embarrassing him',
          'completely indifferent to the whole event',
        ],
        explanation:
          'A “fixed” (forced, frozen) smile signals unease, confirmed when he cannot explain his own project. 【Distractor autopsy】“proud and vindicated” is Half-right/Half-wrong — he is smiling, but the adjective “fixed” quietly overturns the surface emotion; “furious” and “indifferent” are Over-inference, naming feelings the text never supports.',
      },
      {
        q: 'Through the judges’ decision, the writer is mainly satirising —',
        options: [
          'the tendency to mistake spectacle and fear for real merit',
          'the unfairness of school science competitions to poorer students',
          'the laziness of students who refuse to study chemistry properly',
          'the danger of allowing untrained students to handle chemicals',
        ],
        explanation:
          'The judges reward a project simply because it “emptied a hall” — equating commotion with brilliance. 【Distractor autopsy】“unfairness to poorer students” and “danger of chemicals” are Over-inference on themes never raised; “laziness of students” is Concept Substitution — it shifts the satire from the judges (the real target) onto students.',
      },
    ],
  },
  {
    id: 'urban-guide-dogs',
    part: 'Part B1 (Easier Section)',
    partZh: '乙部一（較淺）',
    skill: 'Attitude Matching & Lexical Clues',
    skillZh: '態度對齊與字詞線索',
    title: 'Urban Guide Dogs: Challenges in Public Transit',
    body: [
      'For Hong Kong’s small community of guide-dog users, the hardest obstacle is rarely the traffic. It is the closed door.',
      'Wendy Lau, partnered with her labrador Coco for three years, says she is turned away from shops and minibuses “almost every week”. “People assume Coco is a pet,” she explains. “They don’t realise she is my eyes.” Her tone is weary rather than angry — the resignation of someone who has explained the same thing a thousand times.',
      'Ordinary commuters, by contrast, are often quick to help. Several passengers on the MTR described the dogs as “remarkable” and said they would gladly give up a seat.',
      'The official response is more measured. A transport spokesperson confirmed that trained guide dogs are permitted on all railway lines, but added, carefully, that “enforcement against individual minibus operators and private premises lies beyond our jurisdiction”. It was the language of an organisation reluctant to promise more than it can deliver.',
      'For Wendy, such caution is cold comfort. “A rule that nobody enforces,” she says, “is just a sentence on a poster.”',
    ],
    questions: [
      {
        q: 'Wendy Lau’s attitude towards being turned away is best described as —',
        options: [
          'weary resignation rather than open anger',
          'fierce and growing outrage at every operator',
          'cheerful optimism that things will soon improve',
          'complete indifference to how others treat her',
        ],
        explanation:
          'The text states her tone is “weary rather than angry” — the “resignation” of endless repetition. 【Distractor autopsy】“fierce outrage” is the Concept-Substitution trap the passage explicitly rules out (“rather than angry”); “cheerful optimism” and “complete indifference” contradict her weariness — Over-inference.',
      },
      {
        q: 'How does the transport spokesperson’s reply come across?',
        options: [
          'guarded and carefully non-committal',
          'warm, generous and fully supportive',
          'openly hostile to guide-dog users',
          'confused and unsure of the actual rules',
        ],
        explanation:
          'He confirms dogs are allowed but “carefully” disclaims responsibility beyond railway lines — “reluctant to promise more than it can deliver”. 【Distractor autopsy】“warm and fully supportive” is Half-right/Half-wrong (he does confirm the rule, but the careful disclaimer is the real attitude); “openly hostile” over-states it; “confused / unsure” is Concept Substitution — he is precise, not confused.',
      },
      {
        q: 'By calling the official response “cold comfort”, the writer implies that Wendy finds it —',
        options: [
          'reasonable-sounding but of little real help to her',
          'genuinely reassuring and a sign of real progress',
          'insulting and clearly intended to mock her',
          'too generous, offering far more than she expected',
        ],
        explanation:
          '“Cold comfort” = something that sounds consoling but offers no real benefit. 【Distractor autopsy】“genuinely reassuring” reverses the idiom (Context Distortion); “insulting / intended to mock” is Over-inference of malice; “too generous” is the opposite of the intended meaning.',
      },
      {
        q: 'Wendy’s remark that an unenforced rule is “just a sentence on a poster” suggests that she believes —',
        options: [
          'rules without enforcement are effectively meaningless',
          'posters are an excellent way to educate the public',
          'the railway has done everything that could be asked of it',
          'guide dogs should be banned from public transport',
        ],
        explanation:
          'The metaphor reduces an unenforced rule to mere decorative words. 【Distractor autopsy】“posters are excellent education” misreads the literal image (Context Distortion); “the railway has done everything” contradicts her complaint (Concept Substitution); “dogs should be banned” is the reverse of her position — Over-inference.',
      },
    ],
  },
  {
    id: 'chords-and-conflicts',
    part: 'Part B2 (Harder Section)',
    partZh: '乙部二（較深）',
    skill: 'Metaphor, Speaker’s Tone & Vocabulary-in-context',
    skillZh: '比喻、語氣與語境詞義',
    title: 'Chords and Conflicts',
    body: [
      'Madam Ng did not teach the piano so much as wage war on it. Every wrong note I played was met with a sharp tap of her pencil on the music stand — a small, precise act of violence that made me flinch more than any shout could.',
      'I was nine, and I hated those Tuesday afternoons with a passion I could not name. My fingers, she said, were “lazy soldiers who would not march”. My phrasing was “a wilted flower”. For two years we circled each other like duellists, the metronome ticking between us like a referee counting down.',
      'My parents, oddly, never intervened. When I begged to quit, my mother only said, “Finish what you started,” and returned to her newspaper. I read their silence as indifference, and it stung.',
      'It was only years later, when my own hands found their way through a difficult passage without fear, that I finally understood. Madam Ng’s pencil had not been cruelty; it had been a kind of stubborn faith. And my parents’ silence had not been neglect. It had been a door they left deliberately ajar, waiting to see whether I would walk back through it on my own.',
    ],
    questions: [
      {
        q: 'The metaphor of a “door they left deliberately ajar” suggests that the narrator’s parents —',
        options: [
          'gave her the freedom to return to the piano by her own choice',
          'physically locked her out of the practice room as punishment',
          'never cared whether she continued playing or not',
          'forced her to keep attending the lessons against her will',
        ],
        explanation:
          'An open-but-not-pushed door is a metaphor for offered freedom — they neither forced nor forbade, but left the way back available. 【Distractor autopsy】“physically locked her out” reads the metaphor literally (Context Distortion); “never cared” repeats the narrator’s younger misjudgement that the passage explicitly corrects; “forced her to keep attending” is the opposite of “ajar” — Concept Substitution.',
      },
      {
        q: 'How does the speaker’s tone change by the final paragraph?',
        options: [
          'from childhood resentment to adult understanding',
          'from early affection to lasting bitterness',
          'from calm indifference to sudden panic',
          'from confidence to deep regret',
        ],
        explanation:
          'The closing reinterpretation (“not cruelty… stubborn faith”; “not neglect… a door left ajar”) marks a shift from the hatred of paragraph 2 to reconciled understanding. 【Distractor autopsy】“early affection to bitterness” inverts the actual arc (Concept Substitution); “indifference to panic” and “confidence to regret” are Over-inference, naming emotions the text never traces.',
      },
      {
        q: 'When Madam Ng calls the narrator’s fingers “lazy soldiers who would not march”, she is —',
        options: [
          'using a figure of speech to criticise sloppy, undisciplined playing',
          'literally comparing her student to a real army recruit',
          'praising the student’s natural sense of rhythm',
          'complaining that the lessons start too early in the day',
        ],
        explanation:
          'It is a metaphor: undisciplined fingers likened to soldiers who refuse to march. 【Distractor autopsy】“literally… a real army recruit” takes the image at face value (Context Distortion); “praising… rhythm” reverses the clearly critical intent (Concept Substitution); “lessons start too early” is unrelated — Over-inference.',
      },
      {
        q: 'In context, the phrase “a kind of stubborn faith” shows that the narrator now views Madam Ng’s strictness as —',
        options: [
          'an expression of her belief in the student’s potential',
          'proof that Madam Ng secretly disliked teaching children',
          'evidence that the narrator had no musical talent at all',
          'a habit Madam Ng had simply picked up from other teachers',
        ],
        explanation:
          '“Faith” reframes the harshness as persistent belief that the student could improve. 【Distractor autopsy】“secretly disliked teaching” is Over-inference of hidden motive; “no musical talent at all” contradicts the narrator’s eventual mastery (Concept Substitution); “a habit picked up from others” is Half-right/Half-wrong — it sounds plausible but has zero basis in the text.',
      },
    ],
  },
]
