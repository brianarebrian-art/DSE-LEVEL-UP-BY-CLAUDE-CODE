import type {
  AnswerValue,
  Question,
  ResearchStore,
  Survey,
  SurveyResponse,
  TagId,
  ResponseStatus,
} from '@/lib/research/types'

const SUS_HIGH = [5, 1, 5, 1, 4, 2, 5, 1, 5, 2]
const SUS_MID = [4, 2, 4, 2, 3, 3, 4, 2, 4, 3]
const SUS_LOW = [2, 4, 2, 5, 2, 4, 2, 5, 2, 4]

function choice(id: string, label: string) {
  return { id, label }
}

const practiceQuestions: Question[] = [
  {
    id: 'q-entry',
    type: 'single',
    prompt: '你今次主要由邊度進入練習？',
    helpText: '揀最接近嘅一項就得。',
    required: true,
    options: [
      choice('home', '首頁開始練習'),
      choice('catalog', '科目目錄揀課題'),
      choice('print', '可列印試卷'),
      choice('return', '登入之後返回未完成嘅一節'),
    ],
  },
  {
    id: 'q-diff',
    type: 'likert',
    prompt: '難度標籤幫到我決定呢題適唔適合而家做。',
    helpText: '標籤係平台自己嘅練習分級，唔係考評局等級。',
    required: true,
    options: [],
  },
  {
    id: 'q-return',
    type: 'task',
    prompt: '請試吓離開練習頁，再經登入邀請返回同一節。',
    helpText: '只記你可唔可以完成呢個任務，唔會收集帳戶。',
    required: true,
    options: [],
  },
  {
    id: 'q-nps',
    type: 'nps',
    prompt: '你有幾大機會將呢個練習流程介紹畀同學？',
    helpText: '0 係完全唔會，10 係非常願意。',
    required: true,
    options: [],
  },
  {
    id: 'q-unclear',
    type: 'multiple',
    prompt: '邊啲位置你覺得唔清楚？',
    helpText: '可以揀多項，也可以唔揀。',
    required: false,
    options: [
      choice('nav', '導航'),
      choice('copy', '畫面文案'),
      choice('labels', '難度標籤'),
      choice('signin', '登入邀請'),
      choice('bank', '題庫清單'),
    ],
  },
  {
    id: 'q-note',
    type: 'text',
    prompt: '仲有咩想講？',
    helpText: '唔好寫姓名、學校或電郵。',
    required: false,
    options: [],
  },
]

const bankQuestions: Question[] = [
  {
    id: 'q-find',
    type: 'single',
    prompt: '你點樣搵到可列印練習卷？',
    helpText: '如果搵唔到，揀最後一項。',
    required: true,
    options: [
      choice('practice', '練習頁入面嘅列印'),
      choice('subject', '科目頁'),
      choice('missing', '搵唔到'),
    ],
  },
  {
    id: 'q-topics',
    type: 'likert',
    prompt: '題庫清單嘅課題名稱容易對到我想練嘅範圍。',
    helpText: '1 表示非常不同意，5 表示非常同意。',
    required: true,
    options: [],
  },
  {
    id: 'q-print',
    type: 'task',
    prompt: '請打開一份可列印練習卷，並找到難度說明。',
    helpText: '卷係平台自己改寫，唔係考評局試卷。',
    required: true,
    options: [],
  },
  {
    id: 'q-sus',
    type: 'sus',
    prompt: '請就你剛使用嘅題庫同列印流程，回答下面十句。',
    helpText: '每句都要揀 1 至 5。',
    required: true,
    options: [],
  },
  {
    id: 'q-nps-bank',
    type: 'nps',
    prompt: '你有幾大機會將題庫同可列印練習卷介紹畀同學？',
    helpText: '0 係完全唔會，10 係非常願意。',
    required: true,
    options: [],
  },
  {
    id: 'q-note-bank',
    type: 'text',
    prompt: '題庫或列印流程有咩想補充？',
    helpText: '唔好寫姓名、學校或電郵。',
    required: false,
    options: [],
  },
]

const draftQuestions: Question[] = [
  {
    id: 'q-invite',
    type: 'text',
    prompt: '如果登入邀請只可以留一句，你會點寫？',
    helpText: '呢份未發佈。唔好寫姓名、學校或電郵。',
    required: false,
    options: [],
  },
]

function survey(
  id: string,
  name: string,
  description: string,
  purpose: string,
  startsOn: string,
  endsOn: string,
  status: Survey['status'],
  questions: Question[],
  updatedAt: string,
): Survey {
  return { id, name, description, purpose, startsOn, endsOn, status, questions, updatedAt }
}

