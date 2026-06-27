import type { Question, Topic } from './types'
import { makeQ, topicList, type Pair, type TopicMeta, type FwMeta } from './_builder'

// ════════════════════════════════════════════════════════════════════════════
// English Language — DSE Paper 1 (Reading) "Hell" set: genuine 5★★ killers.
// Every passage below is ORIGINAL (written for this bank — zero copyright risk).
// The questions target the hardest Paper 1 skills: inference, writer's attitude/
// tone, reference, vocabulary-in-context — with distractors engineered to punish
// surface reading, over-extreme paraphrase, and the strawman/concession trap.
// The correct answer is fully determined by close reading of the given passage.
// All items difficulty:'hard'.
// ════════════════════════════════════════════════════════════════════════════

const q = makeQ('english')
const m = (s: string): Pair => [s, s] // monolingual: both columns English

const T = {
  infer: { id: 'p1_inference', zh: 'Reading · Inference & Implication', en: 'Reading · Inference & Implication' },
  tone:  { id: 'p1_tone',      zh: 'Reading · Tone & Attitude',         en: 'Reading · Tone & Attitude' },
  ref:   { id: 'p1_vocab_ref', zh: 'Reading · Vocabulary & Reference',  en: 'Reading · Vocabulary & Reference' },
} satisfies Record<string, TopicMeta>

const FW = {
  reading: { id: 'reading', zh: 'Reading', en: 'Reading', emoji: '📖' },
} satisfies Record<string, FwMeta>

let uid = 0
const id = (p: string) => `enh_${p}_${++uid}`

const PASSAGE_A =
  'For all the promises made on its behalf, the so-called productivity revolution has delivered something closer to its opposite. Each new app arrives pledging to streamline our work, yet the hours we once spent working are now spent, in no small part, managing the very tools meant to save them. We tag, we sort, we colour-code; we migrate our notes from one system to the next in the perpetual hope that the next will finally be the one. The labour is real, but it is labour spent on the scaffolding of work rather than the work itself. None of this is to deny that such tools can help. A surgeon’s checklist saves lives precisely because it is simple, fixed, and used without fuss. The difficulty arises when the tool stops being a means and quietly becomes an end — when arranging the task supplants doing it. The busiest person in the office is not always the most productive; sometimes she is merely the most elaborately organised.'

const PASSAGE_B =
  'Everyone agreed that Marcus was the model of a modern professional. He answered emails within the minute, often before the sender had quite finished thinking; his calendar, shared freely with all, was a mosaic of overlapping commitments in six colours. He attended every meeting, including those to which he had not been invited, and contributed to each with the same warm, untiring enthusiasm. If a project stalled, Marcus would propose a new committee to study it; if the committee stalled, he would propose a sub-committee. He had, his colleagues often remarked, a remarkable capacity for work. What none of them could quite recall, when pressed, was a single thing he had ever actually finished.'

const PASSAGE_C =
  'The report’s authors are careful never to overstate. Sea levels, they note, “have risen measurably over the past century” — a statement of record, not prediction. When they turn to the future, the prose grows cautious: outcomes “may”, “could”, or “are likely to” follow, each qualifier a small act of intellectual honesty. Critics seize on this caution as evasion, as though certainty were the only mark of seriousness. But the authors understand something their critics do not: in matters of this complexity, the confident voice is usually the least trustworthy. To hedge is not to dodge. It is to describe the world at the resolution the evidence allows.'

const P = (passage: string, label: string, ask: string): Pair =>
  m(`【Passage ${label}】 ${passage}\n\n【Question】 ${ask}`)

