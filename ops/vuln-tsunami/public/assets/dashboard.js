const $ = (id) => document.getElementById(id)

let state = null
let waveAnimUntil = 0
let lastLevel = 1

function escapeHtml(s) {
  return String(s ?? '')
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

function tickClock() {
  const now = new Date()
  $('clock').textContent = now.toLocaleTimeString('zh-HK', {
    hour12: false,
    timeZone: 'Asia/Hong_Kong',
  })
}

function drawWave(points, heightPct, animating) {
  const canvas = $('wave')
  const ctx = canvas.getContext('2d')
  const dpr = window.devicePixelRatio || 1
  const cssW = canvas.clientWidth || 1200
  const cssH = 220
  canvas.width = Math.floor(cssW * dpr)
  canvas.height = Math.floor(cssH * dpr)
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
  ctx.clearRect(0, 0, cssW, cssH)

  // grid already on body; subtle axes
  ctx.strokeStyle = 'rgba(0,245,255,0.15)'
  ctx.lineWidth = 1
  ctx.beginPath()
  ctx.moveTo(40, 10)
  ctx.lineTo(40, cssH - 24)
  ctx.lineTo(cssW - 10, cssH - 24)
  ctx.stroke()

  if (!points?.length) {
    ctx.fillStyle = '#7a9aa0'
    ctx.font = '14px Inter, sans-serif'
    ctx.fillText('暫無數據', 56, cssH / 2)
    return
  }

  const ts = points.map((p) => p.t)
  const minT = Math.min(...ts)
  const maxT = Math.max(...ts, minT + 1)
  const amp = Math.max(0.25, (heightPct || 40) / 100)
  const tNow = performance.now()
  const wobble = animating ? Math.sin(tNow / 180) * 4 : 0

  const xy = points.map((p, i) => {
    const x = 40 + ((p.t - minT) / (maxT - minT)) * (cssW - 60)
    const yBase = cssH - 24 - (p.y / 10) * (cssH - 50) * amp
    const y = yBase + (animating ? Math.sin(i + tNow / 220) * 3 + wobble : 0)
    return { x, y, tier: p.tier, id: p.id }
  })

  // cyan main wave
  ctx.beginPath()
  ctx.strokeStyle = '#00f5ff'
  ctx.lineWidth = 2
  xy.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)))
  ctx.stroke()

  // magenta dashed for critical
  const crits = xy.filter((p) => p.tier === 'critical')
  if (crits.length) {
    ctx.beginPath()
    ctx.setLineDash([6, 5])
    ctx.strokeStyle = '#ff0055'
    ctx.lineWidth = 1.5
    crits.forEach((p, i) => (i === 0 ? ctx.moveTo(p.x, p.y) : ctx.lineTo(p.x, p.y)))
    ctx.stroke()
    ctx.setLineDash([])
  }

  xy.forEach((p) => {
    ctx.fillStyle = p.tier === 'critical' ? '#ff0055' : '#00f5ff'
    ctx.beginPath()
    ctx.arc(p.x, p.y, 3.2, 0, Math.PI * 2)
    ctx.fill()
  })

  ctx.fillStyle = '#7a9aa0'
  ctx.font = '11px JetBrains Mono, monospace'
  ctx.fillText('X=發布時間', 48, 18)
  ctx.fillText('Y=CVSS', 48, 32)
}

function renderAssets(assets) {
  const grid = $('asset-grid')
  const cells = Array.from({ length: 16 }, (_, i) => assets[i] || null)
  grid.innerHTML = cells
    .map((a) => {
      if (!a) {
        return `<div class="asset-cell"><p class="name">—</p><p class="meta">empty</p></div>`
      }
      return `<div class="asset-cell">
        <p class="name">${escapeHtml(a.name)}</p>
        <p class="meta">${escapeHtml(a.id)} · I${a.importance} E${a.exposure}</p>
      </div>`
    })
    .join('')
}

