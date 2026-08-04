/* fengshui.js — 風水擺設（spec §4.3.4）
 *
 * 純心情 Buff：只影響超市內嘅小額入場獎勵同視覺提示，
 * 【絕對唔影響】任何真實溫習數據、成績、等級預測。
 * 只睇主房間（進門第一間）。
 */
(function () {
  'use strict';

  // 家具 series → 色系。用 series 而唔用「顏色」欄，因為家具本身冇染色系統時
  // 亦要判得到；日後加改色功能再擴充呢張表。
  var TINT = {
    plant: 'green',
    light: 'yellow',
    fabric: 'red',
    wood: 'wood',
    metal: 'metal',
  };

  var ZONES = [
    { id: 'luck', name: '小確幸', tint: 'yellow', cls: 'fs-luck',
      hint: '左邊嗰行擺咗發光嘅嘢，聽日入嚟會多一點點好事㗎～' },
    { id: 'warm', name: '好運氣', tint: 'red', cls: 'fs-warm',
      hint: '右邊嗰行有暖色布藝，成間房即刻柔和咗。' },
    { id: 'calm', name: '心平靜', tint: 'green', cls: 'fs-calm',
      hint: '對住門嗰面擺咗綠色植物，望落好舒服。' },
  ];

  /** 某格屬邊個風水區？（靠牆兩格） */
  function zoneOf(x, y, size) {
    if (x <= 1) return 'luck';                 // 左側靠牆兩格
    if (x >= size - 2) return 'warm';          // 右側靠牆兩格
    if (y <= 1) return 'calm';                 // 正門對面靠牆兩格
    return null;
  }

  /** 回傳已達成嘅 zone id 陣列。 */
  function evaluate(room, productIndex) {
    if (!room || !Array.isArray(room.furniture)) return [];
    var hit = {};
    room.furniture.forEach(function (f) {
      var p = productIndex[f.id];
      if (!p) return;
      var tint = TINT[p.series];
      var z = zoneOf(f.x, f.y, room.size);
      if (!z) return;
      var zone = ZONES.filter(function (Z) { return Z.id === z; })[0];
      if (zone && zone.tint === tint) hit[z] = true;
    });
    return Object.keys(hit);
  }

  function zoneClassFor(x, y, size, activeIds) {
    var z = zoneOf(x, y, size);
    if (!z || activeIds.indexOf(z) === -1) return '';
    var zone = ZONES.filter(function (Z) { return Z.id === z; })[0];
    return zone ? zone.cls : '';
  }

  function hintFor(id) {
    var z = ZONES.filter(function (Z) { return Z.id === id; })[0];
    return z ? z.hint : '';
  }

  function nameFor(id) {
    var z = ZONES.filter(function (Z) { return Z.id === id; })[0];
    return z ? z.name : '';
  }

  window.SMFengshui = {
    ZONES: ZONES,
    zoneOf: zoneOf,
    evaluate: evaluate,
    zoneClassFor: zoneClassFor,
    hintFor: hintFor,
    nameFor: nameFor,
  };
})();