// ── Inference & implication ──────────────────────────────────────────────────
const infer: Question[] = [
  q(id('inf'), T.infer, FW.reading, 'hard', 2024, 2,
    P(PASSAGE_A, 'A', 'Which best states the writer’s central argument?'),
    [m('Productivity tools often consume the very time they promise to save, and become an end in themselves.'),
     m('Productivity tools are useless and ought to be abandoned altogether.'),
     m('Productivity tools have dramatically improved the quality of modern office work.'),
     m('Productivity tools are too complicated for the average worker to operate.')],
    m('The passage argues that managing the tools eats the time they were meant to save, so the tool "stops being a means and quietly becomes an end". \n\n【Trap autopsy】 "Useless / abandon altogether" is the OVER-EXTREME trap — the writer explicitly concedes "such tools can help" (the surgeon’s checklist), so a total rejection contradicts the text. "Improved dramatically" is the strawman view the writer is rebutting, not his own. "Too complicated" is never claimed — the problem is misuse, not difficulty.')),

  q(id('inf'), T.infer, FW.reading, 'hard', 2023, 2,
    P(PASSAGE_A, 'A', 'The example of the surgeon’s checklist is included mainly to'),
    [m('concede that simple, fixed tools used "without fuss" genuinely help, sharpening the contrast with tools that become ends in themselves.'),
     m('prove that every checklist, in any field, will save lives.'),
     m('argue that medicine matters more than office work.'),
     m('recommend that office workers adopt surgical checklists.')],
    m('The checklist is a concession ("None of this is to deny that such tools can help"): it shows a tool working as a means, which throws the misuse case into relief. \n\n【Trap autopsy】 "Every checklist will save lives" over-generalises a single illustrative case. "Medicine matters more" imports a comparison the passage never makes. "Adopt surgical checklists" treats an illustration as a literal recommendation — a classic over-literal trap.')),

  q(id('inf'), T.infer, FW.reading, 'hard', 2022, 2,
    P(PASSAGE_C, 'C', 'The phrase "have risen measurably over the past century" is presented as'),
    [m('a statement of record — an established fact, as opposed to a prediction.'),
     m('an exaggeration the authors later retract.'),
     m('a prediction about what will happen in the future.'),
     m('an opinion put forward by the report’s critics.')],
    m('The text labels it directly: "a statement of record, not prediction", and contrasts it with the cautious, hedged language used for the FUTURE. \n\n【Trap autopsy】 "Exaggeration" is the opposite of the authors’ stated care "never to overstate". "Prediction" is exactly what the passage says it is NOT. "Opinion of the critics" confuses the measured fact with the critics, who appear only to attack the hedging.')),

  q(id('inf'), T.infer, FW.reading, 'hard', 2024, 2,
    P(PASSAGE_C, 'C', 'The writer’s main point about the authors’ cautious "may / could / likely" language is that it'),
    [m('reflects intellectual honesty suited to complex evidence, rather than evasion.'),
     m('weakens the report and should have been removed.'),
     m('proves the authors are unsure even of basic facts.'),
     m('is a deliberate tactic to escape future criticism.')],
    m('"To hedge is not to dodge. It is to describe the world at the resolution the evidence allows" — the hedging is framed as honesty proportionate to complexity. \n\n【Trap autopsy】 "Weakens / should be removed" echoes the CRITICS’ view, which the writer rejects. "Unsure of basic facts" contradicts the firm factual claim about past sea-level rise. "Tactic to escape criticism" is the very "evasion" charge the writer is refuting.')),

  q(id('inf'), T.infer, FW.reading, 'hard', 2023, 2,
    P(PASSAGE_C, 'C', 'Within this passage, "the confident voice is usually the least trustworthy" implies that'),
    [m('over-certainty can signal a failure to respect the limits of the evidence.'),
     m('people who speak confidently tell lies more often than others.'),
     m('readers should ignore anyone who sounds sure of themselves.'),
     m('the authors themselves lack confidence in their own work.')],
    m('In context, the line praises the authors for matching their certainty to the evidence; over-confidence is distrusted because it outruns what the evidence supports. \n\n【Trap autopsy】 "Tell lies more often" smuggles in dishonesty the passage never mentions. "Ignore anyone confident" is an over-extreme rule the text does not endorse. "Authors lack confidence" misreads calibrated caution as personal insecurity — the authors are confident about the facts they can establish.')),
]

