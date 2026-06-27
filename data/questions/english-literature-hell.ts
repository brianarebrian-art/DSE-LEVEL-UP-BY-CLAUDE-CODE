import type { Question, Topic } from './types'
import { makeQ, topicList, type Pair, type TopicMeta, type FwMeta } from './_builder'

// ════════════════════════════════════════════════════════════════════════════
// Literature in English "hell" set (genuine 5★★). Every extract is PUBLIC DOMAIN
// (Shakespeare, Shelley, Blake, Wordsworth, Dickinson — all long out of copyright).
// Questions target close reading of device, tone, irony and theme; distractors are
// the standard misreadings (taking a rejected comparison literally, missing the
// irony, mistaking personified Death for a destroyer). All hard.
// ════════════════════════════════════════════════════════════════════════════

const q = makeQ('english-literature')
const m = (s: string): Pair => [s, s]

const T = {
  device: { id: 'elit_device_effect', zh: 'Device & effect', en: 'Device & effect' },
  theme:  { id: 'elit_theme_irony',   zh: 'Theme & irony',   en: 'Theme & irony' },
} satisfies Record<string, TopicMeta>

const FW = {
  craft:    { id: 'craft',    zh: 'Craft',    en: 'Craft',    emoji: '🖋️' },
  analysis: { id: 'analysis', zh: 'Analysis', en: 'Analysis', emoji: '🔍' },
} satisfies Record<string, FwMeta>

let uid = 0
const id = (p: string) => `elith_${p}_${++uid}`

const P = (work: string, text: string, ask: string): Pair =>
  m(`【${work}】 ${text}\n\n【Question】 ${ask}`)

const device: Question[] = [
  q(id('de'), T.device, FW.craft, 'hard', 2024, 2,
    P('Shakespeare, Sonnet 18',
      '“Shall I compare thee to a summer’s day? / Thou art more lovely and more temperate… / But thy eternal summer shall not fade… / So long as men can breathe or eyes can see, / So long lives this, and this gives life to thee.”',
      'The poem’s central claim about the beloved is that?'),
    [m('the beloved’s beauty will be immortalised and outlast summer itself through the permanence of the poem'),
     m('the beloved is in every way exactly like a summer’s day'),
     m('a summer’s day is more beautiful than the beloved'),
     m('the beloved’s beauty will fade just as summer fades')],
    m('The closing couplet states that the poem (“this”) gives the beloved eternal life “so long as men can breathe” — the conceit is that verse confers immortality, so “eternal summer shall not fade.”\n\n【Trap autopsy】 “Exactly like a summer’s day” takes a comparison the poem REJECTS (“more lovely and more temperate”) at face value; “summer is more beautiful” reverses it; “will fade like summer” directly contradicts “shall not fade.”')),

  q(id('de'), T.device, FW.analysis, 'hard', 2023, 2,
    P('Blake, “The Tyger”',
      '“Tyger Tyger, burning bright, / In the forests of the night; / What immortal hand or eye, / Could frame thy fearful symmetry?”',
      'The repeated rhetorical questions (“What immortal hand or eye…”) chiefly serve to?'),
    [m('convey awe and unease at the mystery of who could create something so fearsome yet beautiful — questions that expect no neat answer'),
     m('provide the reader with factual information about tigers'),
     m('show that the speaker already knows exactly who the creator is'),
     m('criticise the tiger for being dangerous to humans')],
    m('The unanswered questions dramatise wonder and disquiet before the paradox of a creator capable of such “fearful symmetry”; the form (questioning, not asserting) is the meaning.\n\n【Trap autopsy】 “Factual information” misreads awe as zoology; “already knows” contradicts the questioning form; “criticise the tiger” mistakes the target — the poem marvels at the maker, not blames the beast.')),

  q(id('de'), T.device, FW.analysis, 'hard', 2024, 2,
    P('Dickinson, “Because I could not stop for Death”',
      '“Because I could not stop for Death – / He kindly stopped for me – / The Carriage held but just Ourselves – / And Immortality.”',
      'Death is presented as?'),
    [m('a courteous gentleman caller (personification), which makes the approach of death feel calm and civil rather than terrifying'),
     m('a violent destroyer who seizes the speaker by force'),
     m('a purely abstract idea given no human form at all'),
     m('a figure the speaker deliberately chose to seek out')],
    m('Death “kindly stopped” and drives the carriage like a polite suitor — personification that recasts dying as an unhurried, civil journey rather than a horror.\n\n【Trap autopsy】 “Violent destroyer” is the opposite of “kindly”; “no human form” ignores the clear personification; “chose to seek out” contradicts “could not stop for Death” (she did not initiate it).')),

  q(id('de'), T.device, FW.analysis, 'hard', 2023, 2,
    P('Wordsworth, “Daffodils”',
      '“I wandered lonely as a cloud / That floats on high o’er vales and hills, / When all at once I saw a crowd, / A host, of golden daffodils…”',
      'The simile “lonely as a cloud” set against the “crowd… of golden daffodils” together establish?'),
    [m('a movement from solitary detachment to sudden, joyful communion with nature — characteristic of Romantic feeling'),
     m('the speaker’s fear and distrust of the natural world'),
     m('a purely botanical, emotionally neutral description'),
     m('the loneliness felt by the daffodils themselves')],
    m('The lone, drifting cloud gives way to a teeming “host” of flowers; the contrast turns isolation into delighted connection with nature — the Romantic move from solitude to communion.\n\n【Trap autopsy】 “Fear/distrust” misreads the joyful tone; “emotionally neutral” ignores “lonely” and “golden”; “loneliness of the daffodils” transfers the speaker’s feeling onto the flowers, which are a “crowd,” not lonely.')),
]

