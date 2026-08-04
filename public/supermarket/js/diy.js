/* diy.js — DIY 製作（spec §4.3.8）
 * 材料來源：每日首次入超市 +3 木材、買食品 +1 包裝紙、CHA 評分 +2 靈感碎片。
 */
(function () {
  'use strict';

  var S = window.SM;

  var RECIPES = [
    { out: 'fn_stool',  name: '紙皮小凳',  need: { paper: 2, wood: 1 }, desc: '環保又實用，人人都砌得起。' },
    { out: 'fn_desk',   name: '溫習小桌',  need: { wood: 4 },           desc: '最基礎嘅溫習裝備，見證你每一晚。' },
    { out: 'fn_neon1',  name: '霓虹燈牌',  need: { inspiration: 3, wood: 2 }, desc: '自己寫嘅金句，掛喺牆上發光。' },
    { out: 'fn_plant1', name: '仙人掌盆栽', need: { wood: 2, paper: 1 }, desc: '唔使點淋水，好夾你。' },
  ];

  var MAT_NAME = { wood: '木材', paper: '包裝紙', inspiration: '靈感碎片' };

  function has(need) {
    return Object.keys(need).every(function (k) { return (S.state.materials[k] || 0) >= need[k]; });
  }

  function needText(need) {
    return Object.keys(need).map(function (k) {
      return MAT_NAME[k] + ' ×' + need[k];
    }).join(' ＋ ');
  }

  function render(root) {
    var m = S.state.materials;
    var rows = RECIPES.map(function (r) {
      var ok = has(r.need);
      var p = S.productIndex[r.out];
      return '<div class="expand-row"><span class="glyph" aria-hidden="true" style="font-size:24px">' +
        (p ? p.emoji : '🔨') + '</span><span class="info">' +
        '<span class="t">' + r.name + '</span>' +
        '<span class="p">' + needText(r.need) + '</span>' +
        '<span class="caption">' + r.desc + '</span></span>' +
        '<button class="btn ' + (ok ? 'btn-primary' : '') + '" data-make="' + r.out + '"' +
        (ok ? '' : ' disabled') + '>' + (ok ? '砌' : '未夠材料') + '</button></div>';
    }).join('');

    root.innerHTML =
      '<div class="page-head"><div class="icon" aria-hidden="true">🔨</div><h1>DIY 工作台</h1>' +
      '<p class="sub">木材 ' + (m.wood || 0) + ' · 包裝紙 ' + (m.paper || 0) +
      ' · 靈感碎片 ' + (m.inspiration || 0) + '</p></div>' + rows +
      '<div class="room-toolbar" style="margin-top:18px">' +
      '<button class="btn" data-nav="home">🏠 返屋企</button></div>';

    root.querySelectorAll('[data-make]').forEach(function (b) {
      b.addEventListener('click', function () {
        var r = RECIPES.filter(function (R) { return R.out === b.dataset.make; })[0];
        if (!r || !has(r.need)) return;
        Object.keys(r.need).forEach(function (k) { S.state.materials[k] -= r.need[k]; });
        S.state.inventory[r.out] = (S.state.inventory[r.out] || 0) + 1;
        S.save();
        window.SMAudio.place();
        S.toast('砌好咗！已放入儲物櫃');
        S.render();
      });
    });
    root.querySelectorAll('[data-nav]').forEach(function (b) {
      b.addEventListener('click', function () { S.go(b.dataset.nav); });
    });
  }

  window.SMDiy = { RECIPES: RECIPES, render: render };
})();
