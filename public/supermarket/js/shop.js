/* shop.js — 選貨、商品詳情、購物車、支付（spec §4.2） */
(function () {
  'use strict';

  var S = window.SM; // 由 main.js 注入嘅共享 app 物件

  function coinText(n) { return '🪙 ' + window.SMEconomy.format(n); }

  // ── 逛超市 ───────────────────────────────────────────────────────────────
  function renderShop(root) {
    var cats = window.SM_CATEGORIES;
    var q = S.ui.query.trim().toLowerCase();
    var list = window.SM_PRODUCTS.filter(function (p) {
      if (S.ui.cat !== 'all' && p.cat !== S.ui.cat) return false;
      if (!q) return true;
      return p.name.toLowerCase().indexOf(q) >= 0 || p.desc.toLowerCase().indexOf(q) >= 0;
    });

    var chips = cats.map(function (c) {
      return '<button class="chip" data-cat="' + c.id + '" aria-pressed="' +
        (S.ui.cat === c.id) + '">' + c.name + '</button>';
    }).join('');

    var cards = list.map(function (p) {
      var owned = S.state.inventory[p.id] || 0;
      return '<button class="card" data-open="' + p.id + '" aria-label="睇下：' + p.name + '">' +
        '<span class="glyph" aria-hidden="true">' + p.emoji + '</span>' +
        '<span class="name">' + p.name + '</span>' +
        '<span class="desc">' + p.desc + '</span>' +
        '<span class="price">' + (p.coin === 0 ? '免費' : coinText(p.coin)) + '</span>' +
        (owned ? '<span class="owned">已有 ' + owned + '</span>' : '') +
        '</button>';
    }).join('');

    root.innerHTML =
      '<div class="page-head">' +
        '<div class="icon" aria-hidden="true">🛒</div>' +
        '<h1>虛擬超市</h1>' +
        '<p class="lede">溫書溫到攰，入嚟行陣、買嘢、砌屋。</p>' +
      '</div>' +
      '<div class="chips" role="group" aria-label="商品分類">' + chips + '</div>' +
      (list.length
        ? '<div class="grid">' + cards + '</div>'
        : '<p class="empty">搵唔到喎，試下第二個字？</p>');

    root.querySelectorAll('[data-cat]').forEach(function (b) {
      b.addEventListener('click', function () { S.ui.cat = b.dataset.cat; S.render(); });
    });
    root.querySelectorAll('[data-open]').forEach(function (b) {
      b.addEventListener('click', function () { openDetail(b.dataset.open); });
    });
  }

  // ── 商品詳情 ─────────────────────────────────────────────────────────────
  function openDetail(id) {
    var p = S.productIndex[id];
    if (!p) return;
    var slotText = p.kind === 'furniture'
      ? '家具 · 佔 ' + p.w + '×' + p.h + ' 格 · ' +
        ({ floor: '放地面', wall: '掛牆', ceiling: '裝天花' }[p.slot] || '')
      : '食品日用 · 買咗會入儲物櫃收藏';

    S.modal(
      '<div class="detail-glyph" aria-hidden="true">' + p.emoji + '</div>' +
      '<h2 style="text-align:center">' + p.name + '</h2>' +
      '<p class="detail-price">' + (p.coin === 0 ? '免費' : coinText(p.coin)) + '</p>' +
      '<p class="detail-desc">' + p.desc + '</p>' +
      '<p class="detail-meta">' + slotText + '</p>',
      [
        { label: '加入購物車', cls: 'btn-primary', act: function () { addToCart(p.id); } },
        { label: '再睇下', cls: '', act: null },
      ]
    );
  }

  function addToCart(id) {
    S.cart[id] = (S.cart[id] || 0) + 1;
    window.SMAudio.ding();
    S.closeModal();
    S.toast('已加入購物車');
    S.render();
  }

  // ── 購物車 ───────────────────────────────────────────────────────────────
  function cartTotal() {
    return Object.keys(S.cart).reduce(function (sum, id) {
      var p = S.productIndex[id];
      return sum + (p ? p.coin * S.cart[id] : 0);
    }, 0);
  }

  function cartCount() {
    return Object.keys(S.cart).reduce(function (n, id) { return n + S.cart[id]; }, 0);
  }

  function renderCart(root) {
    var ids = Object.keys(S.cart);
    var total = cartTotal();
    var afford = window.SMEconomy.canAfford(S.state, total);

    var rows = ids.map(function (id) {
      var p = S.productIndex[id];
      if (!p) return '';
      return '<div class="cart-row">' +
        '<span class="glyph" aria-hidden="true">' + p.emoji + '</span>' +
        '<span class="info"><span class="name">' + p.name + '</span>' +
        '<span class="unit">' + coinText(p.coin) + ' × ' + S.cart[id] + '</span></span>' +
        '<span class="qty">' +
          '<button data-dec="' + id + '" aria-label="減少 ' + p.name + '">−</button>' +
          '<span aria-live="polite">' + S.cart[id] + '</span>' +
          '<button data-inc="' + id + '" aria-label="增加 ' + p.name + '">＋</button>' +
        '</span></div>';
    }).join('');

    root.innerHTML =
      '<div class="page-head"><div class="icon" aria-hidden="true">🧺</div><h1>購物車</h1></div>' +
      (ids.length ? rows +
        '<div class="cart-total"><span>總計</span><span class="amount">' + coinText(total) + '</span></div>' +
        (afford
          ? '<button class="btn btn-primary" data-pay style="width:100%">去支付</button>'
          : '<button class="btn" disabled style="width:100%">去支付</button>' +
            '<p class="cart-note">溫多陣書先啦，唔急，呢啲嘢會等你。</p>')
        : '<p class="empty">購物車而家係空嘅。<br>返去行下，見到鍾意嘅加入嚟。</p>');

    root.querySelectorAll('[data-inc]').forEach(function (b) {
      b.addEventListener('click', function () { S.cart[b.dataset.inc]++; S.render(); });
    });
    root.querySelectorAll('[data-dec]').forEach(function (b) {
      b.addEventListener('click', function () {
        var id = b.dataset.dec;
        S.cart[id]--;
        if (S.cart[id] <= 0) delete S.cart[id];
        S.render();
      });
    });
    var pay = root.querySelector('[data-pay]');
    if (pay) pay.addEventListener('click', confirmPay);
  }

  function confirmPay() {
    var total = cartTotal();
    S.modal(
      '<h2>確認一下</h2><p class="detail-desc">用 ' + coinText(total) + ' 買呢 ' +
      cartCount() + ' 件嘢？</p>',
      [
        { label: '確定', cls: 'btn-primary', act: doPay },
        { label: '再諗下', cls: '', act: null },
      ]
    );
  }

  function doPay() {
    var total = cartTotal();
    if (!window.SMEconomy.spend(S.state, total)) { S.closeModal(); return; }
    var bought = Object.assign({}, S.cart);
    S.cart = {};
    S.closeModal();
    window.SMAudio.success();
    S.save();
    window.SMDelivery.start(bought);
  }

  window.SMShop = {
    renderShop: renderShop,
    renderCart: renderCart,
    cartCount: cartCount,
  };
})();
