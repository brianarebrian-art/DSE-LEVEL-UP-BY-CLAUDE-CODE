/* delivery.js — 30 秒速遞動畫（spec §4.2.3 Step 3-4）
 *
 * 速遞員由左至右橫穿畫面，進度條 0→100%，文字每 5 秒輪播。
 * 「跳過動畫」永遠喺度（ADHD 友善：唔強迫等）。
 */
(function () {
  'use strict';

  var S = window.SM;
  var DURATION = 30000;
  var LINES = [
    '整理緊你嘅貨品…',
    '包緊靚靚嘅包裝…',
    '速遞員出發緊…',
    '就快到啦，準備收貨！',
  ];

  var timer = null;
  var rafId = null;
  var pending = null;

  function start(bought) {
    pending = bought;
    S.ui.view = 'delivery';
    S.render();
  }

  function render(root) {
    var reduced = window.matchMedia &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    root.innerHTML =
      '<div class="page-head"><div class="icon" aria-hidden="true">📦</div><h1>送貨中</h1></div>' +
      '<div class="delivery">' +
        '<div class="city" aria-hidden="true"></div>' +
        '<div class="road" aria-hidden="true"></div>' +
        '<div class="bubble" id="sm-bubble">送緊嚟啦，等陣！</div>' +
        '<div class="courier" aria-hidden="true">' +
          '<span class="head"></span><span class="body"></span>' +
          '<span class="parcel"></span>' +
          '<span class="leg l"></span><span class="leg r"></span>' +
        '</div>' +
      '</div>' +
      '<div class="progress-wrap">' +
        '<div class="progress" role="progressbar" aria-label="送貨進度" ' +
             'aria-valuemin="0" aria-valuemax="100" aria-valuenow="0" id="sm-bar">' +
          '<i></i></div>' +
        '<p class="progress-text" id="sm-ptext" aria-live="polite">' + LINES[0] + '</p>' +
      '</div>' +
      '<button class="btn" id="sm-skip" style="width:100%;margin-top:8px">跳過動畫，直接收貨</button>';

    var stage = root.querySelector('.delivery');
    stage.style.setProperty('--walk-dur', (reduced ? 0.001 : DURATION / 1000) + 's');

    root.querySelector('#sm-skip').addEventListener('click', finish);

    if (reduced) { finish(); return; }

    var t0 = Date.now();
    var bar = root.querySelector('#sm-bar');
    var fill = bar.querySelector('i');
    var ptext = root.querySelector('#sm-ptext');

    function tick() {
      var pct = Math.min(100, ((Date.now() - t0) / DURATION) * 100);
      fill.style.width = pct + '%';
      bar.setAttribute('aria-valuenow', String(Math.round(pct)));
      var idx = Math.min(LINES.length - 1, Math.floor((Date.now() - t0) / 5000));
      if (ptext.textContent !== LINES[idx]) ptext.textContent = LINES[idx];
      if (pct < 100) rafId = requestAnimationFrame(tick);
    }
    rafId = requestAnimationFrame(tick);
    timer = setTimeout(finish, DURATION);
  }

  function stop() {
    if (timer) { clearTimeout(timer); timer = null; }
    if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
  }

  function finish() {
    stop();
    if (!pending) return;
    var bought = pending;
    pending = null;

    // 入儲物櫃
    Object.keys(bought).forEach(function (id) {
      S.state.inventory[id] = (S.state.inventory[id] || 0) + bought[id];
    });
    // 買食品會攞到包裝紙（DIY 材料，spec §4.3.8）
    var foodCount = Object.keys(bought).filter(function (id) {
      var p = S.productIndex[id];
      return p && p.kind === 'goods';
    }).length;
    if (foodCount) S.state.materials.paper += foodCount;

    var names = Object.keys(bought).map(function (id) {
      var p = S.productIndex[id];
      return p ? p.emoji + ' ' + p.name : '';
    }).filter(Boolean);

    if (!S.state.log.firstOrderDone) S.state.log.firstOrderDone = true;
    S.save();
    window.SMAudio.arrive();

    S.modal(
      '<div class="delivered-card">' +
        '<div class="tick" aria-hidden="true">📦</div>' +
        '<h2>到咗！</h2>' +
        '<p class="detail-desc">' + names.join('、') + '<br>已經放入你嘅儲物櫃。</p>' +
      '</div>',
      [
        { label: '擺入屋企', cls: 'btn-primary', act: function () { S.go('home'); } },
        { label: '遲啲先', cls: '', act: function () { S.go('shop'); } },
      ]
    );
  }

  window.SMDelivery = { start: start, render: render, stop: stop };
})();