function response(
  id: string,
  surveyId: string,
  code: string,
  submittedAt: string,
  answers: Record<string, AnswerValue>,
  tags: TagId[],
  status: ResponseStatus,
): SurveyResponse {
  return { id, surveyId, respondentCode: code, submittedAt, answers, tags, status }
}

const surveys: Survey[] = [
  survey(
    'sv-practice-flow',
    '練習流程、難度標籤同登入返回',
    '請試用 DSE Level Up 嘅練習流程。留意難度標籤、做完一節之後嘅邀請，以及登入後返到未完成嘅一節。回覆只留喺呢部瀏覽器。',
    '了解練習流程入面，難度標籤同登入返回邀請會唔會令人停低。',
    '2026-11-01',
    '2026-12-20',
    'published',
    practiceQuestions,
    '2026-11-01T09:00:00+08:00',
  ),
  survey(
    'sv-bank-print',
    '題庫清單同可列印試卷',
    '請睇題庫清單同可列印練習卷，再答下面幾條。卷係平台自己改寫，唔係考評局試卷。',
    '睇課題清單同列印說明夠唔夠，以及成個流程易唔易用。',
    '2026-10-15',
    '2026-12-31',
    'published',
    bankQuestions,
    '2026-10-20T09:00:00+08:00',
  ),
  survey(
    'sv-signin-copy',
    '登入邀請文案',
    '未發佈。用嚟試問卷編輯，唔會出現喺公開列表。',
    '收短登入邀請，避免學生以為要登入先可以做第一節。',
    '2026-12-01',
    '2026-12-31',
    'draft',
    draftQuestions,
    '2026-11-18T09:00:00+08:00',
  ),
]