function renderCves(cves) {
  const body = $('cve-body')
  const empty = $('empty-cve')
  if (!cves?.length) {
    body.innerHTML = ''
    empty.hidden = false
    return
  }
  empty.hidden = true
  body.innerHTML = cves
    .map((c) => {
      const nvd = `https://nvd.nist.gov/vuln/detail/${encodeURIComponent(c.id)}`
      const zh = c.translateFailed
        ? '[翻譯失敗]'
        : c.descriptionZh || c.description
      const en = c.descriptionEn || c.description
      const assets = (c.assets || []).map((a) => a.name).join('、') || '—'
      const src = (c.sources || []).join('+') || '—'
      const blocked = c.blocked
      return `<tr class="${blocked ? 'blocked-row' : ''}" data-id="${escapeHtml(c.id)}">
        <td><a href="${nvd}" target="_blank" rel="noopener noreferrer">${escapeHtml(c.id)}</a>${c.simulated ? ' <span class="pill">模擬</span>' : ''}${c.kev ? ' <span class="pill">KEV</span>' : ''}</td>
        <td><span class="badge ${escapeHtml(c.tier)}">${c.cvss ?? '—'}</span></td>
        <td class="mono">${c.tsunamiScore ?? '—'}</td>
        <td>${escapeHtml(c.tierZh || '—')}</td>
        <td><span class="pill">${escapeHtml(src)}</span></td>
        <td>
          <p class="desc-zh">${escapeHtml(zh)}</p>
          <p class="desc-en">${escapeHtml(en)}</p>
        </td>
        <td>${escapeHtml(assets)}</td>
        <td>
          <button type="button" class="btn block ${blocked ? 'blocked' : ''}" data-block="${escapeHtml(c.id)}" ${blocked ? 'disabled' : ''}>
            ${blocked ? '已攔截' : '一鍵封鎖'}
          </button>
        </td>
      </tr>`
    })
    .join('')
}

function renderLogs(logs) {
  $('log').textContent = (logs || []).join('\n') || '—'
}

function applyLevel(level) {
  const el = $('level-badge')
  el.textContent = level.label || 'LEV1'
  el.classList.remove('lev4', 'lev5')
  if (level.level >= 5) el.classList.add('lev5')
  else if (level.level >= 4) el.classList.add('lev4')

  if (level.level >= 5 && lastLevel < 5) {
    document.body.classList.add('shake')
    $('quake').hidden = false
    setTimeout(() => {
      document.body.classList.remove('shake')
      $('quake').hidden = true
    }, 2400)
    if (window.Notification?.permission === 'granted') {
      new Notification('Vuln Tsunami LEV5', { body: '嚴重漏洞海嘯 — 立即處理' })
    } else if (window.Notification?.permission !== 'denied') {
      Notification.requestPermission()
    }
  }
  lastLevel = level.level || 1
}

function applyState(s) {
  state = s
  const t = s.translate || {}
  const cacheBits =
    t.sqliteRows != null
      ? ` · 快取 ${t.sqliteRows}（命中 mem ${t.hitsMem ?? 0}/db ${t.hitsDb ?? 0}）`
      : ''
  $('translate-progress').textContent = `已翻譯 ${t.translated ?? 0}/${t.total ?? 0}${cacheBits}`
  $('translate-toggle').checked = t.enabled !== false
  $('countdown').textContent = `${s.countdownSec ?? 0}s`
  $('last-update').textContent = s.lastIngestAt
    ? `最後更新：${new Date(s.lastIngestAt).toLocaleString('zh-HK', { timeZone: 'Asia/Hong_Kong' })}`
    : '最後更新：—'
  $('source-badge').textContent = s.simulated
    ? `[模擬] ${s.lastIngestSource || 'mock'}`
    : s.lastIngestSource || '—'
  const waf = s.wafEdr
  $('waf-edr').textContent = waf
    ? `WAF ${waf.waf?.status || '—'} · EDR ${waf.edr?.status || '—'}`
    : 'WAF/EDR：—'

  if (s.ingestError) {
    $('status-msg').textContent = s.ingestError
    $('status-msg').classList.add('err')
  } else {
    const feeds = (s.ingestSources || []).join('+') || s.lastIngestSource || '—'
    const win = s.level?.critCount ?? 0
    $('status-msg').textContent = s.refreshing
      ? '刷新中…'
      : `feeds=${feeds} · 海嘯分合計=${s.tsunamiSum ?? 0} · 10分窗嚴重=${win} · ${s.level?.label || ''}`
    $('status-msg').classList.remove('err')
  }

  $('spinner').hidden = !s.refreshing
  $('btn-refresh').disabled = Boolean(s.refreshing)

  applyLevel(s.level || { level: 1, label: 'LEV1' })
  renderCves(s.cves || [])
  renderAssets(s.assets || [])
  renderLogs(s.logs || [])

  const animating = performance.now() < waveAnimUntil
  drawWave(s.wave || [], s.waveHeight || 40, animating)
}