const theme: Question[] = [
  q(id('th'), T.theme, FW.analysis, 'hard', 2024, 2,
    P('Shelley, “Ozymandias”',
      '“…Two vast and trunkless legs of stone / Stand in the desert… / And on the pedestal these words appear: / ‘My name is Ozymandias, king of kings; / Look on my works, ye Mighty, and despair!’ / Nothing beside remains.”',
      'The chief irony of the poem lies in?'),
    [m('the boastful inscription demanding awe at his “works” survives beside nothing but ruin — power and pride are exposed as transient'),
     m('the statue being perfectly preserved after thousands of years'),
     m('Ozymandias having been a famously humble and modest king'),
     m('the desert continuing to protect his flourishing empire')],
    m('“Look on my works… and despair!” was meant to humble rivals before his greatness; the irony is that “nothing beside remains” — only wreckage — so the words now mock the very power they boast of. Time defeats even kings.\n\n【Trap autopsy】 The statue is a “colossal wreck,” not preserved; the inscription proves arrogance, not humility; the empire has utterly vanished.')),

  q(id('th'), T.theme, FW.analysis, 'hard', 2023, 2,
    P('Shakespeare, Macbeth',
      '“Out, out, brief candle! / Life’s but a walking shadow, a poor player / That struts and frets his hour upon the stage / And then is heard no more: it is a tale / Told by an idiot, full of sound and fury, / Signifying nothing.”',
      'The dominant view of life expressed here is?'),
    [m('that life is brief, insubstantial and ultimately meaningless — a nihilistic despair built from the metaphors of a candle, a shadow and a bad actor'),
     m('that life is a glorious performance to be joyfully celebrated'),
     m('that death can be conquered by lasting fame and glory'),
     m('that life follows a clear and comforting divine purpose')],
    m('The piled metaphors — a guttering “brief candle,” a “walking shadow,” a ranting “poor player,” a tale “signifying nothing” — all reduce life to something fleeting and empty: Macbeth’s nihilistic despair.\n\n【Trap autopsy】 “Joyfully celebrated” and “comforting divine purpose” invert the bleak tone; “conquered by fame” is contradicted by “heard no more.”')),

  q(id('th'), T.theme, FW.analysis, 'hard', 2024, 2,
    m('Both Shelley’s “Ozymandias” and Macbeth’s “Tomorrow” speech share which central theme?'),
    [m('the impermanence and ultimate emptiness of worldly power and human striving'),
     m('the triumph of romantic love over death'),
     m('the restorative beauty of the natural world'),
     m('the importance of unwavering religious faith')],
    m('“Ozymandias” shows a “king of kings” reduced to desert rubble; Macbeth’s speech reduces life to “a tale… signifying nothing.” Both confront the vanity and transience of earthly power and effort.\n\n【Trap autopsy】 Neither text concerns romantic love, the beauty of nature, or religious faith — those import themes the extracts do not develop.')),
]

export const englishLiteratureHellQuestions: Question[] = [...device, ...theme]

export const englishLiteratureHellTopics: Topic[] = topicList([
  { topic: T.device, fw: FW.craft,    count: device.length },
  { topic: T.theme,  fw: FW.analysis, count: theme.length },
])