const responses: SurveyResponse[] = [
  response('rp-2411', 'sv-practice-flow', 'R-2411', '2026-11-03T09:15:00+08:00', {
    'q-entry': { type: 'single', optionId: 'home' },
    'q-diff': { type: 'likert', score: 4 },
    'q-return': { type: 'task', value: 'done' },
    'q-nps': { type: 'nps', score: 9 },
    'q-note': { type: 'text', text: '難度標籤夠清楚，做完一節之後嘅邀請都睇到。' },
  }, ['positive'], 'resolved'),
  response('rp-2412', 'sv-practice-flow', 'R-2412', '2026-11-05T14:20:00+08:00', {
    'q-entry': { type: 'single', optionId: 'catalog' },
    'q-diff': { type: 'likert', score: 2 },
    'q-return': { type: 'task', value: 'partial' },
    'q-nps': { type: 'nps', score: 5 },
    'q-unclear': { type: 'multiple', optionIds: ['nav', 'labels'] },
    'q-note': { type: 'text', text: '由科目目錄返去上一節要搵一陣。' },
  }, ['navigation', 'usability'], 'follow_up'),
  response('rp-2413', 'sv-practice-flow', 'R-2413', '2026-11-08T11:05:00+08:00', {
    'q-entry': { type: 'single', optionId: 'print' },
    'q-diff': { type: 'likert', score: 3 },
    'q-return': { type: 'task', value: 'unable' },
    'q-nps': { type: 'nps', score: 6 },
    'q-unclear': { type: 'multiple', optionIds: ['signin'] },
    'q-note': { type: 'text', text: '列印卷冇帶我返未完成嗰節。' },
  }, ['navigation', 'trust'], 'classified'),
  response('rp-2414', 'sv-practice-flow', 'R-2414', '2026-11-11T16:40:00+08:00', {
    'q-entry': { type: 'single', optionId: 'return' },
    'q-diff': { type: 'likert', score: 5 },
    'q-return': { type: 'task', value: 'done' },
    'q-nps': { type: 'nps', score: 10 },
  }, ['positive'], 'resolved'),
  response('rp-2415', 'sv-practice-flow', 'R-2415', '2026-11-14T10:12:00+08:00', {
    'q-entry': { type: 'single', optionId: 'home' },
    'q-diff': { type: 'likert', score: 2 },
    'q-return': { type: 'task', value: 'unable' },
    'q-nps': { type: 'nps', score: 3 },
    'q-unclear': { type: 'multiple', optionIds: ['copy', 'labels'] },
    'q-note': { type: 'text', text: '進階同基礎我分唔清係平台自己嘅標籤定考試等級。' },
  }, ['copy', 'trust'], 'pending'),
  response('rp-2416', 'sv-practice-flow', 'R-2416', '2026-11-18T13:28:00+08:00', {
    'q-entry': { type: 'single', optionId: 'catalog' },
    'q-diff': { type: 'likert', score: 4 },
    'q-return': { type: 'task', value: 'done' },
    'q-nps': { type: 'nps', score: 8 },
    'q-note': { type: 'text', text: '登入之後返回到同一節，呢步順。科目目錄捲動有時要等一等先出課題。' },
  }, ['positive', 'performance'], 'classified'),
  response('rp-2417', 'sv-practice-flow', 'R-2417', '2026-11-21T15:02:00+08:00', {
    'q-entry': { type: 'single', optionId: 'return' },
    'q-diff': { type: 'likert', score: 3 },
    'q-return': { type: 'task', value: 'partial' },
    'q-nps': { type: 'nps', score: 7 },
    'q-unclear': { type: 'multiple', optionIds: ['nav'] },
  }, ['navigation'], 'follow_up'),
  response('rp-2418', 'sv-practice-flow', 'R-2418', '2026-11-24T19:46:00+08:00', {
    'q-entry': { type: 'single', optionId: 'home' },
    'q-diff': { type: 'likert', score: 1 },
    'q-return': { type: 'task', value: 'unable' },
    'q-nps': { type: 'nps', score: 2 },
    'q-unclear': { type: 'multiple', optionIds: ['nav', 'copy', 'signin'] },
    'q-note': { type: 'text', text: '邀請字太長，我以為要登入先可以繼續練習。' },
  }, ['copy', 'trust', 'usability'], 'pending'),
  response('rp-2421', 'sv-bank-print', 'R-2421', '2026-11-04T09:40:00+08:00', {
    'q-find': { type: 'single', optionId: 'practice' },
    'q-topics': { type: 'likert', score: 4 },
    'q-print': { type: 'task', value: 'done' },
    'q-sus': { type: 'sus', scores: SUS_HIGH },
    'q-nps-bank': { type: 'nps', score: 9 },
    'q-note-bank': { type: 'text', text: '列印入口喺練習頁，難度說明喺卷首。' },
  }, ['positive'], 'resolved'),
  response('rp-2422', 'sv-bank-print', 'R-2422', '2026-11-09T12:18:00+08:00', {
    'q-find': { type: 'single', optionId: 'subject' },
    'q-topics': { type: 'likert', score: 3 },
    'q-print': { type: 'task', value: 'partial' },
    'q-sus': { type: 'sus', scores: SUS_MID },
    'q-nps-bank': { type: 'nps', score: 6 },
    'q-note-bank': { type: 'text', text: '課題名對到，但列印說明要捲落去。我一度以為列印要付費，其實頁面冇價錢。' },
  }, ['navigation', 'pricing'], 'classified'),
  response('rp-2423', 'sv-bank-print', 'R-2423', '2026-11-12T17:55:00+08:00', {
    'q-find': { type: 'single', optionId: 'missing' },
    'q-topics': { type: 'likert', score: 2 },
    'q-print': { type: 'task', value: 'unable' },
    'q-sus': { type: 'sus', scores: SUS_LOW },
    'q-nps-bank': { type: 'nps', score: 4 },
    'q-note-bank': { type: 'text', text: '我喺題庫清單搵唔到可列印練習卷。撳列印之後預覽空白，要重新開一次。' },
  }, ['navigation', 'usability', 'bug'], 'follow_up'),
  response('rp-2424', 'sv-bank-print', 'R-2424', '2026-11-16T08:22:00+08:00', {
    'q-find': { type: 'single', optionId: 'practice' },
    'q-topics': { type: 'likert', score: 5 },
    'q-print': { type: 'task', value: 'done' },
    'q-sus': { type: 'sus', scores: SUS_HIGH },
    'q-nps-bank': { type: 'nps', score: 10 },
  }, ['positive'], 'resolved'),
  response('rp-2425', 'sv-bank-print', 'R-2425', '2026-11-22T11:33:00+08:00', {
    'q-find': { type: 'single', optionId: 'subject' },
    'q-topics': { type: 'likert', score: 3 },
    'q-print': { type: 'task', value: 'done' },
    'q-sus': { type: 'sus', scores: SUS_MID },
    'q-nps-bank': { type: 'nps', score: 8 },
    'q-note-bank': { type: 'text', text: '難度說明喺卷首，但字較細。' },
  }, ['copy'], 'classified'),
  response('rp-2426', 'sv-bank-print', 'R-2426', '2026-11-26T20:05:00+08:00', {
    'q-find': { type: 'single', optionId: 'missing' },
    'q-topics': { type: 'likert', score: 2 },
    'q-print': { type: 'task', value: 'unable' },
    'q-sus': { type: 'sus', scores: SUS_LOW },
    'q-nps-bank': { type: 'nps', score: 1 },
    'q-note-bank': { type: 'text', text: '我以為列印會用到考評局卷。其實係平台自己改寫嘅練習卷。' },
  }, ['trust', 'copy'], 'pending'),
]

export function seedStore(): ResearchStore {
  return {
    version: 1,
    surveys,
    responses,
    settings: { preview: 'ready', density: 'comfortable' },
  }
}