async function fetchState() {
  const res = await fetch('/api/state', { cache: 'no-store' })
  if (!res.ok) throw new Error(`state ${res.status}`)
  applyState(await res.json())
}

async function doRefresh() {
  waveAnimUntil = performance.now() + 10_000
  $('spinner').hidden = false
  $('btn-refresh').disabled = true
  $('status-msg').textContent = '刷新中（約 10–20 秒）…'
  try {
    const res = await fetch('/api/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: '{}',
    })
    const data = await res.json()
    if (!res.ok) throw new Error(data.error || `refresh ${res.status}`)
    applyState(data)
  } catch (err) {
    $('status-msg').textContent = err instanceof Error ? err.message : String(err)
    $('status-msg').classList.add('err')
  } finally {
    $('spinner').hidden = true
    $('btn-refresh').disabled = false
  }
}

async function blockCve(id) {
  const res = await fetch('/api/block', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ cveId: id }),
  })
  const data = await res.json()
  if (!res.ok) throw new Error(data.error || 'block failed')
  applyState(data.state)
}

$('btn-refresh').addEventListener('click', () => doRefresh())
$('translate-toggle').addEventListener('change', async (e) => {
  const enabled = e.target.checked
  const res = await fetch('/api/translate-toggle', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ enabled }),
  })
  const data = await res.json()
  if (data.state) applyState(data.state)
})

$('cve-body').addEventListener('click', async (e) => {
  const btn = e.target.closest('[data-block]')
  if (!btn) return
  btn.disabled = true
  try {
    await blockCve(btn.getAttribute('data-block'))
  } catch (err) {
    $('status-msg').textContent = err instanceof Error ? err.message : String(err)
    $('status-msg').classList.add('err')
    btn.disabled = false
  }
})

$('btn-defense').addEventListener('click', async () => {
  $('defense-msg').textContent = 'Defense Matrix 執行中…'
  const res = await fetch('/api/defense', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: '{}',
  })
  const data = await res.json()
  if (data.state) applyState(data.state)
  $('defense-msg').textContent = data.run
    ? `Matrix ${data.run.level} · WAF ${data.run.waf?.rules ?? 0} 條 · 已寫入日誌`
    : data.error || '完成'
})

$('btn-edr').addEventListener('click', async () => {
  const res = await fetch('/api/edr-isolate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ hostId: 'founder-mac' }),
  })
  const data = await res.json()
  $('defense-msg').textContent = data.message || 'EDR'
  fetchState().catch(() => {})
})

$('btn-patch').addEventListener('click', async () => {
  const res = await fetch('/api/patch-schedule', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ package: 'next' }),
  })
  const data = await res.json()
  $('defense-msg').textContent = data.message || 'Patch'
  fetchState().catch(() => {})
})

tickClock()
setInterval(tickClock, 1000)

// poll state for countdown / logs; wave micro-motion while animating
setInterval(() => {
  fetchState().catch(() => {})
}, 1000)

function rafWave() {
  if (state && performance.now() < waveAnimUntil) {
    drawWave(state.wave || [], state.waveHeight || 40, true)
  }
  requestAnimationFrame(rafWave)
}
rafWave()

fetchState()
  .then(() => {
    // first paint — if empty, kick a refresh
    if (!state?.cves?.length) doRefresh()
  })
  .catch((err) => {
    $('status-msg').textContent = err instanceof Error ? err.message : String(err)
    $('status-msg').classList.add('err')
  })
