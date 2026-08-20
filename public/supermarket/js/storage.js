/* storage.js — 單一 localStorage 鍵 `dse-supermarket-v2`（spec §5.1 / §5.2）
 *
 * 匿名：首次進入自動生成 anon_ ID，唔綁任何真實身份、唔上傳、唔追蹤。
 * 容錯：任何解析失敗一律回落預設，永不拋錯入 UI。
 */
(function () {
  'use strict';

  var KEY = 'dse-supermarket-v2';

  function randomHex(n) {
    var out = '';
    var bytes = new Uint8Array(Math.ceil(n / 2));
    (window.crypto || window.msCrypto).getRandomValues(bytes);
    for (var i = 0; i < bytes.length; i++) out += bytes[i].toString(16).padStart(2, '0');
    return out.slice(0, n);
  }

  function defaults() {
    return {
      anonId: 'anon_' + randomHex(14),
      coins: 0,
      inventory: {},               // { productId: qty }
      home: {
        rooms: { main: { size: 6, furniture: [] } },
        unlocked: ['main'],
        floor: 'wood',
      },
      expansions: [],              // 已購擴建 id
      cha: { level: null, lastRated: null },
      materials: { wood: 0, paper: 0, inspiration: 0 },
      settings: { sen: false, hc: false, sound: true },
      log: {
        lastOpenDay: null,         // YYYY-MM-DD，每日首次開啟獎勵用
        openDays: [],              // 最近開啟日（連續 3 日獎勵用，最多留 10 個）
        lastRewardedAttemptTs: 0,  // 已派幣嘅最新一筆練習時間戳
        firstOrderDone: false,
      },
    };
  }

  function load() {
    var base = defaults();
    try {
      var raw = localStorage.getItem(KEY);
      if (!raw) return base;
      var p = JSON.parse(raw);
      if (!p || typeof p !== 'object') return base;
      // 逐層合併，舊版資料缺欄位時用預設補（向後兼容）
      return {
        anonId: typeof p.anonId === 'string' ? p.anonId : base.anonId,
        coins: Number.isFinite(p.coins) ? Math.max(0, Math.floor(p.coins)) : 0,
        inventory: p.inventory && typeof p.inventory === 'object' ? p.inventory : {},
        home: Object.assign({}, base.home, p.home || {}),
        expansions: Array.isArray(p.expansions) ? p.expansions : [],
        cha: Object.assign({}, base.cha, p.cha || {}),
        materials: Object.assign({}, base.materials, p.materials || {}),
        settings: Object.assign({}, base.settings, p.settings || {}),
        log: Object.assign({}, base.log, p.log || {}),
      };
    } catch {
      return base;
    }
  }

  function save(state) {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* 配額滿：靜默降級。呢度係減壓區，唔應該彈錯誤嚇親人。 */
    }
  }

  // 導出／導入備份碼（spec §5.2）。用 Base64 包住 JSON，純本機，唔經網絡。
  function exportCode(state) {
    try {
      return btoa(unescape(encodeURIComponent(JSON.stringify(state))));
    } catch { return ''; }
  }
  function importCode(code) {
    try {
      var json = decodeURIComponent(escape(atob(String(code).trim())));
      var parsed = JSON.parse(json);
      return parsed && typeof parsed === 'object' ? parsed : null;
    } catch { return null; }
  }

  window.SMStore = {
    KEY: KEY,
    load: load,
    save: save,
    defaults: defaults,
    exportCode: exportCode,
    importCode: importCode,
  };
})();