// ── Tone & attitude ──────────────────────────────────────────────────────────
const tone: Question[] = [
  q(id('tn'), T.tone, FW.reading, 'hard', 2024, 2,
    P(PASSAGE_A, 'A', 'The final sentence ("merely the most elaborately organised") chiefly implies that'),
    [m('being organised can be mistaken for being productive, even when little real work gets done.'),
     m('the most organised workers are always the hardest-working.'),
     m('the office rewards organisation more highly than productivity.'),
     m('women tend to be better organised than men.')],
    m('"Merely" deflates the praise: elaborate organisation is set against actual productivity, implying the two are not the same. \n\n【Trap autopsy】 "Always the hardest-working" is the opposite of the point. "The office rewards organisation more" adds an institutional claim not in the text. "Women are better organised" over-reads the generic "she" as a claim about gender — the pronoun is incidental.')),

  q(id('tn'), T.tone, FW.reading, 'hard', 2023, 2,
    P(PASSAGE_B, 'B', 'The writer’s attitude towards Marcus is best described as'),
    [m('gently mocking — praising his busyness in terms that quietly expose his lack of real output.'),
     m('openly hostile and contemptuous.'),
     m('sincerely admiring of his work ethic.'),
     m('completely indifferent and detached.')],
    m('The praise is loaded with irony (six-colour calendars, committees breeding sub-committees) and detonated by the last line, where nothing is ever finished — mockery, but light-handed. \n\n【Trap autopsy】 "Openly hostile / contemptuous" is too strong; the tone is wry, not venomous. "Sincerely admiring" takes the surface praise at face value and misses the irony. "Completely indifferent" ignores the clear evaluative slant of the writing.')),

  q(id('tn'), T.tone, FW.reading, 'hard', 2022, 2,
    P(PASSAGE_B, 'B', 'The last sentence functions to'),
    [m('undercut the preceding praise by revealing that all his activity produced nothing finished.'),
     m('introduce a new topic about the unreliability of human memory.'),
     m('compliment Marcus on his modesty about his achievements.'),
     m('criticise his colleagues for being forgetful.')],
    m('It is the ironic punchline: after a paragraph of "remarkable capacity for work", the reveal is that no one can name a single finished thing — retrospectively turning the praise into satire. \n\n【Trap autopsy】 "About memory" misreads "none could recall" as a point about forgetfulness rather than about Marcus’s output. "Compliment on modesty" invents a virtue not in the text. "Criticise the colleagues" blames the wrong party — the target is Marcus.')),

  q(id('tn'), T.tone, FW.reading, 'hard', 2024, 2,
    P(PASSAGE_B, 'B', 'That Marcus answered emails "often before the sender had quite finished thinking" suggests he'),
    [m('prized speed of response over thoughtfulness, reacting before fully understanding.'),
     m('possessed an almost telepathic insight into others’ minds.'),
     m('was exceptionally intelligent and quick-witted.'),
     m('helped senders to clarify their own thoughts.')],
    m('Within the satirical frame, replying before the sender has finished thinking signals reflexive haste, not comprehension — another emblem of activity without substance. \n\n【Trap autopsy】 "Almost telepathic" reads a sarcastic exaggeration literally. "Exceptionally intelligent" mistakes the mocking praise for genuine compliment. "Helped senders clarify" reverses the meaning — he pre-empts their thinking rather than aiding it.')),
]

// ── Vocabulary-in-context & reference ────────────────────────────────────────
const ref: Question[] = [
  q(id('rf'), T.ref, FW.reading, 'hard', 2023, 2,
    P(PASSAGE_A, 'A', 'As used in the passage, "the scaffolding of work" refers to'),
    [m('the supporting, preparatory activity arranged around a task rather than the task itself.'),
     m('the physical construction or fitting-out of an office building.'),
     m('the single most important part of any job.'),
     m('the teamwork that supports one’s colleagues.')],
    m('"Labour spent on the scaffolding of work rather than the work itself" — scaffolding is the metaphorical structure AROUND the real work (tagging, sorting, migrating notes), not the work. \n\n【Trap autopsy】 "Physical construction" takes the metaphor literally. "Most important part" inverts the meaning — scaffolding is explicitly contrasted with the work itself. "Teamwork supporting colleagues" imports a sense of "support" the passage never uses.')),

  q(id('rf'), T.ref, FW.reading, 'hard', 2022, 2,
    P(PASSAGE_C, 'C', 'In "each qualifier a small act of intellectual honesty", the word "qualifier" refers to'),
    [m('the hedging words such as "may", "could" and "are likely to".'),
     m('the report’s authors.'),
     m('the report’s critics.'),
     m('the established facts about the past century.')],
    m('The "qualifier"s are the cautious modal expressions just quoted — "may / could / are likely to" — each one a hedge that the writer reads as honesty. \n\n【Trap autopsy】 "The authors" and "the critics" are people, not words being described as qualifiers. "Established facts" are precisely the un-hedged statements of record, the opposite of qualified language.')),
]

export const englishHellQuestions: Question[] = [...infer, ...tone, ...ref]

export const englishHellTopics: Topic[] = topicList([
  { topic: T.infer, fw: FW.reading, count: infer.length },
  { topic: T.tone,  fw: FW.reading, count: tone.length },
  { topic: T.ref,   fw: FW.reading, count: ref.length },
])
