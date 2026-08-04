/* main.js — 入口：狀態、路由（純顯示／隱藏 section）、共用 UI 原語
 *
 * 依賴載入次序：products → storage → economy → audio → fengshui → cha
 *              → shop / delivery / home / diy → main（本檔）
 */
(function () {
  'use strict';

  var S = window.SM;

  S.state = window.SMStore.load();
  S.cart = {};
  S.productIndex = {};
  window.SM_PRODUCTS.forEach(function (p) { S.productIndex[p.id] = p; });

  S.ui = {
    view: 'shop',
    cat: 'all',
    query: '',
    room: 'main',
    holding: null,
    lastFs: window.SMFengshui.evaluate(S.state.home.rooms.main, S.productIndex),
  };

  var $view = document.getElementById('view');
  var $coins = document.getElementById('coins');
  var $search = document.getElementById('search');
  var $cartBtn = document.getElementById('nav-cart');
  var $modalRoot = document.getElementById('modal-root');
  var $toast = document.getElementById('toast');

  // ── 共用原語 ─────────────────────────────────────────────────────────────
  S.save = function () { window.SMStore.save(S.state); };

  S.go = function (view) {
    window.SMDelivery.stop();
    S.ui.view = view;
    S.closeModal();
    window.scrollTo(0, 0);
    S.render();
  };

  var lastFocus = null;
  S.modal = function (html, actions) {
    lastFocus = document.activeElement;
    var btns = (actions || []).map(function (a, i) {
      return '<button class="btn ' + (a.cls || '') + '" data-act="' + i + '">' + a.label + '</button>';
    }).join('');
    $modalRoot.innerHTML =
      '<div class="modal-backdrop"><div class="modal" role="dialog" aria-modal="true">' +
      html + '<div class="modal-actions">' + btns + '</div></div></div>';
    $modalRoot.hidden = false;
    $modalRoot.querySelectorAll('[data-act]').forEach(function (b, i) {
      b.addEventListener('click', function () {
        var a = actions[i];
        if (a && a.act) a.act(); else S.closeModal();
      });
    });
    var first = $modalRoot.querySelector('.btn');
    if (first) first.focus();
  };

  S.closeModal = function () {
    $modalRoot.hidden = true;
    $modalRoot.innerHTML = '';
    if (lastFocus && lastFocus.focus) { try { lastFocus.focus(); } catch (e) {} }
  };

  var toastTimer = null;
  S.toast = function (msg) {
    $toast.textContent = msg;
    $toast.hidden = false;
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { $toast.hidden = true; }, 2200);
  };

  // ── 渲染 ─────────────────────────────────────────────────────────────────
  var lastCoins = null;
  S.render = function () {
    $coins.textContent = '🪙 ' + window.SMEconomy.format(S.state.coins);
    if (lastCoins !== null && lastCoins !== S.state.coins) {
      $coins.classList.remove('bump');
      void $coins.offsetWidth;
      $coins.classList.add('bump');
    }
    lastCoins = S.state.coins;

    var n = window.SMShop.cartCount();
    $cartBtn.textContent = n ? '🧺 購物車 (' + n + ')' : '🧺 購物車';

    // 搜尋欄只喺逛超市時有意義
    $search.hidden = S.ui.view !== 'shop';

    switch (S.ui.view) {
      case 'shop':     window.SMShop.renderShop($view); break;
      case 'cart':     window.SMShop.renderCart($view); break;
      case 'delivery': window.SMDelivery.render($view); break;
      case 'home':     window.SMHome.renderHome($view); break;
      case 'locker':   window.SMHome.renderLocker($view); break;
      case 'expand':   window.SMHome.renderExpand($view); break;
      case 'diy':      window.SMDiy.render($view); break;
      case 'cha':      renderCha($view); break;
      case 'settings': renderSettings($view); break;
      default:         window.SMShop.renderShop($view);
    }
  };

  // ── 溫馨家協會評分 ───────────────────────────────────────────────────────
  function renderCha(root) {
    var fs = window.SMFengshui.evaluate(S.state.home.rooms.main, S.productIndex);
    var sc = window.SMCha.score(S.state, S.productIndex, fs);
    var lv = window.SMCha.levelFor(sc);
    var due = window.SMCha.isDue(S.state);
    var prev = S.state.cha.level;
    var levelledUp = due && prev !== lv.name;

    if (due) {
      var reward = window.SMCha.LEVELS ? window.SMEconomy.EARN.chaRate : 100;
      if (levelledUp) reward += window.SMEconomy.EARN.chaLevelUp;
      window.SMEconomy.grant(S.state, reward);
      S.state.materials.inspiration += 2;
      S.state.cha = { level: lv.name, lastRated: Date.now() };
      S.save();
      S.ui.chaReward = reward;
    }

    root.innerHTML =
      '<div class="page-head"><div class="icon" aria-hidden="true">🏡</div><h1>溫馨家協會</h1></div>' +
      '<div class="cha-badge" aria-hidden="true">' + lv.emoji + '</div>' +
      '<p class="cha-level">' + lv.name + '</p>' +
      '<p class="cha-words">' + lv.words + '</p>' +
      '<div class="cha-snap" aria-hidden="true">🏠</div>' +
      (due ? '<p class="cha-reward">評分獎勵 🪙 ' + window.SMEconomy.format(S.ui.chaReward) +
             '　＋　靈感碎片 ×2</p>' : '') +
      '<p class="cha-next">' + (due ? '' : window.SMCha.nextDueText(S.state)) + '</p>' +
      '<div class="room-toolbar" style="margin-top:20px">' +
      '<button class="btn" data-nav="home">🏠 返屋企</button></div>';

    root.querySelectorAll('[data-nav]').forEach(function (b) {
      b.addEventListener('click', function () { S.go(b.dataset.nav); });
    });
  }

  // ── 設定（SEN 模式 / 高對比 / 音效 / 備份）───────────────────────────────
  function applySettings() {
    var st = S.state.settings;
    document.documentElement.classList.toggle('sen', !!st.sen);
    document.documentElement.classList.toggle('hc', !!st.hc);
    window.SMAudio.setEnabled(!!st.sound);
  }

  function renderSettings(root) {
    var st = S.state.settings;
    function row(key, label, hint) {
      return '<div class="settings-row"><span class="label">' + label +
        '<small>' + hint + '</small></span>' +
        '<button class="toggle" data-set="' + key + '" aria-pressed="' + !!st[key] + '">' +
        (st[key] ? '已開' : '關閉') + '</button></div>';
    }
    root.innerHTML =
      '<div class="page-head"><div class="icon" aria-hidden="true">⚙️</div><h1>設定</h1></div>' +
      row('sen', 'SEN 專注模式', '放大字體、加大按鈕、減慢動畫、易讀字體') +
      row('hc', '高對比模式', '加深底色、提高文字亮度') +
      row('sound', '音效', '加入購物車、送達、擺家具嘅輕微提示音') +
      '<div class="settings-row"><span class="label">備份碼<small>複製低就可以喺第二部機恢復</small></span>' +
      '<button class="btn" data-export>複製</button></div>' +
      '<div class="settings-row"><span class="label">還原備份<small>貼返個碼入去</small></span>' +
      '<button class="btn" data-import>貼上</button></div>' +
      '<div class="room-toolbar" style="margin-top:18px">' +
      '<button class="btn" data-nav="shop">🛒 返超市</button></div>';

    root.querySelectorAll('[data-set]').forEach(function (b) {
      b.addEventListener('click', function () {
        var k = b.dataset.set;
        st[k] = !st[k];
        S.save();
        applySettings();
        S.render();
      });
    });
    root.querySelector('[data-export]').addEventListener('click', function () {
      var code = window.SMStore.exportCode(S.state);
      if (navigator.clipboard) navigator.clipboard.writeText(code).catch(function () {});
      S.modal('<h2>備份碼</h2><p class="caption" style="word-break:break-all;max-height:30vh;overflow:auto">' +
        code + '</p><p class="detail-meta">已試過幫你複製。收埋佢就得。</p>',
        [{ label: '知道喇', cls: 'btn-primary', act: null }]);
    });
    root.querySelector('[data-import]').addEventListener('click', function () {
      var code = window.prompt('貼上備份碼：');
      if (!code) return;
      var parsed = window.SMStore.importCode(code);
      if (!parsed) { S.toast('個碼好似有啲問題，再試下？'); return; }
      S.state = Object.assign(window.SMStore.defaults(), parsed);
      S.save();
      applySettings();
      S.toast('還原咗喇');
      S.render();
    });
    root.querySelectorAll('[data-nav]').forEach(function (b) {
      b.addEventListener('click', function () { S.go(b.dataset.nav); });
    });
  }

  // ── 事件綁定 ─────────────────────────────────────────────────────────────
  $search.addEventListener('input', function () { S.ui.query = $search.value; S.render(); });
  document.getElementById('nav-shop').addEventListener('click', function () { S.go('shop'); });
  $cartBtn.addEventListener('click', function () { S.go('cart'); });
  document.getElementById('nav-home').addEventListener('click', function () { S.go('home'); });
  document.getElementById('nav-cha').addEventListener('click', function () { S.go('cha'); });
  document.getElementById('nav-diy').addEventListener('click', function () { S.go('diy'); });
  document.getElementById('nav-settings').addEventListener('click', function () { S.go('settings'); });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && !$modalRoot.hidden) S.closeModal();
  });

  // 停留 3 分鐘無操作 → 溫柔提示（spec §4.4）
  var idleTimer = null;
  var $idle = document.getElementById('idle');
  function resetIdle() {
    $idle.hidden = true;
    clearTimeout(idleTimer);
    idleTimer = setTimeout(function () { $idle.hidden = false; }, 180000);
  }
  ['click', 'keydown', 'input', 'touchstart'].forEach(function (ev) {
    document.addEventListener(ev, resetIdle, { passive: true });
  });

  // ── 入場 ─────────────────────────────────────────────────────────────────
  applySettings();
  resetIdle();

  var hasLuck = S.ui.lastFs.indexOf('luck') >= 0;
  var settled = window.SMEconomy.settleOnEnter(S.state, hasLuck);
  S.save();
  S.render();

  if (settled.total > 0) {
    S.modal(
      '<h2>🪙 入賬</h2>' +
      settled.lines.map(function (l) {
        return '<div class="settings-row"><span class="label">' + l.label +
          '</span><span style="color:var(--neon-yellow)">＋' + l.amount + '</span></div>';
      }).join('') +
      '<p class="detail-meta" style="margin-top:12px">溫習幣只會喺呢度用，同真實金錢冇任何關係。</p>',
      [{ label: '入去行下', cls: 'btn-primary', act: null }]
    );
  }
})();
