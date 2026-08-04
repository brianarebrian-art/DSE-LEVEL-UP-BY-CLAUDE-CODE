/* economy.js — 溫習幣（spec §4.1）
 *
 * 完全閉環：只可經平台內行為賺取，冇充值、冇兌換、冇轉讓、冇真實貨幣。
 *
 * 「完成一節溫習 +100」嘅資料來源：主平台 localStorage `dse_progress`
 * （AttemptRecord[]，每筆有 timestamp）。同源共用 storage，所以唔使 postMessage
 * （spec §5.2 禁 postMessage，此處遵守）。只補發「上次派幣之後」嘅新紀錄，
 * 唔會重複派、唔會回溯派舊帳。
 */
(function () {
  'use strict';

  var EARN = {
    dailyOpen: 50,
    streak3: 200,
    session: 100,
    firstExpand: 500,
    chaRate: 100,
    chaLevelUp: 300,
    fengshuiLuck: 10, // 風水「小確幸」：每日首次開啟額外
  };

  function todayKey() {
    var d = new Date();
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') +
           '-' + String(d.getDate()).padStart(2, '0');
  }

  function dayBefore(key, n) {
    var p = key.split('-');
    var d = new Date(Number(p[0]), Number(p[1]) - 1, Number(p[2]));
    d.setDate(d.getDate() - n);
    return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') +
           '-' + String(d.getDate()).padStart(2, '0');
  }

  /** 讀主平台練習紀錄。任何失敗一律當冇紀錄 —— 超市唔可以因為主平台資料壞咗而爛。 */
  function readAttempts() {
    try {
      var raw = localStorage.getItem('dse_progress');
      if (!raw) return [];
      var arr = JSON.parse(raw);
      return Array.isArray(arr) ? arr : [];
    } catch (e) { return []; }
  }

  /**
   * 結算入場獎勵。純計算 + 回傳明細，由呼叫方決定點顯示。
   * @returns {{total:number, lines:Array<{label:string, amount:number}>}}
   */
  function settleOnEnter(state, hasLuckBuff) {
    var lines = [];
    var today = todayKey();

    if (state.log.lastOpenDay !== today) {
      lines.push({ label: '今日嚟到已經好叻', amount: EARN.dailyOpen });
      if (hasLuckBuff) {
        lines.push({ label: '「小確幸」擺設', amount: EARN.fengshuiLuck });
      }

      var days = Array.isArray(state.log.openDays) ? state.log.openDays.slice() : [];
      if (days.indexOf(today) === -1) days.push(today);
      days = days.slice(-10);
      // 連續 3 日：只喺「啱啱儲夠 3 日」嗰日派一次。斷咗就由頭計，
      // 但畫面【永遠唔會顯示斷咗幾多日】—— 唔製造歸零壓力。
      if (days.indexOf(dayBefore(today, 1)) !== -1 && days.indexOf(dayBefore(today, 2)) !== -1) {
        lines.push({ label: '連續三日嚟過', amount: EARN.streak3 });
      }
      state.log.openDays = days;
      state.log.lastOpenDay = today;
    }

    // 補發新練習紀錄（每節一份，唔理對錯，唔理分數）
    var since = Number(state.log.lastRewardedAttemptTs) || 0;
    var fresh = readAttempts().filter(function (a) {
      return a && Number(a.timestamp) > since && Number(a.total) > 1;
    });
    if (fresh.length) {
      var newest = fresh.reduce(function (m, a) { return Math.max(m, Number(a.timestamp)); }, since);
      state.log.lastRewardedAttemptTs = newest;
      lines.push({
        label: fresh.length === 1 ? '完成咗一節溫習' : '完成咗 ' + fresh.length + ' 節溫習',
        amount: EARN.session * fresh.length,
      });
    }

    var total = lines.reduce(function (s, l) { return s + l.amount; }, 0);
    state.coins += total;
    return { total: total, lines: lines };
  }

  function canAfford(state, cost) { return state.coins >= cost; }

  function spend(state, cost) {
    if (!canAfford(state, cost)) return false;
    state.coins -= cost;
    return true;
  }

  function grant(state, amount) {
    state.coins += Math.max(0, Math.floor(amount));
  }

  function format(n) { return String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ','); }

  window.SMEconomy = {
    EARN: EARN,
    todayKey: todayKey,
    settleOnEnter: settleOnEnter,
    canAfford: canAfford,
    spend: spend,
    grant: grant,
    format: format,
  };
})();
