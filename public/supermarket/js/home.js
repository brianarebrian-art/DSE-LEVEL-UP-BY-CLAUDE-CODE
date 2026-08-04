/* home.js — 等角房間、家具擺放、儲物櫃、擴建（spec §4.3.1-4.3.3）
 *
 * 擺放採「點選 → 點格」兩步，唔用拖曳：
 *   • 觸控裝置拖曳成功率低，兩步式更可靠（泛自閉症：流程可預測）
 *   • 鍵盤用家一樣做得到（Tab 到格、Enter 放低）
 */
(function () {
  'use strict';

  var S = window.SM;

  var EXPANSIONS = [
    { id: 'ex1', name: '大廳擴大至 8×8', cost: 1000, apply: function (h) { h.rooms.main.size = 8; } },
    { id: 'ex2', name: '增設臥室', cost: 2500, apply: function (h) { h.rooms.bed = { size: 6, furniture: [] }; h.unlocked.push('bed'); } },
    { id: 'ex3', name: '增設客廳', cost: 4000, apply: function (h) { h.rooms.living = { size: 8, furniture: [] }; h.unlocked.push('living'); } },
    { id: 'ex4', name: '增設二樓', cost: 6000, apply: function (h) { h.rooms.upper = { size: 8, furniture: [] }; h.unlocked.push('upper'); } },
    { id: 'ex5', name: '增設地下室', cost: 8000, apply: function (h) { h.rooms.base = { size: 6, furniture: [] }; h.unlocked.push('base'); } },
  ];

  var ROOM_NAME = { main: '主房', bed: '臥室', living: '客廳', upper: '二樓', base: '地下室' };

  function room() { return S.state.home.rooms[S.ui.room] || S.state.home.rooms.main; }

  function occupiedAt(r, x, y) {
    return r.furniture.filter(function (f) { return f.x === x && f.y === y; })[0] || null;
  }

  // ── 房間 ─────────────────────────────────────────────────────────────────
  function renderHome(root) {
    var r = room();
    var size = r.size;
    var fsIds = window.SMFengshui.evaluate(S.state.home.rooms.main, S.productIndex);
    var isMain = S.ui.room === 'main';

    var tiles = '';
    for (var y = 0; y < size; y++) {
      for (var x = 0; x < size; x++) {
        var f = occupiedAt(r, x, y);
        var p = f ? S.productIndex[f.id] : null;
        var fsCls = isMain ? window.SMFengshui.zoneClassFor(x, y, size, fsIds) : '';
        var label = f && p
          ? p.name + '（' + (x + 1) + ',' + (y + 1) + '）·撳一下有選項'
          : '空位（' + (x + 1) + ',' + (y + 1) + '）' + (S.ui.holding ? '·撳一下擺低' : '');
        tiles +=
          '<button class="tile ' + (S.ui.holding ? 'pickable placing ' : 'pickable ') + fsCls +
          '" data-x="' + x + '" data-y="' + y + '" aria-label="' + label + '">' +
          (p ? '<span class="piece rot' + (f.rot || 0) + '" aria-hidden="true">' + p.emoji + '</span>' : '') +
          '</button>';
      }
    }

    var roomTabs = S.state.home.unlocked.map(function (k) {
      return '<button class="chip" data-room="' + k + '" aria-pressed="' + (S.ui.room === k) + '">' +
        (ROOM_NAME[k] || k) + '</button>';
    }).join('');

    var hint = S.ui.holding
      ? '揀好咗「' + S.productIndex[S.ui.holding].name + '」，而家撳一格擺低佢。'
      : (fsIds.length
          ? fsIds.map(function (id) { return window.SMFengshui.hintFor(id); }).join(' ')
          : '撳「儲物櫃」攞嘢出嚟擺，撳已擺嘅家具可以移動或者收返。');

    root.innerHTML =
      '<div class="page-head"><div class="icon" aria-hidden="true">🏠</div><h1>我嘅小窩</h1>' +
      '<p class="lede">慢慢砌，冇時限，冇人同你比。</p></div>' +
      '<div class="chips" role="group" aria-label="房間">' + roomTabs + '</div>' +
      '<div class="room-stage"><div class="room" style="grid-template-columns:repeat(' + size + ',42px)">' +
        tiles + '</div></div>' +
      '<p class="room-hint" aria-live="polite">' + hint + '</p>' +
      '<div class="room-toolbar">' +
        '<button class="btn" data-nav="locker">🗄️ 儲物櫃</button>' +
        '<button class="btn" data-nav="expand">🧱 擴建</button>' +
        (S.ui.holding ? '<button class="btn" data-cancel>取消擺放</button>' : '') +
      '</div>';

    root.querySelectorAll('[data-room]').forEach(function (b) {
      b.addEventListener('click', function () { S.ui.room = b.dataset.room; S.ui.holding = null; S.render(); });
    });
    root.querySelectorAll('.tile').forEach(function (b) {
      b.addEventListener('click', function () { onTile(Number(b.dataset.x), Number(b.dataset.y)); });
    });
    root.querySelectorAll('[data-nav]').forEach(function (b) {
      b.addEventListener('click', function () { S.go(b.dataset.nav); });
    });
    var cancel = root.querySelector('[data-cancel]');
    if (cancel) cancel.addEventListener('click', function () { S.ui.holding = null; S.render(); });
  }

  function onTile(x, y) {
    var r = room();
    var existing = occupiedAt(r, x, y);

    if (S.ui.holding) {
      if (existing) { S.toast('呢格有嘢喇，揀第二格啦'); return; }
      var id = S.ui.holding;
      r.furniture.push({ id: id, x: x, y: y, rot: 0 });
      S.state.inventory[id] -= 1;
      if (S.state.inventory[id] <= 0) delete S.state.inventory[id];
      S.ui.holding = null;
      window.SMAudio.place();

      // 風水觸發提示（純趣味，唔影響任何真實數據）
      var before = S.ui.lastFs || [];
      var after = window.SMFengshui.evaluate(S.state.home.rooms.main, S.productIndex);
      var fresh = after.filter(function (z) { return before.indexOf(z) === -1; });
      S.ui.lastFs = after;
      S.save();
      // 先重繪（家具落地 + 風水發光要即刻見到），再彈提示 —— 唔可以 return 咗就算，
      // 否則個件嘢同發光要離開再入返先出現。
      S.render();
      if (fresh.length) {
        window.SMAudio.sparkle();
        S.modal('<h2>✨ ' + window.SMFengshui.nameFor(fresh[0]) + '</h2>' +
          '<p class="detail-desc">' + window.SMFengshui.hintFor(fresh[0]) + '</p>',
          [{ label: '幾好喎', cls: 'btn-primary', act: null }]);
      }
      return;
    }

    if (!existing) return;
    var p = S.productIndex[existing.id];
    S.modal(
      '<div class="detail-glyph" aria-hidden="true">' + p.emoji + '</div>' +
      '<h2 style="text-align:center">' + p.name + '</h2>',
      [
        { label: '轉個方向', cls: '', act: function () {
            existing.rot = ((existing.rot || 0) + 90) % 360;
            S.save(); S.closeModal(); S.render();
          } },
        { label: '收返儲物櫃', cls: 'btn-pink', act: function () {
            r.furniture = r.furniture.filter(function (f) { return f !== existing; });
            S.state.inventory[existing.id] = (S.state.inventory[existing.id] || 0) + 1;
            S.ui.lastFs = window.SMFengshui.evaluate(S.state.home.rooms.main, S.productIndex);
            S.save(); S.closeModal(); S.render();
          } },
      ]
    );
  }

  // ── 儲物櫃 ───────────────────────────────────────────────────────────────
  function capacity() {
    var n = (S.state.expansions || []).length;
    return n >= 3 ? 99 : [20, 40, 60][n] || 20;
  }

  function renderLocker(root) {
    var ids = Object.keys(S.state.inventory).filter(function (id) { return S.state.inventory[id] > 0; });
    var used = ids.reduce(function (n, id) { return n + S.state.inventory[id]; }, 0);

    var slots = ids.map(function (id) {
      var p = S.productIndex[id];
      if (!p) return '';
      var placeable = p.kind === 'furniture';
      return '<button class="slot" data-pick="' + id + '" ' +
        'aria-label="' + p.name + '，有 ' + S.state.inventory[id] + ' 件' +
        (placeable ? '，撳一下攞去擺' : '，收藏品') + '">' +
        '<span aria-hidden="true">' + p.emoji + '</span>' +
        '<span class="n">×' + S.state.inventory[id] + '</span></button>';
    }).join('');

    root.innerHTML =
      '<div class="page-head"><div class="icon" aria-hidden="true">🗄️</div><h1>儲物櫃</h1>' +
      '<p class="sub">' + used + ' / ' + capacity() + ' 格</p></div>' +
      (ids.length ? '<div class="locker-grid">' + slots + '</div>'
                  : '<p class="empty">儲物櫃而家係空嘅。<br>去超市行下，見到鍾意嘅買返嚟。</p>') +
      '<div class="room-toolbar" style="margin-top:18px">' +
      '<button class="btn" data-nav="home">🏠 返屋企</button>' +
      '<button class="btn" data-nav="shop">🛒 去超市</button></div>';

    root.querySelectorAll('[data-pick]').forEach(function (b) {
      b.addEventListener('click', function () {
        var id = b.dataset.pick;
        var p = S.productIndex[id];
        if (p.kind !== 'furniture') {
          S.modal('<div class="detail-glyph" aria-hidden="true">' + p.emoji + '</div>' +
            '<h2 style="text-align:center">' + p.name + '</h2>' +
            '<p class="detail-desc">' + p.desc + '</p>' +
            '<p class="detail-meta">收藏品，擺唔入房，但幾靚吖。</p>',
            [{ label: '知道喇', cls: 'btn-primary', act: null }]);
          return;
        }
        S.ui.holding = id;
        S.go('home');
      });
    });
    root.querySelectorAll('[data-nav]').forEach(function (b) {
      b.addEventListener('click', function () { S.go(b.dataset.nav); });
    });
  }

  // ── 擴建 ─────────────────────────────────────────────────────────────────
  function renderExpand(root) {
    var rows = EXPANSIONS.map(function (e) {
      var done = S.state.expansions.indexOf(e.id) >= 0;
      var afford = window.SMEconomy.canAfford(S.state, e.cost);
      return '<div class="expand-row"><span class="info">' +
        '<span class="t">' + e.name + '</span>' +
        '<span class="p">🪙 ' + window.SMEconomy.format(e.cost) + '</span></span>' +
        (done ? '<span class="done">已完成</span>'
              : '<button class="btn ' + (afford ? 'btn-primary' : '') + '" data-ex="' + e.id + '"' +
                (afford ? '' : ' disabled') + '>' + (afford ? '擴建' : '未夠') + '</button>') +
        '</div>';
    }).join('');

    root.innerHTML =
      '<div class="page-head"><div class="icon" aria-hidden="true">🧱</div><h1>擴建屋企</h1>' +
      '<p class="sub">冇時限，儲夠先嚟，唔急。</p></div>' + rows +
      '<p class="cart-note" style="margin-top:14px">溫多陣書先啦，唔急，呢啲嘢會等你。</p>' +
      '<div class="room-toolbar" style="margin-top:8px">' +
      '<button class="btn" data-nav="home">🏠 返屋企</button></div>';

    root.querySelectorAll('[data-ex]').forEach(function (b) {
      b.addEventListener('click', function () {
        var e = EXPANSIONS.filter(function (E) { return E.id === b.dataset.ex; })[0];
        if (!e || !window.SMEconomy.spend(S.state, e.cost)) return;
        e.apply(S.state.home);
        S.state.expansions.push(e.id);
        var bonus = S.state.expansions.length === 1 ? window.SMEconomy.EARN.firstExpand : 0;
        if (bonus) window.SMEconomy.grant(S.state, bonus);
        S.save();
        window.SMAudio.success();
        S.closeModal();
        S.modal('<h2>🎉 擴建完成</h2><p class="detail-desc">' + e.name + '</p>' +
          (bonus ? '<p class="cha-reward">首次擴建獎勵 🪙 ' + bonus + '</p>' : ''),
          [{ label: '入去睇下', cls: 'btn-primary', act: function () { S.go('home'); } }]);
      });
    });
    root.querySelectorAll('[data-nav]').forEach(function (b) {
      b.addEventListener('click', function () { S.go(b.dataset.nav); });
    });
  }

  window.SMHome = {
    EXPANSIONS: EXPANSIONS,
    renderHome: renderHome,
    renderLocker: renderLocker,
    renderExpand: renderExpand,
    capacity: capacity,
  };
})();
