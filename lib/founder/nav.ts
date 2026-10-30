/** Founder OS 導航結構 —— 單一來源，Shell 同搜尋共用。 */

export type FounderNavItem = {
  href: string
  label: string
  labelEn: string
  /** 待處理數量 key（由 server 填）；冇就唔顯示 badge。 */
  badgeKey?: string
}

export type FounderNavGroup = {
  id: string
  label: string
  items: FounderNavItem[]
}

export const FOUNDER_NAV: FounderNavGroup[] = [
  {
    id: 'command',
    label: '指揮',
    items: [
      { href: '/founder', label: '指揮中心', labelEn: 'Command Center' },
      { href: '/founder/briefing', label: '每日簡報', labelEn: 'Daily Briefing' },
      { href: '/founder/decisions', label: '待決策', labelEn: 'Decisions', badgeKey: 'decisions' },
      { href: '/founder/goals', label: '目標及任務', labelEn: 'Goals' },
    ],
  },
  {
    id: 'students',
    label: '學生與學習',
    items: [
      { href: '/founder/students', label: '學生總覽', labelEn: 'Students' },
      { href: '/founder/students/retention', label: '留存及分群', labelEn: 'Retention' },
      { href: '/founder/students/effectiveness', label: '學習成效', labelEn: 'Effectiveness' },
    ],
  },
  {
    id: 'subjects',
    label: '科目與課程',
    items: [
      { href: '/founder/subjects', label: '科目星圖', labelEn: 'Subjects' },
      { href: '/founder/subjects/coverage', label: '題庫覆蓋缺口', labelEn: 'Coverage Gaps' },
    ],
  },
  {
    id: 'questions',
    label: '題庫工場',
    items: [
      { href: '/founder/questions', label: '題目列表', labelEn: 'Questions' },
      { href: '/founder/questions/batches', label: '發佈批次', labelEn: 'Publish Batches', badgeKey: 'batches' },
      { href: '/founder/questions/import', label: '批量匯入', labelEn: 'Import' },
    ],
  },
  {
    id: 'ai',
    label: 'AI 與批改',
    items: [
      { href: '/founder/ai', label: 'AI 任務', labelEn: 'AI Jobs', badgeKey: 'aiJobs' },
      { href: '/founder/ai/models', label: '模型與供應商', labelEn: 'Models' },
      { href: '/founder/ai/prompts', label: 'Prompt 版本', labelEn: 'Prompts' },
      { href: '/founder/ai/evals', label: '評測資料集', labelEn: 'Evals' },
    ],
  },
  {
    id: 'quality',
    label: '品質與風險',
    items: [
      { href: '/founder/quality', label: '覆核隊列', labelEn: 'Review Queue', badgeKey: 'reviews' },
      { href: '/founder/quality/reports', label: '錯題回報', labelEn: 'Reports', badgeKey: 'reports' },
      { href: '/founder/quality/copyright', label: '版權疑慮', labelEn: 'Copyright' },
    ],
  },
  {
    id: 'growth',
    label: '增長與實驗',
    items: [
      { href: '/founder/growth', label: '來源與漏斗', labelEn: 'Growth' },
      { href: '/founder/growth/experiments', label: '實驗', labelEn: 'Experiments' },
    ],
  },
  {
    id: 'ops',
    label: '客服與營運',
    items: [
      { href: '/founder/ops', label: '工單與任務', labelEn: 'Ops', badgeKey: 'ops' },
      { href: '/founder/ops/incidents', label: '事故', labelEn: 'Incidents', badgeKey: 'incidents' },
      { href: '/founder/ops/announcements', label: '公告', labelEn: 'Announcements' },
      { href: '/founder/ops/kb', label: '知識庫', labelEn: 'Knowledge Base' },
    ],
  },
  {
    id: 'finance',
    label: '財務與資源',
    items: [
      { href: '/founder/finance', label: '預算與成本', labelEn: 'Finance' },
    ],
  },
  {
    id: 'engineering',
    label: '工程與安全',
    items: [
      { href: '/founder/engineering', label: '服務健康', labelEn: 'Health' },
      { href: '/founder/engineering/sessions', label: 'Session 管理', labelEn: 'Sessions' },
      { href: '/founder/engineering/security', label: '安全事件', labelEn: 'Security' },
    ],
  },
  {
    id: 'settings',
    label: '設定與審計',
    items: [
      { href: '/founder/settings', label: 'Founder 身份', labelEn: 'Identity' },
      { href: '/founder/settings/flags', label: '功能開關', labelEn: 'Flags' },
      { href: '/founder/settings/audit', label: '操作審計', labelEn: 'Audit' },
      { href: '/founder/settings/integrations', label: '整合設定', labelEn: 'Integrations' },
    ],
  },
]

export const FOUNDER_ALL_HREFS: string[] = FOUNDER_NAV.flatMap((g) => g.items.map((i) => i.href))

export type FounderWorkMode = 'command' | 'work' | 'incident'

export const FOUNDER_WORK_MODES: { id: FounderWorkMode; label: string; description: string }[] = [
  { id: 'command', label: '指揮模式', description: '總覽、情報、中央核心、快捷操作' },
  { id: 'work', label: '工作模式', description: '大表格、篩選、編輯、批量處理' },
  { id: 'incident', label: '事故模式', description: '受影響服務、時間線、緩解與恢復' },
]
