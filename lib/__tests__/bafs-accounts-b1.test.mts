// ============================================================================
// bafs-accounts-b1.test.mts — arithmetic check for the BAFS accounting drafts
// ----------------------------------------------------------------------------
// Every statement is recomputed here from the figures given in the question,
// independently of the script that wrote the drafts, and each result must appear
// in both the Chinese and English reference answers. Statements of financial
// position must balance.
//
// A green test does NOT mean the questions may go live. It proves only that the
// numbers are consistent. Syllabus fit, wording and mark allocation need a person
// (charter §12: the machine never promotes anything).
// ============================================================================
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

const DRAFT = 'scripts/qbank/drafts/bafs-accounts-b1.json'
type Row = { id: string; question: string; questionEn: string; referenceAnswer: string; referenceAnswerEn: string }
const rows: Row[] = JSON.parse(readFileSync(DRAFT, 'utf8'))
const row = (id: string) => {
  const r = rows.find((x) => x.id === id)
  assert.ok(r, `draft has no ${id}`)
  return r!
}

/** Money as the drafts write it: \$93,500 and −\$300. */
const $ = (n: number) => (n < 0 ? '−' : '') + '\\$' + Math.abs(n).toLocaleString('en-US')
/** Integer percentage, avoiding floating point (45000 × 4% must be exactly 1800). */
const pct = (n: number, p: number) => (n * p) / 100

function inQuestion(id: string, ...ns: number[]) {
  const r = row(id)
  for (const n of ns) {
    assert.ok(r.question.includes($(n)), `${id}: question should show ${$(n)}`)
    assert.ok(r.questionEn.includes($(n)), `${id}: questionEn should show ${$(n)}`)
  }
}
function inAnswer(id: string, ...ns: number[]) {
  const r = row(id)
  for (const n of ns) {
    assert.ok(r.referenceAnswer.includes($(n)), `${id}: referenceAnswer should show ${$(n)}`)
    assert.ok(r.referenceAnswerEn.includes($(n)), `${id}: referenceAnswerEn should show ${$(n)}`)
  }
}

test('five questions, unique ids', () => {
  assert.equal(rows.length, 5)
  assert.equal(new Set(rows.map((r) => r.id)).size, 5)
})

test('01 statement of financial position balances', () => {
  const nbv = 60000 - 18000
  const ca = 25000 + 16000 + 9000 + 1500
  const ta = nbv + ca
  const tl = 13500 + 30000
  const cap = 40000 + 22000 - 12000
  assert.equal(ta, tl + cap)
  inQuestion('bafs_acct_b1_01', 60000, 18000, 25000, 16000, 9000, 1500, 13500, 30000, 40000, 22000, 12000)
  inAnswer('bafs_acct_b1_01', nbv, ca, ta, tl, cap, ca - 13500)
})

test('02 adjustments flow into a balancing statement', () => {
  const dep = pct(120000, 15)
  const acc = 36000 + dep
  const allowance = pct(45000, 4)
  const prepaid = 39000 / 13
  assert.ok(Number.isInteger(prepaid))
  const nbv = 120000 - acc
  const ca = 38000 + (45000 - allowance) + prepaid + 800
  const ta = nbv + ca
  const cl = 27600 + 2400 + 5200
  const cap = 98000 + 41800 - 24000
  assert.equal(ta, cl + cap)
  inQuestion('bafs_acct_b1_02', 120000, 36000, 38000, 45000, 39000, 27600, 5200, 800, 98000, 24000, 2400, 41800)
  inAnswer('bafs_acct_b1_02', dep, acc, allowance, prepaid, nbv, 45000 - allowance, ca, ta, cl, cap)
})

test('03 loan split, extra capital and goods drawn; working capital is negative', () => {
  const nca = (80000 - 32000) + (45000 - 13500)
  const ca = 7200 + 1800 + 14300 + 2200
  const ta = nca + ca
  const loanCurrent = 12000
  const loanNonCurrent = 60000 - loanCurrent
  const cl = 9600 + 4200 + loanCurrent
  const drawings = 15000 + 2400
  const cap = 30000 + 10000 + 8600 - drawings
  assert.equal(ta, cl + loanNonCurrent + cap)
  const wc = ca - cl
  assert.ok(wc < 0, 'part (c) asks the student to interpret a negative figure')
  inQuestion('bafs_acct_b1_03', 80000, 32000, 45000, 13500, 7200, 1800, 14300, 2200, 9600, 4200, 60000, 12000, 30000, 10000, 8600, 15000, 2400)
  inAnswer('bafs_acct_b1_03', 80000 - 32000, 45000 - 13500, nca, ca, ta, cl, loanNonCurrent, cl + loanNonCurrent, drawings, cap, wc)
})

test('04 income statement', () => {
  const netPurchases = 318000 - 4500 + 3500
  const available = 42000 + netPurchases
  const cogs = available - 51000
  const netSales = 480000 - 6000
  const gp = netSales - cogs
  const expenses = 72000 + 54000 + 9800 + 4200 + 6000
  const profit = gp + 3000 - expenses
  inQuestion('bafs_acct_b1_04', 480000, 6000, 42000, 318000, 4500, 3500, 51000, 72000, 54000, 9800, 4200, 3000)
  inAnswer('bafs_acct_b1_04', netPurchases, available, cogs, netSales, gp, gp + 3000, expenses, profit)
})

test('05 income statement with period-end adjustments', () => {
  const rent = 66000 - 6000
  const wages = 88000 + 8000
  const closingAllowance = pct(90000, 5)
  const allowanceIncrease = closingAllowance - 3000
  const dep = pct(150000 - 54000, 20)
  const purchases = 402000 - 3000
  const available = 55000 + purchases
  const cogs = available - 61000
  const netSales = 620000 - 8000
  const gp = netSales - cogs
  const expenses = rent + wages + 12000 + 2500 + allowanceIncrease + dep + 5300
  const profit = gp - expenses
  inQuestion('bafs_acct_b1_05', 620000, 8000, 55000, 402000, 66000, 88000, 12000, 2500, 3000, 90000, 150000, 54000, 5300, 61000, 6000)
  inAnswer('bafs_acct_b1_05', rent, wages, closingAllowance, allowanceIncrease, dep, purchases, available, cogs, netSales, gp, expenses, profit)
})
