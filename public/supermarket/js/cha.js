/* cha.js — 溫馨家協會評分（spec §4.3.5）
 *
 * 全部係加分，冇任何扣分項；最低等級評語一樣係鼓勵。
 * 只顯示等級同評語，【刻意唔顯示具體分數】——減少數字焦慮。
 */
(function () {
  'use strict';

  var LEVELS = [
    { min: 0,   emoji: '🌱', name: '萌芽', words: '你嘅小窩開始有溫度啦，繼續慢慢砌～' },
    { min: 51,  emoji: '🌿', name: '成長', words: '越嚟越有風格，你嘅品味好獨特！' },
    { min: 101, emoji: '🌳', name: '茂盛', words: '入嚟就覺得好舒服，你係砌屋天才！' },
    { min: 201, emoji: '🏠', name: '溫馨', words: '呢個家充滿咗你嘅回憶，好正！' },
    { min: 301, emoji: '⭐', name: '夢幻', words: '傳說級嘅舒適空間！你值得驕傲。' },
  ];

  var WEEK_MS = 7 * 24 * 60 * 60 * 1000;

  function score(state, productIndex, fengshuiIds) {
    var s = 0;
    // 擴建程度
    s += Math.min(50, (state.expansions || []).length * 10);
    // 家具數量（每件 +5，上限 100）
    var placed = [];
    Object.keys(state.home.rooms || {}).forEach(function (k) {
      placed = placed.concat(state.home.rooms[k].furniture || []);
    });
    s += Math.min(100, placed.length * 5);
    // 風格統一性：同一 series ≥3 件 → +20
    var bySeries = {};
    placed.forEach(function (f) {
      var p = productIndex[f.id];
      if (p && p.series) bySeries[p.series] = (bySeries[p.series] || 0) + 1;
    });
    if (Object.keys(bySeries).some(function (k) { return bySeries[k] >= 3; })) s += 20;
    // 基本生活機能：床 / 桌 / 椅 / 衣櫃
    var ids = placed.map(function (f) { return f.id; });
    var basics = ['fn_bed1', 'fn_bed2', 'fn_desk', 'fn_chair', 'fn_wardrobe'];
    var hasBed = ids.indexOf('fn_bed1') >= 0 || ids.indexOf('fn_bed2') >= 0;
    var others = basics.slice(2).filter(function (b) { return ids.indexOf(b) >= 0; }).length;
    if (hasBed && others >= 3) s += 30;
    // 風水佈局：每個達成方位 +15
    s += (fengshuiIds || []).length * 15;
    // 創意加分：家具種類數 ≥8
    if (Object.keys(bySeries).length >= 3 && new Set(ids).size >= 8) s += 10;
    return s;
  }

  function levelFor(s) {
    var out = LEVELS[0];
    for (var i = 0; i < LEVELS.length; i++) if (s >= LEVELS[i].min) out = LEVELS[i];
    return out;
  }

  function isDue(state) {
    if (!state.cha || !state.cha.lastRated) return true;
    return Date.now() - Number(state.cha.lastRated) >= WEEK_MS;
  }

  function nextDueText(state) {
    if (!state.cha || !state.cha.lastRated) return '';
    var left = WEEK_MS - (Date.now() - Number(state.cha.lastRated));
    if (left <= 0) return '';
    var days = Math.ceil(left / (24 * 60 * 60 * 1000));
    return '下次評分：大約 ' + days + ' 日後';
  }

  window.SMCha = {
    LEVELS: LEVELS,
    score: score,
    levelFor: levelFor,
    isDue: isDue,
    nextDueText: nextDueText,
  };
})();
