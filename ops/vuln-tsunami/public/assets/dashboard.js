const $ = (id) => document.getElementById(id)

function escapeHtml(s) {
  return String(s)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

function primaryAction(alert) {
  const hit = alert.hits?.[0]
  if (alert.cve.kev) {
    return `將 ${alert.cve.id} 當已實戰利用（CISA KEV）處理。${hit?.actionHint || '立即修補。'}`
  }
  return hit?.actionHint || `檢視 ${alert.cve.id}`
}

function renderAlerts(alerts) {
  const list = $('alert-list')
  const top = (alerts || []).slice(0, 5)
  $('alerts-count').textContent =
    top.length === 0 ? '暫無 NEW 告警' : `顯示 ${top.length} 條${alerts.length > 5 ? `（另有 ${alerts.length - 5}）` : ''}`

  if (!top.length) {
    list.innerHTML = '<li class="empty">未有 NEW 告警。撳「立即掃描」拉取 NVD。</li>'
    return
  }

  list.innerHTML = top
    .map((alert, i) => {
      const c = alert.cve
      const sev = String(c.severity || 'UNKNOWN').toLowerCase()
      const labels = (alert.hits || []).map((h) => h.label).join(' · ')
      const link = c.references?.[0]
        ? `<p><a href="${escapeHtml(c.references[0])}" target="_blank" rel="noopener noreferrer">打開參考</a></p>`
        : ''
      return `<li class="${escapeHtml(sev)}">
        <div class="id">${i + 1}. ${escapeHtml(c.id)} · ${escapeHtml(c.severity)}${c.score != null ? ` ${c.score}` : ''}${c.kev ? ' · KEV' : ''} · ${escapeHtml(labels)}</div>
        <p class="do">${escapeHtml(primaryAction(alert))}</p>
        <p class="desc">${escapeHtml(c.description || '')}</p>
        ${link}
      </li>`
    })
    .join('')
}

function applySnapshot(data) {
  const counts = data.state?.lastCounts
  const last = data.state?.lastRunAt
  const keyOk = data.hasKey

  if (!keyOk) {
    $('next-action').textContent =
      '先喺 ops/vuln-tsunami/.env 寫入 NVD_API_KEY，然後撳「立即掃描」。'
  } else if (data.latestRun?.newAlerts?.length) {
    $('next-action').textContent = primaryAction(data.latestRun.newAlerts[0])
  } else if (last) {
    $('next-action').textContent = '未有 NEW 告警。可以再掃一次，或等 launchd 自動跑。'
  } else {
    $('next-action').textContent = '撳「立即掃描」開始第一次 NVD 監察。'
  }

  const parts = []
  parts.push(keyOk ? 'NVD key：已載入' : 'NVD key：未設定')
  if (last) parts.push(`上次：${new Date(last).toLocaleString('zh-HK', { timeZone: 'Asia/Hong_Kong' })}`)
  if (counts) parts.push(`掃描 ${counts.scanned} · 告警 ${counts.alerts} · NEW ${counts.newAlerts}`)
  $('status-line').textContent = parts.join(' · ')

  if (data.latestRun?.newAlerts) renderAlerts(data.latestRun.newAlerts)
  else if (data.latestReport) {
    $('alert-list').innerHTML =
      '<li class="empty">有文字報告。撳「立即掃描」刷新結構化告警。</li>'
  } else {
    renderAlerts([])
  }

  if (data.latestReport) {
    $('report').hidden = false
    $('report').textContent = data.latestReport
  }
}

async function refresh() {
  const res = await fetch('/api/status', { cache: 'no-store' })
  if (!res.ok) throw new Error(`status ${res.status}`)
  applySnapshot(await res.json())
}

async function scan() {
  const btn = $('btn-scan')
  const hours = Number($('hours').value) || 24
  btn.disabled = true
  $('next-action').textContent = `掃描進行中（約 1–2 分鐘，回溯 ${hours} 小時）…`
  $('status-line').textContent = '正在呼叫 NVD…'
  try {
    const res = await fetch('/api/scan', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ hours, notify: false }),
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || `scan ${res.status}`)

    if (data.newAlerts?.length) {
      $('next-action').textContent = primaryAction(data.newAlerts[0])
    } else {
      $('next-action').textContent = '呢次窗口冇 NEW 告警。堆疊監察正常。'
    }
    renderAlerts(data.newAlerts || [])
    if (data.reportText) {
      $('report').hidden = false
      $('report').textContent = data.reportText
    }
    const c = data.counts || {}
    $('status-line').textContent = `完成 · 掃描 ${c.scanned ?? '—'} · 告警 ${c.alerts ?? '—'} · NEW ${c.newAlerts ?? '—'}`
  } catch (err) {
    $('next-action').textContent =
      err instanceof Error ? err.message : String(err)
    $('status-line').textContent = '掃描失敗。檢查 .env 入面嘅 NVD_API_KEY，再試一次。'
  } finally {
    btn.disabled = false
  }
}

$('btn-scan').addEventListener('click', scan)
refresh().catch((err) => {
  $('next-action').textContent = `載入失敗：${err instanceof Error ? err.message : err}`
})
